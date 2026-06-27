import { createFileRoute, Link } from "@tanstack/react-router";
import { mockLots } from "@/lib/mockData";
import {
  Sparkles, Route as RouteIcon, Clock, Leaf, Wallet, Navigation, Star,
  ChevronRight, AlertCircle, X, Brain, MapPin, RefreshCw, Search as SearchIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ParkingMap, formatDistance, sortByDistance } from "@/components/ParkingMap";
import { useRealtimeLots } from "@/lib/useRealtimeLots";
import { useGeolocation } from "@/lib/useGeolocation";
import { useDriverPrefs } from "@/lib/useDriverPrefs";
import { aiRecommend, type AiCandidate } from "@/lib/aiRecommend";
import { formatUzs } from "@/lib/aiRecommend";

export const Route = createFileRoute("/driver/search")({
  head: () => ({ meta: [{ title: "AI Smart Selection - Driver" }] }),
  component: SearchPage,
});

function SearchPage() {
  const lots = useRealtimeLots();
  const geo = useGeolocation();
  const [prefs, setPrefs] = useDriverPrefs();
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [aiOn, setAiOn] = useState(false);
  const [query, setQuery] = useState("");

  const origin = geo.loc ?? { lat: mockLots[0].lat, lng: mockLots[0].lng };

  const pool = useMemo(() => {
    if (!geo.loc) return lots;
    return lots.filter((l) => {
      const dx = (l.lat - geo.loc!.lat) * 111;
      const dy = (l.lng - geo.loc!.lng) * 95;
      return Math.sqrt(dx * dx + dy * dy) <= prefs.radiusKm;
    });
  }, [lots, geo.loc, prefs.radiusKm]);

  const filteredPool = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter((l) => l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q));
  }, [pool, query]);

  const verdict = useMemo(
    () => (aiOn ? aiRecommend(filteredPool.length ? filteredPool : lots, origin) : null),
    [aiOn, filteredPool, lots, origin],
  );
  const available = verdict?.ranked.filter((c) => !rejectedIds.includes(c.lot.id)) ?? [];
  const best: AiCandidate | undefined = available[0];
  const alternatives = available.slice(1, 4);

  const sortedPlain = useMemo(
    () => sortByDistance(filteredPool.length ? filteredPool : lots, origin),
    [filteredPool, lots, origin],
  );

  const reject = (id: string) => setRejectedIds((r) => [...r, id]);
  const reset = () => setRejectedIds([]);
  const toggleAi = () => { setAiOn((v) => !v); setRejectedIds([]); };

  return (
    <div className="-mt-2 space-y-4 animate-fade-in pb-6">
      {/* Search bar */}
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Parking, hudud yoki manzil bo'yicha qidirish"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-[#1D4ED8] focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Map */}
      <div className="relative">
        <ParkingMap
          lots={filteredPool.length ? filteredPool : lots}
          height="260px"
          selectedId={best?.lot.id}
          userLocation={geo.loc}
          onLocateClick={geo.request}
          locating={geo.status === "loading"}
          radiusKm={prefs.radiusKm}
        />
      </div>

      {/* Radius control */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Qidiruv radiusi</span>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 font-bold text-[#1D4ED8]">{prefs.radiusKm} km</span>
        </div>
        <input type="range" min={1} max={5} step={1}
          value={prefs.radiusKm}
          onChange={(e) => setPrefs({ radiusKm: Number(e.target.value) })}
          className="mt-2 w-full accent-[#1D4ED8]" />
      </div>

      {(geo.status === "denied" || geo.status === "unavailable") && (
        <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">
            <div className="font-semibold">Lokatsiya mavjud emas</div>
            <div>{geo.error}</div>
          </div>
          <button onClick={geo.request} className="rounded-lg bg-white px-2 py-1 font-semibold text-amber-700 ring-1 ring-amber-200">Qayta urinish</button>
        </div>
      )}

      {/* AI Maslahat toggle */}
      <button
        onClick={toggleAi}
        className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold shadow-lg transition ${
          aiOn
            ? "bg-white text-[#1D4ED8] ring-2 ring-[#1D4ED8]"
            : "bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white shadow-blue-200/60"
        }`}
      >
        <Sparkles className="h-4 w-4" />
        {aiOn ? "AI maslahatni o'chirish" : "AI maslahat olish"}
      </button>

      {!aiOn && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900">Yaqin atrofdagi parkinglar</h3>
            <span className="text-[11px] text-slate-500">{sortedPlain.length} ta natija</span>
          </div>
          {sortedPlain.slice(0, 12).map(({ lot, dist }) => {
            const free = Math.max(0, lot.total - lot.occupied - lot.reserved);
            return (
              <Link key={lot.id} to="/driver/booking" search={{ lot: lot.id }} className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm ring-1 ring-slate-200">
                <img src={lot.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-slate-900">{lot.name}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3"/>{formatDistance(dist)}</span>
                    <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400"/>{lot.rating}</span>
                    <span className={`font-semibold ${free === 0 ? "text-rose-600" : "text-emerald-600"}`}>{free} bo'sh</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            );
          })}
        </div>
      )}

      {/* AI Best Choice Card */}
      {aiOn && best ? (
        <BestChoiceCard candidate={best} onReject={() => reject(best.lot.id)} />
      ) : aiOn ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <div className="text-sm font-semibold text-slate-700">Barcha variantlar rad etildi</div>
          <button onClick={reset} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white">
            <RefreshCw className="h-3.5 w-3.5" /> Qaytadan boshlash
          </button>
        </div>
      ) : null}

      {/* Alternatives */}
      {aiOn && alternatives.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Muqobil variantlar</h3>
            <button className="text-xs font-semibold text-[#1D4ED8]">Hammasini ko'rish</button>
          </div>
          <div className="mt-3 space-y-2">
            {alternatives.map((c) => (
              <AlternativeRow key={c.lot.id} candidate={c} onSkip={() => reject(c.lot.id)} />
            ))}
          </div>
        </div>
      )}

      {/* AI Verdict */}
      {aiOn && best && verdict && (
        <div className="rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1D4ED8] p-5 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-white/15 ring-1 ring-white/20">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">AI Yakuniy Xulosa</div>
              <div className="text-sm font-bold">Oson Parking Vision</div>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/90">{verdict.summary}</p>
          {best.reasons.length > 0 && (
            <ul className="mt-3 space-y-1 text-[11px] text-white/80">
              {best.reasons.slice(0, 3).map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#10B981]" /> {r}
                </li>
              ))}
            </ul>
          )}
          {rejectedIds.length > 0 && (
            <div className="mt-3 text-[11px] text-white/70">
              {rejectedIds.length} ta variant rad etildi • AI keyingi eng yaxshi tanlovni taklif qildi
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BestChoiceCard({ candidate, onReject }: { candidate: AiCandidate; onReject: () => void }) {
  const { lot } = candidate;
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
      <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
        <Sparkles className="h-3 w-3" /> AI eng yaxshi tanlov
      </div>

      <h2 className="mt-7 text-2xl font-extrabold leading-tight text-slate-900">{lot.name}</h2>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="font-semibold text-slate-700">{lot.rating}</span>
        <span>(120+ sharhlar)</span>
        <span>•</span>
        <MapPin className="h-3 w-3" />
        <span className="truncate">{lot.address}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <MetricTile icon={<RouteIcon className="h-4 w-4" />} label="Masofa" value={`${candidate.distanceKm.toFixed(1)} km`} />
        <MetricTile icon={<Clock className="h-4 w-4" />} label="Vaqt" value={`${candidate.driveMin} daq`} />
        <MetricTile icon={<Leaf className="h-4 w-4 text-emerald-600" />} label="Yoqilg'i sarfi" value={`${candidate.fuelLiters} L`} valueClass="text-emerald-600" tone="emerald" />
        <MetricTile icon={<Wallet className="h-4 w-4" />} label="Jami xarajat" value={formatUzs(candidate.totalCostUzs)} />
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-[11px] text-slate-600 ring-1 ring-slate-200">
        <span>Parking: <b className="text-slate-800">{formatUzs(candidate.parkingCostUzs)}/soat</b></span>
        <span>Yoqilg'i: <b className="text-slate-800">{formatUzs(candidate.fuelCostUzs)}</b></span>
        <span><b className={candidate.freeSpots === 0 ? "text-rose-600" : "text-emerald-600"}>{candidate.freeSpots}</b> bo'sh</span>
      </div>

      <div className="mt-4 grid grid-cols-[1fr,auto] gap-2">
        <Link to="/driver/booking" search={{ lot: lot.id }} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1D4ED8] text-sm font-bold text-white shadow-lg shadow-blue-200 transition active:scale-[0.98]">
          <Navigation className="h-4 w-4" /> Hozir Borish
        </Link>
        <button onClick={onReject} title="Boshqa variant"
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white ring-1 ring-slate-200 text-slate-500 hover:text-rose-600 hover:ring-rose-200">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function MetricTile({ icon, label, value, valueClass, tone }: { icon: React.ReactNode; label: string; value: string; valueClass?: string; tone?: "emerald" }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
      <div className="flex items-center gap-2">
        <div className={`grid h-8 w-8 place-items-center rounded-full ${tone === "emerald" ? "bg-emerald-50" : "bg-blue-50"} text-[#1D4ED8]`}>{icon}</div>
        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      </div>
      <div className={`mt-1.5 text-lg font-extrabold ${valueClass ?? "text-slate-900"}`}>{value}</div>
    </div>
  );
}

function AlternativeRow({ candidate, onSkip }: { candidate: AiCandidate; onSkip: () => void }) {
  const { lot } = candidate;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-200/70">
      <img src={lot.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-bold text-slate-900">{lot.name}</div>
          <span className="shrink-0 rounded-md bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#1D4ED8]">#{candidate.rank} tavsiya</span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{candidate.distanceKm.toFixed(1)} km</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{candidate.driveMin} daq</span>
          <span className="inline-flex items-center gap-1 font-semibold text-slate-700">{formatUzs(candidate.totalCostUzs)}</span>
        </div>
      </div>
      <button onClick={onSkip} className="grid h-8 w-8 place-items-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200 hover:text-rose-500" title="O'tkazib yuborish">
        <X className="h-3.5 w-3.5" />
      </button>
      <Link to="/driver/booking" search={{ lot: lot.id }} className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#1D4ED8] ring-1 ring-blue-200">
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
