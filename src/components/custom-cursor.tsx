"use client";

import { useEffect, useRef } from "react";

const interactiveSelector =
  "a, button, [role='button'], .project-card, .project, .floating-tag, .btn, .icon-btn, input, textarea, select, label";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = matchMedia("(pointer: fine) and (hover: hover)");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const root = document.documentElement;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const spotlight = spotlightRef.current;
    if (!dot || !ring || !spotlight) return;

    root.dataset.customCursor = "active";
    let targetX = -40;
    let targetY = -40;
    let dotX = targetX;
    let dotY = targetY;
    let ringX = targetX;
    let ringY = targetY;
    let spotlightX = targetX;
    let spotlightY = targetY;
    let frame = 0;
    let visible = false;

    const render = () => {
      dotX += (targetX - dotX) * 0.36;
      dotY += (targetY - dotY) * 0.36;
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      spotlightX += (targetX - spotlightX) * 0.09;
      spotlightY += (targetY - spotlightY) * 0.09;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      spotlight.style.transform = `translate3d(${spotlightX}px, ${spotlightY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(render);
    };
    const start = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(render);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        dot.dataset.visible = "true";
        ring.dataset.visible = "true";
        spotlight.dataset.visible = "true";
        visible = true;
      }
    };
    const hover = (event: PointerEvent) => {
      ring.dataset.hovering =
        event.target instanceof Element &&
        !!event.target.closest(interactiveSelector)
          ? "true"
          : "false";
      spotlight.dataset.hovering = ring.dataset.hovering;
    };
    const press = () => {
      ring.dataset.pressed = "true";
      dot.dataset.pressed = "true";
    };
    const release = () => {
      ring.dataset.pressed = "false";
      dot.dataset.pressed = "false";
    };
    const leave = () => {
      dot.dataset.visible = "false";
      ring.dataset.visible = "false";
      spotlight.dataset.visible = "false";
      visible = false;
    };
    const visibility = () => {
      if (document.hidden) stop();
      else start();
    };

    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerover", hover, { passive: true });
    addEventListener("pointerdown", press, { passive: true });
    addEventListener("pointerup", release, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    document.addEventListener("visibilitychange", visibility);
    start();

    return () => {
      stop();
      delete root.dataset.customCursor;
      removeEventListener("pointermove", move);
      removeEventListener("pointerover", hover);
      removeEventListener("pointerdown", press);
      removeEventListener("pointerup", release);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-core" aria-hidden="true" />
      <div ref={spotlightRef} className="cursor-spotlight" aria-hidden="true" />
    </>
  );
}
