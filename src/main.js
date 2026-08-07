import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { runPreloader } from "./modules/preloader.js";
import { initCursor, initMagnetic } from "./modules/cursor.js";
import { initNav, initScrollSpy } from "./modules/nav.js";
import { buildTracks, initMarquees } from "./modules/marquee.js";
import {
  initHeroScroll,
  initParallax,
  initProcess,
  initProgress,
  initReveals,
  initSplitReveals,
} from "./modules/reveal.js";
import { initFloat, initTilt } from "./modules/tilt.js";
import { initCounters } from "./modules/counters.js";
import { initFaq, initForm } from "./modules/ui.js";
import { initHeroCanvas } from "./modules/hero-canvas.js";
import { initObjectScene } from "./modules/object-scene.js";

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.6,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

buildTracks();
initCursor();
initMagnetic();
initNav(lenis);
initScrollSpy();
initMarquees(lenis);
initSplitReveals();
initReveals();
initParallax();
initHeroScroll();
initProcess();
initProgress(lenis);
initTilt();
initFloat();
initCounters();
initFaq();
initForm();
initHeroCanvas();
initObjectScene();

/* Hero intro is chained to the preloader so nothing animates behind it. */
const heroIntro = gsap
  .timeline({ paused: true })
  .to(".hero__title .split-word > i", {
    yPercent: 0,
    duration: 1.35,
    stagger: 0.05,
    ease: "power4.out",
  })
  .from(".badge", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, 0)
  .from(".hero__foot > *", { y: 34, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 0.15)
  .from(".scroll-cue", { opacity: 0, duration: 0.8, ease: "power2.out" }, 0.4)
  .from(".nav > *", { y: -24, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 0);

window.addEventListener("load", () => ScrollTrigger.refresh());

runPreloader().add(() => {
  heroIntro.play();
  ScrollTrigger.refresh();
});
