import { useEffect } from "react";

/** One delegated listener for custom Material state layers, including routed content. */
export function useMaterialRipple() {
  useEffect(() => {
    const ripples = new Map<HTMLSpanElement, ReturnType<typeof setTimeout>>();
    function show(event: PointerEvent | KeyboardEvent) {
      if (event instanceof KeyboardEvent && (event.repeat || !["Enter", " "].includes(event.key))) {
        return;
      }
      if (event instanceof PointerEvent && event.button !== 0) {
        return;
      }
      if (!(event.target instanceof Element)) {
        return;
      }
      const host = event.target.closest<HTMLElement>(".md-state-layer");
      if (!host || host.matches(":disabled, [aria-disabled='true']")) {
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const bounds = host.getBoundingClientRect();
      const x = event instanceof PointerEvent ? event.clientX - bounds.left : bounds.width / 2;
      const y = event instanceof PointerEvent ? event.clientY - bounds.top : bounds.height / 2;
      const size = Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y)) * 2;
      const ripple = document.createElement("span");
      ripple.className = "md-ripple";
      ripple.setAttribute("aria-hidden", "true");
      Object.assign(ripple.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x - size / 2}px`,
        top: `${y - size / 2}px`,
      });
      host.append(ripple);
      ripples.set(
        ripple,
        setTimeout(() => {
          ripple.remove();
          ripples.delete(ripple);
        }, 650),
      );
    }
    document.addEventListener("pointerdown", show, { passive: true });
    document.addEventListener("keydown", show);
    return () => {
      document.removeEventListener("pointerdown", show);
      document.removeEventListener("keydown", show);
      for (const [ripple, timer] of ripples) {
        clearTimeout(timer);
        ripple.remove();
      }
    };
  }, []);
}
