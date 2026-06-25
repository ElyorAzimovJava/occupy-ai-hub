import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/owner/settings")({
  head: () => ({ meta: [{ title: "Settings - Owner" }] }),
  component: () => (
    <div>
      <PageHeader title="Lot settings" subtitle="Pricing, hours, staff, and notifications." />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6"><h3 className="text-sm font-semibold">Pricing</h3><div className="mt-4 grid gap-3 sm:grid-cols-2"><div><Label>Hourly rate</Label><Input defaultValue="$2.50" className="mt-1.5"/></div><div><Label>Daily cap</Label><Input defaultValue="$24.00" className="mt-1.5"/></div></div></div>
        <div className="rounded-2xl border border-border bg-card p-6"><h3 className="text-sm font-semibold">Hours</h3><div className="mt-4 grid gap-3 sm:grid-cols-2"><div><Label>Opens</Label><Input defaultValue="06:00" className="mt-1.5"/></div><div><Label>Closes</Label><Input defaultValue="24:00" className="mt-1.5"/></div></div></div>
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2"><h3 className="text-sm font-semibold">Notifications</h3><div className="mt-4 space-y-3">{["Email daily summary","Slack: low availability","Camera offline alerts","Pending booking SMS"].map((l) => (<div key={l} className="flex items-center justify-between"><div className="text-sm">{l}</div><Switch defaultChecked/></div>))}</div></div>
      </div>
      <div className="mt-5 flex justify-end gap-2"><Button variant="outline">Cancel</Button><Button>Save</Button></div>
    </div>
  ),
});
