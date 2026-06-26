import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badged } from "@/components/AppShell";
import { ParkingGrid, SlotLegend } from "@/components/ParkingGrid";
import { Button } from "@/components/ui/button";
import { mockSlots, type SlotStatus } from "@/lib/mockData";
import { useState } from "react";
import { Plus, Trash2, Move, Brush } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/owner/editor")({
  head: () => ({ meta: [{ title: "Space Editor - Owner" }] }),
  component: EditorPage,
});

function EditorPage() {
  const [slots, setSlots] = useState(mockSlots);
  const [paint, setPaint] = useState<SlotStatus>("available");
  const cycle = (s: SlotStatus): SlotStatus => paint;
  return (
    <div>
      <PageHeader title="Space editor" subtitle="Visual layout. Click any slot to paint its state. Bulk-edit, draw polygons, and sync to AI cameras." actions={<Button size="sm" onClick={() => toast.success("Layout saved (mock)")}>Save layout</Button>} />
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div><div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paint state</div><div className="mt-3 space-y-2">{(["available","occupied","reserved","disabled"] as SlotStatus[]).map((s) => (<button key={s} onClick={() => setPaint(s)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm capitalize transition ${paint===s?"border-primary bg-primary/10 text-primary":"border-border hover:bg-muted/40"}`}><span className="flex items-center gap-2"><Brush className="h-3.5 w-3.5"/>{s}</span><Badged tone={s==="available"?"success":s==="occupied"?"danger":s==="reserved"?"warning":"default"}>{s[0].toUpperCase()}</Badged></button>))}</div></div>
          <div className="border-t border-border pt-4"><div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tools</div><div className="mt-3 grid grid-cols-2 gap-2"><Button size="sm" variant="outline" onClick={() => toast("Add row")}><Plus className="mr-1 h-3.5 w-3.5"/>Row</Button><Button size="sm" variant="outline" onClick={() => toast("Move")}><Move className="mr-1 h-3.5 w-3.5"/>Move</Button><Button size="sm" variant="outline" onClick={() => toast("Delete")}><Trash2 className="mr-1 h-3.5 w-3.5"/>Delete</Button><Button size="sm" variant="outline" onClick={() => toast("Polygon")}>Polygon</Button></div></div>
          <div className="border-t border-border pt-4"><div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legend</div><div className="mt-3"><SlotLegend/></div></div>
        </aside>
        <div className="rounded-2xl border border-border bg-card p-5">
          <ParkingGrid slots={slots} cols={12} onSelect={(slot) => setSlots((prev) => prev.map((s) => s.id === slot.id ? { ...s, status: cycle(s.status) } : s))} />
        </div>
      </div>
    </div>
  );
}
