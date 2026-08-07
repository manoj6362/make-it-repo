import gsap from "gsap";

/* Sticky nav that hides on scroll down, plus the fullscreen panel menu. */
export function initNav(lenis) {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("menuToggle");
  const overlay = document.getElementById("overlay");
  const panels = overlay.querySelectorAll(".overlay__panels i");
  const inner = overlay.querySelector(".overlay__inner");
  const links = overlay.querySelectorAll("[data-overlay-link]");

  let last = 0;
  const onScroll = (y) => {
    nav.classList.toggle("is-stuck", y > 40);
    nav.classList.toggle("is-hidden", y > last && y > 320 && !document.body.classList.contains("menu-open"));
    last = y;
  };
  lenis.on("scroll", ({ scroll }) => onScroll(scroll));

  gsap.set(links, { yPercent: 110, opacity: 0 });

  const tl = gsap.timeline({ paused: true });
  tl.to(panels, { scaleY: 1, duration: 0.75, stagger: 0.06, ease: "expo.inOut" })
    .set(inner, { opacity: 1 }, 0.35)
    .to(links, { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.07, ease: "power4.out" }, 0.45)
    .from(overlay.querySelectorAll(".overlay__meta > div"), { y: 26, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, 0.6);

  let open = false;
  const setOpen = (next) => {
    if (next === open) return;
    open = next;
    document.body.classList.toggle("menu-open", open);
    overlay.classList.toggle("is-open", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      lenis.stop();
      tl.timeScale(1).play();
    } else {
      lenis.start();
      tl.timeScale(1.8).reverse();
    }
  };

  toggle.addEventListener("click", () => setOpen(!open));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      setOpen(false);
      lenis.scrollTo(target, { offset: -70, duration: 1.5 });
    });
  });
}

/* Highlights the nav item for the section currently in view. */
export function initScrollSpy() {
  const links = [...document.querySelectorAll("[data-link]")];
  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) =>
          l.classList.toggle("is-current", l.getAttribute("href") === "#" + entry.target.id)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => io.observe(s));
}
