import type { Problem, Topic } from "@/data/types";
import { topicsMeta } from "@/data/meta";

// Each topic's 50 problems live in its own file (one export `problems`).
import { problems as arrays } from "./arrays";
import { problems as strings } from "./strings";
import { problems as twoPointers } from "./two-pointers";
import { problems as slidingWindow } from "./sliding-window";
import { problems as stack } from "./stack";
import { problems as queue } from "./queue";
import { problems as linkedList } from "./linked-list";
import { problems as binarySearch } from "./binary-search";
import { problems as recursionBacktracking } from "./recursion-backtracking";
import { problems as trees } from "./trees";
import { problems as bst } from "./bst";
import { problems as heap } from "./heap";
import { problems as graphs } from "./graphs";
import { problems as tries } from "./tries";
import { problems as dynamicProgramming } from "./dynamic-programming";
import { problems as greedy } from "./greedy";
import { problems as bitManipulation } from "./bit-manipulation";
import { problems as intervals } from "./intervals";

const problemsBySlug: Record<string, Problem[]> = {
  arrays,
  strings,
  "two-pointers": twoPointers,
  "sliding-window": slidingWindow,
  stack,
  queue,
  "linked-list": linkedList,
  "binary-search": binarySearch,
  "recursion-backtracking": recursionBacktracking,
  trees,
  bst,
  heap,
  graphs,
  tries,
  "dynamic-programming": dynamicProgramming,
  greedy,
  "bit-manipulation": bitManipulation,
  intervals,
};

export const topics: Topic[] = topicsMeta
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((meta) => ({ ...meta, problems: problemsBySlug[meta.slug] ?? [] }));

export const topicMap: Record<string, Topic> = Object.fromEntries(
  topics.map((t) => [t.slug, t]),
);

export function getTopic(slug: string): Topic | undefined {
  return topicMap[slug];
}

export function difficultyCounts(problems: Problem[]) {
  return {
    Easy: problems.filter((p) => p.difficulty === "Easy").length,
    Medium: problems.filter((p) => p.difficulty === "Medium").length,
    Hard: problems.filter((p) => p.difficulty === "Hard").length,
  };
}
