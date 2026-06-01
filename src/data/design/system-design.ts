import type { DesignTrack } from "./types";

export const systemDesignTrack: DesignTrack = {
  slug: "system-design",
  title: "System Design",
  label: "SYSTEM DESIGN · MNC INTERVIEW PREP · MAY 2026",
  icon: "network",
  blurb:
    "Design systems that survive real traffic: requirements, APIs, scale, queues, caching, consistency, observability, and AI-era architecture.",
  why:
    "System design is the round where MNC interviewers check whether you can think beyond code. They want tradeoffs, bottlenecks, failure handling, cost awareness, and clear communication — not just a diagram with many boxes.",
  simple:
    "System design means turning a product requirement into a reliable technical plan. You start with what users need, estimate traffic, design APIs and data flow, then explain how the system stays fast, correct, secure, observable, and affordable as usage grows.",
  framework: [
    "Clarify functional requirements: users, actions, core flows, out-of-scope features, and success criteria.",
    "Clarify non-functional requirements: latency, availability, consistency, durability, security, compliance, scale, and cost.",
    "Estimate scale: daily active users, QPS, read/write ratio, storage growth, bandwidth, fanout, and peak traffic.",
    "Define APIs and contracts before infrastructure so the design has a clear product surface.",
    "Model the data and choose storage based on access patterns, consistency, and growth.",
    "Draw the high-level architecture: clients, gateway, services, databases, caches, queues, workers, and external dependencies.",
    "Deep dive into bottlenecks: hot keys, fanout, queue lag, cache invalidation, database contention, and regional latency.",
    "Close with reliability, observability, rollout, security, and cost tradeoffs.",
  ],
  concepts: [
    {
      title: "Requirements before technology",
      explain:
        "Strong candidates ask what must be built, who uses it, and what quality bar matters. A chat app, payment workflow, and RAG assistant all need different correctness and latency choices.",
      note:
        "Interviewers prefer a simple design tied to requirements over a fashionable stack that ignores the problem.",
    },
    {
      title: "Back-of-the-envelope estimation",
      explain:
        "Estimate QPS, storage, bandwidth, and peak traffic using simple assumptions. The exact number matters less than showing where the system will break first.",
      code: `DAU = 10_000_000
requests_per_user_per_day = 20
avg_qps = DAU * requests_per_user_per_day / 86_400
peak_qps = avg_qps * 5
# Use peak_qps to size gateway, cache, workers, DB writes, and queues.`,
      note:
        "MNC rounds often test whether you can size a system before adding caches, shards, or queues.",
    },
    {
      title: "API and contract design",
      explain:
        "APIs define the product behavior: request shape, response shape, idempotency, pagination, auth, errors, and versioning. Good APIs make distributed systems easier to evolve.",
      code: `POST /v1/notifications
Idempotency-Key: req_123

{
  "userId": "u_42",
  "channel": "email",
  "template": "order_shipped",
  "payload": { "orderId": "ord_99" }
}`,
      note:
        "For write APIs, mention idempotency keys, retries, and clear error semantics.",
    },
    {
      title: "Load balancing and stateless services",
      explain:
        "A load balancer spreads requests across stateless app servers. Stateless services scale horizontally because any server can handle any request after authentication and routing.",
      note:
        "Keep session state in a shared store or token, not in one process, unless you can explain sticky-session tradeoffs.",
    },
    {
      title: "Caching",
      explain:
        "Caches reduce latency and database load for repeated reads. Discuss cache-aside, TTLs, invalidation, stale reads, hot keys, and what happens when the cache fails.",
      code: `read profile:
1. get user:42 from Redis
2. on miss, read Postgres
3. write Redis with TTL=10m
4. invalidate or refresh after profile update`,
      note:
        "Never say only 'use Redis'. Explain the key, value, TTL, invalidation, and fallback path.",
    },
    {
      title: "Rate limiting and abuse control",
      explain:
        "Rate limiters protect APIs from spikes, bots, and accidental client loops. Common approaches are token bucket, leaky bucket, fixed window, and sliding window counters.",
      note:
        "Mention per-user, per-IP, per-tenant, and per-endpoint limits. For MNC systems, also mention graceful 429 responses and monitoring.",
    },
    {
      title: "Queues and async workers",
      explain:
        "Queues decouple slow or retryable work from the request path: emails, video processing, webhooks, indexing, and AI document ingestion. They improve resilience but add eventual consistency.",
      note:
        "Discuss retries, dead-letter queues, idempotent workers, ordering needs, and queue lag metrics.",
    },
    {
      title: "Storage choice: SQL, NoSQL, search, cache, vector",
      explain:
        "Choose storage by access pattern. SQL is strong for relational consistency, NoSQL for flexible high-scale access patterns, search indexes for text retrieval, Redis for ephemeral fast access, and vector databases for semantic retrieval.",
      note:
        "In 2026 AI product interviews, candidates are expected to know where embeddings and retrieval fit, but not to replace transactional data with vectors.",
    },
    {
      title: "Replication and sharding",
      explain:
        "Replication copies data to improve read scale and availability. Sharding splits data to reduce per-node load. Replication is usually simpler; sharding is a later-stage scale decision with operational cost.",
      note:
        "Explain shard key choice, hot partitions, resharding, cross-shard queries, and read-after-write tradeoffs.",
    },
    {
      title: "Consistency models",
      explain:
        "Strong consistency gives the latest correct value but can reduce availability or increase latency. Eventual consistency scales well but requires UX and business logic that tolerate temporary staleness.",
      note:
        "Payments, ledgers, inventory reservations, and permissions need stronger guarantees than likes, view counts, or feed ranking.",
    },
    {
      title: "Observability and SLOs",
      explain:
        "Production systems need logs, metrics, traces, alerts, and dashboards. Define SLOs around latency, error rate, availability, queue lag, cache hit rate, and cost per request.",
      note:
        "A strong answer includes how the team would know the system is broken before customers complain.",
    },
    {
      title: "AI-era system design",
      explain:
        "Modern MNC interviews increasingly include RAG, LLM gateways, model routing, prompt/version management, vector search, evals, guardrails, and cost/latency budgets.",
      code: `RAG flow:
client -> API -> auth -> query rewrite
       -> embedding model -> vector search
       -> reranker -> LLM gateway
       -> citations + safety checks -> response`,
      note:
        "Discuss retrieval quality, hallucination controls, token budgets, fallback models, prompt injection risks, and offline evaluation.",
    },
  ],
  caseStudies: [
    {
      title: "URL shortener",
      scenario: "Create short links, redirect in low latency, and track analytics.",
      focus: ["ID generation", "read-heavy redirects", "cache", "analytics pipeline", "abuse prevention"],
    },
    {
      title: "Notification system",
      scenario: "Send email, SMS, push, and in-app notifications reliably.",
      focus: ["templates", "queues", "retries", "rate limits", "idempotent delivery"],
    },
    {
      title: "Chat/messaging",
      scenario: "Support one-to-one and group messages with online delivery and history.",
      focus: ["WebSockets", "message ordering", "fanout", "presence", "storage partitions"],
    },
    {
      title: "File upload/storage",
      scenario: "Upload large files, generate thumbnails, and serve downloads securely.",
      focus: ["pre-signed URLs", "object storage", "metadata DB", "workers", "CDN"],
    },
    {
      title: "Rate limiter",
      scenario: "Protect APIs with per-user and per-IP limits at high QPS.",
      focus: ["token bucket", "Redis counters", "distributed limits", "429 behavior", "metrics"],
    },
    {
      title: "News feed",
      scenario: "Generate personalized feeds for millions of users.",
      focus: ["fanout on write/read", "ranking", "cache", "eventual consistency", "hot celebrities"],
    },
    {
      title: "Payment workflow",
      scenario: "Create payment intents, handle gateway callbacks, and avoid double charges.",
      focus: ["state machine", "idempotency", "transactions", "outbox", "audit log"],
    },
    {
      title: "Search/autocomplete",
      scenario: "Return relevant suggestions and search results with low latency.",
      focus: ["inverted index", "prefix matching", "ranking", "indexing pipeline", "freshness"],
    },
    {
      title: "RAG document Q&A",
      scenario: "Let employees ask questions over private documents with citations.",
      focus: ["ingestion", "chunking", "embeddings", "retrieval", "evals", "permissions"],
    },
    {
      title: "Low-latency inference API",
      scenario: "Serve ML/LLM predictions while controlling tail latency and cost.",
      focus: ["model gateway", "batching", "fallbacks", "timeouts", "observability", "cost budgets"],
    },
  ],

  realWorldExamples: [
    {
      prompt: "Design WhatsApp or Slack-style messaging for one-to-one and large group chats.",
      askedBy: "Common Meta, Microsoft, Amazon, and startup interview pattern",
      scenario:
        "Users expect instant delivery when online, durable history when offline, typing/presence signals, media attachments, and message search across devices.",
      mustCover: ["WebSocket gateways", "message ordering", "offline delivery", "group fanout", "read receipts", "multi-device sync"],
    },
    {
      prompt: "Design Uber/Ola ride matching during peak traffic in a city.",
      askedBy: "Common marketplace and location-system interview pattern",
      scenario:
        "Riders request nearby drivers, drivers move every few seconds, pricing changes with demand, and the system must recover when drivers reject or cancel rides.",
      mustCover: ["geo indexing", "driver location stream", "matching state machine", "surge pricing", "timeouts", "eventual consistency"],
    },
    {
      prompt: "Design YouTube/Netflix video upload, processing, and streaming.",
      askedBy: "Common Google, Netflix-style media platform interview pattern",
      scenario:
        "Creators upload large videos, background workers transcode multiple qualities, viewers stream from the nearest edge, and analytics must handle massive event volume.",
      mustCover: ["pre-signed upload", "object storage", "transcoding queue", "CDN", "adaptive bitrate", "analytics pipeline"],
    },
    {
      prompt: "Design a Gmail/Outlook notification and inbox system.",
      askedBy: "Common enterprise SaaS and productivity interview pattern",
      scenario:
        "Users receive many messages, need unread counts and search, expect push/email alerts, and must not receive duplicate notifications after retries.",
      mustCover: ["inbox write path", "search index", "unread counters", "notification preferences", "idempotent sends", "rate limits"],
    },
    {
      prompt: "Design a ticket booking system like BookMyShow or Ticketmaster.",
      askedBy: "Common high-contention inventory interview pattern",
      scenario:
        "Thousands of users compete for limited seats, selected seats need temporary holds, payments can fail, and inventory must never be oversold.",
      mustCover: ["seat locking", "TTL holds", "payment state", "idempotency", "queueing traffic spikes", "consistency"],
    },
  ],
  interviewPhrases: [
    "I will start with requirements and scale before choosing technologies.",
    "The main bottleneck seems to be the read path/write path/fanout path; I will optimize that first.",
    "I will keep v1 simple, then scale only the hot path with cache, queues, or partitioning.",
    "This choice trades stronger consistency for lower latency; for this business flow that is acceptable/not acceptable.",
    "I would monitor latency percentiles, error rate, saturation, queue lag, cache hit rate, and cost per request.",
  ],
  interviewQs: [
    {
      q: "How do you structure a system design interview answer?",
      a: "Clarify requirements, estimate scale, define APIs, model data, draw the high-level architecture, deep dive on bottlenecks, then discuss reliability, security, observability, and tradeoffs.",
    },
    {
      q: "When do you introduce a cache?",
      a: "After identifying repeated read traffic, high latency, or database pressure. I also define cache key, value, TTL, invalidation, stale-read tolerance, and behavior when the cache is unavailable.",
    },
    {
      q: "Queue vs synchronous API call?",
      a: "Use synchronous calls when the user needs an immediate answer. Use queues for slow, retryable, bursty, or non-critical work such as notifications, indexing, video processing, webhooks, and document ingestion.",
    },
    {
      q: "How do you make retries safe?",
      a: "Use idempotency keys, deduplication tables or unique constraints, idempotent workers, retry limits, exponential backoff, and dead-letter queues for poison messages.",
    },
    {
      q: "How do you choose between SQL and NoSQL?",
      a: "Start with access patterns and consistency. SQL fits relational data and transactions. NoSQL fits flexible schema or high-scale key-based access. Many real systems combine SQL for source of truth with search/cache/NoSQL projections.",
    },
    {
      q: "How do you handle a hot partition or celebrity user?",
      a: "Avoid shard keys that concentrate traffic, split hot keys, cache hot reads, use fanout strategies, isolate heavy tenants, and monitor partition-level load.",
    },
    {
      q: "What should you mention for observability?",
      a: "Golden signals: latency, traffic, errors, saturation. Add business metrics, queue lag, cache hit rate, database slow queries, tracing across services, and alerts tied to SLOs.",
    },
    {
      q: "What changes for AI/RAG system design in 2026?",
      a: "Add ingestion, chunking, embedding, vector search, reranking, prompt/version management, LLM gateway, evals, citations, guardrails, permission filtering, and cost/latency monitoring.",
    },
  ],
  build: [
    "Production-grade URL shortener with custom aliases, Redis redirect cache, click analytics, abuse controls, and dashboards.",
    "Notification platform with templates, user preferences, queue workers, retries, dead-letter queue, provider fallback, and idempotent sends.",
    "Chat app with WebSocket gateway, message persistence, delivery receipts, presence, pagination, and group fanout strategy.",
    "RAG Q&A platform with document ingestion, chunk metadata, vector search, citations, eval set, and latency/cost tracing.",
  ],
  pitfalls: [
    "Jumping to tools before clarifying requirements and scale.",
    "Drawing many boxes without explaining data flow and ownership.",
    "Saying 'use cache' without TTL, invalidation, stale-read, or fallback strategy.",
    "Ignoring failure modes: retries, partial failure, dependency outage, queue backlog, and regional issues.",
    "Overengineering for fake scale instead of optimizing the proven bottleneck.",
    "Forgetting observability, security, rollout, and cost controls.",
  ],
  checklist: [
    "I can clarify requirements in the first 3–5 minutes.",
    "I can estimate QPS, storage, bandwidth, and peak traffic.",
    "I can design APIs with pagination, auth, errors, and idempotency.",
    "I can explain cache keys, TTLs, invalidation, and fallback behavior.",
    "I can compare sync APIs, queues, streams, and scheduled workers.",
    "I can reason about consistency, replication, sharding, and hot partitions.",
    "I can design retries, dead-letter queues, and idempotent consumers.",
    "I can add logs, metrics, traces, SLOs, and alerting to the design.",
    "I can explain RAG/LLM architecture with retrieval quality, evals, permissions, latency, and cost tradeoffs.",
  ],
  resources: [
    { label: "AWS Architecture Center", url: "https://aws.amazon.com/architecture/" },
    { label: "Google Cloud Architecture Framework", url: "https://cloud.google.com/architecture/framework" },
    { label: "Microsoft Azure Well-Architected Framework", url: "https://learn.microsoft.com/azure/well-architected/" },
    { label: "OpenAI production best practices", url: "https://platform.openai.com/docs/guides/production-best-practices" },
  ],
};
