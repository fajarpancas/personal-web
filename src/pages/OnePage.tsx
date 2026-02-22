import Reveal from "../components/Reveal";
import { useEffect, useRef, useState } from "react";

export default function OnePage() {
  return (
    <div>
      <section id="home" className="snap-section section">
        <div className="container hero">
          <div>
            <Reveal>
              <h1>Fajar Panca — Frontend Developer</h1>
            </Reveal>
            <Reveal delay={200}>
              <p>
                I'm a frontend developer with 6+ years of experience. I've built
                15+ mobile apps with React Native and published them on the App
                Store (iOS) and Google Play (Android).
              </p>
            </Reveal>
          </div>
          <Reveal delay={180} variant="scale">
            <img
              src="/profile.png"
              onError={(e) => {
                e.currentTarget.src = "/profile.svg";
              }}
              alt="Foto profil Fajar Panca"
              className="profile profile-round"
            />
          </Reveal>
        </div>
      </section>

      <section id="about" className="snap-section section">
        <div className="container">
          <Reveal>
            <h1>Work Experiences</h1>
          </Reveal>
          <Reveal delay={120}>
            <p>
              Frontend Developer focused on React Native across full-time and
              part-time roles since 2019, delivering mobile apps while balancing
              concurrent engagements.
            </p>
          </Reveal>
          <Reveal delay={200} variant="left">
            <ul className="cards experience">
              <li className="card">
                <div className="card-head">
                  <h3>VirtualSpirit</h3>
                  <span className="badge">11 apps</span>
                </div>
                <ul className="exp-meta">
                  <li>Full-time: Dec 2019 – Nov 2022</li>
                  <li>Part-time: Nov 2022 – Nov 2023</li>
                  <li>Full-time: Nov 2023 – Present</li>
                </ul>
              </li>
              <li className="card">
                <div className="card-head">
                  <h3>Dagangan</h3>
                  <span className="badge">1 app</span>
                </div>
                <ul className="exp-meta">
                  <li>Full-time: Nov 2022 – Nov 2023</li>
                </ul>
              </li>
              <li className="card">
                <div className="card-head">
                  <h3>AntriQue</h3>
                  <span className="badge">4 apps</span>
                </div>
                <ul className="exp-meta">
                  <li>Part-time: Sep 2020 – Aug 2021</li>
                </ul>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="projects" className="snap-section section">
        <div className="container">
          <Reveal>
            <h1>Projects</h1>
          </Reveal>
          <ProjectsCarousel />
        </div>
      </section>

      <section id="contact" className="snap-section section">
        <div className="container">
          <Reveal>
            <h1>Let's Connect</h1>
          </Reveal>
          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function ContactForm() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const subject = String(fd.get("subject") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const to = "fajarpancasaputra@gmail.com";
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

function ProjectsCarousel() {
  const data = [
    {
      title: "JIFF Customer",
      desc: "A consumer super app that combines a marketplace with on‑demand express delivery.",
      img: "/jiff-customer.png",
      appStore:
        "https://apps.apple.com/us/app/jiff-express-shopping/id6749932038",
      playStore:
        "https://play.google.com/store/apps/details?id=com.jiffcustomer.app",
    },
    {
      title: "JIFF Agent",
      desc: "A field‑operations super app supporting four roles: Merchant, Storage, Rider, and Reseller agents.",
      img: "/jiff-agent.png",
      appStore:
        "https://apps.apple.com/us/app/jiff-agent-partners-app/id6749932298",
      playStore:
        "https://play.google.com/store/apps/details?id=com.jiffagent.app",
    },
    {
      title: "KohBus Driver",
      desc: "A driver app with turn‑by‑turn navigation across scheduled routes and waypoints, plus in‑app messaging with riders on the same route.",
      img: "/kohbus-driver.png",
      appStore: "https://apps.apple.com/id/app/kohbus-driver/id6738333966?l=id",
      playStore:
        "https://play.google.com/store/apps/details?id=com.kohbus.driver.app.release",
    },
    {
      title: "KohBus Rider",
      desc: "A rider app for bus booking, live vehicle tracking, and in‑app chat with drivers.",
      img: "/kohbus-rider.png",
      appStore: "https://apps.apple.com/id/app/kohbus-rider/id6738334250?l=id",
      playStore:
        "https://play.google.com/store/apps/details?id=com.kohbus.rider.app.release",
    },
    {
      title: "Madkhal",
      desc: "An Islamic app with Qibla direction, prayer times (currently Malaysia & Singapore), and free/premium learning content via videos and documents.",
      img: "/projects/madkhal.jpg",
      appStore: "",
      playStore: "",
    },
  ];

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      const i = Math.round(el.scrollLeft / (w * 0.8));
      setActive(Math.max(0, Math.min(i, data.length - 1)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [data.length]);

  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const slideWidth = el.clientWidth * 0.8;
    el.scrollTo({ left: i * (slideWidth + 16), behavior: "smooth" });
    setActive(i);
  };
  const prev = () => scrollToIndex(Math.max(0, active - 1));
  const next = () => scrollToIndex(Math.min(data.length - 1, active + 1));

  return (
    <Reveal delay={120}>
      <div className="carousel">
        <div className="carousel-track" ref={trackRef}>
          {data.map((p, i) => (
            <article className="slide" key={i}>
              <div className="header-image">
                <img
                  src={p.img}
                  alt=""
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
              <div className="slide-body">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                {(p.appStore || p.playStore) && (
                  <div className="store-buttons">
                    {p.appStore && (
                      <a
                        href={p.appStore}
                        target="_blank"
                        rel="noreferrer"
                        className="store-btn appstore"
                      >
                        App Store
                      </a>
                    )}
                    {p.playStore && (
                      <a
                        href={p.playStore}
                        target="_blank"
                        rel="noreferrer"
                        className="store-btn playstore"
                      >
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
          <button className="car-btn" onClick={prev} aria-label="Previous">
            ‹
          </button>
          <div className="dots">
            {data.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === active ? "on" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollToIndex(i)}
              />
            ))}
          </div>
          <button className="car-btn" onClick={next} aria-label="Next">
            ›
          </button>
        </div>
      </div>
    </Reveal>
  );
}
