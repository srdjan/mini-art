export type Angle = `${number}turn`;
export type Percent = `${number}%`;
export type Length = `${number}px` | `${number}vmin` | `${number}rem` | string;

export type SeedId = "1" | "2" | "3" | "4" | "5" | "6";

export type TemplateId = "geometric" | "grid" | "radial" | "angular" | "minimal";

export type BgColor =
  | "white"
  | "black"
  | "yellow"
  | "pink"      // #f7768e - Bright pink
  | "green"     // #9ece6a - Vivid green
  | "blue"      // #7aa2f7 - Electric blue
  | "slate"     // #7b82a3 - Muted slate
  | "orange"    // #ff9e64 - Warm orange
  | "softblue"  // #c0caf5 - Soft blue
  | "cyan"      // #89ddff - Cyan
  | "paleblue"; // #e3ecff - Pale blue-white

export type ArtConfig = {
  readonly size?: Length;
  readonly L?: Percent;
  readonly cell?: Length;
  readonly r?: `${number}` | string;
  readonly a1?: Angle;
  readonly a2?: Angle;
  readonly a3?: Angle;
  readonly animate?: boolean;
  readonly template?: TemplateId;
  readonly bg?: BgColor;
};

