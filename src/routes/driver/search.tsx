import { createFileRoute, Link } from "@tanstack/react-router";
import { mockLots } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, MapPin, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { ParkingMap, formatDistance, sortByDistance } from "@/components/ParkingMap";

export const Route = createFileRoute("/driver/search")({
  head: () => ({ meta: [{ title: "Search - Driver" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [tab, setTab] = useState<"list"|"map">("map");
  const [q, setQ] = useState("");
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const filtered = mockLots.filter((l) => l.name.toLowerCase().includes(q.toLowerCase()) || l.address.toLowerCase().includes(q.toLowerCase()));
  const ranked = useMemo(() => {
    const origin = userLoc ?? { lat: mockLots[0].lat, lng: mockLots[0].lng };
    return sortByDistance(filtered, origin);
  }, [filtered, userLoc]);
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="relative"><SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input placeholder="Where to park?" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)}/></div>
      <div className="grid grid-cols-2 rounded-xl bg-muted p-1 text-xs font-semibold">
        {(["list","map"] as const).map((v) => (<button key={v} onClick={() => setTab(v)} className={`rounded-lg py-1.5 capitalize transition ${tab===v?"bg-card shadow":""}`}>{v} view</button>))}
      </div>
      {tab === "list" ? (
        <div className="space-y-3">{ranked.map(({ lot: l, dist }) => (
          <Link key={l.id} to="/driver/booking" className="block overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40">
            <img src={l.image} alt="" className="h-32 w-full object-cover"/>
              <div className="p-3"><div className="flex items-start justify-between"><div className="min-w-0"><div className="truncate text-sm font-bold">{l.name}</div><div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3"/>{l.address}</div></div><div className="text-right"><div className="text-sm font-bold text-primary">${l.pricePerHour}/h</div><div className="flex items-center gap-0.5 text-[11px] text-warning"><Star className="h-3 w-3 fill-current"/>{l.rating}</div></div></div>
              <div className="mt-3 flex items-center justify-between text-[11px]"><span className="rounded-full bg-success/15 px-2 py-0.5 font-semibold text-success">{l.total-l.occupied-l.reserved} free</span><span className="text-muted-foreground">{formatDistance(dist)} • Open 24/7</span></div>
            </div>
          </Link>
        ))}</div>
      ) : (
        <ParkingMap lots={filtered} height="460px" onUserLocation={setUserLoc} />
      )}
    </div>
  );
}
