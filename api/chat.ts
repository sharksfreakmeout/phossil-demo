import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_KEY = process.env.ANTHROPIC_API_KEY;

const ALLOWED_ORIGINS = ["phossil.io", "phossil-demo.vercel.app", "localhost"];

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

  const { question, cardContext } = req.body;

  if (!question || !cardContext) {
    return res.status(400).json({ error: "Missing question or card context" });
  }

  const systemPrompt = `You are Phossil's conversational interface. The user is looking at a recovery card that reconstructed their work context. They're asking a question about their work.

Here is the recovery card data:
${JSON.stringify(cardContext, null, 2)}

Rules:
1. Answer in 2-3 sentences max. Be direct and specific.
2. Reference specific details from the card (names, files, deadlines, messages).
3. If the question asks about something not in the card data, explain what the full product would do. For example, questions about other projects: "In the full product, Phossil tracks all your active projects. You'd see a deck of cards, one per project, ranked by what needs attention most."
4. Write as if you're a knowledgeable colleague, not a chatbot. No "I'd be happy to help" preamble. No "Would you like me to..." endings. You inform and orient, you don't offer to take actions.
5. Use the card data to give genuinely useful answers, not just repeat what's already visible. Keep it to 2-3 sentences max.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.content[0].text;
    return res.status(200).json({ answer: text });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Failed to process question" });
  }
}
