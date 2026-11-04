export const AREA_IDS = [
  'retrieval-rag',
  'knowledge-graphs',
  'ai-agents',
  'agentic-systems',
  'ml-foundations',
  'generative-vision',
  'ml-infrastructure',
] as const;

export type AreaId = (typeof AREA_IDS)[number];

export interface Area {
  id: AreaId;
  label: string;
  /** The key-skills line shown under the area. */
  caption: string;
  color: { dark: string; light: string };
}

export const AREAS: Area[] = [
  { id: 'retrieval-rag', label: 'Retrieval & RAG', caption: 'hybrid search · re-ranking · benchmarking', color: { dark: '#7ea2ff', light: '#2557d6' } },
  { id: 'knowledge-graphs', label: 'Knowledge graphs', caption: 'Neo4j · GraphRAG · graph modelling', color: { dark: '#f2b45c', light: '#a35f00' } },
  { id: 'ai-agents', label: 'AI agents', caption: 'customer support · voice · coding', color: { dark: '#5fd4c4', light: '#0d7f72' } },
  { id: 'agentic-systems', label: 'Agentic systems & evaluation', caption: 'eval harnesses · text-to-SQL · ranking', color: { dark: '#a5d66b', light: '#3f7a17' } },
  { id: 'ml-foundations', label: 'AI/ML foundations', caption: 'deep learning · classical ML · fine-tuning', color: { dark: '#d1a57c', light: '#8c5a2b' } },
  { id: 'generative-vision', label: 'Generative vision research', caption: 'StyleGAN · CLIP · image editing', color: { dark: '#f27ca8', light: '#b8285f' } },
  { id: 'ml-infrastructure', label: 'ML infrastructure', caption: 'model serving · Kubernetes · scaling', color: { dark: '#9aa3b5', light: '#556070' } },
];

export const areaLabel = (id: AreaId) => AREAS.find((a) => a.id === id)?.label ?? id;
