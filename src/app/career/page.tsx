import type { Metadata } from "next";
import Link from "next/link";
import CareerPlan from "@/components/CareerPlan";
import { UiIcon, AlertIcon } from "@/components/icons";
import { getModuleMeta } from "@/data/learn/meta";

// Maps each learning track to its deep-dive modules under /learn.
const trackModules: Record<string, string[]> = {
  "01": ["typescript", "python", "nextjs"],
  "02": ["backend-apis"],
  "03": ["databases", "vector-dbs"],
  "04": ["system-design", "cloud-devops"],
  "05": ["llm-fundamentals", "rag", "agents", "mlops-eval"],
  "06": ["portfolio"],
};
import {
  hero,
  realityCheck,
  positioning,
  roleLanes,
  relocateHubs,
  tracks,
  timeline,
  checklist,
  sources,
} from "@/data/career";

export const metadata: Metadata = {
  title: "Career Plan · MERN → AI Full-Stack → ₹30 LPA+",
  description:
    "What to learn beyond DSA and which roles to target as a 1-year MERN developer aiming for ₹30 LPA+ AI Full-Stack roles in 2026.",
};

export default function CareerPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-10 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#777] transition-colors hover:text-[#ccc]"
      >
        ← Home
      </Link>

      {/* Hero */}
      <header className="mt-4">
        <div className="mb-3 text-[12px] font-semibold tracking-[0.3em] text-[#666]">
          {hero.kicker}
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
          {hero.title}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#9a9a9a] sm:text-lg">
          {hero.intro}
        </p>
      </header>

      {/* Reality check */}
      <div className="mt-7 rounded-lg border border-[#1e1e1e] border-l-[3px] border-l-[#c47a7a] bg-[#0d0d0d] px-4 py-3.5">
        <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold tracking-wider text-[#cfa0a0]">
          <AlertIcon /> REALITY CHECK (READ THIS FIRST)
        </div>
        <p className="text-[14px] leading-relaxed text-[#bdbdbd]">{realityCheck}</p>
      </div>

      {/* Role lanes */}
      <Heading icon="target">Roles to target (₹30L+, open to relocate)</Heading>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {roleLanes.map((lane) => (
          <div
            key={lane.key}
            className="flex flex-col rounded-xl border bg-[#101010] p-4"
            style={{ borderColor: lane.primary ? "#3a3a3a" : "#1e1e1e" }}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#222] bg-[#161616] text-[#bdbdbd]">
                <UiIcon name={lane.icon} width={20} height={20} />
              </span>
              {lane.primary && (
                <span className="rounded-full border border-[#3a3a3a] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#bbb]">
                  Primary
                </span>
              )}
            </div>
            <h3 className="mt-3 text-[15px] font-bold text-[#f0f0f0]">{lane.title}</h3>
            <div className="mt-0.5 text-[13px] font-semibold text-[#9a9a9a]">{lane.comp}</div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[#8c8c8c]">{lane.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {lane.companies.map((c) => (
                <span
                  key={c}
                  className="rounded bg-[#1a1a1a] px-1.5 py-0.5 text-[10.5px] text-[#9a9a9a]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-[#888]">{relocateHubs}</p>

      {/* Positioning */}
      <Heading icon="briefcase">Lead with these advantages</Heading>
      <ul className="flex flex-col gap-2">
        {positioning.map((p, i) => (
          <li
            key={i}
            className="rounded-lg border border-[#1e1e1e] bg-[#101010] px-4 py-2.5 text-[14px] leading-relaxed text-[#cfcfcf]"
          >
            {p}
          </li>
        ))}
      </ul>

      {/* Tracks */}
      <Heading icon="book">What to learn beyond DSA</Heading>
      <div className="flex flex-col gap-3">
        {tracks.map((track) => (
          <div key={track.num} className="rounded-xl border border-[#1e1e1e] bg-[#101010] p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#222] bg-[#161616] text-[#bdbdbd]">
                <UiIcon name={track.icon} width={22} height={22} />
              </span>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[12px] font-bold tabular-nums text-[#555]">{track.num}</span>
                  <h3 className="text-[16px] font-bold text-[#f0f0f0]">{track.title}</h3>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-[#8c8c8c]">{track.why}</p>
              </div>
            </div>
            <ul className="mt-3 flex flex-col gap-1.5 pl-1">
              {track.items.map((it, i) => (
                <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[#cfcfcf]">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#666]" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            {trackModules[track.num] && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5 pl-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#666]">
                  Deep dives:
                </span>
                {trackModules[track.num].map((slug) => {
                  const m = getModuleMeta(slug);
                  return (
                    <Link
                      key={slug}
                      href={`/learn/${slug}`}
                      className="rounded border border-[#222] bg-[#161616] px-2 py-0.5 text-[12px] font-medium text-[#bbb] transition-colors hover:border-[#3a3a3a] hover:text-[#fff]"
                    >
                      {m ? m.title : slug} →
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Timeline */}
      <Heading icon="map">Suggested sequence (~28 weeks, parallelizable)</Heading>
      <div className="overflow-hidden rounded-xl border border-[#1e1e1e]">
        {timeline.map((row, i) => (
          <div
            key={row.phase}
            className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
            style={{
              background: i % 2 ? "#0d0d0d" : "#101010",
              borderTop: i ? "1px solid #1a1a1a" : "none",
            }}
          >
            <div className="w-44 flex-shrink-0">
              <div className="text-[14px] font-bold text-[#e6e6e6]">{row.phase}</div>
              <div className="text-[12px] text-[#777]">Weeks {row.weeks}</div>
            </div>
            <div className="text-[13.5px] leading-relaxed text-[#bdbdbd]">{row.focus}</div>
          </div>
        ))}
      </div>

      {/* Checklist */}
      <Heading icon="checklist">Action checklist (your progress saves automatically)</Heading>
      <CareerPlan items={checklist} />

      {/* Sources */}
      <div className="mt-12 border-t border-[#1a1a1a] pt-5">
        <div className="mb-2 text-[12px] font-bold tracking-wider text-[#666]">SOURCES (MAY 2026)</div>
        <div className="flex flex-col gap-1">
          {sources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-[#8a8a8a] underline-offset-2 hover:text-[#cfcfcf] hover:underline"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

function Heading({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h2 className="mb-3 mt-10 flex items-center gap-2 text-[13px] font-semibold tracking-[0.2em] text-[#888]">
      <span className="text-[#9a9a9a]">
        <UiIcon name={icon} width={16} height={16} />
      </span>
      {children}
    </h2>
  );
}
