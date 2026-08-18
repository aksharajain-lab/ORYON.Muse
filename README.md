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

## Setup

### Prerequisites

- **Node.js** 18 or higher (install with [nvm](https://github.com/nvm-sh/nvm))
- **npm** 9+ or **bun** (package manager)
- **OpenRouter API Key** — Get one free at [openrouter.ai](https://openrouter.ai)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aksharajain-lab/visual-aesthetic-lab.git
cd visual-aesthetic-lab
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables — Create `.env.local`:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openrouter/free
```

4. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Technical Overview

### Architecture

ORYON Muse is built as a full-stack React application using **TanStack Start** for seamless client-server integration:

- **Client Layer** — React 19 with TypeScript for type-safe UI development
- **Server Layer** — Nitro-based backend with API endpoints for analysis and chat
- **State Management** — React Query for server state, React Router for navigation
- **Styling** — Tailwind CSS with Radix UI primitives for accessible, consistent UI

### Key Components

**Routes** (`src/routes/`)
- `/` — Landing page with aesthetic manifesto
- `/begin` — Category selection (outfit, room, moodboard, etc.)
- `/upload` — Image upload interface (max 5 images, 10MB total)
- `/analyzing` — Analysis progress with paced editorial steps
- `/result` — Visual Identity results with palette, traits, and signature
- `/evolve` — Aesthetic direction explorer
- `/api/analyze` — POST endpoint for visual analysis via Gemini API
- `/api/chat` — POST endpoint for conversation with Muse

**Core Libraries**
- `aesthetic.ts` — Core aesthetic types, mock identities, and session storage
- `gemini.server.ts` — OpenRouter API integration for LLM analysis
- `image.ts` — Image downscaling and processing utilities

### Data Flow

1. User selects image categories and uploads up to 5 images
2. Images are downscaled to ~500KB total for API efficiency
3. Frontend sends to `/api/analyze` with images, categories, and context
4. Backend calls Gemini 2.5 Flash to analyze visual identity
5. Result returns identity type, palette, traits, signature, and suggestions
6. User can chat with Muse for follow-up questions via `/api/chat`
7. Results can be exported as PNG using `html-to-image` library

### Styling & Theme

- **Tailwind CSS** — Utility-first design system
- **Theme Colors** — Light mode: cream/beige palette; Dark mode: deep/warm tones
- **Components** — 40+ reusable Radix UI components (buttons, forms, dialogs, etc.)
- **Typography** — Multiple font families (Cormorant Garamond, Inter, EB Garamond) via Google Fonts
