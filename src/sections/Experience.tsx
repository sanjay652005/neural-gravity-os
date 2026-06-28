import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  Briefcase, GraduationCap, Code2, Rocket, BookOpen,
  Award, Shield, Zap, Radio, Search
} from 'lucide-react'
import { PERSONAL } from '@/constants'
import { gravityReveal, timelineItem, EASE } from '@/animations/variants'

const timelineItems = [
  {
    type: 'education',
    icon: GraduationCap,
    title: 'Started B.Tech Information Technology',
    subtitle: 'Arulmigu Meenakshi Amman College of Engineering · Anna University',
    period: '2022',
    description: 'Joined Arulmigu Meenakshi Amman College of Engineering under Anna University. Built strong foundations in programming, databases, operating systems, networking, and software engineering.',
    tags: ['Anna University', 'Information Technology', 'Software Engineering'],
    color: '#81C784',
  },
  {
    type: 'experience',
    icon: Briefcase,
    title: 'Full Stack Development Training',
    subtitle: 'NoviTech R&D Pvt. Ltd. · Coimbatore',
    period: 'Jun 2024 – Aug 2024',
    description: 'Completed an intensive Full Stack Development program focused on MERN Stack, React, Node.js, MongoDB, REST APIs, authentication, and modern software engineering. Successfully earned the Full Stack Development Programme Completion Certificate.',
    tags: ['MERN Stack', 'REST APIs', 'MongoDB', 'React', 'Node.js'],
    color: '#FFD54F',
  },
  {
    type: 'experience',
    icon: Radio,
    title: 'Web Development Intern',
    subtitle: 'Pinnacle Lab · Virtual',
    period: 'Jul 2024 – Aug 2024',
    description: 'Developed responsive web applications including Weather App, Quiz App, and Todo App while strengthening JavaScript, REST API integration, asynchronous programming, and frontend engineering skills.',
    tags: ['JavaScript', 'REST APIs', 'Async Programming', 'Responsive UI'],
    color: '#64B5F6',
  },
  {
    type: 'milestone',
    icon: Award,
    title: 'IBM Full Stack Software Developer',
    subtitle: 'IBM Professional Certificate · Coursera',
    period: 'Jul 2025',
    description: 'Completed the IBM Full Stack Software Developer Professional Certificate. Strengthened expertise in React, Node.js, Django, Docker, Kubernetes, Git, CI/CD, Cloud Computing, and Full Stack Engineering across 10 courses.',
    tags: ['IBM', 'Docker', 'Kubernetes', 'CI/CD', 'Cloud'],
    color: '#60A5FA',
  },
  {
    type: 'project',
    icon: Code2,
    title: 'NotesMind',
    subtitle: 'AI Notes & Academic Resource Platform',
    period: 'Nov 2025 – Jan 2026',
    description: 'Designed and developed my first major full-stack AI application. Built Groq-powered summarisation, quiz generation, semantic search, auto-tagging, contextual chat, file upload (PDF/TXT/MD), bookmarking, and public sharing. Dockerised with input validation and unit tests.',
    tags: ['MERN Stack', 'Groq API', 'Docker', 'Semantic Search', 'JWT'],
    color: '#81C784',
  },
  {
    type: 'experience',
    icon: Briefcase,
    title: 'Java Full Stack Developer Intern',
    subtitle: 'Besant Technologies · Chennai',
    period: 'Jan 2026 – Apr 2026',
    description: 'Built 3+ end-to-end CRUD applications using Spring Boot REST APIs, Hibernate/JPA, and MySQL following MVC architecture with layered service design. Developed React.js frontends integrated with Spring Boot backends; managed codebase with Git and GitHub pull request workflows.',
    tags: ['Java', 'Spring Boot', 'Hibernate/JPA', 'React.js', 'MySQL', 'REST APIs'],
    color: '#FFD54F',
  },
  {
    type: 'project',
    icon: Zap,
    title: 'SkillSwap',
    subtitle: 'AI-Powered Peer Skill Exchange Platform',
    period: 'Jan 2026 – May 2026',
    description: 'Designed and developed an AI-powered P2P Skill Exchange Platform with 15+ REST endpoints. Integrated Socket.IO for real-time messaging and Groq API (Llama 3.1) for personalised recommendations. Optimised API response latency to under 200 ms. Secured all endpoints with JWT role-based access control.',
    tags: ['MERN', 'Socket.IO', 'Groq API', 'JWT', 'AI', 'Real-time'],
    color: '#FFD54F',
  },
  {
    type: 'project',
    icon: BookOpen,
    title: 'QuizArena',
    subtitle: 'Real-time Multiplayer Quiz Platform',
    period: 'Apr 2026 – May 2026',
    description: 'Developed a real-time multiplayer quiz platform with isolated Socket.IO event namespaces for synchronised question delivery, score tracking, and live leaderboard updates. Implemented score normalisation and end-of-round state broadcasts. Deployed on Vercel + Render + MongoDB Atlas.',
    tags: ['Socket.IO', 'Real-time', 'MongoDB Atlas', 'Vercel', 'Render'],
    color: '#64B5F6',
  },
  {
    type: 'project',
    icon: Shield,
    title: 'Java Authentication System',
    subtitle: 'Java Backend Engineering',
    period: '2026',
    description: 'Built a secure Java-based authentication system implementing registration, login, session management, validation, and database connectivity to strengthen backend development skills.',
    tags: ['Java', 'Servlets', 'JSP', 'MySQL', 'JDBC', 'Session Management'],
    color: '#FF8A65',
  },
  {
    type: 'flagship',
    icon: Rocket,
    title: 'Neural Gravity OS',
    subtitle: 'Flagship Portfolio Project',
    period: '2026',
    description: 'Created my flagship interactive portfolio inspired by an operating system. Engineered a custom Gravity Engine, immersive project workspace, interactive UI, premium animations, and modern frontend architecture to showcase both technical expertise and creative engineering.',
    tags: ['React', 'TypeScript', 'Three.js', 'Framer Motion', 'GSAP', 'Gravity Engine'],
    color: '#FFD54F',
  },
  {
    type: 'education',
    icon: GraduationCap,
    title: 'Graduation',
    subtitle: 'Anna University · B.Tech Information Technology',
    period: '2026',
    description: 'Graduated with a Bachelor of Technology in Information Technology from Anna University. Successfully transitioned from engineering student to Full Stack Engineer.',
    tags: ['Anna University', 'B.Tech IT', 'Graduation', 'CGPA: ' + PERSONAL.cgpa],
    color: '#81C784',
  },
  {
    type: 'current',
    icon: Search,
    title: 'Open for Full-Time Opportunities',
    subtitle: 'Actively Seeking Roles',
    period: 'CURRENT',
    description: 'Actively seeking Full Stack Developer, Java Developer, Backend Developer, and Software Engineer roles. Continuously improving through real-world projects, DSA practice, modern technologies, and software architecture.',
    tags: ['Full Stack', 'Java Backend', 'SDE', 'MERN', 'Spring Boot'],
    color: '#FFD54F',
  },
]

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const reduced = useReducedMotion() ?? false

  return (
    <section id="experience" aria-label="Experience — Engineering Journey" className="section relative" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          variants={gravityReveal}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0}
        >
          <span className="text-xs font-mono text-[#FFD54F]/50 tracking-[0.3em] uppercase">MISSION LOG</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Engineering Journey
          </h2>
          <p className="text-sm text-white/35 font-mono mt-4 max-w-xl mx-auto leading-relaxed">
            From engineering student to Full Stack Engineer through continuous learning,
            internships, certifications, and real-world software development.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — grows downward as section enters */}
          <motion.div
            className="absolute left-6 top-0 bottom-0 w-px origin-top"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(255,213,79,0.2) 10%, rgba(255,213,79,0.2) 90%, transparent)',
            }}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: reduced ? 0.4 : 1.4, ease: EASE, delay: 0.1 }}
          />

          <div className="flex flex-col gap-10 pl-16">
            {timelineItems.map((item, i) => (
              <motion.div
                key={i}
                className="relative group"
                variants={timelineItem}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={reduced ? 0 : 0.1 + i * 0.07}
              >
                {/* Timeline dot */}
                <div
                  className="absolute -left-[46px] top-5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: item.color,
                    boxShadow: `0 0 10px ${item.color}55`,
                  }}
                >
                  <item.icon size={10} color="#090909" />
                </div>

                {/* Card */}
                <motion.div
                  className="glass rounded-2xl p-6 group-hover:border-white/12 transition-all duration-300"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                  whileHover={reduced ? {} : { y: -2, transition: { duration: 0.25, ease: EASE } }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-white/90">{item.title}</h3>
                      <p className="text-sm text-white/40 mt-0.5">{item.subtitle}</p>
                    </div>
                    <span
                      className="text-xs font-mono px-3 py-1 rounded-full shrink-0"
                      style={{ background: `${item.color}10`, color: item.color }}
                    >
                      {item.period}
                    </span>
                  </div>

                  <p className="text-sm text-white/50 leading-relaxed mb-4">{item.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-white/30 px-2.5 py-1 rounded-full"
                        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
