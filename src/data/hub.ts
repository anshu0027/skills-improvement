// Top-level sections shown as cards on the hub home page.
export interface HubSection {
  key: string;
  title: string;
  blurb: string;
  href: string;
  /** Short stat shown on the card, e.g. "18 topics · 900 problems". */
  stat: string;
  /** Icon key from components/icons.tsx UiIcon. */
  icon: string;
  /** Opens in a new tab (for the static mnc-roadmap outside the app). */
  external?: boolean;
}

export const hubSections: HubSection[] = [
  {
    key: "dsa",
    title: "DSA Practice",
    blurb:
      "Every data-structure & algorithm an MNC can ask, solved and explained simply — then through a system-design lens.",
    href: "/dsa",
    stat: "18 topics · 900 problems",
    icon: "grid",
  },
  {
    key: "learn",
    title: "Learn the Skills",
    blurb:
      "13 deep dives that take you from MERN to AI Full-Stack — TypeScript, databases, system design, RAG, agents and more.",
    href: "/learn",
    stat: "13 skills · deep dives",
    icon: "book",
  },
  {
    key: "career",
    title: "Career Plan",
    blurb:
      "MERN → AI Full-Stack Engineer. What to learn beyond DSA, which roles to target, and the path to ₹30 LPA+.",
    href: "/career",
    stat: "6 tracks · ~28 weeks",
    icon: "rocket",
  },
];
