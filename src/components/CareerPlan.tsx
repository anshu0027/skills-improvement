"use client";

import { useMemo } from "react";
import type { ChecklistItem } from "@/data/career";
import { usePersistentMap } from "@/lib/usePersistentMap";

export default function CareerPlan({ items }: { items: ChecklistItem[] }) {
  const [done, toggle] = usePersistentMap("dsa-career-progress");

  const groups = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>();
    for (const it of items) {
      if (!map.has(it.group)) map.set(it.group, []);
      map.get(it.group)!.push(it);
    }
    return Array.from(map.entries());
  }, [items]);

  const doneCount = items.filter((i) => done[i.id]).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div>
      {/* Progress */}
      <div className="mb-5">
        <div className="mb-1.5 flex justify-between text-[12px] text-[#777]">
          <span>YOUR PROGRESS</span>
          <span className="text-[#bbb]">
            {doneCount}/{items.length} done · {pct}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded bg-[#1e1e1e]">
          <div
            className="h-full rounded bg-[#cfcfcf] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {groups.map(([group, groupItems]) => (
          <div key={group}>
            <div className="mb-2 text-[12px] font-bold tracking-wider text-[#7d7d7d]">
              {group.toUpperCase()}
            </div>
            <ul className="flex flex-col gap-2">
              {groupItems.map((it) => {
                const checked = !!done[it.id];
                return (
                  <li key={it.id}>
                    <button
                      onClick={() => toggle(it.id)}
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
                        {it.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
