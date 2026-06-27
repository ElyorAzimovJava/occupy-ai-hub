import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard, Badged, StatusDot } from "@/components/AppShell";
import { ParkingSquare, CheckSquare, CalendarClock, DollarSign, TrendingUp, Ticket } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { occupancySeries, mockLots } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { useCurrentOwner } from "@/lib/session";
import { useBookings } from "@/lib/bookingStore";
import { Hourglass } from "lucide-react";

export const Route = createFileRoute("/owner/")({
  head: () => ({ meta: [{ title: "Boshqaruv paneli - Egasi" }] }),
  component: OwnerDashboard,
});

const ctip = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 } as const;

function OwnerDashboard() {
  const owner = useCurrentOwner();
  const lot = mockLots.find((l) => l.id === owner.lotId) ?? mockLots[0];
  const all = useBookings().filter((b) => b.lotId === owner.lotId);
  const free = Math.max(0, lot.total - lot.occupied - lot.reserved);
  const live = all.filter((b) => b.status === "active" || b.status === "pending").slice(0, 6);
  return (
    <div>
      <PageHeader title={lot.name} subtitle={`${lot.address} · ${lot.total} ta joy · AI vision faol`} actions={<Button size="sm">Yangi bron</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Jami joylar" value={String(lot.total)} icon={ParkingSquare} />
        <StatCard label="Band" value={String(lot.occupied)} delta={`${Math.round(lot.occupied / lot.total * 100)}%`} icon={ParkingSquare} tone="warning" />
        <StatCard label="Bron qilingan" value={String(lot.reserved)} icon={CalendarClock} />
        <StatCard label="Boʻsh" value={String(free)} delta={`${Math.round(free / lot.total * 100)}%`} icon={CheckSquare} tone="success" />
        <StatCard label="Kutilmoqda" value={String(all.filter((b) => b.status === "pending").length)} icon={Hourglass} tone="warning" />
        <StatCard label="Bu oy" value={`$${(lot.revenue/1000).toFixed(1)}k`} delta="oygа +12%" icon={TrendingUp} tone="success" />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Bugungi bandlik</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={occupancySeries}>
                <defs><linearGradient id="oo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.488 0.217 264)" stopOpacity={0.6}/><stop offset="100%" stopColor="oklch(0.488 0.217 264)" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1}/>
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3}/>
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3}/>
                <Tooltip contentStyle={ctip}/>
                <Area type="monotone" dataKey="occupancy" stroke="oklch(0.488 0.217 264)" fill="url(#oo)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold">Jonli bronlar</h3>
          <div className="mt-3 space-y-2">
            {live.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                Hozircha faol bron yo'q
              </div>
            )}
            {live.map((b) => (
              <div key={b.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><Ticket className="h-4 w-4"/></div>
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{b.driverName}</div><div className="text-xs text-muted-foreground">{b.plate} · {b.spot || "—"}</div></div>
                <Badged tone={b.status==="active"?"success":"warning"}><span className="mr-1"><StatusDot status={b.status==="active"?"online":"warning"}/></span>{b.status}</Badged>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
