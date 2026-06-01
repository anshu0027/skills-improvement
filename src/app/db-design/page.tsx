import type { Metadata } from "next";
import Link from "next/link";
import DesignTrackView from "@/components/DesignTrackView";
import { dbDesignTrack } from "@/data/design/db-design";

export const metadata: Metadata = {
  title: "DB Design · MNC Interview Prep",
  description:
    "Database design roadmap for MNC interviews: schema modeling, indexes, transactions, normalization, partitioning, replication, caching, and scale tradeoffs.",
};

export default function DbDesignPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-8 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#777] transition-colors hover:text-[#ccc]"
      >
        ← Home
      </Link>

      <div className="mt-5">
        <DesignTrackView track={dbDesignTrack} />
      </div>
    </main>
  );
}
