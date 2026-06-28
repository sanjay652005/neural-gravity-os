import { useEffect } from 'react'
import { useOS } from '@/contexts/OSContext'
import { useGravity } from '@/contexts/GravityContext'

const SECTION_LABELS: Record<string, string> = {
  hero: 'HERO',
  about: 'ORIGIN',
  skills: 'CORE SYSTEM',
  projects: 'MODULES',
  experience: 'MISSION LOG',
  contact: 'TRANSMISSION',
}

export function useScrollSection() {
  const { setCurrentSection } = useOS()
  const { setZoneBySection } = useGravity()

  useEffect(() => {
    const ids = Object.keys(SECTION_LABELS)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id
            const label = SECTION_LABELS[id] ?? id.toUpperCase()
            setCurrentSection(label)
            // Phase 9 — trigger zone transition
            setZoneBySection(label)
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )

    // Hero has no id, use the first section
    const heroEl = document.querySelector('section')
    if (heroEl && !heroEl.id) {
      heroEl.id = 'hero'
    }

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [setCurrentSection, setZoneBySection])
}
