/**
 * Gravity Zone System — Neural Gravity OS Phase 9
 *
 * Each major section of the portfolio exists in its own gravitational environment.
 * The visitor travels between zones as they scroll.
 *
 * Design Philosophy:
 * "The user should never consciously notice the changes.
 *  They should simply feel: This section behaves differently."
 */

export type ZoneId = 'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'contact'

export interface GravityZoneConfig {
  id: ZoneId
  name: string
  state: string

  /** 0→1 — overall field intensity. Scales most other effects. */
  gravityStrength: number

  /** Particle movement speed multiplier. 1.0 = baseline. */
  particleSpeed: number

  /** Three.js orbit speed multiplier (Hero scene). */
  orbitSpeed: number

  /** Floating amplitude multiplier for elements using useGravityField. */
  floatAmplitude: number

  /** Magnetic force multiplier for MagneticElement and skill cards. */
  magneticForce: number

  /** Canvas ambient glow intensity 0→1 — affects constellation line alpha. */
  ambientGlow: number

  /** Cursor influence radius on particles, in px. */
  cursorRadius: number

  /** Cursor pull strength on particles. */
  cursorStrength: number

  /** Pulse interval range in ms [min, max]. */
  pulseInterval: [number, number]
}

// ─── Zone Definitions ─────────────────────────────────────────────────────────

export const GRAVITY_ZONES: Record<ZoneId, GravityZoneConfig> = {
  /**
   * ZONE 1 — HERO: Planetary
   * Stable orbits. Calm particles. Slow floating. Large orbit radius. Warm golden glow.
   * The user is entering the system.
   */
  hero: {
    id: 'hero',
    name: 'HERO',
    state: 'Planetary',
    gravityStrength: 1.0,
    particleSpeed: 1.0,
    orbitSpeed: 1.0,
    floatAmplitude: 1.0,
    magneticForce: 1.0,
    ambientGlow: 1.0,
    cursorRadius: 140,
    cursorStrength: 0.012,
    pulseInterval: [12000, 16000],
  },

  /**
   * ZONE 2 — ABOUT: Neural
   * Mission Control becomes dominant. Neural Core gains stronger influence.
   * Nearby particles orbit the Core. Gravity feels intelligent.
   */
  about: {
    id: 'about',
    name: 'ORIGIN',
    state: 'Neural',
    gravityStrength: 1.15,
    particleSpeed: 0.8,        // Particles slow — they feel purposeful, not drifting
    orbitSpeed: 0.7,
    floatAmplitude: 1.2,       // Elements float slightly more — the Core pulls them
    magneticForce: 1.3,        // Neural intelligence — stronger attraction
    ambientGlow: 1.1,
    cursorRadius: 180,         // Wider cursor influence — the field is aware
    cursorStrength: 0.016,
    pulseInterval: [10000, 14000],
  },

  /**
   * ZONE 3 — SKILLS: Magnetic
   * Skill cards become slightly magnetic. Technology icons subtly attract each other.
   * Small physics interactions. Everything remains elegant.
   */
  skills: {
    id: 'skills',
    name: 'CORE SYSTEM',
    state: 'Magnetic',
    gravityStrength: 1.2,
    particleSpeed: 1.1,        // Slightly faster — magnetic energy
    orbitSpeed: 0.8,
    floatAmplitude: 0.7,       // Less float — magnetic systems are more grounded
    magneticForce: 1.8,        // The defining property — strong magnetic pull
    ambientGlow: 0.85,
    cursorRadius: 120,
    cursorStrength: 0.02,
    pulseInterval: [9000, 13000],
  },

  /**
   * ZONE 4 — PROJECTS: Dynamic
   * Project cards gain stronger floating. Hovering creates a local gravity well.
   * Nearby particles orbit the selected module. Workspace launch feels like escaping orbit.
   */
  projects: {
    id: 'projects',
    name: 'MODULES',
    state: 'Dynamic',
    gravityStrength: 1.35,
    particleSpeed: 1.3,        // More energetic
    orbitSpeed: 1.4,           // Faster orbits — dynamic environment
    floatAmplitude: 1.5,       // Cards float strongly
    magneticForce: 1.2,
    ambientGlow: 1.2,
    cursorRadius: 160,
    cursorStrength: 0.022,
    pulseInterval: [8000, 11000],
  },

  /**
   * ZONE 5 — EXPERIENCE: Temporal
   * Timeline nodes pulse gently. Connections slowly brighten.
   * Gravity appears calmer. The feeling is progression.
   */
  experience: {
    id: 'experience',
    name: 'MISSION LOG',
    state: 'Temporal',
    gravityStrength: 0.85,
    particleSpeed: 0.65,       // Slow — the feeling of time passing
    orbitSpeed: 0.55,
    floatAmplitude: 0.8,
    magneticForce: 0.9,        // Weaker — the past is settled
    ambientGlow: 0.75,
    cursorRadius: 100,
    cursorStrength: 0.009,
    pulseInterval: [14000, 18000], // Long, slow pulses — temporal rhythm
  },

  /**
   * ZONE 6 — CONTACT: Communication
   * Signals travel. Tiny pulses move through connection lines.
   * Particles slowly converge toward the send button. Everything feels calm.
   */
  contact: {
    id: 'contact',
    name: 'TRANSMISSION',
    state: 'Communication',
    gravityStrength: 0.9,
    particleSpeed: 0.7,
    orbitSpeed: 0.65,
    floatAmplitude: 0.9,
    magneticForce: 1.1,
    ambientGlow: 0.9,
    cursorRadius: 130,
    cursorStrength: 0.014,
    pulseInterval: [11000, 15000],
  },
}

export const ZONE_SECTION_MAP: Record<string, ZoneId> = {
  'HERO': 'hero',
  'ORIGIN': 'about',
  'CORE SYSTEM': 'skills',
  'MODULES': 'projects',
  'MISSION LOG': 'experience',
  'TRANSMISSION': 'contact',
}

/** How long zone interpolation takes in ms */
export const ZONE_TRANSITION_DURATION = 1000
