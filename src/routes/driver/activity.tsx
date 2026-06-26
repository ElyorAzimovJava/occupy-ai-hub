import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Navigation, XCircle, Car, Info } from "lucide-react";

export const Route = createFileRoute("/driver/activity")({
  head: () => ({ meta: [{ title: "Activity - Driver" }] }),
  component: Activity,
});

function Activity() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1D4ED8]">Session Active</div>
          <h1 className="text-2xl font-extrabold text-slate-900">Plaza Central</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"/>LIVE
        </div>
      </div>

      {/* QR card */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
        <div className="mx-auto grid aspect-square w-full max-w-[260px] place-items-center rounded-2xl bg-blue-50/60 p-4">
          <div className="grid h-full w-full place-items-center rounded-lg bg-slate-900 p-3">
            <div className="grid h-full w-full place-items-center bg-white">
              <QrSvg/>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Pill label="Spot" value="B-12"/>
          <Pill label="Level" value="P2"/>
        </div>
      </div>

      <ActionRow icon={Plus} label="Extend Time"/>
      <ActionRow icon={Navigation} label="Get Directions"/>
      <ActionRow icon={XCircle} label="End Session" tone="danger"/>

      {/* Remaining */}
      <div className="rounded-2xl bg-[#1D4ED8] p-5 text-white shadow-lg shadow-blue-500/30">
        <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">Remaining Time</div>
        <div className="mt-1 text-5xl font-extrabold tabular-nums tracking-tight">01:45:18</div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/25">
          <div className="h-full w-[58%] rounded-full bg-white"/>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-medium opacity-90">
          <span>Start: 12:30 PM</span><span>End: 03:00 PM</span>
        </div>
      </div>

      {/* Vehicle */}
      <div className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[#1D4ED8]"><Car className="h-6 w-6"/></div>
        <div><div className="text-base font-bold text-slate-900">Tesla Model 3</div><div className="text-[12px] text-slate-500">ABC-1234 • BLUE</div></div>
      </div>

      {/* Cost */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Current Cost</div>
          <div className="text-2xl font-extrabold text-slate-900">$12.50</div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[12px] text-slate-500">
          <Info className="h-3.5 w-3.5"/>Rate: $5.00/hr. Next billing in 14 mins.
        </div>
      </div>

      <Link to="/driver" className="block text-center text-xs font-semibold text-[#1D4ED8]">Back to map</Link>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-blue-50/60 px-4 py-3 text-center">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-extrabold text-[#1D4ED8]">{value}</div>
    </div>
  );
}

function ActionRow({ icon: Icon, label, tone }: { icon: any; label: string; tone?: "danger" }) {
  const danger = tone === "danger";
  return (
    <button className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl py-5 ring-1 transition ${danger ? "bg-rose-50/70 text-rose-600 ring-rose-100 hover:bg-rose-100/70" : "bg-blue-50/60 text-[#1D4ED8] ring-blue-100 hover:bg-blue-100/60"}`}>
      <Icon className="h-6 w-6"/>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

function QrSvg() {
  // simple deterministic QR-ish pattern
  const cells = Array.from({ length: 21 * 21 }, (_, i) => ((i * 53 + 17) % 7) < 3);
  // force finder patterns (corners)
  const inFinder = (x: number, y: number) => (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
  return (
    <svg viewBox="0 0 21 21" className="h-full w-full" shapeRendering="crispEdges">
      <rect width="21" height="21" fill="white"/>
      {cells.map((on, i) => {
        const x = i % 21, y = Math.floor(i / 21);
        if (inFinder(x, y)) return null;
        return on ? <rect key={i} x={x} y={y} width="1" height="1" fill="#0F172A"/> : null;
      })}
      {[[0,0],[14,0],[0,14]].map(([cx,cy],i) => (
        <g key={i} fill="#0F172A">
          <rect x={cx} y={cy} width="7" height="7"/>
          <rect x={cx+1} y={cy+1} width="5" height="5" fill="white"/>
          <rect x={cx+2} y={cy+2} width="3" height="3"/>
        </g>
      ))}
    </svg>
  );
}