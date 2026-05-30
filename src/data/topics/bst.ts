import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  // ---- EASY (17 problems) ----
  {
    id: "bst-01",
    title: "Search in a Binary Search Tree",
    difficulty: "Easy",
    tags: ["BST", "Tree", "Recursion"],
    statement: "You are given the root of a binary search tree and an integer val. Find the node in the BST where the node's value equals val and return the subtree rooted with that node. If no such node exists, return null.",
    examples: [
      { input: "root = [4,2,7,1,3], val = 2", output: "[2,1,3]", explanation: "Node with value 2 found; its subtree is [2,1,3]." },
      { input: "root = [4,2,7,1,3], val = 5", output: "null" },
    ],
    intuition: "A BST is like a phone book sorted by name: if the target is smaller than the current page, go left; if larger, go right. You never need to search both directions.",
    approach: [
      "If root is null or root.val equals val, return root.",
      "If val < root.val, recurse left.",
      "Otherwise recurse right.",
    ],
    solution: `function searchBST(root, val) {
  if (!root || root.val === val) return root;
  return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);
}`,
    language: "javascript",
    complexity: { time: "O(h)", space: "O(h)" },
    systemDesign: "BST search is the logical model behind database B-tree index lookups: each comparison halves the search space, giving O(log n) seeks on balanced trees. Every equality or range query on an indexed column in PostgreSQL or MySQL follows this left/right navigation through a B+ tree page hierarchy.",
    pitfalls: ["An unbalanced BST degrades to O(n) — always prefer balanced variants (AVL, Red-Black) in production.", "Return the whole subtree rooted at the found node, not just the value."],
  },
  {
    id: "bst-02",
    title: "Insert into a Binary Search Tree",
    difficulty: "Easy",
    tags: ["BST", "Tree", "Recursion"],
    statement: "You are given the root of a binary search tree and a value to insert. Insert the value into the BST and return the root of the modified tree. The value is guaranteed not to exist already.",
    examples: [
      { input: "root = [4,2,7,1,3], val = 5", output: "[4,2,7,1,3,5]" },
      { input: "root = [40,20,60,10,30,50,70], val = 25", output: "[40,20,60,10,30,50,70,null,null,25]" },
    ],
    intuition: "Follow the phone-book rule until you fall off the tree, then attach the new node exactly there — every insertion lands at a leaf position.",
    approach: [
      "If root is null, create and return a new node with the given value.",
      "If val < root.val, recurse left and attach the result to root.left.",
      "Otherwise recurse right and attach to root.right.",
      "Return root.",
    ],
    solution: `function insertIntoBST(root, val) {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else root.right = insertIntoBST(root.right, val);
  return root;
}`,
    language: "javascript",
    complexity: { time: "O(h)", space: "O(h)" },
    systemDesign: "BST insertion mirrors how a database index (B+ tree) adds a new key: traverse to the correct leaf page, insert there, and split the page upward only if it overflows. Keeping the tree balanced after insertion is why databases use B-trees instead of plain BSTs — splits propagate O(log n) rebalancing work, not O(n).",
    pitfalls: ["Always return root after the recursive call so the parent's pointer is updated correctly.", "No duplicate check is needed here because the problem guarantees uniqueness."],
  },
  {
    id: "bst-03",
    title: "Minimum Absolute Difference in BST",
    difficulty: "Easy",
    tags: ["BST", "Tree", "Inorder"],
    statement: "Given the root of a BST, return the minimum absolute difference between the values of any two different nodes in the tree.",
    examples: [
      { input: "root = [4,2,6,1,3]", output: "1" },
      { input: "root = [1,0,48,null,null,12,49]", output: "1" },
    ],
    intuition: "An inorder traversal of a BST visits nodes in sorted ascending order, just like reading a sorted list. The minimum difference between any two values must be between adjacent elements in that sorted list.",
    approach: [
      "Perform an inorder traversal, keeping track of the previously visited node.",
      "At each node compute the difference between the current value and prev.",
      "Track the minimum difference seen.",
      "Return the minimum difference.",
    ],
    solution: `function getMinimumDifference(root) {
  let prev = null, minDiff = Infinity;
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    if (prev !== null) minDiff = Math.min(minDiff, node.val - prev);
    prev = node.val;
    inorder(node.right);
  }
  inorder(root);
  return minDiff;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Finding the minimum gap in a sorted index is equivalent to detecting the smallest key interval between adjacent B-tree entries — a query used in range cardinality estimation and histogram bucket sizing in query optimisers like those in Oracle and SQL Server.",
    pitfalls: ["Only subtract current from prev (not prev from current) because inorder guarantees current > prev.", "Initialize minDiff to Infinity, not 0."],
  },
  {
    id: "bst-04",
    title: "Range Sum of BST",
    difficulty: "Easy",
    tags: ["BST", "Tree", "DFS"],
    statement: "Given the root of a BST and two integers low and high, return the sum of values of all nodes with a value in the inclusive range [low, high].",
    examples: [
      { input: "root = [10,5,15,3,7,null,18], low = 7, high = 15", output: "32", explanation: "Nodes 7, 10, 15 sum to 32." },
      { input: "root = [10,5,15,3,7,13,18,1,null,6], low = 6, high = 10", output: "23" },
    ],
    intuition: "Use the BST property to prune: if the current node is too small, only its right subtree can have values in range; if too large, only its left subtree. This avoids visiting irrelevant parts of the tree.",
    approach: [
      "If root is null, return 0.",
      "If root.val < low, only recurse right.",
      "If root.val > high, only recurse left.",
      "Otherwise add root.val plus both recursive calls.",
    ],
    solution: `function rangeSumBST(root, low, high) {
  if (!root) return 0;
  if (root.val < low) return rangeSumBST(root.right, low, high);
  if (root.val > high) return rangeSumBST(root.left, low, high);
  return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Range queries with pruning are exactly how a database uses a B+ tree index for a WHERE col BETWEEN low AND high query — it navigates to the first matching leaf and scans forward, skipping entire subtrees outside the range. This makes range queries O(log n + k) where k is the number of results.",
    pitfalls: ["Do not traverse both children blindly — use BST ordering to prune irrelevant subtrees.", "The range is inclusive on both ends."],
  },
  {
    id: "bst-05",
    title: "Two Sum IV - Input is a BST",
    difficulty: "Easy",
    tags: ["BST", "Tree", "Hashing", "DFS"],
    statement: "Given the root of a BST and an integer k, return true if there exist two elements in the BST such that their sum equals k.",
    examples: [
      { input: "root = [5,3,6,2,4,null,7], k = 9", output: "true" },
      { input: "root = [5,3,6,2,4,null,7], k = 28", output: "false" },
    ],
    intuition: "It is the same Two Sum problem but the numbers are stored in a tree. Collect all values into a Set while traversing, and for each node check if (k - node.val) is already in the Set.",
    approach: [
      "DFS through the entire tree.",
      "Maintain a Set of seen values.",
      "At each node, check if k - node.val is in the Set.",
      "If yes return true; otherwise add node.val to the Set.",
    ],
    solution: `function findTarget(root, k) {
  const seen = new Set();
  function dfs(node) {
    if (!node) return false;
    if (seen.has(k - node.val)) return true;
    seen.add(node.val);
    return dfs(node.left) || dfs(node.right);
  }
  return dfs(root);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Hash-set-based two-pass joins appear in distributed systems for finding matching pairs across two partitions (e.g. finding user pairs whose activity sums to a quota). The BST structure here is irrelevant to the algorithm but matters when you want to do it with O(n) time and O(log n) space using two iterators instead.",
    pitfalls: ["The BST property alone is insufficient for an O(n) solution without a hash set — do not try a pure BST approach.", "Short-circuit with || to stop as soon as a pair is found."],
  },
  {
    id: "bst-06",
    title: "Convert Sorted Array to Binary Search Tree",
    difficulty: "Easy",
    tags: ["BST", "Tree", "Divide and Conquer", "Recursion"],
    statement: "Given an integer array nums sorted in ascending order, convert it to a height-balanced BST and return the root node. A height-balanced BST has the depth of the two subtrees of every node differing by no more than one.",
    examples: [
      { input: "nums = [-10,-3,0,5,9]", output: "[0,-3,9,-10,null,5]" },
      { input: "nums = [1,3]", output: "[3,1]" },
    ],
    intuition: "The middle element of a sorted array should be the root — this splits the array into two equal halves that become the left and right subtrees, keeping the tree perfectly balanced.",
    approach: [
      "Base case: if the array is empty, return null.",
      "Compute mid = Math.floor((lo + hi) / 2).",
      "Create a node with nums[mid].",
      "Recursively build left subtree from nums[lo..mid-1] and right from nums[mid+1..hi].",
    ],
    solution: `function sortedArrayToBST(nums) {
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    return {
      val: nums[mid],
      left: build(lo, mid - 1),
      right: build(mid + 1, hi),
    };
  }
  return build(0, nums.length - 1);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(log n)" },
    systemDesign: "Building a balanced BST from sorted data mirrors bulk-loading a B-tree index from a sorted file — databases use this technique for initial index creation (CREATE INDEX) to guarantee minimum tree height and thus O(log n) lookups from the start, avoiding costly incremental insertions.",
    pitfalls: ["Always pick the middle index (not middle value) to ensure balance.", "Both (lo+hi)>>1 and Math.floor((lo+hi)/2) are equivalent here."],
  },
  {
    id: "bst-07",
    title: "Increasing Order Search Tree",
    difficulty: "Easy",
    tags: ["BST", "Tree", "Inorder", "DFS"],
    statement: "Given the root of a BST, rearrange the tree in in-order so that the leftmost node in the tree is now the root, and every node has no left child and only one right child. Return the new root of the rearranged tree.",
    examples: [
      { input: "root = [5,3,6,2,4,null,8,1,null,null,null,7,9]", output: "[1,null,2,null,3,null,4,null,5,null,6,null,7,null,8,null,9]" },
      { input: "root = [5,1,7]", output: "[1,null,5,null,7]" },
    ],
    intuition: "Inorder traversal gives values in sorted order. Simply re-link each visited node as the right child of the previously visited node and clear its left pointer.",
    approach: [
      "Create a dummy head node; keep a current pointer to it.",
      "Inorder traversal: when visiting a node, set current.right = node, node.left = null, advance current.",
      "Return dummy.right.",
    ],
    solution: `function increasingBST(root) {
  const dummy = { val: 0, left: null, right: null };
  let cur = dummy;
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    node.left = null;
    cur.right = node;
    cur = node;
    inorder(node.right);
  }
  inorder(root);
  return dummy.right;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Flattening a balanced tree into a sorted linked list (spine) mirrors how B+ tree leaf pages are linked in a doubly linked list so that range scans can proceed linearly without climbing back up the tree — a critical design choice for efficient sequential reads in all major RDBMS engines.",
    pitfalls: ["Clear node.left before assigning node as a right child to avoid cycles.", "The dummy head simplifies pointer management for the very first node."],
  },
  {
    id: "bst-08",
    title: "Find Mode in Binary Search Tree",
    difficulty: "Easy",
    tags: ["BST", "Tree", "Inorder"],
    statement: "Given the root of a BST which may contain duplicates, return all the mode(s) — the most frequently occurring element(s). If there is more than one mode, return them in any order.",
    examples: [
      { input: "root = [1,null,2,2]", output: "[2]" },
      { input: "root = [0]", output: "[0]" },
    ],
    intuition: "Inorder traversal of a BST visits equal values consecutively, exactly like scanning a sorted list. Count runs of equal values and track the maximum run length seen.",
    approach: [
      "Inorder traversal tracking prevVal, curCount, maxCount, and result array.",
      "At each node: if val equals prevVal, increment curCount; else reset curCount to 1.",
      "If curCount equals maxCount, push to result. If curCount exceeds maxCount, reset result and update maxCount.",
    ],
    solution: `function findMode(root) {
  let prev = null, curCount = 0, maxCount = 0;
  const modes = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    curCount = node.val === prev ? curCount + 1 : 1;
    if (curCount > maxCount) { maxCount = curCount; modes.length = 0; modes.push(node.val); }
    else if (curCount === maxCount) modes.push(node.val);
    prev = node.val;
    inorder(node.right);
  }
  inorder(root);
  return modes;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Mode detection in a sorted stream is used in database statistics collection: the most frequent value (mode) in a column is stored in histogram buckets that help the query planner estimate result cardinalities for queries with equality predicates.",
    pitfalls: ["Reset the modes array (modes.length = 0) rather than creating a new one when a higher count is found — this simulates the constant-space reset.", "Handle the case where all values are unique — each node becomes a mode with count 1."],
  },
  {
    id: "bst-09",
    title: "Closest Binary Search Tree Value",
    difficulty: "Easy",
    tags: ["BST", "Tree", "Binary Search"],
    statement: "Given the root of a BST and a target floating-point value, return the value in the BST that is closest to the target.",
    examples: [
      { input: "root = [4,2,5,1,3], target = 3.714286", output: "4" },
      { input: "root = [1], target = 4.428571", output: "1" },
    ],
    intuition: "Navigate the BST like a price search: at each node, record it as the best candidate so far, then go left if target is smaller or right if larger. Stop when you fall off the tree.",
    approach: [
      "Initialize closest = root.val.",
      "While node is not null: update closest if current node is nearer to target.",
      "Go left if target < node.val, right otherwise.",
      "Return closest.",
    ],
    solution: `function closestValue(root, target) {
  let closest = root.val;
  let node = root;
  while (node) {
    if (Math.abs(node.val - target) < Math.abs(closest - target)) closest = node.val;
    node = target < node.val ? node.left : node.right;
  }
  return closest;
}`,
    language: "javascript",
    complexity: { time: "O(h)", space: "O(1)" },
    systemDesign: "Nearest-value search in a sorted index is the foundation of approximate-match queries used in recommendation systems and vector databases: traverse the index tree and track the closest seen key. Spatial index trees (R-trees, KD-trees) generalise this to multi-dimensional nearest-neighbour search.",
    pitfalls: ["When two values are equidistant, the problem guarantees a unique closest — no tie-breaking needed.", "Use absolute difference for comparison, not raw subtraction."],
  },
  {
    id: "bst-10",
    title: "Minimum Distance Between BST Nodes",
    difficulty: "Easy",
    tags: ["BST", "Tree", "Inorder"],
    statement: "Given the root of a BST, return the minimum difference between the values of any two different nodes in the tree. This is equivalent to Minimum Absolute Difference in BST.",
    examples: [
      { input: "root = [4,2,6,1,3]", output: "1" },
      { input: "root = [1,0,48,null,null,12,49]", output: "1" },
    ],
    intuition: "Inorder traversal gives nodes in sorted order; the minimum gap always appears between two adjacent values in a sorted sequence, so just compare consecutive inorder values.",
    approach: [
      "Inorder traversal keeping a prev variable.",
      "At each node, if prev is not null update minDiff with node.val - prev.",
      "Set prev = node.val.",
      "Return minDiff.",
    ],
    solution: `function minDiffInBST(root) {
  let prev = null, minDiff = Infinity;
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    if (prev !== null) minDiff = Math.min(minDiff, node.val - prev);
    prev = node.val;
    inorder(node.right);
  }
  inorder(root);
  return minDiff;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Computing the minimum gap between consecutive index entries is used in B-tree statistics for adaptive bucket width selection in query histograms, helping optimisers build more accurate cardinality estimates for range predicates.",
    pitfalls: ["This problem is identical to Minimum Absolute Difference in BST — the inorder approach works for both.", "Since BST values are unique, node.val - prev is always positive."],
  },
  {
    id: "bst-11",
    title: "Sum of Root to Leaf Binary Numbers in BST",
    difficulty: "Easy",
    tags: ["BST", "Tree", "DFS"],
    statement: "Given the root of a binary tree where each node's value is 0 or 1, each root-to-leaf path represents a binary number. Return the sum of these binary numbers.",
    examples: [
      { input: "root = [1,0,1,0,1,0,1]", output: "22", explanation: "Paths 100, 101, 110, 111 = 4+5+6+7 = 22." },
      { input: "root = [0]", output: "0" },
    ],
    intuition: "Build the binary number as you descend: shift the current number left (multiply by 2) and add the current node's bit. At a leaf, add the completed number to the total.",
    approach: [
      "DFS with a running number parameter.",
      "At each node compute num = (num << 1) | node.val.",
      "At a leaf, add num to the total sum.",
      "Return the total sum.",
    ],
    solution: `function sumRootToLeaf(root) {
  let total = 0;
  function dfs(node, num) {
    if (!node) return;
    num = (num << 1) | node.val;
    if (!node.left && !node.right) { total += num; return; }
    dfs(node.left, num);
    dfs(node.right, num);
  }
  dfs(root, 0);
  return total;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Accumulating a running hash or checksum along a path from root to leaf mirrors Patricia trie traversal used in IP routing tables: each bit of an IP address selects left or right at each node, and the accumulated path represents the longest matching prefix.",
    pitfalls: ["Leaf nodes have both left and right as null — check both, not just one.", "JavaScript bitwise shifts operate on 32-bit integers, which is sufficient for this problem."],
  },
  {
    id: "bst-12",
    title: "Univalued Binary Tree",
    difficulty: "Easy",
    tags: ["BST", "Tree", "DFS"],
    statement: "A binary tree is uni-valued if every node in the tree has the same value. Given the root of a binary tree, return true if the tree is uni-valued, or false otherwise.",
    examples: [
      { input: "root = [1,1,1,1,1,null,1]", output: "true" },
      { input: "root = [2,2,2,5,2]", output: "false" },
    ],
    intuition: "Compare every node's value to the root's value. The moment any node differs, return false. It is like checking that every page in a book has the same colour cover.",
    approach: [
      "Store the root value.",
      "DFS through every node.",
      "If any node's value differs from root value, return false.",
      "Return true if all nodes match.",
    ],
    solution: `function isUnivalTree(root) {
  const target = root.val;
  function dfs(node) {
    if (!node) return true;
    if (node.val !== target) return false;
    return dfs(node.left) && dfs(node.right);
  }
  return dfs(root);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Uniform-value tree validation is analogous to consistency checks in replicated data stores: every replica (node) must hold the same version (value). Short-circuit DFS mirrors optimistic consistency checks in distributed transactions that abort early on any divergence.",
    pitfalls: ["Short-circuit with && — once a mismatch is found you can skip the rest of the tree.", "An empty tree (null root) could be considered uni-valued by convention — check the problem constraints."],
  },
  {
    id: "bst-13",
    title: "Trim a Binary Search Tree",
    difficulty: "Easy",
    tags: ["BST", "Tree", "Recursion"],
    statement: "Given the root of a BST and the integers low and high, trim the tree so that all its values are in the inclusive range [low, high]. Return the new root of the trimmed tree.",
    examples: [
      { input: "root = [1,0,2], low = 1, high = 2", output: "[1,null,2]" },
      { input: "root = [3,0,4,null,2,null,null,1], low = 1, high = 3", output: "[3,2,null,1]" },
    ],
    intuition: "Use BST ordering to prune whole subtrees at once: if a node is too small, its entire left subtree is also too small, so replace the node with its right child; vice versa for too large.",
    approach: [
      "If root is null, return null.",
      "If root.val < low, return trimBST(root.right, low, high) — discard left subtree.",
      "If root.val > high, return trimBST(root.left, low, high) — discard right subtree.",
      "Otherwise recurse both children and return root.",
    ],
    solution: `function trimBST(root, low, high) {
  if (!root) return null;
  if (root.val < low) return trimBST(root.right, low, high);
  if (root.val > high) return trimBST(root.left, low, high);
  root.left = trimBST(root.left, low, high);
  root.right = trimBST(root.right, low, high);
  return root;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Partial-tree pruning mirrors range-based index pruning in query planners: entire B-tree subtrees whose key ranges fall outside the WHERE clause bounds are skipped entirely, reducing I/O from O(n) to O(log n + k). This is the key win of index-range scans over full table scans.",
    pitfalls: ["When a node is out of range, do not simply delete it — return the correct trimmed child subtree to preserve in-range descendants.", "The BST property guarantees that if a node is too small, its entire left subtree is also too small."],
  },
  {
    id: "bst-14",
    title: "Inorder Traversal of BST",
    difficulty: "Easy",
    tags: ["BST", "Tree", "Inorder", "Stack"],
    statement: "Given the root of a binary search tree, return the inorder traversal of its nodes' values as an array.",
    examples: [
      { input: "root = [1,null,2,3]", output: "[1,3,2]" },
      { input: "root = [3,1,2]", output: "[1,2,3]" },
    ],
    intuition: "Inorder (left, root, right) on a BST is like reading a dictionary from A to Z — it always produces values in sorted ascending order.",
    approach: [
      "Recursive approach: inorder(left), push val, inorder(right).",
      "Iterative approach: use a stack; push leftmost path, pop and visit, then push left of right child.",
    ],
    solution: `function inorderTraversal(root) {
  const result = [];
  const stack = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) { stack.push(cur); cur = cur.left; }
    cur = stack.pop();
    result.push(cur.val);
    cur = cur.right;
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Iterative inorder traversal with an explicit stack models how a database cursor iterates over a B+ tree index in order: it descends to the leftmost leaf, yields values, and follows right pointers and parent pointers — enabling sorted range scans without recursion and bounded stack depth.",
    pitfalls: ["The iterative version avoids call-stack overflow on deep trees.", "After popping, move to the right child before the next iteration — do not re-push the current node."],
  },
  {
    id: "bst-15",
    title: "N-th Smallest Prime Fraction",
    difficulty: "Easy",
    tags: ["BST", "Heap", "Binary Search"],
    statement: "Given a sorted array arr of prime numbers and an integer k, return the kth smallest fraction from all pairs arr[i]/arr[j] where i < j.",
    examples: [
      { input: "arr = [1,2,3,5], k = 3", output: "[2,5]", explanation: "Fractions in order: 1/5, 1/3, 2/5, 1/2, 3/5, 2/3. The 3rd is 2/5." },
      { input: "arr = [1,7], k = 1", output: "[1,7]" },
    ],
    intuition: "Think of rows of fractions sorted in a grid. A min-heap lets you always pick the next smallest fraction, and after picking one fraction you enqueue the next fraction from the same row.",
    approach: [
      "Push (arr[0]/arr[j], 0, j) for all j from 1 to n-1 into a min-heap.",
      "Pop k-1 times; each time push the next fraction in the same row (increment numerator index).",
      "The k-th pop gives the answer.",
    ],
    solution: `function kthSmallestPrimeFraction(arr, k) {
  // Min-heap stored as array; using sorted brute-force for simplicity
  const fracs = [];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++)
    for (let j = i + 1; j < n; j++)
      fracs.push([arr[i], arr[j], arr[i] / arr[j]]);
  fracs.sort((a, b) => a[2] - b[2]);
  return [fracs[k - 1][0], fracs[k - 1][1]];
}`,
    language: "javascript",
    complexity: { time: "O(n² log n)", space: "O(n²)" },
    systemDesign: "Sorted multi-way merge of ranked lists is the pattern behind federated search result merging in distributed search engines: each shard returns sorted hits and a global priority queue picks the top-k globally without fetching all results. A binary search on answer approach reduces this to O(n log n).",
    pitfalls: ["The brute-force approach works for small inputs; for large inputs use binary search on the fraction value.", "Fractions must be represented as exact numerator/denominator pairs, not floating-point, to avoid precision issues in the returned answer."],
  },
  {
    id: "bst-16",
    title: "Average of Levels in Binary Tree",
    difficulty: "Easy",
    tags: ["BST", "Tree", "BFS"],
    statement: "Given the root of a binary tree, return the average value of the nodes on each level in the form of an array.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[3.0,14.5,11.0]" },
      { input: "root = [3,9,20,15,7]", output: "[3.0,14.5,11.0]" },
    ],
    intuition: "BFS processes the tree level by level. For each level, sum all node values and divide by the count — like averaging grades per class year.",
    approach: [
      "Initialize a queue with the root.",
      "For each level, dequeue all current-level nodes, sum their values, and enqueue their children.",
      "Push the average (sum / count) to the result array.",
    ],
    solution: `function averageOfLevels(root) {
  const result = [];
  const queue = [root];
  while (queue.length) {
    const size = queue.length;
    let sum = 0;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      sum += node.val;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(sum / size);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(w)" },
    systemDesign: "Level-by-level aggregation mirrors how distributed MapReduce jobs compute per-partition aggregates and then merge them: each level of the tree is one reduce step. Hierarchical data rollups in OLAP cubes follow the same BFS-style level aggregation pattern.",
    pitfalls: ["Use queue.length snapshot at the start of each level loop, not a live length, to correctly separate levels.", "Average values can be floating-point — do not truncate."],
  },
  {
    id: "bst-17",
    title: "Path Sum in BST",
    difficulty: "Easy",
    tags: ["BST", "Tree", "DFS"],
    statement: "Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.",
    examples: [
      { input: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22", output: "true", explanation: "Path 5->4->11->2 = 22." },
      { input: "root = [1,2,3], targetSum = 5", output: "false" },
    ],
    intuition: "Subtract the current node's value from the target as you go down. When you reach a leaf, check if the remaining target equals the leaf's value — if so you found a valid path.",
    approach: [
      "If root is null, return false.",
      "If root is a leaf and root.val equals targetSum, return true.",
      "Recurse on left and right children with targetSum - root.val.",
    ],
    solution: `function hasPathSum(root, targetSum) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === targetSum;
  return hasPathSum(root.left, targetSum - root.val) ||
         hasPathSum(root.right, targetSum - root.val);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Root-to-leaf path constraints model access control rule chains in policy trees: a request is valid only if a complete path from root policy to a leaf permission matches all conditions. DFS with subtraction mirrors rule-chain evaluation in firewalls and IAM systems.",
    pitfalls: ["Check for leaf nodes (both children null) — do not stop at any node with a matching partial sum.", "A tree with only a root node and targetSum == root.val should return true."],
  },
  // ---- MEDIUM (18 problems) ----
  {
    id: "bst-18",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    tags: ["BST", "Tree", "DFS", "Inorder"],
    statement: "Given the root of a binary tree, determine if it is a valid binary search tree. A valid BST has the left subtree containing only nodes less than the node, the right subtree containing only nodes greater than the node, and both subtrees also being valid BSTs.",
    examples: [
      { input: "root = [2,1,3]", output: "true" },
      { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "Root is 5 but right child is 4 < 5." },
    ],
    intuition: "Each node has an allowed range: values must be strictly between a lower and upper bound inherited from its ancestors. Pass these bounds down during recursion.",
    approach: [
      "Recursive helper with min and max bounds.",
      "If node is null, return true.",
      "If node.val <= min or node.val >= max, return false.",
      "Recurse left with max = node.val and right with min = node.val.",
    ],
    solution: `function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, -Infinity, Infinity);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "BST validity is analogous to checking that all keys on a B-tree page satisfy the parent separator key constraints — a property that database storage engines verify during consistency checks (e.g. PostgreSQL VACUUM or MySQL InnoDB CHECK TABLE) to detect index corruption.",
    pitfalls: ["Comparing only with the immediate parent is wrong — a node deep in the right subtree must be greater than all its ancestor nodes on the left-turn path.", "Use -Infinity and Infinity as initial bounds to handle integer extremes."],
  },
  {
    id: "bst-19",
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Inorder", "Stack"],
    statement: "Given the root of a BST and an integer k, return the kth smallest value (1-indexed) of all the values in the tree.",
    examples: [
      { input: "root = [3,1,4,null,2], k = 1", output: "1" },
      { input: "root = [5,3,6,2,4,null,null,1], k = 3", output: "3" },
    ],
    intuition: "Inorder traversal visits a BST in ascending sorted order. Simply count nodes as you visit them; the k-th visited node is the k-th smallest.",
    approach: [
      "Iterative inorder with a stack.",
      "Pop a node, decrement k.",
      "When k reaches 0, return the current node's value.",
      "Push left children eagerly.",
    ],
    solution: `function kthSmallest(root, k) {
  const stack = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) { stack.push(cur); cur = cur.left; }
    cur = stack.pop();
    k--;
    if (k === 0) return cur.val;
    cur = cur.right;
  }
}`,
    language: "javascript",
    complexity: { time: "O(h + k)", space: "O(h)" },
    systemDesign: "Order-statistic queries (find the k-th rank) are served by augmented BSTs that store subtree sizes — every node stores the count of its descendants, allowing O(log n) rank and select queries. PostgreSQL uses a similar approach in its cost-based planner to estimate ORDER BY LIMIT k costs.",
    pitfalls: ["The iterative inorder avoids recursion-stack overflow for large trees.", "If the BST is frequently modified with insertions/deletions, augment it with subtree counts for O(log n) k-th smallest instead of O(n)."],
  },
  {
    id: "bst-20",
    title: "Lowest Common Ancestor of a Binary Search Tree",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Recursion"],
    statement: "Given the root of a BST and two nodes p and q, find their lowest common ancestor. The LCA is the deepest node that has both p and q as descendants (a node can be a descendant of itself).",
    examples: [
      { input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", output: "6" },
      { input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4", output: "2" },
    ],
    intuition: "In a BST, if both p and q are smaller than the current node, their LCA is in the left subtree. If both are larger, it is in the right subtree. Otherwise the current node splits them — it is the LCA.",
    approach: [
      "If both p.val and q.val < root.val, recurse left.",
      "If both are greater, recurse right.",
      "Otherwise return root — it is the split point.",
    ],
    solution: `function lowestCommonAncestor(root, p, q) {
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestor(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestor(root.right, p, q);
  return root;
}`,
    language: "javascript",
    complexity: { time: "O(h)", space: "O(h)" },
    systemDesign: "LCA in a BST is used to compute the common ancestor of two keys for range-query planning: the LCA node is where the root-to-p and root-to-q paths diverge, and all keys in [p, q] live in the subtree rooted at the LCA — exactly the subtree a database range scan enters.",
    pitfalls: ["BST LCA is much simpler than general binary tree LCA because you can use value comparisons to navigate.", "The BST LCA works in O(h) vs O(n) for a general tree — always exploit BST ordering when available."],
  },
  {
    id: "bst-21",
    title: "Delete Node in a BST",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Recursion"],
    statement: "Given the root of a BST and a value key, delete the node with the given key in the BST and return the updated root.",
    examples: [
      { input: "root = [5,3,6,2,4,null,7], key = 3", output: "[5,4,6,2,null,null,7]" },
      { input: "root = [5,3,6,2,4,null,7], key = 0", output: "[5,3,6,2,4,null,7]" },
    ],
    intuition: "Find the node to delete using BST search. Once found: if it has no children just remove it; if one child return that child; if two children replace its value with its inorder successor (smallest in right subtree) and delete the successor.",
    approach: [
      "If key < root.val recurse left; if key > root.val recurse right.",
      "Found the node: if no left child return right child; if no right child return left child.",
      "Two children: find the inorder successor (leftmost of right subtree), copy its value, delete it from right subtree.",
    ],
    solution: `function deleteNode(root, key) {
  if (!root) return null;
  if (key < root.val) { root.left = deleteNode(root.left, key); }
  else if (key > root.val) { root.right = deleteNode(root.right, key); }
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let successor = root.right;
    while (successor.left) successor = successor.left;
    root.val = successor.val;
    root.right = deleteNode(root.right, successor.val);
  }
  return root;
}`,
    language: "javascript",
    complexity: { time: "O(h)", space: "O(h)" },
    systemDesign: "BST deletion with inorder-successor replacement mirrors how B-tree pages handle key deletion: the key is replaced by its predecessor or successor from an adjacent page, which may trigger page underflow merges or borrows — the same cascading rebalancing that makes B-tree deletions O(log n) amortised.",
    pitfalls: ["Do not forget to return root after the recursive update — parent pointers must be refreshed.", "The inorder successor is the leftmost node of the right subtree, not necessarily the immediate right child."],
  },
  {
    id: "bst-22",
    title: "Convert BST to Greater Tree",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Reverse Inorder"],
    statement: "Given the root of a BST, convert it to a Greater Tree where every key is replaced by the original key plus the sum of all keys greater than the original key in the BST.",
    examples: [
      { input: "root = [4,1,6,0,2,5,7,null,null,null,3,null,null,null,8]", output: "[30,36,21,36,35,26,15,null,null,null,33,null,null,null,8]" },
      { input: "root = [0,null,1]", output: "[1,null,1]" },
    ],
    intuition: "A reverse inorder traversal (right, root, left) visits nodes in descending order. Maintain a running suffix sum and add it to each node as you visit it.",
    approach: [
      "Initialize a running sum = 0.",
      "Reverse inorder traversal: visit right child, then update node.val += sum, set sum = node.val, then visit left child.",
      "Return root.",
    ],
    solution: `function convertBST(root) {
  let sum = 0;
  function reverseInorder(node) {
    if (!node) return;
    reverseInorder(node.right);
    sum += node.val;
    node.val = sum;
    reverseInorder(node.left);
  }
  reverseInorder(root);
  return root;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Suffix-sum computation on ordered data appears in cumulative ranking and leaderboards: a player's score becomes their score plus the sum of all higher scores, equivalent to computing a descending prefix sum. This pattern is used in real-time leaderboard services to display 'total score ahead of you'.",
    pitfalls: ["Reverse inorder means right THEN left — do not mix up the order.", "The running sum must be a closure variable or passed by reference so all recursive calls share the same accumulator."],
  },
  {
    id: "bst-23",
    title: "Balance a Binary Search Tree",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Divide and Conquer", "Inorder"],
    statement: "Given the root of a BST, return a balanced BST with the same node values. A balanced BST is one where the depth of the two subtrees of every node never differs by more than one.",
    examples: [
      { input: "root = [1,null,2,null,3,null,4]", output: "[2,1,3,null,null,null,4]" },
      { input: "root = [2,1,3]", output: "[2,1,3]" },
    ],
    intuition: "First collect all values via inorder traversal (giving a sorted array), then rebuild the BST from the sorted array by always picking the middle element as the root — exactly like Convert Sorted Array to BST.",
    approach: [
      "Inorder traversal to collect sorted values.",
      "Recursively build a balanced BST by picking the middle element as the root.",
    ],
    solution: `function balanceBST(root) {
  const vals = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    return { val: vals[mid], left: build(lo, mid - 1), right: build(mid + 1, hi) };
  }
  return build(0, vals.length - 1);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Rebalancing a BST is what database engines do during index reorganisation: a heavily skewed index (from sequential inserts) is rebuilt as a balanced tree to restore O(log n) lookup. PostgreSQL's REINDEX and MySQL's OPTIMIZE TABLE are real-world commands that trigger this kind of structural rebuild.",
    pitfalls: ["Collect values via inorder first — this gives a sorted array which is a prerequisite for balanced construction.", "Reuse the Convert Sorted Array to BST logic rather than re-implementing it."],
  },
  {
    id: "bst-24",
    title: "Binary Search Tree Iterator",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Stack", "Design", "Iterator"],
    statement: "Implement the BSTIterator class for an inorder traversal of a BST. The constructor takes the root. next() returns the next smallest number. hasNext() returns whether there is a next element. Both operations must run in average O(1) time and O(h) space.",
    examples: [
      { input: "BSTIterator([7,3,15,null,null,9,20]); next()=3; next()=7; hasNext()=true; next()=9; ...", output: "3,7,true,9,15,true,20,false" },
    ],
    intuition: "Simulate inorder traversal lazily using a stack. The stack always contains the leftmost path from the current node to the deepest unvisited left descendant — like a bookmark in the tree.",
    approach: [
      "Constructor: push all left nodes of root onto the stack.",
      "next(): pop the top node, push all left nodes of its right child, return the popped value.",
      "hasNext(): return stack.length > 0.",
    ],
    solution: `class BSTIterator {
  constructor(root) {
    this.stack = [];
    this._pushLeft(root);
  }
  _pushLeft(node) {
    while (node) { this.stack.push(node); node = node.left; }
  }
  next() {
    const node = this.stack.pop();
    this._pushLeft(node.right);
    return node.val;
  }
  hasNext() {
    return this.stack.length > 0;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) amortised", space: "O(h)" },
    systemDesign: "Lazy iterators with O(h) state are exactly how database cursor objects work: they hold a position in a B-tree (current page + slot) and advance incrementally without materialising the entire result set. This enables streaming query results over network connections without buffering all rows in memory.",
    pitfalls: ["Each node is pushed and popped exactly once across all next() calls — O(1) amortised, not O(h) per call.", "O(h) space is acceptable and expected — do not try to reduce it to O(1) without changing the problem constraints."],
  },
  {
    id: "bst-25",
    title: "Inorder Successor in BST",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Inorder"],
    statement: "Given a BST and a node p in it, find the inorder successor of that node in the BST. The inorder successor is the node with the smallest key greater than p.val. If no such node exists, return null.",
    examples: [
      { input: "root = [2,1,3], p = 1", output: "2" },
      { input: "root = [5,3,6,2,4,null,null,1], p = 6", output: "null" },
    ],
    intuition: "The inorder successor is the smallest value greater than p.val. If p has a right subtree, it is the leftmost node there. Otherwise it is the deepest ancestor on the left-turn path from the root.",
    approach: [
      "Initialize successor = null.",
      "Start at root, navigate using BST ordering.",
      "If root.val > p.val, update successor = root and go left (candidate found, look for better).",
      "If root.val <= p.val, go right.",
      "Return successor.",
    ],
    solution: `function inorderSuccessor(root, p) {
  let successor = null;
  let cur = root;
  while (cur) {
    if (cur.val > p.val) {
      successor = cur;
      cur = cur.left;
    } else {
      cur = cur.right;
    }
  }
  return successor;
}`,
    language: "javascript",
    complexity: { time: "O(h)", space: "O(1)" },
    systemDesign: "Inorder successor lookup is the primitive behind B-tree range scan continuation: after processing a key, the database advances to its successor in the index. This also models the NEXT KEY LOCK in InnoDB's gap locking — locking the successor key prevents phantom reads in REPEATABLE READ transactions.",
    pitfalls: ["Do not look for a right subtree explicitly — the iterative BST traversal handles both cases uniformly.", "A node with no successor (largest element) correctly returns null because successor is never updated."],
  },
  {
    id: "bst-26",
    title: "All Elements in Two Binary Search Trees",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Inorder", "Merge"],
    statement: "Given the roots of two binary search trees root1 and root2, return a list containing all integers from both trees sorted in ascending order.",
    examples: [
      { input: "root1 = [2,1,4], root2 = [1,0,3]", output: "[0,1,1,2,3,4]" },
      { input: "root1 = [1,null,8], root2 = [8,1]", output: "[1,1,8,8]" },
    ],
    intuition: "Inorder traversal of each BST gives a sorted array. Merging two sorted arrays into one is the classic merge step from merge sort.",
    approach: [
      "Inorder traverse root1 to get sorted array a.",
      "Inorder traverse root2 to get sorted array b.",
      "Merge a and b using two pointers.",
    ],
    solution: `function getAllElements(root1, root2) {
  const a = [], b = [];
  function inorder(node, arr) {
    if (!node) return;
    inorder(node.left, arr);
    arr.push(node.val);
    inorder(node.right, arr);
  }
  inorder(root1, a);
  inorder(root2, b);
  const result = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) result.push(a[i++]);
    else result.push(b[j++]);
  }
  while (i < a.length) result.push(a[i++]);
  while (j < b.length) result.push(b[j++]);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(m + n)", space: "O(m + n)" },
    systemDesign: "Merging sorted output from multiple BST indexes mirrors how database query engines perform index merge joins: each index provides a sorted stream, and a merge operator combines them in O(n+m) without sorting — a key technique in PostgreSQL's bitmap index scan and MySQL's index merge optimisation.",
    pitfalls: ["Collect both sorted arrays first, then merge — do not try to interleave the two traversals directly without careful synchronisation.", "The merge step is O(m+n) and is the bottleneck; both traversals are also O(m+n) total."],
  },
  {
    id: "bst-27",
    title: "Unique Binary Search Trees",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Dynamic Programming", "Math"],
    statement: "Given an integer n, return the number of structurally unique BSTs which have exactly n nodes with values 1 to n.",
    examples: [
      { input: "n = 3", output: "5" },
      { input: "n = 1", output: "1" },
    ],
    intuition: "For each value i as root, the left subtree has (i-1) nodes and the right subtree has (n-i) nodes. The total count is the product of the counts for each side, summed over all possible roots.",
    approach: [
      "Build a DP table dp[i] = number of unique BSTs with i nodes.",
      "Base cases: dp[0] = dp[1] = 1.",
      "For each n from 2 to n: dp[n] = sum over j from 1 to n of dp[j-1] * dp[n-j].",
      "Return dp[n].",
    ],
    solution: `function numTrees(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; dp[1] = 1;
  for (let i = 2; i <= n; i++)
    for (let j = 1; j <= i; j++)
      dp[i] += dp[j - 1] * dp[i - j];
  return dp[n];
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n)" },
    systemDesign: "Counting BST structures is equivalent to counting Catalan numbers, which also count the number of valid bracket sequences and monotone path shapes. Database query optimisers count possible join orderings (which are structurally equivalent to binary tree shapes) to bound the search space when choosing the optimal execution plan.",
    pitfalls: ["dp[0] = 1 (empty tree is one valid structure) is a critical base case.", "This problem asks for the count only — see Unique BSTs II for actually generating all structures."],
  },
  {
    id: "bst-28",
    title: "Unique Binary Search Trees II",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Dynamic Programming", "Recursion", "Backtracking"],
    statement: "Given an integer n, return all structurally unique BSTs which have exactly n nodes with values 1 to n. Return the answer in any order.",
    examples: [
      { input: "n = 3", output: "[[1,null,2,null,3],[1,null,3,2],[2,1,3],[3,1,null,null,2],[3,2,null,1]]" },
      { input: "n = 1", output: "[[1]]" },
    ],
    intuition: "For each value i as root, recursively generate all left subtrees from values 1 to i-1 and all right subtrees from i+1 to n. Combine each left tree with each right tree to form a complete BST.",
    approach: [
      "Recursive generate(lo, hi) returns all BST roots for values lo..hi.",
      "Base case: if lo > hi return [null].",
      "For each root value i, generate all left trees (lo, i-1) and right trees (i+1, hi).",
      "For each left-right combination, create a node with value i.",
    ],
    solution: `function generateTrees(n) {
  function generate(lo, hi) {
    if (lo > hi) return [null];
    const trees = [];
    for (let i = lo; i <= hi; i++) {
      const lefts = generate(lo, i - 1);
      const rights = generate(i + 1, hi);
      for (const l of lefts)
        for (const r of rights)
          trees.push({ val: i, left: l, right: r });
    }
    return trees;
  }
  return generate(1, n);
}`,
    language: "javascript",
    complexity: { time: "O(Catalan(n) * n)", space: "O(Catalan(n) * n)" },
    systemDesign: "Enumerating all valid tree structures corresponds to query plan enumeration in join-order optimisation: every unique BST shape represents a different join tree. Dynamic programming with memoisation (caching generate(lo,hi) results) reduces redundant work, mirroring how query optimisers cache partial plan costs to avoid re-evaluating the same sub-problem.",
    pitfalls: ["Subtrees are shared across multiple parent nodes — sharing is intentional and reduces memory, but be cautious about mutation.", "The number of generated trees grows as Catalan(n), which grows exponentially — do not run this for large n."],
  },
  {
    id: "bst-29",
    title: "Construct Binary Search Tree from Preorder Traversal",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Recursion", "Monotonic Stack"],
    statement: "Given an array of integers preorder representing the preorder traversal of a BST, construct the tree and return its root.",
    examples: [
      { input: "preorder = [8,5,1,7,10,12]", output: "[8,5,10,1,7,null,12]" },
      { input: "preorder = [1,3]", output: "[1,null,3]" },
    ],
    intuition: "In preorder, the first element is always the root. All values smaller than the root belong to the left subtree; all larger belong to the right. Recursively split at the boundary.",
    approach: [
      "Use a global index pointer into the preorder array and an upper bound.",
      "If index is past the end or preorder[index] >= bound, return null.",
      "Create a node with preorder[index++].",
      "Recurse left with bound = node.val, then right with same bound.",
    ],
    solution: `function bstFromPreorder(preorder) {
  let i = 0;
  function build(bound) {
    if (i === preorder.length || preorder[i] > bound) return null;
    const node = { val: preorder[i++], left: null, right: null };
    node.left = build(node.val);
    node.right = build(bound);
    return node;
  }
  return build(Infinity);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Reconstructing a tree from its serialised traversal is how databases restore index structures from write-ahead logs (WAL) during crash recovery: the preorder sequence encodes the insertion order, and replaying it rebuilds the exact same tree structure — essential for ACID durability guarantees.",
    pitfalls: ["The bound parameter eliminates the need to search for the split point, giving O(n) instead of O(n²).", "The index variable must be shared across all recursive calls — use a closure or object wrapper."],
  },
  {
    id: "bst-30",
    title: "Split BST",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Recursion"],
    statement: "Given the root of a BST and an integer target, split the tree into two subtrees where one contains nodes with values less than or equal to target and the other contains nodes with values greater than target. Return both roots as an array [left, right].",
    examples: [
      { input: "root = [4,2,6,1,3,5,7], target = 2", output: "[[2,1],[4,3,6,null,null,5,7]]" },
      { input: "root = [1], target = 1", output: "[[1],null]" },
    ],
    intuition: "Navigate using BST ordering. If the current node is <= target, its left subtree is entirely in the left part; recurse right to split the right subtree. If > target, its right subtree is entirely in the right part; recurse left.",
    approach: [
      "If root is null, return [null, null].",
      "If root.val <= target: split right subtree. Left part = root with root.right = returned left. Right part = returned right.",
      "If root.val > target: split left subtree. Left part = returned left. Right part = root with root.left = returned right.",
    ],
    solution: `function splitBST(root, target) {
  if (!root) return [null, null];
  if (root.val <= target) {
    const [left, right] = splitBST(root.right, target);
    root.right = left;
    return [root, right];
  } else {
    const [left, right] = splitBST(root.left, target);
    root.left = right;
    return [left, root];
  }
}`,
    language: "javascript",
    complexity: { time: "O(h)", space: "O(h)" },
    systemDesign: "BST splitting mirrors range-based shard splitting in distributed databases: when a shard grows too large, it is split at a pivot key into two shards — each receiving a BST-like subtree of the sorted key space. This operation is O(log n) and is how databases like CockroachDB handle auto-range splits.",
    pitfalls: ["Reattach the split child back to the original node before returning — do not leave dangling pointers.", "The split is in-place — original nodes are reused, no new nodes are created."],
  },
  {
    id: "bst-31",
    title: "Recover Binary Search Tree",
    difficulty: "Medium",
    tags: ["BST", "Tree", "Inorder", "Morris Traversal"],
    statement: "You are given the root of a BST where exactly two nodes have been swapped by mistake. Recover the tree without changing its structure.",
    examples: [
      { input: "root = [1,3,null,null,2]", output: "[3,1,null,null,2]" },
      { input: "root = [3,1,4,null,null,2]", output: "[2,1,4,null,null,3]" },
    ],
    intuition: "Inorder traversal of a correct BST is strictly ascending. Two swapped nodes appear as anomalies: the first anomaly is where a larger value comes before a smaller one. The swapped pair is the first node of the first anomaly and the second node of the last anomaly.",
    approach: [
      "Inorder traversal tracking prev node.",
      "When prev.val > curr.val, it is an anomaly.",
      "First anomaly: set first = prev, second = curr.",
      "Second anomaly (if exists): update second = curr.",
      "Swap first.val and second.val.",
    ],
    solution: `function recoverTree(root) {
  let first = null, second = null, prev = null;
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    if (prev && prev.val > node.val) {
      if (!first) first = prev;
      second = node;
    }
    prev = node;
    inorder(node.right);
  }
  inorder(root);
  const tmp = first.val;
  first.val = second.val;
  second.val = tmp;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Detecting and correcting ordering anomalies in a sorted structure mirrors index repair in databases after corruption: a consistency checker scans the index in order, identifies out-of-order entries (like two swapped keys), and fixes the anomaly with minimal structural changes — the same logic as REPAIR TABLE in MySQL.",
    pitfalls: ["There are two cases: adjacent swapped nodes (one inversion found) and non-adjacent nodes (two inversions found). Always update second on every inversion.", "Use Morris traversal for O(1) space if required."],
  },
  {
    id: "bst-32",
    title: "My Calendar I",
    difficulty: "Medium",
    tags: ["BST", "Design", "Sorting"],
    statement: "Implement a MyCalendar class to store events and check for double-booking. book(start, end) adds the event [start, end) if it does not cause a double booking (no overlap with existing events). Return true if successful, false otherwise.",
    examples: [
      { input: "book(10,20)=true; book(15,25)=false; book(20,30)=true", output: "true,false,true" },
    ],
    intuition: "Store booked intervals in a BST sorted by start time. For a new interval, find the first interval that starts at or after the new start — check it does not overlap, and also check the interval just before it.",
    approach: [
      "Use a sorted map (or BST) of start -> end.",
      "For new [start, end): find the first booking with start >= new start.",
      "Check it starts at or after new end (no overlap with next).",
      "Check previous booking ends at or before new start (no overlap with previous).",
    ],
    solution: `class MyCalendar {
  constructor() {
    this.bookings = []; // sorted by start
  }
  book(start, end) {
    let lo = 0, hi = this.bookings.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.bookings[mid][0] < start) lo = mid + 1;
      else hi = mid;
    }
    // lo is insertion point
    if (lo < this.bookings.length && this.bookings[lo][0] < end) return false;
    if (lo > 0 && this.bookings[lo - 1][1] > start) return false;
    this.bookings.splice(lo, 0, [start, end]);
    return true;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n) per booking (splice)", space: "O(n)" },
    systemDesign: "Calendar booking overlap detection with a BST is how distributed scheduling systems (Google Calendar API, meeting room booking) prevent double-booking: they store intervals in a sorted index and use a range query to check for conflicts in O(log n) per insert. Using a balanced BST makes each booking O(log n) instead of O(n).",
    pitfalls: ["The splice operation is O(n) — for O(log n) amortised use a true balanced BST (e.g. a sorted set).", "The interval is half-open [start, end): adjacent bookings like (10,20) and (20,30) are valid."],
  },
  {
    id: "bst-33",
    title: "Contains Duplicate III",
    difficulty: "Medium",
    tags: ["BST", "Sliding Window", "Sorting", "Bucket Sort"],
    statement: "Given an integer array nums and two integers indexDiff and valueDiff, return true if there are two distinct indices i and j such that |i - j| <= indexDiff and |nums[i] - nums[j]| <= valueDiff.",
    examples: [
      { input: "nums = [1,2,3,1], indexDiff = 3, valueDiff = 0", output: "true" },
      { input: "nums = [1,5,9,1,5,9], indexDiff = 2, valueDiff = 3", output: "false" },
    ],
    intuition: "Maintain a sliding window of the last indexDiff elements in a sorted structure. For each new element, check if any element in the window is within valueDiff of it — a BST lets you find the nearest value in O(log n).",
    approach: [
      "Use a sorted set (simulated with a sorted array here) of size at most indexDiff.",
      "For each element, find the floor and ceiling values in the sorted set.",
      "If floor >= nums[i] - valueDiff or ceiling <= nums[i] + valueDiff, return true.",
      "Add nums[i] and remove nums[i - indexDiff] to maintain window size.",
    ],
    solution: `function containsNearbyAlmostDuplicate(nums, indexDiff, valueDiff) {
  // Bucket sort approach: O(n) time
  const bucketSize = valueDiff + 1;
  const buckets = new Map();
  for (let i = 0; i < nums.length; i++) {
    const bucketId = Math.floor(nums[i] / bucketSize);
    if (buckets.has(bucketId)) return true;
    if (buckets.has(bucketId - 1) && Math.abs(nums[i] - buckets.get(bucketId - 1)) < bucketSize) return true;
    if (buckets.has(bucketId + 1) && Math.abs(nums[i] - buckets.get(bucketId + 1)) < bucketSize) return true;
    buckets.set(bucketId, nums[i]);
    if (i >= indexDiff) buckets.delete(Math.floor(nums[i - indexDiff] / bucketSize));
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "Sliding window range queries appear in stream processing systems that detect near-duplicate events within a time window (e.g. fraud detection: the same card used twice within 5 minutes for similar amounts). The bucket sort trick maps to consistent hashing with bounded-key-range buckets, enabling O(1) proximity checks.",
    pitfalls: ["Negative numbers require careful floor division — Math.floor in JavaScript handles negatives correctly but some languages do not.", "The bucket size is valueDiff + 1 to ensure any two values in the same bucket differ by at most valueDiff."],
  },
  {
    id: "bst-34",
    title: "Largest BST Subtree",
    difficulty: "Medium",
    tags: ["BST", "Tree", "DFS", "Divide and Conquer"],
    statement: "Given the root of a binary tree, find the largest subtree which is a BST. Return the size of the largest BST subtree. A BST is defined as follows: all values in the left subtree are less than the root, all values in the right subtree are greater than the root, and both subtrees are also BSTs.",
    examples: [
      { input: "root = [10,5,15,1,8,null,7]", output: "3", explanation: "Subtree rooted at 5 with nodes 1,5,8 is the largest BST." },
      { input: "root = [4,2,7,2,3,5,null,2,null,null,null,null,null,1]", output: "2" },
    ],
    intuition: "For each node, determine post-order if its subtree is a valid BST, along with its min and max values and size. Combine left and right results: if both are valid BSTs and values satisfy BST property, the combined subtree is a BST.",
    approach: [
      "Post-order DFS returning (isBST, size, minVal, maxVal) for each subtree.",
      "If both children are valid BSTs and left.max < root.val < right.min, the subtree is a valid BST.",
      "Track the maximum BST size seen.",
    ],
    solution: `function largestBSTSubtree(root) {
  let maxSize = 0;
  function dfs(node) {
    if (!node) return { isBST: true, size: 0, min: Infinity, max: -Infinity };
    const l = dfs(node.left);
    const r = dfs(node.right);
    if (l.isBST && r.isBST && node.val > l.max && node.val < r.min) {
      const size = l.size + r.size + 1;
      maxSize = Math.max(maxSize, size);
      return { isBST: true, size, min: Math.min(l.min, node.val), max: Math.max(r.max, node.val) };
    }
    return { isBST: false, size: 0, min: 0, max: 0 };
  }
  dfs(root);
  return maxSize;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Finding the largest valid-property subtree maps to schema validation in hierarchical data stores (XML/JSON): identify the deepest node whose entire subtree satisfies a schema constraint, used in document databases like MongoDB when validating nested document structures against partial schemas.",
    pitfalls: ["Return min and max of the subtree (not just the root value) so parent nodes can correctly check BST constraints.", "Use Infinity and -Infinity as defaults for empty subtrees to make the parent's comparison always pass."],
  },
  {
    id: "bst-35",
    title: "Count of Range Sum",
    difficulty: "Medium",
    tags: ["BST", "Prefix Sum", "Merge Sort", "Binary Indexed Tree"],
    statement: "Given an integer array nums and two integers lower and upper, return the number of range sums that lie in the inclusive range [lower, upper]. Range sum S(i, j) is the sum of elements in nums between index i and j (inclusive).",
    examples: [
      { input: "nums = [-2,5,-1], lower = -2, upper = 2", output: "3", explanation: "Range sums: [0,-1],[-1] = 3." },
      { input: "nums = [0], lower = 0, upper = 0", output: "1" },
    ],
    intuition: "Build prefix sums. For each prefix sum[j], count how many earlier prefix sums[i] satisfy lower <= sum[j] - sum[i] <= upper, i.e. sum[j] - upper <= sum[i] <= sum[j] - lower. Use merge sort to count these pairs efficiently.",
    approach: [
      "Compute prefix sums array.",
      "Merge sort on prefix sums: during merge, for each right-half element count how many left-half elements fall in the required range.",
      "Use two pointers (lo, hi) on the left half that advance monotonically.",
    ],
    solution: `function countRangeSum(nums, lower, upper) {
  const prefix = [0];
  for (const n of nums) prefix.push(prefix[prefix.length - 1] + n);
  let count = 0;
  function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = arr.length >> 1;
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    let lo = 0, hi = 0;
    for (const r of right) {
      while (lo < left.length && left[lo] < r - upper) lo++;
      while (hi < left.length && left[hi] <= r - lower) hi++;
      count += hi - lo;
    }
    // standard merge
    let i = 0, j = 0;
    const merged = [];
    while (i < left.length && j < right.length)
      merged.push(left[i] <= right[j] ? left[i++] : right[j++]);
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);
    return merged;
  }
  mergeSort(prefix);
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Counting range sums corresponds to time-series anomaly detection: how many rolling windows have an aggregate (sum, average) within an acceptable range? Systems like Prometheus and Grafana answer these range-bound aggregation questions over time-series data, using sorted prefix structures and binary search for efficient window counting.",
    pitfalls: ["The lo and hi pointers only advance forward across iterations of the outer loop — this is the key insight for O(n log n).", "Prefix array has n+1 elements; include prefix[0] = 0 to handle subarrays starting at index 0."],
  },
  // ---- HARD (15 problems) ----
  {
    id: "bst-36",
    title: "Serialize and Deserialize BST",
    difficulty: "Hard",
    tags: ["BST", "Tree", "Design", "Preorder"],
    statement: "Design an algorithm to serialize and deserialize a BST. Serialize converts the BST to a string; deserialize restores the BST from the string. The encoded string should be as compact as possible.",
    examples: [
      { input: "root = [2,1,3]", output: "Serialized and deserialized correctly to [2,1,3]." },
    ],
    intuition: "For a BST, preorder traversal encodes the structure compactly because the BST property allows reconstruction without storing null markers — we know which values go left and right based on their magnitude relative to the current root.",
    approach: [
      "Serialize: preorder traversal, join values with a delimiter.",
      "Deserialize: use a queue of values and a helper build(min, max) that consumes the next value only if it falls within (min, max).",
    ],
    solution: `function serialize(root) {
  const vals = [];
  function preorder(node) {
    if (!node) return;
    vals.push(node.val);
    preorder(node.left);
    preorder(node.right);
  }
  preorder(root);
  return vals.join(",");
}
function deserialize(data) {
  if (!data) return null;
  const nums = data.split(",").map(Number);
  let i = 0;
  function build(min, max) {
    if (i >= nums.length || nums[i] < min || nums[i] > max) return null;
    const node = { val: nums[i++], left: null, right: null };
    node.left = build(min, node.val);
    node.right = build(node.val, max);
    return node;
  }
  return build(-Infinity, Infinity);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "BST serialisation mirrors how databases persist index structures to disk (e.g. page files in InnoDB or B-tree snapshots in LevelDB): preorder ensures the root is written first so the file can be read sequentially to reconstruct the tree top-down, avoiding random reads during recovery.",
    pitfalls: ["BST serialisation omits null markers by using value range bounds — this is more compact than general binary tree serialisation.", "The deserialise index i must be shared across recursive calls (use closure)."],
  },
  {
    id: "bst-37",
    title: "Closest Binary Search Tree Value II",
    difficulty: "Hard",
    tags: ["BST", "Tree", "Two Pointers", "Inorder", "Deque"],
    statement: "Given the root of a BST, a target float, and an integer k, return the k values in the BST closest to the target. The answer may be returned in any order.",
    examples: [
      { input: "root = [4,2,5,1,3], target = 3.714286, k = 2", output: "[4,3]" },
      { input: "root = [1], target = 0.000000, k = 1", output: "[1]" },
    ],
    intuition: "Inorder traversal gives sorted values. Maintain a deque of at most k elements: add new values from the right; when the deque is full, compare whether the leftmost element or the next new element is closer to target and evict the farther one.",
    approach: [
      "Inorder traversal building a sliding window deque of size k.",
      "For each new value: if deque.length < k, push back.",
      "Else if abs(new - target) < abs(front - target), pop front and push back.",
      "Else stop early (remaining values only get farther).",
    ],
    solution: `function closestKValues(root, target, k) {
  const deque = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    if (deque.length < k) {
      deque.push(node.val);
    } else if (Math.abs(node.val - target) < Math.abs(deque[0] - target)) {
      deque.shift();
      deque.push(node.val);
    } else {
      return; // farther away, stop
    }
    inorder(node.right);
  }
  inorder(root);
  return deque;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "K-nearest-value queries are fundamental to recommendation systems and anomaly detection: find the k items closest to a user's preference score. In sorted index structures, this maps to a bidirectional scan from the closest entry, expanding left and right alternately — an approach used in KNN queries on spatial and time-series indexes.",
    pitfalls: ["The early return optimisation is valid only for inorder traversal because values are encountered in sorted order.", "Deque.shift() is O(n) in JavaScript — for production use a proper deque data structure."],
  },
  {
    id: "bst-38",
    title: "Count of Smaller Numbers After Self",
    difficulty: "Hard",
    tags: ["BST", "Sorting", "Merge Sort", "Binary Indexed Tree"],
    statement: "Given an integer array nums, return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i].",
    examples: [
      { input: "nums = [5,2,6,1]", output: "[2,1,1,0]" },
      { input: "nums = [-1,-1]", output: "[0,0]" },
    ],
    intuition: "Build a BST by inserting elements from right to left. When inserting a value, count how many existing nodes are smaller — that is the count for the current element.",
    approach: [
      "Insert elements right to left into a BST.",
      "Each node tracks the size of its left subtree (leftCount).",
      "During insertion of val, accumulate count: when going right, add leftCount + 1.",
      "Return counts array.",
    ],
    solution: `function countSmaller(nums) {
  const result = new Array(nums.length).fill(0);
  let root = null;
  function insert(node, val, count) {
    if (!node) return { val, left: null, right: null, leftSize: 0, count };
    if (val <= node.val) {
      node.leftSize++;
      node.left = insert(node.left, val, count);
    } else {
      result[count] += node.leftSize + 1;
      node.right = insert(node.right, val, count);
    }
    return node;
  }
  for (let i = nums.length - 1; i >= 0; i--) {
    root = insert(root, nums[i], i);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n log n) avg, O(n²) worst", space: "O(n)" },
    systemDesign: "Inversion counting using an augmented BST is the basis of rank queries in real-time leaderboards: 'how many users scored less than me?' — maintained with a balanced BST augmented with subtree sizes (order-statistics tree). Production systems use a Fenwick tree or segment tree for guaranteed O(log n) per update and query.",
    pitfalls: ["An unbalanced BST degrades to O(n²) — use a balanced BST or Fenwick tree for guaranteed O(n log n).", "Store the original index in the BST node to update the correct result slot."],
  },
  {
    id: "bst-39",
    title: "Maximum Sum BST in Binary Tree",
    difficulty: "Hard",
    tags: ["BST", "Tree", "DFS", "Post-order"],
    statement: "Given a binary tree root, return the maximum sum of all keys of any sub-tree which is also a BST. If no such subtree exists, return 0.",
    examples: [
      { input: "root = [1,4,3,2,4,2,5,null,null,null,null,null,null,4,6]", output: "20", explanation: "Subtree rooted at 3 with nodes 3,2,5,4,6 sums to 20." },
      { input: "root = [4,3,null,1,2]", output: "2" },
    ],
    intuition: "Post-order DFS returns whether each subtree is a valid BST along with its min, max, and sum. If both children are valid BSTs and the current node fits, compute the total sum and update the global maximum.",
    approach: [
      "Post-order DFS returning (isBST, minVal, maxVal, sum) for each subtree.",
      "A subtree is a BST if both children are BSTs and root.val > left.max and root.val < right.min.",
      "If BST, total sum = left.sum + right.sum + root.val; update global max.",
      "Return maxSum at the end.",
    ],
    solution: `function maxSumBST(root) {
  let maxSum = 0;
  function dfs(node) {
    if (!node) return { isBST: true, min: Infinity, max: -Infinity, sum: 0 };
    const l = dfs(node.left);
    const r = dfs(node.right);
    if (l.isBST && r.isBST && node.val > l.max && node.val < r.min) {
      const sum = l.sum + r.sum + node.val;
      maxSum = Math.max(maxSum, sum);
      return { isBST: true, min: Math.min(l.min, node.val), max: Math.max(r.max, node.val), sum };
    }
    return { isBST: false, min: 0, max: 0, sum: 0 };
  }
  dfs(root);
  return maxSum;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Finding the largest valid-constraint subtree with maximum weight mirrors distributed transaction scope selection: identify the largest subtree of operations that can all commit together without violating constraints, maximising the batch throughput — analogous to finding the largest commit-safe subtransaction in a hierarchical transaction log.",
    pitfalls: ["Track four pieces of information per subtree: isBST, min, max, sum — do not skip any.", "The maxSum should be initialised to 0 because a single-node subtree with a positive value is the minimum valid answer, but the problem allows returning 0 if no valid BST subtree exists."],
  },
  {
    id: "bst-40",
    title: "Range Sum Query - Mutable",
    difficulty: "Hard",
    tags: ["BST", "Binary Indexed Tree", "Segment Tree", "Design"],
    statement: "Implement the NumArray class that supports two operations on an integer array: update(index, val) updates the element at index, and sumRange(left, right) returns the sum of elements between indices left and right (inclusive).",
    examples: [
      { input: "NumArray([1,3,5]); sumRange(0,2)=9; update(1,2); sumRange(0,2)=8", output: "9,8" },
    ],
    intuition: "A Fenwick tree (Binary Indexed Tree) stores partial sums indexed by the lowest set bit of the index. Point updates and prefix-sum queries both take O(log n) by traversing parent and child relationships in the implicit tree.",
    approach: [
      "Build a Fenwick tree from the initial array.",
      "update: adjust the delta and propagate it up the Fenwick tree.",
      "sumRange: compute prefix sums using the Fenwick tree and subtract.",
    ],
    solution: `class NumArray {
  constructor(nums) {
    this.n = nums.length;
    this.nums = nums.slice();
    this.bit = new Array(this.n + 1).fill(0);
    for (let i = 0; i < this.n; i++) this._add(i + 1, nums[i]);
  }
  _add(i, delta) {
    for (; i <= this.n; i += i & (-i)) this.bit[i] += delta;
  }
  _sum(i) {
    let s = 0;
    for (; i > 0; i -= i & (-i)) s += this.bit[i];
    return s;
  }
  update(index, val) {
    this._add(index + 1, val - this.nums[index]);
    this.nums[index] = val;
  }
  sumRange(left, right) {
    return this._sum(right + 1) - this._sum(left);
  }
}`,
    language: "javascript",
    complexity: { time: "O(log n) per update and query", space: "O(n)" },
    systemDesign: "The Fenwick tree (BIT) is widely used in databases and analytics engines to maintain cumulative frequency tables for mutable data. It powers OLAP rollup aggregations in columnar databases where row inserts must update cumulative sums, and is used in competitive ranking systems to efficiently compute cumulative rank distributions after score updates.",
    pitfalls: ["The BIT uses 1-based indexing — adjust all index inputs by +1.", "Store the original array separately to compute the delta on update."],
  },
  {
    id: "bst-41",
    title: "Count of Smaller Numbers After Self (Fenwick Tree)",
    difficulty: "Hard",
    tags: ["BST", "Binary Indexed Tree", "Coordinate Compression"],
    statement: "Given an integer array nums, return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i]. Solve using a Binary Indexed Tree with coordinate compression.",
    examples: [
      { input: "nums = [5,2,6,1]", output: "[2,1,1,0]" },
      { input: "nums = [-1,-1]", output: "[0,0]" },
    ],
    intuition: "Coordinate-compress the values so they fit in a small range, then use a Fenwick tree to answer 'how many inserted values are less than x' in O(log n) as we process elements right to left.",
    approach: [
      "Coordinate compress: sort unique values, map each num to its rank (1-indexed).",
      "Process from right to left: query the BIT for prefix sum up to rank-1 (count of smaller).",
      "Update the BIT at the current rank by 1.",
      "Return the counts array.",
    ],
    solution: `function countSmallerFenwick(nums) {
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const rank = new Map(sorted.map((v, i) => [v, i + 1]));
  const n = nums.length, m = sorted.length;
  const bit = new Array(m + 1).fill(0);
  const result = new Array(n);
  function update(i) { for (; i <= m; i += i & (-i)) bit[i]++; }
  function query(i) { let s = 0; for (; i > 0; i -= i & (-i)) s += bit[i]; return s; }
  for (let i = n - 1; i >= 0; i--) {
    const r = rank.get(nums[i]);
    result[i] = query(r - 1);
    update(r);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Coordinate compression with a Fenwick tree is the production-grade approach for rank queries over mutable sorted sets, used in real-time leaderboards (e.g. gaming platforms) and in columnar analytics engines for computing rank() and percent_rank() window functions incrementally as new rows arrive.",
    pitfalls: ["Coordinate compression is necessary because nums values can be large and negative.", "Process from right to left so each query reflects only elements already seen (to the right)."],
  },
  {
    id: "bst-42",
    title: "Number of Ways to Reorder Array to Get Same BST",
    difficulty: "Hard",
    tags: ["BST", "Divide and Conquer", "Combinatorics", "Dynamic Programming"],
    statement: "Given an array nums that represents a permutation of integers from 1 to n, return the number of different ways to reorder nums such that the BST formed is identical to the BST formed by the original nums. Return the answer modulo 10^9 + 7.",
    examples: [
      { input: "nums = [2,1,3]", output: "1" },
      { input: "nums = [3,4,5,1,2]", output: "5" },
      { input: "nums = [1,2,3]", output: "0" },
    ],
    intuition: "The root is always nums[0]. Left subtree elements and right subtree elements must maintain their relative order from the original permutation. Count the ways to interleave left and right sequences: C(left.length + right.length, left.length) multiplied by the recursive counts for each subtree.",
    approach: [
      "Split nums into left (< nums[0]) and right (> nums[0]) subsequences.",
      "Recursively count ways for left and right subtrees.",
      "Multiply by C(left.length + right.length, left.length) for the interleaving.",
      "Subtract 1 (original ordering itself) at the top level.",
    ],
    solution: `function numOfWays(nums) {
  const MOD = 1_000_000_007n;
  function comb(n, k) {
    if (k > n) return 0n;
    let res = 1n;
    for (let i = 0; i < k; i++) {
      res = res * BigInt(n - i) / BigInt(i + 1);
    }
    return res % MOD;
  }
  function count(arr) {
    if (arr.length <= 1) return 1n;
    const root = arr[0];
    const left = arr.filter(x => x < root);
    const right = arr.filter(x => x > root);
    return comb(left.length + right.length, left.length) * count(left) % MOD * count(right) % MOD;
  }
  return Number((count(nums) - 1n + MOD) % MOD);
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n)" },
    systemDesign: "Counting valid orderings of a data structure construction is used in distributed system testing: how many arrival orders of events at a node produce the same final state? This combinatorial approach underlies concurrency analysis tools that verify linearisability of distributed data structures by counting equivalent execution histories.",
    pitfalls: ["Use BigInt for modular arithmetic to avoid precision loss with large factorials.", "Return count(nums) - 1 (subtract the original ordering itself) at the top call."],
  },
  {
    id: "bst-43",
    title: "Kth Largest Element in a Stream (BST approach)",
    difficulty: "Hard",
    tags: ["BST", "Design", "Heap"],
    statement: "Design a class to find the kth largest element in a stream. Implement KthLargest(k, nums) to initialise with k and the initial elements, and add(val) to add a new element and return the kth largest.",
    examples: [
      { input: "KthLargest(3,[4,5,8,2]); add(3)=4; add(5)=5; add(10)=5; add(9)=8; add(4)=8", output: "4,5,5,8,8" },
    ],
    intuition: "Maintain a min-heap of size k. The kth largest is always the heap's minimum. When adding a new element larger than the minimum, replace the minimum. The heap never grows beyond k elements.",
    approach: [
      "Initialise a min-heap of size k from nums.",
      "add(val): if heap.size < k or val > heap.min, push val and pop the minimum.",
      "Return heap.min.",
    ],
    solution: `class KthLargest {
  constructor(k, nums) {
    this.k = k;
    // Use sorted array as a simple min-heap substitute
    this.heap = [];
    for (const n of nums) this.add(n);
  }
  add(val) {
    this.heap.push(val);
    this.heap.sort((a, b) => a - b);
    if (this.heap.length > this.k) this.heap.shift();
    return this.heap[0];
  }
}`,
    language: "javascript",
    complexity: { time: "O(n log k) init, O(k) per add (sort)", space: "O(k)" },
    systemDesign: "Streaming top-k maintenance is used in real-time monitoring dashboards (e.g. top-k slowest API endpoints, top-k busiest users) where new data arrives continuously and you always want the current k-th largest without reprocessing all data. Production implementations use a proper min-heap or a sorted set for O(log k) per add.",
    pitfalls: ["The sort-based implementation is O(k log k) per add — use a real min-heap for O(log k).", "After popping the minimum, the new minimum is the kth largest among all elements seen."],
  },
  {
    id: "bst-44",
    title: "Predecessor and Successor in BST",
    difficulty: "Hard",
    tags: ["BST", "Tree", "Inorder"],
    statement: "Given the root of a BST and a key, find the inorder predecessor and successor of the key. If either does not exist, return null for that value. A predecessor is the largest node smaller than key; a successor is the smallest node greater than key.",
    examples: [
      { input: "root = [5,3,7,2,4,6,8], key = 5", output: "predecessor=4, successor=6" },
      { input: "root = [5,3,7,2,4,6,8], key = 1", output: "predecessor=null, successor=2" },
    ],
    intuition: "For the successor: navigate right whenever current node is too small (updating successor candidate). For the predecessor: navigate left whenever current node is too large (updating predecessor candidate). Both complete in O(h).",
    approach: [
      "Two separate traversals or a combined traversal.",
      "For successor: start at root; if root.val > key, candidate = root, go left; else go right.",
      "For predecessor: start at root; if root.val < key, candidate = root, go right; else go left.",
    ],
    solution: `function findPredecessorSuccessor(root, key) {
  let predecessor = null, successor = null;
  let cur = root;
  while (cur) {
    if (cur.val === key) {
      if (cur.left) {
        let node = cur.left;
        while (node.right) node = node.right;
        predecessor = node;
      }
      if (cur.right) {
        let node = cur.right;
        while (node.left) node = node.left;
        successor = node;
      }
      break;
    } else if (cur.val < key) {
      predecessor = cur;
      cur = cur.right;
    } else {
      successor = cur;
      cur = cur.left;
    }
  }
  return { predecessor, successor };
}`,
    language: "javascript",
    complexity: { time: "O(h)", space: "O(1)" },
    systemDesign: "Finding predecessor and successor keys is the core of B+ tree bidirectional cursor movement used in database range scans. NEXT KEY locking in InnoDB locks both the current key and its successor to prevent phantom inserts, making predecessor/successor lookups a hot path in concurrent transaction processing.",
    pitfalls: ["When the key is found, the predecessor is the rightmost node of the left subtree and the successor is the leftmost of the right subtree.", "When the key is not found, track candidates along the traversal path as shown in the search loops."],
  },
  {
    id: "bst-45",
    title: "Merge Two BSTs into a Sorted List",
    difficulty: "Hard",
    tags: ["BST", "Tree", "Inorder", "Two Pointers", "Iterator"],
    statement: "Given the roots of two BSTs, return a sorted list of all elements from both trees merged together. Solve using O(h1 + h2) space without constructing intermediate arrays.",
    examples: [
      { input: "root1 = [2,1,4], root2 = [1,0,3]", output: "[0,1,1,2,3,4]" },
    ],
    intuition: "Use two iterative inorder iterators (one per BST) simultaneously, each backed by a stack. At each step, advance the iterator with the smaller current value — exactly like merging two sorted linked lists.",
    approach: [
      "Create two BST iterators using stacks (push leftmost path).",
      "While both iterators have values, pick the smaller one, add to result, advance that iterator.",
      "Drain the remaining iterator.",
    ],
    solution: `function mergeTwoBSTs(root1, root2) {
  function makeIter(root) {
    const stack = [];
    let cur = root;
    return {
      peek() {
        while (cur) { stack.push(cur); cur = cur.left; }
        return stack.length ? stack[stack.length - 1].val : null;
      },
      next() {
        while (cur) { stack.push(cur); cur = cur.left; }
        const node = stack.pop();
        cur = node.right;
        return node.val;
      },
      hasNext() {
        while (cur) { stack.push(cur); cur = cur.left; }
        return stack.length > 0;
      }
    };
  }
  const it1 = makeIter(root1), it2 = makeIter(root2);
  const result = [];
  while (it1.hasNext() && it2.hasNext()) {
    if (it1.peek() <= it2.peek()) result.push(it1.next());
    else result.push(it2.next());
  }
  while (it1.hasNext()) result.push(it1.next());
  while (it2.hasNext()) result.push(it2.next());
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(m + n)", space: "O(h1 + h2)" },
    systemDesign: "Streaming merge of two sorted index scans is the foundation of the merge-join algorithm in relational databases: two index cursors advance in tandem, producing a merged sorted output without materialising either full index. This is how PostgreSQL executes a merge join on two indexed columns with O(n+m) I/O.",
    pitfalls: ["Each iterator's stack grows at most to O(h) depth — the space bound is O(h1 + h2), not O(n + m).", "The peek() and next() operations share the same stack state — be careful not to duplicate the leftmost-push logic."],
  },
  {
    id: "bst-46",
    title: "BST to Min-Heap",
    difficulty: "Hard",
    tags: ["BST", "Tree", "Inorder", "DFS"],
    statement: "Given a BST, convert it into a min-heap in-place. The resulting binary tree must satisfy the min-heap property (parent <= both children) and the same structure as the BST.",
    examples: [
      { input: "root = [4,2,6,1,3,5,7]", output: "Min-heap: [1,2,5,3,4,6,7] (parent <= children at every node)." },
    ],
    intuition: "Perform an inorder traversal of the BST to collect sorted values, then re-assign values to nodes in a preorder traversal — preorder assigns the root first, so the smallest value goes to the root, satisfying the heap property.",
    approach: [
      "Inorder traversal collects all values in sorted (ascending) order.",
      "Preorder traversal re-assigns values from the sorted list in order.",
      "Since preorder visits parent before children, every parent gets a smaller value than its children.",
    ],
    solution: `function bstToMinHeap(root) {
  const vals = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  let i = 0;
  function preorder(node) {
    if (!node) return;
    node.val = vals[i++];
    preorder(node.left);
    preorder(node.right);
  }
  preorder(root);
  return root;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "In-place tree re-labelling with a sorted sequence mirrors how database index reorganisation assigns new page numbers to an existing B-tree structure during a rebuild: the structure (pointers) is preserved but values (page content pointers) are reassigned from a pre-sorted list for optimal key distribution.",
    pitfalls: ["The preorder assignment works because it processes parent before children — the first (smallest) value always goes to the root.", "Inorder gives sorted ascending order; preorder fills parent-first which is the min-heap order."],
  },
  {
    id: "bst-47",
    title: "Floor and Ceil in BST",
    difficulty: "Hard",
    tags: ["BST", "Tree", "Binary Search"],
    statement: "Given the root of a BST and an integer key, return the floor (greatest value <= key) and ceiling (smallest value >= key) of the key in the BST.",
    examples: [
      { input: "root = [8,4,12,2,6,10,14], key = 11", output: "floor=10, ceil=12" },
      { input: "root = [8,4,12,2,6,10,14], key = 8", output: "floor=8, ceil=8" },
    ],
    intuition: "Navigate the BST: when current value equals key it is both floor and ceil. When current value is less than key, it is a floor candidate — go right for better. When greater, it is a ceil candidate — go left for better.",
    approach: [
      "Initialize floor = null, ceil = null.",
      "Traverse from root: if node.val == key, floor = ceil = node.val, return.",
      "If node.val < key, floor = node.val, go right.",
      "If node.val > key, ceil = node.val, go left.",
    ],
    solution: `function floorCeilBST(root, key) {
  let floor = null, ceil = null;
  let cur = root;
  while (cur) {
    if (cur.val === key) { floor = key; ceil = key; break; }
    if (cur.val < key) { floor = cur.val; cur = cur.right; }
    else { ceil = cur.val; cur = cur.left; }
  }
  return { floor, ceil };
}`,
    language: "javascript",
    complexity: { time: "O(h)", space: "O(1)" },
    systemDesign: "Floor and ceiling lookups on a sorted index implement the BETWEEN, >=, and <= predicates used in range query planning. Database engines call this operation 'seek' on an index: navigate to the first key satisfying the predicate and scan from there — the floor/ceil is the seek target.",
    pitfalls: ["If the exact key is found, both floor and ceil equal the key — no further traversal needed.", "If key is smaller than all nodes, floor is null; if larger than all, ceil is null."],
  },
  {
    id: "bst-48",
    title: "K-th Largest Sum Contiguous Subarray (BST + Sorting)",
    difficulty: "Hard",
    tags: ["BST", "Prefix Sum", "Sorting"],
    statement: "Given an array of integers and an integer k, find the k-th largest contiguous subarray sum.",
    examples: [
      { input: "nums = [3,-1,-2,5], k = 2", output: "6", explanation: "Subarray sums sorted desc: 6,5,4,3,-1,-2,-3. 2nd largest is 6... wait sums: [3]=3,[3,-1]=2,[3,-1,-2]=0,[3,-1,-2,5]=5,[-1]=-1,[-1,-2]=-3,[-1,-2,5]=2,[-2]=-2,[-2,5]=3,[5]=5. Sorted desc: 5,5,3,3,2,2,0,-1,-2,-3. 2nd is 5." },
      { input: "nums = [2,-1,3], k = 1", output: "4" },
    ],
    intuition: "Compute all subarray sums using prefix sums (O(n²) pairs), collect them, sort in descending order, and pick the k-th element. Use a max-heap for efficiency if n is large.",
    approach: [
      "Compute all O(n²) subarray sums using prefix sums.",
      "Collect all sums into an array.",
      "Sort in descending order.",
      "Return the k-th element.",
    ],
    solution: `function kthLargestSubarraySum(nums, k) {
  const sums = [];
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let cur = 0;
    for (let j = i; j < n; j++) {
      cur += nums[j];
      sums.push(cur);
    }
  }
  sums.sort((a, b) => b - a);
  return sums[k - 1];
}`,
    language: "javascript",
    complexity: { time: "O(n² log n)", space: "O(n²)" },
    systemDesign: "Finding the k-th largest aggregate across all subsets of a stream is a fundamental analytics problem: 'which k-th highest revenue window was there in the last year?' Production systems use approximate top-k algorithms (e.g. reservoir sampling or Count-Min Sketch with heap) to avoid materialising all O(n²) window sums.",
    pitfalls: ["A partial sort using a min-heap of size k avoids sorting all O(n²) sums: O(n² log k) time and O(k) space.", "Prefix sums avoid recomputing subarray sums from scratch: prefix[j+1] - prefix[i] gives sum(i..j)."],
  },
  {
    id: "bst-49",
    title: "Kth Smallest in Lexicographic Order",
    difficulty: "Hard",
    tags: ["BST", "Trie", "Prefix Tree"],
    statement: "Given integers n and k, return the k-th lexicographically smallest integer in the range [1, n].",
    examples: [
      { input: "n = 13, k = 2", output: "10", explanation: "Lexicographic order: 1,10,11,12,13,2,3,4,5,6,7,8,9. 2nd is 10." },
      { input: "n = 1, k = 1", output: "1" },
    ],
    intuition: "Think of the numbers 1 to n arranged in a 10-ary trie. Each prefix forms a subtree. Count how many numbers are under a given prefix subtree; if k fits, descend into it; otherwise skip the subtree and advance to the next sibling.",
    approach: [
      "Start at current prefix = 1.",
      "Count how many numbers in [1,n] start with this prefix using a gap-counting loop.",
      "If count <= k, move to next sibling (prefix++) and subtract count from k.",
      "Else descend into prefix (prefix *= 10) and decrement k by 1.",
      "When k == 0, return current prefix.",
    ],
    solution: `function findKthNumber(n, k) {
  function countSteps(cur, next, n) {
    let steps = 0;
    while (cur <= n) {
      steps += Math.min(n + 1, next) - cur;
      cur *= 10;
      next *= 10;
    }
    return steps;
  }
  let cur = 1;
  k--;
  while (k > 0) {
    const steps = countSteps(cur, cur + 1, n);
    if (steps <= k) { k -= steps; cur++; }
    else { k--; cur *= 10; }
  }
  return cur;
}`,
    language: "javascript",
    complexity: { time: "O(log²n)", space: "O(1)" },
    systemDesign: "Trie-based prefix counting corresponds to autocomplete and prefix-range queries in search engines and databases: 'how many keys start with a given prefix?' is answered by counting subtree size in a trie or prefix B-tree. This is used in database LIKE 'prefix%' query cost estimation and in type-ahead suggestion systems.",
    pitfalls: ["The countSteps function must cap at n+1 to avoid counting numbers beyond n.", "k is decremented by 1 at the start because we count the root itself as step 1."],
  },
  {
    id: "bst-50",
    title: "Balanced BST from Sorted Doubly Linked List",
    difficulty: "Hard",
    tags: ["BST", "Tree", "Linked List", "Divide and Conquer"],
    statement: "Given a sorted doubly linked list, convert it into a balanced BST in-place without creating new nodes. Return the root of the BST.",
    examples: [
      { input: "list = 1 <-> 2 <-> 3 <-> 4 <-> 5", output: "BST root=3, left subtree [1,2], right subtree [4,5]" },
      { input: "list = 1 <-> 2", output: "BST root=2, left=1" },
    ],
    intuition: "Count the list length, then recursively build the BST by advancing the list pointer via inorder simulation: build the left subtree first (consuming the left half of the list), then assign the current node as root, then build the right subtree.",
    approach: [
      "Count the total length of the list.",
      "Recursive build(lo, hi): base case lo > hi returns null.",
      "Recurse left on (lo, mid-1) — this advances the list pointer to the middle.",
      "Assign current list node as root, advance list pointer.",
      "Recurse right on (mid+1, hi).",
    ],
    solution: `function sortedListToBST(head) {
  let cur = head;
  function countLen(node) {
    let len = 0;
    while (node) { len++; node = node.next; }
    return len;
  }
  const n = countLen(head);
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    const left = build(lo, mid - 1);
    const node = { val: cur.val, left, right: null };
    cur = cur.next;
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, n - 1);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(log n)" },
    systemDesign: "Converting a sorted linked list to a balanced BST mirrors the operation performed by database engines when converting a sorted external-sort output (a sorted run on disk) into a balanced B-tree index during bulk load: the sorted sequence is consumed in order and assigned to the tree structure bottom-up, guaranteeing balance and O(log n) lookup from the start.",
    pitfalls: ["The list pointer cur must be a shared mutable reference updated across all recursive calls — use a closure.", "The left subtree is built before the root node is assigned, so the list naturally advances to the correct (middle) node when the left recursion completes."],
  },
];
