import type { Metadata } from "next";
import Link from "next/link";
import LearnCard from "@/components/LearnCard";
import { learnModules, PHASES } from "@/data/learn/meta";

export const metadata: Metadata = {
  title: "Learn the Skills · MERN → AI Full-Stack",
  description:
    "13 focused skill modules from TypeScript to RAG and Agents — each a deep dive with concepts, code, interview Q&A, and what to build.",
};

export default function LearnHome() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#777] transition-colors hover:text-[#ccc]"
      >
        ← Home
      </Link>

      <header className="mb-10 mt-4">
        <div className="mb-3 text-[12px] font-semibold tracking-[0.3em] text-[#666]">
          WHAT TO LEARN BEYOND DSA
        </div>
        <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
          Learn the Skills.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#9a9a9a]">
          {learnModules.length} focused modules that take you from MERN to{" "}
          <span className="text-[#d4d4d4]">AI Full-Stack</span>. Each one explains the idea
          simply, then goes deep — concepts with code, the system-design angle, real
          interview questions, and what to build.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {PHASES.map((phase) => {
          const items = learnModules.filter((m) => m.phase === phase);
          if (items.length === 0) return null;
          return (
            <section key={phase}>
              <div className="mb-4 text-[12px] font-semibold tracking-[0.3em] text-[#666]">
                {phase.toUpperCase()}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((m, i) => (
                  <LearnCard key={m.slug} module={m} index={i} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="mt-16 border-t border-[#1a1a1a] pt-6 text-[13px] text-[#666]">
        Pair this with daily DSA and the Career Plan · Build &gt; read.
      </footer>
    </main>
  );
}
