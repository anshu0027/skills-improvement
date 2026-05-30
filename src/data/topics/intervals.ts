import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  {
    id: "intervals-01",
    title: "Determine if Two Events Have Conflict",
    difficulty: "Easy",
    tags: ["Intervals", "Array", "String"],
    statement: "Given two events represented as string arrays event1 and event2, where event[0] is the start time and event[1] is the end time in 'HH:MM' format, return true if they conflict (overlap), false otherwise.",
    examples: [
      { input: "event1 = [\"01:15\",\"02:00\"], event2 = [\"02:00\",\"03:00\"]", output: "true", explanation: "They share the moment 02:00." },
      { input: "event1 = [\"01:00\",\"02:00\"], event2 = [\"02:01\",\"03:00\"]", output: "false" },
    ],
    intuition: "Two intervals overlap if and only if neither one ends before the other starts — like checking whether two calendar meetings share any minute.",
    approach: [
      "Two intervals [s1,e1] and [s2,e2] conflict when s1 <= e2 AND s2 <= e1.",
      "Compare the string times directly (lexicographic order works for HH:MM).",
      "Return event1[0] <= event2[1] && event2[0] <= event1[1].",
    ],
    solution: `function haveConflict(event1, event2) {
  return event1[0] <= event2[1] && event2[0] <= event1[1];
}`,
    language: "javascript",
    complexity: { time: "O(1)", space: "O(1)" },
    systemDesign: "This overlap check is the atomic building block of every calendar booking system. Google Calendar and Outlook use exactly this predicate in SQL (WHERE start <= other_end AND other_start <= end) to detect conflicting meetings when inserting a new event into a user's schedule.",
    pitfalls: ["Adjacent intervals (one ends exactly when the other starts) do overlap — use <= not <.", "Lexicographic comparison works here because the HH:MM format is zero-padded."],
  },
  {
    id: "intervals-02",
    title: "Check if All the Integers in a Range Are Covered",
    difficulty: "Easy",
    tags: ["Intervals", "Array", "Prefix Sum"],
    statement: "Given a 2D array ranges where ranges[i] = [starti, endi] and two integers left and right, return true if every integer in [left, right] is covered by at least one range.",
    examples: [
      { input: "ranges = [[1,2],[3,4],[5,6]], left = 2, right = 5", output: "true" },
      { input: "ranges = [[1,10],[10,20]], left = 21, right = 21", output: "false" },
    ],
    intuition: "Use a difference array to mark which integers are covered, then check every position in [left, right] has coverage count > 0 — like stamping coloured paint on a number line and checking no spot is unpainted.",
    approach: [
      "Create a difference array diff of size 52.",
      "For each range [s, e], do diff[s]++ and diff[e+1]--.",
      "Compute prefix sums; for each i in [left, right], if prefix sum is 0 return false.",
      "Return true.",
    ],
    solution: `function isCovered(ranges, left, right) {
  const diff = new Array(52).fill(0);
  for (const [s, e] of ranges) { diff[s]++; diff[e + 1]--; }
  let cur = 0;
  for (let i = 1; i <= 50; i++) {
    cur += diff[i];
    if (i >= left && i <= right && cur <= 0) return false;
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(n + R)", space: "O(R)" },
    systemDesign: "Difference arrays for range coverage checks power capacity-planning dashboards that verify no time slot in a service window is left uncovered by on-call staff. The same technique is used in network bandwidth reservation systems to confirm every time slice has enough allocated capacity.",
    pitfalls: ["The difference array index must reach e+1, so size needs to be at least max_range+2.", "Prefix sum must be > 0 (not >= 0) to confirm coverage."],
  },
  {
    id: "intervals-03",
    title: "Summary Ranges",
    difficulty: "Easy",
    tags: ["Intervals", "Array"],
    statement: "Given a sorted unique integer array nums, return the smallest sorted list of ranges that cover all the numbers exactly. A range [a,b] is represented as 'a->b' if a != b, or 'a' if a == b.",
    examples: [
      { input: "nums = [0,1,2,4,5,7]", output: "[\"0->2\",\"4->5\",\"7\"]" },
      { input: "nums = [0,2,3,4,6,8,9]", output: "[\"0\",\"2->4\",\"6\",\"8->9\"]" },
    ],
    intuition: "Walk through the sorted array and group consecutive numbers together — whenever the next number is not exactly one more, close the current group and start a new one.",
    approach: [
      "Use a pointer i; for each i find j such that nums[j] - nums[i] == j - i (consecutive run).",
      "If i == j, push String(nums[i]); else push nums[i] + '->' + nums[j].",
      "Set i = j + 1 and repeat.",
    ],
    solution: `function summaryRanges(nums) {
  const res = [];
  let i = 0;
  while (i < nums.length) {
    let j = i;
    while (j + 1 < nums.length && nums[j + 1] === nums[j] + 1) j++;
    res.push(i === j ? String(nums[i]) : nums[i] + "->" + nums[j]);
    i = j + 1;
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Summarising a sorted set of IDs into ranges is used in database vacuum/compaction tools that report 'pages 1-100, 200-300 are free' instead of listing every free page, reducing metadata size enormously. IP address block summaries (CIDR aggregation) also use this consecutive-range collapsing to compress routing tables.",
    pitfalls: ["An empty input is valid and returns an empty array.", "Ensure j stops at the last element of the run, not one past it."],
  },
  {
    id: "intervals-04",
    title: "Missing Ranges",
    difficulty: "Easy",
    tags: ["Intervals", "Array"],
    statement: "Given a sorted integer array nums and two integers lower and upper, return the shortest list of ranges that covers every missing number in [lower, upper]. A range [a,b] is 'a->b' if a != b, or 'a' if a == b.",
    examples: [
      { input: "nums = [0,1,3,50,75], lower = 0, upper = 99", output: "[\"2\",\"4->49\",\"51->74\",\"76->99\"]" },
      { input: "nums = [-1], lower = -1, upper = -1", output: "[]" },
    ],
    intuition: "Walk the gaps between consecutive covered numbers (and the boundaries) and emit a range for each gap — like finding the empty slots in a parking garage by noting the gaps between parked cars.",
    approach: [
      "Prepend lower-1 and append upper+1 as sentinel boundaries.",
      "For each consecutive pair (prev, curr) in the extended list, if curr - prev >= 2 there is a gap.",
      "Emit prev+1 if the gap is exactly 1, else prev+1 + '->' + (curr-1).",
    ],
    solution: `function findMissingRanges(nums, lower, upper) {
  const res = [];
  const extended = [lower - 1, ...nums, upper + 1];
  for (let i = 0; i < extended.length - 1; i++) {
    const gap = extended[i + 1] - extended[i];
    if (gap === 2) res.push(String(extended[i] + 1));
    else if (gap > 2) res.push((extended[i] + 1) + "->" + (extended[i + 1] - 1));
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Missing-range detection is used in distributed sequence gap analysis — finding unprocessed message offsets in Kafka partitions or detecting missing auto-increment IDs in a database table, which can indicate dropped inserts or failed transactions that need reprocessing.",
    pitfalls: ["Using lower-1 and upper+1 as sentinels cleanly handles the boundary cases without special-casing.", "Watch for integer overflow near INT_MIN/INT_MAX when computing lower-1 or upper+1 (use long in Java/C++)."],
  },
  {
    id: "intervals-05",
    title: "Maximum Population Year",
    difficulty: "Easy",
    tags: ["Intervals", "Array", "Prefix Sum"],
    statement: "Given a 2D integer array logs where logs[i] = [birthi, deathi] representing a person's birth and death year, return the earliest year with the maximum population. A person is alive during [birth, death-1].",
    examples: [
      { input: "logs = [[1993,1999],[2000,2010]]", output: "1993" },
      { input: "logs = [[1950,1961],[1960,1971],[1970,1981]]", output: "1960" },
    ],
    intuition: "Use a difference array on the year timeline: +1 at birth year, -1 at death year. The prefix sums give population each year — find the peak.",
    approach: [
      "Create diff array of size 101 (years 1950–2050).",
      "For each [birth, death], do diff[birth-1950]++ and diff[death-1950]--.",
      "Compute prefix sums and find the index of the maximum value.",
      "Return that index + 1950.",
    ],
    solution: `function maximumPopulation(logs) {
  const diff = new Array(101).fill(0);
  for (const [b, d] of logs) { diff[b - 1950]++; diff[d - 1950]--; }
  let max = 0, maxYear = 1950, cur = 0;
  for (let i = 0; i < 101; i++) {
    cur += diff[i];
    if (cur > max) { max = cur; maxYear = i + 1950; }
  }
  return maxYear;
}`,
    language: "javascript",
    complexity: { time: "O(n + R)", space: "O(R)" },
    systemDesign: "Difference arrays for temporal population counts power real-time concurrency dashboards (how many users are active at each second), meeting-room occupancy tracking, and server load histograms that show peak concurrent connections, helping capacity planners identify when to scale up infrastructure.",
    pitfalls: ["Death year is exclusive: a person born in 1990 and died in 2000 is NOT alive in 2000.", "Return the earliest year in case of ties — the first-encountered maximum satisfies this when scanning left to right."],
  },
  {
    id: "intervals-06",
    title: "Teemo Attacking",
    difficulty: "Easy",
    tags: ["Intervals", "Array", "Simulation"],
    statement: "In League of Legends, Teemo attacks at times in array timeSeries and each attack poisons the enemy for duration seconds. Return the total seconds the enemy is poisoned (intervals may overlap).",
    examples: [
      { input: "timeSeries = [1,4], duration = 2", output: "4" },
      { input: "timeSeries = [1,2], duration = 2", output: "3" },
    ],
    intuition: "Walk through attacks in order; each attack contributes min(duration, gap to next attack) seconds of new poison — like scheduling back-to-back timers where an early reset truncates the previous one.",
    approach: [
      "For each attack except the last, add min(duration, timeSeries[i+1] - timeSeries[i]) to the total.",
      "Add a full duration for the last attack.",
      "Return total.",
    ],
    solution: `function findPoisonedDuration(timeSeries, duration) {
  let total = 0;
  for (let i = 0; i < timeSeries.length - 1; i++) {
    total += Math.min(duration, timeSeries[i + 1] - timeSeries[i]);
  }
  return total + duration;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Overlapping timer/lease computation appears in distributed lock managers where a lock's TTL can be refreshed before expiry; the effective hold time is computed the same way. Rate-limit windows that reset on activity also follow this pattern to compute actual restricted duration.",
    pitfalls: ["The last attack always gets a full duration because nothing follows it.", "timeSeries is already sorted per the problem constraints."],
  },
  {
    id: "intervals-07",
    title: "Points That Intersect With Cars",
    difficulty: "Easy",
    tags: ["Intervals", "Array", "Prefix Sum"],
    statement: "Given a 2D integer array nums where nums[i] = [starti, endi] represents a car occupying the parking space from starti to endi (inclusive), return the number of integer points that are covered by at least one car.",
    examples: [
      { input: "nums = [[3,6],[1,5],[4,7]]", output: "7" },
      { input: "nums = [[1,3],[5,8]]", output: "7" },
    ],
    intuition: "Use a difference array to mark coverage, then count positions with positive coverage — like painting overlapping segments on a number line and counting painted positions.",
    approach: [
      "Create a difference array of size 102.",
      "For each [s, e], diff[s]++ and diff[e+1]--.",
      "Compute prefix sums and count positions > 0.",
    ],
    solution: `function numberOfPoints(nums) {
  const diff = new Array(102).fill(0);
  for (const [s, e] of nums) { diff[s]++; diff[e + 1]--; }
  let count = 0, cur = 0;
  for (let i = 0; i < 102; i++) {
    cur += diff[i];
    if (cur > 0) count++;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n + R)", space: "O(R)" },
    systemDesign: "Counting covered points underpins storage block allocation tracking in file systems and database buffer pools — each allocated extent contributes to coverage, and the total covered positions equals space in use. Monitoring systems use the same approach to count time slots that have at least one active metric.",
    pitfalls: ["Array size must be max_end + 2 to avoid out-of-bounds on diff[e+1].", "Coordinates start at 1 in this problem — diff[0] will simply remain 0."],
  },
  {
    id: "intervals-08",
    title: "Merge Intervals",
    difficulty: "Easy",
    tags: ["Intervals", "Array", "Sorting"],
    statement: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
    ],
    intuition: "Sort by start time, then sweep through: if the current interval overlaps the last merged one (its start is within the last one's end), extend the last one's end; otherwise start a new merged interval — like merging overlapping calendar bookings.",
    approach: [
      "Sort intervals by start time.",
      "Initialize merged with the first interval.",
      "For each subsequent interval, if its start <= last merged end, update last merged end to max(last end, current end).",
      "Otherwise push a new interval.",
      "Return merged.",
    ],
    solution: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      merged.push(intervals[i]);
    }
  }
  return merged;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Merge Intervals is the core algorithm behind calendar free/busy computation, meeting-room booking conflict resolution, and time-series data compaction in databases like InfluxDB where overlapping write ranges are merged into single contiguous segments to reduce storage and query overhead.",
    pitfalls: ["Sort by start, not end — sorting by end can leave earlier-starting intervals unprocessed.", "Update last[1] to max(last[1], current[1]) because a long interval may fully contain the next one."],
  },
  {
    id: "intervals-09",
    title: "Remove Covered Intervals",
    difficulty: "Easy",
    tags: ["Intervals", "Array", "Sorting", "Greedy"],
    statement: "Given an array of intervals, remove all intervals that are covered by another interval in the list. Return the number of remaining intervals. Interval [a,b] covers [c,d] if a <= c and b >= d.",
    examples: [
      { input: "intervals = [[1,4],[3,6],[2,8]]", output: "2" },
      { input: "intervals = [[1,4],[2,3]]", output: "1" },
    ],
    intuition: "Sort by start ascending, then by end descending for equal starts. Walk through keeping track of the maximum end seen — any interval whose end is within this max is covered and can be removed.",
    approach: [
      "Sort: ascending start, descending end for ties.",
      "Walk through; track maxEnd = 0.",
      "If current interval's end <= maxEnd it is covered — skip it (decrement count).",
      "Otherwise update maxEnd = current end.",
      "Return remaining count.",
    ],
    solution: `function removeCoveredIntervals(intervals) {
  intervals.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : b[1] - a[1]);
  let count = intervals.length, maxEnd = 0;
  for (const [, e] of intervals) {
    if (e <= maxEnd) count--;
    else maxEnd = e;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Removing covered intervals is used in IP routing table compaction (removing more-specific prefixes already covered by a broader prefix) and in query optimiser predicate simplification where a wider range predicate makes a narrower one redundant, reducing filter work.",
    pitfalls: ["Sort end descending for equal starts so the wider interval comes first and its end becomes maxEnd before the narrower one is evaluated.", "An interval with the exact same endpoints as a previous one is also covered."],
  },
  {
    id: "intervals-10",
    title: "Determine if Two Events Have No Conflict (Meeting Rooms I)",
    difficulty: "Easy",
    tags: ["Intervals", "Array", "Sorting"],
    statement: "Given an array of meeting time intervals where intervals[i] = [starti, endi], determine if a person could attend all meetings (no two meetings overlap).",
    examples: [
      { input: "intervals = [[0,30],[5,10],[15,20]]", output: "false" },
      { input: "intervals = [[7,10],[2,4]]", output: "true" },
    ],
    intuition: "Sort by start time; if any meeting starts before the previous one ends, there is a conflict — like checking whether pages of a book's index are all in order with no overlapping ranges.",
    approach: [
      "Sort intervals by start time.",
      "For consecutive pairs, if intervals[i][0] < intervals[i-1][1], return false.",
      "Return true if no conflict found.",
    ],
    solution: `function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "This is the simplest scheduling feasibility check. Calendaring APIs (Google Calendar, Calendly) run a variant of this before confirming a booking — any new event is validated against all existing events for the user to ensure no overlap before being committed to the database.",
    pitfalls: ["Adjacent meetings [0,10] and [10,20] do NOT conflict — use strict less-than (<) for the start check.", "Empty input is trivially feasible — return true."],
  },
  {
    id: "intervals-11",
    title: "Insert Interval",
    difficulty: "Medium",
    tags: ["Intervals", "Array"],
    statement: "Given a sorted non-overlapping list of intervals and a new interval, insert the new interval and merge any overlapping ones. Return the resulting list of intervals.",
    examples: [
      { input: "intervals = [[1,3],[6,9]], newInterval = [2,5]", output: "[[1,5],[6,9]]" },
      { input: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]", output: "[[1,2],[3,10],[12,16]]" },
    ],
    intuition: "Walk through the sorted list in three phases: first collect all intervals that end before the new interval starts (no overlap), then merge all overlapping intervals into the new one, then collect the rest unchanged.",
    approach: [
      "Phase 1: while interval ends before newInterval starts, push as-is.",
      "Phase 2: while interval starts <= newInterval end, expand newInterval to cover both.",
      "Push the merged newInterval.",
      "Phase 3: push all remaining intervals.",
    ],
    solution: `function insert(intervals, newInterval) {
  const res = [];
  let i = 0;
  const n = intervals.length;
  while (i < n && intervals[i][1] < newInterval[0]) res.push(intervals[i++]);
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  res.push(newInterval);
  while (i < n) res.push(intervals[i++]);
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Insert Interval models adding a new reservation to an existing sorted booking list — used in room/resource reservation systems where the stored intervals are already normalised. Calendar systems maintain a sorted interval list and run this algorithm on each new booking to detect and merge conflicts in O(n).",
    pitfalls: ["The three-phase approach avoids re-sorting (input is already sorted), keeping complexity O(n).", "newInterval might not overlap any existing interval — the merge while-loop simply never executes."],
  },
  {
    id: "intervals-12",
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Sorting", "Greedy"],
    statement: "Given an array of intervals, return the minimum number of intervals you need to remove to make the rest non-overlapping.",
    examples: [
      { input: "intervals = [[1,2],[2,3],[3,4],[1,3]]", output: "1", explanation: "Remove [1,3] to make the rest non-overlapping." },
      { input: "intervals = [[1,2],[1,2],[1,2]]", output: "2" },
    ],
    intuition: "Sort by end time; greedily keep the interval that ends earliest (it leaves the most room for future intervals). Every interval that conflicts with the current keeper must be removed.",
    approach: [
      "Sort by end time.",
      "Track prevEnd = first interval's end, removals = 0.",
      "For each subsequent interval: if it starts < prevEnd, increment removals (remove this one).",
      "Else update prevEnd = current end.",
      "Return removals.",
    ],
    solution: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let removals = 0, prevEnd = intervals[0][1];
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < prevEnd) {
      removals++;
    } else {
      prevEnd = intervals[i][1];
    }
  }
  return removals;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Minimum interval removal is equivalent to Maximum Non-overlapping Intervals (activity selection), the classic scheduling optimisation. Job schedulers in operating systems and cloud batch systems use this greedy to maximise the number of tasks that can run without resource conflicts.",
    pitfalls: ["Sort by end time, NOT start time — earliest-finish greedy is provably optimal.", "Adjacent intervals with equal endpoints [1,2] and [2,3] do NOT overlap — use strict < for start check."],
  },
  {
    id: "intervals-13",
    title: "Interval List Intersections",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Two Pointers"],
    statement: "Given two lists of closed intervals firstList and secondList, each sorted and non-overlapping, return their intersection as a list of closed intervals.",
    examples: [
      { input: "firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]", output: "[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]" },
      { input: "firstList = [[1,3],[5,9]], secondList = []", output: "[]" },
    ],
    intuition: "Use two pointers, one per list. The intersection of two intervals is [max(s1,s2), min(e1,e2)] if that is non-empty. Advance the pointer whose interval ends first — it cannot intersect any later interval from the other list.",
    approach: [
      "Initialize i=0, j=0.",
      "While both pointers are in range: compute lo=max(a[0],b[0]), hi=min(a[1],b[1]).",
      "If lo <= hi, push [lo, hi].",
      "Advance the pointer whose interval end is smaller.",
    ],
    solution: `function intervalIntersection(firstList, secondList) {
  const res = [];
  let i = 0, j = 0;
  while (i < firstList.length && j < secondList.length) {
    const lo = Math.max(firstList[i][0], secondList[j][0]);
    const hi = Math.min(firstList[i][1], secondList[j][1]);
    if (lo <= hi) res.push([lo, hi]);
    if (firstList[i][1] < secondList[j][1]) i++;
    else j++;
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(m+n)", space: "O(m+n)" },
    systemDesign: "Interval intersection is the foundation of join operations on sorted time-range tables in databases (e.g. finding overlapping reservations between two users). Distributed join algorithms for temporal data use this two-pointer merge on pre-sorted partitions to avoid a full cross-product scan.",
    pitfalls: ["Advance the pointer with the smaller end, not the smaller start.", "An empty intersection [lo, hi] where lo > hi means no overlap — skip it."],
  },
  {
    id: "intervals-14",
    title: "Minimum Number of Arrows to Burst Balloons",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Sorting", "Greedy"],
    statement: "Given a list of balloon intervals [xstart, xend], find the minimum number of arrows shot vertically to burst all balloons. An arrow at position x bursts any balloon with xstart <= x <= xend.",
    examples: [
      { input: "points = [[10,16],[2,8],[1,6],[7,12]]", output: "2" },
      { input: "points = [[1,2],[3,4],[5,6],[7,8]]", output: "4" },
    ],
    intuition: "Sort by end coordinate; shoot the first arrow at the end of the first balloon, which bursts all other balloons overlapping that position. Any balloon starting after the arrow position needs a new arrow.",
    approach: [
      "Sort by end coordinate.",
      "Initialize arrowPos = first balloon's end, arrows = 1.",
      "For each subsequent balloon: if its start > arrowPos, shoot new arrow at its end and increment arrows.",
      "Return arrows.",
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
    systemDesign: "Minimum arrows equals minimum number of points that pierce all intervals — identical to the minimum hitting set problem used in network intrusion detection (minimum number of signatures that cover all known attack patterns). CDN cache warming strategies also use this to minimise the number of prefetch requests that cover all expected content ranges.",
    pitfalls: ["Sort by end (not start) for the greedy to be optimal.", "Adjacent balloons [1,2] and [2,3] share position 2 — they are burst by one arrow (use >, not >=, for the new-arrow check)."],
  },
  {
    id: "intervals-15",
    title: "Car Pooling",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Prefix Sum", "Sorting"],
    statement: "Given a list of trips where trips[i] = [numPassengers, from, to] and an integer capacity, return true if it is possible to pick up and drop off all passengers without exceeding vehicle capacity at any point.",
    examples: [
      { input: "trips = [[2,1,5],[3,3,7]], capacity = 4", output: "false" },
      { input: "trips = [[2,1,5],[3,3,7]], capacity = 5", output: "true" },
    ],
    intuition: "Use a difference array on the route positions: add passengers at their pickup stop and remove them at their dropoff stop. If the running sum ever exceeds capacity, return false.",
    approach: [
      "Create a difference array of size 1001.",
      "For each trip [n, from, to], diff[from] += n and diff[to] -= n.",
      "Compute prefix sums; if any value exceeds capacity, return false.",
      "Return true.",
    ],
    solution: `function carPooling(trips, capacity) {
  const diff = new Array(1001).fill(0);
  for (const [n, from, to] of trips) { diff[from] += n; diff[to] -= n; }
  let cur = 0;
  for (const d of diff) {
    cur += d;
    if (cur > capacity) return false;
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(n + R)", space: "O(R)" },
    systemDesign: "Car pooling is a capacity constraint check over intervals — identical to checking whether a server never exceeds CPU quota during overlapping request windows. Cloud auto-scalers and database connection pools use this sweep-line logic to verify that no time slice exceeds the provisioned resource limit.",
    pitfalls: ["Passengers leave at 'to' (not 'to+1') because they exit before the vehicle reaches the next stop.", "The difference array must cover the full range of stops (up to 1000)."],
  },
  {
    id: "intervals-16",
    title: "Find Right Interval",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Binary Search", "Sorting"],
    statement: "Given a list of intervals, for each interval find the index of the interval with the smallest start >= current interval's end. Return -1 if no such interval exists.",
    examples: [
      { input: "intervals = [[1,2]]", output: "[-1]" },
      { input: "intervals = [[3,4],[2,3],[1,2]]", output: "[-1,0,1]" },
    ],
    intuition: "Store (start, original index) pairs sorted by start. For each interval's end, binary search for the first start >= that end — like looking in a phone book for the next name not less than what you have.",
    approach: [
      "Build sorted array of [start, originalIndex].",
      "For each interval, binary search for smallest start >= interval[1].",
      "If found, record the original index; else -1.",
    ],
    solution: `function findRightInterval(intervals) {
  const sorted = intervals.map(([s], i) => [s, i]).sort((a, b) => a[0] - b[0]);
  const starts = sorted.map(x => x[0]);
  return intervals.map(([, e]) => {
    let lo = 0, hi = starts.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (starts[mid] < e) lo = mid + 1; else hi = mid;
    }
    return lo < starts.length ? sorted[lo][1] : -1;
  });
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Right-interval lookup is the core of next-event scheduling in discrete event simulators and calendar apps ('what is the next free slot after this meeting ends?'). Database index scans for range predicates like WHERE start >= X use the same binary-search-on-sorted-index approach to find the first qualifying row efficiently.",
    pitfalls: ["Binary search must find the first start strictly >= end, not >.", "Original indices must be preserved because sorting rearranges the order."],
  },
  {
    id: "intervals-17",
    title: "Meeting Rooms II",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Heap", "Greedy"],
    statement: "Given an array of meeting time intervals, find the minimum number of conference rooms required.",
    examples: [
      { input: "intervals = [[0,30],[5,10],[15,20]]", output: "2" },
      { input: "intervals = [[7,10],[2,4]]", output: "1" },
    ],
    intuition: "Sort meetings by start. Use a min-heap of end times for rooms in use. When a new meeting starts, if the earliest-ending room is free (its end <= new start), reuse it; otherwise open a new room.",
    approach: [
      "Sort intervals by start time.",
      "Use a min-heap (sorted array as simulated heap) of end times.",
      "For each interval: if heap min <= start, remove min (reuse room). Push current end.",
      "Heap size at the end is the answer.",
    ],
    solution: `function minMeetingRooms(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const ends = [];
  for (const [s, e] of intervals) {
    const minEnd = ends[0];
    if (minEnd !== undefined && minEnd <= s) {
      ends.splice(ends.indexOf(minEnd), 1);
    }
    ends.push(e);
    ends.sort((a, b) => a - b);
  }
  return ends.length;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Meeting Rooms II directly models resource allocation in cloud schedulers: each 'room' is a server/container, and the algorithm determines the minimum fleet size to handle peak concurrent workload. Kubernetes cluster autoscaler and database connection pool sizing are both solved with this greedy min-heap approach.",
    pitfalls: ["A meeting that starts exactly when another ends can reuse that room (use <=, not <).", "In production use a proper priority queue / min-heap — the splice+sort above is for clarity, not optimal speed."],
  },
  {
    id: "intervals-18",
    title: "Divide Intervals Into Minimum Number of Groups",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Greedy", "Sorting"],
    statement: "Given an array of intervals, divide them into the minimum number of groups such that no two intervals in the same group overlap. Return the minimum number of groups.",
    examples: [
      { input: "intervals = [[5,10],[6,8],[1,5],[2,3],[1,10]]", output: "3" },
      { input: "intervals = [[1,3],[5,7],[4,6]]", output: "2" },
    ],
    intuition: "The minimum number of groups equals the maximum number of intervals overlapping at any single point — exactly like Meeting Rooms II. Sweep through start/end events and track peak simultaneous count.",
    approach: [
      "Collect all start events (+1) and end events (-1).",
      "Sort events by time (end events before start events at same time to allow reuse).",
      "Walk through events tracking running count; record maximum.",
    ],
    solution: `function minGroups(intervals) {
  const events = [];
  for (const [s, e] of intervals) {
    events.push([s, 1]);
    events.push([e + 1, -1]);
  }
  events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
  let cur = 0, max = 0;
  for (const [, delta] of events) {
    cur += delta;
    max = Math.max(max, cur);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Minimum group count is the key metric for resource provisioning: it tells you exactly how many parallel workers, servers, or channels are needed to handle peak concurrent load. Cloud cost optimisers use this to right-size auto-scaling groups and avoid over-provisioning.",
    pitfalls: ["End events at time e should be e+1 (the interval is inclusive, so it frees up at e+1).", "At the same time point, end events (-1) should be processed before start events (+1) to allow reuse."],
  },
  {
    id: "intervals-19",
    title: "Video Stitching",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Greedy", "Dynamic Programming"],
    statement: "Given a list of video clips [starti, endi] and an integer time, return the minimum number of clips needed to cover the range [0, time]. Return -1 if impossible.",
    examples: [
      { input: "clips = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]], time = 10", output: "3" },
      { input: "clips = [[0,1],[1,2]], time = 5", output: "-1" },
    ],
    intuition: "Use a jump-game greedy: at each step pick the clip that extends coverage the furthest from within the current coverage, then leap to the new boundary — like cutting puzzle pieces to cover the longest strip.",
    approach: [
      "Sort clips by start.",
      "Walk through with curEnd (current coverage) and maxEnd (farthest reachable) and clips count.",
      "For each clip starting <= curEnd, update maxEnd.",
      "When clip start exceeds curEnd, jump: curEnd = maxEnd, clips++.",
      "If maxEnd stalls below time, return -1.",
    ],
    solution: `function videoStitching(clips, time) {
  clips.sort((a, b) => a[0] - b[0]);
  let count = 0, curEnd = 0, maxEnd = 0, i = 0;
  while (curEnd < time) {
    while (i < clips.length && clips[i][0] <= curEnd) {
      maxEnd = Math.max(maxEnd, clips[i][1]);
      i++;
    }
    if (maxEnd <= curEnd) return -1;
    curEnd = maxEnd;
    count++;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Video stitching is structurally identical to minimum-number-of-jumps and models CDN segment coverage: finding the minimum number of edge nodes needed to serve a complete video without gaps. Content delivery scheduling and log archival segment selection use greedy interval coverage for the same reason.",
    pitfalls: ["A gap (maxEnd <= curEnd after scanning) means coverage is impossible — return -1.", "Sort by start, not end, to correctly scan candidates for extending curEnd."],
  },
  {
    id: "intervals-20",
    title: "Minimum Number of Taps to Open to Water a Garden",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Greedy", "Dynamic Programming"],
    statement: "A garden has n+1 positions from 0 to n. Each tap at position i can water the range [i - ranges[i], i + ranges[i]]. Return the minimum number of taps to water the whole garden [0, n], or -1 if impossible.",
    examples: [
      { input: "n = 5, ranges = [3,4,1,1,0,0]", output: "1" },
      { input: "n = 3, ranges = [0,0,0,0]", output: "-1" },
    ],
    intuition: "Convert each tap into an interval, then apply the same greedy interval cover as Video Stitching — keep jumping to whichever tap extends your watered range furthest.",
    approach: [
      "Convert taps to intervals: [max(0, i-ranges[i]), min(n, i+ranges[i])].",
      "Apply jump-game greedy interval cover.",
      "Return minimum taps or -1 if coverage fails.",
    ],
    solution: `function minTaps(n, ranges) {
  const intervals = ranges.map((r, i) => [Math.max(0, i - r), Math.min(n, i + r)]);
  intervals.sort((a, b) => a[0] - b[0]);
  let count = 0, curEnd = 0, maxEnd = 0, i = 0;
  while (curEnd < n) {
    while (i < intervals.length && intervals[i][0] <= curEnd) {
      maxEnd = Math.max(maxEnd, intervals[i][1]);
      i++;
    }
    if (maxEnd <= curEnd) return -1;
    curEnd = maxEnd;
    count++;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Minimum tap/cover problems model infrastructure provisioning: minimum number of regional data centres whose coverage zones together cover all required geographic areas. CDN PoP placement and wireless cell tower placement both reduce to minimum interval cover.",
    pitfalls: ["Clamp interval endpoints to [0, n] to avoid searching beyond the garden.", "Reuses the same greedy as Video Stitching — factor the jump-game cover into a shared helper for DRY code."],
  },
  {
    id: "intervals-21",
    title: "Course Schedule III",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Greedy", "Heap"],
    statement: "Given a list of courses [duration, lastDay], where each course must be completed by lastDay and takes duration days, return the maximum number of courses you can take.",
    examples: [
      { input: "courses = [[100,200],[200,1300],[1000,1250],[2000,3200]]", output: "3" },
      { input: "courses = [[1,2]]", output: "1" },
    ],
    intuition: "Sort by deadline. Greedily take each course; if taking it pushes the total time past its deadline, swap it out for the longest course taken so far if that course is longer — this keeps total time minimised while maximising count.",
    approach: [
      "Sort courses by lastDay.",
      "Use a max-heap (simulated) of durations taken so far and track currentTime.",
      "For each course: if currentTime + duration <= lastDay, add it.",
      "Else if heap max > duration, replace max with current (reduces total time).",
      "Return heap size.",
    ],
    solution: `function scheduleCourse(courses) {
  courses.sort((a, b) => a[1] - b[1]);
  const heap = [];
  let time = 0;
  for (const [d, last] of courses) {
    heap.push(d);
    heap.sort((a, b) => b - a);
    time += d;
    if (time > last) {
      time -= heap.shift();
    }
  }
  return heap.length;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Course scheduling with deadlines is a classic interval scheduling on a timeline, directly applicable to deadline-aware job schedulers (like deadline-first schedulers in real-time systems). Cloud batch job schedulers use the same exchange argument to maximise throughput while meeting SLA deadlines.",
    pitfalls: ["Swapping in a shorter course when adding would exceed the deadline keeps total time as small as possible.", "Use a proper max-heap for efficiency; the sort-based simulation above is O(n² log n) in the worst case."],
  },
  {
    id: "intervals-22",
    title: "My Calendar I",
    difficulty: "Medium",
    tags: ["Intervals", "Design", "Binary Search", "Sorting"],
    statement: "Implement a MyCalendar class where book(start, end) adds a booking if it does not cause a double booking (overlap with any existing event). Return true if the booking is successful, false otherwise.",
    examples: [
      { input: "book(10,20), book(15,25), book(20,30)", output: "true, false, true" },
    ],
    intuition: "Maintain a sorted list of bookings. For a new booking, binary search for the first event that starts at or after the new start; then check the new event does not overlap either the predecessor or successor.",
    approach: [
      "Keep a sorted array of [start, end] pairs.",
      "Binary search for insertion position.",
      "Check: previous event's end <= new start AND new end <= next event's start.",
      "If no overlap, insert and return true; else return false.",
    ],
    solution: `class MyCalendar {
  constructor() { this.events = []; }
  book(start, end) {
    const e = this.events;
    let lo = 0, hi = e.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (e[mid][0] < start) lo = mid + 1; else hi = mid;
    }
    if (lo < e.length && e[lo][0] < end) return false;
    if (lo > 0 && e[lo - 1][1] > start) return false;
    e.splice(lo, 0, [start, end]);
    return true;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n) per booking", space: "O(n)" },
    systemDesign: "My Calendar I is the data-structure backbone of any booking system: airline seat reservation, hotel room scheduling, and database row-level locking all maintain a sorted list of held ranges and check for overlap before committing. Production systems use B-tree range indexes for O(log n) overlap checks at scale.",
    pitfalls: ["Check both the predecessor (its end > new start) and the successor (its start < new end) for overlap.", "Use a sorted structure — linear scan works but is O(n) per booking; a balanced BST achieves O(log n)."],
  },
  {
    id: "intervals-23",
    title: "My Calendar II",
    difficulty: "Medium",
    tags: ["Intervals", "Design", "Sorting"],
    statement: "Implement a MyCalendarTwo class where book(start, end) adds a booking if it does not cause a triple booking. A double booking is allowed. Return true if successful, false otherwise.",
    examples: [
      { input: "book(10,20), book(50,60), book(10,40), book(5,15), book(5,10), book(25,55)", output: "true,true,true,false,true,true" },
    ],
    intuition: "Maintain two lists: one for all booked intervals and one for double-booked segments. A new booking is rejected only if it overlaps any already-double-booked segment; otherwise add its intersections with existing bookings to the doubles list.",
    approach: [
      "Keep calendar (all bookings) and overlaps (double-booked segments).",
      "For new [start, end]: if it overlaps any segment in overlaps, return false.",
      "Otherwise, compute intersections with calendar entries and add to overlaps.",
      "Add to calendar and return true.",
    ],
    solution: `class MyCalendarTwo {
  constructor() { this.calendar = []; this.overlaps = []; }
  book(start, end) {
    for (const [s, e] of this.overlaps) {
      if (start < e && end > s) return false;
    }
    for (const [s, e] of this.calendar) {
      const lo = Math.max(start, s), hi = Math.min(end, e);
      if (lo < hi) this.overlaps.push([lo, hi]);
    }
    this.calendar.push([start, end]);
    return true;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n) per booking", space: "O(n)" },
    systemDesign: "My Calendar II models double-booking rules used in airline overbooking systems (seats can be sold twice, but not three times) and hotel yield management. Database isolation levels with optimistic concurrency control use a similar multi-version overlap check before committing writes.",
    pitfalls: ["Check overlaps (triple-booking guard) before updating; otherwise you might add a bad intersection.", "The overlap of [start,end] with [s,e] is [max(start,s), min(end,e)] — only valid if lo < hi."],
  },
  {
    id: "intervals-24",
    title: "My Calendar III",
    difficulty: "Hard",
    tags: ["Intervals", "Design", "Segment Tree", "Prefix Sum"],
    statement: "Implement a MyCalendarThree class where book(start, end) adds an event and returns the maximum k-booking (maximum number of events at any point in time) after each booking.",
    examples: [
      { input: "book(10,20), book(50,60), book(10,40), book(5,15), book(5,10), book(25,55)", output: "1,1,2,3,3,3" },
    ],
    intuition: "Use a difference array / coordinate-compressed line sweep: add +1 at start and -1 at end, then find the maximum prefix sum — the peak of the prefix sum is the maximum overlap at any instant.",
    approach: [
      "Maintain a sorted map of time -> delta.",
      "For each booking: delta[start]++, delta[end]--.",
      "Sweep through the sorted deltas computing prefix sum; return the max.",
    ],
    solution: `class MyCalendarThree {
  constructor() { this.delta = new Map(); }
  book(start, end) {
    this.delta.set(start, (this.delta.get(start) || 0) + 1);
    this.delta.set(end, (this.delta.get(end) || 0) - 1);
    let cur = 0, max = 0;
    for (const k of [...this.delta.keys()].sort((a, b) => a - b)) {
      cur += this.delta.get(k);
      max = Math.max(max, cur);
    }
    return max;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n log n) per booking", space: "O(n)" },
    systemDesign: "My Calendar III powers peak-concurrency dashboards in observability platforms (DataDog, New Relic) that show the maximum simultaneous active sessions or transactions at any moment. Segment trees with lazy propagation reduce each booking to O(log n) and are used in production calendar backends handling millions of events.",
    pitfalls: ["Re-sorting all keys on every booking is O(n log n) — use a TreeMap (sorted map) or segment tree for O(log n) per operation.", "The delta approach is equivalent to a difference array but on coordinate-compressed sparse keys."],
  },
  {
    id: "intervals-25",
    title: "Data Stream as Disjoint Intervals",
    difficulty: "Hard",
    tags: ["Intervals", "Design", "Sorting", "Binary Search"],
    statement: "Design a SummaryRanges class that reads a stream of non-negative integers and returns a summary of disjoint intervals at any time. Implement addNum(value) and getIntervals().",
    examples: [
      { input: "addNum(1), addNum(3), addNum(7), addNum(2), addNum(6), getIntervals()", output: "[[1,3],[6,7]]" },
    ],
    intuition: "Maintain a sorted list of disjoint intervals. When adding a number, find intervals it touches (the one ending at value-1 and the one starting at value+1) and merge them — like inserting a new piece into a jigsaw puzzle and snapping adjacent pieces together.",
    approach: [
      "On addNum(val): check if val-1 is the end of some interval and if val+1 is the start of another.",
      "Merge accordingly: extend existing interval, merge two intervals, or insert a new [val,val].",
      "getIntervals() returns the sorted list.",
    ],
    solution: `class SummaryRanges {
  constructor() { this.intervals = []; }
  addNum(val) {
    const newInterval = [val, val];
    const result = [];
    let inserted = false;
    for (const iv of this.intervals) {
      if (iv[1] + 1 < newInterval[0]) {
        result.push(iv);
      } else if (iv[0] - 1 > newInterval[1]) {
        if (!inserted) { result.push(newInterval); inserted = true; }
        result.push(iv);
      } else {
        newInterval[0] = Math.min(newInterval[0], iv[0]);
        newInterval[1] = Math.max(newInterval[1], iv[1]);
      }
    }
    if (!inserted) result.push(newInterval);
    this.intervals = result;
  }
  getIntervals() { return this.intervals; }
}`,
    language: "javascript",
    complexity: { time: "O(n) per addNum", space: "O(n)" },
    systemDesign: "Data Stream as Disjoint Intervals models how received data segments are tracked in TCP reassembly buffers: out-of-order packets are stored as disjoint byte ranges and merged as gaps are filled. Distributed file-download managers use the same structure to track which byte ranges have been downloaded.",
    pitfalls: ["Merging condition: two intervals merge when one ends at most one before the other starts (iv[1]+1 >= newInterval[0]).", "Using a balanced BST (like a TreeMap) reduces addNum to O(log n)."],
  },
  {
    id: "intervals-26",
    title: "Maximum Number of Events That Can Be Attended",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Greedy", "Heap"],
    statement: "Given an array of events where events[i] = [startDay, endDay], you can attend at most one event per day. Return the maximum number of events you can attend.",
    examples: [
      { input: "events = [[1,2],[2,3],[3,4]]", output: "3" },
      { input: "events = [[1,4],[4,4],[2,2],[3,4],[1,1]]", output: "4" },
    ],
    intuition: "Each day, attend the available event that ends soonest (greedy: earliest-deadline-first). Use a min-heap of end days, adding events as each day arrives.",
    approach: [
      "Sort events by start day.",
      "Walk each day from min to max start.",
      "Add all events starting today to the heap (keyed by end day).",
      "Remove expired events (end < today) from the heap.",
      "If heap non-empty, attend and pop the minimum-end event; increment count.",
    ],
    solution: `function maxEvents(events) {
  events.sort((a, b) => a[0] - b[0]);
  const minHeap = [];
  let i = 0, count = 0;
  const maxDay = Math.max(...events.map(e => e[1]));
  for (let day = 1; day <= maxDay; day++) {
    while (i < events.length && events[i][0] === day) {
      minHeap.push(events[i][1]);
      i++;
    }
    minHeap.sort((a, b) => a - b);
    while (minHeap.length && minHeap[0] < day) minHeap.shift();
    if (minHeap.length) { minHeap.shift(); count++; }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O((n + D) log n)", space: "O(n)" },
    systemDesign: "Earliest-deadline-first (EDF) scheduling is a foundational real-time operating systems algorithm used in medical devices, industrial control systems, and multimedia streaming to ensure time-sensitive tasks complete before their deadlines while maximising throughput.",
    pitfalls: ["Process each day one at a time — skipping days misses the opportunity to attend events with tight deadlines.", "Remove expired events (end < today) before attending to keep the heap clean."],
  },
  {
    id: "intervals-27",
    title: "Maximum Number of Events That Can Be Attended II",
    difficulty: "Hard",
    tags: ["Intervals", "Array", "Dynamic Programming", "Binary Search"],
    statement: "Given events where events[i] = [startDay, endDay, value] and an integer k, return the maximum sum of values of at most k non-overlapping events you can attend.",
    examples: [
      { input: "events = [[1,2,4],[3,4,3],[2,3,1]], k = 2", output: "7" },
      { input: "events = [[1,2,4],[3,4,3],[2,3,10]], k = 2", output: "10" },
    ],
    intuition: "Sort by end day. Use DP where dp[j][i] = best value attending at most j events ending with event i. Binary search for the latest event that ends before event i starts to chain events.",
    approach: [
      "Sort events by end day.",
      "dp[j][i] = max value using j events, last being event i.",
      "For each event i and count j: binary search for last event ending before events[i][0].",
      "dp[j][i] = max(dp[j][i-1], dp[j-1][prev] + events[i][2]).",
    ],
    solution: `function maxValue(events, k) {
  events.sort((a, b) => a[1] - b[1]);
  const n = events.length;
  const dp = Array.from({length: k + 1}, () => new Array(n + 1).fill(0));
  for (let j = 1; j <= k; j++) {
    for (let i = 1; i <= n; i++) {
      const [s, , v] = events[i - 1];
      let lo = 0, hi = i - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (events[mid - 1][1] < s) lo = mid; else hi = mid - 1;
      }
      dp[j][i] = Math.max(dp[j][i - 1], dp[j - 1][lo] + v);
    }
  }
  return dp[k][n];
}`,
    language: "javascript",
    complexity: { time: "O(nk log n)", space: "O(nk)" },
    systemDesign: "This weighted interval scheduling DP powers revenue-maximising job/ad slot selection: choose at most k non-overlapping ad slots to maximise total bid value. Financial derivative pricing systems also use weighted interval DP to select optimal exercise windows across multiple options.",
    pitfalls: ["Binary search for the last event whose end < current event's start (strictly less-than, since events must be non-overlapping).", "dp[j][i-1] handles the case where event i is not taken."],
  },
  {
    id: "intervals-28",
    title: "Employee Free Time",
    difficulty: "Hard",
    tags: ["Intervals", "Array", "Sorting", "Heap"],
    statement: "Given a list of schedules where schedules[i] is a list of intervals for employee i, return the list of finite intervals representing the common free time of all employees sorted by start.",
    examples: [
      { input: "schedules = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]", output: "[[5,6],[7,9]]" },
    ],
    intuition: "Flatten all employee schedules into one list, sort and merge overlapping intervals, then the gaps between consecutive merged intervals are the common free time — like finding the empty slots between all appointments on a shared calendar.",
    approach: [
      "Flatten all intervals into a single array.",
      "Sort by start time and merge overlapping intervals.",
      "Gaps between consecutive merged intervals are free times.",
    ],
    solution: `function employeeFreeTime(schedule) {
  const all = schedule.flat().sort((a, b) => a[0] - b[0]);
  const merged = [all[0].slice()];
  for (let i = 1; i < all.length; i++) {
    const last = merged[merged.length - 1];
    if (all[i][0] <= last[1]) last[1] = Math.max(last[1], all[i][1]);
    else merged.push(all[i].slice());
  }
  const res = [];
  for (let i = 1; i < merged.length; i++) res.push([merged[i-1][1], merged[i][0]]);
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Employee Free Time is the exact algorithm used by meeting scheduling assistants (Calendly, When2meet, Microsoft FindTime) to compute the intersection of available time slots across multiple users' calendars. The merge-then-gap approach scales to thousands of users when intervals are pre-sorted per employee.",
    pitfalls: ["Flatten all schedules first — merge cannot be done per-employee because free time requires all employees to be idle simultaneously.", "Deep-copy intervals when merging to avoid mutating the input."],
  },
  {
    id: "intervals-29",
    title: "Number of Flowers in Full Bloom",
    difficulty: "Hard",
    tags: ["Intervals", "Array", "Binary Search", "Sorting"],
    statement: "Given arrays flowers where flowers[i] = [start, end] and persons where persons[j] is the time person j arrives, return an array answer where answer[j] is the number of flowers in full bloom when person j arrives.",
    examples: [
      { input: "flowers = [[1,6],[3,7],[9,12],[4,13]], persons = [2,3,7,11]", output: "[1,2,2,2]" },
    ],
    intuition: "A flower is blooming at time t if its start <= t and end >= t. Count flowers whose start <= t minus flowers whose end < t — binary search on sorted start and end arrays for each person.",
    approach: [
      "Sort flower starts and ends separately.",
      "For each person time t: blooming = (number of starts <= t) - (number of ends < t).",
      "Use binary search (upper_bound on starts, lower_bound on ends).",
    ],
    solution: `function fullBloomFlowers(flowers, persons) {
  const starts = flowers.map(f => f[0]).sort((a, b) => a - b);
  const ends = flowers.map(f => f[1]).sort((a, b) => a - b);
  function upperBound(arr, val) {
    let lo = 0, hi = arr.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (arr[mid] <= val) lo = mid + 1; else hi = mid; }
    return lo;
  }
  function lowerBound(arr, val) {
    let lo = 0, hi = arr.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (arr[mid] < val) lo = mid + 1; else hi = mid; }
    return lo;
  }
  return persons.map(t => upperBound(starts, t) - lowerBound(ends, t));
}`,
    language: "javascript",
    complexity: { time: "O((n + m) log n)", space: "O(n)" },
    systemDesign: "Point-in-interval counting is used in A/B testing platforms to determine how many active experiment variants overlap at a given timestamp, and in pricing engines to count how many discount campaigns are active for a user at query time — both solved via binary search on sorted event arrays.",
    pitfalls: ["Count starts <= t (upper_bound) and ends < t (lower_bound) — a flower whose end equals t is still blooming.", "Sort starts and ends as separate arrays, not as pairs."],
  },
  {
    id: "intervals-30",
    title: "Maximum Profit in Job Scheduling",
    difficulty: "Hard",
    tags: ["Intervals", "Array", "Dynamic Programming", "Binary Search"],
    statement: "Given startTime, endTime, and profit arrays for n jobs, return the maximum profit you can obtain by scheduling non-overlapping jobs.",
    examples: [
      { input: "startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]", output: "120" },
      { input: "startTime = [1,2,3,4,6], endTime = [3,5,10,6,9], profit = [20,20,100,200,19]", output: "200" },
    ],
    intuition: "This is weighted interval scheduling DP. Sort by end time; for each job decide to take it (add its profit to the best result ending before its start) or skip it. Binary search finds the latest non-conflicting job.",
    approach: [
      "Sort jobs by end time.",
      "dp[i] = max profit considering first i jobs.",
      "For job i: binary search for last job j with endTime[j] <= startTime[i].",
      "dp[i] = max(dp[i-1], dp[j] + profit[i]).",
    ],
    solution: `function jobScheduling(startTime, endTime, profit) {
  const n = startTime.length;
  const jobs = Array.from({length: n}, (_, i) => [startTime[i], endTime[i], profit[i]]);
  jobs.sort((a, b) => a[1] - b[1]);
  const dp = [0];
  const ends = [0];
  for (const [s, e, p] of jobs) {
    let lo = 0, hi = ends.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (ends[mid] <= s) lo = mid; else hi = mid - 1; }
    const best = Math.max(dp[dp.length - 1], dp[lo] + p);
    dp.push(best);
    ends.push(e);
  }
  return dp[dp.length - 1];
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Maximum profit job scheduling is the core algorithm in revenue-maximising slot-based ad auctions and cloud spot-instance bid selection. Financial portfolio optimisers for derivative contracts with expiry windows use the same weighted interval DP to select non-overlapping positions that maximise total return.",
    pitfalls: ["dp array must be initialised with 0 (taking no jobs) to correctly handle the base case.", "Binary search must find the latest end <= start of current job (use ends array with the job's start time)."],
  },
  {
    id: "intervals-31",
    title: "Set Intersection Size At Least Two",
    difficulty: "Hard",
    tags: ["Intervals", "Array", "Greedy", "Sorting"],
    statement: "Given a list of closed intervals, find the minimum-size set S such that |S ∩ interval[i]| >= 2 for every interval. Return the size of S.",
    examples: [
      { input: "intervals = [[1,3],[1,4],[2,5],[3,5]]", output: "3" },
      { input: "intervals = [[1,2],[2,3],[2,4],[4,5]]", output: "5" },
    ],
    intuition: "Sort by end time (ascending), breaking ties by start time descending. Greedily pick the two rightmost points of each interval (end-1 and end) and keep them if not already covered by at least two existing points.",
    approach: [
      "Sort by end ascending, then start descending.",
      "Maintain a set S.",
      "For each interval, count how many elements of S fall within it.",
      "If count < 2, add the missing number of points from the right end of the interval.",
    ],
    solution: `function intersectionSizeTwo(intervals) {
  intervals.sort((a, b) => a[1] !== b[1] ? a[1] - b[1] : b[0] - a[0]);
  const s = [];
  for (const [lo, hi] of intervals) {
    const cnt = s.filter(x => x >= lo && x <= hi).length;
    if (cnt === 0) { s.push(hi - 1); s.push(hi); }
    else if (cnt === 1) {
      const covered = s.find(x => x >= lo && x <= hi);
      s.push(covered === hi ? hi - 1 : hi);
    }
  }
  return s.length;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(n)" },
    systemDesign: "Set intersection coverage problems arise in distributed fault tolerance: ensuring that any node failure (interval of affected keys) still leaves at least two replicas accessible. The minimum coverage set maps directly to minimum replica placement across partitions.",
    pitfalls: ["Sort end ascending, start descending for ties — this ensures wider intervals are processed after narrower ones with the same end.", "Always prefer points at the right end of the interval to maximise coverage for future intervals."],
  },
  {
    id: "intervals-32",
    title: "Stabbing Number / Maximum Overlap Count",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Sweep Line"],
    statement: "Given an array of intervals, return the maximum number of intervals that overlap at any single point (the stabbing number of the interval set).",
    examples: [
      { input: "intervals = [[1,4],[2,5],[3,6]]", output: "3" },
      { input: "intervals = [[1,2],[3,4],[5,6]]", output: "1" },
    ],
    intuition: "Decompose each interval into a +1 event at its start and a -1 event just after its end. Sort events and compute the maximum running sum — the peak is the maximum overlap.",
    approach: [
      "For each [s, e], create events [s, +1] and [e, -1].",
      "Sort events: by time, with +1 before -1 at equal times (start before end).",
      "Sweep through computing running sum; track maximum.",
    ],
    solution: `function maxOverlap(intervals) {
  const events = [];
  for (const [s, e] of intervals) {
    events.push([s, 1]);
    events.push([e, -1]);
  }
  events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : b[1] - a[1]);
  let cur = 0, max = 0;
  for (const [, delta] of events) {
    cur += delta;
    max = Math.max(max, cur);
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "The stabbing number is the minimum number of servers required to handle peak concurrent requests. Cloud load balancers expose this metric as 'peak concurrent connections' and use it to configure auto-scaling policies, ensuring enough instances are running during peak overlap windows.",
    pitfalls: ["At equal timestamps, process start (+1) events before end (-1) events if the overlap check is inclusive (a point at the end of one and start of another counts as 2 simultaneous intervals).", "Adjust the ordering based on whether the intervals are open or closed at endpoints."],
  },
  {
    id: "intervals-33",
    title: "Range Module",
    difficulty: "Hard",
    tags: ["Intervals", "Design", "Segment Tree", "Sorting"],
    statement: "Implement a RangeModule that tracks ranges of numbers. Implement addRange(l, r) to track every real number in [l, r-1], removeRange(l, r) to stop tracking, and queryRange(l, r) to return true if every real number in [l, r-1] is tracked.",
    examples: [
      { input: "addRange(10,20), removeRange(14,16), queryRange(10,14), queryRange(13,15), queryRange(16,17)", output: "true, false, true" },
    ],
    intuition: "Maintain a sorted list of disjoint non-overlapping intervals representing tracked ranges. Each operation merges or splits intervals as needed — like maintaining a set of painted segments on a number line.",
    approach: [
      "Store sorted disjoint intervals.",
      "addRange: merge all intervals overlapping [l, r) into one.",
      "removeRange: split overlapping intervals, keeping non-overlapping tails.",
      "queryRange: check if a single interval [l, r) fully covers the query.",
    ],
    solution: `class RangeModule {
  constructor() { this.ranges = []; }
  addRange(l, r) {
    const res = [];
    let i = 0, newL = l, newR = r;
    while (i < this.ranges.length && this.ranges[i][1] < l) res.push(this.ranges[i++]);
    while (i < this.ranges.length && this.ranges[i][0] <= r) {
      newL = Math.min(newL, this.ranges[i][0]);
      newR = Math.max(newR, this.ranges[i][1]);
      i++;
    }
    res.push([newL, newR]);
    while (i < this.ranges.length) res.push(this.ranges[i++]);
    this.ranges = res;
  }
  removeRange(l, r) {
    const res = [];
    for (const [s, e] of this.ranges) {
      if (e <= l || s >= r) { res.push([s, e]); continue; }
      if (s < l) res.push([s, l]);
      if (e > r) res.push([r, e]);
    }
    this.ranges = res;
  }
  queryRange(l, r) {
    for (const [s, e] of this.ranges) {
      if (s <= l && e >= r) return true;
    }
    return false;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n) per operation", space: "O(n)" },
    systemDesign: "Range Module is a simplified interval tree — the data structure behind PostgreSQL range types (tsrange, int4range) used in temporal databases and scheduling systems. Segment trees with lazy propagation support all three operations in O(log n) and are used in real-time inventory and reservation systems.",
    pitfalls: ["addRange uses half-open intervals [l, r) — the merge condition is ranges[i][0] <= r (not < r).", "removeRange must handle partial overlaps on both sides by trimming the affected intervals."],
  },
  {
    id: "intervals-34",
    title: "Count Integers in Intervals",
    difficulty: "Hard",
    tags: ["Intervals", "Design", "Segment Tree", "Sorting"],
    statement: "Design a CountIntervals class that supports add(l, r) to add all integers in [l, r] to the set, and count() to return the number of integers in the set.",
    examples: [
      { input: "add(2,3), add(7,10), count(), add(5,8), count()", output: "6, 8" },
    ],
    intuition: "Maintain merged disjoint intervals; on each add, merge overlapping intervals and update a running total of covered integers — like painting segments on a ruler and tracking total painted length.",
    approach: [
      "Store sorted disjoint intervals and a running count.",
      "On add(l, r): find all intervals overlapping [l, r], subtract their lengths from count, merge them all into one new interval, add new merged length to count.",
      "count() returns the stored running total.",
    ],
    solution: `class CountIntervals {
  constructor() { this.intervals = []; this.total = 0; }
  add(l, r) {
    let newL = l, newR = r;
    const remaining = [];
    for (const [s, e] of this.intervals) {
      if (e < l || s > r) { remaining.push([s, e]); }
      else {
        this.total -= e - s + 1;
        newL = Math.min(newL, s);
        newR = Math.max(newR, e);
      }
    }
    remaining.push([newL, newR]);
    remaining.sort((a, b) => a[0] - b[0]);
    this.total += newR - newL + 1;
    this.intervals = remaining;
  }
  count() { return this.total; }
}`,
    language: "javascript",
    complexity: { time: "O(n) per add, O(1) count", space: "O(n)" },
    systemDesign: "Count Integers in Intervals models disk or memory allocation tracking where you need O(1) total-used-space queries. Database buffer pool managers track allocated byte ranges and maintain a running total to answer 'how much space is used' without iterating all extents on every query.",
    pitfalls: ["Subtract covered lengths before merging and add back the merged length — otherwise double-counting occurs.", "Keep the intervals list sorted after each add for correct overlap detection."],
  },
  {
    id: "intervals-35",
    title: "Minimum Interval to Include Each Query",
    difficulty: "Hard",
    tags: ["Intervals", "Array", "Sorting", "Heap", "Binary Search"],
    statement: "Given an array of intervals and queries, for each query find the size of the smallest interval containing that query point. Return -1 if no interval contains it.",
    examples: [
      { input: "intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]", output: "[3,3,1,4]" },
    ],
    intuition: "Sort queries and intervals by start. Use a min-heap of (size, end) for active intervals. For each query, add all intervals starting <= query into the heap, remove expired ones, and the heap min is the answer.",
    approach: [
      "Sort intervals by start, sort queries with original indices.",
      "Walk sorted queries; add intervals starting <= query to min-heap (keyed by size).",
      "Remove heap elements with end < query.",
      "Heap min gives smallest containing interval; record for original query index.",
    ],
    solution: `function minInterval(intervals, queries) {
  intervals.sort((a, b) => a[0] - b[0]);
  const sortedQ = queries.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
  const ans = new Array(queries.length).fill(-1);
  let i = 0;
  const heap = [];
  for (const [q, idx] of sortedQ) {
    while (i < intervals.length && intervals[i][0] <= q) {
      heap.push([intervals[i][1] - intervals[i][0] + 1, intervals[i][1]]);
      heap.sort((a, b) => a[0] - b[0]);
      i++;
    }
    while (heap.length && heap[0][1] < q) heap.shift();
    if (heap.length) ans[idx] = heap[0][0];
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O((n + m) log n)", space: "O(n + m)" },
    systemDesign: "Minimum-interval-for-query is the core of range index lookups in spatial databases: given a point query, find the tightest bounding box in the R-tree that contains it. Geospatial services use interval trees or segment trees for sub-millisecond containment queries over millions of geographic regions.",
    pitfalls: ["Remove expired intervals (end < query) lazily from the heap before reading the answer.", "Sort queries independently and map back to original indices for the final answer."],
  },
  {
    id: "intervals-36",
    title: "The Number of the Smallest Unoccupied Chair",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Heap", "Sorting"],
    statement: "n friends arrive at a party at times[i][0] and leave at times[i][1]. Chairs are numbered 0 to n-1. Each arriving friend takes the smallest-numbered free chair. Return the chair number that friend targetFriend sits in.",
    examples: [
      { input: "times = [[1,4],[2,3],[4,6]], targetFriend = 1", output: "1" },
      { input: "times = [[3,10],[1,5],[2,6]], targetFriend = 0", output: "2" },
    ],
    intuition: "Process arrivals in order. Use a min-heap for free chairs (initially 0..n-1) and a min-heap for occupied chairs with their leave times. When a friend arrives, free up any chairs whose occupants have left, then assign the smallest free chair.",
    approach: [
      "Sort friends by arrival time, keeping track of original indices.",
      "Min-heap of free chairs (numbers), min-heap of (leaveTime, chairNumber) for occupied.",
      "For each arrival: release chairs with leaveTime <= current arrival into free heap.",
      "Assign min free chair; stop if this friend is targetFriend.",
    ],
    solution: `function smallestChair(times, targetFriend) {
  const n = times.length;
  const order = Array.from({length: n}, (_, i) => i).sort((a, b) => times[a][0] - times[b][0]);
  const free = Array.from({length: n}, (_, i) => i);
  const occupied = [];
  for (const idx of order) {
    const [arrive, leave] = times[idx];
    const released = occupied.filter(([t]) => t <= arrive);
    released.forEach(([, c]) => { free.push(c); occupied.splice(occupied.findIndex(x => x[1] === c), 1); });
    free.sort((a, b) => a - b);
    const chair = free.shift();
    if (idx === targetFriend) return chair;
    occupied.push([leave, chair]);
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(n² log n)", space: "O(n)" },
    systemDesign: "Chair/resource assignment with intervals is used in database connection pool management: connections are pooled with IDs, and the smallest idle connection ID is assigned to the next request, minimising fragmentation. The same pattern appears in operating system process ID (PID) assignment — smallest available PID first.",
    pitfalls: ["Release chairs before assigning the new one — a friend leaving at time t frees the chair before a new friend arriving at t can take it.", "Use proper priority queues for O(n log n) performance; simulated heaps with sort are O(n²)."],
  },
  {
    id: "intervals-37",
    title: "Describe the Painting",
    difficulty: "Hard",
    tags: ["Intervals", "Array", "Sweep Line", "Prefix Sum"],
    statement: "Given a list of segments where segments[i] = [l, r, color], each segment paints [l, r) with the given color. Return a 2D array describing the resulting painting: each element is [left, right, mixedColor] where mixedColor is the XOR of all colors on that segment.",
    examples: [
      { input: "segments = [[1,4,5],[4,7,7],[1,7,3]]", output: "[[1,4,7],[4,7,4]]" },
    ],
    intuition: "Use a difference-map style sweep: at each start event add the color (XOR), at each end event remove it. Sort all unique endpoints, sweep between consecutive points, and record non-zero color segments.",
    approach: [
      "Build a map: at each start, XOR in the color; at each end, XOR out the color.",
      "Sort unique endpoints.",
      "Walk consecutive pairs maintaining a running XOR; if non-zero emit [left, right, color].",
    ],
    solution: `function splitPainting(segments) {
  const events = new Map();
  for (const [l, r, c] of segments) {
    events.set(l, (events.get(l) || 0) ^ c);
    events.set(r, (events.get(r) || 0) ^ c);
  }
  const keys = [...events.keys()].sort((a, b) => a - b);
  const res = [];
  let cur = 0;
  for (let i = 0; i < keys.length - 1; i++) {
    cur ^= events.get(keys[i]);
    if (cur !== 0) res.push([keys[i], keys[i + 1], cur]);
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Sweep-line painting with additive/XOR colors models how network traffic engineers compose overlapping QoS policies (each policy applies a bitmask) along a route: the effective policy at any link is the XOR/OR of all overlapping rules, computed efficiently with a coordinate-compressed sweep.",
    pitfalls: ["XOR is self-inverse: applying the same color twice cancels it out, correctly handling the 'paint then unpaint' at segment endpoints.", "The last key in the sorted list is only an end event — do not emit a segment starting there."],
  },
  {
    id: "intervals-38",
    title: "Two Best Non-Overlapping Events",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Dynamic Programming", "Binary Search"],
    statement: "Given events where events[i] = [startDay, endDay, value], choose at most two non-overlapping events to maximise the sum of values. Return the maximum value.",
    examples: [
      { input: "events = [[1,3,2],[4,5,2],[2,4,3]]", output: "4" },
      { input: "events = [[1,3,2],[4,5,2],[1,5,5]]", output: "5" },
    ],
    intuition: "Sort by end day. For each event, the best pair is this event plus the best single event ending before it starts. Precompute a prefix-max array of best values to answer this in O(log n) via binary search.",
    approach: [
      "Sort events by end time.",
      "Build prefixMax[i] = max value among events[0..i].",
      "For each event, binary search for the last event ending < this event's start.",
      "Answer = max over all events of (events[i].value + prefixMax[j]) and prefixMax[n-1].",
    ],
    solution: `function maxTwoEvents(events) {
  events.sort((a, b) => a[1] - b[1]);
  const n = events.length;
  const prefMax = new Array(n);
  prefMax[0] = events[0][2];
  for (let i = 1; i < n; i++) prefMax[i] = Math.max(prefMax[i - 1], events[i][2]);
  let ans = prefMax[n - 1];
  for (let i = 1; i < n; i++) {
    const s = events[i][0];
    let lo = 0, hi = i - 1, j = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (events[mid][1] < s) { j = mid; lo = mid + 1; } else hi = mid - 1;
    }
    if (j >= 0) ans = Math.max(ans, events[i][2] + prefMax[j]);
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Two non-overlapping event selection is a simplified version of the k=2 weighted interval scheduling problem, used in ad auction systems to select the two highest-value non-conflicting slots from a candidate list, maximising revenue per page view.",
    pitfalls: ["Binary search must find events ending strictly before (< not <=) the current event's start, since they must be non-overlapping.", "prefMax[j] gives the best event from index 0 to j — it must be precomputed before the main loop."],
  },
  {
    id: "intervals-39",
    title: "Merge Triplets to Form Target Triplet",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Greedy"],
    statement: "Given triplets where triplets[i] = [a,b,c] and target = [x,y,z], you can merge any two triplets by taking the element-wise max. Return true if the target triplet can be formed.",
    examples: [
      { input: "triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]", output: "true" },
      { input: "triplets = [[3,4,5],[4,5,6]], target = [3,2,5]", output: "false" },
    ],
    intuition: "A triplet is useful only if none of its values exceeds the corresponding target value (it would never 'over-contribute'). Among the useful triplets, check that the element-wise max covers the target exactly.",
    approach: [
      "Filter triplets where all values <= corresponding target values.",
      "Take element-wise max of remaining triplets.",
      "Return true if result equals target.",
    ],
    solution: `function mergeTriplets(triplets, target) {
  let res = [0, 0, 0];
  for (const t of triplets) {
    if (t[0] <= target[0] && t[1] <= target[1] && t[2] <= target[2]) {
      res[0] = Math.max(res[0], t[0]);
      res[1] = Math.max(res[1], t[1]);
      res[2] = Math.max(res[2], t[2]);
    }
  }
  return res[0] === target[0] && res[1] === target[1] && res[2] === target[2];
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Element-wise max merging models multi-dimensional version vector merging in distributed systems (Dynamo-style vector clocks): merging state from two replicas takes the element-wise maximum of their version vectors. The 'no component exceeds target' filter mirrors causality constraints in conflict-free replicated data types (CRDTs).",
    pitfalls: ["Triplets with any value exceeding the target must be excluded — merging them would irrecoverably raise that component above the target.", "All three components of res must exactly equal target for the answer to be true."],
  },
  {
    id: "intervals-40",
    title: "Interval Tree Range Query (Stabbing Query)",
    difficulty: "Hard",
    tags: ["Intervals", "Array", "Segment Tree", "Binary Search"],
    statement: "Given a list of intervals and a list of point queries, for each query return the count of intervals that contain the query point (i.e., start <= point <= end). Design a data structure for efficient repeated queries.",
    examples: [
      { input: "intervals = [[1,5],[2,8],[3,6]], queries = [3,7]", output: "[3,1]" },
    ],
    intuition: "Build a segment tree on coordinate-compressed endpoints. For each interval, mark its range; for each query, count marks at the point — or equivalently use sorted start/end arrays with two binary searches.",
    approach: [
      "Sort starts and ends arrays separately.",
      "For query q: count = (number of starts <= q) - (number of ends < q).",
      "Use binary search (upperBound on starts, lowerBound on ends).",
    ],
    solution: `function countIntervalContaining(intervals, queries) {
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
  function upperBound(arr, val) {
    let lo = 0, hi = arr.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (arr[mid] <= val) lo = mid + 1; else hi = mid; }
    return lo;
  }
  function lowerBound(arr, val) {
    let lo = 0, hi = arr.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (arr[mid] < val) lo = mid + 1; else hi = mid; }
    return lo;
  }
  return queries.map(q => upperBound(starts, q) - lowerBound(ends, q));
}`,
    language: "javascript",
    complexity: { time: "O(n log n + m log n)", space: "O(n)" },
    systemDesign: "Interval stabbing queries are the inner loop of geospatial index lookups (how many geographic regions contain this GPS coordinate?), database multi-version concurrency control (how many active transactions span this timestamp?), and network firewall rule matching (how many ACL rules cover this port range?).",
    pitfalls: ["Intervals whose end < query contribute 0 coverage — subtract lowerBound(ends, q) which counts ends strictly less than q.", "This sorted-arrays approach is O(log n) per query but only works for static interval sets; for dynamic sets use a segment tree."],
  },
  {
    id: "intervals-41",
    title: "Add Bold Tag in String",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "String", "Merge Intervals"],
    statement: "Given a string s and an array of strings words, add bold tags <b> and </b> around every substring of s that matches any word in words. Overlapping and adjacent matched regions should be merged into a single bold tag.",
    examples: [
      { input: "s = \"abcxyz123\", words = [\"abc\",\"123\"]", output: "\"<b>abc</b>xyz<b>123</b>\"" },
      { input: "s = \"aaabbb\", words = [\"aa\",\"b\"]", output: "\"<b>aaabbb</b>\"" },
    ],
    intuition: "Find all occurrence intervals for each word in s, merge the overlapping/adjacent intervals, then rebuild the string inserting bold tags at interval boundaries — standard interval merge applied to string index ranges.",
    approach: [
      "For each word, find all [start, start+len] occurrence intervals in s.",
      "Merge all intervals (sort by start, merge overlapping or adjacent).",
      "Reconstruct: copy s with <b>...</b> tags inserted at merged interval boundaries.",
    ],
    solution: `function addBoldTag(s, words) {
  const bold = new Array(s.length).fill(false);
  for (const w of words) {
    let idx = s.indexOf(w);
    while (idx !== -1) {
      for (let k = idx; k < idx + w.length; k++) bold[k] = true;
      idx = s.indexOf(w, idx + 1);
    }
  }
  let res = "";
  for (let i = 0; i < s.length; ) {
    if (!bold[i]) { res += s[i++]; }
    else {
      let j = i;
      while (j < s.length && bold[j]) j++;
      res += "<b>" + s.slice(i, j) + "</b>";
      i = j;
    }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n * m * L)", space: "O(n)" },
    systemDesign: "Bold-tag insertion is a text annotation pipeline step used in search engines to highlight query terms in snippets. The merge-intervals approach on character index ranges is also used in syntax highlighters and diff viewers that must merge overlapping highlight regions from multiple passes.",
    pitfalls: ["Use a boolean mask array to mark bold positions — it handles overlapping matches naturally without needing explicit interval merging.", "Adjacent bold regions (no gap between them) should be merged into one tag."],
  },
  {
    id: "intervals-42",
    title: "Number of Visible People in a Queue",
    difficulty: "Hard",
    tags: ["Intervals", "Array", "Stack", "Monotonic Stack"],
    statement: "Given an array heights representing people in a queue, person i can see person j (j > i) if every person k with i < k < j has height < min(heights[i], heights[j]). Return an array where answer[i] is the number of people person i can see.",
    examples: [
      { input: "heights = [10,6,8,5,11,9]", output: "[3,1,2,1,1,0]" },
    ],
    intuition: "Use a decreasing monotonic stack. For each person, pop shorter people from the stack (they are fully visible from the current person), then peek at the remaining taller person if any.",
    approach: [
      "Iterate right to left with a monotonic decreasing stack.",
      "For each person i: while stack top < heights[i], pop (count as visible) and increment count.",
      "If stack still non-empty after popping, that remaining person is also visible (increment count).",
      "Push heights[i] to stack.",
    ],
    solution: `function canSeePersonsCount(heights) {
  const n = heights.length;
  const res = new Array(n).fill(0);
  const stack = [];
  for (let i = n - 1; i >= 0; i--) {
    let count = 0;
    while (stack.length && stack[stack.length - 1] < heights[i]) {
      stack.pop();
      count++;
    }
    if (stack.length) count++;
    res[i] = count;
    stack.push(heights[i]);
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Visibility counting with monotonic stacks models line-of-sight problems in geographic information systems (how many buildings are visible from each building along a street) and in network broadcast reach analysis (how many nodes can receive a signal without obstruction). Stock ticker 'next greater element' queries use the same stack.",
    pitfalls: ["Count each popped element (shorter, directly visible) plus one more if the stack is non-empty (the first taller person blocking further view).", "Iterate right to left so when processing person i, all persons to the right are already in the stack."],
  },
  {
    id: "intervals-43",
    title: "Largest Merge of Two Strings",
    difficulty: "Medium",
    tags: ["Intervals", "String", "Greedy", "Two Pointers"],
    statement: "Given two strings word1 and word2, construct the lexicographically largest merge by repeatedly picking the larger first character (comparing the remaining suffixes) from either string until both are empty.",
    examples: [
      { input: "word1 = \"cabaa\", word2 = \"bcaaa\"", output: "\"cbcabaaaaa\"" },
      { input: "word1 = \"abcabc\", word2 = \"abdcaba\"", output: "\"abdcabcabcaba\"" },
    ],
    intuition: "At each step, greedily take from the string whose remaining portion is lexicographically larger — this guarantees the largest possible merged result.",
    approach: [
      "Use two pointers i, j into word1 and word2.",
      "At each step compare word1.slice(i) vs word2.slice(j).",
      "Append the first character of the larger string and advance its pointer.",
      "Append the remaining non-empty string.",
    ],
    solution: `function largestMerge(word1, word2) {
  let i = 0, j = 0, res = "";
  while (i < word1.length && j < word2.length) {
    if (word1.slice(i) >= word2.slice(j)) res += word1[i++];
    else res += word2[j++];
  }
  return res + word1.slice(i) + word2.slice(j);
}`,
    language: "javascript",
    complexity: { time: "O((m+n)²)", space: "O(m+n)" },
    systemDesign: "Lexicographically optimal merge is used in distributed sorting when merging sorted string segments from multiple workers — picking the globally largest key first ensures the output is in correct descending order. Version string comparison in package managers (semver) uses the same suffix-comparison greedy.",
    pitfalls: ["Compare full remaining suffixes (not just the first character) to handle ties correctly.", "Using slice for comparison is O(n) per step; for large inputs use suffix arrays for O(n log n) preprocessing with O(1) comparison."],
  },
  {
    id: "intervals-44",
    title: "Meeting Scheduler",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Two Pointers", "Sorting"],
    statement: "Given two lists of availability slots slots1 and slots2 and a duration, find the earliest time slot that works for both parties for a meeting of duration minutes. Return [] if no common slot exists.",
    examples: [
      { input: "slots1 = [[10,50],[60,120],[140,210]], slots2 = [[0,15],[60,70]], duration = 8", output: "[60,68]" },
    ],
    intuition: "Sort both slot lists, then use two pointers to find overlapping slots. Within each overlap, check if it is long enough for the meeting — return the earliest qualifying slot.",
    approach: [
      "Sort both lists by start time.",
      "Use two pointers i, j.",
      "At each step compute overlap = [max(s1,s2), min(e1,e2)].",
      "If overlap length >= duration, return [max(s1,s2), max(s1,s2)+duration].",
      "Advance the pointer whose slot ends first.",
    ],
    solution: `function minAvailableDuration(slots1, slots2, duration) {
  slots1.sort((a, b) => a[0] - b[0]);
  slots2.sort((a, b) => a[0] - b[0]);
  let i = 0, j = 0;
  while (i < slots1.length && j < slots2.length) {
    const lo = Math.max(slots1[i][0], slots2[j][0]);
    const hi = Math.min(slots1[i][1], slots2[j][1]);
    if (hi - lo >= duration) return [lo, lo + duration];
    if (slots1[i][1] < slots2[j][1]) i++; else j++;
  }
  return [];
}`,
    language: "javascript",
    complexity: { time: "O(m log m + n log n)", space: "O(1)" },
    systemDesign: "Meeting Scheduler is the algorithm behind calendar booking assistants that find the earliest mutual availability. Enterprise scheduling systems (Google Calendar's 'Find a time' feature, Microsoft Bookings) run this two-pointer merge over multiple attendees' sorted free-busy lists to find the first qualifying common slot.",
    pitfalls: ["Advance the pointer with the earlier end — its slot can no longer contribute to future overlaps.", "Check overlap length >= duration, not just > duration."],
  },
  {
    id: "intervals-45",
    title: "Partition Labels",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Greedy", "String"],
    statement: "Given a string s, partition it into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the size of each part.",
    examples: [
      { input: "s = \"ababcbacadefegdehijhklij\"", output: "[9,7,8]" },
      { input: "s = \"eccbbbbdec\"", output: "[10]" },
    ],
    intuition: "For each character, record its last occurrence index. Sweep through the string expanding the current partition's end to the furthest last-occurrence seen so far. When you reach the end of the partition, close it.",
    approach: [
      "Build lastOccurrence map for each character.",
      "Walk with start and end pointer.",
      "At each position update end = max(end, lastOccurrence[s[i]]).",
      "When i == end, close partition (add i - start + 1 to result), set start = i + 1.",
    ],
    solution: `function partitionLabels(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) last[s[i]] = i;
  const res = [];
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]);
    if (i === end) { res.push(end - start + 1); start = i + 1; }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Partition Labels is structurally identical to Merge Intervals: each character's occurrence range [first, last] is an interval and we merge them. This models database table partitioning strategies where related keys (same character = same entity type) should reside in the same shard to minimise cross-shard queries.",
    pitfalls: ["The end pointer must be updated for every character in the current partition, not just new characters.", "A single character appearing only once is its own partition of size 1 if no other character's range overlaps it."],
  },
  {
    id: "intervals-46",
    title: "Maximum Length of Pair Chain",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Greedy", "Dynamic Programming"],
    statement: "Given n pairs where pairs[i] = [left, right], chain two pairs [a,b] and [c,d] if b < c. Find the length of the longest chain that can be formed.",
    examples: [
      { input: "pairs = [[1,2],[2,3],[3,4]]", output: "2" },
      { input: "pairs = [[1,2],[7,8],[4,5]]", output: "3" },
    ],
    intuition: "Sort by end value; greedily pick each pair that starts after the current chain's end — exactly the activity selection problem, which maximises the count of non-overlapping intervals.",
    approach: [
      "Sort pairs by end value.",
      "Track curEnd = -Infinity, count = 0.",
      "For each pair: if pair[0] > curEnd, take it (count++, curEnd = pair[1]).",
    ],
    solution: `function findLongestChain(pairs) {
  pairs.sort((a, b) => a[1] - b[1]);
  let count = 0, curEnd = -Infinity;
  for (const [l, r] of pairs) {
    if (l > curEnd) { count++; curEnd = r; }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(1)" },
    systemDesign: "Maximum pair chain is the classical activity selection problem — the greedy basis for scheduling independent jobs on a single machine to maximise throughput. It also models API call chain optimisation: select the longest chain of sequential API calls where each step returns before the next begins.",
    pitfalls: ["The chaining condition is strict: b < c (not <=). Sort by end, not start.", "DP also works in O(n²) but the greedy O(n log n) is optimal."],
  },
  {
    id: "intervals-47",
    title: "Odd Even Jump",
    difficulty: "Hard",
    tags: ["Intervals", "Array", "Monotonic Stack", "Dynamic Programming"],
    statement: "You start at any index in array arr and can jump from index i to the smallest value >= arr[i] at index > i on odd jumps, or the largest value <= arr[i] at index > i on even jumps. Return the number of starting indices from which you can reach the last index.",
    examples: [
      { input: "arr = [10,13,12,14,15]", output: "2" },
      { input: "arr = [2,3,1,1,4]", output: "3" },
    ],
    intuition: "For each index precompute where an odd jump and an even jump would take you (next greater/smaller to the right). Then DP backwards: canReach[i] = true if both jump targets eventually reach the end.",
    approach: [
      "Build oddNext[i] = next index with smallest value >= arr[i] (using monotonic stack on sorted order).",
      "Build evenNext[i] = next index with largest value <= arr[i].",
      "DP: oddOk[n-1] = evenOk[n-1] = true. For i from n-2: oddOk[i] = evenOk[oddNext[i]], evenOk[i] = oddOk[evenNext[i]].",
      "Count indices where oddOk[i] = true.",
    ],
    solution: `function oddEvenJumps(arr) {
  const n = arr.length;
  const makeNext = (indices) => {
    const res = new Array(n).fill(-1);
    const stack = [];
    for (const i of indices) {
      while (stack.length && stack[stack.length - 1] < i) res[stack.pop()] = i;
      stack.push(i);
    }
    return res;
  };
  const oddNext = makeNext([...arr.keys()].sort((a, b) => arr[a] !== arr[b] ? arr[a] - arr[b] : a - b));
  const evenNext = makeNext([...arr.keys()].sort((a, b) => arr[a] !== arr[b] ? arr[b] - arr[a] : a - b));
  const oddOk = new Array(n).fill(false), evenOk = new Array(n).fill(false);
  oddOk[n - 1] = evenOk[n - 1] = true;
  for (let i = n - 2; i >= 0; i--) {
    if (oddNext[i] !== -1) oddOk[i] = evenOk[oddNext[i]];
    if (evenNext[i] !== -1) evenOk[i] = oddOk[evenNext[i]];
  }
  return oddOk.filter(Boolean).length;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Jump-target precomputation via monotonic stacks models order-routing in financial exchanges: for each incoming order, precompute the next matching ask/bid price in O(n log n) using a sorted order book scan, enabling O(1) matching lookups during trading hours.",
    pitfalls: ["The makeNext helper uses a monotonic stack on a sorted index permutation — sort indices by value (ascending for odd, descending for even) and use a stack to find the next index in that order.", "Tie-breaking: for equal values, prefer smaller index (the jump goes to the leftmost qualifying index)."],
  },
  {
    id: "intervals-48",
    title: "Flower Planting With No Adjacent",
    difficulty: "Medium",
    tags: ["Intervals", "Array", "Graph", "Greedy"],
    statement: "Given n gardens and a list of paths between them, assign one of 4 flower types to each garden such that no two adjacent gardens have the same type. Return the assignment (guaranteed to have a solution since max degree is 3).",
    examples: [
      { input: "n = 3, paths = [[1,2],[2,3],[3,1]]", output: "[1,2,3]" },
      { input: "n = 4, paths = [[1,2],[3,4]]", output: "[1,2,1,2]" },
    ],
    intuition: "For each garden, look at its neighbours' assigned flowers and pick any type not already used by them — since max degree is 3 and we have 4 types, at least one type is always free.",
    approach: [
      "Build adjacency list.",
      "For each garden 1..n, collect flowers used by already-assigned neighbours.",
      "Pick the first flower type (1..4) not in that set.",
    ],
    solution: `function gardenNoAdj(n, paths) {
  const adj = Array.from({length: n + 1}, () => []);
  for (const [a, b] of paths) { adj[a].push(b); adj[b].push(a); }
  const res = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const used = new Set(adj[i].map(j => res[j]));
    for (let f = 1; f <= 4; f++) {
      if (!used.has(f)) { res[i] = f; break; }
    }
  }
  return res.slice(1);
}`,
    language: "javascript",
    complexity: { time: "O(n + e)", space: "O(n + e)" },
    systemDesign: "Graph coloring with k colors models frequency assignment in cellular networks (assign frequencies to cell towers so no two adjacent towers interfere), channel assignment in WiFi deployments, and register allocation in compilers where adjacent live ranges must use different registers.",
    pitfalls: ["Process gardens in order 1..n; each garden's neighbours that have already been assigned constrain the color choice.", "With max degree 3 and 4 colors, a greedy coloring always succeeds — no backtracking needed."],
  },
  {
    id: "intervals-49",
    title: "Interval Scheduling Maximization (Weighted)",
    difficulty: "Hard",
    tags: ["Intervals", "Array", "Dynamic Programming", "Binary Search"],
    statement: "Given jobs with start, end, and profit, and a constraint that at most one job can run at a time, return the maximum profit achievable. (Alias: Weighted Job Scheduling — the canonical DP version with all jobs having distinct weights.)",
    examples: [
      { input: "jobs = [[1,3,50],[3,5,20],[0,6,100],[5,9,200],[8,9,20],[9,12,150],[10,11,30],[11,14,40]], k = Infinity", output: "250" },
    ],
    intuition: "Sort by end time. For each job, you either skip it (best profit without it) or take it (its profit plus best profit from all jobs ending at or before its start). Binary search finds that last compatible job.",
    approach: [
      "Sort jobs by end time.",
      "Build dp array where dp[i] = max profit using first i jobs.",
      "For job i: binary search for largest j with jobs[j].end <= jobs[i].start.",
      "dp[i] = max(dp[i-1], jobs[i].profit + dp[j]).",
    ],
    solution: `function weightedJobScheduling(jobs) {
  jobs.sort((a, b) => a[1] - b[1]);
  const n = jobs.length;
  const dp = [0];
  const ends = [0];
  for (const [s, e, p] of jobs) {
    let lo = 0, hi = dp.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (ends[mid] <= s) lo = mid; else hi = mid - 1; }
    dp.push(Math.max(dp[dp.length - 1], dp[lo] + p));
    ends.push(e);
  }
  return dp[dp.length - 1];
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Weighted interval scheduling DP is the theoretical foundation for revenue-optimal slot auctioning in advertising systems, cloud spot-instance bidding, and financial option exercise scheduling. Any system that must select a maximum-value non-overlapping subset of time-ranged resources uses this algorithm.",
    pitfalls: ["dp must be initialised with [0] (and ends with [0]) to represent the base case of taking 0 jobs.", "Binary search finds the last end <= start of current job — use <=, not <, so you can chain directly adjacent jobs."],
  },
  {
    id: "intervals-50",
    title: "Segment Tree Range Sum with Point Updates",
    difficulty: "Hard",
    tags: ["Intervals", "Segment Tree", "Binary Indexed Tree", "Design"],
    statement: "Design a data structure that supports: update(i, val) to set the value at index i to val, and sumRange(l, r) to return the sum of all elements between l and r inclusive. Both operations must run in O(log n).",
    examples: [
      { input: "init [1,3,5], sumRange(0,2), update(1,2), sumRange(0,2)", output: "9, 8" },
    ],
    intuition: "A segment tree divides the array into halves recursively, storing the sum of each range. Point updates propagate up in O(log n); range queries combine at most O(log n) nodes.",
    approach: [
      "Build the tree with 2n nodes (1-indexed, root at 1).",
      "Leaves at indices n..2n-1 store the array values.",
      "Update: set leaf, then propagate sums up to root.",
      "Query: walk up from both ends of [l, r] collecting sums.",
    ],
    solution: `class NumArray {
  constructor(nums) {
    const n = this.n = nums.length;
    this.tree = new Array(2 * n).fill(0);
    for (let i = 0; i < n; i++) this.tree[n + i] = nums[i];
    for (let i = n - 1; i >= 1; i--) this.tree[i] = this.tree[2 * i] + this.tree[2 * i + 1];
  }
  update(i, val) {
    let pos = i + this.n;
    this.tree[pos] = val;
    for (pos >>= 1; pos >= 1; pos >>= 1) this.tree[pos] = this.tree[2 * pos] + this.tree[2 * pos + 1];
  }
  sumRange(l, r) {
    let res = 0;
    for (l += this.n, r += this.n + 1; l < r; l >>= 1, r >>= 1) {
      if (l & 1) res += this.tree[l++];
      if (r & 1) res += this.tree[--r];
    }
    return res;
  }
}`,
    language: "javascript",
    complexity: { time: "O(log n) per update and query", space: "O(n)" },
    systemDesign: "Segment trees are the backbone of range-query systems in production: time-series databases (InfluxDB, TimescaleDB) use segment-tree-like structures for O(log n) range aggregations; financial trading systems use them for O(log n) order book range queries; and game servers use interval trees for O(log n) collision detection. The iterative bottom-up segment tree is preferred for cache efficiency.",
    pitfalls: ["The iterative segment tree uses 1-indexed nodes with leaves at positions n..2n-1 — off-by-one errors are common when translating from recursive versions.", "Update must propagate all the way to the root (pos >>= 1 until pos >= 1, not just while pos > 1)."],
  },
];
