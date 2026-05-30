import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  {
    id: "dynamic-programming-01",
    title: "Fibonacci Number",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Math", "Recursion"],
    statement: "Given n, compute the nth Fibonacci number where F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n > 1.",
    examples: [
      { input: "n = 4", output: "3", explanation: "F(4) = F(3)+F(2) = 2+1 = 3." },
      { input: "n = 10", output: "55" },
    ],
    intuition: "To find the nth Fibonacci number, you only need the previous two numbers — like reading a recipe one step at a time, remembering just the last two ingredients you added.",
    approach: [
      "Handle base cases: return n if n <= 1.",
      "Initialize prev = 0, curr = 1.",
      "Loop from 2 to n: compute next = prev + curr, then prev = curr, curr = next.",
      "Return curr.",
    ],
    solution: `function fib(n) {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Fibonacci-style recurrences appear in database index B-tree node-fill calculations and in amortised analysis of dynamic arrays. Memoising recursive computations mirrors how materialized views cache expensive sub-query results so the database engine reuses them instead of recomputing.",
    pitfalls: ["Naive recursion is O(2^n) — always use iteration or memoisation.", "F(0)=0 not 1 — off-by-one in the base case is the most common mistake."],
  },
  {
    id: "dynamic-programming-02",
    title: "N-th Tribonacci Number",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Math"],
    statement: "The Tribonacci sequence is defined as T(0)=0, T(1)=1, T(2)=1, and T(n)=T(n-1)+T(n-2)+T(n-3) for n >= 3. Given n, return T(n).",
    examples: [
      { input: "n = 4", output: "4", explanation: "T(4) = T(3)+T(2)+T(1) = 2+1+1 = 4." },
      { input: "n = 25", output: "1389537" },
    ],
    intuition: "Same idea as Fibonacci but you remember the last three values instead of two — like a conveyor belt that always holds the three most recent items.",
    approach: [
      "Handle base cases: return n == 0 ? 0 : 1 for n <= 2.",
      "Keep three variables a=0, b=1, c=1.",
      "Loop from 3 to n: next = a+b+c, then shift a=b, b=c, c=next.",
      "Return c.",
    ],
    solution: `function tribonacci(n) {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  let a = 0, b = 1, c = 1;
  for (let i = 3; i <= n; i++) {
    const next = a + b + c;
    a = b; b = c; c = next;
  }
  return c;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Fixed-window rolling aggregates (sum of last k values) appear in time-series databases and monitoring systems. The three-variable sliding window is how streaming analytics engines like Flink compute rolling sums without storing the full history.",
    pitfalls: ["The base cases differ from Fibonacci — T(0)=0, T(1)=1, T(2)=1 all must be handled.", "Shift variables in the correct order to avoid overwriting a needed value."],
  },
  {
    id: "dynamic-programming-03",
    title: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Math"],
    statement: "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "1+1 or 2." },
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1." },
    ],
    intuition: "To reach step n you either came from step n-1 (one-step jump) or step n-2 (two-step jump), so the answer is just the sum of those two — it is Fibonacci in disguise.",
    approach: [
      "Base cases: dp[1]=1, dp[2]=2.",
      "For each step from 3 to n: dp[i] = dp[i-1] + dp[i-2].",
      "Return dp[n].",
    ],
    solution: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev = 1, curr = 2;
  for (let i = 3; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Counting paths through a DAG is the foundation of query plan enumeration in database optimisers — the number of valid join orderings follows a similar recurrence. Workflow engines count valid execution paths through a pipeline using the same bottom-up DP.",
    pitfalls: ["Return n directly when n <= 2 to handle both base cases in one line.", "Allocating a full dp[] array wastes space — two variables suffice."],
  },
  {
    id: "dynamic-programming-04",
    title: "Min Cost Climbing Stairs",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Array"],
    statement: "Given an array cost where cost[i] is the cost of the ith step, you can start from index 0 or 1 and can climb 1 or 2 steps at a time. Find the minimum cost to reach the top of the floor (past the last index).",
    examples: [
      { input: "cost = [10,15,20]", output: "15", explanation: "Start at index 1, pay 15, jump 2 steps to top." },
      { input: "cost = [1,100,1,1,1,100,1,1,100,1]", output: "6" },
    ],
    intuition: "The cheapest way to reach each step is to pick the cheaper of coming from one step below or two steps below and adding the current step's toll — like choosing the cheaper toll booth on a highway.",
    approach: [
      "Let dp[i] = min cost to step on step i.",
      "dp[0] = cost[0], dp[1] = cost[1].",
      "For i >= 2: dp[i] = cost[i] + Math.min(dp[i-1], dp[i-2]).",
      "Answer = Math.min(dp[n-1], dp[n-2]).",
    ],
    solution: `function minCostClimbingStairs(cost) {
  const n = cost.length;
  let prev2 = cost[0], prev1 = cost[1];
  for (let i = 2; i < n; i++) {
    const curr = cost[i] + Math.min(prev1, prev2);
    prev2 = prev1;
    prev1 = curr;
  }
  return Math.min(prev1, prev2);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Minimum-cost path DP is the algorithmic backbone of shortest-path query planning in databases and network routing. Cloud cost-optimisation engines use similar recurrences to choose the cheapest sequence of compute instances for a multi-step pipeline.",
    pitfalls: ["The top is one step beyond the last index — take the min of the last two dp values.", "You may start at index 0 or 1, so both are valid starting states."],
  },
  {
    id: "dynamic-programming-05",
    title: "Divisor Game",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Math", "Game Theory"],
    statement: "Alice and Bob take turns playing a game on a number n. On each turn the current player picks a divisor x of n where 0 < x < n and replaces n with n-x. The player who cannot make a move loses. Alice goes first. Return true if Alice wins with optimal play.",
    examples: [
      { input: "n = 2", output: "true" },
      { input: "n = 3", output: "false" },
    ],
    intuition: "Alice wins exactly when n is even — if n is even she picks x=1 leaving Bob an odd number, and odd numbers always lose because every divisor of an odd number is odd, making the result even for Alice again.",
    approach: [
      "Simply return n % 2 === 0.",
      "Alternatively prove by DP: dp[i] = true if the current player wins starting from i.",
      "dp[1] = false (no move). dp[i] = any divisor x of i where dp[i-x] is false.",
    ],
    solution: `function divisorGame(n) {
  // dp proof: even numbers are always winning positions
  return n % 2 === 0;
}`,
    language: "javascript",
    complexity: { time: "O(1)", space: "O(1)" },
    systemDesign: "Game-theoretic DP (Sprague-Grundy theory) underlies optimal strategy computation in automated negotiation systems and resource-allocation auctions where each party picks the best divisor of remaining resources. Database query optimisers similarly compute the 'winning move' (cheapest plan) over a state space.",
    pitfalls: ["The O(1) mathematical insight is enough here, but the DP formulation dp[i] = any(dp[i-x] is false for x | i) is the general pattern.", "Even n = 2 must return true — check the base case."],
  },
  {
    id: "dynamic-programming-06",
    title: "Counting Bits",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Bit Manipulation"],
    statement: "Given an integer n, return an array ans of length n+1 where ans[i] is the number of 1-bits in the binary representation of i.",
    examples: [
      { input: "n = 2", output: "[0,1,1]" },
      { input: "n = 5", output: "[0,1,1,2,1,2]" },
    ],
    intuition: "The number of 1-bits in i equals the number of 1-bits in i shifted right by one (i >> 1) plus the last bit (i & 1) — every number is just a smaller number with one bit tacked on.",
    approach: [
      "Create dp array of length n+1 with dp[0]=0.",
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
    systemDesign: "Population-count (popcount) is used in Bloom filter implementations to count set bits in hash buckets, in HyperLogLog cardinality estimators, and in SIMD-accelerated bitset operations inside columnar databases like DuckDB and ClickHouse for fast aggregation.",
    pitfalls: ["The recurrence dp[i >> 1] reuses previously computed results in O(1) each — no need for Brian Kernighan's loop.", "i >> 1 and i / 2 | 0 are equivalent but bit-shift is faster."],
  },
  {
    id: "dynamic-programming-07",
    title: "Pascal's Triangle",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Array"],
    statement: "Given an integer numRows, return the first numRows of Pascal's triangle as a list of lists.",
    examples: [
      { input: "numRows = 5", output: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]" },
      { input: "numRows = 1", output: "[[1]]" },
    ],
    intuition: "Each number in Pascal's triangle is the sum of the two numbers directly above it — like pouring water into a triangle of cups where each cup fills from the two above.",
    approach: [
      "Start with [[1]].",
      "For each new row, begin and end with 1.",
      "Fill the middle: row[j] = prevRow[j-1] + prevRow[j].",
    ],
    solution: `function generate(numRows) {
  const res = [[1]];
  for (let i = 1; i < numRows; i++) {
    const prev = res[i - 1];
    const row = [1];
    for (let j = 1; j < i; j++) row.push(prev[j - 1] + prev[j]);
    row.push(1);
    res.push(row);
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n²)" },
    systemDesign: "Pascal's triangle values are binomial coefficients used in probability calculations in A/B testing frameworks (computing exact p-values), in error-correcting codes (Reed-Solomon), and in network reliability modelling where each coefficient represents the number of paths of a given length.",
    pitfalls: ["Every row starts and ends with 1 — those are not computed from the recurrence.", "Row i has i+1 elements (0-indexed)."],
  },
  {
    id: "dynamic-programming-08",
    title: "Is Subsequence",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Two Pointers", "String"],
    statement: "Given strings s and t, return true if s is a subsequence of t. A subsequence maintains relative order but does not need to be contiguous.",
    examples: [
      { input: "s = \"ace\", t = \"abcde\"", output: "true" },
      { input: "s = \"aec\", t = \"abcde\"", output: "false" },
    ],
    intuition: "Walk through t with one pointer and s with another. Whenever the characters match, advance the s pointer. If you exhaust all of s, it is a subsequence.",
    approach: [
      "Initialize i=0 (pointer into s).",
      "Iterate over each character in t.",
      "If t[j] == s[i], increment i.",
      "Return i == s.length.",
    ],
    solution: `function isSubsequence(s, t) {
  let i = 0;
  for (const c of t) {
    if (i < s.length && c === s[i]) i++;
  }
  return i === s.length;
}`,
    language: "javascript",
    complexity: { time: "O(|t|)", space: "O(1)" },
    systemDesign: "Subsequence checking is the basis of diff algorithms (git diff, Myers algorithm) and of sequence alignment in bioinformatics pipelines. Event-stream processors use subsequence matching to detect complex event patterns (CEP) in log streams without storing all intermediate states.",
    pitfalls: ["An empty string s is always a subsequence — the loop does nothing and i == 0 == s.length.", "Do not require contiguous characters — skip non-matching characters in t freely."],
  },
  {
    id: "dynamic-programming-09",
    title: "House Robber",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Array"],
    statement: "You are a robber planning to rob houses along a street. Each house has a certain amount of money. You cannot rob two adjacent houses (the alarm connects them). Given an array nums of non-negative integers, return the maximum amount you can rob.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (1) + house 3 (3) = 4." },
      { input: "nums = [2,7,9,3,1]", output: "12" },
    ],
    intuition: "At each house you decide: rob it (and add its value to the best amount two houses back) or skip it (keep the best amount from the previous house). The answer builds up one house at a time.",
    approach: [
      "dp[i] = max money robbing up to house i.",
      "dp[i] = max(dp[i-1], dp[i-2] + nums[i]).",
      "Use two variables instead of an array to save space.",
    ],
    solution: `function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const n of nums) {
    const curr = Math.max(prev1, prev2 + n);
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "The no-two-adjacent constraint models resource scheduling where two adjacent tasks share a resource lock. Database query schedulers use similar DP to select the maximum set of non-conflicting query windows or maintenance jobs without locking the same table twice in succession.",
    pitfalls: ["Initialize prev2=0 (no houses) and prev1=0 to handle the empty prefix correctly.", "The order of updates matters — always compute curr before overwriting prev2."],
  },
  {
    id: "dynamic-programming-10",
    title: "Maximum Subarray",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Array", "Divide and Conquer"],
    statement: "Given an integer array nums, find the subarray with the largest sum and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has sum 6." },
      { input: "nums = [1]", output: "1" },
      { input: "nums = [5,4,-1,7,8]", output: "23" },
    ],
    intuition: "At each position, the best subarray ending here is either just the current element alone or the current element extended from whatever ran before — if the running sum went negative, throw it away and start fresh.",
    approach: [
      "dp[i] = max subarray sum ending at index i.",
      "dp[i] = max(nums[i], dp[i-1] + nums[i]).",
      "Track the overall max across all dp[i].",
    ],
    solution: `function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Kadane's algorithm underpins maximum-gain window detection in financial analytics and peak-traffic anomaly detection in monitoring pipelines. Streaming databases implement it as an incremental aggregate that processes one event at a time without storing history.",
    pitfalls: ["Initialise with nums[0], not 0 — the array can be entirely negative.", "Track the best outside the current-sum variable, or you lose non-ending maxima."],
  },
  {
    id: "dynamic-programming-11",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Array", "Greedy"],
    statement: "Given a prices array where prices[i] is the stock price on day i, return the maximum profit from a single buy-then-sell transaction. Return 0 if no profit is possible.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5" },
      { input: "prices = [7,6,4,3,1]", output: "0" },
    ],
    intuition: "Track the lowest price seen so far as the best buy day. Each day, ask how much profit you would make selling today at the current price, and keep the best answer.",
    approach: [
      "minPrice = Infinity, maxProfit = 0.",
      "For each price: update minPrice, then update maxProfit = max(maxProfit, price - minPrice).",
      "Return maxProfit.",
    ],
    solution: `function maxProfit(prices) {
  let minPrice = Infinity, maxProfit = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);
    maxProfit = Math.max(maxProfit, p - minPrice);
  }
  return maxProfit;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Running-minimum tracking is used in real-time cost-floor monitoring in cloud billing dashboards and in algorithmic trading systems that track all-time-low entry points. Columnar streaming aggregates (MIN over a window) use the same single-pass approach.",
    pitfalls: ["Return 0, not a negative number, when prices only decline.", "Buy must happen strictly before sell — the running-min approach guarantees this."],
  },
  {
    id: "dynamic-programming-12",
    title: "Jump Game",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Array", "Greedy"],
    statement: "Given an integer array nums where nums[i] is the maximum jump length from index i, return true if you can reach the last index starting from index 0.",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true" },
      { input: "nums = [3,2,1,0,4]", output: "false" },
    ],
    intuition: "Keep updating the furthest index you can reach. If you ever try to step onto an index beyond your current reach, you are stuck.",
    approach: [
      "maxReach = 0.",
      "For each index i: if i > maxReach return false.",
      "maxReach = max(maxReach, i + nums[i]).",
      "Return true.",
    ],
    solution: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Reachability in a DAG models workflow dependency resolution in build systems and task schedulers. Distributed workflow engines (Apache Airflow) compute which tasks are reachable from the current state using similar forward-propagation logic.",
    pitfalls: ["A zero anywhere other than the last index may or may not be a blocker — only check if i > maxReach.", "A single-element array always returns true."],
  },
  {
    id: "dynamic-programming-13",
    title: "Maximum Product Subarray",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Array"],
    statement: "Given an integer array nums, find a subarray that has the largest product and return the product.",
    examples: [
      { input: "nums = [2,3,-2,4]", output: "6" },
      { input: "nums = [-2,0,-1]", output: "0" },
    ],
    intuition: "Unlike sum, a negative times another negative flips to positive, so you must track both the maximum and minimum product ending at each position — the minimum today might become the maximum tomorrow.",
    approach: [
      "curMax = curMin = best = nums[0].",
      "For each subsequent num: newMax = max(num, curMax*num, curMin*num), newMin = min of the same.",
      "Update best = max(best, newMax).",
    ],
    solution: `function maxProduct(nums) {
  let curMax = nums[0], curMin = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    const tmpMax = Math.max(n, curMax * n, curMin * n);
    curMin = Math.min(n, curMax * n, curMin * n);
    curMax = tmpMax;
    best = Math.max(best, curMax);
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Tracking both extremes in a DP state appears in financial risk models (max/min portfolio value under compound returns) and in search ranking where multiplicative penalty/boost factors can flip sign. The dual-state DP pattern generalises to any problem where the optimal extension depends on both the maximum and minimum prefix.",
    pitfalls: ["Compute tmpMax before overwriting curMin — both branches use the old curMax.", "Zero resets both curMax and curMin, handled by taking max/min with num alone."],
  },
  {
    id: "dynamic-programming-14",
    title: "Unique Paths",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Math", "Combinatorics"],
    statement: "A robot is on an m x n grid at the top-left corner and can only move right or down. How many unique paths are there to reach the bottom-right corner?",
    examples: [
      { input: "m = 3, n = 7", output: "28" },
      { input: "m = 3, n = 2", output: "3" },
    ],
    intuition: "Each cell can only be reached from the cell above or the cell to the left, so the number of paths to any cell is just the sum of paths to those two neighbours — like filling in a grid of choices.",
    approach: [
      "Create a 1D dp array of size n filled with 1s (top row).",
      "For each row from 1 to m-1: for each column from 1 to n-1: dp[j] += dp[j-1].",
      "Return dp[n-1].",
    ],
    solution: `function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(n)" },
    systemDesign: "Grid path counting models network packet routing through a mesh topology where paths can only go in two directions, used in datacenter fabric design to estimate redundancy. The same recurrence calculates binomial coefficients (C(m+n-2, m-1)) used in probability and A/B test sample-size calculations.",
    pitfalls: ["The entire top row and left column have exactly 1 path each — initialise accordingly.", "Rolling the 2D DP into a 1D array saves O(m*n) space down to O(n)."],
  },
  // ---- MEDIUM ----
  {
    id: "dynamic-programming-15",
    title: "Coin Change",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array", "BFS"],
    statement: "Given an array of coin denominations and a total amount, return the fewest number of coins needed to make up that amount. Return -1 if the amount cannot be made.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "5+5+1 = 11." },
      { input: "coins = [2], amount = 3", output: "-1" },
    ],
    intuition: "Build up the answer from amount 0 to the target. For each amount, try every coin and take the one that requires the fewest coins previously — like building a tower one layer at a time using the cheapest bricks.",
    approach: [
      "dp[0] = 0; all others = Infinity.",
      "For each amount i from 1 to amount: for each coin c: if i >= c, dp[i] = min(dp[i], dp[i-c]+1).",
      "Return dp[amount] === Infinity ? -1 : dp[amount].",
    ],
    solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i >= c && dp[i - c] + 1 < dp[i]) {
        dp[i] = dp[i - c] + 1;
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    language: "javascript",
    complexity: { time: "O(amount * coins.length)", space: "O(amount)" },
    systemDesign: "Coin change is the canonical unbounded knapsack problem and directly models resource provisioning: find the minimum number of VM instance types to cover a required compute budget. Payment processing systems use it to minimise the number of settlement transactions needed to clear a target amount.",
    pitfalls: ["Initialise dp[0]=0 and everything else to Infinity — not to 0 or -1.", "Return -1 when dp[amount] is still Infinity after the loop."],
  },
  {
    id: "dynamic-programming-16",
    title: "Coin Change II",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array"],
    statement: "Given an array of coin denominations and a total amount, return the number of combinations that make up that amount.",
    examples: [
      { input: "coins = [1,2,5], amount = 5", output: "4" },
      { input: "coins = [2], amount = 3", output: "0" },
    ],
    intuition: "Process one coin denomination at a time. For each coin, update how many ways each amount can be reached by adding that coin any number of times — like choosing flavours for a sundae one topping at a time.",
    approach: [
      "dp[0] = 1; all others = 0.",
      "For each coin c: for i from c to amount: dp[i] += dp[i-c].",
      "Return dp[amount].",
    ],
    solution: `function change(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const c of coins) {
    for (let i = c; i <= amount; i++) {
      dp[i] += dp[i - c];
    }
  }
  return dp[amount];
}`,
    language: "javascript",
    complexity: { time: "O(amount * coins.length)", space: "O(amount)" },
    systemDesign: "Counting combinations without duplicates (outer loop over items, inner over capacity) is the unbounded knapsack formulation used in financial portfolio construction to count the number of ways to allocate a budget across asset classes. Ad-serving platforms use it to count valid slot-fill combinations given budget constraints.",
    pitfalls: ["Outer loop over coins, inner over amounts — this avoids counting permutations (1+2 and 2+1 as different).", "Reversing the loop order would give permutations instead of combinations."],
  },
  {
    id: "dynamic-programming-17",
    title: "Combination Sum IV",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array"],
    statement: "Given an array of distinct positive integers nums and a target integer, return the number of possible combinations (where order matters) that add up to target.",
    examples: [
      { input: "nums = [1,2,3], target = 4", output: "7" },
      { input: "nums = [9], target = 3", output: "0" },
    ],
    intuition: "This counts ordered sequences (permutations), so the outer loop is over the target amounts and the inner loop tries every number — like counting all possible ordered menus that total a given price.",
    approach: [
      "dp[0] = 1; all others = 0.",
      "For each amount i from 1 to target: for each num n: if i >= n, dp[i] += dp[i-n].",
      "Return dp[target].",
    ],
    solution: `function combinationSum4(nums, target) {
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= target; i++) {
    for (const n of nums) {
      if (i >= n) dp[i] += dp[i - n];
    }
  }
  return dp[target];
}`,
    language: "javascript",
    complexity: { time: "O(target * nums.length)", space: "O(target)" },
    systemDesign: "Counting ordered compositions of a budget models sequential decision making in recommendation engines where the order of content items on a page affects click-through rates. API rate-limiting systems count ordered request sequences that sum to a quota window.",
    pitfalls: ["Outer loop over amounts, inner over nums — opposite of Coin Change II — gives permutations, not combinations.", "Large targets can overflow 32-bit integers; JavaScript's number type handles this but be careful in other languages."],
  },
  {
    id: "dynamic-programming-18",
    title: "Minimum Path Sum",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array", "Matrix"],
    statement: "Given an m x n grid filled with non-negative numbers, find a path from the top-left to the bottom-right corner that minimises the sum of all numbers along its path. You can only move right or down.",
    examples: [
      { input: "grid = [[1,3,1],[1,5,1],[4,2,1]]", output: "7", explanation: "Path 1->3->1->1->1 = 7." },
      { input: "grid = [[1,2,3],[4,5,6]]", output: "12" },
    ],
    intuition: "The cheapest way to reach each cell is to come from whichever of its upper or left neighbour is cheaper and add the current cell's cost — build the answer cell by cell.",
    approach: [
      "Fill the first row by accumulating left values.",
      "Fill the first column by accumulating top values.",
      "For each remaining cell: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).",
      "Return dp[m-1][n-1].",
    ],
    solution: `function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) continue;
      const fromTop = i > 0 ? grid[i - 1][j] : Infinity;
      const fromLeft = j > 0 ? grid[i][j - 1] : Infinity;
      grid[i][j] += Math.min(fromTop, fromLeft);
    }
  }
  return grid[m - 1][n - 1];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(1)" },
    systemDesign: "Minimum-cost grid routing models latency-optimised network path selection across a datacenter mesh. Cloud resource schedulers represent job-to-node assignment as a cost grid and use DP to find the cheapest allocation sequence, analogous to Dijkstra's algorithm on a grid.",
    pitfalls: ["Mutating the input grid saves space but may be undesirable — copy if the caller expects the original.", "Infinity sentinels for out-of-bounds neighbours prevent special-casing the first row and column."],
  },
  {
    id: "dynamic-programming-19",
    title: "Unique Paths II",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array", "Matrix"],
    statement: "A robot starts at the top-left of an m x n grid and can only move right or down. Some cells contain obstacles (1). Return the number of unique paths to the bottom-right corner.",
    examples: [
      { input: "obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]", output: "2" },
      { input: "obstacleGrid = [[0,1],[0,0]]", output: "1" },
    ],
    intuition: "Same as Unique Paths but obstacle cells have zero paths through them — like a hallway with locked doors, each blocked cell cuts off all routes through it.",
    approach: [
      "dp[j] = 1 for the first row until an obstacle is hit (then 0 for the rest).",
      "For each subsequent row: if obstacle, dp[j]=0; else dp[j] += dp[j-1].",
      "Return dp[n-1].",
    ],
    solution: `function uniquePathsWithObstacles(grid) {
  const n = grid[0].length;
  const dp = new Array(n).fill(0);
  dp[0] = grid[0][0] === 1 ? 0 : 1;
  for (let j = 1; j < n; j++) dp[j] = grid[0][j] === 1 ? 0 : dp[j - 1];
  for (let i = 1; i < grid.length; i++) {
    if (grid[i][0] === 1) dp[0] = 0;
    for (let j = 1; j < n; j++) {
      dp[j] = grid[i][j] === 1 ? 0 : dp[j] + dp[j - 1];
    }
  }
  return dp[n - 1];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(n)" },
    systemDesign: "Obstacle-aware path counting models network routing with failed links and is used in SDN (Software-Defined Networking) fault-tolerance analysis. Database query planners treat unavailable index paths as obstacles and count remaining valid execution plans.",
    pitfalls: ["If the start or end cell is an obstacle, return 0 immediately.", "Once a cell in the first row/column is blocked, all subsequent cells in that row/column are unreachable."],
  },
  {
    id: "dynamic-programming-20",
    title: "Triangle",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array"],
    statement: "Given a triangle array, find the minimum path sum from top to bottom. At each step you may move to an adjacent number in the row below.",
    examples: [
      { input: "triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]", output: "11", explanation: "Path 2->3->5->1 = 11." },
      { input: "triangle = [[-10]]", output: "-10" },
    ],
    intuition: "Start from the bottom row and work upward. Each cell becomes the min of itself plus the cheaper of the two adjacent cells below — like finding the cheapest route home by working backwards.",
    approach: [
      "Copy the bottom row into dp.",
      "For each row from second-to-last up to the top: dp[j] = triangle[i][j] + min(dp[j], dp[j+1]).",
      "Return dp[0].",
    ],
    solution: `function minimumTotal(triangle) {
  const dp = [...triangle[triangle.length - 1]];
  for (let i = triangle.length - 2; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      dp[j] = triangle[i][j] + Math.min(dp[j], dp[j + 1]);
    }
  }
  return dp[0];
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n)" },
    systemDesign: "Bottom-up DP on a DAG is used in backward induction in option pricing models (binomial tree), where the option value at expiry is known and you work backwards to find today's fair price. Similar backward-pass logic is used in gradient computation in neural network training.",
    pitfalls: ["Working bottom-up with a 1D dp array is cleaner than top-down because row i has exactly i+1 elements.", "Each row j has indices 0..i — do not go out of bounds."],
  },
  {
    id: "dynamic-programming-21",
    title: "Perfect Squares",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Math", "BFS"],
    statement: "Given a positive integer n, return the least number of perfect square numbers that sum to n.",
    examples: [
      { input: "n = 12", output: "3", explanation: "4+4+4 = 12." },
      { input: "n = 13", output: "2", explanation: "4+9 = 13." },
    ],
    intuition: "Same as Coin Change but the coins are perfect squares. Build from 0 to n, and for each amount subtract every perfect square to find the minimum steps.",
    approach: [
      "dp[0]=0, all others = Infinity.",
      "Precompute perfect squares up to n.",
      "For i from 1 to n: for each square s <= i: dp[i] = min(dp[i], dp[i-s]+1).",
      "Return dp[n].",
    ],
    solution: `function numSquares(n) {
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  const squares = [];
  for (let i = 1; i * i <= n; i++) squares.push(i * i);
  for (let i = 1; i <= n; i++) {
    for (const s of squares) {
      if (s > i) break;
      dp[i] = Math.min(dp[i], dp[i - s] + 1);
    }
  }
  return dp[n];
}`,
    language: "javascript",
    complexity: { time: "O(n * sqrt(n))", space: "O(n)" },
    systemDesign: "Minimum-decomposition DP models chunked data transfer: split a payload of size n into the fewest chunks whose sizes are perfect powers, minimising round trips. Storage engines that align blocks to power-of-two boundaries use the same idea to minimise fragmented writes.",
    pitfalls: ["Lagrange's four-square theorem guarantees an answer of at most 4, but DP gives the exact minimum.", "Break the inner loop early once s > i to avoid unnecessary iterations."],
  },
  {
    id: "dynamic-programming-22",
    title: "Word Break",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Hashing", "String"],
    statement: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    examples: [
      { input: "s = \"leetcode\", wordDict = [\"leet\",\"code\"]", output: "true" },
      { input: "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]", output: "true" },
      { input: "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", output: "false" },
    ],
    intuition: "dp[i] = can the first i characters be segmented? For each position i, check all positions j < i: if dp[j] is true and s[j..i] is in the dictionary, then dp[i] is also true.",
    approach: [
      "Build a Set from wordDict for O(1) lookups.",
      "dp[0] = true (empty prefix is valid).",
      "For i from 1 to n: for j from 0 to i: if dp[j] and s.slice(j,i) in set, dp[i]=true.",
      "Return dp[n].",
    ],
    solution: `function wordBreak(s, wordDict) {
  const set = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && set.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n)" },
    systemDesign: "Word segmentation DP is used in natural language processing tokenisers and search query parsers. Compiler lexers segment source code into tokens using the same reachability approach, and URL routers in web frameworks match path segments against a trie of routes using analogous DP.",
    pitfalls: ["Use a Set for dictionary lookups — linear search per substring is O(n³) total.", "Break out of the inner loop as soon as dp[i] is set to true."],
  },
  {
    id: "dynamic-programming-23",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Binary Search", "Array"],
    statement: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    examples: [
      { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "[2,3,7,101] has length 4." },
      { input: "nums = [0,1,0,3,2,3]", output: "4" },
    ],
    intuition: "Maintain a list 'tails' where tails[i] is the smallest tail element of all increasing subsequences of length i+1. For each number, binary-search for the right slot to extend or replace, like slotting a card into a sorted deck.",
    approach: [
      "Maintain a tails array.",
      "For each num: binary search for the first element in tails >= num.",
      "If found, replace that element; if not, append num.",
      "Return tails.length.",
    ],
    solution: `function lengthOfLIS(nums) {
  const tails = [];
  for (const n of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < n) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = n;
  }
  return tails.length;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "LIS is used in version control systems (git rebase --onto) to find the minimum number of operations to transform one sequence into another. Database index maintenance uses LIS to find the longest already-sorted run in a dataset, minimising the rebuild work needed after bulk inserts.",
    pitfalls: ["The tails array does not contain an actual LIS — it gives the correct length but the elements are replaced in-place.", "The naive O(n²) DP is simpler to reason about but the patience-sorting O(n log n) is required for large inputs."],
  },
  {
    id: "dynamic-programming-24",
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "String"],
    statement: "Given two strings text1 and text2, return the length of their longest common subsequence. A common subsequence is one that appears in both strings in the same relative order.",
    examples: [
      { input: "text1 = \"abcde\", text2 = \"ace\"", output: "3", explanation: "LCS is \"ace\"." },
      { input: "text1 = \"abc\", text2 = \"abc\"", output: "3" },
      { input: "text1 = \"abc\", text2 = \"def\"", output: "0" },
    ],
    intuition: "If the current characters match, the LCS extends by 1 from the diagonal. If they differ, take the best of skipping the current character from either string — like comparing two shopping lists and finding the longest shared order.",
    approach: [
      "dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1].",
      "If text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1.",
      "Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
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
    systemDesign: "LCS is the backbone of the Unix diff utility, code review tools, and plagiarism detectors. Bioinformatics sequence alignment (BLAST, Smith-Waterman) uses LCS-style DP across distributed compute clusters to align genomic sequences, storing intermediate results in distributed key-value stores.",
    pitfalls: ["LCS is not the same as the longest common substring — elements do not need to be contiguous.", "Space can be reduced to O(min(m,n)) by keeping only two rows at a time."],
  },
  {
    id: "dynamic-programming-25",
    title: "Partition Equal Subset Sum",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array"],
    statement: "Given an integer array nums, return true if you can partition the array into two subsets such that the sum of elements in both subsets is equal.",
    examples: [
      { input: "nums = [1,5,11,5]", output: "true", explanation: "[1,5,5] and [11]." },
      { input: "nums = [1,2,3,5]", output: "false" },
    ],
    intuition: "The problem reduces to: can any subset sum to total/2? Use a boolean DP where dp[s] = true means 'some subset sums to s' — process each number and update reachable sums.",
    approach: [
      "If total is odd, return false.",
      "target = total / 2.",
      "dp = boolean array of size target+1; dp[0] = true.",
      "For each num (iterate dp backwards): dp[s] |= dp[s-num] for s from target down to num.",
      "Return dp[target].",
    ],
    solution: `function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const n of nums) {
    for (let s = target; s >= n; s--) {
      dp[s] = dp[s] || dp[s - n];
    }
  }
  return dp[target];
}`,
    language: "javascript",
    complexity: { time: "O(n * target)", space: "O(target)" },
    systemDesign: "0/1 knapsack (each item used at most once, iterate backwards) is the core of bin-packing optimisers used in cloud VM placement (can a set of containers fit exactly onto servers?). Logistics systems use it to validate whether a truck load can be split evenly between two vehicles.",
    pitfalls: ["Iterate the inner loop backwards — forward iteration would allow the same item to be used multiple times.", "Odd total sum immediately returns false — two equal halves require an even total."],
  },
  {
    id: "dynamic-programming-26",
    title: "Target Sum",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array", "DFS"],
    statement: "Given an integer array nums and an integer target, assign each element a '+' or '-' sign. Return the number of ways to build an expression that evaluates to target.",
    examples: [
      { input: "nums = [1,1,1,1,1], target = 3", output: "5" },
      { input: "nums = [1], target = 1", output: "1" },
    ],
    intuition: "Each sign assignment is a choice, so track how many ways each sum is achievable. Start with {0: 1} ways and for each number, branch into +num and -num, accumulating counts.",
    approach: [
      "Use a Map from current sum -> number of ways.",
      "Start: {0: 1}.",
      "For each num, create a new Map: for each (sum, count) add count to newMap[sum+num] and newMap[sum-num].",
      "Return map.get(target) || 0.",
    ],
    solution: `function findTargetSumWays(nums, target) {
  let dp = new Map([[0, 1]]);
  for (const n of nums) {
    const next = new Map();
    for (const [sum, count] of dp) {
      next.set(sum + n, (next.get(sum + n) || 0) + count);
      next.set(sum - n, (next.get(sum - n) || 0) + count);
    }
    dp = next;
  }
  return dp.get(target) || 0;
}`,
    language: "javascript",
    complexity: { time: "O(n * total_sum)", space: "O(total_sum)" },
    systemDesign: "Counting sign assignments models configuration enumeration in feature-flag systems where each flag can be on or off and you count valid configurations reaching a target metric. Monte Carlo risk engines enumerate +/- scenarios across a portfolio and count how many paths hit a target loss threshold.",
    pitfalls: ["A 2D DP array also works but the Map approach avoids allocating space for unreachable sums.", "Target can be negative — the Map handles negative keys naturally."],
  },
  {
    id: "dynamic-programming-27",
    title: "Decode Ways",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "String"],
    statement: "A message encoded as a string of digits can be decoded with the mapping '1' -> 'A', ..., '26' -> 'Z'. Given a string s of digits, return the number of ways to decode it.",
    examples: [
      { input: "s = \"12\"", output: "2", explanation: "AB or L." },
      { input: "s = \"226\"", output: "3", explanation: "BZ, VF, or BBF." },
      { input: "s = \"06\"", output: "0" },
    ],
    intuition: "At each position, you can decode one digit (if it is 1-9) or two digits (if they form 10-26). The count of ways is the sum of ways from one step back and two steps back — exactly like climbing stairs but with validity checks.",
    approach: [
      "dp[0]=1 (empty string), dp[1]= s[0]!='0' ? 1 : 0.",
      "For i from 2 to n: single digit valid if s[i-1]!='0' (add dp[i-1]); two digits valid if s[i-2..i-1] in 10..26 (add dp[i-2]).",
      "Return dp[n].",
    ],
    solution: `function numDecodings(s) {
  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = s[0] !== "0" ? 1 : 0;
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
    systemDesign: "Decode-ways counting models protocol framing analysis in network security tools that enumerate possible interpretations of ambiguous byte streams. Compiler parsers use similar DP to count valid parse trees for ambiguous grammars.",
    pitfalls: ["A leading '0' (or any '0' not preceded by 1 or 2) produces 0 — handle this carefully.", "Two-digit numbers must be 10-26 inclusive, not 01-09 (those are invalid)."],
  },
  {
    id: "dynamic-programming-28",
    title: "Maximal Square",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array", "Matrix"],
    statement: "Given an m x n binary matrix of '0's and '1's, find the largest square containing only '1's and return its area.",
    examples: [
      { input: "matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]", output: "4" },
      { input: "matrix = [[\"0\",\"1\"],[\"1\",\"0\"]]", output: "1" },
    ],
    intuition: "dp[i][j] = side length of the largest all-1 square with its bottom-right corner at (i,j). This equals 1 plus the minimum of the three neighbours above, to the left, and diagonally above-left — the weakest link determines the square size.",
    approach: [
      "dp[i][j] = matrix[i][j] == '0' ? 0 : 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).",
      "Track maxSide as dp values are computed.",
      "Return maxSide * maxSide.",
    ],
    solution: `function maximalSquare(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  let maxSide = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (matrix[i - 1][j - 1] === "1") {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        maxSide = Math.max(maxSide, dp[i][j]);
      }
    }
  }
  return maxSide * maxSide;
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Maximal-square detection is used in image processing for blob detection and in VLSI floorplanning to find the largest usable rectangular region. In 2D spatial databases, finding the largest obstacle-free square block is a common geospatial query answered with this DP.",
    pitfalls: ["The result is area = side², not the side length itself.", "The DP is padded with a row and column of zeros to eliminate boundary checks."],
  },
  {
    id: "dynamic-programming-29",
    title: "Count Square Submatrices with All Ones",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array", "Matrix"],
    statement: "Given an m x n matrix of 0s and 1s, return the total number of square submatrices that have all 1s.",
    examples: [
      { input: "matrix = [[0,1,1,1],[1,1,1,1],[0,1,1,1]]", output: "15" },
      { input: "matrix = [[1,0,1],[1,1,0],[1,1,0]]", output: "7" },
    ],
    intuition: "The dp value at each cell counts how many all-1 squares have their bottom-right corner at that cell (one for each possible size 1x1, 2x2, etc.). Summing all dp values gives the total count.",
    approach: [
      "Same DP as Maximal Square: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) if cell is 1.",
      "Instead of tracking max, accumulate the sum of all dp values.",
      "Return total sum.",
    ],
    solution: `function countSquares(matrix) {
  const m = matrix.length, n = matrix[0].length;
  let total = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 1 && i > 0 && j > 0) {
        matrix[i][j] = 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
      }
      total += matrix[i][j];
    }
  }
  return total;
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(1)" },
    systemDesign: "Counting all squares is used in spatial index construction for multi-resolution tile maps (counting all zoom-level tiles that are fully covered by data). Columnar databases use similar 2D aggregation to build bitmap indexes across two dimensions.",
    pitfalls: ["Mutating the input matrix saves space. If mutation is forbidden, use a separate dp array.", "Each dp[i][j] value represents the count of squares ending at that cell, so summing it is correct."],
  },
  {
    id: "dynamic-programming-30",
    title: "Ones and Zeroes",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array", "String"],
    statement: "You are given an array of binary strings strs and two integers m and n. Find the size of the largest subset of strs such that there are at most m zeros and n ones in the subset.",
    examples: [
      { input: "strs = [\"10\",\"0001\",\"111001\",\"1\",\"0\"], m = 5, n = 3", output: "4" },
      { input: "strs = [\"10\",\"0\",\"1\"], m = 1, n = 1", output: "2" },
    ],
    intuition: "This is a 2D knapsack: each item (string) has two weights (count of 0s and 1s) and unit value. Iterate backwards over the 2D capacity table to fill it with the maximum subset size.",
    approach: [
      "dp[i][j] = max subset size with at most i zeros and j ones.",
      "For each string, count its zeros and ones.",
      "Update dp[i][j] = max(dp[i][j], dp[i-zeros][j-ones] + 1) iterating i and j backwards.",
      "Return dp[m][n].",
    ],
    solution: `function findMaxForm(strs, m, n) {
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (const s of strs) {
    let zeros = 0, ones = 0;
    for (const c of s) c === "0" ? zeros++ : ones++;
    for (let i = m; i >= zeros; i--) {
      for (let j = n; j >= ones; j--) {
        dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);
      }
    }
  }
  return dp[m][n];
}`,
    language: "javascript",
    complexity: { time: "O(strs.length * m * n)", space: "O(m*n)" },
    systemDesign: "2D knapsack models multi-resource constrained scheduling: allocate tasks to servers where each task consumes both CPU and memory, maximising the number of tasks scheduled within total resource budgets. Cloud function schedulers (AWS Lambda) use this to pack function invocations into resource slots.",
    pitfalls: ["Iterate both dimensions backwards to prevent reusing the same string multiple times.", "Count zeros and ones per string once, not inside the inner loops."],
  },
  {
    id: "dynamic-programming-31",
    title: "Longest Palindromic Subsequence",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "String"],
    statement: "Given a string s, find the longest palindromic subsequence's length.",
    examples: [
      { input: "s = \"bbbab\"", output: "4", explanation: "\"bbbb\" is the longest palindromic subsequence." },
      { input: "s = \"cbbd\"", output: "2" },
    ],
    intuition: "The longest palindromic subsequence of s equals the LCS of s and its reverse — matching characters from both ends works because a palindrome reads the same forwards and backwards.",
    approach: [
      "Reverse s to get t.",
      "Return LCS(s, t) using the standard 2D DP.",
    ],
    solution: `function longestPalindromeSubseq(s) {
  const t = s.split("").reverse().join("");
  const n = s.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === t[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[n][n];
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n²)" },
    systemDesign: "Palindromic subsequence detection is used in DNA sequence analysis to find inverted repeat regions (palindromic sequences in genetics). Search engines use similar LCS-on-reverse matching to find semantically symmetric query patterns for query expansion.",
    pitfalls: ["LPS != LCS of s with itself (that is just s). It must be LCS of s with its reverse.", "Space can be reduced to O(n) with a two-row rolling array."],
  },
  {
    id: "dynamic-programming-32",
    title: "Palindromic Substrings",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "String", "Two Pointers"],
    statement: "Given a string s, return the number of palindromic substrings. A substring is a contiguous sequence of characters within the string.",
    examples: [
      { input: "s = \"abc\"", output: "3", explanation: "a, b, c." },
      { input: "s = \"aaa\"", output: "6", explanation: "a, a, a, aa, aa, aaa." },
    ],
    intuition: "Expand around every possible centre (single character and between two characters). Each successful expansion adds one palindrome to the count.",
    approach: [
      "For each centre (2n-1 total centres for odd/even lengths):",
      "Expand left and right while characters match.",
      "Increment count for each valid expansion.",
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
    expand(i, i);     // odd length
    expand(i, i + 1); // even length
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(1)" },
    systemDesign: "Palindrome detection is used in data deduplication systems that detect symmetric byte patterns in compressed data streams. Intrusion detection systems use palindromic pattern matching to identify certain network packet payloads used in buffer-overflow exploits.",
    pitfalls: ["There are 2n-1 possible centres (n single-char and n-1 between-char) — cover both.", "Manacher's algorithm gives O(n) but expand-around-centre is usually sufficient."],
  },
  {
    id: "dynamic-programming-33",
    title: "Best Time to Buy and Sell Stock with Cooldown",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array"],
    statement: "Given a prices array, find the maximum profit from as many buy/sell transactions as you like, but after selling you must wait one day (cooldown) before buying again.",
    examples: [
      { input: "prices = [1,2,3,0,2]", output: "3", explanation: "Buy 1, sell 3 (cooldown day 0), buy 0, sell 2. Profit = 3." },
      { input: "prices = [1]", output: "0" },
    ],
    intuition: "Track three states for each day: holding a stock, having just sold (cooldown), and resting (no stock, not in cooldown). The transitions between states encode the cooldown constraint.",
    approach: [
      "hold = max profit while holding stock.",
      "sold = max profit on the day you just sold.",
      "rest = max profit while resting (no stock, past cooldown).",
      "Transitions: newHold = max(hold, rest-price); newSold = hold+price; newRest = max(rest, sold).",
    ],
    solution: `function maxProfitWithCooldown(prices) {
  let hold = -Infinity, sold = 0, rest = 0;
  for (const p of prices) {
    const prevHold = hold, prevSold = sold, prevRest = rest;
    hold = Math.max(prevHold, prevRest - p);
    sold = prevHold + p;
    rest = Math.max(prevRest, prevSold);
  }
  return Math.max(sold, rest);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "State-machine DP with cooldown models rate-limited API clients that must wait one period after a burst before calling again. Workflow engines with retry-and-cooldown policies use the same three-state machine (active, cooling down, idle) to maximise throughput under rate constraints.",
    pitfalls: ["Initialise hold=-Infinity to represent 'haven't bought yet' correctly.", "Save previous state values before computing new ones to avoid using updated values in the same step."],
  },
  {
    id: "dynamic-programming-34",
    title: "Jump Game II",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array", "Greedy"],
    statement: "Given an array nums where nums[i] is the maximum jump from index i, return the minimum number of jumps needed to reach the last index. The answer is guaranteed to exist.",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "2" },
      { input: "nums = [2,3,0,1,4]", output: "2" },
    ],
    intuition: "Think of BFS levels: within the current jump's reach is one level. Scan all positions in the current level to find the furthest reach of the next level. When you step past the current level, take a jump.",
    approach: [
      "curEnd = 0, farthest = 0, jumps = 0.",
      "For i from 0 to n-2: farthest = max(farthest, i+nums[i]).",
      "If i == curEnd: jumps++, curEnd = farthest.",
      "Return jumps.",
    ],
    solution: `function jump(nums) {
  let jumps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === curEnd) {
      jumps++;
      curEnd = farthest;
    }
  }
  return jumps;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Minimum-hops routing corresponds to BFS shortest-path in a network graph and is used in CDN hop-count minimisation and BGP routing table lookups. Distributed workflow engines minimise the number of stage transitions (each stage = one jump level) to reduce serialisation overhead.",
    pitfalls: ["Loop only to n-2 — no jump needed from the last index.", "This greedy beats DP for this problem because you always want to extend the current range as far as possible."],
  },
  {
    id: "dynamic-programming-35",
    title: "Number of Longest Increasing Subsequences",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array"],
    statement: "Given an integer array nums, return the number of longest increasing subsequences.",
    examples: [
      { input: "nums = [1,3,5,4,7]", output: "2", explanation: "[1,3,5,7] and [1,3,4,7]." },
      { input: "nums = [2,2,2,2,2]", output: "5" },
    ],
    intuition: "Run the standard LIS DP but also maintain a count array. For each element, if extending an LIS of the same length, add the predecessor's count; if finding a strictly longer LIS, reset the count.",
    approach: [
      "len[i] = length of LIS ending at i; cnt[i] = number of such LIS.",
      "For each i, check all j < i where nums[j] < nums[i].",
      "If len[j]+1 > len[i]: update len[i] and cnt[i]=cnt[j].",
      "Else if len[j]+1 == len[i]: cnt[i] += cnt[j].",
      "Sum cnt[i] for all i where len[i] == maxLen.",
    ],
    solution: `function findNumberOfLIS(nums) {
  const n = nums.length;
  const len = new Array(n).fill(1);
  const cnt = new Array(n).fill(1);
  let maxLen = 1;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        if (len[j] + 1 > len[i]) {
          len[i] = len[j] + 1;
          cnt[i] = cnt[j];
        } else if (len[j] + 1 === len[i]) {
          cnt[i] += cnt[j];
        }
      }
    }
    maxLen = Math.max(maxLen, len[i]);
  }
  return len.reduce((sum, l, i) => sum + (l === maxLen ? cnt[i] : 0), 0);
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n)" },
    systemDesign: "Counting optimal solutions (not just finding one) is used in multi-path routing protocols that enumerate all equal-cost paths for load balancing (ECMP). Database query optimisers track the number of equivalent optimal plans to select the one with the best secondary criteria (e.g. least memory).",
    pitfalls: ["Reset cnt[i] = cnt[j] (not 1) when a new longer LIS is found through j.", "Sum only the counts where len[i] == maxLen — not all counts."],
  },
  // ---- HARD ----
  {
    id: "dynamic-programming-36",
    title: "Edit Distance",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "String"],
    statement: "Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) required to convert word1 into word2.",
    examples: [
      { input: "word1 = \"horse\", word2 = \"ros\"", output: "3" },
      { input: "word1 = \"intention\", word2 = \"execution\"", output: "5" },
    ],
    intuition: "dp[i][j] = minimum edits to convert word1[0..i-1] to word2[0..j-1]. If the current characters match, no new edit is needed (take the diagonal). Otherwise take the minimum of insert, delete, or replace.",
    approach: [
      "dp[0][j] = j (delete all), dp[i][0] = i (insert all).",
      "If word1[i-1]==word2[j-1]: dp[i][j]=dp[i-1][j-1].",
      "Else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).",
      "Return dp[m][n].",
    ],
    solution: `function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => {
    const row = new Array(n + 1).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Edit distance (Levenshtein distance) powers spell-checkers, fuzzy search in search engines (Elasticsearch's fuzzy query), and DNA sequence alignment pipelines. Git's diff and merge algorithms are based on edit-distance variants; databases use it for approximate string matching in LIKE queries with typo tolerance.",
    pitfalls: ["Three operations map to three DP predecessors: delete (from left), insert (from above), replace (from diagonal).", "Space can be reduced to O(min(m,n)) with a two-row rolling array."],
  },
  {
    id: "dynamic-programming-37",
    title: "Distinct Subsequences",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "String"],
    statement: "Given strings s and t, return the number of distinct subsequences of s which equal t.",
    examples: [
      { input: "s = \"rabbbit\", t = \"rabbit\"", output: "3" },
      { input: "s = \"babgbag\", t = \"bag\"", output: "5" },
    ],
    intuition: "dp[i][j] = number of ways to form t[0..j-1] using s[0..i-1]. If characters match, you can either use s[i] to match t[j] (adding dp[i-1][j-1]) or skip s[i] (adding dp[i-1][j]).",
    approach: [
      "dp[i][0] = 1 for all i (empty t is always matchable).",
      "If s[i-1]==t[j-1]: dp[i][j] = dp[i-1][j-1] + dp[i-1][j].",
      "Else: dp[i][j] = dp[i-1][j].",
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
    systemDesign: "Counting distinct subsequences models the number of ways an event log can produce a given audit trail sequence, used in compliance systems that verify regulatory event sequences. Bioinformatics tools count the number of distinct ways a motif appears in a genome as a subsequence.",
    pitfalls: ["dp[i][0]=1 for all i (empty target always matches once). dp[0][j>0]=0 (non-empty target never matches empty source).", "Values can grow large — JavaScript BigInt may be needed for very long strings."],
  },
  {
    id: "dynamic-programming-38",
    title: "Interleaving String",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "String"],
    statement: "Given strings s1, s2, and s3, return true if s3 is formed by an interleaving of s1 and s2. An interleaving of two strings s and t is a configuration where they are divided into non-empty substrings such that s = s1+s2+...+sn, t = t1+t2+...+tm, and interleaving is one of s1+t1+s2+t2+....",
    examples: [
      { input: "s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbcbcac\"", output: "true" },
      { input: "s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbbaccc\"", output: "false" },
    ],
    intuition: "dp[i][j] = can s3[0..i+j-1] be formed by interleaving s1[0..i-1] and s2[0..j-1]? At each cell you either consumed the next character from s1 or from s2.",
    approach: [
      "dp[0][0] = true.",
      "Fill first row using only s2, first column using only s1.",
      "dp[i][j] = (dp[i-1][j] && s1[i-1]==s3[i+j-1]) || (dp[i][j-1] && s2[j-1]==s3[i+j-1]).",
      "Return dp[m][n].",
    ],
    solution: `function isInterleave(s1, s2, s3) {
  const m = s1.length, n = s2.length;
  if (m + n !== s3.length) return false;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let i = 1; i <= m; i++) dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];
  for (let j = 1; j <= n; j++) dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        (dp[i - 1][j] && s1[i - 1] === s3[i + j - 1]) ||
        (dp[i][j - 1] && s2[j - 1] === s3[i + j - 1]);
    }
  }
  return dp[m][n];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Interleaving validation models concurrent log merging in distributed systems — verifying that a merged event log is a valid interleaving of two concurrent transaction logs. Distributed database consistency checkers use this DP to validate that merged operation histories respect per-session ordering.",
    pitfalls: ["Early return false if lengths do not add up.", "The index into s3 is i+j-1 (zero-indexed), not i+j."],
  },
  {
    id: "dynamic-programming-39",
    title: "Longest Valid Parentheses",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Stack", "String"],
    statement: "Given a string containing only '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
    examples: [
      { input: "s = \"(()\"", output: "2" },
      { input: "s = \")()())\"", output: "4" },
      { input: "s = \"\"", output: "0" },
    ],
    intuition: "dp[i] = length of the longest valid parentheses ending at index i. A ')' can close either the immediately preceding '(' or extend a longer valid sequence by connecting it to a valid sequence ending just before the matching '('.",
    approach: [
      "dp[i] = 0 for all i.",
      "For each ')' at index i:",
      "  If s[i-1]=='(': dp[i] = dp[i-2]+2.",
      "  Else if dp[i-1]>0 and s[i-1-dp[i-1]]=='(': dp[i] = dp[i-1]+2 + dp[i-dp[i-1]-2].",
      "Return max of dp.",
    ],
    solution: `function longestValidParentheses(s) {
  const n = s.length;
  const dp = new Array(n).fill(0);
  let maxLen = 0;
  for (let i = 1; i < n; i++) {
    if (s[i] === ")") {
      if (s[i - 1] === "(") {
        dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
      } else if (dp[i - 1] > 0) {
        const j = i - dp[i - 1] - 1;
        if (j >= 0 && s[j] === "(") {
          dp[i] = dp[i - 1] + 2 + (j > 0 ? dp[j - 1] : 0);
        }
      }
      maxLen = Math.max(maxLen, dp[i]);
    }
  }
  return maxLen;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Valid parentheses detection is used in XML/JSON validators and query expression parsers in databases. Compiler front-ends track brace balance with a stack or DP to identify the longest syntactically valid block, enabling partial-parse error recovery in IDE language servers.",
    pitfalls: ["When s[i-1] is ')', skip to the character before the matched inner segment using dp[i-1] to find the potential matching '('.", "Add the dp value before the opening '(' to chain consecutive valid segments."],
  },
  {
    id: "dynamic-programming-40",
    title: "Burst Balloons",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Array", "Divide and Conquer"],
    statement: "Given n balloons each with a number nums[i], when you burst balloon i you get nums[i-1]*nums[i]*nums[i+1] coins. Treat out-of-bounds as 1. Return the maximum coins you can collect by bursting all balloons.",
    examples: [
      { input: "nums = [3,1,5,8]", output: "167", explanation: "Burst order 1,5,3,8 gives 167." },
      { input: "nums = [1,5]", output: "10" },
    ],
    intuition: "Think about the last balloon to burst in any interval — it earns nums[left-1]*nums[last]*nums[right+1]. dp[i][j] = max coins from bursting all balloons in the open interval (i,j), trying every possible last balloon.",
    approach: [
      "Pad nums with 1 at both ends.",
      "dp[i][j] = max coins from interval (i,j) exclusive.",
      "For length from 2 to n+1: for each (i,j): try each k in (i,j) as the last burst: dp[i][j] = max(dp[i][j], dp[i][k]+dp[k][j]+nums[i]*nums[k]*nums[j]).",
      "Return dp[0][n+1].",
    ],
    solution: `function maxCoins(nums) {
  nums = [1, ...nums, 1];
  const n = nums.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let len = 2; len < n; len++) {
    for (let i = 0; i < n - len; i++) {
      const j = i + len;
      for (let k = i + 1; k < j; k++) {
        dp[i][j] = Math.max(dp[i][j], dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j]);
      }
    }
  }
  return dp[0][n - 1];
}`,
    language: "javascript",
    complexity: { time: "O(n³)", space: "O(n²)" },
    systemDesign: "Interval DP (thinking about the last operation instead of the first) is used in matrix chain multiplication optimisation (minimising floating-point operations in ML pipelines) and in optimal query plan enumeration in databases where the last join to execute determines the intermediate result sizes.",
    pitfalls: ["Think of k as the LAST balloon burst in the interval, not the first — this avoids dependency issues.", "Iterate by interval length, not by start index, to ensure sub-problems are solved before they are needed."],
  },
  {
    id: "dynamic-programming-41",
    title: "Regular Expression Matching",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "String", "Recursion"],
    statement: "Given input string s and pattern p, implement regular expression matching with '.' (matches any single character) and '*' (matches zero or more of the preceding element). The matching must cover the entire input string.",
    examples: [
      { input: "s = \"aa\", p = \"a*\"", output: "true" },
      { input: "s = \"ab\", p = \".*\"", output: "true" },
      { input: "s = \"aab\", p = \"c*a*b\"", output: "true" },
    ],
    intuition: "dp[i][j] = does s[0..i-1] match p[0..j-1]? A '*' in the pattern either matches zero occurrences (skip the pair p[j-2..j-1]) or one more occurrence of p[j-2] if it matches s[i-1].",
    approach: [
      "dp[0][0]=true; fill dp[0][j] for patterns like 'a*b*'.",
      "If p[j-1]!='*': dp[i][j] = dp[i-1][j-1] && (s[i-1]==p[j-1] || p[j-1]=='.').",
      "If p[j-1]=='*': dp[i][j] = dp[i][j-2] (zero match) || (dp[i-1][j] && (s[i-1]==p[j-2] || p[j-2]=='.')) (one more match).",
      "Return dp[m][n].",
    ],
    solution: `function isMatch(s, p) {
  const m = s.length, n = p.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= n; j++) {
    if (p[j - 1] === "*") dp[0][j] = dp[0][j - 2];
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        dp[i][j] = dp[i][j - 2] ||
          (dp[i - 1][j] && (s[i - 1] === p[j - 2] || p[j - 2] === "."));
      } else {
        dp[i][j] = dp[i - 1][j - 1] && (s[i - 1] === p[j - 1] || p[j - 1] === ".");
      }
    }
  }
  return dp[m][n];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Regex matching DP underpins compiled regex engines (PCRE, RE2) that convert patterns to DFAs/NFAs for matching log lines at gigabit line rates in network appliances. Database engines implement LIKE pattern matching and full-text search using finite-automaton constructions derived from the same DP.",
    pitfalls: ["The '*' always refers to the preceding element — process it as a pair (x*). Never allow a '*' as the first pattern character.", "dp[0][j] for even j can be true if the pattern is all 'x*' pairs — handle this initialisation."],
  },
  {
    id: "dynamic-programming-42",
    title: "Wildcard Matching",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "String", "Greedy"],
    statement: "Given an input string s and a pattern p, implement wildcard pattern matching where '?' matches any single character and '*' matches any sequence of characters (including empty).",
    examples: [
      { input: "s = \"aa\", p = \"*\"", output: "true" },
      { input: "s = \"cb\", p = \"?a\"", output: "false" },
      { input: "s = \"adceb\", p = \"*a*b\"", output: "true" },
    ],
    intuition: "Similar to regex matching but '*' matches any substring. dp[i][j] = true if s[0..i-1] matches p[0..j-1]. A '*' in the pattern can match nothing (dp[i][j-1]) or one more character (dp[i-1][j]).",
    approach: [
      "dp[0][0]=true; dp[0][j]=true while p[j-1]=='*'.",
      "If p[j-1]=='*': dp[i][j] = dp[i][j-1] || dp[i-1][j].",
      "Else: dp[i][j] = dp[i-1][j-1] && (s[i-1]==p[j-1] || p[j-1]=='?').",
      "Return dp[m][n].",
    ],
    solution: `function isMatchWildcard(s, p) {
  const m = s.length, n = p.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === "*") dp[0][j] = dp[0][j - 1];
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j - 1] && (s[i - 1] === p[j - 1] || p[j - 1] === "?");
      }
    }
  }
  return dp[m][n];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Wildcard matching is used in file system glob expansion (*.log, src/**/*.ts) and in cloud storage bucket policies (S3 prefix matching, IAM resource ARN wildcards). API gateway routing rules use '*' wildcard path matching implemented with optimised automata derived from this DP.",
    pitfalls: ["dp[i][j-1] means the '*' matches nothing (extend the zero-match case); dp[i-1][j] means the '*' consumes one more character.", "Multiple consecutive '*' characters are equivalent to a single '*' — no special handling needed."],
  },
  {
    id: "dynamic-programming-43",
    title: "Best Time to Buy and Sell Stock IV",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Array"],
    statement: "You are given an integer array prices and an integer k. Find the maximum profit using at most k transactions. A transaction is one buy followed by one sell.",
    examples: [
      { input: "prices = [2,4,1], k = 2", output: "2" },
      { input: "prices = [3,2,6,5,0,3], k = 2", output: "7" },
    ],
    intuition: "Track two states per transaction count: the best profit while holding a stock after at most t buys, and the best profit after completing at most t sells. Iterate over prices and update these states for each transaction level.",
    approach: [
      "If k >= n/2, allow unlimited transactions (greedy sum of positive diffs).",
      "buy[t] = max profit after at most t buys (last action: hold).",
      "sell[t] = max profit after at most t complete transactions.",
      "buy[t] = max(buy[t], sell[t-1]-price); sell[t] = max(sell[t], buy[t]+price).",
    ],
    solution: `function maxProfitK(k, prices) {
  const n = prices.length;
  if (k >= n / 2) {
    let profit = 0;
    for (let i = 1; i < n; i++) profit += Math.max(0, prices[i] - prices[i - 1]);
    return profit;
  }
  const buy = new Array(k + 1).fill(-Infinity);
  const sell = new Array(k + 1).fill(0);
  for (const p of prices) {
    for (let t = 1; t <= k; t++) {
      buy[t] = Math.max(buy[t], sell[t - 1] - p);
      sell[t] = Math.max(sell[t], buy[t] + p);
    }
  }
  return sell[k];
}`,
    language: "javascript",
    complexity: { time: "O(n*k)", space: "O(k)" },
    systemDesign: "Transaction-limited DP models constrained resource-lease scheduling where each lease (buy/sell) consumes one of k available permits. Regulatory capital models for banks use k-transaction DP to compute optimal trade sequences under position-limit rules.",
    pitfalls: ["When k >= n/2 there is no effective limit — switch to the greedy unlimited-transaction approach to avoid O(nk) TLE.", "Initialise buy with -Infinity (haven't bought yet) and sell with 0 (no profit yet)."],
  },
  {
    id: "dynamic-programming-44",
    title: "Russian Doll Envelopes",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Binary Search", "Sorting"],
    statement: "You are given an array of envelopes where envelopes[i] = [wi, hi]. An envelope can fit into another if both width and height of the inner are strictly smaller. Return the maximum number of envelopes you can Russian-doll (put one inside another).",
    examples: [
      { input: "envelopes = [[5,4],[6,4],[6,7],[2,3]]", output: "3", explanation: "[2,3] -> [5,4] -> [6,7]." },
      { input: "envelopes = [[1,1],[1,1],[1,1]]", output: "1" },
    ],
    intuition: "Sort by width ascending, then by height descending for equal widths (preventing two same-width envelopes from nesting). Then find the LIS on heights — the descending-height trick ensures equal widths contribute at most one envelope.",
    approach: [
      "Sort: ascending width, descending height on ties.",
      "Extract heights array.",
      "Apply O(n log n) LIS (patience sort) on heights.",
      "Return LIS length.",
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
    systemDesign: "Nested containment (each level strictly smaller) models hierarchical resource pool nesting — e.g. a large VM can only nest inside a larger reserved instance, and the maximum nesting depth determines the ideal reservation hierarchy. Multi-dimensional LIS also appears in version dependency resolution (semantic versioning).",
    pitfalls: ["Sort equal widths by height descending — this is the critical trick to prevent counting two same-width envelopes.", "Without the descending-height sort, the LIS on heights would incorrectly nest envelopes of the same width."],
  },
  {
    id: "dynamic-programming-45",
    title: "Stone Game",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Array", "Game Theory", "Math"],
    statement: "Alice and Bob play a game. They take turns (Alice first) picking from either end of a piles array of stones. The player with the most stones wins. Return true if Alice wins assuming optimal play.",
    examples: [
      { input: "piles = [5,3,4,5]", output: "true" },
      { input: "piles = [3,7,2,3]", output: "true" },
    ],
    intuition: "Alice always wins because she picks first and the total number of piles is even — she can always claim all even-indexed or all odd-indexed piles (whichever totals more) by choosing the right end on every turn.",
    approach: [
      "Mathematically always return true for arrays of even length.",
      "For general proof: dp[i][j] = the maximum score difference (current player minus opponent) achievable from piles[i..j].",
      "dp[i][j] = max(piles[i]-dp[i+1][j], piles[j]-dp[i][j-1]).",
    ],
    solution: `function stoneGame(piles) {
  // Alice always wins for even-length arrays
  // General DP proof:
  const n = piles.length;
  const dp = Array.from({ length: n }, (_, i) => {
    const row = new Array(n).fill(0);
    row[i] = piles[i];
    return row;
  });
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Math.max(piles[i] - dp[i + 1][j], piles[j] - dp[i][j - 1]);
    }
  }
  return dp[0][n - 1] > 0;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n²)" },
    systemDesign: "Game-theoretic interval DP is used in adversarial negotiation engines where two parties alternately claim resources from a bounded pool. Ad auction mechanisms simulate optimal bidder strategies using minimax DP to set reserve prices that maximise platform revenue.",
    pitfalls: ["The dp value represents the score advantage of the current player, not an absolute score.", "For the specific even-length constraint, the answer is always true — the DP shows the general proof."],
  },
  {
    id: "dynamic-programming-46",
    title: "Dungeon Game",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Array", "Matrix"],
    statement: "A knight starts in the top-left of a dungeon grid and must rescue the princess in the bottom-right. Each room has a value (positive or negative). The knight must always have at least 1 health point. Find the minimum initial health needed.",
    examples: [
      { input: "dungeon = [[-2,-3,3],[-5,-10,1],[10,30,-5]]", output: "7" },
      { input: "dungeon = [[0]]", output: "1" },
    ],
    intuition: "Work backwards from the princess's room. dp[i][j] = minimum health needed entering room (i,j). At each room, you need enough health to survive the room plus whatever the next room demands, with a minimum of 1.",
    approach: [
      "dp[m-1][n-1] = max(1, 1-dungeon[m-1][n-1]).",
      "Fill last row right-to-left and last column bottom-to-top.",
      "dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]).",
      "Return dp[0][0].",
    ],
    solution: `function calculateMinimumHP(dungeon) {
  const m = dungeon.length, n = dungeon[0].length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(Infinity));
  dp[m][n - 1] = 1; dp[m - 1][n] = 1;
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const need = Math.min(dp[i + 1][j], dp[i][j + 1]) - dungeon[i][j];
      dp[i][j] = Math.max(1, need);
    }
  }
  return dp[0][0];
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Backward-pass DP with minimum-resource constraints models SLA-guaranteed service chains: each microservice step has a latency cost, and you compute the minimum initial resource allocation (thread pool size) so the end-to-end SLA is met. Network QoS provisioning uses backward allocation for guaranteed-bandwidth paths.",
    pitfalls: ["Must work backwards — forward DP cannot capture the future minimum-health requirement.", "The minimum health at any room is 1 (the knight cannot have 0 or negative health)."],
  },
  {
    id: "dynamic-programming-47",
    title: "Cherry Pickup",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Array", "Matrix"],
    statement: "You have an n x n grid. You start at (0,0), go to (n-1,n-1) collecting cherries (1=cherry, -1=thorn, 0=empty), then return to (0,0). Thorns cannot be stepped on. Find the maximum cherries collectable.",
    examples: [
      { input: "grid = [[0,1,-1],[1,0,-1],[1,1,1]]", output: "5" },
      { input: "grid = [[1,1,-1],[1,-1,1],[-1,1,1]]", output: "0" },
    ],
    intuition: "Simulate two simultaneous forward trips (both from (0,0) to (n-1,n-1)). Use a 3D DP on (step, col1, col2) — two people walking together, sharing cherries only once when on the same cell.",
    approach: [
      "dp[r1][c1][c2] where r2 = r1+c1-c2 (same total steps).",
      "At each step, try all 4 direction combos for the two walkers.",
      "If either hits -1, return -Infinity.",
      "If same cell, count cherry once.",
      "Return max(0, dp[0][0][0]) starting from (0,0).",
    ],
    solution: `function cherryPickup(grid) {
  const n = grid.length;
  const memo = new Map();
  function dp(r1, c1, c2) {
    const r2 = r1 + c1 - c2;
    if (r1 >= n || r2 >= n || c1 >= n || c2 >= n) return -Infinity;
    if (grid[r1][c1] === -1 || grid[r2][c2] === -1) return -Infinity;
    if (r1 === n - 1 && c1 === n - 1) return grid[n - 1][n - 1];
    const key = \`\${r1},\${c1},\${c2}\`;
    if (memo.has(key)) return memo.get(key);
    let cherries = grid[r1][c1] + (r1 !== r2 || c1 !== c2 ? grid[r2][c2] : 0);
    const best = Math.max(
      dp(r1 + 1, c1, c2),
      dp(r1 + 1, c1, c2 + 1),
      dp(r1, c1 + 1, c2),
      dp(r1, c1 + 1, c2 + 1)
    );
    cherries += best;
    memo.set(key, cherries);
    return cherries;
  }
  return Math.max(0, dp(0, 0, 0));
}`,
    language: "javascript",
    complexity: { time: "O(n³)", space: "O(n³)" },
    systemDesign: "Simultaneous-path DP models dual-agent logistics optimisation — two delivery robots collecting packages on the same grid to maximise total pickups. Ride-sharing platforms use similar multi-agent DP to dispatch two drivers to maximise combined passenger pickups from a spatial grid.",
    pitfalls: ["Model as two simultaneous forward trips, not one forward + one backward — same state space, simpler transitions.", "Use r2 = r1+c1-c2 to derive the second row from step count, reducing state from 4D to 3D."],
  },
  {
    id: "dynamic-programming-48",
    title: "Frog Jump",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Array", "Hashing"],
    statement: "A frog starts on stone 0 and wants to reach the last stone. If the frog's last jump was of size k, its next jump must be k-1, k, or k+1. Given a sorted array of stone positions, determine if the frog can reach the last stone.",
    examples: [
      { input: "stones = [0,1,3,5,6,8,12,17]", output: "true" },
      { input: "stones = [0,1,2,3,4,8,9,11]", output: "false" },
    ],
    intuition: "At each stone, track the set of jump sizes that can reach it. For each reachable jump size k at a stone, try k-1, k, k+1 to the next stones. If any reach the last stone, return true.",
    approach: [
      "Map each stone position to its index for O(1) lookup.",
      "dp[i] = Set of jump sizes that land on stone i.",
      "dp[0] = {0}.",
      "For each stone i with jump k in dp[i]: try k-1, k, k+1 to reach stone at position stones[i]+jump.",
      "Return dp[last].size > 0.",
    ],
    solution: `function canCross(stones) {
  const posToIdx = new Map(stones.map((s, i) => [s, i]));
  const dp = stones.map(() => new Set());
  dp[0].add(0);
  for (let i = 0; i < stones.length; i++) {
    for (const k of dp[i]) {
      for (const next of [k - 1, k, k + 1]) {
        if (next <= 0) continue;
        const nextPos = stones[i] + next;
        if (posToIdx.has(nextPos)) {
          dp[posToIdx.get(nextPos)].add(next);
        }
      }
    }
  }
  return dp[stones.length - 1].size > 0;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n²)" },
    systemDesign: "Variable-stride reachability models TCP congestion window evolution — each ACK allows a window increase of ±1, and the set of reachable window sizes at each time step mirrors this DP. Adaptive bitrate streaming algorithms also evolve bandwidth estimates by ±1 quality level, modelling frog-jump state transitions.",
    pitfalls: ["Skip jump size 0 — a zero jump stays in place forever.", "Only valid stone positions (in the map) receive transitions — gaps not in the stones array are impassable."],
  },
  {
    id: "dynamic-programming-49",
    title: "Minimum Cost to Cut a Stick",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Array"],
    statement: "Given a wooden stick of length n and an array cuts of positions to cut it at, determine the minimum cost. The cost of each cut is the length of the stick being cut. Cuts can be performed in any order.",
    examples: [
      { input: "n = 7, cuts = [1,3,4,5]", output: "16" },
      { input: "n = 9, cuts = [5,6,1,4,2]", output: "22" },
    ],
    intuition: "This is interval DP: dp[i][j] = minimum cost to make all cuts between positions cuts[i] and cuts[j]. The cost of a cut is the length of the current segment (cuts[j]-cuts[i]). Try every cut point k in (i,j) as the first cut of this interval.",
    approach: [
      "Add 0 and n to cuts, then sort.",
      "dp[i][j] = min cost to cut the interval between cuts[i] and cuts[j].",
      "dp[i][j] = min over k in (i,j) of: cuts[j]-cuts[i] + dp[i][k] + dp[k][j].",
      "Return dp[0][m-1].",
    ],
    solution: `function minCost(n, cuts) {
  cuts = [0, ...cuts.sort((a, b) => a - b), n];
  const m = cuts.length;
  const dp = Array.from({ length: m }, () => new Array(m).fill(0));
  for (let len = 2; len < m; len++) {
    for (let i = 0; i < m - len; i++) {
      const j = i + len;
      dp[i][j] = Infinity;
      for (let k = i + 1; k < j; k++) {
        dp[i][j] = Math.min(dp[i][j], cuts[j] - cuts[i] + dp[i][k] + dp[k][j]);
      }
    }
  }
  return dp[0][m - 1];
}`,
    language: "javascript",
    complexity: { time: "O(m³)", space: "O(m²)" },
    systemDesign: "Interval DP for decomposition cost is directly analogous to matrix chain multiplication, used to minimise floating-point operations in ML tensor contraction pipelines. Compilers use interval DP to find the optimal order to evaluate subexpressions in arithmetic expressions, minimising register spills.",
    pitfalls: ["Add sentinel values 0 and n before sorting cuts — the boundaries are needed for the interval lengths.", "Iterate by interval length (outer loop), not by start index, to guarantee sub-problems are solved first."],
  },
  {
    id: "dynamic-programming-50",
    title: "Strange Printer",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "String"],
    statement: "There is a strange printer that prints a sequence of same characters at a time, starting and ending at any position. Given a string s, return the minimum number of turns the printer needs to print it.",
    examples: [
      { input: "s = \"aaabbb\"", output: "2" },
      { input: "s = \"aba\"", output: "2" },
    ],
    intuition: "dp[i][j] = minimum turns to print s[i..j]. If s[k] == s[i] for some k in (i,j], we can merge the print of s[i] with s[k], saving one turn (dp[i][j] = dp[i][k-1] + dp[k][j] instead of dp[i][k-1] + dp[k][j] + 1).",
    approach: [
      "dp[i][i] = 1 for all i.",
      "For length > 1: dp[i][j] = dp[i][j-1] + 1 (print s[j] separately).",
      "For each k in [i, j-1]: if s[k]==s[j], dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j]).",
      "  (The k+1..j sub-problem absorbs the j character into the k-print.)",
      "Return dp[0][n-1].",
    ],
    solution: `function strangePrinter(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      dp[i][j] = dp[i][j - 1] + 1;
      for (let k = i; k < j; k++) {
        if (s[k] === s[j]) {
          dp[i][j] = Math.min(dp[i][j], (k > i ? dp[i][k - 1] : 0) + dp[k][j - 1] + 1);
        }
      }
    }
  }
  return dp[0][n - 1];
}`,
    language: "javascript",
    complexity: { time: "O(n³)", space: "O(n²)" },
    systemDesign: "Minimum-print-turn DP models batch job scheduling where identical jobs can be grouped into one batch run, minimising the number of batch submissions. ETL pipeline designers use interval DP to group identical transformation passes to reduce the number of full-table scans over a dataset.",
    pitfalls: ["Iterating i from n-1 down ensures sub-problems dp[i+1..] are solved before dp[i..].", "When k==i, the dp[i][k-1] term is 0 (empty interval) — handle this boundary carefully."],
  },
];
