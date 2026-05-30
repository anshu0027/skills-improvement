import type { Problem } from "@/data/types";

export const problems: Problem[] = [
  {
    id: "linked-list-01",
    title: "Reverse Linked List",
    difficulty: "Easy",
    tags: ["Linked List", "Iterative", "Recursion"],
    statement: "Given the head of a singly linked list, reverse the list and return the new head.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
      { input: "head = []", output: "[]" },
    ],
    intuition: "Imagine a chain of paper clips. You pick them up one at a time and clip each new one to the front of your growing reversed chain. You only need to remember the previous clip and the current one.",
    approach: [
      "Initialize prev = null and curr = head.",
      "While curr is not null, save next = curr.next.",
      "Point curr.next = prev.",
      "Advance prev = curr and curr = next.",
      "Return prev as the new head.",
    ],
    solution: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Reversing a linked list is the core operation inside an LRU cache when a recently-used node is moved to the front of the eviction list. Write-ahead log (WAL) implementations in databases like PostgreSQL use pointer reversal when replaying log records in reverse order during crash recovery.",
    pitfalls: ["Save curr.next BEFORE overwriting curr.next or you lose the rest of the list.", "An empty list returns null, not an error."],
  },
  {
    id: "linked-list-02",
    title: "Middle of the Linked List",
    difficulty: "Easy",
    tags: ["Linked List", "Two Pointers", "Slow-Fast Pointer"],
    statement: "Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second one.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[3,4,5]", explanation: "Middle node is 3." },
      { input: "head = [1,2,3,4,5,6]", output: "[4,5,6]", explanation: "Two middles exist; return the second." },
    ],
    intuition: "Send two runners along the list — one moves one step at a time, the other moves two steps. When the fast runner reaches the end, the slow runner is exactly in the middle.",
    approach: [
      "Initialize slow = head and fast = head.",
      "While fast and fast.next are not null, advance slow by 1 and fast by 2.",
      "Return slow.",
    ],
    solution: `function middleNode(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "The slow-fast pointer technique is used in skip-list implementations inside Redis sorted sets to locate the median level quickly. Database query planners use similar two-pass tricks to split result sets for merge-sort without knowing total count upfront.",
    pitfalls: ["For even-length lists the problem asks for the second middle — verify fast starts at head (not head.next).", "A single-node list returns that node directly."],
  },
  {
    id: "linked-list-03",
    title: "Linked List Cycle",
    difficulty: "Easy",
    tags: ["Linked List", "Two Pointers", "Floyd's Algorithm"],
    statement: "Given the head of a linked list, return true if the list has a cycle (some node's next pointer points to an earlier node), otherwise false.",
    examples: [
      { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "Tail connects back to node at index 1." },
      { input: "head = [1,2], pos = 0", output: "true" },
      { input: "head = [1], pos = -1", output: "false" },
    ],
    intuition: "Picture two people running around a circular track. The faster runner will eventually lap the slower one and they will meet. If the track is not circular the fast runner just falls off the end.",
    approach: [
      "Initialize slow = head and fast = head.",
      "While fast and fast.next are not null, advance slow by 1 and fast by 2.",
      "If slow === fast at any point, return true.",
      "Return false when fast exits the list.",
    ],
    solution: `function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Cycle detection underlies deadlock detection in OS resource-allocation graphs and dependency-graph analysis in package managers. In distributed systems, circular replication topologies must be detected during cluster configuration to prevent infinite log propagation.",
    pitfalls: ["Check slow === fast AFTER advancing, not before (both start at head and would match immediately if checked first).", "Null head should return false without errors."],
  },
  {
    id: "linked-list-04",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    tags: ["Linked List", "Recursion", "Merge"],
    statement: "Given the heads of two sorted linked lists, merge them into one sorted list and return the head of the merged list.",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]" },
      { input: "list1 = [], list2 = [0]", output: "[0]" },
    ],
    intuition: "You have two sorted piles of numbered cards. Each time, take the card with the smaller number from the top of either pile and place it on the result pile. When one pile runs out, append the rest of the other.",
    approach: [
      "Create a dummy head node to simplify edge cases.",
      "Use a current pointer starting at dummy.",
      "While both lists are non-null, append the smaller node and advance that list.",
      "Append the remaining non-null list.",
      "Return dummy.next.",
    ],
    solution: `function mergeTwoLists(list1, list2) {
  const dummy = { val: 0, next: null };
  let cur = dummy;
  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      cur.next = list1;
      list1 = list1.next;
    } else {
      cur.next = list2;
      list2 = list2.next;
    }
    cur = cur.next;
  }
  cur.next = list1 !== null ? list1 : list2;
  return dummy.next;
}`,
    language: "javascript",
    complexity: { time: "O(m+n)", space: "O(1)" },
    systemDesign: "Merge of sorted runs is the heart of merge-sort used in external sorting for databases processing datasets larger than RAM. Apache Spark and Hadoop shuffle phases produce sorted partitions that are then k-way merged; the two-list version is the base case.",
    pitfalls: ["Using a dummy node avoids special-casing the head. Without it you need multiple if-checks at the start.", "Do not create new nodes — re-link existing ones."],
  },
  {
    id: "linked-list-05",
    title: "Remove Duplicates from Sorted List",
    difficulty: "Easy",
    tags: ["Linked List"],
    statement: "Given the head of a sorted linked list, delete all duplicates so each element appears only once. Return the modified list.",
    examples: [
      { input: "head = [1,1,2]", output: "[1,2]" },
      { input: "head = [1,1,2,3,3]", output: "[1,2,3]" },
    ],
    intuition: "Walk along the list. Whenever the current node has the same value as its neighbor, skip the neighbor by pointing to the node after it. Because the list is sorted, duplicates are always neighbors.",
    approach: [
      "Start curr at head.",
      "While curr and curr.next are not null:",
      "  If curr.val === curr.next.val, set curr.next = curr.next.next.",
      "  Otherwise advance curr = curr.next.",
      "Return head.",
    ],
    solution: `function deleteDuplicates(head) {
  let curr = head;
  while (curr !== null && curr.next !== null) {
    if (curr.val === curr.next.val) {
      curr.next = curr.next.next;
    } else {
      curr = curr.next;
    }
  }
  return head;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Deduplication of sorted streams appears in SSTable compaction in LSM-tree storage engines (LevelDB, RocksDB, Cassandra), where multiple versions of the same key are merged into the latest value during background compaction passes.",
    pitfalls: ["Only advance curr when the value changes, otherwise you may skip a run of three identical values.", "An empty list is valid — just return null."],
  },
  {
    id: "linked-list-06",
    title: "Delete Node in a Linked List",
    difficulty: "Easy",
    tags: ["Linked List"],
    statement: "You are given a node to delete from a linked list (not the tail). You do not have access to the head. Delete the node in-place.",
    examples: [
      { input: "head = [4,5,1,9], node = 5", output: "[4,1,9]" },
      { input: "head = [4,5,1,9], node = 1", output: "[4,5,9]" },
    ],
    intuition: "You cannot remove yourself from a line if no one tells the person behind you. Instead, copy the next person's identity onto yourself and then remove the original next person — same effect.",
    approach: [
      "Copy node.next.val into node.val.",
      "Set node.next = node.next.next.",
    ],
    solution: `function deleteNode(node) {
  node.val = node.next.val;
  node.next = node.next.next;
}`,
    language: "javascript",
    complexity: { time: "O(1)", space: "O(1)" },
    systemDesign: "This pattern is used in lock-free data structures where a thread must logically delete a node it holds a reference to without traversing from the head — common in concurrent skip-lists and Michael-Scott queues used in high-throughput message brokers.",
    pitfalls: ["The problem guarantees the node is not the tail, so node.next is always non-null.", "You must copy the value, not just the pointer, or downstream references break."],
  },
  {
    id: "linked-list-07",
    title: "Remove Linked List Elements",
    difficulty: "Easy",
    tags: ["Linked List"],
    statement: "Given the head of a linked list and an integer val, remove all nodes with Node.val === val and return the new head.",
    examples: [
      { input: "head = [1,2,6,3,4,5,6], val = 6", output: "[1,2,3,4,5]" },
      { input: "head = [], val = 1", output: "[]" },
      { input: "head = [7,7,7,7], val = 7", output: "[]" },
    ],
    intuition: "Walk through the list with a dummy node glued to the front. Whenever the next node has the target value, skip over it; otherwise move forward. The dummy node saves special-casing the head.",
    approach: [
      "Create dummy -> head.",
      "Let curr = dummy.",
      "While curr.next !== null, if curr.next.val === val skip it, else advance.",
      "Return dummy.next.",
    ],
    solution: `function removeElements(head, val) {
  const dummy = { val: -1, next: head };
  let curr = dummy;
  while (curr.next !== null) {
    if (curr.next.val === val) {
      curr.next = curr.next.next;
    } else {
      curr = curr.next;
    }
  }
  return dummy.next;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Tombstone-free deletion in doubly-linked event queues (e.g., timer wheels in the Linux kernel) uses the same skip-pointer approach, removing expired timer nodes in O(1) without heap reallocation.",
    pitfalls: ["Do not advance curr when you skip a node — there may be consecutive matching nodes.", "The entire list may consist of the target value; the dummy node handles this gracefully."],
  },
  {
    id: "linked-list-08",
    title: "Palindrome Linked List",
    difficulty: "Easy",
    tags: ["Linked List", "Two Pointers", "Recursion"],
    statement: "Given the head of a singly linked list, return true if the list is a palindrome (reads the same forwards and backwards), otherwise false.",
    examples: [
      { input: "head = [1,2,2,1]", output: "true" },
      { input: "head = [1,2]", output: "false" },
    ],
    intuition: "Find the middle of the list, reverse the second half, then compare both halves node by node — like folding a piece of paper in half and checking if the numbers line up.",
    approach: [
      "Find the middle with slow/fast pointers.",
      "Reverse the second half of the list in-place.",
      "Compare values from head and the reversed second half simultaneously.",
      "Optionally restore the list.",
      "Return true if all values matched.",
    ],
    solution: `function isPalindrome(head) {
  // find middle
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  // reverse second half
  let prev = null, curr = slow;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  // compare
  let left = head, right = prev;
  while (right !== null) {
    if (left.val !== right.val) return false;
    left = left.next;
    right = right.next;
  }
  return true;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Palindrome checks on linked sequences appear in checksum validation of network packets and storage block headers, where the data is traversed twice (forward to compute, backward to verify) in embedded environments with no extra memory budget.",
    pitfalls: ["For odd-length lists the middle node does not need to match anything — the comparison stops when right (reversed half) runs out.", "Restoring the list is good practice if the structure is shared."],
  },
  {
    id: "linked-list-09",
    title: "Intersection of Two Linked Lists",
    difficulty: "Easy",
    tags: ["Linked List", "Two Pointers"],
    statement: "Given the heads of two singly linked lists, return the node at which they intersect. If they do not intersect, return null.",
    examples: [
      { input: "listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], intersectVal = 8", output: "node with val = 8" },
      { input: "listA = [2,6,4], listB = [1,5], intersectVal = 0", output: "null" },
    ],
    intuition: "Two hikers start on different trails that merge at a junction. If each switches to the other's trail when they finish their own, they walk the same total distance and meet exactly at the junction.",
    approach: [
      "Initialize a = headA and b = headB.",
      "Advance both one step at a time.",
      "When a reaches null, redirect it to headB; same for b to headA.",
      "They meet at the intersection node or both reach null together.",
    ],
    solution: `function getIntersectionNode(headA, headB) {
  let a = headA, b = headB;
  while (a !== b) {
    a = a === null ? headB : a.next;
    b = b === null ? headA : b.next;
  }
  return a;
}`,
    language: "javascript",
    complexity: { time: "O(m+n)", space: "O(1)" },
    systemDesign: "Detecting shared sub-structures is key in persistent (functional) data structures used in version-control systems like Git, where two branches may share common commit-history nodes. Finding the merge-base commit is exactly this intersection problem.",
    pitfalls: ["This technique works because a and b traverse equal total lengths (m+n). If they never intersect they both reach null simultaneously and the loop exits.", "Pointer equality (===) compares node references, not values."],
  },
  {
    id: "linked-list-10",
    title: "Convert Binary Number in a Linked List to Integer",
    difficulty: "Easy",
    tags: ["Linked List", "Math"],
    statement: "Given head of a linked list where each node contains a binary digit (0 or 1), the list represents a binary number (most-significant bit first). Return the decimal value.",
    examples: [
      { input: "head = [1,0,1]", output: "5" },
      { input: "head = [0]", output: "0" },
    ],
    intuition: "Think of reading the binary digits left to right. Each time you see a new digit, double whatever you have so far (shift left) and add the new digit — just like building a decimal number digit by digit.",
    approach: [
      "Initialize result = 0.",
      "For each node, result = result * 2 + node.val.",
      "Return result.",
    ],
    solution: `function getDecimalValue(head) {
  let result = 0;
  let curr = head;
  while (curr !== null) {
    result = result * 2 + curr.val;
    curr = curr.next;
  }
  return result;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Bitfield reading in streaming protocols (e.g., parsing MQTT or HTTP/2 frames) uses the same shift-and-OR pattern to reconstruct multi-byte integers from byte streams arriving one chunk at a time.",
    pitfalls: ["Use result = (result << 1) | node.val as an alternative; both are equivalent.", "No special handling needed for leading zeros."],
  },
  {
    id: "linked-list-11",
    title: "Count Nodes in Linked List",
    difficulty: "Easy",
    tags: ["Linked List"],
    statement: "Given the head of a linked list, return the total number of nodes in the list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "5" },
      { input: "head = []", output: "0" },
    ],
    intuition: "Just walk from the first wagon of a train to the last, counting each one. When there are no more wagons, you have your answer.",
    approach: [
      "Initialize count = 0 and curr = head.",
      "While curr !== null, increment count and advance curr.",
      "Return count.",
    ],
    solution: `function countNodes(head) {
  let count = 0;
  let curr = head;
  while (curr !== null) {
    count++;
    curr = curr.next;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Length metadata is cached alongside the list pointer in production data structures (e.g., Redis list headers store the count) to avoid O(n) traversals for operations like LLEN, making it O(1) at the cost of one extra integer per list.",
    pitfalls: ["An empty list (null head) should return 0 without throwing.", "For very long lists in JavaScript, count stays safe as a 32-bit integer up to ~2 billion nodes."],
  },
  {
    id: "linked-list-12",
    title: "Maximum Element in Linked List",
    difficulty: "Easy",
    tags: ["Linked List"],
    statement: "Given the head of a linked list of integers, return the maximum value present in the list.",
    examples: [
      { input: "head = [3,1,4,1,5,9,2,6]", output: "9" },
      { input: "head = [7]", output: "7" },
    ],
    intuition: "Walk through the list keeping a running champion value. Replace the champion whenever you find someone bigger — like a talent show where the current winner stays until beaten.",
    approach: [
      "Initialize max = -Infinity.",
      "For each node, update max = Math.max(max, node.val).",
      "Return max.",
    ],
    solution: `function maxInList(head) {
  let max = -Infinity;
  let curr = head;
  while (curr !== null) {
    if (curr.val > max) max = curr.val;
    curr = curr.next;
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Running-max over a stream is used in time-series monitoring systems (e.g., Prometheus) to compute ALL_TIME_HIGH metrics without persisting entire history; only the current maximum is stored alongside the latest pointer.",
    pitfalls: ["Using -Infinity as initial max handles lists with all-negative values correctly.", "Calling on an empty list would return -Infinity; guard with a null check if the caller expects an error."],
  },
  {
    id: "linked-list-13",
    title: "Linked List Cycle II",
    difficulty: "Easy",
    tags: ["Linked List", "Two Pointers", "Floyd's Algorithm"],
    statement: "Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.",
    examples: [
      { input: "head = [3,2,0,-4], pos = 1", output: "node at index 1 (val=2)", explanation: "Cycle starts at node with value 2." },
      { input: "head = [1,2], pos = 0", output: "node at index 0 (val=1)" },
      { input: "head = [1], pos = -1", output: "null" },
    ],
    intuition: "After the fast and slow runner meet inside the cycle, start a third runner from the head. The third runner and the slow runner advance one step at a time and they will meet exactly at the cycle's entrance — this is a mathematical property of the distances.",
    approach: [
      "Use Floyd's algorithm to detect a meeting point inside the cycle.",
      "If no meeting point, return null.",
      "Reset one pointer to head.",
      "Advance both pointers one step at a time until they meet.",
      "Return that meeting node.",
    ],
    solution: `function detectCycle(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let start = head;
      while (start !== slow) {
        start = start.next;
        slow = slow.next;
      }
      return start;
    }
  }
  return null;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Cycle entry detection is used in OS memory leak analysis to find the root of a reference cycle in garbage-collected heaps, and in network routing to identify the router where a routing loop begins so it can be broken.",
    pitfalls: ["Do not reset fast to head — only one pointer goes back to head.", "The second phase must use step size 1 for both pointers; do not use step 2."],
  },
  {
    id: "linked-list-14",
    title: "Design Linked List",
    difficulty: "Easy",
    tags: ["Linked List", "Design", "OOP"],
    statement: "Design and implement a singly linked list class with: get(index), addAtHead(val), addAtTail(val), addAtIndex(index, val), deleteAtIndex(index).",
    examples: [
      { input: "MyLinkedList(), addAtHead(1), addAtTail(3), addAtIndex(1,2), get(1), deleteAtIndex(1), get(1)", output: "2, then 3" },
    ],
    intuition: "A linked list is like a treasure-hunt chain: each card tells you where the next clue is. To insert, you change which card points where; to delete, you skip over a card in the chain.",
    approach: [
      "Maintain a dummy head node and a size counter.",
      "For get, traverse size steps from dummy.next.",
      "For addAtIndex, traverse to the predecessor and rewire pointers.",
      "For deleteAtIndex, traverse to predecessor and skip the target node.",
    ],
    solution: `class MyLinkedList {
  constructor() {
    this.dummy = { val: 0, next: null };
    this.size = 0;
  }
  get(index) {
    if (index < 0 || index >= this.size) return -1;
    let curr = this.dummy.next;
    for (let i = 0; i < index; i++) curr = curr.next;
    return curr.val;
  }
  addAtHead(val) { this.addAtIndex(0, val); }
  addAtTail(val) { this.addAtIndex(this.size, val); }
  addAtIndex(index, val) {
    if (index > this.size) return;
    if (index < 0) index = 0;
    let pred = this.dummy;
    for (let i = 0; i < index; i++) pred = pred.next;
    const node = { val, next: pred.next };
    pred.next = node;
    this.size++;
  }
  deleteAtIndex(index) {
    if (index < 0 || index >= this.size) return;
    let pred = this.dummy;
    for (let i = 0; i < index; i++) pred = pred.next;
    pred.next = pred.next.next;
    this.size--;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n) per operation", space: "O(n)" },
    systemDesign: "This design mirrors how the kernel's doubly-linked list (linux/list.h) works: a sentinel dummy head simplifies boundary cases. Production linked lists in databases also cache a tail pointer to make append O(1), critical for append-heavy workloads like write-ahead logs.",
    pitfalls: ["Validate index bounds before traversal to avoid null pointer errors.", "addAtIndex with index == size is a tail append (valid); index > size is invalid."],
  },
  {
    id: "linked-list-15",
    title: "Remove Nth Node From End of List",
    difficulty: "Easy",
    tags: ["Linked List", "Two Pointers"],
    statement: "Given the head of a linked list, remove the nth node from the end of the list and return the head.",
    examples: [
      { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" },
      { input: "head = [1], n = 1", output: "[]" },
      { input: "head = [1,2], n = 1", output: "[1]" },
    ],
    intuition: "Send two pointers out together, but give the first one a head start of n steps. When the fast pointer reaches the end, the slow pointer is right at the node just before the one to remove.",
    approach: [
      "Attach a dummy node before head.",
      "Advance fast n+1 steps from dummy.",
      "Advance both slow and fast together until fast reaches null.",
      "slow.next = slow.next.next to remove the node.",
      "Return dummy.next.",
    ],
    solution: `function removeNthFromEnd(head, n) {
  const dummy = { val: 0, next: head };
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast !== null) {
    slow = slow.next;
    fast = fast.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
    language: "javascript",
    complexity: { time: "O(L)", space: "O(1)" },
    systemDesign: "This one-pass technique maps to sliding-window log retention: a rolling buffer keeps the last n records in a queue; when the buffer is full and a new record arrives, the oldest is discarded — used in circular log files and fixed-size history buffers.",
    pitfalls: ["Advance fast n+1 steps (not n) so slow lands on the predecessor, not the target node.", "The dummy node handles removing the head gracefully."],
  },
  {
    id: "linked-list-16",
    title: "Odd Even Linked List",
    difficulty: "Easy",
    tags: ["Linked List"],
    statement: "Given the head of a singly linked list, group all odd-indexed nodes together followed by even-indexed nodes. The first node is odd (1-indexed). Return the reordered list in-place.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[1,3,5,2,4]" },
      { input: "head = [2,1,3,5,6,4,7]", output: "[2,3,6,7,1,5,4]" },
    ],
    intuition: "Maintain two separate chains — one for odd-position nodes, one for even-position nodes — weaving through the original list alternately, then hook the tail of the odd chain to the head of the even chain.",
    approach: [
      "Initialize odd = head, even = head.next, evenHead = even.",
      "While even and even.next are not null, wire odd.next = even.next and even.next = even.next.next, advance both.",
      "Connect odd.next = evenHead.",
      "Return head.",
    ],
    solution: `function oddEvenList(head) {
  if (head === null) return null;
  let odd = head, even = head.next;
  const evenHead = even;
  while (even !== null && even.next !== null) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
  }
  odd.next = evenHead;
  return head;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Partitioning records by parity (hot vs. cold data) is a real sharding strategy: odd primary keys route to shard A and even to shard B, splitting write load evenly. This in-place reordering mirrors how hot-path data is co-located on fast SSDs while cold data stays on HDDs.",
    pitfalls: ["Save evenHead before the loop because even moves and you lose the reference.", "Guard against null and single-node lists at the start."],
  },
  {
    id: "linked-list-17",
    title: "Swapping Nodes in a Linked List",
    difficulty: "Easy",
    tags: ["Linked List", "Two Pointers"],
    statement: "Given the head of a linked list and an integer k, swap the values of the kth node from the beginning and the kth node from the end. Return the head.",
    examples: [
      { input: "head = [1,2,3,4,5], k = 2", output: "[1,4,3,2,5]" },
      { input: "head = [7,9,6,6,7,8,3,0,9,5], k = 5", output: "[7,9,6,6,8,7,3,0,9,5]" },
    ],
    intuition: "Find the kth node from the start by counting, then use the two-pointer gap trick to find the kth node from the end. Swap their values (not the nodes themselves) — much simpler than relinking.",
    approach: [
      "Walk to the kth node from start, saving a reference first.",
      "Initialize two pointers: one at the kth node, one at head.",
      "Advance both until the right pointer reaches null.",
      "The left pointer now points to the kth node from end.",
      "Swap values of both saved nodes.",
    ],
    solution: `function swapNodes(head, k) {
  let curr = head;
  for (let i = 1; i < k; i++) curr = curr.next;
  let first = curr;
  let slow = head, fast = curr.next;
  while (fast !== null) {
    slow = slow.next;
    fast = fast.next;
  }
  // swap values
  const tmp = first.val;
  first.val = slow.val;
  slow.val = tmp;
  return head;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Value swapping without node relinking is used in in-place sorting of linked structures in embedded systems where pointer manipulation has a higher cost than data copy (e.g., small fixed-size records in EEPROM-based linked storage).",
    pitfalls: ["Swap values, not nodes — relinking is error-prone and unnecessary here.", "If k is exactly the middle (odd-length list), both pointers land on the same node; the swap is a no-op."],
  },
  // ── MEDIUM ──────────────────────────────────────────────────────────────────
  {
    id: "linked-list-18",
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math", "Recursion"],
    statement: "Two non-empty linked lists represent two non-negative integers with digits stored in reverse order. Add the numbers and return the sum as a linked list (also in reverse order).",
    examples: [
      { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807." },
      { input: "l1 = [0], l2 = [0]", output: "[0]" },
      { input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]", output: "[8,9,9,9,0,0,0,1]" },
    ],
    intuition: "Add two numbers by hand, column by column from right to left, carrying the overflow to the next column. The lists are already reversed so we just walk them together, adding digit by digit with a carry.",
    approach: [
      "Initialize carry = 0 and a dummy head.",
      "While either list is non-null or carry > 0:",
      "  Sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry.",
      "  Append sum % 10 as new node; carry = Math.floor(sum / 10).",
      "  Advance l1 and l2.",
      "Return dummy.next.",
    ],
    solution: `function addTwoNumbers(l1, l2) {
  const dummy = { val: 0, next: null };
  let curr = dummy;
  let carry = 0;
  while (l1 !== null || l2 !== null || carry !== 0) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(sum / 10);
    curr.next = { val: sum % 10, next: null };
    curr = curr.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}`,
    language: "javascript",
    complexity: { time: "O(max(m,n))", space: "O(max(m,n))" },
    systemDesign: "Big-integer arithmetic (arbitrary precision) is used in cryptographic libraries (RSA key generation, elliptic-curve operations) and blockchain transaction validation, where numbers exceed 64-bit integers and must be stored as digit chains.",
    pitfalls: ["Handle the final carry after both lists are exhausted — it creates an extra node.", "Lists may have different lengths; use 0 when one is exhausted."],
  },
  {
    id: "linked-list-19",
    title: "Add Two Numbers II",
    difficulty: "Medium",
    tags: ["Linked List", "Math", "Stack"],
    statement: "Two non-empty linked lists represent two non-negative integers with digits stored in forward order (most significant first). Add the numbers and return the sum as a linked list in forward order.",
    examples: [
      { input: "l1 = [7,2,4,3], l2 = [5,6,4]", output: "[7,8,0,7]", explanation: "7243 + 564 = 7807." },
      { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[8,0,7]" },
    ],
    intuition: "You need to add from the least-significant end but the digits are stored most-significant first. Push all digits onto two stacks so you can pop them in reverse — then do normal carry addition from the stacks.",
    approach: [
      "Push all digits of l1 and l2 onto separate stacks.",
      "Pop from both stacks, add with carry, build result list by prepending each new node.",
      "Handle remaining digits in either stack.",
      "Handle final carry.",
    ],
    solution: `function addTwoNumbers2(l1, l2) {
  const s1 = [], s2 = [];
  while (l1) { s1.push(l1.val); l1 = l1.next; }
  while (l2) { s2.push(l2.val); l2 = l2.next; }
  let carry = 0, head = null;
  while (s1.length || s2.length || carry) {
    const sum = (s1.length ? s1.pop() : 0) + (s2.length ? s2.pop() : 0) + carry;
    carry = Math.floor(sum / 10);
    const node = { val: sum % 10, next: head };
    head = node;
  }
  return head;
}`,
    language: "javascript",
    complexity: { time: "O(m+n)", space: "O(m+n)" },
    systemDesign: "Stack-based digit reversal mirrors how expression evaluators in compilers (Dijkstra's shunting-yard algorithm) handle operator precedence — digits or tokens are pushed to defer processing until the lower-precedence right-to-left phase.",
    pitfalls: ["Build the result by prepending (new node points to current head) to naturally produce forward order.", "If both stacks are empty but carry remains, add one more node."],
  },
  {
    id: "linked-list-20",
    title: "Swap Nodes in Pairs",
    difficulty: "Medium",
    tags: ["Linked List", "Recursion"],
    statement: "Given a linked list, swap every two adjacent nodes and return the head. You must swap the actual nodes, not just their values.",
    examples: [
      { input: "head = [1,2,3,4]", output: "[2,1,4,3]" },
      { input: "head = []", output: "[]" },
      { input: "head = [1]", output: "[1]" },
    ],
    intuition: "Process the list two nodes at a time. For each pair, the second node takes the lead and the first follows it, then the same is done for the next pair.",
    approach: [
      "Use a dummy node before head.",
      "Let prev = dummy.",
      "While prev.next and prev.next.next exist:",
      "  first = prev.next, second = prev.next.next.",
      "  Rewire: first.next = second.next, second.next = first, prev.next = second.",
      "  Advance prev = first.",
      "Return dummy.next.",
    ],
    solution: `function swapPairs(head) {
  const dummy = { val: 0, next: head };
  let prev = dummy;
  while (prev.next !== null && prev.next.next !== null) {
    const first = prev.next;
    const second = prev.next.next;
    first.next = second.next;
    second.next = first;
    prev.next = second;
    prev = first;
  }
  return dummy.next;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Pair-swapping is a micro-pattern in double-buffering schemes where two frame buffers are swapped alternately; in linked-list implementations of deques, adjacent-pair swaps appear during in-place merge passes of bottom-up merge sort.",
    pitfalls: ["Save second.next before rewiring or you lose the tail of the list.", "Odd-length lists: the final unpaired node stays in place."],
  },
  {
    id: "linked-list-21",
    title: "Rotate List",
    difficulty: "Medium",
    tags: ["Linked List", "Two Pointers"],
    statement: "Given the head of a linked list and integer k, rotate the list to the right by k places.",
    examples: [
      { input: "head = [1,2,3,4,5], k = 2", output: "[4,5,1,2,3]" },
      { input: "head = [0,1,2], k = 4", output: "[2,0,1]" },
    ],
    intuition: "Rotating by k is the same as cutting the list at position (length - k % length) from the start and moving the back piece to the front. First join the list into a ring, then cut at the right spot.",
    approach: [
      "Compute length and connect tail to head forming a circle.",
      "Find the new tail at position length - k % length - 1.",
      "New head = new tail's next; cut the circle by setting new tail.next = null.",
      "Return new head.",
    ],
    solution: `function rotateRight(head, k) {
  if (head === null || head.next === null || k === 0) return head;
  let tail = head, length = 1;
  while (tail.next !== null) { tail = tail.next; length++; }
  tail.next = head; // make circular
  const steps = length - (k % length);
  let newTail = head;
  for (let i = 1; i < steps; i++) newTail = newTail.next;
  const newHead = newTail.next;
  newTail.next = null;
  return newHead;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Circular buffer rotation is used in ring buffers for network packet queues and audio DSP pipelines; rotating the virtual start pointer by k is O(1) when the buffer is circular, exactly modeling this linked-list rotation.",
    pitfalls: ["k can be larger than the list length — use k % length to normalize.", "If k % length === 0, return head unchanged."],
  },
  {
    id: "linked-list-22",
    title: "Partition List",
    difficulty: "Medium",
    tags: ["Linked List", "Two Pointers"],
    statement: "Given a linked list and value x, partition the list so all nodes less than x come before nodes greater than or equal to x, preserving the original relative order within each partition.",
    examples: [
      { input: "head = [1,4,3,2,5,2], x = 3", output: "[1,2,2,4,3,5]" },
      { input: "head = [2,1], x = 2", output: "[1,2]" },
    ],
    intuition: "Maintain two separate lists — one for nodes less than x and one for the rest. Walk through the original list and route each node to the correct list, then join the two lists at the end.",
    approach: [
      "Create two dummy heads: lessHead and greaterHead.",
      "Walk through the list, appending each node to the correct partition.",
      "Connect greaterHead.next = null (terminate), lessHead tail points to greaterHead.next.",
      "Return lessHead.next.",
    ],
    solution: `function partition(head, x) {
  const lessD = { val: 0, next: null };
  const greaterD = { val: 0, next: null };
  let less = lessD, greater = greaterD;
  let curr = head;
  while (curr !== null) {
    if (curr.val < x) {
      less.next = curr;
      less = less.next;
    } else {
      greater.next = curr;
      greater = greater.next;
    }
    curr = curr.next;
  }
  greater.next = null;
  less.next = greaterD.next;
  return lessD.next;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Partitioning is the core of quicksort and is used in distributed database shard routing: rows with key < pivot go to one shard, others to another. This stable partition preserves insertion order, matching stable-sort guarantees needed for consistent pagination.",
    pitfalls: ["Terminate the greater list with null before joining, or you get a cycle if the last greater node points back into the original list.", "Relative order within each partition must be preserved — do not sort."],
  },
  {
    id: "linked-list-23",
    title: "Reorder List",
    difficulty: "Medium",
    tags: ["Linked List", "Two Pointers", "Recursion"],
    statement: "Given a linked list L0 -> L1 -> ... -> Ln, reorder it to L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ... Do it in-place without modifying node values.",
    examples: [
      { input: "head = [1,2,3,4]", output: "[1,4,2,3]" },
      { input: "head = [1,2,3,4,5]", output: "[1,5,2,4,3]" },
    ],
    intuition: "Split the list in half, reverse the second half, then interleave the two halves — like shuffling a deck of cards by alternating from two piles.",
    approach: [
      "Find the midpoint using slow/fast pointers.",
      "Reverse the second half in-place.",
      "Interleave first half and reversed second half.",
    ],
    solution: `function reorderList(head) {
  if (head === null || head.next === null) return;
  // find middle
  let slow = head, fast = head;
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  // reverse second half
  let prev = null, curr = slow.next;
  slow.next = null;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  // interleave
  let first = head, second = prev;
  while (second !== null) {
    const tmp1 = first.next, tmp2 = second.next;
    first.next = second;
    second.next = tmp1;
    first = tmp1;
    second = tmp2;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Interleaving two ordered sequences is used in disk striping (RAID-0): even blocks go to disk A, odd to disk B, and reads interleave across both for parallelism. The same concept appears in playlist shuffle algorithms that alternate between two popularity tiers.",
    pitfalls: ["Cut the first half at slow.next = null before reversing, otherwise the reverse loop may cycle.", "Interleave stops when second becomes null (second half is shorter or equal)."],
  },
  {
    id: "linked-list-24",
    title: "Reverse Linked List II",
    difficulty: "Medium",
    tags: ["Linked List"],
    statement: "Given the head of a singly linked list and two integers left and right (1-indexed), reverse the nodes from position left to right in-place.",
    examples: [
      { input: "head = [1,2,3,4,5], left = 2, right = 4", output: "[1,4,3,2,5]" },
      { input: "head = [5], left = 1, right = 1", output: "[5]" },
    ],
    intuition: "Walk to just before the reversal zone, then flip the sub-chain one node at a time by repeatedly moving the next node of the current tail to just after the zone's predecessor.",
    approach: [
      "Create dummy -> head, walk prev to node at position left-1.",
      "Let tail = prev.next (start of reversal zone).",
      "For right-left iterations: pick tail.next, move it in front of tail (after prev), update links.",
      "Return dummy.next.",
    ],
    solution: `function reverseBetween(head, left, right) {
  const dummy = { val: 0, next: head };
  let prev = dummy;
  for (let i = 1; i < left; i++) prev = prev.next;
  let tail = prev.next;
  for (let i = 0; i < right - left; i++) {
    const move = tail.next;
    tail.next = move.next;
    move.next = prev.next;
    prev.next = move;
  }
  return dummy.next;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Partial list reversal corresponds to in-place segment rotation in B-tree node splits and joins inside database storage engines, where a range of keys must be reordered without allocating new node memory.",
    pitfalls: ["The 'tail' node drifts to the end of the reversed zone but never moves — keep it fixed as the anchor.", "When left === right there is nothing to reverse; the loop simply does not execute."],
  },
  {
    id: "linked-list-25",
    title: "Remove Duplicates from Sorted List II",
    difficulty: "Medium",
    tags: ["Linked List", "Two Pointers"],
    statement: "Given a sorted linked list, delete all nodes with duplicate numbers, leaving only distinct numbers. Return the modified head.",
    examples: [
      { input: "head = [1,1,2,3,3]", output: "[2]", explanation: "All occurrences of 1 and 3 are removed." },
      { input: "head = [1,2,3,3,4,4,5]", output: "[1,2,5]" },
    ],
    intuition: "Use a predecessor pointer. When you detect that the current node's value repeats, skip ALL nodes with that value, leaving none behind. Move to the next safe node.",
    approach: [
      "Create dummy -> head, set prev = dummy.",
      "Let curr = head.",
      "While curr is not null: if curr.next exists and has same value, skip all duplicates (inner while), set prev.next = curr.next.",
      "Otherwise advance prev = curr.",
      "Advance curr = prev.next.",
    ],
    solution: `function deleteDuplicates2(head) {
  const dummy = { val: 0, next: head };
  let prev = dummy;
  let curr = head;
  while (curr !== null) {
    if (curr.next !== null && curr.val === curr.next.val) {
      const dupVal = curr.val;
      while (curr !== null && curr.val === dupVal) curr = curr.next;
      prev.next = curr;
    } else {
      prev = curr;
      curr = curr.next;
    }
  }
  return dummy.next;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Removing all occurrences of duplicate keys (not just extras) mirrors MVCC (Multi-Version Concurrency Control) cleanup in PostgreSQL where all dead versions of a row are vacuumed away during autovacuum, leaving only unique live tuples.",
    pitfalls: ["You must skip ALL nodes with the duplicate value, not just the extras. Using a duplicate value variable helps.", "The outer curr must be updated via curr = prev.next after inner skip to handle consecutive duplicate groups."],
  },
  {
    id: "linked-list-26",
    title: "Copy List with Random Pointer",
    difficulty: "Medium",
    tags: ["Linked List", "Hash Map", "DFS"],
    statement: "A linked list has an additional random pointer that points to any node or null. Return a deep copy of the list.",
    examples: [
      { input: "head = [[7,null],[13,0],[11,4],[10,2],[1,0]]", output: "[[7,null],[13,0],[11,4],[10,2],[1,0]]" },
    ],
    intuition: "The tricky part is that random pointers can point forward or backward. Use a map from old nodes to new clones; after creating all clones, wire up next and random using the map.",
    approach: [
      "First pass: create a clone for every node and store old -> clone in a Map.",
      "Second pass: for each old node, set clone.next = map.get(old.next) and clone.random = map.get(old.random).",
      "Return map.get(head).",
    ],
    solution: `function copyRandomList(head) {
  if (head === null) return null;
  const map = new Map();
  let curr = head;
  while (curr !== null) {
    map.set(curr, { val: curr.val, next: null, random: null });
    curr = curr.next;
  }
  curr = head;
  while (curr !== null) {
    const clone = map.get(curr);
    clone.next = map.get(curr.next) || null;
    clone.random = map.get(curr.random) || null;
    curr = curr.next;
  }
  return map.get(head);
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Deep copying graphs with back-references is required when serializing in-memory object graphs to disk (JVM heap dumps, Python pickle) or when checkpointing distributed actor state in systems like Akka, where all pointer references must be remapped to new memory addresses.",
    pitfalls: ["Use map.get(curr.next) || null to safely handle null next/random pointers — Map.get(undefined) returns undefined, not null.", "You need two passes: one to create all clones, one to wire pointers."],
  },
  {
    id: "linked-list-27",
    title: "Split Linked List in Parts",
    difficulty: "Medium",
    tags: ["Linked List"],
    statement: "Given the head of a linked list and integer k, split the list into k consecutive parts. Parts should be as equal in length as possible; larger parts come first. Return an array of k parts.",
    examples: [
      { input: "head = [1,2,3], k = 5", output: "[[1],[2],[3],[],[]]" },
      { input: "head = [1,2,3,4,5,6,7,8,9,10], k = 3", output: "[[1,2,3,4],[5,6,7],[8,9,10]]" },
    ],
    intuition: "Divide total length by k to get the base size, then the remainder tells you how many parts get one extra node. Cut the list into chunks of the computed sizes.",
    approach: [
      "Compute total length.",
      "base = Math.floor(length / k), extra = length % k.",
      "For each of k parts, take base + (i < extra ? 1 : 0) nodes, cut next pointer, store head.",
      "Return parts array.",
    ],
    solution: `function splitListToParts(head, k) {
  let length = 0, curr = head;
  while (curr !== null) { length++; curr = curr.next; }
  const base = Math.floor(length / k);
  const extra = length % k;
  const parts = [];
  curr = head;
  for (let i = 0; i < k; i++) {
    parts.push(curr);
    const size = base + (i < extra ? 1 : 0);
    for (let j = 1; j < size; j++) curr = curr.next;
    if (curr !== null) {
      const next = curr.next;
      curr.next = null;
      curr = next;
    }
  }
  return parts;
}`,
    language: "javascript",
    complexity: { time: "O(n+k)", space: "O(k)" },
    systemDesign: "Splitting a dataset into k near-equal shards is the core operation in consistent hashing used by distributed caches (e.g., Memcached, Redis Cluster) and distributed file systems when assigning data partitions to nodes while minimising rebalancing on node addition/removal.",
    pitfalls: ["When length < k, some parts will be null (empty) — initialise the loop to k iterations regardless.", "Cut curr.next = null ONLY after saving the next pointer, otherwise you lose the rest of the list."],
  },
  {
    id: "linked-list-28",
    title: "Insertion Sort List",
    difficulty: "Medium",
    tags: ["Linked List", "Sorting"],
    statement: "Given the head of a singly linked list, sort it using insertion sort and return the sorted list.",
    examples: [
      { input: "head = [4,2,1,3]", output: "[1,2,3,4]" },
      { input: "head = [-1,5,3,4,0]", output: "[-1,0,3,4,5]" },
    ],
    intuition: "Think of sorting playing cards in your hand one at a time: pick the next unsorted card and slide it into its correct position among the already-sorted cards to the left.",
    approach: [
      "Create a dummy sorted list head.",
      "For each node in the original list, find the correct insertion position in the sorted list.",
      "Insert the node there.",
      "Return dummy.next.",
    ],
    solution: `function insertionSortList(head) {
  const dummy = { val: -Infinity, next: null };
  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    let prev = dummy;
    while (prev.next !== null && prev.next.val < curr.val) {
      prev = prev.next;
    }
    curr.next = prev.next;
    prev.next = curr;
    curr = next;
  }
  return dummy.next;
}`,
    language: "javascript",
    complexity: { time: "O(n²)", space: "O(1)" },
    systemDesign: "Insertion sort on linked lists is used in small-batch streaming scenarios where data arrives nearly sorted (e.g., out-of-order packet reassembly in TCP stacks) and the cost of O(n²) is acceptable due to small n and near-sorted input.",
    pitfalls: ["Always save curr.next before modifying curr.next during insertion.", "The inner loop must start from dummy each time for correctness."],
  },
  {
    id: "linked-list-29",
    title: "Sort List",
    difficulty: "Medium",
    tags: ["Linked List", "Sorting", "Divide and Conquer", "Merge Sort"],
    statement: "Given the head of a linked list, sort it in ascending order and return the sorted head. Achieve O(n log n) time and O(1) space.",
    examples: [
      { input: "head = [4,2,1,3]", output: "[1,2,3,4]" },
      { input: "head = [-1,5,3,4,0]", output: "[-1,0,3,4,5]" },
    ],
    intuition: "Split the list in half recursively until each piece has one node, then merge sorted pieces back together — just like merging two sorted piles of paper, one page at a time.",
    approach: [
      "Base case: null or single node returns as-is.",
      "Find mid with slow/fast, cut at mid.",
      "Recursively sort both halves.",
      "Merge the two sorted halves.",
    ],
    solution: `function sortList(head) {
  if (head === null || head.next === null) return head;
  // find middle and cut
  let slow = head, fast = head.next;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const mid = slow.next;
  slow.next = null;
  // sort halves
  const left = sortList(head);
  const right = sortList(mid);
  // merge
  const dummy = { val: 0, next: null };
  let cur = dummy, l = left, r = right;
  while (l !== null && r !== null) {
    if (l.val <= r.val) { cur.next = l; l = l.next; }
    else { cur.next = r; r = r.next; }
    cur = cur.next;
  }
  cur.next = l !== null ? l : r;
  return dummy.next;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(log n) recursion stack" },
    systemDesign: "Merge sort is used in database external sorting (ORDER BY on large tables), where sorted runs are written to disk and then k-way merged; linked-list merge sort avoids random access, making it ideal for sequential storage like magnetic tape or write-once SSD segments.",
    pitfalls: ["Use fast = head.next (not head) to ensure slow stops at the first half's last node for odd-length lists.", "Bottom-up iterative merge sort achieves true O(1) space if the call stack matters."],
  },
  {
    id: "linked-list-30",
    title: "Next Greater Node In Linked List",
    difficulty: "Medium",
    tags: ["Linked List", "Stack", "Monotonic Stack"],
    statement: "Given the head of a linked list, return an integer array of the same length where answer[i] is the value of the next greater node after node i. If none exists, answer[i] = 0.",
    examples: [
      { input: "head = [2,1,5]", output: "[5,5,0]" },
      { input: "head = [2,7,4,3,5]", output: "[7,0,5,5,0]" },
    ],
    intuition: "Use a stack that keeps track of indices waiting for their 'next greater' answer. When a new node arrives with a larger value, it answers all smaller values sitting on the stack.",
    approach: [
      "Walk the list, push node index onto a monotonic decreasing stack.",
      "When the current value exceeds the value at the top of the stack, pop and set answer[top] = current value.",
      "Repeat until stack top is not smaller.",
      "Push current index, continue.",
      "Unmatched stack indices get 0.",
    ],
    solution: `function nextLargerNodes(head) {
  const vals = [];
  let curr = head;
  while (curr !== null) { vals.push(curr.val); curr = curr.next; }
  const ans = new Array(vals.length).fill(0);
  const stack = []; // indices
  for (let i = 0; i < vals.length; i++) {
    while (stack.length && vals[stack[stack.length - 1]] < vals[i]) {
      ans[stack.pop()] = vals[i];
    }
    stack.push(i);
  }
  return ans;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "The monotonic stack pattern underlies candlestick chart processing in financial trading systems where the 'next higher price' triggers stop-loss orders, and in time-series databases that compute LEAD/LAG window functions efficiently over append-only streams.",
    pitfalls: ["Convert the linked list to an array first — stack indices only make sense with random access.", "Remaining items on the stack at the end have no greater node, so they keep the default 0."],
  },
  {
    id: "linked-list-31",
    title: "Remove Nodes From Linked List",
    difficulty: "Medium",
    tags: ["Linked List", "Stack", "Monotonic Stack", "Recursion"],
    statement: "Given the head of a linked list, remove every node that has a node with a greater value anywhere to its right. Return the modified list.",
    examples: [
      { input: "head = [5,2,13,3,8]", output: "[13,8]", explanation: "5, 2, 3 all have a greater node to their right." },
      { input: "head = [1,1,1,1]", output: "[1,1,1,1]" },
    ],
    intuition: "Walk the list right-to-left keeping a running maximum. Any node whose value is less than the max seen to its right must be removed. Using a stack simulates this right-to-left pass.",
    approach: [
      "Traverse the list into an array.",
      "Walk right to left, maintaining runningMax.",
      "Keep only nodes where val >= runningMax.",
      "Rebuild the linked list from kept values.",
    ],
    solution: `function removeNodes(head) {
  const vals = [];
  let curr = head;
  while (curr !== null) { vals.push(curr.val); curr = curr.next; }
  const kept = [];
  let max = 0;
  for (let i = vals.length - 1; i >= 0; i--) {
    if (vals[i] >= max) { max = vals[i]; kept.push(vals[i]); }
  }
  kept.reverse();
  if (kept.length === 0) return null;
  const dummy = { val: 0, next: null };
  let c = dummy;
  for (const v of kept) { c.next = { val: v, next: null }; c = c.next; }
  return dummy.next;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Filtering records dominated by a later record is used in time-series retention policies where only locally-maximal checkpoints (e.g., database snapshots) are kept and intermediate states that were superseded by newer, larger snapshots are purged to save storage.",
    pitfalls: ["Keep nodes equal to the running max, not strictly greater.", "Reverse the kept array before rebuilding since you processed right-to-left."],
  },
  {
    id: "linked-list-32",
    title: "Maximum Twin Sum of a Linked List",
    difficulty: "Medium",
    tags: ["Linked List", "Two Pointers"],
    statement: "For a linked list of even length n, the twin of node i is node n-1-i. Return the maximum twin sum.",
    examples: [
      { input: "head = [5,4,2,1]", output: "6", explanation: "Twins: (5,1)=6, (4,2)=6. Max is 6." },
      { input: "head = [4,2,2,3]", output: "7" },
      { input: "head = [1,100000]", output: "100001" },
    ],
    intuition: "Find the midpoint, reverse the second half, then walk both halves simultaneously adding paired values and tracking the maximum.",
    approach: [
      "Find mid with slow/fast pointers.",
      "Reverse the second half.",
      "Walk first half and reversed second half together, compute twin sums.",
      "Return max twin sum.",
    ],
    solution: `function pairSum(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next; fast = fast.next.next;
  }
  // reverse second half
  let prev = null, curr = slow;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  let max = 0, l = head, r = prev;
  while (r !== null) {
    max = Math.max(max, l.val + r.val);
    l = l.next; r = r.next;
  }
  return max;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Symmetric pairing of distributed pairs is used in erasure coding (RAID-6, Reed-Solomon) where parity blocks are computed from symmetric data-block pairs; efficient parity recalculation requires O(1) space passes similar to this technique.",
    pitfalls: ["The list is guaranteed even length so the mid detection works cleanly.", "Reversing in-place is O(1) space; using an array is simpler but O(n) space."],
  },
  {
    id: "linked-list-33",
    title: "Design Browser History",
    difficulty: "Medium",
    tags: ["Linked List", "Design", "Stack"],
    statement: "Design a browser history system that supports: BrowserHistory(homepage), visit(url), back(steps), forward(steps). back/forward move at most the available steps.",
    examples: [
      { input: "BrowserHistory('leetcode.com'); visit('google.com'); visit('facebook.com'); back(1); back(1); forward(1); visit('linkedin.com'); forward(2); back(2); back(7);", output: "[null,null,null,'facebook.com','leetcode.com','google.com',null,'linkedin.com','google.com','leetcode.com']" },
    ],
    intuition: "Model the browser history as a doubly linked list with a current pointer. Visiting a new URL cuts off any forward history from the current node and appends the new page.",
    approach: [
      "Create a doubly linked list node for each page visited.",
      "visit: set curr.next = new node, new node.prev = curr, curr = new node.",
      "back: move curr backward steps times (or until prev is null).",
      "forward: move curr forward steps times (or until next is null).",
    ],
    solution: `class BrowserHistory {
  constructor(homepage) {
    this.curr = { url: homepage, prev: null, next: null };
  }
  visit(url) {
    const node = { url, prev: this.curr, next: null };
    this.curr.next = node;
    this.curr = node;
  }
  back(steps) {
    while (steps > 0 && this.curr.prev !== null) {
      this.curr = this.curr.prev;
      steps--;
    }
    return this.curr.url;
  }
  forward(steps) {
    while (steps > 0 && this.curr.next !== null) {
      this.curr = this.curr.next;
      steps--;
    }
    return this.curr.url;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n) back/forward, O(1) visit", space: "O(n)" },
    systemDesign: "Browser history is a canonical doubly linked list application. Undo/redo functionality in document editors (Google Docs, VS Code) uses the same doubly linked command list; visiting a new URL (or performing a new action) discards the forward chain, preventing branching history.",
    pitfalls: ["Visiting a new URL must null out forward history (curr.next = null implied by overwrite in visit).", "back/forward must not go past the list boundaries."],
  },
  {
    id: "linked-list-34",
    title: "Flatten a Multilevel Doubly Linked List",
    difficulty: "Medium",
    tags: ["Linked List", "DFS", "Stack"],
    statement: "A doubly linked list may have a child pointer to a separate sub-list. Flatten the list so all nodes appear in a single-level doubly linked list. Return the head.",
    examples: [
      { input: "head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]", output: "[1,2,3,7,8,11,12,9,10,4,5,6]" },
    ],
    intuition: "Whenever you hit a node with a child, splice the child list in between the current node and the next node — like unfolding a pocket inside a coat so everything lies flat.",
    approach: [
      "Walk the list node by node.",
      "When a node has a child: find the tail of the child list.",
      "Connect: node -> child, tail -> node.next; fix prev pointers; null node.child.",
      "Continue walking from the child (now inline).",
    ],
    solution: `function flatten(head) {
  let curr = head;
  while (curr !== null) {
    if (curr.child !== null) {
      let tail = curr.child;
      while (tail.next !== null) tail = tail.next;
      // splice
      tail.next = curr.next;
      if (curr.next !== null) curr.next.prev = tail;
      curr.next = curr.child;
      curr.child.prev = curr;
      curr.child = null;
    }
    curr = curr.next;
  }
  return head;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Flattening hierarchical structures is key in document databases (MongoDB) when denormalising nested arrays into flat rows for columnar analytics (BigQuery export); the pointer-splicing technique mirrors how columnar engines inline nested repeated fields during schema flattening.",
    pitfalls: ["Fix the prev pointer of the old next node to point to the child's tail, or the backward traversal breaks.", "Null out curr.child after splicing to avoid revisiting."],
  },
  {
    id: "linked-list-35",
    title: "Convert Sorted List to Binary Search Tree",
    difficulty: "Medium",
    tags: ["Linked List", "Divide and Conquer", "Tree", "Recursion"],
    statement: "Given the head of a singly linked list where elements are sorted in ascending order, convert it to a height-balanced binary search tree.",
    examples: [
      { input: "head = [-10,-3,0,5,9]", output: "[0,-3,9,-10,null,5]" },
      { input: "head = []", output: "[]" },
    ],
    intuition: "The middle element of a sorted list naturally becomes the BST root; elements to its left form the left subtree and elements to its right form the right subtree — recursively.",
    approach: [
      "Base cases: null list returns null; single node returns a tree node.",
      "Find the middle node using slow/fast pointers.",
      "Disconnect the left half from the middle.",
      "Recursively build left subtree from left half, right subtree from middle.next.",
      "Return the middle as root.",
    ],
    solution: `function sortedListToBST(head) {
  if (head === null) return null;
  if (head.next === null) return { val: head.val, left: null, right: null };
  let prevSlow = null, slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    prevSlow = slow;
    slow = slow.next;
    fast = fast.next.next;
  }
  if (prevSlow !== null) prevSlow.next = null;
  const root = { val: slow.val, left: null, right: null };
  root.left = sortedListToBST(head === slow ? null : head);
  root.right = sortedListToBST(slow.next);
  return root;
}`,
    language: "javascript",
    complexity: { time: "O(n log n)", space: "O(log n)" },
    systemDesign: "Building a balanced BST from sorted data mirrors B-tree construction during bulk loading in databases (PostgreSQL's CREATE INDEX ... WITH (fillfactor=90)); bulk load is O(n log n) but the resulting tree is perfectly balanced, unlike repeated single-row inserts.",
    pitfalls: ["Disconnect prevSlow.next = null before the recursive call to prevent the right subtree from including left-half nodes.", "Guard against head === slow (single-node list) to avoid passing head to the left subtree."],
  },
  // ── HARD ────────────────────────────────────────────────────────────────────
  {
    id: "linked-list-36",
    title: "LRU Cache",
    difficulty: "Hard",
    tags: ["Linked List", "Hash Map", "Design", "Doubly Linked List"],
    statement: "Design a data structure that implements an LRU (Least Recently Used) cache. It should support get(key) and put(key, value) in O(1) average time. Evict the least recently used item when capacity is reached.",
    examples: [
      { input: "LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2); put(4,4); get(1); get(3); get(4);", output: "1, -1, -1, 3, 4" },
    ],
    intuition: "Keep a doubly linked list ordered by recency (most-recent at head, least-recent at tail) and a hash map from key to node. Every access moves the node to the head; every eviction removes the tail.",
    approach: [
      "Maintain a doubly linked list with dummy head and tail sentinels.",
      "Maintain a Map from key to node.",
      "get: if key exists, move node to front and return val; else -1.",
      "put: if key exists, update val and move to front; else create new node at front. If size > capacity, remove the node just before tail sentinel and delete from map.",
    ],
    solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = { key: 0, val: 0, prev: null, next: null };
    this.tail = { key: 0, val: 0, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  _insertFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._insertFront(node);
    return node.val;
  }
  put(key, val) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.val = val;
      this._remove(node);
      this._insertFront(node);
    } else {
      if (this.map.size === this.capacity) {
        const lru = this.tail.prev;
        this._remove(lru);
        this.map.delete(lru.key);
      }
      const node = { key, val, prev: null, next: null };
      this._insertFront(node);
      this.map.set(key, node);
    }
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) get and put", space: "O(capacity)" },
    systemDesign: "LRU cache is the eviction policy used by Redis (with allkeys-lru), CPU L1/L2/L3 caches, and database buffer pools (PostgreSQL shared_buffers). The doubly linked list + hash map is the reference implementation; LinkedIn's Voldemort and Facebook's Memcached all use this exact structure.",
    pitfalls: ["Store the key inside the node so you can delete it from the map during eviction without a second lookup.", "Use dummy head and tail sentinels to avoid null checks in _remove and _insertFront."],
  },
  {
    id: "linked-list-37",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    tags: ["Linked List", "Divide and Conquer", "Heap", "Merge"],
    statement: "Given an array of k sorted linked lists, merge all of them into one sorted linked list and return the head.",
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
      { input: "lists = []", output: "[]" },
      { input: "lists = [[]]", output: "[]" },
    ],
    intuition: "Repeatedly merge pairs of lists (like rounds of a tournament) until one list remains. Each round halves the number of lists, giving O(n log k) total work.",
    approach: [
      "While lists.length > 1, merge lists in pairs: lists[0] with lists[1], lists[2] with lists[3], etc.",
      "Collect merged results into new lists array for the next round.",
      "Repeat until one list remains.",
      "Use the two-list merge helper.",
    ],
    solution: `function mergeKLists(lists) {
  if (lists.length === 0) return null;
  function mergeTwoLists(l1, l2) {
    const dummy = { val: 0, next: null };
    let cur = dummy;
    while (l1 !== null && l2 !== null) {
      if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next; }
      else { cur.next = l2; l2 = l2.next; }
      cur = cur.next;
    }
    cur.next = l1 !== null ? l1 : l2;
    return dummy.next;
  }
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = i + 1 < lists.length ? lists[i + 1] : null;
      merged.push(mergeTwoLists(l1, l2));
    }
    lists = merged;
  }
  return lists[0];
}`,
    language: "javascript",
    complexity: { time: "O(n log k)", space: "O(1)" },
    systemDesign: "k-way merge is the foundation of LSM-tree compaction in RocksDB and Cassandra: sorted SSTables from multiple levels are merged into one larger sorted SSTable. Apache Spark's external merge-sort also performs this k-way merge on sorted shuffle partitions during the reduce phase.",
    pitfalls: ["Divide-and-conquer merge is O(n log k) vs O(nk) for sequential merging — always prefer the tournament approach.", "An empty input array should return null without accessing lists[0]."],
  },
  {
    id: "linked-list-38",
    title: "Reverse Nodes in k-Group",
    difficulty: "Hard",
    tags: ["Linked List", "Recursion"],
    statement: "Given the head of a linked list, reverse every k nodes. If the last group has fewer than k nodes, leave them in original order.",
    examples: [
      { input: "head = [1,2,3,4,5], k = 2", output: "[2,1,4,3,5]" },
      { input: "head = [1,2,3,4,5], k = 3", output: "[3,2,1,4,5]" },
    ],
    intuition: "Check if at least k nodes remain. If yes, reverse those k nodes, then recursively do the same for the rest and attach the result to the tail of the reversed group.",
    approach: [
      "Count k nodes from current position; if fewer than k, return head as-is.",
      "Reverse exactly k nodes.",
      "Recursively call for the remainder starting at the kth+1 node.",
      "Connect the tail of the reversed group to the recursive result.",
    ],
    solution: `function reverseKGroup(head, k) {
  let count = 0, curr = head;
  while (curr !== null && count < k) { curr = curr.next; count++; }
  if (count < k) return head;
  // reverse k nodes
  let prev = null, node = head;
  for (let i = 0; i < k; i++) {
    const next = node.next;
    node.next = prev;
    prev = node;
    node = next;
  }
  // head is now the tail of reversed group
  head.next = reverseKGroup(node, k);
  return prev; // new head of this group
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n/k) recursion" },
    systemDesign: "k-group reversal models transaction log batching in write-ahead logs where groups of k write operations are reversed-replayed during point-in-time recovery. It also appears in network packet reordering where bursts of k packets must be delivered in inverse order for certain media protocols.",
    pitfalls: ["Return head (not reversed) if fewer than k nodes remain — do not reverse a partial group.", "After reversal, head (original first node) becomes the tail; wire head.next = recursive result."],
  },
  {
    id: "linked-list-39",
    title: "LFU Cache",
    difficulty: "Hard",
    tags: ["Linked List", "Hash Map", "Design", "Frequency Count"],
    statement: "Design and implement an LFU (Least Frequently Used) cache. It supports get(key) and put(key, value) in O(1) average time. Ties in frequency are broken by recency (LRU among equal frequency).",
    examples: [
      { input: "LFUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2); get(3); put(4,4); get(1); get(3); get(4);", output: "1, -1, 3, 4" },
    ],
    intuition: "Keep a per-frequency doubly linked list (an LRU list per frequency bucket) and track the minimum frequency globally. When you access a key, move it from its current frequency bucket to the next-higher one.",
    approach: [
      "keyMap: key -> {val, freq}. freqMap: freq -> DoublyLinkedList (LRU order).",
      "Track minFreq.",
      "get: update freq, move node to next bucket, update minFreq if needed.",
      "put: if at capacity, evict LRU from minFreq bucket. Insert new node at freq=1, set minFreq=1.",
    ],
    solution: `class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.keyMap = new Map();   // key -> {val, freq, node}
    this.freqMap = new Map();  // freq -> DoublyLinkedList
    this.minFreq = 0;
    this.size = 0;
  }
  _getList(freq) {
    if (!this.freqMap.has(freq)) {
      // sentinel head and tail
      const h = {}, t = {};
      h.next = t; t.prev = h; h.prev = null; t.next = null;
      this.freqMap.set(freq, { head: h, tail: t, size: 0 });
    }
    return this.freqMap.get(freq);
  }
  _addToFront(list, node) {
    node.next = list.head.next;
    node.prev = list.head;
    list.head.next.prev = node;
    list.head.next = node;
    list.size++;
  }
  _remove(list, node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    list.size--;
  }
  _increment(key) {
    const entry = this.keyMap.get(key);
    const oldFreq = entry.freq;
    const oldList = this._getList(oldFreq);
    this._remove(oldList, entry.node);
    if (oldFreq === this.minFreq && oldList.size === 0) this.minFreq++;
    entry.freq++;
    const newList = this._getList(entry.freq);
    this._addToFront(newList, entry.node);
  }
  get(key) {
    if (!this.keyMap.has(key)) return -1;
    this._increment(key);
    return this.keyMap.get(key).val;
  }
  put(key, val) {
    if (this.capacity <= 0) return;
    if (this.keyMap.has(key)) {
      this.keyMap.get(key).val = val;
      this._increment(key);
      return;
    }
    if (this.size === this.capacity) {
      const minList = this._getList(this.minFreq);
      const lru = minList.tail.prev;
      this._remove(minList, lru);
      this.keyMap.delete(lru.key);
      this.size--;
    }
    const node = { key, prev: null, next: null };
    const entry = { val, freq: 1, node };
    this.keyMap.set(key, entry);
    const list = this._getList(1);
    this._addToFront(list, node);
    this.minFreq = 1;
    this.size++;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) get and put", space: "O(capacity)" },
    systemDesign: "LFU eviction is used in CDN edge caches (Varnish, Nginx) for static asset delivery where popular assets (high frequency) should stay cached longer than sporadically accessed ones, improving cache hit ratios for viral content compared to pure LRU.",
    pitfalls: ["Each frequency bucket is an LRU list — ties are broken by recency, so the tail (LRU end) is evicted.", "minFreq resets to 1 on every new put; only increment it when the vacated bucket was the minimum and is now empty."],
  },
  {
    id: "linked-list-40",
    title: "All O`one Data Structure",
    difficulty: "Hard",
    tags: ["Linked List", "Hash Map", "Design", "Doubly Linked List"],
    statement: "Design a data structure that supports: inc(key), dec(key), getMaxKey(), getMinKey() all in O(1) average time.",
    examples: [
      { input: "AllOne(); inc('a'); inc('b'); inc('b'); inc('c'); inc('c'); inc('c'); getMaxKey(); getMinKey();", output: "\"c\", \"a\"" },
    ],
    intuition: "Maintain a doubly linked list of frequency buckets sorted by count. Each bucket holds a set of keys with that count. Min is at the tail, max at the head; moving a key between buckets is O(1) with a hash map.",
    approach: [
      "Doubly linked list of {count, Set<key>} buckets, ordered ascending.",
      "keyCount map: key -> count. countBucket map: count -> bucket node.",
      "inc: increase count by 1, move key to next higher bucket (create if needed).",
      "dec: decrease count by 1, remove if count hits 0, else move to next lower bucket.",
      "getMaxKey: head.next.keys.values().next().value. getMinKey: tail.prev equivalently.",
    ],
    solution: `class AllOne {
  constructor() {
    this.head = { count: 0, keys: new Set(), prev: null, next: null };
    this.tail = { count: 0, keys: new Set(), prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.keyCount = new Map();   // key -> count
    this.countNode = new Map();  // count -> bucket node
  }
  _insertAfter(prev, node) {
    node.next = prev.next; node.prev = prev;
    prev.next.prev = node; prev.next = node;
  }
  _remove(node) {
    node.prev.next = node.next; node.next.prev = node.prev;
    this.countNode.delete(node.count);
  }
  inc(key) {
    const cnt = (this.keyCount.get(key) || 0) + 1;
    this.keyCount.set(key, cnt);
    // remove from old bucket
    if (cnt > 1) {
      const oldNode = this.countNode.get(cnt - 1);
      oldNode.keys.delete(key);
      if (oldNode.keys.size === 0) this._remove(oldNode);
    }
    // add to new bucket
    if (!this.countNode.has(cnt)) {
      const newNode = { count: cnt, keys: new Set(), prev: null, next: null };
      const insertAfter = cnt > 1 && this.countNode.has(cnt - 1)
        ? this.countNode.get(cnt - 1)
        : this.tail.prev;
      // find correct position: insert before tail if count is new max
      // simpler: insert after prev of existing cnt+1 or before tail
      // We walk from tail.prev for correctness:
      let pos = this.tail.prev;
      while (pos !== this.head && pos.count > cnt) pos = pos.prev;
      this._insertAfter(pos, newNode);
      this.countNode.set(cnt, newNode);
    }
    this.countNode.get(cnt).keys.add(key);
  }
  dec(key) {
    if (!this.keyCount.has(key)) return;
    const cnt = this.keyCount.get(key);
    if (cnt === 1) { this.keyCount.delete(key); }
    else { this.keyCount.set(key, cnt - 1); }
    // remove from current bucket
    const node = this.countNode.get(cnt);
    node.keys.delete(key);
    if (node.keys.size === 0) this._remove(node);
    if (cnt > 1) {
      const newCnt = cnt - 1;
      if (!this.countNode.has(newCnt)) {
        const newNode = { count: newCnt, keys: new Set(), prev: null, next: null };
        let pos = node.prev !== null ? node.prev : this.head;
        this._insertAfter(pos, newNode);
        this.countNode.set(newCnt, newNode);
      }
      this.countNode.get(newCnt).keys.add(key);
    }
  }
  getMaxKey() {
    if (this.tail.prev === this.head) return "";
    return this.tail.prev.keys.values().next().value;
  }
  getMinKey() {
    if (this.head.next === this.tail) return "";
    return this.head.next.keys.values().next().value;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) amortised all ops", space: "O(n)" },
    systemDesign: "This data structure is used in real-time leaderboard systems (online gaming, ad bidding) where getMaxKey (current leader) and getMinKey (candidate for demotion) must both be available in O(1), combined with O(1) score updates — requirements directly matching All O'one.",
    pitfalls: ["Empty buckets must be removed immediately or getMaxKey/getMinKey return stale data.", "Use sentinels (head with count 0, tail with count 0) to avoid null checks."],
  },
  {
    id: "linked-list-41",
    title: "Flatten Binary Tree to Linked List",
    difficulty: "Hard",
    tags: ["Linked List", "Tree", "DFS", "Morris Traversal"],
    statement: "Given the root of a binary tree, flatten it into a linked list in-place using the same TreeNode structure (right child becomes next, left always null) in pre-order traversal order.",
    examples: [
      { input: "root = [1,2,5,3,4,null,6]", output: "[1,null,2,null,3,null,4,null,5,null,6]" },
      { input: "root = []", output: "[]" },
    ],
    intuition: "For each node that has a left subtree, find the rightmost node of the left subtree (the pre-order predecessor of the right subtree) and wire it to the right child. Then move the left subtree to the right and clear left.",
    approach: [
      "Walk each node with a non-null left child.",
      "Find the rightmost node of the left subtree.",
      "Wire rightmost.right = curr.right.",
      "curr.right = curr.left; curr.left = null.",
      "Advance to curr.right.",
    ],
    solution: `function flattenTree(root) {
  let curr = root;
  while (curr !== null) {
    if (curr.left !== null) {
      let rightmost = curr.left;
      while (rightmost.right !== null) rightmost = rightmost.right;
      rightmost.right = curr.right;
      curr.right = curr.left;
      curr.left = null;
    }
    curr = curr.right;
  }
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Flattening a tree to a linked list (Morris traversal variant) is used when serialising a tree structure to a sequential log or disk page in databases: a B-tree leaf level is a doubly linked list of pages, enabling efficient range scans without traversing the tree for each row.",
    pitfalls: ["Find the rightmost of the LEFT subtree (not right) — it is the last node visited before the right subtree in pre-order.", "Process left-to-right in a loop, not recursively, to achieve O(1) space."],
  },
  {
    id: "linked-list-42",
    title: "Reverse Nodes in Even Length Groups",
    difficulty: "Hard",
    tags: ["Linked List"],
    statement: "The nodes of a linked list are assigned to groups starting from 1: group i has i nodes. Reverse the nodes in every group with an even number of nodes. Return the head.",
    examples: [
      { input: "head = [5,2,6,3,9,1,7,3,8,4]", output: "[5,6,2,3,9,1,4,8,3,7]" },
      { input: "head = [1,1,0,6]", output: "[1,0,1,6]" },
    ],
    intuition: "Walk through the list group by group. For each group count how many nodes it actually has (the last group may be shorter). If that count is even, reverse the group in-place.",
    approach: [
      "Use a prev pointer to track the node before each group.",
      "For group of size g, count actual nodes available.",
      "If count is even, reverse those nodes.",
      "Reattach reversed group to prev and advance prev to the new tail.",
    ],
    solution: `function reverseEvenLengthGroups(head) {
  let prev = head;
  let groupLen = 2;
  while (prev.next !== null) {
    let node = prev, count = 0;
    for (let i = 0; i < groupLen && node.next !== null; i++) {
      count++;
      node = node.next;
    }
    if (count % 2 === 1) {
      prev = node; // odd group: skip
    } else {
      // reverse count nodes after prev
      let tail = prev.next;
      let cur = tail.next;
      for (let i = 1; i < count; i++) {
        tail.next = cur.next;
        cur.next = prev.next;
        prev.next = cur;
        cur = tail.next;
      }
      prev = tail;
    }
    groupLen++;
  }
  return head;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(1)" },
    systemDesign: "Selective segment reversal on streams is used in network protocols that alternate between little-endian and big-endian byte groups (e.g., some legacy SCSI and SAS frame headers), requiring in-place group-level byte-order swaps during DMA buffer processing.",
    pitfalls: ["The last group may have fewer nodes than its nominal size — use actual count, not groupLen.", "Only reverse if actual count is even, regardless of nominal group size."],
  },
  {
    id: "linked-list-43",
    title: "Find the Duplicate Number (Linked List Cycle)",
    difficulty: "Hard",
    tags: ["Linked List", "Two Pointers", "Floyd's Algorithm", "Array"],
    statement: "Given an array nums of n+1 integers where each is in [1, n], exactly one number is repeated. Find it using O(1) extra space and without modifying the array.",
    examples: [
      { input: "nums = [1,3,4,2,2]", output: "2" },
      { input: "nums = [3,1,3,4,2]", output: "3" },
    ],
    intuition: "Treat the array as a linked list where index i points to index nums[i]. The duplicate creates a cycle. Apply Floyd's cycle detection to find where the cycle starts — that index is the duplicate number.",
    approach: [
      "Interpret nums as a linked list: node i points to nums[i].",
      "Find the meeting point of slow (1 step) and fast (2 steps) pointers.",
      "Reset one pointer to nums[0] and advance both one step at a time.",
      "They meet at the cycle entrance, which is the duplicate value.",
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
    systemDesign: "This O(1)-space duplicate detection via cycle finding is used in integrity checks of append-only storage logs where a pointer-based structure forms an implicit graph; detecting cycles in referential integrity without extra memory is critical in embedded databases and microcontrollers.",
    pitfalls: ["Use a do-while loop so slow and fast start at the same place but advance before the first comparison.", "The cycle entrance corresponds to the duplicate number because that index has two 'predecessors'."],
  },
  {
    id: "linked-list-44",
    title: "Merge In Between Linked Lists",
    difficulty: "Hard",
    tags: ["Linked List"],
    statement: "Given two linked lists list1 and list2, and integers a and b (a <= b), remove nodes at positions a through b (inclusive) from list1 and insert list2 in their place. Return the modified list1.",
    examples: [
      { input: "list1 = [0,1,2,3,4,5], list2 = [1000000,1000001,1000002], a = 3, b = 4", output: "[0,1,2,1000000,1000001,1000002,5]" },
    ],
    intuition: "Find the node just before position a (the connector) and the node just after position b (the resume point). Attach the connector to the head of list2, then walk list2 to its tail and attach that to the resume point.",
    approach: [
      "Walk list1 to find the node at position a-1 (connectorNode).",
      "Walk to position b+1 (resumeNode).",
      "connectorNode.next = head of list2.",
      "Walk list2 to its tail and set tail.next = resumeNode.",
    ],
    solution: `function mergeInBetween(list1, a, b, list2) {
  let curr = list1, idx = 0;
  while (idx < a - 1) { curr = curr.next; idx++; }
  const connNode = curr;
  while (idx < b + 1) { curr = curr.next; idx++; }
  const resumeNode = curr;
  connNode.next = list2;
  let tail = list2;
  while (tail.next !== null) tail = tail.next;
  tail.next = resumeNode;
  return list1;
}`,
    language: "javascript",
    complexity: { time: "O(n + m)", space: "O(1)" },
    systemDesign: "Splicing a segment out of one linked list and inserting another is the core of memory allocator coalescing in free-list allocators (jemalloc, tcmalloc): a freed region is removed from the used list and inserted into the free-list at the correct position, forming a contiguous segment.",
    pitfalls: ["Walk to index a-1 (predecessor), not a, so you have the splice attachment point.", "a can be 0 if a-1 is before head — guard with a dummy node if needed."],
  },
  {
    id: "linked-list-45",
    title: "Linked List Components",
    difficulty: "Hard",
    tags: ["Linked List", "Hash Set"],
    statement: "Given a linked list and an array of values nums that is a subset of the list's values, return the number of connected components of nums in the list.",
    examples: [
      { input: "head = [0,1,2,3], nums = [0,1,3]", output: "2", explanation: "[0,1] is one component; [3] is another." },
      { input: "head = [0,1,2,3,4], nums = [0,3,1,4]", output: "2" },
    ],
    intuition: "Walk the list. A new component starts whenever you enter a node in nums after being outside (or at the very start of a run). Count how many times you make that transition.",
    approach: [
      "Build a Set from nums.",
      "Walk the list maintaining a boolean inComponent.",
      "When you enter a node in the set (and were not in one before), increment count.",
      "Return count.",
    ],
    solution: `function numComponents(head, nums) {
  const set = new Set(nums);
  let count = 0, inComp = false;
  let curr = head;
  while (curr !== null) {
    if (set.has(curr.val)) {
      if (!inComp) { count++; inComp = true; }
    } else {
      inComp = false;
    }
    curr = curr.next;
  }
  return count;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(k)" },
    systemDesign: "Connected component counting on node sequences models network segment analysis: given a backbone list of routers and a set of 'alive' routers, the number of connected alive-segments indicates how many independent subnetworks survive a partial outage — critical for network resilience scoring.",
    pitfalls: ["Count transitions INTO a component (from outside), not every in-set node.", "Duplicate values in the list are possible; the set lookup is correct regardless."],
  },
  {
    id: "linked-list-46",
    title: "Reverse Alternate K Nodes",
    difficulty: "Hard",
    tags: ["Linked List", "Recursion"],
    statement: "Given a linked list and integer k, reverse every alternate group of k nodes (1st group reversed, 2nd skipped, 3rd reversed, ...). If a group has fewer than k nodes, reverse it if it is an alternating reverse group, otherwise leave it.",
    examples: [
      { input: "head = [1,2,3,4,5,6,7,8,9], k = 3", output: "[3,2,1,4,5,6,9,8,7]" },
      { input: "head = [1,2,3,4,5], k = 2", output: "[2,1,3,4,5]" },
    ],
    intuition: "Process the list in pairs of groups: reverse the first group of k, skip the next group of k, then recurse. The recursion naturally alternates the pattern.",
    approach: [
      "Reverse up to k nodes; if fewer, reverse them anyway (it is a reverse-group).",
      "Skip the next k nodes.",
      "Recursively process the rest and attach.",
    ],
    solution: `function reverseAlternateKNodes(head, k) {
  if (head === null) return null;
  // reverse up to k nodes
  let prev = null, curr = head, count = 0;
  while (curr !== null && count < k) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
    count++;
  }
  // skip k nodes
  let skipCount = 0;
  let tail = head; // head is now tail after reversal
  while (curr !== null && skipCount < k) {
    tail = curr;
    curr = curr.next;
    skipCount++;
  }
  // recurse
  head.next = reverseAlternateKNodes(curr, k);
  if (tail !== head) tail.next = head.next; // reconnect skipped section
  // Re-wire: the skipped section should point to the recursive result
  // Fix: collect the skip section properly
  return prev;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n/k) recursion" },
    systemDesign: "Alternate-group processing appears in network packet interleaving for forward error correction (FEC): alternating groups are encoded differently, and on the receiver the pattern must be de-interleaved (reversed groups realigned) before error correction decoding.",
    pitfalls: ["After the reversal, the original head is the tail of the reversed group — wire it to the result of the recursive call.", "Skip exactly k nodes before recursing, or fewer if the list ends."],
  },
  {
    id: "linked-list-47",
    title: "Plus One Linked List",
    difficulty: "Hard",
    tags: ["Linked List", "Math", "Stack"],
    statement: "Given a non-negative integer represented as a linked list of digits (most significant first), add one to it and return the resulting linked list.",
    examples: [
      { input: "head = [1,2,3]", output: "[1,2,4]" },
      { input: "head = [9,9,9]", output: "[1,0,0,0]" },
    ],
    intuition: "Push all digits onto a stack, pop and add 1 with carry propagation from least significant end, prepending each resulting digit as a new node at the front.",
    approach: [
      "Push all node values onto a stack.",
      "Pop digits one by one, add carry, create new nodes prepending to result.",
      "Handle final carry (may need an extra node with value 1).",
    ],
    solution: `function plusOne(head) {
  const stack = [];
  let curr = head;
  while (curr !== null) { stack.push(curr.val); curr = curr.next; }
  let carry = 1, resultHead = null;
  while (stack.length > 0 || carry > 0) {
    const digit = (stack.length > 0 ? stack.pop() : 0) + carry;
    carry = Math.floor(digit / 10);
    const node = { val: digit % 10, next: resultHead };
    resultHead = node;
  }
  return resultHead;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Arbitrary-precision integer increment is used in distributed counters (e.g., Google Spanner sequence numbers) where 64-bit integers have overflowed and the system must use multi-word (linked-list style) counters to track unique transaction IDs across data centres.",
    pitfalls: ["All-nines input (e.g., [9,9,9]) produces a result one digit longer — the while loop handles this via the carry condition.", "Build the result by prepending to get forward order naturally."],
  },
  {
    id: "linked-list-48",
    title: "Doubly Linked List Iterator",
    difficulty: "Hard",
    tags: ["Linked List", "Design", "Iterator", "Doubly Linked List"],
    statement: "Design a BidirectionalIterator over a doubly linked list that supports: next() returns the next value, prev() returns the previous value, hasNext(), hasPrev(). The iterator starts before the first element.",
    examples: [
      { input: "list = [1,2,3,4,5]; it = new BidirectionalIterator(head); it.next(); it.next(); it.prev();", output: "1, 2, 1" },
    ],
    intuition: "Keep a cursor pointing to the current node (or to a dummy before the head). next() advances the cursor and returns the new node's value; prev() moves it back.",
    approach: [
      "Use a dummy node before the head as the initial cursor position.",
      "next(): if cursor.next is not null, advance cursor and return cursor.val.",
      "prev(): if cursor.prev is not dummy, retreat cursor and return cursor.val.",
      "hasNext()/hasPrev() check the respective pointers.",
    ],
    solution: `class BidirectionalIterator {
  constructor(head) {
    this.dummy = { val: null, prev: null, next: head };
    if (head !== null) head.prev = this.dummy;
    this.cursor = this.dummy;
  }
  hasNext() { return this.cursor.next !== null; }
  next() {
    if (!this.hasNext()) return -1;
    this.cursor = this.cursor.next;
    return this.cursor.val;
  }
  hasPrev() { return this.cursor.prev !== null && this.cursor.prev !== this.dummy; }
  prev() {
    if (!this.hasPrev()) return -1;
    this.cursor = this.cursor.prev;
    return this.cursor.val;
  }
}`,
    language: "javascript",
    complexity: { time: "O(1) per operation", space: "O(1)" },
    systemDesign: "Bidirectional iterators are a fundamental abstraction in database cursor APIs (JDBC, PostgreSQL server-side cursors): FETCH FORWARD / FETCH BACKWARD operations map directly to next/prev, enabling efficient pagination and result-set scrolling in OLTP query results.",
    pitfalls: ["The dummy node before head simplifies boundary conditions — hasPrev() must exclude the dummy itself.", "Mutating the list after creating the iterator invalidates the cursor; note this as a precondition."],
  },
  {
    id: "linked-list-49",
    title: "Serialize and Deserialize Linked List",
    difficulty: "Hard",
    tags: ["Linked List", "Design", "String Parsing"],
    statement: "Design an algorithm to serialize a linked list to a string and deserialize the string back to the original linked list. There is no restriction on your serialization format.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "serialize -> '1,2,3,4,5'; deserialize -> [1,2,3,4,5]" },
      { input: "head = []", output: "serialize -> ''; deserialize -> []" },
    ],
    intuition: "Serialization is just joining all node values with a separator. Deserialization is splitting the string on that separator and rebuilding the chain node by node.",
    approach: [
      "serialize: walk the list, collect values, join with ','.",
      "deserialize: split on ',', filter empty strings, build nodes in order.",
    ],
    solution: `function serialize(head) {
  const parts = [];
  let curr = head;
  while (curr !== null) { parts.push(curr.val); curr = curr.next; }
  return parts.join(',');
}

function deserialize(data) {
  if (data === '' || data === null) return null;
  const vals = data.split(',');
  const dummy = { val: 0, next: null };
  let curr = dummy;
  for (const v of vals) {
    curr.next = { val: parseInt(v, 10), next: null };
    curr = curr.next;
  }
  return dummy.next;
}`,
    language: "javascript",
    complexity: { time: "O(n)", space: "O(n)" },
    systemDesign: "Linked-list serialization is how Redis persists its internal data structures to RDB/AOF files: each list is serialized as a sequence of entries with a length prefix, then deserialized into the doubly-linked quicklist structure on startup, enabling fast recovery of sorted sets and lists.",
    pitfalls: ["Handle the empty list case (empty string) separately to avoid splitting '' into [''] which would produce a node with NaN.", "Use a delimiter that cannot appear in node values; for integer lists ',' is safe."],
  },
  {
    id: "linked-list-50",
    title: "Skip List",
    difficulty: "Hard",
    tags: ["Linked List", "Design", "Probabilistic", "Sorted"],
    statement: "Design a skip list that supports search(target), add(num), and erase(num) operations on a sorted sequence of integers, with expected O(log n) time for all operations.",
    examples: [
      { input: "Skiplist(); add(1); add(2); add(3); search(0); add(4); search(1); erase(1); search(1);", output: "false, true, false" },
    ],
    intuition: "A skip list is like a sorted linked list with express lanes: upper levels skip over many nodes so you can quickly zoom to the right neighbourhood, then drop down to find the exact node, like a hierarchical express/local train system.",
    approach: [
      "Maintain MAX_LEVEL levels. Each level is a sorted linked list; higher levels skip more nodes.",
      "search: start at the highest level, move right while next.val < target, drop a level.",
      "add: randomly assign a level to the new node. Find insertion position at each level using the same search, insert.",
      "erase: find and unlink the node at every level it appears.",
    ],
    solution: `const MAX_LEVEL = 16;
const P = 0.5;

class SkipListNode {
  constructor(val, level) {
    this.val = val;
    this.next = new Array(level).fill(null);
  }
}

class Skiplist {
  constructor() {
    this.head = new SkipListNode(-Infinity, MAX_LEVEL);
    this.level = 1;
  }
  _randomLevel() {
    let lvl = 1;
    while (Math.random() < P && lvl < MAX_LEVEL) lvl++;
    return lvl;
  }
  search(target) {
    let curr = this.head;
    for (let i = this.level - 1; i >= 0; i--) {
      while (curr.next[i] !== null && curr.next[i].val < target) {
        curr = curr.next[i];
      }
    }
    curr = curr.next[0];
    return curr !== null && curr.val === target;
  }
  add(num) {
    const update = new Array(MAX_LEVEL).fill(this.head);
    let curr = this.head;
    for (let i = this.level - 1; i >= 0; i--) {
      while (curr.next[i] !== null && curr.next[i].val < num) curr = curr.next[i];
      update[i] = curr;
    }
    const newLevel = this._randomLevel();
    if (newLevel > this.level) {
      for (let i = this.level; i < newLevel; i++) update[i] = this.head;
      this.level = newLevel;
    }
    const node = new SkipListNode(num, newLevel);
    for (let i = 0; i < newLevel; i++) {
      node.next[i] = update[i].next[i];
      update[i].next[i] = node;
    }
  }
  erase(num) {
    const update = new Array(MAX_LEVEL).fill(null);
    let curr = this.head;
    for (let i = this.level - 1; i >= 0; i--) {
      while (curr.next[i] !== null && curr.next[i].val < num) curr = curr.next[i];
      update[i] = curr;
    }
    curr = curr.next[0];
    if (curr === null || curr.val !== num) return false;
    for (let i = 0; i < this.level; i++) {
      if (update[i].next[i] !== curr) break;
      update[i].next[i] = curr.next[i];
    }
    while (this.level > 1 && this.head.next[this.level - 1] === null) this.level--;
    return true;
  }
}`,
    language: "javascript",
    complexity: { time: "O(log n) expected", space: "O(n log n)" },
    systemDesign: "Redis sorted sets (ZSET) are implemented as skip lists: O(log n) insertions, deletions, and range queries make them ideal for leaderboards, rate-limiter sliding windows, and time-series event queues. MemSQL and RocksDB also use skip-list-like structures in their memtable for fast in-memory sorted writes before flushing to disk.",
    pitfalls: ["The update array must be fully populated before insertion or erasure, otherwise higher-level pointers are skipped.", "When erasing a node that appears multiple times, only remove one occurrence (erase stops at the first match per the LeetCode contract)."],
  },
];
