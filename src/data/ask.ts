export const ASK = [
  {
    id: 'agents',
    question: 'What do you build with agents?',
    answer: "A voice customer-service agent that answers from a client's data and keeps getting better from its own evals. I also developed Koder, aiXplain's coding agent.",
    href: '/areas/ai-agents/',
    linkLabel: 'See the agents work',
  },
  {
    id: 'evals',
    question: 'How do you evaluate agents?',
    answer: 'Live customer logs become new test cases, and each one runs several times. Prompt optimization runs within a set LLM budget until the tests pass, and a held-out set checks the result so the agent does not overfit.',
    href: '/work/voice-agent/',
    linkLabel: 'Read about the voice agent',
  },
  {
    id: 'research',
    question: 'Show me your research',
    answer: 'Text-driven image editing with StyleGAN and CLIP, published at SIGGRAPH Asia and in ACM Transactions on Graphics. More recently, LLM-driven candidate assessment at EACL 2026.',
    href: '/research/',
    linkLabel: 'Open research',
  },
  {
    id: 'stack',
    question: "What's your stack?",
    answer: 'Python and PyTorch. Qdrant and Neo4j. FastAPI. Docker and Kubernetes on AWS, with Datadog for tracing.',
    href: '/cv/',
    linkLabel: 'Open the CV',
  },
  {
    id: 'ships',
    question: 'How do you decide what ships?',
    answer: "Every retrieval change gets benchmarked against what's already in production, on recall, latency and cost, before it goes live.",
    href: '/work/air-retrieval-service/',
    linkLabel: 'Read about aiR',
  },
  {
    id: 'where',
    question: 'Where have you worked?',
    answer: 'aiXplain since 2023. Before that: Radity, the KUIS AI Center at Koç University, and internships at Fraunhofer IIS, Visover and Argedor.',
    href: '/cv/',
    linkLabel: 'Open the CV',
  },
];
