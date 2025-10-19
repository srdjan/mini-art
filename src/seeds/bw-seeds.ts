import type { SeedId, Percent, Angle } from "../types.ts";

export type SeedPreset = {
  readonly L: Percent;
  readonly a1: Angle;
  readonly a2: Angle;
  readonly a3: Angle;
};

export const BW_SEEDS: Readonly<Record<SeedId, SeedPreset>> = {
  "1": { L: "58%", a1: "0turn",   a2: ".18turn", a3: ".42turn" },
  "2": { L: "54%", a1: ".07turn", a2: ".22turn", a3: ".36turn" },
  "3": { L: "62%", a1: ".12turn", a2: ".31turn", a3: ".50turn" },
  "4": { L: "50%", a1: ".20turn", a2: ".04turn", a3: ".28turn" },
  "5": { L: "65%", a1: ".33turn", a2: ".11turn", a3: ".63turn" },
  "6": { L: "56%", a1: ".41turn", a2: ".27turn", a3: ".79turn" },
} as const;

