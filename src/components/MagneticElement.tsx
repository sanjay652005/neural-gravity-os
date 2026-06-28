/**
 * MagneticElement — Phase 9: Zone-Aware
 *
 * magneticForce is now scaled by activeZone.magneticForce.
 * In the CORE SYSTEM (skills) zone, magneticForce = 1.8 — elements pull harder.
 * In the MISSION LOG zone, it drops to 0.9 — the past is settled.
 *
 * Per the Gravity Design Manifesto:
 * "Buttons do not hover. They become magnetically attracted."
 */

import { useRef, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useGravity } from '@/contexts/GravityContext'

interface MagneticElementProps {
  children: React.ReactNode
  className?: string
  /** Base pull strength — amplified by fieldStrength and zone.magneticForce. Default 0.28 */
  strength?: number
  disabled?: boolean
}

export default function MagneticElement({
  children,
  className,
  strength = 0.28,
  disabled = false,
}: MagneticElementProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { cursorField, fieldStrength, activeZone } = useGravity()
  const shouldReduceMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 180, damping: 20, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 180, damping: 20, mass: 0.5 })

  const rafRef = useRef<number>(0)

  // Refs for RAF loop — avoid stale closures without restarting the loop
  const cursorRef    = useRef(cursorField)
  const fsRef        = useRef(fieldStrength)
  const zoneRef      = useRef(activeZone)
  cursorRef.current  = cursorField
  fsRef.current      = fieldStrength
  zoneRef.current    = activeZone

  const animate = useCallback(() => {
    if (disabled || shouldReduceMotion || !ref.current) {
      x.set(0); y.set(0)
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    const cursor = cursorRef.current
    const zone   = zoneRef.current
    const fs     = fsRef.current

    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2

    const dx = cursor.x - cx
    const dy = cursor.y - cy
    const dist = Math.sqrt(dx * dx + dy * dy)

    const magnetRadius = 120
    const t = Math.max(0, 1 - dist / magnetRadius)

    // Zone magneticForce scales the pull
    const pull = t * t * strength * fs * zone.magneticForce

    const maxPx = 5
    const targetX = Math.max(-maxPx, Math.min(maxPx, (dx / Math.max(dist, 1)) * pull * magnetRadius))
    const targetY = Math.max(-maxPx, Math.min(maxPx, (dy / Math.max(dist, 1)) * pull * magnetRadius))

    x.set(x.get() + (targetX - x.get()) * 0.12)
    y.set(y.get() + (targetY - y.get()) * 0.12)

    rafRef.current = requestAnimationFrame(animate)
  }, [disabled, shouldReduceMotion, strength, x, y])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'contents' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
