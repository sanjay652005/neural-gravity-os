import { AnimatePresence, motion } from 'framer-motion'
import { useOS } from '@/contexts/OSContext'

export default function NotificationCenter() {
  const { notifications } = useOS()

  return (
    <div className="fixed top-10 right-4 z-[200] flex flex-col gap-2 pointer-events-none" style={{ marginTop: 6 }}>
      <AnimatePresence initial={false}>
        {notifications.map(n => (
          <motion.div
            key={n.id}
            layout
            initial={{ opacity: 0, x: 32, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: 32, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl select-none"
            style={{
              background: 'rgba(14,14,14,0.92)',
              border: '1px solid rgba(255,213,79,0.14)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,213,79,0.04) inset',
              minWidth: 220,
              maxWidth: 300,
            }}
          >
            {/* Icon */}
            <div
              className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs"
              style={{ background: 'rgba(255,213,79,0.12)', color: '#FFD54F' }}
            >
              {n.icon ?? '✓'}
            </div>

            {/* Message */}
            <span className="text-[11px] font-mono text-white/75 tracking-wide flex-1">
              {n.message}
            </span>

            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-[1px] rounded-b-xl"
              style={{ background: 'rgba(255,213,79,0.4)' }}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3.0, ease: 'linear' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
