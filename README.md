<div align="center">

<img src="public/favicon.svg" width="60" height="60" alt="NGOS Logo" />

# NEURAL GRAVITY OS

### Sanjay P — Developer Portfolio

**Java Backend Engineer · Full Stack Developer**

[![Live](https://img.shields.io/badge/LIVE-sanjay--fullstack.netlify.app-FFD54F?style=for-the-badge&logo=netlify&logoColor=black)](https://sanjay-fullstack.netlify.app)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)

*A cinematic OS-aesthetic portfolio with a real-time gravity engine — built to feel alive.*

</div>

---

## ⚡ Overview

Neural Gravity OS is a production-grade developer portfolio built around a single interaction metaphor — **gravity**. Every element responds to cursor position. Every section has its own gravitational field. The UI behaves like physics, not code.

Inspired by **Interstellar**, **Apple Motion**, **Nothing OS**, **Arc Browser**, and **Linear**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🪐 **Gravity Engine** | Three.js physics core — orbiting tech capsules, spring-based mouse interaction, zone-aware field strength |
| 🖥 **OS Boot Sequence** | Cinematic loader with system init animation on first visit |
| ⌘ **Neural Command Center** | Spotlight-style palette (`Ctrl+K`) — search projects, navigate sections, open workspaces |
| 🗂 **Project Workspace** | Full OS-window per project — 6 tabs: Overview · Architecture · Features · Tech Stack · Repository · Lessons |
| 🌌 **3D Hero Scene** | React Three Fiber gravity scene — lazy-loaded, code-split from main bundle |
| 💫 **Magnetic Elements** | RAF-based magnetic cursor attraction on all interactive elements |
| 🔔 **Notification Center** | OS-style toast system with gravity-themed messages |
| 📡 **Status Bar** | Live system monitor — gravity zone state, FPS counter, section tracker |
| ⌨️ **Keyboard Navigation** | Full shortcut support — `Ctrl+K`, `Escape`, `Ctrl+H` |
| ♿ **Accessible** | ARIA labels, focus-visible styles, `prefers-reduced-motion` support |
| 📱 **Responsive** | Dedicated mobile experience — not a compressed desktop |

---

## 🛠 Tech Stack

```
Frontend        React 18 · TypeScript · Vite · Tailwind CSS
3D / Physics    Three.js · React Three Fiber · @react-three/drei
Animation       Framer Motion · GSAP · Lenis (smooth scroll)
Icons           Lucide React · React Icons
State           React Context API (GravityContext · OSContext · ModuleLaunchContext)
Deploy          Netlify (auto-deploy from GitHub)
```

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/sanjay-p/neural-gravity-os.git
cd neural-gravity-os

# Install
npm install

# Dev server → http://localhost:5173
npm run dev

# Production build → dist/
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── three/
│   │   └── GravityScene.tsx        # Three.js 3D scene (lazy-loaded)
│   ├── NeuralCommandCenter.tsx     # ⌘K command palette
│   ├── ProjectWorkspace.tsx        # OS-style project window
│   ├── StatusBar.tsx               # System status bar
│   ├── Navigation.tsx              # Nav + mobile drawer
│   ├── MagneticElement.tsx         # RAF-based magnetic wrapper
│   ├── ParticleBackground.tsx      # Canvas particle field
│   ├── Loader.tsx                  # OS boot sequence
│   └── ...
├── sections/
│   ├── Hero.tsx                    # 3D gravity hero
│   ├── About.tsx                   # Bio + values cards
│   ├── Skills.tsx                  # Skill grid
│   ├── Projects.tsx                # Project cards + workspace
│   ├── Experience.tsx              # Timeline
│   └── Contact.tsx                 # Terminal-style contact
├── contexts/
│   ├── GravityContext.tsx          # Gravity engine + zone system
│   ├── OSContext.tsx               # OS state — section, FPS, notifications
│   └── ModuleLaunchContext.tsx     # Project workspace launch phases
├── hooks/
│   ├── useGravityField.ts          # Zone-aware gravity on elements
│   ├── useGravityMouse.ts          # Global cursor gravity field
│   └── useScrollSection.ts        # Active section tracker
├── constants/
│   └── index.ts                    # ← ALL personal data lives here
└── animations/
    └── variants.ts                 # Shared Framer Motion variants
```

---

## 🎨 Customisation

All personal data is in one place — **`src/constants/index.ts`**:

```ts
export const PERSONAL = {
  name: 'Your Name',
  role: 'Your Role',
  email: 'your@email.com',
  github: 'https://github.com/your-handle',
  linkedin: 'https://linkedin.com/in/your-profile',
  // ...
}
```

Update `SKILLS`, `PROJECTS`, `EXPERIENCE`, `CERTIFICATIONS` in the same file. No other file needs to change.

### Resume
Drop `resume.pdf` into `public/`. The download button is already wired to `/resume.pdf`.

---

## 🎨 Design Tokens

| Token | Value |
|---|---|
| Background | `#090909` |
| Surface | `#111111` |
| Gold | `#FFD54F` |
| Glass | `rgba(255,255,255,0.04)` |
| Glass Border | `rgba(255,255,255,0.08)` |
| Font (UI) | Inter |
| Font (Mono) | JetBrains Mono |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+K` | Open Neural Command Center |
| `Escape` | Close workspace / command center |
| `Ctrl+H` | Scroll to top |

---

## 📊 Performance

| Metric | Value |
|---|---|
| Main bundle | ~322 kB (gzip ~110 kB) |
| Three.js chunk | ~820 kB (lazy-loaded) |
| Time to Interactive | < 2s on fast 3G |
| Lighthouse Performance | 90+ |

Three.js, Framer Motion, and React are all split into separate chunks via Vite `manualChunks` — the 3D scene never blocks the initial render.

---

## 🌐 Deployment

Deployed on **Netlify** with auto-deploy from GitHub (`netlify.toml` included).

```bash
# Push to GitHub → Netlify auto-deploys
git push origin main
```

Manual deploy:
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

---

## 📬 Contact

**Sanjay P** — Java Backend Engineer · Full Stack Developer

[![Email](https://img.shields.io/badge/sanjay.pdev@gmail.com-EA4335?style=flat&logo=gmail&logoColor=white)](mailto:sanjay.pdev@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/sanjay-p-90999a307)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/sanjay-p)
[![Portfolio](https://img.shields.io/badge/Portfolio-FFD54F?style=flat&logo=netlify&logoColor=black)](https://sanjay-fullstack.netlify.app)

---

<div align="center">

*Designed & developed by Sanjay P*
*Anna University · B.Tech Information Technology · 2026*

**Neural Gravity OS v2.0**

</div>
