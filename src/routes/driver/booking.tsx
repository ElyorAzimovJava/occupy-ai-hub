import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ParkingGrid } from "@/components/ParkingGrid";
import { mockSlots, mockLots } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Check, QrCode } from "lucide-react";

export const Route = createFileRoute("/driver/booking")({
  head: () => ({ meta: [{ title: "Booking - Driver" }] }),
  component: BookingFlow,
});

const steps = ["Parking","Space","Time","Confirm","Payment","Ticket"];

function BookingFlow() {
  const [step, setStep] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-1">{steps.map((s, i) => (<div key={s} className="flex-1"><div className={`h-1.5 rounded-full ${i<=step?"bg-primary":"bg-muted"}`}/><div className={`mt-1 text-[9px] font-semibold uppercase tracking-wider text-center ${i===step?"text-primary":"text-muted-foreground"}`}>{s}</div></div>))}</div>
      {step === 0 && (<div className="space-y-3">{mockLots.slice(0,3).map((l) => (<button key={l.id} onClick={() => setStep(1)} className="flex w-full gap-3 rounded-2xl border border-border bg-card p-3 text-left transition hover:border-primary"><img src={l.image} alt="" className="h-16 w-20 rounded-xl object-cover"/><div className="flex-1"><div className="text-sm font-bold">{l.name}</div><div className="text-[11px] text-muted-foreground">{l.distance} - ${l.price}/h</div></div></button>))}</div>)}
      {step === 1 && (<div className="rounded-2xl border border-border bg-card p-4"><div className="mb-2 text-sm font-semibold">Pick a free slot</div><ParkingGrid slots={mockSlots.slice(0,48)} cols={8} compact onSlotClick={(id) => { setSlot(id); setStep(2); }}/></div>)}
      {step === 2 && (<div className="space-y-3 rounded-2xl border border-border bg-card p-4"><div className="text-sm font-semibold">Pick your time</div><div className="grid grid-cols-3 gap-2">{["1h","2h","3h","4h","6h","All day"].map((t) => (<button key={t} onClick={() => setStep(3)} className="rounded-xl border border-border py-3 text-sm font-semibold transition hover:border-primary hover:bg-primary/5">{t}</button>))}</div></div>)}
      {step === 3 && (<div className="space-y-3 rounded-2xl border border-border bg-card p-4"><div className="text-sm font-semibold">Confirm</div><div className="space-y-2 text-sm"><Row k="Lot" v="Tashkent City Mall"/><Row k="Slot" v={slot ?? "A-12"}/><Row k="Duration" v="2 hours"/><Row k="Total" v="$5.00" strong/></div><Button className="w-full" onClick={() => setStep(4)}>Continue to payment</Button></div>)}
      {step === 4 && (<div className="space-y-3 rounded-2xl border border-border bg-card p-4"><div className="text-sm font-semibold">Payment</div>{["Apple Pay","Visa ending 4242","Click / Payme"].map((m) => (<button key={m} onClick={() => setStep(5)} className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-sm transition hover:border-primary"><span>{m}</span><Check className="h-4 w-4 text-muted-foreground"/></button>))}</div>)}
      {step === 5 && (<div className="space-y-3 rounded-2xl border border-border bg-card p-6 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success"><Check className="h-7 w-7"/></div><div className="text-base font-bold">Booked!</div><div className="text-xs text-muted-foreground">Show this QR at the entrance.</div><div className="mx-auto grid h-44 w-44 place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/30"><QrCode className="h-24 w-24 text-foreground"/></div><div className="font-mono text-xs">OSP-2287-A12</div><Link to="/driver"><Button variant="outline" className="w-full">Done</Button></Link></div>)}
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (<div className="flex items-center justify-between border-b border-border py-2 last:border-0"><span className="text-muted-foreground">{k}</span><span className={strong?"text-base font-bold text-primary":"font-semibold"}>{v}</span></div>);
}
