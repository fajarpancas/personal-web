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
      <footer className="site-footer">
        <div className="container">
          <p>© 2026 Fajar Panca</p>
          <div className="social">
            <a
              href="https://github.com/fajarpancas"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1 .07 1.52 1.06 1.52 1.06.9 1.59 2.36 1.13 2.94.86.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.33.1-2.77 0 0 .85-.28 2.78 1.05.81-.23 1.67-.35 2.53-.35s1.72.12 2.53.35c1.93-1.33 2.78-1.05 2.78-1.05.55 1.44.2 2.51.1 2.77.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.82-4.57 5.08.36.33.68.97.68 1.95 0 1.41-.01 2.55-.01 2.9 0 .27.18.6.69.49A10.05 10.05 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/fajarpancasaputra/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.9 14H6V10h3.1v7zM7.55 8.86C6.7 8.86 6 8.16 6 7.32s.7-1.54 1.55-1.54 1.55.69 1.55 1.54-.7 1.54-1.55 1.54zM20 17h-3.1v-3.39c0-.81-.02-1.86-1.13-1.86-1.13 0-1.3.88-1.3 1.8V17H11V10h2.97v.96h.04c.41-.77 1.41-1.58 2.9-1.58 3.1 0 3.67 2.04 3.67 4.7V17z"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
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
      img: "/madkhal.png",
      appStore: "https://apps.apple.com/id/app/madkhal/id6479597417?l=id",
      playStore:
        "https://play.google.com/store/apps/details?id=com.elmadhkhalmobile.app",
    },
    {
      title: "VirtualSpace",
      desc: "Mobile based chat and project management application",
      img: "/virtualspace.png",
      appStore:
        "https://apps.apple.com/id/app/virtualspace-work-smarter/id1513794884",
      playStore:
        "https://play.google.com/store/apps/details?id=me.virtualspirit.virtualspace",
    },
    {
      title: "KoolBuddy",
      desc: "A digital companion app for carbon‑conscious generation",
      img: "/koolbuddy.png",
      appStore: "https://apps.apple.com/mn/app/kool-buddy/id6450994509",
      playStore: "",
    },
    {
      title: "Achiever Dream+",
      desc: "Mobile based for chemistry practical examination in Singapore with an NEA‑approved Chemistry Practical Lab",
      img: "/achiever-dream-plus.png",
      appStore:
        "https://apps.apple.com/id/app/achievers-dream/id1662868706?l=id",
      playStore:
        "https://play.google.com/store/apps/details?id=com.achieversdream.app",
    },
    {
      title: "Moirai MomCare",
      desc: "Mobile based to assist every step of pregnancy journey",
      img: "/momcare.png",
      appStore: "https://apps.apple.com/sg/app/moirai-momcare/id1663835824",
      playStore:
        "https://play.google.com/store/apps/details?id=com.momcare.app",
    },
    {
      title: "Together Living",
      desc: "Mobile base payment for room rental with features chat, store, reward.",
      img: "/together-living.png",
      appStore: "https://apps.apple.com/us/app/together-living/id1583899658",
      playStore:
        "https://play.google.com/store/apps/details?id=com.togetherliving.app",
    },
    {
      title: "Tzu‑Chi Volunteer Management",
      desc: "Mobile based application volunteer management for Tzu‑Chi Malaysia",
      img: "/tzu-chi-vms.png",
      appStore: "",
      playStore: "",
    },
    {
      title: "WhatsDoc",
      desc: "Mobile based doctor‑to‑doctor and doctor‑to‑patient consultation via chat or video call",
      img: "/whatsdoc.png",
      appStore: "",
      playStore: "",
    },
    {
      title: "Duedi: The investor's toolkit",
      desc: "Mobile based toolkits for investor, this app provide 12 free tools for investor",
      img: "/duedi.png",
      appStore: "",
      playStore: "",
    },
    {
      title: "AntriQue Merchant Operator",
      desc: "Mobile based queue used by the admin of the merchant to create new queue",
      img: "/antrique-operator.png",
      appStore: "",
      playStore: "",
    },
    {
      title: "AntriQue KIOSK",
      desc: "Mobile based queue thats connects to a Bluetooth thermal printer device for retrieval and printing the queue tickets",
      img: "/antrique-kiosk.png",
      appStore: "",
      playStore: "",
    },
    {
      title: "AntriQue Customer",
      desc: "Mobile based queue used by user for queue retrieval and monitoring",
      img: "/antrique-customer.png",
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
