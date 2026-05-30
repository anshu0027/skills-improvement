import type { Difficulty } from "@/data/types";

// The ONLY colours in the UI. Everything else is monochrome (greys + white).
// Muted so three difficulty levels stay distinguishable without looking loud.
export const difficultyColor: Record<Difficulty, string> = {
  Easy: "#6aa886",
  Medium: "#c2a24a",
  Hard: "#c47a7a",
};

export const difficultyOrder: Record<Difficulty, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
};

// Single neutral accent used for hover / active / emphasis.
export const ACCENT = "#e6e6e6";
