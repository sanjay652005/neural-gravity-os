import { useRef } from 'react'
import React from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { SKILLS } from '@/constants'
import { useGravityField } from '@/hooks/useGravityField'
import { gravityReveal, chipReveal, EASE } from '@/animations/variants'

const CATEGORY_LABELS: Record<string, string> = {
  backend:  'Backend',
  frontend: 'Frontend',
  database: 'Database',
  tools:    'Tools & Platforms',
}

const CATEGORY_COLORS: Record<string, string> = {
  backend:  '#FFD54F',
  frontend: '#64B5F6',
  database: '#81C784',
  tools:    '#FF8A65',
}

function SkillTile({ name, color, index, sectionInView }: {
  name: string; color: string; index: number; sectionInView: boolean
}) {
  const reduced = useReducedMotion() ?? false

  return (
    <motion.div
      className="group relative cursor-default select-none"
      variants={chipReveal}
      custom={reduced ? 0 : index * 0.04}
      initial="hidden"
      animate={sectionInView ? 'visible' : 'hidden'}
      whileHover={reduced ? {} : { y: -2, transition: { duration: 0.2, ease: EASE } }}
    >
      <div
        className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
        style={{
          background: `${color}0D`,
          border: `1px solid ${color}20`,
          color: `${color}CC`,
        }}
      >
        <span className="group-hover:opacity-100 transition-opacity" style={{ opacity: 0.85 }}>
          {name}
        </span>
      </div>
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ boxShadow: `0 0 14px ${color}1A` }}
      />
    </motion.div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const reduced = useReducedMotion() ?? false
  const { ref: gridRef, style: gridGravity } = useGravityField({ maxTranslate: 2, maxRotate: 0.8, lag: 0.025 })

  const categories = Object.keys(SKILLS) as Array<keyof typeof SKILLS>

  return (
    <section id="skills" aria-label="Skills — Core Technology Stack" className="section relative" ref={ref}>
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,213,79,0.02) 0%, transparent 70%)' }}
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
          <span className="text-xs font-mono text-[#FFD54F]/50 tracking-[0.3em] uppercase">CORE SYSTEM</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Technologies powering the Gravity Engine.
          </h2>
          <p className="mt-4 text-white/35 text-base max-w-md mx-auto">
            Technologies I use to build scalable systems and modern experiences.
          </p>
        </motion.div>

        {/* Skills grid — categories staggered, chips staggered within */}
        <motion.div ref={gridRef} style={gridGravity as unknown as React.CSSProperties} className="grid md:grid-cols-2 gap-12">
          {categories.map((category, catIdx) => {
            const color  = CATEGORY_COLORS[category]
            const skills = SKILLS[category]

            return (
              <motion.div
                key={category}
                variants={gravityReveal}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={reduced ? 0 : 0.1 + catIdx * 0.1}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                  <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: `${color}80` }}>
                    {CATEGORY_LABELS[category]}
                  </span>
                  <div className="flex-1 h-px" style={{ background: `${color}15` }} />
                </div>

                {/* Chip grid */}
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <SkillTile
                      key={skill.name}
                      name={skill.name}
                      color={color}
                      index={i + catIdx * 3}
                      sectionInView={isInView}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Also familiar with */}
        <motion.div
          className="mt-20 text-center"
          variants={gravityReveal}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={reduced ? 0 : 0.5}
        >
          <div className="text-xs font-mono text-white/20 tracking-widest uppercase mb-5">Also familiar with</div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Linux', 'Netlify', 'MongoDB Atlas', 'Figma', 'GSAP', 'Lenis'].map((tech, i) => (
              <motion.span
                key={tech}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: reduced ? 0 : 0.55 + i * 0.06, duration: 0.4, ease: EASE }}
                className="text-xs font-mono text-white/25 px-3 py-1.5 rounded-lg"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
