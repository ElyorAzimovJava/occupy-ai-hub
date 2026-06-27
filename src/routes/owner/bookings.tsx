import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badged } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useBookings, bookingStore, formatUzsPlain, type DriverBooking } from "@/lib/bookingStore";
import { useEffect, useState } from "react";
import { Car, Clock, MapPin, CheckCircle2, XCircle, Hourglass, User, UserPlus, Plus } from "lucide-react";

export const Route = createFileRoute("/owner/bookings")({
  head: () => ({ meta: [{ title: "Bookings - Owner" }] }),
  component: OwnerBookings,
});

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

      <div className="mb-4 flex justify-end">
        <Button onClick={() => setWalkInOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" /> Walk-in driver qo'shish
        </Button>
      </div>

      {walkInOpen && (
        <WalkInDialog onClose={() => setWalkInOpen(false)} />
      )}

      {/* Incoming driver bookings */}
      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500 text-white">
              <Hourglass className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold">Kutilayotgan kelishlar</div>
              <div className="text-xs text-muted-foreground">Driver tomonidan yuborilgan, hali parkingga yetib bormagan</div>
            </div>
          </div>
          <Badged tone="warning">{pending.length} pending</Badged>
        </div>
        {pending.length === 0 ? (
          <div className="rounded-xl border border-dashed border-amber-200 bg-white/60 p-6 text-center text-xs text-muted-foreground">
            Hozircha yangi bron yo'q. Driver ilovasidan bron qilinganda shu yerda ko'rinadi.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {pending.map((b) => (
              <DriverBookingCard key={b.id} b={b} now={now} kind="pending" />
            ))}
          </div>
        )}
      </div>

      {/* Active driver sessions */}
      {active.length > 0 && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold">Faol sessiyalar</div>
                <div className="text-xs text-muted-foreground">Tasdiqlangan va charge bo'layotgan haydovchilar</div>
              </div>
            </div>
            <Badged tone="success">{active.length} live</Badged>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {active.map((b) => (
              <DriverBookingCard key={b.id} b={b} now={now} kind="active" />
            ))}
          </div>
        </div>
      )}

      {/* History from store */}
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Ilgarigi bronlar</div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-4">Bron</th><th className="p-4">Driver</th><th className="p-4">Vehicle</th><th className="p-4">Space</th><th className="p-4 hidden md:table-cell">Davomiyligi</th><th className="p-4">Summa</th><th className="p-4">Status</th></tr></thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-xs text-muted-foreground">Hali tugatilgan bronlar yo'q.</td></tr>
              ) : history.map((b) => {
                const durMin = b.confirmedAt && b.endedAt
                  ? Math.max(0, Math.round((b.endedAt - b.confirmedAt) / 60000)) : 0;
                return (
                  <tr key={b.id} className="border-t border-border hover:bg-muted/30">
                    <td className="p-4 font-mono text-xs">{b.id}</td>
                    <td className="p-4 font-semibold">{b.driverName} {b.walkIn && <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">walk-in</span>}</td>
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
    </div>
  );
}

function pad(n: number) { return String(n).padStart(2, "0"); }

function DriverBookingCard({ b, now, kind }: { b: DriverBooking; now: number; kind: "pending" | "active" }) {
  const waitSec = Math.max(0, Math.floor((now - b.createdAt) / 1000));
  const wm = Math.floor(waitSec / 60);
  const ws = waitSec % 60;

  const elapsedMs = b.confirmedAt ? now - b.confirmedAt : 0;
  const elapsedSec = Math.max(0, Math.floor(elapsedMs / 1000));
  const h = Math.floor(elapsedSec / 3600);
  const m = Math.floor((elapsedSec % 3600) / 60);
  const s = elapsedSec % 60;
  const cost = Math.round((elapsedSec / 3600) * b.rateUzs);

  const [spotInput, setSpotInput] = useState("");
  const [levelInput, setLevelInput] = useState("P1");

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border p-4">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">
          {b.driverInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 truncate text-sm font-bold">
            {b.driverName}
            {b.walkIn && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">walk-in</span>}
          </div>
          <div className="text-xs text-muted-foreground">{b.driverPhone}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bron</div>
          <div className="text-xs font-mono">{b.id}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 text-xs">
        <Field icon={Car} label="Avtomobil" value={`${b.vehicle} · ${b.plate}`} />
        <Field icon={MapPin} label="Spot / Level" value={b.spot ? `${b.spot} · ${b.level || "—"}` : "Hali belgilanmagan"} />
        <Field icon={User} label="Parking" value={b.lotName} />
        <Field icon={Clock} label={kind === "pending" ? "Kutish vaqti" : "Davom etmoqda"}
          value={kind === "pending" ? `${pad(wm)}:${pad(ws)}` : `${pad(h)}:${pad(m)}:${pad(s)}`}
          mono
        />
      </div>

      {kind === "pending" && (
        <div className="border-t border-border bg-amber-50/60 px-4 py-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-700">Bo'sh joyni belgilang</div>
          <div className="flex gap-2">
            <input
              value={spotInput}
              onChange={(e) => setSpotInput(e.target.value.toUpperCase())}
              placeholder="masalan: A-12"
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold tracking-wider outline-none focus:border-amber-500"
            />
            <select
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-semibold outline-none focus:border-amber-500"
            >
              <option>P1</option><option>P2</option><option>P3</option><option>B1</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3">
        {kind === "pending" ? (
          <>
            <div className="text-[11px] text-muted-foreground">
              <div className="font-bold text-amber-600">Tasdiqlanmagan</div>
              <div>Joyni kiriting va tasdiqlang</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { bookingStore.reject(b.id); toast.error("Rad etildi"); }}>
                <XCircle className="mr-1 h-3.5 w-3.5" /> Rad etish
              </Button>
              <Button size="sm" onClick={() => {
                if (!spotInput.trim()) { toast.error("Joyni kiriting (masalan A-12)"); return; }
                bookingStore.confirm(b.id, { spot: spotInput.trim(), level: levelInput });
                toast.success(`Tasdiqlandi: ${spotInput} · ${levelInput} — charge boshlandi`);
              }}>
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Kelganini tasdiqlash
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Hozirgi xarajat</div>
              <div className="text-base font-extrabold text-emerald-600">{formatUzsPlain(cost)} so'm</div>
              <div className="text-[10px] text-muted-foreground">Joy: {b.spot || "—"} · {b.level || "—"}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => { bookingStore.end(b.id); toast("Sessiya tugatildi"); }}>
              Tugatish
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, mono }: { icon: any; label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`mt-0.5 truncate text-sm font-semibold ${mono ? "tabular-nums" : ""}`}>{value}</div>
    </div>
  );
}

function WalkInDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [spot, setSpot] = useState("");
  const [level, setLevel] = useState("P1");
  const [rate, setRate] = useState("15000");

  const submit = () => {
    if (!name.trim() || !plate.trim() || !spot.trim()) {
      toast.error("Ism, davlat raqami va joy kiritilishi shart");
      return;
    }
    const initials = name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
    bookingStore.addWalkIn({
      lotId: "lot-1",
      lotName: "Mening parkingim",
      lotAddress: "—",
      spot: spot.trim().toUpperCase(),
      level,
      driverName: name.trim(),
      driverPhone: phone.trim() || "—",
      driverInitials: initials || "?",
      vehicle: vehicle.trim() || "Avtomobil",
      plate: plate.trim().toUpperCase(),
      rateUzs: Number(rate) || 15000,
    });
    toast.success(`Walk-in qo'shildi: ${name} · ${spot.toUpperCase()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-border p-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#1D4ED8] text-white">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-bold">Walk-in driver qo'shish</div>
            <div className="text-xs text-muted-foreground">App'siz kelgan driverni qo'lda ro'yxatdan o'tkazing</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4">
          <Input2 col={2} label="Driver F.I.Sh" value={name} onChange={setName} placeholder="Aliyev Bekzod" />
          <Input2 label="Telefon" value={phone} onChange={setPhone} placeholder="+998 ..." />
          <Input2 label="Avtomobil" value={vehicle} onChange={setVehicle} placeholder="Chevrolet Cobalt" />
          <Input2 label="Davlat raqami" value={plate} onChange={(v) => setPlate(v.toUpperCase())} placeholder="01 A 123 BC" />
          <Input2 label="Joy (spot)" value={spot} onChange={(v) => setSpot(v.toUpperCase())} placeholder="A-12" />
          <div className="col-span-1">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Qavat</div>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none">
              <option>P1</option><option>P2</option><option>P3</option><option>B1</option>
            </select>
          </div>
          <Input2 col={2} label="Soatlik narx (UZS)" value={rate} onChange={setRate} placeholder="15000" />
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/30 px-4 py-3">
          <div className="text-[11px] text-muted-foreground">Joy bo'sh joylardan olib qo'yiladi va charge darhol boshlanadi.</div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>Bekor qilish</Button>
            <Button size="sm" onClick={submit} className="gap-1"><Plus className="h-3.5 w-3.5" /> Qo'shish</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input2({ label, value, onChange, placeholder, col }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; col?: 1 | 2 }) {
  return (
    <div className={col === 2 ? "col-span-2" : ""}>
      <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#1D4ED8]"
      />
    </div>
  );
}
