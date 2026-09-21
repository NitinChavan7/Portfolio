"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

export function Header({ onPalette }: { onPalette: () => void }) {
  const pathname = usePathname();
  const contactHref = pathname === "/" ? "#contact" : "/#contact";
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const key = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab" && headerRef.current) {
        const focusable = [
          ...headerRef.current.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          ),
        ].filter((element) => element.offsetParent !== null);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const resize = () => innerWidth >= 900 && setOpen(false);
    const outside = (event: PointerEvent) =>
      open &&
      !headerRef.current?.contains(event.target as Node) &&
      setOpen(false);
    addEventListener("keydown", key);
    addEventListener("resize", resize);
    addEventListener("pointerdown", outside);
    if (open) {
      requestAnimationFrame(() =>
        headerRef.current?.querySelector<HTMLElement>("nav a")?.focus(),
      );
    }
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", key);
      removeEventListener("resize", resize);
      removeEventListener("pointerdown", outside);
    };
  }, [open]);

  return (
    <header className="site-header" ref={headerRef}>
      <Link className="brand" href="/" aria-label="NC home">
        NC
      </Link>
      <nav
        id="primary-navigation"
        aria-label="Primary"
        className={open ? "nav-open" : ""}
      >
        {siteConfig.nav.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <button
          className="nav-command-mobile"
          type="button"
          onClick={() => {
            setOpen(false);
            onPalette();
          }}
        >
          Command palette <kbd>⌘K</kbd>
        </button>
        <Link
          className="nav-hire-mobile"
          href={contactHref}
          onClick={() => setOpen(false)}
        >
          Hire me ↗
        </Link>
      </nav>
      <div className="header-actions">
        <button
          className="icon-button palette-trigger"
          onClick={onPalette}
          aria-label="Open command palette"
        >
          <kbd>⌘K</kbd>
        </button>
        <button
          className="icon-button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle color theme"
        >
          <Sun className="theme-icon theme-icon-sun" size={18} />
          <Moon className="theme-icon theme-icon-moon" size={18} />
        </button>
        <Link
          className="hire-button"
          href={contactHref}
          aria-label="Hire me — go to contact section"
        >
          Hire me ↗
        </Link>
        <button
          ref={menuButtonRef}
          className="icon-button menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
