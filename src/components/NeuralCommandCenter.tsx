import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  forwardRef,
  useImperativeHandle,
} from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion'
import {
  Compass,
  Box,
  Download,
  Github,
  Linkedin,
  Mail,
  Activity,
  Cpu,
  X,
  Terminal,
  Zap,
  Clock,
  ChevronRight,
  Globe,
  Info,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { useOS } from '@/contexts/OSContext'

// ─── Types ────────────────────────────────────────────────────────────────────

type CommandCategory =
  | 'navigation'
  | 'modules'
  | 'system'
  | 'developer'
  | 'hidden'

interface Command {
  id: string
  label: string
  description?: string
  category: CommandCategory
  icon: React.ReactNode
  keywords: string[]
  action: (ctx: CommandContext) => void
}

interface CommandContext {
  navigate: (href: string) => void
  openProject: (id: string) => void
  showOutput: (lines: OutputLine[]) => void
  clearRecent: () => void
  openURL: (url: string) => void
}

interface OutputLine {
  type: 'header' | 'ok' | 'info' | 'warn' | 'data'
  text: string
  value?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD        = '#FFD54F'
const RECENT_KEY  = 'ng_os_recent_cmds'
const MAX_RECENT  = 10

const CATEGORY_LABELS: Record<CommandCategory, string> = {
  navigation: 'Navigation',
  modules:    'Launch Modules',
  system:     'System',
  developer:  'Developer',
  hidden:     'System Output',
}

// ─── All Commands ─────────────────────────────────────────────────────────────

function buildCommands(ctx: CommandContext): Command[] {
  return [
    // ── Navigation ────────────────────────────────────────────────────────
    {
      id: 'nav-origin',
      label: 'Origin',
      description: 'About — who I am',
      category: 'navigation',
      icon: <Compass size={15} />,
      keywords: ['about', 'origin', 'who', 'intro', 'sanjay'],
      action: () => ctx.navigate('#about'),
    },
    {
      id: 'nav-core',
      label: 'Core System',
      description: 'Skills & technologies',
      category: 'navigation',
      icon: <Cpu size={15} />,
      keywords: ['skills', 'core', 'system', 'tech', 'stack', 'java', 'react'],
      action: () => ctx.navigate('#skills'),
    },
    {
      id: 'nav-modules',
      label: 'Modules',
      description: 'Projects deployed into orbit',
      category: 'navigation',
      icon: <Box size={15} />,
      keywords: ['projects', 'modules', 'work', 'portfolio'],
      action: () => ctx.navigate('#projects'),
    },
    {
      id: 'nav-missionlog',
      label: 'Mission Log',
      description: 'Experience & timeline',
      category: 'navigation',
      icon: <Activity size={15} />,
      keywords: ['experience', 'mission', 'log', 'work', 'intern', 'timeline'],
      action: () => ctx.navigate('#experience'),
    },
    {
      id: 'nav-transmission',
      label: 'Transmission',
      description: 'Open communication channel',
      category: 'navigation',
      icon: <Mail size={15} />,
      keywords: ['contact', 'transmission', 'email', 'hire', 'message'],
      action: () => ctx.navigate('#contact'),
    },

    // ── Launch Modules ────────────────────────────────────────────────────
    {
      id: 'mod-skillswap',
      label: 'Launch SkillSwap',
      description: 'AI-powered peer skill exchange platform',
      category: 'modules',
      icon: <Zap size={15} />,
      keywords: ['skillswap', 'skill', 'swap', 'ai', 'mern', 'groq', 'llama'],
      action: () => ctx.openProject('skillswap'),
    },
    {
      id: 'mod-quizarena',
      label: 'Launch QuizArena',
      description: 'Real-time multiplayer quiz platform',
      category: 'modules',
      icon: <Box size={15} />,
      keywords: ['quiz', 'arena', 'multiplayer', 'realtime', 'socket'],
      action: () => ctx.openProject('quizarena'),
    },
    {
      id: 'mod-notesmind',
      label: 'Launch NotesMind',
      description: 'Study notes & AI-powered platform',
      category: 'modules',
      icon: <Box size={15} />,
      keywords: ['notes', 'mind', 'notesmind', 'study', 'docker', 'ai'],
      action: () => ctx.openProject('notesmind'),
    },
    {
      id: 'mod-javaauth',
      label: 'Launch Java Auth System',
      description: 'Enterprise auth with Servlet & JSP',
      category: 'modules',
      icon: <Box size={15} />,
      keywords: ['java', 'auth', 'servlet', 'jsp', 'tomcat', 'mysql', 'enterprise'],
      action: () => ctx.openProject('java-auth'),
    },

    // ── System ────────────────────────────────────────────────────────────
    {
      id: 'sys-missioncontrol',
      label: 'Open Mission Control',
      description: 'View the neural core diagnostic panel',
      category: 'system',
      icon: <Terminal size={15} />,
      keywords: ['mission', 'control', 'hud', 'panel', 'diagnostic'],
      action: () => ctx.navigate('#about'),
    },
    {
      id: 'sys-boot',
      label: 'Run Boot Sequence',
      description: 'Restart the OS loading animation',
      category: 'system',
      icon: <Zap size={15} />,
      keywords: ['boot', 'restart', 'reload', 'sequence', 'loader'],
      action: () => {
        window.location.reload()
      },
    },
    {
      id: 'sys-status',
      label: 'View System Status',
      description: 'Current gravity engine metrics',
      category: 'system',
      icon: <Activity size={15} />,
      keywords: ['status', 'system', 'health', 'metrics'],
      action: () =>
        ctx.showOutput([
          { type: 'header', text: 'System Status' },
          { type: 'ok',   text: 'Gravity Engine',    value: 'ONLINE' },
          { type: 'ok',   text: 'Neural Core',        value: 'ACTIVE' },
          { type: 'ok',   text: 'Intelligence Layer', value: 'READY' },
          { type: 'data', text: 'System Integrity',   value: '99.8%' },
          { type: 'data', text: 'Uptime',             value: 'Continuous' },
          { type: 'info', text: 'All systems nominal.' },
        ]),
    },
    {
      id: 'sys-diagnostics',
      label: 'System Diagnostics',
      description: 'Full gravity OS diagnostic report',
      category: 'system',
      icon: <Cpu size={15} />,
      keywords: ['diagnostics', 'debug', 'report', 'cpu', 'memory'],
      action: () =>
        ctx.showOutput([
          { type: 'header', text: 'System Diagnostics' },
          { type: 'data',  text: 'OS',          value: 'Neural Gravity OS v2.0' },
          { type: 'data',  text: 'Runtime',      value: 'React 18 + Vite 5' },
          { type: 'data',  text: 'Renderer',     value: 'Three.js r168 (WebGL)' },
          { type: 'data',  text: 'Motion',       value: 'Framer Motion 11' },
          { type: 'data',  text: 'Particles',    value: 'Canvas 2D — up to 180' },
          { type: 'data',  text: 'Scroll',       value: 'Lenis smooth scroll' },
          { type: 'ok',    text: 'Renderer',     value: 'GPU accelerated' },
          { type: 'ok',    text: 'Performance',  value: 'Target 60 FPS' },
        ]),
    },
    {
      id: 'sys-gravity',
      label: 'Gravity Engine Status',
      description: 'Inspect the live Three.js gravity core',
      category: 'system',
      icon: <Activity size={15} />,
      keywords: ['gravity', 'engine', 'three', 'canvas', 'scene'],
      action: () =>
        ctx.showOutput([
          { type: 'header', text: 'Gravity Engine' },
          { type: 'ok',    text: 'Core Sphere',     value: 'ROTATING' },
          { type: 'ok',    text: 'Orbital Rings',   value: '3 ACTIVE' },
          { type: 'ok',    text: 'Tech Capsules',   value: '18 IN ORBIT' },
          { type: 'ok',    text: 'Project Planets', value: '4 DEPLOYED' },
          { type: 'data',  text: 'Pulse Cycle',     value: '6–8 seconds' },
          { type: 'data',  text: 'Camera',          value: 'Mouse-tracked drift' },
          { type: 'info',  text: 'Gravity never sleeps.' },
        ]),
    },

    // ── Developer ─────────────────────────────────────────────────────────
    {
      id: 'dev-resume',
      label: 'Download Mission File',
      description: 'Download resume PDF',
      category: 'developer',
      icon: <Download size={15} />,
      keywords: ['download', 'resume', 'cv', 'mission', 'file', 'pdf'],
      action: () => {
        const a = document.createElement('a')
        a.href = '/resume.pdf'
        a.download = 'Sanjay_P_Resume.pdf'
        a.click()
      },
    },
    {
      id: 'dev-open-resume',
      label: 'Open Resume',
      description: 'View resume in new tab',
      category: 'developer',
      icon: <ExternalLink size={15} />,
      keywords: ['resume', 'open', 'view', 'pdf'],
      action: () => ctx.openURL('/resume.pdf'),
    },
   {
  id: 'dev-github',
  label: 'Open GitHub',
  description: 'github.com/sanjay652005',
  category: 'developer',
  icon: <Github size={15} />,
  keywords: ['github', 'git', 'code', 'repos', 'source'],
  action: () => ctx.openURL('https://github.com/sanjay652005'),
},
{
  id: 'dev-linkedin',
  label: 'Open LinkedIn',
  description: 'linkedin.com/in/sanjayp-dev',
  category: 'developer',
  icon: <Linkedin size={15} />,
  keywords: ['linkedin', 'connect', 'network', 'profile'],
  action: () =>
    ctx.openURL('https://www.linkedin.com/in/sanjayp-dev'),
},
{
  id: 'dev-email',
  label: 'Send Email',
  description: 'sanjay20050605@gmail.com',
  category: 'developer',
  icon: <Mail size={15} />,
  keywords: ['email', 'mail', 'contact', 'send', 'hire'],
  action: () => ctx.openURL('mailto:sanjay20050605@gmail.com'),
},

    // ── Hidden / Easter egg commands ──────────────────────────────────────
    {
      id: 'hidden-gravity',
      label: 'gravity',
      description: 'Check gravity engine',
      category: 'hidden',
      icon: <Activity size={15} />,
      keywords: ['gravity'],
      action: () =>
        ctx.showOutput([
          { type: 'header', text: '> gravity' },
          { type: 'ok',   text: 'Gravity Engine', value: 'STABLE' },
          { type: 'info', text: 'All orbital mechanics nominal.' },
          { type: 'info', text: 'Gravity never sleeps.' },
        ]),
    },
    {
      id: 'hidden-version',
      label: 'version',
      description: 'OS version info',
      category: 'hidden',
      icon: <Info size={15} />,
      keywords: ['version', 'ver'],
      action: () =>
        ctx.showOutput([
          { type: 'header', text: '> version' },
          { type: 'data',  text: 'Neural Gravity OS', value: 'v2.0' },
          { type: 'data',  text: 'Build',             value: 'Production' },
          { type: 'data',  text: 'Stack',             value: 'React + Vite + Three.js' },
          { type: 'data',  text: 'Author',            value: 'Sanjay P' },
        ]),
    },
    {
      id: 'hidden-help',
      label: 'help',
      description: 'Show all available commands',
      category: 'hidden',
      icon: <Terminal size={15} />,
      keywords: ['help', '?', 'commands'],
      action: () =>
        ctx.showOutput([
          { type: 'header', text: '> help — All Commands' },
          { type: 'info', text: 'Navigation: origin, core-system, modules, mission-log, transmission' },
          { type: 'info', text: 'Modules: skillswap, quizarena, notesmind, java-auth' },
          { type: 'info', text: 'System: status, diagnostics, gravity, boot' },
          { type: 'info', text: 'Developer: github, linkedin, email, resume' },
          { type: 'info', text: 'Hidden: gravity · version · help · clear · about' },
        ]),
    },
    {
      id: 'hidden-clear',
      label: 'clear',
      description: 'Clear recent command history',
      category: 'hidden',
      icon: <Trash2 size={15} />,
      keywords: ['clear', 'cls', 'reset'],
      action: () => {
        ctx.clearRecent()
        ctx.showOutput([
          { type: 'header', text: '> clear' },
          { type: 'ok',   text: 'Recent commands cleared.' },
        ])
      },
    },
    {
      id: 'hidden-about',
      label: 'about',
      description: 'About Sanjay & Neural Gravity OS',
      category: 'hidden',
      icon: <Globe size={15} />,
      keywords: ['about', 'sanjay', 'neural', 'who'],
      action: () =>
        ctx.showOutput([
          { type: 'header', text: '> about' },
          { type: 'data',  text: 'Developer',   value: 'Sanjay P' },
          { type: 'data',  text: 'Role',         value: 'Java Backend · Full Stack Dev' },
          { type: 'data',  text: 'College',      value: 'AMACE — Anna University' },
          { type: 'data',  text: 'Graduating',   value: '2026' },
          { type: 'data',  text: 'Stack',        value: 'Java · Spring Boot · MERN' },
          { type: 'data',  text: 'Flagship',     value: 'SkillSwap (9k+ lines)' },
          { type: 'info',  text: 'Building scalable systems powered by intelligent architecture.' },
          { type: 'info',  text: 'Neural Gravity OS — Gravity Never Sleeps.' },
        ]),
    },
  ]
}

// ─── Fuzzy match (simple scoring) ────────────────────────────────────────────

function fuzzyScore(query: string, cmd: Command): number {
  const q = query.toLowerCase().trim()
  if (!q) return 0
  const label = cmd.label.toLowerCase()
  const desc  = (cmd.description ?? '').toLowerCase()
  const keys  = cmd.keywords.join(' ').toLowerCase()
  const full  = `${label} ${desc} ${keys}`

  // Exact match in label = highest
  if (label === q) return 100
  if (label.startsWith(q)) return 90
  if (label.includes(q)) return 80
  // Keyword exact
  if (cmd.keywords.some(k => k === q)) return 75
  if (cmd.keywords.some(k => k.startsWith(q))) return 65
  // Partial in description / keywords
  if (desc.includes(q)) return 50
  if (keys.includes(q)) return 45
  // Character sequence match
  let i = 0; let j = 0
  while (i < full.length && j < q.length) {
    if (full[i] === q[j]) j++
    i++
  }
  if (j === q.length) return 30
  return 0
}

// ─── Recent commands (localStorage) ──────────────────────────────────────────

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveRecent(ids: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(0, MAX_RECENT)))
  } catch {}
}

// ─── Output View ─────────────────────────────────────────────────────────────

function OutputView({
  lines,
  onBack,
}: {
  lines: OutputLine[]
  onBack: () => void
}) {
  const colorFor = (type: OutputLine['type']) => {
    switch (type) {
      case 'header': return GOLD
      case 'ok':     return '#4ADE80'
      case 'warn':   return '#FB923C'
      case 'info':   return 'rgba(255,255,255,0.45)'
      case 'data':   return 'rgba(255,255,255,0.65)'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="px-4 pb-4"
    >
      <div
        className="rounded-xl p-4 font-mono text-xs space-y-1.5"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {lines.map((line, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
          >
            {line.type === 'header' ? (
              <span style={{ color: GOLD, letterSpacing: '0.1em' }}>{line.text}</span>
            ) : (
              <>
                <span style={{ color: colorFor(line.type), minWidth: 8 }}>
                  {line.type === 'ok' ? '✓' : line.type === 'warn' ? '!' : line.type === 'data' ? '·' : '>'}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.5)', flex: 1 }}>{line.text}</span>
                {line.value && (
                  <span style={{ color: colorFor(line.type), marginLeft: 'auto', flexShrink: 0 }}>
                    {line.value}
                  </span>
                )}
              </>
            )}
          </motion.div>
        ))}
      </div>
      <button
        onClick={onBack}
        className="mt-3 text-xs font-mono flex items-center gap-1.5 transition-colors"
        style={{ color: 'rgba(255,255,255,0.25)' }}
        onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
      >
        ← Back to commands
      </button>
    </motion.div>
  )
}

// ─── Command Item ─────────────────────────────────────────────────────────────

function CommandItem({
  cmd,
  isActive,
  onHover,
  onClick,
}: {
  cmd: Command
  isActive: boolean
  onHover: () => void
  onClick: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isActive) ref.current?.scrollIntoView({ block: 'nearest' })
  }, [isActive])

  return (
    <button
      ref={ref}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl relative transition-colors text-left group"
      style={{
        background: isActive ? 'rgba(255,213,79,0.07)' : 'transparent',
        border: isActive ? '1px solid rgba(255,213,79,0.12)' : '1px solid transparent',
      }}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      {/* Icon */}
      <span
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
        style={{
          background: isActive ? 'rgba(255,213,79,0.12)' : 'rgba(255,255,255,0.05)',
          color: isActive ? GOLD : 'rgba(255,255,255,0.35)',
        }}
      >
        {cmd.icon}
      </span>

      {/* Label + description */}
      <div className="flex flex-col min-w-0 flex-1">
        <span
          className="text-sm font-medium truncate"
          style={{ color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.65)' }}
        >
          {cmd.label}
        </span>
        {cmd.description && (
          <span
            className="text-xs truncate"
            style={{ color: 'rgba(255,255,255,0.28)' }}
          >
            {cmd.description}
          </span>
        )}
      </div>

      {/* Category pill */}
      <span
        className="text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:inline"
        style={{
          background: isActive ? 'rgba(255,213,79,0.1)' : 'rgba(255,255,255,0.04)',
          color: isActive ? 'rgba(255,213,79,0.7)' : 'rgba(255,255,255,0.2)',
          border: isActive ? '1px solid rgba(255,213,79,0.15)' : '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {CATEGORY_LABELS[cmd.category] ?? cmd.category}
      </span>

      {/* Arrow chevron */}
      {isActive && (
        <ChevronRight size={13} style={{ color: 'rgba(255,213,79,0.5)', flexShrink: 0 }} />
      )}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface NeuralCommandCenterProps {
  /** Called when the user selects a project — should open ProjectWorkspace */
  onOpenProject?: (projectId: string) => void
}

export interface NeuralCommandCenterHandle {
  open: () => void
}

const NeuralCommandCenter = forwardRef<NeuralCommandCenterHandle, NeuralCommandCenterProps>(function NeuralCommandCenter({
  onOpenProject,
}, ref) {
  const [open, setOpen]             = useState(false)
  const [query, setQuery]           = useState('')
  const [activeIdx, setActiveIdx]   = useState(0)
  const [recentIds, setRecentIds]   = useState<string[]>(loadRecent)
  const [output, setOutput]         = useState<OutputLine[] | null>(null)

  const inputRef    = useRef<HTMLInputElement>(null)
  const listRef     = useRef<HTMLDivElement>(null)
  const reduced     = useReducedMotion()
  const { pushNotification, pushCommand } = useOS()

  // ── Command context ──────────────────────────────────────────────────────
  const ctx: CommandContext = useMemo(() => ({
    navigate: (href: string) => {
      setOpen(false)
      setTimeout(() => {
        const el = document.querySelector(href)
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    },
    openProject: (id: string) => {
      setOpen(false)
      setTimeout(() => onOpenProject?.(id), 200)
    },
    showOutput: (lines: OutputLine[]) => setOutput(lines),
    clearRecent: () => {
      setRecentIds([])
      saveRecent([])
    },
    openURL: (url: string) => {
      setOpen(false)
      window.open(url, url.startsWith('mailto') ? '_self' : '_blank', 'noopener noreferrer')
    },
  }), [onOpenProject])

  const allCommands = useMemo(() => buildCommands(ctx), [ctx])

  // ── Filtered / recent list ───────────────────────────────────────────────
  const displayed = useMemo<Command[]>(() => {
    const q = query.trim()

    // Hidden command exact match
    const hiddenMatch = allCommands.find(
      c => c.category === 'hidden' && c.keywords.includes(q.toLowerCase())
    )
    if (hiddenMatch) return [hiddenMatch]

    if (!q) {
      // Show recents first, then a default set
      const recentCmds = recentIds
        .map(id => allCommands.find(c => c.id === id))
        .filter(Boolean) as Command[]
      if (recentCmds.length > 0) return recentCmds
      // Default: first 6 non-hidden commands
      return allCommands.filter(c => c.category !== 'hidden').slice(0, 6)
    }

    return allCommands
      .filter(c => c.category !== 'hidden')
      .map(c => ({ cmd: c, score: fuzzyScore(q, c) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ cmd }) => cmd)
  }, [query, allCommands, recentIds])

  // Group displayed commands by category
  const grouped = useMemo<Array<{ category: CommandCategory; commands: Command[] }>>(() => {
    const map = new Map<CommandCategory, Command[]>()
    for (const cmd of displayed) {
      const list = map.get(cmd.category) ?? []
      list.push(cmd)
      map.set(cmd.category, list)
    }
    return Array.from(map.entries()).map(([category, commands]) => ({ category, commands }))
  }, [displayed])

  // Flat list for keyboard nav
  const flatList = useMemo(() => displayed, [displayed])

  // Reset active index when results change
  useEffect(() => { setActiveIdx(0) }, [query])

  // ── Open / close ─────────────────────────────────────────────────────────
  const doOpen = useCallback(() => {
    setOpen(true)
    setQuery('')
    setOutput(null)
    setActiveIdx(0)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const doClose = useCallback(() => {
    setOpen(false)
    setQuery('')
    setOutput(null)
  }, [])

  // Expose open() for external triggers (Ctrl+K from App shortcut handler)
  useImperativeHandle(ref, () => ({ open: doOpen }), [doOpen])

  // ── Global keyboard handler ───────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        open ? doClose() : doOpen()
      }
      if (!open) return
      switch (e.key) {
        case 'Escape': doClose(); break
        case 'ArrowDown':
          e.preventDefault()
          setActiveIdx(i => Math.min(i + 1, flatList.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIdx(i => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (flatList[activeIdx]) executeCommand(flatList[activeIdx])
          break
        case 'Tab':
          e.preventDefault()
          setActiveIdx(i => (i + 1) % Math.max(flatList.length, 1))
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, doClose, doOpen, flatList, activeIdx])

  // ── Execute ───────────────────────────────────────────────────────────────
  const executeCommand = useCallback((cmd: Command) => {
    // Push to recent (non-hidden only)
    if (cmd.category !== 'hidden') {
      setRecentIds(prev => {
        const next = [cmd.id, ...prev.filter(id => id !== cmd.id)]
        saveRecent(next)
        return next
      })
      pushCommand(cmd.label)
      pushNotification(`Command executed: ${cmd.label}`, 'system', '⌘')
    }
    cmd.action(ctx)
  }, [ctx, pushCommand, pushNotification])

  // ── Animations ────────────────────────────────────────────────────────────
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const panelVariants = {
    hidden: { opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : -8 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      scale: reduced ? 1 : 0.97,
      y: reduced ? 0 : -4,
      filter: reduced ? 'none' : 'blur(4px)',
      transition: { duration: 0.15, ease: 'easeIn' },
    },
  }

  const isShowingRecent = !query.trim() && recentIds.length > 0

  return (
    <>
      {/* ── Trigger hint (keyboard shortcut visible in nav area) ─────────── */}
      <button
        onClick={doOpen}
        className="hidden md:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg transition-all"
        style={{
          color: 'rgba(255,255,255,0.3)',
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.03)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(255,213,79,0.2)'
          e.currentTarget.style.color = 'rgba(255,213,79,0.6)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
        }}
        aria-label="Open command center"
      >
        <Terminal size={11} />
        <span>CMD</span>
        <kbd
          className="flex items-center gap-0.5"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <span>⌘</span><span>K</span>
        </kbd>
      </button>

      {/* ── Portal overlay ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[9000]"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              onClick={doClose}
              aria-hidden
            />

            {/* Panel */}
            <motion.div
              className="fixed z-[9001] left-1/2 top-[12vh]"
              style={{ translateX: '-50%', width: '100%', maxWidth: 700, padding: '0 16px' }}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Neural Command Center"
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(9,9,9,0.95)',
                  border: '1px solid rgba(255,213,79,0.15)',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,213,79,0.05), inset 0 1px 0 rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(40px)',
                }}
              >
                {/* ── Search bar ─────────────────────────────────────────── */}
                <div
                  className="flex items-center gap-3 px-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 56 }}
                >
                  <Terminal size={16} style={{ color: 'rgba(255,213,79,0.5)', flexShrink: 0 }} />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => { setQuery(e.target.value); setOutput(null) }}
                    placeholder="Search Neural Gravity OS..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="Command search"
                  />
                  {query && (
                    <button
                      onClick={() => { setQuery(''); setOutput(null); inputRef.current?.focus() }}
                      className="p-1 rounded-lg transition-colors"
                      style={{ color: 'rgba(255,255,255,0.2)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    onClick={doClose}
                    className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                    style={{
                      color: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.2)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    }}
                    aria-label="Close command center"
                  >
                    <kbd className="text-xs font-mono" style={{ fontSize: 10 }}>ESC</kbd>
                  </button>
                </div>

                {/* ── Body ───────────────────────────────────────────────── */}
                <div
                  ref={listRef}
                  style={{ maxHeight: '55vh', overflowY: 'auto' }}
                  className="scrollbar-thin"
                >
                  <AnimatePresence mode="wait">
                    {output ? (
                      <OutputView
                        key="output"
                        lines={output}
                        onBack={() => setOutput(null)}
                      />
                    ) : flatList.length === 0 ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-6 py-10 text-center"
                      >
                        <p className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
                          No commands found for "{query}"
                        </p>
                        <p className="text-xs mt-2 font-mono" style={{ color: 'rgba(255,255,255,0.12)' }}>
                          Try: skills · github · resume · status
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-2 px-2"
                      >
                        {/* Recent heading */}
                        {isShowingRecent && (
                          <div
                            className="flex items-center gap-2 px-3 py-1.5 mb-1"
                          >
                            <Clock size={11} style={{ color: 'rgba(255,255,255,0.2)' }} />
                            <span className="text-xs font-mono tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.18)' }}>
                              Recent
                            </span>
                          </div>
                        )}

                        {grouped.map(({ category, commands }) => {
                          const globalOffset = flatList.indexOf(commands[0])
                          return (
                            <div key={category} className="mb-1">
                              {/* Category label (only when searching) */}
                              {query.trim() && (
                                <div
                                  className="px-3 py-1 text-xs font-mono tracking-widest uppercase"
                                  style={{ color: 'rgba(255,255,255,0.18)' }}
                                >
                                  {CATEGORY_LABELS[category]}
                                </div>
                              )}
                              {commands.map((cmd, localIdx) => {
                                const idx = globalOffset + localIdx
                                return (
                                  <CommandItem
                                    key={cmd.id}
                                    cmd={cmd}
                                    isActive={activeIdx === idx}
                                    onHover={() => setActiveIdx(idx)}
                                    onClick={() => executeCommand(cmd)}
                                  />
                                )
                              })}
                            </div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Footer ─────────────────────────────────────────────── */}
                <div
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {/* OS identity */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{
                        background: 'radial-gradient(circle at 35% 35%, #FFE082, #FFD54F)',
                        boxShadow: '0 0 6px rgba(255,213,79,0.5)',
                      }}
                    />
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-mono" style={{ color: 'rgba(255,213,79,0.6)' }}>
                        Neural Gravity OS
                      </span>
                      <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        v2.0
                      </span>
                    </div>
                    <span
                      className="hidden sm:flex items-center gap-1 text-xs font-mono"
                      style={{ color: 'rgba(74,222,128,0.6)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                      Gravity Engine Online
                    </span>
                  </div>

                  {/* Keyboard hints */}
                  <div className="hidden sm:flex items-center gap-3">
                    {[
                      { key: '↑↓', label: 'navigate' },
                      { key: '↵',  label: 'select' },
                      { key: 'ESC', label: 'close' },
                    ].map(({ key, label }) => (
                      <span key={key} className="flex items-center gap-1 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        <kbd
                          className="px-1.5 py-0.5 rounded text-xs"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.35)',
                            fontSize: 10,
                          }}
                        >
                          {key}
                        </kbd>
                        <span style={{ fontSize: 10 }}>{label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
})

export default NeuralCommandCenter
