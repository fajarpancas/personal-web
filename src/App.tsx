import { Routes, Route, useLocation } from "react-router-dom";
import OnePage from "./pages/OnePage";
import QRIS from "./pages/QRIS";
import AddAddress from "./pages/AddAddress";
import ListAddress from "./pages/ListAddress";
import Admin from "./pages/Admin";
import NavBar from "./components/NavBar";
import ScrollProgress from "./components/ScrollProgress";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollOnRouteChange from "./components/ScrollOnRouteChange";
import ScrollToHash from "./components/ScrollToHash";
import { useEffect, useRef } from "react";

export default function App() {
  const location = useLocation();
  const path = location.pathname.replace(/\/+$/, "").toLowerCase();
  const hideNav = path.startsWith("/qris") || path === "/add-address" || path === "/list-address" || path === "/admin";
  const noSnap = path === "/add-address" || path === "/list-address" || path === "/admin";
  return (
    <>
      <ScrollOnRouteChange />
      <ScrollToHash />
      <ScrollProgress />
      {!hideNav && <NavBar />}
      <div className="aurora" aria-hidden="true" />
      <main className={noSnap ? "" : "snap"}>
        <Routes>
          <Route path="/" element={<OnePage />} />
          <Route path="/QRIS" element={<QRIS />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/list-address" element={<ListAddress />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <ScrollToTopButton />
      <CursorGlow />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

/* ── Cursor glow ─────────────────────────────────────────── */

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    const loop = () => {
      x += (tx - x) * 0.1;
      y += (ty - y) * 0.1;
      el.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cursor-glow" ref={ref} aria-hidden="true" />;
}
