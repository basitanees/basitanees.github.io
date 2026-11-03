export interface Role {
  org: string;
  location: string;
  title: string;
  start: string;
  end?: string;
  bullets: string[];
}

export const CV = {
  location: 'Islamabad, Pakistan',
  summary:
    "Applied AI engineer (MSc, Koç University) with 6+ years across research and industry, building production retrieval, LLM and knowledge-graph systems (Qdrant, Neo4j, Cypher). I own aiR, the retrieval service behind every aiXplain agent's knowledge base, designed its V3 rebuild for scale and accuracy, and developed Koder, aiXplain's coding agent. I pair careful offline evaluation on recall, latency and cost with production engineering on Kubernetes, CI/CD and Datadog, and I write the RFCs and decision briefs that get designs adopted. Published at SIGGRAPH Asia, in ACM Transactions on Graphics and at EACL.",
  experience: [
    {
      org: 'aiXplain',
      location: 'Remote, United States',
      title: 'Research Engineer',
      start: '2023-06',
      end: 'present',
      bullets: [
        "Own aiR, the retrieval service behind every aiXplain agent's knowledge base, and designed its V3 rebuild for scale, accuracy and reliability. On an Arabic encyclopedia benchmark it ranks the right article first far more often than V2, agents read far fewer tokens, and the same data needs far less memory.",
        'Built LLM re-ranking with a decision model, so agents receive a short list of results that holds the answer.',
        'Designed the semantic and metadata layer and the search features on it: per-collection field schemas and index-level defaults, multi-query search merged into one ranked list, grouped search for variety across documents, reading-order and neighbouring-chunk retrieval so split answers arrive whole, and provenance on every result so agents can cite evidence.',
        'Built knowledge graphs in Neo4j for two projects: designed the graph data model (entities and relationships), loaded them from source data, and queried them with Cypher.',
        'Built ingestion pipelines that turn unstructured PDFs and documents into structured, searchable chunks (layout parsing, multiple embedding models), with context-aware embeddings so each passage is read as part of its whole document; benchmarked on an Arabic encyclopedia corpus.',
        'Set the evaluation method for every retrieval change: each candidate is benchmarked against production on recall, latency and cost before adoption. TurboQuant compression (Google), context-aware embeddings (Perplexity) and decision-model re-ranking all shipped this way.',
        'Re-architected storage around a multi-tenant design, lifting the old cap on the number of indexes, so empty indexes cost nothing; TurboQuant compression cut memory with no measurable accuracy loss. Own CI/CD for aiR, Koder and the aiXplain SDK, Kubernetes (AWS EKS) deployment, Datadog tracing across services, and backup and capacity planning for production collections.',
        "Led IndexFactory, aiR's SDK layer, which put different vector and graph-search backends behind one interface; active contributor to the aiXplain SDK and backend.",
        "Built an end-to-end voice customer-service agent for a client that answers from the client's customer data through SQL queries, with an eval harness that finds failures and keeps improving the agent: live customer logs are continuously evaluated to add new test cases on the fly, each run with multiple repetitions, and a user-chosen LLM budget drives prompt optimization until the test cases pass, checked against a held-out set to avoid overfitting. The agent now follows its instructions on live calls.",
        'Designed aiXplain\'s HR manager, an LLM-driven candidate-assessment platform that evaluates and ranks candidates from multimodal data: CV analysis, video interviews with an AI avatar, and interactive chat-based interviews, with transcript and emotion analysis of every interview. Includes its PostgreSQL schema and Alembic migrations, and ranks candidates with the active listwise tournament from our EACL 2026 paper, which needs far fewer comparisons.',
        "Worked on aiXplain's AI agents framework, and designed agent pipelines with aiXplain, LangGraph and CrewAI.",
        "Built agent memory for aiXplain agents, giving agents structured, versioned knowledge they write and read back across sessions.",
        'Delivered proofs of concept across domains: LLM-powered data analysis and plotting, PDF table extraction pipelines, chatbots and AutoML deployments, and automatic video dubbing and text de-normalization for low-resource languages.',
        'Researched and fine-tuned ASR models; deployed and scaled machine learning models with Flyte, Docker and Kubernetes.',
        "Developed Koder, aiXplain's coding agent.",
      ],
    },
    {
      org: 'Radity',
      location: 'Remote, Switzerland',
      title: 'Backend Developer',
      start: '2022-08',
      end: '2023-04',
      bullets: ['Built FastAPI microservices and Django backend features for an insurance client, and created an automated behavioural testing tool.'],
    },
    {
      org: 'KUIS AI Center',
      location: 'Istanbul, Turkey',
      title: 'AI Fellow',
      start: '2020-09',
      end: '2023-07',
      bullets: [
        'Research on multimodal learning, focused on fine-tuning generative models to edit images of human faces.',
        'Projects in PyTorch and TensorFlow.',
        'Collaboration with Duygu Ceylan from Adobe Research.',
      ],
    },
    {
      org: 'Koç University',
      location: 'Istanbul, Turkey',
      title: 'Graduate Teaching Assistant',
      start: '2020-09',
      end: '2023-07',
      bullets: ['Teaching assistant for computer science courses, including COMP106 Discrete Mathematics for Computer Science and Engineering (Fall 2020).'],
    },
    {
      org: 'Frontier Technology Institute',
      location: 'Remote',
      title: 'Course Instructor',
      start: '2021-02',
      end: '2021-03',
      bullets: ['Taught Supervised Learning, one course in a 5-course data science certification.'],
    },
    {
      org: 'Visover Software Technologies',
      location: 'Ankara, Turkey',
      title: 'Computer Vision Intern',
      start: '2020-07',
      end: '2020-08',
      bullets: ['Trained space-efficient image segmentation models for image-editing mobile apps.'],
    },
    {
      org: 'Fraunhofer IIS',
      location: 'Nuremberg, Germany',
      title: 'Software Development Intern',
      start: '2019-06',
      end: '2019-09',
      bullets: [
        'Built and evaluated a multi-stream (multiplexed) satellite data reader for a software radio (SDR) GNSS receiver in the Specialized GNSS group. It removed the need to split huge files into many small readable ones and cut file-reading time sharply.',
        'Connected the reader to MATLAB-based simulation and testing software, and added support for more file types.',
        "Worked with Git, Gerrit and Jira in the team's development cycle, and presented progress to the team every two weeks.",
      ],
    },
    {
      org: 'Argedor',
      location: 'Ankara, Turkey',
      title: 'Machine Learning Intern',
      start: '2018-11',
      end: '2019-02',
      bullets: [
        'Researched and prototyped terrain segmentation on hyperspectral data, running the models on a Raspberry Pi.',
        "Built a machine-learning tool that detects and visualizes chart patterns in Forex data, replacing traders' manual pattern search.",
      ],
    },
    {
      org: 'Pakistan Institute of Engineering and Applied Sciences (PIEAS)',
      location: 'Islamabad, Pakistan',
      title: 'Data Acquisition Intern',
      start: '2017',
      bullets: ['Worked with the Nuclear Engineering department on data acquisition from different sensors.'],
    },
  ] satisfies Role[],
  projects: [
    {
      title: 'HyperGAN-CLIP',
      dates: 'Thesis project; SIGGRAPH Asia 2024',
      text: "Generate and edit images from natural-language captions, with a dataset-free training strategy that generalizes to unseen text and images. One-shot domain adaptation moves a face into any domain from one reference image using OpenAI's CLIP, while keeping the face's identity.",
    },
    {
      title: 'CLIP-Guided StyleGAN Inversion for Text-Driven Real Image Editing',
      dates: 'Thesis project; Apr 2021 – 2023',
      text: 'Image manipulation from natural-language descriptions. Published in ACM Transactions on Graphics and presented at SIGGRAPH Asia 2023.',
    },
    { title: 'Parallelized 2D Stencil Computation on GPU', dates: 'Nov 2021', text: 'Written in CUDA; fastest runtime in the in-class competition.' },
    { title: 'BridgeRank Paper Implementation', dates: 'Jan 2022', text: 'Implemented BridgeRank in Python: a centrality measure that finds the important nodes in a graph.' },
    { title: 'BlockGAN Paper Implementation', dates: 'Oct 2020 – Jan 2021', text: 'Implemented the BlockGAN paper in Knet (Julia).' },
    {
      title: 'Visual-Inertial Integrated Navigation System',
      dates: 'Industrial design project; Sep 2019 – Jul 2020',
      text: "Localization for vehicles, built for Ardic Labs, using a monocular camera and an inertial measurement unit when GPS isn't available: visual odometry with feature tracking, and an Extended Kalman Filter fusing camera and IMU data. OpenCV, Python, MATLAB, NVIDIA Jetson TX2.",
    },
    {
      title: 'Restaurant Recommender System',
      dates: 'Mar 2019 – May 2019',
      text: 'On the Yelp dataset: data cleaning and organization, and from-scratch Python implementations of MLP, matrix factorization, k-means clustering and logistic regression.',
    },
  ],
  education: [
    {
      degree: 'MSc, Computer Science and Engineering',
      school: 'Koç University, Istanbul, Turkey',
      dates: '2020 – Jul 2023',
      note: 'High Honors. Graduate Research Fellow at the KUIS AI Center, with full scholarship and stipend. Thesis supervised by Prof. Dr. Deniz Yuret, Prof. Dr. Aykut Erdem and Duygu Ceylan (Adobe Research).',
    },
    {
      degree: 'BSc, Electrical and Electronics Engineering',
      school: 'Bilkent University, Ankara, Turkey',
      dates: '2016 – 2020',
      note: 'Graduated with Honors; full scholarship.',
    },
  ],
  skills: [
    { group: 'Information retrieval & NLP', items: 'vector, hybrid & BM25 search; embeddings & contextual embeddings; LLM and decision-model re-ranking; document parsing & chunking; retrieval evaluation (recall@k, hit-rate@k, MRR); RAG, GraphRAG' },
    { group: 'Agent frameworks', items: 'aiXplain, LangGraph, LangChain, CrewAI' },
    { group: 'Programming & ML', items: 'Python, SQL, C++, C, Julia, MATLAB, Java, JavaScript/Node.js; PyTorch, TensorFlow, Keras, scikit-learn, pandas, NumPy; OpenCV, CUDA, OpenMP' },
    { group: 'Speech & generative models', items: 'ASR, TTS, machine translation, Stable Diffusion, StyleGAN, CLIP' },
    { group: 'Vector & graph databases', items: 'Qdrant (multi-tenant collections, TurboQuant quantisation, capacity planning, backup & restore); Neo4j, Cypher, graph data modelling' },
    { group: 'MLOps & cloud', items: 'Docker, Kubernetes, AWS (EKS, S3, ECR), Azure, Flyte, KServe, CI/CD; Datadog, distributed tracing' },
    { group: 'Backend & data', items: 'FastAPI, Django, asyncio, REST APIs; PostgreSQL, MongoDB, Redis, Alembic; behaviour-driven development; RFC-driven development' },
    { group: 'Knowledge engineering', items: 'LLM entity & relation extraction; metadata & schema design; provenance; agent memory' },
    { group: 'LLM systems', items: 'structured output & validation; retries & fallbacks; eval harnesses; eval-driven prompt optimization with held-out sets; voice agents; text-to-SQL; token & cost tracking' },
  ],
  languages: ['English (professional)', 'Urdu (native)', 'Turkish (basic)'],
  achievements: [
    '9th place, nationwide university entrance examination, Pakistan Institute of Engineering and Applied Sciences (PIEAS), 2016',
    '3rd position in Pakistan, NUST university entrance examination',
    'Selected among the top 50 for International Mathematics Olympiad training, Higher Education Commission (HEC), Pakistan, 2015',
    'Winning team, All Pakistan Mathematics Olympiad, Ghulam Ishaq Khan Institute of Science and Technology, 2015',
    'Silver medal, International Kangaroo Mathematics Contest, 2015',
    'Bronze medal, International Kangaroo Mathematics Contest, 2011',
    'Gold medal, International Kangaroo Mathematics Contest, 2008',
  ],
};
