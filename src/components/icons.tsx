// Minimal inline line-icons (stroke = currentColor). No emoji, no icon library.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={22}
      height={22}
      {...props}
    >
      {children}
    </svg>
  );
}

const topicIcons: Record<string, (p: IconProps) => React.ReactElement> = {
  // Arrays — a row of boxes
  arrays: (p) => (
    <Svg {...p}>
      <rect x="3" y="9" width="4.5" height="6" rx="1" />
      <rect x="9.75" y="9" width="4.5" height="6" rx="1" />
      <rect x="16.5" y="9" width="4.5" height="6" rx="1" />
    </Svg>
  ),
  // Strings — lines of text
  strings: (p) => (
    <Svg {...p}>
      <path d="M5 7h14" />
      <path d="M5 12h14" />
      <path d="M5 17h9" />
    </Svg>
  ),
  // Two pointers — arrows converging
  "two-pointers": (p) => (
    <Svg {...p}>
      <path d="M3 12h6" />
      <path d="M7 9l2 3-2 3" />
      <path d="M21 12h-6" />
      <path d="M17 9l-2 3 2 3" />
    </Svg>
  ),
  // Sliding window — a frame over a strip
  "sliding-window": (p) => (
    <Svg {...p}>
      <path d="M3 15h18" />
      <rect x="8" y="6" width="8" height="10" rx="1.5" />
    </Svg>
  ),
  // Stack — layered plates
  stack: (p) => (
    <Svg {...p}>
      <rect x="5" y="6" width="14" height="3.2" rx="1" />
      <rect x="5" y="10.4" width="14" height="3.2" rx="1" />
      <rect x="5" y="14.8" width="14" height="3.2" rx="1" />
    </Svg>
  ),
  // Queue — cells with an exit arrow
  queue: (p) => (
    <Svg {...p}>
      <rect x="3.5" y="9" width="12" height="6" rx="1" />
      <path d="M7.5 9v6" />
      <path d="M11.5 9v6" />
      <path d="M16 12h4" />
      <path d="M18 10l2 2-2 2" />
    </Svg>
  ),
  // Linked list — nodes joined by links
  "linked-list": (p) => (
    <Svg {...p}>
      <circle cx="5" cy="12" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="19" cy="12" r="2.2" />
      <path d="M7.2 12h2.6" />
      <path d="M14.2 12h2.6" />
    </Svg>
  ),
  // Binary search — magnifier
  "binary-search": (p) => (
    <Svg {...p}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-3.8-3.8" />
    </Svg>
  ),
  // Recursion — nested squares
  "recursion-backtracking": (p) => (
    <Svg {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1.5" />
    </Svg>
  ),
  // Binary tree — root with two children
  trees: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M10.7 6.6L7.3 16.4" />
      <path d="M13.3 6.6l3.4 9.8" />
    </Svg>
  ),
  // BST — fuller, ordered tree
  bst: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="4.5" r="1.8" />
      <circle cx="6.5" cy="11.5" r="1.8" />
      <circle cx="17.5" cy="11.5" r="1.8" />
      <circle cx="11" cy="18.5" r="1.8" />
      <path d="M10.8 5.9L7.7 10.1" />
      <path d="M13.2 5.9l3.1 4.2" />
      <path d="M7.4 13l2.5 4" />
    </Svg>
  ),
  // Heap — pyramid
  heap: (p) => (
    <Svg {...p}>
      <path d="M12 4L21 19H3z" />
      <path d="M7.5 13h9" />
    </Svg>
  ),
  // Graphs — connected nodes
  graphs: (p) => (
    <Svg {...p}>
      <circle cx="6" cy="7" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="12" cy="17" r="2" />
      <path d="M7.8 8.1l2.9 7" />
      <path d="M16.4 9.5l-3.1 6" />
      <path d="M8 7.3h8" />
    </Svg>
  ),
  // Tries — multi-branch prefix tree
  tries: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="5" r="1.7" />
      <circle cx="6" cy="12" r="1.7" />
      <circle cx="18" cy="12" r="1.7" />
      <circle cx="9" cy="19" r="1.7" />
      <circle cx="15" cy="19" r="1.7" />
      <path d="M10.7 6.1L7.3 10.9" />
      <path d="M13.3 6.1l3.4 4.8" />
      <path d="M7 13.5l1.5 4" />
      <path d="M16.8 13.6L15.4 17.4" />
    </Svg>
  ),
  // Dynamic programming — a filled table
  "dynamic-programming": (p) => (
    <Svg {...p}>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M4 10h16" />
      <path d="M4 15h16" />
      <path d="M10 4v16" />
      <path d="M15 4v16" />
    </Svg>
  ),
  // Greedy — trend up
  greedy: (p) => (
    <Svg {...p}>
      <path d="M4 16l5-5 4 4 7-7" />
      <path d="M17 5h4v4" />
    </Svg>
  ),
  // Bit manipulation — toggle switches
  "bit-manipulation": (p) => (
    <Svg {...p}>
      <rect x="3" y="5.5" width="9" height="5" rx="2.5" />
      <circle cx="7.5" cy="8" r="1.2" />
      <rect x="12" y="13.5" width="9" height="5" rx="2.5" />
      <circle cx="16.5" cy="16" r="1.2" />
    </Svg>
  ),
  // Intervals — overlapping ranges
  intervals: (p) => (
    <Svg {...p}>
      <rect x="3" y="7" width="11" height="3" rx="1.5" />
      <rect x="10" y="14" width="11" height="3" rx="1.5" />
    </Svg>
  ),
};

// Module-level fallback so we never create a component during render.
const fallbackIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
  </Svg>
);

export function TopicIcon({ slug, ...props }: { slug: string } & IconProps) {
  return (topicIcons[slug] ?? fallbackIcon)(props);
}

export function IdeaIcon(p: IconProps) {
  return (
    <Svg width={15} height={15} {...p}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.3 1 2.5h6c0-1.2.2-1.7 1-2.5A6 6 0 0 0 12 3z" />
    </Svg>
  );
}

export function SystemIcon(p: IconProps) {
  return (
    <Svg width={15} height={15} {...p}>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <path d="M7.5 7h.01" />
      <path d="M7.5 17h.01" />
    </Svg>
  );
}

export function AlertIcon(p: IconProps) {
  return (
    <Svg width={15} height={15} {...p}>
      <path d="M12 4L3 19h18z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

// General UI icons used by the hub + career pages (referenced by key, never emoji).
const uiIcons: Record<string, (p: IconProps) => React.ReactElement> = {
  // DSA — four-cell grid
  grid: (p) => (
    <Svg {...p}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </Svg>
  ),
  // Career — rocket
  rocket: (p) => (
    <Svg {...p}>
      <path d="M12 3c2.8 1.8 4.2 4.6 4.2 7.5 0 2-.7 3.8-1.7 5L12 18l-2.5-2.5c-1-1.2-1.7-3-1.7-5C7.8 7.6 9.2 4.8 12 3z" />
      <circle cx="12" cy="9.5" r="1.4" />
      <path d="M9.5 18.5L8 22" />
      <path d="M14.5 18.5L16 22" />
    </Svg>
  ),
  // Roadmap — map / route
  map: (p) => (
    <Svg {...p}>
      <path d="M9 4L4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </Svg>
  ),
  // AI / compute — chip
  chip: (p) => (
    <Svg {...p}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3" />
    </Svg>
  ),
  cloud: (p) => (
    <Svg {...p}>
      <path d="M7 18h10a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 6.5 9 4 4 0 0 0 7 18z" />
    </Svg>
  ),
  database: (p) => (
    <Svg {...p}>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
    </Svg>
  ),
  code: (p) => (
    <Svg {...p}>
      <path d="M9 8l-4 4 4 4" />
      <path d="M15 8l4 4-4 4" />
    </Svg>
  ),
  server: (p) => (
    <Svg {...p}>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <path d="M7.5 7h.01" />
      <path d="M7.5 17h.01" />
    </Svg>
  ),
  target: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </Svg>
  ),
  layers: (p) => (
    <Svg {...p}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </Svg>
  ),
  checklist: (p) => (
    <Svg {...p}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4 5.5l1 1 2-2" />
      <path d="M4 11.5l1 1 2-2" />
      <path d="M4 17.5l1 1 2-2" />
    </Svg>
  ),
  book: (p) => (
    <Svg {...p}>
      <path d="M5 4h13v15H6a2 2 0 0 0-2 2V5a1 1 0 0 1 1-1z" />
      <path d="M4 18.5A2 2 0 0 1 6 17h12" />
    </Svg>
  ),
  briefcase: (p) => (
    <Svg {...p}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </Svg>
  ),
  // Python / FastAPI — a terminal/console
  python: (p) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 10l3 2-3 2" />
      <path d="M13 14h4" />
    </Svg>
  ),
  // Next.js — N in a circle
  nextjs: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 16V8" />
      <path d="M9 8l7 9" />
      <path d="M16 16V8" />
    </Svg>
  ),
  // Vector / embedding — a vector in a coordinate space
  vector: (p) => (
    <Svg {...p}>
      <path d="M5 5v14h14" />
      <path d="M6 18L17 7" />
      <path d="M17 7h-4M17 7v4" />
    </Svg>
  ),
  // Network / distributed system — connected nodes
  network: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M10.7 6.6L6.3 16.4" />
      <path d="M13.3 6.6l4.4 9.8" />
      <path d="M7 18h10" />
    </Svg>
  ),
  // Search / retrieval — magnifier
  search: (p) => (
    <Svg {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </Svg>
  ),
  // Agent — a small robot
  agent: (p) => (
    <Svg {...p}>
      <rect x="5" y="8" width="14" height="11" rx="2" />
      <path d="M12 8V4.5" />
      <circle cx="12" cy="3.5" r="1" />
      <circle cx="9.5" cy="13" r="1.1" />
      <circle cx="14.5" cy="13" r="1.1" />
      <path d="M9.5 16.5h5" />
    </Svg>
  ),
  // Gauge — metrics / observability
  gauge: (p) => (
    <Svg {...p}>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="M12 18l4-5" />
      <circle cx="12" cy="18" r="1" />
    </Svg>
  ),
};

export function UiIcon({ name, ...props }: { name: string } & IconProps) {
  return (uiIcons[name] ?? fallbackIcon)(props);
}
