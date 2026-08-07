import gsap from "gsap";

/* Animated accordion that keeps <details> semantics intact. */
export function initFaq() {
  document.querySelectorAll(".qa").forEach((qa) => {
    const summary = qa.querySelector("summary");
    const body = qa.querySelector(".qa__body");
    gsap.set(body, { height: 0, opacity: 0 });

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = qa.hasAttribute("open");

      if (isOpen) {
        gsap.to(body, {
          height: 0,
          opacity: 0,
          duration: 0.45,
          ease: "power3.inOut",
          onComplete: () => qa.removeAttribute("open"),
        });
        return;
      }

      document.querySelectorAll(".qa[open]").forEach((other) => {
        if (other === qa) return;
        gsap.to(other.querySelector(".qa__body"), {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power3.inOut",
          onComplete: () => other.removeAttribute("open"),
        });
      });

      qa.setAttribute("open", "");
      gsap.fromTo(
        body,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.55, ease: "power3.out" }
      );
    });
  });
}

/* Client-side validation feedback for the brief form. */
export function initForm() {
  const form = document.getElementById("ctaForm");
  const note = document.getElementById("ctaNote");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = "Add your name and a valid email so we can reply.";
      gsap.fromTo(form, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.35)" });
      return;
    }

    note.textContent = "Brief received. We reply within one business day.";
    form.reset();
  });
}
