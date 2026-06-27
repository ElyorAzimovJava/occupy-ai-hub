import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Sozlamalar - Admin" }] }),
  component: () => (
    <div>
      <PageHeader title="Platforma sozlamalari" subtitle="Brending, hisob-kitob va AI siyosatlari." />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold">Ish maydoni</h3>
          <div className="mt-4 space-y-3">
            <div><Label>Ish maydoni nomi</Label><Input defaultValue="OsonParking HQ" className="mt-1.5" /></div>
            <div><Label>Aloqa email</Label><Input defaultValue="ops@osonparking.com" className="mt-1.5" /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold">AI siyosatlari</h3>
          <div className="mt-4 space-y-4">
            {["Oflayn kameralarni avtomatik toxtatish","Davlat raqamini OCR qilishga ruxsat","AI aniqlik ogohlantirishlari","Haftalik rahbar hisoboti"].map((l) => (
              <div key={l} className="flex items-center justify-between"><div className="text-sm">{l}</div><Switch defaultChecked /></div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2"><Button variant="outline">Bekor qilish</Button><Button>Saqlash</Button></div>
    </div>
  ),
});
