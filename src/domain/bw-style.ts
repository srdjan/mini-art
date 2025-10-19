import type { ArtConfig, Percent, Angle, TemplateId } from "../types.ts";

export const DEFAULTS = {
  size: "min(72vmin,420px)",
  cell: "14px",
  r: ".85",
  L: "58%" as Percent,
  a1: "0turn" as Angle,
  a2: ".125turn" as Angle,
  a3: ".33turn" as Angle,
} as const;

export const BLEND_MODES = "normal, multiply, normal" as const;

export const animations = {
  a1: "18s linear infinite",
  a2: "24s linear infinite reverse",
  a3: "32s linear infinite",
} as const;

export const baseCssVars = (c: ArtConfig) => ({
  "--size": c.size ?? DEFAULTS.size,
  "--cell": c.cell ?? DEFAULTS.cell,
  "--r": c.r ?? DEFAULTS.r,
  "--L": c.L ?? DEFAULTS.L,
  "--H": "0",
  "--SAT": "0%",
  "--a1": c.a1 ?? DEFAULTS.a1,
  "--a2": c.a2 ?? DEFAULTS.a2,
  "--a3": c.a3 ?? DEFAULTS.a3,
});

// Pattern templates - each creates distinctly different visual style
const TEMPLATES: Record<TemplateId, (c: ArtConfig) => readonly string[]> = {
  // Geometric: stripes + circles + perpendicular lines (Swiss design)
  geometric: () => [
    `repeating-linear-gradient(var(--a1), #000 0 2px, transparent 2px var(--cell))`,
    `repeating-radial-gradient(circle at 38% 42%, transparent 0 calc(var(--cell) * 1.5), #888 calc(var(--cell) * 1.5) calc(var(--cell) * 1.8), transparent calc(var(--cell) * 1.8) calc(var(--cell) * 2))`,
    `repeating-linear-gradient(var(--a2), transparent 0 calc(var(--cell) * 2.5), #fff 0 calc(var(--cell) * 2.5 + 1px), transparent calc(var(--cell) * 2.5 + 1px) calc(var(--cell) * 3))`,
  ],

  // Grid: horizontal + vertical lines (grid paper aesthetic)
  grid: () => [
    `repeating-linear-gradient(0deg, #000 0 1px, transparent 1px var(--cell))`,
    `repeating-linear-gradient(90deg, #000 0 1px, transparent 1px var(--cell))`,
    `repeating-linear-gradient(var(--a1), transparent 0 calc(var(--cell) * 4), #888 0 2px, transparent 2px calc(var(--cell) * 5))`,
  ],

  // Radial: concentric circles from multiple focal points
  radial: () => [
    `repeating-radial-gradient(circle at 30% 30%, #000 0 2px, transparent 2px calc(var(--cell) * 1.2))`,
    `repeating-radial-gradient(circle at 70% 70%, #fff 0 1px, transparent 1px var(--cell))`,
    `repeating-radial-gradient(circle at 50% 50%, #888 0 3px, transparent 3px calc(var(--cell) * 1.8))`,
  ],

  // Angular: conic gradients (sunburst / kaleidoscope)
  angular: () => [
    `repeating-conic-gradient(from var(--a1) at 50% 50%, #000 0 5deg, transparent 5deg 10deg)`,
    `repeating-conic-gradient(from var(--a2) at 50% 50%, #fff 0 3deg, transparent 3deg 8deg)`,
    `repeating-conic-gradient(from var(--a3) at 50% 50%, #888 0 8deg, transparent 8deg 16deg)`,
  ],

  // Minimal: sparse, large-scale patterns (negative space emphasis)
  minimal: () => [
    `repeating-linear-gradient(var(--a1), transparent 0 calc(var(--cell) * 6), #000 0 4px, transparent 4px calc(var(--cell) * 8))`,
    `radial-gradient(circle at 50% 50%, #888 0 calc(var(--cell) * 0.5), transparent calc(var(--cell) * 0.5) 100%)`,
    `repeating-linear-gradient(var(--a2), transparent 0 calc(var(--cell) * 10), #fff 0 2px, transparent 2px calc(var(--cell) * 12))`,
  ],
};

export const backgroundLayers = (c: ArtConfig): readonly string[] => {
  const template = c.template ?? "geometric";
  return TEMPLATES[template](c);
};

