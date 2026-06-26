import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Car, Wallet, Check, Plus, ShieldCheck, MapPin, BellRing, History, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/driver/booking")({
  head: () => ({ meta: [{ title: "Booking - Driver" }] }),
  component: BookingFlow,
});

const steps = ["Duration", "Vehicle", "Payment"] as const;

function BookingFlow() {
  const [step, setStep] = useState(0);
  const [duration, setDuration] = useState<"1h" | "2h" | "custom">("1h");
  const navigate = useNavigate();
  const rate = duration === "1h" ? 4 : duration === "2h" ? 7.5 : 4;
  const fee = 0.5;
  const tax = +(rate * 0.1).toFixed(2);
  const total = +(rate + fee + tax).toFixed(2);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stepper */}
      <div className="flex items-center justify-between px-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${i <= step ? "bg-[#1D4ED8] text-white" : "bg-blue-100 text-[#1D4ED8]"}`}>{i + 1}</div>
              <div className={`mt-2 text-xs font-semibold ${i === step ? "text-[#1D4ED8]" : "text-slate-500"}`}>{s}</div>
            </div>
            {i < steps.length - 1 && <div className={`mx-2 mt-[-18px] h-px flex-1 ${i < step ? "bg-[#1D4ED8]" : "bg-blue-200"}`}/>}
          </div>
        ))}
      </div>

      {/* Duration */}
      <Card title="Select Duration" icon={<Clock className="h-5 w-5 text-slate-400"/>}>
        <div className="grid grid-cols-3 gap-3">
          <DurationOption active={duration === "1h"} onClick={() => setDuration("1h")} label="1 hr" sub="$4.00"/>
          <DurationOption active={duration === "2h"} onClick={() => setDuration("2h")} label="2 hr" sub="$7.50"/>
          <DurationOption active={duration === "custom"} onClick={() => setDuration("custom")} label="Custom" sub="Hourly rate"/>
        </div>
      </Card>

      {/* Vehicle */}
      <Card title="Select Vehicle" icon={<Car className="h-5 w-5 text-slate-400"/>}>
        <button className="flex w-full items-center gap-3 rounded-xl border-2 border-[#1D4ED8] bg-blue-50/60 p-3 text-left">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-[#1D4ED8]"><Car className="h-5 w-5"/></div>
          <div className="flex-1"><div className="text-sm font-bold text-slate-900">Toyota Camry</div><div className="text-[11px] uppercase tracking-wider text-slate-500">ABC 123</div></div>
          <div className="grid h-6 w-6 place-items-center rounded-full bg-[#1D4ED8] text-white"><Check className="h-3.5 w-3.5"/></div>
        </button>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 hover:border-[#1D4ED8] hover:text-[#1D4ED8]">
          <Plus className="h-4 w-4"/>Register New Vehicle
        </button>
      </Card>

      {/* Payment */}
      <Card title="Payment Method" icon={<Wallet className="h-5 w-5 text-slate-400"/>}>
        <div className="flex items-center gap-3 rounded-xl bg-blue-50/60 p-3">
          <div className="grid h-10 w-12 place-items-center rounded-md bg-[#1D4ED8] text-[10px] font-extrabold italic text-white">VISA</div>
          <div className="flex-1"><div className="text-sm font-bold text-slate-900">Visa ending in 4455</div><div className="text-[11px] text-slate-500">Expires 09/26</div></div>
          <button className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">Change</button>
        </div>
      </Card>

      {/* Order Summary */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
        <div className="text-base font-bold text-slate-900">Order Summary</div>
        <div className="mt-4 space-y-2.5 text-sm">
          <Row k={`Parking Rate (${duration === "2h" ? "2 hr" : "1 hr"})`} v={`$${rate.toFixed(2)}`}/>
          <Row k="Service Fee" v={`$${fee.toFixed(2)}`}/>
          <Row k="Tax (10%)" v={`$${tax.toFixed(2)}`}/>
        </div>
        <div className="my-4 border-t border-dashed border-slate-200"/>
        <div className="flex items-center justify-between">
          <div className="text-lg font-extrabold text-slate-900">Total</div>
          <div className="text-2xl font-extrabold text-[#1D4ED8]">${total.toFixed(2)}</div>
        </div>
        <button
          onClick={() => navigate({ to: "/driver/activity" })}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700"
        >
          Confirm & Pay <ArrowRight className="h-4 w-4"/>
        </button>
        <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
          <ShieldCheck className="h-3.5 w-3.5"/>Secure SSL encrypted payment
        </div>
        <div className="mt-4 text-center text-[11px] text-slate-500">
          By clicking "Confirm & Pay", you agree to our <span className="font-bold text-[#1D4ED8]">Terms of Service</span>
        </div>
      </div>

      {/* Quick info tiles */}
      <InfoTile icon={MapPin} label="Location" value="Downtown Hub B-42"/>
      <InfoTile icon={BellRing} label="Expiry Alert" value="10 mins before"/>
      <InfoTile icon={History} label="Recent Stays" value="12h total this week"/>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-base font-bold text-slate-900">{title}</div>
        {icon}
      </div>
      {children}
    </div>
  );
}

function DurationOption({ active, label, sub, onClick }: { active: boolean; label: string; sub: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-xl border-2 px-2 py-4 transition ${active ? "border-[#1D4ED8] bg-blue-50/60 text-slate-900" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
    >
      <div className="text-base font-bold">{label}</div>
      <div className="mt-1 text-[11px] text-slate-500">{sub}</div>
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{k}</span>
      <span className="font-semibold text-slate-900">{v}</span>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-[#1D4ED8]"><Icon className="h-4 w-4"/></div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-slate-500">{label}</div>
        <div className="truncate text-sm font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
}
