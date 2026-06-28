export const PERSONAL = {
  name: 'Sanjay P',
  role: 'Java Backend Engineer · Full Stack Developer',
  tagline: 'Building scalable systems powered by intelligent architecture.',
  description:
    'Final-year B.Tech IT graduate (Anna University, 2026) who built and deployed 3 full-stack MERN applications featuring AI integrations (Groq/Llama 3.1), real-time Socket.IO communication, and scalable REST APIs.',
  email: 'sanjay.pdev@gmail.com',
  linkedin: 'https://linkedin.com/in/sanjay-p-90999a307',
  github: 'https://github.com/sanjay-p',
  portfolio: 'https://sanjay-dev-portfolio.netlify.app',
  location: 'Kanchipuram, Tamil Nadu',
  cgpa: '7.6',
  college: 'Arulmigu Meenakshi Amman College of Engineering',
  university: 'Anna University',
  graduation: '2026',
}

export const SKILLS = {
  frontend: [
    { name: 'React.js' },
    { name: 'JavaScript (ES6+)' },
    { name: 'TypeScript' },
    { name: 'HTML5' },
    { name: 'CSS3' },
    { name: 'Tailwind CSS' },
    { name: 'Bootstrap' },
    { name: 'Redux / Context API' },
    { name: 'Framer Motion' },
    { name: 'Three.js' },
  ],
  backend: [
    { name: 'Java' },
    { name: 'Spring Boot' },
    { name: 'Hibernate / JPA' },
    { name: 'Node.js' },
    { name: 'Express.js' },
    { name: 'REST APIs' },
    { name: 'Socket.IO' },
    { name: 'JWT & Authentication' },
  ],
  database: [
    { name: 'MongoDB' },
    { name: 'MySQL' },
    { name: 'SQL' },
    { name: 'Mongoose' },
  ],
  tools: [
    { name: 'Docker' },
    { name: 'Git & GitHub' },
    { name: 'Postman' },
    { name: 'VS Code' },
    { name: 'IntelliJ IDEA' },
    { name: 'Vercel' },
    { name: 'Render' },
    { name: 'Groq API (Llama 3.1)' },
  ],
}

export const ALL_TECHS = [
  'Java', 'Spring Boot', 'Hibernate', 'React', 'TypeScript',
  'JavaScript', 'Node.js', 'Express', 'MongoDB', 'MySQL',
  'Docker', 'Git', 'GitHub', 'REST APIs', 'JWT',
  'Socket.IO', 'Tailwind CSS', 'Groq API',
]

export const PROJECTS = [
  {
    id: 'skillswap',
    title: 'SkillSwap',
    subtitle: 'AI-Powered Peer-to-Peer Skill Exchange Platform',
    description:
      'Full-stack MERN application with 15+ REST endpoints covering skill listings, user profiles, and match requests. Integrated Socket.IO for real-time bi-directional messaging and Groq API (Llama 3.1) for personalised skill-match recommendations. API response latency optimised to under 200 ms.',
    color: '#FFD54F',
    glowColor: 'rgba(255, 213, 79, 0.4)',
    features: [
      'AI Skill Matching (Llama 3.1)',
      'Real-time Bi-directional Messaging',
      'JWT Role-Based Access Control',
      '15+ REST API Endpoints',
      'API Latency < 200 ms',
    ],
    techStack: ['React.js', 'Node.js', 'MongoDB', 'Socket.IO', 'Groq API', 'JWT'],
    github: 'https://github.com/sanjay652005/skillswap',
    live: 'https://skillswap-six-pi.vercel.app',
    lines: '5000+',
    files: '70+',
    category: 'Full Stack + AI',
    period: 'Jan 2026 – May 2026',
  },
  {
    id: 'quizarena',
    title: 'QuizArena',
    subtitle: 'Real-Time Multiplayer Quiz Platform',
    description:
      'Room-based multiplayer quiz platform with isolated Socket.IO event namespaces for synchronised question delivery, score tracking, and live leaderboard updates across all connected clients. Implemented score normalisation logic and end-of-round state broadcasts.',
    color: '#64B5F6',
    glowColor: 'rgba(100, 181, 246, 0.4)',
    features: [
      'Isolated Socket.IO Event Namespaces',
      'Synchronised Question Delivery',
      'Live Leaderboard Updates',
      'Score Normalisation Logic',
      'Vercel + Render Deployment',
    ],
    techStack: ['React.js', 'Node.js', 'MongoDB', 'Socket.IO', 'Express.js'],
    github: 'https://github.com/sanjay652005/quizarena',
    live: 'https://quizarena-liard.vercel.app',
    lines: '4000+',
    files: '35+',
    category: 'Full Stack',
    period: 'Apr 2026 – May 2026',
  },
  {
    id: 'notesmind',
    title: 'NotesMind',
    subtitle: 'AI Notes & Academic Resource Platform',
    description:
      'Full-stack AI notes platform with file upload (PDF/TXT/MD), Groq-powered summarisation, quiz generation, auto-tagging, contextual chat, semantic search, bookmarking, and public sharing. Enforces daily rate limits via server-side middleware. Dockerised with input validation, unit tests, and mobile-responsive UI.',
    color: '#81C784',
    glowColor: 'rgba(129, 199, 132, 0.4)',
    features: [
      'Groq-Powered Summarisation & Quiz Gen',
      'Semantic Search & Auto-Tagging',
      'File Upload (PDF / TXT / MD)',
      'Contextual AI Chat',
      'Dockerised with Unit Tests',
    ],
    techStack: ['React.js', 'Node.js', 'MongoDB', 'Groq API', 'Docker', 'JWT'],
    github: 'https://github.com/sanjay652005/notes-sharing',
    live: 'https://sanjay652005-notes-sharing.vercel.app',
    lines: '3500+',
    files: '28+',
    category: 'Full Stack + AI',
    period: 'Nov 2025 – Jan 2026',
  },
  {
    id: 'java-auth',
    title: 'Java Auth System',
    subtitle: 'Enterprise Authentication with Servlet & JSP',
    description:
      'Secure Java-based authentication system implementing registration, login, session management, form validation, and MySQL database connectivity. Demonstrates deep Java backend fundamentals including servlet-level engineering, MVC architecture, and JDBC integration on Apache Tomcat.',
    color: '#FF8A65',
    glowColor: 'rgba(255, 138, 101, 0.4)',
    features: [
      'Session Management',
      'Secure Login / Logout',
      'MySQL + JDBC Integration',
      'Role-Based Access Control',
      'MVC Architecture',
    ],
    techStack: ['Java', 'Servlets', 'JSP', 'MySQL', 'Tomcat', 'JDBC'],
    github: 'https://github.com/sanjay652005/java-auth-system',
    live: null,
    lines: '2000+',
    files: '20+',
    category: 'Java Backend',
    period: '2026',
  },
]

export const EXPERIENCE = [
  {
    company: 'Besant Technologies',
    role: 'Java Full Stack Developer Intern',
    period: 'Jan 2026 – Apr 2026',
    location: 'Chennai',
    type: 'internship',
    description: 'Built 3+ end-to-end CRUD applications using Spring Boot REST APIs, Hibernate/JPA, and MySQL, following MVC architecture with layered service design. Developed React.js frontends integrated with Spring Boot backends; managed codebase with Git and GitHub pull request workflows.',
    skills: ['Java', 'Spring Boot', 'Hibernate/JPA', 'React.js', 'MySQL', 'REST APIs', 'Git'],
  },
  {
    company: 'NoviTech R&D Pvt. Ltd.',
    role: 'Full Stack Development Training',
    period: 'Jun 2024 – Aug 2024',
    location: 'Coimbatore',
    type: 'training',
    description: 'Built MERN stack applications with RESTful API design, MongoDB schema modelling, and JWT-based authentication. Completed 30-day intensive programme and earned the Full Stack Development Programme Completion Certificate.',
    skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'REST APIs'],
  },
  {
    company: 'Pinnacle Lab',
    role: 'Web Development Intern',
    period: 'Jul 2024 – Aug 2024',
    location: 'Virtual',
    type: 'internship',
    description: 'Built 3 responsive projects (weather app, to-do list, quiz app) integrating third-party REST APIs. Strengthened async JavaScript, DOM manipulation, and error-handling skills.',
    skills: ['JavaScript', 'REST APIs', 'Async JS', 'DOM Manipulation', 'Responsive UI'],
  },
]

export const CERTIFICATIONS = [
  {
    name: 'IBM Full Stack Software Developer',
    issuer: 'IBM / Coursera',
    year: '2025',
    detail: 'React, Node.js, Django, Kubernetes, CI/CD · 10 courses',
  },
  {
    name: 'Deloitte Data Analytics Job Simulation',
    issuer: 'Deloitte / Forage',
    year: '2024',
    detail: 'Data analysis, Excel modelling, business insights reporting',
  },
  {
    name: 'TCS GenAI Job Simulation',
    issuer: 'TCS / Forage',
    year: '2024',
    detail: 'Generative AI concepts, prompt engineering, real-world GenAI workflows',
  },
  {
    name: 'Full Stack Development Programme',
    issuer: 'NoviTech R&D Pvt. Ltd.',
    year: '2024',
    detail: 'Programme Completion Certificate — MERN Stack',
  },
]

export const ACHIEVEMENTS = [
  'Solved 100+ DSA problems on LeetCode and GeeksforGeeks to strengthen core problem-solving skills.',
  'Completed a self-driven #100DaysOfCode challenge — built and documented daily progress across DSA problems, frontend components, and backend modules publicly on GitHub.',
]

export const NAV_ITEMS = [
  { label: 'ORIGIN', href: '#about' },
  { label: 'CORE SYSTEM', href: '#skills' },
  { label: 'MODULES', href: '#projects' },
  { label: 'MISSION LOG', href: '#experience' },
  { label: 'TRANSMISSION', href: '#contact' },
]
