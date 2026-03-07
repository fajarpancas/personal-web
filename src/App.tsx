import { Routes, Route } from "react-router-dom";
import OnePage from "./pages/OnePage";
import QRIS from "./pages/QRIS";
import NavBar from "./components/NavBar";
import ScrollProgress from "./components/ScrollProgress";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollOnRouteChange from "./components/ScrollOnRouteChange";
import ScrollToHash from "./components/ScrollToHash";

export default function App() {
  return (
    <>
      <ScrollOnRouteChange />
      <ScrollToHash />
      <ScrollProgress />
      <NavBar />
      <main className="snap">
        <Routes>
          <Route path="/" element={<OnePage />} />
          <Route path="/QRIS" element={<QRIS />} />
        </Routes>
      </main>
      <ScrollToTopButton />
    </>
  );
}
