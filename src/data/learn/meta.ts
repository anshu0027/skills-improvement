import type { ModuleMeta, Phase } from "./types";

// Lightweight registry that drives the /learn card grid and phase grouping.
// Heavy per-module content lives in src/data/learn/<slug>.ts.
export const learnModules: ModuleMeta[] = [
  // ── Foundations ──
  {
    slug: "typescript",
    title: "TypeScript",
    icon: "code",
    phase: "Foundations",
    order: 1,
    blurb: "JavaScript with a safety net — catch bugs before they ship.",
    why: "The single biggest “looks senior” upgrade over plain MERN JS. Typed APIs end-to-end are expected at product companies.",
    estTime: "2–3 weeks",
  },
  {
    slug: "python",
    title: "Python & FastAPI",
    icon: "python",
    phase: "Foundations",
    order: 2,
    blurb: "The language every AI tool speaks, plus a fast way to serve it.",
    why: "Python is the #1 in-demand AI skill. FastAPI is how you put an LLM behind a clean, typed API.",
    estTime: "2–3 weeks",
  },
  {
    slug: "nextjs",
    title: "Next.js (App Router)",
    icon: "nextjs",
    phase: "Foundations",
    order: 3,
    blurb: "React that renders on the server — faster pages, less client JS.",
    why: "The default React framework in 2026. RSC, server actions and streaming are what AI product UIs are built on.",
    estTime: "2–3 weeks",
    prereq: ["typescript"],
  },

  // ── Backend & Data ──
  {
    slug: "backend-apis",
    title: "Backend & API Engineering",
    icon: "server",
    phase: "Backend & Data",
    order: 4,
    blurb: "Design APIs that are safe, predictable and hard to break.",
    why: "Production AI features still need solid auth, validation, rate limits and idempotency. This is the backbone.",
    estTime: "3–4 weeks",
  },
  {
    slug: "databases",
    title: "Databases: SQL · NoSQL · Redis",
    icon: "database",
    phase: "Backend & Data",
    order: 5,
    blurb: "Where your data lives, and how to make it fast and correct.",
    why: "Heavily weighted in system-design rounds. Indexing, transactions and caching separate juniors from seniors.",
    estTime: "3–4 weeks",
  },
  {
    slug: "vector-dbs",
    title: "Vector Databases & Embeddings",
    icon: "vector",
    phase: "Backend & Data",
    order: 6,
    blurb: "Search by meaning, not keywords — the backbone of RAG.",
    why: "Every production RAG system runs on a vector store. Knowing embeddings + similarity search is an AI must-have.",
    estTime: "1–2 weeks",
    prereq: ["databases"],
  },

  // ── System & Cloud ──
  {
    slug: "system-design",
    title: "System Design",
    icon: "network",
    phase: "System & Cloud",
    order: 7,
    blurb: "How to build something that stays up when a million people show up.",
    why: "The round that separates ₹12L from ₹30L+. Then apply it to AI: RAG architecture, LLM gateways, cost/latency budgets.",
    estTime: "5–6 weeks",
  },
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    icon: "cloud",
    phase: "System & Cloud",
    order: 8,
    blurb: "Ship your code to the internet, reliably and repeatably.",
    why: "Cloud-native + containers are “no longer optional” in 2026. AWS, Docker and CI/CD show up on nearly every JD.",
    estTime: "3–4 weeks",
  },

  // ── AI Engineering ──
  {
    slug: "llm-fundamentals",
    title: "LLM Fundamentals & Prompting",
    icon: "chip",
    phase: "AI Engineering",
    order: 9,
    blurb: "What a language model actually is, and how to make it do real work.",
    why: "The foundation of the whole AI lane — tokens, context, structured output and tool calling.",
    estTime: "2 weeks",
  },
  {
    slug: "rag",
    title: "RAG (Retrieval-Augmented Generation)",
    icon: "search",
    phase: "AI Engineering",
    order: 10,
    blurb: "Give an LLM your private data so it answers with facts, not guesses.",
    why: "The most-asked AI architecture in interviews and the most-shipped in products. Chunking + retrieval + evaluation.",
    estTime: "2–3 weeks",
    prereq: ["llm-fundamentals", "vector-dbs"],
  },
  {
    slug: "agents",
    title: "Agents & Orchestration",
    icon: "agent",
    phase: "AI Engineering",
    order: 11,
    blurb: "LLMs that plan, use tools and loop until the job is done.",
    why: "The 2026 frontier — LangGraph cyclic agents, tool use and multi-step retrieval. High signal, high pay.",
    estTime: "2–3 weeks",
    prereq: ["rag"],
  },
  {
    slug: "mlops-eval",
    title: "MLOps, Eval & Observability",
    icon: "gauge",
    phase: "AI Engineering",
    order: 12,
    blurb: "Prove your AI works, watch it in production, and keep costs sane.",
    why: "What turns a demo into a product an MNC trusts — evals, tracing, guardrails and cost/latency control.",
    estTime: "2 weeks",
    prereq: ["rag"],
  },

  // ── Ship ──
  {
    slug: "portfolio",
    title: "Portfolio & Projects",
    icon: "layers",
    phase: "Ship",
    order: 13,
    blurb: "The 2–3 deployed projects that actually get you the callback.",
    why: "Recruiters weight a live, well-documented GitHub heavily. This is where everything above becomes an offer.",
    estTime: "ongoing",
  },
];

export const PHASES: Phase[] = [
  "Foundations",
  "Backend & Data",
  "System & Cloud",
  "AI Engineering",
  "Ship",
];

export const moduleSlugs = learnModules.map((m) => m.slug);

export function getModuleMeta(slug: string): ModuleMeta | undefined {
  return learnModules.find((m) => m.slug === slug);
}
