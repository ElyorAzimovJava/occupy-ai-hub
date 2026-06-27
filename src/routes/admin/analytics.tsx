import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { occupancySeries, revenueSeries, peakHours } from "@/lib/mockData";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Download, FileSpreadsheet } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Tahlillar - Admin" }] }),
  component: AnalyticsPage,
});

const ctip = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 } as const;

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (<div className="rounded-2xl border border-border bg-card p-5"><h3 className="text-sm font-semibold">{title}</h3><div className="mt-4 h-64">{children}</div></div>);
}

function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Tahlillar" subtitle="Platformadagi bandlik, daromad, bronlar va eng band soatlar."
        actions={<><Button size="sm" variant="outline"><FileSpreadsheet className="mr-1 h-4 w-4" /> CSV</Button><Button size="sm"><Download className="mr-1 h-4 w-4" /> PDF</Button></>} />
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Kunlik bandlik"><ResponsiveContainer><AreaChart data={occupancySeries}><defs><linearGradient id="a1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.488 0.217 264)" stopOpacity={0.6}/><stop offset="100%" stopColor="oklch(0.488 0.217 264)" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} /><XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} /><YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} /><Tooltip contentStyle={ctip} /><Area type="monotone" dataKey="occupancy" stroke="oklch(0.488 0.217 264)" fill="url(#a1)" strokeWidth={2}/></AreaChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Haftalik daromad"><ResponsiveContainer><BarChart data={revenueSeries}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} /><XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} /><YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} /><Tooltip contentStyle={ctip} /><Bar dataKey="revenue" fill="oklch(0.696 0.165 162)" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Bronlar"><ResponsiveContainer><LineChart data={revenueSeries}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} /><XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} /><YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} /><Tooltip contentStyle={ctip} /><Line type="monotone" dataKey="bookings" stroke="oklch(0.78 0.16 80)" strokeWidth={2.5} dot={{r:3}}/></LineChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Eng band soatlar"><ResponsiveContainer><BarChart data={peakHours}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} /><XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} /><YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} /><Tooltip contentStyle={ctip} /><Bar dataKey="value" fill="oklch(0.488 0.217 264)" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></ChartCard>
      </div>
    </div>
  );
}
