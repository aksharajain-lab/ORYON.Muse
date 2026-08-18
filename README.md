# ORYON Muse — Aesthetic Companion

A premium AI-powered aesthetic companion that discovers your unique visual identity through image analysis and intelligent conversation.

## Overview

ORYON Muse interprets your visual taste by analyzing images from your personal style — outfits, rooms, moodboards, and more. Using advanced AI, it generates a personalized **Visual Identity** that includes your aesthetic archetype, signature color palette, defining traits, and actionable suggestions for aesthetic evolution.

**Your taste already has a language. Muse interprets it.**

## Features

- **Visual Identity Discovery** — Upload up to 5 images and receive a comprehensive aesthetic analysis including identity type, color palette, personality traits, and editorial guidance
- **Smart Image Categorization** — Select from 6 categories (outfit, room, moodboard, social profile, workspace, or other) to give Muse context for deeper analysis
- **AI-Powered Analysis** — Leverages Google Gemini 2.5 Flash for nuanced, creative aesthetic interpretation
- **Chat Interface** — Ask follow-up questions and have a conversation with Muse to explore your aesthetic further
- **Shareable Results** — Export your Visual Identity as a high-fidelity PNG card with palette, traits, and signature
- **Aesthetic Evolution** — Discover new aesthetic directions to explore and refine your visual identity over time
- **Progressive Web App** — Install as a native app on desktop and mobile with offline support
- **Dark/Light Theme** — Seamless theme switching with persistent preferences
- **Mobile-Optimized** — Fully responsive experience across all devices

## Tech Stack

**Frontend:**
- React 19 — Modern component library
- TypeScript — Type-safe development
- TanStack Router — Full-featured routing with server-side rendering
- TanStack Start — Full-stack React framework
- React Query — Server state management
- Tailwind CSS — Utility-first styling
- Radix UI — Accessible, unstyled component primitives

**Backend:**
- Nitro — Serverless backend
- Node.js 18+ — Runtime environment

**AI & APIs:**
- OpenRouter — LLM routing service
- Google Gemini 2.5 Flash — Visual understanding and creative analysis

**Build & Dev:**
- Vite — Lightning-fast build tool
- TypeScript — Static type checking
- ESLint + Prettier — Code quality and formatting

## Prerequisites

- **Node.js** 18 or higher (verified with [nvm](https://github.com/nvm-sh/nvm))
- **npm** 9+ or **bun** (package manager)
- **OpenRouter API Key** — Get one free at [openrouter.ai](https://openrouter.ai)

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/aksharajain-lab/visual-aesthetic-lab.git
cd visual-aesthetic-lab
```

### 2. Install dependencies

Using **npm**:
```bash
npm install
```

Or using **bun**:
```bash
bun install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openrouter/free
```

You can get a free OpenRouter API key at https://openrouter.ai/keys

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port displayed in your terminal).

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build in development mode
npm run build:dev

# Preview production build locally
npm preview

# Lint and format code
npm run lint
npm run format
```

## Project Structure

```
src/
├── routes/                      # TanStack Router pages
│   ├── __root.tsx              # Root layout and error boundaries
│   ├── index.tsx               # Landing page / home
│   ├── begin.tsx               # Category selection
│   ├── upload.tsx              # Image upload interface
│   ├── analyzing.tsx           # Loading/analysis in progress
│   ├── result.tsx              # Visual Identity results
│   ├── evolve.tsx              # Aesthetic evolution explorer
│   ├── guide.tsx               # Educational content
│   └── api/
│       ├── analyze.ts          # POST /api/analyze — Visual analysis endpoint
│       └── chat.ts             # POST /api/chat — Conversation endpoint
│
├── components/
│   ├── Shell.tsx               # Main layout wrapper
│   ├── OpeningSequence.tsx      # Animated intro sequence
│   ├── ThemeToggle.tsx          # Dark/light mode switcher
│   └── ui/                      # Radix UI component library (40+ components)
│
├── lib/
│   ├── aesthetic.ts            # Core aesthetic logic and mock data
│   ├── gemini.server.ts         # OpenRouter API integration
│   ├── image.ts                # Image processing utilities
│   ├── error-capture.ts        # Error handling
│   └── utils.ts                # Utility functions
│
├── hooks/
│   └── use-mobile.tsx          # Mobile detection hook
│
├── styles.css                  # Global Tailwind styles
├── router.tsx                  # Router configuration
├── start.ts                    # App entry point
└── server.ts                   # Server-side error handling

public/
├── manifest.webmanifest        # PWA manifest
├── favicon.ico                 # Browser favicon
├── apple-touch-icon.png        # iOS home screen icon
├── icon-192.png               # Android home screen icon
├── icon-512.png               # Maskable icon for various platforms
└── robots.txt                 # SEO

vite.config.ts                 # Vite configuration
tsconfig.json                  # TypeScript configuration
eslint.config.js              # ESLint rules
package.json                  # Dependencies and scripts
```

## Usage

### For Users

1. **Visit the landing page** — Read about the aesthetic analysis journey
2. **Begin your study** — Select 1–3 categories from your visual world (outfit, room, moodboard, etc.)
3. **Upload images** — Add up to 5 images (JPG, PNG, or WebP). The larger the variety, the more nuanced the reading
4. **Wait for analysis** — Muse analyzes your images through 4 stages: preparing, observing, distilling, and creating
5. **Explore your results** — Your Visual Identity includes:
   - **Identity type** (e.g., "Ethereal Romantic")
   - **Tagline** summarizing your aesthetic
   - **Color palette** with 5 named colors
   - **Personality traits** reflected in your choices
   - **Signature** — an editorial explanation of your aesthetic patterns
   - **Suggestions** for intentional evolution
6. **Chat with Muse** — Ask follow-up questions about your aesthetic
7. **Export & share** — Download your Visual Identity card as a PNG or share directly

### For Developers

#### Adding a new route

```typescript
// src/routes/myroute.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/myroute")({
  head: () => ({
    meta: [
      { title: "Page Title — ORYON Muse" },
      { name: "description", content: "Page description..." },
    ],
  }),
  component: MyComponent,
});

function MyComponent() {
  return <div>Content</div>;
}
```

#### Calling the analysis API

```typescript
const response = await fetch("/api/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    images: ["data:image/jpeg;base64,...", ...],
    categories: ["outfit", "room"],
    otherNote: "Additional context...",
  }),
});

const { ok, result, error } = await response.json();
```

## Known Limitations & WIP

- **API Rate Limits** — Free OpenRouter tier has usage limits; consider upgrading for production use
- **Image Processing** — Images are downscaled for API efficiency; ultra-high-resolution details may be lost
- **Fallback Analysis** — If the API fails, the app falls back to a local mock reading to keep the experience seamless
- **Evolution System** — Currently in exploration phase; community-driven aesthetic directions are planned

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key (free tier available) |
| `OPENROUTER_MODEL` | No | Model to use (default: `openrouter/free`) |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## PWA Installation

ORYON Muse is a Progressive Web App and can be installed:

- **Desktop**: Click the install icon in your browser's address bar
- **iOS**: Tap Share → Add to Home Screen
- **Android**: Tap the three-dot menu → Install app

## Deployment

Built with TanStack Start and Nitro for seamless serverless deployment:

```bash
# Build for production
npm run build

# The output is ready for deployment to:
# - Vercel
# - Netlify
# - Cloudflare Workers
# - Any Node.js environment
```

## License

© 2026 Akshara Jain. All rights reserved.

## Contributing

ORYON Muse is currently a personal project. Feedback and feature suggestions are welcome via GitHub issues.

## Support

For issues, feature requests, or questions, visit the [GitHub repository](https://github.com/aksharajain-lab/visual-aesthetic-lab).

---

**Built with love and aesthetic intention.** ✨
