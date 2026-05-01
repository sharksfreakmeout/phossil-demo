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
          }}>See your flow card</a>
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
            After every meeting, every interruption, every Monday morning, you spend 15-30 minutes piecing together where you left off. Phossil reconstructs your working context in seconds. Not by asking you to log anything. By understanding how you work.
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
              <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--text-primary)", marginBottom: 8 }}>Every 2 min</div>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>An interruption hits during core work hours</p>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--text-primary)", marginBottom: 8 }}>25 min</div>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>To refocus on your original task after each one</p>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--text-primary)", marginBottom: 8 }}>275/day</div>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>Meetings, emails, and messages competing for your attention</p>
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-tertiary)", marginTop: 24, fontStyle: "italic" }}>
            Sources: Microsoft 2025 Work Trend Index (n=31,000 workers, 31 countries) · Gloria Mark, <em>Attention Span</em> (Hanover Square Press, 2023)
          </p>
        </div>
      </section>

      {/* Privacy - positioned before demo to establish trust */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 48 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18, flexShrink: 0,
            backgroundColor: "rgba(55,53,47,0.05)",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="5" y="7" width="22" height="18" rx="2" stroke="var(--text-secondary)" strokeWidth="1.5" fill="none"/>
              <path d="M11 16v-3a5 5 0 0 1 10 0v3" stroke="var(--text-primary)" strokeWidth="1.5" fill="none"/>
              <rect x="10" y="16" width="12" height="8" rx="1.5" stroke="var(--text-primary)" strokeWidth="1.5" fill="rgba(55,53,47,0.06)"/>
              <circle cx="16" cy="20" r="1.5" fill="var(--text-primary)"/>
            </svg>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, color: "var(--text-primary)", marginBottom: 12 }}>
              Built local-first. Designed for enterprise trust.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--text-secondary)", marginBottom: 12 }}>
              Phossil runs on your machine. Your cognitive data, your reasoning patterns, your entire work context stays on your device. No cloud processing. No data harvesting. No employer surveillance.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-secondary)" }}>
              When teams use Phossil, only the summaries you choose to share leave your device. Your raw activity stays local. Always. This is a tool for you, not a tool for monitoring you.
            </p>
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
              Pick your role. Pick your tools. We'll show you what cognitive recovery looks like.
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
            Phossil is a native app that runs on your computer. It observes, connects, and synthesizes, so you never have to reconstruct your own context again.
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
                Phossil sees the file you're editing, the message you're reading, the document you switched away from. Quietly. No buttons. No logging. No screenshots. Just awareness of what's active.
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
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>Recover</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 16 }}>
                When you sit down after an interruption, a meeting, or a full night away, Phossil synthesizes everything into a flow card: what you were thinking, what changed, and the single most important thing to do next.
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

      {/* Who Phossil is for - three audience tiers */}
      <section style={{ padding: "var(--section-padding) 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{
              fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--accent)", marginBottom: 12,
            }}>Who it's for</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 400, color: "var(--text-primary)", marginBottom: 12 }}>
              One system. Three layers of value.
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 540, margin: "0 auto" }}>
              Phossil starts as a personal tool and compounds into organizational infrastructure. Each layer builds on the one before it.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* For You */}
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 28,
              padding: "32px 36px", borderRadius: 16,
              backgroundColor: "rgba(59,130,246,0.04)",
              border: "1px solid rgba(59,130,246,0.12)",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                background: "linear-gradient(135deg, #E8F4FD, #D1E9FA)",
                border: "1px solid rgba(59,130,246,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="10" r="5" stroke="#3B82F6" strokeWidth="1.5" fill="rgba(59,130,246,0.1)"/>
                  <path d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#3B82F6" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3B82F6", marginBottom: 6 }}>For you</div>
                <h3 style={{ fontSize: 22, fontWeight: 500, color: "var(--text-primary)", marginBottom: 10, lineHeight: 1.3 }}>Your train of thought, rebuilt in seconds</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>
                  You know the moment. You sit down after a meeting, a break, a Monday morning, and stare at your screen trying to remember where you were. What file. Which thread. What you were actually trying to figure out. You check Slack, scan your tabs, skim your notes. Fifteen minutes later, you're still piecing it together. Phossil gives you a single card that answers: what were you thinking, what changed while you were away, and what to do next. No logging. No journaling. No input from you at all.
                </p>
              </div>
            </div>

            {/* For Your Team */}
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 28,
              padding: "32px 36px", borderRadius: 16,
              backgroundColor: "rgba(99,102,241,0.04)",
              border: "1px solid rgba(99,102,241,0.12)",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
                border: "1px solid rgba(99,102,241,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="10" cy="9" r="4" stroke="#6366F1" strokeWidth="1.5" fill="rgba(99,102,241,0.1)"/>
                  <circle cx="20" cy="9" r="4" stroke="#6366F1" strokeWidth="1.5" fill="rgba(99,102,241,0.1)"/>
                  <path d="M2 23c0-4.418 3.582-8 8-8" stroke="#6366F1" strokeWidth="1.5" fill="none"/>
                  <path d="M18 15c4.418 0 8 3.582 8 8" stroke="#6366F1" strokeWidth="1.5" fill="none"/>
                  <path d="M10 15h8" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="2 2"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6366F1", marginBottom: 6 }}>For your team</div>
                <h3 style={{ fontSize: 22, fontWeight: 500, color: "var(--text-primary)", marginBottom: 10, lineHeight: 1.3 }}>When someone leaves, what do they take with them?</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>
                  Every team has invisible knowledge: why that architecture decision was made, what was tried and abandoned, who holds the context on the system nobody else understands. Today, that knowledge lives in one person's head. When they go on leave, change roles, or quit, it walks out the door. Phossil captures reasoning, not just activity. Decision chains. Mental models. The "why" behind the "what." So when your team changes, the thinking doesn't disappear.
                </p>
              </div>
            </div>

            {/* For Your Organization */}
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 28,
              padding: "32px 36px", borderRadius: 16,
              backgroundColor: "rgba(139,92,246,0.04)",
              border: "1px solid rgba(139,92,246,0.12)",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                background: "linear-gradient(135deg, #F3EEFF, #E8DFFE)",
                border: "1px solid rgba(139,92,246,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="4" y="12" width="8" height="12" rx="1" stroke="#8B5CF6" strokeWidth="1.5" fill="rgba(139,92,246,0.1)"/>
                  <rect x="16" y="6" width="8" height="18" rx="1" stroke="#8B5CF6" strokeWidth="1.5" fill="rgba(139,92,246,0.1)"/>
                  <path d="M12 18h4" stroke="#8B5CF6" strokeWidth="1.5"/>
                  <line x1="7" y1="16" x2="9" y2="16" stroke="#8B5CF6" strokeWidth="1" opacity="0.5"/>
                  <line x1="7" y1="19" x2="9" y2="19" stroke="#8B5CF6" strokeWidth="1" opacity="0.5"/>
                  <line x1="19" y1="10" x2="21" y2="10" stroke="#8B5CF6" strokeWidth="1" opacity="0.5"/>
                  <line x1="19" y1="13" x2="21" y2="13" stroke="#8B5CF6" strokeWidth="1" opacity="0.5"/>
                  <line x1="19" y1="16" x2="21" y2="16" stroke="#8B5CF6" strokeWidth="1" opacity="0.5"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B5CF6", marginBottom: 6 }}>For your organization</div>
                <h3 style={{ fontSize: 22, fontWeight: 500, color: "var(--text-primary)", marginBottom: 10, lineHeight: 1.3 }}>Stop paying for the same lost hour, 10,000 times</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>
                  Microsoft found that knowledge workers are interrupted every 2 minutes. Each interruption costs 25 minutes of recovery. 80% of your workforce says they don't have the time or energy to do their job effectively. This isn't a motivation problem. It's a systems problem. Phossil gives your people faster re-entry into meaningful work, positioned as a benefit they actually want. And it gives your organization aggregated insight into where context breaks down, without ever monitoring individuals. This is the opposite of surveillance. It's infrastructure that treats your people with more dignity, not less.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA - positioned after audience tiers for maximum intent */}
      <section style={{ padding: "60px 24px", backgroundColor: "#EFEEE9" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 400, color: "var(--text-primary)", marginBottom: 16 }}>
            This is real, and we're building it now
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 32 }}>
            We're a small team looking for people who feel this problem deeply. If the card made something click, we want to talk to you. Not to sell you anything. To build the right thing.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://calendar.app.google/685uNiinuYMrmzVTA" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-block", padding: "14px 28px", borderRadius: 10,
              backgroundColor: "var(--text-primary)", color: "var(--bg)",
              fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>Book a 15-minute call</a>
            <a href="#demo" style={{
              display: "inline-block", padding: "14px 28px", borderRadius: 10,
              border: "1px solid var(--border-strong)", backgroundColor: "rgba(255,255,255,0.6)",
              color: "var(--text-primary)", fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>Try the demo</a>
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
              Because Phossil captures how you think, not just what you do, the applications compound over time. Each layer requires the one before it.
            </p>
          </div>

          {/* Visual layer stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 640, margin: "0 auto" }}>
            {[
              {
                label: "Today",
                title: "Cognitive continuity",
                desc: "Never lose your train of thought. Recover from interruptions, project re-entry, and return from leave in seconds.",
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
                desc: "When someone changes roles or leaves, their mental models stay. Dead ends, reasoning, and tribal knowledge preserved.",
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
                title: "AI context persistence",
                desc: "The persistent memory layer for every AI tool. Your AI agents stop being strangers and start understanding your work.",
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

      {/* Final CTA */}
      <section style={{ padding: "var(--section-padding) 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 400, color: "var(--text-primary)", marginBottom: 16 }}>
            Stop rebuilding context that shouldn't have been lost
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 32 }}>
            We're looking for people who feel this problem every day. If something on this page resonated, let's talk about building it together.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://calendar.app.google/685uNiinuYMrmzVTA" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-block", padding: "14px 28px", borderRadius: 10,
              backgroundColor: "var(--text-primary)", color: "var(--bg)",
              fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>Book a call</a>
            <a href="#demo" style={{
              display: "inline-block", padding: "14px 28px", borderRadius: 10,
              border: "1px solid var(--border-strong)", backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)", fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>Try the demo</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "32px 24px", borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <p style={{ color: "var(--text-tertiary)", fontSize: 13 }}>
          Phossil · Cognitive infrastructure for knowledge work · Local-first by design · Built in Utah
        </p>
      </footer>
    </div>
  );
}

export default App;
