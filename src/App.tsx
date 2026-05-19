import Demo from "./components/Demo";

function App() {
  return (
    <div>
      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 24px",
        backgroundColor: "rgba(10, 13, 18, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: "var(--max-width)", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 22, fontWeight: 500,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}>Phossil</span>
          <a href="#demo" style={{
            padding: "8px 18px", borderRadius: 999,
          backgroundColor: "var(--text-primary)", color: "var(--bg)",
            fontSize: 13, fontWeight: 500, textDecoration: "none",
          }}>See your flow card</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: 160, paddingBottom: "var(--section-padding)",
        paddingLeft: 24, paddingRight: 24,
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 60, fontWeight: 300,
            lineHeight: 1.05,
            marginBottom: 32,
            letterSpacing: "-0.025em",
          }}>
            <span style={{
              display: "block",
              color: "var(--text-secondary)",
            }}>Software remembers your files.</span>
            <span style={{
              display: "block",
              color: "var(--text-primary)",
            }}>Phossil remembers your thinking.</span>
          </h1>
          <p style={{
            fontSize: 17, lineHeight: 1.65,
            color: "var(--text-secondary)",
            maxWidth: 680, margin: "0 auto 36px",
          }}>
            The reasoning behind your work — what you were testing, why you decided, what you were about to do next — usually vanishes the moment context shifts. Phossil captures it across your apps, files, and conversations, with strict privacy. Today's first surface is the flow card you'll see below. The graph it reads from is the architecture behind team alignment, institutional memory, and giving AI the intent behind your work.
          </p>
          <a href="#demo" style={{
            display: "inline-block",
            padding: "14px 32px", borderRadius: 999,
            backgroundColor: "var(--accent)", color: "var(--bg)",
            fontSize: 15, fontWeight: 600, textDecoration: "none",
            transition: "opacity 0.15s ease",
          }}>See what it looks like for your role</a>
        </div>
      </section>

      {/* Problem Stats */}
      <section style={{
        padding: "80px 24px",
        backgroundColor: "var(--bg-elevated)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 40, textAlign: "center",
          }}>
            <div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: 48, fontWeight: 300,
                color: "var(--text-primary)",
                marginBottom: 10,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}>Every 2 min</div>
              <p style={{
                color: "var(--text-secondary)",
                fontSize: 14, lineHeight: 1.55,
              }}>An interruption hits during core work hours</p>
            </div>
            <div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: 48, fontWeight: 300,
                color: "var(--text-primary)",
                marginBottom: 10,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}>23 min</div>
              <p style={{
                color: "var(--text-secondary)",
                fontSize: 14, lineHeight: 1.55,
              }}>To fully refocus after a single interruption</p>
            </div>
            <div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: 48, fontWeight: 300,
                color: "var(--text-primary)",
                marginBottom: 10,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}>275/day</div>
              <p style={{
                color: "var(--text-secondary)",
                fontSize: 14, lineHeight: 1.55,
              }}>Meetings, emails, and messages competing for your attention</p>
            </div>
          </div>
          <p style={{
            textAlign: "center",
            fontSize: 11,
            color: "var(--text-tertiary)",
            marginTop: 32,
            fontStyle: "italic",
            fontFamily: "var(--font-mono)",
          }}>
            Sources: Microsoft 2025 Work Trend Index (n=31,000 workers, 31 countries) · Gloria Mark, <em style={{ fontFamily: "var(--font-display)" }}>Attention Span</em> (Hanover Square Press, 2023)
          </p>
        </div>
      </section>

      {/* Privacy - positioned before demo to establish trust */}
      <section style={{
        padding: "var(--section-padding) 24px",
        backgroundColor: "var(--bg)",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: 44, fontWeight: 300,
              color: "var(--text-primary)",
              lineHeight: 1.1, letterSpacing: "-0.02em",
              marginBottom: 16,
            }}>Built local-first. Designed for enterprise trust.</h2>
            <p style={{
              fontSize: 16, lineHeight: 1.6,
              color: "var(--text-secondary)",
              maxWidth: 580, margin: "0 auto",
            }}>
              Your reasoning is the most sensitive data you generate. Three principles shape the architecture.
            </p>
          </div>

          <ol style={{
            listStyle: "none", padding: 0, margin: 0,
            display: "flex", flexDirection: "column", gap: 32,
            counterReset: "principle",
          }}>
            {[
              "Raw behavioral data stays on your device. Synthesis happens locally. Nothing about how you actually work is sent to a cloud you don't control.",
              "The cloud layer is optional and opt-in. When it's used, it processes derived signals only. Summaries and patterns, not raw capture.",
              "Self-hosting is the path for organizations with stricter requirements. Local-first is the foundation that makes that path possible.",
            ].map((text, i) => (
              <li key={i} style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 24, alignItems: "start",
              }}>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 36, fontWeight: 300,
                  color: "var(--accent)",
                  lineHeight: 1, letterSpacing: "-0.02em",
                  minWidth: 36,
                }}>{i + 1}</span>
                <p style={{
                  fontSize: 16, lineHeight: 1.65,
                  color: "var(--text-primary)",
                  margin: 0, paddingTop: 4,
                }}>{text}</p>
              </li>
            ))}
          </ol>

          <div style={{ textAlign: "center", marginTop: 56 }}>
            <a href="mailto:eric.espinel@infraction.space?subject=Phossil%20enterprise%20data%20requirements"
              style={{
                color: "var(--text-secondary)",
                fontSize: 14,
                textDecoration: "none",
                borderBottom: "1px solid var(--border-strong)",
                paddingBottom: 2,
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
            >Have stricter data requirements? Let's talk →</a>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" style={{
        padding: "var(--section-padding) 24px",
        backgroundColor: "var(--bg-elevated)",
      }}>
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          {/* Heading block */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11, fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 16,
            }}>The Wedge</div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: 44, fontWeight: 300,
              color: "var(--text-primary)",
              lineHeight: 1.1, letterSpacing: "-0.02em",
              marginBottom: 16,
            }}>The first surface is the flow card.</h2>
            <p style={{
              fontSize: 16, lineHeight: 1.6,
              color: "var(--text-secondary)",
              maxWidth: 640, margin: "0 auto",
            }}>
              It reconstructs your thinking after an interruption. Hypotheses, stuck points, and where to pick up. The flow card reads from a graph of your reasoning, captured automatically across your apps, files, and conversations.
            </p>
          </div>

          {/* Demo wrapper — subtle dark card */}
          <div style={{
            backgroundColor: "var(--bg)",
            border: "1px solid var(--border-strong)",
            borderRadius: 16,
            padding: 48,
            display: "flex",
            justifyContent: "center",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
          }}>
            <Demo />
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
