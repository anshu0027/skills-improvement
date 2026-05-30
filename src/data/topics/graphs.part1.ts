import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  {
    id: "graphs-01",
    title: "Find if Path Exists in Graph",
    difficulty: "Easy",
    tags: ["Graph", "BFS", "Union-Find"],
    statement: "Given n nodes labeled 0 to n-1 and a list of undirected edges, return true if there is a valid path from source to destination.",
    examples: [
      { input: "n=3, edges=[[0,1],[1,2],[2,0]], source=0, destination=2", output: "true", explanation: "Path 0->1->2 exists." },
    ],
    intuition: "Think of nodes as cities and edges as roads. We just need to check if we can drive from one city to another — BFS or Union-Find both work.",
    approach: [
      "Build an adjacency list from the edges.",
      "BFS from source, add unvisited neighbors to the queue.",
      "If we ever dequeue destination, return true.",
      "Return false if queue empties.",
    ],
    solution: `function validPath(n, edges, source, destination) {
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const visited = new Set([source]);
  const queue = [source];
  while (queue.length) {
    const node = queue.shift();
    if (node === destination) return true;
    for (const nb of adj[node]) {
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
    }
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(V+E)", space: "O(V+E)" },
    systemDesign: "Connectivity checks power friend-of-friend queries in social graphs and reachability in network topology tools. Union-Find is preferred at scale because it answers queries in near-O(1) after O(E·α) preprocessing.",
  },
  {
    id: "graphs-02",
    title: "Find Center of Star Graph",
    difficulty: "Easy",
    tags: ["Graph", "Degree"],
    statement: "Given a star graph with n nodes and n-1 edges, every edge connects to the center node. Return the center of the star graph.",
    examples: [
      { input: "edges=[[1,2],[2,3],[4,2]]", output: "2", explanation: "Node 2 appears in all edges." },
    ],
    intuition: "In a star, the center is the only city connected to every other city — it must appear in every single road. So the center is whichever node appears in both the first and second edge.",
    approach: [
      "Look at the first two edges.",
      "The center is the node that appears in both.",
      "Return edges[0][0] if it equals edges[1][0] or edges[1][1], else return edges[0][1].",
    ],
    solution: `function findCenter(edges) {
  const [a, b] = edges[0];
  return (a === edges[1][0] || a === edges[1][1]) ? a : b;
}`,
    language: "javascript",
    complexity: { time: "O(1)", space: "O(1)" },
    systemDesign: "Hub detection in network topology (finding a central router or load balancer) uses degree centrality — the same idea at scale, computed in distributed graph analytics frameworks like Apache Giraph.",
  },
  {
    id: "graphs-03",
    title: "Number of Islands",
    difficulty: "Easy",
    tags: ["Graph", "BFS", "DFS", "Matrix"],
    statement: "Given a 2D grid of '1' (land) and '0' (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
    examples: [
      { input: "grid=[[\"1\",\"1\",\"0\"],[\"0\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]", output: "2" },
    ],
    intuition: "Imagine the grid as a map. Each time you find unvisited land, you grab a paint bucket and flood-fill the whole island to mark it as visited, then count +1.",
    approach: [
      "Iterate every cell; skip water or visited cells.",
      "When you find '1', increment count and BFS/DFS from that cell.",
      "During BFS mark each cell visited (set to '0') and enqueue all 4-directional land neighbors.",
    ],
    solution: `function numIslands(grid) {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === "1") {
        count++;
        const q = [[r, c]];
        grid[r][c] = "0";
        while (q.length) {
          const [x, y] = q.shift();
          for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nx = x+dx, ny = y+dy;
            if (nx>=0&&nx<grid.length&&ny>=0&&ny<grid[0].length&&grid[nx][ny]==="1") {
              grid[nx][ny] = "0"; q.push([nx, ny]);
            }
          }
        }
      }
    }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(M*N)", space: "O(min(M,N))" },
    systemDesign: "Connected-component labeling is used in geospatial systems to identify contiguous regions (land parcels, flood zones). At scale, distributed BFS over spatial data runs on frameworks like Spark GraphX.",
  },
  {
    id: "graphs-04",
    title: "Max Area of Island",
    difficulty: "Easy",
    tags: ["Graph", "DFS", "Matrix"],
    statement: "Given a binary matrix (0=water, 1=land), return the maximum area of an island. An island's area is the number of 1-cells connected 4-directionally.",
    examples: [
      { input: "grid=[[0,0,1,0],[0,1,1,0],[0,1,0,0],[0,0,0,1]]", output: "4" },
    ],
    intuition: "Same flood-fill idea as Number of Islands, but instead of just counting islands, you measure how many land cells you paint each time and keep the biggest splash.",
    approach: [
      "For each unvisited '1' cell, run DFS and return the size of that island.",
      "In DFS, mark cell as 0, then recurse on 4 neighbors, summing sizes.",
      "Track the global maximum.",
    ],
    solution: `function maxAreaOfIsland(grid) {
  const R = grid.length, C = grid[0].length;
  function dfs(r, c) {
    if (r<0||r>=R||c<0||c>=C||grid[r][c]===0) return 0;
    grid[r][c] = 0;
    return 1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1);
  }
  let max = 0;
  for (let r=0;r<R;r++) for (let c=0;c<C;c++) max = Math.max(max, dfs(r,c));
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(M*N)", space: "O(M*N)" },
    systemDesign: "Area computation on raster grids underlies GIS tools and satellite image processing. In urban-planning platforms, contiguous zone detection uses the same DFS/BFS on spatial adjacency graphs.",
  },
  {
    id: "graphs-05",
    title: "Flood Fill",
    difficulty: "Easy",
    tags: ["Graph", "DFS", "Matrix"],
    statement: "Given an image as a 2D grid of colors, a starting cell (sr, sc), and a new color, perform a flood fill starting from that cell. Replace the color of all connected cells (4-directionally) sharing the original color.",
    examples: [
      { input: "image=[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2", output: "[[2,2,2],[2,2,0],[2,0,1]]" },
    ],
    intuition: "This is exactly the paint bucket tool in MS Paint — you click a spot and all touching same-color pixels get repainted with the new color.",
    approach: [
      "Record the original color at (sr,sc).",
      "If original color already equals newColor, return image unchanged.",
      "DFS from (sr,sc): set cell to newColor, recurse on 4 neighbors with matching original color.",
    ],
    solution: `function floodFill(image, sr, sc, color) {
  const orig = image[sr][sc];
  if (orig === color) return image;
  function dfs(r, c) {
    if (r<0||r>=image.length||c<0||c>=image[0].length||image[r][c]!==orig) return;
    image[r][c] = color;
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  }
  dfs(sr, sc);
  return image;
}`,
    language: "javascript",
    complexity: { time: "O(M*N)", space: "O(M*N)" },
    systemDesign: "Flood fill is the basis of region-growing algorithms in image segmentation (medical imaging, computer vision). In content delivery, it models cache invalidation propagation across dependent nodes.",
  },
  {
    id: "graphs-06",
    title: "Clone Graph",
    difficulty: "Easy",
    tags: ["Graph", "DFS", "Hash Map"],
    statement: "Given a reference to a node in a connected undirected graph, return a deep copy of the graph. Each node has a value and a list of neighbors.",
    examples: [
      { input: "adjList=[[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]", explanation: "A deep copy with same structure." },
    ],
    intuition: "Walk the original graph like a tourist making a map. Each time you visit a city for the first time, build a copy of it. Use the map to avoid revisiting (and to wire neighbors to the right copies).",
    approach: [
      "Use a Map from original node to its clone.",
      "DFS: if node already cloned, return its clone.",
      "Otherwise create new node with same val, store in map.",
      "Recursively clone each neighbor and push to clone's neighbors.",
    ],
    solution: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  function dfs(n) {
    if (map.has(n)) return map.get(n);
    const clone = { val: n.val, neighbors: [] };
    map.set(n, clone);
    for (const nb of n.neighbors) clone.neighbors.push(dfs(nb));
    return clone;
  }
  return dfs(node);
}`,
    language: "javascript",
    complexity: { time: "O(V+E)", space: "O(V)" },
    systemDesign: "Deep-copying object graphs appears in serialization (protobuf, JSON), in-memory database snapshots, and undo/redo systems. The visited-map pattern prevents infinite loops in circular reference structures.",
  },
  {
    id: "graphs-07",
    title: "Number of Connected Components in an Undirected Graph",
    difficulty: "Easy",
    tags: ["Graph", "Union-Find", "DFS"],
    statement: "Given n nodes (0 to n-1) and a list of undirected edges, return the number of connected components.",
    examples: [
      { input: "n=5, edges=[[0,1],[1,2],[3,4]]", output: "2" },
    ],
    intuition: "Groups of friends form cliques. Two people in the same group can reach each other. Count how many separate groups there are — that's the number of components.",
    approach: [
      "Initialize Union-Find with n nodes (each its own parent).",
      "For each edge, union the two nodes; if they were separate, decrement component count.",
      "Return the component count.",
    ],
    solution: `function countComponents(n, edges) {
  const parent = Array.from({length:n},(_,i)=>i);
  const rank = new Array(n).fill(0);
  function find(x) { return parent[x]===x ? x : (parent[x]=find(parent[x])); }
  let count = n;
  for (const [u,v] of edges) {
    const pu=find(u), pv=find(v);
    if (pu===pv) continue;
    if (rank[pu]<rank[pv]) parent[pu]=pv;
    else if (rank[pu]>rank[pv]) parent[pv]=pu;
    else { parent[pv]=pu; rank[pu]++; }
    count--;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(E·α(N))", space: "O(N)" },
    systemDesign: "Union-Find powers connected-component detection in network partitioning, detecting isolated clusters in microservice meshes, and Kruskal's MST algorithm used in telecom cable layout optimization.",
  },
  {
    id: "graphs-08",
    title: "Find the Town Judge",
    difficulty: "Easy",
    tags: ["Graph", "Degree", "Array"],
    statement: "In a town of n people, the town judge trusts nobody but is trusted by everyone else. Given a list of trust pairs [a,b] meaning a trusts b, find the judge or return -1.",
    examples: [
      { input: "n=3, trust=[[1,3],[2,3]]", output: "3", explanation: "Person 3 is trusted by 1 and 2, and trusts nobody." },
    ],
    intuition: "The judge is the one person who has zero outgoing trust arrows but n-1 incoming trust arrows — everyone points at them and they point at nobody.",
    approach: [
      "Track inDegree (trusted by) and outDegree (trusts) for each person.",
      "For each [a,b]: outDegree[a]++, inDegree[b]++.",
      "Return the person with outDegree=0 and inDegree=n-1.",
    ],
    solution: `function findJudge(n, trust) {
  const inDeg = new Array(n+1).fill(0);
  const outDeg = new Array(n+1).fill(0);
  for (const [a,b] of trust) { outDeg[a]++; inDeg[b]++; }
  for (let i=1;i<=n;i++) if (outDeg[i]===0 && inDeg[i]===n-1) return i;
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(E+N)", space: "O(N)" },
    systemDesign: "In-degree/out-degree analysis is used in PageRank-style authority scoring and detecting sink nodes (trusted authorities) in citation graphs, knowledge graphs, and web crawl graphs.",
  },
  {
    id: "graphs-09",
    title: "Course Schedule",
    difficulty: "Medium",
    tags: ["Graph", "Topological Sort", "Cycle Detection"],
    statement: "You have numCourses courses and a list of prerequisites [a,b] meaning you must take b before a. Return true if you can finish all courses (no cycle exists).",
    examples: [
      { input: "numCourses=2, prerequisites=[[1,0]]", output: "true" },
      { input: "numCourses=2, prerequisites=[[1,0],[0,1]]", output: "false", explanation: "Cycle: 0->1->0." },
    ],
    intuition: "Courses with prerequisites are like a task dependency chain. If there is a circular dependency (A needs B needs A), you can never start — that's a cycle, so return false.",
    approach: [
      "Build adjacency list and compute in-degree for each course.",
      "Add all courses with in-degree 0 to a queue (BFS / Kahn's algorithm).",
      "Process each course: decrement neighbors' in-degrees; add any that reach 0.",
      "If we process all numCourses nodes, no cycle exists.",
    ],
    solution: `function canFinish(numCourses, prerequisites) {
  const adj = Array.from({length:numCourses},()=>[]);
  const inDeg = new Array(numCourses).fill(0);
  for (const [a,b] of prerequisites) { adj[b].push(a); inDeg[a]++; }
  const q = [];
  for (let i=0;i<numCourses;i++) if (inDeg[i]===0) q.push(i);
  let done = 0;
  while (q.length) {
    const c = q.shift(); done++;
    for (const nb of adj[c]) if (--inDeg[nb]===0) q.push(nb);
  }
  return done === numCourses;
}`,
    language: "javascript",
    complexity: { time: "O(V+E)", space: "O(V+E)" },
    systemDesign: "Topological sort is the backbone of build systems (Make, Gradle, Bazel) and package managers (npm, Maven). Circular dependency detection prevents deadlocks in microservice call graphs and database foreign-key relationships.",
    pitfalls: ["A disconnected graph with no cycles is fine — Kahn's still processes all nodes.", "Self-loops are cycles too."],
  },
  {
    id: "graphs-10",
    title: "Course Schedule II",
    difficulty: "Medium",
    tags: ["Graph", "Topological Sort"],
    statement: "Same setup as Course Schedule, but return a valid ordering in which courses can be taken. Return an empty array if it is impossible.",
    examples: [
      { input: "numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]", output: "[0,1,2,3] or [0,2,1,3]" },
    ],
    intuition: "Just like scheduling tasks with dependencies, we build the order as we peel off tasks that have no remaining blockers — that's Kahn's topological sort.",
    approach: [
      "Build adjacency list and in-degree array.",
      "Queue all 0 in-degree nodes.",
      "Pop node, add to result, decrement neighbors; re-enqueue those reaching 0.",
      "If result length equals numCourses, return it; else return [].",
    ],
    solution: `function findOrder(numCourses, prerequisites) {
  const adj = Array.from({length:numCourses},()=>[]);
  const inDeg = new Array(numCourses).fill(0);
  for (const [a,b] of prerequisites) { adj[b].push(a); inDeg[a]++; }
  const q = [], order = [];
  for (let i=0;i<numCourses;i++) if (inDeg[i]===0) q.push(i);
  while (q.length) {
    const c = q.shift(); order.push(c);
    for (const nb of adj[c]) if (--inDeg[nb]===0) q.push(nb);
  }
  return order.length===numCourses ? order : [];
}`,
    language: "javascript",
    complexity: { time: "O(V+E)", space: "O(V+E)" },
    systemDesign: "CI/CD pipelines determine job execution order using topological sort on the DAG of pipeline stages. Kubernetes uses it to order resource creation (ConfigMaps before Pods).",
  },
  {
    id: "graphs-11",
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    tags: ["Graph", "BFS", "Matrix"],
    statement: "Given an m×n matrix of heights, water can flow to adjacent cells (4-dir) with equal or lower height. Find all cells from which water can flow to both the Pacific (top/left border) and Atlantic (bottom/right border) oceans.",
    examples: [
      { input: "heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]" },
    ],
    intuition: "Instead of flowing downhill from each cell (hard), reverse the problem: do BFS uphill from each ocean's border. Cells reachable from both borders are the answer.",
    approach: [
      "BFS from all Pacific border cells (top row + left col), mark pacific-reachable.",
      "BFS from all Atlantic border cells (bottom row + right col), mark atlantic-reachable.",
      "In BFS, expand to neighbors with height >= current (reverse flow).",
      "Collect cells marked in both sets.",
    ],
    solution: `function pacificAtlantic(heights) {
  const R=heights.length, C=heights[0].length;
  function bfs(starts) {
    const vis = Array.from({length:R},()=>new Array(C).fill(false));
    const q = [...starts];
    for (const [r,c] of starts) vis[r][c]=true;
    while (q.length) {
      const [r,c]=q.shift();
      for (const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nr=r+dr,nc=c+dc;
        if (nr>=0&&nr<R&&nc>=0&&nc<C&&!vis[nr][nc]&&heights[nr][nc]>=heights[r][c]) {
          vis[nr][nc]=true; q.push([nr,nc]);
        }
      }
    }
    return vis;
  }
  const pac=[], atl=[];
  for (let r=0;r<R;r++) { pac.push([r,0]); atl.push([r,C-1]); }
  for (let c=0;c<C;c++) { pac.push([0,c]); atl.push([R-1,c]); }
  const pv=bfs(pac), av=bfs(atl);
  const res=[];
  for (let r=0;r<R;r++) for (let c=0;c<C;c++) if (pv[r][c]&&av[r][c]) res.push([r,c]);
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(M*N)", space: "O(M*N)" },
    systemDesign: "Reverse-reachability BFS models data lineage in ETL pipelines — starting from output tables and tracing back to source tables. It also powers impact analysis in dependency graphs.",
  },
  {
    id: "graphs-12",
    title: "Surrounded Regions",
    difficulty: "Medium",
    tags: ["Graph", "DFS", "Matrix"],
    statement: "Given a board with 'X' and 'O', capture all 'O' regions not connected to any border 'O'. Flip captured 'O's to 'X'.",
    examples: [
      { input: "board=[[\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\"],[\"X\",\"X\",\"X\"]]", output: "[[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"]]" },
    ],
    intuition: "Any 'O' touching a border is safe. DFS from all border 'O's to mark safe cells with 'S', then flip remaining 'O' to 'X' and restore 'S' back to 'O'.",
    approach: [
      "DFS from every 'O' on the border, marking those cells 'S'.",
      "Scan entire board: 'O' -> 'X', 'S' -> 'O'.",
    ],
    solution: `function solve(board) {
  const R=board.length, C=board[0].length;
  function dfs(r,c) {
    if (r<0||r>=R||c<0||c>=C||board[r][c]!=="O") return;
    board[r][c]="S";
    dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);
  }
  for (let r=0;r<R;r++) { dfs(r,0); dfs(r,C-1); }
  for (let c=0;c<C;c++) { dfs(0,c); dfs(R-1,c); }
  for (let r=0;r<R;r++) for (let c=0;c<C;c++) {
    if (board[r][c]==="O") board[r][c]="X";
    else if (board[r][c]==="S") board[r][c]="O";
  }
}`,
    language: "javascript",
    complexity: { time: "O(M*N)", space: "O(M*N)" },
    systemDesign: "Border-connected region preservation models firewall zone rules — only traffic reachable from trusted (border) nodes is allowed. Similar logic appears in network segmentation and sandbox escape detection.",
  },
  {
    id: "graphs-13",
    title: "Rotting Oranges",
    difficulty: "Medium",
    tags: ["Graph", "BFS", "Matrix"],
    statement: "In a grid, 0=empty, 1=fresh orange, 2=rotten orange. Each minute, rotten oranges spread to adjacent fresh ones. Return minimum minutes until no fresh oranges remain, or -1 if impossible.",
    examples: [
      { input: "grid=[[2,1,1],[1,1,0],[0,1,1]]", output: "4" },
    ],
    intuition: "This is multi-source BFS — rot spreads like a wave from all initially rotten oranges simultaneously, level by level. Each BFS level = one minute.",
    approach: [
      "Enqueue all initially rotten oranges; count fresh oranges.",
      "BFS level-by-level (each level = 1 minute).",
      "For each rotten cell, rot adjacent fresh cells and decrement fresh count.",
      "Return minutes elapsed, or -1 if fresh count > 0.",
    ],
    solution: `function orangesRotting(grid) {
  const R=grid.length,C=grid[0].length;
  const q=[];let fresh=0;
  for (let r=0;r<R;r++) for (let c=0;c<C;c++) {
    if (grid[r][c]===2) q.push([r,c]);
    else if (grid[r][c]===1) fresh++;
  }
  let mins=0;
  while (q.length&&fresh>0) {
    mins++;
    for (let i=q.length;i>0;i--) {
      const [r,c]=q.shift();
      for (const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nr=r+dr,nc=c+dc;
        if (nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]===1) {
          grid[nr][nc]=2; fresh--; q.push([nr,nc]);
        }
      }
    }
  }
  return fresh===0?mins:-1;
}`,
    language: "javascript",
    complexity: { time: "O(M*N)", space: "O(M*N)" },
    systemDesign: "Multi-source BFS models epidemic spread simulations, cache invalidation cascades, and rolling deploys where updates propagate outward from seed nodes across a service mesh.",
  },
  {
    id: "graphs-14",
    title: "Walls and Gates",
    difficulty: "Medium",
    tags: ["Graph", "BFS", "Matrix"],
    statement: "You are given a rooms grid: -1=wall, 0=gate, INF=empty room. Fill each empty room with the distance to its nearest gate. If impossible to reach a gate, leave as INF.",
    examples: [
      { input: "rooms=[[INF,-1,0,INF],[INF,INF,INF,-1],[INF,-1,INF,-1],[0,-1,INF,INF]]", output: "[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]" },
    ],
    intuition: "Start BFS simultaneously from all gates (like multiple spreading fires). Each wave front increments distance by 1 — the first time BFS reaches a room is guaranteed to be the shortest path.",
    approach: [
      "Add all gate (0) cells to BFS queue.",
      "BFS outward; for each cell, try 4 neighbors.",
      "If neighbor is INF, set it to current distance + 1 and enqueue.",
    ],
    solution: `function wallsAndGates(rooms) {
  const R=rooms.length,C=rooms[0].length,INF=2147483647;
  const q=[];
  for (let r=0;r<R;r++) for (let c=0;c<C;c++) if (rooms[r][c]===0) q.push([r,c]);
  while (q.length) {
    const [r,c]=q.shift();
    for (const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr=r+dr,nc=c+dc;
      if (nr>=0&&nr<R&&nc>=0&&nc<C&&rooms[nr][nc]===INF) {
        rooms[nr][nc]=rooms[r][c]+1; q.push([nr,nc]);
      }
    }
  }
}`,
    language: "javascript",
    complexity: { time: "O(M*N)", space: "O(M*N)" },
    systemDesign: "Multi-source shortest-path BFS underlies nearest-facility queries in logistics (nearest warehouse, hospital). At scale this maps to Voronoi-diagram computation over road networks.",
  },
  {
    id: "graphs-15",
    title: "01 Matrix",
    difficulty: "Medium",
    tags: ["Graph", "BFS", "Matrix"],
    statement: "Given a binary matrix, return a matrix where each cell contains the distance to the nearest 0.",
    examples: [
      { input: "mat=[[0,0,0],[0,1,0],[1,1,1]]", output: "[[0,0,0],[0,1,0],[1,2,1]]" },
    ],
    intuition: "Seed BFS from all 0-cells at once. The BFS waves spread outward — the layer number when a 1-cell is first reached is its distance to the nearest 0.",
    approach: [
      "Initialize dist matrix: 0 for 0-cells, Infinity for 1-cells.",
      "Add all 0-cell positions to BFS queue.",
      "BFS: for each cell, update unvisited neighbors to dist+1.",
    ],
    solution: `function updateMatrix(mat) {
  const R=mat.length,C=mat[0].length;
  const dist=mat.map(r=>r.map(v=>v===0?0:Infinity));
  const q=[];
  for (let r=0;r<R;r++) for (let c=0;c<C;c++) if (mat[r][c]===0) q.push([r,c]);
  while (q.length) {
    const [r,c]=q.shift();
    for (const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr=r+dr,nc=c+dc;
      if (nr>=0&&nr<R&&nc>=0&&nc<C&&dist[nr][nc]>dist[r][c]+1) {
        dist[nr][nc]=dist[r][c]+1; q.push([nr,nc]);
      }
    }
  }
  return dist;
}`,
    language: "javascript",
    complexity: { time: "O(M*N)", space: "O(M*N)" },
    systemDesign: "Distance-to-nearest-feature computation is core in spatial analytics (proximity to store, coverage maps). Raster GIS tools implement this as multi-source Dijkstra or BFS over grid graphs.",
  },
  {
    id: "graphs-16",
    title: "Number of Provinces",
    difficulty: "Medium",
    tags: ["Graph", "Union-Find", "DFS"],
    statement: "Given an n×n adjacency matrix isConnected where isConnected[i][j]=1 means cities i and j are directly connected, return the number of provinces (groups of directly/indirectly connected cities).",
    examples: [
      { input: "isConnected=[[1,1,0],[1,1,0],[0,0,1]]", output: "2" },
    ],
    intuition: "Each province is a clique of cities all reachable from each other. DFS from each unvisited city to mark its whole province, then count how many DFS starts you needed.",
    approach: [
      "Maintain a visited array of size n.",
      "For each unvisited city, DFS through the adjacency matrix, marking all reachable cities visited.",
      "Increment province count each time a new DFS starts.",
    ],
    solution: `function findCircleNum(isConnected) {
  const n=isConnected.length;
  const vis=new Array(n).fill(false);
  function dfs(i) {
    vis[i]=true;
    for (let j=0;j<n;j++) if (isConnected[i][j]===1&&!vis[j]) dfs(j);
  }
  let count=0;
  for (let i=0;i<n;i++) if (!vis[i]) { dfs(i); count++; }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(N^2)", space: "O(N)" },
    systemDesign: "Province/cluster detection on adjacency matrices maps to community detection in social networks. LinkedIn uses similar algorithms to suggest 'People Also Know' connections within tight-knit groups.",
  },
  {
    id: "graphs-17",
    title: "Graph Valid Tree",
    difficulty: "Medium",
    tags: ["Graph", "Union-Find", "DFS"],
    statement: "Given n nodes and a list of edges, determine if the edges form a valid tree. A valid tree has exactly n-1 edges and no cycles.",
    examples: [
      { input: "n=5, edges=[[0,1],[0,2],[0,3],[1,4]]", output: "true" },
      { input: "n=5, edges=[[0,1],[1,2],[2,3],[1,3],[1,4]]", output: "false" },
    ],
    intuition: "A tree is a connected graph with no cycles. Two easy checks: must have exactly n-1 edges, and Union-Find must never try to union two already-connected nodes.",
    approach: [
      "If edges.length !== n-1, return false immediately.",
      "Union-Find: for each edge, find both nodes' roots.",
      "If same root, cycle detected — return false.",
      "Otherwise union them. Return true.",
    ],
    solution: `function validTree(n, edges) {
  if (edges.length!==n-1) return false;
  const par=Array.from({length:n},(_,i)=>i);
  function find(x) { return par[x]===x?x:(par[x]=find(par[x])); }
  for (const [u,v] of edges) {
    const pu=find(u),pv=find(v);
    if (pu===pv) return false;
    par[pu]=pv;
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(E·α(N))", space: "O(N)" },
    systemDesign: "Valid-tree checks are used in network design to verify spanning tree configurations (STP in Ethernet) and in distributed systems to validate leader-election trees are cycle-free.",
  },
  {
    id: "graphs-18",
    title: "Redundant Connection",
    difficulty: "Medium",
    tags: ["Graph", "Union-Find", "Cycle Detection"],
    statement: "A tree of n nodes has been given one extra edge. Given the edges in order, return the last edge that creates a cycle (the redundant one).",
    examples: [
      { input: "edges=[[1,2],[1,3],[2,3]]", output: "[2,3]" },
    ],
    intuition: "Process edges one by one with Union-Find. The first edge whose two endpoints already share the same root is the one forming the cycle — it's redundant.",
    approach: [
      "Initialize Union-Find for n nodes.",
      "For each edge [u,v], find roots of u and v.",
      "If same root, this edge is redundant — return it.",
      "Otherwise union them and continue.",
    ],
    solution: `function findRedundantConnection(edges) {
  const n=edges.length;
  const par=Array.from({length:n+1},(_,i)=>i);
  function find(x) { return par[x]===x?x:(par[x]=find(par[x])); }
  for (const [u,v] of edges) {
    const pu=find(u),pv=find(v);
    if (pu===pv) return [u,v];
    par[pu]=pv;
  }
  return [];
}`,
    language: "javascript",
    complexity: { time: "O(E·α(N))", space: "O(N)" },
    systemDesign: "Detecting redundant links is key in network topology management — extra links in Ethernet are disabled by Spanning Tree Protocol to prevent broadcast storms. Same pattern in version-control DAG integrity checks.",
  },
  {
    id: "graphs-19",
    title: "Accounts Merge",
    difficulty: "Medium",
    tags: ["Graph", "Union-Find", "Hash Map"],
    statement: "Each account is a list where the first element is a name and the rest are emails. Accounts belonging to the same person share at least one email. Merge accounts and return sorted email lists under each person's name.",
    examples: [
      { input: "accounts=[[\"John\",\"a@x.com\",\"b@x.com\"],[\"John\",\"c@x.com\",\"b@x.com\"]]", output: "[[\"John\",\"a@x.com\",\"b@x.com\",\"c@x.com\"]]" },
    ],
    intuition: "Each email is a node; accounts that share an email belong to the same group. Union-Find merges all emails in each account together, then we group by root email.",
    approach: [
      "Map each email to a unique id; build Union-Find on ids.",
      "For each account, union all its emails under the first email.",
      "Group emails by their root; map root email to owner name.",
      "Sort each group and prepend the name.",
    ],
    solution: `function accountsMerge(accounts) {
  const emailId={}, emailName={};
  let id=0;
  const par=[];
  function find(x) { return par[x]===x?x:(par[x]=find(par[x])); }
  for (const acc of accounts) {
    const name=acc[0];
    for (let i=1;i<acc.length;i++) {
      if (!(acc[i] in emailId)) { emailId[acc[i]]=id; par.push(id); id++; }
      emailName[acc[i]]=name;
      const root=find(emailId[acc[1]]);
      par[find(emailId[acc[i]])]=root;
    }
  }
  const groups={};
  for (const email of Object.keys(emailId)) {
    const root=find(emailId[email]);
    if (!groups[root]) groups[root]=[];
    groups[root].push(email);
  }
  return Object.entries(groups).map(([root,emails])=>[emailName[Object.keys(emailId).find(e=>emailId[e]===Number(root))??emails[0]],...emails.sort()]);
}`,
    language: "javascript",
    complexity: { time: "O(E·α(E)·log E)", space: "O(E)" },
    systemDesign: "Account deduplication at scale is a core identity-resolution problem in CRMs and data warehouses. Companies like Salesforce and Google use Union-Find or graph-based entity-matching pipelines to merge customer records.",
    pitfalls: ["Sort emails before returning.", "Name comes from any account in the group — use email-to-name map."],
  },
  {
    id: "graphs-20",
    title: "Is Graph Bipartite",
    difficulty: "Medium",
    tags: ["Graph", "BFS", "Coloring"],
    statement: "Given an undirected graph as an adjacency list, determine if it is bipartite — i.e., nodes can be split into two groups such that every edge connects nodes from different groups.",
    examples: [
      { input: "graph=[[1,3],[0,2],[1,3],[0,2]]", output: "true" },
      { input: "graph=[[1,2,3],[0,2],[0,1,3],[0,2]]", output: "false" },
    ],
    intuition: "Try to 2-color the graph like a chessboard — alternate black and white. If you ever need to color a node with the same color as its neighbor, it's not bipartite.",
    approach: [
      "Use a color array initialized to -1.",
      "BFS from each uncolored node, assigning color 0.",
      "Color each neighbor with the opposite color.",
      "If neighbor already has the same color, return false.",
    ],
    solution: `function isBipartite(graph) {
  const color=new Array(graph.length).fill(-1);
  for (let start=0;start<graph.length;start++) {
    if (color[start]!==-1) continue;
    const q=[start]; color[start]=0;
    while (q.length) {
      const node=q.shift();
      for (const nb of graph[node]) {
        if (color[nb]===-1) { color[nb]=1-color[node]; q.push(nb); }
        else if (color[nb]===color[node]) return false;
      }
    }
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(V+E)", space: "O(V)" },
    systemDesign: "Bipartiteness underlies recommendation engines — user-item interaction graphs are bipartite by design (users on one side, items on the other). Detecting violations helps validate data model integrity.",
  },
  {
    id: "graphs-21",
    title: "Keys and Rooms",
    difficulty: "Medium",
    tags: ["Graph", "DFS", "BFS"],
    statement: "There are n locked rooms (0 to n-1). Room 0 is unlocked. Each room contains keys to other rooms. Return true if you can visit all rooms.",
    examples: [
      { input: "rooms=[[1],[2],[3],[]]", output: "true" },
      { input: "rooms=[[1,3],[3,0,1],[2],[0]]", output: "false" },
    ],
    intuition: "Think of it as a key chain — you start with room 0's keys, and as you open new rooms you collect more keys. DFS/BFS from room 0 to see if you can reach every room.",
    approach: [
      "Start DFS/BFS from room 0 with a visited set.",
      "Mark room as visited, then push all keys (unvisited rooms) to the stack/queue.",
      "Return visited.size === n.",
    ],
    solution: `function canVisitAllRooms(rooms) {
  const visited=new Set([0]);
  const stack=[0];
  while (stack.length) {
    const room=stack.pop();
    for (const key of rooms[room]) {
      if (!visited.has(key)) { visited.add(key); stack.push(key); }
    }
  }
  return visited.size===rooms.length;
}`,
    language: "javascript",
    complexity: { time: "O(V+E)", space: "O(V)" },
    systemDesign: "Graph reachability under capability/permission propagation models role-based access control (RBAC) graphs, where permissions unlock other permissions, and you must verify full coverage.",
  },
  {
    id: "graphs-22",
    title: "Evaluate Division",
    difficulty: "Medium",
    tags: ["Graph", "BFS", "Weighted Graph"],
    statement: "Given equations like A/B = k and a list of queries, return the answers. If a query cannot be answered, return -1.0.",
    examples: [
      { input: "equations=[[\"a\",\"b\"],[\"b\",\"c\"]], values=[2.0,3.0], queries=[[\"a\",\"c\"]]", output: "[6.0]" },
    ],
    intuition: "Build a weighted directed graph where an edge from A to B has weight k (and B to A has weight 1/k). Answering A/C means finding a path from A to C and multiplying edge weights along the way.",
    approach: [
      "Build adjacency list with weights for each equation (both directions).",
      "For each query, BFS/DFS from src to dst, multiplying weights along path.",
      "Return the product, or -1 if no path or unknown node.",
    ],
    solution: `function calcEquation(equations, values, queries) {
  const graph={};
  for (let i=0;i<equations.length;i++) {
    const [a,b]=equations[i],v=values[i];
    if (!graph[a]) graph[a]={};
    if (!graph[b]) graph[b]={};
    graph[a][b]=v; graph[b][a]=1/v;
  }
  function bfs(src,dst) {
    if (!graph[src]||!graph[dst]) return -1;
    if (src===dst) return 1;
    const visited=new Set([src]);
    const q=[[src,1]];
    while (q.length) {
      const [node,prod]=q.shift();
      if (node===dst) return prod;
      for (const [nb,w] of Object.entries(graph[node])) {
        if (!visited.has(nb)) { visited.add(nb); q.push([nb,prod*w]); }
      }
    }
    return -1;
  }
  return queries.map(([s,d])=>bfs(s,d));
}`,
    language: "javascript",
    complexity: { time: "O(Q*(V+E))", space: "O(V+E)" },
    systemDesign: "Weighted graph traversal for transitive computations underpins currency conversion APIs, unit conversion services, and distributed tracing where latencies compose multiplicatively across service hops.",
  },
  {
    id: "graphs-23",
    title: "Minimum Height Trees",
    difficulty: "Medium",
    tags: ["Graph", "Topological Sort", "Tree"],
    statement: "Given n nodes forming a tree, return all root labels that minimize the tree height. At most 2 roots exist.",
    examples: [
      { input: "n=4, edges=[[1,0],[1,2],[1,3]]", output: "[1]" },
      { input: "n=6, edges=[[3,0],[3,1],[3,2],[3,4],[5,4]]", output: "[3,4]" },
    ],
    intuition: "The best roots are the most central nodes. Iteratively peel off leaf nodes (degree 1) like peeling an onion, layer by layer. The last 1-2 nodes remaining are the centers.",
    approach: [
      "Build adjacency list and degree array.",
      "Add all leaf nodes (degree 1) to a queue.",
      "Repeatedly remove leaves, decrement neighbor degrees; add new leaves.",
      "Stop when n <= 2; remaining nodes are the roots.",
    ],
    solution: `function findMinHeightTrees(n, edges) {
  if (n===1) return [0];
  const adj=Array.from({length:n},()=>[]);
  const deg=new Array(n).fill(0);
  for (const [u,v] of edges) { adj[u].push(v); adj[v].push(u); deg[u]++; deg[v]++; }
  let leaves=[];
  for (let i=0;i<n;i++) if (deg[i]===1) leaves.push(i);
  let remaining=n;
  while (remaining>2) {
    remaining-=leaves.length;
    const newLeaves=[];
    for (const l of leaves) {
      for (const nb of adj[l]) { if (--deg[nb]===1) newLeaves.push(nb); }
    }
    leaves=newLeaves;
  }
  return leaves;
}`,
    language: "javascript",
    complexity: { time: "O(N)", space: "O(N)" },
    systemDesign: "Finding tree centers maps to optimal placement of central services (DNS root servers, CDN PoPs) in network topology to minimize maximum latency to all leaf nodes.",
  },
  {
    id: "graphs-24",
    title: "Shortest Path in Binary Matrix",
    difficulty: "Medium",
    tags: ["Graph", "BFS", "Matrix"],
    statement: "Given an n×n binary matrix, return the length of the shortest clear path from (0,0) to (n-1,n-1). A clear path only uses 0-cells and can move in 8 directions. Return -1 if no such path exists.",
    examples: [
      { input: "grid=[[0,1],[1,0]]", output: "2" },
      { input: "grid=[[0,0,0],[1,1,0],[1,1,0]]", output: "4" },
    ],
    intuition: "BFS always finds the shortest path in an unweighted graph. Each BFS level expands one step further — the first time we reach the bottom-right cell, that's the minimum steps.",
    approach: [
      "If start or end cell is 1, return -1.",
      "BFS from (0,0) with path length 1; mark visited by setting to 1.",
      "Expand in all 8 directions to 0-cells.",
      "Return path length when (n-1,n-1) is reached.",
    ],
    solution: `function shortestPathBinaryMatrix(grid) {
  const n=grid.length;
  if (grid[0][0]===1||grid[n-1][n-1]===1) return -1;
  const q=[[0,0,1]]; grid[0][0]=1;
  const dirs=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  while (q.length) {
    const [r,c,d]=q.shift();
    if (r===n-1&&c===n-1) return d;
    for (const [dr,dc] of dirs) {
      const nr=r+dr,nc=c+dc;
      if (nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]===0) {
        grid[nr][nc]=1; q.push([nr,nc,d+1]);
      }
    }
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(N^2)", space: "O(N^2)" },
    systemDesign: "8-directional grid BFS models robot pathfinding and drone navigation in obstacle maps. Game engines use the same pattern (A* with BFS fallback) for NPC pathfinding on tile-based maps.",
  },
  {
    id: "graphs-25",
    title: "Open the Lock",
    difficulty: "Medium",
    tags: ["Graph", "BFS", "String"],
    statement: "A lock has 4 wheels each with digits 0-9. Start at '0000'. Given a list of deadends and a target, find the minimum turns to reach the target without hitting a deadend, or return -1.",
    examples: [
      { input: "deadends=[\"0201\",\"0101\",\"0102\",\"1212\",\"2002\"], target=\"0202\"", output: "6" },
    ],
    intuition: "Each lock state is a graph node. Each turn of one wheel is an edge. We BFS from '0000' to find the shortest path — just like navigating a maze where deadend rooms are walls.",
    approach: [
      "Add all deadends to a visited set. If '0000' is a deadend, return -1.",
      "BFS from '0000', tracking steps.",
      "For each state, generate 8 neighbors (each of 4 wheels, +1 or -1).",
      "Return steps when target is reached.",
    ],
    solution: `function openLock(deadends, target) {
  const dead=new Set(deadends);
  if (dead.has("0000")) return -1;
  const visited=new Set(["0000"]);
  const q=[["0000",0]];
  while (q.length) {
    const [state,steps]=q.shift();
    if (state===target) return steps;
    for (let i=0;i<4;i++) {
      const d=Number(state[i]);
      for (const delta of [1,-1]) {
        const nd=String((d+delta+10)%10);
        const next=state.slice(0,i)+nd+state.slice(i+1);
        if (!visited.has(next)&&!dead.has(next)) {
          visited.add(next); q.push([next,steps+1]);
        }
      }
    }
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(10^4 * 4 * 2)", space: "O(10^4)" },
    systemDesign: "BFS over state-space graphs is used in configuration-space search for robotics, and in network protocol state machines to find shortest transition sequences between device states.",
  },
];
