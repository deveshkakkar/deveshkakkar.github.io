const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  try {
    const { animate, hover, inView, stagger } = await import("https://cdn.jsdelivr.net/npm/motion@13.1.0/+esm");

    animate(
      document.querySelectorAll(".masthead, .intro-panel, .side-column > .panel"),
      { opacity: [0, 1], y: [18, 0] },
      { duration: .55, delay: stagger(.07), ease: [.22, 1, .36, 1] }
    );

    inView(".main-column > .panel:not(.intro-panel)", element => {
      if (document.documentElement.classList.contains("motion-paused")) return;
      animate(element, { opacity: [.35, 1], y: [24, 0] }, { duration: .5, ease: [.22, 1, .36, 1] });
    }, { amount: .14 });

    document.querySelectorAll(".button, .system-node, .suggestions button").forEach(element => {
      hover(element, () => {
        if (document.documentElement.classList.contains("motion-paused")) return;
        animate(element, { scale: 1.035, y: -2 }, { type: "spring", stiffness: 420, damping: 28 });
        return () => animate(element, { scale: 1, y: 0 }, { type: "spring", stiffness: 420, damping: 28 });
      });
    });

    document.addEventListener("systemchange", event => {
      if (document.documentElement.classList.contains("motion-paused")) return;
      const selected = document.querySelector(`[data-system="${event.detail.selected}"]`);
      animate(selected, { scale: [1, 1.09, 1] }, { duration: .38, ease: "easeOut" });
      animate(".system-readout > *", { opacity: [0, 1], x: [10, 0] }, { duration: .32, delay: stagger(.035) });
    });

    document.addEventListener("logfilter", () => {
      if (document.documentElement.classList.contains("motion-paused")) return;
      animate(
        document.querySelectorAll(".log-entry:not([hidden])"),
        { opacity: [0, 1], x: [-8, 0] },
        { duration: .26, delay: stagger(.025), ease: "easeOut" }
      );
    });

    let pointerFrame = null;
    document.addEventListener("pointermove", event => {
      if (document.documentElement.classList.contains("motion-paused") || event.pointerType === "touch" || pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
        pointerFrame = null;
      });
    }, { passive: true });
  } catch (error) {
    document.documentElement.classList.add("motion-unavailable");
  }
}
