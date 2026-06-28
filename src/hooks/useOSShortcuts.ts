import { useEffect } from 'react'

interface ShortcutOptions {
  onCommandCenter: () => void
  onClose: () => void
  onHome: () => void
  onMissionControl: () => void
}

export function useOSShortcuts({ onCommandCenter, onClose, onHome, onMissionControl }: ShortcutOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+K — Command Center
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        onCommandCenter()
        return
      }

      // Ctrl+H — Home
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault()
        onHome()
        return
      }

      // Ctrl+M — Mission Control
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault()
        onMissionControl()
        return
      }

      // Escape — close
      if (e.key === 'Escape') {
        onClose()
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCommandCenter, onClose, onHome, onMissionControl])
}
