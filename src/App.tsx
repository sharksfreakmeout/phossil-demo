import Demo from "./components/Demo";

function App() {
  return (
    <div>
      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 24px", backgroundColor: "rgba(250,250,248,0.9)",
        backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "linear-gradient(135deg, #3B82F6, #6366F1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: "#fff", fontWeight: 700,
            }}>P</div>
            <span style={{ fontSize: 17, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Phossil</span>
          </div>
          <a href="#demo" style={{
            padding: "8px 18px", borderRadius: 8,
            backgroundColor: "var(--text-primary)", color: "var(--bg)",
            fontSize: 13, fontWeight: 600, textDecoration: "none",
          }}>Try the demo</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: 160, paddingBottom: "var(--section-padding)",
        paddingLeft: 24, paddingRight: 24,
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 400,
            lineHeight: 1.15, color: "var(--text-primary)", marginBottom: 20,
            letterSpacing: "-0.02em",
          }}>
            How long does it take you to <em>actually</em> start working?
          </h1>
          <p style={{
            fontSize: 19, lineHeight: 1.6, color: "var(--text-secondary)",
            maxWidth: 580, margin: "0 auto 36px",
          }}>
            Every morning you spend 30-60 minutes piecing together where everything stands. Phossil runs quietly on your machine, watches how you work across all your tools, and reconstructs your full mental state the moment you need it. No logging. No input. It just knows.
          </p>
          <a href="#demo" style={{
            display: "inline-block", padding: "14px 32px", borderRadius: 10,
            backgroundColor: "var(--text-primary)", color: "var(--bg)",
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            transition: "opacity 0.15s ease",
          }}>See what it looks like for your role</a>
        </div>
      </section>

      {/* Problem Stats */}
      <section style={{
        padding: "80px 24px", backgroundColor: "#EFEEE9",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, textAlign: "center" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--text-primary)", marginBottom: 8 }}>23 min</div>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>Average time to get back in the zone after a single interruption</p>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--text-primary)", marginBottom: 8 }}>2.1 hrs</div>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>Productive time lost per person per day to flow re-entry</p>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--text-primary)", marginBottom: 8 }}>57%</div>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>Of work sessions are interrupted before completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" style={{ padding: "var(--section-padding) 24px" }}>
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{
              fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--accent)", marginBottom: 12,
            }}>Interactive Demo</p>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 400,
              color: "var(--text-primary)", marginBottom: 12,
            }}>See your flow card</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 520, margin: "0 auto 16px" }}>
              A few taps. Ten seconds. We'll generate a flow card personalized to your role.
            </p>
            <p style={{
              fontSize: 13, color: "var(--text-tertiary)", maxWidth: 480, margin: "0 auto",
              fontStyle: "italic",
            }}>
              In the real product, you never type any of this. Phossil captures everything automatically by observing your tools. This demo simulates what that experience feels like.
            </p>
          </div>

          {/* Demo container */}
          <div style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(59,130,246,0.04) 100%)",
            border: "1px solid rgba(99,102,241,0.1)",
            borderRadius: 20,
            padding: "48px 32px",
            boxShadow: "0 0 80px rgba(99,102,241,0.06), 0 0 0 1px rgba(99,102,241,0.03)",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -1, left: 40, right: 40, height: 2,
              background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)",
              borderRadius: 2,
            }} />
            <Demo />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "var(--section-padding) 24px", backgroundColor: "#EFEEE9" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 400, color: "var(--text-primary)" }}>
              How Phossil works
            </h2>
          </div>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 15, maxWidth: 520, margin: "0 auto 56px" }}>
            Phossil is a native app that runs on your computer. It watches, connects, and synthesizes, so you never have to reconstruct your own context again.
          </p>

          {/* Visual flow */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 0 }}>
            {/* Step 1: Observe */}
            <div style={{ flex: 1, maxWidth: 260, textAlign: "center" }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20, margin: "0 auto 20px",
                background: "linear-gradient(135deg, #E8F4FD, #D1E9FA)",
                border: "1px solid rgba(59,130,246,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M18 8C10 8 4 18 4 18s6 10 14 10 14-10 14-10-6-10-14-10z" stroke="#3B82F6" strokeWidth="2" fill="none"/>
                  <circle cx="18" cy="18" r="5" stroke="#3B82F6" strokeWidth="2" fill="rgba(59,130,246,0.1)"/>
                  <circle cx="18" cy="18" r="2" fill="#3B82F6"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>Observe</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 16 }}>
                Phossil sees the file you're editing, the Slack thread you're reading, the ticket you just opened, and the doc you switched away from. Passively. No buttons. No logging.
              </p>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center",
              }}>
                {["VS Code", "Slack", "Jira", "Docs", "Chrome", "Terminal"].map((tool) => (
                  <span key={tool} style={{
                    fontSize: 10, color: "#3B82F6", backgroundColor: "rgba(59,130,246,0.08)",
                    padding: "2px 8px", borderRadius: 10, fontFamily: "var(--font-mono)",
                  }}>{tool}</span>
                ))}
              </div>
            </div>

            {/* Arrow 1 */}
            <div style={{ display: "flex", alignItems: "center", padding: "36px 8px 0" }}>
              <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                <path d="M0 12h40" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeDasharray="4 4"/>
                <path d="M36 6l8 6-8 6" stroke="var(--text-tertiary)" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>

            {/* Step 2: Connect */}
            <div style={{ flex: 1, maxWidth: 260, textAlign: "center" }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20, margin: "0 auto 20px",
                background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
                border: "1px solid rgba(99,102,241,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="10" r="3" fill="rgba(99,102,241,0.2)" stroke="#6366F1" strokeWidth="1.5"/>
                  <circle cx="10" cy="26" r="3" fill="rgba(99,102,241,0.2)" stroke="#6366F1" strokeWidth="1.5"/>
                  <circle cx="26" cy="26" r="3" fill="rgba(99,102,241,0.2)" stroke="#6366F1" strokeWidth="1.5"/>
                  <circle cx="28" cy="14" r="2" fill="rgba(99,102,241,0.15)" stroke="#6366F1" strokeWidth="1"/>
                  <circle cx="8" cy="16" r="2" fill="rgba(99,102,241,0.15)" stroke="#6366F1" strokeWidth="1"/>
                  <line x1="18" y1="13" x2="10" y2="23" stroke="#6366F1" strokeWidth="1" opacity="0.4"/>
                  <line x1="18" y1="13" x2="26" y2="23" stroke="#6366F1" strokeWidth="1" opacity="0.4"/>
                  <line x1="10" y1="26" x2="26" y2="26" stroke="#6366F1" strokeWidth="1" opacity="0.4"/>
                  <line x1="18" y1="10" x2="28" y2="14" stroke="#6366F1" strokeWidth="1" opacity="0.3"/>
                  <line x1="18" y1="10" x2="8" y2="16" stroke="#6366F1" strokeWidth="1" opacity="0.3"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>Connect</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 16 }}>
                A knowledge graph maps how your work relates: that doc connects to a ticket, the ticket has a deadline from your manager, and your manager just changed the priority in Slack.
              </p>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center",
              }}>
                {["files → tickets", "people → deadlines", "decisions → context"].map((rel) => (
                  <span key={rel} style={{
                    fontSize: 10, color: "#6366F1", backgroundColor: "rgba(99,102,241,0.08)",
                    padding: "2px 8px", borderRadius: 10, fontFamily: "var(--font-mono)",
                  }}>{rel}</span>
                ))}
              </div>
            </div>

            {/* Arrow 2 */}
            <div style={{ display: "flex", alignItems: "center", padding: "36px 8px 0" }}>
              <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                <path d="M0 12h40" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeDasharray="4 4"/>
                <path d="M36 6l8 6-8 6" stroke="var(--text-tertiary)" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>

            {/* Step 3: Recover */}
            <div style={{ flex: 1, maxWidth: 260, textAlign: "center" }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20, margin: "0 auto 20px",
                background: "linear-gradient(135deg, #DCFCE7, #BBF7D0)",
                border: "1px solid rgba(34,197,94,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect x="6" y="8" width="24" height="20" rx="3" stroke="#22C55E" strokeWidth="1.5" fill="rgba(34,197,94,0.08)"/>
                  <line x1="10" y1="14" x2="22" y2="14" stroke="#22C55E" strokeWidth="1.5" opacity="0.6"/>
                  <line x1="10" y1="18" x2="26" y2="18" stroke="#22C55E" strokeWidth="1" opacity="0.3"/>
                  <line x1="10" y1="21" x2="20" y2="21" stroke="#22C55E" strokeWidth="1" opacity="0.3"/>
                  <path d="M22 22l2 2 4-4" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>Flow</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 16 }}>
                When you sit down, Phossil synthesizes everything into a flow card: what you were thinking, what changed while you were away, and the single most important thing to do next.
              </p>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center",
              }}>
                {["your intent", "what changed", "what's next"].map((item) => (
                  <span key={item} style={{
                    fontSize: 10, color: "#22C55E", backgroundColor: "rgba(34,197,94,0.08)",
                    padding: "2px 8px", borderRadius: 10, fontFamily: "var(--font-mono)",
                  }}>{item}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Key differentiator callout */}
          <div style={{
            maxWidth: 560, margin: "48px auto 0", textAlign: "center",
            padding: "20px 24px", borderRadius: 12,
            backgroundColor: "rgba(255,255,255,0.6)",
            border: "1px solid var(--border)",
          }}>
            <p style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 500, margin: 0, lineHeight: 1.55 }}>
              Unlike note-taking apps, meeting recorders, or AI assistants, Phossil requires zero input from you. It captures context by observing your actual work, not by asking you to describe it.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section style={{ padding: "var(--section-padding) 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{
              fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--accent)", marginBottom: 12,
            }}>The bigger picture</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 400, color: "var(--text-primary)", marginBottom: 12 }}>
              The flow card is just the beginning
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 540, margin: "0 auto" }}>
              Because Phossil captures how you think, not just what you do, the applications go far beyond getting back on track. Each layer builds on the one before it.
            </p>
          </div>

          {/* Visual layer stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 640, margin: "0 auto" }}>
            {[
              {
                label: "Today",
                title: "Cognitive continuity",
                desc: "Never lose your train of thought. Interruptions, project re-entry, return from leave.",
                color: "#3B82F6",
                bg: "rgba(59,130,246,0.06)",
                border: "rgba(59,130,246,0.15)",
              },
              {
                label: "",
                title: "Decision provenance",
                desc: "\"Why did we build it this way?\" becomes answerable. Full reasoning chains, not just outcomes.",
                color: "#6366F1",
                bg: "rgba(99,102,241,0.06)",
                border: "rgba(99,102,241,0.12)",
              },
              {
                label: "",
                title: "Knowledge transfer",
                desc: "When someone leaves, their mental models stay. Dead ends, reasoning, and tribal knowledge captured.",
                color: "#8B5CF6",
                bg: "rgba(139,92,246,0.06)",
                border: "rgba(139,92,246,0.12)",
              },
              {
                label: "Tomorrow",
                title: "Team intelligence",
                desc: "Detect parallel work, diverging assumptions, and knowledge concentration risk across your team.",
                color: "#A855F7",
                bg: "rgba(168,85,247,0.06)",
                border: "rgba(168,85,247,0.12)",
              },
              {
                label: "",
                title: "AI that actually knows you",
                desc: "The persistent memory layer for every AI tool. Your AI stops being a stranger and starts being a colleague.",
                color: "#C084FC",
                bg: "rgba(192,132,252,0.06)",
                border: "rgba(192,132,252,0.12)",
              },
            ].map((layer, i) => (
              <div key={i} style={{ position: "relative" }}>
                {layer.label && (
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: layer.color, marginBottom: 8, paddingLeft: 16,
                  }}>{layer.label}</div>
                )}
                <div style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "20px 24px",
                  backgroundColor: layer.bg,
                  border: `1px solid ${layer.border}`,
                  borderBottom: i < 4 ? "none" : `1px solid ${layer.border}`,
                  borderRadius: i === 0 ? "12px 12px 0 0" : i === 4 ? "0 0 12px 12px" : 0,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    backgroundColor: layer.bg,
                    border: `1px solid ${layer.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: layer.color,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{layer.title}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{layer.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p style={{
            textAlign: "center", fontSize: 13, color: "var(--text-tertiary)", marginTop: 20,
            fontStyle: "italic",
          }}>
            Each layer requires the one before it. You can't have decision provenance without capture. You can't have team intelligence without individual graphs.
          </p>
        </div>
      </section>

      {/* Local-first */}
      <section style={{ padding: "80px 24px", backgroundColor: "#EFEEE9" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, margin: "0 auto 20px",
            backgroundColor: "rgba(55,53,47,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="4" y="6" width="20" height="16" rx="2" stroke="var(--text-secondary)" strokeWidth="1.5" fill="none"/>
              <path d="M10 22h8" stroke="var(--text-secondary)" strokeWidth="1.5"/>
              <path d="M14 18v4" stroke="var(--text-secondary)" strokeWidth="1.5"/>
              <path d="M11 12l2 2 4-4" stroke="var(--text-primary)" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 400, color: "var(--text-primary)", marginBottom: 16 }}>
            Your thoughts stay on your device
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--text-secondary)" }}>
            Phossil is local-first. Your cognitive data, your reasoning patterns, your entire work context never leaves your machine. No cloud processing. No data harvesting. Enterprise-ready privacy from day one.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "var(--section-padding) 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 400, color: "var(--text-primary)", marginBottom: 16 }}>
            Stop losing your train of thought
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 32 }}>
            We're looking for design partners who want to build the future of cognitive continuity. If you felt something when you saw the card, let's talk.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#demo" style={{
              display: "inline-block", padding: "14px 28px", borderRadius: 10,
              backgroundColor: "var(--text-primary)", color: "var(--bg)",
              fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>Try the demo</a>
            <a href="mailto:teamphossil@gmail.com" style={{
              display: "inline-block", padding: "14px 28px", borderRadius: 10,
              border: "1px solid var(--border-strong)", backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)", fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>Get in touch</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "32px 24px", borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <p style={{ color: "var(--text-tertiary)", fontSize: 13 }}>
          Phossil · Cognitive infrastructure for knowledge work
        </p>
      </footer>
    </div>
  );
}

export default App;
