import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  // ---- EASY (17 problems) ----
  {
    id: "stack-01",
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    statement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if every open bracket is closed by the same type of bracket in the correct order.",
    examples: [
      { input: "s = \"()[]{}\"", output: "true" },
      { input: "s = \"(]\"", output: "false" },
      { input: "s = \"([)]\"", output: "false", explanation: "Brackets interleave incorrectly." },
    ],
    intuition: "Think of a stack of plates: every time you see an open bracket, put it on top. When you see a closing bracket, check if the top plate matches. If it does not, the string is invalid.",
    approach: [
      "Create an empty stack and a map of closing->opening brackets.",
      "For each character: if it is an opening bracket, push it.",
      "If it is a closing bracket, check that the top of the stack is the matching opener. If not, return false.",
      "After the loop, return true only if the stack is empty.",
    ],
    solution: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if (!map[c]) {
      stack.push(c);
    } else {
      if (stack.pop() !== map[c]) return false;
    }
  }
  return stack.length === 0;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Compiler front-ends and SQL parsers use a stack to validate nested bracket structures before building an AST. XML/HTML parsers at scale (e.g. Nginx config parser, Kubernetes YAML validator) rely on the same open/close matching to reject malformed configs early, preventing expensive downstream failures.",
    pitfalls: ["An unmatched opener left on the stack means the string is invalid — check stack.length === 0.", "pop() on an empty stack returns undefined, which will not equal any opener, so the false branch fires correctly."],
  },
  {
    id: "stack-02",
    title: "Min Stack",
    difficulty: "Easy",
    tags: ["Stack", "Design"],
    statement: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack class with push(val), pop(), top(), and getMin().",
    examples: [
      { input: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()", output: "-3, 0, -2", explanation: "getMin() after push(-3) is -3; after pop() top is 0 and min is -2." },
    ],
    intuition: "Keep a second stack that only tracks the minimum so far. Whenever you push onto the main stack, also push the current minimum onto the min-stack.",
    approach: [
      "Maintain two stacks: stack and minStack.",
      "On push(val): push val to stack; push Math.min(val, minStack top) to minStack.",
      "On pop(): pop from both stacks.",
      "top() returns stack top; getMin() returns minStack top.",
    ],
    solution: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);
    const curMin = this.minStack.length === 0 ? val : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(curMin);
  }
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) all ops", space: "O(n)" },
    systemDesign: "Min-tracking stacks mirror undo/redo systems that must restore both the data and metadata (e.g. cursor position, selection state) with every undo. Database transaction logs store both the new value and a before-image so rollback can restore the previous minimum/maximum aggregate without a full table scan.",
    pitfalls: ["Push the min BEFORE the value check fails if the stack is empty — handle the empty case.", "Do not just store the global min; it would be wrong after popping the current minimum."],
  },
  {
    id: "stack-03",
    title: "Baseball Game",
    difficulty: "Easy",
    tags: ["Stack", "Simulation"],
    statement: "You are keeping score for a baseball game with special operations: an integer adds that score, '+' adds the sum of the previous two scores, 'D' doubles the previous score, 'C' removes the previous score. Return the sum of all scores on the record after all operations.",
    examples: [
      { input: "ops = [\"5\",\"2\",\"C\",\"D\",\"+\"]", output: "30", explanation: "5, 2 -> remove 2 -> double 5=10 -> 5+10=15. Sum=30." },
      { input: "ops = [\"5\",\"-2\",\"4\",\"C\",\"D\",\"9\",\"+\",\"+\"]", output: "27" },
    ],
    intuition: "A stack is perfect here because every operation only needs to look at the top one or two scores, and 'C' just removes the top.",
    approach: [
      "Maintain a stack.",
      "For each op: if integer push it; if 'C' pop; if 'D' push 2 * top; if '+' push sum of top two.",
      "Return the sum of all elements in the stack.",
    ],
    solution: `function calPoints(ops) {
  const stack = [];
  for (const op of ops) {
    if (op === 'C') {
      stack.pop();
    } else if (op === 'D') {
      stack.push(stack[stack.length - 1] * 2);
    } else if (op === '+') {
      stack.push(stack[stack.length - 1] + stack[stack.length - 2]);
    } else {
      stack.push(Number(op));
    }
  }
  return stack.reduce((a, b) => a + b, 0);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Event-sourced ledgers in financial systems use append-only logs with compensating events (like 'C' for cancel) — the current balance is a fold over the event log, exactly as the stack fold gives the final score. This pattern appears in CQRS architectures where the read model is rebuilt by replaying events.",
    pitfalls: ["'+' needs the top two elements — ensure the stack has at least two before accessing.", "Convert string integers with Number() or parseInt(); comparing '5' === 5 is false in JS."],
  },
  {
    id: "stack-04",
    title: "Remove All Adjacent Duplicates In String",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    statement: "Given a string s, repeatedly remove all adjacent duplicate characters until no adjacent duplicates remain. Return the final string.",
    examples: [
      { input: "s = \"abbaca\"", output: "\"ca\"", explanation: "Remove bb -> 'aaca', remove aa -> 'ca'." },
      { input: "s = \"azxxzy\"", output: "\"ay\"" },
    ],
    intuition: "Use a stack like a smart eraser: push each character, but if the top of the stack is the same character, erase both (pop instead of push).",
    approach: [
      "Maintain a stack.",
      "For each character c: if stack top equals c, pop; otherwise push c.",
      "Join the stack into a string and return.",
    ],
    solution: `function removeDuplicates(s) {
  const stack = [];
  for (const c of s) {
    if (stack.length && stack[stack.length - 1] === c) {
      stack.pop();
    } else {
      stack.push(c);
    }
  }
  return stack.join('');
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Adjacent-duplicate removal is used in log compaction (Kafka log compaction removes superseded key-value pairs) and in DNS response deduplication. Undo-log compaction in databases merges adjacent updates to the same row into a single before-image to reduce redo-log I/O during recovery.",
    pitfalls: ["Each character is pushed or popped at most once, so the algorithm is O(n) despite looking like repeated passes.", "The result can be empty if all characters cancel out — returning an empty string is correct."],
  },
  {
    id: "stack-05",
    title: "Backspace String Compare",
    difficulty: "Easy",
    tags: ["Stack", "Two Pointers", "String"],
    statement: "Given two strings s and t, return true if they are equal when both are typed into empty text editors where '#' means a backspace character.",
    examples: [
      { input: "s = \"ab#c\", t = \"ad#c\"", output: "true", explanation: "Both become 'ac'." },
      { input: "s = \"ab##\", t = \"c#d#\"", output: "true", explanation: "Both become ''." },
    ],
    intuition: "Simulate typing with a stack: push normal characters, pop on '#'. Compare the resulting stacks.",
    approach: [
      "Write a helper build(str) that returns the final string after processing backspaces using a stack.",
      "Return build(s) === build(t).",
    ],
    solution: `function backspaceCompare(s, t) {
  function build(str) {
    const stack = [];
    for (const c of str) {
      if (c === '#') stack.pop();
      else stack.push(c);
    }
    return stack.join('');
  }
  return build(s) === build(t);
}`,
    language: "javascript",
    complexity: { time: "O(n+m)", space: "O(n+m)" },
    systemDesign: "Backspace simulation mirrors terminal line-discipline processing (tty erase characters) and text-editor buffer management. In collaborative editors (Google Docs / OT), operational transformation must correctly apply delete operations in order, analogous to popping from a stack when a backspace arrives.",
    pitfalls: ["Backspace on an empty stack is a no-op — pop() on an empty array in JS just returns undefined safely.", "O(1) space is achievable with a two-pointer approach scanning from the right."],
  },
  {
    id: "stack-06",
    title: "Implement Queue using Stacks",
    difficulty: "Easy",
    tags: ["Stack", "Queue", "Design"],
    statement: "Implement a first-in first-out (FIFO) queue using two stacks. Implement push(x), pop(), peek(), and empty().",
    examples: [
      { input: "push(1), push(2), peek(), pop(), empty()", output: "1, 1, false" },
    ],
    intuition: "Use one stack as the inbox and one as the outbox. When the outbox is empty and you need to pop, pour everything from the inbox into the outbox — this reverses the order, making the oldest item accessible.",
    approach: [
      "Maintain inbox and outbox stacks.",
      "push(x): push to inbox.",
      "pop()/peek(): if outbox is empty, move all of inbox into outbox. Then pop/peek outbox.",
      "empty(): both stacks are empty.",
    ],
    solution: `class MyQueue {
  constructor() {
    this.inbox = [];
    this.outbox = [];
  }
  push(x) {
    this.inbox.push(x);
  }
  _transfer() {
    if (!this.outbox.length) {
      while (this.inbox.length) this.outbox.push(this.inbox.pop());
    }
  }
  pop() {
    this._transfer();
    return this.outbox.pop();
  }
  peek() {
    this._transfer();
    return this.outbox[this.outbox.length - 1];
  }
  empty() {
    return !this.inbox.length && !this.outbox.length;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) amortized", space: "O(n)" },
    systemDesign: "The two-stack queue is used in lock-free queue implementations where one stack handles producers and the other handles consumers, reducing contention. Message brokers like SQS separate the write path (inbox) from the read path (outbox) in a similar dual-buffer pattern to maximise throughput.",
    pitfalls: ["Transfer only when outbox is empty, otherwise you violate FIFO order.", "Each element crosses from inbox to outbox exactly once, giving O(1) amortized cost."],
  },
  {
    id: "stack-07",
    title: "Implement Stack using Queues",
    difficulty: "Easy",
    tags: ["Stack", "Queue", "Design"],
    statement: "Implement a last-in first-out (LIFO) stack using only one queue. Implement push(x), pop(), top(), and empty().",
    examples: [
      { input: "push(1), push(2), top(), pop(), empty()", output: "2, 2, false" },
    ],
    intuition: "After pushing a new element, rotate the entire queue so the new element is at the front. The queue now behaves like a stack — the front is always the most recently pushed element.",
    approach: [
      "Use a single queue.",
      "On push(x): enqueue x, then rotate all previous elements to the back (dequeue and re-enqueue n-1 times).",
      "pop(): dequeue from front.",
      "top(): peek front.",
    ],
    solution: `class MyStack {
  constructor() {
    this.queue = [];
  }
  push(x) {
    this.queue.push(x);
    for (let i = 0; i < this.queue.length - 1; i++) {
      this.queue.push(this.queue.shift());
    }
  }
  pop() {
    return this.queue.shift();
  }
  top() {
    return this.queue[0];
  }
  empty() {
    return this.queue.length === 0;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n) push, O(1) pop/top", space: "O(n)" },
    systemDesign: "Understanding queue/stack duality is important when designing work-stealing deques in task schedulers (Java ForkJoinPool). Workers process tasks LIFO locally (stack-like) for cache locality but steal FIFO from the other end (queue-like) to balance load — a bidirectional deque combining both abstractions.",
    pitfalls: ["Rotate n-1 times, not n — the new element itself should end up at front.", "Array.shift() is O(n); in production use a linked-list deque for O(1) operations."],
  },
  {
    id: "stack-08",
    title: "Make The String Great",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    statement: "Given a string s of lower and upper case English letters, repeatedly remove any adjacent pair where one letter is the upper-case version of the other (e.g. 'aA' or 'Aa'). Return the resulting string after all such removals.",
    examples: [
      { input: "s = \"leEeetcode\"", output: "\"leetcode\"" },
      { input: "s = \"abBAcC\"", output: "\"\"" },
    ],
    intuition: "Same as adjacent-duplicate removal but the 'pair' condition is one lowercase and one uppercase of the same letter. Use a stack and pop when the new character cancels the top.",
    approach: [
      "Maintain a stack.",
      "For each character c: check if the stack top is the same letter but different case.",
      "If yes, pop (they cancel). If no, push c.",
      "Return the stack joined as a string.",
    ],
    solution: `function makeGood(s) {
  const stack = [];
  for (const c of s) {
    const top = stack[stack.length - 1];
    if (top && top !== c && top.toLowerCase() === c.toLowerCase()) {
      stack.pop();
    } else {
      stack.push(c);
    }
  }
  return stack.join('');
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Case-sensitive token cancellation appears in markup sanitizers that strip matching open/close HTML tags and in diff engines that cancel equal but opposite edits. CRDT merge operations in collaborative editing similarly cancel inverse operations to reach a clean final state.",
    pitfalls: ["top !== c ensures we only cancel when case differs (not the same character).", "top.toLowerCase() === c.toLowerCase() confirms it is the same letter regardless of case."],
  },
  {
    id: "stack-09",
    title: "Crawler Log Folder",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    statement: "Given a list of file system operations ('x/' moves into folder x, '../' moves to parent, './' stays), return the minimum number of operations needed to go back to the main folder from the final position.",
    examples: [
      { input: "logs = [\"d1/\",\"d2/\",\"../\",\"d21/\",\"./\"]", output: "2" },
      { input: "logs = [\"d1/\",\"d2/\",\"./\",\"d3/\",\"../\",\"d31/\"]", output: "3" },
    ],
    intuition: "Track depth as a counter. Going into a folder increments depth; '../' decrements it (minimum 0); './' does nothing. The answer is the final depth.",
    approach: [
      "Initialize depth = 0.",
      "For each log: if '../' decrement depth (min 0); if './' do nothing; else increment depth.",
      "Return depth.",
    ],
    solution: `function minOperations(logs) {
  let depth = 0;
  for (const log of logs) {
    if (log === '../') depth = Math.max(0, depth - 1);
    else if (log !== './') depth++;
  }
  return depth;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Directory-depth tracking is the core of virtual file system (VFS) path resolution in operating systems and container runtimes (chroot jails). Cloud storage path normalisation (e.g. resolving '../' in S3 key prefixes) uses the same depth counter to prevent path-traversal security vulnerabilities.",
    pitfalls: ["Never allow depth to go below 0 — you cannot go above the root.", "The './' operation is a no-op, not an increment."],
  },
  {
    id: "stack-10",
    title: "Build an Array With Stack Operations",
    difficulty: "Easy",
    tags: ["Stack", "Simulation"],
    statement: "Given a target array and an integer n, using a stream of integers 1 to n, return the stack operations ('Push' and 'Pop') to build target. You may push integers in order; if the integer is not in target, push then pop it.",
    examples: [
      { input: "target = [1,3], n = 3", output: "[\"Push\",\"Push\",\"Pop\",\"Push\"]", explanation: "Push 1 (keep), push 2 pop 2 (skip), push 3 (keep)." },
      { input: "target = [1,2,3], n = 3", output: "[\"Push\",\"Push\",\"Push\"]" },
    ],
    intuition: "Walk through integers 1..n with a pointer into target. If the current integer matches the next target element, just Push. If not, Push then Pop (use and discard). Stop once target is fully built.",
    approach: [
      "Use a set for quick target lookup.",
      "Iterate i from 1 to n.",
      "For each i, always push 'Push'.",
      "If i is not in target set, also push 'Pop'.",
      "Stop when all target elements are matched.",
    ],
    solution: `function buildArray(target, n) {
  const ops = [];
  const set = new Set(target);
  let idx = 0;
  for (let i = 1; i <= n && idx < target.length; i++) {
    ops.push('Push');
    if (set.has(i)) {
      idx++;
    } else {
      ops.push('Pop');
    }
  }
  return ops;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(target.length)" },
    systemDesign: "This models selective ingestion pipelines where a stream of events is consumed and only matching events are retained (e.g. CDC streams where only certain table mutations are forwarded to downstream consumers). Kafka consumer groups similarly push all messages but filter using a predicate, discarding unwanted events.",
    pitfalls: ["Stop as soon as all target elements are found — no need to process further stream elements.", "Using a set for target lookup avoids O(target) scan per element."],
  },
  {
    id: "stack-11",
    title: "Removing Stars From a String",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    statement: "You are given a string s containing stars '*'. In one operation, choose a star and remove the closest non-star character to its left and the star itself. Return the resulting string after all stars have been removed.",
    examples: [
      { input: "s = \"leet**cod*e\"", output: "\"lecoe\"" },
      { input: "s = \"erase*****\"", output: "\"\"" },
    ],
    intuition: "A stack naturally represents the characters to the left of the current position. When you encounter a star, pop the top (removing the closest non-star to the left).",
    approach: [
      "Maintain a stack.",
      "For each character: if '*', pop the stack; otherwise push the character.",
      "Return the stack joined as a string.",
    ],
    solution: `function removeStars(s) {
  const stack = [];
  for (const c of s) {
    if (c === '*') stack.pop();
    else stack.push(c);
  }
  return stack.join('');
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "This models delete operations in append-only log streams (Kafka compaction deletes). In version control systems, a 'revert commit' is analogous to a star — it cancels the most recent change. Write-ahead logs use similar cancellation to reduce the number of pages that need flushing during checkpoint.",
    pitfalls: ["The problem guarantees a valid operation exists for each star, so you will never pop an empty stack.", "Stars are not pushed — only non-star characters populate the result."],
  },
  {
    id: "stack-12",
    title: "Validate Stack Sequences",
    difficulty: "Easy",
    tags: ["Stack", "Simulation"],
    statement: "Given two integer arrays pushed and popped (both permutations of 1..n), return true if this could be the result of a sequence of push and pop operations on an initially empty stack.",
    examples: [
      { input: "pushed = [1,2,3,4,5], popped = [4,5,3,2,1]", output: "true" },
      { input: "pushed = [1,2,3,4,5], popped = [4,3,5,1,2]", output: "false" },
    ],
    intuition: "Simulate the process: push elements one by one and, whenever the stack top matches the next expected pop, pop it. If simulation succeeds and the stack is empty, the sequences are valid.",
    approach: [
      "Use a stack and a pointer j into popped.",
      "For each element in pushed, push it.",
      "While the stack is non-empty and stack top equals popped[j], pop and advance j.",
      "Return true if the stack is empty at the end.",
    ],
    solution: `function validateStackSequences(pushed, popped) {
  const stack = [];
  let j = 0;
  for (const val of pushed) {
    stack.push(val);
    while (stack.length && stack[stack.length - 1] === popped[j]) {
      stack.pop();
      j++;
    }
  }
  return stack.length === 0;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Stack-sequence validation is used in CPU pipeline simulators to verify that instruction retire order matches architectural semantics. In distributed transaction coordinators, verifying that commit/rollback sequences are consistent with the push/pop order of nested savepoints uses the same simulation logic.",
    pitfalls: ["Each element is pushed and popped at most once — total work is O(n) despite the nested while.", "The stack being non-empty at the end means some elements were never popped in the given order — return false."],
  },
  {
    id: "stack-13",
    title: "Next Greater Element I",
    difficulty: "Easy",
    tags: ["Stack", "Monotonic Stack", "Array"],
    statement: "Given two distinct arrays nums1 and nums2 where nums1 is a subset of nums2, for each element of nums1, find the first greater element to its right in nums2. Return -1 if no such element exists.",
    examples: [
      { input: "nums1 = [4,1,2], nums2 = [1,3,4,2]", output: "[-1,3,-1]" },
      { input: "nums1 = [2,4], nums2 = [1,2,3,4]", output: "[3,-1]" },
    ],
    intuition: "Use a monotonic stack to precompute the next greater element for every value in nums2. Then just look up each nums1 element in a map.",
    approach: [
      "Iterate nums2 with a stack. For each element, pop all stack elements smaller than it — they have found their next greater element.",
      "Store result[popped] = current element in a map.",
      "Map each nums1 element to its result, defaulting to -1.",
    ],
    solution: `function nextGreaterElement(nums1, nums2) {
  const map = new Map();
  const stack = [];
  for (const n of nums2) {
    while (stack.length && stack[stack.length - 1] < n) {
      map.set(stack.pop(), n);
    }
    stack.push(n);
  }
  return nums1.map(n => map.get(n) ?? -1);
}`,
    language: "javascript",
    complexity: { time: "O(n+m)", space: "O(n)" },
    systemDesign: "Monotonic stacks compute next-greater-element in O(n) and are used in time-series databases to find the next spike above a threshold (alerting systems). Stock price alert engines and SLA violation detectors use the same pattern to efficiently find when a metric first exceeds a baseline.",
    pitfalls: ["Elements remaining on the stack after the loop have no greater element — they default to -1.", "All values in nums2 are distinct, so the map lookup is unambiguous."],
  },
  {
    id: "stack-14",
    title: "Daily Temperatures",
    difficulty: "Easy",
    tags: ["Stack", "Monotonic Stack", "Array"],
    statement: "Given an array of integers temperatures representing daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after day i to get a warmer temperature. If there is no future warmer day, answer[i] = 0.",
    examples: [
      { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" },
      { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]" },
    ],
    intuition: "Use a stack to remember days we are still waiting for a warmer day. When a hotter day arrives, it answers all the waiting days that are cooler.",
    approach: [
      "Maintain a stack of indices with decreasing temperatures (monotonic decreasing).",
      "For each index i, pop all stack indices j where temperatures[j] < temperatures[i] and set answer[j] = i - j.",
      "Push i onto the stack.",
      "Remaining stack indices get answer 0.",
    ],
    solution: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Daily-temperatures is the canonical monotonic stack use case; the same algorithm powers 'time-to-next-event' calculations in event-driven systems, next-request-deadline scheduling, and nearest-breach detection in SLA monitoring dashboards where you need the first future timestamp exceeding a threshold.",
    pitfalls: ["Store indices (not values) on the stack so you can compute the distance.", "Temperatures equal to the current do not trigger a pop — strictly greater is required."],
  },
  {
    id: "stack-15",
    title: "Online Stock Span",
    difficulty: "Easy",
    tags: ["Stack", "Monotonic Stack", "Design"],
    statement: "Design an algorithm to collect daily stock prices and return the span of the current day's price. The span is the number of consecutive days (including today) where the price was less than or equal to today's price.",
    examples: [
      { input: "prices = [100,80,60,70,60,75,85]", output: "[1,1,1,2,1,4,6]" },
    ],
    intuition: "Use a stack of (price, span) pairs. When today's price is larger than the top, absorb its span (because all those days are now also spanned by today).",
    approach: [
      "Maintain a stack of [price, span] pairs.",
      "For each new price, start span = 1.",
      "While the stack top price <= current price, pop and add its span to current span.",
      "Push [current price, span] and return span.",
    ],
    solution: `class StockSpanner {
  constructor() {
    this.stack = [];
  }
  next(price) {
    let span = 1;
    while (this.stack.length && this.stack[this.stack.length - 1][0] <= price) {
      span += this.stack.pop()[1];
    }
    this.stack.push([price, span]);
    return span;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) amortized", space: "O(n)" },
    systemDesign: "Stock span computation underlies technical analysis indicators (e.g. Relative Strength Index windows) in trading platforms. Real-time analytics engines use the same accumulate-and-collapse pattern to compute rolling counts efficiently without storing the full history, enabling sub-millisecond dashboards over streaming market data.",
    pitfalls: ["By accumulating spans, you avoid revisiting past days, achieving O(1) amortized per call.", "Equal prices are included in the span (use <=, not <)."],
  },
  {
    id: "stack-16",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Easy",
    tags: ["Stack", "Math"],
    statement: "Evaluate the value of an arithmetic expression in Reverse Polish Notation (RPN). Valid operators are +, -, *, /. Each operand and operator is a separate token. Division truncates toward zero.",
    examples: [
      { input: "tokens = [\"2\",\"1\",\"+\",\"3\",\"*\"]", output: "9", explanation: "(2+1)*3 = 9." },
      { input: "tokens = [\"4\",\"13\",\"5\",\"/\",\"+\"]", output: "6", explanation: "4+(13/5) = 6." },
    ],
    intuition: "In RPN, whenever you see an operator, the two most recent numbers are its operands. A stack naturally holds the 'recent numbers waiting for an operator'.",
    approach: [
      "Maintain a stack of numbers.",
      "For each token: if it is a number push it; if it is an operator pop two numbers, apply the operator, and push the result.",
      "Return the single remaining stack element.",
    ],
    solution: `function evalRPN(tokens) {
  const stack = [];
  const ops = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => Math.trunc(a / b),
  };
  for (const t of tokens) {
    if (ops[t]) {
      const b = stack.pop(), a = stack.pop();
      stack.push(ops[t](a, b));
    } else {
      stack.push(Number(t));
    }
  }
  return stack[0];
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "RPN evaluation is the execution model for stack-based virtual machines (JVM bytecode, Python bytecode, WebAssembly). Database query engines compile expressions into postfix bytecode that an interpreter evaluates using a stack — the same logic enables efficient expression evaluation in SQL WHERE clause pushdown.",
    pitfalls: ["Pop b before a — the second pop is the left operand.", "Use Math.trunc for division, not Math.floor — truncation rounds toward zero for negative numbers."],
  },
  {
    id: "stack-17",
    title: "Simplify Path",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    statement: "Given an absolute Unix file system path, simplify it to its canonical form. The canonical path must start with '/', have no trailing '/', no double slashes, no '.' or '..' components.",
    examples: [
      { input: "path = \"/home//foo/\"", output: "\"/home/foo\"" },
      { input: "path = \"/../\"", output: "\"/\"" },
      { input: "path = \"/home/user/Documents/../Pictures\"", output: "\"/home/user/Pictures\"" },
    ],
    intuition: "Split by '/' to get components. Push each valid directory name onto a stack. Pop on '..', ignore '' and '.'.",
    approach: [
      "Split path by '/'.",
      "For each part: skip empty strings and '.'; pop for '..'; push otherwise.",
      "Return '/' + stack.join('/').",
    ],
    solution: `function simplifyPath(path) {
  const stack = [];
  for (const part of path.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') stack.pop();
    else stack.push(part);
  }
  return '/' + stack.join('/');
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Path canonicalization is critical in web servers and API gateways to prevent path-traversal attacks (e.g. '/../etc/passwd'). CDNs normalise request paths before cache-key computation to avoid duplicate cache entries for logically identical URLs. OS kernels call this operation 'realpath resolution' during file-open system calls.",
    pitfalls: ["'..' on an empty stack is a no-op — trying to go above root just stays at root.", "Multiple consecutive '/' produce empty strings after split — skip them."],
  },
  // ---- MEDIUM (18 problems) ----
  {
    id: "stack-18",
    title: "Generate Parentheses",
    difficulty: "Medium",
    tags: ["Stack", "Backtracking", "String"],
    statement: "Given n pairs of parentheses, generate all combinations of well-formed parentheses.",
    examples: [
      { input: "n = 3", output: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]" },
      { input: "n = 1", output: "[\"()\"]" },
    ],
    intuition: "Build the string character by character. At each step you can add '(' if you still have open brackets left, or ')' if there are more unclosed opens than closes.",
    approach: [
      "Use backtracking with parameters (current string, open count, close count).",
      "If open < n, recurse adding '('.",
      "If close < open, recurse adding ')'.",
      "When string length == 2n, add to result.",
    ],
    solution: `function generateParenthesis(n) {
  const result = [];
  function bt(s, open, close) {
    if (s.length === 2 * n) { result.push(s); return; }
    if (open < n) bt(s + '(', open + 1, close);
    if (close < open) bt(s + ')', open, close + 1);
  }
  bt('', 0, 0);
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(4^n / sqrt(n))", space: "O(n)" },
    systemDesign: "Parenthesis generation enumerates all valid expression trees, which is what query optimisers do when exploring join-order spaces (each valid parenthesisation is a different join order). API gateway request validators use similar recursive grammar checking to validate nested JSON or XML structures against a schema.",
    pitfalls: ["Never add ')' when close >= open — this would create an invalid prefix.", "The count of valid strings is the Catalan number C(n), which grows rapidly."],
  },
  {
    id: "stack-19",
    title: "Next Greater Element II",
    difficulty: "Medium",
    tags: ["Stack", "Monotonic Stack", "Array"],
    statement: "Given a circular integer array nums (the next element of nums[n-1] is nums[0]), return the next greater number for every element. If no greater number exists, output -1.",
    examples: [
      { input: "nums = [1,2,1]", output: "[2,-1,2]" },
      { input: "nums = [1,2,3,4,3]", output: "[2,3,4,-1,4]" },
    ],
    intuition: "Traverse the array twice (simulating the circular wrap) with a monotonic stack. The second pass catches elements that wrap around.",
    approach: [
      "Initialize result array with -1.",
      "Iterate i from 0 to 2n-1 using i % n as the index.",
      "Use a monotonic decreasing stack of indices.",
      "For each element pop stack elements that are smaller and set their result.",
      "Only push during the first pass (i < n).",
    ],
    solution: `function nextGreaterElements(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = [];
  for (let i = 0; i < 2 * n; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i % n]) {
      result[stack.pop()] = nums[i % n];
    }
    if (i < n) stack.push(i);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Circular next-greater is used in ring-buffer telemetry pipelines where sensor readings wrap around and you need to find the next exceedance in a continuous stream. Circular log files in monitoring systems require similar wrap-aware scanning to correlate events that span a log rotation boundary.",
    pitfalls: ["Only push indices during the first pass; the second pass is only for resolving remaining stack elements.", "Use i % n to index the array, not i directly."],
  },
  {
    id: "stack-20",
    title: "Asteroid Collision",
    difficulty: "Medium",
    tags: ["Stack", "Simulation"],
    statement: "Given an array asteroids where each integer represents an asteroid (positive = moving right, negative = moving left, absolute value = size), find the state after all collisions. Asteroids moving in the same direction never meet; when moving toward each other the smaller one explodes; equal sizes both explode.",
    examples: [
      { input: "asteroids = [5,10,-5]", output: "[5,10]", explanation: "10 and -5 collide; 10 survives." },
      { input: "asteroids = [8,-8]", output: "[]" },
      { input: "asteroids = [10,2,-5]", output: "[10]" },
    ],
    intuition: "Use a stack for surviving asteroids. A new asteroid only collides if it is negative and the stack top is positive. Keep resolving collisions until no collision or both explode.",
    approach: [
      "For each asteroid: if positive, push it.",
      "If negative, compare with stack top (if positive). Pop if smaller, break if larger, pop both if equal.",
      "If stack is empty or top is negative, push the new asteroid.",
    ],
    solution: `function asteroidCollision(asteroids) {
  const stack = [];
  for (const a of asteroids) {
    let exploded = false;
    while (stack.length && a < 0 && stack[stack.length - 1] > 0) {
      const top = stack[stack.length - 1];
      if (top < -a) { stack.pop(); continue; }
      if (top === -a) stack.pop();
      exploded = true;
      break;
    }
    if (!exploded) stack.push(a);
  }
  return stack;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Asteroid collision models process-priority collision resolution in operating systems — higher-priority tasks preempt lower-priority ones analogously to larger asteroids destroying smaller ones. In network routers, packet queues with conflicting priorities use similar stack-based resolution to determine which packets survive buffer contention.",
    pitfalls: ["Only a negative asteroid collides with a positive top — same-sign asteroids never collide.", "The exploded flag prevents pushing an asteroid that was destroyed."],
  },
  {
    id: "stack-21",
    title: "Decode String",
    difficulty: "Medium",
    tags: ["Stack", "String"],
    statement: "Given an encoded string, return its decoded string. The encoding rule is k[encoded_string] meaning the encoded_string inside the brackets is repeated k times. k is a positive integer.",
    examples: [
      { input: "s = \"3[a]2[bc]\"", output: "\"aaabcbc\"" },
      { input: "s = \"3[a2[c]]\"", output: "\"accaccacc\"" },
    ],
    intuition: "Use a stack to handle nesting. When you hit '[', save the current string and current count. When you hit ']', pop the saved state and repeat the current segment.",
    approach: [
      "Maintain a stack, a current string curStr, and a current number curNum.",
      "On digit: build curNum.",
      "On '[': push [curStr, curNum] and reset both.",
      "On ']': pop [prevStr, num] and set curStr = prevStr + curStr.repeat(num).",
      "On letter: append to curStr.",
    ],
    solution: `function decodeString(s) {
  const stack = [];
  let curStr = '';
  let curNum = 0;
  for (const c of s) {
    if (c >= '0' && c <= '9') {
      curNum = curNum * 10 + Number(c);
    } else if (c === '[') {
      stack.push([curStr, curNum]);
      curStr = '';
      curNum = 0;
    } else if (c === ']') {
      const [prevStr, num] = stack.pop();
      curStr = prevStr + curStr.repeat(num);
    } else {
      curStr += c;
    }
  }
  return curStr;
}`,
    language: "javascript",
    complexity: { time: "O(n * max_k)", space: "O(n)" },
    systemDesign: "Nested string expansion mirrors template engines (Mustache, Handlebars) that recursively expand partials and loops. Compression algorithms like LZ77 encode repeated substrings as back-references; decoding them requires a stack to handle nested references, similar to how brackets are resolved here.",
    pitfalls: ["Multi-digit numbers require curNum = curNum * 10 + digit, not just assignment.", "Nested brackets push multiple levels — the stack must store both the previous string and the multiplier."],
  },
  {
    id: "stack-22",
    title: "Minimum Remove to Make Valid Parentheses",
    difficulty: "Medium",
    tags: ["Stack", "String"],
    statement: "Given a string s of '(', ')' and lowercase letters, remove the minimum number of parentheses to make the string valid. Return the resulting string (any valid answer is accepted).",
    examples: [
      { input: "s = \"lee(t(c)o)de)\"", output: "\"lee(t(c)o)de\"" },
      { input: "s = \"a)b(c)d\"", output: "\"ab(c)d\"" },
      { input: "s = \"))((\"", output: "\"\"" },
    ],
    intuition: "Use a stack of indices of unmatched '('. If a ')' has no matching '(' on the stack, mark it for removal. After the loop, all indices still on the stack are unmatched '(' — also mark them.",
    approach: [
      "Push indices of '(' onto the stack.",
      "For ')': if stack non-empty pop (matched); else mark this index for removal.",
      "After loop, mark all remaining stack indices for removal.",
      "Build result by skipping marked indices.",
    ],
    solution: `function minRemoveToMakeValid(s) {
  const remove = new Set();
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i);
    } else if (s[i] === ')') {
      if (stack.length) stack.pop();
      else remove.add(i);
    }
  }
  for (const i of stack) remove.add(i);
  return s.split('').filter((_, i) => !remove.has(i)).join('');
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Minimal bracket removal is a core subroutine in code formatters and linters (ESLint, Prettier) that auto-fix mismatched brackets without changing program semantics. In database schema migration tools, auto-correcting malformed SQL expressions uses the same mark-and-sweep approach before executing DDL statements.",
    pitfalls: ["Track indices not values — multiple brackets need individual tracking.", "Both unmatched '(' (on the stack) and unmatched ')' (immediately marked) must be removed."],
  },
  {
    id: "stack-23",
    title: "Score of Parentheses",
    difficulty: "Medium",
    tags: ["Stack", "String"],
    statement: "Given a balanced string of '(' and ')', return the score based on these rules: '()' has score 1; AB (concatenation) has score A+B; (A) has score 2*A.",
    examples: [
      { input: "s = \"()\"", output: "1" },
      { input: "s = \"(()(()))\"", output: "6" },
    ],
    intuition: "Use a stack where each element is the running score at that depth. An open bracket pushes a 0 (new scope). A close bracket pops the scope: if it was 0, contribute 1; otherwise contribute 2 * popped.",
    approach: [
      "Initialize stack with [0].",
      "On '(': push 0.",
      "On ')': pop v. If v==0, add 1 to new top; else add 2*v to new top.",
      "Return stack[0].",
    ],
    solution: `function scoreOfParentheses(s) {
  const stack = [0];
  for (const c of s) {
    if (c === '(') {
      stack.push(0);
    } else {
      const v = stack.pop();
      stack[stack.length - 1] += v === 0 ? 1 : 2 * v;
    }
  }
  return stack[0];
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Weighted-nesting scoring appears in XML/JSON schema validators that compute a complexity score for deeply nested documents, helping API gateways reject payloads exceeding a depth threshold. Recursive expression evaluators in compilers use the same stack-score pattern to compute constant-folded values during parsing.",
    pitfalls: ["An empty scope closing ('()') scores 1, not 0 — the v===0 check handles this.", "The initial 0 on the stack acts as the accumulator for the outermost level."],
  },
  {
    id: "stack-24",
    title: "Exclusive Time of Functions",
    difficulty: "Medium",
    tags: ["Stack", "Simulation"],
    statement: "Given n functions and a list of log entries of the form 'id:start/end:timestamp', return the exclusive time of each function (time spent running, excluding time used by called functions).",
    examples: [
      { input: "n = 2, logs = [\"0:start:0\",\"1:start:2\",\"1:end:5\",\"0:end:6\"]", output: "[3,4]", explanation: "Function 0 runs 0-1 and 6; function 1 runs 2-5." },
    ],
    intuition: "A stack tracks the call hierarchy. When a function starts or ends, update the currently running function's exclusive time based on how much time has passed since the last event.",
    approach: [
      "Maintain a stack of function IDs and a prevTime pointer.",
      "On start: add (timestamp - prevTime) to the current top function's time; push new function ID; update prevTime.",
      "On end: add (timestamp - prevTime + 1) to the top function; pop; update prevTime = timestamp + 1.",
    ],
    solution: `function exclusiveTime(n, logs) {
  const result = new Array(n).fill(0);
  const stack = [];
  let prevTime = 0;
  for (const log of logs) {
    const [id, type, time] = log.split(':');
    const t = Number(time);
    if (type === 'start') {
      if (stack.length) result[stack[stack.length - 1]] += t - prevTime;
      stack.push(Number(id));
      prevTime = t;
    } else {
      result[stack.pop()] += t - prevTime + 1;
      prevTime = t + 1;
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Exclusive function time mirrors CPU profiler flame graph computation, where each stack frame's self-time excludes child call durations. Distributed tracing systems (Jaeger, Zipkin) compute span exclusive time using the same parent-subtract-children logic to identify hot functions in microservice call trees.",
    pitfalls: ["On end, add (time - prevTime + 1) because timestamps are inclusive (the end tick belongs to the function).", "prevTime must be set to time + 1 after an end event so the resumed parent starts from the next tick."],
  },
  {
    id: "stack-25",
    title: "Remove K Digits",
    difficulty: "Medium",
    tags: ["Stack", "Monotonic Stack", "Greedy"],
    statement: "Given a string num representing a non-negative integer and an integer k, remove k digits to make the number as small as possible. Return the result as a string without leading zeros.",
    examples: [
      { input: "num = \"1432219\", k = 3", output: "\"1219\"" },
      { input: "num = \"10200\", k = 1", output: "\"200\"" },
      { input: "num = \"10\", k = 2", output: "\"0\"" },
    ],
    intuition: "To get the smallest number, remove a digit that is larger than the digit after it (a 'peak'). Use a monotonic increasing stack — whenever the stack top is greater than the current digit and k > 0, pop it.",
    approach: [
      "Maintain a stack (monotonic increasing).",
      "For each digit: while k > 0 and stack top > current digit, pop and decrement k.",
      "Push current digit.",
      "If k > 0 after the loop, remove the last k digits.",
      "Strip leading zeros and return, defaulting to '0'.",
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
  while (k-- > 0) stack.pop();
  const result = stack.join('').replace(/^0+/, '');
  return result || '0';
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Digit-minimisation with greedy pops is used in query plan simplification — redundant operators that produce larger intermediate results are pruned first. In data compression, Huffman-style prefix removal heuristics use similar greedy choices to minimise encoded length, and rate-limiter token-bucket implementations prune excess tokens greedily.",
    pitfalls: ["If k removals remain after the loop, remove from the tail (those are the largest suffix digits).", "Strip leading zeros but return '0' for an all-zero result."],
  },
  {
    id: "stack-26",
    title: "Car Fleet",
    difficulty: "Medium",
    tags: ["Stack", "Monotonic Stack", "Sorting"],
    statement: "n cars travel toward a target destination. Each car has a position and speed. A car cannot pass another, so faster cars that catch up form a fleet. Return the number of fleets at the target.",
    examples: [
      { input: "target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]", output: "3" },
      { input: "target = 10, position = [3], speed = [3]", output: "1" },
    ],
    intuition: "Sort cars by starting position (closest to target first). Compute each car's arrival time. A car that arrives after the car ahead of it forms a new fleet; otherwise it joins the fleet ahead.",
    approach: [
      "Pair positions with speeds; sort descending by position.",
      "Compute arrival time = (target - pos) / speed for each car.",
      "Use a stack. For each arrival time, if it is greater than the stack top (takes longer), push it — new fleet.",
      "Otherwise it merges with the fleet ahead.",
      "Return the stack length.",
    ],
    solution: `function carFleet(target, position, speed) {
  const cars = position.map((p, i) => [p, speed[i]]).sort((a, b) => b[0] - a[0]);
  const stack = [];
  for (const [p, s] of cars) {
    const time = (target - p) / s;
    if (!stack.length || time > stack[stack.length - 1]) {
      stack.push(time);
    }
  }
  return stack.length;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Fleet formation models batching in stream processing — events that arrive close enough in time get grouped into micro-batches. Kafka consumer-group rebalancing and connection-pool batch-commit strategies use similar merge-when-close logic to reduce overhead, grouping operations that would naturally converge.",
    pitfalls: ["Sort by position descending (closest to target first) so you process leaders before followers.", "Equal arrival times mean one car catches exactly at the target — they still form one fleet."],
  },
  {
    id: "stack-27",
    title: "Basic Calculator II",
    difficulty: "Medium",
    tags: ["Stack", "Math", "String"],
    statement: "Given a string s representing a non-negative integer expression with +, -, *, / (no parentheses), evaluate and return its integer result. Division truncates toward zero.",
    examples: [
      { input: "s = \"3+2*2\"", output: "7" },
      { input: "s = \" 3/2 \"", output: "1" },
      { input: "s = \" 3+5 / 2 \"", output: "5" },
    ],
    intuition: "Process higher-precedence operations (* and /) immediately. Push the result of +/- onto a stack as signed values. The final sum is the answer.",
    approach: [
      "Track the last operator (default '+') and current number.",
      "On encountering an operator or end of string: push based on last op ('+' push, '-' push negated, '*' pop and push product, '/' pop and push truncated quotient).",
      "Return the sum of the stack.",
    ],
    solution: `function calculate(s) {
  const stack = [];
  let num = 0, op = '+';
  for (let i = 0; i <= s.length; i++) {
    const c = s[i];
    if (c >= '0' && c <= '9') {
      num = num * 10 + Number(c);
    } else if (c === '+' || c === '-' || c === '*' || c === '/' || i === s.length) {
      if (op === '+') stack.push(num);
      else if (op === '-') stack.push(-num);
      else if (op === '*') stack.push(stack.pop() * num);
      else stack.push(Math.trunc(stack.pop() / num));
      op = c;
      num = 0;
    }
  }
  return stack.reduce((a, b) => a + b, 0);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Expression evaluation without parentheses is a core function of spreadsheet engines and database query engines that evaluate projected column expressions. SQL engines compile arithmetic expressions into bytecode using a similar precedence-aware stack-based approach before pushing down to the storage layer for vectorised execution.",
    pitfalls: ["Process the last number when i === s.length by treating the end as a sentinel operator.", "Spaces must be skipped — the digit check handles this naturally since non-digit non-operator chars are ignored."],
  },
  {
    id: "stack-28",
    title: "132 Pattern",
    difficulty: "Medium",
    tags: ["Stack", "Monotonic Stack", "Array"],
    statement: "Given an array of n integers nums, return true if there is a 132 pattern: indices i < j < k such that nums[i] < nums[k] < nums[j].",
    examples: [
      { input: "nums = [1,2,3,4]", output: "false" },
      { input: "nums = [3,1,4,2]", output: "true", explanation: "nums[1]=1, nums[2]=4, nums[3]=2 form the pattern." },
      { input: "nums = [-1,3,2,0]", output: "true" },
    ],
    intuition: "Scan from right to left with a monotonic stack. The stack tracks candidates for the '3' (maximum). We also track the best '2' — the largest value that has been popped (indicating we found a 3-2 pair). If we find a '1' smaller than the best '2', return true.",
    approach: [
      "Traverse from right to left.",
      "Maintain a stack and a variable k = -Infinity (best '2' candidate).",
      "If nums[i] < k, return true (nums[i] is '1').",
      "While stack top < nums[i], pop and update k (nums[i] is '3', popped is '2').",
      "Push nums[i].",
    ],
    solution: `function find132pattern(nums) {
  const stack = [];
  let k = -Infinity;
  for (let i = nums.length - 1; i >= 0; i--) {
    if (nums[i] < k) return true;
    while (stack.length && stack[stack.length - 1] < nums[i]) {
      k = stack.pop();
    }
    stack.push(nums[i]);
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "The 132 pattern detects a specific out-of-order triplet, analogous to detecting non-monotonic sequences in time-series data (e.g. a temporary dip in a metric surrounded by higher values). Anomaly detection systems in observability platforms use similar stack-based pattern matchers to flag non-trivial multi-point patterns in streaming metrics.",
    pitfalls: ["Scan right to left so you can maintain the maximum ('3') and track the best '2' as elements pop.", "k starts at -Infinity — a valid '2' must be strictly less than the '3' that preceded it."],
  },
  {
    id: "stack-29",
    title: "Flatten Nested List Iterator",
    difficulty: "Medium",
    tags: ["Stack", "Design", "Iterator"],
    statement: "Given a nested list of integers, implement an iterator to flatten it. Each element is either an integer or a list whose elements may also be integers or lists. Implement hasNext() and next().",
    examples: [
      { input: "nestedList = [[1,1],2,[1,1]]", output: "[1,1,2,1,1]" },
      { input: "nestedList = [1,[4,[6]]]", output: "[1,4,6]" },
    ],
    intuition: "Use a stack seeded with the list in reverse order. hasNext() ensures the top of the stack is always an integer by expanding any list found there.",
    approach: [
      "Push all items of the initial list in reverse order onto a stack.",
      "hasNext(): while stack top is a list, pop it and push its contents in reverse.",
      "Return true if stack is non-empty.",
      "next(): call hasNext(), then pop and return the top integer.",
    ],
    solution: `class NestedIterator {
  constructor(nestedList) {
    this.stack = [...nestedList].reverse();
  }
  hasNext() {
    while (this.stack.length) {
      const top = this.stack[this.stack.length - 1];
      if (top.isInteger()) return true;
      this.stack.pop();
      const list = top.getList();
      for (let i = list.length - 1; i >= 0; i--) {
        this.stack.push(list[i]);
      }
    }
    return false;
  }
  next() {
    this.hasNext();
    return this.stack.pop().getInteger();
  }
}`,
    language: "javascript",
    complexity: { time: "O(n) total", space: "O(depth)" },
    systemDesign: "Lazy flattening iterators appear in database cursor implementations that flatten nested result sets on demand without materialising the full result. Virtual file system traversal (find command, inotify watches) uses the same lazy-stack pattern to iterate directory trees depth-first without loading the entire tree into memory.",
    pitfalls: ["Push list items in reverse order so the first item is on top (LIFO).", "hasNext() must mutate the stack to guarantee the top is an integer — next() relies on this."],
  },
  {
    id: "stack-30",
    title: "Sum of Subarray Minimums",
    difficulty: "Medium",
    tags: ["Stack", "Monotonic Stack", "Dynamic Programming"],
    statement: "Given an array of integers arr, find the sum of min(b) over every contiguous subarray b of arr. Return the answer modulo 1e9 + 7.",
    examples: [
      { input: "arr = [3,1,2,4]", output: "17", explanation: "Subarrays and their mins: [3]=3,[1]=1,[2]=2,[4]=4,[3,1]=1,[1,2]=1,[2,4]=2,[3,1,2]=1,[1,2,4]=1,[3,1,2,4]=1. Sum=17." },
      { input: "arr = [11,81,94,43,3]", output: "444" },
    ],
    intuition: "For each element, count how many subarrays have it as the minimum. Use a monotonic stack to find the previous and next smaller elements — the number of subarrays where arr[i] is minimum is (i - left) * (right - i).",
    approach: [
      "For each index i find prevSmaller[i] (last index to the left with a smaller value) and nextSmaller[i] (first to the right with a smaller or equal value).",
      "Use two monotonic stack passes.",
      "Contribution of arr[i] = arr[i] * (i - prevSmaller[i]) * (nextSmaller[i] - i).",
      "Sum all contributions modulo 1e9+7.",
    ],
    solution: `function sumSubarrayMins(arr) {
  const MOD = 1_000_000_007n;
  const n = arr.length;
  const left = new Array(n);
  const right = new Array(n);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && arr[stack[stack.length - 1]] >= arr[i]) stack.pop();
    left[i] = stack.length ? stack[stack.length - 1] : -1;
    stack.push(i);
  }
  stack.length = 0;
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length && arr[stack[stack.length - 1]] > arr[i]) stack.pop();
    right[i] = stack.length ? stack[stack.length - 1] : n;
    stack.push(i);
  }
  let ans = 0n;
  for (let i = 0; i < n; i++) {
    ans = (ans + BigInt(arr[i]) * BigInt(i - left[i]) * BigInt(right[i] - i)) % MOD;
  }
  return Number(ans);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Subarray minimum aggregations power financial risk metrics (average worst-case drawdown over all windows) and database histogram statistics. Columnar databases use similar range-minimum-query preprocessing with sparse tables to answer 'minimum over range' in O(1), enabling fast query plan cost estimation.",
    pitfalls: ["Use strict inequality on the right pass (>) and non-strict on the left (>=) to avoid double-counting equal elements.", "Use BigInt or modular arithmetic carefully to prevent overflow."],
  },
  {
    id: "stack-31",
    title: "Validate Stack Sequences (Revisited: Decode Nested String)",
    difficulty: "Medium",
    tags: ["Stack", "String"],
    statement: "Given a string containing digits, letters, '[', ']', decode it where k[s] means s repeated k times. Numbers may be multi-digit and nesting is arbitrary. (This is the multi-digit extension of Decode String.)",
    examples: [
      { input: "s = \"100[leetcode]\"", output: "\"leetcodeleetcode...\" (100 times)" },
      { input: "s = \"2[abc]3[cd]ef\"", output: "\"abcabccdcdcdef\"" },
    ],
    intuition: "Same stack approach as Decode String — push the current string and count when entering '[', then multiply and concatenate on ']'. The key difference is handling multi-digit counts by building curNum digit by digit.",
    approach: [
      "Maintain curStr, curNum, and a stack.",
      "On digit: curNum = curNum*10 + digit.",
      "On '[': push [curStr, curNum], reset both.",
      "On ']': pop [prev, k], set curStr = prev + curStr.repeat(k).",
      "On letter: append to curStr.",
    ],
    solution: `function decodeStringMulti(s) {
  const stack = [];
  let curStr = '', curNum = 0;
  for (const c of s) {
    if (c >= '0' && c <= '9') {
      curNum = curNum * 10 + Number(c);
    } else if (c === '[') {
      stack.push([curStr, curNum]);
      curStr = '';
      curNum = 0;
    } else if (c === ']') {
      const [prev, k] = stack.pop();
      curStr = prev + curStr.repeat(k);
    } else {
      curStr += c;
    }
  }
  return curStr;
}`,
    language: "javascript",
    complexity: { time: "O(n * max_k)", space: "O(n)" },
    systemDesign: "Multi-level template expansion with numeric repetition is used in network packet generators and load-test tools (e.g. k6, Gatling) that describe traffic patterns with nested repeat loops. Kubernetes manifest templating (Helm charts) uses Sprig functions with nested iterations that follow the same expand-then-multiply semantics.",
    pitfalls: ["Multi-digit numbers: always do curNum = curNum*10 + digit.", "curNum is reset to 0 (not null) on '[' so the next number starts fresh."],
  },
  {
    id: "stack-32",
    title: "Basic Calculator",
    difficulty: "Medium",
    tags: ["Stack", "Math", "String"],
    statement: "Given a string s representing an expression with +, -, and parentheses (no *, /), evaluate it and return its value.",
    examples: [
      { input: "s = \"1 + 1\"", output: "2" },
      { input: "s = \" 2-1 + 2 \"", output: "3" },
      { input: "s = \"(1+(4+5+2)-3)+(6+8)\"", output: "23" },
    ],
    intuition: "Use a stack to save the running total and sign whenever you enter a parenthesis, and restore them when you exit. Inside, just accumulate with a sign (+1 or -1).",
    approach: [
      "Maintain result, sign (+1 or -1), and a stack.",
      "On digit: build the number.",
      "On '+'/'-': add sign*num to result, update sign, reset num.",
      "On '(': push result and sign; reset result=0, sign=1.",
      "On ')': result = stack.pop() * result_from_parens + stack.pop().",
    ],
    solution: `function basicCalculator(s) {
  const stack = [];
  let result = 0, sign = 1, num = 0;
  for (let i = 0; i <= s.length; i++) {
    const c = i < s.length ? s[i] : '+';
    if (c >= '0' && c <= '9') {
      num = num * 10 + Number(c);
    } else if (c === '+' || c === '-') {
      result += sign * num;
      sign = c === '+' ? 1 : -1;
      num = 0;
    } else if (c === '(') {
      stack.push(result, sign);
      result = 0;
      sign = 1;
    } else if (c === ')') {
      result += sign * num;
      num = 0;
      const prevSign = stack.pop();
      const prevResult = stack.pop();
      result = prevResult + prevSign * result;
    }
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Parenthesised expression evaluation is the foundation of formula engines in spreadsheets (Excel, Google Sheets) and SQL expression parsers. Recursive-descent parsers used in database engines parse nested subqueries using the same save/restore-context pattern that the stack provides here.",
    pitfalls: ["Push the result AND the sign before '(' — you need both to restore state on ')'.", "The sign applies to the entire parenthesised sub-expression, not just the first number."],
  },
  {
    id: "stack-33",
    title: "Sum of Subarray Ranges",
    difficulty: "Medium",
    tags: ["Stack", "Monotonic Stack", "Array"],
    statement: "Given an integer array nums, return the sum of ranges (max - min) of all subarrays.",
    examples: [
      { input: "nums = [1,2,3]", output: "4", explanation: "Ranges: [1]=0,[2]=0,[3]=0,[1,2]=1,[2,3]=1,[1,2,3]=2. Sum=4." },
      { input: "nums = [1,3,3]", output: "4" },
    ],
    intuition: "Sum of ranges = sum of subarray maximums minus sum of subarray minimums. Compute each with the monotonic stack contribution technique from Sum of Subarray Minimums.",
    approach: [
      "Use the contribution method: for each element compute how many subarrays it is the maximum of, and how many it is the minimum of.",
      "Sum of max contributions minus sum of min contributions is the answer.",
      "Use monotonic stacks (increasing for min, decreasing for max).",
    ],
    solution: `function subArrayRanges(nums) {
  const n = nums.length;
  function sumContrib(arr, isMax) {
    const left = new Array(n), right = new Array(n);
    const stack = [];
    for (let i = 0; i < n; i++) {
      while (stack.length && (isMax ? arr[stack[stack.length-1]] <= arr[i] : arr[stack[stack.length-1]] >= arr[i])) stack.pop();
      left[i] = stack.length ? stack[stack.length-1] : -1;
      stack.push(i);
    }
    stack.length = 0;
    for (let i = n - 1; i >= 0; i--) {
      while (stack.length && (isMax ? arr[stack[stack.length-1]] < arr[i] : arr[stack[stack.length-1]] > arr[i])) stack.pop();
      right[i] = stack.length ? stack[stack.length-1] : n;
      stack.push(i);
    }
    let sum = 0;
    for (let i = 0; i < n; i++) sum += arr[i] * (i - left[i]) * (right[i] - i);
    return sum;
  }
  return sumContrib(nums, true) - sumContrib(nums, false);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Subarray range aggregation underlies volatility metrics in financial analytics (peak-to-trough over all windows) and resource-utilisation spread calculations in cloud monitoring. Database query planners use range statistics (max-min per partition) to decide between partition pruning and full scans during query optimisation.",
    pitfalls: ["Use strict vs non-strict inequalities carefully to avoid double-counting equal-valued elements.", "The contribution formula multiplies the value by the number of subarrays where it is the extremum."],
  },
  {
    id: "stack-34",
    title: "Robot Collisions",
    difficulty: "Medium",
    tags: ["Stack", "Simulation", "Sorting"],
    statement: "There are n robots on a number line, each with a position, health, and direction ('L' or 'R'). Robots moving toward each other collide; the weaker (lower health) one is removed, the stronger loses 1 health. Equal-health robots both disappear. Return the healths of surviving robots in their original order.",
    examples: [
      { input: "positions=[5,4,3,2,1], healths=[2,17,9,15,10], directions=\"RRRRR\"", output: "[2,17,9,15,10]", explanation: "All move right, no collisions." },
      { input: "positions=[3,5,2,6], healths=[10,10,15,12], directions=\"RLRL\"", output: "[14]" },
    ],
    intuition: "Sort robots by position. Use a stack of right-moving robots. When a left-moving robot arrives, it battles robots on top of the stack until one side wins or both die.",
    approach: [
      "Create robots array with [pos, health, dir, originalIndex], sort by position.",
      "Use a stack for right-movers.",
      "For each robot: if 'R' push to stack. If 'L', battle: while stack top is 'R', compare health, eliminate accordingly.",
      "Collect survivors, sort by original index, return their healths.",
    ],
    solution: `function survivedRobotsHealths(positions, healths, directions) {
  const n = positions.length;
  const robots = positions.map((p, i) => [p, healths[i], directions[i], i]);
  robots.sort((a, b) => a[0] - b[0]);
  const stack = [];
  const survivors = new Map();
  for (let [, health, dir, idx] of robots) {
    if (dir === 'R') {
      stack.push([health, idx]);
    } else {
      while (stack.length) {
        const [topHealth, topIdx] = stack[stack.length - 1];
        if (topHealth > health) { stack[stack.length - 1] = [topHealth - 1, topIdx]; health = 0; break; }
        else if (topHealth === health) { stack.pop(); health = 0; break; }
        else { stack.pop(); health--; }
      }
      if (health > 0) survivors.set(idx, health);
    }
  }
  for (const [health, idx] of stack) survivors.set(idx, health);
  const result = [];
  for (let i = 0; i < n; i++) if (survivors.has(i)) result.push(survivors.get(i));
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Robot collision models process-collision in microservices — competing write requests that target the same resource are resolved by priority (health), with the lower-priority request failing. Optimistic concurrency control in databases uses similar health-based conflict resolution where higher-timestamped transactions survive and lower ones are rolled back.",
    pitfalls: ["Sort by position first to process collisions in spatial order.", "When the left-mover wins (health > 0 after battle), decrement its health by 1 and continue battling the next stack element."],
  },
  {
    id: "stack-35",
    title: "Maximum Width Ramp",
    difficulty: "Medium",
    tags: ["Stack", "Monotonic Stack", "Array"],
    statement: "Given an integer array nums, a ramp is a pair (i, j) where i < j and nums[i] <= nums[j]. Find the maximum width j - i of such a ramp, or return 0 if none exists.",
    examples: [
      { input: "nums = [6,0,8,2,1,5]", output: "4", explanation: "Ramp (1,5): nums[1]=0 <= nums[5]=5, width=4." },
      { input: "nums = [9,8,1,0,1,9,4,0,4,1]", output: "7" },
    ],
    intuition: "Build a decreasing stack of candidate left endpoints (potential minimums). Then scan from the right: for each j, pop stack elements where nums[stack.top] <= nums[j] and record the width.",
    approach: [
      "Build a monotonic decreasing stack of indices (left to right).",
      "Scan from right to left: while stack top has nums[top] <= nums[j], pop and update max width = j - top.",
      "Return max width.",
    ],
    solution: `function maxWidthRamp(nums) {
  const n = nums.length;
  const stack = [];
  for (let i = 0; i < n; i++) {
    if (!stack.length || nums[stack[stack.length - 1]] > nums[i]) {
      stack.push(i);
    }
  }
  let maxW = 0;
  for (let j = n - 1; j >= 0; j--) {
    while (stack.length && nums[stack[stack.length - 1]] <= nums[j]) {
      maxW = Math.max(maxW, j - stack.pop());
    }
  }
  return maxW;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Maximum width ramp finds the longest time window where a metric stays non-decreasing, used in uptime and performance trend analysis. In database index range scans, finding the widest valid range scan is analogous — query optimisers use similar span-maximisation to choose the most efficient index access path.",
    pitfalls: ["Only push to the stack if the new element is strictly smaller (maintaining decreasing order) — equal elements do not create new candidates.", "Scan right-to-left to maximise j while the stack gives the smallest possible i."],
  },
  // ---- HARD (15 problems) ----
  {
    id: "stack-36",
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    tags: ["Stack", "Monotonic Stack", "Array"],
    statement: "Given an array of integers heights representing the histogram bar heights, find the area of the largest rectangle that can be formed in the histogram.",
    examples: [
      { input: "heights = [2,1,5,6,2,3]", output: "10", explanation: "Rectangle between bars 2-3 (height 5, width 2)." },
      { input: "heights = [2,4]", output: "4" },
    ],
    intuition: "A bar can extend as wide as it is the shortest bar. Use a monotonic increasing stack. When a shorter bar arrives, pop taller bars and compute their maximum rectangle (they can only extend up to the current index).",
    approach: [
      "Maintain a monotonic increasing stack of indices.",
      "For each index i (including a sentinel 0 at the end), pop all stack indices j where heights[j] >= heights[i].",
      "For each popped j, width = i - stack_top - 1 (or i if stack empty), area = heights[j] * width.",
      "Track maximum area.",
    ],
    solution: `function largestRectangleArea(heights) {
  const h = [...heights, 0];
  const stack = [-1];
  let maxArea = 0;
  for (let i = 0; i < h.length; i++) {
    while (stack[stack.length - 1] !== -1 && h[stack[stack.length - 1]] >= h[i]) {
      const height = h[stack.pop()];
      const width = i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Largest-rectangle-in-histogram is used in 2D bin-packing algorithms and in memory allocator design where you need to find the largest contiguous free block in a fragmented heap. Data center rack layout optimisation (assigning contiguous slots to workloads) is a direct 2D generalisation of this problem.",
    pitfalls: ["Append a sentinel height 0 to flush all remaining stack elements at the end.", "Initialise the stack with -1 as a sentinel so width computation works for the leftmost bar."],
  },
  {
    id: "stack-37",
    title: "Maximal Rectangle",
    difficulty: "Hard",
    tags: ["Stack", "Monotonic Stack", "Dynamic Programming", "Matrix"],
    statement: "Given a binary matrix filled with '0's and '1's, find the largest rectangle containing only '1's and return its area.",
    examples: [
      { input: "matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]", output: "6" },
      { input: "matrix = [[\"0\"]]", output: "0" },
    ],
    intuition: "Build a histogram for each row (heights[j] = consecutive '1's ending at this row in column j). Then apply Largest Rectangle in Histogram to each row's histogram.",
    approach: [
      "Initialize a heights array of zeros with length n (number of columns).",
      "For each row: update heights[j] = heights[j]+1 if matrix[row][j]=='1', else 0.",
      "Run largestRectangleArea on the heights array.",
      "Track the maximum area across all rows.",
    ],
    solution: `function maximalRectangle(matrix) {
  if (!matrix.length) return 0;
  const n = matrix[0].length;
  const heights = new Array(n).fill(0);
  let maxArea = 0;
  function largestRect(h) {
    const arr = [...h, 0];
    const stack = [-1];
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
      while (stack[stack.length - 1] !== -1 && arr[stack[stack.length - 1]] >= arr[i]) {
        const height = arr[stack.pop()];
        const width = i - stack[stack.length - 1] - 1;
        max = Math.max(max, height * width);
      }
      stack.push(i);
    }
    return max;
  }
  for (const row of matrix) {
    for (let j = 0; j < n; j++) {
      heights[j] = row[j] === '1' ? heights[j] + 1 : 0;
    }
    maxArea = Math.max(maxArea, largestRect(heights));
  }
  return maxArea;
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(n)" },
    systemDesign: "Maximal rectangle problems appear in image recognition (finding the largest contiguous foreground region) and in warehouse slotting optimisation (largest contiguous available shelf area). In distributed storage systems, finding the largest contiguous free block across a 2D storage grid uses the same row-histogram reduction.",
    pitfalls: ["Reset height to 0 when a '0' is found — the consecutive run is broken.", "The heights array is updated row by row and reused, not rebuilt from scratch."],
  },
  {
    id: "stack-38",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Stack", "Two Pointers", "Monotonic Stack", "Array"],
    statement: "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    intuition: "Use a monotonic stack. When a taller bar arrives, water can fill between the previous bar (stack top) and the current bar, bounded by the shorter of the two walls.",
    approach: [
      "Maintain a monotonic decreasing stack of indices.",
      "When heights[i] > heights[stack.top], pop the bottom of the container.",
      "Water level = min(heights[left_wall], heights[i]) - heights[popped].",
      "Width = i - stack.top - 1.",
      "Add water level * width to total.",
    ],
    solution: `function trap(height) {
  const stack = [];
  let water = 0;
  for (let i = 0; i < height.length; i++) {
    while (stack.length && height[stack[stack.length - 1]] < height[i]) {
      const bottom = height[stack.pop()];
      if (!stack.length) break;
      const left = stack[stack.length - 1];
      const h = Math.min(height[left], height[i]) - bottom;
      water += h * (i - left - 1);
    }
    stack.push(i);
  }
  return water;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Trapping rain water models buffer fill in data pipelines — the trapped water represents buffered data between slow and fast processing stages. In network flow engineering, the water-trapping profile corresponds to bandwidth contention between high-throughput bursts, and the total trapped water equals the required buffer size to prevent packet loss.",
    pitfalls: ["After popping the bottom, if the stack is empty there is no left wall — break.", "The width uses the new stack top (left wall) after popping, not the popped index."],
  },
  {
    id: "stack-39",
    title: "Longest Valid Parentheses",
    difficulty: "Hard",
    tags: ["Stack", "Dynamic Programming", "String"],
    statement: "Given a string containing only '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
    examples: [
      { input: "s = \"(()\"", output: "2" },
      { input: "s = \")()())\"", output: "4" },
      { input: "s = \"\"", output: "0" },
    ],
    intuition: "Use a stack to track unmatched bracket indices. The length of a valid segment is the gap between consecutive unmatched indices.",
    approach: [
      "Initialize stack with [-1] (a sentinel base).",
      "For each '(' push its index.",
      "For each ')': pop the stack. If empty, push current index as new base. Otherwise, current valid length = i - stack.top.",
      "Track maximum length.",
    ],
    solution: `function longestValidParentheses(s) {
  const stack = [-1];
  let max = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (!stack.length) {
        stack.push(i);
      } else {
        max = Math.max(max, i - stack[stack.length - 1]);
      }
    }
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Longest valid parentheses is used in streaming log parsers that need to find the longest syntactically valid expression window in a corrupted log. Tokenizers in compiler front-ends use similar stack-based span tracking to report the extent of syntax errors, helping IDEs highlight the full malformed region.",
    pitfalls: ["The sentinel -1 allows the first valid segment to compute length correctly as i - (-1).", "When the stack empties on ')', push the current index as the new boundary (no valid substring can span across this point)."],
  },
  {
    id: "stack-40",
    title: "Maximum Frequency Stack",
    difficulty: "Hard",
    tags: ["Stack", "Design", "Hashing"],
    statement: "Design a stack-like data structure. Implement push(x) which pushes x, and pop() which removes and returns the most frequently pushed element. If there is a tie, return the most recently pushed element among the most frequent.",
    examples: [
      { input: "push(5),push(7),push(5),push(7),push(4),push(5),pop(),pop(),pop(),pop()", output: "5,7,5,4" },
    ],
    intuition: "Group elements by frequency in separate stacks. Track the current maximum frequency. On pop, remove from the max-frequency stack and decrease the max if that stack becomes empty.",
    approach: [
      "Maintain freq map (element -> count) and group map (count -> stack of elements).",
      "Track maxFreq.",
      "push(x): increment freq[x], push x to group[freq[x]], update maxFreq.",
      "pop(): pop from group[maxFreq], decrement freq of that element, if group[maxFreq] is empty decrement maxFreq.",
    ],
    solution: `class FreqStack {
  constructor() {
    this.freq = new Map();
    this.group = new Map();
    this.maxFreq = 0;
  }
  push(val) {
    const f = (this.freq.get(val) || 0) + 1;
    this.freq.set(val, f);
    if (f > this.maxFreq) this.maxFreq = f;
    if (!this.group.has(f)) this.group.set(f, []);
    this.group.get(f).push(val);
  }
  pop() {
    const stack = this.group.get(this.maxFreq);
    const val = stack.pop();
    this.freq.set(val, this.freq.get(val) - 1);
    if (!stack.length) {
      this.group.delete(this.maxFreq);
      this.maxFreq--;
    }
    return val;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) push and pop", space: "O(n)" },
    systemDesign: "Maximum-frequency stack is the data structure behind LFU (Least Frequently Used) cache eviction — a real production cache like Redis' LFU mode maintains frequency buckets to evict the least used item. CDN caches use frequency-aware eviction to keep hot content and drop cold objects without a full scan.",
    pitfalls: ["Decrement maxFreq only when the current max-frequency bucket is empty — not after every pop.", "The group stacks preserve insertion order, ensuring most-recent-tie-break is handled automatically by LIFO."],
  },
  {
    id: "stack-41",
    title: "Remove Duplicate Letters",
    difficulty: "Hard",
    tags: ["Stack", "Monotonic Stack", "Greedy", "String"],
    statement: "Given a string s, remove duplicate letters so that every letter appears once and only once. The result must be the smallest in lexicographic order among all possible results.",
    examples: [
      { input: "s = \"bcabc\"", output: "\"abc\"" },
      { input: "s = \"cbacdcbc\"", output: "\"acdb\"" },
    ],
    intuition: "Build the result character by character with a greedy stack. When a smaller character arrives, pop the stack if the popped character appears again later (so we can include it at a better position). Never pop if the character won't appear again.",
    approach: [
      "Count remaining occurrences of each character.",
      "Maintain a monotonic stack and an 'in-stack' set.",
      "For each character c: decrement remaining[c]. If c is already in stack skip. While stack top > c and remaining[stack.top] > 0, pop. Push c.",
    ],
    solution: `function removeDuplicateLetters(s) {
  const remaining = {};
  for (const c of s) remaining[c] = (remaining[c] || 0) + 1;
  const stack = [];
  const inStack = new Set();
  for (const c of s) {
    remaining[c]--;
    if (inStack.has(c)) continue;
    while (stack.length && stack[stack.length - 1] > c && remaining[stack[stack.length - 1]] > 0) {
      inStack.delete(stack.pop());
    }
    stack.push(c);
    inStack.add(c);
  }
  return stack.join('');
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Greedy deduplication with ordering constraints appears in query result deduplication pipelines that must return the lexicographically first canonical form. Database DISTINCT operations with ORDER BY pushdown use similar greedy selection when producing a sorted unique result set from a stream without full materialisation.",
    pitfalls: ["Only pop when the character will appear again (remaining > 0) — never discard a character's last occurrence.", "Use an 'in-stack' set to skip characters already in the result."],
  },
  {
    id: "stack-42",
    title: "Number of Atoms",
    difficulty: "Hard",
    tags: ["Stack", "Hashing", "String"],
    statement: "Given a chemical formula as a string, return the count of each element. Formulas may have nested groups enclosed in parentheses with a multiplier. Return the result in sorted order as a string.",
    examples: [
      { input: "formula = \"H2O\"", output: "\"H2O\"" },
      { input: "formula = \"Mg(OH)2\"", output: "\"H2MgO2\"" },
      { input: "formula = \"K4(ON(SO3)2)2\"", output: "\"K4N2O14S4\"" },
    ],
    intuition: "Use a stack of maps. When entering '(' push a new map. When ')' is followed by a multiplier, pop the map and multiply all its counts, then merge into the map below.",
    approach: [
      "Maintain a stack starting with one empty map.",
      "Parse element names (capital letter + optional lowercase) and their counts.",
      "On '(': push a new empty map.",
      "On ')': read the multiplier, pop the top map, multiply all counts, merge into the new top.",
      "Format the final map sorted by element name.",
    ],
    solution: `function countOfAtoms(formula) {
  let i = 0;
  const n = formula.length;
  function parse() {
    const map = new Map();
    while (i < n && formula[i] !== ')') {
      if (formula[i] === '(') {
        i++;
        const inner = parse();
        i++; // skip ')'
        let mult = 0;
        while (i < n && formula[i] >= '0' && formula[i] <= '9') mult = mult * 10 + Number(formula[i++]);
        if (!mult) mult = 1;
        for (const [elem, cnt] of inner) map.set(elem, (map.get(elem) || 0) + cnt * mult);
      } else if (formula[i] >= 'A' && formula[i] <= 'Z') {
        let elem = formula[i++];
        while (i < n && formula[i] >= 'a' && formula[i] <= 'z') elem += formula[i++];
        let cnt = 0;
        while (i < n && formula[i] >= '0' && formula[i] <= '9') cnt = cnt * 10 + Number(formula[i++]);
        if (!cnt) cnt = 1;
        map.set(elem, (map.get(elem) || 0) + cnt);
      }
    }
    return map;
  }
  const map = parse();
  const keys = [...map.keys()].sort();
  return keys.map(k => k + (map.get(k) > 1 ? map.get(k) : '')).join('');
}`,
    language: "javascript",
    complexity: { time: "O(n^2)", space: "O(n)" },
    systemDesign: "Nested formula parsing mirrors XML/JSON schema processors that accumulate counts of nested element types. Dependency resolution in package managers (npm, Maven) uses similar recursive merging — each package's dependency counts are merged upward through the dependency tree, analogous to multiplied atom counts propagating out of parentheses.",
    pitfalls: ["Multi-character element names start with uppercase then have optional lowercase letters.", "A group with no numeric suffix has multiplier 1.", "Sort element names lexicographically in the output."],
  },
  {
    id: "stack-43",
    title: "Parsing A Boolean Expression",
    difficulty: "Hard",
    tags: ["Stack", "String", "Recursion"],
    statement: "Return the result of evaluating a boolean expression. The expression is either 't', 'f', '!(expr)', '&(expr1,expr2,...)', or '|(expr1,expr2,...)'.",
    examples: [
      { input: "expression = \"!(f)\"", output: "true" },
      { input: "expression = \"|(f,t)\"", output: "true" },
      { input: "expression = \"&(|(f))\"", output: "false" },
    ],
    intuition: "Use a stack. Push characters onto it. When you encounter ')', pop until you find '(' to gather operands, then apply the operator that sits before '('.",
    approach: [
      "Push each character unless it is ')' or ','.",
      "On ')': collect all values until '(', pop the operator before '('.",
      "Apply '!', '&', '|' to the collected values and push the result ('t' or 'f').",
      "Return stack top === 't'.",
    ],
    solution: `function parseBoolExpr(expression) {
  const stack = [];
  for (const c of expression) {
    if (c === ',') continue;
    if (c !== ')') {
      stack.push(c);
    } else {
      const vals = [];
      while (stack[stack.length - 1] !== '(') vals.push(stack.pop());
      stack.pop(); // '('
      const op = stack.pop();
      let res;
      if (op === '!') res = vals[0] === 'f';
      else if (op === '&') res = vals.every(v => v === 't');
      else res = vals.some(v => v === 't');
      stack.push(res ? 't' : 'f');
    }
  }
  return stack[0] === 't';
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Boolean expression parsing is the core of SQL WHERE clause evaluation engines and firewall rule evaluators. Cloud IAM policy engines (AWS IAM, GCP IAM) parse and evaluate nested boolean permission expressions (AND/OR/NOT of conditions) using the same operator-stack approach to determine access control decisions.",
    pitfalls: ["The operator is pushed before '(' — pop '(' first, then pop the operator.", "Commas must be skipped, not pushed, to keep only meaningful tokens on the stack."],
  },
  {
    id: "stack-44",
    title: "Largest Rectangle in Histogram (Stack + DP)",
    difficulty: "Hard",
    tags: ["Stack", "Dynamic Programming", "Array"],
    statement: "You are given heights of buildings. For each building, find the largest area rectangle that includes that building at its full height, using both the monotonic stack and a DP approach to count contributions.",
    examples: [
      { input: "heights = [2,1,5,6,2,3]", output: "10" },
      { input: "heights = [1,1]", output: "2" },
    ],
    intuition: "Using previous-smaller and next-smaller arrays (computed with monotonic stacks), each bar can be the minimum over a precise range. Its contribution is height * range width.",
    approach: [
      "Compute left[i] = index of nearest smaller bar to the left (or -1).",
      "Compute right[i] = index of nearest smaller bar to the right (or n).",
      "For each bar: area = heights[i] * (right[i] - left[i] - 1).",
      "Return the maximum area.",
    ],
    solution: `function largestRectangleAreaDP(heights) {
  const n = heights.length;
  const left = new Array(n);
  const right = new Array(n);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && heights[stack[stack.length - 1]] >= heights[i]) stack.pop();
    left[i] = stack.length ? stack[stack.length - 1] : -1;
    stack.push(i);
  }
  stack.length = 0;
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length && heights[stack[stack.length - 1]] >= heights[i]) stack.pop();
    right[i] = stack.length ? stack[stack.length - 1] : n;
    stack.push(i);
  }
  let max = 0;
  for (let i = 0; i < n; i++) {
    max = Math.max(max, heights[i] * (right[i] - left[i] - 1));
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "The previous/next-smaller precomputation is the backbone of monotonic-stack range queries used in columnar database statistics (min/max per segment) for query plan selectivity estimation. Skyline problem variants in urban planning and GPU rendering pipelines also use this two-pass approach to determine visibility ranges.",
    pitfalls: ["Use >= for both passes to handle duplicate heights correctly and avoid double-counting.", "left[i] is exclusive (not part of the rectangle), so the width is right[i] - left[i] - 1."],
  },
  {
    id: "stack-45",
    title: "132 Pattern (Extended: Count All 132 Triplets)",
    difficulty: "Hard",
    tags: ["Stack", "Monotonic Stack", "Array"],
    statement: "Given an array nums, count the total number of 132 pattern triplets (i < j < k, nums[i] < nums[k] < nums[j]). Return the count.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "0" },
      { input: "nums = [3,1,4,2]", output: "1" },
      { input: "nums = [-1,3,2,0]", output: "3" },
    ],
    intuition: "For each potential 'k' (the middle value in 132), count how many 'i' values to the left are smaller. Use a prefix minimum array for 'i' counting and a monotonic stack to track the best 'j'.",
    approach: [
      "Precompute minLeft[i] = minimum of nums[0..i-1].",
      "For each j from 1 to n-2, for each k from j+1 to n-1: if nums[j] > nums[k] > minLeft[j] increment count.",
      "Optimise using sorted data structure to count valid k values.",
    ],
    solution: `function count132Patterns(nums) {
  const n = nums.length;
  if (n < 3) return 0;
  const minLeft = new Array(n).fill(Infinity);
  minLeft[0] = nums[0];
  for (let i = 1; i < n; i++) minLeft[i] = Math.min(minLeft[i - 1], nums[i]);
  let count = 0;
  const stack = [];
  for (let k = n - 1; k >= 1; k--) {
    while (stack.length && stack[stack.length - 1] <= minLeft[k]) stack.pop();
    if (stack.length && stack[stack.length - 1] < nums[k]) count++;
    stack.push(nums[k]);
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Counting ordered triplets with value constraints appears in anomaly detection for time-series data (counting occurrences of a dip-spike-midpoint pattern in metrics). Financial fraud detection systems search for specific price-action patterns (a low followed by a high followed by a mid-value) using the same monotonic-stack triplet counting.",
    pitfalls: ["The approach here fixes k as the rightmost element and looks for j and i to the left.", "minLeft tracks the running minimum to the left of each position, representing the best 'i' candidate."],
  },
  {
    id: "stack-46",
    title: "Largest Rectangle Under Skyline",
    difficulty: "Hard",
    tags: ["Stack", "Monotonic Stack", "Array"],
    statement: "Given skyline heights as an array, find the area of the largest rectangle that fits entirely under the skyline (same as largest rectangle in histogram but with the added constraint that the rectangle must be axis-aligned).",
    examples: [
      { input: "heights = [3,2,3]", output: "6" },
      { input: "heights = [1,2,3,4,5]", output: "9" },
    ],
    intuition: "This is identical to the Largest Rectangle in Histogram problem. The 'skyline' framing just reminds you that each column has a fixed height and the rectangle must not exceed it at any point within its span.",
    approach: [
      "Use the monotonic stack approach: maintain an increasing stack.",
      "When a shorter bar arrives, pop taller bars and calculate their rectangle area.",
      "The width extends from the current position back to the new stack top.",
      "Return the maximum area found.",
    ],
    solution: `function largestRectangleSkyline(heights) {
  const h = [...heights, 0];
  const stack = [-1];
  let maxArea = 0;
  for (let i = 0; i < h.length; i++) {
    while (stack[stack.length - 1] !== -1 && h[stack[stack.length - 1]] >= h[i]) {
      const ht = h[stack.pop()];
      const width = i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, ht * width);
    }
    stack.push(i);
  }
  return maxArea;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Skyline rectangle optimisation directly maps to floor-plan area maximisation in chip design (EDA tools find the largest rectangular macro placement area) and in warehouse robotics (finding the largest open floor rectangle for autonomous vehicle routing). Real-estate spatial databases index building footprints using similar sweep-line rectangle queries.",
    pitfalls: ["Append a 0 sentinel to trigger flushing all remaining stack elements at the end.", "The sentinel -1 at the stack bottom ensures the width calculation handles the leftmost bars correctly."],
  },
  {
    id: "stack-47",
    title: "Stock Price Fluctuation",
    difficulty: "Hard",
    tags: ["Stack", "Design", "Hashing", "Ordered Set"],
    statement: "Design a data structure to store stock prices at given timestamps. Support update(timestamp, price), current() (latest price), maximum(), and minimum().",
    examples: [
      { input: "update(1,10), update(2,5), current(), maximum(), update(1,3), maximum(), minimum()", output: "5, 10, 5, 3" },
    ],
    intuition: "Keep a map of timestamp to price for current/update. Maintain a sorted multiset (or sorted map of price counts) to answer maximum/minimum in O(log n) after each update.",
    approach: [
      "Use a Map for timestamp->price.",
      "Use a sorted price-count map (TreeMap equivalent) for max/min.",
      "On update: if timestamp already exists, decrement old price count (remove if 0); set new price, increment count.",
      "current() returns price at max timestamp; maximum()/minimum() return last/first key of the sorted map.",
    ],
    solution: `class StockPrice {
  constructor() {
    this.prices = new Map();
    this.sorted = new Map();
    this.maxTime = 0;
  }
  _add(price, delta) {
    const cnt = (this.sorted.get(price) || 0) + delta;
    if (cnt <= 0) this.sorted.delete(price);
    else this.sorted.set(price, cnt);
  }
  update(timestamp, price) {
    if (this.prices.has(timestamp)) {
      this._add(this.prices.get(timestamp), -1);
    }
    this.prices.set(timestamp, price);
    this._add(price, 1);
    if (timestamp >= this.maxTime) this.maxTime = timestamp;
  }
  current() {
    return this.prices.get(this.maxTime);
  }
  maximum() {
    return Math.max(...this.sorted.keys());
  }
  minimum() {
    return Math.min(...this.sorted.keys());
  }
}`,
    language: "javascript",
    complexity: { time: "O(n log n) for max/min spread", space: "O(n)" },
    systemDesign: "This design mirrors a real-time financial tick database (e.g. InfluxDB for market data) where prices are indexed by timestamp and range queries (current price, all-time high/low) must be served with low latency. In production, a Red-Black Tree or Skip List (Java TreeMap) provides O(log n) max/min; JavaScript's Map requires a sorted alternative for full O(log n) guarantees.",
    pitfalls: ["When updating an existing timestamp, always decrement the old price count before incrementing the new one.", "JavaScript's Map is not sorted — for true O(log n) max/min, use a heap or a sorted structure."],
  },
  {
    id: "stack-48",
    title: "Minimum Stack with O(1) Space Overhead",
    difficulty: "Hard",
    tags: ["Stack", "Design", "Math"],
    statement: "Design a stack that supports push, pop, top, and getMin in O(1) time using only O(1) extra space (no second stack). Assume all values are positive integers.",
    examples: [
      { input: "push(5), push(3), getMin(), pop(), getMin()", output: "3, 5" },
    ],
    intuition: "Encode both the current minimum and the previous minimum into the stored value using the formula: store 2*val - prevMin. If the stored value is less than the current min, we know we are at the min-update boundary.",
    approach: [
      "Maintain one stack and a variable min.",
      "push(x): if x < min, push 2*x - min, update min = x. Else push x.",
      "pop(): if top < min (encoded), restore prevMin = 2*min - top, update min accordingly. Else just pop.",
      "getMin(): return min.",
    ],
    solution: `class MinStackO1 {
  constructor() {
    this.stack = [];
    this.min = Infinity;
  }
  push(val) {
    if (this.stack.length === 0) {
      this.stack.push(val);
      this.min = val;
    } else if (val < this.min) {
      this.stack.push(2 * val - this.min);
      this.min = val;
    } else {
      this.stack.push(val);
    }
  }
  pop() {
    const top = this.stack.pop();
    if (top < this.min) {
      this.min = 2 * this.min - top;
    }
  }
  top() {
    const top = this.stack[this.stack.length - 1];
    return top < this.min ? this.min : top;
  }
  getMin() {
    return this.min;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) all ops", space: "O(1) extra" },
    systemDesign: "Encoding auxiliary metadata into stored values (using the gap between actual and encoded values as a signal) is a technique used in compact data structures for embedded systems and in GPU memory layouts where auxiliary arrays are too expensive. This trick appears in B-tree node encoding where child pointers and flags share the same word.",
    pitfalls: ["This trick requires positive integers — the encoded value 2*val - prevMin may underflow for negative integers.", "top() must decode: if stored value < current min, the real top is current min."],
  },
  {
    id: "stack-49",
    title: "Maximum Score from Removing Substrings",
    difficulty: "Hard",
    tags: ["Stack", "Greedy", "String"],
    statement: "Given a string s and integers x and y, you can remove 'ab' for x points or 'ba' for y points. Return the maximum score by performing removals in any order.",
    examples: [
      { input: "s = \"cdbcbbaaabab\", x = 4, y = 5", output: "19", explanation: "Remove 'ba' twice (+10) then 'ab' once (+4) then 'ba' (+5)." },
      { input: "s = \"aabbaaxybbaabb\", x = 5, y = 4", output: "20" },
    ],
    intuition: "Greedily remove the higher-scoring pair first. Use a stack to simulate each pass — one for 'ba' if y > x, then one for 'ab'. This works because removing the higher pair first never prevents removal of the lower pair.",
    approach: [
      "Determine which pair scores more. Remove it first with a stack pass.",
      "Take the resulting string and remove the other pair with a second stack pass.",
      "Count removals in each pass and accumulate score.",
    ],
    solution: `function maximumGain(s, x, y) {
  function removeAndScore(str, first, second, score) {
    const stack = [];
    let points = 0;
    for (const c of str) {
      if (stack.length && stack[stack.length - 1] === first && c === second) {
        stack.pop();
        points += score;
      } else {
        stack.push(c);
      }
    }
    return [stack.join(''), points];
  }
  let total = 0;
  let remaining;
  if (x >= y) {
    [remaining, total] = removeAndScore(s, 'a', 'b', x);
    const [, pts] = removeAndScore(remaining, 'b', 'a', y);
    total += pts;
  } else {
    [remaining, total] = removeAndScore(s, 'b', 'a', y);
    const [, pts] = removeAndScore(remaining, 'a', 'b', x);
    total += pts;
  }
  return total;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Greedy two-pass removal models priority-based log compaction in event-driven systems: higher-value event pairs (e.g. request-response matching) are resolved first to maximise reward before lower-priority cleanup. Kafka log compaction with multiple retention tiers uses similar priority-ordered passes to maximise data reduction while preserving high-value records.",
    pitfalls: ["Always process the higher-scoring pair first — the greedy order is critical.", "The stack simulates repeated removal in a single O(n) pass without actually repeating."],
  },
  {
    id: "stack-50",
    title: "Reverse Substrings Between Each Pair of Parentheses",
    difficulty: "Hard",
    tags: ["Stack", "String"],
    statement: "Given a string s consisting of lowercase letters and parentheses, reverse the substrings in each pair of parentheses from the innermost to outermost. Return the resulting string without parentheses.",
    examples: [
      { input: "s = \"(abcd)\"", output: "\"dcba\"" },
      { input: "s = \"(u(love)i)\"", output: "\"iloveu\"" },
      { input: "s = \"(ed(et(oc))el)\"", output: "\"leetcode\"" },
    ],
    intuition: "Use a stack of character arrays. For each '(' push a new array. On ')' pop and reverse, then append to the top. This processes innermost parentheses first.",
    approach: [
      "Maintain a stack of arrays. Push an empty array initially.",
      "On letter: push to stack top.",
      "On '(': push a new empty array.",
      "On ')': pop the top, reverse it, append its characters to the new top.",
      "Return the bottom array joined.",
    ],
    solution: `function reverseParentheses(s) {
  const stack = [[]];
  for (const c of s) {
    if (c === '(') {
      stack.push([]);
    } else if (c === ')') {
      const top = stack.pop().reverse();
      stack[stack.length - 1].push(...top);
    } else {
      stack[stack.length - 1].push(c);
    }
  }
  return stack[0].join('');
}`,
    language: "javascript",
    complexity: { time: "O(n^2) worst case", space: "O(n)" },
    systemDesign: "Nested-reversal string processing appears in binary protocol parsers where byte-order reversal is applied at multiple nesting levels (e.g. nested TLV structures with different endianness). Compiler transformations that reverse operand order for architecture-specific instruction selection use a similar innermost-first stack-reversal approach.",
    pitfalls: ["Reverse the popped array before spreading it onto the new top — the innermost reversal must happen before merging.", "An O(n) solution exists using a 'wormhole' precomputation linking paired parentheses, but the stack approach is simpler."],
  },
];
