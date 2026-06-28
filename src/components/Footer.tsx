import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'
import { PERSONAL } from '@/constants'

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      aria-label="Footer"
      className="relative py-16 px-6"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: branding */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #FFE082, #FFD54F)',
                  boxShadow: '0 0 8px rgba(255,213,79,0.4)',
                }}
              />
              <span className="text-sm font-semibold text-white/70">{PERSONAL.name}</span>
            </div>
            <p className="text-xs text-white/25 font-mono">{PERSONAL.role}</p>
          </div>

          {/* Center: Neural Gravity OS identity */}
          <div className="text-center">
            <p className="text-xs text-white/50 font-mono tracking-[0.2em] uppercase">
              END OF TRANSMISSION
            </p>
            <p className="text-xs text-white/30 font-mono mt-1 tracking-widest">
              Neural Gravity OS
            </p>
            <p className="text-xs font-mono mt-1" style={{ color: 'rgba(255,213,79,0.35)', letterSpacing: '0.15em' }}>
              Gravity Never Sleeps.
            </p>
          </div>

          {/* Right: social + scroll up */}
          <div className="flex items-center gap-4">
            {[
              { icon: Github, href: PERSONAL.github, label: 'GitHub' },
              { icon: Linkedin, href: PERSONAL.linkedin, label: 'LinkedIn' },
              { icon: Mail, href: `mailto:${PERSONAL.email}`, label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/30 hover:text-white/70 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                whileHover={{ y: -1 }}
                whileTap={{ opacity: 0.8 }}
              >
                <Icon size={13} />
              </motion.a>
            ))}

            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#FFD54F]/40 hover:text-[#FFD54F] transition-colors ml-2"
              style={{ border: '1px solid rgba(255,213,79,0.15)' }}
              whileHover={{ y: -1 }}
              whileTap={{ opacity: 0.8 }}
              aria-label="Scroll to top"
            >
              <ArrowUp size={13} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
