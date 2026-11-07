import { useEffect, useState } from "react";
import { revealChapter } from "../pages/OnePage";
import { getScrollY } from "../utils/scroll";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "apps", label: "Projects" },
  { id: "about", label: "Career" },
  { id: "contact", label: "Write" },
  { id: "contact", label: "Contact", key: "contact-2" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const ids = ["home", "apps", "about", "projects", "contact"];
    const onScroll = () => {
      const pos = getScrollY() + 120;
      let current = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetHeight > 8 && el.offsetTop <= pos) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () =>
      window.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
  }, []);

  const scrollTo = (id: string) => {
    history.replaceState(null, "", `/#${id}`);
    revealChapter(id);
    setOpen(false);
  };

  const item = (link: (typeof LINKS)[number], mobile = false) => (
    <a
      href={`/#${link.id}`}
      className={active === link.id ? "active" : ""}
      onClick={(event) => {
        event.preventDefault();
        scrollTo(link.id);
      }}
    >
      {mobile ? link.label : link.label}
    </a>
  );

  return (
    <header className="navbar">
      <nav className="container navbar-inner">
        <a
          className="brand"
          href="/#home"
          onClick={(event) => {
            event.preventDefault();
            scrollTo("home");
          }}
        >
          <span className="brand-mark" aria-hidden="true">F</span>
          Fajar
        </a>

        <ul className="nav desktop">
          {LINKS.map((link) => (
            <li key={link.key || link.label}>{item(link)}</li>
          ))}
        </ul>

        <div className="nav-end">
          <ThemeToggle />
          <a
            className="fc-talk"
            href="/#contact"
            onClick={(event) => {
              event.preventDefault();
              scrollTo("contact");
            }}
          >
            Let's Talk
          </a>
          <button
            className={`menu-btn ${open ? "open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${open ? "show" : ""}`}>
        <ul className="mobile-nav">
          {LINKS.map((link) => (
            <li key={`m-${link.key || link.label}`}>{item(link, true)}</li>
          ))}
        </ul>
      </div>
    </header>
  );
}
