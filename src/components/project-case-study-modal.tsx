"use client";

import { useEffect, useId, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ProjectCaseStudyModal() {
  const [project, setProject] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollbarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const handleTrigger = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const trigger = target?.closest<HTMLElement>("[data-case-study-slug]");
      if (!trigger) return;
      const selected = projects.find(
        (item) => item.slug === trigger.dataset.caseStudySlug,
      );
      if (!selected) return;
      event.preventDefault();
      triggerRef.current = trigger;
      setProject(selected);
    };
    document.addEventListener("click", handleTrigger);
    return () => document.removeEventListener("click", handleTrigger);
  }, []);

  useEffect(() => {
    if (!project) return;
    const shell = document.querySelector<HTMLElement>(".reference-page-shell");
    const root = document.documentElement;
    const scrollPosition = window.scrollY;
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      paddingRight: document.body.style.paddingRight,
    };
    const previousRootOverflow = root.style.overflow;
    const scrollbarGap = Math.max(0, window.innerWidth - root.clientWidth);

    const setScrollEngineLocked = (locked: boolean) => {
      window.dispatchEvent(
        new CustomEvent("portfolio:modal-scroll-lock", {
          detail: { locked },
        }),
      );
    };

    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    shell?.setAttribute("inert", "");
    shell?.setAttribute("aria-hidden", "true");
    setScrollEngineLocked(true);
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
    if (scrollbarGap > 0)
      document.body.style.paddingRight = `${scrollbarGap}px`;
    const closeButton = dialogRef.current?.querySelector<HTMLElement>(".close");
    closeButton?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setProject(null);
        return;
      }
      const scrollArea = scrollRef.current;
      const target = event.target instanceof Element ? event.target : null;
      const isEditable =
        target?.matches("input, textarea, select, [contenteditable='true']") ??
        false;
      const isAction = target?.matches("button, a[href]") ?? false;
      if (scrollArea && !isEditable) {
        const pageAmount = Math.max(120, scrollArea.clientHeight * 0.85);
        if (event.key === "PageDown") {
          event.preventDefault();
          scrollArea.scrollTop += pageAmount;
          return;
        }
        if (event.key === "PageUp") {
          event.preventDefault();
          scrollArea.scrollTop -= pageAmount;
          return;
        }
        if (event.key === "Home") {
          event.preventDefault();
          scrollArea.scrollTop = 0;
          return;
        }
        if (event.key === "End") {
          event.preventDefault();
          scrollArea.scrollTop = scrollArea.scrollHeight;
          return;
        }
        if (event.key === "ArrowDown" || (!isAction && event.key === " ")) {
          event.preventDefault();
          scrollArea.scrollTop += event.key === "ArrowDown" ? 48 : pageAmount;
          return;
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          scrollArea.scrollTop -= 48;
          return;
        }
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (scrollbarTimerRef.current) {
        clearTimeout(scrollbarTimerRef.current);
        scrollbarTimerRef.current = null;
      }
      document.body.style.overflow = previousBodyStyles.overflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.width = previousBodyStyles.width;
      document.body.style.paddingRight = previousBodyStyles.paddingRight;
      root.style.overflow = previousRootOverflow;
      shell?.removeAttribute("inert");
      shell?.removeAttribute("aria-hidden");
      if (window.scrollY !== scrollPosition) {
        window.scrollTo({ top: scrollPosition, behavior: "auto" });
      }
      setScrollEngineLocked(false);
      triggerRef.current?.focus();
    };
  }, [project]);

  const handleModalScroll = () => {
    const scrollArea = scrollRef.current;
    if (!scrollArea) return;
    scrollArea.classList.add("is-modal-scrolling");
    if (scrollbarTimerRef.current) clearTimeout(scrollbarTimerRef.current);
    scrollbarTimerRef.current = setTimeout(() => {
      scrollArea.classList.remove("is-modal-scrolling");
      scrollbarTimerRef.current = null;
    }, 750);
  };

  if (!project) return null;
  const caseStudy = project.caseStudy;
  const externalUrl = project.live || project.demo;

  return (
    <div
      id="caseModal"
      className="open"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setProject(null);
      }}
      onWheel={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
    >
      <div
        className="modal project-case-study"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
      >
        <div className="modal-top">
          <div>
            <span className="project-num">
              {project.label ?? project.categories.join(" / ")}
            </span>
            <h3 id={titleId}>{project.title}</h3>
          </div>
          <button
            type="button"
            className="close"
            aria-label="Close case study"
            onClick={() => setProject(null)}
          >
            ×
          </button>
        </div>
        <div
          className="case-study-scroll"
          ref={scrollRef}
          tabIndex={0}
          onScroll={handleModalScroll}
        >
          <p className="case-summary">
            {caseStudy?.summary ?? project.description}
          </p>
          {caseStudy?.problem && (
            <section>
              <h4>Problem</h4>
              <p>{caseStudy.problem}</p>
            </section>
          )}
          {caseStudy?.solution && (
            <section>
              <h4>System</h4>
              <p>{caseStudy.solution}</p>
            </section>
          )}
          {caseStudy?.architecture && (
            <section>
              <h4>Architecture</h4>
              <p>{caseStudy.architecture}</p>
              {caseStudy.architectureNote && (
                <p>{caseStudy.architectureNote}</p>
              )}
            </section>
          )}
          {caseStudy?.datasetMetrics && (
            <section>
              <h4>Verified dataset</h4>
              <p>{caseStudy.datasetMetrics}</p>
            </section>
          )}
          {caseStudy?.features?.length ? (
            <section>
              <h4>Key features</h4>
              <ul>
                {caseStudy.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {caseStudy?.graphModel && (
            <section>
              <h4>Graph model</h4>
              <p>
                <strong>Nodes:</strong> {caseStudy.graphModel.nodes.join(", ")}
              </p>
              <p>
                <strong>Relationships:</strong>{" "}
                {caseStudy.graphModel.relationships.join(", ")}
              </p>
            </section>
          )}
          {caseStudy?.engineeringFocus?.length ? (
            <section>
              <h4>Engineering focus</h4>
              <ul>
                {caseStudy.engineeringFocus.map((focus) => (
                  <li key={focus}>{focus}</li>
                ))}
              </ul>
            </section>
          ) : null}
          <section>
            <h4>Technology stack</h4>
            <div className="pills">
              {project.technologies.map((technology) => (
                <span className="pill" key={technology}>
                  {technology}
                </span>
              ))}
            </div>
          </section>
          {caseStudy?.result && (
            <section>
              <h4>Result / impact</h4>
              <p>{caseStudy.result}</p>
            </section>
          )}
          {caseStudy?.decisionLog && (
            <section
              className="decision-log"
              aria-labelledby={`${titleId}-decision-log`}
            >
              <h4 id={`${titleId}-decision-log`}>Decision log</h4>
              <dl>
                <div>
                  <dt>Key decision</dt>
                  <dd>{caseStudy.decisionLog.keyDecision}</dd>
                </div>
                <div>
                  <dt>Alternative considered</dt>
                  <dd>{caseStudy.decisionLog.alternativeConsidered}</dd>
                </div>
                <div>
                  <dt>Why rejected</dt>
                  <dd>{caseStudy.decisionLog.whyRejected}</dd>
                </div>
                <div>
                  <dt>Failure modes</dt>
                  <dd>
                    <ul>
                      {caseStudy.decisionLog.failureModes.map((mode) => (
                        <li key={mode}>{mode}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt>Next iteration</dt>
                  <dd>{caseStudy.decisionLog.nextIteration}</dd>
                </div>
              </dl>
            </section>
          )}
          <div className="case-actions">
            <a
              className="mini"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Code ↗
            </a>
            {externalUrl && (
              <a
                className="mini"
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.live ? "Live ↗" : "Demo ↗"}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
