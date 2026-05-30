import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProblemExplorer from "@/components/ProblemExplorer";
import { getTopic } from "@/data/topics";
import { topicSlugs } from "@/data/meta";

export function generateStaticParams() {
  return topicSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: "Topic not found · DSA → MNC" };
  return {
    title: `${topic.title} · DSA → MNC Ready`,
    description: `${topic.problems.length} solved & explained ${topic.title} problems, easy to hard. ${topic.blurb}`,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic || topic.problems.length === 0) notFound();
  return <ProblemExplorer topic={topic} />;
}
