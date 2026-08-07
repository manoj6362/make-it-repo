import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { splitWords } from "../lib/split.js";

gsap.registerPlugin(ScrollTrigger);

/* Masked word reveals for every [data-split] heading. Hero headings are
   prepared here but played by the intro timeline after the preloader. */
export function initSplitReveals() {
  document.querySelectorAll("[data-split]").forEach((el) => {
    const words = splitWords(el);
    gsap.set(words, { yPercent: 116 });
    if (el.closest(".hero")) return;
    gsap.to(words, {
      yPercent: 0,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.045,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}

/* Generic fade + rise for supporting content. */
export function initReveals() {
  document.querySelectorAll("[data-reveal]").forEach((el, i) => {
    gsap.from(el, {
      y: 44,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: (i % 4) * 0.05,
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}

/* Parallax inside case-study media frames. */
export function initParallax() {
  document.querySelectorAll("[data-parallax-media] img").forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });
}

/* Hero: type lifts and fades as the next section takes over. */
export function initHeroScroll() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  gsap.to(hero.querySelector(".hero__inner"), {
    yPercent: -14,
    opacity: 0.25,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(hero.querySelector(".hero__aura"), {
    yPercent: 22,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
  });
}

/* Process rail fills as the four steps pass through. */
export function initProcess() {
  const bar = document.querySelector("[data-process-bar]");
  const steps = document.querySelector(".process__steps");
  if (!bar || !steps) return;

  gsap.fromTo(
    bar,
    { width: "0%" },
    {
      width: "100%",
      ease: "none",
      scrollTrigger: { trigger: steps, start: "top 70%", end: "bottom 75%", scrub: 0.4 },
    }
  );

  gsap.utils.toArray("[data-step]").forEach((step) => {
    gsap.fromTo(
      step,
      { scale: 0.97 },
      {
        scale: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: step, start: "top 92%", end: "top 55%", scrub: 0.6 },
      }
    );
  });
}

/* Reading progress bar. */
export function initProgress(lenis) {
  const bar = document.getElementById("progressBar");
  lenis.on("scroll", ({ progress }) => {
    bar.style.width = (progress * 100).toFixed(2) + "%";
  });
}
