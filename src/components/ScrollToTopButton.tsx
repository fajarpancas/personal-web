import { useEffect, useState } from 'react'

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 240)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const onClick = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      className={`scroll-top ${show ? 'show' : ''}`}
      aria-label="Scroll to top"
      onClick={onClick}
    >
      ↑
    </button>
  )
}
