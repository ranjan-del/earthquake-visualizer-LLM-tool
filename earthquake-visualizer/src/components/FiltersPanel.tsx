import type { TimeWindow } from "../types";

type Props = {
  window: TimeWindow;
  onWindowChange: (w: TimeWindow) => void;
  minMag: number;
  onMinMagChange: (m: number) => void;
  radiusKm: number;
  onRadiusChange: (r: number) => void;
};

export default function FiltersPanel(p: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-3 border-b bg-white/70 backdrop-blur">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Window</label>
        <select
          className="border rounded px-2 py-1"
          value={p.window}
          onChange={(e) => p.onWindowChange(e.target.value as TimeWindow)}
        >
          <option value="hour">Past hour</option>
          <option value="day">Past day</option>
          <option value="week">Past week</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Min magnitude</label>
        <input
          type="range" min={0} max={7} step={0.1}
          value={p.minMag}
          onChange={(e) => p.onMinMagChange(parseFloat(e.target.value))}
        />
        <span className="text-sm tabular-nums w-10">{p.minMag.toFixed(1)}</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Alert radius (km)</label>
        <input
          type="range" min={10} max={50} step={1}
          value={p.radiusKm}
          onChange={(e) => p.onRadiusChange(parseInt(e.target.value))}
        />
        <span className="text-sm tabular-nums w-10">{p.radiusKm}</span>
      </div>
    </div>
  );
}
