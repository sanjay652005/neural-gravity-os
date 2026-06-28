/**
 * GravityContext — Gravity Engine + Zone System
 *
 * Phase 9 addition: Gravity Zones
 * Each section of the portfolio exposes its own gravitational environment.
 * The engine interpolates between zones as the user scrolls — never abruptly.
 *
 * Per the Gravity Design Manifesto:
 * "All interactive motion should originate from a centralized Gravity Engine."
 * "Create an invisible gravity field around the native cursor. The environment should react."
 *
 * The gravity field is ALWAYS active. Anti-Gravity Mode changes its character.
 * Zone transitions change the environment the field operates within.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react'
import {
  GRAVITY_ZONES,
  ZONE_SECTION_MAP,
  ZONE_TRANSITION_DURATION,
  type GravityZoneConfig,
  type ZoneId,
} from '@/constants/gravityZones'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CursorField {
  x: number
  y: number
  /** Normalized -1→1 across viewport */
  nx: number
  ny: number
  /** Velocity magnitude — used to scale field strength */
  speed: number
}

export interface PulseState {
  active: boolean
  /** 0→1 progress of the current pulse */
  progress: number
  count: number
}

/** Live interpolated zone config — all values smoothly in-between zones */
export interface ActiveZone extends GravityZoneConfig {
  /** 0→1 transition progress */
  transitionProgress: number
  /** The zone we're transitioning toward */
  targetZoneId: ZoneId
}

interface GravityContextValue {
  /** Anti-Gravity Mode — changes field character, not field existence */
  gravityEnabled: boolean
  toggleGravity: () => void
  pulseState: PulseState
  /** The invisible cursor gravity field — always present */
  cursorField: CursorField
  /** Register a pulse listener — called once per pulse fire */
  onPulse: (cb: () => void) => () => void
  /**
   * Field strength multiplier.
   * 1.0 in standard mode. 1.8 in Anti-Gravity Mode.
   * Combines with active zone's gravityStrength.
   */
  fieldStrength: number

  // ── Zone System ──────────────────────────────────────────────────────────

  /** The fully interpolated active zone — always smooth, never snapped */
  activeZone: ActiveZone
  /** Set the target zone by section label (from useScrollSection) */
  setZoneBySection: (sectionLabel: string) => void
}

// ─── Context ─────────────────────────────────────────────────────────────────

const GravityContext = createContext<GravityContextValue | null>(null)

export function useGravity() {
  const ctx = useContext(GravityContext)
  if (!ctx) throw new Error('useGravity must be inside GravityProvider')
  return ctx
}

// ─── Interpolation helper ─────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Smooth cubic easing — matches the portal-feel of entering a new environment */
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function lerpZone(from: GravityZoneConfig, to: GravityZoneConfig, t: number): GravityZoneConfig {
  const e = easeInOut(Math.max(0, Math.min(1, t)))
  return {
    id: to.id,
    name: to.name,
    state: to.state,
    gravityStrength: lerp(from.gravityStrength, to.gravityStrength, e),
    particleSpeed:   lerp(from.particleSpeed,   to.particleSpeed,   e),
    orbitSpeed:      lerp(from.orbitSpeed,       to.orbitSpeed,      e),
    floatAmplitude:  lerp(from.floatAmplitude,   to.floatAmplitude,  e),
    magneticForce:   lerp(from.magneticForce,    to.magneticForce,   e),
    ambientGlow:     lerp(from.ambientGlow,      to.ambientGlow,     e),
    cursorRadius:    lerp(from.cursorRadius,     to.cursorRadius,    e),
    cursorStrength:  lerp(from.cursorStrength,   to.cursorStrength,  e),
    pulseInterval:   [
      lerp(from.pulseInterval[0], to.pulseInterval[0], e),
      lerp(from.pulseInterval[1], to.pulseInterval[1], e),
    ],
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GravityProvider({ children }: { children: ReactNode }) {
  const [gravityEnabled, setGravityEnabled] = useState(false)
  const [pulseState, setPulseState] = useState<PulseState>({
    active: false,
    progress: 0,
    count: 0,
  })
  const [cursorField, setCursorField] = useState<CursorField>({
    x: -9999,
    y: -9999,
    nx: 0,
    ny: 0,
    speed: 0,
  })

  // ── Zone State ────────────────────────────────────────────────────────────
  const fromZoneRef = useRef<GravityZoneConfig>(GRAVITY_ZONES.hero)
  const toZoneRef   = useRef<GravityZoneConfig>(GRAVITY_ZONES.hero)
  const transitionStartRef = useRef<number>(0)
  const transitionActiveRef = useRef(false)

  const [activeZone, setActiveZone] = useState<ActiveZone>({
    ...GRAVITY_ZONES.hero,
    transitionProgress: 1,
    targetZoneId: 'hero',
  })

  // Zone transition RAF
  const zoneRafRef = useRef<number>(0)

  const runZoneTransition = useCallback(() => {
    const tick = (now: number) => {
      if (!transitionActiveRef.current) return

      const elapsed = now - transitionStartRef.current
      const t = Math.min(elapsed / ZONE_TRANSITION_DURATION, 1)

      const interpolated = lerpZone(fromZoneRef.current, toZoneRef.current, t)

      setActiveZone({
        ...interpolated,
        transitionProgress: t,
        targetZoneId: toZoneRef.current.id,
      })

      if (t < 1) {
        zoneRafRef.current = requestAnimationFrame(tick)
      } else {
        transitionActiveRef.current = false
        fromZoneRef.current = toZoneRef.current
      }
    }

    zoneRafRef.current = requestAnimationFrame(tick)
  }, [])

  const setZoneBySection = useCallback((sectionLabel: string) => {
    const zoneId = ZONE_SECTION_MAP[sectionLabel]
    if (!zoneId) return

    const targetZone = GRAVITY_ZONES[zoneId]
    if (targetZone.id === toZoneRef.current.id) return // already heading there

    // Cancel any in-progress transition — start fresh from current interpolated state
    cancelAnimationFrame(zoneRafRef.current)
    fromZoneRef.current = { ...activeZone } // freeze current interpolated values as new "from"
    toZoneRef.current = targetZone
    transitionStartRef.current = performance.now()
    transitionActiveRef.current = true

    runZoneTransition()
  }, [activeZone, runZoneTransition])

  // Cleanup zone RAF on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(zoneRafRef.current)
  }, [])

  // Field strength: base 1.0, amplified in Anti-Gravity, scaled by zone
  const fieldStrength = (gravityEnabled ? 1.8 : 1.0) * activeZone.gravityStrength

  // Pulse listeners registry
  const pulseListeners = useRef<Set<() => void>>(new Set())
  const onPulse = useCallback((cb: () => void) => {
    pulseListeners.current.add(cb)
    return () => pulseListeners.current.delete(cb)
  }, [])

  // ── Cursor field — always active, throttled to ~60fps ──────────────────────
  const lastCursorTime = useRef(0)
  const lastPos = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastCursorTime.current < 16) return
      const dt = Math.max(now - lastCursorTime.current, 1)
      lastCursorTime.current = now

      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      const speed = Math.sqrt(dx * dx + dy * dy) / dt * 16

      lastPos.current = { x: e.clientX, y: e.clientY }

      setCursorField({
        x: e.clientX,
        y: e.clientY,
        nx: (e.clientX / window.innerWidth) * 2 - 1,
        ny: (e.clientY / window.innerHeight) * 2 - 1,
        speed: Math.min(speed, 20),
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── Pulse Engine — adapts interval to active zone ─────────────────────────
  const pulseRafRef = useRef<number>(0)
  const pulseStartRef = useRef<number>(0)
  const nextPulseRef = useRef<number>(0)
  const activeZoneRef = useRef(activeZone)
  activeZoneRef.current = activeZone // keep ref in sync without re-running effect

  useEffect(() => {
    const pulseDuration = gravityEnabled ? 2200 : 2000
    nextPulseRef.current = performance.now() + (gravityEnabled ? 3000 : 6000)
    let currentCount = pulseState.count

    const tick = (now: number) => {
      if (now >= nextPulseRef.current && pulseStartRef.current === 0) {
        pulseStartRef.current = now
        currentCount++
        pulseListeners.current.forEach(cb => cb())
      }

      if (pulseStartRef.current > 0) {
        const elapsed = now - pulseStartRef.current
        const progress = Math.min(elapsed / pulseDuration, 1)
        setPulseState({ active: true, progress, count: currentCount })

        if (progress >= 1) {
          pulseStartRef.current = 0
          setPulseState({ active: false, progress: 0, count: currentCount })

          // Use active zone's pulse interval
          const [min, max] = activeZoneRef.current.pulseInterval
          nextPulseRef.current = now + min + Math.random() * (max - min)
        }
      }

      pulseRafRef.current = requestAnimationFrame(tick)
    }

    pulseRafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(pulseRafRef.current)
      pulseStartRef.current = 0
    }
  }, [gravityEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleGravity = useCallback(() => {
    setGravityEnabled(prev => !prev)
  }, [])

  return (
    <GravityContext.Provider
      value={{
        gravityEnabled,
        toggleGravity,
        pulseState,
        cursorField,
        onPulse,
        fieldStrength,
        activeZone,
        setZoneBySection,
      }}
    >
      {children}
    </GravityContext.Provider>
  )
}
