import type { Module } from "@/data/learn/types";
import { getModuleMeta } from "@/data/learn/meta";

const meta = getModuleMeta("vector-dbs")!;

export const learnModule: Module = {
  ...meta,
  simple:
    "Imagine you store every document as a list of numbers — a vector — where similar meanings end up close together in space. A vector database stores those lists and finds the nearest ones to your query in milliseconds, even across billions of records. That is the engine under every semantic search, RAG chatbot, and recommendation feed you have used.",
  concepts: [
    {
      title: "What an embedding is",
      explain:
        "An embedding converts a piece of text (or an image, audio clip, etc.) into a fixed-length list of floating-point numbers — a vector. The key property is that semantically similar inputs land close to each other in that high-dimensional space. 'King' and 'Queen' end up near each other; 'car' and 'automobile' do too. The model has learned, from billions of training examples, which meanings cluster together. The output is just an array of floats — you can store, compare, and index it like any other data.",
      code: `import OpenAI from "openai";

const client = new OpenAI();

async function embed(text: string): Promise<number[]> {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding; // 1 536-dimensional float array
}

const vec = await embed("How do I reset my password?");
console.log(vec.length); // 1536`,
      note: "The same embedding model must be used at write time (indexing) and query time. Mixing models — even different versions of the same model — produces vectors in incompatible spaces, silently returning garbage results in production.",
    },
    {
      title: "The embedding model's role",
      explain:
        "The embedding model is the bridge between raw text and the vector space. Different models produce vectors of different dimensionality (384 for MiniLM, 1 536 for text-embedding-3-small, 3 072 for text-embedding-3-large) and capture different aspects of meaning. Larger dimension usually means richer representation but higher storage, compute, and latency cost. OpenAI's text-embedding-3-* models support 'dimensions' truncation — you can request a shorter vector and sacrifice minimal accuracy for a big storage saving.",
      code: `// Request a reduced-dimension embedding for cheaper storage
const res = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: "Explain transformer architecture",
  dimensions: 512, // truncated from 1536
});
// Useful when you need to cut index size by 66 % with <5 % quality loss`,
      note: "In high-throughput systems, embedding cost dominates — both latency and API dollars. Cache embeddings aggressively: if the same chunk appears in multiple documents, embed it once and reuse the vector.",
    },
    {
      title: "Similarity metrics — cosine, dot product, euclidean",
      explain:
        "Once you have two vectors you need a number that measures how similar they are. Cosine similarity measures the angle between vectors, ignoring magnitude — good when vectors may have varying norms. Dot product (inner product) is cosine × magnitude product — faster to compute but sensitive to vector length, so only use it with normalised vectors. Euclidean distance measures straight-line distance in space — intuitive but less popular for text because high-dimensional spaces behave oddly (curse of dimensionality). Rule of thumb: use cosine or dot-product with L2-normalised vectors; they are equivalent and give the best recall for text embeddings.",
      code: `function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na  += a[i] * a[i];
    nb  += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb)); // -1 .. 1, higher = more similar
}

function normalize(v: number[]): number[] {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return v.map(x => x / norm);
}
// After normalising, dot product === cosine similarity`,
      note: "Most managed vector stores (Pinecone, Qdrant) normalise vectors at upsert time when you choose cosine distance, so you rarely implement this manually. But understanding it is critical for interview questions about why cosine beats euclidean for text.",
    },
    {
      title: "Curse of dimensionality and why exact search is slow",
      explain:
        "In high-dimensional spaces (1 000+ dimensions), almost every pair of vectors is equally far apart — the familiar geometric intuition breaks down. More practically: an exact nearest-neighbour search over 10 million 1 536-dim vectors requires comparing your query to every stored vector, doing billions of multiply-adds per query. At 100 ms per million comparisons, 100 M vectors takes 10 seconds — completely unacceptable for real-time search. This is why approximate nearest-neighbour (ANN) algorithms exist.",
      note: "Exact (brute-force) search is fine during prototyping with < 100 k vectors — pgvector's flat index or Qdrant's exact mode will do. The moment you cross ~1 M vectors and need sub-100 ms latency, you must switch to an ANN index.",
    },
    {
      title: "Approximate Nearest Neighbour (ANN) search",
      explain:
        "ANN algorithms trade a small amount of accuracy (recall) for a massive speed gain. Instead of comparing the query to every vector, they build a data structure at index time that lets them skip most of the comparisons at query time. The key metric is recall@k — what fraction of the true top-k results appear in the ANN's returned top-k. A well-tuned ANN can achieve 95–99 % recall at 10–100× the speed of exact search.",
      note: "The recall/latency/memory triangle is the central engineering tradeoff in vector search. Higher recall → more graph edges to traverse (HNSW) or more clusters to probe (IVF) → higher latency or memory. Always benchmark with your actual data distribution.",
    },
    {
      title: "Index types — HNSW, IVF, flat",
      explain:
        "HNSW (Hierarchical Navigable Small World) builds a layered graph where each node connects to its nearest neighbours. At query time you traverse from a coarse top layer down to a dense bottom layer, following the closest neighbours at each hop. HNSW gives excellent recall (> 95 %) at low latency but is memory-intensive — all edges must fit in RAM. IVF (Inverted File Index) clusters vectors into Voronoi cells at index time; at query time only the nearest N cells are probed, reducing comparisons dramatically. IVF uses less memory than HNSW but needs more data to build good clusters (typically ≥ 10× k training vectors). Flat (brute-force) is exact search with no index — fine for < 100 k vectors or as a ground-truth baseline.",
      code: `// Qdrant: create a collection with HNSW index (default)
import { QdrantClient } from "@qdrant/js-client-rest";

const qdrant = new QdrantClient({ url: "http://localhost:6333" });

await qdrant.createCollection("docs", {
  vectors: {
    size: 1536,
    distance: "Cosine",
    // hnsw_config can tune m (graph edges) and ef_construct (build quality)
    hnsw_config: { m: 16, ef_construct: 100 },
  },
});`,
      note: "In production HNSW is the default choice (Pinecone, Qdrant, Weaviate all use it). The key knobs are m (edges per node — higher = better recall, more memory) and ef_construct (build-time search width — higher = better quality index, slower ingestion). These are set once at collection creation; re-indexing to change them is expensive.",
    },
    {
      title: "Chunking text before embedding",
      explain:
        "Embedding models have a token limit (8 191 tokens for text-embedding-3-*). More importantly, embedding quality degrades when you pack too much text into one vector — the representation becomes an average of many ideas and retrieves poorly for specific questions. The standard approach is to split documents into overlapping chunks of 256–512 tokens with a 10–20 % overlap, so that context near chunk boundaries is not lost. Chunk size is a hyperparameter you tune: smaller chunks give more precise retrieval but more vectors to store and rank; larger chunks give more context per result but coarser matching.",
      code: `// Simple recursive character splitter (pseudocode — use LangChain/LlamaIndex in practice)
function chunk(text: string, size = 400, overlap = 80): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + size, words.length);
    chunks.push(words.slice(start, end).join(" "));
    start += size - overlap;
  }
  return chunks;
}`,
      note: "Chunk boundaries that cut mid-sentence hurt retrieval quality. Use sentence-aware splitters (LangChain's RecursiveCharacterTextSplitter, LlamaIndex's SentenceSplitter) that respect paragraph and sentence boundaries before falling back to character-level splits.",
    },
    {
      title: "Storing vectors with metadata and filtering",
      explain:
        "Every vector you store should carry metadata — the source document ID, URL, author, date, tags, tenant ID, etc. Metadata serves two purposes: (1) return a useful result payload without a second DB lookup; (2) enable pre- or post-filter queries. A metadata filter restricts the ANN search to a subset of vectors before (pre-filter) or after (post-filter) the k-NN step. Pre-filtering is more accurate but harder to implement in HNSW (Qdrant does it via payload indexes); post-filtering is simpler but can return fewer than k results when the filtered set is small.",
      code: `// Qdrant: upsert vectors with metadata payload
await qdrant.upsert("docs", {
  wait: true,
  points: chunks.map((text, i) => ({
    id: \`doc-\${docId}-chunk-\${i}\`,
    vector: await embed(text),
    payload: {
      text,
      sourceUrl: doc.url,
      tenantId: doc.tenantId,
      createdAt: doc.createdAt,
    },
  })),
});

// Query with a metadata filter (only this tenant's docs)
const results = await qdrant.search("docs", {
  vector: await embed(query),
  limit: 5,
  filter: { must: [{ key: "tenantId", match: { value: currentTenantId } }] },
});`,
      note: "Multi-tenant RAG systems must filter by tenant at the vector store layer, not just in application code. Forgetting this means one tenant's query can surface another tenant's documents — a serious data-leakage bug.",
    },
    {
      title: "Hybrid search — BM25 + vector and why it wins",
      explain:
        "Pure semantic (vector) search excels at meaning-based retrieval but misses exact keyword matches — a query for 'GPT-4o' might not surface documents that contain that exact string if the embedding model generalises over it. BM25 (the algorithm behind Elasticsearch / Solr) excels at exact keyword and rare-term matching but misses paraphrases. Hybrid search runs both in parallel and fuses the ranked lists, typically with Reciprocal Rank Fusion (RRF) or a learned re-ranker. In every published benchmark (BEIR, MTEB) hybrid outperforms either alone by 5–15 % NDCG, especially on domain-specific terminology.",
      code: `// Conceptual hybrid search with RRF (alpha blends BM25 rank and vector rank)
function rrfScore(rankBm25: number, rankVec: number, k = 60): number {
  return 1 / (k + rankBm25) + 1 / (k + rankVec);
}

// Qdrant supports hybrid search natively via sparse + dense vector fusion:
// dense vector  → semantic similarity
// sparse vector → BM25 / SPLADE keyword signal
// Both stored in the same point, fused at query time with RRF or dbsf`,
      note: "Hybrid search is now table-stakes for production RAG. Qdrant's sparse+dense support, Weaviate's BM25+vector, and Elasticsearch's reciprocal-rank-fusion endpoint all expose this without building two separate pipelines. Budget for a keyword index from day one.",
    },
    {
      title: "Choosing a vector store — pgvector vs Pinecone vs Qdrant vs Weaviate",
      explain:
        "pgvector extends PostgreSQL with a vector column type and HNSW/IVF indexes. Use it when you already run Postgres and your scale fits one node (< 10 M vectors, < 10 ms latency target). Pinecone is a fully managed, serverless vector DB — zero ops, auto-scaling, pay-per-query — ideal when you need to ship fast and do not want to manage infrastructure. Qdrant is open-source, written in Rust, with best-in-class filtering, native sparse+dense hybrid search, and strong multi-tenancy. Weaviate adds a GraphQL API, built-in vectorisation modules, and generative search. All four support HNSW and metadata filtering; the choice usually comes down to existing infra (Postgres → pgvector), managed vs self-hosted, and advanced filter/hybrid requirements (Qdrant).",
      note: "For a new production RAG system in 2026: start with pgvector if Postgres is already in the stack; migrate to Qdrant or Pinecone when you cross ~5 M vectors or need sub-10 ms P99 at high QPS. Never prematurely optimise away from Postgres.",
    },
    {
      title: "Scaling — sharding, quantization, and replication",
      explain:
        "When your index outgrows a single node you have two levers. Sharding partitions the vector space across multiple nodes; queries fan out to all shards and results are merged. Quantization compresses each float32 dimension (4 bytes) to int8 (1 byte) or even binary (1 bit) via scalar or product quantization, shrinking memory 4–32× at a 1–5 % recall cost. Qdrant and Weaviate support both natively. Replication adds read replicas for higher QPS without affecting recall. For most teams, quantization should be the first scaling move — it is free latency and memory without touching architecture.",
      code: `// Qdrant: enable scalar quantization at collection creation
await qdrant.createCollection("docs-scaled", {
  vectors: { size: 1536, distance: "Cosine" },
  quantization_config: {
    scalar: {
      type: "int8",
      quantile: 0.99, // clip outliers before quantising
      always_ram: true,  // keep quantised index in RAM for fast search
    },
  },
  // For sharding across a Qdrant cluster:
  // shard_number: 4,
  // replication_factor: 2,
});`,
      note: "Product quantization (PQ) compresses further than scalar quantization but requires a training phase over a representative sample of your data. Use scalar quantization first; only move to PQ if you need > 4× memory reduction and can tolerate the training pipeline complexity.",
    },
    {
      title: "Normalisation of vectors",
      explain:
        "L2 normalisation scales a vector so its magnitude (Euclidean norm) equals 1. After normalisation, dot-product similarity equals cosine similarity, which is convenient because dot product is faster to compute (no square roots). Most embedding APIs return unit-normalised vectors by default, but always verify. If you store raw, non-normalised vectors and then query with cosine distance, most vector stores handle the normalisation internally — but if you compute similarity yourself (e.g. in pgvector's `<->` vs `<=>` operator) you need to know which metric your index was built with.",
      code: `// pgvector: use the right operator for the right metric
// <=> cosine distance (built-in normalisation)
// <#> negative inner product (use with pre-normalised vectors for speed)
// <->  euclidean distance

-- Create an HNSW index using cosine distance
CREATE INDEX ON docs USING hnsw (embedding vector_cosine_ops);

-- Query: 5 nearest by cosine similarity
SELECT id, content, 1 - (embedding <=> $1) AS score
FROM docs
ORDER BY embedding <=> $1
LIMIT 5;`,
      lang: "sql",
      note: "In pgvector, `<=>` is cosine distance (0 = identical, 2 = opposite). Subtract from 1 to get similarity. The HNSW index must be created with the same operator class you use at query time — mixing them disables index use and silently falls back to a sequential scan.",
    },
  ],
  interviewQs: [
    {
      q: "What is an embedding, and why does it let us do semantic search?",
      a: "An embedding is a fixed-length vector of floats produced by a neural model from a piece of text (or other modality). The model is trained so that semantically similar inputs produce vectors that are close in the high-dimensional space (high cosine similarity). Semantic search works by embedding the query with the same model, then finding stored vectors with the highest similarity — returning results that mean the same thing even if they use different words.",
    },
    {
      q: "Why can't we just do exact nearest-neighbour search at scale?",
      a: "Exact search requires comparing the query vector against every stored vector — O(n × d) operations where n is the number of vectors and d is the dimension. At 100 M vectors × 1 536 dimensions, that is ~150 billion multiply-adds per query, taking seconds even on modern hardware. ANN algorithms pre-build a data structure (graph, inverted file) that lets the search skip the vast majority of comparisons, achieving sub-millisecond latency at the cost of a small, tunable recall drop.",
    },
    {
      q: "How does HNSW work at a high level?",
      a: "HNSW builds a multi-layer graph. The bottom layer contains all vectors, each connected to its m nearest neighbours. Higher layers contain exponentially fewer nodes and act as 'express lanes'. At query time, search starts at the top layer and greedily follows the closest neighbour, descending to lower layers until it reaches the bottom. This greedy graph traversal approximates the true nearest neighbours in O(log n) hops instead of O(n) comparisons. The key parameters are m (edges per node — controls recall and memory) and ef_construct/ef_search (search width — controls build quality and query recall).",
    },
    {
      q: "Cosine similarity vs dot product — when do you use each?",
      a: "Dot product is mathematically cosine × magnitude product. If all vectors are L2-normalised (magnitude = 1) they are equivalent, and dot product is preferred because it is faster (no normalisation step). Use cosine when vectors may have varying magnitudes (e.g., raw TF-IDF vectors). For text embeddings from APIs like OpenAI, vectors are returned normalised, so dot product and cosine give identical rankings — most vector stores default to cosine for clarity.",
    },
    {
      q: "What is hybrid search and why does it outperform pure vector search?",
      a: "Hybrid search fuses a semantic (vector) ranking with a keyword (BM25) ranking, typically via Reciprocal Rank Fusion. Vector search excels at paraphrase and concept matching but can miss exact rare terms or product codes. BM25 excels at exact keyword matches but misses meaning. Fusion consistently scores 5–15 % higher NDCG on standard benchmarks (BEIR) because real queries mix both needs — 'reset password' (semantic) alongside 'GPT-4o API error 429' (keyword).",
    },
    {
      q: "How do you pick chunk size when splitting documents for a RAG system?",
      a: "The chunk size controls the granularity of retrieval. Smaller chunks (128–256 tokens) give precise matches but lose surrounding context and produce more vectors. Larger chunks (512–1 024 tokens) give more context per result but dilute the embedding signal. Common starting point: 400 tokens with 10–15 % overlap. Tune empirically: run your question set against the index and measure retrieval recall at different sizes. For structured data (FAQs, code), split on semantic boundaries (question-answer pairs, function definitions) rather than fixed token counts.",
    },
    {
      q: "What is quantization in the context of vector databases?",
      a: "Quantization compresses vector components from float32 (4 bytes each) to a smaller representation — int8 (1 byte, scalar quantization, 4× savings) or binary (1 bit per dimension, 32× savings). This reduces RAM usage and speeds up distance computations at a small recall cost (typically < 5 % for int8). It is the first scaling lever to pull because it requires no architectural change — just a configuration flag at collection creation.",
    },
    {
      q: "Explain the recall vs latency tradeoff in ANN indexes.",
      a: "Both HNSW and IVF expose parameters that trade recall for speed. In HNSW, ef_search controls how wide the graph traversal is at query time — higher ef_search checks more candidates, improving recall but increasing latency. In IVF, nprobe controls how many clusters are probed — more probes, higher recall, higher latency. You pick the minimum ef_search/nprobe that meets your recall target (e.g. recall@10 ≥ 0.95) within your latency budget. Always measure both on a representative sample of your production query distribution.",
    },
    {
      q: "When would you choose pgvector over Pinecone or Qdrant?",
      a: "pgvector if: you already run Postgres, your scale is under ~5–10 M vectors, you want ACID transactions alongside vector search, and your team does not want a new operational dependency. Pinecone if: you want fully managed, serverless, zero-ops infrastructure and are willing to pay per-query. Qdrant if: you need strong metadata filtering, multi-tenant isolation, native sparse+dense hybrid search, or you want an open-source self-hosted solution with best-in-class Rust performance.",
    },
    {
      q: "What metadata should you store alongside each vector, and why does tenantId matter?",
      a: "At minimum: source document ID/URL (to return a citation), chunk text (so you do not need a round-trip to retrieve it), and any filter fields your queries need (tenant ID, date, category). The tenant ID is critical in multi-tenant SaaS — you must filter by it in every vector search, not just at the application layer. Forgetting to include it in every ANN query can return one tenant's private documents to another tenant.",
    },
    {
      q: "What is the difference between pre-filtering and post-filtering in vector search?",
      a: "Pre-filtering restricts the candidate set before the ANN search runs — only vectors matching the filter are considered. This is more accurate (the ANN searches within the right subset) but harder to implement efficiently in graph-based indexes like HNSW; Qdrant handles it via payload indexes. Post-filtering runs the ANN over all vectors and then drops results that fail the filter — simpler to implement but can return fewer than k results if the filter is selective, requiring over-fetching (ask for 5× k, filter, return k).",
    },
  ],
  build: [
    "Build a document Q&A chatbot: ingest a PDF, chunk it, embed each chunk with OpenAI text-embedding-3-small, store in Qdrant with metadata, and answer questions by retrieving the top-5 chunks and passing them as context to GPT-4o.",
    "Implement hybrid search: index the same document corpus in both Qdrant (dense vectors) and a simple BM25 index (e.g. using the 'bm25' npm package), then fuse the results with Reciprocal Rank Fusion and compare retrieval quality against pure vector search.",
    "Benchmark HNSW recall vs latency: load 500 k vectors into Qdrant, sweep ef_search from 16 to 512, record recall@10 (against brute-force ground truth) and P99 query latency, and plot the Pareto frontier.",
    "Build a multi-tenant RAG API: embed and store documents from multiple tenants in a single Qdrant collection using a tenantId payload field; ensure every search query filters by the authenticated user's tenantId and write a test that proves cross-tenant leakage is impossible.",
  ],
  pitfalls: [
    "Using different embedding models at indexing and query time — vectors live in incompatible spaces and results look plausible but are semantically random. Pin the model name and version in a config constant and log a warning if they ever diverge.",
    "Skipping chunking and embedding entire documents — a single vector cannot represent a long document well; specific questions retrieve the wrong document because the embedding averages too many topics. Always chunk before embedding.",
    "Ignoring metadata filtering for multi-tenant data — without a tenantId filter on every query, one user can retrieve another user's private documents. This is a data-leakage bug, not just a relevance issue.",
    "Choosing chunk size once and never tuning it — retrieval quality is sensitive to chunk size and overlap. Always run a retrieval evaluation (e.g. RAGAS, LlamaIndex's RetrieverEvaluator) before deploying, and re-tune if domain or query distribution changes.",
    "Neglecting re-ranking — the top-k from an ANN search is approximate and ordered by embedding similarity, not by answer quality. Adding a cross-encoder re-ranker (Cohere Rerank, Jina Reranker) as a second pass dramatically improves the final top-3 passed to the LLM.",
  ],
  resources: [
    {
      label: "OpenAI Embeddings guide",
      url: "https://platform.openai.com/docs/guides/embeddings",
    },
    {
      label: "pgvector — Postgres extension for vector similarity search",
      url: "https://github.com/pgvector/pgvector",
    },
    {
      label: "Qdrant documentation",
      url: "https://qdrant.tech/documentation/",
    },
    {
      label: "Pinecone documentation",
      url: "https://docs.pinecone.io/",
    },
    {
      label: "Weaviate vector database docs",
      url: "https://weaviate.io/developers/weaviate",
    },
    {
      label: "HNSW paper — 'Efficient and Robust Approximate Nearest Neighbor Search' (Malkov & Yashunin)",
      url: "https://arxiv.org/abs/1603.09320",
    },
  ],
  checklist: [
    "Explain what an embedding is and why similar texts produce nearby vectors",
    "Describe cosine similarity, dot product, and euclidean distance and when to use each",
    "Explain how HNSW works and what the m and ef_search parameters control",
    "Implement chunking with overlap and justify a chunk-size choice for a given use case",
    "Store vectors with metadata and write a filtered ANN query in Qdrant or pgvector",
    "Explain hybrid search (BM25 + vector + RRF) and why it outperforms either alone",
    "Enable scalar quantization on a collection and explain the recall/memory tradeoff",
    "Choose between pgvector, Pinecone, and Qdrant for a given production scenario and justify the decision",
    "Describe a multi-tenant vector search architecture that prevents cross-tenant data leakage",
  ],
};
