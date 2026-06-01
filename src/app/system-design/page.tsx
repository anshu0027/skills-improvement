import type { Metadata } from "next";
import Link from "next/link";
import DesignTrackView from "@/components/DesignTrackView";
import { systemDesignTrack } from "@/data/design/system-design";

export const metadata: Metadata = {
  title: "System Design · MNC Interview Prep",
  description:
    "High-level system design roadmap for MNC interviews: requirements, APIs, scaling, caching, queues, consistency, observability, and AI-era architecture.",
};

export default function SystemDesignPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-8 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#777] transition-colors hover:text-[#ccc]"
      >
        ← Home
      </Link>

      <div className="mt-5">
        <DesignTrackView track={systemDesignTrack} />
      </div>
    </main>
  );
}
