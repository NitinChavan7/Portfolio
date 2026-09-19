import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

test("the protected reference HTML remains at the repository root", () => {
  expect(
    existsSync(
      resolve("akshay-engineering-portfolio-final-responsive-fixed.html"),
    ),
  ).toBe(true);
});

test("Locomotive Scroll is the only artificial scroll engine", () => {
  const providers = readFileSync("src/components/providers.tsx", "utf8");
  const smoothScroll = readFileSync(
    "src/components/smooth-scroll-provider.tsx",
    "utf8",
  );
  const packageJson = readFileSync("package.json", "utf8");
  const css = [
    readFileSync("src/app/globals.css", "utf8"),
    readFileSync("src/app/reference.css", "utf8"),
  ].join("\n");
  expect(providers.match(/<SmoothScrollProvider>/g)).toHaveLength(1);
  expect(smoothScroll.match(/new LocomotiveScrollConstructor/g)).toHaveLength(
    1,
  );
  expect(smoothScroll).toContain(".destroy()");
  expect(packageJson).toContain('"locomotive-scroll"');
  expect(packageJson).not.toMatch(/"lenis"/);
  expect(css).not.toMatch(/scroll-behavior:\s*smooth/);
});

test("cross-browser hidden scrollbar rules are present", () => {
  const css = [
    readFileSync("src/app/globals.css", "utf8"),
    readFileSync("src/app/reference.css", "utf8"),
  ].join("\n");
  const provider = readFileSync(
    "src/components/smooth-scroll-provider.tsx",
    "utf8",
  );
  expect(css).toContain("scrollbar-width: none");
  expect(css).toContain("-ms-overflow-style: none");
  expect(css).toContain("html::-webkit-scrollbar");
  expect(css).toContain("body::-webkit-scrollbar");
  expect(css).not.toContain("*::-webkit-scrollbar");
  expect(provider).not.toMatch(/scrollbar-visible|setTimeout/);
  expect(provider).not.toMatch(/addEventListener\(["']scroll["']/);
});

test("the old square-grid background is removed and reduced motion stops decoration", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  expect(css).not.toContain("48px 48px");
  expect(css).toContain(".global-signal");
  expect(css).toContain(".cursor-spotlight");
  expect(css).toMatch(/prefers-reduced-motion[\s\S]*\.global-signal/);
});

test("mobile native scrolling pauses the star repaint loop without changing desktop Locomotive", () => {
  const runtime = readFileSync("public/reference-runtime.js", "utf8");
  const smoothScroll = readFileSync(
    "src/components/smooth-scroll-provider.tsx",
    "utf8",
  );

  expect(runtime).toContain("(hover: none) and (pointer: coarse)");
  expect(runtime).toContain("pauseStarsDuringTouchScroll");
  expect(runtime).toMatch(
    /addEventListener\("scroll", pauseStarsDuringTouchScroll, \{\s*passive: true,/,
  );
  expect(runtime).toContain("cancelAnimationFrame(starsFrame)");
  expect(runtime).toContain("window.setTimeout(startStars, 180)");
  expect(smoothScroll).toContain('"(pointer: fine) and (hover: hover)"');
  expect(smoothScroll).toContain("lerp: 0.12");
  expect(smoothScroll).toContain("smoothWheel: true");
  expect(smoothScroll).toContain("syncTouch: false");
});

test("local assets and résumé configuration are centralized", () => {
  const projects = readFileSync("src/data/projects.ts", "utf8");
  const testimonials = readFileSync("src/data/testimonials.ts", "utf8");
  const site = readFileSync("src/config/site.ts", "utf8");
  const sourceFiles = [
    projects,
    testimonials,
    site,
    readFileSync("src/app/page.tsx", "utf8"),
    readFileSync("src/components/command-palette.tsx", "utf8"),
  ].join("\n");

  expect(projects.match(/\/images\/projects\//g)).toHaveLength(12);
  expect(testimonials.match(/\/images\/testimonials\//g)).toHaveLength(4);
  expect(site).toContain('resume: "/resume/nitin-chavan-resume.pdf"');
  expect(site).toContain('resumeDownloadName: "Nitin-Chavan-Resume.pdf"');
  expect(sourceFiles).not.toMatch(/drive\.google|drive\.usercontent/);
});

test("resume skills, domains, and email actions are centralized", () => {
  const skills = readFileSync("src/data/skills.ts", "utf8");
  const experience = readFileSync("src/data/experience.ts", "utf8");
  const site = readFileSync("src/config/site.ts", "utf8");

  expect(skills.match(/"JavaScript"/g)).toHaveLength(1);
  expect(skills).toContain('"PostgreSQL"');
  expect(skills).toContain('"Payroll"');
  expect(skills).toContain('"GitLab"');
  expect(experience).toContain('tag: "HRMS"');
  expect(experience).toContain('tag: "React"');
  expect(experience).toContain("Futurionic Private Limited");
  expect(site).toContain('emailMailto: "mailto:nitin.k.chavan1001@gmail.com"');
  expect(site).toContain(
    '"https://mail.google.com/mail/?view=cm&fs=1&to=nitin.k.chavan1001@gmail.com"',
  );
});
