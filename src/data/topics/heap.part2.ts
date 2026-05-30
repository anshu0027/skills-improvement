import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  {
    id: "heap-26",
    title: "Meeting Rooms II",
    difficulty: "Medium",
    tags: ["Heap", "Greedy", "Sorting"],
    statement: "Given an array of meeting time intervals [start, end], find the minimum number of conference rooms required.",
    examples: [
      { input: "intervals = [[0,30],[5,10],[15,20]]", output: "2", explanation: "Meeting [0,30] overlaps with both others, so 2 rooms needed." },
    ],
    intuition: "Sort meetings by start time. Use a min-heap of end times — it tells you the earliest a room frees up. If the next meeting starts after the heap top, reuse that room; otherwise open a new one.",
    approach: [
      "Sort intervals by start time.",
      "Use a min-heap tracking end times of active meetings.",
      "For each meeting, if heap top <= start, pop (reuse room).",
      "Push current end time onto heap.",
      "Return heap size.",
    ],
    solution: `function minMeetingRooms(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const heap = new MinHeap();
  for (const [s, e] of intervals) {
    if (heap.size() && heap.peek() <= s) heap.pop();
    heap.push(e);
  }
  return heap.size();
}
class MinHeap {
  constructor() { this.h = []; }
  size() { return this.h.length; }
  peek() { return this.h[0]; }
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
    const top = this.h[0]; const last = this.h.pop();
    if (this.h.length) { this.h[0] = last; this._down(0); }
    return top;
  }
  _down(i) {
    const n = this.h.length;
    while (true) {
      let s = i, l = 2*i+1, r = 2*i+2;
      if (l < n && this.h[l] < this.h[s]) s = l;
      if (r < n && this.h[r] < this.h[s]) s = r;
      if (s === i) break;
      [this.h[s], this.h[i]] = [this.h[i], this.h[s]]; i = s;
    }
  }
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Calendar/booking systems (Google Calendar, Calendly) use this pattern to calculate peak concurrent resource usage. Cloud schedulers apply the same idea to compute how many VMs to keep warm.",
    pitfalls: ["Sort by start, not end.", "Use <= when comparing heap top to start (back-to-back meetings share a room)."],
  },
  {
    id: "heap-27",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    tags: ["Heap", "Linked List", "Divide and Conquer"],
    statement: "You are given an array of k linked lists, each sorted in ascending order. Merge all lists into one sorted linked list and return it.",
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
    ],
    intuition: "Imagine k sorted piles of cards face-up. Always pick the smallest top card. A min-heap tracks the top of each pile so you always grab the minimum in O(log k) instead of scanning all k piles.",
    approach: [
      "Push the head node of every non-null list into a min-heap keyed by node value.",
      "Pop the minimum node, attach it to the result list.",
      "If the popped node has a next, push that next node onto the heap.",
      "Repeat until heap is empty.",
    ],
    solution: `function mergeKLists(lists) {
  const heap = new MinHeap((a, b) => a.val - b.val);
  for (const node of lists) if (node) heap.push(node);
  const dummy = { next: null }; let cur = dummy;
  while (heap.size()) {
    const node = heap.pop();
    cur.next = node; cur = cur.next;
    if (node.next) heap.push(node.next);
  }
  return dummy.next;
}
class MinHeap {
  constructor(cmp) { this.h = []; this.cmp = cmp; }
  size() { return this.h.length; }
  push(v) {
    this.h.push(v); let i = this.h.length - 1;
    while (i > 0) {
      const p = (i-1)>>1;
      if (this.cmp(this.h[p], this.h[i]) <= 0) break;
      [this.h[p],this.h[i]]=[this.h[i],this.h[p]]; i=p;
    }
  }
  pop() {
    const top = this.h[0]; const last = this.h.pop();
    if (this.h.length) { this.h[0]=last; this._down(0); }
    return top;
  }
  _down(i) {
    const n=this.h.length;
    while(true){
      let s=i,l=2*i+1,r=2*i+2;
      if(l<n&&this.cmp(this.h[l],this.h[s])<0)s=l;
      if(r<n&&this.cmp(this.h[r],this.h[s])<0)s=r;
      if(s===i)break;
      [this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;
    }
  }
}`,
    language: "javascript",
    complexity: { time: "O(N log k)", space: "O(k)" },
    systemDesign: "K-way merge is the core of external merge sort used by databases (PostgreSQL sort_merge_join) and distributed systems (Hadoop MapReduce reduce phase) when data exceeds RAM.",
  },
  {
    id: "heap-28",
    title: "Smallest Range Covering Elements from K Lists",
    difficulty: "Hard",
    tags: ["Heap", "Sliding Window", "Greedy"],
    statement: "You have k sorted lists of integers. Find the smallest range [a, b] such that there is at least one number from each list in [a, b].",
    examples: [
      { input: "nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]", output: "[20,24]" },
    ],
    intuition: "Keep one pointer per list in a min-heap. The range is [heap-min, current-max]. Advance the pointer from the list that contributed the minimum — shrinking the range from the bottom is the only way to improve it.",
    approach: [
      "Push (value, listIndex, elementIndex) for each list's first element into a min-heap; track global max.",
      "Record current range [heap.peek().val, max].",
      "Pop the minimum; if its list has a next element, push it and update max.",
      "Update best range if new range is smaller.",
      "Stop when the popped list has no next element.",
    ],
    solution: `function smallestRange(nums) {
  const heap = new MinHeap((a,b)=>a[0]-b[0]);
  let max = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    heap.push([nums[i][0], i, 0]);
    max = Math.max(max, nums[i][0]);
  }
  let res = [-100000, 100000];
  while (heap.size() === nums.length) {
    const [val, li, ei] = heap.pop();
    if (max - val < res[1] - res[0]) res = [val, max];
    if (ei + 1 < nums[li].length) {
      heap.push([nums[li][ei+1], li, ei+1]);
      max = Math.max(max, nums[li][ei+1]);
    }
  }
  return res;
}
class MinHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])<=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const top=this.h[0];const last=this.h.pop();if(this.h.length){this.h[0]=last;this._down(0);}return top;}
  _down(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])<0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])<0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(N log k)", space: "O(k)" },
    systemDesign: "Multi-source data federation — finding a consistent snapshot window across k shards uses this same sliding-minimum idea. Time-series joins across distributed sensors apply similar range-covering logic.",
  },
  {
    id: "heap-29",
    title: "IPO",
    difficulty: "Hard",
    tags: ["Heap", "Greedy"],
    statement: "You can complete at most k projects. Each project has a profit and a capital requirement. Start with w capital. Each time, pick an available project maximizing profit to accumulate more capital. Return maximum capital after k projects.",
    examples: [
      { input: "k=2, w=0, profits=[1,2,3], capital=[0,1,1]", output: "4" },
    ],
    intuition: "Think of unlocked projects as items you can buy with your current cash. Always buy the most profitable item available — greedy choice. Use a max-heap of profits for available projects and a min-heap of capital to unlock new ones.",
    approach: [
      "Sort projects by capital requirement.",
      "Use a pointer to push all projects whose capital <= w into a max-heap of profits.",
      "Pick (pop) the highest-profit project k times, adding its profit to w.",
      "After each pick, push newly affordable projects into the max-heap.",
    ],
    solution: `function findMaximizedCapital(k, w, profits, capital) {
  const n = profits.length;
  const proj = profits.map((p,i)=>[capital[i],p]).sort((a,b)=>a[0]-b[0]);
  const maxH = new MaxHeap();
  let i = 0;
  for (let t = 0; t < k; t++) {
    while (i < n && proj[i][0] <= w) maxH.push(proj[i++][1]);
    if (!maxH.size()) break;
    w += maxH.pop();
  }
  return w;
}
class MaxHeap {
  constructor(){this.h=[];}
  size(){return this.h.length;}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.h[p]>=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const top=this.h[0];const last=this.h.pop();if(this.h.length){this.h[0]=last;this._down(0);}return top;}
  _down(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.h[l]>this.h[s])s=l;if(r<n&&this.h[r]>this.h[s])s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Investment portfolio selection and cloud resource bidding systems apply this greedy-with-budget pattern. A/B test scheduling — run highest-ROI experiments first given compute budget — maps exactly to this problem.",
  },
  {
    id: "heap-30",
    title: "Minimum Number of Refueling Stops",
    difficulty: "Hard",
    tags: ["Heap", "Greedy", "Dynamic Programming"],
    statement: "A car starts at position 0 with startFuel. Gas stations are at given positions with given fuel amounts. Return the minimum number of refueling stops to reach target, or -1 if impossible.",
    examples: [
      { input: "target=100, startFuel=10, stations=[[10,60],[20,30],[30,30],[60,40]]", output: "2" },
    ],
    intuition: "Drive as far as you can. When you run out of fuel, retroactively 'wish you had stopped' at the richest station you already passed — that is, pop the max-heap of passed stations' fuel amounts.",
    approach: [
      "Use a max-heap of fuel amounts at stations already passed.",
      "Walk forward; when current fuel < distance to next waypoint, pop the largest available fuel.",
      "Each pop counts as one stop.",
      "If heap is empty and still can't reach next point, return -1.",
    ],
    solution: `function minRefuelStops(target, startFuel, stations) {
  const maxH = new MaxHeap();
  stations.push([target, 0]);
  let fuel = startFuel, stops = 0, prev = 0;
  for (const [pos, cap] of stations) {
    fuel -= (pos - prev); prev = pos;
    while (fuel < 0 && maxH.size()) { fuel += maxH.pop(); stops++; }
    if (fuel < 0) return -1;
    maxH.push(cap);
  }
  return stops;
}
class MaxHeap {
  constructor(){this.h=[];}
  size(){return this.h.length;}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.h[p]>=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const top=this.h[0];const last=this.h.pop();if(this.h.length){this.h[0]=last;this._down(0);}return top;}
  _down(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.h[l]>this.h[s])s=l;if(r<n&&this.h[r]>this.h[s])s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Flight routing with fuel constraints and logistics route planning with limited depots use this retroactive-greedy pattern. Electric-vehicle charge-stop optimization is a direct real-world analogue.",
  },
  {
    id: "heap-31",
    title: "Maximum Performance of a Team",
    difficulty: "Hard",
    tags: ["Heap", "Greedy", "Sorting"],
    statement: "Given n engineers with speed[] and efficiency[], pick at most k engineers to maximize speed_sum * min_efficiency. Return the answer mod 1e9+7.",
    examples: [
      { input: "n=6, speed=[2,10,3,1,5,8], efficiency=[5,4,3,9,7,2], k=2", output: "60" },
    ],
    intuition: "If you fix the minimum efficiency (sort engineers by efficiency desc), you want the k largest speeds seen so far. A min-heap of size k tracks those speeds efficiently.",
    approach: [
      "Sort engineers by efficiency descending.",
      "Walk through; maintain a min-heap of the k best speeds seen so far, and a running speed sum.",
      "At each engineer, add their speed; if heap exceeds k, remove the smallest speed.",
      "Update answer = speedSum * currentEfficiency.",
    ],
    solution: `function maxPerformance(n, speed, efficiency, k) {
  const MOD = 1e9 + 7;
  const eng = speed.map((s,i)=>[efficiency[i],s]).sort((a,b)=>b[0]-a[0]);
  const heap = new MinHeap();
  let speedSum = 0, best = 0;
  for (const [eff, sp] of eng) {
    heap.push(sp); speedSum += sp;
    if (heap.size() > k) speedSum -= heap.pop();
    best = Math.max(best, speedSum * eff);
  }
  return best % MOD;
}
class MinHeap {
  constructor(){this.h=[];}
  size(){return this.h.length;}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.h[p]<=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const top=this.h[0];const last=this.h.pop();if(this.h.length){this.h[0]=last;this._down(0);}return top;}
  _down(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.h[l]<this.h[s])s=l;if(r<n&&this.h[r]<this.h[s])s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n log k)", space: "O(k)" },
    systemDesign: "Team staffing optimizers and ad auction systems (maximizing CTR * bid) apply this sweep-and-top-k pattern. ML feature selection by importance score uses a similar sorted-sweep approach.",
  },
  {
    id: "heap-32",
    title: "Trapping Rain Water II",
    difficulty: "Hard",
    tags: ["Heap", "BFS", "Matrix"],
    statement: "Given an m x n matrix of heights, compute how much water it can trap after raining (3D version).",
    examples: [
      { input: "heightMap = [[1,4,3],[3,2,4],[2,3,1]]", output: "4" },
    ],
    intuition: "Water can only escape over the boundary. Start from all boundary cells in a min-heap. Expand inward: if a neighbor is shorter than the current boundary height, it traps water equal to the difference.",
    approach: [
      "Push all boundary cells into a min-heap with their heights; mark visited.",
      "Pop the minimum-height cell.",
      "For each unvisited neighbor, compute trapped water = max(0, current_height - neighbor_height).",
      "Push neighbor with height = max(neighbor_height, current_height).",
      "Accumulate water and repeat.",
    ],
    solution: `function trapRainWater(heightMap) {
  const m = heightMap.length, n = heightMap[0].length;
  const heap = new MinHeap((a,b)=>a[0]-b[0]);
  const vis = Array.from({length:m},()=>new Uint8Array(n));
  for (let i=0;i<m;i++) for (let j=0;j<n;j++)
    if (i===0||i===m-1||j===0||j===n-1) { heap.push([heightMap[i][j],i,j]); vis[i][j]=1; }
  let water = 0;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  while (heap.size()) {
    const [h,r,c] = heap.pop();
    for (const [dr,dc] of dirs) {
      const nr=r+dr, nc=c+dc;
      if (nr<0||nr>=m||nc<0||nc>=n||vis[nr][nc]) continue;
      vis[nr][nc]=1;
      water += Math.max(0, h - heightMap[nr][nc]);
      heap.push([Math.max(h, heightMap[nr][nc]), nr, nc]);
    }
  }
  return water;
}
class MinHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])<=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const top=this.h[0];const last=this.h.pop();if(this.h.length){this.h[0]=last;this._down(0);}return top;}
  _down(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])<0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])<0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(mn log(mn))", space: "O(mn)" },
    systemDesign: "Terrain analysis and flood simulation in GIS systems use this boundary-expansion with a priority queue. Network flow algorithms similarly expand from boundaries inward using Dijkstra-like relaxation.",
  },
  {
    id: "heap-33",
    title: "Swim in Rising Water",
    difficulty: "Hard",
    tags: ["Heap", "Binary Search", "Union-Find"],
    statement: "In an n x n grid where grid[i][j] is the elevation, you swim from (0,0) to (n-1,n-1). At time t the water level is t. Return the minimum time to reach the destination.",
    examples: [
      { input: "grid = [[0,2],[1,3]]", output: "3" },
    ],
    intuition: "Think of it as Dijkstra where the 'cost' to enter a cell is the cell's elevation. The answer is the maximum elevation on the optimal path — minimize the max, not the sum.",
    approach: [
      "Use a min-heap of (elevation, row, col) starting from (0,0).",
      "Pop the cell with the smallest elevation; if it's the destination, return current time = max elevation seen.",
      "Push unvisited neighbors.",
      "Track a visited set to avoid reprocessing.",
    ],
    solution: `function swimInWater(grid) {
  const n = grid.length;
  const heap = new MinHeap((a,b)=>a[0]-b[0]);
  const vis = Array.from({length:n},()=>new Uint8Array(n));
  heap.push([grid[0][0],0,0]); vis[0][0]=1;
  const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
  while(heap.size()){
    const [t,r,c]=heap.pop();
    if(r===n-1&&c===n-1) return t;
    for(const [dr,dc] of dirs){
      const nr=r+dr,nc=c+dc;
      if(nr<0||nr>=n||nc<0||nc>=n||vis[nr][nc]) continue;
      vis[nr][nc]=1;
      heap.push([Math.max(t,grid[nr][nc]),nr,nc]);
    }
  }
  return -1;
}
class MinHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])<=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const top=this.h[0];const last=this.h.pop();if(this.h.length){this.h[0]=last;this._down(0);}return top;}
  _down(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])<0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])<0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n^2 log n)", space: "O(n^2)" },
    systemDesign: "Minimax-path Dijkstra is used in network routing to find the path with the lowest maximum link latency (bottleneck routing). Logistics optimization for roads with weight limits uses the same min-of-max formulation.",
  },
  {
    id: "heap-34",
    title: "Network Delay Time",
    difficulty: "Medium",
    tags: ["Heap", "Dijkstra", "Graph"],
    statement: "There are n nodes and times[i] = [u, v, w] directed weighted edges. A signal is sent from node k. Return the time for all nodes to receive the signal, or -1 if impossible.",
    examples: [
      { input: "times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2", output: "2" },
    ],
    intuition: "It is exactly Dijkstra's shortest-path: the last node to receive the signal is the one farthest from k. The answer is the maximum shortest-path distance.",
    approach: [
      "Build an adjacency list.",
      "Run Dijkstra from k using a min-heap of (dist, node).",
      "Relax neighbors; update dist if shorter path found.",
      "Return max of all dist values, or -1 if any node is unreachable.",
    ],
    solution: `function networkDelayTime(times, n, k) {
  const graph = Array.from({length:n+1},()=>[]);
  for(const [u,v,w] of times) graph[u].push([v,w]);
  const dist = new Array(n+1).fill(Infinity); dist[k]=0;
  const heap = new MinHeap((a,b)=>a[0]-b[0]);
  heap.push([0,k]);
  while(heap.size()){
    const [d,u]=heap.pop();
    if(d>dist[u]) continue;
    for(const [v,w] of graph[u]){
      if(dist[u]+w<dist[v]){ dist[v]=dist[u]+w; heap.push([dist[v],v]); }
    }
  }
  const max=Math.max(...dist.slice(1));
  return max===Infinity?-1:max;
}
class MinHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])<=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const top=this.h[0];const last=this.h.pop();if(this.h.length){this.h[0]=last;this._down(0);}return top;}
  _down(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])<0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])<0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O((V+E) log V)", space: "O(V+E)" },
    systemDesign: "Dijkstra powers OSPF routing in enterprise networks and Google Maps driving directions. CDN edge-server selection picks the nearest node by latency using the same shortest-path principle.",
  },
  {
    id: "heap-35",
    title: "Cheapest Flights Within K Stops",
    difficulty: "Medium",
    tags: ["Heap", "BFS", "Dynamic Programming"],
    statement: "Given n cities, flights[i]=[from,to,price], find the cheapest price from src to dst using at most k stops. Return -1 if impossible.",
    examples: [
      { input: "n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1", output: "700" },
    ],
    intuition: "Like Dijkstra but you also track the number of stops. Use a min-heap of (cost, node, stops_remaining) — stop expanding a path once it has used all its stops.",
    approach: [
      "Build adjacency list.",
      "Min-heap of (cost, node, stopsLeft); start with (0, src, k).",
      "Pop minimum cost entry; if node == dst return cost.",
      "If stopsLeft > 0, relax neighbors and push to heap.",
      "Use a visited map keyed by (node, stopsLeft) to prune.",
    ],
    solution: `function findCheapestPrice(n, flights, src, dst, k) {
  const graph = Array.from({length:n},()=>[]);
  for(const [u,v,w] of flights) graph[u].push([v,w]);
  const heap = new MinHeap((a,b)=>a[0]-b[0]);
  heap.push([0,src,k+1]);
  const best = {};
  while(heap.size()){
    const [cost,u,stops]=heap.pop();
    if(u===dst) return cost;
    if(stops===0) continue;
    const key = u+","+stops;
    if(best[key]!==undefined&&best[key]<=cost) continue;
    best[key]=cost;
    for(const [v,w] of graph[u]) heap.push([cost+w,v,stops-1]);
  }
  return -1;
}
class MinHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])<=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const top=this.h[0];const last=this.h.pop();if(this.h.length){this.h[0]=last;this._down(0);}return top;}
  _down(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])<0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])<0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(E log E)", space: "O(E)" },
    systemDesign: "Airline booking engines and travel aggregators (Kayak, Expedia) solve exactly this problem to find cheapest itineraries with layover constraints. Multi-hop network routing with TTL limits uses the same bounded-stop Dijkstra.",
  },
  {
    id: "heap-36",
    title: "Path With Minimum Effort",
    difficulty: "Medium",
    tags: ["Heap", "Dijkstra", "Binary Search", "Matrix"],
    statement: "In an m x n matrix of heights, find the path from (0,0) to (m-1,n-1) that minimizes the maximum absolute difference between consecutive cells.",
    examples: [
      { input: "heights = [[1,2,2],[3,8,2],[5,3,5]]", output: "2" },
    ],
    intuition: "Minimax path: treat the effort to reach each cell as the maximum 'step height' on the path so far. Dijkstra relaxes cells by minimizing this maximum, not the sum.",
    approach: [
      "Min-heap of (maxEffort, row, col); start (0,0,0).",
      "dist[r][c] = min max-effort to reach (r,c).",
      "Pop cell; if destination, return effort.",
      "Relax neighbors: newEffort = max(current, |h1-h2|); push if improves dist.",
    ],
    solution: `function minimumEffortPath(heights) {
  const m=heights.length,n=heights[0].length;
  const dist=Array.from({length:m},()=>new Array(n).fill(Infinity));
  dist[0][0]=0;
  const heap=new MinHeap((a,b)=>a[0]-b[0]);
  heap.push([0,0,0]);
  const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
  while(heap.size()){
    const [e,r,c]=heap.pop();
    if(r===m-1&&c===n-1) return e;
    if(e>dist[r][c]) continue;
    for(const [dr,dc] of dirs){
      const nr=r+dr,nc=c+dc;
      if(nr<0||nr>=m||nc<0||nc>=n) continue;
      const ne=Math.max(e,Math.abs(heights[r][c]-heights[nr][nc]));
      if(ne<dist[nr][nc]){ dist[nr][nc]=ne; heap.push([ne,nr,nc]); }
    }
  }
  return 0;
}
class MinHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])<=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const top=this.h[0];const last=this.h.pop();if(this.h.length){this.h[0]=last;this._down(0);}return top;}
  _down(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])<0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])<0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(mn log(mn))", space: "O(mn)" },
    systemDesign: "Robot path planning on terrain and supply-chain route optimization (minimize the most difficult road segment) use this minimax-Dijkstra. Satellite link selection for minimum worst-case latency hop follows the same logic.",
  },
  {
    id: "heap-37",
    title: "Rearrange String k Distance Apart",
    difficulty: "Hard",
    tags: ["Heap", "Greedy", "Hash Map"],
    statement: "Given a string s and integer k, rearrange s so that same characters are at least k distance apart. Return the rearranged string, or '' if impossible.",
    examples: [
      { input: "s = \"aabbcc\", k = 3", output: "\"abcabc\"" },
    ],
    intuition: "Always place the most frequent remaining character — but if it was used within the last k steps, it is temporarily on 'cooldown'. A max-heap gives the most frequent; a queue manages the cooldown.",
    approach: [
      "Count character frequencies; push all into a max-heap.",
      "Maintain a cooldown queue of (char, freq, releaseTime).",
      "At each step, pop max-heap, append char, decrement freq, enqueue with cooldown.",
      "Re-add from queue to heap when release time is reached.",
      "If heap is empty but queue is not, return ''.",
    ],
    solution: `function rearrangeString(s, k) {
  if (k === 0) return s;
  const freq = {};
  for (const c of s) freq[c] = (freq[c]||0)+1;
  const maxH = new MaxHeap((a,b)=>a[1]-b[1]);
  for (const [c,f] of Object.entries(freq)) maxH.push([c,f]);
  const queue = [];
  let res = "", time = 0;
  while (maxH.size() || queue.length) {
    if (queue.length && queue[0][2] <= time) maxH.push(queue.shift());
    if (!maxH.size()) return "";
    const [c,f] = maxH.pop();
    res += c; time++;
    if (f-1 > 0) queue.push([c, f-1, time+k-1]);
  }
  return res;
}
class MaxHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])>=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const top=this.h[0];const last=this.h.pop();if(this.h.length){this.h[0]=last;this._down(0);}return top;}
  _down(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])>0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])>0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "CPU task scheduling with cooldown periods and rate-limited API request queues (e.g., ensuring the same endpoint is not called within k milliseconds) are direct analogues. Kafka partition key rebalancing uses similar spacing logic.",
  },
  {
    id: "heap-38",
    title: "Constrained Subsequence Sum",
    difficulty: "Hard",
    tags: ["Heap", "Dynamic Programming", "Sliding Window"],
    statement: "Given an integer array nums and integer k, return the maximum sum of a non-empty subsequence such that for every consecutive pair of indices i < j, j - i <= k.",
    examples: [
      { input: "nums = [10,2,-10,5,20], k = 2", output: "37", explanation: "Subsequence [10,2,5,20]." },
    ],
    intuition: "dp[i] = best subsequence sum ending at i. The previous element can be at most k steps back. A max-heap (or deque) over the last k dp values finds the best predecessor in O(log k).",
    approach: [
      "dp[i] = nums[i] + max(0, max of dp[i-k..i-1]).",
      "Use a max-heap storing (dp[j], j) for the window.",
      "Before accessing heap, pop stale entries (j < i-k).",
      "Update global answer with each dp[i].",
    ],
    solution: `function constrainedSubsetSum(nums, k) {
  const n = nums.length;
  const dp = [...nums];
  const heap = new MaxHeap((a,b)=>a[0]-b[0]);
  heap.push([dp[0],0]);
  let ans = dp[0];
  for (let i = 1; i < n; i++) {
    while (heap.size() && heap.peek()[1] < i-k) heap.pop();
    dp[i] = nums[i] + Math.max(0, heap.size() ? heap.peek()[0] : 0);
    ans = Math.max(ans, dp[i]);
    heap.push([dp[i],i]);
  }
  return ans;
}
class MaxHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  peek(){return this.h[0];}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])>=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const top=this.h[0];const last=this.h.pop();if(this.h.length){this.h[0]=last;this._down(0);}return top;}
  _down(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])>0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])>0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Sliding-window DP with heap optimization appears in financial time-series analysis (maximum gain within a lookback window) and recommendation systems that constrain how far back in a user's history to look.",
  },
  {
    id: "heap-39",
    title: "Sliding Window Median",
    difficulty: "Hard",
    tags: ["Heap", "Sliding Window", "Two Heaps"],
    statement: "Given an array nums and window size k, return the median of each sliding window of size k.",
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[1,-1,-1,3,5,6]" },
    ],
    intuition: "Maintain two heaps like Find Median from Data Stream, but also support deletion when elements leave the window. Lazy deletion: mark removed elements and skip them during peek/pop.",
    approach: [
      "Use a max-heap (lower half) and min-heap (upper half), balanced so sizes differ by at most 1.",
      "For each new element, add to appropriate heap and rebalance.",
      "To remove outgoing element, use a lazy-delete map; adjust effective sizes.",
      "After add+remove, rebalance by moving tops between heaps.",
      "Extract median from heap tops.",
    ],
    solution: `function medianSlidingWindow(nums, k) {
  const lo = new MaxHeap(), hi = new MinHeap();
  const del = new Map();
  const balance = (toHi) => {
    if (toHi) { hi.push(lo.pop()); }
    else { lo.push(hi.pop()); }
  };
  const prune = (h) => {
    while (h.size() && del.get(h.peek()) > 0) {
      del.set(h.peek(), del.get(h.peek())-1); h.pop();
    }
  };
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    if (!lo.size() || nums[i] <= lo.peek()) lo.push(nums[i]);
    else hi.push(nums[i]);
    if (lo.size() > hi.size()+1) balance(true);
    else if (hi.size() > lo.size()) balance(false);
    if (i >= k-1) {
      res.push(k%2===1 ? lo.peek() : (lo.peek()+hi.peek())/2);
      const out = nums[i-k+1];
      del.set(out,(del.get(out)||0)+1);
      if (out <= lo.peek()) { if(lo.size()>hi.size()+1) balance(true); }
      else { if(hi.size()>lo.size()) balance(false); }
      prune(lo); prune(hi);
    }
  }
  return res;
}
class MaxHeap {
  constructor(){this.h=[];}
  size(){return this.h.length;}
  peek(){return this.h[0];}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.h[p]>=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const t=this.h[0];const l=this.h.pop();if(this.h.length){this.h[0]=l;this._d(0);}return t;}
  _d(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.h[l]>this.h[s])s=l;if(r<n&&this.h[r]>this.h[s])s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}
class MinHeap {
  constructor(){this.h=[];}
  size(){return this.h.length;}
  peek(){return this.h[0];}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.h[p]<=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const t=this.h[0];const l=this.h.pop();if(this.h.length){this.h[0]=l;this._d(0);}return t;}
  _d(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.h[l]<this.h[s])s=l;if(r<n&&this.h[r]<this.h[s])s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n log k)", space: "O(k)" },
    systemDesign: "Real-time anomaly detection systems track rolling median of metrics (CPU, latency) to detect spikes without being skewed by outliers. Financial risk systems compute rolling median VaR over time windows using two-heap structures.",
  },
  {
    id: "heap-40",
    title: "Sort an Array (Heap Sort)",
    difficulty: "Medium",
    tags: ["Heap", "Sorting"],
    statement: "Given an array of integers nums, sort the array in ascending order and return it. Implement heap sort (O(n log n) time, O(1) space).",
    examples: [
      { input: "nums = [5,2,3,1]", output: "[1,2,3,4]" },
    ],
    intuition: "Build a max-heap in place (heapify). Then repeatedly swap the root (largest) with the last element and shrink the heap — it is like repeatedly picking the biggest item and putting it at the end.",
    approach: [
      "Build max-heap in place: call heapifyDown for each non-leaf from n/2-1 down to 0.",
      "For i from n-1 to 1: swap nums[0] with nums[i], then heapifyDown on reduced heap of size i.",
      "Array is sorted ascending after all swaps.",
    ],
    solution: `function sortArray(nums) {
  const n = nums.length;
  const down = (i, size) => {
    while(true){
      let s=i,l=2*i+1,r=2*i+2;
      if(l<size&&nums[l]>nums[s])s=l;
      if(r<size&&nums[r]>nums[s])s=r;
      if(s===i)break;
      [nums[s],nums[i]]=[nums[i],nums[s]];i=s;
    }
  };
  for(let i=(n>>1)-1;i>=0;i--) down(i,n);
  for(let i=n-1;i>0;i--){ [nums[0],nums[i]]=[nums[i],nums[0]]; down(0,i); }
  return nums;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Heap sort's O(1) extra space makes it attractive for embedded systems and in-place database buffer sorting. Priority queues in OS schedulers are essentially partial heap sorts run continuously.",
    pitfalls: ["Build phase is O(n) not O(n log n) — start from n/2-1 downward.", "Heap sort is not stable."],
  },
  {
    id: "heap-41",
    title: "Design Twitter",
    difficulty: "Medium",
    tags: ["Heap", "Hash Map", "Design"],
    statement: "Design a simplified Twitter: postTweet(userId, tweetId), getNewsFeed(userId) returns 10 most recent tweets from the user and their followees, follow(followerId, followeeId), unfollow.",
    examples: [
      { input: "postTweet(1,5), postTweet(1,3), getNewsFeed(1)", output: "[3,5]" },
    ],
    intuition: "For the news feed, collect the most recent tweets from each followed user (up to 10 per user), then merge them with a max-heap by timestamp — exactly the k-way merge problem.",
    approach: [
      "Store tweets per user as an ordered list with a global timestamp counter.",
      "Store follower sets per user.",
      "For getNewsFeed: collect last 10 tweets from each followed user + self into a max-heap by timestamp.",
      "Pop 10 times to get the feed.",
    ],
    solution: `class Twitter {
  constructor() {
    this.time = 0;
    this.tweets = new Map();
    this.follows = new Map();
  }
  postTweet(userId, tweetId) {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId).push([this.time++, tweetId]);
  }
  getNewsFeed(userId) {
    const feed = [];
    const users = [...(this.follows.get(userId)||[]), userId];
    for (const u of users) {
      const tw = this.tweets.get(u)||[];
      for (let i = tw.length-1; i >= Math.max(0,tw.length-10); i--) feed.push(tw[i]);
    }
    feed.sort((a,b)=>b[0]-a[0]);
    return feed.slice(0,10).map(x=>x[1]);
  }
  follow(a, b) {
    if (!this.follows.has(a)) this.follows.set(a, new Set());
    this.follows.get(a).add(b);
  }
  unfollow(a, b) {
    this.follows.get(a)?.delete(b);
  }
}`,
    language: "javascript",
    complexity: { time: "O(F*10 log(F*10)) per getFeed", space: "O(U+T)" },
    systemDesign: "Twitter's fan-out-on-read vs fan-out-on-write architecture uses heap-based merging for celebrities (many followers) and pre-computed feeds for regular users. Redis sorted sets serve as the production heap.",
  },
  {
    id: "heap-42",
    title: "Minimize Deviation in Array",
    difficulty: "Hard",
    tags: ["Heap", "Greedy"],
    statement: "Given array nums, you can perform operations: multiply an odd number by 2, or divide an even number by 2. Return the minimum possible deviation (max - min) after any number of operations.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "1" },
    ],
    intuition: "First make all numbers as large as possible (multiply odds by 2, even numbers stay). Then repeatedly reduce the maximum (divide by 2 if even) while tracking the minimum — a max-heap drives this greedy reduction.",
    approach: [
      "Normalize: multiply all odd numbers by 2; this is their maximum possible value.",
      "Push all into a max-heap; track global minimum.",
      "Pop max: update answer = max - min; if max is even, push max/2 and update min.",
      "Stop when max is odd (cannot reduce further).",
    ],
    solution: `function minimumDeviation(nums) {
  const maxH = new MaxHeap();
  let minVal = Infinity;
  for (let x of nums) {
    if (x%2===1) x*=2;
    maxH.push(x);
    minVal = Math.min(minVal, x);
  }
  let ans = maxH.peek() - minVal;
  while (maxH.peek() % 2 === 0) {
    const top = maxH.pop();
    ans = Math.min(ans, top - minVal);
    const half = top/2;
    minVal = Math.min(minVal, half);
    maxH.push(half);
    ans = Math.min(ans, maxH.peek() - minVal);
  }
  return ans;
}
class MaxHeap {
  constructor(){this.h=[];}
  size(){return this.h.length;}
  peek(){return this.h[0];}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.h[p]>=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const t=this.h[0];const l=this.h.pop();if(this.h.length){this.h[0]=l;this._d(0);}return t;}
  _d(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.h[l]>this.h[s])s=l;if(r<n&&this.h[r]>this.h[s])s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n log n * log(maxVal))", space: "O(n)" },
    systemDesign: "Load balancing algorithms that normalize heterogeneous server capacities and dynamic range compression in audio/video processing use greedy range-minimization with similar heap-driven reduction loops.",
  },
  {
    id: "heap-43",
    title: "Maximum Average Pass Ratio",
    difficulty: "Medium",
    tags: ["Heap", "Greedy"],
    statement: "You have classes[i] = [pass, total]. You have extraStudents extra brilliant students (guaranteed to pass). Assign each to a class to maximize the average pass ratio across all classes. Return the maximum average pass ratio.",
    examples: [
      { input: "classes=[[1,2],[3,5],[2,2]], extraStudents=2", output: "0.78333" },
    ],
    intuition: "Greedily assign each brilliant student to the class that gains the most from them. The 'gain' of adding one student to class (p, t) is (p+1)/(t+1) - p/t. A max-heap of gains drives this.",
    approach: [
      "Compute gain for each class and push into a max-heap.",
      "For each extra student, pop the class with max gain, update it (p++, t++), recompute gain, push back.",
      "After all assignments, compute and return average pass ratio.",
    ],
    solution: `function maxAverageRatio(classes, extraStudents) {
  const gain = (p,t) => (p+1)/(t+1) - p/t;
  const heap = new MaxHeap((a,b)=>a[0]-b[0]);
  for (const [p,t] of classes) heap.push([gain(p,t),p,t]);
  for (let i=0;i<extraStudents;i++){
    const [,p,t]=heap.pop();
    heap.push([gain(p+1,t+1),p+1,t+1]);
  }
  let sum=0;
  while(heap.size()){ const [,p,t]=heap.pop(); sum+=p/t; }
  return sum/classes.length;
}
class MaxHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])>=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const t=this.h[0];const l=this.h.pop();if(this.h.length){this.h[0]=l;this._d(0);}return t;}
  _d(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])>0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])>0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O((n + k) log n)", space: "O(n)" },
    systemDesign: "Budget allocation across ad campaigns (maximize total CTR by adding impressions where marginal gain is highest) and hospital resource scheduling (maximize survival rates by directing personnel to highest-impact cases) use this marginal-gain greedy pattern.",
  },
  {
    id: "heap-44",
    title: "Find the Kth Largest Integer in the Array",
    difficulty: "Medium",
    tags: ["Heap", "Sorting", "String"],
    statement: "Given an array of strings nums representing integers and an integer k, return the kth largest integer (as a string).",
    examples: [
      { input: "nums = [\"3\",\"6\",\"7\",\"10\"], k = 4", output: "\"3\"" },
    ],
    intuition: "Numbers are strings so compare by length first, then lexicographically. Use a min-heap of size k: if a number is larger than the heap top (kth largest so far), replace it.",
    approach: [
      "Define a string comparator: longer string is larger; equal length uses lexicographic order.",
      "Push each number onto a min-heap (by string comparison) of max size k.",
      "If heap exceeds k, pop the smallest.",
      "Return heap top after processing all numbers.",
    ],
    solution: `function kthLargestNumber(nums, k) {
  const cmp = (a, b) => a.length !== b.length ? a.length - b.length : a.localeCompare(b);
  const heap = new MinHeap(cmp);
  for (const n of nums) {
    heap.push(n);
    if (heap.size() > k) heap.pop();
  }
  return heap.peek();
}
class MinHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  peek(){return this.h[0];}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])<=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const t=this.h[0];const l=this.h.pop();if(this.h.length){this.h[0]=l;this._d(0);}return t;}
  _d(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])<0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])<0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n log k)", space: "O(k)" },
    systemDesign: "Big-integer ranking in distributed ledgers and database ORDER BY on varchar-encoded numeric IDs require custom comparators like this. Search engines rank documents by numeric string scores stored as text fields.",
    pitfalls: ["Do not convert to Number — strings can exceed Number.MAX_SAFE_INTEGER.", "Always compare by length first."],
  },
  {
    id: "heap-45",
    title: "Number of Orders in the Backlog",
    difficulty: "Medium",
    tags: ["Heap", "Simulation"],
    statement: "You have buy and sell orders arriving. Buy orders queue in a max-heap (by price), sell orders in a min-heap. Match overlapping orders. Return the total number of unmatched orders remaining.",
    examples: [
      { input: "orders = [[10,5,0],[15,2,1],[25,1,1],[30,4,0]]", output: "6" },
    ],
    intuition: "Think of a stock exchange order book. A buy order at price X matches the cheapest sell order if its price <= X. Process each order by matching against the opposite book as many times as possible.",
    approach: [
      "Max-heap for buy orders (price, amount); min-heap for sell orders (price, amount).",
      "For each incoming order, match greedily with the best opposing order.",
      "Partially filled orders stay in the heap with reduced amount.",
      "Sum all remaining amounts mod 1e9+7.",
    ],
    solution: `function getNumberOfBacklogOrders(orders) {
  const MOD = 1e9+7;
  const buy = new MaxHeap((a,b)=>a[0]-b[0]);
  const sell = new MinHeap((a,b)=>a[0]-b[0]);
  for (const [price, amount, type] of orders) {
    let rem = amount;
    if (type === 0) {
      while (rem>0&&sell.size()&&sell.peek()[0]<=price) {
        const [sp,sa]=sell.pop();
        if(sa<=rem){rem-=sa;}else{sell.push([sp,sa-rem]);rem=0;}
      }
      if(rem>0) buy.push([price,rem]);
    } else {
      while (rem>0&&buy.size()&&buy.peek()[0]>=price) {
        const [bp,ba]=buy.pop();
        if(ba<=rem){rem-=ba;}else{buy.push([bp,ba-rem]);rem=0;}
      }
      if(rem>0) sell.push([price,rem]);
    }
  }
  let total=0;
  while(buy.size()) total=(total+buy.pop()[1])%MOD;
  while(sell.size()) total=(total+sell.pop()[1])%MOD;
  return total;
}
class MaxHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  peek(){return this.h[0];}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])>=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const t=this.h[0];const l=this.h.pop();if(this.h.length){this.h[0]=l;this._d(0);}return t;}
  _d(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])>0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])>0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}
class MinHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  peek(){return this.h[0];}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])<=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const t=this.h[0];const l=this.h.pop();if(this.h.length){this.h[0]=l;this._d(0);}return t;}
  _d(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])<0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])<0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Stock exchange matching engines (NASDAQ, NYSE) use exactly this dual-heap order book. Ride-sharing demand-supply matching and airline seat pricing engines apply the same priority-queue matching pattern at scale.",
  },
  {
    id: "heap-46",
    title: "Course Schedule III",
    difficulty: "Hard",
    tags: ["Heap", "Greedy"],
    statement: "There are n courses. courses[i] = [duration, lastDay]. You can take courses in any order. Find the maximum number of courses you can take if a course must finish by its lastDay.",
    examples: [
      { input: "courses = [[100,200],[200,1300],[1000,1250],[2000,3200]]", output: "3" },
    ],
    intuition: "Sort by deadline. Greedily take each course. If taking it pushes current time past its deadline, replace the longest previously taken course with this one if this one is shorter — net gain: same count but more time freed.",
    approach: [
      "Sort courses by lastDay.",
      "Use a max-heap of durations of taken courses, and track current time.",
      "For each course: if time + duration <= lastDay, take it.",
      "Else if heap top > duration, swap (replace longest with this shorter course).",
      "Return heap size.",
    ],
    solution: `function scheduleCourse(courses) {
  courses.sort((a,b)=>a[1]-b[1]);
  const heap = new MaxHeap();
  let time = 0;
  for (const [d, last] of courses) {
    if (time + d <= last) { heap.push(d); time += d; }
    else if (heap.size() && heap.peek() > d) {
      time -= heap.pop(); heap.push(d); time += d;
    }
  }
  return heap.size();
}
class MaxHeap {
  constructor(){this.h=[];}
  size(){return this.h.length;}
  peek(){return this.h[0];}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.h[p]>=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const t=this.h[0];const l=this.h.pop();if(this.h.length){this.h[0]=l;this._d(0);}return t;}
  _d(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.h[l]>this.h[s])s=l;if(r<n&&this.h[r]>this.h[s])s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Job scheduling in batch processing systems (Hadoop YARN, AWS Batch) with SLA deadlines uses this greedy-with-replacement strategy. Project portfolio management tools apply it to maximize deliverable count under deadline constraints.",
  },
  {
    id: "heap-47",
    title: "Maximum Number of Eaten Apples",
    difficulty: "Medium",
    tags: ["Heap", "Greedy"],
    statement: "A tree produces apples[i] apples on day i that rot after days[i] days (last good day: i+days[i]-1). Each day you can eat at most one apple. Maximize apples eaten.",
    examples: [
      { input: "apples=[1,2,3,5,2], days=[3,2,1,4,2]", output: "7" },
    ],
    intuition: "Each day, always eat the apple batch that expires soonest — eating it now prevents waste. A min-heap by expiry date greedily picks the most urgent batch.",
    approach: [
      "Min-heap of (expiryDay, count).",
      "Each day i (including days after array ends while heap non-empty): push new batch if within array bounds.",
      "Pop and discard expired batches.",
      "Eat one apple from the soonest-expiring batch; decrement count, re-push if > 0.",
    ],
    solution: `function eatenApples(apples, days) {
  const n = apples.length;
  const heap = new MinHeap((a,b)=>a[0]-b[0]);
  let eaten = 0, day = 0;
  while (day < n || heap.size()) {
    if (day < n && apples[day] > 0) heap.push([day+days[day]-1, apples[day]]);
    while (heap.size() && heap.peek()[0] < day) heap.pop();
    if (heap.size()) {
      const [exp, cnt] = heap.pop();
      eaten++;
      if (cnt-1 > 0) heap.push([exp, cnt-1]);
    }
    day++;
  }
  return eaten;
}
class MinHeap {
  constructor(cmp){this.h=[];this.cmp=cmp;}
  size(){return this.h.length;}
  peek(){return this.h[0];}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.cmp(this.h[p],this.h[i])<=0)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const t=this.h[0];const l=this.h.pop();if(this.h.length){this.h[0]=l;this._d(0);}return t;}
  _d(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.cmp(this.h[l],this.h[s])<0)s=l;if(r<n&&this.cmp(this.h[r],this.h[s])<0)s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Inventory management systems that expire perishable goods use earliest-expiry-first (FEFO) logic, implemented with a min-heap. Ticket/voucher expiry processing in e-commerce platforms applies the same pattern.",
  },
  {
    id: "heap-48",
    title: "Remove Stones to Minimize the Total",
    difficulty: "Medium",
    tags: ["Heap", "Greedy"],
    statement: "You have piles of stones. In k operations, choose a pile and remove floor(pile/2) stones. Return the minimum possible total stones remaining.",
    examples: [
      { input: "piles = [5,4,9], k = 2", output: "12", explanation: "Remove 4 from pile 9 -> [5,4,5], then remove 2 from pile 5 -> [3,4,5] = 12." },
    ],
    intuition: "Always halve the biggest pile — that removes the most stones in one operation. A max-heap always gives you the biggest pile instantly.",
    approach: [
      "Build a max-heap from piles.",
      "Repeat k times: pop max, subtract floor(max/2), push back.",
      "Return sum of all elements in the heap.",
    ],
    solution: `function minStoneSum(piles, k) {
  const heap = new MaxHeap();
  for (const p of piles) heap.push(p);
  for (let i=0;i<k;i++){
    const top=heap.pop();
    heap.push(top - Math.floor(top/2));
  }
  return heap.h.reduce((a,b)=>a+b,0);
}
class MaxHeap {
  constructor(){this.h=[];}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.h[p]>=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const t=this.h[0];const l=this.h.pop();if(this.h.length){this.h[0]=l;this._d(0);}return t;}
  _d(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.h[l]>this.h[s])s=l;if(r<n&&this.h[r]>this.h[s])s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(k log n)", space: "O(n)" },
    systemDesign: "Bandwidth throttling systems that reduce the heaviest traffic flows first use this greedy halving idea. Database query optimizer cost reduction: repeatedly split the most expensive query plan node.",
  },
  {
    id: "heap-49",
    title: "Minimum Cost to Hire K Workers",
    difficulty: "Hard",
    tags: ["Heap", "Greedy", "Sorting"],
    statement: "Every worker has quality[i] and minWage[i]. A group of k workers must be paid proportional to quality; each worker must earn at least their minWage. Hire exactly k workers at minimum cost.",
    examples: [
      { input: "quality=[10,20,5], wage=[70,50,30], k=2", output: "105.0" },
    ],
    intuition: "The wage ratio wage[i]/quality[i] determines the 'rate'. The captain (highest ratio in the group) sets the rate for everyone. Sort by rate; for each captain, choose the k-1 cheapest (lowest quality) workers seen so far.",
    approach: [
      "Compute ratio = wage[i]/quality[i] for each worker; sort by ratio ascending.",
      "Sweep through workers (each as potential captain with that ratio).",
      "Maintain a max-heap of qualities of the k smallest-quality workers seen so far, and their sum.",
      "When heap exceeds k, remove the largest quality.",
      "When heap has exactly k elements, update answer = ratio * qualitySum.",
    ],
    solution: `function mincostToHireWorkers(quality, wage, k) {
  const n = quality.length;
  const workers = quality.map((q,i)=>[wage[i]/q, q]).sort((a,b)=>a[0]-b[0]);
  const heap = new MaxHeap();
  let qSum = 0, ans = Infinity;
  for (const [ratio, q] of workers) {
    heap.push(q); qSum += q;
    if (heap.size() > k) qSum -= heap.pop();
    if (heap.size() === k) ans = Math.min(ans, ratio * qSum);
  }
  return ans;
}
class MaxHeap {
  constructor(){this.h=[];}
  size(){return this.h.length;}
  push(v){this.h.push(v);let i=this.h.length-1;while(i>0){const p=(i-1)>>1;if(this.h[p]>=this.h[i])break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}}
  pop(){const t=this.h[0];const l=this.h.pop();if(this.h.length){this.h[0]=l;this._d(0);}return t;}
  _d(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.h[l]>this.h[s])s=l;if(r<n&&this.h[r]>this.h[s])s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Gig-economy platforms (Uber, Fiverr) that dynamically price teams of workers based on the highest-rated member's floor price use this ratio-sweep pattern. Cloud spot-instance bidding with proportional allocation follows the same mathematical structure.",
    pitfalls: ["Sort by ratio, not wage or quality alone.", "The captain must be included in the k workers."],
  },
  {
    id: "heap-50",
    title: "Find the Most Competitive Subsequence",
    difficulty: "Medium",
    tags: ["Heap", "Stack", "Greedy"],
    statement: "Given an integer array nums and integer k, return the most competitive subsequence of length k. A subsequence A is more competitive than B if at the first differing position A has a smaller value.",
    examples: [
      { input: "nums = [3,5,2,6], k = 2", output: "[2,6]" },
    ],
    intuition: "Build the answer greedily left to right with a monotonic stack: keep removing the last element if it is larger than the current element AND we still have enough elements left to fill k positions.",
    approach: [
      "Use a stack (acts like a min-deque).",
      "For each element nums[i]: while stack is not empty, stack top > nums[i], and remaining elements (n-i) are enough to fill k slots, pop the stack.",
      "If stack size < k, push nums[i].",
      "Return stack as array.",
    ],
    solution: `function mostCompetitive(nums, k) {
  const stack = [];
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (stack.length && stack[stack.length-1] > nums[i] && stack.length + (n-i) > k)
      stack.pop();
    if (stack.length < k) stack.push(nums[i]);
  }
  return stack;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "Lexicographically smallest subsequence selection is used in query plan enumeration (picking cheapest k-step execution path) and data stream compression where only k representative samples must be kept in order.",
    pitfalls: ["The condition n-i counts elements from i onward including nums[i] itself.", "Do not pop if remaining elements would leave fewer than k total."],
  },
];
