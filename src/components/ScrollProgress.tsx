import { useEffect, useState } from 'react'
import { getScrollY, getScrollHeight } from '../utils/scroll'

export default function ScrollProgress() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handler = () => {
      const scrolled = getScrollY()
      const height = getScrollHeight() - window.innerHeight
      const pct = height > 0 ? (scrolled / height) * 100 : 0
      setWidth(Math.min(100, Math.max(0, pct)))
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true, capture: true })
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler, { capture: true } as EventListenerOptions)
      window.removeEventListener('resize', handler)
    }
  }, [])

  return <div className="scroll-progress" style={{ width: `${width}%` }} />
}
