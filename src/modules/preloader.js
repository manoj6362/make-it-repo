import gsap from "gsap";
import { splitChars } from "../lib/split.js";

/* Percentage counter + curtain wipe. Resolves once the page is revealed. */
export function runPreloader() {
  const loader = document.getElementById("loader");
  const bar = document.getElementById("loaderBar");
  const count = document.getElementById("loaderCount");
  const word = loader.querySelector("[data-loader-word]");
  const chars = splitChars(word);

  document.body.classList.add("is-locked");

  gsap.set(chars, { yPercent: 120, opacity: 0 });

  const state = { value: 0 };
  const tl = gsap.timeline();

  tl.to(chars, {
    yPercent: 0,
    opacity: 1,
    duration: 0.9,
    stagger: 0.06,
    ease: "power4.out",
  })
    .to(
      state,
      {
        value: 100,
        duration: 2.1,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(state.value);
          count.textContent = v;
          bar.style.width = v + "%";
        },
      },
      0.1
    )
    .to(chars, {
      yPercent: -120,
      opacity: 0,
      duration: 0.6,
      stagger: 0.03,
      ease: "power3.in",
    })
    .to(
      [loader.querySelector(".loader__status"), loader.querySelector(".loader__count"), loader.querySelector(".loader__mark")],
      { opacity: 0, duration: 0.4, ease: "power2.out" },
      "<"
    )
    .to(loader.querySelector(".loader__curtain"), {
      scaleY: 1,
      duration: 0.9,
      ease: "expo.inOut",
    })
    .set(loader, { display: "none" })
    .add(() => {
      document.body.classList.remove("is-locked");
      document.body.dataset.loaded = "true";
    });

  return tl;
}
