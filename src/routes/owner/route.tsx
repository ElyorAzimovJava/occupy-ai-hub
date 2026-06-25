import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell, type NavItem } from "@/components/AppShell";
import { LayoutDashboard, Grid3x3, MonitorPlay, CalendarCheck, History, Settings } from "lucide-react";

const nav: NavItem[] = [
  { label: "Dashboard", to: "/owner", icon: LayoutDashboard },
  { label: "Space Editor", to: "/owner/editor", icon: Grid3x3 },
  { label: "Live Monitoring", to: "/owner/live", icon: MonitorPlay, badge: "Live" },
  { label: "Bookings", to: "/owner/bookings", icon: CalendarCheck, badge: "4" },
  { label: "History", to: "/owner/history", icon: History },
  { label: "Settings", to: "/owner/settings", icon: Settings },
];

export const Route = createFileRoute("/owner")({
  component: () => (
    <AppShell brand="OsonParking" brandRole="Owner Console" nav={nav} user={{ name: "Madina Rakhimova", email: "madina@tashkentcity.uz", avatar: "MR" }}>
      <Outlet />
    </AppShell>
  ),
});
