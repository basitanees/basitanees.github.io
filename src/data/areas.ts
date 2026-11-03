export const AREA_IDS = [
  'retrieval-search',
  'ai-agents',
  'knowledge-graphs',
  'generative-models',
  'llm-systems',
  'mlops-cloud',
] as const;

export type AreaId = (typeof AREA_IDS)[number];

export const AREAS: { id: AreaId; label: string; caption: string }[] = [
  { id: 'retrieval-search', label: 'Retrieval & search', caption: 'vector + hybrid search · re-ranking · evaluation' },
  { id: 'ai-agents', label: 'AI agents', caption: 'coding agent · agent memory · tools' },
  { id: 'knowledge-graphs', label: 'Knowledge graphs', caption: 'Neo4j · graph modelling · Cypher' },
  { id: 'generative-models', label: 'Generative models', caption: 'StyleGAN · CLIP · text-driven image editing' },
  { id: 'llm-systems', label: 'LLM systems', caption: 'structured output · eval harnesses · text-to-SQL' },
  { id: 'mlops-cloud', label: 'MLOps & cloud', caption: 'Kubernetes · CI/CD · tracing' },
];

export const areaLabel = (id: AreaId) => AREAS.find((a) => a.id === id)?.label ?? id;
