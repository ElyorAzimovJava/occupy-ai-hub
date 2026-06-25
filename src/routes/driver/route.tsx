import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, CalendarCheck, History, User } from "lucide-react";
import { ThemeToggle } from "@/lib/theme";

export const Route = createFileRoute("/driver")({
  component: DriverShell,
});

const items = [
  { to: "/driver", label: "Home", icon: Home, exact: true },
  { to: "/driver/search", label: "Search", icon: Search },
  { to: "/driver/booking", label: "Booking", icon: CalendarCheck },
  { to: "/driver/history", label: "History", icon: History },
  { to: "/driver/profile", label: "Profile", icon: User },
];

function DriverShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-svh bg-background pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">O</div><div><div className="text-sm font-bold leading-none">OsonParking</div><div className="text-[10px] text-muted-foreground">Driver</div></div></div>
        <ThemeToggle/>
      </header>
      <main className="mx-auto max-w-md px-4 py-5"><Outlet/></main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {items.map((it) => {
            const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
            const Icon = it.icon;
            return (<Link key={it.to} to={it.to} className={`flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition ${active?"text-primary":"text-muted-foreground"}`}><Icon className={`h-5 w-5 ${active?"scale-110":""} transition`}/>{it.label}</Link>);
          })}
        </div>
      </nav>
    </div>
  );
}
