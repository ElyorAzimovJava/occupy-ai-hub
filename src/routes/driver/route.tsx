import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import {
  Compass, Search, Receipt, User, Menu, X,
  Car, Bookmark, CreditCard, Bell, HelpCircle, Settings, LogOut, Shield, FileText,
} from "lucide-react";
import { useState } from "react";
import { useCurrentDriver, session } from "@/lib/session";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/driver")({
  component: DriverShell,
});

const items = [
  { to: "/driver", label: "Home", icon: Compass, exact: true },
  { to: "/driver/search", label: "Search", icon: Search },
  { to: "/driver/activity", label: "Activity", icon: Receipt },
  { to: "/driver/profile", label: "Profile", icon: User },
];

function DriverShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const driver = useCurrentDriver();
  const navigate = useNavigate();
  return (
    <div className="min-h-svh bg-[#F4F6FB] pb-28 text-slate-900">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-[#F4F6FB]/90 px-5 py-4 backdrop-blur">
        <button aria-label="Menu" onClick={() => setMenuOpen(true)} className="text-[#1D4ED8]"><Menu className="h-6 w-6"/></button>
        <div className="text-lg font-extrabold tracking-wide text-[#1D4ED8]">OSON PARKING</div>
        <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] text-[11px] font-bold text-white ring-2 ring-white">
          {driver.initials}
        </div>
      </header>
      <main className="mx-auto max-w-md px-5 py-5"><Outlet/></main>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} driverName={driver.name} driverEmail={driver.email} driverInitials={driver.initials} onSignOut={() => { session.signOut(); navigate({ to: "/" }); }} />
      <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto max-w-md px-3">
        <div className="grid grid-cols-4 rounded-2xl border border-slate-200 bg-white/95 px-2 py-2 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.18)] backdrop-blur">
          {items.map((it) => {
            const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition ${active ? "bg-[#1D4ED8] text-white shadow-md shadow-blue-500/30" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Icon className="h-5 w-5"/>
                {it.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

const menuSections: { title: string; items: { to: string; label: string; icon: any }[] }[] = [
  {
    title: "Asosiy",
    items: [
      { to: "/driver", label: "Bosh sahifa", icon: Compass },
      { to: "/driver/search", label: "AI qidiruv", icon: Search },
      { to: "/driver/activity", label: "Faol sessiya", icon: Receipt },
      { to: "/driver/history", label: "Tarix", icon: FileText },
    ],
  },
  {
    title: "Sozlamalar",
    items: [
      { to: "/driver/profile", label: "Profil", icon: User },
      { to: "/driver/profile", label: "Mening avtomobillarim", icon: Car },
      { to: "/driver/profile", label: "To'lov usullari", icon: CreditCard },
      { to: "/driver/profile", label: "Saqlanganlar", icon: Bookmark },
      { to: "/driver/profile", label: "Bildirishnomalar", icon: Bell },
    ],
  },
  {
    title: "Yordam",
    items: [
      { to: "/driver/profile", label: "Yordam markazi", icon: HelpCircle },
      { to: "/driver/profile", label: "Maxfiylik", icon: Shield },
      { to: "/driver/profile", label: "Ilova sozlamalari", icon: Settings },
    ],
  },
];

function SideMenu({ open, onClose, driverName, driverEmail, driverInitials, onSignOut }: { open: boolean; onClose: () => void; driverName: string; driverEmail: string; driverInitials: string; onSignOut: () => void }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] text-xs font-bold text-white ring-2 ring-blue-100">
              {driverInitials}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{driverName}</div>
              <div className="text-[11px] text-slate-500">{driverEmail}</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Yopish" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {menuSections.map((sec) => (
            <div key={sec.title} className="mb-5">
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{sec.title}</div>
              <div className="space-y-1">
                {sec.items.map((it, i) => {
                  const Icon = it.icon;
                  return (
                    <Link
                      key={i}
                      to={it.to}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-[#1D4ED8]"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-[#1D4ED8]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">{it.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 p-3">
          <button
            onClick={() => { onClose(); onSignOut(); }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-100"
          >
            <LogOut className="h-4 w-4" /> Chiqish
          </button>
          <div className="mt-2 text-center text-[10px] text-slate-400">Oson Parking • v1.0.0</div>
        </div>
      </aside>
    </>
  );
}
