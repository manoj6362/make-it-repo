import gsap from "gsap";

/* Trailing ring + dot with contextual labels and magnetic buttons. */
export function initCursor() {
  if (window.matchMedia("(hover: none)").matches) return;

  const ring = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  const label = ring.querySelector(".cursor__label");

  const setRingX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
  const setRingY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" });
  const setDotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
  const setDotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

  window.addEventListener("pointermove", (e) => {
    setRingX(e.clientX);
    setRingY(e.clientY);
    setDotX(e.clientX);
    setDotY(e.clientY);
  });

  const hoverables = document.querySelectorAll(
    "a, button, summary, [data-cursor], .reel__item, .client, .voice, .step"
  );
  hoverables.forEach((el) => {
    el.addEventListener("pointerenter", () => {
      ring.classList.add("is-active");
      label.textContent = el.dataset.cursor || "";
    });
    el.addEventListener("pointerleave", () => {
      ring.classList.remove("is-active");
      label.textContent = "";
    });
  });
}

export function initMagnetic() {
  if (window.matchMedia("(hover: none)").matches) return;

  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = 0.32;
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "elastic.out(1, 0.4)" });

    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener("pointerleave", () => {
      xTo(0);
      yTo(0);
    });
  });
}
