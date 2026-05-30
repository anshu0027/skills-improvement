import type { Problem } from "@/data/types";
import { problems as part1 } from "./graphs.part1";
import { problems as part2 } from "./graphs.part2";

// 50 graph problems, generated in two halves to stay within generation limits,
// merged here in easy → hard order.
export const problems: Problem[] = [...part1, ...part2];
