// ─────────────────────────────────────────────────────────────────────────────
// Core data model for the DSA learning platform.
// Every problem is fully solved AND explained two ways:
//   1) `intuition` — explained extremely simply (like to a 10-year-old)
//   2) `systemDesign` — the same idea seen through a system-design / scalability /
//      database-design lens (why an MNC actually cares about it).
// ─────────────────────────────────────────────────────────────────────────────

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Example {
  input: string;
  output: string;
  /** Optional short note explaining why this output is correct. */
  explanation?: string;
}

export interface Problem {
  /** Stable unique id, e.g. "arrays-07". Used for anchors + keys. */
  id: string;
  /** Human title, e.g. "Two Sum". */
  title: string;
  difficulty: Difficulty;
  /** Short tags / patterns, e.g. ["Hashing", "Array"]. */
  tags: string[];
  /** Plain-English problem statement. */
  statement: string;
  /** 1–3 worked examples. */
  examples: Example[];
  /** The "aha" idea explained extremely simply. No jargon. */
  intuition: string;
  /** Numbered, plain steps describing how the solution works. */
  approach: string[];
  /** Complete, runnable solution code. */
  solution: string;
  /** Language of the solution code (default "javascript"). */
  language?: string;
  /** Big-O. */
  complexity: { time: string; space: string };
  /**
   * The system-design / scalability / DB-design point of view:
   * where this pattern shows up in real backends, how it scales, what it
   * means for database / caching / sharding decisions.
   */
  systemDesign: string;
  /** Common mistakes + edge cases to remember. */
  pitfalls?: string[];
}

export interface TopicMeta {
  slug: string;
  title: string;
  /** One-line, beginner-friendly description of what this structure is. */
  blurb: string;
  /** Where it is used in real-world systems (system-design hook). */
  realWorld: string;
  /** Display order on the home page. */
  order: number;
}

export interface Topic extends TopicMeta {
  problems: Problem[];
}
