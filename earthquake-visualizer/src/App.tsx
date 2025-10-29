import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

// Basic quake type
type Quake = {
  id: string;
  mag: number;
  time: number;
  place: string;
  coords: { lat: number; lng: number };
};

export default function App() {
  const [center, setCenter] = useState<LatLngExpression>([20, 0]); // world
  const [quakes, setQuakes] = useState<Quake[]>([]);
  const [loading, setLoading] = useState(true);

  // Geolocate on load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
        () => {} // ignore error; keep default world view
      );
    }
  }, []);

  // Fetch USGS all-day feed
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      );
      const data = await res.json();
      const normalized: Quake[] = data.features.map((f: any) => ({
        id: f.id,
        mag: f.properties.mag ?? 0,
        time: f.properties.time,
        place: f.properties.place ?? "Unknown",
        coords: { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] },
      }));
      setQuakes(normalized);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <header className="border-b p-3 flex items-center justify-between">
        <h1 className="font-semibold">Earthquake Visualizer (MVP)</h1>
        <span className="text-sm text-gray-500">
          {loading ? "Loading..." : `${quakes.length} events (past 24h)`}
        </span>
      </header>

      <div className="flex-1">
        <MapContainer center={center} zoom={3} className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {quakes.map((q) => {
            const color =
              q.mag >= 5 ? "#ef4444" : q.mag >= 3 ? "#f59e0b" : "#22c55e";
            const radius = Math.max(4, q.mag * 2);
            return (
              <CircleMarker
                key={q.id}
                center={[q.coords.lat, q.coords.lng]}
                radius={radius}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}
              >
                <Tooltip>
                  <div className="text-sm">
                    <div><b>M {q.mag.toFixed(1)}</b></div>
                    <div>{q.place}</div>
                    <div>{new Date(q.time).toLocaleString()}</div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
