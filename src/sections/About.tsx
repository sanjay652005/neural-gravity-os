import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Code2, Zap, Globe, Award } from 'lucide-react'
import { PERSONAL } from '@/constants'
import MissionControl from '@/components/MissionControl'
import { useGravityField } from '@/hooks/useGravityField'
import { gravityReveal, gravityRevealLeft, gravityRevealRight, staggerContainer, staggerItem, EASE } from '@/animations/variants'

const values = [
  { icon: Code2,  title: 'Clean Architecture',  desc: 'Design maintainable, scalable software with clear separation of concerns.' },
  { icon: Zap,    title: 'Performance First',   desc: 'Build fast, efficient systems — optimized at the architecture level, not just the surface.' },
  { icon: Globe,  title: 'Full Stack Thinking', desc: 'Deliver complete end-to-end solutions, from database schema to UI interaction.' },
  { icon: Award,  title: 'Continuous Learning', desc: 'Always improving through real-world projects, engineering challenges, and modern tooling.' },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const reduced = useReducedMotion() ?? false
  const { ref: eduRef, style: eduGravity } = useGravityField({ maxTranslate: 3, maxRotate: 1.5, pulseLifter: 4 })
  const { ref: valuesRef, style: valuesGravity } = useGravityField({ maxTranslate: 2, maxRotate: 1, lag: 0.03 })

  const inViewAnim = (v: typeof gravityReveal) => ({
    initial: 'hidden',
    animate: isInView ? 'visible' : 'hidden',
  })

  return (
    <section id="about" aria-label="About Sanjay P" className="section relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          variants={gravityReveal}
          {...inViewAnim(gravityReveal)}
          custom={0}
        >
          <span className="text-xs font-mono text-[#FFD54F]/50 tracking-[0.3em] uppercase">ORIGIN</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Every system begins with a purpose.
          </h2>
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Left: Mission Control */}
          <motion.div
            variants={gravityRevealLeft}
            {...inViewAnim(gravityRevealLeft)}
            custom={0.1}
          >
            <MissionControl isInView={isInView} />
          </motion.div>

          {/* Right: bio + values */}
          <motion.div
            className="flex flex-col gap-10"
            variants={gravityRevealRight}
            {...inViewAnim(gravityRevealRight)}
            custom={0.2}
          >
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-white/90">
                I'm Sanjay — Full Stack Engineer.
              </h3>
              <div className="space-y-4 text-white/55 leading-relaxed">
                <p>
                  B.Tech in Information Technology, Anna University, 2026. I build Java backend systems and full-stack web applications — the kind that scale, stay maintainable, and solve real problems.
                </p>
                <p>
                  I've deployed 3 full-stack MERN applications featuring AI integrations (Groq/Llama 3.1), real-time Socket.IO communication, and scalable REST APIs. My internship at Besant Technologies deepened my Java Full Stack skills across Spring Boot, Hibernate/JPA, and MySQL.
                </p>
                <p>
                  <span className="text-[#FFD54F]">Neural Gravity OS</span> — this portfolio — is my flagship engineering project. It exists not as decoration but as a technical statement: demonstrating what I can design, architect, and ship when given a blank canvas.
                </p>
                <p className="text-white/40 text-sm italic">
                  Seeking Software Developer, Full Stack Developer, and SDE opportunities.
                </p>
              </div>
            </div>

            {/* Education card */}
            <motion.div
              ref={eduRef}
              style={{ ...eduGravity, border: '1px solid rgba(255,213,79,0.08)' }}
              className="glass rounded-2xl p-6"
              variants={gravityReveal}
              {...inViewAnim(gravityReveal)}
              custom={0.3}
            >
              <div className="text-xs font-mono text-white/30 tracking-widest uppercase mb-4">Education</div>
              <div className="text-base font-semibold text-white/80 mb-1">B.Tech Information Technology</div>
              <div className="text-sm text-white/50 mb-1">{PERSONAL.college}</div>
              <div className="text-sm text-white/40 mb-3">{PERSONAL.university}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.2)' }}>
                  Graduated · 2026
                </span>
                <span className="text-xs font-mono text-[#FFD54F]">CGPA: {PERSONAL.cgpa}</span>
              </div>
            </motion.div>

            {/* Core values — staggered grid */}
            <motion.div
              ref={valuesRef}
              style={valuesGravity}
              className="grid grid-cols-2 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              {values.map((v) => (
                <motion.div
                  key={v.title}
                  variants={staggerItem}
                  className="glass rounded-2xl p-5 group hover:border-[#FFD54F]/15 transition-all duration-300"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                  whileHover={reduced ? {} : { y: -2, transition: { duration: 0.25, ease: EASE } }}
                >
                  <v.icon size={18} className="text-[#FFD54F] mb-3 opacity-70" />
                  <div className="text-sm font-semibold text-white/80 mb-2">{v.title}</div>
                  <div className="text-xs text-white/35 leading-relaxed">{v.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
