import type { Quake } from "../types";
import { kmBetween } from "./geo";

export type Status = "green" | "yellow" | "red";

export function classifyStatus(
  user: {lat:number; lng:number} | null,
  quakes: Quake[],
  opts = { radiusKm: 25, warnMaxKm: 50, alertMag: 4.5 }
): Status {
  if (!user || quakes.length === 0) return "green";
  let hasStrongNearby = false;
  let hasNearby = false;

  for (const q of quakes) {
    const d = kmBetween(user, q.coords);
    if (q.mag >= 6 && d <= opts.radiusKm) return "red";
    if (q.mag >= 5 && d <= opts.warnMaxKm) hasStrongNearby = true;
    if (q.mag >= opts.alertMag && d <= opts.radiusKm) hasNearby = true;
  }
  if (hasStrongNearby || hasNearby) return "yellow";
  return "green";
}
