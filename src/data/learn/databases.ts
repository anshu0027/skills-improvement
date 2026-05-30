import type { Module } from "@/data/learn/types";
import { getModuleMeta } from "@/data/learn/meta";

const meta = getModuleMeta("databases")!;

export const learnModule: Module = {
  ...meta,
  simple:
    "A database is just an organised place to store your app's data so it survives server restarts, scales to millions of rows, and answers questions in milliseconds. SQL databases (Postgres, MySQL) keep data in strict, related tables — great when your data has clear rules. NoSQL databases (MongoDB) store flexible documents — great when your data varies. Redis keeps data in RAM, which makes it 1,000x faster than disk — perfect for caching, rate limiting, and leaderboards. Pick the right tool for the job and understand indexes, because a missing index is the most common reason a fast app becomes a slow one.",

  concepts: [
    {
      title: "Relational modeling & normalization (1NF–3NF)",
      explain:
        "Normalization is the process of organising a relational schema to reduce duplicated data and the anomalies that come with it. First Normal Form (1NF): every cell holds exactly one atomic value — no comma-separated lists in a column. Second Normal Form (2NF): every non-key column depends on the whole primary key, not just part of it (matters for composite keys). Third Normal Form (3NF): no non-key column depends on another non-key column (transitive dependency). In practice: split into tables, link with foreign keys, and each fact lives in exactly one place.\n\nWhen to denormalize: once the schema is correct, you may intentionally break 3NF for read performance — duplicating a frequently-read field so you avoid a join. Always normalize first, denormalize with a comment explaining why.",
      code: `-- Normalized: orders and customers are separate
CREATE TABLE customers (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  total       NUMERIC(10,2)
);

-- Denormalized (cache read-hot field): snapshot customer name in the order
ALTER TABLE orders ADD COLUMN customer_name TEXT;  -- updated by app on write`,
      lang: "sql",
      note: "Denormalization is a conscious trade-off: faster reads, harder writes, potential stale data. Document it. On heavily-read reporting tables it is normal; on transactional tables avoid it until you have measured evidence that a join is the bottleneck.",
    },
    {
      title: "Primary & foreign keys",
      explain:
        "A primary key uniquely identifies every row in a table — Postgres creates a unique B-tree index on it automatically. A foreign key is a column whose value must exist as a primary key in another table; it enforces referential integrity at the database level so orphan rows cannot exist. Surrogate keys (auto-increment integers or UUIDs) are preferred over natural keys because natural keys can change.\n\nUUID vs bigserial: UUIDs enable distributed ID generation and are safe to expose in URLs; bigserial is smaller and generates sequential leaf-page inserts (less index fragmentation). In 2026, UUID v7 (time-ordered) is the best of both worlds.",
      code: `CREATE TABLE users (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL
);
CREATE TABLE posts (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body      TEXT
);`,
      lang: "sql",
      note: "Always add foreign keys — they are free correctness enforcement the database does for you. ON DELETE CASCADE vs RESTRICT is a product decision: cascade is convenient but can silently delete a lot of data; restrict (the default) is safer.",
    },
    {
      title: "SQL joins",
      explain:
        "A join combines rows from two tables using a condition. INNER JOIN returns only rows that match in both tables. LEFT JOIN returns all rows from the left table plus matching rows from the right (NULLs where there is no match). RIGHT JOIN is the mirror. FULL OUTER JOIN returns all rows from both. CROSS JOIN is a cartesian product — use it intentionally only.\n\nThe most misunderstood: LEFT JOIN with a WHERE on the right table silently converts it into an INNER JOIN — the NULL rows are filtered out. Move the condition to the ON clause if you want all left rows.",
      code: `-- All users with their post count (0 if none)
SELECT u.id, u.email, COUNT(p.id) AS post_count
FROM users u
LEFT JOIN posts p ON p.author_id = u.id
GROUP BY u.id, u.email;

-- WRONG: WHERE on right table kills the LEFT JOIN
-- SELECT ... FROM users u LEFT JOIN posts p ON ... WHERE p.id IS NOT NULL`,
      lang: "sql",
      note: "In system design interviews, joins are the first thing you question at scale. A join across two billion-row tables is expensive; at that point you consider denormalization, precomputed aggregates, or moving the join to the application layer.",
    },
    {
      title: "Indexes: B-tree, composite, covering — and their write cost",
      explain:
        "An index is a separate data structure (usually a B-tree) the database maintains alongside a table so it can find rows matching a WHERE clause without scanning every row. B-tree indexes work for equality and range queries. A composite index on (a, b) satisfies queries on a alone or on (a, b) together — but NOT on b alone (leftmost prefix rule). A covering index includes all columns a query needs so the database never touches the main table (index-only scan).\n\nWrite cost: every INSERT, UPDATE, or DELETE must update every index on that table. Five indexes on a high-write table can slow writes by 2–3×. Index what you query; drop what you don't use.",
      code: `-- Single-column index
CREATE INDEX idx_posts_author ON posts(author_id);

-- Composite: satisfies WHERE status='active' AND created_at > X
CREATE INDEX idx_orders_status_created ON orders(status, created_at);

-- Covering: includes the value column → index-only scan
CREATE INDEX idx_scores_user_covering ON scores(user_id) INCLUDE (score);`,
      lang: "sql",
      note: "Run EXPLAIN (ANALYZE, BUFFERS) before and after adding an index. Look for 'Seq Scan' → 'Index Scan' and compare actual rows / actual time. In Postgres, pg_stat_user_indexes shows unused indexes to drop.",
    },
    {
      title: "Reading EXPLAIN / query plans",
      explain:
        "EXPLAIN shows the plan the query planner chose without running the query. EXPLAIN ANALYZE runs it and shows actual times. Key nodes to understand: Seq Scan (full table scan — often bad on large tables), Index Scan (uses an index), Index Only Scan (covering index — best), Hash Join / Merge Join / Nested Loop (join strategies), and Sort. Look at the cost estimate (left=startup, right=total), actual rows vs estimated rows (a large mismatch means stale statistics — run ANALYZE), and the widest 'actual time' node is your bottleneck.",
      code: `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.email, COUNT(p.id)
FROM users u
LEFT JOIN posts p ON p.author_id = u.id
GROUP BY u.id;

-- Look for:
-- Seq Scan on posts (cost=0.00..18432.00 rows=1000000 ...)
-- → add index on posts.author_id to convert to Index Scan`,
      lang: "sql",
      note: "Never guess about slow queries — always EXPLAIN first. In production, pg_stat_statements (Postgres) or the slow query log (MySQL) surfaces the actual slow queries ranked by total time so you fix the right one.",
    },
    {
      title: "N+1 query problem",
      explain:
        "The N+1 problem happens when you fetch a list of N rows, then fire one more query per row to get related data — so 100 users means 101 queries instead of 2. It is the most common ORM performance bug. Symptoms: fast on dev with 10 records, slow in production with 10,000.\n\nFixes: use a JOIN or a second query with WHERE id IN (...) to fetch all related rows at once ('eager loading'). In ORMs: Prisma's `include`, Sequelize's `include`, TypeORM's `relations`. In GraphQL: DataLoader batches per-request.",
      code: `// BAD — N+1: one query per user
const users = await db.query("SELECT * FROM users");
for (const u of users) {
  u.posts = await db.query("SELECT * FROM posts WHERE author_id = $1", [u.id]);
}

// GOOD — 2 queries total
const users = await db.query("SELECT * FROM users");
const ids = users.map(u => u.id);
const posts = await db.query(
  \`SELECT * FROM posts WHERE author_id = ANY($1)\`,
  [ids]
);
// group posts by author_id in JS`,
      lang: "javascript",
      note: "In Prisma ORM, setting `include: { posts: true }` generates a single JOIN. In GraphQL with DataLoader, all per-field resolvers for the same type are batched into one DB call per request. Always check query counts in development with a logger middleware.",
    },
    {
      title: "Transactions, ACID, and isolation levels",
      explain:
        "A transaction is a group of operations that either all succeed or all fail together. ACID guarantees: Atomicity (all-or-nothing), Consistency (rules stay valid), Isolation (concurrent transactions don't interfere), Durability (committed data survives a crash).\n\nIsolation levels (weakest to strongest): Read Uncommitted (can read dirty, uncommitted data — almost never used), Read Committed (default in Postgres/MySQL — only sees committed rows, but non-repeatable reads are possible), Repeatable Read (same row gives same result within a transaction — phantom reads still possible in MySQL, not in Postgres), Serializable (full isolation — transactions behave as if run one at a time; highest safety, highest lock contention).\n\nAnomalies: Dirty read — reading uncommitted data. Non-repeatable read — same row returns different data on second read. Phantom read — a range query returns different rows on second read.",
      code: `-- Repeatable Read: safe money transfer (no lost update)
BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;  -- lock row
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;`,
      lang: "sql",
      note: "Most applications are fine with Read Committed plus explicit row-level locks (SELECT ... FOR UPDATE) for critical sections like inventory decrement. Serializable is correct for financial ledgers but reduces throughput — benchmark before using globally.",
    },
    {
      title: "Optimistic vs pessimistic locking",
      explain:
        "Pessimistic locking: lock the row before reading it so no one else can modify it until you commit (SELECT ... FOR UPDATE). Safe, but holds a lock for the duration of the transaction — a problem under high concurrency.\n\nOptimistic locking: don't lock; just record a version number. Read row + version, do work, then UPDATE WHERE id=X AND version=Y. If another writer changed it first, your UPDATE matches 0 rows — you detect the conflict and retry. Works well when conflicts are rare (most web apps).",
      code: `-- Schema with version column
ALTER TABLE inventory ADD COLUMN version INT NOT NULL DEFAULT 0;

-- Optimistic update — app checks affected rows
UPDATE inventory
SET quantity = quantity - 1,
    version  = version + 1
WHERE id = $1
  AND version = $2;       -- $2 = version read earlier

-- If rowCount === 0 → conflict detected, retry`,
      lang: "sql",
      note: "Optimistic locking maps naturally to HTTP ETags and REST PATCH requests — the client sends the version it knows; the server rejects stale updates with 409 Conflict. Use pessimistic locking only when contention is genuinely high (flash sale inventory).",
    },
    {
      title: "Connection pooling",
      explain:
        "Opening a new database connection is expensive — it involves a TCP handshake, auth, and allocating memory on the server. A connection pool keeps a set of open connections and lends them to requests. The app asks the pool, uses the connection, returns it — no overhead per request.\n\nIn Node.js: pg (node-postgres) has a built-in pool; Prisma and Drizzle use it internally. For serverless functions (Vercel, AWS Lambda) where each invocation is short-lived, use PgBouncer (a proxy) or Supabase/Neon's pooler — without it, each lambda invocation opens a new connection and the database runs out.",
      code: `// node-postgres pool — reuse across requests
import { Pool } from "pg";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,              // max simultaneous connections
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

export async function query(sql: string, params?: unknown[]) {
  const client = await pool.connect();
  try {
    return await client.query(sql, params);
  } finally {
    client.release();   // always return to pool
  }
}`,
      lang: "javascript",
      note: "Postgres default max_connections is 100. With 10 serverless workers each opening 10 connections you hit the limit fast. PgBouncer in transaction-mode multiplexes thousands of app connections to tens of real DB connections — essential for serverless architectures.",
    },
    {
      title: "Replication & read scaling",
      explain:
        "Replication copies data from a primary (write) node to one or more replica (read-only) nodes, usually asynchronously. This gives you: read scaling (route SELECT queries to replicas), high availability (fail over to a replica if the primary dies), and offline backups (take a snapshot from a replica without impacting the primary).\n\nAsynchronous replication lag: a replica might be milliseconds to seconds behind. Reading your own write from a replica immediately after a write can return stale data. Solution: route reads that must be fresh to the primary, or use synchronous replication for critical paths (at the cost of write latency).",
      code: `// Route reads to replica, writes to primary
const writeDb = new Pool({ connectionString: process.env.DATABASE_PRIMARY_URL });
const readDb  = new Pool({ connectionString: process.env.DATABASE_REPLICA_URL });

async function getUser(id: string) {
  return readDb.query("SELECT * FROM users WHERE id=$1", [id]);
}
async function createUser(data: UserInput) {
  return writeDb.query("INSERT INTO users ...", [...]);
}`,
      lang: "javascript",
      note: "AWS RDS Aurora automatically load-balances reads across replicas via a Reader Endpoint. PlanetScale (MySQL) and Neon (Postgres) offer serverless branching on top of replication. In a system design interview, mentioning replication for read scaling is a basic expected point.",
    },
    {
      title: "Sharding & partitioning",
      explain:
        "Vertical scaling (bigger machine) has a ceiling. Sharding splits data across multiple database servers — each server holds a subset of rows. The shard key determines which server stores a row; queries that include the shard key go to one server, queries without it scatter to all (scatter-gather, expensive).\n\nPartitioning is similar but within one server (or managed service): Postgres table partitioning splits a table into child tables by range (date), list, or hash. It improves query pruning (only scan relevant partitions) and makes dropping old data a fast metadata operation (DROP PARTITION).",
      code: `-- Postgres range partitioning: one partition per month
CREATE TABLE events (
  id         UUID,
  user_id    UUID,
  created_at TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2025_01 PARTITION OF events
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE events_2025_02 PARTITION OF events
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');`,
      lang: "sql",
      note: "Choose the shard key carefully — it's nearly impossible to change later. High-cardinality keys (user_id) distribute load well; time-based keys cause hot spots (everyone writes to the newest shard). Consistent hashing is the standard algorithm for distributing shards so re-sharding moves minimal data.",
    },
    {
      title: "MongoDB document modeling: embed vs reference & aggregation pipeline",
      explain:
        "MongoDB stores JSON-like documents. The core design decision is embed vs reference. Embed (nest the related data inside the document) when: the nested data is always read with the parent, it doesn't grow unboundedly, and it's rarely updated independently. Reference (store an ObjectId and do a $lookup) when: the related entity is large, shared across multiple documents, or queried independently.\n\nThe aggregation pipeline is a sequence of stages that transform a collection: $match (filter), $group (aggregate), $project (reshape), $lookup (join), $unwind (flatten arrays), $sort, $limit. Far more capable than a simple find().",
      code: `// Embed: comments always shown with post, bounded count
db.posts.insertOne({
  _id: ObjectId(),
  title: "Hello",
  comments: [           // embedded array
    { author: "alice", text: "Nice!" }
  ]
});

// Reference: user profile is shared & queried separately
db.orders.insertOne({ userId: ObjectId("..."), total: 99.99 });

// Aggregation: total revenue per user
db.orders.aggregate([
  { $match: { status: "paid" } },
  { $group: { _id: "$userId", revenue: { $sum: "$total" } } },
  { $sort: { revenue: -1 } },
  { $limit: 10 }
]);`,
      lang: "javascript",
      note: "MongoDB's flexible schema is a double-edged sword: no schema enforcement means data drift across documents over time. Always add Mongoose schemas or zod validation at the application layer. For analytics queries, the aggregation pipeline rivals SQL GROUP BY + JOIN — but SQL is usually clearer to read and maintain.",
    },
    {
      title: "Redis data types & caching patterns",
      explain:
        "Redis stores data in RAM, giving sub-millisecond reads. Core data types: String (single value, counters), Hash (object fields — efficient partial updates), List (ordered push/pop — queues, activity feeds), Set (unique members — tag systems, unique visitors), Sorted Set (members with a float score — leaderboards, scheduled jobs).\n\nCaching patterns: Cache-aside (lazy loading) — app checks cache, on miss fetches from DB and writes to cache. Write-through — app writes to cache and DB together, cache always fresh. Write-behind (write-back) — app writes to cache only, async flush to DB (risky if Redis crashes). TTL is non-negotiable on cached data — without it, stale data lives forever.\n\nCache invalidation: the second hard problem in CS. Strategies: TTL expiry (simple, eventually consistent), event-driven invalidation (delete/update cache on DB write — complex but precise), versioned keys (embed version in key, old key naturally expires).",
      code: `import { createClient } from "redis";
const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

// Cache-aside pattern
async function getUserById(id: string) {
  const key = \`user:\${id}\`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const user = await db.query("SELECT * FROM users WHERE id=$1", [id]);
  await redis.set(key, JSON.stringify(user), { EX: 300 }); // 5-min TTL
  return user;
}

// Sorted set leaderboard
await redis.zAdd("leaderboard", { score: 1500, value: "alice" });
const top10 = await redis.zRangeWithScores("leaderboard", 0, 9, { REV: true });

// Rate limiting with sliding window counter
const key = \`ratelimit:\${userId}:\${Math.floor(Date.now() / 60_000)}\`;
const count = await redis.incr(key);
await redis.expire(key, 60);
if (count > 100) throw new Error("Rate limit exceeded");`,
      lang: "javascript",
      note: "Redis Pub/Sub and Redis Streams turn Redis into a lightweight message bus — useful for real-time notifications and task queues (BullMQ runs on Redis). For durability, enable AOF (append-only file) persistence; for clustering, use Redis Cluster or managed services like Upstash.",
    },
  ],

  interviewQs: [
    {
      q: "What is an index and what are the trade-offs of adding more indexes?",
      a: "An index is a separate data structure (typically a B-tree) that lets the database locate rows without a full table scan — turning O(n) into O(log n) reads. The trade-off: every INSERT, UPDATE, and DELETE must maintain every index on the table, adding write overhead and storage cost. Five indexes on a write-heavy table can cut write throughput by 50%+. Index columns you query in WHERE, JOIN ON, and ORDER BY; drop indexes that pg_stat_user_indexes shows have zero scans.",
    },
    {
      q: "Explain ACID and why it matters.",
      a: "Atomicity: a transaction is all-or-nothing — a crash mid-transfer cannot leave money removed but not deposited. Consistency: every transaction takes the database from one valid state to another — foreign key constraints are one example. Isolation: concurrent transactions behave as if run sequentially — no dirty reads of uncommitted data. Durability: once committed, data survives a server crash (WAL / redo log). ACID is why banks use relational databases, and why eventual-consistency NoSQL stores are unsuitable for financial transactions.",
    },
    {
      q: "What are the four SQL isolation levels and what anomaly does each prevent?",
      a: "Read Uncommitted: prevents nothing — can see dirty (uncommitted) data. Read Committed (Postgres/MySQL default): prevents dirty reads. Repeatable Read: additionally prevents non-repeatable reads (re-reading the same row in a transaction gives the same value). Serializable: additionally prevents phantom reads (a range scan gives the same set of rows on every re-read within the transaction). Each stronger level adds more locking/versioning overhead, so use the weakest level that is correct for your use case.",
    },
    {
      q: "What is the N+1 query problem and how do you fix it?",
      a: "N+1 occurs when you load N rows then fire a separate query for each row's related data — 1 + N queries instead of 2. A list of 1,000 users with posts fires 1,001 queries. Fix: eager-load with a JOIN or a second bulk query using WHERE author_id = ANY($1) and group results in the application. In ORMs use include/eager loading options. In GraphQL use DataLoader to batch and deduplicate per-field database calls.",
    },
    {
      q: "When would you choose SQL vs NoSQL?",
      a: "SQL: structured, relational data with complex queries (JOINs, aggregations), strong consistency requirements (finance, inventory), or when schema enforcement is valuable. NoSQL (MongoDB): flexible/evolving schema, document-oriented data (product catalogs with varying attributes), high horizontal write throughput. Redis: sub-millisecond access, caching, ephemeral state, rate limiting. The real answer is: most production systems use both — Postgres for the source of truth, Redis as a cache in front. 'NoSQL everywhere' and 'SQL everywhere' are both wrong.",
    },
    {
      q: "Should you normalize or denormalize, and when?",
      a: "Normalize first — eliminate data duplication and anomalies, enforce consistency with foreign keys. Denormalize deliberately when: a JOIN is measured to be the bottleneck (not assumed), or for read-heavy reporting tables where stale data is acceptable. Always document denormalized fields with a comment explaining the source of truth. A common pattern: keep the transactional DB normalized, materialize read-optimized aggregates into a separate reporting table updated by a background job or CDC pipeline.",
    },
    {
      q: "How would you debug a suddenly slow query?",
      a: "1) Run EXPLAIN (ANALYZE, BUFFERS) to see the actual query plan and find the slowest node. 2) Look for Seq Scan on large tables — usually means a missing index. 3) Check estimated vs actual row counts — a large mismatch means stale statistics, run ANALYZE. 4) Check for missing indexes on JOIN columns and WHERE predicates. 5) Look for N+1 in the application layer with a query logger. 6) In production, use pg_stat_statements to find queries ranked by total_exec_time — fix the highest first, not the slowest per-call.",
    },
    {
      q: "Explain the two hard problems of cache invalidation.",
      a: "The two hard problems are: 1) Knowing when to invalidate — if the underlying data changes, every cached key that contains that data must be purged or the cache serves stale data. This is hard because a single DB row may appear in many cached responses (e.g., a user's name in every post they authored). 2) Thundering herd on invalidation — if a popular cache key expires and 10,000 concurrent requests miss the cache simultaneously, they all hit the database at once. Mitigate with cache stampede protection (mutex lock, probabilistic early expiry, or stale-while-revalidate).",
    },
    {
      q: "What is connection pooling and why is it critical for serverless architectures?",
      a: "Opening a DB connection requires a TCP handshake, authentication, and server-side memory allocation — 10–100 ms overhead and a slot in the server's max_connections. A pool pre-opens connections and reuses them across requests. In long-lived servers (Node, Rails) the pool is in-process. In serverless functions each cold invocation opens a fresh connection; with 1,000 concurrent invocations you exhaust max_connections instantly. The solution is an external pooler like PgBouncer (in transaction mode) or a managed pooler (Neon, Supabase) that multiplexes thousands of app connections onto tens of real DB connections.",
    },
    {
      q: "What is replication lag and how do you handle reading your own write?",
      a: "Replication lag is the delay between a write committing on the primary and that write being visible on a replica — typically milliseconds but can be seconds under load. If you route a write to the primary and immediately route the subsequent read to a replica, the replica may not have the write yet. Solutions: 1) Route reads that must see the latest write to the primary. 2) Use synchronous replication for critical paths (higher write latency). 3) Track a replication position token and wait for the replica to catch up before reading (used by GitHub's read-your-write guarantee). 4) Use sticky sessions to keep a user's requests on the primary for a short window after writes.",
    },
    {
      q: "What are Redis Sorted Sets useful for?",
      a: "Sorted Sets store unique members each associated with a float score; members are always sorted by score. This makes them ideal for: leaderboards (ZADD to update a score, ZRANGE REV to get top-N), rate limiting (score = timestamp, range queries to count events in a window), job scheduling (score = scheduled_at epoch, ZPOPMIN to dequeue the next job due), and autocomplete prefixes (lexicographic sorting with ZRANGEBYLEX).",
    },
    {
      q: "Explain optimistic locking and when you would use it over pessimistic locking.",
      a: "Optimistic locking adds a version column. The reader notes the version, does its work, then updates with WHERE id=X AND version=Y. If another writer modified the row, the UPDATE matches 0 rows; the application detects this (rowCount === 0) and retries. No lock is held during processing, so throughput is high when conflicts are rare. Use it for web requests where you read a form, the user edits it for several seconds, then submits — holding a DB lock for those seconds would be catastrophic. Use pessimistic locking (SELECT FOR UPDATE) when conflicts are common and retrying is expensive, such as a flash-sale inventory decrement.",
    },
  ],

  build: [
    "Build a Postgres-backed REST API for a blog: users, posts, and comments. Add indexes on all foreign keys, use connection pooling with pg or Prisma, and verify with EXPLAIN that no queries do a Seq Scan.",
    "Implement a Redis cache-aside layer in front of the blog API: cache individual post responses with a 5-minute TTL, invalidate on update/delete. Add a Redis Sorted Set leaderboard of the most-viewed posts.",
    "Reproduce and fix an N+1 problem: build a route that naively fetches users then their posts one-by-one, log the query count with a middleware, then fix it with a single JOIN or bulk-IN query and confirm the count drops.",
    "Design a MongoDB collection for an e-commerce product catalog with variable attributes (electronics vs clothing). Write aggregation pipeline queries to compute average rating per category and list top-10 bestsellers.",
  ],

  pitfalls: [
    "Skipping indexes on foreign key columns — Postgres does NOT auto-create them (unlike MySQL). Every un-indexed FK is a full table scan on every JOIN. Run SELECT * FROM pg_stat_user_indexes to audit.",
    "Setting no TTL on cached data — without expiry, stale values accumulate forever and memory fills up. Always set a TTL, even a long one, unless you have explicit event-driven invalidation.",
    "Using MongoDB for everything because 'NoSQL is faster' — MongoDB is not inherently faster; it trades relational guarantees for schema flexibility. For transactional, relational data it is usually slower and harder to keep consistent.",
    "Forgetting that SELECT ... FOR UPDATE locks rows for the entire transaction duration — holding it while making an HTTP call or waiting for user input causes lock contention and timeouts at scale.",
    "Assuming replicas are always current — replication is asynchronous by default. Never route a read-your-own-write to a replica without accounting for lag, especially in payment confirmation flows.",
  ],

  resources: [
    { label: "PostgreSQL official documentation", url: "https://www.postgresql.org/docs/current/" },
    { label: "Use The Index, Luke — SQL indexing explained", url: "https://use-the-index-luke.com/" },
    { label: "MongoDB manual — data modeling", url: "https://www.mongodb.com/docs/manual/core/data-modeling-introduction/" },
    { label: "Redis documentation — data types", url: "https://redis.io/docs/latest/develop/data-types/" },
    { label: "CMU Database Systems (Andy Pavlo, free lectures)", url: "https://15445.courses.cs.cmu.edu/" },
    { label: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net/" },
  ],

  checklist: [
    "Explain 1NF, 2NF, 3NF and give an example of when to denormalize",
    "Write an INNER JOIN and a LEFT JOIN and explain the difference in result sets",
    "Add a composite covering index and verify it is used with EXPLAIN ANALYZE",
    "Reproduce and fix an N+1 query in a Node/Postgres project",
    "Implement a transaction with the correct isolation level for a money transfer",
    "Build a cache-aside layer with Redis, including TTL and invalidation on update",
    "Use a Redis Sorted Set to implement a real-time leaderboard",
    "Describe replication lag and explain how you guarantee reading your own write",
    "Explain the two hard problems of cache invalidation with a concrete example",
  ],
};
