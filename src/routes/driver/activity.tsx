import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Car, Clock, MapPin, Navigation, XCircle, Plus, Sparkles,
  TrendingUp, TrendingDown, Calendar, Receipt, CheckCircle2, AlertCircle, Timer,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,
  AreaChart, Area,
} from "recharts";

export const Route = createFileRoute("/driver/activity")({
  head: () => ({ meta: [{ title: "Faoliyat - Driver" }] }),
  component: Activity,
});

const HOURLY_RATE_UZS = 15000;

// Active session — started 1h 42m ago
const activeSession = {
  id: "BK-2026-0042",
  lot: "Plaza Central",
  address: "Amir Temur 108, Toshkent",
  spot: "B-12",
  level: "P2",
  startedAt: Date.now() - (1 * 60 + 42) * 60 * 1000,
  rateUzs: HOURLY_RATE_UZS,
  vehicle: "Chevrolet Cobalt",
  plate: "01 A 777 BC",
};

type HistoryItem = {
  id: string;
  lot: string;
  address: string;
  date: string;            // ISO date
  start: string;
  end: string;
  durationMin: number;
  amountUzs: number;
  status: "completed" | "cancelled";
};

const history: HistoryItem[] = [
  { id: "BK-0041", lot: "Tashkent City Mall",  address: "Islom Karimov 1",  date: "2026-06-26", start: "14:20", end: "16:50", durationMin: 150, amountUzs: 37500, status: "completed" },
  { id: "BK-0040", lot: "Magic City Garage",   address: "Bunyodkor 2",      date: "2026-06-25", start: "09:10", end: "10:40", durationMin: 90,  amountUzs: 22500, status: "completed" },
  { id: "BK-0039", lot: "Compass Mall Lot",    address: "Mustaqillik 14",   date: "2026-06-24", start: "18:00", end: "20:15", durationMin: 135, amountUzs: 33800, status: "completed" },
  { id: "BK-0038", lot: "Mega Planet Parking", address: "Katartal 60",      date: "2026-06-23", start: "12:00", end: "12:30", durationMin: 30,  amountUzs: 0,     status: "cancelled" },
  { id: "BK-0037", lot: "Riviera Centre",      address: "Amir Temur 108",   date: "2026-06-22", start: "10:00", end: "13:00", durationMin: 180, amountUzs: 45000, status: "completed" },
  { id: "BK-0036", lot: "Yunusabad Plaza",     address: "Yunusabad 11",     date: "2026-06-20", start: "16:30", end: "19:00", durationMin: 150, amountUzs: 37500, status: "completed" },
  { id: "BK-0035", lot: "Atlas Mall",          address: "M. Ulug'bek 80",   date: "2026-06-18", start: "11:00", end: "12:00", durationMin: 60,  amountUzs: 15000, status: "completed" },
  { id: "BK-0034", lot: "Next Mall Parking",   address: "Bogishamol 264",   date: "2026-06-15", start: "13:45", end: "17:00", durationMin: 195, amountUzs: 48800, status: "completed" },
  { id: "BK-0033", lot: "Oybek Metro Garage",  address: "Oybek 22",         date: "2026-06-12", start: "08:30", end: "10:00", durationMin: 90,  amountUzs: 22500, status: "completed" },
  { id: "BK-0032", lot: "Sergeli Trade Centre",address: "Sergeli 4",        date: "2026-06-08", start: "15:00", end: "17:30", durationMin: 150, amountUzs: 37500, status: "completed" },
  { id: "BK-0031", lot: "Tashkent City Mall",  address: "Islom Karimov 1",  date: "2026-05-30", start: "18:00", end: "21:00", durationMin: 180, amountUzs: 45000, status: "completed" },
  { id: "BK-0030", lot: "Compass Mall Lot",    address: "Mustaqillik 14",   date: "2026-05-22", start: "11:00", end: "13:30", durationMin: 150, amountUzs: 37500, status: "completed" },
];

function fmtUzs(n: number) { return `${n.toLocaleString("uz-UZ")} so'm`; }
function pad(n: number) { return String(n).padStart(2, "0"); }

function Activity() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsedMs = now - activeSession.startedAt;
  const elapsedSec = Math.max(0, Math.floor(elapsedMs / 1000));
  const h = Math.floor(elapsedSec / 3600);
  const m = Math.floor((elapsedSec % 3600) / 60);
  const s = elapsedSec % 60;
  const hoursDecimal = elapsedSec / 3600;
  const currentCost = Math.round(hoursDecimal * activeSession.rateUzs);

  // Aggregations
  const stats = useMemo(() => {
    const completed = history.filter((h) => h.status === "completed");
    const totalSpent = completed.reduce((a, b) => a + b.amountUzs, 0);
    const totalMin = completed.reduce((a, b) => a + b.durationMin, 0);
    const avgMin = completed.length ? Math.round(totalMin / completed.length) : 0;
    const favMap = new Map<string, number>();
    completed.forEach((h) => favMap.set(h.lot, (favMap.get(h.lot) || 0) + 1));
    const favorite = [...favMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    return { totalSpent, totalMin, avgMin, favorite, count: completed.length };
  }, []);

  // Daily series — last 7 days
  const dailySeries = useMemo(() => {
    const days = ["Du","Se","Ch","Pa","Ju","Sh","Ya"];
    const today = new Date("2026-06-27");
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - (6 - i));
      const iso = d.toISOString().slice(0, 10);
      const items = history.filter((x) => x.date === iso && x.status === "completed");
      return {
        day: days[d.getDay() === 0 ? 6 : d.getDay() - 1],
        amount: items.reduce((a, b) => a + b.amountUzs, 0),
        sessions: items.length,
      };
    });
  }, []);

  // Weekly series — last 4 weeks
  const weeklySeries = useMemo(() => {
    return [
      { week: "H-4", amount: 82500 },
      { week: "H-3", amount: 120000 },
      { week: "H-2", amount: 97500 },
      { week: "H-1", amount: 176100 },
    ];
  }, []);

  const weekTotal = dailySeries.reduce((a, b) => a + b.amount, 0);
  const monthTotal = stats.totalSpent;

  const [tab, setTab] = useState<"kunlik" | "haftalik" | "oylik">("haftalik");

  return (
    <div className="space-y-5 animate-fade-in pb-4">
      {/* ===== Active session ===== */}
      <section>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1D4ED8]">Faol sessiya</div>
            <h1 className="text-2xl font-extrabold text-slate-900">{activeSession.lot}</h1>
            <div className="mt-0.5 flex items-center gap-1 text-[12px] text-slate-500">
              <MapPin className="h-3.5 w-3.5" />{activeSession.address}
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />LIVE
          </div>
        </div>

        {/* Timer + cost card */}
        <div className="mt-3 rounded-2xl bg-[#1D4ED8] p-5 text-white shadow-lg shadow-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">Davom etayotgan vaqt</div>
              <div className="mt-1 text-5xl font-extrabold tabular-nums tracking-tight">
                {pad(h)}:{pad(m)}:{pad(s)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">Hozirgi xarajat</div>
              <div className="mt-1 text-2xl font-extrabold tabular-nums">{currentCost.toLocaleString("uz-UZ")}</div>
              <div className="text-[11px] opacity-80">so'm</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
            <Mini label="Spot" value={activeSession.spot} />
            <Mini label="Level" value={activeSession.level} />
            <Mini label="Soatlik" value={`${(activeSession.rateUzs/1000)}k`} />
          </div>
        </div>

        {/* Vehicle */}
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[#1D4ED8]"><Car className="h-5 w-5" /></div>
          <div className="flex-1">
            <div className="text-sm font-bold text-slate-900">{activeSession.vehicle}</div>
            <div className="text-[12px] text-slate-500">{activeSession.plate}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bron</div>
            <div className="text-[12px] font-semibold text-slate-700">{activeSession.id}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <ActionBtn icon={Plus} label="Uzaytirish" />
          <ActionBtn icon={Navigation} label="Yo'l" />
          <ActionBtn icon={XCircle} label="Tugatish" tone="danger" />
        </div>
      </section>

      {/* ===== AI Analytics ===== */}
      <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-[#1D4ED8] text-white">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-violet-600">AI Tahlil</div>
              <div className="text-base font-extrabold text-slate-900">Faoliyat hisoboti</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 text-[12px] font-semibold">
          {(["kunlik","haftalik","oylik"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-lg py-2 capitalize transition ${tab === t ? "bg-white text-[#1D4ED8] shadow-sm" : "text-slate-500"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Headline KPI */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Kpi label={tab === "oylik" ? "Oyda sarf" : tab === "haftalik" ? "Haftada sarf" : "Bugun sarf"}
               value={fmtUzs(tab === "oylik" ? monthTotal : tab === "haftalik" ? weekTotal : dailySeries[dailySeries.length-1].amount)}
               trend="+12%" up />
          <Kpi label="Sessiyalar" value={`${stats.count}`} trend="+3" up />
        </div>

        {/* Chart */}
        <div className="mt-4 h-44 w-full">
          <ResponsiveContainer>
            {tab === "haftalik" ? (
              <BarChart data={dailySeries} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.08} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{ fill: "rgba(29,78,216,0.06)" }}
                  contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 11 }}
                  formatter={(v: number) => fmtUzs(v)} />
                <Bar dataKey="amount" fill="#1D4ED8" radius={[8,8,0,0]} maxBarSize={28} />
              </BarChart>
            ) : tab === "oylik" ? (
              <AreaChart data={weeklySeries} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.08} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 11 }}
                  formatter={(v: number) => fmtUzs(v)} />
                <Area dataKey="amount" stroke="#1D4ED8" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            ) : (
              <BarChart data={dailySeries.slice(-1).concat(
                Array.from({ length: 6 }, (_, i) => ({ day: `${i*4}h`, amount: i === 5 ? dailySeries.slice(-1)[0].amount : 0, sessions: 0 }))
              )} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.08} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 11 }}
                  formatter={(v: number) => fmtUzs(v)} />
                <Bar dataKey="amount" fill="#10B981" radius={[8,8,0,0]} maxBarSize={28} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* AI insights */}
        <div className="mt-4 space-y-2">
          <Insight icon={TrendingUp} tone="success"
            title="Eng faol kun — Juma"
            body={`Hafta ichida Juma kuni eng ko'p mablag' (${fmtUzs(dailySeries[4]?.amount || 45000)}) sarflandi.`}/>
          <Insight icon={MapPin} tone="info"
            title={`Sevimli joy — ${stats.favorite}`}
            body={`Oxirgi ${stats.count} sessiyada eng ko'p shu manzilga to'xtagansiz.`}/>
          <Insight icon={Timer} tone="info"
            title={`O'rtacha sessiya: ${Math.floor(stats.avgMin/60)} soat ${stats.avgMin%60} daq`}
            body="Bir sessiya o'rtacha shu vaqtni egallaydi — 1-2 soatlik bronlar foydaliroq."/>
          <Insight icon={TrendingDown} tone="warning"
            title="Tavsiya: 18:00–20:00 vaqtdan saqlaning"
            body="Bu oraliqda narxlar va band lik 35% gacha oshadi. 16:00 dan oldin keling — tejaysiz."/>
        </div>
      </section>

      {/* ===== History ===== */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">Tarix</h2>
          <div className="text-[11px] font-semibold text-slate-500">{history.length} ta yozuv</div>
        </div>
        <div className="space-y-2">
          {history.map((h) => (
            <HistoryRow key={h.id} item={h} />
          ))}
        </div>
      </section>

      <Link to="/driver" className="block text-center text-xs font-semibold text-[#1D4ED8]">Bosh sahifa</Link>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/15 px-3 py-2 text-center backdrop-blur">
      <div className="text-[9px] font-bold uppercase tracking-wider opacity-80">{label}</div>
      <div className="text-sm font-extrabold">{value}</div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, tone }: { icon: any; label: string; tone?: "danger" }) {
  const danger = tone === "danger";
  return (
    <button className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-3.5 ring-1 transition ${danger ? "bg-rose-50 text-rose-600 ring-rose-100 hover:bg-rose-100" : "bg-blue-50/70 text-[#1D4ED8] ring-blue-100 hover:bg-blue-100/70"}`}>
      <Icon className="h-5 w-5" />
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  );
}

function Kpi({ label, value, trend, up }: { label: string; value: string; trend: string; up?: boolean }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-extrabold text-slate-900">{value}</div>
      <div className={`mt-1 inline-flex items-center gap-0.5 text-[10px] font-bold ${up ? "text-emerald-600" : "text-rose-600"}`}>
        {up ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}{trend}
      </div>
    </div>
  );
}

function Insight({ icon: Icon, title, body, tone }: { icon: any; title: string; body: string; tone: "success" | "info" | "warning" }) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    info: "bg-blue-50 text-[#1D4ED8] ring-blue-100",
    warning: "bg-amber-50 text-amber-700 ring-amber-100",
  }[tone];
  return (
    <div className={`flex gap-3 rounded-xl p-3 ring-1 ${styles}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">
        <div className="text-[12px] font-bold">{title}</div>
        <div className="text-[11px] opacity-80 leading-snug">{body}</div>
      </div>
    </div>
  );
}

function HistoryRow({ item }: { item: HistoryItem }) {
  const done = item.status === "completed";
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-slate-200">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${done ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
        {done ? <CheckCircle2 className="h-5 w-5"/> : <AlertCircle className="h-5 w-5"/>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-bold text-slate-900">{item.lot}</div>
          {!done && <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-rose-600">Bekor</span>}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
          <Calendar className="h-3 w-3"/>{item.date}
          <span>•</span>
          <Clock className="h-3 w-3"/>{item.start}–{item.end}
          <span>•</span>
          <span>{Math.floor(item.durationMin/60)}s {item.durationMin%60}d</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-extrabold text-slate-900">{item.amountUzs > 0 ? fmtUzs(item.amountUzs) : "—"}</div>
        <div className="text-[10px] font-semibold text-slate-400 inline-flex items-center gap-0.5">
          <Receipt className="h-3 w-3"/>{item.id}
        </div>
      </div>
    </div>
  );
}