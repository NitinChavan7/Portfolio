/* Generated from the immutable reference HTML. */

      const $ = (s, c = document) => c.querySelector(s),
        $$ = (s, c = document) => [...c.querySelectorAll(s)];
      const markReady = () =>
        setTimeout(() => document.body.classList.add("ready"), 1750);
      if (document.readyState === "complete") markReady();
      else window.addEventListener("load", markReady, { once: true });
      const root = document.documentElement;
      const saved =
        localStorage.getItem("arc-theme") || localStorage.getItem("theme");
      if (saved) root.dataset.theme = saved;
      const themeButton = $("#themeBtn"),
        mobileThemeButton = $("#mobileThemeBtn");
      function syncThemeControls() {
        const dark = root.dataset.theme !== "light";
        themeButton?.setAttribute(
          "aria-label",
          dark ? "Switch to light mode" : "Switch to dark mode",
        );
        mobileThemeButton?.setAttribute(
          "aria-label",
          dark ? "Switch to light mode" : "Switch to dark mode",
        );
        mobileThemeButton?.setAttribute("aria-pressed", String(!dark));
        const state = mobileThemeButton?.querySelector("[data-theme-state]");
        const icon = mobileThemeButton?.querySelector("[data-theme-icon]");
        if (state) state.textContent = dark ? "Dark" : "Light";
        if (icon) icon.textContent = dark ? "☾" : "☀";
      }
      function toggleTheme() {
        root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("arc-theme", root.dataset.theme);
        localStorage.setItem("theme", root.dataset.theme);
        syncThemeControls();
      }
      themeButton.onclick = toggleTheme;
      if (mobileThemeButton) mobileThemeButton.onclick = toggleTheme;
      syncThemeControls();
      let progressFrame = 0;
      const updateProgress = () => {
        progressFrame = 0;
        const h = document.documentElement.scrollHeight - innerHeight;
        $("#progress").style.width = (h > 0 ? scrollY / h : 0) * 100 + "%";
      };
      window.addEventListener(
        "scroll",
        () => {
          if (!progressFrame)
            progressFrame = requestAnimationFrame(updateProgress);
        },
        { passive: true },
      );
      const reveal = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              reveal.unobserve(e.target);
            }
          }),
        { threshold: 0.12 },
      );
      $$(".reveal").forEach((e) => reveal.observe(e));
      const countObs = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target,
              target = +el.dataset.count,
              suf = el.dataset.suffix || "",
              start = performance.now();
            function tick(t) {
              let p = Math.min(1, (t - start) / 1400),
                v = target * p;
              el.textContent =
                (target % 1 ? v.toFixed(1) : Math.floor(v)) + suf;
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            countObs.unobserve(el);
          }),
        { threshold: 0.5 },
      );
      $$("[data-count]").forEach((e) => countObs.observe(e));
      const spot = $(".spot"),
        cur = $(".cursor"),
        dot = $(".cursor-dot");
      let mx = innerWidth / 2,
        my = innerHeight / 2,
        cx = mx,
        cy = my,
        cursorFrame = 0;
      addEventListener(
        "mousemove",
        (e) => {
          mx = e.clientX;
          my = e.clientY;
          spot.style.left = mx + "px";
          spot.style.top = my + "px";
          dot.style.transform = `translate(${mx - 2.5}px,${my - 2.5}px)`;
          if (!cursorFrame && !document.hidden)
            cursorFrame = requestAnimationFrame(cursorLoop);
        },
        { passive: true },
      );
      function cursorLoop() {
        cx += (mx - cx) * 0.14;
        cy += (my - cy) * 0.14;
        cur.style.transform = `translate(${cx - 17}px,${cy - 17}px)`;
        if (Math.abs(mx - cx) > 0.1 || Math.abs(my - cy) > 0.1)
          cursorFrame = requestAnimationFrame(cursorLoop);
        else cursorFrame = 0;
      }
      document.addEventListener("visibilitychange", () => {
        if (document.hidden && cursorFrame) {
          cancelAnimationFrame(cursorFrame);
          cursorFrame = 0;
        }
      });
      $$("a,button,.project,.node").forEach((e) => {
        e.onmouseenter = () => cur.classList.add("active");
        e.onmouseleave = () => cur.classList.remove("active");
      });
      $$(".magnetic").forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px,${(e.clientY - r.top - r.height / 2) * 0.12}px)`;
        });
        el.addEventListener("mouseleave", () => (el.style.transform = ""));
      });
      $$(".project").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          if (innerWidth < 980) return;
          const r = card.getBoundingClientRect(),
            x = (e.clientX - r.left) / r.width - 0.5,
            y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 4}deg) translateY(-4px)`;
        });
        card.addEventListener("mouseleave", () => (card.style.transform = ""));
      });
      $$(".filter").forEach(
        (b) =>
          (b.onclick = () => {
            $$(".filter").forEach((x) => x.classList.remove("active"));
            b.classList.add("active");
            const f = b.dataset.filter;
            $$(".project").forEach((p) =>
              p.classList.toggle(
                "hidden",
                f !== "all" && !p.dataset.cat.includes(f),
              ),
            );
          }),
      );
      $$("[data-copy]").forEach(
        (b) =>
          (b.onclick = async () => {
            try {
              await navigator.clipboard.writeText(b.dataset.copy);
              const old = b.innerHTML;
              b.textContent = "Email copied ✓";
              setTimeout(() => (b.innerHTML = old), 1500);
            } catch {
              location.href = "mailto:" + b.dataset.copy;
            }
          }),
      );
      const pal = $("#palette"),
        input = $("#cmdInput");
      function openPal() {
        pal.classList.add("open");
        setTimeout(() => input.focus(), 20);
      }
      function closePal() {
        pal.classList.remove("open");
        input.value = "";
        $$(".command").forEach((c) => (c.style.display = "flex"));
      }
      $("#cmdBtn").onclick = openPal;
      addEventListener("keydown", (e) => {
        const key = typeof e.key === "string" ? e.key.toLowerCase() : "";
        if ((e.metaKey || e.ctrlKey) && key === "k") {
          e.preventDefault();
          pal.classList.contains("open") ? closePal() : openPal();
        }
        if (e.key === "Escape") {
          closePal();
          $("#error404").classList.remove("show");
        }
        if (
          key === "e" &&
          !["INPUT", "TEXTAREA"].includes(
            document.activeElement?.tagName || "",
          )
        )
          navigator.clipboard?.writeText("nitin.k.chavan1001@gmail.com");
      });
      pal.onclick = (e) => {
        if (e.target === pal) closePal();
      };
      input.oninput = () => {
        const q = input.value.toLowerCase();
        $$(".command").forEach(
          (c) =>
            (c.style.display = c.textContent.toLowerCase().includes(q)
              ? "flex"
              : "none"),
        );
      };
      $$(".command").forEach(
        (c) =>
          (c.onclick = () => {
            if (c.dataset.action === "theme") toggleTheme();
            if (c.dataset.go) {
              dispatchEvent(
                new CustomEvent("portfolio:navigate-hash", {
                  detail: { hash: c.dataset.go },
                }),
              );
            }
            closePal();
          }),
      );
      for (let i = 0; i < 286; i++) {
        const x = document.createElement("i");
        $("#heat").appendChild(x);
      }
      $("#show404")?.addEventListener("click", () =>
        $("#error404")?.classList.add("show"),
      );
      $("#close404")?.addEventListener("click", () =>
        $("#error404")?.classList.remove("show"),
      );
      if (location.hash === "#404") $("#error404")?.classList.add("show");
      const secs = $$("section[id]"),
        links = $$(".navlinks a");
      const navObs = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting)
              links.forEach((a) =>
                a.classList.toggle(
                  "active",
                  a.getAttribute("href") === "#" + e.target.id,
                ),
              );
          }),
        { rootMargin: "-45% 0px -50%" },
      );
      secs.forEach((s) => navObs.observe(s));
      // lightweight canvas particles; disabled by reduced motion
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const canvas = $("#stars"),
          ctx = canvas.getContext("2d");
        let pts = [];
        function resize() {
          canvas.width = innerWidth * devicePixelRatio;
          canvas.height = innerHeight * devicePixelRatio;
          ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
          pts = Array.from(
            { length: Math.min(70, Math.floor(innerWidth / 18)) },
            () => ({
              x: Math.random() * innerWidth,
              y: Math.random() * innerHeight,
              v: 0.08 + Math.random() * 0.18,
              r: 0.3 + Math.random() * 1,
            }),
          );
        }
        let starsFrame = 0;
        let starsResumeTimer = 0;
        const coarsePointer = matchMedia("(hover: none) and (pointer: coarse)");
        function startStars() {
          if (!document.hidden && !starsFrame) {
            starsFrame = requestAnimationFrame(draw);
          }
        }
        function draw() {
          starsFrame = 0;
          ctx.clearRect(0, 0, innerWidth, innerHeight);
          ctx.fillStyle = getComputedStyle(root).getPropertyValue("--dim");
          pts.forEach((p) => {
            p.y -= p.v;
            if (p.y < 0) p.y = innerHeight;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 7);
            ctx.fill();
          });
          startStars();
        }
        function pauseStarsDuringTouchScroll() {
          if (starsFrame) {
            cancelAnimationFrame(starsFrame);
            starsFrame = 0;
          }
          clearTimeout(starsResumeTimer);
          starsResumeTimer = window.setTimeout(startStars, 180);
        }
        addEventListener("resize", resize);
        if (coarsePointer.matches) {
          addEventListener("scroll", pauseStarsDuringTouchScroll, {
            passive: true,
          });
        }
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) {
            clearTimeout(starsResumeTimer);
            if (starsFrame) {
              cancelAnimationFrame(starsFrame);
              starsFrame = 0;
            }
          } else {
            startStars();
          }
        });
        resize();
        startStars();
      }

      // Testimonial carousel
      (() => {
        const track = document.querySelector(".proof-track");
        const slides = [...document.querySelectorAll("[data-proof-slide]")];
        const dots = [...document.querySelectorAll("[data-proof-dot]")];
        if (!track || !slides.length) return;
        let index = 0,
          timer;
        const show = (next) => {
          index = (next + slides.length) % slides.length;
          track.style.transform = `translateX(-${index * 100}%)`;
          dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
        };
        const restart = () => {
          clearInterval(timer);
          timer = setInterval(() => show(index + 1), 6500);
        };
        document
          .querySelector("[data-proof-prev]")
          ?.addEventListener("click", () => {
            show(index - 1);
            restart();
          });
        document
          .querySelector("[data-proof-next]")
          ?.addEventListener("click", () => {
            show(index + 1);
            restart();
          });
        dots.forEach((dot, i) =>
          dot.addEventListener("click", () => {
            show(i);
            restart();
          }),
        );
        show(0);
        restart();
      })();

      // Accessible mobile navigation
      (() => {
        const nav = document.querySelector('nav[aria-label="Primary"]');
        const button = document.getElementById("menuBtn");
        const menu = document.getElementById("primaryNav");
        if (!nav || !button || !menu) return;

        const setOpen = (open) => {
          nav.classList.toggle("menu-open", open);
          button.setAttribute("aria-expanded", String(open));
          button.setAttribute(
            "aria-label",
            open ? "Close mobile menu" : "Open mobile menu",
          );
          document.body.classList.toggle("mobile-menu-open", open);
        };

        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(!nav.classList.contains("menu-open"));
        });

        menu.querySelectorAll("a").forEach((link) => {
          link.addEventListener("click", () => setOpen(false));
        });

        document.addEventListener("click", (event) => {
          if (
            nav.classList.contains("menu-open") &&
            !nav.contains(event.target)
          )
            setOpen(false);
        });

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && nav.classList.contains("menu-open")) {
            setOpen(false);
            button.focus();
          }
        });

        window.addEventListener("resize", () => {
          if (window.innerWidth > 980) setOpen(false);
        });
      })();

if(document.readyState==="complete"&&!document.body.classList.contains("ready"))setTimeout(()=>document.body.classList.add("ready"),1750);
