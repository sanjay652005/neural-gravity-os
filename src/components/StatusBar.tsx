import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOS } from '@/contexts/OSContext'
import { useGravity } from '@/contexts/GravityContext'
import { useModuleLaunch } from '@/contexts/ModuleLaunchContext'

// ─── Gravity Engine Status ────────────────────────────────────────────────────
// Whispers the engine state — "ONLINE" normally, "DOCKING MODULE" during launch.

function GravityEngineStatus() {
  const { phase } = useModuleLaunch()
  const isDocking = phase === 'DOCKING' || phase === 'ESCAPE' || phase === 'GRAVITY_BUILD'

  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        className="w-1 h-1 rounded-full"
        style={{ background: isDocking ? '#FFD54F' : '#4ADE80' }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: isDocking ? 0.5 : 2, repeat: Infinity }}
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={isDocking ? 'docking' : 'online'}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.2 }}
          className="text-[9px] font-mono text-white/35 tracking-wider"
        >
          GRAVITY ENGINE{' '}
          <span style={{ color: isDocking ? 'rgba(255,213,79,0.7)' : 'rgba(74,222,128,0.7)' }}>
            {isDocking ? 'DOCKING MODULE' : 'ONLINE'}
          </span>
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

// ─── Zone State Indicator ─────────────────────────────────────────────────────
// Whispers the current gravity zone state in the status bar.
// Fades in/out with the zone name — subconscious, never loud.

function ZoneStateIndicator() {
  const { activeZone } = useGravity()

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={activeZone.state}
        initial={{ opacity: 0, x: 4 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -4 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-[9px] font-mono tracking-[0.15em] hidden sm:block"
        style={{ color: 'rgba(255,213,79,0.22)' }}
      >
        · {activeZone.state.toUpperCase()}
      </motion.span>
    </AnimatePresence>
  )
}

// ─── Live Clock ───────────────────────────────────────────────────────────────

function SystemClock() {
  const [time, setTime] = useState(() => new Date())
  const [showDate, setShowDate] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh = time.getHours().toString().padStart(2, '0')
  const mm = time.getMinutes().toString().padStart(2, '0')
  const ss = time.getSeconds().toString().padStart(2, '0')
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div
      className="relative flex items-center gap-1 cursor-default select-none"
      onMouseEnter={() => setShowDate(true)}
      onMouseLeave={() => setShowDate(false)}
    >
      <span className="font-mono text-[10px] text-white/70 tabular-nums">
        {hh}:{mm}
        <span className="text-white/35">:{ss}</span>
      </span>
      <AnimatePresence>
        {showDate && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg text-[10px] font-mono text-white/80 whitespace-nowrap z-50"
            style={{
              background: 'rgba(20,20,20,0.95)',
              border: '1px solid rgba(255,213,79,0.15)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {dateStr}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Sound Toggle ─────────────────────────────────────────────────────────────

function SoundToggle() {
  const { soundEnabled, toggleSound } = useOS()
  return (
    <button
      onClick={toggleSound}
      className="flex items-center justify-center w-6 h-6 rounded opacity-50 hover:opacity-100 transition-opacity duration-200"
      title={soundEnabled ? 'Mute' : 'Unmute'}
    >
      {soundEnabled ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  )
}

// ─── Loading Indicator ────────────────────────────────────────────────────────

function LoadingIndicator({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 40 }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1 overflow-hidden"
        >
          <div className="flex gap-0.5">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-0.5 h-2.5 rounded-full"
                style={{ background: '#FFD54F' }}
                animate={{ scaleY: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
              />
            ))}
          </div>
          <span className="text-[9px] font-mono text-[#FFD54F]/60 tracking-wider">LOADING</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Background Services ──────────────────────────────────────────────────────

const SERVICES = [
  { label: 'Gravity Engine', status: 'Running' },
  { label: 'AI Core', status: 'Online' },
  { label: 'Particle Engine', status: 'Stable' },
  { label: 'Orbit System', status: 'Synced' },
]

function ServicesDot() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [pulse, setPulse] = useState(0)

  // Subtle pulse every ~8s on a random service
  useEffect(() => {
    const id = setInterval(() => setPulse(Math.floor(Math.random() * SERVICES.length)), 8000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 group"
        title="System Services"
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-[10px] font-mono text-white/40 group-hover:text-white/70 transition-colors">
          SYS
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full right-0 mt-3 w-52 rounded-xl overflow-hidden z-50"
            style={{
              background: 'rgba(14,14,14,0.97)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            }}
          >
            <div className="px-3 py-2 border-b border-white/06">
              <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase">Background Services</span>
            </div>
            {SERVICES.map((svc, i) => (
              <div key={svc.label} className="flex items-center justify-between px-3 py-2 hover:bg-white/03 transition-colors">
                <span className="text-[11px] font-mono text-white/60">{svc.label}</span>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-1 h-1 rounded-full bg-emerald-400"
                    animate={pulse === i
                      ? { scale: [1, 1.8, 1], opacity: [1, 0.5, 1] }
                      : { scale: 1, opacity: 0.7 }
                    }
                    transition={{ duration: 0.6 }}
                  />
                  <span className="text-[10px] font-mono text-emerald-400/70">{svc.status}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Status Bar ──────────────────────────────────────────────────────────

export default function StatusBar() {
  const { currentSection, isLoading, fps } = useOS()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 800)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5"
      style={{
        height: 28,
        background: 'rgba(9,9,9,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Left — version + engine */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-mono font-semibold tracking-widest"
            style={{ color: '#FFD54F' }}
          >
            NGOS
          </span>
          <span className="text-[9px] font-mono text-white/25">v2.0</span>
        </div>

        {/* Separator + Gravity Engine — hidden on mobile, shown on desktop */}
        <div className="hidden md:flex items-center gap-4">
          <div className="w-px h-3 bg-white/08" />
          <GravityEngineStatus />
          <LoadingIndicator active={isLoading} />
        </div>

        {/* Mobile-only: compact gravity pulse dot */}
        <div className="flex md:hidden items-center gap-1.5">
          <div className="w-px h-3 bg-white/08" />
          <GravityEngineStatus />
        </div>
      </div>

      {/* Center — current section + gravity zone state (desktop only) */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentSection}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            className="text-[9px] font-mono tracking-[0.2em] text-white/30 uppercase"
          >
            {currentSection}
          </motion.span>
        </AnimatePresence>
        <ZoneStateIndicator />
      </div>

      {/* Right — fps, services, sound, clock (desktop only) */}
      <div className="hidden md:flex items-center gap-4">
        {/* FPS */}
        <span className="text-[9px] font-mono text-white/20 tabular-nums hidden sm:block">
          {fps}<span className="text-white/12">fps</span>
        </span>

        <div className="w-px h-3 bg-white/06 hidden sm:block" />

        <ServicesDot />

        <div className="w-px h-3 bg-white/06" />

        <SoundToggle />

        <div className="w-px h-3 bg-white/06" />

        <SystemClock />
      </div>
    </motion.div>
  )
}