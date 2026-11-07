import { useEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { TestimonialsSection } from "../components/ui/testimonials-6";
import { usePortfolioContent } from "../lib/content";
import type { Experience, Project } from "../data/portfolio";
import { getScrollY } from "../utils/scroll";

function plain(value: string) {
  return value.replace(/—/g, ", ");
}

function label(value: string) {
  return plain(value).replace(/\b[a-z]/g, (letter: string) => letter.toUpperCase());
}

function voice(value: string) {
  return label(value).replace(/\bHim\b/g, "Me");
}

function heroBio(bio: string, name: string) {
  if (/^i['’]m\b/i.test(bio)) return plain(bio);
  if (/react native developer/i.test(bio)) {
    return `I'm ${name}, a Mobile Engineer in Indonesia. Nineteen apps on the App Store and Google Play.`;
  }
  return plain(bio);
}

const SELECTED = ["JIFF Customer", "KohBus Rider", "Madkhal"];

const BLURB: Record<string, string> = {
  "JIFF Customer": "Marketplace and on-demand delivery.",
  "KohBus Rider": "Routes, live tracking, and chat.",
  Madkhal: "Qibla, prayer times, and learning.",
};

let sectionScroll: { stop: () => void } | null = null;
let releaseScroll: (() => void) | null = null;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const nav = document.querySelector(".navbar");
  const offset = (nav?.getBoundingClientRect().height ?? 0) + 8;
  const target = Math.max(0, el.getBoundingClientRect().top + getScrollY() - offset);
  const from = getScrollY();
  sectionScroll?.stop();
  releaseScroll?.();
  releaseScroll = null;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || Math.abs(target - from) < 2) {
    window.scrollTo({ top: target, behavior: "auto" });
    return;
  }

  const distance = Math.abs(target - from);
  const controls = animate(from, target, {
    duration: Math.min(1.15, Math.max(0.6, distance / 1500)),
    ease: [0.22, 1, 0.36, 1],
    onUpdate: (value) => window.scrollTo({ top: value, behavior: "auto" }),
  });
  sectionScroll = controls;
  const halt = () => {
    controls.stop();
    releaseScroll?.();
    releaseScroll = null;
  };
  releaseScroll = () => {
    window.removeEventListener("wheel", halt);
    window.removeEventListener("touchstart", halt);
  };
  window.addEventListener("wheel", halt, { passive: true });
  window.addEventListener("touchstart", halt, { passive: true });
  void controls.then(() => {
    releaseScroll?.();
    releaseScroll = null;
  });
}

const CHAPTERS = ["home", "apps", "about", "projects", "contact"] as const;
type ChapterId = (typeof CHAPTERS)[number];

const STEP_LABEL: Record<ChapterId, string> = {
  home: "Hero",
  apps: "Projects",
  about: "The Studios",
  projects: "Selected works",
  contact: "Write Me",
};

function isChapter(id: string): id is ChapterId {
  return (CHAPTERS as readonly string[]).includes(id);
}

let openChapter = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export function revealChapter(id: string) {
  openChapter(id);
}

function onSectionClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
  event.preventDefault();
  history.replaceState(null, "", `/#${id}`);
  revealChapter(id);
}

function atPageEnd() {
  return window.innerHeight + getScrollY() >= document.documentElement.scrollHeight - 28;
}

function findProject(projects: Project[], title: string) {
  return projects.find((project) => project.title === title);
}

function storeHref(project: Project) {
  return project.appStore || project.playStore || "";
}

function startYear(exp: Experience) {
  const match = exp.roles.map((role) => role.period).join(" ").match(/\d{4}/);
  return match ? Number(match[0]) : 9999;
}

function countOf(badge: string) {
  const match = badge.match(/\d+/);
  return match ? match[0] : badge;
}

export default function OnePage() {
  const { content, loading } = usePortfolioContent();
  const [holdSkeleton, setHoldSkeleton] = useState(true);
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return CHAPTERS.length;
    const hash = window.location.hash.replace("#", "");
    const index = CHAPTERS.indexOf(hash as ChapterId);
    return index >= 0 ? index + 1 : 1;
  });
  const [current, setCurrent] = useState(0);
  const shownRef = useRef(shown);
  const pending = useRef<string | null>(null);
  const lock = useRef(false);
  shownRef.current = shown;
  const { hero, about, experiences, contact, projects, footer } = content;
  const year = new Date().getFullYear();
  const portrait =
    !hero.profileImg || hero.profileImg === "/profile.png" || hero.profileImg === "/portrait.png"
      ? "/portrait.png?v=2"
      : hero.profileImg;

  const revealThrough = (count: number) => {
    setShown((currentCount) => Math.max(currentCount, Math.min(CHAPTERS.length, count)));
  };

  const present = (id: string) => {
    window.setTimeout(() => scrollToSection(id), 48);
  };

  useEffect(() => {
    openChapter = (id: string) => {
      if (!isChapter(id)) return;
      const index = CHAPTERS.indexOf(id);
      if (reduce || index < shownRef.current) {
        scrollToSection(id);
        return;
      }
      pending.current = id;
      revealThrough(index + 1);
      present(id);
    };
    return () => {
      openChapter = (next) => {
        document.getElementById(next)?.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    };
  });

  useEffect(() => {
    if (reduce) return;
    const revealNext = () => {
      if (lock.current || shownRef.current >= CHAPTERS.length) return;
      const next = shownRef.current;
      const id = CHAPTERS[next];
      lock.current = true;
      pending.current = id;
      revealThrough(next + 1);
      present(id);
      window.setTimeout(() => {
        lock.current = false;
      }, 980);
    };
    let bucket = 0;
    const onWheel = (event: WheelEvent) => {
      if (document.querySelector(".fc-preview")) return;
      if (event.deltaY <= 0) {
        bucket = 0;
        return;
      }
      if (lock.current) {
        event.preventDefault();
        return;
      }
      if (!atPageEnd() || shownRef.current >= CHAPTERS.length) {
        bucket = 0;
        return;
      }
      bucket += event.deltaY;
      event.preventDefault();
      if (bucket < 48) return;
      bucket = 0;
      revealNext();
    };
    let touchY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (event: TouchEvent) => {
      const end = event.changedTouches[0]?.clientY ?? touchY;
      if (document.querySelector(".fc-preview")) return;
      if (touchY - end < 56 || lock.current || !atPageEnd()) return;
      revealNext();
    };
    const onKey = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLElement && event.target.closest("input, textarea, button, a");
      if (typing) return;
      if (event.key !== "ArrowDown" && event.key !== "PageDown" && event.key !== " ") return;
      if (!atPageEnd() || shownRef.current >= CHAPTERS.length) return;
      event.preventDefault();
      revealNext();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [reduce]);

  useEffect(() => {
    const onScroll = () => {
      const pos = getScrollY() + 160;
      let next = 0;
      CHAPTERS.forEach((id, index) => {
        const el = document.getElementById(id);
        if (el && el.offsetHeight > 8 && el.offsetTop <= pos) next = index;
      });
      setCurrent(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [shown]);

  useEffect(() => {
    if (!loading) {
      setHoldSkeleton(false);
      return;
    }
    const timer = window.setTimeout(() => setHoldSkeleton(false), 1200);
    return () => window.clearTimeout(timer);
  }, [loading]);

  if (loading && holdSkeleton) return <PageSkeleton />;

  const selected = SELECTED.map((title) => findProject(projects, title)).filter((project): project is Project => Boolean(project));
  const studios = [...experiences].sort((a, b) => {
    const currentA = a.roles.some((role) => role.current) ? 0 : 1;
    const currentB = b.roles.some((role) => role.current) ? 0 : 1;
    if (currentA !== currentB) return currentA - currentB;
    return startYear(a) - startYear(b);
  });

  return (
    <div className="fc">
      <section className="fc-hero" id="home">
        <div className="fc-hero-copy">
          <p className="fc-hello">Hello, I am</p>
          <h1>
            Mobile
            <br />
            Engineer.
          </h1>
          <p className="fc-lede">{heroBio(hero.bio, hero.name)}</p>
          <a className="fc-btn" href="#apps" onClick={(event) => onSectionClick(event, "apps")}>
            See the apps
          </a>
          {shown === 1 ? (
            <button className="fc-cue" type="button" onClick={() => revealChapter("apps")}>
              Scroll
              <i />
            </button>
          ) : null}
        </div>
        <div className="fc-panel">
          <HeroMarks />
          <img
            className="fc-portrait"
            src={portrait}
            alt={`Portrait of ${hero.name}`}
            width={585}
            height={1024}
            fetchPriority="high"
            onError={(event) => {
              event.currentTarget.src = "/profile.svg";
            }}
          />
        </div>
      </section>

      <Chapter id="apps" open={shown > 1} label="Projects">
        <div className="fc-band">
          <TestimonialsSection projects={projects} />
        </div>
      </Chapter>

      <Chapter id="about" open={shown > 2} label="The Studios">
        <div className="fc-band fc-studios">
          <header className="fc-block-head">
            <h2 id="studios-title">{label(about.title || "The Studios")}</h2>
            <p>{plain(about.intro)}</p>
          </header>
          <ol className="fc-line">
            {studios.map((exp) => (
              <Studio key={exp.company} exp={exp} />
            ))}
          </ol>
        </div>
      </Chapter>

      <Chapter id="projects" open={shown > 3} label="Selected works">
        <div className="fc-band fc-selected">
          <p className="fc-eyebrow">The apps</p>
          <h2 id="selected-title">Selected works</h2>
          <div className="fc-picks">
            {selected.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
                name={project.title === "KohBus Rider" ? "KohBus" : project.title}
                blurb={BLURB[project.title] || plain(project.desc)}
                pick
              />
            ))}
          </div>
        </div>
      </Chapter>

      <Chapter id="contact" open={shown > 4} label="Write Me">
        <div className="fc-band">
          <div className="fc-write">
            <div>
              <h2 id="write-title">{voice(contact.title || "Write me")}</h2>
              <p>{plain(contact.intro)}</p>
              <a className="fc-mail" href={`mailto:${contact.email}`}>{contact.email}</a>
              <div className="fc-text-links">
                <a href={contact.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={contact.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
            <ContactForm email={contact.email} />
          </div>
        </div>
        <footer className="fc-foot">
          <p>{hero.name}</p>
          <nav aria-label="Page">
            <a href="#home" onClick={(event) => onSectionClick(event, "home")}>Home</a>
            <a href="#apps" onClick={(event) => onSectionClick(event, "apps")}>Projects</a>
            <a href="#projects" onClick={(event) => onSectionClick(event, "projects")}>Every Title</a>
            <a href="#about" onClick={(event) => onSectionClick(event, "about")}>Career</a>
            <a href="#contact" onClick={(event) => onSectionClick(event, "contact")}>Write Me</a>
          </nav>
          <p className="fc-quiet">{plain(footer).replace("{year}", String(year))}</p>
        </footer>
      </Chapter>

      <nav className="fc-steps" aria-label="Sections">
        {CHAPTERS.map((id, index) => (
          <button
            key={id}
            type="button"
            aria-label={STEP_LABEL[id]}
            aria-current={index === current ? "true" : undefined}
            className={index < shown ? "is-on" : ""}
            onClick={() => {
              history.replaceState(null, "", `/#${id}`);
              revealChapter(id);
            }}
          />
        ))}
      </nav>
    </div>
  );
}

function Chapter({
  id,
  open,
  label,
  children,
}: {
  id: string;
  open: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <section id={id} aria-label={label}>
        {children}
      </section>
    );
  }
  return (
    <motion.section
      id={id}
      aria-label={label}
      className={open ? "fc-chapter is-shown" : "fc-chapter"}
      initial={false}
      animate={open ? "show" : "hide"}
      variants={{
        hide: { height: 0, visibility: "hidden", transition: { duration: 0.45, ease: [0.4, 0, 1, 1] } },
        show: {
          height: "auto",
          visibility: "visible",
          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], visibility: { duration: 0 } },
        },
      }}
    >
      <motion.div
        className="fc-chapter-in"
        initial={false}
        animate={open ? "show" : "hide"}
        variants={{
          hide: { opacity: 0, y: 72, filter: "blur(14px)" },
          show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.95, delay: 0.06, ease: [0.16, 1, 0.3, 1] },
          },
        }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}

function HeroMarks() {
  return (
    <svg className="fc-marks" viewBox="0 0 680 720" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.4">
        <circle cx="168" cy="118" r="28" />
        <path d="M250 210 L286 272 H214 Z" />
        <path d="M520 70 L548 86 L548 118 L520 134 L492 118 L492 86 Z" />
        <path d="M600 168 L624 182 L624 210 L600 224 L576 210 L576 182 Z" />
        <circle cx="560" cy="520" r="54" />
      </g>
      <g fill="currentColor">
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => <circle key={`${row}-${col}`} cx={78 + col * 16} cy={64 + row * 16} r="2.2" />),
        )}
        {[0, 1, 2].map((row) =>
          [0, 1].map((col) => <circle key={`d-${row}-${col}`} cx={612 + col * 14} cy={48 + row * 14} r="2" />),
        )}
      </g>
    </svg>
  );
}

function ProjectCard({
  project,
  name,
  wide,
  blurb,
  pick,
}: {
  project: Project;
  name: string;
  wide?: boolean;
  blurb?: string;
  pick?: boolean;
}) {
  const href = storeHref(project);
  const body = (
    <>
      <span className="fc-shot">
        <Shot src={project.img} alt="" />
      </span>
      <span className="fc-card-copy">
        <span className="fc-card-name">{name}</span>
        {blurb ? <span className="fc-card-blurb">{blurb}</span> : null}
      </span>
    </>
  );
  const className = `fc-card${wide ? " is-wide" : ""}${pick ? " is-pick" : ""}`;
  if (!href) {
    return <article className={className}>{body}</article>;
  }
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {body}
    </a>
  );
}

function Studio({ exp }: { exp: Experience }) {
  const current = exp.roles.some((role) => role.current);
  const year = startYear(exp);
  const when = current
    ? `${year} – Present`
    : exp.roles.map((role) => `${role.type}, ${role.period}`).join(" · ");
  return (
    <li className={current ? "is-current" : ""}>
      <span className="fc-year">{year}</span>
      <span className="fc-dot" aria-hidden="true" />
      <span className="fc-num">{countOf(exp.badge)}</span>
      <div className={current ? "fc-now" : "fc-then"}>
        <h3>{exp.company}</h3>
        <p className="fc-when">{when}</p>
        <p>{plain(exp.desc)}</p>
      </div>
    </li>
  );
}

function Shot({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [src]);
  if (failed || !src) return <span className="fc-frame-empty">No shot</span>;
  return <img src={src} alt={alt} width={720} height={900} loading="lazy" onError={() => setFailed(true)} />;
}

function ContactForm({ email }: { email: string }) {
  const [note, setNote] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !message) {
      setNote("Add your name and a message.");
      return;
    }
    const href = `mailto:${email}?subject=${encodeURIComponent(subject || `Note from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\n\n${message}`)}`;
    window.location.href = href;
    setNote("Opening your mail app");
  };

  return (
    <form className="fc-form" onSubmit={onSubmit}>
      <label>
        <span className="fc-sr">Name</span>
        <input name="name" type="text" autoComplete="name" placeholder="Name" required />
      </label>
      <label>
        <span className="fc-sr">Subject</span>
        <input name="subject" type="text" placeholder="Subject" />
      </label>
      <label>
        <span className="fc-sr">Message</span>
        <textarea name="message" placeholder="Message" required />
      </label>
      <button className="fc-btn" type="submit">Send the Note</button>
      {note ? <p className="fc-status" role="status">{note}</p> : null}
    </form>
  );
}

function Bone({ className }: { className?: string }) {
  return <span className={className ? `fc-bone ${className}` : "fc-bone"} />;
}

function PageSkeleton() {
  return (
    <div className="fc fc-skeleton" aria-busy="true">
      <p className="fc-sr">Loading the page</p>
      <section className="fc-hero" aria-hidden="true">
        <div className="fc-hero-copy">
          <Bone className="fc-bone-quiet" />
          <Bone className="fc-bone-title" />
          <Bone className="fc-bone-title is-short" />
          <Bone className="fc-bone-line" />
          <Bone className="fc-bone-btn" />
        </div>
        <Bone className="fc-bone-portrait" />
      </section>
    </div>
  );
}
