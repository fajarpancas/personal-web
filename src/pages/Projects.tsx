import Reveal from "../components/Reveal";

export default function Projects() {
  return (
    <section className="section">
      <Reveal>
        <h1>Projek</h1>
      </Reveal>
      <Reveal delay={100}>
        <ul className="cards">
          <li className="card">Portfolio SPA</li>
          <li className="card">Komponen UI kecil-kecilan</li>
          <li className="card">Eksperimen animasi CSS</li>
        </ul>
      </Reveal>
    </section>
  );
}
