import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

test("homepage preserves the reference structure and interactions", async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.waitForTimeout(1900);

  await expect(page.locator("nav .brand")).toHaveText("ARC.");
  await expect(
    page.locator("#primaryNav li:not(.mobile-hire):not(.mobile-theme) a"),
  ).toHaveText(["About", "Experience", "Projects", "Labs", "Contact"]);
  await expect(page.locator("nav .hire")).toHaveText("Hire me ↗");
  await expect(page.locator("#cmdBtn")).toHaveText("⌘K");
  await expect(page.locator("#themeBtn")).toHaveAttribute(
    "aria-label",
    /Switch to (?:light|dark) mode/,
  );
  await expect(
    page.getByRole("heading", { name: /BUILDING PRODUCT SYSTEMS/i }),
  ).toBeVisible();
  await expect(page.locator(".portrait img")).toBeVisible();
  await expect(page.locator(".floating-tag")).toHaveText([
    "React / Next.js",
    "Node / APIs",
    "Kafka / Redis",
    "Ship / Measure",
  ]);
  await expect(page.locator(".ring .sat")).toHaveCount(2);
  await expect(page.locator(".project")).toHaveCount(12);
  const matchEngineCard = page.locator(".project", {
    hasText: "Three-Way Match Engine",
  });
  await expect(matchEngineCard).toHaveCount(1);
  await expect(
    matchEngineCard.getByRole("button", { name: /case study/i }),
  ).toHaveAttribute("data-case-study-slug", "three-way-match-engine");
  await expect(
    matchEngineCard.getByRole("link", { name: /source code/i }),
  ).toHaveAttribute(
    "href",
    "https://github.com/NitinChavan7/Three-Way-Match-Engine",
  );
  await expect(
    matchEngineCard.getByRole("link", { name: /live application/i }),
  ).toHaveAttribute("href", "https://three-way-match-engine-web.vercel.app/");
  await expect(matchEngineCard.locator(".project-links a")).toHaveCount(2);
  await expect(
    page.locator('a[href="/projects/three-way-match-engine"]'),
  ).toHaveCount(0);
  const traceGraphCard = page.locator(".project", { hasText: "TraceGraph" });
  await expect(traceGraphCard).toHaveCount(1);
  await expect(
    traceGraphCard.getByRole("button", { name: /case study/i }),
  ).toHaveAttribute("data-case-study-slug", "tracegraph");
  await expect(traceGraphCard.locator(".pills .pill")).toHaveText([
    "Next.js",
    "TypeScript",
    "CognoDB",
    "openCypher",
    "Neo4j Driver",
    "React Flow",
  ]);
  await expect(
    traceGraphCard.getByRole("link", { name: /source code/i }),
  ).toHaveAttribute(
    "href",
    "https://github.com/NitinChavan7/TraceGraph-Software-Incident-Dependency-Intelligence",
  );
  await expect(
    traceGraphCard.getByRole("link", { name: /live application/i }),
  ).toHaveAttribute(
    "href",
    "https://trace-graph-software-incident-depen.vercel.app/",
  );
  const pipelineCard = page.locator(".project", {
    hasText: "Pipeline Builder",
  });
  await expect(pipelineCard).toHaveCount(1);
  await expect(
    pipelineCard.getByRole("button", { name: /case study/i }),
  ).toHaveAttribute("data-case-study-slug", "pipeline-builder");
  await expect(
    pipelineCard.getByRole("link", { name: /source code/i }),
  ).toHaveAttribute(
    "href",
    "https://github.com/NitinChavan7/Pipeline-Builder",
  );
  await expect(
    pipelineCard.getByRole("link", { name: /live application/i }),
  ).toHaveAttribute("href", "https://vector-shift-alpha.vercel.app/");
  await expect(pipelineCard.locator(".project-links a")).toHaveCount(2);
  await expect(page.locator(".project > .pills")).toHaveCount(12);
  await expect(page.locator(".project .case")).toHaveCount(12);
  for (const card of await page.locator(".project").all()) {
    const chips = card.locator(":scope > .pills .pill");
    expect(await chips.count()).toBeGreaterThan(0);
    expect(await chips.count()).toBeLessThanOrEqual(6);
  }
  await expect(page.locator(".project.featured .placeholder")).toContainText(
    "Auth",
  );
  await expect(page.locator(".project.featured .case")).toHaveCount(1);
  await expect(
    page.locator('a[href="/projects/pipeline-builder"]'),
  ).toHaveCount(0);
  await expect(
    page.locator("#labs .lab", { hasText: "Pipeline Builder" }),
  ).toHaveCount(1);
  await expect(page.locator("body")).not.toContainText(
    /VectorShift|Vector Shift/,
  );
  await expect(page.locator("#stars")).toHaveCount(1);
  await expect(page.locator(".spot")).toHaveCount(1);

  if (!isMobile) {
    await page.locator("#cmdBtn").click();
    await expect(page.locator("#palette")).toHaveClass(/open/);
    await page.keyboard.press("Escape");
    await expect(page.locator("#palette")).not.toHaveClass(/open/);
  }

  await page.locator('.filter[data-filter="ai"]').click();
  await expect(page.locator(".project:not(.hidden)")).toHaveCount(3);
  await expect(
    page.locator(".project:not(.hidden)", {
      hasText: "Three-Way Match Engine",
    }),
  ).toHaveCount(1);
  await expect(
    page.locator(".project:not(.hidden)", { hasText: "Pipeline Builder" }),
  ).toHaveCount(0);
  await expect(
    page.locator(".project:not(.hidden)", { hasText: "TraceGraph" }),
  ).toHaveCount(0);
  await page.locator('.filter[data-filter="fullstack"]').click();
  await expect(page.locator(".project:not(.hidden)")).toHaveCount(6);
  await page.locator('.filter[data-filter="frontend"]').click();
  await expect(page.locator(".project:not(.hidden)")).toHaveCount(7);
  await page.locator('.filter[data-filter="backend"]').click();
  await expect(page.locator(".project:not(.hidden)")).toHaveCount(6);
  await page.locator('.filter[data-filter="all"]').click();
  await expect(page.locator(".project:not(.hidden)")).toHaveCount(12);

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

test("one scroll engine preserves anchors, history, and fallbacks", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-scroll-engine",
    isMobile ? "native" : "locomotive",
  );

  if (isMobile) await page.locator("#menuBtn").click();
  await page.locator('a[href="#experience"]').first().click();
  await expect(page).toHaveURL(/#experience$/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  const experienceScroll = await page.evaluate(() => scrollY);

  if (isMobile) await page.locator("#menuBtn").click();
  await page.locator('a[href="#projects"]').first().click();
  await expect(page).toHaveURL(/#projects$/);
  const projectsScroll = await page.evaluate(() => scrollY);
  expect(projectsScroll).toBeGreaterThan(experienceScroll);

  await page.goBack();
  await expect(page).toHaveURL(/#experience$/);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeLessThan(projectsScroll);

  await page.goForward();
  await expect(page).toHaveURL(/#projects$/);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(experienceScroll);

  await expect(page.locator("#conversationForm input").first()).toBeEditable();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
});

test("main scrollbar stays hidden without blocking scrolling", async ({
  page,
}) => {
  await page.goto("/");
  const scrollbar = await page.evaluate(() => ({
    html: getComputedStyle(document.documentElement).scrollbarWidth,
    body: getComputedStyle(document.body).scrollbarWidth,
    htmlDisplay: getComputedStyle(
      document.documentElement,
      "::-webkit-scrollbar",
    ).display,
    bodyDisplay: getComputedStyle(document.body, "::-webkit-scrollbar").display,
  }));
  expect(scrollbar.html).toBe("none");
  expect(scrollbar.body).toBe("none");
  expect(scrollbar.htmlDisplay).toBe("none");
  expect(scrollbar.bodyDisplay).toBe("none");

  await page.evaluate(() => scrollTo(0, 500));
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await expect(page.locator("html")).not.toHaveClass(/scrollbar-visible/);
  await expect(page.locator("body")).not.toHaveClass(/scrollbar-visible/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
});

test("mobile navigation follows the reference behavior", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  await page.goto("/");
  const menu = page.locator("#menuBtn");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("nav")).toHaveClass(/menu-open/);
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("mobile theme control toggles both ways and persists", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  await page.addInitScript(() => {
    if (!localStorage.getItem("arc-theme")) {
      localStorage.setItem("arc-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
  await page.goto("/");
  await page.waitForTimeout(1900);
  const menuButton = page.locator("#menuBtn");
  await menuButton.click();
  const themeToggle = page.locator("#mobileThemeBtn");

  await expect(themeToggle).toBeVisible();
  await expect(themeToggle).toHaveAttribute(
    "aria-label",
    "Switch to light mode",
  );
  await expect(themeToggle).toHaveAttribute("aria-pressed", "false");
  await themeToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(themeToggle).toHaveAttribute(
    "aria-label",
    "Switch to dark mode",
  );
  await expect(themeToggle).toHaveAttribute("aria-pressed", "true");

  await page.reload();
  await page.waitForTimeout(1900);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.locator("#menuBtn").click();
  await page.locator("#mobileThemeBtn").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  expect(
    await page
      .locator("#primaryNav")
      .evaluate((menu) => menu.scrollWidth - menu.clientWidth),
  ).toBeLessThanOrEqual(1);
});

test("project routes, resume, and not-found route remain available", async ({
  page,
}) => {
  for (const slug of [
    "rabbit-ecommerce",
    "ai-quick-blog",
    "quick-chat",
    "giphy-clone",
    "netflix-gpt",
    "ochi-agency",
    "obys-agency",
    "sundown-studio",
    "lazarev-agency",
  ]) {
    await page.goto(`/projects/${slug}`);
    await expect(page.locator(".case-image img")).toBeVisible();
  }
  expect((await page.goto("/not-a-real-route"))?.status()).toBe(404);
  expect((await page.goto("/projects/three-way-match-engine"))?.status()).toBe(
    404,
  );
  expect((await page.goto("/projects/pipeline-builder"))?.status()).toBe(404);
  expect((await page.goto("/projects/tracegraph"))?.status()).toBe(404);
  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/projects/three-way-match-engine");
  expect(sitemap).not.toContain("/projects/pipeline-builder");
  expect(sitemap).not.toContain("/projects/tracegraph");
  expect(
    (await page.request.get("/resume/nitin-chavan-resume.pdf")).ok(),
  ).toBeTruthy();
});

test("all project case studies share one modal without changing history", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(1900);
  const initialUrl = page.url();
  const cases = page.locator(".project .case");
  await expect(cases).toHaveCount(12);
  for (let index = 0; index < 12; index += 1) {
    const trigger = cases.nth(index);
    const slug = await trigger.getAttribute("data-case-study-slug");
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page.locator("#caseModal")).toHaveCount(1);
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      await dialog.getByRole("heading").first().textContent(),
    ).toBeTruthy();
    expect(page.url()).toBe(initialUrl);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(page.url()).toBe(initialUrl);
    expect(slug).toBeTruthy();
  }
});

test("Rabbit alone uses a single-column mobile footer", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await page.waitForTimeout(1900);
  const rabbit = page.locator('.project[data-project-slug="rabbit-ecommerce"]');
  const meta = rabbit.locator(".project-meta");
  const feature = rabbit.locator(".placeholder");
  const actions = rabbit.locator(".project-links");

  await expect(feature).toHaveText("Auth · Payments · Orders · Admin");
  await expect(
    actions.getByRole("button", { name: "Case study" }),
  ).toBeVisible();
  await expect(actions.getByRole("link", { name: /Code/i })).toHaveAttribute(
    "href",
    "https://github.com/NitinChavan7/MERN_Rabbit_Ecommerce",
  );
  await expect(actions.getByRole("link", { name: /Live/i })).toHaveAttribute(
    "href",
    "https://mern-rabbit-ecommerce-7e9j.vercel.app/",
  );

  const layout = await meta.evaluate((element) => {
    const featureElement = element.querySelector<HTMLElement>(".placeholder")!;
    const actionElement = element.querySelector<HTMLElement>(".project-links")!;
    const featureBox = featureElement.getBoundingClientRect();
    const actionBox = actionElement.getBoundingClientRect();
    const actionStyle = getComputedStyle(actionElement);
    return {
      direction: getComputedStyle(element).flexDirection,
      featureAboveActions: featureBox.bottom <= actionBox.top,
      featureWidth: featureBox.width,
      metaWidth: element.getBoundingClientRect().width,
      actionJustify: actionStyle.justifyContent,
      actionWrap: actionStyle.flexWrap,
    };
  });

  if (isMobile) {
    expect(layout.direction).toBe("column");
    expect(layout.featureAboveActions).toBe(true);
    expect(layout.featureWidth).toBeCloseTo(layout.metaWidth, 0);
    expect(layout.actionJustify).toBe("flex-start");
    expect(layout.actionWrap).toBe("wrap");
  } else {
    expect(layout.direction).toBe("row");
  }

  await actions.getByRole("button", { name: "Case study" }).click();
  await expect(page.getByRole("dialog", { name: /Rabbit/i })).toBeVisible();
  await page.keyboard.press("Escape");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
});

test("case-study modal owns scrolling and restores the background", async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.waitForTimeout(1900);

  const trigger = page.locator(
    '.project .case[data-case-study-slug="rabbit-ecommerce"]',
  );
  await trigger.scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise(requestAnimationFrame));
  await trigger.click();

  const dialog = page.getByRole("dialog");
  const scrollArea = dialog.locator(".case-study-scroll");
  await expect(dialog).toBeVisible();
  await expect(scrollArea).toHaveCount(1);
  await expect(page.locator("body")).toHaveCSS("position", "fixed");
  await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
  if (!isMobile) {
    await expect(page.locator("html")).toHaveAttribute("data-scroll-paused");
  }
  const effectiveBackgroundPosition = () =>
    page.evaluate(() => {
      if (getComputedStyle(document.body).position === "fixed") {
        return Math.abs(Number.parseFloat(document.body.style.top) || 0);
      }
      return window.scrollY;
    });
  const lockedBackgroundPosition = await effectiveBackgroundPosition();
  expect(lockedBackgroundPosition).toBeGreaterThan(0);
  expect(
    await scrollArea.evaluate((element) => ({
      overflowY: getComputedStyle(element).overflowY,
      bounded: element.clientHeight < element.scrollHeight,
      touchAction: getComputedStyle(element).touchAction,
    })),
  ).toMatchObject({ overflowY: "auto", bounded: true, touchAction: "pan-y" });

  if (isMobile) {
    const box = await scrollArea.boundingBox();
    expect(box).not.toBeNull();
    const session = await page.context().newCDPSession(page);
    const x = box!.x + box!.width / 2;
    const startY = box!.y + box!.height * 0.75;
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y: startY }],
    });
    for (const distance of [80, 160, 240, 320]) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x, y: startY - distance }],
      });
    }
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await session.detach();
  } else {
    await scrollArea.hover();
    await page.mouse.wheel(0, 650);
  }
  await expect
    .poll(() => scrollArea.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  await expect(scrollArea).toHaveClass(/is-modal-scrolling/);
  expect(await effectiveBackgroundPosition()).toBe(lockedBackgroundPosition);

  await scrollArea.focus();
  await page.keyboard.press("Home");
  await expect
    .poll(() => scrollArea.evaluate((element) => element.scrollTop))
    .toBe(0);
  await page.keyboard.press("PageDown");
  await expect
    .poll(() => scrollArea.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  await page.keyboard.press("End");
  await expect
    .poll(() => scrollArea.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  expect(await effectiveBackgroundPosition()).toBe(lockedBackgroundPosition);

  await expect(scrollArea).not.toHaveClass(/is-modal-scrolling/, {
    timeout: 1200,
  });
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(
    lockedBackgroundPosition,
  );
  await expect(page.locator("html")).not.toHaveAttribute("data-scroll-paused");
  expect(errors).toEqual([]);
});

test("reference source remains present and untouched by runtime", async () => {
  const reference = path.join(
    process.cwd(),
    "akshay-engineering-portfolio-final-responsive-fixed.html",
  );
  expect(fs.existsSync(reference)).toBe(true);
});

test("experience section shows one Futurionic progression card", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(1900);
  await expect(page.locator(".job-card h3")).toHaveText([
    "Futurionic Private Limited",
  ]);
  await expect(page.locator(".job-card .company")).toHaveText([
    "Hyderabad | Intern to Full-time progression",
  ]);
  await expect(page.locator(".job-date")).toHaveText(["JAN 2024 - JUL 2026"]);
  await expect(page.locator(".role-card-head h4")).toHaveText([
    "Software Developer",
    "Software Developer Intern",
  ]);
  await expect(page.locator(".role-card-head span")).toHaveText([
    "APR 2024 - JUL 2026",
    "JAN 2024 - APR 2024",
  ]);
  await expect(page.locator("#experience")).not.toContainText(
    /Banking Domain|E-Commerce Domain|Fintech|SaaS/,
  );
});

test("form interaction tolerates key events without a key value", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.waitForTimeout(1900);
  await page.evaluate(() => dispatchEvent(new Event("keydown")));
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.locator("#conversationForm button[type='submit']").click();
  await expect(page.locator("#formStatus")).not.toBeEmpty();
  expect(errors).toEqual([]);
});

test("honeypot is present without consuming contact-form space", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(1900);
  const field = page.locator(".honeypot-field");
  const input = field.locator('input[name="companyWebsite"]');
  await expect(field).toHaveCount(1);
  await expect(field).toHaveAttribute("aria-hidden", "true");
  await expect(input).toHaveAttribute("tabindex", "-1");
  expect(
    await input.evaluate((element) => element.hasAttribute("hidden")),
  ).toBe(false);

  const styles = await field.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      position: style.position,
      opacity: style.opacity,
      pointerEvents: style.pointerEvents,
      width: box.width,
      height: box.height,
    };
  });
  expect(styles).toMatchObject({
    position: "absolute",
    opacity: "0",
    pointerEvents: "none",
    width: 1,
    height: 1,
  });
});

test("three-font typography system loads without serif fallbacks", async ({
  page,
}) => {
  const fontRequestFailures: string[] = [];
  const consoleErrors: string[] = [];
  page.on("requestfailed", (request) => {
    if (/\.(?:woff2?|ttf|otf)(?:\?|$)/i.test(request.url())) {
      fontRequestFailures.push(request.url());
    }
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const expected = [
    [".hero h1", "Manrope"],
    [".hero-copy", "Geist"],
    [".eyebrow", "JetBrains Mono"],
    [".metric strong", "Manrope"],
    [".project h3", "Manrope"],
    [".project p", "Geist"],
    [".job-date", "JetBrains Mono"],
    [".conversation-form input", "Geist"],
  ];
  for (const [selector, family] of expected) {
    await expect
      .poll(() =>
        page
          .locator(selector)
          .first()
          .evaluate((element) => getComputedStyle(element).fontFamily),
      )
      .toContain(family);
  }

  expect(
    await page.evaluate(async () => {
      const families = ["Geist", "Manrope", "JetBrains Mono"];
      await Promise.all(
        families.map((family) => document.fonts.load(`400 16px "${family}"`)),
      );
      return families.every((family) =>
        document.fonts.check(`400 16px "${family}"`),
      );
    }),
  ).toBe(true);
  expect(
    await page.locator("body *").evaluateAll((elements) =>
      elements
        .filter((element) => {
          const style = getComputedStyle(element);
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            element.getClientRects().length > 0
          );
        })
        .some((element) =>
          /Times New Roman|Georgia/i.test(getComputedStyle(element).fontFamily),
        ),
    ),
  ).toBe(false);
  expect(fontRequestFailures).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("local images, résumé download, and ticker alignment are correct", async ({
  page,
}) => {
  const projectPaths = [
    "/images/projects/rabbit-ecommerce.png",
    "/images/projects/three-way-engine.png",
    "/images/projects/tracegraph.png",
    "/images/projects/pipeline-builder.png",
    "/images/projects/ai-quick-blog.png",
    "/images/projects/quick-chat.png",
    "/images/projects/giphy-clone.jpg",
    "/images/projects/netflix-gpt.jpg",
    "/images/projects/ochi-agency.png",
    "/images/projects/obys-agency.png",
    "/images/projects/sundown-studio.jpg",
    "/images/projects/lazarev-agency.jpg",
  ];
  const testimonialPaths = [
    "/images/testimonials/rahul-chavan.jpg",
    "/images/testimonials/shirish-yenganti.png",
    "/images/testimonials/muzzamil-shaikh.png",
    "/images/testimonials/muzammil-alloli.png",
  ];
  await page.goto("/");
  await page.waitForTimeout(1900);

  const projectImages = page.locator(".project .visual img");
  await expect(projectImages).toHaveCount(12);
  for (const [index, assetPath] of projectPaths.entries()) {
    await expect(projectImages.nth(index)).toHaveAttribute(
      "src",
      new RegExp(encodeURIComponent(assetPath).replaceAll("%", "%")),
    );
    expect((await page.request.get(assetPath)).ok()).toBe(true);
  }

  const profile = page.locator(".portrait img");
  await expect(profile).toHaveAttribute("alt", "Akshay Ram Chavan");
  await expect(profile).toHaveAttribute(
    "src",
    /akshay-ram-chavan-transparent\.png/,
  );
  expect(
    await profile.evaluate((image) => getComputedStyle(image).filter),
  ).toBe("none");
  expect(
    (
      await page.request.get(
        "/images/profile/akshay-ram-chavan-transparent.png",
      )
    ).ok(),
  ).toBe(true);

  const testimonialImages = page.locator(".proof-avatar img");
  await expect(testimonialImages).toHaveCount(4);
  for (const [index, assetPath] of testimonialPaths.entries()) {
    await expect(testimonialImages.nth(index)).toHaveAttribute(
      "src",
      new RegExp(encodeURIComponent(assetPath).replaceAll("%", "%")),
    );
    expect((await page.request.get(assetPath)).ok()).toBe(true);
  }

  const resume = page.locator(".hero-actions a").nth(1);
  await expect(resume).toHaveAttribute(
    "href",
    "/resume/nitin-chavan-resume.pdf",
  );
  await expect(resume).toHaveAttribute(
    "download",
    "Akshay-Ram-Chavan-Resume.pdf",
  );
  await expect(resume).not.toHaveAttribute("target", "_blank");
  expect(
    (await page.request.get("/resume/nitin-chavan-resume.pdf")).ok(),
  ).toBe(true);

  expect(
    await page.evaluate(() => {
      const track = document.querySelector(".ticker-track");
      const text = document.querySelector(".ticker-track span");
      const separator = document.querySelector(".ticker-track i");
      if (!track || !text || !separator) return false;
      const textBox = text.getBoundingClientRect();
      const separatorBox = separator.getBoundingClientRect();
      return (
        getComputedStyle(track).alignItems === "center" &&
        ["flex", "inline-flex"].includes(getComputedStyle(text).display) &&
        ["flex", "inline-flex"].includes(getComputedStyle(separator).display) &&
        Math.abs(
          textBox.top +
            textBox.height / 2 -
            (separatorBox.top + separatorBox.height / 2),
        ) < 0.5
      );
    }),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
});

test("profile, actions, skills, domains, and full-width project media are correct", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await page.waitForTimeout(1900);

  const profile = page.locator(".portrait img");
  await expect(profile).toHaveAttribute(
    "src",
    /akshay-ram-chavan-transparent\.png/,
  );
  const portraitStyle = await profile.evaluate((image) => {
    const imageStyle = getComputedStyle(image);
    const wrapperStyle = getComputedStyle(image.parentElement!);
    return {
      filter: imageStyle.filter,
      borderRadius: wrapperStyle.borderRadius,
      boxShadow: wrapperStyle.boxShadow,
      background: wrapperStyle.backgroundColor,
    };
  });
  expect(portraitStyle.filter).toBe("none");
  expect(portraitStyle.borderRadius).toBe("50%");
  expect(portraitStyle.boxShadow).not.toContain("0px 0px 0px 12px");
  expect(portraitStyle.background).toBe("rgba(0, 0, 0, 0)");

  const hire = isMobile
    ? page.locator(".navlinks .mobile-hire a")
    : page.locator("nav .hire");
  await expect(hire).toHaveAttribute("href", "#contact");
  if (isMobile) {
    await page.locator("#menuBtn").click();
    await expect(hire).toBeVisible();
    await hire.focus();
    await expect(hire).toBeFocused();
    await hire.click();
    await expect(page.locator("#menuBtn")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  } else {
    await hire.focus();
    await expect(hire).toBeFocused();
  }

  const capabilityCards = page.locator(".stack-card");
  await expect(capabilityCards).toHaveCount(6);
  const frontend = capabilityCards.filter({ hasText: "Frontend Systems" });
  const backend = capabilityCards.filter({ hasText: "Backend & APIs" });
  const delivery = capabilityCards.filter({ hasText: "Quality & Delivery" });
  await expect(frontend.getByText("JavaScript", { exact: true })).toHaveCount(
    1,
  );
  await expect(backend.getByText("Go", { exact: true })).toHaveCount(1);
  await expect(backend.getByText("gRPC", { exact: true })).toHaveCount(1);
  await expect(delivery.getByText("Grafana", { exact: true })).toHaveCount(1);
  await expect(delivery.getByText("Kubernetes", { exact: true })).toHaveCount(
    1,
  );

  const bankingRole = page.locator(".job-card", {
    hasText: "Product Engineer Intern",
  });
  const commerceRole = page.locator(".job-card", {
    hasText: "Junior Software Developer",
  });
  await expect(bankingRole).not.toContainText("Banking Domain");
  await expect(bankingRole.locator(".job-top > .pill")).toHaveText("Banking");
  await expect(commerceRole).not.toContainText("E-Commerce Domain");
  await expect(commerceRole.locator(".job-top > .pill")).toHaveText("E-Comm");
  await expect(
    page
      .locator(".job-card", {
        hasText: "Software Development Engineer I",
      })
      .locator(".job-top > .pill"),
  ).toHaveText("AI CRM");

  const mediaResults = await page
    .locator(".project .visual")
    .evaluateAll((wrappers) =>
      wrappers.map((wrapper) => {
        const image = wrapper.querySelector("img")!;
        const wrapperBox = wrapper.getBoundingClientRect();
        const imageBox = image.getBoundingClientRect();
        const style = getComputedStyle(image);
        return {
          widthDelta: Math.abs(wrapperBox.width - imageBox.width),
          maxWidth: style.maxWidth,
          objectFit: style.objectFit,
          aspectRatio:
            Number(image.getAttribute("width")) /
            Number(image.getAttribute("height")),
        };
      }),
    );
  expect(mediaResults).toHaveLength(12);
  for (const [index, media] of mediaResults.entries()) {
    expect(media.widthDelta).toBeLessThanOrEqual(2);
    expect(media.maxWidth).toBe("none");
    expect(media.objectFit).toBe(
      [1, 2, 3].includes(index) ? "contain" : "cover",
    );
    expect(media.aspectRatio).toBeGreaterThan(1);
  }

  const gmail = page.getByRole("link", {
    name: "Email Akshay Ram Chavan using Gmail",
  });
  await expect(gmail).toHaveAttribute(
    "href",
    "https://mail.google.com/mail/?view=cm&fs=1&to=akshayrchavan07@gmail.com",
  );
  await expect(gmail).toHaveAttribute("target", "_blank");
  await expect(gmail).toHaveAttribute("rel", "noopener noreferrer");

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);

  await page.goto("/projects/rabbit-ecommerce");
  await expect(page.locator(".hire-button")).toHaveAttribute(
    "href",
    "/#contact",
  );
});
