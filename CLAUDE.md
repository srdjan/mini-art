# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**mini-art-bw** is a Deno-based SSR application that demonstrates **Declarative Shadow DOM** with a custom Web Component (`<mini-art-bw>`). The component generates black & white generative art using **pure CSS gradients** with no canvas or images.

## Development Commands

```bash
# Development server (basic)
deno run --allow-net --allow-env --allow-read=src/web server.ts

# Development server with watch mode
deno task dev:watch

# Production server
deno task start
```

All commands require:
- `--allow-net` for HTTP server
- `--allow-env` for reading PORT environment variable (defaults to 8070)
- `--allow-read=src/web` for serving the Web Component module

To use a custom port:
```bash
PORT=3000 deno task dev
```

## Architecture

### SSR + Hydration Pattern

The application uses a **server-first rendering** approach with Declarative Shadow DOM:

1. **Server-side ([server.ts](server.ts))**: Renders complete HTML with `<template shadowrootmode="open">` containing pre-rendered Shadow DOM
2. **Client-side ([src/web/mini-art-bw.js](src/web/mini-art-bw.js))**: Custom element class hydrates the existing shadow root and adds interactivity

This pattern enables:
- Fast initial paint (no FOUC)
- Progressive enhancement
- Full SEO/accessibility benefits

### Code Organization

```
server.ts              # Deno HTTP server + SSR rendering
src/
  domain/
    ssr.ts            # Server-side Shadow DOM template generation
    parse.ts          # Attribute/query parameter parsing
    bw-style.ts       # CSS generation (vars, layers, animations)
    randomize.ts      # Random attribute generation
  seeds/
    bw-seeds.ts       # Preset configurations (6 variations)
  types.ts            # Type definitions (Angle, Percent, ArtConfig, etc.)
  web/
    mini-art-bw.js    # Client-side Web Component (vanilla JS)
```

### Data Flow

1. **Input**: URL query params or hardcoded attributes → `queryToAttrs()` in [src/domain/parse.ts](src/domain/parse.ts)
2. **Configuration**: Attributes → `attrsToConfig()` applies seed presets + overrides
3. **SSR**: `ArtConfig` → `renderComponentShadow()` in [src/domain/ssr.ts](src/domain/ssr.ts) generates declarative shadow template
4. **Hydration**: Browser loads [src/web/mini-art-bw.js](src/web/mini-art-bw.js), Web Component reuses existing shadow root
5. **Updates**: Attribute changes trigger `attributeChangedCallback()` → updates CSS custom properties

### Key Design Patterns

**Functional TypeScript (SSR Side)**
- Pure functions with typed inputs/outputs
- No classes in domain logic
- Type aliases over interfaces (`ArtConfig`, `Angle`, `Percent`)
- Immutable configurations with `readonly`

**CSS Architecture**
- All visual output via CSS custom properties (`--a1`, `--L`, `--cell`, etc.)
- Light gray background via `background-color: hsl(0, 0%, var(--L))` for visibility on any page background
- Multi-layer `background-image` with `background-blend-mode` for pattern complexity
- `@property` CSS Houdini API enables smooth angle animations
- Pure black/white/gray patterns without transparency

**Component Attributes**
- `template`: Pattern style - `geometric`, `grid`, `radial`, `angular`, `minimal` (default: geometric)
- `seed`: 1-6, presets for angles and lightness
- `lit`: Base lightness (% value)
- `cell`: Coarse "pixel" grain size
- `r`: Vignette radius factor (0-1)
- `a1`, `a2`, `a3`: Gradient rotation angles (CSS `<angle>`)
- `animate`: Boolean presence attribute triggers CSS animations
- `hue`, `sat`: Accepted for API symmetry but coerced/ignored (B/W only)

**Pattern Templates**

The application supports 5 distinct visual styles that create fundamentally different art:

1. **geometric** (default): Rotating linear stripes + offset concentric circles + perpendicular lines — Swiss design aesthetic
2. **grid**: Orthogonal grid lines + diagonal accent — Grid paper aesthetic
3. **radial**: Multiple concentric circle patterns from different focal points — Organic, flowing
4. **angular**: Repeating conic gradients at different frequencies — Sunburst/kaleidoscope
5. **minimal**: Sparse, large-scale patterns with emphasis on negative space — Brutalist aesthetic

## Random Generation

The application includes a randomizer ([src/domain/randomize.ts](src/domain/randomize.ts)) that generates random attribute values before rendering:

**Usage:**
- Query parameter: `/?random=6` - Generate 6 random tiles on the main page
- Randomize button in UI - Reloads with 6 random tiles
- Copy Link button - Each tile has a button that copies a shareable URL with all parameters

**Randomization Strategy:**
The `randomizeAttrs()` function:
1. **Always** picks a random template (geometric, grid, radial, angular) for visual variety
   - Note: "minimal" excluded from random selection as it's intentionally sparse
2. Then uses a 50/50 split:
   - **Seed-based**: Random seed (1-6) + random variations of size, cell, r, animate
   - **Fully random**: All parameters randomized (lit, a1, a2, a3, size, cell, r, animate)

**Value Ranges (optimized for visibility):**
- `template`: Random pick from 4 options (geometric, grid, radial, angular)
- `size`: Fixed at 280px for consistent layout
- `lit`: 50-70% (narrower range ensures good visibility)
- `cell`: 8-14px (smaller range creates denser patterns)
- `r`: 0.80-0.92 (tighter range for consistent opacity)
- `a1, a2, a3`: 0-1 turn
- `animate`: 30% chance

## Sharing & Copy Feature

Each tile card includes a "Copy Link" button that allows users to save and share their favorite artworks:

**Implementation:**
- Query string is built server-side in `renderTile()` function
- Button includes `data-params` attribute with encoded parameters
- Client-side JavaScript uses Clipboard API to copy full URL
- Visual feedback: button turns green and shows checkmark for 2 seconds

**User Flow:**
1. User clicks "Copy Link" on a tile they like
2. Full URL with parameters is copied to clipboard (e.g., `http://localhost:8070/?template=grid&seed=3&lit=65%`)
3. URL can be shared, bookmarked, or pasted to recreate exact same artwork
4. Parameters in URL are automatically parsed and applied on page load

## Testing

No formal test suite currently. Manual testing via:
```bash
deno task dev:watch
# Open http://localhost:8070
# Add query params: ?seed=3&lit=70%&animate
# Or test random generation: ?random=6
# Click "Copy Link" buttons to test sharing feature
```

## Adding New Features

**Adding a new seed preset**:
1. Add entry to `BW_SEEDS` in [src/seeds/bw-seeds.ts](src/seeds/bw-seeds.ts)
2. Update `SeedId` type in [src/types.ts](src/types.ts)
3. Duplicate preset in [src/web/mini-art-bw.js](src/web/mini-art-bw.js) `seeds` static property

**Adding a new attribute**:
1. Add type to `ArtConfig` in [src/types.ts](src/types.ts)
2. Update `attrsToConfig()` in [src/domain/parse.ts](src/domain/parse.ts)
3. Update `baseCssVars()` or `backgroundLayers()` in [src/domain/bw-style.ts](src/domain/bw-style.ts)
4. Add to `observedAttributes` in [src/web/mini-art-bw.js](src/web/mini-art-bw.js)
5. Update `#sync()` method to handle the new attribute

**Adding a new CSS layer**:
1. Append layer string to `backgroundLayers()` in [src/domain/bw-style.ts](src/domain/bw-style.ts)
2. Update `BLEND_MODES` string to match layer count
3. Mirror changes in [src/web/mini-art-bw.js](src/web/mini-art-bw.js) `#template()` method

## Important Constraints

**Black & White Only**: All color output is grayscale
- `sat` is coerced to `0%`
- `hue` is accepted but has no visual effect
- Light gray background via `hsl(0, 0%, var(--L))` provides base tone (50-70% lightness)
- Patterns use pure colors: `#000` (black), `#fff` (white), `#888` (mid-gray)
- Background and patterns combine via `background-blend-mode`

**SSR-Client Parity**: Keep these files in sync
- [src/domain/bw-style.ts](src/domain/bw-style.ts) (TypeScript for SSR) ↔ [src/web/mini-art-bw.js](src/web/mini-art-bw.js) template (vanilla JS)
- Defaults must match (`DEFAULTS` object vs hardcoded CSS vars)
- Layer order and blend modes must be identical

**No Build Step**: Direct file serving
- [src/web/mini-art-bw.js](src/web/mini-art-bw.js) is vanilla ES module (no transpilation)
- Server reads and serves it directly at `/web/mini-art-bw.js`
