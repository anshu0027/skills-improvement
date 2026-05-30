import type { Module } from "@/data/learn/types";
import { getModuleMeta } from "@/data/learn/meta";

const meta = getModuleMeta("nextjs")!;

export const learnModule: Module = {
  ...meta,
  simple:
    "A React page normally runs in the browser: the server sends empty HTML, then JavaScript loads and builds the UI. Next.js (App Router) flips this — it runs React components on the server first, streams ready HTML to the browser, and only ships interactive code to the client when you explicitly ask for it. Think of it like a restaurant kitchen: most of the work happens out back (server), and the waiter (browser) only carries the finished plate to the table — less travel, less weight.",
  concepts: [
    {
      title: "App Router file conventions",
      explain:
        "The `app/` directory is the root of the App Router. Inside it, Next.js recognises specific filenames as special: `page.tsx` exports the UI for a route, `layout.tsx` wraps children and persists across navigations (great for nav bars), `loading.tsx` shows a Suspense fallback while the page loads, `error.tsx` catches errors in the subtree, and `not-found.tsx` handles 404s. Every segment of the URL maps to a folder; nesting folders nests layouts. This is different from the older `pages/` directory — files no longer equal routes directly.",
      code: `app/
  layout.tsx          // root layout — wraps every page
  page.tsx            // renders at /
  dashboard/
    layout.tsx        // wraps all /dashboard/* pages
    page.tsx          // renders at /dashboard
    settings/
      page.tsx        // renders at /dashboard/settings
  api/
    users/
      route.ts        // Route Handler at /api/users`,
      lang: "bash",
      note: "Layouts are the key architectural win: a shared nav or sidebar is defined once and never re-mounts on route change. This removes the flickering common in SPAs and keeps scroll position intact.",
    },
    {
      title: "Server Components vs Client Components",
      explain:
        "In the App Router, every component is a React Server Component (RSC) by default. Server Components render on the server, have zero JavaScript bundle cost, and can directly `await` data (databases, APIs) without useEffect. Add `'use client'` at the top of a file to opt in to a Client Component — it hydrates in the browser and can use hooks like `useState`, `useEffect`, and browser APIs. The rule of thumb: put state, event handlers, and browser APIs in Client Components; put data fetching and heavy rendering in Server Components.",
      code: `// app/users/page.tsx — Server Component (no directive needed)
export default async function UsersPage() {
  const users = await db.user.findMany();   // direct DB call, no API needed
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// app/users/SearchBar.tsx — Client Component
'use client';
import { useState } from 'react';
export function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState('');
  return <input value={q} onChange={e => { setQ(e.target.value); onSearch(e.target.value); }} />;
}`,
      note: "Server Components are the main reason App Router reduces JavaScript bundle size. A page that used to ship 80 KB of data-fetching logic now ships only the interactive islands. This is critical for Core Web Vitals (LCP, TBT) in AI-heavy UIs where the data layer is large.",
    },
    {
      title: "Data fetching in Server Components",
      explain:
        "Because Server Components are async functions, you fetch data by awaiting it at the top of the component — no `useEffect`, no loading state in the component tree. You can call your database directly, call a third-party API, or use `fetch` with Next.js's extended caching options. Parallel fetches with `Promise.all` are the right pattern to avoid waterfalls.",
      code: `// app/post/[id]/page.tsx
async function getPost(id: string) {
  const res = await fetch(\`https://api.example.com/posts/\${id}\`, {
    next: { revalidate: 60 },   // ISR: stale after 60 seconds
  });
  if (!res.ok) throw new Error('Failed');
  return res.json() as Promise<Post>;
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const [post, author] = await Promise.all([
    getPost(params.id),
    getAuthor(params.id),       // fetch in parallel, not waterfall
  ]);
  return <article><h1>{post.title}</h1><p>By {author.name}</p></article>;
}`,
      note: "Fetching in Server Components eliminates the classic React data-fetching waterfall: component mounts → triggers useEffect → fetch → re-render. With RSC the data is ready before the HTML leaves the server, cutting perceived load time significantly.",
    },
    {
      title: "Caching and revalidation model",
      explain:
        "Next.js has a layered cache. `fetch` responses are memoized per request (deduplication), stored in the Data Cache (persistent, across requests), and fed into the Full Route Cache (pre-rendered HTML on disk). You control staleness with `next: { revalidate: N }` for time-based ISR, `next: { tags: ['posts'] }` for on-demand revalidation, or `cache: 'no-store'` for fully dynamic. The `export const dynamic = 'force-dynamic'` route segment config opts the entire route out of static generation.",
      code: `// Time-based revalidation (ISR): re-generate every 60 s
const res = await fetch(url, { next: { revalidate: 60 } });

// Tag-based on-demand revalidation
const res = await fetch(url, { next: { tags: ['products'] } });
// In a Server Action or Route Handler:
import { revalidateTag } from 'next/cache';
revalidateTag('products');   // purges all fetches tagged 'products'

// Fully dynamic — never cache
const res = await fetch(url, { cache: 'no-store' });

// Route segment config
export const revalidate = 3600;   // revalidate the whole route every hour
export const dynamic = 'force-dynamic';  // always SSR`,
      note: "Understanding this cache stack is the most common interview gap. The wrong cache setting either serves stale data to users or disables static generation, turning a fast CDN-served page into a slow SSR hit on every request.",
    },
    {
      title: "Server Actions (mutations)",
      explain:
        "Server Actions are async functions marked with `'use server'` that run on the server but can be called directly from a Client Component or a form's `action` attribute. They're the idiomatic way to mutate data in the App Router — no need to create a separate API endpoint for simple create/update/delete operations. After a mutation, call `revalidatePath` or `revalidateTag` to update the cache.",
      code: `// app/actions.ts
'use server';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  await db.post.create({ data: { title } });
  revalidatePath('/posts');    // purge cached /posts page
}

// app/posts/new/page.tsx
import { createPost } from '../actions';
export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}`,
      note: "Server Actions eliminate a whole category of boilerplate: no Route Handler, no fetch call, no JSON serialisation for simple mutations. They're ideal for forms. For complex flows (webhooks, external integrations, streaming responses) a Route Handler is still the right tool.",
    },
    {
      title: "Route Handlers (app/api)",
      explain:
        "Route Handlers replace `pages/api` routes. A file named `route.ts` in any `app/` subdirectory exports named functions `GET`, `POST`, `PUT`, `DELETE`, etc. They receive a Web `Request` and must return a `Response`. Use Route Handlers when you need a real HTTP endpoint: webhooks, OAuth callbacks, or an API consumed by mobile apps or third parties.",
      code: `// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = UserSchema.parse(body);    // validate with zod
  const user = await db.user.create({ data: parsed });
  return NextResponse.json(user, { status: 201 });
}`,
      note: "A key architectural decision: Server Action or Route Handler? Server Actions are tightly coupled to the UI and benefit from React's state model (useFormStatus, useOptimistic). Route Handlers are proper HTTP endpoints — use them when the consumer is not your own React UI.",
    },
    {
      title: "Streaming and Suspense",
      explain:
        "Next.js supports React's streaming model: the server can send the shell of the page (layout, static content) immediately and stream slower sections as they resolve. Wrap a slow async component in `<Suspense fallback={<Skeleton />}>` and users see content progressively rather than staring at a blank screen. `loading.tsx` is a shorthand that wraps the whole page in Suspense automatically.",
      code: `// app/dashboard/page.tsx
import { Suspense } from 'react';
import { ActivityFeed } from './ActivityFeed';   // slow — hits external API
import { QuickStats } from './QuickStats';       // fast — cached DB query

export default function DashboardPage() {
  return (
    <main>
      <QuickStats />                              {/* renders immediately */}
      <Suspense fallback={<div>Loading feed...</div>}>
        <ActivityFeed />                          {/* streams when ready */}
      </Suspense>
    </main>
  );
}`,
      note: "Streaming is the key unlock for AI chat UIs — the LLM response starts streaming token-by-token and Suspense handles the progressive reveal without a custom polling loop. It's also critical for dashboards with mixed fast/slow data.",
    },
    {
      title: "Dynamic routes and generateStaticParams",
      explain:
        "A folder named `[id]` or `[slug]` creates a dynamic segment. `params.id` is available in the component. For static generation of dynamic routes at build time, export `generateStaticParams` — it returns an array of param objects Next.js pre-renders. Routes not in that list fall back to on-demand rendering (or 404, depending on `dynamicParams`).",
      code: `// app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await db.post.findMany({ select: { slug: true } });
  return posts.map(p => ({ slug: p.slug }));   // pre-render all posts
}

export const dynamicParams = false;    // 404 for slugs not in the list

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({ where: { slug: params.slug } });
  if (!post) notFound();
  return <article>{post.content}</article>;
}`,
      note: "`generateStaticParams` is the App Router equivalent of `getStaticPaths`. Pre-generating high-traffic pages (product detail, blog posts) at build time means they're served from the CDN edge with no server hit — sub-50 ms TTFB.",
    },
    {
      title: "Metadata API",
      explain:
        "The App Router has a built-in Metadata API for `<head>` tags. Export a `metadata` object or a `generateMetadata` async function from any `page.tsx` or `layout.tsx`. It replaces `next/head` from the Pages Router and supports OpenGraph, Twitter Cards, robots, canonical URLs, and more — fully typed.",
      code: `// Static metadata
export const metadata = {
  title: 'My Blog',
  description: 'Thoughts on AI and software engineering.',
};

// Dynamic metadata (e.g. for a blog post)
import type { Metadata } from 'next';
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.coverImageUrl] },
  };
}`,
      note: "Correct metadata is table-stakes for SEO and social sharing. The typed API catches typos in property names and ensures every route has the right `<title>` without manually maintaining template strings.",
    },
    {
      title: "Rendering strategies: SSG, SSR, ISR",
      explain:
        "These are still the same concepts, but implemented differently in the App Router. SSG (Static Site Generation) happens by default when a page has no dynamic data. SSR (Server-Side Rendering) happens when you use `cache: 'no-store'` or `dynamic = 'force-dynamic'`. ISR (Incremental Static Regeneration) is `revalidate: N` or tag-based revalidation. You no longer export `getStaticProps`/`getServerSideProps` — the fetch options and route segment config drive the choice.",
      code: `// SSG — no dynamic data, built once
export default async function AboutPage() {
  const content = await fetchStaticContent();  // cached indefinitely
  return <p>{content}</p>;
}

// SSR — always fresh
export const dynamic = 'force-dynamic';
export default async function LivePricePage() {
  const price = await fetchLivePrice();        // no-store fetch
  return <p>Price: {price}</p>;
}

// ISR — fresh every 5 minutes
export const revalidate = 300;
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <div>{product.name}</div>;
}`,
      note: "Choosing the right strategy is a system-design decision: SSG for content that changes rarely (marketing, docs), ISR for content that changes infrequently (product listings, blog), SSR only for real-time data (live scores, personalised feeds). SSG and ISR pages are served from the CDN edge, SSR hits your origin server.",
    },
    {
      title: "Middleware",
      explain:
        "Middleware is a function that runs before a request is matched to a route — at the edge, before the response. It's defined in `middleware.ts` at the project root. Use it for authentication redirects, A/B testing, locale detection, and request header manipulation. It must use the Edge Runtime (no Node.js APIs). Keep it fast — it runs on every matched request.",
      code: `// middleware.ts (project root)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],  // only run on these paths
};`,
      note: "Middleware auth redirects are the most common use case and the right place for coarse-grained protection. Fine-grained checks (role-based access to specific data) still belong in the Server Component or Route Handler where you have full Node.js access.",
    },
    {
      title: "Environment variables: server vs NEXT_PUBLIC",
      explain:
        "Variables without a prefix (e.g. `DATABASE_URL`, `OPENAI_API_KEY`) are server-only — they exist in `process.env` on the server but are never sent to the browser bundle. Variables prefixed with `NEXT_PUBLIC_` are baked into the client bundle at build time and visible to everyone. Never put secrets in `NEXT_PUBLIC_` variables.",
      code: `// .env.local
DATABASE_URL=postgres://...       // server-only, never exposed
OPENAI_API_KEY=sk-...             // server-only
NEXT_PUBLIC_APP_URL=https://...   // safe to expose — used in OG URLs etc.

// Server Component or Route Handler — fine
const db = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

// Client Component — NEXT_PUBLIC only
const appUrl = process.env.NEXT_PUBLIC_APP_URL;  // fine
const apiKey = process.env.OPENAI_API_KEY;       // undefined in browser — intentional`,
      note: "A common leak is accidentally exposing an API key by using it in a Client Component. The rule is mechanical: if the component file has `'use client'`, only `NEXT_PUBLIC_` vars are available. Put all secret-using code in Server Components, Server Actions, or Route Handlers.",
    },
  ],
  interviewQs: [
    {
      q: "What is a React Server Component and how does it differ from a Client Component?",
      a: "A React Server Component (RSC) renders only on the server. It can be an async function, can directly await data, and ships zero JavaScript to the browser — it's serialised as a React tree description. A Client Component (marked `'use client'`) runs on both server (for the initial HTML) and client (for hydration and interactivity). Client Components can use hooks and browser APIs; Server Components cannot. The key win is bundle size: heavy data-fetching logic and large dependencies used only for rendering never appear in the client JS bundle.",
    },
    {
      q: "Why do Server Components reduce JavaScript bundle size?",
      a: "Any dependency imported only in a Server Component never gets included in the browser bundle — it stays on the server. For example, a markdown parser, a database client, or a large formatting library used to render static content costs zero bytes in the browser. Only code in `'use client'` subtrees is bundled and sent to the client. On a typical content-heavy page this can cut hundreds of kilobytes of JS.",
    },
    {
      q: "Explain the difference between SSG, SSR, and ISR in the App Router.",
      a: "SSG: the page is rendered to HTML at build time and served statically from the CDN — fastest possible response, but data is stale until a rebuild. SSR: the page is rendered on the server on every request — always fresh, but slower and more costly. ISR (Incremental Static Regeneration): the page is pre-rendered at build time but re-generated in the background after a configurable time (`revalidate: N`) or on demand (`revalidateTag`). In the App Router these aren't `getStaticProps`/`getServerSideProps` functions — they're controlled by `fetch` cache options and route segment config exports.",
    },
    {
      q: "What is hydration and why does it matter?",
      a: "Hydration is the process where React's client-side runtime takes over the server-rendered HTML and attaches event listeners, making it interactive. Until hydration completes, the page looks correct but isn't interactive. Hydration errors occur when the server-rendered HTML doesn't match what React would render on the client (e.g. using `window` in a component that renders on the server). Minimising Client Components reduces hydration cost.",
    },
    {
      q: "How does Next.js caching work — what are the layers?",
      a: "There are four layers. (1) Request Memoization: within a single server render pass, identical `fetch` calls are deduplicated. (2) Data Cache: persistent across requests — `fetch` responses are stored on disk, controlled by `revalidate` or `cache: 'no-store'`. (3) Full Route Cache: the complete rendered HTML of a static route is cached on disk and served from the CDN. (4) Router Cache: the client-side cache of already-visited routes so navigating back is instant. Revalidation (`revalidatePath`/`revalidateTag`) purges the Data Cache and Full Route Cache, causing a fresh render on the next request.",
    },
    {
      q: "When would you use a Server Action versus a Route Handler?",
      a: "A Server Action is tightly coupled to the React component tree — it integrates with `useFormStatus`, `useOptimistic`, and form `action` attributes. Use it for mutations triggered by your own UI: form submissions, button clicks, inline edits. A Route Handler is a proper HTTP endpoint — use it when the consumer is not your React UI: webhooks from Stripe or GitHub, OAuth callbacks, mobile apps, or any external service that needs a stable URL to call.",
    },
    {
      q: "What does `'use client'` actually do — does it mean the component ONLY runs in the browser?",
      a: "No. `'use client'` marks a component as a Client Component, which means it renders on the server for the initial HTML (SSR) AND hydrates in the browser for interactivity. What it actually does is draw a boundary in the component tree: everything below `'use client'` gets included in the JavaScript bundle sent to the browser. Components above that boundary (Server Components) do not. It's a bundling boundary, not a rendering switch.",
    },
    {
      q: "How do you handle authentication in the App Router?",
      a: "Coarse-grained protection (redirect unauthenticated users away from /dashboard) belongs in Middleware — it runs at the edge before any rendering. Fine-grained checks (does this user have permission to see this specific record?) belong in the Server Component or Server Action, where you call your auth library (`getServerSession`, `auth()`, etc.) and return `notFound()` or `redirect()`. Never rely solely on client-side checks — they can be bypassed.",
    },
    {
      q: "How do you stream an LLM response in Next.js?",
      a: "Use a Route Handler that returns a `ReadableStream` (or use the Vercel AI SDK's `streamText` helper). The handler returns a `Response` with a streaming body and `Content-Type: text/event-stream`. On the client, a Client Component reads the stream incrementally — the Vercel AI SDK's `useChat` hook handles this automatically. Alternatively, wrap a Server Component that awaits a slow async operation in `<Suspense>` to stream the rendered HTML once the data resolves.",
    },
    {
      q: "What is the `generateStaticParams` function and when do you need it?",
      a: "`generateStaticParams` is used in dynamic routes to tell Next.js which param values to pre-render at build time. It returns an array of param objects (e.g. `[{ slug: 'hello-world' }, { slug: 'second-post' }]`). Without it, dynamic routes are rendered on demand (SSR). With it, those specific pages become static HTML on the CDN. Set `dynamicParams = false` to 404 any slug not in the list, or leave it true (default) to SSR the rest.",
    },
    {
      q: "How are environment variables handled differently between server and client in Next.js?",
      a: "Variables without a prefix are available only in server-side code (Server Components, Server Actions, Route Handlers, Middleware) via `process.env`. They are never included in the browser bundle. Variables prefixed with `NEXT_PUBLIC_` are inlined into the client bundle at build time and visible to anyone who inspects the page source. The rule: secrets and credentials must never use the `NEXT_PUBLIC_` prefix.",
    },
  ],
  build: [
    "Build a full-stack blog with the App Router: a static home page listing posts (ISR, revalidate every 5 minutes), dynamic `[slug]` post pages with `generateStaticParams`, a Server Action to post comments, and a Middleware that redirects unauthenticated users away from the admin route.",
    "Build an AI chat interface: a Route Handler that streams an OpenAI response as Server-Sent Events, a `'use client'` chat component that reads the stream and appends tokens incrementally, and a Server Component that loads the conversation history from a database.",
    "Build a product dashboard: a Server Component that fetches slow analytics data wrapped in `<Suspense>` for streaming, a `'use client'` search bar that filters via a URL search param (using `useRouter` and `useSearchParams`), and a Server Action that updates a product and calls `revalidateTag`.",
  ],
  pitfalls: [
    "Adding `'use client'` to every component out of habit. This defeats the whole purpose of Server Components — you lose server-side data fetching, increase bundle size, and re-introduce waterfall fetches. Only add `'use client'` where you actually need hooks or browser APIs.",
    "Putting secrets in `NEXT_PUBLIC_` environment variables. Anything prefixed `NEXT_PUBLIC_` is baked into the JS bundle and visible to every user. API keys, database URLs, and OAuth secrets must never have this prefix.",
    "Ignoring the caching layers — either over-caching (serving stale data for longer than acceptable) or disabling all caches with `no-store` everywhere (turning every page into a full SSR hit). Understand `revalidate`, `revalidateTag`, and `no-store` and choose deliberately per route.",
    "Causing hydration mismatches by reading browser-only values (`window`, `localStorage`, `Date.now()`) during SSR. Guard with `typeof window !== 'undefined'` or the `useEffect` hook, or move the logic to a Client Component that defers to client-only rendering.",
    "Nesting async Server Components inside Client Components and expecting them to still be Server Components. Once you cross into a `'use client'` boundary, all children become Client Components too — pass Server Component output as `children` props to keep the boundary clean.",
  ],
  resources: [
    { label: "Next.js App Router docs (official)", url: "https://nextjs.org/docs/app" },
    { label: "Next.js data fetching & caching", url: "https://nextjs.org/docs/app/building-your-application/data-fetching/fetching" },
    { label: "React Server Components RFC & docs", url: "https://react.dev/reference/rsc/server-components" },
    { label: "Next.js Server Actions", url: "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations" },
    { label: "Vercel AI SDK (streaming in Next.js)", url: "https://sdk.vercel.ai/docs/introduction" },
    { label: "Next.js caching in depth", url: "https://nextjs.org/docs/app/building-your-application/caching" },
  ],
  checklist: [
    "Explain the difference between a Server Component and a Client Component, and when to use each",
    "Build a page that fetches data directly in a Server Component (no useEffect)",
    "Use Suspense and loading.tsx to stream a slow section of a page",
    "Write a Server Action that mutates data and calls revalidatePath",
    "Create a Route Handler (GET + POST) and call it from a non-React client",
    "Use generateStaticParams to pre-render a set of dynamic routes at build time",
    "Configure ISR with revalidate and on-demand revalidation with revalidateTag",
    "Implement auth protection in Middleware for a protected route group",
    "Correctly use NEXT_PUBLIC_ vs server-only environment variables with no secrets leaked",
  ],
};
