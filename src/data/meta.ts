import type { TopicMeta } from "./types";

// The 18 cards shown on the home page. Order = beginner → advanced, so a learner
// can walk straight down the list and always be ready for the next topic.
export const topicsMeta: TopicMeta[] = [
  {
    slug: "arrays",
    title: "Arrays & Hashing",
    blurb: "A row of boxes you can read by number — the most basic way to store a list.",
    realWorld: "Backs almost every list, table column, and in-memory cache index.",
    order: 1,
  },
  {
    slug: "strings",
    title: "Strings",
    blurb: "Text is just an array of characters — these tricks slice and search it fast.",
    realWorld: "Search bars, URL parsing, log processing, tokenizers behind every API.",
    order: 2,
  },
  {
    slug: "two-pointers",
    title: "Two Pointers",
    blurb: "Two fingers walking through a list to compare or shrink it without nested loops.",
    realWorld: "Merging sorted feeds, de-duplicating streams, range matching in databases.",
    order: 3,
  },
  {
    slug: "sliding-window",
    title: "Sliding Window",
    blurb: "A moving frame over a list so you reuse work instead of recomputing it.",
    realWorld: "Rate limiters, rolling metrics, streaming analytics over the last N events.",
    order: 4,
  },
  {
    slug: "stack",
    title: "Stack",
    blurb: "Last-in, first-out — like a stack of plates, you take the top one first.",
    realWorld: "Undo buttons, browser back history, function call stacks, expression parsing.",
    order: 5,
  },
  {
    slug: "queue",
    title: "Queue & Deque",
    blurb: "First-in, first-out — like a line at a shop, earliest person served first.",
    realWorld: "Message queues (Kafka/SQS), task schedulers, BFS, request buffering.",
    order: 6,
  },
  {
    slug: "linked-list",
    title: "Linked List",
    blurb: "Boxes connected by arrows — each item points to the next one.",
    realWorld: "LRU caches, music playlists, allocator free-lists, blockchain blocks.",
    order: 7,
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    blurb: "Guess the middle of a sorted list and throw away half every time.",
    realWorld: "Database B-tree lookups, version bisecting, autoscaling thresholds.",
    order: 8,
  },
  {
    slug: "recursion-backtracking",
    title: "Recursion & Backtracking",
    blurb: "A function that calls itself to try every path, undoing wrong turns.",
    realWorld: "Permission tree walks, config generators, constraint solvers, regex engines.",
    order: 9,
  },
  {
    slug: "trees",
    title: "Binary Trees",
    blurb: "Data shaped like a family tree — one parent splits into children.",
    realWorld: "File systems, DOM, org charts, decision trees, database indexes.",
    order: 10,
  },
  {
    slug: "bst",
    title: "Binary Search Trees",
    blurb: "A tree kept in sorted order so search, insert, and delete stay fast.",
    realWorld: "In-memory ordered maps, range queries, leaderboards, DB index internals.",
    order: 11,
  },
  {
    slug: "heap",
    title: "Heap / Priority Queue",
    blurb: "A pile that always hands you the biggest (or smallest) item instantly.",
    realWorld: "Top-K trending, Dijkstra routing, job priority scheduling, load shedding.",
    order: 12,
  },
  {
    slug: "graphs",
    title: "Graphs",
    blurb: "Dots connected by lines — the math of networks and relationships.",
    realWorld: "Social graphs, maps/routing, dependency resolvers, recommendation engines.",
    order: 13,
  },
  {
    slug: "tries",
    title: "Tries",
    blurb: "A tree of letters that makes prefix search lightning fast.",
    realWorld: "Autocomplete, spell-check, IP routing tables, search suggestion services.",
    order: 14,
  },
  {
    slug: "dynamic-programming",
    title: "Dynamic Programming",
    blurb: "Solve a big problem by remembering answers to its smaller parts.",
    realWorld: "Pricing engines, diff tools, resource allocation, ML sequence alignment.",
    order: 15,
  },
  {
    slug: "greedy",
    title: "Greedy",
    blurb: "Always grab the best-looking choice right now and never look back.",
    realWorld: "Scheduling, network packet routing, caching eviction, coin/billing systems.",
    order: 16,
  },
  {
    slug: "bit-manipulation",
    title: "Bit Manipulation",
    blurb: "Work directly with the 0s and 1s for tiny, blazing-fast tricks.",
    realWorld: "Feature flags, bitmap indexes, permissions masks, compression, hashing.",
    order: 17,
  },
  {
    slug: "intervals",
    title: "Intervals",
    blurb: "Ranges with a start and end — and how to merge or overlap them.",
    realWorld: "Calendar booking, meeting rooms, range locks, time-series compaction.",
    order: 18,
  },
];

export const topicSlugs = topicsMeta.map((t) => t.slug);

export function getTopicMeta(slug: string): TopicMeta | undefined {
  return topicsMeta.find((t) => t.slug === slug);
}
