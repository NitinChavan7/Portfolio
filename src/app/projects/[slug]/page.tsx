import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CodeXml, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { caseStudyProjects, projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return caseStudyProjects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = caseStudyProjects.find((item) => item.slug === slug);
  return project
    ? {
        title: project.title,
        description: project.description,
        openGraph: {
          title: project.title,
          description: project.description,
          images: [project.image],
        },
      }
    : {};
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = caseStudyProjects.find((item) => item.slug === slug);
  if (!project) notFound();
  const related = caseStudyProjects
    .filter(
      (item) =>
        item.slug !== project.slug &&
        item.categories.some((category) =>
          project.categories.includes(category),
        ),
    )
    .slice(0, 3);
  const caseStudySections = [
    {
      title: "Project overview",
      content:
        "This build turns a clear product workflow into a maintainable application: deliberate interface states, defined data boundaries, reusable components, and responsive behavior across devices.",
    },
    {
      title: "Challenge",
      content:
        "The central challenge was coordinating user intent, asynchronous work, loading and error states, and consistent UI behavior without allowing the implementation to become tightly coupled.",
    },
    {
      title: "Solution & architecture",
      content:
        "The solution separates presentation, state transitions, API communication, and persistence. Requests pass through validation and explicit error handling before state is reconciled in the interface.",
    },
    {
      title: "Engineering decisions",
      content:
        "Reusable primitives keep repeated behavior consistent. Data-driven rendering improves maintainability, protected boundaries reduce invalid access, and responsive layouts preserve task completion on small screens.",
    },
    {
      title: "Key features",
      content: `${project.description} The implementation also includes intentional empty, loading, success, and failure states.`,
    },
    {
      title: "Result & impact",
      content:
        "The finished application demonstrates end-to-end product ownership through clear state boundaries, reliable failure handling, reusable UI decisions, and responsive execution across devices.",
    },
    {
      title: "Future improvements",
      content:
        "Next steps include deeper automated coverage, richer observability, stronger offline or retry behavior where appropriate, and continued accessibility validation with real users and assistive technology.",
    },
  ];
  return (
    <main className="case-study">
      <nav className="case-nav">
        <Link href="/#projects">
          <ArrowLeft /> Back to work
        </Link>
        <span className="mono">
          CASE STUDY / {String(projects.indexOf(project) + 1).padStart(2, "0")}
        </span>
      </nav>
      <header className="case-hero">
        <p className="eyebrow">{project.categories.join(" / ")}</p>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <div className="case-actions">
          <a
            className="button primary"
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CodeXml /> View source
          </a>
          {(project.live || project.demo) && (
            <a
              className="button"
              href={project.live || project.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink />{" "}
              {project.live ? "Open live product" : "Watch demo"}
            </a>
          )}
        </div>
      </header>
      <div className="case-image">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: project.imageFit }}
        />
      </div>
      <div className="case-content">
        <aside>
          <span className="mono">TECHNOLOGY</span>
          <div className="tags">
            {project.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </aside>
        <div>
          {caseStudySections.map((section, index) => (
            <CaseSection
              number={String(index + 1).padStart(2, "0")}
              title={section.title}
              key={section.title}
            >
              {section.content}
            </CaseSection>
          ))}
        </div>
      </div>
      <section className="related">
        <p className="eyebrow">Related work</p>
        <div>
          {related.map((item) => (
            <Link href={`/projects/${item.slug}`} key={item.slug}>
              <span className="mono">{item.categories[0]}</span>
              <strong>{item.title}</strong>
              <span>Open case study →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
function CaseSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <span className="mono">{number}</span>
      <h2>{title}</h2>
      <p>{children}</p>
    </section>
  );
}
