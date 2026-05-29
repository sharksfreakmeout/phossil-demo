import { useEffect, useRef } from "react";

/**
 * Living Graph v3 (production) — Phossil hero knowledge graph.
 * REAL not arbitrary: coherent typed clusters following a real edge grammar.
 * Broader: several clusters seed around the hub in all directions on load.
 * Passive-capture accurate: nodes accumulate and never vanish; older recede.
 * Retrieval shown: every ~8s a reasoning path lights by walking a real chain.
 * Collision-aware placement; breathing hub circle; reduced-motion safe.
 */

const COL: Record<string, string> = {
  initiative: "var(--accent)",
  document: "var(--accent-cyan)",
  person: "#c98bdb",
  discussion: "#7aa2f7",
  decision: "#7ec699",
  question: "#e0795f",
};

const WORDS: Record<string, string[]> = {
  initiative: ["initiative", "project", "the deal", "the case", "launch", "review"],
  document: ["document", "draft", "the model", "the spec", "proposal", "analysis"],
  person: ["teammate", "reviewer", "the owner", "a lead", "colleague", "partner"],
  discussion: ["discussion", "thread", "the meeting", "a call", "sync", "debrief"],
  decision: ["decision", "the call", "direction", "the choice", "approval"],
  question: ["open question", "blocker", "a risk", "unknown", "objection"],
};

const NEXT: Record<string, string[]> = {
  initiative: ["document", "person", "discussion"],
  document: ["question", "person", "document"],
  question: ["discussion", "decision", "person"],
  discussion: ["person", "decision"],
  person: ["decision", "document", "discussion"],
  decision: ["document", "initiative"],
};

const LEGEND = [
  { kind: "initiative", label: "initiative" },
  { kind: "document", label: "document" },
  { kind: "person", label: "person" },
  { kind: "discussion", label: "discussion" },
  { kind: "decision", label: "decision" },
  { kind: "question", label: "open question" },
];

const SVGNS = "http://www.w3.org/2000/svg";

export default function LivingGraph() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const W = 520, H = 460, CX = W / 2, CY = H / 2;
    const CAP = 8, MIN_DIST = 42, MIN_HUB = 60;
    function rnd<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }

    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("width", "100%");
    svg.style.display = "block";
    svg.style.height = "auto";
    svg.style.maxHeight = "460px";
    svg.setAttribute("aria-hidden", "true");

    function el(tag: string, attrs: Record<string, string | number>) {
      const e = document.createElementNS(SVGNS, tag);
      for (const k in attrs) e.setAttribute(k, String(attrs[k]));
      return e as SVGElement;
    }

    const edgeL = el("g", {});
    const nodeL = el("g", {});
    svg.appendChild(edgeL);
    svg.appendChild(nodeL);

    const hub = el("circle", { cx: CX, cy: CY, r: 24, fill: "var(--accent)" }) as SVGCircleElement;
    const hubT = el("text", {
      x: CX, y: CY, "text-anchor": "middle", "dominant-baseline": "middle",
      fill: "var(--bg)", "font-size": 11,
    }) as SVGTextElement;
    hubT.style.fontFamily = "var(--font-mono)";
    hubT.textContent = "you";
    svg.appendChild(hub);
    svg.appendChild(hubT);

    type Node = {
      g: SVGGElement; c: SVGCircleElement; tx: SVGTextElement; ln: SVGLineElement;
      cx?: SVGLineElement; x: number; y: number; kind: string; depth: number; parent: Node | null;
    };
    const nodes: Node[] = [];
    const timers: number[] = [];

    function tooClose(x: number, y: number) {
      if (Math.hypot(x - CX, y - CY) < MIN_HUB) return true;
      for (const n of nodes) if (Math.hypot(x - n.x, y - n.y) < MIN_DIST) return true;
      return false;
    }

    function place(parent: Node | null, forceAngle?: number) {
      const px = parent ? parent.x : CX;
      const py = parent ? parent.y : CY;
      const pd = parent ? parent.depth : 0;
      for (let attempt = 0; attempt < 26; attempt++) {
        let ang: number;
        if (forceAngle !== undefined && attempt < 8) ang = forceAngle + (Math.random() * 0.6 - 0.3);
        else if (parent) ang = Math.atan2(py - CY, px - CX) + (Math.random() * 1.8 - 0.9);
        else ang = Math.random() * Math.PI * 2;
        const step = (parent ? 54 : 92) + attempt * 4 + Math.random() * 22;
        const x = px + Math.cos(ang) * step;
        const y = py + Math.sin(ang) * step;
        if (x < 28 || x > W - 28 || y < 30 || y > H - 32) continue;
        if (!tooClose(x, y)) return { x, y, depth: pd + 1 };
      }
      return null;
    }

    function addNode(parent: Node | null, instant: boolean, forceAngle?: number): Node | null {
      const pkind = parent ? parent.kind : "initiative";
      const kind = parent ? rnd(NEXT[pkind] || ["document"]) : "initiative";
      const pos = place(parent, forceAngle);
      if (!pos) return null;
      const { x, y, depth } = pos;
      const label = rnd(WORDS[kind]);
      const ex = parent ? parent.x : CX;
      const ey = parent ? parent.y : CY;

      const ln = el("line", { x1: ex, y1: ey, x2: x, y2: y, stroke: COL[kind], "stroke-width": 1, opacity: 0 }) as SVGLineElement;
      edgeL.appendChild(ln);

      const g = el("g", { opacity: 0 }) as SVGGElement;
      const c = el("circle", { cx: x, cy: y, r: 6, fill: "var(--bg-subtle)", stroke: COL[kind], "stroke-width": 1.5 }) as SVGCircleElement;
      const tx = el("text", { x: x, y: y - 11, "text-anchor": "middle", fill: "var(--text-tertiary)", "font-size": 8 }) as SVGTextElement;
      tx.style.fontFamily = "var(--font-mono)";
      tx.textContent = label;
      g.appendChild(c);
      g.appendChild(tx);
      nodeL.appendChild(g);

      const node: Node = { g, c, tx, ln, x, y, kind, depth, parent };

      if (instant) {
        g.setAttribute("opacity", "1");
        ln.setAttribute("opacity", "0.4");
      } else {
        let o = 0;
        const fi = window.setInterval(() => {
          o += 0.09;
          g.setAttribute("opacity", String(Math.min(1, o)));
          ln.setAttribute("opacity", String(Math.min(0.4, o * 0.4)));
          if (o >= 1) window.clearInterval(fi);
        }, 28);
        timers.push(fi);
      }

      if (nodes.length > 3 && Math.random() < 0.26) {
        const near = nodes.filter((o) => o !== parent && Math.hypot(o.x - x, o.y - y) < 150);
        if (near.length) {
          const other = rnd(near);
          const cx = el("line", {
            x1: x, y1: y, x2: other.x, y2: other.y,
            stroke: "var(--accent-cyan)", "stroke-width": 1, "stroke-dasharray": "3 4",
            opacity: instant ? 0.16 : 0,
          }) as SVGLineElement;
          edgeL.appendChild(cx);
          if (!instant) {
            let oo = 0;
            const ci = window.setInterval(() => {
              oo += 0.04;
              cx.setAttribute("opacity", String(Math.min(0.16, oo)));
              if (oo >= 0.18) window.clearInterval(ci);
            }, 45);
            timers.push(ci);
          }
          node.cx = cx;
        }
      }

      nodes.push(node);
      return node;
    }

    function recede() {
      const n = nodes.length;
      nodes.forEach((nd, i) => {
        const bright = n - 1 - i < CAP;
        nd.g.setAttribute("opacity", bright ? "1" : "0.22");
        nd.c.setAttribute("r", bright ? "6" : "3.5");
        nd.tx.setAttribute("opacity", bright ? "1" : "0");
        nd.ln.setAttribute("opacity", bright ? "0.4" : "0.09");
        if (nd.cx) nd.cx.setAttribute("opacity", bright ? "0.16" : "0.06");
      });
    }

    (function seed() {
      const ROOTS = 5;
      const roots: Node[] = [];
      for (let i = 0; i < ROOTS; i++) {
        const ang = (Math.PI * 2 / ROOTS) * i + Math.random() * 0.3;
        const r = addNode(null, true, ang);
        if (r) roots.push(r);
      }
      let frontier = [...roots];
      for (let layer = 0; layer < 2; layer++) {
        const nf: Node[] = [];
        frontier.forEach((p) => {
          const kids = 1 + Math.floor(Math.random() * 2);
          for (let k = 0; k < kids; k++) {
            if (nodes.length < 24) {
              const c = addNode(p, true);
              if (c) nf.push(c);
            }
          }
        });
        frontier = nf;
        if (nodes.length >= 24) break;
      }
      recede();
    })();

    if (!reduce) {
      const grow = window.setInterval(() => {
        let parent: Node | null = null;
        if (nodes.length > 0 && Math.random() < 0.85) {
          const pool = nodes.slice(-10).filter((n) => n.depth < 5);
          parent = pool.length ? rnd(pool) : rnd(nodes);
        }
        addNode(parent, false);
        recede();
      }, 1300);
      timers.push(grow);

      function trace() {
        if (nodes.length < 5) return;
        const deep = nodes.slice(-10).filter((n) => n.depth >= 3);
        const start = deep.length ? rnd(deep) : nodes[nodes.length - 1];
        const chain: Node[] = [];
        let cur: Node | null = start;
        let guard = 0;
        while (cur && guard < 6) {
          chain.unshift(cur);
          cur = cur.parent;
          guard++;
        }
        const tls: SVGLineElement[] = [];
        chain.forEach((nd, i) => {
          const t = window.setTimeout(() => {
            nd.c.setAttribute("stroke", "var(--accent)");
            nd.c.setAttribute("stroke-width", "2.5");
            nd.c.setAttribute("r", "8");
            nd.g.setAttribute("opacity", "1");
            nd.tx.setAttribute("opacity", "1");
            const prev = i === 0 ? { x: CX, y: CY } : chain[i - 1];
            const tl = el("line", { x1: prev.x, y1: prev.y, x2: nd.x, y2: nd.y, stroke: "var(--accent)", "stroke-width": 2, opacity: 0.95 }) as SVGLineElement;
            edgeL.appendChild(tl);
            tls.push(tl);
          }, i * 480);
          timers.push(t);
        });
        const done = window.setTimeout(() => {
          chain.forEach((nd) => {
            nd.c.setAttribute("stroke", COL[nd.kind]);
            nd.c.setAttribute("stroke-width", "1.5");
          });
          tls.forEach((tl) => {
            let o = 0.95;
            const f = window.setInterval(() => {
              o -= 0.05;
              tl.setAttribute("opacity", String(Math.max(0, o)));
              if (o <= 0) { window.clearInterval(f); tl.remove(); }
            }, 45);
            timers.push(f);
          });
          recede();
        }, chain.length * 480 + 1400);
        timers.push(done);
      }
      const firstTrace = window.setTimeout(trace, 2600);
      timers.push(firstTrace);
      const traceLoop = window.setInterval(trace, 8000);
      timers.push(traceLoop);

      let bt = 0;
      const breathe = window.setInterval(() => {
        bt += 0.045;
        hub.setAttribute("r", String(24 + Math.sin(bt) * 2.2));
      }, 45);
      timers.push(breathe);
    }

    host.appendChild(svg);

    return () => {
      timers.forEach((t) => { window.clearInterval(t); window.clearTimeout(t); });
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    };
  }, []);

  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-strong)", borderRadius: 16, padding: 20, width: "100%" }}>
      <div ref={hostRef} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 14px", justifyContent: "center", marginTop: 14 }}>
        {LEGEND.map((item) => (
          <span key={item.kind} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-tertiary)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COL[item.kind], display: "inline-block" }} />
            {item.label}
          </span>
        ))}
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", textAlign: "center", marginTop: 12, marginBottom: 0 }}>
        One graph. Everything you think, connected.
      </p>
    </div>
  );
}
