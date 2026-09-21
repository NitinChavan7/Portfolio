export type Project = {
  title: string;
  slug: string;
  label?: string;
  hasCaseStudy?: boolean;
  showTechnologiesOnCard?: boolean;
  cardTechnologies?: string[];
  caseStudy?: {
    summary?: string;
    problem?: string;
    solution?: string;
    architecture?: string;
    architectureNote?: string;
    datasetMetrics?: string;
    graphModel?: {
      nodes: string[];
      relationships: string[];
    };
    features?: string[];
    engineeringFocus?: string[];
    result?: string;
    decisionLog?: {
      keyDecision: string;
      alternativeConsidered: string;
      whyRejected: string;
      failureModes: string[];
      nextIteration: string;
    };
  };
  categories: string[];
  technologies: string[];
  github: string;
  live?: string;
  demo?: string;
  description: string;
  image: string;
  imageAlt: string;
  imageFit: "cover" | "contain";
};

export const projects: Project[] = [
  {
    title: "Rabbit – MERN Stack E-Commerce App",
    slug: "rabbit-ecommerce",
    showTechnologiesOnCard: true,
    cardTechnologies: [
      "React.js",
      "Redux Toolkit",
      "Node.js",
      "MongoDB",
      "Razorpay",
      "ImageKit",
    ],
    caseStudy: {
      problem:
        "Build a complete commerce workflow instead of an isolated storefront.",
      solution:
        "React and Redux Toolkit manage product, cart, and authentication state, while Node and Express APIs coordinate MongoDB persistence, protected access, Razorpay payments, and admin operations.",
      engineeringFocus: [
        "Predictable Redux state",
        "JWT route protection",
        "Payment lifecycle",
        "Order transitions",
        "Admin workflows",
        "Image delivery",
      ],
      result:
        "A complete MERN commerce flow covering customer and admin experiences.",
    },
    categories: ["Full Stack"],
    technologies: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "ImageKit",
      "Tailwind CSS",
      "Redux Toolkit",
      "JWT",
      "Razorpay",
    ],
    github: "https://github.com/NitinChavan7/MERN_Rabbit_Ecommerce",
    live: "https://mern-rabbit-ecommerce-7e9j.vercel.app/",
    description:
      "A MERN commerce platform with product discovery, cart, checkout, order tracking, admin workflows, live Razorpay payments, and protected routes.",
    image: "/images/projects/rabbit-ecommerce.png",
    imageAlt: "Rabbit e-commerce application storefront",
    imageFit: "cover",
  },
  {
    title: "Three-Way Match Engine",
    slug: "three-way-match-engine",
    label: "AI FINANCE AUTOMATION",
    hasCaseStudy: false,
    showTechnologiesOnCard: true,
    cardTechnologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Gemini API",
      "Express",
    ],
    caseStudy: {
      problem:
        "Finance teams manually reconcile Purchase Orders, GRNs, and Invoices before approving payment.",
      solution:
        "Gemini extracts structured PDF data, while deterministic Node and Express business rules validate SKU mapping, quantities, price, MRP, and tolerances.",
      engineeringFocus: [
        "Separation of AI extraction and business logic",
        "SKU mapping",
        "Matching rules",
        "Discrepancy detection",
        "Audit history",
        "Manual recomputation",
      ],
      result:
        "AI extracts information while deterministic backend rules own financial decisions.",
    },
    categories: ["AI", "Full Stack", "Backend"],
    technologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Gemini API",
    ],
    github: "https://github.com/NitinChavan7/Three-Way-Match-Engine",
    live: "https://three-way-match-engine-web.vercel.app/",
    description:
      "An AI-enabled finance and procurement reconciliation system that compares Purchase Orders, Goods Received Notes, and Invoices to classify records as matched, partially matched, mismatched, or pending.",
    image: "/images/projects/three-way-engine.png",
    imageAlt: "Three-Way Match Engine purchase order summary dashboard",
    imageFit: "contain",
  },
  {
    title: "TraceGraph",
    slug: "tracegraph",
    label: "GRAPH OPERATIONS INTELLIGENCE",
    hasCaseStudy: false,
    showTechnologiesOnCard: true,
    cardTechnologies: [
      "Next.js",
      "TypeScript",
      "CognoDB",
      "openCypher",
      "Neo4j JavaScript Driver",
      "React Flow",
    ],
    caseStudy: {
      summary:
        "TraceGraph models services, incidents, engineers, teams, deployments, customers, and runbooks as a connected operational graph so relationship-heavy operational questions can be explored through graph traversal.",
      problem:
        "Production incidents rarely involve a single isolated service. Engineers need to understand dependency chains, blast radius, ownership, deployment context, resolver history, and relevant runbooks across multiple connected entities.",
      solution:
        "TraceGraph uses Next.js and React for the application layer, typed API Route Handlers for the HTTP boundary, a service and repository layer for backend logic, the official Neo4j JavaScript driver for Bolt connectivity, and CognoDB with openCypher for graph traversal.",
      architecture:
        "React / Next.js UI → Next.js API Routes → Service Layer → Repository Layer → Neo4j Driver → CognoDB",
      architectureNote:
        "The browser never communicates directly with CognoDB. Database credentials and graph queries remain server-side.",
      datasetMetrics:
        "96 nodes · 196 relationships · 20 services · 44 dependency edges",
      graphModel: {
        nodes: [
          "Service",
          "Team",
          "Engineer",
          "Incident",
          "Deployment",
          "Customer",
          "Runbook",
        ],
        relationships: [
          "DEPENDS_ON",
          "OWNS",
          "MEMBER_OF",
          "DEPLOYED_TO",
          "TRIGGERED",
          "AFFECTED",
          "RESOLVED",
          "USES",
          "HAS_RUNBOOK",
        ],
      },
      features: [
        "Operations Overview",
        "Service Explorer with direct dependencies, dependents, and multi-hop traversal",
        "Blast-radius analysis",
        "Incident Investigation with deployment-to-incident context",
        "Expert Finder with resolver history and runbook mapping",
        "Shortest dependency path",
        "Interactive topology",
        "Search, filtering, and safe loading, empty, and error states",
      ],
      engineeringFocus: [
        "Graph-native domain modeling",
        "Parameterized openCypher queries",
        "Bounded graph traversal",
        "Reverse dependency traversal",
        "Shortest-path discovery",
        "Repository-based data access",
        "Typed API boundaries",
        "Database failure handling",
        "Interactive topology UX",
      ],
      result:
        "The key engineering insight is that graph databases become valuable when the important questions are about relationships and traversal rather than isolated rows. Dependency paths, blast radius, and resolver discovery map naturally to a graph model.",
      decisionLog: {
        keyDecision:
          "Model operational context as a connected graph rather than treating services, incidents, engineers, deployments, teams, customers, and runbooks as isolated records.",
        alternativeConsidered:
          "A relational schema with join tables for dependencies, incident-service links, ownership, deployments, and resolver history.",
        whyRejected:
          "Direct relational lookups would work, but multi-hop dependency traversal, reverse blast radius, shortest paths, and resolver discovery would require recursive SQL or increasingly complex joins. These are the core questions TraceGraph is designed to answer.",
        failureModes: [
          "Graph database unavailable",
          "Service not found",
          "Incident not found",
          "Invalid traversal depth",
          "Malformed identifiers",
          "Empty traversal results",
          "Database or API failure",
          "Unsafe query construction",
        ],
        nextIteration:
          "Future improvements: historical dependency snapshots, real-time event ingestion, deployment-risk scoring, customer-impact scoring, AI-assisted incident investigation, and graph anomaly detection.",
      },
    },
    categories: ["Full Stack", "Backend"],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "CognoDB",
      "openCypher",
      "Neo4j JavaScript Driver",
      "React Flow",
      "Vercel",
    ],
    github:
      "https://github.com/NitinChavan7/TraceGraph-Software-Incident-Dependency-Intelligence",
    live: "https://trace-graph-software-incident-depen.vercel.app/",
    description:
      "Graph-powered software operations intelligence for exploring service dependencies, investigating incidents, tracing blast radius, finding dependency paths, and discovering relevant incident responders.",
    image: "/images/projects/tracegraph.png",
    imageAlt:
      "TraceGraph software incident and dependency intelligence dashboard",
    imageFit: "contain",
  },
  {
    title: "Pipeline Builder",
    slug: "pipeline-builder",
    label: "VISUAL WORKFLOW BUILDER",
    hasCaseStudy: false,
    showTechnologiesOnCard: true,
    cardTechnologies: [
      "React",
      "ReactFlow",
      "Zustand",
      "FastAPI",
      "Python",
      "JavaScript",
    ],
    caseStudy: {
      problem:
        "Visual workflow interfaces must coordinate node state, connections, dynamic variables, and graph validity.",
      solution:
        "ReactFlow renders and connects configurable nodes, Zustand manages graph state, and FastAPI validates whether the submitted graph is a directed acyclic graph.",
      engineeringFocus: [
        "Reusable node architecture",
        "Dynamic handles",
        "{{variable}} detection",
        "Graph serialization",
        "Cycle detection",
        "Frontend and backend boundary",
      ],
      result:
        "Visual workflow builders benefit from separating UI graph construction from backend graph validation.",
    },
    categories: ["Full Stack", "Frontend", "Backend"],
    technologies: [
      "React",
      "ReactFlow",
      "Zustand",
      "FastAPI",
      "Python",
      "JavaScript",
    ],
    github: "https://github.com/NitinChavan7/Pipeline-Builder",
    live: "https://vector-shift-alpha.vercel.app/",
    description:
      "A visual workflow builder where users can drag, configure, and connect nodes while a FastAPI backend validates whether the resulting pipeline forms a valid directed acyclic graph.",
    image: "/images/projects/pipeline-builder.png",
    imageAlt: "Pipeline Builder visual node workflow canvas",
    imageFit: "contain",
  },
  {
    title: "AI Quick Blog – MERN Stack Blogging App",
    slug: "ai-quick-blog",
    showTechnologiesOnCard: true,
    cardTechnologies: [
      "React.js",
      "Node.js",
      "MongoDB",
      "Google Gemini",
      "ImageKit",
      "Tailwind CSS",
    ],
    caseStudy: {
      problem:
        "Create and manage publishing workflows while accelerating content drafting.",
      solution:
        "A React admin experience manages blogs and comments, Gemini assists content generation, ImageKit handles media, and Node and Express APIs persist content in MongoDB.",
      engineeringFocus: [
        "Admin workflows",
        "Gemini integration",
        "Media upload",
        "Blog and comment APIs",
        "Responsive reading experience",
      ],
    },
    categories: ["Full Stack", "AI"],
    technologies: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "Tailwind CSS",
      "Google Gemini",
      "ImageKit",
    ],
    github: "https://github.com/NitinChavan7/MERN_AI_QuickBlog_App",
    live: "https://mern-ai-quick-blog-app.vercel.app/",
    description:
      "An AI-powered publishing system with responsive reading pages, an admin workspace, Gemini-assisted generation, optimized uploads, and secure APIs.",
    image: "/images/projects/ai-quick-blog.png",
    imageAlt: "AI Quick Blog publishing dashboard",
    imageFit: "cover",
  },
  {
    title: "Quick Chat – MERN Stack Chat App",
    slug: "quick-chat",
    showTechnologiesOnCard: true,
    cardTechnologies: [
      "React.js",
      "Node.js",
      "MongoDB",
      "Socket.IO",
      "Tailwind CSS",
      "ImageKit",
    ],
    caseStudy: {
      problem:
        "Build responsive one-to-one messaging with immediate delivery and persistent conversation data.",
      solution:
        "React provides the messaging interface, Socket.IO handles bidirectional real-time events, and Node, Express, and MongoDB manage users and messages.",
      engineeringFocus: [
        "Socket lifecycle",
        "Message delivery",
        "User search",
        "Status updates",
        "Media workflows",
      ],
    },
    categories: ["Full Stack", "Realtime"],
    technologies: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "Tailwind CSS",
      "Socket.IO",
      "ImageKit",
    ],
    github: "https://github.com/NitinChavan7/MERN_Chat_App",
    live: "https://mern-chat-app-nine-flame.vercel.app/login",
    description:
      "A real-time messaging product with authentication, responsive conversations, Socket.IO delivery, image handling, and online presence.",
    image: "/images/projects/quick-chat.png",
    imageAlt: "Quick Chat real-time messaging interface",
    imageFit: "cover",
  },
  {
    title: "GIPHY – Be Animated",
    slug: "giphy-clone",
    showTechnologiesOnCard: true,
    cardTechnologies: ["React.js", "Tailwind CSS", "REST API"],
    caseStudy: {
      problem:
        "Build a responsive discovery interface around a high-volume external media API.",
      solution:
        "React and Tailwind CSS provide search, filtering, favorites, and related-content browsing through an external media API.",
      engineeringFocus: [
        "API integration",
        "Search state",
        "Content filtering",
        "Responsive media layouts",
        "Related results",
      ],
    },
    categories: ["Frontend"],
    technologies: ["React.js", "REST API", "Tailwind CSS"],
    github: "https://github.com/NitinChavan7/Giphy_Clone",
    live: "https://giphy-clone-eight.vercel.app/",
    description:
      "A responsive media discovery experience with search, API integration, reusable components, and resilient loading states.",
    image: "/images/projects/giphy-clone.jpg",
    imageAlt: "GIPHY clone media discovery page",
    imageFit: "cover",
  },
  {
    title: "Netflix GPT",
    slug: "netflix-gpt",
    showTechnologiesOnCard: true,
    cardTechnologies: ["React.js", "Redux", "Tailwind CSS", "APIs"],
    caseStudy: {
      problem:
        "Improve movie discovery through natural-language recommendation prompts.",
      solution:
        "React and Redux manage application and recommendation state while an external API converts user intent into movie-discovery suggestions.",
      engineeringFocus: [
        "Recommendation state",
        "Form validation",
        "Memoization",
        "Multilingual support",
        "Environment configuration",
      ],
    },
    categories: ["Frontend", "AI"],
    technologies: ["React.js", "Redux", "APIs", "Tailwind CSS"],
    github: "https://github.com/NitinChavan7/Netflix_GPT",
    demo: "https://www.linkedin.com/feed/update/urn:li:activity:7195680737310703617/",
    description:
      "A Netflix-inspired movie discovery experience combining Redux state, API-driven catalogues, and AI-assisted recommendations.",
    image: "/images/projects/netflix-gpt.jpg",
    imageAlt: "Netflix GPT movie discovery screen",
    imageFit: "cover",
  },
  {
    title: "OCHI – Presentation Design Agency",
    slug: "ochi-agency",
    showTechnologiesOnCard: true,
    cardTechnologies: ["React.js", "Framer Motion", "Tailwind CSS"],
    caseStudy: {
      problem:
        "Recreate a motion-rich presentation experience without sacrificing responsive behavior.",
      solution:
        "React structures the recreation while Framer Motion coordinates transitions and interaction timing.",
      engineeringFocus: [
        "Component-based recreation",
        "Motion sequencing",
        "Responsive adaptation",
        "Interaction timing",
      ],
    },
    categories: ["Frontend", "Motion"],
    technologies: ["React.js", "Framer Motion", "Tailwind CSS"],
    github: "https://github.com/NitinChavan7/ochi_clone",
    demo: "https://www.linkedin.com/feed/update/urn:li:activity:7192917938465611776/",
    description:
      "A responsive recreation of a premium presentation agency with motion-led storytelling and considered interactions.",
    image: "/images/projects/ochi-agency.png",
    imageAlt: "OCHI presentation agency landing page",
    imageFit: "cover",
  },
  {
    title: "Obys Agency",
    slug: "obys-agency",
    showTechnologiesOnCard: true,
    cardTechnologies: [
      "JavaScript",
      "GSAP",
      "ScrollTrigger",
      "Locomotive.js",
      "CSS",
      "HTML",
    ],
    caseStudy: {
      problem:
        "Recreate an immersive creative-agency experience combining scroll choreography and animation.",
      solution:
        "JavaScript, GSAP, ScrollTrigger, and Locomotive.js coordinate transitions, scrolling, and responsive visual behavior.",
      engineeringFocus: [
        "Animation timelines",
        "Scroll synchronization",
        "Interaction timing",
        "Responsive visual behavior",
      ],
    },
    categories: ["Frontend", "Creative Development"],
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "GSAP",
      "Locomotive.js",
      "ScrollTrigger",
    ],
    github: "https://github.com/NitinChavan7/Obys-Agency",
    live: "https://NitinChavan7.github.io/Obys-Agency/",
    description:
      "A creative agency build with GSAP timelines, responsive motion, scroll choreography, and animation-led storytelling.",
    image: "/images/projects/obys-agency.png",
    imageAlt: "Obys creative agency website",
    imageFit: "cover",
  },
  {
    title: "Sundown Studio",
    slug: "sundown-studio",
    showTechnologiesOnCard: true,
    cardTechnologies: [
      "JavaScript",
      "GSAP",
      "ScrollTrigger",
      "Locomotive.js",
      "CSS",
      "HTML",
    ],
    caseStudy: {
      problem:
        "Build an editorial studio recreation with smooth scrolling and responsive sections.",
      solution:
        "JavaScript, GSAP, ScrollTrigger, and Locomotive.js coordinate page interactions, animation timing, and section transitions.",
      engineeringFocus: [
        "Smooth-scroll choreography",
        "Responsive layout",
        "Animation timing",
        "Visual hierarchy",
      ],
    },
    categories: ["Frontend", "Creative Development"],
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "GSAP",
      "Locomotive.js",
      "ScrollTrigger",
    ],
    github: "https://github.com/NitinChavan7/sundown-clone",
    live: "https://NitinChavan7.github.io/sundown-clone/",
    description:
      "A motion-led studio website with smooth transitions, responsive sections, and deliberately paced visual effects.",
    image: "/images/projects/sundown-studio.jpg",
    imageAlt: "Sundown Studio animated landing page",
    imageFit: "cover",
  },
  {
    title: "Lazarev — Digital Product Design Agency",
    slug: "lazarev-agency",
    showTechnologiesOnCard: true,
    cardTechnologies: [
      "JavaScript",
      "GSAP",
      "ScrollTrigger",
      "Locomotive.js",
      "CSS",
      "HTML",
    ],
    caseStudy: {
      problem:
        "Recreate a digital-product agency interface with layered motion and scroll-driven storytelling.",
      solution:
        "GSAP, ScrollTrigger, and Locomotive.js coordinate animation timelines, section transitions, and responsive interactions.",
      engineeringFocus: [
        "ScrollTrigger timelines",
        "Layered animations",
        "Smooth-scroll synchronization",
        "Responsive typography",
        "Performance-conscious motion",
      ],
    },
    categories: ["Frontend", "Creative Development"],
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "GSAP",
      "Locomotive.js",
      "ScrollTrigger",
    ],
    github: "https://github.com/NitinChavan7/lazarev_clone",
    live: "https://NitinChavan7.github.io/lazarev_clone/",
    description:
      "A digital product agency recreation with interactive sections, timeline animation, responsive behavior, and scroll-linked narrative.",
    image: "/images/projects/lazarev-agency.jpg",
    imageAlt: "Lazarev digital product design agency page",
    imageFit: "cover",
  },
];

export const projectCategories = [
  "All",
  "Frontend",
  "Full Stack",
  "Backend",
  "AI",
  "Realtime",
  "Motion",
  "Creative Development",
] as const;

export const caseStudyProjects = projects.filter(
  (project) => project.hasCaseStudy !== false,
);
