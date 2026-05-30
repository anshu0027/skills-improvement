import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  // ---- EASY (17 problems) ----
  {
    id: "trees-01",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Recursion"],
    statement: "Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3" },
      { input: "root = [1,null,2]", output: "2" },
    ],
    intuition: "Think of a family tree. The depth is how many generations there are. For each person, their subtree depth is 1 plus the deeper of their left or right branch.",
    approach: [
      "Base case: if node is null, return 0.",
      "Recursively compute the depth of the left subtree.",
      "Recursively compute the depth of the right subtree.",
      "Return 1 + Math.max(leftDepth, rightDepth).",
    ],
    solution: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Tree depth is used in database B-tree index planning — a shallower tree means fewer disk reads per lookup. File systems like ext4 compute directory depth to enforce path-length limits, and DOM rendering engines measure tree depth to detect overly nested HTML that degrades reflow performance.",
    pitfalls: ["An empty tree has depth 0, not 1.", "Stack depth equals tree height — deeply unbalanced trees can cause a call-stack overflow in production; use iterative BFS for large inputs."],
  },
  {
    id: "trees-02",
    title: "Same Tree",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Recursion"],
    statement: "Given the roots of two binary trees p and q, write a function to check if they are the same. Two binary trees are considered the same if they are structurally identical and the nodes have the same value.",
    examples: [
      { input: "p = [1,2,3], q = [1,2,3]", output: "true" },
      { input: "p = [1,2], q = [1,null,2]", output: "false" },
      { input: "p = [1,2,1], q = [1,1,2]", output: "false" },
    ],
    intuition: "Two folders are the same if they have the same name and their subfolders are recursively identical. Check the current nodes, then check left subtrees, then right subtrees.",
    approach: [
      "If both nodes are null, return true.",
      "If exactly one is null or values differ, return false.",
      "Recursively check isSameTree(p.left, q.left) && isSameTree(p.right, q.right).",
    ],
    solution: `function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Structural tree comparison is the core of schema diffing tools (comparing two versions of a JSON/XML schema or a database DDL) and of React's virtual DOM reconciliation, which compares old and new component trees node by node to compute the minimal set of DOM mutations.",
    pitfalls: ["Check both nulls before accessing .val to avoid a null-pointer error.", "The order of checks matters — handle the null cases first."],
  },
  {
    id: "trees-03",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Recursion"],
    statement: "Given the root of a binary tree, invert the tree (mirror it), and return its root.",
    examples: [
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
      { input: "root = [2,1,3]", output: "[2,3,1]" },
    ],
    intuition: "Imagine reflecting a family tree in a mirror. Swap every person's left and right children, then recurse into each child and do the same thing.",
    approach: [
      "Base case: if node is null, return null.",
      "Swap node.left and node.right.",
      "Recursively invert node.left and node.right.",
      "Return node.",
    ],
    solution: `function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [root.right, root.left];
  invertTree(root.left);
  invertTree(root.right);
  return root;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Mirror-image tree operations appear in UI frameworks when flipping layouts for right-to-left (RTL) language support — the entire component tree is structurally mirrored. Database query plan transformers also invert join trees to explore alternative execution orders during query optimisation.",
    pitfalls: ["Swap before recursing — either order works, but be consistent.", "The root is returned unchanged structurally; only children are swapped."],
  },
  {
    id: "trees-04",
    title: "Symmetric Tree",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Recursion"],
    statement: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
    examples: [
      { input: "root = [1,2,2,3,4,4,3]", output: "true" },
      { input: "root = [1,2,2,null,3,null,3]", output: "false" },
    ],
    intuition: "Think of holding a mirror in the middle of the tree. The left branch and right branch should look identical in the mirror. Compare left.left with right.right and left.right with right.left.",
    approach: [
      "Define a helper isMirror(left, right).",
      "Base: both null -> true; one null or values differ -> false.",
      "Recurse: isMirror(left.left, right.right) && isMirror(left.right, right.left).",
      "Call isMirror(root.left, root.right).",
    ],
    solution: `function isSymmetric(root) {
  function isMirror(l, r) {
    if (!l && !r) return true;
    if (!l || !r || l.val !== r.val) return false;
    return isMirror(l.left, r.right) && isMirror(l.right, r.left);
  }
  return isMirror(root.left, root.right);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Symmetry checks on tree structures are used in hardware design verification (checking that a circuit layout is symmetric) and in XML/JSON schema validation where bidirectional constraints must hold. UI testing frameworks compare left-right widget trees for layout consistency.",
    pitfalls: ["The comparison is cross-wise (left.left vs right.right), not same-side.", "A single-node tree is symmetric by definition."],
  },
  {
    id: "trees-05",
    title: "Path Sum",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Recursion"],
    statement: "Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.",
    examples: [
      { input: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22", output: "true" },
      { input: "root = [1,2,3], targetSum = 5", output: "false" },
    ],
    intuition: "Walk down the tree like following a road. Subtract the current value from the target. When you reach a leaf, check if the remaining target is exactly zero.",
    approach: [
      "Base case: if null, return false.",
      "Subtract node.val from targetSum.",
      "If leaf node and targetSum == 0, return true.",
      "Recurse: hasPathSum(node.left, targetSum) || hasPathSum(node.right, targetSum).",
    ],
    solution: `function hasPathSum(root, targetSum) {
  if (!root) return false;
  targetSum -= root.val;
  if (!root.left && !root.right) return targetSum === 0;
  return hasPathSum(root.left, targetSum) || hasPathSum(root.right, targetSum);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Root-to-leaf path evaluation models policy rule engines where each tree node is a condition and leaf nodes are decisions (like AWS IAM policy trees). Decision tree inference at the core of ML frameworks (scikit-learn, XGBoost) also walks a path from root to leaf to predict a class.",
    pitfalls: ["Check for a leaf node (both children null) before returning — otherwise an internal node with matching remainder would incorrectly return true.", "An empty tree should return false even if targetSum is 0."],
  },
  {
    id: "trees-06",
    title: "Minimum Depth of Binary Tree",
    difficulty: "Easy",
    tags: ["Binary Tree", "BFS", "DFS"],
    statement: "Given a binary tree, find its minimum depth. The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "2" },
      { input: "root = [2,null,3,null,4,null,5,null,6]", output: "5" },
    ],
    intuition: "BFS (level-by-level search) finds the shallowest leaf first. The moment you reach a node with no children, that is the minimum depth — no need to explore further.",
    approach: [
      "Use a queue initialised with [root, 1].",
      "Process nodes level by level.",
      "If a node has no left or right child, return its depth.",
      "Otherwise, enqueue its children with depth+1.",
    ],
    solution: `function minDepth(root) {
  if (!root) return 0;
  const queue = [[root, 1]];
  while (queue.length) {
    const [node, depth] = queue.shift();
    if (!node.left && !node.right) return depth;
    if (node.left) queue.push([node.left, depth + 1]);
    if (node.right) queue.push([node.right, depth + 1]);
  }
  return 0;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "BFS for minimum depth mirrors shortest-path search in microservice dependency graphs — you find the shortest chain of service calls to reach a result. Kubernetes pod scheduling uses BFS over node topology to find the nearest available node that satisfies resource constraints.",
    pitfalls: ["DFS minimum depth is tricky: if a node has only one child, you must not count the missing child's path as depth 1 — recurse only into the existing child.", "BFS is safer and returns the correct answer as soon as it finds the first leaf."],
  },
  {
    id: "trees-07",
    title: "Balanced Binary Tree",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Recursion"],
    statement: "Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is one in which the left and right subtrees of every node differ in height by no more than one.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "true" },
      { input: "root = [1,2,2,3,3,null,null,4,4]", output: "false" },
    ],
    intuition: "For each node, ask: how tall are my two subtrees? If they differ by more than 1, the tree is unbalanced. Pass the height back up and use -1 as a sentinel to signal 'already unbalanced'.",
    approach: [
      "Define a helper getHeight(node) that returns -1 if unbalanced, or the actual height.",
      "Base: return 0 for null.",
      "Compute leftH and rightH; if either is -1, propagate -1.",
      "If Math.abs(leftH - rightH) > 1, return -1; else return 1 + max(leftH, rightH).",
    ],
    solution: `function isBalanced(root) {
  function getHeight(node) {
    if (!node) return 0;
    const l = getHeight(node.left);
    if (l === -1) return -1;
    const r = getHeight(node.right);
    if (r === -1) return -1;
    if (Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  }
  return getHeight(root) !== -1;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Balance invariants are the foundation of AVL trees and Red-Black trees used inside every major database and language runtime (Java's TreeMap, C++ std::map) to guarantee O(log n) lookup. Maintaining balance during inserts and deletes prevents worst-case O(n) degradation to a linked list.",
    pitfalls: ["A naive O(n²) approach recomputes height from scratch at each node — the sentinel trick makes it O(n).", "Return the height, not just true/false, so you avoid re-traversal."],
  },
  {
    id: "trees-08",
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Recursion"],
    statement: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes. The path may or may not pass through the root.",
    examples: [
      { input: "root = [1,2,3,4,5]", output: "3", explanation: "The path [4,2,1,3] or [5,2,1,3] has length 3." },
      { input: "root = [1,2]", output: "1" },
    ],
    intuition: "At every node, the longest path through it equals the height of the left subtree plus the height of the right subtree. Compute heights while tracking the best diameter seen so far.",
    approach: [
      "Maintain a variable maxDiameter = 0.",
      "Define depth(node): returns height, and updates maxDiameter with leftDepth + rightDepth.",
      "Call depth(root) and return maxDiameter.",
    ],
    solution: `function diameterOfBinaryTree(root) {
  let maxDiameter = 0;
  function depth(node) {
    if (!node) return 0;
    const l = depth(node.left);
    const r = depth(node.right);
    maxDiameter = Math.max(maxDiameter, l + r);
    return 1 + Math.max(l, r);
  }
  depth(root);
  return maxDiameter;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Diameter calculation is used in network topology analysis to find the longest shortest path (eccentricity/diameter of a network graph), which helps identify bottleneck links. CDN providers use graph diameter metrics to plan backbone capacity and ensure that any two edge servers are within a bounded hop count.",
    pitfalls: ["The longest path does not have to pass through the root — update maxDiameter at every node.", "The diameter is measured in edges (not nodes), so it is leftDepth + rightDepth, not +1."],
  },
  {
    id: "trees-09",
    title: "Merge Two Binary Trees",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Recursion"],
    statement: "You are given two binary trees root1 and root2. Merge them by overlapping the nodes. If two nodes overlap, sum their values. Otherwise, use the non-null node. Return the merged tree.",
    examples: [
      { input: "root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]", output: "[3,4,5,5,4,null,7]" },
      { input: "root1 = [1], root2 = [1,2]", output: "[2,2]" },
    ],
    intuition: "Walk both trees at the same time. When both nodes exist, add their values. When only one exists, use it as-is. It is like merging two overlapping spreadsheets — sum where both have data.",
    approach: [
      "If both nodes are null, return null.",
      "If one is null, return the other.",
      "Create a new node with value root1.val + root2.val.",
      "Recursively merge left and right children.",
    ],
    solution: `function mergeTrees(root1, root2) {
  if (!root1) return root2;
  if (!root2) return root1;
  root1.val += root2.val;
  root1.left = mergeTrees(root1.left, root2.left);
  root1.right = mergeTrees(root1.right, root2.right);
  return root1;
}`,
    language: "javascript",
    complexity: { time: "O(min(m,n))", space: "O(min(m,n))" },
    systemDesign: "Merging tree-structured data is a core operation in distributed configuration management systems (like Consul or Kubernetes ConfigMaps) where per-node configurations are merged into a hierarchy. JSON merge-patch (RFC 7396) follows the same recursive merge logic to update nested configuration objects.",
    pitfalls: ["Returning the non-null node directly reuses the existing subtree, which is fine when mutation is allowed.", "Only traverse nodes that exist in at least one tree — stop as soon as both are null."],
  },
  {
    id: "trees-10",
    title: "Sum of Left Leaves",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Recursion"],
    statement: "Given the root of a binary tree, return the sum of all left leaves.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "24", explanation: "Left leaves: 9 and 15, sum = 24." },
      { input: "root = [1]", output: "0" },
    ],
    intuition: "Traverse the tree and keep a flag indicating whether the current node is a left child. When you reach a leaf that is a left child, add its value to the total.",
    approach: [
      "Define a helper sumLeft(node, isLeft).",
      "If node is a leaf and isLeft is true, return node.val.",
      "If node is a leaf and isLeft is false, return 0.",
      "Return sumLeft(node.left, true) + sumLeft(node.right, false).",
    ],
    solution: `function sumOfLeftLeaves(root) {
  function sumLeft(node, isLeft) {
    if (!node) return 0;
    if (!node.left && !node.right) return isLeft ? node.val : 0;
    return sumLeft(node.left, true) + sumLeft(node.right, false);
  }
  return sumLeft(root, false);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Selective leaf aggregation models partial-index rollup in data warehouses: only certain leaf partitions contribute to a metric (e.g. summing only left-branch regional sales). Hierarchical financial reporting systems similarly aggregate only specific branches of an account hierarchy.",
    pitfalls: ["The root itself is never a left child — pass isLeft=false for the initial call.", "A node with only one child is not a leaf — both children must be null."],
  },
  {
    id: "trees-11",
    title: "Binary Tree Paths",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Backtracking"],
    statement: "Given the root of a binary tree, return all root-to-leaf paths in any order.",
    examples: [
      { input: "root = [1,2,3,null,5]", output: "[\"1->2->5\",\"1->3\"]" },
      { input: "root = [1]", output: "[\"1\"]" },
    ],
    intuition: "Walk down the tree, keeping a running string of the path so far. Whenever you reach a leaf, record the current path. This is like writing down directions as you explore every road in a city.",
    approach: [
      "Define a DFS helper(node, path, result).",
      "Append node.val to path.",
      "If leaf, push path to result.",
      "Else recurse with path + '->' into left and right children.",
    ],
    solution: `function binaryTreePaths(root) {
  const result = [];
  function dfs(node, path) {
    if (!node) return;
    path += node.val;
    if (!node.left && !node.right) { result.push(path); return; }
    dfs(node.left, path + "->");
    dfs(node.right, path + "->");
  }
  dfs(root, "");
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Root-to-leaf path enumeration is used in decision tree explanation tools (LIME, SHAP) to enumerate all decision rules. File system path listing (ls -R) and URL routing trees (Express.js router) also enumerate all full paths from root to leaf, directly mirroring this algorithm.",
    pitfalls: ["String concatenation in JavaScript is immutable, so no explicit backtracking is needed — each recursive call gets its own copy of the path.", "Only leaf nodes (both children null) should be added to result."],
  },
  {
    id: "trees-12",
    title: "Average of Levels in Binary Tree",
    difficulty: "Easy",
    tags: ["Binary Tree", "BFS"],
    statement: "Given the root of a binary tree, return the average value of the nodes on each level in the form of an array.",
    examples: [
      { input: "root = [3,9,20,15,7]", output: "[3.0,14.5,11.0]" },
      { input: "root = [3,9,20,15,7,null,null]", output: "[3.0,14.5,11.0]" },
    ],
    intuition: "Process the tree floor by floor (level order). For each floor, add up all values and divide by the number of nodes on that floor to get the average.",
    approach: [
      "Use a queue for BFS, starting with the root.",
      "For each level, record the size of the queue, then process exactly that many nodes.",
      "Sum the values, compute average, push to result.",
      "Enqueue non-null children.",
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
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Level-by-level aggregation is used in hierarchical analytics — computing the average metric per department layer in an org chart, or the average response time per network hop. Apache Spark's DAG stage aggregation works similarly, rolling up metrics per execution level.",
    pitfalls: ["Snapshot the queue size at the start of each level loop iteration — do not use queue.length inline, as it grows as you enqueue children.", "Use BigInt or careful floating-point handling for very large trees to avoid precision loss."],
  },
  {
    id: "trees-13",
    title: "Cousins in Binary Tree",
    difficulty: "Easy",
    tags: ["Binary Tree", "BFS", "DFS"],
    statement: "Given the root of a binary tree and two node values x and y, return true if the nodes with values x and y are cousins. Two nodes are cousins if they are at the same depth but have different parents.",
    examples: [
      { input: "root = [1,2,3,4], x = 4, y = 3", output: "false" },
      { input: "root = [1,2,3,null,4,null,5], x = 5, y = 4", output: "true" },
    ],
    intuition: "For each of the two target nodes, find its depth and its parent. If the depths are the same but the parents are different, the nodes are cousins — like finding two cousins in a family tree who share grandparents but not parents.",
    approach: [
      "BFS through the tree, tracking depth and parent for each node.",
      "When x or y is found, record its depth and parent.",
      "After BFS, compare: same depth AND different parents.",
    ],
    solution: `function isCousins(root, x, y) {
  let xDepth = -1, yDepth = -1, xParent = null, yParent = null;
  function dfs(node, parent, depth) {
    if (!node) return;
    if (node.val === x) { xDepth = depth; xParent = parent; }
    if (node.val === y) { yDepth = depth; yParent = parent; }
    dfs(node.left, node, depth + 1);
    dfs(node.right, node, depth + 1);
  }
  dfs(root, null, 0);
  return xDepth === yDepth && xParent !== yParent;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Same-level-different-parent queries model organizational hierarchy checks ('are these two employees peers but in different teams?') and are used in HR systems and multi-tenant permission trees where sibling-level isolation must be enforced.",
    pitfalls: ["Nodes at the same depth but with the same parent are siblings, not cousins — check parent inequality.", "The problem guarantees both values exist, so no need to handle missing nodes."],
  },
  {
    id: "trees-14",
    title: "Range Sum of BST",
    difficulty: "Easy",
    tags: ["Binary Tree", "BST", "DFS"],
    statement: "Given the root node of a binary search tree and two integers low and high, return the sum of values of all nodes with a value in the inclusive range [low, high].",
    examples: [
      { input: "root = [10,5,15,3,7,null,18], low = 7, high = 15", output: "32" },
      { input: "root = [10,5,15,3,7,13,18,1,null,6], low = 6, high = 10", output: "23" },
    ],
    intuition: "In a BST, the left subtree has smaller values and the right has larger values. Prune branches you do not need: if the current node's value is below the range, skip the left subtree; if above, skip the right subtree.",
    approach: [
      "If node is null, return 0.",
      "Initialize sum = 0; if node.val is in [low, high], add it.",
      "If node.val > low, recurse into the left subtree.",
      "If node.val < high, recurse into the right subtree.",
    ],
    solution: `function rangeSumBST(root, low, high) {
  if (!root) return 0;
  let sum = 0;
  if (root.val >= low && root.val <= high) sum += root.val;
  if (root.val > low) sum += rangeSumBST(root.left, low, high);
  if (root.val < high) sum += rangeSumBST(root.right, low, high);
  return sum;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "BST range queries directly model database index range scans. B-tree indexes in PostgreSQL/MySQL use the same pruning strategy to skip subtrees outside a WHERE clause range, reducing I/O from O(n) table scan to O(log n + k) where k is the number of matching rows.",
    pitfalls: ["Do not skip a subtree prematurely — if node.val equals low, still check the left subtree (values equal to low are included).", "BST property enables pruning — this optimisation does not work on a general binary tree."],
  },
  {
    id: "trees-15",
    title: "Subtree of Another Tree",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Recursion"],
    statement: "Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values as subRoot, and false otherwise.",
    examples: [
      { input: "root = [3,4,5,1,2], subRoot = [4,1,2]", output: "true" },
      { input: "root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]", output: "false" },
    ],
    intuition: "Walk through every node in the main tree. At each node, check if the subtree rooted there is identical to subRoot. It is like searching for a specific folder structure anywhere inside a large file system.",
    approach: [
      "If root is null, return false.",
      "If isSameTree(root, subRoot), return true.",
      "Recursively check isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot).",
    ],
    solution: `function isSubtree(root, subRoot) {
  function isSame(a, b) {
    if (!a && !b) return true;
    if (!a || !b || a.val !== b.val) return false;
    return isSame(a.left, b.left) && isSame(a.right, b.right);
  }
  if (!root) return false;
  if (isSame(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(h)" },
    systemDesign: "Subtree matching is used in query optimisers to detect common subexpressions in query plans (common sub-expression elimination) and in XML/JSON databases to find embedded document fragments. Compiler optimization passes use the same pattern to reuse previously computed subtrees.",
    pitfalls: ["The isSameTree check must match the entire subtree exactly, not just the root value.", "For large trees, a string serialisation comparison or KMP matching can reduce worst case to O(m+n)."],
  },
  {
    id: "trees-16",
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Stack"],
    statement: "Given the root of a binary tree, return the inorder traversal of its nodes' values (left, root, right).",
    examples: [
      { input: "root = [1,null,2,3]", output: "[1,3,2]" },
      { input: "root = []", output: "[]" },
      { input: "root = [1]", output: "[1]" },
    ],
    intuition: "Inorder traversal visits the left branch, then the current node, then the right branch — like reading a book left to right. In a BST, this produces values in sorted order.",
    approach: [
      "Use an explicit stack and a current pointer.",
      "Push nodes onto the stack going left as far as possible.",
      "When current is null, pop from stack, record value, move to right child.",
      "Repeat until stack is empty and current is null.",
    ],
    solution: `function inorderTraversal(root) {
  const result = [], stack = [];
  let curr = root;
  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left; }
    curr = stack.pop();
    result.push(curr.val);
    curr = curr.right;
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Inorder traversal of a BST retrieves all keys in sorted order, which is exactly how database index iterators work — a B-tree cursor performs an inorder walk to return rows matching a range query. Iterator protocol in Java (TreeSet.iterator()) and Python (sorted containers) implements the same iterative inorder walk.",
    pitfalls: ["The iterative version avoids call-stack overflow for very deep trees.", "Returning to the right child after popping is the key step — do not forget it."],
  },
  {
    id: "trees-17",
    title: "Binary Tree Preorder Traversal",
    difficulty: "Easy",
    tags: ["Binary Tree", "DFS", "Stack"],
    statement: "Given the root of a binary tree, return the preorder traversal of its nodes' values (root, left, right).",
    examples: [
      { input: "root = [1,null,2,3]", output: "[1,2,3]" },
      { input: "root = []", output: "[]" },
    ],
    intuition: "Visit the current node first, then explore children — like reading the table of contents of a book before the chapters. Push right child before left so the stack processes left first.",
    approach: [
      "Push root onto the stack.",
      "While stack is not empty: pop node, record value.",
      "Push right child first (processed later), then left child (processed next).",
    ],
    solution: `function preorderTraversal(root) {
  if (!root) return [];
  const result = [], stack = [root];
  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Preorder traversal is used to serialize a tree (JSON.stringify traverses the object tree in a preorder-like fashion) and to copy or clone a tree structure. XML/HTML parsers emit opening tags in preorder, which is why SAX parsers fire startElement events before children are processed.",
    pitfalls: ["Push right before left so that the left child is popped and processed first.", "The iterative version using a stack directly mirrors the implicit call stack of the recursive version."],
  },
  // ---- MEDIUM (18 problems) ----
  {
    id: "trees-18",
    title: "Binary Tree Postorder Traversal",
    difficulty: "Medium",
    tags: ["Binary Tree", "DFS", "Stack"],
    statement: "Given the root of a binary tree, return the postorder traversal of its nodes' values (left, right, root).",
    examples: [
      { input: "root = [1,null,2,3]", output: "[3,2,1]" },
      { input: "root = []", output: "[]" },
    ],
    intuition: "Postorder means processing children before the parent — like cleaning up each room before leaving the building. Use a modified preorder (root, right, left) and then reverse the result to get (left, right, root).",
    approach: [
      "Push root onto stack.",
      "Pop node, push to result array; push left then right child onto stack.",
      "After the loop, reverse the result array.",
    ],
    solution: `function postorderTraversal(root) {
  if (!root) return [];
  const result = [], stack = [root];
  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return result.reverse();
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Postorder traversal is used in compilers to evaluate expression trees (operands before operators), in build systems (compile dependencies before dependents), and in garbage collectors to free child nodes before parent nodes, preventing dangling references.",
    pitfalls: ["The trick of reversing a modified preorder result is clean and avoids complex iterative logic.", "An alternative is to insert each node at the front of the result list instead of reversing at the end."],
  },
  {
    id: "trees-19",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    tags: ["Binary Tree", "BFS"],
    statement: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level) as a list of lists.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
      { input: "root = [1]", output: "[[1]]" },
    ],
    intuition: "BFS naturally visits nodes level by level, like exploring floors of a building one at a time. Snapshot the queue size at the start of each level to know exactly which nodes belong to that level.",
    approach: [
      "Initialize queue with root.",
      "For each level: snapshot size, process that many nodes, collect their values, enqueue children.",
      "Push the level's value list to the result.",
    ],
    solution: `function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const size = queue.length, level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Level-order traversal is the basis of hierarchical data export in org-chart systems, JSON tree serialization, and DOM-to-PDF rendering pipelines that process elements in document order. Apache Kafka consumer groups can be modeled as a tree where BFS determines the order of partition assignments.",
    pitfalls: ["Snapshot queue.length before the inner loop — the queue grows as you enqueue children.", "An empty root should return an empty array, not a list containing an empty list."],
  },
  {
    id: "trees-20",
    title: "Binary Tree Zigzag Level Order Traversal",
    difficulty: "Medium",
    tags: ["Binary Tree", "BFS", "Deque"],
    statement: "Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. Odd levels go left to right; even levels go right to left.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]" },
      { input: "root = [1]", output: "[[1]]" },
    ],
    intuition: "Do a standard BFS level order, but alternate the direction of each level. You can collect each level normally and then reverse it on alternating levels.",
    approach: [
      "BFS level by level, tracking level index.",
      "For even levels (0-indexed), add values left to right.",
      "For odd levels, reverse the collected level array before pushing to result.",
    ],
    solution: `function zigzagLevelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  let leftToRight = true;
  while (queue.length) {
    const size = queue.length, level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(leftToRight ? level : level.reverse());
    leftToRight = !leftToRight;
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Zigzag traversal models bidirectional pipeline processing where alternating stages reverse their data flow direction, common in certain signal processing architectures. UI rendering engines that lay out bidi (bidirectional) text use alternating direction logic similar to zigzag tree traversal.",
    pitfalls: ["Reversing the entire level array is simpler than inserting at the front, though both work.", "The direction flag must be toggled after each level, not after each node."],
  },
  {
    id: "trees-21",
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    tags: ["Binary Tree", "BFS", "DFS"],
    statement: "Given the root of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see ordered from top to bottom.",
    examples: [
      { input: "root = [1,2,3,null,5,null,4]", output: "[1,3,4]" },
      { input: "root = [1,null,3]", output: "[1,3]" },
    ],
    intuition: "Do a BFS level by level. The last node you process on each level is the one visible from the right side — like looking at the rightmost column of each row in a photograph.",
    approach: [
      "BFS level by level.",
      "At the end of processing each level, take the last node's value.",
      "Push it to the result array.",
    ],
    solution: `function rightSideView(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      if (i === size - 1) result.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Right-side view is analogous to finding the last-active replica or the highest-priority fallback server at each tier of a distributed system hierarchy. Database query plans display the 'last' node in each plan level in EXPLAIN output to show the dominant operation at each depth.",
    pitfalls: ["A DFS right-first approach also works: track the first node visited at each depth.", "The rightmost visible node is the last in BFS order per level, or the first in a right-first DFS."],
  },
  {
    id: "trees-22",
    title: "Path Sum II",
    difficulty: "Medium",
    tags: ["Binary Tree", "DFS", "Backtracking"],
    statement: "Given the root of a binary tree and an integer targetSum, return all root-to-leaf paths where the sum of the node values in the path equals targetSum.",
    examples: [
      { input: "root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22", output: "[[5,4,11,2],[5,8,4,5]]" },
      { input: "root = [1,2,3], targetSum = 5", output: "[]" },
    ],
    intuition: "Walk every root-to-leaf path carrying a running list of visited values. At each leaf, check if the sum matches. If yes, save a copy of the path. Backtrack when returning from a dead end.",
    approach: [
      "DFS with current path array and remaining sum.",
      "At each node: push value, subtract from remaining.",
      "If leaf and remaining == 0, push a copy of path to result.",
      "Recurse into children, then pop the current value (backtrack).",
    ],
    solution: `function pathSum(root, targetSum) {
  const result = [];
  function dfs(node, remaining, path) {
    if (!node) return;
    path.push(node.val);
    remaining -= node.val;
    if (!node.left && !node.right && remaining === 0) result.push([...path]);
    dfs(node.left, remaining, path);
    dfs(node.right, remaining, path);
    path.pop();
  }
  dfs(root, targetSum, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n)" },
    systemDesign: "All-paths enumeration is used in network fault-analysis tools to list every possible route through a service mesh that satisfies a latency budget. Tracing platforms like Jaeger enumerate all root-to-leaf spans in distributed traces to find complete request paths that exceed SLO thresholds.",
    pitfalls: ["Push a copy of the path ([...path]) to result — a reference would be mutated by subsequent backtracking.", "The backtrack pop must happen whether or not a valid path was found."],
  },
  {
    id: "trees-23",
    title: "Count Good Nodes in Binary Tree",
    difficulty: "Medium",
    tags: ["Binary Tree", "DFS"],
    statement: "Given a binary tree root, a node X in the tree is named good if in the path from root to X there are no nodes with a value greater than X's value. Return the number of good nodes.",
    examples: [
      { input: "root = [3,1,4,3,null,1,5]", output: "4" },
      { input: "root = [3,3,null,4,2]", output: "3" },
    ],
    intuition: "As you walk down the tree, track the maximum value seen so far on the path. A node is 'good' if its value is at least as large as that maximum. It is like checking whether each new element in a running maximum sequence keeps the record.",
    approach: [
      "DFS with a maxSoFar parameter.",
      "At each node: if node.val >= maxSoFar, it is a good node, increment count.",
      "Update maxSoFar = Math.max(maxSoFar, node.val).",
      "Recurse into children.",
    ],
    solution: `function goodNodes(root) {
  let count = 0;
  function dfs(node, maxSoFar) {
    if (!node) return;
    if (node.val >= maxSoFar) { count++; maxSoFar = node.val; }
    dfs(node.left, maxSoFar);
    dfs(node.right, maxSoFar);
  }
  dfs(root, -Infinity);
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Path-maximum tracking models access control in hierarchical permission systems where a node is accessible only if no ancestor has a higher permission level that blocks it. Monotonic path analysis is also used in network routing to find valid paths where each hop's bandwidth is at least as large as the required minimum.",
    pitfalls: ["The root is always a good node because there is nothing above it — starting maxSoFar at -Infinity handles this automatically.", "Update maxSoFar only when the node is good, so descendants compare against the new maximum."],
  },
  {
    id: "trees-24",
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "Medium",
    tags: ["Binary Tree", "DFS", "Recursion"],
    statement: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q. The LCA is the lowest node that has both p and q as descendants (a node is a descendant of itself).",
    examples: [
      { input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1", output: "3" },
      { input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4", output: "5" },
    ],
    intuition: "If the current node is p or q, it is a candidate LCA. If we find p in the left subtree and q in the right (or vice versa), the current node is the LCA. This is like finding where two family lineages first share a common ancestor.",
    approach: [
      "Base case: if null or node == p or node == q, return node.",
      "Recurse into left and right subtrees.",
      "If both sides return non-null, the current node is the LCA.",
      "Otherwise return the non-null side.",
    ],
    solution: `function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "LCA computation is used in version control systems to find the merge base (the last common commit) between two branches. In distributed systems, the LCA of two nodes in a consistent-hashing ring determines the responsible coordinator for conflict resolution between two replicas.",
    pitfalls: ["The problem states a node is a descendant of itself — handle p == root or q == root correctly by returning root immediately.", "If both p and q are in the same subtree, only one side of the recursion returns non-null."],
  },
  {
    id: "trees-25",
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    difficulty: "Medium",
    tags: ["Binary Tree", "DFS", "Divide and Conquer"],
    statement: "Given two integer arrays preorder and inorder where preorder is the preorder traversal and inorder is the inorder traversal of the same tree, construct and return the binary tree.",
    examples: [
      { input: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]", output: "[3,9,20,null,null,15,7]" },
      { input: "preorder = [-1], inorder = [-1]", output: "[-1]" },
    ],
    intuition: "The first element of preorder is always the root. Find it in inorder — everything to the left belongs to the left subtree, everything to the right belongs to the right subtree. Recurse on each half.",
    approach: [
      "Build a hashmap of inorder value -> index for O(1) lookup.",
      "The first element of preorder is the root.",
      "Find the root index in inorder; left subtree size = rootIndex - inStart.",
      "Recursively build left and right subtrees with the correct preorder and inorder slices.",
    ],
    solution: `function buildTree(preorder, inorder) {
  const inMap = new Map();
  inorder.forEach((v, i) => inMap.set(v, i));
  let preIdx = 0;
  function build(inStart, inEnd) {
    if (inStart > inEnd) return null;
    const rootVal = preorder[preIdx++];
    const node = { val: rootVal, left: null, right: null };
    const mid = inMap.get(rootVal);
    node.left = build(inStart, mid - 1);
    node.right = build(mid + 1, inEnd);
    return node;
  }
  return build(0, inorder.length - 1);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Tree reconstruction from traversal sequences is used in database plan serialization — a query plan is serialized as a preorder byte stream and reconstructed on the receiving node. Compiler IR serialization and deserialization uses the same preorder/inorder encoding to persist and restore abstract syntax trees.",
    pitfalls: ["Use a hash map for inorder lookup to avoid O(n²) from repeated linear scans.", "The preorder index must be a shared counter (closure variable) that advances globally as nodes are created."],
  },
  {
    id: "trees-26",
    title: "Construct Binary Tree from Inorder and Postorder Traversal",
    difficulty: "Medium",
    tags: ["Binary Tree", "DFS", "Divide and Conquer"],
    statement: "Given two integer arrays inorder and postorder where postorder is the postorder traversal and inorder is the inorder traversal of the same tree, construct and return the binary tree.",
    examples: [
      { input: "inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]", output: "[3,9,20,null,null,15,7]" },
      { input: "inorder = [-1], postorder = [-1]", output: "[-1]" },
    ],
    intuition: "The last element of postorder is always the root. Find it in inorder to split left and right subtrees, then recurse — this time consuming postorder from the back.",
    approach: [
      "Build inorder index map.",
      "Consume postorder from the back (right to left) to get root values.",
      "Split inorder range by root position.",
      "Build right subtree first (postorder right-before-left at the end), then left.",
    ],
    solution: `function buildTreePost(inorder, postorder) {
  const inMap = new Map();
  inorder.forEach((v, i) => inMap.set(v, i));
  let postIdx = postorder.length - 1;
  function build(inStart, inEnd) {
    if (inStart > inEnd) return null;
    const rootVal = postorder[postIdx--];
    const node = { val: rootVal, left: null, right: null };
    const mid = inMap.get(rootVal);
    node.right = build(mid + 1, inEnd);
    node.left = build(inStart, mid - 1);
    return node;
  }
  return build(0, inorder.length - 1);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Postorder-based reconstruction mirrors how bottom-up compilers rebuild ASTs from emitted bytecode: leaf operations are resolved first, then parents. Distributed build systems (Bazel) reconstruct dependency graphs from bottom-up build logs to detect circular dependencies.",
    pitfalls: ["Build right before left when consuming postorder from the back — postorder ends with (left, right, root) so the root is last, and to its left is the right subtree's root.", "Remember to decrement postIdx before recursing into children."],
  },
  {
    id: "trees-27",
    title: "Flatten Binary Tree to Linked List",
    difficulty: "Medium",
    tags: ["Binary Tree", "DFS", "Linked List"],
    statement: "Given the root of a binary tree, flatten the tree into a linked list in-place. The linked list should be in the same order as a preorder traversal, using right child pointers and setting left child pointers to null.",
    examples: [
      { input: "root = [1,2,5,3,4,null,6]", output: "[1,null,2,null,3,null,4,null,5,null,6]" },
      { input: "root = []", output: "[]" },
    ],
    intuition: "Use a reverse preorder (right, left, root). Maintain a 'prev' pointer. At each node, set node.right = prev and node.left = null, then update prev = node. The list builds up backwards.",
    approach: [
      "Use a global 'prev' variable initialised to null.",
      "Recursively call flatten on the right child first, then the left child.",
      "Set node.right = prev, node.left = null, prev = node.",
    ],
    solution: `function flatten(root) {
  let prev = null;
  function dfs(node) {
    if (!node) return;
    dfs(node.right);
    dfs(node.left);
    node.right = prev;
    node.left = null;
    prev = node;
  }
  dfs(root);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Flattening a tree into a list models the linearisation step in query execution plan serialization, where a tree-shaped plan is flattened into a sequential execution pipeline. DOM serializers (innerHTML) also flatten the tree into a string in preorder, and persistent data structures use flattened arrays for cache-friendly tree storage.",
    pitfalls: ["Process right before left in reverse preorder so that when you link nodes, the right child has already been flattened.", "Setting node.left = null must happen after you have already recursed into it."],
  },
  {
    id: "trees-28",
    title: "Populating Next Right Pointers in Each Node",
    difficulty: "Medium",
    tags: ["Binary Tree", "BFS", "Linked List"],
    statement: "You are given a perfect binary tree where all leaves are at the same level. Populate each node's next pointer to point to its next right node. If there is no next right node, set it to null. Use only constant extra space.",
    examples: [
      { input: "root = [1,2,3,4,5,6,7]", output: "[1,#,2,3,#,4,5,6,7,#]" },
      { input: "root = []", output: "[]" },
    ],
    intuition: "Since the tree is perfect, use the already-established next pointers at the current level to iterate across and set up the next pointers for the level below, without any queue.",
    approach: [
      "Start at the root (leftmost node of current level).",
      "For each node at the current level: connect node.left.next = node.right and node.right.next = node.next ? node.next.left : null.",
      "Move to the next level's leftmost node (current.left).",
      "Repeat until at leaf level.",
    ],
    solution: `function connect(root) {
  if (!root) return root;
  let levelStart = root;
  while (levelStart.left) {
    let curr = levelStart;
    while (curr) {
      curr.left.next = curr.right;
      curr.right.next = curr.next ? curr.next.left : null;
      curr = curr.next;
    }
    levelStart = levelStart.left;
  }
  return root;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Next-level pointers mimic the linked skip-list structure used in Redis sorted sets, where nodes at the same level are linked for O(log n) range queries. Distributed lock managers also maintain horizontal linked lists of waiters at each priority tier to efficiently signal the next waiter.",
    pitfalls: ["This O(1) space solution works only for perfect binary trees — use BFS for general trees.", "When connecting right.next, check if curr.next is non-null before accessing curr.next.left."],
  },
  {
    id: "trees-29",
    title: "Count Complete Tree Nodes",
    difficulty: "Medium",
    tags: ["Binary Tree", "Binary Search", "DFS"],
    statement: "Given the root of a complete binary tree, return the number of nodes. A complete binary tree has all levels fully filled except possibly the last, which is filled from left to right.",
    examples: [
      { input: "root = [1,2,3,4,5,6]", output: "6" },
      { input: "root = []", output: "0" },
      { input: "root = [1]", output: "1" },
    ],
    intuition: "For a complete binary tree, measure the leftmost and rightmost heights. If they are equal, it is a perfect subtree with 2^h - 1 nodes. Otherwise recurse into left and right subtrees.",
    approach: [
      "Compute leftHeight by going left-only from current node.",
      "Compute rightHeight by going right-only from current node.",
      "If equal, return 2^leftHeight - 1 (perfect subtree).",
      "Else return 1 + countNodes(root.left) + countNodes(root.right).",
    ],
    solution: `function countNodes(root) {
  if (!root) return 0;
  let l = root, r = root, lh = 0, rh = 0;
  while (l) { lh++; l = l.left; }
  while (r) { rh++; r = r.right; }
  if (lh === rh) return (1 << lh) - 1;
  return 1 + countNodes(root.left) + countNodes(root.right);
}`,
    language: "javascript",
    complexity: { time: "O(log²n)", space: "O(log n)" },
    systemDesign: "Counting nodes in a complete tree in O(log²n) rather than O(n) is important for heap-backed priority queues used in OS schedulers and Dijkstra's algorithm — knowing the size without full traversal allows efficient insertion at the last leaf position. Heap indexes in databases use the same complete-tree property for compact storage.",
    pitfalls: ["The key insight is that for a complete binary tree, at least one of the two subtrees is a perfect binary tree.", "Use bit-shift (1 << h) for 2^h to avoid floating-point issues."],
  },
  {
    id: "trees-30",
    title: "Path Sum III",
    difficulty: "Medium",
    tags: ["Binary Tree", "DFS", "Prefix Sum", "Hashing"],
    statement: "Given the root of a binary tree and an integer targetSum, return the number of paths where the sum of the values along the path equals targetSum. The path does not need to start or end at the root or a leaf.",
    examples: [
      { input: "root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8", output: "3" },
      { input: "root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22", output: "3" },
    ],
    intuition: "Walk the tree keeping a running prefix sum. Use a hash map to count how many times each prefix sum has been seen. If prefixSum - targetSum exists in the map, those earlier prefixes can be paired with the current position to form a valid path.",
    approach: [
      "Maintain a map prefixCounts = {0: 1} and a running currentSum.",
      "At each node: add node.val to currentSum.",
      "Increment count by prefixCounts[currentSum - targetSum].",
      "Update prefixCounts[currentSum]; recurse; decrement prefixCounts[currentSum] (backtrack).",
    ],
    solution: `function pathSumIII(root, targetSum) {
  let count = 0;
  const prefixCounts = new Map([[0, 1]]);
  function dfs(node, currentSum) {
    if (!node) return;
    currentSum += node.val;
    count += prefixCounts.get(currentSum - targetSum) || 0;
    prefixCounts.set(currentSum, (prefixCounts.get(currentSum) || 0) + 1);
    dfs(node.left, currentSum);
    dfs(node.right, currentSum);
    prefixCounts.set(currentSum, prefixCounts.get(currentSum) - 1);
  }
  dfs(root, 0);
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Prefix-sum hash maps on tree paths model query execution in hierarchical databases (like MongoDB's aggregation pipelines on nested documents), where you want to count sub-document paths matching a numeric constraint. Log analysis tools use the same prefix trick to count event-chain sub-sequences that sum to an alert threshold.",
    pitfalls: ["Decrement the prefix count when backtracking to ensure counts from one branch do not pollute sibling branches.", "Initialise the map with {0: 1} to count paths starting from the root."],
  },
  {
    id: "trees-31",
    title: "Sum Root to Leaf Numbers",
    difficulty: "Medium",
    tags: ["Binary Tree", "DFS"],
    statement: "Given a binary tree containing digits from 0 to 9, each root-to-leaf path represents a number. Return the total sum of all root-to-leaf numbers.",
    examples: [
      { input: "root = [1,2,3]", output: "25", explanation: "Paths 12 and 13 sum to 25." },
      { input: "root = [4,9,0,5,1]", output: "1026", explanation: "Paths 495, 491, 40 sum to 1026." },
    ],
    intuition: "As you walk down the tree, multiply the running number by 10 and add the current digit. When you reach a leaf, the accumulated number is a complete path number — add it to the total.",
    approach: [
      "DFS with a currentNumber parameter.",
      "At each node: currentNumber = currentNumber * 10 + node.val.",
      "If leaf, return currentNumber.",
      "Return sum of recursing into left and right.",
    ],
    solution: `function sumNumbers(root) {
  function dfs(node, current) {
    if (!node) return 0;
    current = current * 10 + node.val;
    if (!node.left && !node.right) return current;
    return dfs(node.left, current) + dfs(node.right, current);
  }
  return dfs(root, 0);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Root-to-leaf numeric encoding models hierarchical ID schemes such as IP CIDR prefixes (each bit extends the address), Dewey Decimal classification, and URL path encoding where each path segment extends a base code. Radix tree (trie) data structures used in routing tables use the same digit-accumulation principle.",
    pitfalls: ["The accumulation must use multiplication by 10 (decimal digit shift), not concatenation.", "An empty tree returns 0, not an error."],
  },
  {
    id: "trees-32",
    title: "House Robber III",
    difficulty: "Medium",
    tags: ["Binary Tree", "Dynamic Programming", "DFS"],
    statement: "Thieves plan to rob houses arranged in a binary tree. Two directly connected houses cannot both be robbed. Return the maximum amount of money the thief can rob without robbing two adjacent nodes.",
    examples: [
      { input: "root = [3,2,3,null,3,null,1]", output: "7", explanation: "Rob nodes 3, 3, 1." },
      { input: "root = [3,4,5,1,3,null,1]", output: "9", explanation: "Rob 4 and 5." },
    ],
    intuition: "At each node you have two choices: rob it (and skip its children) or skip it (and take the best from its children). Return both options as a pair and let the parent decide.",
    approach: [
      "Define dfs(node) returning [robThis, skipThis].",
      "robThis = node.val + left[1] + right[1].",
      "skipThis = max(left) + max(right).",
      "At root, return max(robThis, skipThis).",
    ],
    solution: `function rob(root) {
  function dfs(node) {
    if (!node) return [0, 0];
    const [lRob, lSkip] = dfs(node.left);
    const [rRob, rSkip] = dfs(node.right);
    const robThis = node.val + lSkip + rSkip;
    const skipThis = Math.max(lRob, lSkip) + Math.max(rRob, rSkip);
    return [robThis, skipThis];
  }
  return Math.max(...dfs(root));
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Independent set DP on trees models resource scheduling in hierarchical systems where adjacent tasks cannot run simultaneously (critical section management). Database lock managers use similar interval-based independence checks to allow maximum concurrency without deadlocks across a lock hierarchy tree.",
    pitfalls: ["Return both options as a pair — choosing just one at each level loses information needed by the parent.", "The base case (null node) returns [0, 0] — both rob and skip options yield 0 for a missing node."],
  },
  {
    id: "trees-33",
    title: "Maximum Width of Binary Tree",
    difficulty: "Medium",
    tags: ["Binary Tree", "BFS"],
    statement: "Given the root of a binary tree, return the maximum width of the tree. The width of one level is defined as the length between the leftmost and rightmost non-null nodes, including null nodes in between.",
    examples: [
      { input: "root = [1,3,2,5,3,null,9]", output: "4" },
      { input: "root = [1,3,2,5,null,null,9,6,null,7]", output: "7" },
    ],
    intuition: "Assign position indices to nodes as if it were a complete binary tree: the root is 1, left child of node at index i is 2*i, right child is 2*i+1. The width at each level is lastIndex - firstIndex + 1.",
    approach: [
      "BFS with queue entries [node, index].",
      "At each level, compute width = lastIndex - firstIndex + 1.",
      "Track global maximum width.",
      "Normalise indices at each level by subtracting firstIndex to prevent BigInt overflow.",
    ],
    solution: `function widthOfBinaryTree(root) {
  if (!root) return 0;
  let maxWidth = 0;
  let queue = [[root, 0n]];
  while (queue.length) {
    const size = queue.length;
    const firstIdx = queue[0][1];
    let lastIdx = firstIdx;
    const nextQueue = [];
    for (let i = 0; i < size; i++) {
      const [node, idx] = queue[i];
      const normIdx = idx - firstIdx;
      lastIdx = normIdx;
      if (node.left) nextQueue.push([node.left, normIdx * 2n]);
      if (node.right) nextQueue.push([node.right, normIdx * 2n + 1n]);
    }
    maxWidth = Math.max(maxWidth, Number(lastIdx - 0n + 1n));
    queue = nextQueue;
  }
  return maxWidth;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Index-based width calculation models complete binary heap indexing used in priority queues (heapify operations), and also applies to segment tree range width calculations in competitive database engines. Spatial indexing structures like k-d trees use similar positional labeling to bound search regions.",
    pitfalls: ["Use BigInt for indices because a deeply unbalanced tree can produce indices that exceed JavaScript's safe integer range.", "Normalise (subtract the leftmost index at each level) to keep BigInt values manageable."],
  },
  {
    id: "trees-34",
    title: "Distribute Coins in Binary Tree",
    difficulty: "Medium",
    tags: ["Binary Tree", "DFS", "Greedy"],
    statement: "You are given a binary tree with n nodes, each node having some number of coins. There are n coins total. In one move, you can move a coin from a node to an adjacent node. Return the minimum number of moves to make every node have exactly one coin.",
    examples: [
      { input: "root = [3,0,0]", output: "2" },
      { input: "root = [0,3,0]", output: "3" },
    ],
    intuition: "Each subtree has a 'surplus' or 'deficit' of coins. Any coin that needs to cross the edge between a node and its parent counts as one move — regardless of direction. Sum the absolute surpluses of all edges.",
    approach: [
      "DFS returning the net flow through each edge (positive = excess flowing up, negative = deficit needing to flow down).",
      "For a node: flow = node.val - 1 + leftFlow + rightFlow.",
      "Add Math.abs(leftFlow) + Math.abs(rightFlow) to the move count.",
      "Return flow to the parent.",
    ],
    solution: `function distributeCoins(root) {
  let moves = 0;
  function dfs(node) {
    if (!node) return 0;
    const leftFlow = dfs(node.left);
    const rightFlow = dfs(node.right);
    moves += Math.abs(leftFlow) + Math.abs(rightFlow);
    return node.val - 1 + leftFlow + rightFlow;
  }
  dfs(root);
  return moves;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Flow-based redistribution on trees models load balancing across hierarchical computing clusters, where excess tasks from overloaded nodes must be redistributed across the tree of servers. The total number of reassignments equals the sum of absolute net flows across all edges, directly mirroring this algorithm.",
    pitfalls: ["The flow through an edge is the absolute value — both surpluses and deficits cost moves.", "The return value from dfs is the signed net flow, but the move count accumulates absolute values."],
  },
  {
    id: "trees-35",
    title: "All Nodes Distance K in Binary Tree",
    difficulty: "Medium",
    tags: ["Binary Tree", "BFS", "DFS", "Graph"],
    statement: "Given the root of a binary tree, a target node, and an integer k, return a list of the values of all nodes that have a distance k from the target node.",
    examples: [
      { input: "root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2", output: "[7,4,1]" },
      { input: "root = [1], target = 1, k = 3", output: "[]" },
    ],
    intuition: "Convert the tree into an undirected graph (adding parent pointers), then do a BFS from the target node stopping at depth k. It is like finding all cities within k road segments of a starting city.",
    approach: [
      "DFS to build a parent map: parent[node] = parentNode.",
      "BFS from target node, tracking visited nodes.",
      "Stop after exactly k levels.",
      "Collect all node values at level k.",
    ],
    solution: `function distanceK(root, target, k) {
  const parent = new Map();
  function buildParent(node, par) {
    if (!node) return;
    parent.set(node, par);
    buildParent(node.left, node);
    buildParent(node.right, node);
  }
  buildParent(root, null);
  const visited = new Set();
  const queue = [target];
  visited.add(target);
  let dist = 0;
  while (queue.length && dist < k) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      for (const neighbor of [node.left, node.right, parent.get(node)]) {
        if (neighbor && !visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    dist++;
  }
  return queue.map(n => n.val);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "BFS distance queries on trees model k-hop reachability in social networks ('friends of friends within k connections') and service dependency graphs ('all microservices reachable within k calls'). Graph databases like Neo4j execute variable-length path queries using exactly this BFS expansion.",
    pitfalls: ["Build the parent map first — trees don't have upward pointers by default.", "Mark nodes as visited before enqueuing to avoid re-processing nodes via multiple paths."],
  },
  // ---- HARD (15 problems) ----
  {
    id: "trees-36",
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    tags: ["Binary Tree", "DFS", "Dynamic Programming"],
    statement: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. A node can only appear once. The path does not need to pass through the root. Given the root, return the maximum path sum.",
    examples: [
      { input: "root = [1,2,3]", output: "6" },
      { input: "root = [-10,9,20,null,null,15,7]", output: "42" },
    ],
    intuition: "At each node, the best path through it equals leftContrib + node.val + rightContrib. But each child contributes to its parent only in a one-sided path (left or right, not both). Track the global max while returning only the single-sided contribution.",
    approach: [
      "DFS returning the best single-sided path sum from the node downward.",
      "leftGain = max(0, dfs(left)); rightGain = max(0, dfs(right)) — drop negative branches.",
      "Update globalMax with node.val + leftGain + rightGain.",
      "Return node.val + max(leftGain, rightGain) to the parent.",
    ],
    solution: `function maxPathSum(root) {
  let globalMax = -Infinity;
  function dfs(node) {
    if (!node) return 0;
    const leftGain = Math.max(0, dfs(node.left));
    const rightGain = Math.max(0, dfs(node.right));
    globalMax = Math.max(globalMax, node.val + leftGain + rightGain);
    return node.val + Math.max(leftGain, rightGain);
  }
  dfs(root);
  return globalMax;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Maximum path sum is used in network flow routing to find the highest-bandwidth path through a network of nodes with weighted connections. In financial modelling, it computes the maximum gain path through a decision tree where nodes represent profit/loss at each stage.",
    pitfalls: ["Clamp negative gains to 0 — a negative subtree only hurts the total.", "The two-arm path (leftGain + rightGain + val) updates globalMax but cannot be returned to the parent — only the single-arm value is returned."],
  },
  {
    id: "trees-37",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    tags: ["Binary Tree", "BFS", "Design", "String"],
    statement: "Design an algorithm to serialize a binary tree to a string and deserialize that string back to the original tree. There is no restriction on your serialization/deserialization format.",
    examples: [
      { input: "root = [1,2,3,null,null,4,5]", output: "serialize then deserialize returns the same tree" },
      { input: "root = []", output: "\"null\"" },
    ],
    intuition: "Use BFS level-order traversal to serialize, recording null children as the string 'null'. To deserialize, replay the BFS: create nodes from the values and attach them as children in queue order.",
    approach: [
      "Serialize: BFS, push node.val or 'null' to array, join with ','.",
      "Deserialize: split string by ',', create root from first value.",
      "BFS with a queue of created nodes; for each node assign next two values as left and right children.",
    ],
    solution: `function serialize(root) {
  if (!root) return "null";
  const result = [], queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (!node) { result.push("null"); continue; }
    result.push(String(node.val));
    queue.push(node.left);
    queue.push(node.right);
  }
  return result.join(",");
}
function deserialize(data) {
  const vals = data.split(",");
  if (vals[0] === "null") return null;
  const root = { val: Number(vals[0]), left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length) {
    const node = queue.shift();
    if (vals[i] !== "null") {
      node.left = { val: Number(vals[i]), left: null, right: null };
      queue.push(node.left);
    }
    i++;
    if (vals[i] !== "null") {
      node.right = { val: Number(vals[i]), left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Tree serialization is a fundamental operation in distributed systems: Apache Thrift and Protocol Buffers serialize hierarchical data structures to binary wire formats for cross-service communication. MongoDB's BSON format and Redis's RDB snapshot format both use compact tree serialization to persist document hierarchies.",
    pitfalls: ["BFS serialization is simpler than preorder because it handles the reconstruction index naturally.", "Make sure to push null children into the queue during serialization so the structure is preserved exactly."],
  },
  {
    id: "trees-38",
    title: "Vertical Order Traversal of a Binary Tree",
    difficulty: "Hard",
    tags: ["Binary Tree", "BFS", "Sorting"],
    statement: "Given the root of a binary tree, calculate the vertical order traversal. For each node at position (row, col), nodes with the same col are in the same vertical group. Within the same (row, col), sort by value. Return columns from left to right.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[9],[3,15],[20],[7]]" },
      { input: "root = [1,2,3,4,5,6,7]", output: "[[4],[2],[1,5,6],[3],[7]]" },
    ],
    intuition: "Assign each node a (row, col) coordinate: root is (0,0), left child is (row+1, col-1), right child is (row+1, col+1). Group nodes by column and sort within each column by row, then value.",
    approach: [
      "BFS or DFS collecting (col, row, val) triples.",
      "Group by col using a Map.",
      "Sort each group by row, then val.",
      "Sort columns by key and return.",
    ],
    solution: `function verticalTraversal(root) {
  const nodes = [];
  function dfs(node, row, col) {
    if (!node) return;
    nodes.push([col, row, node.val]);
    dfs(node.left, row + 1, col - 1);
    dfs(node.right, row + 1, col + 1);
  }
  dfs(root, 0, 0);
  nodes.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const colMap = new Map();
  for (const [col, , val] of nodes) {
    if (!colMap.has(col)) colMap.set(col, []);
    colMap.get(col).push(val);
  }
  return [...colMap.keys()].sort((a, b) => a - b).map(k => colMap.get(k));
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Vertical column grouping mirrors partitioning in columnar databases where rows are stored column-by-column for analytical query performance. Spatial indexing structures (R-trees, quad-trees) use coordinate-based grouping to route range queries efficiently in geo-spatial databases.",
    pitfalls: ["Nodes at the same (row, col) must be sorted by value — this arises only in trees with duplicate structure.", "Sort the final column keys numerically, not lexicographically, as Map insertion order is not sorted."],
  },
  {
    id: "trees-39",
    title: "Recover from Preorder Traversal",
    difficulty: "Hard",
    tags: ["Binary Tree", "DFS", "String"],
    statement: "We run a preorder DFS of a binary tree and record the result as a string where each node's depth is indicated by the number of dashes before its value. Given the string, reconstruct the tree.",
    examples: [
      { input: "traversal = \"1-2--3--4-5--6--7\"", output: "[1,2,5,3,4,6,7]" },
      { input: "traversal = \"1-2--3---4-5--6---7\"", output: "[1,2,5,3,null,6,null,4,null,7]" },
    ],
    intuition: "Parse the string to extract (depth, value) pairs. Use a stack representing the path from root to current node. For each new node, pop stack entries deeper than or equal to the current depth, then attach it as the left or right child.",
    approach: [
      "Parse the string to get a list of (depth, value) pairs using a pointer.",
      "Maintain a stack of nodes at each depth.",
      "For each (depth, val): while stack.length > depth, pop. Create the new node.",
      "If stack top has no left child, assign as left; else assign as right.",
      "Push new node onto stack.",
    ],
    solution: `function recoverFromPreorder(traversal) {
  const stack = [];
  let i = 0;
  while (i < traversal.length) {
    let depth = 0;
    while (i < traversal.length && traversal[i] === "-") { depth++; i++; }
    let val = 0;
    while (i < traversal.length && traversal[i] !== "-") { val = val * 10 + Number(traversal[i++]); }
    const node = { val, left: null, right: null };
    while (stack.length > depth) stack.pop();
    if (stack.length) {
      const parent = stack[stack.length - 1];
      if (!parent.left) parent.left = node;
      else parent.right = node;
    }
    stack.push(node);
  }
  return stack[0];
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Indented-format parsing (like Python's indentation-based scoping or YAML/TOML parsing) uses the same depth-tracking stack to reconstruct hierarchical structure from a flat string. Database explain plan parsers also reconstruct the operator tree from an indented text output using this technique.",
    pitfalls: ["Handle multi-digit node values by accumulating digits in the inner loop.", "The stack depth invariant: always pop down to exactly the current depth before pushing the new node."],
  },
  {
    id: "trees-40",
    title: "Binary Tree Cameras",
    difficulty: "Hard",
    tags: ["Binary Tree", "DFS", "Greedy", "Dynamic Programming"],
    statement: "You are given a binary tree where each node can be covered by a camera. A camera placed on a node can monitor its parent, itself, and its immediate children. Return the minimum number of cameras needed to monitor all nodes.",
    examples: [
      { input: "root = [0,0,null,0,0]", output: "1" },
      { input: "root = [0,0,null,0,null,0,null,null,0]", output: "2" },
    ],
    intuition: "Use a greedy bottom-up approach. Each node can be in one of three states: not covered (0), has a camera (1), or covered but no camera (2). Place cameras as high as possible — when a leaf's parent is uncovered, place a camera on the parent.",
    approach: [
      "DFS returning state: 0 = not covered, 1 = has camera, 2 = covered.",
      "Null nodes are covered (return 2).",
      "If either child is not covered (state 0), place camera here (state 1, increment count).",
      "If either child has a camera (state 1), this node is covered (return 2).",
      "Otherwise this node is not yet covered (return 0).",
      "After DFS, if root returns 0, increment count by 1.",
    ],
    solution: `function minCameraCover(root) {
  let cameras = 0;
  function dfs(node) {
    if (!node) return 2; // null is considered covered
    const l = dfs(node.left), r = dfs(node.right);
    if (l === 0 || r === 0) { cameras++; return 1; }
    if (l === 1 || r === 1) return 2;
    return 0;
  }
  if (dfs(root) === 0) cameras++;
  return cameras;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Minimum dominating set problems (like camera placement) model sensor network deployment where you want to cover all nodes with the fewest sensors. Data centre monitoring systems use similar greedy coverage algorithms to place the minimum number of health-check agents to monitor all servers in a network topology.",
    pitfalls: ["Null nodes return 2 (covered) — this ensures leaf nodes can propagate state 0 to their parent.", "After the DFS, if the root is uncovered (state 0), one more camera is needed at the root."],
  },
  {
    id: "trees-41",
    title: "Maximum Sum BST in Binary Tree",
    difficulty: "Hard",
    tags: ["Binary Tree", "BST", "DFS", "Dynamic Programming"],
    statement: "Given a binary tree root, return the maximum sum of all keys of any subtree which is also a Binary Search Tree. If no such subtree exists, return 0.",
    examples: [
      { input: "root = [1,4,3,2,4,2,5,null,null,null,null,null,null,4,6]", output: "20" },
      { input: "root = [4,3,null,1,2]", output: "2" },
    ],
    intuition: "Perform a bottom-up DFS. At each node, determine if the current subtree is a valid BST by checking that the left subtree's max value is less than the current node and the right subtree's min value is greater. Track the sum and the global maximum BST sum.",
    approach: [
      "DFS returns [isBST, minVal, maxVal, sum].",
      "A subtree is a BST if both children are BSTs and left.max < node.val < right.min.",
      "If valid, sum = leftSum + rightSum + node.val; update global max.",
      "If invalid, return [false, ...].",
    ],
    solution: `function maxSumBST(root) {
  let maxSum = 0;
  function dfs(node) {
    if (!node) return [true, Infinity, -Infinity, 0];
    const [lBST, lMin, lMax, lSum] = dfs(node.left);
    const [rBST, rMin, rMax, rSum] = dfs(node.right);
    if (lBST && rBST && lMax < node.val && node.val < rMin) {
      const sum = lSum + rSum + node.val;
      maxSum = Math.max(maxSum, sum);
      return [true, Math.min(lMin, node.val), Math.max(rMax, node.val), sum];
    }
    return [false, -Infinity, Infinity, 0];
  }
  dfs(root);
  return maxSum;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Finding the maximum valid BST subtree models schema validation in hierarchical databases — identifying the largest consistently-ordered partition of a hierarchical index that can be queried using BST properties. Index health checks in B-tree implementations also scan for locally valid BST subtrees during recovery.",
    pitfalls: ["Use Infinity and -Infinity as sentinels for null nodes so that BST checks at leaf nodes work correctly.", "Return [false, -Infinity, Infinity, 0] for invalid subtrees so the parent's BST check will always fail."],
  },
  {
    id: "trees-42",
    title: "Boundary of Binary Tree",
    difficulty: "Hard",
    tags: ["Binary Tree", "DFS"],
    statement: "Given a binary tree, return the values of its boundary in anti-clockwise direction starting from the root. The boundary includes the left boundary (excluding leaves), all leaves (left to right), and the right boundary (excluding leaves, in reverse).",
    examples: [
      { input: "root = [1,null,2,3,4]", output: "[1,3,4,2]" },
      { input: "root = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,null,12,null,13,null,null,14]", output: "[1,2,4,7,11,12,8,9,13,14,10,6,3]" },
    ],
    intuition: "Think of tracing the outline of the tree: go down the left edge, collect all leaves left to right, then go back up the right edge. Separate this into three distinct passes.",
    approach: [
      "Collect left boundary (root to leftmost non-leaf, top-down).",
      "Collect all leaves using DFS.",
      "Collect right boundary (root to rightmost non-leaf, bottom-up via recursion).",
      "Combine: [root] + leftBoundary + leaves + rightBoundary.",
    ],
    solution: `function boundaryOfBinaryTree(root) {
  if (!root) return [];
  const result = [root.val];
  function isLeaf(node) { return !node.left && !node.right; }
  function addLeftBoundary(node) {
    let curr = node.left;
    while (curr) {
      if (!isLeaf(curr)) result.push(curr.val);
      curr = curr.left || curr.right;
    }
  }
  function addLeaves(node) {
    if (!node) return;
    if (isLeaf(node)) { result.push(node.val); return; }
    addLeaves(node.left);
    addLeaves(node.right);
  }
  function addRightBoundary(node) {
    let curr = node.right;
    const temp = [];
    while (curr) {
      if (!isLeaf(curr)) temp.push(curr.val);
      curr = curr.right || curr.left;
    }
    for (let i = temp.length - 1; i >= 0; i--) result.push(temp[i]);
  }
  if (!isLeaf(root)) {
    addLeftBoundary(root);
    addLeaves(root);
    addRightBoundary(root);
  } else {
    addLeaves(root);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Boundary traversal models perimeter-query operations in spatial databases — finding all objects on the border of a hierarchical spatial region. It also models generating the visible outline (silhouette) of a 3D scene tree, which is a core operation in computer graphics render pipelines.",
    pitfalls: ["Exclude leaves from the left and right boundary passes to avoid duplicates.", "The right boundary is collected bottom-up (reversed), so collect into a temp array and reverse before appending."],
  },
  {
    id: "trees-43",
    title: "Find Duplicate Subtrees",
    difficulty: "Hard",
    tags: ["Binary Tree", "DFS", "Hashing", "Serialization"],
    statement: "Given the root of a binary tree, return all duplicate subtrees. For each kind of duplicate subtree, return the root node of any one copy. Two trees are duplicate if they have the same structure and node values.",
    examples: [
      { input: "root = [1,2,3,4,null,2,4,null,null,4]", output: "[[2,4],[4]]" },
      { input: "root = [2,1,1]", output: "[[1]]" },
    ],
    intuition: "Serialize every subtree to a string. If the same string is seen for the second time, that subtree is a duplicate. Use a hash map counting how many times each serialized subtree has been seen.",
    approach: [
      "Postorder DFS, returning a serialized string for each subtree.",
      "Build the serialization as leftSerial + ',' + rightSerial + ',' + node.val.",
      "Track serialization frequencies in a Map.",
      "When count reaches 2, add node to result (avoid counting further duplicates).",
    ],
    solution: `function findDuplicateSubtrees(root) {
  const count = new Map(), result = [];
  function serialize(node) {
    if (!node) return "#";
    const key = serialize(node.left) + "," + serialize(node.right) + "," + node.val;
    count.set(key, (count.get(key) || 0) + 1);
    if (count.get(key) === 2) result.push(node);
    return key;
  }
  serialize(root);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n²)" },
    systemDesign: "Duplicate subtree detection is used in compiler CSE (Common Subexpression Elimination) where identical expression trees are computed once and cached. Database query optimisers detect duplicate sub-plan fragments to materialise them once as a Common Table Expression (WITH clause), reducing repeated computation.",
    pitfalls: ["Add to result only when count == 2, not for every duplicate, to return exactly one representative per duplicate subtree.", "String serialisation is O(n) per node leading to O(n²) overall; a tree hashing approach (assigning canonical IDs) can reduce this to O(n)."],
  },
  {
    id: "trees-44",
    title: "Binary Tree Coloring Game",
    difficulty: "Hard",
    tags: ["Binary Tree", "DFS", "Greedy"],
    statement: "Two players play a coloring game on a binary tree with n nodes. Player 1 colors node x red. Player 2 can then choose any uncolored node. Players alternate coloring any neighbor of their own colored region. Player 2 wins if they can color more nodes than Player 1. Return true if Player 2 can guarantee a win.",
    examples: [
      { input: "root = [1,2,3,4,5,6,7,8,9,10,11], n = 11, x = 3", output: "true" },
      { input: "root = [1,2,3], n = 3, x = 1", output: "false" },
    ],
    intuition: "Player 2 should pick a neighbor of x that gives them the largest connected region: the left subtree of x, the right subtree of x, or everything above x (n - leftSize - rightSize - 1). If any region is larger than n/2, Player 2 wins.",
    approach: [
      "DFS to count subtree sizes.",
      "Find node x and record its left subtree size and right subtree size.",
      "The third region is n - leftSize - rightSize - 1 (the rest of the tree).",
      "Return true if any of the three regions is > n/2.",
    ],
    solution: `function btreeGameWinningMove(root, n, x) {
  let leftSize = 0, rightSize = 0;
  function countSize(node) {
    if (!node) return 0;
    const l = countSize(node.left);
    const r = countSize(node.right);
    if (node.val === x) { leftSize = l; rightSize = r; }
    return l + r + 1;
  }
  countSize(root);
  const parent = n - leftSize - rightSize - 1;
  return Math.max(leftSize, rightSize, parent) > n / 2;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(h)" },
    systemDesign: "Partition-dominance analysis models shard splitting in distributed databases — whether one partition grows larger than half the total data, triggering a rebalance. Consistent hashing ring splits use the same 'does any region exceed half the ring?' check to decide when to add a new virtual node.",
    pitfalls: ["Player 2 has exactly three candidate regions to choose from — the left subtree, right subtree, or parent side.", "Return true if any region strictly exceeds n/2 (integer division — player 2 needs strictly more than n/2 nodes)."],
  },
  {
    id: "trees-45",
    title: "Delete Nodes and Return Forest",
    difficulty: "Hard",
    tags: ["Binary Tree", "DFS", "Hashing"],
    statement: "Given the root of a binary tree and an array of node values to delete, after deleting each of the specified nodes, return the roots of the trees in the remaining forest.",
    examples: [
      { input: "root = [1,2,3,4,5,6,7], to_delete = [3,5]", output: "[[1,2,null,4],[6],[7]]" },
      { input: "root = [1,2,4,null,3], to_delete = [3]", output: "[[1,2,4]]" },
    ],
    intuition: "DFS the tree. When you delete a node, its children become new roots. Track whether the current node's parent has been deleted to determine if the current node is a new root.",
    approach: [
      "Build a Set of to-delete values.",
      "DFS with an 'isRoot' flag.",
      "If current node is to be deleted and it is a 'root', it does not go to the forest.",
      "If current node is NOT deleted and is a root candidate, add it to the forest.",
      "After processing, null out deleted children.",
    ],
    solution: `function delNodes(root, to_delete) {
  const deleteSet = new Set(to_delete);
  const forest = [];
  function dfs(node, isRoot) {
    if (!node) return null;
    const deleted = deleteSet.has(node.val);
    if (isRoot && !deleted) forest.push(node);
    node.left = dfs(node.left, deleted);
    node.right = dfs(node.right, deleted);
    return deleted ? null : node;
  }
  dfs(root, true);
  return forest;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Selective subtree deletion and forest creation models shard removal in distributed storage — removing a partition server causes its sub-partitions to become independent shards that need re-assignment. File system operations like 'rm -rf' on intermediate directories similarly orphan subdirectories that must be re-parented.",
    pitfalls: ["When a node is deleted, its children become new roots — pass deleted=true as the isRoot flag to children.", "Return null for deleted nodes so their parents automatically lose the reference."],
  },
  {
    id: "trees-46",
    title: "Validate Binary Search Tree",
    difficulty: "Hard",
    tags: ["Binary Tree", "BST", "DFS"],
    statement: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST has each node's left subtree containing only values less than the node, right subtree containing only values greater, and both subtrees are also valid BSTs.",
    examples: [
      { input: "root = [2,1,3]", output: "true" },
      { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "Root is 5 but right child is 4 which is less than 5." },
    ],
    intuition: "Pass a valid range [min, max] down the tree. The current node's value must fall strictly within this range. Left children get the range [min, node.val] and right children get [node.val, max].",
    approach: [
      "DFS with (node, min, max) where node.val must be in (min, max).",
      "Initial call: validate(root, -Infinity, Infinity).",
      "For left child, max becomes node.val; for right child, min becomes node.val.",
      "Return false if node.val <= min or node.val >= max.",
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
    systemDesign: "BST validation is used in database index integrity checks to verify that a B-tree index has not become corrupted (each key range is properly bounded). Index rebuild operations in PostgreSQL and MySQL validate the ordering invariant across every node in the B-tree to ensure query correctness.",
    pitfalls: ["A common mistake is only comparing a node to its direct parent instead of propagating the full valid range — this misses cases like a right child being smaller than a grandparent.", "Use strict inequalities (< and >) — equal values are not allowed in a valid BST."],
  },
  {
    id: "trees-47",
    title: "Kth Smallest Element in a BST",
    difficulty: "Hard",
    tags: ["Binary Tree", "BST", "DFS", "Inorder"],
    statement: "Given the root of a binary search tree and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
    examples: [
      { input: "root = [3,1,4,null,2], k = 1", output: "1" },
      { input: "root = [5,3,6,2,4,null,null,1], k = 3", output: "3" },
    ],
    intuition: "Inorder traversal of a BST gives values in ascending sorted order. Stop as soon as you have visited the kth node — that is the kth smallest.",
    approach: [
      "Iterative inorder traversal using a stack.",
      "Maintain a counter; decrement each time a node is popped.",
      "When counter reaches 0, return the current node's value.",
    ],
    solution: `function kthSmallest(root, k) {
  const stack = [];
  let curr = root;
  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left; }
    curr = stack.pop();
    k--;
    if (k === 0) return curr.val;
    curr = curr.right;
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(h+k)", space: "O(h)" },
    systemDesign: "Kth-smallest queries are used in database ORDER BY LIMIT k queries — the query engine walks the B-tree index k steps to return the kth row without materialising all results. Rank-based pagination in search engines (e.g. returning results 91-100) uses the same inorder-walk-with-stop technique on sorted index structures.",
    pitfalls: ["Using O(n) inorder collect-all is correct but slow for large trees — the iterative early-stop approach is more efficient.", "For frequently-changing BSTs with repeated k-th queries, augment each node with its subtree size (order-statistics tree) for O(log n) query."],
  },
  {
    id: "trees-48",
    title: "Binary Search Tree Iterator",
    difficulty: "Hard",
    tags: ["Binary Tree", "BST", "Design", "Stack"],
    statement: "Implement the BSTIterator class representing an iterator over the in-order traversal of a BST. next() returns the next smallest number, hasNext() returns true if there is still a next number. Both operations should run in O(1) average time and O(h) space.",
    examples: [
      { input: "BSTIterator([7,3,15,null,null,9,20]): next()=3, next()=7, hasNext()=true, next()=9", output: "3, 7, true, 9" },
    ],
    intuition: "Simulate the inorder traversal lazily using an explicit stack. Push all left-spine nodes of the current subtree onto the stack. When next() is called, pop a node, then push the left spine of its right child.",
    approach: [
      "Constructor: push all nodes along the left spine of root.",
      "next(): pop from stack, then push left spine of popped node's right child. Return popped value.",
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
    complexity: { time: "O(1) amortized", space: "O(h)" },
    systemDesign: "Lazy tree iterators are used in database cursor implementations — a B-tree cursor materialises only the current key and a stack of ancestor nodes, allowing huge indexes to be iterated without loading everything into memory. Java's TreeSet.iterator() and Python's sortedcontainers.SortedList use the same lazy-expansion pattern.",
    pitfalls: ["next() must push the right child's left spine before returning — this is the 'lazy expansion' step.", "hasNext() can return true even if the stack contains only the right subtree root — the stack correctly represents pending work."],
  },
  {
    id: "trees-49",
    title: "Recover Binary Search Tree",
    difficulty: "Hard",
    tags: ["Binary Tree", "BST", "DFS", "Inorder"],
    statement: "You are given the root of a BST where exactly two nodes were swapped by mistake. Recover the tree without changing its structure.",
    examples: [
      { input: "root = [1,3,null,null,2]", output: "[3,1,null,null,2]", explanation: "Nodes 1 and 3 were swapped." },
      { input: "root = [3,1,4,null,null,2]", output: "[[2,1,4,null,null,3]]" },
    ],
    intuition: "Inorder traversal of a valid BST is sorted. If two nodes are swapped, there will be one or two places where the order is wrong. Find the first node that is greater than the next (first = first in pair), and the last node that is smaller than the previous (second = last in pair). Swap their values.",
    approach: [
      "Inorder traversal tracking a 'prev' node.",
      "When prev.val > curr.val: if first is null, set first = prev; always set second = curr.",
      "After traversal, swap first.val and second.val.",
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
    systemDesign: "BST recovery models database index repair after partial corruption — identifying and fixing out-of-order key entries in a B-tree index without rebuilding the entire structure. Online index repair operations in MySQL (REPAIR TABLE) and PostgreSQL (REINDEX CONCURRENTLY) use similar localized fix strategies.",
    pitfalls: ["There are two cases: adjacent swap (only one inversion) and non-adjacent swap (two inversions). Setting first only on the first inversion and second on every inversion handles both cases.", "Swap values, not node pointers, to recover the tree while preserving structure."],
  },
  {
    id: "trees-50",
    title: "Number of Nodes in the Sub-Tree With the Same Label",
    difficulty: "Hard",
    tags: ["Binary Tree", "DFS", "Counting"],
    statement: "You are given a tree (not necessarily binary) with n nodes labeled 0 to n-1, and a string labels where labels[i] is the label of node i. Return an array answer where answer[i] is the number of nodes in the subtree of node i with the same label as node i.",
    examples: [
      { input: "n = 7, edges = [[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]], labels = \"abaedcd\"", output: "[2,1,1,1,1,1,1]" },
      { input: "n = 4, edges = [[0,1],[1,2],[0,3]], labels = \"bbbb\"", output: "[4,2,1,1]" },
    ],
    intuition: "DFS from the root counting label frequencies in each subtree. After visiting all children, compare the frequency of the current node's label before and after visiting children — the difference is the count of matching labels in the subtree.",
    approach: [
      "Build an adjacency list for the undirected tree.",
      "DFS from node 0 with parent tracking to avoid revisiting.",
      "Each DFS call returns a frequency array of 26 characters.",
      "Merge child frequency arrays; answer[node] = merged_count[label[node]] after incrementing it.",
    ],
    solution: `function countSubTrees(n, edges, labels) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const answer = new Array(n).fill(0);
  function dfs(node, parent) {
    const counts = new Array(26).fill(0);
    for (const child of adj[node]) {
      if (child === parent) continue;
      const childCounts = dfs(child, node);
      for (let i = 0; i < 26; i++) counts[i] += childCounts[i];
    }
    const idx = labels.charCodeAt(node) - 97;
    counts[idx]++;
    answer[node] = counts[idx];
    return counts;
  }
  dfs(0, -1);
  return answer;
}`,
    language: "javascript",
    complexity: { time: "O(n * 26)", space: "O(n)" },
    systemDesign: "Subtree label counting models hierarchical tag aggregation in content management systems — for each category in a taxonomy tree, count how many items share its primary tag. E-commerce product hierarchy systems use this to compute 'items matching this attribute' counts for each category node without full re-scans.",
    pitfalls: ["This problem uses a general tree (not binary), built from an edge list — build adjacency list and pass the parent to avoid going backwards.", "Increment the count for the current node's label after merging children so the node itself is included in its own subtree count."],
  },
];
