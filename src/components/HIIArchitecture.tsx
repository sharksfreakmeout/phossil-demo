import { useEffect, useRef, useState } from "react";

/* ── Types ── */

type RoleId =
  | "engineering"
  | "sales"
  | "finance"
  | "support"
  | "supplychain"
  | "peopleops"
  | "sre";

interface NodeType {
  id: string;
  label: string;
  color: string;
}

interface Activity {
  tool: string;
  label: string;
}

interface RoleData {
  label: string;
  activities: Activity[];
}

interface GraphNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  latent?: boolean;
  external?: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
  latent?: boolean;
}

interface GraphData {
  spofId: string;
  spofLabel: string;
  spofCluster: string[];
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface AppDef {
  num: string;
  name: string;
  what: string;
  traversal: string | null;
  traversalIds: string[];
  mode: string;
  traversalByRole?: Partial<Record<RoleId, string[]>>;
  topology?: boolean;
  open?: boolean;
}

/* ── Constants ── */

const SVG_NS = "http://www.w3.org/2000/svg";

const nodeTypes: NodeType[] = [
  { id: "people",   label: "People",                color: "var(--node-people)" },
  { id: "project",  label: "Projects",              color: "var(--node-project)" },
  { id: "decision", label: "Decisions",             color: "var(--node-decision)" },
  { id: "file",     label: "Files",                 color: "var(--node-file)" },
  { id: "meeting",  label: "Meetings & Threads",    color: "var(--node-meeting)" },
  { id: "blocker",  label: "Hypotheses & Blockers", color: "var(--node-blocker)" },
];

const roles: Record<RoleId, RoleData> = {
  engineering: { label: "Engineering", activities: [
    { tool: "Cursor", label: "Editing payment.ts" },
    { tool: "GitHub", label: "PR #284 review" },
    { tool: "Linear", label: "Triaging incident" },
    { tool: "Slack",  label: "#backend thread" },
    { tool: "Notion", label: "RFC draft" },
  ]},
  sales: { label: "Sales", activities: [
    { tool: "Salesforce", label: "Acme account notes" },
    { tool: "Gong",       label: "Reviewing demo call" },
    { tool: "Outreach",   label: "Enterprise sequence" },
    { tool: "Gmail",      label: "Reply to procurement" },
    { tool: "LinkedIn",   label: "Researching new contact" },
  ]},
  finance: { label: "Finance", activities: [
    { tool: "NetSuite", label: "Closing entries" },
    { tool: "Excel",    label: "Q3 forecast model" },
    { tool: "FloQast",  label: "Reconciliation checklist" },
    { tool: "Slack",    label: "#finance-ops thread" },
    { tool: "Gmail",    label: "Audit response" },
  ]},
  support: { label: "Support", activities: [
    { tool: "Zendesk",  label: "Ticket #4421 escalation" },
    { tool: "Intercom", label: "Live chat: customer" },
    { tool: "Slack",    label: "#cx thread" },
    { tool: "Notion",   label: "KB article draft" },
    { tool: "Linear",   label: "Bug report filed" },
  ]},
  supplychain: { label: "Supply Chain", activities: [
    { tool: "SAP Ariba", label: "PO #8821 approval" },
    { tool: "Coupa",     label: "Supplier risk review" },
    { tool: "Excel",     label: "Inventory forecast" },
    { tool: "Slack",     label: "#logistics thread" },
    { tool: "Gmail",     label: "Vendor delay reply" },
  ]},
  peopleops: { label: "People Ops", activities: [
    { tool: "Greenhouse", label: "Candidate review: Sr Eng" },
    { tool: "Lattice",    label: "Q3 review cycle prep" },
    { tool: "Workday",    label: "Onboarding new hire" },
    { tool: "Slack",      label: "#hiring thread" },
    { tool: "Calendar",   label: "Interview panel" },
  ]},
  sre: { label: "SRE", activities: [
    { tool: "PagerDuty", label: "Active incident: p95 spike" },
    { tool: "Datadog",   label: "Latency dashboard" },
    { tool: "Grafana",   label: "Alerting rules" },
    { tool: "GitHub",    label: "Rollback PR" },
    { tool: "Slack",     label: "#incidents thread" },
  ]},
};

const graphsByRole: Record<RoleId, GraphData> = {
  engineering: {
    spofId: "n5",
    spofLabel: "Joel (reviewer)",
    spofCluster: ["n4", "n6", "n8"],
    nodes: [
      { id: "n1",  type: "project",  label: "Q4 payment refactor",                       x: 550, y: 60  },
      { id: "n2",  type: "file",     label: "payment.ts",                                x: 230, y: 140 },
      { id: "n3",  type: "file",     label: "gateway.ts",                                x: 230, y: 240 },
      { id: "n4",  type: "meeting",  label: "PR #284 review",                            x: 450, y: 200 },
      { id: "n5",  type: "people",   label: "Joel (reviewer)",                           x: 640, y: 140 },
      { id: "n6",  type: "decision", label: "Use async batching",                        x: 760, y: 240 },
      { id: "n7",  type: "blocker",  label: "Hypothesis: race on retry",                 x: 450, y: 320 },
      { id: "n8",  type: "meeting",  label: "#backend thread",                           x: 880, y: 140 },
      { id: "n9",  type: "people",   label: "Maria (PM)",                                x: 880, y: 300 },
      { id: "n10", type: "decision", label: "Resolved similar race in webhook-v2",       x: 140, y: 380, latent: true },
    ],
    edges: [
      { from: "n2", to: "n1",  label: "part-of" },
      { from: "n3", to: "n1",  label: "part-of" },
      { from: "n2", to: "n4",  label: "in-PR" },
      { from: "n4", to: "n5",  label: "reviewer" },
      { from: "n4", to: "n6",  label: "led-to" },
      { from: "n2", to: "n7",  label: "blocked-by" },
      { from: "n7", to: "n8",  label: "discussed-in" },
      { from: "n8", to: "n5",  label: "mentions" },
      { from: "n1", to: "n9",  label: "owned-by" },
      { from: "n6", to: "n9",  label: "approved-by" },
      { from: "n5", to: "n10", label: "learned-from",  latent: true },
      { from: "n7", to: "n10", label: "analogous-to",  latent: true },
    ],
  },
  sales: {
    spofId: "n2",
    spofLabel: "Sarah (CFO, Acme)",
    spofCluster: ["n4", "n6", "n8"],
    nodes: [
      { id: "n1",  type: "project",  label: "Acme deal · Q3 close",                        x: 550, y: 60  },
      { id: "n2",  type: "people",   label: "Sarah (CFO, Acme)",                           x: 230, y: 140 },
      { id: "n3",  type: "people",   label: "Tom (Procurement)",                           x: 230, y: 240 },
      { id: "n4",  type: "meeting",  label: "Demo · last Thursday",                        x: 450, y: 200 },
      { id: "n5",  type: "file",     label: "MSA redline v3",                              x: 640, y: 140 },
      { id: "n6",  type: "decision", label: "Tier 2 pricing accepted",                     x: 760, y: 240 },
      { id: "n7",  type: "blocker",  label: "Hypothesis: legal delay",                     x: 450, y: 320 },
      { id: "n8",  type: "meeting",  label: "Gmail thread · pricing",                      x: 880, y: 140 },
      { id: "n9",  type: "people",   label: "Eric (AE)",                                   x: 880, y: 300 },
      { id: "n10", type: "decision", label: "Acme legal redlined § 7 (Globex, 2024)",      x: 140, y: 380, latent: true },
    ],
    edges: [
      { from: "n2", to: "n1",  label: "champion" },
      { from: "n3", to: "n1",  label: "gatekeeper" },
      { from: "n4", to: "n2",  label: "attended" },
      { from: "n4", to: "n6",  label: "led-to" },
      { from: "n5", to: "n6",  label: "documents" },
      { from: "n1", to: "n7",  label: "blocked-by" },
      { from: "n7", to: "n8",  label: "discussed-in" },
      { from: "n8", to: "n3",  label: "mentions" },
      { from: "n1", to: "n9",  label: "owned-by" },
      { from: "n2", to: "n8",  label: "cc-on" },
      { from: "n2", to: "n10", label: "involved-in",  latent: true },
      { from: "n7", to: "n10", label: "analogous-to", latent: true },
    ],
  },
  finance: {
    spofId: "n5",
    spofLabel: "Lisa (Controller)",
    spofCluster: ["n4", "n6", "n8"],
    nodes: [
      { id: "n1",  type: "project",  label: "Q3 close",                                            x: 550, y: 60  },
      { id: "n2",  type: "file",     label: "Q3_forecast_v4.xlsx",                                 x: 230, y: 140 },
      { id: "n3",  type: "file",     label: "GL_reconciliation.xlsx",                              x: 230, y: 240 },
      { id: "n4",  type: "meeting",  label: "CFO weekly · Friday",                                 x: 450, y: 200 },
      { id: "n5",  type: "people",   label: "Lisa (Controller)",                                   x: 640, y: 140 },
      { id: "n6",  type: "decision", label: "Accrue Q3 deferred rev",                              x: 760, y: 240 },
      { id: "n7",  type: "blocker",  label: "Hypothesis: revrec error",                            x: 450, y: 320 },
      { id: "n8",  type: "meeting",  label: "#finance-ops thread",                                 x: 880, y: 140 },
      { id: "n9",  type: "people",   label: "Auditor (Deloitte)",                                  x: 880, y: 300 },
      { id: "n10", type: "decision", label: "Q1 deferred-rev treatment (auditor-approved)",        x: 140, y: 380, latent: true },
    ],
    edges: [
      { from: "n2", to: "n1",  label: "feeds" },
      { from: "n3", to: "n1",  label: "feeds" },
      { from: "n4", to: "n5",  label: "attended-by" },
      { from: "n4", to: "n6",  label: "led-to" },
      { from: "n3", to: "n7",  label: "surfaced" },
      { from: "n7", to: "n8",  label: "discussed-in" },
      { from: "n8", to: "n5",  label: "mentions" },
      { from: "n1", to: "n9",  label: "reviewed-by" },
      { from: "n6", to: "n9",  label: "documented-to" },
      { from: "n5", to: "n10", label: "authored",      latent: true },
      { from: "n7", to: "n10", label: "analogous-to",  latent: true },
    ],
  },
  support: {
    spofId: "n5",
    spofLabel: "Maya (Eng on-call)",
    spofCluster: ["n6", "n8"],
    nodes: [
      { id: "n1",  type: "project",  label: "Ticket #4421",                                    x: 550, y: 60  },
      { id: "n2",  type: "people",   label: "Customer (Acme)",                                 x: 230, y: 140 },
      { id: "n3",  type: "file",     label: "KB · auth errors",                                x: 230, y: 240 },
      { id: "n4",  type: "meeting",  label: "Live chat session",                               x: 450, y: 200 },
      { id: "n5",  type: "people",   label: "Maya (Eng on-call)",                              x: 640, y: 140 },
      { id: "n6",  type: "decision", label: "Escalate to P2",                                  x: 760, y: 240 },
      { id: "n7",  type: "blocker",  label: "Hypothesis: token expiry",                        x: 450, y: 320 },
      { id: "n8",  type: "meeting",  label: "#cx thread",                                      x: 880, y: 140 },
      { id: "n9",  type: "people",   label: "Support lead",                                    x: 880, y: 300 },
      { id: "n10", type: "decision", label: "Globex token-expiry fix (Mar 2025)",              x: 140, y: 380, latent: true },
    ],
    edges: [
      { from: "n2", to: "n1",  label: "reporter" },
      { from: "n4", to: "n2",  label: "with" },
      { from: "n4", to: "n6",  label: "led-to" },
      { from: "n3", to: "n1",  label: "referenced" },
      { from: "n1", to: "n7",  label: "caused-by?" },
      { from: "n7", to: "n8",  label: "discussed-in" },
      { from: "n8", to: "n5",  label: "mentions" },
      { from: "n1", to: "n9",  label: "owned-by" },
      { from: "n9", to: "n8",  label: "follows" },
      { from: "n6", to: "n5",  label: "escalated-by" },
      { from: "n5", to: "n10", label: "authored",      latent: true },
      { from: "n7", to: "n10", label: "analogous-to",  latent: true },
    ],
  },
  supplychain: {
    spofId: "n2",
    spofLabel: "Tier-1 supplier",
    spofCluster: ["n1", "n7"],
    nodes: [
      { id: "n1",  type: "project",  label: "PO #8821",                                      x: 550, y: 60  },
      { id: "n2",  type: "people",   label: "Tier-1 supplier",                               x: 230, y: 140, external: true },
      { id: "n3",  type: "file",     label: "Inventory_forecast.xlsx",                       x: 230, y: 240 },
      { id: "n4",  type: "meeting",  label: "Risk review",                                   x: 450, y: 200 },
      { id: "n5",  type: "people",   label: "Plant manager",                                 x: 640, y: 140 },
      { id: "n6",  type: "decision", label: "Dual-source component X",                       x: 760, y: 240 },
      { id: "n7",  type: "blocker",  label: "Hypothesis: 6-week delay",                      x: 450, y: 320 },
      { id: "n8",  type: "meeting",  label: "#logistics thread",                             x: 880, y: 140 },
      { id: "n9",  type: "people",   label: "Procurement lead",                              x: 880, y: 300 },
      { id: "n10", type: "decision", label: "Dual-sourced component Y in 2024",              x: 140, y: 380, latent: true },
    ],
    edges: [
      { from: "n2", to: "n1",  label: "fulfills" },
      { from: "n3", to: "n6",  label: "informs" },
      { from: "n4", to: "n5",  label: "attended-by" },
      { from: "n4", to: "n6",  label: "led-to" },
      { from: "n1", to: "n7",  label: "at-risk" },
      { from: "n2", to: "n7",  label: "cause-of" },
      { from: "n7", to: "n8",  label: "discussed-in" },
      { from: "n8", to: "n5",  label: "mentions" },
      { from: "n6", to: "n9",  label: "executed-by" },
      { from: "n9", to: "n1",  label: "owns" },
      { from: "n5", to: "n10", label: "authored",      latent: true },
      { from: "n7", to: "n10", label: "analogous-to",  latent: true },
    ],
  },
  peopleops: {
    spofId: "n5",
    spofLabel: "Joel (hiring manager)",
    spofCluster: ["n4", "n6", "n8"],
    nodes: [
      { id: "n1",  type: "project",  label: "Sr Eng search",                            x: 550, y: 60  },
      { id: "n2",  type: "people",   label: "Candidate · Priya",                        x: 230, y: 140 },
      { id: "n3",  type: "file",     label: "Scorecard · Priya",                        x: 230, y: 240 },
      { id: "n4",  type: "meeting",  label: "Onsite panel · Tue",                       x: 450, y: 200 },
      { id: "n5",  type: "people",   label: "Joel (hiring manager)",                    x: 640, y: 140 },
      { id: "n6",  type: "decision", label: "Offer at L5",                              x: 760, y: 240 },
      { id: "n7",  type: "blocker",  label: "Hypothesis: comp gap",                     x: 450, y: 320 },
      { id: "n8",  type: "meeting",  label: "#hiring thread",                           x: 880, y: 140 },
      { id: "n9",  type: "people",   label: "Recruiter (Talent)",                       x: 880, y: 300 },
      { id: "n10", type: "decision", label: "Q1 comp adjustment for Rohan",             x: 140, y: 380, latent: true },
    ],
    edges: [
      { from: "n2", to: "n1",  label: "candidate-for" },
      { from: "n3", to: "n2",  label: "evaluates" },
      { from: "n4", to: "n5",  label: "led-by" },
      { from: "n4", to: "n6",  label: "led-to" },
      { from: "n6", to: "n7",  label: "at-risk" },
      { from: "n7", to: "n8",  label: "discussed-in" },
      { from: "n8", to: "n5",  label: "mentions" },
      { from: "n9", to: "n2",  label: "sourced" },
      { from: "n9", to: "n1",  label: "owns-pipeline" },
      { from: "n5", to: "n10", label: "authored",       latent: true },
      { from: "n7", to: "n10", label: "analogous-to",   latent: true },
    ],
  },
  sre: {
    spofId: "n9",
    spofLabel: "Joel (deploy author)",
    spofCluster: ["n1", "n6"],
    nodes: [
      { id: "n1",  type: "project",  label: "Incident · p95 spike",                                 x: 550, y: 60  },
      { id: "n2",  type: "file",     label: "Datadog dashboard",                                    x: 230, y: 140 },
      { id: "n3",  type: "file",     label: "Alerting rule · payments",                             x: 230, y: 240 },
      { id: "n4",  type: "meeting",  label: "Incident bridge",                                      x: 450, y: 200 },
      { id: "n5",  type: "people",   label: "Maya (on-call)",                                       x: 640, y: 140 },
      { id: "n6",  type: "decision", label: "Rollback deploy #4112",                                x: 760, y: 240 },
      { id: "n7",  type: "blocker",  label: "Hypothesis: bad release",                              x: 450, y: 320 },
      { id: "n8",  type: "meeting",  label: "#incidents thread",                                    x: 880, y: 140 },
      { id: "n9",  type: "people",   label: "Joel (deploy author)",                                 x: 880, y: 300 },
      { id: "n10", type: "decision", label: "Rolled back deploy #3870 (same author)",               x: 140, y: 380, latent: true },
    ],
    edges: [
      { from: "n2", to: "n1",  label: "surfaces" },
      { from: "n3", to: "n1",  label: "triggered" },
      { from: "n4", to: "n5",  label: "led-by" },
      { from: "n4", to: "n6",  label: "led-to" },
      { from: "n1", to: "n7",  label: "caused-by?" },
      { from: "n7", to: "n8",  label: "discussed-in" },
      { from: "n8", to: "n9",  label: "mentions" },
      { from: "n6", to: "n9",  label: "notified" },
      { from: "n9", to: "n1",  label: "owned" },
      { from: "n9", to: "n10", label: "authored",      latent: true },
      { from: "n7", to: "n10", label: "analogous-to",  latent: true },
    ],
  },
};

const applications: AppDef[] = [
  {
    num: "01",
    name: "Pick up where you left off",
    what: "When you return after an interruption, Phossil hands you back the mental model you had before. Not your open tabs. The reasoning, what you already tried, what was next.",
    traversal: "file → blocker → thread → people → decision",
    traversalIds: ["n2", "n7", "n8", "n5", "n6"],
    mode: "Snapshot the active thread",
  },
  {
    num: "02",
    name: "Recover the reasoning behind a decision",
    what: "Six weeks after a decision, the outcome is documented but the reasoning is gone. The graph traverses the meetings, files, and threads that led to it — reconstructing the why.",
    traversal: "decision → meeting → file → blocker",
    traversalIds: ["n6", "n4", "n2", "n7"],
    mode: "Trace decision provenance",
  },
  {
    num: "03",
    name: "Bring someone up to speed in minutes, not weeks",
    what: "When someone joins, rotates, or takes over, the predecessor’s mental model is rebuilt from scratch. The graph compresses it into a navigable inheritance the new person can step into.",
    traversal: "project → people → people → decision → file → blocker",
    traversalIds: ["n1", "n5", "n9", "n6", "n2", "n7"],
    mode: "Export navigable inheritance",
  },
  {
    num: "04",
    name: "Align the team’s actual thinking",
    what: "Status updates lag. Standups summarize. Neither shows whether the team holds a coherent shared intent. The graph traverses across people, threads, and decisions to find drift.",
    traversal: "person → thread → decision → person → project",
    traversalByRole: {
      engineering: ["n5", "n4", "n6", "n9", "n1"],
      sales:       ["n2", "n4", "n6", "n9", "n1"],
      finance:     ["n5", "n4", "n6", "n9", "n1"],
      support:     ["n5", "n8", "n6", "n2", "n1"],
      supplychain: ["n5", "n4", "n6", "n9", "n1"],
      peopleops:   ["n5", "n4", "n6", "n2", "n1"],
      sre:         ["n5", "n4", "n6", "n9", "n1"],
    },
    traversalIds: ["n5", "n4", "n6", "n9", "n1"],
    mode: "Cross-person traversal",
  },
  {
    num: "05",
    name: "Surface what your team has already figured out",
    what: "You’re stuck on a problem. Someone solved a similar one before. The associative layer finds the bridge — a past decision, often discoverable only through the person who connects both contexts.",
    traversal: "blocker → person (bridge) → past decision",
    traversalIds: ["n7", "SPOF", "n10"],
    mode: "Discovery across distance",
  },
  {
    num: "06",
    name: "Give AI the intent behind your work",
    what: "AI systems infer intent from prompts. They guess. The graph exposes the real cognitive state — active file, open blocker, pending decision, downstream person — as a queryable interface.",
    traversal: "file → blocker → decision → people",
    traversalIds: ["n2", "n7", "n6", "n9"],
    mode: "Expose intent to external system",
  },
  {
    num: "07",
    name: "Spot single points of organizational knowledge",
    what: "Every organization has a few people whose departure would erase critical context. The graph’s topology surfaces those single points — threads only one person touches.",
    traversal: null,
    traversalIds: [],
    mode: "Removal simulation",
    topology: true,
  },
];

const openChip: AppDef = {
  num: "+",
  name: "+ what we haven’t thought of yet",
  what: "The seven applications above are illustrative, not exhaustive. The graph is infrastructure. As we work with design partners, this list grows. What becomes queryable from the cognitive trail is bounded only by what someone needs to ask.",
  traversal: null,
  traversalIds: [],
  mode: "Open application class",
  open: true,
};

const allChips: AppDef[] = [...applications, openChip];

/* ── CSS ── */
/* Verbatim from _hii-widget-source.html lines 11-502, except:
   - body selector removed (no flex centering, no margin reset)
   - @import font line removed (site loads these globally via index.css)
   - :root variable block preserved exactly (values match site tokens) */
const widgetCss = `
:root {
  --bg: #0a0d12;
  --frame: #11151c;
  --elev: #1a1f29;
  --line: #232a36;
  --line-soft: #1a1f29;
  --text: #ece5d8;
  --text-2: #9aa0ab;
  --text-3: #5a606d;
  --amber: #e6b15c;
  --amber-soft: #8a6938;
  --cyan: #6ab6c4;
  --warning: #d97b8a;

  --node-people: #b89aff;
  --node-project: #6ab6c4;
  --node-decision: #e6b15c;
  --node-file: #84c987;
  --node-meeting: #f2a778;
  --node-blocker: #d97b8a;
}

.hii-widget,
.hii-widget * { box-sizing: border-box; }

.hii-widget {
  width: 100%;
  max-width: 1100px;
  background: var(--frame);
  border: 1px solid var(--line);
  border-radius: 4px;
  overflow: hidden;
  color: var(--text);
  font-family: 'Geist', -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  margin: 0 auto;
}

.hii-widget .widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--line);
  background: var(--bg);
}

.hii-widget .widget-label { display: flex; align-items: baseline; gap: 10px; }

.hii-widget .widget-label .name {
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: -0.01em;
}

.hii-widget .widget-label .sep { color: var(--text-3); }

.hii-widget .widget-label .desc {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--text-2);
}

.hii-widget .role-toggle {
  display: flex;
  gap: 4px;
  padding: 14px 20px;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  overflow-x: auto;
  scrollbar-width: none;
}
.hii-widget .role-toggle::-webkit-scrollbar { display: none; }

.hii-widget .role-chip {
  flex-shrink: 0;
  padding: 7px 14px;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-family: 'Geist', sans-serif;
  font-size: 12.5px;
  color: var(--text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}
.hii-widget .role-chip:hover { color: var(--text); border-color: var(--text-3); }
.hii-widget .role-chip.active {
  background: var(--text);
  color: var(--bg);
  border-color: var(--text);
  font-weight: 500;
}

.hii-widget .zone-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 24px 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--text-3);
}
.hii-widget .zone-label-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--text-3);
  flex-shrink: 0;
  margin-top: 4px;
}
.hii-widget .zone-label-text { line-height: 1.6; }
.hii-widget .zone-label-text .sub {
  display: block;
  color: var(--text-3);
  text-transform: none;
  letter-spacing: 0.02em;
  font-size: 11px;
  margin-top: 4px;
  font-family: 'Geist', sans-serif;
}

.hii-widget .zone-activity { padding: 0 24px 14px; }

.hii-widget .activity-stream {
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
  height: 50px;
  align-items: center;
  padding: 0 4px 4px;
}

.hii-widget .activity-item {
  flex: 1;
  min-width: 0;
  padding: 7px 10px;
  background: var(--elev);
  border: 1px solid var(--line);
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.4s ease;
  white-space: nowrap;
  overflow: hidden;
}
.hii-widget .activity-item.active {
  background: var(--bg);
  border-color: var(--cyan);
  box-shadow: 0 0 14px rgba(106, 182, 196, 0.25);
}

.hii-widget .activity-tool {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--text-3);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 2px 5px;
  border: 1px solid var(--line);
  border-radius: 2px;
  flex-shrink: 0;
}
.hii-widget .activity-item.active .activity-tool { color: var(--cyan); border-color: var(--cyan); }

.hii-widget .activity-label {
  font-size: 11.5px;
  color: var(--text-2);
  overflow: hidden;
  text-overflow: ellipsis;
}
.hii-widget .activity-item.active .activity-label { color: var(--text); }

.hii-widget .zone-graph { padding: 0 24px 24px; position: relative; }

.hii-widget .graph-canvas {
  background: linear-gradient(180deg, rgba(26, 31, 41, 0.4) 0%, rgba(10, 13, 18, 0) 100%);
  border: 1px solid var(--line-soft);
  border-radius: 3px;
  position: relative;
  height: 420px;
  overflow: hidden;
}
.hii-widget .graph-svg { width: 100%; height: 100%; display: block; }

.hii-widget .node-chip { fill: var(--bg); stroke-width: 1.2; transition: filter 0.4s ease, stroke-width 0.4s ease, opacity 0.4s ease; }
.hii-widget .node-text { font-family: 'Geist', sans-serif; font-size: 11px; fill: var(--text); transition: opacity 0.4s ease, fill 0.4s ease; pointer-events: none; }
.hii-widget .node-type-label { font-family: 'JetBrains Mono', monospace; font-size: 8px; letter-spacing: 0.16em; text-transform: uppercase; fill: var(--text-3); transition: opacity 0.4s ease; pointer-events: none; }
.hii-widget .gedge { transition: opacity 0.4s ease, stroke 0.4s ease, stroke-width 0.4s ease, stroke-dasharray 0.4s ease; }
.hii-widget .gedge-label { font-family: 'JetBrains Mono', monospace; font-size: 8px; fill: var(--text-3); letter-spacing: 0.12em; text-transform: uppercase; transition: opacity 0.4s ease, fill 0.4s ease; pointer-events: none; }

.hii-widget .dim { opacity: 0.12 !important; }
.hii-widget .lit-edge { stroke: var(--amber) !important; stroke-width: 1.8 !important; opacity: 1 !important; }
.hii-widget .lit-edge-label { fill: var(--amber) !important; opacity: 1 !important; }
.hii-widget .lit-node-chip { filter: drop-shadow(0 0 8px var(--amber)); stroke-width: 2 !important; stroke: var(--amber) !important; }

.hii-widget .spof-ghost { opacity: 0.15 !important; transition: opacity 1.2s ease; }
.hii-widget .spof-ghost .node-chip { stroke-dasharray: 2 4 !important; stroke: var(--text-3) !important; stroke-width: 0.8 !important; }
.hii-widget .spof-ghost .node-text, .hii-widget .spof-ghost .node-type-label, .hii-widget .spof-ghost .external-tag { fill: var(--text-3) !important; }

.hii-widget .spof-severed { stroke: var(--warning) !important; stroke-width: 1.2 !important; stroke-dasharray: 2 4 !important; opacity: 0.4 !important; transition: opacity 1.2s ease, stroke 1.2s ease; }
.hii-widget .spof-severed-label { fill: var(--warning) !important; opacity: 0.4 !important; }

.hii-widget .spof-remaining { opacity: 0.85; transition: opacity 1.2s ease; }
.hii-widget .spof-remaining-edge { opacity: 0.55; transition: opacity 1.2s ease; }

.hii-widget .spof-counter {
  position: absolute;
  bottom: 14px;
  right: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--warning);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 8px 12px;
  border: 1px solid var(--warning);
  border-radius: 2px;
  background: rgba(10, 13, 18, 0.85);
  opacity: 0;
  transition: opacity 0.6s ease;
  max-width: 280px;
  line-height: 1.5;
}
.hii-widget .spof-counter.visible { opacity: 1; }
.hii-widget .spof-counter .counter-label {
  color: var(--text-3);
  display: block;
  margin-bottom: 4px;
  font-size: 8px;
}
.hii-widget .spof-counter .counter-stat {
  color: var(--warning);
  font-size: 11px;
  font-weight: 500;
}
.hii-widget .spof-counter .counter-name {
  color: var(--text);
  font-size: 10px;
  display: block;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid rgba(217, 123, 138, 0.3);
  text-transform: none;
  letter-spacing: 0.02em;
  font-family: 'Geist', sans-serif;
}

.hii-widget .traversal-particle { fill: var(--amber); filter: drop-shadow(0 0 4px var(--amber)); }
.hii-widget .signal-particle { fill: var(--cyan); opacity: 0; }

.hii-widget .latent-edge {
  stroke-dasharray: 4 4;
  stroke-opacity: 0.25;
}

.hii-widget .external-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 7px;
  fill: var(--text-3);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  pointer-events: none;
  transition: fill 0.4s ease;
}

.hii-widget .mode-label {
  position: absolute;
  top: 14px;
  left: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--amber);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 5px 9px;
  border: 1px solid var(--amber);
  border-radius: 2px;
  background: rgba(10, 13, 18, 0.6);
  opacity: 0;
  transition: opacity 0.4s ease, color 0.4s ease, border-color 0.4s ease;
}
.hii-widget .mode-label.visible { opacity: 1; }
.hii-widget .mode-label.spof { color: var(--warning); border-color: var(--warning); }

.hii-widget .graph-tag {
  position: absolute;
  top: 14px;
  right: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--text-3);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 5px 9px;
  border: 1px solid var(--line);
  border-radius: 2px;
  background: rgba(10, 13, 18, 0.6);
}

.hii-widget .graph-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 18px;
  padding: 12px 24px 0;
  justify-content: center;
}
.hii-widget .legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--text-3);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.hii-widget .legend-swatch { width: 8px; height: 8px; border-radius: 50%; }

.hii-widget .zone-applications { padding: 0 24px 16px; }
.hii-widget .apps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }

@media (max-width: 900px) { .hii-widget .apps-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .hii-widget .apps-grid { grid-template-columns: 1fr; } }

.hii-widget .app-chip {
  background: var(--elev);
  border: 1px solid var(--line);
  padding: 14px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  color: inherit;
  transition: all 0.25s ease;
  border-radius: 3px;
  min-height: 84px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.hii-widget .app-chip:hover { background: var(--bg); border-color: var(--text-3); }
.hii-widget .app-chip.active {
  background: var(--bg);
  border-color: var(--amber);
  box-shadow: 0 0 0 1px var(--amber), 0 0 18px rgba(230, 177, 92, 0.18);
}
.hii-widget .app-chip.active-spof {
  border-color: var(--warning);
  box-shadow: 0 0 0 1px var(--warning), 0 0 18px rgba(217, 123, 138, 0.2);
}
.hii-widget .app-chip .num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--text-3);
  letter-spacing: 0.14em;
  margin-bottom: 8px;
}
.hii-widget .app-chip .name {
  font-family: 'Fraunces', serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--text);
  line-height: 1.2;
  letter-spacing: -0.005em;
}
.hii-widget .app-chip.active .name { color: var(--amber); }
.hii-widget .app-chip.active-spof .name { color: var(--warning); }

.hii-widget .app-chip.open {
  background: transparent;
  border: 1px dashed var(--text-3);
  opacity: 0.7;
}
.hii-widget .app-chip.open:hover { opacity: 1; border-color: var(--text-2); }
.hii-widget .app-chip.open.active { border-style: dashed; border-color: var(--amber); opacity: 1; }
.hii-widget .app-chip.open .name { color: var(--text-3); font-style: italic; }
.hii-widget .app-chip.open.active .name { color: var(--amber); }

.hii-widget .zone-detail {
  background: var(--bg);
  border-top: 1px solid var(--line);
  padding: 20px 24px;
  min-height: 96px;
}
.hii-widget .detail-empty {
  color: var(--text-3);
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 10px;
}
.hii-widget .detail-content {
  display: grid;
  grid-template-columns: 240px 1fr 220px;
  gap: 28px;
  align-items: start;
}
@media (max-width: 800px) {
  .hii-widget .detail-content { grid-template-columns: 1fr; gap: 14px; }
}
.hii-widget .detail-col-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--text-3);
  margin-bottom: 8px;
}
.hii-widget .detail-name {
  font-family: 'Fraunces', serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--amber);
}
.hii-widget .detail-name.spof { color: var(--warning); }
.hii-widget .detail-what { font-size: 13px; line-height: 1.55; color: var(--text); }
.hii-widget .detail-traversal {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--text-2);
  line-height: 1.6;
  letter-spacing: 0.02em;
}
.hii-widget .detail-traversal strong { color: var(--amber); font-weight: 500; }
.hii-widget .detail-traversal strong.spof { color: var(--warning); }
`;

/* ── Helpers ── */

function getNodeColor(type: string): string {
  const t = nodeTypes.find((x) => x.id === type);
  return t ? t.color : "#888";
}

function resolveTraversalIds(ids: string[], roleId: RoleId): string[] {
  const spofId = graphsByRole[roleId].spofId;
  return ids.map((id) => (id === "SPOF" ? spofId : id));
}

/* ── Component ── */

export default function HIIArchitecture() {
  const [activeRole, setActiveRole] = useState<RoleId>("engineering");
  const [activeChipIndex, setActiveChipIndex] = useState<number | null>(null);
  const [ambientActiveItem, setAmbientActiveItem] = useState<number>(-1);
  const [modeText, setModeText] = useState<string>("");
  const [modeVisible, setModeVisible] = useState<boolean>(false);
  const [modeIsSpof, setModeIsSpof] = useState<boolean>(false);
  const [spofVisible, setSpofVisible] = useState<boolean>(false);
  const [spofStats, setSpofStats] = useState<{ orphans: number; severed: number; name: string } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const streamRef = useRef<HTMLDivElement | null>(null);
  const nodeElsRef = useRef<Record<string, SVGGElement | null>>({});
  const edgeLineElsRef = useRef<Record<string, SVGLineElement>>({});
  const edgeLabelElsRef = useRef<Record<string, SVGTextElement>>({});
  const traversalTimersRef = useRef<number[]>([]);
  const ambientTimerRef = useRef<number | null>(null);
  const ambientIndexRef = useRef<number>(0);
  const activeChipIndexRef = useRef<number | null>(null);
  const activeRoleRef = useRef<RoleId>("engineering");

  useEffect(() => { activeChipIndexRef.current = activeChipIndex; }, [activeChipIndex]);
  useEffect(() => { activeRoleRef.current = activeRole; }, [activeRole]);

  const currentGraph = graphsByRole[activeRole];
  const nodeMap = Object.fromEntries(currentGraph.nodes.map((n) => [n.id, n])) as Record<string, GraphNode>;

  function clearTraversalTimers() {
    traversalTimersRef.current.forEach((t) => clearTimeout(t));
    traversalTimersRef.current = [];
  }

  function clearAllVisualStates() {
    Object.values(nodeElsRef.current).forEach((g) => {
      if (!g) return;
      g.querySelectorAll<SVGRectElement>(".node-chip").forEach((r) => {
        r.classList.remove("lit-node-chip", "dim");
        r.style.stroke = "";
        r.style.strokeWidth = "";
        r.style.transition = "";
      });
      g.querySelectorAll<SVGTextElement>(".node-text, .node-type-label").forEach((t) => t.classList.remove("dim"));
      g.classList.remove("spof-ghost");
    });
    Object.keys(edgeLineElsRef.current).forEach((key) => {
      const lineEl = edgeLineElsRef.current[key];
      const labelEl = edgeLabelElsRef.current[key];
      if (lineEl) lineEl.classList.remove("lit-edge", "dim", "spof-severed");
      if (labelEl) labelEl.classList.remove("lit-edge-label", "dim", "spof-severed-label");
    });
    svgRef.current?.querySelectorAll(".traversal-particle").forEach((p) => p.remove());
    setSpofVisible(false);
    setSpofStats(null);
    clearTraversalTimers();
  }

  function fireTraversal(rawIds: string[]) {
    clearAllVisualStates();
    if (!rawIds || rawIds.length === 0) return;
    const roleId = activeRoleRef.current;
    const traversalIds = resolveTraversalIds(rawIds, roleId);
    const roleEdges = graphsByRole[roleId].edges;
    const roleNodes = graphsByRole[roleId].nodes;

    Object.values(nodeElsRef.current).forEach((g) => {
      if (!g) return;
      g.querySelectorAll<Element>(".node-chip, .node-text, .node-type-label").forEach((el) => el.classList.add("dim"));
    });
    Object.keys(edgeLineElsRef.current).forEach((key) => {
      edgeLineElsRef.current[key]?.classList.add("dim");
      edgeLabelElsRef.current[key]?.classList.add("dim");
    });

    let step = 0;
    function animateStep() {
      if (step >= traversalIds.length) {
        const t = window.setTimeout(() => {
          const idx = activeChipIndexRef.current;
          if (idx !== null && !allChips[idx].topology) {
            fireTraversal(rawIds);
          }
        }, 1400);
        traversalTimersRef.current.push(t);
        return;
      }

      const nodeId = traversalIds[step];
      const nodeEl = nodeElsRef.current[nodeId];
      if (nodeEl) {
        nodeEl.querySelectorAll<SVGRectElement>(".node-chip").forEach((r) => {
          r.classList.remove("dim");
          r.classList.add("lit-node-chip");
        });
        nodeEl.querySelectorAll<Element>(".node-text, .node-type-label").forEach((el) => el.classList.remove("dim"));
      }

      if (step > 0) {
        const prev = traversalIds[step - 1];
        const fwdKey = `${prev}->${nodeId}`;
        const bwdKey = `${nodeId}->${prev}`;
        const lineEl = edgeLineElsRef.current[fwdKey] || edgeLineElsRef.current[bwdKey];
        const labelEl = edgeLabelElsRef.current[fwdKey] || edgeLabelElsRef.current[bwdKey];
        if (lineEl && labelEl) {
          lineEl.classList.remove("dim");
          lineEl.classList.add("lit-edge");
          labelEl.classList.remove("dim");
          labelEl.classList.add("lit-edge-label");

          const fromN = roleNodes.find((n) => n.id === prev);
          const toN = roleNodes.find((n) => n.id === nodeId);
          if (fromN && toN && svgRef.current) {
            const particle = document.createElementNS(SVG_NS, "circle");
            particle.setAttribute("r", "4");
            particle.classList.add("traversal-particle");
            particle.setAttribute("cx", String(fromN.x));
            particle.setAttribute("cy", String(fromN.y));
            svgRef.current.appendChild(particle);

            const startTime = performance.now();
            const duration = 500;
            const move = (now: number) => {
              const t = Math.min((now - startTime) / duration, 1);
              const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
              particle.setAttribute("cx", String(fromN.x + (toN.x - fromN.x) * eased));
              particle.setAttribute("cy", String(fromN.y + (toN.y - fromN.y) * eased));
              if (t < 1) requestAnimationFrame(move);
              else particle.remove();
            };
            requestAnimationFrame(move);
          }
        }
        // Silence unused-var lint without altering audited behavior
        void roleEdges;
      }

      step++;
      const tid = window.setTimeout(animateStep, 700);
      traversalTimersRef.current.push(tid);
    }
    animateStep();
  }

  function fireTopology() {
    clearAllVisualStates();
    const roleId = activeRoleRef.current;
    const g = graphsByRole[roleId];
    const spofId = g.spofId;
    const cluster = g.spofCluster;
    const spofLabel = g.spofLabel;

    const disappearingNodes = [spofId, ...cluster];
    const severedEdgeKeys = new Set<string>();
    g.edges.forEach((e) => {
      if (e.latent) return;
      if (disappearingNodes.includes(e.from) || disappearingNodes.includes(e.to)) {
        severedEdgeKeys.add(`${e.from}->${e.to}`);
      }
    });

    const orphanCount = cluster.length;
    const severedCount = severedEdgeKeys.size;

    const t1 = window.setTimeout(() => {
      const spofEl = nodeElsRef.current[spofId];
      if (spofEl) {
        spofEl.querySelectorAll<SVGRectElement>(".node-chip").forEach((r) => {
          r.style.transition = "stroke 0.3s ease";
          r.style.stroke = "var(--warning)";
          r.style.strokeWidth = "2";
        });
      }
    }, 0);
    traversalTimersRef.current.push(t1);

    const t2 = window.setTimeout(() => {
      disappearingNodes.forEach((nid) => {
        const nEl = nodeElsRef.current[nid];
        if (nEl) nEl.classList.add("spof-ghost");
      });
      severedEdgeKeys.forEach((key) => {
        const lineEl = edgeLineElsRef.current[key];
        const labelEl = edgeLabelElsRef.current[key];
        if (lineEl) lineEl.classList.add("spof-severed");
        if (labelEl) labelEl.classList.add("spof-severed-label");
      });
    }, 700);
    traversalTimersRef.current.push(t2);

    const t3 = window.setTimeout(() => {
      setSpofStats({ orphans: orphanCount, severed: severedCount, name: spofLabel });
      setSpofVisible(true);
    }, 1500);
    traversalTimersRef.current.push(t3);
  }

  function ambientTick() {
    if (activeChipIndexRef.current !== null) return;
    const roleId = activeRoleRef.current;
    const activities = roles[roleId].activities;
    if (activities.length === 0) return;

    const idx = ambientIndexRef.current % activities.length;
    setAmbientActiveItem(idx);
    ambientIndexRef.current += 1;

    const stream = streamRef.current;
    const items = stream?.querySelectorAll<HTMLDivElement>(".activity-item");
    if (!items || !items[idx] || !svgRef.current) return;
    const item = items[idx];
    const itemRect = item.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();
    if (svgRect.width === 0) return;

    const startXRatio = (itemRect.left + itemRect.width / 2 - svgRect.left) / svgRect.width;
    const startX = Math.max(20, Math.min(1080, startXRatio * 1100));
    const startY = -10;

    const roleNodes = graphsByRole[roleId].nodes;
    const nonLatent = roleNodes.filter((n) => !n.latent);
    const targets = [...nonLatent].sort(() => Math.random() - 0.5).slice(0, 2);

    targets.forEach((target, i) => {
      if (!svgRef.current) return;
      const particle = document.createElementNS(SVG_NS, "circle");
      particle.setAttribute("cx", String(startX));
      particle.setAttribute("cy", String(startY));
      particle.setAttribute("r", "2.4");
      particle.classList.add("signal-particle");
      svgRef.current.appendChild(particle);

      const duration = 900;
      const delay = i * 120;
      const startTime = performance.now() + delay;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        if (elapsed < 0) {
          requestAnimationFrame(animate);
          return;
        }
        const t = Math.min(elapsed / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const x = startX + (target.x - startX) * eased;
        const y = startY + (target.y - startY) * eased;
        particle.setAttribute("cx", String(x));
        particle.setAttribute("cy", String(y));
        particle.style.opacity = String(t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1);
        if (t < 1) requestAnimationFrame(animate);
        else particle.remove();
      };
      requestAnimationFrame(animate);
    });
  }

  /* ── Effects ── */

  useEffect(() => {
    setActiveChipIndex(null);
    setModeVisible(false);
    setModeText("");
    setModeIsSpof(false);
    setSpofVisible(false);
    setSpofStats(null);
    setAmbientActiveItem(-1);
    ambientIndexRef.current = 0;
    clearTraversalTimers();
  }, [activeRole]);

  useEffect(() => {
    if (ambientTimerRef.current !== null) {
      clearInterval(ambientTimerRef.current);
      ambientTimerRef.current = null;
    }
    if (activeChipIndex === null) {
      ambientTimerRef.current = window.setInterval(ambientTick, 1800);
    }
    return () => {
      if (ambientTimerRef.current !== null) {
        clearInterval(ambientTimerRef.current);
        ambientTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChipIndex, activeRole]);

  useEffect(() => {
    return () => {
      if (ambientTimerRef.current !== null) clearInterval(ambientTimerRef.current);
      traversalTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (activeChipIndexRef.current === null) return;
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest(".app-chip")) return;
      if (target.closest(".zone-detail")) return;
      if (target.closest(".role-chip")) return;
      setActiveChipIndex(null);
      setModeVisible(false);
      setModeText("");
      setModeIsSpof(false);
      clearAllVisualStates();
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Handlers ── */

  function handleRoleClick(roleId: RoleId) {
    if (roleId === activeRole) return;
    clearAllVisualStates();
    setActiveRole(roleId);
  }

  function handleChipClick(i: number) {
    const app = allChips[i];
    setActiveChipIndex(i);

    if (app.mode) {
      setModeText(app.mode);
      setModeVisible(true);
      setModeIsSpof(!!app.topology);
    } else {
      setModeVisible(false);
    }

    if (ambientTimerRef.current !== null) {
      clearInterval(ambientTimerRef.current);
      ambientTimerRef.current = null;
    }
    setAmbientActiveItem(-1);

    if (app.open) {
      clearAllVisualStates();
    } else if (app.topology) {
      fireTopology();
    } else {
      const roleId = activeRoleRef.current;
      const ids = app.traversalByRole && app.traversalByRole[roleId]
        ? app.traversalByRole[roleId]!
        : app.traversalIds;
      fireTraversal(ids);
    }
  }

  /* ── Render ── */

  const detailApp = activeChipIndex !== null ? allChips[activeChipIndex] : null;
  const detailIsTopology = !!detailApp?.topology;

  return (
    <>
      <style>{widgetCss}</style>
      <div className="hii-widget">
        <div className="widget-header">
          <div className="widget-label">
            <span className="name">Phossil</span>
            <span className="sep">·</span>
            <span className="desc">How it works</span>
          </div>
        </div>

        <div className="role-toggle">
          {(Object.keys(roles) as RoleId[]).map((rid) => (
            <button
              key={rid}
              className={`role-chip${rid === activeRole ? " active" : ""}`}
              onClick={() => handleRoleClick(rid)}
            >
              {roles[rid].label}
            </button>
          ))}
        </div>

        <div className="zones">
          <div className="zone-activity">
            <div className="zone-label">
              <span className="zone-label-dot" />
              <span className="zone-label-text">
                Your work · in the tools you already use
                <span className="sub">Phossil watches passively across your stack. No logging. No tagging. You just work.</span>
              </span>
            </div>
            <div className="activity-stream" ref={streamRef}>
              {roles[activeRole].activities.map((a, i) => (
                <div
                  key={`${activeRole}-${i}`}
                  className={`activity-item${activeChipIndex === null && i === ambientActiveItem ? " active" : ""}`}
                >
                  <span className="activity-tool">{a.tool}</span>
                  <span className="activity-label">{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="zone-graph">
            <div className="zone-label">
              <span className="zone-label-dot" style={{ background: "var(--cyan)", boxShadow: "0 0 6px var(--cyan)" }} />
              <span className="zone-label-text">
                The knowledge graph · typed nodes, typed edges, associative traversal
                <span className="sub">Every node is something in your head. Every edge is a relationship. The graph stays on your device.</span>
              </span>
            </div>
            <div className="graph-canvas">
              <div className="graph-tag">Live graph</div>
              <div className={`mode-label${modeVisible ? " visible" : ""}${modeIsSpof ? " spof" : ""}`}>{modeText}</div>
              <div className={`spof-counter${spofVisible ? " visible" : ""}`}>
                {spofStats && (
                  <>
                    <span className="counter-label">If this disappears</span>
                    <span className="counter-stat">{spofStats.orphans}</span>
                    {` node${spofStats.orphans === 1 ? "" : "s"} orphaned `}
                    &nbsp;·&nbsp;
                    <span className="counter-stat">{spofStats.severed}</span>
                    {` edge${spofStats.severed === 1 ? "" : "s"} severed`}
                    <span className="counter-name">{spofStats.name}</span>
                  </>
                )}
              </div>
              <svg ref={svgRef} className="graph-svg" viewBox="0 0 1100 420" preserveAspectRatio="xMidYMid meet">
                {currentGraph.edges.map((e) => {
                  const a = nodeMap[e.from];
                  const b = nodeMap[e.to];
                  if (!a || !b) return null;
                  const mx = (a.x + b.x) / 2;
                  const my = (a.y + b.y) / 2;
                  const edgeKey = `${e.from}->${e.to}`;
                  return (
                    <g key={`${activeRole}-${edgeKey}`}>
                      <line
                        ref={(el) => {
                          if (el) edgeLineElsRef.current[edgeKey] = el;
                          return () => {
                            if (edgeLineElsRef.current[edgeKey] === el) delete edgeLineElsRef.current[edgeKey];
                          };
                        }}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={e.latent ? "var(--amber-soft)" : "#3a4252"}
                        strokeWidth={1}
                        strokeOpacity={e.latent ? 0.25 : 0.5}
                        strokeDasharray={e.latent ? "4 4" : undefined}
                        className={`gedge${e.latent ? " latent-edge" : ""}`}
                      />
                      <text
                        ref={(el) => {
                          if (el) edgeLabelElsRef.current[edgeKey] = el;
                          return () => {
                            if (edgeLabelElsRef.current[edgeKey] === el) delete edgeLabelElsRef.current[edgeKey];
                          };
                        }}
                        x={mx}
                        y={my - 4}
                        textAnchor="middle"
                        className="gedge-label"
                        opacity={e.latent ? 0.35 : undefined}
                      >
                        {e.label}
                      </text>
                    </g>
                  );
                })}
                {currentGraph.nodes.map((n) => {
                  const charWidth = 6.5;
                  const padding = 16;
                  const chipW = Math.max(110, n.label.length * charWidth + padding * 2);
                  const chipH = 36;
                  const x = n.x - chipW / 2;
                  const y = n.y - chipH / 2;
                  const color = getNodeColor(n.type);
                  const typeFull = nodeTypes.find((t) => t.id === n.type)?.label ?? "";
                  const typeShort = typeFull.split(" ")[0];

                  return (
                    <g
                      key={`${activeRole}-${n.id}`}
                      ref={(el) => {
                        nodeElsRef.current[n.id] = el;
                        return () => {
                          if (nodeElsRef.current[n.id] === el) delete nodeElsRef.current[n.id];
                        };
                      }}
                      data-id={n.id}
                      data-type={n.type}
                      data-latent={n.latent ? "true" : undefined}
                    >
                      <rect
                        x={x}
                        y={y}
                        width={chipW}
                        height={chipH}
                        rx={4}
                        fill="#11151c"
                        stroke={color}
                        strokeWidth={1.2}
                        strokeDasharray={n.external ? "3 3" : undefined}
                        className="node-chip"
                        style={n.latent ? { opacity: 0.5 } : undefined}
                      />
                      <rect
                        x={x}
                        y={y}
                        width={4}
                        height={chipH}
                        rx={2}
                        fill={color}
                        style={n.external ? { opacity: 0.55 } : undefined}
                      />
                      <text x={x + 12} y={y + 13} className="node-type-label" fill={color}>
                        {typeShort}
                      </text>
                      {n.external && (
                        <text x={x + chipW - 8} y={y + 13} textAnchor="end" className="external-tag">
                          External
                        </text>
                      )}
                      <text x={x + 12} y={y + 27} className="node-text" style={n.latent ? { opacity: 0.6 } : undefined}>
                        {n.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="graph-legend">
              {nodeTypes.map((t) => (
                <div key={t.id} className="legend-item">
                  <span className="legend-swatch" style={{ background: t.color }} />
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="zone-applications">
            <div className="zone-label">
              <span className="zone-label-dot" style={{ background: "var(--amber)", boxShadow: "0 0 6px var(--amber)" }} />
              <span className="zone-label-text">
                Examples of what becomes queryable
                <span className="sub">Click any to see how the associative layer traverses the graph.</span>
              </span>
            </div>
            <div className="apps-grid">
              {allChips.map((app, i) => {
                const isActive = activeChipIndex === i;
                const isTopology = !!app.topology;
                const classes = ["app-chip"];
                if (app.open) classes.push("open");
                if (isActive) classes.push(isTopology ? "active-spof" : "active");
                return (
                  <button key={i} className={classes.join(" ")} onClick={() => handleChipClick(i)}>
                    <div>
                      <div className="num">{app.num}</div>
                      <div className="name">{app.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="zone-detail">
            {detailApp === null ? (
              <div className="detail-empty">
                <span>↑</span>
                <span>Select an application above</span>
              </div>
            ) : (
              <div className="detail-content">
                <div>
                  <div className="detail-col-label">
                    {detailApp.open ? "Open application class" : `Application ${detailApp.num}`}
                  </div>
                  <div className={`detail-name${detailIsTopology ? " spof" : ""}`}>{detailApp.name}</div>
                </div>
                <div>
                  <div className="detail-col-label">
                    {detailApp.open ? "Why this exists" : "What the graph enables"}
                  </div>
                  <div className="detail-what">{detailApp.what}</div>
                </div>
                <div>
                  <div className="detail-col-label">
                    {detailIsTopology ? "Removal simulation" : "Associative traversal"}
                  </div>
                  <div className="detail-traversal">
                    {detailApp.traversal ? (
                      <strong className={detailIsTopology ? "spof" : undefined}>{detailApp.traversal}</strong>
                    ) : detailIsTopology ? (
                      <strong className="spof">SPOF → cluster fades → see what survives</strong>
                    ) : (
                      <em style={{ color: "var(--text-3)", fontStyle: "italic" }}>
                        Any path, any node types — the graph is unbounded.
                      </em>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
