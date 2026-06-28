import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  message: string
  type?: 'success' | 'info' | 'system'
  icon?: string
}

export interface OSState {
  currentSection: string
  isLoading: boolean
  soundEnabled: boolean
  fps: number
  recentCommands: string[]
  lastOpenedModule: string | null
  notifications: Notification[]
}

interface OSContextValue extends OSState {
  setCurrentSection: (s: string) => void
  setIsLoading: (v: boolean) => void
  toggleSound: () => void
  pushNotification: (msg: string, type?: Notification['type'], icon?: string) => void
  pushCommand: (cmd: string) => void
  setLastOpenedModule: (id: string | null) => void
}

// ─── Context ─────────────────────────────────────────────────────────────────

const OSContext = createContext<OSContextValue | null>(null)

export function useOS() {
  const ctx = useContext(OSContext)
  if (!ctx) throw new Error('useOS must be inside OSProvider')
  return ctx
}

// ─── Session storage helpers ─────────────────────────────────────────────────

function readSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeSession(key: string, value: unknown) {
  try { sessionStorage.setItem(key, JSON.stringify(value)) } catch { /* noop */ }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function OSProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSectionState] = useState<string>(
    readSession('ngos_section', 'HERO')
  )
  const [isLoading, setIsLoadingState] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return localStorage.getItem('ngos_sound') === 'true' } catch { return false }
  })
  const [fps, setFps] = useState(60)
  const [recentCommands, setRecentCommands] = useState<string[]>(
    readSession('ngos_commands', [])
  )
  const [lastOpenedModule, setLastOpenedModuleState] = useState<string | null>(
    readSession('ngos_module', null)
  )
  const [notifications, setNotifications] = useState<Notification[]>([])

  // FPS counter
  const frameRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  useEffect(() => {
    let raf: number
    const tick = () => {
      frameRef.current++
      const now = performance.now()
      if (now - lastTimeRef.current >= 1000) {
        setFps(frameRef.current)
        frameRef.current = 0
        lastTimeRef.current = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const setCurrentSection = useCallback((s: string) => {
    setCurrentSectionState(s)
    writeSession('ngos_section', s)
  }, [])

  const setIsLoading = useCallback((v: boolean) => setIsLoadingState(v), [])

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev
      try { localStorage.setItem('ngos_sound', String(next)) } catch { /* noop */ }
      return next
    })
  }, [])

  const pushNotification = useCallback((msg: string, type: Notification['type'] = 'success', icon = '✓') => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev.slice(-4), { id, message: msg, type, icon }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3200)
  }, [])

  const pushCommand = useCallback((cmd: string) => {
    setRecentCommands(prev => {
      const next = [cmd, ...prev.filter(c => c !== cmd)].slice(0, 8)
      writeSession('ngos_commands', next)
      return next
    })
  }, [])

  const setLastOpenedModule = useCallback((id: string | null) => {
    setLastOpenedModuleState(id)
    writeSession('ngos_module', id)
  }, [])

  return (
    <OSContext.Provider value={{
      currentSection, setCurrentSection,
      isLoading, setIsLoading,
      soundEnabled, toggleSound,
      fps,
      recentCommands, pushCommand,
      lastOpenedModule, setLastOpenedModule,
      notifications, pushNotification,
    }}>
      {children}
    </OSContext.Provider>
  )
}
