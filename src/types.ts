export type Angle = `${number}turn`;
export type Percent = `${number}%`;
export type Length = `${number}px` | `${number}vmin` | `${number}rem` | string;

export type SeedId = "1" | "2" | "3" | "4" | "5" | "6";

export type TemplateId = "geometric" | "grid" | "radial" | "angular" | "minimal";

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
};

