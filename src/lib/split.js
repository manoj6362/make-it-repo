/* Lightweight word splitter: wraps each word in an overflow-hidden span
   with an inner <i> that can be translated for masked reveals. */
export function splitWords(el) {
  if (el.dataset.splitDone === "true") return [];
  const text = el.textContent.trim().replace(/\s+/g, " ");
  const frag = document.createDocumentFragment();
  const inners = [];

  text.split(" ").forEach((word, i, arr) => {
    const wrap = document.createElement("span");
    wrap.className = "split-word";
    const inner = document.createElement("i");
    inner.textContent = word;
    wrap.appendChild(inner);
    frag.appendChild(wrap);
    if (i < arr.length - 1) frag.appendChild(document.createTextNode(" "));
    inners.push(inner);
  });

  el.textContent = "";
  el.appendChild(frag);
  el.dataset.splitDone = "true";
  return inners;
}

export function splitChars(el) {
  const text = el.textContent.trim();
  el.textContent = "";
  return [...text].map((ch) => {
    const i = document.createElement("i");
    i.textContent = ch;
    i.style.display = "inline-block";
    el.appendChild(i);
    return i;
  });
}
