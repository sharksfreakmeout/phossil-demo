import { useState, useRef, useEffect } from "react";
import type { RecoveryCard as CardType, Delta } from "../types";

/* ── Utility Components ── */

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; text: string }> = {
    done: { bg: "rgba(29,158,117,0.12)", color: "#5DCAA5", text: "Done" },
    todo: { bg: "rgba(255,255,255,0.05)", color: "#6B7280", text: "To do" },
    "in-progress": { bg: "rgba(249,115,22,0.1)", color: "#FB923C", text: "In progress" },
  };
  const s = styles[status] || styles.todo;
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, color: s.color, backgroundColor: s.bg,
      padding: "2px 7px", borderRadius: 4, fontFamily: "var(--font-mono)", whiteSpace: "nowrap",
    }}>{s.text}</span>
  );
}

function SeverityDot({ severity }: { severity: Delta["severity"] }) {
  const colors = { critical: "#EF4444", high: "#F97316", medium: "#EAB308", low: "#6B7280" };
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      backgroundColor: colors[severity], marginRight: 8, flexShrink: 0, marginTop: 6,
    }} />
  );
}

function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, left: Math.min(rect.left, window.innerWidth - 280) });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  return (
    <>
      <button ref={btnRef} onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 16, height: 16, borderRadius: "50%", border: "none", cursor: "pointer",
          backgroundColor: "rgba(29,158,117,0.2)", color: "#5DCAA5",
          fontSize: 9, fontWeight: 700, flexShrink: 0, marginLeft: 4, padding: 0,
        }}>?</button>
      {open && pos && (
        <div style={{
          position: "fixed", top: pos.top, left: pos.left, width: 260,
          backgroundColor: "#252830", border: "1px solid rgba(29,158,117,0.2)",
          borderRadius: 8, padding: "10px 12px", fontSize: 12, lineHeight: 1.55,
          color: "#9CA0A8", zIndex: 9999,
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        }}>{text}</div>
      )}
    </>
  );
}

/* ── Awareness Row (collapsed section) ── */

function AwarenessRow({ title, badge, badgeColor, badgeBg, children, tip }: {
  title: string; badge?: string; badgeColor?: string; badgeBg?: string;
  children: React.ReactNode; tip?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 14px", background: "rgba(255,255,255,0.02)",
        borderRadius: open ? "8px 8px 0 0" : 8,
        border: "1px solid rgba(255,255,255,0.05)",
        borderBottom: open ? "none" : "1px solid rgba(255,255,255,0.05)",
        cursor: "pointer", transition: "all 0.15s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 10, color: "rgba(255,255,255,0.4)",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease", display: "inline-block",
          }}>&#9654;</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{title}</span>
          {tip && <InfoTip text={tip} />}
        </div>
        {badge && (
          <span style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600,
            backgroundColor: badgeBg || "rgba(255,255,255,0.06)",
            color: badgeColor || "rgba(255,255,255,0.5)",
          }}>{badge}</span>
        )}
      </button>
      {open && (
        <div style={{
          padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)", borderTop: "none",
          borderRadius: "0 0 8px 8px", background: "rgba(255,255,255,0.015)",
        }}>{children}</div>
      )}
    </div>
  );
}

/* ── Types ── */

export interface FeedbackData {
  cardMode: string;
  semanticIntent: string;
  cardAccuracy: string | null;
  contextualSelections: string[];
  contextualText: string;
  interruptionFrequency: string | null;
  orientationTime: string | null;
  privacyComfort: string | null;
}

interface RecoveryCardProps {
  data: CardType;
  showAnnotations?: boolean;
  showFeedback?: boolean;
  onFeedbackSubmit?: (data: FeedbackData) => void;
}

/* ── Main Component ── */

export default function RecoveryCard({ data, showAnnotations = false, showFeedback = false, onFeedbackSubmit }: RecoveryCardProps) {
  const urgentCount = (data.deltas || []).filter(d => d.severity === "critical" || d.severity === "high").length;
  const progressDone = (data.progress || []).filter(p => p.status === "done").length;
  const progressTotal = (data.progress || []).length;

  // Feedback state
  const [feedbackStep, setFeedbackStep] = useState<"initial" | "contextual" | "demographics" | "done">("initial");
  const [cardAccuracy, setCardAccuracy] = useState<string | null>(null);
  const [contextualSelections, setContextualSelections] = useState<string[]>([]);
  const [contextualText, setContextualText] = useState("");
  const [interruptionFrequency, setInterruptionFrequency] = useState<string | null>(null);
  const [orientationTime, setOrientationTime] = useState<string | null>(null);
  const [privacyComfort, setPrivacyComfort] = useState<string | null>(null);

  // Conversational interface state
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // CTA state
  const [ctaClicked, setCtaClicked] = useState(false);

  function handleInitialReaction(accuracy: string) {
    setCardAccuracy(accuracy);
    setFeedbackStep("contextual");
  }
  function toggleContextual(id: string) {
    setContextualSelections(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  }
  function handleSubmit() {
    if (onFeedbackSubmit) {
      onFeedbackSubmit({ cardMode: data.mode, semanticIntent: data.semanticIntent, cardAccuracy, contextualSelections, contextualText, interruptionFrequency, orientationTime, privacyComfort });
    }
    setFeedbackStep("done");
  }

  async function handleChatSubmit() {
    if (!chatInput.trim() || chatLoading) return;
    const question = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", content: question }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, cardContext: data }),
      });
      const r = await resp.json();
      const answer = r.answer || r.error || "Something went wrong.";

      setChatMessages(prev => [...prev, { role: "assistant", content: answer }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Couldn't process that question. Try again." }]);
    }
    setChatLoading(false);
  }

  const tips = showAnnotations ? {
    intent: "Phossil doesn't just say 'you had a doc open.' It figures out what you were actually thinking and what problem you were solving.",
    locus: "The exact spot where you left off. The file, the line, even what you'd half-typed. So you don't spend 10 minutes hunting.",
    progress: "Phossil watches your file saves, commits, and tool activity to figure out what's done and what's not. You never update this yourself.",
    deltas: "While you were gone, things changed. These are the messages and updates that matter to what you're working on, ranked by urgency.",
    context: "The stuff you'd forget: who's involved, when things are due, and how your current work connects to bigger goals.",
    nextStep: "Instead of staring at your screen wondering where to start, Phossil tells you the single most important thing to do first.",
    ambient: "Relevant meetings and deadlines coming up soon. Not your whole calendar. Just the ones that affect your current work.",
  } : { intent: undefined, locus: undefined, progress: undefined, deltas: undefined, context: undefined, nextStep: undefined, ambient: undefined };

  // Generate suggested prompts from card data
  const suggestedPrompts: { text: string; answer: string }[] = [];
  if (data.deltas && data.deltas.length > 0) {
    const topDelta = data.deltas.find(d => d.severity === "critical" || d.severity === "high") || data.deltas[0];
    const sourceName = topDelta.source.split("·")[0].trim();
    suggestedPrompts.push({ text: `What did ${sourceName} say?`, answer: `${topDelta.source}: "${topDelta.content}"` });
  }
  if (data.connections && data.connections.length > 0) {
    suggestedPrompts.push({ text: `Why does this matter right now?`, answer: data.connections.map(c => `${c.label}: ${c.text}`).join(" | ") });
  }
  if (data.progress && data.progress.length > 0) {
    const inProgress = data.progress.filter(p => p.status === "in-progress");
    if (inProgress.length > 0) {
      suggestedPrompts.push({ text: `What was I stuck on?`, answer: inProgress.map(p => `${p.label}${p.note ? ` — ${p.note}` : ""}`).join(". ") });
    }
  }

  // Derive concrete CTA from locus
  const primaryCTA = data.locus.primary.length > 40 ? `Open ${data.locus.primary.substring(0, 37)}...` : `Open ${data.locus.primary}`;

  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      {/* Card Shell */}
      <div style={{
        backgroundColor: "#0d0f14", borderRadius: 16,
        border: "1px solid rgba(29,158,117,0.15)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 0 80px rgba(29,158,117,0.04)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: "linear-gradient(135deg, #1D9E75, #0F6E56)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color: "#fff", fontWeight: 700,
            }}>P</div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Phossil</span>
            {showAnnotations && <InfoTip text="Phossil detects how long you've been away and adjusts the card depth. Short break? Minimal nudge. Long absence? Full reconstruction." />}
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-mono)" }}>away {data.timeAway}</span>
        </div>

        {/* ── FLOW ZONE: Always visible ── */}
        <div style={{ padding: "20px 20px 0" }}>

          {/* Semantic Intent */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 4, marginBottom: 20 }}>
            <p style={{
              fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.9)",
              fontWeight: 400, margin: 0, flex: 1,
            }}>{data.semanticIntent}</p>
            {tips.intent && <InfoTip text={tips.intent} />}
          </div>

          {/* Locus */}
          <div style={{
            background: "rgba(29,158,117,0.06)", border: "1px solid rgba(29,158,117,0.12)",
            borderRadius: 10, padding: "14px 16px", marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#1D9E75" strokeWidth="1.5" fill="none"/><path d="M7 4v3l2 1" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "#5DCAA5" }}>Pick up here</span>
              {tips.locus && <InfoTip text={tips.locus} />}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>{data.locus.primary}</div>
            {data.locus.detail && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{data.locus.detail}</div>}
            {data.locus.state && <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 12, color: "#5DCAA5", fontStyle: "italic" }}>{data.locus.state}</div>}
          </div>

          {/* Next Action */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "#5DCAA5" }}>Next step</span>
              {tips.nextStep && <InfoTip text={tips.nextStep} />}
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.55, margin: 0 }}>{data.nextAction}</p>
          </div>
        </div>

        {/* ── AWARENESS ZONE: Collapsed rows with badges ── */}
        {data.mode !== "nudge" && (
          <div style={{ padding: "0 20px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            {data.progress && data.progress.length > 0 && (
              <AwarenessRow title="Progress" tip={tips.progress}
                badge={`${progressDone}/${progressTotal} done`}
                badgeColor={progressDone === progressTotal ? "#5DCAA5" : "#FB923C"}
                badgeBg={progressDone === progressTotal ? "rgba(29,158,117,0.12)" : "rgba(249,115,22,0.1)"}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {data.progress.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <span style={{
                        fontSize: 13, color: item.status === "done" ? "#6B7280" : "rgba(255,255,255,0.75)",
                        textDecoration: item.status === "done" ? "line-through" : "none", flex: 1,
                      }}>{item.label}{item.note && <span style={{ fontSize: 11, color: "#737780", fontFamily: "var(--font-mono)" }}> — {item.note}</span>}</span>
                      <StatusPill status={item.status} />
                    </div>
                  ))}
                </div>
              </AwarenessRow>
            )}

            {data.deltas && data.deltas.length > 0 && (
              <AwarenessRow title="While you were away" tip={tips.deltas}
                badge={urgentCount > 0 ? `${urgentCount} urgent` : `${data.deltas.length} updates`}
                badgeColor={urgentCount > 0 ? "#F09595" : "rgba(255,255,255,0.5)"}
                badgeBg={urgentCount > 0 ? "rgba(225,79,67,0.12)" : "rgba(255,255,255,0.06)"}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {data.deltas.map((delta, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
                      <SeverityDot severity={delta.severity} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: "#737780", fontFamily: "var(--font-mono)", marginBottom: 2 }}>{delta.source}</div>
                        <div style={{ fontSize: 13, lineHeight: 1.5, color: (delta.severity === "critical" || delta.severity === "high") ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)" }}>{delta.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </AwarenessRow>
            )}

            {data.connections && data.connections.length > 0 && (
              <AwarenessRow title="Context" tip={tips.context}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {data.connections.map((conn, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: "#5DCAA5", backgroundColor: "rgba(29,158,117,0.1)",
                        padding: "2px 6px", borderRadius: 3, fontFamily: "var(--font-mono)", whiteSpace: "nowrap", marginTop: 2,
                      }}>{conn.label}</span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.45 }}>{conn.text}</span>
                    </div>
                  ))}
                </div>
              </AwarenessRow>
            )}

            {data.ambient && data.ambient.length > 0 && (
              <AwarenessRow title="Coming up" tip={tips.ambient}
                badge={`${data.ambient.length} events`}
                badgeColor="rgba(255,255,255,0.4)"
                badgeBg="rgba(255,255,255,0.05)"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {data.ambient.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12 }}>
                      <span style={{ color: "#737780", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", minWidth: 72 }}>{item.time}</span>
                      <span style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.45 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </AwarenessRow>
            )}
          </div>
        )}

        {/* ── CONCRETE CTAs ── */}
        <div style={{ padding: "8px 20px 4px", display: "flex", gap: 8 }}>
          <button onClick={() => setCtaClicked(true)} style={{
            flex: 1, padding: "11px 16px", borderRadius: 10, border: "none",
            background: ctaClicked ? "rgba(29,158,117,0.15)" : "#1D9E75",
            color: ctaClicked ? "#5DCAA5" : "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={(e) => { if (!ctaClicked) e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >{ctaClicked ? "✓ " + primaryCTA : primaryCTA}</button>
          <button style={{
            padding: "11px 16px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)", background: "transparent",
            color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)",
          }}>Dismiss</button>
        </div>
        {ctaClicked && (
          <div style={{ padding: "8px 20px 12px" }}>
            <div style={{
              padding: "10px 14px", borderRadius: 8,
              background: "rgba(29,158,117,0.06)", border: "1px solid rgba(29,158,117,0.1)",
            }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.55 }}>
                In the real product, this opens <strong style={{ color: "#5DCAA5" }}>{data.locus.primary}</strong> at the exact position where you left off
                {data.locus.detail ? ` (${data.locus.detail})` : ""}
                {data.locus.state ? `. Your unsaved work is still there.` : "."} One click from card to deep work.
              </p>
            </div>
          </div>
        )}

        {/* ── CONVERSATIONAL INTERFACE ── */}
        <div style={{
          padding: "12px 20px 16px", borderTop: "1px solid rgba(255,255,255,0.04)",
        }}>
          {/* Suggested prompts */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {suggestedPrompts.slice(0, 3).map((prompt, i) => (
              <button key={i} onClick={() => { setExpandedPrompt(expandedPrompt === i ? null : i); }}
                style={{
                  padding: "6px 12px", borderRadius: 20, cursor: "pointer",
                  border: "1px solid",
                  borderColor: expandedPrompt === i ? "rgba(29,158,117,0.3)" : "rgba(255,255,255,0.08)",
                  background: expandedPrompt === i ? "rgba(29,158,117,0.08)" : "rgba(255,255,255,0.02)",
                  color: expandedPrompt === i ? "#5DCAA5" : "rgba(255,255,255,0.45)",
                  fontSize: 12, fontFamily: "var(--font-body)",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => { if (expandedPrompt !== i) { e.currentTarget.style.borderColor = "rgba(29,158,117,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; } }}
                onMouseLeave={(e) => { if (expandedPrompt !== i) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; } }}
              >{prompt.text}</button>
            ))}
          </div>

          {/* Expanded prompt answer */}
          {expandedPrompt !== null && suggestedPrompts[expandedPrompt] && (
            <div style={{
              padding: "10px 14px", marginBottom: 10, borderRadius: 8,
              background: "rgba(29,158,117,0.05)", border: "1px solid rgba(29,158,117,0.1)",
            }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.55 }}>
                {suggestedPrompts[expandedPrompt].answer}
              </p>
            </div>
          )}

          {/* Chat messages */}
          {chatMessages.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  padding: "8px 12px", borderRadius: 8,
                  background: msg.role === "user" ? "rgba(255,255,255,0.04)" : "rgba(29,158,117,0.06)",
                  border: msg.role === "user" ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(29,158,117,0.1)",
                }}>
                  <p style={{
                    fontSize: 12, margin: 0, lineHeight: 1.55,
                    color: msg.role === "user" ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.75)",
                  }}>{msg.content}</p>
                </div>
              ))}
              {chatLoading && (
                <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(29,158,117,0.04)" }}>
                  <p style={{ fontSize: 12, color: "#5DCAA5", margin: 0, fontStyle: "italic" }}>Thinking...</p>
                </div>
              )}
            </div>
          )}

          {/* Text input */}
          <input type="text" placeholder="Ask about your work context..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleChatSubmit(); }}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)",
              color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "var(--font-body)",
              outline: "none", boxSizing: "border-box",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(29,158,117,0.3)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          />
        </div>

        {/* ── FEEDBACK ── */}
        {showFeedback && (
          <div style={{
            borderTop: "2px solid rgba(250,204,21,0.3)",
            background: "linear-gradient(180deg, rgba(250,204,21,0.08) 0%, rgba(250,204,21,0.03) 100%)",
            padding: "20px 20px",
            borderRadius: "0 0 16px 16px",
          }}>
            {/* Step 1: Initial reaction */}
            {feedbackStep === "initial" && (
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 4, textAlign: "center" }}>Quick feedback</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14, textAlign: "center" }}>Your answers directly shape what we build.</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.65)", marginBottom: 10, textAlign: "center" }}>Did this feel like your actual workday?</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  {[
                    { id: "exactly", label: "Spot on", emoji: "🎯" },
                    { id: "close", label: "Pretty close", emoji: "👍" },
                    { id: "not-really", label: "Not really", emoji: "🤔" },
                  ].map((option) => (
                    <button key={option.id} onClick={() => handleInitialReaction(option.id)}
                      style={{
                        padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                        border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)",
                        color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 500,
                        transition: "all 0.15s ease", display: "flex", alignItems: "center", gap: 6,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(29,158,117,0.3)"; e.currentTarget.style.backgroundColor = "rgba(29,158,117,0.08)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}
                    ><span>{option.emoji}</span><span>{option.label}</span></button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Contextual follow-up */}
            {feedbackStep === "contextual" && (
              <div>
                <div style={{
                  display: "inline-block", padding: "4px 10px", borderRadius: 4, marginBottom: 16,
                  backgroundColor: cardAccuracy === "exactly" ? "rgba(29,158,117,0.1)" : cardAccuracy === "close" ? "rgba(29,158,117,0.06)" : "rgba(255,255,255,0.04)",
                  color: cardAccuracy === "exactly" ? "#5DCAA5" : cardAccuracy === "close" ? "#5DCAA5" : "rgba(255,255,255,0.5)",
                  fontSize: 12, fontWeight: 500,
                }}>
                  {cardAccuracy === "exactly" ? "🎯 Spot on" : cardAccuracy === "close" ? "👍 Pretty close" : "🤔 Not really"}
                </div>

                {/* Spot on */}
                {cardAccuracy === "exactly" && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                      What resonated most? <span style={{ fontWeight: 400, fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>(pick all that apply)</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                      {[
                        { id: "captured-thinking", label: "It captured what I was actually thinking" },
                        { id: "specific-location", label: "The specific file and location" },
                        { id: "messages", label: "The messages that came in while I was away" },
                        { id: "next-action", label: "Knowing exactly what to do next" },
                        { id: "connections", label: "Connections I would have forgotten" },
                        { id: "overall-feeling", label: "The overall feeling of being understood" },
                      ].map((o) => { const s = contextualSelections.includes(o.id); return (
                        <button key={o.id} onClick={() => toggleContextual(o.id)} style={{ padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: "1px solid", borderColor: s ? "rgba(29,158,117,0.4)" : "rgba(255,255,255,0.08)", backgroundColor: s ? "rgba(29,158,117,0.1)" : "rgba(255,255,255,0.02)", color: s ? "#5DCAA5" : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 500, transition: "all 0.15s ease", textAlign: "left" }}>{o.label}</button>
                      ); })}
                    </div>
                    <textarea value={contextualText} onChange={(e) => setContextualText(e.target.value)} placeholder="What would make this even more useful? (optional)"
                      style={{ width: "100%", minHeight: 48, padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "var(--font-body)", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: 12 }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(29,158,117,0.3)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                    />
                  </div>
                )}

                {/* Pretty close */}
                {cardAccuracy === "close" && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                      What felt off? <span style={{ fontWeight: 400, fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>(pick all that apply)</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                      {[
                        { id: "wrong-tools", label: "Wrong tools or apps" },
                        { id: "project-details", label: "The project details" },
                        { id: "people-dynamics", label: "The people or team dynamics" },
                        { id: "stuck-point", label: "The stuck point didn't match" },
                        { id: "missing-something", label: "Missing something important" },
                        { id: "too-much", label: "Too much information" },
                        { id: "not-enough", label: "Not enough detail" },
                      ].map((o) => { const s = contextualSelections.includes(o.id); return (
                        <button key={o.id} onClick={() => toggleContextual(o.id)} style={{ padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: "1px solid", borderColor: s ? "rgba(29,158,117,0.4)" : "rgba(255,255,255,0.08)", backgroundColor: s ? "rgba(29,158,117,0.1)" : "rgba(255,255,255,0.02)", color: s ? "#5DCAA5" : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 500, transition: "all 0.15s ease", textAlign: "left" }}>{o.label}</button>
                      ); })}
                    </div>
                    <textarea value={contextualText} onChange={(e) => setContextualText(e.target.value)} placeholder="What would make it closer to your real day? (optional)"
                      style={{ width: "100%", minHeight: 48, padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "var(--font-body)", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: 12 }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(29,158,117,0.3)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                    />
                  </div>
                )}

                {/* Not really */}
                {cardAccuracy === "not-really" && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                      What felt wrong? <span style={{ fontWeight: 400, fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>(pick all that apply)</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                      {[
                        { id: "wrong-day", label: "My day doesn't look like this at all" },
                        { id: "too-generic", label: "Too generic, could be anyone" },
                        { id: "too-fabricated", label: "Feels made up, too specific about things it can't know" },
                        { id: "wrong-complexity", label: "My work is simpler or more complex than this" },
                        { id: "wrong-tools", label: "Wrong tools or environment" },
                        { id: "wrong-interruptions", label: "That's not how interruptions work for me" },
                        { id: "not-useful", label: "Even if accurate, this wouldn't help me" },
                      ].map((o) => { const s = contextualSelections.includes(o.id); return (
                        <button key={o.id} onClick={() => toggleContextual(o.id)} style={{ padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: "1px solid", borderColor: s ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)", backgroundColor: s ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)", color: s ? "#F09595" : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 500, transition: "all 0.15s ease", textAlign: "left" }}>{o.label}</button>
                      ); })}
                    </div>
                    {contextualSelections.length > 0 && (
                      <textarea value={contextualText} onChange={(e) => setContextualText(e.target.value)}
                        placeholder={
                          contextualSelections.includes("wrong-day") ? "What does your typical workday actually look like? (a sentence or two is fine)" :
                          contextualSelections.includes("too-generic") ? "What specific details would make it feel like YOUR day?" :
                          contextualSelections.includes("too-fabricated") ? "What crossed the line from helpful to fake?" :
                          contextualSelections.includes("not-useful") ? "What would actually help you get back on track?" :
                          "Any additional context? (optional)"
                        }
                        style={{ width: "100%", minHeight: 48, padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "var(--font-body)", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: 12 }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(29,158,117,0.3)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                      />
                    )}
                  </div>
                )}

                <button onClick={() => setFeedbackStep("demographics")}
                  style={{ width: "100%", padding: "10px 16px", borderRadius: 8, border: "none", cursor: "pointer", backgroundColor: "rgba(250,204,21,0.15)", color: "#FACC15", fontSize: 13, fontWeight: 600, transition: "all 0.15s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(250,204,21,0.25)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(250,204,21,0.15)"; }}
                >Next</button>
              </div>
            )}

            {/* Step 3: Demographics */}
            {feedbackStep === "demographics" && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.65)", marginBottom: 16, textAlign: "center" }}>Almost done. Three quick questions about your work.</p>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>How many times per day do you lose your thread?</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {[{ id: "1-2", label: "1-2 times" }, { id: "3-5", label: "3-5 times" }, { id: "6-10", label: "6-10 times" }, { id: "10-plus", label: "10+ times" }].map((o) => (
                      <button key={o.id} onClick={() => setInterruptionFrequency(o.id)} style={{ padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: "1px solid", borderColor: interruptionFrequency === o.id ? "rgba(29,158,117,0.4)" : "rgba(255,255,255,0.08)", backgroundColor: interruptionFrequency === o.id ? "rgba(29,158,117,0.1)" : "rgba(255,255,255,0.02)", color: interruptionFrequency === o.id ? "#5DCAA5" : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 500, transition: "all 0.15s ease" }}>{o.label}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>How long do you usually spend getting re-oriented?</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {[{ id: "under-5", label: "< 5 min" }, { id: "5-15", label: "5-15 min" }, { id: "15-30", label: "15-30 min" }, { id: "30-60", label: "30-60 min" }, { id: "60-plus", label: "60+ min" }].map((o) => (
                      <button key={o.id} onClick={() => setOrientationTime(o.id)} style={{ padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: "1px solid", borderColor: orientationTime === o.id ? "rgba(29,158,117,0.4)" : "rgba(255,255,255,0.08)", backgroundColor: orientationTime === o.id ? "rgba(29,158,117,0.1)" : "rgba(255,255,255,0.02)", color: orientationTime === o.id ? "#5DCAA5" : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 500, transition: "all 0.15s ease" }}>{o.label}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Would you let a tool quietly observe your work to make this automatic?</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {[{ id: "yes", label: "Yes, absolutely" }, { id: "maybe", label: "Maybe, with controls" }, { id: "no", label: "No" }].map((o) => (
                      <button key={o.id} onClick={() => setPrivacyComfort(o.id)} style={{ padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: "1px solid", borderColor: privacyComfort === o.id ? "rgba(29,158,117,0.4)" : "rgba(255,255,255,0.08)", backgroundColor: privacyComfort === o.id ? "rgba(29,158,117,0.1)" : "rgba(255,255,255,0.02)", color: privacyComfort === o.id ? "#5DCAA5" : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 500, transition: "all 0.15s ease" }}>{o.label}</button>
                    ))}
                  </div>
                </div>

                <button onClick={handleSubmit}
                  style={{ width: "100%", padding: "10px 16px", borderRadius: 8, border: "none", cursor: "pointer", backgroundColor: "rgba(250,204,21,0.15)", color: "#FACC15", fontSize: 13, fontWeight: 600, transition: "all 0.15s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(250,204,21,0.25)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(250,204,21,0.15)"; }}
                >Submit feedback</button>
              </div>
            )}

            {/* Done */}
            {feedbackStep === "done" && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#FACC15", fontWeight: 500, margin: 0 }}>Thanks. Your feedback shapes what we build next.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
