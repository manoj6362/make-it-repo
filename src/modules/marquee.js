import gsap from "gsap";

const CLIENTS = ["Sitemark", "Inspire", "SnapShot", "Vertigo", "Umbrella", "Network", "Lumen", "Northwind"];
const STRIP = ["Featured works", "Selected 2024 \u2014 2026", "Case studies"];
const CTA_WORDS = ["Let\u2019s work together"];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function fill(selector, build) {
  const track = document.querySelector(selector);
  if (!track) return;
  track.replaceChildren(...build.flat());
}

/* Fills the repeating tracks that are authored empty in the markup. */
export function buildTracks() {
  fill(
    ".clients__track",
    CLIENTS.map((name) => {
      const card = el("div", "client", name);
      card.append(el("sup", null, "\u00ae"));
      return card;
    })
  );

  fill(
    ".strip__track",
    STRIP.map((s) => [el("span", null, s), el("b")])
  );

  fill(
    ".cta__track",
    CTA_WORDS.map((s) => el("span", null, s))
  );
}

function gapOf(track) {
  const g = parseFloat(getComputedStyle(track).columnGap || "0");
  return Number.isNaN(g) ? 0 : g;
}

/* Seamless, scroll-reactive marquee. The authored set is cloned until the
   track is wide enough that the wrap point never enters the viewport. */
export function initMarquees(lenis) {
  const rows = [...document.querySelectorAll("[data-marquee]")];
  if (!rows.length) return;

  let velocity = 0;
  lenis.on("scroll", ({ velocity: v }) => {
    velocity = v;
  });

  const instances = rows.map((row) => {
    const track = row.firstElementChild;
    const originals = [...track.children];
    const gap = gapOf(track);
    const base = track.scrollWidth + gap;

    let copies = 1;
    while (base * copies < window.innerWidth * 2 + base && copies < 14) {
      originals.forEach((node) => track.appendChild(node.cloneNode(true)));
      copies += 1;
    }

    const inst = {
      track,
      base,
      offset: parseFloat(row.dataset.speed) < 0 ? -base : 0,
      speed: parseFloat(row.dataset.speed || "0.5"),
      paused: false,
    };

    if (row.hasAttribute("data-pausable")) {
      row.addEventListener("pointerenter", () => (inst.paused = true));
      row.addEventListener("pointerleave", () => (inst.paused = false));
    }
    return inst;
  });

  gsap.ticker.add(() => {
    const boost = 1 + Math.min(Math.abs(velocity) * 0.05, 3.5);
    instances.forEach((i) => {
      if (i.paused) return;
      i.offset -= i.speed * boost;
      if (i.offset <= -i.base) i.offset += i.base;
      if (i.offset > 0) i.offset -= i.base;
      i.track.style.transform = `translate3d(${i.offset}px,0,0)`;
    });
  });
}
