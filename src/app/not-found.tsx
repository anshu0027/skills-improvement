import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <div className="text-6xl font-black text-[#e6e6e6]">404</div>
      <h1 className="mt-3 text-2xl font-bold">This topic isn&apos;t here (yet).</h1>
      <p className="mt-2 text-[15px] text-[#9a9a9a]">
        Either the link is wrong or this topic has no problems loaded.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg border border-[#333] bg-[#161616] px-4 py-2 text-[14px] font-semibold text-[#e6e6e6] transition-colors hover:border-[#555] hover:bg-[#1c1c1c]"
      >
        ← Back to all topics
      </Link>
    </main>
  );
}
