/**
 * ModuleLaunchContext — Phase 9: Gravity Module Launch
 *
 * Orchestrates the 5-phase launch sequence:
 *   IDLE → GRAVITY_BUILD → ESCAPE → DOCKING → EXPANDED → CLOSING
 *
 * Central state so the card, particles, workspace, and status bar
 * all share the same phase without prop-drilling.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react'

// ─── Phase Machine ─────────────────────────────────────────────────────────────

export type LaunchPhase =
  | 'IDLE'
  | 'GRAVITY_BUILD'   // Step 2 — card lifts, particles pull in (500–700ms)
  | 'ESCAPE'          // Step 3 — card travels to center (400ms)
  | 'DOCKING'         // Step 4 — docking sequence text (800ms)
  | 'EXPANDED'        // Step 5 — workspace is open
  | 'CLOSING'         // Reverse sequence

export interface LaunchOrigin {
  /** Bounding rect of the card that was clicked */
  rect: DOMRect
  /** Project id */
  projectId: string
  /** Where the launch was initiated from */
  source: 'card' | 'command'
}

interface ModuleLaunchContextValue {
  phase: LaunchPhase
  origin: LaunchOrigin | null
  activeProjectId: string | null
  dockingStep: number        // 0–2, which docking label is shown
  initiatelaunch: (projectId: string, rect: DOMRect, source?: 'card' | 'command') => void
  initiateClose: () => void
  onWorkspaceReady: () => void   // called by workspace when it's fully expanded
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ModuleLaunchContext = createContext<ModuleLaunchContextValue | null>(null)

export function useModuleLaunch() {
  const ctx = useContext(ModuleLaunchContext)
  if (!ctx) throw new Error('useModuleLaunch must be inside ModuleLaunchProvider')
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ModuleLaunchProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<LaunchPhase>('IDLE')
  const [origin, setOrigin] = useState<LaunchOrigin | null>(null)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [dockingStep, setDockingStep] = useState(0)
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => {
    timerRefs.current.forEach(clearTimeout)
    timerRefs.current = []
  }

  const schedule = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timerRefs.current.push(t)
    return t
  }

  const initiatelaunch = useCallback((projectId: string, rect: DOMRect, source: 'card' | 'command' = 'card') => {
    clearTimers()
    setOrigin({ rect, projectId, source })
    setActiveProjectId(projectId)
    setDockingStep(0)

    // Phase sequence
    setPhase('GRAVITY_BUILD')

    // Step 3 — escape after gravity build
    schedule(() => setPhase('ESCAPE'), 600)

    // Step 4 — docking after travel
    schedule(() => {
      setPhase('DOCKING')
      setDockingStep(0)
    }, 600 + 500)

    schedule(() => setDockingStep(1), 600 + 500 + 280)
    schedule(() => setDockingStep(2), 600 + 500 + 560)

    // Step 5 — expand workspace
    schedule(() => setPhase('EXPANDED'), 600 + 500 + 900)
  }, [])

  const initiateClose = useCallback(() => {
    clearTimers()
    setPhase('CLOSING')
    schedule(() => {
      setPhase('IDLE')
      setActiveProjectId(null)
      setOrigin(null)
    }, 700)
  }, [])

  const onWorkspaceReady = useCallback(() => {
    // Called by workspace once its entrance animation is done
    // Currently used to mark fully expanded — future phases can hook here
  }, [])

  return (
    <ModuleLaunchContext.Provider value={{
      phase,
      origin,
      activeProjectId,
      dockingStep,
      initiatelaunch,
      initiateClose,
      onWorkspaceReady,
    }}>
      {children}
    </ModuleLaunchContext.Provider>
  )
}
