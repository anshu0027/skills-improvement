"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { DesignTrack } from "@/data/design/types";
import { usePersistentMap } from "@/lib/usePersistentMap";
import { AlertIcon, IdeaIcon, SystemIcon, UiIcon } from "@/components/icons";

export default function DesignTrackView({ track }: { track: DesignTrack }) {
  return (
    <div>
      <header className="flex items-start gap-4">
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-[#222] bg-[#161616] text-[#cfcfcf]">
          <UiIcon name={track.icon} width={28} height={28} />
        </span>
        <div>
          <div className="mb-2 text-[11px] font-semibold tracking-[0.24em] text-[#666]">
            {track.label}
          </div>
          <h1 className="text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl">
            {track.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#9a9a9a]">
            {track.blurb}
          </p>
        </div>
      </header>

      <div className="mt-5 rounded-lg border border-[#1e1e1e] border-l-[3px] border-l-[#444] bg-[#0d0d0d] px-4 py-3 text-[14px] leading-relaxed text-[#bdbdbd]">
        <span className="font-semibold text-[#e0e0e0]">Why it matters: </span>
        {track.why}
      </div>

      <Callout icon={<IdeaIcon />} label="IN SIMPLE WORDS">
        {track.simple}
      </Callout>

      <SectionLabel>INTERVIEW FRAMEWORK</SectionLabel>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {track.framework.map((item, i) => (
          <li key={item} className="rounded-xl border border-[#1e1e1e] bg-[#101010] p-4">
            <div className="mb-2 text-[12px] font-black tabular-nums text-[#555]">
              STEP {String(i + 1).padStart(2, "0")}
            </div>
            <p className="text-[13.5px] leading-relaxed text-[#cfcfcf]">{item}</p>
          </li>
        ))}
      </ol>

      <SectionLabel>CORE CONCEPTS</SectionLabel>
      <div className="flex flex-col gap-3">
        {track.concepts.map((concept, i) => (
          <article key={concept.title} className="rounded-xl border border-[#1e1e1e] bg-[#101010] p-4 sm:p-5">
            <h2 className="flex items-baseline gap-2 text-[16px] font-bold text-[#f0f0f0]">
              <span className="text-[12px] font-bold tabular-nums text-[#555]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {concept.title}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#cfcfcf]">{concept.explain}</p>
            {concept.code && (
              <pre className="mt-3 overflow-x-auto rounded-lg border border-[#1e1e1e] bg-[#0c0c0c] p-4 text-[12.5px] leading-relaxed text-[#dcdcdc]">
                <code>{concept.code}</code>
              </pre>
            )}
            {concept.note && (
              <div className="mt-3 rounded-lg border-l-[3px] border-l-[#555] bg-[#0d0d0d] px-3.5 py-2.5">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#a9a9a9]">
                  <SystemIcon /> INTERVIEW SIGNAL
                </div>
                <p className="text-[13px] leading-relaxed text-[#c4c4c4]">{concept.note}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      <SectionLabel>MNC CASE STUDIES</SectionLabel>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {track.caseStudies.map((study) => (
          <article key={study.title} className="rounded-xl border border-[#1e1e1e] bg-[#101010] p-4">
            <h2 className="text-[15px] font-bold text-[#f0f0f0]">{study.title}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#bdbdbd]">{study.scenario}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {study.focus.map((item) => (
                <span key={item} className="rounded-full border border-[#2a2a2a] bg-[#0d0d0d] px-2 py-0.5 text-[11px] font-medium text-[#888]">
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {track.realWorldExamples.length > 0 && (
        <>
          <SectionLabel>REAL-WORLD INTERVIEW PROBLEMS</SectionLabel>
          <div className="flex flex-col gap-3">
            {track.realWorldExamples.map((example, i) => (
              <article key={example.prompt} className="rounded-xl border border-[#1e1e1e] bg-[#101010] p-4 sm:p-5">
                <div className="mb-2 text-[12px] font-black tabular-nums text-[#555]">
                  PROBLEM {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="text-[15px] font-bold leading-snug text-[#f0f0f0]">{example.prompt}</h2>
                <p className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#777]">
                  {example.askedBy}
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#bdbdbd]">{example.scenario}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {example.mustCover.map((item) => (
                    <span key={item} className="rounded-full border border-[#2a2a2a] bg-[#0d0d0d] px-2 py-0.5 text-[11px] font-medium text-[#888]">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {track.interviewPhrases.length > 0 && (
        <>
          <SectionLabel>WHAT TO SAY IN INTERVIEWS</SectionLabel>
          <ul className="flex flex-col gap-2">
            {track.interviewPhrases.map((phrase) => (
              <li key={phrase} className="rounded-lg border border-[#1e1e1e] bg-[#101010] px-4 py-2.5 text-[14px] leading-relaxed text-[#cfcfcf]">
                “{phrase}”
              </li>
            ))}
          </ul>
        </>
      )}

      <SectionLabel>INTERVIEW QUESTIONS</SectionLabel>
      <InterviewList qs={track.interviewQs} />

      <SectionLabel>WHAT TO BUILD</SectionLabel>
      <ul className="flex flex-col gap-2">
        {track.build.map((item, i) => (
          <li key={item} className="flex gap-3 rounded-lg border border-[#1e1e1e] bg-[#101010] px-4 py-2.5 text-[14px] leading-relaxed text-[#cfcfcf]">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1c1c1c] text-[11px] font-bold text-[#bbb]">
              {i + 1}
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-lg border border-[#1e1e1e] border-l-[3px] border-l-[#c47a7a] bg-[#0d0d0d] px-4 py-3">
        <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold tracking-wider text-[#cfa0a0]">
          <AlertIcon /> COMMON PITFALLS
        </div>
        <ul className="flex flex-col gap-1">
          {track.pitfalls.map((pitfall) => (
            <li key={pitfall} className="text-[13px] leading-relaxed text-[#bdbdbd]">
              • {pitfall}
            </li>
          ))}
        </ul>
      </div>

      <SectionLabel>MASTERY CHECKLIST</SectionLabel>
      <Checklist slug={track.slug} items={track.checklist} />

      {track.resources.length > 0 && (
        <div className="mt-10 border-t border-[#1a1a1a] pt-5">
          <div className="mb-2 text-[12px] font-bold tracking-wider text-[#666]">RESOURCES</div>
          <div className="flex flex-col gap-1">
            {track.resources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#8a8a8a] underline-offset-2 hover:text-[#cfcfcf] hover:underline"
              >
                {resource.label} →
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InterviewList({ qs }: { qs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-2">
      {qs.map((qa, i) => {
        const isOpen = open === i;
        return (
          <div
            key={qa.q}
            className="overflow-hidden rounded-lg border bg-[#101010]"
            style={{ borderColor: isOpen ? "#3a3a3a" : "#1e1e1e" }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span className="flex-1 text-[14px] font-semibold text-[#eaeaea]">{qa.q}</span>
              <span className="flex-shrink-0 text-lg text-[#888]" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <p className="border-t border-[#1a1a1a] px-4 py-3 text-[13.5px] leading-relaxed text-[#c4c4c4] fade-up">
                {qa.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Checklist({ slug, items }: { slug: string; items: string[] }) {
  const [done, toggle] = usePersistentMap(`design-track-${slug}`);
  const ids = useMemo(() => items.map((_, i) => `${slug}-${i}`), [slug, items]);
  const doneCount = ids.filter((id) => done[id]).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div>
      <div className="mb-3">
        <div className="mb-1.5 flex justify-between text-[12px] text-[#777]">
          <span>PROGRESS</span>
          <span className="text-[#bbb]">
            {doneCount}/{items.length} · {pct}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded bg-[#1e1e1e]">
          <div className="h-full rounded bg-[#cfcfcf] transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((label, i) => {
          const id = ids[i];
          const checked = !!done[id];
          return (
            <li key={id}>
              <button
                onClick={() => toggle(id)}
                className="flex w-full items-start gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-colors"
                style={{
                  borderColor: checked ? "#2c3a33" : "#1e1e1e",
                  background: checked ? "#0d130f" : "#101010",
                }}
              >
                <span
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 text-[11px] font-black"
                  style={{
                    borderColor: checked ? "#cfcfcf" : "#444",
                    background: checked ? "#cfcfcf" : "transparent",
                    color: "#0a0a0a",
                  }}
                >
                  {checked ? "✓" : ""}
                </span>
                <span className={`text-[14px] leading-relaxed ${checked ? "text-[#666] line-through" : "text-[#cfcfcf]"}`}>
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 mt-10 text-[13px] font-semibold tracking-[0.2em] text-[#888]">
      {children}
    </h2>
  );
}

function Callout({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-6 rounded-lg border border-[#1e1e1e] bg-[#101010] px-4 py-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold tracking-wider text-[#a9a9a9]">
        {icon} {label}
      </div>
      <p className="text-[14px] leading-relaxed text-[#cfcfcf]">{children}</p>
    </div>
  );
}
