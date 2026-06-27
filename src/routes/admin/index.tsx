import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard, StatusDot, Badged } from "@/components/AppShell";
import { Users, Building2, ParkingSquare, CheckSquare, DollarSign, CarFront, Camera as CameraIcon, Activity } from "lucide-react";
import { occupancySeries, revenueSeries, mockCameras, activityFeed, peakHours } from "@/lib/mockData";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Boshqaruv paneli - Admin - OsonParking" }] }),
  component: AdminDashboard,
});

const ctip = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 } as const;

function AdminDashboard() {
  return (
    <div>
      <PageHeader title="Platform overview" subtitle="What's happening across all operators, lots and drivers right now."
        actions={<><Button variant="outline" size="sm">Last 7 days</Button><Button size="sm">Export report</Button></>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Business Owners" value="48" delta="+3 this week" icon={Users} />
        <StatCard label="Parking Lots" value="240" delta="+12 this month" icon={Building2} tone="success" />
        <StatCard label="Total Spaces" value="18,420" delta="9,210 occupied" icon={ParkingSquare} />
        <StatCard label="Available Now" value="6,148" delta="33% of total" icon={CheckSquare} tone="success" />
        <StatCard label="Revenue (today)" value="$42,180" delta="+18% vs yesterday" icon={DollarSign} tone="success" />
        <StatCard label="Active Drivers" value="3,204" delta="492 booking now" icon={CarFront} />
        <StatCard label="Camera Health" value="96.8%" delta="3 offline" icon={CameraIcon} tone="warning" />
        <StatCard label="AI Calls / hr" value="128.4k" delta="97.2% accuracy" icon={Activity} tone="success" />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">24h Occupancy</h3><span className="text-xs text-muted-foreground">All lots</span></div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={occupancySeries}>
                <defs>
                  <linearGradient id="ao" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.488 0.217 264)" stopOpacity={0.6}/><stop offset="100%" stopColor="oklch(0.488 0.217 264)" stopOpacity={0}/></linearGradient>
                  <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.696 0.165 162)" stopOpacity={0.6}/><stop offset="100%" stopColor="oklch(0.696 0.165 162)" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} />
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} />
                <Tooltip contentStyle={ctip} />
                <Area type="monotone" dataKey="occupancy" stroke="oklch(0.488 0.217 264)" fill="url(#ao)" strokeWidth={2} />
                <Area type="monotone" dataKey="reserved" stroke="oklch(0.696 0.165 162)" fill="url(#ar)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold">Live activity</h3>
          <div className="mt-3 space-y-3">
            {activityFeed.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`mt-1.5 h-2 w-2 rounded-full ${a.tone==="success"?"bg-success":a.tone==="danger"?"bg-danger":"bg-primary"}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm"><span className="font-semibold">{a.who}</span> <span className="text-muted-foreground">{a.what}</span></div>
                  <div className="text-[10px] text-muted-foreground">{a.when}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold">Revenue this week</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <BarChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} />
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} />
                <Tooltip contentStyle={ctip} />
                <Bar dataKey="revenue" fill="oklch(0.488 0.217 264)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold">Peak hours</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <LineChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} />
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} />
                <Tooltip contentStyle={ctip} />
                <Line type="monotone" dataKey="value" stroke="oklch(0.696 0.165 162)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Camera health</h3><Button size="sm" variant="ghost">View all</Button></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockCameras.map((c) => (
            <div key={c.id} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between">
                <div><div className="text-sm font-semibold">{c.name}</div><div className="text-xs text-muted-foreground">{c.lot}</div></div>
                <Badged tone={c.status==="online"?"success":c.status==="warning"?"warning":"danger"}><span className="mr-1"><StatusDot status={c.status} /></span>{c.status}</Badged>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div><div className="text-muted-foreground">Latency</div><div className="font-semibold">{c.latency}ms</div></div>
                <div><div className="text-muted-foreground">Accuracy</div><div className="font-semibold">{(c.accuracy*100).toFixed(0)}%</div></div>
                <div><div className="text-muted-foreground">Detects</div><div className="font-semibold">{c.detections}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
