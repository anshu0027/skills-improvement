import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  {
    id: "graphs-26",
    title: "Snakes and Ladders",
    difficulty: "Medium",
    tags: ["BFS", "Graph", "Matrix"],
    statement: "Given an n x n board where -1 means no special cell, or a positive integer means a snake/ladder destination, find the minimum number of dice rolls to reach cell n*n from cell 1. Cells are numbered in a Boustrophedon (alternating) fashion.",
    examples: [
      {
        input: "board = [[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]",
        output: "4",
        explanation: "Roll dice to land on cells with ladders to advance faster."
      }
    ],
    intuition: "Think of each board cell as a node in a graph; a dice roll takes you to one of 6 neighbors. BFS finds the shortest path (fewest rolls) to the last cell.",
    approach: [
      "Convert cell number to (row, col) considering alternating row direction.",
      "BFS from cell 1; enqueue cells reachable by 1-6 dice rolls.",
      "If a snake or ladder exists at a cell, jump to its destination before enqueuing.",
      "Return BFS level when cell n*n is reached, or -1 if unreachable."
    ],
    solution: `function snakesAndLadders(board) {
  const n = board.length;
  const toRC = (s) => {
    const r = Math.floor((s - 1) / n);
    const c = (s - 1) % n;
    return [n - 1 - r, r % 2 === 0 ? c : n - 1 - c];
  };
  const visited = new Set([1]);
  let queue = [1], steps = 0;
  while (queue.length) {
    const next = [];
    for (const cell of queue) {
      if (cell === n * n) return steps;
      for (let d = 1; d <= 6; d++) {
        let nc = cell + d;
        if (nc > n * n) break;
        const [r, c] = toRC(nc);
        if (board[r][c] !== -1) nc = board[r][c];
        if (!visited.has(nc)) { visited.add(nc); next.push(nc); }
      }
    }
    queue = next; steps++;
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(n^2)", space: "O(n^2)" },
    systemDesign: "BFS on a state-space graph models workflow scheduling where some steps auto-jump to later stages (e.g., fast-track approvals). Game-engine path-finding uses the same BFS layer-by-layer expansion.",
    pitfalls: ["Row direction alternates per row — check even vs odd row index.", "Apply snake/ladder AFTER landing, not recursively."]
  },
  {
    id: "graphs-27",
    title: "Find Eventual Safe States",
    difficulty: "Medium",
    tags: ["Graph", "DFS", "Cycle Detection", "Topological Sort"],
    statement: "A directed graph of n nodes is given as adjacency list graph[i]. A node is eventually safe if every path starting from it leads to a terminal node (no outgoing edges) or another safe node. Return all eventually safe nodes in sorted order.",
    examples: [
      {
        input: "graph = [[1,2],[2,3],[5],[0],[5],[],[]]",
        output: "[2,4,5,6]"
      }
    ],
    intuition: "Safe nodes are those that cannot be part of or reach a cycle — like roads that always lead to a dead end rather than a roundabout loop.",
    approach: [
      "Reverse the graph: edges point from destination to source.",
      "Compute in-degrees of the reversed graph.",
      "Start topological BFS from nodes with in-degree 0 (terminal nodes in original).",
      "Nodes processed in BFS are safe; collect and sort them."
    ],
    solution: `function eventualSafeNodes(graph) {
  const n = graph.length;
  const rev = Array.from({length: n}, () => []);
  const indeg = new Array(n).fill(0);
  for (let u = 0; u < n; u++)
    for (const v of graph[u]) { rev[v].push(u); indeg[u]++; }
  const queue = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  const safe = new Set(queue);
  let head = 0;
  while (head < queue.length) {
    const u = queue[head++];
    for (const v of rev[u]) {
      if (--indeg[v] === 0) { safe.add(v); queue.push(v); }
    }
  }
  return [...safe].sort((a, b) => a - b);
}`,
    language: "javascript",
    complexity: { time: "O(V+E)", space: "O(V+E)" },
    systemDesign: "Deadlock detection in databases identifies transactions in a cycle of locks; only transactions NOT in a cycle (eventually safe) can proceed. Build systems mark tasks safe to run once all their dependencies (no cycles) are resolved.",
  },
  {
    id: "graphs-28",
    title: "Network Delay Time",
    difficulty: "Medium",
    tags: ["Graph", "Dijkstra", "Shortest Path"],
    statement: "There are n network nodes labeled 1 to n. Given a list of travel times as directed edges times[i] = [u, v, w], and a source node k, return the minimum time for all nodes to receive a signal from k. Return -1 if not all nodes can be reached.",
    examples: [
      {
        input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
        output: "2"
      }
    ],
    intuition: "Like a radio broadcast spreading through roads — you find the shortest travel time to every city from the sender, and the answer is the time the last city receives it.",
    approach: [
      "Build weighted adjacency list from times.",
      "Run Dijkstra from k using a min-heap.",
      "Track shortest distance dist[] to each node.",
      "Return max of dist values; if any is Infinity return -1."
    ],
    solution: `function networkDelayTime(times, n, k) {
  const g = Array.from({length: n + 1}, () => []);
  for (const [u, v, w] of times) g[u].push([v, w]);
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  // min-heap via sorted array simulation (small n)
  const heap = [[0, k]];
  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [d, u] = heap.shift();
    if (d > dist[u]) continue;
    for (const [v, w] of g[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        heap.push([dist[v], v]);
      }
    }
  }
  const ans = Math.max(...dist.slice(1));
  return ans === Infinity ? -1 : ans;
}`,
    language: "javascript",
    complexity: { time: "O((V+E) log V)", space: "O(V+E)" },
    systemDesign: "Network routing protocols like OSPF run Dijkstra on the router topology to find shortest-latency paths; the delay time is how long before all routers have consistent routing tables. CDN propagation time estimates use the same max-of-shortest-paths concept.",
  },
  {
    id: "graphs-29",
    title: "Cheapest Flights Within K Stops",
    difficulty: "Medium",
    tags: ["Graph", "Bellman-Ford", "BFS", "Dynamic Programming"],
    statement: "There are n cities connected by flights. Given flights[i] = [from, to, price], source src, destination dst, and integer k, return the cheapest price from src to dst with at most k stops. Return -1 if impossible.",
    examples: [
      {
        input: "n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1",
        output: "700"
      }
    ],
    intuition: "Like finding the cheapest flight route where you are only allowed a limited number of layovers — Bellman-Ford relaxes edges in rounds, with each round representing one more stop.",
    approach: [
      "Initialize prices array with Infinity, set src = 0.",
      "Run k+1 rounds of Bellman-Ford (one per allowed stop).",
      "Each round, copy current prices and relax all edges.",
      "Return prices[dst] or -1 if still Infinity."
    ],
    solution: `function findCheapestPrice(n, flights, src, dst, k) {
  let prices = new Array(n).fill(Infinity);
  prices[src] = 0;
  for (let i = 0; i <= k; i++) {
    const tmp = [...prices];
    for (const [u, v, w] of flights) {
      if (prices[u] !== Infinity && prices[u] + w < tmp[v])
        tmp[v] = prices[u] + w;
    }
    prices = tmp;
  }
  return prices[dst] === Infinity ? -1 : prices[dst];
}`,
    language: "javascript",
    complexity: { time: "O(k*E)", space: "O(V)" },
    systemDesign: "Airline pricing engines evaluate multi-hop routes with a constraint on connection count. Packet routing with TTL-limited hops uses bounded-step shortest paths to prevent loops in networks.",
    pitfalls: ["Copy prices array before each round to avoid using updated values in the same round."]
  },
  {
    id: "graphs-30",
    title: "Path With Minimum Effort",
    difficulty: "Medium",
    tags: ["Graph", "Dijkstra", "Binary Search", "BFS"],
    statement: "You are given a matrix heights where heights[r][c] is the height of cell (r,c). The effort of a path is the maximum absolute difference in heights between consecutive cells. Find the path from top-left to bottom-right with minimum effort.",
    examples: [
      {
        input: "heights = [[1,2,2],[3,8,2],[5,3,5]]",
        output: "2",
        explanation: "Path [1,3,5,3,5] has max difference 2."
      }
    ],
    intuition: "Think of it as finding a mountain hike where you want to minimize the steepest single step — use Dijkstra where the cost to a cell is the worst step taken so far.",
    approach: [
      "Use a min-heap storing [maxEffort, row, col].",
      "Start with (0, 0, 0) in the heap.",
      "For each cell, explore 4 neighbors; compute effort = max(current, |diff|).",
      "If effort is less than recorded, update and push to heap.",
      "Return effort when bottom-right is reached."
    ],
    solution: `function minimumEffortPath(heights) {
  const m = heights.length, n = heights[0].length;
  const dist = Array.from({length: m}, () => new Array(n).fill(Infinity));
  dist[0][0] = 0;
  const heap = [[0, 0, 0]]; // [effort, r, c]
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [e, r, c] = heap.shift();
    if (r === m-1 && c === n-1) return e;
    if (e > dist[r][c]) continue;
    for (const [dr, dc] of dirs) {
      const nr = r+dr, nc = c+dc;
      if (nr<0||nr>=m||nc<0||nc>=n) continue;
      const ne = Math.max(e, Math.abs(heights[nr][nc]-heights[r][c]));
      if (ne < dist[nr][nc]) { dist[nr][nc]=ne; heap.push([ne,nr,nc]); }
    }
  }
  return 0;
}`,
    language: "javascript",
    complexity: { time: "O(m*n log(m*n))", space: "O(m*n)" },
    systemDesign: "Network bandwidth path selection minimizes the bottleneck link on a route — the same minimax path problem. Video streaming CDNs pick paths minimizing the weakest-link throughput.",
  },
  {
    id: "graphs-31",
    title: "Min Cost to Connect All Points",
    difficulty: "Medium",
    tags: ["Graph", "MST", "Prim", "Kruskal"],
    statement: "Given n points on a 2D plane, connect all points with minimum total Manhattan distance. Manhattan distance between (x1,y1) and (x2,y2) is |x1-x2| + |y1-y2|. Return the minimum cost.",
    examples: [
      {
        input: "points = [[0,0],[2,2],[3,10],[5,2],[7,0]]",
        output: "20"
      }
    ],
    intuition: "Like laying cables to connect all houses at minimum wire cost — this is exactly a Minimum Spanning Tree problem on a complete graph of points.",
    approach: [
      "Use Prim's algorithm with a min-heap.",
      "Start from point 0; track minimum edge cost to add each unvisited point.",
      "Greedily pick the cheapest edge that connects a new point.",
      "Sum all picked edge costs until all n points are connected."
    ],
    solution: `function minCostConnectPoints(points) {
  const n = points.length;
  const inMST = new Array(n).fill(false);
  const minCost = new Array(n).fill(Infinity);
  minCost[0] = 0;
  let total = 0;
  for (let iter = 0; iter < n; iter++) {
    let u = -1;
    for (let i = 0; i < n; i++)
      if (!inMST[i] && (u === -1 || minCost[i] < minCost[u])) u = i;
    inMST[u] = true;
    total += minCost[u];
    for (let v = 0; v < n; v++) {
      if (!inMST[v]) {
        const d = Math.abs(points[u][0]-points[v][0]) + Math.abs(points[u][1]-points[v][1]);
        if (d < minCost[v]) minCost[v] = d;
      }
    }
  }
  return total;
}`,
    language: "javascript",
    complexity: { time: "O(n^2)", space: "O(n)" },
    systemDesign: "Telecom network design uses MST to lay fiber connecting all data-centers at minimum cable cost. Cloud region peering strategies select minimum-latency interconnects using MST on a weighted graph of data centers.",
  },
  {
    id: "graphs-32",
    title: "Swim in Rising Water",
    difficulty: "Hard",
    tags: ["Graph", "Dijkstra", "Binary Search", "Union-Find"],
    statement: "You are given an n x n integer grid where grid[i][j] = t means the elevation at cell (i,j) is t. Water rises to level t at time t. Find the minimum time to swim from (0,0) to (n-1,n-1). You can move in 4 directions; to enter a cell you must wait until t >= grid[i][j].",
    examples: [
      {
        input: "grid = [[0,2],[1,3]]",
        output: "3"
      }
    ],
    intuition: "Imagine the grid slowly filling with water — you want the earliest moment when there is a connected path of already-flooded cells from start to finish.",
    approach: [
      "Use Dijkstra where cost = max elevation on path (bottleneck shortest path).",
      "Min-heap stores [maxElevation, row, col].",
      "Relax neighbors using max(current, grid[nr][nc]).",
      "Return cost when (n-1, n-1) is dequeued."
    ],
    solution: `function swimInWater(grid) {
  const n = grid.length;
  const dist = Array.from({length:n}, ()=>new Array(n).fill(Infinity));
  dist[0][0] = grid[0][0];
  const heap = [[grid[0][0], 0, 0]];
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  while (heap.length) {
    heap.sort((a,b)=>a[0]-b[0]);
    const [t, r, c] = heap.shift();
    if (r===n-1 && c===n-1) return t;
    if (t > dist[r][c]) continue;
    for (const [dr,dc] of dirs) {
      const nr=r+dr, nc=c+dc;
      if (nr<0||nr>=n||nc<0||nc>=n) continue;
      const nt = Math.max(t, grid[nr][nc]);
      if (nt < dist[nr][nc]) { dist[nr][nc]=nt; heap.push([nt,nr,nc]); }
    }
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(n^2 log n)", space: "O(n^2)" },
    systemDesign: "Bottleneck path problems appear in network flow routing where bandwidth is constrained by the weakest link. Logistics route planning minimizes the maximum weight or clearance constraint along a path.",
    pitfalls: ["This is a minimax path, not a sum-of-weights path — use max, not addition."]
  },
  {
    id: "graphs-33",
    title: "Reconstruct Itinerary",
    difficulty: "Hard",
    tags: ["Graph", "DFS", "Eulerian Path", "Hierholzer"],
    statement: "Given a list of airline tickets [from, to], reconstruct the itinerary in order starting from 'JFK'. Use all tickets exactly once. If multiple valid itineraries exist, return the lexicographically smallest one.",
    examples: [
      {
        input: "tickets = [[\"MUC\",\"LHR\"],[\"JFK\",\"MUC\"],[\"SFO\",\"SJC\"],[\"LHR\",\"SFO\"]]",
        output: "[\"JFK\",\"MUC\",\"LHR\",\"SFO\",\"SJC\"]"
      }
    ],
    intuition: "Think of it as drawing a path on a map using every road exactly once — this is an Eulerian path problem, found by Hierholzer's algorithm.",
    approach: [
      "Build adjacency list; sort each destination list alphabetically.",
      "DFS from 'JFK': greedily visit smallest destination first.",
      "When a node has no more outgoing edges, prepend it to the result.",
      "The reversed post-order gives the Eulerian path."
    ],
    solution: `function findItinerary(tickets) {
  const g = {};
  for (const [a, b] of tickets) {
    if (!g[a]) g[a] = [];
    g[a].push(b);
  }
  for (const k in g) g[k].sort();
  const result = [];
  const dfs = (node) => {
    while (g[node] && g[node].length) dfs(g[node].shift());
    result.unshift(node);
  };
  dfs("JFK");
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(E log E)", space: "O(E)" },
    systemDesign: "Eulerian path algorithms are used in route optimization for delivery trucks that must traverse every street exactly once (Chinese Postman variant). Circuit board wiring that must connect all components in one continuous trace follows the same principle.",
  },
  {
    id: "graphs-34",
    title: "Word Ladder",
    difficulty: "Hard",
    tags: ["BFS", "Graph", "String"],
    statement: "Given beginWord, endWord, and a wordList, find the minimum number of transformations from beginWord to endWord where each transformation changes exactly one letter and each intermediate word must be in wordList. Return 0 if no path exists.",
    examples: [
      {
        input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        output: "5",
        explanation: "hit -> hot -> dot -> dog -> cog"
      }
    ],
    intuition: "Each word is a node; two words are connected if they differ by one letter. BFS finds the shortest path — like transforming one word into another through dictionary words.",
    approach: [
      "Add beginWord to word set; use BFS queue with (word, steps).",
      "For each word, try replacing each character with a-z.",
      "If the new word is in the set, enqueue it and remove from set.",
      "Return steps when endWord is reached."
    ],
    solution: `function ladderLength(beginWord, endWord, wordList) {
  const set = new Set(wordList);
  if (!set.has(endWord)) return 0;
  const queue = [[beginWord, 1]];
  while (queue.length) {
    const [word, steps] = queue.shift();
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0,i) + String.fromCharCode(c) + word.slice(i+1);
        if (next === endWord) return steps + 1;
        if (set.has(next)) { set.delete(next); queue.push([next, steps+1]); }
      }
    }
  }
  return 0;
}`,
    language: "javascript",
    complexity: { time: "O(M^2 * N)", space: "O(M^2 * N)" },
    systemDesign: "Spell-checker suggestion engines model words as a graph with edges between single-character edits (edit distance = 1), using BFS for nearest suggestions. Fuzzy search in databases uses similar neighborhood graphs.",
    pitfalls: ["Delete word from set when enqueued to avoid revisiting.", "endWord must be in wordList."]
  },
  {
    id: "graphs-35",
    title: "Word Ladder II",
    difficulty: "Hard",
    tags: ["BFS", "DFS", "Graph", "Backtracking"],
    statement: "Given beginWord, endWord, and wordList, return all shortest transformation sequences from beginWord to endWord. Each step changes exactly one letter; each intermediate word must be in wordList.",
    examples: [
      {
        input: "beginWord=\"hit\", endWord=\"cog\", wordList=[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        output: "[[\"hit\",\"hot\",\"dot\",\"dog\",\"cog\"],[\"hit\",\"hot\",\"lot\",\"log\",\"cog\"]]"
      }
    ],
    intuition: "Same as Word Ladder but you record all shortest paths — BFS finds the shortest distance layer, then backtrack from endWord to beginWord using recorded parent pointers.",
    approach: [
      "BFS level by level; for each word record all parents at the same BFS level.",
      "Stop BFS as soon as endWord is added to current level.",
      "Backtrack from endWord using parent map to reconstruct all paths.",
      "Reverse each path since it was built backward."
    ],
    solution: `function findLadders(beginWord, endWord, wordList) {
  const set = new Set(wordList);
  const parents = {};
  let layer = new Set([beginWord]);
  let found = false;
  while (layer.size && !found) {
    set.forEach(w => layer.has(w) && set.delete(w));
    const next = new Set();
    for (const word of layer) {
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const nw = word.slice(0,i)+String.fromCharCode(c)+word.slice(i+1);
          if (set.has(nw)) {
            next.add(nw);
            (parents[nw] = parents[nw]||[]).push(word);
            if (nw === endWord) found = true;
          }
        }
      }
    }
    layer = next;
  }
  if (!found) return [];
  const res = [];
  const bt = (w, path) => {
    if (w === beginWord) { res.push([...path].reverse()); return; }
    for (const p of (parents[w]||[])) { path.push(p); bt(p,path); path.pop(); }
  };
  bt(endWord, [endWord]);
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(M^2 * N)", space: "O(M^2 * N)" },
    systemDesign: "Finding all shortest dependency upgrade paths in a package manager (e.g., npm) uses layered BFS plus backtracking to display all equally optimal upgrade sequences.",
  },
  {
    id: "graphs-36",
    title: "Alien Dictionary",
    difficulty: "Hard",
    tags: ["Graph", "Topological Sort", "DFS"],
    statement: "Given a sorted list of alien language words, derive the order of characters in the alien alphabet. Return any valid ordering, or empty string if it is impossible (i.e., cyclic).",
    examples: [
      {
        input: "words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]",
        output: "\"wertf\""
      }
    ],
    intuition: "By comparing adjacent words, you can find character-ordering constraints — then topological sort gives a valid alphabet order, just like determining course prerequisites.",
    approach: [
      "Collect all unique characters as graph nodes.",
      "Compare adjacent words; first differing character gives a directed edge.",
      "If a shorter word is a prefix of a longer one that appears before it, return ''.",
      "Topological sort (Kahn's BFS); if not all chars processed, cycle exists."
    ],
    solution: `function alienOrder(words) {
  const adj = {}, indeg = {};
  for (const w of words) for (const c of w) { adj[c]=adj[c]||[]; indeg[c]=indeg[c]??0; }
  for (let i = 0; i < words.length-1; i++) {
    const [a, b] = [words[i], words[i+1]];
    const len = Math.min(a.length, b.length);
    let found = false;
    for (let j = 0; j < len; j++) {
      if (a[j] !== b[j]) { adj[a[j]].push(b[j]); indeg[b[j]]++; found=true; break; }
    }
    if (!found && a.length > b.length) return "";
  }
  const q = Object.keys(indeg).filter(c=>indeg[c]===0);
  let res = "";
  while (q.length) {
    const c = q.shift(); res += c;
    for (const nb of adj[c]) if (--indeg[nb]===0) q.push(nb);
  }
  return res.length === Object.keys(indeg).length ? res : "";
}`,
    language: "javascript",
    complexity: { time: "O(C)", space: "O(1)" },
    systemDesign: "Compiler and package managers derive build/install order from dependency declarations via topological sort — the alien dictionary extracts those constraints from sorted output.",
    pitfalls: ["Check if prefix condition is violated (invalid input).", "Isolated characters must still appear in output."]
  },
  {
    id: "graphs-37",
    title: "Critical Connections in a Network",
    difficulty: "Hard",
    tags: ["Graph", "DFS", "Tarjan", "Bridge Finding"],
    statement: "There are n servers and connections between them. A critical connection is one whose removal disconnects some servers. Find all critical connections.",
    examples: [
      {
        input: "n=4, connections=[[0,1],[1,2],[2,0],[1,3]]",
        output: "[[1,3]]"
      }
    ],
    intuition: "A bridge is an edge not part of any cycle — imagine roads where one road is the only connection between two city clusters; removing it splits the network.",
    approach: [
      "Build undirected adjacency list.",
      "DFS tracking discovery time disc[] and low[] (earliest reachable ancestor).",
      "Edge (u,v) is a bridge if low[v] > disc[u] (v cannot reach u without the edge).",
      "Collect and return all bridge edges."
    ],
    solution: `function criticalConnections(n, connections) {
  const g = Array.from({length:n},()=>[]);
  for (const [a,b] of connections) { g[a].push(b); g[b].push(a); }
  const disc = new Array(n).fill(-1), low = new Array(n).fill(0);
  const res = []; let timer = 0;
  const dfs = (u, parent) => {
    disc[u] = low[u] = timer++;
    for (const v of g[u]) {
      if (v === parent) continue;
      if (disc[v] === -1) {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) res.push([u, v]);
      } else low[u] = Math.min(low[u], disc[v]);
    }
  };
  dfs(0, -1);
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(V+E)", space: "O(V+E)" },
    systemDesign: "Network reliability engineers use bridge-finding to identify single points of failure in infrastructure topology. Fiber-optic backbone planning prioritizes adding redundant links on bridge edges.",
    pitfalls: ["Multi-edges (parallel edges) require tracking parent edge index, not just parent node."]
  },
  {
    id: "graphs-38",
    title: "Number of Ways to Arrive at Destination",
    difficulty: "Medium",
    tags: ["Graph", "Dijkstra", "Dynamic Programming"],
    statement: "You are in a city with n intersections. Given roads as [u, v, time], find the number of ways to travel from node 0 to node n-1 in the shortest time. Return the count modulo 10^9+7.",
    examples: [
      {
        input: "n=7, roads=[[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]",
        output: "4"
      }
    ],
    intuition: "Run Dijkstra for shortest distance, but also count how many distinct shortest paths lead to each node — like counting all equally fast routes on a GPS.",
    approach: [
      "Dijkstra with dist[] and ways[] arrays.",
      "When relaxing edge, if new distance < dist[v], update dist[v] and set ways[v] = ways[u].",
      "If new distance == dist[v], add ways[u] to ways[v].",
      "Return ways[n-1] mod 1e9+7."
    ],
    solution: `function countPaths(n, roads) {
  const MOD = 1e9+7;
  const g = Array.from({length:n},()=>[]);
  for (const [u,v,t] of roads) { g[u].push([v,t]); g[v].push([u,t]); }
  const dist = new Array(n).fill(Infinity), ways = new Array(n).fill(0);
  dist[0]=0; ways[0]=1;
  const heap=[[0,0]];
  while(heap.length){
    heap.sort((a,b)=>a[0]-b[0]);
    const[d,u]=heap.shift();
    if(d>dist[u]) continue;
    for(const[v,t] of g[u]){
      if(dist[u]+t<dist[v]){dist[v]=dist[u]+t;ways[v]=ways[u];heap.push([dist[v],v]);}
      else if(dist[u]+t===dist[v]) ways[v]=(ways[v]+ways[u])%MOD;
    }
  }
  return ways[n-1];
}`,
    language: "javascript",
    complexity: { time: "O((V+E) log V)", space: "O(V+E)" },
    systemDesign: "Redundant routing in networks counts the number of equal-cost multi-paths (ECMP) between nodes, used for load-balancing traffic without increasing latency.",
  },
  {
    id: "graphs-39",
    title: "Shortest Path Visiting All Nodes",
    difficulty: "Hard",
    tags: ["Graph", "BFS", "Bitmask DP"],
    statement: "Given an undirected graph of n nodes, find the shortest path that visits every node at least once. You can start and end at any node, and revisit nodes and edges.",
    examples: [
      {
        input: "graph = [[1,2,3],[0],[0],[0]]",
        output: "4"
      }
    ],
    intuition: "Track which nodes have been visited using a bitmask — BFS over (currentNode, visitedMask) states finds the shortest path covering all nodes.",
    approach: [
      "State = (node, visitedMask); target = allVisited = (1<<n)-1.",
      "Initialize BFS with all nodes as starting points (each with its bit set).",
      "Expand BFS; for each neighbor, update mask with neighbor's bit.",
      "Return BFS level when any state reaches allVisited."
    ],
    solution: `function shortestPathLength(graph) {
  const n = graph.length, full = (1<<n)-1;
  const visited = Array.from({length:n},()=>new Array(1<<n).fill(false));
  const queue = [];
  for(let i=0;i<n;i++){queue.push([i,1<<i,0]);visited[i][1<<i]=true;}
  while(queue.length){
    const[node,mask,dist]=queue.shift();
    if(mask===full) return dist;
    for(const nb of graph[node]){
      const nm=mask|(1<<nb);
      if(!visited[nb][nm]){visited[nb][nm]=true;queue.push([nb,nm,dist+1]);}
    }
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(2^n * n^2)", space: "O(2^n * n)" },
    systemDesign: "Traveling Salesman and coverage problems in logistics (meter reading, garbage collection) use bitmask DP over a graph to find minimum-distance tours covering all stops.",
    pitfalls: ["Must start BFS from all nodes simultaneously to handle arbitrary start.", "State must include both node AND mask to avoid revisiting."]
  },
  {
    id: "graphs-40",
    title: "Bus Routes",
    difficulty: "Hard",
    tags: ["BFS", "Graph"],
    statement: "You are given routes where routes[i] is the list of stops on bus route i. You start at stop source and want to reach stop target. Return the minimum number of buses you must take, or -1 if impossible.",
    examples: [
      {
        input: "routes = [[1,2,7],[3,6,7]], source = 1, target = 6",
        output: "2"
      }
    ],
    intuition: "Instead of stops as nodes, think of bus routes as nodes — you board a bus (enter a route node) and can transfer to another bus at a shared stop.",
    approach: [
      "Build map from stop to list of routes serving it.",
      "BFS on routes (not stops); start by finding all routes containing source.",
      "From each route, explore all stops; from each stop, find connected routes.",
      "Count buses taken; return count when target stop is reached."
    ],
    solution: `function numBusesToDestination(routes, source, target) {
  if(source===target) return 0;
  const stopToRoutes={};
  for(let i=0;i<routes.length;i++)
    for(const s of routes[i])(stopToRoutes[s]=stopToRoutes[s]||[]).push(i);
  const visitedRoutes=new Set(), visitedStops=new Set([source]);
  let queue=(stopToRoutes[source]||[]).filter(r=>!visitedRoutes.has(r));
  queue.forEach(r=>visitedRoutes.add(r));
  let buses=1;
  while(queue.length){
    const next=[];
    for(const r of queue){
      for(const stop of routes[r]){
        if(stop===target) return buses;
        if(!visitedStops.has(stop)){
          visitedStops.add(stop);
          for(const nr of (stopToRoutes[stop]||[]))
            if(!visitedRoutes.has(nr)){visitedRoutes.add(nr);next.push(nr);}
        }
      }
    }
    queue=next; buses++;
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(sum of route lengths)", space: "O(sum of route lengths)" },
    systemDesign: "Multi-modal transit routing systems (Google Maps transit) model this as layered BFS over transit-line nodes, counting transfers to minimize connections. Flight connection minimization with airline hubs uses the same structure.",
  },
  {
    id: "graphs-41",
    title: "Making A Large Island",
    difficulty: "Hard",
    tags: ["Graph", "Union-Find", "BFS", "DFS"],
    statement: "You have a binary grid of 0s and 1s. You can change at most one 0 to 1. Return the size of the largest island after this change.",
    examples: [
      {
        input: "grid = [[1,0],[0,1]]",
        output: "3"
      }
    ],
    intuition: "Label each island with a unique color and record its size; then for each 0, check which distinct islands it could connect and sum their sizes plus one.",
    approach: [
      "DFS to label each island with an id and compute its size.",
      "For each 0 cell, collect unique neighboring island ids.",
      "Sum sizes of those islands + 1 (the flipped cell).",
      "Track maximum; also consider the case where no 0 exists (return n*n)."
    ],
    solution: `function largestIsland(grid) {
  const n=grid.length, sz={};
  let id=2;
  const dfs=(r,c,i)=>{
    if(r<0||r>=n||c<0||c>=n||grid[r][c]!==1) return 0;
    grid[r][c]=i;
    return 1+dfs(r+1,c,i)+dfs(r-1,c,i)+dfs(r,c+1,i)+dfs(r,c-1,i);
  };
  for(let r=0;r<n;r++) for(let c=0;c<n;c++)
    if(grid[r][c]===1){sz[id]=dfs(r,c,id);id++;}
  let ans=Math.max(0,...Object.values(sz));
  const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
  for(let r=0;r<n;r++) for(let c=0;c<n;c++) if(grid[r][c]===0){
    const seen=new Set();
    let total=1;
    for(const[dr,dc] of dirs){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]>1)seen.add(grid[nr][nc]);}
    for(const i of seen) total+=sz[i]||0;
    ans=Math.max(ans,total);
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n^2)", space: "O(n^2)" },
    systemDesign: "Merging isolated network clusters by adding a single relay node is modeled identically — ISPs evaluate which single link addition maximizes connected customer coverage.",
    pitfalls: ["Use Set to avoid double-counting an island reachable from multiple directions."]
  },
  {
    id: "graphs-42",
    title: "As Far from Land as Possible",
    difficulty: "Medium",
    tags: ["BFS", "Graph", "Matrix"],
    statement: "Given an n x n binary grid where 1 = land and 0 = water, find the water cell with the maximum Manhattan distance to the nearest land cell. Return -1 if no land or no water exists.",
    examples: [
      {
        input: "grid = [[1,0,1],[0,0,0],[1,0,1]]",
        output: "2"
      }
    ],
    intuition: "Do a multi-source BFS starting from all land cells simultaneously — water cells are reached layer by layer, and the last one reached is the farthest from any land.",
    approach: [
      "Enqueue all land cells at distance 0.",
      "BFS outward to adjacent water cells, recording distance.",
      "Continue until queue is empty; track maximum distance seen.",
      "Return max distance, or -1 if no water/land exists."
    ],
    solution: `function maxDistance(grid) {
  const n=grid.length, q=[];
  for(let r=0;r<n;r++) for(let c=0;c<n;c++) if(grid[r][c]===1) q.push([r,c,0]);
  if(q.length===0||q.length===n*n) return -1;
  const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
  let ans=-1, head=0;
  while(head<q.length){
    const[r,c,d]=q[head++];
    for(const[dr,dc] of dirs){
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]===0){
        grid[nr][nc]=1; ans=Math.max(ans,d+1); q.push([nr,nc,d+1]);
      }
    }
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n^2)", space: "O(n^2)" },
    systemDesign: "Facility location problems (placing fire stations, cell towers) find the point maximizing distance from existing facilities, modeled as multi-source BFS on a grid. Voronoi diagrams computed discretely on grids follow the same logic.",
  },
  {
    id: "graphs-43",
    title: "Smallest String With Swaps",
    difficulty: "Medium",
    tags: ["Graph", "Union-Find", "Sorting"],
    statement: "Given a string s and pairs of indices that can be swapped any number of times, return the lexicographically smallest string possible after performing the swaps.",
    examples: [
      {
        input: "s=\"dcab\", pairs=[[0,3],[1,2]]",
        output: "\"bacd\""
      }
    ],
    intuition: "Indices connected by swaps (directly or transitively) form a group — you can freely rearrange characters within each group, so sort them to get the smallest result.",
    approach: [
      "Use Union-Find to group indices connected by pairs.",
      "Group all indices by their root representative.",
      "Sort characters within each group.",
      "Assign sorted characters back to their index positions."
    ],
    solution: `function smallestStringWithSwaps(s, pairs) {
  const n=s.length, parent=Array.from({length:n},(_,i)=>i);
  const find=x=>parent[x]===x?x:(parent[x]=find(parent[x]));
  const union=(a,b)=>parent[find(a)]=find(b);
  for(const[a,b] of pairs) union(a,b);
  const groups={};
  for(let i=0;i<n;i++){const r=find(i);(groups[r]=groups[r]||[]).push(i);}
  const res=s.split('');
  for(const idxs of Object.values(groups)){
    const chars=idxs.map(i=>s[i]).sort();
    idxs.sort((a,b)=>a-b);
    for(let i=0;i<idxs.length;i++) res[idxs[i]]=chars[i];
  }
  return res.join('');
}`,
    language: "javascript",
    complexity: { time: "O((n + E) alpha(n) + n log n)", space: "O(n)" },
    systemDesign: "Union-Find clusters connected components in social graphs or network partitions; grouping swappable items maps to merging shards that share data dependencies, useful in distributed database optimization.",
  },
  {
    id: "graphs-44",
    title: "Find the Celebrity",
    difficulty: "Medium",
    tags: ["Graph", "Two Pointers", "Greedy"],
    statement: "Among n people (0 to n-1), a celebrity is known by everyone but knows no one. Given a function knows(a, b) that returns whether a knows b, find the celebrity or return -1. Minimize calls to knows().",
    examples: [
      {
        input: "n=3, graph=[[1,1,0],[0,1,0],[1,1,1]]",
        output: "1"
      }
    ],
    intuition: "Walk through candidates: if A knows B, A cannot be the celebrity; if A does not know B, B cannot be the celebrity — eliminate one per call until one candidate remains, then verify.",
    approach: [
      "Start with candidate = 0.",
      "For each i from 1 to n-1: if candidate knows i, set candidate = i.",
      "Verify candidate: they must not know anyone and everyone knows them.",
      "Return candidate or -1."
    ],
    solution: `function solution(knows) {
  return function findCelebrity(n) {
    let cand = 0;
    for (let i = 1; i < n; i++) if (knows(cand, i)) cand = i;
    for (let i = 0; i < n; i++) {
      if (i === cand) continue;
      if (knows(cand, i) || !knows(i, cand)) return -1;
    }
    return cand;
  };
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Authority ranking in social networks (finding a universally followed but non-following account) mirrors this pattern. Leader election in distributed systems identifies a node known/reachable by all but that itself reaches none.",
  },
  {
    id: "graphs-45",
    title: "Number of Operations to Make Network Connected",
    difficulty: "Medium",
    tags: ["Graph", "Union-Find"],
    statement: "There are n computers and connections between them. You can remove any connection and add it elsewhere. Return the minimum number of operations to connect all computers, or -1 if impossible.",
    examples: [
      {
        input: "n=4, connections=[[0,1],[0,2],[1,2]]",
        output: "1"
      }
    ],
    intuition: "Count how many separate clusters exist — you need exactly (clusters - 1) extra cables to connect them all. You can only do this if you have enough spare cables.",
    approach: [
      "Need at least n-1 connections; return -1 if fewer.",
      "Use Union-Find to count connected components and extra (redundant) edges.",
      "Number of operations = number of components - 1.",
      "Possible only if redundant edges >= components - 1."
    ],
    solution: `function makeConnected(n, connections) {
  if(connections.length < n-1) return -1;
  const parent=Array.from({length:n},(_,i)=>i);
  const find=x=>parent[x]===x?x:(parent[x]=find(parent[x]));
  let components=n;
  for(const[a,b] of connections){
    const ra=find(a),rb=find(b);
    if(ra!==rb){parent[ra]=rb;components--;}
  }
  return components-1;
}`,
    language: "javascript",
    complexity: { time: "O(E * alpha(n))", space: "O(n)" },
    systemDesign: "Network topology repair problems in data centers count isolated racks (components) and available spare cables (redundant edges) to determine minimum reconnections. Same logic applies to microservice mesh healing.",
  },
  {
    id: "graphs-46",
    title: "Possible Bipartition",
    difficulty: "Medium",
    tags: ["Graph", "BFS", "Bipartite", "Union-Find"],
    statement: "Given n people and dislikes pairs (each person dislikes the other), determine if we can split everyone into two groups such that no two people in the same group dislike each other.",
    examples: [
      {
        input: "n=4, dislikes=[[1,2],[1,3],[2,4]]",
        output: "true"
      }
    ],
    intuition: "This is a graph 2-coloring problem — put each person in group A or B, and enemies must be in different groups. A graph is bipartite (2-colorable) if and only if it has no odd-length cycle.",
    approach: [
      "Build undirected adjacency list from dislikes.",
      "BFS/DFS to 2-color the graph.",
      "If a neighbor has the same color as the current node, return false.",
      "Return true if all components are 2-colored successfully."
    ],
    solution: `function possibleBipartition(n, dislikes) {
  const g=Array.from({length:n+1},()=>[]);
  for(const[a,b] of dislikes){g[a].push(b);g[b].push(a);}
  const color=new Array(n+1).fill(0);
  for(let i=1;i<=n;i++){
    if(color[i]) continue;
    const q=[i]; color[i]=1;
    while(q.length){
      const u=q.shift();
      for(const v of g[u]){
        if(!color[v]){color[v]=-color[u];q.push(v);}
        else if(color[v]===color[u]) return false;
      }
    }
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(V+E)", space: "O(V+E)" },
    systemDesign: "Conflict-free resource allocation (scheduling two shifts for employees with conflicts) uses bipartiteness checking. Database query planners detect join-order conflicts using the same 2-coloring approach.",
  },
  {
    id: "graphs-47",
    title: "Redundant Connection II",
    difficulty: "Hard",
    tags: ["Graph", "Union-Find", "DFS"],
    statement: "A rooted tree with n nodes (1-indexed) had one extra directed edge added, creating a graph. Find the edge that if removed, results in a valid rooted tree. Return the last such edge in the input if multiple answers exist.",
    examples: [
      {
        input: "edges = [[1,2],[1,3],[2,3]]",
        output: "[2,3]"
      }
    ],
    intuition: "One extra edge creates either a node with two parents, a cycle, or both — identify the problematic edge by checking in-degrees and using Union-Find for cycle detection.",
    approach: [
      "Find if any node has in-degree 2; it has two candidate parent edges (cand1, cand2).",
      "If a double-in-degree node exists, try removing cand2 first; if the remaining graph is a valid tree, return cand2, else return cand1.",
      "If no double-in-degree, find the edge that creates a cycle using Union-Find and return it."
    ],
    solution: `function findRedundantDirectedConnection(edges) {
  const n=edges.length;
  const parent=new Array(n+1).fill(0);
  let cand1=null,cand2=null;
  for(const[u,v] of edges){
    if(parent[v]){cand1=[parent[v],v];cand2=[u,v];}
    else parent[v]=u;
  }
  const uf=Array.from({length:n+1},(_,i)=>i);
  const find=x=>uf[x]===x?x:(uf[x]=find(uf[x]));
  for(const[u,v] of edges){
    if(cand2&&u===cand2[0]&&v===cand2[1]) continue;
    const ru=find(u),rv=find(v);
    if(ru===rv) return cand1||[u,v];
    uf[ru]=rv;
  }
  return cand2;
}`,
    language: "javascript",
    complexity: { time: "O(n * alpha(n))", space: "O(n)" },
    systemDesign: "Distributed version control conflict resolution (finding the commit that introduced a merge cycle) uses similar parent-tracking with cycle detection. Git rerere and rebase conflict detection are analogous.",
    pitfalls: ["Directed graph adds complexity over undirected — in-degree check is essential.", "Try removing the later candidate edge first."]
  },
  {
    id: "graphs-48",
    title: "Regions Cut By Slashes",
    difficulty: "Medium",
    tags: ["Graph", "Union-Find", "DFS"],
    statement: "A grid of '/', '\\', and ' ' characters divides a square area into regions. Count the number of regions formed.",
    examples: [
      {
        input: "grid = [\"/\\\\\",\"\\\\/\"]",
        output: "4"
      }
    ],
    intuition: "Split each cell into 4 triangles; '/' and '\\' separate triangles within a cell. Use Union-Find to connect triangles that share an edge (within cell or across adjacent cells), then count connected components.",
    approach: [
      "Each cell has 4 triangle sub-regions (top=0, right=1, bottom=2, left=3).",
      "Within a cell: '/' connects top-left and bottom-right pairs; '\\\\' connects top-right and bottom-left pairs; ' ' connects all 4.",
      "Across cells: connect bottom of (r,c) to top of (r+1,c) and right of (r,c) to left of (r,c+1).",
      "Count Union-Find components."
    ],
    solution: `function regionsBySlashes(grid) {
  const n=grid.length, total=4*n*n;
  const parent=Array.from({length:total},(_,i)=>i);
  const find=x=>parent[x]===x?x:(parent[x]=find(parent[x]));
  const union=(a,b)=>{const ra=find(a),rb=find(b);if(ra!==rb){parent[ra]=rb;return 1;}return 0;};
  let regions=total;
  for(let r=0;r<n;r++) for(let c=0;c<n;c++){
    const base=4*(r*n+c);
    if(grid[r][c]==='/'){regions-=union(base,base+3);regions-=union(base+1,base+2);}
    else if(grid[r][c]==='\\\\'){regions-=union(base,base+1);regions-=union(base+2,base+3);}
    else{regions-=union(base,base+1);regions-=union(base+1,base+2);regions-=union(base+2,base+3);}
    if(r+1<n) regions-=union(base+2,4*((r+1)*n+c));
    if(c+1<n) regions-=union(base+1,4*(r*n+c+1)+3);
  }
  return regions;
}`,
    language: "javascript",
    complexity: { time: "O(n^2 * alpha(n^2))", space: "O(n^2)" },
    systemDesign: "Floor-plan region analysis in CAD tools and image segmentation count connected regions after applying dividing elements, using Union-Find on pixel/cell sub-regions.",
  },
  {
    id: "graphs-49",
    title: "Detonate the Maximum Bombs",
    difficulty: "Medium",
    tags: ["Graph", "DFS", "BFS"],
    statement: "You are given a list of bombs as [x, y, r] (position and blast radius). A detonated bomb triggers others within its radius. Return the maximum number of bombs that can be detonated by detonating exactly one bomb.",
    examples: [
      {
        input: "bombs = [[2,1,3],[6,1,4]]",
        output: "2"
      }
    ],
    intuition: "Build a directed graph where bomb A has an edge to bomb B if B is within A's blast radius. Then DFS/BFS from each bomb and count reachable nodes — the answer is the maximum count.",
    approach: [
      "Build directed adjacency list: edge A->B if distance(A,B) <= r_A.",
      "For each bomb, run DFS/BFS to count reachable bombs.",
      "Return the maximum reachable count."
    ],
    solution: `function maximumDetonation(bombs) {
  const n=bombs.length;
  const g=Array.from({length:n},()=>[]);
  for(let i=0;i<n;i++) for(let j=0;j<n;j++) if(i!==j){
    const[x1,y1,r]=bombs[i],[x2,y2]=bombs[j];
    if((x1-x2)**2+(y1-y2)**2<=r*r) g[i].push(j);
  }
  const bfs=start=>{
    const vis=new Set([start]),q=[start];
    while(q.length){const u=q.shift();for(const v of g[u]) if(!vis.has(v)){vis.add(v);q.push(v);}}
    return vis.size;
  };
  let ans=0;
  for(let i=0;i<n;i++) ans=Math.max(ans,bfs(i));
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n^3)", space: "O(n^2)" },
    systemDesign: "Cascade failure analysis in infrastructure (one server failure triggering dependent services) models exactly this directed reachability. Blast-radius estimation for security incidents uses the same DFS-from-source approach.",
  },
  {
    id: "graphs-50",
    title: "Minimum Number of Vertices to Reach All Nodes",
    difficulty: "Medium",
    tags: ["Graph", "Topological Sort"],
    statement: "Given a directed acyclic graph with n nodes (0 to n-1) and edges, find the smallest set of vertices from which all nodes are reachable. The answer is unique.",
    examples: [
      {
        input: "n=6, edges=[[0,1],[0,2],[2,5],[3,4],[3,5]]",
        output: "[0,3]"
      }
    ],
    intuition: "Any node that has at least one incoming edge can be reached from its parent — only nodes with no incoming edges (in-degree 0) must be included as starting points.",
    approach: [
      "Compute in-degree of every node.",
      "Collect all nodes with in-degree 0.",
      "Return those nodes — they cannot be reached from any other node."
    ],
    solution: `function findSmallestSetOfVertices(n, edges) {
  const indeg=new Array(n).fill(0);
  for(const[,v] of edges) indeg[v]++;
  return indeg.reduce((acc,d,i)=>{if(d===0)acc.push(i);return acc;},[]);
}`,
    language: "javascript",
    complexity: { time: "O(V+E)", space: "O(V)" },
    systemDesign: "In build dependency graphs, source nodes (no dependencies) are the entry points that must be explicitly scheduled — CI/CD pipeline orchestrators identify these as the initial parallel build triggers. Microservice cold-start dependency ordering uses the same in-degree-zero identification.",
  }
];
