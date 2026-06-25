import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badged } from "@/components/AppShell";
import { mockLots } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/lots")({
  head: () => ({ meta: [{ title: "Parking Lots - Admin" }] }),
  component: () => (
    <div>
      <PageHeader title="Parking lots" subtitle="All lots across every operator." actions={<Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add Lot</Button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockLots.map((l) => {
          const free = l.total - l.occupied - l.reserved;
          const occPct = Math.round((l.occupied / l.total) * 100);
          return (
            <div key={l.id} className="overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-xl">
              <div className="relative h-32 overflow-hidden">
                <img src={l.image} alt={l.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute right-3 top-3"><Badged tone={l.status==="active"?"success":l.status==="maintenance"?"warning":"danger"}>{l.status}</Badged></div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0"><h3 className="truncate text-base font-semibold">{l.name}</h3><div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {l.address}</div></div>
                  <div className="text-right"><div className="text-sm font-bold">${l.revenue.toLocaleString()}</div><div className="text-[10px] text-muted-foreground">revenue</div></div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-muted/40 p-2"><div className="font-bold">{l.total}</div><div className="text-muted-foreground">Total</div></div>
                  <div className="rounded-lg bg-danger/10 p-2"><div className="font-bold text-danger">{l.occupied}</div><div className="text-muted-foreground">Occupied</div></div>
                  <div className="rounded-lg bg-success/10 p-2"><div className="font-bold text-success">{free}</div><div className="text-muted-foreground">Free</div></div>
                </div>
                <div className="mt-3"><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${occPct}%` }} /></div><div className="mt-1 text-[10px] text-muted-foreground">{occPct}% occupancy - owner {l.owner}</div></div>
                <div className="mt-4 flex gap-2"><Button size="sm" variant="outline" className="flex-1">Details</Button><Button size="sm" variant="outline">Edit</Button></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ),
});
