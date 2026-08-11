import { useEffect, useState } from "react";
import { getScrollY } from "../utils/scroll";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  // Scroll spy: highlight the nav link of the section in view
  useEffect(() => {
    const ids = ["home", "about", "projects", "contact"];
    const onScroll = () => {
      const pos = getScrollY() + 140;
      let current = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= pos) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () =>
      window.removeEventListener("scroll", onScroll, {
        capture: true,
      } as EventListenerOptions);
  }, []);

  const scrollTo = (selector: string) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const hash = selector.startsWith("#") ? selector : `#${selector}`;
      history.replaceState(null, "", `/${hash}`);
    }
  };

  return (
    <header className="navbar">
      <nav className="container navbar-inner">
        <a
          className="brand"
          href="/#home"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#home");
          }}
        >
          Fajar Panca
        </a>

        <button
          className={`menu-btn ${open ? "open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            // Close Icon
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            // Hamburger Icon
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        <ul className="nav desktop">
          <li>
            <a
              href="/#about"
              className={active === "about" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#about");
              }}
            >
              Work Experiences
            </a>
          </li>
          <li>
            <a
              href="/#projects"
              className={active === "projects" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#projects");
              }}
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="/#contact"
              className={active === "contact" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#contact");
              }}
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>

      <div className={`mobile-menu ${open ? "show" : ""}`}>
        <ul className="mobile-nav">
          <li>
            <a
              href="/#about"
              className={active === "about" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#about");
                setOpen(false);
              }}
            >
              Work Experiences
            </a>
          </li>
          <li>
            <a
              href="/#projects"
              className={active === "projects" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#projects");
                setOpen(false);
              }}
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="/#contact"
              className={active === "contact" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#contact");
                setOpen(false);
              }}
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
