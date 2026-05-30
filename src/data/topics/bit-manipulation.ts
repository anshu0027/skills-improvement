import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  // ---- EASY (18 problems) ----
  {
    id: "bit-manipulation-01",
    title: "Number of 1 Bits",
    difficulty: "Easy",
    tags: ["Bit Manipulation"],
    statement: "Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).",
    examples: [
      { input: "n = 11 (binary: 00000000000000000000000000001011)", output: "3" },
      { input: "n = 128 (binary: 00000000000000000000000010000000)", output: "1" },
    ],
    intuition: "The trick x & (x-1) clears the lowest set bit of x in one step — like erasing the last lit candle. Count how many times you can do this before x becomes zero.",
    approach: [
      "Initialize count = 0.",
      "While n != 0: do n = n & (n - 1) and increment count.",
      "Return count.",
    ],
    solution: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n = (n & (n - 1)) >>> 0;
    count++;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(k) where k = number of set bits", space: "O(1)" },
    systemDesign: "Counting set bits (popcount) is used in bitmap indexes inside databases like PostgreSQL and Roaring Bitmaps to count matching rows in O(1) per word. Modern CPUs expose a POPCNT hardware instruction that powers these queries, enabling billions-of-rows cardinality estimation at nanosecond speed.",
    pitfalls: ["In JavaScript, bitwise ops work on signed 32-bit integers; use >>> 0 to treat the result as unsigned.", "The naive loop over all 32 bits is correct but slower when the number is sparse in set bits."],
  },
  {
    id: "bit-manipulation-02",
    title: "Hamming Distance",
    difficulty: "Easy",
    tags: ["Bit Manipulation"],
    statement: "The Hamming distance between two integers is the number of positions at which the corresponding bits differ. Given two integers x and y, return their Hamming distance.",
    examples: [
      { input: "x = 1, y = 4", output: "2", explanation: "1 = 0001, 4 = 0100 — two bit positions differ." },
      { input: "x = 3, y = 1", output: "1" },
    ],
    intuition: "XOR two numbers to get a 1 wherever the bits differ, then count those 1s — it is like highlighting every place two pages are different.",
    approach: [
      "Compute xor = x ^ y.",
      "Count the number of 1 bits in xor (use the x & (x-1) trick).",
      "Return the count.",
    ],
    solution: `function hammingDistance(x, y) {
  let xor = (x ^ y) >>> 0;
  let count = 0;
  while (xor !== 0) {
    xor = xor & (xor - 1);
    count++;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(1) — at most 32 bits", space: "O(1)" },
    systemDesign: "Hamming distance is the backbone of error-correcting codes (Hamming codes, BCH codes) used in memory ECC and network transmission. It also measures similarity between binary feature vectors in recommendation engines — two users with a small Hamming distance on their preference bitmask are likely to enjoy the same items.",
    pitfalls: ["XOR gives the differing positions; do not forget to count those bits.", "For 32-bit integers the loop runs at most 32 times regardless of values."],
  },
  {
    id: "bit-manipulation-03",
    title: "Power of Two",
    difficulty: "Easy",
    tags: ["Bit Manipulation", "Math"],
    statement: "Given an integer n, return true if it is a power of two, and false otherwise. An integer n is a power of two if there exists an integer x such that n == 2^x.",
    examples: [
      { input: "n = 1", output: "true", explanation: "2^0 = 1." },
      { input: "n = 16", output: "true" },
      { input: "n = 3", output: "false" },
    ],
    intuition: "A power of two in binary looks like exactly one lit light — 1, 10, 100, 1000. The trick n & (n-1) turns off that single light; if the result is zero you had a power of two.",
    approach: [
      "Return false if n <= 0.",
      "Return (n & (n - 1)) === 0.",
    ],
    solution: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}`,
    language: "javascript",
    complexity: { time: "O(1)", space: "O(1)" },
    systemDesign: "Powers of two govern memory allocation, hash table bucket counts, and disk block sizes — systems round up to the next power of two for alignment and cache-line efficiency. Consistent hashing rings use power-of-two virtual node counts to make modular arithmetic fast via bitwise AND instead of division.",
    pitfalls: ["n = 0 must return false — 0 & (-1) = 0 would incorrectly pass the check.", "Negative numbers should also return false."],
  },
  {
    id: "bit-manipulation-04",
    title: "Power of Four",
    difficulty: "Easy",
    tags: ["Bit Manipulation", "Math"],
    statement: "Given an integer n, return true if it is a power of four. An integer n is a power of four if there exists an integer x such that n == 4^x.",
    examples: [
      { input: "n = 16", output: "true" },
      { input: "n = 5", output: "false" },
      { input: "n = 1", output: "true" },
    ],
    intuition: "Powers of four are also powers of two but with their single 1-bit only in odd positions (bit 0, 2, 4, …). The mask 0x55555555 has 1s in all odd positions, so AND-ing with it checks if the bit sits in the right place.",
    approach: [
      "Check n > 0 and n is a power of two: (n & (n-1)) === 0.",
      "Check the single set bit is in an odd bit position using (n & 0x55555555) !== 0.",
      "Return both conditions together.",
    ],
    solution: `function isPowerOfFour(n) {
  return n > 0 && (n & (n - 1)) === 0 && (n & 0x55555555) !== 0;
}`,
    language: "javascript",
    complexity: { time: "O(1)", space: "O(1)" },
    systemDesign: "Four-level memory hierarchies (L1/L2/L3/DRAM) and quad-tree spatial indexes partition space in powers of four. Database page managers use powers of four to align multi-level B-tree nodes so each level spans exactly four child nodes, reducing seek amplification on spinning disks.",
    pitfalls: ["0x55555555 selects bits 0, 2, 4, … (odd positions counting from 0). Powers of four land exactly on these positions.", "n = 1 = 4^0 is a valid power of four and must return true."],
  },
  {
    id: "bit-manipulation-05",
    title: "Single Number",
    difficulty: "Easy",
    tags: ["Bit Manipulation", "Array"],
    statement: "Given a non-empty array of integers where every element appears twice except for one, find and return that single element. Solve in O(n) time and O(1) space.",
    examples: [
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4" },
    ],
    intuition: "XOR of a number with itself is always 0, and XOR with 0 leaves a number unchanged. So XOR-ing every element together cancels all pairs and leaves only the lone element standing.",
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
    systemDesign: "XOR-based checksums power RAID-5 storage, where the parity drive stores the XOR of all data drives so any single drive can be reconstructed. Network error-detection codes (CRC, parity bits) apply the same XOR linearity to detect flipped bits in transmitted packets.",
    pitfalls: ["This only works when exactly one number is unpaired — for k repeats a different approach is needed.", "Order of XOR operations does not matter due to commutativity and associativity."],
  },
  {
    id: "bit-manipulation-06",
    title: "Missing Number",
    difficulty: "Easy",
    tags: ["Bit Manipulation", "Math", "Array"],
    statement: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    examples: [
      { input: "nums = [3,0,1]", output: "2" },
      { input: "nums = [0,1]", output: "2" },
      { input: "nums = [9,6,4,2,3,5,7,0,1]", output: "8" },
    ],
    intuition: "XOR every index (0 to n) with every element. Matching pairs cancel out, leaving only the missing number — like checking off names on a list and seeing which one has no match.",
    approach: [
      "Start with result = n.",
      "For each index i, XOR result with i ^ nums[i].",
      "Return result.",
    ],
    solution: `function missingNumber(nums) {
  let result = nums.length;
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Missing-number detection mirrors gap analysis on auto-increment primary keys in relational databases, which signals out-of-order inserts or deleted rows. Distributed sequence generators (like Snowflake IDs) use XOR-based checkpoints to verify no IDs were dropped across a replication boundary.",
    pitfalls: ["The Gauss sum approach (n*(n+1)/2 - sum) is equally valid but can overflow for large n in languages without BigInt.", "Start result at n because the XOR loop only covers indices 0 to n-1."],
  },
  {
    id: "bit-manipulation-07",
    title: "Reverse Bits",
    difficulty: "Easy",
    tags: ["Bit Manipulation"],
    statement: "Reverse the bits of a given 32-bit unsigned integer.",
    examples: [
      { input: "n = 43261596 (binary: 00000010100101000001111010011100)", output: "964176192 (binary: 00111001011110000010100101000000)" },
      { input: "n = 4294967293 (binary: 11111111111111111111111111111101)", output: "3221225471 (binary: 10111111111111111111111111111111)" },
    ],
    intuition: "Peel off the lowest bit of n one at a time and feed it into result from the left — it is like reversing a string one character at a time.",
    approach: [
      "Initialize result = 0.",
      "Loop 32 times: shift result left by 1, OR in the lowest bit of n (n & 1), then shift n right by 1.",
      "Return result >>> 0 to ensure unsigned 32-bit output.",
    ],
    solution: `function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = ((result << 1) | (n & 1)) >>> 0;
    n >>>= 1;
  }
  return result >>> 0;
}`,
    language: "javascript",
    complexity: { time: "O(1) — exactly 32 iterations", space: "O(1)" },
    systemDesign: "Bit reversal is used in Fast Fourier Transform (FFT) butterfly operations that power audio compression (MP3), image compression (JPEG), and signal processing at scale. Network protocol parsers also reverse bit order when bridging between big-endian and little-endian wire formats.",
    pitfalls: ["Use >>> (unsigned right shift) throughout to avoid sign-extension issues in JavaScript.", "The result must be treated as an unsigned 32-bit integer."],
  },
  {
    id: "bit-manipulation-08",
    title: "Number Complement",
    difficulty: "Easy",
    tags: ["Bit Manipulation"],
    statement: "The complement of an integer is obtained by flipping all bits in its binary representation. Given a positive integer num, return its complement.",
    examples: [
      { input: "num = 5 (binary: 101)", output: "2 (binary: 010)" },
      { input: "num = 1", output: "0" },
    ],
    intuition: "XOR with a mask of all 1s of the same bit-length flips every bit — like a photographic negative that inverts every pixel in exactly the region of the picture.",
    approach: [
      "Find the number of bits in num: compute bit length.",
      "Build a mask of all 1s of that length: mask = (1 << bitLength) - 1.",
      "Return num ^ mask.",
    ],
    solution: `function findComplement(num) {
  let mask = 1;
  while (mask <= num) mask <<= 1;
  return (mask - 1) ^ num;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Bitwise complement is used in IP subnet mask computation — a subnet mask like 255.255.255.0 complemented gives the host portion mask. In permission systems, NOT of an ACL bitmask gives the set of forbidden permissions, enabling fast access-denial checks without enumerating each bit.",
    pitfalls: ["Do not use the full 32-bit complement (~num in JS) — the problem asks for the complement within the number's own bit-width.", "The mask must be strictly greater than num before subtracting 1."],
  },
  {
    id: "bit-manipulation-09",
    title: "Find the Difference",
    difficulty: "Easy",
    tags: ["Bit Manipulation", "String"],
    statement: "You are given two strings s and t. String t is generated by randomly shuffling string s and then adding one more character at a random position. Return the letter that was added to t.",
    examples: [
      { input: "s = \"abcd\", t = \"abcde\"", output: "\"e\"" },
      { input: "s = \"\", t = \"y\"", output: "\"y\"" },
    ],
    intuition: "XOR all characters in both strings — every character that appears in both cancels out, leaving only the extra character, just like Single Number.",
    approach: [
      "Initialize result = 0.",
      "XOR every character code in s and t into result.",
      "Return String.fromCharCode(result).",
    ],
    solution: `function findTheDifference(s, t) {
  let result = 0;
  for (const c of s) result ^= c.charCodeAt(0);
  for (const c of t) result ^= c.charCodeAt(0);
  return String.fromCharCode(result);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "XOR-based difference detection is used in change-data-capture (CDC) pipelines to identify which row changed between two snapshots without storing the full diff. Stream replication systems also use XOR checksums on column values to detect replication divergence across database replicas.",
    pitfalls: ["The XOR approach handles duplicates correctly because each pair cancels regardless of order.", "An alternative frequency-map approach uses O(n) space — XOR is strictly better here."],
  },
  {
    id: "bit-manipulation-10",
    title: "Binary Number with Alternating Bits",
    difficulty: "Easy",
    tags: ["Bit Manipulation"],
    statement: "Given a positive integer, check whether it has alternating bits: namely, if two adjacent bits will always have different values.",
    examples: [
      { input: "n = 5 (binary: 101)", output: "true" },
      { input: "n = 7 (binary: 111)", output: "false" },
      { input: "n = 11 (binary: 1011)", output: "false" },
    ],
    intuition: "If we shift n right by one and XOR with the original, a number with alternating bits produces all 1s — like a checkerboard. Then check that those all-1s value has no two adjacent 1s: (x & (x+1)) === 0.",
    approach: [
      "Compute xor = n ^ (n >>> 1).",
      "A valid alternating number gives xor = 0b111...1 (all 1s).",
      "Check (xor & (xor + 1)) === 0.",
    ],
    solution: `function hasAlternatingBits(n) {
  const xor = n ^ (n >>> 1);
  return (xor & (xor + 1)) === 0;
}`,
    language: "javascript",
    complexity: { time: "O(1)", space: "O(1)" },
    systemDesign: "Alternating-bit patterns (like 0xAAAAAAAA and 0x55555555) are used as test patterns in memory diagnostics and hardware stress tests to ensure adjacent bit cells do not interfere with each other. They also appear in checkered hash-partitioning schemes that alternate data across two storage tiers.",
    pitfalls: ["Use >>> (unsigned right shift) to avoid sign-extension on negative inputs.", "(xor & (xor + 1)) === 0 checks that xor is of the form 0b0...01...1, confirming all bits are 1s."],
  },
  {
    id: "bit-manipulation-11",
    title: "Complement of Base 10 Integer",
    difficulty: "Easy",
    tags: ["Bit Manipulation"],
    statement: "The complement of an integer is the integer you get when you flip all 0s to 1s and 1s to 0s in its binary representation. Given an integer num, return its complement.",
    examples: [
      { input: "num = 5", output: "2", explanation: "5 = 101 in binary; complement = 010 = 2." },
      { input: "num = 7", output: "0" },
      { input: "num = 10", output: "5" },
    ],
    intuition: "XOR the number with a mask of all 1s that is exactly as wide as the number in binary — flipping every bit within its own length, and no more.",
    approach: [
      "If num === 0 return 1.",
      "Count bits: bitLen = Math.floor(Math.log2(num)) + 1.",
      "Build mask = (1 << bitLen) - 1.",
      "Return num ^ mask.",
    ],
    solution: `function bitwiseComplement(num) {
  if (num === 0) return 1;
  const bitLen = Math.floor(Math.log2(num)) + 1;
  const mask = (1 << bitLen) - 1;
  return num ^ mask;
}`,
    language: "javascript",
    complexity: { time: "O(1)", space: "O(1)" },
    systemDesign: "Masked complement operations appear in network access control lists where a permission bitmask is complemented within a specific field width to compute the deny mask without touching higher bits — exactly what firewalls do when building packet filter rules from CIDR notation.",
    pitfalls: ["num = 0 is a special case: log2(0) is -Infinity; handle it explicitly.", "This differs from ~num (JS bitwise NOT) which flips all 32 bits."],
  },
  {
    id: "bit-manipulation-12",
    title: "Add Binary",
    difficulty: "Easy",
    tags: ["Bit Manipulation", "String", "Math"],
    statement: "Given two binary strings a and b, return their sum as a binary string.",
    examples: [
      { input: "a = \"11\", b = \"1\"", output: "\"100\"" },
      { input: "a = \"1010\", b = \"1011\"", output: "\"10101\"" },
    ],
    intuition: "Add bit by bit from right to left, just like you learned addition in school, carrying a 1 whenever the sum hits 2 — it is long addition but in base 2 instead of base 10.",
    approach: [
      "Use two pointers at the end of both strings and a carry variable.",
      "Sum the digits and carry; result bit = sum % 2; new carry = Math.floor(sum / 2).",
      "Prepend the result bit.",
      "If carry remains after the loop, prepend '1'.",
    ],
    solution: `function addBinary(a, b) {
  let i = a.length - 1, j = b.length - 1, carry = 0;
  let result = "";
  while (i >= 0 || j >= 0 || carry) {
    const sum = (i >= 0 ? +a[i--] : 0) + (j >= 0 ? +b[j--] : 0) + carry;
    result = (sum % 2) + result;
    carry = Math.floor(sum / 2);
  }
  return result || "0";
}`,
    language: "javascript",
    complexity: { time: "O(max(m,n))", space: "O(max(m,n))" },
    systemDesign: "Binary addition with carry is the foundation of hardware adder circuits (ripple-carry and carry-lookahead adders). At scale, arbitrary-precision arithmetic libraries used in cryptography (RSA key generation, elliptic-curve operations) implement the same carry-propagation algorithm across multi-word integers.",
    pitfalls: ["Do not use parseInt(a, 2) for very long strings — they exceed JavaScript's safe integer range.", "Continue the loop while carry is still 1 even after both string pointers are exhausted."],
  },
  {
    id: "bit-manipulation-13",
    title: "Convert a Number to Hexadecimal",
    difficulty: "Easy",
    tags: ["Bit Manipulation", "Math"],
    statement: "Given a 32-bit integer num, return a string representing its hexadecimal form. Negative numbers use two's complement representation. Do not use any built-in library methods.",
    examples: [
      { input: "num = 26", output: "\"1a\"" },
      { input: "num = -1", output: "\"ffffffff\"" },
    ],
    intuition: "Extract 4 bits at a time from the right using num & 0xF, look up the hex digit, then shift right by 4 — it is like reading a number in groups of four binary digits.",
    approach: [
      "If num === 0 return '0'.",
      "Treat num as unsigned 32-bit using >>> 0.",
      "Loop while num > 0: extract hex[num & 0xF], prepend, shift num >>> 4.",
    ],
    solution: `function toHex(num) {
  if (num === 0) return "0";
  const hex = "0123456789abcdef";
  let n = num >>> 0; // treat as unsigned 32-bit
  let result = "";
  while (n > 0) {
    result = hex[n & 0xF] + result;
    n >>>= 4;
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(1) — at most 8 hex digits", space: "O(1)" },
    systemDesign: "Hexadecimal encoding is ubiquitous in systems programming: memory addresses, color codes, SHA/MD5 hashes, MAC addresses, and UUID fields are all displayed as hex. Database systems store binary blobs and hash indexes in hex-escaped form, and byte-level network packet dumps universally use hex for human readability.",
    pitfalls: ["Use >>> 0 to convert the signed JavaScript integer to unsigned before extracting nibbles.", "num === 0 must be handled separately since the loop would never execute."],
  },
  {
    id: "bit-manipulation-14",
    title: "Counting Bits",
    difficulty: "Easy",
    tags: ["Bit Manipulation", "Dynamic Programming"],
    statement: "Given an integer n, return an array ans of length n + 1 such that for each i in [0, n], ans[i] is the number of 1s in the binary representation of i.",
    examples: [
      { input: "n = 2", output: "[0,1,1]" },
      { input: "n = 5", output: "[0,1,1,2,1,2]" },
    ],
    intuition: "The number of 1-bits in i equals the number of 1-bits in i with its lowest bit removed (i >> 1), plus the value of that lowest bit (i & 1). Build the table reusing earlier results.",
    approach: [
      "Create dp array of size n+1 with dp[0] = 0.",
      "For i from 1 to n: dp[i] = dp[i >> 1] + (i & 1).",
      "Return dp.",
    ],
    solution: `function countBits(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Precomputed popcount tables (like dp here) are embedded in database engines and compression libraries to accelerate bitset operations — a 256-entry lookup table lets you count set bits in a byte with a single array access instead of looping. Roaring Bitmaps use such tables to compute cardinalities of compressed bitsets in sub-microsecond time.",
    pitfalls: ["The recurrence dp[i] = dp[i >> 1] + (i & 1) works because i >> 1 drops the lowest bit and has already been computed.", "Do not confuse i >> 1 (arithmetic shift) with i >>> 1 (unsigned shift) — for non-negative i they are identical here."],
  },
  {
    id: "bit-manipulation-15",
    title: "Set Mismatch",
    difficulty: "Easy",
    tags: ["Bit Manipulation", "Array", "Hashing"],
    statement: "You have a set of integers from 1 to n that has exactly one element duplicated and one element missing. Return [the duplicate, the missing].",
    examples: [
      { input: "nums = [1,2,2,4]", output: "[2,3]" },
      { input: "nums = [1,1]", output: "[1,2]" },
    ],
    intuition: "XOR all elements and all indices 1..n to isolate the XOR of the duplicate and missing. Then use a frequency count to directly find the duplicate, from which the missing follows.",
    approach: [
      "Count frequencies in a map.",
      "Iterate 1..n: if count[i] === 2, it is the duplicate; if count[i] === 0, it is the missing.",
      "Return [dup, missing].",
    ],
    solution: `function findErrorNums(nums) {
  const count = new Array(nums.length + 1).fill(0);
  for (const n of nums) count[n]++;
  let dup = -1, missing = -1;
  for (let i = 1; i < count.length; i++) {
    if (count[i] === 2) dup = i;
    if (count[i] === 0) missing = i;
  }
  return [dup, missing];
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Detecting a duplicate and a missing ID in a sequence is a classic database integrity check run after bulk inserts to ensure auto-increment columns have no collisions or gaps. Data-pipeline audits use the same logic on event sequence numbers to detect both replayed (duplicate) and dropped (missing) messages.",
    pitfalls: ["A purely XOR-based approach needs an extra step to split the XOR of dup and missing into the two values; the counting approach is clearer.", "Ensure the count array is sized n+1 to index directly by value."],
  },
  {
    id: "bit-manipulation-16",
    title: "Prime Number of Set Bits in Binary Representation",
    difficulty: "Easy",
    tags: ["Bit Manipulation", "Math"],
    statement: "Given two integers left and right, return the count of numbers in the inclusive range [left, right] having a prime number of set bits in their binary representation.",
    examples: [
      { input: "left = 6, right = 10", output: "4" },
      { input: "left = 10, right = 15", output: "5" },
    ],
    intuition: "Count the 1-bits of each number in the range, then check if that count is prime — since numbers fit in at most 20 bits, you only need to check primes up to 19.",
    approach: [
      "Precompute a small set of primes up to 20: {2,3,5,7,11,13,17,19}.",
      "For each n in [left, right], count its set bits.",
      "If the count is in the prime set, increment the answer.",
    ],
    solution: `function countPrimeSetBits(left, right) {
  const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19]);
  let count = 0;
  for (let n = left; n <= right; n++) {
    let bits = 0, x = n;
    while (x) { x &= x - 1; bits++; }
    if (primes.has(bits)) count++;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O((right - left) * log(right))", space: "O(1)" },
    systemDesign: "Combining bit counting with a small lookup table is a pattern in hardware-accelerated cryptography: primality tests over bit-length ranges are used in RSA key-generation routines that scan candidates by their Hamming weight before applying full primality tests, pruning the search space dramatically.",
    pitfalls: ["Numbers up to 10^6 need at most 20 bits, so the prime set is bounded and tiny.", "Remember to reset the bit counter for each new number."],
  },
  {
    id: "bit-manipulation-17",
    title: "Decode XORed Array",
    difficulty: "Easy",
    tags: ["Bit Manipulation", "Array"],
    statement: "There is a hidden integer array arr of length n. You are given encoded[i] = arr[i] XOR arr[i+1] and the first element arr[0] = first. Decode and return the original array.",
    examples: [
      { input: "encoded = [1,2,3], first = 1", output: "[1,0,2,1]" },
      { input: "encoded = [6,2,7,3], first = 4", output: "[4,2,0,7,4]" },
    ],
    intuition: "Since encoded[i] = arr[i] XOR arr[i+1], XOR-ing encoded[i] with arr[i] gives arr[i+1] directly — XOR is its own inverse, like an undoable toggle.",
    approach: [
      "Initialize arr = [first].",
      "For each value in encoded, compute next = arr[last] ^ encoded[i].",
      "Append next to arr.",
      "Return arr.",
    ],
    solution: `function decode(encoded, first) {
  const arr = [first];
  for (const e of encoded) {
    arr.push(arr[arr.length - 1] ^ e);
  }
  return arr;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "XOR-based encoding is used in delta encoding for time-series databases like Gorilla (Facebook's TSDB), where each float is XOR-compressed against the previous value to exploit repeated high bits, achieving 4x compression on monotonic metrics such as CPU usage counters.",
    pitfalls: ["XOR is self-inverse: a ^ b ^ b = a, so knowing encoded[i] and arr[i] directly gives arr[i+1].", "The first element is given explicitly and starts the chain; do not skip it."],
  },
  {
    id: "bit-manipulation-18",
    title: "Minimum Flips to Make a OR b Equal to c",
    difficulty: "Easy",
    tags: ["Bit Manipulation"],
    statement: "Given positive integers a, b, and c, return the minimum number of bit flips required in a and b so that a OR b equals c.",
    examples: [
      { input: "a = 2, b = 6, c = 5", output: "3" },
      { input: "a = 4, b = 2, c = 7", output: "1" },
      { input: "a = 1, b = 2, c = 3", output: "0" },
    ],
    intuition: "Check each bit position one at a time. If the target bit in c is 0, both a and b must be 0 — count each 1 in a or b as a flip. If the target bit is 1, at least one must be 1 — if both are 0, we need one flip.",
    approach: [
      "Loop over 32 bit positions.",
      "Extract bit i from a, b, and c.",
      "If c_bit == 0: flips += a_bit + b_bit.",
      "If c_bit == 1 and a_bit == 0 and b_bit == 0: flips += 1.",
      "Return flips.",
    ],
    solution: `function minFlips(a, b, c) {
  let flips = 0;
  for (let i = 0; i < 32; i++) {
    const ba = (a >> i) & 1;
    const bb = (b >> i) & 1;
    const bc = (c >> i) & 1;
    if (bc === 0) {
      flips += ba + bb;
    } else if (ba === 0 && bb === 0) {
      flips += 1;
    }
  }
  return flips;
}`,
    language: "javascript",
    complexity: { time: "O(1) — 32 iterations", space: "O(1)" },
    systemDesign: "Minimum flip counting models the cost of reconfiguring feature-flag bitmasks in A/B testing platforms — each bit represents a feature toggle, and the flip count is the number of config changes needed to reach a target state. Permission migration tools use the same analysis to compute the cheapest ACL transition between two role bitmasks.",
    pitfalls: ["When c_bit is 0, both a_bit and b_bit contribute independently to the flip count.", "When c_bit is 1, you only need one flip even if both bits are 0."],
  },
  // ---- MEDIUM (18 problems) ----
  {
    id: "bit-manipulation-19",
    title: "Sum of Two Integers",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Math"],
    statement: "Given two integers a and b, return the sum of the two integers without using the operators + and -.",
    examples: [
      { input: "a = 1, b = 2", output: "3" },
      { input: "a = 2, b = 3", output: "5" },
    ],
    intuition: "XOR adds bits without carry; AND shifted left gives the carry. Repeat until there is no carry left — it is exactly how a binary adder works in hardware.",
    approach: [
      "While b != 0: compute carry = (a & b) << 1; a = a ^ b; b = carry.",
      "Return a.",
      "Use >>> 0 to mask to 32 bits and avoid infinite loops on negative numbers in JavaScript.",
    ],
    solution: `function getSum(a, b) {
  while (b !== 0) {
    const carry = ((a & b) << 1) | 0;
    a = (a ^ b) | 0;
    b = carry;
  }
  return a;
}`,
    language: "javascript",
    complexity: { time: "O(1) — at most 32 iterations", space: "O(1)" },
    systemDesign: "Carry-propagation addition is the foundation of ALU design; half-adders and full-adders in CPUs implement this exact XOR-and-AND circuit. Distributed counter aggregation (e.g., summing shard counters in a database) ultimately relies on hardware adders that perform millions of these carry-propagation cycles per nanosecond.",
    pitfalls: ["In JavaScript, left shift can produce negative numbers due to 32-bit signed interpretation; use | 0 to keep results within 32-bit signed range.", "The loop terminates because each iteration reduces the number of bits that need carrying."],
  },
  {
    id: "bit-manipulation-20",
    title: "Single Number II",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Array"],
    statement: "Given an integer array where every element appears three times except for one element which appears exactly once, find and return that single element. Solve in O(n) time and O(1) space.",
    examples: [
      { input: "nums = [2,2,3,2]", output: "3" },
      { input: "nums = [0,1,0,1,0,1,99]", output: "99" },
    ],
    intuition: "For each bit position, count how many numbers have a 1 there. If that count mod 3 is nonzero, the single number has a 1 at that position — the triple counts cancel out.",
    approach: [
      "For each of the 32 bit positions, sum the bit across all numbers.",
      "If sum % 3 != 0, the single number has a 1 at that bit.",
      "Reconstruct the number from these bits.",
    ],
    solution: `function singleNumber(nums) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    let bitSum = 0;
    for (const n of nums) bitSum += (n >> i) & 1;
    if (bitSum % 3 !== 0) result |= (1 << i);
  }
  return result | 0; // sign-extend to handle negative result
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "The mod-k bit counting technique generalises to any number of repeats, making it useful for distributed vote tallying where you want the value that does not reach a quorum threshold. Erasure-coded storage systems (like LRC codes in Azure Storage) use generalised XOR and bit-sum operations over GF(2^k) to reconstruct missing shards.",
    pitfalls: ["Use | 0 at the end to correctly sign-extend the result for negative single numbers.", "The bit-by-bit approach is straightforward; the two-variable (ones, twos) approach is more elegant but harder to derive."],
  },
  {
    id: "bit-manipulation-21",
    title: "Single Number III",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Array"],
    statement: "Given an integer array nums, in which exactly two elements appear only once and all the other elements appear exactly twice, find the two elements that appear only once.",
    examples: [
      { input: "nums = [1,2,1,3,2,5]", output: "[3,5]" },
      { input: "nums = [-1,0]", output: "[-1,0]" },
    ],
    intuition: "XOR everything to get a = x XOR y (the two unique numbers). Find any set bit in a (the two numbers differ here). Use that bit to partition all numbers into two groups — each group's XOR gives one unique number.",
    approach: [
      "XOR all numbers to get diff = x ^ y.",
      "Find any set bit in diff: lowBit = diff & (-diff).",
      "Partition numbers by whether lowBit is set; XOR each group separately.",
      "The two XOR results are x and y.",
    ],
    solution: `function singleNumber(nums) {
  let diff = 0;
  for (const n of nums) diff ^= n;
  const lowBit = diff & (-diff);
  let x = 0;
  for (const n of nums) {
    if (n & lowBit) x ^= n;
  }
  return [x, diff ^ x];
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Two-XOR separation is used in error-locator polynomials in Reed-Solomon codes, which power QR code error correction, CD/DVD storage, and deep-space communication. The ability to isolate two differing elements from XOR is exploited in hardware fault diagnostics that identify which two components have failed in a redundant system.",
    pitfalls: ["lowBit = diff & (-diff) isolates the rightmost set bit, guaranteeing the two groups are non-empty.", "The result for the second number is simply diff XOR x."],
  },
  {
    id: "bit-manipulation-22",
    title: "Bitwise AND of Numbers Range",
    difficulty: "Medium",
    tags: ["Bit Manipulation"],
    statement: "Given two integers left and right representing a range [left, right], return the bitwise AND of all numbers in that range, inclusive.",
    examples: [
      { input: "left = 5, right = 7", output: "4" },
      { input: "left = 0, right = 0", output: "0" },
      { input: "left = 1, right = 2147483647", output: "0" },
    ],
    intuition: "Any bit that ever changes to 0 anywhere in the range will be 0 in the AND result. The answer is just the common prefix of left and right in binary — shift both right until they are equal, then shift back.",
    approach: [
      "While left != right: right >>= 1; left >>= 1; shift++.",
      "Return left << shift.",
    ],
    solution: `function rangeBitwiseAnd(left, right) {
  let shift = 0;
  while (left !== right) {
    left >>= 1;
    right >>= 1;
    shift++;
  }
  return left << shift;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "Common-prefix bit extraction is used in IP routing tables (CIDR prefix matching) — routers compute the longest common bit prefix between destination IPs and route prefixes to find the most specific matching route. Trie-based indexes in databases apply the same common-prefix compression to reduce index size for ranges of sequential keys.",
    pitfalls: ["The common prefix shrinks as the range widens — a range spanning a power of two always has a 0 result.", "Both pointers must advance together, or the loop diverges."],
  },
  {
    id: "bit-manipulation-23",
    title: "Subsets (Bitmask)",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Array", "Backtracking"],
    statement: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    examples: [
      { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" },
      { input: "nums = [0]", output: "[[],[0]]" },
    ],
    intuition: "Each subset corresponds to a bitmask from 0 to 2^n - 1 where bit i being 1 means nums[i] is included. Iterate over all 2^n masks and collect the elements whose bit is set.",
    approach: [
      "Compute total = 1 << n.",
      "For mask from 0 to total-1, build the subset by checking each bit.",
      "Collect all subsets.",
    ],
    solution: `function subsets(nums) {
  const n = nums.length;
  const result = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(nums[i]);
    }
    result.push(subset);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * 2^n)", space: "O(n * 2^n)" },
    systemDesign: "Bitmask subset enumeration is the foundation of bitmask DP for small n, used in combinatorial optimisation problems like the Travelling Salesman Problem in operations research and CPU pipeline scheduling. Feature combination testing in A/B platforms also enumerates subsets of feature flags using bitmasks to find the optimal combination.",
    pitfalls: ["Works efficiently only for n <= 20 due to the 2^n factor.", "Bit i in the mask corresponds to nums[i], not the value of the element itself."],
  },
  {
    id: "bit-manipulation-24",
    title: "Gray Code",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Math"],
    statement: "An n-bit gray code sequence is a sequence of 2^n integers where every consecutive pair differs by exactly one bit. Given n, return any valid n-bit gray code sequence.",
    examples: [
      { input: "n = 2", output: "[0,1,3,2]" },
      { input: "n = 1", output: "[0,1]" },
    ],
    intuition: "The standard Gray code for integer i is simply i XOR (i >> 1) — shifting right by one and XORing with the original always produces a sequence where consecutive values differ by exactly one bit.",
    approach: [
      "For i from 0 to 2^n - 1, compute i ^ (i >> 1).",
      "Collect and return the results.",
    ],
    solution: `function grayCode(n) {
  const result = [];
  for (let i = 0; i < (1 << n); i++) {
    result.push(i ^ (i >> 1));
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(2^n)", space: "O(2^n)" },
    systemDesign: "Gray codes are used in rotary encoders and optical shaft encoders (used in robotics and CNC machines) so that mechanical position errors cause at most a 1-bit read error rather than potentially a large jump. Analog-to-digital converters also use Gray codes to reduce glitch errors when multiple bits change simultaneously.",
    pitfalls: ["The formula i ^ (i >> 1) generates the standard reflected binary Gray code — this is the simplest valid sequence.", "Any rotation or reflection of this sequence is also valid."],
  },
  {
    id: "bit-manipulation-25",
    title: "Total Hamming Distance",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Array", "Math"],
    statement: "The Hamming distance between two integers is the number of positions at which the corresponding bits differ. Given an integer array nums, return the sum of Hamming distances between all pairs of numbers.",
    examples: [
      { input: "nums = [4,14,2]", output: "6" },
      { input: "nums = [4,14,4]", output: "4" },
    ],
    intuition: "For each bit position, count how many numbers have a 1 (call it 'ones') and how many have a 0 (call it 'zeros'). The contribution of that position is ones * zeros because every 1-0 pair differs there.",
    approach: [
      "For each of the 32 bit positions, count the number of 1s.",
      "Contribution = ones * (n - ones).",
      "Sum all contributions.",
    ],
    solution: `function totalHammingDistance(nums) {
  let total = 0;
  for (let i = 0; i < 32; i++) {
    let ones = 0;
    for (const n of nums) ones += (n >> i) & 1;
    total += ones * (nums.length - ones);
  }
  return total;
}`,
    language: "javascript",
    complexity: { time: "O(32 * n) = O(n)", space: "O(1)" },
    systemDesign: "Per-bit contribution counting is used in information-theoretic distance metrics for distributed data similarity. In genome sequencing, total pairwise Hamming distance across a population of DNA sequences measures genetic diversity — the same bit-counting decomposition works column-by-column on aligned binary encodings of nucleotide sequences.",
    pitfalls: ["The naive pairwise approach is O(n^2) — the column-wise bit count reduces it to O(32n).", "ones * (n - ones) correctly counts both directions of each pair without double-counting."],
  },
  {
    id: "bit-manipulation-26",
    title: "Concatenation of Consecutive Binary Numbers",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Math"],
    statement: "Given an integer n, return the decimal value of the binary string formed by concatenating the binary representations of 1 to n in order, modulo 10^9 + 7.",
    examples: [
      { input: "n = 1", output: "1" },
      { input: "n = 3", output: "27", explanation: "Binary concatenation: 1|10|11 = 11011 = 27." },
      { input: "n = 12", output: "505379714" },
    ],
    intuition: "To append the binary of i to the running result, shift result left by the bit-length of i (making room), then OR in i — like pushing digits onto the end of a big number in base 2.",
    approach: [
      "Initialize result = 0.",
      "For i from 1 to n: compute bit length of i (floor(log2(i)) + 1).",
      "result = ((result << bitLen) | i) % MOD.",
    ],
    solution: `function concatenatedBinary(n) {
  const MOD = 1_000_000_007n;
  let result = 0n;
  for (let i = 1; i <= n; i++) {
    const bitLen = BigInt(Math.floor(Math.log2(i)) + 1);
    result = ((result << bitLen) | BigInt(i)) % MOD;
  }
  return Number(result);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Shift-and-OR concatenation of binary values mirrors how protocol frame builders pack variable-length fields into a fixed-width register — network packet headers are assembled bit by bit using exactly this shifting idiom in hardware pipeline registers. Modular arithmetic on large assembled values also appears in rolling-hash schemes for Rabin-Karp substring search.",
    pitfalls: ["Use BigInt to avoid precision loss from very large intermediate results.", "The bit length of i increments by 1 each time i crosses a power of two; you can track this incrementally for O(1) per step."],
  },
  {
    id: "bit-manipulation-27",
    title: "XOR Queries of a Subarray",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Array", "Prefix Sum"],
    statement: "Given an array arr and a list of queries [left, right], for each query return the XOR of all elements in arr[left..right].",
    examples: [
      { input: "arr = [1,3,4,8], queries = [[0,1],[1,2],[0,3],[3,3]]", output: "[2,7,14,8]" },
    ],
    intuition: "Build a prefix XOR array just like a prefix sum. The XOR of a range [l, r] equals prefixXOR[r+1] XOR prefixXOR[l], because XOR-ing the prefix twice cancels anything before l.",
    approach: [
      "Build prefix where prefix[0] = 0 and prefix[i+1] = prefix[i] ^ arr[i].",
      "For each query [l, r]: return prefix[r+1] ^ prefix[l].",
    ],
    solution: `function xorQueries(arr, queries) {
  const prefix = [0];
  for (const v of arr) prefix.push(prefix[prefix.length - 1] ^ v);
  return queries.map(([l, r]) => prefix[r + 1] ^ prefix[l]);
}`,
    language: "javascript",
    complexity: { time: "O(n + q)", space: "O(n)" },
    systemDesign: "Prefix XOR arrays are used in cryptographic stream cipher verification — checking the XOR checksum over any window of a transmitted stream in O(1) to detect tampering. In distributed tracing systems, XOR-fingerprints of event spans across a request tree are compared against expected values to quickly detect missing or corrupted trace segments.",
    pitfalls: ["prefix[r+1] ^ prefix[l] is analogous to prefix_sum[r+1] - prefix_sum[l] for sums.", "Seed prefix with a 0 element so that queries starting at index 0 are handled uniformly."],
  },
  {
    id: "bit-manipulation-28",
    title: "Maximum XOR of Two Numbers in an Array",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Trie", "Array"],
    statement: "Given an integer array nums, return the maximum result of nums[i] XOR nums[j] where 0 <= i <= j < n.",
    examples: [
      { input: "nums = [3,10,5,25,2,8]", output: "28", explanation: "5 XOR 25 = 28." },
      { input: "nums = [14,70,53,83,49,91,36,80,92,51,66,70]", output: "127" },
    ],
    intuition: "Build a binary trie of all numbers. For each number, greedily traverse the trie choosing the opposite bit at every level — going opposite maximises XOR from the highest bit down.",
    approach: [
      "Insert all numbers bit by bit (from MSB) into a trie.",
      "For each number, query the trie greedily: at each bit, prefer the opposite child if it exists.",
      "Track the maximum XOR seen.",
    ],
    solution: `function findMaximumXOR(nums) {
  // Trie node: children[0] and children[1]
  const root = {};
  for (const n of nums) {
    let node = root;
    for (let i = 31; i >= 0; i--) {
      const bit = (n >> i) & 1;
      if (!node[bit]) node[bit] = {};
      node = node[bit];
    }
  }
  let maxXor = 0;
  for (const n of nums) {
    let node = root, cur = 0;
    for (let i = 31; i >= 0; i--) {
      const bit = (n >> i) & 1;
      const want = 1 - bit;
      if (node[want]) { cur |= (1 << i); node = node[want]; }
      else node = node[bit];
    }
    maxXor = Math.max(maxXor, cur);
  }
  return maxXor;
}`,
    language: "javascript",
    complexity: { time: "O(32n)", space: "O(32n)" },
    systemDesign: "Binary trie-based XOR maximisation is used in network routing (finding the route that maximally differs from a given destination to detect BGP route-hijacking anomalies) and in locality-sensitive hashing where maximum XOR distance identifies points in opposite hash buckets for fast near-duplicate detection.",
    pitfalls: ["Process bits from the most significant (bit 31) to least significant to greedily maximise XOR from the top.", "The trie can use plain objects or arrays of length 2 as nodes; objects are simpler in JavaScript."],
  },
  {
    id: "bit-manipulation-29",
    title: "Count Triplets That Can Form Two Arrays of Equal XOR",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Array", "Math"],
    statement: "Given an array arr, count the number of triplets (i, j, k) with i < j <= k such that arr[i] XOR arr[i+1] XOR ... XOR arr[j-1] equals arr[j] XOR arr[j+1] XOR ... XOR arr[k].",
    examples: [
      { input: "arr = [2,3,1,6,7]", output: "4" },
      { input: "arr = [1,1,1,1,1]", output: "10" },
    ],
    intuition: "a == b implies a XOR b == 0, which means the XOR of the whole range arr[i..k] is 0. So we need to count all (i, k) pairs where prefix[i] == prefix[k+1], and for each such pair every j in (i, k] works, giving (k - i) valid triplets.",
    approach: [
      "Build prefix XOR array.",
      "For each pair (i, k+1) where prefix[i] == prefix[k+1], add (k - i) to count.",
    ],
    solution: `function countTriplets(arr) {
  const n = arr.length;
  const prefix = [0];
  for (const v of arr) prefix.push(prefix[prefix.length - 1] ^ v);
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let k = i + 1; k < n; k++) {
      if (prefix[i] === prefix[k + 1]) count += k - i;
    }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n)" },
    systemDesign: "Zero-XOR range detection is used in network packet integrity checks — a sequence of packets whose XOR checksum is zero indicates a balanced (self-correcting) transmission window. This property is leveraged in erasure coding where data blocks are grouped so their XOR is zero, enabling single-block reconstruction without extra storage.",
    pitfalls: ["The key insight is that a == b iff a XOR b == 0 iff the entire XOR of arr[i..k] is 0.", "Once you find such a range [i, k], any j strictly between i and k gives a valid triplet, contributing k - i total."],
  },
  {
    id: "bit-manipulation-30",
    title: "Find XOR Sum of All Pairs Bitwise AND",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Array", "Math"],
    statement: "Given two arrays arr1 and arr2, return the XOR sum of all pairs (arr1[i] AND arr2[j]) for all 0 <= i < arr1.length and 0 <= j < arr2.length.",
    examples: [
      { input: "arr1 = [1,2,3], arr2 = [6,5]", output: "0" },
      { input: "arr1 = [12], arr2 = [4]", output: "4" },
    ],
    intuition: "XOR and AND distribute: the XOR of all (a AND b_j) for a fixed a equals a AND (XOR of all b_j). Then XOR across all a_i gives (XOR of arr1) AND (XOR of arr2).",
    approach: [
      "Compute xor1 = XOR of all elements in arr1.",
      "Compute xor2 = XOR of all elements in arr2.",
      "Return xor1 & xor2.",
    ],
    solution: `function getXORSum(arr1, arr2) {
  const xor1 = arr1.reduce((acc, v) => acc ^ v, 0);
  const xor2 = arr2.reduce((acc, v) => acc ^ v, 0);
  return xor1 & xor2;
}`,
    language: "javascript",
    complexity: { time: "O(m + n)", space: "O(1)" },
    systemDesign: "Algebraic reductions like (XOR of AND pairs) = (AND of XOR totals) mirror how columnar databases fold aggregations: instead of materialising every pair, the query engine uses algebraic identities to collapse cross-product computations into single-pass scans, reducing join cost from O(mn) to O(m+n).",
    pitfalls: ["This simplification only works because XOR distributes over AND at the bit level.", "Verify with a small example before applying the reduction in an interview."],
  },
  {
    id: "bit-manipulation-31",
    title: "Decode XORed Permutation",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Array"],
    statement: "There is an integer array perm that is a permutation of [1, 2, ..., n] (n is odd). You are given encoded[i] = perm[i] XOR perm[i+1]. Recover perm.",
    examples: [
      { input: "encoded = [3,1]", output: "[1,2,3]" },
      { input: "encoded = [6,5,4,6]", output: "[2,4,1,5,3]" },
    ],
    intuition: "XOR of all numbers 1..n is known. The XOR of all even-indexed encoded values gives XOR of perm[1]..perm[n-1]. So perm[0] = total XOR XOR (that partial XOR). Then recover the rest sequentially.",
    approach: [
      "Compute total = XOR of 1..n.",
      "Compute odd = XOR of encoded[1], encoded[3], encoded[5], ... (even-indexed positions of perm, dropping first).",
      "perm[0] = total ^ odd.",
      "For i from 1 to n-1: perm[i] = perm[i-1] ^ encoded[i-1].",
    ],
    solution: `function decode(encoded) {
  const n = encoded.length + 1;
  let total = 0;
  for (let i = 1; i <= n; i++) total ^= i;
  let odd = 0;
  for (let i = 1; i < encoded.length; i += 2) odd ^= encoded[i];
  const perm = [total ^ odd];
  for (let i = 0; i < encoded.length; i++) perm.push(perm[i] ^ encoded[i]);
  return perm;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Recovering a sequence from its XOR-delta encoding mirrors how write-ahead logs (WAL) in databases store differential updates — the full row state can be reconstructed by replaying XOR-encoded deltas from a known checkpoint. This is the core of binlog-based replication in MySQL.",
    pitfalls: ["n must be odd for this approach to work — the odd-indexed encoded values skip perm[0] precisely.", "The XOR of 1..n follows a 4-cycle pattern: n, 1, n+1, 0 repeating, useful for O(1) computation."],
  },
  {
    id: "bit-manipulation-32",
    title: "Minimum Number of Operations to Make Array Continuous",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Array", "Sliding Window", "Binary Search"],
    statement: "You are given an integer array nums. In one operation you can replace any element. Return the minimum number of operations to make nums a continuous array (contains n consecutive distinct integers in any order).",
    examples: [
      { input: "nums = [4,2,5,3]", output: "0" },
      { input: "nums = [1,2,3,5,6]", output: "1" },
      { input: "nums = [1,10,100,1000]", output: "3" },
    ],
    intuition: "After deduplication and sorting, use a sliding window of size n over the range [nums[i], nums[i]+n-1] and count how many existing values fall inside. The more that fit, the fewer replacements needed.",
    approach: [
      "Deduplicate and sort nums.",
      "For each left boundary nums[i], binary-search for the rightmost value < nums[i] + n.",
      "Elements in window = (j - i + 1); operations = n - elements_in_window.",
      "Return the minimum operations.",
    ],
    solution: `function minOperations(nums) {
  const n = nums.length;
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  let ans = n;
  let j = 0;
  for (let i = 0; i < sorted.length; i++) {
    while (j < sorted.length && sorted[j] < sorted[i] + n) j++;
    ans = Math.min(ans, n - (j - i));
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Making arrays continuous models compaction in sorted-order storage: LSM-tree compaction identifies the minimum number of out-of-range keys to evict to restore a sorted run of exactly n consecutive keys per segment. Sliding-window counting on sorted data is a core technique in query optimisers' histogram-based cardinality estimation.",
    pitfalls: ["Deduplicate before sorting to handle duplicates, since duplicate values in the window are wasted.", "The pointer j only moves forward, making the two-pointer scan O(n) after sorting."],
  },
  {
    id: "bit-manipulation-33",
    title: "Maximum AND Sum of Array",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Dynamic Programming", "Bitmask DP"],
    statement: "You have an array nums of n integers and numSlots slots. Each slot can hold at most 2 numbers. Assign all numbers to slots to maximise the sum of nums[i] AND slot_index for each assignment.",
    examples: [
      { input: "nums = [1,2,3,4,5,6], numSlots = 3", output: "9" },
      { input: "nums = [1,3,10,4,7,1], numSlots = 9", output: "24" },
    ],
    intuition: "Use a bitmask DP where each bit of the mask encodes how many times each slot has been used (at most 2). For each state, try assigning the next unassigned number to each available slot.",
    approach: [
      "State: bitmask of 2*numSlots bits where bit 2k and 2k+1 represent first/second use of slot k+1.",
      "dp[mask] = max sum achievable by assigning the first popcount(mask) numbers using the slots indicated by mask.",
      "Transition: for each bit pair (slot), assign nums[idx] & slot to the slot.",
    ],
    solution: `function maximumANDSum(nums, numSlots) {
  const total = 1 << (2 * numSlots);
  const dp = new Array(total).fill(0);
  let ans = 0;
  for (let mask = 0; mask < total; mask++) {
    let bits = 0, tmp = mask;
    while (tmp) { bits += tmp & 1; tmp >>= 1; }
    const idx = bits;
    if (idx >= nums.length) continue;
    for (let slot = 1; slot <= numSlots; slot++) {
      const bit1 = 1 << (2 * (slot - 1));
      const bit2 = 1 << (2 * (slot - 1) + 1);
      if (!(mask & bit1)) {
        const next = dp[mask | bit1] = Math.max(dp[mask | bit1], dp[mask] + (nums[idx] & slot));
        ans = Math.max(ans, next);
      } else if (!(mask & bit2)) {
        const next = dp[mask | bit2] = Math.max(dp[mask | bit2], dp[mask] + (nums[idx] & slot));
        ans = Math.max(ans, next);
      }
    }
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(2^(2*numSlots) * numSlots)", space: "O(2^(2*numSlots))" },
    systemDesign: "Bitmask DP for assignment problems models combinatorial resource allocation in cloud schedulers — assigning tasks to CPU cores (slots) to maximise total affinity score is an NP-hard bin-packing variant solved exactly for small n using bitmask DP. Container orchestration platforms use relaxed heuristics derived from the same bitmask DP structure.",
    pitfalls: ["Each slot can hold exactly 2 items, so use 2 bits per slot in the mask.", "The index of the current number is the popcount of the current mask (how many items have already been assigned)."],
  },
  {
    id: "bit-manipulation-34",
    title: "Minimum One Bit Operations to Make Integers Zero",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Dynamic Programming", "Gray Code"],
    statement: "Given an integer n, you must transform it to 0 using the minimum number of operations. In one operation: change the rightmost bit, or change a bit at position i if bit i-1 is 1 and all bits below i-1 are 0. Return the minimum number of operations.",
    examples: [
      { input: "n = 0", output: "0" },
      { input: "n = 3", output: "2" },
      { input: "n = 6", output: "4" },
    ],
    intuition: "These rules are exactly how Gray code changes from one code to the next. The minimum operations to reach 0 from n is the position of n in the Gray code sequence, which equals the inverse Gray code of n.",
    approach: [
      "Compute the inverse Gray code: while n > 1, n ^= (n >> 1); result accumulates the position.",
      "Alternatively use the recurrence: f(n) = (1 << msb) - 1 - f(n ^ (1 << msb)) for the highest set bit.",
    ],
    solution: `function minimumOneBitOperations(n) {
  if (n === 0) return 0;
  let result = 0;
  for (let val = n; val > 0; val >>= 1) result ^= val;
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(1)" },
    systemDesign: "The Gray-code inverse is used in error-correcting code decoders and in the implementation of Gray-code counters for clock-domain crossing in digital hardware, where registers cross between two clock domains and the Gray property prevents metastability. FPGA designers implement this exact algorithm in synthesis tools.",
    pitfalls: ["The loop computes the inverse Gray code (also called the Gray code rank), which equals the minimum steps.", "This is equivalent to XOR-folding: result = n XOR (n >> 1) XOR (n >> 2) XOR ... until the shift is zero."],
  },
  {
    id: "bit-manipulation-35",
    title: "Largest Combination With Bitwise AND Greater Than Zero",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Array", "Greedy"],
    statement: "The bitwise AND of an array of numbers is greater than zero if any bit position is 1 in all elements. Given an array of positive integers candidates, return the size of the largest combination where the bitwise AND is greater than zero.",
    examples: [
      { input: "candidates = [16,17,71,62,12,24,14]", output: "4" },
      { input: "candidates = [8,8]", output: "2" },
    ],
    intuition: "A group of numbers has a non-zero AND only if they all share at least one common set bit. For each bit position, count how many numbers have that bit set — the largest such count is the answer.",
    approach: [
      "For each bit position 0..23 (candidates <= 10^7 < 2^24), count numbers with that bit set.",
      "Return the maximum count.",
    ],
    solution: `function largestCombination(candidates) {
  let max = 0;
  for (let bit = 0; bit < 24; bit++) {
    let count = 0;
    for (const c of candidates) {
      if ((c >> bit) & 1) count++;
    }
    max = Math.max(max, count);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(24 * n) = O(n)", space: "O(1)" },
    systemDesign: "Finding the most common shared bit models the most popular feature flag across active user sessions — the bit position with the highest 1-count is the flag held by the most users simultaneously. This per-bit frequency analysis is also the foundation of Bloom filter false-positive rate estimation across populated filter cells.",
    pitfalls: ["You only need to check bits 0..23 because candidates are bounded by 10^7.", "The AND of the entire group is non-zero iff at least one bit is shared by all — but here we are choosing the best subset, so the maximum single-bit count suffices."],
  },
  {
    id: "bit-manipulation-36",
    title: "Counting Bits (Sparse Encoding)",
    difficulty: "Medium",
    tags: ["Bit Manipulation", "Dynamic Programming", "Math"],
    statement: "Given an integer n, return the number of integers in the range [0, n] that have an even number of set bits.",
    examples: [
      { input: "n = 4", output: "3", explanation: "0(0 bits), 3(2 bits), 4(1 bit — odd, excluded), so 0,3 and... wait: 0=0bits even, 1=1bit odd, 2=1bit odd, 3=2bits even, 4=1bit odd => 2 even: 0 and 3. Output: 2." },
      { input: "n = 7", output: "4" },
    ],
    intuition: "Use the Counting Bits DP to precompute popcount for 0..n, then count how many are even. Alternatively, observe that exactly half the integers in any range of length that is a power of two have even popcount.",
    approach: [
      "Build dp where dp[i] = dp[i >> 1] + (i & 1).",
      "Count elements where dp[i] % 2 === 0.",
      "Return count.",
    ],
    solution: `function countEvenBitNumbers(n) {
  const dp = new Array(n + 1).fill(0);
  let count = 1; // dp[0] = 0 bits, which is even
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
    if (dp[i] % 2 === 0) count++;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Parity checks (even vs. odd bit count) are used in DRAM parity memory and in simple error-detection schemes where data words are required to have even Hamming weight. At scale, parity-coded storage stripes across servers so that any odd-count event signals a single-bit failure, triggering automatic recovery.",
    pitfalls: ["dp[0] = 0 (zero set bits) is even — count it in the initial count.", "This is a variant of the standard counting bits problem; the output is the count of even-popcount numbers, not the popcounts themselves."],
  },
  // ---- HARD (14 problems) ----
  {
    id: "bit-manipulation-37",
    title: "Minimum Number of K Consecutive Bit Flips",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "Sliding Window", "Greedy"],
    statement: "You are given a binary array nums and an integer k. A k-bit flip selects a subarray of length k and inverts all bits. Return the minimum number of flips needed to make every bit 1, or -1 if impossible.",
    examples: [
      { input: "nums = [0,1,0], k = 1", output: "2" },
      { input: "nums = [1,1,0], k = 3", output: "0" },
      { input: "nums = [0,0,0,1,0,1,1,0], k = 3", output: "3" },
    ],
    intuition: "Greedily flip every 0 from left to right. Instead of actually modifying k elements each time (O(nk)), track flips using a sliding window difference array — a flip started at position i affects positions i through i+k-1.",
    approach: [
      "Use a flip array (diff array) to track active flips in the current window.",
      "Maintain a running flipCount (parity of active flips at current position).",
      "For each position i: add diff[i] to flipCount; if (nums[i] ^ (flipCount & 1)) === 0, flip needed: increment flips, mark diff[i+k] (if in bounds), increment flipCount.",
      "Return flips or -1 if a flip extends beyond bounds.",
    ],
    solution: `function minKBitFlips(nums, k) {
  const n = nums.length;
  const diff = new Array(n + 1).fill(0);
  let flips = 0, flipCount = 0;
  for (let i = 0; i < n; i++) {
    flipCount ^= diff[i];
    if ((nums[i] ^ flipCount) === 0) {
      if (i + k > n) return -1;
      flips++;
      flipCount ^= 1;
      diff[i + k] ^= 1;
    }
  }
  return flips;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Greedy range-flip with a difference array is the same pattern used in lazy segment trees for bulk update operations — rather than updating every element in a range, you mark the boundaries and propagate lazily. This technique underpins bulk-update operations in columnar databases that avoid row-by-row updates in favour of range markers.",
    pitfalls: ["XOR the diff array into flipCount rather than summing, since each flip is a toggle (0/1).", "If i + k > n when a flip is needed, it is impossible — return -1."],
  },
  {
    id: "bit-manipulation-38",
    title: "Shortest Path Visiting All Nodes (Bitmask BFS)",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "BFS", "Graph", "Bitmask DP"],
    statement: "You have an undirected connected graph of n nodes. Return the length of the shortest path that visits every node. You may start from any node and revisit nodes.",
    examples: [
      { input: "graph = [[1,2,3],[0],[0],[0]]", output: "4" },
      { input: "graph = [[1],[0,2,4],[1,3,4],[2],[1,2]]", output: "4" },
    ],
    intuition: "Use BFS on states (node, visited_bitmask). Start from all nodes simultaneously (each with only itself visited). Expand layer by layer; the first time we reach full mask is the shortest path.",
    approach: [
      "Initial queue: all (node, 1 << node) pairs with distance 0.",
      "BFS: for each state (node, mask), try each neighbor; new state (neighbor, mask | (1 << neighbor)).",
      "Use a visited set of (node, mask) to avoid revisiting.",
      "Return when mask === (1 << n) - 1.",
    ],
    solution: `function shortestPathLength(graph) {
  const n = graph.length;
  const fullMask = (1 << n) - 1;
  const queue = [];
  const visited = new Set();
  for (let i = 0; i < n; i++) {
    const state = (i << 20) | (1 << i);
    queue.push([i, 1 << i, 0]);
    visited.add(state);
  }
  let head = 0;
  while (head < queue.length) {
    const [node, mask, dist] = queue[head++];
    if (mask === fullMask) return dist;
    for (const next of graph[node]) {
      const nextMask = mask | (1 << next);
      const state = (next << 20) | nextMask;
      if (!visited.has(state)) {
        visited.add(state);
        queue.push([next, nextMask, dist + 1]);
      }
    }
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(2^n * n)", space: "O(2^n * n)" },
    systemDesign: "Bitmask BFS for full-coverage paths models service mesh discovery in microservices — finding the shortest sequence of API calls that exercises every service endpoint in a canary deployment. It also directly models the Travelling Salesman Problem structure used in logistics route optimisation for delivery networks with a small number of mandatory stops.",
    pitfalls: ["The visited key must include both the current node AND the bitmask — same mask at different nodes is a different state.", "Starting BFS from all nodes simultaneously is equivalent to adding a virtual super-source with zero-cost edges to all nodes."],
  },
  {
    id: "bit-manipulation-39",
    title: "Partition to K Equal Sum Subsets (Bitmask DP)",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "Dynamic Programming", "Bitmask DP", "Backtracking"],
    statement: "Given an integer array nums and an integer k, return true if it is possible to divide nums into k non-empty subsets whose sums are all equal.",
    examples: [
      { input: "nums = [4,3,2,3,5,2,1], k = 4", output: "true" },
      { input: "nums = [1,2,3,4], k = 3", output: "false" },
    ],
    intuition: "Use a bitmask DP where dp[mask] = the current partial bucket sum when the elements indicated by mask have been placed. If dp[mask] % target === 0 we have completed another full bucket.",
    approach: [
      "Compute target = sum / k; return false if not integer or any element > target.",
      "dp[mask] = partial sum of the current (in-progress) bucket given elements in mask are used.",
      "For each mask, try adding each unused element to the current bucket.",
      "Return dp[(1 << n) - 1] === 0 (all buckets perfectly filled).",
    ],
    solution: `function canPartitionKSubsets(nums, k) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % k !== 0) return false;
  const target = total / k;
  if (nums.some(n => n > target)) return false;
  nums.sort((a, b) => b - a);
  const n = nums.length;
  const dp = new Array(1 << n).fill(-1);
  dp[0] = 0;
  for (let mask = 0; mask < (1 << n); mask++) {
    if (dp[mask] === -1) continue;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue;
      const next = mask | (1 << i);
      const newSum = (dp[mask] + nums[i]) % target;
      if (dp[next] === -1 && dp[mask] + nums[i] <= target) {
        dp[next] = newSum;
      }
    }
  }
  return dp[(1 << n) - 1] === 0;
}`,
    language: "javascript",
    complexity: { time: "O(n * 2^n)", space: "O(2^n)" },
    systemDesign: "Equal-sum partition models workload balancing across k servers — distributing tasks (with given CPU costs) so that each server gets the same total load. Bitmask DP is used in compiler register allocation (distributing variables across a fixed number of registers to minimise spill cost) and in FPGA logic synthesis partitioning.",
    pitfalls: ["Sorting descending prunes invalid states early and speeds up practical performance significantly.", "dp[mask] stores only the partial sum within the current bucket (modulo target), not the total sum."],
  },
  {
    id: "bit-manipulation-40",
    title: "Smallest Sufficient Team (Bitmask DP)",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "Dynamic Programming", "Bitmask DP"],
    statement: "In a project, you have a list of required skills and a list of people each with a subset of those skills. Return the smallest sufficient team that covers all required skills. You may return the answer in any order.",
    examples: [
      { input: "req_skills = [\"java\",\"nodejs\",\"reactjs\"], people = [[\"java\"],[\"nodejs\"],[\"nodejs\",\"reactjs\"]]", output: "[0,2]" },
      { input: "req_skills = [\"algorithms\",\"math\",\"java\",\"reactjs\",\"csharp\",\"aws\"], people = [[\"algorithms\",\"math\",\"java\"],[\"algorithms\",\"math\",\"reactjs\"],[\"java\",\"csharp\",\"reactjs\"],[\"csharp\",\"aws\"],[\"algorithms\",\"math\",\"csharp\",\"aws\"],[\"algorithms\"],..people with other skills..]", output: "[1,2,3]" },
    ],
    intuition: "Encode each person's skills as a bitmask. Use DP where dp[mask] = smallest team covering exactly the skills in mask. For each person, update all reachable masks by OR-ing in their skills.",
    approach: [
      "Map each skill to a bit index; encode each person as a skill bitmask.",
      "dp[0] = []; dp[fullMask] is the answer.",
      "For each mask from 0 to fullMask, for each person, update dp[mask | personMask] with dp[mask] + [person] if it is smaller.",
    ],
    solution: `function smallestSufficientTeam(req_skills, people) {
  const skillIndex = {};
  req_skills.forEach((s, i) => { skillIndex[s] = i; });
  const m = req_skills.length;
  const fullMask = (1 << m) - 1;
  const peopleMasks = people.map(skills =>
    skills.reduce((acc, s) => acc | (1 << skillIndex[s]), 0)
  );
  const dp = new Array(fullMask + 1).fill(null);
  dp[0] = [];
  for (let mask = 0; mask <= fullMask; mask++) {
    if (dp[mask] === null) continue;
    for (let i = 0; i < people.length; i++) {
      const next = mask | peopleMasks[i];
      if (dp[next] === null || dp[next].length > dp[mask].length + 1) {
        dp[next] = [...dp[mask], i];
      }
    }
  }
  return dp[fullMask];
}`,
    language: "javascript",
    complexity: { time: "O(2^m * n)", space: "O(2^m)" },
    systemDesign: "Minimum-team coverage maps directly to minimum set-cover, a classic NP-hard problem approximated in real-world hiring, vendor selection, and microservice decomposition. At scale, bitmask DP is feasible for up to ~20 required skills, after which greedy approximation (log-factor) is used in workforce planning tools.",
    pitfalls: ["The DP stores the actual team list (not just size) to reconstruct the answer — memory per state is O(n).", "Null check ensures we only extend reachable states."],
  },
  {
    id: "bit-manipulation-41",
    title: "Divide Two Integers",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "Math"],
    statement: "Given two integers dividend and divisor, divide without using multiplication, division, or mod operators. Truncate toward zero. Assume the environment stores 32-bit signed integers.",
    examples: [
      { input: "dividend = 10, divisor = 3", output: "3" },
      { input: "dividend = 7, divisor = -3", output: "-2" },
    ],
    intuition: "Double the divisor repeatedly (using left-shift, which is bit multiplication by 2) until it exceeds the dividend. Then subtract and record bits in the quotient from the top down — it is binary long division.",
    approach: [
      "Handle overflow edge case: INT_MIN / -1 = INT_MAX.",
      "Work with absolute values and track sign.",
      "For each bit from 31 down to 0, check if divisor << bit fits in the remaining dividend; if yes, set that bit in quotient and subtract.",
    ],
    solution: `function divide(dividend, divisor) {
  const INT_MAX = 2147483647, INT_MIN = -2147483648;
  if (dividend === INT_MIN && divisor === -1) return INT_MAX;
  const sign = (dividend > 0) === (divisor > 0) ? 1 : -1;
  let a = Math.abs(dividend), b = Math.abs(divisor);
  let quotient = 0;
  for (let i = 31; i >= 0; i--) {
    if ((a >>> i) >= b) {
      quotient += 1 << i;
      a -= b << i;
    }
  }
  return sign === 1 ? quotient : -quotient;
}`,
    language: "javascript",
    complexity: { time: "O(log^2 n)", space: "O(1)" },
    systemDesign: "Shift-based division appears in fixed-point arithmetic used in embedded systems (DSPs, microcontrollers) that lack an FPU. Database engines implement integer division and modulo using bit shifts for power-of-two divisors in hash-partitioning (shard = key & (numShards - 1)) to avoid expensive division hardware.",
    pitfalls: ["The INT_MIN / -1 case overflows — return INT_MAX explicitly.", "Use >>> (unsigned right shift) when checking if divisor << i fits, to avoid sign-bit interference."],
  },
  {
    id: "bit-manipulation-42",
    title: "Maximum XOR With an Element From Array",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "Trie", "Array", "Offline Query"],
    statement: "You are given an array nums and queries where queries[i] = [x_i, m_i]. For each query find the maximum XOR of x_i with any element of nums that is <= m_i. If no such element exists return -1.",
    examples: [
      { input: "nums = [0,1,2,3,4], queries = [[3,1],[1,3],[5,6]]", output: "[3,3,7]" },
      { input: "nums = [5,2,4,6,6,3], queries = [[12,4],[8,1],[6,3]]", output: "[15,-1,5]" },
    ],
    intuition: "Sort both nums and queries by their threshold. Use an offline approach: process queries in increasing m order, inserting nums into a trie as they become eligible (num <= m). Then query the trie greedily for maximum XOR.",
    approach: [
      "Sort nums ascending; sort queries with original indices by m ascending.",
      "Walk through sorted queries; insert all nums <= m into trie.",
      "Query trie for max XOR of x; store answer at original query index.",
    ],
    solution: `function maximizeXor(nums, queries) {
  nums.sort((a, b) => a - b);
  const sortedQ = queries.map((q, i) => [...q, i]).sort((a, b) => a[1] - b[1]);
  const result = new Array(queries.length);
  // Trie node: [child0, child1]
  const trie = [new Array(2).fill(-1)];
  let numIdx = 0;
  const insert = (n) => {
    let node = 0;
    for (let i = 31; i >= 0; i--) {
      const bit = (n >> i) & 1;
      if (trie[node][bit] === -1) { trie.push(new Array(2).fill(-1)); trie[node][bit] = trie.length - 1; }
      node = trie[node][bit];
    }
  };
  const query = (x) => {
    let node = 0, xorVal = 0;
    for (let i = 31; i >= 0; i--) {
      const bit = (x >> i) & 1;
      const want = 1 - bit;
      if (trie[node][want] !== -1) { xorVal |= (1 << i); node = trie[node][want]; }
      else if (trie[node][bit] !== -1) node = trie[node][bit];
      else return -1;
    }
    return xorVal;
  };
  for (const [x, m, idx] of sortedQ) {
    while (numIdx < nums.length && nums[numIdx] <= m) insert(nums[numIdx++]);
    result[idx] = numIdx === 0 ? -1 : query(x);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O((n + q) log max_val)", space: "O(n * 32)" },
    systemDesign: "Offline sorted-query + trie is the pattern behind range-constrained recommendation engines — finding the highest-affinity item (measured by XOR distance in a feature bitmask) that also satisfies a price constraint. Ride-sharing platforms use similar offline query processing to match drivers to passengers under distance and rating constraints.",
    pitfalls: ["Sorting queries offline and inserting nums incrementally avoids rebuilding the trie per query.", "Return -1 if the trie is empty for a given query (no nums <= m were found)."],
  },
  {
    id: "bit-manipulation-43",
    title: "Count the Number of Ideal Arrays",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "Dynamic Programming", "Math", "Combinatorics"],
    statement: "You are given two integers n and maxValue. An array of length n is ideal if every element is between 1 and maxValue, and each element is divisible by the previous. Return the number of distinct ideal arrays modulo 10^9 + 7.",
    examples: [
      { input: "n = 2, maxValue = 5", output: "10" },
      { input: "n = 5, maxValue = 3", output: "11" },
    ],
    intuition: "Count distinct non-decreasing divisibility chains of any length up to n, then use combinatorics (stars and bars) to place the chain's 'jumps' across n positions. Each chain of k distinct values can be spread across n positions in C(n-1, k-1) ways.",
    approach: [
      "Use DP to count chains ending at each value v with k distinct values.",
      "dp[v][k] = number of chains of length k ending at v.",
      "For each chain of length k, multiply by C(n-1, k-1) and add to result.",
    ],
    solution: `function idealArrays(n, maxValue) {
  const MOD = 1_000_000_007n;
  const MAXK = 14; // max chain length (2^14 > 10^4)
  // dp[v][k] = chains of exactly k distinct values ending at v
  const dp = Array.from({ length: maxValue + 1 }, () => new Array(MAXK + 1).fill(0n));
  for (let v = 1; v <= maxValue; v++) dp[v][1] = 1n;
  for (let k = 2; k <= MAXK; k++) {
    for (let v = 1; v <= maxValue; v++) {
      for (let d = 2 * v; d <= maxValue; d += v) {
        dp[d][k] = (dp[d][k] + dp[v][k - 1]) % MOD;
      }
    }
  }
  // Precompute binomial C(n-1, k-1) for k = 1..MAXK
  const C = Array.from({ length: n }, () => new Array(MAXK + 1).fill(0n));
  C[0][0] = 1n;
  for (let i = 1; i < n; i++) {
    C[i][0] = 1n;
    for (let j = 1; j <= Math.min(i, MAXK); j++) {
      C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD;
    }
  }
  let ans = 0n;
  for (let v = 1; v <= maxValue; v++) {
    for (let k = 1; k <= MAXK; k++) {
      if (dp[v][k] === 0n) continue;
      ans = (ans + dp[v][k] * C[n - 1][k - 1]) % MOD;
    }
  }
  return Number(ans);
}`,
    language: "javascript",
    complexity: { time: "O(maxValue * log(maxValue) * MAXK + n * MAXK)", space: "O(maxValue * MAXK + n * MAXK)" },
    systemDesign: "Counting divisibility chains models hierarchical categorisation trees in e-commerce taxonomies — products are nested under divisibility-linked attribute chains (e.g. sizes that are multiples of each other). Combinatorial spreading across n positions mirrors statistical sampling theory used in A/B test design for multi-arm experiments.",
    pitfalls: ["The maximum chain length is log2(maxValue) + 1 (at most 14 for maxValue = 10^4).", "Use BigInt throughout to avoid precision loss in JavaScript before taking the final Number."],
  },
  {
    id: "bit-manipulation-44",
    title: "Maximum Number of K-Divisible Components",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "Tree", "DFS", "Math"],
    statement: "Given a tree of n nodes each with a value, and an integer k, you can cut edges to split the tree into components. Return the maximum number of components such that each component's sum of values is divisible by k.",
    examples: [
      { input: "n = 5, edges = [[0,2],[1,2],[1,3],[2,4]], values = [1,8,1,4,4], k = 6", output: "2" },
      { input: "n = 7, edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]], values = [3,0,6,1,5,2,3], k = 3", output: "3" },
    ],
    intuition: "Do a DFS computing subtree sums modulo k. If a subtree's sum is divisible by k, cut it off — it forms a valid component. The remaining tree is also valid if its total sum is divisible by k.",
    approach: [
      "Build an adjacency list from edges.",
      "DFS from root: return subtree sum mod k.",
      "Whenever a child returns 0 (divisible), count it as a cut component.",
      "Return total count.",
    ],
    solution: `function maxKDivisibleComponents(n, edges, values, k) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  let components = 0;
  const dfs = (node, parent) => {
    let sum = values[node];
    for (const next of adj[node]) {
      if (next === parent) continue;
      sum += dfs(next, node);
    }
    sum %= k;
    if (sum === 0) components++;
    return sum;
  };
  dfs(0, -1);
  return components;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Subtree-sum divisibility checks model microservice decomposition where you want to split a service dependency tree into independent deployable units whose combined request rate is a multiple of the cluster's replication factor. Database sharding similarly partitions a table's foreign-key tree so each shard holds a number of rows divisible by the replication factor.",
    pitfalls: ["Modulo arithmetic means you can accumulate sums mod k at each node without overflow.", "Cutting when sum mod k === 0 at a subtree root is always optimal — never beneficial to leave a divisible subtree attached."],
  },
  {
    id: "bit-manipulation-45",
    title: "UTF-8 Validation",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "Array"],
    statement: "Given an integer array data representing bytes, return whether it is a valid UTF-8 encoding. UTF-8 uses 1-4 bytes per character; leading bytes start with 0 (1-byte), 110 (2-byte), 1110 (3-byte), or 11110 (4-byte); continuation bytes start with 10.",
    examples: [
      { input: "data = [197,130,1]", output: "true", explanation: "197 = 11000101 (2-byte lead), 130 = 10000010 (continuation), 1 = 00000001 (1-byte)." },
      { input: "data = [235,140,4]", output: "false" },
    ],
    intuition: "Check each byte with bit masks: 0xxxxxxx is a single-byte character; 10xxxxxx is a continuation byte. Count how many continuations a leader promises and verify they follow.",
    approach: [
      "Walk through data; for each byte check its top bits with masks (0x80, 0xE0, 0xF0, 0xF8).",
      "Determine number of continuation bytes expected (0, 1, 2, or 3).",
      "Consume that many continuation bytes, each must match mask 10xxxxxx (byte & 0xC0 === 0x80).",
      "Return false on any mismatch, true if all bytes consumed correctly.",
    ],
    solution: `function validUtf8(data) {
  let i = 0;
  while (i < data.length) {
    const byte = data[i];
    let numBytes;
    if ((byte & 0x80) === 0) numBytes = 1;
    else if ((byte & 0xE0) === 0xC0) numBytes = 2;
    else if ((byte & 0xF0) === 0xE0) numBytes = 3;
    else if ((byte & 0xF8) === 0xF0) numBytes = 4;
    else return false;
    for (let j = 1; j < numBytes; j++) {
      if (i + j >= data.length || (data[i + j] & 0xC0) !== 0x80) return false;
    }
    i += numBytes;
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "UTF-8 validation is critical in API gateways and database ingestion pipelines that receive user-generated text — invalid multi-byte sequences must be rejected before storage to prevent encoding-based injection attacks. Content-delivery networks also validate UTF-8 at the edge to avoid serving malformed responses that crash clients.",
    pitfalls: ["Only the 8 least-significant bits of each data integer matter — high bits should be masked or ignored.", "A leading byte without the correct number of following continuation bytes must return false."],
  },
  {
    id: "bit-manipulation-46",
    title: "Number of Wonderful Substrings",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "String", "Hashing"],
    statement: "A wonderful string has at most one letter with an odd frequency. Given a string word containing only the first 10 lowercase letters, return the number of wonderful non-empty substrings.",
    examples: [
      { input: "word = \"aba\"", output: "4" },
      { input: "word = \"aabb\"", output: "9" },
      { input: "word = \"he\"", output: "2" },
    ],
    intuition: "Track a bitmask of which letters have odd frequency using prefix XOR. A substring is wonderful if its XOR is 0 (all even) or has exactly one set bit (one odd). Count previously seen XOR states matching these two conditions.",
    approach: [
      "Maintain a frequency map of prefix XOR masks.",
      "For each character, update the running XOR mask.",
      "Count: freq[mask] (all even) + sum of freq[mask ^ (1 << bit)] for bit in 0..9 (one odd).",
      "Increment freq[mask].",
    ],
    solution: `function wonderfulSubstrings(word) {
  const freq = new Map([[0, 1]]);
  let mask = 0, ans = 0;
  for (const c of word) {
    mask ^= 1 << (c.charCodeAt(0) - 97);
    ans += freq.get(mask) || 0;
    for (let bit = 0; bit < 10; bit++) {
      ans += freq.get(mask ^ (1 << bit)) || 0;
    }
    freq.set(mask, (freq.get(mask) || 0) + 1);
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(10n) = O(n)", space: "O(2^10) = O(1)" },
    systemDesign: "Prefix-XOR frequency hashing for parity checks models anomaly detection in financial audit logs — a bitmask of which transaction categories have appeared an odd number of times flags unbalanced ledger windows. The same technique powers approximate-frequency sketches in streaming databases that track which features appear with odd multiplicity.",
    pitfalls: ["The mask space is 2^10 = 1024, so the freq map is bounded in size.", "Count the exact prefix match (all-even) AND each single-bit-flip (one-odd) variant before updating the freq map."],
  },
  {
    id: "bit-manipulation-47",
    title: "Maximize Score After N Operations (Bitmask DP)",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "Dynamic Programming", "Bitmask DP", "Math"],
    statement: "You have a 2D array nums of size 2n. In n operations (1-indexed), choose two unused numbers from nums and score k * gcd(nums[i], nums[j]) for the k-th operation. Maximize your total score.",
    examples: [
      { input: "nums = [1,2]", output: "1" },
      { input: "nums = [3,4,6,8]", output: "11" },
      { input: "nums = [1,2,3,4,5,6]", output: "14" },
    ],
    intuition: "Use bitmask DP where the mask represents which elements have been used. The operation number k equals popcount(mask) / 2 + 1. For each mask, try all pairs of unused elements.",
    approach: [
      "Precompute gcd for all pairs.",
      "dp[mask] = maximum score using the elements indicated by mask.",
      "For each mask, count bits to determine k, then try all pairs of 0-bits.",
    ],
    solution: `function maxScore(nums) {
  const n = nums.length;
  const full = 1 << n;
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const dp = new Array(full).fill(0);
  for (let mask = 0; mask < full; mask++) {
    let bits = 0, tmp = mask;
    while (tmp) { bits += tmp & 1; tmp >>= 1; }
    if (bits % 2 !== 0) continue;
    const k = bits / 2 + 1;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue;
      for (let j = i + 1; j < n; j++) {
        if (mask & (1 << j)) continue;
        const next = mask | (1 << i) | (1 << j);
        dp[next] = Math.max(dp[next], dp[mask] + k * gcd(nums[i], nums[j]));
      }
    }
  }
  return dp[full - 1];
}`,
    language: "javascript",
    complexity: { time: "O(n^2 * 2^n)", space: "O(2^n)" },
    systemDesign: "Score-maximising pairing with bitmask DP is the formal foundation of the assignment problem in operations research, used in workforce scheduling (matching workers to shifts to maximise productivity scores) and in cloud job scheduling (pairing compute tasks with GPU instances to maximise throughput per operation).",
    pitfalls: ["Only process masks with even popcount — odd popcount means an incomplete operation was attempted.", "Precomputing all gcd(i, j) pairs avoids recomputation inside the DP loop."],
  },
  {
    id: "bit-manipulation-48",
    title: "Maximum Employees to Be Invited to a Meeting (Bitmask/Graph)",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "Graph", "DFS", "Topological Sort"],
    statement: "A company wants to invite n employees to a round table. Each employee i must sit next to their favourite person favourite[i]. Return the maximum number of employees that can be invited.",
    examples: [
      { input: "favorite = [2,2,1,2]", output: "3" },
      { input: "favorite = [1,2,0]", output: "3" },
      { input: "favorite = [3,0,1,4,1]", output: "4" },
    ],
    intuition: "Model as a functional graph (each node has out-degree 1). Long cycles occupy the table alone; mutual pairs (cycles of length 2) can be extended with chains. The answer is max(longest cycle, sum of extended mutual pairs).",
    approach: [
      "Find all cycles using visited/on-stack DFS.",
      "For cycles longer than 2, track the maximum cycle length.",
      "For cycles of length 2 (mutual pairs), compute the longest incoming chain for each node via BFS/DFS on the reversed graph.",
      "Return max(maxCycle, sum of all mutual-pair chain extensions).",
    ],
    solution: `function maximumInvitations(favorite) {
  const n = favorite.length;
  const inDeg = new Array(n).fill(0);
  for (const f of favorite) inDeg[f]++;
  // Topological sort to find chain lengths
  const queue = [], chainLen = new Array(n).fill(1);
  for (let i = 0; i < n; i++) if (inDeg[i] === 0) queue.push(i);
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    const next = favorite[node];
    chainLen[next] = Math.max(chainLen[next], chainLen[node] + 1);
    if (--inDeg[next] === 0) queue.push(next);
  }
  let maxCycle = 0, mutualSum = 0;
  const visited = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    if (visited[i] || inDeg[i] !== 0) continue;
    // Find cycle
    let len = 0, node = i;
    while (!visited[node]) { visited[node] = true; node = favorite[node]; len++; }
    if (len === 2) {
      mutualSum += chainLen[i] + chainLen[favorite[i]];
    } else {
      maxCycle = Math.max(maxCycle, len);
    }
  }
  return Math.max(maxCycle, mutualSum);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Functional graph cycle analysis models circular dependencies in microservice architectures — detecting services that mutually depend on each other (cycles of length 2) vs. longer circular chains. Container orchestration platforms (Kubernetes) run this exact cycle detection to identify and break circular service dependencies before deployment.",
    pitfalls: ["Chain lengths are computed via topological sort before processing cycles.", "For mutual pairs (cycle-2), the chain extension includes both nodes' incoming chains summed together."],
  },
  {
    id: "bit-manipulation-49",
    title: "Strange Printer II",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "Topological Sort", "Bitmask", "Matrix"],
    statement: "There is a strange printer that can print a rectangle of the same color in each operation. Given a target grid, return true if the printer can print the grid, or false otherwise.",
    examples: [
      { input: "targetGrid = [[1,1,1,1],[1,2,2,1],[1,2,2,1],[1,1,1,1]]", output: "true" },
      { input: "targetGrid = [[1,1,1],[3,1,3]]", output: "false" },
    ],
    intuition: "A color can only be printed before another color if they overlap and the second color covers part of the first. Build a dependency graph (color A must come before color B if B overlaps A's bounding box). The grid is printable iff this dependency graph has no cycles.",
    approach: [
      "For each color, compute its bounding box.",
      "For each color pair (A, B), if B's bounding box contains a cell of color A, then B must be printed before A (A depends on B).",
      "Check for a topological order (no cycles) in the dependency graph.",
    ],
    solution: `function isPrintable(targetGrid) {
  const m = targetGrid.length, n = targetGrid[0].length;
  const maxColor = 60;
  const top = new Array(maxColor + 1).fill(m);
  const bot = new Array(maxColor + 1).fill(-1);
  const left = new Array(maxColor + 1).fill(n);
  const right = new Array(maxColor + 1).fill(-1);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const c = targetGrid[i][j];
      top[c] = Math.min(top[c], i); bot[c] = Math.max(bot[c], i);
      left[c] = Math.min(left[c], j); right[c] = Math.max(right[c], j);
    }
  }
  // Build dependency graph: if cell of color other than c is inside c's bbox, c depends on that color
  const deps = Array.from({ length: maxColor + 1 }, () => new Set());
  for (let c = 1; c <= maxColor; c++) {
    if (bot[c] === -1) continue;
    for (let i = top[c]; i <= bot[c]; i++) {
      for (let j = left[c]; j <= right[c]; j++) {
        if (targetGrid[i][j] !== c) deps[c].add(targetGrid[i][j]);
      }
    }
  }
  // Topological sort (Kahn's) to detect cycle
  const inDeg = new Array(maxColor + 1).fill(0);
  for (let c = 1; c <= maxColor; c++) for (const d of deps[c]) inDeg[d]++;
  const queue = [];
  for (let c = 1; c <= maxColor; c++) if (bot[c] !== -1 && inDeg[c] === 0) queue.push(c);
  let processed = 0;
  let head = 0;
  while (head < queue.length) {
    const c = queue[head++]; processed++;
    for (let other = 1; other <= maxColor; other++) {
      if (deps[other].has(c)) { if (--inDeg[other] === 0) queue.push(other); }
    }
  }
  const colorCount = new Set(targetGrid.flat()).size;
  return processed === colorCount;
}`,
    language: "javascript",
    complexity: { time: "O(m * n * maxColor)", space: "O(maxColor^2)" },
    systemDesign: "Layer-ordering with dependency cycles maps to paint-order validation in SVG/HTML rendering engines, which must topologically sort drawing layers to determine z-index rendering order. Cycle detection in layer dependencies also underlies GPU render-pass scheduling in graphics pipelines (Vulkan/DirectX 12) where render passes cannot form cycles.",
    pitfalls: ["The dependency is that if any cell inside color C's bounding box is a different color D, then C must be printed over D — so D is printed first.", "Cycle detection via Kahn's algorithm counts processed nodes against the total distinct colors."],
  },
  {
    id: "bit-manipulation-50",
    title: "Number of Ways to Wear Different Hats to Each Other (Bitmask DP)",
    difficulty: "Hard",
    tags: ["Bit Manipulation", "Dynamic Programming", "Bitmask DP"],
    statement: "There are n people (n <= 10) and 40 types of hats. Each person has a list of hats they prefer. Count the number of ways to assign hats so that each person wears a different hat, modulo 10^9 + 7.",
    examples: [
      { input: "hats = [[3,4],[4,5],[5]]", output: "1" },
      { input: "hats = [[3,5,1],[3,5]]", output: "4" },
    ],
    intuition: "Use bitmask DP over people (n <= 10, so 2^10 = 1024 states). For each hat (1..40), try assigning it to each person who likes it; track which people have already received a hat with the bitmask.",
    approach: [
      "Build hat-to-people preference list.",
      "dp[mask] = number of ways to assign hats to the people indicated by mask.",
      "Iterate over each hat; for each (mask, person) where person likes this hat and is not yet in mask, update dp[mask | (1 << person)].",
      "Return dp[(1 << n) - 1].",
    ],
    solution: `function numberWays(hats) {
  const MOD = 1_000_000_007n;
  const n = hats.length;
  const fullMask = (1 << n) - 1;
  // Map hat to list of people who like it
  const hatToPeople = Array.from({ length: 41 }, () => []);
  for (let p = 0; p < n; p++) for (const h of hats[p]) hatToPeople[h].push(p);
  const dp = new Array(fullMask + 1).fill(0n);
  dp[0] = 1n;
  for (let hat = 1; hat <= 40; hat++) {
    // Iterate masks in reverse to avoid using the same hat twice
    for (let mask = fullMask; mask >= 0; mask--) {
      if (dp[mask] === 0n) continue;
      for (const person of hatToPeople[hat]) {
        if (!(mask & (1 << person))) {
          dp[mask | (1 << person)] = (dp[mask | (1 << person)] + dp[mask]) % MOD;
        }
      }
    }
  }
  return Number(dp[fullMask]);
}`,
    language: "javascript",
    complexity: { time: "O(40 * 2^n * n)", space: "O(2^n)" },
    systemDesign: "Hat-to-person assignment with bitmask DP is isomorphic to job scheduling in distributed systems — assigning tasks (hats) to workers (people) where each worker has a preference list and each task can be assigned to at most one worker. Kubernetes job-controller uses similar combinatorial matching for pod-to-node assignment under resource affinity constraints.",
    pitfalls: ["Iterate over hats as the outer loop (not people) and update masks in reverse to correctly model 'each hat used at most once'.", "Use BigInt for dp values to avoid precision loss before the final modulo."],
  },
];
