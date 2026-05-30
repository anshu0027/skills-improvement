import Link from "next/link";
import type { HubSection } from "@/data/hub";
import { UiIcon } from "@/components/icons";

export default function HubCard({ section, index }: { section: HubSection; index: number }) {
  const external = section.external;
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#222] bg-[#161616] text-[#9a9a9a] transition-colors group-hover:text-[#e6e6e6]">
          <UiIcon name={section.icon} width={26} height={26} />
        </span>
        <span className="text-[11px] font-semibold tabular-nums text-[#6a6a6a]">
          {section.stat}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold leading-tight text-[#f0f0f0]">{section.title}</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-[#8c8c8c]">{section.blurb}</p>
      </div>

      <span className="mt-5 text-[13px] font-semibold text-[#666] transition-colors group-hover:text-[#e6e6e6]">
        Open {section.title} →
      </span>
    </>
  );

  const className =
    "group flex flex-col rounded-2xl border border-[#1e1e1e] bg-[#101010] p-6 transition-colors duration-200 hover:border-[#3a3a3a] hover:bg-[#141414] fade-up";
  const style = { animationDelay: `${Math.min(index * 40, 200)}ms` };

  if (external) {
    return (
      <a href={section.href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={section.href} className={className} style={style}>
      {inner}
    </Link>
  );
}
