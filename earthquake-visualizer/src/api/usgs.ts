import type { Quake, TimeWindow } from "../types";

const endpoints: Record<TimeWindow, string> = {
  hour: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
  day:  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
  week: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
};

export async function fetchQuakes(window: TimeWindow): Promise<Quake[]> {
  const res = await fetch(endpoints[window], { cache: "no-store" });
  if (!res.ok) throw new Error(`USGS ${window} fetch failed`);
  const data = await res.json();
  return data.features.map((f: any) => ({
    id: f.id,
    mag: f.properties.mag ?? 0,
    time: f.properties.time,
    depthKm: f.geometry?.coordinates?.[2] ?? 0,
    coords: { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] },
    place: f.properties.place ?? "Unknown",
    url: f.properties.url ?? "",
  })) as Quake[];
}
