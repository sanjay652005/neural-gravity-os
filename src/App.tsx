import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OSProvider } from '@/contexts/OSContext'
import { GravityProvider } from '@/contexts/GravityContext'
import { ModuleLaunchProvider } from '@/contexts/ModuleLaunchContext'
import ModuleLaunchOverlay from '@/components/ModuleLaunchOverlay'
import Loader from '@/components/Loader'
import Navigation from '@/components/Navigation'
import ParticleBackground from '@/components/ParticleBackground'
import Footer from '@/components/Footer'
import SectionDivider from '@/components/SectionDivider'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Skills from '@/sections/Skills'
import Projects from '@/sections/Projects'
import Experience from '@/sections/Experience'
import Contact from '@/sections/Contact'
import NeuralCommandCenter, { type NeuralCommandCenterHandle } from '@/components/NeuralCommandCenter'
import { PROJECTS } from '@/constants'
import ProjectWorkspace from '@/components/ProjectWorkspace'
import StatusBar from '@/components/StatusBar'
import NotificationCenter from '@/components/NotificationCenter'
import GravityNotification from '@/components/GravityNotification'
import BlackHoleCursor from '@/components/BlackHoleCursor'
import { useScrollSection } from '@/hooks/useScrollSection'
import { useOSShortcuts } from '@/hooks/useOSShortcuts'
import { useModuleLaunch } from '@/contexts/ModuleLaunchContext'

type Project = typeof PROJECTS[number]

// Inner app — needs OSProvider already mounted
function AppInner() {
  const [loaded, setLoaded] = useState(false)
  const cmdCenterRef = useRef<NeuralCommandCenterHandle>(null)

  const { initiatelaunch, initiateClose, phase, activeProjectId, origin } = useModuleLaunch()

  useScrollSection()

  useOSShortcuts({
    onCommandCenter: () => cmdCenterRef.current?.open(),
    onClose: () => { if (phase !== 'IDLE') initiateClose() },
    onHome: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    onMissionControl: () => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    },
  })

  const handleOpenProject = useCallback((id: string) => {
    // Command center has no card rect — use viewport center as synthetic origin
    const vw = window.innerWidth
    const vh = window.innerHeight
    const syntheticRect = new DOMRect(vw / 2 - 140, vh / 2 - 80, 280, 160)
    initiatelaunch(id, syntheticRect)
  }, [initiatelaunch])

  // Global workspace — shown for projects opened from command center only.
  // Projects section handles its own workspace for card-launched projects.
  const globalProject = PROJECTS.find(p => p.id === activeProjectId) ?? null
  const showGlobal = (phase === 'EXPANDED' || phase === 'CLOSING')
    && !!globalProject
    && origin?.source === 'command'

  return (
    <>
      <ParticleBackground />

      {/* OS Layer — always on top */}
      <StatusBar />
      <NotificationCenter />
      <GravityNotification />
      <BlackHoleCursor />

      <AnimatePresence>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {loaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ paddingTop: 28 }}
          >
            <Navigation
              commandCenter={
                <NeuralCommandCenter
                  ref={cmdCenterRef}
                  onOpenProject={handleOpenProject}
                />
              }
            />

            <main>
              <Hero />
              <SectionDivider />
              <About />
              <SectionDivider />
              <Skills />
              <SectionDivider />
              <Projects />
              <SectionDivider />
              <Experience />
              <SectionDivider />
              <Contact />
            </main>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Project Workspace — for command-center-opened projects only */}
      <AnimatePresence>
        {showGlobal && globalProject && (
          <ProjectWorkspace
            key={globalProject.id}
            project={globalProject}
            onClose={initiateClose}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <OSProvider>
      <GravityProvider>
        <ModuleLaunchProvider>
          <AppInner />
          <ModuleLaunchOverlay />
        </ModuleLaunchProvider>
      </GravityProvider>
    </OSProvider>
  )
}
