import { type RiskContext, buildPrompt, localFallbackSummary } from "../llm/riskExplainer";

// Set VITE_LLM_ENDPOINT to your server route (e.g., Firebase Function URL)
// Example of a request body that your backend should accept:
// { model: "gpt-4o-mini", messages: [{role:"system", content:...}, {role:"user", content:...}] }
const endpoint = import.meta.env.VITE_LLM_ENDPOINT;

export async function explainStatus(ctx: RiskContext): Promise<string> {
  if (!endpoint) {
    // No backend configured — use local deterministic summary
    return localFallbackSummary(ctx);
  }

  const { system, input, user } = buildPrompt(ctx);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: input + "\n\n" + user }
        ],
        temperature: 0.2,
        max_tokens: 180
      })
    });
    if (!res.ok) throw new Error(`LLM endpoint error: ${res.status}`);
    const data = await res.json();
    // normalize { content } from your backend; adjust if your backend returns a different shape
    return data.content || data.message || localFallbackSummary(ctx);
  } catch (e) {
    console.warn(e);
    return localFallbackSummary(ctx);
  }
}
