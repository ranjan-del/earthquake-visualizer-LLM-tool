import { useEffect, useMemo, useState } from "react";
import { useGeolocation } from "./hooks/useGeolocation";
import { useQuakes } from "./hooks/useQuakes";
import type { Quake, TimeWindow } from "./types";
import MapView from "./components/MapView";
import StatusChip from "./components/StatusChip";
import FiltersPanel from "./components/FiltersPanel";
import { classifyStatus } from "./utils/status";
import QuakeDetailsDrawer from "./components/QuakeDetailsDrawer";
import { useSearchParams } from "react-router-dom";
import InfoPanel from "./components/InfoPanel";
import Modal from "./components/Modal";
import { explainStatus } from "./api/llm";
import { type RiskContext } from "./llm/riskExplainer";

export default function App() {
  // const [window, setWindow] = useState<TimeWindow>("day");
  // const [minMag, setMinMag] = useState(0);
  // const [radiusKm, setRadiusKm] = useState(25);
  const [selected, setSelected] = useState<Quake | null>(null);
  const { pos: userPos } = useGeolocation();
  const [sp, setSp] = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);
  
  // read initial from URL (with fallbacks)
  const initialWindow = (sp.get("w") as TimeWindow) || "day";
  const initialMinMag = Number(sp.get("m") ?? 0);
  const initialRadius = Number(sp.get("r") ?? 25);
  
  const [window, setWindow] = useState<TimeWindow>(initialWindow);
  const [minMag, setMinMag] = useState(initialMinMag);
  const [radiusKm, setRadiusKm] = useState(initialRadius);
  const { data: quakes = [], isLoading, isError } = useQuakes(window);

  const [whyOpen, setWhyOpen] = useState(false);
  const [whyText, setWhyText] = useState<string>("");

  async function onWhyClick() {
    setWhyOpen(true);
    setWhyText("Generating…");
    const ctx: RiskContext = {
      status,
      userPos,
      minMag,
      radiusKm,
      window,
      quakes
    };
    const summary = await explainStatus(ctx);
    setWhyText(summary);
  }

  useEffect(() => {
    const next = new URLSearchParams(sp);
    next.set("w", window);
    next.set("m", String(minMag));
    next.set("r", String(radiusKm));
    setSp(next, { replace: true });
  }, [window, minMag, radiusKm]);

  const center = useMemo<[number, number]>(() => {
    if (userPos) return [userPos.lat, userPos.lng];
    return [20, 0]; // world default
  }, [userPos]);

  const status = classifyStatus(userPos, quakes, { radiusKm, warnMaxKm: 50, alertMag: 4.5 });

  return (
    <div className="min-h-screen flex flex-col">   {/* was h-full */}
    <header className="p-3 border-b bg-white/70 backdrop-blur flex justify-between items-center">
      <h1 className="font-semibold">Earthquake Visualizer</h1>
      <div className="flex items-center gap-3">   {/* add gap so text and chip don't touch */}
        <span className="text-sm text-gray-600">
          {isLoading ? "Loading…" : isError ? "Failed to load" : `${quakes.length} events`}
        </span>
        <button
            onClick={onWhyClick}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            title="Explain why this status is shown"
          >
            Why this status?
          </button>
        <button
            onClick={() => setPanelOpen((v) => !v)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            title="Toggle info panel"
          >
            {panelOpen ? "Hide info" : "Show info"}
          </button>
        <StatusChip status={status} />
      </div>
    </header>

    <Modal open={whyOpen} onClose={() => setWhyOpen(false)} title="Why this status?">
        <p className="whitespace-pre-wrap">{whyText}</p>
        <p className="mt-3 text-xs text-gray-500">
          Note: Informational summary only; not safety guidance.
        </p>
      </Modal>

      {/* Filters */}
      <FiltersPanel
        window={window}
        onWindowChange={setWindow}
        minMag={minMag}
        onMinMagChange={setMinMag}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
      />

      {/* Map */}
      <div className="w-full h-[calc(100vh-120px)] relative">
        <MapView
          center={center}
          quakes={quakes}
          minMag={minMag}
          userPos={userPos}
          radiusKm={radiusKm}
          onSelect={setSelected}
        />
      </div>

      

      <InfoPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        quakes={quakes}
        userPos={userPos}
        onSelect={(q: Quake) => {
          setSelected(q);
          // keep panel open so user sees details + can click link,
          // or close automatically:
          // setPanelOpen(false);
        }}
      />
      
      <QuakeDetailsDrawer quake={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
