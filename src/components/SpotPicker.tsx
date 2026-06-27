import { useMemo, useState } from "react";
import { X, MapPin, Check, Car, Ban, Clock, CircleParking } from "lucide-react";

type SpotStatus = "available" | "occupied" | "reserved" | "disabled";
type Spot = { id: string; label: string; status: SpotStatus; section: string; row: number; col: number };

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

const SECTIONS = ["A", "B", "C"] as const;
const COLS = 8;
const ROWS_PER_SECTION = 3;

function buildLayout(lotId: string, level: string): Spot[] {
  const rand = mulberry32(hashSeed(`${lotId}:${level}`));
  const out: Spot[] = [];
  for (const sec of SECTIONS) {
    for (let r = 0; r < ROWS_PER_SECTION; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = rand();
        let status: SpotStatus = "available";
        if (x < 0.42) status = "occupied";
        else if (x < 0.55) status = "reserved";
        else if (x > 0.96) status = "disabled";
        out.push({
          id: `${sec}-${r * COLS + c + 1}`,
          label: `${sec}${r * COLS + c + 1}`,
          status,
          section: sec,
          row: r,
          col: c,
        });
      }
    }
  }
  return out;
}

export function SpotPicker({
  open, lotId, lotName, level: initialLevel, onClose, onConfirm,
}: {
  open: boolean;
  lotId: string;
  lotName: string;
  level?: string;
  onClose: () => void;
  onConfirm: (spot: string, level: string) => void;
}) {
  const [level, setLevel] = useState(initialLevel || "P1");
  const [selected, setSelected] = useState<string | null>(null);

  const layout = useMemo(() => buildLayout(lotId, level), [lotId, level]);
  const stats = useMemo(() => {
    const a = layout.filter((s) => s.status === "available").length;
    const o = layout.filter((s) => s.status === "occupied").length;
    const r = layout.filter((s) => s.status === "reserved").length;
    return { available: a, occupied: o, reserved: r, total: layout.length };
  }, [layout]);

  if (!open) return null;

  const onPick = (s: Spot) => {
    if (s.status !== "available") return;
    setSelected(s.label);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-border bg-gradient-to-r from-[#1D4ED8]/10 via-transparent to-transparent p-5">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1D4ED8] text-white shadow-lg shadow-blue-500/30">
            <CircleParking className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1D4ED8]">Joyni tanlash</div>
            <div className="truncate text-lg font-extrabold text-foreground">{lotName}</div>
            <div className="mt-0.5 flex items-center gap-1 text-[12px] text-muted-foreground">
              <MapPin className="h-3 w-3" /> Parking strukturasi · Real vaqt
            </div>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Floor selector + stats */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3">
          <div className="flex items-center gap-1 rounded-xl bg-background p-1 ring-1 ring-border">
            {(["P1", "P2", "P3", "B1"] as const).map((lv) => (
              <button
                key={lv}
                onClick={() => { setLevel(lv); setSelected(null); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  level === lv ? "bg-[#1D4ED8] text-white shadow" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lv}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <StatPill tone="emerald" value={stats.available} label="bo'sh" />
            <StatPill tone="rose" value={stats.occupied} label="band" />
            <StatPill tone="amber" value={stats.reserved} label="zahira" />
          </div>
        </div>

        {/* Lot grid */}
        <div className="flex-1 overflow-auto p-5">
          <div className="rounded-2xl bg-gradient-to-b from-slate-100/40 to-slate-200/30 p-5 ring-1 ring-border dark:from-slate-800/40 dark:to-slate-900/30">
            <div className="mb-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-12 bg-muted-foreground/30" />
              KIRISH
              <span className="h-px w-12 bg-muted-foreground/30" />
            </div>

            {SECTIONS.map((sec, i) => (
              <div key={sec} className="mb-3 last:mb-0">
                <div className="mb-2 flex items-center gap-2">
                  <div className="grid h-6 w-6 place-items-center rounded-md bg-[#1D4ED8]/15 text-[11px] font-extrabold text-[#1D4ED8]">{sec}</div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Zona {sec}</div>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
                  {layout.filter((s) => s.section === sec).map((s) => (
                    <SpotCell key={s.id} spot={s} selected={selected === s.label} onClick={() => onPick(s)} />
                  ))}
                </div>
                {i < SECTIONS.length - 1 && (
                  <div className="mt-3 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
                    <span className="h-[2px] flex-1 bg-[repeating-linear-gradient(90deg,currentColor_0_8px,transparent_8px_18px)] opacity-40" />
                    <span className="px-3">YO'L</span>
                    <span className="h-[2px] flex-1 bg-[repeating-linear-gradient(90deg,currentColor_0_8px,transparent_8px_18px)] opacity-40" />
                  </div>
                )}
              </div>
            ))}

            {/* Legend */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-[11px]">
              <Legend swatch="bg-emerald-500" label="Bo'sh" />
              <Legend swatch="bg-rose-500" label="Band" />
              <Legend swatch="bg-amber-500" label="Zahira" />
              <Legend swatch="bg-slate-400" label="Yopiq" />
              <Legend swatch="bg-[#1D4ED8] ring-2 ring-[#1D4ED8]/30" label="Tanlangan" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className={`grid h-12 w-12 place-items-center rounded-xl text-sm font-extrabold transition ${
              selected ? "bg-[#1D4ED8] text-white shadow-lg shadow-blue-500/30" : "bg-muted text-muted-foreground"
            }`}>
              {selected || "—"}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tanlangan joy</div>
              <div className="text-sm font-bold text-foreground">
                {selected ? `${selected} · ${level}` : "Joyni tanlang"}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted">
              Bekor
            </button>
            <button
              disabled={!selected}
              onClick={() => selected && onConfirm(selected, level)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1D4ED8] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              <Check className="h-4 w-4" /> Tasdiqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpotCell({ spot, selected, onClick }: { spot: Spot; selected: boolean; onClick: () => void }) {
  const base = "relative aspect-[1.05/1] rounded-lg text-[10px] font-bold transition flex items-center justify-center select-none";
  if (selected) {
    return (
      <button onClick={onClick} className={`${base} scale-105 bg-[#1D4ED8] text-white shadow-lg shadow-blue-500/40 ring-2 ring-[#1D4ED8]/30`}>
        <Check className="h-3.5 w-3.5" />
        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] tracking-wider opacity-90">{spot.label}</span>
      </button>
    );
  }
  if (spot.status === "available") {
    return (
      <button onClick={onClick} className={`${base} bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30 hover:scale-105 hover:bg-emerald-500/25 hover:ring-emerald-500/60 dark:text-emerald-300`}>
        {spot.label}
      </button>
    );
  }
  if (spot.status === "occupied") {
    return (
      <div className={`${base} cursor-not-allowed bg-rose-500/15 text-rose-700 ring-1 ring-rose-500/30 dark:text-rose-300`}>
        <Car className="h-3.5 w-3.5 opacity-70" />
      </div>
    );
  }
  if (spot.status === "reserved") {
    return (
      <div className={`${base} cursor-not-allowed bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/30 dark:text-amber-300`}>
        <Clock className="h-3.5 w-3.5 opacity-70" />
      </div>
    );
  }
  return (
    <div className={`${base} cursor-not-allowed bg-slate-300/20 text-slate-400 ring-1 ring-slate-400/30 line-through`}>
      <Ban className="h-3.5 w-3.5 opacity-50" />
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${swatch}`} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function StatPill({ tone, value, label }: { tone: "emerald" | "rose" | "amber"; value: number; label: string }) {
  const cls =
    tone === "emerald" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" :
    tone === "rose" ? "bg-rose-500/15 text-rose-700 dark:text-rose-300" :
    "bg-amber-500/15 text-amber-700 dark:text-amber-300";
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${cls}`}>
      <span className="font-extrabold tabular-nums">{value}</span>
      <span className="text-[10px] uppercase tracking-wider opacity-80">{label}</span>
    </div>
  );
}
