import Reveal from "../components/Reveal";

export default function Home() {
  return (
    <section className="section">
      <Reveal>
        <h1>Halo, saya Fajar Panca</h1>
      </Reveal>
      <Reveal delay={100}>
        <p>Selamat datang di personal website saya.</p>
      </Reveal>
      <Reveal delay={200} variant="scale">
        <p>Gulir untuk melihat lebih banyak.</p>
      </Reveal>
    </section>
  );
}
