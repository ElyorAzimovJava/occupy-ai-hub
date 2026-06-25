import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badged } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { mockBookings } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/owner/bookings")({
  head: () => ({ meta: [{ title: "Bookings - Owner" }] }),
  component: () => (
    <div>
      <PageHeader title="Bookings" subtitle="Approve, extend, or cancel active reservations." />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-4">Driver</th><th className="p-4">Vehicle</th><th className="p-4">Space</th><th className="p-4 hidden md:table-cell">Time</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
            <tbody>
              {mockBookings.map((b) => (
                <tr key={b.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4 font-semibold">{b.driver}</td>
                  <td className="p-4 font-mono">{b.plate}</td>
                  <td className="p-4">{b.space}</td>
                  <td className="p-4 hidden md:table-cell text-muted-foreground">{b.time}</td>
                  <td className="p-4"><Badged tone={b.status==="active"?"success":b.status==="pending"?"warning":b.status==="completed"?"info":"danger"}>{b.status}</Badged></td>
                  <td className="p-4 text-right"><div className="flex justify-end gap-2">{b.status === "pending" && (<><Button size="sm" variant="outline" onClick={() => toast.success("Approved")}>Approve</Button><Button size="sm" variant="ghost" onClick={() => toast.error("Rejected")}>Reject</Button></>)}{b.status === "active" && (<><Button size="sm" variant="outline" onClick={() => toast("Extended")}>Extend</Button><Button size="sm" variant="ghost" onClick={() => toast.error("Cancelled")}>Cancel</Button></>)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ),
});
