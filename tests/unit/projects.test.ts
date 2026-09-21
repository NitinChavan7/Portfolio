import { existsSync, readdirSync } from "node:fs";
import { caseStudyProjects, projects } from "@/data/projects";

const expectedOrder = [
  "rabbit-ecommerce",
  "three-way-match-engine",
  "tracegraph",
  "pipeline-builder",
  "ai-quick-blog",
  "quick-chat",
  "giphy-clone",
  "netflix-gpt",
  "ochi-agency",
  "obys-agency",
  "sundown-studio",
  "lazarev-agency",
];

test("Three-Way Match Engine uses its verified project data", () => {
  const matches = projects.filter(
    (project) => project.slug === "three-way-match-engine",
  );
  expect(matches).toHaveLength(1);
  expect(matches[0]).toMatchObject({
    title: "Three-Way Match Engine",
    slug: "three-way-match-engine",
    label: "AI FINANCE AUTOMATION",
    hasCaseStudy: false,
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
    image: "/images/projects/three-way-engine.png",
    imageFit: "contain",
  });
  expect(caseStudyProjects).not.toContain(matches[0]);
});

test("the new image is used directly without a duplicate", () => {
  expect(existsSync("public/images/projects/three-way-engine.png")).toBe(true);
  expect(
    readdirSync("public/images/projects").filter((file) =>
      file.startsWith("three-way-engine"),
    ),
  ).toEqual(["three-way-engine.png"]);
});

test("Pipeline Builder uses only verified project data", () => {
  const matches = projects.filter(
    (project) => project.slug === "pipeline-builder",
  );
  expect(matches).toHaveLength(1);
  expect(matches[0]).toMatchObject({
    title: "Pipeline Builder",
    slug: "pipeline-builder",
    label: "VISUAL WORKFLOW BUILDER",
    hasCaseStudy: false,
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
    image: "/images/projects/pipeline-builder.png",
    imageFit: "contain",
  });
  expect(caseStudyProjects).not.toContain(matches[0]);
  expect(
    projects.filter((project) => project.categories.includes("AI")),
  ).not.toContain(matches[0]);
});

test("the Pipeline Builder image is used directly without a duplicate", () => {
  expect(existsSync("public/images/projects/pipeline-builder.png")).toBe(true);
  expect(
    readdirSync("public/images/projects").filter((file) =>
      file.startsWith("pipeline-builder"),
    ),
  ).toEqual(["pipeline-builder.png"]);
});

test("TraceGraph uses its verified modal-only project data", () => {
  const matches = projects.filter((project) => project.slug === "tracegraph");
  expect(matches).toHaveLength(1);
  expect(matches[0]).toMatchObject({
    title: "TraceGraph",
    label: "GRAPH OPERATIONS INTELLIGENCE",
    hasCaseStudy: false,
    categories: ["Full Stack", "Backend"],
    cardTechnologies: [
      "Next.js",
      "TypeScript",
      "CognoDB",
      "openCypher",
      "Neo4j JavaScript Driver",
      "React Flow",
    ],
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
    image: "/images/projects/tracegraph.png",
    imageFit: "contain",
  });
  expect(matches[0].categories).not.toContain("AI");
  expect(matches[0].caseStudy?.decisionLog?.nextIteration).toMatch(
    /^Future improvements:/,
  );
  expect(caseStudyProjects).not.toContain(matches[0]);
});

test("the TraceGraph image is used directly without a duplicate", () => {
  expect(existsSync("public/images/projects/tracegraph.png")).toBe(true);
  expect(
    readdirSync("public/images/projects").filter((file) =>
      file.startsWith("tracegraph"),
    ),
  ).toEqual(["tracegraph.png"]);
});

test("project order and uniqueness are preserved around the insertion", () => {
  expect(projects).toHaveLength(12);
  expect(projects.map((project) => project.slug)).toEqual(expectedOrder);
  expect(new Set(projects.map((project) => project.slug)).size).toBe(12);
  expect(new Set(projects.map((project) => project.title)).size).toBe(12);
});

test("technology metadata remains intact while all card chips are enabled", () => {
  expect(
    projects.find((project) => project.slug === "rabbit-ecommerce"),
  ).toMatchObject({
    showTechnologiesOnCard: true,
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
  });
  expect(
    projects.find((project) => project.slug === "three-way-match-engine"),
  ).toMatchObject({
    showTechnologiesOnCard: true,
    technologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Gemini API",
    ],
  });
  expect(
    projects.find((project) => project.slug === "pipeline-builder"),
  ).toMatchObject({
    showTechnologiesOnCard: true,
    technologies: [
      "React",
      "ReactFlow",
      "Zustand",
      "FastAPI",
      "Python",
      "JavaScript",
    ],
  });
});

test("every project has a non-empty card technology subset capped at six", () => {
  for (const project of projects) {
    expect(project.technologies.length).toBeGreaterThan(0);
    expect(project.cardTechnologies?.length).toBeGreaterThan(0);
    expect(project.cardTechnologies?.length).toBeLessThanOrEqual(6);
    for (const technology of project.cardTechnologies ?? []) {
      expect(project.technologies).toContain(technology);
    }
  }
});
