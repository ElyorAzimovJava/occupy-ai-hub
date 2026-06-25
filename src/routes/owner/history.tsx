import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { revenueSeries } from "@/lib/mockData";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const Route = createFileRoute("/owner/history")({
  head: () => ({ meta: [{ title: "History - Owner" }] }),
  component: () => (
    <div>
      <PageHeader title="Operating history" subtitle="Occupancy, revenue, reservations and AI logs." actions={<Button size="sm" variant="outline"><Download className="mr-1 h-4 w-4"/>Export</Button>} />
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold">Revenue / bookings</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <BarChart data={revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1}/>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3}/>
              <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3}/>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}/>
              <Bar dataKey="revenue" fill="oklch(0.488 0.217 264)" radius={[6,6,0,0]}/>
              <Bar dataKey="bookings" fill="oklch(0.696 0.165 162)" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  ),
});
