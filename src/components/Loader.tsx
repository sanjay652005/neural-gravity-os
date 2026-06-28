import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'done'>('loading')
  const reduced = useReducedMotion()

  useEffect(() => {
    // Skip loader entirely for users who prefer reduced motion
    if (reduced) {
      setProgress(100)
      setPhase('done')
      setTimeout(onComplete, 100)
      return
    }
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setPhase('done')
            setTimeout(onComplete, 800)
          }, 400)
          return 100
        }
        return prev + Math.random() * 12 + 3
      })
    }, 80)
    return () => clearInterval(timer)
  }, [onComplete, reduced])

  const messages = [
    'Initializing neural core...',
    'Calibrating gravity engine...',
    'Loading quantum modules...',
    'Establishing connections...',
    'System ready.',
  ]

  const currentMessage = messages[Math.floor((progress / 100) * (messages.length - 1))]

  return (
    <AnimatePresence>
      {phase === 'loading' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090909]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Particle field */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px h-px rounded-full bg-[#FFD54F]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.4 + 0.1,
                }}
                animate={{
                  opacity: [0.1, 0.5, 0.1],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Core glow */}
          <motion.div
            className="relative mb-12"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Outer rings */}
            <motion.div
              className="absolute inset-0 rounded-full border border-[#FFD54F]/20"
              style={{ width: 80, height: 80, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-[#FFD54F]/10"
              style={{ width: 80, height: 80, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
            />

            {/* Core orb */}
            <div className="relative w-10 h-10">
              <div
                className="w-10 h-10 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #FFE082, #FFD54F, #FF8F00)',
                  boxShadow: '0 0 20px rgba(255, 213, 79, 0.6), 0 0 40px rgba(255, 213, 79, 0.3), 0 0 80px rgba(255, 213, 79, 0.1)',
                }}
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div
              className="text-xs tracking-[0.4em] text-[#FFD54F] font-mono mb-3 uppercase"
            >
              Neural Gravity OS
            </div>
            <div className="text-[10px] tracking-[0.25em] text-white/30 font-mono uppercase">
              v1.0.0 — Sanjay P
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="w-48 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="h-px bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FFD54F] to-[#FFB300] rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </motion.div>

          {/* Status message */}
          <motion.div
            key={currentMessage}
            className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {currentMessage}
          </motion.div>

          {/* Progress percentage */}
          <motion.div
            className="mt-2 text-[10px] font-mono text-[#FFD54F]/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(Math.min(progress, 100))}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
