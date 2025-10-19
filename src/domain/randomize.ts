import type { ArtConfig, Angle, Percent, Length, SeedId, TemplateId } from "../types.ts";

/**
 * Generates a random number between min and max (inclusive)
 */
const randomRange = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

/**
 * Generates a random integer between min and max (inclusive)
 */
const randomInt = (min: number, max: number): number =>
  Math.floor(randomRange(min, max + 1));

/**
 * Randomly picks an element from an array
 */
const pick = <T>(arr: readonly T[]): T =>
  arr[randomInt(0, arr.length - 1)];

/**
 * Generates random attributes for the mini-art component.
 *
 * Strategy:
 * - 50% chance: use a random seed (preset angles + lightness)
 * - 50% chance: fully randomize all parameters
 *
 * This creates a good balance between curated presets and wild variations.
 */
export const randomizeConfig = (): ArtConfig => {
  const useSeed = Math.random() < 0.5;

  if (useSeed) {
    // Use a random seed preset
    const seeds: readonly SeedId[] = ["1", "2", "3", "4", "5", "6"];
    const seed = pick(seeds);

    return {
      size: "280px" as Length, // Fixed size for consistent layout
      // Seed will provide L, a1, a2, a3 via attrsToConfig
      // We can optionally override some properties
      cell: `${randomInt(8, 14)}px` as Length, // Smaller range for denser patterns
      r: randomRange(0.80, 0.92).toFixed(2), // Tighter range for better visibility
      animate: Math.random() < 0.3, // 30% chance of animation
      // Note: to use seed, we need to return it as an attr, not in ArtConfig
      // So we'll create a separate function for attrs
    };
  }

  // Fully randomized parameters
  return {
    size: "280px" as Length, // Fixed size for consistent layout
    L: `${randomInt(50, 70)}%` as Percent, // Narrower range for better visibility
    cell: `${randomInt(8, 14)}px` as Length, // Smaller range for denser patterns
    r: randomRange(0.80, 0.92).toFixed(2), // Tighter range for better visibility
    a1: `${randomRange(0, 1).toFixed(3)}turn` as Angle,
    a2: `${randomRange(0, 1).toFixed(3)}turn` as Angle,
    a3: `${randomRange(0, 1).toFixed(3)}turn` as Angle,
    animate: Math.random() < 0.3, // 30% chance of animation
  };
};

/**
 * Generates random attributes as a record (for use with attrsToConfig)
 * This variant can include 'seed' as a string attribute.
 */
export const randomizeAttrs = (): Record<string, string | boolean | undefined> => {
  // Randomly pick a template for distinct visual styles
  // Exclude "minimal" as it's too sparse for random generation
  const templates: readonly TemplateId[] = ["geometric", "grid", "radial", "angular"];
  const template = pick(templates);

  const useSeed = Math.random() < 0.5;

  if (useSeed) {
    const seeds: readonly SeedId[] = ["1", "2", "3", "4", "5", "6"];
    return {
      template,
      seed: pick(seeds),
      size: "280px", // Fixed size for consistent layout
      cell: `${randomInt(8, 14)}px`, // Smaller range for denser patterns
      r: randomRange(0.80, 0.92).toFixed(2), // Tighter range for better visibility
      animate: Math.random() < 0.3,
    };
  }

  return {
    template,
    size: "280px", // Fixed size for consistent layout
    lit: `${randomInt(50, 70)}%`, // Narrower range for better visibility
    cell: `${randomInt(8, 14)}px`, // Smaller range for denser patterns
    r: randomRange(0.80, 0.92).toFixed(2), // Tighter range for better visibility
    a1: `${randomRange(0, 1).toFixed(3)}turn`,
    a2: `${randomRange(0, 1).toFixed(3)}turn`,
    a3: `${randomRange(0, 1).toFixed(3)}turn`,
    animate: Math.random() < 0.3,
  };
};
