import type { VercelRequest, VercelResponse } from "@vercel/node";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = "836c57e5-9633-43b7-875c-71d7217f084f";

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

  if (!NOTION_API_KEY) {
    console.error("NOTION_API_KEY not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const {
    role, company, tools, situation,
    cardMode, semanticIntent,
    cardAccuracy, contextualSelections, contextualText,
    interruptionFrequency, orientationTime, privacyComfort,
    email, intention,
  } = req.body;

  const accuracyMap: Record<string, string> = {
    "exactly": "Spot on",
    "close": "Pretty close",
    "not-really": "Not really",
  };

  const frequencyMap: Record<string, string> = {
    "1-2": "1-2/day",
    "3-5": "3-5/day",
    "6-10": "6-10/day",
    "10-plus": "10+/day",
  };

  const timeMap: Record<string, string> = {
    "under-5": "Under 5 min",
    "5-15": "5-15 min",
    "15-30": "15-30 min",
    "30-60": "30-60 min",
    "60-plus": "60+ min",
  };

  const privacyMap: Record<string, string> = {
    "yes": "Yes absolutely",
    "maybe": "Maybe with controls",
    "no": "No",
  };

  const situationMap: Record<string, string> = {
    "monday-morning": "Monday morning",
    "post-meeting": "Post-meeting",
    "deep-interruption": "Deep interruption",
    "quick-ping": "Quick ping",
  };

  const intentionMap: Record<string, string> = {
    "design-partner": "Design Partner",
    "feedback-only": "Feedback Only",
    "advisor": "Advisor",
    "builder": "Builder",
    "fan": "Fan",
  };

  // Determine signal strength
  const intentionList = intention || [];
  const hasHighIntent = intentionList.includes("design-partner") || intentionList.includes("builder");
  const hasModerateIntent = intentionList.includes("advisor") || intentionList.includes("fan");

  let signalStrength = "None";
  if (hasHighIntent) {
    signalStrength = "Strong";
  } else if (cardAccuracy === "exactly" && (interruptionFrequency === "6-10" || interruptionFrequency === "10-plus")) {
    signalStrength = "Strong";
  } else if (cardAccuracy === "exactly") {
    signalStrength = "Moderate";
  } else if (hasModerateIntent && cardAccuracy !== "not-really") {
    signalStrength = "Moderate";
  } else if (cardAccuracy === "close") {
    signalStrength = "Moderate";
  } else if (cardAccuracy === "not-really") {
    signalStrength = "Weak";
  }

  // Build Notion properties
  const properties: Record<string, unknown> = {
    "Response": {
      title: [{ text: { content: `${role || "Unknown"} - ${new Date().toISOString().split("T")[0]}` } }]
    },
    "Role": {
      rich_text: [{ text: { content: role || "" } }]
    },
    "Company": {
      rich_text: [{ text: { content: company || "" } }]
    },
    "Tools": {
      rich_text: [{ text: { content: (tools || []).join(", ") } }]
    },
    "Signal Strength": {
      select: { name: signalStrength }
    },
    "Submitted": {
    date: { start: new Date().toISOString().split("T")[0] }
    }
  };

  // What Resonated: the chips they tapped
  if (contextualSelections && contextualSelections.length > 0) {
    properties["What Resonated"] = {
      rich_text: [{ text: { content: contextualSelections.join(", ") } }]
    };
  }

  // Comment: their typed feedback
  if (contextualText) {
    properties["Comment"] = {
      rich_text: [{ text: { content: contextualText.substring(0, 2000) } }]
    };
  }

  // Free Text: card context (what we showed them, for our reference)
  const freeTextParts: string[] = [];
  if (semanticIntent) freeTextParts.push(`Card: "${semanticIntent}"`);
  if (cardMode) freeTextParts.push(`Mode: ${cardMode}`);
  if (freeTextParts.length > 0) {
    properties["Free Text"] = {
      rich_text: [{ text: { content: freeTextParts.join(" | ") } }]
    };
  }

  if (situation && situationMap[situation]) {
    properties["Situation"] = { select: { name: situationMap[situation] } };
  }
  if (cardAccuracy && accuracyMap[cardAccuracy]) {
    properties["Card Accuracy"] = { select: { name: accuracyMap[cardAccuracy] } };
  }
  if (interruptionFrequency && frequencyMap[interruptionFrequency]) {
    properties["Interruption Frequency"] = { select: { name: frequencyMap[interruptionFrequency] } };
  }
  if (orientationTime && timeMap[orientationTime]) {
    properties["Orientation Time"] = { select: { name: timeMap[orientationTime] } };
  }
  if (privacyComfort && privacyMap[privacyComfort]) {
    properties["Privacy Comfort"] = { select: { name: privacyMap[privacyComfort] } };
  }
  if (email) {
    properties["Email"] = { email: email };
  }

  // Intention: multi-select
  if (intentionList.length > 0) {
    const mapped = intentionList
      .map((i: string) => intentionMap[i])
      .filter(Boolean)
      .map((name: string) => ({ name }));
    if (mapped.length > 0) {
      properties["Intention"] = { multi_select: mapped };
    }
  }

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Notion API error:", JSON.stringify(error));
      return res.status(500).json({ error: "Failed to save feedback", details: error });
    }

    const result = await response.json();
    return res.status(200).json({ success: true, id: result.id });
  } catch (err) {
    console.error("Feedback error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
