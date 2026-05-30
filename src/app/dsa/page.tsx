import type { Metadata } from "next";
import Link from "next/link";
import TopicCard from "@/components/TopicCard";
import { topics } from "@/data/topics";
import { difficultyColor } from "@/lib/ui";

export const metadata: Metadata = {
  title: "DSA Practice · DSA → MNC Ready",
  description:
    "18 topics, 900 solved & explained problems from easy to hard, each with a simple explanation and a system-design point of view.",
};

export default function DsaHome() {
  const totalProblems = topics.reduce((acc, t) => acc + t.problems.length, 0);
  const count = (d: string) =>
    topics.reduce((a, t) => a + t.problems.filter((p) => p.difficulty === d).length, 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#777] transition-colors hover:text-[#ccc]"
      >
        ← Home
      </Link>

      {/* Header */}
      <header className="mb-10 mt-4">
        <div className="mb-3 text-[12px] font-semibold tracking-[0.3em] text-[#666]">
          DATA STRUCTURES & ALGORITHMS
        </div>
        <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
          Solve easy → hard. Walk in ready.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#9a9a9a]">
          Every problem is solved and explained twice — once{" "}
          <span className="text-[#d4d4d4]">in plain words a beginner gets</span>, then
          through a <span className="text-[#d4d4d4]">system-design, scalability and database</span> lens.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Stat label="Topics" value={topics.length} />
          <Stat label="Total problems" value={totalProblems} />
          <Stat label="Easy" value={count("Easy")} dot={difficultyColor.Easy} />
          <Stat label="Medium" value={count("Medium")} dot={difficultyColor.Medium} />
          <Stat label="Hard" value={count("Hard")} dot={difficultyColor.Hard} />
        </div>
      </header>

      {/* Cards */}
      <section>
        <div className="mb-5 text-[12px] font-semibold tracking-[0.3em] text-[#666]">
          CHOOSE YOUR TOPIC
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, i) => (
            <TopicCard key={topic.slug} topic={topic} index={i} />
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-[#1a1a1a] pt-6 text-[13px] text-[#666]">
        Built for the MNC Job Switch Roadmap · Solve 3 a day · No shortcuts.
      </footer>
    </main>
  );
}

function Stat({ label, value, dot }: { label: string; value: number; dot?: string }) {
  return (
    <div className="rounded-lg border border-[#1e1e1e] bg-[#101010] px-4 py-2.5">
      <div className="flex items-center gap-2">
        {dot && <span className="h-2 w-2 rounded-full" style={{ background: dot }} />}
        <span className="text-2xl font-black tabular-nums text-[#ededed]">{value}</span>
      </div>
      <div className="text-[11px] uppercase tracking-wider text-[#777]">{label}</div>
    </div>
  );
}
