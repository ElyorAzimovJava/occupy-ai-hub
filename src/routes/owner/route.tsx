import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell, type NavItem } from "@/components/AppShell";
import { LayoutDashboard, Grid3x3, MonitorPlay, CalendarCheck, History, Settings } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { bookingStore } from "@/lib/bookingStore";
import { useNavigate } from "@tanstack/react-router";
import { useCurrentOwner } from "@/lib/session";

const nav: NavItem[] = [
  { label: "Dashboard", to: "/owner", icon: LayoutDashboard },
  { label: "Space Editor", to: "/owner/editor", icon: Grid3x3 },
  { label: "Live Monitoring", to: "/owner/live", icon: MonitorPlay, badge: "Live" },
  { label: "Bookings", to: "/owner/bookings", icon: CalendarCheck, badge: "4" },
  { label: "History", to: "/owner/history", icon: History },
  { label: "Settings", to: "/owner/settings", icon: Settings },
];

export const Route = createFileRoute("/owner")({
  component: OwnerShell,
});

function OwnerShell() {
  const navigate = useNavigate();
  const owner = useCurrentOwner();
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
    <AppShell brand="OsonParking" brandRole={owner.company} nav={nav} user={{ name: owner.name, email: owner.email, avatar: owner.initials }}>
      <Outlet />
    </AppShell>
  );
}
