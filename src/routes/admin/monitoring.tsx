import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badged, StatusDot } from "@/components/AppShell";
import { mockCameras, mockSlots } from "@/lib/mockData";
import { ParkingGrid, SlotLegend } from "@/components/ParkingGrid";
import { Camera as CameraIcon, Cpu, Activity, Gauge } from "lucide-react";

export const Route = createFileRoute("/admin/monitoring")({
  head: () => ({ meta: [{ title: "Monitoring - Admin" }] }),
  component: () => (
    <div>
      <PageHeader title="Monitoring markazi" subtitle="Platformadagi jonli kamera oqimlari va AI telemetriya." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{l:"Onlayn kameralar",v:"196",t:"success",i:CameraIcon},{l:"Ogohlantirish",v:"7",t:"warning",i:Activity},{l:"Oflayn",v:"3",t:"danger",i:Cpu},{l:"O'rt. kechikish",v:"92ms",t:"info",i:Gauge}].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between"><div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div><s.i className="h-4 w-4 text-muted-foreground" /></div>
            <div className={`mt-2 text-2xl font-bold ${s.t==="danger"?"text-danger":s.t==="warning"?"text-warning":s.t==="success"?"text-success":"text-primary"}`}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {mockCameras.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-video bg-gradient-to-br from-secondary to-sidebar">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent)]" />
              <div className="absolute inset-0 grid place-items-center"><CameraIcon className="h-10 w-10 text-muted-foreground/40" /></div>
              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold backdrop-blur"><StatusDot status={c.status} />{c.status.toUpperCase()}</div>
              <div className="absolute right-3 top-3 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-mono backdrop-blur">{c.latency}ms</div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-foreground/80"><span className="rounded bg-background/80 px-1.5 py-0.5 font-semibold backdrop-blur">{c.name}</span><span className="rounded bg-background/80 px-1.5 py-0.5 backdrop-blur">{(c.accuracy*100).toFixed(0)}% aniqlik</span></div>
            </div>
            <div className="p-4"><div className="flex items-center justify-between text-xs"><div className="text-muted-foreground">{c.lot}</div><Badged tone={c.status==="online"?"success":c.status==="warning"?"warning":"danger"}>{c.detections} aniqlash</Badged></div></div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div><h3 className="text-sm font-semibold">Umumlashtirilgan joylar xaritasi · Tashkent City Mall</h3><p className="text-xs text-muted-foreground">B1-B3 qavatlardagi AI tomonidan aniqlangan bandlik.</p></div>
          <SlotLegend />
        </div>
        <ParkingGrid slots={mockSlots} cols={12} compact />
      </div>
    </div>
  ),
});
