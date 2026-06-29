import { Suspense, lazy } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Download, Sparkles } from 'lucide-react'
import { PERSONAL } from '@/constants'
import MagneticElement from '@/components/MagneticElement'
import { useOS } from '@/contexts/OSContext'
import { useGravity } from '@/contexts/GravityContext'
import { EASE } from '@/animations/variants'

const GravityScene = lazy(() => import('@/components/three/GravityScene'))

// ─── Unified fade-up — matches system-wide easing ─────────────────────────────
function fadeUp(delay = 0, reducedMotion = false) {
  return {
    hidden: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 24, scale: 0.97 },
    visible: reducedMotion
      ? { opacity: 1, transition: { delay, duration: 0.5, ease: EASE } }
      : { opacity: 1, y: 0, scale: 1, transition: { delay, duration: 0.65, ease: EASE } },
  }
}

const TECH_STACK = ['Java', 'Spring Boot', 'React', 'Node.js', 'MongoDB', 'Three.js', 'Framer Motion']

export default function Hero() {
  const { pushNotification } = useOS()
  const { gravityEnabled, toggleGravity } = useGravity()
  const reduced = useReducedMotion() ?? false

  return (
    <section
      id="hero"
      aria-label="Hero — Introduction"
      // Mobile: reduced height + padding so content never fights the 3D orb
      className="relative min-h-[100svh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Three.js canvas background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="w-full h-full" style={{ background: 'radial-gradient(ellipse at center, rgba(255,213,79,0.03) 0%, transparent 70%)' }} />
        }>
          <GravityScene />
        </Suspense>
      </div>

      {/* Radial gradient overlay — stronger bottom fade on mobile to separate content from orb */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 0%, rgba(9,9,9,0.5) 60%, rgba(9,9,9,0.95) 100%)',
        }}
      />

      {/* Mobile bottom overlay — extra guard so orb doesn't bleed into text on small screens */}
      <div
        className="absolute inset-x-0 bottom-0 z-[1] pointer-events-none md:hidden"
        style={{
          height: '55%',
          background: 'linear-gradient(to top, rgba(9,9,9,1) 0%, rgba(9,9,9,0.85) 40%, transparent 100%)',
        }}
      />

      {/* Content — mobile: tighter padding, slightly lower on screen to clear the 3D orb */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-5 md:px-6 w-full mt-16 md:mt-0">

        {/* Status badge */}
        <motion.div
          variants={fadeUp(0.1, reduced)}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 mb-6 md:mb-8"
        >
          <div className="flex items-center gap-2 glass px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/08">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-[10px] md:text-xs font-mono text-white/50 tracking-widest uppercase">
              GRAVITY ENGINE ONLINE
            </span>
          </div>
        </motion.div>

        {/* Primary heading — scales down gracefully on mobile */}
        <motion.div
          variants={fadeUp(0.18, reduced)}
          initial="hidden"
          animate="visible"
          className="mb-3 md:mb-4 leading-none"
        >
          <h1
            className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight leading-none"
            style={{ letterSpacing: '-0.03em' }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #FFD54F 0%, #FFB300 50%, #FF8F00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FULL STACK
            </span>
            {/* Break "ENGINEER" to a new line on mobile for better rhythm */}
            <br className="md:hidden" />
            <span
              className="md:inline"
              style={{
                background: 'linear-gradient(135deg, #FFD54F 0%, #FFB300 50%, #FF8F00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {' '}ENGINEER
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          variants={fadeUp(0.28, reduced)}
          initial="hidden"
          animate="visible"
          className="mb-3 flex items-center justify-center gap-3"
        >
          <span
            className="hidden sm:block h-px w-10 flex-shrink-0"
            style={{ background: 'linear-gradient(to right, transparent, rgba(255,213,79,0.35))' }}
          />
          <span
            className="text-[11px] sm:text-sm md:text-base font-mono tracking-[0.18em] md:tracking-[0.22em] uppercase"
            style={{ color: 'rgba(255,213,79,0.65)' }}
          >
            Java Full Stack · MERN Developer
          </span>
          <span
            className="hidden sm:block h-px w-10 flex-shrink-0"
            style={{ background: 'linear-gradient(to left, transparent, rgba(255,213,79,0.35))' }}
          />
        </motion.div>

        {/* Name byline */}
        <motion.div
          variants={fadeUp(0.36, reduced)}
          initial="hidden"
          animate="visible"
          className="mb-5 md:mb-6"
        >
          <span className="text-[10px] md:text-sm font-mono text-white/30 tracking-[0.25em] uppercase">
            {PERSONAL.name}
          </span>
        </motion.div>

        {/* Description — tighter on mobile */}
        <motion.p
          variants={fadeUp(0.46, reduced)}
          initial="hidden"
          animate="visible"
          className="text-sm md:text-lg text-white/40 max-w-xs md:max-w-md mx-auto mb-8 md:mb-12 leading-relaxed font-light"
        >
          Building scalable systems powered by intelligent architecture.
        </motion.p>

        {/* CTA Buttons — stacked on mobile, side-by-side on sm+ */}
        <motion.div
          variants={fadeUp(0.56, reduced)}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
        >
          {/* On mobile, skip MagneticElement wrapper (touch has no hover) */}
          <div className="hidden md:block">
            <MagneticElement strength={0.4}>
              <motion.button
                onClick={toggleGravity}
                className="group relative flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm overflow-hidden"
                style={{
                  background: gravityEnabled
                    ? 'linear-gradient(135deg, rgba(255,213,79,0.12) 0%, rgba(255,179,0,0.08) 100%)'
                    : 'linear-gradient(135deg, #FFD54F 0%, #FFB300 100%)',
                  color: gravityEnabled ? '#FFD54F' : '#090909',
                  border: gravityEnabled ? '1px solid rgba(255,213,79,0.3)' : 'none',
                  transition: 'background 0.5s ease, color 0.5s ease, border-color 0.5s ease',
                }}
                whileHover={{ boxShadow: gravityEnabled ? '0 8px 28px rgba(255,213,79,0.12)' : '0 8px 28px rgba(255,213,79,0.25)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <motion.span
                  animate={{ rotate: gravityEnabled ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <Sparkles size={16} />
                </motion.span>
                <motion.span
                  key={gravityEnabled ? 'disable' : 'enable'}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  {gravityEnabled ? 'Disable Gravity' : 'Enter Gravity Field'}
                </motion.span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </MagneticElement>
          </div>

          {/* Mobile gravity button — full width, touch-optimised */}
          <motion.button
            onClick={toggleGravity}
            className="md:hidden group relative flex items-center justify-center gap-2.5 w-full max-w-xs px-6 py-3.5 rounded-full font-semibold text-sm overflow-hidden"
            style={{
              background: gravityEnabled
                ? 'linear-gradient(135deg, rgba(255,213,79,0.12) 0%, rgba(255,179,0,0.08) 100%)'
                : 'linear-gradient(135deg, #FFD54F 0%, #FFB300 100%)',
              color: gravityEnabled ? '#FFD54F' : '#090909',
              border: gravityEnabled ? '1px solid rgba(255,213,79,0.3)' : 'none',
              transition: 'background 0.5s ease, color 0.5s ease',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <motion.span
              animate={{ rotate: gravityEnabled ? 180 : 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Sparkles size={15} />
            </motion.span>
            <span>
              {gravityEnabled ? 'Disable Gravity' : 'Enter Gravity Field'}
            </span>
          </motion.button>

          {/* Download resume — desktop uses MagneticElement */}
          <div className="hidden md:block">
            <MagneticElement strength={0.4}>
              <motion.a
                href="/resume.pdf"
                download="Sanjay_P_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Sanjay P's Resume PDF"
                onClick={() => pushNotification('Resume downloaded', 'success', '↓')}
                className="flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm glass border border-white/10 text-white hover:border-[#FFD54F]/30 hover:text-[#FFD54F] transition-all duration-300"
                whileHover={{ boxShadow: '0 6px 22px rgba(255,213,79,0.08)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <Download size={16} />
                Download Mission File
              </motion.a>
            </MagneticElement>
          </div>

          {/* Download resume — mobile, full width */}
          <motion.a
            href="/resume.pdf"
            download="Sanjay_P_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download Sanjay P's Resume PDF"
            onClick={() => pushNotification('Resume downloaded', 'success', '↓')}
            className="md:hidden flex items-center justify-center gap-2.5 w-full max-w-xs px-6 py-3.5 rounded-full font-semibold text-sm glass border border-white/10 text-white"
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <Download size={15} />
            Download Mission File
          </motion.a>
        </motion.div>

        {/* Tech stack chips — horizontally scrollable on mobile, wrapped on desktop */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.055, delayChildren: 0.7 } },
          }}
          className="mt-10 md:mt-16"
        >
          {/* Mobile: horizontal scroll row, no line-wrap, no clipping */}
          <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-1 px-1 no-scrollbar"
            style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
          >
            {TECH_STACK.map((tech) => (
              <motion.span
                key={tech}
                variants={{
                  hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.9 },
                  visible: reduced
                    ? { opacity: 1, transition: { duration: 0.4, ease: EASE } }
                    : { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE } },
                }}
                className="text-[10px] font-mono text-white/25 px-3 py-1 rounded-full border border-white/06 whitespace-nowrap flex-shrink-0"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Desktop: natural wrap (original behaviour) */}
          <div className="hidden md:flex items-center justify-center gap-2 flex-wrap">
            {TECH_STACK.map((tech) => (
              <motion.span
                key={tech}
                variants={{
                  hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.9 },
                  visible: reduced
                    ? { opacity: 1, transition: { duration: 0.4, ease: EASE } }
                    : { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE } },
                }}
                className="text-xs font-mono text-white/25 px-3 py-1 rounded-full border border-white/06"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6, ease: EASE }}
      >
        <span className="text-[10px] md:text-xs font-mono text-white/20 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={13} className="text-white/20 md:w-3.5 md:h-3.5" />
        </motion.div>
      </motion.div>
    </section>
  )
}