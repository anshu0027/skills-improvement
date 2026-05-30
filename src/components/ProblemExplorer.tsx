"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Difficulty, Problem, Topic } from "@/data/types";
import { difficultyColor, difficultyOrder } from "@/lib/ui";
import { usePersistentMap } from "@/lib/usePersistentMap";
import { TopicIcon, IdeaIcon, SystemIcon, AlertIcon } from "@/components/icons";

type Filter = "All" | Difficulty;

export default function ProblemExplorer({ topic }: { topic: Topic }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [solved, toggleSolved] = usePersistentMap(`dsa-solved-${topic.slug}`);

  const counts = useMemo(
    () => ({
      All: topic.problems.length,
      Easy: topic.problems.filter((p) => p.difficulty === "Easy").length,
      Medium: topic.problems.filter((p) => p.difficulty === "Medium").length,
      Hard: topic.problems.filter((p) => p.difficulty === "Hard").length,
    }),
    [topic.problems],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return topic.problems
      .filter((p) => (filter === "All" ? true : p.difficulty === filter))
      .filter(
        (p) =>
          q === "" ||
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .sort(
        (a, b) =>
          difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] ||
          a.id.localeCompare(b.id),
      );
  }, [topic.problems, query, filter]);

  const solvedCount = topic.problems.filter((p) => solved[p.id]).length;
  const pct = topic.problems.length
    ? Math.round((solvedCount / topic.problems.length) * 100)
    : 0;

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-8 sm:px-8">
      <Link
        href="/dsa"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#777] transition-colors hover:text-[#ccc]"
      >
        ← All topics
      </Link>

      {/* Topic header */}
      <header className="mt-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#222] bg-[#161616] text-[#cfcfcf]">
            <TopicIcon slug={topic.slug} width={26} height={26} />
          </span>
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {topic.title}
            </h1>
            <p className="mt-1 text-[14px] text-[#9a9a9a]">{topic.blurb}</p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-[#1e1e1e] border-l-[3px] border-l-[#444] bg-[#0d0d0d] px-4 py-3 text-[14px] leading-relaxed text-[#bdbdbd]">
          <span className="font-semibold text-[#e0e0e0]">Where it&apos;s used in real systems: </span>
          {topic.realWorld}
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-[12px] text-[#777]">
            <span>YOUR PROGRESS</span>
            <span className="text-[#bbb]">
              {solvedCount}/{topic.problems.length} solved · {pct}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded bg-[#1e1e1e]">
            <div
              className="h-full rounded bg-[#cfcfcf] transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="sticky top-0 z-10 mt-6 -mx-5 bg-[#0a0a0a]/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems or tags…"
            className="w-full flex-1 rounded-lg border border-[#222] bg-[#111] px-3.5 py-2 text-[14px] text-[#e8e8e8] outline-none placeholder:text-[#555] focus:border-[#444]"
          />
          <div className="flex flex-wrap gap-1.5">
            {(["All", "Easy", "Medium", "Hard"] as const).map((f) => {
              const active = filter === f;
              const dot = f === "All" ? null : difficultyColor[f];
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-semibold transition-colors"
                  style={{
                    borderColor: active ? "#555" : "#222",
                    background: active ? "#1a1a1a" : "transparent",
                    color: active ? "#e6e6e6" : "#888",
                  }}
                >
                  {dot && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: dot }}
                    />
                  )}
                  {f} ({counts[f]})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Problem list */}
      <ol className="mt-4 flex flex-col gap-2.5">
        {visible.map((p, i) => (
          <ProblemRow
            key={p.id}
            problem={p}
            index={i}
            open={openId === p.id}
            solved={!!solved[p.id]}
            onToggleOpen={() => setOpenId(openId === p.id ? null : p.id)}
            onToggleSolved={() => toggleSolved(p.id)}
          />
        ))}
        {visible.length === 0 && (
          <li className="rounded-lg border border-[#1e1e1e] bg-[#111] px-4 py-8 text-center text-[14px] text-[#777]">
            No problems match your search.
          </li>
        )}
      </ol>
    </main>
  );
}

function ProblemRow({
  problem,
  index,
  open,
  solved,
  onToggleOpen,
  onToggleSolved,
}: {
  problem: Problem;
  index: number;
  open: boolean;
  solved: boolean;
  onToggleOpen: () => void;
  onToggleSolved: () => void;
}) {
  const dc = difficultyColor[problem.difficulty];
  return (
    <li
      className="overflow-hidden rounded-lg border bg-[#101010] transition-colors"
      style={{ borderColor: open ? "#3a3a3a" : "#1e1e1e" }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={onToggleSolved}
          aria-label="Mark solved"
          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 text-[11px] font-black transition-colors"
          style={{
            borderColor: solved ? "#cfcfcf" : "#444",
            background: solved ? "#cfcfcf" : "transparent",
            color: "#0a0a0a",
          }}
        >
          {solved ? "✓" : ""}
        </button>

        <button onClick={onToggleOpen} className="flex flex-1 items-center gap-3 text-left">
          <span className="w-6 flex-shrink-0 text-[13px] font-bold tabular-nums text-[#555]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`flex-1 text-[15px] font-semibold ${solved ? "text-[#666] line-through" : "text-[#eaeaea]"}`}
          >
            {problem.title}
          </span>
          <span
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#999]"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: dc }} />
            {problem.difficulty}
          </span>
          <span className="flex-shrink-0 text-lg text-[#888]" aria-hidden>
            {open ? "−" : "+"}
          </span>
        </button>
      </div>

      {open && <ProblemDetail problem={problem} />}
    </li>
  );
}

function ProblemDetail({ problem }: { problem: Problem }) {
  const [copied, setCopied] = useState(false);
  function copyCode() {
    navigator.clipboard?.writeText(problem.solution).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {},
    );
  }

  return (
    <div className="border-t border-[#1a1a1a] px-4 py-5 fade-up sm:px-5">
      <div className="mb-4 flex flex-wrap gap-1.5">
        {problem.tags.map((t) => (
          <span
            key={t}
            className="rounded bg-[#1a1a1a] px-2 py-0.5 text-[11px] font-medium text-[#9a9a9a]"
          >
            {t}
          </span>
        ))}
      </div>

      <Section label="PROBLEM">
        <p className="text-[14px] leading-relaxed text-[#cfcfcf]">{problem.statement}</p>
      </Section>

      {problem.examples.length > 0 && (
        <Section label="EXAMPLES">
          <div className="flex flex-col gap-2">
            {problem.examples.map((ex, i) => (
              <div
                key={i}
                className="rounded-md border border-[#1e1e1e] bg-[#0c0c0c] px-3 py-2 text-[13px] font-mono text-[#cdcdcd]"
              >
                <div>
                  <span className="text-[#666]">Input: </span>
                  {ex.input}
                </div>
                <div>
                  <span className="text-[#666]">Output: </span>
                  {ex.output}
                </div>
                {ex.explanation && (
                  <div className="mt-1 font-sans text-[#8f8f8f]">{ex.explanation}</div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Intuition — the extremely-simple explanation */}
      <Callout icon={<IdeaIcon />} label="SIMPLE IDEA (READ THIS FIRST)">
        {problem.intuition}
      </Callout>

      <Section label="STEP-BY-STEP APPROACH">
        <ol className="flex flex-col gap-1.5">
          {problem.approach.map((step, i) => (
            <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-[#cfcfcf]">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1c1c1c] text-[11px] font-bold text-[#bbb]">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Solution */}
      <Section label={`SOLUTION (${problem.language ?? "javascript"})`}>
        <div className="relative">
          <button
            onClick={copyCode}
            className="absolute right-2 top-2 z-10 rounded border border-[#333] bg-[#1a1a1a] px-2 py-1 text-[11px] font-semibold text-[#aaa] hover:text-[#fff]"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <pre className="overflow-x-auto rounded-lg border border-[#1e1e1e] bg-[#0c0c0c] p-4 text-[13px] leading-relaxed text-[#dcdcdc]">
            <code>{problem.solution}</code>
          </pre>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-[12px]">
          <span className="rounded bg-[#1a1a1a] px-2 py-1 text-[#999]">
            Time <span className="font-mono text-[#cdcdcd]">{problem.complexity.time}</span>
          </span>
          <span className="rounded bg-[#1a1a1a] px-2 py-1 text-[#999]">
            Space <span className="font-mono text-[#cdcdcd]">{problem.complexity.space}</span>
          </span>
        </div>
      </Section>

      {/* System design POV */}
      <Callout icon={<SystemIcon />} label="SYSTEM DESIGN · SCALABILITY · DB POV">
        {problem.systemDesign}
      </Callout>

      {problem.pitfalls && problem.pitfalls.length > 0 && (
        <div className="rounded-lg border border-[#1e1e1e] border-l-[3px] border-l-[#c47a7a] bg-[#0d0d0d] px-4 py-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold tracking-wider text-[#cfa0a0]">
            <AlertIcon /> WATCH OUT FOR
          </div>
          <ul className="flex flex-col gap-1">
            {problem.pitfalls.map((pf, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-[#bdbdbd]">
                • {pf}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="mb-2 text-[12px] font-bold tracking-wider text-[#7d7d7d]">{label}</div>
      {children}
    </div>
  );
}

function Callout({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 rounded-lg border border-[#1e1e1e] border-l-[3px] border-l-[#555] bg-[#0d0d0d] px-4 py-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold tracking-wider text-[#bcbcbc]">
        {icon} {label}
      </div>
      <p className="text-[14px] leading-relaxed text-[#d2d2d2]">{children}</p>
    </div>
  );
}
