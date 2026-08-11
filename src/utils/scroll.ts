/**
 * Scroll helpers that work whether the window or the <body> is the
 * actual scroll container (which varies by browser/CSS quirks).
 */

export function getScrollY(): number {
  const d = document.documentElement;
  const b = document.body;
  return Math.max(
    window.scrollY || 0,
    window.pageYOffset || 0,
    d.scrollTop || 0,
    b ? b.scrollTop || 0 : 0,
  );
}

export function getScrollHeight(): number {
  const d = document.documentElement;
  const b = document.body;
  return Math.max(d.scrollHeight, b ? b.scrollHeight : 0);
}

export function scrollToTop(behavior: ScrollBehavior = "smooth") {
  scrollToY(0, behavior);
}

export function scrollToY(y: number, behavior: ScrollBehavior = "smooth") {
  try {
    window.scrollTo({ top: y, behavior });
  } catch {
    window.scrollTo(0, y);
  }
  // Fallback for environments where <body> is the scroll container and
  // window.scrollTo silently does nothing. Only applied for instant jumps
  // so smooth scrolling is not interrupted.
  if (behavior === "auto") {
    document.documentElement.scrollTop = y;
    if (document.body) document.body.scrollTop = y;
  }
}
