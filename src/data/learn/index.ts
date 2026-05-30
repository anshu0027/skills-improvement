import type { Module, Phase } from "./types";
import { learnModules, PHASES } from "./meta";

import { learnModule as typescript } from "./typescript";
import { learnModule as python } from "./python";
import { learnModule as nextjs } from "./nextjs";
import { learnModule as backendApis } from "./backend-apis";
import { learnModule as databases } from "./databases";
import { learnModule as vectorDbs } from "./vector-dbs";
import { learnModule as systemDesign } from "./system-design";
import { learnModule as cloudDevops } from "./cloud-devops";
import { learnModule as llmFundamentals } from "./llm-fundamentals";
import { learnModule as rag } from "./rag";
import { learnModule as agents } from "./agents";
import { learnModule as mlopsEval } from "./mlops-eval";
import { learnModule as portfolio } from "./portfolio";

const bySlug: Record<string, Module> = {
  typescript,
  python,
  nextjs,
  "backend-apis": backendApis,
  databases,
  "vector-dbs": vectorDbs,
  "system-design": systemDesign,
  "cloud-devops": cloudDevops,
  "llm-fundamentals": llmFundamentals,
  rag,
  agents,
  "mlops-eval": mlopsEval,
  portfolio,
};

export const modules: Module[] = learnModules
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((m) => bySlug[m.slug])
  .filter(Boolean);

export const moduleMap: Record<string, Module> = Object.fromEntries(
  modules.map((m) => [m.slug, m]),
);

export function getModule(slug: string): Module | undefined {
  return moduleMap[slug];
}

/** Previous / next module in display order, for footer navigation. */
export function adjacentModules(slug: string): { prev?: Module; next?: Module } {
  const i = modules.findIndex((m) => m.slug === slug);
  if (i === -1) return {};
  return { prev: modules[i - 1], next: modules[i + 1] };
}

/** Modules grouped by phase, in PHASES order. */
export function modulesByPhase(): { phase: Phase; items: Module[] }[] {
  return PHASES.map((phase) => ({
    phase,
    items: modules.filter((m) => m.phase === phase),
  })).filter((g) => g.items.length > 0);
}
