import { useEffect, useState } from 'react'
import { getScrollY, scrollToTop } from '../utils/scroll'

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = () => setShow(getScrollY() > 240)
    handler()
    window.addEventListener('scroll', handler, { passive: true, capture: true })
    return () => window.removeEventListener('scroll', handler, { capture: true } as EventListenerOptions)
  }, [])

  return (
    <button
      className={`scroll-top ${show ? 'show' : ''}`}
      aria-label="Scroll to top"
      onClick={() => scrollToTop('smooth')}
    >
      ↑
    </button>
  )
}
