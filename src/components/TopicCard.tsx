import Link from "next/link";
import type { Topic } from "@/data/types";
import { difficultyColor } from "@/lib/ui";
import { TopicIcon } from "@/components/icons";

export default function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const counts = {
    Easy: topic.problems.filter((p) => p.difficulty === "Easy").length,
    Medium: topic.problems.filter((p) => p.difficulty === "Medium").length,
    Hard: topic.problems.filter((p) => p.difficulty === "Hard").length,
  };
  const total = topic.problems.length;

  return (
    <Link
      href={`/topic/${topic.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-[#1e1e1e] bg-[#101010] p-5 transition-colors duration-200 hover:border-[#3a3a3a] hover:bg-[#141414] fade-up"
      style={{ animationDelay: `${Math.min(index * 25, 350)}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#222] bg-[#161616] text-[#9a9a9a] transition-colors group-hover:text-[#e6e6e6]">
          <TopicIcon slug={topic.slug} />
        </span>
        <span className="text-xs font-semibold tabular-nums text-[#6a6a6a]">
          {total} Qs
        </span>
      </div>

      <div>
        <h3 className="text-lg font-bold leading-tight text-[#f0f0f0]">
          {topic.title}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-[#888]">{topic.blurb}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-1 text-[11px] font-medium text-[#777]">
        {(["Easy", "Medium", "Hard"] as const).map((d) => (
          <span key={d} className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: difficultyColor[d] }}
            />
            {counts[d]} {d}
          </span>
        ))}
      </div>

      <span className="text-[12px] font-semibold text-[#666] transition-colors group-hover:text-[#e6e6e6]">
        Start solving →
      </span>
    </Link>
  );
}
