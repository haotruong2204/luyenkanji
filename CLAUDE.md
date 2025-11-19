# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nhai Kanji (Luyenkanji)** is a Vietnamese-localized web application for learning Japanese Kanji characters. It displays Kanji information with visual decomposition, composition analysis via interactive graphs, stroke-order animations, and handwriting recognition.

The app serves 2500+ Kanji with JLPT level classifications, vocabulary examples with audio, and radical information.

## Development Commands

```bash
# Development server (standard)
npm run dev

# Development server (Turbo mode - faster)
npm run turbo

# Build for production
npm run build

# Run production server locally
npm start

# Linting
npm run lint           # Check for linting errors
npm run lint:fix       # Auto-fix linting errors

# Code formatting
npm run format         # Format all files with Prettier
npm run format:check   # Check formatting without modifying files
```

**Requirements:** Node.js >= 20

## Production Build Configuration

**IMPORTANT:** The `next.config.ts` file contains a critical toggle for deployment:

- During **development**: Keep `output: "export"` commented out
- For **production deployment**: Uncomment `output: "export"` to enable static site generation

The project uses static site generation (SSG) for all Kanji pages at build time via `generateStaticParams()`.

## Architecture & Data Flow

### Static Data Pre-generation

The project relies on **pre-generated JSON data** stored in `/data` directory. This data must be generated BEFORE building the app:

```
data/
├── composition.json      # Kanji composition graph (676KB)
├── searchlist.json       # Searchable kanji list (665KB)
├── kanjilist.json        # Kanji metadata
├── radicallist.json      # Radical data (106KB)
├── kanji/{kanji}.json    # Individual kanji data files (e.g., 漢.json)
└── animCJK/              # SVG stroke animation data
    ├── svgsJa/           # Japanese stroke order SVGs
    ├── svgsZhHans/       # Simplified Chinese variants
    └── [other variants]
```

**Preprocessing scripts** (in `/preprocess` directory):
1. `1_create_composition.ts` - Creates composition graph from KanjiVG data
2. `2_create_searchlist.ts` - Generates searchable kanji list
3. `3_create_data.ts` - Fetches kanji data from Jisho.org and KanjiAlive APIs

**Note:** These scripts require API keys (e.g., `KANJIALIVE_API_KEY` in `.env`) and are run manually during data preparation, NOT during regular development or builds.

### Page Generation Flow

1. **Build time:** `generateStaticParams()` in `src/app/[id]/page.tsx` reads `composition.json` and generates static pages for all ~2500 Kanji
2. **Runtime:** Dynamic params are disabled (`dynamicParams = false`) - only pre-generated pages are accessible
3. **Data loading:** Each page uses:
   - `getKanjiDataLocal(id)` - Reads from `data/kanji/{kanji}.json`
   - `getGraphData(id)` - Constructs composition graphs from `composition.json`
   - `getStrokeAnimation(id)` - Reads SVG files from `data/animCJK/`

### State Management

**Jotai** is the primary state management solution:
- `src/lib/store.tsx` defines atoms using `atomWithStorage` for persistent graph preferences
- Nested state structure: `graphPreferenceAtom` contains `style`, `rotate`, `outLinks`, `particles`
- Derived atoms (`styleAtom`, `rotateAtom`, etc.) provide granular access to nested properties
- Persists to localStorage automatically

**Providers hierarchy** (in `src/app/layout.tsx`):
```
ThemeProvider (next-themes)
└── TooltipProvider (Radix UI)
    └── JotaiProvider
        └── App content
```

### Component Architecture

**Search & Input:**
- `search-input.tsx` - Virtual scrolling dropdown (react-virtuoso) for 2500+ kanji search
- `draw-input.tsx` - Canvas-based handwriting recognition using handwriting.js

**Kanji Display:**
- `kanji.tsx` - Main kanji info component
- `kanji-stroke-animation.tsx` / `kanji-stroke-animation-dynamic.tsx` - Stroke order visualization using kanjivganimate
- `radical.tsx` + `radical-images.tsx` - Radical information and animations

**Graphs:**
- `graphs.tsx` - Wrapper with controls for 2D/3D toggle and preferences
- `graph-2D.tsx` - Force-directed graph using react-force-graph-2d
- `graph-3D.tsx` - 3D force-directed graph using react-force-graph-3d + three-spritetext
- Graph data structure: Two modes (with/without outbound links)
  - **Inbound links**: Components that form the current kanji
  - **Outbound links**: Kanji that use the current kanji as a component

**UI Components:**
- Located in `src/components/ui/` - Shadcn-style components built on Radix UI primitives
- Use `class-variance-authority` (CVA) for variant management
- Styled with Tailwind CSS 4.0

### Fonts & Theming

**Font loading** (Next.js font optimization):
- Noto Sans JP (variable weight) - Primary Japanese font
- Multiple decorative fonts (Caveat, Comfortaa, Itim, Kablammo, VT323, Zen Maru Gothic)
- Local font: JapaneseRadicals-Regular.woff2 for radical display
- All fonts use `display: "swap"` for performance

**Theme system:**
- `next-themes` for dark/light mode with system detection
- CSS custom properties in `src/styles/globals.css`
- `suppressHydrationWarning` used extensively to prevent theme mismatches

### Path Aliases

TypeScript path alias configured in `tsconfig.json`:
```
"@/*" maps to "./src/*"
```

Example: `import { getKanjiDataLocal } from "@/lib"`

## Key Technical Details

### Static Site Generation (SSG)
- All 2500+ kanji pages are pre-rendered at build time
- Pages are accessible via dynamic routes: `/[kanji]` (e.g., `/漢`)
- URL encoding/decoding handled for Unicode kanji characters

### Graph Composition Algorithm
See `src/lib/index.ts`:
- `findNodes()` - Recursively traverses composition graph to find all connected components
- `createInLinks()` - Generates links between kanji and their constituent parts
- Returns two graph datasets: `withOutLinks` and `noOutLinks`

### Stroke Animation Data Loading
- Multiple SVG directories checked in order of preference: `svgsJa` → `svgsJaSpecial` → `svgsZhHans` → etc.
- Fallback mechanism: if Japanese stroke data unavailable, uses Chinese/Korean variants
- SVG files named by Unicode codepoint: `{charCodeAt(0)}.svg`

### Performance Optimizations
- Virtual scrolling in search dropdown (handles 2500+ items smoothly)
- Dynamic imports for heavy 2D/3D graph components
- Pre-generated data files to avoid API calls during builds
- Static site generation for instant page loads

## Data Sources & Licensing

All data aggregated from open-source/CC-licensed sources:
- KanjiVG (CC-BY-SA 3.0) - Stroke data
- Jisho.org (CC 4.0) - Kanji info, meanings, audio
- KanjiAlive (CC 4.0) - Detailed kanji information
- GitHub kanji projects (MIT) - Radical lists

## ESLint Configuration

ESLint errors are **ignored during builds** (`ignoreDuringBuilds: true` in `next.config.ts`). Fix linting issues with `npm run lint:fix` before committing.
