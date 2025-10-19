# Generative art Web Component 

A minimal **Deno** server that SSR-renders generative art using a **declarative Shadow DOM** Web Component `<mini-art-bw>`.
The component produces **black & white** “mini art” tiles using **only CSS gradients**—no canvas, no images... Pure CSS, Black & White

## Run

```bash
deno run --allow-net --allow-env server.ts
```

Open http://localhost:8070

To use a custom port:
```bash
PORT=3000 deno run --allow-net --allow-env server.ts
```

## Random Generation

The server includes a randomizer that generates random values for all attributes:

- **Random tiles via query param**: `http://localhost:8070/?random=6` (generates 6 random tiles)
- **Randomize button**: Click the "Randomize" button in the UI to generate new random tiles
- **Copy Link button**: Each tile has a "Copy Link" button that copies a shareable URL with all parameters to your clipboard

The randomizer creates distinct, fully-developed visual styles by:
1. **Always** picking a random template (geometric, grid, radial, angular)
   - Note: "minimal" excluded to ensure all patterns are well-developed
2. Using optimized parameter ranges for better visibility (cell: 8-14px, lit: 50-70%)
3. Then using one of two strategies (50/50 chance):
   - Pick a random seed (1-6) and randomly vary size, cell, r, and animation
   - Fully randomize all parameters (lit, a1, a2, a3, size, cell, r)

## Attributes / properties

| Attribute | Type / Unit | Purpose | Notes |
|---|---|---|---|
| `template` | `geometric` \| `grid` \| `radial` \| `angular` \| `minimal` | Visual pattern style | Determines the type of gradients used |
| `size` | CSS length | Tile width (height matches via `aspect-ratio`) | e.g. `size="320px"` |
| `seed` | `"1"`…`"6"` | Presets for angles + base lightness | Explicit attributes override seed defaults |
| `hue` | number (0–360) | **Ignored visually** (B/W) | Kept for API symmetry |
| `sat` | percent | **Coerced to `0%`** | Ensures grayscale |
| `lit` | percent | Base lightness for the tile | e.g. `lit="62%"` |
| `cell` | CSS length | Coarse "pixel" grain | e.g. `cell="10px"` |
| `r` | 0–1 | Vignette radius factor | `.9` = larger clear area |
| `a1`,`a2`,`a3` | `<angle>` | Structural gradient angles | Animatable |
| `animate` | boolean | Spins `a1/a2/a3` | Use as presence attribute |

## Pattern Templates

The component supports 5 distinct visual styles via the `template` attribute:

- **geometric** (default): Stripes + circles + perpendicular lines — Swiss design aesthetic
- **grid**: Horizontal + vertical lines — Grid paper aesthetic
- **radial**: Concentric circles from multiple focal points — Organic, flowing
- **angular**: Conic gradients — Sunburst/kaleidoscope patterns
- **minimal**: Sparse, large-scale patterns — Emphasis on negative space

## Notes
- **SSR-first:** The tile is pre-rendered via **Declarative Shadow DOM**, then the custom element class augments it on the client.
- **Minimalist B/W:** Uses only pure black (#000), white (#fff), and mid-gray (#888) for clean, Swiss design-inspired patterns on light gray backgrounds.
- **Visible on any background:** Each tile has a light gray background (controlled by `lit` attribute) making patterns visible on both light and dark page backgrounds.
- **No dependencies** and **single file** (besides this README).

Feel free to embed `<mini-art-bw>` directly in any SSR pipeline that supports declarative shadow DOM (or hydrate on the client only).

