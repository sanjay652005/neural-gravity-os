# NEURAL GRAVITY OS — Sanjay P Portfolio

A cinematic, production-grade developer portfolio with a futuristic OS aesthetic, built to showcase Java Full Stack and MERN expertise.

**Live:** https://sanjay-dev-portfolio.netlify.app

---

## ✨ Features

- **Gravity Engine** — Three.js physics core with orbiting tech capsules and mouse interaction
- **Cinematic Boot Loader** — OS-style boot sequence (respects `prefers-reduced-motion`)
- **Neural Command Center** — Spotlight-style command palette (⌘K / Ctrl+K)
- **Project Workspace** — Per-project OS window with 6 tabs: Overview · Architecture · Features · Tech Stack · Repository · Lessons
- **Immersive Hero** — Full 3D scene with floating planets and tech orbit
- **Glass Morphism** — Luxury dark theme with gold accents
- **Terminal Contact** — Developer-aesthetic terminal-style contact panel
- **Custom Cursor** — Magnetic spring cursor with gold glow
- **60fps Animations** — Framer Motion spring physics throughout
- **Fully Responsive** — Mobile → 4K
- **Accessible** — Keyboard navigation, focus-visible styles, ARIA labels, reduced-motion support

## 🛠 Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Three.js** + **React Three Fiber** + **@react-three/drei** — 3D gravity scene
- **Framer Motion** — animations and spring physics
- **Tailwind CSS** — utility styling
- **Lucide React** — icons

## 🚀 Getting Started

```bash
npm install
npm run dev       # dev server → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── three/GravityScene.tsx     # Three.js scene
│   ├── NeuralCommandCenter.tsx    # ⌘K command palette
│   ├── ProjectWorkspace.tsx       # Per-project OS window
│   ├── StatusBar.tsx              # OS top bar
│   └── ...
├── sections/
│   ├── Hero.tsx · About.tsx · Skills.tsx
│   ├── Projects.tsx · Experience.tsx · Contact.tsx
├── contexts/
│   ├── GravityContext.tsx · OSContext.tsx · ModuleLaunchContext.tsx
├── constants/index.ts             # ← ALL personal data lives here
└── hooks/
    ├── useGravityField.ts · useGravityMouse.ts · useScrollSection.ts
```

## 🎨 Customisation

All personal data is in **`src/constants/index.ts`**:
- `PERSONAL` — name, role, bio, links, education
- `SKILLS` — grouped skill categories
- `PROJECTS` — project cards and workspace details
- `EXPERIENCE` — timeline items
- `CERTIFICATIONS` + `ACHIEVEMENTS`

### Adding your photo
Place `your-photo.jpg` in `public/` and update `src/sections/About.tsx`:
```tsx
<img src="/your-photo.jpg" alt="Sanjay P" className="w-full h-full object-cover rounded-full" />
```

### Adding resume
Place `resume.pdf` in `public/`. The download button is already wired up (`/resume.pdf`).

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#090909` |
| Surface | `#111111` |
| Gold | `#FFD54F` |
| Text Primary | `#FFFFFF` |
| Text Secondary | `#BDBDBD` |
| Glass | `rgba(255,255,255,0.04)` |

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open Neural Command Center |
| `Escape` | Close workspace / command center |
| `⌘H` / `Ctrl+H` | Scroll to top |

## 📊 Performance

- Main bundle: ~320 kB (gzipped ~110 kB)
- Three.js scene: ~820 kB (code-split, lazy-loaded after main UI)
- Time to Interactive: < 2s on fast connections

## 🌐 Deployment

**Netlify** (recommended — `netlify.toml` included):
```bash
npx netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
npx vercel deploy
```

**GitHub Pages:**
```bash
npm run build && npx gh-pages -d dist
```

---

*Designed & Developed by Sanjay P — Neural Gravity OS v1.0.0*
*Anna University · B.Tech IT · 2026*
