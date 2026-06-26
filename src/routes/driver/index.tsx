import { createFileRoute, Link } from "@tanstack/react-router";
import { mockLots } from "@/lib/mockData";
import { Search as SearchIcon, MapPin, Crosshair, Bookmark, Navigation } from "lucide-react";

export const Route = createFileRoute("/driver/")({
  head: () => ({ meta: [{ title: "Home - Driver" }] }),
  component: DriverHome,
});

function DriverHome() {
  const top = mockLots[0];
  const free = top.total - top.occupied - top.reserved;
  return (
    <div className="-mt-2 space-y-4 animate-fade-in">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
        <input
          placeholder="Search for parking, lots, or areas"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-[#1D4ED8] focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div className="relative h-[420px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#13233f] to-[#0F172A] ring-1 ring-slate-200/60 shadow-lg">
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(115deg,transparent_46%,rgba(255,210,80,0.45)_46%,rgba(255,210,80,0.45)_48%,transparent_48%),linear-gradient(65deg,transparent_46%,rgba(255,210,80,0.35)_46%,rgba(255,210,80,0.35)_48%,transparent_48%)] [background-size:80px_80px,120px_120px]"/>
        <div className="absolute inset-x-6 top-10 grid grid-cols-6 gap-2 opacity-70">
          {Array.from({length:24}).map((_,i)=>(<div key={i} className="h-12 rounded-md bg-gradient-to-b from-slate-400/40 to-slate-700/40 backdrop-blur-sm" style={{height:`${30+(i%5)*16}px`}}/>))}
        </div>
        {[
          {x:42,y:30,tone:"green",label:"P"},
          {x:22,y:48,tone:"red",label:"P"},
          {x:62,y:42,tone:"green",label:"P"},
          {x:14,y:78,tone:"green",label:"P"},
          {x:72,y:74,tone:"red",label:"X"},
        ].map((p,i)=>(
          <Pin key={i} x={p.x} y={p.y} tone={p.tone as "green"|"red"} label={p.label}/>
        ))}

        <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-[#1D4ED8] shadow-lg ring-1 ring-slate-200">
          <Crosshair className="h-5 w-5"/>
        </button>

        <div className="absolute inset-x-3 bottom-3">
          <Link to="/driver/booking" className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-slate-200">
            <img src={top.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover"/>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8]">Nearest to you</div>
              <div className="mt-0.5 truncate text-base font-extrabold text-slate-900">{top.name}</div>
              <div className="mt-1 flex items-center gap-1 text-[12px] text-slate-500"><MapPin className="h-3.5 w-3.5"/>250m • 3 min walk</div>
              <div className="mt-2 flex items-center gap-2">
                <button className="flex-1 rounded-xl bg-[#1D4ED8] px-3 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-blue-500/30 inline-flex items-center justify-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5"/>Navigate
                </button>
                <button aria-label="Save" className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-[#1D4ED8]"><Bookmark className="h-4 w-4"/></button>
              </div>
            </div>
            <div className="absolute right-5 top-5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">{free} spots available</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Pin({ x, y, tone, label }: { x: number; y: number; tone: "green" | "red"; label: string }) {
  const color = tone === "green" ? "bg-emerald-500" : "bg-rose-500";
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="relative -translate-x-1/2 -translate-y-full">
        <div className={`grid h-10 w-10 place-items-center rounded-full ${color} text-sm font-extrabold text-white shadow-xl ring-4 ring-white/30`}>{label}</div>
        <div className={`mx-auto -mt-1 h-3 w-3 rotate-45 ${color} shadow-md`}/>
      </div>
    </div>
  );
}
