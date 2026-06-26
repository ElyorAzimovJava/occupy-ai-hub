import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { Compass, Search, Receipt, User, Menu } from "lucide-react";

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
  return (
    <div className="min-h-svh bg-[#F4F6FB] pb-28 text-slate-900">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-[#F4F6FB]/90 px-5 py-4 backdrop-blur">
        <button aria-label="Menu" className="text-[#1D4ED8]"><Menu className="h-6 w-6"/></button>
        <div className="text-lg font-extrabold tracking-wide text-[#1D4ED8]">OSON PARKING</div>
        <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-200 ring-2 ring-white">
          <img alt="" src="https://i.pravatar.cc/64?img=12" className="h-full w-full object-cover"/>
        </div>
      </header>
      <main className="mx-auto max-w-md px-5 py-5"><Outlet/></main>
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
