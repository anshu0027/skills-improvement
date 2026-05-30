import type { Problem } from "@/data/types";
import { problems as part1 } from "./heap.part1";
import { problems as part2 } from "./heap.part2";

// 50 heap / priority-queue problems, generated in two halves to stay within
// generation limits, merged here in easy → hard order.
export const problems: Problem[] = [...part1, ...part2];
