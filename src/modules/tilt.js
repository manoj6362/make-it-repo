import gsap from "gsap";

/* Pointer-driven 3D tilt with a soft return, applied to cards and media. */
export function initTilt() {
  if (window.matchMedia("(hover: none)").matches) return;

  document.querySelectorAll("[data-tilt]").forEach((el) => {
    const max = parseFloat(el.dataset.tiltMax || "11");
    gsap.set(el, { transformPerspective: 900, transformOrigin: "center" });

    const rx = gsap.quickTo(el, "rotateX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(el, "rotateY", { duration: 0.6, ease: "power3" });
    const z = gsap.quickTo(el, "z", { duration: 0.6, ease: "power3" });

    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(-py * max);
      ry(px * max);
      z(30);
    });
    el.addEventListener("pointerleave", () => {
      rx(0);
      ry(0);
      z(0);
    });
  });
}

/* Anti-gravity float for elements that should never feel static. */
export function initFloat() {
  document.querySelectorAll(".reel__item, .client").forEach((el, i) => {
    gsap.to(el, {
      y: i % 2 ? -12 : 12,
      duration: 3.2 + (i % 5) * 0.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: i * 0.12,
    });
  });
}
