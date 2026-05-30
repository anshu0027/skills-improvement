// Career roadmap data: MERN → AI Full-Stack Engineer, ₹30 LPA+ (May 2026).
// Icons are referenced by key (rendered as SVG via UiIcon) — never emoji.

export interface RoleLane {
  key: string;
  title: string;
  comp: string;
  /** One-line on what the role is / what it takes. */
  summary: string;
  companies: string[];
  icon: string;
  primary?: boolean;
}

export interface Track {
  num: string;
  title: string;
  icon: string;
  /** Why this matters for the ₹30L+ AI Full-Stack goal. */
  why: string;
  items: string[];
}

export interface Phase {
  phase: string;
  weeks: string;
  focus: string;
}

export interface ChecklistItem {
  id: string;
  group: string;
  label: string;
}

export const hero = {
  kicker: "VISIONXGEN · CAREER PLAN · 2026",
  title: "MERN → AI Full-Stack → ₹30 LPA+",
  intro:
    "You already ship full-stack and integrate AI. This plan turns that into the highest-ceiling lane in 2026 — the AI Engineer — while keeping FAANG SDE-1 and high-paying-startup backend doors open with the same prep.",
};

export const realityCheck =
  "Be honest with yourself: ₹30 LPA+ at 1–2 years is top-decile, not the median. AI-focused full-stack devs earn ₹8–15L early, ₹15–28L mid, and ₹30–45L+ at senior / top-product / AI-startup level. The two real routes are (a) crack a top-tier product or AI company directly — hard, needs elite prep, or (b) land a strong ₹15–22L AI role now and hop to ₹30L+ in 12–18 months on the back of shipped AI systems. Route (b) is the more probable path. The AI lane is chosen because it has the highest ceiling and a 20–40% pay premium, and it compounds the AI-integration work you already do.";

export const positioning: string[] = [
  "“I ship production AI features end-to-end” — real LLM integration, not toy demos.",
  "Full ownership: you've built features solo across frontend, API, DB and deploy — end-to-end delivery few 1-YOE devs can show.",
  "Agency client work means you can talk trade-offs, delivery and non-technical stakeholders — exactly what 2026 hiring managers want.",
];

export const roleLanes: RoleLane[] = [
  {
    key: "ai",
    title: "AI Engineer / AI Full-Stack",
    comp: "₹25–60 LPA",
    summary:
      "A software engineer first, with depth in retrieval, prompting, agent orchestration and inference. You integrate, deploy and operate LLM systems — you don't train models.",
    companies: ["Sarvam AI", "Krutrim", "Razorpay AI", "PhonePe", "Freshworks AI", "Postman", "Hasura"],
    icon: "chip",
    primary: true,
  },
  {
    key: "faang",
    title: "FAANG-tier SDE-1",
    comp: "₹30–50 LPA total comp",
    summary: "Structured loops. Needs elite DSA + solid system design + clean fundamentals.",
    companies: ["Google", "Microsoft", "Atlassian", "Uber", "Adobe India"],
    icon: "target",
  },
  {
    key: "backend",
    title: "High-paying-startup Backend",
    comp: "₹28–45 LPA",
    summary: "Go deep on Node/Go, databases, scalability and system design. Strong comp, slightly lower DSA bar than FAANG.",
    companies: ["Razorpay", "CRED", "PhonePe", "Zerodha"],
    icon: "server",
  },
];

export const relocateHubs =
  "Relocate hubs: Bengaluru · Hyderabad · Pune · Gurgaon-NCR. Don't sleep on GCCs (Global Capability Centers) — they pay ₹25–45L for strong AI/full-stack at 1–3 YOE and hire heavily in these cities.";

export const tracks: Track[] = [
  {
    num: "00",
    title: "Interview core (keep this)",
    icon: "book",
    why: "The non-negotiable gate. Already covered by your MNC roadmap and the DSA app on this site.",
    items: [
      "DSA — use the 900-problem DSA section here, easy → hard.",
      "CS fundamentals for OAs: DBMS, OS, networks, OOP.",
      "Mock interviews + STAR behavioral stories.",
    ],
  },
  {
    num: "01",
    title: "Language & stack depth",
    icon: "code",
    why: "TypeScript is the biggest “looks senior” upgrade over plain MERN JS; Python is non-negotiable for AI.",
    items: [
      "TypeScript end-to-end: typed APIs, generics, discriminated unions.",
      "Python + FastAPI for AI backends (the #1 in-demand AI skill).",
      "Next.js App Router deeper: RSC, server actions, caching, streaming.",
    ],
  },
  {
    num: "02",
    title: "Backend & API engineering",
    icon: "server",
    why: "Production AI features still need solid, safe, observable backends.",
    items: [
      "REST design + a little GraphQL; auth (JWT/OAuth/sessions).",
      "Input validation (zod), rate limiting, idempotency.",
      "Background jobs/queues, error handling, structured logging.",
    ],
  },
  {
    num: "03",
    title: "Databases & data",
    icon: "database",
    why: "Heavily weighted in system-design rounds; vector DBs are the backbone of RAG.",
    items: [
      "PostgreSQL deeply: schema design, indexing, EXPLAIN/query plans, transactions.",
      "MongoDB depth: modeling, aggregation pipeline, indexing.",
      "Redis: caching, rate limiting, queues.",
      "Vector DBs: pgvector / Pinecone / Qdrant.",
    ],
  },
  {
    num: "04",
    title: "System design + Cloud/DevOps",
    icon: "cloud",
    why: "Separates ₹12L from ₹30L+. Then apply it to AI systems specifically.",
    items: [
      "Caching, queues (Kafka/SQS), load balancing, sharding/replication, CAP, idempotency.",
      "Apply to AI: RAG architecture, an LLM gateway, token-cost & latency budgets, semantic caching.",
      "AWS core (EC2, S3, Lambda, RDS, IAM), Docker, CI/CD (GitHub Actions), Kubernetes basics.",
    ],
  },
  {
    num: "05",
    title: "AI / LLM engineering",
    icon: "chip",
    why: "The differentiator that justifies ₹30L+ and the 20–40% pay premium.",
    items: [
      "LLM fundamentals & prompting: OpenAI + Anthropic SDKs, structured output, tool calling.",
      "RAG pipelines: embeddings, chunking, vector search, re-ranking; evaluate with the RAG Triad (Faithfulness / Answer Relevance / Context Relevance).",
      "Agents & orchestration: LangGraph (cyclic agents) and/or LlamaIndex Workflows.",
      "Evaluation & observability: LangSmith or Arize Phoenix; guardrails (PII, prompt-injection).",
      "MLOps basics: Dockerized inference, monitoring, caching, cost optimization.",
      "AI-assisted dev fluency: Cursor / Copilot as a daily multiplier.",
    ],
  },
  {
    num: "06",
    title: "Portfolio that proves it",
    icon: "layers",
    why: "This is what gets the ₹30L+ callback. Deployed > theoretical.",
    items: [
      "A RAG product over real documents, with an eval dashboard showing RAG-triad scores.",
      "An agentic workflow: a tool-using agent that does a real multi-step task.",
      "A multi-tenant SaaS with a real AI feature (auth, billing/usage limits, deploy).",
      "Each: real DB + evals + observability + a clear README and architecture diagram. Keep GitHub green.",
    ],
  },
];

export const timeline: Phase[] = [
  { phase: "1 · Foundation", weeks: "1–4", focus: "TypeScript hardening, Python + FastAPI, SQL/Postgres deep-dive, daily DSA" },
  { phase: "2 · Backend + Cloud", weeks: "5–10", focus: "API design, Redis, Docker, AWS core, CI/CD, daily DSA" },
  { phase: "3 · AI core", weeks: "8–16", focus: "LLM SDKs → RAG → agents → eval/observability (overlaps Phase 2)" },
  { phase: "4 · System design", weeks: "12–18", focus: "Classic + AI-system design; record yourself explaining" },
  { phase: "5 · Portfolio", weeks: "14–22", focus: "Ship 2–3 deployed AI full-stack projects with evals" },
  { phase: "6 · Interview sprint", weeks: "20–28", focus: "Mock loops, behavioral/STAR, resume surgery, apply aggressively" },
];

export const checklist: ChecklistItem[] = [
  { id: "c-ts", group: "Foundation", label: "Convert one real project fully to TypeScript (typed API + zod)" },
  { id: "c-py", group: "Foundation", label: "Build a FastAPI service in Python and deploy it" },
  { id: "c-sql", group: "Foundation", label: "Design a normalized Postgres schema; read 5 query plans with EXPLAIN" },
  { id: "c-redis", group: "Backend", label: "Add Redis caching + a rate limiter to an API" },
  { id: "c-docker", group: "Backend", label: "Dockerize an app and ship a GitHub Actions CI/CD pipeline" },
  { id: "c-aws", group: "Backend", label: "Deploy on AWS (S3 + Lambda or EC2 + RDS) end-to-end" },
  { id: "c-llm", group: "AI", label: "Ship an LLM feature with structured output + tool calling" },
  { id: "c-rag", group: "AI", label: "Build a RAG pipeline with a vector DB and chunking" },
  { id: "c-eval", group: "AI", label: "Add RAG-triad evals + LangSmith/Phoenix tracing" },
  { id: "c-agent", group: "AI", label: "Build a LangGraph agent that completes a multi-step task" },
  { id: "c-guard", group: "AI", label: "Add guardrails: PII redaction + prompt-injection filtering" },
  { id: "c-sysd", group: "System design", label: "Be able to design 8 systems out loud, including a RAG architecture" },
  { id: "c-proj1", group: "Portfolio", label: "Ship deployed project #1: a RAG product with eval dashboard" },
  { id: "c-proj2", group: "Portfolio", label: "Ship deployed project #2: an agentic workflow" },
  { id: "c-proj3", group: "Portfolio", label: "Ship deployed project #3: multi-tenant SaaS with an AI feature" },
  { id: "c-resume", group: "Apply", label: "Rewrite resume around shipped AI systems; quantify impact" },
  { id: "c-mock", group: "Apply", label: "Do 10+ mock interviews; write 5 STAR stories" },
  { id: "c-apply", group: "Apply", label: "Apply to 30+ roles across AI startups, unicorns, GCCs, FAANG" },
];

export const sources: { label: string; url: string }[] = [
  { label: "nasscom — in-demand developer skills 2026", url: "https://community.nasscom.in/communities/application/10-most-demand-developer-skills-you-need-2026" },
  { label: "AI Engineer Roadmap 2026 — RAG & Vector DBs", url: "https://www.mockexperts.com/blog/2026-ai-engineer-interview-roadmap-rag-llms" },
  { label: "How to Become an AI Engineer 2026 (Dataquest)", url: "https://www.dataquest.io/blog/ai-engineer-roadmap/" },
  { label: "AI Jobs in India Salary 2026", url: "https://www.buildfastwithai.com/blogs/ai-jobs-india-salary-2026" },
  { label: "SDE-1 Prep Roadmap (workat.tech)", url: "https://workat.tech/general/article/sde-1-interview-prep-ultimate-guide-dhijqvdubzor" },
];
