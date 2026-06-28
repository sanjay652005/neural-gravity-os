import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X, Minus, Github, ExternalLink, FileText, Globe,
  GitBranch, Layers, CheckCircle2, Circle, ChevronRight,
  Folder, FolderOpen, Code2, Database, Server, Zap,
  Clock, GitCommit, BarChart3, Lightbulb, AlertTriangle,
  Wrench, Rocket, ArrowRight, Terminal
} from 'lucide-react'
import { useOS } from '@/contexts/OSContext'
import { EASE } from '@/animations/variants'

// ─── Types ────────────────────────────────────────────────────────────────────

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
  lines: string
  files: string
  category: string
}

// ─── Boot sequence ────────────────────────────────────────────────────────────

const BOOT_STEPS = [
  'Authenticating Module',
  'Loading Assets',
  'Connecting AI Engine',
  'Initializing Workspace',
  'Workspace Ready',
]

function BootSequence({ color, onDone }: { color: string; onDone: () => void }) {
  const [stepIdx, setStepIdx] = useState(0)
  const [done, setDone] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) { onDone(); return }
    const delays = [220, 220, 240, 220, 280]
    let idx = 0
    const run = () => {
      if (idx >= BOOT_STEPS.length - 1) {
        setStepIdx(BOOT_STEPS.length - 1)
        setDone(true)
        setTimeout(onDone, 380)
        return
      }
      idx++
      setStepIdx(idx)
      setTimeout(run, delays[idx])
    }
    const t = setTimeout(run, delays[0])
    return () => clearTimeout(t)
  }, [onDone, reduced])

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 rounded-2xl"
      style={{ background: 'rgba(9,9,9,0.97)', backdropFilter: 'blur(40px)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="relative mb-10 flex items-center justify-center" style={{ width: 64, height: 64 }}>
        <motion.div
          className="absolute rounded-full"
          style={{ width: 64, height: 64, border: `1px solid ${color}`, opacity: 0.15 }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0, 0.15] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ width: 44, height: 44, border: `1px solid ${color}`, opacity: 0.25 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0, 0.25] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${color}CC, ${color}66)`,
            boxShadow: `0 0 20px ${color}40`,
          }}
        >
          <span style={{ fontSize: 9, fontWeight: 700, color: '#090909', fontFamily: 'Inter, sans-serif', letterSpacing: '0.5px' }}>NG</span>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2" style={{ minWidth: 220 }}>
        <span className="text-xs font-mono mb-3" style={{ color: `${color}80`, letterSpacing: '0.2em' }}>
          {'> boot gravity-engine'}
        </span>
        {BOOT_STEPS.map((step, i) => (
          <motion.div
            key={step}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -8 }}
            animate={stepIdx >= i ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <motion.div
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{
                background: stepIdx > i ? '#4ADE80' : i === stepIdx ? color : 'rgba(255,255,255,0.15)',
                boxShadow: stepIdx >= i ? `0 0 4px ${stepIdx > i ? '#4ADE80' : color}` : 'none',
              }}
            />
            <span
              className="text-xs font-mono"
              style={{
                color: stepIdx > i ? 'rgba(255,255,255,0.35)' : i === stepIdx ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.2)',
              }}
            >
              {step}
            </span>
            {i === stepIdx && !done && (
              <motion.span className="text-xs font-mono" style={{ color }}
                animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }}>
                ...
              </motion.span>
            )}
            {(stepIdx > i || (done && i === stepIdx)) && (
              <span className="text-xs font-mono" style={{ color: '#4ADE80' }}>✓</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function TabOverview({ project }: { project: Project }) {
  const metrics = [
    { label: 'Lines of Code', value: project.lines, icon: Code2 },
    { label: 'Files',         value: project.files, icon: FileText },
    { label: 'Features',      value: `${project.features.length}`, icon: Zap },
    { label: 'Tech Stack',    value: `${project.techStack.length}`, icon: Layers },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Description */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase block mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Module Description
        </span>
        <p className="text-sm text-white/60 leading-relaxed">{project.description}</p>
      </div>

      {/* Metrics */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase block mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Engineering Metrics
        </span>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              whileHover={{ borderColor: `${project.color}25`, background: 'rgba(255,255,255,0.035)' } as any}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${project.color}15`, border: `1px solid ${project.color}20` }}>
                <m.icon size={13} style={{ color: project.color }} />
              </div>
              <div>
                <div className="text-xl font-bold mb-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${project.color} 0%, ${project.color}88 100%)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                  {m.value}
                </div>
                <div className="text-[10px] font-mono text-white/35">{m.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status strip */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-mono px-3 py-1.5 rounded-full"
          style={{ background: `${project.color}15`, color: project.color, border: `1px solid ${project.color}25` }}>
          {project.category}
        </span>
        {project.live && (
          <div className="flex items-center gap-2">
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ADE80' }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
            <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>Live in production</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Tab: Architecture ────────────────────────────────────────────────────────

interface ArchLayer {
  id: string
  label: string
  sublabel: string
  icon: React.ElementType
  techs: string[]
  color: string
}

function getArchLayers(project: Project, accentColor: string): ArchLayer[] {
  const ts = project.techStack

  const frontend = ts.filter(t => ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Next.js', 'Vite'].includes(t))
  const backend  = ts.filter(t => ['Node.js', 'Express', 'Java', 'Spring Boot', 'Servlets', 'JSP', 'JDBC', 'Tomcat', 'Hibernate'].includes(t))
  const database = ts.filter(t => ['MongoDB', 'MySQL', 'Mongoose', 'Redis', 'PostgreSQL'].includes(t))
  const services = ts.filter(t => !frontend.includes(t) && !backend.includes(t) && !database.includes(t))

  const layers: ArchLayer[] = []

  if (frontend.length)
    layers.push({ id: 'frontend', label: 'Frontend Layer', sublabel: 'UI · State · Routing', icon: Globe, techs: frontend, color: accentColor })

  if (backend.length)
    layers.push({ id: 'backend', label: 'Backend Layer', sublabel: 'API · Auth · Business Logic', icon: Server, techs: backend, color: accentColor })

  if (database.length)
    layers.push({ id: 'database', label: 'Data Layer', sublabel: 'Persistence · Queries · Schema', icon: Database, techs: database, color: accentColor })

  if (services.length)
    layers.push({ id: 'services', label: 'Services', sublabel: 'External · Realtime · AI', icon: Zap, techs: services, color: accentColor })

  return layers
}

function ArchFlow({ layers, color }: { layers: ArchLayer[]; color: string }) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2">
      {layers.map((layer, i) => (
        <div key={layer.id} className="flex flex-col">
          <motion.div
            className="rounded-xl p-4 cursor-pointer"
            style={{
              background: activeLayer === layer.id ? `${color}10` : 'rgba(255,255,255,0.025)',
              border: activeLayer === layer.id ? `1px solid ${color}35` : '1px solid rgba(255,255,255,0.06)',
            }}
            onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
            whileHover={{ background: `${color}08`, borderColor: `${color}28` } as any}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}22` }}>
                <layer.icon size={14} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/75">{layer.label}</span>
                  <motion.div animate={{ rotate: activeLayer === layer.id ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.25)' }} />
                  </motion.div>
                </div>
                <span className="text-[10px] font-mono text-white/30">{layer.sublabel}</span>
              </div>
            </div>

            <AnimatePresence>
              {activeLayer === layer.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 mt-3 flex flex-wrap gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {layer.techs.map(t => (
                      <span key={t} className="text-[11px] font-mono px-2.5 py-1 rounded-lg"
                        style={{ background: `${color}12`, color: `${color}CC`, border: `1px solid ${color}20` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Flow arrow between layers */}
          {i < layers.length - 1 && (
            <div className="flex justify-center py-1">
              <div className="flex flex-col items-center gap-0.5">
                {[0, 1, 2].map(j => (
                  <motion.div key={j} className="w-px h-1 rounded-full"
                    style={{ background: color }}
                    animate={{ opacity: [0.15, 0.5, 0.15] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: j * 0.18 }} />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function TabArchitecture({ project }: { project: Project }) {
  const layers = getArchLayers(project, project.color)

  return (
    <div className="flex flex-col gap-5">
      {/* Header label */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
          System Architecture
        </span>
        <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
          {layers.length} layers · tap to expand
        </span>
      </div>

      {/* Layer diagram */}
      <ArchFlow layers={layers} color={project.color} />

      {/* API Flow section */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase block mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
          API Flow
        </span>
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 flex-wrap">
            {['Client', 'HTTP/WS', 'Middleware', 'Controller', 'Service', 'DB'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg"
                  style={{
                    background: i === 0 || i === arr.length - 1 ? `${project.color}18` : 'rgba(255,255,255,0.04)',
                    color: i === 0 || i === arr.length - 1 ? project.color : 'rgba(255,255,255,0.45)',
                    border: `1px solid ${i === 0 || i === arr.length - 1 ? project.color + '30' : 'rgba(255,255,255,0.07)'}`,
                  }}>
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <motion.div animate={{ x: [0, 2, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}>
                    <ArrowRight size={10} style={{ color: 'rgba(255,255,255,0.2)' }} />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Features ────────────────────────────────────────────────────────────

function TabFeatures({ project }: { project: Project }) {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const toggle = useCallback((i: number) => {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }, [])

  const pct = Math.round((checked.size / project.features.length) * 100)

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Feature Audit
          </span>
          <motion.span className="text-[11px] font-mono font-semibold" style={{ color: project.color }}
            key={pct} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
            {checked.size}/{project.features.length} verified
          </motion.span>
        </div>
        <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${project.color}99, ${project.color})` }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
        </div>
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-2">
        {project.features.map((f, i) => {
          const done = checked.has(i)
          return (
            <motion.div
              key={f}
              className="flex items-center gap-4 rounded-xl px-4 py-3.5 cursor-pointer group"
              style={{
                background: done ? `${project.color}0A` : 'rgba(255,255,255,0.025)',
                border: done ? `1px solid ${project.color}25` : '1px solid rgba(255,255,255,0.06)',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              onClick={() => toggle(i)}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div animate={{ scale: done ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.25 }}>
                {done
                  ? <CheckCircle2 size={16} style={{ color: project.color }} />
                  : <Circle size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
                }
              </motion.div>
              <span className="text-sm flex-1"
                style={{
                  color: done ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)',
                  textDecoration: done ? 'none' : 'none',
                  transition: 'color 0.2s',
                }}>
                {f}
              </span>
              {done && (
                <motion.span className="text-[10px] font-mono" style={{ color: `${project.color}80` }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  VERIFIED
                </motion.span>
              )}
            </motion.div>
          )
        })}
      </div>

      <p className="text-[10px] font-mono text-center" style={{ color: 'rgba(255,255,255,0.18)' }}>
        click features to mark as verified
      </p>
    </div>
  )
}

// ─── Tab: Tech Stack ──────────────────────────────────────────────────────────

function TabTechStack({ project }: { project: Project }) {
  const tiers = [
    { label: 'Frontend',  techs: project.techStack.filter(t => ['React', 'React.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Next.js', 'Vite', 'Bootstrap'].includes(t)) },
    { label: 'Backend',   techs: project.techStack.filter(t => ['Node.js', 'Express', 'Express.js', 'Java', 'Spring Boot', 'Servlets', 'JSP', 'JDBC', 'Tomcat', 'Hibernate', 'Hibernate/JPA', 'JWT', 'Socket.IO', 'REST APIs'].includes(t)) },
    { label: 'Database',  techs: project.techStack.filter(t => ['MongoDB', 'MySQL', 'Mongoose', 'Redis', 'PostgreSQL', 'SQL'].includes(t)) },
    { label: 'Services',  techs: project.techStack.filter(t => !['React', 'React.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Next.js', 'Vite', 'Bootstrap', 'Node.js', 'Express', 'Express.js', 'Java', 'Spring Boot', 'Servlets', 'JSP', 'JDBC', 'Tomcat', 'Hibernate', 'Hibernate/JPA', 'JWT', 'Socket.IO', 'REST APIs', 'MongoDB', 'MySQL', 'Mongoose', 'Redis', 'PostgreSQL', 'SQL'].includes(t)) },
  ].filter(t => t.techs.length > 0)

  return (
    <div className="flex flex-col gap-5">
      {tiers.map((tier, ti) => (
        <div key={tier.label}>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase block mb-3"
            style={{ color: 'rgba(255,255,255,0.3)' }}>
            {tier.label}
          </span>
          <div className="flex flex-wrap gap-2">
            {tier.techs.map((t, i) => (
              <motion.span key={t}
                className="text-xs font-mono px-3 py-1.5 rounded-xl cursor-default"
                style={{ background: `${project.color}12`, color: `${project.color}CC`, border: `1px solid ${project.color}20` }}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: ti * 0.08 + i * 0.04, duration: 0.28 }}
                whileHover={{ background: `${project.color}22`, borderColor: `${project.color}45`, scale: 1.04 } as any}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Folder Tree ──────────────────────────────────────────────────────────────

interface TreeNode { name: string; type: 'dir' | 'file'; children?: TreeNode[] }

function getProjectTree(project: Project): TreeNode[] {
  const trees: Record<string, TreeNode[]> = {
    skillswap: [
      { name: 'client/', type: 'dir', children: [
        { name: 'src/', type: 'dir', children: [
          { name: 'components/', type: 'dir' },
          { name: 'pages/', type: 'dir' },
          { name: 'hooks/', type: 'dir' },
          { name: 'context/', type: 'dir' },
          { name: 'App.tsx', type: 'file' },
        ]},
        { name: 'package.json', type: 'file' },
      ]},
      { name: 'server/', type: 'dir', children: [
        { name: 'routes/', type: 'dir' },
        { name: 'controllers/', type: 'dir' },
        { name: 'models/', type: 'dir' },
        { name: 'middleware/', type: 'dir' },
        { name: 'index.js', type: 'file' },
      ]},
      { name: 'docker-compose.yml', type: 'file' },
      { name: 'README.md', type: 'file' },
    ],
    quizarena: [
      { name: 'client/', type: 'dir', children: [
        { name: 'src/', type: 'dir', children: [
          { name: 'components/', type: 'dir' },
          { name: 'pages/', type: 'dir' },
          { name: 'socket/', type: 'dir' },
          { name: 'App.tsx', type: 'file' },
        ]},
      ]},
      { name: 'server/', type: 'dir', children: [
        { name: 'routes/', type: 'dir' },
        { name: 'events/', type: 'dir' },
        { name: 'models/', type: 'dir' },
        { name: 'index.js', type: 'file' },
      ]},
      { name: 'README.md', type: 'file' },
    ],
    notesmind: [
      { name: 'frontend/', type: 'dir', children: [
        { name: 'src/', type: 'dir', children: [
          { name: 'components/', type: 'dir' },
          { name: 'pages/', type: 'dir' },
          { name: 'api/', type: 'dir' },
          { name: 'App.tsx', type: 'file' },
        ]},
      ]},
      { name: 'backend/', type: 'dir', children: [
        { name: 'routes/', type: 'dir' },
        { name: 'controllers/', type: 'dir' },
        { name: 'models/', type: 'dir' },
        { name: 'uploads/', type: 'dir' },
        { name: 'index.js', type: 'file' },
      ]},
      { name: 'Dockerfile', type: 'file' },
      { name: 'README.md', type: 'file' },
    ],
    'java-auth': [
      { name: 'src/main/', type: 'dir', children: [
        { name: 'java/', type: 'dir', children: [
          { name: 'servlets/', type: 'dir' },
          { name: 'models/', type: 'dir' },
          { name: 'dao/', type: 'dir' },
          { name: 'utils/', type: 'dir' },
        ]},
        { name: 'webapp/', type: 'dir', children: [
          { name: 'WEB-INF/', type: 'dir' },
          { name: 'views/', type: 'dir' },
          { name: 'index.jsp', type: 'file' },
        ]},
      ]},
      { name: 'pom.xml', type: 'file' },
      { name: 'README.md', type: 'file' },
    ],
  }
  return trees[project.id] ?? [
    { name: 'src/', type: 'dir', children: [
      { name: 'components/', type: 'dir' },
      { name: 'pages/', type: 'dir' },
      { name: 'index.ts', type: 'file' },
    ]},
    { name: 'README.md', type: 'file' },
  ]
}

function TreeItem({ node, depth, color }: { node: TreeNode; depth: number; color: string }) {
  const [open, setOpen] = useState(depth < 1)
  const isDir = node.type === 'dir'

  return (
    <div>
      <motion.div
        className="flex items-center gap-2 py-1 px-2 rounded-lg cursor-pointer group"
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => isDir && setOpen(o => !o)}
        whileHover={{ background: `${color}08` } as any}
      >
        {isDir
          ? (open ? <FolderOpen size={12} style={{ color, flexShrink: 0 }} /> : <Folder size={12} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />)
          : <FileText size={11} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
        }
        <span className="text-[11px] font-mono"
          style={{ color: isDir ? (open ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.4)') : 'rgba(255,255,255,0.35)' }}>
          {node.name}
        </span>
      </motion.div>
      <AnimatePresence>
        {isDir && open && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {node.children.map(child => (
              <TreeItem key={child.name} node={child} depth={depth + 1} color={color} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TabRepository({ project }: { project: Project }) {
  const { pushNotification } = useOS()
  const tree = getProjectTree(project)

  const stats = [
    { label: 'Lines of Code',       value: project.lines, icon: Code2 },
    { label: 'Files',               value: project.files, icon: FileText },
    { label: 'Commits (est.)',       value: project.id === 'skillswap' ? '140+' : project.id === 'quizarena' ? '65+' : project.id === 'notesmind' ? '80+' : '40+', icon: GitCommit },
    { label: 'Dev Duration',        value: project.id === 'skillswap' ? '5 months' : project.id === 'notesmind' ? '3 months' : project.id === 'quizarena' ? '2 months' : '4 weeks', icon: Clock },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* GitHub button */}
      <motion.a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl px-5 py-4 group"
        style={{ background: `${project.color}0E`, border: `1px solid ${project.color}30` }}
        whileHover={{ background: `${project.color}16`, borderColor: `${project.color}50` } as any}
        onClick={() => pushNotification('GitHub opened', 'info', '⌥')}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${project.color}18`, border: `1px solid ${project.color}25` }}>
          <Github size={16} style={{ color: project.color }} />
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-sm font-semibold" style={{ color: project.color }}>View Source Code</span>
          <span className="text-[11px] font-mono text-white/30">github.com/sanjay-p · {project.title}</span>
        </div>
        <ExternalLink size={13} style={{ color: `${project.color}70` }}
          className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.a>

      {/* Live demo if available */}
      {project.live && (
        <motion.a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-5 py-4 group"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
          whileHover={{ borderColor: 'rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.05)' } as any}
          onClick={() => pushNotification('Live demo launched', 'info', '↗')}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.06 }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <Globe size={16} style={{ color: '#4ADE80' }} />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-sm font-semibold text-white/75">Live Demo</span>
            <span className="text-[11px] font-mono text-white/30">Production · Deployed</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ADE80' }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <ExternalLink size={12} style={{ color: '#4ADE80' }} />
          </div>
        </motion.a>
      )}

      {/* Project statistics */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase block mb-3"
          style={{ color: 'rgba(255,255,255,0.3)' }}>
          Project Statistics
        </span>
        <div className="grid grid-cols-2 gap-2">
          {stats.map((s, i) => (
            <motion.div key={s.label} className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${project.color}12`, border: `1px solid ${project.color}1A` }}>
                <s.icon size={12} style={{ color: project.color }} />
              </div>
              <div>
                <div className="text-sm font-bold text-white/75">{s.value}</div>
                <div className="text-[9px] font-mono text-white/30">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Folder structure */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase block mb-2"
          style={{ color: 'rgba(255,255,255,0.3)' }}>
          Folder Structure
        </span>
        <div className="rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 px-3 pb-2 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <Terminal size={11} style={{ color: 'rgba(255,255,255,0.2)' }} />
            <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {project.title.toLowerCase().replace(/\s+/g, '-')}/
            </span>
          </div>
          {tree.map(node => (
            <TreeItem key={node.name} node={node} depth={0} color={project.color} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Lessons Learned ─────────────────────────────────────────────────────

interface LessonSection {
  title: string
  icon: React.ElementType
  color: string
  items: { title: string; desc: string }[]
}

function getProjectLessons(project: Project, accentColor: string): LessonSection[] {
  const byId: Record<string, LessonSection[]> = {
    skillswap: [
      {
        title: 'Engineering Decisions',
        icon: Lightbulb,
        color: accentColor,
        items: [
          { title: 'Socket.IO over WebSockets', desc: 'Chose Socket.IO for automatic fallback, room management, and built-in event handling — critical for a real-time exchange platform.' },
          { title: 'Groq/Llama 3.1 for AI', desc: 'Selected Groq for ultra-low inference latency (<1s) versus OpenAI, keeping the UX snappy during skill matching.' },
          { title: 'Monorepo structure', desc: 'Kept client/server in a single repo with shared TypeScript types to eliminate API contract drift.' },
        ],
      },
      {
        title: 'Challenges',
        icon: AlertTriangle,
        color: '#F87171',
        items: [
          { title: 'Race conditions on answer submission', desc: 'Multiple clients sending answers simultaneously caused score inconsistencies until atomic Socket.IO event handlers were implemented.' },
          { title: 'JWT refresh across socket sessions', desc: 'Maintaining auth across both HTTP and WebSocket connections required a dual-token strategy.' },
        ],
      },
      {
        title: 'Solutions',
        icon: Wrench,
        color: '#4ADE80',
        items: [
          { title: 'Room-based event namespacing', desc: 'Scoped all events to room IDs, eliminating cross-room leakage and simplifying state management.' },
          { title: 'Optimistic UI with rollback', desc: 'Applied optimistic updates client-side with server-confirmed rollback for a fluid feel.' },
        ],
      },
      {
        title: 'Future Improvements',
        icon: Rocket,
        color: '#60A5FA',
        items: [
          { title: 'WebRTC video calling', desc: 'Add peer-to-peer video sessions for real-time mentoring within skill exchange sessions.' },
          { title: 'Vector-based skill matching', desc: 'Replace keyword matching with embedding similarity for smarter, context-aware pairings.' },
        ],
      },
    ],
    quizarena: [
      {
        title: 'Engineering Decisions',
        icon: Lightbulb,
        color: accentColor,
        items: [
          { title: 'Server-authoritative scoring', desc: 'All score computation runs server-side, preventing client-side manipulation in competitive rooms.' },
          { title: 'Room lifecycle via socket events', desc: 'Room creation, joining, and teardown are all event-driven, keeping the server stateless between rooms.' },
        ],
      },
      {
        title: 'Challenges',
        icon: AlertTriangle,
        color: '#F87171',
        items: [
          { title: 'Disconnection mid-quiz', desc: 'Players dropping mid-round broke room state until grace-period reconnect logic was added.' },
          { title: 'Real-time leaderboard performance', desc: 'Frequent re-renders on leaderboard updates caused jank until state batching was applied.' },
        ],
      },
      {
        title: 'Solutions',
        icon: Wrench,
        color: '#4ADE80',
        items: [
          { title: 'Graceful room cleanup', desc: 'Implemented 30-second grace periods for disconnected players before eviction from the room.' },
          { title: 'React state batching', desc: 'Batched leaderboard updates using a debounce queue, reducing re-renders by ~70%.' },
        ],
      },
      {
        title: 'Future Improvements',
        icon: Rocket,
        color: '#60A5FA',
        items: [
          { title: 'Persistent question bank', desc: 'Build an admin panel for curating and categorizing questions by difficulty and domain.' },
          { title: 'Tournament brackets', desc: 'Add elimination-style bracket tournaments with matchmaking based on win rate.' },
        ],
      },
    ],
    notesmind: [
      {
        title: 'Engineering Decisions',
        icon: Lightbulb,
        color: accentColor,
        items: [
          { title: 'Groq for summarization', desc: 'Used Groq inference for near-instant document summaries, cached in MongoDB to avoid repeat API calls.' },
          { title: 'Docker multi-stage builds', desc: 'Separated build and runtime stages, keeping production images under 180MB with full layer caching.' },
        ],
      },
      {
        title: 'Challenges',
        icon: AlertTriangle,
        color: '#F87171',
        items: [
          { title: 'Large file upload handling', desc: 'Streaming uploads with Multer required careful async pipeline design to avoid memory spikes.' },
          { title: 'Search relevance', desc: 'MongoDB text indexes alone lacked context — metadata weighting was needed for acceptable precision.' },
        ],
      },
      {
        title: 'Solutions',
        icon: Wrench,
        color: '#4ADE80',
        items: [
          { title: 'Streaming file pipeline', desc: 'Used Multer disk storage with chunked processing and background extraction to keep the API responsive.' },
          { title: 'Compound text indexes', desc: 'Created compound indexes on title + tags + semester for significantly improved search relevance.' },
        ],
      },
      {
        title: 'Future Improvements',
        icon: Rocket,
        color: '#60A5FA',
        items: [
          { title: 'Vector semantic search', desc: 'Replace text indexes with embedding-based semantic search using pgvector or MongoDB Atlas Search.' },
          { title: 'Collaborative annotation', desc: 'Enable students to highlight and annotate shared notes collaboratively in real-time.' },
        ],
      },
    ],
    'java-auth': [
      {
        title: 'Engineering Decisions',
        icon: Lightbulb,
        color: accentColor,
        items: [
          { title: 'Pure Servlet architecture', desc: 'Avoided frameworks intentionally to demonstrate deep understanding of the Java EE request lifecycle and servlet container.' },
          { title: 'Connection pooling with DBCP', desc: 'Implemented JDBC connection pooling to handle concurrent requests without exhausting MySQL connections.' },
        ],
      },
      {
        title: 'Challenges',
        icon: AlertTriangle,
        color: '#F87171',
        items: [
          { title: 'Thread safety in servlets', desc: 'Servlet instances are shared across threads — instance variables caused subtle concurrency bugs.' },
          { title: 'CSRF on JSP forms', desc: 'Session-based CSRF tokens had to be carefully synchronized between form render and submission.' },
        ],
      },
      {
        title: 'Solutions',
        icon: Wrench,
        color: '#4ADE80',
        items: [
          { title: 'Stateless servlet design', desc: 'Moved all request state to local variables, eliminating shared mutable state and thread safety issues.' },
          { title: 'Filter chain for auth', desc: 'Implemented a Filter that intercepts all protected URL patterns before they reach the servlet.' },
        ],
      },
      {
        title: 'Future Improvements',
        icon: Rocket,
        color: '#60A5FA',
        items: [
          { title: 'Migrate to Spring Security', desc: 'Rebuild using Spring Boot + Spring Security + JWT for a production-grade auth architecture.' },
          { title: 'OAuth2 integration', desc: 'Add Google/GitHub OAuth2 provider support alongside the existing credential-based login.' },
        ],
      },
    ],
  }

  return byId[project.id] ?? [
    {
      title: 'Engineering Decisions',
      icon: Lightbulb,
      color: accentColor,
      items: [
        { title: 'System Design First', desc: 'Designed data flow and module contracts before writing any code.' },
        { title: 'Performance profiling', desc: 'Optimized at the database layer first — N+1 queries were the primary bottleneck.' },
      ],
    },
  ]
}

function TabLessons({ project }: { project: Project }) {
  const [openSection, setOpenSection] = useState<string>('Engineering Decisions')
  const sections = getProjectLessons(project, project.color)

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, si) => (
        <motion.div key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.07 }}>
          {/* Section header */}
          <button
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left"
            style={{
              background: openSection === section.title ? `${section.color}0D` : 'rgba(255,255,255,0.025)',
              border: openSection === section.title ? `1px solid ${section.color}28` : '1px solid rgba(255,255,255,0.06)',
            }}
            onClick={() => setOpenSection(openSection === section.title ? '' : section.title)}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${section.color}15`, border: `1px solid ${section.color}22` }}>
              <section.icon size={13} style={{ color: section.color }} />
            </div>
            <span className="text-xs font-semibold text-white/70 flex-1">{section.title}</span>
            <span className="text-[10px] font-mono mr-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {section.items.length}
            </span>
            <motion.div animate={{ rotate: openSection === section.title ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.25)' }} />
            </motion.div>
          </button>

          {/* Section items */}
          <AnimatePresence>
            {openSection === section.title && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-2 pt-2 pl-2">
                  {section.items.map((item, ii) => (
                    <motion.div key={item.title}
                      className="rounded-xl p-4"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: ii * 0.06, duration: 0.25 }}
                      whileHover={{ borderColor: `${section.color}20` } as any}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: section.color, boxShadow: `0 0 5px ${section.color}60` }} />
                        <div>
                          <div className="text-xs font-semibold text-white/70 mb-1">{item.title}</div>
                          <div className="text-[11px] text-white/40 leading-relaxed">{item.desc}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = ['Overview', 'Architecture', 'Features', 'Tech Stack', 'Repository', 'Lessons'] as const
type Tab = typeof TABS[number]

const TAB_ICONS: Record<Tab, React.ElementType> = {
  Overview:     BarChart3,
  Architecture: Layers,
  Features:     Zap,
  'Tech Stack': Code2,
  Repository:   Github,
  Lessons:      Lightbulb,
}

// ─── Workspace Body ───────────────────────────────────────────────────────────

function WorkspaceBody({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Tab bar */}
      <div
        className="flex items-center px-2 overflow-x-auto flex-shrink-0"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {TABS.map(tab => {
          const Icon = TAB_ICONS[tab]
          const active = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={active}
              className="relative flex items-center gap-1.5 px-3 py-3 text-[11px] font-mono whitespace-nowrap transition-colors duration-200 flex-shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-sm"
              style={{ color: active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.28)' }}
            >
              <Icon size={11} style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }} />
              <span>{tab}</span>
              {active && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: project.color }}
                  layoutId="tabIndicator"
                  transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-5 py-5"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.07) transparent' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {activeTab === 'Overview'      && <TabOverview      project={project} />}
            {activeTab === 'Architecture'  && <TabArchitecture  project={project} />}
            {activeTab === 'Features'      && <TabFeatures      project={project} />}
            {activeTab === 'Tech Stack'    && <TabTechStack     project={project} />}
            {activeTab === 'Repository'    && <TabRepository    project={project} />}
            {activeTab === 'Lessons'       && <TabLessons       project={project} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Window ───────────────────────────────────────────────────────────────────

function WorkspaceWindow({ project, onClose }: { project: Project; onClose: () => void }) {
  const [booting, setBooting] = useState(true)
  const [minimized, setMinimized] = useState(false)
  const moduleId = `MODULE_${String(project.id.charCodeAt(0) % 9 + 1).padStart(3, '0')}`
  const { pushNotification, setIsLoading, setLastOpenedModule } = useOS()

  useEffect(() => {
    setLastOpenedModule(project.id)
    setIsLoading(true)
    const t = setTimeout(() => {
      setIsLoading(false)
      pushNotification(`${project.title} loaded`, 'success', '◈')
    }, 900)
    return () => clearTimeout(t)
  }, [project.id, project.title, pushNotification, setIsLoading, setLastOpenedModule])

  useEffect(() => {
    const scrollY = window.scrollY
    const scrollX = window.scrollX
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      window.scrollTo({ top: scrollY, left: scrollX, behavior: 'instant' as ScrollBehavior })
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div
      className="relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, rgba(16,14,9,0.99) 0%, rgba(10,10,10,0.99) 100%)',
        border: `1px solid ${project.color}22`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.8), 0 0 60px ${project.color}08`,
        width: '100%',
        maxWidth: 660,
        maxHeight: 'min(90vh, 90dvh)',
        minHeight: minimized ? 'auto' : 'min(64vh, 64dvh)',
      }}
      initial={{ scale: 0.97, opacity: 0, y: 16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.94, opacity: 0, y: 10 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.8 }}
    >
      {/* Title bar */}
      <div
        className="relative flex items-center justify-between px-5 py-3.5 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', zIndex: 20 }}
      >
        <div className="flex items-center gap-2">
          <button onClick={onClose}
            className="w-3 h-3 rounded-full flex-shrink-0 focus:outline-none focus:ring-1 focus:ring-red-400/50"
            style={{ background: 'rgba(255,95,87,0.6)' }} title="Close" aria-label="Close workspace" />
          <button onClick={() => setMinimized(m => !m)}
            className="w-3 h-3 rounded-full flex-shrink-0 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
            style={{ background: 'rgba(255,189,46,0.5)' }} title="Minimize" aria-label="Minimize workspace" />
          <div className="w-3 h-3 rounded-full flex-shrink-0 opacity-30"
            style={{ background: 'rgba(39,201,63,0.5)' }} aria-hidden="true" />
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] font-mono tracking-[0.25em]" style={{ color: `${project.color}60` }}>
            {moduleId}
          </span>
          <span className="text-xs font-semibold text-white/70 leading-tight">{project.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ADE80' }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            <span className="text-[10px] font-mono" style={{ color: '#4ADE8099', letterSpacing: '0.1em' }}>ONLINE</span>
          </div>
          <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>v2.4.1</span>
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-col flex-1 overflow-hidden">
        <AnimatePresence>
          {booting && <BootSequence color={project.color} onDone={() => setBooting(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {!minimized && (
            <motion.div
              className="flex flex-col overflow-hidden"
              style={{ flex: 1 }}
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Subtitle */}
              <div className="px-5 py-2.5 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-[11px] text-white/30 font-mono">{project.subtitle}</p>
              </div>

              <WorkspaceBody project={project} />

              {/* Footer */}
              <div
                className="flex items-center justify-between px-5 py-2 flex-shrink-0"
                style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>Status</span>
                    <span className="text-[10px] font-mono font-semibold" style={{ color: '#4ADE80' }}>ONLINE</span>
                  </div>
                  <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>Integrity</span>
                    <span className="text-[10px] font-mono font-semibold" style={{ color: project.color }}>99.8%</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.15)' }}>
                  Last updated · 2026
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Overlay / Main Export ────────────────────────────────────────────────────

export default function ProjectWorkspace({ project, onClose }: { project: Project; onClose: () => void }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — Project Details`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="absolute inset-0 cursor-pointer"
        style={{ background: 'rgba(5,5,5,0.88)' }}
        initial={{ backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
        animate={{ backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
        exit={{ backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500,
          background: `radial-gradient(circle, ${project.glowColor.replace('0.4', '0.06')} 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative z-10 w-full flex justify-center" onClick={e => e.stopPropagation()}>
        <motion.div
          initial={reduced ? { opacity: 0 } : { scale: 0.52, opacity: 0, y: 18, filter: 'blur(4px)' }}
          animate={reduced ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduced ? { opacity: 0 } : { scale: 0.55, opacity: 0, y: 12, filter: 'blur(6px)' }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <WorkspaceWindow project={project} onClose={onClose} />
        </motion.div>
      </div>
    </motion.div>
  )
}
