import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useAnimationControls, animate } from 'framer-motion'

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD        = '#FFD54F'
const GOLD_DIM    = 'rgba(255,213,79,0.15)'
const GOLD_GLOW   = 'rgba(255,213,79,0.35)'
const GOLD_FAINT  = 'rgba(255,213,79,0.06)'

const STATUS_ITEMS = [
  { label: 'Gravity Engine',    value: 'ONLINE',  color: '#4ADE80' },
  { label: 'Neural Core',       value: 'ACTIVE',  color: GOLD       },
  { label: 'Intelligence Layer',value: 'READY',   color: '#60A5FA' },
  { label: 'System Stability',  value: '99.8%',   color: '#4ADE80' },
]

const TERMINAL_LINES = [
  { type: 'cmd',  text: 'boot gravity-engine' },
  { type: 'out',  text: 'Initializing Gravity Engine...' },
  { type: 'out',  text: 'Gravity Engine Online' },
  { type: 'out',  text: 'Loading Neural Modules...' },
  { type: 'out',  text: 'Synchronizing Orbit System...' },
  { type: 'out',  text: 'AI Core Activated' },
  { type: 'out',  text: 'System Integrity 99.8%' },
  { type: 'out',  text: 'Neural Gravity OS Ready' },
]

// Timing per line (ms): how long to type + pause before next line
const LINE_DELAYS = [60, 30, 30, 30, 30, 30, 30, 30]
const LINE_PAUSES = [200, 120, 180, 120, 140, 160, 140, 800]

// ─── Neural Gravity Core (SVG) ────────────────────────────────────────────────

function NeuralGravityCore() {
  const pulseControls = useAnimationControls()

  // Pulse every ~5s
  useEffect(() => {
    let cancelled = false
    const loop = async () => {
      while (!cancelled) {
        await new Promise(r => setTimeout(r, 4800))
        if (cancelled) break
        await pulseControls.start({
          scale: [1, 1.55, 1],
          opacity: [0.18, 0, 0.18],
          transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] },
        })
      }
    }
    loop()
    return () => { cancelled = true }
  }, [pulseControls])

  // Orbit node positions (angles in degrees)
  const nodes = [0, 72, 144, 216, 288]

  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>

      {/* Outermost ambient glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200, height: 200,
          background: `radial-gradient(circle, ${GOLD_GLOW} 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* SVG — rings, particles, nodes */}
      <svg
        width="200" height="200"
        viewBox="-100 -100 200 200"
        style={{ position: 'absolute', overflow: 'visible' }}
      >
        {/* ── Orbit ring 1 ── */}
        <motion.ellipse
          cx="0" cy="0" rx="64" ry="22"
          fill="none"
          stroke={GOLD}
          strokeWidth="0.6"
          strokeOpacity="0.18"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '0px', originY: '0px', transformBox: 'fill-box' }}
        />
        {/* ── Orbit ring 2 (tilted) ── */}
        <motion.ellipse
          cx="0" cy="0" rx="52" ry="32"
          fill="none"
          stroke={GOLD}
          strokeWidth="0.5"
          strokeOpacity="0.12"
          animate={{ rotate: -360 }}
          transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
          style={{
            originX: '0px', originY: '0px', transformBox: 'fill-box',
            transform: 'rotate(55deg)',
          }}
        />
        {/* ── Orbit ring 3 ── */}
        <motion.ellipse
          cx="0" cy="0" rx="76" ry="18"
          fill="none"
          stroke={GOLD}
          strokeWidth="0.4"
          strokeOpacity="0.08"
          animate={{ rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          style={{
            originX: '0px', originY: '0px', transformBox: 'fill-box',
            transform: 'rotate(-30deg)',
          }}
        />

        {/* ── Orbiting particles on ring 1 ── */}
        {[0, 120, 240].map((offset, i) => (
          <motion.circle
            key={`p1-${i}`}
            r="2.2"
            fill={GOLD}
            fillOpacity="0.7"
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear', delay: -(offset / 360) * 22 }}
            style={{ originX: '0px', originY: '0px', transformBox: 'fill-box' }}
          >
            <animateMotion
              dur="22s"
              repeatCount="indefinite"
              begin={`${-(offset / 360) * 22}s`}
              path="M 64 0 A 64 22 0 1 1 63.99 0"
            />
          </motion.circle>
        ))}

        {/* ── Orbiting particle on ring 2 ── */}
        <circle r="1.8" fill={GOLD} fillOpacity="0.5">
          <animateMotion
            dur="34s"
            repeatCount="indefinite"
            path="M 0 -32 A 52 32 55 1 1 -0.01 -32"
          />
        </circle>
        <circle r="1.4" fill={GOLD} fillOpacity="0.35">
          <animateMotion
            dur="34s"
            repeatCount="indefinite"
            begin="-17s"
            path="M 0 -32 A 52 32 55 1 1 -0.01 -32"
          />
        </circle>

        {/* ── Glowing nodes around core ── */}
        {nodes.map((deg, i) => {
          const rad = (deg * Math.PI) / 180
          const r   = 44
          const nx  = Math.cos(rad) * r
          const ny  = Math.sin(rad) * r
          return (
            <motion.circle
              key={`node-${i}`}
              cx={nx} cy={ny} r="3"
              fill={GOLD}
              animate={{ opacity: [0.25, 0.8, 0.25], r: [2.5, 3.2, 2.5] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.55,
              }}
            />
          )
        })}

        {/* ── Node connector lines ── */}
        {nodes.map((deg, i) => {
          const rad = (deg * Math.PI) / 180
          const r   = 44
          const nx  = Math.cos(rad) * r
          const ny  = Math.sin(rad) * r
          return (
            <motion.line
              key={`line-${i}`}
              x1="0" y1="0" x2={nx} y2={ny}
              stroke={GOLD}
              strokeWidth="0.5"
              animate={{ strokeOpacity: [0.04, 0.14, 0.04] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.55,
              }}
            />
          )
        })}

        {/* ── Core outer glow ring ── */}
        <motion.circle
          cx="0" cy="0" r="24"
          fill="none"
          stroke={GOLD}
          strokeWidth="1.2"
          animate={{ strokeOpacity: [0.12, 0.28, 0.12], r: [23, 25, 23] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Core fill ── */}
        <defs>
          <radialGradient id="coreGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#FFE082" />
            <stop offset="55%"  stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FF8F00" />
          </radialGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={GOLD_GLOW}  stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0"   />
          </radialGradient>
        </defs>

        {/* Soft glow behind core */}
        <circle cx="0" cy="0" r="36" fill="url(#coreGlow)" />

        {/* Core sphere */}
        <motion.circle
          cx="0" cy="0" r="19"
          fill="url(#coreGrad)"
          animate={{ r: [18.5, 20, 18.5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,213,79,0.5))' }}
        />

        {/* NG text */}
        <text
          x="0" y="0"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#090909"
          fontFamily="'Inter', sans-serif"
          fontWeight="700"
          fontSize="8.5"
          letterSpacing="0.5"
        >
          NG
        </text>
      </svg>

      {/* Pulse ring — fires on interval via framer controls */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 90, height: 90,
          border: `1.5px solid ${GOLD}`,
          opacity: 0.18,
        }}
        animate={pulseControls}
      />
    </div>
  )
}

// ─── Terminal ─────────────────────────────────────────────────────────────────

function Terminal() {
  const [lines, setLines]           = useState<{ type: string; text: string }[]>([])
  const [currentText, setCurrentText] = useState('')
  const [lineIdx, setLineIdx]       = useState(0)
  const [charIdx, setCharIdx]       = useState(0)
  const [cursorOn, setCursorOn]     = useState(true)
  const [pausing, setPausing]       = useState(false)
  const scrollRef                   = useRef<HTMLDivElement>(null)

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorOn(v => !v), 530)
    return () => clearInterval(id)
  }, [])

  // Typing engine
  useEffect(() => {
    if (pausing) return

    const line = TERMINAL_LINES[lineIdx]
    if (!line) return

    if (charIdx < line.text.length) {
      const delay = LINE_DELAYS[lineIdx] + Math.random() * 20
      const id = setTimeout(() => setCharIdx(c => c + 1), delay)
      return () => clearTimeout(id)
    }

    // Line complete — pause then advance
    const id = setTimeout(() => {
      setLines(prev => [...prev, { type: line.type, text: line.text }])
      setCurrentText('')
      const nextIdx = (lineIdx + 1) % TERMINAL_LINES.length
      setLineIdx(nextIdx)
      setCharIdx(0)
      // If wrapping around, clear all lines
      if (nextIdx === 0) {
        setTimeout(() => setLines([]), 600)
      }
    }, LINE_PAUSES[lineIdx])
    return () => clearTimeout(id)
  }, [charIdx, lineIdx, pausing])

  // Keep currentText in sync
  useEffect(() => {
    setCurrentText(TERMINAL_LINES[lineIdx]?.text.slice(0, charIdx) ?? '')
  }, [charIdx, lineIdx])

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines, currentText])

  return (
    <div
      ref={scrollRef}
      className="font-mono text-xs leading-relaxed overflow-y-auto"
      style={{
        maxHeight: 150,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {/* Completed lines */}
      {lines.map((l, i) => (
        <div key={i} className="flex gap-2">
          {l.type === 'cmd'
            ? <><span style={{ color: GOLD, opacity: 0.7 }}>{'>'}</span><span style={{ color: 'rgba(255,255,255,0.75)' }}>{l.text}</span></>
            : <span style={{ color: 'rgba(255,255,255,0.35)' }}>{l.text}</span>
          }
        </div>
      ))}

      {/* Currently typing line */}
      {currentText !== undefined && (
        <div className="flex gap-2">
          {TERMINAL_LINES[lineIdx]?.type === 'cmd'
            ? <><span style={{ color: GOLD, opacity: 0.7 }}>{'>'}</span><span style={{ color: 'rgba(255,255,255,0.75)' }}>{currentText}</span></>
            : <span style={{ color: 'rgba(255,255,255,0.35)' }}>{currentText}</span>
          }
          <span
            style={{
              display: 'inline-block',
              width: '1px',
              height: '12px',
              background: GOLD,
              opacity: cursorOn ? 0.8 : 0,
              marginTop: '1px',
              transition: 'opacity 0.1s',
            }}
          />
        </div>
      )}
    </div>
  )
}

// ─── Status Row ───────────────────────────────────────────────────────────────

function StatusRow({ label, value, color, index }: { label: string; value: string; color: string; index: number }) {
  return (
    <motion.div
      className="flex items-center justify-between py-2"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.08, duration: 0.45 }}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-center gap-2.5">
        {/* Pulsing dot */}
        <motion.div
          className="rounded-full flex-shrink-0"
          style={{ width: 6, height: 6, background: color, boxShadow: `0 0 6px ${color}` }}
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2.5 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>
          {label}
        </span>
      </div>
      <span
        className="text-xs font-mono font-semibold tracking-wider"
        style={{ color }}
      >
        {value}
      </span>
    </motion.div>
  )
}

// ─── Section Divider (internal) ───────────────────────────────────────────────

function PanelDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className="text-[10px] font-mono tracking-[0.25em] uppercase"
        style={{ color: 'rgba(255,213,79,0.4)' }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,213,79,0.08)' }} />
    </div>
  )
}

// ─── MissionControl (main export) ────────────────────────────────────────────

export default function MissionControl({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -32, scale: 0.99 }}
      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, rgba(22,18,10,0.98) 0%, rgba(12,12,12,0.98) 60%, rgba(9,9,9,0.98) 100%)',
        border: '1px solid rgba(255,213,79,0.14)',
        boxShadow: '0 0 0 1px rgba(255,213,79,0.04) inset, 0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(255,213,79,0.04)',
      }}
    >
      {/* Subtle corner glow */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 180, height: 180,
          background: 'radial-gradient(circle at top right, rgba(255,213,79,0.06) 0%, transparent 70%)',
        }}
      />

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{
          borderBottom: '1px solid rgba(255,213,79,0.08)',
          background: 'rgba(255,213,79,0.02)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex gap-1.5">
            {['rgba(255,95,87,0.5)', 'rgba(255,189,46,0.5)', 'rgba(39,201,63,0.4)'].map((c, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="w-px h-4" style={{ background: 'rgba(255,213,79,0.1)' }} />
          <span
            className="text-xs font-mono tracking-[0.28em] uppercase"
            style={{ color: 'rgba(255,213,79,0.55)' }}
          >
            Mission Control
          </span>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#4ADE80' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>
            LIVE
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-6 py-6 flex flex-col gap-6">

        {/* Neural Core */}
        <div className="flex flex-col items-center">
          <NeuralGravityCore />
          <div className="mt-3 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full" style={{ background: GOLD, boxShadow: `0 0 4px ${GOLD}` }} />
            <span
              className="text-[10px] font-mono tracking-[0.2em] uppercase"
              style={{ color: 'rgba(255,213,79,0.4)' }}
            >
              Neural Gravity Core v2.4.1
            </span>
            <div className="w-1 h-1 rounded-full" style={{ background: GOLD, boxShadow: `0 0 4px ${GOLD}` }} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,213,79,0.1), transparent)' }} />

        {/* System Status */}
        <div>
          <PanelDivider label="System Status" />
          <div className="flex flex-col">
            {STATUS_ITEMS.map((item, i) => (
              <StatusRow key={item.label} {...item} index={i} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,213,79,0.08), transparent)' }} />

        {/* Terminal */}
        <div>
          <PanelDivider label="Terminal" />
          <div
            className="rounded-xl px-4 py-3"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,213,79,0.07)',
            }}
          >
            <Terminal />
          </div>
        </div>

      </div>

      {/* Bottom chrome bar */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          borderTop: '1px solid rgba(255,213,79,0.06)',
          background: 'rgba(255,213,79,0.015)',
        }}
      >
        <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.15)', letterSpacing: '0.12em' }}>
          NEURAL-GRAVITY-OS / CORE
        </span>
        <span className="text-[10px] font-mono" style={{ color: 'rgba(255,213,79,0.3)', letterSpacing: '0.08em' }}>
          ████░ 99.8%
        </span>
      </div>
    </motion.div>
  )
}
