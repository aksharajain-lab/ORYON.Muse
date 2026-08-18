# Implementation Plan — README.md Rewrite

This plan outlines the updates to `README.md` for the **ORYON Muse** project (`visual-aesthetic-lab`), replacing the generic template boilerplate with an accurate, structured, and comprehensive guide based on a full review of the codebase.

## User Review Required

> [!IMPORTANT]
> The updated README content is drafted below for your review before we finalize and overwrite [README.md](file:///c:/Users/neetu/OneDrive/Desktop/akshara/visual-aesthetic-lab/README.md).

## Summary of Codebase Audit

1. **Project Identity**: The project is **ORYON Muse** (folder: `visual-aesthetic-lab`), an AI-powered visual identity reading companion.
2. **Framework & Tech Stack**: Built on **TanStack Start** (`@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/react-query`), **React 19**, **TypeScript 5.8**, **Vite 8**, and **Tailwind CSS v4** (`@tailwindcss/vite`).
3. **AI Backend & API Routes**: Features server-side handlers at `/api/analyze` (visual reading generation) and `/api/chat` (editorial Muse dialogue) powered by OpenRouter API (`OPENROUTER_API_KEY`, `OPENROUTER_MODEL`), with local mock fallback (`mockAnalyze`) if keys are absent.
4. **Key Features**:
   - Multi-category study selection (Outfit, Room, Moodboard, Workspace, Social Grid, Custom Notes)
   - Client-side canvas image downscaling & multi-image upload (up to 5 images, max 10MB each)
   - Real-time AI analysis & visual identity generation (Title, 5 Traits, 5-Color Hex Palette, Tagline, Signature interpretation, Actionable directions)
   - A4 Editorial Share Card with PNG export (`html-to-image`) and Web Share API integration
   - Interactive AI Studio Curator ("Muse") supporting anchored study follow-up and standalone dialogue
   - Style evolution picker (Dark Academia, Quiet Luxury, Old Money, Y2K Revival, Coquette, Minimalist, Vintage, etc.)
5. **Project Scripts**: `npm run dev`, `npm run build`, `npm run build:dev`, `npm run preview`, `npm run lint`, `npm run format`. Compatible with `bun`.

---

## Proposed `README.md` Draft

```markdown
# ORYON Muse — Aesthetic Intelligence & Visual Identity Lab

> Discover and evolve the aesthetic you already have through AI-powered visual identity readings and editorial curation.

## Overview

**ORYON Muse** is a web application built with **TanStack Start**, **React 19**, and **Tailwind CSS v4**. It interprets user-submitted photos (outfits, rooms, moodboards, workspaces, and social grids) to distill a personal **Visual Identity**.

Instead of fitting users into generic aesthetic stereotypes, ORYON Muse reads visual patterns—color palettes, textures, silhouettes, and lighting—to generate magazine-quality identity titles, custom color palettes, signature observations, and actionable design directions. It also provides an interactive AI Studio Curator ("Muse") for ongoing textual dialogue about taste and style evolution.

## Features

- 🎨 **Category Selection**: Choose up to 3 visual areas to study (Outfit, Room, Moodboard, Social Profile, Workspace, or custom notes).
- 📸 **On-Device Image Processing**: Upload up to 5 images (JPG, PNG, WEBP) with automatic client-side canvas downscaling to optimize memory and upload speeds.
- 👁️ **AI Visual Identity Reading**: Analyzes imagery via OpenRouter API (Gemini/LLM) to extract:
  - Custom 2–4 word **Visual Identity Title**
  - 5 core **Descriptive Traits**
  - 5-color **Poetic Palette** with 6-digit hex codes
  - Editorial **Tagline** and **Signature Interpretation**
  - 3 **Actionable Design Directions**
- 🛡️ **Offline & Resilient Fallback**: Includes built-in mock analysis fallback if API keys are omitted or network requests fail.
- 🎴 **A4 Editorial Share Card**: Renders visual identity output as a magazine-styled sheet; supports high-res PNG export (`html-to-image`) and Web Share API.
- 🧭 **Style Evolution Picker**: Select from curated style directions (e.g., Dark Academia, Quiet Luxury, Old Money, Y2K Revival, Coquette, Minimalist, Vintage) or custom input to steer your guide.
- 💬 **Muse Studio AI Chat**: Context-aware editorial AI chat anchored to your visual identity reading ("study" mode) or standalone style dialogue ("dialogue" mode).
- 🌗 **Responsive & Dark/Light Themes**: Dynamic editorial aesthetics with customizable light and dark modes.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/router) (`@tanstack/react-start`), Vite 8, Nitro
- **UI Library**: [React 19](https://react.dev/), TypeScript 5.8
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Radix UI Primitives, Lucide Icons
- **AI Backend Integration**: OpenRouter API (`/api/analyze` & `/api/chat`)
- **Package Manager / Runtime**: Bun / Node.js (npm)
- **Utilities**: `html-to-image`, `zod`, `react-hook-form`, `@tanstack/react-query`

## Prerequisites

- **Node.js**: v18.0.0 or higher (or **Bun** v1.0+)
- **OpenRouter API Key** *(Optional for local dev, required for live LLM readings)*: Obtain from [OpenRouter](https://openrouter.ai/).

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd visual-aesthetic-lab
   ```

2. **Install dependencies**:
   Using `npm`:
   ```bash
   npm install
   ```
   Or using `bun`:
   ```bash
   bun install
   ```

3. **Configure Environment Variables**:
   Create a `.env` or `.env.local` file in the project root:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_MODEL=openrouter/free # optional, defaults to openrouter/free
   ```

4. **Start Development Server**:
   Using `npm`:
   ```bash
   npm run dev
   ```
   Or using `bun`:
   ```bash
   bun dev
   ```
   The application will be available at `http://localhost:3000` (or the port specified by Vite).

## Development Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with TanStack Start SSR |
| `npm run build` | Builds the application for production using Nitro |
| `npm run build:dev` | Builds the application in development mode |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint checks across the codebase |
| `npm run format` | Formats code with Prettier |

## Project Structure

```
visual-aesthetic-lab/
├── public/                 # Static assets (favicons, manifests)
├── src/
│   ├── assets/             # Hero images and branding assets
│   ├── components/         # Reusable React components & UI primitives
│   │   ├── OpeningSequence.tsx
│   │   ├── Shell.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ui/             # Radix UI based components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Core logic & utilities
│   │   ├── aesthetic.ts    # State management & fallback data
│   │   ├── gemini.server.ts # OpenRouter / AI API integration
│   │   └── image.ts        # Client-side image downscaling
│   ├── routes/             # TanStack Start file-based routes & API handlers
│   │   ├── __root.tsx      # Root route layout & meta tags
│   │   ├── index.tsx       # Landing page ("/")
│   │   ├── begin.tsx       # Category selection ("/begin")
│   │   ├── upload.tsx      # Image upload ("/upload")
│   │   ├── analyzing.tsx   # AI reading progress screen ("/analyzing")
│   │   ├── result.tsx      # Aesthetic reading result & share card ("/result")
│   │   ├── evolve.tsx      # Style evolution picker ("/evolve")
│   │   ├── guide.tsx       # Muse AI Studio dialogue ("/guide")
│   │   └── api/            # Server API handlers
│   │       ├── analyze.ts  # POST /api/analyze endpoint
│   │       └── chat.ts     # POST /api/chat endpoint
│   ├── server.ts           # Nitro server entry wrapper
│   └── styles.css          # Tailwind CSS & global styling
├── bun.lock                # Bun lockfile
├── package.json            # Project dependencies & scripts
└── vite.config.ts          # Vite & TanStack Start configuration
```

## Known Limitations

- **Guest Usage Limits**: Client-side localStorage tracks study follow-ups (up to 3 messages) and direct dialogues (up to 5 messages) per guest session.
- **Image Upload Constraints**: Maximum of 5 images per study session, each under 10 MB.
- **LocalStorage Quotas**: High-resolution image previews use module memory and `sessionStorage` fallback to prevent quota overflow errors on mobile browsers.

## License

Private / All Rights Reserved.
```

---

## Verification Plan

1. Review the proposed content with the user.
2. Upon user approval, replace [README.md](file:///c:/Users/neetu/OneDrive/Desktop/akshara/visual-aesthetic-lab/README.md) with the new documentation using `replace_file_content` or `write_to_file`.
3. Verify the formatting and links in [README.md](file:///c:/Users/neetu/OneDrive/Desktop/akshara/visual-aesthetic-lab/README.md).
