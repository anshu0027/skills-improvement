// ─────────────────────────────────────────────────────────────────────────────
// Data model for the "Learn the Skills" modules (/learn).
// Each module is a deep, content-rich page that explains a skill simply, then
// goes deep — concepts (with code + a system-design/real-world note), real
// interview Q&A, things to build, pitfalls, resources, and a mastery checklist.
// ─────────────────────────────────────────────────────────────────────────────

export type Phase =
  | "Foundations"
  | "Backend & Data"
  | "System & Cloud"
  | "AI Engineering"
  | "Ship";

export interface Concept {
  /** Short concept title, e.g. "Discriminated unions". */
  title: string;
  /** Explain it simply first, then in depth. Plain English, no filler. */
  explain: string;
  /** Optional illustrative code. */
  code?: string;
  /** Language of `code` (default "typescript"). */
  lang?: string;
  /** The system-design / scalability / real-world angle — why it matters in production. */
  note?: string;
}

export interface QA {
  q: string;
  a: string;
}

export interface ModuleMeta {
  slug: string;
  title: string;
  /** Icon key from components/icons.tsx UiIcon. */
  icon: string;
  phase: Phase;
  /** Display order across the whole /learn grid. */
  order: number;
  /** One-line, beginner-friendly description. */
  blurb: string;
  /** Why this matters for the ₹30L+ AI Full-Stack / MNC goal. */
  why: string;
  /** Rough time to get interview-ready, e.g. "2–3 weeks". */
  estTime: string;
  /** Optional prerequisite module slugs. */
  prereq?: string[];
}

export interface Module extends ModuleMeta {
  /** The whole idea in plain words for a beginner. */
  simple: string;
  /** 8–14 concepts, each simple + deep, with code and a real-world note where useful. */
  concepts: Concept[];
  /** 8–12 real interview questions with crisp, correct answers. */
  interviewQs: QA[];
  /** 2–4 hands-on mini-projects ("Build X"). */
  build: string[];
  /** Common mistakes / gotchas. */
  pitfalls?: string[];
  /** Real, current resources — mostly official docs / well-known courses. */
  resources: { label: string; url: string }[];
  /** Mastery checklist — drives localStorage progress. */
  checklist: string[];
}
