import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  // ---- EASY (17 problems) ----
  {
    id: "strings-01",
    title: "Valid Palindrome",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
    statement: "Given a string s, return true if it is a palindrome after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, otherwise return false.",
    examples: [
      { input: "s = \"A man, a plan, a canal: Panama\"", output: "true", explanation: "After cleaning: \"amanaplanacanalpanama\" which reads the same forwards and backwards." },
      { input: "s = \"race a car\"", output: "false" },
      { input: "s = \" \"", output: "true", explanation: "Empty string after cleaning is a palindrome." },
    ],
    intuition: "Clean the string to only letters and digits, then use two pointers from both ends moving inward — if they ever disagree the string is not a palindrome. Think of reading a word in a mirror.",
    approach: [
      "Clean s: filter to alphanumeric characters and lowercase them.",
      "Set left = 0, right = cleaned.length - 1.",
      "While left < right: if cleaned[left] !== cleaned[right], return false.",
      "Advance left and right inward.",
      "Return true.",
    ],
    solution: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let l = 0, r = clean.length - 1;
  while (l < r) {
    if (clean[l] !== clean[r]) return false;
    l++; r--;
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Palindrome checks underlie DNA sequence analysis tools that look for reverse-complement palindromes (restriction enzyme sites). In search engines, normalising query strings before comparison (removing punctuation, lowercasing) is exactly the cleaning step here, done at indexing time to reduce storage and match user intent.",
    pitfalls: ["Do not forget to handle empty strings — they are valid palindromes.", "Comparing against the full original string without cleaning first is a common mistake."],
  },
  {
    id: "strings-02",
    title: "Valid Anagram",
    difficulty: "Easy",
    tags: ["String", "Hashing"],
    statement: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram uses the exact same characters with the same frequencies.",
    examples: [
      { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
      { input: "s = \"rat\", t = \"car\"", output: "false" },
    ],
    intuition: "Count how many times each letter appears in the first word, then subtract for the second word — if all counts balance to zero they are anagrams, like making sure you used every tile in a word game.",
    approach: [
      "Return false immediately if lengths differ.",
      "Build a frequency map incrementing for s and decrementing for t.",
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
    systemDesign: "Frequency maps power inverted indexes in search engines where each term maps to its document list. Anagram grouping is also used in query-suggestion systems to canonicalise user queries — two differently spelled but letter-equivalent queries map to the same result set, reducing redundant index lookups.",
    pitfalls: ["Different lengths can never be anagrams — check first for an early exit.", "For Unicode strings, use a Map instead of a plain object to avoid prototype key collisions."],
  },
  {
    id: "strings-03",
    title: "Reverse String",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
    statement: "Write a function that reverses a string. The input is given as an array of characters s. You must do it in-place with O(1) extra memory.",
    examples: [
      { input: "s = ['h','e','l','l','o']", output: "['o','l','l','e','h']" },
      { input: "s = ['H','a','n','n','a','h']", output: "['h','a','n','n','a','H']" },
    ],
    intuition: "Swap the first character with the last, the second with the second-to-last, and keep going until the two pointers meet in the middle — like flipping a pancake stack.",
    approach: [
      "Set left = 0, right = s.length - 1.",
      "While left < right: swap s[left] and s[right], advance both pointers.",
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
    systemDesign: "In-place reversal appears in network protocol parsers that need to reverse byte order for endianness conversion, and in database B-tree leaf page compaction where key sequences are reversed to reclaim space. Buffer reversal is also a primitive in stream-processing libraries when reversing event queues.",
    pitfalls: ["Strings in JavaScript are immutable — the problem provides a char array specifically for in-place mutation.", "Odd-length arrays are fine — the middle element never needs to move."],
  },
  {
    id: "strings-04",
    title: "Reverse Words in a String",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
    statement: "Given an input string s, reverse the order of the words. A word is defined as a sequence of non-space characters. The returned string should not have leading or trailing spaces, and words are separated by a single space.",
    examples: [
      { input: "s = \"the sky is blue\"", output: "\"blue is sky the\"" },
      { input: "s = \"  hello world  \"", output: "\"world hello\"" },
      { input: "s = \"a good   example\"", output: "\"example good a\"" },
    ],
    intuition: "Split the sentence into words, throw away empty tokens caused by extra spaces, then glue the words back together in reverse order — like reading a book's chapter titles backwards.",
    approach: [
      "Split s by spaces, filter out empty strings.",
      "Reverse the resulting array.",
      "Join with a single space.",
    ],
    solution: `function reverseWords(s) {
  return s.trim().split(/\s+/).reverse().join(" ");
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Tokenising and reversing word sequences is a building block in NLP pipelines for building n-gram language models and in search engines for reverse-index construction. Log parsers in SIEM systems split and reorder token sequences to reconstruct causal event chains, which mirrors reversing the word order.",
    pitfalls: ["Using a single-space split misses multiple consecutive spaces — use a regex \\s+ or trim first.", "The in-place O(1) space version requires reversing the whole string then reversing each word individually."],
  },
  {
    id: "strings-05",
    title: "Longest Common Prefix",
    difficulty: "Easy",
    tags: ["String"],
    statement: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
    examples: [
      { input: "strs = [\"flower\",\"flow\",\"flight\"]", output: "\"fl\"" },
      { input: "strs = [\"dog\",\"racecar\",\"car\"]", output: "\"\"" },
    ],
    intuition: "Take the first string as your candidate prefix. For each other string, shrink the candidate from the right until it matches the beginning of that string — like finding the shared part of multiple file paths.",
    approach: [
      "Start with prefix = strs[0].",
      "For each string in strs: while string does not start with prefix, remove the last character from prefix.",
      "If prefix becomes empty, return \"\".",
      "Return prefix.",
    ],
    solution: `function longestCommonPrefix(strs) {
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}`,
    language: "javascript",
    complexity: { time: "O(S)", space: "O(1)" },
    systemDesign: "Longest common prefix is the backbone of trie (prefix tree) data structures used in autocomplete systems, DNS lookup tables, and IP routing tables. Database prefix indexes (like MySQL's partial column indexes) use the same idea to compress repeated prefixes in storage, reducing index size dramatically.",
    pitfalls: ["An empty input array should return \"\" — check length first.", "Vertical scanning (comparing character by character across all strings) is an alternative O(S) approach."],
  },
  {
    id: "strings-06",
    title: "Find the Index of the First Occurrence (strStr)",
    difficulty: "Easy",
    tags: ["String", "Two Pointers", "String Matching"],
    statement: "Given two strings haystack and needle, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.",
    examples: [
      { input: "haystack = \"sadbutsad\", needle = \"sad\"", output: "0" },
      { input: "haystack = \"leetcode\", needle = \"leeto\"", output: "-1" },
    ],
    intuition: "Slide a window of the same length as needle across haystack, and at each position check if the substring matches — like scanning a long text for a specific word.",
    approach: [
      "If needle is longer than haystack, return -1.",
      "Loop i from 0 to haystack.length - needle.length.",
      "If haystack.slice(i, i + needle.length) === needle, return i.",
      "Return -1.",
    ],
    solution: `function strStr(haystack, needle) {
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    if (haystack.slice(i, i + needle.length) === needle) return i;
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(n*m)", space: "O(1)" },
    systemDesign: "Substring search is the foundation of full-text search engines. Production systems use KMP (O(n+m)) or Boyer-Moore-Horspool for single-pattern search and Aho-Corasick for multi-pattern search in log parsers and intrusion detection systems. Databases implement LIKE queries with similar sliding-window substring matching.",
    pitfalls: ["The upper loop bound is haystack.length - needle.length, not haystack.length — prevents out-of-bounds slicing.", "An empty needle conventionally returns 0."],
  },
  {
    id: "strings-07",
    title: "Roman to Integer",
    difficulty: "Easy",
    tags: ["String", "Hashing", "Math"],
    statement: "Given a Roman numeral string s, convert it to an integer. Roman numerals use: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. If a smaller value precedes a larger one (e.g. IV=4), subtract it.",
    examples: [
      { input: "s = \"III\"", output: "3" },
      { input: "s = \"LVIII\"", output: "58" },
      { input: "s = \"MCMXCIV\"", output: "1994" },
    ],
    intuition: "Walk right to left through the Roman numeral. If the current symbol is smaller than the one to its right, subtract it; otherwise add it — this handles all the subtraction rules automatically.",
    approach: [
      "Build a map of Roman symbols to values.",
      "Walk from right to left.",
      "If value of current char < value of char to its right, subtract; else add.",
      "Return total.",
    ],
    solution: `function romanToInt(s) {
  const val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = val[s[i]], next = val[s[i + 1]];
    result += cur < next ? -cur : cur;
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Lookup-table driven parsing is used in protocol decoders (parsing fixed-symbol headers like HTTP/1.1 status codes) and in config-file parsers where a small fixed vocabulary of tokens maps to integer codes. Symbol-to-value maps are also the basis of tokeniser lookup tables in compiler front-ends.",
    pitfalls: ["Reading left-to-right and checking the next character also works: if current < next, subtract current; this requires a bounds check.", "A character not in the map means invalid input — handle defensively in production."],
  },
  {
    id: "strings-08",
    title: "Length of Last Word",
    difficulty: "Easy",
    tags: ["String"],
    statement: "Given a string s consisting of words and spaces, return the length of the last word. A word is a maximal substring consisting of non-space characters.",
    examples: [
      { input: "s = \"Hello World\"", output: "5" },
      { input: "s = \"   fly me   to   the moon  \"", output: "4" },
      { input: "s = \"luffy is still joyboy\"", output: "6" },
    ],
    intuition: "Skip trailing spaces from the end, then count backwards until you hit another space or the beginning — the count is the length of the last word.",
    approach: [
      "Start i = s.length - 1.",
      "Skip trailing spaces while s[i] === ' '.",
      "Count characters while s[i] !== ' ' and i >= 0.",
      "Return count.",
    ],
    solution: `function lengthOfLastWord(s) {
  let i = s.length - 1;
  while (i >= 0 && s[i] === " ") i--;
  let len = 0;
  while (i >= 0 && s[i] !== " ") { len++; i--; }
  return len;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Scanning from the end of a string to extract the last token is used in log-line parsers that extract severity levels or timestamps from the tail of structured log entries, and in file-path parsers that extract file extensions or basenames. CLI argument parsers similarly tokenise from the right to pick the last positional argument.",
    pitfalls: ["Strings with trailing spaces must skip those spaces before counting.", "A string of only spaces returns 0 — the while loop exits without incrementing len."],
  },
  {
    id: "strings-09",
    title: "Isomorphic Strings",
    difficulty: "Easy",
    tags: ["String", "Hashing"],
    statement: "Given two strings s and t, determine if they are isomorphic. Two strings are isomorphic if the characters in s can be replaced to get t. Each character must map to exactly one character, and no two characters may map to the same character.",
    examples: [
      { input: "s = \"egg\", t = \"add\"", output: "true" },
      { input: "s = \"foo\", t = \"bar\"", output: "false" },
      { input: "s = \"paper\", t = \"title\"", output: "true" },
    ],
    intuition: "Build two maps: one from s-characters to t-characters and one from t-characters to s-characters. If at any point a character tries to map to a different partner than it already has, the strings are not isomorphic.",
    approach: [
      "Create maps sToT and tToS.",
      "For each index i: check if s[i] is already mapped to a different t[i] character or vice versa.",
      "If conflict found, return false. Otherwise record both mappings.",
      "Return true.",
    ],
    solution: `function isIsomorphic(s, t) {
  const sToT = {}, tToS = {};
  for (let i = 0; i < s.length; i++) {
    const sc = s[i], tc = t[i];
    if (sToT[sc] && sToT[sc] !== tc) return false;
    if (tToS[tc] && tToS[tc] !== sc) return false;
    sToT[sc] = tc;
    tToS[tc] = sc;
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Bijective character mapping is the basis of simple substitution ciphers and encoding schemes like Base64 where each input symbol maps uniquely to an output symbol. In database schema migration, column-type mapping tables use the same bijection principle: each source type maps to exactly one target type with no collisions.",
    pitfalls: ["You need two maps (both directions) — a single map catches s->t conflicts but not t->s conflicts (e.g. 'ab' and 'aa').", "Characters map to themselves is valid — the identity mapping is isomorphic."],
  },
  {
    id: "strings-10",
    title: "Ransom Note",
    difficulty: "Easy",
    tags: ["String", "Hashing"],
    statement: "Given two strings ransomNote and magazine, return true if ransomNote can be constructed using the letters from magazine. Each letter in magazine can only be used once.",
    examples: [
      { input: "ransomNote = \"a\", magazine = \"b\"", output: "false" },
      { input: "ransomNote = \"aa\", magazine = \"ab\"", output: "false" },
      { input: "ransomNote = \"aa\", magazine = \"aab\"", output: "true" },
    ],
    intuition: "Count available letters from the magazine, then for each letter needed in the ransom note, subtract one from the count — if any count goes negative you do not have enough letters.",
    approach: [
      "Build a frequency map from magazine.",
      "For each character in ransomNote: decrement count. If count goes below 0, return false.",
      "Return true.",
    ],
    solution: `function canConstruct(ransomNote, magazine) {
  const count = {};
  for (const c of magazine) count[c] = (count[c] || 0) + 1;
  for (const c of ransomNote) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(m+n)", space: "O(1)" },
    systemDesign: "Resource availability checks (do we have enough of each item?) appear in inventory management systems and cloud resource allocation where a request is only fulfilled when every required resource quantity is available. Kubernetes pod scheduling uses a similar multiset-subtraction check against node resource capacities.",
    pitfalls: ["Check count[c] before decrementing — undefined or 0 both mean the character is unavailable.", "Build the map from magazine (the supply), not from the note (the demand)."],
  },
  {
    id: "strings-11",
    title: "First Unique Character in a String",
    difficulty: "Easy",
    tags: ["String", "Hashing"],
    statement: "Given a string s, find the first non-repeating character and return its index. If it does not exist, return -1.",
    examples: [
      { input: "s = \"leetcode\"", output: "0" },
      { input: "s = \"loveleetcode\"", output: "2" },
      { input: "s = \"aabb\"", output: "-1" },
    ],
    intuition: "Count how many times each character appears, then do a second pass to find the first character whose count is exactly one — like scanning a crowd for the only person wearing a red hat.",
    approach: [
      "Build a frequency map for s.",
      "Iterate s from left to right.",
      "Return the first index where count === 1.",
      "Return -1 if none found.",
    ],
    solution: `function firstUniqChar(s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (count[s[i]] === 1) return i;
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "First-unique-element queries appear in stream-processing systems that track whether a session ID or transaction ID has been seen exactly once (deduplication with singleton detection). In distributed caches, LFU (Least Frequently Used) eviction policies maintain frequency counts identical to this map to identify the least-used cache entry.",
    pitfalls: ["Two passes over the string are required — one to count, one to find the first unique.", "The string contains only lowercase English letters so the map has at most 26 entries."],
  },
  {
    id: "strings-12",
    title: "Add Strings",
    difficulty: "Easy",
    tags: ["String", "Math", "Simulation"],
    statement: "Given two non-negative integers num1 and num2 represented as strings, return the sum of num1 and num2 as a string. You must not convert the inputs to integers directly.",
    examples: [
      { input: "num1 = \"11\", num2 = \"123\"", output: "\"134\"" },
      { input: "num1 = \"456\", num2 = \"77\"", output: "\"533\"" },
      { input: "num1 = \"0\", num2 = \"0\"", output: "\"0\"" },
    ],
    intuition: "Simulate the grade-school addition algorithm: add digits from right to left, keeping a carry just like you would on paper.",
    approach: [
      "Set pointers i = num1.length-1, j = num2.length-1, carry = 0.",
      "While i >= 0 or j >= 0 or carry > 0: sum = digit from num1 (or 0) + digit from num2 (or 0) + carry.",
      "Prepend sum % 10 to result, carry = Math.floor(sum / 10).",
      "Return result string.",
    ],
    solution: `function addStrings(num1, num2) {
  let i = num1.length - 1, j = num2.length - 1, carry = 0;
  const res = [];
  while (i >= 0 || j >= 0 || carry) {
    const a = i >= 0 ? num1.charCodeAt(i--) - 48 : 0;
    const b = j >= 0 ? num2.charCodeAt(j--) - 48 : 0;
    const s = a + b + carry;
    res.push(s % 10);
    carry = Math.floor(s / 10);
  }
  return res.reverse().join("");
}`,
    language: "javascript",
    complexity: { time: "O(max(m,n))", space: "O(max(m,n))" },
    systemDesign: "Arbitrary-precision arithmetic on string-encoded numbers is used in financial ledger systems that must avoid floating-point rounding errors, and in BigDecimal implementations in Java and Python. Distributed counter services aggregate partial sums as strings to avoid integer overflow during cross-shard accumulation.",
    pitfalls: ["Use charCodeAt minus 48 to get the numeric digit value without parseInt.", "Do not forget the final carry — a carry after the loop means the result has one more digit."],
  },
  {
    id: "strings-13",
    title: "Reverse Vowels of a String",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
    statement: "Given a string s, reverse only all the vowels in the string and return it.",
    examples: [
      { input: "s = \"hello\"", output: "\"holle\"" },
      { input: "s = \"leetcode\"", output: "\"leotcede\"" },
    ],
    intuition: "Use two pointers moving inward, but only swap when both pointers point at vowels — skipping consonants on both sides until you find a vowel pair.",
    approach: [
      "Convert string to array. Define a vowel set.",
      "Set left = 0, right = s.length - 1.",
      "Advance left until a vowel, retreat right until a vowel.",
      "Swap them, move both pointers inward.",
      "Return joined array.",
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
    systemDesign: "Selective in-place transformation (touch only elements matching a predicate) is used in vectorised database update operations — a column store updates only flagged rows without rewriting the entire column. GPU compute shaders apply the same selective-swap pattern when conditionally transforming pixel values in a framebuffer.",
    pitfalls: ["Include both uppercase and lowercase vowels in the set.", "The inner while loops must check l < r to avoid the pointers crossing."],
  },
  {
    id: "strings-14",
    title: "Detect Capital",
    difficulty: "Easy",
    tags: ["String"],
    statement: "We define the usage of capitals in a word to be right when all letters are capitals, all letters are lowercase, or only the first letter is capital. Given a string word, return true if the usage of capitals is correct.",
    examples: [
      { input: "word = \"USA\"", output: "true" },
      { input: "word = \"FlaG\"", output: "false" },
      { input: "word = \"leetcode\"", output: "true" },
    ],
    intuition: "The three valid patterns are: all uppercase, all lowercase, or first letter uppercase and the rest lowercase — just check which case the first letter sets and verify the rest conform.",
    approach: [
      "If all characters are uppercase or all are lowercase, return true.",
      "If the first character is uppercase and all remaining are lowercase, return true.",
      "Otherwise return false.",
    ],
    solution: `function detectCapitalUse(word) {
  return (
    word === word.toUpperCase() ||
    word === word.toLowerCase() ||
    (word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase())
  );
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Case normalisation is a critical step in text preprocessing pipelines for NLP models, search engines, and database COLLATION rules. Proper-noun detection (first letter capitalised, rest lowercase) is used in named-entity recognition (NER) systems that identify names, places, and organisations in text.",
    pitfalls: ["Single-character words pass all three conditions — handle correctly (toUpperCase and toLowerCase are the same character).", "Using regex (^[A-Z]+$|^[a-z]+$|^[A-Z][a-z]*$) is an equally valid approach."],
  },
  {
    id: "strings-15",
    title: "Repeated Substring Pattern",
    difficulty: "Easy",
    tags: ["String", "String Matching"],
    statement: "Given a string s, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.",
    examples: [
      { input: "s = \"abab\"", output: "true", explanation: "\"ab\" repeated twice." },
      { input: "s = \"aba\"", output: "false" },
      { input: "s = \"abcabcabcabc\"", output: "true", explanation: "\"abc\" repeated four times." },
    ],
    intuition: "If you double the string and remove the first and last characters, the original string will appear inside the result if and only if it has a repeated pattern — this is a clever rotation trick.",
    approach: [
      "Create doubled = s + s.",
      "Remove the first and last characters: middle = doubled.slice(1, -1).",
      "Return whether middle contains s.",
    ],
    solution: `function repeatedSubstringPattern(s) {
  const doubled = (s + s).slice(1, -1);
  return doubled.includes(s);
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n)" },
    systemDesign: "Detecting periodic patterns in strings is fundamental to compression algorithms like LZ77/LZ78 and run-length encoding used in data storage. Database index compression detects repeated key prefixes to merge common prefixes in B-tree pages, reducing storage and improving cache performance.",
    pitfalls: ["The slice(1, -1) removes exactly one character from each end — this is essential for the trick to work.", "An O(n) solution using KMP failure function exists and is preferred for production use."],
  },
  {
    id: "strings-16",
    title: "Count and Say",
    difficulty: "Easy",
    tags: ["String", "Simulation"],
    statement: "The count-and-say sequence starts with '1'. Each subsequent term is produced by reading the previous term: count consecutive equal digits and say count + digit. Return the nth term.",
    examples: [
      { input: "n = 1", output: "\"1\"" },
      { input: "n = 4", output: "\"1211\"", explanation: "1 -> 11 -> 21 -> 1211" },
    ],
    intuition: "Build each term from the previous one by scanning for runs of equal characters and appending their count followed by the character — like a child describing what they see: 'one one, two ones...'.",
    approach: [
      "Start with result = '1'.",
      "Repeat n-1 times: scan result for consecutive runs.",
      "For each run, append count + character to next string.",
      "Set result = next.",
    ],
    solution: `function countAndSay(n) {
  let res = "1";
  for (let i = 1; i < n; i++) {
    let next = "", j = 0;
    while (j < res.length) {
      let k = j;
      while (k < res.length && res[k] === res[j]) k++;
      next += (k - j) + res[j];
      j = k;
    }
    res = next;
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(2^n)", space: "O(2^n)" },
    systemDesign: "Run-length encoding (RLE) is the production version of 'count and say': it compresses repeated values in bitmap indexes, image formats (BMP, PCX), and columnar storage engines where columns often contain long runs of the same value. RLE dramatically reduces storage for low-cardinality columns in analytics databases.",
    pitfalls: ["Scan for runs, not individual characters — use an inner while loop to consume the full run before recording.", "The length of the sequence grows roughly exponentially, so large n values are expensive."],
  },
  {
    id: "strings-17",
    title: "Compare Version Numbers",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
    statement: "Given two version strings version1 and version2, compare them. Return -1 if version1 < version2, 1 if version1 > version2, and 0 otherwise. Version strings are dot-separated integers.",
    examples: [
      { input: "version1 = \"1.2\", version2 = \"1.10\"", output: "-1" },
      { input: "version1 = \"1.01\", version2 = \"1.001\"", output: "0" },
      { input: "version1 = \"1.0\", version2 = \"1.0.0\"", output: "0" },
    ],
    intuition: "Split both version strings by dots, then compare the integer value of each component pair — treat missing components as zero, just like how 1.0 equals 1.0.0.",
    approach: [
      "Split version1 and version2 by '.'.",
      "Iterate to the length of the longer array.",
      "At each index, compare parseInt of each part (0 if missing).",
      "Return -1, 1, or 0 based on first difference.",
    ],
    solution: `function compareVersion(version1, version2) {
  const v1 = version1.split(".");
  const v2 = version2.split(".");
  const n = Math.max(v1.length, v2.length);
  for (let i = 0; i < n; i++) {
    const a = parseInt(v1[i] || "0");
    const b = parseInt(v2[i] || "0");
    if (a < b) return -1;
    if (a > b) return 1;
  }
  return 0;
}`,
    language: "javascript",
    complexity: { time: "O(max(m,n))", space: "O(max(m,n))" },
    systemDesign: "Semantic version comparison is used in package managers (npm, Maven, pip) to resolve dependency ranges and detect breaking changes. Database migration tools use version number ordering to apply schema change scripts in the correct sequence, ensuring idempotency when comparing installed vs required versions.",
    pitfalls: ["Parse components as integers, not strings — '10' > '9' as integers but '9' > '10' as strings lexicographically.", "Treat missing components as 0 to handle version strings of different lengths."],
  },
  // ---- MEDIUM (18 problems) ----
  {
    id: "strings-18",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      { input: "s = \"abcabcbb\"", output: "3", explanation: "\"abc\" is the longest substring without repeating characters." },
      { input: "s = \"bbbbb\"", output: "1" },
      { input: "s = \"pwwkew\"", output: "3", explanation: "\"wke\" is the answer." },
    ],
    intuition: "Use a sliding window with a set of characters currently in the window. When you add a character that already exists, shrink the window from the left until the duplicate is removed.",
    approach: [
      "Use a Map from character to its latest index.",
      "Maintain left pointer and maxLen.",
      "For each right index: if s[right] is in the map with index >= left, move left to that index + 1.",
      "Update the map and maxLen.",
    ],
    solution: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right]) && map.get(s[right]) >= left) {
      left = map.get(s[right]) + 1;
    }
    map.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(min(m,n))" },
    systemDesign: "Sliding-window uniqueness checks are used in session token validation (ensuring a sliding window of requests contains no repeated tokens to prevent replay attacks) and in stream deduplication pipelines. Database connection pool managers track active unique queries in a window to detect and evict duplicate long-running queries.",
    pitfalls: ["Store the character's index (not just presence) so you can jump the left pointer directly instead of iterating.", "The condition map.get(s[right]) >= left prevents jumping left pointer backward when an old occurrence is outside the window."],
  },
  {
    id: "strings-19",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming", "Two Pointers"],
    statement: "Given a string s, return the longest palindromic substring.",
    examples: [
      { input: "s = \"babad\"", output: "\"bab\"", explanation: "\"aba\" is also valid." },
      { input: "s = \"cbbd\"", output: "\"bb\"" },
    ],
    intuition: "For each character (and each pair of adjacent equal characters), expand outward as long as the characters on both sides match — every palindrome has a centre that you can grow from.",
    approach: [
      "For each index i, expand around center (i, i) for odd-length palindromes and (i, i+1) for even-length.",
      "While both bounds are valid and characters match, expand.",
      "Track the longest palindrome found.",
    ],
    solution: `function longestPalindrome(s) {
  let start = 0, maxLen = 1;
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.slice(start, start + maxLen);
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(1)" },
    systemDesign: "Palindrome detection is used in DNA sequence analysis to find restriction sites (palindromic sequences recognised by enzymes) and in data deduplication to identify symmetric byte patterns in compressed data. Manacher's algorithm achieves O(n) and is used in text analysis pipelines at scale.",
    pitfalls: ["Expand for both odd (single-centre) and even (double-centre) palindromes.", "The expand function exits when characters don't match, so the valid palindrome is s[l+1..r-1] after the loop."],
  },
  {
    id: "strings-20",
    title: "Palindromic Substrings",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming", "Two Pointers"],
    statement: "Given a string s, return the number of palindromic substrings in it.",
    examples: [
      { input: "s = \"abc\"", output: "3", explanation: "Three palindromic strings: \"a\", \"b\", \"c\"." },
      { input: "s = \"aaa\"", output: "6", explanation: "\"a\", \"a\", \"a\", \"aa\", \"aa\", \"aaa\"." },
    ],
    intuition: "For each possible centre, expand outward and count every valid palindrome you can form — every single character is a palindrome, and each successful expansion is another one.",
    approach: [
      "For each index i, expand around (i,i) and (i,i+1).",
      "For each successful expansion, increment count.",
      "Return total count.",
    ],
    solution: `function countSubstrings(s) {
  let count = 0;
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      count++;
      l--; r++;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(1)" },
    systemDesign: "Counting all palindromic substrings is a subproblem in text mining tools that identify repeated symmetric patterns in biological sequences, and in anomaly detection systems looking for symmetric byte patterns in network payloads. Palindrome counting also underlies Manacher's algorithm used in genome assembly pipelines.",
    pitfalls: ["Every single character is a palindrome — the count starts at n for a string of length n, not 0.", "Increment inside the while loop (not after it) to count each palindrome, not just its final extent."],
  },
  {
    id: "strings-21",
    title: "Group Anagrams",
    difficulty: "Medium",
    tags: ["String", "Hashing", "Sorting"],
    statement: "Given an array of strings strs, group the anagrams together and return the groups in any order.",
    examples: [
      { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" },
      { input: "strs = [\"\"]", output: "[[\"\"]]" },
    ],
    intuition: "Two words are anagrams if and only if their sorted characters are identical — use that sorted string as a map key to group words together, like filing words under their alphabetical root.",
    approach: [
      "Create a map from sorted-string key to list of original strings.",
      "For each word, sort its characters to produce the key.",
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
    systemDesign: "Canonical-key grouping is how search engines normalise query terms (stemming, lemmatisation) before indexing. In data lakes, partition pruning groups files by a derived canonical key so queries only scan relevant partitions. Content-addressable storage also uses canonical forms (hash of normalised content) to deduplicate documents.",
    pitfalls: ["A frequency-count key is O(k) per word instead of O(k log k) — faster for long strings with many distinct characters.", "Empty string is a valid input and its sorted form is the empty string, forming its own group."],
  },
  {
    id: "strings-22",
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    statement: "Given a string s and an integer k, you can change at most k characters to any other character. Return the length of the longest substring containing the same letter after performing at most k changes.",
    examples: [
      { input: "s = \"ABAB\", k = 2", output: "4" },
      { input: "s = \"AABABBA\", k = 1", output: "4" },
    ],
    intuition: "In a valid window, the number of characters we need to change is window size minus the frequency of the most common character. Keep the window valid by shrinking from the left when this exceeds k.",
    approach: [
      "Maintain a frequency map and track the max frequency seen so far.",
      "Expand right; update frequency and maxFreq.",
      "If windowSize - maxFreq > k, shrink left and update frequency.",
      "Track max window size.",
    ],
    solution: `function characterReplacement(s, k) {
  const count = {};
  let left = 0, maxFreq = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    count[s[right]] = (count[s[right]] || 0) + 1;
    maxFreq = Math.max(maxFreq, count[s[right]]);
    while (right - left + 1 - maxFreq > k) {
      count[s[left]]--;
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "The at-most-k-replacements window models fault-tolerance budgets in distributed systems: a window of server requests is valid if at most k requests fail. SLA monitoring tools use this pattern to find the longest interval where failure rate stays within the allowed budget, alerting only when the budget is exceeded.",
    pitfalls: ["maxFreq never decreases even when shrinking — this is a common optimisation trick that keeps the window from shrinking unnecessarily (we only care about larger windows).", "Only 26 possible characters so the count map has O(1) space."],
  },
  {
    id: "strings-23",
    title: "Find All Anagrams in a String",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given two strings s and p, return an array of all the start indices of p's anagrams in s.",
    examples: [
      { input: "s = \"cbaebabacd\", p = \"abc\"", output: "[0,6]" },
      { input: "s = \"abab\", p = \"ab\"", output: "[0,1,2]" },
    ],
    intuition: "Use a fixed-size sliding window of length p. Maintain frequency counts for both the window and p. When they match, you found an anagram — slide the window by one each step.",
    approach: [
      "Build pCount and windowCount for the first p.length characters of s.",
      "Slide from left to right: if counts match, add left index to result.",
      "Add new right character, remove outgoing left character.",
    ],
    solution: `function findAnagrams(s, p) {
  if (s.length < p.length) return [];
  const pCount = new Array(26).fill(0);
  const wCount = new Array(26).fill(0);
  const a = "a".charCodeAt(0);
  for (let i = 0; i < p.length; i++) {
    pCount[p.charCodeAt(i) - a]++;
    wCount[s.charCodeAt(i) - a]++;
  }
  const res = [];
  const equal = (a, b) => a.every((v, i) => v === b[i]);
  if (equal(pCount, wCount)) res.push(0);
  for (let i = p.length; i < s.length; i++) {
    wCount[s.charCodeAt(i) - a]++;
    wCount[s.charCodeAt(i - p.length) - a]--;
    if (equal(pCount, wCount)) res.push(i - p.length + 1);
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Sliding-window anagram detection is the basis of DNA motif search tools that find all occurrences of a target sequence within a genome string. In network intrusion detection, fixed-length payload patterns are matched against captured packet streams using the same frequency-array sliding window for O(n) performance at line rate.",
    pitfalls: ["Comparing two 26-element arrays is O(26) = O(1) — do it at every step.", "Track a 'matches' counter instead of comparing full arrays for a cleaner O(n) solution."],
  },
  {
    id: "strings-24",
    title: "Permutation in String",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given two strings s1 and s2, return true if s2 contains a permutation of s1. In other words, return true if one of s1's permutations is a substring of s2.",
    examples: [
      { input: "s1 = \"ab\", s2 = \"eidbaooo\"", output: "true", explanation: "s2 contains 'ba' which is a permutation of 'ab'." },
      { input: "s1 = \"ab\", s2 = \"eidboaoo\"", output: "false" },
    ],
    intuition: "This is the same as finding any anagram of s1 in s2 — slide a window of s1's length over s2 and check if the character frequencies match at each position.",
    approach: [
      "Build frequency arrays for s1 and the first window of s2.",
      "Track a 'matches' counter (number of characters with matching counts).",
      "Slide the window: update incoming and outgoing character counts and adjust 'matches'.",
      "Return true when matches === 26.",
    ],
    solution: `function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  const a = "a".charCodeAt(0);
  const need = new Array(26).fill(0), have = new Array(26).fill(0);
  for (const c of s1) need[c.charCodeAt(0) - a]++;
  let matches = 0;
  for (let i = 0; i < 26; i++) if (need[i] === 0) matches++;
  for (let i = 0; i < s1.length; i++) have[s2.charCodeAt(i) - a]++;
  for (let i = 0; i < 26; i++) if (have[i] === need[i]) matches++;
  if (matches === 26 * 2) return true;
  // simplified approach
  const s1c = new Array(26).fill(0), s2c = new Array(26).fill(0);
  for (const c of s1) s1c[c.charCodeAt(0) - a]++;
  for (let i = 0; i < s2.length; i++) {
    s2c[s2.charCodeAt(i) - a]++;
    if (i >= s1.length) s2c[s2.charCodeAt(i - s1.length) - a]--;
    if (s1c.every((v, j) => v === s2c[j])) return true;
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Permutation-in-string is the core of pattern matching in sequence databases — bioinformatics tools use it to find all occurrences of a gene sequence within a genome regardless of nucleotide order. API gateway rate limiters also use frequency-window matching to detect suspicious request pattern distributions.",
    pitfalls: ["The window size is exactly s1.length — add one character at the right and remove one from the left each step.", "Comparing 26-element arrays per step is O(1) since the alphabet is fixed."],
  },
  {
    id: "strings-25",
    title: "String to Integer (atoi)",
    difficulty: "Medium",
    tags: ["String", "Simulation"],
    statement: "Implement the atoi function that converts a string to a 32-bit signed integer. Skip leading whitespace, handle optional sign, read digits, ignore trailing non-digits. Clamp to [-2^31, 2^31-1].",
    examples: [
      { input: "s = \"42\"", output: "42" },
      { input: "s = \"   -42\"", output: "-42" },
      { input: "s = \"4193 with words\"", output: "4193" },
    ],
    intuition: "Follow the rules in order: skip spaces, read the optional sign, then read digits one by one — stop at the first non-digit and clamp the result to the 32-bit range.",
    approach: [
      "Trim leading whitespace.",
      "Read optional '+' or '-' for sign.",
      "Read consecutive digit characters, building the integer.",
      "Clamp the result to [INT_MIN, INT_MAX].",
    ],
    solution: `function myAtoi(s) {
  const INT_MAX = 2 ** 31 - 1, INT_MIN = -(2 ** 31);
  let i = 0, sign = 1, result = 0;
  while (i < s.length && s[i] === " ") i++;
  if (i < s.length && (s[i] === "+" || s[i] === "-")) {
    sign = s[i] === "-" ? -1 : 1;
    i++;
  }
  while (i < s.length && s[i] >= "0" && s[i] <= "9") {
    result = result * 10 + (s.charCodeAt(i) - 48);
    if (result * sign >= INT_MAX) return INT_MAX;
    if (result * sign <= INT_MIN) return INT_MIN;
    i++;
  }
  return result * sign;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "String-to-integer parsing is foundational in config parsers, HTTP header value extraction, and database type coercion during query execution. Production parsers must handle all edge cases (overflow, sign, whitespace) correctly because malformed input from untrusted sources can cause silent data corruption if not clamped properly.",
    pitfalls: ["Check for overflow/clamping inside the digit-reading loop, not after — to avoid exceeding safe integer range in the accumulation.", "Stop at the first non-digit character, not at the end of the string."],
  },
  {
    id: "strings-26",
    title: "Integer to Roman",
    difficulty: "Medium",
    tags: ["String", "Greedy", "Math"],
    statement: "Given an integer num (1 <= num <= 3999), convert it to a Roman numeral.",
    examples: [
      { input: "num = 3", output: "\"III\"" },
      { input: "num = 58", output: "\"LVIII\"" },
      { input: "num = 1994", output: "\"MCMXCIV\"" },
    ],
    intuition: "Greedily subtract the largest possible Roman value from the number, appending its symbol each time — like making change with coins of specific denominations.",
    approach: [
      "Define value-symbol pairs in descending order including subtractive pairs (CM, CD, XC, etc.).",
      "While num > 0: while num >= current value, append symbol and subtract value.",
      "Move to the next smaller value.",
    ],
    solution: `function intToRoman(num) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) {
      result += syms[i];
      num -= vals[i];
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(1)", space: "O(1)" },
    systemDesign: "Greedy denomination decomposition underlies coin change and cash register algorithms used in point-of-sale systems to compute change with the fewest coins. The same pattern appears in packet fragmentation algorithms where packets are split into the largest possible fixed-size fragments before using smaller ones.",
    pitfalls: ["Include all six subtractive cases (CM, CD, XC, XL, IX, IV) in the lookup table.", "The input range is bounded at 3999 so this is technically O(1) — no infinite loops are possible."],
  },
  {
    id: "strings-27",
    title: "Zigzag Conversion",
    difficulty: "Medium",
    tags: ["String", "Simulation"],
    statement: "Given a string s and numRows, write the string in a zigzag pattern on numRows rows and then read line by line. For example 'PAYPALISHIRING' with 3 rows becomes 'PAHNAPLSIIGYIR'.",
    examples: [
      { input: "s = \"PAYPALISHIRING\", numRows = 3", output: "\"PAHNAPLSIIGYIR\"" },
      { input: "s = \"PAYPALISHIRING\", numRows = 4", output: "\"PINALSIGYAHRPI\"" },
      { input: "s = \"A\", numRows = 1", output: "\"A\"" },
    ],
    intuition: "Simulate filling rows of a zigzag by tracking which row the current character belongs to, bouncing between row 0 and row numRows-1 like a ball bouncing between the floor and ceiling.",
    approach: [
      "Create numRows empty strings.",
      "Track current row and direction (+1 or -1).",
      "For each character, append to the current row's string and bounce direction at extremes.",
      "Concatenate all rows.",
    ],
    solution: `function convert(s, numRows) {
  if (numRows === 1 || numRows >= s.length) return s;
  const rows = Array.from({ length: numRows }, () => "");
  let row = 0, dir = -1;
  for (const c of s) {
    rows[row] += c;
    if (row === 0 || row === numRows - 1) dir = -dir;
    row += dir;
  }
  return rows.join("");
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Zigzag (transposition) patterns appear in interleaving encoders used in digital communications to spread burst errors across multiple codewords, improving error correction. Row-column interleaving is also used in columnar database storage to improve scan locality when different query patterns access data in different orders.",
    pitfalls: ["When numRows is 1, skip the zigzag logic and return s directly — otherwise direction never changes and rows[0] accumulates everything.", "The direction flips at both the top row (0) and the bottom row (numRows-1)."],
  },
  {
    id: "strings-28",
    title: "Multiply Strings",
    difficulty: "Medium",
    tags: ["String", "Math", "Simulation"],
    statement: "Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string. You must not convert the inputs to integers directly.",
    examples: [
      { input: "num1 = \"2\", num2 = \"3\"", output: "\"6\"" },
      { input: "num1 = \"123\", num2 = \"456\"", output: "\"56088\"" },
    ],
    intuition: "Simulate long multiplication: multiply each digit of num2 by each digit of num1 and accumulate into the correct position in the result array, then handle carries.",
    approach: [
      "Create a result array of length m+n filled with zeros.",
      "For each pair (i, j), add num1[i] * num2[j] to result[i+j+1].",
      "Handle carry by propagating from right to left through the result array.",
      "Convert result array to string, stripping leading zeros.",
    ],
    solution: `function multiply(num1, num2) {
  const m = num1.length, n = num2.length;
  const pos = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const mul = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48);
      const p1 = i + j, p2 = i + j + 1;
      const sum = mul + pos[p2];
      pos[p2] = sum % 10;
      pos[p1] += Math.floor(sum / 10);
    }
  }
  const result = pos.join("").replace(/^0+/, "");
  return result || "0";
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m+n)" },
    systemDesign: "String-based multiplication is used in arbitrary-precision arithmetic libraries (Java BigInteger, Python int) that back financial systems requiring exact decimal arithmetic. Distributed numeric computation frameworks store large numbers as digit arrays and parallelise multiplication using schoolbook or Karatsuba algorithms across multiple shards.",
    pitfalls: ["The product of two numbers with lengths m and n has at most m+n digits.", "Strip leading zeros after building the result — '0' should be returned for zero inputs, not an empty string."],
  },
  {
    id: "strings-29",
    title: "Decode String",
    difficulty: "Medium",
    tags: ["String", "Stack", "Recursion"],
    statement: "Given an encoded string, return the decoded string. The encoding rule is k[encoded_string] meaning the encoded_string inside the brackets is repeated exactly k times. k is always a positive integer.",
    examples: [
      { input: "s = \"3[a]2[bc]\"", output: "\"aaabcbc\"" },
      { input: "s = \"3[a2[c]]\"", output: "\"accaccacc\"" },
      { input: "s = \"2[abc]3[cd]ef\"", output: "\"abcabccdcdcdef\"" },
    ],
    intuition: "Use a stack. When you see a '[', push the current string and repeat count onto the stack and start fresh. When you see ']', pop and repeat the current string by the saved count, then prepend the saved string.",
    approach: [
      "Maintain current string and current number; use a stack.",
      "On digit: build the number.",
      "On '[': push current string and number onto stack, reset both.",
      "On ']': pop count and prev string; set current = prev + current.repeat(count).",
      "On letter: append to current string.",
    ],
    solution: `function decodeString(s) {
  const stack = [];
  let current = "", k = 0;
  for (const c of s) {
    if (c >= "0" && c <= "9") {
      k = k * 10 + parseInt(c);
    } else if (c === "[") {
      stack.push([current, k]);
      current = ""; k = 0;
    } else if (c === "]") {
      const [prev, count] = stack.pop();
      current = prev + current.repeat(count);
    } else {
      current += c;
    }
  }
  return current;
}`,
    language: "javascript",
    complexity: { time: "O(n * max_k)", space: "O(n)" },
    systemDesign: "Stack-based bracket/nesting parsers underlie all expression evaluators, HTML/XML parsers, and JSON decoders. Template engines (Handlebars, Jinja2) parse nested {{#each}} blocks with the same stack mechanism. Compiler front-ends use stacks to manage nested scope contexts during parsing.",
    pitfalls: ["Multi-digit repeat counts (like '12[a]') must be handled by accumulating digits: k = k*10 + digit.", "Reset both current and k when pushing to the stack at '['."],
  },
  {
    id: "strings-30",
    title: "Sort Characters By Frequency",
    difficulty: "Medium",
    tags: ["String", "Hashing", "Heap", "Bucket Sort"],
    statement: "Given a string s, sort it in decreasing order based on the frequency of the characters and return the sorted string.",
    examples: [
      { input: "s = \"tree\"", output: "\"eert\"", explanation: "'e' appears twice while 'r' and 't' appear once." },
      { input: "s = \"cccaaa\"", output: "\"aaaccc\"" },
      { input: "s = \"Aabb\"", output: "\"bbAa\"" },
    ],
    intuition: "Count character frequencies, then sort the characters by their counts in descending order and repeat each character by its count — like sorting playing cards into piles by how many you have of each.",
    approach: [
      "Build a frequency map.",
      "Sort map entries by frequency descending.",
      "For each [char, freq], append char repeated freq times.",
    ],
    solution: `function frequencySort(s) {
  const count = new Map();
  for (const c of s) count.set(c, (count.get(c) || 0) + 1);
  return [...count.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([c, f]) => c.repeat(f))
    .join("");
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Frequency-sorted outputs power autocomplete and search suggestion ranking — results are sorted by term frequency in the corpus. Database query optimisers use column frequency statistics (stored in histogram metadata) to estimate selectivity and choose optimal join order, directly using the frequency map concept.",
    pitfalls: ["Uppercase and lowercase are distinct characters — 'A' and 'a' have separate counts.", "Bucket sort (O(n)) is faster than comparison sort here since frequencies are bounded by string length."],
  },
  {
    id: "strings-31",
    title: "Custom Sort String",
    difficulty: "Medium",
    tags: ["String", "Hashing", "Sorting"],
    statement: "Given a string order and a string s, permute the characters of s so that they match the order. Characters not in order can be placed at the end in any order.",
    examples: [
      { input: "order = \"cba\", s = \"abcd\"", output: "\"cbad\"" },
      { input: "order = \"bcafg\", s = \"abcd\"", output: "\"bcad\"" },
    ],
    intuition: "Count characters in s, then for each character in order take as many copies as exist in s, then append any remaining characters not in order — like sorting items into a custom priority queue.",
    approach: [
      "Build a frequency map for s.",
      "For each character in order: append it freq[char] times, delete from map.",
      "Append all remaining characters in the map.",
    ],
    solution: `function customSortString(order, s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  let result = "";
  for (const c of order) {
    if (count[c]) { result += c.repeat(count[c]); delete count[c]; }
  }
  for (const [c, f] of Object.entries(count)) result += c.repeat(f);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Custom sort orders are used in query engines that support user-defined collation sequences (e.g. sorting month names by calendar order instead of alphabetically). Priority-ordered field rendering in API responses also mirrors this — certain fields are output first according to a schema-defined order rather than by value.",
    pitfalls: ["Characters in order that don't appear in s are simply skipped — no error.", "Characters in s that don't appear in order go at the end in any order."],
  },
  {
    id: "strings-32",
    title: "Remove Duplicate Letters",
    difficulty: "Medium",
    tags: ["String", "Stack", "Greedy"],
    statement: "Given a string s, remove duplicate letters so that every letter appears once and only once. You must make sure the result is the smallest in lexicographical order among all possible results.",
    examples: [
      { input: "s = \"bcabc\"", output: "\"abc\"" },
      { input: "s = \"cbacdcbc\"", output: "\"acdb\"" },
    ],
    intuition: "Use a monotonic stack. For each character, pop the top of the stack if it is greater than the current character AND will appear again later — this greedily builds the lexicographically smallest result.",
    approach: [
      "Count remaining occurrences of each character.",
      "Use a stack and a seen set.",
      "For each character: decrement its remaining count.",
      "If already in stack, skip. If stack top > current char and top has remaining occurrences, pop it and mark unseen.",
      "Push current character and mark seen.",
    ],
    solution: `function removeDuplicateLetters(s) {
  const count = {}, inStack = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  const stack = [];
  for (const c of s) {
    count[c]--;
    if (inStack[c]) continue;
    while (stack.length && stack[stack.length - 1] > c && count[stack[stack.length - 1]] > 0) {
      inStack[stack.pop()] = false;
    }
    stack.push(c);
    inStack[c] = true;
  }
  return stack.join("");
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Lexicographically smallest subsequence selection with uniqueness constraints models query execution plan deduplication — when choosing a minimal set of operations, you want the cheapest plan (lexicographically smallest cost vector) without duplicate steps. Greedy stack deduplication also appears in log compaction pipelines that merge write-ahead logs.",
    pitfalls: ["Only pop from the stack if the top character will appear again later — check count[top] > 0.", "The inStack set prevents adding a character twice without popping the earlier occurrence first."],
  },
  {
    id: "strings-33",
    title: "Minimum Window Substring",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given strings s and t, return the minimum window substring of s that contains every character of t (including duplicates). If no such substring exists, return an empty string.",
    examples: [
      { input: "s = \"ADOBECODEBANC\", t = \"ABC\"", output: "\"BANC\"" },
      { input: "s = \"a\", t = \"a\"", output: "\"a\"" },
      { input: "s = \"a\", t = \"aa\"", output: "\"\"" },
    ],
    intuition: "Expand the right pointer to cover all required characters, then shrink the left pointer as far as possible while still maintaining coverage — like tightening a rubber band around all required characters.",
    approach: [
      "Build a frequency map for t and track how many distinct characters are fully satisfied.",
      "Expand right pointer; when a character meets t's count, increment 'formed'.",
      "When all characters are satisfied, shrink left, update minimum window, decrement counts.",
      "Return the minimum window found.",
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
    systemDesign: "Minimum-window substring models finding the shortest log snippet containing all required audit events, used in SIEM systems for incident reconstruction. Search engines use a similar shortest-span algorithm to find the best document snippet that covers all query terms for result preview generation.",
    pitfalls: ["Track formed (number of fully satisfied characters) separately from total character presence.", "The formed counter only increments when a character's count exactly reaches the required count — not on every occurrence."],
  },
  {
    id: "strings-34",
    title: "Word Break",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming", "Trie"],
    statement: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    examples: [
      { input: "s = \"leetcode\", wordDict = [\"leet\",\"code\"]", output: "true" },
      { input: "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]", output: "true" },
      { input: "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", output: "false" },
    ],
    intuition: "Use a DP array where dp[i] means 'can the first i characters of s be segmented?'. For each position i, check if any word in the dictionary ends here and dp[i - word.length] is true.",
    approach: [
      "Build a Set from wordDict.",
      "Create dp array of length n+1, dp[0] = true.",
      "For each i from 1 to n: for each word in wordDict, if i >= word.length and dp[i - word.length] is true and s.slice(i-word.length, i) === word, set dp[i] = true.",
      "Return dp[n].",
    ],
    solution: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (const word of words) {
      if (i >= word.length && dp[i - word.length] && s.slice(i - word.length, i) === word) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
    language: "javascript",
    complexity: { time: "O(n * m * k)", space: "O(n)" },
    systemDesign: "Word segmentation DP is used in NLP tokenisation pipelines (Chinese/Japanese word segmentation without spaces) and in search query normalisation where a query string must be split into known index terms. URL slug parsers also use dictionary-based segmentation to split compound slugs into meaningful words for SEO.",
    pitfalls: ["Initialize dp[0] = true (empty string is always segmentable).", "An O(n²) approach iterating over all substrings is cleaner and avoids repeated word iteration."],
  },
  {
    id: "strings-35",
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"],
    statement: "Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is a sequence derived by deleting some characters without changing order.",
    examples: [
      { input: "text1 = \"abcde\", text2 = \"ace\"", output: "3", explanation: "LCS is \"ace\"." },
      { input: "text1 = \"abc\", text2 = \"abc\"", output: "3" },
      { input: "text1 = \"abc\", text2 = \"def\"", output: "0" },
    ],
    intuition: "If the last characters match, the LCS includes them and the problem reduces to the rest. If not, the LCS is the best of dropping the last character from either string — a classic two-choice DP.",
    approach: [
      "Create a 2D dp table of size (m+1) x (n+1).",
      "If text1[i-1] === text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1.",
      "Else: dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]).",
      "Return dp[m][n].",
    ],
    solution: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "LCS is the algorithm behind diff utilities (git diff, Unix diff) that find the longest common subsequence of lines to show minimal edits between two file versions. In bioinformatics, LCS underpins global sequence alignment tools used to compare genomes and identify conserved regions across species.",
    pitfalls: ["Space can be reduced to O(min(m,n)) using only two rows since each row only depends on the previous one.", "The value at dp[i][j] is the LCS length of the first i chars of text1 and first j chars of text2."],
  },
  // ---- HARD (15 problems) ----
  {
    id: "strings-36",
    title: "Edit Distance",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming"],
    statement: "Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) required to convert word1 into word2.",
    examples: [
      { input: "word1 = \"horse\", word2 = \"ros\"", output: "3" },
      { input: "word1 = \"intention\", word2 = \"execution\"", output: "5" },
    ],
    intuition: "If the last characters match, no operation is needed for them and we recurse on the rest. If not, we try all three operations and take the minimum — the DP table memoises these subproblems.",
    approach: [
      "Create dp[m+1][n+1] where dp[i][j] = edit distance of first i chars of word1 and first j chars of word2.",
      "Base cases: dp[i][0] = i, dp[0][j] = j.",
      "If word1[i-1] === word2[j-1]: dp[i][j] = dp[i-1][j-1].",
      "Else: dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).",
    ],
    solution: `function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Edit distance (Levenshtein distance) powers spell checkers (find the closest dictionary word), fuzzy search in databases (search by approximate match), and DNA mutation analysis. Elasticsearch uses edit distance to implement its fuzzy query parameter; Git uses a weighted variant for blame and rename detection.",
    pitfalls: ["The three operations map to three DP transitions: delete (dp[i-1][j]+1), insert (dp[i][j-1]+1), replace (dp[i-1][j-1]+1).", "Space can be reduced to O(n) using two rolling rows."],
  },
  {
    id: "strings-37",
    title: "Wildcard Matching",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming", "Greedy"],
    statement: "Given an input string s and a pattern p, implement wildcard pattern matching with '?' (matches any single character) and '*' (matches any sequence of characters including empty). Return true if s fully matches p.",
    examples: [
      { input: "s = \"aa\", p = \"a\"", output: "false" },
      { input: "s = \"aa\", p = \"*\"", output: "true" },
      { input: "s = \"cb\", p = \"?a\"", output: "false" },
    ],
    intuition: "Use a DP table. A '*' can match zero or more characters — dp[i][j] is true if the first i characters of s match the first j characters of p. A '*' can absorb the previous character or nothing.",
    approach: [
      "Create dp[m+1][n+1]. dp[0][0] = true.",
      "Handle leading stars: dp[0][j] = dp[0][j-1] if p[j-1] === '*'.",
      "Fill table: if p[j-1] === '?' or p[j-1] === s[i-1]: dp[i][j] = dp[i-1][j-1].",
      "If p[j-1] === '*': dp[i][j] = dp[i-1][j] (star matches one) OR dp[i][j-1] (star matches zero).",
    ],
    solution: `function isMatch(s, p) {
  const m = s.length, n = p.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j++) if (p[j - 1] === "*") dp[0][j] = dp[0][j - 1];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
      else if (p[j - 1] === "?" || p[j - 1] === s[i - 1]) dp[i][j] = dp[i - 1][j - 1];
    }
  }
  return dp[m][n];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Wildcard matching is used in file system glob patterns (*.log, src/**/*.ts), database LIKE queries, and cloud storage bucket policy rules (AWS S3 bucket ARN wildcards). Shell interpreters implement glob expansion using similar DP or backtracking, and CDN routing rules use wildcard path matching for cache key normalisation.",
    pitfalls: ["'*' matches zero characters — dp[i][j-1] handles the zero-match case.", "Do not confuse with regex '.*' (dot-star matches any char sequence) — here '*' alone matches any sequence."],
  },
  {
    id: "strings-38",
    title: "Regular Expression Matching",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming", "Recursion"],
    statement: "Given an input string s and a pattern p, implement regular expression matching with '.' (matches any single character) and '*' (matches zero or more of the preceding element). The matching must cover the entire string.",
    examples: [
      { input: "s = \"aa\", p = \"a*\"", output: "true" },
      { input: "s = \"ab\", p = \".*\"", output: "true" },
      { input: "s = \"mississippi\", p = \"mis*is*p*.\"", output: "false" },
    ],
    intuition: "Here '*' applies to the element before it (unlike wildcard matching). For a 'x*' pair, you can either skip both (zero occurrences) or, if s[i] matches x, consume one s character and keep the pattern in place.",
    approach: [
      "Create dp[m+1][n+1], dp[0][0] = true.",
      "Handle patterns like 'a*b*' matching empty string: dp[0][j] = dp[0][j-2] if p[j-1] === '*'.",
      "If p[j-1] === '*': zero-use: dp[i][j] = dp[i][j-2]; one-use: if s[i-1] matches p[j-2], dp[i][j] |= dp[i-1][j].",
      "If p[j-1] === '.' or matches s[i-1]: dp[i][j] = dp[i-1][j-1].",
    ],
    solution: `function isMatchRegex(s, p) {
  const m = s.length, n = p.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= n; j++) if (p[j - 1] === "*") dp[0][j] = dp[0][j - 2];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        dp[i][j] = dp[i][j - 2];
        if (p[j - 2] === "." || p[j - 2] === s[i - 1]) dp[i][j] = dp[i][j] || dp[i - 1][j];
      } else if (p[j - 1] === "." || p[j - 1] === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  return dp[m][n];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Regex matching underlies query engines, log parsers, and firewall rule evaluation. Production regex engines (PCRE, RE2) use NFA/DFA compilation rather than DP to achieve linear time, which is critical for security — ReDoS attacks exploit backtracking regex engines by crafting inputs that cause exponential runtime.",
    pitfalls: ["'x*' is a two-character pattern unit — when matching '*' at position j, reference p[j-2] for the preceding element.", "The zero-occurrence case dp[i][j] = dp[i][j-2] lets 'x*' match empty string."],
  },
  {
    id: "strings-39",
    title: "Shortest Palindrome",
    difficulty: "Hard",
    tags: ["String", "KMP", "String Matching"],
    statement: "Given a string s, you can convert it to a palindrome by adding characters in front of it. Find and return the shortest palindrome you can find by performing this transformation.",
    examples: [
      { input: "s = \"aacecaaa\"", output: "\"aaacecaaa\"" },
      { input: "s = \"abcd\"", output: "\"dcbabcd\"" },
    ],
    intuition: "The shortest palindrome is formed by finding the longest palindromic prefix of s, then prepending the reverse of the remaining suffix. Use KMP failure function on s + '#' + reverse(s) to find this prefix efficiently.",
    approach: [
      "Compute rev = reverse of s.",
      "Build the string combined = s + '#' + rev.",
      "Run KMP failure function on combined.",
      "The last value of the failure array gives the length of the longest palindromic prefix.",
      "Prepend rev.slice(0, s.length - lps) to s.",
    ],
    solution: `function shortestPalindrome(s) {
  const rev = s.split("").reverse().join("");
  const combined = s + "#" + rev;
  const lps = new Array(combined.length).fill(0);
  for (let i = 1; i < combined.length; i++) {
    let len = lps[i - 1];
    while (len > 0 && combined[i] !== combined[len]) len = lps[len - 1];
    if (combined[i] === combined[len]) len++;
    lps[i] = len;
  }
  const longest = lps[combined.length - 1];
  return rev.slice(0, s.length - longest) + s;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "The KMP failure function is a core tool in streaming text search systems (Aho-Corasick multi-pattern search, intrusion detection payload scanning) that need to find patterns in O(n) without backtracking. The '#' separator trick for combining strings with KMP is also used in suffix array construction for genome assembly.",
    pitfalls: ["The '#' separator prevents the LPS from crossing the boundary between s and its reverse.", "The LPS value tells you how much of s is already a palindrome from the start — the rest is reversed and prepended."],
  },
  {
    id: "strings-40",
    title: "Distinct Subsequences",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming"],
    statement: "Given two strings s and t, return the number of distinct subsequences of s which equals t.",
    examples: [
      { input: "s = \"rabbbit\", t = \"rabbit\"", output: "3", explanation: "There are 3 ways to get 'rabbit' from 'rabbbit'." },
      { input: "s = \"babgbag\", t = \"bag\"", output: "5" },
    ],
    intuition: "dp[i][j] = number of ways to form the first j characters of t using the first i characters of s. If the characters match, you can either use this s character or skip it.",
    approach: [
      "Create dp[m+1][n+1]. dp[i][0] = 1 for all i (empty t is always a subsequence).",
      "For each (i,j): dp[i][j] = dp[i-1][j] (skip s[i]).",
      "If s[i-1] === t[j-1]: dp[i][j] += dp[i-1][j-1] (use s[i] to match t[j]).",
      "Return dp[m][n].",
    ],
    solution: `function numDistinct(s, t) {
  const m = s.length, n = t.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = 1;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = dp[i - 1][j];
      if (s[i - 1] === t[j - 1]) dp[i][j] += dp[i - 1][j - 1];
    }
  }
  return dp[m][n];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Counting distinct subsequences models the number of valid parse trees for a given grammar rule, which is used in probabilistic parsing in NLP systems. In database query planning, counting the distinct ways a query plan can be derived from schema relationships helps the optimizer estimate plan diversity and pick the most robust one.",
    pitfalls: ["dp[i][0] = 1 (empty string t is always derivable by taking zero characters from any prefix of s).", "dp[0][j] = 0 for j > 0 (empty s cannot produce non-empty t)."],
  },
  {
    id: "strings-41",
    title: "Text Justification",
    difficulty: "Hard",
    tags: ["String", "Greedy", "Simulation"],
    statement: "Given an array of strings words and an integer maxWidth, format the text such that each line has exactly maxWidth characters and is fully justified (both left and right). Last line should be left-justified.",
    examples: [
      { input: "words = [\"This\",\"is\",\"an\",\"example\",\"of\",\"text\",\"justification.\"], maxWidth = 16", output: "[\"This    is    an\",\"example  of text\",\"justification.  \"]" },
    ],
    intuition: "Greedily pack as many words as fit on each line, then distribute the required spaces as evenly as possible between words — extra spaces go to the leftmost gaps first.",
    approach: [
      "Greedily collect words for each line until adding another word would exceed maxWidth.",
      "For each line: compute total spaces needed, distribute evenly across gaps.",
      "Extra spaces (when not divisible evenly) go to the leftmost gaps one by one.",
      "Last line: words separated by single spaces, padded with trailing spaces.",
    ],
    solution: `function fullJustify(words, maxWidth) {
  const lines = [];
  let i = 0;
  while (i < words.length) {
    let lineLen = words[i].length, j = i + 1;
    while (j < words.length && lineLen + 1 + words[j].length <= maxWidth) {
      lineLen += 1 + words[j].length;
      j++;
    }
    lines.push(words.slice(i, j));
    i = j;
  }
  return lines.map((line, idx) => {
    if (idx === lines.length - 1 || line.length === 1) {
      return line.join(" ").padEnd(maxWidth);
    }
    const totalSpaces = maxWidth - line.reduce((s, w) => s + w.length, 0);
    const gaps = line.length - 1;
    const spacePerGap = Math.floor(totalSpaces / gaps);
    const extra = totalSpaces % gaps;
    return line.reduce((res, word, i) => {
      if (i === 0) return word;
      const spaces = spacePerGap + (i <= extra ? 1 : 0);
      return res + " ".repeat(spaces) + word;
    }, "");
  });
}`,
    language: "javascript",
    complexity: { time: "O(n * maxWidth)", space: "O(n * maxWidth)" },
    systemDesign: "Text justification algorithms are embedded in word processors, PDF rendering engines (LaTeX, PDFKit), and e-reader firmware. Publishing systems also use Knuth-Plass optimal line-breaking (a DP variant of greedy justification) to produce aesthetically balanced paragraph layouts with minimal whitespace variance.",
    pitfalls: ["Single-word lines and the last line are left-justified — special-case these.", "Distribute extra spaces to the leftmost gaps: gap i gets +1 space if i < extra."],
  },
  {
    id: "strings-42",
    title: "Integer to English Words",
    difficulty: "Hard",
    tags: ["String", "Math", "Recursion"],
    statement: "Convert a non-negative integer num to its English words representation.",
    examples: [
      { input: "num = 123", output: "\"One Hundred Twenty Three\"" },
      { input: "num = 12345", output: "\"Twelve Thousand Three Hundred Forty Five\"" },
      { input: "num = 1000010", output: "\"One Million Ten\"" },
    ],
    intuition: "Process the number in groups of three digits (thousands, millions, billions). Convert each group of three to words using a helper, then append the scale word (Thousand, Million, Billion).",
    approach: [
      "Define arrays for ones, teens, and tens.",
      "Write a helper(n) that converts 0-999 to words.",
      "Divide the number into groups of three from the right, each associated with a scale.",
      "Build the result by prepending each non-zero group's English words plus its scale.",
    ],
    solution: `function numberToWords(num) {
  if (num === 0) return "Zero";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  function helper(n) {
    if (n === 0) return "";
    if (n < 20) return ones[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
    return ones[Math.floor(n / 100)] + " Hundred " + helper(n % 100);
  }
  const scales = ["", "Thousand", "Million", "Billion"];
  let result = "", i = 0;
  while (num > 0) {
    if (num % 1000 !== 0) {
      result = helper(num % 1000) + (scales[i] ? scales[i] + " " : "") + result;
    }
    num = Math.floor(num / 1000);
    i++;
  }
  return result.trim();
}`,
    language: "javascript",
    complexity: { time: "O(log n)", space: "O(log n)" },
    systemDesign: "Number-to-words conversion is used in financial document generation systems (cheque printing, invoice generation) and in text-to-speech (TTS) engines that must vocalise numeric values. Internationalisation (i18n) libraries implement localised number words for dozens of languages, making the scale-grouping approach portable across locales.",
    pitfalls: ["Zero requires special handling ('Zero') since all groups are empty.", "Trailing spaces after helper() calls require a trim at the end."],
  },
  {
    id: "strings-43",
    title: "Substring with Concatenation of All Words",
    difficulty: "Hard",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given a string s and an array of strings words (all equal length), return all starting indices of substrings in s that is a concatenation of each word in words exactly once, in any order.",
    examples: [
      { input: "s = \"barfoothefoobarman\", words = [\"foo\",\"bar\"]", output: "[0,9]" },
      { input: "s = \"wordgoodgoodgoodbestword\", words = [\"word\",\"good\",\"best\",\"word\"]", output: "[]" },
    ],
    intuition: "Since all words have the same length, slide a window of size (wordLen * words.length) and check if it can be split into exactly the required words — use frequency maps for O(1) checks.",
    approach: [
      "Build a frequency map of words.",
      "For each starting index i from 0 to wordLen-1, use a sliding window of word-sized chunks.",
      "Maintain a window frequency map and a count of valid words.",
      "When count equals words.length, record the start index.",
    ],
    solution: `function findSubstring(s, words) {
  if (!s || !words.length) return [];
  const wordLen = words[0].length, wordCount = words.length;
  const total = wordLen * wordCount;
  const wordFreq = {};
  for (const w of words) wordFreq[w] = (wordFreq[w] || 0) + 1;
  const result = [];
  for (let i = 0; i <= s.length - total; i++) {
    const seen = {};
    let j = 0;
    while (j < wordCount) {
      const word = s.slice(i + j * wordLen, i + (j + 1) * wordLen);
      if (!wordFreq[word]) break;
      seen[word] = (seen[word] || 0) + 1;
      if (seen[word] > wordFreq[word]) break;
      j++;
    }
    if (j === wordCount) result.push(i);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * m * wordLen)", space: "O(m)" },
    systemDesign: "Concatenation-of-all-words matching is used in network packet payload analysis to detect protocol sequences where a fixed set of tokens must all appear in a window. In database systems, multi-word phrase queries (where all query terms must appear within a proximity window) use similar fixed-size chunking and frequency matching.",
    pitfalls: ["All words are the same length — this is the key property that makes chunked sliding windows work.", "The optimised O(n) sliding window approach tracks word entry/exit at the word-length granularity."],
  },
  {
    id: "strings-44",
    title: "Palindrome Pairs",
    difficulty: "Hard",
    tags: ["String", "Hashing", "Trie"],
    statement: "Given a list of unique words, return all pairs of distinct indices (i, j) such that the concatenation of words[i] + words[j] is a palindrome.",
    examples: [
      { input: "words = [\"abcd\",\"dcba\",\"lls\",\"s\",\"sssll\"]", output: "[[0,1],[1,0],[3,2],[2,4]]" },
      { input: "words = [\"bat\",\"tab\",\"cat\"]", output: "[[0,1],[1,0]]" },
    ],
    intuition: "For each word, check if its reverse is another word in the dictionary (whole word match), and also check if any prefix or suffix of the word is a palindrome combined with a matching reverse of the complement.",
    approach: [
      "Build a map from word to its index.",
      "For each word at index i: check if its reverse exists (gives pair).",
      "For each split point k: if prefix is palindrome and reverse of suffix exists, add pair. If suffix is palindrome and reverse of prefix exists, add pair.",
    ],
    solution: `function palindromePairs(words) {
  const wordMap = new Map(words.map((w, i) => [w, i]));
  const isPalin = (s, l, r) => { while (l < r) if (s[l++] !== s[r--]) return false; return true; };
  const result = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const rev = w.split("").reverse().join("");
    if (wordMap.has(rev) && wordMap.get(rev) !== i) result.push([i, wordMap.get(rev)]);
    for (let k = 1; k <= w.length; k++) {
      const prefix = w.slice(0, k), suffix = w.slice(k);
      if (isPalin(w, 0, k - 1)) {
        const revSuffix = suffix.split("").reverse().join("");
        if (wordMap.has(revSuffix) && wordMap.get(revSuffix) !== i) result.push([wordMap.get(revSuffix), i]);
      }
      if (isPalin(w, k, w.length - 1)) {
        const revPrefix = prefix.split("").reverse().join("");
        if (wordMap.has(revPrefix) && wordMap.get(revPrefix) !== i) result.push([i, wordMap.get(revPrefix)]);
      }
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * k²)", space: "O(n)" },
    systemDesign: "Palindrome pair detection is used in cryptographic systems to find self-complementary sequences, and in genomics to identify palindromic restriction enzyme recognition sites across a DNA word bank. The trie-based variant of this algorithm is used in autocomplete systems that need to find complementary prefixes/suffixes across a dictionary.",
    pitfalls: ["Whole reverse match and prefix/suffix palindrome cases both need separate handling.", "Avoid duplicate pairs: the whole-reverse case and the split case can generate the same pair for certain inputs."],
  },
  {
    id: "strings-45",
    title: "Basic Calculator",
    difficulty: "Hard",
    tags: ["String", "Stack", "Math"],
    statement: "Implement a basic calculator to evaluate a simple expression string containing '+', '-', '(', ')', and non-negative integers. The expression string will not contain any non-digit characters other than '+', '-', '(', and ')'.",
    examples: [
      { input: "s = \"1 + 1\"", output: "2" },
      { input: "s = \" 2-1 + 2 \"", output: "3" },
      { input: "s = \"(1+(4+5+2)-3)+(6+8)\"", output: "23" },
    ],
    intuition: "Use a stack to handle parentheses. When you see '(', push the current result and sign onto the stack, and reset. When you see ')', pop the saved sign and result, and merge with the current result.",
    approach: [
      "Track current number, result, and sign (+1 or -1).",
      "On digit: accumulate the number.",
      "On '+'/'-': add current number * sign to result, set new sign, reset number.",
      "On '(': push result and sign, reset both.",
      "On ')': add current number * sign to result, pop and multiply by saved sign, add saved result.",
    ],
    solution: `function calculate(s) {
  const stack = [];
  let num = 0, result = 0, sign = 1;
  for (const c of s) {
    if (c >= "0" && c <= "9") {
      num = num * 10 + parseInt(c);
    } else if (c === "+") {
      result += sign * num; num = 0; sign = 1;
    } else if (c === "-") {
      result += sign * num; num = 0; sign = -1;
    } else if (c === "(") {
      stack.push(result); stack.push(sign);
      result = 0; sign = 1;
    } else if (c === ")") {
      result += sign * num; num = 0;
      result *= stack.pop();
      result += stack.pop();
    }
  }
  return result + sign * num;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Stack-based expression evaluation is the foundation of formula engines in spreadsheet applications (Excel, Google Sheets), SQL expression parsers, and programming language interpreters. Every arithmetic expression in a compiler's intermediate representation goes through operator precedence parsing built on stacks.",
    pitfalls: ["Add the last accumulated number after the loop ends — no operator follows the last number.", "When processing '(', push both the current result AND the sign before the parenthesis, then reset both."],
  },
  {
    id: "strings-46",
    title: "Decode Ways",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming"],
    statement: "A message containing letters A-Z is encoded as numbers 1-26. Given a string s of digits, return the number of ways to decode it.",
    examples: [
      { input: "s = \"12\"", output: "2", explanation: "Can be decoded as 'AB' (1 2) or 'L' (12)." },
      { input: "s = \"226\"", output: "3" },
      { input: "s = \"06\"", output: "0" },
    ],
    intuition: "dp[i] = number of ways to decode the first i characters. Each position can try taking one digit (if non-zero) or two digits (if 10-26), adding the ways from the previous valid positions.",
    approach: [
      "dp[0] = 1 (empty), dp[1] = 1 if s[0] != '0' else 0.",
      "For each i from 2 to n: one-digit decode if s[i-1] != '0' adds dp[i-1].",
      "Two-digit decode if s.slice(i-2,i) between 10 and 26 adds dp[i-2].",
    ],
    solution: `function numDecodings(s) {
  if (!s || s[0] === "0") return 0;
  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    const one = parseInt(s[i - 1]);
    const two = parseInt(s.slice(i - 2, i));
    if (one >= 1) dp[i] += dp[i - 1];
    if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
  }
  return dp[n];
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Counting valid decodings models the number of valid parse trees for a sequence of ambiguous tokens, fundamental in NLP ambiguity resolution and compiler parser generators. In telecommunications, counting valid codeword decodings helps estimate error recovery options in variable-length coding schemes like Huffman codes.",
    pitfalls: ["A leading '0' is always invalid — return 0 immediately.", "A '0' in the middle is only valid as part of '10' or '20' — it contributes only to the two-digit path."],
  },
  {
    id: "strings-47",
    title: "Sentence Screen Fitting",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming", "Simulation"],
    statement: "Given a rows x cols screen and a sentence (array of words), find how many times the sentence can fit on the screen. Words cannot be split and spaces between words count as one character.",
    examples: [
      { input: "sentence = [\"hello\",\"world\"], rows = 2, cols = 8", output: "1" },
      { input: "sentence = [\"a\", \"bcd\", \"e\"], rows = 3, cols = 6", output: "2" },
    ],
    intuition: "Simulate filling rows: track how many characters of the repeated sentence fit on each row. Use a pointer into the (infinite) repeated sentence and advance it by cols characters per row, skipping any partial word at the row end.",
    approach: [
      "Build the sentence string with spaces. Track start pointer into infinite repetition.",
      "For each row, advance start by cols.",
      "If the character at start is a space, advance start by 1.",
      "While start > 0 and sentence[start-1] is not a space, retreat start (we cut a word).",
      "Return start / sentence.length.",
    ],
    solution: `function wordsTyping(sentence, rows, cols) {
  const s = sentence.join(" ") + " ";
  const len = s.length;
  let start = 0;
  for (let i = 0; i < rows; i++) {
    start += cols;
    if (s[start % len] === " ") {
      start++;
    } else {
      while (start > 0 && s[(start - 1) % len] !== " ") start--;
    }
  }
  return Math.floor(start / len);
}`,
    language: "javascript",
    complexity: { time: "O(rows * cols / len)", space: "O(n)" },
    systemDesign: "Screen-fitting algorithms are used in display systems for embedded devices, e-readers, and terminal applications that must reflow text across fixed-width lines. Responsive typography in CSS layout engines (when calculating line-break positions for text wrapping) uses similar greedy character-advance with word-boundary retreat.",
    pitfalls: ["Append a trailing space to the sentence string so word boundaries align cleanly with modulo indexing.", "The character at start % len tells you if you are in the middle of a word (need to retreat) or at a boundary (safe to advance)."],
  },
  {
    id: "strings-48",
    title: "Alien Dictionary",
    difficulty: "Hard",
    tags: ["String", "Graph", "Topological Sort"],
    statement: "Given a list of words sorted in a new alien language's dictionary order, derive the order of letters in that language. Return any valid ordering, or an empty string if no valid ordering exists.",
    examples: [
      { input: "words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]", output: "\"wertf\"" },
      { input: "words = [\"z\",\"x\"]", output: "\"zx\"" },
      { input: "words = [\"z\",\"x\",\"z\"]", output: "\"\"", explanation: "Cycle detected." },
    ],
    intuition: "Compare adjacent words to extract ordering constraints between characters (e.g. word[i] appears before word[i+1] if they first differ at some position). Then topologically sort those constraints.",
    approach: [
      "Build adjacency list and in-degree map from adjacent word comparisons.",
      "For each adjacent pair, find the first differing character — that gives an edge.",
      "If a longer word is a prefix of a shorter one, return '' (invalid).",
      "Topological sort using BFS (Kahn's algorithm), return '' if a cycle is detected.",
    ],
    solution: `function alienOrder(words) {
  const adj = {}, inDeg = {};
  for (const w of words) for (const c of w) { adj[c] = adj[c] || new Set(); inDeg[c] = inDeg[c] || 0; }
  for (let i = 0; i < words.length - 1; i++) {
    const [w1, w2] = [words[i], words[i + 1]];
    if (w1.length > w2.length && w1.startsWith(w2)) return "";
    for (let j = 0; j < Math.min(w1.length, w2.length); j++) {
      if (w1[j] !== w2[j]) {
        if (!adj[w1[j]].has(w2[j])) { adj[w1[j]].add(w2[j]); inDeg[w2[j]]++; }
        break;
      }
    }
  }
  const queue = Object.keys(inDeg).filter(c => inDeg[c] === 0);
  let result = "";
  while (queue.length) {
    const c = queue.shift();
    result += c;
    for (const next of adj[c]) { if (--inDeg[next] === 0) queue.push(next); }
  }
  return result.length === Object.keys(inDeg).length ? result : "";
}`,
    language: "javascript",
    complexity: { time: "O(C)", space: "O(1)" },
    systemDesign: "Topological ordering of dependencies is fundamental in build systems (Make, Bazel, Gradle), database schema migration tools, and microservice deployment orchestrators that must deploy services in dependency order. Cycle detection in topological sort directly corresponds to detecting circular dependency errors in module graphs.",
    pitfalls: ["If a longer word precedes a shorter word and the shorter is a prefix of the longer, the ordering is invalid — return '' immediately.", "Only the first differing character between adjacent words contributes a constraint edge."],
  },
  {
    id: "strings-49",
    title: "Concatenated Words",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming", "Trie"],
    statement: "Given an array of strings words, return all the words that can be formed by concatenating at least two shorter words from the same list.",
    examples: [
      { input: "words = [\"cat\",\"cats\",\"catsdogcats\",\"dog\",\"dogcatsdog\",\"hippopotamuses\",\"rat\",\"ratcatdogcat\"]", output: "[\"catsdogcats\",\"dogcatsdog\",\"ratcatdogcat\"]" },
    ],
    intuition: "For each word, run a word-break check using the rest of the dictionary — if the word can be formed by combining at least two dictionary words, include it in the result.",
    approach: [
      "Build a Set of all words.",
      "For each word, run word-break DP requiring at least two component words (minParts >= 2).",
      "To enforce 'at least two', exclude the word itself from matching its own full length.",
    ],
    solution: `function findAllConcatenatedWordsInADict(words) {
  const wordSet = new Set(words);
  function canForm(word) {
    if (!word) return false;
    const dp = new Array(word.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= word.length; i++) {
      for (let j = 0; j < i; j++) {
        if (dp[j] && (i < word.length || j > 0) && wordSet.has(word.slice(j, i))) {
          dp[i] = true; break;
        }
      }
    }
    return dp[word.length];
  }
  return words.filter(canForm);
}`,
    language: "javascript",
    complexity: { time: "O(n * L²)", space: "O(n * L)" },
    systemDesign: "Concatenated word detection is used in natural language processing to identify compound words (like 'football' = 'foot' + 'ball') for tokenisation in languages that compound words freely. Search engine query parsers use similar dictionary-based decomposition to split unspaced queries into meaningful terms for better retrieval.",
    pitfalls: ["Require at least two components — a word cannot be formed from itself alone.", "The condition `(i < word.length || j > 0)` ensures the full word isn't matched as a single component at i=word.length, j=0."],
  },
  {
    id: "strings-50",
    title: "Minimum Number of Steps to Make Two Strings Anagram",
    difficulty: "Hard",
    tags: ["String", "Hashing", "Greedy"],
    statement: "Given two equal-length strings s and t, return the minimum number of steps to make t an anagram of s. In one step you can choose any character in t and replace it with any character.",
    examples: [
      { input: "s = \"bab\", t = \"aba\"", output: "1", explanation: "Replace 'b' with 'a' or 'a' with 'b' in t." },
      { input: "s = \"leetcode\", t = \"practice\"", output: "5" },
    ],
    intuition: "Count the frequency of each character in both strings. For each character where s has more occurrences than t, those characters need to be added to t — the total excess across all such characters is the answer.",
    approach: [
      "Build frequency maps for s and t.",
      "For each character in s's map: if count[s_char] > count[t_char], add the difference to the result.",
      "Return the total.",
    ],
    solution: `function minSteps(s, t) {
  const countS = new Array(26).fill(0);
  const countT = new Array(26).fill(0);
  const a = "a".charCodeAt(0);
  for (const c of s) countS[c.charCodeAt(0) - a]++;
  for (const c of t) countT[c.charCodeAt(0) - a]++;
  let steps = 0;
  for (let i = 0; i < 26; i++) {
    if (countS[i] > countT[i]) steps += countS[i] - countT[i];
  }
  return steps;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Minimum-edit-to-anagram models content-normalisation cost in data migration pipelines — when migrating a column of strings to a canonical form (e.g. normalising tags), you count how many character substitutions are needed across the dataset. This frequency-difference approach is also used in A/B testing to measure vocabulary drift between two text corpora.",
    pitfalls: ["Only count the excess in one direction (s > t) — each excess in s requires one replacement in t.", "The strings must be equal length; if they are not, the problem requires insertions/deletions too."],
  },
];
