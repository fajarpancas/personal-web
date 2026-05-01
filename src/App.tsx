import { Routes, Route, useLocation } from "react-router-dom";
import OnePage from "./pages/OnePage";
import QRIS from "./pages/QRIS";
import AddAddress from "./pages/AddAddress";
import ListAddress from "./pages/ListAddress";
import NavBar from "./components/NavBar";
import ScrollProgress from "./components/ScrollProgress";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollOnRouteChange from "./components/ScrollOnRouteChange";
import ScrollToHash from "./components/ScrollToHash";

export default function App() {
  const location = useLocation();
  const path = location.pathname.replace(/\/+$/, "").toLowerCase();
  const hideNav = path.startsWith("/qris") || path === "/add-address" || path === "/list-address";
  const noSnap = path === "/add-address" || path === "/list-address";
  return (
    <>
      <ScrollOnRouteChange />
      <ScrollToHash />
      <ScrollProgress />
      {!hideNav && <NavBar />}
      <main className={noSnap ? "" : "snap"}>
        <Routes>
          <Route path="/" element={<OnePage />} />
          <Route path="/QRIS" element={<QRIS />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/list-address" element={<ListAddress />} />
        </Routes>
      </main>
      <ScrollToTopButton />
    </>
  );
}
