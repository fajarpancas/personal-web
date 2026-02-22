import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const order: Record<string, number> = {
  "/": 0,
  "/about": 1,
  "/projects": 2,
  "/contact": 3,
};

export default function ScrollOnRouteChange() {
  const location = useLocation();
  const prevPath = useRef<string>(location.pathname);

  useEffect(() => {
    const from = prevPath.current;
    const to = location.pathname;
    prevPath.current = to;

    const prevIndex = order[from] ?? 0;
    const nextIndex = order[to] ?? 0;
    const goingDown = nextIndex > prevIndex;

    const run = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const target = goingDown ? Math.max(0, height) : 0;
      window.scrollTo({ top: target, behavior: "smooth" });
    };
    requestAnimationFrame(() => requestAnimationFrame(run));
  }, [location.pathname]);

  return null;
}
