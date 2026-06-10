import { useEffect, useRef } from "react";

/**
 * Living Graph v5 (production) — Phossil hero, blend style (pixel accents on warm base).
 * Force-directed organic web, not clusters. Nodes are square pixels; links are the reasoning.
 * Labels + source/time appear only on the nodes a trace lights (dots and links at rest).
 * Branching trace: threads fork, parallel links light at once, one fork crosses clusters.
 * Ambient pop + merge between traces. Gentle float, breathing hub, all coords snapped.
 * Reduced-motion safe. Prereq (global): load 'Press Start 2P' for the pixel accents.
 */

const SVGNS = "http://www.w3.org/2000/svg";

const COL: Record<string, string> = {
  goal: "#6ab6c4", question: "#e0795f", option: "#c98bdb",
  decision: "#7ec699", person: "#7aa2f7", discussion: "#9aa0ab",
};
const LEGEND: { kind: string; label: string }[] = [
  { kind: "goal", label: "GOAL" }, { kind: "question", label: "QUESTION" },
  { kind: "option", label: "OPTION" }, { kind: "decision", label: "DECISION" },
  { kind: "person", label: "PERSON" }, { kind: "discussion", label: "DISCUSSION" },
];
const PALETTE = ["#6ab6c4", "#e0795f", "#c98bdb", "#7ec699", "#7aa2f7", "#9aa0ab"];

const NODE_DEFS: { id: string; region: number; type: string; label: string; src: string; time: string }[] = [
  { id: "a1", region: 0, type: "goal", label: "Plan the launch", src: "goal", time: "Mon" },
  { id: "a2", region: 0, type: "question", label: "the timing risk", src: "a note", time: "9:40" },
  { id: "a3", region: 0, type: "discussion", label: "the team thread", src: "the thread", time: "10:15" },
  { id: "a4", region: 0, type: "decision", label: "push to next quarter", src: "decided", time: "11:00" },
  { id: "b1", region: 1, type: "goal", label: "Fix the drop-off", src: "goal", time: "Tue" },
  { id: "b2", region: 1, type: "question", label: "why day three?", src: "dashboard", time: "9:05" },
  { id: "b3", region: 1, type: "discussion", label: "the user thread", src: "the thread", time: "9:30" },
  { id: "b4", region: 1, type: "question", label: "the welcome flow?", src: "open", time: "1:10" },
  { id: "d1", region: 3, type: "question", label: "what do people want?", src: "interviews", time: "Tue" },
  { id: "d2", region: 3, type: "discussion", label: "the research notes", src: "the notes", time: "Wed" },
  { id: "d3", region: 3, type: "decision", label: "speed over features", src: "decided", time: "Thu" },
  { id: "e1", region: 4, type: "goal", label: "Choose the tool", src: "goal", time: "Mon" },
  { id: "e2", region: 4, type: "question", label: "build or buy?", src: "the doc", time: "10:00" },
  { id: "e3", region: 4, type: "option", label: "build it", src: "the doc", time: "10:20" },
  { id: "e4", region: 4, type: "decision", label: "go with buy", src: "decided", time: "11:15" },
  { id: "c1", region: 2, type: "goal", label: "Set the team's focus", src: "goal", time: "Mon" },
  { id: "c2", region: 2, type: "discussion", label: "the one on one", src: "notes", time: "2:00" },
  { id: "c3", region: 2, type: "person", label: "a teammate", src: "the thread", time: "2:10" },
  { id: "c4", region: 2, type: "decision", label: "hand off the project", src: "decided", time: "2:40" },
  { id: "f1", region: 5, type: "question", label: "the budget question", src: "the budget", time: "Fri" },
  { id: "f2", region: 5, type: "decision", label: "trim scope", src: "decided", time: "Fri" },
];

type TraceDef = { mode: string; ends: "decision" | "open"; mainCount: number; edges: string[][] };
const TRACES: TraceDef[] = [
  { mode: "make", ends: "decision", mainCount: 4, edges: [["HUB", "a1", ""], ["a1", "a2", "ran into"], ["a2", "a3", "discussed in"], ["a3", "a4", "led to"]] },
  { mode: "investigate", ends: "open", mainCount: 4, edges: [["HUB", "b1", ""], ["b1", "b2", "ran into"], ["b2", "b3", "discussed in"], ["b3", "b4", "led to"], ["b3", "d1", "raised"]] },
  { mode: "synthesize", ends: "decision", mainCount: 3, edges: [["HUB", "d1", ""], ["d1", "d2", "discussed in"], ["d2", "d3", "led to"]] },
  { mode: "coordinate", ends: "decision", mainCount: 3, edges: [["HUB", "e1", ""], ["e1", "e2", "led to"], ["e2", "e4", "led to"], ["e2", "e3", "weighed"]] },
  { mode: "counsel", ends: "decision", mainCount: 4, edges: [["HUB", "c1", ""], ["c1", "c2", "discussed in"], ["c2", "c3", "raised by"], ["c3", "c4", "led to"]] },
  { mode: "decide", ends: "decision", mainCount: 2, edges: [["HUB", "f1", ""], ["f1", "f2", "led to"]] },
];
const EXTRA: string[][] = [["a3", "c2"], ["d3", "e2"], ["a2", "f1"], ["b4", "d2"], ["c4", "e1"], ["a4", "d1"], ["c3", "b3"]];

const PIXEL = "'Press Start 2P', monospace";
const LG_CSS = `
.lg-root{position:relative}
.lg-root .bk{position:absolute;width:10px;height:10px;border:2px solid var(--accent)}
.lg-root .bk.tl{top:-2px;left:-2px;border-right:0;border-bottom:0}
.lg-root .bk.tr{top:-2px;right:-2px;border-left:0;border-bottom:0}
.lg-root .bk.bl{bottom:-2px;left:-2px;border-right:0;border-top:0}
.lg-root .bk.br{bottom:-2px;right:-2px;border-left:0;border-top:0}
.lg-root .winbar{font-family:${PIXEL};font-size:7.5px;color:var(--text-tertiary);display:flex;align-items:center;gap:7px;margin:-4px 0 12px}
.lg-root .winbar .led{width:6px;height:6px;background:var(--success,#84c987)}
.lg-root .ambient{transition:opacity .5s}
.lg-root.tracing .ambient{opacity:.14}
.lg-root .edges{transition:opacity .55s}
.lg-root .edges.dim{opacity:.20}
.lg-root .node{transition:opacity .5s}
.lg-root .node.dim{opacity:.20}
.lg-root .node .halo{opacity:0;transition:opacity .4s}
.lg-root .node .core{transition:stroke .35s, fill .35s}
.lg-root .node .lbl{transition:fill .35s, opacity .4s}
.lg-root .node .srcline{opacity:0;transition:opacity .4s}
.lg-root .node.lit .halo{opacity:.30}
.lg-root .node.lit .core{stroke:var(--trace,#f6cd83);fill:#241d10}
.lg-root .node.lit .lbl{fill:var(--text-primary);opacity:1}
.lg-root .node.lit .srcline{opacity:1}
.lg-root.labels-hidden .node .lbl{opacity:0}
.lg-root.labels-hidden .node.lit .lbl{opacity:1}
.lg-root .lbl,.lg-root .srcline,.lg-root .verb{font-family:var(--font-mono);paint-order:stroke;stroke:var(--bg-elevated);stroke-width:2.6px;stroke-linejoin:round}
.lg-root .verb{opacity:0;transition:opacity .35s}
.lg-root .verb.show{opacity:1}
.lg-root .amber{stroke:var(--trace,#f6cd83);stroke-width:2;stroke-linecap:butt}
.lg-cap{display:grid;margin-top:12px;min-height:46px;text-align:center}
.lg-cap > *{grid-area:1/1;align-self:center}
.lg-tagline{font-family:var(--font-mono);font-size:10px;color:var(--text-tertiary);margin:0;transition:opacity .5s}
.lg-sentence{opacity:0;transition:opacity .5s;display:flex;flex-direction:column;align-items:center;gap:5px;pointer-events:none}
.lg-eyebrow{font-family:${PIXEL};font-size:7px;letter-spacing:.04em;color:var(--accent)}
.lg-main{font-family:var(--font-mono);font-size:11.5px;line-height:1.7;color:var(--text-secondary);max-width:560px}
.lg-main .cn{color:var(--text-primary)}
.lg-main .cv{color:var(--trace,#f6cd83);font-style:italic;margin:0 .3em}
.lg-main .open{color:var(--text-tertiary);margin-left:.45em;font-style:italic}
.lg-branch{font-family:var(--font-mono);font-size:9.5px;color:var(--text-tertiary);opacity:.92;max-width:520px}
.lg-branch .cv{color:var(--trace,#f6cd83);font-style:italic}
.lg-branch .cn{color:var(--text-secondary)}
.lg-root.tracing .lg-tagline{opacity:0}
.lg-root.tracing .lg-sentence{opacity:1}
`;

export default function LivingGraph() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const branchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current, host = hostRef.current;
    const eyebrow = eyebrowRef.current, sentMain = mainRef.current, sentBranch = branchRef.current;
    if (!root || !host || !eyebrow || !sentMain || !sentBranch) return;

    const REDUCED = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = 560, H = 480, CX = 280, CY = 240;
    const SNAP = 2; const S = (v: number) => Math.round(v / SNAP) * SNAP;
    root.classList.add("labels-hidden");

    function el(tag: string, attrs: Record<string, string | number>): any {
      const e = document.createElementNS(SVGNS, tag);
      for (const k in attrs) e.setAttribute(k, String(attrs[k]));
      return e;
    }

    // local node objects (immutable defs -> per-mount instances)
    const NODES: any[] = NODE_DEFS.map((d) => ({ ...d }));
    const byId: any = { HUB: { id: "HUB", region: -1 } };
    NODES.forEach((n) => { byId[n.id] = n; });
    const regionOf: any = {}; NODES.forEach((n) => { regionOf[n.id] = n.region; });
    const HUB = byId.HUB;

    const seen: any = {}, RESTING: string[][] = [];
    TRACES.forEach((t) => t.edges.forEach((e) => { const k = e[0] + "|" + e[1]; if (!seen[k]) { seen[k] = 1; RESTING.push([e[0], e[1]]); } }));
    EXTRA.forEach((e) => { const k = e[0] + "|" + e[1]; if (!seen[k]) { seen[k] = 1; RESTING.push(e); } });
    const LINKS = RESTING.filter(([a]) => a !== "HUB");
    const SPOKES = RESTING.filter(([a]) => a === "HUB");

    // ---------- force-directed layout (HUB pinned at center) ----------
    const L = 74, REP = 68;
    function layout() {
      NODES.forEach((n) => { const ang = Math.random() * Math.PI * 2, r = 72 + Math.random() * 150; n.home = { x: CX + Math.cos(ang) * r, y: CY + Math.sin(ang) * r }; });
      HUB.home = { x: CX, y: CY };
      const all = NODES; const adj = LINKS.concat(SPOKES.map((s) => ["HUB", s[1]]));
      let step = 12;
      for (let it = 0; it < 260; it++) {
        const fx: any = {}, fy: any = {}; all.forEach((n) => { fx[n.id] = 0; fy[n.id] = 0; });
        for (let a = 0; a < all.length; a++) for (let b = a + 1; b < all.length; b++) {
          const A = all[a], B = all[b]; let dx = A.home.x - B.home.x, dy = A.home.y - B.home.y, d = Math.hypot(dx, dy) || 0.01;
          if (d < REP * 2.4) { let f = (REP * REP) / (d * d); if (f > 4) f = 4; const ux = dx / d, uy = dy / d; fx[A.id] += ux * f; fy[A.id] += uy * f; fx[B.id] -= ux * f; fy[B.id] -= uy * f; }
        }
        adj.forEach(([ai, bi]) => { const A = byId[ai], B = byId[bi]; let dx = B.home.x - A.home.x, dy = B.home.y - A.home.y, d = Math.hypot(dx, dy) || 0.01; const f = (d - L) * 0.06, ux = dx / d, uy = dy / d; if (ai !== "HUB") { fx[ai] += ux * f; fy[ai] += uy * f; } if (bi !== "HUB") { fx[bi] -= ux * f; fy[bi] -= uy * f; } });
        all.forEach((n) => { fx[n.id] += (CX - n.home.x) * 0.004; fy[n.id] += (CY - n.home.y) * 0.004; let hdx = n.home.x - CX, hdy = n.home.y - CY, hd = Math.hypot(hdx, hdy) || 0.01; if (hd < 70) { const f = (70 - hd) * 0.06; fx[n.id] += hdx / hd * f; fy[n.id] += hdy / hd * f; } });
        all.forEach((n) => { let mx = fx[n.id], my = fy[n.id]; const m = Math.hypot(mx, my); if (m > step) { mx = mx / m * step; my = my / m * step; } n.home.x += mx; n.home.y += my; n.home.x = Math.max(48, Math.min(W - 48, n.home.x)); n.home.y = Math.max(24, Math.min(H - 26, n.home.y)); });
        step *= 0.992;
      }
    }
    function decideSides() {
      NODES.forEach((n) => {
        let sx = 0, sy = 0, c = 0;
        NODES.forEach((m) => { if (m === n) return; const dx = m.home.x - n.home.x, dy = m.home.y - n.home.y, d = Math.hypot(dx, dy); if (d < 92) { sx += dx / d; sy += dy / d; c++; } });
        let ox = -sx, oy = -sy; if (c === 0) { ox = 0; oy = -1; }
        if (n.home.x < 120) ox = Math.abs(ox); if (n.home.x > W - 120) ox = -Math.abs(ox);
        if (n.home.y < 70) oy = Math.abs(oy); if (n.home.y > H - 70) oy = -Math.abs(oy);
        let side; if (Math.abs(ox) > Math.abs(oy) * 1.1) side = ox > 0 ? "right" : "left"; else side = oy > 0 ? "down" : "up";
        if (side === "up") { n._lx = 0; n._ly = -11; n._anchor = "middle"; n._sx = 0; n._sy = 15; }
        else if (side === "down") { n._lx = 0; n._ly = 15; n._anchor = "middle"; n._sx = 0; n._sy = -11; }
        else if (side === "left") { n._lx = -9; n._ly = 3; n._anchor = "end"; n._sx = 0; n._sy = 15; }
        else { n._lx = 9; n._ly = 3; n._anchor = "start"; n._sx = 0; n._sy = 15; }
      });
    }

    // ---------- legend is rendered in JSX; build the svg here ----------
    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("width", "100%"); svg.setAttribute("aria-hidden", "true");
    svg.style.display = "block"; svg.style.height = "auto"; svg.style.maxHeight = "480px";
    (svg.style as any).shapeRendering = "crispEdges";

    const gEdges = el("g", { class: "edges" }), gAmbient = el("g", { class: "ambient" }), gTrace = el("g", {}), gNodes = el("g", {}), gVerbs = el("g", {});
    svg.appendChild(gEdges); svg.appendChild(gAmbient); svg.appendChild(gTrace); svg.appendChild(gNodes); svg.appendChild(gVerbs);

    const edgeEls: any[] = [];
    RESTING.forEach(([a, b]) => {
      const child = byId[b]; const cross = (a !== "HUB" && regionOf[a] !== regionOf[b]);
      const attrs: any = { x1: 0, y1: 0, x2: 0, y2: 0, stroke: cross ? "var(--accent-cyan)" : COL[child.type], "stroke-width": 1, opacity: cross ? .22 : .42 };
      if (cross) attrs["stroke-dasharray"] = "2 4";
      const ln = el("line", attrs); gEdges.appendChild(ln); edgeEls.push({ a, b, ln });
    });

    const hubHalo = el("rect", { width: 34, height: 34, fill: "var(--accent)", opacity: .12 });
    const hubC = el("rect", { width: 18, height: 18, fill: "var(--accent)" });
    const hubT = el("text", { x: CX, y: CY, "text-anchor": "middle", "dominant-baseline": "central", "font-size": 7, fill: "var(--bg)" });
    hubT.style.fontFamily = PIXEL; hubT.textContent = "YOU";
    gNodes.appendChild(hubHalo); gNodes.appendChild(hubC); gNodes.appendChild(hubT);

    const NSIZE = 10, HSIZE = 26;
    NODES.forEach((n) => {
      const g = el("g", { class: "node" });
      const halo = el("rect", { class: "halo", width: HSIZE, height: HSIZE, fill: "var(--trace, #f6cd83)" });
      const core = el("rect", { class: "core", width: NSIZE, height: NSIZE, fill: "var(--bg-subtle)", stroke: COL[n.type], "stroke-width": 1.6 });
      const lbl = el("text", { class: "lbl", x: 0, y: 0, "text-anchor": "middle", "font-size": 8, fill: "var(--text-tertiary)" }); lbl.textContent = n.label;
      const src = el("text", { class: "srcline", x: 0, y: 0, "text-anchor": "middle", "font-size": 6.8, fill: "var(--trace, #f6cd83)" }); src.textContent = n.src + " \u00b7 " + n.time;
      g.appendChild(halo); g.appendChild(core); g.appendChild(lbl); g.appendChild(src);
      gNodes.appendChild(g); n._g = g; n._core = core; n._halo = halo; n._lbl = lbl; n._src = src;
    });

    function buildLayout() { layout(); decideSides(); NODES.forEach((n) => { n._lbl.setAttribute("text-anchor", n._anchor); }); }

    // ---------- float ----------
    let floatOn = !REDUCED;
    function initFloat() { ([HUB] as any[]).concat(NODES).forEach((n: any) => { n._x = n.home.x; n._y = n.home.y; n._phx = Math.random() * Math.PI * 2; n._phy = Math.random() * Math.PI * 2; n._spx = .5 + Math.random() * .45; n._spy = .5 + Math.random() * .45; }); }
    const AMP = 2.6;
    function computePositions(t: number) { const ts = t / 1000; ([HUB] as any[]).concat(NODES).forEach((n: any) => { if (floatOn) { n._x = n.home.x + Math.sin(ts * n._spx + n._phx) * AMP; n._y = n.home.y + Math.cos(ts * n._spy + n._phy) * AMP; } else { n._x = n.home.x; n._y = n.home.y; } }); }
    function applyPositions(t: number) {
      let hs = 18; if (floatOn) { hs = Math.round((18 + Math.sin(t / 1000 * .7) * 2) / 2) * 2; }
      hubC.setAttribute("x", String(S(HUB._x - hs / 2))); hubC.setAttribute("y", String(S(HUB._y - hs / 2))); hubC.setAttribute("width", String(hs)); hubC.setAttribute("height", String(hs));
      hubHalo.setAttribute("x", String(S(HUB._x - 17))); hubHalo.setAttribute("y", String(S(HUB._y - 17)));
      hubT.setAttribute("x", String(S(HUB._x))); hubT.setAttribute("y", String(S(HUB._y)));
      NODES.forEach((n) => { const x = S(n._x), y = S(n._y);
        n._core.setAttribute("x", String(x - NSIZE / 2)); n._core.setAttribute("y", String(y - NSIZE / 2));
        n._halo.setAttribute("x", String(x - HSIZE / 2)); n._halo.setAttribute("y", String(y - HSIZE / 2));
        n._lbl.setAttribute("x", String(x + (n._lx || 0))); n._lbl.setAttribute("y", String(y + (n._ly || -11)));
        n._src.setAttribute("x", String(x + (n._sx || 0))); n._src.setAttribute("y", String(y + (n._sy || 15))); });
      edgeEls.forEach((e) => { const A = byId[e.a], B = byId[e.b]; e.ln.setAttribute("x1", String(S(A._x))); e.ln.setAttribute("y1", String(S(A._y))); e.ln.setAttribute("x2", String(S(B._x))); e.ln.setAttribute("y2", String(S(B._y))); });
      active.edges.forEach((E: any) => { if (!E.ln) return; const A = byId[E.from], B = byId[E.to];
        E.ln.setAttribute("x1", String(S(A._x))); E.ln.setAttribute("y1", String(S(A._y)));
        if (E.grow) { const p = ease(clamp((t - E.grow.start) / E.grow.dur)); E.ln.setAttribute("x2", String(S(A._x + (B._x - A._x) * p))); E.ln.setAttribute("y2", String(S(A._y + (B._y - A._y) * p))); }
        else { E.ln.setAttribute("x2", String(S(B._x))); E.ln.setAttribute("y2", String(S(B._y))); }
        if (E.verbEl) { E.verbEl.setAttribute("x", String(S((A._x + B._x) / 2))); E.verbEl.setAttribute("y", String(S((A._y + B._y) / 2 - 5))); } });
    }
    const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const ease = (p: number) => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const rnd = (a: any[]) => a[Math.floor(Math.random() * a.length)];

    // ---------- ambient pop + merge ----------
    const ambient: any[] = []; let nextSpawn = 0; const AMB_CAP = 6;
    function spawnAmbient(now: number) { if (ambient.length >= AMB_CAP) return;
      const anchor = rnd(NODES); const ang = Math.random() * Math.PI * 2, dist = 28 + Math.random() * 40;
      let x = anchor._x + Math.cos(ang) * dist, y = anchor._y + Math.sin(ang) * dist; x = Math.max(18, Math.min(W - 18, x)); y = Math.max(18, Math.min(H - 18, y));
      const col = rnd(PALETTE);
      const edge = el("line", { x1: S(x), y1: S(y), x2: S(anchor._x), y2: S(anchor._y), stroke: col, opacity: 0, "stroke-width": 1, "stroke-dasharray": "2 3" });
      const c = el("rect", { width: 1, height: 1, fill: col, opacity: 0 });
      gAmbient.appendChild(edge); gAmbient.appendChild(c);
      ambient.push({ c, edge, x, y, col, anchorId: anchor.id, state: "in", t0: now, r: 4 + Math.floor(Math.random() * 3), life: 3400 + Math.random() * 3000, mode: (Math.random() < 0.62 ? "merge" : "fade") });
    }
    function endAmbient(a: any) { a.c.remove(); a.edge.remove(); const i = ambient.indexOf(a); if (i >= 0) ambient.splice(i, 1); }
    function pulse(node: any) { if (!node || !node._halo) return; node._halo.style.opacity = ".34"; timers.push(window.setTimeout(() => { node._halo.style.opacity = ""; }, 80)); }
    function drawAmb(a: any, size: number, op: number) { const sz = Math.max(1, Math.round(size)); a.c.setAttribute("width", String(sz)); a.c.setAttribute("height", String(sz)); a.c.setAttribute("x", String(S(a.x) - sz / 2)); a.c.setAttribute("y", String(S(a.y) - sz / 2)); a.c.setAttribute("opacity", String(op)); }
    function updateAmbient(now: number) {
      if (now >= nextSpawn) { spawnAmbient(now); nextSpawn = now + 1500 + Math.random() * 1300; }
      for (let i = ambient.length - 1; i >= 0; i--) { const a = ambient[i]; const anchor = byId[a.anchorId];
        if (a.state === "in") { const p = clamp((now - a.t0) / 420); drawAmb(a, a.r * p, .55 * p); a.edge.setAttribute("opacity", String(.18 * p)); if (p >= 1) { a.state = "live"; a.tlive = now; } }
        else if (a.state === "live") { a.x += Math.sin((now / 900) + a.t0) * 0.04; a.y += Math.cos((now / 1000) + a.t0) * 0.04; drawAmb(a, a.r, .55); if (now - a.tlive > a.life) { a.state = "out"; a.tout = now; a.fx = a.x; a.fy = a.y; } }
        else if (a.state === "out") { const p = clamp((now - a.tout) / 620);
          if (a.mode === "merge") { a.x = a.fx + (anchor._x - a.fx) * ease(p); a.y = a.fy + (anchor._y - a.fy) * ease(p); drawAmb(a, a.r * (1 - p), .55 * (1 - p)); a.edge.setAttribute("opacity", String(.18 * (1 - p))); if (p >= 1) { pulse(anchor); endAmbient(a); continue; } }
          else { drawAmb(a, a.r, .55 * (1 - p)); a.edge.setAttribute("opacity", String(.18 * (1 - p))); if (p >= 1) { endAmbient(a); continue; } } }
        a.edge.setAttribute("x1", String(S(a.x))); a.edge.setAttribute("y1", String(S(a.y))); a.edge.setAttribute("x2", String(S(anchor._x))); a.edge.setAttribute("y2", String(S(anchor._y)));
      }
    }

    // ---------- branching trace ----------
    const HOLD = 2800, FADE = 750, GAP = 2400, D0 = 460, D1 = 520;
    const active: any = { t: null, edges: [], ends: "decision", mainCount: 0 };
    let traceState = "idle", busy = false, cycle = 0;
    const timers: number[] = []; let rafId = 0;

    function clearTrace() { active.edges.forEach((E: any) => { if (E.ln) E.ln.remove(); if (E.verbEl) E.verbEl.remove(); }); active.edges = [];
      NODES.forEach((n) => n._g.classList.remove("lit", "dim")); gEdges.classList.remove("dim");
      sentMain!.innerHTML = ""; sentBranch!.innerHTML = ""; eyebrow!.textContent = ""; root!.classList.remove("tracing"); }
    function appendWord(c: HTMLElement, cls: string, text: string) { const s = document.createElement("span"); s.className = cls; s.textContent = text; c.appendChild(s); }
    function appendBranch(verb: string, label: string) { if (sentBranch!.childNodes.length > 0) sentBranch!.appendChild(document.createTextNode(" \u00b7 "));
      sentBranch!.appendChild(document.createTextNode("also ")); const v = document.createElement("span"); v.className = "cv"; v.textContent = verb; sentBranch!.appendChild(v);
      sentBranch!.appendChild(document.createTextNode(": ")); const l = document.createElement("span"); l.className = "cn"; l.textContent = label; sentBranch!.appendChild(l); }
    function lightNode(id: string) { const n = byId[id]; if (n && n._g) n._g.classList.add("lit"); }
    function startEdge(E: any, now: number) { E.started = true; const ln = el("line", { class: "amber", x1: 0, y1: 0, x2: 0, y2: 0, opacity: .96 }); gTrace.appendChild(ln); E.ln = ln;
      E.grow = { start: now, dur: E.from === "HUB" ? D0 : D1 };
      if (E.verb) { const v = el("text", { class: "verb", x: 0, y: 0, "text-anchor": "middle", "font-size": 7, fill: "var(--trace, #f6cd83)" }); v.style.fontStyle = "italic"; v.textContent = E.verb; gVerbs.appendChild(v); E.verbEl = v; } }
    function finalizeEdge(E: any) { E.done = true; lightNode(E.to); if (E.verbEl) E.verbEl.classList.add("show");
      if (E.main) { if (E.from === "HUB") appendWord(sentMain!, "cn", byId[E.to].label); else { appendWord(sentMain!, "cv", E.verb); appendWord(sentMain!, "cn", byId[E.to].label); }
        if (E.idx === active.mainCount - 1 && active.ends === "open") appendWord(sentMain!, "open", "(still open)"); }
      else appendBranch(E.verb, byId[E.to].label); }
    function startTrace(i: number) { if (REDUCED) { traceReduced(i); return; } if (busy) return; busy = true;
      clearTrace(); const t = TRACES[i]; active.t = t; active.ends = t.ends; active.mainCount = t.mainCount;
      active.edges = t.edges.map((e, idx) => ({ from: e[0], to: e[1], verb: e[2], main: idx < t.mainCount, idx, ln: null, verbEl: null, grow: null, started: false, done: false }));
      eyebrow!.textContent = "A RECONSTRUCTED THREAD \u00b7 " + t.mode.toUpperCase(); root!.classList.add("tracing");
      const lit = new Set(["HUB"]); active.edges.forEach((E: any) => lit.add(E.to)); NODES.forEach((n) => { if (!lit.has(n.id)) n._g.classList.add("dim"); }); gEdges.classList.add("dim");
      const now = performance.now(); active.edges.filter((E: any) => E.from === "HUB").forEach((E: any) => startEdge(E, now)); traceState = "growing"; }
    function advance(now: number) {
      active.edges.forEach((E: any) => { if (E.started && E.grow && (now - E.grow.start) >= E.grow.dur) { E.grow = null; finalizeEdge(E); active.edges.forEach((C: any) => { if (!C.started && C.from === E.to) startEdge(C, now); }); } });
      const pending = active.edges.some((E: any) => !E.started || E.grow); if (!pending && traceState === "growing") { traceState = "hold"; timers.push(window.setTimeout(fadeBack, HOLD)); }
    }
    function fadeBack() { traceState = "fade"; NODES.forEach((n) => n._g.classList.remove("lit", "dim")); gEdges.classList.remove("dim");
      active.edges.forEach((E: any) => { if (E.verbEl) E.verbEl.classList.remove("show"); if (E.ln) { E.ln.style.transition = "opacity .7s"; E.ln.style.opacity = "0"; } });
      root!.classList.remove("tracing");
      timers.push(window.setTimeout(() => { active.edges.forEach((E: any) => { if (E.ln) E.ln.remove(); if (E.verbEl) E.verbEl.remove(); }); active.edges = []; sentMain!.innerHTML = ""; sentBranch!.innerHTML = "";
        traceState = "idle"; busy = false; nextSpawn = performance.now() + 700; scheduleAuto(); }, FADE)); }
    function traceReduced(i: number) { clearTrace(); const t = TRACES[i]; active.ends = t.ends; active.mainCount = t.mainCount;
      active.edges = t.edges.map((e, idx) => ({ from: e[0], to: e[1], verb: e[2], main: idx < t.mainCount, idx, ln: null, verbEl: null, grow: null, started: true, done: true }));
      eyebrow!.textContent = "A RECONSTRUCTED THREAD \u00b7 " + t.mode.toUpperCase(); root!.classList.add("tracing");
      const lit = new Set(["HUB"]); active.edges.forEach((E: any) => lit.add(E.to)); NODES.forEach((n) => { if (!lit.has(n.id)) n._g.classList.add("dim"); }); gEdges.classList.add("dim");
      active.edges.forEach((E: any) => { const A = byId[E.from], B = byId[E.to]; const ln = el("line", { class: "amber", x1: S(A._x), y1: S(A._y), x2: S(B._x), y2: S(B._y), opacity: .96 }); gTrace.appendChild(ln); E.ln = ln; lightNode(E.to);
        if (E.verb) { const v = el("text", { class: "verb show", x: S((A._x + B._x) / 2), y: S((A._y + B._y) / 2 - 5), "text-anchor": "middle", "font-size": 7, fill: "var(--trace, #f6cd83)" }); v.style.fontStyle = "italic"; v.textContent = E.verb; gVerbs.appendChild(v); E.verbEl = v; } });
      active.edges.filter((E: any) => E.main).forEach((E: any) => { if (E.from === "HUB") appendWord(sentMain!, "cn", byId[E.to].label); else { appendWord(sentMain!, "cv", E.verb); appendWord(sentMain!, "cn", byId[E.to].label); } });
      if (t.ends === "open") appendWord(sentMain!, "open", "(still open)"); active.edges.filter((E: any) => !E.main).forEach((E: any) => appendBranch(E.verb, byId[E.to].label)); }
    function scheduleAuto() { if (REDUCED) return; timers.push(window.setTimeout(() => { cycle = (cycle + 1) % TRACES.length; startTrace(cycle); }, GAP)); }

    // ---------- run ----------
    buildLayout(); initFloat(); host.appendChild(svg);
    if (REDUCED) { computePositions(0); applyPositions(0); traceReduced(1); }
    else {
      const loop = (now: number) => { computePositions(now); applyPositions(now); if (traceState === "growing") advance(now); if (traceState === "idle") updateAmbient(now); rafId = requestAnimationFrame(loop); };
      rafId = requestAnimationFrame(loop);
      timers.push(window.setTimeout(() => { cycle = 0; startTrace(0); }, 2400));
    }

    return () => { timers.forEach((t) => { window.clearTimeout(t); window.clearInterval(t); }); if (rafId) cancelAnimationFrame(rafId); if (svg.parentNode) svg.parentNode.removeChild(svg); };
  }, []);

  return (
    <div className="lg-root labels-hidden" ref={rootRef} style={{ position: "relative", background: "var(--bg-elevated)", border: "2px solid var(--border-strong)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.5), 4px 4px 0 rgba(0,0,0,.45)", padding: 22, width: "100%" }}>
      <style>{LG_CSS}</style>
      <span className="bk tl" /><span className="bk tr" /><span className="bk bl" /><span className="bk br" />
      <div className="winbar"><span className="led" /> LIVING GRAPH</div>
      <div ref={hostRef} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "9px 14px", justifyContent: "center", marginTop: 14 }}>
        {LEGEND.map((it) => (
          <span key={it.kind} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: PIXEL, fontSize: 6.5, letterSpacing: ".02em", color: "var(--text-tertiary)" }}>
            <span style={{ width: 7, height: 7, background: COL[it.kind], display: "inline-block" }} />
            {it.label}
          </span>
        ))}
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", textAlign: "center", margin: "9px 0 0", opacity: .85 }}>
        Nodes are the things. The <b style={{ color: "var(--text-secondary)", fontWeight: 500 }}>links between them are the reasoning</b>.
      </p>
      <div className="lg-cap">
        <p className="lg-tagline">One graph. Everything you think, connected.</p>
        <div className="lg-sentence" aria-hidden="true">
          <span className="lg-eyebrow" ref={eyebrowRef} />
          <div className="lg-main" ref={mainRef} />
          <div className="lg-branch" ref={branchRef} />
        </div>
      </div>
    </div>
  );
}
