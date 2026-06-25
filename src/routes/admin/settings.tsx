import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings - Admin" }] }),
  component: () => (
    <div>
      <PageHeader title="Platform settings" subtitle="Branding, billing, and AI policies." />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold">Workspace</h3>
          <div className="mt-4 space-y-3">
            <div><Label>Workspace name</Label><Input defaultValue="OsonParking HQ" className="mt-1.5" /></div>
            <div><Label>Contact email</Label><Input defaultValue="ops@osonparking.com" className="mt-1.5" /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold">AI policies</h3>
          <div className="mt-4 space-y-4">
            {["Auto-pause offline cameras","Allow license plate OCR","Send AI accuracy alerts","Weekly executive digest"].map((l) => (
              <div key={l} className="flex items-center justify-between"><div className="text-sm">{l}</div><Switch defaultChecked /></div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2"><Button variant="outline">Cancel</Button><Button>Save changes</Button></div>
    </div>
  ),
});
