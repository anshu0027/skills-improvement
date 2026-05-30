import type { Module } from "@/data/learn/types";
import { getModuleMeta } from "@/data/learn/meta";

const meta = getModuleMeta("system-design")!;

export const learnModule: Module = {
  ...meta,
  simple:
    "System design is the practice of deciding how the pieces of a large software system — servers, databases, caches, queues — fit together so that it stays fast, reliable, and easy to change as traffic grows. In an interview you are not expected to build it; you are expected to think out loud about the tradeoffs: why you'd pick a relational database over a document store, when a cache helps and when it hurts, and how you'd handle ten million users instead of ten. Think of it as engineering decision-making on a whiteboard.",

  concepts: [
    {
      title: "The interview framework: clarify → estimate → API → data → scale",
      explain:
        "Every system-design interview follows the same five beats. (1) Clarify requirements: ask read/write ratio, DAU, latency SLA, consistency needs, and what's out of scope. (2) Back-of-envelope estimates: DAU × requests/user/day gives QPS; multiply by payload size for storage. (3) Define the API: HTTP verbs, endpoint shapes, and request/response schemas — this forces you to reason about the contract before the implementation. (4) Data model: schema, indexes, and choice of storage engine. (5) Scale: where are the bottlenecks? Add caches, queues, CDNs, and sharding only as each bottleneck appears. Jumping straight to microservices before step 1 is the single most common interview mistake.",
      note: "Interviewers evaluate communication as much as correctness. Narrate your reasoning at every step. A wrong answer with good thinking beats a right answer with no explanation.",
    },
    {
      title: "Back-of-envelope estimation",
      explain:
        "Rough numbers anchor every scaling decision. Key constants to memorise: 1 ms L1 cache read; 0.1 ms RAM read; 0.5 ms SSD read; 10 ms cross-region network; 1 Gbps NIC throughput. Formulas: QPS = DAU × (avg requests per day / 86 400). Storage per year = write QPS × payload size × seconds-per-year (~31.5 M). A single commodity server handles ~10 K–50 K simple HTTP req/s. A well-tuned Postgres instance handles ~5 K–10 K simple writes/s. These numbers let you say 'we need 5 app servers and 1 primary DB' rather than hand-waving.",
      code: `// Example: URL shortener, 100 M DAU, 1 write per 10 reads
// Write QPS  = 100e6 * 0.1 / 86400  ≈  116 req/s
// Read  QPS  = 100e6 * 1   / 86400  ≈ 1157 req/s
// URL record = 500 bytes; 5-year storage ≈ 116 * 500 * 86400 * 365 * 5 ≈ 0.9 TB`,
      lang: "typescript",
      note: "Estimation is not about precision; it's about order-of-magnitude decisions. Being off by 2× is fine. Being off by 1000× means you'd pick the wrong architecture.",
    },
    {
      title: "Vertical vs horizontal scaling",
      explain:
        "Vertical scaling means upgrading a single machine — more CPU, RAM, or faster disks. It's simple and requires no code changes, but it has a hard ceiling, is expensive at the top, and creates a single point of failure. Horizontal scaling means adding more machines of the same size. It has no theoretical ceiling and provides redundancy, but requires your application to be stateless (session data must live in a shared store like Redis) and your data tier to be shardable. The pragmatic path: start vertical until it hurts, then scale horizontally.",
      note: "Stateless apps scale horizontally trivially because any server can handle any request. Stateful apps — where the server remembers which user is connected — cannot be load-balanced without sticky sessions or externalising state. Design stateless from day one.",
    },
    {
      title: "Load balancers: L4 vs L7, algorithms",
      explain:
        "A load balancer distributes incoming traffic across a pool of servers. Layer-4 (transport) LBs route based on IP and TCP port — fast, low-overhead, but cannot inspect HTTP content. Layer-7 (application) LBs route based on HTTP headers, URLs, or cookies — they support host-based routing, SSL termination, WebSocket upgrades, and health checks at the HTTP level. Routing algorithms: Round-robin is the default. Least-connections routes to the server with the fewest active connections, useful when requests vary in duration. IP-hash provides sticky sessions without shared state but breaks if server count changes.",
      note: "AWS ALB is L7; AWS NLB is L4. In practice, most web services use L7 in front of app servers. L4 is preferred for low-latency TCP workloads like gaming or database proxies. Always configure health checks so the LB stops sending traffic to a crashed instance within seconds.",
    },
    {
      title: "Caching layers and CDN",
      explain:
        "Caching stores the result of an expensive operation closer to the requester. Layers from fastest to slowest: in-process memory (microseconds, lost on restart) → distributed cache like Redis (sub-millisecond, shared across servers) → CDN edge nodes (tens of milliseconds, geographically close to users) → origin server. CDNs cache static assets and, with modern providers like Cloudflare or Fastly, can cache dynamic API responses with custom cache-control headers. Cache-aside (lazy loading) is the most common pattern: application checks cache first; on a miss it reads from DB and populates the cache.",
      code: `// Cache-aside pseudocode
async function getUser(id: string): Promise<User> {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);
  const user = await db.users.findById(id);
  await redis.setex(\`user:\${id}\`, 300, JSON.stringify(user)); // 5-min TTL
  return user;
}`,
      lang: "typescript",
      note: "A well-tuned cache can absorb 90–99% of read traffic. The danger is stale data. Always set a TTL; never cache for 'forever' unless the data is truly immutable.",
    },
    {
      title: "Cache strategies and invalidation",
      explain:
        "Cache-aside (read-through on miss): app manages cache explicitly, good for read-heavy workloads. Write-through: write to cache and DB simultaneously, keeps cache fresh but adds write latency. Write-behind (write-back): write to cache first, async flush to DB, fast writes but risk of data loss on crash. Read-through: cache layer handles DB reads automatically. Invalidation strategies: TTL-based (simple, tolerates some staleness), event-driven (publish invalidation events on writes), and versioned keys (append a version to the key; old readers continue using old keys while new keys are populated). Cache invalidation and naming are the two hardest problems in CS for a reason: getting both right simultaneously is subtle.",
      note: "The thundering-herd problem: when a popular cache key expires, hundreds of requests hit the DB simultaneously. Mitigations: mutex/lock-based cache recomputation, probabilistic early expiration, or pre-warming caches before TTL expires.",
    },
    {
      title: "Database scaling: replication, read replicas, sharding",
      explain:
        "Primary-replica replication: the primary accepts writes and streams changes to one or more replicas. Replicas serve reads, offloading the primary. Replication lag (milliseconds to seconds) means reads from replicas may be slightly stale — fine for most use cases, wrong for 'read your own writes'. Read replicas can scale reads horizontally to almost any level. Sharding (horizontal partitioning) splits data across multiple DB instances by a partition key (e.g. user_id % N). It scales writes but adds enormous operational complexity: cross-shard queries are expensive, transactions span shards, and rebalancing when adding shards is painful. Range sharding is simple but creates hot partitions; consistent hashing distributes more evenly.",
      code: `// Logical sharding by user_id
function getShard(userId: string, totalShards: number): number {
  let hash = 0;
  for (const ch of userId) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return hash % totalShards;
}`,
      lang: "typescript",
      note: "Shard as late as possible. Sharding makes joins, transactions, and schema migrations much harder. Many companies shard only the hottest tables (e.g. events or messages) while keeping user and product tables in a single, well-indexed Postgres instance.",
    },
    {
      title: "SQL vs NoSQL at scale",
      explain:
        "SQL (Postgres, MySQL): ACID transactions, rich querying, mature tooling, schema enforced. Ideal when your data is relational, you need transactions across tables, or you don't know your access patterns yet. NoSQL covers several distinct categories: document stores (MongoDB, DynamoDB) are flexible-schema and scale well for key-value lookups; wide-column stores (Cassandra, Bigtable) are optimised for high-throughput writes and time-series data; graph DBs (Neo4j) for connected data; vector DBs (Pinecone, pgvector) for embedding search. The CAP theorem (see next concept) constrains what each system can guarantee. The real question is not 'SQL or NoSQL?' but 'what are my access patterns and consistency requirements?'",
      note: "DynamoDB can handle millions of req/s with single-digit-millisecond latency — but only for key-value lookups. Add a complex filter query and it becomes a full table scan. Know your access patterns before choosing a store.",
    },
    {
      title: "CAP theorem and consistency models",
      explain:
        "CAP states that a distributed system can guarantee at most two of three properties simultaneously: Consistency (every read sees the most recent write), Availability (every request gets a response), and Partition tolerance (the system continues operating despite network splits). Because network partitions are unavoidable in distributed systems, you must choose between CP (consistent + partition-tolerant, sacrifices availability during a partition — e.g. Zookeeper, HBase) and AP (available + partition-tolerant, sacrifices consistency — e.g. Cassandra, DynamoDB). Strong consistency means every read reflects the last write. Eventual consistency means reads will eventually converge to the latest value, usually within milliseconds to seconds. Read-your-own-writes, monotonic reads, and causal consistency are intermediate models.",
      note: "In practice, most web applications are fine with eventual consistency for reads (user's feed, product listings) but need strong consistency or transactions for writes that affect correctness (payments, inventory, account balances). Design your system around this split.",
    },
    {
      title: "Message queues and async processing (Kafka, SQS, backpressure)",
      explain:
        "A message queue decouples producers from consumers: the producer writes a message and moves on; the consumer processes it at its own pace. This absorbs traffic spikes (the queue acts as a buffer), enables retries without affecting the producer, and allows independent scaling of workers. Kafka is a distributed log: messages are persisted, ordered within a partition, and can be replayed. SQS is a simpler managed queue with at-least-once delivery. Backpressure is the mechanism by which a slow consumer signals the producer to slow down — without it, the producer overwhelms the queue or the consumer. In Kafka, consumers control their own offset; if they fall behind, the lag metric triggers an alert.",
      code: `// SQS consumer pseudocode (Node.js / AWS SDK)
// Poll → process → delete; failure leaves message for retry
while (true) {
  const msgs = await sqs.receiveMessage({ QueueUrl, MaxNumberOfMessages: 10 });
  for (const msg of msgs.Messages ?? []) {
    await processMessage(JSON.parse(msg.Body!));   // idempotent handler
    await sqs.deleteMessage({ QueueUrl, ReceiptHandle: msg.ReceiptHandle! });
  }
}`,
      lang: "typescript",
      note: "Queues are essential for anything that can be done asynchronously: sending emails, resizing images, generating reports, triggering ML inference. They decouple user-facing latency from background work latency.",
    },
    {
      title: "Idempotency, exactly-once vs at-least-once delivery",
      explain:
        "At-least-once delivery guarantees the message is delivered, possibly more than once (network retries, consumer crashes after processing but before acknowledging). Exactly-once is very hard to achieve in distributed systems and comes with significant overhead. The practical solution is to make consumers idempotent: processing the same message twice produces the same result as processing it once. Strategies: deduplication keys (store a processed-message ID; skip if already seen), natural idempotency (setting a value to X is idempotent; incrementing a counter is not), and database upsert on a unique constraint. For payments and inventory, idempotency is non-negotiable.",
      note: "Stripe's API requires every request to carry an `Idempotency-Key` header. If the same key is sent twice, the second request returns the original response without re-executing the side effects. This is the gold standard pattern for financial operations.",
    },
    {
      title: "Rate limiting and API gateway",
      explain:
        "Rate limiting protects services from abuse and accidental overload. Algorithms: token bucket (allows bursts up to bucket size, refills at a fixed rate), leaky bucket (smooths bursty traffic into a constant output rate), fixed window (simple, prone to boundary spikes), sliding window log (accurate but memory-heavy). In practice: use a Redis INCR + EXPIRE per user key for token bucket at the API gateway layer. An API gateway sits in front of all services and handles: authentication/authorisation, rate limiting, SSL termination, request routing, protocol translation (REST↔gRPC), and request/response logging. AWS API Gateway, Kong, and Nginx are common choices.",
      code: `// Token bucket with Redis (pseudo-TypeScript)
async function isAllowed(userId: string, limit = 100, windowSec = 60): Promise<boolean> {
  const key = \`rl:\${userId}\`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSec);
  return count <= limit;
}`,
      lang: "typescript",
      note: "Rate limiting at the API gateway means application code never sees the burst — it's handled at the edge. Always apply per-user AND per-IP limits; per-IP alone is trivially defeated by a botnet.",
    },
    {
      title: "Microservices vs monolith tradeoffs",
      explain:
        "A monolith is one deployable unit: simple to develop, test, and debug; no network hops between modules; easy transactions. It becomes a problem when teams step on each other's deployments, one module's memory leak kills everything, or you need to scale just one part independently. Microservices split the system into independently deployed services: each team owns their service, you can scale hot services independently, and failure is isolated. The costs are real: network latency between calls, distributed tracing complexity, eventual consistency across service boundaries, duplicate data, and dramatically harder local development. The pragmatic path: start with a modular monolith; extract services only when a specific bottleneck or team-autonomy need demands it.",
      note: "Most FAANG teams run microservices, but their scale and team size justify it. At a 10-person startup, microservices are almost always premature. A well-structured monolith with clear module boundaries can scale to hundreds of millions of users.",
    },
    {
      title: "Observability: logs, metrics, and traces",
      explain:
        "Logs are timestamped, structured text records of events — use structured JSON logs (not printf strings) so they are machine-parseable. Metrics are numeric time-series: request rate, error rate, latency percentiles (p50/p95/p99), CPU, memory. The golden signals for any service are latency, traffic, errors, and saturation. Distributed traces connect a single user request as it fans out across microservices — each span has a trace ID, parent ID, and timing. The stack: OpenTelemetry (vendor-neutral instrumentation SDK) → collector → Grafana + Loki (logs) + Prometheus/Mimir (metrics) + Tempo/Jaeger (traces). Alerting: page on error rate or p99 latency crossing a threshold, not on CPU alone.",
      note: "In a system design interview, always mention observability as part of the design — not as an afterthought. Saying 'I'd instrument with OpenTelemetry and alert on p99 > 500 ms' signals production experience.",
    },
    {
      title: "AI systems: RAG, LLM gateway, semantic caching, streaming inference",
      explain:
        "Retrieval-Augmented Generation (RAG) architecture: user query → embed query with the same model used to embed the corpus → vector DB similarity search (Pinecone, pgvector, Weaviate) → top-K chunks retrieved → LLM prompt = system prompt + retrieved context + user question → streamed response. An LLM gateway sits between your app and multiple model providers (OpenAI, Anthropic, Google) and handles: routing by model capability or cost, retries with exponential backoff, fallbacks to a cheaper model on timeout, token counting, and audit logging. Token-cost budget: set a hard per-request token limit; estimate cost = (input tokens × input price + output tokens × output price). Latency budget: first token in < 500 ms for interactive use; stream the rest. Semantic caching: embed the user's query, check a vector store for a similar previous query (cosine similarity > 0.95), return the cached answer — avoids the LLM call entirely for repeated questions, cutting cost by 30–70% in FAQ-style workloads.",
      code: `// LLM gateway pseudocode — retry + fallback
async function callLLM(prompt: string): Promise<string> {
  const models = ["gpt-4o", "claude-3-5-sonnet", "gemini-2.0-flash"];
  for (const model of models) {
    try {
      return await fetchWithTimeout(model, prompt, 8000); // 8 s timeout
    } catch {
      continue; // try next model
    }
  }
  throw new Error("all models failed");
}`,
      lang: "typescript",
      note: "Async/streaming inference: for long-running LLM jobs (document summarisation, batch embeddings) offload to a queue. The HTTP endpoint enqueues the job and returns a job ID; the client polls or uses a webhook. This prevents HTTP timeouts and lets you scale workers independently of the API tier.",
    },
  ],

  interviewQs: [
    {
      q: "Walk me through how you'd approach designing a system you've never seen before.",
      a: "I follow five steps: (1) Clarify — ask DAU, read/write ratio, latency SLA, consistency requirements, and what's explicitly out of scope. (2) Estimate — back-of-envelope QPS and storage so every architectural decision is grounded in real numbers. (3) API — define endpoint shapes and request/response contracts before touching infrastructure. (4) Data model — choose storage type, schema, and indexes. (5) Scale — identify the bottleneck (usually reads), then add caches, read replicas, queues, or CDN one layer at a time. I narrate my reasoning at each step because the interviewer is evaluating thinking, not just the final diagram.",
    },
    {
      q: "Explain CAP theorem. Which do you sacrifice in a real web app?",
      a: "A distributed system can guarantee at most two of Consistency, Availability, and Partition tolerance. Because network partitions always happen, you choose CP or AP. CP systems (Zookeeper, HBase) return an error during a partition rather than stale data — right for financial ledgers. AP systems (Cassandra, DynamoDB) serve possibly stale reads — right for social feeds and product listings. Most web apps accept eventual consistency on reads (AP) while using transactions for correctness-critical writes (CP at the row level). The nuance: within a single-node Postgres, you get strong consistency; across replicas you accept replication lag.",
    },
    {
      q: "Design a URL shortener. What are the key components?",
      a: "Requirements: 100 M DAU, ~1 K write QPS, ~10 K read QPS, 5-year retention. Components: (1) API servers (stateless, horizontally scaled) behind an L7 load balancer. (2) ID generation: base62 encode a unique ID — use a distributed counter (Redis INCR) or a UUID truncated to 7 characters. (3) Storage: a simple key-value store (DynamoDB or Redis) mapping short code → long URL; relational DB for analytics. (4) Cache: Redis cache in front of the DB for the hot read path — most reads are for the same popular URLs. (5) CDN/redirect: 301 (permanent) vs 302 (temporary) redirect tradeoff — 301 is cached by browsers so you lose click analytics. (6) Analytics: async event stream to Kafka → Flink → data warehouse. Bottleneck is reads; cache handles 99% of them.",
    },
    {
      q: "How do you handle the thundering-herd / hot-key problem in a cache?",
      a: "The thundering herd occurs when a popular key expires and hundreds of simultaneous cache misses hit the database. Solutions: (1) Mutex lock — the first miss acquires a distributed lock, fetches from DB, and populates the cache; other waiters read the freshly populated cache. (2) Probabilistic early expiration — recompute the cache slightly before it expires based on a random factor, preventing a hard expiry cliff. (3) Staggered TTLs — add a random jitter (e.g. TTL ± 10%) so many keys don't expire at the same instant. (4) Consistent hashing — spreading keys across shards means no single hot shard. (5) Local in-process cache in each app server as a second line of defence.",
    },
    {
      q: "When would you choose a message queue over a direct API call?",
      a: "When the operation is long-running (image resizing, ML inference, email sending), when you need retry-with-backoff without blocking the caller, when the consumer is slower than the producer and needs buffering, when you want to fan out to multiple consumers (Kafka topics), or when services should be loosely coupled. A synchronous API call fails if the downstream is down; a queue absorbs the message and retries. The cost: added latency and eventual consistency. Never use a queue when the caller needs the result immediately and the operation is fast.",
    },
    {
      q: "How do you scale reads vs writes differently?",
      a: "Reads scale with read replicas, caches (Redis/CDN), and eventually consistent document stores. A single primary can support many replicas with replication lag as the only tradeoff. Writes are harder: vertical scaling the primary, write-through caches, or horizontal sharding. The key insight: most apps are read-heavy (10:1 to 100:1 ratio), so solving the read problem with a cache often lets you defer write scaling for years. When you must scale writes, consider command-query responsibility segregation (CQRS), event sourcing, or sharding.",
    },
    {
      q: "Explain cache invalidation strategies and their tradeoffs.",
      a: "TTL-based: simple, always slightly stale, no coordination needed — good for data that tolerates staleness (product prices, user profiles). Write-through: cache is updated on every write — consistent but doubles write latency. Event-driven invalidation: on a write, publish an invalidation event; cache consumers delete or update the key — near-real-time consistency but adds infrastructure. Versioned keys: append a version number to the cache key; old keys expire naturally — no delete needed, but old keys accumulate. The hardest case is when a single write invalidates multiple related cache keys (e.g. updating a user invalidates their posts, comments, and feed). Use an event bus and tag-based invalidation in that scenario.",
    },
    {
      q: "What is idempotency and why does it matter in distributed systems?",
      a: "An operation is idempotent if applying it multiple times produces the same result as applying it once. In distributed systems, at-least-once delivery means messages may be processed twice (network retries, consumer crash after processing but before acknowledging). Without idempotency, duplicates cause double charges, duplicate emails, or corrupted counters. Implement with: a unique idempotency key per operation, stored in a deduplication table; or use database upserts on a natural unique constraint. Payments, inventory deductions, and any side-effectful operation must be idempotent.",
    },
    {
      q: "Design a RAG (Retrieval-Augmented Generation) system.",
      a: "Components: (1) Ingestion pipeline: load documents → chunk (512–1024 tokens, with overlap) → embed with text-embedding-3-large or equivalent → store vectors + chunk text in a vector DB (pgvector, Pinecone, Weaviate). (2) Query path: user question → embed query → ANN search (top-K = 5–10) → rerank with a cross-encoder → build prompt (system + retrieved context + question) → stream LLM response. (3) Infrastructure: an LLM gateway for retries and fallbacks, a semantic cache to avoid repeated LLM calls, async ingestion queue for large document batches, and a metadata store for access control (users should only retrieve chunks they have permission to read). Scale: the embedding generation is the CPU bottleneck — batch-embed and parallelise. The LLM is the cost bottleneck — semantic caching cuts 30–70% of calls.",
    },
    {
      q: "What are the tradeoffs between microservices and a monolith?",
      a: "Monolith pros: simple to develop, test, deploy, and debug; in-process function calls instead of network hops; easy ACID transactions. Cons: one noisy-neighbour module can crash everything; scaling requires scaling the whole app; large teams cause deployment conflicts. Microservices pros: independent deployment and scaling; fault isolation; technology heterogeneity. Cons: network latency, distributed tracing complexity, eventual consistency across services, operational overhead (N services to deploy, monitor, and secure). The answer depends on team size and scale. Under ~20 engineers or ~1 M DAU, a well-structured modular monolith is almost always the better choice. Extract services when you have a proven bottleneck or a team-autonomy need.",
    },
    {
      q: "How would you implement rate limiting at scale?",
      a: "Use the token bucket algorithm in Redis: each user has a key; INCR the key on each request, set EXPIRE on first write (sliding window). If count > limit, return 429. For multi-region: use Redis Cluster with consistent hashing so a user's key always lands on the same shard. Apply limits in layers: at the CDN/edge (IP-based, protects infrastructure), at the API gateway (per API key/user, protects business logic), and optionally inside services (per endpoint, for expensive operations). Store limits in a config service so they can be changed without a deploy. Always return Retry-After and X-RateLimit-Remaining headers.",
    },
    {
      q: "How do you design for observability in a distributed system?",
      a: "Three pillars: Logs — structured JSON with trace ID, user ID, and request ID on every line; ship to a log aggregator (Loki, Datadog). Metrics — instrument the four golden signals (latency, traffic, error rate, saturation) on every service using OpenTelemetry; store in Prometheus/Mimir; alert on p99 latency > SLA threshold and error rate > 1%. Traces — use OpenTelemetry SDK to create spans; propagate the W3C trace-context header across service calls; store in Tempo or Jaeger. Dashboards in Grafana. On-call runbooks linked from alerts. The SLO/SLA/SLI framework: define an error budget (e.g. 99.9% availability = 8.7 hours downtime/year); when budget burns too fast, freeze feature work and fix reliability.",
    },
  ],

  build: [
    "Design a URL shortener on paper: define the API, estimate QPS and storage for 100 M DAU, draw the component diagram (LB → app servers → cache → DB), and write the ID-generation and redirect logic in pseudocode.",
    "Build a minimal RAG pipeline: chunk a PDF, embed with OpenAI text-embedding-3-small, store in pgvector (or an in-memory HNSW index), and answer questions with a retrieved-context prompt. Measure latency and add a semantic cache with a cosine-similarity threshold.",
    "Implement a Redis-backed token-bucket rate limiter as Express middleware and load-test it with autocannon to verify it enforces the limit correctly under concurrent traffic.",
    "Sketch the architecture of a social media news feed (Twitter/X style): focus on the fan-out-on-write vs fan-out-on-read tradeoff, how you'd cache timelines, and how you'd handle celebrity accounts with 50 M followers differently from regular users.",
  ],

  pitfalls: [
    "Jumping to microservices or Kafka before clarifying requirements — most systems don't need either, and adding them prematurely multiplies complexity without benefit.",
    "Treating cache as optional — without caching, most read-heavy systems cannot meet latency SLAs at scale; cache invalidation must be designed upfront, not retrofitted.",
    "Ignoring the write path — designing a fast read path and then discovering the DB can't handle write QPS is a common interview failure; estimate writes separately from reads.",
    "Forgetting idempotency on async workers — at-least-once delivery is the default; without deduplication, retries will double-charge users or corrupt counters in production.",
    "Sharding too early — sharding makes cross-shard queries, transactions, and migrations extremely hard; exhaust vertical scaling, read replicas, and caching before you shard.",
  ],

  resources: [
    { label: "System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer" },
    { label: "ByteByteGo Newsletter & Book", url: "https://bytebytego.com/" },
    { label: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net/" },
    { label: "AWS Architecture Center", url: "https://aws.amazon.com/architecture/" },
    { label: "High Scalability Blog", url: "http://highscalability.com/" },
    { label: "OpenTelemetry Documentation", url: "https://opentelemetry.io/docs/" },
  ],

  checklist: [
    "Explain the 5-step interview framework (clarify → estimate → API → data → scale) from memory",
    "Estimate QPS and storage for a 100 M DAU system in under 2 minutes",
    "Describe CAP theorem and state which property a real app sacrifices and when",
    "Design a URL shortener end-to-end including ID generation, caching, and redirect strategy",
    "Explain cache-aside, write-through, and write-behind with their tradeoffs",
    "Articulate when to use a message queue vs a synchronous API call",
    "Describe primary-replica replication and explain when to shard instead",
    "Implement or describe a Redis-backed token-bucket rate limiter",
    "Sketch a RAG pipeline and explain where semantic caching fits",
    "Define idempotency and describe two concrete implementation patterns",
  ],
};
