/**
 * ModuleLaunchOverlay — Phase 9: Gravity Module Launch
 *
 * Handles the visual cinematic transition between a project card and the workspace.
 * Renders above everything during GRAVITY_BUILD, ESCAPE, and DOCKING phases.
 *
 * Phase flow:
 *   GRAVITY_BUILD → card lifts + glows at origin position
 *   ESCAPE        → card travels to screen center on a curved path
 *   DOCKING       → docking sequence text
 *   EXPANDED      → workspace takes over, overlay hides
 *   CLOSING       → workspace compresses back to origin
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useModuleLaunch } from '@/contexts/ModuleLaunchContext'
import { useGravity } from '@/contexts/GravityContext'
import { PROJECTS } from '@/constants'

const DOCKING_LABELS = [
  'Synchronizing Gravity...',
  'Docking Module...',
  'Workspace Initializing...',
]

// ─── Docking Sequence ─────────────────────────────────────────────────────────

function DockingSequence({ color }: { color: string }) {
  const { dockingStep } = useModuleLaunch()

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {/* Pulse orb */}
      <div className="relative mb-2" style={{ width: 48, height: 48 }}>
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `1px solid ${color}`, opacity: 0.2 }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ inset: 8, border: `1px solid ${color}`, opacity: 0.4 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full"
          style={{ background: `${color}18` }}
        >
          <span style={{ fontSize: 16, color }}>◈</span>
        </div>
      </div>

      {/* Docking steps */}
      <div className="flex flex-col items-center gap-1.5">
        {DOCKING_LABELS.map((label, i) => (
          <motion.div
            key={label}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: dockingStep >= i ? 1 : 0.15, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: i * 0.05 }}
          >
            <motion.div
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{
                background: dockingStep > i ? '#4ADE80' : dockingStep === i ? color : 'rgba(255,255,255,0.15)',
                boxShadow: dockingStep >= i ? `0 0 4px ${dockingStep > i ? '#4ADE80' : color}` : 'none',
              }}
            />
            <span
              className="text-xs font-mono"
              style={{
                color: dockingStep > i
                  ? 'rgba(255,255,255,0.35)'
                  : dockingStep === i
                  ? 'rgba(255,255,255,0.75)'
                  : 'rgba(255,255,255,0.2)',
                letterSpacing: '0.05em',
              }}
            >
              {label}
            </span>
            {dockingStep > i && (
              <span className="text-xs font-mono" style={{ color: '#4ADE80' }}>✓</span>
            )}
            {dockingStep === i && (
              <motion.span
                className="text-xs font-mono"
                style={{ color }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                ...
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Traveling Card Ghost ──────────────────────────────────────────────────────
// During ESCAPE phase — a ghost of the card travels from origin to center

function TravelingCard({
  project,
  origin,
}: {
  project: typeof PROJECTS[number]
  origin: DOMRect
}) {
  const reduced = useReducedMotion()

  // Compute target: viewport center
  const vw = window.innerWidth
  const vh = window.innerHeight

  // Origin position (card center)
  const fromX = origin.left + origin.width / 2
  const fromY = origin.top  + origin.height / 2

  // Target: screen center
  const toX = vw / 2
  const toY = vh / 2

  // Card rendered at screen center, translated from origin
  // Curved path via bezier approximation with y keyframes
  const dx = toX - fromX
  const dy = toY - fromY

  // Mid-point elevated for arc
  const arcY = dy * 0.35 // lift through arc

  if (reduced) return null

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: fromX - 140,  // card half-width approximation
        top:  fromY - 80,   // card half-height approximation
        width: 280,
        zIndex: 200,
      }}
      initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
      animate={{
        x: [0, dx * 0.45 + 15, dx],
        y: [0, dy * 0.35 - 40, dy],
        scale: [1, 1.04, 0.92],
        rotate: [0, 1.5, 0],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 0.48,
        ease: [0.22, 1, 0.36, 1],
        times: [0, 0.5, 1],
      }}
    >
      {/* Minimal card ghost */}
      <div
        className="rounded-2xl px-5 py-4"
        style={{
          background: 'linear-gradient(135deg, rgba(16,14,9,0.98) 0%, rgba(10,10,10,0.98) 100%)',
          border: `1px solid ${project.color}40`,
          boxShadow: `0 0 30px ${project.color}25, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono mb-2"
          style={{ background: `${project.color}15`, color: project.color }}
        >
          {project.category}
        </div>
        <div className="text-sm font-bold text-white/90" style={{ letterSpacing: '-0.01em' }}>
          {project.title}
        </div>
        <div className="text-xs text-white/35 mt-0.5">{project.subtitle}</div>

        {/* Glow line at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px rounded-b-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${project.color}60, transparent)` }}
        />
      </div>
    </motion.div>
  )
}

// ─── Main Overlay ─────────────────────────────────────────────────────────────

export default function ModuleLaunchOverlay() {
  const { phase, origin, activeProjectId } = useModuleLaunch()
  const reduced = useReducedMotion()

  const project = PROJECTS.find(p => p.id === activeProjectId) ?? null
  const isVisible = phase === 'ESCAPE' || phase === 'DOCKING'

  if (!project || !origin) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 150 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* ESCAPE — traveling card */}
          <AnimatePresence>
            {phase === 'ESCAPE' && !reduced && (
              <TravelingCard project={project as typeof PROJECTS[number] & object} origin={origin.rect} />
            )}
          </AnimatePresence>

          {/* DOCKING — center overlay */}
          <AnimatePresence>
            {phase === 'DOCKING' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <DockingSequence color={project.color} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
