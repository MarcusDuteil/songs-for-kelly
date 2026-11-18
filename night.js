(() => {
  "use strict";

  const night = document.querySelector("#night");
  const toggle = document.querySelector("#night-toggle");
  const stars = document.createDocumentFragment();

  for (let index = 0; index < 36; index++) {
    const fall = document.createElement("span");
    const orbit = document.createElement("span");
    const stream = index % 3;
    const position = Math.floor(index / 3);
    const duration = 32 + stream * 5;

    fall.className = "kelly-fall";
    fall.style.setProperty("--origin", `${12 + stream * 38}%`);
    fall.style.setProperty("--fall-duration", `${duration}s`);
    fall.style.setProperty("--orbit-duration", `${13 + stream * 2}s`);
    fall.style.setProperty("--delay", `-${position * duration / 12 + stream * 3}s`);
    fall.style.setProperty("--radius", `min(${15 + stream * 2}vw, 220px)`);
    fall.style.setProperty("--size", `${13 + index % 4 * 3}px`);
    fall.style.setProperty("--glow", index % 3 === 0 ? "#f5c5dc" : "#e2e7ff");
    fall.style.setProperty("--rest-y", `${position * 8 + stream * 2}vh`);
    fall.style.setProperty("--rest-x", `${(position % 3 - 1) * 9}vw`);
    orbit.className = "kelly-orbit";
    orbit.textContent = "Kelly";
    fall.append(orbit);
    stars.append(fall);
  }

  night.append(stars);
  toggle.addEventListener("click", () => {
    const paused = night.classList.toggle("is-paused");
    const label = paused ? "Animer le fond" : "Mettre le fond en pause";
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
    toggle.firstElementChild.textContent = paused ? "▶" : "Ⅱ";
  });
})();
