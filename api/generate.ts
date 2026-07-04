import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_KEY = process.env.ANTHROPIC_API_KEY;

const ALLOWED_ORIGINS = ["phossil.io", "phossil-demo.vercel.app", "localhost"];

const SYSTEM_PROMPT = `You are the Phossil card generator. Given a person's role, their tools, and their current situation (start of day, post-meeting, etc.), generate a realistic Recovery Card showing what their cognitive context recovery would look like.

You must respond with ONLY a JSON object matching this structure:

{
  "mode": "nudge" | "reconstruction" | "full_recovery",
  "timeAway": string,
  "semanticIntent": string (start with "It looks like you were..." or "You were...". Describe the REASONING or HYPOTHESIS they were pursuing, not just the task),
  "locus": {
    "primary": string (specific file, document, or tool with realistic name),
    "detail": string | null (specific location: line number, section, cursor position),
    "state": string | null (what it looked like: half-written text, unsaved changes, etc.)
  },
  "progress": [{"label": string, "status": "done"|"in-progress"|"todo", "note": string|null}] | null,
  "deltas": [{"severity": "critical"|"high"|"medium"|"low", "source": string (Person Name · Channel · time), "content": string}] | null,
  "connections": [{"label": string (1-2 word tag), "text": string}] | null,
  "nextAction": string (specific, actionable, 1-3 sentences. Start with the most urgent thing.),
  "ambient": [{"time": string, "text": string}] | null
}

Rules:

1. SEMANTIC INTENT must describe reasoning, not task labels. "You were testing whether the new pricing tier would cannibalize enterprise upgrades" not "Working on pricing doc."

2. LOCUS must be specific enough to resume work. Real filenames, real tool interfaces, cursor positions, half-written text.

3. DELTAS must feel like real messages from real coworkers. Use realistic names. Include channel and time. At least one delta should change priorities.

4. CONNECTIONS surface non-obvious relationships: deadlines, dependencies, strategic context.

5. NEXT ACTION must be specific and opinionated. Not "continue working" but "Read Maya's Slack message first, it changes the timeline. Then finish the pricing comparison in row 14."

6. Use realistic tool-specific details based on the tools provided. VS Code users see .tsx files and terminal output. Figma users see frame names and component variants. Google Docs users see document titles and comment threads.

7. For "start of day" (full_recovery): include 4-7 progress items, 3-5 deltas (at least one critical or high), 3-4 connections, 3-5 ambient items. Time away should be "~14 hours" or "overnight."

8. For "post-meeting" (reconstruction): include 3-5 progress items, 2-4 deltas, 2-3 connections, 2-3 ambient items. Time away 30-60 min.

9. For "ad hoc deep" (reconstruction): similar to post-meeting but the interruption was unplanned. Time away 15-35 min.

10. For "ad hoc shallow" (nudge): ONLY semanticIntent, locus, and nextAction. Everything else null. Time away 5-8 min. Keep it minimal.

11. Maximum 4 items in any single section (Cowan's Law ceiling).

12. Generate invented but realistic project names, coworker names, deadlines, and organizational context. Make it feel like a real Tuesday afternoon.

Respond with ONLY the JSON. No markdown, no backticks, no explanation.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Block requests not from our site
  const origin = req.headers.origin || req.headers.referer || "";
  const isAllowed = ALLOWED_ORIGINS.some(domain => origin.includes(domain));
  if (!isAllowed) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { role, tools, situation } = req.body;

  const modeMap: Record<string, string> = {
    "monday-morning": "full_recovery",
    "post-meeting": "reconstruction",
    "deep-interruption": "reconstruction",
    "quick-ping": "nudge",
  };

  const mode = modeMap[situation] || "full_recovery";
  const toolList = tools && tools.length > 0 ? tools.join(", ") : "standard office tools";

  const userPrompt = `Generate a Recovery Card for:

ROLE: ${role}
TOOLS THEY USE: ${toolList}
SITUATION: ${situation.replace(/-/g, " ")}
CARD MODE: ${mode}

Respond with ONLY the JSON object.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 8192,
        thinking: { type: "adaptive" },
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const textBlock = data.content.find((b: { type: string }) => b.type === "text");
    const text = textBlock?.text ?? "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const card = JSON.parse(cleaned);

    return res.status(200).json(card);
  } catch (err) {
    console.error("Generate error:", err);
    return res.status(500).json({ error: "Failed to generate card" });
  }
}
