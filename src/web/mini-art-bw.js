/**
 * mini-art-bw — Web Component module
 * Pure CSS, generative art inside Shadow DOM.
 *
 * Attributes:
 *  - size: CSS length (tile width)
 *  - seed: "1".."6" (preset angles + base lightness)
 *  - hue: number (ignored visually; kept for API symmetry)
 *  - sat: percent (coerced to 0%)
 *  - lit: percent (base gray; default 58%)
 *  - cell: CSS length (pixel grain)
 *  - r: 0..1 (vignette radius)
 *  - a1,a2,a3: <angle> (pattern angles)
 *  - animate: presence boolean (spins a1/a2/a3)
 *  - bg: "white" | "black" | "yellow" (background color)
 */
class MiniArtBW extends HTMLElement {
  static observedAttributes = [
    "template","hue","sat","lit","cell","r","a1","a2","a3","seed","size","animate","bg"
  ];

  static seeds = {
    "1": { L: "58%", a1: "0turn",   a2: ".18turn", a3: ".42turn" },
    "2": { L: "54%", a1: ".07turn", a2: ".22turn", a3: ".36turn" },
    "3": { L: "62%", a1: ".12turn", a2: ".31turn", a3: ".50turn" },
    "4": { L: "50%", a1: ".20turn", a2: ".04turn", a3: ".28turn" },
    "5": { L: "65%", a1: ".33turn", a2: ".11turn", a3: ".63turn" },
    "6": { L: "56%", a1: ".41turn", a2: ".27turn", a3: ".79turn" },
  };

  static bgColors = {
    white: "#ffffff",
    black: "#000000",
    yellow: "#ffd700",
    pink: "#f7768e",      // Bright pink
    green: "#9ece6a",     // Vivid green
    blue: "#7aa2f7",      // Electric blue
    slate: "#7b82a3",     // Muted slate
    orange: "#ff9e64",    // Warm orange
    softblue: "#c0caf5",  // Soft blue
    cyan: "#89ddff",      // Cyan
    paleblue: "#e3ecff",  // Pale blue-white
  };

  static templates = {
    geometric: `repeating-linear-gradient(var(--a1), #000 0 2px, transparent 2px var(--cell)),
      repeating-radial-gradient(circle at 38% 42%, transparent 0 calc(var(--cell) * 1.5), #888 calc(var(--cell) * 1.5) calc(var(--cell) * 1.8), transparent calc(var(--cell) * 1.8) calc(var(--cell) * 2)),
      repeating-linear-gradient(var(--a2), transparent 0 calc(var(--cell) * 2.5), #fff 0 calc(var(--cell) * 2.5 + 1px), transparent calc(var(--cell) * 2.5 + 1px) calc(var(--cell) * 3))`,
    grid: `repeating-linear-gradient(0deg, #000 0 1px, transparent 1px var(--cell)),
      repeating-linear-gradient(90deg, #000 0 1px, transparent 1px var(--cell)),
      repeating-linear-gradient(var(--a1), transparent 0 calc(var(--cell) * 4), #888 0 2px, transparent 2px calc(var(--cell) * 5))`,
    radial: `repeating-radial-gradient(circle at 30% 30%, #000 0 2px, transparent 2px calc(var(--cell) * 1.2)),
      repeating-radial-gradient(circle at 70% 70%, #fff 0 1px, transparent 1px var(--cell)),
      repeating-radial-gradient(circle at 50% 50%, #888 0 3px, transparent 3px calc(var(--cell) * 1.8))`,
    angular: `repeating-conic-gradient(from var(--a1) at 50% 50%, #000 0 5deg, transparent 5deg 10deg),
      repeating-conic-gradient(from var(--a2) at 50% 50%, #fff 0 3deg, transparent 3deg 8deg),
      repeating-conic-gradient(from var(--a3) at 50% 50%, #888 0 8deg, transparent 8deg 16deg)`,
    minimal: `repeating-linear-gradient(var(--a1), transparent 0 calc(var(--cell) * 6), #000 0 4px, transparent 4px calc(var(--cell) * 8)),
      radial-gradient(circle at 50% 50%, #888 0 calc(var(--cell) * 0.5), transparent calc(var(--cell) * 0.5) 100%),
      repeating-linear-gradient(var(--a2), transparent 0 calc(var(--cell) * 10), #fff 0 2px, transparent 2px calc(var(--cell) * 12))`
  };

  constructor() {
    super();
    // If SSR used Declarative Shadow DOM, reuse it; otherwise create one.
    const root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    if (!this.shadowRoot?.querySelector(".art")) {
      root.innerHTML = this.#template();
    }
    this._art = this.shadowRoot.querySelector(".art");
    this.#applySeed();
    this.#sync();
  }

  attributeChangedCallback() { this.#sync(); }

  // Public JS convenience props
  get lit(){ return this.getAttribute("lit"); }
  set lit(v){ this.#setAttr("lit", v); }
  get seed(){ return this.getAttribute("seed"); }
  set seed(v){ this.#setAttr("seed", v); }
  get animate(){ return this.hasAttribute("animate"); }
  set animate(v){ v ? this.setAttribute("animate","") : this.removeAttribute("animate"); }

  #setAttr(k,v){ v==null ? this.removeAttribute(k) : this.setAttribute(k, String(v)); }

  #applySeed(){
    const s = this.getAttribute("seed");
    if (!s || !MiniArtBW.seeds[s]) return;
    const { L, a1, a2, a3 } = MiniArtBW.seeds[s];
    this._art.style.setProperty("--L", L);
    this._art.style.setProperty("--a1", a1);
    this._art.style.setProperty("--a2", a2);
    this._art.style.setProperty("--a3", a3);
  }

  #applyTemplate(){
    const t = this.getAttribute("template") || "geometric";
    const pattern = MiniArtBW.templates[t] || MiniArtBW.templates.geometric;
    this._art.style.backgroundImage = pattern;
  }

  #sync(){
    // B/W coercion: hue ignored; sat forced to 0%
    const map = (n, css, fallback) => {
      const v = this.getAttribute(n);
      if (v == null) { if (fallback!=null) this._art.style.setProperty(css, fallback); return; }
      this._art.style.setProperty(css, v);
    };

    // Apply seed defaults first (but explicit attrs can override)
    this.#applySeed();
    // Apply template patterns
    this.#applyTemplate();

    map("size","--size");
    map("lit","--L");              // base lightness (0%..100%)
    map("cell","--cell");
    map("r","--r");
    map("a1","--a1");
    map("a2","--a2");
    map("a3","--a3");

    // Background color: if bg attribute is set, use it; otherwise use grayscale
    const bg = this.getAttribute("bg");
    if (bg && MiniArtBW.bgColors[bg]) {
      this._art.style.backgroundColor = MiniArtBW.bgColors[bg];
    } else {
      const L = this.getAttribute("lit") || this._art.style.getPropertyValue("--L") || "58%";
      this._art.style.backgroundColor = `hsl(0, 0%, ${L})`;
    }

    // Enforce grayscale
    this._art.style.setProperty("--SAT","0%");
    // (hue ignored; set but has no visual impact in grayscale)
    map("hue","--H","0");

    // animation toggle
    this[this.hasAttribute("animate") ? "removeAttribute" : "setAttribute"].call(this,"data-noop",""); // no-op to trigger style recalc
    this._art.classList.toggle("animate", this.hasAttribute("animate"));
  }

  #template(){
    return /*html*/`
      <style>
        :host{display:inline-block}
        :host([size]) .art{width:var(--size)}
        /* CSS custom properties (defaults) */
        .art{
          --size:min(72vmin,420px);
          --cell:14px;
          --r:.85;
          --L:58%;   /* base opacity/lightness (B/W) */
          --H:0;     /* unused in B/W; kept for API symmetry */
          --SAT:0%;  /* forced grayscale */
          --a1:0turn; --a2:.125turn; --a3:.33turn;

          width:var(--size); aspect-ratio:1/1;
          border-radius:8px; overflow:clip;
          background-color: hsl(0, 0%, var(--L));
          /* background-image set dynamically via template attribute */
          background-blend-mode: normal, multiply, normal;

          box-shadow:0 4px 16px #0002, inset 0 0 0 1px #0001;
        }

        /* Angle properties for smooth animations */
        @property --a1 { syntax:"<angle>"; inherits:true; initial-value:0turn; }
        @property --a2 { syntax:"<angle>"; inherits:true; initial-value:.125turn; }
        @property --a3 { syntax:"<angle>"; inherits:true; initial-value:.33turn; }

        .art.animate{
          animation: spin-a1 18s linear infinite, spin-a2 24s linear infinite reverse, spin-a3 32s linear infinite;
        }
        @keyframes spin-a1{ to{ --a1: calc(var(--a1) + 1turn); } }
        @keyframes spin-a2{ to{ --a2: calc(var(--a2) + 1turn); } }
        @keyframes spin-a3{ to{ --a3: calc(var(--a3) + 1turn); } }
      </style>
      <div class="art" part="art" aria-label="Mini Art (B/W)"></div>
    `;
  }
}

customElements.define("mini-art-bw", MiniArtBW);

