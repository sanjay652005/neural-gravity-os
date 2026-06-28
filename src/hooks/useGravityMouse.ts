import { useEffect, useRef } from 'react'
import { useMotionValue } from 'framer-motion'

/**
 * Returns shared throttled mouse position as MotionValues.
 * Safe to call in multiple components — each call creates its own values
 * but all are driven by a single global mousemove listener per component.
 */
export function useGravityMouse(throttleMs = 16) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const lastCall = useRef(0)

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const handler = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastCall.current < throttleMs) return
      lastCall.current = now
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [mouseX, mouseY, throttleMs])

  return { mouseX, mouseY }
}
