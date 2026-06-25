import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell, type NavItem } from "@/components/AppShell";
import { LayoutDashboard, Users, Building2, MonitorPlay, BarChart3, Bell, Settings } from "lucide-react";

const nav: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Business Owners", to: "/admin/owners", icon: Users, badge: "5" },
  { label: "Parking Lots", to: "/admin/lots", icon: Building2 },
  { label: "Monitoring", to: "/admin/monitoring", icon: MonitorPlay, badge: "Live" },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Notifications", to: "/admin/notifications", icon: Bell },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export const Route = createFileRoute("/admin")({
  component: () => (
    <AppShell brand="OsonParking" brandRole="Super Admin" nav={nav} user={{ name: "Aziz Sultan", email: "aziz@osonparking.com", avatar: "AS" }}>
      <Outlet />
    </AppShell>
  ),
});
