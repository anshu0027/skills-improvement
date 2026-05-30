import HubCard from "@/components/HubCard";
import { hubSections } from "@/data/hub";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-16 sm:px-8">
      {/* Hero */}
      <header className="mb-12">
        <div className="mb-3 text-[12px] font-semibold tracking-[0.3em] text-[#666]">
          VISIONXGEN · MNC PREP · 2026
        </div>
        <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
          Get MNC-ready.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#9a9a9a] sm:text-lg">
          Two things stand between you and a top product-company offer:{" "}
          <span className="text-[#d4d4d4]">the algorithms they test</span> and{" "}
          <span className="text-[#d4d4d4]">the skills + role strategy that get you hired</span>.
          Pick where to start.
        </p>
      </header>

      {/* Section cards */}
      <section>
        <div className="mb-5 text-[12px] font-semibold tracking-[0.3em] text-[#666]">
          CHOOSE A TRACK
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {hubSections.map((section, i) => (
            <HubCard key={section.key} section={section} index={i} />
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-[#1a1a1a] pt-6 text-[13px] text-[#666]">
        Built for the MNC Job Switch Roadmap · Daily execution beats motivation.
      </footer>
    </main>
  );
}
