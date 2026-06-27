import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badged } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { mockBookings } from "@/lib/mockData";
import { toast } from "sonner";
import { useBookings, bookingStore, formatUzsPlain, type DriverBooking } from "@/lib/bookingStore";
import { useEffect, useState } from "react";
import { Car, Clock, MapPin, CheckCircle2, XCircle, Hourglass, User } from "lucide-react";

export const Route = createFileRoute("/owner/bookings")({
  head: () => ({ meta: [{ title: "Bookings - Owner" }] }),
  component: OwnerBookings,
});

function OwnerBookings() {
  const driverBookings = useBookings();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const pending = driverBookings.filter((b) => b.status === "pending");
  const active = driverBookings.filter((b) => b.status === "active");

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Yangi haydovchi bronlarini tasdiqlang. Charge faqat siz tasdiqlagandan keyin boshlanadi."
      />

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

      {/* Legacy table */}
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Ilgarigi bronlar</div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-4">Driver</th><th className="p-4">Vehicle</th><th className="p-4">Space</th><th className="p-4 hidden md:table-cell">Time</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
            <tbody>
              {mockBookings.map((b) => (
                <tr key={b.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4 font-semibold">{b.driver}</td>
                  <td className="p-4 font-mono">{b.plate}</td>
                  <td className="p-4">{b.space}</td>
                  <td className="p-4 hidden md:table-cell text-muted-foreground">{b.start} - {b.end}</td>
                  <td className="p-4"><Badged tone={b.status==="active"?"success":b.status==="pending"?"warning":b.status==="completed"?"info":"danger"}>{b.status}</Badged></td>
                  <td className="p-4 text-right"><div className="flex justify-end gap-2">{b.status === "pending" && (<><Button size="sm" variant="outline" onClick={() => toast.success("Approved")}>Approve</Button><Button size="sm" variant="ghost" onClick={() => toast.error("Rejected")}>Reject</Button></>)}{b.status === "active" && (<><Button size="sm" variant="outline" onClick={() => toast("Extended")}>Extend</Button><Button size="sm" variant="ghost" onClick={() => toast.error("Cancelled")}>Cancel</Button></>)}</div></td>
                </tr>
              ))}
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

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border p-4">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">
          {b.driverInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">{b.driverName}</div>
          <div className="text-xs text-muted-foreground">{b.driverPhone}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bron</div>
          <div className="text-xs font-mono">{b.id}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 text-xs">
        <Field icon={Car} label="Avtomobil" value={`${b.vehicle} · ${b.plate}`} />
        <Field icon={MapPin} label="Spot / Level" value={`${b.spot} · ${b.level}`} />
        <Field icon={User} label="Parking" value={b.lotName} />
        <Field icon={Clock} label={kind === "pending" ? "Kutish vaqti" : "Davom etmoqda"}
          value={kind === "pending" ? `${pad(wm)}:${pad(ws)}` : `${pad(h)}:${pad(m)}:${pad(s)}`}
          mono
        />
      </div>

      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3">
        {kind === "pending" ? (
          <>
            <div className="text-[11px] text-muted-foreground">
              <div className="font-bold text-amber-600">Tasdiqlanmagan</div>
              <div>Driver kelganini ko'rsangiz tasdiqlang</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { bookingStore.reject(b.id); toast.error("Rad etildi"); }}>
                <XCircle className="mr-1 h-3.5 w-3.5" /> Rad etish
              </Button>
              <Button size="sm" onClick={() => { bookingStore.confirm(b.id); toast.success("Tasdiqlandi - charge boshlandi"); }}>
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Kelganini tasdiqlash
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Hozirgi xarajat</div>
              <div className="text-base font-extrabold text-emerald-600">{formatUzsPlain(cost)} so'm</div>
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
