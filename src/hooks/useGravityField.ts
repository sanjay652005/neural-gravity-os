/**
 * useGravityField — Phase 9: Zone-Aware
 *
 * Now reads floatAmplitude and magneticForce from the active Gravity Zone.
 * The zone values are interpolated by GravityContext — this hook just consumes them.
 *
 * Per the Gravity Design Manifesto:
 * "Create an invisible gravity field around the native cursor. The environment should react."
 */

import { useRef, useCallback, useEffect } from 'react'
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useGravity } from '@/contexts/GravityContext'

interface GravityFieldOptions {
  /** Max translation in px — scaled by zone.floatAmplitude. Default 3 */
  maxTranslate?: number
  /** Max rotation in deg — default 1.8 */
  maxRotate?: number
  /** Lift applied during pulse in px — default 4 */
  pulseLifter?: number
  /** Field responsiveness. Lower = more inertia. Default 0.03 */
  lag?: number
  /** Falloff radius in px. Default 700 */
  radius?: number
}

export function useGravityField({
  maxTranslate = 3,
  maxRotate = 1.8,
  pulseLifter = 4,
  lag = 0.03,
  radius = 700,
}: GravityFieldOptions = {}) {
  const { cursorField, onPulse, pulseState, fieldStrength, activeZone } = useGravity()
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // Keep zone ref for RAF loop without re-running
  const zoneRef = useRef(activeZone)
  zoneRef.current = activeZone
  const fieldStrengthRef = useRef(fieldStrength)
  fieldStrengthRef.current = fieldStrength

  const x  = useMotionValue(0)
  const y  = useMotionValue(0)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)

  const springX  = useSpring(x,  { stiffness: 70, damping: 18, mass: 0.8 })
  const springY  = useSpring(y,  { stiffness: 70, damping: 18, mass: 0.8 })
  const springRx = useSpring(rx, { stiffness: 50, damping: 16, mass: 0.7 })
  const springRy = useSpring(ry, { stiffness: 50, damping: 16, mass: 0.7 })

  const rafRef = useRef<number>(0)
  const cursorRef = useRef(cursorField)
  cursorRef.current = cursorField

  const animate = useCallback(() => {
    if (shouldReduceMotion || !ref.current) {
      x.set(0); y.set(0); rx.set(0); ry.set(0)
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    const rect = ref.current.getBoundingClientRect()

    if (rect.bottom < -100 || rect.top > window.innerHeight + 100) {
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    const cursor = cursorRef.current
    const zone   = zoneRef.current
    const fs     = fieldStrengthRef.current

    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2

    const dx = cursor.x - cx
    const dy = cursor.y - cy
    const dist = Math.sqrt(dx * dx + dy * dy)

    const t = Math.max(0, 1 - dist / radius)
    const falloff = t * t * (3 - 2 * t)

    // Zone floatAmplitude scales the translate effect
    const strength = falloff * fs * zone.floatAmplitude

    const nx = dist > 0 ? dx / dist : 0
    const ny = dist > 0 ? dy / dist : 0

    const effectiveTranslate = maxTranslate * zone.floatAmplitude
    const targetX  = nx * effectiveTranslate * strength
    const targetY  = ny * effectiveTranslate * strength
    const targetRy =  (dx / (window.innerWidth  / 2)) * maxRotate * strength
    const targetRx = -(dy / (window.innerHeight / 2)) * maxRotate * strength

    const effectiveLag = lag * (1 + cursor.speed * 0.02)
    x.set(x.get()  + (targetX  - x.get())  * effectiveLag)
    y.set(y.get()  + (targetY  - y.get())  * effectiveLag)
    rx.set(rx.get() + (targetRx - rx.get()) * (lag * 0.7))
    ry.set(ry.get() + (targetRy - ry.get()) * (lag * 0.7))

    rafRef.current = requestAnimationFrame(animate)
  }, [shouldReduceMotion, maxTranslate, maxRotate, lag, radius, x, y, rx, ry])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  // Gravitational pulse lift — scaled by zone floatAmplitude
  useEffect(() => {
    if (shouldReduceMotion) return
    return onPulse(() => {
      const zone = zoneRef.current
      const fs   = fieldStrengthRef.current
      const startTime = performance.now()
      const liftDuration = 2000
      const liftAmt = pulseLifter * fs * 0.6 * zone.floatAmplitude

      const liftTick = (now: number) => {
        const t = Math.min((now - startTime) / liftDuration, 1)
        const bell = Math.sin(t * Math.PI) * Math.pow(1 - t, 0.4)
        y.set(-liftAmt * bell)
        if (t < 1) requestAnimationFrame(liftTick)
      }
      requestAnimationFrame(liftTick)
    })
  }, [shouldReduceMotion, onPulse, pulseLifter, y])

  return {
    ref,
    style: {
      x: springX,
      y: springY,
      rotateX: springRx,
      rotateY: springRy,
      transformStyle: 'preserve-3d' as const,
    },
    pulseState,
    fieldStrength,
    activeZone,
  }
}
