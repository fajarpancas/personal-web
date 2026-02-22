import Reveal from "../components/Reveal";

export default function Contact() {
  return (
    <section className="section">
      <Reveal>
        <h1>Kontak</h1>
      </Reveal>
      <Reveal delay={100}>
        <p>Email: fajar@example.com</p>
      </Reveal>
      <Reveal delay={200}>
        <p>LinkedIn: linkedin.com/in/fajarpanca</p>
      </Reveal>
    </section>
  );
}
