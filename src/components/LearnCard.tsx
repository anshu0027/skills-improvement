import Link from "next/link";
import type { ModuleMeta } from "@/data/learn/types";
import { UiIcon } from "@/components/icons";

export default function LearnCard({ module, index }: { module: ModuleMeta; index: number }) {
  return (
    <Link
      href={`/learn/${module.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-[#1e1e1e] bg-[#101010] p-5 transition-colors duration-200 hover:border-[#3a3a3a] hover:bg-[#141414] fade-up"
      style={{ animationDelay: `${Math.min(index * 25, 300)}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#222] bg-[#161616] text-[#9a9a9a] transition-colors group-hover:text-[#e6e6e6]">
          <UiIcon name={module.icon} />
        </span>
        <span className="text-[11px] font-semibold text-[#6a6a6a]">{module.estTime}</span>
      </div>

      <div>
        <h3 className="text-[16px] font-bold leading-tight text-[#f0f0f0]">{module.title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-[#888]">{module.blurb}</p>
      </div>

      <span className="mt-auto pt-1 text-[12px] font-semibold text-[#666] transition-colors group-hover:text-[#e6e6e6]">
        Open deep dive →
      </span>
    </Link>
  );
}
