import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { usePortfolioContent } from "../lib/content";
import type { Experience, Project } from "../data/portfolio";
import { getScrollY } from "../utils/scroll";

function plain(value: string) {
  return value.replaceAll("—", ", ");
}

function label(value: string) {
  return plain(value).replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

const BINARY_LINE =
  "01000110 01100001 01101010 01100001 01110010 00100000 01010000 01100001 01101110 01100011 01100001 00100000 01010011 01100001 01110000 01110101 01110100 01110010 01100001 ";

let sectionScroll: { stop: () => void } | null = null;
let releaseScroll: (() => void) | null = null;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const nav = document.querySelector(".navbar");
  const offset = (nav?.getBoundingClientRect().height ?? 0) + 16;
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

function onSectionClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
  event.preventDefault();
  history.replaceState(null, "", `/#${id}`);
  scrollToSection(id);
}

export default function OnePage() {
  const { content, loading } = usePortfolioContent();
  const { hero, stats, about, experiences, contact, projects, footer } = content;
  const years = stats.find((s) => /year/i.test(s.label));
  const year = new Date().getFullYear();

  return (
    <div className="fc">
      <section className="fc-hero" id="home">
        <div className="fc-hero-copy">
          <BinarySlide />
          <h1>Seventeen Apps, Both Stores</h1>
          <p className="fc-lede">{plain(hero.bio)}</p>
          <p className="fc-quiet">
            {years ? `${years.value}${years.suffix || ""} years` : "Since 2019"} in Indonesia, on iOS and Android.
          </p>
          <div className="fc-actions">
            <a className="fc-btn fc-btn-primary fc-btn-large" href="#apps" onClick={(event) => onSectionClick(event, "apps")}>
              See the Apps
            </a>
            <a className="fc-btn fc-btn-secondary fc-btn-large" href="#contact" onClick={(event) => onSectionClick(event, "contact")}>
              Write Him
            </a>
          </div>
        </div>
        <img
          className="fc-portrait"
          src={hero.profileImg || "/profile.png"}
          alt={`Portrait of ${hero.name}`}
          width={1200}
          height={1500}
          fetchPriority="high"
          onError={(event) => {
            event.currentTarget.src = "/profile.svg";
          }}
        />
      </section>

      <AppSlider projects={projects} loading={loading} title={label(content.projectsTitle || "Shipped Apps")} />

      <section className="fc-block" id="about" aria-labelledby="studios-title">
        <header className="fc-block-head">
          <h2 id="studios-title">{label(about.title || "The Studios")}</h2>
          <p>{plain(about.intro)}</p>
        </header>
        <div className="fc-studios">
          {experiences.map((exp) => (
            <Studio key={exp.company} exp={exp} />
          ))}
        </div>
      </section>

      <section className="fc-block" id="contact" aria-labelledby="write-title">
        <div className="fc-write">
          <div>
            <h2 id="write-title">{label(contact.title || "Write Him")}</h2>
            <p>{plain(contact.intro)}</p>
            <a className="fc-mail" href={`mailto:${contact.email}`}>{contact.email}</a>
            <div className="fc-text-links">
              <a href={contact.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={contact.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
          <ContactForm email={contact.email} />
        </div>
      </section>

      <footer className="fc-foot">
        <p>{hero.name}</p>
        <nav aria-label="Page">
          <a href="#home" onClick={(event) => onSectionClick(event, "home")}>Home</a>
          <a href="#apps" onClick={(event) => onSectionClick(event, "apps")}>Apps</a>
          <a href="#projects" onClick={(event) => onSectionClick(event, "projects")}>Every Title</a>
          <a href="#about" onClick={(event) => onSectionClick(event, "about")}>Career</a>
          <a href="#contact" onClick={(event) => onSectionClick(event, "contact")}>Write Him</a>
        </nav>
        <p className="fc-quiet">{plain(footer).replace("{year}", String(year))}</p>
      </footer>
    </div>
  );
}

function RippleSlide({
  slot,
  project,
  focused,
  inMiddle,
  phase,
  reduce,
  register,
  onPick,
}: {
  slot: number;
  project: Project;
  focused: boolean;
  inMiddle: boolean;
  phase: MotionValue<number>;
  reduce: boolean;
  register: (node: HTMLButtonElement | null) => void;
  onPick: (slot: number) => void;
}) {
  const calm = useRef(reduce);
  calm.current = reduce;
  const y = useTransform(phase, (shift) => {
    if (calm.current) return 0;
    return Math.sin(slot * 0.55 + shift) * 28;
  });

  return (
    <motion.button
      type="button"
      className={focused ? "fc-slide is-focus" : "fc-slide"}
      aria-current={inMiddle && focused ? "true" : undefined}
      aria-hidden={inMiddle ? undefined : true}
      tabIndex={inMiddle ? undefined : -1}
      style={{ y }}
      ref={register}
      onClick={() => onPick(slot)}
    >
      <span className="fc-frame">
        <Shot src={project.img} alt="" />
      </span>
      <span className="fc-slide-name">{project.title}</span>
    </motion.button>
  );
}

function AppSlider({ projects, loading, title }: { projects: Project[]; loading: boolean; title: string }) {
  const count = projects.length;
  const copies = count > 1 ? 3 : 1;
  const reduce = Boolean(useReducedMotion());
  const [pos, setPos] = useState(count);
  const [dragging, setDragging] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLButtonElement | null)[]>([]);
  const pointer = useRef<{ id: number; x: number; y: number; origin: number; dx: number; lock: "x" | "y" | null } | null>(null);
  const trail = useRef<{ t: number; x: number }[]>([]);
  const dragged = useRef(false);
  const draggingRef = useRef(false);
  const dragX = useRef(0);
  const holding = useRef(false);
  const flight = useRef<{ stop: () => void } | null>(null);
  const posRef = useRef(pos);
  const countRef = useRef(count);
  const x = useMotionValue(0);
  const phase = useMotionValue(0);
  const logical = count === 0 ? 0 : ((pos % count) + count) % count;
  const current = projects[logical];
  const slidesToShow = Array.from({ length: copies }, () => projects).flat();
  posRef.current = pos;
  countRef.current = count;

  const measure = (index: number) => {
    const rail = railRef.current;
    const slide = slides.current[index];
    if (!rail || !slide) return null;
    return -(slide.offsetLeft - (rail.clientWidth - slide.offsetWidth) / 2);
  };

  const loopSpan = () => {
    const total = countRef.current;
    if (total < 2) return 0;
    const start = measure(total);
    const nextCopy = measure(total * 2);
    if (start == null || nextCopy == null) return 0;
    return start - nextCopy;
  };

  const closest = () => {
    const rail = railRef.current;
    if (!rail) return posRef.current;
    const mid = rail.getBoundingClientRect().left + rail.clientWidth / 2;
    let best = posRef.current;
    let bestDist = Infinity;
    slides.current.forEach((slide, index) => {
      if (!slide) return;
      const box = slide.getBoundingClientRect();
      const dist = Math.abs(box.left + box.width / 2 - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = index;
      }
    });
    return best;
  };

  const wrapX = () => {
    const total = countRef.current;
    const span = loopSpan();
    const origin = measure(total);
    if (!(span > 0) || origin == null) return;
    let nextX = x.get();
    const edge = origin - span;
    while (nextX <= edge) nextX += span;
    while (nextX > origin) nextX -= span;
    if (nextX !== x.get()) x.set(nextX);
  };

  const playTo = (index: number, duration = 0.45) => {
    const total = countRef.current;
    const maxIndex = Math.max(0, slides.current.length - 1);
    let slot = index;
    if (total > 1 && (slot < 0 || slot > maxIndex)) {
      const span = loopSpan();
      while (slot < 0) {
        slot += total;
        if (span > 0) x.set(x.get() - span);
      }
      while (slot > maxIndex) {
        slot -= total;
        if (span > 0) x.set(x.get() + span);
      }
    }
    slot = Math.max(0, Math.min(maxIndex, slot));
    const target = measure(slot);
    if (target == null) return;
    flight.current?.stop();
    posRef.current = slot;
    setPos(slot);
    if (reduce) {
      x.set(target);
      return;
    }
    holding.current = true;
    const controls = animate(x, target, { duration, ease: [0.22, 1, 0.36, 1] });
    flight.current = controls;
    void controls.finished.then(() => {
      if (flight.current !== controls) return;
      holding.current = false;
    }).catch(() => {
      if (flight.current === controls) holding.current = false;
    });
  };

  const releaseToIndex = (velocity: number) => {
    draggingRef.current = false;
    setDragging(false);
    const total = countRef.current;
    if (total < 2) return;
    wrapX();
    const from = measure(total);
    const next = measure(total + 1);
    if (from == null || next == null || next === from) {
      playTo(closest());
      return;
    }
    const step = next - from;
    const coast = velocity * 520;
    let delta = Math.round(coast / step);
    const cap = total - 1;
    delta = Math.max(-cap, Math.min(cap, delta));
    const near = closest();
    const distance = Math.abs(delta * step);
    playTo(near + delta, Math.min(1.05, Math.max(0.34, distance / 1400)));
  };

  const go = (dir: 1 | -1) => {
    if (count < 2) return;
    playTo(posRef.current + dir);
  };

  useEffect(() => {
    setPos(count);
  }, [count]);

  useEffect(() => {
    if (reduce || count < 2) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      if (!draggingRef.current) phase.set(phase.get() + dt * 0.0016);
      if (!draggingRef.current && !holding.current) {
        const total = countRef.current;
        const span = loopSpan();
        const origin = measure(total);
        let nextX = x.get() - (96 * dt) / 1000;
        if (span > 0 && origin != null) {
          const edge = origin - span;
          while (nextX <= edge) nextX += span;
          while (nextX > origin) nextX -= span;
        }
        x.set(nextX);
        const nearest = closest();
        if (nearest !== posRef.current) {
          posRef.current = nearest;
          setPos(nearest);
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce, count, phase, x]);

  useEffect(() => {
    const onResize = () => {
      const target = measure(posRef.current);
      if (target != null) x.set(target);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [x]);

  useLayoutEffect(() => {
    const target = measure(count > 1 ? count : 0);
    if (target != null) x.set(target);
  }, [count, x]);

  return (
    <section
      className="fc-block"
      id="apps"
      aria-labelledby="apps-title"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(-1);
        }
      }}
    >
      <header className="fc-block-head">
        <h2 id="apps-title">{title}</h2>
        <p id="projects">
          {loading && projects.length === 0
            ? "Loading the list…"
            : `${projects.length} titles in one row.`}
        </p>
      </header>
      {projects.length === 0 ? <p className="fc-quiet">No apps in this record yet.</p> : null}
      <div
        className={dragging ? "fc-rail is-dragging" : "fc-rail"}
        ref={railRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Shipped apps"
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, origin: x.get(), dx: 0, lock: null };
          trail.current = [{ t: performance.now(), x: event.clientX }];
          dragged.current = false;
          flight.current?.stop();
          try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* synthetic pointers have no capture */ }
        }}
        onPointerMove={(event) => {
          const start = pointer.current;
          if (!start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (start.lock === null) {
            if (Math.hypot(dx, dy) < 6) return;
            start.lock = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
            if (start.lock === "y") {
              pointer.current = null;
              return;
            }
            draggingRef.current = true;
            dragX.current = x.get();
            setDragging(true);
          }
          start.dx = dx;
          dragged.current = Math.abs(dx) > 8;
          const now = performance.now();
          trail.current.push({ t: now, x: event.clientX });
          const recent = now - 120;
          while (trail.current.length > 2 && trail.current[0].t < recent) trail.current.shift();
          const raw = start.origin + dx;
          phase.set(phase.get() + (dragX.current - raw) * (0.0016 / 0.096));
          dragX.current = raw;
          x.set(raw);
          wrapX();
        }}
        onPointerUp={(event) => {
          const start = pointer.current;
          if (!start || start.id !== event.pointerId) return;
          pointer.current = null;
          if (start.lock !== "x") return;
          const now = performance.now();
          const recent = trail.current.filter((point) => now - point.t <= 120);
          const pair = recent.length >= 2 ? [recent[0], recent[recent.length - 1]] : null;
          const dt = pair ? pair[1].t - pair[0].t : 0;
          const velocity = pair && dt > 0 ? (pair[1].x - pair[0].x) / dt : 0;
          releaseToIndex(velocity);
        }}
        onPointerCancel={() => {
          pointer.current = null;
          if (!draggingRef.current) return;
          releaseToIndex(0);
        }}
      >
        <motion.div className="fc-track" style={{ x }}>
          {slidesToShow.map((project, slot) => {
            const realIndex = count === 0 ? 0 : slot % count;
            const focused = realIndex === logical;
            const inMiddle = count < 2 || (slot >= count && slot < count * 2);
            return (
              <RippleSlide
                key={`${project.title}-${slot}`}
                slot={slot}
                project={project}
                focused={focused}
                inMiddle={inMiddle}
                phase={phase}
                reduce={reduce}
                register={(node) => { slides.current[slot] = node; }}
                onPick={(picked) => {
                  if (dragged.current) {
                    dragged.current = false;
                    return;
                  }
                  if (count < 2 || picked === pos) return;
                  setPos(picked);
                }}
              />
            );
          })}
        </motion.div>
      </div>
      {current ? (
        <div className="fc-focus-copy" aria-live="off">
          <h3>{current.title}</h3>
          <p>{plain(current.desc)}</p>
          <StoreLinks project={current} />
        </div>
      ) : null}
    </section>
  );
}

function BinarySlide() {
  return (
    <div className="fc-binary" aria-hidden="true">
      <div className="fc-binary-track">
        <span>{BINARY_LINE}</span>
        <span>{BINARY_LINE}</span>
      </div>
    </div>
  );
}

function StoreLinks({ project }: { project: Project }) {
  if (!project.appStore && !project.playStore) {
    return <p className="fc-quiet">No public store link</p>;
  }
  return (
    <p className="fc-stores">
      {project.appStore ? <a href={project.appStore} target="_blank" rel="noreferrer">App Store</a> : null}
      {project.playStore ? <a href={project.playStore} target="_blank" rel="noreferrer">Google Play</a> : null}
    </p>
  );
}

function Studio({ exp }: { exp: Experience }) {
  const current = exp.roles.some((role) => role.current);
  return (
    <article className={current ? "fc-studio is-current" : "fc-studio"}>
      <div>
        <h3>{exp.company}</h3>
        <p className="fc-count">{exp.badge}{current ? " · Current" : ""}</p>
      </div>
      <div>
        <p>{plain(exp.desc)}</p>
        <ul>
          {exp.roles.map((role) => (
            <li key={`${role.type}-${role.period}`}>
              {role.type}, {role.period}{role.current ? ", current" : ""}
            </li>
          ))}
        </ul>
        <p className="fc-quiet">{exp.tags.join(", ")}</p>
      </div>
    </article>
  );
}

function Shot({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [src]);
  if (failed || !src) return <span className="fc-frame-empty">No shot</span>;
  return (
    <img
      src={src}
      alt={alt}
      width={720}
      height={900}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
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
        Name
        <input name="name" type="text" autoComplete="name" required />
      </label>
      <label>
        Subject
        <input name="subject" type="text" />
      </label>
      <label className="fc-field-wide">
        Message
        <textarea name="message" required />
      </label>
      <button className="fc-btn fc-btn-primary" type="submit">Send the Note</button>
      {note ? <p className="fc-status" role="status">{note}</p> : null}
    </form>
  );
}
