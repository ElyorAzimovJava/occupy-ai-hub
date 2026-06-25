import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard, Badged, StatusDot } from "@/components/AppShell";
import { ParkingSquare, CheckSquare, CalendarClock, DollarSign, TrendingUp, Ticket } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { occupancySeries, mockBookings } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/owner/")({
  head: () => ({ meta: [{ title: "Dashboard - Owner" }] }),
  component: OwnerDashboard,
});

const ctip = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 } as const;

function OwnerDashboard() {
  return (
    <div>
      <PageHeader title="Tashkent City Mall" subtitle="3 floors - 420 spaces - AI vision live" actions={<Button size="sm">New booking</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Spaces" value="420" icon={ParkingSquare} />
        <StatCard label="Occupied" value="284" delta="68%" icon={ParkingSquare} tone="warning" />
        <StatCard label="Reserved" value="42" icon={CalendarClock} />
        <StatCard label="Available" value="94" delta="22%" icon={CheckSquare} tone="success" />
        <StatCard label="Today" value="$1,840" icon={DollarSign} tone="success" />
        <StatCard label="This month" value="$48.2k" delta="+12% MoM" icon={TrendingUp} tone="success" />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Today's occupancy</h3>
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
          <h3 className="text-sm font-semibold">Live bookings</h3>
          <div className="mt-3 space-y-2">
            {mockBookings.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><Ticket className="h-4 w-4"/></div>
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{b.driver}</div><div className="text-xs text-muted-foreground">{b.plate} - Slot {b.space}</div></div>
                <Badged tone={b.status==="active"?"success":b.status==="pending"?"warning":b.status==="completed"?"info":"danger"}><span className="mr-1"><StatusDot status={b.status==="active"?"online":b.status==="pending"?"warning":"offline"}/></span>{b.status}</Badged>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
