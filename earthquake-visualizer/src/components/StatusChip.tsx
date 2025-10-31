import type { Status } from "../utils/status";

export default function StatusChip({ status }:{ status: Status }) {
  const cfg = {
    green: { bg: "bg-green-100", dot: "bg-green-500", text: "text-green-700", label: "All clear" },
    yellow:{ bg: "bg-yellow-100", dot: "bg-yellow-500", text: "text-yellow-800", label: "Caution" },
    red:   { bg: "bg-red-100", dot: "bg-red-500", text: "text-red-800", label: "High alert" },
  }[status];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${cfg.bg} ${cfg.text}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
