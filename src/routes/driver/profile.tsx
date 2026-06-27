import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, CreditCard, Bell, LogOut, Car, Plus, BadgeCheck, Info, ReceiptText, UserCog, Settings, Pencil } from "lucide-react";

export const Route = createFileRoute("/driver/profile")({
  head: () => ({ meta: [{ title: "Profile - Driver" }] }),
  component: DriverProfile,
});

function Section({ icon: Icon, title, action, children }: { icon: any; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[#1D4ED8]" />
          <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function DriverProfile() {
  return (
    <div className="-mt-2 space-y-4 pb-4 animate-fade-in">
      <div className="relative flex flex-col items-center pb-2">
        <div className="relative">
          <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full ring-4 ring-[#1D4ED8] ring-offset-2 ring-offset-[#F4F6FB]">
            <img src="https://i.pravatar.cc/200?img=12" alt="" className="h-full w-full object-cover" />
          </div>
          <button aria-label="Edit photo" className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-[#1D4ED8] text-white shadow-lg ring-4 ring-[#F4F6FB]">
            <Pencil className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 text-2xl font-extrabold text-slate-900">Azizbek Karimov</div>
        <div className="text-sm text-slate-500">+998 (90) 123-45-67</div>
      </div>

      <Section
        icon={Car}
        title="Mening avtomobillarim"
        action={<button className="flex items-center gap-1 text-xs font-bold text-[#1D4ED8]"><Plus className="h-3.5 w-3.5"/>Qo'shish</button>}
      >
        <button className="flex w-full items-center gap-3 rounded-xl bg-blue-50/60 p-3 ring-1 ring-blue-100">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#1D4ED8] text-white"><Car className="h-5 w-5"/></div>
          <div className="flex-1 text-left">
            <div className="text-sm font-bold text-slate-900">Chevrolet Gentra</div>
            <div className="font-mono text-xs tracking-wide text-slate-500">01 A 777 AB</div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400"/>
        </button>
      </Section>

      <Section icon={CreditCard} title="To'lov usullari">
        <div className="flex w-full items-center gap-3 rounded-xl bg-blue-50/60 p-3 ring-1 ring-blue-100">
          <div className="grid h-9 w-12 place-items-center rounded-md bg-[#1D4ED8] text-[9px] font-extrabold tracking-tight text-white">UZCARD</div>
          <div className="flex-1 text-sm font-bold text-slate-900">**** 8890</div>
          <BadgeCheck className="h-5 w-5 text-emerald-600"/>
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-400">
          <Plus className="h-4 w-4"/> Karta qo'shish
        </button>
      </Section>

      <Section icon={Bell} title="Bildirishnomalar">
        <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"/>
          <div className="text-sm text-emerald-900">Parkovka tugashiga 10 daqiqa qoldi.</div>
        </div>
        <button className="mt-3 flex w-full items-center gap-3 rounded-xl px-1 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
          <ReceiptText className="h-5 w-5 text-[#1D4ED8]"/>
          <span className="flex-1 text-left">Buyurtmalar tarixi</span>
          <ChevronRight className="h-4 w-4 text-slate-400"/>
        </button>
      </Section>

      <button className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-100">
        <UserCog className="h-5 w-5 text-[#1D4ED8]"/>
        <span className="flex-1 text-left">Hisob sozlamalari</span>
        <ChevronRight className="h-4 w-4 text-slate-400"/>
      </button>

      <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white p-3.5 text-sm font-bold text-rose-600">
        <LogOut className="h-4 w-4"/> Tizimdan chiqish
      </button>

      <div className="pt-2 text-center text-[11px] text-slate-400">
        <div>Oson Parking v2.4.0</div>
        <div>Savollar bormi? <span className="font-semibold text-[#1D4ED8]">Qo'llab-quvvatlash</span></div>
      </div>
    </div>
  );
}
