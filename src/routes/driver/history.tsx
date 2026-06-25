import { createFileRoute } from "@tanstack/react-router";
import { mockBookings } from "@/lib/mockData";
import { Badged } from "@/components/AppShell";
import { Receipt } from "lucide-react";

export const Route = createFileRoute("/driver/history")({
  head: () => ({ meta: [{ title: "History - Driver" }] }),
  component: () => (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold">History</h1>
      <div className="space-y-3">{mockBookings.map((b) => (
        <div key={b.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Receipt className="h-5 w-5"/></div>
          <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{b.lot ?? "Tashkent City Mall"}</div><div className="text-[11px] text-muted-foreground">Slot {b.space} - {b.time}</div></div>
          <div className="text-right"><div className="text-sm font-bold">${b.amount}</div><Badged tone={b.status==="completed"?"info":b.status==="active"?"success":"warning"}>{b.status}</Badged></div>
        </div>
      ))}</div>
    </div>
  ),
});
