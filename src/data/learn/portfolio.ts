import type { Module } from "@/data/learn/types";
import { getModuleMeta } from "@/data/learn/meta";

const meta = getModuleMeta("portfolio")!;

export const learnModule: Module = {
  ...meta,
  simple:
    "A portfolio is not a gallery of things you made — it is proof that you can solve real problems end-to-end. A hiring manager at a ₹30L+ company looks at your projects for three things: did it run in production for real users, did you make real technical decisions, and can you explain why. Tutorial clones and 'to-do apps' answer none of those questions. The goal of this module is to show you how to pick, build, document, and talk about projects that answer all three.",

  concepts: [
    {
      title: "What makes a project 'hiring-grade'",
      explain:
        "A hiring-grade project has at least one of: real users (even if small), real scale (non-trivial data/traffic), or a real integration (LLM, payment, OAuth, third-party API that required judgment calls). The fastest filter a senior engineer applies is: 'would a real person pay for or rely on this?' Tutorial clones — even polished ones — fail this test because every decision was pre-made by the tutorial author. To pass the filter, your project must show at least one decision you made yourself: the choice of chunking strategy, the schema design, the rate-limit algorithm, the cost-control mechanism.",
      note: "Hiring managers at product companies in 2026 routinely ask to see the live URL. If the app is down, assume it never existed. Deploy first; polish later.",
    },
    {
      title: "The three flagship AI full-stack projects to build",
      explain:
        "Build exactly these three projects in order. They form a visible arc — from 'I understand RAG' to 'I can build multi-tenant SaaS' — and each surfaces a different set of competencies. (1) A RAG product with an eval dashboard: ingest a real document corpus, embed it, store in a vector DB, expose a chat interface, and crucially, build a small dashboard that measures retrieval precision and answer faithfulness — this proves you think about quality, not just features. (2) An agentic workflow that completes a real multi-step task: e.g. an agent that reads your email, searches the web for relevant context, drafts a reply, and sends it pending your approval — this proves you can chain tools, handle failures, and design a human-in-the-loop gate. (3) A multi-tenant SaaS with a real AI feature: full auth (Clerk or Auth.js), per-tenant usage limits tracked in the database, a billing page (Stripe), and an AI feature baked in (summarisation, generation, classification) — this proves full-stack product thinking.",
      note: "Each project maps to a concrete interview talking point. Project 1 answers 'how do you measure AI quality?' Project 2 answers 'have you built agentic systems?' Project 3 answers 'can you ship a product people pay for?'",
    },
    {
      title: "Designing a clean architecture and drawing the diagram",
      explain:
        "Before you write a line of code, draw the system: boxes for services (Next.js app, Postgres, vector DB, LLM provider, queue, blob store), arrows for data flow, and a note on each arrow with the protocol and what data moves. This diagram becomes the centrepiece of your README and your interview answer. Clean architecture for an AI full-stack project in 2026 means: Next.js (App Router) for the frontend and API routes, Postgres (via Prisma or Drizzle) for relational data, a vector DB (Pinecone / pgvector / Qdrant) for embeddings, Redis for queues and rate-limit counters, and an LLM provider (OpenAI / Anthropic) behind an abstraction layer you can swap. Keep the AI logic in a dedicated service layer — not scattered across route handlers — so it is independently testable.",
      code: `// Example: layered folder structure for a RAG SaaS
// app/
//   (dashboard)/          ← protected routes
//   api/
//     chat/route.ts       ← thin: parse req, call service, return stream
//     ingest/route.ts
// services/
//   rag.ts                ← RAG pipeline: embed → retrieve → augment → generate
//   eval.ts               ← faithfulness + retrieval precision scoring
//   usage.ts              ← per-tenant token accounting
// lib/
//   db.ts                 ← Prisma/Drizzle client singleton
//   vector.ts             ← pgvector / Pinecone abstraction
//   llm.ts                ← OpenAI / Anthropic wrapper (swappable)
// middleware.ts           ← auth guard + tenant header injection`,
      lang: "typescript",
      note: "A clean folder structure signals seniority faster than almost anything else. If an interviewer clones your repo, the top-level layout should explain what the system does in 30 seconds.",
    },
    {
      title: "Writing a README that a non-technical manager can follow",
      explain:
        "Your README is a product pitch, not a setup guide. The first 10 lines must answer: what does this do, who is it for, and what is the live URL. The rest answers: how does it work (architecture diagram), what were the hard parts, how do I run it locally. Use a consistent structure so every project README looks professional and is scannable in under two minutes.",
      code: `# ProjectName — one-line description

> Live: https://yourapp.vercel.app | Demo video: https://...

## What it does
One paragraph. Use it as your elevator pitch.

## Architecture
[Insert diagram image or ASCII diagram here]

## Tech stack
| Layer        | Technology                      |
|--------------|---------------------------------|
| Frontend     | Next.js 15, Tailwind, shadcn/ui |
| API          | Next.js Route Handlers, zod     |
| Database     | Postgres + pgvector (Neon)      |
| AI           | OpenAI GPT-4o, text-embedding-3 |
| Auth         | Clerk                           |
| Deploymen    | Vercel (frontend), Railway (bg) |

## Hard problems solved
- [Challenge 1]: [what you did and why]
- [Challenge 2]: [what you did and why]

## Running locally
\`\`\`bash
cp .env.example .env   # fill in keys
pnpm install
pnpm db:push
pnpm dev
\`\`\``,
      lang: "markdown",
      note: "The 'Hard problems solved' section is the most important part of the README for a technical hiring manager. It is the written version of 'walk me through a challenge'. Write it as if answering that question.",
    },
    {
      title: "Deployment so it is live",
      explain:
        "A project that only runs locally is a liability in an interview, not an asset. Deploy every project before you claim it on your resume. The 2026 stack for zero-to-live in under an hour: Vercel for the Next.js app (free tier, automatic preview deployments per PR), Railway or Fly.io for any long-running background service or separate API, Neon for serverless Postgres, Upstash for serverless Redis, and Cloudflare R2 for blob storage. Use environment variables for all secrets; commit a `.env.example` with keys but no values. Set up a GitHub Action that runs lint + type-check + tests on every push — a green badge in the README signals professionalism.",
      note: "Broken deployments are a silent disqualifier. Set up an uptime monitor (Better Uptime free tier or Cronitor) so you know before the interviewer does. Nothing kills confidence in an interview like opening your laptop and getting a 503.",
    },
    {
      title: "Adding evals and observability to show rigor",
      explain:
        "LLM outputs are non-deterministic. Saying 'it works' is not enough — you need numbers. For a RAG project, track at minimum: retrieval precision (did the right chunks come back?), answer faithfulness (did the answer come from the chunks?), and latency percentiles. Use LangSmith, Langfuse, or a custom Postgres table. For a production API, add structured logging (Pino), error tracking (Sentry), and request tracing (OpenTelemetry). These tools are what differentiate a side project from a real system and give you concrete data to quote in interviews.",
      code: `// Minimal eval logging in a RAG route
import { db } from "@/lib/db";

export async function logEval(params: {
  queryId: string;
  retrievedChunkIds: string[];
  relevantChunkIds: string[];   // from human labels or LLM judge
  answer: string;
  faithfulnessScore: number;    // 0–1 from LLM-as-judge
  latencyMs: number;
}) {
  await db.ragEval.create({ data: params });
}`,
      lang: "typescript",
      note: "In an interview you can say 'our retrieval precision was 78% on the test set; I improved it to 91% by switching from a cosine-similarity top-k to a hybrid BM25 + dense retrieval with re-ranking.' That sentence wins rounds.",
    },
    {
      title: "GitHub hygiene: commits, CI, and documentation",
      explain:
        "A GitHub profile is a portfolio of work habits, not just code. Hiring engineers look at commit history, PR quality, and CI status. Good hygiene means: conventional commits (`feat:`, `fix:`, `chore:`) so the log is readable; a green CI badge (GitHub Actions running lint, type-check, and unit tests); a `.github/CONTRIBUTING.md` explaining how to contribute; branch protection on `main` requiring CI to pass; and at least one meaningful PR in the project's history (not just direct commits to main). These signals say you have worked on a real team.",
      note: "One 'feat: add hybrid retrieval with BM25 + pgvector re-ranking' commit is worth more than 50 'update files' commits. Commit messages are read by interviewers.",
    },
    {
      title: "Writing a project case study / blog post",
      explain:
        "Writing a 500–1000 word technical blog post about each project does four things: forces you to articulate decisions (essential interview prep), creates searchable content that gets you discovered, signals communication skills (underrated at ₹30L+ level), and gives you a direct link to share instead of a GitHub repo dump. Publish on dev.to, Hashnode, or your own Next.js blog. Structure: problem, approach, key decisions (with tradeoffs), results, lessons. This content feeds directly into your resume bullets and interview answers.",
      note: "A blog post about 'how I improved RAG retrieval precision from 78% to 91%' gets read and shared in engineering circles. That is organic inbound recruiting.",
    },
    {
      title: "Turning projects into quantified resume bullets",
      explain:
        "Every resume bullet must follow the formula: Action + Technology + Impact. Impact can be a number (latency, cost, precision, users, revenue) or a scale (50k documents, 1000 daily active users, sub-200ms P99). If you do not have real numbers yet, instrument your app and collect them. Generic bullets like 'built a RAG application' are filtered out; 'reduced document Q&A latency from 4.2s to 680ms by switching from synchronous chunk retrieval to parallel fan-out with pgvector HNSW indexes' is not.",
      code: `// Resume bullet templates (fill in your real numbers)
// "Built a RAG product serving [N] users, achieving [X]% retrieval precision
//  on a [N]-document corpus; added an eval dashboard tracking faithfulness
//  and latency, cutting hallucination rate from [X]% to [Y]%."

// "Designed an agentic email assistant (LangGraph + GPT-4o) that automates
//  [N]-step research workflows; reduced manual research time by ~[X] hours/week
//  across [N] beta users."

// "Shipped a multi-tenant SaaS (Next.js, Postgres, Stripe, Clerk) with per-tenant
//  usage limits; onboarded [N] paying customers at launch, handling [N] AI requests/day
//  within a $[X]/month LLM budget."`,
      lang: "typescript",
      note: "Quantified bullets get past ATS filters and give the interviewer an anchor for the conversation. If your answer to 'how big was the dataset?' is 'I'm not sure', that is a red flag. Know your numbers.",
    },
    {
      title: "Open-source contribution",
      explain:
        "You do not need a merged PR in a top-50 GitHub project. One genuine contribution to a tool you actually use — a bug fix, a documentation improvement, a test, or a type definition — demonstrates that you can navigate an unfamiliar codebase, follow contribution guidelines, and communicate asynchronously with maintainers. Pick a tool from your stack (Langfuse, LangChain, Prisma, shadcn/ui) and find a 'good first issue'. The PR URL on your resume is a signal of initiative.",
      note: "An open-source contribution also proves you can write code you are not fully in control of — a skill that matters enormously in a team setting and is hard to fake.",
    },
    {
      title: "The STAR framework for behavioral interview answers",
      explain:
        "Every 'tell me about a time when...' question at a ₹30L+ interview expects a STAR answer: Situation (context, 1–2 sentences), Task (what you were responsible for), Action (what YOU specifically did — not the team), Result (measurable outcome). Pre-write STAR answers for: biggest technical challenge, a time you disagreed with a decision, a project you are proudest of, a time you failed. These are not just for HR; principal engineers use the same questions to assess judgment and ownership.",
      note: "The most common STAR failure is drowning in Situation and never getting to Action and Result. Spend 20% on S+T, 60% on A, 20% on R.",
    },
    {
      title: "Handling the 'how would you scale it' question",
      explain:
        "Every project interview ends here. Have a prepared answer for each project: identify the current bottleneck (single Postgres instance, synchronous LLM calls, in-memory rate limiter), state what breaks first at 10x traffic, and describe the first two architectural moves (read replica, async job queue, Redis caching, horizontal pod autoscaling). You do not need to have built the scaled version — you need to show you have thought about it. Bonus: mention what you would instrument to know when to trigger each change.",
      note: "The scale question is a proxy for 'have you thought beyond the happy path?' A senior engineer who hears a confident, measured answer about trade-offs is far more impressed than by a fully-featured app that the candidate cannot reason about at scale.",
    },
  ],

  interviewQs: [
    {
      q: "Walk me through your most technically complex project.",
      a: "Use STAR structure. Open with the business problem in one sentence: 'I built a RAG-based document Q&A tool for legal teams who needed to query 50,000+ contracts without hallucination.' Then describe the architecture: Next.js frontend, Postgres + pgvector for embeddings, OpenAI for generation, and a Langfuse-backed eval dashboard. Highlight the hardest decision: 'The main challenge was retrieval precision — naive cosine top-k returned irrelevant chunks for negation queries. I switched to hybrid BM25 + dense retrieval with a cross-encoder re-ranker, which brought precision from 71% to 93% on my eval set.' Close with impact: 'The app has 200 weekly active users; average query latency is 820ms P99.'",
    },
    {
      q: "What was your biggest technical challenge and how did you solve it?",
      a: "Pick a real, specific challenge — not 'it was hard to learn React'. The best answers name a failure first: 'I shipped the initial RAG pipeline and the eval numbers were terrible — 58% faithfulness. I spent two days on evals before touching the code, which taught me the bottleneck was in retrieval, not generation. I instrumented the retrieval step, found that 40% of queries returned zero relevant chunks, and realised my chunking strategy was breaking mid-sentence. Switching to semantic chunking (sentence-boundary splitting with overlap) fixed it.' The structure: I tried X, it failed because Y, I diagnosed using Z, I fixed it by W, result was V.",
    },
    {
      q: "Why did you choose that specific tech stack?",
      a: "Have a one-sentence rationale for every non-obvious choice. 'I chose pgvector over Pinecone because my data is relational and I wanted a single Postgres instance for simplicity at this scale — Pinecone makes sense when you need billion-scale vectors or want managed infrastructure. I chose Langfuse over LangSmith because it is open-source and I could self-host it alongside my Railway Postgres, keeping tracing data in my own infrastructure.' The interviewer is testing whether you made a deliberate choice or just copied a tutorial.",
    },
    {
      q: "How did you ensure quality in your AI application?",
      a: "Describe your eval pipeline: 'I built a test set of 50 representative queries with human-labeled relevant chunks and ideal answers. For each deployment I run an automated eval that measures retrieval precision (did the right chunks come back?), faithfulness (does the answer contradict the retrieved context?), and latency. I track these in a Postgres table and visualise them in a small dashboard. If faithfulness drops below 85%, a GitHub Action comments on the PR with the degradation before it merges.' If you do not have this yet, describe what you would build — the thinking still shows rigor.",
    },
    {
      q: "How would you scale this project to 100x the current load?",
      a: "For a RAG app: 'Right now the bottleneck is the synchronous OpenAI call — at 10x load that becomes the queue. First move: push generation to a background job queue (BullMQ on Redis + Railway worker), stream results back via Server-Sent Events. Second move: add a read replica for the vector search since embeddings are read-heavy. Third move: cache frequent queries in Redis with a 5-minute TTL — in my eval set, ~30% of queries are near-identical. Fourth: add horizontal scaling on the Next.js edge runtime, which is already stateless. I would instrument P95 latency per stage before committing to any of these to confirm where the actual bottleneck is.'",
    },
    {
      q: "What would you do differently if you started this project again?",
      a: "Show self-awareness and architectural thinking. 'I would write the eval suite before the first feature, not after. I spent three weeks building a RAG pipeline that I only discovered had 58% faithfulness when I added evals at week four. An eval-first approach — write 20 representative test cases before any code — would have shaped every architectural decision. I would also extract the LLM provider behind an interface from day one; I ended up switching from GPT-3.5 to GPT-4o mid-project and had provider-specific code in four files instead of one.'",
    },
    {
      q: "Tell me about a time you disagreed with a technical decision and what happened.",
      a: "Use STAR. 'In a group project, my teammate wanted to use a single prompt for extraction and summarisation. I thought this violated separation of concerns and would make evals harder. I proposed splitting them into two chained prompts with a structured intermediate output validated by zod. My teammate was concerned about latency. I ran a quick benchmark — the two-prompt approach added 340ms but the eval scores were 22 points higher. We went with the split approach and I wrote the justification in the README. The key was bringing data to the disagreement, not just opinion.'",
    },
    {
      q: "How did you handle authentication and multi-tenancy in your SaaS project?",
      a: "Describe the full auth + data isolation flow: 'I used Clerk for authentication — it handles OAuth, email, and JWT out of the box. For multi-tenancy, every database row has a `tenantId` foreign key; I inject the tenant ID from the Clerk session in middleware and enforce it at the Prisma query level — no route handler can forget to scope its query because the service layer always requires a `tenantId` parameter. Usage limits are tracked in a `usage` table (tokens consumed this billing period per tenant) and checked in a middleware layer before every LLM call. Stripe webhooks update the `subscription` table; the middleware reads plan limits from there.'",
    },
    {
      q: "How do you keep LLM costs under control in production?",
      a: "Four levers: model selection (use GPT-4o-mini for classification and triage, GPT-4o only for final generation — typically 10x cost difference), caching (cache embedding vectors and frequently-asked queries in Redis), prompt compression (remove filler, use structured formats, reduce context window), and per-tenant usage limits enforced in the application layer. 'In my SaaS project I added a token budget per tenant per month; when 80% is consumed the app shows a warning and degrades gracefully to a cheaper model rather than rejecting requests. This cost-awareness is something I log and display in the tenant dashboard.'",
    },
    {
      q: "What open-source contribution have you made and what did you learn?",
      a: "Even a small contribution is worth mentioning if you can speak to what you learned from it. 'I contributed a fix to Langfuse's TypeScript SDK — the `update` method was not propagating the `version` field to the trace. I found it by reading their source after a bug in my own app, opened an issue, confirmed it was a bug, wrote a fix with a test, and it was merged in two days. What I learned was how to navigate a production TypeScript monorepo quickly — the codebase was much larger than anything I had built, and reading the tests first to understand intent before touching the source was the most efficient approach.'",
    },
    {
      q: "Where do you see this project going in six months?",
      a: "Show product thinking, not just engineering. 'I would add collaborative document spaces (multi-user tenants sharing a corpus), a fine-tuning pipeline where confirmed-correct answers feed back into improving retrieval, and a public API so teams can integrate it into their own tools. On the business side I would move from usage-based pricing to seat-based pricing for enterprise — I have already had two inbound requests from companies wanting this. The next technical investment is switching from polling-based eval runs to real-time streaming evals so feedback is sub-second.' This kind of answer signals product ownership, not just task execution.",
    },
  ],

  build: [
    "RAG product with eval dashboard: ingest a real PDF or web corpus (min 500 pages), build a chat interface with streaming responses, and add an eval dashboard (retrieval precision, answer faithfulness, latency P50/P95) backed by a Postgres eval table and visualised with a small Recharts chart. Deploy on Vercel + Neon. Write a blog post documenting your chunking strategy decision.",
    "Agentic multi-step workflow: build an agent (LangGraph or a custom tool-calling loop with the Anthropic or OpenAI API) that completes a real task with at least 3 tool calls — e.g. search the web, read a URL, draft a structured output, and send it (email, Slack, Notion). Add a human-in-the-loop approval step and an audit log of every tool call. The key constraint: it must do something a real person would actually use.",
    "Multi-tenant AI SaaS: full Clerk auth, per-tenant Postgres data isolation, a real AI feature (document summarisation, image captioning, or code review), per-tenant usage limits tracked in the database, a Stripe billing page (even on test mode), and a usage dashboard. Deploy on Vercel. This is your anchor project — make it the best-documented codebase you own.",
    "Open-source contribution: find a 'good first issue' in a tool you actually use (Langfuse, Prisma, LangChain, shadcn/ui, or similar). Fix it, write a test, open a PR, and respond to review comments. The goal is one merged PR you can point to. If you cannot find a code issue, improve the documentation in a way that required you to read the source and understand it.",
  ],

  pitfalls: [
    "Showing a tutorial clone and calling it a portfolio project. 'I built a Netflix clone' tells the interviewer nothing about your judgment — every decision was pre-made. The minimum bar is one non-trivial decision you made yourself, documented in the README.",
    "Deploying once and forgetting. Deployment breaks silently — environment variables expire, free tiers spin down, API keys hit rate limits. Check your live URLs the day before every interview. A broken demo in an interview is worse than no demo.",
    "Skipping evals on AI projects. Saying 'it works' about an LLM application without data is a red flag to any senior AI engineer. Add at minimum a 20-query eval set and one faithfulness metric before you put the project on your resume.",
    "Burying the hard parts in code. The README, the blog post, and your interview answer should surface the non-obvious decisions immediately. If the hardest thing you did is hidden in a utility file and you never mention it, it does not exist from the interviewer's perspective.",
    "Generic resume bullets. 'Developed a full-stack application using React and Node.js' could describe a to-do app. Every bullet must have a number, a scale, or a named outcome. Rewrite every bullet before applying.",
  ],

  resources: [
    { label: "Langfuse — open-source LLM observability", url: "https://langfuse.com/docs" },
    { label: "LangGraph — building agentic workflows", url: "https://langchain-ai.github.io/langgraph/" },
    { label: "pgvector — Postgres vector extension", url: "https://github.com/pgvector/pgvector" },
    { label: "RAGAS — RAG evaluation framework", url: "https://docs.ragas.io/en/stable/" },
    { label: "Stripe Docs — subscriptions and usage billing", url: "https://docs.stripe.com/billing/subscriptions/usage-based" },
    { label: "Conventional Commits specification", url: "https://www.conventionalcommits.org/en/v1.0.0/" },
  ],

  checklist: [
    "At least one project is live at a public URL and loads in under 3 seconds",
    "Each project README has: live URL, architecture diagram, tech stack table, and a 'hard problems solved' section",
    "RAG project has a working eval dashboard with retrieval precision and faithfulness metrics",
    "Multi-tenant SaaS has Clerk auth, per-tenant data isolation, usage limits, and a Stripe billing page",
    "Every resume project bullet follows Action + Technology + Impact with a real number or scale",
    "GitHub repos have conventional commits, a green CI badge, and a .env.example",
    "At least one open-source PR is merged or publicly open",
    "A STAR answer is pre-written and rehearsed for each of the three flagship projects",
    "A 'how would you scale it' answer exists for each project with at least two concrete architectural moves",
  ],
};
