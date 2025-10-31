import { useMemo, useState } from "react";
import type { Quake } from "../types";
import { kmBetween } from "../utils/geo";

type Props = {
  open: boolean;
  onClose: () => void;
  quakes: Quake[];
  userPos: { lat: number; lng: number } | null;
  onSelect: (q: Quake) => void;
};

type SortKey = "newest" | "strongest" | "closest";

function MagnitudeBadge({ mag }: { mag: number }) {
  const color =
    mag >= 5 ? "bg-red-100 text-red-800 ring-red-300/50" :
    mag >= 3 ? "bg-yellow-100 text-yellow-800 ring-yellow-300/50" :
               "bg-green-100 text-green-800 ring-green-300/50";
  return (
    <span className={`inline-flex items-center justify-center min-w-[60px] px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${color}`}>
      M {mag.toFixed(1)}
    </span>
  );
}

export default function InfoPanel({ open, onClose, quakes, userPos, onSelect }: Props) {
  const [sort, setSort] = useState<SortKey>("newest");

  const rows = useMemo(() => {
    const copy = [...quakes];
    if (sort === "newest") copy.sort((a, b) => b.time - a.time);
    if (sort === "strongest") copy.sort((a, b) => b.mag - a.mag);
    if (sort === "closest" && userPos) {
      copy.sort(
        (a, b) => kmBetween(userPos, a.coords) - kmBetween(userPos, b.coords)
      );
    }
    return copy.slice(0, 80);
  }, [quakes, sort, userPos]);

  return (
    <div
      className={`
        fixed right-0 bottom-0 bg-white border-t md:border-l shadow-2xl
        w-full h-full md:w-[50vw]
        transition-transform duration-200 ease-out
        z-50
        ${open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full"}
      `}
      role="dialog"
      aria-hidden={!open}
      aria-label="Earthquake information panel"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold">Earthquakes</h2>
          <span className="text-xs text-gray-500">{quakes.length} events</span>
        </div>

        <div className="flex items-center gap-2">
          {/* segmented control */}
          <div className="hidden md:flex items-center rounded-lg bg-gray-100 p-1">
            <button
              className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
                sort === "newest" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:bg-white/50 hover:text-gray-800"
              }`}
              onClick={() => setSort("newest")}
            >
              Newest
            </button>
            <button
              className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
                sort === "strongest" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:bg-white/50 hover:text-gray-800"
              }`}
              onClick={() => setSort("strongest")}
            >
              Strongest
            </button>
            <button
              className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
                sort === "closest" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:bg-white/50 hover:text-gray-800"
              } ${
                !userPos ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setSort("closest")}
              disabled={!userPos}
              title={!userPos ? "Needs your location" : ""}
            >
              Closest
            </button>
          </div>

          {/* X close (SVG) */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Close panel"
            title="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" className="text-gray-600">
              <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 1 0-1.41 1.41L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="pl-4 pr-2 overflow-auto h-full">
        {rows.map((q, i) => {
          const dist =
            userPos ? `~${Math.round(kmBetween(userPos, q.coords))} km away` : "";
          return (
            <button
              key={q.id}
              onClick={() => onSelect(q)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 rounded-md"
            >
              <div className="flex items-start gap-3">
                <MagnitudeBadge mag={q.mag} />
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {new Date(q.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-700">{q.place}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Depth {q.depthKm.toFixed(1)} km {dist && <span className="mx-1">•</span>} {dist}
                  </div>
                </div>
              </div>
              {/* divider */}
              <div className="mt-3 border-b" />
            </button>
          );
        })}

        {rows.length === 0 && (
          <div className="px-4 py-6 text-sm text-gray-500">No events match your filters.</div>
        )}
      </div>
    </div>
  );
}
