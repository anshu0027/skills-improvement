import type { Module } from "@/data/learn/types";
import { getModuleMeta } from "@/data/learn/meta";

const meta = getModuleMeta("backend-apis")!;

export const learnModule: Module = {
  ...meta,
  simple:
    "A backend API is a contract between your server and whoever calls it — a browser, a mobile app, another service. You agree on URLs, verbs, data shapes, and status codes; the caller never needs to know how your database works. Think of it like a restaurant menu: the kitchen (implementation) can change completely as long as the menu (API contract) stays consistent. Getting the contract right — safe auth, predictable errors, protection against abuse — is the difference between a toy server and a production service.",

  concepts: [
    {
      title: "REST resource design & HTTP status codes",
      explain:
        "REST models your domain as nouns (resources) addressed by URLs, acted on with HTTP verbs. A good URL names the collection and the item: `/users` and `/users/:id`. Status codes are part of the contract — 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests, 500 Internal Server Error. Returning 200 for an error or 500 for a validation failure breaks every client that tries to handle errors gracefully.",
      code: `import express, { Request, Response } from "express";
const app = express();
app.use(express.json());

// Collection: GET /users → list, POST /users → create
// Item:       GET /users/:id, PUT/PATCH /users/:id, DELETE /users/:id

app.post("/users", async (req: Request, res: Response) => {
  // 201 Created + Location header on success
  const user = await createUser(req.body);
  res.status(201).location(\`/users/\${user.id}\`).json(user);
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const user = await findUser(req.params.id);
  if (!user) return res.status(404).json({ title: "User not found" });
  res.json(user);
});

app.delete("/users/:id", async (_req: Request, res: Response) => {
  await deleteUser(_req.params.id);
  res.status(204).send(); // No Content — body is empty
});`,
      lang: "typescript",
      note: "Misusing status codes is one of the most common API bugs. A 200 with `{ success: false }` in the body forces every client to parse the body before detecting failure — 4xx/5xx let HTTP-level tooling (load balancers, retry logic, monitoring) act correctly without reading JSON.",
    },
    {
      title: "HTTP methods & idempotency",
      explain:
        "Idempotent means 'calling it N times has the same effect as calling it once'. GET, PUT, DELETE, HEAD, and OPTIONS are all idempotent — you can retry them safely on network failure. POST is not — retrying a POST to create an order may charge a card twice. PATCH is technically not required to be idempotent but often is in practice. This property is critical for safe retry logic in clients, load balancers, and background job queues.",
      code: `// GET — safe + idempotent: just reads state, retry freely
app.get("/orders/:id", handler);

// PUT — idempotent: full replace; same body → same result
// PUT /users/42 with { name: "Ada" } sets name to Ada every time
app.put("/users/:id", handler);

// DELETE — idempotent: deleting twice leaves same state (gone)
// Tip: return 204 if deleted, 404 if already gone — both are correct
app.delete("/orders/:id", handler);

// POST — NOT idempotent: each call may create a new resource
// POST /payments could charge a card — guard with an idempotency key
app.post("/payments", handler);`,
      lang: "typescript",
      note: "Load balancers like AWS ALB can automatically retry timed-out idempotent requests. If you label a write endpoint as GET, or if POST side-effects are not guarded, those retries cause duplicate mutations — charges, emails, records.",
    },
    {
      title: "PUT vs PATCH",
      explain:
        "PUT replaces the entire resource with the request body — fields you omit are cleared. PATCH applies a partial update — only the fields you send change. In practice, PATCH is almost always what users want for edit forms (they only send changed fields), but it is trickier to implement correctly: you must merge, not overwrite. A simple rule: use PUT only when the client owns and sends the full resource representation every time.",
      code: `// PUT: full replacement — send the whole object
// PATCH: partial update — send only changed fields
app.patch("/users/:id", async (req, res) => {
  const { name, email } = req.body;  // only provided fields
  const updated = await db.user.update({
    where: { id: req.params.id },
    data: { ...(name && { name }), ...(email && { email }) },
  });
  res.json(updated);
});

// Bad PATCH that accidentally acts like PUT:
// await db.user.update({ where: { id }, data: req.body });
// — if body is { name: "Ada" }, email gets wiped to undefined`,
      lang: "typescript",
      note: "GraphQL mutations sidestep this entirely since every field is explicit. In REST services, the most common PATCH bug is passing `req.body` directly to a database update and accidentally nulling unmentioned fields.",
    },
    {
      title: "Authentication: sessions vs JWT, access + refresh tokens",
      explain:
        "Authentication proves who you are. Sessions store state server-side (usually in Redis): the server issues a cookie with a session ID, and every request hits the store to verify it — easy to revoke, works great for monoliths. JWTs are signed tokens the server issues and clients store (Authorization header); the server verifies the signature without a DB lookup — stateless, great for microservices and mobile, but hard to revoke before expiry. The standard pattern combines both strengths: a short-lived access token (15 min) and a long-lived refresh token (7–30 days) stored in an HttpOnly cookie. The access token can't be revoked but expires fast; the refresh token is revocable and is used only to issue new access tokens.",
      code: `import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

function issueTokens(userId: string) {
  const access = jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: "15m" });
  const refresh = jwt.sign({ sub: userId }, REFRESH_SECRET, { expiresIn: "7d" });
  return { access, refresh };
}

// POST /auth/refresh — client calls this when access token expires
async function refreshHandler(req: Request, res: Response) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ title: "No refresh token" });
  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as { sub: string };
    // Optionally: check token is not in a revocation list in Redis
    const { access, refresh } = issueTokens(payload.sub);
    res.cookie("refreshToken", refresh, { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ accessToken: access });
  } catch {
    res.status(401).json({ title: "Invalid or expired refresh token" });
  }
}`,
      lang: "typescript",
      note: "Store the refresh token in an HttpOnly Secure SameSite=Strict cookie, never in localStorage. LocalStorage is readable by any script on the page (XSS), but HttpOnly cookies are not. The access token can go in memory (React state) so it is never persisted to disk.",
    },
    {
      title: "Authorization: RBAC",
      explain:
        "Authentication answers 'who are you?'; authorization answers 'what can you do?'. Role-Based Access Control (RBAC) assigns users to roles (admin, editor, viewer) and roles to permissions. Check roles at the route level using middleware so every handler can assume the caller is allowed. Attribute-Based Access Control (ABAC) is more granular — 'user can edit their own posts' — and is evaluated against the resource being accessed.",
      code: `type Role = "admin" | "editor" | "viewer";

function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: Function) => {
    const user = req.user;               // set by auth middleware earlier
    if (!user) return res.status(401).json({ title: "Unauthenticated" });
    if (!roles.includes(user.role)) {
      return res.status(403).json({ title: "Forbidden" });
    }
    next();
  };
}

// Only admins and editors can create posts
app.post("/posts", requireRole("admin", "editor"), createPostHandler);

// ABAC example: ownership check inside the handler
app.delete("/posts/:id", requireRole("admin", "editor"), async (req, res) => {
  const post = await db.post.findUnique({ where: { id: req.params.id } });
  if (!post) return res.status(404).json({ title: "Not found" });
  if (post.authorId !== req.user!.id && req.user!.role !== "admin") {
    return res.status(403).json({ title: "You do not own this post" });
  }
  await db.post.delete({ where: { id: req.params.id } });
  res.status(204).send();
});`,
      lang: "typescript",
      note: "Never enforce authorization only on the frontend. The UI can hide buttons but any user with curl can still call the endpoint. All authorization logic must live server-side, as close to the data as possible.",
    },
    {
      title: "Input validation with zod at the boundary",
      explain:
        "Never trust data that arrives from outside your process — HTTP bodies, query strings, path params, headers, environment variables. Validate at the very edge, before business logic runs, and return a 400/422 immediately on invalid input. Zod is the standard in the TypeScript ecosystem because it gives you both a runtime validator and a static type from the same schema declaration.",
      code: `import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150).optional(),
  role: z.enum(["admin", "editor", "viewer"]).default("viewer"),
});

type CreateUserBody = z.infer<typeof CreateUserSchema>;

app.post("/users", async (req: Request, res: Response) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    // Return structured validation errors
    return res.status(422).json({
      title: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }
  const data: CreateUserBody = result.data;   // fully typed, coerced, safe
  const user = await createUser(data);
  res.status(201).json(user);
});`,
      lang: "typescript",
      note: "SQL injection, NoSQL injection, and prototype pollution all start with unvalidated input. Parsing at the boundary also enforces your API contract — a field missing or of the wrong type returns a helpful error instead of a cryptic 500 later when the DB rejects it.",
    },
    {
      title: "Rate limiting: token-bucket & sliding-window with Redis",
      explain:
        "Rate limiting protects your API from abuse, accidental DDoS, and runaway clients. Two common algorithms: the token-bucket gives each client a bucket of tokens that refills at a fixed rate — each request costs one token; when empty the request is rejected. The sliding-window counter counts requests in the last N seconds, giving a smoother limit without the burst allowed by a fixed-window approach. In a multi-instance deployment you must share state — Redis with atomic Lua scripts or INCRBY+EXPIRE is the standard.",
      code: `import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

const client = new Redis(process.env.REDIS_URL!);

const rateLimiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: "rl",
  points: 100,        // 100 requests
  duration: 60,       // per 60 seconds
  blockDuration: 10,  // block for 10s after limit hit
});

async function rateLimitMiddleware(req: Request, res: Response, next: Function) {
  const key = req.ip ?? "unknown";
  try {
    const info = await rateLimiter.consume(key);
    res.set({
      "X-RateLimit-Limit": "100",
      "X-RateLimit-Remaining": String(info.remainingPoints),
      "X-RateLimit-Reset": String(Date.now() + info.msBeforeNext),
    });
    next();
  } catch (err: any) {
    res.status(429).set("Retry-After", String(Math.ceil(err.msBeforeNext / 1000)))
       .json({ title: "Too Many Requests", retryAfterMs: err.msBeforeNext });
  }
}`,
      lang: "typescript",
      note: "Always include `X-RateLimit-Remaining` and `Retry-After` headers so well-behaved clients can back off gracefully. In cloud deployments rate-limit by authenticated user ID, not just IP — NAT gateways can make hundreds of users share one IP.",
    },
    {
      title: "Pagination: offset vs cursor (keyset)",
      explain:
        "Offset pagination (`?page=3&limit=20`) is simple to implement but breaks under load: a `OFFSET 60000` scan forces the database to read and discard 60,000 rows. It also drifts — if a row is inserted before your current page, you see a duplicate or skip an item. Cursor (keyset) pagination returns an opaque cursor pointing to the last seen row; the next query uses a WHERE clause against the index, making it O(1) regardless of depth. Use cursor pagination for feeds, activity logs, and any large or frequently-updated collection.",
      code: `// Offset pagination — easy but scales poorly
app.get("/posts", async (req, res) => {
  const limit = Number(req.query.limit ?? 20);
  const offset = Number(req.query.offset ?? 0);
  const posts = await db.post.findMany({ take: limit, skip: offset, orderBy: { id: "asc" } });
  res.json({ posts, next: posts.length === limit ? offset + limit : null });
});

// Cursor pagination — scales to millions of rows
app.get("/posts/feed", async (req, res) => {
  const limit = Number(req.query.limit ?? 20);
  const cursor = req.query.cursor as string | undefined;

  const posts = await db.post.findMany({
    take: limit + 1,                                  // fetch one extra to detect next page
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,                            // skip the cursor row itself
    orderBy: { id: "asc" },
  });

  const hasMore = posts.length > limit;
  const page = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore ? page[page.length - 1].id : null;
  res.json({ posts: page, nextCursor });
});`,
      lang: "typescript",
      note: "Expose cursor pagination externally as an opaque base64-encoded string so the implementation can change (e.g. switch from ID to `(createdAt, id)` composite) without breaking clients. Never expose raw database offsets as part of your API contract.",
    },
    {
      title: "Idempotency keys for safe retries",
      explain:
        "Non-idempotent POST endpoints (payments, emails, order creation) are dangerous to retry — a network timeout leaves the client unsure whether the action happened. An idempotency key is a UUID the client generates and sends in a header (`Idempotency-Key`). The server stores the key → response mapping in Redis; if the same key arrives again, it returns the cached response instead of executing the action twice. This makes non-idempotent operations safely retryable.",
      code: `import { v4 as uuidv4 } from "uuid";

async function idempotencyMiddleware(req: Request, res: Response, next: Function) {
  if (req.method !== "POST") return next();
  const key = req.headers["idempotency-key"] as string | undefined;
  if (!key) return next();  // key is optional — omit to skip dedup

  const cached = await redis.get(\`idem:\${key}\`);
  if (cached) {
    const { status, body } = JSON.parse(cached);
    return res.status(status).json(body);   // replay stored response
  }

  // Intercept and cache the response
  const originalJson = res.json.bind(res);
  res.json = function (body: unknown) {
    redis.setex(\`idem:\${key}\`, 86400, JSON.stringify({ status: res.statusCode, body }));
    return originalJson(body);
  };
  next();
}

// Client side: generate key once, retry with same key on failure
const idempotencyKey = uuidv4();
// POST /payments + Idempotency-Key: <key>  (safe to retry)`,
      lang: "typescript",
      note: "Stripe, PayPal, and Braintree all use idempotency keys on their payment APIs. The 24-hour TTL matches typical retry windows. Use a distributed lock (Redis SETNX) before executing the action to prevent a race where two identical requests arrive simultaneously.",
    },
    {
      title: "Consistent error shape (RFC 7807 Problem+JSON)",
      explain:
        "Every error from every endpoint should look the same so clients can handle errors generically. RFC 7807 (Problem Details for HTTP APIs) defines a JSON object with `type` (URI), `title` (human), `status` (HTTP code), `detail` (specific message), and `instance` (request URI). This is the error contract — use it from day one. Pair it with a central Express error handler that converts all thrown errors to this shape so individual handlers never write raw `res.status(500).json()` calls.",
      code: `// types
interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;  // allow extension fields
}

// Central error handler (register last in Express)
app.use((err: unknown, req: Request, res: Response, _next: Function) => {
  console.error({ err, requestId: req.headers["x-request-id"] });

  if (err instanceof z.ZodError) {
    return res.status(422).json({
      type: "https://errors.myapi.com/validation-error",
      title: "Validation failed",
      status: 422,
      errors: err.flatten().fieldErrors,
    } satisfies ProblemDetail);
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      type: err.type,
      title: err.title,
      status: err.status,
      detail: err.detail,
      instance: req.path,
    } satisfies ProblemDetail);
  }

  res.status(500).json({
    type: "https://errors.myapi.com/internal-error",
    title: "An unexpected error occurred",
    status: 500,
    instance: req.path,
  } satisfies ProblemDetail);
});`,
      lang: "typescript",
      note: "Never leak stack traces, SQL errors, or internal paths to clients — they are a goldmine for attackers doing recon. Log the full error server-side (with request ID for correlation) and return only the ProblemDetail shape to the caller.",
    },
    {
      title: "API versioning",
      explain:
        "APIs evolve; clients don't always upgrade together. Version your API so you can change behavior without breaking existing callers. Three strategies: URL path versioning (`/v1/users`) is most visible and easiest to route; header versioning (`Accept: application/vnd.api+json;version=2`) is cleaner but harder to test in browsers; query string (`?api-version=2`) is simple but pollutes URLs. URL versioning is the industry default for public APIs. For internal microservices, semantic header versioning or consumer-driven contract testing (Pact) is common.",
      code: `// URL path versioning — simplest and most common
const v1 = express.Router();
const v2 = express.Router();

v1.get("/users", listUsersV1);   // returns { users: [] }
v2.get("/users", listUsersV2);   // returns { data: [], meta: { total, cursor } }

app.use("/v1", v1);
app.use("/v2", v2);

// Middleware to enforce a sunset header on deprecated versions
v1.use((_req, res, next) => {
  res.set("Deprecation", "true");
  res.set("Sunset", "Sat, 31 Dec 2026 00:00:00 GMT");
  res.set("Link", \`</v2/users>; rel="successor-version"\`);
  next();
});`,
      lang: "typescript",
      note: "Never make a breaking change to an existing version — add a new version instead. Breaking changes include: removing a field, changing a field's type, changing status code semantics, or removing an endpoint. Adding optional fields is generally non-breaking but should still be documented.",
    },
    {
      title: "Webhooks: signing & verification",
      explain:
        "Webhooks are HTTP POST requests that a service sends to your endpoint when an event happens (a payment completes, a PR is merged). Anyone on the internet can POST to your webhook URL, so you must verify the request came from the expected sender. The standard pattern: the sender computes an HMAC-SHA256 signature over the raw body using a shared secret and puts it in a header (e.g. `Stripe-Signature`). Your endpoint recomputes the signature and rejects requests where they don't match.",
      code: `import crypto from "crypto";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;

// IMPORTANT: must use express.raw() for this route, not express.json()
// — you need the raw bytes to verify the signature
app.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const payload = req.body as Buffer;

    // Stripe sends: t=timestamp,v1=signature
    const parts = sig.split(",").reduce<Record<string, string>>((acc, p) => {
      const [k, v] = p.split("=");
      acc[k] = v;
      return acc;
    }, {});

    const expected = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(\`\${parts.t}.\${payload}\`)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(parts.v1, "hex"),
    );

    if (!isValid) return res.status(401).json({ title: "Invalid signature" });

    const event = JSON.parse(payload.toString());
    // handle event...
    res.status(200).json({ received: true });
  },
);`,
      lang: "typescript",
      note: "Always use `crypto.timingSafeEqual` for signature comparison — a naive string comparison (`===`) leaks timing information that can be exploited to forge signatures. Also check the timestamp in the signature to reject replay attacks older than a few minutes.",
    },
    {
      title: "Structured logging & request IDs",
      explain:
        "Plain text logs become useless in production — you cannot reliably parse, filter, or correlate them. Structured logging emits JSON objects with consistent fields: timestamp, level, requestId, userId, method, path, statusCode, durationMs, traceId. A request ID (UUID v4 or W3C TraceContext `traceparent` header) is generated at the edge and propagated through every log line for that request so you can filter one user's journey across thousands of log entries.",
      code: `import { randomUUID } from "crypto";
import pino from "pino";

const logger = pino({ level: "info" });

// Attach a request ID to every request
app.use((req: Request, _res: Response, next: Function) => {
  req.id = (req.headers["x-request-id"] as string) ?? randomUUID();
  next();
});

// Request logging middleware
app.use((req: Request, res: Response, next: Function) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info({
      requestId: req.id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - start,
      userId: req.user?.id,
    });
  });
  next();
});

// Usage in a handler — child logger carries the requestId automatically
app.get("/users/:id", async (req, res) => {
  const log = logger.child({ requestId: req.id });
  log.info({ userId: req.params.id }, "fetching user");
  // ...
});`,
      lang: "typescript",
      note: "In a microservices environment, propagate the request ID (or W3C `traceparent`) in outbound HTTP headers to downstream services. This lets you reconstruct the full call graph across services in your log aggregator (Datadog, Loki, CloudWatch Logs Insights).",
    },
  ],

  interviewQs: [
    {
      q: "What makes an HTTP endpoint idempotent? Which methods are and aren't?",
      a: "Idempotent means calling the endpoint N times produces the same server state as calling it once. GET, HEAD, PUT, DELETE, OPTIONS are idempotent — safe to retry on network failure. POST is not — a retry may create duplicate resources or charge a card twice. PATCH is not required to be idempotent (though many implementations are). To make POST safe to retry, require clients to send an Idempotency-Key header and cache the response server-side (Redis) so duplicate keys replay the stored result.",
    },
    {
      q: "JWT vs session-based auth — when would you choose each?",
      a: "Sessions store state server-side (Redis); the client holds only a session ID cookie. They are easy to revoke (delete from Redis) and work well for monoliths and server-rendered apps. JWTs are self-contained signed tokens validated without a database lookup — better for stateless microservices, mobile clients, and cross-domain SSO. The downside of JWTs is revocation: you cannot invalidate a token before its `exp` without maintaining a blocklist (which reintroduces state). The standard pattern combines both: a short-lived access JWT (15 min, stateless) plus a long-lived refresh token in an HttpOnly cookie that is server-side revocable.",
    },
    {
      q: "Explain the difference between 401 and 403.",
      a: "401 Unauthorized means the request lacks valid authentication credentials — the caller is not identified. 403 Forbidden means authentication succeeded (we know who they are) but that identity does not have permission to perform the action. 401 should prompt the client to re-authenticate; 403 should not — re-logging in won't help.",
    },
    {
      q: "What are the tradeoffs between offset and cursor pagination?",
      a: "Offset pagination (`LIMIT 20 OFFSET 60000`) is simple but forces a full index scan to the offset, which degrades with large offsets. It also produces drift — rows inserted between pages can cause duplicates or skips. Cursor (keyset) pagination uses a WHERE clause on an indexed column (e.g. `WHERE id > lastSeenId`) making every page fetch O(1) regardless of depth; no drift. The downside: you cannot jump to an arbitrary page number, and the cursor must be based on a column that has a stable, indexed ordering. Use offset for small datasets with admin-style UIs; cursor for feeds, logs, and anything with millions of rows.",
    },
    {
      q: "How do you design a rate limiter for an API with multiple servers?",
      a: "A per-process in-memory rate limiter (like Express rate-limit's default memory store) only counts requests that hit that instance, so in a multi-server setup each server has its own counter and the effective limit is `limit × serverCount`. The solution is a shared store — Redis — with atomic operations. The token-bucket algorithm stores the current token count and last refill timestamp per key; a Lua script atomically deducts a token and returns remaining. The sliding-window counter stores a sorted set of request timestamps in Redis and counts entries in the last N seconds. Always return `X-RateLimit-Remaining` and `Retry-After` headers so clients can back off gracefully.",
    },
    {
      q: "What is an idempotency key and when would you implement one?",
      a: "An idempotency key is a client-generated UUID sent in a request header (e.g. `Idempotency-Key`) for non-idempotent POST operations (payments, order creation, email sends). The server stores the key → response in Redis with a TTL. On duplicate submission (same key), the server replays the stored response instead of executing the action again. This makes unsafe-to-retry operations safe — the client can retry on network failure without fear of double-charging. Stripe, Braintree, and most payment APIs require this pattern.",
    },
    {
      q: "How do you secure a webhook endpoint?",
      a: "Compute an HMAC-SHA256 signature over the raw request body using a shared secret, and include it in a header. The receiver recomputes the signature and compares using `crypto.timingSafeEqual` (to prevent timing attacks). You must use the raw bytes (before JSON parsing) — call `express.raw()` for that route. Also check the timestamp embedded in the signature to reject replays older than a few minutes. Never trust the event payload without verifying the signature first — anyone on the internet can POST to your webhook URL.",
    },
    {
      q: "What is REST vs GraphQL — when would you pick each?",
      a: "REST uses multiple URLs with fixed response shapes — simple, cacheable by HTTP, and widely understood. GraphQL uses a single endpoint where clients specify exactly which fields they want, eliminating over-fetching and under-fetching. GraphQL shines when a single API serves many different clients (mobile, web, third parties) with very different data needs, or when the frontend team iterates rapidly without needing backend changes per view. REST is simpler to cache (HTTP caching, CDN), easier to version, and better-understood by operations teams. Most teams start REST and add GraphQL only when client-specific data shaping becomes a recurring problem.",
    },
    {
      q: "What does a consistent error response shape look like, and why does it matter?",
      a: "RFC 7807 (Problem Details for HTTP APIs) defines a standard JSON error object: `{ type, title, status, detail, instance }`. Consistent shape matters because clients can write one generic error handler instead of special-casing each endpoint's error format. A central Express error-handling middleware converts all thrown errors to this shape. Never leak stack traces, SQL errors, or internal paths — log them server-side and return only the human-safe fields. Include the request ID so support can correlate the client-facing error to the full server-side log entry.",
    },
    {
      q: "How do you approach API versioning?",
      a: "URL path versioning (`/v1/`, `/v2/`) is the most common approach for public APIs because it is explicit, easy to route, and testable in a browser. Never make breaking changes to an existing version — add a new version. Breaking changes include removing or renaming fields, changing field types, changing status code semantics. Adding optional response fields is generally safe. Deprecate old versions with `Deprecation: true` and `Sunset` headers giving clients a timeline to migrate. For internal microservices, consumer-driven contract testing (Pact) is often better than strict versioning.",
    },
    {
      q: "What are the key OWASP API security risks to defend against?",
      a: "The OWASP API Security Top 10 highlights: Broken Object-Level Authorization (BOLA) — always check ownership, not just authentication; Broken Authentication — use short-lived JWTs, HttpOnly cookies, and MFA; Excessive Data Exposure — return only the fields the client needs, never the full DB row; Lack of Rate Limiting — protect all public endpoints; Broken Function-Level Authorization — verify roles on every handler, not just route groups; Mass Assignment — use an explicit schema (zod) to whitelist allowed fields instead of spreading `req.body` directly into the DB. CORS should only allow trusted origins; CSRF is mitigated by SameSite cookies and checking the Origin header.",
    },
  ],

  build: [
    "Build a complete REST API for a 'Task Manager' in Express + TypeScript: CRUD on tasks, JWT auth with access + refresh tokens, zod validation on all inputs, a RFC 7807 error handler, and cursor pagination on `GET /tasks`.",
    "Add Redis-backed sliding-window rate limiting and an idempotency key store to the task API above, then write a test that proves double-posting the same idempotency key returns the cached response.",
    "Implement a webhook receiver endpoint (e.g. for a simulated payment provider): verify the HMAC-SHA256 signature, reject replays older than 5 minutes, and enqueue the valid event to a Bull/BullMQ Redis queue for background processing.",
    "Build a versioned public API (`/v1`, `/v2`) where v2 changes the response shape of `GET /users` to include cursor pagination metadata; add `Deprecation` and `Sunset` headers to v1 responses.",
  ],

  pitfalls: [
    "Returning 200 OK with `{ success: false }` in the body — HTTP clients, load balancers, and monitoring tools act on the status code, not the body. Use 4xx/5xx for errors.",
    "Storing the refresh token in localStorage instead of an HttpOnly cookie — localStorage is accessible to any JavaScript on the page, making it trivially exfiltrated via XSS. An HttpOnly cookie is invisible to scripts.",
    "Passing `req.body` directly to a database update (mass assignment) — a client can overwrite any field, including `role: 'admin'` or `passwordHash`. Always parse through an explicit zod schema that whitelists allowed fields.",
    "Using `===` instead of `crypto.timingSafeEqual` for HMAC signature comparison — naive string comparison short-circuits on the first differing byte, leaking timing information that allows a signature to be forged bit by bit.",
    "Running rate limiting in process memory with multiple server instances — each instance has its own counter, so the real limit is `perInstanceLimit × instanceCount`. Always use a shared Redis store for distributed rate limiting.",
  ],

  resources: [
    {
      label: "RFC 7807 — Problem Details for HTTP APIs",
      url: "https://www.rfc-editor.org/rfc/rfc7807",
    },
    {
      label: "OWASP API Security Top 10 (2023)",
      url: "https://owasp.org/www-project-api-security/",
    },
    {
      label: "Stripe API — idempotency keys (reference implementation)",
      url: "https://stripe.com/docs/api/idempotent_requests",
    },
    {
      label: "rate-limiter-flexible (Redis token-bucket & sliding-window)",
      url: "https://github.com/animir/node-rate-limiter-flexible",
    },
    {
      label: "Zod documentation",
      url: "https://zod.dev/",
    },
    {
      label: "BullMQ — Redis-backed job queues for Node.js",
      url: "https://docs.bullmq.io/",
    },
  ],

  checklist: [
    "Explain what idempotency means and identify which HTTP methods are and aren't idempotent",
    "Implement JWT access + refresh token auth with HttpOnly cookie storage for the refresh token",
    "Validate all incoming HTTP bodies with zod and return 422 with structured field errors on failure",
    "Build a Redis-backed sliding-window rate limiter that works correctly across multiple server instances",
    "Add idempotency key support to a POST endpoint so duplicate requests replay the cached response",
    "Implement cursor (keyset) pagination and explain when to prefer it over offset pagination",
    "Write a webhook receiver that verifies an HMAC-SHA256 signature using `timingSafeEqual` and rejects replays",
    "Return all errors in the RFC 7807 Problem Detail shape from a central Express error handler",
    "Describe at least three OWASP API Security risks and the controls that prevent them",
  ],
};
