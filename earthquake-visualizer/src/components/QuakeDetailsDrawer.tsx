import type { Quake } from "../types";

type Props = {
  quake: Quake | null;
  onClose: () => void;
};

export default function QuakeDetailsDrawer({ quake, onClose }: Props) {
  const open = Boolean(quake);
  return (
    <div
      className={`fixed right-0 top-0 h-full w-[340px] bg-white shadow-2xl border-l 
                  transition-transform duration-200 z-60
                  ${open ? "translate-x-0" : "translate-x-full"}`}
      role="dialog" aria-hidden={!open}
    >
      <div className="p-3 border-b flex items-center justify-between">
        <h2 className="font-semibold">Event details</h2>
        <button onClick={onClose} className="px-2 py-1 text-sm border rounded">Close</button>
      </div>

      {quake ? (
        <div className="p-4 space-y-2 text-sm">
          <div className="text-lg font-semibold">M {quake.mag.toFixed(1)}</div>
          <div className="text-gray-700">{quake.place}</div>
          <div><b>Time:</b> {new Date(quake.time).toLocaleString()}</div>
          <div><b>Depth:</b> {quake.depthKm.toFixed(1)} km</div>
          <a href={quake.url} target="_blank" className="text-blue-600 underline">View on USGS ↗</a>
        </div>
      ) : null}
    </div>
  );
}
