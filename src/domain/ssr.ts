import type { ArtConfig } from "../types.ts";
import { baseCssVars, BLEND_MODES, backgroundLayers, animations } from "./bw-style.ts";

const cssVarsString = (cfg: ArtConfig): string =>
  Object.entries(baseCssVars(cfg)).map(([k, v]) => `${k}: ${v};`).join("\n          ");

const styleBlock = (cfg: ArtConfig): string => {
  const layers = backgroundLayers(cfg).join(",\n            ");
  const vars = cssVarsString(cfg);
  return `<style>
        :host{display:inline-block}
        :host([size]) .art{width:var(--size)}
        .art{
          ${vars}
          width:var(--size); aspect-ratio:1/1;
          border-radius:8px; overflow:clip;
          background-color: hsl(0, 0%, var(--L));
          background-image:
            ${layers};
          background-blend-mode: ${BLEND_MODES};
          box-shadow:0 4px 16px #0002, inset 0 0 0 1px #0001;
        }
        @property --a1 { syntax:"<angle>"; inherits:true; initial-value:0turn; }
        @property --a2 { syntax:"<angle>"; inherits:true; initial-value:.125turn; }
        @property --a3 { syntax:"<angle>"; inherits:true; initial-value:.33turn; }
        .art.animate{
          animation: spin-a1 ${animations.a1}, spin-a2 ${animations.a2}, spin-a3 ${animations.a3};
        }
        @keyframes spin-a1 { to { --a1: calc(var(--a1) + 1turn); } }
        @keyframes spin-a2 { to { --a2: calc(var(--a2) + 1turn); } }
        @keyframes spin-a3 { to { --a3: calc(var(--a3) + 1turn); } }
      </style>`;
};

export const renderComponentShadow = (cfg: ArtConfig): string => {
  return `
    <template shadowrootmode="open">
      ${styleBlock(cfg)}
      <div class="art${cfg.animate ? " animate" : ""}" part="art" aria-label="Mini Art (B/W)"></div>
    </template>
  `;
};

