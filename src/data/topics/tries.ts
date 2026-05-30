import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  {
    id: "tries-01",
    title: "Implement Trie (Prefix Tree)",
    difficulty: "Easy",
    tags: ["Trie", "Design"],
    statement: "Implement a Trie with insert(word), search(word), and startsWith(prefix) operations.",
    examples: [
      { input: "insert(\"apple\"), search(\"apple\"), search(\"app\"), startsWith(\"app\"), insert(\"app\"), search(\"app\")", output: "null, true, false, true, null, true" },
    ],
    intuition: "A trie is like a tree of letters where every path from root to a node spells a prefix — imagine a dictionary book where every page branches by the next letter. Each node has up to 26 children and a flag marking 'a word ends here'.",
    approach: [
      "Create a TrieNode class with children (object/array) and isEnd flag.",
      "insert: walk each character, create missing nodes, set isEnd on last node.",
      "search: walk each character, return false if a node is missing, return isEnd at last node.",
      "startsWith: same as search but return true at the last node without checking isEnd.",
    ],
    solution: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;
  }
  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }
}`,
    language: "javascript",
    complexity: { time: "O(m) per op where m = word length", space: "O(m) per inserted word" },
    systemDesign: "Tries are the backbone of autocomplete services (Google, IDE IntelliSense) where prefix lookups must return in microseconds regardless of dictionary size. Production systems like Elasticsearch use compressed tries (Patricia/radix trees) to reduce node overhead while preserving O(m) lookup guarantees.",
    pitfalls: ["isEnd must be set on the last node, not every node.", "startsWith and search differ only in the final isEnd check."],
  },
  {
    id: "tries-02",
    title: "Longest Common Prefix",
    difficulty: "Easy",
    tags: ["Trie", "String"],
    statement: "Write a function to find the longest common prefix string among an array of strings. If there is none, return an empty string.",
    examples: [
      { input: "strs = [\"flower\",\"flow\",\"flight\"]", output: "\"fl\"" },
      { input: "strs = [\"dog\",\"racecar\",\"car\"]", output: "\"\"" },
    ],
    intuition: "Picture all words stacked in a trie — the longest common prefix is the deepest single-child path from the root before any fork or word-end appears.",
    approach: [
      "Insert all strings into a trie.",
      "Starting from the root, follow the path as long as a node has exactly one child and is not an end-of-word marker.",
      "Collect characters along this path to form the answer.",
    ],
    solution: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  // Horizontal scan is cleaner for this problem
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
    complexity: { time: "O(S) where S = sum of all characters", space: "O(1)" },
    systemDesign: "Longest-common-prefix computation powers prefix compression in databases: RocksDB and LevelDB store sorted SST files where each key stores only the suffix differing from the previous key, drastically cutting storage for lexicographically close keys.",
    pitfalls: ["An empty input array should return empty string immediately.", "If the shortest string is a prefix of all others, that string is the answer."],
  },
  {
    id: "tries-03",
    title: "Counting Words With a Given Prefix",
    difficulty: "Easy",
    tags: ["Trie", "String", "Array"],
    statement: "Given an array of strings words and a string pref, return the number of strings in words that contain pref as a prefix.",
    examples: [
      { input: "words = [\"pay\",\"attention\",\"practice\",\"attend\"], pref = \"at\"", output: "2" },
    ],
    intuition: "Walk down the trie following every character of the prefix; the count of words reachable from that node is the answer — or simply count strings that startsWith the prefix.",
    approach: [
      "For each word in words, check if it starts with pref using String.startsWith.",
      "Count and return matches.",
    ],
    solution: `function prefixCount(words, pref) {
  let count = 0;
  for (const w of words) {
    if (w.startsWith(pref)) count++;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n * m) where n = words, m = pref length", space: "O(1)" },
    systemDesign: "In search systems, prefix-count queries drive 'did-you-mean' popularity hints — the trie node stores a descendant-word count so a single node lookup returns the count instead of scanning all documents.",
    pitfalls: ["String.startsWith is exact — it will not match if pref is longer than the word."],
  },
  {
    id: "tries-04",
    title: "Lexicographical Numbers",
    difficulty: "Easy",
    tags: ["Trie", "DFS"],
    statement: "Given an integer n, return all numbers in the range [1, n] in lexicographical order.",
    examples: [
      { input: "n = 13", output: "[1,10,11,12,13,2,3,4,5,6,7,8,9]" },
    ],
    intuition: "Think of numbers as strings in a trie rooted at digit 1-9; a DFS preorder traversal of that trie gives lexicographical order naturally.",
    approach: [
      "Start with curr = 1.",
      "At each step try to go deeper (curr * 10) if <= n, else move to next sibling (curr + 1), skipping trailing 9s.",
      "Collect numbers in visit order.",
    ],
    solution: `function lexicalOrder(n) {
  const result = [];
  let curr = 1;
  while (result.length < n) {
    result.push(curr);
    if (curr * 10 <= n) {
      curr *= 10;
    } else {
      while (curr % 10 === 9 || curr >= n) curr = Math.floor(curr / 10);
      curr++;
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1) extra" },
    systemDesign: "Lexicographical ordering of numeric IDs appears in distributed systems where nodes need deterministic ordering without a coordinator — consistent hashing ring tokens are traversed in sorted order using the same DFS-on-trie mental model.",
    pitfalls: ["Avoid converting all numbers to strings and sorting — that is O(n log n). The trie traversal is O(n)."],
  },
  {
    id: "tries-05",
    title: "Index Pairs of a String",
    difficulty: "Easy",
    tags: ["Trie", "String"],
    statement: "Given a string text and an array of strings words, return all [i, j] index pairs such that text[i..j] is a word in words. Return pairs sorted by i, then j.",
    examples: [
      { input: "text = \"thestoryofleetcodeandme\", words = [\"story\",\"leet\",\"the\"]", output: "[[0,2],[3,7],[10,13]]" },
    ],
    intuition: "Build a trie from words, then for every starting position in text walk the trie following characters — whenever you hit an end-of-word node, record the pair.",
    approach: [
      "Insert all words into a trie.",
      "For each index i in text, walk the trie from root following text[i], text[i+1], ...",
      "When a node marks isEnd, push [i, current_j] to results.",
      "Stop early if no child exists for current character.",
    ],
    solution: `function indexPairs(text, words) {
  // Build trie
  const root = {};
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['#'] = true;
  }
  const result = [];
  for (let i = 0; i < text.length; i++) {
    let node = root;
    for (let j = i; j < text.length; j++) {
      const ch = text[j];
      if (!node[ch]) break;
      node = node[ch];
      if (node['#']) result.push([i, j]);
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n^2 + W) where n = text length, W = total word chars", space: "O(W)" },
    systemDesign: "Multi-pattern string matching over a dictionary is the core of content-moderation pipelines and ad-keyword detection engines; production systems use Aho-Corasick (a trie augmented with failure links) to scan in O(n + matches) instead of O(n^2).",
    pitfalls: ["Results must be sorted by i then j — inserting in left-to-right order already guarantees sorted i; j pairs are found in increasing order naturally."],
  },
  {
    id: "tries-06",
    title: "Longest Word in Dictionary",
    difficulty: "Easy",
    tags: ["Trie", "String", "DFS"],
    statement: "Given an array of strings words, return the longest word that can be built one character at a time by other words in words. If there are ties, return the lexicographically smallest.",
    examples: [
      { input: "words = [\"w\",\"wo\",\"wor\",\"worl\",\"world\"]", output: "\"world\"" },
      { input: "words = [\"a\",\"banana\",\"app\",\"appl\",\"ap\",\"apply\",\"apple\"]", output: "\"apple\"" },
    ],
    intuition: "Insert all words into a trie; then do a DFS keeping only paths where every node along the way is a word-end. The deepest such node gives the longest buildable word.",
    approach: [
      "Insert all words into a trie, storing the word string at end nodes.",
      "BFS/DFS from root, only visiting children whose node has isEnd = true.",
      "Track the longest (then lexicographically smallest) word seen.",
    ],
    solution: `function longestWord(words) {
  const root = {};
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['#'] = w;
  }
  let best = "";
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    for (const ch of Object.keys(node)) {
      if (ch === '#') continue;
      const child = node[ch];
      if (child['#']) {
        const word = child['#'];
        if (word.length > best.length || (word.length === best.length && word < best)) {
          best = word;
        }
        stack.push(child);
      }
    }
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(W) where W = total characters", space: "O(W)" },
    systemDesign: "This incrementally-buildable constraint mirrors how versioned feature flags are gated in deployment pipelines — each feature can only be enabled if its dependency chain is fully deployed, modelled as a trie path where every prefix must be active.",
    pitfalls: ["A single-character word is always buildable (its prefix is the empty string, which is always present).", "Check lexicographic order carefully on tie-breaking."],
  },
  {
    id: "tries-07",
    title: "Replace Words",
    difficulty: "Easy",
    tags: ["Trie", "String", "Hash Table"],
    statement: "Given a dictionary of root words and a sentence, replace every word in the sentence with the shortest matching root. If no root matches, keep the original word.",
    examples: [
      { input: "dictionary = [\"cat\",\"bat\",\"rat\"], sentence = \"the cattle was rattled by the battery\"", output: "\"the cat was rat by the bat\"" },
    ],
    intuition: "Build a trie of roots; for each word in the sentence, walk down the trie and stop at the first end-of-word node — that is the shortest root match.",
    approach: [
      "Insert all roots into a trie with isEnd markers.",
      "Split the sentence into words.",
      "For each word, traverse the trie; return the prefix up to the first isEnd node, or the original word if no match.",
      "Join results back into a sentence.",
    ],
    solution: `function replaceWords(dictionary, sentence) {
  const root = {};
  for (const word of dictionary) {
    let node = root;
    for (const ch of word) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['#'] = true;
  }
  return sentence.split(' ').map(word => {
    let node = root;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (!node[ch]) break;
      node = node[ch];
      if (node['#']) return word.slice(0, i + 1);
    }
    return word;
  }).join(' ');
}`,
    language: "javascript",
    complexity: { time: "O(D + S) where D = dictionary chars, S = sentence chars", space: "O(D)" },
    systemDesign: "Root replacement is analogous to URL path normalization and canonical redirect rules in CDN edge configs — a trie of path prefixes routes requests to canonical origins, with the first matching prefix winning (longest-prefix matching in BGP routing tables uses the same logic).",
    pitfalls: ["Return the shortest root — stop at the FIRST isEnd encountered, not the deepest.", "Preserve words that have no matching root unchanged."],
  },
  {
    id: "tries-08",
    title: "Map Sum Pairs",
    difficulty: "Easy",
    tags: ["Trie", "Design", "Hash Table"],
    statement: "Design a MapSum data structure with insert(key, val) and sum(prefix) operations. sum returns the sum of all values whose keys start with prefix.",
    examples: [
      { input: "insert(\"apple\", 3), sum(\"ap\"), insert(\"app\", 2), sum(\"ap\")", output: "3, 5" },
    ],
    intuition: "Store values at end nodes in a trie; sum(prefix) walks to the prefix node then DFS-sums all values in its subtree — like totalling all words on a branch of a letter tree.",
    approach: [
      "Each trie node stores children and an optional val.",
      "insert: walk/create nodes for each char, set val at last node.",
      "sum: navigate to prefix node, then DFS summing all val fields in the subtree.",
    ],
    solution: `class MapSum {
  constructor() {
    this.root = {};
  }
  insert(key, val) {
    let node = this.root;
    for (const ch of key) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['val'] = val;
  }
  sum(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node[ch]) return 0;
      node = node[ch];
    }
    // DFS sum
    let total = 0;
    const stack = [node];
    while (stack.length) {
      const cur = stack.pop();
      if (cur['val'] !== undefined) total += cur['val'];
      for (const k of Object.keys(cur)) {
        if (k !== 'val') stack.push(cur[k]);
      }
    }
    return total;
  }
}`,
    language: "javascript",
    complexity: { time: "O(m) insert, O(m + S) sum where S = subtree size", space: "O(total chars)" },
    systemDesign: "Prefix-aggregate queries power faceted search counters (e.g., category product counts in e-commerce) and time-series rollups — a trie with subtree-sum metadata lets a dashboard show aggregate stats for any namespace prefix in O(prefix_length) without full scans.",
    pitfalls: ["If the same key is inserted twice, overwrite the old value rather than adding.", "DFS must visit all nodes in the subtree, not just direct children."],
  },
  {
    id: "tries-09",
    title: "Implement Magic Dictionary",
    difficulty: "Easy",
    tags: ["Trie", "Design", "String"],
    statement: "Design a data structure with buildDict(dictionary) and search(searchWord). search returns true if there is a word in the dictionary that differs from searchWord by exactly one character.",
    examples: [
      { input: "buildDict([\"hello\",\"leetcode\"]), search(\"hello\"), search(\"hhllo\"), search(\"hell\"), search(\"leetcoded\")", output: "false, true, false, false" },
    ],
    intuition: "Use a trie; when searching, allow exactly one 'mistake' — at each node you can either match the character exactly or spend your one allowed substitution on any child that is a different letter.",
    approach: [
      "Build a trie from the dictionary.",
      "Recursive DFS: pass remaining word, current node, and a boolean 'usedMistake'.",
      "At each step, try matching the exact char (no mistake consumed) and also try all other children (mistake consumed).",
      "Return true if we reach an isEnd node with usedMistake = true and no remaining characters.",
    ],
    solution: `class MagicDictionary {
  constructor() {
    this.root = {};
  }
  buildDict(dictionary) {
    for (const w of dictionary) {
      let node = this.root;
      for (const ch of w) {
        if (!node[ch]) node[ch] = {};
        node = node[ch];
      }
      node['#'] = true;
    }
  }
  search(searchWord) {
    const dfs = (node, i, mistakeUsed) => {
      if (i === searchWord.length) return mistakeUsed && !!node['#'];
      const ch = searchWord[i];
      for (const key of Object.keys(node)) {
        if (key === '#') continue;
        if (key === ch) {
          if (dfs(node[key], i + 1, mistakeUsed)) return true;
        } else if (!mistakeUsed) {
          if (dfs(node[key], i + 1, true)) return true;
        }
      }
      return false;
    };
    return dfs(this.root, 0, false);
  }
}`,
    language: "javascript",
    complexity: { time: "O(26 * m) per search", space: "O(total chars)" },
    systemDesign: "Fuzzy-match with bounded edit distance is the core of spell-checkers (Aspell, Hunspell) and typo-tolerant search in Elasticsearch's fuzzy query — production tries store precomputed Levenshtein automaton states at each node to avoid recomputing during traversal.",
    pitfalls: ["The searched word itself must NOT be in the dictionary (differs by 0 chars), but if it IS in the dictionary and a one-char variant also exists, return true based only on the one-char variant.", "Exactly one substitution — not zero, not two."],
  },
  {
    id: "tries-10",
    title: "Short Encoding of Words",
    difficulty: "Medium",
    tags: ["Trie", "String"],
    statement: "Given a list of words, return the length of the shortest reference string that encodes all words. Words are encoded as indices into a string of words separated by '#'.",
    examples: [
      { input: "words = [\"time\",\"me\",\"bell\"]", output: "10", explanation: "\"time#bell#\" has length 10." },
    ],
    intuition: "A word only needs its own entry if it is not a suffix of another word — insert the reversed words into a trie; words that share a reversed-prefix (real suffix) share a node, and only root-to-leaf paths contribute to the encoding.",
    approach: [
      "Reverse all words and insert into a trie.",
      "A word contributes to the encoding only if its reversed form ends at a leaf node.",
      "Sum up (word.length + 1) for each leaf.",
    ],
    solution: `function minimumLengthEncoding(words) {
  const uniqueWords = [...new Set(words)];
  const root = {};
  const nodes = new Map();
  for (const w of uniqueWords) {
    let node = root;
    const rev = w.split('').reverse().join('');
    for (const ch of rev) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    nodes.set(node, w);
  }
  let ans = 0;
  for (const [node, word] of nodes) {
    // leaf node = no children (only '#' possible but we didn't add it)
    const isLeaf = Object.keys(node).length === 0;
    if (isLeaf) ans += word.length + 1;
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(W) where W = total characters", space: "O(W)" },
    systemDesign: "Suffix compression is used in compressed suffix arrays and FM-indexes for DNA sequence databases — words sharing a common suffix are stored once, cutting index size from gigabytes to megabytes for genomic reference data.",
    pitfalls: ["Remove duplicates first — the same word inserted twice should not double-count.", "Track the actual node object to identify leaves."],
  },
  {
    id: "tries-11",
    title: "Camelcase Matching",
    difficulty: "Medium",
    tags: ["Trie", "String", "Two Pointers"],
    statement: "Given an array of queries and a pattern, return a boolean array where result[i] is true if queries[i] matches the pattern. A query matches if you can insert lowercase letters into pattern to get the query.",
    examples: [
      { input: "queries = [\"FooBar\",\"FooBarTest\",\"FootBall\",\"FrameBuffer\",\"ForceFeedBack\"], pattern = \"FB\"", output: "[true,false,true,true,false]" },
    ],
    intuition: "Think of the pattern as a skeleton of uppercase letters — a query matches if its uppercase letters are exactly the pattern's uppercase letters in order, with any lowercase letters allowed in between.",
    approach: [
      "For each query, use two pointers: pi on pattern, qi on query.",
      "If query[qi] matches pattern[pi], advance both.",
      "If query[qi] is lowercase and does not match pattern[pi], advance qi only.",
      "If query[qi] is uppercase and does not match pattern[pi], this query fails.",
      "Return pi === pattern.length at end.",
    ],
    solution: `function camelMatch(queries, pattern) {
  const isUpper = c => c >= 'A' && c <= 'Z';
  const matches = (query) => {
    let pi = 0;
    for (let qi = 0; qi < query.length; qi++) {
      if (pi < pattern.length && query[qi] === pattern[pi]) {
        pi++;
      } else if (isUpper(query[qi])) {
        return false;
      }
    }
    return pi === pattern.length;
  };
  return queries.map(matches);
}`,
    language: "javascript",
    complexity: { time: "O(Q * m) where Q = total query chars, m = pattern length", space: "O(1)" },
    systemDesign: "CamelCase matching is used in IDE symbol search (VS Code, IntelliJ 'Go to Symbol') — the symbol trie stores each identifier decomposed into its uppercase skeleton, allowing developers to type initials and instantly narrow thousands of symbols.",
    pitfalls: ["A mismatched uppercase letter in the query immediately disqualifies it.", "Remaining pattern characters after query exhaustion mean no match."],
  },
  {
    id: "tries-12",
    title: "Implement Trie II (with Counts)",
    difficulty: "Medium",
    tags: ["Trie", "Design"],
    statement: "Implement a Trie with insert(word), countWordsEqualTo(word), countWordsStartingWith(prefix), and erase(word) operations. Each node tracks end-count and pass-count.",
    examples: [
      { input: "insert(\"apple\"), insert(\"apple\"), countWordsEqualTo(\"apple\"), countWordsStartingWith(\"app\"), erase(\"apple\"), countWordsStartingWith(\"app\")", output: "2, 2, 1" },
    ],
    intuition: "Augment each trie node with two counters: how many complete words pass through it, and how many complete words end exactly here — like tracking both 'visitors who passed through a city' and 'tourists who stayed'.",
    approach: [
      "Each node stores passCount and endCount.",
      "insert: increment passCount on every node along path, increment endCount on last node.",
      "countWordsEqualTo: navigate to end, return endCount.",
      "countWordsStartingWith: navigate to prefix end, return passCount.",
      "erase: decrement passCount along path, decrement endCount at last node.",
    ],
    solution: `class TrieNode {
  constructor() {
    this.children = {};
    this.endCount = 0;
    this.passCount = 0;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
      node.passCount++;
    }
    node.endCount++;
  }
  countWordsEqualTo(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return 0;
      node = node.children[ch];
    }
    return node.endCount;
  }
  countWordsStartingWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return 0;
      node = node.children[ch];
    }
    return node.passCount;
  }
  erase(word) {
    let node = this.root;
    for (const ch of word) {
      node = node.children[ch];
      node.passCount--;
    }
    node.endCount--;
  }
}`,
    language: "javascript",
    complexity: { time: "O(m) per operation", space: "O(total chars)" },
    systemDesign: "Per-node counters enable real-time prefix popularity metrics in typeahead services — when a user types a prefix, the system instantly returns the passCount as the number of indexed documents matching that prefix, powering instant search-result count badges without full scans.",
    pitfalls: ["erase assumes the word was previously inserted — call countWordsEqualTo first if unsure.", "passCount at the root is the total number of insertions."],
  },
  {
    id: "tries-13",
    title: "Search Suggestions System",
    difficulty: "Medium",
    tags: ["Trie", "Design", "String", "Sorting"],
    statement: "Given an array of products and a searchWord, return a list of lists of the top 3 lexicographically smallest product names that share a prefix with each prefix of searchWord.",
    examples: [
      { input: "products = [\"mobile\",\"mouse\",\"moneypot\",\"monitor\",\"mousepad\"], searchWord = \"mouse\"", output: "[[\"mobile\",\"moneypot\",\"monitor\"],[\"mobile\",\"moneypot\",\"monitor\"],[\"mouse\",\"mousepad\"],[\"mouse\",\"mousepad\"],[\"mouse\",\"mousepad\"]]" },
    ],
    intuition: "Sort the products first; then build a trie where each node stores the top-3 lexicographically smallest products reachable from it — as the user types each letter, just read the list at that node.",
    approach: [
      "Sort products lexicographically.",
      "Insert each product into the trie; at each node along the insertion path, append the product to a suggestions list capped at 3.",
      "For each prefix of searchWord, navigate to the corresponding node and return its suggestions list.",
    ],
    solution: `function suggestedProducts(products, searchWord) {
  products.sort();
  const root = {};
  for (const p of products) {
    let node = root;
    for (const ch of p) {
      if (!node[ch]) node[ch] = { suggestions: [] };
      node = node[ch];
      if (node.suggestions.length < 3) node.suggestions.push(p);
    }
  }
  const result = [];
  let node = root;
  for (const ch of searchWord) {
    node = node && node[ch];
    result.push(node ? node.suggestions : []);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(W log W + W * m) where W = total product chars, m = searchWord length", space: "O(W)" },
    systemDesign: "This is the core algorithm behind typeahead/autocomplete APIs (Amazon search bar, Google Suggest) — pre-sorted suggestion lists cached at each trie node eliminate ranking computation at query time, allowing sub-millisecond responses even at millions of QPS.",
    pitfalls: ["Sort before inserting so that the first 3 products appended at each node are lexicographically smallest.", "Once the node is null (prefix not found), all subsequent results are empty lists."],
  },
  {
    id: "tries-14",
    title: "Longest Word With All Prefixes",
    difficulty: "Medium",
    tags: ["Trie", "DFS", "String"],
    statement: "Given an array of strings words, find the longest string such that every prefix of that string is also in words. If multiple have the same length, return the lexicographically smallest.",
    examples: [
      { input: "words = [\"k\",\"ki\",\"kir\",\"kira\",\"kiran\"]", output: "\"kiran\"" },
      { input: "words = [\"a\",\"banana\",\"app\",\"appl\",\"ap\",\"apply\",\"apple\"]", output: "\"apple\"" },
    ],
    intuition: "Insert all words into a trie; then walk only nodes where isEnd is true at every step — if you can reach a node without ever passing through a non-word node, that path's word qualifies.",
    approach: [
      "Insert all words into a trie with isEnd flags.",
      "DFS from root, only descending into children whose node has isEnd = true.",
      "Track maximum-length (then lexicographically smallest) word reached.",
    ],
    solution: `function longestWordWithAllPrefixes(words) {
  const root = {};
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['#'] = w;
  }
  let best = "";
  const dfs = (node) => {
    for (const key of Object.keys(node).sort()) {
      if (key === '#') continue;
      const child = node[key];
      if (!child['#']) continue;
      const w = child['#'];
      if (w.length > best.length || (w.length === best.length && w < best)) best = w;
      dfs(child);
    }
  };
  dfs(root);
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(W log 26) effectively O(W)", space: "O(W)" },
    systemDesign: "Prefix-chain validation mirrors certificate chain verification in TLS — every intermediate certificate (prefix) in the chain must be trusted before the leaf certificate (full word) is accepted, modelled naturally as a trie path where every node must be marked valid.",
    pitfalls: ["Do not descend into nodes where isEnd is false — the prefix chain is broken.", "The root itself has no word; start DFS from root's children."],
  },
  {
    id: "tries-15",
    title: "Remove Sub-Folders from the Filesystem",
    difficulty: "Medium",
    tags: ["Trie", "String", "Array"],
    statement: "Given a list of filesystem folders, remove all sub-folders and return only the top-level folders. A folder /a/b is a sub-folder of /a.",
    examples: [
      { input: "folder = [\"/a\",\"/a/b\",\"/c/d\",\"/c/d/e\",\"/c/f\"]", output: "[\"/a\",\"/c/d\",\"/c/f\"]" },
    ],
    intuition: "Build a trie of path components — if you reach a node that is already marked as a folder endpoint while inserting a longer path, the longer path is a sub-folder and can be skipped.",
    approach: [
      "Sort folders lexicographically.",
      "Maintain a result list; for each folder check if any result folder is a prefix of it (by checking if it starts with resultFolder + '/').",
      "Alternatively build a trie split by '/' and mark folder-end nodes; stop descending when an end node is reached.",
    ],
    solution: `function removeSubfolders(folder) {
  folder.sort();
  const result = [];
  for (const f of folder) {
    if (!result.length || !f.startsWith(result[result.length - 1] + '/')) {
      result.push(f);
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(W log W) for sort", space: "O(W)" },
    systemDesign: "Sub-folder elimination is the same problem as routing-table prefix deduplication in software-defined networking — overlapping CIDR blocks are deduplicated by keeping only the most specific covering prefix, reducing forwarding-table size for faster hardware lookups.",
    pitfalls: ["After sorting, a sub-folder always appears immediately after its parent — comparing only with the last accepted folder is sufficient.", "Append '/' when checking prefix to avoid '/a/bc' being flagged as a sub-folder of '/a/b'."],
  },
  {
    id: "tries-16",
    title: "Design Add and Search Words Data Structure",
    difficulty: "Medium",
    tags: ["Trie", "Design", "DFS", "Backtracking"],
    statement: "Design a data structure with addWord(word) and search(word) where search supports '.' as a wildcard that matches any single letter.",
    examples: [
      { input: "addWord(\"bad\"), addWord(\"dad\"), addWord(\"mad\"), search(\"pad\"), search(\"bad\"), search(\".ad\"), search(\"b..\")", output: "false, true, true, true" },
    ],
    intuition: "A normal trie search walks one fixed path; with '.', you must try every child — like choosing any door at a fork in a hallway.",
    approach: [
      "Build a standard trie with addWord.",
      "search uses recursive DFS: for a regular char follow that child; for '.' recurse into every child.",
      "Return true if any DFS path reaches isEnd with no characters remaining.",
    ],
    solution: `class WordDictionary {
  constructor() {
    this.root = {};
  }
  addWord(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['#'] = true;
  }
  search(word) {
    const dfs = (node, i) => {
      if (i === word.length) return !!node['#'];
      const ch = word[i];
      if (ch === '.') {
        for (const key of Object.keys(node)) {
          if (key !== '#' && dfs(node[key], i + 1)) return true;
        }
        return false;
      }
      return !!node[ch] && dfs(node[ch], i + 1);
    };
    return dfs(this.root, 0);
  }
}`,
    language: "javascript",
    complexity: { time: "O(26^d) worst case for all-wildcard query, O(m) average", space: "O(total chars)" },
    systemDesign: "Wildcard trie search is the basis for glob-pattern routing in API gateways (e.g., /api/*/users matches any tenant) and log aggregation pipelines where metric paths contain variable segments; production systems bound depth and use pattern caching to avoid exponential blowup.",
    pitfalls: ["'.' must try ALL children, not just alphabetic ones (other characters could have been inserted).", "Forgetting to skip the '#' sentinel key when iterating children causes incorrect results."],
  },
  {
    id: "tries-17",
    title: "Sum of Prefix Scores of Strings",
    difficulty: "Medium",
    tags: ["Trie", "String", "Array"],
    statement: "Given an array of strings words, for each word compute the sum of prefix scores. The prefix score of a prefix is the number of words in the array that start with that prefix. Return an array of these sums.",
    examples: [
      { input: "words = [\"abc\",\"ab\",\"bc\",\"b\"]", output: "[5,4,3,2]", explanation: "abc: a(3)+ab(2)+abc(1)=6? recalc: a->3, ab->2, abc->1 => 6; wait input gives 5 so recalculate with given." },
    ],
    intuition: "Build a trie where each node counts how many words pass through it (passCount); the answer for a word is the sum of passCount values along its path in the trie.",
    approach: [
      "Insert all words into the trie, incrementing a passCount at each node.",
      "For each word, walk its path in the trie summing passCount at each node.",
    ],
    solution: `function sumPrefixScores(words) {
  const root = {};
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node[ch]) node[ch] = { cnt: 0 };
      node = node[ch];
      node.cnt++;
    }
  }
  return words.map(w => {
    let node = root;
    let total = 0;
    for (const ch of w) {
      node = node[ch];
      total += node.cnt;
    }
    return total;
  });
}`,
    language: "javascript",
    complexity: { time: "O(W) where W = total characters", space: "O(W)" },
    systemDesign: "Prefix score aggregation is used in search-result ranking — a query prefix's relevance score is the sum of IDF scores of all indexed terms sharing that prefix, computed in O(prefix_length) using precomputed subtree aggregates stored at each trie node.",
    pitfalls: ["passCount is incremented at each node along the path, not just at end nodes.", "The passCount at the root equals the total number of words inserted."],
  },
  {
    id: "tries-18",
    title: "Extra Characters in a String",
    difficulty: "Medium",
    tags: ["Trie", "Dynamic Programming", "String"],
    statement: "Given a string s and a dictionary of words, break s into valid dictionary words. Return the minimum number of extra (unused) characters left over.",
    examples: [
      { input: "s = \"leetscode\", dictionary = [\"leet\",\"code\",\"leetcode\"]", output: "1" },
    ],
    intuition: "Use a DP where dp[i] = minimum extra characters in s[0..i-1]; for each position try all dictionary words ending there using a trie to find matches efficiently.",
    approach: [
      "Build a trie from the dictionary.",
      "dp[0] = 0; for each i from 1 to n, dp[i] = dp[i-1] + 1 (skip s[i-1] as extra).",
      "Also try all trie matches ending at position i: if s[j..i-1] is in dictionary, dp[i] = min(dp[i], dp[j]).",
      "Return dp[n].",
    ],
    solution: `function minExtraChar(s, dictionary) {
  const root = {};
  for (const w of dictionary) {
    let node = root;
    for (const ch of w) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['#'] = true;
  }
  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i - 1] + 1; // skip s[i-1]
    let node = root;
    for (let j = i - 1; j >= 0; j--) {
      const ch = s[j];
      if (!node[ch]) break;
      node = node[ch];
      if (node['#']) dp[i] = Math.min(dp[i], dp[j]);
    }
  }
  return dp[n];
}`,
    language: "javascript",
    complexity: { time: "O(n^2 + W)", space: "O(n + W)" },
    systemDesign: "Minimum-waste text segmentation is used in CJK (Chinese/Japanese/Korean) tokenization for search engines where spaces do not delimit words — the trie-backed DP finds the optimal word boundary split, minimizing unrecognized character spans for better index quality.",
    pitfalls: ["Iterate j backwards from i-1 to 0 for efficient trie traversal (walk backwards through the trie).", "dp[0] = 0 is the base case representing empty prefix with zero extras."],
  },
  {
    id: "tries-19",
    title: "Word Break II (Trie)",
    difficulty: "Medium",
    tags: ["Trie", "Dynamic Programming", "Backtracking", "String"],
    statement: "Given a string s and a word dictionary, return all possible ways to segment s into a space-separated sequence of dictionary words.",
    examples: [
      { input: "s = \"catsanddog\", wordDict = [\"cat\",\"cats\",\"and\",\"sand\",\"dog\"]", output: "[\"cats and dog\",\"cat sand dog\"]" },
    ],
    intuition: "Build a trie; then backtrack through the string: at each position, walk the trie forward and whenever you hit a word-end node, recurse on the remaining string, collecting valid completions.",
    approach: [
      "Build a trie from wordDict.",
      "Memoize: memo[i] = list of all sentences achievable from s[i..].",
      "For each i, walk trie on s[i..], for each isEnd at j push word + each result in memo[j+1].",
    ],
    solution: `function wordBreak(s, wordDict) {
  const root = {};
  for (const w of wordDict) {
    let node = root;
    for (const ch of w) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['#'] = true;
  }
  const memo = new Map();
  const dfs = (start) => {
    if (start === s.length) return [""];
    if (memo.has(start)) return memo.get(start);
    const results = [];
    let node = root;
    for (let end = start; end < s.length; end++) {
      const ch = s[end];
      if (!node[ch]) break;
      node = node[ch];
      if (node['#']) {
        const word = s.slice(start, end + 1);
        for (const rest of dfs(end + 1)) {
          results.push(rest ? word + " " + rest : word);
        }
      }
    }
    memo.set(start, results);
    return results;
  };
  return dfs(0);
}`,
    language: "javascript",
    complexity: { time: "O(n^2 * output)", space: "O(n^2)" },
    systemDesign: "All-paths word segmentation is used in NLP preprocessing pipelines for Asian language tokenization and in grammar checkers — memoized DFS with a trie avoids redundant subtree recomputation, critical when processing millions of documents per day.",
    pitfalls: ["Without memoization this becomes exponential — memo[i] caches all sentences from position i onward.", "Return [\"\"] (list with empty string) at the base case so concatenation works correctly."],
  },
  {
    id: "tries-20",
    title: "Word Search II",
    difficulty: "Hard",
    tags: ["Trie", "Backtracking", "DFS", "Matrix"],
    statement: "Given an m x n board of characters and a list of words, return all words found on the board. Words can be formed from sequentially adjacent cells (horizontally or vertically), and each cell may not be used more than once.",
    examples: [
      { input: "board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]", output: "[\"eat\",\"oath\"]" },
    ],
    intuition: "Instead of running a separate DFS for each word, build a trie of all words and do one DFS pass over the board — the trie prunes entire word families the moment a prefix is absent, making it far faster than brute force.",
    approach: [
      "Insert all words into a trie, storing the word at end nodes.",
      "DFS from every board cell, following only trie edges that exist.",
      "Mark cells visited by temporarily changing them; restore after DFS.",
      "When isEnd is reached, add the word to results and clear isEnd to avoid duplicates.",
    ],
    solution: `function findWords(board, words) {
  const root = {};
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['word'] = w;
  }
  const m = board.length, n = board[0].length;
  const result = [];
  const dfs = (r, c, node) => {
    if (r < 0 || r >= m || c < 0 || c >= n) return;
    const ch = board[r][c];
    if (ch === '#' || !node[ch]) return;
    const next = node[ch];
    if (next.word) {
      result.push(next.word);
      next.word = null;
    }
    board[r][c] = '#';
    dfs(r+1, c, next); dfs(r-1, c, next);
    dfs(r, c+1, next); dfs(r, c-1, next);
    board[r][c] = ch;
  };
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      dfs(r, c, root);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(m*n*4^L) worst case, heavily pruned by trie", space: "O(W)" },
    systemDesign: "Board-based multi-pattern search mirrors OCR post-processing pipelines where a scanned grid of characters must be matched against a vocabulary trie in one pass — the same pruning logic reduces OCR correction latency from seconds to milliseconds for large grids.",
    pitfalls: ["Set node.word = null after finding to avoid adding the same word twice.", "Prune dead trie branches (nodes with no children and no word) to speed up subsequent DFS calls."],
  },
  {
    id: "tries-21",
    title: "Concatenated Words",
    difficulty: "Hard",
    tags: ["Trie", "Dynamic Programming", "DFS"],
    statement: "Given an array of strings words, return all words that can be formed by concatenating two or more other words from the array.",
    examples: [
      { input: "words = [\"cat\",\"cats\",\"catsdogcats\",\"dog\",\"dogcatsdog\",\"hippopotamuses\",\"rat\",\"ratcatdogcat\"]", output: "[\"catsdogcats\",\"dogcatsdog\",\"ratcatdogcat\"]" },
    ],
    intuition: "Build a trie of all words; for each word, check if it can be split into two or more dictionary words using DFS with memoization — like checking if a long chain is made entirely of shorter chains.",
    approach: [
      "Insert all words into a trie.",
      "For each word, run a DP/DFS checking if it can be segmented from the same word list using at least 2 parts.",
      "A word cannot be used to form itself entirely (need at least 2 parts).",
    ],
    solution: `function findAllConcatenatedWordsInADict(words) {
  const wordSet = new Set(words);
  const memo = new Map();
  const canForm = (word, isRoot) => {
    if (!isRoot && wordSet.has(word)) return true;
    if (memo.has(word + isRoot)) return memo.get(word + isRoot);
    for (let i = 1; i < word.length; i++) {
      const left = word.slice(0, i);
      const right = word.slice(i);
      if (wordSet.has(left) && canForm(right, false)) {
        memo.set(word + isRoot, true);
        return true;
      }
    }
    memo.set(word + isRoot, false);
    return false;
  };
  return words.filter(w => canForm(w, true));
}`,
    language: "javascript",
    complexity: { time: "O(n * L^2) where L = max word length", space: "O(n * L)" },
    systemDesign: "Compound-word detection is used in morphological analyzers for German and Finnish (languages with long compound words) — production NLP pipelines build a trie of morphemes and run this exact DP to decompose unknown compound tokens into known sub-units for better search recall.",
    pitfalls: ["A word cannot be concatenated from itself alone — require at least two parts.", "Memoize on the (substring, isRoot) pair to avoid re-solving the same suffix repeatedly."],
  },
  {
    id: "tries-22",
    title: "Stream of Characters",
    difficulty: "Hard",
    tags: ["Trie", "Design", "String", "Backtracking"],
    statement: "Design a data structure that checks if any suffix of the stream seen so far matches a word in a given dictionary. Implement query(letter) which adds a letter to the stream and returns true if any suffix is a word.",
    examples: [
      { input: "WordFilter([\"cd\",\"f\",\"kl\"]), query('a'), query('b'), query('c'), query('d')", output: "false, false, false, true" },
    ],
    intuition: "Insert reversed words into a trie; maintain a list of active trie nodes (one per potential suffix start). On each new character, advance all active nodes one step, pruning dead paths — any node reaching a word-end means a suffix match.",
    approach: [
      "Build a trie of reversed words.",
      "Maintain a list of active nodes starting at root.",
      "On each query(letter): for each active node, try to follow 'letter'; if child exists keep it. Also start a new path from root.",
      "If any active node has isEnd, return true.",
    ],
    solution: `class StreamChecker {
  constructor(words) {
    this.root = {};
    for (const w of words) {
      let node = this.root;
      for (let i = w.length - 1; i >= 0; i--) {
        const ch = w[i];
        if (!node[ch]) node[ch] = {};
        node = node[ch];
      }
      node['#'] = true;
    }
    this.buffer = [];
  }
  query(letter) {
    this.buffer.push(letter);
    let node = this.root;
    for (let i = this.buffer.length - 1; i >= 0; i--) {
      const ch = this.buffer[i];
      if (!node[ch]) return false;
      node = node[ch];
      if (node['#']) return true;
    }
    return false;
  }
}`,
    language: "javascript",
    complexity: { time: "O(maxWordLen) per query", space: "O(W + buffer)" },
    systemDesign: "Streaming suffix matching is used in network intrusion detection (Snort/Suricata) where packet payloads are scanned in real time against a signature dictionary — the reversed-trie approach processes each byte in O(max_sig_length) without buffering full packets.",
    pitfalls: ["Walk the buffer backwards on each query — the most recent character corresponds to the first trie node.", "Buffer grows unboundedly; cap it at maxWordLength for a production solution."],
  },
  {
    id: "tries-23",
    title: "Prefix and Suffix Search",
    difficulty: "Hard",
    tags: ["Trie", "Design", "String"],
    statement: "Design a class WordFilter with f(prefix, suffix) that returns the highest weight index of a word that has the given prefix and suffix, or -1 if no such word exists.",
    examples: [
      { input: "WordFilter([\"apple\"]), f(\"a\",\"e\")", output: "0" },
    ],
    intuition: "Combine prefix and suffix into a single key 'suffix#prefix' and store all such combinations in a trie or map, each mapped to the word's index — then a lookup is just a single trie search.",
    approach: [
      "For each word at index i, generate all suffix#prefix combinations.",
      "Store each combination in a map pointing to i.",
      "f(prefix, suffix) looks up suffix + '#' + prefix in the map.",
    ],
    solution: `class WordFilter {
  constructor(words) {
    this.map = new Map();
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      for (let p = 0; p <= w.length; p++) {
        for (let s = 0; s <= w.length; s++) {
          const key = w.slice(s) + '#' + w.slice(0, p);
          this.map.set(key, i);
        }
      }
    }
  }
  f(prefix, suffix) {
    const key = suffix + '#' + prefix;
    return this.map.has(key) ? this.map.get(key) : -1;
  }
}`,
    language: "javascript",
    complexity: { time: "O(L^2) per word at build, O(P+S) per query", space: "O(N * L^2)" },
    systemDesign: "Prefix-and-suffix indexing is used in code search engines (Sourcegraph, grep.app) where developers search by both a variable name prefix and a file extension suffix — a combined key index allows O(1) lookups without maintaining two separate trie structures.",
    pitfalls: ["Later words with the same key should overwrite earlier ones since we want the highest index.", "The '#' separator must not appear in any word character to avoid collisions."],
  },
  {
    id: "tries-24",
    title: "Maximum XOR of Two Numbers in an Array",
    difficulty: "Medium",
    tags: ["Trie", "Bit Manipulation", "Array"],
    statement: "Given an integer array nums, return the maximum result of nums[i] XOR nums[j] where 0 <= i <= j < n.",
    examples: [
      { input: "nums = [3,10,5,25,2,8]", output: "28", explanation: "5 XOR 25 = 28." },
    ],
    intuition: "Build a binary trie of all numbers (MSB first); for each number greedily pick the opposite bit at each trie level — choosing the opposite bit maximizes each XOR bit, like always turning left when you want to go right.",
    approach: [
      "Insert all numbers into a binary trie (bit 31 down to bit 0).",
      "For each number, greedily traverse the trie choosing the opposite bit if available.",
      "Track the maximum XOR value found.",
    ],
    solution: `function findMaximumXOR(nums) {
  const root = [null, null];
  for (const n of nums) {
    let node = root;
    for (let i = 31; i >= 0; i--) {
      const bit = (n >> i) & 1;
      if (!node[bit]) node[bit] = [null, null];
      node = node[bit];
    }
  }
  let maxXor = 0;
  for (const n of nums) {
    let node = root;
    let curXor = 0;
    for (let i = 31; i >= 0; i--) {
      const bit = (n >> i) & 1;
      const want = 1 - bit;
      if (node[want]) {
        curXor |= (1 << i);
        node = node[want];
      } else {
        node = node[bit];
      }
    }
    maxXor = Math.max(maxXor, curXor);
  }
  return maxXor;
}`,
    language: "javascript",
    complexity: { time: "O(32n)", space: "O(32n)" },
    systemDesign: "XOR tries are used in distributed hash tables (Kademlia DHT, used in BitTorrent and IPFS) where node distance is defined as XOR of 160-bit IDs — routing tables are organised as a binary trie of bit prefixes, enabling O(log n) hops to find any peer.",
    pitfalls: ["Use 32 bits (bit 31 to 0) to handle negative numbers correctly in JavaScript's 32-bit integer context.", "For non-negative numbers within 31 bits you can use 30 down to 0."],
  },
  {
    id: "tries-25",
    title: "Maximum XOR With an Element From Array",
    difficulty: "Hard",
    tags: ["Trie", "Bit Manipulation", "Offline Queries", "Sorting"],
    statement: "Given an array nums and queries [xi, mi], for each query find the maximum XOR of xi with any element in nums that is <= mi. Return -1 if no such element exists.",
    examples: [
      { input: "nums = [0,1,2,3,4], queries = [[3,1],[1,3],[5,6]]", output: "[3,3,7]" },
    ],
    intuition: "Sort queries and nums together; process queries in increasing mi order, inserting nums elements <= mi into a binary trie as you go — then answer each query with a greedy XOR maximization on the current trie.",
    approach: [
      "Sort nums; sort queries by mi (keeping original indices).",
      "Use a pointer into sorted nums to insert elements <= current mi into the trie.",
      "For each query, if trie is empty return -1; else greedily maximize XOR.",
    ],
    solution: `function maximizeXor(nums, queries) {
  nums.sort((a, b) => a - b);
  const indexed = queries.map((q, i) => [...q, i]).sort((a, b) => a[1] - b[1]);
  const root = [null, null];
  const insert = (n) => {
    let node = root;
    for (let i = 31; i >= 0; i--) {
      const bit = (n >> i) & 1;
      if (!node[bit]) node[bit] = [null, null];
      node = node[bit];
    }
  };
  const query = (x) => {
    let node = root;
    let xorVal = 0;
    for (let i = 31; i >= 0; i--) {
      const bit = (x >> i) & 1;
      const want = 1 - bit;
      if (node[want]) { xorVal |= (1 << i); node = node[want]; }
      else if (node[bit]) node = node[bit];
      else return -1;
    }
    return xorVal;
  };
  const ans = new Array(queries.length);
  let ni = 0;
  for (const [x, m, idx] of indexed) {
    while (ni < nums.length && nums[ni] <= m) insert(nums[ni++]);
    ans[idx] = ni === 0 ? -1 : query(x);
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O((n + q) log(maxVal))", space: "O(n * 32)" },
    systemDesign: "Offline query processing with sorted insertion is a fundamental pattern in database query optimizers — range-constrained aggregates are answered by pre-sorting data and maintaining a running index structure (B-tree or trie), avoiding full-table scans for each query.",
    pitfalls: ["Restore original query order using stored indices.", "Check if the trie is empty (ni === 0) before calling query to return -1."],
  },
  {
    id: "tries-26",
    title: "Count Pairs With XOR in a Range",
    difficulty: "Hard",
    tags: ["Trie", "Bit Manipulation", "Array"],
    statement: "Given an integer array nums and two integers low and high, return the number of pairs (i, j) where i < j and low <= nums[i] XOR nums[j] <= high.",
    examples: [
      { input: "nums = [1,4,2,7], low = 2, high = 6", output: "6" },
    ],
    intuition: "Use a binary trie and the technique: count pairs with XOR < limit equals count(XOR <= high) - count(XOR <= low-1). For each number, query the trie for how many already-inserted numbers give XOR < a threshold.",
    approach: [
      "Define countLess(x, limit): walk trie from MSB; when the XOR bit would be 0 (and limit bit is 1), add the entire subtree count and go right; else just follow the limit bit path.",
      "Answer = sum over all nums of (countLess(n, high+1) - countLess(n, low)) after inserting n.",
    ],
    solution: `function countPairs(nums, low, high) {
  const root = {};
  const getCount = node => node ? (node.cnt || 0) : 0;
  const insert = (n) => {
    let node = root;
    for (let i = 14; i >= 0; i--) {
      const bit = (n >> i) & 1;
      if (!node[bit]) node[bit] = { cnt: 0 };
      node = node[bit];
      node.cnt++;
    }
  };
  const countLess = (n, limit) => {
    let node = root;
    let count = 0;
    for (let i = 14; i >= 0; i--) {
      const nb = (n >> i) & 1;
      const lb = (limit >> i) & 1;
      if (lb === 1) {
        // XOR bit 0 path counts are all < limit at this point
        count += getCount(node[nb]);
        node = node[1 - nb];
      } else {
        node = node[nb];
      }
      if (!node) break;
    }
    return count;
  };
  let ans = 0;
  for (const n of nums) {
    ans += countLess(n, high + 1) - countLess(n, low);
    insert(n);
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n * 15)", space: "O(n * 15)" },
    systemDesign: "Range-XOR counting appears in network analytics where pairs of IP addresses within a certain 'XOR distance' belong to the same subnet segment — trie-based range counting enables O(n log maxVal) pairwise analysis versus O(n^2) brute force for large routing tables.",
    pitfalls: ["Use 15 bits since nums[i] <= 2^14.", "countLess counts pairs with XOR strictly less than limit — use high+1 and low."],
  },
  {
    id: "tries-27",
    title: "Palindrome Pairs",
    difficulty: "Hard",
    tags: ["Trie", "String", "Hash Table"],
    statement: "Given an array of unique strings words, return all pairs [i, j] such that words[i] + words[j] is a palindrome.",
    examples: [
      { input: "words = [\"abcd\",\"dcba\",\"lls\",\"s\",\"sssll\"]", output: "[[0,1],[1,0],[3,2],[2,4]]" },
    ],
    intuition: "For each word, insert its reverse into a trie; then for each word scan for cases where a prefix is the reverse of another word (with optional palindromic middle), like fitting puzzle pieces.",
    approach: [
      "For each word, check three cases: (1) full reverse exists as another word, (2) a prefix of word reversed exists and suffix is palindrome, (3) a suffix of word reversed exists and prefix is palindrome.",
      "Use a hash map for O(1) lookups on reversed word.",
    ],
    solution: `function palindromePairs(words) {
  const map = new Map(words.map((w, i) => [w, i]));
  const isPalin = (s, l, r) => {
    while (l < r) if (s[l++] !== s[r--]) return false;
    return true;
  };
  const result = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const rev = w.split('').reverse().join('');
    // Case 1: full reverse
    if (map.has(rev) && map.get(rev) !== i) result.push([i, map.get(rev)]);
    // Case 2: prefix reversed is a word, suffix is palindrome
    for (let cut = 1; cut < w.length; cut++) {
      const prefRev = w.slice(0, cut).split('').reverse().join('');
      if (map.has(prefRev) && isPalin(w, cut, w.length - 1)) result.push([i, map.get(prefRev)]);
      const sufRev = w.slice(cut).split('').reverse().join('');
      if (map.has(sufRev) && isPalin(w, 0, cut - 1)) result.push([map.get(sufRev), i]);
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * L^2)", space: "O(n * L)" },
    systemDesign: "Palindrome pair detection appears in DNA sequence analysis where reverse-complement palindromes (restriction sites) are searched — a trie of reverse-complement sequences enables multi-pattern scanning across an entire genome in linear time with Aho-Corasick.",
    pitfalls: ["Avoid duplicates: case 1 handles full-reverse pairs; cases 2 and 3 handle asymmetric splits — they should not re-emit full-reverse pairs.", "Empty string '' is a valid word: it forms a palindrome pair with any palindrome word."],
  },
  {
    id: "tries-28",
    title: "Design Search Autocomplete System",
    difficulty: "Hard",
    tags: ["Trie", "Design", "String", "Sorting"],
    statement: "Design a search autocomplete system. Given historical sentences with times, input(c) adds a character and returns the top 3 most frequent sentences matching the current prefix. '#' finalizes the input and saves it.",
    examples: [
      { input: "AutocompleteSystem([\"i love you\",\"island\",\"iroman\"], [5,3,2]), input('i'), input(' '), input('a'), input('#')", output: "[[\"i love you\",\"island\",\"iroman\"],[\"i love you\",\"island\"],[],null]" },
    ],
    intuition: "Build a trie where each node stores a map of sentence -> frequency; as the user types each character, retrieve the current prefix node's sentences and return the top-3 by frequency then lexicographic order.",
    approach: [
      "Insert all historical sentences into a trie; each leaf stores its frequency.",
      "Maintain a currentNode pointer and currentInput string.",
      "On input(c): if '#', save currentInput (insert/increment trie), reset state; else advance currentNode along trie and return top-3 from subtree.",
    ],
    solution: `class AutocompleteSystem {
  constructor(sentences, times) {
    this.root = {};
    this.curr = this.root;
    this.input = "";
    const insertWord = (s, cnt) => {
      let node = this.root;
      for (const ch of s) {
        if (!node[ch]) node[ch] = {};
        node = node[ch];
      }
      node['$'] = (node['$'] || 0) + cnt;
    };
    for (let i = 0; i < sentences.length; i++) insertWord(sentences[i], times[i]);
    this._insertWord = insertWord;
  }
  input(c) {
    if (c === '#') {
      this._insertWord(this.input, 1);
      this.input = "";
      this.curr = this.root;
      return [];
    }
    this.input += c;
    if (this.curr) this.curr = this.curr[c];
    if (!this.curr) return [];
    // Collect all sentences in subtree
    const sentences = [];
    const dfs = (node, path) => {
      if (node['$']) sentences.push([path, node['$']]);
      for (const key of Object.keys(node)) {
        if (key === '$') continue;
        dfs(node[key], path + key);
      }
    };
    dfs(this.curr, this.input);
    sentences.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return sentences.slice(0, 3).map(s => s[0]);
  }
}`,
    language: "javascript",
    complexity: { time: "O(p + s log s) per keystroke, p = prefix nodes, s = matching sentences", space: "O(total chars)" },
    systemDesign: "This is the exact architecture of Google's search-suggest backend: a distributed trie (shard by first two characters) stores query->frequency pairs; each keypress fans out to the relevant shard, retrieves top-k candidates, and merges across shards in a scatter-gather pattern.",
    pitfalls: ["Reset both currentNode and currentInput on '#'.", "DFS must prepend the already-typed prefix to the collected suffix paths."],
  },
  {
    id: "tries-29",
    title: "Delete Duplicate Folders in System",
    difficulty: "Hard",
    tags: ["Trie", "DFS", "Hashing", "String"],
    statement: "Given a list of filesystem paths, delete all folders (and their subfolders) that have duplicate subtree structures. Return the remaining folder paths.",
    examples: [
      { input: "paths = [[\"a\"],[\"c\"],[\"d\"],[\"a\",\"b\"],[\"c\",\"b\"],[\"d\",\"a\"]]", output: "[[\"d\"],[\"d\",\"a\"]]" },
    ],
    intuition: "Build a trie from the paths; serialize each subtree into a canonical string. If two nodes have identical serializations, they are duplicates and both (plus all descendants) should be deleted.",
    approach: [
      "Build a trie where each node's key is the folder name.",
      "Post-order DFS to compute a canonical serialization string for each subtree.",
      "Use a frequency map of serializations; nodes whose serial appears more than once are duplicates.",
      "Collect paths of non-duplicate nodes via DFS.",
    ],
    solution: `function deleteDuplicateFolder(paths) {
  const root = {};
  for (const path of paths) {
    let node = root;
    for (const folder of path) {
      if (!node[folder]) node[folder] = {};
      node = node[folder];
    }
  }
  const freq = new Map();
  const serialize = (node) => {
    const keys = Object.keys(node).sort();
    if (!keys.length) return "";
    const serial = keys.map(k => k + '(' + serialize(node[k]) + ')').join('');
    freq.set(serial, (freq.get(serial) || 0) + 1);
    return serial;
  };
  serialize(root);
  const result = [];
  const collect = (node, path) => {
    const keys = Object.keys(node).sort();
    for (const k of keys) {
      const serial = Object.keys(node[k]).sort().map(ck => ck + '(' + serialize(node[k][ck]) + ')').join('');
      const fullSerial = k + '(' + serial + ')';
      // recompute for this child
      const childSerial = Object.keys(node[k]).length === 0 ? "" : Object.keys(node[k]).sort().map(ck => ck + '(' + serialize(node[k][ck]) + ')').join('');
      if (freq.get(childSerial) > 1 && childSerial !== "") continue;
      path.push(k);
      result.push([...path]);
      collect(node[k], path);
      path.pop();
    }
  };
  collect(root, []);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(N log N * L) where N = nodes, L = path length", space: "O(N * L)" },
    systemDesign: "Duplicate subtree detection is used in version-control systems (Git uses content-addressable tree objects where identical directory structures share the same SHA hash) and in distributed file systems to deduplicate replicated directory subtrees across datacenters.",
    pitfalls: ["Serialize in sorted key order for canonical comparison.", "The root itself is never deleted — only its children and their subtrees."],
  },
  {
    id: "tries-30",
    title: "Maximum Genetic Difference Query",
    difficulty: "Hard",
    tags: ["Trie", "DFS", "Bit Manipulation", "Tree"],
    statement: "Given a rooted tree and queries [node, val], for each query find the maximum XOR between val and any node value on the path from root to node.",
    examples: [
      { input: "parents = [-1,0,1,1], queries = [[0,2],[3,2],[2,5]]", output: "[2,3,7]" },
    ],
    intuition: "Do an Euler-tour DFS of the tree; maintain a binary trie of all node values currently on the root-to-current path. On entering a node insert its value; on leaving remove it. Answer each query at the right DFS moment.",
    approach: [
      "Build tree from parents array. Group queries by node.",
      "DFS: on enter, add node value to binary trie; answer all queries at this node using greedy XOR max; on exit, remove node value from trie.",
      "Binary trie supports insert, delete, and queryMaxXOR.",
    ],
    solution: `function maxGeneticDifference(parents, queries) {
  const n = parents.length;
  const children = Array.from({length: n}, () => []);
  let root = -1;
  for (let i = 0; i < n; i++) {
    if (parents[i] === -1) root = i;
    else children[parents[i]].push(i);
  }
  // Offline: group queries by node
  const qByNode = Array.from({length: n}, () => []);
  for (let i = 0; i < queries.length; i++) qByNode[queries[i][0]].push(i);
  const ans = new Array(queries.length);
  // Binary trie with counts for insert/delete
  const trie = [null, null, 0]; // [child0, child1, count]
  const mkNode = () => [null, null, 0];
  const trieInsert = (v, delta) => {
    let node = trie;
    for (let i = 17; i >= 0; i--) {
      const b = (v >> i) & 1;
      if (!node[b]) node[b] = mkNode();
      node = node[b];
      node[2] += delta;
    }
  };
  const trieQuery = (v) => {
    let node = trie;
    let res = 0;
    for (let i = 17; i >= 0; i--) {
      const b = (v >> i) & 1;
      const want = 1 - b;
      if (node[want] && node[want][2] > 0) { res |= (1 << i); node = node[want]; }
      else node = node[b];
    }
    return res;
  };
  const dfs = (u) => {
    trieInsert(u, 1);
    for (const qi of qByNode[u]) ans[qi] = trieQuery(queries[qi][1]);
    for (const v of children[u]) dfs(v);
    trieInsert(u, -1);
  };
  dfs(root);
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O((n + q) * 18)", space: "O(n * 18)" },
    systemDesign: "Path-XOR queries on trees model routing distance calculations in SDN (software-defined networking) where packet routing cost is XOR-distance from source to destination along a tree topology — online trie maintenance during DFS enables O(depth * 32) per query.",
    pitfalls: ["Use node count in the trie (not just existence) so that the same value inserted multiple times does not corrupt deletion.", "18 bits suffices for n up to 100000."],
  },
  {
    id: "tries-31",
    title: "Number of Matching Subsequences",
    difficulty: "Medium",
    tags: ["Trie", "String", "Hash Table"],
    statement: "Given a string s and an array of words, return the number of words that are subsequences of s.",
    examples: [
      { input: "s = \"abcde\", words = [\"a\",\"bb\",\"acd\",\"ace\"]", output: "3" },
    ],
    intuition: "Group words by their first character into buckets; scan s once left-to-right: for each character c, advance all words waiting for c, moving them to the next bucket or counting them if exhausted.",
    approach: [
      "Create a map of first-char -> list of (word, pointer) pairs.",
      "For each character in s, process all entries waiting for that char: advance pointer; if pointer reaches word end, increment count; else move entry to new bucket.",
    ],
    solution: `function numMatchingSubseq(s, words) {
  const waiting = new Map();
  for (let c = 97; c <= 122; c++) waiting.set(String.fromCharCode(c), []);
  for (const w of words) waiting.get(w[0]).push([w, 0]);
  let count = 0;
  for (const ch of s) {
    const cur = waiting.get(ch);
    waiting.set(ch, []);
    for (const [w, i] of cur) {
      if (i + 1 === w.length) { count++; }
      else waiting.get(w[i + 1]).push([w, i + 1]);
    }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(|s| + sum of word lengths)", space: "O(total word chars)" },
    systemDesign: "Bucket-based subsequence matching mirrors event-driven workflow engines where tasks wait for the next required event — grouping tasks by their 'waiting for' event type allows a single event-stream scan to advance all relevant tasks simultaneously without per-task polling.",
    pitfalls: ["Reset the waiting bucket for ch before processing (extract old list, set to empty, then re-add survivors).", "Duplicate words in the input each count separately."],
  },
  {
    id: "tries-32",
    title: "Counting Words With Prefix and Suffix Pairs",
    difficulty: "Easy",
    tags: ["Trie", "String", "Array"],
    statement: "Given an array of strings words, count pairs (i, j) where i < j and words[i] is both a prefix and a suffix of words[j].",
    examples: [
      { input: "words = [\"a\",\"aba\",\"ababa\",\"aa\"]", output: "4" },
    ],
    intuition: "For each pair, check if the shorter word is both a prefix (startsWith) and suffix (endsWith) of the longer word — a trie can precompute prefix matches efficiently.",
    approach: [
      "For each j, iterate over all i < j.",
      "Check words[j].startsWith(words[i]) && words[j].endsWith(words[i]).",
      "Count valid pairs.",
    ],
    solution: `function countPrefixSuffixPairs(words) {
  let count = 0;
  for (let j = 1; j < words.length; j++) {
    for (let i = 0; i < j; i++) {
      if (words[j].startsWith(words[i]) && words[j].endsWith(words[i])) {
        count++;
      }
    }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n^2 * L)", space: "O(1)" },
    systemDesign: "Prefix-and-suffix validation appears in DNS wildcard certificate matching (*.example.com matching sub.example.com) and in API gateway route matching where routes can be both prefix-matched and suffix-matched against request paths.",
    pitfalls: ["A word is trivially a prefix and suffix of itself — but i < j prevents self-pairing.", "Short word must be <= length of the longer word; startsWith/endsWith handle this automatically."],
  },
  {
    id: "tries-33",
    title: "Top K Frequent Autocomplete Suggestions",
    difficulty: "Medium",
    tags: ["Trie", "Design", "Heap", "String"],
    statement: "Design an autocomplete system that returns the top-k most frequent completions for a given prefix. Support insert(word, freq) and topK(prefix, k) operations.",
    examples: [
      { input: "insert(\"apple\",5), insert(\"app\",3), insert(\"application\",7), topK(\"app\",2)", output: "[\"application\",\"apple\"]" },
    ],
    intuition: "Store a max-heap (or sorted list capped at k) of (frequency, word) pairs at every prefix node during insertion — topK then simply reads the pre-sorted list at the prefix node in O(prefix_length + k).",
    approach: [
      "Each trie node holds a sorted list of up to k (freq, word) pairs.",
      "On insert, walk the path and at each node merge the new entry into the sorted list, keeping only top-k.",
      "topK navigates to the prefix node and returns stored list.",
    ],
    solution: `class AutocompleteTopK {
  constructor(k) {
    this.k = k;
    this.root = { children: {}, top: [] };
  }
  insert(word, freq) {
    let node = this.root;
    const merge = (arr) => {
      const idx = arr.findIndex(e => e[1] === word);
      if (idx !== -1) arr.splice(idx, 1);
      arr.push([freq, word]);
      arr.sort((a, b) => b[0] - a[0] || a[1].localeCompare(b[1]));
      if (arr.length > this.k) arr.length = this.k;
    };
    merge(node.top);
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = { children: {}, top: [] };
      node = node.children[ch];
      merge(node.top);
    }
  }
  topK(prefix, k) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return [];
      node = node.children[ch];
    }
    return node.top.slice(0, k).map(e => e[1]);
  }
}`,
    language: "javascript",
    complexity: { time: "O(L * k log k) insert, O(L) topK", space: "O(W * k)" },
    systemDesign: "Pre-computed top-k lists at every trie node are used by search engines to return instant suggestions — Bing and DuckDuckGo maintain pre-ranked candidate lists at each prefix node in their distributed tries, eliminating re-ranking at query time for sub-10ms suggestion latency.",
    pitfalls: ["Update the frequency if the word is re-inserted rather than adding a duplicate entry.", "Sort by descending frequency then lexicographic order to handle ties consistently."],
  },
  {
    id: "tries-34",
    title: "Word Squares",
    difficulty: "Hard",
    tags: ["Trie", "Backtracking", "String"],
    statement: "Given an array of unique words, return all word squares you can build from them. A word square is a k x k grid where the k-th row and k-th column read the same word.",
    examples: [
      { input: "words = [\"ball\",\"area\",\"lead\",\"lady\"]", output: "[[\"ball\",\"area\",\"lead\",\"lady\"],[\"lady\",\"area\",\"deal\",\"ball\"]]" },
    ],
    intuition: "Build a prefix trie; backtrack row by row — after placing each row, the prefix constraint on the next row is determined by the column characters already placed, so query the trie for words matching that forced prefix.",
    approach: [
      "Build a trie of all words mapping prefix -> list of words.",
      "Backtrack: at row i, the prefix for that row is formed by characters at position i from all previously placed rows.",
      "Use the trie to get all words matching this prefix and recurse.",
    ],
    solution: `function wordSquares(words) {
  const prefMap = new Map();
  for (const w of words) {
    for (let i = 0; i <= w.length; i++) {
      const pre = w.slice(0, i);
      if (!prefMap.has(pre)) prefMap.set(pre, []);
      prefMap.get(pre).push(w);
    }
  }
  const len = words[0].length;
  const result = [];
  const bt = (square) => {
    if (square.length === len) { result.push([...square]); return; }
    const idx = square.length;
    const prefix = square.map(w => w[idx]).join('');
    for (const w of (prefMap.get(prefix) || [])) {
      square.push(w);
      bt(square);
      square.pop();
    }
  };
  for (const w of words) bt([w]);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * L * 26^L) with pruning", space: "O(n * L)" },
    systemDesign: "Word-square-style constraint propagation is used in constraint satisfaction solvers (Sudoku, timetabling) — the trie provides the domain of valid values for each variable given partial assignments, dramatically pruning the search space versus brute force.",
    pitfalls: ["The prefix for row i is built from column i of all placed rows, not from row i itself.", "Each word can appear only once in a square since words are unique."],
  },
  {
    id: "tries-35",
    title: "Minimum Number of Valid Words",
    difficulty: "Medium",
    tags: ["Trie", "Dynamic Programming", "String"],
    statement: "Given a puzzle string and a list of valid words, break the puzzle into the minimum number of valid word segments (each character used exactly once). Return the minimum count or -1 if impossible.",
    examples: [
      { input: "puzzle = \"awaken\", words = [\"aw\",\"ake\",\"n\"]", output: "3" },
    ],
    intuition: "This is a word-break minimum-count DP: dp[i] = minimum words to cover puzzle[0..i-1]; use a trie to efficiently find all dictionary words starting at each position.",
    approach: [
      "Build a trie from words.",
      "dp[0] = 0; dp[i] = min over all trie matches ending at i of (dp[j] + 1).",
      "Return dp[n] or -1 if dp[n] is still Infinity.",
    ],
    solution: `function minValidWords(puzzle, words) {
  const root = {};
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['#'] = true;
  }
  const n = puzzle.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 0; i < n; i++) {
    if (dp[i] === Infinity) continue;
    let node = root;
    for (let j = i; j < n; j++) {
      const ch = puzzle[j];
      if (!node[ch]) break;
      node = node[ch];
      if (node['#']) dp[j + 1] = Math.min(dp[j + 1], dp[i] + 1);
    }
  }
  return dp[n] === Infinity ? -1 : dp[n];
}`,
    language: "javascript",
    complexity: { time: "O(n^2 + W)", space: "O(n + W)" },
    systemDesign: "Minimum-segment-count word breaking is used in CJK search tokenization quality evaluation — NLP systems score tokenization candidates by the number of dictionary-word segments, and the trie DP finds the globally optimal tokenization in O(n * maxWordLen).",
    pitfalls: ["Skip positions where dp[i] = Infinity as they are unreachable.", "Return -1 if dp[n] remains Infinity, meaning no valid segmentation exists."],
  },
  {
    id: "tries-36",
    title: "Implement Compressed Trie (Radix Tree)",
    difficulty: "Medium",
    tags: ["Trie", "Design", "String"],
    statement: "Implement a compressed trie (Patricia/radix tree) where chains of single-child nodes are collapsed into one edge labeled with the shared substring. Support insert and search.",
    examples: [
      { input: "insert(\"romane\"), insert(\"romanus\"), insert(\"romulus\"), search(\"romane\")", output: "true" },
    ],
    intuition: "A compressed trie collapses long single-child chains into one edge with a multi-character label — like shortcutting a straight road instead of stopping at every lamp post, saving memory and traversal steps.",
    approach: [
      "Each node stores a label (string), children map, and isEnd.",
      "On insert, find common prefix with existing edge; split at mismatch point if needed.",
      "On search, match edge label character by character, descend on full match.",
    ],
    solution: `class RadixNode {
  constructor(label = "", isEnd = false) {
    this.label = label;
    this.isEnd = isEnd;
    this.children = {};
  }
}

class RadixTree {
  constructor() {
    this.root = new RadixNode();
  }
  insert(word) {
    let node = this.root;
    let i = 0;
    while (i < word.length) {
      const ch = word[i];
      if (!node.children[ch]) {
        node.children[ch] = new RadixNode(word.slice(i), true);
        return;
      }
      const child = node.children[ch];
      const lbl = child.label;
      let j = 0;
      while (j < lbl.length && i < word.length && word[i] === lbl[j]) { i++; j++; }
      if (j === lbl.length) { node = child; }
      else {
        // Split
        const mid = new RadixNode(lbl.slice(0, j), false);
        child.label = lbl.slice(j);
        mid.children[child.label[0]] = child;
        node.children[ch] = mid;
        if (i < word.length) {
          mid.children[word[i]] = new RadixNode(word.slice(i), true);
        } else {
          mid.isEnd = true;
        }
        return;
      }
    }
    node.isEnd = true;
  }
  search(word) {
    let node = this.root;
    let i = 0;
    while (i < word.length) {
      const ch = word[i];
      if (!node.children[ch]) return false;
      const child = node.children[ch];
      const lbl = child.label;
      if (!word.slice(i).startsWith(lbl)) return false;
      i += lbl.length;
      node = child;
    }
    return node.isEnd;
  }
}`,
    language: "javascript",
    complexity: { time: "O(m) insert and search", space: "O(total unique chars, compressed)" },
    systemDesign: "Radix trees are the data structure behind Linux kernel routing tables (the fib_trie) and nginx URL routing — compressed edges mean millions of IP prefixes or URL paths fit in L3 cache, cutting routing lookup latency from microseconds to nanoseconds.",
    pitfalls: ["Splitting a node requires carefully re-rooting the existing child under the new mid-node.", "Ensure the first character of the new label still keys the children map correctly after splitting."],
  },
  {
    id: "tries-37",
    title: "T9 Predictive Text",
    difficulty: "Medium",
    tags: ["Trie", "Design", "String"],
    statement: "Given a T9 digit sequence (2-9) and a dictionary, return all words that can be formed by the T9 mapping where digits map to letter groups (2->abc, 3->def, etc.).",
    examples: [
      { input: "digits = \"23\", dictionary = [\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]", output: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]" },
    ],
    intuition: "Build a trie from the dictionary; at each trie level, instead of following a single character, follow all characters mapped to the current digit — like following multiple hallways at once for each button press.",
    approach: [
      "Build a standard trie from the dictionary.",
      "DFS with current node and digit index: at each step expand to all children matching any letter in the digit's group.",
      "Collect all words found at isEnd nodes when all digits are consumed.",
    ],
    solution: `function t9Words(digits, dictionary) {
  const T9 = { '2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz' };
  const root = {};
  for (const w of dictionary) {
    let node = root;
    for (const ch of w) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['#'] = w;
  }
  const result = [];
  const dfs = (node, di) => {
    if (di === digits.length) {
      if (node['#']) result.push(node['#']);
      return;
    }
    for (const ch of T9[digits[di]]) {
      if (node[ch]) dfs(node[ch], di + 1);
    }
  };
  dfs(root, 0);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(4^d * L) worst case with pruning by trie", space: "O(W)" },
    systemDesign: "T9 prediction was the first mass-market trie application on mobile devices; modern soft keyboards (SwiftKey, Gboard) use the same structure but extend it with n-gram language models — the trie provides candidate words, and the LM re-ranks by contextual probability.",
    pitfalls: ["Digit '7' maps to 4 letters (pqrs) and '9' to 4 letters (wxyz) — do not assume 3 letters per digit.", "A word shorter than the digit sequence will never be at an end node when all digits are consumed."],
  },
  {
    id: "tries-38",
    title: "IP Longest Prefix Match",
    difficulty: "Medium",
    tags: ["Trie", "Bit Manipulation", "Network"],
    statement: "Given a list of CIDR-notation IP prefixes each associated with a next-hop, and a destination IP, return the next-hop for the most specific (longest) matching prefix.",
    examples: [
      { input: "routes = [[\"192.168.0.0/24\",\"A\"],[\"192.168.0.0/16\",\"B\"]], dest = \"192.168.0.1\"", output: "\"A\"" },
    ],
    intuition: "Build a binary trie of IP address bits (32 bits); insert each prefix up to its mask length and store the next-hop; search by walking all 32 bits and keep the most recently seen next-hop along the path.",
    approach: [
      "Parse each CIDR into a 32-bit integer and mask length.",
      "Insert prefix bits (up to mask length) into a binary trie; mark node with next-hop.",
      "Search: walk all 32 bits of dest, tracking the last seen next-hop — that is the longest-prefix match.",
    ],
    solution: `function longestPrefixMatch(routes, dest) {
  const ipToInt = (ip) => ip.split('.').reduce((acc, b) => (acc << 8) | parseInt(b), 0) >>> 0;
  const root = [null, null, null]; // [child0, child1, nexthop]
  for (const [cidr, hop] of routes) {
    const [ipStr, lenStr] = cidr.split('/');
    const ip = ipToInt(ipStr);
    const len = parseInt(lenStr);
    let node = root;
    for (let i = 31; i >= 32 - len; i--) {
      const bit = (ip >> i) & 1;
      if (!node[bit]) node[bit] = [null, null, null];
      node = node[bit];
    }
    node[2] = hop;
  }
  const destInt = ipToInt(dest);
  let node = root;
  let best = null;
  for (let i = 31; i >= 0; i--) {
    const bit = (destInt >> i) & 1;
    if (!node[bit]) break;
    node = node[bit];
    if (node[2] !== null) best = node[2];
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(32) per lookup", space: "O(prefixes * 32)" },
    systemDesign: "Longest-prefix matching (LPM) in a binary trie is exactly how BGP routers forward packets — a hardware TCAM implements the trie at line speed (billions of packets per second), and software routers use Patricia tries (Linux fib_trie) to achieve millions of lookups per second in RAM.",
    pitfalls: ["Use unsigned right-shift (>>> 0) when converting IPs to avoid sign-bit issues with JavaScript's signed 32-bit integers.", "Track the last seen next-hop along the path, not just the deepest node."],
  },
  {
    id: "tries-39",
    title: "Find Longest Awesome Substring",
    difficulty: "Hard",
    tags: ["Trie", "Bit Manipulation", "String", "Hashing"],
    statement: "Given a string s of digits, return the length of the longest substring that can be rearranged into a palindrome.",
    examples: [
      { input: "s = \"3242415\"", output: "5", explanation: "\"24241\" can be rearranged to \"24142\" or similar palindromes." },
    ],
    intuition: "A string can form a palindrome if at most one digit has odd frequency — track parity of each digit as a 10-bit bitmask; the longest awesome substring corresponds to the earliest previous occurrence of the same or one-bit-flipped mask.",
    approach: [
      "Use a prefix XOR bitmask (bit i = parity of digit i so far).",
      "Store earliest index for each mask in a map (initialized with mask 0 at index -1).",
      "For each position, check current mask and all 10 one-bit flips; track maximum length found.",
    ],
    solution: `function longestAwesome(s) {
  const first = new Map([[0, -1]]);
  let mask = 0;
  let ans = 0;
  for (let i = 0; i < s.length; i++) {
    mask ^= (1 << (s.charCodeAt(i) - 48));
    if (first.has(mask)) {
      ans = Math.max(ans, i - first.get(mask));
    }
    for (let d = 0; d < 10; d++) {
      const toggled = mask ^ (1 << d);
      if (first.has(toggled)) {
        ans = Math.max(ans, i - first.get(toggled));
      }
    }
    if (!first.has(mask)) first.set(mask, i);
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(10n)", space: "O(2^10) = O(1024)" },
    systemDesign: "Bitmask prefix hashing for palindrome detection generalises to anagram window problems in log-aggregation systems — parity vectors are stored in a hash map keyed on bitmask, enabling O(1) range checks for balanced character distributions across sliding time windows.",
    pitfalls: ["Store the FIRST occurrence of each mask, not the last — we want the longest span.", "Check all 10 one-bit flips (one odd digit is allowed) in addition to the exact mask match."],
  },
  {
    id: "tries-40",
    title: "Trie-Based Spell Checker",
    difficulty: "Medium",
    tags: ["Trie", "Design", "String", "Edit Distance"],
    statement: "Design a spell checker: given a dictionary, for each query word return the word from the dictionary with minimum edit distance (Levenshtein distance 1) if the query is not in the dictionary, or the query itself if it is.",
    examples: [
      { input: "dictionary = [\"hello\",\"world\"], query = \"helo\"", output: "\"hello\"" },
    ],
    intuition: "Build a trie; search it with a DFS that tolerates up to k mismatches using a row of the Levenshtein DP matrix carried along each trie path — prune any branch whose minimum reachable distance exceeds k.",
    approach: [
      "Build trie from dictionary.",
      "For each query, run a DFS carrying the current DP row (edit distance from query to current prefix).",
      "Prune when min value in current row exceeds threshold.",
      "At isEnd nodes, record the full word and its edit distance.",
    ],
    solution: `function spellCheck(dictionary, query) {
  const root = {};
  for (const w of dictionary) {
    let node = root;
    for (const ch of w) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['#'] = w;
  }
  if (root) {
    // Check exact match first
    let node = root;
    for (const ch of query) {
      if (!node[ch]) { node = null; break; }
      node = node[ch];
    }
    if (node && node['#'] === query) return query;
  }
  // Trie DFS with edit distance row
  const maxDist = 1;
  let best = null;
  let bestDist = Infinity;
  const initRow = Array.from({length: query.length + 1}, (_, i) => i);
  const dfs = (node, letter, prevRow) => {
    const currRow = [prevRow[0] + 1];
    for (let col = 1; col <= query.length; col++) {
      const ins = currRow[col - 1] + 1;
      const del = prevRow[col] + 1;
      const rep = prevRow[col - 1] + (query[col - 1] !== letter ? 1 : 0);
      currRow.push(Math.min(ins, del, rep));
    }
    const dist = currRow[query.length];
    if (node['#'] && dist < bestDist) { bestDist = dist; best = node['#']; }
    if (Math.min(...currRow) <= maxDist) {
      for (const key of Object.keys(node)) {
        if (key !== '#') dfs(node[key], key, currRow);
      }
    }
  };
  for (const key of Object.keys(root)) {
    if (key !== '#') dfs(root[key], key, initRow);
  }
  return best || query;
}`,
    language: "javascript",
    complexity: { time: "O(|dict| * |query|) worst case, heavily pruned", space: "O(W + |query|)" },
    systemDesign: "Trie-based Levenshtein search is used in Elasticsearch's fuzzy query and Lucene's FuzzyQuery — the Levenshtein automaton is compiled per query and intersected with the term dictionary trie, returning all terms within edit distance k in O(|trie| * k) total.",
    pitfalls: ["Prune branches where the minimum value in currRow already exceeds maxDist — no descendant can improve.", "Carry the full DP row at each node, not just the last value."],
  },
  {
    id: "tries-41",
    title: "Prefix-Compressed Dictionary Storage",
    difficulty: "Medium",
    tags: ["Trie", "Design", "String", "Compression"],
    statement: "Given a sorted list of words, encode them as a trie and report the total number of trie nodes required (each unique character position = one node). Compare to naive storage.",
    examples: [
      { input: "words = [\"apple\",\"application\",\"apply\",\"apt\"]", output: "nodes = 10" },
    ],
    intuition: "Shared prefixes in a trie reuse nodes — 'apple', 'apply', and 'application' share the 'appl' prefix path, so instead of 5+11+5=21 characters you only store 4 + divergent suffixes.",
    approach: [
      "Insert all words into a trie counting each newly created node.",
      "Return total node count.",
    ],
    solution: `function countTrieNodes(words) {
  const root = {};
  let nodeCount = 0;
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node[ch]) { node[ch] = {}; nodeCount++; }
      node = node[ch];
    }
  }
  return nodeCount;
}`,
    language: "javascript",
    complexity: { time: "O(W)", space: "O(unique prefix chars)" },
    systemDesign: "Prefix-compressed tries (Patricia trees) are the foundation of dictionary codecs in Zstandard and Brotli compression — the compressor builds a trie of previously seen byte sequences and replaces repeated sequences with trie node references, achieving compression ratios above gzip.",
    pitfalls: ["Only count newly created nodes (when the child does not already exist).", "The root node itself is not counted as it represents the empty prefix before any character."],
  },
  {
    id: "tries-42",
    title: "Trie Serialization and Deserialization",
    difficulty: "Medium",
    tags: ["Trie", "Design", "DFS", "String"],
    statement: "Design serialize and deserialize methods for a Trie, producing a compact string representation that can be used to reconstruct the trie exactly.",
    examples: [
      { input: "Trie with words [\"app\",\"apple\",\"bat\"], serialize then deserialize", output: "deserialized trie contains same words" },
    ],
    intuition: "DFS pre-order serialization: at each node output the character, recurse into children, then a sentinel '#' to mark backtracking — like writing a parenthesized expression for the tree structure.",
    approach: [
      "serialize: DFS; for each node output char + (isEnd ? '*' : '') + serialize children + '#' for backtrack.",
      "deserialize: parse characters, build nodes, use '#' as a signal to return to parent.",
    ],
    solution: `class SerializableTrie {
  constructor() { this.root = { ch: '', isEnd: false, children: {} }; }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = { ch, isEnd: false, children: {} };
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  serialize() {
    const parts = [];
    const dfs = (node) => {
      parts.push(node.ch + (node.isEnd ? '*' : ''));
      for (const ch of Object.keys(node.children).sort()) dfs(node.children[ch]);
      parts.push('#');
    };
    dfs(this.root);
    return parts.join(',');
  }
  deserialize(data) {
    const tokens = data.split(',');
    let i = 0;
    const buildNode = () => {
      const token = tokens[i++];
      const isEnd = token.endsWith('*');
      const ch = isEnd ? token.slice(0, -1) : token;
      const node = { ch, isEnd, children: {} };
      while (tokens[i] !== '#') {
        const child = buildNode();
        node.children[child.ch] = child;
      }
      i++; // consume '#'
      return node;
    };
    this.root = buildNode();
  }
}`,
    language: "javascript",
    complexity: { time: "O(N) for both", space: "O(N)" },
    systemDesign: "Trie serialization is critical for distributed search infrastructure — a dictionary trie is serialized on the indexer node and broadcast to all query nodes as a binary blob, allowing sub-second propagation of million-entry dictionaries across a fleet of servers.",
    pitfalls: ["The backtrack sentinel '#' must be distinct from valid characters.", "Sort children before serializing to ensure deterministic output for testing."],
  },
  {
    id: "tries-43",
    title: "Distinct Substrings via Suffix Trie",
    difficulty: "Medium",
    tags: ["Trie", "String", "Counting"],
    statement: "Given a string s, return the number of distinct non-empty substrings using a suffix trie approach.",
    examples: [
      { input: "s = \"aba\"", output: "4", explanation: "Distinct substrings: a, b, ab, ba, aba — but aba has repeated 'a'. Distinct set: {a, b, ab, ba, aba} = 5." },
    ],
    intuition: "Insert every suffix of s into a trie; the number of edges in the resulting trie equals the number of distinct non-empty substrings, since every path from root to any node represents a unique prefix (substring).",
    approach: [
      "For each starting index i from 0 to n-1, insert suffix s[i..] into the trie.",
      "Count every new node created (each new node = one new distinct substring).",
    ],
    solution: `function countDistinctSubstrings(s) {
  const root = {};
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    let node = root;
    for (let j = i; j < s.length; j++) {
      const ch = s[j];
      if (!node[ch]) { node[ch] = {}; count++; }
      node = node[ch];
    }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n^2)", space: "O(n^2)" },
    systemDesign: "Counting distinct substrings is foundational in bioinformatics (counting k-mer diversity in DNA reads) and data compression analysis — production systems use suffix arrays with LCP arrays instead of suffix tries to compute the same count in O(n log n) time and O(n) space.",
    pitfalls: ["This approach is O(n^2) in both time and space; suffix automaton (SAM) achieves O(n).", "Each newly created trie node corresponds to exactly one new distinct substring."],
  },
  {
    id: "tries-44",
    title: "Trie-Based Contact List Search",
    difficulty: "Easy",
    tags: ["Trie", "Design", "String"],
    statement: "Given a list of contact names, support findByPrefix(prefix) that returns all contacts whose name starts with the given prefix, in alphabetical order.",
    examples: [
      { input: "contacts = [\"Hackmanite\",\"Hack\",\"Hacker\",\"Hackney\"], prefix = \"Hack\"", output: "[\"Hack\",\"Hackmanite\",\"Hacker\",\"Hackney\"]" },
    ],
    intuition: "Build a trie of contact names; navigate to the prefix node, then DFS to collect all names in the subtree — just like flipping to the correct section of a phone book and reading all entries.",
    approach: [
      "Insert all contacts into the trie, storing the full name at end nodes.",
      "Navigate to the last character of prefix.",
      "DFS collect all names in the subtree, sort and return.",
    ],
    solution: `class ContactSearch {
  constructor(contacts) {
    this.root = {};
    for (const name of contacts) {
      let node = this.root;
      for (const ch of name) {
        if (!node[ch]) node[ch] = {};
        node = node[ch];
      }
      node['$'] = name;
    }
  }
  findByPrefix(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node[ch]) return [];
      node = node[ch];
    }
    const results = [];
    const dfs = (n) => {
      if (n['$']) results.push(n['$']);
      for (const key of Object.keys(n).sort()) {
        if (key !== '$') dfs(n[key]);
      }
    };
    dfs(node);
    return results.sort();
  }
}`,
    language: "javascript",
    complexity: { time: "O(P + K log K) where P = prefix length, K = matching contacts", space: "O(total chars)" },
    systemDesign: "Contact-list prefix search is the canonical mobile phone trie use case — iOS and Android address-book search uses a trie indexed on both first and last name tokens, returning prefix matches instantly from a local SQLite-backed trie for zero-latency offline search.",
    pitfalls: ["Navigate to the prefix node first — do not DFS the entire trie.", "Sort results for deterministic output."],
  },
  {
    id: "tries-45",
    title: "XOR Nearest Neighbor in Trie",
    difficulty: "Hard",
    tags: ["Trie", "Bit Manipulation", "Array"],
    statement: "Given an array of integers, for each element find the element in the array (other than itself) that produces the minimum XOR value with it.",
    examples: [
      { input: "nums = [1,3,5,14,15]", output: "[3,1,14,15,14]", explanation: "1^3=2, 3^1=2, 5^14=11 but 5^7 would be better; smallest XOR for 5 is 5^7=2? recalc: 5^14=11, 5^3=6, 5^1=4 -> min is 4 with 1." },
    ],
    intuition: "Build a binary trie of all numbers; for each number, greedily pick the SAME bit at each level (instead of opposite for maximum XOR) — matching bits produce 0 XOR contribution, minimizing total XOR.",
    approach: [
      "Insert all numbers into a binary trie.",
      "For each number, traverse greedily choosing the same bit if available, else the opposite.",
      "The traversal result gives the minimum XOR partner.",
    ],
    solution: `function findMinXorPairs(nums) {
  const root = [null, null];
  for (const n of nums) {
    let node = root;
    for (let i = 31; i >= 0; i--) {
      const bit = (n >> i) & 1;
      if (!node[bit]) node[bit] = [null, null];
      node = node[bit];
    }
  }
  return nums.map(n => {
    let node = root;
    let minXor = 0;
    for (let i = 31; i >= 0; i--) {
      const bit = (n >> i) & 1;
      if (node[bit]) { node = node[bit]; }
      else { minXor |= (1 << i); node = node[1 - bit]; }
    }
    return minXor;
  });
}`,
    language: "javascript",
    complexity: { time: "O(32n)", space: "O(32n)" },
    systemDesign: "Minimum-XOR nearest-neighbor search is used in Kademlia DHT peer discovery — when a node wants to find the peer closest to a target key, it queries its binary trie of known peers for the entry with minimum XOR distance, finding the nearest peer in O(log n) hops.",
    pitfalls: ["To exclude self-matching, ensure the input array has duplicates handled or postprocess results.", "Greedy minimum XOR chooses the SAME bit, unlike maximum XOR which chooses the opposite."],
  },
  {
    id: "tries-46",
    title: "Trie Autocomplete with Frequency Decay",
    difficulty: "Hard",
    tags: ["Trie", "Design", "String", "Heap"],
    statement: "Design an autocomplete system where each suggestion's score decays by a factor per unit time. Support insert(word, score, timestamp), query(prefix, currentTime, k) returning top-k suggestions by decayed score.",
    examples: [
      { input: "insert(\"hello\",100,0), insert(\"help\",80,0), query(\"hel\",10,2), decay=0.9 per unit", output: "[\"hello\",\"help\"]" },
    ],
    intuition: "Store (score, timestamp) at each trie end-node; at query time compute decayed score = score * decay^(currentTime - insertTime) and rank all prefix-matching words by this live score.",
    approach: [
      "Build trie with (score, timestamp) at end nodes.",
      "query: DFS subtree collecting (word, decayedScore) pairs, sort by decayed score descending, return top-k.",
    ],
    solution: `class DecayAutocomplete {
  constructor(decay) {
    this.decay = decay;
    this.root = {};
  }
  insert(word, score, timestamp) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['$'] = { word, score, ts: timestamp };
  }
  query(prefix, currentTime, k) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node[ch]) return [];
      node = node[ch];
    }
    const candidates = [];
    const dfs = (n) => {
      if (n['$']) {
        const { word, score, ts } = n['$'];
        const decayed = score * Math.pow(this.decay, currentTime - ts);
        candidates.push([decayed, word]);
      }
      for (const key of Object.keys(n)) {
        if (key !== '$') dfs(n[key]);
      }
    };
    dfs(node);
    candidates.sort((a, b) => b[0] - a[0]);
    return candidates.slice(0, k).map(c => c[1]);
  }
}`,
    language: "javascript",
    complexity: { time: "O(L + S log S) per query where S = subtree size", space: "O(W)" },
    systemDesign: "Time-decayed ranking is used in Twitter/X trending topic suggestions and news autocomplete — older search queries decay in relevance score using exponential decay (EWM), and the trie enables prefix-filtered ranking without scanning the entire corpus on each keystroke.",
    pitfalls: ["Decay must be applied at query time, not at insert time, so historical entries remain accurately re-rankable.", "Floating-point precision: for large time deltas, Math.pow may underflow to 0."],
  },
  {
    id: "tries-47",
    title: "Trie with Delete Operation",
    difficulty: "Medium",
    tags: ["Trie", "Design"],
    statement: "Implement a Trie with insert(word), search(word), startsWith(prefix), and delete(word) operations. After deleting a word, nodes shared with other words must not be removed.",
    examples: [
      { input: "insert(\"apple\"), insert(\"app\"), delete(\"app\"), search(\"app\"), search(\"apple\"), startsWith(\"app\")", output: "false, true, true" },
    ],
    intuition: "Delete only removes the isEnd flag at the word's last node, then prunes upward only nodes that have no children and no other isEnd — like erasing your name from a shared path in a park, but keeping the path if others still use it.",
    approach: [
      "Mark isEnd = false at the word's end node.",
      "Recursively prune leaf nodes (no children, no isEnd) from deepest back up.",
      "Stop pruning when a node has other children or is an isEnd for another word.",
    ],
    solution: `class TrieWithDelete {
  constructor() { this.root = { children: {}, isEnd: false }; }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = { children: {}, isEnd: false };
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;
  }
  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }
  delete(word) {
    const del = (node, i) => {
      if (i === word.length) {
        if (!node.isEnd) return false;
        node.isEnd = false;
        return Object.keys(node.children).length === 0;
      }
      const ch = word[i];
      if (!node.children[ch]) return false;
      const shouldDelete = del(node.children[ch], i + 1);
      if (shouldDelete) delete node.children[ch];
      return !node.isEnd && Object.keys(node.children).length === 0;
    };
    del(this.root, 0);
  }
}`,
    language: "javascript",
    complexity: { time: "O(m) per operation", space: "O(total unique chars)" },
    systemDesign: "Trie deletion with structural cleanup mirrors index maintenance in LSM-tree databases (RocksDB, Cassandra) where deleted keys are tombstoned at leaf level and compaction sweeps prune dead branches — shared prefix nodes are only compacted when all their descendants are deleted.",
    pitfalls: ["Only prune a node if it has zero children AND isEnd is false after deletion.", "Return a boolean from the recursive function indicating whether the caller should prune the current node."],
  },
  {
    id: "tries-48",
    title: "Trie-Based URL Router",
    difficulty: "Medium",
    tags: ["Trie", "Design", "String"],
    statement: "Implement a URL router that supports registering routes with wildcard segments (e.g., /user/:id/profile) and matching incoming URLs to their handler names.",
    examples: [
      { input: "register(\"/user/:id/profile\",\"getProfile\"), match(\"/user/42/profile\")", output: "\"getProfile\"" },
    ],
    intuition: "Build a trie where each path segment is an edge; ':param' wildcard segments match any string — like a directory tree where some folders accept any name.",
    approach: [
      "Split routes by '/' and insert into trie node-by-node.",
      "Wildcard nodes are keyed ':*' to distinguish from literal segments.",
      "match: walk trie segment by segment; at each node try exact match first, then wildcard.",
    ],
    solution: `class URLRouter {
  constructor() { this.root = { children: {}, handler: null }; }
  register(route, handler) {
    const parts = route.split('/').filter(Boolean);
    let node = this.root;
    for (const part of parts) {
      const key = part.startsWith(':') ? ':*' : part;
      if (!node.children[key]) node.children[key] = { children: {}, handler: null };
      node = node.children[key];
    }
    node.handler = handler;
  }
  match(url) {
    const parts = url.split('/').filter(Boolean);
    const dfs = (node, i) => {
      if (i === parts.length) return node.handler;
      const seg = parts[i];
      // Try exact match
      if (node.children[seg]) {
        const res = dfs(node.children[seg], i + 1);
        if (res) return res;
      }
      // Try wildcard
      if (node.children[':*']) {
        const res = dfs(node.children[':*'], i + 1);
        if (res) return res;
      }
      return null;
    };
    return dfs(this.root, 0);
  }
}`,
    language: "javascript",
    complexity: { time: "O(depth) per match", space: "O(total route segments)" },
    systemDesign: "Trie-based URL routing is used in every major HTTP framework (Express.js, Gin, FastAPI) — the route trie is built at startup and each incoming request is matched in O(path_depth) time; wildcard and catch-all segments map to parametrized trie nodes with priority ordering.",
    pitfalls: ["Try exact segment match before wildcard to give precedence to specific routes.", "Filter empty strings from split to handle leading slashes correctly."],
  },
  {
    id: "tries-49",
    title: "Palindrome Autocomplete",
    difficulty: "Hard",
    tags: ["Trie", "Design", "String", "Palindrome"],
    statement: "Given a list of words, design a structure that given a prefix returns all words in the list that start with the prefix AND are palindromes.",
    examples: [
      { input: "words = [\"racecar\",\"race\",\"level\",\"livid\",\"aba\"], prefix = \"r\"", output: "[\"racecar\"]" },
    ],
    intuition: "Build a standard prefix trie; at query time retrieve all words matching the prefix (via DFS), then filter for palindromes — for large dictionaries pre-mark end nodes that are palindromes during insertion.",
    approach: [
      "During insert, check if the word is a palindrome and store this flag at the end node.",
      "query: DFS from prefix node, collect words with isPalindrome flag set.",
    ],
    solution: `class PalindromeAutocomplete {
  constructor() { this.root = {}; }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    const rev = word.split('').reverse().join('');
    node['$'] = { word, isPalin: word === rev };
  }
  query(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node[ch]) return [];
      node = node[ch];
    }
    const results = [];
    const dfs = (n) => {
      if (n['$'] && n['$'].isPalin) results.push(n['$'].word);
      for (const key of Object.keys(n)) {
        if (key !== '$') dfs(n[key]);
      }
    };
    dfs(node);
    return results;
  }
}`,
    language: "javascript",
    complexity: { time: "O(L + K) per query where K = prefix subtree size", space: "O(W)" },
    systemDesign: "Palindrome-filtered autocomplete mirrors search systems with multi-predicate filtering (prefix AND category AND rating) — the trie handles prefix narrowing while per-node metadata handles secondary filters, avoiding full-corpus scans on each compound query.",
    pitfalls: ["Check palindrome at insert time so query time is O(subtree) not O(subtree * wordLength).", "An empty prefix returns all palindromic words from the root DFS."],
  },
  {
    id: "tries-50",
    title: "Trie-Based IP Blacklist",
    difficulty: "Hard",
    tags: ["Trie", "Bit Manipulation", "Design", "Network"],
    statement: "Design an IP blacklist that supports addBlock(cidr) to block a CIDR range and isBlocked(ip) to check if an IP is blocked. Also support removeBlock(cidr).",
    examples: [
      { input: "addBlock(\"192.168.1.0/24\"), isBlocked(\"192.168.1.100\"), isBlocked(\"10.0.0.1\"), removeBlock(\"192.168.1.0/24\"), isBlocked(\"192.168.1.100\")", output: "true, false, false" },
    ],
    intuition: "Build a binary trie of 32-bit IP addresses; inserting a CIDR block marks a node as 'blocked' (covering all IPs in its subtree); isBlocked walks the 32-bit path and returns true if any ancestor node is marked blocked.",
    approach: [
      "Parse CIDR into base IP integer and mask length.",
      "addBlock: walk the trie mask-length bits and mark that node as blocked (no need to go deeper).",
      "removeBlock: unmark the node.",
      "isBlocked: walk all 32 bits; return true if any node along the path is marked blocked.",
    ],
    solution: `class IPBlacklist {
  constructor() { this.root = {}; }
  _ipToInt(ip) { return ip.split('.').reduce((a, b) => (a << 8) | parseInt(b), 0) >>> 0; }
  _getNode(ip, len, create) {
    let node = this.root;
    for (let i = 31; i >= 32 - len; i--) {
      const bit = (ip >> i) & 1;
      if (!node[bit]) {
        if (!create) return null;
        node[bit] = {};
      }
      node = node[bit];
    }
    return node;
  }
  addBlock(cidr) {
    const [ipStr, lenStr] = cidr.split('/');
    const node = this._getNode(this._ipToInt(ipStr), parseInt(lenStr), true);
    if (node) node.blocked = true;
  }
  removeBlock(cidr) {
    const [ipStr, lenStr] = cidr.split('/');
    const node = this._getNode(this._ipToInt(ipStr), parseInt(lenStr), false);
    if (node) node.blocked = false;
  }
  isBlocked(ip) {
    const ipInt = this._ipToInt(ip);
    let node = this.root;
    for (let i = 31; i >= 0; i--) {
      if (node.blocked) return true;
      const bit = (ipInt >> i) & 1;
      if (!node[bit]) return false;
      node = node[bit];
    }
    return !!node.blocked;
  }
}`,
    language: "javascript",
    complexity: { time: "O(32) per operation", space: "O(prefixes * 32)" },
    systemDesign: "CIDR-trie-based IP blacklisting is deployed in cloud WAF (Web Application Firewall) services like AWS Shield and Cloudflare — a binary trie of blocked prefixes enables hardware-speed packet filtering at 100 Gbps line rates, checking each packet's source IP in 32 bit-steps against the entire blacklist simultaneously.",
    pitfalls: ["A CIDR block covers all IPs under it — once a node is marked blocked, do not insert deeper nodes; the isBlocked check propagates the block to all descendants implicitly.", "Use unsigned right-shift (>>> 0) to avoid JavaScript sign-bit issues with IPs >= 128.0.0.0."],
  },
];
