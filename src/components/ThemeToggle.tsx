import { useEffect, useState } from "react";

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

function revealTheme(theme: Theme, origin: { x: number; y: number }, commit: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const apply = () => {
    paintTheme(theme);
    commit();
  };
  if (reduce) {
    apply();
    return;
  }

  document.querySelector(".theme-veil")?.remove();
  const veil = document.createElement("div");
  veil.className = "theme-veil";
  veil.setAttribute("aria-hidden", "true");
  veil.style.background = getComputedStyle(document.body).backgroundColor;
  veil.style.setProperty("--theme-x", `${origin.x}px`);
  veil.style.setProperty("--theme-y", `${origin.y}px`);
  document.body.appendChild(veil);
  apply();

  const radius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );
  const duration = 640;
  const started = performance.now();
  let frame = 0;
  const tick = (now: number) => {
    const t = Math.min(1, (now - started) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    veil.style.setProperty("--r", `${eased * radius}px`);
    if (t < 1) frame = requestAnimationFrame(tick);
    else veil.remove();
  };
  frame = requestAnimationFrame(tick);
  window.setTimeout(() => {
    cancelAnimationFrame(frame);
    veil.remove();
  }, duration + 120);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readTheme);

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
