/**
 * Projects — Phase 9: Gravity Module Launch
 *
 * Clicking "Launch Module" initiates the 5-phase gravity launch sequence
 * via ModuleLaunchContext. The card itself animates through GRAVITY_BUILD
 * before handing off to the overlay and workspace.
 */

import { useRef, useCallback } from 'react'
import { motion, useInView, useReducedMotion, useMotionValue, useSpring } from 'framer-motion'
import { Github, ChevronRight } from 'lucide-react'
import { PROJECTS } from '@/constants'
import { useModuleLaunch } from '@/contexts/ModuleLaunchContext'
import ProjectWorkspace from '@/components/ProjectWorkspace'
import { EASE } from '@/animations/variants'

interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  color: string
  glowColor: string
  features: string[]
  techStack: string[]
  github: string
  live: string | null
  lines?: string
  files?: string
  category: string
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const ref     = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const reduced  = useReducedMotion()

  const { phase, activeProjectId, initiatelaunch } = useModuleLaunch()
  const isThisLaunching = activeProjectId === project.id && phase === 'GRAVITY_BUILD'
  const isAnyLaunching  = phase !== 'IDLE' && phase !== 'CLOSING'

  // Subtle 3D tilt — max 3 degrees
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRX = useSpring(rotateX, { stiffness: 180, damping: 22, mass: 0.4 })
  const springRY = useSpring(rotateY, { stiffness: 180, damping: 22, mass: 0.4 })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || reduced || isAnyLaunching) return
    const rect = cardRef.current.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)
    rotateY.set(dx * 3)
    rotateX.set(-dy * 3)
  }
  const onMouseLeave = () => { rotateX.set(0); rotateY.set(0) }

  const handleLaunch = useCallback(() => {
    if (!cardRef.current || isAnyLaunching) return
    const rect = cardRef.current.getBoundingClientRect()
    initiatelaunch(project.id, rect)
  }, [project.id, initiatelaunch, isAnyLaunching])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.97, rotate: reduced ? 0 : -0.4 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.65, ease: EASE }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={cardRef}
        className="group relative glass rounded-3xl p-8 overflow-hidden"
        style={{
          border: '1px solid rgba(255,255,255,0.06)',
          rotateX: springRX,
          rotateY: springRY,
          transformStyle: 'preserve-3d',
          cursor: isAnyLaunching ? 'default' : 'pointer',
        }}
        // Gravity build-up animation on the card itself
        animate={
          reduced ? {} :
          isThisLaunching ? {
            y: [-2, -8, -6],
            scale: [1, 1.015, 1.01],
            rotate: [0, 0.4, -0.2],
            boxShadow: [
              `0 0 0px ${project.color}00`,
              `0 12px 50px ${project.color}30, 0 0 0 1px ${project.color}20`,
              `0 18px 60px ${project.color}35, 0 0 0 1px ${project.color}25`,
            ],
          } : {
            y: 0, scale: 1, rotate: 0,
            boxShadow: `0 0 0px ${project.color}00`,
          }
        }
        transition={
          isThisLaunching
            ? { duration: 0.6, ease: [0.22, 1, 0.36, 1], times: [0, 0.5, 1] }
            : { y: { type: 'spring', stiffness: 200, damping: 22 } }
        }
        whileHover={isAnyLaunching ? {} : { y: -4, borderColor: `${project.color}22`, transition: { duration: 0.3, ease: EASE } }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={handleLaunch}
      >
        {/* Gradient orb */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none blur-3xl transition-opacity duration-500"
          style={{
            background: project.glowColor,
            transform: 'translate(30%, -30%)',
            opacity: isThisLaunching ? 0.35 : 0,
          }}
        />

        {/* Launching glow pulse — only during gravity build */}
        {isThisLaunching && !reduced && (
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ border: `1px solid ${project.color}` }}
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Category badge */}
        <div
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono mb-6"
          style={{ background: `${project.color}10`, color: project.color }}
        >
          {project.category}
        </div>

        {/* Title */}
        <h3
          className="text-2xl font-bold mb-2 transition-colors"
          style={{ letterSpacing: '-0.02em' }}
        >
          {project.title}
        </h3>
        <p className="text-sm text-white/40 mb-6">{project.subtitle}</p>

        {/* Description */}
        <p className="text-sm text-white/50 leading-relaxed mb-8 line-clamp-3">
          {project.description}
        </p>

        {/* Features preview */}
        <div className="flex flex-wrap gap-1.5 mb-8">
          {project.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="text-xs text-white/35 px-2.5 py-1 rounded-full"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {f}
            </span>
          ))}
          {project.features.length > 3 && (
            <span className="text-xs text-white/25 px-2.5 py-1">+{project.features.length - 3} more</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 3).map(t => (
              <span key={t} className="text-xs font-mono text-white/25">{t}</span>
            ))}
          </div>
          <motion.div
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: project.color }}
            animate={isThisLaunching ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
            transition={isThisLaunching ? { duration: 0.4, repeat: Infinity } : {}}
          >
            {isThisLaunching ? 'Launching...' : 'Launch Module →'}
          </motion.div>
        </div>

        {/* Bottom border accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(90deg, transparent, ${project.color}40, transparent)` }}
        />
      </motion.div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const { phase, activeProjectId, origin, initiateClose } = useModuleLaunch()
  const activeProject = PROJECTS.find(p => p.id === activeProjectId) ?? null
  const workspaceOpen = (phase === 'EXPANDED' || phase === 'CLOSING')
    && !!activeProject
    && origin?.source === 'card'

  return (
    <section id="projects" aria-label="Projects — Engineering Modules" className="section relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <span className="text-xs font-mono text-[#FFD54F]/50 tracking-[0.3em] uppercase">MODULES</span>
          <h2
            className="text-4xl md:text-5xl font-bold mt-3 tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Production systems deployed into orbit.
          </h2>
          <p className="mt-4 text-white/35 text-base max-w-md mx-auto">
            Real products I've designed, architected, and shipped.
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
            />
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.5, ease: EASE }}
        >
          <a
            href="https://github.com/sanjay-p"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-sm font-medium text-white/40 hover:text-white/70 transition-colors group"
          >
            <Github size={16} />
            View all repositories on GitHub
            <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* Workspace — rendered at section level, mounts only in EXPANDED/CLOSING */}
      {workspaceOpen && activeProject && (
        <ProjectWorkspace
          key={activeProject.id}
          project={activeProject}
          onClose={initiateClose}
        />
      )}
    </section>
  )
}
