/**
 * GravityNotification
 *
 * Separate from the OS notification center — this is a full-panel
 * system alert styled to match the Interstellar / Nothing OS aesthetic.
 * Two lines: title + subtitle, with a slow progress bar.
 */

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useGravity } from '@/contexts/GravityContext'

interface GravityNotifState {
  id: number
  enabled: boolean
}

export default function GravityNotification() {
  const { gravityEnabled } = useGravity()
  const [notif, setNotif] = useState<GravityNotifState | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Skip the initial render — only fire on actual toggles
    if (!initialized) {
      setInitialized(true)
      return
    }
    setNotif({ id: Date.now(), enabled: gravityEnabled })
    const t = setTimeout(() => setNotif(null), 4000)
    return () => clearTimeout(t)
  }, [gravityEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="fixed z-[300] pointer-events-none"
      style={{ top: 52, right: 16 }}
    >
      <AnimatePresence initial={false}>
        {notif && (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 44, scale: 0.93 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 44, scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            style={{
              background: 'rgba(10,10,10,0.96)',
              border: '1px solid rgba(255,213,79,0.18)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              boxShadow:
                '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,213,79,0.05) inset',
              borderRadius: 14,
              minWidth: 240,
              maxWidth: 300,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div className="px-4 py-3 flex items-start gap-3">
              {/* Icon */}
              <div
                className="flex-shrink-0 mt-0.5"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'rgba(255,213,79,0.12)',
                  border: '1px solid rgba(255,213,79,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
                  style={{
                    fontSize: 12,
                    color: '#FFD54F',
                    fontFamily: 'monospace',
                    lineHeight: 1,
                  }}
                >
                  {notif.enabled ? '⌬' : '○'}
                </motion.span>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-0.5 flex-1">
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: 'monospace',
                    color: 'rgba(255,213,79,0.5)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  SYSTEM
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.9)',
                    letterSpacing: '0.01em',
                    lineHeight: 1.3,
                  }}
                >
                  {notif.enabled ? 'Gravity Override Successful' : 'Gravity Restored'}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'monospace',
                    letterSpacing: '0.04em',
                  }}
                >
                  {notif.enabled
                    ? 'Anti-Gravity Engine Activated'
                    : 'Standard Physics Resumed'}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <motion.div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: 1.5,
                background:
                  'linear-gradient(90deg, rgba(255,213,79,0.6) 0%, rgba(255,179,0,0.3) 100%)',
                borderRadius: '0 0 0 14px',
              }}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3.8, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
