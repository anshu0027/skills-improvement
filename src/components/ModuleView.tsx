"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Module } from "@/data/learn/types";
import { usePersistentMap } from "@/lib/usePersistentMap";
import { UiIcon, IdeaIcon, SystemIcon, AlertIcon } from "@/components/icons";

export default function ModuleView({ mod }: { mod: Module }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-[#222] bg-[#161616] text-[#cfcfcf]">
          <UiIcon name={mod.icon} width={28} height={28} />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="rounded-full border border-[#2a2a2a] px-2 py-0.5 uppercase tracking-wider text-[#9a9a9a]">
              {mod.phase}
            </span>
            <span className="text-[#666]">{mod.estTime}</span>
          </div>
          <h1 className="mt-1.5 text-3xl font-black tracking-tight sm:text-4xl">{mod.title}</h1>
          <p className="mt-1 text-[14px] text-[#9a9a9a]">{mod.blurb}</p>
        </div>
      </div>

      {/* Why it matters */}
      <div className="mt-5 rounded-lg border border-[#1e1e1e] border-l-[3px] border-l-[#444] bg-[#0d0d0d] px-4 py-3 text-[14px] leading-relaxed text-[#bdbdbd]">
        <span className="font-semibold text-[#e0e0e0]">Why it matters: </span>
        {mod.why}
      </div>

      {/* Prereqs */}
      {mod.prereq && mod.prereq.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-[#777]">
          <span>Best after:</span>
          {mod.prereq.map((slug) => (
            <Link
              key={slug}
              href={`/learn/${slug}`}
              className="rounded bg-[#1a1a1a] px-2 py-0.5 font-medium text-[#bbb] hover:text-[#fff]"
            >
              {slug}
            </Link>
          ))}
        </div>
      )}

      {/* In simple words */}
      <Callout icon={<IdeaIcon />} label="IN SIMPLE WORDS">
        {mod.simple}
      </Callout>

      {/* Concepts */}
      <SectionLabel>CONCEPTS</SectionLabel>
      <div className="flex flex-col gap-3">
        {mod.concepts.map((c, i) => (
          <div key={i} className="rounded-xl border border-[#1e1e1e] bg-[#101010] p-4 sm:p-5">
            <h3 className="flex items-baseline gap-2 text-[16px] font-bold text-[#f0f0f0]">
              <span className="text-[12px] font-bold tabular-nums text-[#555]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {c.title}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#cfcfcf]">{c.explain}</p>
            {c.code && (
              <pre className="mt-3 overflow-x-auto rounded-lg border border-[#1e1e1e] bg-[#0c0c0c] p-4 text-[12.5px] leading-relaxed text-[#dcdcdc]">
                <code>{c.code}</code>
              </pre>
            )}
            {c.note && (
              <div className="mt-3 rounded-lg border-l-[3px] border-l-[#555] bg-[#0d0d0d] px-3.5 py-2.5">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#a9a9a9]">
                  <SystemIcon /> IN PRODUCTION
                </div>
                <p className="text-[13px] leading-relaxed text-[#c4c4c4]">{c.note}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interview Q&A */}
      {mod.interviewQs.length > 0 && (
        <>
          <SectionLabel>INTERVIEW QUESTIONS</SectionLabel>
          <InterviewList qs={mod.interviewQs} />
        </>
      )}

      {/* What to build */}
      {mod.build.length > 0 && (
        <>
          <SectionLabel>WHAT TO BUILD</SectionLabel>
          <ul className="flex flex-col gap-2">
            {mod.build.map((b, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-lg border border-[#1e1e1e] bg-[#101010] px-4 py-2.5 text-[14px] leading-relaxed text-[#cfcfcf]"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1c1c1c] text-[11px] font-bold text-[#bbb]">
                  {i + 1}
                </span>
                {b}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Pitfalls */}
      {mod.pitfalls && mod.pitfalls.length > 0 && (
        <div className="mt-6 rounded-lg border border-[#1e1e1e] border-l-[3px] border-l-[#c47a7a] bg-[#0d0d0d] px-4 py-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold tracking-wider text-[#cfa0a0]">
            <AlertIcon /> COMMON PITFALLS
          </div>
          <ul className="flex flex-col gap-1">
            {mod.pitfalls.map((p, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-[#bdbdbd]">
                • {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Checklist */}
      <SectionLabel>MASTERY CHECKLIST</SectionLabel>
      <Checklist slug={mod.slug} items={mod.checklist} />

      {/* Resources */}
      {mod.resources.length > 0 && (
        <div className="mt-10 border-t border-[#1a1a1a] pt-5">
          <div className="mb-2 text-[12px] font-bold tracking-wider text-[#666]">RESOURCES</div>
          <div className="flex flex-col gap-1">
            {mod.resources.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#8a8a8a] underline-offset-2 hover:text-[#cfcfcf] hover:underline"
              >
                {r.label} →
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InterviewList({ qs }: { qs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-2">
      {qs.map((qa, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
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
  const [done, toggle] = usePersistentMap(`dsa-learn-${slug}`);
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
          <div
            className="h-full rounded bg-[#cfcfcf] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
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
                <span
                  className={`text-[14px] leading-relaxed ${checked ? "text-[#666] line-through" : "text-[#cfcfcf]"}`}
                >
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

function SectionLabel({ children }: { children: React.ReactNode }) {
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
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 rounded-lg border border-[#1e1e1e] border-l-[3px] border-l-[#555] bg-[#0d0d0d] px-4 py-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold tracking-wider text-[#bcbcbc]">
        {icon} {label}
      </div>
      <p className="text-[14px] leading-relaxed text-[#d2d2d2]">{children}</p>
    </div>
  );
}
