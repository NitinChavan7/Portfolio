import fs from "node:fs";
import path from "node:path";
import { getImageProps } from "next/image";
import Script from "next/script";
import { EmailJsContactBridge } from "@/components/emailjs-contact-bridge";
import { ProjectCaseStudyModal } from "@/components/project-case-study-modal";
import { siteConfig } from "@/config/site";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { testimonials } from "@/data/testimonials";

function escapeAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function cardTechnologyLabel(technology: string) {
  return technology === "Neo4j JavaScript Driver" ? "Neo4j Driver" : technology;
}

function optimizedImage({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const { props } = getImageProps({
    src,
    alt,
    width,
    height,
    sizes,
    priority,
  });
  return `<img src="${escapeAttribute(String(props.src))}" srcset="${escapeAttribute(
    String(props.srcSet),
  )}" sizes="${escapeAttribute(String(props.sizes))}" width="${width}" height="${height}" alt="${escapeAttribute(
    alt,
  )}"${className ? ` class="${className}"` : ""} decoding="async"${
    priority ? ' fetchpriority="high"' : ' loading="lazy" fetchpriority="auto"'
  }>`;
}

function referenceProjectCard(project: (typeof projects)[number]) {
  const categories = project.categories
    .map((category) => category.toLowerCase().replaceAll(" ", ""))
    .join(" ");
  const technologies = `<div class="pills">${(
    project.cardTechnologies ?? project.technologies.slice(0, 6)
  )
    .map(
      (technology) =>
        `<span class="pill">${escapeAttribute(cardTechnologyLabel(technology))}</span>`,
    )
    .join("")}</div>`;

  return `<article class="project reveal" data-cat="${escapeAttribute(categories)}">
    <span class="project-num">02 / ${escapeAttribute(project.label ?? project.categories[0])}</span>
    <h3>${escapeAttribute(project.title)}</h3>
    <p>${escapeAttribute(project.description)}</p>
    <div class="visual"><div class="screen"></div></div>
    ${technologies}
    <div class="project-meta">
      <div class="project-links">
        <button class="mini case" type="button" data-case-study-slug="${escapeAttribute(project.slug)}">Case study</button>
        <a class="mini" href="${escapeAttribute(project.github)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeAttribute(project.title)} source code">Code ↗</a>
        <a class="mini" href="${escapeAttribute(project.live ?? "")}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeAttribute(project.title)} live application">Live ↗</a>
      </div>
    </div>
  </article>`;
}

function referenceSkillCard(group: (typeof skillGroups)[number]) {
  return `<article class="stack-card reveal">
    <h3>${escapeAttribute(group.title)}</h3>
    <div class="pills">${group.skills
      .map((skill) => `<span class="pill">${escapeAttribute(skill)}</span>`)
      .join("")}</div>
  </article>`;
}

function referenceExperienceCard(item: (typeof experience)[number]) {
  const roleCards = item.roles
    .map(
      (role) => `<section class="company-role-card">
        <div class="role-card-head">
          <h4>${escapeAttribute(role.title)}</h4>
          <span>${escapeAttribute(role.date.toUpperCase())}</span>
        </div>
        <ul>${role.bullets.map((bullet) => `<li>${escapeAttribute(bullet)}</li>`).join("")}</ul>
      </section>`,
    )
    .join("");

  return `<article class="job reveal">
    <div class="job-date">${escapeAttribute(item.date.toUpperCase())}</div>
    <div class="job-card">
      <div class="job-top">
        <div>
          <h3>${escapeAttribute(item.role)}</h3>
          <div class="company">${escapeAttribute(item.company)}</div>
        </div>
      </div>
      <div class="company-role-stack">${roleCards}</div>
    </div>
  </article>`;
}

function getReferenceBody() {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "akshay-engineering-portfolio-final-responsive-fixed.html",
    ),
    "utf8",
  );
  const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
  if (!body) throw new Error("Reference HTML body could not be read.");
  const tickerSkills = [
    "React.js Development",
    "Redux State Management",
    "React DevTools",
    "Node.js REST APIs",
    "Express.js",
    "PostgreSQL & SQL",
    "Jest Framework",
    "API Integration",
    "Debugging & Optimization",
    "Business Web Apps",
  ];
  const tickerSequence = tickerSkills
    .map((skill) => `<span>${escapeAttribute(skill)}</span><i>✦</i>`)
    .join("");

  let homepage = body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(
      /src="data:image\/[^;]+;base64,[^"]+"/i,
      optimizedImage({
        src: "/images/profile/nitin-chavan-profile.png",
        alt: "Nitin Chavan",
        width: 1122,
        height: 1402,
        sizes: "(max-width: 680px) 44vw, 24vw",
        priority: true,
      }).slice(5, -1),
    );

  const projectsWithoutCaseStudies = projects.filter(
    (project) => project.hasCaseStudy === false,
  );
  if (projectsWithoutCaseStudies.length > 0) {
    homepage = homepage.replace(
      '<article class="project reveal" data-cat="fullstack ai backend">',
      `${projectsWithoutCaseStudies.map(referenceProjectCard).join("")}<article class="project reveal" data-cat="fullstack ai backend">`,
    );
    let projectNumber = 0;
    homepage = homepage.replace(
      /(<span class="project-num">)\d{2}(\s*\/)/g,
      (_match, opening: string, separator: string) =>
        `${opening}${String(++projectNumber).padStart(2, "0")}${separator}`,
    );
  }

  projects.forEach((project, index) => {
    homepage = homepage.replace(
      '<div class="visual"><div class="screen"></div></div>',
      `<div class="visual">${optimizedImage({
        src: project.image,
        alt: project.imageAlt,
        width: 1600,
        height: 900,
        sizes:
          index === 0
            ? "(max-width: 980px) 100vw, 66vw"
            : "(max-width: 680px) 100vw, 33vw",
        className: `screen project-image project-image--${project.imageFit}`,
        priority: index === 0,
      })}</div>`,
    );
  });

  let cardIndex = 0;
  homepage = homepage.replace(
    /<article\s+class="project(?: featured)? reveal"[\s\S]*?<\/article>/g,
    (card) => {
      const project = projects[cardIndex++];
      if (!project) return card;
      const chips = `<div class="pills">${(
        project.cardTechnologies ?? project.technologies.slice(0, 6)
      )
        .map(
          (technology) =>
            `<span class="pill">${escapeAttribute(cardTechnologyLabel(technology))}</span>`,
        )
        .join("")}</div>`;
      return card
        .replace(/\s*<div class="pills">[\s\S]*?<\/div>/, "")
        .replace(/<button class="mini case"[\s\S]*?<\/button\s*>/, "")
        .replace(/(<div class="visual">[\s\S]*?<\/div>)/, `$1${chips}`)
        .replace(
          '<div class="project-links">',
          `<div class="project-links"><button class="mini case" type="button" data-case-study-slug="${escapeAttribute(project.slug)}">Case study</button>`,
        )
        .replace(
          /(<article\s+class="project(?: featured)? reveal")/,
          `$1 data-project-slug="${escapeAttribute(project.slug)}"`,
        );
    },
  );

  homepage = homepage.replace(
    /\s*<div\s+id="caseModal"[\s\S]*?<\/div>\s*<\/div>\s*(?=<div id="error404">)/,
    "",
  );

  let testimonialIndex = 0;
  homepage = homepage.replace(
    /<div class="proof-avatar">[\s\S]*?<\/div>/g,
    () => {
      const testimonial = testimonials[testimonialIndex++];
      const initials = testimonial.name
        .split(" ")
        .map((part) => part[0])
        .join("");
      return `<div class="proof-avatar">${optimizedImage({
        src: testimonial.image,
        alt: testimonial.name,
        width: 160,
        height: 160,
        sizes: "62px",
      })}<span class="avatar-fallback" aria-hidden="true">${initials}</span></div>`;
    },
  );

  homepage = homepage.replace(
    /<a\s+class="btn magnetic"\s+href="https:\/\/drive\.google\.com[\s\S]*?<\/a\s*>/,
    `<a class="btn magnetic" href="${siteConfig.resume}" download="${siteConfig.resumeDownloadName}" aria-label="Download Nitin Chavan resume">Download resume ↓</a>`,
  );

  homepage = homepage
    .replace(
      "$ initializing akshay.portfolio",
      "$ initializing nitin.portfolio",
    )
    .replace(
      '<a class="brand" href="#top">ARC<i>.</i></a>',
      '<a class="brand" href="#top">NC</a>',
    )
    .replace(
      "AVAILABLE FOR HIGH-OWNERSHIP ENGINEERING ROLES",
      "FULL STACK DEVELOPER - REACT.JS | NODE.JS | REST APIS",
    )
    .replace(
      /<h1>[\s\S]*?<\/h1>\s*<div class="role-line">[\s\S]*?<\/div>/,
      `<h1>
              Full Stack Developer<br /><span class="outline">React.js & Node.js</span><br /><span class="hero-title-sub">Product Web Apps</span>
            </h1>
            <div class="role-line">
              React.js <span>·</span> Redux <span>·</span> Node.js <span>·</span> Express.js <span>·</span> PostgreSQL
            </div>`,
    )
    .replace(
      /<p class="hero-copy">[\s\S]*?<\/p>\s*<div class="hero-actions">/,
      `<p class="hero-copy">
              I'm <strong>Nitin Chavan</strong>, a full stack developer with
              <strong>2+ years</strong> of production experience delivering
              responsive web applications with React.js, Redux, Node.js,
              Express.js and PostgreSQL. I turn business requirements into clean
              interfaces, reliable APIs and maintainable product workflows.
            </p>
            <div class="hero-actions">`,
    )
    .replaceAll("akshayrchavan07@gmail.com", siteConfig.email)
    .replaceAll("Akshay Ram Chavan", "Nitin Chavan")
    .replaceAll("Akshay", "Nitin")
    .replaceAll("+91 81800 04924", siteConfig.phone)
    .replaceAll("+91 8180004924", siteConfig.phone)
    .replaceAll("https://linkedin.com/in/akshayrchavan07", siteConfig.linkedin)
    .replaceAll(
      "https://www.linkedin.com/in/akshay-chavan23/",
      siteConfig.linkedin,
    )
    .replace("React / Next.js", "React.js / Redux")
    .replace("Node / APIs", "Node.js / REST APIs")
    .replace("Kafka / Redis", "PostgreSQL / SQL")
    .replace("Ship / Measure", "Debug / Optimize")
    .replace(
      /<span class="floating-tag ft1">[\s\S]*?<span class="floating-tag ft4">[\s\S]*?<\/span>/,
      `<div class="profile-info-grid">
              <article class="profile-info-card">
                <span>Core stack</span>
                <strong>React.js, Redux, Node.js</strong>
                <p>Production-ready interfaces, REST APIs, PostgreSQL queries, validation and reusable components.</p>
              </article>
              <article class="profile-info-card">
                <span>Delivery focus</span>
                <strong>Business web applications</strong>
                <p>Business-focused screens, stable data flows, debugging, optimization and production support.</p>
              </article>
            </div>`,
    )
    .replace("Explore engineering work", "View projects")
    .replaceAll("FRONTEND SYSTEMS", "REACT.JS DEVELOPMENT")
    .replaceAll("BACKEND APIs", "NODE.JS REST APIs")
    .replaceAll("EVENT-DRIVEN ARCHITECTURE", "POSTGRESQL & SQL")
    .replaceAll("PRODUCT DELIVERY", "BUSINESS WEB APPS")
    .replaceAll("PERFORMANCE ENGINEERING", "DEBUGGING & OPTIMIZATION")
    .replace(
      /<div class="ticker-track">[\s\S]*?<\/div>/,
      `<div class="ticker-track">${tickerSequence}${tickerSequence}</div>`,
    )
    .replace(
      /<div class="metrics reveal">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<section class="section" id="about">/,
      `</div>
      </section>
      <section class="section" id="about">`,
    )
    .replace(
      /\s*<section class="section">\s*<div class="wrap">\s*<\/div>\s*<\/section>\s*(?=<section class="section" id="about">)/,
      "\n      ",
    )
    .replace(
      /<p class="about-copy reveal">[\s\S]*?<\/p>\s*<div class="principles">/,
      `<p class="about-copy reveal">
              I work across <strong>React.js and Redux interfaces</strong>,
              <strong>Node.js and Express.js APIs</strong>, and
              <strong>PostgreSQL-backed business workflows</strong>. I build
              forms, reusable components, validations, API response handling,
              SQL queries, data-heavy screens and performance-minded UI.
              HRMS and payroll are strong production examples, and the same
              execution fits SaaS products, dashboards, admin panels, internal
              tools and customer-facing applications.
            </p>
            <div class="principles">`,
    )
    .replace(
      /<div class="stack-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<section class="section">/,
      `<div class="stack-grid">
            ${skillGroups.map(referenceSkillCard).join("")}
          </div>
        </div>
      </section>
      <section class="section">`,
    )
    .replace("One engineer.", "Skill stack built")
    .replace("Multiple layers.", "for production.")
    .replace(
      /I’m strongest where product complexity crosses boundaries:[\s\S]*?testing and delivery\./,
      "A production-focused full stack toolkit for responsive interfaces, REST API workflows, PostgreSQL-backed screens, testing, debugging and delivery.",
    )
    .replace("Request to outcome.", "Requirement to working product.")
    .replace("Production request lifecycle", "Feature delivery flow")
    .replace("How I think", "Engineering delivery")
    .replace("SIMULATED LIVE TRAFFIC", "Production-ready workflow")
    .replace(
      /A portfolio for an engineer should show the system,[\s\S]*?only the screen\./,
      "I connect the requirement, UI state, API behavior and database flow so features are easier to build, test and maintain.",
    )
    .replace("CLIENT<br />React / Next", "UI LAYER<br />React / Redux")
    .replace("EDGE + AUTH<br />JWT / OAuth", "FORMS + STATE<br />Validation")
    .replace(
      "DATA + EVENTS<br />Postgres / Redis / Kafka",
      "DATA LAYER<br />PostgreSQL / SQL",
    )
    .replace(
      /Validation, authorization, rate limiting, transactions,[\s\S]*?belong to the same product experience\./,
      "Requirement analysis, form validation, REST API integration, PostgreSQL queries, error handling, testing and user feedback stay connected in one delivery flow.",
    )
    .replace(
      /<div class="timeline">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<section class="section" id="projects">/,
      `<div class="timeline">
            ${experience.map(referenceExperienceCard).join("")}
          </div>
        </div>
      </section>
      <section class="section" id="projects">`,
    )
    .replace("Selected work", "Selected projects")
    .replace(
      "Products, systems<br />and experiments.",
      "Full stack work<br />with product ownership.",
    )
    .replace(
      /Filter by the layer you are hiring for\. Every project is presented\s+as an engineering decision, not only a screenshot\./,
      "A selected set of web applications showing frontend execution, backend APIs, database work, integrations and responsive product delivery.",
    )
    .replace("Machine coding & labs", "Applied profile")
    .replace(
      "How I practice under constraints.",
      "Production modules, UI delivery and engineering foundation.",
    )
    .replace(
      "Focused builds that expose architecture, state, APIs and reasoning—useful signals beyond polished projects.",
      "A focused view of the production modules, frontend delivery and education behind my profile.",
    )
    .replace("MACHINE CODING / WORKFLOW", "PRODUCTION HRMS")
    .replace(
      /Drag, drop and connect configurable nodes;[\s\S]*?FastAPI\./,
      "Delivered HRMS modules for onboarding, Aadhaar verification, payroll, overtime, arrears, exit management and full and final settlement workflows.",
    )
    .replace(
      "React Â· ReactFlow Â· Zustand Â· FastAPI",
      "React.js - Redux - Node.js - Express.js - PostgreSQL",
    )
    .replace(
      "Task Management System",
      "Chatboard - Customer Engagement Frontend",
    )
    .replace("FULL-STACK / PRODUCT", "FRONTEND WORKFLOW")
    .replace(
      /Authentication, task lifecycle, reusable UI and API-driven state[\s\S]*?full-stack exercise\./,
      "Developed responsive customer engagement screens including the agent panel, chat list, message threads, user session panel, notification states and empty views.",
    )
    .replace(
      "React Â· Node Â· Express Â· MongoDB",
      "React.js - Redux - Tailwind CSS",
    )
    .replace("AI Video Collaboration", "Education")
    .replace("SYSTEM DESIGN / PRODUCT", "EDUCATION")
    .replace(
      /Architecture exploration for uploads, processing, version[\s\S]*?AI\/media pipelines\./,
      "B.Tech in Mechanical Engineering from Punyashlok Ahilyadevi Holkar Solapur University, completed in 2023 with CGPA 7.5.",
    )
    .replace(
      "React Â· Go Â· Python Â· Kafka Â· Redis",
      "B.Tech - Diploma - Mechanical Engineering",
    )
    .replace(
      /<h2>How I practice<br \/>under constraints\.<\/h2>/,
      "<h2>Production work,<br />UI delivery and education.</h2>",
    )
    .replace(
      /Focused builds that expose architecture, state, APIs and\s+reasoning[\s\S]{0,80}?polished projects\./,
      "Production HRMS modules, responsive frontend screens and engineering fundamentals in one clear snapshot.",
    )
    .replace(
      /<footer>React[\s\S]{0,80}?ReactFlow[\s\S]{0,80}?FastAPI<\/footer>/,
      "<footer>React.js - Redux - Node.js - Express.js - PostgreSQL - REST APIs</footer>",
    )
    .replace(
      /<footer>React[\s\S]{0,80}?Node[\s\S]{0,80}?Express[\s\S]{0,80}?MongoDB<\/footer>/,
      "<footer>React.js - Redux - REST API Integration - Responsive UI</footer>",
    )
    .replace(
      /<footer>React[\s\S]{0,80}?Go[\s\S]{0,80}?Python[\s\S]{0,80}?Kafka[\s\S]{0,80}?Redis<\/footer>/,
      "<footer>B.Tech - Diploma - Mechanical Engineering</footer>",
    )
    .replace("Engineering signals", "Delivery signals")
    .replace("GitHub contribution signal", "Git, GitLab & team workflow")
    .replace(
      /Placeholder â€” connect GitHub GraphQL\/API during deployment for[\s\S]*?live contribution data\./,
      "Experienced with Git and GitLab for version control, code handoffs and agile team workflows.",
    )
    .replace("Problem-solving practice", "API and issue practice")
    .replace(
      "150+ LeetCode problems solved",
      "Postman, debugging and Jira-based delivery",
    )
    .replace(
      "Profile: leetcode.com/akshayrchavan07",
      "Focused on API testing, UI debugging and task tracking",
    )
    .replace("Professional signals", "Delivery signals")
    .replace(
      /<h2>Consistency over<br \/>one-off brilliance\.<\/h2>/,
      "<h2>Reliable habits<br />behind every build.</h2>",
    )
    .replace(
      /Live widgets can be connected later; the design reserves space\s+without blocking the initial load\./,
      "The delivery habits I use to build maintainable UI, test APIs, debug issues and work clearly with a team.",
    )
    .replace("Version control", "Git, GitLab & team workflow")
    .replace(
      /Placeholder[\s\S]{0,120}?live contribution data\./,
      "Version control, branch updates, code handoffs and Jira task updates for production web application delivery.",
    )
    .replace("API and issue practice", "API testing & issue resolution")
    .replace(
      "Postman, debugging and Jira-based delivery",
      "Postman, API response checks, UI debugging and Jira delivery",
    )
    .replace(
      "Focused on API testing, UI debugging and task tracking",
      "I validate request and response flows, handle edge cases, trace UI issues and close tasks with clear technical notes.",
    )
    .replace("Social proof", "Collaboration feedback")
    .replace(
      /<h2>Trusted in the<br \/>details\.<\/h2>/,
      "<h2>Feedback on<br />delivery and ownership.</h2>",
    )
    .replace(
      /Feedback from people who have collaborated with me on product and\s+engineering work\./,
      "Feedback from collaborators on communication, ownership, responsiveness and attention to delivery details.",
    )
    .replace(
      /Need an engineer<br \/>who can own it\?/,
      "Need a developer<br />who can deliver?",
    )
    .replace("Start a conversation", "Let's build something")
    .replace(
      /Need a developer<br \/>who can ship\?/,
      "Need a full stack<br />developer?",
    )
    .replace(
      /Open to Full Stack, Backend, Frontend and Product Engineering[\s\S]*?execution quality matters\./,
      "Available for Full Stack Developer, React.js Developer and Node.js Developer roles. I bring 2+ years of production experience across responsive UI, REST API integration, PostgreSQL-backed workflows, debugging and feature delivery.",
    )
    .replace("Project inquiry", "Role or product discussion")
    .replace("EmailJS integration ready", "Direct message ready")
    .replace("Tell me about the role, product or problem...", "Tell me about the role, product or requirement...")
    .replace(
      /<a\s+class="btn magnetic"\s+href="https:\/\/github\.com\/NitinChavan7"[\s\S]*?<\/a\s*>/,
      "",
    )
    .replace(
      /<span>Â© 2026 Nitin Chavan Â· Bengaluru, India<\/span>/,
      "<span>© 2026 Nitin Chavan · Hyderabad, India</span>",
    )
    .replace(
      /<span>© 2026 Nitin Chavan · Bengaluru, India<\/span>/,
      "<span>© 2026 Nitin Chavan · Hyderabad, India</span>",
    )
    .replace(
      /<span>© 2026 Nitin Chavan · Bengaluru, India<\/span\s*>/,
      "<span>© 2026 Nitin Chavan · Hyderabad, India</span>",
    )
    .replace(
      /<button class="icon-btn" id="show404">View 404<\/button>/,
      "",
    )
    .replace(/(<a href="#top">Back to top ↑<\/a>)\s*·\s*<\/span>/, "$1</span>")
    .replace(/(<a href="#top">Back to top ↑<\/a>)\s*·\s*(\s*<\/span\s*>)/, "$1$2")
    .replace("Contact Nitin", "Contact Nitin");

  homepage = homepage
    .replaceAll(
      `href="mailto:${siteConfig.email}"`,
      `href="${siteConfig.emailGmail}" target="_blank" rel="noopener noreferrer"`,
    )
    .replaceAll('href="tel:+918180004924"', 'href="tel:+919325997861"')
    .replaceAll('href="tel:+91 9325997861"', 'href="tel:+919325997861"');

  homepage = homepage
    .replace("https://linkedin.com/in/akshayrchavan07", siteConfig.linkedin)
    .replace(
      '<li><a href="#contact">Contact</a></li>',
      '<li><a href="#contact">Contact</a></li><li class="mobile-theme"><span>Theme</span><button id="mobileThemeBtn" type="button" aria-pressed="false"><span data-theme-state>Dark</span><span data-theme-icon aria-hidden="true">☾</span></button></li><li class="mobile-hire"><a href="#contact">Hire me ↗</a></li>',
    )
    .replace(
      /<a class="icon-btn hire"\s+href="mailto:akshayrchavan07@gmail\.com"/,
      '<a class="icon-btn hire" href="#contact"',
    )
    .replace(
      /<a\s+class="btn primary magnetic"\s+href="mailto:akshayrchavan07@gmail\.com"\s*>Email me ↗<\/a\s*>/,
      `<a class="btn primary magnetic" href="${siteConfig.emailGmail}" target="_blank" rel="noopener noreferrer" aria-label="Email Nitin Chavan using Gmail">Email me ↗</a>`,
    );

  return homepage;
}

export default function Home() {
  return (
    <>
      <div
        className="reference-page-shell"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: getReferenceBody() }}
      />
      <EmailJsContactBridge />
      <ProjectCaseStudyModal />
      <Script src="/reference-runtime.js" strategy="afterInteractive" />
    </>
  );
}
