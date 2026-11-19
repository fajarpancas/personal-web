import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "folio-theme";

type Theme = "light" | "dark";

function readTheme(): Theme {
  const value = document.documentElement.dataset.theme;
  if (value === "light" || value === "dark") return value;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function paintTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0e100d" : "#f4f7ef");
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode can block storage */
  }
}

const SVG_NS = "http://www.w3.org/2000/svg";

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/* Dramatic "eclipse" reveal: expanding hole in the old theme, hugged by a
 * glowing ring + shockwave, a central flash, and a burst of particles —
 * sun rays when going light, stars when going dark. */
function revealTheme(theme: Theme, origin: { x: number; y: number }, commit: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toDark = theme === "dark";
  if (reduce) {
    paintTheme(theme);
    commit();
    return;
  }

  // Capture the old backdrop first, then paint the new theme underneath.
  const oldBackdrop = getComputedStyle(document.body).backgroundColor;
  document.querySelector(".theme-eclipse")?.remove();

  const overlay = document.createElement("div");
  overlay.className = `theme-eclipse ${toDark ? "to-dark" : "to-light"}`;
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.setProperty("--theme-x", `${origin.x}px`);
  overlay.style.setProperty("--theme-y", `${origin.y}px`);

  const veil = document.createElement("div");
  veil.className = "theme-eclipse-veil";
  veil.style.background = oldBackdrop;
  overlay.appendChild(veil);

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "theme-eclipse-rings");
  svg.setAttribute("width", String(window.innerWidth));
  svg.setAttribute("height", String(window.innerHeight));
  const ring = document.createElementNS(SVG_NS, "circle");
  ring.setAttribute("cx", String(origin.x));
  ring.setAttribute("cy", String(origin.y));
  ring.setAttribute("r", "0");
  ring.setAttribute("class", "ring-main");
  const shock = document.createElementNS(SVG_NS, "circle");
  shock.setAttribute("cx", String(origin.x));
  shock.setAttribute("cy", String(origin.y));
  shock.setAttribute("r", "0");
  shock.setAttribute("class", "ring-shock");
  svg.append(ring, shock);
  overlay.appendChild(svg);

  const flash = document.createElement("div");
  flash.className = "theme-eclipse-flash";
  flash.style.left = `${origin.x}px`;
  flash.style.top = `${origin.y}px`;
  overlay.appendChild(flash);

  // Particle burst from the toggle point.
  const palette = toDark
    ? ["#ffffff", "#c9f5d8", "#5ee08a", "#ffffff", "#8ef0b2"]
    : ["#f5b81e", "#ffd66b", "#34d86a", "#ffffff", "#ff9d2e"];
  const count = toDark ? 36 : 30;
  for (let i = 0; i < count; i += 1) {
    const p = document.createElement("span");
    const isRay = !toDark && i % 3 === 0;
    p.className = `theme-eclipse-particle${isRay ? " is-ray" : ""}`;
    p.style.left = `${origin.x}px`;
    p.style.top = `${origin.y}px`;
    const color = pick(palette);
    const size = isRay ? random(10, 18) : random(3, 7);
    if (isRay) {
      p.style.width = "4px";
      p.style.height = `${size}px`;
    } else {
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
    }
    p.style.background = color;
    p.style.boxShadow = `0 0 ${isRay ? 12 : 8}px ${color}`;
    overlay.appendChild(p);

    const angle = (i / count) * Math.PI * 2 + random(-0.25, 0.25);
    const dist = random(90, toDark ? 300 : 260);
    const spin = random(-140, 140);
    p.animate(
      [
        {
          transform: `translate(-50%, -50%) rotate(${angle}rad) translateX(14px) rotate(0deg)`,
          opacity: 1,
        },
        {
          transform: `translate(-50%, -50%) rotate(${angle}rad) translateX(${dist}px) rotate(${spin}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: random(650, 1150),
        delay: random(0, 130),
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "forwards",
      },
    );
  }

  document.body.appendChild(overlay);
  paintTheme(theme);
  commit();

  flash.animate(
    [
      { transform: "scale(.15)", opacity: 0.9 },
      { transform: "scale(1.6)", opacity: 0 },
    ],
    { duration: 600, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" },
  );

  const radius =
    Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y),
    ) + 48;
  const duration = 980;
  const started = performance.now();
  const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const easeDelayed = (t: number) => easeOutExpo(Math.max(0, Math.min(1, (t - 0.1) / 0.9)));

  let frame = 0;
  const tick = (now: number) => {
    const t = Math.min(1, (now - started) / duration);
    const eased = easeOutExpo(t);
    const lagged = easeDelayed(t);
    veil.style.setProperty("--r", `${eased * radius}px`);
    ring.setAttribute("r", String(Math.max(0, eased * radius)));
    shock.setAttribute("r", String(Math.max(0, lagged * radius)));
    const fade = t < 0.62 ? 1 : 1 - (t - 0.62) / 0.38;
    ring.style.opacity = String(Math.max(0, fade));
    shock.style.opacity = String(Math.max(0, fade * 0.65));
    if (t < 1) {
      frame = requestAnimationFrame(tick);
    } else {
      veil.remove();
      ring.remove();
      shock.remove();
    }
  };
  frame = requestAnimationFrame(tick);

  window.setTimeout(() => {
    cancelAnimationFrame(frame);
    overlay.remove();
  }, duration + 700);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const lock = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        stored = "set";
      }
      if (stored === "light" || stored === "dark") return;
      const next: Theme = media.matches ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#0e100d" : "#f4f7ef");
      setTheme(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const onToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (lock.current) return;
    lock.current = true;
    window.setTimeout(() => {
      lock.current = false;
    }, 1050);
    event.currentTarget.animate(
      [
        { transform: "scale(1) rotate(0deg)" },
        { transform: "scale(.82) rotate(-24deg)", offset: 0.35 },
        { transform: "scale(1) rotate(0deg)" },
      ],
      { duration: 480, easing: "cubic-bezier(.34,1.56,.64,1)" },
    );
    const next: Theme = theme === "dark" ? "light" : "dark";
    const rect = event.currentTarget.getBoundingClientRect();
    revealTheme(next, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, () => setTheme(next));
  };

  const dark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={onToggle}
    >
      <span className="theme-toggle-thumb">
        <svg className="sun" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="2.4" fill="currentColor" />
          <path
            d="M8 1.4v1.8M8 12.8v1.8M1.4 8h1.8M12.8 8h1.8M3.2 3.2l1.3 1.3M11.5 11.5l1.3 1.3M12.8 3.2l-1.3 1.3M4.5 11.5l-1.3 1.3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <svg className="moon" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M9.2 1.6a5.6 5.6 0 1 0 5.2 7.6 4.5 4.5 0 0 1-5.2-7.6Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  );
}
