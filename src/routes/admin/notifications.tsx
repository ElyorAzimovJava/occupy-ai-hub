import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badged } from "@/components/AppShell";
import { Bell, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "Bildirishnomalar - Admin" }] }),
  component: () => {
    const items = [
      { i: AlertTriangle, t: "Compass Mall — C zonasi kamerasi oflayn", s: "3 daq oldin", tone: "danger" as const },
      { i: CheckCircle2, t: "Magic City Garage — AI aniqligi 98% ga qaytdi", s: "12 daq oldin", tone: "success" as const },
      { i: Info, t: "Yangi egasi royxatdan otdi: Park&Go", s: "1 soat oldin", tone: "info" as const },
      { i: Bell, t: "Haftalik daromad hisoboti tayyor", s: "2 soat oldin", tone: "default" as const },
    ];
    return (
      <div>
        <PageHeader title="Bildirishnomalar" subtitle="Platforma ogohlantirishlari, tizim hodisalari va operator faoliyati." />
        <div className="space-y-3">
          {items.map((n, idx) => (
            <div key={idx} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${n.tone==="danger"?"bg-danger/10 text-danger":n.tone==="success"?"bg-success/10 text-success":n.tone==="info"?"bg-primary/10 text-primary":"bg-muted text-muted-foreground"}`}><n.i className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{n.t}</div><div className="text-xs text-muted-foreground">{n.s}</div></div>
              <Badged tone={n.tone === "default" ? "info" : n.tone}>{n.tone}</Badged>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
