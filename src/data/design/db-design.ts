import type { DesignTrack } from "./types";

export const dbDesignTrack: DesignTrack = {
  slug: "db-design",
  title: "DB Design",
  label: "DB DESIGN · MNC INTERVIEW PREP · MAY 2026",
  icon: "database",
  blurb:
    "Model data like a production engineer: schemas, indexes, transactions, partitions, replication, caching, search, and vector-aware data design.",
  why:
    "MNC backend and system-design rounds often zoom into the database after the high-level architecture. Strong DB design proves you understand correctness, performance, migrations, growth, operational risk, and how data choices affect the product.",
  simple:
    "DB design means deciding what data exists, how entities relate, how reads and writes happen, and how the database stays correct and fast as data grows. The best designs start from access patterns, not from random tables.",
  framework: [
    "Identify entities: users, orders, payments, messages, documents, tenants, permissions, events, and audit records.",
    "Identify relationships: one-to-one, one-to-many, many-to-many, ownership, lifecycle, and deletion rules.",
    "List access patterns: reads, writes, filters, sorts, reports, admin screens, background jobs, and peak queries.",
    "Choose storage: relational DB, document DB, cache, search index, object storage, vector store, or a combination.",
    "Design schema with keys, constraints, status fields, timestamps, and history/audit needs.",
    "Add indexes only for real queries and explain read/write tradeoffs.",
    "Define transactions, isolation, locking, idempotency, and consistency boundaries.",
    "Plan pagination, retention, archival, backups, migrations, partitioning, replication, and observability.",
  ],
  concepts: [
    {
      title: "Entity modeling",
      explain:
        "Start with nouns and lifecycle: User, Order, Payment, Message, Document, Tenant. Define who owns what, which records are immutable, and which fields change often.",
      note:
        "Good interviews sound product-aware: an order is not just a row, it has states, payments, shipments, refunds, and audit requirements.",
    },
    {
      title: "Access patterns first",
      explain:
        "Before tables or collections, list exact queries: get order by ID, list user orders by time, fetch unread messages, search documents by tenant, or aggregate daily clicks.",
      note:
        "Indexes, partitions, and NoSQL keys all come from access patterns.",
    },
    {
      title: "Normalization vs denormalization",
      explain:
        "Normalize to reduce duplication and keep correctness simple. Denormalize when repeated joins or read latency become expensive, but plan how duplicate data stays updated.",
      code: `normalized:
orders(id, user_id, status, total)
order_items(id, order_id, product_id, qty, price)

read-optimized projection:
user_order_cards(user_id, order_id, status, total, item_count, last_updated_at)`,
      note:
        "A senior answer explains the sync mechanism for denormalized projections: transaction, outbox event, worker, or rebuild job.",
    },
    {
      title: "Primary keys and foreign keys",
      explain:
        "Primary keys identify rows. Foreign keys protect relationships. Use business IDs carefully; most systems use generated IDs plus unique constraints on natural fields where needed.",
      note:
        "In distributed systems, discuss UUID/ULID/snowflake IDs, locality, ordering, and index bloat tradeoffs.",
    },
    {
      title: "Indexes and query plans",
      explain:
        "Indexes speed reads by avoiding full scans, but they consume storage and slow writes because every insert/update must maintain them. Composite index order should match filters and sort patterns.",
      code: `CREATE INDEX idx_orders_user_created
ON orders (user_id, created_at DESC);

-- Supports:
-- WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      note:
        "Mention EXPLAIN plans, slow-query logs, selectivity, covering indexes, and avoiding indexes nobody uses.",
    },
    {
      title: "Transactions and ACID",
      explain:
        "Transactions group changes so critical workflows are correct: reserve inventory, create payment record, update order status, append ledger entry. ACID protects atomicity, consistency, isolation, and durability.",
      code: `BEGIN;
UPDATE inventory SET reserved = reserved + 1 WHERE sku = $1 AND available > reserved;
INSERT INTO order_events(order_id, event_type) VALUES ($2, 'RESERVED');
COMMIT;`,
      note:
        "For money, inventory, permissions, and ledgers, define the transaction boundary explicitly.",
    },
    {
      title: "Isolation levels and locking",
      explain:
        "Isolation controls how concurrent transactions see each other. Locks prevent conflicting writes but can reduce throughput. Optimistic locking works well when conflicts are rare.",
      code: `UPDATE documents
SET content = $1, version = version + 1
WHERE id = $2 AND version = $3; -- fails if someone updated first`,
      note:
        "Be ready to explain dirty reads, non-repeatable reads, phantom reads, deadlocks, and when SERIALIZABLE is worth the cost.",
    },
    {
      title: "Idempotency keys",
      explain:
        "Idempotency prevents duplicate side effects when clients retry. Store a unique request key with the final response or operation result, especially for payments, orders, and notifications.",
      code: `CREATE TABLE idempotency_keys (
  key TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL,
  response_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`,
      note:
        "This is a high-signal MNC topic because retries happen constantly in distributed systems.",
    },
    {
      title: "Pagination and sorting",
      explain:
        "Offset pagination is simple but slow and unstable at large offsets. Cursor pagination uses a stable sort key like created_at plus id to fetch the next page efficiently.",
      code: `SELECT * FROM messages
WHERE conversation_id = $1
  AND (created_at, id) < ($2, $3)
ORDER BY created_at DESC, id DESC
LIMIT 50;`,
      note:
        "Mention deterministic ordering, composite indexes, and handling new rows between page requests.",
    },
    {
      title: "Partitioning",
      explain:
        "Partitioning splits one logical table by time, tenant, hash, or region so queries and maintenance operate on smaller chunks.",
      note:
        "Use time partitions for events/logs, tenant partitions for SaaS isolation, and hash partitions when load must spread evenly.",
    },
    {
      title: "Sharding",
      explain:
        "Sharding splits data across database nodes. It increases capacity but adds complexity: shard key choice, cross-shard queries, transactions, rebalancing, and hot shards.",
      note:
        "Do not introduce sharding too early. Mention vertical scaling, indexes, read replicas, caching, and partitioning first unless scale demands it.",
    },
    {
      title: "Replication",
      explain:
        "Replication copies data for read scale, failover, and regional access. Read replicas improve read throughput but may have lag, so critical reads may need the primary.",
      note:
        "Interviewers like hearing read-after-write consistency handling: read primary after write, session consistency, or UI pending states.",
    },
    {
      title: "Redis caching",
      explain:
        "Redis is useful for hot objects, sessions, counters, rate limits, locks with care, queues in small systems, and temporary state. Define keys, TTLs, invalidation, and memory limits.",
      code: `user:42:profile -> JSON, TTL 10m
rate:user:42:/checkout:2026-05-01T10:15 -> counter, TTL 60s
feed:42:first_page -> ids[], TTL 30s`,
      note:
        "Cache is not a source of truth unless the product explicitly accepts data loss or rebuildability.",
    },
    {
      title: "Search and vector stores",
      explain:
        "Transactional DBs are not ideal for relevance search or semantic retrieval. Use search indexes for text and vector stores for embeddings, while keeping canonical metadata and permissions in the main DB.",
      code: `documents(id, tenant_id, owner_id, source_url, checksum, status)
document_chunks(id, document_id, chunk_index, text_hash, token_count)
vector_index: chunk_id -> embedding
permissions: principal_id, document_id, role`,
      note:
        "For RAG, always include tenant filtering, permission checks, chunk metadata, re-indexing, and deletion propagation.",
    },
  ],
  caseStudies: [
    {
      title: "E-commerce orders",
      scenario: "Design orders, items, payments, shipment status, cancellations, and returns.",
      focus: ["order state", "line items", "transactions", "status history", "indexes by user/time"],
    },
    {
      title: "Wallet/ledger",
      scenario: "Track balances without losing money or double-applying transactions.",
      focus: ["double-entry ledger", "immutability", "idempotency", "reconciliation", "audits"],
    },
    {
      title: "Chat messages",
      scenario: "Store conversations, participants, messages, read receipts, and attachments.",
      focus: ["cursor pagination", "partition by conversation", "ordering", "retention", "search"],
    },
    {
      title: "Notification preferences",
      scenario: "Allow users to control email, SMS, push, and in-app notification settings.",
      focus: ["preferences", "templates", "channel overrides", "quiet hours", "delivery log"],
    },
    {
      title: "Ride booking",
      scenario: "Model riders, drivers, trips, matching, pricing, and trip lifecycle.",
      focus: ["state machine", "geo index", "availability", "payments", "events"],
    },
    {
      title: "URL analytics",
      scenario: "Track redirect events, aggregate metrics, and keep raw events manageable.",
      focus: ["append-only events", "time partitions", "rollups", "hot link handling", "retention"],
    },
    {
      title: "RBAC/auth",
      scenario: "Design users, roles, permissions, teams, and tenant-level access.",
      focus: ["many-to-many", "permission checks", "tenant isolation", "audit log", "cache invalidation"],
    },
    {
      title: "Audit log",
      scenario: "Store who changed what, when, from where, and why.",
      focus: ["append-only", "immutability", "time partitions", "search", "retention policy"],
    },
    {
      title: "Multi-tenant SaaS",
      scenario: "Support many customer organizations safely in one product.",
      focus: ["tenant_id", "isolation", "unique constraints", "billing", "noisy-neighbor control"],
    },
    {
      title: "RAG document metadata",
      scenario: "Track documents, chunks, embeddings, permissions, ingestion jobs, and deletion.",
      focus: ["chunk metadata", "vector references", "permission filters", "re-indexing", "eval data"],
    },
  ],

  realWorldExamples: [
    {
      prompt: "Design the database for Amazon/Flipkart order checkout.",
      askedBy: "Common e-commerce backend and DB design interview pattern",
      scenario:
        "A user places an order with multiple items, coupons, taxes, shipment updates, cancellation/refund flows, and admin queries by user, order ID, and time range.",
      mustCover: ["orders and order_items", "payment attempts", "inventory reservation", "status history", "user/time indexes", "refund records"],
    },
    {
      prompt: "Design the database for a wallet, UPI, or Stripe-like payment ledger.",
      askedBy: "Common fintech interview pattern",
      scenario:
        "Money moves between accounts, retries and webhooks can arrive more than once, balances must be explainable, and finance teams need reconciliation reports.",
      mustCover: ["double-entry ledger", "immutable entries", "idempotency keys", "balance snapshots", "reconciliation", "audit trail"],
    },
    {
      prompt: "Design the database for Instagram/Twitter posts, likes, comments, and followers.",
      askedBy: "Common social product DB design interview pattern",
      scenario:
        "Users create posts, follow accounts, like/comment at high volume, browse timelines, and celebrities create hot partitions.",
      mustCover: ["follow graph", "post table", "likes uniqueness", "comment pagination", "feed projection", "hot-key mitigation"],
    },
    {
      prompt: "Design the database for Airbnb hotel/property booking.",
      askedBy: "Common booking and calendar availability interview pattern",
      scenario:
        "Guests search available rooms, reserve date ranges, hosts update calendars, payments expire, and the same inventory must not be booked twice.",
      mustCover: ["availability calendar", "date-range constraints", "booking state", "temporary holds", "payment attempts", "search filters"],
    },
    {
      prompt: "Design the database for a multi-tenant Jira/Notion-style SaaS workspace.",
      askedBy: "Common enterprise SaaS DB design interview pattern",
      scenario:
        "Many organizations share the product, each workspace has users, roles, projects/pages, comments, audit logs, billing, and strict tenant isolation.",
      mustCover: ["tenant_id strategy", "RBAC tables", "unique constraints", "audit logs", "soft deletes", "tenant-scoped indexes"],
    },
  ],
  interviewPhrases: [
    "I will design the schema from access patterns, not just from entities.",
    "This field needs a constraint because correctness is more important than application-only validation here.",
    "This index supports the main read query, but it will add write overhead, so I would verify it with query plans.",
    "This workflow needs a transaction and idempotency key because retries can create duplicate side effects.",
    "I would keep the relational database as source of truth and build cache/search/vector indexes as derived projections.",
  ],
  interviewQs: [
    {
      q: "When do you normalize data?",
      a: "Normalize when correctness, deduplication, and relationship integrity matter. It keeps updates simple and avoids conflicting copies of the same fact.",
    },
    {
      q: "When do you denormalize data?",
      a: "Denormalize for read-heavy paths where joins or repeated computation are too slow. You must also explain how the duplicate data is updated or rebuilt.",
    },
    {
      q: "How do indexes speed reads but slow writes?",
      a: "An index lets the database find rows without scanning the table. Writes are slower because each insert, update, or delete must also update every affected index.",
    },
    {
      q: "How do you prevent double payment?",
      a: "Use idempotency keys, unique payment attempts, clear payment states, database transactions where needed, gateway callback deduplication, and audit/ledger records.",
    },
    {
      q: "How would you design a ledger?",
      a: "Use append-only entries, double-entry accounting, immutable transaction IDs, idempotency, reconciliation jobs, and never update balance without a traceable entry.",
    },
    {
      q: "How do you paginate at scale?",
      a: "Prefer cursor pagination with a stable sort key and matching composite index. Avoid large offsets for high-volume feeds or message histories.",
    },
    {
      q: "Replication vs sharding?",
      a: "Replication copies the same data for reads and failover. Sharding splits data across nodes for write/storage capacity. Replication is simpler; sharding adds routing and cross-shard complexity.",
    },
    {
      q: "How do you handle hot partitions?",
      a: "Choose better partition keys, split hot keys, add caching, isolate heavy tenants, pre-aggregate events, and monitor load at partition/shard level.",
    },
    {
      q: "When would you use Redis?",
      a: "Use Redis for hot cache, sessions, counters, rate limits, temporary state, and low-latency reads. Define TTLs and invalidation; do not treat it as durable source of truth by default.",
    },
    {
      q: "When would you use MongoDB or a document DB?",
      a: "Use a document DB when the aggregate is naturally document-shaped, schema changes often, and access is mostly by document or known keys. Avoid it when complex joins and strong relational constraints dominate.",
    },
    {
      q: "How do you evolve schema without downtime?",
      a: "Use expand-and-contract migrations: add nullable fields/tables, deploy code that writes both versions, backfill safely, switch reads, then remove old fields later.",
    },
    {
      q: "How do you store embeddings and metadata for RAG?",
      a: "Store canonical document/chunk metadata and permissions in the main DB, vectors in a vector index, and connect them with chunk IDs. Deletions and permission changes must propagate to retrieval.",
    },
  ],
  build: [
    "Order management schema with order items, status history, payments, cancellations, returns, and indexes for user/order/admin queries.",
    "Wallet ledger with double-entry accounting, immutable entries, idempotency keys, reconciliation query, and transaction tests.",
    "Multi-tenant SaaS database with tenant isolation, RBAC, audit logs, billing tables, and zero-downtime migration notes.",
    "RAG document store with documents, chunks, ingestion jobs, vector references, permission filters, deletion propagation, and eval datasets.",
  ],
  pitfalls: [
    "Designing tables before writing access patterns.",
    "Adding indexes randomly without query plans or write-cost awareness.",
    "Using UUIDs everywhere without considering locality, index size, and ordering needs.",
    "Ignoring transaction boundaries in money, inventory, permissions, or booking flows.",
    "Forgetting idempotency for retryable APIs and queue consumers.",
    "Using cache without TTL, invalidation, ownership, and fallback strategy.",
    "Choosing NoSQL only because the word scale appears in the question.",
    "Skipping migrations, backups, retention, and observability.",
  ],
  checklist: [
    "I can identify entities, relationships, ownership, and lifecycle.",
    "I can write access patterns before choosing tables and indexes.",
    "I can choose primary keys, foreign keys, unique constraints, and status fields.",
    "I can design indexes and explain their read/write tradeoffs.",
    "I can define transaction boundaries and isolation requirements.",
    "I can design idempotency for payments, orders, webhooks, and queue consumers.",
    "I can implement cursor pagination for high-volume lists.",
    "I can compare SQL, NoSQL, Redis, search indexes, and vector stores.",
    "I can explain replication, partitioning, sharding, hot partitions, and read lag.",
    "I can plan schema migrations, backfills, retention, backups, and monitoring.",
  ],
  resources: [
    { label: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/" },
    { label: "MongoDB Data Modeling", url: "https://www.mongodb.com/docs/manual/data-modeling/" },
    { label: "Redis Documentation", url: "https://redis.io/docs/latest/" },
    { label: "PlanetScale database design course", url: "https://planetscale.com/learn/courses/mysql-for-developers/schema" },
  ],
};
