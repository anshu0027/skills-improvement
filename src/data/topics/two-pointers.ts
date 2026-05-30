import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  // ---- EASY (17 problems) ----
  {
    id: "two-pointers-01",
    title: "Valid Palindrome",
    difficulty: "Easy",
    tags: ["Two Pointers", "String"],
    statement: "Given a string s, return true if it is a palindrome, considering only alphanumeric characters and ignoring case.",
    examples: [
      { input: "s = \"A man, a plan, a canal: Panama\"", output: "true", explanation: "After filtering, 'amanaplanacanalpanama' reads the same forwards and backwards." },
      { input: "s = \"race a car\"", output: "false" },
      { input: "s = \" \"", output: "true", explanation: "Empty string after filtering is a palindrome." },
    ],
    intuition: "Put one finger at the start and one at the end. Skip non-letters, then compare the characters under each finger. If they ever differ, it is not a palindrome.",
    approach: [
      "Set left=0, right=s.length-1.",
      "While left < right, skip non-alphanumeric characters on both sides.",
      "Compare lowercase of s[left] and s[right]; if they differ, return false.",
      "Advance both pointers inward and repeat.",
      "Return true if the loop completes.",
    ],
    solution: `function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  const isAlnum = c => /[a-zA-Z0-9]/.test(c);
  while (l < r) {
    while (l < r && !isAlnum(s[l])) l++;
    while (l < r && !isAlnum(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Palindrome checks on cleaned strings model canonical-form comparison in data deduplication pipelines where records must be normalised (strip punctuation, lowercase) before equality checks. The same skip-and-compare pattern is used in fuzzy-matching layers of search engines to compare tokens after stop-word removal.",
    pitfalls: ["Skip non-alphanumeric characters before each comparison, not just once at the start.", "A string with only non-alphanumeric characters (e.g. ' ') is an empty palindrome — return true."],
  },
  {
    id: "two-pointers-02",
    title: "Two Sum II - Input Array Is Sorted",
    difficulty: "Easy",
    tags: ["Two Pointers", "Array", "Binary Search"],
    statement: "Given a 1-indexed sorted array numbers and a target integer, find two numbers that add up to target. Return their indices as [index1, index2] (1-indexed). Exactly one solution exists.",
    examples: [
      { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]", explanation: "2 + 7 = 9." },
      { input: "numbers = [2,3,4], target = 6", output: "[1,3]" },
      { input: "numbers = [-1,0], target = -1", output: "[1,2]" },
    ],
    intuition: "The array is sorted, so place one pointer at the smallest number and one at the largest. If their sum is too big, move the right pointer left; if too small, move the left pointer right.",
    approach: [
      "Set left=0, right=n-1.",
      "Compute sum = numbers[left] + numbers[right].",
      "If sum === target, return [left+1, right+1].",
      "If sum < target, advance left; else retreat right.",
    ],
    solution: `function twoSum(numbers, target) {
  let l = 0, r = numbers.length - 1;
  while (l < r) {
    const s = numbers[l] + numbers[r];
    if (s === target) return [l + 1, r + 1];
    if (s < target) l++; else r--;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Two-pointer search on a sorted structure is the foundation of merge-join in relational databases: two sorted relations are scanned simultaneously with a pointer on each, advancing the smaller key — the most efficient join strategy when both sides are pre-sorted on the join key.",
    pitfalls: ["The array is 1-indexed in the problem statement — return left+1 and right+1.", "Because exactly one solution is guaranteed, the loop will always terminate before pointers cross."],
  },
  {
    id: "two-pointers-03",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    tags: ["Two Pointers", "Array"],
    statement: "Given a sorted integer array nums, remove duplicates in-place so each unique element appears only once. Return the count k of unique elements. The first k elements of nums must hold the result.",
    examples: [
      { input: "nums = [1,1,2]", output: "2, nums = [1,2,_]" },
      { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5, nums = [0,1,2,3,4,_,_,_,_,_]" },
    ],
    intuition: "Use a slow pointer that advances only when the current element is different from the one before it. The slow pointer marks the next position to write a new unique value.",
    approach: [
      "Start with a write pointer k=1 (first element is always unique).",
      "Walk i from 1 to end; whenever nums[i] !== nums[i-1], set nums[k++] = nums[i].",
      "Return k.",
    ],
    solution: `function removeDuplicates(nums) {
  let k = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) nums[k++] = nums[i];
  }
  return k;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "In-place deduplication of sorted data is the core of SSTable compaction in LSM-tree storage engines (RocksDB, Cassandra): during a merge pass, adjacent identical keys are collapsed to the latest version, reducing storage and speeding up future reads without allocating new memory.",
    pitfalls: ["The array is already sorted, so duplicates are always adjacent — no extra bookkeeping needed.", "Return k, not the modified array — the judge checks only the first k elements."],
  },
  {
    id: "two-pointers-04",
    title: "Remove Element",
    difficulty: "Easy",
    tags: ["Two Pointers", "Array"],
    statement: "Given an integer array nums and an integer val, remove all occurrences of val in-place. Return the count k of remaining elements. The first k elements must hold the result in any order.",
    examples: [
      { input: "nums = [3,2,2,3], val = 3", output: "2, nums = [2,2,_,_]" },
      { input: "nums = [0,1,2,2,3,0,4,2], val = 2", output: "5, nums = [0,1,4,0,3,_,_,_]" },
    ],
    intuition: "Use a write pointer that only advances when the current element is not the value to remove. Overwrite positions with good values.",
    approach: [
      "Initialize write pointer k=0.",
      "Iterate i from 0 to end; if nums[i] !== val, set nums[k++] = nums[i].",
      "Return k.",
    ],
    solution: `function removeElement(nums, val) {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) nums[k++] = nums[i];
  }
  return k;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "In-place filtering is used in streaming log processors that must drop events matching a discard rule without buffering; only valid events are forwarded. Database engines apply the same technique during a full-table scan with a WHERE clause — rows failing the predicate are skipped in a single pass.",
    pitfalls: ["Order of remaining elements is allowed to change, so no shifting is needed.", "If val does not appear at all, k equals n and no writes occur."],
  },
  {
    id: "two-pointers-05",
    title: "Move Zeroes",
    difficulty: "Easy",
    tags: ["Two Pointers", "Array"],
    statement: "Given an integer array nums, move all zeros to the end while maintaining the relative order of non-zero elements. Do it in-place without making a copy.",
    examples: [
      { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
      { input: "nums = [0]", output: "[0]" },
    ],
    intuition: "Use a slow write pointer that only moves forward when it places a non-zero number. After packing all non-zeros to the front, fill the rest with zeros.",
    approach: [
      "Initialize write pointer pos=0.",
      "Walk i through the array; when nums[i] !== 0, set nums[pos++] = nums[i].",
      "After the loop, fill nums[pos..n-1] with 0.",
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
    systemDesign: "In-place compaction mirrors the mark-compact phase of garbage collection and the space reclamation step in columnar storage engines where deleted rows are tombstoned and then physically removed during a compaction pass without allocating a new buffer.",
    pitfalls: ["Do not swap zeros and non-zeros in-place — that changes relative order. Write non-zeros first, then zero-fill.", "A fully-zero array is safe — pos stays 0 and every element gets overwritten with 0."],
  },
  {
    id: "two-pointers-06",
    title: "Merge Sorted Array",
    difficulty: "Easy",
    tags: ["Two Pointers", "Array", "Sorting"],
    statement: "Given two sorted integer arrays nums1 (with m+n slots) and nums2 of size n, merge nums2 into nums1 in-place in sorted order. The last n slots of nums1 are initialized to 0.",
    examples: [
      { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
      { input: "nums1 = [1], m = 1, nums2 = [], n = 0", output: "[1]" },
    ],
    intuition: "Fill the merged array from the back. The largest element between the two arrays goes in the last slot. Working backwards means you never overwrite an unprocessed value.",
    approach: [
      "Set p1=m-1, p2=n-1, p=m+n-1.",
      "While p2 >= 0: if p1 >= 0 and nums1[p1] > nums2[p2], place nums1[p1] at p; else place nums2[p2] at p.",
      "Advance the chosen pointer and decrement p.",
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
    systemDesign: "Back-fill merging is the kernel of merge-sort's combine step used in database external sort. LSM-tree engines (RocksDB, Cassandra) use sorted-run merging during compaction to maintain a globally sorted key order across SSTables without extra allocation.",
    pitfalls: ["Merge from the back to avoid overwriting unread nums1 elements.", "If nums2 is exhausted first, the remaining nums1 elements are already in the correct positions."],
  },
  {
    id: "two-pointers-07",
    title: "Squares of a Sorted Array",
    difficulty: "Easy",
    tags: ["Two Pointers", "Array", "Sorting"],
    statement: "Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.",
    examples: [
      { input: "nums = [-4,-1,0,3,10]", output: "[0,1,9,16,100]" },
      { input: "nums = [-7,-3,2,3,11]", output: "[4,9,9,49,121]" },
    ],
    intuition: "The largest squares live at both ends because large negatives square to large positives. Compare the outermost values and fill the result array from back to front.",
    approach: [
      "Set left=0, right=n-1, pos=n-1.",
      "Compare absolute values at both pointers; place the larger square at result[pos--].",
      "Advance the chosen pointer inward.",
    ],
    solution: `function sortedSquares(nums) {
  const n = nums.length;
  const res = new Array(n);
  let l = 0, r = n - 1, pos = n - 1;
  while (l <= r) {
    const l2 = nums[l] * nums[l];
    const r2 = nums[r] * nums[r];
    if (l2 > r2) { res[pos--] = l2; l++; }
    else { res[pos--] = r2; r--; }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Merging two sorted streams from opposite ends mirrors how external merge-sort combines ascending and descending sorted partitions, and is the pattern used when Lucene/Elasticsearch merges index segments that were written in different sort orders.",
    pitfalls: ["Filling from the back avoids the need for a second sort pass.", "Both ends may produce equal square values — either pointer can advance; be consistent."],
  },
  {
    id: "two-pointers-08",
    title: "Reverse String",
    difficulty: "Easy",
    tags: ["Two Pointers", "String"],
    statement: "Write a function that reverses a character array s in-place. You must do this with O(1) extra memory.",
    examples: [
      { input: "s = ['h','e','l','l','o']", output: "['o','l','l','e','h']" },
      { input: "s = ['H','a','n','n','a','h']", output: "['h','a','n','n','a','H']" },
    ],
    intuition: "Swap the outermost pair of characters, then move both pointers inward and repeat until they meet in the middle — like turning a sock inside out from both ends simultaneously.",
    approach: [
      "Set left=0, right=n-1.",
      "While left < right, swap s[left] and s[right], then advance both pointers.",
    ],
    solution: `function reverseString(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    [s[l], s[r]] = [s[r], s[l]];
    l++; r--;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "In-place reversal is used in network byte-order conversion (big-endian to little-endian) and in circular buffer implementations where the tail wraps around — both require reversing a segment of a buffer without extra allocation.",
    pitfalls: ["Even-length arrays have no middle element — the loop terminates correctly when left === right or crosses.", "Swapping with destructuring is idiomatic in JavaScript; no temp variable needed."],
  },
  {
    id: "two-pointers-09",
    title: "Is Subsequence",
    difficulty: "Easy",
    tags: ["Two Pointers", "String", "Dynamic Programming"],
    statement: "Given two strings s and t, return true if s is a subsequence of t. A subsequence preserves the relative order of characters but does not require them to be contiguous.",
    examples: [
      { input: "s = \"abc\", t = \"ahbgdc\"", output: "true" },
      { input: "s = \"axc\", t = \"ahbgdc\"", output: "false" },
    ],
    intuition: "Walk through t with one pointer and s with another. Every time the current character of t matches the current character of s, advance the s pointer. If the s pointer reaches the end, all characters were matched.",
    approach: [
      "Set i=0 (pointer into s), j=0 (pointer into t).",
      "While i < s.length and j < t.length: if s[i] === t[j], increment i. Always increment j.",
      "Return i === s.length.",
    ],
    solution: `function isSubsequence(s, t) {
  let i = 0;
  for (let j = 0; j < t.length && i < s.length; j++) {
    if (s[i] === t[j]) i++;
  }
  return i === s.length;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Subsequence matching underpins fuzzy search in IDEs (e.g. VS Code's command palette uses subsequence scoring) and in DNA sequence alignment (finding a gene pattern within a genome). For the follow-up with many queries, binary search on pre-built character-position lists reduces each query to O(|s| log |t|).",
    pitfalls: ["An empty s is always a subsequence of any t — i starts at 0 and is immediately equal to s.length.", "Do not confuse subsequence (order-preserving, non-contiguous) with substring (contiguous)."],
  },
  {
    id: "two-pointers-10",
    title: "Intersection of Two Arrays II",
    difficulty: "Easy",
    tags: ["Two Pointers", "Array", "Hashing", "Sorting"],
    statement: "Given two integer arrays nums1 and nums2, return an array of their intersection where each element appears as many times as it appears in both arrays.",
    examples: [
      { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2,2]" },
      { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", output: "[4,9]" },
    ],
    intuition: "Sort both arrays, then use two pointers — one per array. Advance the pointer on the smaller value; when values match, collect the element and advance both.",
    approach: [
      "Sort both arrays.",
      "Set i=0, j=0, result=[].",
      "While both pointers are valid: if nums1[i] < nums2[j], i++; if nums1[i] > nums2[j], j++; else push nums1[i] to result, advance both.",
      "Return result.",
    ],
    solution: `function intersect(nums1, nums2) {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);
  const res = [];
  let i = 0, j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] < nums2[j]) i++;
    else if (nums1[i] > nums2[j]) j++;
    else { res.push(nums1[i]); i++; j++; }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(m log m + n log n)", space: "O(1)" },
    systemDesign: "Two-pointer sorted-set intersection is the merge-join algorithm used by relational databases when both input relations are sorted on the join key. It is also how inverted index posting list intersection works in search engines (AND queries across sorted docID lists).",
    pitfalls: ["This approach requires sorting; if arrays are already sorted, it is O(m+n).", "For unsorted arrays where memory is cheap, a frequency map approach is O(m+n) without sorting."],
  },
  {
    id: "two-pointers-11",
    title: "Backspace String Compare",
    difficulty: "Easy",
    tags: ["Two Pointers", "String", "Stack"],
    statement: "Given two strings s and t where '#' represents a backspace, return true if they are equal after processing all backspaces.",
    examples: [
      { input: "s = \"ab#c\", t = \"ad#c\"", output: "true", explanation: "Both become 'ac'." },
      { input: "s = \"ab##\", t = \"c#d#\"", output: "true", explanation: "Both become ''." },
      { input: "s = \"a#c\", t = \"b\"", output: "false" },
    ],
    intuition: "Process both strings from the right. Keep a skip counter for backspaces. Skip characters that were deleted, and compare the next real character from each string.",
    approach: [
      "Set i=s.length-1, j=t.length-1, skipS=0, skipT=0.",
      "Walk backwards on both: if current char is '#', increment skip count; if skip>0, skip the character; else compare.",
      "If characters differ, return false. Advance both pointers.",
      "Return true if both are exhausted simultaneously.",
    ],
    solution: `function backspaceCompare(s, t) {
  let i = s.length - 1, j = t.length - 1;
  let skipS = 0, skipT = 0;
  while (i >= 0 || j >= 0) {
    while (i >= 0) {
      if (s[i] === "#") { skipS++; i--; }
      else if (skipS > 0) { skipS--; i--; }
      else break;
    }
    while (j >= 0) {
      if (t[j] === "#") { skipT++; j--; }
      else if (skipT > 0) { skipT--; j--; }
      else break;
    }
    if (i >= 0 && j >= 0 && s[i] !== t[j]) return false;
    if ((i >= 0) !== (j >= 0)) return false;
    i--; j--;
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(m+n)", space: "O(1)" },
    systemDesign: "Backspace processing from the right models undo/redo log compaction in databases and editors: instead of re-executing the full history, you scan backwards and cancel out delete operations, emitting only the net result. This pattern is used in CRDT-based collaborative editors to compact operation logs.",
    pitfalls: ["Process all pending backspaces before comparing a character — you may need to skip multiple characters in a row.", "Both strings can be empty after processing — handle the case where both pointers go negative simultaneously (return true)."],
  },
  {
    id: "two-pointers-12",
    title: "Reverse Vowels of a String",
    difficulty: "Easy",
    tags: ["Two Pointers", "String"],
    statement: "Given a string s, reverse only all the vowels in the string and return it.",
    examples: [
      { input: "s = \"hello\"", output: "\"holle\"" },
      { input: "s = \"leetcode\"", output: "\"leotcede\"" },
    ],
    intuition: "Use two pointers from both ends. Skip non-vowels, and when both pointers land on vowels, swap them and move inward.",
    approach: [
      "Convert s to an array for in-place swaps.",
      "Set left=0, right=n-1.",
      "Advance left while not a vowel; retreat right while not a vowel.",
      "Swap s[left] and s[right]; advance both pointers.",
      "Return the array joined back to a string.",
    ],
    solution: `function reverseVowels(s) {
  const vowels = new Set("aeiouAEIOU");
  const arr = s.split("");
  let l = 0, r = arr.length - 1;
  while (l < r) {
    while (l < r && !vowels.has(arr[l])) l++;
    while (l < r && !vowels.has(arr[r])) r--;
    if (l < r) { [arr[l], arr[r]] = [arr[r], arr[l]]; l++; r--; }
  }
  return arr.join("");
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Selective in-place transformation (skip certain elements and process others) is used in data pipeline transformations where only fields matching a predicate are mutated, analogous to a targeted UPDATE statement with a WHERE clause running over a sorted key space.",
    pitfalls: ["Include both uppercase and lowercase vowels in the vowel set.", "After skipping, re-check left < right before swapping to avoid crossing pointers."],
  },
  {
    id: "two-pointers-13",
    title: "Sort Array By Parity",
    difficulty: "Easy",
    tags: ["Two Pointers", "Array"],
    statement: "Given an integer array nums, move all even integers to the beginning followed by all odd integers. Return any valid answer.",
    examples: [
      { input: "nums = [3,1,2,4]", output: "[2,4,3,1]" },
      { input: "nums = [0]", output: "[0]" },
    ],
    intuition: "Use two pointers from both ends. Advance the left pointer while it points to an even number; retreat the right pointer while it points to an odd number. When both are misplaced, swap them.",
    approach: [
      "Set left=0, right=n-1.",
      "While left < right: advance left past even numbers, retreat right past odd numbers.",
      "Swap nums[left] and nums[right]; advance both.",
    ],
    solution: `function sortArrayByParity(nums) {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    while (l < r && nums[l] % 2 === 0) l++;
    while (l < r && nums[r] % 2 !== 0) r--;
    if (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; }
  }
  return nums;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Partitioning by a predicate (even/odd, hot/cold, active/inactive) is the critical inner loop of quicksort's partition step used by database engines for ORDER BY. It also underpins tiered storage routing: hot data goes to SSD (front partition), cold data to HDD (back partition).",
    pitfalls: ["The order within each parity group need not be preserved — any valid grouping is accepted.", "Be careful not to advance both pointers after the swap without re-checking the new values."],
  },
  {
    id: "two-pointers-14",
    title: "Happy Number",
    difficulty: "Easy",
    tags: ["Two Pointers", "Math", "Hash Set", "Floyd Cycle Detection"],
    statement: "A happy number is defined by starting with any positive integer and repeatedly replacing it with the sum of the squares of its digits until it reaches 1 (happy) or loops endlessly (not happy). Return true if n is a happy number.",
    examples: [
      { input: "n = 19", output: "true", explanation: "1² + 9² = 82 → 6² + 8² = 100 → 1² + 0² + 0² = 1." },
      { input: "n = 2", output: "false" },
    ],
    intuition: "Think of the process as a sequence of values. Either it reaches 1 (stop) or it enters a cycle. Use Floyd's slow-fast pointer trick: if fast ever equals 1, it is happy; if slow ever equals fast and that is not 1, there is a cycle.",
    approach: [
      "Define getNext(n) to compute sum of squares of digits.",
      "Set slow = n, fast = getNext(n).",
      "While fast !== 1 and slow !== fast: slow = getNext(slow), fast = getNext(getNext(fast)).",
      "Return fast === 1.",
    ],
    solution: `function isHappy(n) {
  function getNext(x) {
    let s = 0;
    while (x > 0) { const d = x % 10; s += d * d; x = Math.floor(x / 10); }
    return s;
  }
  let slow = n, fast = getNext(n);
  while (fast !== 1 && slow !== fast) {
    slow = getNext(slow);
    fast = getNext(getNext(fast));
  }
  return fast === 1;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Floyd's cycle detection (tortoise and hare) is used in linked-list cycle detection in memory allocators, in detecting circular references in garbage collectors, and in Rho factorisation algorithms for cryptography. Database cursor iteration also uses it to detect infinite loops in recursive CTEs.",
    pitfalls: ["Alternatively, store visited numbers in a Set and check for repetition — O(log n) space but simpler.", "The fast pointer must call getNext twice per iteration to move two steps ahead."],
  },
  {
    id: "two-pointers-15",
    title: "Middle of the Linked List",
    difficulty: "Easy",
    tags: ["Two Pointers", "Linked List"],
    statement: "Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second one.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[3,4,5]", explanation: "Middle node is 3." },
      { input: "head = [1,2,3,4,5,6]", output: "[4,5,6]", explanation: "Two middles — return the second one." },
    ],
    intuition: "Send a slow runner and a fast runner from the head at the same time. The fast runner moves two steps per turn; when it reaches the end, the slow runner is exactly at the middle.",
    approach: [
      "Set slow = head, fast = head.",
      "While fast and fast.next exist: slow = slow.next, fast = fast.next.next.",
      "Return slow.",
    ],
    solution: `function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "The slow-fast pointer trick is used in stream processing to find the median of a data stream in two passes and in pagination APIs to find the cursor that splits a result set in half without counting all rows — useful for efficient binary search over cursor-paginated APIs.",
    pitfalls: ["For even-length lists, the slow pointer lands on the second of the two middle nodes — check whether the problem wants the first or second.", "Do not forget to check fast.next before fast.next.next to avoid null dereference."],
  },
  {
    id: "two-pointers-16",
    title: "Linked List Cycle",
    difficulty: "Easy",
    tags: ["Two Pointers", "Linked List", "Floyd Cycle Detection"],
    statement: "Given the head of a linked list, return true if the list contains a cycle.",
    examples: [
      { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "Tail connects back to node at index 1." },
      { input: "head = [1,2], pos = 0", output: "true" },
      { input: "head = [1], pos = -1", output: "false" },
    ],
    intuition: "Send two runners along the list — one slow, one fast. If there is a cycle, the fast runner will lap the slow runner and they will meet. If there is no cycle, the fast runner reaches the end.",
    approach: [
      "Set slow = head, fast = head.",
      "While fast and fast.next exist: slow = slow.next, fast = fast.next.next.",
      "If slow === fast, return true.",
      "After the loop, return false.",
    ],
    solution: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Cycle detection is critical in dependency graphs of build systems and workflow DAGs to prevent infinite loops. Database foreign-key constraint checkers use similar reachability walks to detect circular references before committing schema changes.",
    pitfalls: ["Check slow === fast inside the loop, not before the first step, or you get a false positive on the initial head.", "Always advance fast two steps — one step makes it equivalent to slow."],
  },
  {
    id: "two-pointers-17",
    title: "Remove Nth Node From End of List",
    difficulty: "Easy",
    tags: ["Two Pointers", "Linked List"],
    statement: "Given the head of a linked list, remove the nth node from the end of the list and return the head.",
    examples: [
      { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" },
      { input: "head = [1], n = 1", output: "[]" },
      { input: "head = [1,2], n = 1", output: "[1]" },
    ],
    intuition: "Send a fast pointer n steps ahead. Then move both pointers together until the fast pointer reaches the end. The slow pointer is now right before the node to delete.",
    approach: [
      "Use a dummy node before head to handle edge cases.",
      "Advance fast pointer n+1 steps from dummy.",
      "Move both slow and fast until fast is null.",
      "Set slow.next = slow.next.next.",
      "Return dummy.next.",
    ],
    solution: `function removeNthFromEnd(head, n) {
  const dummy = { next: head };
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) { slow = slow.next; fast = fast.next; }
  slow.next = slow.next.next;
  return dummy.next;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "The n-ahead pointer trick enables single-pass window operations on streams where you cannot rewind — used in sliding-window log retention systems that must delete a record exactly k positions behind the current write head without buffering the whole stream.",
    pitfalls: ["Use a dummy head to handle deletion of the actual head node (n === list length).", "Advance fast n+1 times (not n) so slow stops at the predecessor of the node to delete."],
  },
  // ---- MEDIUM (18 problems) ----
  {
    id: "two-pointers-18",
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Greedy"],
    statement: "Given an integer array height of length n, find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" },
    ],
    intuition: "Start with the widest possible container (outermost two lines). Water is limited by the shorter line — moving the taller inward can only shrink width without improving the height, so always move the shorter line inward.",
    approach: [
      "Set left=0, right=n-1, maxWater=0.",
      "Compute water = min(height[left], height[right]) * (right - left); update maxWater.",
      "Move the shorter line inward.",
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
    systemDesign: "The bottleneck-removal greedy is the same reasoning as network throughput optimisation: bandwidth is capped by the slowest link, so engineers always upgrade the weakest node first. Distributed load balancers apply identical logic — always scale up the most saturated server.",
    pitfalls: ["When heights are equal, move either pointer — the proof of correctness still holds.", "Never move the taller pointer inward; that can only make things worse."],
  },
  {
    id: "two-pointers-19",
    title: "3Sum",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Sorting"],
    statement: "Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i, j, k are distinct and nums[i] + nums[j] + nums[k] == 0.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
    ],
    intuition: "Sort the array. Fix the first number and use two pointers to find the other two in the remaining sorted portion — just like Two Sum II applied to the sub-array.",
    approach: [
      "Sort nums.",
      "For each index i (skip duplicates), set l=i+1, r=n-1.",
      "While l < r: if sum < 0, advance l; if sum > 0, retreat r; else record triplet and skip duplicate l and r values.",
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
    systemDesign: "k-Sum with sorted scan models multi-column equi-join conditions in query optimisers. The sort-then-merge-join strategy in RDBMS (O(n log n) sort + O(n) merge) beats nested-loop O(n²) for large relations, exactly mirroring the improvement from brute-force 3Sum to this approach.",
    pitfalls: ["Skip duplicate values for the outer loop AND for both inner pointers after recording a triplet, or you get duplicate results.", "Early-exit: if nums[i] > 0, no positive triple can sum to 0."],
  },
  {
    id: "two-pointers-20",
    title: "3Sum Closest",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Sorting"],
    statement: "Given an integer array nums of length n and an integer target, find three integers such that their sum is closest to target. Return their sum.",
    examples: [
      { input: "nums = [-1,2,1,-4], target = 1", output: "2", explanation: "Sum closest to 1 is -1+2+1 = 2." },
      { input: "nums = [0,0,0], target = 1", output: "0" },
    ],
    intuition: "Sort the array and fix one number. Use two pointers on the rest, tracking the closest sum seen. If the current sum is less than target, move the left pointer right to increase it; if greater, move the right pointer left.",
    approach: [
      "Sort nums; initialize closest = nums[0]+nums[1]+nums[2].",
      "For each index i, set l=i+1, r=n-1.",
      "Compute sum; update closest if |sum-target| < |closest-target|.",
      "Adjust pointers based on whether sum < or > target.",
    ],
    solution: `function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  let closest = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length - 2; i++) {
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r];
      if (Math.abs(s - target) < Math.abs(closest - target)) closest = s;
      if (s < target) l++;
      else if (s > target) r--;
      else return s;
    }
  }
  return closest;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(1)" },
    systemDesign: "Closest-sum search models approximate matching in recommendation systems that try to find the combination of items whose combined price is nearest to a budget. It also appears in resource-packing schedulers that assign tasks to servers trying to minimise deviation from a target utilisation.",
    pitfalls: ["Return immediately when the exact target sum is found — no closer answer exists.", "Initialize closest to the first possible triplet sum, not zero, to handle all-negative inputs."],
  },
  {
    id: "two-pointers-21",
    title: "3Sum Smaller",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Sorting"],
    statement: "Given an array nums of n integers and a target, find the number of index triplets i, j, k such that i < j < k and nums[i] + nums[j] + nums[k] < target.",
    examples: [
      { input: "nums = [-2,0,1,3], target = 2", output: "2" },
      { input: "nums = [], target = 0", output: "0" },
      { input: "nums = [0], target = 0", output: "0" },
    ],
    intuition: "Sort the array. Fix the first element. If the two-pointer sum is less than target, then every combination with the right pointer moved leftward also works — so add (right - left) valid pairs at once.",
    approach: [
      "Sort nums.",
      "For each i, set l=i+1, r=n-1.",
      "If nums[i]+nums[l]+nums[r] < target, all pairs (l, l+1..r) work — add r-l to count and advance l.",
      "Else retreat r.",
    ],
    solution: `function threeSumSmaller(nums, target) {
  nums.sort((a, b) => a - b);
  let count = 0;
  for (let i = 0; i < nums.length - 2; i++) {
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      if (nums[i] + nums[l] + nums[r] < target) {
        count += r - l;
        l++;
      } else {
        r--;
      }
    }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(1)" },
    systemDesign: "Counting pairs below a threshold is the basis of range-count queries in columnar databases. When data is sorted, a two-pointer sweep computes the count without materialising individual rows, which is how histograms in query planners estimate selectivity for range predicates.",
    pitfalls: ["When the sum is below target, r-l gives the count of valid pairs with l fixed — all right endpoints from l+1 to r are valid.", "Sort is mandatory; the batch-count optimisation only works on sorted data."],
  },
  {
    id: "two-pointers-22",
    title: "4Sum",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Sorting"],
    statement: "Given an integer array nums and a target integer, return all unique quadruplets [a,b,c,d] such that a+b+c+d == target.",
    examples: [
      { input: "nums = [1,0,-1,0,-2,2], target = 0", output: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]" },
      { input: "nums = [2,2,2,2,2], target = 8", output: "[[2,2,2,2]]" },
    ],
    intuition: "Sort the array. Fix two outer numbers with duplicate-skipping, then use the two-pointer technique on the inner sub-array to find the remaining two — a direct extension of 3Sum.",
    approach: [
      "Sort nums.",
      "Outer loop i, inner loop j (both skip duplicates).",
      "Two pointers l and r on the rest; collect matches and skip duplicates on l and r.",
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
    systemDesign: "k-Sum generalises to multi-column join conditions in query optimisers. Hashing pair sums in a map reduces 4Sum to O(n²) space with O(n²) time — the same hash-join strategy that databases apply to reduce multi-way joins from O(n^k) to O(n^(k/2)).",
    pitfalls: ["Skip duplicates for both outer loops and both inner pointers independently.", "Integer overflow is not a concern in JavaScript but relevant in other languages — use long arithmetic for near-max targets."],
  },
  {
    id: "two-pointers-23",
    title: "Sort Colors (Dutch National Flag)",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Sorting"],
    statement: "Given an array nums with values 0, 1, or 2 representing red, white, and blue, sort them in-place so all 0s come first, then 1s, then 2s. Do not use the library sort function.",
    examples: [
      { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
      { input: "nums = [2,0,1]", output: "[0,1,2]" },
    ],
    intuition: "Maintain three zones: confirmed-0s at the front, confirmed-2s at the back, and an unknown middle. One scan resolves everything: when you find a 0 swap it to the front, a 2 swap it to the back.",
    approach: [
      "Set lo=0, mid=0, hi=n-1.",
      "While mid <= hi: if nums[mid]==0 swap with lo and advance both; if nums[mid]==2 swap with hi and decrement hi only; else advance mid only.",
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
    systemDesign: "Three-way partitioning is the core of Quicksort's 3-way partition used by database ORDER BY implementations to handle many equal keys efficiently. It also models tiered storage routing: instantly classify records as hot (0), warm (1), or cold (2) in a single scan.",
    pitfalls: ["After swapping with hi, do not advance mid — the swapped element from the back is unexamined.", "Two-pass counting sort (count then fill) is simpler but this single-pass three-pointer approach is the intended solution."],
  },
  {
    id: "two-pointers-24",
    title: "Remove Duplicates from Sorted Array II",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array"],
    statement: "Given a sorted integer array nums, remove duplicates in-place such that each element appears at most twice. Return the count k. The first k elements must hold the result.",
    examples: [
      { input: "nums = [1,1,1,2,2,3]", output: "5, nums = [1,1,2,2,3,_]" },
      { input: "nums = [0,0,1,1,1,1,2,3,3]", output: "7, nums = [0,0,1,1,2,3,3,_,_]" },
    ],
    intuition: "Keep a write pointer. A new element is always welcome if the write position is less than 2, or if the new element differs from the element two positions back (meaning the element has appeared fewer than twice so far).",
    approach: [
      "Initialize k=0.",
      "For each num in nums: if k < 2 or num !== nums[k-2], set nums[k++] = num.",
      "Return k.",
    ],
    solution: `function removeDuplicates(nums) {
  let k = 0;
  for (const num of nums) {
    if (k < 2 || num !== nums[k - 2]) nums[k++] = num;
  }
  return k;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Allowing at most k occurrences before deduplication is a policy applied in time-series databases that store the last k readings per sensor key. SSTable compaction with a max-versions policy uses the same write-pointer logic to retain only the most recent k versions of a row.",
    pitfalls: ["The condition nums[k-2] correctly generalises — change 2 to any k for at-most-k duplicates.", "Do not compare with nums[k-1]; that would allow at most 1 occurrence, not 2."],
  },
  {
    id: "two-pointers-25",
    title: "Partition Labels",
    difficulty: "Medium",
    tags: ["Two Pointers", "Greedy", "String"],
    statement: "You are given a string s. Partition it into as many parts as possible so that each letter appears in at most one part. Return a list of the sizes of each part.",
    examples: [
      { input: "s = \"ababcbacadefegdehijhklij\"", output: "[9,7,8]" },
      { input: "s = \"eccbbbbdec\"", output: "[10]" },
    ],
    intuition: "For each character, find the last position it appears. Walk through the string expanding the current partition boundary to include the last occurrence of every character seen. When the walk reaches the boundary, the partition ends.",
    approach: [
      "Build a map of each character's last index.",
      "Walk with start=0, end=0.",
      "At each position i, expand end = max(end, lastIndex[s[i]]).",
      "When i === end, record partition size (end-start+1), update start=end+1.",
    ],
    solution: `function partitionLabels(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) last[s[i]] = i;
  const res = [];
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]);
    if (i === end) { res.push(end - start + 1); start = end + 1; }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Partition-by-last-occurrence models interval-based sharding in databases: a shard boundary is finalized only when all keys that could span into the next shard have been accounted for. The same greedy interval-merging logic appears in scheduling algorithms that assign jobs to the minimum number of time slots.",
    pitfalls: ["The partition boundary must expand to the last occurrence of every character seen so far — not just the current one.", "Characters appearing only once are their own trivial constraint."],
  },
  {
    id: "two-pointers-26",
    title: "Boats to Save People",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Greedy", "Sorting"],
    statement: "You are given an array people where people[i] is the weight of the i-th person. Each boat carries at most 2 people and has a weight limit. Return the minimum number of boats to carry everyone.",
    examples: [
      { input: "people = [1,2], limit = 3", output: "1" },
      { input: "people = [3,2,2,1], limit = 3", output: "3" },
      { input: "people = [3,5,3,4], limit = 5", output: "4" },
    ],
    intuition: "Sort the people by weight. Try to pair the heaviest person with the lightest. If they fit together, both board one boat; otherwise the heavy person goes alone.",
    approach: [
      "Sort people.",
      "Set light=0, heavy=n-1, boats=0.",
      "While light <= heavy: if people[light]+people[heavy] <= limit, advance light. Always decrement heavy and add one boat.",
    ],
    solution: `function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  let l = 0, r = people.length - 1, boats = 0;
  while (l <= r) {
    if (people[l] + people[r] <= limit) l++;
    r--;
    boats++;
  }
  return boats;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Greedy pairing of heaviest with lightest is the bin-packing heuristic used in cloud VM placement: match the most resource-hungry VM with the machine that has the most remaining capacity. This First-Fit-Decreasing variant minimises the number of servers (boats) needed.",
    pitfalls: ["When the heavy person cannot pair with anyone, they take a boat alone — always decrement heavy and count a boat regardless.", "Two pointers can meet (light === heavy) — that one remaining person also gets a boat."],
  },
  {
    id: "two-pointers-27",
    title: "Find the Duplicate Number",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Floyd Cycle Detection", "Binary Search"],
    statement: "Given an array nums containing n+1 integers where each integer is in [1, n], find the one duplicate number. Do not modify the array. Use only constant extra space.",
    examples: [
      { input: "nums = [1,3,4,2,2]", output: "2" },
      { input: "nums = [3,1,3,4,2]", output: "3" },
    ],
    intuition: "Treat the array as a linked list where nums[i] is the next node from i. Because there is a duplicate, there must be a cycle — use Floyd's tortoise and hare to find the cycle entrance, which is the duplicate.",
    approach: [
      "Phase 1: slow = nums[slow], fast = nums[nums[fast]] until they meet.",
      "Phase 2: reset slow to nums[0]. Move both one step at a time until they meet — that meeting point is the duplicate.",
    ],
    solution: `function findDuplicate(nums) {
  let slow = nums[0], fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Cycle-entrance detection in a functional graph (where each node has exactly one out-edge) is used in hash collision chain analysis and in finding infinite loops in pointer-chasing structures. In distributed systems, it models detecting a circular routing path in a network of redirects.",
    pitfalls: ["The problem constraints (values in [1,n], no modification) specifically enable the Floyd approach — without them a sort or a set would be simpler.", "Use a do-while for phase 1 so the slow and fast pointers move before the first equality check."],
  },
  {
    id: "two-pointers-28",
    title: "Interval List Intersections",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Intervals"],
    statement: "You are given two sorted lists of closed intervals, firstList and secondList. Compute the intersection of these two interval lists.",
    examples: [
      { input: "firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]", output: "[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]" },
      { input: "firstList = [[1,3],[5,9]], secondList = []", output: "[]" },
    ],
    intuition: "Use one pointer per list. Two intervals intersect if one starts before the other ends. After recording an intersection, advance the pointer whose interval ends earlier.",
    approach: [
      "Set i=0, j=0, result=[].",
      "While both pointers are valid: compute lo=max(start1,start2), hi=min(end1,end2).",
      "If lo <= hi, push [lo,hi] to result.",
      "Advance the pointer with the smaller end value.",
    ],
    solution: `function intervalIntersection(firstList, secondList) {
  const res = [];
  let i = 0, j = 0;
  while (i < firstList.length && j < secondList.length) {
    const lo = Math.max(firstList[i][0], secondList[j][0]);
    const hi = Math.min(firstList[i][1], secondList[j][1]);
    if (lo <= hi) res.push([lo, hi]);
    if (firstList[i][1] < secondList[j][1]) i++; else j++;
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(m+n)", space: "O(m+n)" },
    systemDesign: "Sorted interval intersection is the core of time-range JOIN queries in time-series databases (find all events in A that overlap with events in B). Merge-join on interval columns in columnar stores uses the same two-pointer sweep, and calendar availability intersection uses identical logic.",
    pitfalls: ["Advance the interval with the smaller end — it cannot intersect with any future interval from the other list.", "When end times are equal, either pointer can advance; increment both for a minor optimization."],
  },
  {
    id: "two-pointers-29",
    title: "Longest Mountain in Array",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Enumeration"],
    statement: "Given an integer array arr, return the length of the longest subarray that is a mountain. A mountain subarray has at least 3 elements, strictly increases to a peak, then strictly decreases. Return 0 if no mountain exists.",
    examples: [
      { input: "arr = [2,1,4,7,3,2,5]", output: "5", explanation: "Mountain is [1,4,7,3,2]." },
      { input: "arr = [2,2,2]", output: "0" },
    ],
    intuition: "Walk through the array from left to right. When you find a valley (local minimum), count the ascending slope then the descending slope. A valid mountain needs both slopes to be non-empty.",
    approach: [
      "Use a single pointer i starting at 1.",
      "While i < n-1: if arr[i-1] < arr[i], potential ascent — count up while ascending, then count down while descending.",
      "If both ascent and descent are non-zero, record the mountain length.",
      "Else advance i by 1.",
    ],
    solution: `function longestMountain(arr) {
  const n = arr.length;
  let res = 0, i = 1;
  while (i < n - 1) {
    if (arr[i - 1] < arr[i] && arr[i] < arr[i + 1]) {
      // not at peak yet, skip
      i++; continue;
    }
    if (arr[i - 1] < arr[i] && arr[i] > arr[i + 1]) {
      // found a peak
      let left = i - 1, right = i + 1;
      while (left > 0 && arr[left - 1] < arr[left]) left--;
      while (right < n - 1 && arr[right] > arr[right + 1]) right++;
      res = Math.max(res, right - left + 1);
      i = right;
    } else {
      i++;
    }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Mountain (unimodal) pattern detection is used in load-curve analysis of power grids to identify demand-peak windows and in stock-price technical analysis to find breakout-and-pullback patterns. Streaming sensor systems use similar slope-sign-change detection for anomaly detection.",
    pitfalls: ["Both the ascending and descending parts must be strictly increasing/decreasing — plateaus disqualify the mountain.", "Jump i to the end of the last mountain to avoid re-scanning already processed elements."],
  },
  {
    id: "two-pointers-30",
    title: "Number of Subsequences That Satisfy the Given Sum Condition",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Sorting", "Binary Search"],
    statement: "Given an integer array nums and an integer target, return the number of non-empty subsequences of nums such that the sum of the minimum and maximum element on it is less than or equal to target. Return the answer modulo 10^9 + 7.",
    examples: [
      { input: "nums = [3,5,6,7], target = 9", output: "4" },
      { input: "nums = [3,3,6,8], target = 10", output: "6" },
      { input: "nums = [2,3,3,4,6,7], target = 12", output: "61" },
    ],
    intuition: "Sort the array. Fix the minimum element with a left pointer. Find the rightmost element that can be the maximum using a right pointer. Any subset of elements between left and right forms a valid subsequence — there are 2^(right-left) such subsets.",
    approach: [
      "Sort nums. Precompute powers of 2 modulo MOD.",
      "Set l=0, r=n-1.",
      "While l <= r: if nums[l]+nums[r] <= target, add 2^(r-l) to result and advance l; else retreat r.",
    ],
    solution: `function numSubseq(nums, target) {
  const MOD = 1e9 + 7;
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const pw = new Array(n).fill(1n);
  for (let i = 1; i < n; i++) pw[i] = pw[i - 1] * 2n % BigInt(MOD);
  let l = 0, r = n - 1, res = 0n;
  while (l <= r) {
    if (nums[l] + nums[r] <= target) {
      res = (res + pw[r - l]) % BigInt(MOD);
      l++;
    } else {
      r--;
    }
  }
  return Number(res);
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Counting subsequences within a sum constraint models multi-item bundle pricing: given a sorted catalog, how many item pairs (min+max price ≤ budget) can a customer choose? E-commerce recommendation engines use similar range-count queries on sorted price indexes to enumerate affordable bundles.",
    pitfalls: ["Precompute powers of 2 to avoid recomputing them in the inner loop.", "Use BigInt for the power array to avoid integer overflow with modular arithmetic in JavaScript."],
  },
  {
    id: "two-pointers-31",
    title: "Trapping Rain Water",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Dynamic Programming", "Stack"],
    statement: "Given n non-negative integers representing an elevation map where each bar has width 1, compute how much water it can trap after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    intuition: "Water at any bar equals the minimum of the tallest bar to its left and right, minus its own height. With two pointers, the side with the smaller maximum is the bottleneck — always process that side.",
    approach: [
      "Set l=0, r=n-1, lMax=0, rMax=0, water=0.",
      "While l < r: if lMax <= rMax, process left (update lMax or add lMax-height[l] to water, advance l); else process right symmetrically.",
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
    systemDesign: "Rain-water trapping models buffer backpressure in data pipelines: accumulated water corresponds to data queued between two processing stages. In cloud cost modelling, unused reserved capacity fills up like trapped water between demand spikes, informing right-sizing decisions.",
    pitfalls: ["Always process the side with the smaller current maximum — that side's water level is deterministic.", "Pre-computing left/right max arrays is simpler but uses O(n) extra space."],
  },
  {
    id: "two-pointers-32",
    title: "Subarrays with K Different Integers",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Sliding Window", "Hash Map"],
    statement: "Given an integer array nums and an integer k, return the number of good subarrays — subarrays with exactly k distinct integers.",
    examples: [
      { input: "nums = [1,2,1,2,3], k = 2", output: "7" },
      { input: "nums = [1,2,1,3,4], k = 3", output: "3" },
    ],
    intuition: "Exactly k distinct = at-most-k distinct minus at-most-(k-1) distinct. Each at-most-k count is computed by a sliding window that shrinks when the distinct count exceeds k.",
    approach: [
      "Define atMost(k) using a sliding window with a frequency map.",
      "When the window has more than k distinct values, shrink from the left.",
      "Return atMost(k) - atMost(k-1).",
    ],
    solution: `function subarraysWithKDistinct(nums, k) {
  function atMost(K) {
    const count = new Map();
    let res = 0, l = 0;
    for (let r = 0; r < nums.length; r++) {
      count.set(nums[r], (count.get(nums[r]) || 0) + 1);
      while (count.size > K) {
        count.set(nums[l], count.get(nums[l]) - 1);
        if (count.get(nums[l]) === 0) count.delete(nums[l]);
        l++;
      }
      res += r - l + 1;
    }
    return res;
  }
  return atMost(k) - atMost(k - 1);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "Complement counting (exactly k = at-most-k minus at-most-(k-1)) is a standard query decomposition trick in analytics databases. Counting distinct values within a sliding window is also the core of cardinality-estimation windows in stream processing systems like Apache Flink.",
    pitfalls: ["Directly maintaining an exactly-k window is error-prone — the complement approach is cleaner.", "When a frequency drops to 0, delete the key to correctly track the number of distinct elements."],
  },
  {
    id: "two-pointers-33",
    title: "Count Pairs Whose Sum is Less than Target",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Sorting"],
    statement: "Given a 0-indexed integer array nums of length n and an integer target, return the number of pairs (i, j) where 0 <= i < j < n and nums[i] + nums[j] < target.",
    examples: [
      { input: "nums = [-1,1,2,3,1], target = 2", output: "3" },
      { input: "nums = [-6,2,5,-2,-7,-1,3], target = -2", output: "10" },
    ],
    intuition: "Sort the array. Use two pointers: if the pair sum is less than target, all pairs with the current left and any right pointer from l+1 to r also qualify — add r-l to the count at once.",
    approach: [
      "Sort nums.",
      "Set l=0, r=n-1, count=0.",
      "While l < r: if nums[l]+nums[r] < target, count += r-l, advance l; else retreat r.",
    ],
    solution: `function countPairs(nums, target) {
  nums.sort((a, b) => a - b);
  let l = 0, r = nums.length - 1, count = 0;
  while (l < r) {
    if (nums[l] + nums[r] < target) {
      count += r - l;
      l++;
    } else {
      r--;
    }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Range-count pair queries appear in recommendation systems computing how many item pairs have a combined score below a threshold, and in network analysis counting pairs of nodes whose combined latency is below an SLA target. The bulk-count optimisation (adding r-l at once) is analogous to using statistics histograms instead of row-by-row scans in query planners.",
    pitfalls: ["When nums[l]+nums[r] < target, all pairs (l, l+1), (l, l+2), ..., (l, r) are valid — that is r-l pairs.", "Sort is required; the bulk count only holds because the array is sorted."],
  },
  {
    id: "two-pointers-34",
    title: "Two Sum Less Than K",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Sorting"],
    statement: "Given an integer array nums and an integer k, return the maximum sum of a pair of elements such that the sum is strictly less than k. If no such pair exists, return -1.",
    examples: [
      { input: "nums = [34,23,1,24,75,33,54,8], k = 60", output: "58" },
      { input: "nums = [10,20,30], k = 15", output: "-1" },
    ],
    intuition: "Sort the array. Use two pointers from both ends. If the sum is below k, record it (try to maximise it by advancing left); if it is too large, retreat right.",
    approach: [
      "Sort nums. Set l=0, r=n-1, ans=-1.",
      "While l < r: if nums[l]+nums[r] < k, update ans and advance l; else retreat r.",
    ],
    solution: `function twoSumLessThanK(nums, k) {
  nums.sort((a, b) => a - b);
  let l = 0, r = nums.length - 1, ans = -1;
  while (l < r) {
    const s = nums[l] + nums[r];
    if (s < k) { ans = Math.max(ans, s); l++; }
    else r--;
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Maximising a pair sum below a budget models optimal resource pairing in cloud provisioning: pick two VM types whose combined cost is just under a spending cap. Pricing engines in e-commerce use the same bounded maximisation to suggest the best bundle within a cart value limit.",
    pitfalls: ["Always advance the left pointer when a valid pair is found — moving right would decrease the sum and we want the maximum below k.", "Return -1 (not 0) when no valid pair exists."],
  },
  {
    id: "two-pointers-35",
    title: "Valid Triangle Number",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Sorting", "Greedy"],
    statement: "Given an integer array nums, return the number of triplets chosen from the array that can make triangles if we take them as side lengths. Three sides form a triangle when the sum of any two sides is greater than the third.",
    examples: [
      { input: "nums = [2,2,3,4]", output: "3" },
      { input: "nums = [4,2,3,4]", output: "4" },
    ],
    intuition: "Sort the array. Fix the largest side (right pointer). Use two left pointers: when nums[l]+nums[mid] > nums[r], all values between l and mid also form valid triangles with r — count them in bulk.",
    approach: [
      "Sort nums.",
      "Fix r from n-1 down to 2.",
      "For each r, set l=0, mid=r-1.",
      "While l < mid: if nums[l]+nums[mid] > nums[r], add mid-l to count and decrement mid; else advance l.",
    ],
    solution: `function triangleNumber(nums) {
  nums.sort((a, b) => a - b);
  let count = 0;
  for (let r = nums.length - 1; r >= 2; r--) {
    let l = 0, mid = r - 1;
    while (l < mid) {
      if (nums[l] + nums[mid] > nums[r]) {
        count += mid - l;
        mid--;
      } else {
        l++;
      }
    }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(1)" },
    systemDesign: "Counting valid triplets satisfying a triangle inequality models feasibility checks in network topology design: three routers can form a resilient triangle only if each link's latency is less than the sum of the other two. Similar structural validity checks appear in CAD software for mesh generation.",
    pitfalls: ["Fix the largest side, not the smallest — the triangle inequality simplifies to checking only one inequality when the third side is the maximum.", "When nums[l]+nums[mid] > nums[r], all indices from l to mid-1 also satisfy the condition for the same mid and r."],
  },
  // ---- HARD (15 problems) ----
  {
    id: "two-pointers-36",
    title: "Trapping Rain Water II",
    difficulty: "Hard",
    tags: ["Two Pointers", "Array", "Matrix", "Heap", "BFS"],
    statement: "Given an m×n matrix of non-negative integers representing the height of each unit cell, compute the volume of water it can trap after raining.",
    examples: [
      { input: "heightMap = [[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]", output: "4" },
      { input: "heightMap = [[3,3,3,3,3],[3,2,2,2,3],[3,2,1,2,3],[3,2,2,2,3],[3,3,3,3,3]]", output: "10" },
    ],
    intuition: "Water can only escape over the border. Start by treating all border cells as initial boundaries in a min-heap. The lowest boundary cell dictates the water level — any inner neighbour shorter than this boundary traps water up to the boundary height.",
    approach: [
      "Push all border cells into a min-heap; mark them as visited.",
      "While heap is not empty: pop the minimum-height cell. For each unvisited neighbour: water += max(0, popped height - neighbour height); push max(popped height, neighbour height) into heap; mark visited.",
      "Return total water.",
    ],
    solution: `function trapRainWater(heightMap) {
  const m = heightMap.length, n = heightMap[0].length;
  if (m < 3 || n < 3) return 0;
  // Min-heap using sorted array (simple approach for clarity)
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  const heap = [];
  const push = (h, r, c) => {
    heap.push([h, r, c]);
    heap.sort((a, b) => a[0] - b[0]);
  };
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r === 0 || r === m - 1 || c === 0 || c === n - 1) {
        push(heightMap[r][c], r, c);
        visited[r][c] = true;
      }
    }
  }
  let water = 0;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  while (heap.length) {
    const [h, r, c] = heap.shift();
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited[nr][nc]) continue;
      visited[nr][nc] = true;
      water += Math.max(0, h - heightMap[nr][nc]);
      push(Math.max(h, heightMap[nr][nc]), nr, nc);
    }
  }
  return water;
}`,
    language: "javascript",
    complexity: { time: "O(m*n*log(m*n))", space: "O(m*n)" },
    systemDesign: "The border-inward BFS with a min-heap models water-flow network analysis used in GIS terrain processing to identify catchment areas and flood zones. The same priority-queue-driven relaxation appears in Dijkstra's shortest-path algorithm and in distributed network flow simulations.",
    pitfalls: ["The heap must always pop the cell with the minimum height — otherwise you may incorrectly calculate water levels.", "Replace the naive sorted-array heap with a proper min-heap (binary heap) for production O(log n) push/pop performance."],
  },
  {
    id: "two-pointers-37",
    title: "Minimum Number of Operations to Make Array Continuous",
    difficulty: "Hard",
    tags: ["Two Pointers", "Array", "Sorting", "Sliding Window"],
    statement: "You are given an integer array nums. In one operation you can replace any element with any other integer. Return the minimum number of operations to make nums continuous — all elements distinct and form a range [x, x+n-1].",
    examples: [
      { input: "nums = [4,2,5,3]", output: "0" },
      { input: "nums = [1,2,3,5,6]", output: "1" },
      { input: "nums = [1,10,100,1000]", output: "3" },
    ],
    intuition: "The answer is n minus the most elements we can keep unchanged. Sort and deduplicate. For each possible start value x, use a sliding window to count how many existing unique values fall in [x, x+n-1]. The window of most kept elements needs the fewest replacements.",
    approach: [
      "Deduplicate and sort nums.",
      "For each left pointer i as the start of the window, use binary search or a right pointer to find how many elements fit in [nums[i], nums[i]+n-1].",
      "Track the maximum window size. Answer = n - maxWindow.",
    ],
    solution: `function minOperations(nums) {
  const n = nums.length;
  const unique = [...new Set(nums)].sort((a, b) => a - b);
  let res = n, r = 0;
  for (let l = 0; l < unique.length; l++) {
    while (r < unique.length && unique[r] < unique[l] + n) r++;
    res = Math.min(res, n - (r - l));
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Minimising replacements to achieve a contiguous unique range models auto-increment sequence repair in databases (minimum inserts/updates to fill gaps in an ID column). It also models data normalization in ETL pipelines where a sparse set of keys must be made dense with minimum rewrites.",
    pitfalls: ["Deduplicate before the window scan — duplicates cannot both be kept in a continuous range.", "The window counts unique values within [unique[l], unique[l]+n-1]; the right pointer never needs to go back."],
  },
  {
    id: "two-pointers-38",
    title: "Push Dominoes",
    difficulty: "Hard",
    tags: ["Two Pointers", "String", "Dynamic Programming"],
    statement: "There are n dominoes standing upright. Each domino is 'L', 'R', or '.' (standing). When a domino falls it pushes adjacent dominoes. Simultaneously push all falling dominoes and return the final state.",
    examples: [
      { input: "dominoes = \"RR.L\"", output: "\"RR.L\"" },
      { input: "dominoes = \".L.R...LR..L..\"", output: "\"LL.RR.LLRRLL..\"" },
    ],
    intuition: "Model forces from both directions. Assign +1 for each rightward force and -1 for each leftward force with strength decaying by 1 per position. The net force at each '.' determines its final state.",
    approach: [
      "Sweep left to right, applying a decaying positive force from each 'R'.",
      "Sweep right to left, applying a decaying negative force from each 'L'.",
      "Sum the two force arrays. If force > 0 -> 'R'; < 0 -> 'L'; == 0 -> '.'.",
    ],
    solution: `function pushDominoes(dominoes) {
  const n = dominoes.length;
  const forces = new Array(n).fill(0);
  let f = 0;
  for (let i = 0; i < n; i++) {
    if (dominoes[i] === "R") f = n;
    else if (dominoes[i] === "L") f = 0;
    else f = Math.max(f - 1, 0);
    forces[i] += f;
  }
  f = 0;
  for (let i = n - 1; i >= 0; i--) {
    if (dominoes[i] === "L") f = n;
    else if (dominoes[i] === "R") f = 0;
    else f = Math.max(f - 1, 0);
    forces[i] -= f;
  }
  return forces.map(v => v > 0 ? "R" : v < 0 ? "L" : ".").join("");
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Bidirectional force propagation models influence spreading in social networks (left-to-right and right-to-left message cascades) and signal attenuation in sensor networks where a signal decays over distance. Two-pass DP is also the basis for the forward-backward algorithm in Hidden Markov Models used in NLP.",
    pitfalls: ["Forces decay by 1 per position — do not simply propagate the original force without decay.", "Symmetrically process both directions before combining — a single pass misses interactions between opposing forces."],
  },
  {
    id: "two-pointers-39",
    title: "Long Pressed Name",
    difficulty: "Hard",
    tags: ["Two Pointers", "String"],
    statement: "Your friend is typing your name into a keyboard. Sometimes a key gets long pressed and the character is typed one or more extra times. Given the typed string, return true if it could be a valid long-press of the name.",
    examples: [
      { input: "name = \"alex\", typed = \"aaleex\"", output: "true" },
      { input: "name = \"saeed\", typed = \"ssaaedd\"", output: "false" },
    ],
    intuition: "Walk both strings with two pointers. The typed string can have extra repeated characters but must cover all characters of name in order. If typed has extra characters that don't match the current name character or its predecessor, it is invalid.",
    approach: [
      "Set i=0 (pointer into name), j=0 (pointer into typed).",
      "For each character in typed: if it matches name[i], advance i; else if it matches the previous typed character (long press), do nothing; else return false.",
      "Return i === name.length.",
    ],
    solution: `function isLongPressedName(name, typed) {
  let i = 0, j = 0;
  while (j < typed.length) {
    if (i < name.length && name[i] === typed[j]) {
      i++; j++;
    } else if (j > 0 && typed[j] === typed[j - 1]) {
      j++;
    } else {
      return false;
    }
  }
  return i === name.length;
}`,
    language: "javascript",
    complexity: { time: "O(m+n)", space: "O(1)" },
    systemDesign: "Long-press / key-repeat detection models input deduplication in keyboard event streams and in touch-typing software that must distinguish intentional double-tap from accidental hold. The same pattern appears in debouncing logic for IoT sensor signals that emit repeated readings on a sustained trigger.",
    pitfalls: ["A long-press repeats the immediately preceding character — check typed[j] === typed[j-1], not typed[j] === name[i-1].", "After the loop, all name characters must have been matched — check i === name.length."],
  },
  {
    id: "two-pointers-40",
    title: "Statistics from a Large Sample",
    difficulty: "Hard",
    tags: ["Two Pointers", "Array", "Math"],
    statement: "You are given an integer array count where count[i] is the number of times integer i appears in a dataset of integers in [0, 255]. Return the statistics: minimum, maximum, mean, median, and mode.",
    examples: [
      { input: "count = [0,1,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]", output: "[1,3,2.375,2.5,3]" },
    ],
    intuition: "Scan the count array once for minimum, maximum, mode, total count, and weighted sum (for mean). For median, use two pointers from both ends to count up to the middle element(s).",
    approach: [
      "Single pass: find min (first non-zero), max (last non-zero), mode (max count index), total n, and weighted sum.",
      "Compute mean = sum / n.",
      "For median: use two pointers from 0 and 255 inward, each accumulating counts until they together account for the middle position(s).",
    ],
    solution: `function sampleStats(count) {
  let min = -1, max = -1, mode = 0, n = 0, sum = 0;
  for (let i = 0; i <= 255; i++) {
    if (count[i] > 0) {
      if (min === -1) min = i;
      max = i;
      if (count[i] > count[mode]) mode = i;
      n += count[i];
      sum += i * count[i];
    }
  }
  const mean = sum / n;
  // Find median with two pointers
  let lo = 0, hi = 255, loCount = 0, hiCount = 0;
  let median = 0;
  while (lo <= hi) {
    if (loCount + count[lo] <= hiCount + count[hi]) {
      loCount += count[lo++];
    } else {
      hiCount += count[hi--];
    }
    if (loCount + hiCount >= n) {
      // Both pointers met — median is at lo-1 or hi+1 boundary
      median = (lo + hi) / 2;
      break;
    }
  }
  // Simpler median: walk from left counting to middle
  let mCount = 0;
  let m1 = -1, m2 = -1;
  for (let i = 0; i <= 255; i++) {
    mCount += count[i];
    if (m1 === -1 && mCount >= Math.ceil(n / 2)) m1 = i;
    if (mCount >= Math.floor(n / 2) + 1) { m2 = i; break; }
  }
  median = (m1 + m2) / 2;
  return [min, max, mean, median, mode];
}`,
    language: "javascript",
    complexity: { time: "O(1)", space: "O(1)" },
    systemDesign: "Frequency-table statistics (mean, median, mode over a bounded domain) are how columnar databases store pre-aggregated histograms for query planning. Approximate median and percentile computations in monitoring systems (P95/P99 latency) use T-Digest or frequency sketches built on the same count-array idea.",
    pitfalls: ["The domain is always [0,255] so all loops are O(256) = O(1).", "Median requires careful handling of even versus odd total counts — track the two middle indices separately."],
  },
  {
    id: "two-pointers-41",
    title: "Minimum Window Subsequence",
    difficulty: "Hard",
    tags: ["Two Pointers", "String", "Dynamic Programming", "Sliding Window"],
    statement: "Given strings s and t, return the minimum length substring of s that contains t as a subsequence. If no such substring exists, return an empty string. If multiple answers have the same length, return the leftmost one.",
    examples: [
      { input: "s = \"abcdebdde\", t = \"bde\"", output: "\"bcde\"" },
      { input: "s = \"jmeqksfrsdcmsiwvaovztaqenprpvnbstl\", t = \"qqqqq\"", output: "\"\"" },
    ],
    intuition: "Use two pointers to find a window in s that covers t as a subsequence. Once all of t is matched going forward, walk backward from the match end to tighten the window start, then try again from the next position.",
    approach: [
      "Two-pointer forward scan: match each character of t sequentially through s.",
      "When all of t is matched, backward scan from the match end to find the tightest window start.",
      "Record the window if it is the shortest found. Advance s pointer past the start and repeat.",
    ],
    solution: `function minWindowSubsequence(s, t) {
  let res = "", i = 0;
  while (i < s.length) {
    let j = 0;
    while (i < s.length && j < t.length) {
      if (s[i] === t[j]) j++;
      i++;
    }
    if (j < t.length) break; // t not fully matched
    // Backward tighten
    let end = i - 1;
    j = t.length - 1;
    while (j >= 0) {
      if (s[end] === t[j]) j--;
      end--;
    }
    const start = end + 1;
    if (res === "" || i - start - 1 < res.length) {
      res = s.slice(start, i);
    }
    i = start + 1;
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(|s|*|t|)", space: "O(1)" },
    systemDesign: "Minimum-window subsequence matching is used in fuzzy log search where you need to find the tightest log segment containing a multi-step event sequence in order. It also underpins spell-checker engines that find the nearest substring matching a query with skippable characters.",
    pitfalls: ["After a forward match, back-track from the end to find the true minimum start — just recording the current i is not tight enough.", "Restart the search from start+1 (not i) to find potentially overlapping shorter windows."],
  },
  {
    id: "two-pointers-42",
    title: "Shortest Distance to a Character",
    difficulty: "Hard",
    tags: ["Two Pointers", "String", "Array"],
    statement: "Given a string s and a character c that occurs in s, return an array of integers answer where answer[i] is the distance from index i to the closest occurrence of character c in s.",
    examples: [
      { input: "s = \"loveleetcode\", c = \"e\"", output: "[3,2,1,0,1,0,0,1,2,2,1,0]" },
      { input: "s = \"aaab\", c = \"b\"", output: "[3,2,1,0]" },
    ],
    intuition: "Do two passes. In the left pass, set distance based on the most recently seen c. In the right pass, update distance based on the next c to the right. Take the minimum of both passes.",
    approach: [
      "Left pass (left to right): track last position of c seen; distance[i] = i - lastPos.",
      "Right pass (right to left): track next position of c; distance[i] = min(distance[i], nextPos - i).",
    ],
    solution: `function shortestToChar(s, c) {
  const n = s.length;
  const dist = new Array(n).fill(n);
  let prev = -n;
  for (let i = 0; i < n; i++) {
    if (s[i] === c) prev = i;
    dist[i] = i - prev;
  }
  prev = 2 * n;
  for (let i = n - 1; i >= 0; i--) {
    if (s[i] === c) prev = i;
    dist[i] = Math.min(dist[i], prev - i);
  }
  return dist;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Two-pass nearest-occurrence distance computation models nearest-server lookup in CDN placement: for each client location (index), find the nearest cache node (character c). Distributed geospatial databases use similar pre-computed distance arrays (sorted server lists) for O(1) nearest-node queries.",
    pitfalls: ["Initialize prev to a position far outside the array (e.g. -n and 2*n) so the first real occurrence resets the distance correctly.", "Take the minimum of both passes — the nearest occurrence could be to either side."],
  },
  {
    id: "two-pointers-43",
    title: "Rotate Array",
    difficulty: "Hard",
    tags: ["Two Pointers", "Array", "Math"],
    statement: "Given an integer array nums, rotate it to the right by k steps in-place.",
    examples: [
      { input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]" },
      { input: "nums = [-1,-100,3,99], k = 2", output: "[3,99,-1,-100]" },
    ],
    intuition: "Rotating right by k is the same as: reverse the whole array, then reverse the first k elements, then reverse the remaining n-k elements — three in-place reverses with two pointers.",
    approach: [
      "Normalize k = k % n.",
      "Reverse the entire array.",
      "Reverse nums[0..k-1].",
      "Reverse nums[k..n-1].",
    ],
    solution: `function rotate(nums, k) {
  const n = nums.length;
  k = k % n;
  const rev = (l, r) => { while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; } };
  rev(0, n - 1);
  rev(0, k - 1);
  rev(k, n - 1);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Array rotation with the reverse trick is used in circular buffer management in ring-buffer queues (e.g. the Linux kernel's kfifo) and in in-place matrix transposition steps. Rotating a data partition in a distributed database cluster to rebalance shards uses conceptually identical cyclic shifts.",
    pitfalls: ["Always normalize k with k % n — k can be larger than n.", "The three-reverse trick works only with the exact order: full array, then first k, then last n-k."],
  },
  {
    id: "two-pointers-44",
    title: "Minimum Difference Between Highest and Lowest of K Scores",
    difficulty: "Hard",
    tags: ["Two Pointers", "Array", "Sorting", "Sliding Window"],
    statement: "You are given a 0-indexed integer array nums where nums[i] represents the score of the i-th student. You want to choose the scores of exactly k students such that the difference between the highest and lowest of the chosen scores is minimized. Return the minimum possible difference.",
    examples: [
      { input: "nums = [90], k = 1", output: "0" },
      { input: "nums = [9,4,1,7], k = 2", output: "2" },
    ],
    intuition: "Sort the array. The k elements with the smallest range will always be k consecutive elements in the sorted array. Slide a window of size k and find the minimum difference between the last and first element in the window.",
    approach: [
      "Sort nums.",
      "For each window of size k (index i to i+k-1), compute nums[i+k-1] - nums[i].",
      "Return the minimum such difference.",
    ],
    solution: `function minimumDifference(nums, k) {
  nums.sort((a, b) => a - b);
  let min = Infinity;
  for (let i = 0; i + k - 1 < nums.length; i++) {
    min = Math.min(min, nums[i + k - 1] - nums[i]);
  }
  return min;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Minimising the spread within a fixed-size group models optimal server cluster selection in cloud deployments where you want k servers with the most uniform performance (latency spread). Database partitioning uses the same sliding-window scan to find k-record ranges with minimum value spread for balanced shard sizing.",
    pitfalls: ["Optimal k elements are always consecutive in a sorted array — non-consecutive subsets have at least as large a range.", "When k=1, the difference is always 0 — the loop handles this correctly."],
  },
  {
    id: "two-pointers-45",
    title: "Subarray Product Less Than K",
    difficulty: "Hard",
    tags: ["Two Pointers", "Array", "Sliding Window"],
    statement: "Given an array nums of positive integers and an integer k, return the number of contiguous subarrays where the product of all the elements is strictly less than k.",
    examples: [
      { input: "nums = [10,5,2,6], k = 100", output: "8" },
      { input: "nums = [1,2,3], k = 0", output: "0" },
    ],
    intuition: "Use a sliding window. Expand the right boundary and multiply the product. When the product is too large, shrink from the left by dividing. Every time the window is valid, the number of new valid subarrays ending at right is right - left + 1.",
    approach: [
      "If k <= 1, return 0 (no product of positive integers is < 1).",
      "Set left=0, product=1, count=0.",
      "For each right: product *= nums[right]. While product >= k, product /= nums[left++]. count += right - left + 1.",
    ],
    solution: `function numSubarrayProductLessThanK(nums, k) {
  if (k <= 1) return 0;
  let l = 0, prod = 1, count = 0;
  for (let r = 0; r < nums.length; r++) {
    prod *= nums[r];
    while (prod >= k) prod /= nums[l++];
    count += r - l + 1;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Multiplicative sliding windows appear in financial risk systems computing rolling volatility (product of daily multipliers) and in inventory management systems tracking the product of restock factors over a rolling window. Unlike additive windows, shrinking is done by division, which requires all-positive values.",
    pitfalls: ["This approach requires all-positive values — zero or negative values would break division-based shrinking.", "right - left + 1 counts all subarrays ending at right with the current valid window."],
  },
  {
    id: "two-pointers-46",
    title: "Max Consecutive Ones III",
    difficulty: "Hard",
    tags: ["Two Pointers", "Array", "Sliding Window"],
    statement: "Given a binary array nums and an integer k, return the maximum number of consecutive 1s if you can flip at most k 0s.",
    examples: [
      { input: "nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2", output: "6" },
      { input: "nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1,0], k = 3", output: "10" },
    ],
    intuition: "Slide a window that is allowed to contain at most k zeros. Expand right freely; when the window has more than k zeros, shrink from the left. The largest valid window size is the answer.",
    approach: [
      "Set left=0, zeros=0, best=0.",
      "Advance right; if nums[right]==0, increment zeros.",
      "While zeros > k, if nums[left]==0 decrement zeros; advance left.",
      "Update best = max(best, right - left + 1).",
    ],
    solution: `function longestOnes(nums, k) {
  let l = 0, zeros = 0, best = 0;
  for (let r = 0; r < nums.length; r++) {
    if (nums[r] === 0) zeros++;
    while (zeros > k) { if (nums[l] === 0) zeros--; l++; }
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "At-most-k-defects windows model network reliability windows: find the longest transmission period with at most k packet drops. API gateway rate limiters also use this pattern — allow requests as long as the sliding window contains at most k violations before throttling.",
    pitfalls: ["Unlike the subsequence problem, this needs contiguous elements — the window approach is exact, not greedy.", "If k >= total zeros, the answer is the full array length."],
  },
  {
    id: "two-pointers-47",
    title: "Fruit Into Baskets",
    difficulty: "Hard",
    tags: ["Two Pointers", "Array", "Sliding Window", "Hash Map"],
    statement: "You are visiting a farm with a row of fruit trees. Each basket can hold only one type of fruit. You have two baskets. Starting from any tree, you must pick one fruit from each tree without skipping. Return the maximum number of fruits you can pick.",
    examples: [
      { input: "fruits = [1,1,2,2,3]", output: "4", explanation: "Pick [1,1,2,2] or [2,2,3] — max is 4." },
      { input: "fruits = [0,1,2,2]", output: "3" },
      { input: "fruits = [1,2,3,2,2]", output: "4" },
    ],
    intuition: "This is the 'longest subarray with at most 2 distinct values' problem. Use a sliding window with a frequency map. When the window has more than 2 distinct types, shrink from the left until only 2 remain.",
    approach: [
      "Maintain a frequency map and left pointer.",
      "For each right: add fruits[right] to map.",
      "While map.size > 2: decrement fruits[left]; if count reaches 0 delete the key; advance left.",
      "Track max window size.",
    ],
    solution: `function totalFruit(fruits) {
  const map = new Map();
  let l = 0, best = 0;
  for (let r = 0; r < fruits.length; r++) {
    map.set(fruits[r], (map.get(fruits[r]) || 0) + 1);
    while (map.size > 2) {
      map.set(fruits[l], map.get(fruits[l]) - 1);
      if (map.get(fruits[l]) === 0) map.delete(fruits[l]);
      l++;
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Longest subarray with at most k distinct values models multi-tenant request routing windows: a server can handle at most k tenant types per batch before needing a flush. This constraint appears in database buffer pool management where at most k table scans can share a buffer page concurrently.",
    pitfalls: ["Delete the key from the map when its count reaches 0 to correctly track the number of distinct types.", "At most 2 distinct means the window can hold any two fruit types, not necessarily adjacent ones."],
  },
  {
    id: "two-pointers-48",
    title: "Minimum Size Subarray in Infinite Array",
    difficulty: "Hard",
    tags: ["Two Pointers", "Array", "Sliding Window", "Prefix Sum"],
    statement: "You are given a 0-indexed array nums and an integer target. A subarray sum equals target when the subarray comes from the infinite repetition of nums (i.e. nums is repeated indefinitely). Return the minimum length of such a subarray, or -1 if impossible.",
    examples: [
      { input: "nums = [1,2,3], target = 5", output: "2", explanation: "[2,3] sums to 5." },
      { input: "nums = [1,2,3], target = 6", output: "3" },
      { input: "nums = [2,4,6,8], target = 3", output: "-1" },
    ],
    intuition: "The total sum of one full copy must divide evenly into the target surplus. Compute how many full copies are needed and add any extra prefix/suffix from two more copies to cover the remainder.",
    approach: [
      "Compute totalSum = sum of nums. If target % totalSum === 0, answer is (target/totalSum)*n.",
      "Otherwise, find the minimum window in nums+nums (two copies concatenated) that sums to target % totalSum.",
      "Add (Math.floor(target/totalSum)) * n to that minimum window length.",
    ],
    solution: `function minSizeSubarray(nums, target) {
  const n = nums.length;
  const totalSum = nums.reduce((a, b) => a + b, 0);
  const rem = target % totalSum;
  const fullCopies = Math.floor(target / totalSum);
  if (rem === 0) return fullCopies * n;
  // Find minimum window summing to rem in two copies of nums
  const doubled = [...nums, ...nums];
  let l = 0, sum = 0, minLen = Infinity;
  for (let r = 0; r < doubled.length; r++) {
    sum += doubled[r];
    while (sum > rem) { sum -= doubled[l++]; }
    if (sum === rem) minLen = Math.min(minLen, r - l + 1);
  }
  return minLen === Infinity ? -1 : minLen + fullCopies * n;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Cyclic/ring buffer sliding windows appear in streaming analytics over circular time windows (e.g. hourly rollup that wraps around midnight) and in network packet scheduling with periodic traffic patterns. The decomposition into full cycles plus a remainder is a common modular arithmetic optimization in ring-buffer implementations.",
    pitfalls: ["Check if rem === 0 as a special case — the answer is exactly fullCopies*n without any extra window scan.", "Two copies of nums suffice to find any sub-array spanning the wrap-around boundary."],
  },
  {
    id: "two-pointers-49",
    title: "Minimize Maximum Pair Sum in Array",
    difficulty: "Hard",
    tags: ["Two Pointers", "Array", "Sorting", "Greedy"],
    statement: "The pair sum of a pair (a, b) is a + b. Given an array nums of even length n, pair all n elements into n/2 pairs such that the maximum pair sum is minimized. Return that minimized maximum pair sum.",
    examples: [
      { input: "nums = [3,5,2,3]", output: "7", explanation: "Pairs (3,3) and (5,2): max is max(6,7)=7." },
      { input: "nums = [3,5,4,2,4,6]", output: "8", explanation: "Pairs (2,6),(3,5),(4,4): max is 8." },
    ],
    intuition: "Sort the array. Pair the smallest with the largest. This greedy minimises the maximum pair sum — if you pair two large numbers together, their sum would dominate. Each pair is smallest-with-largest in the sorted order.",
    approach: [
      "Sort nums.",
      "Set left=0, right=n-1, maxSum=0.",
      "While left < right: maxSum = max(maxSum, nums[left]+nums[right]); advance left, retreat right.",
      "Return maxSum.",
    ],
    solution: `function minPairSum(nums) {
  nums.sort((a, b) => a - b);
  let l = 0, r = nums.length - 1, max = 0;
  while (l < r) {
    max = Math.max(max, nums[l] + nums[r]);
    l++; r--;
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Greedy smallest-with-largest pairing is used in load balancing to pair the busiest server with the lightest task and vice versa, minimising the maximum server load. Parallel job schedulers in cluster computing use identical logic to minimise makespan by pairing long and short jobs on the same worker.",
    pitfalls: ["This greedy is optimal for minimising the maximum — a formal proof uses the exchange argument: swapping any pair would only increase the maximum.", "Sort is required; pairing without sorting can produce a suboptimal result."],
  },
  {
    id: "two-pointers-50",
    title: "Minimum Adjacent Swaps to Make a Valid Array",
    difficulty: "Hard",
    tags: ["Two Pointers", "Array", "Greedy"],
    statement: "You are given a 0-indexed integer array nums. Swaps of adjacent elements are allowed. You want to select the minimum element and move it to the front, and select the maximum element and move it to the back. Return the minimum number of adjacent swaps needed. If the minimum is to the right of the maximum, subtract 1 (one swap is shared).",
    examples: [
      { input: "nums = [3,2,1]", output: "3" },
      { input: "nums = [1,3,2]", output: "2" },
      { input: "nums = [1]", output: "0" },
    ],
    intuition: "Find the leftmost minimum and the rightmost maximum. Moving the minimum to the front takes minIdx swaps; moving the maximum to the back takes n-1-maxIdx swaps. If minIdx > maxIdx, both operations share one swap — subtract 1.",
    approach: [
      "Find minIdx (leftmost minimum) and maxIdx (rightmost maximum).",
      "Count swaps: minIdx + (n - 1 - maxIdx).",
      "If minIdx > maxIdx, subtract 1 (the paths cross and share one swap).",
    ],
    solution: `function minimumSwaps(nums) {
  const n = nums.length;
  let minIdx = 0, maxIdx = 0;
  for (let i = 1; i < n; i++) {
    if (nums[i] < nums[minIdx]) minIdx = i;
    if (nums[i] >= nums[maxIdx]) maxIdx = i;
  }
  let swaps = minIdx + (n - 1 - maxIdx);
  if (minIdx > maxIdx) swaps--;
  return swaps;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Minimising adjacent swaps to boundary-place extreme elements models priority-queue insertion costs in sorted data structures and the cost of bringing the smallest/largest record to a page boundary in B-tree leaf node rebalancing. Database sort-merge optimisers estimate similar swap costs when deciding whether to sort in-place or use a temporary buffer.",
    pitfalls: ["Use leftmost minimum (first occurrence) and rightmost maximum (last occurrence) — these minimise the move distances.", "The -1 correction for crossing paths is easy to miss: when minIdx > maxIdx, moving min left first shifts max one position to the right, saving one swap."],
  },
];
