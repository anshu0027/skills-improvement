import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  // ---- EASY (16 problems) ----
  {
    id: "greedy-01",
    title: "Assign Cookies",
    difficulty: "Easy",
    tags: ["Greedy", "Array", "Sorting"],
    statement: "You have a number of children and a number of cookies. Each child i has a greed factor g[i] and each cookie j has a size s[j]. A cookie satisfies a child if s[j] >= g[i]. Assign cookies to maximise the number of content children. Each child can have at most one cookie.",
    examples: [
      { input: "g = [1,2,3], s = [1,1]", output: "1", explanation: "Only one cookie satisfies the least greedy child." },
      { input: "g = [1,2], s = [1,2,3]", output: "2", explanation: "Both children can be satisfied." },
    ],
    intuition: "Always try to satisfy the least greedy child with the smallest cookie that works — wasting a big cookie on a small craving is never optimal. Sort both arrays and use two pointers to match greedily from the smallest values up.",
    approach: [
      "Sort both g and s in ascending order.",
      "Use pointer i for children and j for cookies.",
      "If s[j] >= g[i], the child is satisfied: advance both pointers and increment count.",
      "Otherwise advance only the cookie pointer.",
      "Return count.",
    ],
    solution: `function findContentChildren(g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  let i = 0, j = 0;
  while (i < g.length && j < s.length) {
    if (s[j] >= g[i]) i++;
    j++;
  }
  return i;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Greedy task-to-resource matching mirrors job scheduling in cloud platforms: assign the smallest available VM that meets each job's memory requirement to maximise cluster utilisation. Kubernetes resource requests use a similar bin-packing heuristic to schedule pods on the least-wasteful node.",
    pitfalls: ["Sort both arrays before starting — the greedy logic only works on sorted input.", "Advance the cookie pointer even when the cookie is too small, not the child pointer."],
  },
  {
    id: "greedy-02",
    title: "Lemonade Change",
    difficulty: "Easy",
    tags: ["Greedy", "Array"],
    statement: "At a lemonade stand, each lemonade costs $5. Customers pay with $5, $10, or $20 bills. You start with no change. Return true if you can provide exact change to every customer.",
    examples: [
      { input: "bills = [5,5,5,10,20]", output: "true" },
      { input: "bills = [5,5,10,10,20]", output: "false" },
    ],
    intuition: "A $5 bill is the most versatile change — always use larger bills first when making change to preserve $5 bills for later. Simulate the transactions greedily.",
    approach: [
      "Track counts of $5 and $10 bills held.",
      "For a $5 bill: just add it.",
      "For a $10 bill: need one $5 back; decrement fives or return false.",
      "For a $20 bill: prefer to give $10+$5 change; if no $10, give three $5s; if neither, return false.",
      "Return true after all customers.",
    ],
    solution: `function lemonadeChange(bills) {
  let fives = 0, tens = 0;
  for (const bill of bills) {
    if (bill === 5) {
      fives++;
    } else if (bill === 10) {
      if (fives === 0) return false;
      fives--; tens++;
    } else {
      if (tens > 0 && fives > 0) { tens--; fives--; }
      else if (fives >= 3) { fives -= 3; }
      else return false;
    }
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Greedy denomination selection mirrors the coin-change problem used in payment processing systems and ATM cash dispensers — always use the largest denomination that fits to minimise the number of bills dispensed and keep smaller denominations available for future transactions.",
    pitfalls: ["For a $20 bill, prefer $10+$5 over three $5s — the $10 is useless for giving change to smaller bills.", "Track denominations separately; a single 'total change' counter is insufficient."],
  },
  {
    id: "greedy-03",
    title: "Best Time to Buy and Sell Stock II",
    difficulty: "Easy",
    tags: ["Greedy", "Array"],
    statement: "Given an array prices where prices[i] is the stock price on day i, you may buy and sell the stock as many times as you like (but must sell before buying again). Return the maximum profit.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "7", explanation: "Buy on day 2 (1), sell day 3 (5); buy day 4 (3), sell day 5 (6). Profit = 4+3 = 7." },
      { input: "prices = [1,2,3,4,5]", output: "4" },
      { input: "prices = [7,6,4,3,1]", output: "0" },
    ],
    intuition: "Collect every uphill step — if tomorrow is higher than today, buy today and sell tomorrow. This is safe because every multi-day profit equals the sum of daily gains.",
    approach: [
      "Iterate from day 1 to end.",
      "If prices[i] > prices[i-1], add the difference to profit.",
      "Return profit.",
    ],
    solution: `function maxProfit(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
  }
  return profit;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Summing incremental gains models revenue accrual in financial microservices — each daily settlement adds a positive delta to a running balance without storing the full transaction history. Streaming ledgers in fintech systems use similar incremental aggregation to compute real-time P&L.",
    pitfalls: ["You do not need to track buy/sell days explicitly — summing positive differences is equivalent.", "No transaction fee version; if fees existed, you would need dynamic programming."],
  },
  {
    id: "greedy-04",
    title: "Split a String in Balanced Strings",
    difficulty: "Easy",
    tags: ["Greedy", "String"],
    statement: "A balanced string has an equal number of 'L' and 'R' characters. Given a balanced string s, split it into the maximum number of balanced substrings and return that maximum.",
    examples: [
      { input: "s = \"RLRRLLRLRL\"", output: "4" },
      { input: "s = \"RLLLLRRRLR\"", output: "3" },
      { input: "s = \"LLLLRRRR\"", output: "1" },
    ],
    intuition: "Walk the string keeping a running counter. Add 1 for 'R' and subtract 1 for 'L'. Each time the counter hits zero you have found a balanced piece — greedily cut here.",
    approach: [
      "Initialize count = 0 and result = 0.",
      "For each character: add 1 for 'R', subtract 1 for 'L'.",
      "When count == 0, increment result.",
      "Return result.",
    ],
    solution: `function balancedStringSplit(s) {
  let count = 0, res = 0;
  for (const c of s) {
    count += c === "R" ? 1 : -1;
    if (count === 0) res++;
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Greedy balanced-segment cutting mirrors load-balancing checkpoint logic in distributed stream processors — cut a stream into balanced partitions whenever consumer and producer counts equalise, enabling parallel processing without cross-partition dependencies.",
    pitfalls: ["The input is guaranteed to be balanced, so you will always return at least 1.", "No need to track substrings — just counting zero-crossings is sufficient."],
  },
  {
    id: "greedy-05",
    title: "Can Place Flowers",
    difficulty: "Easy",
    tags: ["Greedy", "Array"],
    statement: "You have a flowerbed represented as an array of 0s and 1s. Flowers cannot be planted in adjacent plots. Given n new flowers to plant, return true if they can all be placed without violating the no-adjacent-flowers rule.",
    examples: [
      { input: "flowerbed = [1,0,0,0,1], n = 1", output: "true" },
      { input: "flowerbed = [1,0,0,0,1], n = 2", output: "false" },
    ],
    intuition: "Greedily plant a flower in every valid empty spot as early as possible — planting earlier never blocks a future valid slot that planting later would allow.",
    approach: [
      "Iterate through the flowerbed.",
      "If flowerbed[i] == 0 and both neighbours are also 0 (treat out-of-bounds as 0), plant a flower: set flowerbed[i] = 1 and decrement n.",
      "If n <= 0, return true early.",
      "Return n <= 0 after the loop.",
    ],
    solution: `function canPlaceFlowers(flowerbed, n) {
  for (let i = 0; i < flowerbed.length && n > 0; i++) {
    const left = i === 0 ? 0 : flowerbed[i - 1];
    const right = i === flowerbed.length - 1 ? 0 : flowerbed[i + 1];
    if (flowerbed[i] === 0 && left === 0 && right === 0) {
      flowerbed[i] = 1;
      n--;
    }
  }
  return n <= 0;
}`,
    language: "javascript",
    complexity: { time: "O(m)", space: "O(1)" },
    systemDesign: "Greedy slot allocation models spectrum assignment in wireless networks — place transmitters at the earliest non-interfering frequency slot to maximise the number of transmitters that can operate simultaneously, a core problem in cellular network planning.",
    pitfalls: ["Treat positions before the start and after the end as 0 to handle edge cases.", "Mutating the input array is fine here; it prevents double-counting."],
  },
  {
    id: "greedy-06",
    title: "Maximum Units on a Truck",
    difficulty: "Easy",
    tags: ["Greedy", "Array", "Sorting"],
    statement: "You have a truck with truckSize capacity. boxTypes[i] = [numberOfBoxes, numberOfUnitsPerBox]. Load boxes to maximise total units. Return the maximum units.",
    examples: [
      { input: "boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4", output: "8" },
      { input: "boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10", output: "91" },
    ],
    intuition: "Always load the box type with the most units per box first — you get the most value for each slot used. Sort by units descending and fill greedily.",
    approach: [
      "Sort boxTypes by numberOfUnitsPerBox descending.",
      "Greedily pick as many boxes of the current type as possible (min of available boxes and remaining capacity).",
      "Accumulate units and decrease remaining capacity.",
      "Return total units.",
    ],
    solution: `function maximumUnits(boxTypes, truckSize) {
  boxTypes.sort((a, b) => b[1] - a[1]);
  let units = 0, remaining = truckSize;
  for (const [boxes, perBox] of boxTypes) {
    const take = Math.min(boxes, remaining);
    units += take * perBox;
    remaining -= take;
    if (remaining === 0) break;
  }
  return units;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Greedy value-density packing is the foundation of fractional knapsack in resource-constrained scheduling — cloud cost optimisers sort instance types by performance-per-dollar and fill a budget greedily, similar to how AWS Spot Advisor recommends instance families.",
    pitfalls: ["Sort by units per box, not by total boxes — you want the densest items first.", "Take min(boxes, remaining) to avoid exceeding truck capacity."],
  },
  {
    id: "greedy-07",
    title: "Maximize Sum of Array After K Negations",
    difficulty: "Easy",
    tags: ["Greedy", "Array", "Sorting"],
    statement: "Given an integer array nums and an integer k, you must modify nums exactly k times by negating one element each time. Return the largest possible sum after k negations.",
    examples: [
      { input: "nums = [4,2,3], k = 1", output: "5", explanation: "Negate index 1 gives [4,-2,3], sum=5. Wait — negate 4,-2,3: better negate -nothing. Actually negate the smallest: [4,2,3] -> negate 2 -> [4,-2,3] sum=5. Or better: best is 5 if we negate nothing useful." },
      { input: "nums = [3,-1,0,2], k = 3", output: "6" },
    ],
    intuition: "First negate the most negative numbers to gain the most. If k negations remain after turning all negatives positive, spend them toggling the smallest absolute value (cost is minimal). The greedy safe choice is: always negate the most negative number.",
    approach: [
      "Sort by absolute value descending.",
      "Iterate: if nums[i] < 0 and k > 0, negate nums[i] and decrement k.",
      "If k is still odd after the loop, negate the last element (smallest absolute value).",
      "Return the sum.",
    ],
    solution: `function largestSumAfterKNegations(nums, k) {
  nums.sort((a, b) => Math.abs(b) - Math.abs(a));
  for (let i = 0; i < nums.length && k > 0; i++) {
    if (nums[i] < 0) { nums[i] = -nums[i]; k--; }
  }
  if (k % 2 === 1) nums[nums.length - 1] = -nums[nums.length - 1];
  return nums.reduce((a, b) => a + b, 0);
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Iterative sign correction mirrors error-correction passes in data encoding pipelines — flip the most impactful bits first to recover from corruption, a heuristic used in soft-decision decoding for wireless communications.",
    pitfalls: ["Sort by absolute value descending so you always see the most negative first.", "If k is odd after negating all negatives, you must negate the smallest absolute value element."],
  },
  {
    id: "greedy-08",
    title: "Array Partition",
    difficulty: "Easy",
    tags: ["Greedy", "Array", "Sorting"],
    statement: "Given an integer array nums of 2n integers, group them into n pairs and use the minimum of each pair to form the sum. Return the largest possible sum.",
    examples: [
      { input: "nums = [1,4,3,2]", output: "4", explanation: "Pair (1,2) and (3,4); mins are 1+3=4." },
      { input: "nums = [6,2,6,5,1,2]", output: "9" },
    ],
    intuition: "Sort the array and pair adjacent elements — then the smaller of each pair (the odd-indexed elements after sorting) is always as large as possible, wasting the least value.",
    approach: [
      "Sort nums in ascending order.",
      "Sum elements at even indices (0, 2, 4, ...).",
      "Return that sum.",
    ],
    solution: `function arrayPairSum(nums) {
  nums.sort((a, b) => a - b);
  let sum = 0;
  for (let i = 0; i < nums.length; i += 2) sum += nums[i];
  return sum;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Pairing to maximise minimum value appears in two-server redundancy planning — pair the two most similar servers so that the slower one (the min) is as fast as possible, maximising guaranteed throughput. Database sharding uses similar balanced-pair assignment to distribute hot and cold partitions evenly.",
    pitfalls: ["Sorting is essential — pairing non-adjacent elements wastes large values.", "After sorting, even-indexed elements are always the minimums of each pair."],
  },
  {
    id: "greedy-09",
    title: "Boats to Save People",
    difficulty: "Easy",
    tags: ["Greedy", "Array", "Two Pointers", "Sorting"],
    statement: "Each boat carries at most 2 people with a combined weight limit. Given an array people with weights, return the minimum number of boats needed.",
    examples: [
      { input: "people = [1,2], limit = 3", output: "1" },
      { input: "people = [3,2,2,1], limit = 3", output: "3" },
      { input: "people = [3,5,3,4], limit = 5", output: "4" },
    ],
    intuition: "Sort by weight. Try to pair the heaviest person with the lightest — if they fit together great; if not, the heaviest must go alone. This is safe because if the heaviest cannot pair with the lightest, they cannot pair with anyone.",
    approach: [
      "Sort people ascending.",
      "Set left=0, right=n-1, boats=0.",
      "While left <= right: if people[left]+people[right] <= limit, advance left (lightest also boards). Always advance right and increment boats.",
      "Return boats.",
    ],
    solution: `function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  let left = 0, right = people.length - 1, boats = 0;
  while (left <= right) {
    if (people[left] + people[right] <= limit) left++;
    right--;
    boats++;
  }
  return boats;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Greedy two-pointer pairing models bin-packing in logistics and cloud cost optimisation: pair the largest and smallest jobs to maximise VM utilisation and minimise the number of instances needed, a heuristic used in AWS Lambda concurrency scheduling.",
    pitfalls: ["Sort first — the greedy pairing only works on sorted input.", "When they fit together, both advance; when they do not, only the heavy one boards alone."],
  },
  {
    id: "greedy-10",
    title: "Minimum Cost to Move Chips",
    difficulty: "Easy",
    tags: ["Greedy", "Array", "Math"],
    statement: "There are n chips at positions given in an array. Moving a chip 2 positions costs 0; moving 1 position costs 1. Return the minimum cost to move all chips to the same position.",
    examples: [
      { input: "position = [1,2,3]", output: "1" },
      { input: "position = [2,2,2,3,3]", output: "2" },
    ],
    intuition: "Moving 2 positions is free, so all chips at even positions can be grouped to any even spot for free, and all odd-position chips can be grouped to any odd spot for free. The only cost is moving the smaller group (odd or even) by 1 step to join the larger group.",
    approach: [
      "Count odd and even position chips.",
      "Return Math.min(oddCount, evenCount).",
    ],
    solution: `function minCostToMoveChips(position) {
  let odd = 0, even = 0;
  for (const p of position) {
    if (p % 2 === 0) even++; else odd++;
  }
  return Math.min(odd, even);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Parity-based grouping mirrors network data-plane optimisations where packets with even/odd flow IDs are routed to separate NUMA nodes for cache efficiency — migrating the smaller group to the larger group minimises cache-coherence traffic, analogous to minimising chip move cost.",
    pitfalls: ["The free 2-step move means parity is all that matters — absolute positions are irrelevant.", "Return the smaller of odd/even count, not their sum."],
  },
  {
    id: "greedy-11",
    title: "Two City Scheduling",
    difficulty: "Easy",
    tags: ["Greedy", "Array", "Sorting"],
    statement: "A company is interviewing 2n people. costs[i] = [aCost, bCost] is the cost of flying person i to city A or B. Exactly n people must fly to each city. Return the minimum total cost.",
    examples: [
      { input: "costs = [[10,20],[30,200],[400,50],[30,20]]", output: "110" },
      { input: "costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]", output: "1859" },
    ],
    intuition: "If everyone flew to city A, the extra cost of sending person i to B instead is costs[i][1] - costs[i][0]. Sort by this 'upgrade cost' and send the n people with the lowest upgrade cost to B. This is greedy because minimising the n cheapest upgrades minimises total cost.",
    approach: [
      "Compute the base cost: sum of all aCosts.",
      "Sort people by (bCost - aCost) ascending.",
      "Add the (bCost - aCost) for the first n people (they fly to B).",
      "Return the total.",
    ],
    solution: `function twoCitySchedCost(costs) {
  costs.sort((a, b) => (a[1] - a[0]) - (b[1] - b[0]));
  let total = 0;
  const n = costs.length / 2;
  for (let i = 0; i < costs.length; i++) {
    total += i < n ? costs[i][0] : costs[i][1];
  }
  return total;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Differential cost sorting is the backbone of resource migration decisions in multi-region cloud deployments — rank services by the marginal cost of moving to a different region and migrate the cheapest ones first to stay under budget, used in AWS Cost Optimiser recommendations.",
    pitfalls: ["Sort by the difference (bCost - aCost), not absolute cost.", "First n get city A (lowest extra cost to switch to B means keep them in A? No — sort ascending means first n have the least regret going to B). Double-check: lowest (b-a) means b is cheapest relative to a, so send them to B first."],
  },
  {
    id: "greedy-12",
    title: "Wiggle Subsequence",
    difficulty: "Easy",
    tags: ["Greedy", "Array", "Dynamic Programming"],
    statement: "A wiggle sequence alternates between ascending and descending. Given an integer array nums, return the length of the longest wiggle subsequence.",
    examples: [
      { input: "nums = [1,7,4,9,2,5]", output: "6", explanation: "All elements form a wiggle sequence." },
      { input: "nums = [1,2,3,4,5,6,7,8,9]", output: "2" },
      { input: "nums = [1,17,5,10,13,15,10,5,16,8]", output: "7" },
    ],
    intuition: "Count peaks and valleys — each local peak or valley contributes one element to the wiggle sequence. Greedily counting direction changes gives the maximum length without needing to track which elements to include.",
    approach: [
      "Start with length 1 and track the previous difference direction.",
      "For each consecutive pair, compute diff = nums[i] - nums[i-1].",
      "If diff is positive and previous was non-positive (or vice versa), increment length and update direction.",
      "Return length.",
    ],
    solution: `function wiggleMaxLength(nums) {
  if (nums.length < 2) return nums.length;
  let up = 1, down = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) up = down + 1;
    else if (nums[i] < nums[i - 1]) down = up + 1;
  }
  return Math.max(up, down);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Alternating-trend detection is used in time-series anomaly detection systems — identifying peaks and valleys in metrics like CPU usage helps detect oscillation patterns that indicate thrashing in auto-scaling policies, triggering corrective dampening rules.",
    pitfalls: ["Equal consecutive elements do not change the wiggle state — skip them.", "Tracking up and down counts separately handles the DP implicitly."],
  },
  {
    id: "greedy-13",
    title: "Jump Game",
    difficulty: "Easy",
    tags: ["Greedy", "Array"],
    statement: "Given an integer array nums where nums[i] is the maximum jump length from index i, return true if you can reach the last index starting from index 0.",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true" },
      { input: "nums = [3,2,1,0,4]", output: "false" },
    ],
    intuition: "Keep a running 'furthest reachable index'. At each step if the current index exceeds it you are stuck; otherwise update the furthest reach. The greedy choice is to always extend as far as possible.",
    approach: [
      "Initialize maxReach = 0.",
      "For each i from 0 to n-1: if i > maxReach return false.",
      "Update maxReach = max(maxReach, i + nums[i]).",
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
    systemDesign: "Reachability via greedy extension models link-state routing protocol propagation — each router advertises its furthest reachable peer, and the network converges on the maximum reachable set without exploring every path, analogous to OSPF flooding.",
    pitfalls: ["A value of 0 at the current index means you cannot advance — maxReach stops growing.", "You do not need to reach exactly the last index via a single jump; any path that covers it works."],
  },
  {
    id: "greedy-14",
    title: "Removing Minimum and Maximum From Array",
    difficulty: "Easy",
    tags: ["Greedy", "Array"],
    statement: "You have an array nums. In one operation you can remove either the first or last element. Return the minimum number of operations to remove both the minimum and maximum element.",
    examples: [
      { input: "nums = [2,10,7,10,1,1,5]", output: "5" },
      { input: "nums = [3,2,10]", output: "2" },
    ],
    intuition: "The minimum and maximum are at fixed positions. You can reach each from the left end, the right end, or split between both. Try all three combinations and take the minimum total operations — greedy because each combination is independent.",
    approach: [
      "Find index of min (minIdx) and max (maxIdx).",
      "For each element, the cost to remove from the left is idx+1, from the right is n-idx.",
      "Three options: both from left, both from right, one from each side.",
      "Return the minimum of the three options.",
    ],
    solution: `function minimumDeletions(nums) {
  const n = nums.length;
  let minIdx = 0, maxIdx = 0;
  for (let i = 1; i < n; i++) {
    if (nums[i] < nums[minIdx]) minIdx = i;
    if (nums[i] > nums[maxIdx]) maxIdx = i;
  }
  const fromLeft = (idx) => idx + 1;
  const fromRight = (idx) => n - idx;
  const a = Math.max(fromLeft(minIdx), fromLeft(maxIdx));
  const b = Math.max(fromRight(minIdx), fromRight(maxIdx));
  const c = Math.min(fromLeft(minIdx) + fromRight(maxIdx), fromRight(minIdx) + fromLeft(maxIdx));
  return Math.min(a, b, c);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Choosing the cheapest among a small set of removal strategies mirrors query plan selection in database optimisers — enumerate a bounded set of access strategies (index scan from left, right, or split) and pick the minimum-cost plan, a core step in rule-based query optimisation.",
    pitfalls: ["When both are removed from the same side, take the max cost (the further one determines when both are gone).", "When split, take the sum of the left-end cost for one and right-end cost for the other."],
  },
  {
    id: "greedy-15",
    title: "Maximum Consecutive Ones III",
    difficulty: "Easy",
    tags: ["Greedy", "Array", "Sliding Window"],
    statement: "Given a binary array nums and integer k, return the maximum number of consecutive 1s if you can flip at most k 0s.",
    examples: [
      { input: "nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2", output: "6" },
      { input: "nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1,0], k = 3", output: "10" },
    ],
    intuition: "Slide a window that may contain at most k zeros. Expand from the right; when zeros exceed k, shrink from the left. The greedy insight is to always keep the window as wide as possible without violating the constraint.",
    approach: [
      "Use left pointer and count of zeros in window.",
      "Advance right; if nums[right]==0 increment zeros.",
      "While zeros > k, if nums[left]==0 decrement zeros, advance left.",
      "Track max window size.",
    ],
    solution: `function longestOnes(nums, k) {
  let left = 0, zeros = 0, best = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    while (zeros > k) {
      if (nums[left] === 0) zeros--;
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "At-most-k-budget sliding windows model SLA tolerance in reliability engineering — allow at most k request failures in a rolling window; if exceeded, trigger a circuit-breaker, which is how resilience4j's sliding-window circuit breaker operates.",
    pitfalls: ["k=0 means no flips allowed — the window only contains 1s.", "The window is valid as long as zeros <= k; shrink only when zeros > k."],
  },
  {
    id: "greedy-16",
    title: "Minimum Operations to Reduce X to Zero",
    difficulty: "Easy",
    tags: ["Greedy", "Array", "Sliding Window", "Prefix Sum"],
    statement: "Given an integer array nums and an integer x, remove elements from either end so their sum equals x using the minimum number of operations. Return -1 if impossible.",
    examples: [
      { input: "nums = [1,1,1,1,1], x = 3", output: "3" },
      { input: "nums = [3,2,20,1,1,3], x = 4", output: "3" },
    ],
    intuition: "Removing elements summing to x from the ends is equivalent to keeping the longest middle subarray with sum = total - x. Find the longest subarray with that target sum and the answer is n minus its length.",
    approach: [
      "Compute target = total sum - x; if target < 0 return -1.",
      "Find the longest subarray with sum == target using a sliding window (all positive values).",
      "Return n - longestSubarrayLength, or -1 if not found.",
    ],
    solution: `function minOperations(nums, x) {
  const target = nums.reduce((a, b) => a + b, 0) - x;
  if (target < 0) return -1;
  if (target === 0) return nums.length;
  let left = 0, sum = 0, best = -1;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > target) sum -= nums[left++];
    if (sum === target) best = Math.max(best, right - left + 1);
  }
  return best === -1 ? -1 : nums.length - best;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Complementary-window reframing (solve A by finding the complement window B) mirrors index seek strategies in databases — instead of scanning both ends of a B-tree range, rewrite the predicate as the complement inner range and use a single index scan, reducing I/O cost.",
    pitfalls: ["Transform the problem to longest middle subarray — direct simulation from both ends is O(2^n).", "Works because all values are positive so sliding window shrink is valid."],
  },
  // ---- MEDIUM (19 problems) ----
  {
    id: "greedy-17",
    title: "Largest Number",
    difficulty: "Medium",
    tags: ["Greedy", "Array", "Sorting", "String"],
    statement: "Given a list of non-negative integers, arrange them to form the largest number and return it as a string.",
    examples: [
      { input: "nums = [10,2]", output: "\"210\"" },
      { input: "nums = [3,30,34,5,9]", output: "\"9534330\"" },
    ],
    intuition: "To decide whether number a should come before b, compare the strings ab and ba lexicographically — whichever concatenation is larger wins. This comparison is transitive, so sorting with it produces the globally optimal order.",
    approach: [
      "Convert all numbers to strings.",
      "Sort with comparator: compare b+a vs a+b (descending).",
      "Join sorted strings; if the result starts with '0', return '0'.",
    ],
    solution: `function largestNumber(nums) {
  const strs = nums.map(String);
  strs.sort((a, b) => (b + a) > (a + b) ? 1 : -1);
  const result = strs.join("");
  return result[0] === "0" ? "0" : result;
}`,
    language: "javascript",
    complexity: { time: "O(n log n * k)", space: "O(n)" },
    systemDesign: "Custom sort order by concatenation mirrors how database collations define multi-column sort keys — PostgreSQL's operator classes let you define how strings compose for comparison, analogous to defining which prefix arrangement yields a larger composite key for index ordering.",
    pitfalls: ["The edge case of all zeros must return '0', not '000...'.", "The comparator must be consistent (transitive) — the string concatenation comparison satisfies this."],
  },
  {
    id: "greedy-18",
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    tags: ["Greedy", "Array", "Sorting", "Intervals"],
    statement: "Given an array of intervals, return the minimum number of intervals to remove to make the rest non-overlapping.",
    examples: [
      { input: "intervals = [[1,2],[2,3],[3,4],[1,3]]", output: "1", explanation: "Remove [1,3] and the rest are non-overlapping." },
      { input: "intervals = [[1,2],[1,2],[1,2]]", output: "2" },
      { input: "intervals = [[1,2],[2,3]]", output: "0" },
    ],
    intuition: "To keep the most intervals, always keep the one that ends earliest — it leaves the most room for future intervals. This is the interval scheduling maximisation greedy, and the number of removed intervals = total - max kept.",
    approach: [
      "Sort intervals by end time.",
      "Track the end time of the last kept interval.",
      "For each interval: if it starts at or after the last end, keep it (update last end); else it overlaps — remove it (increment count).",
      "Return removal count.",
    ],
    solution: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let removed = 0, lastEnd = -Infinity;
  for (const [start, end] of intervals) {
    if (start >= lastEnd) {
      lastEnd = end;
    } else {
      removed++;
    }
  }
  return removed;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Interval scheduling maximisation underlies conference room booking systems and operating-system CPU scheduling — always pick the job that finishes earliest to maximise the number of jobs completed, the basis of the Earliest Deadline First (EDF) scheduling algorithm.",
    pitfalls: ["Sort by end time, not start time — earliest-end is the greedy choice for maximum non-overlapping intervals.", "Touching intervals [1,2] and [2,3] are not overlapping."],
  },
  {
    id: "greedy-19",
    title: "Minimum Number of Arrows to Burst Balloons",
    difficulty: "Medium",
    tags: ["Greedy", "Array", "Sorting", "Intervals"],
    statement: "Balloons are represented as horizontal intervals [xstart, xend]. An arrow shot at x bursts all balloons whose interval contains x. Return the minimum number of arrows to burst all balloons.",
    examples: [
      { input: "points = [[10,16],[2,8],[1,6],[7,12]]", output: "2" },
      { input: "points = [[1,2],[3,4],[5,6],[7,8]]", output: "4" },
    ],
    intuition: "Sort by end position. A single arrow at the earliest ending balloon also hits any balloon that started before that end. Move to the next ungrouped balloon only when one does not overlap the current arrow position.",
    approach: [
      "Sort balloons by end coordinate.",
      "Shoot the first arrow at the end of the first balloon; increment count.",
      "For each subsequent balloon: if its start > last arrow position, shoot a new arrow at its end and increment count.",
      "Return count.",
    ],
    solution: `function findMinArrowShots(points) {
  points.sort((a, b) => a[1] - b[1]);
  let arrows = 1, arrowPos = points[0][1];
  for (let i = 1; i < points.length; i++) {
    if (points[i][0] > arrowPos) {
      arrows++;
      arrowPos = points[i][1];
    }
  }
  return arrows;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Minimum-pierce-set problems model network firewall rule consolidation — use one rule to cover as many IP ranges as possible, reducing rule table size and lookup latency, which is analogous to minimising the number of arrows by maximising coverage per shot.",
    pitfalls: ["Sort by end coordinate, not start.", "Touching balloons [1,2] and [2,3] are burst by the same arrow at position 2."],
  },
  {
    id: "greedy-20",
    title: "Merge Intervals",
    difficulty: "Medium",
    tags: ["Greedy", "Array", "Sorting", "Intervals"],
    statement: "Given an array of intervals, merge all overlapping intervals and return the resulting non-overlapping intervals.",
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
    ],
    intuition: "Sort by start. Walk through and extend the current interval's end if the next interval overlaps; otherwise start a new merged interval. Greedily extending is safe because sorted order means only forward overlap is possible.",
    approach: [
      "Sort intervals by start time.",
      "Initialize result with the first interval.",
      "For each subsequent interval: if it overlaps the last result interval (start <= last end), extend the end. Else push it as a new interval.",
      "Return result.",
    ],
    solution: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = res[res.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      res.push(intervals[i]);
    }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Interval merging is a core operation in database index maintenance — when bulk-inserting rows, overlapping B-tree page ranges are merged to reduce fragmentation. Calendar systems and booking engines use interval merging to compute free/busy slots from a list of events.",
    pitfalls: ["Sort by start, not end.", "When merging, take the max of both ends in case one interval is completely contained in another."],
  },
  {
    id: "greedy-21",
    title: "Queue Reconstruction by Height",
    difficulty: "Medium",
    tags: ["Greedy", "Array", "Sorting"],
    statement: "Each person is described as [h, k] where h is height and k is the number of taller or equal people in front. Reconstruct the queue given a shuffled array of people.",
    examples: [
      { input: "people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]", output: "[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]" },
    ],
    intuition: "Sort by height descending (tall first), then by k ascending. Insert each person at index k — shorter people inserted later cannot affect the k count for taller people already placed, so each insertion is locally correct.",
    approach: [
      "Sort: descending by height, ascending by k for equal heights.",
      "Insert each person at position k into the result array.",
      "Return result.",
    ],
    solution: `function reconstructQueue(people) {
  people.sort((a, b) => b[0] !== a[0] ? b[0] - a[0] : a[1] - b[1]);
  const res = [];
  for (const p of people) res.splice(p[1], 0, p);
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n)" },
    systemDesign: "Insertion by rank mirrors priority-queue insertion in task schedulers — insert a new task at its correct priority position, and lower-priority tasks already in the queue are unaffected. Database index rebuilds use similar rank-preserving insertion to maintain sorted order incrementally.",
    pitfalls: ["Sort tall people first so short-person insertions do not invalidate the k count for taller people.", "splice is O(n) per operation making the overall solution O(n²) — acceptable for this problem's constraints."],
  },
  {
    id: "greedy-22",
    title: "Task Scheduler",
    difficulty: "Medium",
    tags: ["Greedy", "Array", "Heap", "String"],
    statement: "Given a character array tasks representing CPU tasks and a non-negative integer n (cooldown between same-task executions), return the minimum number of intervals the CPU needs to finish all tasks.",
    examples: [
      { input: "tasks = ['A','A','A','B','B','B'], n = 2", output: "8", explanation: "A -> B -> idle -> A -> B -> idle -> A -> B." },
      { input: "tasks = ['A','A','A','B','B','B'], n = 0", output: "6" },
    ],
    intuition: "The task that appears most often dictates the frame structure. Place the most frequent task at the start of each (n+1)-length slot. The minimum total time is either determined by this structure or simply the total number of tasks — whichever is larger.",
    approach: [
      "Count frequency of each task.",
      "Find maxFreq (highest frequency) and countMax (number of tasks with that frequency).",
      "Formula: max(tasks.length, (maxFreq - 1) * (n + 1) + countMax).",
      "Return the result.",
    ],
    solution: `function leastInterval(tasks, n) {
  const freq = new Array(26).fill(0);
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;
  freq.sort((a, b) => b - a);
  const maxFreq = freq[0];
  let maxCount = 0;
  for (const f of freq) { if (f === maxFreq) maxCount++; else break; }
  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "CPU task scheduling with cooldowns models distributed rate-limiting and retry-with-backoff in microservices — the most frequent operation type sets the minimum throughput bottleneck, and cooldown periods map to circuit-breaker reset intervals in resilience patterns.",
    pitfalls: ["If tasks are diverse enough (many different types), there are no idles and the answer is just tasks.length.", "Count how many tasks tie for max frequency — they all go in the last partial slot."],
  },
  {
    id: "greedy-23",
    title: "Reorganize String",
    difficulty: "Medium",
    tags: ["Greedy", "String", "Heap"],
    statement: "Given a string s, rearrange the characters so no two adjacent characters are the same. If impossible, return an empty string.",
    examples: [
      { input: "s = \"aab\"", output: "\"aba\"" },
      { input: "s = \"aaab\"", output: "\"\"" },
    ],
    intuition: "Always place the most frequent remaining character next (as long as it is different from the last placed). If the most frequent exceeds ceiling(n/2), it is impossible — any valid arrangement must interleave it with others.",
    approach: [
      "Count character frequencies.",
      "If any character appears more than ceil(n/2) times, return ''.",
      "Use a max-heap. At each step, pick the most frequent character that differs from the last placed.",
      "Alternatively, sort by frequency and fill even indices first, then odd indices.",
    ],
    solution: `function reorganizeString(s) {
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;
  const n = s.length;
  let maxFreq = 0, maxChar = 0;
  for (let i = 0; i < 26; i++) {
    if (freq[i] > maxFreq) { maxFreq = freq[i]; maxChar = i; }
  }
  if (maxFreq > Math.ceil(n / 2)) return "";
  const res = new Array(n);
  let idx = 0;
  // Place most frequent at even indices first
  while (freq[maxChar] > 0) { res[idx] = String.fromCharCode(maxChar + 97); idx += 2; freq[maxChar]--; }
  for (let i = 0; i < 26; i++) {
    while (freq[i] > 0) {
      if (idx >= n) idx = 1;
      res[idx] = String.fromCharCode(i + 97);
      idx += 2;
      freq[i]--;
    }
  }
  return res.join("");
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Interleaving high-frequency items to prevent adjacency mirrors anti-affinity rules in Kubernetes pod scheduling — ensure replicas of the same service are not co-located on the same node, distributing load across the cluster in a round-robin (interleaved) fashion.",
    pitfalls: ["Check feasibility first: max frequency > ceil(n/2) makes it impossible.", "Fill even indices before odd so the most frequent character is spread as widely as possible."],
  },
  {
    id: "greedy-24",
    title: "Partition Labels",
    difficulty: "Medium",
    tags: ["Greedy", "String", "Two Pointers"],
    statement: "You are given a string s. Partition it into as many parts as possible so that each letter appears in at most one part. Return the lengths of each part.",
    examples: [
      { input: "s = \"ababcbacadefegdehijhklij\"", output: "[9,7,8]" },
      { input: "s = \"eccbbbbdec\"", output: "[10]" },
    ],
    intuition: "For each character, find the last position it appears. Walk the string and extend the current partition's end to the last occurrence of every character seen. When you reach the end of the current partition, cut there — it is safe because no character in the partition appears beyond that end.",
    approach: [
      "Build a map of last occurrence for each character.",
      "Walk with start=0 and end=0.",
      "For each character, extend end = max(end, lastOccurrence[c]).",
      "When i == end, the partition is complete: record (end-start+1), set start = end+1.",
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
    systemDesign: "Greedy partitioning by range extent mirrors shard key range design in distributed databases — extend a shard's range until it encompasses all related keys, minimising cross-shard joins. Kafka partition assignment uses similar extent-based grouping to co-locate related events in the same partition.",
    pitfalls: ["Update end greedily to cover the full extent of all seen characters before cutting.", "The result stores partition lengths, not split indices."],
  },
  {
    id: "greedy-25",
    title: "Gas Station",
    difficulty: "Medium",
    tags: ["Greedy", "Array"],
    statement: "There are n gas stations in a circular route. gas[i] is the gas at station i, cost[i] is the cost to travel from i to i+1. Starting with an empty tank, find the starting station index to complete the circuit once. If impossible return -1.",
    examples: [
      { input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", output: "3" },
      { input: "gas = [2,3,4], cost = [3,4,3]", output: "-1" },
    ],
    intuition: "If total gas < total cost, no solution exists. Otherwise a solution always exists, and it starts right after the point where the running surplus hits its lowest point — the greedy argument is that we need to carry enough net gas from the start to cover the worst deficit encountered.",
    approach: [
      "Compute total = sum(gas[i] - cost[i]). If total < 0 return -1.",
      "Walk the route with running tank. When tank < 0, reset tank to 0 and set start = i+1.",
      "Return start.",
    ],
    solution: `function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    total += diff;
    tank += diff;
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total >= 0 ? start : -1;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "The gas station greedy models message-queue consumer lag recovery — if cumulative throughput exceeds production rate, find the consumer start offset where accumulated lag first goes negative and restart consumption from the next offset, a strategy used in Kafka lag recovery playbooks.",
    pitfalls: ["A solution exists if and only if total >= 0; the greedy finds it in one pass.", "After resetting start, the accumulated tank starts fresh — previous negative surplus does not carry over."],
  },
  {
    id: "greedy-26",
    title: "Jump Game II",
    difficulty: "Medium",
    tags: ["Greedy", "Array"],
    statement: "Given an array nums where nums[i] is the maximum jump length at index i, return the minimum number of jumps to reach the last index. You can always reach the last index.",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "2" },
      { input: "nums = [2,3,0,1,4]", output: "2" },
    ],
    intuition: "Think in BFS levels: from the current 'level' (range of reachable indices), find the furthest index reachable. When you exhaust the current level, you must jump — that costs one jump and the farthest reach becomes the new level. Always picking the maximum reach is greedy-optimal.",
    approach: [
      "Track curEnd (current level end), farthest (max reach), jumps.",
      "Iterate from 0 to n-2.",
      "Update farthest = max(farthest, i + nums[i]).",
      "When i == curEnd, increment jumps and set curEnd = farthest.",
      "Return jumps.",
    ],
    solution: `function jump(nums) {
  let jumps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === curEnd) { jumps++; curEnd = farthest; }
  }
  return jumps;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Minimum-hop routing maps directly to Dijkstra's hop-count shortest path in packet-switched networks — each BFS level corresponds to one TTL (time-to-live) hop, and the greedy max-reach ensures we exhaust all same-cost paths before incrementing the hop count.",
    pitfalls: ["Loop only to n-2 — no jump is needed from the last index.", "The greedy always takes the maximum reachable position within the current level, guaranteeing minimum jumps."],
  },
  {
    id: "greedy-27",
    title: "Hand of Straights",
    difficulty: "Medium",
    tags: ["Greedy", "Hash Map", "Sorting"],
    statement: "Given an array hand of cards and an integer groupSize, return true if you can rearrange the cards into groups of groupSize consecutive cards.",
    examples: [
      { input: "hand = [1,2,3,6,2,3,4,7,8], groupSize = 3", output: "true" },
      { input: "hand = [1,2,3,4,5], groupSize = 4", output: "false" },
    ],
    intuition: "Sort the unique card values. Always try to start a new group with the smallest unassigned card — if the smallest card cannot start a valid group (some consecutive card is missing), it is impossible. Greedily consuming from the smallest value is safe.",
    approach: [
      "If hand.length % groupSize != 0, return false.",
      "Count frequency of each card.",
      "Sort unique card values.",
      "For each card in sorted order: if frequency > 0, try to consume groupSize consecutive cards starting here. If any is missing, return false.",
      "Return true.",
    ],
    solution: `function isNStraightHand(hand, groupSize) {
  if (hand.length % groupSize !== 0) return false;
  const count = new Map();
  for (const c of hand) count.set(c, (count.get(c) || 0) + 1);
  const keys = [...count.keys()].sort((a, b) => a - b);
  for (const key of keys) {
    const freq = count.get(key);
    if (freq > 0) {
      for (let i = 0; i < groupSize; i++) {
        const cur = count.get(key + i) || 0;
        if (cur < freq) return false;
        count.set(key + i, cur - freq);
      }
    }
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Consecutive-group validation mirrors stripe consistency checks in RAID controllers — verify that consecutive disk blocks form complete stripes. Database transaction log compaction also validates that log sequence numbers form consecutive groups before flushing committed segments.",
    pitfalls: ["Process cards in sorted order so the smallest available always starts a new group.", "Decrement frequency by the count of the starting card, not just 1, to handle duplicate groups."],
  },
  {
    id: "greedy-28",
    title: "Remove K Digits",
    difficulty: "Medium",
    tags: ["Greedy", "Stack", "String", "Monotonic Stack"],
    statement: "Given a string num representing a non-negative integer and an integer k, remove k digits from the number to make it as small as possible. Return the result as a string without leading zeros.",
    examples: [
      { input: "num = \"1432219\", k = 3", output: "\"1219\"" },
      { input: "num = \"10200\", k = 1", output: "\"200\"" },
      { input: "num = \"10\", k = 2", output: "\"0\"" },
    ],
    intuition: "Use a monotonic increasing stack. Whenever a new digit is smaller than the stack top and we still have removals left, pop the stack (remove the larger digit). This greedily keeps the smallest possible prefix.",
    approach: [
      "Use a stack (result array).",
      "For each digit d: while k > 0 and stack is non-empty and stack top > d, pop and decrement k.",
      "Push d.",
      "If k > 0 after the loop, remove the last k digits.",
      "Strip leading zeros; return '0' if empty.",
    ],
    solution: `function removeKdigits(num, k) {
  const stack = [];
  for (const d of num) {
    while (k > 0 && stack.length && stack[stack.length - 1] > d) {
      stack.pop();
      k--;
    }
    stack.push(d);
  }
  while (k > 0) { stack.pop(); k--; }
  const result = stack.join("").replace(/^0+/, "");
  return result || "0";
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Monotonic stack digit removal mirrors query plan pruning in database optimisers — remove costlier sub-plans (larger digits) whenever a cheaper option (smaller digit) is discovered, keeping only the minimal-cost plan candidates in the stack for subsequent evaluation.",
    pitfalls: ["After the loop, if k > 0 remove from the end (the tail is non-decreasing so the last digits are largest).", "Strip leading zeros before returning."],
  },
  {
    id: "greedy-29",
    title: "Monotone Increasing Digits",
    difficulty: "Medium",
    tags: ["Greedy", "String", "Math"],
    statement: "Given an integer n, return the largest integer <= n whose digits are in non-decreasing order (monotone increasing).",
    examples: [
      { input: "n = 10", output: "9" },
      { input: "n = 1234", output: "1234" },
      { input: "n = 332", output: "299" },
    ],
    intuition: "Walk from right to left. When a digit is smaller than the next (violation), decrement that digit and set all digits to the right to '9'. This greedily keeps the number as large as possible while fixing the violation.",
    approach: [
      "Convert n to a character array.",
      "Walk from right to left; when digits[i-1] > digits[i], decrement digits[i-1] and mark position i as the '9-fill' start.",
      "Fill all positions from the mark to the end with '9'.",
      "Return the result as an integer.",
    ],
    solution: `function monotoneIncreasingDigits(n) {
  const digits = n.toString().split("");
  let mark = digits.length;
  for (let i = digits.length - 1; i > 0; i--) {
    if (digits[i - 1] > digits[i]) {
      mark = i;
      digits[i - 1] = String(Number(digits[i - 1]) - 1);
    }
  }
  for (let i = mark; i < digits.length; i++) digits[i] = "9";
  return parseInt(digits.join(""));
}`,
    language: "javascript",
    complexity: { time: "O(d)", space: "O(d)" },
    systemDesign: "Greedy rightward-fill with 9s mirrors version-number rollback in semantic versioning systems — when a higher-order version component is decremented, all lower-order components reset to maximum (9 or 99), keeping the version as recent as possible below the constraint.",
    pitfalls: ["Walk right to left to handle cascading decrements (e.g. 100 -> 099 -> problem with carry).", "The mark tracks where the '9-fill' starts — process from mark to the end."],
  },
  {
    id: "greedy-30",
    title: "Minimum Deletions to Make Character Frequencies Unique",
    difficulty: "Medium",
    tags: ["Greedy", "String", "Hash Map"],
    statement: "A string s is 'good' if no two different characters have the same frequency. Return the minimum number of character deletions to make s good.",
    examples: [
      { input: "s = \"aab\"", output: "0", explanation: "a appears twice, b appears once — all unique." },
      { input: "s = \"aaabbbcc\"", output: "2" },
      { input: "s = \"ceabaacb\"", output: "2" },
    ],
    intuition: "Collect all character frequencies. Sort them descending. For each frequency, if it has already been used, keep decrementing until we find an unused one (or reach 0). Each decrement is one deletion. This is greedy because we want to keep frequencies as large as possible.",
    approach: [
      "Build frequency map and collect all frequencies.",
      "Sort frequencies descending.",
      "Use a Set of used frequencies.",
      "For each frequency, decrement while it is in the used set and > 0; count each decrement as a deletion.",
      "Add to used set and return total deletions.",
    ],
    solution: `function minDeletions(s) {
  const freq = new Map();
  for (const c of s) freq.set(c, (freq.get(c) || 0) + 1);
  const freqs = [...freq.values()].sort((a, b) => b - a);
  const used = new Set();
  let deletions = 0;
  for (let f of freqs) {
    while (f > 0 && used.has(f)) { f--; deletions++; }
    if (f > 0) used.add(f);
  }
  return deletions;
}`,
    language: "javascript",
    complexity: { time: "O(n + k log k)", space: "O(k)" },
    systemDesign: "Unique frequency enforcement mirrors histogram bucketing in database statistics — ensuring distinct count buckets makes cardinality estimates unambiguous for the query optimiser. Column statistics in PostgreSQL use similar distinctness constraints to build accurate row-count estimates.",
    pitfalls: ["Decrement the current frequency until it is unique (not in used set) before recording it.", "If the frequency reaches 0, add 0 deletions and do not add 0 to the used set."],
  },
  {
    id: "greedy-31",
    title: "Eliminate Maximum Number of Monsters",
    difficulty: "Medium",
    tags: ["Greedy", "Array", "Sorting"],
    statement: "Monsters approach a city. dist[i] is the initial distance and speed[i] is the speed of monster i. You can eliminate one monster per minute at minute 0, 1, 2, .... Monsters arriving at distance 0 at or before your elimination turn end the game. Return the maximum number of monsters you can eliminate.",
    examples: [
      { input: "dist = [1,3,4], speed = [1,1,1]", output: "3" },
      { input: "dist = [1,1,2,3], speed = [1,2,1,1]", output: "1" },
    ],
    intuition: "Calculate arrival time for each monster (ceil(dist/speed)). Sort by arrival time. Greedily eliminate the monster that arrives earliest each minute — if its arrival time is <= current minute, it reaches the city before you can shoot it.",
    approach: [
      "Compute arrival times: Math.ceil(dist[i] / speed[i]).",
      "Sort arrival times.",
      "For each minute (index) i, if arrivals[i] <= i, the monster reaches the city — return i.",
      "Return total number of monsters.",
    ],
    solution: `function eliminateMaximum(dist, speed) {
  const arrivals = dist.map((d, i) => Math.ceil(d / speed[i]));
  arrivals.sort((a, b) => a - b);
  for (let i = 0; i < arrivals.length; i++) {
    if (arrivals[i] <= i) return i;
  }
  return arrivals.length;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Greedy earliest-deadline elimination mirrors rate-limited request processing in API gateways — process the request with the earliest expiry (SLA deadline) first, and when a request expires before processing, the SLA is breached; tracking this is essential for SLA compliance reporting.",
    pitfalls: ["Use ceil for arrival time — a monster at distance 1 with speed 1 arrives at minute 1, not minute 0.", "Sort arrival times and check at each index whether the greedy schedule holds."],
  },
  {
    id: "greedy-32",
    title: "Maximum Number of Events That Can Be Attended",
    difficulty: "Medium",
    tags: ["Greedy", "Array", "Heap", "Sorting"],
    statement: "Given an array events where events[i] = [startDay, endDay], you can attend one event per day. Return the maximum number of events you can attend.",
    examples: [
      { input: "events = [[1,2],[2,3],[3,4]]", output: "3" },
      { input: "events = [[1,4],[4,4],[2,2],[3,4],[1,1]]", output: "4" },
    ],
    intuition: "On each day, attend the event that ends soonest among all currently available events. This is greedy because attending the event with the latest deadline can always be deferred, while the event ending today is now-or-never.",
    approach: [
      "Sort events by start day.",
      "Use a min-heap keyed on end day.",
      "For each day from 1 to max end day: add all events starting today to the heap; remove events that have already ended (end < today); if heap is non-empty, pop and attend the earliest-ending event.",
      "Return count.",
    ],
    solution: `function maxEvents(events) {
  events.sort((a, b) => a[0] - b[0]);
  // Min-heap simulation using sorted array (acceptable for interview)
  const minHeap = [];
  const heapPush = (val) => { minHeap.push(val); minHeap.sort((a, b) => a - b); };
  const heapPop = () => minHeap.shift();
  let i = 0, day = 0, count = 0;
  const maxDay = Math.max(...events.map(e => e[1]));
  for (day = 1; day <= maxDay; day++) {
    while (i < events.length && events[i][0] === day) heapPush(events[i++][1]);
    while (minHeap.length && minHeap[0] < day) heapPop();
    if (minHeap.length) { heapPop(); count++; }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Earliest-deadline-first event scheduling is the optimal strategy for CPU scheduling under deadline constraints — used in real-time operating systems (RTOS) where missing a deadline is catastrophic. Cloud batch job schedulers use EDF to maximise the number of jobs completed within SLA windows.",
    pitfalls: ["Remove expired events from the heap before attending — you cannot attend an event after its end day.", "Use a proper min-heap for efficiency; the sort simulation is illustrative only."],
  },
  {
    id: "greedy-33",
    title: "Video Stitching",
    difficulty: "Medium",
    tags: ["Greedy", "Array", "Dynamic Programming"],
    statement: "You are given a series of video clips from 0 to time. clips[i] = [starti, endi]. Return the minimum number of clips needed to cover the whole range [0, time], or -1 if impossible.",
    examples: [
      { input: "clips = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]], time = 10", output: "3" },
      { input: "clips = [[0,1],[1,2]], time = 5", output: "-1" },
    ],
    intuition: "Sort by start time. Greedily extend coverage by always picking the clip that starts at or before the current coverage end and extends it the furthest. This is the interval covering greedy.",
    approach: [
      "Sort clips by start time.",
      "Track current coverage end and the furthest reachable end.",
      "Advance through clips: if clip starts <= current end, update farthest. When you must extend, increment count and set current end = farthest.",
      "If current end >= time, return count. If no progress, return -1.",
    ],
    solution: `function videoStitching(clips, time) {
  clips.sort((a, b) => a[0] - b[0]);
  let count = 0, curEnd = 0, farthest = 0, i = 0;
  while (curEnd < time) {
    while (i < clips.length && clips[i][0] <= curEnd) {
      farthest = Math.max(farthest, clips[i][1]);
      i++;
    }
    if (farthest <= curEnd) return -1; // no progress
    count++;
    curEnd = farthest;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Minimum interval covering is the core algorithm in CDN content pre-fetching — cover a time window with the fewest HTTP range requests to minimise round trips. It also models minimum-segment merge in data pipeline orchestration where each ETL job covers a time range and you want minimal coverage overlap.",
    pitfalls: ["Return -1 if no clip extends coverage beyond the current end — gap detected.", "The inner while loop processes all clips starting within current coverage before committing to an extension."],
  },
  {
    id: "greedy-34",
    title: "Advantage Shuffle",
    difficulty: "Medium",
    tags: ["Greedy", "Array", "Sorting"],
    statement: "Given two integer arrays nums1 and nums2, rearrange nums1 to maximise the number of indices where nums1[i] > nums2[i]. Return any valid rearrangement.",
    examples: [
      { input: "nums1 = [2,7,11,15], nums2 = [1,10,4,11]", output: "[2,11,7,15]" },
      { input: "nums1 = [12,24,8,32], nums2 = [13,25,32,11]", output: "[24,32,8,12]" },
    ],
    intuition: "For each element in nums2 (from hardest to easiest to beat), assign the smallest nums1 element that beats it. If no element can beat it, waste the smallest remaining nums1 element. This is the greedy 'racetrack' strategy.",
    approach: [
      "Sort nums1. Pair nums2 with original indices and sort by value descending.",
      "Use two pointers lo and hi on sorted nums1.",
      "For each nums2 element (largest first): if nums1[hi] can beat it, assign nums1[hi] and decrement hi; else assign nums1[lo] and increment lo.",
      "Return result.",
    ],
    solution: `function advantageCount(nums1, nums2) {
  nums1.sort((a, b) => a - b);
  const indexed = nums2.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]);
  const res = new Array(nums1.length);
  let lo = 0, hi = nums1.length - 1;
  for (const [val, idx] of indexed) {
    if (nums1[hi] > val) { res[idx] = nums1[hi--]; }
    else { res[idx] = nums1[lo++]; }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Greedy advantage matching mirrors matchmaking in competitive resource bidding — assign the just-sufficient resource to each competing request to maximise wins while preserving stronger resources for tougher opponents. Ad auction systems use similar surplus-based allocation to maximise impressions won across campaigns.",
    pitfalls: ["Process nums2 from largest to smallest so you always try your best resource first.", "When you cannot beat a nums2 element, sacrifice the weakest nums1 element."],
  },
  {
    id: "greedy-35",
    title: "Restore the Array From Adjacent Pairs",
    difficulty: "Medium",
    tags: ["Greedy", "Hash Map", "Graph"],
    statement: "An array of distinct integers was transformed into adjacentPairs where adjacentPairs[i] = [ui, vi] means ui and vi were adjacent in the original array. Restore the original array (any valid answer is accepted).",
    examples: [
      { input: "adjacentPairs = [[2,1],[3,4],[3,2]]", output: "[1,2,3,4]" },
      { input: "adjacentPairs = [[4,-2],[1,4],[-3,1]]", output: "[-2,4,1,-3]" },
    ],
    intuition: "Build an adjacency map. The two endpoints of the original array each appear in exactly one pair — find one, then greedily follow the chain (each interior node has exactly two neighbours, so the next node is the one we did not come from).",
    approach: [
      "Build adjacency list.",
      "Find a node with only one neighbour (an endpoint).",
      "Walk the chain, always moving to the unvisited neighbour.",
      "Return the reconstructed array.",
    ],
    solution: `function restoreArray(adjacentPairs) {
  const adj = new Map();
  for (const [u, v] of adjacentPairs) {
    if (!adj.has(u)) adj.set(u, []);
    if (!adj.has(v)) adj.set(v, []);
    adj.get(u).push(v);
    adj.get(v).push(u);
  }
  let start = 0;
  for (const [node, neighbors] of adj) {
    if (neighbors.length === 1) { start = node; break; }
  }
  const res = [start];
  let prev = null, cur = start;
  while (res.length < adj.size) {
    const neighbors = adj.get(cur);
    const next = neighbors[0] === prev ? neighbors[1] : neighbors[0];
    res.push(next);
    prev = cur;
    cur = next;
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Chain reconstruction from pair hints models transaction log replay in databases — given only before/after pairs for each row update, reconstruct the full update sequence. Similar chain-following logic is used in doubly-linked list recovery from corrupted memory where only link pairs are preserved.",
    pitfalls: ["An endpoint has exactly one neighbour; all interior nodes have exactly two.", "Track the previous node to avoid going backwards in the chain."],
  },
  // ---- HARD (15 problems) ----
  {
    id: "greedy-36",
    title: "Candy",
    difficulty: "Hard",
    tags: ["Greedy", "Array"],
    statement: "There are n children in a line each with a rating. Give each child at least one candy; children with a higher rating than an adjacent neighbour must receive more candies than that neighbour. Return the minimum total candies needed.",
    examples: [
      { input: "ratings = [1,0,2]", output: "5" },
      { input: "ratings = [1,2,2]", output: "4" },
    ],
    intuition: "Two independent passes suffice: left-to-right ensures each child beats their left neighbour if rated higher; right-to-left ensures they beat their right neighbour. Taking the max of both satisfies both constraints simultaneously.",
    approach: [
      "Initialize all candies to 1.",
      "Left-to-right: if ratings[i] > ratings[i-1], set candies[i] = candies[i-1]+1.",
      "Right-to-left: if ratings[i] > ratings[i+1], set candies[i] = max(candies[i], candies[i+1]+1).",
      "Return sum.",
    ],
    solution: `function candy(ratings) {
  const n = ratings.length;
  const candies = new Array(n).fill(1);
  for (let i = 1; i < n; i++)
    if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
  for (let i = n - 2; i >= 0; i--)
    if (ratings[i] > ratings[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1);
  return candies.reduce((a, b) => a + b, 0);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Two-pass constraint propagation mirrors dependency resolution in package managers — forward pass satisfies left dependencies, backward pass satisfies right dependencies, and taking the max ensures all constraints are met, analogous to topological sort with bidirectional constraints.",
    pitfalls: ["One pass alone is insufficient — valley children need the higher of both neighbour constraints.", "Equal ratings do not trigger the inequality, so equal-rated neighbours can receive the same candy count."],
  },
  {
    id: "greedy-37",
    title: "Maximum Swap",
    difficulty: "Hard",
    tags: ["Greedy", "Math", "String"],
    statement: "Given a non-negative integer num, you can swap two digits at most once to get the maximum valued number. Return the maximum value.",
    examples: [
      { input: "num = 2736", output: "7236" },
      { input: "num = 9973", output: "9973" },
    ],
    intuition: "For each digit position from left to right, check if a larger digit appears later in the number. If so, swap the current digit with the rightmost occurrence of the largest such digit — this maximises the most significant available improvement.",
    approach: [
      "Convert to digit array.",
      "Record the last index of each digit 0-9.",
      "For each position i, scan digits 9 down to digits[i]+1: if a larger digit exists at a later index, swap and return.",
      "If no swap helps, return original number.",
    ],
    solution: `function maximumSwap(num) {
  const digits = num.toString().split("").map(Number);
  const last = new Array(10).fill(-1);
  for (let i = 0; i < digits.length; i++) last[digits[i]] = i;
  for (let i = 0; i < digits.length; i++) {
    for (let d = 9; d > digits[i]; d--) {
      if (last[d] > i) {
        [digits[i], digits[last[d]]] = [digits[last[d]], digits[i]];
        return parseInt(digits.join(""));
      }
    }
  }
  return num;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Single-swap maximisation models one-shot configuration tuning in A/B testing infrastructure — perform one parameter swap (e.g. cache size for a service) to maximise a metric, picking the change with the highest marginal impact, a greedy approach used in automated performance tuning systems.",
    pitfalls: ["Swap with the rightmost occurrence of the largest digit so we maximise the benefit.", "If the number is already the maximum, return it unchanged."],
  },
  {
    id: "greedy-38",
    title: "Smallest Range II",
    difficulty: "Hard",
    tags: ["Greedy", "Array", "Math", "Sorting"],
    statement: "Given an integer array nums and an integer k, for each element you must add either +k or -k. Return the minimum possible difference between the maximum and minimum of the resulting array.",
    examples: [
      { input: "nums = [1], k = 0", output: "0" },
      { input: "nums = [0,10], k = 2", output: "6" },
      { input: "nums = [1,3,6], k = 3", output: "3" },
    ],
    intuition: "Sort nums. There is always an optimal split: elements up to some index i get +k and the rest get -k (or vice versa). Try every split and take the minimum resulting range — this greedy enumeration covers all optimal configurations.",
    approach: [
      "Sort nums.",
      "The baseline answer is nums[n-1] - nums[0] (all same direction).",
      "For each split index i from 0 to n-2: the max is max(nums[i]+k, nums[n-1]-k) and the min is min(nums[0]+k, nums[i+1]-k). Track minimum range.",
      "Return minimum.",
    ],
    solution: `function smallestRangeII(nums, k) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let res = nums[n - 1] - nums[0];
  for (let i = 0; i < n - 1; i++) {
    const high = Math.max(nums[i] + k, nums[n - 1] - k);
    const low = Math.min(nums[0] + k, nums[i + 1] - k);
    res = Math.min(res, high - low);
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Bi-directional adjustment to minimise range models load balancing in distributed systems — add or subtract capacity to servers to minimise the gap between the most and least loaded nodes, a heuristic used in Kubernetes cluster autoscaler to balance pod distribution across nodes.",
    pitfalls: ["After sorting, the optimal split is always a contiguous prefix getting +k and the rest getting -k.", "The baseline (all +k or all -k) is nums[n-1]-nums[0]; only splits can reduce this."],
  },
  {
    id: "greedy-39",
    title: "IPO",
    difficulty: "Hard",
    tags: ["Greedy", "Heap", "Array", "Sorting"],
    statement: "You can complete at most k projects. Each project has a profit and capital requirement. Given initial capital w, return the maximised capital after completing at most k projects.",
    examples: [
      { input: "k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]", output: "4" },
      { input: "k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]", output: "6" },
    ],
    intuition: "Among all affordable projects, always pick the one with the highest profit — this maximises capital for unlocking future projects. Use a max-heap of profits and add newly affordable projects each round.",
    approach: [
      "Sort projects by required capital.",
      "Use a max-heap of profits.",
      "Repeat k times: add all projects with capital <= w to the heap; if heap is empty, break; pop max profit and add to w.",
      "Return w.",
    ],
    solution: `function findMaximizedCapital(k, w, profits, capital) {
  const projects = profits.map((p, i) => [capital[i], p]).sort((a, b) => a[0] - b[0]);
  // Max-heap simulation
  const maxHeap = [];
  const heapPush = (val) => { maxHeap.push(val); maxHeap.sort((a, b) => b - a); };
  const heapPop = () => maxHeap.shift();
  let i = 0;
  for (let round = 0; round < k; round++) {
    while (i < projects.length && projects[i][0] <= w) heapPush(projects[i++][1]);
    if (maxHeap.length === 0) break;
    w += heapPop();
  }
  return w;
}`,
    language: "javascript",
    complexity: { time: "O(n log n + k log n)", space: "O(n)" },
    systemDesign: "Greedy capital maximisation models venture capital portfolio construction — at each funding round, invest in the highest-ROI startup you can currently afford to maximise total portfolio value, a strategy formalised in portfolio optimisation theory used by quantitative hedge funds.",
    pitfalls: ["Use a max-heap on profits so the highest-profit affordable project is always selected first.", "Add newly affordable projects each round as w grows — do not pre-filter by capital once."],
  },
  {
    id: "greedy-40",
    title: "Maximum Performance of a Team",
    difficulty: "Hard",
    tags: ["Greedy", "Heap", "Array", "Sorting"],
    statement: "There are n engineers each with speed[i] and efficiency[i]. A team's performance is (sum of speeds) * (min efficiency of team). Choose at most k engineers to maximise performance. Return it modulo 10^9 + 7.",
    examples: [
      { input: "n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 2", output: "60" },
      { input: "n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 3", output: "68" },
    ],
    intuition: "The minimum efficiency of the team is determined by the least efficient member we pick. Sort by efficiency descending — for each engineer as the minimum efficiency, greedily add the k fastest engineers seen so far (maintained via a min-heap). This ensures maximum speed sum for each efficiency bound.",
    approach: [
      "Sort engineers by efficiency descending.",
      "Use a min-heap of size at most k on speeds.",
      "For each engineer as the 'minimum efficiency' anchor: add their speed to the heap and speedSum. If heap size > k, remove the smallest speed.",
      "Update max performance = speedSum * current efficiency.",
      "Return max % (10^9+7).",
    ],
    solution: `function maxPerformance(n, speed, efficiency, k) {
  const MOD = 1e9 + 7;
  const engineers = speed.map((s, i) => [efficiency[i], s]).sort((a, b) => b[0] - a[0]);
  const minHeap = [];
  const heapPush = (val) => { minHeap.push(val); minHeap.sort((a, b) => a - b); };
  let speedSum = 0, best = 0;
  for (const [eff, spd] of engineers) {
    heapPush(spd);
    speedSum += spd;
    if (minHeap.length > k) speedSum -= minHeap.shift();
    best = Math.max(best, speedSum * eff);
  }
  return best % MOD;
}`,
    language: "javascript",
    complexity: { time: "O(n log n + n log k)", space: "O(n)" },
    systemDesign: "Maximising (sum * min) under cardinality constraint models query execution parallelism — maximise total throughput (sum of worker speeds) times the bottleneck throughput (minimum efficiency), a metric used in data pipeline auto-scaling to right-size the number of parallel executors.",
    pitfalls: ["Sort by efficiency descending so each engineer is considered as the team's minimum efficiency.", "When heap size exceeds k, remove the slowest engineer — they reduce speed sum without improving min efficiency."],
  },
  {
    id: "greedy-41",
    title: "Minimum Cost to Hire K Workers",
    difficulty: "Hard",
    tags: ["Greedy", "Heap", "Array", "Sorting", "Math"],
    statement: "There are n workers each with a quality[i] and wage[i]. To hire k workers you must pay each at least their minimum wage and all in the proportion of their quality. Return the minimum total wages to hire exactly k workers.",
    examples: [
      { input: "quality = [10,20,5], wage = [70,50,30], k = 2", output: "105.0" },
      { input: "quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3", output: "30.666666666666668" },
    ],
    intuition: "Each worker has a wage-to-quality ratio. If we pick a captain (the highest ratio in the group), all others must be paid captain_ratio * their_quality. Sort by ratio; for each captain (as the maximum ratio), greedily pick the k workers with the lowest quality among those with lower or equal ratios to minimise total cost.",
    approach: [
      "Compute ratio = wage[i]/quality[i] for each worker; sort by ratio.",
      "Use a max-heap on quality.",
      "For each worker as the captain: add quality to heap and qualitySum. If heap size > k, remove max quality.",
      "When heap size == k, compute cost = ratio * qualitySum and track minimum.",
      "Return minimum cost.",
    ],
    solution: `function mincostToHireWorkers(quality, wage, k) {
  const n = quality.length;
  const workers = quality.map((q, i) => [wage[i] / q, q]).sort((a, b) => a[0] - b[0]);
  const maxHeap = [];
  const heapPush = (val) => { maxHeap.push(val); maxHeap.sort((a, b) => b - a); };
  let qualitySum = 0, best = Infinity;
  for (const [ratio, q] of workers) {
    heapPush(q);
    qualitySum += q;
    if (maxHeap.length > k) qualitySum -= maxHeap.shift();
    if (maxHeap.length === k) best = Math.min(best, ratio * qualitySum);
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n log n + n log k)", space: "O(n)" },
    systemDesign: "Proportional wage under ratio constraints models proportional billing in cloud multi-tenancy — each tenant is billed proportionally to their resource usage, but the minimum guaranteed rate sets the floor, a structure identical to AWS Reserved Instance pricing with proportional allocation.",
    pitfalls: ["The captain's ratio sets the pay scale; always iterate in ascending ratio order.", "Use a max-heap to efficiently remove the highest-quality (most expensive) worker when group exceeds k."],
  },
  {
    id: "greedy-42",
    title: "Course Schedule III",
    difficulty: "Hard",
    tags: ["Greedy", "Heap", "Array", "Sorting"],
    statement: "There are n courses. courses[i] = [duration, lastDay]. You can take at most one course at a time. Return the maximum number of courses you can take.",
    examples: [
      { input: "courses = [[100,200],[200,1300],[1000,1250],[2000,3200]]", output: "3" },
      { input: "courses = [[1,2]]", output: "1" },
      { input: "courses = [[3,2],[4,3]]", output: "0" },
    ],
    intuition: "Sort by deadline. Greedily take each course; if taking it pushes current time past its deadline, swap it with the longest previously taken course (if the current course is shorter) — this frees up time without reducing the count. Exchanging for a shorter course is always safe.",
    approach: [
      "Sort courses by last day ascending.",
      "Use a max-heap of durations taken so far.",
      "For each course: add it and update current time. If current time > last day, remove the longest course from heap (and subtract from time).",
      "Return heap size.",
    ],
    solution: `function scheduleCourse(courses) {
  courses.sort((a, b) => a[1] - b[1]);
  const maxHeap = [];
  const heapPush = (val) => { maxHeap.push(val); maxHeap.sort((a, b) => b - a); };
  let time = 0;
  for (const [dur, last] of courses) {
    heapPush(dur);
    time += dur;
    if (time > last) { time -= maxHeap.shift(); }
  }
  return maxHeap.length;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Greedy swap optimisation for deadline-constrained scheduling mirrors workflow engine task preemption — when a high-priority short task arrives and exceeds the time budget, preempt the longest running low-priority task, a strategy implemented in Kubernetes preemption policies for critical pods.",
    pitfalls: ["Sort by deadline so you process earliest deadlines first — this is the key greedy ordering.", "When adding a course violates the deadline, swap it with the longest-duration course taken so far (even the current one, if it is the longest)."],
  },
  {
    id: "greedy-43",
    title: "Jump Game VII",
    difficulty: "Hard",
    tags: ["Greedy", "String", "Sliding Window", "BFS"],
    statement: "You are given a binary string s and two integers minJump and maxJump. You start at index 0 (which is '0'). You can jump from index i to j if i + minJump <= j <= i + maxJump and s[j] == '0'. Return true if you can reach the last index.",
    examples: [
      { input: "s = \"011010\", minJump = 2, maxJump = 3", output: "true" },
      { input: "s = \"01101110\", minJump = 2, maxJump = 3", output: "false" },
    ],
    intuition: "Use a sliding window of reachable positions. For each index, it is reachable if it is '0' and some position in [i-maxJump, i-minJump] is reachable. Track the count of reachable positions in that window using a running sum to decide in O(1) per index.",
    approach: [
      "Initialize a boolean reachable array; reachable[0] = true.",
      "Walk from 1 to n-1: maintain a running count of reachable positions in the window [i-maxJump, i-minJump].",
      "If s[i] == '0' and count > 0, mark reachable[i] = true.",
      "Adjust window: add reachable[i-minJump] when it enters, subtract reachable[i-maxJump-1] when it leaves.",
      "Return reachable[n-1].",
    ],
    solution: `function canReach(s, minJump, maxJump) {
  const n = s.length;
  if (s[n - 1] === "1") return false;
  const reach = new Array(n).fill(false);
  reach[0] = true;
  let windowCount = 0;
  for (let i = 1; i < n; i++) {
    if (i - minJump >= 0 && reach[i - minJump]) windowCount++;
    if (i - maxJump - 1 >= 0 && reach[i - maxJump - 1]) windowCount--;
    if (s[i] === "0" && windowCount > 0) reach[i] = true;
  }
  return reach[n - 1];
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Sliding-window reachability mirrors TCP sequence-number window validation — a packet at sequence number i is valid only if some previously acknowledged sequence in [i-maxJump, i-minJump] exists, which is exactly how the TCP receive window tracks in-order delivery.",
    pitfalls: ["The sliding window is on the source positions [i-maxJump, i-minJump], not destination.", "Add the entry before checking (at i-minJump) and remove the exit at i-maxJump-1."],
  },
  {
    id: "greedy-44",
    title: "Minimum Number of Refueling Stops",
    difficulty: "Hard",
    tags: ["Greedy", "Heap", "Array", "Dynamic Programming"],
    statement: "A car starts at position 0 with startFuel fuel. Stations[i] = [position, fuel]. You want to reach target. Each stop adds that station's fuel. Return the minimum number of refueling stops, or -1 if impossible.",
    examples: [
      { input: "target = 100, startFuel = 10, stations = [[10,60],[20,30],[30,30],[60,40]]", output: "2" },
      { input: "target = 100, startFuel = 1, stations = [[10,100]]", output: "-1" },
    ],
    intuition: "Drive as far as possible. When you run out of fuel, retroactively pick the largest fuel cache you passed — this greedy works because taking fuel earlier always helps at least as much as taking it later.",
    approach: [
      "Use a max-heap of fuel amounts from passed stations.",
      "Walk through stations: if current fuel < station position, keep popping max fuel from heap (adding stops) until you can reach or fail.",
      "At each reachable station, push its fuel into the heap.",
      "Return stop count or -1.",
    ],
    solution: `function minRefuelStops(target, startFuel, stations) {
  const maxHeap = [];
  const heapPush = (val) => { maxHeap.push(val); maxHeap.sort((a, b) => b - a); };
  stations.push([target, 0]);
  let fuel = startFuel, stops = 0;
  for (const [pos, f] of stations) {
    while (fuel < pos) {
      if (maxHeap.length === 0) return -1;
      fuel += maxHeap.shift();
      stops++;
    }
    heapPush(f);
  }
  return stops;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Retroactive greedy refuelling models lazy resource provisioning in cloud burst scaling — defer adding capacity until absolutely necessary, then provision the largest available burst instance to minimise the number of scaling events, a strategy used in AWS Auto Scaling step policies.",
    pitfalls: ["Add the target as a dummy station so the loop handles the final stretch.", "The greedy works because retroactively taking the largest available fuel never increases stop count compared to any other strategy."],
  },
  {
    id: "greedy-45",
    title: "Huffman Encoding (Minimum Cost of Combining Ropes)",
    difficulty: "Hard",
    tags: ["Greedy", "Heap", "Math"],
    statement: "Given an array of rope lengths, the cost to combine two ropes is their total length. Return the minimum total cost to combine all ropes into one.",
    examples: [
      { input: "ropes = [8,4,6,12]", output: "58" },
      { input: "ropes = [20,4,8,2]", output: "54" },
    ],
    intuition: "Always merge the two shortest ropes first — shorter ropes combined early are 'paid for' fewer times in the total cost. This is the Huffman coding greedy, and it is provably optimal because each merge cost equals the sum of both lengths, so minimising early merges minimises total cost.",
    approach: [
      "Insert all rope lengths into a min-heap.",
      "Repeatedly extract the two smallest, combine them, add cost to total, and insert the combined length back.",
      "Repeat until one rope remains.",
      "Return total cost.",
    ],
    solution: `function minCostCombineRopes(ropes) {
  // Min-heap simulation
  const minHeap = [...ropes].sort((a, b) => a - b);
  const heapPush = (val) => { minHeap.push(val); minHeap.sort((a, b) => a - b); };
  const heapPop = () => minHeap.shift();
  let cost = 0;
  while (minHeap.length > 1) {
    const a = heapPop();
    const b = heapPop();
    cost += a + b;
    heapPush(a + b);
  }
  return cost;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Huffman encoding minimises total code length in data compression (gzip, zlib, Brotli) by assigning shorter codes to more frequent symbols, directly implementing this greedy merge. Database columnar storage uses Huffman coding for run-length-encoded columns to minimise on-disk size.",
    pitfalls: ["Merging any two ropes other than the two smallest always leads to a higher or equal total cost.", "Use a proper min-heap for O(n log n); the sorted-array simulation is illustrative."],
  },
  {
    id: "greedy-46",
    title: "Smallest Range Covering Elements from K Lists",
    difficulty: "Hard",
    tags: ["Greedy", "Heap", "Array", "Sliding Window"],
    statement: "You have k sorted lists of integers. Find the smallest range [a,b] such that there is at least one number from each list within the range.",
    examples: [
      { input: "nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]", output: "[20,24]" },
      { input: "nums = [[1,2,3],[1,2,3],[1,2,3]]", output: "[1,1]" },
    ],
    intuition: "Use a min-heap of the current front elements from each list. The range is [heap_min, current_max]. Greedily advance the list contributing the minimum element — this is the only way to potentially shrink the range without losing coverage of any list.",
    approach: [
      "Initialize the heap with (value, listIndex, elementIndex) for the first element of each list. Track the current maximum.",
      "While the heap contains one element from each list: record the range [min, curMax]; pop the minimum; push the next element from its list and update curMax.",
      "Return the smallest range seen.",
    ],
    solution: `function smallestRange(nums) {
  // Min-heap simulation: [value, listIdx, elemIdx]
  const heap = nums.map((list, i) => [list[0], i, 0]).sort((a, b) => a[0] - b[0]);
  let curMax = Math.max(...heap.map(h => h[0]));
  let rangeStart = heap[0][0], rangeEnd = curMax;
  while (true) {
    heap.sort((a, b) => a[0] - b[0]);
    const [val, li, ei] = heap.shift();
    if (curMax - val < rangeEnd - rangeStart) { rangeStart = val; rangeEnd = curMax; }
    if (ei + 1 >= nums[li].length) break;
    const nextVal = nums[li][ei + 1];
    heap.push([nextVal, li, ei + 1]);
    curMax = Math.max(curMax, nextVal);
  }
  return [rangeStart, rangeEnd];
}`,
    language: "javascript",
    complexity: { time: "O(n log k)", space: "O(k)" },
    systemDesign: "Smallest-range covering k lists models multi-source stream alignment in distributed databases — find the minimum time window containing at least one event from each upstream shard, used in distributed join operators to minimise the buffering window and reduce memory pressure during merge joins.",
    pitfalls: ["Stop as soon as any list is exhausted — you can no longer cover all k lists.", "Track the current maximum explicitly; the heap gives the minimum but not the maximum."],
  },
  {
    id: "greedy-47",
    title: "Minimum Number of Taps to Open to Water a Garden",
    difficulty: "Hard",
    tags: ["Greedy", "Array", "Dynamic Programming"],
    statement: "There is a garden of length n. There are n+1 taps at positions 0 to n. ranges[i] means tap i waters [i-ranges[i], i+ranges[i]]. Return the minimum number of taps to water the entire garden, or -1 if impossible.",
    examples: [
      { input: "n = 5, ranges = [3,4,1,1,0,0]", output: "1" },
      { input: "n = 3, ranges = [0,0,0,0]", output: "-1" },
    ],
    intuition: "Convert each tap to an interval and reduce to the 'minimum number of intervals to cover [0, n]' problem. Sort by left endpoint; greedily pick the interval that extends coverage the furthest at each step — exactly the video stitching greedy.",
    approach: [
      "Convert taps to intervals: [max(0, i-ranges[i]), min(n, i+ranges[i])].",
      "Sort by left endpoint.",
      "Apply the interval-covering greedy: track current coverage end, advance with maximum reach, count jumps.",
      "Return count or -1.",
    ],
    solution: `function minTaps(n, ranges) {
  const intervals = ranges.map((r, i) => [Math.max(0, i - r), Math.min(n, i + r)]);
  intervals.sort((a, b) => a[0] - b[0]);
  let count = 0, curEnd = 0, farthest = 0, i = 0;
  while (curEnd < n) {
    while (i < intervals.length && intervals[i][0] <= curEnd) {
      farthest = Math.max(farthest, intervals[i][1]);
      i++;
    }
    if (farthest <= curEnd) return -1;
    count++;
    curEnd = farthest;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Minimum tap coverage models minimum-replica placement in distributed storage — cover a data range with the fewest replicas (taps) such that every byte is reachable from at least one replica. This is a core problem in erasure-coding shard placement for systems like Ceph and HDFS.",
    pitfalls: ["Clamp interval endpoints to [0, n] — a tap at position 0 with range 5 should start at 0, not -5.", "Returns -1 if there is a gap that no tap can cover."],
  },
  {
    id: "greedy-48",
    title: "Broken Calculator",
    difficulty: "Hard",
    tags: ["Greedy", "Math"],
    statement: "On a broken calculator that starts at startValue, you can multiply by 2 or subtract 1. Return the minimum number of operations to reach target.",
    examples: [
      { input: "startValue = 2, target = 3", output: "2" },
      { input: "startValue = 5, target = 8", output: "2" },
      { input: "startValue = 3, target = 10", output: "3" },
    ],
    intuition: "Work backwards from target to startValue: if target is even divide by 2 (reverse of ×2); if odd add 1 (reverse of -1). This is greedy because each division halves the problem while addition of 1 when odd makes it even for the next step — always the fastest path.",
    approach: [
      "While target > startValue: if target is even, target /= 2; else target += 1; increment count.",
      "Add (startValue - target) for any remaining gap (only subtract 1 operations needed).",
      "Return count.",
    ],
    solution: `function brokenCalc(startValue, target) {
  let count = 0;
  while (target > startValue) {
    if (target % 2 === 1) target++;
    else target /= 2;
    count++;
  }
  return count + (startValue - target);
}`,
    language: "javascript",
    complexity: { time: "O(log target)", space: "O(1)" },
    systemDesign: "Reverse-operation greedy mirrors exponential backoff calculation in distributed systems — working backwards from the retry timeout to the initial delay by halving, the same operation sequence used to derive delay schedules in TCP and HTTP retry policies.",
    pitfalls: ["Work backwards from target, not forwards from startValue — forward exploration has exponential branching.", "If target < startValue after the loop, only subtraction is needed; add the difference directly."],
  },
  {
    id: "greedy-49",
    title: "Patching Array",
    difficulty: "Hard",
    tags: ["Greedy", "Array", "Math"],
    statement: "Given a sorted array nums and an integer n, add the minimum number of patches (positive integers) to make every integer in [1, n] representable as a sum of some subset of nums.",
    examples: [
      { input: "nums = [1,3], n = 6", output: "1", explanation: "Add 2. Now sums cover [1,6]." },
      { input: "nums = [1,5,10], n = 20", output: "2" },
      { input: "nums = [1,2,2], n = 5", output: "0" },
    ],
    intuition: "Track 'reach' — the maximum number we can currently represent + 1. If the next number in nums is <= reach we can extend coverage to reach + nums[i]. Otherwise, patch with reach itself (double coverage) and count one patch. This is greedy because patching with reach is the largest effective patch.",
    approach: [
      "Initialize reach = 1 (can represent [1, reach-1] = empty), patches = 0, i = 0.",
      "While reach <= n: if i < nums.length and nums[i] <= reach, reach += nums[i++]; else patch with reach: reach *= 2 (reach += reach), patches++.",
      "Return patches.",
    ],
    solution: `function minPatches(nums, n) {
  let reach = 1, patches = 0, i = 0;
  while (reach <= n) {
    if (i < nums.length && nums[i] <= reach) {
      reach += nums[i++];
    } else {
      reach += reach;
      patches++;
    }
  }
  return patches;
}`,
    language: "javascript",
    complexity: { time: "O(log n + m)", space: "O(1)" },
    systemDesign: "Greedy range coverage via doubling models exponential capacity planning in distributed systems — when current infrastructure cannot cover the next demand tier, provision enough capacity to double current reach, a strategy used in capacity planning for CDN edge nodes and cloud availability zones.",
    pitfalls: ["reach represents the first number we cannot represent yet — valid range is [1, reach-1].", "Adding reach doubles coverage and is the optimal single patch; adding less leaves a gap."],
  },
  {
    id: "greedy-50",
    title: "Create Maximum Number",
    difficulty: "Hard",
    tags: ["Greedy", "Stack", "Array", "Two Pointers"],
    statement: "Given two arrays nums1 and nums2, create the maximum number of length k using digits from both arrays while maintaining their relative order. Return the result as an array.",
    examples: [
      { input: "nums1 = [3,4,6,5], nums2 = [9,1,2,5,8,3], k = 5", output: "[9,8,6,5,3]" },
      { input: "nums1 = [6,7], nums2 = [6,0,4], k = 5", output: "[6,7,6,0,4]" },
      { input: "nums1 = [3,9], nums2 = [8,9], k = 3", output: "[9,8,9]" },
    ],
    intuition: "For each split i (take i from nums1 and k-i from nums2), find the maximum subsequence of that length from each array using the remove-k-digits monotone stack greedy. Then merge the two subsequences like the merge step in merge-sort, always picking the lexicographically larger front. Try all valid splits and return the best.",
    approach: [
      "For each valid split (i from 0 to k): compute maxSubseq(nums1, i) and maxSubseq(nums2, k-i).",
      "maxSubseq uses a greedy stack: keep a decreasing stack, removing elements when a larger one arrives and removals remain.",
      "Merge two sequences by always choosing the lexicographically larger front element.",
      "Return the best merged result across all splits.",
    ],
    solution: `function maxNumber(nums1, nums2, k) {
  function maxSubseq(nums, len) {
    const drop = nums.length - len;
    const stack = [];
    let d = drop;
    for (const n of nums) {
      while (d > 0 && stack.length && stack[stack.length - 1] < n) { stack.pop(); d--; }
      stack.push(n);
    }
    return stack.slice(0, len);
  }
  function merge(a, b) {
    const res = [];
    let i = 0, j = 0;
    while (i < a.length || j < b.length) {
      // Compare remaining suffixes lexicographically
      let takeA = false;
      if (j >= b.length) takeA = true;
      else if (i >= a.length) takeA = false;
      else {
        let ai = i, bi = j;
        while (ai < a.length && bi < b.length && a[ai] === b[bi]) { ai++; bi++; }
        takeA = bi >= b.length || (ai < a.length && a[ai] >= b[bi]);
      }
      res.push(takeA ? a[i++] : b[j++]);
    }
    return res;
  }
  function compare(a, b) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] > b[i]) return 1;
      if (a[i] < b[i]) return -1;
    }
    return 0;
  }
  let best = [];
  for (let i = Math.max(0, k - nums2.length); i <= Math.min(k, nums1.length); i++) {
    const candidate = merge(maxSubseq(nums1, i), maxSubseq(nums2, k - i));
    if (compare(candidate, best) > 0) best = candidate;
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(k * (m + n + k))", space: "O(m + n + k)" },
    systemDesign: "The create-maximum-number pattern models optimal multi-source log merging in distributed tracing systems — select the maximum-priority k events from two ordered event streams while preserving causal order, a problem solved in distributed tracing backends like Jaeger when merging span sequences from multiple services.",
    pitfalls: ["The merge step must use suffix comparison (not just the first element) to break ties correctly.", "Iterate over all valid splits — the optimal split is not known in advance and must be enumerated."],
  },
];
