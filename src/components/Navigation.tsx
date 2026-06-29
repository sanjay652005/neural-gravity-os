import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { NAV_ITEMS, PERSONAL } from '@/constants'
import MagneticElement from '@/components/MagneticElement'
import { EASE } from '@/animations/variants'

interface NavigationProps {
  commandCenter?: React.ReactNode
}

export default function Navigation({ commandCenter }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsub = scrollY.on('change', v => setScrolled(v > 60))
    return unsub
  }, [scrollY])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-3 md:px-6 py-3 md:py-4"
        aria-label="Primary navigation"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
        style={{ marginTop: 28 }}
      >
        <div
          className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-4 md:px-6 py-2.5 md:py-3 transition-all duration-500"
          style={{
            background: scrolled ? 'rgba(9, 9, 9, 0.9)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          }}
        >
          {/* Logo */}
          <motion.button
            className="flex items-center gap-2.5 group flex-shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.02 }}
            aria-label="Scroll to top"
          >
            <div className="relative w-6 h-6 md:w-7 md:h-7">
              <div
                className="w-6 h-6 md:w-7 md:h-7 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #FFE082, #FFD54F)',
                  boxShadow: '0 0 10px rgba(255,213,79,0.5)',
                }}
              />
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ boxShadow: '0 0 20px rgba(255,213,79,0.8)' }}
              />
            </div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-xs md:text-sm font-semibold text-white tracking-wide">
                {PERSONAL.name}
              </span>
              {/* Version sub-label — mobile only, gives the OS identity below the name */}
              <span className="text-[8px] font-mono text-white/25 tracking-widest md:hidden">
                NGOS v2.0
              </span>
            </div>
          </motion.button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-sm text-white/50 hover:text-white transition-colors duration-200 tracking-wide font-medium"
                whileHover={{ y: -1, transition: { duration: 0.2, ease: EASE } }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Desktop CTA + Command Center */}
          <div className="hidden md:flex items-center gap-3">
            {commandCenter}

            <MagneticElement strength={0.45}>
              <motion.a
                href="mailto:sanjay.pdev@gmail.com"
                className="text-xs font-mono tracking-wider text-[#FFD54F] border border-[#FFD54F]/30 px-4 py-2 rounded-full hover:bg-[#FFD54F]/10 transition-all duration-200"
                whileHover={{ scale: 1.03, boxShadow: '0 4px 16px rgba(255,213,79,0.12)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              >
                Hire Me
              </motion.a>
            </MagneticElement>
          </div>

          {/* Mobile right side — gravity status pill + hamburger */}
          <div className="flex md:hidden items-center gap-3">

            {/* Gravity Engine Status Pill — identity anchor on mobile */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <motion.div
                className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className="text-[8px] font-mono tracking-wider whitespace-nowrap"
                style={{ color: 'rgba(74,222,128,0.6)' }}
              >
                GE ONLINE
              </span>
            </div>

            {/* Hamburger */}
            <button
              className="flex flex-col gap-1.5 p-1 flex-shrink-0"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                className="w-5 h-px bg-white block"
                animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 5 : 0 }}
              />
              <motion.span
                className="w-5 h-px bg-white block"
                animate={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <motion.span
                className="w-5 h-px bg-white block"
                animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -5 : 0 }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu drawer */}
      <motion.div
        className="fixed inset-0 z-40 md:hidden"
        initial={false}
        animate={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none' }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        <div
          className="absolute inset-0 bg-[#090909]/95 backdrop-blur-2xl"
          onClick={() => setMobileOpen(false)}
        />

        <motion.div
          className="absolute left-4 right-4 glass rounded-2xl p-6 border border-white/08"
          style={{ top: 96 }}
          initial={{ y: -16, opacity: 0, scale: 0.98 }}
          animate={{
            y: mobileOpen ? 0 : -16,
            opacity: mobileOpen ? 1 : 0,
            scale: mobileOpen ? 1 : 0.98,
          }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/06">
            <span className="text-[9px] font-mono text-white/25 tracking-[0.2em] uppercase">
              Navigation
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono text-emerald-400/60 tracking-wider">
                SYSTEM ONLINE
              </span>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="flex items-center justify-between text-left py-3 px-2 rounded-xl hover:bg-white/04 transition-colors group"
                initial={{ opacity: 0, x: -8 }}
                animate={{
                  opacity: mobileOpen ? 1 : 0,
                  x: mobileOpen ? 0 : -8,
                }}
                transition={{
                  delay: mobileOpen ? i * 0.05 + 0.1 : 0,
                  duration: 0.3,
                  ease: EASE,
                }}
              >
                <span className="text-base font-medium text-white/70 group-hover:text-white transition-colors">
                  {item.label}
                </span>
                <span className="text-white/15 group-hover:text-[#FFD54F]/40 transition-colors text-sm">
                  →
                </span>
              </motion.button>
            ))}
          </div>

          {/* Hire Me CTA */}
          <motion.a
            href="mailto:sanjay.pdev@gmail.com"
            className="mt-5 flex items-center justify-center gap-2 text-sm font-mono text-[#FFD54F] border border-[#FFD54F]/30 px-4 py-3.5 rounded-full hover:bg-[#FFD54F]/10 transition-all"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: mobileOpen ? 1 : 0,
              y: mobileOpen ? 0 : 8,
            }}
            transition={{
              delay: mobileOpen ? 0.35 : 0,
              duration: 0.3,
              ease: EASE,
            }}
          >
            <span>Hire Me</span>
            <span className="text-[#FFD54F]/50">↗</span>
          </motion.a>
        </motion.div>
      </motion.div>
    </>
  )
}