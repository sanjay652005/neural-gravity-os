/**
 * ParticleBackground — Phase 9: Zone-Aware
 *
 * The particle field now responds to the active Gravity Zone.
 * particleSpeed, cursorRadius, cursorStrength, and ambientGlow all interpolate
 * as the user moves between sections — never abruptly.
 *
 * The zone values are read from GravityContext on every tick via a ref,
 * so we never need to restart the canvas loop when zones change.
 */

import { useEffect, useRef } from 'react'
import { useGravity } from '@/contexts/GravityContext'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseVx: number
  baseVy: number
  size: number
  color: string
  twinklePhase: number
  twinkleSpeed: number
  opacityMin: number
  opacityMax: number
  isBright: boolean
}

// Weighted color pool — mostly gold, some white, rare violet/blue
const COLORS = [
  'rgba(255,213,79,',
  'rgba(255,213,79,',
  'rgba(255,213,79,',
  'rgba(255,213,79,',
  'rgba(255,213,79,',
  'rgba(255,255,255,',
  'rgba(255,255,255,',
  'rgba(255,255,255,',
  'rgba(180,160,255,',
  'rgba(100,181,246,',
]

function makeParticle(w: number, h: number): Particle {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  const isBright = Math.random() < 0.05
  const opacityMin = isBright ? 0.15 : (Math.random() * 0.04 + 0.02)
  const opacityMax = isBright ? 0.75 : (Math.random() * 0.3 + 0.08)
  const speed = Math.random() * 0.15 + 0.03
  const angle = Math.random() * Math.PI * 2
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.05,
    baseVx: Math.cos(angle) * speed,
    baseVy: Math.sin(angle) * speed - 0.05,
    size: isBright ? (Math.random() * 1.2 + 1.0) : (Math.random() * 1.0 + 0.3),
    color,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: isBright
      ? (Math.random() * 0.04 + 0.025)
      : (Math.random() * 0.018 + 0.006),
    opacityMin,
    opacityMax,
    isBright,
  }
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { gravityEnabled, activeZone } = useGravity()

  // Keep a ref to activeZone so the canvas loop reads live values
  // without needing to restart when the zone changes
  const zoneRef = useRef(activeZone)
  zoneRef.current = activeZone

  const gravityEnabledRef = useRef(gravityEnabled)
  gravityEnabledRef.current = gravityEnabled

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let animId: number
    let particles: Particle[] = []
    let w = 0, h = 0
    const mouse = { x: -9999, y: -9999 }

    let lastMouseTime = 0
    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastMouseTime < 20) return
      lastMouseTime = now
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width  = w
      canvas.height = h
      const count = Math.min(Math.floor((w * h) / 8000), 180)
      particles = Array.from({ length: count }, () => makeParticle(w, h))
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reducedMotion) window.addEventListener('mousemove', onMouseMove, { passive: true })

    const CONNECTION_DIST    = 110
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST

    const tick = () => {
      // Read zone values live each frame — they're already interpolated by GravityContext
      const zone = zoneRef.current
      const isAntiGravity = gravityEnabledRef.current

      // Derived values from zone
      const mouseRadius    = zone.cursorRadius
      const mouseRadiusSq  = mouseRadius * mouseRadius
      const mouseStrength  = isAntiGravity
        ? zone.cursorStrength * 2.2
        : zone.cursorStrength

      // ambientGlow scales connection line alpha
      const lineAlphaScale = zone.ambientGlow

      ctx.clearRect(0, 0, w, h)

      // ── Constellation lines ──────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distSq = dx * dx + dy * dy
          if (distSq < CONNECTION_DIST_SQ) {
            const alpha = (1 - Math.sqrt(distSq) / CONNECTION_DIST) * 0.045 * lineAlphaScale
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255,213,79,${alpha.toFixed(3)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // ── Particles ────────────────────────────────────────────────────────
      for (const p of particles) {
        p.twinklePhase += p.twinkleSpeed
        const twinkle  = (Math.sin(p.twinklePhase) + 1) / 2
        const opacity  = p.opacityMin + (p.opacityMax - p.opacityMin) * twinkle

        // ── Zone-aware cursor gravity ────────────────────────────────────
        if (!reducedMotion) {
          const mdx = mouse.x - p.x
          const mdy = mouse.y - p.y
          const mDistSq = mdx * mdx + mdy * mdy
          if (mDistSq < mouseRadiusSq && mDistSq > 1) {
            const mDist   = Math.sqrt(mDistSq)
            const falloff = 1 - mDist / mouseRadius
            const force   = falloff * falloff * mouseStrength
            p.vx += (mdx / mDist) * force
            p.vy += (mdy / mDist) * force
          }
        }

        // Lazy return to base velocity — scaled by particleSpeed zone param
        // particleSpeed < 1 = slower drift, > 1 = more energetic
        const returnRate = 0.03 * (1 / zone.particleSpeed)
        p.vx += (p.baseVx * zone.particleSpeed - p.vx) * returnRate
        p.vy += (p.baseVy * zone.particleSpeed - p.vy) * returnRate

        // Glow
        const glowR = p.isBright ? p.size * 6 : p.size * 4
        const grd   = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
        grd.addColorStop(0,   `${p.color}${(opacity * 0.7).toFixed(3)})`)
        grd.addColorStop(0.4, `${p.color}${(opacity * 0.2).toFixed(3)})`)
        grd.addColorStop(1,   `${p.color}0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(p.size * 0.55, 0.4), 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${Math.min(opacity * 1.8, 0.9).toFixed(3)})`
        ctx.fill()

        // Move
        p.x += p.vx
        p.y += p.vy

        // Wrap
        if (p.x < -20)    p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20)    p.y = h + 20
        if (p.y > h + 20) p.y = -20
      }

      animId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  // Only restart if gravityEnabled changes — zone changes flow through the ref
  }, [gravityEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
