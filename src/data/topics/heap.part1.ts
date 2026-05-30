import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  {
    id: "heap-01",
    title: "Kth Largest Element in a Stream",
    difficulty: "Easy",
    tags: ["Heap", "Design", "Stream"],
    statement: "Design a class that finds the kth largest element in a stream. Implement KthLargest(k, nums) constructor and add(val) which returns the kth largest element after adding val.",
    examples: [
      { input: "k=3, nums=[4,5,8,2], add(3)->add(5)->add(10)->add(9)->add(4)", output: "4,5,5,8,8", explanation: "A min-heap of size k always keeps the k largest; its top is the kth largest." },
    ],
    intuition: "Keep a small pile of only the k biggest numbers seen so far. The pile always hands you the smallest of those k numbers — which is exactly the kth largest overall.",
    approach: [
      "Maintain a min-heap of size at most k.",
      "On construction, push all nums; pop until heap size == k.",
      "On add(val): push val; if heap size > k pop the minimum.",
      "Return heap top (the kth largest).",
    ],
    solution: `class MinHeap {
  constructor() { this.h = []; }
  push(v) {
    this.h.push(v);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] <= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]]; i = p;
    }
  }
  pop() {
    const top = this.h[0];
    const last = this.h.pop();
    if (this.h.length) {
      this.h[0] = last; let i = 0;
      while (true) {
        let s = i, l = 2*i+1, r = 2*i+2;
        if (l < this.h.length && this.h[l] < this.h[s]) s = l;
        if (r < this.h.length && this.h[r] < this.h[s]) s = r;
        if (s === i) break;
        [this.h[s], this.h[i]] = [this.h[i], this.h[s]]; i = s;
      }
    }
    return top;
  }
  peek() { return this.h[0]; }
  size() { return this.h.length; }
}

class KthLargest {
  constructor(k, nums) {
    this.k = k; this.heap = new MinHeap();
    for (const n of nums) this.add(n);
  }
  add(val) {
    this.heap.push(val);
    if (this.heap.size() > this.k) this.heap.pop();
    return this.heap.peek();
  }
}`,
    language: "javascript",
    complexity: { time: "O(log k) per add", space: "O(k)" },
    systemDesign: "Real-time leaderboards (top-k players) use an in-memory bounded min-heap per partition; only k entries are retained, giving O(log k) updates regardless of stream volume. This bounded-memory pattern is standard in streaming analytics (Flink, Spark Streaming) for top-k without materialising the full dataset.",
  },
  {
    id: "heap-02",
    title: "Last Stone Weight",
    difficulty: "Easy",
    tags: ["Heap", "Array", "Greedy"],
    statement: "You have stones with positive integer weights. Each turn smash the two heaviest: if equal both are destroyed; otherwise the difference remains. Return the weight of the last stone or 0.",
    examples: [
      { input: "stones = [2,7,4,1,8,1]", output: "1", explanation: "Smash 8&7->1, then 2&4->2, then 2&1->1, then 1&1->0, last is 1." },
    ],
    intuition: "Imagine always pulling the two biggest rocks from a pile, smashing them, and tossing back any leftover. A max-heap is like a magic pile that always gives you the biggest rock on top.",
    approach: [
      "Build a max-heap from all stones.",
      "While heap size > 1: pop two largest a and b.",
      "If a != b push (a - b) back.",
      "Return heap top or 0 if empty.",
    ],
    solution: `function lastStoneWeight(stones) {
  // Simulate max-heap via negated min-heap
  const h = new MinHeap();
  for (const s of stones) h.push(-s);
  while (h.size() > 1) {
    const a = -h.pop(), b = -h.pop();
    if (a !== b) h.push(-(a - b));
  }
  return h.size() ? -h.peek() : 0;
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) {
    this.h.push(v); let i = this.h.length - 1;
    while (i > 0) { const p=(i-1)>>1; if(this.h[p]<=this.h[i]) break; [this.h[p],this.h[i]]=[this.h[i],this.h[p]]; i=p; }
  }
  pop() {
    const top=this.h[0], last=this.h.pop();
    if(this.h.length){ this.h[0]=last; let i=0;
      while(true){ let s=i,l=2*i+1,r=2*i+2;
        if(l<this.h.length&&this.h[l]<this.h[s])s=l;
        if(r<this.h.length&&this.h[r]<this.h[s])s=r;
        if(s===i)break; [this.h[s],this.h[i]]=[this.h[i],this.h[s]]; i=s; } }
    return top;
  }
  peek(){ return this.h[0]; }
  size(){ return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Greedy collision/merge loops appear in Huffman coding (file compression) and LSM-tree compaction: always merge the two smallest runs first to minimise write amplification, mirroring this stone-smashing pattern.",
  },
  {
    id: "heap-03",
    title: "Relative Ranks",
    difficulty: "Easy",
    tags: ["Heap", "Array", "Sorting"],
    statement: "Given scores of n athletes, return their ranks as strings: 1st -> 'Gold Medal', 2nd -> 'Silver Medal', 3rd -> 'Bronze Medal', rest -> their rank number as a string.",
    examples: [
      { input: "score = [5,4,3,2,1]", output: '["Gold Medal","Silver Medal","Bronze Medal","4","5"]' },
    ],
    intuition: "Sort the scores from highest to lowest, then hand out medals in order. We just need to remember each score's original position so we can put the label in the right slot.",
    approach: [
      "Pair each score with its original index.",
      "Sort pairs descending by score.",
      "Walk the sorted list; assign medal strings for ranks 1-3, number strings for the rest.",
      "Place each label at the original index in the result array.",
    ],
    solution: `function findRelativeRanks(score) {
  const medals = ["Gold Medal", "Silver Medal", "Bronze Medal"];
  const sorted = score.map((s, i) => [s, i]).sort((a, b) => b[0] - a[0]);
  const res = new Array(score.length);
  for (let r = 0; r < sorted.length; r++) {
    res[sorted[r][1]] = r < 3 ? medals[r] : String(r + 1);
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Leaderboard ranking in games uses a sorted set (Redis ZSET) to assign ranks in O(log n) per update; the medal-assignment step maps directly to rank-to-label lookups used in reporting dashboards.",
  },
  {
    id: "heap-04",
    title: "Minimum Cost to Connect Sticks",
    difficulty: "Easy",
    tags: ["Heap", "Greedy"],
    statement: "You have sticks with given lengths. Connecting two sticks of lengths x and y costs x+y and produces a stick of length x+y. Return the minimum total cost to connect all sticks into one.",
    examples: [
      { input: "sticks = [2,4,3]", output: "14", explanation: "Connect 2+3=5 (cost 5), then 4+5=9 (cost 9). Total 14." },
    ],
    intuition: "Always combine the two shortest sticks first, like saving the heaviest lifting for last. A min-heap automatically hands you the two smallest each time.",
    approach: [
      "Push all sticks into a min-heap.",
      "While heap size > 1: pop two smallest, sum them, add to total cost, push sum back.",
      "Return total cost.",
    ],
    solution: `function connectSticks(sticks) {
  const h = new MinHeap();
  for (const s of sticks) h.push(s);
  let cost = 0;
  while (h.size() > 1) {
    const a = h.pop(), b = h.pop();
    cost += a + b;
    h.push(a + b);
  }
  return cost;
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p]<=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a]<this.h[s])s=a;if(b<this.h.length&&this.h[b]<this.h[s])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "This is Huffman coding's core loop — used in gzip/deflate to build optimal prefix-free codes, minimising total encoded length. The same greedy min-heap merge is used in LSM compaction to minimise total bytes rewritten.",
  },
  {
    id: "heap-05",
    title: "Take Gifts From the Richest Pile",
    difficulty: "Easy",
    tags: ["Heap", "Array", "Simulation"],
    statement: "You have piles of gifts. Each second you take gifts from the richest pile, leaving floor(sqrt(pile)) gifts. After k seconds return the total gifts remaining.",
    examples: [
      { input: "gifts = [25,64,9,4,100], k = 4", output: "29", explanation: "Take from 100->10, 64->8, 25->5, 10->3. Sum = 8+5+3+4+9=29." },
    ],
    intuition: "Always attack the biggest pile — a max-heap keeps the biggest on top so you can grab it instantly each second.",
    approach: [
      "Build a max-heap from gifts.",
      "Repeat k times: pop max, push floor(sqrt(max)) back.",
      "Sum all remaining heap elements.",
    ],
    solution: `function pickGifts(gifts, k) {
  const h = new MaxHeap();
  for (const g of gifts) h.push(g);
  for (let i = 0; i < k; i++) {
    const top = h.pop();
    h.push(Math.floor(Math.sqrt(top)));
  }
  return h.h.reduce((a, b) => a + b, 0);
}

class MaxHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p]>=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a]>this.h[s])s=a;if(b<this.h.length&&this.h[b]>this.h[s])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
}`,
    language: "javascript",
    complexity: { time: "O((n+k) log n)", space: "O(n)" },
    systemDesign: "Rate limiting with token buckets or leaky buckets repeatedly trims the largest burst; the priority queue mirrors how traffic shapers deprioritise the heaviest consumers to protect system capacity.",
  },
  {
    id: "heap-06",
    title: "The K Weakest Rows in a Matrix",
    difficulty: "Easy",
    tags: ["Heap", "Matrix", "Binary Search"],
    statement: "Given an m x n binary matrix where 1s (soldiers) come before 0s in each row, return the indices of the k weakest rows ordered from weakest to strongest. Row strength is the count of soldiers.",
    examples: [
      { input: "mat=[[1,1,0],[1,1,1],[1,0,0],[1,1,0],[1,0,0]], k=3", output: "[2,4,0]", explanation: "Soldier counts: 2,3,1,2,1. Weakest 3 indices: 2,4,0." },
    ],
    intuition: "Count the soldiers in each row, then pick the k smallest counts — like choosing the k lightest boxes from a shelf.",
    approach: [
      "Count soldiers per row (binary search or linear scan).",
      "Use a max-heap of size k: push [count, index].",
      "If heap exceeds size k, pop the strongest.",
      "Extract remaining indices from heap in sorted order.",
    ],
    solution: `function kWeakestRows(mat, k) {
  const strength = mat.map((row, i) => [row.reduce((s, v) => s + v, 0), i]);
  strength.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
  return strength.slice(0, k).map(x => x[1]);
}`,
    language: "javascript",
    complexity: { time: "O(m*n + m log m)", space: "O(m)" },
    systemDesign: "Finding the k least-loaded servers in a cluster uses the same pattern — a bounded min-heap of server load metrics, refreshed on each heartbeat, drives the load balancer's routing table.",
  },
  {
    id: "heap-07",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    tags: ["Heap", "Sorting", "Quickselect"],
    statement: "Given an integer array nums and integer k, return the kth largest element in sorted order (not the kth distinct element).",
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
    ],
    intuition: "Keep a small bucket of only the k biggest numbers. The smallest number in that bucket is the answer — it is bigger than everything outside the bucket.",
    approach: [
      "Maintain a min-heap of size k.",
      "For each number: push it; if size > k, pop the minimum.",
      "After all numbers the heap top is the kth largest.",
    ],
    solution: `function findKthLargest(nums, k) {
  const h = new MinHeap();
  for (const n of nums) {
    h.push(n);
    if (h.size() > k) h.pop();
  }
  return h.peek();
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p]<=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a]<this.h[s])s=a;if(b<this.h.length&&this.h[b]<this.h[s])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  peek() { return this.h[0]; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(n log k)", space: "O(k)" },
    systemDesign: "Top-k queries in analytics pipelines (e.g. 'top 100 pages by views') use a bounded min-heap per reducer in MapReduce — each mapper emits local top-k, reducers merge, achieving sub-linear memory regardless of dataset size.",
    pitfalls: ["A max-heap gives O(n log n) which is worse; always use a min-heap of size k.", "Quickselect is O(n) average but O(n²) worst case without median-of-medians."],
  },
  {
    id: "heap-08",
    title: "K Closest Points to Origin",
    difficulty: "Medium",
    tags: ["Heap", "Math", "Sorting"],
    statement: "Given a list of points on a 2D plane and integer k, return the k points closest to the origin (0,0). Distance is Euclidean; no need to take the square root.",
    examples: [
      { input: "points = [[1,3],[-2,2]], k = 1", output: "[[-2,2]]", explanation: "Squared distances: 10 vs 8. [-2,2] is closer." },
    ],
    intuition: "Imagine measuring how far each dot is from the center. We only care about the k nearest dots, so we keep a bag of at most k dots and throw out the farthest whenever a closer one arrives.",
    approach: [
      "Use a max-heap keyed by squared distance, capped at size k.",
      "For each point: push [dist2, point]; if size > k pop the farthest.",
      "Return all remaining points.",
    ],
    solution: `function kClosest(points, k) {
  // Max-heap by squared distance; keep k smallest
  const h = []; // [dist2, x, y]
  const push = (d, x, y) => {
    h.push([d, x, y]);
    let i = h.length - 1;
    while (i > 0) { const p=(i-1)>>1; if(h[p][0]>=h[i][0])break; [h[p],h[i]]=[h[i],h[p]]; i=p; }
  };
  const pop = () => {
    const t=h[0], l=h.pop();
    if(h.length){ h[0]=l; let i=0;
      while(true){let s=i,a=2*i+1,b=2*i+2;if(a<h.length&&h[a][0]>h[s][0])s=a;if(b<h.length&&h[b][0]>h[s][0])s=b;if(s===i)break;[h[s],h[i]]=[h[i],h[s]];i=s;}}
    return t;
  };
  for (const [x, y] of points) {
    push(x*x + y*y, x, y);
    if (h.length > k) pop();
  }
  return h.map(e => [e[1], e[2]]);
}`,
    language: "javascript",
    complexity: { time: "O(n log k)", space: "O(k)" },
    systemDesign: "Geospatial nearest-neighbor queries in ride-hailing (find k nearest drivers) use a bounded priority queue over a spatial index (R-tree or Geohash bucket); the same max-heap-of-size-k trick limits memory when scanning millions of candidates.",
  },
  {
    id: "heap-09",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    tags: ["Heap", "Hashing", "Bucket Sort"],
    statement: "Given an integer array nums and integer k, return the k most frequent elements. The answer may be returned in any order.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
    ],
    intuition: "First count how often each number appears (like tallying votes). Then grab the k numbers with the highest vote counts — a min-heap of size k keeps the current top-k winners.",
    approach: [
      "Count frequencies with a hash map.",
      "Push [freq, num] into a min-heap; pop when size > k.",
      "Return nums remaining in heap.",
    ],
    solution: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  const h = new MinHeap(); // keyed by frequency
  for (const [num, f] of freq) {
    h.push([f, num]);
    if (h.size() > k) h.pop();
  }
  return h.h.map(e => e[1]);
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p][0]<=this.h[i][0])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a][0]<this.h[s][0])s=a;if(b<this.h.length&&this.h[b][0]<this.h[s][0])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(n log k)", space: "O(n)" },
    systemDesign: "Top-k frequent items underpin trending topics on social platforms and cache eviction policies (LFU cache evicts the least-frequently-used item, maintained via a min-heap of access counts).",
  },
  {
    id: "heap-10",
    title: "Top K Frequent Words",
    difficulty: "Medium",
    tags: ["Heap", "Hashing", "Sorting"],
    statement: "Given a list of words and integer k, return the k most frequent words sorted by frequency descending. Ties broken alphabetically.",
    examples: [
      { input: 'words = ["i","love","leetcode","i","love","coding"], k = 2', output: '["i","love"]' },
    ],
    intuition: "Count each word like tallying votes, then pick the k words with the most votes. When two words tie, pick the one that comes first in the dictionary.",
    approach: [
      "Build a frequency map.",
      "Collect [freq, word] pairs and sort: descending freq, ascending word for ties.",
      "Return first k words.",
    ],
    solution: `function topKFrequent(words, k) {
  const freq = new Map();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] !== a[1] ? b[1] - a[1] : a[0].localeCompare(b[0]))
    .slice(0, k)
    .map(e => e[0]);
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Search engines compute top-k frequent query terms per time window to surface autocomplete suggestions; the frequency map plus bounded sort maps directly to a Count-Min Sketch + heap in high-volume streaming pipelines.",
  },
  {
    id: "heap-11",
    title: "Sort Characters By Frequency",
    difficulty: "Medium",
    tags: ["Heap", "Hashing", "Sorting"],
    statement: "Given a string s, sort it so that characters are ordered by decreasing frequency. If multiple orderings are valid, any is accepted.",
    examples: [
      { input: 's = "tree"', output: '"eert"', explanation: "'e' appears twice, 't' and 'r' once each." },
    ],
    intuition: "Count how many times each letter appears, then print the most frequent letter repeatedly first, just like ranking prize winners by their score.",
    approach: [
      "Build a frequency map.",
      "Sort entries by frequency descending.",
      "Concatenate each character repeated by its count.",
    ],
    solution: `function frequencySort(s) {
  const freq = new Map();
  for (const c of s) freq.set(c, (freq.get(c) || 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([c, f]) => c.repeat(f))
    .join("");
}`,
    language: "javascript",
    complexity: { time: "O(n + d log d)", space: "O(n)" },
    systemDesign: "Log compression and columnar encoding (Parquet, ORC) run-length-encode the most repeated values first; frequency-sorted dictionaries improve compression ratios by grouping high-frequency symbols together.",
  },
  {
    id: "heap-12",
    title: "Find K Pairs with Smallest Sums",
    difficulty: "Medium",
    tags: ["Heap", "Array"],
    statement: "Given two sorted arrays nums1 and nums2, find the k pairs (u,v) — one from each array — with the smallest sums. Return in any order.",
    examples: [
      { input: "nums1 = [1,7,11], nums2 = [2,4,6], k = 3", output: "[[1,2],[1,4],[1,6]]" },
    ],
    intuition: "Since both arrays are sorted, the smallest sum is always nums1[0]+nums2[0]. From any pair (i,j) the next candidates are (i+1,j) and (i,j+1). Use a min-heap to always expand the smallest frontier pair.",
    approach: [
      "Seed the heap with (nums1[i], nums2[0], j=0) for i in 0..min(k,n1)-1.",
      "Pop the smallest; add it to result.",
      "If j+1 < n2, push (nums1[i], nums2[j+1], j+1).",
      "Repeat k times.",
    ],
    solution: `function kSmallestPairs(nums1, nums2, k) {
  if (!nums1.length || !nums2.length) return [];
  const h = new MinHeap(); // [sum, i, j]
  for (let i = 0; i < Math.min(k, nums1.length); i++)
    h.push([nums1[i] + nums2[0], i, 0]);
  const res = [];
  while (res.length < k && h.size()) {
    const [, i, j] = h.pop();
    res.push([nums1[i], nums2[j]]);
    if (j + 1 < nums2.length) h.push([nums1[i] + nums2[j+1], i, j+1]);
  }
  return res;
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p][0]<=this.h[i][0])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a][0]<this.h[s][0])s=a;if(b<this.h.length&&this.h[b][0]<this.h[s][0])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(k log k)", space: "O(k)" },
    systemDesign: "K-way merge of sorted runs in external sorting and LSM-tree compaction uses the same frontier-heap pattern; each run contributes its current minimum, and the heap efficiently selects the global minimum across runs.",
  },
  {
    id: "heap-13",
    title: "Kth Smallest Element in a Sorted Matrix",
    difficulty: "Medium",
    tags: ["Heap", "Matrix", "Binary Search"],
    statement: "Given an n x n matrix where rows and columns are sorted in ascending order, return the kth smallest element.",
    examples: [
      { input: "matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8", output: "13" },
    ],
    intuition: "The matrix is like many sorted lists stitched together. Start with the top-left (smallest), and each time you pick the current minimum, offer its right and bottom neighbors as new candidates.",
    approach: [
      "Seed min-heap with (matrix[0][0], 0, 0).",
      "Pop minimum k times; on each pop if right/down exist push them.",
      "Use a visited set to avoid duplicates.",
      "Return the kth popped value.",
    ],
    solution: `function kthSmallest(matrix, k) {
  const n = matrix.length;
  const h = new MinHeap(); // [val, r, c]
  const seen = new Set();
  h.push([matrix[0][0], 0, 0]); seen.add(0);
  let res = 0;
  for (let i = 0; i < k; i++) {
    const [v, r, c] = h.pop();
    res = v;
    const add = (nr, nc) => { const key = nr*n+nc; if(!seen.has(key)){seen.add(key);h.push([matrix[nr][nc],nr,nc]);} };
    if (r+1 < n) add(r+1, c);
    if (c+1 < n) add(r, c+1);
  }
  return res;
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p][0]<=this.h[i][0])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a][0]<this.h[s][0])s=a;if(b<this.h.length&&this.h[b][0]<this.h[s][0])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(k log k)", space: "O(k)" },
    systemDesign: "Multi-dimensional range queries in columnar databases perform sorted scans across sorted column files; this heap-based merge models how a query engine efficiently unifies multiple sorted iterators to find the kth result without loading everything into memory.",
  },
  {
    id: "heap-14",
    title: "Ugly Number II",
    difficulty: "Medium",
    tags: ["Heap", "Math", "Dynamic Programming"],
    statement: "An ugly number has only prime factors 2, 3, and 5. Given n, return the nth ugly number. 1 is considered ugly.",
    examples: [
      { input: "n = 10", output: "12", explanation: "Sequence: 1,2,3,4,5,6,8,9,10,12." },
    ],
    intuition: "To generate ugly numbers in order, start with 1. Each ugly number multiplied by 2, 3, or 5 produces another ugly number. A min-heap always gives the next smallest candidate.",
    approach: [
      "Seed min-heap with 1.",
      "Pop minimum n times; for each popped value v push v*2, v*3, v*5.",
      "Use a Set to skip duplicates.",
      "Return the nth popped value.",
    ],
    solution: `function nthUglyNumber(n) {
  const h = new MinHeap();
  const seen = new Set([1]);
  h.push(1);
  let res = 1;
  for (let i = 0; i < n; i++) {
    res = h.pop();
    for (const f of [2, 3, 5]) {
      const nx = res * f;
      if (!seen.has(nx)) { seen.add(nx); h.push(nx); }
    }
  }
  return res;
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p]<=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a]<this.h[s])s=a;if(b<this.h.length&&this.h[b]<this.h[s])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Regular expression engines and timer wheels use similar 'generate-and-select-next' patterns; event-driven schedulers maintain a priority queue of next-fire-times, always popping the soonest event.",
  },
  {
    id: "heap-15",
    title: "Task Scheduler",
    difficulty: "Medium",
    tags: ["Heap", "Greedy", "Queue"],
    statement: "Given a list of CPU tasks and a cooldown n (same task must wait n intervals between executions), return the minimum intervals to finish all tasks. CPU can idle.",
    examples: [
      { input: 'tasks = ["A","A","A","B","B","B"], n = 2', output: "8", explanation: "A->B->idle->A->B->idle->A->B." },
    ],
    intuition: "Always run the task that has the most remaining copies — that way you never waste cool-down time waiting on a single bottleneck. A max-heap picks the most frequent task instantly.",
    approach: [
      "Count task frequencies; push all into a max-heap.",
      "Use a queue to hold (count, readyTime) for cooling tasks.",
      "Each tick: if queue front is ready, push its count back to heap.",
      "If heap non-empty, pop and execute (decrement count, if > 0 add to queue); else idle.",
      "Increment time each iteration until both structures empty.",
    ],
    solution: `function leastInterval(tasks, n) {
  const freq = new Array(26).fill(0);
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;
  const h = new MaxHeap();
  for (const f of freq) if (f) h.push(f);
  let time = 0;
  const q = []; // [remaining, availableAt]
  while (h.size() || q.length) {
    if (q.length && q[0][1] <= time) h.push(q.shift()[0]);
    if (h.size()) {
      const cnt = h.pop() - 1;
      if (cnt > 0) q.push([cnt, time + n + 1]);
    }
    time++;
  }
  return time;
}

class MaxHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p]>=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a]>this.h[s])s=a;if(b<this.h.length&&this.h[b]>this.h[s])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(t log 26) = O(t)", space: "O(1)" },
    systemDesign: "OS process schedulers and database connection pools apply the same 'most-starved first' strategy to minimise stalls; rate-limited API clients use a cooldown queue identical to the queue in this solution.",
    pitfalls: ["Don't forget to push cooling tasks back when they become available before checking if the heap is empty.", "Formula max((maxFreq-1)*(n+1)+count_of_max_freq, total_tasks) works too but the simulation is more general."],
  },
  {
    id: "heap-16",
    title: "Reorganize String",
    difficulty: "Medium",
    tags: ["Heap", "Greedy", "String"],
    statement: "Given string s, rearrange its characters so no two adjacent characters are the same. Return any valid arrangement or empty string if impossible.",
    examples: [
      { input: 's = "aab"', output: '"aba"' },
    ],
    intuition: "Always place the most frequent remaining character. If the last placed character is the same as the most frequent, use the second most frequent instead. A max-heap always surfaces the best choice.",
    approach: [
      "Count frequencies; push all [freq, char] into max-heap.",
      "Each step: pop top; if top char equals last placed char, also pop second; place second, re-push second-1 if > 0, then re-push top.",
      "Else place top, re-push top-1 if > 0.",
      "If heap empty and we needed second but it's absent, return ''.",
    ],
    solution: `function reorganizeString(s) {
  const freq = new Map();
  for (const c of s) freq.set(c, (freq.get(c) || 0) + 1);
  const h = new MaxHeap();
  for (const [c, f] of freq) h.push([f, c]);
  let res = "";
  while (h.size()) {
    const [f1, c1] = h.pop();
    if (res && res[res.length-1] === c1) {
      if (!h.size()) return "";
      const [f2, c2] = h.pop();
      res += c2;
      if (f2 - 1 > 0) h.push([f2-1, c2]);
      h.push([f1, c1]);
    } else {
      res += c1;
      if (f1 - 1 > 0) h.push([f1-1, c1]);
    }
  }
  return res;
}

class MaxHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p][0]>=this.h[i][0])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a][0]>this.h[s][0])s=a;if(b<this.h.length&&this.h[b][0]>this.h[s][0])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(n log 26) = O(n)", space: "O(n)" },
    systemDesign: "Colocation constraints in cluster schedulers (no two replicas of the same shard on the same rack) use frequency-based greedy placement equivalent to this algorithm, minimising placement failures.",
  },
  {
    id: "heap-17",
    title: "Seat Reservation Manager",
    difficulty: "Medium",
    tags: ["Heap", "Design"],
    statement: "Design a seat reservation manager for n seats numbered 1 to n. Implement reserve() (returns smallest unreserved seat number) and unreserve(seatNumber) (unreserves the seat).",
    examples: [
      { input: "SeatManager(5), reserve()->1, reserve()->2, unreserve(2), reserve()->2", output: "1,2,2" },
    ],
    intuition: "Keep all available seats in a min-heap. reserve() always pops the smallest; unreserve() just pushes the seat back in.",
    approach: [
      "Initialize min-heap with seats 1 through n.",
      "reserve(): pop and return heap minimum.",
      "unreserve(seat): push seat back into heap.",
    ],
    solution: `class SeatManager {
  constructor(n) {
    this.h = new MinHeap();
    for (let i = 1; i <= n; i++) this.h.push(i);
  }
  reserve() { return this.h.pop(); }
  unreserve(s) { this.h.push(s); }
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p]<=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a]<this.h[s])s=a;if(b<this.h.length&&this.h[b]<this.h[s])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
}`,
    language: "javascript",
    complexity: { time: "O(log n) per operation", space: "O(n)" },
    systemDesign: "Connection pool managers in application servers (HikariCP, pgBouncer) maintain an available-connection heap; idle connections are returned with unreserve semantics and the next caller gets the cheapest (fastest-to-initialise) connection.",
  },
  {
    id: "heap-18",
    title: "The Number of the Smallest Unoccupied Chair",
    difficulty: "Medium",
    tags: ["Heap", "Sorting"],
    statement: "n friends arrive and leave a party. Each arriving friend takes the smallest available chair. Given arrival/departure times and a target friend index, return which chair the target friend sits in.",
    examples: [
      { input: "times = [[1,4],[2,3],[4,6]], targetFriend = 1", output: "1", explanation: "Friend 0 takes chair 0 at t=1. Friend 1 takes chair 1 at t=2. Friend 0 leaves at t=4, etc." },
    ],
    intuition: "Think of chairs as a pool. When a friend arrives grab the smallest free chair; when they leave, toss their chair back into the pool. A min-heap manages both pools efficiently.",
    approach: [
      "Sort friends by arrival time, keeping original index.",
      "Min-heap of free chairs (0..n-1 initially).",
      "Min-heap of (departureTime, chair) for occupied chairs.",
      "On each arrival: free all chairs whose departure <= arrival, then assign smallest free chair.",
      "If current friend is target, return assigned chair.",
    ],
    solution: `function smallestChair(times, targetFriend) {
  const n = times.length;
  const order = Array.from({length: n}, (_, i) => i).sort((a, b) => times[a][0] - times[b][0]);
  const free = new MinHeap(), busy = new MinHeap(); // busy: [dept, chair]
  for (let i = 0; i < n; i++) free.push(i);
  for (const idx of order) {
    const [arr, dep] = times[idx];
    while (busy.size() && busy.peek()[0] <= arr) free.push(busy.pop()[1]);
    const chair = free.pop();
    if (idx === targetFriend) return chair;
    busy.push([dep, chair]);
  }
  return -1;
}

class MinHeap {
  constructor() { this.h = []; }
  _cmp(a, b) { return Array.isArray(a) ? a[0] <= b[0] : a <= b; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this._cmp(this.h[p],this.h[i]))break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this._cmp(this.h[a],this.h[s]))s=a;if(b<this.h.length&&this._cmp(this.h[b],this.h[s]))s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  peek() { return this.h[0]; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Database connection checkout and worker thread assignment in thread pools follow the same two-heap pattern: a free-resource heap and a busy-resource heap ordered by expected release time, enabling O(log n) assignment decisions.",
  },
  {
    id: "heap-19",
    title: "Find Median from Data Stream",
    difficulty: "Medium",
    tags: ["Heap", "Design", "Two Heaps"],
    statement: "Design a data structure that supports addNum(num) and findMedian() which returns the median of all added numbers.",
    examples: [
      { input: "addNum(1), addNum(2), findMedian()->1.5, addNum(3), findMedian()->2", output: "1.5, 2" },
    ],
    intuition: "Split numbers into two halves: a max-heap for the smaller half and a min-heap for the larger half. The median is always at the tops of these two heaps — like two sorted piles where the biggest of the left pile and the smallest of the right pile are always visible.",
    approach: [
      "Maintain max-heap (lo) for lower half and min-heap (hi) for upper half.",
      "On addNum: push to lo; balance by moving lo top to hi; if hi > lo in size move hi top to lo.",
      "findMedian: if sizes equal average the two tops; else return lo top.",
    ],
    solution: `class MedianFinder {
  constructor() {
    this.lo = new MaxHeap(); // lower half
    this.hi = new MinHeap(); // upper half
  }
  addNum(num) {
    this.lo.push(num);
    this.hi.push(this.lo.pop());
    if (this.hi.size() > this.lo.size()) this.lo.push(this.hi.pop());
  }
  findMedian() {
    return this.lo.size() > this.hi.size()
      ? this.lo.peek()
      : (this.lo.peek() + this.hi.peek()) / 2;
  }
}

class MaxHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p]>=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a]>this.h[s])s=a;if(b<this.h.length&&this.h[b]>this.h[s])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  peek() { return this.h[0]; } size() { return this.h.length; }
}
class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p]<=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a]<this.h[s])s=a;if(b<this.h.length&&this.h[b]<this.h[s])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  peek() { return this.h[0]; } size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(log n) addNum, O(1) findMedian", space: "O(n)" },
    systemDesign: "Streaming percentile computation in monitoring systems (p50/p95 latency) uses two-heap or quantile sketch (T-Digest) structures; the two-heap median pattern scales to distributed systems by maintaining local heaps per shard and merging boundary values.",
    pitfalls: ["Always ensure lo.size() >= hi.size() (lo can have one extra, hi cannot).", "Use >= not > when balancing to avoid infinite push-pop loops."],
  },
  {
    id: "heap-20",
    title: "Maximum Subsequence Score",
    difficulty: "Medium",
    tags: ["Heap", "Greedy", "Sorting"],
    statement: "Given two integer arrays nums1 and nums2 of equal length and integer k, pick k indices to maximise sum(nums1[chosen]) * min(nums2[chosen]). Return that maximum score.",
    examples: [
      { input: "nums1=[1,3,3,2], nums2=[2,1,3,3], k=3", output: "12", explanation: "Indices 0,2,3: sum nums1=1+3+2=6, min nums2=min(2,3,3)=2, score=12." },
    ],
    intuition: "If we fix which nums2 value is the minimum (by sorting desc on nums2 and sweeping), we just need the k largest nums1 values among all indices seen so far. A min-heap of size k tracks that sum.",
    approach: [
      "Pair (nums2[i], nums1[i]) and sort descending by nums2.",
      "Sweep; maintain a min-heap of size k of nums1 values and their running sum.",
      "When heap reaches size k, compute score = sum * current nums2 value; update max.",
    ],
    solution: `function maxScore(nums1, nums2, k) {
  const pairs = nums1.map((v, i) => [nums2[i], v]).sort((a, b) => b[0] - a[0]);
  const h = new MinHeap();
  let sum = 0, best = 0;
  for (const [n2, n1] of pairs) {
    h.push(n1); sum += n1;
    if (h.size() > k) sum -= h.pop();
    if (h.size() === k) best = Math.max(best, sum * n2);
  }
  return best;
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p]<=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a]<this.h[s])s=a;if(b<this.h.length&&this.h[b]<this.h[s])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(n log n + n log k)", space: "O(n)" },
    systemDesign: "Ad auction systems maximise revenue = bid * quality_score; fixing quality in sorted order and sweeping bids with a bounded heap mirrors exactly this pattern, enabling real-time bid optimisation over large candidate sets.",
  },
  {
    id: "heap-21",
    title: "Furthest Building You Can Reach",
    difficulty: "Medium",
    tags: ["Heap", "Greedy"],
    statement: "You have buildings with heights, ladders, and bricks. Moving to a taller building costs height difference — pay with bricks or use a ladder. Return the furthest building index reachable.",
    examples: [
      { input: "heights=[4,2,7,6,9,14,12], bricks=5, ladders=1", output: "4" },
    ],
    intuition: "Use ladders on the biggest climbs and bricks on the small ones. As you go, if you decide a later climb is bigger than one you used a ladder on, swap: reclaim that ladder and spend bricks on the smaller climb.",
    approach: [
      "For each upward jump, tentatively use a ladder (push jump to min-heap).",
      "If ladders are exhausted (heap size > ladders), swap the smallest ladder-jump to bricks.",
      "If not enough bricks, stop.",
    ],
    solution: `function furthestBuilding(heights, bricks, ladders) {
  const h = new MinHeap(); // ladder-used jumps
  for (let i = 0; i < heights.length - 1; i++) {
    const diff = heights[i+1] - heights[i];
    if (diff <= 0) continue;
    h.push(diff);
    if (h.size() > ladders) {
      bricks -= h.pop();
      if (bricks < 0) return i;
    }
  }
  return heights.length - 1;
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p]<=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a]<this.h[s])s=a;if(b<this.h.length&&this.h[b]<this.h[s])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(n log L)", space: "O(L)" },
    systemDesign: "Resource-aware task routing (use premium compute for the heaviest tasks, free tier for the rest) applies the same retroactive-swap greedy; cloud cost optimisers reassign workload between spot and on-demand instances using this pattern.",
  },
  {
    id: "heap-22",
    title: "Single-Threaded CPU",
    difficulty: "Medium",
    tags: ["Heap", "Sorting", "Simulation"],
    statement: "Given tasks with enqueueTime and processingTime, a single CPU picks the available task with shortest processingTime (ties: smallest index). Return the order tasks are processed.",
    examples: [
      { input: "tasks=[[1,2],[2,4],[3,2],[4,1]]", output: "[0,2,3,1]" },
    ],
    intuition: "Sort tasks by arrival, then simulate: at each moment pick the shortest available task. A min-heap of (processingTime, index) gives the best task instantly.",
    approach: [
      "Pair tasks with original index; sort by enqueueTime.",
      "Simulate: advance time to next enqueue if CPU is idle.",
      "Push all tasks with enqueueTime <= current time into min-heap.",
      "Pop shortest task; advance time by its duration; record index.",
    ],
    solution: `function getOrder(tasks) {
  const n = tasks.length;
  const sorted = tasks.map(([e, p], i) => [e, p, i]).sort((a, b) => a[0] - b[0]);
  const h = new MinHeap(); // [proc, idx]
  const res = [];
  let time = 0, ti = 0;
  while (res.length < n) {
    if (!h.size() && ti < n) time = Math.max(time, sorted[ti][0]);
    while (ti < n && sorted[ti][0] <= time) { h.push([sorted[ti][1], sorted[ti][2]]); ti++; }
    const [proc, idx] = h.pop();
    res.push(idx);
    time += proc;
  }
  return res;
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;const a=this.h[p],b=this.h[i];if(a[0]<b[0]||(a[0]===b[0]&&a[1]<=b[1]))break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;const cmp=(x,y)=>this.h[x][0]<this.h[y][0]||(this.h[x][0]===this.h[y][0]&&this.h[x][1]<this.h[y][1]);if(a<this.h.length&&cmp(a,s))s=a;if(b<this.h.length&&cmp(b,s))s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "OS Shortest Job First (SJF) / Shortest Remaining Time schedulers use this exact simulation; database query schedulers pick the shortest estimated query from the ready queue to minimise average wait time.",
  },
  {
    id: "heap-23",
    title: "Process Tasks Using Servers",
    difficulty: "Medium",
    tags: ["Heap", "Sorting", "Simulation"],
    statement: "You have servers with weights and tasks arriving at times 0,1,2,... Each task goes to the free server with smallest weight (ties: smallest index). If none free, wait for the earliest-freeing server. Return which server handles each task.",
    examples: [
      { input: "servers=[3,3,2], tasks=[1,2,3,2,1,2]", output: "[2,2,0,2,1,2]" },
    ],
    intuition: "Keep two piles: free servers (by weight/index) and busy servers (by when they free up). Each new task grabs from the free pile, or waits for the busy pile's earliest release.",
    approach: [
      "Min-heap of free servers: [weight, index].",
      "Min-heap of busy servers: [freeAt, weight, index].",
      "For task i at time i: release all busy servers with freeAt <= i into free heap.",
      "If free heap non-empty: pop and assign; else jump time to busy heap top's freeAt, release, assign.",
    ],
    solution: `function assignTasks(servers, tasks) {
  const free = new MinHeap(), busy = new MinHeap();
  for (let i = 0; i < servers.length; i++) free.push([servers[i], i]);
  const res = new Array(tasks.length);
  for (let i = 0; i < tasks.length; i++) {
    let t = i;
    while (busy.size() && busy.peek()[0] <= t) { const [,w,idx]=busy.pop(); free.push([w,idx]); }
    if (!free.size()) {
      t = busy.peek()[0];
      while (busy.size() && busy.peek()[0] <= t) { const [,w,idx]=busy.pop(); free.push([w,idx]); }
    }
    const [w, idx] = free.pop();
    res[i] = idx;
    busy.push([t + tasks[i], w, idx]);
  }
  return res;
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this._le(this.h[p],this.h[i]))break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this._le(this.h[a],this.h[s]))s=a;if(b<this.h.length&&this._le(this.h[b],this.h[s]))s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  peek() { return this.h[0]; }
  size() { return this.h.length; }
  _le(a, b) { for(let i=0;i<a.length;i++){if(a[i]<b[i])return true;if(a[i]>b[i])return false;} return true; }
}`,
    language: "javascript",
    complexity: { time: "O((n+m) log n)", space: "O(n)" },
    systemDesign: "HTTP request routing to worker pools in nginx/envoy uses two-priority-queue dispatch (idle workers vs workers sorted by expected completion), directly mirroring this pattern to minimise tail latency.",
  },
  {
    id: "heap-24",
    title: "Total Cost to Hire K Workers",
    difficulty: "Medium",
    tags: ["Heap", "Greedy", "Two Pointers"],
    statement: "Given costs array and integers k and candidates, hire k workers with minimum total cost. Each round consider the cheapest among the first 'candidates' and last 'candidates' remaining workers.",
    examples: [
      { input: "costs=[17,12,10,2,7,2,11,20,8], k=3, candidates=4", output: "11", explanation: "Hire costs 2,2,7." },
    ],
    intuition: "Use two min-heaps — one watching the front candidates, one watching the back candidates. Each hire picks the globally cheapest from either end.",
    approach: [
      "Init left min-heap with first 'candidates' workers, right min-heap with last 'candidates'.",
      "Expand pointers inward as workers are hired.",
      "k times: compare front and back heap tops; hire the cheaper, expand that side.",
    ],
    solution: `function totalCost(costs, k, candidates) {
  const n = costs.length;
  let l = 0, r = n - 1;
  const lh = new MinHeap(), rh = new MinHeap();
  for (let i = 0; i < candidates && l <= r; i++, l++) lh.push(costs[l]);
  for (let i = 0; i < candidates && l <= r; i++, r--) rh.push(costs[r]);
  let total = 0;
  for (let i = 0; i < k; i++) {
    const lv = lh.size() ? lh.peek() : Infinity;
    const rv = rh.size() ? rh.peek() : Infinity;
    if (lv <= rv) { total += lh.pop(); if (l <= r) { lh.push(costs[l]); l++; } }
    else { total += rh.pop(); if (l <= r) { rh.push(costs[r]); r--; } }
  }
  return total;
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p]<=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a]<this.h[s])s=a;if(b<this.h.length&&this.h[b]<this.h[s])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  peek() { return this.h[0]; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O((k + candidates) log candidates)", space: "O(candidates)" },
    systemDesign: "Distributed auction or bidding systems where bids arrive from two sides (buy-side and sell-side order books) use the same two-heap matching: the best bid from each side competes, and the winning side's book advances — the core of an exchange matching engine.",
  },
  {
    id: "heap-25",
    title: "Car Pooling",
    difficulty: "Medium",
    tags: ["Heap", "Sorting", "Greedy"],
    statement: "A car with capacity seats picks up and drops off passengers. Given trips [numPassengers, from, to] and capacity, return whether all trips can be completed without exceeding capacity.",
    examples: [
      { input: "trips=[[2,1,5],[3,3,7]], capacity=4", output: "false", explanation: "At position 3 you have 2+3=5 passengers, exceeds capacity 4." },
    ],
    intuition: "Sort trips by pickup location. As you drive forward, add boarding passengers and remove those who have already been dropped off — a min-heap by dropoff time handles departures efficiently.",
    approach: [
      "Sort trips by start location.",
      "Use a min-heap of [dropoff, passengers] for active passengers.",
      "For each trip: remove all entries from heap with dropoff <= current start.",
      "Add new passengers; if total > capacity return false.",
      "Return true.",
    ],
    solution: `function carPooling(trips, capacity) {
  trips.sort((a, b) => a[1] - b[1]);
  const h = new MinHeap(); // [dropoff, count]
  let onboard = 0;
  for (const [num, from, to] of trips) {
    while (h.size() && h.peek()[0] <= from) onboard -= h.pop()[1];
    onboard += num;
    if (onboard > capacity) return false;
    h.push([to, num]);
  }
  return true;
}

class MinHeap {
  constructor() { this.h = []; }
  push(v) { this.h.push(v); let i=this.h.length-1; while(i>0){const p=(i-1)>>1;if(this.h[p][0]<=this.h[i][0])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;} }
  pop() { const t=this.h[0],l=this.h.pop(); if(this.h.length){this.h[0]=l;let i=0;while(true){let s=i,a=2*i+1,b=2*i+2;if(a<this.h.length&&this.h[a][0]<this.h[s][0])s=a;if(b<this.h.length&&this.h[b][0]<this.h[s][0])s=b;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}} return t; }
  peek() { return this.h[0]; }
  size() { return this.h.length; }
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Interval-overlap capacity checks appear in meeting room scheduling, slot booking systems, and network bandwidth allocation; the sweep-line + min-heap pattern is the standard approach used by calendar APIs (Google Calendar busy-time checks) and cloud reservation systems.",
    pitfalls: ["Drop-off is exclusive (passengers leave AT 'to', not after), so use <= when releasing.", "Sort by pickup, not dropoff, to process events in travel order."],
  },
];
