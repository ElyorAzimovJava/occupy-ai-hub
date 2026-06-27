import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badged } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useBookings, bookingStore, formatUzsPlain, type DriverBooking } from "@/lib/bookingStore";
import { useEffect, useState } from "react";
import {
  Car, Clock, MapPin, CheckCircle2, XCircle, Hourglass, User, UserPlus, Plus,
  Phone, CircleParking, Wallet, Sparkles, ChevronRight,
} from "lucide-react";
import { SpotPicker } from "@/components/SpotPicker";

export const Route = createFileRoute("/owner/bookings")({
  head: () => ({ meta: [{ title: "Bookings - Owner" }] }),
  component: OwnerBookings,
});

const DEFAULT_LOT_ID = "lot-1";
const DEFAULT_LOT_NAME = "Mening parkingim";

function OwnerBookings() {
  const driverBookings = useBookings();
  const [now, setNow] = useState(() => Date.now());
  const [walkInOpen, setWalkInOpen] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const pending = driverBookings.filter((b) => b.status === "pending");
  const active = driverBookings.filter((b) => b.status === "active");
  const history = driverBookings.filter((b) => b.status === "completed" || b.status === "cancelled");

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="App orqali kelgan bronlarni tasdiqlang yoki app'siz kelgan driverni qo'lda qo'shing."
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <KpiChip tone="amber" icon={Hourglass} label="Kutilmoqda" value={pending.length} />
          <KpiChip tone="emerald" icon={CheckCircle2} label="Faol" value={active.length} />
          <KpiChip tone="slate" icon={Clock} label="Tarix" value={history.length} />
        </div>
        <Button onClick={() => setWalkInOpen(true)} className="gap-2 bg-[#1D4ED8] hover:bg-blue-700">
          <UserPlus className="h-4 w-4" /> Walk-in qo'shish
        </Button>
      </div>

      {walkInOpen && <WalkInDialog onClose={() => setWalkInOpen(false)} />}

      {/* Pending */}
      <section className="mb-6">
        <SectionHeader
          icon={<Hourglass className="h-4 w-4" />}
          tone="amber"
          title="Kutilayotgan kelishlar"
          sub="Driver tomonidan yuborilgan, hali parkingga yetib bormagan"
          rightBadge={`${pending.length} pending`}
        />
        {pending.length === 0 ? (
          <EmptyCard text="Hozircha yangi bron yo'q. Driver ilovasidan bron qilinganda shu yerda paydo bo'ladi." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {pending.map((b) => <DriverBookingCard key={b.id} b={b} now={now} kind="pending" />)}
          </div>
        )}
      </section>

      {/* Active */}
      {active.length > 0 && (
        <section className="mb-6">
          <SectionHeader
            icon={<CheckCircle2 className="h-4 w-4" />}
            tone="emerald"
            title="Faol sessiyalar"
            sub="Tasdiqlangan va charge bo'layotgan haydovchilar"
            rightBadge={`${active.length} live`}
          />
          <div className="grid gap-3 md:grid-cols-2">
            {active.map((b) => <DriverBookingCard key={b.id} b={b} now={now} kind="active" />)}
          </div>
        </section>
      )}

      {/* History */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Ilgarigi bronlar</h2>
          <div className="text-[11px] text-muted-foreground">{history.length} ta yozuv</div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4">Bron</th>
                  <th className="p-4">Driver</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Space</th>
                  <th className="p-4 hidden md:table-cell">Davomiyligi</th>
                  <th className="p-4">Summa</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-xs text-muted-foreground">Hali tugatilgan bronlar yo'q.</td></tr>
                ) : history.map((b) => {
                  const durMin = b.confirmedAt && b.endedAt
                    ? Math.max(0, Math.round((b.endedAt - b.confirmedAt) / 60000)) : 0;
                  return (
                    <tr key={b.id} className="border-t border-border hover:bg-muted/30">
                      <td className="p-4 font-mono text-xs">{b.id}</td>
                      <td className="p-4 font-semibold">
                        <div className="flex items-center gap-1.5">
                          {b.driverName}
                          {b.walkIn && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">walk-in</span>}
                        </div>
                      </td>
                      <td className="p-4 font-mono">{b.plate}</td>
                      <td className="p-4">{b.spot || "—"}</td>
                      <td className="p-4 hidden md:table-cell text-muted-foreground">{Math.floor(durMin/60)}s {durMin%60}d</td>
                      <td className="p-4 font-semibold">{formatUzsPlain(b.amountUzs || 0)} so'm</td>
                      <td className="p-4"><Badged tone={b.status === "completed" ? "info" : "danger"}>{b.status}</Badged></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function pad(n: number) { return String(n).padStart(2, "0"); }

function DriverBookingCard({ b, now, kind }: { b: DriverBooking; now: number; kind: "pending" | "active" }) {
  const waitSec = Math.max(0, Math.floor((now - b.createdAt) / 1000));
  const wm = Math.floor(waitSec / 60);
  const ws = waitSec % 60;
  const elapsedSec = b.confirmedAt ? Math.max(0, Math.floor((now - b.confirmedAt) / 1000)) : 0;
  const h = Math.floor(elapsedSec / 3600);
  const m = Math.floor((elapsedSec % 3600) / 60);
  const s = elapsedSec % 60;
  const cost = Math.round((elapsedSec / 3600) * b.rateUzs);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [assigned, setAssigned] = useState<{ spot: string; level: string } | null>(null);

  const onPickerConfirm = (spot: string, level: string) => {
    setAssigned({ spot, level });
    setPickerOpen(false);
  };

  return (
    <div className={`overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md ${
      kind === "pending" ? "border-amber-300/40" : "border-emerald-300/40"
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border p-4">
        <div className={`grid h-11 w-11 place-items-center rounded-full text-sm font-bold ring-2 ${
          kind === "pending" ? "bg-amber-500/15 text-amber-700 ring-amber-300/40 dark:text-amber-300" : "bg-emerald-500/15 text-emerald-700 ring-emerald-300/40 dark:text-emerald-300"
        }`}>
          {b.driverInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 truncate text-sm font-bold">
            {b.driverName}
            {b.walkIn && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">walk-in</span>}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" /> {b.driverPhone}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bron</div>
          <div className="text-xs font-mono">{b.id}</div>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-3 p-4 text-xs">
        <Field icon={Car} label="Avtomobil" value={b.vehicle} sub={b.plate} />
        <Field icon={MapPin} label="Parking" value={b.lotName} sub={b.lotAddress} />
        <Field icon={CircleParking} label="Joy / Qavat"
          value={kind === "pending" ? (assigned ? `${assigned.spot} · ${assigned.level}` : "Belgilanmagan") : `${b.spot || "—"} · ${b.level || "—"}`}
        />
        <Field icon={Clock} label={kind === "pending" ? "Kutish" : "Davom etmoqda"}
          value={kind === "pending" ? `${pad(wm)}:${pad(ws)}` : `${pad(h)}:${pad(m)}:${pad(s)}`}
          mono
        />
      </div>

      {/* Footer */}
      {kind === "pending" ? (
        <>
          <div className="flex items-center justify-between border-t border-border bg-amber-50/60 px-4 py-3 dark:bg-amber-500/5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Joyni belgilang</div>
              <div className="text-[11px] text-muted-foreground">Driver kelganida tasdiqlang</div>
            </div>
            <button
              onClick={() => setPickerOpen(true)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                assigned
                  ? "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25 dark:text-emerald-300"
                  : "bg-[#1D4ED8] text-white shadow-md shadow-blue-500/30 hover:bg-blue-700"
              }`}
            >
              <CircleParking className="h-3.5 w-3.5" />
              {assigned ? `${assigned.spot} · ${assigned.level}` : "Joyni tanlash"}
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-4 py-3">
            <Button size="sm" variant="ghost" onClick={() => { bookingStore.reject(b.id); toast.error("Rad etildi"); }}>
              <XCircle className="mr-1 h-3.5 w-3.5" /> Rad etish
            </Button>
            <Button
              size="sm"
              className="bg-[#1D4ED8] hover:bg-blue-700"
              onClick={() => {
                if (!assigned) { toast.error("Avval joyni tanlang"); return; }
                bookingStore.confirm(b.id, assigned);
                toast.success(`Tasdiqlandi: ${assigned.spot} · ${assigned.level}`);
              }}
            >
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Kelganini tasdiqlash
            </Button>
          </div>
          {pickerOpen && (
            <SpotPicker
              open
              lotId={b.lotId}
              lotName={b.lotName}
              level={assigned?.level || b.level || "P1"}
              onClose={() => setPickerOpen(false)}
              onConfirm={onPickerConfirm}
            />
          )}
        </>
      ) : (
        <div className="flex items-center justify-between border-t border-border bg-emerald-50/60 px-4 py-3 dark:bg-emerald-500/5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Hozirgi xarajat</div>
            <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{formatUzsPlain(cost)} so'm</div>
          </div>
          <Button size="sm" variant="outline" onClick={() => { bookingStore.end(b.id); toast("Sessiya tugatildi"); }}>
            Tugatish
          </Button>
        </div>
      )}
    </div>
  );
}

function Field({ icon: Icon, label, value, sub, mono }: { icon: any; label: string; value: string; sub?: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`mt-0.5 truncate text-sm font-semibold ${mono ? "tabular-nums" : ""}`}>{value}</div>
      {sub && <div className="truncate text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function SectionHeader({ icon, tone, title, sub, rightBadge }: { icon: React.ReactNode; tone: "amber" | "emerald"; title: string; sub: string; rightBadge: string }) {
  const cls = tone === "amber" ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className={`grid h-9 w-9 place-items-center rounded-xl text-white shadow-md ${cls}`}>{icon}</div>
        <div>
          <div className="text-sm font-extrabold">{title}</div>
          <div className="text-xs text-muted-foreground">{sub}</div>
        </div>
      </div>
      <Badged tone={tone === "amber" ? "warning" : "success"}>{rightBadge}</Badged>
    </div>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border bg-card/40 p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Hourglass className="h-5 w-5" />
      </div>
      <div className="mt-3 text-xs text-muted-foreground">{text}</div>
    </div>
  );
}

function KpiChip({ tone, icon: Icon, label, value }: { tone: "amber" | "emerald" | "slate"; icon: any; label: string; value: number }) {
  const cls =
    tone === "amber" ? "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300" :
    tone === "emerald" ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300" :
    "bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:text-slate-300";
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${cls}`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="font-extrabold tabular-nums">{value}</span>
      <span className="opacity-80">{label}</span>
    </div>
  );
}

/* ============================================================
   Walk-in dialog
   ============================================================ */

function WalkInDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [spot, setSpot] = useState("");
  const [level, setLevel] = useState("P1");
  const [rate, setRate] = useState("15000");
  const [pickerOpen, setPickerOpen] = useState(false);

  const valid = name.trim() && plate.trim() && spot.trim();

  const submit = () => {
    if (!valid) { toast.error("Ism, davlat raqami va joy kerak"); return; }
    const initials = name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
    bookingStore.addWalkIn({
      lotId: DEFAULT_LOT_ID,
      lotName: DEFAULT_LOT_NAME,
      lotAddress: "—",
      spot: spot.toUpperCase(),
      level,
      driverName: name.trim(),
      driverPhone: phone.trim() || "—",
      driverInitials: initials || "?",
      vehicle: vehicle.trim() || "Avtomobil",
      plate: plate.toUpperCase(),
      rateUzs: Number(rate) || 15000,
    });
    toast.success(`Walk-in qo'shildi: ${name} · ${spot.toUpperCase()}`);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-[#1D4ED8]/15 via-transparent to-transparent p-5">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1D4ED8] text-white shadow-lg shadow-blue-500/30">
              <UserPlus className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#1D4ED8]">Yangi yozuv</div>
              <div className="text-lg font-extrabold">Walk-in driver qo'shish</div>
              <div className="text-xs text-muted-foreground">App'siz kelgan driverni qo'lda ro'yxatdan o'tkazing</div>
            </div>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <XCircle className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-5 p-5">
            <Group title="Haydovchi" icon={<User className="h-4 w-4" />}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Field2 label="F.I.Sh" value={name} onChange={setName} placeholder="Aliyev Bekzod" required />
                <Field2 label="Telefon" value={phone} onChange={setPhone} placeholder="+998 90 ..." />
              </div>
            </Group>

            <Group title="Avtomobil" icon={<Car className="h-4 w-4" />}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Field2 label="Model" value={vehicle} onChange={setVehicle} placeholder="Chevrolet Cobalt" />
                <Field2 label="Davlat raqami" value={plate} onChange={(v) => setPlate(v.toUpperCase())} placeholder="01 A 123 BC" mono required />
              </div>
            </Group>

            <Group title="Parking joyi" icon={<CircleParking className="h-4 w-4" />}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                <button
                  onClick={() => setPickerOpen(true)}
                  className={`flex items-center justify-between rounded-xl border-2 border-dashed px-4 py-3 text-left transition ${
                    spot ? "border-[#1D4ED8] bg-[#1D4ED8]/5" : "border-border hover:border-[#1D4ED8] hover:bg-muted/40"
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Joy va qavat</div>
                    <div className={`mt-0.5 text-base font-extrabold ${spot ? "text-[#1D4ED8]" : "text-muted-foreground"}`}>
                      {spot ? `${spot} · ${level}` : "Joyni tanlash"}
                    </div>
                  </div>
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#1D4ED8] text-white">
                    <CircleParking className="h-4 w-4" />
                  </div>
                </button>
                <div className="md:w-40">
                  <Field2 label="Soatlik (UZS)" value={rate} onChange={setRate} placeholder="15000" mono prefix={<Wallet className="h-3.5 w-3.5" />} />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-[#1D4ED8]" />
                Joy bo'sh joylardan olib qo'yiladi va charge darhol boshlanadi.
              </div>
            </Group>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/40 px-5 py-4">
            <Button variant="ghost" onClick={onClose}>Bekor qilish</Button>
            <Button onClick={submit} disabled={!valid} className="gap-1.5 bg-[#1D4ED8] hover:bg-blue-700 disabled:opacity-40">
              <Plus className="h-4 w-4" /> Qo'shish va boshlash
            </Button>
          </div>
        </div>
      </div>

      {pickerOpen && (
        <SpotPicker
          open
          lotId={DEFAULT_LOT_ID}
          lotName={DEFAULT_LOT_NAME}
          level={level}
          onClose={() => setPickerOpen(false)}
          onConfirm={(s, lv) => { setSpot(s); setLevel(lv); setPickerOpen(false); }}
        />
      )}
    </>
  );
}

function Group({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function Field2({
  label, value, onChange, placeholder, required, mono, prefix,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  required?: boolean; mono?: boolean; prefix?: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}{required && <span className="text-rose-500">*</span>}
      </div>
      <div className={`flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5 transition focus-within:border-[#1D4ED8] focus-within:ring-2 focus-within:ring-[#1D4ED8]/20 ${
        value ? "border-border" : "border-border"
      }`}>
        {prefix && <span className="text-muted-foreground">{prefix}</span>}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground/60 ${mono ? "tabular-nums tracking-wider" : ""}`}
        />
      </div>
    </label>
  );
}
