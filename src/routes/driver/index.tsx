import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ParkingMap } from "@/components/ParkingMap";
import { Search as SearchIcon, AlertCircle, Sparkles } from "lucide-react";
import { useRealtimeLots } from "@/lib/useRealtimeLots";
import { useGeolocation } from "@/lib/useGeolocation";
import { useDriverPrefs } from "@/lib/useDriverPrefs";

export const Route = createFileRoute("/driver/")({
  head: () => ({ meta: [{ title: "Home - Driver" }] }),
  component: DriverHome,
});

function DriverHome() {
  const lots = useRealtimeLots();
  const geo = useGeolocation();
  const [prefs] = useDriverPrefs();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // Auto-request location on first mount
  useEffect(() => { geo.request(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="-mt-2 space-y-4 animate-fade-in">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search for parking, lots, or areas"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-[#1D4ED8] focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {(geo.status === "denied" || geo.status === "unavailable") && (
        <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">
            <div className="font-semibold">Location unavailable</div>
            <div>{geo.error} You can still browse all lots below.</div>
          </div>
          <button onClick={geo.request} className="rounded-lg bg-white px-2 py-1 font-semibold text-amber-700 ring-1 ring-amber-200">Retry</button>
        </div>
      )}

      <ParkingMap
        lots={lots}
        height="520px"
        selectedId={selectedId}
        onSelect={(l) => setSelectedId(l.id)}
        userLocation={geo.loc}
        onLocateClick={geo.request}
        locating={geo.status === "loading"}
        radiusKm={prefs.radiusKm}
      />

      <Link
        to="/driver/search"
        className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-sm font-bold text-white shadow-lg shadow-blue-200/60"
      >
        <Sparkles className="h-4 w-4" /> AI maslahat olish
      </Link>
    </div>
  );
}
