import type { Quake } from "../types";

type Props = {
  quake: Quake | null;
  onClose: () => void;
};

export default function QuakeDetailsDrawer({ quake, onClose }: Props) {
  const open = Boolean(quake);
  return (
    <div
      className={`fixed right-0 top-0 h-full w-[360px] bg-white shadow-2xl border-l
                  transition-transform duration-200 z-2100
                  ${open ? "translate-x-0" : "translate-x-full"}`}
      role="dialog"
      aria-hidden={!open}
    >
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h2 className="font-semibold">Event details</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          title="Close"
          className="p-2 rounded-lg border hover:bg-gray-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" className="text-gray-700">
            <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 1 0-1.41 1.41L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"/>
          </svg>
        </button>
      </div>

      {quake ? (
        <div className="p-4 space-y-3 text-sm">
          <div className="text-2xl font-semibold leading-none">M {quake.mag.toFixed(1)}</div>
          <div className="text-gray-700">{quake.place}</div>

          <div className="grid grid-cols-[110px_1fr] gap-y-2">
            <div className="font-semibold">Time:</div>
            <div>{new Date(quake.time).toLocaleString()}</div>

            <div className="font-semibold">Depth:</div>
            <div>{quake.depthKm.toFixed(1)} km</div>
          </div>

          <a
            href={quake.url}
            target="_blank"
            className="inline-flex items-center gap-1 text-blue-600 underline"
          >
            View on USGS
            <span aria-hidden>↗</span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
