import { useState, useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
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
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        aria-label="Primary navigation"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
      >
        <div
          className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500"
          style={{
            background: scrolled ? 'rgba(9, 9, 9, 0.9)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          }}
        >
          {/* Logo */}
          <motion.button
            className="flex items-center gap-3 group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.02 }}
            aria-label="Scroll to top"
          >
            <div className="relative w-7 h-7">
              <div
                className="w-7 h-7 rounded-full"
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
            <span className="text-sm font-semibold text-white tracking-wide">
              {PERSONAL.name}
            </span>
          </motion.button>

          {/* Desktop nav */}
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

          {/* CTA + Command Center trigger */}
          <div className="hidden md:flex items-center gap-3">
            {/* Command Center trigger (rendered by App) */}
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

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
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
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        className="fixed inset-0 z-40 md:hidden"
        initial={false}
        animate={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none' }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        <div className="absolute inset-0 bg-[#090909]/95 backdrop-blur-2xl" onClick={() => setMobileOpen(false)} />
        <motion.div
          className="absolute top-20 left-6 right-6 glass rounded-2xl p-6 border border-white/08"
          initial={{ y: -16, opacity: 0, scale: 0.98 }}
          animate={{ y: mobileOpen ? 0 : -16, opacity: mobileOpen ? 1 : 0, scale: mobileOpen ? 1 : 0.98 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <div className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-left text-lg font-medium text-white/70 hover:text-white transition-colors py-2 border-b border-white/05 last:border-0"
              >
                {item.label}
              </button>
            ))}
            <a
              href="mailto:sanjay.pdev@gmail.com"
              className="mt-2 text-center text-sm font-mono text-[#FFD54F] border border-[#FFD54F]/30 px-4 py-3 rounded-full hover:bg-[#FFD54F]/10 transition-all"
            >
              Hire Me
            </a>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
