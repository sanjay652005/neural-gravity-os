/**
 * Neural Gravity OS — Unified Animation Language
 *
 * Single easing curve throughout: [0.22, 1, 0.36, 1]  (fast-out, slow-in — gravity pull)
 * Duration band: 0.5–0.65s for elements, 0.7–0.8s for containers
 * Stagger: 80–120ms between siblings
 * Movement: 24px vertical, 28px horizontal
 * Scale: 0.97 → 1 (subtle — never dramatic)
 *
 * reduced-motion: all variants collapse to opacity-only fade, zero movement.
 */
import { Variants, Transition } from 'framer-motion'

// ─── Shared easing ─────────────────────────────────────────────────────────────

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const BASE_TRANSITION: Transition = {
  duration: 0.6,
  ease: EASE,
}

// ─── Core reveal variants ──────────────────────────────────────────────────────

/**
 * Primary reveal — element drifts upward 24px into place.
 * Used by: section headings, hero content, standalone blocks.
 */
export const gravityReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.97,
  },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay,
      duration: 0.65,
      ease: EASE,
    },
  }),
}

/**
 * Fade-only — for elements where movement would be distracting.
 * Used by: overlays, status updates, secondary text.
 */
export const gravityFade: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { delay, duration: 0.5, ease: EASE },
  }),
}

/**
 * Left pull — drifts in from left 24px.
 * Used by: left column content, terminal panels.
 */
export const gravityRevealLeft: Variants = {
  hidden: { opacity: 0, x: -24, scale: 0.98 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay, duration: 0.65, ease: EASE },
  }),
}

/**
 * Right pull — drifts in from right 24px.
 * Used by: right column content, form panels.
 */
export const gravityRevealRight: Variants = {
  hidden: { opacity: 0, x: 24, scale: 0.98 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay, duration: 0.65, ease: EASE },
  }),
}

/**
 * Card reveal — slight extra lift for project and milestone cards.
 * Used by: project cards, timeline items, value cards.
 */
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, duration: 0.6, ease: EASE },
  }),
}

/**
 * Chip reveal — small scale pop for skill tiles and tags.
 * Used by: skill chips, tech tags.
 */
export const chipReveal: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 8 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay, duration: 0.4, ease: EASE },
  }),
}

/**
 * Stagger container — orchestrates children via staggerChildren.
 * The container itself is invisible; children carry their own variants.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0,
    },
  },
}

/**
 * staggerItem — paired with staggerContainer.
 * Use as variants on each child inside a staggerContainer.
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE },
  },
}

// ─── Timeline-specific ─────────────────────────────────────────────────────────

/**
 * Timeline line grow — scaleY from 0 to 1 (origin top).
 */
export const timelineLineGrow: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.4, ease: EASE },
  },
}

/**
 * Timeline item — slides in from left as the line reaches it.
 */
export const timelineItem: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.99 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay, duration: 0.6, ease: EASE },
  }),
}

// ─── Workspace-specific ────────────────────────────────────────────────────────

/**
 * Tab content cross-fade — no movement, pure opacity.
 * Keeps workspace feel stable while switching tabs.
 */
export const tabContent: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
}

/**
 * Feature cascade — cards appear in sequence inside workspace.
 */
export const featureCascade: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, duration: 0.45, ease: EASE },
  }),
}
