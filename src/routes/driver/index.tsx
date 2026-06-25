import { createFileRoute, Link } from "@tanstack/react-router";
import { mockLots } from "@/lib/mockData";
import { MapPin, Navigation, Sparkles, Clock } from "lucide-react";

export const Route = createFileRoute("/driver/")({
  head: () => ({ meta: [{ title: "Home - Driver" }] }),
  component: DriverHome,
});

function DriverHome() {
  const top = mockLots[0];
  return (
    <div className="space-y-5 animate-fade-in">
      <div><div className="text-xs text-muted-foreground">Good evening</div><h1 className="text-2xl font-bold">Find your spot</h1></div>
      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-primary p-5 text-primary-foreground shadow-glow">
        <div className="flex items-center justify-between"><div className="text-xs uppercase tracking-wider opacity-80">Active reservation</div><Clock className="h-4 w-4 opacity-80"/></div>
        <div className="mt-2 text-lg font-bold">Tashkent City Mall - B2 / A-12</div>
        <div className="mt-1 text-sm opacity-90">Ends 19:40 - 42 min left</div>
        <div className="mt-4 flex gap-2"><button className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur hover:bg-white/25">Extend</button><button className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-primary">Navigate</button></div>
      </div>
      <div className="relative h-44 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,oklch(0.488_0.217_264/0.08)_25%,oklch(0.488_0.217_264/0.08)_50%,transparent_50%,transparent_75%,oklch(0.488_0.217_264/0.08)_75%)] bg-[length:20px_20px]"/>
        {[{x:30,y:40,c:12},{x:60,y:30,c:5},{x:75,y:65,c:23}].map((p,i) => (
          <div key={i} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}><div className="relative -translate-x-1/2 -translate-y-1/2"><div className="absolute inset-0 animate-ping rounded-full bg-primary/40"/><div className="relative rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground shadow-lg">P {p.c}</div></div></div>
        ))}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold backdrop-blur"><MapPin className="h-3 w-3"/>Tashkent, Mirobod</div>
      </div>
      <div><div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-bold">Nearest parking</h2><Link to="/driver/search" className="text-xs text-primary">See all</Link></div>
        <div className="space-y-3">{mockLots.slice(0,3).map((l) => (
          <Link key={l.id} to="/driver/booking" className="flex gap-3 rounded-2xl border border-border bg-card p-3 transition hover:border-primary/40">
            <img src={l.image} alt="" className="h-20 w-24 shrink-0 rounded-xl object-cover"/>
            <div className="min-w-0 flex-1"><div className="flex items-center justify-between"><div className="truncate text-sm font-bold">{l.name}</div><div className="text-xs font-semibold text-primary">${l.price}/h</div></div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3"/>{l.distance}</div>
              <div className="mt-2 flex items-center gap-2 text-[11px]"><span className="rounded-full bg-success/15 px-2 py-0.5 font-semibold text-success">{l.total-l.occupied-l.reserved} free</span><span className="text-muted-foreground">{l.rating} stars</span></div>
            </div>
            <Navigation className="h-4 w-4 self-center text-muted-foreground"/>
          </Link>
        ))}</div>
      </div>
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4"/><div className="text-sm font-semibold">Promo: 20% off weekday parking</div></div>
        <div className="mt-1 text-xs text-muted-foreground">Use code OSON20 at checkout.</div>
      </div>
    </div>
  );
}
