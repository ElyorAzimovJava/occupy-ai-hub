import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell, type NavItem } from "@/components/AppShell";
import { LayoutDashboard, Grid3x3, MonitorPlay, CalendarCheck, History, Settings, Building2, MapPin, ParkingSquare, Wallet, Phone, Mail } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { bookingStore } from "@/lib/bookingStore";
import { useNavigate } from "@tanstack/react-router";
import { useCurrentOwner } from "@/lib/session";
import { mockLots, mockOwners } from "@/lib/mockData";
import { useBookings } from "@/lib/bookingStore";

const nav: NavItem[] = [
  { label: "Boshqaruv paneli", to: "/owner", icon: LayoutDashboard },
  { label: "Joylar muharriri", to: "/owner/editor", icon: Grid3x3 },
  { label: "Jonli monitoring", to: "/owner/live", icon: MonitorPlay, badge: "Jonli" },
  { label: "Bronlar", to: "/owner/bookings", icon: CalendarCheck, badge: "4" },
  { label: "Tarix", to: "/owner/history", icon: History },
  { label: "Sozlamalar", to: "/owner/settings", icon: Settings },
];

export const Route = createFileRoute("/owner")({
  component: OwnerShell,
});

function OwnerShell() {
  const navigate = useNavigate();
  const owner = useCurrentOwner();
  const lot = mockLots.find((l) => l.id === owner.lotId) ?? mockLots[0];
  const ownerRec = mockOwners.find((o) => o.id === owner.ownerId);
  const ownedLots = mockLots.filter((l) => l.owner === (ownerRec?.name ?? owner.name));
  const totalSpaces = ownedLots.reduce((s, l) => s + l.total, 0);
  const totalOccupied = ownedLots.reduce((s, l) => s + l.occupied, 0);
  const totalRevenue = ownedLots.reduce((s, l) => s + l.revenue, 0);
  const liveBookings = useBookings().filter((b) => b.lotId === owner.lotId && (b.status === "pending" || b.status === "active")).length;
  useEffect(() => {
    return bookingStore.onCreate((b) => {
      if (b.lotId !== owner.lotId) return;
      toast(`🚗 Yangi bron: ${b.driverName}`, {
        description: `${b.lotName} · ${b.vehicle} (${b.plate}) — kelishi kutilmoqda`,
        duration: 8000,
        action: { label: "Ko'rish", onClick: () => navigate({ to: "/owner/bookings" }) },
      });
      try {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("OsonParking — yangi bron", {
            body: `${b.driverName} · ${b.plate} · ${b.lotName}`,
            tag: b.id,
          });
        }
      } catch {}
    });
  }, [navigate, owner.lotId]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  return (
    <AppShell
      brand="OsonParking"
      brandRole={owner.company}
      nav={nav}
      user={{ name: owner.name, email: owner.email, avatar: owner.initials }}
      userExtras={
        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#1D4ED8] text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold">{owner.company}</div>
              <div className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">Biznes egasi</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1 text-center">
            <div className="rounded-lg bg-background p-2">
              <div className="text-sm font-extrabold">{ownedLots.length || 1}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Parkinglar</div>
            </div>
            <div className="rounded-lg bg-background p-2">
              <div className="text-sm font-extrabold">{totalSpaces}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Joylar</div>
            </div>
            <div className="rounded-lg bg-background p-2">
              <div className="text-sm font-extrabold text-emerald-600">{Math.max(0, totalSpaces - totalOccupied)}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Bo'sh</div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5 text-[11px]">
            <div className="flex items-start gap-1.5">
              <ParkingSquare className="mt-0.5 h-3 w-3 shrink-0 text-[#1D4ED8]" />
              <span className="font-semibold">{lot.name}</span>
            </div>
            <div className="flex items-start gap-1.5 text-muted-foreground">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
              <span className="truncate">{lot.address}</span>
            </div>
            {ownerRec?.phone && (
              <div className="flex items-start gap-1.5 text-muted-foreground">
                <Phone className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{ownerRec.phone}</span>
              </div>
            )}
            <div className="flex items-start gap-1.5 text-muted-foreground">
              <Mail className="mt-0.5 h-3 w-3 shrink-0" />
              <span className="truncate">{owner.email}</span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Wallet className="h-3 w-3" /> Daromad
              </span>
              <span className="font-extrabold text-emerald-600">${(totalRevenue/1000).toFixed(1)}k</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Faol bronlar</span>
              <span className="font-extrabold text-[#1D4ED8]">{liveBookings}</span>
            </div>
          </div>
        </div>
      }
    >
      <Outlet />
    </AppShell>
  );
}
