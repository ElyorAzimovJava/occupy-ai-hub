import { createFileRoute, Link } from "@tanstack/react-router";
import { mockLots } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, MapPin, Star, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ParkingMap, formatDistance, sortByDistance } from "@/components/ParkingMap";
import { useRealtimeLots } from "@/lib/useRealtimeLots";
import { useGeolocation } from "@/lib/useGeolocation";
import { useDriverPrefs } from "@/lib/useDriverPrefs";

export const Route = createFileRoute("/driver/search")({
  head: () => ({ meta: [{ title: "Search - Driver" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [tab, setTab] = useState<"list"|"map">("map");
  const [q, setQ] = useState("");
  const lots = useRealtimeLots();
  const geo = useGeolocation();
  const [prefs, setPrefs] = useDriverPrefs();
  useEffect(() => { geo.request(); /* eslint-disable-next-line */ }, []);

  const filtered = useMemo(
    () => lots.filter((l) => l.name.toLowerCase().includes(q.toLowerCase()) || l.address.toLowerCase().includes(q.toLowerCase())),
    [lots, q],
  );
  const ranked = useMemo(() => {
    const origin = geo.loc ?? { lat: mockLots[0].lat, lng: mockLots[0].lng };
    return sortByDistance(filtered, origin);
  }, [filtered, geo.loc]);
  const withinRadius = useMemo(
    () => (geo.loc ? ranked.filter((r) => r.dist <= prefs.radiusKm * 1000) : ranked),
    [ranked, geo.loc, prefs.radiusKm],
  );
  const mapLots = withinRadius.map((r) => r.lot);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="relative"><SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input placeholder="Where to park?" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)}/></div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Search radius</span>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 font-bold text-[#1D4ED8]">{prefs.radiusKm} km</span>
        </div>
        <input
          type="range" min={1} max={5} step={1}
          value={prefs.radiusKm}
          onChange={(e) => setPrefs({ radiusKm: Number(e.target.value) })}
          className="mt-2 w-full accent-[#1D4ED8]"
        />
        <div className="mt-1 flex justify-between text-[10px] font-medium text-slate-400">
          {[1,2,3,4,5].map((n) => <span key={n}>{n}km</span>)}
        </div>
        <div className="mt-2 text-[11px] text-slate-500">
          {geo.loc ? `${withinRadius.length} lots within ${prefs.radiusKm} km` : "Enable location to filter by radius."}
        </div>
      </div>

      {(geo.status === "denied" || geo.status === "unavailable") && (
        <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">
            <div className="font-semibold">Location unavailable</div>
            <div>{geo.error}</div>
          </div>
          <button onClick={geo.request} className="rounded-lg bg-white px-2 py-1 font-semibold text-amber-700 ring-1 ring-amber-200">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-2 rounded-xl bg-muted p-1 text-xs font-semibold">
        {(["list","map"] as const).map((v) => (<button key={v} onClick={() => setTab(v)} className={`rounded-lg py-1.5 capitalize transition ${tab===v?"bg-card shadow":""}`}>{v} view</button>))}
      </div>
      {tab === "list" ? (
        <div className="space-y-3">{withinRadius.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            No lots within {prefs.radiusKm} km. Try a larger radius.
          </div>
        ) : withinRadius.map(({ lot: l, dist }) => {
          const free = Math.max(0, l.total - l.occupied - l.reserved);
          return (
          <Link key={l.id} to="/driver/booking" className="block overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40">
            <img src={l.image} alt="" className="h-32 w-full object-cover"/>
              <div className="p-3"><div className="flex items-start justify-between"><div className="min-w-0"><div className="truncate text-sm font-bold">{l.name}</div><div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3"/>{l.address}</div></div><div className="text-right"><div className="text-sm font-bold text-primary">${l.pricePerHour}/h</div><div className="flex items-center gap-0.5 text-[11px] text-warning"><Star className="h-3 w-3 fill-current"/>{l.rating}</div></div></div>
              <div className="mt-3 flex items-center justify-between text-[11px]"><span className={`rounded-full px-2 py-0.5 font-semibold ${free===0?"bg-rose-100 text-rose-700":free<=10?"bg-amber-100 text-amber-700":"bg-success/15 text-success"}`}>{free===0?"Full":`${free} free`}</span><span className="text-muted-foreground">{formatDistance(dist)} • Open 24/7</span></div>
            </div>
          </Link>
        );})}</div>
      ) : (
        <ParkingMap
          lots={mapLots}
          height="460px"
          userLocation={geo.loc}
          onLocateClick={geo.request}
          locating={geo.status === "loading"}
          radiusKm={prefs.radiusKm}
        />
      )}
    </div>
  );
}
