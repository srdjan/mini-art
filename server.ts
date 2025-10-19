import { renderComponentShadow } from "./src/domain/ssr.ts";
import { attrsToConfig } from "./src/domain/parse.ts";
import { queryToAttrs } from "./src/domain/parse.ts";
import { randomizeAttrs } from "./src/domain/randomize.ts";

// server.ts
// Deno SSR + Declarative Shadow DOM + single-file Web Component (black & white only)
Deno.serve({ port: Number(Deno.env.get("PORT") ?? "8070") }, async (req) => {
  const url = new URL(req.url);

  // Serve the Web Component module as a static ES module
  if (url.pathname === "/web/mini-art-bw.js") {
    const js = await Deno.readTextFile("./src/web/mini-art-bw.js");
    return new Response(js, {
      headers: { "content-type": "application/javascript; charset=utf-8" },
    });
  }

  // Main page: show canonical examples + optional query-based tile
  const tiles: string[] = [];

  // Check for ?random query param
  const randomCount = url.searchParams.get("random");
  if (randomCount) {
    const count = Number(randomCount) || 6;
    Array.from({ length: count }, () => tiles.push(renderTile(randomizeAttrs())));
  } else {
    // If query params given, render a tile from them first
    const qAttrs = queryToAttrs(url.searchParams);
    const hasQ = Object.values(qAttrs).some((v) =>
      v != null && v !== false && v !== ""
    );
    if (hasQ) tiles.push(renderTile(qAttrs));

    // Canonical examples - showcase variety of backgrounds
    tiles.push(
      // Grayscale backgrounds (default)
      renderTile({ seed: "1", size: "280px" }),
      renderTile({ seed: "3", size: "280px", lit: "62%" }),
      // Basic colors
      renderTile({ seed: "4", size: "280px", bg: "white" }),
      renderTile({ seed: "5", size: "280px", bg: "black" }),
      // Vibrant colors
      renderTile({ seed: "2", size: "280px", bg: "pink", template: "geometric" }),
      renderTile({ seed: "6", size: "280px", bg: "cyan", template: "radial" }),
      renderTile({ seed: "1", size: "280px", bg: "green", template: "grid" }),
      renderTile({ seed: "3", size: "280px", bg: "blue", template: "angular" }),
      // Muted/soft colors
      renderTile({ seed: "4", size: "280px", bg: "slate" }),
      renderTile({ seed: "2", size: "280px", bg: "orange", template: "grid" }),
      renderTile({ seed: "5", size: "280px", bg: "softblue" }),
      renderTile({ seed: "1", size: "280px", bg: "paleblue", template: "radial" }),
    );
  }

  return new Response(renderPage(tiles, "mini-art-bw (SSR + Shadow DOM)"), {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
});

/** Renders the full HTML page with a grid of tiles */
function renderPage(tiles: string[], title: string): string {
  const grid = tiles.join("\n");
  return /*html*/ `<!doctype html>
<meta charset="utf-8" />
<title>mini-art-bw • ${title}</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  body{margin:0;background:#f5f5f5;color:#1f2937;font:14px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  header{padding:1rem 1.25rem;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center}
  main{padding:1.25rem;display:grid;gap:1.25rem}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,280px);gap:1.25rem;justify-content:center}
  .card{display:grid;gap:.5rem;justify-items:center}
  .card mini-art-bw{width:280px;height:280px;background:#fff;border:1px solid #d1d5db;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1)}
  .card-actions{display:flex;flex-direction:column;gap:.25rem;align-items:center;width:100%}
  .copy-btn{display:inline-flex;align-items:center;gap:.375rem;background:#fff;color:#374151;border:1px solid #d1d5db;padding:.375rem .75rem;border-radius:6px;cursor:pointer;font-size:13px;transition:all .15s}
  .copy-btn:hover{background:#f9fafb;border-color:#9ca3af}
  .copy-btn.copied{background:#059669;border-color:#10b981;color:#fff}
  .copy-btn svg{flex-shrink:0}
  small{opacity:.7;font-size:12px}
  nav{display:flex;gap:1rem;align-items:center}
  nav a{color:#60a5fa;text-decoration:none;font-size:14px}
  nav a:hover{text-decoration:underline}
  .github-link{display:inline-flex;align-items:center;color:#374151;transition:color .15s}
  .github-link:hover{color:#1f2937}
  .github-link svg{width:24px;height:24px}
  #randomize{background:#3b82f6;color:#fff;border:none;padding:.5rem 1rem;border-radius:6px;cursor:pointer;font-size:14px}
  #randomize:hover{background:#2563eb}
</style>

<header>
  <div>
    <h1 style="margin:0;font-size:16px">${title}</h1>
    <small>Pure CSS • black & white • minimalist geometric patterns</small>
  </div>
  <nav>
    <a href="https://github.com/srdjan/mini-art" target="_blank" rel="noopener noreferrer" class="github-link" title="View on GitHub">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    </a>
    <button id="randomize">Randomize</button>
  </nav>
</header>

<main>
  <div class="grid">
    ${grid}
  </div>
</main>

<script type="module" src="/web/mini-art-bw.js"></script>

<script type="module">
// Randomize button: reload with random tiles
document.getElementById("randomize")?.addEventListener("click", () => {
  window.location.href = "/?random=6";
});

// Copy link buttons
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;

  const params = btn.dataset.params;
  const url = window.location.origin + window.location.pathname + "?" + params;

  try {
    await navigator.clipboard.writeText(url);

    // Visual feedback
    const originalText = btn.innerHTML;
    btn.classList.add("copied");
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';

    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerHTML = originalText;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
    btn.textContent = "Failed to copy";
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 2000);
  }
});

// Demo: dynamic property updates
window.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector("mini-art-bw[seed='2']");
  if (el) {
    setTimeout(() => { el.lit = "72%"; }, 2000);
  }
});
</script>
`;
}

/** SSR helper: renders one <mini-art-bw> with Declarative Shadow DOM content.
 *  NOTE: Attributes accept strings; booleans are presence-only.
 */
function renderTile(attrs: Record<string, string | boolean | undefined>) {
  const {
    template,
    size,
    seed,
    hue,
    sat,
    lit,
    cell,
    r,
    a1,
    a2,
    a3,
    animate,
    bg,
  } = attrs;

  const attr = (k: string, v: any) =>
    v == null || v === false ? "" : (v === true ? ` ${k}` : ` ${k}="${v}"`);
  const a = attr("template", template) + attr("size", size) + attr("seed", seed) + attr("hue", hue) +
    attr("sat", sat) +
    attr("lit", lit) + attr("cell", cell) + attr("r", r) + attr("a1", a1) +
    attr("a2", a2) + attr("a3", a3) + attr("animate", animate) + attr("bg", bg);

  // Pre-render the same markup the element would produce (declarative shadow DOM)
  const shadow = renderComponentShadow(attrsToConfig(attrs));

  // Build query string for sharing
  const params = new URLSearchParams();
  if (template) params.set("template", template as string);
  if (seed) params.set("seed", seed as string);
  if (lit) params.set("lit", lit as string);
  if (cell) params.set("cell", cell as string);
  if (r) params.set("r", r as string);
  if (a1) params.set("a1", a1 as string);
  if (a2) params.set("a2", a2 as string);
  if (a3) params.set("a3", a3 as string);
  if (animate) params.set("animate", "");
  if (bg) params.set("bg", bg as string);
  const queryString = params.toString();

  return /*html*/ `<div class="card">
    <mini-art-bw${a}>${shadow}</mini-art-bw>
    <div class="card-actions">
      <button class="copy-btn" data-params="${queryString}" title="Copy link to this artwork">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        Copy Link
      </button>
      <small>${
    [
      template ? `template="${template}"` : "",
      seed ? `seed="${seed}"` : "",
      lit ? `lit="${lit}"` : "",
      cell ? `cell="${cell}"` : "",
      r ? `r="${r}"` : "",
      a1 ? `a1="${a1}"` : "",
      a2 ? `a2="${a2}"` : "",
      a3 ? `a3="${a3}"` : "",
      animate ? "animate" : "",
      bg ? `bg="${bg}"` : "",
    ].filter(Boolean).join(" ")
  }</small>
    </div>
  </div>`;
}
