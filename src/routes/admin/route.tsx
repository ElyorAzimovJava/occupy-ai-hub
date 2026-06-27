import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell, type NavItem } from "@/components/AppShell";
import { LayoutDashboard, Users, Building2, MonitorPlay, BarChart3, Bell, Settings } from "lucide-react";

const nav: NavItem[] = [
  { label: "Boshqaruv paneli", to: "/admin", icon: LayoutDashboard },
  { label: "Biznes egalari", to: "/admin/owners", icon: Users, badge: "5" },
  { label: "Parkinglar", to: "/admin/lots", icon: Building2 },
  { label: "Monitoring", to: "/admin/monitoring", icon: MonitorPlay, badge: "Jonli" },
  { label: "Tahlillar", to: "/admin/analytics", icon: BarChart3 },
  { label: "Bildirishnomalar", to: "/admin/notifications", icon: Bell },
  { label: "Sozlamalar", to: "/admin/settings", icon: Settings },
];

export const Route = createFileRoute("/admin")({
  component: () => (
    <AppShell brand="OsonParking" brandRole="Super Admin" nav={nav} user={{ name: "Aziz Sultan", email: "aziz@osonparking.com", avatar: "AS" }}>
      <Outlet />
    </AppShell>
  ),
});
