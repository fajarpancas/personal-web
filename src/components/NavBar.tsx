import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

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
          <span />
        </button>

        <ul className="nav desktop">
          <li>
            <a
              href="/#about"
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
