import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { mockLots, type ParkingLot } from "@/lib/mockData";
import { ParkingMap, formatDistance, sortByDistance } from "@/components/ParkingMap";
import { Search as SearchIcon, MapPin, Bookmark, Navigation, AlertCircle } from "lucide-react";
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
  const [selectedId, setSelectedId] = useState<string>(mockLots[0].id);

  // Auto-request location on first mount
  useEffect(() => { geo.request(); /* eslint-disable-next-line */ }, []);

  const ranked = useMemo(() => {
    const origin = geo.loc ?? { lat: mockLots[0].lat, lng: mockLots[0].lng };
    return sortByDistance(lots, origin);
  }, [lots, geo.loc]);

  const nearest = ranked.find((r) => r.lot.id === selectedId) ?? ranked[0];
  const lot: ParkingLot = nearest.lot;
  const free = lot.total - lot.occupied - lot.reserved;
  const walkMin = Math.max(1, Math.round(nearest.dist / 80));

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

      <div className="relative">
        <ParkingMap
          lots={lots}
          height="460px"
          selectedId={selectedId}
          onSelect={(l) => setSelectedId(l.id)}
          userLocation={geo.loc}
          onLocateClick={geo.request}
          locating={geo.status === "loading"}
          radiusKm={prefs.radiusKm}
        />
        <div className="pointer-events-none absolute inset-x-3 bottom-3">
          <Link
            to="/driver/booking"
            className="pointer-events-auto relative flex items-center gap-3 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-slate-200"
          >
            <img src={lot.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8]">Nearest to you</div>
              <div className="mt-0.5 truncate pr-24 text-base font-extrabold text-slate-900">{lot.name}</div>
              <div className="mt-1 flex items-center gap-1 text-[12px] text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                {formatDistance(nearest.dist)} • {walkMin} min walk
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-3 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-blue-500/30">
                  <Navigation className="h-3.5 w-3.5" />
                  Navigate
                </button>
                <button aria-label="Save" className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-[#1D4ED8]">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              {Math.max(0, free)} spots live
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
