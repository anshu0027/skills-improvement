import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  {
    id: "recursion-backtracking-01",
    title: "Factorial",
    difficulty: "Easy",
    tags: ["Recursion", "Math"],
    statement: "Given a non-negative integer n, return its factorial. The factorial of n (written n!) is the product of all positive integers from 1 to n. Define 0! = 1.",
    examples: [
      { input: "n = 5", output: "120", explanation: "5 * 4 * 3 * 2 * 1 = 120." },
      { input: "n = 0", output: "1", explanation: "0! is defined as 1." },
      { input: "n = 1", output: "1" },
    ],
    intuition: "Think of it like a stack of tasks: to find 5! you need 4!, and to find 4! you need 3!, and so on until you hit 0! = 1, then you multiply your way back up.",
    approach: [
      "Base case: if n === 0 return 1.",
      "Recursive case: return n * factorial(n - 1).",
    ],
    solution: `function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Recursive factorial maps directly to call-stack depth; in production systems deep recursion is replaced with iterative loops or tail-call-optimised trampolines to prevent stack overflows — the same concern arises when walking deep permission trees or nested config hierarchies in microservices.",
  },
  {
    id: "recursion-backtracking-02",
    title: "Sum of Digits",
    difficulty: "Easy",
    tags: ["Recursion", "Math"],
    statement: "Given a non-negative integer n, recursively compute the sum of its digits. For example, 1234 -> 1+2+3+4 = 10.",
    examples: [
      { input: "n = 1234", output: "10" },
      { input: "n = 0", output: "0" },
      { input: "n = 9", output: "9" },
    ],
    intuition: "Peel off the last digit with n % 10, add it to the sum of digits of the rest (n / 10), and keep going until nothing is left.",
    approach: [
      "Base case: if n === 0 return 0.",
      "Return (n % 10) + sumOfDigits(Math.floor(n / 10)).",
    ],
    solution: `function sumOfDigits(n) {
  if (n === 0) return 0;
  return (n % 10) + sumOfDigits(Math.floor(n / 10));
}`,
    language: "javascript",
    complexity: { time: "O(d) where d = number of digits", space: "O(d)" },
    systemDesign: "Digit-sum reduction is used in checksum algorithms (Luhn, ISBN) embedded in payment processors and barcode systems; the recursive formulation maps naturally to streaming digit parsers in protocol decoders.",
  },
  {
    id: "recursion-backtracking-03",
    title: "Power of a Number (Fast Exponentiation)",
    difficulty: "Easy",
    tags: ["Recursion", "Math", "Divide and Conquer"],
    statement: "Given a base x (float) and exponent n (integer), compute x^n using fast (binary) exponentiation. Handle negative exponents.",
    examples: [
      { input: "x = 2.0, n = 10", output: "1024.0" },
      { input: "x = 2.0, n = -2", output: "0.25" },
      { input: "x = 2.0, n = 0", output: "1.0" },
    ],
    intuition: "Instead of multiplying x by itself n times, cut the work in half each step: x^8 = (x^4)^2, so you only need to compute x^4 once and square it.",
    approach: [
      "Base case: if n === 0 return 1.",
      "If n is negative, compute 1 / myPow(x, -n).",
      "Recursively compute half = myPow(x, Math.floor(n / 2)).",
      "If n is even return half * half, else return half * half * x.",
    ],
    solution: `function myPow(x, n) {
  if (n === 0) return 1;
  if (n < 0) return 1 / myPow(x, -n);
  const half = myPow(x, Math.floor(n / 2));
  if (n % 2 === 0) return half * half;
  return half * half * x;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(log n)" },
    systemDesign: "Fast exponentiation underpins RSA and Diffie-Hellman key exchange (modular exponentiation) used in every TLS handshake; the same divide-and-conquer halving appears in distributed merge-sort and binary search tree balancing.",
  },
  {
    id: "recursion-backtracking-04",
    title: "Fibonacci with Memoization",
    difficulty: "Easy",
    tags: ["Recursion", "Memoization", "Dynamic Programming"],
    statement: "Return the nth Fibonacci number where F(0)=0, F(1)=1, and F(n)=F(n-1)+F(n-2). Use memoization to avoid redundant computation.",
    examples: [
      { input: "n = 6", output: "8" },
      { input: "n = 0", output: "0" },
      { input: "n = 10", output: "55" },
    ],
    intuition: "Fibonacci without a cache recomputes the same values millions of times — like solving the same puzzle piece over and over. Write each answer on a sticky note and look it up before recomputing.",
    approach: [
      "Create a memo map.",
      "Base cases: return n if n <= 1.",
      "If memo has n, return memo.get(n).",
      "Compute result = fib(n-1) + fib(n-2), store in memo, return result.",
    ],
    solution: `function fib(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Memoization is the algorithmic basis of caching layers (Redis, Memcached): expensive recomputations are stored by key so subsequent calls are O(1). Query planners in databases cache sub-plan results (common sub-expression elimination) using the exact same principle.",
  },
  {
    id: "recursion-backtracking-05",
    title: "Reverse a String Recursively",
    difficulty: "Easy",
    tags: ["Recursion", "String"],
    statement: "Given a string s, return it reversed using recursion. Do not use built-in reverse methods.",
    examples: [
      { input: "s = \"hello\"", output: "\"olleh\"" },
      { input: "s = \"a\"", output: "\"a\"" },
      { input: "s = \"\"", output: "\"\"" },
    ],
    intuition: "Move the last character to the front, then recursively reverse the rest — like peeling a banana from the bottom up.",
    approach: [
      "Base case: if s.length <= 1 return s.",
      "Return s[s.length - 1] + reverseString(s.slice(0, -1)).",
    ],
    solution: `function reverseString(s) {
  if (s.length <= 1) return s;
  return s[s.length - 1] + reverseString(s.slice(0, -1));
}`,
    language: "javascript",
    complexity: { time: "O(n^2) due to string slicing", space: "O(n)" },
    systemDesign: "Recursive string reversal is rarely used in production (iterative is faster), but the pattern of 'process last element, recurse on rest' appears in tail-recursive log-line parsers and protocol frame decoders in network stacks.",
    pitfalls: ["String slicing in JS creates new strings, so this is O(n^2). Use an array buffer for O(n) in practice."],
  },
  {
    id: "recursion-backtracking-06",
    title: "Tower of Hanoi",
    difficulty: "Easy",
    tags: ["Recursion", "Classic"],
    statement: "Move n disks from peg 'from' to peg 'to' using peg 'aux' as auxiliary, following the rules: move one disk at a time, never place a larger disk on a smaller one. Return the list of moves.",
    examples: [
      { input: "n = 2", output: "[[1,'A','B'],[1,'A','C'],[1,'B','C']]", explanation: "Move disk 1 A->B, disk 2 A->C, disk 1 B->C." },
      { input: "n = 1", output: "[[1,'A','C']]" },
    ],
    intuition: "To move n disks, first move the top n-1 disks out of the way, move the big disk to the destination, then move the n-1 disks on top of it — like clearing a table before sliding the tablecloth.",
    approach: [
      "Base case: n === 0, do nothing.",
      "Move n-1 disks from 'from' to 'aux' using 'to'.",
      "Record move of disk n from 'from' to 'to'.",
      "Move n-1 disks from 'aux' to 'to' using 'from'.",
    ],
    solution: `function hanoi(n, from = 'A', to = 'C', aux = 'B', moves = []) {
  if (n === 0) return moves;
  hanoi(n - 1, from, aux, to, moves);
  moves.push([n, from, to]);
  hanoi(n - 1, aux, to, from, moves);
  return moves;
}`,
    language: "javascript",
    complexity: { time: "O(2^n)", space: "O(n)" },
    systemDesign: "The Tower of Hanoi recurrence models any workflow requiring ordered dependency resolution with a temporary workspace — analogous to multi-step database migrations where intermediate staging tables hold data while schemas are restructured, and pruning irrelevant branches maps to skipping no-op migration steps.",
  },
  {
    id: "recursion-backtracking-07",
    title: "Print All Subsequences",
    difficulty: "Easy",
    tags: ["Recursion", "Backtracking", "Array"],
    statement: "Given an array of integers, print (return) all subsequences — subsets of elements that maintain the original relative order. Include the empty subsequence.",
    examples: [
      { input: "arr = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" },
      { input: "arr = [1]", output: "[[],[1]]" },
    ],
    intuition: "For each element you have exactly two choices: include it or skip it. Walk through all elements making these two choices — like toggling each light switch on or off.",
    approach: [
      "Use a recursive helper with current index and current subset.",
      "Base case: index equals arr.length, add a copy of current subset to results.",
      "Recursive case: include arr[index] in subset, recurse with index+1, then remove it and recurse again without it.",
    ],
    solution: `function printSubsequences(arr) {
  const result = [];
  function helper(index, current) {
    if (index === arr.length) {
      result.push([...current]);
      return;
    }
    // include arr[index]
    current.push(arr[index]);
    helper(index + 1, current);
    // exclude arr[index]
    current.pop();
    helper(index + 1, current);
  }
  helper(0, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * 2^n)", space: "O(n)" },
    systemDesign: "Enumerating all subsequences is the foundation of combinatorial feature selection in ML pipelines and permission-set enumeration in RBAC systems; in both cases pruning (skipping branches that violate constraints) avoids exponential blowup.",
  },
  {
    id: "recursion-backtracking-08",
    title: "Subsets",
    difficulty: "Easy",
    tags: ["Backtracking", "Array", "Bit Manipulation"],
    statement: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the subsets in any order.",
    examples: [
      { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" },
      { input: "nums = [0]", output: "[[],[0]]" },
    ],
    intuition: "Start with an empty basket, then for each number decide: add it or skip it. Every path through those decisions produces a unique subset.",
    approach: [
      "Backtrack from index 0 with an empty current list.",
      "At each step, add a copy of current to the result.",
      "Iterate from start index to end, adding nums[i], recursing with i+1, then removing nums[i].",
    ],
    solution: `function subsets(nums) {
  const result = [];
  function bt(start, current) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      bt(i + 1, current);
      current.pop();
    }
  }
  bt(0, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * 2^n)", space: "O(n)" },
    systemDesign: "Power-set generation underlies combinatorial test-case generation (all combinations of feature flags) and schema migration planning (all subsets of columns to index); pruning with constraints maps directly to partial-index and covering-index selection in query optimisers.",
  },
  {
    id: "recursion-backtracking-09",
    title: "Letter Case Permutation",
    difficulty: "Easy",
    tags: ["Backtracking", "String"],
    statement: "Given a string s, transform every letter individually to be lowercase or uppercase to create another string. Return a list of all possible strings we could create. Return the output in any order.",
    examples: [
      { input: "s = \"a1b2\"", output: "[\"a1b2\",\"a1B2\",\"A1b2\",\"A1B2\"]" },
      { input: "s = \"3z4\"", output: "[\"3z4\",\"3Z4\"]" },
    ],
    intuition: "Walk through the string character by character; digits are fixed, but each letter gives you two branches — lowercase and uppercase — like a forking road.",
    approach: [
      "Backtrack with a mutable char array at the current index.",
      "Base case: index equals s.length, push current string to result.",
      "If current char is a digit, recurse with index+1.",
      "Otherwise recurse once with lowercase, once with uppercase.",
    ],
    solution: `function letterCasePermutation(s) {
  const result = [];
  const arr = s.split('');
  function bt(i) {
    if (i === arr.length) { result.push(arr.join('')); return; }
    bt(i + 1);
    if (arr[i].match(/[a-zA-Z]/)) {
      arr[i] = arr[i] === arr[i].toLowerCase() ? arr[i].toUpperCase() : arr[i].toLowerCase();
      bt(i + 1);
      arr[i] = arr[i] === arr[i].toLowerCase() ? arr[i].toUpperCase() : arr[i].toLowerCase();
    }
  }
  bt(0);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * 2^n)", space: "O(n)" },
    systemDesign: "Case-variant expansion is used in fuzzy search indexes (Elasticsearch) to build case-insensitive inverted indexes without storing all variants — the same toggle-and-recurse idea powers normalisation pipelines that generate canonical forms.",
  },
  {
    id: "recursion-backtracking-10",
    title: "All Paths From Source to Target",
    difficulty: "Easy",
    tags: ["Backtracking", "Graph", "DFS"],
    statement: "Given a directed acyclic graph (DAG) of n nodes represented as an adjacency list, return all paths from node 0 to node n-1. Return the paths in any order.",
    examples: [
      { input: "graph = [[1,2],[3],[3],[]]", output: "[[0,1,3],[0,2,3]]" },
      { input: "graph = [[4,3,1],[3,2,4],[3],[4],[]]", output: "[[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]" },
    ],
    intuition: "Imagine exploring a city map: start at node 0, follow each road, and every time you reach the destination write down the full route you took.",
    approach: [
      "DFS from node 0 with a path list containing [0].",
      "At each node, if it equals n-1, push a copy of path to results.",
      "Otherwise iterate over neighbours, append, recurse, pop.",
    ],
    solution: `function allPathsSourceTarget(graph) {
  const result = [];
  const n = graph.length;
  function dfs(node, path) {
    if (node === n - 1) { result.push([...path]); return; }
    for (const nei of graph[node]) {
      path.push(nei);
      dfs(nei, path);
      path.pop();
    }
  }
  dfs(0, [0]);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(2^n * n)", space: "O(n)" },
    systemDesign: "Enumerating all DAG paths is exactly what dependency resolvers (npm, Maven) do when computing install orderings; in microservice call graphs, path enumeration is used for blast-radius analysis to see which services are reachable from a failing node.",
  },
  {
    id: "recursion-backtracking-11",
    title: "Path Sum II",
    difficulty: "Easy",
    tags: ["Backtracking", "Tree", "DFS"],
    statement: "Given the root of a binary tree and a target sum, return all root-to-leaf paths where the sum of node values equals targetSum.",
    examples: [
      { input: "root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22", output: "[[5,4,11,2],[5,8,4,5]]" },
      { input: "root = [1,2,3], targetSum = 5", output: "[]" },
    ],
    intuition: "Walk every root-to-leaf path keeping a running sum; when you reach a leaf and the total matches the target, you found a valid path — otherwise backtrack.",
    approach: [
      "DFS with current path and remaining sum.",
      "At a leaf: if remaining === node.val, push path copy.",
      "Otherwise recurse left and right subtracting node.val from remaining.",
      "Pop after each recursive call.",
    ],
    solution: `function pathSum(root, targetSum) {
  const result = [];
  function dfs(node, remaining, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right && remaining === node.val) {
      result.push([...path]);
    }
    dfs(node.left, remaining - node.val, path);
    dfs(node.right, remaining - node.val, path);
    path.pop();
  }
  dfs(root, targetSum, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n^2)", space: "O(n)" },
    systemDesign: "Tree path searches model permission-chain evaluation in RBAC trees where the system checks every ancestor path to see if a cumulative budget or capability matches; early termination when the running sum exceeds the target is the pruning that avoids full tree scans.",
  },
  {
    id: "recursion-backtracking-12",
    title: "Generate Parentheses",
    difficulty: "Medium",
    tags: ["Backtracking", "String"],
    statement: "Given n pairs of parentheses, generate all combinations of well-formed parentheses.",
    examples: [
      { input: "n = 3", output: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]" },
      { input: "n = 1", output: "[\"()\"]" },
    ],
    intuition: "Build the string left to right: you can add '(' as long as you haven't used all n, and add ')' only when there are more open brackets than close ones — like a grammar that keeps the string always valid.",
    approach: [
      "Backtrack with counts of open and close brackets used so far.",
      "If both equal n, push the current string.",
      "Add '(' if open < n.",
      "Add ')' if close < open.",
    ],
    solution: `function generateParenthesis(n) {
  const result = [];
  function bt(open, close, current) {
    if (open === n && close === n) { result.push(current); return; }
    if (open < n) bt(open + 1, close, current + '(');
    if (close < open) bt(open, close + 1, current + ')');
  }
  bt(0, 0, '');
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(4^n / sqrt(n))", space: "O(n)" },
    systemDesign: "Valid parenthesis generation is isomorphic to generating all valid XML/JSON structures with balanced tags — the same constraint-pruned backtracking is used in code formatters and template engines that produce syntactically valid output.",
  },
  {
    id: "recursion-backtracking-13",
    title: "Permutations",
    difficulty: "Medium",
    tags: ["Backtracking", "Array"],
    statement: "Given an array nums of distinct integers, return all possible permutations. You can return the answer in any order.",
    examples: [
      { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
      { input: "nums = [0,1]", output: "[[0,1],[1,0]]" },
    ],
    intuition: "Pick any element as the first item, then permute the rest — like arranging people in a line where at each position you choose who hasn't sat down yet.",
    approach: [
      "Backtrack with a 'used' boolean array and a current list.",
      "Base case: current.length === nums.length, push copy.",
      "For each i: if not used, mark used, push nums[i], recurse, pop, unmark.",
    ],
    solution: `function permute(nums) {
  const result = [];
  const used = new Array(nums.length).fill(false);
  function bt(current) {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(nums[i]);
      bt(current);
      current.pop();
      used[i] = false;
    }
  }
  bt([]);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * n!)", space: "O(n)" },
    systemDesign: "Permutation generation is used in query optimisers to explore join orderings (n-table joins have n! orderings); heuristic pruning (cost bounds) mirrors backtracking pruning to make it tractable at scale.",
  },
  {
    id: "recursion-backtracking-14",
    title: "Permutations II",
    difficulty: "Medium",
    tags: ["Backtracking", "Array"],
    statement: "Given a collection of numbers nums that might contain duplicates, return all possible unique permutations in any order.",
    examples: [
      { input: "nums = [1,1,2]", output: "[[1,1,2],[1,2,1],[2,1,1]]" },
      { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
    ],
    intuition: "Same as Permutations, but sort the array first and skip a number at a given position if it is the same as the previous number that was NOT used — this avoids generating the same permutation twice.",
    approach: [
      "Sort nums.",
      "Backtrack with used array.",
      "Skip nums[i] if i > 0 and nums[i] === nums[i-1] and !used[i-1].",
    ],
    solution: `function permuteUnique(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  const used = new Array(nums.length).fill(false);
  function bt(current) {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      current.push(nums[i]);
      bt(current);
      current.pop();
      used[i] = false;
    }
  }
  bt([]);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * n!)", space: "O(n)" },
    systemDesign: "Duplicate-pruning in permutation generation mirrors deduplication in distributed job schedulers that must avoid re-running equivalent task orderings; the 'skip if same as previous unused' rule is an O(1) guard that replaces an expensive hash-set membership check.",
  },
  {
    id: "recursion-backtracking-15",
    title: "Subsets II",
    difficulty: "Medium",
    tags: ["Backtracking", "Array"],
    statement: "Given an integer array nums that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return in any order.",
    examples: [
      { input: "nums = [1,2,2]", output: "[[],[1],[1,2],[1,2,2],[2],[2,2]]" },
      { input: "nums = [0]", output: "[[],[0]]" },
    ],
    intuition: "Sort first so duplicates are adjacent, then when choosing the next element skip any duplicate unless it is the very first one at this level — this prevents generating the same subset twice.",
    approach: [
      "Sort nums.",
      "Backtrack from start index, recording current subset at each call.",
      "In the loop, skip nums[i] if i > start and nums[i] === nums[i-1].",
    ],
    solution: `function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  function bt(start, current) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      current.push(nums[i]);
      bt(i + 1, current);
      current.pop();
    }
  }
  bt(0, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * 2^n)", space: "O(n)" },
    systemDesign: "Duplicate-aware subset generation is used in multi-dimensional analytics (OLAP cube rollups) where repeated dimension values must be collapsed before aggregation; the sort-and-skip pruning directly reduces I/O in columnar scan engines.",
  },
  {
    id: "recursion-backtracking-16",
    title: "Combination Sum",
    difficulty: "Medium",
    tags: ["Backtracking", "Array"],
    statement: "Given an array of distinct positive integers candidates and a target, return all unique combinations of candidates that sum to target. The same number may be used unlimited times. Return combinations in any order.",
    examples: [
      { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" },
      { input: "candidates = [2,3,5], target = 8", output: "[[2,2,2,2],[2,3,3],[3,5]]" },
    ],
    intuition: "Try picking each candidate and subtract it from the target — if target hits 0 you found a combo; if it goes negative stop exploring that path.",
    approach: [
      "Sort candidates (optional but helps prune).",
      "Backtrack from start index with remaining sum.",
      "Base case: remaining === 0, push copy.",
      "For each i from start: if candidates[i] > remaining break; else include and recurse with same i.",
    ],
    solution: `function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b);
  const result = [];
  function bt(start, remaining, current) {
    if (remaining === 0) { result.push([...current]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break;
      current.push(candidates[i]);
      bt(i, remaining - candidates[i], current);
      current.pop();
    }
  }
  bt(0, target, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n^(T/M)) where T=target, M=min candidate", space: "O(T/M)" },
    systemDesign: "Combination sum is the algorithmic core of change-making / budget-allocation problems in financial systems; query optimisers use similar bounded-backtracking to find index combinations that cover a query within a cost budget.",
  },
  {
    id: "recursion-backtracking-17",
    title: "Combination Sum II",
    difficulty: "Medium",
    tags: ["Backtracking", "Array"],
    statement: "Given a collection of candidate numbers (candidates) and a target, find all unique combinations where each number is used at most once. Candidates may have duplicates.",
    examples: [
      { input: "candidates = [10,1,2,7,6,1,5], target = 8", output: "[[1,1,6],[1,2,5],[1,7],[2,6]]" },
      { input: "candidates = [2,5,2,1,2], target = 5", output: "[[1,2,2],[5]]" },
    ],
    intuition: "Same as Combination Sum but each element can be used only once. Sort first, then skip duplicates at the same tree level to avoid repeated combinations.",
    approach: [
      "Sort candidates.",
      "Backtrack with start index and remaining sum.",
      "Skip candidates[i] if i > start and candidates[i] === candidates[i-1].",
      "Recurse with i+1 (not i) since each element is used once.",
    ],
    solution: `function combinationSum2(candidates, target) {
  candidates.sort((a, b) => a - b);
  const result = [];
  function bt(start, remaining, current) {
    if (remaining === 0) { result.push([...current]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break;
      if (i > start && candidates[i] === candidates[i - 1]) continue;
      current.push(candidates[i]);
      bt(i + 1, remaining - candidates[i], current);
      current.pop();
    }
  }
  bt(0, target, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(2^n)", space: "O(n)" },
    systemDesign: "The 'each item used once, duplicates ignored' constraint mirrors database DISTINCT aggregations on multi-valued attributes; skipping sorted duplicates at each level is equivalent to an index-skip-scan optimisation in B-tree lookups.",
  },
  {
    id: "recursion-backtracking-18",
    title: "Combinations",
    difficulty: "Medium",
    tags: ["Backtracking", "Math"],
    statement: "Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n]. Return the answer in any order.",
    examples: [
      { input: "n = 4, k = 2", output: "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]" },
      { input: "n = 1, k = 1", output: "[[1]]" },
    ],
    intuition: "Pick numbers in increasing order so that every valid k-length set is generated exactly once — like dealing cards from a sorted deck without repeating a hand.",
    approach: [
      "Backtrack from start=1 with current combination.",
      "If current.length === k push copy.",
      "Loop i from start to n-(k-current.length)+1 (pruning).",
    ],
    solution: `function combine(n, k) {
  const result = [];
  function bt(start, current) {
    if (current.length === k) { result.push([...current]); return; }
    const need = k - current.length;
    for (let i = start; i <= n - need + 1; i++) {
      current.push(i);
      bt(i + 1, current);
      current.pop();
    }
  }
  bt(1, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(k * C(n,k))", space: "O(k)" },
    systemDesign: "Combinations model all possible composite index selections for a table with n columns — a DBA's task of choosing the best k-column index is a constraint-pruned combination search, exactly as implemented here.",
  },
  {
    id: "recursion-backtracking-19",
    title: "Combination Sum III",
    difficulty: "Medium",
    tags: ["Backtracking", "Array"],
    statement: "Find all valid combinations of k numbers that sum to n such that only numbers 1–9 are used and each combination uses each number at most once. Return all valid combinations.",
    examples: [
      { input: "k = 3, n = 7", output: "[[1,2,4]]" },
      { input: "k = 3, n = 9", output: "[[1,2,6],[1,3,5],[2,3,4]]" },
    ],
    intuition: "Pick k distinct digits (1-9) that add up to n — just walk through 1 to 9 in order, include or skip each digit, stop early when sum exceeds n.",
    approach: [
      "Backtrack from start=1, tracking count and remaining sum.",
      "If count===k and remaining===0 push copy.",
      "If count===k or remaining<=0 return.",
      "Loop i from start to 9.",
    ],
    solution: `function combinationSum3(k, n) {
  const result = [];
  function bt(start, remaining, current) {
    if (current.length === k && remaining === 0) { result.push([...current]); return; }
    if (current.length === k || remaining <= 0) return;
    for (let i = start; i <= 9; i++) {
      if (i > remaining) break;
      current.push(i);
      bt(i + 1, remaining - i, current);
      current.pop();
    }
  }
  bt(1, n, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(C(9,k))", space: "O(k)" },
    systemDesign: "Bounded combination search over a small fixed alphabet is used in PIN/OTP validation systems and in constraint-satisfying configuration generators — the fixed digit set (1-9) is analogous to a small enum domain in a database schema.",
  },
  {
    id: "recursion-backtracking-20",
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    tags: ["Backtracking", "String", "Hashing"],
    statement: "Given a string of digits 2-9, return all possible letter combinations that the number could represent on a phone keypad. Return the answer in any order.",
    examples: [
      { input: "digits = \"23\"", output: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]" },
      { input: "digits = \"\"", output: "[]" },
      { input: "digits = \"2\"", output: "[\"a\",\"b\",\"c\"]" },
    ],
    intuition: "Think of each digit as a row of letter buttons; for each position you press one button, then for the next digit you press another — every combination of one button per digit gives a word.",
    approach: [
      "Map each digit to its letters.",
      "Backtrack through digits, appending each letter in turn.",
      "Base case: index === digits.length, push current string.",
    ],
    solution: `function letterCombinations(digits) {
  if (!digits) return [];
  const map = { '2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz' };
  const result = [];
  function bt(index, current) {
    if (index === digits.length) { result.push(current); return; }
    for (const ch of map[digits[index]]) {
      bt(index + 1, current + ch);
    }
  }
  bt(0, '');
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(4^n * n)", space: "O(n)" },
    systemDesign: "Phone-to-letter mapping is the basis of T9 predictive input and auto-complete engines; the Cartesian-product backtracking here is equivalent to cross-join enumeration in query planners for multi-column fuzzy matching.",
  },
  {
    id: "recursion-backtracking-21",
    title: "Word Search",
    difficulty: "Medium",
    tags: ["Backtracking", "Matrix", "DFS"],
    statement: "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically) and a cell may not be reused.",
    examples: [
      { input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", output: "true" },
      { input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"", output: "true" },
      { input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"", output: "false" },
    ],
    intuition: "Try starting from every cell; if the first letter matches, explore neighbours in all four directions for the next letter, marking cells as visited as you go and unmarking if the path fails.",
    approach: [
      "For each cell, if it matches word[0], start DFS.",
      "In DFS: if index equals word.length return true.",
      "Mark cell as visited (e.g. set to '#'), explore 4 directions.",
      "Restore the cell, return true if any direction succeeded.",
    ],
    solution: `function exist(board, word) {
  const m = board.length, n = board[0].length;
  function dfs(r, c, idx) {
    if (idx === word.length) return true;
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[idx]) return false;
    const tmp = board[r][c];
    board[r][c] = '#';
    const found = dfs(r+1,c,idx+1) || dfs(r-1,c,idx+1) || dfs(r,c+1,idx+1) || dfs(r,c-1,idx+1);
    board[r][c] = tmp;
    return found;
  }
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (dfs(r, c, 0)) return true;
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(m * n * 4^L) where L = word length", space: "O(L)" },
    systemDesign: "Grid word search is the foundation of spatial text indexing (PostGIS, Elasticsearch geo-queries) and network-topology path finders; the in-place '#' marker replaces a visited-set, reducing memory — an important trade-off in high-throughput crawlers.",
  },
  {
    id: "recursion-backtracking-22",
    title: "Palindrome Partitioning",
    difficulty: "Medium",
    tags: ["Backtracking", "String", "Dynamic Programming"],
    statement: "Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning.",
    examples: [
      { input: "s = \"aab\"", output: "[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]" },
      { input: "s = \"a\"", output: "[[\"a\"]]" },
    ],
    intuition: "Try cutting the string at each position; if the piece up to the cut is a palindrome, include it and recurse on the rest — backtrack if you get stuck.",
    approach: [
      "Backtrack with start index and current partition.",
      "If start equals s.length push copy.",
      "For each end from start+1 to s.length, if s.slice(start,end) is palindrome include and recurse.",
    ],
    solution: `function partition(s) {
  const result = [];
  function isPalin(str) {
    let l = 0, r = str.length - 1;
    while (l < r) if (str[l++] !== str[r--]) return false;
    return true;
  }
  function bt(start, current) {
    if (start === s.length) { result.push([...current]); return; }
    for (let end = start + 1; end <= s.length; end++) {
      const part = s.slice(start, end);
      if (isPalin(part)) {
        current.push(part);
        bt(end, current);
        current.pop();
      }
    }
  }
  bt(0, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * 2^n)", space: "O(n)" },
    systemDesign: "Palindrome partitioning models substring segmentation problems in NLP tokenisers and DNA sequence analysis; pre-computing a 2D palindrome DP table to prune the backtracking mirrors how databases materialise partial aggregation results to avoid redundant computation.",
  },
  {
    id: "recursion-backtracking-23",
    title: "Restore IP Addresses",
    difficulty: "Medium",
    tags: ["Backtracking", "String"],
    statement: "Given a string s containing only digits, return all possible valid IP addresses that can be formed by inserting dots. A valid IP has four parts each in [0, 255] with no leading zeros.",
    examples: [
      { input: "s = \"25525511135\"", output: "[\"255.255.11.135\",\"255.255.111.35\"]" },
      { input: "s = \"0000\"", output: "[\"0.0.0.0\"]" },
    ],
    intuition: "Try placing a dot after 1, 2, or 3 digits; only continue if the segment is a valid octet (0-255, no leading zero) — stop as soon as you have 4 parts and have consumed all digits.",
    approach: [
      "Backtrack with start index, current parts list.",
      "If parts.length === 4 and start === s.length push joined result.",
      "Try segments of length 1, 2, 3 from start.",
      "Validate: no leading zero, numeric value <= 255.",
    ],
    solution: `function restoreIpAddresses(s) {
  const result = [];
  function bt(start, parts) {
    if (parts.length === 4) {
      if (start === s.length) result.push(parts.join('.'));
      return;
    }
    for (let len = 1; len <= 3; len++) {
      if (start + len > s.length) break;
      const seg = s.slice(start, start + len);
      if (seg.length > 1 && seg[0] === '0') break;
      if (Number(seg) > 255) break;
      parts.push(seg);
      bt(start + len, parts);
      parts.pop();
    }
  }
  bt(0, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(1) — bounded by constant 3^4 paths", space: "O(1)" },
    systemDesign: "IP address parsing is a real-world validator in network configuration management tools and cloud-provisioning APIs; the bounded backtracking approach is the same technique used in parsers for fixed-format strings (dates, credit-card numbers) where each segment has a known max length.",
  },
  {
    id: "recursion-backtracking-24",
    title: "Rat in a Maze",
    difficulty: "Medium",
    tags: ["Backtracking", "Matrix", "DFS"],
    statement: "Given an n x n binary matrix maze where 1 = open and 0 = blocked, find all paths a rat can take from the top-left (0,0) to the bottom-right (n-1,n-1) moving only Down, Left, Right, or Up. Return sorted path strings.",
    examples: [
      { input: "maze = [[1,0,0,0],[1,1,0,1],[1,1,0,0],[0,1,1,1]]", output: "[\"DDRDRR\",\"DRDDRR\"]" },
      { input: "maze = [[1,0],[1,0]]", output: "[]" },
    ],
    intuition: "Try every direction from the current cell; mark it as visited so you don't loop back, and if you reach the destination record the path — undo the visit when backtracking.",
    approach: [
      "From (0,0), try D, L, R, U in order.",
      "For each direction, check bounds, not visited, and cell is 1.",
      "Mark visited, recurse, unmark.",
      "Push path when (n-1, n-1) is reached.",
    ],
    solution: `function findPath(maze) {
  const n = maze.length;
  const result = [];
  const visited = Array.from({length: n}, () => new Array(n).fill(false));
  const dirs = [['D',1,0],['L',0,-1],['R',0,1],['U',-1,0]];
  function bt(r, c, path) {
    if (r === n-1 && c === n-1) { result.push(path); return; }
    for (const [d, dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && maze[nr][nc] === 1) {
        visited[nr][nc] = true;
        bt(nr, nc, path + d);
        visited[nr][nc] = false;
      }
    }
  }
  if (maze[0][0] === 1) { visited[0][0] = true; bt(0, 0, ''); }
  return result.sort();
}`,
    language: "javascript",
    complexity: { time: "O(4^(n^2))", space: "O(n^2)" },
    systemDesign: "Grid pathfinding with obstacles models network routing in data-centre topologies — routers use pruned DFS/BFS variants (OSPF, ECMP) to enumerate paths around failed links; the visited-cell marking is equivalent to loop-prevention in BGP route tables.",
  },
  {
    id: "recursion-backtracking-25",
    title: "Beautiful Arrangement",
    difficulty: "Medium",
    tags: ["Backtracking", "Array"],
    statement: "Suppose you have n integers labeled 1 through n. A permutation is beautiful if for every i (1-indexed), either perm[i] is divisible by i or i is divisible by perm[i]. Count how many beautiful arrangements can be constructed.",
    examples: [
      { input: "n = 2", output: "2" },
      { input: "n = 1", output: "1" },
    ],
    intuition: "Place numbers one by one from position 1 to n; at each position only try numbers that satisfy the divisibility rule — this prunes bad branches early and counts valid complete arrangements.",
    approach: [
      "Backtrack with current position and 'used' boolean array.",
      "Base case: position > n, increment count.",
      "Try each unused number; place it if it satisfies divisibility, recurse, unplace.",
    ],
    solution: `function countArrangement(n) {
  let count = 0;
  const used = new Array(n + 1).fill(false);
  function bt(pos) {
    if (pos > n) { count++; return; }
    for (let num = 1; num <= n; num++) {
      if (!used[num] && (num % pos === 0 || pos % num === 0)) {
        used[num] = true;
        bt(pos + 1);
        used[num] = false;
      }
    }
  }
  bt(1);
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(k) where k is valid arrangements", space: "O(n)" },
    systemDesign: "Constraint-filtered arrangement counting appears in job scheduling systems (tasks with hardware affinity constraints) and in compiler register allocation; the divisibility check is analogous to a compatibility predicate that prunes the search tree before deeper recursion.",
  },
  {
    id: "recursion-backtracking-26",
    title: "Gray Code",
    difficulty: "Medium",
    tags: ["Backtracking", "Bit Manipulation", "Math"],
    statement: "Given an integer n, return any valid n-bit Gray code sequence — a sequence of 2^n integers from 0 to 2^n-1 where consecutive elements differ by exactly one bit, and the sequence starts at 0.",
    examples: [
      { input: "n = 2", output: "[0,1,3,2]" },
      { input: "n = 1", output: "[0,1]" },
    ],
    intuition: "Reflect the n-1 bit code and prepend a 1 to the mirrored half — like folding a list in half and flipping one bit on all new entries.",
    approach: [
      "Start with [0].",
      "For each bit from 0 to n-1: take current list reversed, add 2^bit to each, append to list.",
    ],
    solution: `function grayCode(n) {
  const result = [0];
  for (let i = 0; i < n; i++) {
    const size = result.length;
    for (let j = size - 1; j >= 0; j--) {
      result.push(result[j] | (1 << i));
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(2^n)", space: "O(2^n)" },
    systemDesign: "Gray codes are used in rotary encoders and ADC error correction to avoid multi-bit glitches during state transitions; the same reflective construction appears in hypercube network topologies used by supercomputers and distributed systems for minimal-hop routing.",
  },
  {
    id: "recursion-backtracking-27",
    title: "Binary Watch",
    difficulty: "Medium",
    tags: ["Backtracking", "Bit Manipulation"],
    statement: "A binary watch has 4 LEDs for hours (0-11) and 6 LEDs for minutes (0-59). Given the number of LEDs that are currently on (turnedOn), return all possible times the watch could represent in 'h:mm' format.",
    examples: [
      { input: "turnedOn = 1", output: "[\"0:01\",\"0:02\",\"0:04\",\"0:08\",\"0:16\",\"0:32\",\"1:00\",\"2:00\",\"4:00\",\"8:00\"]" },
      { input: "turnedOn = 9", output: "[]" },
    ],
    intuition: "Iterate over all valid hours (0-11) and minutes (0-59); the total number of 1-bits in hour and minute combined must equal turnedOn.",
    approach: [
      "For h from 0 to 11, for m from 0 to 59.",
      "Count set bits in h and m combined.",
      "If count equals turnedOn, format and add.",
    ],
    solution: `function readBinaryWatch(turnedOn) {
  const result = [];
  const countBits = n => n.toString(2).split('').filter(c => c==='1').length;
  for (let h = 0; h < 12; h++) {
    for (let m = 0; m < 60; m++) {
      if (countBits(h) + countBits(m) === turnedOn) {
        result.push(\`\${h}:\${m < 10 ? '0' + m : m}\`);
      }
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(1) — bounded by 12*60", space: "O(1)" },
    systemDesign: "Bit-count filtering over a bounded domain maps to popcount-based partitioning used in Hamming-distance similarity search (product recommendations, DNA matching); databases like DuckDB use SIMD popcount instructions to accelerate such scans.",
  },
  {
    id: "recursion-backtracking-28",
    title: "Count Numbers with Unique Digits",
    difficulty: "Medium",
    tags: ["Backtracking", "Math", "Dynamic Programming"],
    statement: "Given an integer n, return the count of all numbers in the range [0, 10^n] that have all unique digits.",
    examples: [
      { input: "n = 2", output: "91" },
      { input: "n = 0", output: "1" },
    ],
    intuition: "For a k-digit number the first digit has 9 choices, the second 9, the third 8, etc. Sum up choices for all lengths from 0 to n.",
    approach: [
      "Base: count = 1 (for 0).",
      "For k from 1 to n: count the k-digit numbers with unique digits using the multiplication principle.",
      "For k=1: 9; for k>1: 9 * 9 * 8 * ... * (11-k).",
    ],
    solution: `function countNumbersWithUniqueDigits(n) {
  if (n === 0) return 1;
  let total = 10; // 0..9
  let unique = 9;
  let available = 9;
  for (let k = 2; k <= n; k++) {
    unique *= available;
    total += unique;
    available--;
  }
  return total;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Unique-digit counting is a combinatorics primitive used in ID-space capacity planning (how many unique license plates, coupon codes, or short URLs exist with no repeated characters) — critical for database auto-increment range allocation and token-bucket sizing.",
  },
  {
    id: "recursion-backtracking-29",
    title: "Matchsticks to Square",
    difficulty: "Medium",
    tags: ["Backtracking", "Array", "Bit Manipulation"],
    statement: "Given an integer array matchsticks, return true if you can use all matchsticks to form a square. Each matchstick must be used exactly once.",
    examples: [
      { input: "matchsticks = [1,1,2,2,2]", output: "true", explanation: "The lengths can form a 2x2 square." },
      { input: "matchsticks = [3,3,3,3,4]", output: "false" },
    ],
    intuition: "Try assigning each matchstick to one of 4 sides; backtrack if a side exceeds the target length — this is partition-to-4-equal-sums.",
    approach: [
      "Total sum must be divisible by 4.",
      "Sort descending for better pruning.",
      "Backtrack: assign each stick to one of 4 buckets, prune if bucket exceeds side length.",
    ],
    solution: `function makesquare(matchsticks) {
  const total = matchsticks.reduce((a, b) => a + b, 0);
  if (total % 4 !== 0) return false;
  const side = total / 4;
  matchsticks.sort((a, b) => b - a);
  const sides = [0, 0, 0, 0];
  function bt(index) {
    if (index === matchsticks.length) return sides.every(s => s === side);
    const seen = new Set();
    for (let i = 0; i < 4; i++) {
      if (seen.has(sides[i])) continue;
      if (sides[i] + matchsticks[index] <= side) {
        seen.add(sides[i]);
        sides[i] += matchsticks[index];
        if (bt(index + 1)) return true;
        sides[i] -= matchsticks[index];
      }
    }
    return false;
  }
  return bt(0);
}`,
    language: "javascript",
    complexity: { time: "O(4^n)", space: "O(n)" },
    systemDesign: "Partitioning workloads into equal-sized buckets mirrors load balancing across shards or service replicas; the pruning (don't try a bucket already at this size) is analogous to consistent hashing avoiding redundant probes.",
  },
  {
    id: "recursion-backtracking-30",
    title: "Partition to K Equal Sum Subsets",
    difficulty: "Medium",
    tags: ["Backtracking", "Array", "Bit Manipulation"],
    statement: "Given an integer array nums and an integer k, return true if it is possible to divide this array into k non-empty subsets whose sums are all equal.",
    examples: [
      { input: "nums = [4,3,2,3,5,2,1], k = 4", output: "true" },
      { input: "nums = [1,2,3,4], k = 3", output: "false" },
    ],
    intuition: "Try to fill k buckets each to total/k; place each number into a bucket and backtrack if it doesn't fit — skip identical buckets to avoid repeated work.",
    approach: [
      "Validate: sum divisible by k, no element > target.",
      "Sort descending for pruning.",
      "Backtrack: place nums[index] in a bucket if it fits, recurse, remove, skip duplicate bucket sizes.",
    ],
    solution: `function canPartitionKSubsets(nums, k) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % k !== 0) return false;
  const target = total / k;
  nums.sort((a, b) => b - a);
  if (nums[0] > target) return false;
  const buckets = new Array(k).fill(0);
  function bt(index) {
    if (index === nums.length) return buckets.every(b => b === target);
    const seen = new Set();
    for (let i = 0; i < k; i++) {
      if (seen.has(buckets[i])) continue;
      if (buckets[i] + nums[index] <= target) {
        seen.add(buckets[i]);
        buckets[i] += nums[index];
        if (bt(index + 1)) return true;
        buckets[i] -= nums[index];
      }
    }
    return false;
  }
  return bt(0);
}`,
    language: "javascript",
    complexity: { time: "O(k * 2^n)", space: "O(n)" },
    systemDesign: "Equal-sum partitioning models balanced data-shard assignment and MapReduce task splitting; the pruning of identical buckets is the same optimisation used in shard-rebalancing algorithms to avoid evaluating symmetric assignments.",
  },
  {
    id: "recursion-backtracking-31",
    title: "Additive Number",
    difficulty: "Medium",
    tags: ["Backtracking", "String", "Math"],
    statement: "Given a string num containing only digits, return true if it is an additive number — a string where you can split it into a sequence of three or more numbers where each subsequent number is the sum of the previous two.",
    examples: [
      { input: "num = \"112358\"", output: "true", explanation: "1+1=2, 1+2=3, 2+3=5, 3+5=8." },
      { input: "num = \"199100199\"", output: "true", explanation: "1+99=100, 99+100=199." },
    ],
    intuition: "Fix the first two numbers by trying all split positions; then verify the rest of the string follows the Fibonacci-like sum rule — backtrack on invalid choices.",
    approach: [
      "Enumerate splits for first and second numbers (no leading zeros, second number can't be longer than half remaining).",
      "Verify: compute sum of first two, check if num starts with that sum, repeat.",
    ],
    solution: `function isAdditiveNumber(num) {
  function verify(first, second, rest) {
    if (!rest) return true;
    const sum = (BigInt(first) + BigInt(second)).toString();
    if (!rest.startsWith(sum)) return false;
    return verify(second, sum, rest.slice(sum.length));
  }
  const n = num.length;
  for (let i = 1; i <= Math.floor(n / 2); i++) {
    for (let j = i + 1; j < n; j++) {
      const first = num.slice(0, i);
      const second = num.slice(i, j);
      if ((first.length > 1 && first[0] === '0') || (second.length > 1 && second[0] === '0')) continue;
      if (verify(first, second, num.slice(j))) return true;
    }
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(n^3)", space: "O(n)" },
    systemDesign: "Additive sequence verification models checksum-chain validation in blockchain and audit-log integrity systems; the recursive verify function is equivalent to a streaming validator in an append-only ledger that checks each new entry against the last two.",
  },
  {
    id: "recursion-backtracking-32",
    title: "Unique Paths III",
    difficulty: "Hard",
    tags: ["Backtracking", "Matrix", "DFS"],
    statement: "Given an m x n grid where 0=empty, 1=start, 2=end, -1=obstacle, return the number of paths from start to end that walk over every non-obstacle cell exactly once.",
    examples: [
      { input: "grid = [[1,0,0,0],[0,0,0,0],[0,0,2,-1]]", output: "2" },
      { input: "grid = [[1,0,0],[0,0,0],[0,0,2]]", output: "4" },
    ],
    intuition: "DFS from the start cell, mark visited cells, and count complete paths that reach the end only after visiting all empty cells.",
    approach: [
      "Find start position and count total non-obstacle cells.",
      "DFS: mark cell visited, recurse in 4 directions, unmark.",
      "At end cell: count path only if all non-obstacle cells were visited (steps === total-1).",
    ],
    solution: `function uniquePathsIII(grid) {
  const m = grid.length, n = grid[0].length;
  let startR, startC, total = 0;
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) {
      if (grid[r][c] !== -1) total++;
      if (grid[r][c] === 1) { startR = r; startC = c; }
    }
  let count = 0;
  function dfs(r, c, steps) {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === -1) return;
    if (grid[r][c] === 2) { if (steps === total - 1) count++; return; }
    const tmp = grid[r][c];
    grid[r][c] = -1;
    dfs(r+1,c,steps+1); dfs(r-1,c,steps+1);
    dfs(r,c+1,steps+1); dfs(r,c-1,steps+1);
    grid[r][c] = tmp;
  }
  dfs(startR, startC, 0);
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(4^(m*n))", space: "O(m*n)" },
    systemDesign: "Hamiltonian-path counting on a grid models chip routing in PCB design and cable routing in data-centres where all ports must be connected with no loops; the obstacle pruning mirrors constraint propagation in constraint-satisfaction solvers used by EDA tools.",
  },
  {
    id: "recursion-backtracking-33",
    title: "Sudoku Solver",
    difficulty: "Hard",
    tags: ["Backtracking", "Matrix", "Constraint Satisfaction"],
    statement: "Write a program to solve a Sudoku puzzle by filling in the empty cells. A valid solution means every row, column, and 3x3 box contains digits 1-9 with no repetition. The puzzle has a unique solution.",
    examples: [
      { input: "board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]", output: "solved board" },
    ],
    intuition: "For each empty cell, try digits 1-9; if the digit is valid (not in same row, col, or box), place it and recurse — undo it and try the next if the recursion fails.",
    approach: [
      "Find the next empty cell.",
      "Try digits 1-9; check row, column, 3x3 box for conflicts.",
      "Place valid digit, recurse, return true if solved.",
      "Otherwise remove digit and try next.",
    ],
    solution: `function solveSudoku(board) {
  function isValid(r, c, ch) {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === ch) return false;
      if (board[i][c] === ch) return false;
      const br = 3 * Math.floor(r / 3) + Math.floor(i / 3);
      const bc = 3 * Math.floor(c / 3) + (i % 3);
      if (board[br][bc] === ch) return false;
    }
    return true;
  }
  function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === '.') {
          for (let d = 1; d <= 9; d++) {
            const ch = String(d);
            if (isValid(r, c, ch)) {
              board[r][c] = ch;
              if (solve()) return true;
              board[r][c] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  solve();
}`,
    language: "javascript",
    complexity: { time: "O(9^m) where m = empty cells", space: "O(1)" },
    systemDesign: "Sudoku is a canonical constraint-satisfaction problem (CSP); the same backtracking-with-propagation engine powers VLSI place-and-route tools, airline crew scheduling, and database constraint checkers — production solvers add arc-consistency (AC-3) as a pruning layer to eliminate infeasible values before recursion.",
  },
  {
    id: "recursion-backtracking-34",
    title: "N-Queens",
    difficulty: "Hard",
    tags: ["Backtracking", "Matrix"],
    statement: "Given an integer n, return all distinct solutions to the n-queens puzzle. Each solution contains a distinct board configuration where n queens are placed such that no two queens attack each other.",
    examples: [
      { input: "n = 4", output: "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"]]", explanation: "Two distinct solutions." },
      { input: "n = 1", output: "[[\"Q\"]]" },
    ],
    intuition: "Place one queen per row; for each column in the current row, try placing a queen there only if no previous queen can attack it (same column, or same diagonal).",
    approach: [
      "Backtrack row by row with sets tracking used columns, diagonals, anti-diagonals.",
      "Place queen at (row, col) if column and both diagonals are free.",
      "On completing all rows, build and push the board string.",
    ],
    solution: `function solveNQueens(n) {
  const result = [];
  const cols = new Set(), diag1 = new Set(), diag2 = new Set();
  const board = Array.from({length: n}, () => Array(n).fill('.'));
  function bt(row) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
      cols.add(col); diag1.add(row - col); diag2.add(row + col);
      board[row][col] = 'Q';
      bt(row + 1);
      board[row][col] = '.';
      cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);
    }
  }
  bt(0);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n!)", space: "O(n)" },
    systemDesign: "N-Queens is a model problem for resource conflict scheduling — placing jobs on machines so no two share a resource mirrors queen placement; data-centre rack allocation tools use constraint-propagation backtracking to satisfy power/cooling constraints simultaneously.",
  },
  {
    id: "recursion-backtracking-35",
    title: "N-Queens II",
    difficulty: "Hard",
    tags: ["Backtracking", "Matrix"],
    statement: "Given an integer n, return the number of distinct solutions to the n-queens puzzle (count only, not the boards themselves).",
    examples: [
      { input: "n = 4", output: "2" },
      { input: "n = 1", output: "1" },
    ],
    intuition: "Same as N-Queens but just increment a counter when a valid board is found — no need to build the board string.",
    approach: [
      "Backtrack row by row tracking columns and diagonals.",
      "Increment count when row === n.",
    ],
    solution: `function totalNQueens(n) {
  let count = 0;
  const cols = new Set(), diag1 = new Set(), diag2 = new Set();
  function bt(row) {
    if (row === n) { count++; return; }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
      cols.add(col); diag1.add(row - col); diag2.add(row + col);
      bt(row + 1);
      cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);
    }
  }
  bt(0);
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n!)", space: "O(n)" },
    systemDesign: "Counting feasible configurations without enumerating them fully is used in combinatorial capacity planning — estimating the number of valid server placements before running the full search allows systems to decide whether brute-force or heuristic search is appropriate.",
  },
  {
    id: "recursion-backtracking-36",
    title: "Word Break II",
    difficulty: "Hard",
    tags: ["Backtracking", "Dynamic Programming", "String", "Memoization"],
    statement: "Given a string s and a dictionary of strings wordDict, add spaces in s to construct all sentences where each word is a valid dictionary word. Return all such possible sentences.",
    examples: [
      { input: "s = \"catsanddog\", wordDict = [\"cat\",\"cats\",\"and\",\"sand\",\"dog\"]", output: "[\"cats and dog\",\"cat sand dog\"]" },
      { input: "s = \"pineapplepenapple\", wordDict = [\"apple\",\"pen\",\"applepen\",\"pine\",\"pineapple\"]", output: "[\"pine apple pen apple\",\"pineapple pen apple\",\"pine applepen apple\"]" },
    ],
    intuition: "Try every prefix of the remaining string; if it is a dictionary word, recurse on the suffix — memoize results for each suffix position to avoid recomputing.",
    approach: [
      "Build a Set from wordDict.",
      "Memoised backtracking: for each start, try prefixes in wordDict.",
      "Recurse on suffix, prepend current word to each result.",
    ],
    solution: `function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const memo = new Map();
  function bt(start) {
    if (memo.has(start)) return memo.get(start);
    if (start === s.length) return [''];
    const results = [];
    for (let end = start + 1; end <= s.length; end++) {
      const word = s.slice(start, end);
      if (wordSet.has(word)) {
        const suffixes = bt(end);
        for (const suf of suffixes) {
          results.push(suf === '' ? word : word + ' ' + suf);
        }
      }
    }
    memo.set(start, results);
    return results;
  }
  return bt(0);
}`,
    language: "javascript",
    complexity: { time: "O(n^3 + n * W) where W = output size", space: "O(n^2)" },
    systemDesign: "Word-break is structurally identical to query tokenisation in full-text search engines (splitting a query string into dictionary terms) and NLP sentence segmentation; memoisation of suffix results mirrors the DP tables used in Viterbi decoders for speech recognition.",
  },
  {
    id: "recursion-backtracking-37",
    title: "Expression Add Operators",
    difficulty: "Hard",
    tags: ["Backtracking", "String", "Math"],
    statement: "Given a string num of digits and an integer target, return all possibilities of adding binary operators '+', '-', or '*' between the digits so that the resulting expression evaluates to target.",
    examples: [
      { input: "num = \"123\", target = 6", output: "[\"1*2*3\",\"1+2+3\"]" },
      { input: "num = \"232\", target = 8", output: "[\"2*3+2\",\"2+3*2\"]" },
    ],
    intuition: "Build the expression digit by digit, trying each operator; track the last operand separately so multiplication can be handled correctly by undoing the last addition and applying precedence.",
    approach: [
      "Backtrack with position, current expression string, running eval value, and last multiplied term.",
      "At each position, try each digit length (no leading zeros).",
      "Apply +, -, * adjusting eval and lastMult accordingly.",
    ],
    solution: `function addOperators(num, target) {
  const result = [];
  function bt(index, path, eval_, lastMult) {
    if (index === num.length) {
      if (eval_ === target) result.push(path);
      return;
    }
    for (let len = 1; len <= num.length - index; len++) {
      const str = num.slice(index, index + len);
      if (str.length > 1 && str[0] === '0') break;
      const cur = Number(str);
      if (index === 0) {
        bt(len, str, cur, cur);
      } else {
        bt(index + len, path + '+' + str, eval_ + cur, cur);
        bt(index + len, path + '-' + str, eval_ - cur, -cur);
        bt(index + len, path + '*' + str, eval_ - lastMult + lastMult * cur, lastMult * cur);
      }
    }
  }
  bt(0, '', 0, 0);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * 4^n)", space: "O(n)" },
    systemDesign: "Expression synthesis is used in automated query generation (building SQL expressions from tokens) and in symbolic regression systems that search for mathematical formulas fitting data; operator precedence handling via lastMult is analogous to operator pushdown in query plan trees.",
  },
  {
    id: "recursion-backtracking-38",
    title: "Remove Invalid Parentheses",
    difficulty: "Hard",
    tags: ["Backtracking", "BFS", "String"],
    statement: "Given a string s with parentheses and letters, remove the minimum number of invalid parentheses to make it valid. Return all unique results.",
    examples: [
      { input: "s = \"()())()\"", output: "[\"(())()\",\"()()()\"]" },
      { input: "s = \"(a)())()\"", output: "[\"(a())()\",\"(a)()()\"]" },
      { input: "s = \")( \"", output: "[\"\"]" },
    ],
    intuition: "First count how many '(' and ')' need to be removed; then backtrack through the string deciding to keep or remove each bracket, pruning when counts go negative.",
    approach: [
      "Count mismatched left and right brackets.",
      "Backtrack: at each position either keep the char or remove it (if it's a bracket and we still have removals left).",
      "Validate the final string and push unique results.",
    ],
    solution: `function removeInvalidParentheses(s) {
  let leftRem = 0, rightRem = 0;
  for (const c of s) {
    if (c === '(') leftRem++;
    else if (c === ')') {
      if (leftRem > 0) leftRem--;
      else rightRem++;
    }
  }
  const result = new Set();
  function isValid(str) {
    let cnt = 0;
    for (const c of str) {
      if (c === '(') cnt++;
      else if (c === ')') if (--cnt < 0) return false;
    }
    return cnt === 0;
  }
  function bt(index, leftRem, rightRem, open, current) {
    if (index === s.length) {
      if (leftRem === 0 && rightRem === 0) result.add(current);
      return;
    }
    const ch = s[index];
    if (ch === '(' && leftRem > 0) bt(index+1, leftRem-1, rightRem, open, current);
    if (ch === ')' && rightRem > 0) bt(index+1, leftRem, rightRem-1, open, current);
    current += ch;
    if (ch !== '(' && ch !== ')') {
      bt(index+1, leftRem, rightRem, open, current);
    } else if (ch === '(') {
      bt(index+1, leftRem, rightRem, open+1, current);
    } else if (open > 0) {
      bt(index+1, leftRem, rightRem, open-1, current);
    }
  }
  bt(0, leftRem, rightRem, 0, '');
  return [...result];
}`,
    language: "javascript",
    complexity: { time: "O(2^n)", space: "O(n)" },
    systemDesign: "Minimum-edit validation is used in schema migration validators and configuration linters that must find the smallest set of changes to make a config file syntactically valid — the removal count acts as a budget constraint identical to edit-distance-bounded search.",
  },
  {
    id: "recursion-backtracking-39",
    title: "Splitting a String Into Descending Consecutive Values",
    difficulty: "Hard",
    tags: ["Backtracking", "String", "Math"],
    statement: "Given a string s that consists of only digits, return true if it is possible to split s into three or more parts such that the parts form a sequence of decreasing consecutive integers and each part has no leading zeros.",
    examples: [
      { input: "s = \"050043\"", output: "true", explanation: "5, 4, 3 is a descending consecutive sequence." },
      { input: "s = \"9080701\"", output: "false" },
    ],
    intuition: "Fix the first number, then check if the rest of the string can form a descending sequence where each number is exactly one less than the previous.",
    approach: [
      "Try each prefix as the first number.",
      "Recurse: check if next part equals prev-1, advance through string.",
      "Valid if string is fully consumed and at least 3 parts total.",
    ],
    solution: `function splitString(s) {
  function bt(index, prev, count) {
    if (index === s.length) return count >= 3;
    let cur = BigInt(0);
    for (let i = index; i < s.length; i++) {
      cur = cur * 10n + BigInt(s[i]);
      if (cur > prev) break;
      if (cur === prev - 1n || count === 0) {
        if (bt(i + 1, cur, count + 1)) return true;
      }
    }
    return false;
  }
  return bt(0, BigInt(0), 0);
}`,
    language: "javascript",
    complexity: { time: "O(n^2)", space: "O(n)" },
    systemDesign: "Descending sequence validation models version-chain integrity checks in database migration systems (versions must decrease monotonically) and in time-series anomaly detectors that verify data arrives in strict order.",
  },
  {
    id: "recursion-backtracking-40",
    title: "Word Squares",
    difficulty: "Hard",
    tags: ["Backtracking", "Trie", "String"],
    statement: "Given a set of unique words, return all the word squares you can build. A word square is a sequence of words where the kth row and kth column read the same string.",
    examples: [
      { input: "words = [\"area\",\"lead\",\"wall\",\"lady\",\"ball\"]", output: "[[\"wall\",\"area\",\"lead\",\"lady\"],[\"ball\",\"area\",\"lead\",\"lady\"]]" },
      { input: "words = [\"abat\",\"baba\",\"atan\",\"atal\"]", output: "[[\"abat\",\"baba\",\"atan\",\"atal\"]]" },
    ],
    intuition: "Build the square row by row; each new row's prefix is determined by reading the current column, so only words matching that prefix can be placed — use a prefix map for fast lookup.",
    approach: [
      "Build a prefix -> words map.",
      "Backtrack: at each row, determine the required prefix from the column and try all matching words.",
      "Push completed squares.",
    ],
    solution: `function wordSquares(words) {
  const n = words[0].length;
  const prefixMap = new Map();
  for (const word of words) {
    for (let i = 0; i <= word.length; i++) {
      const pref = word.slice(0, i);
      if (!prefixMap.has(pref)) prefixMap.set(pref, []);
      prefixMap.get(pref).push(word);
    }
  }
  const result = [];
  function bt(square) {
    if (square.length === n) { result.push([...square]); return; }
    const row = square.length;
    let prefix = '';
    for (let r = 0; r < row; r++) prefix += square[r][row];
    for (const word of (prefixMap.get(prefix) || [])) {
      square.push(word);
      bt(square);
      square.pop();
    }
  }
  for (const word of words) bt([word]);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * 26^n)", space: "O(n^2 * W)" },
    systemDesign: "Prefix-pruned constraint search over a dictionary mirrors trie-based autocomplete in search boxes and prefix-indexed column lookups in databases; the prefix constraint at each step is equivalent to an index seek rather than a full scan, reducing the search space exponentially.",
  },
  {
    id: "recursion-backtracking-41",
    title: "The Knight's Tour",
    difficulty: "Hard",
    tags: ["Backtracking", "Matrix", "Graph"],
    statement: "Given an n x n chessboard, find a sequence of knight moves such that the knight visits every cell exactly once starting from position (0,0). Return the board with each cell marked by the move number, or an empty array if no tour exists.",
    examples: [
      { input: "n = 5", output: "a valid 5x5 knight's tour board" },
      { input: "n = 1", output: "[[0]]" },
    ],
    intuition: "Move the knight to every unvisited cell, backtracking if you get stuck — Warnsdorff's heuristic (pick the cell with fewest onward moves first) prunes the search dramatically.",
    approach: [
      "Start at (0,0), mark with move 0.",
      "At each step try all 8 knight moves sorted by Warnsdorff's count.",
      "Recurse; if all n^2 cells are filled return true, else unmark and try next.",
    ],
    solution: `function knightTour(n) {
  const moves = [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];
  const board = Array.from({length: n}, () => new Array(n).fill(-1));
  board[0][0] = 0;
  function degree(r, c) {
    let cnt = 0;
    for (const [dr, dc] of moves) {
      const nr = r+dr, nc = c+dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && board[nr][nc] === -1) cnt++;
    }
    return cnt;
  }
  function bt(r, c, step) {
    if (step === n * n) return true;
    const nexts = [];
    for (const [dr, dc] of moves) {
      const nr = r+dr, nc = c+dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && board[nr][nc] === -1)
        nexts.push([degree(nr,nc), nr, nc]);
    }
    nexts.sort((a, b) => a[0] - b[0]);
    for (const [, nr, nc] of nexts) {
      board[nr][nc] = step;
      if (bt(nr, nc, step + 1)) return true;
      board[nr][nc] = -1;
    }
    return false;
  }
  return bt(0, 0, 1) ? board : [];
}`,
    language: "javascript",
    complexity: { time: "O(8^(n^2)) without heuristic, near O(n^2) with Warnsdorff", space: "O(n^2)" },
    systemDesign: "The knight's tour is a Hamiltonian path problem; its heuristic (minimum-degree ordering) is directly analogous to the variable-ordering heuristics (MRV, LCV) in constraint-satisfaction engines used by ERP schedulers and network topology configurators to find feasible assignments quickly.",
  },
  {
    id: "recursion-backtracking-42",
    title: "Factor Combinations",
    difficulty: "Hard",
    tags: ["Backtracking", "Math"],
    statement: "Numbers can be regarded as the product of their factors. Given an integer n, return all possible combinations of its factors. Each factor must be >= 2 and < n, and n itself is not in the combination.",
    examples: [
      { input: "n = 12", output: "[[2,6],[2,2,3],[3,4]]" },
      { input: "n = 37", output: "[]" },
      { input: "n = 32", output: "[[2,16],[2,2,8],[2,2,2,4],[2,2,2,2,2],[2,4,4],[4,8]]" },
    ],
    intuition: "Try each divisor of n from 2 upward; if it divides n, include it and recurse on n/divisor — to avoid duplicates, only allow factors >= the last factor used.",
    approach: [
      "Backtrack with remaining value and start factor.",
      "For each factor f from start to sqrt(remaining): if remaining % f === 0, include f and recurse with remaining/f.",
      "At the end if remaining > 1 add it as the last factor.",
    ],
    solution: `function getFactors(n) {
  const result = [];
  function bt(remaining, start, current) {
    if (current.length > 0) {
      result.push([...current, remaining]);
    }
    for (let f = start; f * f <= remaining; f++) {
      if (remaining % f === 0) {
        current.push(f);
        bt(remaining / f, f, current);
        current.pop();
      }
    }
  }
  bt(n, 2, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(log n)" },
    systemDesign: "Factor decomposition models dependency graph analysis in build systems (Maven, Gradle) that factorise transitive dependencies and in compiler loop-tiling optimisations that factor array dimensions for cache efficiency.",
  },
  {
    id: "recursion-backtracking-43",
    title: "Concatenated Words",
    difficulty: "Hard",
    tags: ["Backtracking", "Dynamic Programming", "Trie", "String"],
    statement: "Given an array of strings words, return all words that can be formed by concatenating two or more shorter words from the same list.",
    examples: [
      { input: "words = [\"cat\",\"cats\",\"catsdogcats\",\"dog\",\"dogcatsdog\",\"hippopotamuses\",\"rat\",\"ratcatdogcat\"]", output: "[\"catsdogcats\",\"dogcatsdog\",\"ratcatdogcat\"]" },
      { input: "words = [\"cat\",\"dog\",\"catdog\"]", output: "[\"catdog\"]" },
    ],
    intuition: "For each word, check if it can be broken into two or more words from the set — exactly word-break, but requiring at least two pieces.",
    approach: [
      "Build a Set of all words.",
      "For each word, run a word-break DP requiring count >= 2.",
      "Collect words that satisfy the condition.",
    ],
    solution: `function findAllConcatenatedWordsInADict(words) {
  const wordSet = new Set(words);
  function canForm(word) {
    if (word.length === 0) return false;
    const dp = new Array(word.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= word.length; i++) {
      for (let j = 0; j < i; j++) {
        if (!dp[j]) continue;
        const sub = word.slice(j, i);
        if (sub !== word && wordSet.has(sub)) { dp[i] = true; break; }
      }
    }
    return dp[word.length];
  }
  return words.filter(w => canForm(w));
}`,
    language: "javascript",
    complexity: { time: "O(n * L^2) where L = max word length", space: "O(n * L)" },
    systemDesign: "Concatenated-word detection is used in tokeniser dictionaries for NLP pipelines and in URL routing engines that detect compound route segments; DP word-break replacing backtracking avoids exponential blowup at scale, analogous to query-plan memoisation.",
  },
  {
    id: "recursion-backtracking-44",
    title: "Maximum Length of a Concatenated String with Unique Characters",
    difficulty: "Hard",
    tags: ["Backtracking", "Bit Manipulation", "String"],
    statement: "Given an array of strings arr, return the maximum length of a concatenation of a subsequence of arr such that the concatenated string has all unique characters.",
    examples: [
      { input: "arr = [\"un\",\"iq\",\"ue\"]", output: "4", explanation: "\"uniq\" or \"ique\" both have 4 unique characters." },
      { input: "arr = [\"cha\",\"r\",\"act\",\"ers\"]", output: "6" },
    ],
    intuition: "Try including or excluding each string; use bitmasks to quickly check if characters overlap — keep track of the current character set and maximise the total length.",
    approach: [
      "For each string precompute a bitmask; skip strings with duplicate characters.",
      "Backtrack: include or exclude each string, update mask, track max length.",
    ],
    solution: `function maxLength(arr) {
  const masks = [];
  for (const s of arr) {
    let mask = 0, valid = true;
    for (const c of s) {
      const bit = 1 << (c.charCodeAt(0) - 97);
      if (mask & bit) { valid = false; break; }
      mask |= bit;
    }
    if (valid) masks.push([mask, s.length]);
  }
  let best = 0;
  function bt(index, curMask, curLen) {
    best = Math.max(best, curLen);
    for (let i = index; i < masks.length; i++) {
      const [m, l] = masks[i];
      if ((curMask & m) === 0) bt(i + 1, curMask | m, curLen + l);
    }
  }
  bt(0, 0, 0);
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(2^n)", space: "O(n)" },
    systemDesign: "Bitmask-encoded character sets are used in columnar compression schemes (dictionary encoding) and in query engines for fast set-intersection checks; the non-overlap pruning (bitwise AND === 0) mirrors bloom-filter based join pruning in distributed query engines.",
  },
  {
    id: "recursion-backtracking-45",
    title: "Find Unique Binary String",
    difficulty: "Hard",
    tags: ["Backtracking", "Bit Manipulation", "String"],
    statement: "Given an array of n unique binary strings, each of length n, return a binary string of length n that does not appear in the array. If multiple answers exist, return any.",
    examples: [
      { input: "nums = [\"01\",\"10\"]", output: "\"11\"" },
      { input: "nums = [\"00\",\"01\"]", output: "\"10\"" },
    ],
    intuition: "Use Cantor's diagonal argument: pick the opposite of the ith character of the ith string — this new string differs from every string in the array in at least one position.",
    approach: [
      "For each index i from 0 to n-1, pick the bit opposite to nums[i][i].",
      "Concatenate these bits — the result is guaranteed absent from nums.",
    ],
    solution: `function findDifferentBinaryString(nums) {
  return nums.map((s, i) => s[i] === '0' ? '1' : '0').join('');
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Cantor diagonalisation underpins theoretical proofs of uncountability and is used practically in session-ID generators that must guarantee uniqueness against a known set; in distributed systems, diagonalisation-style conflict resolution avoids hashing collisions without a central coordinator.",
  },
  {
    id: "recursion-backtracking-46",
    title: "Decode Ways II",
    difficulty: "Hard",
    tags: ["Recursion", "Dynamic Programming", "String", "Memoization"],
    statement: "A message containing uppercase letters has been encoded with a mapping '1'->'A', ..., '26'->'Z'. '*' can represent any digit 1-9. Given an encoded string s, return the number of ways to decode it. Return the answer modulo 10^9+7.",
    examples: [
      { input: "s = \"*\"", output: "9" },
      { input: "s = \"1*\"", output: "18" },
      { input: "s = \"2*\"", output: "15" },
    ],
    intuition: "At each position decide to decode one character or two; '*' multiplies possibilities — use memoisation to avoid recomputing the same suffix.",
    approach: [
      "Memoised recursion from index 0.",
      "One-char decode: '*' gives 9 ways, else 1 way if not '0'.",
      "Two-char decode: handle all combinations of '*' and digit pairs within 10-26.",
    ],
    solution: `function numDecodings(s) {
  const MOD = 1000000007n;
  const memo = new Map();
  function dp(i) {
    if (i === s.length) return 1n;
    if (memo.has(i)) return memo.get(i);
    let ways = 0n;
    if (s[i] !== '0') {
      ways += (s[i] === '*' ? 9n : 1n) * dp(i + 1);
    }
    if (i + 1 < s.length) {
      const a = s[i], b = s[i + 1];
      if (a === '*' && b === '*') ways += 15n * dp(i + 2);
      else if (a === '*') ways += (b <= '6' ? 2n : 1n) * dp(i + 2);
      else if (b === '*') {
        if (a === '1') ways += 9n * dp(i + 2);
        else if (a === '2') ways += 6n * dp(i + 2);
      } else {
        const num = Number(a + b);
        if (num >= 10 && num <= 26) ways += dp(i + 2);
      }
    }
    ways %= MOD;
    memo.set(i, ways);
    return ways;
  }
  return Number(dp(0));
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Wildcard-expansion counting mirrors regex cardinality estimation in query optimisers and in SMS/MMS gateway message-routing systems where '*' wildcards in destination patterns must be expanded efficiently; memoisation makes it linear rather than exponential.",
  },
  {
    id: "recursion-backtracking-47",
    title: "Zuma Game",
    difficulty: "Hard",
    tags: ["Recursion", "Memoization", "String", "Dynamic Programming"],
    statement: "You have a hand of colored balls and a row board of colored balls. Insert balls from hand to board to remove all board balls with minimum insertions. Groups of 3+ same-colored adjacent balls are removed instantly. Return minimum insertions or -1 if impossible.",
    examples: [
      { input: "board = \"WRRBBW\", hand = \"RRB\"", output: "2" },
      { input: "board = \"RBYYBBRRB\", hand = \"YRBGB\"", output: "3" },
    ],
    intuition: "Try inserting each ball from hand at each position in the board; after each insertion remove groups of 3+, then recurse with the reduced board — memoize (board, handState) pairs.",
    approach: [
      "Use DFS with memoization on (board, hand sorted).",
      "At each position, try inserting a hand ball that matches the current group.",
      "Remove consecutive groups, recurse, track minimum.",
    ],
    solution: `function findMinStep(board, hand) {
  const memo = new Map();
  function removeConsecutive(s) {
    let changed = true;
    while (changed) {
      changed = false;
      let i = 0;
      while (i < s.length) {
        let j = i;
        while (j < s.length && s[j] === s[i]) j++;
        if (j - i >= 3) { s = s.slice(0, i) + s.slice(j); changed = true; break; }
        i = j;
      }
    }
    return s;
  }
  function dfs(board, hand) {
    if (board === '') return 0;
    const key = board + '#' + hand.split('').sort().join('');
    if (memo.has(key)) return memo.get(key);
    let res = Infinity;
    let i = 0;
    while (i < board.length) {
      let j = i;
      while (j < board.length && board[j] === board[i]) j++;
      const needed = 3 - (j - i);
      let newHand = hand;
      let ok = true;
      for (let k = 0; k < needed; k++) {
        const idx = newHand.indexOf(board[i]);
        if (idx === -1) { ok = false; break; }
        newHand = newHand.slice(0, idx) + newHand.slice(idx + 1);
      }
      if (ok) {
        const newBoard = removeConsecutive(board.slice(0, i) + board.slice(j));
        const sub = dfs(newBoard, newHand);
        if (sub !== -1) res = Math.min(res, needed + sub);
      }
      i = j;
    }
    const ans = res === Infinity ? -1 : res;
    memo.set(key, ans);
    return ans;
  }
  return dfs(board, hand);
}`,
    language: "javascript",
    complexity: { time: "O(board^2 * hand! / memo)", space: "O(board * hand)" },
    systemDesign: "The Zuma game models cascading rule engines in event-driven architectures — inserting an event that triggers further events (like chain reactions in saga patterns); memoizing intermediate board states is equivalent to caching intermediate workflow states to avoid replaying event chains.",
  },
  {
    id: "recursion-backtracking-48",
    title: "Brace Expansion II",
    difficulty: "Hard",
    tags: ["Backtracking", "String", "Set"],
    statement: "Given a string expression representing a nested brace expansion, return the list of strings the expression generates in sorted order. '{}' generates unions, concatenation is implicit, e.g. '{a,b}{c,d}' = {ac,ad,bc,bd}.",
    examples: [
      { input: "expression = \"{a,b}{c,{d,e}}\"", output: "[\"ac\",\"ad\",\"ae\",\"bc\",\"bd\",\"be\"]" },
      { input: "expression = \"{{a,z},a{b,c},{ab,z}}\"", output: "[\"a\",\"ab\",\"ac\",\"z\"]" },
    ],
    intuition: "Parse the expression recursively: a group '{...}' produces a union of its comma-separated parts; concatenation at the top level produces Cartesian products — collect results in a sorted set to deduplicate.",
    approach: [
      "Use a recursive parser with a pointer.",
      "parseGroup: parse a list of terms separated by commas, return union.",
      "parseTerm: parse consecutive atoms/groups, return their Cartesian product.",
      "parseAtom: a single letter or '{' ... '}'.",
    ],
    solution: `function braceExpansionII(expression) {
  let i = 0;
  function parseGroup() {
    let result = new Set();
    for (const s of parseTerm()) result.add(s);
    while (i < expression.length && expression[i] === ',') {
      i++;
      for (const s of parseTerm()) result.add(s);
    }
    return result;
  }
  function parseTerm() {
    let result = [''];
    while (i < expression.length && expression[i] !== '}' && expression[i] !== ',') {
      const atoms = parseAtom();
      const next = [];
      for (const pre of result) for (const suf of atoms) next.push(pre + suf);
      result = next;
    }
    return result;
  }
  function parseAtom() {
    if (expression[i] === '{') {
      i++; // skip '{'
      const group = parseGroup();
      i++; // skip '}'
      return [...group].sort();
    } else {
      return [expression[i++]];
    }
  }
  return [...parseGroup()].sort();
}`,
    language: "javascript",
    complexity: { time: "O(n * 2^n)", space: "O(2^n)" },
    systemDesign: "Brace expansion mirrors glob pattern expansion in shell scripts and in object-storage key prefix enumeration (S3/GCS wildcard listing); recursive Cartesian-product generation is how query engines expand IN-list predicates across multiple columns.",
  },
  {
    id: "recursion-backtracking-49",
    title: "Shortest Path in a Grid with Obstacles Elimination",
    difficulty: "Hard",
    tags: ["Backtracking", "BFS", "Matrix", "Dynamic Programming"],
    statement: "Given an m x n grid where 0=empty and 1=obstacle, and an integer k, return the minimum number of steps to walk from (0,0) to (m-1,n-1) while eliminating at most k obstacles. Return -1 if not possible.",
    examples: [
      { input: "grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1", output: "6" },
      { input: "grid = [[0,1,1],[1,1,1],[1,0,0]], k = 1", output: "-1" },
    ],
    intuition: "BFS layer by layer, but track both position and remaining obstacle eliminations as the state — visited is a 3D array (row, col, eliminations left).",
    approach: [
      "BFS with state (row, col, remainingK).",
      "Start at (0, 0, k), steps = 0.",
      "For each neighbor: if obstacle and remainingK > 0, enqueue with remainingK-1; if empty enqueue same remainingK.",
      "Return steps when reaching (m-1, n-1).",
    ],
    solution: `function shortestPath(grid, k) {
  const m = grid.length, n = grid[0].length;
  if (m === 1 && n === 1) return 0;
  const visited = Array.from({length: m}, () => Array.from({length: n}, () => new Array(k + 1).fill(false)));
  const queue = [[0, 0, k, 0]]; // row, col, remaining k, steps
  visited[0][0][k] = true;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (queue.length) {
    const [r, c, rem, steps] = queue.shift();
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const newRem = rem - grid[nr][nc];
      if (newRem < 0 || visited[nr][nc][newRem]) continue;
      if (nr === m - 1 && nc === n - 1) return steps + 1;
      visited[nr][nc][newRem] = true;
      queue.push([nr, nc, newRem, steps + 1]);
    }
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(m * n * k)", space: "O(m * n * k)" },
    systemDesign: "State-augmented BFS (position + budget) models network path-finding with a maximum number of allowed firewall rule overrides or VPN hop allowances; the 3D visited array is equivalent to a multi-dimensional routing table keyed on (node, remaining_credits).",
  },
  {
    id: "recursion-backtracking-50",
    title: "Cryptarithmetic Puzzle",
    difficulty: "Hard",
    tags: ["Backtracking", "Math", "Constraint Satisfaction"],
    statement: "Given a cryptarithmetic equation as three words (two addends and a sum), assign a unique digit 0-9 to each letter such that the addition is correct. Leading digits cannot be zero. Return any valid assignment as a map, or null if none exists.",
    examples: [
      { input: "word1 = \"SEND\", word2 = \"MORE\", result = \"MONEY\"", output: "{S:9,E:5,N:6,D:7,M:1,O:0,R:8,Y:2}" },
      { input: "word1 = \"AA\", word2 = \"BB\", result = \"CC\"", output: "null (no valid assignment)" },
    ],
    intuition: "Assign digits to letters one by one trying all ten digits; prune whenever a column sum already violates carry constraints — this is constraint-satisfaction backtracking over a small search space.",
    approach: [
      "Collect unique letters, identify leading letters.",
      "Backtrack: assign next digit to next letter (skip 0 for leading letters), check partial column constraints.",
      "When all letters assigned, verify the full addition.",
    ],
    solution: `function solveCryptarithmetic(word1, word2, result) {
  const letters = [...new Set((word1 + word2 + result).split(''))];
  if (letters.length > 10) return null;
  const leading = new Set([word1[0], word2[0], result[0]]);
  const assign = {};
  const usedDigits = new Set();
  function check() {
    const toNum = w => Number(w.split('').map(c => assign[c]).join(''));
    return toNum(word1) + toNum(word2) === toNum(result);
  }
  function bt(idx) {
    if (idx === letters.length) return check() ? assign : null;
    const letter = letters[idx];
    for (let d = 0; d <= 9; d++) {
      if (usedDigits.has(d)) continue;
      if (d === 0 && leading.has(letter)) continue;
      assign[letter] = d;
      usedDigits.add(d);
      const res = bt(idx + 1);
      if (res) return res;
      delete assign[letter];
      usedDigits.delete(d);
    }
    return null;
  }
  return bt(0);
}`,
    language: "javascript",
    complexity: { time: "O(10! / (10-L)!) where L = unique letters", space: "O(L)" },
    systemDesign: "Cryptarithmetic solving is a textbook constraint-satisfaction problem used to benchmark CSP engines in AI systems; the same digit-assignment backtracking with pruning models database constraint propagation during INSERT operations with CHECK constraints and UNIQUE indexes across multiple columns.",
  },
];
