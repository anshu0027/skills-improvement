import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  {
    id: "binary-search-01",
    title: "Binary Search",
    difficulty: "Easy",
    tags: ["Binary Search", "Array"],
    statement: "Given a sorted array of distinct integers and a target value, return the index of the target if it is found. Otherwise return -1. You must write an algorithm with O(log n) runtime.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists at index 4." },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist." },
    ],
    intuition: "Imagine looking up a word in a dictionary — you open to the middle, decide if you need the left or right half, and repeat. Each step cuts the remaining pages in half.",
    approach: [
      "Set lo = 0, hi = nums.length - 1.",
      "While lo <= hi, compute mid = (lo + hi) >> 1.",
      "If nums[mid] === target, return mid.",
      "If nums[mid] < target, set lo = mid + 1; else hi = mid - 1.",
      "Return -1 if the loop ends without finding target.",
    ],
    solution: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Binary search is the algorithm behind B-tree and B+-tree index lookups in every relational database — each node stores a sorted key range and the engine bisects it to find the next child pointer, achieving O(log n) seeks per query even on billion-row tables.",
    pitfalls: ["Use (lo + hi) >> 1 instead of (lo + hi) / 2 to avoid integer overflow in other languages.", "The loop condition is lo <= hi, not lo < hi, so a single-element array is handled correctly."],
  },
  {
    id: "binary-search-02",
    title: "Search Insert Position",
    difficulty: "Easy",
    tags: ["Binary Search", "Array"],
    statement: "Given a sorted array of distinct integers and a target, return the index if the target is found. If not, return the index where it would be inserted to keep the array sorted.",
    examples: [
      { input: "nums = [1,3,5,6], target = 5", output: "2" },
      { input: "nums = [1,3,5,6], target = 2", output: "1" },
      { input: "nums = [1,3,5,6], target = 7", output: "4" },
    ],
    intuition: "Think of finding the right slot in a filing cabinet. Even if the folder does not exist, binary search naturally lands at the position where it would go.",
    approach: [
      "Set lo = 0, hi = nums.length - 1.",
      "While lo <= hi, compute mid.",
      "If nums[mid] === target, return mid.",
      "If nums[mid] < target, lo = mid + 1; else hi = mid - 1.",
      "Return lo — it is the insertion point when the target is missing.",
    ],
    solution: `function searchInsert(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Lower-bound insertion search is exactly what sorted-string-table (SST) file seeks do in RocksDB and LevelDB: given a lookup key, find the first entry greater-than-or-equal in a sorted block, even if the exact key is absent, enabling efficient range scans on disk.",
    pitfalls: ["After the loop, lo is always the correct insertion point — this is the classic lower-bound property.", "Do not return -1 for a missing target; return lo."],
  },
  {
    id: "binary-search-03",
    title: "First Bad Version",
    difficulty: "Easy",
    tags: ["Binary Search"],
    statement: "You are a product manager trying to find the first bad version of a product. You have n versions [1, 2, ..., n] and an API isBadVersion(version) that returns whether a version is bad. All versions after the first bad one are also bad. Find the first bad version with the minimum number of API calls.",
    examples: [
      { input: "n = 5, bad = 4", output: "4", explanation: "isBadVersion(3) = false, isBadVersion(5) = true, isBadVersion(4) = true => 4 is first bad." },
      { input: "n = 1, bad = 1", output: "1" },
    ],
    intuition: "The versions look like [good, good, ..., bad, bad, bad]. Binary search finds the leftmost bad version the same way you find the first damaged page in a book by opening to the middle.",
    approach: [
      "Set lo = 1, hi = n.",
      "While lo < hi, compute mid.",
      "If isBadVersion(mid), the first bad version is at mid or earlier: hi = mid.",
      "Else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `var solution = function(isBadVersion) {
  return function(n) {
    let lo = 1, hi = n;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (isBadVersion(mid)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  };
};`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "This is the pattern behind git bisect, which binary-searches commit history to find the first commit that introduced a regression. CI/CD pipelines use the same idea to pinpoint the build that broke a health check across thousands of historical builds.",
    pitfalls: ["Use lo < hi (not <=) so the loop terminates with lo === hi pointing at the first bad version.", "Do not use (lo + hi) / 2 with large n — use Math.floor or bitshift to avoid floating-point issues."],
  },
  {
    id: "binary-search-04",
    title: "Sqrt(x)",
    difficulty: "Easy",
    tags: ["Binary Search", "Math"],
    statement: "Given a non-negative integer x, return the integer part of its square root without using any built-in exponent function or operator. The result is truncated toward zero.",
    examples: [
      { input: "x = 4", output: "2" },
      { input: "x = 8", output: "2", explanation: "sqrt(8) = 2.82..., truncated to 2." },
    ],
    intuition: "Guess the square root, check if the guess squared overshoots or undershoots, then narrow the range — exactly like guessing a number between 1 and x.",
    approach: [
      "Set lo = 0, hi = x.",
      "While lo <= hi, compute mid.",
      "If mid * mid === x, return mid.",
      "If mid * mid < x, lo = mid + 1 (and remember mid as a candidate).",
      "Else hi = mid - 1.",
      "Return hi (the last valid integer square root).",
    ],
    solution: `function mySqrt(x) {
  let lo = 0, hi = x;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const sq = mid * mid;
    if (sq === x) return mid;
    if (sq < x) lo = mid + 1;
    else hi = mid - 1;
  }
  return hi;
}`,
    language: "javascript",
    complexity: { time: "O(log x)", space: "O(1)" },
    systemDesign: "Binary search on an answer domain (rather than an array index) is used in capacity planning tools that binary-search the minimum number of servers needed such that the computed throughput exceeds a target SLA, avoiding expensive linear scans over server-count ranges.",
    pitfalls: ["For large x, mid * mid can overflow 32-bit integers in other languages — use BigInt or limit hi = Math.floor(x / 2) + 1.", "Return hi, not lo, because hi ends up at the floor of the square root."],
  },
  {
    id: "binary-search-05",
    title: "Guess Number Higher or Lower",
    difficulty: "Easy",
    tags: ["Binary Search"],
    statement: "We are playing a guess game. I pick a number between 1 and n. You call guess(num) which returns -1 if your number is too high, 1 if too low, or 0 if correct. Return the number I picked.",
    examples: [
      { input: "n = 10, pick = 6", output: "6" },
      { input: "n = 1, pick = 1", output: "1" },
    ],
    intuition: "Classic higher-lower guessing game: always guess the middle of the remaining range and cut the range in half based on the feedback.",
    approach: [
      "Set lo = 1, hi = n.",
      "While lo <= hi, compute mid.",
      "Call guess(mid). If 0, return mid. If -1, hi = mid - 1. If 1, lo = mid + 1.",
    ],
    solution: `var guessNumber = function(n) {
  let lo = 1, hi = n;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const res = guess(mid);
    if (res === 0) return mid;
    if (res === -1) hi = mid - 1;
    else lo = mid + 1;
  }
  return -1;
};`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Interactive binary search over an oracle is exactly how auto-tuning systems in databases (e.g. automatic index selection, query hint tuning) work: they probe a configuration space and use feedback to bisect toward the optimal setting, minimising expensive full benchmark runs.",
    pitfalls: ["Note the API convention: -1 means your guess is too high, 1 means too low — opposite of what you might expect.", "The loop condition is lo <= hi to handle single-element ranges."],
  },
  {
    id: "binary-search-06",
    title: "Valid Perfect Square",
    difficulty: "Easy",
    tags: ["Binary Search", "Math"],
    statement: "Given a positive integer num, return true if num is a perfect square, or false otherwise. Do not use any built-in library functions.",
    examples: [
      { input: "num = 16", output: "true" },
      { input: "num = 14", output: "false" },
    ],
    intuition: "Binary search for an integer whose square equals num, the same way you would look up a word in a dictionary. If you find it exactly, it is a perfect square.",
    approach: [
      "Set lo = 1, hi = num.",
      "While lo <= hi, compute mid.",
      "If mid * mid === num, return true.",
      "If mid * mid < num, lo = mid + 1; else hi = mid - 1.",
      "Return false.",
    ],
    solution: `function isPerfectSquare(num) {
  let lo = 1, hi = num;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const sq = mid * mid;
    if (sq === num) return true;
    if (sq < num) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Exact-match binary search on a computed predicate appears in data validation pipelines that verify whether a numeric column satisfies a mathematical invariant (e.g. all IDs are perfect squares) without full table scans, using sorted-index seeks instead.",
    pitfalls: ["mid * mid can overflow in Java/C++ for large num — use long arithmetic or compare mid with num / mid to avoid it.", "Starting hi at num is safe but hi = Math.ceil(Math.sqrt(num)) + 1 is faster."],
  },
  {
    id: "binary-search-07",
    title: "Arranging Coins",
    difficulty: "Easy",
    tags: ["Binary Search", "Math"],
    statement: "You have n coins and want to build a staircase. The kth row has exactly k coins. Return the number of complete rows you can build.",
    examples: [
      { input: "n = 5", output: "2", explanation: "Rows 1 and 2 complete (3 coins), row 3 only partially filled." },
      { input: "n = 8", output: "3" },
    ],
    intuition: "The total coins in k complete rows is k*(k+1)/2. Binary search for the largest k where this sum does not exceed n.",
    approach: [
      "Set lo = 0, hi = n.",
      "While lo <= hi, compute mid.",
      "Compute coins = mid * (mid + 1) / 2.",
      "If coins === n, return mid.",
      "If coins < n, lo = mid + 1; else hi = mid - 1.",
      "Return hi.",
    ],
    solution: `function arrangeCoins(n) {
  let lo = 0, hi = n;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const coins = mid * (mid + 1) / 2;
    if (coins === n) return mid;
    if (coins < n) lo = mid + 1;
    else hi = mid - 1;
  }
  return hi;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Binary search on an arithmetic formula (triangular numbers) models resource-sizing problems: find the maximum batch size k such that the total cost function f(k) stays under a budget, avoiding iterating over all k.",
    pitfalls: ["Use Math.floor for mid to avoid fractional values. For very large n, mid*(mid+1) might overflow 32-bit integers — use BigInt or Math arithmetic carefully.", "Return hi, not lo, because hi is the last k where coins <= n."],
  },
  {
    id: "binary-search-08",
    title: "Find Smallest Letter Greater Than Target",
    difficulty: "Easy",
    tags: ["Binary Search", "Array"],
    statement: "Given a sorted array of characters letters that loop around the alphabet, and a target letter, return the smallest character in the array that is greater than target. The array wraps around, so if no letter is greater, return letters[0].",
    examples: [
      { input: "letters = ['c','f','j'], target = 'a'", output: "'c'" },
      { input: "letters = ['c','f','j'], target = 'j'", output: "'c'", explanation: "Wraps around." },
    ],
    intuition: "Binary search for the first letter strictly greater than target. If none is found, wrap around to the first letter.",
    approach: [
      "Set lo = 0, hi = letters.length.",
      "While lo < hi, compute mid.",
      "If letters[mid] <= target, lo = mid + 1; else hi = mid.",
      "Return letters[lo % letters.length] to handle wrap-around.",
    ],
    solution: `function nextGreatestLetter(letters, target) {
  let lo = 0, hi = letters.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (letters[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return letters[lo % letters.length];
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Circular sorted-range lookups appear in consistent hashing rings: given a key hash, find the next virtual node clockwise on the ring. This is exactly 'smallest element greater than target with wrap-around', used by every distributed key-value store (DynamoDB, Cassandra) for request routing.",
    pitfalls: ["Use lo % letters.length so that when lo equals letters.length (no greater letter found), it wraps to index 0.", "The condition is letters[mid] <= target (not <) because we want strictly greater."],
  },
  {
    id: "binary-search-09",
    title: "Count Negative Numbers in a Sorted Matrix",
    difficulty: "Easy",
    tags: ["Binary Search", "Array", "Matrix"],
    statement: "Given an m x n matrix grid where each row and column is sorted in non-increasing order, return the number of negative numbers in the grid.",
    examples: [
      { input: "grid = [[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]]", output: "8" },
      { input: "grid = [[3,2],[1,0]]", output: "0" },
    ],
    intuition: "Each row is sorted in descending order. Binary search each row for the first negative number; everything to its right is also negative.",
    approach: [
      "For each row, binary search for the first index where grid[row][mid] < 0.",
      "The count of negatives in that row is n - firstNegativeIndex.",
      "Sum counts across all rows.",
    ],
    solution: `function countNegatives(grid) {
  let count = 0;
  const n = grid[0].length;
  for (const row of grid) {
    let lo = 0, hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (row[mid] < 0) hi = mid;
      else lo = mid + 1;
    }
    count += n - lo;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(m log n)", space: "O(1)" },
    systemDesign: "Counting elements satisfying a threshold in a sorted matrix appears in columnar analytics when filtering partitioned time-series data: each partition (row) is sorted by timestamp or value, and binary search quickly counts events exceeding an SLA threshold without scanning every row fully.",
    pitfalls: ["The row is sorted in non-increasing order, so search for the first value < 0 using hi = mid (not hi = mid - 1).", "An O(m + n) staircase walk starting from the top-right also works here."],
  },
  {
    id: "binary-search-10",
    title: "Peak Index in a Mountain Array",
    difficulty: "Easy",
    tags: ["Binary Search", "Array"],
    statement: "Given a mountain array arr (strictly increases then strictly decreases), return the index i such that arr[i] is the peak element.",
    examples: [
      { input: "arr = [0,1,0]", output: "1" },
      { input: "arr = [0,2,1,0]", output: "1" },
      { input: "arr = [0,10,5,2]", output: "1" },
    ],
    intuition: "If the middle element is smaller than its right neighbour, the peak is to the right. Otherwise it is to the left or at mid. Binary search converges to the peak.",
    approach: [
      "Set lo = 0, hi = arr.length - 1.",
      "While lo < hi, compute mid.",
      "If arr[mid] < arr[mid + 1], lo = mid + 1 (ascending side, peak is right).",
      "Else hi = mid (descending side or at peak).",
      "Return lo.",
    ],
    solution: `function peakIndexInMountainArray(arr) {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Peak-finding on unimodal arrays is used in auto-scaling systems that model load as a unimodal curve during a traffic spike — binary search quickly identifies the peak load time to pre-provision resources, rather than scanning every minute of the traffic window.",
    pitfalls: ["Access arr[mid + 1] is safe because hi is always < arr.length - 1 until convergence.", "Do not return hi - 1 or lo + 1 — lo === hi at the end and is the peak index."],
  },
  {
    id: "binary-search-11",
    title: "Find First and Last Position of Element in Sorted Array",
    difficulty: "Easy",
    tags: ["Binary Search", "Array"],
    statement: "Given a sorted array nums and a target, return the starting and ending position of target. If not found, return [-1, -1]. Your algorithm must run in O(log n).",
    examples: [
      { input: "nums = [5,7,7,8,8,10], target = 8", output: "[3,4]" },
      { input: "nums = [5,7,7,8,8,10], target = 6", output: "[-1,-1]" },
      { input: "nums = [], target = 0", output: "[-1,-1]" },
    ],
    intuition: "Run binary search twice — once to find the leftmost occurrence (lower bound) and once for the rightmost (upper bound - 1). Like finding the first and last page of a chapter in a book.",
    approach: [
      "Define lowerBound(target): find first index where nums[index] >= target.",
      "Define upperBound(target): find first index where nums[index] > target.",
      "first = lowerBound(target); if nums[first] != target return [-1,-1].",
      "last = upperBound(target) - 1.",
      "Return [first, last].",
    ],
    solution: `function searchRange(nums, target) {
  function bound(val, lower) {
    let lo = 0, hi = nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (lower ? nums[mid] >= val : nums[mid] > val) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
  const first = bound(target, true);
  if (first === nums.length || nums[first] !== target) return [-1, -1];
  return [first, bound(target, false) - 1];
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Lower-bound and upper-bound binary searches are the exact operations B+-tree leaf-level range scans perform: the index seeks to the first qualifying key, then scans right until the key exceeds the range end — the foundation of every SQL range query (BETWEEN, >=, <=) in a database.",
    pitfalls: ["The upper bound returns the first index strictly greater than target, so subtract 1 for the last occurrence.", "Check that nums[first] === target before computing the last position to avoid out-of-bounds access."],
  },
  {
    id: "binary-search-12",
    title: "Search a 2D Matrix",
    difficulty: "Easy",
    tags: ["Binary Search", "Matrix"],
    statement: "You are given an m x n matrix where each row is sorted and the first integer of each row is greater than the last integer of the previous row. Return true if target is in the matrix.",
    examples: [
      { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", output: "true" },
      { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13", output: "false" },
    ],
    intuition: "The matrix is essentially a sorted 1D array laid out in rows. Treat the cell at virtual index i as matrix[Math.floor(i/n)][i%n] and run a single binary search.",
    approach: [
      "Set lo = 0, hi = m * n - 1.",
      "While lo <= hi, compute mid.",
      "Map mid to matrix[Math.floor(mid / n)][mid % n].",
      "Compare with target and adjust lo/hi.",
      "Return false if loop ends.",
    ],
    solution: `function searchMatrix(matrix, target) {
  const m = matrix.length, n = matrix[0].length;
  let lo = 0, hi = m * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const val = matrix[Math.floor(mid / n)][mid % n];
    if (val === target) return true;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(log(m*n))", space: "O(1)" },
    systemDesign: "Treating a 2D sorted structure as a 1D sorted array is how partitioned database tables are searched: each partition (row) is a sorted block, and the global ordering across partitions allows a single binary search pass instead of per-partition scans.",
    pitfalls: ["This only works when the matrix has the strict global ordering property (first of row > last of previous row).", "Use Math.floor(mid / n), not mid / n, for the row index."],
  },
  {
    id: "binary-search-13",
    title: "Kth Missing Positive Number",
    difficulty: "Easy",
    tags: ["Binary Search", "Array"],
    statement: "Given a sorted positive integer array arr and an integer k, return the kth missing positive integer.",
    examples: [
      { input: "arr = [2,3,4,7,11], k = 5", output: "9", explanation: "Missing: 1,5,6,8,9. The 5th missing is 9." },
      { input: "arr = [1,2,3,4], k = 2", output: "6" },
    ],
    intuition: "At index i the number of missing positives before arr[i] is arr[i] - (i + 1). Binary search for the first index where this count reaches k.",
    approach: [
      "Set lo = 0, hi = arr.length.",
      "While lo < hi, compute mid.",
      "If arr[mid] - (mid + 1) >= k, hi = mid; else lo = mid + 1.",
      "Return lo + k (the kth missing number lies after the lo-th element).",
    ],
    solution: `function findKthPositive(arr, k) {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] - (mid + 1) >= k) hi = mid;
    else lo = mid + 1;
  }
  return lo + k;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Finding the kth gap in a sorted ID sequence is used in database auto-increment ID reclamation — systems that reassign deleted IDs binary-search the sorted active-ID array to locate the kth available slot, avoiding a full scan.",
    pitfalls: ["The formula arr[mid] - (mid + 1) counts missing numbers before index mid because a perfect sequence would have arr[mid] = mid + 1.", "Return lo + k, not lo — lo marks where we insert the answer relative to the array."],
  },
  {
    id: "binary-search-14",
    title: "Check if N and Its Double Exist",
    difficulty: "Easy",
    tags: ["Binary Search", "Array", "Hashing"],
    statement: "Given an array arr, return true if there exist two indices i and j such that i != j, arr[i] == 2 * arr[j].",
    examples: [
      { input: "arr = [10,2,5,3]", output: "true", explanation: "10 = 2 * 5." },
      { input: "arr = [3,1,7,11]", output: "false" },
    ],
    intuition: "Sort the array. For each element, binary search for its double. If found at a different index, the answer is true.",
    approach: [
      "Sort arr.",
      "For each element arr[i], binary search for arr[i] * 2.",
      "If found at index j != i, return true.",
      "Return false if no pair is found.",
    ],
    solution: `function checkIfExist(arr) {
  arr.sort((a, b) => a - b);
  for (let i = 0; i < arr.length; i++) {
    let lo = 0, hi = arr.length - 1;
    const target = arr[i] * 2;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] === target && mid !== i) return true;
      if (arr[mid] < target || (arr[mid] === target && mid < i)) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Sorted binary search for a derived value (double/half) is used in data deduplication pipelines that check if a record is a scaled variant of another, and in financial systems validating that adjusted prices are exact multiples of base prices.",
    pitfalls: ["Handle arr[i] = 0 carefully: 0 * 2 = 0 requires finding a different index with value 0, not itself.", "A hash set approach is simpler (O(n) time), but binary search after sorting is a clean O(n log n) alternative."],
  },
  {
    id: "binary-search-15",
    title: "Intersection of Two Arrays",
    difficulty: "Easy",
    tags: ["Binary Search", "Array", "Hashing"],
    statement: "Given two integer arrays nums1 and nums2, return an array of their intersection (unique elements that appear in both arrays).",
    examples: [
      { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]" },
      { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", output: "[9,4]" },
    ],
    intuition: "Sort one array. For each element in the other array, binary search the sorted array. Collect matches using a set to avoid duplicates.",
    approach: [
      "Sort nums1.",
      "Iterate over nums2. For each unique element, binary search nums1.",
      "If found, add to result set.",
      "Return the result set as an array.",
    ],
    solution: `function intersection(nums1, nums2) {
  nums1.sort((a, b) => a - b);
  const result = new Set();
  for (const n of new Set(nums2)) {
    let lo = 0, hi = nums1.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (nums1[mid] === n) { result.add(n); break; }
      if (nums1[mid] < n) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return [...result];
}`,
    language: "javascript",
    complexity: { time: "O((m+n) log m)", space: "O(m)" },
    systemDesign: "Set intersection using binary search appears in inverted-index query evaluation: each term's posting list is sorted, and the query engine intersects them by binary-searching the smaller list against the larger, a strategy used by Lucene for AND-query acceleration.",
    pitfalls: ["Use a Set for the result to avoid duplicate entries.", "Iterating over new Set(nums2) avoids redundant binary searches for duplicate values in nums2."],
  },
  {
    id: "binary-search-16",
    title: "Two Sum II - Input Array Is Sorted",
    difficulty: "Easy",
    tags: ["Binary Search", "Array", "Two Pointers"],
    statement: "Given a 1-indexed sorted array numbers and a target, return the indices of the two numbers that add up to target. Exactly one solution exists.",
    examples: [
      { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" },
      { input: "numbers = [2,3,4], target = 6", output: "[1,3]" },
    ],
    intuition: "Fix one number. Binary search for the complement (target minus that number) in the rest of the array. The sorted order makes binary search valid.",
    approach: [
      "For each index i from 0 to n-2, binary search for (target - numbers[i]) in numbers[i+1..n-1].",
      "Return [i+1, j+1] (1-indexed) when found.",
    ],
    solution: `function twoSum(numbers, target) {
  for (let i = 0; i < numbers.length - 1; i++) {
    const need = target - numbers[i];
    let lo = i + 1, hi = numbers.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (numbers[mid] === need) return [i + 1, mid + 1];
      if (numbers[mid] < need) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return [];
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Binary search for a complement in a sorted array is the basis of merge-join probing in databases: the outer relation is scanned, and for each row the inner sorted relation is binary-searched for the matching join key, giving O(n log m) instead of O(n*m) for a nested-loop join.",
    pitfalls: ["The two-pointer approach (O(n)) is more optimal here, but binary search also satisfies the O(log n) spirit.", "Return 1-indexed positions as specified."],
  },
  {
    id: "binary-search-17",
    title: "Missing Number",
    difficulty: "Easy",
    tags: ["Binary Search", "Array", "Math"],
    statement: "Given an array nums containing n distinct numbers in the range [0, n], return the one number in the range that is missing from the array.",
    examples: [
      { input: "nums = [3,0,1]", output: "2" },
      { input: "nums = [0,1]", output: "2" },
      { input: "nums = [9,6,4,2,3,5,7,0,1]", output: "8" },
    ],
    intuition: "Sort the array. If sorted, the missing number is the first index where nums[i] != i. Binary search finds this discrepancy in O(log n).",
    approach: [
      "Sort nums.",
      "Binary search: if nums[mid] > mid, the missing number is at mid or left, so hi = mid.",
      "Else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `function missingNumber(nums) {
  nums.sort((a, b) => a - b);
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > mid) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Detecting a single gap in a sorted sequence is used in sequence-number recovery in messaging systems — after sorting received packets, binary search finds the first gap (missing packet) in O(log n) without scanning the entire sequence.",
    pitfalls: ["The XOR trick (O(n), O(1)) is faster, but binary search after sorting is a clean O(n log n) solution.", "Return lo at the end — if no index satisfies nums[mid] > mid, the missing number is n itself."],
  },
  // ---- MEDIUM (18 problems) ----
  {
    id: "binary-search-18",
    title: "Search a 2D Matrix II",
    difficulty: "Medium",
    tags: ["Binary Search", "Matrix", "Divide and Conquer"],
    statement: "Write an efficient algorithm that searches for a value target in an m x n integer matrix. Each row is sorted left to right and each column is sorted top to bottom.",
    examples: [
      { input: "matrix = [[1,4,7,11],[2,5,8,12],[3,6,9,16],[10,13,14,17]], target = 5", output: "true" },
      { input: "matrix = [[1,4,7,11],[2,5,8,12],[3,6,9,16],[10,13,14,17]], target = 20", output: "false" },
    ],
    intuition: "Start at the top-right corner. The value there is the largest in its row and smallest in its column. If it equals target, done. If larger, move left; if smaller, move down.",
    approach: [
      "Start at row = 0, col = n - 1.",
      "While row < m and col >= 0: compare matrix[row][col] with target.",
      "If equal, return true. If greater, col--. If smaller, row++.",
      "Return false.",
    ],
    solution: `function searchMatrix(matrix, target) {
  let row = 0, col = matrix[0].length - 1;
  while (row < matrix.length && col >= 0) {
    if (matrix[row][col] === target) return true;
    if (matrix[row][col] > target) col--;
    else row++;
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(m+n)", space: "O(1)" },
    systemDesign: "The staircase search on a doubly-sorted matrix mirrors how multi-level indexes work in columnar stores: rows are sorted by one key, columns by another, and search navigates diagonally, eliminating an entire row or column at each step — the basis of composite index scans.",
    pitfalls: ["This matrix does NOT have the global sorted property of Search a 2D Matrix I — do not flatten to 1D binary search.", "The staircase approach is O(m+n), which is optimal for this problem."],
  },
  {
    id: "binary-search-19",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    tags: ["Binary Search", "Array"],
    statement: "Given a sorted array of unique integers that has been rotated between 1 and n times, find the minimum element. Solve in O(log n).",
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1" },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0" },
      { input: "nums = [11,13,15,17]", output: "11" },
    ],
    intuition: "The rotated array consists of two sorted halves. The minimum is at the inflection point. Compare mid with hi: if nums[mid] > nums[hi], the minimum is in the right half.",
    approach: [
      "Set lo = 0, hi = n - 1.",
      "While lo < hi, compute mid.",
      "If nums[mid] > nums[hi], the minimum is in (mid, hi]: lo = mid + 1.",
      "Else the minimum is in [lo, mid]: hi = mid.",
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
    systemDesign: "Finding the rotation point in a sorted-then-rotated dataset models how consistent-hashing rings detect the 'wrap point' — the smallest virtual node ID after a ring rotation — used in distributed databases like Cassandra when adding or removing nodes.",
    pitfalls: ["Compare mid with hi (not lo): comparing with lo is ambiguous when the array is not rotated.", "All elements are unique; duplicates require a different approach (Find Minimum in Rotated Sorted Array II)."],
  },
  {
    id: "binary-search-20",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    tags: ["Binary Search", "Array"],
    statement: "Given a rotated sorted array of unique integers and a target, return the index of target or -1 if not present. You must achieve O(log n) time.",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
      { input: "nums = [1], target = 0", output: "-1" },
    ],
    intuition: "At each binary search step, one of the two halves is always sorted. Determine which half is sorted, then check if target falls within it to decide which half to search.",
    approach: [
      "Set lo = 0, hi = n - 1.",
      "While lo <= hi: compute mid.",
      "If nums[mid] === target, return mid.",
      "If left half is sorted (nums[lo] <= nums[mid]): if target in [nums[lo], nums[mid]), hi = mid - 1; else lo = mid + 1.",
      "Else right half is sorted: if target in (nums[mid], nums[hi]], lo = mid + 1; else hi = mid - 1.",
    ],
    solution: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Searching in a rotated sorted structure models consistent-hash ring lookups where node IDs wrap around. Distributed search systems must handle wrap-around when the sorted keyspace is partitioned across servers that have been re-added after failures, requiring logic identical to this algorithm.",
    pitfalls: ["Use nums[lo] <= nums[mid] (<=, not <) to correctly identify the sorted half when lo === mid.", "Check target strictly within the sorted half bounds before reassigning pointers."],
  },
  {
    id: "binary-search-21",
    title: "Search in Rotated Sorted Array II",
    difficulty: "Medium",
    tags: ["Binary Search", "Array"],
    statement: "Given a rotated sorted array nums that may contain duplicates and a target, return true if target exists in the array.",
    examples: [
      { input: "nums = [2,5,6,0,0,1,2], target = 0", output: "true" },
      { input: "nums = [2,5,6,0,0,1,2], target = 3", output: "false" },
    ],
    intuition: "Same as the no-duplicates version, but when nums[lo] === nums[mid] we cannot tell which half is sorted — just increment lo to skip the duplicate.",
    approach: [
      "Same as Search in Rotated Sorted Array I.",
      "Add a special case: if nums[lo] === nums[mid], lo++.",
      "This handles the ambiguity created by duplicates.",
    ],
    solution: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return true;
    if (nums[lo] === nums[mid]) { lo++; continue; }
    if (nums[lo] < nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(log n) average, O(n) worst case", space: "O(1)" },
    systemDesign: "Handling duplicates in distributed sorted data is a common challenge in multi-version concurrency control (MVCC) databases, where multiple versions of a row share the same key. The extra linear step corresponds to scanning past multiple versions to find the correct one.",
    pitfalls: ["Worst case is O(n) when all elements are equal and target is not present — e.g. [1,1,1,1,1], target=2.", "The only change from the no-duplicate version is the lo++ guard when nums[lo] === nums[mid]."],
  },
  {
    id: "binary-search-22",
    title: "Find Peak Element",
    difficulty: "Medium",
    tags: ["Binary Search", "Array"],
    statement: "A peak element is one that is strictly greater than its neighbours. Given an integer array nums, return the index of any peak element. You may imagine nums[-1] = nums[n] = -Infinity. Solve in O(log n).",
    examples: [
      { input: "nums = [1,2,3,1]", output: "2" },
      { input: "nums = [1,2,1,3,5,6,4]", output: "5" },
    ],
    intuition: "At any position, if the right neighbour is larger, then there must be a peak to the right. If the left neighbour is larger, there must be a peak to the left. Binary search exploits this monotonicity.",
    approach: [
      "Set lo = 0, hi = n - 1.",
      "While lo < hi, compute mid.",
      "If nums[mid] < nums[mid + 1], the peak is to the right: lo = mid + 1.",
      "Else hi = mid.",
      "Return lo.",
    ],
    solution: `function findPeakElement(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Peak finding on a signal models finding maximum throughput in load-testing: binary search over request-rate values to find the peak rate before the system degrades, halving the number of expensive load test runs needed.",
    pitfalls: ["Any peak is acceptable — binary search finds one, not necessarily the global maximum.", "Accessing nums[mid + 1] is safe because hi is always < n - 1 until lo === hi."],
  },
  {
    id: "binary-search-23",
    title: "Single Element in a Sorted Array",
    difficulty: "Medium",
    tags: ["Binary Search", "Array"],
    statement: "You are given a sorted array where every element appears exactly twice, except for one element which appears once. Return the single element. Your solution must run in O(log n) time and O(1) space.",
    examples: [
      { input: "nums = [1,1,2,3,3,4,4,8,8]", output: "2" },
      { input: "nums = [3,3,7,7,10,11,11]", output: "10" },
    ],
    intuition: "Before the single element, pairs start at even indices. After it, pairs start at odd indices. Binary search for the first even index where this rule breaks.",
    approach: [
      "Set lo = 0, hi = n - 1 (keep both odd and even).",
      "While lo < hi, compute mid (force mid to even: if odd, mid--).",
      "If nums[mid] === nums[mid + 1], the single element is to the right: lo = mid + 2.",
      "Else it is at mid or to the left: hi = mid.",
      "Return nums[lo].",
    ],
    solution: `function singleNonDuplicate(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    let mid = (lo + hi) >> 1;
    if (mid % 2 === 1) mid--;
    if (nums[mid] === nums[mid + 1]) lo = mid + 2;
    else hi = mid;
  }
  return nums[lo];
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Detecting a single unpaired record in a sorted dataset models integrity checks in transactional databases: sorted audit logs normally have even-count pairs (request + response). A single unpaired entry indicates a dropped response, and binary search finds it in O(log n) instead of a full scan.",
    pitfalls: ["Force mid to even before comparing so that pairs always start at even indices.", "The invariant is: before the single element, nums[even] === nums[even+1]."],
  },
  {
    id: "binary-search-24",
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    tags: ["Binary Search", "Array"],
    statement: "Koko has n piles of bananas. She can eat k bananas per hour. She has h hours to eat all bananas. Return the minimum integer k such that she can eat all piles within h hours.",
    examples: [
      { input: "piles = [3,6,7,11], h = 8", output: "4" },
      { input: "piles = [30,11,23,4,20], h = 5", output: "30" },
    ],
    intuition: "Binary search on the answer: the eating speed k ranges from 1 to max(piles). For each candidate k, check if Koko finishes in time. Find the smallest valid k.",
    approach: [
      "Set lo = 1, hi = max(piles).",
      "While lo < hi, compute mid.",
      "Compute hours = sum of Math.ceil(pile / mid) for each pile.",
      "If hours <= h, hi = mid (mid might work); else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `function minEatingSpeed(piles, h) {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const hours = piles.reduce((s, p) => s + Math.ceil(p / mid), 0);
    if (hours <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log(max(piles)))", space: "O(1)" },
    systemDesign: "Binary search on the answer is the pattern for rate-limiting configuration: find the minimum allowed request rate such that total throughput stays within capacity. API gateways use this approach when auto-tuning per-tenant rate limits against observed traffic patterns.",
    pitfalls: ["The feasibility check uses Math.ceil(p / mid) per pile — integer ceiling division.", "lo starts at 1, not 0, because k = 0 is invalid (infinite hours)."],
  },
  {
    id: "binary-search-25",
    title: "Capacity To Ship Packages Within D Days",
    difficulty: "Medium",
    tags: ["Binary Search", "Array"],
    statement: "A conveyor belt has packages with given weights. You need to ship all packages in D days. The ship's capacity determines how many packages it can carry per day (packages must stay in order). Return the minimum ship capacity.",
    examples: [
      { input: "weights = [1,2,3,4,5,6,7,8,9,10], days = 5", output: "15" },
      { input: "weights = [3,2,2,4,1,4], days = 3", output: "6" },
    ],
    intuition: "Binary search on capacity: the answer lies between max(weights) (ship at least the heaviest) and sum(weights) (ship all in one day). Check if a given capacity allows shipping in D days.",
    approach: [
      "Set lo = max(weights), hi = sum(weights).",
      "While lo < hi, compute mid.",
      "Simulate days needed with capacity mid: greedily load each day.",
      "If days needed <= D, hi = mid; else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `function shipWithinDays(weights, days) {
  let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    let d = 1, cur = 0;
    for (const w of weights) {
      if (cur + w > mid) { d++; cur = 0; }
      cur += w;
    }
    if (d <= days) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log(sum))", space: "O(1)" },
    systemDesign: "Minimising capacity subject to a deadline constraint is exactly the problem solved in cloud storage provisioning: find the minimum bandwidth (capacity) such that a data migration completes within a maintenance window (days), binary-searching over provisioned throughput levels.",
    pitfalls: ["lo must be max(weights) — the ship must be able to carry the heaviest single package.", "The greedy simulation: start a new day when adding the next package would exceed capacity."],
  },
  {
    id: "binary-search-26",
    title: "Find K Closest Elements",
    difficulty: "Medium",
    tags: ["Binary Search", "Array", "Two Pointers"],
    statement: "Given a sorted integer array arr, two integers k and x, return the k closest integers to x. The result should be sorted. Ties are broken by smaller value.",
    examples: [
      { input: "arr = [1,2,3,4,5], k = 4, x = 3", output: "[1,2,3,4]" },
      { input: "arr = [1,2,3,4,5], k = 4, x = -1", output: "[1,2,3,4]" },
    ],
    intuition: "Binary search for the left boundary of the k-element window. The window [mid, mid+k-1] vs [mid+1, mid+k] — compare how close arr[mid] and arr[mid+k] are to x.",
    approach: [
      "Set lo = 0, hi = arr.length - k.",
      "While lo < hi, compute mid.",
      "If x - arr[mid] > arr[mid + k] - x, lo = mid + 1 (right element is closer).",
      "Else hi = mid.",
      "Return arr.slice(lo, lo + k).",
    ],
    solution: `function findClosestElements(arr, k, x) {
  let lo = 0, hi = arr.length - k;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
    else hi = mid;
  }
  return arr.slice(lo, lo + k);
}`,
    language: "javascript",
    complexity: { time: "O(log(n-k) + k)", space: "O(1)" },
    systemDesign: "Finding the k nearest neighbours in a sorted 1D dataset models nearest-server lookups in CDN routing: given a user's IP coordinate, find the k closest edge nodes from a sorted list. The binary search finds the optimal window start, and the window is returned as the candidate set.",
    pitfalls: ["hi starts at arr.length - k, not arr.length - 1, because the window needs k elements.", "Compare x - arr[mid] with arr[mid+k] - x: if left is farther, shift window right."],
  },
  {
    id: "binary-search-27",
    title: "H-Index II",
    difficulty: "Medium",
    tags: ["Binary Search", "Array"],
    statement: "Given a sorted (ascending) array of citations for a researcher's papers, return the researcher's h-index. The h-index is the largest h such that at least h papers have at least h citations.",
    examples: [
      { input: "citations = [0,1,3,5,6]", output: "3" },
      { input: "citations = [1,2,100]", output: "2" },
    ],
    intuition: "Binary search for the leftmost index i where citations[i] >= n - i (meaning the last n - i papers all have >= n - i citations). The h-index is n - i.",
    approach: [
      "Set lo = 0, hi = n - 1, n = citations.length.",
      "While lo <= hi, compute mid.",
      "If citations[mid] >= n - mid, this could be the h-index: hi = mid - 1.",
      "Else lo = mid + 1.",
      "Return n - lo.",
    ],
    solution: `function hIndex(citations) {
  const n = citations.length;
  let lo = 0, hi = n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (citations[mid] >= n - mid) hi = mid - 1;
    else lo = mid + 1;
  }
  return n - lo;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "H-index computation over sorted citation counts models ranking thresholds in recommendation systems: find the largest k such that at least k items have score >= k. This pattern appears in quality-filter pipelines that determine the pass threshold for content moderation models.",
    pitfalls: ["The citations array is already sorted ascending — no need to sort.", "n - lo gives the h-index because lo lands at the first index satisfying the condition."],
  },
  {
    id: "binary-search-28",
    title: "Time Based Key-Value Store",
    difficulty: "Medium",
    tags: ["Binary Search", "Design", "Hash Map"],
    statement: "Design a time-based key-value data structure that stores multiple values for the same key at different timestamps, and retrieves the value with the largest timestamp <= the given timestamp.",
    examples: [
      { input: "set('foo','bar',1), set('foo','bar2',4), get('foo',4), get('foo',5)", output: "'bar2','bar2'" },
      { input: "get('foo',3)", output: "'bar'" },
    ],
    intuition: "Store values for each key as a list of (timestamp, value) pairs sorted by timestamp. For a get query, binary search the list for the largest timestamp <= the query timestamp.",
    approach: [
      "Maintain a map from key to array of [timestamp, value] pairs.",
      "set: push [timestamp, value] onto the key's array (timestamps are always increasing).",
      "get: binary search the array for the largest timestamp <= given timestamp. Return the corresponding value or empty string.",
    ],
    solution: `class TimeMap {
  constructor() {
    this.store = new Map();
  }
  set(key, value, timestamp) {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key).push([timestamp, value]);
  }
  get(key, timestamp) {
    const arr = this.store.get(key);
    if (!arr) return "";
    let lo = 0, hi = arr.length - 1, res = "";
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid][0] <= timestamp) { res = arr[mid][1]; lo = mid + 1; }
      else hi = mid - 1;
    }
    return res;
  }
}`,
    language: "javascript",
    complexity: { time: "O(log n) per get, O(1) per set", space: "O(n)" },
    systemDesign: "Time-based key-value stores are the foundation of MVCC (Multi-Version Concurrency Control) in databases like PostgreSQL: each row version is stamped with a transaction ID, and reads binary-search the version chain for the latest visible version at the reader's snapshot timestamp.",
    pitfalls: ["Timestamps in set are strictly increasing per the problem guarantee, so no sorting is needed.", "Return the empty string, not null, when no timestamp <= query is found."],
  },
  {
    id: "binary-search-29",
    title: "Find the Duplicate Number",
    difficulty: "Medium",
    tags: ["Binary Search", "Array", "Two Pointers"],
    statement: "Given an array nums of n+1 integers where each integer is in [1, n], there is exactly one repeated number. Return it without modifying the array and using O(1) extra space.",
    examples: [
      { input: "nums = [1,3,4,2,2]", output: "2" },
      { input: "nums = [3,1,3,4,2]", output: "3" },
    ],
    intuition: "Binary search on the value range [1, n]. For a mid value, count how many numbers in nums are <= mid. If count > mid, the duplicate is in [1, mid] by the pigeonhole principle.",
    approach: [
      "Set lo = 1, hi = n (value range).",
      "While lo < hi, compute mid.",
      "Count elements in nums that are <= mid.",
      "If count > mid, duplicate is in [lo, mid]: hi = mid.",
      "Else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `function findDuplicate(nums) {
  let lo = 1, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const count = nums.filter(n => n <= mid).length;
    if (count > mid) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Pigeonhole-based duplicate detection with binary search is used in storage integrity checks: given a sorted block of n+1 record IDs supposedly in [1, n], binary search on the value range finds the duplicated ID in O(log n) passes without an auxiliary data structure.",
    pitfalls: ["Binary search is on the value range [1, n], not on array indices.", "Floyd's cycle detection achieves O(n) time — binary search is O(n log n) but uses O(1) space and no modification."],
  },
  {
    id: "binary-search-30",
    title: "Minimum Number of Days to Make m Bouquets",
    difficulty: "Medium",
    tags: ["Binary Search", "Array"],
    statement: "You have a garden of n flowers. bloomDay[i] is the day flower i blooms. You need m bouquets each requiring k adjacent bloomed flowers. Return the minimum number of days to make m bouquets, or -1 if impossible.",
    examples: [
      { input: "bloomDay = [1,10,3,10,2], m = 3, k = 1", output: "3" },
      { input: "bloomDay = [1,10,3,10,2], m = 3, k = 2", output: "-1" },
    ],
    intuition: "Binary search on the number of days. For a given day d, count how many bouquets can be formed from consecutive flowers that bloomed by day d. Find the smallest d where this count >= m.",
    approach: [
      "If m * k > n, return -1.",
      "Set lo = min(bloomDay), hi = max(bloomDay).",
      "While lo < hi, compute mid.",
      "Count bouquets: scan bloomDay, count consecutive flowers bloomed by mid, form a bouquet every k.",
      "If bouquets >= m, hi = mid; else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `function minDays(bloomDay, m, k) {
  const n = bloomDay.length;
  if (m * k > n) return -1;
  let lo = Math.min(...bloomDay), hi = Math.max(...bloomDay);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    let bouquets = 0, consecutive = 0;
    for (const d of bloomDay) {
      if (d <= mid) { consecutive++; if (consecutive === k) { bouquets++; consecutive = 0; } }
      else consecutive = 0;
    }
    if (bouquets >= m) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log(max-min))", space: "O(1)" },
    systemDesign: "Binary search on time (days) to reach a resource threshold models cluster warm-up planning: find the minimum time window needed for a given number of servers to become healthy (bloom), used in blue-green deployment scheduling to minimise migration risk.",
    pitfalls: ["Early return -1 when m * k > n — not enough flowers exist.", "Reset consecutive to 0 when a flower has not bloomed yet; a bouquet requires adjacency."],
  },
  {
    id: "binary-search-31",
    title: "Kth Smallest Element in a Sorted Matrix",
    difficulty: "Medium",
    tags: ["Binary Search", "Matrix", "Heap"],
    statement: "Given an n x n matrix where each row and column is sorted in ascending order, return the kth smallest element in the matrix.",
    examples: [
      { input: "matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8", output: "13" },
      { input: "matrix = [[-5]], k = 1", output: "-5" },
    ],
    intuition: "Binary search on the value range [matrix[0][0], matrix[n-1][n-1]]. For a mid value, count how many elements are <= mid using the staircase technique. Find the smallest value where this count >= k.",
    approach: [
      "Set lo = matrix[0][0], hi = matrix[n-1][n-1].",
      "While lo < hi, compute mid.",
      "Count elements <= mid using a staircase walk (start top-right, move left/down).",
      "If count >= k, hi = mid; else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `function kthSmallest(matrix, k) {
  const n = matrix.length;
  let lo = matrix[0][0], hi = matrix[n - 1][n - 1];
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let count = 0, col = n - 1;
    for (let row = 0; row < n; row++) {
      while (col >= 0 && matrix[row][col] > mid) col--;
      count += col + 1;
    }
    if (count >= k) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log(max-min))", space: "O(1)" },
    systemDesign: "Finding the kth smallest across sorted partitions models distributed order-statistics queries: each shard holds a sorted segment, and binary search on the global value range counts qualifying elements across shards to locate the kth order statistic — used in approximate quantile computation in analytics platforms.",
    pitfalls: ["lo converges to a value that actually exists in the matrix because the count jumps only at matrix values.", "The staircase count must be done in O(n) per iteration for overall O(n log(max-min)) complexity."],
  },
  {
    id: "binary-search-32",
    title: "Smallest Divisor Given a Threshold",
    difficulty: "Medium",
    tags: ["Binary Search", "Array"],
    statement: "Given an array nums and an integer threshold, return the smallest positive integer divisor such that the sum of ceiling(nums[i] / divisor) for all i is <= threshold.",
    examples: [
      { input: "nums = [1,2,5,9], threshold = 6", output: "5" },
      { input: "nums = [44,22,33,11,100], threshold = 5", output: "44" },
    ],
    intuition: "Binary search on the divisor value. A larger divisor yields a smaller sum. Find the smallest divisor where the sum does not exceed threshold.",
    approach: [
      "Set lo = 1, hi = max(nums).",
      "While lo < hi, compute mid.",
      "Compute sum = sum of Math.ceil(n / mid) for all n.",
      "If sum <= threshold, hi = mid; else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `function smallestDivisor(nums, threshold) {
  let lo = 1, hi = Math.max(...nums);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const sum = nums.reduce((s, n) => s + Math.ceil(n / mid), 0);
    if (sum <= threshold) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log(max))", space: "O(1)" },
    systemDesign: "Binary search on a divisor to minimise an aggregate is analogous to finding the optimal sharding key granularity: larger shards reduce the total partition count (sum), but you need the minimum granularity (divisor) that keeps the number of partitions within the cluster's capacity (threshold).",
    pitfalls: ["Use Math.ceil for integer ceiling division. JavaScript's Math.ceil handles this correctly.", "lo starts at 1 because divisor must be a positive integer."],
  },
  {
    id: "binary-search-33",
    title: "Minimum Speed to Arrive on Time",
    difficulty: "Medium",
    tags: ["Binary Search", "Array"],
    statement: "You must take n trains to work. Train i takes dist[i] km. All but the last train depart at whole-hour intervals (you wait for the next hour after each). Return the minimum integer speed such that you arrive within hour hours, or -1 if impossible.",
    examples: [
      { input: "dist = [1,3,2], hour = 6", output: "1" },
      { input: "dist = [1,3,2], hour = 2.7", output: "3" },
      { input: "dist = [1,3,2], hour = 1.9", output: "-1" },
    ],
    intuition: "Binary search on speed. For a given speed, compute the total hours. The first n-1 trains round up to the next hour; the last does not. Find the minimum speed where total hours <= given hours.",
    approach: [
      "If hour <= n - 1, return -1 (impossible).",
      "Set lo = 1, hi = 10^7.",
      "While lo < hi, compute mid.",
      "Compute totalHours = sum of Math.ceil(dist[i] / mid) for i < n-1, plus dist[n-1] / mid.",
      "If totalHours <= hour, hi = mid; else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `function minSpeedOnTime(dist, hour) {
  const n = dist.length;
  if (hour <= n - 1) return -1;
  let lo = 1, hi = 1e7;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let t = 0;
    for (let i = 0; i < n - 1; i++) t += Math.ceil(dist[i] / mid);
    t += dist[n - 1] / mid;
    if (t <= hour) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log(10^7))", space: "O(1)" },
    systemDesign: "Minimum speed for on-time arrival models minimum network bandwidth provisioning: find the minimum throughput (speed) such that all data transfers complete within a deadline (hour), with each transfer starting after the previous completes on a fixed interval — a common SLA guarantee in data pipeline design.",
    pitfalls: ["When hour <= n - 1 return -1 immediately — you need at least 1 hour per intermediate train.", "Only the last segment does not round up. Use floating-point comparison carefully with the hour limit."],
  },
  {
    id: "binary-search-34",
    title: "Maximum Value at a Given Index in a Bounded Array",
    difficulty: "Medium",
    tags: ["Binary Search", "Greedy"],
    statement: "Given integers n, index, and maxSum, construct an array of n positive integers where the element at index is maximised, adjacent elements differ by at most 1, and the total sum does not exceed maxSum.",
    examples: [
      { input: "n = 4, index = 2, maxSum = 6", output: "2" },
      { input: "n = 6, index = 1, maxSum = 10", output: "3" },
    ],
    intuition: "Binary search on the value at index. For a given peak value v, the minimum possible total sum is determined by the arithmetic ramp-down on both sides. Find the maximum v where this sum <= maxSum.",
    approach: [
      "Define minSum(v): given peak v at index, compute the triangular sum ramping down to 1 on both sides.",
      "Set lo = 1, hi = maxSum.",
      "While lo < hi, compute mid.",
      "If minSum(mid) <= maxSum, lo = mid + 1; else hi = mid.",
      "Return lo - 1.",
    ],
    solution: `function maxValue(n, index, maxSum) {
  function minSum(v) {
    const leftLen = index;
    const rightLen = n - index - 1;
    function ramp(len, peak) {
      if (peak >= len + 1) return (peak + peak - len) * (len + 1) / 2;
      return peak * (peak + 1) / 2 + (len - peak + 1);
    }
    return ramp(leftLen, v - 1) + v + ramp(rightLen, v - 1);
  }
  let lo = 1, hi = maxSum;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (minSum(mid) <= maxSum) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(log(maxSum))", space: "O(1)" },
    systemDesign: "Maximising a peak value subject to a sum budget models optimal resource allocation in cloud pricing: maximise the compute allocation at the busiest node while keeping total cluster cost within budget, with neighbouring nodes scaling proportionally — a pattern in autoscaling policy design.",
    pitfalls: ["The ramp function must account for when peak exceeds the side length (the ramp hits 1 before the edge).", "Use ceiling division for mid to avoid infinite loop when lo = hi - 1."],
  },
  {
    id: "binary-search-35",
    title: "Find Right Interval",
    difficulty: "Medium",
    tags: ["Binary Search", "Array", "Sorting"],
    statement: "You are given an array of intervals where intervals[i] = [start_i, end_i]. For each interval, find the index of the minimum start interval that begins at or after the end of this interval. Return -1 if no such interval exists.",
    examples: [
      { input: "intervals = [[1,2]]", output: "[-1]" },
      { input: "intervals = [[3,4],[2,3],[1,2]]", output: "[-1,0,1]" },
    ],
    intuition: "Store start times with their original indices. Sort by start time. For each interval's end, binary search the sorted starts for the smallest start >= end.",
    approach: [
      "Create sorted array of [startTime, originalIndex] pairs.",
      "For each interval, binary search sorted starts for smallest start >= interval.end.",
      "Append the found original index (or -1) to the result.",
    ],
    solution: `function findRightInterval(intervals) {
  const starts = intervals.map(([s], i) => [s, i]).sort((a, b) => a[0] - b[0]);
  const result = [];
  for (const [, end] of intervals) {
    let lo = 0, hi = starts.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (starts[mid][0] >= end) hi = mid;
      else lo = mid + 1;
    }
    result.push(lo < starts.length ? starts[lo][1] : -1);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Finding the next interval with start >= current end is the core of interval scheduling in calendar and reservation systems: given a meeting end time, binary search the sorted start times to find the earliest available next slot — used in conference room booking and task scheduling engines.",
    pitfalls: ["Store original indices before sorting because sorting rearranges the array.", "Binary search for the lower bound of end in the sorted starts array."],
  },
  // ---- HARD (15 problems) ----
  {
    id: "binary-search-36",
    title: "Split Array Largest Sum",
    difficulty: "Hard",
    tags: ["Binary Search", "Dynamic Programming", "Greedy"],
    statement: "Given an integer array nums and an integer k, split nums into k non-empty subarrays to minimise the largest subarray sum. Return this minimised largest sum.",
    examples: [
      { input: "nums = [7,2,5,10,8], k = 2", output: "18" },
      { input: "nums = [1,2,3,4,5], k = 2", output: "9" },
    ],
    intuition: "Binary search on the answer: the largest sum ranges from max(nums) to sum(nums). For a given maximum allowed sum, check if it is possible to split into at most k subarrays using a greedy scan.",
    approach: [
      "Set lo = max(nums), hi = sum(nums).",
      "While lo < hi, compute mid.",
      "Greedily count splits needed with max subarray sum = mid.",
      "If splits <= k, hi = mid; else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `function splitArray(nums, k) {
  let lo = Math.max(...nums), hi = nums.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    let parts = 1, cur = 0;
    for (const n of nums) {
      if (cur + n > mid) { parts++; cur = 0; }
      cur += n;
    }
    if (parts <= k) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log(sum))", space: "O(1)" },
    systemDesign: "Minimising the maximum partition load (the largest subarray sum) is exactly the load balancing problem: split work among k servers to minimise the bottleneck server's load. Binary search on the answer is the standard approach in capacity planning for ETL pipelines and MapReduce job scheduling.",
    pitfalls: ["lo starts at max(nums): each subarray must hold at least the largest element.", "The greedy check: greedily fill each partition up to mid; count how many partitions are needed."],
  },
  {
    id: "binary-search-37",
    title: "Find Minimum in Rotated Sorted Array II",
    difficulty: "Hard",
    tags: ["Binary Search", "Array"],
    statement: "Given a rotated sorted array nums that may contain duplicates, return the minimum element. The algorithm should run in O(log n) on average.",
    examples: [
      { input: "nums = [1,3,5]", output: "1" },
      { input: "nums = [2,2,2,0,1]", output: "0" },
    ],
    intuition: "Same as without duplicates, but when nums[mid] === nums[hi] we cannot tell which half to search. Simply decrement hi by 1 to skip a duplicate.",
    approach: [
      "Set lo = 0, hi = n - 1.",
      "While lo < hi: compute mid.",
      "If nums[mid] > nums[hi], lo = mid + 1.",
      "Else if nums[mid] < nums[hi], hi = mid.",
      "Else hi-- (duplicates: cannot determine which half).",
      "Return nums[lo].",
    ],
    solution: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else if (nums[mid] < nums[hi]) hi = mid;
    else hi--;
  }
  return nums[lo];
}`,
    language: "javascript",
    complexity: { time: "O(log n) average, O(n) worst case", space: "O(1)" },
    systemDesign: "Handling duplicates in a sorted-then-rotated structure models version history searches in source control with tagged releases: identical version tags force a linear scan of that range, analogous to the hi-- step, while distinct tags allow O(log n) bisection.",
    pitfalls: ["Worst case O(n) occurs when all elements are identical (e.g., [2,2,2,2,2]).", "hi-- is safer than lo++ because we never exclude the actual minimum when hi points to a duplicate."],
  },
  {
    id: "binary-search-38",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Binary Search", "Array", "Divide and Conquer"],
    statement: "Given two sorted arrays nums1 and nums2 of sizes m and n, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).",
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.0" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.5" },
    ],
    intuition: "Binary search on a partition of the smaller array. A valid partition divides both arrays so that every element in the combined left half is <= every element in the combined right half.",
    approach: [
      "Ensure nums1 is the smaller array (swap if needed).",
      "Binary search partition i in nums1: derive j = (m+n+1)/2 - i.",
      "Check if max(left1, left2) <= min(right1, right2). Adjust lo/hi otherwise.",
      "Compute median from the four boundary elements.",
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
    systemDesign: "Global median computation across distributed sorted segments is used in approximate quantile services (like Netflix's Atlas or Twitter's Finagle): binary search on the value range across shards to find the exact median without merging all data, enabling O(log n) per-shard queries.",
    pitfalls: ["Always binary search the smaller array to ensure O(log min(m,n)) complexity.", "Use ±Infinity sentinels for edge partitions where i=0 or i=m."],
  },
  {
    id: "binary-search-39",
    title: "Find in Mountain Array",
    difficulty: "Hard",
    tags: ["Binary Search", "Array"],
    statement: "You may only call MountainArray.get(index). Given a mountain array (strictly increases then decreases) and a target, return the minimum index where target is found, or -1. Minimise get calls.",
    examples: [
      { input: "mountainArr = [1,2,3,4,5,3,1], target = 3", output: "2" },
      { input: "mountainArr = [0,1,2,4,2,1], target = 3", output: "-1" },
    ],
    intuition: "Three binary searches: first find the peak index, then search the ascending left half, then if not found search the descending right half.",
    approach: [
      "Binary search for the peak index (where arr[mid] > arr[mid+1]).",
      "Binary search target in arr[0..peak] (ascending).",
      "If not found, binary search target in arr[peak..n-1] (descending).",
      "Return the found index or -1.",
    ],
    solution: `var findInMountainArray = function(target, mountainArr) {
  const n = mountainArr.length();
  // Find peak
  let lo = 0, hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (mountainArr.get(mid) < mountainArr.get(mid + 1)) lo = mid + 1;
    else hi = mid;
  }
  const peak = lo;
  // Search ascending left
  lo = 0; hi = peak;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const val = mountainArr.get(mid);
    if (val === target) return mid;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  // Search descending right
  lo = peak + 1; hi = n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const val = mountainArr.get(mid);
    if (val === target) return mid;
    if (val > target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
};`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Searching a unimodal structure with limited oracle access models querying a black-box performance profile (e.g., latency vs. connection pool size): find the peak first, then binary-search each monotonic side. This pattern is used in ML hyperparameter tuning with expensive evaluation budgets.",
    pitfalls: ["Search the ascending half first since we want the minimum index.", "The descending search reverses the comparison: larger mid value means target is to the right."],
  },
  {
    id: "binary-search-40",
    title: "Magnetic Force Between Two Balls (Aggressive Cows)",
    difficulty: "Hard",
    tags: ["Binary Search", "Array", "Greedy"],
    statement: "You have n positions on a line and m balls. Place the balls so that the minimum magnetic force (minimum distance between any two balls) is maximised. Return this maximum minimum distance.",
    examples: [
      { input: "position = [1,2,3,4,7], m = 3", output: "3" },
      { input: "position = [5,4,3,2,1,1000000000], m = 2", output: "999999999" },
    ],
    intuition: "Binary search on the answer (the minimum distance). For a given distance d, check if we can place all m balls such that adjacent balls are at least d apart using a greedy approach.",
    approach: [
      "Sort positions.",
      "Set lo = 1, hi = position[n-1] - position[0].",
      "While lo <= hi, compute mid.",
      "Greedy check: place first ball at position[0], greedily place each subsequent ball at the first position >= last + mid.",
      "If we place all m balls, update best and lo = mid + 1; else hi = mid - 1.",
      "Return best (or lo - 1).",
    ],
    solution: `function maxDistance(position, m) {
  position.sort((a, b) => a - b);
  const n = position.length;
  let lo = 1, hi = position[n - 1] - position[0];
  let ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    let count = 1, last = position[0];
    for (let i = 1; i < n; i++) {
      if (position[i] - last >= mid) { count++; last = position[i]; }
    }
    if (count >= m) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n log(max_pos))", space: "O(1)" },
    systemDesign: "Maximising the minimum distance between placed items models server rack placement in data centres: spread replicas of a partition across racks to maximise the minimum inter-rack distance, improving fault tolerance. Cassandra's rack-aware replication strategy solves exactly this problem.",
    pitfalls: ["Sort positions first — the greedy check requires sorted order.", "Use lo <= hi and track the best answer separately, or use the standard lo < hi leftmost-false pattern."],
  },
  {
    id: "binary-search-41",
    title: "Allocate Minimum Number of Pages",
    difficulty: "Hard",
    tags: ["Binary Search", "Greedy", "Array"],
    statement: "Given an array of book page counts and an integer m (number of students), allocate consecutive books to each student to minimise the maximum pages any student reads. Each student must get at least one book and books are allocated contiguously.",
    examples: [
      { input: "books = [12,34,67,90], m = 2", output: "113", explanation: "Allocate [12,34,67] and [90]; max = 113." },
      { input: "books = [10,20,30,40], m = 2", output: "60" },
    ],
    intuition: "Binary search on the answer (maximum pages). For a given limit, greedily allocate books to students — start a new student when adding a book would exceed the limit. Check if m students suffice.",
    approach: [
      "If books.length < m, return -1.",
      "Set lo = max(books), hi = sum(books).",
      "While lo < hi, compute mid.",
      "Greedily count students needed with max pages = mid.",
      "If students <= m, hi = mid; else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `function allocateMinPages(books, m) {
  if (books.length < m) return -1;
  let lo = Math.max(...books), hi = books.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    let students = 1, pages = 0;
    for (const b of books) {
      if (pages + b > mid) { students++; pages = 0; }
      pages += b;
    }
    if (students <= m) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log(sum))", space: "O(1)" },
    systemDesign: "Allocating contiguous work items to workers to minimise the maximum load is the classic MapReduce partition sizing problem: split input splits among mappers to minimise the slowest mapper's load, directly applicable to Hadoop and Spark job scheduling.",
    pitfalls: ["lo must be max(books): no student can be assigned fewer pages than the largest single book.", "If n < m, it is impossible to give every student at least one book — return -1."],
  },
  {
    id: "binary-search-42",
    title: "Painter's Partition Problem",
    difficulty: "Hard",
    tags: ["Binary Search", "Greedy", "Dynamic Programming"],
    statement: "Given an array boards representing the length of each board and an integer k (number of painters), each painter paints a contiguous section and all start simultaneously. Minimise the time to paint all boards (time proportional to total length painted).",
    examples: [
      { input: "boards = [10,20,30,40], k = 2", output: "60", explanation: "Painters paint [10,20,30] and [40]." },
      { input: "boards = [100,200,300,400], k = 3", output: "400" },
    ],
    intuition: "Binary search on the maximum length one painter handles. For a given limit, greedily count painters needed. Find the minimum limit where k painters suffice.",
    approach: [
      "Set lo = max(boards), hi = sum(boards).",
      "While lo < hi, compute mid.",
      "Greedily count painters needed with max length = mid.",
      "If painters <= k, hi = mid; else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `function paintersPartition(boards, k) {
  let lo = Math.max(...boards), hi = boards.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    let painters = 1, len = 0;
    for (const b of boards) {
      if (len + b > mid) { painters++; len = 0; }
      len += b;
    }
    if (painters <= k) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log(sum))", space: "O(1)" },
    systemDesign: "The Painter's Partition problem is structurally identical to load balancing parallel workers in distributed systems: assign contiguous file chunks to parallel upload workers to minimise the total upload time, used in S3 multipart upload orchestration.",
    pitfalls: ["This is the same algorithm as Split Array Largest Sum and Allocate Min Pages — recognising the pattern saves time.", "lo = max(boards) ensures each painter handles at least the longest single board."],
  },
  {
    id: "binary-search-43",
    title: "Minimize Max Distance to Gas Station",
    difficulty: "Hard",
    tags: ["Binary Search", "Greedy", "Array"],
    statement: "You have n gas stations on a highway at sorted positions. You must add k new stations. Minimise the maximum distance between adjacent stations after adding k stations. Return the answer with at most 10^-6 error.",
    examples: [
      { input: "stations = [1,2,3,4,5,6,7,8,9,10], k = 9", output: "0.5" },
      { input: "stations = [23,24,36,39,46,56,57,65,84,98], k = 1", output: "14.0" },
    ],
    intuition: "Binary search on the maximum gap (floating point). For a given gap d, count the minimum new stations needed to make all gaps <= d. Find the smallest d where this count <= k.",
    approach: [
      "Set lo = 0, hi = max gap between adjacent stations.",
      "Repeat 100 times (or while hi - lo > 1e-6), compute mid.",
      "Count stations needed: for each gap g, add Math.ceil(g / mid) - 1 stations.",
      "If count <= k, hi = mid; else lo = mid.",
      "Return lo.",
    ],
    solution: `function minmaxGasDist(stations, k) {
  let lo = 0, hi = 0;
  for (let i = 1; i < stations.length; i++)
    hi = Math.max(hi, stations[i] - stations[i - 1]);
  for (let iter = 0; iter < 100; iter++) {
    const mid = (lo + hi) / 2;
    let count = 0;
    for (let i = 1; i < stations.length; i++)
      count += Math.ceil((stations[i] - stations[i - 1]) / mid) - 1;
    if (count <= k) hi = mid;
    else lo = mid;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log(1/epsilon))", space: "O(1)" },
    systemDesign: "Minimising maximum gap after adding k relay nodes models CDN edge node placement: add k new edge nodes along a geographic axis to minimise the maximum distance any user is from the nearest edge, improving latency. Binary search on the answer finds the optimal placement threshold.",
    pitfalls: ["Use floating-point binary search with a fixed number of iterations (100) or a precision threshold (1e-7).", "Math.ceil(g / mid) - 1 is the number of new stations needed to split gap g into segments of at most mid."],
  },
  {
    id: "binary-search-44",
    title: "Maximum Number of Removable Characters",
    difficulty: "Hard",
    tags: ["Binary Search", "String", "Array"],
    statement: "You are given strings s and p, and an array removable of indices. Return the maximum k such that p is still a subsequence of s after removing characters at indices removable[0..k-1].",
    examples: [
      { input: "s = 'abcacb', p = 'ab', removable = [3,1,0]", output: "2" },
      { input: "s = 'abcbddddd', p = 'abcd', removable = [3,2,1,4,5,6]", output: "1" },
    ],
    intuition: "Binary search on k. For a given k, mark the first k removed indices and check if p is still a subsequence. The more indices removed, the less likely p remains a subsequence — monotonic property.",
    approach: [
      "Set lo = 0, hi = removable.length.",
      "While lo < hi: mid = (lo + hi + 1) >> 1.",
      "Mark indices removable[0..mid-1] as removed.",
      "Check if p is a subsequence of s with those characters removed.",
      "If yes, lo = mid; else hi = mid - 1.",
      "Return lo.",
    ],
    solution: `function maximumRemovals(s, p, removable) {
  function isSubseq(k) {
    const removed = new Set(removable.slice(0, k));
    let j = 0;
    for (let i = 0; i < s.length && j < p.length; i++) {
      if (!removed.has(i) && s[i] === p[j]) j++;
    }
    return j === p.length;
  }
  let lo = 0, hi = removable.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (isSubseq(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O((n + m) log k)", space: "O(k)" },
    systemDesign: "Binary search on the number of tolerable failures (removed characters) models fault-tolerance analysis: find the maximum number of nodes that can be removed from a network path while still maintaining connectivity (p as a subsequence of s), used in resilience planning for distributed systems.",
    pitfalls: ["Use the rightmost true binary search pattern (lo < hi, mid = (lo+hi+1)>>1, lo=mid on true).", "Creating a new Set each iteration is O(k) per call — this is acceptable given O(log k) iterations."],
  },
  {
    id: "binary-search-45",
    title: "Russian Doll Envelopes",
    difficulty: "Hard",
    tags: ["Binary Search", "Dynamic Programming", "Sorting"],
    statement: "You have envelopes with widths and heights. You can put an envelope inside another only if both dimensions are strictly larger. Return the maximum number of envelopes you can nest.",
    examples: [
      { input: "envelopes = [[5,4],[6,4],[6,7],[2,3]]", output: "3", explanation: "[2,3] -> [5,4] -> [6,7]." },
      { input: "envelopes = [[1,1],[1,1]]", output: "1" },
    ],
    intuition: "Sort by width ascending; for equal widths sort by height descending (to prevent using two envelopes with the same width). Then run Longest Increasing Subsequence (LIS) on heights using binary search.",
    approach: [
      "Sort: ascending width, descending height for ties.",
      "Run LIS with binary search on the heights array.",
      "Maintain a tails array; for each height binary search for its position.",
      "Return tails.length.",
    ],
    solution: `function maxEnvelopes(envelopes) {
  envelopes.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : b[1] - a[1]);
  const tails = [];
  for (const [, h] of envelopes) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < h) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = h;
  }
  return tails.length;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "LIS with binary search models dependency chain analysis: given versioned software packages where each version must have strictly greater major and minor versions than the previous, find the longest valid upgrade chain. This appears in semantic versioning compatibility checks in package managers.",
    pitfalls: ["Sort equal widths by descending height — this prevents counting two same-width envelopes in the LIS.", "The tails array stores the smallest tail of LIS of each length, not the actual LIS sequence."],
  },
  {
    id: "binary-search-46",
    title: "Number of Ships in a Rectangle",
    difficulty: "Hard",
    tags: ["Binary Search", "Divide and Conquer"],
    statement: "You have a Sea object with hasShips(topRight, bottomLeft) that returns true if there is at least one ship in the rectangle. Count the exact number of ships in a given rectangle. Ships are at integer coordinates with at most 10 ships.",
    examples: [
      { input: "sea has ships at [[1,1],[2,2],[3,3],[5,5]], topRight=[4,4], bottomLeft=[0,0]", output: "3" },
    ],
    intuition: "Divide and conquer: if the rectangle has no ships, return 0. If it is a 1x1 cell, return 1. Otherwise split into four quadrants and recurse.",
    approach: [
      "If !hasShips(topRight, bottomLeft), return 0.",
      "If topRight == bottomLeft, return 1 (single cell with a ship).",
      "Split the rectangle into 4 quadrants at the midpoint.",
      "Return sum of recursive results for all 4 quadrants.",
    ],
    solution: `var countShips = function(sea, topRight, bottomLeft) {
  if (!sea.hasShips(topRight, bottomLeft)) return 0;
  if (topRight[0] === bottomLeft[0] && topRight[1] === bottomLeft[1]) return 1;
  const midX = Math.floor((topRight[0] + bottomLeft[0]) / 2);
  const midY = Math.floor((topRight[1] + bottomLeft[1]) / 2);
  return (
    countShips(sea, [midX, midY], bottomLeft) +
    countShips(sea, topRight, [midX + 1, midY + 1]) +
    countShips(sea, [midX, topRight[1]], [bottomLeft[0], midY + 1]) +
    countShips(sea, [topRight[0], midY], [midX + 1, bottomLeft[1]])
  );
};`,
    language: "javascript",
    complexity: { time: "O(S log(max_coord)^2)", space: "O(log(max_coord)^2)" },
    systemDesign: "Spatial divide-and-conquer with an oracle is the basis of quad-tree indexing in geospatial databases (PostGIS, Google S2): recursively partition the space and query only non-empty cells. This minimises expensive API calls — analogous to reducing database round-trips by pruning empty spatial cells early.",
    pitfalls: ["Early exit when hasShips returns false — this is the key optimisation.", "Split coordinates carefully to avoid infinite recursion: ensure the four quadrants partition the rectangle without overlap."],
  },
  {
    id: "binary-search-47",
    title: "Median from Data Stream (with Binary Search Insert)",
    difficulty: "Hard",
    tags: ["Binary Search", "Design", "Sorting"],
    statement: "Design a data structure that supports adding numbers from a stream and finding the median of all numbers added so far. Implement addNum(int num) and findMedian().",
    examples: [
      { input: "addNum(1), addNum(2), findMedian(), addNum(3), findMedian()", output: "1.5, 2.0" },
    ],
    intuition: "Maintain a sorted array. Use binary search to find the insertion point for each new number, keeping the array sorted at all times. The median is the middle element (or average of two middles).",
    approach: [
      "Maintain a sorted array data.",
      "On addNum, binary search for the insertion index and splice the number in.",
      "On findMedian, return data[mid] for odd length, or average of data[mid-1] and data[mid] for even.",
    ],
    solution: `class MedianFinder {
  constructor() {
    this.data = [];
  }
  addNum(num) {
    let lo = 0, hi = this.data.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.data[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    this.data.splice(lo, 0, num);
  }
  findMedian() {
    const n = this.data.length;
    const mid = n >> 1;
    if (n % 2 === 1) return this.data[mid];
    return (this.data[mid - 1] + this.data[mid]) / 2;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n) per addNum (splice), O(1) per findMedian", space: "O(n)" },
    systemDesign: "Streaming median computation is critical in real-time monitoring dashboards (P50 latency of live requests). Production systems use two heaps (O(log n) insert) or a skip list. The binary-search-insert version illustrates how sorted-array maintains are used in time-series databases for small datasets with frequent median queries.",
    pitfalls: ["The binary search gives O(log n) for finding the position, but splice is O(n) for shifting elements.", "The two-heap approach (one max-heap for lower half, one min-heap for upper half) achieves O(log n) inserts."],
  },
  {
    id: "binary-search-48",
    title: "Count of Range Sum",
    difficulty: "Hard",
    tags: ["Binary Search", "Divide and Conquer", "Merge Sort", "Prefix Sum"],
    statement: "Given an integer array nums and two integers lower and upper, return the number of range sums that lie in [lower, upper] inclusive. A range sum S(i, j) = nums[i] + ... + nums[j].",
    examples: [
      { input: "nums = [-2,5,-1], lower = -2, upper = 2", output: "3", explanation: "Ranges: [0,0]=−2, [2,2]=−1, [0,2]=2." },
      { input: "nums = [0], lower = 0, upper = 0", output: "1" },
    ],
    intuition: "Build the prefix sum array. A range sum S(i,j) = prefix[j+1] - prefix[i]. Count pairs (i,j) where lower <= prefix[j+1] - prefix[i] <= upper using merge sort to count inversions in O(n log n).",
    approach: [
      "Build prefix sums.",
      "Merge sort on prefix sums: during merge, for each right-half element prefix[j], binary search the left half for the range [prefix[j] - upper, prefix[j] - lower].",
      "Count qualifying left-half elements.",
      "Return total count.",
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
    return merge(left, right);
  }
  function merge(a, b) {
    const res = []; let i = 0, j = 0;
    while (i < a.length && j < b.length) a[i] <= b[j] ? res.push(a[i++]) : res.push(b[j++]);
    return res.concat(a.slice(i), b.slice(j));
  }
  mergeSort(prefix);
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Range sum counting appears in time-series anomaly detection: count the number of time windows where the net change (sum) falls within a suspicious range. Financial fraud systems use similar merge-sort inversion counting to find abnormal transaction windows across millions of records efficiently.",
    pitfalls: ["Use prefix[j+1] - prefix[i] for range sum S(i,j); the prefix array has length n+1.", "The two-pointer lo/hi inside the merge step must be reset for each right element."],
  },
  {
    id: "binary-search-49",
    title: "Minimum Cost to Make Array Equal",
    difficulty: "Hard",
    tags: ["Binary Search", "Array", "Greedy"],
    statement: "You have a 0-indexed integer array nums and a cost array cost. You can increment or decrement any element by 1, and the cost is cost[i] per operation on nums[i]. Return the minimum total cost to make all elements equal.",
    examples: [
      { input: "nums = [1,3,5,2], cost = [2,3,1,14]", output: "8", explanation: "Make all equal to 2: 2*1 + 3*1 + 1*3 + 14*0 = 8." },
      { input: "nums = [2,2,2,2,2], cost = [4,2,8,1,3]", output: "0" },
    ],
    intuition: "The optimal target value is the weighted median of nums (weighted by cost). Binary search over the target value: the total cost function is convex (unimodal), so ternary search or binary search on the derivative works.",
    approach: [
      "Define totalCost(t) = sum of cost[i] * abs(nums[i] - t) for all i.",
      "Binary search on t in [min(nums), max(nums)].",
      "Compare totalCost(mid) with totalCost(mid+1) to determine which half to search.",
      "If cost(mid) > cost(mid+1), search right; else search left.",
      "Return totalCost(lo).",
    ],
    solution: `function minCost(nums, cost) {
  function totalCost(t) {
    let c = 0;
    for (let i = 0; i < nums.length; i++) c += cost[i] * Math.abs(nums[i] - t);
    return c;
  }
  let lo = Math.min(...nums), hi = Math.max(...nums);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (totalCost(mid) > totalCost(mid + 1)) lo = mid + 1;
    else hi = mid;
  }
  return totalCost(lo);
}`,
    language: "javascript",
    complexity: { time: "O(n log(max-min))", space: "O(1)" },
    systemDesign: "Minimising weighted total distance to an equalisation target models data centre cost optimisation: find the optimal region to migrate all services such that total data transfer cost (weighted by data volume) is minimised — a real problem solved by major cloud providers when planning inter-region migrations.",
    pitfalls: ["The cost function is convex in the target value, enabling binary search on the derivative.", "Compare cost(mid) vs cost(mid+1) to decide direction — if cost decreases moving right, search right half."],
  },
  {
    id: "binary-search-50",
    title: "Minimum Time to Repair Cars",
    difficulty: "Hard",
    tags: ["Binary Search", "Array", "Greedy"],
    statement: "You have n mechanics with ranks[i]. A mechanic with rank r repairs n cars in r*n*n minutes. All work in parallel. Return the minimum time to repair all cars.",
    examples: [
      { input: "ranks = [4,2,3,1], cars = 10", output: "16", explanation: "Mechanic with rank 1 repairs 4 cars in 16 min, rank 2 repairs 2 cars in 8 min, etc. Total = 10." },
      { input: "ranks = [5,1,8], cars = 6", output: "16" },
    ],
    intuition: "Binary search on time t. For a given time t, each mechanic with rank r can repair floor(sqrt(t/r)) cars. Check if the total cars repaired across all mechanics >= required cars.",
    approach: [
      "Set lo = 1, hi = min(ranks) * cars * cars (worst case: one mechanic does all).",
      "While lo < hi, compute mid.",
      "Count total cars repaired in mid minutes: sum of floor(sqrt(mid / r)) for each r.",
      "If total >= cars, hi = mid; else lo = mid + 1.",
      "Return lo.",
    ],
    solution: `function repairCars(ranks, cars) {
  let lo = 1, hi = Math.min(...ranks) * cars * cars;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let total = 0;
    for (const r of ranks) total += Math.floor(Math.sqrt(mid / r));
    if (total >= cars) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    language: "javascript",
    complexity: { time: "O(n log(min_rank * cars^2))", space: "O(1)" },
    systemDesign: "Binary search on parallel work completion time models cloud autoscaling: given n workers with different throughputs, find the minimum time to process all jobs when workers operate in parallel. This is how Kubernetes Horizontal Pod Autoscaler estimates time-to-complete under a given replica count.",
    pitfalls: ["hi = min(ranks) * cars * cars: the fastest mechanic doing all cars gives the upper bound.", "Use Math.floor(Math.sqrt(mid / r)) for integer car counts — each mechanic repairs whole cars only."],
  },
];
