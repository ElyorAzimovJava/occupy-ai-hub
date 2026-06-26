import { createFileRoute, Link } from "@tanstack/react-router";
import { mockLots } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, MapPin, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/driver/search")({
  head: () => ({ meta: [{ title: "Search - Driver" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [tab, setTab] = useState<"list"|"map">("list");
  const [q, setQ] = useState("");
  const items = mockLots.filter((l) => l.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="relative"><SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input placeholder="Where to park?" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)}/></div>
      <div className="grid grid-cols-2 rounded-xl bg-muted p-1 text-xs font-semibold">
        {(["list","map"] as const).map((v) => (<button key={v} onClick={() => setTab(v)} className={`rounded-lg py-1.5 capitalize transition ${tab===v?"bg-card shadow":""}`}>{v} view</button>))}
      </div>
      {tab === "list" ? (
        <div className="space-y-3">{items.map((l) => (
          <Link key={l.id} to="/driver/booking" className="block overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40">
            <img src={l.image} alt="" className="h-32 w-full object-cover"/>
              <div className="p-3"><div className="flex items-start justify-between"><div className="min-w-0"><div className="truncate text-sm font-bold">{l.name}</div><div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3"/>{l.address}</div></div><div className="text-right"><div className="text-sm font-bold text-primary">${l.pricePerHour}/h</div><div className="flex items-center gap-0.5 text-[11px] text-warning"><Star className="h-3 w-3 fill-current"/>{l.rating}</div></div></div>
              <div className="mt-3 flex items-center justify-between text-[11px]"><span className="rounded-full bg-success/15 px-2 py-0.5 font-semibold text-success">{l.total-l.occupied-l.reserved} free</span><span className="text-muted-foreground">250m • Open 24/7</span></div>
            </div>
          </Link>
        ))}</div>
      ) : (
        <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border bg-card">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,oklch(0.488_0.217_264/0.08)_25%,oklch(0.488_0.217_264/0.08)_50%,transparent_50%,transparent_75%,oklch(0.488_0.217_264/0.08)_75%)] bg-[length:24px_24px]"/>
          {items.slice(0,5).map((l, i) => (<div key={l.id} className="absolute" style={{ left: `${15+i*16}%`, top: `${25+(i%3)*18}%` }}><div className="relative -translate-x-1/2 -translate-y-1/2"><div className="absolute inset-0 animate-ping rounded-full bg-primary/40"/><div className="relative rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground shadow-lg">P {l.total-l.occupied-l.reserved}</div></div></div>))}
        </div>
      )}
    </div>
  );
}
