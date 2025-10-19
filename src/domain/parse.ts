import type { ArtConfig, Length, SeedId, TemplateId } from "../types.ts";
import { BW_SEEDS } from "../seeds/bw-seeds.ts";

export type Attrs = Record<string, string | boolean | undefined>;

// Pure converter from element-like attrs to ArtConfig
export const attrsToConfig = (attrs: Attrs): ArtConfig => {
  const seed = attrs.seed as SeedId | undefined;
  const seedPreset: ArtConfig = seed && BW_SEEDS[seed]
    ? {
      L: BW_SEEDS[seed].L,
      a1: BW_SEEDS[seed].a1,
      a2: BW_SEEDS[seed].a2,
      a3: BW_SEEDS[seed].a3,
    }
    : {};

  const overrides: ArtConfig = {
    ...(typeof attrs.template === "string" ? { template: attrs.template as TemplateId } : {}),
    ...(typeof attrs.size === "string" ? { size: attrs.size as Length } : {}),
    ...(typeof attrs.lit === "string" ? { L: attrs.lit as any } : {}),
    ...(typeof attrs.cell === "string" ? { cell: attrs.cell as Length } : {}),
    ...(typeof attrs.r === "string" ? { r: attrs.r } : {}),
    ...(typeof attrs.a1 === "string" ? { a1: attrs.a1 as any } : {}),
    ...(typeof attrs.a2 === "string" ? { a2: attrs.a2 as any } : {}),
    ...(typeof attrs.a3 === "string" ? { a3: attrs.a3 as any } : {}),
    ...(attrs.animate === true ? { animate: true } : {}),
  };

  return { ...seedPreset, ...overrides };
};

export const queryToAttrs = (q: URLSearchParams): Attrs => ({
  template: q.get("template") ?? undefined,
  size: q.get("size") ?? undefined,
  seed: q.get("seed") ?? undefined,
  hue: q.get("hue") ?? undefined,
  sat: q.get("sat") ?? undefined,
  lit: q.get("lit") ?? undefined,
  cell: q.get("cell") ?? undefined,
  r: q.get("r") ?? undefined,
  a1: q.get("a1") ?? undefined,
  a2: q.get("a2") ?? undefined,
  a3: q.get("a3") ?? undefined,
  animate: q.has("animate") ? true : undefined,
});
