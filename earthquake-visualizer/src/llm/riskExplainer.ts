import type { Quake } from "../types";
import { kmBetween } from "../utils/geo";

export type RiskContext = {
  status: "green" | "yellow" | "red";
  userPos: { lat: number; lng: number } | null;
  minMag: number;
  radiusKm: number;
  window: "hour" | "day" | "week";
  quakes: Quake[];
};

export function buildRiskFacts(ctx: RiskContext) {
  const { userPos, quakes, radiusKm } = ctx;

  // nearest 3 within ~200 km (or global if no location)
  const withDist = quakes.map(q => ({
    q, d: userPos ? kmBetween(userPos, q.coords) : Number.POSITIVE_INFINITY
  }));

  const sorted = withDist.sort((a,b) => a.d - b.d);
  const nearby = (userPos ? sorted.filter(x => isFinite(x.d)) : sorted).slice(0, 3);

  return {
    nearby: nearby.map(({q,d}) => ({
      id: q.id,
      mag: q.mag,
      depthKm: q.depthKm,
      distanceKm: Math.round(isFinite(d) ? d : -1),
      ageMs: Date.now() - q.time,
      place: q.place
    })),
    strongest: [...quakes].sort((a,b) => b.mag - a.mag).slice(0,1)[0] || null,
    counts: {
      total: quakes.length,
      above45: quakes.filter(q => q.mag >= 4.5).length
    }
  };
}

export function buildPrompt(ctx: RiskContext) {
  const facts = buildRiskFacts(ctx);
  const where = ctx.userPos
    ? `near lat ${ctx.userPos.lat.toFixed(2)}, lon ${ctx.userPos.lng.toFixed(2)}`
    : `no precise user location`;

  const lines = [
    `You are an assistant summarizing earthquake activity in plain language.`,
    `Do NOT give safety instructions or dramatic language. Be concise and calm.`,
    `Context:`,
    `- Status: ${ctx.status}`,
    `- Time window: past ${ctx.window}`,
    `- Alert radius: ${ctx.radiusKm} km`,
    `- Minimum magnitude filter: ${ctx.minMag}`,
    `- User: ${where}`,
    `- Total events: ${facts.counts.total} (>=4.5: ${facts.counts.above45})`,
    `- Nearby (up to 3):` +
      facts.nearby.map(n =>
        `\n  • M${n.mag.toFixed(1)} at ${n.place}, ${n.distanceKm >= 0 ? n.distanceKm+" km away" : "distance unknown"}, depth ${n.depthKm.toFixed(0)} km, ${(n.ageMs/3600000).toFixed(1)}h ago`
      ).join(""),
    facts.strongest
      ? `- Strongest: M${facts.strongest.mag.toFixed(1)} at ${facts.strongest.place}`
      : `- Strongest: none`
  ].join("\n");

  const userAsk = `In 2–4 sentences, explain why the status is "${ctx.status}" given the radius and nearby events. Avoid advice.`;

  return { system: "You write brief factual summaries.", input: lines, user: userAsk, facts };
}

// deterministic local fallback (no API key required)
export function localFallbackSummary(ctx: RiskContext) {
  const { facts } = buildPrompt(ctx);
  const s = ctx.status;
  if (s === "green") {
    return `All clear near you. No recent earthquakes above your alert settings were detected within ${ctx.radiusKm} km in the past ${ctx.window}. ` +
           (facts.nearby[0] ? `Closest notable event: M${facts.nearby[0].mag.toFixed(1)} at ${facts.nearby[0].place}, ~${facts.nearby[0].distanceKm} km away.` : "");
  }
  if (s === "yellow") {
    return `Caution: recent activity near your area. At least one event meets your alert settings within ${ctx.radiusKm} km. ` +
           (facts.nearby[0] ? `Example: M${facts.nearby[0].mag.toFixed(1)} ~${facts.nearby[0].distanceKm} km away, ${(facts.nearby[0].ageMs/3600000).toFixed(1)}h ago.` : "");
  }
  return `High alert: strong or multiple events close by. ` +
         (facts.nearby[0] ? `Nearest: M${facts.nearby[0].mag.toFixed(1)} at ${facts.nearby[0].place}, ~${facts.nearby[0].distanceKm} km away.` : "");
}
