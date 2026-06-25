import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badged } from "@/components/AppShell";
import { Bell, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "Notifications - Admin" }] }),
  component: () => {
    const items = [
      { i: AlertTriangle, t: "Compass Mall - Zone C camera offline", s: "3m ago", tone: "danger" as const },
      { i: CheckCircle2, t: "Magic City Garage - AI accuracy back to 98%", s: "12m ago", tone: "success" as const },
      { i: Info, t: "New owner signup: Park&Go", s: "1h ago", tone: "info" as const },
      { i: Bell, t: "Weekly revenue report is ready", s: "2h ago", tone: "default" as const },
    ];
    return (
      <div>
        <PageHeader title="Notifications" subtitle="Platform alerts, system events, and operator activity." />
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
