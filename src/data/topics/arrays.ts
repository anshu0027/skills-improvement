import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  {
    id: "arrays-01",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hashing"],
    statement: "Given an array of integers nums and a target integer, return the indices of the two numbers that add up to target. Exactly one solution exists and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" },
    ],
    intuition: "For each number, the partner we need is target minus that number. Instead of searching the whole array again, we remember every number we have already seen in a lookup table so we can find the partner instantly.",
    approach: [
      "Create an empty hash map from value to index.",
      "Walk through the array once.",
      "For each num compute need = target - num.",
      "If need is already in the map, return [map[need], currentIndex].",
      "Otherwise store num -> index and continue.",
    ],
    solution: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "This is the in-memory version of a hash index: instead of scanning a table you jump to the row in O(1). Database hash indexes and distributed caches like Redis use the same principle. Hash partitioning routes a key to the correct shard using the same modulo-on-hash idea.",
    pitfalls: ["Store the number AFTER checking, or you may match an element with itself.", "Duplicates with different indices are handled correctly because you check before inserting."],
  },
  {
    id: "arrays-02",
    title: "Contains Duplicate",
    difficulty: "Easy",
    tags: ["Array", "Hashing"],
    statement: "Given an integer array nums, return true if any value appears at least twice, and false if every element is distinct.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" },
      { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true" },
    ],
    intuition: "Imagine writing each number on a sticky note and placing it on a board. If you ever try to place a number that already has a sticky note, you found a duplicate.",
    approach: [
      "Create an empty Set.",
      "Iterate over each number.",
      "If the number is already in the Set, return true.",
      "Otherwise add it to the Set.",
      "Return false after the loop.",
    ],
    solution: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Deduplication at scale is solved with Bloom filters (probabilistic sets) at the ingestion layer of event pipelines, saving expensive DB round-trips. Exactly-once delivery guarantees in Kafka and similar systems use a seen-ID set in a fast store like Redis to reject duplicate messages.",
    pitfalls: ["Sorting first is O(n log n) and correct but unnecessary when a hash set is available.", "An empty array should return false."],
  },
  {
    id: "arrays-03",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window"],
    statement: "You are given an array prices where prices[i] is the price of a stock on day i. You want to maximize profit by choosing a single day to buy and a later day to sell. Return the maximum profit, or 0 if no profit is possible.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price=1), sell on day 5 (price=6). Profit = 5." },
      { input: "prices = [7,6,4,3,1]", output: "0", explanation: "Prices only fall, no profit possible." },
    ],
    intuition: "As you walk through prices day by day, keep track of the cheapest price you have seen so far. Each day, ask: if I sold today, how much would I make? Keep the best answer.",
    approach: [
      "Initialize minPrice = Infinity and maxProfit = 0.",
      "For each price, update minPrice = Math.min(minPrice, price).",
      "Compute profit = price - minPrice.",
      "Update maxProfit = Math.max(maxProfit, profit).",
      "Return maxProfit.",
    ],
    solution: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }
  return maxProfit;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Running-minimum scans appear in real-time analytics dashboards that track all-time-low latency or cost baselines without storing full history. In columnar databases like BigQuery, streaming aggregates (MIN, MAX over a window) use the same single-pass idea to avoid full rescans.",
    pitfalls: ["You must buy before you sell — sell index must be strictly greater than buy index.", "Return 0, not a negative number, when prices only decline."],
  },
  {
    id: "arrays-04",
    title: "Valid Anagram",
    difficulty: "Easy",
    tags: ["Array", "Hashing", "String"],
    statement: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram uses the exact same characters with the same frequencies.",
    examples: [
      { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
      { input: "s = \"rat\", t = \"car\"", output: "false" },
    ],
    intuition: "Count how many times each letter appears in the first word, then subtract counts for the second word. If every count ends at zero, the words are anagrams.",
    approach: [
      "Return false immediately if lengths differ.",
      "Build a frequency map by iterating s (increment) and t (decrement).",
      "Return true if every value in the map is 0.",
    ],
    solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (let i = 0; i < s.length; i++) {
    count[s[i]] = (count[s[i]] || 0) + 1;
    count[t[i]] = (count[t[i]] || 0) - 1;
  }
  return Object.values(count).every(v => v === 0);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Frequency maps are used in search engines to build inverted indexes (term -> document list) and in spam filters that score emails by word distribution. Character frequency histograms also power plagiarism detection systems that compare document fingerprints.",
    pitfalls: ["Unicode characters beyond ASCII need careful handling if using fixed-size arrays.", "Different lengths are never anagrams — check this first for an early exit."],
  },
  {
    id: "arrays-05",
    title: "Find All Numbers Disappeared in Array",
    difficulty: "Easy",
    tags: ["Array", "Hashing"],
    statement: "Given an array nums of n integers where nums[i] is in [1, n], some elements appear twice and others once. Return all the integers in [1, n] that do not appear in nums.",
    examples: [
      { input: "nums = [4,3,2,7,8,2,3,1]", output: "[5,6]" },
      { input: "nums = [1,1]", output: "[2]" },
    ],
    intuition: "Use the array itself as a presence board. For each number you see, mark its position as visited by negating it. Any index still positive at the end has its number missing.",
    approach: [
      "For each value v in nums, compute index = Math.abs(v) - 1.",
      "Negate nums[index] if it is positive (mark as seen).",
      "After the loop, collect all indices i where nums[i] > 0.",
      "Those indices + 1 are the missing numbers.",
    ],
    solution: `function findDisappearedNumbers(nums) {
  for (const v of nums) {
    const idx = Math.abs(v) - 1;
    if (nums[idx] > 0) nums[idx] = -nums[idx];
  }
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) result.push(i + 1);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "In-place marking (using sign bits as flags) is a technique seen in low-memory embedded systems and tight inner loops where allocation is forbidden. The concept generalises to sparse bitmap indexes in columnar stores for tracking row presence without extra memory.",
    pitfalls: ["You must take absolute value when computing the index because values may already be negative.", "The problem guarantees values are in [1,n], so no out-of-bounds access."],
  },
  {
    id: "arrays-06",
    title: "Move Zeroes",
    difficulty: "Easy",
    tags: ["Array", "Two Pointers"],
    statement: "Given an integer array nums, move all zeros to the end while maintaining the relative order of non-zero elements. Do it in-place.",
    examples: [
      { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
      { input: "nums = [0]", output: "[0]" },
    ],
    intuition: "Use a slow pointer that only advances when it places a non-zero number. After all non-zeros are packed to the front, fill the remaining slots with zeros.",
    approach: [
      "Maintain a slow pointer 'pos' starting at 0.",
      "Walk fast pointer i through the array.",
      "When nums[i] != 0, set nums[pos] = nums[i] and advance pos.",
      "After the loop, fill nums[pos..] with 0.",
    ],
    solution: `function moveZeroes(nums) {
  let pos = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) nums[pos++] = nums[i];
  }
  while (pos < nums.length) nums[pos++] = 0;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "In-place compaction is used in garbage collectors (mark-compact phase) and in columnar storage engines when deleting rows — tombstoned slots are compacted out without allocating new memory. The two-pointer pattern is also how SSDs coalesce valid data during garbage collection.",
    pitfalls: ["Do not swap every zero with a non-zero — that changes relative order. Write non-zeros first, then fill zeros.", "A fully-zero array is valid — pos stays 0 and the whole array gets overwritten with 0."],
  },
  {
    id: "arrays-07",
    title: "Intersection of Two Arrays II",
    difficulty: "Easy",
    tags: ["Array", "Hashing", "Two Pointers"],
    statement: "Given two integer arrays nums1 and nums2, return an array of their intersection where each element appears as many times as it shows in both arrays.",
    examples: [
      { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2,2]" },
      { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", output: "[4,9]" },
    ],
    intuition: "Count how many times each number appears in the first array, then for each number in the second array subtract one from that count and collect it if the count was positive.",
    approach: [
      "Build a frequency map of nums1.",
      "Iterate nums2; if count for current number > 0, push to result and decrement count.",
      "Return result.",
    ],
    solution: `function intersect(nums1, nums2) {
  const count = {};
  for (const n of nums1) count[n] = (count[n] || 0) + 1;
  const res = [];
  for (const n of nums2) {
    if (count[n] > 0) { res.push(n); count[n]--; }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(m+n)", space: "O(min(m,n))" },
    systemDesign: "Multiset intersection underlies JOIN operations in query engines — the hash-join algorithm builds a hash table on the smaller relation and probes with the larger, exactly mimicking this approach. Distributed set intersection (e.g. common followers) is computed shard-by-shard and merged.",
    pitfalls: ["This differs from 'unique intersection' — duplicates matter here.", "Build the frequency map on the smaller array to minimise memory."],
  },
  {
    id: "arrays-08",
    title: "Running Sum of 1D Array",
    difficulty: "Easy",
    tags: ["Array", "Prefix Sum"],
    statement: "Given an array nums, return the running sum where runningSum[i] = sum(nums[0] + ... + nums[i]).",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[1,3,6,10]" },
      { input: "nums = [1,1,1,1,1]", output: "[1,2,3,4,5]" },
    ],
    intuition: "It is like keeping a cumulative total on a receipt — each new item adds to whatever the total was before.",
    approach: [
      "Iterate from index 1 to end.",
      "Set nums[i] += nums[i-1].",
      "Return nums.",
    ],
    solution: `function runningSum(nums) {
  for (let i = 1; i < nums.length; i++) {
    nums[i] += nums[i - 1];
  }
  return nums;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Prefix sums are the foundation of range-sum queries used in analytics databases. Materialized cumulative aggregates let dashboards answer 'sum from day A to day B' in O(1) instead of re-scanning rows, which is how tools like Apache Druid achieve sub-second query latency on billions of rows.",
    pitfalls: ["Modifying in-place is fine here, but in problems that need the original array keep a separate prefix array.", "Empty input is valid — the loop simply never runs."],
  },
  {
    id: "arrays-09",
    title: "Maximum Average Subarray I",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window"],
    statement: "Given an integer array nums and an integer k, find the contiguous subarray of length k that has the maximum average value and return that maximum average.",
    examples: [
      { input: "nums = [1,12,-5,-6,50,3], k = 4", output: "12.75", explanation: "Window [12,-5,-6,50] has average (51/4) = 12.75." },
      { input: "nums = [5], k = 1", output: "5.0" },
    ],
    intuition: "Slide a window of size k across the array. Instead of recomputing the sum from scratch each step, just subtract the element leaving the window and add the element entering.",
    approach: [
      "Compute the sum of the first k elements.",
      "Set maxSum = windowSum.",
      "Slide from index k to end: add nums[i], subtract nums[i-k], update maxSum.",
      "Return maxSum / k.",
    ],
    solution: `function findMaxAverage(nums, k) {
  let sum = nums.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, sum);
  }
  return maxSum / k;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Fixed-size sliding windows map directly to time-series rollup windows used in monitoring systems (e.g. Prometheus rate() over 5 minutes). Streaming databases like Flink use incremental window aggregation, adding and evicting elements as time advances, to avoid reprocessing entire windows.",
    pitfalls: ["Using floating-point division before maximising can introduce precision errors — compare sums as integers and divide once at the end.", "k is guaranteed ≤ n so the initial slice is safe."],
  },
  {
    id: "arrays-10",
    title: "Squares of a Sorted Array",
    difficulty: "Easy",
    tags: ["Array", "Two Pointers", "Sorting"],
    statement: "Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number also in non-decreasing order.",
    examples: [
      { input: "nums = [-4,-1,0,3,10]", output: "[0,1,9,16,100]" },
      { input: "nums = [-7,-3,2,3,11]", output: "[4,9,9,49,121]" },
    ],
    intuition: "The largest squares always come from the two ends because large negatives square to large positives. Use two pointers at the start and end, always placing the larger square at the back of the result.",
    approach: [
      "Use left=0, right=n-1, and fill result from the back.",
      "Compare Math.abs(nums[left]) vs Math.abs(nums[right]).",
      "Place the larger square at result[pos--] and advance that pointer inward.",
      "Repeat until pointers cross.",
    ],
    solution: `function sortedSquares(nums) {
  const n = nums.length;
  const res = new Array(n);
  let left = 0, right = n - 1, pos = n - 1;
  while (left <= right) {
    const l2 = nums[left] * nums[left];
    const r2 = nums[right] * nums[right];
    if (l2 > r2) { res[pos--] = l2; left++; }
    else { res[pos--] = r2; right--; }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Merging two sorted sequences from opposite ends is the core of merge-sort and external sort — databases use this when sorting results that do not fit in memory (external merge sort). The same two-pointer merge is used when combining sorted index segments in Lucene/Elasticsearch.",
    pitfalls: ["Simply squaring and sorting is O(n log n) and correct but misses the O(n) insight.", "Both ends can produce the same square value — either pointer can advance; be consistent."],
  },
  {
    id: "arrays-11",
    title: "Single Number",
    difficulty: "Easy",
    tags: ["Array", "Bit Manipulation"],
    statement: "Given a non-empty array of integers where every element appears twice except for one, find and return that single element. Solve in O(n) time and O(1) space.",
    examples: [
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4" },
    ],
    intuition: "XOR of a number with itself is 0, and XOR of any number with 0 is the number itself. So XOR-ing everything together cancels all pairs and leaves the lone element.",
    approach: [
      "Start with result = 0.",
      "XOR every element into result.",
      "Return result.",
    ],
    solution: `function singleNumber(nums) {
  return nums.reduce((acc, n) => acc ^ n, 0);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "XOR-based checksums are used in RAID-5 storage arrays to reconstruct a failed disk without storing a full copy of the data. Network error-detection codes (CRC, parity) use the same XOR linearity to detect flipped bits in transmitted data packets.",
    pitfalls: ["This only works when exactly one element is unpaired — for k repeats you need a different approach (bit counting).", "Integer overflow is not a concern in JavaScript with bitwise XOR."],
  },
  {
    id: "arrays-12",
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    statement: "Given an integer array nums, find the subarray with the largest sum and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] has the largest sum = 6." },
      { input: "nums = [1]", output: "1" },
      { input: "nums = [5,4,-1,7,8]", output: "23" },
    ],
    intuition: "As you walk through the array, keep a running total. If the running total ever goes negative, throw it away and start fresh — a negative prefix only drags down future sums.",
    approach: [
      "Initialize currentSum = nums[0], maxSum = nums[0].",
      "For each subsequent element, set currentSum = Math.max(num, currentSum + num).",
      "Update maxSum = Math.max(maxSum, currentSum).",
      "Return maxSum.",
    ],
    solution: `function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Kadane's pattern generalises to streaming revenue/loss analysis in financial systems where you track peak profit windows without storing all transactions. It also underlies maximum-gain window detection in A/B testing platforms and anomaly-detection pipelines that look for the worst sustained drop in a metric.",
    pitfalls: ["Initialise with nums[0] not 0 — the array can be all-negative.", "The problem asks for the sum, not the indices; track indices separately if needed."],
  },
  {
    id: "arrays-13",
    title: "Plus One",
    difficulty: "Easy",
    tags: ["Array", "Math"],
    statement: "You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. The most significant digit is digits[0]. Increment the integer by one and return the resulting array.",
    examples: [
      { input: "digits = [1,2,3]", output: "[1,2,4]" },
      { input: "digits = [4,3,2,1]", output: "[4,3,2,2]" },
      { input: "digits = [9]", output: "[1,0]" },
    ],
    intuition: "Add one to the last digit. If it becomes 10, set it to 0 and carry the 1 to the next digit. Keep carrying as long as there is a 10. If you carry past the first digit, prepend a 1.",
    approach: [
      "Iterate from the last digit to the first.",
      "If digits[i] < 9, increment and return.",
      "Otherwise set digits[i] = 0 and continue (carry).",
      "If the loop finishes, all digits were 9 — prepend 1.",
    ],
    solution: `function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) { digits[i]++; return digits; }
    digits[i] = 0;
  }
  return [1, ...digits];
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Arbitrary-precision integer arithmetic (BigInt) in databases and financial ledgers stores numbers as digit arrays exactly like this, handling carry propagation to avoid overflow. Distributed counter services (like Snowflake ID generators) also chain carry logic across multiple fields (timestamp, machine ID, sequence).",
    pitfalls: ["All-nines input requires a new leading digit — do not forget to prepend.", "Mutating and returning the original array is fine here."],
  },
  {
    id: "arrays-14",
    title: "Majority Element",
    difficulty: "Easy",
    tags: ["Array", "Hashing", "Boyer-Moore Voting"],
    statement: "Given an array nums of size n, return the majority element — the element that appears more than n/2 times. The majority element always exists.",
    examples: [
      { input: "nums = [3,2,3]", output: "3" },
      { input: "nums = [2,2,1,1,1,2,2]", output: "2" },
    ],
    intuition: "Picture a vote where the majority candidate cancels out any opposition. Keep a candidate and a score. When the score hits zero, the next element becomes the new candidate. The true majority always survives.",
    approach: [
      "Initialize candidate = null, count = 0.",
      "For each num: if count == 0, set candidate = num.",
      "If num == candidate, increment count; else decrement.",
      "Return candidate.",
    ],
    solution: `function majorityElement(nums) {
  let candidate = null, count = 0;
  for (const n of nums) {
    if (count === 0) candidate = n;
    count += n === candidate ? 1 : -1;
  }
  return candidate;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Boyer-Moore voting is used in distributed voting/consensus systems and approximate heavy-hitter detection in network traffic analysis (finding the IP address that sends more than half of all packets). Streaming analytics platforms use sketches like Count-Min to find heavy hitters without storing all elements.",
    pitfalls: ["This algorithm only works when the majority element is guaranteed to exist — validate separately if unsure.", "A hash-map approach also works but uses O(n) space."],
  },
  {
    id: "arrays-15",
    title: "Merge Sorted Array",
    difficulty: "Easy",
    tags: ["Array", "Two Pointers", "Sorting"],
    statement: "You are given two sorted arrays nums1 (with extra space at the end) and nums2. Merge nums2 into nums1 in-place in sorted order. nums1 has length m+n where the last n elements are zeros.",
    examples: [
      { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
      { input: "nums1 = [1], m = 1, nums2 = [], n = 0", output: "[1]" },
    ],
    intuition: "Fill the merged array from the back. Always pick the larger of the two current back elements — this way you never overwrite an unprocessed value.",
    approach: [
      "Set p1 = m-1, p2 = n-1, p = m+n-1.",
      "While both pointers are valid, place the larger element at position p and advance the corresponding pointer.",
      "Copy any remaining nums2 elements (nums1 leftovers are already in place).",
    ],
    solution: `function merge(nums1, m, nums2, n) {
  let p1 = m - 1, p2 = n - 1, p = m + n - 1;
  while (p2 >= 0) {
    if (p1 >= 0 && nums1[p1] > nums2[p2]) {
      nums1[p--] = nums1[p1--];
    } else {
      nums1[p--] = nums2[p2--];
    }
  }
}`,
    language: "javascript",
    complexity: { time: "O(m+n)", space: "O(1)" },
    systemDesign: "This back-fill merge is the core of merge-sort's combine step and is used in database external merge sort for large tables. LSM-tree storage engines (RocksDB, Cassandra) merge sorted SSTables using this exact pattern during compaction to maintain sorted order on disk.",
    pitfalls: ["Going front-to-back would overwrite unprocessed nums1 elements — always merge from the back.", "If nums2 is exhausted first the loop exits; nums1 leftovers are already in place."],
  },
  {
    id: "arrays-16",
    title: "Maximum Consecutive Ones",
    difficulty: "Easy",
    tags: ["Array"],
    statement: "Given a binary array nums, return the maximum number of consecutive 1s.",
    examples: [
      { input: "nums = [1,1,0,1,1,1]", output: "3" },
      { input: "nums = [1,0,1,1,0,1]", output: "2" },
    ],
    intuition: "Walk through the array with a running counter. Reset it to zero whenever you hit a 0, and track the highest value the counter ever reaches.",
    approach: [
      "Initialize count = 0 and max = 0.",
      "For each element: if 1, increment count and update max; else reset count to 0.",
      "Return max.",
    ],
    solution: `function findMaxConsecutiveOnes(nums) {
  let count = 0, max = 0;
  for (const n of nums) {
    count = n === 1 ? count + 1 : 0;
    max = Math.max(max, count);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Longest-run scanning is used in uptime monitoring systems to find the longest period without an outage, and in genomics to locate the longest repeat region in a DNA sequence. Columnar storage uses run-length encoding (RLE) which requires finding consecutive runs, making this a hot inner loop.",
    pitfalls: ["Update max inside the loop, not just at the end, or you may miss the last run if the array ends with 1s.", "All-zeros input correctly returns 0."],
  },
  {
    id: "arrays-17",
    title: "Find Pivot Index",
    difficulty: "Easy",
    tags: ["Array", "Prefix Sum"],
    statement: "Given an array nums, return the leftmost pivot index where the sum of all elements to the left equals the sum of all elements to the right. Return -1 if no such index exists.",
    examples: [
      { input: "nums = [1,7,3,6,5,6]", output: "3", explanation: "Left sum = 1+7+3 = 11, right sum = 5+6 = 11." },
      { input: "nums = [1,2,3]", output: "-1" },
    ],
    intuition: "Compute the total sum once. Then walk left to right, keeping a running left sum. At each index, the right sum is total - leftSum - nums[i]. If left equals right, that is the pivot.",
    approach: [
      "Compute total = sum of all elements.",
      "Walk with leftSum = 0.",
      "At index i, if leftSum == total - leftSum - nums[i], return i.",
      "Add nums[i] to leftSum.",
      "Return -1.",
    ],
    solution: `function pivotIndex(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let left = 0;
  for (let i = 0; i < nums.length; i++) {
    if (left === total - left - nums[i]) return i;
    left += nums[i];
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Balance-point detection is used in load balancers to find the server index where left-side load equals right-side load for consistent hashing ring rebalancing. Prefix sums also power database partitioning strategies that split tables into equal-weight shards.",
    pitfalls: ["Do not include nums[i] itself in either left or right sum.", "There may be multiple pivots — return the leftmost."],
  },
  // ---- MEDIUM (18 problems) ----
  {
    id: "arrays-18",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    tags: ["Array", "Prefix Product"],
    statement: "Given an integer array nums, return an array answer such that answer[i] is the product of all elements of nums except nums[i]. Solve without using division in O(n) time.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
    ],
    intuition: "For each position, the answer is (product of everything to the left) times (product of everything to the right). Compute these two passes separately and multiply them together.",
    approach: [
      "Build left-products array: left[i] = product of nums[0..i-1].",
      "Walk right to left accumulating a running right product.",
      "Multiply result[i] by rightProduct at each step.",
      "Return result.",
    ],
    solution: `function productExceptSelf(nums) {
  const n = nums.length;
  const res = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) { res[i] = left; left *= nums[i]; }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Prefix and suffix products appear in probabilistic models (naive Bayes log-product underflow) and in distributed feature engineering where each node holds a partial product and passes it to its neighbour in a ring-allreduce pattern used by deep-learning frameworks like PyTorch DDP.",
    pitfalls: ["Using division fails when the array contains zeros.", "O(1) extra space means not counting the output array — the two extra passes replace the separate prefix/suffix arrays."],
  },
  {
    id: "arrays-19",
    title: "Group Anagrams",
    difficulty: "Medium",
    tags: ["Array", "Hashing", "String"],
    statement: "Given an array of strings strs, group the anagrams together and return the groups in any order.",
    examples: [
      { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" },
      { input: "strs = [\"\"]", output: "[[\"\"]]" },
    ],
    intuition: "Two words are anagrams if and only if they have the same sorted letters. Use the sorted letters as a key in a map and group all original words under that key.",
    approach: [
      "Create a map from sorted-string -> list of original strings.",
      "For each word, sort its characters to get the key.",
      "Push the word into map[key].",
      "Return all map values.",
    ],
    solution: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return [...map.values()];
}`,
    language: "javascript",
    complexity: { time: "O(n * k log k)", space: "O(n)" },
    systemDesign: "Canonical-key grouping is how search engines normalise query terms (stemming, lemmatisation) before indexing — different surface forms map to the same canonical key. In data lakes, partition pruning groups files by a derived key (date, hash prefix) so queries only scan relevant partitions.",
    pitfalls: ["A frequency-count key (e.g. 'a2b1') is O(k) per word instead of O(k log k) — faster for long strings.", "Empty string is a valid input and its sorted form is also the empty string."],
  },
  {
    id: "arrays-20",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    tags: ["Array", "Hashing", "Heap", "Bucket Sort"],
    statement: "Given an integer array nums and an integer k, return the k most frequent elements. The answer may be returned in any order.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    intuition: "Count each number's frequency, then use a bucket array indexed by frequency. Numbers with frequency f go in bucket[f]. Read buckets from the back to get the most frequent first.",
    approach: [
      "Build a frequency map.",
      "Create a buckets array of size n+1.",
      "Place each number in buckets[freq[number]].",
      "Walk buckets from the back, collecting elements until k elements are gathered.",
    ],
    solution: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, f] of freq) buckets[f].push(num);
  const res = [];
  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {
    res.push(...buckets[i]);
  }
  return res.slice(0, k);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Top-K queries are central to recommendation engines (top-K trending products), leaderboards, and log analytics. Production systems use Count-Min Sketch + a small heap to find approximate top-K over billions of events in constant memory, as used in Twitter's trending topics and Cloudflare's traffic analytics.",
    pitfalls: ["A min-heap of size k gives O(n log k) — correct but not optimal. Bucket sort achieves O(n).", "When multiple numbers share the same frequency, buckets can overflow k — slice the final result."],
  },
  {
    id: "arrays-21",
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    tags: ["Array", "Hashing", "Prefix Sum"],
    statement: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals k.",
    examples: [
      { input: "nums = [1,1,1], k = 2", output: "2" },
      { input: "nums = [1,2,3], k = 3", output: "2" },
    ],
    intuition: "Keep a running prefix sum. If the prefix sum at position j minus the prefix sum at an earlier position i equals k, then the subarray from i+1 to j sums to k. Track how many times each prefix sum has occurred.",
    approach: [
      "Initialize prefixCount = {0: 1}, sum = 0, count = 0.",
      "For each num add to sum.",
      "Check if (sum - k) is in prefixCount; if so, add that count to the answer.",
      "Increment prefixCount[sum].",
      "Return count.",
    ],
    solution: `function subarraySum(nums, k) {
  const prefixCount = new Map([[0, 1]]);
  let sum = 0, count = 0;
  for (const n of nums) {
    sum += n;
    count += prefixCount.get(sum - k) || 0;
    prefixCount.set(sum, (prefixCount.get(sum) || 0) + 1);
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Prefix-sum hash maps power budget-window queries in financial systems ('how many transaction windows sum to exactly $X?'). In time-series databases, this pattern enables efficient SLA breach detection by counting windows whose aggregate metric equals a threshold, without rescanning every window.",
    pitfalls: ["Sliding window only works for non-negative numbers; prefix-sum hash map handles negatives.", "Seed the map with {0:1} to count subarrays starting at index 0."],
  },
  {
    id: "arrays-22",
    title: "Sort Colors (Dutch National Flag)",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    statement: "Given an array nums with values 0, 1, or 2 representing red, white, and blue, sort them in-place so all 0s come first, then 1s, then 2s.",
    examples: [
      { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
      { input: "nums = [2,0,1]", output: "[0,1,2]" },
    ],
    intuition: "Use three zones: a confirmed-0 zone at the front, a confirmed-2 zone at the back, and an unexplored middle. The current pointer walks forward. When it finds a 0, swap it into the front zone; when it finds a 2, swap it into the back zone.",
    approach: [
      "Set lo=0, mid=0, hi=n-1.",
      "While mid <= hi: if nums[mid]==0, swap with lo, advance both; if nums[mid]==2, swap with hi, decrement hi only; else advance mid.",
    ],
    solution: `function sortColors(nums) {
  let lo = 0, mid = 0, hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] === 0) {
      [nums[lo], nums[mid]] = [nums[mid], nums[lo]];
      lo++; mid++;
    } else if (nums[mid] === 2) {
      [nums[mid], nums[hi]] = [nums[hi], nums[mid]];
      hi--;
    } else {
      mid++;
    }
  }
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "The Dutch National Flag algorithm is generalised in distributed partition schemes where records are routed to low/mid/high buckets based on a pivot — exactly what happens in quicksort's partition step used by database engines for ORDER BY. Three-way partitioning also appears in MapReduce shuffle when binning data into sorted partitions.",
    pitfalls: ["When swapping with hi, do not advance mid — the swapped value from hi is unexamined.", "Two-pass counting sort also works in O(n) but requires two scans."],
  },
  {
    id: "arrays-23",
    title: "3Sum",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    statement: "Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i, j, k are distinct indices and nums[i] + nums[j] + nums[k] == 0.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
    ],
    intuition: "Sort the array. Fix one number and use the two-pointer trick to find the other two in the remaining sorted portion — exactly like a two-sum on the rest of the array.",
    approach: [
      "Sort nums.",
      "For each index i (skip duplicates), set left=i+1, right=n-1.",
      "Move the two pointers toward each other; if sum<0, advance left; if sum>0, retreat right.",
      "On a zero sum, record the triplet and skip duplicate left/right values.",
    ],
    solution: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r];
      if (s === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      } else if (s < 0) l++;
      else r--;
    }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(1)" },
    systemDesign: "k-Sum problems model multi-attribute join conditions in query optimisers. Sorting before probing also underlies merge-join strategies in RDBMS where both relations are sorted on the join key and scanned in tandem — O(n) pass after an O(n log n) sort — cheaper than nested-loop joins for large data sets.",
    pitfalls: ["Skip duplicate values for the fixed pointer AND for both inner pointers after recording a triplet.", "Early-exit: if nums[i] > 0, no positive triple can sum to 0."],
  },
  {
    id: "arrays-24",
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Greedy"],
    statement: "Given an integer array height of length n representing vertical lines, find two lines that together with the x-axis form a container that holds the most water. Return the maximum water.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" },
    ],
    intuition: "Start with the widest possible container (outermost two lines). The water is limited by the shorter line. Moving the taller inward can only decrease width without helping, so always move the shorter line inward hoping for a taller one.",
    approach: [
      "Set left=0, right=n-1, maxWater=0.",
      "Compute water = Math.min(height[left], height[right]) * (right - left).",
      "Update maxWater.",
      "Move the pointer at the shorter line inward.",
      "Repeat until pointers meet.",
    ],
    solution: `function maxArea(height) {
  let l = 0, r = height.length - 1, max = 0;
  while (l < r) {
    max = Math.max(max, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) l++; else r--;
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "The greedy two-pointer proof of optimality is the same reasoning used in resource-allocation problems: always upgrade the bottleneck resource. In network throughput optimisation, bandwidth is limited by the weakest link, so engineers focus on the slowest node — exactly the 'move the shorter wall' greedy choice.",
    pitfalls: ["Moving the taller pointer inward is never beneficial — always move the shorter one.", "Equal heights: move either pointer; the proof still holds."],
  },
  {
    id: "arrays-25",
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    tags: ["Array", "Hashing"],
    statement: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(n) time.",
    examples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "Consecutive sequence: [1,2,3,4]." },
      { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
    ],
    intuition: "Put all numbers in a hash set. A sequence only starts at a number with no left-neighbour (n-1 is not in the set). Starting from each such number, count how long the streak extends rightward.",
    approach: [
      "Add all numbers to a Set.",
      "For each num, if num-1 is not in the Set it is a sequence start.",
      "From that start, count up (num+1, num+2, ...) while the next number is in the Set.",
      "Track the max streak length.",
    ],
    solution: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const n of set) {
    if (!set.has(n - 1)) {
      let len = 1;
      while (set.has(n + len)) len++;
      best = Math.max(best, len);
    }
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Consecutive-ID detection is used in gap analysis for auto-increment primary keys (finding missing IDs in a database sequence), and in media streaming to detect missing packet sequences that require retransmission. Sharded counters also need sequence-gap detection to ensure no event is lost.",
    pitfalls: ["Only start counting from numbers without a left-neighbour, otherwise you get O(n²) worst case.", "Duplicate numbers in the input are collapsed by the Set — this is intentional."],
  },
  {
    id: "arrays-26",
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    tags: ["Array", "Matrix"],
    statement: "Given an m×n integer matrix, if an element is 0, set its entire row and column to 0 in-place. Use O(1) extra space.",
    examples: [
      { input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]" },
      { input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]", output: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]" },
    ],
    intuition: "Use the first row and first column of the matrix itself as flags. Mark which rows and columns need zeroing, then apply the zeroes, and finally handle the first row/column themselves.",
    approach: [
      "Scan for any zero in the first row/column and remember whether they need zeroing.",
      "For any zero in the rest of the matrix, mark matrix[i][0]=0 and matrix[0][j]=0.",
      "Apply zeroes to the interior using those markers.",
      "Zero out the first column if flagged, then the first row if flagged.",
    ],
    solution: `function setZeroes(matrix) {
  const m = matrix.length, n = matrix[0].length;
  let firstRowZero = matrix[0].some(x => x === 0);
  let firstColZero = matrix.some(r => r[0] === 0);
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      if (matrix[i][j] === 0) { matrix[i][0] = 0; matrix[0][j] = 0; }
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
  if (firstColZero) for (let i = 0; i < m; i++) matrix[i][0] = 0;
  if (firstRowZero) for (let j = 0; j < n; j++) matrix[0][j] = 0;
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(1)" },
    systemDesign: "In-place flag reuse (encoding metadata in the data structure itself) is common in memory-constrained environments such as embedded systems and GPU kernels. Sparse matrix formats like CSR also store structural metadata in auxiliary arrays to avoid materialising zeros, which directly relates to setting entire rows/columns to a sentinel value.",
    pitfalls: ["Process the first row and column last, otherwise their markers get corrupted.", "Using a naive extra-space set approach is simpler but violates the O(1) space constraint."],
  },
  {
    id: "arrays-27",
    title: "Spiral Matrix",
    difficulty: "Medium",
    tags: ["Array", "Matrix", "Simulation"],
    statement: "Given an m×n matrix, return all elements of the matrix in spiral order.",
    examples: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" },
      { input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", output: "[1,2,3,4,8,12,11,10,9,5,6,7]" },
    ],
    intuition: "Think of peeling an onion. Each pass peels one outer ring: go right across the top, down the right side, left across the bottom, up the left side — then shrink the boundaries and repeat.",
    approach: [
      "Maintain top, bottom, left, right boundaries.",
      "Traverse top row left to right, then right col top to bottom, then bottom row right to left, then left col bottom to top.",
      "After each traversal, shrink the corresponding boundary.",
      "Stop when boundaries cross.",
    ],
    solution: `function spiralOrder(matrix) {
  const res = [];
  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) res.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);
      left++;
    }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Spiral/layer-by-layer matrix traversal appears in raster image processing (JPEG block scanning) and in cache-oblivious algorithms that read matrices in a cache-friendly order. GPU memory coalescing problems also require understanding 2D access patterns to avoid strided memory access penalties.",
    pitfalls: ["Guard the bottom-row and left-col traversals with boundary checks to avoid double-counting the centre row/column in non-square matrices.", "Single row or single column inputs are valid edge cases."],
  },
  {
    id: "arrays-28",
    title: "Rotate Image",
    difficulty: "Medium",
    tags: ["Array", "Matrix"],
    statement: "Given an n×n 2D matrix, rotate it 90 degrees clockwise in-place.",
    examples: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]" },
      { input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]" },
    ],
    intuition: "A 90° clockwise rotation is the same as first flipping the matrix upside-down (reverse rows) and then transposing it (swap [i][j] with [j][i]).",
    approach: [
      "Reverse the order of rows.",
      "Transpose: swap matrix[i][j] with matrix[j][i] for all i < j.",
    ],
    solution: `function rotate(matrix) {
  matrix.reverse();
  for (let i = 0; i < matrix.length; i++)
    for (let j = i + 1; j < matrix.length; j++)
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(1)" },
    systemDesign: "In-place matrix rotation is used in image processing pipelines (camera orientation correction, EXIF rotation) and in scientific computing libraries like NumPy. For large distributed matrices, rotation is decomposed into transpose-and-permute operations across shards, requiring co-ordinated network shuffles similar to all-to-all communication in MPI.",
    pitfalls: ["Transpose alone gives a different rotation direction — the reverse-then-transpose order matters.", "Only the upper-triangle is swapped during transpose (loop j from i+1, not 0)."],
  },
  {
    id: "arrays-29",
    title: "Next Permutation",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers"],
    statement: "Given an array nums of integers, rearrange the numbers into the lexicographically next greater permutation. If no such arrangement is possible, rearrange to the lowest possible order (ascending).",
    examples: [
      { input: "nums = [1,2,3]", output: "[1,3,2]" },
      { input: "nums = [3,2,1]", output: "[1,2,3]" },
      { input: "nums = [1,1,5]", output: "[1,5,1]" },
    ],
    intuition: "Find the rightmost place where a small number is followed by a larger one — that small number needs to be swapped with the next-larger value to its right. Then reverse everything after that position to get the smallest arrangement.",
    approach: [
      "Find the largest index i such that nums[i] < nums[i+1]. If none exists, the whole array is descending — just reverse.",
      "Find the largest index j > i such that nums[j] > nums[i].",
      "Swap nums[i] and nums[j].",
      "Reverse the suffix starting at i+1.",
    ],
    solution: `function nextPermutation(nums) {
  const n = nums.length;
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let l = i + 1, r = n - 1;
  while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; }
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Permutation enumeration in order is used in combinatorial query optimisers that must enumerate join orderings to find the cheapest plan. Iterating permutations lazily (next-permutation) is also used in A/B test variant generation and in constraint-satisfaction solvers that explore the search space in lexicographic order.",
    pitfalls: ["The suffix after the swap point is guaranteed to be in descending order, so reversing it suffices (no need to sort).", "If no i is found the entire array is the last permutation — just reverse the whole thing."],
  },
  {
    id: "arrays-30",
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    statement: "Given an integer array nums, find a subarray that has the largest product and return the product.",
    examples: [
      { input: "nums = [2,3,-2,4]", output: "6", explanation: "Subarray [2,3] has the largest product." },
      { input: "nums = [-2,0,-1]", output: "0" },
    ],
    intuition: "A negative times a negative is positive, so we need to track both the maximum and minimum product ending at each position. The minimum can become the maximum after multiplying by a negative number.",
    approach: [
      "Track curMax, curMin, and globalMax, all starting at nums[0].",
      "For each subsequent num, compute the new curMax = max(num, curMax*num, curMin*num) and new curMin = min of the same three.",
      "Update globalMax.",
      "Return globalMax.",
    ],
    solution: `function maxProduct(nums) {
  let curMax = nums[0], curMin = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    const tmpMax = Math.max(n, curMax * n, curMin * n);
    curMin = Math.min(n, curMax * n, curMin * n);
    curMax = tmpMax;
    best = Math.max(best, curMax);
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Tracking both minimum and maximum in a DP state is a pattern in financial risk models (max/min portfolio value under compound returns) and in search ranking where a chain of multiplicative boosts can flip sign (penalty factors). The dual-state DP also appears in quantisation-aware training where activations can be negative.",
    pitfalls: ["Save tmpMax before overwriting curMin — both use the old curMax.", "Zero resets both curMax and curMin to zero, which is handled correctly by taking max/min with num alone."],
  },
  {
    id: "arrays-31",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    statement: "Given a rotated sorted array of unique integers, find the minimum element. Solve in O(log n) time.",
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1" },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0" },
      { input: "nums = [11,13,15,17]", output: "11" },
    ],
    intuition: "The array is two sorted halves. In binary search, if the middle is larger than the right end, the minimum is in the right half. Otherwise it is in the left half (including mid).",
    approach: [
      "Set lo=0, hi=n-1.",
      "While lo < hi: compute mid.",
      "If nums[mid] > nums[hi], minimum is in (mid, hi] so lo = mid+1.",
      "Else minimum is in [lo, mid] so hi = mid.",
      "Return nums[lo].",
    ],
    solution: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Binary search on rotated ranges models how consistent-hashing rings are searched for the next responsible node after a rotation in the ring. Cluster schedulers (Kubernetes) use similar binary search on sorted node-capacity arrays to find the smallest node that fits a workload.",
    pitfalls: ["Compare mid with hi (not lo) to decide which half to search — comparing with lo can be ambiguous.", "The array has unique elements; duplicates require a different approach."],
  },
  {
    id: "arrays-32",
    title: "4Sum",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    statement: "Given an integer array nums and a target integer, return all unique quadruplets [a,b,c,d] such that a+b+c+d == target.",
    examples: [
      { input: "nums = [1,0,-1,0,-2,2], target = 0", output: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]" },
      { input: "nums = [2,2,2,2,2], target = 8", output: "[[2,2,2,2]]" },
    ],
    intuition: "Extend the 3Sum idea by adding an outer loop. Fix two numbers (with duplicate skipping) and use the two-pointer technique on the remaining sorted portion for the last two.",
    approach: [
      "Sort nums.",
      "Outer loop index i, inner loop index j (both with duplicate skipping).",
      "Use two pointers l and r on the remaining sub-array.",
      "Collect quadruplets that sum to target, skipping duplicates on l and r.",
    ],
    solution: `function fourSum(nums, target) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    for (let j = i + 1; j < nums.length - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      let l = j + 1, r = nums.length - 1;
      while (l < r) {
        const s = nums[i] + nums[j] + nums[l] + nums[r];
        if (s === target) {
          res.push([nums[i], nums[j], nums[l], nums[r]]);
          while (l < r && nums[l] === nums[l + 1]) l++;
          while (l < r && nums[r] === nums[r - 1]) r--;
          l++; r--;
        } else if (s < target) l++;
        else r--;
      }
    }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n³)", space: "O(1)" },
    systemDesign: "k-Sum generalises to multi-column equality JOIN conditions in relational query optimisers. For large k, hashing-based approaches (build a hash of pair sums) reduce complexity — database hash-join uses this to reduce multi-way joins from O(n^k) to O(n^(k/2)).",
    pitfalls: ["Skip duplicates for BOTH outer loops and both pointers to avoid duplicate quadruplets.", "Use long arithmetic for targets near INT_MAX to avoid overflow (less relevant in JavaScript)."],
  },
  {
    id: "arrays-33",
    title: "Encode and Decode Strings",
    difficulty: "Medium",
    tags: ["Array", "Hashing", "String", "Design"],
    statement: "Design an algorithm to encode a list of strings to a single string and decode it back. The codec must handle any characters including special characters.",
    examples: [
      { input: "strs = [\"Hello\",\"World\"]", output: "encode: \"5#Hello5#World\"; decode: [\"Hello\",\"World\"]" },
      { input: "strs = [\"\",\"abc\"]", output: "encode: \"0#3#abc\"; decode: [\"\",\"abc\"]" },
    ],
    intuition: "Prefix each string with its length and a separator character. To decode, read the length, skip the separator, then read exactly that many characters — no ambiguity even if the string contains the separator.",
    approach: [
      "Encode: for each string, prepend len + '#' + string.",
      "Decode: start at index 0; find the next '#', parse the length, slice out that many characters, advance.",
    ],
    solution: `function encode(strs) {
  return strs.map(s => s.length + "#" + s).join("");
}
function decode(s) {
  const res = [];
  let i = 0;
  while (i < s.length) {
    const j = s.indexOf("#", i);
    const len = parseInt(s.slice(i, j));
    res.push(s.slice(j + 1, j + 1 + len));
    i = j + 1 + len;
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Length-prefixed framing is the foundation of binary network protocols (HTTP/2, gRPC/protobuf, Kafka wire format) — each message is preceded by a 4-byte length so receivers know exactly how many bytes to read without scanning for a delimiter. This eliminates delimiter-injection vulnerabilities.",
    pitfalls: ["Delimiter-only encoding fails when strings contain the delimiter.", "Length prefix must be terminated by a non-digit sentinel (here '#') to handle multi-digit lengths correctly."],
  },
  {
    id: "arrays-34",
    title: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window", "Two Pointers"],
    statement: "Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. Return 0 if no such subarray exists.",
    examples: [
      { input: "nums = [2,3,1,2,4,3], target = 7", output: "2", explanation: "Subarray [4,3] has the minimal length." },
      { input: "nums = [1,4,4], target = 4", output: "1" },
    ],
    intuition: "Use a sliding window. Expand by moving the right pointer and shrink from the left whenever the window sum meets the target. Record the smallest valid window size seen.",
    approach: [
      "Initialize left=0, sum=0, minLen=Infinity.",
      "Advance right, adding nums[right] to sum.",
      "While sum >= target: update minLen, subtract nums[left], advance left.",
      "Return minLen === Infinity ? 0 : minLen.",
    ],
    solution: `function minSubArrayLen(target, nums) {
  let left = 0, sum = 0, min = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      min = Math.min(min, right - left + 1);
      sum -= nums[left++];
    }
  }
  return min === Infinity ? 0 : min;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Variable-size sliding windows underlie TCP congestion control (shrink/expand the window based on ACKs and losses) and rate-limiting algorithms like the token-bucket or sliding-window counter used in API gateways to enforce requests-per-second limits.",
    pitfalls: ["This only works for positive numbers — negative values break the monotonicity needed for shrinking.", "The inner while loop keeps shrinking until the window is invalid again, not just once."],
  },
  {
    id: "arrays-35",
    title: "Longest Subarray of 1s After Deleting One Element",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window"],
    statement: "Given a binary array nums, return the length of the longest subarray containing only 1s after deleting one element.",
    examples: [
      { input: "nums = [1,1,0,1]", output: "3" },
      { input: "nums = [0,1,1,1,0,1,1,0,1]", output: "5" },
      { input: "nums = [1,1,1]", output: "2" },
    ],
    intuition: "Slide a window that is allowed to contain at most one zero. When the window gets a second zero, shrink from the left until only one zero remains. The answer is the best window size minus 1 (for the deleted element).",
    approach: [
      "Track zeros count in the window and left pointer.",
      "Expand right; if nums[right]==0, increment zeros.",
      "While zeros > 1, if nums[left]==0 decrement zeros, advance left.",
      "Track max window size; subtract 1 from the best window size at the end.",
    ],
    solution: `function longestSubarray(nums) {
  let left = 0, zeros = 0, best = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    while (zeros > 1) { if (nums[left] === 0) zeros--; left++; }
    best = Math.max(best, right - left);
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "At-most-k-defects sliding windows appear in quality-control sampling systems (accept a batch if it has at most k defective items) and in network packet analysis (find the longest transmission sequence with at most k dropped packets). CDN cache-hit-rate windows use similar logic.",
    pitfalls: ["The answer is window size - 1 because one element must be deleted (even from an all-ones array).", "Note: right - left already excludes one element since left is inclusive."],
  },
  {
    id: "arrays-36",
    title: "Jump Game",
    difficulty: "Medium",
    tags: ["Array", "Greedy"],
    statement: "Given an integer array nums where nums[i] is the maximum jump length at index i, return true if you can reach the last index starting from index 0.",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true" },
      { input: "nums = [3,2,1,0,4]", output: "false" },
    ],
    intuition: "Keep track of the furthest index you can reach. At each step, if the current index is beyond the furthest reachable, you are stuck. Otherwise update the furthest reach.",
    approach: [
      "Initialize maxReach = 0.",
      "For each index i from 0 to n-1: if i > maxReach, return false.",
      "Update maxReach = Math.max(maxReach, i + nums[i]).",
      "Return true.",
    ],
    solution: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Reachability analysis over a graph of steps is used in distributed workflow engines (Apache Airflow DAG reachability) and in compiler dead-code elimination (can this basic block be reached?). The greedy maximum-reach idea also underpins link-state routing protocols that compute the furthest reachable nodes in a network.",
    pitfalls: ["A zero at index 0 means you cannot move at all (unless n==1).", "You do not need to reach exactly the last index — stopping anywhere beyond is fine, but the problem asks for the last index specifically."],
  },
  // ---- HARD (15 problems) ----
  {
    id: "arrays-37",
    title: "First Missing Positive",
    difficulty: "Hard",
    tags: ["Array", "Hashing"],
    statement: "Given an unsorted integer array nums, return the smallest missing positive integer. Solve in O(n) time and O(1) space.",
    examples: [
      { input: "nums = [1,2,0]", output: "3" },
      { input: "nums = [3,4,-1,1]", output: "2" },
      { input: "nums = [7,8,9,11,12]", output: "1" },
    ],
    intuition: "The answer must be in [1, n+1]. Use the array itself as a hash table: put each number x in position x-1 if 1 <= x <= n. Then scan for the first index where nums[i] != i+1.",
    approach: [
      "Cycle through the array; while nums[i] is in [1,n] and nums[nums[i]-1] != nums[i], swap nums[i] with nums[nums[i]-1].",
      "After placing, scan from left: the first index where nums[i] != i+1 gives the answer i+1.",
      "If all positions are correct, return n+1.",
    ],
    solution: `function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const j = nums[i] - 1;
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }
  for (let i = 0; i < n; i++) if (nums[i] !== i + 1) return i + 1;
  return n + 1;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "In-place index-as-hash-table is used in sparse-array compaction (finding holes in an ID sequence) and in storage engine page allocation bitmaps where each bit represents whether a page is free. Distributed ID-generation services (Twitter Snowflake, UUID v7) monitor for gaps to detect and reclaim unused IDs.",
    pitfalls: ["The while loop is amortised O(n) total — each element is swapped at most once to its final home.", "Duplicates in the valid range must not cause infinite loops — the guard nums[nums[i]-1] != nums[i] handles this."],
  },
  {
    id: "arrays-38",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    statement: "Given n non-negative integers representing an elevation map where each bar has width 1, compute how much water it can trap after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    intuition: "Water above any bar equals the minimum of the tallest bar to its left and the tallest bar to its right, minus its own height. With two pointers, the side with the smaller maximum height is the bottleneck — process that side.",
    approach: [
      "Set left=0, right=n-1, leftMax=0, rightMax=0, water=0.",
      "While left < right: if leftMax <= rightMax, process left side; else process right side.",
      "On the left side: if height[left] >= leftMax update leftMax; else add leftMax - height[left] to water. Advance left.",
      "Mirror for the right side.",
    ],
    solution: `function trap(height) {
  let l = 0, r = height.length - 1;
  let lMax = 0, rMax = 0, water = 0;
  while (l < r) {
    if (lMax <= rMax) {
      if (height[l] >= lMax) lMax = height[l];
      else water += lMax - height[l];
      l++;
    } else {
      if (height[r] >= rMax) rMax = height[r];
      else water += rMax - height[r];
      r--;
    }
  }
  return water;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Rain-water trapping models buffer/queue backpressure in streaming pipelines: water accumulation corresponds to data accumulation between two processing stages. In cloud cost modelling, the pattern appears in reserved-capacity planning — unused capacity 'fills up' like trapped water between demand spikes.",
    pitfalls: ["Pre-computing leftMax and rightMax arrays also works in O(n)/O(n) but uses extra space.", "The bottleneck side is the one with the smaller max — always process that side to guarantee correctness."],
  },
  {
    id: "arrays-39",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    statement: "Given two sorted arrays nums1 and nums2 of sizes m and n, return the median of the two sorted arrays. Solve in O(log(m+n)) time.",
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.0" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.5" },
    ],
    intuition: "Binary search on the partition point of the smaller array. A valid partition splits both arrays so the left halves together hold exactly half the total elements and every left element is ≤ every right element.",
    approach: [
      "Ensure nums1 is the smaller array.",
      "Binary search partition i in nums1 (0 to m); derive j = (m+n+1)/2 - i.",
      "Check max(left1, left2) <= min(right1, right2). If not, adjust binary search direction.",
      "Compute median from the boundary elements.",
    ],
    solution: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length, n = nums2.length;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1;
    const j = ((m + n + 1) >> 1) - i;
    const l1 = i === 0 ? -Infinity : nums1[i - 1];
    const r1 = i === m ? Infinity : nums1[i];
    const l2 = j === 0 ? -Infinity : nums2[j - 1];
    const r2 = j === n ? Infinity : nums2[j];
    if (l1 <= r2 && l2 <= r1) {
      if ((m + n) % 2 === 1) return Math.max(l1, l2);
      return (Math.max(l1, l2) + Math.min(r1, r2)) / 2;
    } else if (l1 > r2) hi = i - 1;
    else lo = i + 1;
  }
}`,
    language: "javascript",
    complexity: { time: "O(log(min(m,n)))", space: "O(1)" },
    systemDesign: "Order-statistic queries (find the k-th element across distributed sorted segments) appear in distributed sort-merge operations in Hadoop/Spark. Finding the global median across shards uses a binary-search-on-answer approach analogous to this algorithm, enabling analytics over petabyte-scale sorted data without full materialisation.",
    pitfalls: ["Always binary search on the shorter array to keep O(log(min(m,n))).", "Handle edge partitions (i=0, i=m, j=0, j=n) with ±Infinity sentinels."],
  },
  {
    id: "arrays-40",
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    tags: ["Array", "Stack", "Monotonic Stack"],
    statement: "Given an array of integers heights representing a histogram's bar heights, find the area of the largest rectangle in the histogram.",
    examples: [
      { input: "heights = [2,1,5,6,2,3]", output: "10" },
      { input: "heights = [2,4]", output: "4" },
    ],
    intuition: "Use a stack that keeps bars in increasing height order. When a shorter bar arrives, it 'closes' all taller bars in the stack. For each closed bar, its width extends back to the previous shorter bar.",
    approach: [
      "Use a stack of [index, height] pairs; append a sentinel 0-height bar at the end.",
      "For each bar: while stack top is taller than current, pop and compute area (popped height × (current index - stack-after-pop index)).",
      "Push current bar with the start index of the last popped bar (or current index).",
      "Track maximum area.",
    ],
    solution: `function largestRectangleArea(heights) {
  const stack = []; // [startIndex, height]
  let maxArea = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i < heights.length ? heights[i] : 0;
    let start = i;
    while (stack.length && stack[stack.length - 1][1] > h) {
      const [idx, ht] = stack.pop();
      maxArea = Math.max(maxArea, ht * (i - idx));
      start = idx;
    }
    stack.push([start, h]);
  }
  return maxArea;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Largest-rectangle-in-histogram is the subroutine for the maximal-rectangle-in-binary-matrix problem, which appears in image segmentation and OCR bounding-box detection. Monotonic stacks also power next-greater-element lookups in stock ticker systems and expression-evaluation engines.",
    pitfalls: ["The sentinel 0-height bar flushes all remaining stack entries at the end — do not forget it.", "When popping, the rectangle's width extends back to the popped bar's start index, not the current index."],
  },
  {
    id: "arrays-41",
    title: "Maximal Rectangle",
    difficulty: "Hard",
    tags: ["Array", "Stack", "Dynamic Programming", "Matrix"],
    statement: "Given a binary matrix filled with 0s and 1s, find the largest rectangle containing only 1s and return its area.",
    examples: [
      { input: "matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]", output: "6" },
      { input: "matrix = [[\"0\"]]", output: "0" },
    ],
    intuition: "Treat each row as the base of a histogram. The bar height at each column is the number of consecutive 1s ending at the current row. Apply the largest-rectangle-in-histogram algorithm to each row's histogram.",
    approach: [
      "Maintain a heights array of length n, initialised to 0.",
      "For each row: if cell is '1', increment heights[j]; else reset to 0.",
      "Run largestRectangleArea on heights.",
      "Track the global maximum.",
    ],
    solution: `function maximalRectangle(matrix) {
  if (!matrix.length) return 0;
  const n = matrix[0].length;
  const heights = new Array(n).fill(0);
  let max = 0;
  for (const row of matrix) {
    for (let j = 0; j < n; j++)
      heights[j] = row[j] === "1" ? heights[j] + 1 : 0;
    const stack = [];
    for (let i = 0; i <= n; i++) {
      const h = i < n ? heights[i] : 0;
      let start = i;
      while (stack.length && stack[stack.length - 1][1] > h) {
        const [idx, ht] = stack.pop();
        max = Math.max(max, ht * (i - idx));
        start = idx;
      }
      stack.push([start, h]);
    }
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(n)" },
    systemDesign: "Maximal-rectangle detection is used in document layout analysis (finding the biggest blank area to insert content) and in VLSI floorplanning (finding the largest empty region on a chip layout). In 2D spatial databases, this pattern helps answer 'largest obstacle-free bounding box' queries.",
    pitfalls: ["Reset height to 0 on a '0' cell — the streak is broken.", "Reuse the histogram subroutine to avoid duplicating the stack logic."],
  },
  {
    id: "arrays-42",
    title: "Jump Game II",
    difficulty: "Hard",
    tags: ["Array", "Greedy", "Dynamic Programming"],
    statement: "Given an array nums where nums[i] is the maximum jump length at index i, return the minimum number of jumps to reach the last index. You can always reach the last index.",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "2", explanation: "Jump from index 0 to 1, then to last." },
      { input: "nums = [2,3,0,1,4]", output: "2" },
    ],
    intuition: "Think of it like BFS levels. From the current range, find the furthest you can reach (next level). When you reach the end of the current range, you must take a jump — that advances the level counter.",
    approach: [
      "Track curEnd (end of current jump range), farthest (max reach from current range), jumps.",
      "Iterate from 0 to n-2.",
      "Update farthest = max(farthest, i + nums[i]).",
      "When i == curEnd, increment jumps and set curEnd = farthest.",
    ],
    solution: `function jump(nums) {
  let jumps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === curEnd) { jumps++; curEnd = farthest; }
  }
  return jumps;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Minimum-jump/minimum-hop path problems model network routing where each router can forward packets up to k hops and you want the minimum-latency path. CDN routing algorithms that minimise the number of edge-server hops use greedy reach maximisation to select the fewest forwarding steps.",
    pitfalls: ["Stop the loop at n-2 — no jump is needed from the last index.", "This greedy works because from any position you always choose the furthest possible reach, so you never need more jumps than necessary."],
  },
  {
    id: "arrays-43",
    title: "Candy",
    difficulty: "Hard",
    tags: ["Array", "Greedy"],
    statement: "There are n children standing in a line each with a rating value. Give each child at least one candy. Children with a higher rating than their neighbour must get more candies. Return the minimum total candies needed.",
    examples: [
      { input: "ratings = [1,0,2]", output: "5" },
      { input: "ratings = [1,2,2]", output: "4" },
    ],
    intuition: "Do two passes. First pass left to right: if a child rates higher than the left neighbour, give one more candy than that neighbour. Second pass right to left: do the same from the right. Take the max of both passes at each position.",
    approach: [
      "Initialize candies array with all 1s.",
      "Left-to-right pass: if ratings[i] > ratings[i-1], candies[i] = candies[i-1]+1.",
      "Right-to-left pass: if ratings[i] > ratings[i+1], candies[i] = max(candies[i], candies[i+1]+1).",
      "Return sum of candies.",
    ],
    solution: `function candy(ratings) {
  const n = ratings.length;
  const candies = new Array(n).fill(1);
  for (let i = 1; i < n; i++)
    if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
  for (let i = n - 2; i >= 0; i--)
    if (ratings[i] > ratings[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1);
  return candies.reduce((a, b) => a + b, 0);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Two-pass constraint satisfaction appears in dependency-ordering problems in build systems (assign build levels such that each dependent gets a higher level than its dependency). Database query planners use a similar two-pass approach for topological ordering of join dependencies.",
    pitfalls: ["One pass alone is insufficient — you need both left-to-right and right-to-left to satisfy both-neighbour constraints.", "Equal ratings do not require more candies — only strictly greater."],
  },
  {
    id: "arrays-44",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window", "Deque", "Monotonic Queue"],
    statement: "Given an integer array nums and an integer k, return the max value in each sliding window of size k as the window slides from left to right.",
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    intuition: "Use a deque that always stores indices in decreasing order of their values. When the window slides, pop from the front if the front index is out of the window. Pop from the back any index whose value is smaller than the incoming value — it can never be the max.",
    approach: [
      "Maintain a deque of indices (values in decreasing order).",
      "For each new index i: pop front if out of window, pop back while nums[back] <= nums[i].",
      "Push i to back.",
      "Append nums[deque.front] to result when the first full window is formed.",
    ],
    solution: `function maxSlidingWindow(nums, k) {
  const deque = [], res = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] < i - k + 1) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) res.push(nums[deque[0]]);
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "Monotonic deque windows power real-time max/min dashboards in financial trading systems (e.g. highest bid in the last 60 seconds). Apache Flink and Spark Structured Streaming implement sliding-window aggregates using monotonic deques to achieve O(1) amortised update cost per event, enabling millions-of-events-per-second throughput.",
    pitfalls: ["Use deque.shift() only when the front is strictly outside the window (index < i-k+1).", "The deque stores indices, not values — this allows out-of-window checks."],
  },
  {
    id: "arrays-45",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    tags: ["Array", "Hashing", "Sliding Window", "String"],
    statement: "Given strings s and t, return the minimum window substring of s that contains every character of t (including duplicates). If no such substring exists, return an empty string.",
    examples: [
      { input: "s = \"ADOBECODEBANC\", t = \"ABC\"", output: "\"BANC\"" },
      { input: "s = \"a\", t = \"a\"", output: "\"a\"" },
      { input: "s = \"a\", t = \"aa\"", output: "\"\"" },
    ],
    intuition: "Slide two pointers over s. Expand the right pointer to include characters from t. Once all characters of t are covered, shrink from the left to find the minimum valid window.",
    approach: [
      "Build a frequency map for t and track 'have' vs 'need' counts.",
      "Expand right pointer; when a character's frequency meets t's requirement, increment 'have'.",
      "When have == need, record window size, then shrink left pointer.",
      "Shrink until the window is invalid, then expand again.",
    ],
    solution: `function minWindow(s, t) {
  if (!t) return "";
  const need = new Map(), have = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  let formed = 0, required = need.size;
  let l = 0, minLen = Infinity, minStart = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    have.set(c, (have.get(c) || 0) + 1);
    if (need.has(c) && have.get(c) === need.get(c)) formed++;
    while (formed === required) {
      if (r - l + 1 < minLen) { minLen = r - l + 1; minStart = l; }
      const lc = s[l++];
      have.set(lc, have.get(lc) - 1);
      if (need.has(lc) && have.get(lc) < need.get(lc)) formed--;
    }
  }
  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}`,
    language: "javascript",
    complexity: { time: "O(|s|+|t|)", space: "O(|s|+|t|)" },
    systemDesign: "Minimum-window substring is the template for search-query term coverage in search engines (find the shortest document snippet containing all query terms) and for log-pattern matching in SIEM systems that look for the tightest event window containing a full attack sequence. Full-text search engines like Elasticsearch use similar span-query logic.",
    pitfalls: ["Track how many distinct characters are fully satisfied (formed) separately from total character counts.", "Shrink the left pointer aggressively until the window is invalid to minimise window size."],
  },
  {
    id: "arrays-46",
    title: "Count of Smaller Numbers After Self",
    difficulty: "Hard",
    tags: ["Array", "Sorting", "Merge Sort", "Binary Indexed Tree"],
    statement: "Given an integer array nums, return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i].",
    examples: [
      { input: "nums = [5,2,6,1]", output: "[2,1,1,0]" },
      { input: "nums = [-1]", output: "[0]" },
      { input: "nums = [-1,-1]", output: "[0,0]" },
    ],
    intuition: "During merge sort, whenever an element from the right half is placed before an element from the left half, it means all remaining left-half elements are greater than this right-half element. Count these inversions.",
    approach: [
      "Pair each element with its original index.",
      "Merge sort the pairs by value.",
      "During merge: when a right-half element is chosen over left-half elements, increment the count for each left-half element still waiting.",
      "Accumulate counts back into the result array using original indices.",
    ],
    solution: `function countSmaller(nums) {
  const n = nums.length;
  const result = new Array(n).fill(0);
  const indexed = nums.map((v, i) => [v, i]);
  function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = arr.length >> 1;
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    const merged = [];
    let l = 0, r = 0;
    while (l < left.length && r < right.length) {
      if (left[l][0] <= right[r][0]) {
        result[left[l][1]] += r;
        merged.push(left[l++]);
      } else {
        merged.push(right[r++]);
      }
    }
    while (l < left.length) { result[left[l][1]] += r; merged.push(left[l++]); }
    while (r < right.length) merged.push(right[r++]);
    return merged;
  }
  mergeSort(indexed);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Inversion counting is used in collaborative filtering to measure similarity between two users' preference rankings (Kendall Tau distance). In distributed databases, inversion metrics help detect skew in data partitioning — highly skewed partitions have more inversions relative to a balanced sort.",
    pitfalls: ["When the left element is chosen, the right pointer r tells exactly how many right elements have already been placed (they are all smaller).", "Stable merge is required — use <= for the left-wins condition."],
  },
  {
    id: "arrays-47",
    title: "Maximum Sum of Two Non-Overlapping Subarrays",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window", "Prefix Sum"],
    statement: "Given an integer array nums and two integers firstLen and secondLen, return the maximum sum of elements in two non-overlapping subarrays with lengths firstLen and secondLen.",
    examples: [
      { input: "nums = [0,6,5,2,2,5,1,9,4], firstLen = 1, secondLen = 2", output: "20" },
      { input: "nums = [3,8,1,3,2,1,8,9,0], firstLen = 3, secondLen = 2", output: "29" },
    ],
    intuition: "Compute prefix sums first. Then slide a window of length secondLen while tracking the best window of length firstLen seen so far to the left. Do the same with the roles reversed and take the overall maximum.",
    approach: [
      "Build prefix sum array.",
      "Helper function: for each end position of a length-B window, track max of a length-A window ending before it.",
      "Call helper twice (A before B, B before A) and return the max.",
    ],
    solution: `function maxSumTwoNoOverlap(nums, firstLen, secondLen) {
  const n = nums.length;
  const pre = [0];
  for (const v of nums) pre.push(pre[pre.length - 1] + v);
  const sum = (l, r) => pre[r + 1] - pre[l];
  function best(L, M) {
    let maxL = 0, res = 0;
    for (let i = L + M - 1; i < n; i++) {
      maxL = Math.max(maxL, sum(i - L - M + 1, i - M));
      res = Math.max(res, maxL + sum(i - M + 1, i));
    }
    return res;
  }
  return Math.max(best(firstLen, secondLen), best(secondLen, firstLen));
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Non-overlapping window optimisation models resource allocation in cloud scheduling: assign two non-overlapping time slots to two jobs to maximise combined throughput. Ad-auction systems use the same logic to allocate non-overlapping display slots across a page to maximise total bid revenue.",
    pitfalls: ["Try both orderings (L before M and M before L) because the optimal arrangement may place either window first.", "Track maxL as a running maximum — recomputing from scratch for each position is O(n²)."],
  },
  {
    id: "arrays-48",
    title: "Shortest Unsorted Continuous Subarray",
    difficulty: "Hard",
    tags: ["Array", "Sorting", "Two Pointers"],
    statement: "Given an integer array nums, return the length of the shortest subarray that, if sorted, would make the whole array sorted.",
    examples: [
      { input: "nums = [2,6,4,8,10,9,15]", output: "5", explanation: "Sort [6,4,8,10,9] to make the array sorted." },
      { input: "nums = [1,2,3,4,5]", output: "0" },
      { input: "nums = [1]", output: "0" },
    ],
    intuition: "Find the minimum and maximum in the 'wrong' middle section. The left boundary is the first element greater than this min; the right boundary is the last element less than this max.",
    approach: [
      "Find the first descent from the left (nums[i] > nums[i+1]) and the last ascent from the right.",
      "Find min and max of the subarray between these bounds.",
      "Extend the left boundary to include any value greater than this min.",
      "Extend the right boundary to include any value less than this max.",
      "Return right - left + 1, or 0 if already sorted.",
    ],
    solution: `function findUnsortedSubarray(nums) {
  const n = nums.length;
  let lo = -1, hi = -2;
  let min = nums[n - 1], max = nums[0];
  for (let i = 1; i < n; i++) {
    max = Math.max(max, nums[i]);
    if (nums[i] < max) hi = i;
  }
  for (let i = n - 2; i >= 0; i--) {
    min = Math.min(min, nums[i]);
    if (nums[i] > min) lo = i;
  }
  return hi - lo + 1;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Detecting partially-sorted regions is used in incremental index maintenance in databases: when new rows are inserted, the system identifies the minimal index range to rebuild rather than reindexing the entire structure. LSM-tree compaction also finds the minimal overlapping key range across SSTables to merge.",
    pitfalls: ["Initialize hi = -2 and lo = -1 so that hi - lo + 1 = 0 when the array is already sorted.", "The two passes must track the global running max/min respectively, not just local neighbours."],
  },
  {
    id: "arrays-49",
    title: "Maximum Points on a Line",
    difficulty: "Hard",
    tags: ["Array", "Hashing", "Math", "Geometry"],
    statement: "Given an array of points on a plane, return the maximum number of points that lie on the same line.",
    examples: [
      { input: "points = [[1,1],[2,2],[3,3]]", output: "3" },
      { input: "points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]", output: "4" },
    ],
    intuition: "For each anchor point, compute the slope to every other point and store slopes in a hash map. The slope with the most occurrences plus one (for the anchor) is the largest line through that anchor. Take the max over all anchors.",
    approach: [
      "For each point i as anchor, create a slope frequency map.",
      "For each other point j, compute slope as a reduced fraction (dy/gcd, dx/gcd) to avoid floating-point issues.",
      "Handle vertical lines and duplicate points separately.",
      "Track max count = max slope frequency + 1 + duplicates.",
    ],
    solution: `function maxPoints(points) {
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  let ans = 1;
  for (let i = 0; i < points.length; i++) {
    const map = new Map();
    let dup = 1;
    for (let j = i + 1; j < points.length; j++) {
      let dy = points[j][1] - points[i][1];
      let dx = points[j][0] - points[i][0];
      if (dy === 0 && dx === 0) { dup++; continue; }
      const g = gcd(Math.abs(dy), Math.abs(dx));
      dy /= g; dx /= g;
      if (dx < 0) { dy = -dy; dx = -dx; }
      const key = dy + "," + dx;
      map.set(key, (map.get(key) || 0) + 1);
    }
    let localMax = 0;
    for (const v of map.values()) localMax = Math.max(localMax, v);
    ans = Math.max(ans, localMax + dup);
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n)" },
    systemDesign: "Collinear-point detection underlies GPS trajectory analysis (detecting whether movement follows a straight road segment) and fraud detection (identifying if a series of transactions follows a linear spending pattern). Spatial databases like PostGIS index geometric relationships using similar slope-normalisation hashing for line detection.",
    pitfalls: ["Use reduced fractions (dy/gcd, dx/gcd) as the slope key — floating-point division causes precision errors.", "Normalise the sign of dx to be non-negative to avoid counting the same line twice in opposite directions."],
  },
  {
    id: "arrays-50",
    title: "Number of Subarrays with Bounded Maximum",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers"],
    statement: "Given an integer array nums and two integers left and right, return the number of (contiguous, non-empty) subarrays such that the maximum element is in the inclusive range [left, right].",
    examples: [
      { input: "nums = [2,1,4,3], left = 2, right = 3", output: "3" },
      { input: "nums = [2,9,2,5,6], left = 2, right = 8", output: "7" },
    ],
    intuition: "Count subarrays whose max is ≤ right, then subtract subarrays whose max is ≤ left-1. The difference gives subarrays whose max is in [left, right].",
    approach: [
      "Define a helper count(k) that counts subarrays with max ≤ k using a sliding window.",
      "For each right pointer, extend the window while nums[r] <= k; add (r - left + 1) to result.",
      "When nums[r] > k, reset left = r + 1.",
      "Return count(right) - count(left - 1).",
    ],
    solution: `function numSubarrayBoundedMax(nums, left, right) {
  function countAtMost(k) {
    let res = 0, cur = 0;
    for (const n of nums) {
      cur = n <= k ? cur + 1 : 0;
      res += cur;
    }
    return res;
  }
  return countAtMost(right) - countAtMost(left - 1);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Complement counting (count total minus out-of-range) is a key database query optimisation — instead of materialising a complex range predicate, compute two simpler range prefix counts and subtract. This technique is used in columnar analytics engines (BigQuery, Redshift) for histogram-based cardinality estimation and query cost prediction.",
    pitfalls: ["The helper counts subarrays with max ≤ k, not max == k — the subtraction gives the exact range.", "When a value exceeds k, the window must reset to the next position because no subarray spanning this element can qualify."],
  },
];
