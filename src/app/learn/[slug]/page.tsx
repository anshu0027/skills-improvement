import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ModuleView from "@/components/ModuleView";
import { getModule, adjacentModules } from "@/data/learn";
import { moduleSlugs } from "@/data/learn/meta";

export function generateStaticParams() {
  return moduleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) return { title: "Module not found · Learn" };
  return {
    title: `${mod.title} · Learn the Skills`,
    description: `${mod.blurb} ${mod.why}`,
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const { prev, next } = adjacentModules(slug);

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-8 sm:px-8">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#777] transition-colors hover:text-[#ccc]"
      >
        ← All skills
      </Link>

      <div className="mt-4">
        <ModuleView mod={mod} />
      </div>

      {/* Prev / next */}
      <nav className="mt-12 grid grid-cols-1 gap-3 border-t border-[#1a1a1a] pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="rounded-lg border border-[#1e1e1e] bg-[#101010] px-4 py-3 transition-colors hover:border-[#3a3a3a]"
          >
            <div className="text-[11px] uppercase tracking-wider text-[#666]">← Previous</div>
            <div className="text-[14px] font-semibold text-[#e0e0e0]">{prev.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="rounded-lg border border-[#1e1e1e] bg-[#101010] px-4 py-3 text-right transition-colors hover:border-[#3a3a3a]"
          >
            <div className="text-[11px] uppercase tracking-wider text-[#666]">Next →</div>
            <div className="text-[14px] font-semibold text-[#e0e0e0]">{next.title}</div>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
