import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badged, StatusDot } from "@/components/AppShell";
import { ParkingGrid, SlotLegend } from "@/components/ParkingGrid";
import { mockSlots, mockCameras } from "@/lib/mockData";
import { Camera as CameraIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/owner/live")({
  head: () => ({ meta: [{ title: "Live Monitoring - Owner" }] }),
  component: LivePage,
});

function LivePage() {
  const [slots, setSlots] = useState(mockSlots);
  useEffect(() => {
    const t = setInterval(() => {
      setSlots((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        const next = [...prev];
        const cur = next[idx].status;
        next[idx] = { ...next[idx], status: cur === "available" ? "occupied" : "available" };
        return next;
      });
    }, 2200);
    return () => clearInterval(t);
  }, []);
  const detections = [
    { plate: "01A 234 BX", conf: 0.98, slot: "A-12", at: "just now" },
    { plate: "30T 010 KA", conf: 0.94, slot: "B-04", at: "12s ago" },
    { plate: "85B 998 ZZ", conf: 0.89, slot: "C-21", at: "1m ago" },
    { plate: "10X 444 QU", conf: 0.97, slot: "A-07", at: "2m ago" },
  ];
  return (
    <div>
      <PageHeader title="Live monitoring" subtitle="Real-time AI vision telemetry, slot occupancy and plate detections." actions={<Badged tone="success"><span className="mr-1"><StatusDot status="online"/></span>Streaming</Badged>} />
      <div className="grid gap-5 lg:grid-cols-3">
        {mockCameras.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-video bg-gradient-to-br from-secondary to-sidebar">
              <div className="absolute inset-0 grid place-items-center"><CameraIcon className="h-10 w-10 text-muted-foreground/40"/></div>
              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold backdrop-blur"><StatusDot status={c.status}/>LIVE</div>
              <div className="absolute right-3 top-3 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-mono backdrop-blur">{c.latency}ms</div>
            </div>
            <div className="p-3 text-xs"><div className="font-semibold">{c.name}</div><div className="text-muted-foreground">{c.lot}</div></div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-card p-5"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold">Slot map</h3><SlotLegend/></div><ParkingGrid slots={slots} cols={12}/></div>
        <div className="rounded-2xl border border-border bg-card p-5"><h3 className="text-sm font-semibold">License plate feed</h3><div className="mt-3 space-y-2">{detections.map((d) => (<div key={d.plate} className="rounded-xl border border-border p-3"><div className="flex items-center justify-between"><div className="font-mono text-sm font-bold">{d.plate}</div><Badged tone="success">{(d.conf*100).toFixed(0)}%</Badged></div><div className="mt-1 text-xs text-muted-foreground">Slot {d.slot} - {d.at}</div></div>))}</div></div>
      </div>
    </div>
  );
}
