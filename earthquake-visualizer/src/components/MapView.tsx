import { MapContainer, TileLayer, CircleMarker, Tooltip, Circle } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { Quake } from "../types";

const WORLD_BOUNDS: [[number, number], [number, number]] = [[-85, -180], [85, 180]];

type Props = {
  center: LatLngExpression;
  quakes: Quake[];
  minMag: number;
  userPos: {lat:number; lng:number} | null;
  radiusKm: number;
  onSelect?: (q: Quake) => void;   // ← new
};

export default function MapView({ center, quakes, minMag, userPos, radiusKm, onSelect }: Props) {
  const zoom = Array.isArray(center) ?  (userPos ? 6 : 3) : 3;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={2}                 // ← prevent zooming out too far
      maxZoom={18}
      maxBounds={WORLD_BOUNDS}    // ← keep view inside the world
      maxBoundsViscosity={1.0}    // ← elastic stop at bounds
      worldCopyJump={false}       // ← no world jump copies
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}             // ← stop horizontal wrapping/copies
      />

      {userPos && (
        <>
          <CircleMarker
            center={[userPos.lat, userPos.lng]}
            radius={6}
            pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.9 }}
          >
            <Tooltip>You're here</Tooltip>
          </CircleMarker>
          <Circle
            center={[userPos.lat, userPos.lng]}
            radius={radiusKm * 1000}
            pathOptions={{ color: "#3b82f6", fillOpacity: 0.05 }}
          />
        </>
      )}

      {quakes.filter(q => q.mag >= minMag).map((q) => {
        const color = q.mag >= 5 ? "#ef4444" : q.mag >= 3 ? "#f59e0b" : "#22c55e";
        const radius = Math.max(4, q.mag * 2);
        return (
          <CircleMarker
        key={q.id}
        center={[q.coords.lat, q.coords.lng]}
        radius={radius}
        eventHandlers={{ click: () => onSelect?.(q) }}   // ← new
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
  );
}
