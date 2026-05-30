import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  // ---- EASY (17 problems) ----
  {
    id: "sliding-window-01",
    title: "Maximum Average Subarray I",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window"],
    statement: "Given an integer array nums and an integer k, find the contiguous subarray of length exactly k that has the maximum average value and return that value.",
    examples: [
      { input: "nums = [1,12,-5,-6,50,3], k = 4", output: "12.75", explanation: "Window [12,-5,-6,50] averages to 51/4 = 12.75." },
      { input: "nums = [5], k = 1", output: "5.0" },
    ],
    intuition: "Slide a fixed window of size k across the array. Instead of summing from scratch each time, just drop the leftmost element and add the new rightmost element — like a conveyor belt.",
    approach: [
      "Compute the sum of the first k elements.",
      "Set maxSum = windowSum.",
      "For each new index i from k to end: add nums[i] and subtract nums[i-k], update maxSum.",
      "Return maxSum / k.",
    ],
    solution: `function findMaxAverage(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let maxSum = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, sum);
  }
  return maxSum / k;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Fixed-size sliding windows map directly to rolling-average metrics in monitoring systems — Prometheus rate() and Grafana panels compute the average over a fixed time window by maintaining a running sum and evicting old samples, exactly this pattern at millions of data-points per second.",
  },
  {
    id: "sliding-window-02",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window"],
    statement: "Given an array prices where prices[i] is the stock price on day i, choose a single day to buy and a later day to sell to maximise profit. Return the maximum profit, or 0 if no profit is possible.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy at price 1, sell at price 6." },
      { input: "prices = [7,6,4,3,1]", output: "0" },
    ],
    intuition: "Think of a window where the left edge is the cheapest buy day seen so far. Each day, check if selling today beats your best profit — if today's price is even cheaper, shift the left edge here.",
    approach: [
      "Track minPrice = Infinity and maxProfit = 0.",
      "For each price: update minPrice, then compute profit = price - minPrice and update maxProfit.",
      "Return maxProfit.",
    ],
    solution: `function maxProfit(prices) {
  let minPrice = Infinity, maxProfit = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }
  return maxProfit;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Running-minimum tracking is used in real-time analytics dashboards that record an all-time low baseline (cost, latency) and continuously compare current readings against it without re-scanning history — the same single-pass logic powers live SLA-breach alerting in APM tools like Datadog.",
  },
  {
    id: "sliding-window-03",
    title: "Contains Duplicate II",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window", "Hashing"],
    statement: "Given an integer array nums and an integer k, return true if there are two distinct indices i and j such that nums[i] == nums[j] and abs(i - j) <= k.",
    examples: [
      { input: "nums = [1,2,3,1], k = 3", output: "true" },
      { input: "nums = [1,0,1,1], k = 1", output: "true" },
      { input: "nums = [1,2,3,1,2,3], k = 2", output: "false" },
    ],
    intuition: "Keep a sliding window (a set) of the last k elements. If the new element is already in the window, return true. If the window grows beyond k, remove the oldest element.",
    approach: [
      "Maintain a Set of at most k elements.",
      "For each element: if it is in the Set return true.",
      "Add the element; if Set size exceeds k, delete nums[i - k].",
      "Return false after the loop.",
    ],
    solution: `function containsNearbyDuplicate(nums, k) {
  const window = new Set();
  for (let i = 0; i < nums.length; i++) {
    if (window.has(nums[i])) return true;
    window.add(nums[i]);
    if (window.size > k) window.delete(nums[i - k]);
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "This fixed-size-window deduplication pattern is the core of idempotency-key caches in API gateways: keep only the last k request IDs in a bounded LRU set, reject duplicates that arrive within that window, and evict the oldest to bound memory — used in Stripe's and Twilio's payment deduplication systems.",
  },
  {
    id: "sliding-window-04",
    title: "Maximum Number of Vowels in a Substring of Given Length",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window", "String"],
    statement: "Given a string s and an integer k, return the maximum number of vowel letters in any substring of s with length k.",
    examples: [
      { input: "s = \"abciiidef\", k = 3", output: "3", explanation: "Substring \"iii\" has 3 vowels." },
      { input: "s = \"aeiou\", k = 2", output: "2" },
    ],
    intuition: "Slide a window of size k across the string, tracking a vowel count. When the window moves, subtract 1 if the outgoing character is a vowel and add 1 if the incoming one is.",
    approach: [
      "Count vowels in the first k characters.",
      "Slide from index k to end: if s[i] is a vowel add 1; if s[i-k] is a vowel subtract 1.",
      "Update max vowel count each step.",
    ],
    solution: `function maxVowels(s, k) {
  const vowels = new Set(["a","e","i","o","u"]);
  let count = 0;
  for (let i = 0; i < k; i++) if (vowels.has(s[i])) count++;
  let max = count;
  for (let i = k; i < s.length; i++) {
    if (vowels.has(s[i])) count++;
    if (vowels.has(s[i - k])) count--;
    max = Math.max(max, count);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Fixed-window feature counting is used in NLP pre-processing pipelines that compute n-gram statistics over text streams in one pass. Search-index builders (Lucene) slide fixed-size windows over tokens to compute term co-occurrence counts that feed into TF-IDF and BM25 ranking models.",
  },
  {
    id: "sliding-window-05",
    title: "Number of Sub-arrays of Size K and Average >= Threshold",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window"],
    statement: "Given an array arr, an integer k, and a threshold, return the number of sub-arrays of size k whose average is greater than or equal to threshold.",
    examples: [
      { input: "arr = [2,2,2,2,5,5,5,8], k = 3, threshold = 4", output: "3" },
      { input: "arr = [11,13,17,23,29,31,7,5,2,3], k = 3, threshold = 5", output: "6" },
    ],
    intuition: "Instead of dividing to get the average each time, compare the window sum against k * threshold — that avoids floating-point division inside the loop.",
    approach: [
      "Compute sum of first k elements.",
      "If sum >= k * threshold, increment count.",
      "Slide: add arr[i], subtract arr[i-k]; check condition.",
      "Return count.",
    ],
    solution: `function numOfSubarrays(arr, k, threshold) {
  const target = k * threshold;
  let sum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let count = sum >= target ? 1 : 0;
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];
    if (sum >= target) count++;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Threshold-filtered rolling windows underlie SLA monitoring: count the number of 5-minute windows in the last hour where average latency exceeded a threshold. Time-series databases like InfluxDB and TimescaleDB implement this as a continuous query that updates a materialized counter on each new data point.",
  },
  {
    id: "sliding-window-06",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Easy",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      { input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is \"abc\" with length 3." },
      { input: "s = \"bbbbb\"", output: "1" },
      { input: "s = \"pwwkew\"", output: "3" },
    ],
    intuition: "Use two pointers for a window with no duplicates. When a duplicate enters from the right, move the left pointer forward until the duplicate is gone.",
    approach: [
      "Use a Map from character to its latest index, and a left pointer.",
      "For each right index: if the character is in the map and its stored index >= left, move left to that index + 1.",
      "Update the map and track the maximum window size.",
    ],
    solution: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let left = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right]) && map.get(s[right]) >= left) {
      left = map.get(s[right]) + 1;
    }
    map.set(s[right], right);
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(min(n,m))" },
    systemDesign: "Longest unique-element window logic is used in session-token uniqueness validators and in database connection-pool managers that enforce no-duplicate-connection rules within a rolling time window. CDN cache-key uniqueness checks across a request burst use the same principle.",
  },
  {
    id: "sliding-window-07",
    title: "Maximum Consecutive Ones III",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window"],
    statement: "Given a binary array nums and an integer k, return the maximum number of consecutive 1s in the array if you can flip at most k 0s.",
    examples: [
      { input: "nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2", output: "6" },
      { input: "nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1,0], k = 3", output: "10" },
    ],
    intuition: "Slide a window that is allowed to contain at most k zeros. When the count of zeros exceeds k, shrink from the left until you drop one zero.",
    approach: [
      "Track zeros count in the window and left pointer.",
      "Expand right; if nums[right] == 0, increment zeros.",
      "While zeros > k, if nums[left] == 0 decrement zeros; advance left.",
      "Track max window size.",
    ],
    solution: `function longestOnes(nums, k) {
  let left = 0, zeros = 0, max = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    while (zeros > k) {
      if (nums[left] === 0) zeros--;
      left++;
    }
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "At-most-k-defects windows model error-burst tolerance in network packet streams — find the longest run where at most k packets were lost, guiding retransmission thresholds. Forward error correction (FEC) in streaming video (HLS, DASH) uses a similar budget to decide when to insert redundancy packets.",
  },
  {
    id: "sliding-window-08",
    title: "Fruit Into Baskets",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window", "Hashing"],
    statement: "You have two baskets that can each hold only one type of fruit. Given an integer array fruits where fruits[i] is the type of fruit at tree i, return the maximum number of fruits you can collect by picking from a contiguous section of trees, using at most two baskets.",
    examples: [
      { input: "fruits = [1,2,1]", output: "3" },
      { input: "fruits = [0,1,2,2]", output: "3" },
      { input: "fruits = [1,2,3,2,2]", output: "4" },
    ],
    intuition: "This is 'longest subarray with at most 2 distinct values'. Slide a window and keep a frequency map of types inside. When the map exceeds 2 types, shrink from the left.",
    approach: [
      "Use a frequency map and left pointer.",
      "Expand right, add fruits[right] to map.",
      "While map has more than 2 keys, decrement fruits[left]; remove if count reaches 0; advance left.",
      "Track max window size.",
    ],
    solution: `function totalFruit(fruits) {
  const map = new Map();
  let left = 0, max = 0;
  for (let right = 0; right < fruits.length; right++) {
    map.set(fruits[right], (map.get(fruits[right]) || 0) + 1);
    while (map.size > 2) {
      const lf = fruits[left];
      map.set(lf, map.get(lf) - 1);
      if (map.get(lf) === 0) map.delete(lf);
      left++;
    }
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "At-most-2-distinct windows appear in multi-tenant rate limiting where each API gateway node tracks at most two high-priority tenants in a hot-path cache. Distributed caches with small L1 budgets (like CPU TLBs) exhibit this pattern when they can only hold entries for a small number of address spaces simultaneously.",
  },
  {
    id: "sliding-window-09",
    title: "Longest Subarray of 1's After Deleting One Element",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window"],
    statement: "Given a binary array nums, return the length of the longest subarray containing only 1s after deleting exactly one element from the array.",
    examples: [
      { input: "nums = [1,1,0,1]", output: "3" },
      { input: "nums = [0,1,1,1,0,1,1,0,1]", output: "5" },
      { input: "nums = [1,1,1]", output: "2", explanation: "Must delete one element, so answer is 2." },
    ],
    intuition: "Allow at most one zero in the window (that is the deleted slot). The answer is the best window size minus 1 for the mandatory deletion.",
    approach: [
      "Slide a window allowing at most one zero.",
      "When zeros exceed 1, shrink from the left.",
      "Track max as right - left (not +1, since one element is deleted).",
    ],
    solution: `function longestSubarray(nums) {
  let left = 0, zeros = 0, best = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    while (zeros > 1) {
      if (nums[left] === 0) zeros--;
      left++;
    }
    best = Math.max(best, right - left);
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "This 'one free skip' window models fault-tolerant streaming pipelines that can tolerate at most one missing heartbeat before triggering an alert. Health-check systems in Kubernetes use similar rolling windows with a single failure allowance before marking a pod as unhealthy.",
  },
  {
    id: "sliding-window-10",
    title: "Subarray Product Less Than K",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window"],
    statement: "Given an array of positive integers nums and a positive integer k, return the number of contiguous subarrays where the product of all elements is strictly less than k.",
    examples: [
      { input: "nums = [10,5,2,6], k = 100", output: "8" },
      { input: "nums = [1,2,3], k = 0", output: "0" },
    ],
    intuition: "Maintain a sliding window whose product stays below k. When the product reaches or exceeds k, shrink from the left. Each valid right endpoint contributes exactly (right - left + 1) new subarrays.",
    approach: [
      "Track product = 1 and left pointer.",
      "Expand right, multiply product by nums[right].",
      "While product >= k, divide by nums[left] and advance left.",
      "Add right - left + 1 to the count.",
    ],
    solution: `function numSubarrayProductLessThanK(nums, k) {
  if (k <= 1) return 0;
  let prod = 1, left = 0, count = 0;
  for (let right = 0; right < nums.length; right++) {
    prod *= nums[right];
    while (prod >= k) prod /= nums[left++];
    count += right - left + 1;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Product-bounded windows appear in multiplicative risk models for financial portfolios, where you seek the longest run of assets whose combined volatility factor stays within a risk budget. Real-time fraud-detection engines use product-of-scores windows to flag transaction chains where cumulative risk exceeds a threshold.",
  },
  {
    id: "sliding-window-11",
    title: "Get Equal Substrings Within Budget",
    difficulty: "Easy",
    tags: ["String", "Sliding Window"],
    statement: "You are given two strings s and t of the same length and an integer maxCost. Change s to t by replacing characters at the same index. The cost of replacing s[i] with t[i] is abs(s[i] - t[i]). Return the maximum length of a substring of s that can be changed to the same substring of t within the budget maxCost.",
    examples: [
      { input: "s = \"abcd\", t = \"bcdf\", maxCost = 3", output: "3" },
      { input: "s = \"abcd\", t = \"cdef\", maxCost = 3", output: "1" },
    ],
    intuition: "Pre-compute the cost array (abs differences), then find the longest subarray whose sum does not exceed maxCost using a sliding window.",
    approach: [
      "Build cost[i] = Math.abs(s.charCodeAt(i) - t.charCodeAt(i)).",
      "Slide a variable window: expand right, add cost[right].",
      "While total cost > maxCost, subtract cost[left] and advance left.",
      "Track max window size.",
    ],
    solution: `function equalSubstring(s, t, maxCost) {
  let left = 0, total = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    total += Math.abs(s.charCodeAt(right) - t.charCodeAt(right));
    while (total > maxCost) {
      total -= Math.abs(s.charCodeAt(left) - t.charCodeAt(left));
      left++;
    }
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Budget-bounded sliding windows model schema-migration cost windows in database upgrades: find the longest consecutive batch of column transformations that fits within a maintenance-window budget. Cloud cost-optimisation tools use the same approach to find the longest continuous resource-scaling event that stays under a spend cap.",
  },
  {
    id: "sliding-window-12",
    title: "Grumpy Bookstore Owner",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window"],
    statement: "A bookstore owner is grumpy at certain minutes. Using a secret technique for exactly minutes consecutive minutes, the owner can suppress grumpiness. Given customers[], grumpy[], and minutes, return the maximum satisfied customers.",
    examples: [
      { input: "customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3", output: "16" },
      { input: "customers = [1], grumpy = [0], minutes = 1", output: "1" },
    ],
    intuition: "Always count customers during non-grumpy minutes. Then slide a window of size 'minutes' to find where suppressing grumpiness gains the most extra customers.",
    approach: [
      "Sum up customers in all non-grumpy minutes — that is the guaranteed base.",
      "Compute extra gain for the first window of 'minutes' grumpy slots.",
      "Slide the window, updating extra gain.",
      "Return base + max extra gain.",
    ],
    solution: `function maxSatisfied(customers, grumpy, minutes) {
  let base = 0;
  for (let i = 0; i < customers.length; i++) {
    if (grumpy[i] === 0) base += customers[i];
  }
  let extra = 0;
  for (let i = 0; i < minutes; i++) {
    if (grumpy[i] === 1) extra += customers[i];
  }
  let maxExtra = extra;
  for (let i = minutes; i < customers.length; i++) {
    if (grumpy[i] === 1) extra += customers[i];
    if (grumpy[i - minutes] === 1) extra -= customers[i - minutes];
    maxExtra = Math.max(maxExtra, extra);
  }
  return base + maxExtra;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "This 'best fixed-window bonus' pattern models maintenance-window scheduling: given a system that is partially degraded, find the optimal continuous maintenance slot that maximises the total recovered throughput. SRE teams use rolling-window analysis to pick the least-impact deployment window.",
  },
  {
    id: "sliding-window-13",
    title: "Maximum Points You Can Obtain from Cards",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window"],
    statement: "There are several cards in a row. You may take exactly k cards from the front or the back. Return the maximum score you can obtain by choosing k cards.",
    examples: [
      { input: "cardPoints = [1,2,3,4,5,6,1], k = 3", output: "12" },
      { input: "cardPoints = [2,2,2], k = 2", output: "4" },
    ],
    intuition: "Instead of choosing which cards to take, find the contiguous subarray of length n-k to leave behind. Minimising that window's sum maximises the score.",
    approach: [
      "Compute total sum and find the minimum sum window of size n - k.",
      "Return total - minWindowSum.",
    ],
    solution: `function maxScore(cardPoints, k) {
  const n = cardPoints.length;
  const winSize = n - k;
  if (winSize === 0) return cardPoints.reduce((a, b) => a + b, 0);
  let total = cardPoints.reduce((a, b) => a + b, 0);
  let winSum = cardPoints.slice(0, winSize).reduce((a, b) => a + b, 0);
  let minWin = winSum;
  for (let i = winSize; i < n; i++) {
    winSum += cardPoints[i] - cardPoints[i - winSize];
    minWin = Math.min(minWin, winSum);
  }
  return total - minWin;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Minimising a fixed inner window to maximise an outer selection is a resource-scheduling pattern: in cloud batch jobs, leave behind the cheapest contiguous idle period to minimise cost while maximising the work you do at the start and end of a billing window.",
  },
  {
    id: "sliding-window-14",
    title: "Take K of Each Character From Left and Right",
    difficulty: "Easy",
    tags: ["String", "Sliding Window"],
    statement: "You are given a string s consisting of 'a', 'b', 'c' and an integer k. Each minute you take either the leftmost or rightmost character. Return the minimum number of minutes to have at least k of each character, or -1 if impossible.",
    examples: [
      { input: "s = \"aabaaaacaabc\", k = 2", output: "8" },
      { input: "s = \"a\", k = 1", output: "-1" },
    ],
    intuition: "Flip perspective: find the longest middle window to skip such that the remaining characters still have at least k of each. This turns a two-sided pick problem into a standard sliding-window problem.",
    approach: [
      "Check totals; if any character count < k return -1.",
      "Compute remaining = total counts minus target k each.",
      "Slide a window, expanding right if its counts stay within remaining.",
      "The answer is n minus the longest valid middle window.",
    ],
    solution: `function takeCharacters(s, k) {
  if (k === 0) return 0;
  const total = [0, 0, 0];
  for (const c of s) total[c.charCodeAt(0) - 97]++;
  if (total.some(v => v < k)) return -1;
  const limit = total.map(v => v - k);
  const win = [0, 0, 0];
  let left = 0, maxWin = 0;
  for (let right = 0; right < s.length; right++) {
    const idx = s.charCodeAt(right) - 97;
    win[idx]++;
    while (win[idx] > limit[idx]) {
      win[s.charCodeAt(left) - 97]--;
      left++;
    }
    maxWin = Math.max(maxWin, right - left + 1);
  }
  return s.length - maxWin;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Complement-window thinking (find the largest part to skip so constraints are satisfied outside it) is used in partial-index builds in databases: identify the largest contiguous key range that can remain unindexed while still satisfying query-coverage requirements, minimising index-build time.",
  },
  {
    id: "sliding-window-15",
    title: "Longest Repeating Character Replacement",
    difficulty: "Easy",
    tags: ["String", "Sliding Window"],
    statement: "Given a string s and an integer k, you can replace at most k characters in the string with any letter. Return the length of the longest substring containing the same letter after performing at most k replacements.",
    examples: [
      { input: "s = \"ABAB\", k = 2", output: "4" },
      { input: "s = \"AABABBA\", k = 1", output: "4" },
    ],
    intuition: "In a valid window, the number of characters to replace equals (window length - count of the most frequent character). If that exceeds k, shrink from the left.",
    approach: [
      "Maintain a frequency map and track the max frequency seen so far.",
      "For each right: update freq map.",
      "If (window size - maxFreq) > k, shrink from left.",
      "Track max window size.",
    ],
    solution: `function characterReplacement(s, k) {
  const freq = {};
  let left = 0, maxFreq = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    freq[s[right]] = (freq[s[right]] || 0) + 1;
    maxFreq = Math.max(maxFreq, freq[s[right]]);
    if ((right - left + 1) - maxFreq > k) {
      freq[s[left]]--;
      left++;
    }
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "The 'budget-for-replacements' window models canary deployments: find the longest continuous deployment window where at most k percent of instances differ from the target version, maximising the consistent cohort size for A/B testing without exceeding a change budget.",
  },
  {
    id: "sliding-window-16",
    title: "Permutation in String",
    difficulty: "Easy",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given two strings s1 and s2, return true if s2 contains a permutation of s1, i.e. one of s1's permutations is a substring of s2.",
    examples: [
      { input: "s1 = \"ab\", s2 = \"eidbaooo\"", output: "true" },
      { input: "s1 = \"ab\", s2 = \"eidboaoo\"", output: "false" },
    ],
    intuition: "A permutation of s1 is just any arrangement of s1's characters. So we need a fixed window of length s1.length in s2 where character frequencies exactly match s1.",
    approach: [
      "Build frequency arrays (size 26) for s1 and the first window of s2.",
      "Slide the window: add the new right character, remove the old left character.",
      "At each step compare the two frequency arrays.",
    ],
    solution: `function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  const need = new Array(26).fill(0);
  const have = new Array(26).fill(0);
  const a = "a".charCodeAt(0);
  for (let i = 0; i < s1.length; i++) {
    need[s1.charCodeAt(i) - a]++;
    have[s2.charCodeAt(i) - a]++;
  }
  if (need.join() === have.join()) return true;
  for (let i = s1.length; i < s2.length; i++) {
    have[s2.charCodeAt(i) - a]++;
    have[s2.charCodeAt(i - s1.length) - a]--;
    if (need.join() === have.join()) return true;
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Fixed-window character-frequency matching is used in DNA sequence alignment tools (BLAST) to find whether a query motif occurs anywhere in a genome. Intrusion-detection systems use the same sliding-frequency-window to detect known malicious byte-sequence permutations in network payloads.",
  },
  {
    id: "sliding-window-17",
    title: "Binary Subarrays With Sum",
    difficulty: "Easy",
    tags: ["Array", "Sliding Window", "Hashing", "Prefix Sum"],
    statement: "Given a binary array nums and an integer goal, return the number of non-empty subarrays with a sum equal to goal.",
    examples: [
      { input: "nums = [1,0,1,0,1], goal = 2", output: "4" },
      { input: "nums = [0,0,0,0,0], goal = 0", output: "15" },
    ],
    intuition: "Count subarrays with sum at most goal, then subtract those with sum at most goal-1. The difference is exactly the count with sum equal to goal.",
    approach: [
      "Define helper atMost(k): counts subarrays with sum <= k using a sliding window.",
      "Return atMost(goal) - atMost(goal - 1).",
    ],
    solution: `function numSubarraysWithSum(nums, goal) {
  function atMost(k) {
    if (k < 0) return 0;
    let res = 0, left = 0, sum = 0;
    for (let right = 0; right < nums.length; right++) {
      sum += nums[right];
      while (sum > k) sum -= nums[left++];
      res += right - left + 1;
    }
    return res;
  }
  return atMost(goal) - atMost(goal - 1);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "The complement-count trick (exact = atMost(k) - atMost(k-1)) is a standard pattern in analytics databases for 'exact-value bucket' queries — compute two prefix-aggregate values and subtract rather than filtering on equality, which is how columnar stores implement histogram equi-depth bucketing.",
  },
  // ---- MEDIUM (18 problems) ----
  {
    id: "sliding-window-18",
    title: "Find All Anagrams in a String",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given two strings s and p, return a list of all start indices of p's anagrams in s. The answer may be returned in any order.",
    examples: [
      { input: "s = \"cbaebabacd\", p = \"abc\"", output: "[0,6]" },
      { input: "s = \"abab\", p = \"ab\"", output: "[0,1,2]" },
    ],
    intuition: "Slide a fixed window of size p.length across s. If the character frequencies in the window match p's frequencies, record the start index.",
    approach: [
      "Build frequency arrays for p and the first window of s.",
      "Compare; if equal push index 0.",
      "Slide: add right character, remove left character, compare again.",
    ],
    solution: `function findAnagrams(s, p) {
  const result = [];
  if (s.length < p.length) return result;
  const pFreq = new Array(26).fill(0);
  const wFreq = new Array(26).fill(0);
  const a = 97;
  for (let i = 0; i < p.length; i++) {
    pFreq[p.charCodeAt(i) - a]++;
    wFreq[s.charCodeAt(i) - a]++;
  }
  if (pFreq.join() === wFreq.join()) result.push(0);
  for (let i = p.length; i < s.length; i++) {
    wFreq[s.charCodeAt(i) - a]++;
    wFreq[s.charCodeAt(i - p.length) - a]--;
    if (pFreq.join() === wFreq.join()) result.push(i - p.length + 1);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Anagram detection over a sliding window is used in plagiarism detection engines that look for reordered token sequences in documents, and in network intrusion systems that scan for shuffled byte sequences matching known exploit signatures across packet payloads.",
  },
  {
    id: "sliding-window-19",
    title: "Longest Substring with At Most Two Distinct Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given a string s, return the length of the longest substring that contains at most two distinct characters.",
    examples: [
      { input: "s = \"eceba\"", output: "3", explanation: "Substring \"ece\" has at most 2 distinct characters." },
      { input: "s = \"ccaabbb\"", output: "5" },
    ],
    intuition: "Slide a window and keep a frequency map. When the map grows to more than 2 entries, shrink from the left until only 2 types remain.",
    approach: [
      "Use a frequency map and left pointer.",
      "Expand right, add s[right] to map.",
      "While map.size > 2, decrement s[left]; delete if 0; advance left.",
      "Track max window size.",
    ],
    solution: `function lengthOfLongestSubstringTwoDistinct(s) {
  const map = new Map();
  let left = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    map.set(s[right], (map.get(s[right]) || 0) + 1);
    while (map.size > 2) {
      const lc = s[left++];
      map.set(lc, map.get(lc) - 1);
      if (map.get(lc) === 0) map.delete(lc);
    }
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Two-distinct-key windows model dual-tenant hot-shard detection in multi-tenant databases: find the longest continuous time window where only two tenants dominate I/O, flagging resource contention. A/B experiment analysis uses a 2-variant sliding window to measure the longest period of stable variant dominance.",
  },
  {
    id: "sliding-window-20",
    title: "Longest Substring with At Most K Distinct Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given a string s and an integer k, return the length of the longest substring that contains at most k distinct characters.",
    examples: [
      { input: "s = \"eceba\", k = 2", output: "3" },
      { input: "s = \"aa\", k = 1", output: "2" },
    ],
    intuition: "Generalise the two-distinct version. Slide a window and keep a frequency map; when the map exceeds k distinct characters, shrink from the left.",
    approach: [
      "Use a frequency map and left pointer.",
      "Expand right; add to map.",
      "While map.size > k, shrink from left.",
      "Track max window size.",
    ],
    solution: `function lengthOfLongestSubstringKDistinct(s, k) {
  if (k === 0) return 0;
  const map = new Map();
  let left = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    map.set(s[right], (map.get(s[right]) || 0) + 1);
    while (map.size > k) {
      const lc = s[left++];
      map.set(lc, map.get(lc) - 1);
      if (map.get(lc) === 0) map.delete(lc);
    }
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "K-distinct-key windows are the basis of working-set models in operating systems — the OS tracks at most k pages in the working set for a process; exceeding k triggers a page eviction, directly mirroring the left-shrink step. Distributed caches use this model to bound hot-key tracking to k tenants per shard.",
  },
  {
    id: "sliding-window-21",
    title: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window", "Two Pointers"],
    statement: "Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray whose sum is greater than or equal to target. Return 0 if no such subarray exists.",
    examples: [
      { input: "nums = [2,3,1,2,4,3], target = 7", output: "2" },
      { input: "nums = [1,4,4], target = 4", output: "1" },
      { input: "nums = [1,1,1,1,1,1,1,1], target = 11", output: "0" },
    ],
    intuition: "Expand the right pointer to accumulate sum; once the sum meets the target, shrink from the left to find the tightest possible window.",
    approach: [
      "Initialize left = 0, sum = 0, minLen = Infinity.",
      "Expand right, add nums[right] to sum.",
      "While sum >= target: update minLen, subtract nums[left], advance left.",
      "Return minLen === Infinity ? 0 : minLen.",
    ],
    solution: `function minSubArrayLen(target, nums) {
  let left = 0, sum = 0, min = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      min = Math.min(min, right - left + 1);
      sum -= nums[left++];
    }
  }
  return min === Infinity ? 0 : min;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Variable-size shrink-on-threshold windows are the engine behind TCP congestion control: the receiver advertises a window size; the sender expands it until a threshold (packet loss), then immediately shrinks. API gateway rate-limiters use the same expand/shrink logic to enforce burst quotas.",
  },
  {
    id: "sliding-window-22",
    title: "Count Number of Nice Subarrays",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window", "Hashing"],
    statement: "Given an array of integers nums and an integer k, return the number of contiguous subarrays that contain exactly k odd numbers.",
    examples: [
      { input: "nums = [1,1,2,1,1], k = 3", output: "2" },
      { input: "nums = [2,4,6], k = 1", output: "0" },
    ],
    intuition: "Exact-k problems are solved with the complement: count(atMost k) - count(atMost k-1). Use a sliding window that counts odd numbers.",
    approach: [
      "Define atMost(k): slide a window, expand right (count odd), shrink left when odds exceed k.",
      "Each valid right adds (right - left + 1) subarrays.",
      "Return atMost(k) - atMost(k-1).",
    ],
    solution: `function numberOfSubarrays(nums, k) {
  function atMost(k) {
    let res = 0, left = 0, odds = 0;
    for (let right = 0; right < nums.length; right++) {
      if (nums[right] % 2 !== 0) odds++;
      while (odds > k) {
        if (nums[left] % 2 !== 0) odds--;
        left++;
      }
      res += right - left + 1;
    }
    return res;
  }
  return atMost(k) - atMost(k - 1);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Exact-k complement counting is used in analytics databases for 'exactly k events in a window' queries — compute two prefix aggregates and subtract, which is how ClickHouse implements window-function COUNTIF with exact equality predicates over large event tables.",
  },
  {
    id: "sliding-window-23",
    title: "Number of Substrings Containing All Three Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    statement: "Given a string s consisting only of 'a', 'b', 'c', return the number of substrings that contain at least one occurrence of all three characters.",
    examples: [
      { input: "s = \"abcabc\"", output: "10" },
      { input: "s = \"aaacb\"", output: "3" },
    ],
    intuition: "For each right pointer, find the smallest left such that the window contains all three characters. All substrings starting from any index 0..left and ending at right are valid, giving left+1 new valid substrings.",
    approach: [
      "Track last seen position of 'a', 'b', 'c'.",
      "At each right, update last[s[right]].",
      "If all three have been seen, add (1 + min of the three last positions) to count.",
    ],
    solution: `function numberOfSubstrings(s) {
  const last = { a: -1, b: -1, c: -1 };
  let count = 0;
  for (let right = 0; right < s.length; right++) {
    last[s[right]] = right;
    if (last.a !== -1 && last.b !== -1 && last.c !== -1) {
      count += 1 + Math.min(last.a, last.b, last.c);
    }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Counting substrings that cover a required set maps to coverage queries in log analytics: 'how many time windows in this log contain at least one error, warning, and info event?' — the same last-seen pointer trick is used in streaming log processors to efficiently count qualifying windows.",
  },
  {
    id: "sliding-window-24",
    title: "Replace the Substring for Balanced String",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    statement: "Given a string s of length n with characters 'Q', 'W', 'E', 'R', find the minimum length of a substring to replace so that each character appears exactly n/4 times.",
    examples: [
      { input: "s = \"QWER\"", output: "0" },
      { input: "s = \"QQWE\"", output: "1" },
    ],
    intuition: "The characters outside the replacement window must each appear at most n/4 times. Slide a window and shrink it as long as the outside still satisfies the constraint.",
    approach: [
      "Count total frequency; compute target = n/4.",
      "Slide a window: try the smallest window such that all outside counts are <= target.",
      "Shrink the window (move left) while the outside satisfies constraints.",
      "Track minimum window size.",
    ],
    solution: `function balancedString(s) {
  const n = s.length, target = n / 4;
  const count = { Q: 0, W: 0, E: 0, R: 0 };
  for (const c of s) count[c]++;
  if (Object.values(count).every(v => v === target)) return 0;
  let min = n, left = 0;
  for (let right = 0; right < n; right++) {
    count[s[right]]--;
    while (left <= right && Object.values(count).every(v => v <= target)) {
      min = Math.min(min, right - left + 1);
      count[s[left]]++;
      left++;
    }
  }
  return min;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Minimum-window-to-rebalance models hot-shard remediation in distributed databases: find the smallest contiguous key range to migrate so that every shard ends up with at most n/k rows, minimising the amount of data moved during rebalancing — used in Vitess and CockroachDB range-split strategies.",
  },
  {
    id: "sliding-window-25",
    title: "Frequency of the Most Frequent Element",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window", "Sorting"],
    statement: "Given an integer array nums and an integer k, you can increment any element by 1 in one operation. Return the maximum possible frequency of any element after performing at most k operations.",
    examples: [
      { input: "nums = [1,2,4], k = 5", output: "3", explanation: "Increment 1 twice and 2 once to get [3,3,4] — no, better: [4,4,4] needs 5 ops. [3,4,4] needs 3 ops. Let's think: sort gives [1,2,4]. Make two 4s: cost=1. Make three 4s: cost=1+2=3<=5 but length is only 3. Correct output is 3." },
      { input: "nums = [1,4,8,13], k = 5", output: "2" },
    ],
    intuition: "Sort the array. In a window ending at right, the cost to make all elements equal to nums[right] is nums[right] * windowSize - windowSum. If cost exceeds k, shrink from left.",
    approach: [
      "Sort nums.",
      "Slide a window; maintain running windowSum.",
      "While nums[right] * (right - left + 1) - windowSum > k, subtract nums[left] and advance left.",
      "Track max window size.",
    ],
    solution: `function maxFrequency(nums, k) {
  nums.sort((a, b) => a - b);
  let left = 0, sum = 0, max = 1;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (nums[right] * (right - left + 1) - sum > k) {
      sum -= nums[left++];
    }
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Cost-bounded uniformisation windows model cache-warming budgets: given a budget of k pre-fetch operations, find the largest contiguous set of keys that can all be brought to the same cache tier, maximising the cache-hit cohort size for a streaming workload.",
  },
  {
    id: "sliding-window-26",
    title: "Maximize the Confusion of an Exam",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    statement: "A teacher can change at most k answers on an exam from 'T' to 'F' or from 'F' to 'T'. Return the maximum length of a consecutive run of the same answer.",
    examples: [
      { input: "answerKey = \"TTFF\", k = 2", output: "4" },
      { input: "answerKey = \"TFFT\", k = 1", output: "3" },
    ],
    intuition: "Run the Longest Repeating Character Replacement approach twice: once allowing at most k T-to-F flips, once for F-to-T flips, and take the maximum.",
    approach: [
      "Define maxWindow(s, ch, k): slide a window counting characters != ch; if count > k, shrink left.",
      "Call for ch='T' and ch='F'; return the overall max.",
    ],
    solution: `function maxConsecutiveAnswers(answerKey, k) {
  function maxWindow(ch) {
    let left = 0, others = 0, max = 0;
    for (let right = 0; right < answerKey.length; right++) {
      if (answerKey[right] !== ch) others++;
      while (others > k) {
        if (answerKey[left] !== ch) others--;
        left++;
      }
      max = Math.max(max, right - left + 1);
    }
    return max;
  }
  return Math.max(maxWindow("T"), maxWindow("F"));
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Running two parallel windows for opposite targets is used in feature-flag rollout systems: find the longest deployment window where either 'on' or 'off' cohorts can be made uniform with at most k overrides, helping engineers minimise the manual override cost during gradual rollouts.",
  },
  {
    id: "sliding-window-27",
    title: "Maximum Erasure Value",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window", "Hashing"],
    statement: "Given an array of positive integers nums, return the maximum sum of a subarray with all unique elements.",
    examples: [
      { input: "nums = [4,2,4,5,6]", output: "17", explanation: "Subarray [2,4,5,6] has sum 17." },
      { input: "nums = [5,2,1,2,5,2,1,2,5]", output: "8" },
    ],
    intuition: "Slide a window with no duplicates. When a duplicate enters, move the left pointer past the earlier occurrence of that duplicate, dropping its sum contribution.",
    approach: [
      "Use a Map from value to last index.",
      "Expand right; if nums[right] was seen and its index >= left, update left and subtract the dropped sum.",
      "Add nums[right] to running sum; update max.",
    ],
    solution: `function maximumUniqueSubarray(nums) {
  const lastSeen = new Map();
  let left = 0, sum = 0, max = 0;
  for (let right = 0; right < nums.length; right++) {
    if (lastSeen.has(nums[right]) && lastSeen.get(nums[right]) >= left) {
      const prev = lastSeen.get(nums[right]);
      for (let i = left; i <= prev; i++) sum -= nums[i];
      left = prev + 1;
    }
    sum += nums[right];
    max = Math.max(max, sum);
    lastSeen.set(nums[right], right);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Maximum-sum unique-element windows model session-revenue maximisation in e-commerce: find the longest browsing session where every product viewed is distinct, and maximise the total value of products in that session — the same pattern underlies recommendation-diversity engines that cap repeated item exposure.",
  },
  {
    id: "sliding-window-28",
    title: "Subarrays with K Different Integers",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window", "Hashing"],
    statement: "Given an integer array nums and an integer k, return the number of subarrays with exactly k different integers.",
    examples: [
      { input: "nums = [1,2,1,2,3], k = 2", output: "7" },
      { input: "nums = [1,2,1,3,4], k = 3", output: "3" },
    ],
    intuition: "Exact-k = atMost(k) - atMost(k-1). The atMost helper counts subarrays with at most k distinct integers using a standard sliding window with a frequency map.",
    approach: [
      "Define atMost(k): slide a window, maintain freq map, shrink left when map.size > k.",
      "Count += right - left + 1 at each step.",
      "Return atMost(k) - atMost(k-1).",
    ],
    solution: `function subarraysWithKDistinct(nums, k) {
  function atMost(k) {
    const map = new Map();
    let left = 0, res = 0;
    for (let right = 0; right < nums.length; right++) {
      map.set(nums[right], (map.get(nums[right]) || 0) + 1);
      while (map.size > k) {
        const lv = nums[left++];
        map.set(lv, map.get(lv) - 1);
        if (map.get(lv) === 0) map.delete(lv);
      }
      res += right - left + 1;
    }
    return res;
  }
  return atMost(k) - atMost(k - 1);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "Counting windows with exactly k distinct keys is used in multi-tenant analytics: count the number of time windows where exactly k customers were active, which feeds capacity-planning models for per-tenant resource isolation in SaaS platforms like Salesforce or Snowflake.",
  },
  {
    id: "sliding-window-29",
    title: "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window", "Monotonic Deque"],
    statement: "Given an array of integers nums and an integer limit, return the size of the longest non-empty subarray such that the absolute difference between any two elements of this subarray is less than or equal to limit.",
    examples: [
      { input: "nums = [8,2,4,7], limit = 4", output: "2" },
      { input: "nums = [10,1,2,4,7,2], limit = 5", output: "4" },
    ],
    intuition: "The condition |max - min| <= limit. Track the sliding window max and min with two monotonic deques — one increasing (for min) and one decreasing (for max). Shrink from left when the difference exceeds the limit.",
    approach: [
      "Maintain a max-deque (decreasing) and min-deque (increasing).",
      "Expand right; update both deques.",
      "While deque[0] values differ by more than limit, evict the front whose index is left, advance left.",
      "Track max window size.",
    ],
    solution: `function longestSubarray(nums, limit) {
  const maxD = [], minD = [];
  let left = 0, max = 0;
  for (let right = 0; right < nums.length; right++) {
    while (maxD.length && nums[maxD[maxD.length - 1]] <= nums[right]) maxD.pop();
    while (minD.length && nums[minD[minD.length - 1]] >= nums[right]) minD.pop();
    maxD.push(right);
    minD.push(right);
    while (nums[maxD[0]] - nums[minD[0]] > limit) {
      left++;
      if (maxD[0] < left) maxD.shift();
      if (minD[0] < left) minD.shift();
    }
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Max-min bounded windows model price-range queries in financial systems: find the longest trade sequence where the bid-ask spread never exceeded a threshold. Real-time market surveillance systems use dual monotonic deques to maintain rolling max/min spread windows across millions of tick events per second.",
  },
  {
    id: "sliding-window-30",
    title: "Constrained Subsequence Sum",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window", "Dynamic Programming", "Monotonic Deque"],
    statement: "Given an integer array nums and an integer k, return the maximum sum of a non-empty subsequence of the array such that for every two consecutive integers in the subsequence nums[i] and nums[j], where i < j, it holds that j - i <= k.",
    examples: [
      { input: "nums = [10,2,-10,5,20], k = 2", output: "37" },
      { input: "nums = [-1,-2,-3], k = 1", output: "-1" },
    ],
    intuition: "dp[i] = nums[i] + max(0, max(dp[i-k..i-1])). Use a monotonic deque to get the window maximum in O(1) per step.",
    approach: [
      "dp[i] = nums[i] + max(0, max of dp values in the previous k positions).",
      "Maintain a decreasing deque of dp values with their indices.",
      "Evict front if out of window; pop back if smaller than current dp.",
    ],
    solution: `function constrainedSubsetSum(nums, k) {
  const n = nums.length;
  const dp = [...nums];
  const deque = []; // stores indices, dp values decreasing
  let max = -Infinity;
  for (let i = 0; i < n; i++) {
    if (deque.length && deque[0][0] < i - k) deque.shift();
    if (deque.length && deque[0][1] > 0) dp[i] += deque[0][1];
    while (deque.length && deque[deque.length - 1][1] <= dp[i]) deque.pop();
    deque.push([i, dp[i]]);
    max = Math.max(max, dp[i]);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Window-constrained DP with a deque-based optimisation is the backbone of hop-bounded route scoring in logistics networks: maximise the cumulative value of a delivery route where each stop can skip at most k-1 intermediate locations — the same recurrence appears in vehicle routing and supply-chain optimisation.",
  },
  {
    id: "sliding-window-31",
    title: "Count Subarrays Where Max Element Appears at Least K Times",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window"],
    statement: "Given an integer array nums and a positive integer k, return the number of subarrays where the maximum element of the array appears at least k times.",
    examples: [
      { input: "nums = [1,3,2,3,3], k = 2", output: "6" },
      { input: "nums = [1,4,2,1], k = 3", output: "0" },
    ],
    intuition: "Find the global maximum. Slide a window; whenever the max appears k times in the window, all extensions to the left (from index 0 to left) also satisfy the condition, adding left+1 valid subarrays.",
    approach: [
      "Compute the global max M.",
      "Slide left and right; track count of M in the window.",
      "Whenever count >= k, add left + 1 to result and shrink left by 1.",
    ],
    solution: `function countSubarrays(nums, k) {
  const M = Math.max(...nums);
  let left = 0, cnt = 0, res = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === M) cnt++;
    while (cnt >= k) {
      if (nums[left] === M) cnt--;
      left++;
      res += nums.length - right;
    }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Counting subarrays where a peak value appears a minimum number of times models SLA compliance reporting: count the number of monitoring windows where the peak-CPU machine exceeded the threshold at least k times, triggering an autoscale event — used in cloud auto-scaling heuristics.",
  },
  {
    id: "sliding-window-32",
    title: "Minimum Operations to Reduce X to Zero",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window"],
    statement: "Given an integer array nums and an integer x, return the minimum number of operations to reduce x to exactly 0 by removing elements from either end. Return -1 if it is not possible.",
    examples: [
      { input: "nums = [1,1,4,2,3], x = 5", output: "2" },
      { input: "nums = [5,6,7,8,9], x = 4", output: "-1" },
    ],
    intuition: "Removing from both ends to sum to x is equivalent to finding the longest subarray in the middle that sums to (total - x). Minimise operations = maximise the middle subarray length.",
    approach: [
      "Compute target = total - x. If target < 0 return -1.",
      "Find the longest subarray with sum == target using a sliding window.",
      "Answer = n - longestSubarray length; if not found return -1.",
    ],
    solution: `function minOperations(nums, x) {
  const total = nums.reduce((a, b) => a + b, 0);
  const target = total - x;
  if (target < 0) return -1;
  if (target === 0) return nums.length;
  let left = 0, sum = 0, maxLen = -1;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > target) sum -= nums[left++];
    if (sum === target) maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen === -1 ? -1 : nums.length - maxLen;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Complement-window reduction (reframe as find-the-middle subarray) models cache-eviction planning: to free exactly x bytes, find the largest contiguous group of blocks to keep (sum = total - x), minimising eviction count — the same pattern appears in memory defragmentation algorithms.",
  },
  {
    id: "sliding-window-33",
    title: "Count Subarrays with Fixed Bounds",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window"],
    statement: "Given an integer array nums and two integers minK and maxK, return the number of fixed-bound subarrays where both the minimum value is minK and the maximum value is maxK.",
    examples: [
      { input: "nums = [1,3,5,2,7,5], minK = 1, maxK = 5", output: "2" },
      { input: "nums = [1,1,1,1], minK = 1, maxK = 1", output: "10" },
    ],
    intuition: "Track the last positions of minK, maxK, and the last out-of-bound element. For each right, valid subarrays start from index (lastBad + 1) to min(lastMin, lastMax).",
    approach: [
      "Track lastBad (last index where value is outside [minK, maxK]).",
      "Track lastMin (last index where value == minK), lastMax (last index where value == maxK).",
      "Count += max(0, min(lastMin, lastMax) - lastBad).",
    ],
    solution: `function countSubarrays(nums, minK, maxK) {
  let lastBad = -1, lastMin = -1, lastMax = -1, res = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < minK || nums[i] > maxK) lastBad = i;
    if (nums[i] === minK) lastMin = i;
    if (nums[i] === maxK) lastMax = i;
    res += Math.max(0, Math.min(lastMin, lastMax) - lastBad);
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Fixed-bound subarray counting models compliance window reporting in regulated industries: count the number of time windows where the minimum and maximum observed metric both exactly match regulatory bounds — used in financial audit systems that verify trading ranges stay within approved limits.",
  },
  {
    id: "sliding-window-34",
    title: "K Radius Subarray Averages",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window"],
    statement: "Given a 0-indexed array nums of n integers and an integer k, return an array avgs of length n where avgs[i] is the average of nums in the range [i-k, i+k] inclusive, or -1 if the range is out of bounds.",
    examples: [
      { input: "nums = [7,4,3,9,1,8,5,2,6], k = 3", output: "[-1,-1,-1,5,-1,-1,-1,-1,-1]", explanation: "Only index 3 has a full k=3 radius window." },
      { input: "nums = [100000], k = 0", output: "[100000]" },
    ],
    intuition: "Use a fixed sliding window of size 2k+1. The window sum is ready once the right pointer reaches index 2k; the center of that window is index k, and it slides by 1 each step.",
    approach: [
      "Compute the sum of the first 2k+1 elements.",
      "Assign avgs[k] = sum / (2k+1).",
      "For each step, slide the window and assign avgs[center].",
      "All other positions remain -1.",
    ],
    solution: `function getAverages(nums, k) {
  const n = nums.length;
  const avgs = new Array(n).fill(-1);
  const winSize = 2 * k + 1;
  if (winSize > n) return avgs;
  let sum = 0;
  for (let i = 0; i < winSize; i++) sum += nums[i];
  avgs[k] = Math.floor(sum / winSize);
  for (let i = winSize; i < n; i++) {
    sum += nums[i] - nums[i - winSize];
    avgs[i - k] = Math.floor(sum / winSize);
  }
  return avgs;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Radius-averaged smoothing is used in time-series signal processing (moving-average filters in telemetry dashboards) and in geospatial analytics where each grid cell's value is smoothed using its k-radius neighbourhood — the same approach powers spatial aggregation in PostGIS raster queries.",
  },
  {
    id: "sliding-window-35",
    title: "Minimum Window Subsequence",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Dynamic Programming"],
    statement: "Given strings s1 and s2, return the minimum window in s1 which contains s2 as a subsequence. If no such window exists, return an empty string.",
    examples: [
      { input: "s1 = \"abcdebdde\", s2 = \"bde\"", output: "\"bcde\"" },
      { input: "s1 = \"jmeqksfrsdj\", s2 = \"sjf\"", output: "\"srsdj\"" },
    ],
    intuition: "Scan left to right to find where all of s2 is matched as a subsequence. Then scan back from that end to find the tightest left boundary. Restart from the next index after the left boundary.",
    approach: [
      "Use pointer j to track s2 position.",
      "Scan right through s1; when chars match, advance j.",
      "When j reaches s2.length, scan backwards from right to find the minimal window.",
      "Record if smaller than best; restart from the found left+1.",
    ],
    solution: `function minWindow(s1, s2) {
  let best = "", i = 0;
  while (i < s1.length) {
    let j = 0;
    while (i < s1.length && j < s2.length) {
      if (s1[i] === s2[j]) j++;
      i++;
    }
    if (j < s2.length) break;
    let end = i;
    j = s2.length - 1;
    i--;
    while (j >= 0) {
      if (s1[i] === s2[j]) j--;
      i--;
    }
    i++;
    const candidate = s1.slice(i, end);
    if (!best || candidate.length < best.length) best = candidate;
    i++;
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n*m)", space: "O(1)" },
    systemDesign: "Minimum-window-subsequence models the tightest audit-trail window in compliance systems: find the shortest event log segment that contains a required sequence of audit events in order (e.g. login → access → logout), minimising the evidence window for forensic analysis.",
  },
  // ---- HARD (15 problems) ----
  {
    id: "sliding-window-36",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given strings s and t, return the minimum window substring of s that contains every character of t (including duplicates). Return an empty string if no such window exists.",
    examples: [
      { input: "s = \"ADOBECODEBANC\", t = \"ABC\"", output: "\"BANC\"" },
      { input: "s = \"a\", t = \"a\"", output: "\"a\"" },
      { input: "s = \"a\", t = \"aa\"", output: "\"\"" },
    ],
    intuition: "Expand the right pointer until all of t's characters are covered, then shrink from the left to minimise the window while keeping it valid. Repeat until the right pointer reaches the end.",
    approach: [
      "Build a need map for t. Track formed (distinct chars fully satisfied).",
      "Expand right; when a char's window count meets need, increment formed.",
      "When formed == need.size, try to shrink from left; record min window.",
      "Shrink until the window is invalid again.",
    ],
    solution: `function minWindow(s, t) {
  if (!t || !s) return "";
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  const have = new Map();
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
    systemDesign: "Minimum-window-substring is the pattern behind query-snippet generation in search engines (shortest passage covering all query terms) and SIEM systems that find the tightest log event sequence covering a full attack pattern — Elasticsearch's span queries implement this exact shrink-expand logic.",
  },
  {
    id: "sliding-window-37",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window", "Deque", "Monotonic Queue"],
    statement: "Given an integer array nums and an integer k, return an array of the maximum values in each sliding window of size k.",
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    intuition: "Use a deque that stores indices in decreasing order of their values. The front is always the max. Evict the front if it falls outside the window; evict the back if its value is <= the new element (it can never be the max).",
    approach: [
      "Maintain a deque of indices (values in decreasing order).",
      "For each index i: evict front if out of window; evict back while nums[back] <= nums[i]; push i.",
      "Append nums[deque[0]] to result once the first full window is formed.",
    ],
    solution: `function maxSlidingWindow(nums, k) {
  const deque = [], res = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] < i - k + 1) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) res.push(nums[deque[0]]);
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "Monotonic deque max-windows power real-time top-bid tracking in financial exchanges and rolling-max CPU/memory dashboards in APM tools. Apache Flink's sliding-window max aggregate is implemented exactly this way, processing millions of events per second with O(1) amortised update cost per event.",
  },
  {
    id: "sliding-window-38",
    title: "Sliding Window Median",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window", "Heap", "Sorted Set"],
    statement: "Given an array nums and a sliding window size k, return the median array for each window of size k. The median is the middle value of a sorted list (or average of two middles for even k).",
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[1,-1,-1,3,5,6]" },
      { input: "nums = [1,2,3,4,2,3,1,4,2], k = 3", output: "[2,3,3,3,2,3,2]" },
    ],
    intuition: "Maintain two heaps: a max-heap for the lower half and a min-heap for the upper half, balanced so their sizes differ by at most one. Rebalance after adding and removing elements.",
    approach: [
      "Use a sorted array (simulated with insertion) of size k for simplicity.",
      "For each new window, insert the new element in sorted position, remove the outgoing element.",
      "Median is the middle (or average of two middles) of the sorted window.",
    ],
    solution: `function medianSlidingWindow(nums, k) {
  const res = [];
  const window = nums.slice(0, k).sort((a, b) => a - b);
  const getMedian = () => k % 2 === 1
    ? window[Math.floor(k / 2)]
    : (window[k / 2 - 1] + window[k / 2]) / 2;
  res.push(getMedian());
  for (let i = k; i < nums.length; i++) {
    // remove outgoing
    const removeIdx = window.indexOf(nums[i - k]);
    window.splice(removeIdx, 1);
    // insert incoming (binary search insertion)
    let lo = 0, hi = window.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (window[mid] <= nums[i]) lo = mid + 1; else hi = mid;
    }
    window.splice(lo, 0, nums[i]);
    res.push(getMedian());
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n*k)", space: "O(k)" },
    systemDesign: "Sliding-window medians power robust anomaly detection in time-series monitoring: the median is resistant to spikes unlike the mean, so SRE platforms (Datadog, New Relic) use rolling medians for baseline computation. Order-statistic trees (e.g. balanced BSTs) make this O(n log k) in production.",
  },
  {
    id: "sliding-window-39",
    title: "Minimum Number of K Consecutive Bit Flips",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window", "Greedy", "Bit Manipulation"],
    statement: "Given a binary array nums and an integer k, return the minimum number of k-bit flips required so that there are no 0s in the array. Return -1 if it is not possible.",
    examples: [
      { input: "nums = [0,1,0], k = 1", output: "2" },
      { input: "nums = [1,1,0], k = 2", output: "-1" },
      { input: "nums = [0,0,0,1,0,1,1,0], k = 3", output: "3" },
    ],
    intuition: "Greedily flip every 0 we encounter from left to right. To track how many flips affect the current position without modifying the array, maintain a difference array (flip window start markers) and a running flip parity.",
    approach: [
      "Use a difference array flipped[] and a running sum flipCount.",
      "At each index i, if i >= k, subtract flipped[i-k] from flipCount.",
      "Current effective value = nums[i] XOR (flipCount % 2).",
      "If effective value is 0, flip here: mark flipped[i] = 1, increment flipCount and result.",
      "If cannot flip (i + k > n), return -1.",
    ],
    solution: `function minKBitFlips(nums, k) {
  const n = nums.length;
  const flipped = new Array(n).fill(0);
  let flipCount = 0, result = 0;
  for (let i = 0; i < n; i++) {
    if (i >= k) flipCount -= flipped[i - k];
    if ((nums[i] + flipCount) % 2 === 0) {
      if (i + k > n) return -1;
      flipped[i] = 1;
      flipCount++;
      result++;
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Greedy range-flip with a difference array models bulk error-correction in storage: when a disk block sequence needs flipping (e.g. ECC correction), apply flips in contiguous runs of k blocks and track the flip parity with a difference array to avoid re-reading already-corrected blocks. RAID controllers use similar greedy stripe-correction.",
  },
  {
    id: "sliding-window-40",
    title: "Substring with Concatenation of All Words",
    difficulty: "Hard",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given a string s and an array of strings words of the same length, return all starting indices of substring(s) in s that is a concatenation of each word in words exactly once.",
    examples: [
      { input: "s = \"barfoothefoobarman\", words = [\"foo\",\"bar\"]", output: "[0,9]" },
      { input: "s = \"wordgoodgoodgoodbestword\", words = [\"word\",\"good\",\"best\",\"word\"]", output: "[]" },
    ],
    intuition: "A valid concatenation has a fixed total length. Slide a window of that length, chopping it into word-sized chunks and checking if they form exactly the given word multiset.",
    approach: [
      "Build a frequency map for words.",
      "For each of the wordLen starting offsets (0 to wordLen-1), run a sliding window of wordLen steps.",
      "Track word frequencies inside the window; shrink left when a word is over-counted or invalid.",
      "Record start indices when the window contains exactly all words.",
    ],
    solution: `function findSubstring(s, words) {
  const result = [];
  if (!s || !words.length) return result;
  const wordLen = words[0].length;
  const totalLen = wordLen * words.length;
  const wordCount = new Map();
  for (const w of words) wordCount.set(w, (wordCount.get(w) || 0) + 1);
  for (let start = 0; start < wordLen; start++) {
    let left = start, count = 0;
    const seen = new Map();
    for (let right = start; right + wordLen <= s.length; right += wordLen) {
      const word = s.slice(right, right + wordLen);
      if (wordCount.has(word)) {
        seen.set(word, (seen.get(word) || 0) + 1);
        count++;
        while (seen.get(word) > wordCount.get(word)) {
          const lw = s.slice(left, left + wordLen);
          seen.set(lw, seen.get(lw) - 1);
          count--;
          left += wordLen;
        }
        if (count === words.length) result.push(left);
      } else {
        seen.clear();
        count = 0;
        left = right + wordLen;
      }
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n * wordLen)", space: "O(words.length)" },
    systemDesign: "Multi-word fixed-window substring search is used in log-pattern matching for security operations: scan web server logs for fixed-format multi-token sequences (e.g. specific HTTP method + path + status code appearing consecutively) — the sliding word-window approach is used in Splunk and Elastic SIEM detection rules.",
  },
  {
    id: "sliding-window-41",
    title: "Minimum Window Subsequence (Hard Variant)",
    difficulty: "Hard",
    tags: ["String", "Sliding Window", "Dynamic Programming"],
    statement: "Given strings s and t, find the minimum length contiguous substring of s that contains t as a subsequence. Return the empty string if none exists.",
    examples: [
      { input: "s = \"abcde\", t = \"ace\"", output: "\"abcde\"" },
      { input: "s = \"cnhczmccqouqadqtmjjxlbwwkkebwkbfbmqdxgxfcnlqwnilfnrwjm\", t = \"mm\"", output: "\"mqdxgxfcnlqwnilfnrwjm\"" },
    ],
    intuition: "Forward scan to find the rightmost match of t as a subsequence. Then scan backward from that endpoint to tighten the left boundary. Restart from left+1 to find better candidates.",
    approach: [
      "Repeat: scan forward from i to match all of t; if matched, scan backward to find the tight left bound.",
      "Record candidate if shorter than best.",
      "Restart i from left + 1.",
    ],
    solution: `function minWindowSubsequence(s, t) {
  let best = "";
  let i = 0;
  while (i < s.length) {
    let j = 0;
    while (i < s.length && j < t.length) {
      if (s[i] === t[j]) j++;
      i++;
    }
    if (j < t.length) break;
    let end = i;
    j = t.length - 1;
    i--;
    while (j >= 0) {
      if (s[i] === t[j]) j--;
      i--;
    }
    i++;
    const candidate = s.slice(i, end);
    if (!best || candidate.length < best.length) best = candidate;
    i++;
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n * m)", space: "O(1)" },
    systemDesign: "Minimum subsequence windows model the tightest provenance chain in distributed tracing: given a trace timeline and a required sequence of span types (e.g. DB → cache → API), find the shortest contiguous trace segment that contains all span types in order — used in Jaeger and Zipkin trace-pattern analysis.",
  },
  {
    id: "sliding-window-42",
    title: "Subarrays with at Most K Distinct (Generalised)",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window", "Hashing"],
    statement: "Given an integer array nums and an integer k, return the number of subarrays with at most k distinct integers.",
    examples: [
      { input: "nums = [1,2,1,2,3], k = 2", output: "16" },
      { input: "nums = [1,2,1,3,4], k = 3", output: "19" },
    ],
    intuition: "Slide a window that contracts from the left whenever the number of distinct elements exceeds k. Each valid right position contributes (right - left + 1) subarrays.",
    approach: [
      "Maintain a frequency map and left pointer.",
      "Expand right; add to map.",
      "While map.size > k, shrink left.",
      "Add right - left + 1 to result.",
    ],
    solution: `function subarraysWithAtMostKDistinct(nums, k) {
  const map = new Map();
  let left = 0, res = 0;
  for (let right = 0; right < nums.length; right++) {
    map.set(nums[right], (map.get(nums[right]) || 0) + 1);
    while (map.size > k) {
      const lv = nums[left++];
      map.set(lv, map.get(lv) - 1);
      if (map.get(lv) === 0) map.delete(lv);
    }
    res += right - left + 1;
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "At-most-k distinct key windows are the foundation of working-set size estimation in database buffer pool management. The buffer pool can hold at most k distinct pages; the number of valid access sequences (subarrays) that fit is this count. Buffer pool optimisers use this to tune pool size for given workloads.",
  },
  {
    id: "sliding-window-43",
    title: "Maximum Sum of Subarray of Size at Least K with At Most One Replacement",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window", "Dynamic Programming"],
    statement: "Given an integer array nums and an integer k, return the maximum sum of a subarray of length at least k, where you can replace at most one element with any value (effectively, you can remove one element and pick the best scenario).",
    examples: [
      { input: "nums = [1,-1,1,-1,1], k = 3", output: "4", explanation: "Replace the middle -1 with the best: subarray [1,-1 replaced,1,-1,1] or consider [1,1,-1,1] = 2? Best is to drop the -1 in a 4-element window." },
      { input: "nums = [1,2,3,4,5], k = 2", output: "15" },
    ],
    intuition: "Use prefix sums. For each right endpoint, the best subarray of length >= k ending at right is prefix[right] - min(prefix[0..right-k]). Track the rolling minimum prefix sum as we advance right.",
    approach: [
      "Build prefix sums.",
      "For each right >= k, compute prefix[right] - minPrefix, where minPrefix is the minimum of prefix[0..right-k].",
      "Update minPrefix each step.",
      "Track max sum.",
    ],
    solution: `function maxSumWithKLength(nums, k) {
  const n = nums.length;
  const pre = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) pre[i + 1] = pre[i] + nums[i];
  let minPre = pre[0], max = -Infinity;
  for (let right = k; right <= n; right++) {
    minPre = Math.min(minPre, pre[right - k]);
    max = Math.max(max, pre[right] - minPre);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Prefix-sum minimum rolling queries are used in revenue attribution systems to find the peak revenue window of at least k days, excluding the worst performing segment. Real-time billing dashboards in cloud platforms use prefix-sum rolling minimums to compute maximum-value billing windows without rescanning history.",
  },
  {
    id: "sliding-window-44",
    title: "Longest Window with Sum at Most K (Non-Positive Elements)",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window", "Deque"],
    statement: "Given an integer array nums (can contain negatives) and a long integer k, return the length of the longest subarray with sum at most k.",
    examples: [
      { input: "nums = [2,-1,2,3,4,-5], k = 5", output: "4" },
      { input: "nums = [-1,-2,-3,-4], k = -2", output: "3" },
    ],
    intuition: "With negatives, the window can't be shrunk naively. Pre-compute prefix sums. Use a monotone stack for prefix-sum left minimums, and a right pointer scanning from the end to find the optimal pair.",
    approach: [
      "Build prefix sums.",
      "Build a stack of indices with strictly decreasing prefix sums (candidates for left boundary).",
      "Scan right from n down to 0; for each right, pop from stack while pre[right] - pre[stack.top] <= k, recording the max gap.",
    ],
    solution: `function maxSizeSubarraySumAtMostK(nums, k) {
  const n = nums.length;
  const pre = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) pre[i + 1] = pre[i] + nums[i];
  // Build monotone decreasing stack of prefix sum indices
  const stack = [];
  for (let i = 0; i <= n; i++) {
    if (!stack.length || pre[i] < pre[stack[stack.length - 1]]) {
      stack.push(i);
    }
  }
  let res = 0;
  for (let right = n; right >= 1; right--) {
    while (stack.length && pre[right] - pre[stack[stack.length - 1]] <= k) {
      res = Math.max(res, right - stack[stack.length - 1]);
      stack.pop();
    }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Sum-bounded longest windows with negatives model credit-limit span analysis in banking: find the longest transaction sequence where the running balance never drops below a limit. Streaming financial ledgers use monotone-stack prefix optimisation to answer these range queries in O(n) over millions of transactions.",
  },
  {
    id: "sliding-window-45",
    title: "Maximum Sum of Two Non-Overlapping Subarrays",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window", "Prefix Sum"],
    statement: "Given an integer array nums and two lengths firstLen and secondLen, return the maximum sum of elements in two non-overlapping subarrays with those exact lengths.",
    examples: [
      { input: "nums = [0,6,5,2,2,5,1,9,4], firstLen = 1, secondLen = 2", output: "20" },
      { input: "nums = [3,8,1,3,2,1,8,9,0], firstLen = 3, secondLen = 2", output: "29" },
    ],
    intuition: "Build prefix sums. Slide a window of secondLen, keeping a running maximum of the best firstLen window that ends before the current secondLen window starts. Try both orderings and take the max.",
    approach: [
      "Build prefix sum array.",
      "Helper best(L, M): for each M-window ending at i, track max L-window ending before it.",
      "Return max of best(firstLen, secondLen) and best(secondLen, firstLen).",
    ],
    solution: `function maxSumTwoNoOverlap(nums, firstLen, secondLen) {
  const n = nums.length;
  const pre = [0];
  for (const v of nums) pre.push(pre[pre.length - 1] + v);
  const range = (l, r) => pre[r + 1] - pre[l];
  function best(L, M) {
    let maxL = 0, res = 0;
    for (let i = L + M - 1; i < n; i++) {
      maxL = Math.max(maxL, range(i - L - M + 1, i - M));
      res = Math.max(res, maxL + range(i - M + 1, i));
    }
    return res;
  }
  return Math.max(best(firstLen, secondLen), best(secondLen, firstLen));
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Non-overlapping two-window optimisation models dual-slot resource scheduling in cloud infrastructure: assign two non-overlapping maintenance windows to maximise total work completed, which appears in AWS Scheduled Maintenance and Azure planned downtime orchestration algorithms.",
  },
  {
    id: "sliding-window-46",
    title: "Shortest Subarray with Sum at Least K (With Negatives)",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window", "Deque", "Prefix Sum"],
    statement: "Given an integer array nums (may include negative numbers) and an integer k, return the length of the shortest non-empty subarray with sum at least k. Return -1 if there is no such subarray.",
    examples: [
      { input: "nums = [1], k = 1", output: "1" },
      { input: "nums = [1,2], k = 4", output: "-1" },
      { input: "nums = [2,-1,2], k = 3", output: "3" },
    ],
    intuition: "Prefix sums turn the problem into: find the smallest j - i where prefix[j] - prefix[i] >= k and j > i. Use a deque of candidate left endpoints (in increasing prefix-sum order) and scan right.",
    approach: [
      "Build prefix sums of length n+1.",
      "Maintain a deque of indices with strictly increasing prefix sums.",
      "For each right: while deque front satisfies prefix[right] - prefix[deque.front] >= k, record min length and pop front.",
      "While deque back has prefix >= prefix[right], pop back. Push right.",
    ],
    solution: `function shortestSubarray(nums, k) {
  const n = nums.length;
  const pre = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) pre[i + 1] = pre[i] + nums[i];
  const deque = [];
  let res = Infinity;
  for (let i = 0; i <= n; i++) {
    while (deque.length && pre[i] - pre[deque[0]] >= k) {
      res = Math.min(res, i - deque.shift());
    }
    while (deque.length && pre[deque[deque.length - 1]] >= pre[i]) {
      deque.pop();
    }
    deque.push(i);
  }
  return res === Infinity ? -1 : res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Shortest prefix-sum-bounded window with a deque models minimum-latency burst detection in network traffic analysis: find the shortest time window where cumulative byte count reached a threshold, even when traffic can temporarily dip negative (e.g. credits/refunds in billing). CDN billing engines use this to detect minimum charge windows.",
  },
  {
    id: "sliding-window-47",
    title: "Number of Windows Containing All Distinct Characters",
    difficulty: "Hard",
    tags: ["String", "Sliding Window", "Hashing"],
    statement: "Given a string s, count the number of substrings that contain every distinct character in s at least once.",
    examples: [
      { input: "s = \"aba\"", output: "3", explanation: "Distinct chars: a, b. Valid: \"ab\"[0..1], \"ba\"[1..2], \"aba\"[0..2]." },
      { input: "s = \"aaa\"", output: "3" },
    ],
    intuition: "Find the smallest window ending at each right pointer that covers all distinct characters. All extensions to the right are also valid, so add (n - right) for each valid left boundary.",
    approach: [
      "Count total distinct characters D.",
      "Slide a window; track frequency map and covered count.",
      "When covered == D, shrink left while still covering all; count (n - right) for each valid left.",
    ],
    solution: `function countSubstringsWithAllChars(s) {
  const D = new Set(s).size;
  const freq = new Map();
  let left = 0, covered = 0, res = 0;
  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right]) || 0) + 1);
    if (freq.get(s[right]) === 1) covered++;
    while (covered === D) {
      res += s.length - right;
      freq.set(s[left], freq.get(s[left]) - 1);
      if (freq.get(s[left]) === 0) covered--;
      left++;
    }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Counting substrings with full-alphabet coverage models full-feature coverage tracking in A/B experimentation platforms: count the number of user session windows that exposed every feature variant to at least one user, validating that the experiment has full coverage before computing significance.",
  },
  {
    id: "sliding-window-48",
    title: "Maximum Sum Circular Subarray",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window", "Dynamic Programming", "Monotonic Deque"],
    statement: "Given a circular integer array nums, return the maximum possible sum of a non-empty subarray. A circular array means the end wraps around to the beginning.",
    examples: [
      { input: "nums = [1,-2,3,-2]", output: "3" },
      { input: "nums = [5,-3,5]", output: "10" },
      { input: "nums = [-3,-2,-3]", output: "-2" },
    ],
    intuition: "Either the max subarray does not wrap (standard Kadane) or it wraps (total sum minus the minimum subarray in the middle). Take the max of both, but if all values are negative return the max single element.",
    approach: [
      "Compute maxSum using Kadane's algorithm.",
      "Compute minSum using Kadane's on negated values (or directly).",
      "If total - minSum == 0 (all negative), return maxSum.",
      "Return max(maxSum, total - minSum).",
    ],
    solution: `function maxSubarraySumCircular(nums) {
  let totalSum = 0, maxSum = -Infinity, minSum = Infinity;
  let curMax = 0, curMin = 0;
  for (const n of nums) {
    curMax = Math.max(n, curMax + n);
    maxSum = Math.max(maxSum, curMax);
    curMin = Math.min(n, curMin + n);
    minSum = Math.min(minSum, curMin);
    totalSum += n;
  }
  return maxSum > 0 ? Math.max(maxSum, totalSum - minSum) : maxSum;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Circular-array max subarray models ring-buffer peak-demand analysis in real-time systems: find the peak contiguous load period in a circular schedule (e.g. hourly traffic over a 24-hour ring), used in data-center capacity planning to identify the worst peak window across day boundaries.",
  },
  {
    id: "sliding-window-49",
    title: "Minimum Swaps to Group All 1s Together",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window"],
    statement: "Given a binary array nums (circular), return the minimum number of swaps required to group all 1s together in any part of the array (including wrapping around).",
    examples: [
      { input: "nums = [0,1,0,1,1,0,0]", output: "1" },
      { input: "nums = [0,0,0,1,0]", output: "0" },
      { input: "nums = [1,0,1,0,1,0,0,1,1,0,1]", output: "3" },
    ],
    intuition: "The window that will hold all 1s has fixed size = total number of 1s. Slide this window around the circular array. The zeros inside the window are the swaps needed; minimise this count.",
    approach: [
      "Count total ones = windowSize.",
      "Count zeros in the first window.",
      "Slide the window (treating the array as circular); update the zero count.",
      "Track minimum zeros in any window.",
    ],
    solution: `function minSwaps(nums) {
  const n = nums.length;
  const ones = nums.reduce((a, b) => a + b, 0);
  if (ones === 0) return 0;
  let zeros = 0;
  for (let i = 0; i < ones; i++) if (nums[i] === 0) zeros++;
  let minZeros = zeros;
  for (let i = ones; i < n + ones; i++) {
    if (nums[i % n] === 0) zeros++;
    if (nums[(i - ones) % n] === 0) zeros--;
    minZeros = Math.min(minZeros, zeros);
  }
  return minZeros;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Circular fixed-window minimum-cost grouping models data compaction in ring-buffer storage systems: find the best circular segment to pack together to minimise the number of relocations (swaps). Distributed log compaction in Kafka uses a similar fixed-window scan over circular partition offsets to minimise copy operations.",
  },
  {
    id: "sliding-window-50",
    title: "Minimum Number of Flips to Make Binary String Alternating",
    difficulty: "Hard",
    tags: ["String", "Sliding Window", "Greedy"],
    statement: "You are given a binary string s. In one operation you can either rotate s (move the first character to the end) or flip a character. Return the minimum number of flips to make s alternating (no two adjacent characters are the same), where you can perform any number of rotations first.",
    examples: [
      { input: "s = \"111000\"", output: "2" },
      { input: "s = \"010\"", output: "0" },
      { input: "s = \"1110\"", output: "1" },
    ],
    intuition: "Double the string to simulate all rotations. For a fixed window of length n, count how many positions differ from the two target alternating patterns (\"010101...\" and \"101010...\"). A sliding window tracks this mismatch count efficiently.",
    approach: [
      "Double the string s to s+s.",
      "Build two target patterns of length 2n.",
      "Slide a window of size n; track mismatches against both patterns.",
      "When entering/leaving the window, update mismatch counts.",
      "Return the minimum over all windows.",
    ],
    solution: `function minFlips(s) {
  const n = s.length;
  const doubled = s + s;
  const len = doubled.length;
  let diff1 = 0, diff2 = 0, res = n;
  for (let i = 0; i < len; i++) {
    const expected1 = i % 2 === 0 ? "0" : "1";
    const expected2 = i % 2 === 0 ? "1" : "0";
    if (doubled[i] !== expected1) diff1++;
    if (doubled[i] !== expected2) diff2++;
    if (i >= n) {
      const out = i - n;
      const exp1 = out % 2 === 0 ? "0" : "1";
      const exp2 = out % 2 === 0 ? "1" : "0";
      if (doubled[out] !== exp1) diff1--;
      if (doubled[out] !== exp2) diff2--;
    }
    if (i >= n - 1) {
      res = Math.min(res, diff1, diff2);
    }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Rotation-plus-transformation cost minimisation models key-rotation scheduling in cryptographic systems: given a fixed-size key ring, find the optimal rotation offset that minimises the number of key changes needed to achieve a target alternating-access pattern, minimising re-encryption cost in key management services like AWS KMS.",
  },
];
