import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { ALL_TECHS } from '@/constants'
import { useGravity } from '@/contexts/GravityContext'

// ─── Gravity Core ──────────────────────────────────────────────────────────────
// Emits a subtle pulse every 6–8 seconds. No explosion — just a quiet
// expansion, soft brightness lift, then a slow return.
function GravityCore() {
  const meshRef   = useRef<THREE.Mesh>(null)
  const glowRef   = useRef<THREE.Mesh>(null)
  const pulseRef  = useRef<THREE.Mesh>(null)   // pulse ripple ring
  const lightRef  = useRef<THREE.PointLight>(null)

  const { gravityEnabled, onPulse } = useGravity()

  // Pulse state: time of last pulse + cycle length (random 6–8 s)
  const pulseState = useRef({ lastPulse: 0, cycle: 7, phase: 0 })

  // When gravity context fires a pulse, sync the 3D pulse
  useEffect(() => {
    if (!gravityEnabled) return
    return onPulse(() => {
      // Trigger 3D pulse by resetting the lastPulse time
      // We use a flag that useFrame picks up next tick
      pulseState.current.lastPulse = -1 // signal immediate fire
    })
  }, [gravityEnabled, onPulse])

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current || !pulseRef.current || !lightRef.current) return
    const t = state.clock.getElapsedTime()
    const ps = pulseState.current

    // ── Decide when to fire next pulse ──
    // lastPulse === -1 means external trigger
    if (ps.lastPulse === -1 || (t - ps.lastPulse > ps.cycle)) {
      ps.lastPulse = t
      ps.cycle = 6 + Math.random() * 2   // 6–8 s
      ps.phase = 0
    }
    const elapsed = t - ps.lastPulse
    // pulse lasts ~2 s total: 0.6s expand, 1.4s fade back
    const pNorm = Math.min(elapsed / 2.0, 1)           // 0→1 over 2 s
    const pUp   = Math.min(elapsed / 0.6, 1)           // quick rise
    const pDown = Math.max((elapsed - 0.6) / 1.4, 0)  // slow decay

    // Pulse ring: expand outward and fade
    const ringScale = 1 + pUp * 1.6 * (1 - pDown * 0.9)
    pulseRef.current.scale.setScalar(ringScale)
    const ringOpacity = Math.max(0, pUp * 0.18 * (1 - pNorm))
    ;(pulseRef.current.material as THREE.MeshBasicMaterial).opacity = ringOpacity

    // Core subtle brightness during pulse — enhanced when gravity engine active
    const pulseBoost = gravityEnabled ? 0.35 : 0.25
    const coreBoost = pUp * pulseBoost * (1 - pDown)
    ;(meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8 + coreBoost

    // Point light breathes with pulse
    lightRef.current.intensity = 4 + pUp * (gravityEnabled ? 2.2 : 1.5) * (1 - pDown)

    // ── Normal idle animation ──
    meshRef.current.rotation.y = t * 0.3
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1
    const s = 1 + Math.sin(t * 1.5) * 0.03
    meshRef.current.scale.setScalar(s)

    // Outer glow breathes independently
    glowRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.06 + coreBoost * 0.3)
    glowRef.current.rotation.y = -t * 0.08
  })

  return (
    <group>
      {/* Pulse ripple ring — expands outward on each cycle */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial
          color="#FFD54F"
          transparent
          opacity={0}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#FFD54F"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Mid glow */}
      <mesh>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshBasicMaterial
          color="#FFB300"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshStandardMaterial
          color="#FFD54F"
          emissive="#FF8F00"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Point light — breathes with pulse */}
      <pointLight ref={lightRef} color="#FFD54F" intensity={4} distance={12} decay={2} />
    </group>
  )
}

// ─── Orbital Ring ──────────────────────────────────────────────────────────────
// Rings gently breathe (opacity + tiny scale) and rotate at their own speeds.
// When gravity is enabled, pulse events expand them outward momentarily.
function OrbitalRing({
  radius,
  speed,
  tilt,
  breathePhase = 0,
}: {
  radius: number
  speed: number
  tilt: number
  breathePhase?: number
}) {
  const groupRef   = useRef<THREE.Group>(null)
  const matRef     = useRef<THREE.LineBasicMaterial>(null)
  const { gravityEnabled, onPulse } = useGravity()

  // Track pulse expansion for this ring
  const pulseExpand = useRef({ active: false, startTime: 0 })

  useEffect(() => {
    if (!gravityEnabled) return
    return onPulse(() => {
      pulseExpand.current = { active: true, startTime: performance.now() / 1000 }
    })
  }, [gravityEnabled, onPulse])

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return pts
  }, [radius])

  useFrame((state) => {
    if (!groupRef.current || !matRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = t * speed

    // Gentle opacity breath
    let baseOpacity = 0.06 + Math.sin(t * 0.4 + breathePhase) * 0.025
    let scaleBoost = 1

    // Pulse expansion — ring gently blooms then returns
    if (gravityEnabled && pulseExpand.current.active) {
      const pe = pulseExpand.current
      const elapsed = t - pe.startTime
      const dur = 2.4
      if (elapsed < dur) {
        const prog = elapsed / dur
        const rise = Math.min(prog / 0.3, 1)
        const fall = Math.max((prog - 0.3) / 0.7, 0)
        const pulse = rise * (1 - fall * 0.9)
        scaleBoost = 1 + pulse * 0.06  // very subtle ring expansion
        baseOpacity += pulse * 0.04
      } else {
        pulseExpand.current.active = false
      }
    }

    matRef.current.opacity = baseOpacity
    groupRef.current.scale.setScalar(scaleBoost)
  })

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial ref={matRef} color="#FFD54F" transparent opacity={0.08} />
      </line>
    </group>
  )
}

// ─── Tech Capsule ──────────────────────────────────────────────────────────────
// Each capsule orbits with its own speed + a tiny vertical wobble.
// Mouse proximity pulls them slightly — premium, not gimmicky.
// In gravity mode, cursor influence is amplified (still max 5px).
function TechCapsule({
  orbitRadius,
  orbitSpeed,
  orbitOffset,
  orbitTilt,
  wobbleAmp = 0.25,
  wobbleFreq = 0.4,
}: {
  name: string
  position: [number, number, number]
  orbitRadius: number
  orbitSpeed: number
  orbitOffset: number
  orbitTilt: number
  wobbleAmp?: number
  wobbleFreq?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef  = useRef<THREE.Mesh>(null)
  const { mouse } = useThree()
  const { gravityEnabled, activeZone } = useGravity()

  // Keep zone ref so useFrame reads live values without re-running
  const zoneRef = useRef(activeZone)
  zoneRef.current = activeZone

  // Smooth mouse pull target
  const pull = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return
    const t = state.clock.getElapsedTime()
    // Zone orbitSpeed multiplier — interpolated smoothly by GravityContext
    const zoneOrbitMult = zoneRef.current.orbitSpeed
    const angle = t * orbitSpeed * zoneOrbitMult + orbitOffset

    const x = Math.cos(angle) * orbitRadius
    const z = Math.sin(angle) * orbitRadius
    const y = Math.sin(t * wobbleFreq + orbitOffset) * wobbleAmp

    // Apply orbit tilt
    const yr = y * Math.cos(orbitTilt)
    const zr = z

    // Cursor pull — amplified in gravity mode but still <= 0.3 units (≈5px)
    const mx = mouse.x * 3.5
    const my = mouse.y * 2.5
    const dx = mx - x
    const dy = my - yr
    const distSq = dx * dx + dy * dy
    const maxInfluence = gravityEnabled ? 0.3 : 0.2
    const influence = Math.max(0, 1 - distSq / 9) * maxInfluence

    const lagFactor = gravityEnabled ? 0.07 : 0.05
    pull.current.x += (dx * influence - pull.current.x) * lagFactor
    pull.current.y += (dy * influence - pull.current.y) * lagFactor

    groupRef.current.position.set(
      x + pull.current.x,
      yr + pull.current.y,
      zr
    )

    // Self-rotation
    meshRef.current.rotation.y = t * 0.4
    meshRef.current.rotation.z = Math.sin(t * 0.3 + orbitOffset) * 0.08
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.8} rotationIntensity={0.08} floatIntensity={0.2}>
        <mesh ref={meshRef}>
          <capsuleGeometry args={[0.12, 0.4, 8, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            emissive="#FFD54F"
            emissiveIntensity={0.05}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
      </Float>
    </group>
  )
}

// ─── Project Planet ────────────────────────────────────────────────────────────
function ProjectPlanet({
  color,
  position,
  size,
  speed,
}: {
  color: string
  position: [number, number, number]
  size: number
  speed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = t * speed
    meshRef.current.rotation.x = t * speed * 0.3
  })

  return (
    <Float speed={1.2} floatIntensity={0.4} rotationIntensity={0.08}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.4}
          metalness={0.6}
        />
        <pointLight color={color} intensity={0.8} distance={3} decay={2} />
      </mesh>
    </Float>
  )
}

// ─── Scene ─────────────────────────────────────────────────────────────────────
function Scene() {
  const capsuleData = useMemo(() =>
    ALL_TECHS.map((name, i) => {
      const orbitRadius = 2.5 + (i % 3) * 0.6
      // More varied speeds: range 0.05–0.18
      const orbitSpeed  = 0.05 + (i % 6) * 0.022
      const orbitOffset = (i / ALL_TECHS.length) * Math.PI * 2
      const orbitTilt   = (i % 5) * 0.15
      // Varied wobble per capsule
      const wobbleAmp   = 0.18 + (i % 4) * 0.06
      const wobbleFreq  = 0.3 + (i % 5) * 0.1
      return { name, orbitRadius, orbitSpeed, orbitOffset, orbitTilt, wobbleAmp, wobbleFreq }
    }),
    []
  )

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.2} color="#FFD54F" />

      <Stars radius={80} depth={50} count={3000} factor={3} saturation={0} fade speed={0.2} />

      {/* Orbital rings — different breathe phases */}
      <OrbitalRing radius={2.5} speed={0.05}  tilt={0.3}  breathePhase={0} />
      <OrbitalRing radius={3.5} speed={-0.035} tilt={0.8}  breathePhase={1.2} />
      <OrbitalRing radius={4.5} speed={0.025}  tilt={1.2}  breathePhase={2.4} />

      <GravityCore />

      {capsuleData.map((d) => (
        <TechCapsule
          key={d.name}
          name={d.name}
          position={[d.orbitRadius, 0, 0]}
          orbitRadius={d.orbitRadius}
          orbitSpeed={d.orbitSpeed}
          orbitOffset={d.orbitOffset}
          orbitTilt={d.orbitTilt}
          wobbleAmp={d.wobbleAmp}
          wobbleFreq={d.wobbleFreq}
        />
      ))}

      <ProjectPlanet color="#FFD54F" position={[5.5,  1,    -2]}  size={0.35} speed={0.4} />
      <ProjectPlanet color="#64B5F6" position={[-5,   0.5,  -3]}  size={0.28} speed={0.35} />
      <ProjectPlanet color="#81C784" position={[4,   -1.5,   2]}  size={0.25} speed={0.5} />
      <ProjectPlanet color="#FF8A65" position={[-4.5, 1.2,  2.5]} size={0.22} speed={0.45} />
    </>
  )
}

// ─── Camera drift ──────────────────────────────────────────────────────────────
function CameraController() {
  const { camera, mouse } = useThree()
  const target = useRef({ x: 0, y: 0 })

  useFrame(() => {
    target.current.x += (mouse.x * 0.45 - target.current.x) * 0.018
    target.current.y += (mouse.y * 0.28 - target.current.y) * 0.018
    camera.position.x = target.current.x
    camera.position.y = 1 + target.current.y
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function GravityScene() {
  return (
    <Canvas
      camera={{ position: [0, 1, 9], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <CameraController />
      <Scene />
    </Canvas>
  )
}
