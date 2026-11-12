"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CodeXml, ExternalLink } from "lucide-react";
import { useState } from "react";
import { projectCategories, projects } from "@/data/projects";

function cardTechnologyLabel(technology: string) {
  return technology === "Neo4j JavaScript Driver" ? "Neo4j Driver" : technology;
}

export function ProjectGrid() {
  const [filter, setFilter] =
    useState<(typeof projectCategories)[number]>("All");
  const filtered =
    filter === "All"
      ? projects
      : projects.filter((project) => project.categories.includes(filter));
  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects">
        {projectCategories.map((category) => (
          <button
            key={category}
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <motion.div layout className="project-grid">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((project, index) => (
            <motion.article
              layout
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className={`project-card ${index === 0 && filter === "All" ? "featured" : ""}`}
              key={project.slug}
            >
              {project.hasCaseStudy === false ? (
                <div className="project-image">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 800px) 100vw, 66vw"
                        : "(max-width: 800px) 100vw, 34vw"
                    }
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ) : (
                <Link
                  href={`/projects/${project.slug}`}
                  className="project-image"
                  aria-label={`Read ${project.title} case study`}
                >
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 800px) 100vw, 66vw"
                        : "(max-width: 800px) 100vw, 34vw"
                    }
                    style={{ objectFit: "contain" }}
                  />
                </Link>
              )}
              <div className="project-content">
                <div className="mono">{project.categories.join(" / ")}</div>
                <h3>
                  {project.hasCaseStudy === false ? (
                    project.title
                  ) : (
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  )}
                </h3>
                <p>{project.description}</p>
                <div className="tags">
                  {(
                    project.cardTechnologies ?? project.technologies.slice(0, 6)
                  )
                    .slice(0, 6)
                    .map((tag) => (
                      <span key={tag}>{cardTechnologyLabel(tag)}</span>
                    ))}
                </div>
                <div className="card-links">
                  <button type="button" data-case-study-slug={project.slug}>
                    Case study
                  </button>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CodeXml size={16} />
                    {project.backendGithub
                      ? "Frontend"
                      : project.hasCaseStudy === false
                        ? "Code"
                        : "GitHub"}
                  </a>
                  {project.backendGithub && (
                    <a
                      href={project.backendGithub}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CodeXml size={16} /> Backend
                    </a>
                  )}
                  {(project.live || project.demo) && (
                    <a
                      href={project.live || project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={16} />{" "}
                      {project.live ? "Live" : "Demo"}
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
