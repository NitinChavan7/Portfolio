"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Download, ExternalLink, Mail, Moon, Search } from "lucide-react";
import { siteConfig } from "@/config/site";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const commands = [
    ...siteConfig.nav.map((item) => ({
      label: `Go to ${item.label}`,
      icon: Search,
      run: () =>
        window.dispatchEvent(
          new CustomEvent("portfolio:navigate-hash", {
            detail: { hash: item.href },
          }),
        ),
    })),
    {
      label: "Download résumé",
      icon: Download,
      run: () => {
        const link = document.createElement("a");
        link.href = siteConfig.resume;
        link.download = siteConfig.resumeDownloadName;
        link.click();
      },
    },
    {
      label: "Copy email",
      icon: Mail,
      run: () => navigator.clipboard.writeText(siteConfig.email),
    },
    {
      label: "Toggle theme",
      icon: Moon,
      run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    },
    siteConfig.github
      ? {
          label: "Open GitHub",
          icon: ExternalLink,
          run: () =>
            window.open(siteConfig.github, "_blank", "noopener,noreferrer"),
        }
      : null,
    siteConfig.linkedin
      ? {
          label: "Open LinkedIn",
          icon: ExternalLink,
          run: () =>
            window.open(siteConfig.linkedin, "_blank", "noopener,noreferrer"),
        }
      : null,
  ].filter((command) => command !== null);
  useEffect(() => {
    const globalKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
      }
    };
    addEventListener("keydown", globalKey);
    return () => removeEventListener("keydown", globalKey);
  }, [open, setOpen]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement;
    dialog.current?.focus();
    document.body.style.overflow = "hidden";
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((value) => (value + 1) % commands.length);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((value) => (value - 1 + commands.length) % commands.length);
      }
      if (event.key === "Enter") {
        commands[active]?.run();
        setOpen(false);
      }
      if (event.key === "Tab") event.preventDefault();
    };
    addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [active, commands, open, setOpen]);
  if (!open) return null;
  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) =>
        event.target === event.currentTarget && setOpen(false)
      }
    >
      <div
        className="command-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        ref={dialog}
        tabIndex={-1}
      >
        <div className="command-title">
          <Search size={18} /> Jump anywhere <kbd>Esc</kbd>
        </div>
        <div role="listbox" aria-label="Commands">
          {commands.map((command, index) => (
            <button
              key={command.label}
              role="option"
              aria-selected={active === index}
              className={active === index ? "active" : ""}
              onMouseEnter={() => setActive(index)}
              onClick={() => {
                command.run();
                setOpen(false);
              }}
            >
              <command.icon size={17} />
              {command.label}
              <span>↵</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
