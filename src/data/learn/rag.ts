import type { Module } from "@/data/learn/types";
import { getModuleMeta } from "@/data/learn/meta";

const meta = getModuleMeta("rag")!;

export const learnModule: Module = {
  ...meta,
  simple:
    "Large language models know a lot, but their knowledge stops at a training cutoff and they have never seen your company's private documents. RAG (Retrieval-Augmented Generation) fixes this without retraining: before the model answers, you look up the most relevant chunks of your own data, paste them into the prompt, and tell the model to answer from what you just gave it. The model becomes a reader who works from the documents you hand it, not just memory.",
  concepts: [
    {
      title: "Why RAG exists — grounding vs retraining",
      explain:
        "A base LLM is frozen at training time. To answer questions about your internal wiki, last week's support tickets, or a private codebase, you have two options: fine-tune (expensive, slow, doesn't keep up with fresh data) or inject the relevant text at inference time. RAG does the latter: retrieve → augment the prompt → generate. It is cheaper, always up to date, and lets you audit what the model saw.",
      code: `// Conceptual RAG loop
async function ragAnswer(userQuestion: string): Promise<string> {
  const chunks = await vectorStore.similaritySearch(userQuestion, { topK: 5 });
  const context = chunks.map(c => c.pageContent).join("\\n\\n");
  const prompt = \`Answer using only the context below.\\n\\n\${context}\\n\\nQuestion: \${userQuestion}\`;
  return llm.complete(prompt);
}`,
      note: "RAG is now the default architecture for enterprise AI assistants. Fine-tuning is reserved for teaching the model a new style or skill, not for injecting knowledge — that is what RAG is for.",
    },
    {
      title: "RAG vs fine-tuning — when to use each",
      explain:
        "Fine-tuning changes the weights of the model: use it when you need to teach a writing style, a new task format, or domain-specific vocabulary that the base model lacks. RAG injects facts at inference time: use it when the information changes frequently (docs, tickets, products), when you need citation/attribution, or when you cannot afford to retrain. Most production systems do RAG first, and only fine-tune if the base model's reasoning or style is inadequate.",
      note: "A common mistake is fine-tuning a model to 'know' facts. Facts decay; weights are hard to update. Fine-tune for behaviour, RAG for knowledge. In 2025-2026 most frontier models (GPT-4o, Claude 3.5, Gemini 1.5) are capable enough that fine-tuning is rarely the first tool to reach for.",
    },
    {
      title: "The full RAG pipeline",
      explain:
        "Ingest phase (offline): load documents → chunk → embed each chunk → store vectors and metadata in a vector database. Query phase (online): embed the user query → retrieve top-k similar chunks → (optionally) re-rank → assemble a prompt with the chunks as context → call the LLM → return the answer with citations. Both phases must be designed together; a weakness in any step degrades the whole answer.",
      code: `// Ingest (run once / on update)
async function ingest(docs: Document[]): Promise<void> {
  const chunks = docs.flatMap(d => splitter.splitText(d.text, d.metadata));
  const embeddings = await embedder.embedMany(chunks.map(c => c.text));
  const records = chunks.map((c, i) => ({ id: c.id, vector: embeddings[i], metadata: c.metadata }));
  await vectorStore.upsert(records);
}

// Query (per user request)
async function query(q: string): Promise<{ answer: string; sources: string[] }> {
  const qVec = await embedder.embed(q);
  const hits = await vectorStore.query(qVec, { topK: 8 });
  const reranked = await crossEncoder.rerank(q, hits, { topN: 4 });
  const context = reranked.map(h => h.text).join("\\n\\n---\\n\\n");
  const answer = await llm.chat([
    { role: "system", content: "Answer from the provided context only. Cite chunk IDs." },
    { role: "user", content: \`Context:\\n\${context}\\n\\nQuestion: \${q}\` },
  ]);
  return { answer, sources: reranked.map(h => h.metadata.sourceUrl) };
}`,
      note: "The ingest pipeline is usually an async background job triggered by a webhook when docs are updated. The query path must complete in under a second for chat UX — embedding and retrieval are fast; the LLM call is the bottleneck.",
    },
    {
      title: "Chunking strategies — fixed, recursive, semantic",
      explain:
        "You cannot embed an entire document and retrieve it usefully — the embedding averages away specifics. Chunking splits text into pieces the retriever can score individually. Fixed chunking cuts at a character count (simple, fast). Recursive character splitting first breaks at paragraph/sentence/word boundaries, then falls back to character count — preserves sentences. Semantic chunking groups sentences with similar embeddings — highest quality, slowest. The right chunk size depends on the embedding model's context window, your retriever's top-k, and the LLM's context budget. Typical values: 256–1024 tokens per chunk, 10–20% overlap so a sentence that straddles a boundary is not lost.",
      code: `import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,      // tokens (or characters, depending on impl)
  chunkOverlap: 64,    // overlap in same unit
  separators: ["\\n\\n", "\\n", ". ", " ", ""],
});

const chunks = await splitter.createDocuments([rawText], [metadata]);
// Each chunk: { pageContent: string, metadata: { source, page, ... } }`,
      note: "Chunk overlap is the most commonly forgotten parameter. Without it, a sentence split across a boundary loses half its meaning. With too much overlap you duplicate content and inflate storage cost. 10–15% is a safe default.",
    },
    {
      title: "Embedding models — choosing and comparing",
      explain:
        "An embedding model converts text to a dense vector. The query and each chunk must use the same model or similarity scores are meaningless. Key axes: vector dimension (higher = more expressive but slower/costlier), max input tokens (must exceed your chunk size), language support, and benchmark performance (MTEB leaderboard). As of 2026, strong open choices include Cohere embed-v4, OpenAI text-embedding-3-large, and the open-source BGE-M3. For multilingual data, pick a multilingual model explicitly.",
      code: `// Using OpenAI embeddings via the SDK
import OpenAI from "openai";
const openai = new OpenAI();

async function embed(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
    dimensions: 1536,   // you can reduce for speed/cost
  });
  return res.data[0].embedding;
}`,
      note: "Never mix embedding models between ingest and query. If you upgrade the embedding model, you must re-embed the entire corpus. Version your embedding model in the vector store metadata so you know which records need a refresh.",
    },
    {
      title: "Retrieval — top-k, similarity threshold, and hybrid search",
      explain:
        "Given a query vector, the vector store returns the k nearest chunk vectors by cosine similarity (or dot product). Choosing k is a trade-off: too low and you miss relevant chunks, too high and you flood the prompt with noise. A similarity threshold (e.g. discard anything below 0.75) can filter irrelevant results but may return nothing for out-of-distribution queries. Hybrid search combines dense (vector) search with sparse (BM25/keyword) search and merges results via Reciprocal Rank Fusion (RRF). This recovers exact-match queries that vector search misses ('order #12345', product codes, acronyms).",
      code: `// Hybrid search with Reciprocal Rank Fusion (pseudocode)
async function hybridSearch(query: string, topK = 8): Promise<Chunk[]> {
  const [vectorHits, keywordHits] = await Promise.all([
    vectorStore.similaritySearch(query, topK * 2),
    keywordIndex.search(query, topK * 2),
  ]);
  // RRF score = sum over each list of 1 / (rank + 60)
  const scores = new Map<string, number>();
  for (const [rank, hit] of vectorHits.entries())
    scores.set(hit.id, (scores.get(hit.id) ?? 0) + 1 / (rank + 60));
  for (const [rank, hit] of keywordHits.entries())
    scores.set(hit.id, (scores.get(hit.id) ?? 0) + 1 / (rank + 60));
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)
    .map(([id]) => chunkById.get(id)!);
}`,
      note: "Vector search alone fails on exact identifiers. A support-bot searching by ticket number returns garbage from pure cosine search. Hybrid search with RRF is now standard in production RAG. pgvector + pg_trgm, Elasticsearch, and Weaviate all support it natively.",
    },
    {
      title: "Re-ranking — cross-encoders and why they matter",
      explain:
        "The first retrieval stage is bi-encoder: the query and each chunk are embedded independently, then compared. This is fast but coarse — cosine similarity ignores token-level interaction between query and chunk. A cross-encoder takes the query and a candidate chunk as a pair and scores them jointly. It is 100–1000x slower but dramatically more accurate. The pattern: retrieve top-20 cheaply with bi-encoder, re-rank with cross-encoder, keep top-4. This lifts precision without paying cross-encoder cost on the whole index.",
      code: `// Re-ranking with Cohere (or equivalent)
import { CohereClient } from "cohere-ai";
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY! });

async function rerank(query: string, candidates: Chunk[], topN = 4): Promise<Chunk[]> {
  const res = await cohere.rerank({
    model: "rerank-english-v3.0",
    query,
    documents: candidates.map(c => c.text),
    topN,
  });
  return res.results.map(r => candidates[r.index]);
}`,
      note: "A Cohere/Jina re-ranker API call adds ~100ms and less than $0.001 per query at typical scales but can lift answer quality measurably. Almost every production RAG system at scale uses a two-stage retrieve-then-rerank setup.",
    },
    {
      title: "Prompt assembly, context-window budgeting, and 'lost in the middle'",
      explain:
        "Once you have your top-k re-ranked chunks, you assemble them into the LLM prompt. The total prompt must fit the model's context window minus space for the answer. Budget roughly: system prompt (200–500 tokens) + user question (50–200) + context chunks (remaining). Research ('Lost in the Middle', NeurIPS 2023) shows LLMs recall information at the beginning and end of the context well but miss facts buried in the middle. Counter-strategies: put the most relevant chunk first or last, or interleave with the question. Never silently truncate context — track token counts explicitly.",
      code: `import { encode } from "gpt-tokenizer";   // fast tiktoken port

const MAX_CONTEXT_TOKENS = 6000;

function buildPrompt(question: string, chunks: Chunk[]): string {
  const header = \`You are a helpful assistant. Answer using only the context below.\\n\\n\`;
  let context = "";
  let used = encode(header + question).length;
  for (const chunk of chunks) {
    const tokens = encode(chunk.text).length;
    if (used + tokens > MAX_CONTEXT_TOKENS) break;
    context += chunk.text + "\\n\\n---\\n\\n";
    used += tokens;
  }
  return \`\${header}Context:\\n\${context}Question: \${question}\`;
}`,
      note: "Token budgeting is not optional. Exceeding the context window either errors or silently truncates (depending on the API). Track used tokens at assembly time. A common pattern is to sort re-ranked chunks by score descending and fill greedily until the budget is consumed.",
    },
    {
      title: "Citations and grounding",
      explain:
        "Users and auditors need to know where an answer came from. The standard approach: include a `[chunk_id]` or `[source_url]` reference in the context, instruct the model to cite by that reference in its answer, then parse the citations out and render them as footnotes or links. Structured output (JSON mode) makes parsing reliable. Grounding also reduces hallucination: if the model is told to cite every claim and your evaluation catches uncited claims, it learns to stay within the context.",
      code: `const systemPrompt = \`
You are a helpful assistant. Answer using ONLY the provided context.
For every factual claim, cite the chunk ID in square brackets, e.g. [chunk-42].
If the context does not contain enough information, say "I don't know".
\`;

// Response example: "The refund window is 30 days [chunk-7]."
// Post-process: replace [chunk-7] with a <a href={sources[7].url}>source</a>`,
      note: "In regulated industries (healthcare, legal, finance) citation is a compliance requirement, not a nice-to-have. Store the exact chunk text and its source URL so every answer can be audited back to the original document.",
    },
    {
      title: "Evaluating RAG — the RAG Triad and tooling",
      explain:
        "Three metrics cover RAG quality end-to-end. Context Relevance: are the retrieved chunks actually about the question? Faithfulness (Groundedness): does the answer contain only information that is in the context — no hallucinated facts? Answer Relevance: does the answer actually address what the user asked? Together these are the RAG Triad (coined by TruLens / TruEra). Tools: TruLens, Ragas (open-source), and LangSmith all automate scoring these with an LLM-as-judge. Add them to your CI pipeline to catch regressions when you change chunking, embedding, or prompts.",
      code: `// Ragas evaluation (Python-adjacent pseudocode in TS spirit)
import { evaluate } from "ragas";   // hypothetical TS SDK

const dataset = [
  {
    question: "What is the refund policy?",
    answer: generatedAnswer,
    contexts: retrievedChunks.map(c => c.text),
    ground_truth: "Customers may request a refund within 30 days.",
  },
];

const scores = await evaluate(dataset, {
  metrics: ["context_relevancy", "faithfulness", "answer_relevancy"],
});
// scores: { context_relevancy: 0.82, faithfulness: 0.91, answer_relevancy: 0.88 }`,
      note: "RAG evaluation is the most overlooked part of building production systems. Teams iterate on retrieval and prompts by vibe until they add automated evals and discover their 'improvements' were regressions. Run evals on a golden Q&A set after every major change.",
    },
    {
      title: "Agentic / iterative RAG",
      explain:
        "Naive RAG does one retrieval pass. Agentic RAG adds a loop: the model retrieves, checks whether it has enough information, and retrieves again with a refined query if not. Variants include: Corrective RAG (grade retrieved docs, discard low-quality ones, re-retrieve or fall back to web search), Self-RAG (model generates retrieval tokens mid-generation), and multi-hop RAG (decompose a complex question into sub-questions, retrieve for each). These patterns handle questions that require synthesising multiple documents or clarifying a vague first query.",
      code: `async function agenticRAG(question: string, maxIter = 3): Promise<string> {
  let query = question;
  let allChunks: Chunk[] = [];
  for (let i = 0; i < maxIter; i++) {
    const newChunks = await retrieve(query);
    allChunks = deduplicate([...allChunks, ...newChunks]);
    const sufficient = await llm.json<{ enough: boolean; refinedQuery: string }>(\`
      Question: \${question}
      Context so far: \${allChunks.map(c => c.text).join("\\n")}
      Is the context sufficient to answer? If not, provide a better search query.
      Respond as JSON: {"enough": bool, "refinedQuery": "..."}
    \`);
    if (sufficient.enough) break;
    query = sufficient.refinedQuery;
  }
  return generateAnswer(question, allChunks);
}`,
      note: "Agentic RAG adds latency (multiple LLM and retrieval calls) but dramatically improves multi-hop question accuracy. Gate it behind complexity detection: simple factual questions go through single-pass RAG; questions with conjunctions, comparisons, or 'explain how X relates to Y' go agentic.",
    },
    {
      title: "Handling stale data — re-indexing strategies",
      explain:
        "Your vector store is a snapshot. As source documents are updated, deleted, or added, the index goes stale and answers degrade silently. Strategies: full re-index (simple, expensive, run nightly/weekly), incremental update (track a `last_modified` timestamp; re-chunk and re-embed only changed documents), event-driven (listen to a webhook or S3 event on every document change and update the affected chunks immediately). Always store chunk metadata including `sourceId`, `sourceUpdatedAt`, and `chunkVersion` so you can query and purge stale records. Soft-delete chunks belonging to a removed document.",
      code: `// Incremental update: only re-index modified documents
async function syncDocs(docs: Document[]): Promise<void> {
  for (const doc of docs) {
    // 1. Delete all existing chunks for this source
    await vectorStore.delete({ filter: { sourceId: doc.id } });
    // 2. Re-chunk and re-embed
    const chunks = splitter.split(doc.text, { sourceId: doc.id, updatedAt: doc.updatedAt });
    const embeddings = await embedder.embedMany(chunks.map(c => c.text));
    await vectorStore.upsert(chunks.map((c, i) => ({ ...c, vector: embeddings[i] })));
  }
}`,
      note: "In large corpora (millions of chunks) full re-index can take hours. Event-driven incremental sync keeps the index fresh in seconds. Track sync lag as a metric — if the median chunk age exceeds your SLA, alert. Tools like LlamaIndex and LangChain have built-in document managers that handle incremental sync.",
    },
  ],
  interviewQs: [
    {
      q: "What is RAG and why use it instead of fine-tuning?",
      a: "RAG injects retrieved, up-to-date context into the prompt at inference time. Fine-tuning bakes knowledge into weights, which is slow and expensive to update. Use RAG when data changes frequently, when you need citations, or when the facts are proprietary. Use fine-tuning when you need to change how the model reasons or writes, not what it knows. Most production systems start with RAG and only add fine-tuning if behaviour quality is lacking.",
    },
    {
      q: "Walk me through the full RAG pipeline.",
      a: "Offline: load documents, chunk them (e.g. recursive splitter, 512 tokens, 10% overlap), embed each chunk (same model for query and corpus), upsert vectors + metadata into a vector store. Online: embed the user query, run top-k similarity search (often hybrid: vector + BM25), re-rank with a cross-encoder, assemble a prompt within the token budget (most relevant chunk first), call the LLM with an instruction to cite chunk IDs, return the answer with source links.",
    },
    {
      q: "How would you choose chunk size and overlap?",
      a: "Start with 512 tokens and 10% overlap as a baseline. Smaller chunks (256) improve retrieval precision but lose sentence context. Larger chunks (1024) preserve more context per chunk but dilute the embedding signal. Overlap prevents a sentence at a boundary from being lost. Tune empirically: build a golden Q&A set, vary chunk size, measure Context Relevance with Ragas. Also ensure chunk size <= the embedding model's max input length.",
    },
    {
      q: "Why add a re-ranker if you already have vector search?",
      a: "Vector search uses bi-encoders: query and chunk are embedded independently, so their similarity is approximate. A cross-encoder scores the (query, chunk) pair jointly — it sees token-level interaction — and is far more accurate. It is too slow to run on the whole index, so the two-stage pattern is: retrieve top-20 cheaply with vector search, re-rank with cross-encoder, keep top-4. This lifts precision at low marginal cost.",
    },
    {
      q: "What is hybrid search and what problem does it solve?",
      a: "Hybrid search combines dense vector retrieval with sparse keyword (BM25) retrieval, merged via Reciprocal Rank Fusion. Vector search understands semantics but misses exact identifiers — order numbers, product codes, acronyms. BM25 excels at exact-match. Combining both handles both cases. RRF is the standard fusion formula: for each result list, add 1/(rank + 60) per document and sort by combined score.",
    },
    {
      q: "How do you evaluate a RAG system?",
      a: "Use the RAG Triad: Context Relevance (are retrieved chunks on-topic?), Faithfulness/Groundedness (does the answer contain only information from the context?), and Answer Relevance (does the answer address the question?). Tools like Ragas, TruLens, and LangSmith score these automatically using an LLM-as-judge. Build a golden Q&A dataset, run evals after every pipeline change, and track trends over time. Without evals, RAG changes are guesswork.",
    },
    {
      q: "How would you reduce hallucinations in a RAG system?",
      a: "First, improve retrieval so the relevant information is always in the context (better chunking, hybrid search, re-ranking). Second, in the system prompt explicitly instruct the model to answer only from the provided context and to say 'I don't know' if the answer is not there. Third, require citations — a model that must cite every claim is less likely to invent one. Fourth, score Faithfulness with Ragas/TruLens and alert when it drops below a threshold.",
    },
    {
      q: "What is 'lost in the middle' and how do you address it?",
      a: "'Lost in the Middle' (NeurIPS 2023) is the finding that LLMs recall information from the beginning and end of a long context well but miss facts in the middle. Mitigations: place the most relevant chunk first (or first and last), limit the number of chunks to only what fits comfortably (don't fill the whole context window with noise), or use a model with proven long-context recall (Gemini 1.5 Pro, Claude 3.5 with extended context).",
    },
    {
      q: "How do you keep a RAG index fresh as documents change?",
      a: "Three patterns: (1) Full re-index on a schedule — simple but slow and costly for large corpora. (2) Incremental: track `last_modified` per document, delete and re-embed only changed documents. (3) Event-driven: listen to S3/webhook events on document changes and update immediately. Always store `sourceId` and `updatedAt` in chunk metadata so you can purge stale chunks. Track 'median chunk age' as a freshness metric and alert when it exceeds your SLA.",
    },
    {
      q: "What is agentic RAG and when would you use it?",
      a: "Agentic RAG adds a loop: retrieve, have the model judge whether the context is sufficient, and if not, generate a refined query and retrieve again. Use it for multi-hop questions that require synthesising multiple documents or for vague initial queries. The cost is latency (2–3 LLM calls). Gate it behind complexity detection: simple factoid questions use single-pass RAG; comparative or multi-step questions go agentic.",
    },
    {
      q: "How do you handle context-window limits when retrieved content is too large?",
      a: "Budget explicitly: track token counts as you add chunks and stop when you hit your limit (total window minus space for the system prompt and expected answer). Sort chunks by re-ranker score descending and fill greedily — the lowest-scoring chunks are dropped first. As a fallback, summarise the least-relevant chunks before including them. Never silently truncate; log when truncation occurs so you can tune retrieval precision.",
    },
  ],
  build: [
    "Build a personal document Q&A bot: ingest a set of PDF/markdown files with recursive chunking, store in a local vector DB (e.g. Chroma or pgvector), implement hybrid search with RRF, and serve a chat endpoint that returns answers with source citations.",
    "Add a Ragas evaluation harness to an existing RAG system: create a 20-question golden dataset, score Context Relevance, Faithfulness, and Answer Relevance, then experiment with chunk size (256/512/1024) and report which improves the triad.",
    "Implement a two-stage retrieve + re-rank pipeline using an open embedding model (BGE-M3 or Cohere embed-v4) for retrieval and a cross-encoder (Cohere rerank or ms-marco-MiniLM) for re-ranking; measure precision@4 before and after the re-ranker.",
    "Build an incremental re-indexing service: watch a folder for file changes (using chokidar or an S3 event), delete and re-upsert only the affected document's chunks, and log chunk-age statistics to verify freshness SLAs.",
  ],
  pitfalls: [
    "Using the same chunk size for all document types — short FAQ answers and long technical manuals need different chunk sizes. Tune per document type.",
    "Skipping the re-ranker to save latency — the quality drop from bi-encoder-only retrieval is measurable in evals. A 100ms cross-encoder call is almost always worth it.",
    "Forgetting to store chunk metadata (sourceId, sourceUrl, updatedAt) — without it you cannot show citations, audit answers, or run incremental re-indexing.",
    "Treating retrieved chunks as trusted — the model must be explicitly instructed to stay within the context and cite. Without that instruction, models confidently blend retrieved facts with hallucinated ones.",
    "Never running evals after changing chunking or prompts — iterating without a RAG Triad score means you cannot tell whether changes helped or hurt.",
  ],
  resources: [
    { label: "LangChain RAG tutorial (official)", url: "https://python.langchain.com/docs/tutorials/rag/" },
    { label: "LlamaIndex RAG guide", url: "https://docs.llamaindex.ai/en/stable/understanding/rag/" },
    { label: "Ragas — RAG evaluation framework", url: "https://docs.ragas.io/en/stable/" },
    { label: "\"Lost in the Middle\" paper (NeurIPS 2023)", url: "https://arxiv.org/abs/2307.03172" },
    { label: "Cohere re-rank API docs", url: "https://docs.cohere.com/docs/reranking" },
    { label: "MTEB leaderboard — embedding model benchmarks", url: "https://huggingface.co/spaces/mteb/leaderboard" },
  ],
  checklist: [
    "Explain RAG vs fine-tuning and give a concrete example of when you would choose each",
    "Describe all stages of the full RAG pipeline from document ingest to answer generation",
    "Implement recursive character chunking with configurable size and overlap",
    "Build a hybrid search function combining vector and BM25 results with Reciprocal Rank Fusion",
    "Add a cross-encoder re-ranker stage and explain why it improves over bi-encoder alone",
    "Write a token-budget-aware prompt assembly function that never silently truncates context",
    "Score a RAG system on the RAG Triad (Context Relevance, Faithfulness, Answer Relevance) using Ragas",
    "Implement incremental re-indexing that deletes and re-embeds only changed documents",
    "Explain 'lost in the middle' and at least two strategies to mitigate it",
  ],
};
