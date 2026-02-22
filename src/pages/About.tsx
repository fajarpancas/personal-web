import Reveal from "../components/Reveal";

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
            <h1>Projek</h1>
          </Reveal>
          <Reveal delay={120}>
            <ul className="cards">
              <li className="card">Portfolio SPA</li>
              <li className="card">Komponen UI kecil-kecilan</li>
              <li className="card">Eksperimen animasi CSS</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="snap-section section">
        <div className="container">
          <Reveal>
            <h1>Kontak</h1>
          </Reveal>
          <Reveal delay={120}>
            <p>Email: fajar@example.com</p>
          </Reveal>
          <Reveal delay={200}>
            <p>LinkedIn: linkedin.com/in/fajarpanca</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
