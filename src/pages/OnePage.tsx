import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { animate, motion, useReducedMotion } from "motion/react";
import { TestimonialsSection } from "../components/ui/testimonials-6";
import { usePortfolioContent } from "../lib/content";
import { AI_CONTENT } from "../data/aiContent";
import type { AiContentItem } from "../data/aiContent";
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

const CHAPTERS = ["home", "apps", "about", "projects", "ai", "contact"] as const;
type ChapterId = (typeof CHAPTERS)[number];

const STEP_LABEL: Record<ChapterId, string> = {
  home: "Hero",
  apps: "Projects",
  about: "The Studios",
  projects: "Selected works",
  ai: "My AI Content",
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
  const [shown] = useState(CHAPTERS.length);
  const [current, setCurrent] = useState(0);
  const aiRailRef = useRef<HTMLDivElement>(null);
  const aiDrag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });
  const [aiBar, setAiBar] = useState({ left: 0, width: 20 });
  const [copied, setCopied] = useState(false);
  const [aiItem, setAiItem] = useState<AiContentItem | null>(null);
  const aiReturnRef = useRef<HTMLButtonElement | null>(null);

  const closeAi = () => {
    setAiItem(null);
    aiReturnRef.current?.focus();
  };

  const scrollAi = (direction: 1 | -1) => {
    const rail = aiRailRef.current;
    if (!rail) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({
      left: direction * Math.min(560, rail.clientWidth * 0.85),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const updateAiBar = () => {
    const rail = aiRailRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    const width = rail.scrollWidth > 0 ? (rail.clientWidth / rail.scrollWidth) * 100 : 100;
    const left = max > 0 ? (rail.scrollLeft / max) * (100 - width) : 0;
    setAiBar({ left, width });
  };

  useEffect(() => {
    updateAiBar();
    window.addEventListener("resize", updateAiBar);
    return () => window.removeEventListener("resize", updateAiBar);
  }, [loading]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  const { hero, about, experiences, contact, projects, footer } = content;
  const year = new Date().getFullYear();
  const portrait =
    !hero.profileImg || hero.profileImg === "/profile.png" || hero.profileImg === "/portrait.png"
      ? "/portrait.png?v=2"
      : hero.profileImg;

  useEffect(() => {
    openChapter = (id: string) => {
      if (!isChapter(id)) return;
      scrollToSection(id);
    };
    return () => {
      openChapter = (next) => {
        document.getElementById(next)?.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    };
  });

  useEffect(() => {
    const onScroll = () => {
      const pos = getScrollY() + 160;
      let next = 0;
      CHAPTERS.forEach((id, index) => {
        const el = document.getElementById(id);
        if (el && el.offsetHeight > 8 && el.offsetTop <= pos) next = index;
      });
      if (window.innerHeight + getScrollY() >= document.documentElement.scrollHeight - 28) {
        next = CHAPTERS.length - 1;
      }
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
          <button className="fc-cue" type="button" onClick={() => revealChapter("apps")}>
            Scroll
            <i />
          </button>
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

      <Chapter id="ai" open={shown > 4} label="My AI Content">
        <div className="fc-band fc-ai">
          <div className="fc-ai-top">
            <header className="fc-block-head">
              <h2 id="ai-title">My AI content</h2>
              <p>Short vertical videos for parents, made with AI, in Indonesian.</p>
            </header>
            <div className="fc-ai-nav">
              <button type="button" aria-label="Previous AI content" onClick={() => scrollAi(-1)}>
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" aria-label="Next AI content" onClick={() => scrollAi(1)}>
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div
            className="fc-ai-grid"
            ref={aiRailRef}
            aria-label="AI content"
            onScroll={updateAiBar}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse") return;
              aiDrag.current = { down: true, startX: event.clientX, startScroll: event.currentTarget.scrollLeft, moved: false };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!aiDrag.current.down) return;
              const dx = event.clientX - aiDrag.current.startX;
              if (Math.abs(dx) > 6) {
                aiDrag.current.moved = true;
                event.currentTarget.classList.add("is-dragging");
              }
              if (aiDrag.current.moved) event.currentTarget.scrollLeft = aiDrag.current.startScroll - dx;
            }}
            onPointerUp={(event) => {
              aiDrag.current.down = false;
              event.currentTarget.classList.remove("is-dragging");
            }}
            onPointerCancel={(event) => {
              aiDrag.current.down = false;
              event.currentTarget.classList.remove("is-dragging");
            }}
            onClickCapture={(event) => {
              if (!aiDrag.current.moved) return;
              event.preventDefault();
              event.stopPropagation();
              aiDrag.current.moved = false;
            }}
          >
            {AI_CONTENT.map((item) => (
              <button
                key={item.title}
                type="button"
                className="fc-card is-pick fc-ai-card"
                onClick={(event) => {
                  aiReturnRef.current = event.currentTarget;
                  setAiItem(item);
                }}
                aria-label={`${item.title} (opens preview)`}
              >
                <span className="fc-shot">
                  <img src={item.img} alt="" loading="lazy" decoding="async" />
                  {item.url ? (
                    <span className="fc-ai-play" aria-hidden="true">
                      <svg viewBox="0 0 16 16">
                        <path d="M4.5 2.8v10.4L12.8 8Z" fill="currentColor" />
                      </svg>
                    </span>
                  ) : null}
                </span>
                <span className="fc-card-copy">
                  <span className="fc-card-name">{item.title}</span>
                  <span className="fc-card-blurb">{item.desc}</span>
                  <span className="fc-ai-meta">{item.meta}</span>
                  {item.url ? <span className="fc-ai-watch">Play video</span> : null}
                </span>
              </button>
            ))}
          </div>
          <div className="fc-ai-progress" aria-hidden="true">
            <span style={{ width: `${aiBar.width}%`, marginLeft: `${aiBar.left}%` }} />
          </div>
          {aiItem ? <AiPreview item={aiItem} onClose={closeAi} /> : null}
        </div>
      </Chapter>

      <Chapter id="contact" open={shown > 5} label="Write Me">
        <div className="fc-band">
          <div className="fc-write">
            <div>
              <h2 id="write-title">{voice(contact.title || "Write me")}</h2>
              <p>{plain(contact.intro)}</p>
              <span className="fc-mail-row">
                <a className="fc-mail" href={`mailto:${contact.email}`}>{contact.email}</a>
                <button type="button" className="fc-copy" onClick={copyEmail} aria-label="Copy email address">
                  {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <span className="fc-sr" role="status">{copied ? "Email copied" : ""}</span>
              </span>
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
            <a href="#ai" onClick={(event) => onSectionClick(event, "ai")}>AI Content</a>
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
        initial="hide"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        variants={{
          hide: { opacity: 0, y: 36 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, delay: 0.04, ease: [0.16, 1, 0.3, 1] },
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

function drivePreviewUrl(url: string): string | null {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
}

function AiPreview({ item, onClose }: { item: AiContentItem; onClose: () => void }) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const preview = item.url ? drivePreviewUrl(item.url) : null;

  return createPortal(
    <div className="fc-preview" role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        className="fc-ai-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="fc-ai-x" aria-label="Close preview" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {preview ? (
          <div className="fc-ai-frame">
            <iframe
              src={preview}
              title={`${item.title} video`}
              loading="lazy"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <div className="fc-ai-frame is-cover">
            <img src={item.img} alt="" />
          </div>
        )}
        <div className="fc-ai-modal-copy">
          <h3 id={titleId}>{item.title}</h3>
          <p className="fc-ai-modal-meta">{item.meta}</p>
          <p>{item.desc}</p>
          <div className="fc-ai-modal-actions">
            {item.url ? (
              <a className="fc-ai-drive" href={item.url} target="_blank" rel="noreferrer">
                Open in Drive ↗
              </a>
            ) : (
              <span />
            )}
            <button type="button" className="fc-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
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
