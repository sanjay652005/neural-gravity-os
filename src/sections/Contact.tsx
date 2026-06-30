import { useState, useRef } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Mail, Github, Linkedin, Send, Terminal, FileDown } from 'lucide-react'
import { PERSONAL } from '@/constants'
import { gravityReveal, gravityRevealLeft, gravityRevealRight, EASE } from '@/animations/variants'

const CONTACT_LINKS = [
  { icon: Mail,     label: 'Email',    value: PERSONAL.email,                     href: `mailto:${PERSONAL.email}`, color: '#FFD54F' },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/sanjayp-dev',       href: PERSONAL.linkedin,          color: '#64B5F6' },
  { icon: Github,   label: 'GitHub',   value: 'github.com/sanjay652005',           href: PERSONAL.github,            color: '#FFFFFF' },
  { icon: FileDown, label: 'Resume',   value: 'Download PDF',                      href: '/resume.pdf',              color: '#81C784' },
]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const reduced = useReducedMotion() ?? false
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    await new Promise(r => setTimeout(r, 800))
    window.location.href = `mailto:${PERSONAL.email}?subject=${subject}&body=${body}`
    setSending(false)
    setSent(true)
  }

  return (
    <section id="contact" aria-label="Contact Sanjay P" className="section relative" ref={ref}>
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,213,79,0.03) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          variants={gravityReveal}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0}
        >
          <span className="text-xs font-mono text-[#FFD54F]/50 tracking-[0.3em] uppercase">TRANSMISSION</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Open communication channel.
          </h2>
          <p className="mt-4 text-white/35 text-base max-w-md mx-auto">
            Open to full-time roles, collaborations, and interesting conversations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: terminal */}
          <motion.div
            variants={gravityRevealLeft}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0.1}
          >
            {/* Terminal window */}
            <div
              className="glass rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Title bar */}
              <div
                className="flex items-center gap-2 px-5 py-4"
                style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                <div className="ml-3 flex items-center gap-2">
                  <Terminal size={12} className="text-white/30" />
                  <span className="text-xs font-mono text-white/30">sanjay@neural-gravity ~ contact</span>
                </div>
              </div>

              {/* Terminal body */}
              <div className="p-6 font-mono text-sm space-y-5">
                <div>
                  <span className="text-[#FFD54F]/50">→ </span>
                  <span className="text-white/30">whoami</span>
                </div>
                <div className="text-white/60 pl-4 leading-relaxed">
                  Sanjay P — Java Backend & Full Stack Developer<br />
                  Based in Kanchipuram, Tamil Nadu<br />
                  Open to relocation: Bengaluru, Chennai, Remote
                </div>

                {/* Contact links — staggered reveal */}
                <div className="pt-2 flex flex-col gap-4">
                  {CONTACT_LINKS.map((link, i) => (
                    <motion.div
                      key={link.label}
                      className="flex items-center gap-4 group"
                      initial={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: reduced ? 0 : 0.25 + i * 0.09, duration: 0.5, ease: EASE }}
                    >
                      <span className="text-white/20">$</span>
                      <link.icon size={14} style={{ color: link.color }} className="opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                      <div className="flex-1 min-w-0">
                        {link.href ? (
                          <a
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="text-white/50 hover:text-white transition-colors duration-200 truncate block"
                          >
                            {link.value}
                          </a>
                        ) : (
                          <span className="text-white/50">{link.value}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Blinking cursor */}
                <div className="flex items-center gap-1">
                  <span className="text-[#FFD54F]/50">→ </span>
                  <motion.span
                    className="w-2 h-4 bg-[#FFD54F]/60"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Status indicator */}
            <motion.div
              className="mt-6 glass rounded-2xl p-5 flex items-center gap-4"
              style={{ border: '1px solid rgba(255,213,79,0.1)' }}
              variants={gravityReveal}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.4}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <div className="text-sm font-medium text-white/70">Available for Full-Time Opportunities</div>
                <div className="text-xs text-white/30 mt-0.5">Actively interviewing · Graduated 2026</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: contact form */}
          <motion.div
            className="glass rounded-2xl p-8"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            variants={gravityRevealRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0.2}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{ background: 'rgba(255,213,79,0.1)', border: '1px solid rgba(255,213,79,0.3)' }}
                  >
                    <Send size={24} className="text-[#FFD54F]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-white/40 text-sm">I'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  role="form"
                  aria-label="Contact form"
                >
                  <h3 className="text-lg font-semibold">Send a Message</h3>

                  <div>
                    <label htmlFor="contact-name" className="text-xs font-mono text-white/30 tracking-widest uppercase block mb-2">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      autoComplete="name"
                      className="w-full bg-white/04 border border-white/08 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FFD54F]/30 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="text-xs font-mono text-white/30 tracking-widest uppercase block mb-2">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      autoComplete="email"
                      className="w-full bg-white/04 border border-white/08 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FFD54F]/30 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="text-xs font-mono text-white/30 tracking-widest uppercase block mb-2">Message</label>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell me about the opportunity, project, or just say hello..."
                      rows={4}
                      className="w-full bg-white/04 border border-white/08 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FFD54F]/30 transition-colors duration-200 resize-none"
                    />
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={sending || !form.name || !form.email || !form.message}
                    aria-label="Send message"
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-sm transition-all disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #FFD54F 0%, #FFB300 100%)',
                      color: '#090909',
                      opacity: (sending || !form.name || !form.email || !form.message) ? 0.5 : 1,
                    }}
                    whileHover={{ boxShadow: '0 4px 20px rgba(255,213,79,0.2)' }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    {sending ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-white/20 text-center">
                    Or reach me directly at{' '}
                    <a href={`mailto:${PERSONAL.email}`} className="text-[#FFD54F]/50 hover:text-[#FFD54F] transition-colors duration-200">
                      {PERSONAL.email}
                    </a>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}