import Reveal from "../components/Reveal";
import { useEffect, useRef, useState } from "react";
import { usePortfolioContent } from "../lib/content";
import type { Experience, Project, Stat as StatData } from "../data/portfolio";

export default function OnePage() {
  const { content } = usePortfolioContent();
  const { hero, stats, skills, about, experiences, contact, projects, footer } = content;
  const visualRef = useRef<HTMLDivElement>(null);

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(hover: none)").matches) return;
    const el = visualRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 10).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 10).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const resetTilt = () => {
    const el = visualRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section id="home" className="snap-section section">
        <div className="container hero">
          <div>
            <Reveal>
              <p className="hero-eyebrow">
                <Typewriter words={hero.roles} />
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1>{hero.name}</h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="hero-bio">
                <StaggerWords text={hero.bio} />
              </p>
            </Reveal>
            <Reveal delay={300}>
              <Magnetic>
                <a
                  href="/#projects"
                  className="hero-cta"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#projects")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  {hero.cta}
                </a>
              </Magnetic>
            </Reveal>
            <Reveal delay={380}>
              <HeroSocials contact={contact} />
            </Reveal>
          </div>

          <Reveal delay={180} variant="scale">
            <div
              className="hero-visual"
              ref={visualRef}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
            >
              <div className="profile-frame">
                <img
                  src={hero.profileImg}
                  onError={(e) => {
                    e.currentTarget.src = "/profile.svg";
                  }}
                  alt={`Foto profil ${hero.name}`}
                  className="profile profile-round"
                />
                <div className="glare" aria-hidden="true" />
              </div>
              <div className="orbit" aria-hidden="true" />
              <div className="float-card float-card-b">
                <span aria-hidden="true">{hero.floatBadge.icon}</span>{" "}
                <b>{hero.floatBadge.value}</b> {hero.floatBadge.label}
              </div>
            </div>
          </Reveal>

          <Reveal delay={240} className="hero-stats">
            <div className="stats">
              {stats.map((s, i) => (
                <Stat key={`${s.label}-${i}`} {...s} />
              ))}
            </div>
          </Reveal>
        </div>
        <button
          className="scroll-indicator"
          aria-label="Scroll ke bawah"
          onClick={() => {
            document
              .querySelector("#about")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <span className="si-mouse">
            <span className="si-wheel" />
          </span>
          <span className="si-label">scroll</span>
        </button>
      </section>

      {/* ── Skills marquee divider ───────────────────────── */}
      <section className="skills-section">
        <div className="container">
          <SkillsMarquee skills={skills} />
        </div>
      </section>

      {/* ── About / Work Experiences ────────────────────── */}
      <section id="about" className="snap-section section">
        <div className="container">
          <Reveal>
            <p className="section-eyebrow">{about.eyebrow}</p>
            <h1>{about.title}</h1>
          </Reveal>
          <Reveal delay={120}>
            <p>{about.intro}</p>
          </Reveal>
          <Reveal delay={200} variant="left">
            <ul className="timeline">
              {experiences.map((exp) => (
                <ExperienceItem key={exp.company} exp={exp} />
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────── */}
      <section id="projects" className="snap-section section">
        <div className="container">
          <Reveal>
            <p className="section-eyebrow">{content.projectsEyebrow}</p>
            <h1>{content.projectsTitle}</h1>
          </Reveal>
          <ProjectsCarousel projects={projects} />
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────── */}
      <section id="contact" className="snap-section section">
        <div className="container">
          <div className="contact-wrap">
            <div className="contact-intro">
              <Reveal>
                <p className="section-eyebrow">{contact.eyebrow}</p>
                <h1>{contact.title}</h1>
              </Reveal>
              <Reveal delay={80}>
                <p>{contact.intro}</p>
              </Reveal>
              <Reveal delay={140}>
                <ul className="contact-list">
                  <li>
                    <CopyEmail email={contact.email} />
                  </li>
                  <li>
                    <a
                      href={contact.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="ci-icon">
                        <LinkedInIcon />
                      </span>
                      <span className="ci-body">
                        <span className="ci-label">LinkedIn</span>
                        <span className="ci-value">{contact.linkedinHandle}</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={contact.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="ci-icon">
                        <GitHubIcon />
                      </span>
                      <span className="ci-body">
                        <span className="ci-label">GitHub</span>
                        <span className="ci-value">{contact.githubHandle}</span>
                      </span>
                    </a>
                  </li>
                </ul>
              </Reveal>
            </div>
            <Reveal delay={180}>
              <div className="contact-card">
                <ContactForm email={contact.email} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <p>{footer.replace("{year}", String(new Date().getFullYear()))}</p>
          <div className="social">
            <a
              href={contact.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <a href="/admin" className="admin-link" aria-label="Admin Panel" title="Admin Panel">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3.2" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.08a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.03z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Project image with graceful fallback ──────────────── */

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  // Reset whenever the src changes (e.g. Firestore content loads after the
  // first render) so a previously-broken image isn't stuck hidden.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div className="slide-img-placeholder" role="img" aria-label={alt}>
        <span>{alt.charAt(0).toUpperCase()}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

/* ── Icons ─────────────────────────────────────────────── */

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1 .07 1.52 1.06 1.52 1.06.9 1.59 2.36 1.13 2.94.86.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.33.1-2.77 0 0 .85-.28 2.78 1.05.81-.23 1.67-.35 2.53-.35s1.72.12 2.53.35c1.93-1.33 2.78-1.05 2.78-1.05.55 1.44.2 2.51.1 2.77.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.82-4.57 5.08.36.33.68.97.68 1.95 0 1.41-.01 2.55-.01 2.9 0 .27.18.6.69.49A10.05 10.05 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.9 14H6V10h3.1v7zM7.55 8.86C6.7 8.86 6 8.16 6 7.32s.7-1.54 1.55-1.54 1.55.69 1.55 1.54-.7 1.54-1.55 1.54zM20 17h-3.1v-3.39c0-.81-.02-1.86-1.13-1.86-1.13 0-1.3.88-1.3 1.8V17H11V10h2.97v.96h.04c.41-.77 1.41-1.58 2.9-1.58 3.1 0 3.67 2.04 3.67 4.7V17z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </svg>
  );
}

/* ── Experience timeline item ───────────────────────────── */

function ExperienceItem({ exp }: { exp: Experience }) {
  return (
    <li className="tl-item">
      <div className="tl-dot">
        <span className="tl-initial">{exp.initial}</span>
      </div>
      <div className="tl-content">
        <div className="tl-head">
          <h3 className="tl-company">{exp.company}</h3>
          <span className="badge">{exp.badge}</span>
        </div>
        <p className="tl-desc">{exp.desc}</p>
        <ul className="tl-roles">
          {exp.roles.map((r, i) => (
            <li className="tl-role" key={i}>
              <span className={`role-type ${r.type === "Full-time" ? "ft" : "pt"}`}>
                {r.type}
              </span>
              <span className="role-period">{r.period}</span>
              {r.current && <span className="badge-current">Current</span>}
            </li>
          ))}
        </ul>
        <div className="tl-tags">
          {exp.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}

/* ── Staggered word reveal ─────────────────────────────── */

function StaggerWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className="stagger">
      {words.map((w, i) => (
        <span
          key={i}
          className="stagger-word"
          style={{ "--i": i } as React.CSSProperties}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

/* ── Magnetic wrapper ────────────────────────────────────── */

function Magnetic({
  children,
  strength = 0.22,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(
        dy * strength
      ).toFixed(1)}px)`;
    };
    const onLeave = () => {
      el.style.transform = "translate(0, 0)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return (
    <div className="magnetic" ref={ref}>
      {children}
    </div>
  );
}

/* ── Hero socials ──────────────────────────────────────── */

function HeroSocials({
  contact,
}: {
  contact: {
    githubUrl: string;
    linkedinUrl: string;
    email: string;
  };
}) {
  return (
    <div className="hero-socials">
      <Magnetic strength={0.18}>
        <a
          href={contact.githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <GitHubIcon />
        </a>
      </Magnetic>
      <Magnetic strength={0.18}>
        <a
          href={contact.linkedinUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <LinkedInIcon />
        </a>
      </Magnetic>
      <Magnetic strength={0.18}>
        <a
          href={`mailto:${contact.email}`}
          aria-label="Email"
          title="Email"
        >
          <MailIcon />
        </a>
      </Magnetic>
    </div>
  );
}

/* ── Copy email ────────────────────────────────────────── */

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" className="copy-email" onClick={copy}>
      <span className="ci-icon">
        <MailIcon />
      </span>
      <span className="ci-body">
        <span className="ci-label">{copied ? "Copied!" : "Email"}</span>
        <span className="ci-value">{email}</span>
      </span>
      <span className="copy-hint" aria-hidden="true">
        {copied ? "✓" : "Copy"}
      </span>
    </button>
  );
}

/* ── Typewriter ────────────────────────────────────────── */

function Typewriter({ words }: { words: string[] }) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;
    const word = words[index % words.length];

    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), 1700);
      return () => clearTimeout(t);
    }

    const speed = deleting ? 38 : 95;
    const t = setTimeout(() => {
      if (deleting) {
        setText(word.slice(0, text.length - 1));
        if (text.length === 1) {
          setDeleting(false);
          setIndex((v) => v + 1);
        }
      } else {
        setText(word.slice(0, text.length + 1));
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, index, words]);

  return (
    <span>
      {text}
      <span className="caret" aria-hidden="true" />
    </span>
  );
}

/* ── Count-up stat ─────────────────────────────────────── */

function Stat(props: StatData) {
  const { value, suffix = "", label, sub } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1300;
    const t0 = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value]);

  return (
    <div className="stat-card" ref={ref}>
      <div className="stat-value">
        {n}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

/* ── Skills marquee ────────────────────────────────────── */

function SkillsMarquee({ skills }: { skills: string[] }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {skills.map((s) => (
              <span className="marquee-item" key={`${copy}-${s}`}>
                {s}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Contact form ──────────────────────────────────────── */

function ContactForm({ email }: { email: string }) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const subject = String(fd.get("subject") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const to = email;
    const mailSubject = subject || `New message from ${name || "Visitor"}`;
    const body = [`Name: ${name}`, ``, message].join("\n");
    const href = `mailto:${to}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
    const a = document.createElement("a");
    a.href = href;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-row">
        <div className="field">
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            aria-label="Name"
            required
          />
        </div>
      </div>
      <div className="field">
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="Subject"
          aria-label="Subject"
        />
      </div>
      <div className="field">
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Write your message..."
          aria-label="Message"
          required
        />
      </div>
      <div className="actions">
        <button type="submit" className="btn primary">
          Send Email
        </button>
      </div>
    </form>
  );
}

/* ── Projects carousel ─────────────────────────────────── */

function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Distance one press of prev/next should move: the actual slide width
  // (one column) plus the track gap — NOT a fraction of the viewport,
  // which skipped slides on wide screens where two are visible at once.
  const stepWidth = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const first = el.querySelector<HTMLElement>(".slide");
    if (!first) return el.clientWidth;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 16;
    return first.offsetWidth + gap;
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const step = stepWidth();
      if (!step) return;
      const i = Math.round(el.scrollLeft / step);
      setActive(Math.max(0, Math.min(i, projects.length - 1)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [projects.length]);

  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const step = stepWidth();
    if (!step) return;
    el.scrollTo({ left: i * step, behavior: "smooth" });
    setActive(i);
  };
  const prev = () => scrollToIndex(Math.max(0, active - 1));
  const next = () => scrollToIndex(Math.min(projects.length - 1, active + 1));

  return (
    <Reveal delay={120}>
      <div className="carousel">
        <div className="carousel-track" ref={trackRef}>
          {projects.map((p, i) => (
            <article className="slide" key={`${p.title}-${i}`}>
              <div className="header-image">
                <ProjectImage src={p.img} alt={p.title} />
                <div className="slide-img-overlay" />
              </div>
              <div className="slide-body">
                <h3 className="slide-title">{p.title}</h3>
                <p className="slide-desc">{p.desc}</p>
                <div className="slide-tags">
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                {(p.appStore || p.playStore) && (
                  <div className="store-buttons">
                    {p.appStore && (
                      <a href={p.appStore} target="_blank" rel="noreferrer" className="store-btn appstore">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                        App Store
                      </a>
                    )}
                    {p.playStore && (
                      <a href={p.playStore} target="_blank" rel="noreferrer" className="store-btn playstore">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M3.18 23.76c.3.17.64.22.98.15l12.04-6.96-2.8-2.8-10.22 9.61zm-1.1-19.76c-.06.19-.08.4-.08.62v18.76c0 .22.02.43.08.62l.06.06L13.2 12l-.06-.06L2.08 3.94l-.06.06zm20.01 8.43l-2.88-1.66-3.13 3.13 3.13 3.13 2.9-1.67c.83-.48.83-1.26-.02-1.93zM4.16.24L16.2 7.2l-2.8 2.8L3.18.24C3.5.07 3.88.1 4.16.24z"/></svg>
                        Google Play
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="carousel-controls">
          <button className="car-btn" onClick={prev} aria-label="Previous" disabled={active === 0}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div className="carousel-progress-wrap">
            <div className="carousel-counter">
              <span className="carousel-current">{String(active + 1).padStart(2, "0")}</span>
              <span className="carousel-sep"> / </span>
              <span className="carousel-total">{String(projects.length).padStart(2, "0")}</span>
            </div>
            <div className="carousel-bar">
              <div
                className="carousel-bar-fill"
                style={{ width: `${((active + 1) / projects.length) * 100}%` }}
              />
            </div>
          </div>

          <button className="car-btn" onClick={next} aria-label="Next" disabled={active === projects.length - 1}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </Reveal>
  );
}
