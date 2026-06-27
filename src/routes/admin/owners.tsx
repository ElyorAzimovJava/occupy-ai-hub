import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badged, StatusDot } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockOwners } from "@/lib/mockData";
import { Plus, MoreHorizontal, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/owners")({
  head: () => ({ meta: [{ title: "Biznes egalari - Admin" }] }),
  component: OwnersPage,
});

function OwnersPage() {
  const [q, setQ] = useState("");
  const filtered = mockOwners.filter((o) => [o.name, o.company, o.email].some((v) => v.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <PageHeader title="Business owners" subtitle="Manage the operators behind every parking lot." actions={<AddOwnerDialog />} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search owners..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="flex gap-2"><Button variant="outline" size="sm">All</Button><Button variant="outline" size="sm">Active</Button><Button variant="outline" size="sm">Suspended</Button></div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-4">Owner</th><th className="p-4">Company</th><th className="p-4 hidden md:table-cell">Email</th><th className="p-4 hidden lg:table-cell">Lots</th><th className="p-4">Revenue</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">{o.avatar}</div><div><div className="font-semibold">{o.name}</div><div className="text-xs text-muted-foreground md:hidden">{o.email}</div></div></div></td>
                  <td className="p-4 text-muted-foreground">{o.company}</td>
                  <td className="p-4 hidden md:table-cell text-muted-foreground">{o.email}</td>
                  <td className="p-4 hidden lg:table-cell">{o.lots}</td>
                  <td className="p-4 font-semibold">${o.revenue.toLocaleString()}</td>
                  <td className="p-4"><Badged tone={o.status==="active"?"success":o.status==="suspended"?"warning":"danger"}><span className="mr-1"><StatusDot status={o.status} /></span>{o.status}</Badged></td>
                  <td className="p-4 text-right"><Button size="icon" variant="ghost" onClick={() => toast("Owner menu")}><MoreHorizontal className="h-4 w-4" /></Button></td>
                </tr>
              ))}
              {filtered.length === 0 && (<tr><td colSpan={7} className="p-12 text-center text-sm text-muted-foreground">No owners match your search.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AddOwnerDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add Owner</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Invite a business owner</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div><Label>Full Name</Label><Input className="mt-1" placeholder="Alisher Karimov" /></div>
          <div><Label>Company</Label><Input className="mt-1" placeholder="Tashkent City Holdings" /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Email</Label><Input className="mt-1" placeholder="owner@company.com" /></div>
            <div><Label>Phone</Label><Input className="mt-1" placeholder="+998 71 ..." /></div>
          </div>
          <div><Label>Temporary password</Label><Input className="mt-1" type="password" placeholder="********" /></div>
        </div>
        <DialogFooter><Button variant="outline">Cancel</Button><Button onClick={() => toast.success("Owner invited (mock)")}>Send invite</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
