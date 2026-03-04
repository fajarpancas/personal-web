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
  const share = async () => {
    const url = location.href;
    const title = document.title;
    const text = "Check out Fajar Panca’s portfolio";
    try {
      // @ts-ignore
      if (navigator.share) {
        // @ts-ignore
        await navigator.share({ title, text, url });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied");
    } catch {
      window.open(url, "_blank");
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
          <li>
            <button className="cta" onClick={share} aria-label="Share">
              Share
            </button>
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
          <li>
            <button className="cta full" onClick={share} aria-label="Share">
              Share
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
