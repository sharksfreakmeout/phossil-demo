import Demo from "./components/Demo";
import LivingGraph from "./components/LivingGraph";
import { useState, useEffect } from "react";

interface Beat {
  verb: string;
  word: string;
  your?: boolean;
  work: string;
  team: string;
  org: string;
}

const BEATS: Beat[] = [
  { verb: "remembers", word: "reasoning", your: true,
    work: "why you ruled out the other options, not just the one you shipped.",
    team: "why the call was made, so no one reopens it from scratch.",
    org: "the reasoning behind decisions no one is left to explain." },
  { verb: "remembers", word: "what you knew",
    work: "what you knew at the time, when you need to explain the call later.",
    team: "what the team learned the hard way, even after the people leave.",
    org: "what took years to learn and would take years to learn again." },
  { verb: "protects", word: "focus", your: true,
    work: "drop back into deep focus fast, instead of rebuilding it every time.",
    team: "keep the team in flow, not in catch-up.",
    org: "put the company's attention where it actually matters." },
  { verb: "works with", word: "energy", your: true,
    work: "do deep work when you're in flow, and pick up gently when you're not.",
    team: "see the team's real workload, before good people burn out.",
    org: "protect the company's focus as a resource, not just its time." },
  { verb: "remembers", word: "how your thinking changed",
    work: "see how you got to today's answer, so you don't relearn it tomorrow.",
    team: "watch the team's understanding sharpen, instead of starting over each time.",
    org: "see how the strategy actually shifted, not the story told after the fact." },
  { verb: "remembers", word: "how it all connects",
    work: "find the thinking that already solves the problem in front of you.",
    team: "surface the link between two people's work that neither of them saw.",
    org: "catch two teams solving the same problem before you pay for it twice." },
];

const COG_MODES = [
  { label: "WHEN YOU MAKE",        text: "the reasoning behind what you built, not just the thing you shipped." },
  { label: "WHEN YOU DECIDE",      text: "what you weighed, what you ruled out, and why you landed where you did." },
  { label: "WHEN YOU COORDINATE",  text: "the thread of who's doing what and why, without the status meeting." },
  { label: "WHEN YOU INVESTIGATE", text: "what you've already checked, what you ruled out, where the trail went cold." },
  { label: "WHEN YOU SYNTHESIZE",  text: "how the pieces connected into the conclusion you reached." },
  { label: "WHEN YOU COUNSEL",     text: "the reasoning you gave, so your advice holds up when someone acts on it later." },
];

const EYEBROW: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  color: "var(--accent)",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  marginBottom: 20,
};

const H2: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 38,
  fontWeight: 400,
  color: "var(--text-primary)",
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  marginBottom: 28,
};

const HERO_HOLD_MS = 6500;
const HERO_OUT_MS = 400;
const HERO_IN_MS = 700;
const HERO_STAGGER_MS = 80;
const HERO_OUT_WAIT_MS = HERO_OUT_MS + HERO_STAGGER_MS * 3; // 640: longest cascade out

type HeroVis = "in" | "out" | "prep";

function App() {
  const [beatIdx, setBeatIdx] = useState(0);
  const [vis, setVis] = useState<HeroVis>("in");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let mounted = true;

    if (reducedMotion) {
      // Instant swap, no fade, still cycles
      const id = window.setInterval(() => {
        setBeatIdx((prev) => (prev + 1) % BEATS.length);
      }, HERO_HOLD_MS);
      return () => {
        mounted = false;
        window.clearInterval(id);
      };
    }

    const timers: number[] = [];
    function tick() {
      if (!mounted) return;
      timers.push(window.setTimeout(() => {
        if (!mounted) return;
        setVis("out");
        timers.push(window.setTimeout(() => {
          if (!mounted) return;
          setBeatIdx((prev) => (prev + 1) % BEATS.length);
          setVis("prep");
          // Two rAFs so the browser paints the prep state before "in" triggers,
          // letting the transform/opacity transition kick in cleanly.
          requestAnimationFrame(() => {
            if (!mounted) return;
            requestAnimationFrame(() => {
              if (!mounted) return;
              setVis("in");
              tick();
            });
          });
        }, HERO_OUT_WAIT_MS));
      }, HERO_HOLD_MS));
    }
    tick();

    return () => {
      mounted = false;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [reducedMotion]);

  const b = BEATS[beatIdx];

  function heroFade(staggerMs: number): React.CSSProperties {
    if (reducedMotion) {
      return { opacity: 1 };
    }
    if (vis === "in") {
      return {
        opacity: 1,
        transform: "translateY(0)",
        transition: `opacity ${HERO_IN_MS}ms ease-in-out ${staggerMs}ms, transform ${HERO_IN_MS}ms ease-in-out ${staggerMs}ms`,
        willChange: "opacity, transform",
      };
    }
    if (vis === "out") {
      return {
        opacity: 0,
        transition: `opacity ${HERO_OUT_MS}ms ease-in-out ${staggerMs}ms`,
        willChange: "opacity",
      };
    }
    // "prep": invisible + pre-drift, no transition so the next "in" can animate
    return {
      opacity: 0,
      transform: "translateY(6px)",
      transition: "none",
    };
  }

  return (
    <div>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 24px",
        backgroundColor: "rgba(10,13,18,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: "var(--max-width)", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 20, fontWeight: 500,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}>Phossil</span>
          <a href="mailto:teamphossil@gmail.com" style={{
            padding: "8px 18px", borderRadius: 999,
            backgroundColor: "var(--accent)", color: "var(--bg)",
            fontSize: 13, fontWeight: 500, textDecoration: "none",
          }}>Become a design partner</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        paddingTop: 140, paddingBottom: 96,
        paddingLeft: 24, paddingRight: 24,
        backgroundColor: "var(--bg)",
      }}>
        <div style={{
          maxWidth: "var(--max-width)", margin: "0 auto",
          display: "flex", flexWrap: "wrap", gap: 48,
          alignItems: "center",
        }}>
          {/* Left column */}
          <div style={{ flex: "1 1 480px", minWidth: 0 }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(34px, 4.6vw, 46px)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 36,
            }}>
              <span style={{ display: "block", color: "var(--text-secondary)" }}>
                Software remembers your files.
              </span>
              <span style={{ display: "block", color: "var(--text-primary)" }}>
                <span>Phossil </span>
                <span style={{
                  display: "inline-block",
                  verticalAlign: "baseline",
                  ...heroFade(0),
                }}>
                  {b.verb}{b.your ? " your " : " "}
                  <em style={{
                    fontStyle: "italic",
                    color: "var(--accent)",
                    fontFamily: "var(--font-display)",
                  }}>{b.word}</em>.
                </span>
              </span>
            </h1>

            {/* Audience lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 36 }}>
              {[
                { label: "FOR YOUR WORK", text: b.work },
                { label: "FOR YOUR TEAM", text: b.team },
                { label: "FOR YOUR ORG",  text: b.org  },
              ].map((line, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--accent)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}>{line.label}</div>
                  <div style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    ...heroFade((i + 1) * HERO_STAGGER_MS),
                  }}>{line.text}</div>
                </div>
              ))}
            </div>

            <a href="#demo" style={{
              display: "inline-block",
              padding: "14px 32px",
              borderRadius: 999,
              backgroundColor: "var(--accent)",
              color: "var(--bg)",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              marginBottom: 12,
            }}>See the flow card</a>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-tertiary)",
            }}>Pre-build. Talking to design partners now.</div>
          </div>

          {/* Right column — Living Graph */}
          <div style={{ flex: "1 1 380px", minWidth: 0 }}>
            <LivingGraph />
          </div>
        </div>
      </section>

      {/* SECTION 2 — THE PROBLEM */}
      <section style={{
        backgroundColor: "var(--bg-elevated)",
        padding: "var(--section-padding) 24px",
      }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div style={EYEBROW}>The Problem</div>
            <h2 style={{ ...H2, textAlign: "center" }}>The most valuable thing you produce is the thing nothing saves.</h2>
          </div>
          <p style={{
            fontSize: 18, lineHeight: 1.6,
            color: "var(--text-secondary)",
          }}>Files get saved. Messages get logged. But the reasoning behind the work, what you intended, what you ruled out, how your understanding changed, where the real effort went, none of it is captured anywhere. It lives for a moment in working memory and then it's gone, scattered across tools or lost to the next interruption. Multiply that across a team and a company, and the result is the same every time: the work survives, the thinking behind it doesn't.</p>
        </div>
      </section>

      {/* SECTION 3 — THE WEDGE (demo) */}
      <section id="demo" style={{
        backgroundColor: "var(--bg)",
        padding: "var(--section-padding) 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div style={EYEBROW}>The First Application</div>
            <h2 style={{ ...H2, marginBottom: 20, textAlign: "center" }}>Start with the moment you sit back down.</h2>
            <p style={{
              fontSize: 17, lineHeight: 1.6,
              color: "var(--text-secondary)",
              maxWidth: 620, margin: "0 auto",
            }}>The flow card reconstructs where you were the instant before you got pulled away. What you were testing, what you'd ruled out, what you were about to do next. Not your open tabs. Your train of thought.</p>
          </div>
          <div style={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "48px 32px",
            marginTop: 48,
          }}>
            <Demo />
          </div>
        </div>
      </section>

      {/* SECTION 4 — THE ARCHITECTURE */}
      <section style={{
        backgroundColor: "var(--bg-elevated)",
        padding: "var(--section-padding) 24px",
      }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div style={EYEBROW}>The Architecture</div>
            <h2 style={{ ...H2, textAlign: "center" }}>One graph. Everything you think becomes usable.</h2>
          </div>
          <p style={{
            fontSize: 17, lineHeight: 1.6,
            color: "var(--text-secondary)",
            maxWidth: 640,
            margin: "0 auto",
            marginBottom: 48,
            textAlign: "center",
          }}>The flow card is one application. Underneath it is a graph that captures the full texture of how work actually happens.</p>

          {[
            { label: "FOR ONE PERSON", text: "Continuity, focus, and the ability to see how you actually work." },
            { label: "FOR A TEAM",     text: "Shared understanding, faster handoffs, and alignment that doesn't need a meeting. Federated with consent." },
            { label: "FOR A COMPANY",  text: "Institutional memory, risk you can see coming, and a substrate AI agents can finally act on." },
          ].map((row, i, arr) => (
            <div key={i} style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              padding: "28px 0",
              alignItems: "baseline",
              borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{
                flex: "0 1 180px",
                minWidth: 180,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--accent)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}>{row.label}</div>
              <div style={{
                flex: "1 1 320px",
                fontFamily: "var(--font-body)",
                fontSize: 17,
                color: "var(--text-primary)",
                lineHeight: 1.55,
              }}>{row.text}</div>
            </div>
          ))}

          <div style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 20,
            color: "var(--text-secondary)",
            textAlign: "center",
            marginTop: 48,
            letterSpacing: "-0.01em",
          }}>Same graph. The applications multiply with the scale.</div>
        </div>
      </section>

      {/* SECTION 5 — COGNITIVE MODES */}
      <section style={{
        backgroundColor: "var(--bg)",
        padding: "var(--section-padding) 24px",
      }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <h2 style={{ ...H2, textAlign: "center", marginBottom: 20 }}>Whatever kind of work you do, the thinking is what matters.</h2>
          <p style={{
            fontSize: 17, lineHeight: 1.6,
            color: "var(--text-secondary)",
            maxWidth: 620, margin: "0 auto",
            textAlign: "center",
          }}>Phossil doesn't care what your job title is. It works at the level underneath the job: the thinking every kind of knowledge work runs on.</p>

          <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 20 }}>
            {COG_MODES.map((m, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "minmax(180px, 200px) 1fr",
                gap: 28,
                alignItems: "baseline",
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--accent)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}>{m.label}</div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  color: "var(--text-primary)",
                  lineHeight: 1.55,
                }}>{m.text}</div>
              </div>
            ))}
          </div>

          <div style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 20,
            color: "var(--text-secondary)",
            textAlign: "center",
            marginTop: 56,
            letterSpacing: "-0.01em",
          }}>Six ways of working. One thing underneath all of them.</div>
        </div>
      </section>

      {/* SECTION 6 — THE CATEGORY */}
      <section style={{
        backgroundColor: "var(--bg-elevated)",
        padding: "var(--section-padding) 24px",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={EYEBROW}>The Category</div>
          <h2 style={H2}>This is infrastructure for how people think.</h2>
          <p style={{
            fontSize: 17, lineHeight: 1.6,
            color: "var(--text-secondary)",
            maxWidth: 680,
            marginBottom: 40,
          }}>Phossil is building a new layer: <span style={{
            fontStyle: "italic",
            fontFamily: "var(--font-display)",
            color: "var(--accent)",
          }}>Human Cognitive Infrastructure</span>. The substrate underneath your work, the reasoning, intent, and judgment every piece of it is built on, captured as it happens and owned by the person who produced it.</p>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
          }}>
            {[
              { label: "SOVEREIGNTY", text: "Your cognitive graph is yours. Capture and synthesis happen on your device. Anything that leaves does so on your terms, at the scale you choose. Local-first is the foundation, not a feature." },
              { label: "THE HUMAN API", text: "Once your reasoning is structured and consent-gated, you can grant access to it deliberately. A teammate. A tool. An AI agent that acts on what you mean instead of guessing. The graph becomes a protocol." },
            ].map((card, i) => (
              <div key={i} style={{
                flex: "1 1 320px",
                minWidth: 0,
                backgroundColor: "var(--bg-subtle)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 28,
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--accent-cyan)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}>{card.label}</div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}>{card.text}</div>
              </div>
            ))}
          </div>

          <div style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 22,
            color: "var(--text-primary)",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            textAlign: "center",
            maxWidth: 680,
            margin: "40px auto 0",
          }}>Software has always remembered what you produced. Phossil remembers how, and hands that power back to you.</div>
        </div>
      </section>

      {/* SECTION 7 — WHERE WE ARE */}
      <section style={{
        backgroundColor: "var(--bg)",
        padding: "var(--section-padding) 24px",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ ...H2, textAlign: "center", marginBottom: 28 }}>Where we are.</h2>
          <p style={{
            fontSize: 17, lineHeight: 1.65,
            color: "var(--text-secondary)",
            marginBottom: 32,
          }}>We're pre-build. The flow card demo above runs on synthetic data while we validate the concept with design partners. The architecture is what we're building toward. If your work depends on context you can't afford to lose, we want to talk.</p>
          <div style={{ textAlign: "center" }}>
            <a href="mailto:teamphossil@gmail.com" style={{
              display: "inline-block",
              padding: "14px 32px",
              borderRadius: 999,
              backgroundColor: "var(--accent)",
              color: "var(--bg)",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              marginTop: 32,
            }}>Become a design partner</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: "var(--bg)",
        borderTop: "1px solid var(--border)",
        padding: "48px 24px",
      }}>
        <div style={{
          maxWidth: "var(--max-width)", margin: "0 auto",
          display: "flex", flexWrap: "wrap", gap: 16,
          alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            color: "var(--text-primary)",
          }}>Phossil</span>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-tertiary)",
            letterSpacing: "0.1em",
          }}>Local-first by design. Your graph stays yours.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
