import type { AreaId } from './areas';

/**
 * The knowledge graph's content. Rewrite freely: labels, descriptions, which projects sit
 * under which entry, and the dashed "related" links. Projects are named by their Markdown
 * file in src/content/projects/. An entry marked draft with nothing in it is not shown.
 * Every string here must pass the site guard (tests/unit/graph.test.mjs checks it).
 */
export interface GraphEntry {
  id: string;
  label: string;
  desc?: string;
  projects?: string[];
  items?: GraphEntry[];
  draft?: boolean;
}

export const GRAPH: Record<AreaId, GraphEntry[]> = {
  'retrieval-rag': [
    { id: "prodrag", label: "Production RAG architecture", desc: "Architecting production RAG pipelines built to scale: multi-tenant indexes, multi-query and grouped search, and provenance on every result so agents can cite their evidence.", projects: ["air-retrieval-service"] },
    { id: "hybrid", label: "Hybrid search", desc: "Vector, BM25 and hybrid search, with per-collection field schemas and metadata filters.", projects: ["air-retrieval-service"] },
    { id: "rerank", label: "Re-ranking", desc: "Two-stage re-ranking: the best documents first, then the best passages inside them, with listwise judging from my EACL 2026 work.", projects: ["air-retrieval-service"] },
    { id: "parse", label: "Parsing & chunking", desc: "Layout parsing that turns PDFs and documents into structured chunks, with reading-order and neighbouring-chunk retrieval so split answers arrive whole.", projects: ["document-ingestion"] },
    { id: "embed", label: "Embeddings", desc: "Several embedding models, and context-aware embeddings so each passage is read as part of its whole document.", projects: ["air-retrieval-service", "document-ingestion"] },
    { id: "bench", label: "Benchmarking", desc: "Every retrieval change is benchmarked against production on recall, latency and cost before it ships, including generating the evaluation datasets.", projects: ["air-retrieval-service", "document-ingestion"] },
  ],
  'knowledge-graphs': [
    { id: "graphrag", label: "GraphRAG", desc: "Retrieval over knowledge graphs, and graph and vector search behind one SDK layer (IndexFactory).", projects: ["knowledge-graphs", "air-retrieval-service"] },
    { id: "neo4j", label: "Neo4j & Cypher", desc: "Loading graphs from source data and querying them with Cypher.", projects: ["knowledge-graphs"] },
    { id: "gmodel", label: "Graph modelling", desc: "Designing graph data models: the entities, the relationships and the metadata on them.", projects: ["knowledge-graphs", "agent-memory"] },
    { id: "central", label: "Graph centrality", desc: "Graph algorithms that find the important nodes in a graph.", projects: ["bridgerank-implementation"] },
  ],
  'ai-agents': [
    { id: "support", label: "Customer support agents", desc: "Customer-service agents that answer from a client's own data, including a voice agent I built end to end.", projects: ["voice-agent"] },
    { id: "voice", label: "Voice agents", desc: "A call center studio for building voice agents.", projects: ["voice-agent"] },
    { id: "coding", label: "Coding agents", desc: "Koder, aiXplain's coding agent.", projects: ["koder"] },
    { id: "memory", label: "Memory", desc: "Structured, versioned memory that agents write and read back across sessions.", projects: ["agent-memory"] },
    { id: "frameworks", label: "Agent frameworks", desc: "aiXplain's agents framework, and agent pipelines with LangGraph, LangChain and CrewAI.", projects: ["agents-framework"] },
  ],
  'agentic-systems': [
    { id: "evalh", label: "Eval harnesses", desc: "Eval harnesses that turn live logs into new test cases, repeat each run, and check against a held-out set so prompt changes do not overfit.", projects: ["voice-agent", "candidate-assessment"] },
    { id: "jev", label: "Decision models (Jev)", desc: "TypeSafe AI's Jev decision model, used in re-ranking to pick the best documents and then the best passages inside them, judging against the user's original question and the documents' metadata.", projects: ["air-retrieval-service"] },
    { id: "listwise", label: "Listwise ranking", desc: "An active listwise tournament that ranks candidates with far fewer comparisons. Published at EACL 2026.", projects: ["candidate-assessment"] },
    { id: "sql", label: "Text-to-SQL", desc: "Agents that answer questions from structured data through SQL queries.", projects: ["voice-agent", "proofs-of-concept"] },
    { id: "structured", label: "Structured output", desc: "Validated structured output from LLMs, with retries and fallbacks.", projects: ["candidate-assessment", "proofs-of-concept"] },
  ],
  'ml-foundations': [
    { id: "dl", label: "Deep learning", desc: "Neural networks written from scratch since 2018, and in PyTorch and TensorFlow since 2020.",
      items: [
        { id: "dnn", label: "Deep neural networks", projects: ["ml-from-scratch", "restaurant-recommender"] },
        { id: "cnn", label: "CNNs", desc: "Convolutional networks for image classification and object detection." },
        { id: "rnn", label: "RNNs", projects: ["ml-from-scratch"] },
        { id: "transformers", label: "Transformers", projects: ["ml-from-scratch"] },
        { id: "dlgans", label: "GANs", projects: ["ml-from-scratch", "blockgan-implementation"] },
      ] },
    { id: "classical", label: "Classical ML", desc: "Classical algorithms written from scratch in Python.",
      items: [
        { id: "linlog", label: "Linear & logistic regression", projects: ["ml-from-scratch", "restaurant-recommender"] },
        { id: "knn", label: "K-nearest neighbours", projects: ["ml-from-scratch"] },
        { id: "svm", label: "Support vector machines", projects: ["ml-from-scratch"] },
        { id: "kmeans", label: "K-means clustering", projects: ["restaurant-recommender"] },
        { id: "mf", label: "Matrix factorisation", projects: ["restaurant-recommender"] },
      ] },
    { id: "finetune", label: "Fine-tuning", desc: "Fine-tuning audio models like Whisper, GANs and transformers.", projects: ["asr-and-model-deployment", "ml-from-scratch", "hypergan-clip", "clipinverter"],
      items: [
        { id: "ft-audio", label: "Audio models (Whisper)", desc: "Fine-tuning speech recognition models such as Whisper.", projects: ["asr-and-model-deployment"] },
      ] },
    { id: "courses", label: "Courses", draft: true, items: [] },
    { id: "cv", label: "Computer vision", desc: "CNNs, GANs and vision transformers, plus visual odometry, feature tracking and sensor fusion.", projects: ["visual-inertial-navigation"],
      items: [
        { id: "cv-cnn", label: "CNNs", desc: "Convolutional networks for image classification and object detection." },
        { id: "cv-gans", label: "GANs", desc: "Generative adversarial networks for image synthesis and editing.", projects: ["hypergan-clip", "clipinverter", "blockgan-implementation"] },
        { id: "cv-vit", label: "ViTs", desc: "Vision transformers for image understanding." },
      ] },
    { id: "gpu", label: "GPU computing", desc: "Parallel computation in CUDA.", projects: ["gpu-stencil"] },
  ],
  'generative-vision': [
    { id: "gans", label: "GANs & StyleGAN", desc: "Adapting and inverting StyleGAN for editing real photos.", projects: ["hypergan-clip", "clipinverter", "blockgan-implementation"] },
    { id: "clip", label: "CLIP", desc: "Using CLIP to guide generation and editing from text or a reference image.", projects: ["hypergan-clip", "clipinverter"] },
    { id: "editing", label: "Text-driven editing", desc: "Editing real photos from a free-form text description.", projects: ["hypergan-clip", "clipinverter"] },
  ],
  'ml-infrastructure': [
    { id: "serving", label: "Model serving", desc: "Deploying embedding models, re-rankers and LLMs.", projects: ["asr-and-model-deployment", "air-retrieval-service"],
      items: [
        { id: "vllm", label: "vLLM & SGLang", desc: "Serving embedding models, re-rankers and LLMs with vLLM and SGLang." },
        { id: "lb", label: "Custom load balancing", desc: "A custom policy that assigns embedding-model compute between search queries and ingestion." },
        { id: "multigpu", label: "Multi-GPU serving", desc: "Multi-GPU deployment with tensor parallelism and replicas." },
      ] },
    { id: "scaling", label: "Vector database scaling", desc: "Scaling the Qdrant service: multi-tenant collections, quantisation, capacity planning, and backup and restore.", projects: ["air-retrieval-service"] },
    { id: "k8s", label: "Kubernetes", desc: "Deploying and running services on Kubernetes (AWS EKS).", projects: ["air-retrieval-service", "asr-and-model-deployment"] },
    { id: "cicd", label: "CI/CD", desc: "CI/CD for aiR, Koder and the aiXplain SDK.", projects: ["air-retrieval-service", "koder"] },
    { id: "tracing", label: "Tracing", desc: "Datadog tracing across services to debug production issues end to end.", projects: ["air-retrieval-service"] },
  ],
};

/** Dashed links between entries in different areas. */
export const RELATED: [string, string][] = [
  ["rerank", "listwise"],
  ["jev", "rerank"],
  ["bench", "evalh"],
  ["embed", "clip"],
  ["memory", "gmodel"],
  ["support", "sql"],
  ["coding", "cicd"],
  ["hybrid", "graphrag"],
  ["voice", "serving"],
  ["dlgans", "gans"],
  ["prodrag", "scaling"],
];

/** Short graph labels where the project title is long, and which projects are papers. */
export const PROJECT_OVERRIDES: Record<string, { label?: string; paper?: boolean }> = {
  'bridgerank-implementation': { label: "BridgeRank" },
  'voice-agent': { label: "Voice agents & call center studio" },
  'candidate-assessment': { paper: true },
  'visual-inertial-navigation': { label: "Visual-inertial navigation" },
  'gpu-stencil': { label: "GPU stencil computation" },
  'differentiable-sorting': { label: "Differentiable sorting" },
  'hypergan-clip': { paper: true },
  'clipinverter': { paper: true },
  'blockgan-implementation': { label: "BlockGAN in Julia" },
  'asr-and-model-deployment': { label: "Speech recognition & deployment" },
};
