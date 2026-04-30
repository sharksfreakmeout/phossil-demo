import type { RecoveryCard } from "./types";

export async function generateCard(
  role: string,
  tools: string[],
  situation: string
): Promise<RecoveryCard> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role, tools, situation }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `Server error: ${response.status}`);
  }

  return response.json();
}