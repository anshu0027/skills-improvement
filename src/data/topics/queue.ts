import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  {
    id: "queue-01",
    title: "Implement Queue using Stacks",
    difficulty: "Easy",
    tags: ["Queue", "Stack", "Design"],
    statement: "Implement a first-in first-out (FIFO) queue using only two stacks. The queue should support push, pop, peek, and empty operations.",
    examples: [
      { input: "push(1), push(2), peek() -> 1, pop() -> 1, empty() -> false", output: "1, 1, false", explanation: "Elements come out in the order they were pushed." },
    ],
    intuition: "Think of two buckets: pour items into bucket A. When you need the oldest item, flip all of A into bucket B — now B is in reverse order and the bottom of A is on top of B. Like reversing a stack of pancakes.",
    approach: [
      "Maintain two stacks: inbox and outbox.",
      "push: always push onto inbox.",
      "pop/peek: if outbox is empty, move all items from inbox to outbox (reversing order), then pop/peek outbox.",
      "empty: return true when both stacks are empty.",
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
    if (this.outbox.length === 0) {
      while (this.inbox.length) {
        this.outbox.push(this.inbox.pop());
      }
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
    return this.inbox.length === 0 && this.outbox.length === 0;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) amortized per operation", space: "O(n)" },
    systemDesign: "Producer-consumer queues in message brokers like RabbitMQ buffer writes in one structure and drain from another, decoupling ingestion rate from processing rate. This amortized transfer mirrors how Kafka batches log segments: writes are append-only, reads consume sequentially from a separate pointer.",
  },
  {
    id: "queue-02",
    title: "Implement Stack using Queues",
    difficulty: "Easy",
    tags: ["Queue", "Stack", "Design"],
    statement: "Implement a last-in first-out (LIFO) stack using only two queues. Support push, pop, top, and empty operations.",
    examples: [
      { input: "push(1), push(2), top() -> 2, pop() -> 2, empty() -> false", output: "2, 2, false" },
    ],
    intuition: "When you push a new item, rotate the queue so the new item ends up at the front. Imagine a revolving door: after adding your item, everyone who was ahead of you cycles back around behind you.",
    approach: [
      "Use one primary queue.",
      "On push(x): enqueue x, then rotate all previous elements to the back (dequeue and re-enqueue them one by one).",
      "Now the front of the queue is always the most recently pushed element.",
      "pop: dequeue from front. top: peek front. empty: check length.",
    ],
    solution: `class MyStack {
  constructor() {
    this.q = [];
  }
  push(x) {
    this.q.push(x);
    for (let i = 0; i < this.q.length - 1; i++) {
      this.q.push(this.q.shift());
    }
  }
  pop() {
    return this.q.shift();
  }
  top() {
    return this.q[0];
  }
  empty() {
    return this.q.length === 0;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n) push, O(1) pop/top", space: "O(n)" },
    systemDesign: "Priority inversion via re-queuing mirrors how OS schedulers promote high-priority tasks by moving them to the head of a run queue, ensuring the most recently triggered interrupt handler runs before older tasks in real-time systems.",
  },
  {
    id: "queue-03",
    title: "Number of Recent Calls",
    difficulty: "Easy",
    tags: ["Queue", "Sliding Window"],
    statement: "Implement a RecentCounter class that counts the number of recent requests within a 3000-millisecond window. Each call to ping(t) adds a request at time t and returns the count of requests in [t-3000, t].",
    examples: [
      { input: "ping(1), ping(100), ping(3001), ping(3002)", output: "1, 2, 3, 3", explanation: "At t=3002, requests at 1 and 100 are outside the 3000ms window." },
    ],
    intuition: "Keep all recent pings in a line. Whenever you add a new ping, kick out any old ones from the front that are too far in the past. The length of what remains is your answer.",
    approach: [
      "Maintain a queue.",
      "On ping(t): push t into the queue.",
      "Dequeue from the front while front < t - 3000.",
      "Return queue length.",
    ],
    solution: `class RecentCounter {
  constructor() {
    this.q = [];
  }
  ping(t) {
    this.q.push(t);
    while (this.q[0] < t - 3000) {
      this.q.shift();
    }
    return this.q.length;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) amortized", space: "O(W) where W is max requests in 3s window" },
    systemDesign: "Sliding-window rate limiters in API gateways (NGINX, AWS API Gateway) use the same queue-based eviction to enforce requests-per-second limits, dropping or throttling calls that exceed the window threshold and protecting backend services from overload.",
  },
  {
    id: "queue-04",
    title: "Moving Average from Data Stream",
    difficulty: "Easy",
    tags: ["Queue", "Sliding Window", "Design"],
    statement: "Given a stream of integers and a window size, calculate the moving average of all integers in the sliding window. Implement the MovingAverage class with a next(val) method.",
    examples: [
      { input: "MovingAverage(3), next(1)=1.0, next(10)=5.5, next(3)=4.67, next(5)=6.0", output: "1.0, 5.5, 4.67, 6.0" },
    ],
    intuition: "Imagine a train with exactly k seats. When a new passenger boards, the passenger at the very back must leave. The average of everyone on the train is your answer.",
    approach: [
      "Store window size and a queue.",
      "On next(val): push val, add to running sum.",
      "If queue length exceeds window size, shift from front and subtract from sum.",
      "Return sum / queue.length.",
    ],
    solution: `class MovingAverage {
  constructor(size) {
    this.size = size;
    this.q = [];
    this.sum = 0;
  }
  next(val) {
    this.q.push(val);
    this.sum += val;
    if (this.q.length > this.size) {
      this.sum -= this.q.shift();
    }
    return this.sum / this.q.length;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1)", space: "O(k)" },
    systemDesign: "Moving averages power real-time monitoring dashboards (CPU usage, network throughput) and financial tick-data systems where recalculating from scratch on every tick is too expensive; maintaining a running sum with a fixed-size circular buffer achieves O(1) updates at any ingestion rate.",
  },
  {
    id: "queue-05",
    title: "Time Needed to Buy Tickets",
    difficulty: "Easy",
    tags: ["Queue", "Simulation"],
    statement: "There are n people in a queue each wanting to buy a certain number of tickets. Each round, the person at the front buys one ticket and moves to the back (or leaves if done). Given position k, return the time when person k finishes buying all their tickets.",
    examples: [
      { input: "tickets = [2,3,2], k = 2", output: "6" },
      { input: "tickets = [5,1,1,1], k = 0", output: "8" },
    ],
    intuition: "You do not need to simulate every round. Each person before k contributes min(their tickets, tickets[k]) rounds, and each person after k contributes min(their tickets, tickets[k]-1) rounds.",
    approach: [
      "Let need = tickets[k].",
      "For each person i before or at k: add min(tickets[i], need) to time.",
      "For each person i after k: add min(tickets[i], need - 1) to time.",
      "Return time.",
    ],
    solution: `function timeRequiredToBuy(tickets, k) {
  let time = 0;
  const need = tickets[k];
  for (let i = 0; i < tickets.length; i++) {
    if (i <= k) {
      time += Math.min(tickets[i], need);
    } else {
      time += Math.min(tickets[i], need - 1);
    }
  }
  return time;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Round-robin job scheduling in operating systems and task queues (Celery, Sidekiq) uses the same cyclic dispatch idea; knowing the completion time of a specific job without full simulation is critical for SLA prediction in cloud batch-processing pipelines.",
  },
  {
    id: "queue-06",
    title: "Number of Students Unable to Eat Lunch",
    difficulty: "Easy",
    tags: ["Queue", "Stack", "Simulation"],
    statement: "Students stand in a queue; sandwiches are in a stack. If the top sandwich matches the front student's preference, the student takes it; otherwise the student moves to the back. Return the number of students who cannot eat.",
    examples: [
      { input: "students = [1,1,0,0], sandwiches = [0,1,0,1]", output: "0" },
      { input: "students = [1,1,1,0,0,1], sandwiches = [1,0,0,0,1,1]", output: "3" },
    ],
    intuition: "Once no one in the queue wants the current top sandwich, the process is stuck forever. Count how many students prefer each type and compare with remaining sandwiches.",
    approach: [
      "Count preference 0 and preference 1 students.",
      "Iterate through sandwiches stack.",
      "If count for current sandwich > 0, decrement that count.",
      "Else return remaining total students (count0 + count1).",
      "Return 0 if all sandwiches consumed.",
    ],
    solution: `function countStudents(students, sandwiches) {
  let count = [0, 0];
  for (const s of students) count[s]++;
  for (const s of sandwiches) {
    if (count[s] === 0) return count[0] + count[1];
    count[s]--;
  }
  return 0;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "This models consumer-type matching in task queues: if no available worker can handle the next task type (e.g., GPU vs CPU jobs), the queue stalls. Kafka consumer groups with topic-affinity partitioning prevent this by ensuring at least one consumer per message type is always available.",
  },
  {
    id: "queue-07",
    title: "First Unique Character in a String",
    difficulty: "Easy",
    tags: ["Queue", "Hashing", "String"],
    statement: "Given a string s, find the first non-repeating character and return its index. If none exists, return -1. Solve using a queue approach.",
    examples: [
      { input: "s = \"leetcode\"", output: "0" },
      { input: "s = \"loveleetcode\"", output: "2" },
      { input: "s = \"aabb\"", output: "-1" },
    ],
    intuition: "Keep a queue of characters you have seen only once so far, in order. Whenever the character at the front of the queue has been seen more than once, discard it. The front of the queue is always the first unique character.",
    approach: [
      "Build a frequency map of all characters.",
      "Enqueue (char, index) pairs for characters with frequency 1.",
      "Dequeue from front while the front character's frequency > 1.",
      "Return index at front, or -1 if queue is empty.",
    ],
    solution: `function firstUniqChar(s) {
  const freq = {};
  for (const c of s) freq[c] = (freq[c] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (freq[s[i]] === 1) return i;
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Unique-event detection in stream processing (Apache Flink, Spark Streaming) uses frequency sketches (Count-Min Sketch) to approximate uniqueness at scale, powering deduplication and anomaly detection in real-time analytics pipelines with billions of events per day.",
  },
  {
    id: "queue-08",
    title: "Design Circular Queue",
    difficulty: "Easy",
    tags: ["Queue", "Design", "Array"],
    statement: "Design a circular queue with fixed capacity. Implement MyCircularQueue with enQueue, deQueue, Front, Rear, isEmpty, isFull operations.",
    examples: [
      { input: "MyCircularQueue(3), enQueue(1), enQueue(2), enQueue(3), enQueue(4)->false, Rear()->3, isFull()->true, deQueue(), enQueue(4), Rear()->4", output: "true,true,true,false,3,true,true,true,4" },
    ],
    intuition: "Picture a circular track with numbered seats. A head pointer marks where people leave; a tail pointer marks where people sit. When tail reaches the end of the track it wraps back to seat 0.",
    approach: [
      "Allocate array of given size, head=0, tail=0, count=0.",
      "enQueue: store at tail, advance tail = (tail+1)%k, increment count.",
      "deQueue: advance head = (head+1)%k, decrement count.",
      "Front: return arr[head]. Rear: return arr[(tail-1+k)%k].",
      "isEmpty: count===0. isFull: count===k.",
    ],
    solution: `class MyCircularQueue {
  constructor(k) {
    this.arr = new Array(k);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
    this.k = k;
  }
  enQueue(val) {
    if (this.isFull()) return false;
    this.arr[this.tail] = val;
    this.tail = (this.tail + 1) % this.k;
    this.count++;
    return true;
  }
  deQueue() {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.k;
    this.count--;
    return true;
  }
  Front() {
    return this.isEmpty() ? -1 : this.arr[this.head];
  }
  Rear() {
    return this.isEmpty() ? -1 : this.arr[(this.tail - 1 + this.k) % this.k];
  }
  isEmpty() { return this.count === 0; }
  isFull() { return this.count === this.k; }
}`,
    language: "javascript",
    complexity: { time: "O(1) all ops", space: "O(k)" },
    systemDesign: "Circular buffers are used in network interface cards (NIC ring buffers), OS kernel I/O queues, and audio/video streaming pipelines where fixed-size lock-free ring buffers allow producers and consumers to operate independently without dynamic allocation, critical for low-latency real-time systems.",
  },
  {
    id: "queue-09",
    title: "Design Circular Deque",
    difficulty: "Easy",
    tags: ["Queue", "Deque", "Design"],
    statement: "Design a circular double-ended queue (deque). Implement insertFront, insertLast, deleteFront, deleteLast, getFront, getRear, isEmpty, isFull.",
    examples: [
      { input: "MyCircularDeque(3), insertLast(1), insertLast(2), insertFront(3), insertFront(4)->false, getRear()->2, isFull()->true, deleteLast(), insertFront(4), getFront()->4", output: "true,true,true,false,2,true,true,true,4" },
    ],
    intuition: "Same circular track idea as the circular queue, but now you can board or exit from either end of the track using two pointers that can move forward or backward.",
    approach: [
      "Allocate array of size k, front=0, rear=k-1, count=0.",
      "insertFront: front = (front-1+k)%k, store, count++.",
      "insertLast: rear = (rear+1)%k, store, count++.",
      "deleteFront: front = (front+1)%k, count--.",
      "deleteLast: rear = (rear-1+k)%k, count--.",
    ],
    solution: `class MyCircularDeque {
  constructor(k) {
    this.arr = new Array(k);
    this.k = k;
    this.front = 0;
    this.rear = k - 1;
    this.count = 0;
  }
  insertFront(value) {
    if (this.isFull()) return false;
    this.front = (this.front - 1 + this.k) % this.k;
    this.arr[this.front] = value;
    this.count++;
    return true;
  }
  insertLast(value) {
    if (this.isFull()) return false;
    this.rear = (this.rear + 1) % this.k;
    this.arr[this.rear] = value;
    this.count++;
    return true;
  }
  deleteFront() {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.k;
    this.count--;
    return true;
  }
  deleteLast() {
    if (this.isEmpty()) return false;
    this.rear = (this.rear - 1 + this.k) % this.k;
    this.count--;
    return true;
  }
  getFront() { return this.isEmpty() ? -1 : this.arr[this.front]; }
  getRear() { return this.isEmpty() ? -1 : this.arr[this.rear]; }
  isEmpty() { return this.count === 0; }
  isFull() { return this.count === this.k; }
}`,
    language: "javascript",
    complexity: { time: "O(1) all ops", space: "O(k)" },
    systemDesign: "Double-ended queues power work-stealing schedulers (Java ForkJoinPool, Go runtime) where each thread owns a deque and idle threads steal tasks from the back of busy threads' deques, maximising CPU utilisation with minimal contention in parallel computing frameworks.",
  },
  {
    id: "queue-10",
    title: "Design Hit Counter",
    difficulty: "Easy",
    tags: ["Queue", "Design", "Sliding Window"],
    statement: "Design a hit counter that counts the number of hits received in the past 5 minutes (300 seconds). Implement hit(timestamp) and getHits(timestamp) where timestamps are in seconds.",
    examples: [
      { input: "hit(1),hit(2),hit(3),getHits(4)->3,hit(300),getHits(300)->4,getHits(301)->3", output: "3, 4, 3" },
    ],
    intuition: "Store each hit timestamp in a queue. When you need the count, evict timestamps older than 300 seconds from the front. What remains is the valid window.",
    approach: [
      "Maintain a queue of timestamps.",
      "hit(t): push t.",
      "getHits(t): while front <= t-300 dequeue. Return length.",
    ],
    solution: `class HitCounter {
  constructor() {
    this.q = [];
  }
  hit(timestamp) {
    this.q.push(timestamp);
  }
  getHits(timestamp) {
    while (this.q.length && this.q[0] <= timestamp - 300) {
      this.q.shift();
    }
    return this.q.length;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) amortized", space: "O(n)" },
    systemDesign: "Hit counters with time-window eviction are the core of rate-limiting infrastructure at companies like Stripe and Cloudflare; Redis sorted sets store timestamps as scores enabling O(log n) range deletions, while sliding-window counters protect APIs from abuse without blocking legitimate traffic.",
  },
  {
    id: "queue-11",
    title: "Design Front Middle Back Queue",
    difficulty: "Easy",
    tags: ["Queue", "Deque", "Design"],
    statement: "Design a queue that supports pushFront, pushMiddle, pushBack, popFront, popMiddle, popBack in O(1) time.",
    examples: [
      { input: "pushFront(1),pushBack(2),pushMiddle(3),pushMiddle(4): queue=[1,4,3,2], popFront()->1, popMiddle()->3, popMiddle()->4, popBack()->2, popFront()->-1", output: "1,3,4,2,-1" },
    ],
    intuition: "Use two deques — a left half and a right half — and always keep them balanced. The middle is the back of the left deque (or front of the right if left is shorter).",
    approach: [
      "Maintain left and right deques, keep |left| == |right| or |left| == |right|-1.",
      "After each push/pop, rebalance by transferring one element between deques.",
      "pushMiddle: push to back of left, then rebalance.",
      "popMiddle: pop from back of left (or front of right if left is smaller).",
    ],
    solution: `class FrontMiddleBackQueue {
  constructor() {
    this.left = [];
    this.right = [];
  }
  _balance() {
    while (this.left.length > this.right.length) {
      this.right.unshift(this.left.pop());
    }
    while (this.right.length > this.left.length + 1) {
      this.left.push(this.right.shift());
    }
  }
  pushFront(val) {
    this.left.unshift(val);
    this._balance();
  }
  pushMiddle(val) {
    this.left.push(val);
    this._balance();
  }
  pushBack(val) {
    this.right.push(val);
    this._balance();
  }
  popFront() {
    if (!this.left.length && !this.right.length) return -1;
    const val = this.left.length ? this.left.shift() : this.right.shift();
    this._balance();
    return val;
  }
  popMiddle() {
    if (!this.left.length && !this.right.length) return -1;
    const val = this.left.length >= this.right.length ? this.left.pop() : this.right.shift();
    this._balance();
    return val;
  }
  popBack() {
    if (!this.left.length && !this.right.length) return -1;
    const val = this.right.length ? this.right.pop() : this.left.pop();
    this._balance();
    return val;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n) due to unshift (O(1) with linked list)", space: "O(n)" },
    systemDesign: "Multi-priority queues with fast middle access appear in media servers that need to insert low-latency frames at specific positions in a playback buffer, and in database buffer pools that manage pages by access recency using a mid-point insertion LRU strategy.",
  },
  {
    id: "queue-12",
    title: "Dota2 Senate",
    difficulty: "Easy",
    tags: ["Queue", "Greedy"],
    statement: "In a Dota2 senate, Radiant (R) and Dire (D) senators take turns. Each senator can ban the next senator of the opposing party from voting. Given a string of R and D, determine which party wins.",
    examples: [
      { input: "senate = \"RD\"", output: "Radiant" },
      { input: "senate = \"RDD\"", output: "Dire" },
    ],
    intuition: "Each party's senators should always ban the earliest available opponent. Use two queues of indices — the senator with the smaller index wins and re-joins the queue for the next round.",
    approach: [
      "Build queues of indices for R and D.",
      "Repeat: compare fronts. Smaller index wins, ban the other.",
      "Winner re-enqueues with index += n (next round).",
      "Party whose queue empties first loses.",
    ],
    solution: `function predictPartyVictory(senate) {
  const n = senate.length;
  const r = [], d = [];
  for (let i = 0; i < n; i++) {
    if (senate[i] === "R") r.push(i);
    else d.push(i);
  }
  while (r.length && d.length) {
    const ri = r.shift(), di = d.shift();
    if (ri < di) r.push(ri + n);
    else d.push(di + n);
  }
  return r.length ? "Radiant" : "Dire";
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Greedy round-robin arbitration mirrors consensus algorithms like Raft leader election, where candidates with earlier term numbers win ties; understanding which actor acts first in a distributed round is fundamental to preventing split-brain in highly available systems.",
  },
  {
    id: "queue-13",
    title: "Reveal Cards In Increasing Order",
    difficulty: "Easy",
    tags: ["Queue", "Sorting", "Simulation"],
    statement: "You have a deck of cards with integers. Reveal the top card, then move the next top card to the bottom. Return the ordering of the deck so that the revealed cards are in increasing order.",
    examples: [
      { input: "deck = [17,13,11,2,3,5,7]", output: "[2,13,3,11,5,17,7]" },
    ],
    intuition: "Simulate the reveal process in reverse using the sorted values. Use a queue of positions; assign the smallest value to the current front position, then cycle the next position to the back.",
    approach: [
      "Sort deck ascending.",
      "Create queue of indices 0..n-1.",
      "For each value in sorted deck: place it at index queue.shift(), then queue.push(queue.shift()).",
      "Return result array.",
    ],
    solution: `function deckRevealedIncreasing(deck) {
  deck.sort((a, b) => a - b);
  const n = deck.length;
  const result = new Array(n);
  const q = Array.from({ length: n }, (_, i) => i);
  for (const val of deck) {
    result[q.shift()] = val;
    if (q.length) q.push(q.shift());
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(n)" },
    systemDesign: "Interleaved ordering of sorted data appears in multi-level cache pre-fetching and striped RAID layouts, where data is distributed across disks in a pattern that enables sequential reads while maintaining sorted logical order for efficient range queries.",
  },
  {
    id: "queue-14",
    title: "Find the Winner of the Circular Game",
    difficulty: "Easy",
    tags: ["Queue", "Math", "Simulation"],
    statement: "There are n friends in a circle numbered 1 to n. Starting from friend 1, count k friends clockwise and remove that friend. The last remaining friend wins. Return the winner.",
    examples: [
      { input: "n = 5, k = 2", output: "3" },
      { input: "n = 6, k = 5", output: "1" },
    ],
    intuition: "Simulate the circle with a queue. Count k steps by rotating the front to the back k-1 times, then remove the front. Repeat until one person remains.",
    approach: [
      "Build queue [1, 2, ..., n].",
      "While length > 1: rotate front to back k-1 times, then dequeue (eliminate).",
      "Return the remaining element.",
    ],
    solution: `function findTheWinner(n, k) {
  const q = Array.from({ length: n }, (_, i) => i + 1);
  while (q.length > 1) {
    for (let i = 0; i < k - 1; i++) {
      q.push(q.shift());
    }
    q.shift();
  }
  return q[0];
}`,
    language: "javascript",
    complexity: { time: "O(n*k)", space: "O(n)" },
    systemDesign: "The Josephus problem models token-passing protocols in ring-based distributed systems (token ring networks, leader election in Apache ZooKeeper) where a token circulates and the node holding it gains the right to act, preventing concurrent writes in distributed coordination.",
  },
  {
    id: "queue-15",
    title: "Keys and Rooms",
    difficulty: "Easy",
    tags: ["BFS", "Graph", "Queue"],
    statement: "There are n rooms labeled 0 to n-1. Room 0 is unlocked. Each room contains keys to other rooms. Determine if you can visit all rooms.",
    examples: [
      { input: "rooms = [[1],[2],[3],[]]", output: "true" },
      { input: "rooms = [[1,3],[3,0,1],[2],[0]]", output: "false" },
    ],
    intuition: "Start in room 0 and collect its keys. Use a queue to visit each newly unlocked room, picking up more keys. If you visit all rooms, the answer is true.",
    approach: [
      "Initialize queue with room 0, visited set with 0.",
      "BFS: for each room, iterate its keys, if not visited add to queue and visited.",
      "After BFS, check if visited size equals n.",
    ],
    solution: `function canVisitAllRooms(rooms) {
  const visited = new Set([0]);
  const q = [0];
  while (q.length) {
    const room = q.shift();
    for (const key of rooms[room]) {
      if (!visited.has(key)) {
        visited.add(key);
        q.push(key);
      }
    }
  }
  return visited.size === rooms.length;
}`,
    language: "javascript",
    complexity: { time: "O(n + e)", space: "O(n)" },
    systemDesign: "BFS reachability checks are used in microservice dependency graphs to detect unreachable services during health checks, and in IAM permission systems (AWS IAM, GCP) to verify that all resources are accessible from a given root role without infinite traversal loops.",
  },
  {
    id: "queue-16",
    title: "Number of Islands (BFS)",
    difficulty: "Easy",
    tags: ["BFS", "Queue", "Matrix", "Graph"],
    statement: "Given a 2D grid of '1' (land) and '0' (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
    examples: [
      { input: "grid = [[\"1\",\"1\",\"0\"],[\"0\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]", output: "2" },
    ],
    intuition: "Walk the grid and when you find unvisited land, launch a BFS that floods the entire connected island, marking cells as visited. Each launch is a new island.",
    approach: [
      "Iterate every cell.",
      "On finding unvisited '1': increment count, BFS all 4 neighbors.",
      "Mark visited cells as '0' or use a visited set.",
      "Return count.",
    ],
    solution: `function numIslands(grid) {
  let count = 0;
  const rows = grid.length, cols = grid[0].length;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        const q = [[r, c]];
        grid[r][c] = "0";
        while (q.length) {
          const [row, col] = q.shift();
          for (const [dr, dc] of dirs) {
            const nr = row + dr, nc = col + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === "1") {
              grid[nr][nc] = "0";
              q.push([nr, nc]);
            }
          }
        }
      }
    }
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(min(m,n))" },
    systemDesign: "Connected-component analysis on grids is used in geospatial databases to identify contiguous geographic regions (parcels of land, network segments) and in network topology tools that detect isolated subnet clusters — BFS on adjacency graphs is foundational to routing protocol design.",
  },
  {
    id: "queue-17",
    title: "Walking Robot Simulation",
    difficulty: "Easy",
    tags: ["Queue", "Simulation", "Hash Set"],
    statement: "A robot starts at (0,0) facing north. Given commands (-2: turn left, -1: turn right, 1-9: move forward) and obstacles, return the maximum squared distance from origin the robot ever reaches.",
    examples: [
      { input: "commands = [4,-1,3], obstacles = []", output: "25" },
      { input: "commands = [4,-1,4,-2,4], obstacles = [[2,4]]", output: "65" },
    ],
    intuition: "Track direction as one of four compass headings. For each move command, step one cell at a time and stop if you hit an obstacle. Record the best squared distance.",
    approach: [
      "Store obstacles in a hash set as 'x,y' strings.",
      "Use direction vectors: N, E, S, W.",
      "Process commands: -1 turns right, -2 turns left, else move step by step checking obstacles.",
      "Track max x*x+y*y.",
    ],
    solution: `function robotSim(commands, obstacles) {
  const blocked = new Set(obstacles.map(([x, y]) => x + "," + y));
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]]; // N,E,S,W
  let d = 0, x = 0, y = 0, best = 0;
  for (const cmd of commands) {
    if (cmd === -2) d = (d + 3) % 4;
    else if (cmd === -1) d = (d + 1) % 4;
    else {
      for (let i = 0; i < cmd; i++) {
        const nx = x + dirs[d][0], ny = y + dirs[d][1];
        if (!blocked.has(nx + "," + ny)) { x = nx; y = ny; }
        best = Math.max(best, x * x + y * y);
      }
    }
  }
  return best;
}`,
    language: "javascript",
    complexity: { time: "O(n + k) where k is total steps", space: "O(|obstacles|)" },
    systemDesign: "Grid-based simulation with obstacle sets models pathfinding in warehouse robotics (Amazon Robotics) and autonomous vehicle navigation, where static obstacle maps are stored in spatial hash grids enabling O(1) collision checks at scale.",
  },
  {
    id: "queue-18",
    title: "Rotting Oranges",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Matrix"],
    statement: "In a grid, 0=empty, 1=fresh orange, 2=rotten orange. Every minute, each rotten orange infects adjacent fresh oranges. Return the minimum minutes until no fresh oranges remain, or -1 if impossible.",
    examples: [
      { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" },
      { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1" },
    ],
    intuition: "Start BFS simultaneously from all rotten oranges at once (multi-source BFS). Each BFS level is one minute passing. Count levels until no fresh oranges remain.",
    approach: [
      "Enqueue all initially rotten oranges, count fresh oranges.",
      "BFS level by level: each level = 1 minute.",
      "For each rotten cell, infect adjacent fresh cells and decrement fresh count.",
      "Return minutes when fresh==0, else -1.",
    ],
    solution: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const q = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) q.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  let minutes = 0;
  while (q.length && fresh > 0) {
    minutes++;
    const size = q.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = q.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          fresh--;
          q.push([nr, nc]);
        }
      }
    }
  }
  return fresh === 0 ? minutes : -1;
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Multi-source BFS models epidemic spread simulations used in public health modeling and CDN cache invalidation, where a cache-bust signal propagates from multiple origin servers simultaneously to all edge nodes — the number of BFS levels equals the propagation delay in hops.",
  },
  {
    id: "queue-19",
    title: "01 Matrix",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Matrix", "Dynamic Programming"],
    statement: "Given a binary matrix, return a matrix of the same size where each cell contains the distance to the nearest 0.",
    examples: [
      { input: "mat = [[0,0,0],[0,1,0],[1,1,1]]", output: "[[0,0,0],[0,1,0],[1,2,1]]" },
    ],
    intuition: "Start BFS from all 0-cells simultaneously. The BFS wave spreading outward naturally assigns the shortest distance to each 1-cell, because BFS explores level by level.",
    approach: [
      "Initialize queue with all 0-cells (distance 0). Set 1-cells to Infinity.",
      "BFS: for each dequeued cell, check 4 neighbors.",
      "If neighbor distance > current distance + 1, update and enqueue.",
      "Return distance matrix.",
    ],
    solution: `function updateMatrix(mat) {
  const rows = mat.length, cols = mat[0].length;
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  const q = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] === 0) { dist[r][c] = 0; q.push([r, c]); }
    }
  }
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (q.length) {
    const [r, c] = q.shift();
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && dist[nr][nc] > dist[r][c] + 1) {
        dist[nr][nc] = dist[r][c] + 1;
        q.push([nr, nc]);
      }
    }
  }
  return dist;
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Distance transforms on grids are fundamental to robotics path planning (ROS navigation stack) and game AI (influence maps), where proximity to obstacles or resources is precomputed once and queried repeatedly, offloading computation from the hot path to a batch preprocessing step.",
  },
  {
    id: "queue-20",
    title: "Walls and Gates",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Matrix"],
    statement: "Fill each empty room in a grid with the distance to its nearest gate. Rooms are INF (2^31-1), gates are 0, walls are -1.",
    examples: [
      { input: "rooms = [[INF,-1,0,INF],[INF,INF,INF,-1],[INF,-1,INF,-1],[0,-1,INF,INF]]", output: "[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]" },
    ],
    intuition: "Start BFS from all gates simultaneously. Each step away from a gate increments the distance by 1. Multi-source BFS guarantees every room gets the distance to its closest gate.",
    approach: [
      "Enqueue all gate cells (value 0).",
      "BFS: spread outward, updating INF cells to current distance + 1.",
      "Modify rooms in-place.",
    ],
    solution: `function wallsAndGates(rooms) {
  const INF = 2147483647;
  const rows = rooms.length, cols = rooms[0].length;
  const q = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rooms[r][c] === 0) q.push([r, c]);
    }
  }
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (q.length) {
    const [r, c] = q.shift();
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && rooms[nr][nc] === INF) {
        rooms[nr][nc] = rooms[r][c] + 1;
        q.push([nr, nc]);
      }
    }
  }
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Multi-source shortest-path on grids mirrors CDN Point-of-Presence (PoP) assignment: each user is served by the nearest PoP (gate), and precomputing the distance map avoids per-request Dijkstra by caching results in a geospatial index like PostGIS or Redis Geo.",
  },
  {
    id: "queue-21",
    title: "Shortest Path in Binary Matrix",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Matrix"],
    statement: "Given an n×n binary matrix, return the length of the shortest clear path (only 0s) from top-left to bottom-right using 8-directional movement. Return -1 if no such path exists.",
    examples: [
      { input: "grid = [[0,1],[1,0]]", output: "2" },
      { input: "grid = [[0,0,0],[1,1,0],[1,1,0]]", output: "4" },
    ],
    intuition: "BFS on a grid always finds the shortest path in terms of steps. Start at (0,0), expand in all 8 directions, and stop as soon as you reach (n-1,n-1).",
    approach: [
      "If start or end is 1, return -1.",
      "BFS from (0,0) with distance 1.",
      "For each cell, explore 8 neighbors. If in bounds and 0, mark visited and enqueue with distance+1.",
      "Return distance when (n-1,n-1) is reached.",
    ],
    solution: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n-1][n-1] === 1) return -1;
  const q = [[0, 0, 1]];
  grid[0][0] = 1;
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  while (q.length) {
    const [r, c, d] = q.shift();
    if (r === n - 1 && c === n - 1) return d;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
        grid[nr][nc] = 1;
        q.push([nr, nc, d + 1]);
      }
    }
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(n^2)", space: "O(n^2)" },
    systemDesign: "8-directional BFS pathfinding is used in game engines (A* with uniform cost reduces to BFS on unweighted grids) and drone route planning, where shortest obstacle-free path computation must complete in milliseconds and is often precomputed and cached in spatial hash maps.",
  },
  {
    id: "queue-22",
    title: "Open the Lock",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Hash Set"],
    statement: "A lock has 4 wheels, each with digits 0-9. Starting from '0000', find the minimum number of turns to reach the target, avoiding deadends. Each turn rotates one wheel by 1.",
    examples: [
      { input: "deadends = [\"0201\",\"0101\",\"0102\",\"1212\",\"2002\"], target = \"0202\"", output: "6" },
      { input: "deadends = [\"8888\"], target = \"0009\"", output: "1" },
    ],
    intuition: "This is BFS on a graph where each node is a 4-digit combination and edges connect combinations that differ by one wheel turn. BFS finds the minimum number of turns.",
    approach: [
      "Add deadends to a visited set. If '0000' is a deadend, return -1.",
      "BFS from '0000': for each state, generate 8 neighbors (4 wheels × 2 directions).",
      "If neighbor is target, return steps. If not visited and not deadend, enqueue.",
    ],
    solution: `function openLock(deadends, target) {
  const dead = new Set(deadends);
  if (dead.has("0000")) return -1;
  const q = [["0000", 0]];
  const visited = new Set(["0000"]);
  while (q.length) {
    const [state, steps] = q.shift();
    if (state === target) return steps;
    for (let i = 0; i < 4; i++) {
      for (const d of [-1, 1]) {
        const next = state.split("");
        next[i] = String((parseInt(next[i]) + d + 10) % 10);
        const ns = next.join("");
        if (!visited.has(ns) && !dead.has(ns)) {
          visited.add(ns);
          q.push([ns, steps + 1]);
        }
      }
    }
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(10^4 * 4 * 2)", space: "O(10^4)" },
    systemDesign: "State-space BFS models configuration reachability analysis in distributed systems — for example, finding the minimum number of config changes to migrate from one cluster state to another while avoiding invalid states, used in automated infrastructure provisioning tools like Terraform.",
  },
  {
    id: "queue-23",
    title: "Perfect Squares",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Dynamic Programming", "Math"],
    statement: "Given an integer n, return the least number of perfect square numbers that sum to n.",
    examples: [
      { input: "n = 12", output: "3", explanation: "4+4+4=12" },
      { input: "n = 13", output: "2", explanation: "4+9=13" },
    ],
    intuition: "Think of numbers as nodes and subtracting a perfect square as an edge. BFS from n finds the shortest path to 0 — each level is one more square used.",
    approach: [
      "Generate all perfect squares up to n.",
      "BFS from n: each level subtract one perfect square.",
      "First time you reach 0, return the level (number of squares).",
      "Use a visited set to avoid re-processing.",
    ],
    solution: `function numSquares(n) {
  const squares = [];
  for (let i = 1; i * i <= n; i++) squares.push(i * i);
  const visited = new Set([n]);
  let q = [n];
  let steps = 0;
  while (q.length) {
    steps++;
    const next = [];
    for (const curr of q) {
      for (const sq of squares) {
        const rem = curr - sq;
        if (rem === 0) return steps;
        if (rem > 0 && !visited.has(rem)) {
          visited.add(rem);
          next.push(rem);
        }
      }
    }
    q = next;
  }
  return steps;
}`,
    language: "javascript",
    complexity: { time: "O(n * sqrt(n))", space: "O(n)" },
    systemDesign: "Minimum-step decomposition problems appear in compiler optimization (minimum number of operations to reduce an expression) and in database query planning (minimum number of index lookups to satisfy a query), where BFS explores the state space of partial solutions.",
  },
  {
    id: "queue-24",
    title: "Snakes and Ladders",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Matrix"],
    statement: "Given an n×n board where -1 means no snake/ladder and positive values indicate destinations, find the minimum number of dice rolls to reach square n^2 from square 1.",
    examples: [
      { input: "board = [[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]", output: "4" },
    ],
    intuition: "Model the board as a graph where rolling a die gives up to 6 next positions, and snakes/ladders immediately teleport you. BFS from square 1 finds the minimum rolls to reach n^2.",
    approach: [
      "Create a mapping from square number (1-based) to board value, handling the boustrophedon layout.",
      "BFS from square 1, rolling 1-6 at each step.",
      "If landing on a snake/ladder, teleport to its destination.",
      "Return steps when n^2 is reached.",
    ],
    solution: `function snakesAndLadders(board) {
  const n = board.length;
  const getCell = (s) => {
    const idx = s - 1;
    const row = Math.floor(idx / n);
    const col = idx % n;
    const r = n - 1 - row;
    const c = row % 2 === 0 ? col : n - 1 - col;
    return board[r][c];
  };
  const visited = new Set([1]);
  let q = [[1, 0]];
  while (q.length) {
    const [curr, steps] = q.shift();
    for (let d = 1; d <= 6; d++) {
      let next = curr + d;
      if (next > n * n) break;
      const cell = getCell(next);
      if (cell !== -1) next = cell;
      if (next === n * n) return steps + 1;
      if (!visited.has(next)) {
        visited.add(next);
        q.push([next, steps + 1]);
      }
    }
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(n^2)", space: "O(n^2)" },
    systemDesign: "BFS with teleport edges models service mesh routing where certain requests are redirected (via load balancer rules or feature flags) to different service versions — the minimum hop count is used in circuit breaker analysis to identify the shortest degradation path in a microservices dependency graph.",
  },
  {
    id: "queue-25",
    title: "Jump Game III",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Array"],
    statement: "Given an array of non-negative integers and a start index, you can jump to index+arr[i] or index-arr[i]. Return true if you can reach any index with value 0.",
    examples: [
      { input: "arr = [4,2,3,0,3,1,2], start = 5", output: "true" },
      { input: "arr = [3,0,2,1,2], start = 2", output: "false" },
    ],
    intuition: "BFS from the start index, jumping to left and right positions at each step. If you land on a 0, you win. Use a visited set to avoid cycles.",
    approach: [
      "BFS from start.",
      "Each node: try index+arr[index] and index-arr[index].",
      "If either is in bounds and unvisited: if value is 0 return true, else enqueue.",
      "Return false if queue exhausted.",
    ],
    solution: `function canReach(arr, start) {
  const n = arr.length;
  const visited = new Set();
  const q = [start];
  visited.add(start);
  while (q.length) {
    const i = q.shift();
    if (arr[i] === 0) return true;
    for (const ni of [i + arr[i], i - arr[i]]) {
      if (ni >= 0 && ni < n && !visited.has(ni)) {
        visited.add(ni);
        q.push(ni);
      }
    }
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Reachability on jump graphs models hyperlink traversal in web crawlers and workflow engine state machines, where certain states (value 0) are terminal acceptance states — BFS ensures that if an acceptance state is reachable it is found with minimum transitions, important for SLA-driven automation pipelines.",
  },
  {
    id: "queue-26",
    title: "As Far from Land as Possible",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Matrix"],
    statement: "Given a binary grid where 1=land and 0=water, find the water cell with the maximum Manhattan distance to any land cell. Return that maximum distance, or -1 if no water or land exists.",
    examples: [
      { input: "grid = [[1,0,1],[0,0,0],[1,0,1]]", output: "2" },
      { input: "grid = [[1,0,0],[0,0,0],[0,0,0]]", output: "4" },
    ],
    intuition: "Multi-source BFS from all land cells simultaneously. The last water cell reached by the BFS wave is the farthest from any land — its level is the answer.",
    approach: [
      "Enqueue all land cells with distance 0.",
      "BFS outward into water cells, incrementing distance each level.",
      "The last cell dequeued is the farthest; return its distance, or -1 if no water exists.",
    ],
    solution: `function maxDistance(grid) {
  const n = grid.length;
  const q = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) q.push([r, c]);
    }
  }
  if (q.length === 0 || q.length === n * n) return -1;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  let ans = -1;
  while (q.length) {
    const [r, c] = q.shift();
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
        grid[nr][nc] = grid[r][c] + 1;
        ans = Math.max(ans, grid[nr][nc] - 1);
        q.push([nr, nc]);
      }
    }
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n^2)", space: "O(n^2)" },
    systemDesign: "Maximum distance from sources is used in data center placement algorithms and CDN node optimization, where you want to position new servers as far as possible from existing ones to maximize coverage and minimise worst-case latency for underserved geographic regions.",
  },
  {
    id: "queue-27",
    title: "Course Schedule (Kahn BFS Topological Sort)",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Topological Sort", "Graph"],
    statement: "There are numCourses courses. Given prerequisites pairs [a,b] meaning b must be taken before a, determine if it is possible to finish all courses (i.e., no cycle exists).",
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
      { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" },
    ],
    intuition: "If you can list all courses in an order where every prerequisite comes first, the schedule is possible. Kahn's algorithm peels away courses with no remaining prerequisites one by one — a cycle means some courses can never be peeled.",
    approach: [
      "Build adjacency list and in-degree array.",
      "Enqueue all courses with in-degree 0.",
      "BFS: dequeue course, decrement neighbors' in-degrees, enqueue those reaching 0.",
      "If processed count equals numCourses, no cycle — return true.",
    ],
    solution: `function canFinish(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    inDegree[a]++;
  }
  const q = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) q.push(i);
  }
  let processed = 0;
  while (q.length) {
    const course = q.shift();
    processed++;
    for (const next of adj[course]) {
      if (--inDegree[next] === 0) q.push(next);
    }
  }
  return processed === numCourses;
}`,
    language: "javascript",
    complexity: { time: "O(V+E)", space: "O(V+E)" },
    systemDesign: "Topological sort via Kahn's BFS is the backbone of CI/CD pipeline orchestration (GitHub Actions, Jenkins) and build systems (Bazel, Make), where tasks with no unresolved dependencies are dispatched first and downstream tasks are queued as their dependencies complete, enabling maximum parallelism.",
  },
  {
    id: "queue-28",
    title: "Minimum Knight Moves",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Math"],
    statement: "A knight starts at (0,0) on an infinite chessboard. Return the minimum number of moves to reach (x,y).",
    examples: [
      { input: "x = 2, y = 1", output: "1" },
      { input: "x = 5, y = 5", output: "4" },
    ],
    intuition: "BFS from (0,0), trying all 8 knight moves at each step. Because all moves cost the same, BFS guarantees the first time you reach (x,y) is the minimum. Symmetry lets us restrict to the first quadrant.",
    approach: [
      "Normalize to first quadrant using Math.abs.",
      "BFS from (0,0) with all 8 knight move offsets.",
      "Use visited set. Return steps when (x,y) is reached.",
      "Allow slightly negative coordinates (down to -2) to handle corner cases.",
    ],
    solution: `function minKnightMoves(x, y) {
  x = Math.abs(x); y = Math.abs(y);
  const moves = [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
  const visited = new Set(["0,0"]);
  let q = [[0, 0]];
  let steps = 0;
  while (true) {
    const next = [];
    for (const [cx, cy] of q) {
      if (cx === x && cy === y) return steps;
      for (const [dx, dy] of moves) {
        const nx = cx + dx, ny = cy + dy;
        const key = nx + "," + ny;
        if (!visited.has(key) && nx >= -2 && ny >= -2) {
          visited.add(key);
          next.push([nx, ny]);
        }
      }
    }
    q = next;
    steps++;
  }
}`,
    language: "javascript",
    complexity: { time: "O(max(x,y)^2)", space: "O(max(x,y)^2)" },
    systemDesign: "Minimum-hop pathfinding on constrained move-sets appears in network routing where routers have specific peering agreements (limited adjacency) — BFS finds the minimum-hop path through the AS (Autonomous System) graph, which underpins BGP route selection in internet backbone networks.",
  },
  {
    id: "queue-29",
    title: "Shortest Bridge",
    difficulty: "Medium",
    tags: ["BFS", "DFS", "Queue", "Matrix"],
    statement: "Given a binary matrix with exactly two islands, return the minimum number of 0s you must flip to connect them (shortest bridge).",
    examples: [
      { input: "grid = [[0,1],[1,0]]", output: "1" },
      { input: "grid = [[0,1,0],[0,0,0],[0,0,1]]", output: "2" },
    ],
    intuition: "DFS to find and mark the first island. Then BFS outward from all its cells simultaneously until you touch the second island. The number of BFS levels is the bridge length.",
    approach: [
      "DFS to find all cells of island 1, mark them as 2, enqueue them.",
      "BFS outward from island 1, incrementing distance.",
      "The first time you hit a cell marked 1 (island 2), return current distance.",
    ],
    solution: `function shortestBridge(grid) {
  const n = grid.length;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  const q = [];
  let found = false;
  const dfs = (r, c) => {
    if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] !== 1) return;
    grid[r][c] = 2;
    q.push([r, c]);
    for (const [dr, dc] of dirs) dfs(r + dr, c + dc);
  };
  outer: for (let r = 0; r < n && !found; r++) {
    for (let c = 0; c < n && !found; c++) {
      if (grid[r][c] === 1) { dfs(r, c); found = true; }
    }
  }
  let steps = 0;
  while (q.length) {
    const size = q.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = q.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
          if (grid[nr][nc] === 1) return steps;
          if (grid[nr][nc] === 0) { grid[nr][nc] = 2; q.push([nr, nc]); }
        }
      }
    }
    steps++;
  }
  return steps;
}`,
    language: "javascript",
    complexity: { time: "O(n^2)", space: "O(n^2)" },
    systemDesign: "Shortest bridge between two network islands models minimum-cost peering between two AS regions in telecommunications, or the minimum number of additional database replicas needed to bridge two geographically isolated data center clusters for disaster recovery connectivity.",
  },
  {
    id: "queue-30",
    title: "Bus Routes",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Graph"],
    statement: "You are given an array of bus routes where routes[i] is the list of stops for bus i. Starting at source, return the minimum number of buses to take to reach target.",
    examples: [
      { input: "routes = [[1,2,7],[3,6,7]], source = 1, target = 6", output: "2" },
      { input: "routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12", output: "1" },
    ],
    intuition: "Model routes as nodes. Two routes are connected if they share a stop. BFS counts the minimum number of route changes (buses) to reach a stop on any route containing the target.",
    approach: [
      "Build map: stop -> list of route indices.",
      "BFS on routes (not stops): start with all routes containing source.",
      "For each route, explore all stops; from each stop get all connected routes not yet visited.",
      "Return bus count when target stop is encountered.",
    ],
    solution: `function numBusesToDestination(routes, source, target) {
  if (source === target) return 0;
  const stopToRoutes = new Map();
  for (let i = 0; i < routes.length; i++) {
    for (const stop of routes[i]) {
      if (!stopToRoutes.has(stop)) stopToRoutes.set(stop, []);
      stopToRoutes.get(stop).push(i);
    }
  }
  const visitedRoutes = new Set();
  const visitedStops = new Set([source]);
  let q = [source];
  let buses = 0;
  while (q.length) {
    buses++;
    const nextQ = [];
    for (const stop of q) {
      for (const route of (stopToRoutes.get(stop) || [])) {
        if (visitedRoutes.has(route)) continue;
        visitedRoutes.add(route);
        for (const s of routes[route]) {
          if (s === target) return buses;
          if (!visitedStops.has(s)) {
            visitedStops.add(s);
            nextQ.push(s);
          }
        }
      }
    }
    q = nextQ;
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(sum of route lengths)", space: "O(same)" },
    systemDesign: "Minimum transfer routing is the core of multi-modal transit journey planners (Google Maps, Citymapper) and in microservices architectures where minimising the number of service hops (round trips) between a client request and its data source directly impacts tail latency at scale.",
  },
  {
    id: "queue-31",
    title: "Word Ladder",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "String", "Graph"],
    statement: "Given a beginWord, endWord, and wordList, find the length of the shortest transformation sequence where each step changes exactly one letter and each intermediate word must be in wordList.",
    examples: [
      { input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", output: "5" },
      { input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]", output: "0" },
    ],
    intuition: "Each word is a node and two words are connected if they differ by one letter. BFS finds the shortest path from beginWord to endWord in this graph.",
    approach: [
      "Add wordList to a set. If endWord not present, return 0.",
      "BFS from beginWord with level=1.",
      "For each word, try changing each character to a-z; if result is in wordSet and not visited, enqueue.",
      "Return level when endWord is dequeued.",
    ],
    solution: `function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  let q = [[beginWord, 1]];
  const visited = new Set([beginWord]);
  while (q.length) {
    const [word, steps] = q.shift();
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (next === endWord) return steps + 1;
        if (wordSet.has(next) && !visited.has(next)) {
          visited.add(next);
          q.push([next, steps + 1]);
        }
      }
    }
  }
  return 0;
}`,
    language: "javascript",
    complexity: { time: "O(M^2 * N) where M=word length, N=wordList size", space: "O(M^2 * N)" },
    systemDesign: "Word-graph BFS is analogous to schema migration path-finding in databases — given a current schema and a target schema, finding the minimum sequence of non-breaking migrations (each changing one column/table) is the same shortest-path problem, used in automated migration tools like Flyway.",
  },
  {
    id: "queue-32",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    tags: ["Deque", "Sliding Window", "Monotonic Queue"],
    statement: "Given an array nums and integer k, return an array of the maximum values in each sliding window of size k.",
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    intuition: "Use a deque that stores indices in decreasing order of their values. When a new element arrives, pop smaller elements from the back (they can never be the maximum). The front is always the current window's maximum.",
    approach: [
      "Maintain a deque of indices (decreasing values).",
      "For each index i: remove from back while nums[deque.back] <= nums[i].",
      "Remove from front if front index is outside the window (< i-k+1).",
      "Push i to back. If i >= k-1, push nums[deque.front] to result.",
    ],
    solution: `function maxSlidingWindow(nums, k) {
  const dq = []; // stores indices
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[0] < i - k + 1) dq.shift();
    if (i >= k - 1) result.push(nums[dq[0]]);
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "Monotonic deque-based sliding window maximums power real-time anomaly detection in time-series monitoring (Prometheus, Datadog), where finding the peak metric value in a rolling window without re-scanning the entire window each tick is critical for high-frequency alerting systems processing millions of metrics per second.",
    pitfalls: ["Remove from front when index is out of window BEFORE checking if window is full.", "Use non-strict comparison (<=) when removing from back so equal elements earlier in the window are correctly evicted."],
  },
  {
    id: "queue-33",
    title: "Shortest Subarray with Sum at Least K",
    difficulty: "Hard",
    tags: ["Deque", "Prefix Sum", "Monotonic Queue"],
    statement: "Given an integer array nums (may contain negatives) and integer k, return the length of the shortest subarray with sum at least k. Return -1 if no such subarray exists.",
    examples: [
      { input: "nums = [2,-1,2], k = 3", output: "3" },
      { input: "nums = [1,2], k = 4", output: "-1" },
    ],
    intuition: "Build prefix sums. For each right endpoint, you want the largest left endpoint where prefix[right]-prefix[left] >= k. A monotonic deque of prefix sum indices lets you find this efficiently.",
    approach: [
      "Compute prefix sum array P of length n+1.",
      "Maintain a deque of indices with increasing P values.",
      "For each i: while deque front satisfies P[i]-P[deque.front] >= k, record length and pop front.",
      "While back of deque has P[back] >= P[i], pop back. Push i.",
    ],
    solution: `function shortestSubarray(nums, k) {
  const n = nums.length;
  const P = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];
  const dq = [];
  let ans = Infinity;
  for (let i = 0; i <= n; i++) {
    while (dq.length && P[i] - P[dq[0]] >= k) {
      ans = Math.min(ans, i - dq.shift());
    }
    while (dq.length && P[dq[dq.length - 1]] >= P[i]) dq.pop();
    dq.push(i);
  }
  return ans === Infinity ? -1 : ans;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Shortest window satisfying a threshold on prefix sums is used in financial risk engines to find the shortest time interval where cumulative P&L exceeds a drawdown limit, and in network traffic analysis to detect the briefest burst of traffic exceeding a bandwidth threshold for SLA violation detection.",
    pitfalls: ["This works for negative numbers unlike the standard two-pointer approach which requires non-negative values.", "Pop from front to find valid windows, pop from back to maintain monotonicity."],
  },
  {
    id: "queue-34",
    title: "Jump Game VI",
    difficulty: "Hard",
    tags: ["Deque", "Dynamic Programming", "Monotonic Queue"],
    statement: "Given a 0-indexed array nums and integer k, starting at index 0 you can jump to any index in [i+1, i+k]. Return the maximum score (sum of visited elements) to reach the last index.",
    examples: [
      { input: "nums = [1,-1,-2,4,-7,3], k = 2", output: "7" },
      { input: "nums = [10,-5,-2,4,0,3], k = 3", output: "17" },
    ],
    intuition: "dp[i] = best score to reach index i. It equals nums[i] + max(dp[i-1], ..., dp[i-k]). Use a sliding window maximum deque to find that max in O(1).",
    approach: [
      "dp[0] = nums[0]. Deque stores indices with decreasing dp values.",
      "For i = 1 to n-1: remove deque front if out of window (< i-k).",
      "dp[i] = nums[i] + dp[deque.front].",
      "Remove from back while dp[back] <= dp[i]. Push i.",
      "Return dp[n-1].",
    ],
    solution: `function maxResult(nums, k) {
  const n = nums.length;
  const dp = new Array(n).fill(0);
  dp[0] = nums[0];
  const dq = [0];
  for (let i = 1; i < n; i++) {
    if (dq[0] < i - k) dq.shift();
    dp[i] = nums[i] + dp[dq[0]];
    while (dq.length && dp[dq[dq.length - 1]] <= dp[i]) dq.pop();
    dq.push(i);
  }
  return dp[n - 1];
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Sliding window DP optimisation with monotonic deques appears in sequence-based recommendation systems, where the best user engagement score reachable from a content item depends on the maximum-scoring item within the last k positions of the session, enabling real-time personalisation at O(n) cost.",
  },
  {
    id: "queue-35",
    title: "Constrained Subsequence Sum",
    difficulty: "Hard",
    tags: ["Deque", "Dynamic Programming", "Monotonic Queue"],
    statement: "Given an integer array nums and integer k, return the maximum sum of a non-empty subsequence such that for every two consecutive elements in the subsequence, their indices differ by at most k.",
    examples: [
      { input: "nums = [10,2,-10,5,20], k = 2", output: "37", explanation: "10+2+5+20=37" },
      { input: "nums = [-1,-2,-3], k = 1", output: "-1" },
    ],
    intuition: "dp[i] = maximum subsequence sum ending at i. You can extend from any j in [i-k, i-1] if dp[j] > 0. Use a monotonic deque to get max(dp[i-k..i-1]) in O(1).",
    approach: [
      "dp[i] = nums[i] + max(0, max(dp[i-k..i-1])).",
      "Deque stores indices with decreasing dp values (only positive dp values matter).",
      "Remove front if out of window. dp[i] = nums[i] + (dp[dq.front]>0 ? dp[dq.front] : 0).",
      "Maintain deque monotonicity. Return max of all dp values.",
    ],
    solution: `function constrainedSubsetSum(nums, k) {
  const n = nums.length;
  const dp = [...nums];
  const dq = [];
  let ans = -Infinity;
  for (let i = 0; i < n; i++) {
    if (dq.length && dq[0] < i - k) dq.shift();
    if (dq.length && dp[dq[0]] > 0) dp[i] += dp[dq[0]];
    ans = Math.max(ans, dp[i]);
    while (dq.length && dp[dq[dq.length - 1]] <= dp[i]) dq.pop();
    dq.push(i);
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Constrained-window DP optimisation powers portfolio optimisation engines where position changes are limited to k trading days, ensuring the algorithm finds the maximum-return subsequence of trades within regulatory holding-period constraints — a direct application in quantitative finance systems.",
  },
  {
    id: "queue-36",
    title: "Sum of Subarray Minimums",
    difficulty: "Hard",
    tags: ["Monotonic Queue", "Stack", "Array"],
    statement: "Given an integer array arr, find the sum of min(b) for every subarray b. Since the answer may be large, return it modulo 10^9 + 7.",
    examples: [
      { input: "arr = [3,1,2,4]", output: "17", explanation: "Subarrays: [3]=3,[1]=1,[2]=2,[4]=4,[3,1]=1,[1,2]=1,[2,4]=2,[3,1,2]=1,[1,2,4]=1,[3,1,2,4]=1. Sum=17." },
    ],
    intuition: "For each element, count how many subarrays have it as the minimum. This equals (left distance) * (right distance), where distances are to the previous and next smaller element.",
    approach: [
      "Use a monotonic stack to find left[i] = distance to previous smaller (or equal), right[i] = distance to next smaller.",
      "contribution of arr[i] = arr[i] * left[i] * right[i].",
      "Sum all contributions mod 10^9+7.",
    ],
    solution: `function sumSubarrayMins(arr) {
  const MOD = 1e9 + 7;
  const n = arr.length;
  const left = new Array(n), right = new Array(n);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && arr[stack[stack.length-1]] >= arr[i]) stack.pop();
    left[i] = stack.length ? i - stack[stack.length-1] : i + 1;
    stack.push(i);
  }
  stack.length = 0;
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length && arr[stack[stack.length-1]] > arr[i]) stack.pop();
    right[i] = stack.length ? stack[stack.length-1] - i : n - i;
    stack.push(i);
  }
  let ans = 0;
  for (let i = 0; i < n; i++) {
    ans = (ans + arr[i] * left[i] * right[i]) % MOD;
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Contribution counting with monotonic stacks is used in query optimizers to estimate aggregate statistics over all subranges (e.g., minimum cost in every time window for infrastructure billing), avoiding O(n^2) subarray enumeration through mathematical decomposition.",
    pitfalls: ["Use strictly greater on one side and greater-or-equal on the other to avoid double-counting equal elements.", "The MOD must be applied carefully since products of large indices can overflow 32-bit integers."],
  },
  {
    id: "queue-37",
    title: "Max Value of Equation",
    difficulty: "Hard",
    tags: ["Deque", "Sliding Window", "Monotonic Queue"],
    statement: "Given a sorted array of points [xi, yi] and integer k, find the maximum value of yi + yj + |xi - xj| where |xi - xj| <= k and i < j. Since points are sorted, |xi-xj| = xj-xi.",
    examples: [
      { input: "points = [[1,3],[2,0],[5,10],[6,-10]], k = 1", output: "4" },
      { input: "points = [[0,0],[3,0],[9,2]], k = 3", output: "3" },
    ],
    intuition: "Rewrite yi+yj+xj-xi as (yj+xj) + (yi-xi). For each j, maximise (yi-xi) over all i in the window [xj-k, xj]. Use a monotonic deque to track the max (yi-xi).",
    approach: [
      "Deque stores (value=yi-xi, index=xi) in decreasing value order.",
      "For each point j: remove deque front if xj - front.x > k.",
      "Compute candidate = dq.front.value + yj + xj, update ans.",
      "Remove from back while back.value <= yj-xj. Push (yj-xj, xj).",
    ],
    solution: `function findMaxValueOfEquation(points, k) {
  const dq = []; // [yi-xi, xi]
  let ans = -Infinity;
  for (const [xj, yj] of points) {
    while (dq.length && xj - dq[0][1] > k) dq.shift();
    if (dq.length) ans = Math.max(ans, dq[0][0] + yj + xj);
    while (dq.length && dq[dq.length-1][0] <= yj - xj) dq.pop();
    dq.push([yj - xj, xj]);
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Maximising a linear expression over a sliding window of sorted events models ad auction optimisation, where the platform selects the best advertiser pair (i,j) within a recency window to maximise combined bid value — monotonic deques reduce this from O(n^2) to O(n) enabling real-time auction clearing.",
  },
  {
    id: "queue-38",
    title: "Shortest Path Visiting All Nodes",
    difficulty: "Hard",
    tags: ["BFS", "Queue", "Bitmask", "Graph"],
    statement: "Given an undirected graph, return the length of the shortest path that visits every node at least once. You may start and stop at any node and revisit nodes.",
    examples: [
      { input: "graph = [[1,2,3],[0],[0],[0]]", output: "4" },
      { input: "graph = [[1],[0,2,4],[1,3,4],[2],[1,2]]", output: "4" },
    ],
    intuition: "State = (current node, bitmask of visited nodes). BFS over this state space finds the shortest path to the all-visited bitmask. Starting from all nodes simultaneously handles any starting point.",
    approach: [
      "Initialize BFS with all nodes as starting states, each with bitmask having only that node set.",
      "State: [node, visitedMask]. Target: (1<<n)-1.",
      "BFS: for each neighbor, compute newMask = mask | (1<<neighbor). If not visited state, enqueue.",
      "Return steps when target mask is reached.",
    ],
    solution: `function shortestPathLength(graph) {
  const n = graph.length;
  const full = (1 << n) - 1;
  const visited = new Set();
  const q = [];
  for (let i = 0; i < n; i++) {
    const state = [i, 1 << i, 0];
    q.push(state);
    visited.add(i + "," + (1 << i));
  }
  while (q.length) {
    const [node, mask, steps] = q.shift();
    if (mask === full) return steps;
    for (const nb of graph[node]) {
      const newMask = mask | (1 << nb);
      const key = nb + "," + newMask;
      if (!visited.has(key)) {
        visited.add(key);
        q.push([nb, newMask, steps + 1]);
      }
    }
  }
  return 0;
}`,
    language: "javascript",
    complexity: { time: "O(2^n * n^2)", space: "O(2^n * n)" },
    systemDesign: "Bitmask BFS for full-coverage shortest paths solves data collection routing in IoT sensor networks (minimum distance tour visiting all sensors) and in database replication, where a coordinator must confirm all n replicas received a write — the bitmask tracks acknowledgement state across the replication topology.",
  },
  {
    id: "queue-39",
    title: "Continuous Subarray Sum",
    difficulty: "Medium",
    tags: ["Queue", "Prefix Sum", "Hashing"],
    statement: "Given an integer array nums and integer k, return true if nums has a good subarray — a contiguous subarray of length at least 2 whose sum is a multiple of k.",
    examples: [
      { input: "nums = [23,2,4,6,7], k = 6", output: "true", explanation: "[2,4] sums to 6." },
      { input: "nums = [23,2,6,4,7], k = 6", output: "true", explanation: "[23,2,6,4,7] sums to 42." },
    ],
    intuition: "If two prefix sums have the same remainder when divided by k, the subarray between them is a multiple of k. Store the first occurrence of each remainder; if it appears again at least 2 positions later, return true.",
    approach: [
      "Map remainders to their earliest index. Start with {0: -1}.",
      "Compute running prefix sum mod k.",
      "If remainder seen before and gap >= 2, return true.",
      "Otherwise store remainder -> current index.",
    ],
    solution: `function checkSubarraySum(nums, k) {
  const map = new Map([[0, -1]]);
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum = (sum + nums[i]) % k;
    if (map.has(sum)) {
      if (i - map.get(sum) >= 2) return true;
    } else {
      map.set(sum, i);
    }
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "Modular prefix sum checks are used in distributed billing systems to detect billing cycles — verifying that cumulative charges at two points differ by exactly a billing period multiple ensures correct invoice generation without re-summing all transactions, critical in high-volume SaaS metering systems.",
  },
  {
    id: "queue-40",
    title: "Design a Task Scheduler Queue",
    difficulty: "Medium",
    tags: ["Queue", "Design", "Priority Queue"],
    statement: "Design a task scheduler that processes tasks in FIFO order but allows tasks to be scheduled with a minimum start time. enqueue(task, availableTime) adds a task; processNext(currentTime) returns and removes the earliest-available task whose availableTime <= currentTime, or -1.",
    examples: [
      { input: "enqueue(A,0), enqueue(B,5), processNext(3)->A, processNext(3)->-1, processNext(6)->B", output: "A, -1, B" },
    ],
    intuition: "Maintain a sorted queue by availableTime. On processNext, find the front task whose availableTime is at most currentTime. This is a simplified version of how OS schedulers dispatch ready tasks.",
    approach: [
      "Keep an array of {task, availableTime} sorted by availableTime.",
      "enqueue: insert in sorted position.",
      "processNext(t): find first task with availableTime <= t, remove and return it.",
    ],
    solution: `class TaskScheduler {
  constructor() {
    this.queue = [];
  }
  enqueue(task, availableTime) {
    let i = 0;
    while (i < this.queue.length && this.queue[i].availableTime <= availableTime) i++;
    this.queue.splice(i, 0, { task, availableTime });
  }
  processNext(currentTime) {
    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i].availableTime <= currentTime) {
        return this.queue.splice(i, 1)[0].task;
      }
    }
    return -1;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n) enqueue, O(n) processNext", space: "O(n)" },
    systemDesign: "Delayed task queues are fundamental to job schedulers like AWS SQS delay queues, Celery ETA tasks, and cron-based systems, where tasks become visible only after their scheduled time — at scale these use sorted sets in Redis (ZRANGEBYSCORE) to fetch ready tasks in O(log n) per poll cycle.",
  },
  {
    id: "queue-41",
    title: "Zigzag Iterator",
    difficulty: "Medium",
    tags: ["Queue", "Design", "Iterator"],
    statement: "Given two 1D vectors, implement an iterator that returns elements from them in alternating (zigzag) order. For v1=[1,2] and v2=[3,4,5,6], next() returns 1,3,2,4,5,6.",
    examples: [
      { input: "v1=[1,2], v2=[3,4,5,6]", output: "1,3,2,4,5,6" },
    ],
    intuition: "Use a queue of iterators. Each call to next() dequeues one iterator, takes its next value, and if it has more elements re-enqueues it. The queue naturally produces zigzag order.",
    approach: [
      "Enqueue non-empty vectors as [array, index] pairs.",
      "hasNext: queue is non-empty.",
      "next: dequeue front, take element at its current index, if more remain re-enqueue with incremented index.",
    ],
    solution: `class ZigzagIterator {
  constructor(v1, v2) {
    this.q = [];
    if (v1.length) this.q.push([v1, 0]);
    if (v2.length) this.q.push([v2, 0]);
  }
  next() {
    const [arr, idx] = this.q.shift();
    if (idx + 1 < arr.length) this.q.push([arr, idx + 1]);
    return arr[idx];
  }
  hasNext() {
    return this.q.length > 0;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) per next()", space: "O(k) where k is number of vectors" },
    systemDesign: "Zigzag (round-robin) iteration is the basis of fair-share schedulers in multi-tenant databases (Snowflake virtual warehouses) and streaming pipelines (Kafka consumer group round-robin partition assignment), ensuring no single producer monopolises throughput and all sources are drained at equal rates.",
  },
  {
    id: "queue-42",
    title: "Maximum Width of Binary Tree (BFS Level)",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Binary Tree"],
    statement: "Given the root of a binary tree, return the maximum width of any level. The width is the length between the leftmost and rightmost non-null nodes, including null nodes between them.",
    examples: [
      { input: "root = [1,3,2,5,3,null,9]", output: "4" },
      { input: "root = [1,3,2,5,null,null,9,6,null,7]", output: "7" },
    ],
    intuition: "Assign each node a position index (left child = 2*i, right child = 2*i+1). At each BFS level, the width is last_index - first_index + 1. Normalise indices to prevent overflow.",
    approach: [
      "BFS with [node, index] pairs.",
      "At each level, normalize indices by subtracting the first index in that level.",
      "Width = last_index - first_index + 1. Track max.",
    ],
    solution: `function widthOfBinaryTree(root) {
  if (!root) return 0;
  let ans = 0;
  let q = [[root, 0n]];
  while (q.length) {
    const size = q.length;
    const base = q[0][1];
    let first = 0n, last = 0n;
    const next = [];
    for (let i = 0; i < size; i++) {
      const [node, idx] = q[i];
      const pos = idx - base;
      if (i === 0) first = pos;
      if (i === size - 1) last = pos;
      if (node.left) next.push([node.left, 2n * idx]);
      if (node.right) next.push([node.right, 2n * idx + 1n]);
    }
    ans = Math.max(ans, Number(last - first + 1n));
    q = next;
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Level-by-level BFS with positional indexing models how distributed systems assign shard IDs in consistent hashing trees — the width of any ring segment determines load distribution skew, and normalising position indices prevents integer overflow in deep binary partition trees used in distributed databases like DynamoDB.",
  },
  {
    id: "queue-43",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Binary Tree"],
    statement: "Given the root of a binary tree, return its level order traversal as a list of lists of node values.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
      { input: "root = []", output: "[]" },
    ],
    intuition: "BFS naturally visits nodes level by level. Process all nodes at the current level before moving to the next — track level size at the start of each iteration.",
    approach: [
      "If root is null return [].",
      "Queue starts with root.",
      "Each iteration: record queue size (level size), process exactly that many nodes, enqueue their children.",
      "Add level values to result.",
    ],
    solution: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  let q = [root];
  while (q.length) {
    const level = [];
    const size = q.length;
    const next = [];
    for (let i = 0; i < size; i++) {
      level.push(q[i].val);
      if (q[i].left) next.push(q[i].left);
      if (q[i].right) next.push(q[i].right);
    }
    result.push(level);
    q = next;
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Level-order traversal maps directly to hierarchical data processing in org-chart systems and file system indexing, where breadth-first scanning of directory trees ensures parent directories are indexed before children — the same pattern used by web crawlers to prioritise shallow pages over deep ones.",
  },
  {
    id: "queue-44",
    title: "Clone Graph (BFS)",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Graph"],
    statement: "Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node has a value and a list of neighbors.",
    examples: [
      { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]" },
    ],
    intuition: "BFS the original graph. For each original node, create its clone if not yet created. For each neighbor, create its clone and link it. A map from original to clone prevents re-processing.",
    approach: [
      "Create clone of start node. Map original -> clone.",
      "BFS from start: for each neighbor, if not in map create clone and enqueue.",
      "Always add neighbor's clone to current clone's neighbor list.",
    ],
    solution: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  map.set(node, { val: node.val, neighbors: [] });
  const q = [node];
  while (q.length) {
    const curr = q.shift();
    for (const nb of curr.neighbors) {
      if (!map.has(nb)) {
        map.set(nb, { val: nb.val, neighbors: [] });
        q.push(nb);
      }
      map.get(curr).neighbors.push(map.get(nb));
    }
  }
  return map.get(node);
}`,
    language: "javascript",
    complexity: { time: "O(V+E)", space: "O(V)" },
    systemDesign: "Deep cloning with reference deduplication maps to object graph serialisation in distributed systems — when checkpointing actor state (Akka, Orleans) or snapshotting a distributed transaction, every referenced object must be copied exactly once, using an identity map (like our BFS map) to handle cycles.",
  },
  {
    id: "queue-45",
    title: "Pacific Atlantic Water Flow (BFS)",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Matrix"],
    statement: "Given an m×n matrix of heights, water can flow to adjacent cells of equal or lower height. Find all cells from which water can reach both the Pacific (top/left edges) and Atlantic (bottom/right edges) oceans.",
    examples: [
      { input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]" },
    ],
    intuition: "Reverse the flow: BFS inward from Pacific border uphill marks all Pacific-reachable cells. Do the same from Atlantic. Cells in both sets are the answer.",
    approach: [
      "BFS from Pacific border cells (top row + left col), moving to neighbors with height >= current.",
      "BFS from Atlantic border cells (bottom row + right col) similarly.",
      "Collect cells in both visited sets.",
    ],
    solution: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  const bfs = (starts) => {
    const visited = new Set(starts.map(([r,c]) => r+","+c));
    const q = [...starts];
    while (q.length) {
      const [r, c] = q.shift();
      for (const [dr, dc] of dirs) {
        const nr = r+dr, nc = c+dc;
        const key = nr+","+nc;
        if (nr>=0 && nr<rows && nc>=0 && nc<cols && !visited.has(key) && heights[nr][nc] >= heights[r][c]) {
          visited.add(key);
          q.push([nr, nc]);
        }
      }
    }
    return visited;
  };
  const pac = [], atl = [];
  for (let r = 0; r < rows; r++) { pac.push([r,0]); atl.push([r,cols-1]); }
  for (let c = 0; c < cols; c++) { pac.push([0,c]); atl.push([rows-1,c]); }
  const pSet = bfs(pac), aSet = bfs(atl);
  const res = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pSet.has(r+","+c) && aSet.has(r+","+c)) res.push([r,c]);
    }
  }
  return res;
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Reverse-flow reachability analysis models data lineage in ETL pipelines — determining which data sources can contribute to a given downstream report requires backward BFS through the transformation graph, used by data governance tools like Apache Atlas to track data provenance at enterprise scale.",
  },
  {
    id: "queue-46",
    title: "Minimum Height Trees (BFS Leaf Trimming)",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Graph", "Topological Sort"],
    statement: "Given a tree of n nodes, find all root labels that minimise the tree height.",
    examples: [
      { input: "n = 4, edges = [[1,0],[1,2],[1,3]]", output: "[1]" },
      { input: "n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]", output: "[3,4]" },
    ],
    intuition: "Trim leaf nodes layer by layer (like peeling an onion) until 1 or 2 nodes remain. Those central nodes are the MHT roots. This is topological sort applied to undirected trees.",
    approach: [
      "Build adjacency list and degree array. Enqueue all leaves (degree 1).",
      "Repeatedly trim leaves: add their neighbors to new leaf queue when their degree drops to 1.",
      "Stop when n <= 2. Return remaining nodes.",
    ],
    solution: `function findMinHeightTrees(n, edges) {
  if (n === 1) return [0];
  const adj = Array.from({ length: n }, () => new Set());
  for (const [u, v] of edges) { adj[u].add(v); adj[v].add(u); }
  let leaves = [];
  for (let i = 0; i < n; i++) if (adj[i].size === 1) leaves.push(i);
  let remaining = n;
  while (remaining > 2) {
    remaining -= leaves.length;
    const newLeaves = [];
    for (const leaf of leaves) {
      const nb = [...adj[leaf]][0];
      adj[nb].delete(leaf);
      if (adj[nb].size === 1) newLeaves.push(nb);
    }
    leaves = newLeaves;
  }
  return leaves;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Iterative leaf-trimming to find graph centroids is used in network topology optimisation to place a central routing server that minimises the maximum hop count to all nodes — the same algorithm determines optimal placement of a master node in distributed consensus clusters to minimise election propagation delay.",
  },
  {
    id: "queue-47",
    title: "Nearest Exit from Entrance in Maze",
    difficulty: "Medium",
    tags: ["BFS", "Queue", "Matrix"],
    statement: "Given a maze grid where '.' is empty and '+' is wall, find the nearest exit from the entrance cell. An exit is any '.' cell on the border that is not the entrance itself.",
    examples: [
      { input: "maze = [[\"+\",\"+\",\".\",\"+\"],\".\",\".\",\".\",\"+\"],[\".\",\"+\",\".\",\"+\"]], entrance = [1,2]", output: "1" },
      { input: "maze = [[\"+\",\"+\",\"+\"],[\".\",\".\",\".\"],[\"+\",\"+\",\"+\"]], entrance = [1,0]", output: "2" },
    ],
    intuition: "BFS from the entrance, expanding one step at a time. The first border cell you reach (that is not the entrance) is the nearest exit, and BFS guarantees minimum steps.",
    approach: [
      "BFS from entrance, mark visited.",
      "For each cell, check if it is a border cell and not the entrance — if yes return current steps.",
      "Expand to unvisited '.' neighbors.",
      "Return -1 if queue exhausted.",
    ],
    solution: `function nearestExit(maze, entrance) {
  const rows = maze.length, cols = maze[0].length;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  const q = [[entrance[0], entrance[1], 0]];
  maze[entrance[0]][entrance[1]] = "+";
  while (q.length) {
    const [r, c, steps] = q.shift();
    for (const [dr, dc] of dirs) {
      const nr = r+dr, nc = c+dc;
      if (nr>=0 && nr<rows && nc>=0 && nc<cols && maze[nr][nc] === ".") {
        if (nr===0 || nr===rows-1 || nc===0 || nc===cols-1) return steps+1;
        maze[nr][nc] = "+";
        q.push([nr, nc, steps+1]);
      }
    }
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Nearest-exit BFS models failover path finding in network redundancy analysis, where given a failed primary link, the system BFS through the topology to find the shortest-hop alternative path to a border gateway — this is how OSPF computes backup routes in enterprise network infrastructure.",
  },
  {
    id: "queue-48",
    title: "Longest Increasing Path in a Matrix (BFS Topological)",
    difficulty: "Hard",
    tags: ["BFS", "Queue", "Topological Sort", "Matrix", "Dynamic Programming"],
    statement: "Given an m×n integer matrix, return the length of the longest strictly increasing path. You can move in 4 directions.",
    examples: [
      { input: "matrix = [[9,9,4],[6,6,8],[2,1,1]]", output: "4", explanation: "[1,2,6,9]" },
      { input: "matrix = [[3,4,5],[3,2,6],[2,2,1]]", output: "4" },
    ],
    intuition: "Model cells as a DAG where edges point from smaller to larger values. Find the longest path in this DAG using topological sort BFS — process cells with no incoming edges (no smaller neighbors) first.",
    approach: [
      "Compute in-degree: number of smaller neighbours for each cell.",
      "Enqueue cells with in-degree 0 (local minima). Level = 1.",
      "BFS: for each cell, decrement neighbors' in-degree; when 0 enqueue at next level.",
      "Return max level reached.",
    ],
    solution: `function longestIncreasingPath(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  const inDeg = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for (const [dr, dc] of dirs) {
        const nr = r+dr, nc = c+dc;
        if (nr>=0 && nr<rows && nc>=0 && nc<cols && matrix[nr][nc] > matrix[r][c]) {
          inDeg[nr][nc]++;
        }
      }
    }
  }
  const q = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (inDeg[r][c] === 0) q.push([r, c]);
    }
  }
  let length = 0;
  let curr = q;
  while (curr.length) {
    length++;
    const next = [];
    for (const [r, c] of curr) {
      for (const [dr, dc] of dirs) {
        const nr = r+dr, nc = c+dc;
        if (nr>=0 && nr<rows && nc>=0 && nc<cols && matrix[nr][nc] > matrix[r][c]) {
          if (--inDeg[nr][nc] === 0) next.push([nr, nc]);
        }
      }
    }
    curr = next;
  }
  return length;
}`,
    language: "javascript",
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    systemDesign: "Longest path in a DAG via topological BFS models critical path analysis in project scheduling (CPM algorithm), used in cloud infrastructure provisioning tools like AWS CloudFormation to determine the minimum deployment time when tasks have dependencies and can be parallelised along non-critical paths.",
  },
  {
    id: "queue-49",
    title: "Shortest Path in a Grid with Obstacles Elimination",
    difficulty: "Hard",
    tags: ["BFS", "Queue", "Matrix"],
    statement: "Given an m×n grid where 0=empty and 1=obstacle, and integer k (max obstacles you can eliminate), return the minimum steps to go from (0,0) to (m-1,n-1), or -1 if impossible.",
    examples: [
      { input: "grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1", output: "6" },
      { input: "grid = [[0,1,1],[1,1,1],[1,0,0]], k = 1", output: "-1" },
    ],
    intuition: "Standard BFS but state includes remaining obstacle eliminations. Two visits to the same cell with different remaining k values are different states — keep the one with more remaining k.",
    approach: [
      "State: (row, col, remaining_k). BFS with this 3D state.",
      "visited array: visited[r][c] = max remaining_k when this cell was reached.",
      "Only enqueue if remaining_k is better than previously seen.",
      "Return steps when bottom-right is reached.",
    ],
    solution: `function shortestPath(grid, k) {
  const m = grid.length, n = grid[0].length;
  if (m === 1 && n === 1) return 0;
  const visited = Array.from({ length: m }, () => new Array(n).fill(-1));
  visited[0][0] = k;
  const q = [[0, 0, k, 0]]; // r, c, remaining, steps
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (q.length) {
    const [r, c, rem, steps] = q.shift();
    for (const [dr, dc] of dirs) {
      const nr = r+dr, nc = c+dc;
      if (nr<0 || nr>=m || nc<0 || nc>=n) continue;
      const newRem = rem - grid[nr][nc];
      if (newRem < 0) continue;
      if (nr === m-1 && nc === n-1) return steps+1;
      if (newRem > visited[nr][nc]) {
        visited[nr][nc] = newRem;
        q.push([nr, nc, newRem, steps+1]);
      }
    }
  }
  return -1;
}`,
    language: "javascript",
    complexity: { time: "O(m*n*k)", space: "O(m*n*k)" },
    systemDesign: "BFS with a resource budget (obstacle eliminations) models network routing with budget constraints — finding the shortest path in a graph where certain expensive links can be traversed only if within a cost budget, used in traffic engineering for MPLS label-switched paths with QoS guarantees in carrier-grade networks.",
  },
  {
    id: "queue-50",
    title: "Minimum Cost to Reach Destination in Time (BFS/DP)",
    difficulty: "Hard",
    tags: ["BFS", "Queue", "Dynamic Programming", "Graph"],
    statement: "Given n cities connected by edges with travel times and passing fees, find the minimum cost (fees) to travel from city 0 to city n-1 within maxTime minutes.",
    examples: [
      { input: "maxTime=29, edges=[[0,1,10],[1,2,10],[2,5,10],[0,3,1],[3,4,10],[4,5,15]], passingFees=[5,1,2,20,20,3]", output: "11" },
      { input: "maxTime=25, edges=[[0,1,10],[1,2,10],[2,5,10],[0,3,1],[3,4,10],[4,5,15]], passingFees=[5,1,2,20,20,3]", output: "48" },
    ],
    intuition: "dp[t][city] = minimum fee to reach city in exactly t minutes. BFS layer by layer over time steps, updating fees. This is BFS where each level represents one more time unit used.",
    approach: [
      "dp[t][city] = min cost. Initialize dp[0][0] = passingFees[0], rest = Infinity.",
      "For each time t from 1 to maxTime: for each edge, update dp[t][v] = min(dp[t][v], dp[t-w][u] + fees[v]).",
      "Return min(dp[t][n-1]) over all t, or -1 if all Infinity.",
    ],
    solution: `function minCost(maxTime, edges, passingFees) {
  const n = passingFees.length;
  const dp = Array.from({ length: maxTime + 1 }, () => new Array(n).fill(Infinity));
  dp[0][0] = passingFees[0];
  for (let t = 1; t <= maxTime; t++) {
    for (const [u, v, w] of edges) {
      if (t - w >= 0) {
        if (dp[t - w][u] < Infinity) {
          dp[t][v] = Math.min(dp[t][v], dp[t - w][u] + passingFees[v]);
        }
        if (dp[t - w][v] < Infinity) {
          dp[t][u] = Math.min(dp[t][u], dp[t - w][v] + passingFees[u]);
        }
      }
    }
  }
  let ans = Infinity;
  for (let t = 1; t <= maxTime; t++) ans = Math.min(ans, dp[t][n - 1]);
  return ans === Infinity ? -1 : ans;
}`,
    language: "javascript",
    complexity: { time: "O(maxTime * |edges|)", space: "O(maxTime * n)" },
    systemDesign: "Time-constrained shortest path DP models SLA-aware routing in service meshes — finding the cheapest path (in dollars or resource cost) between microservices that still completes within a latency budget, a real problem in cloud cost optimisation where compute cost and latency are traded off for every API call chain.",
  },
];
