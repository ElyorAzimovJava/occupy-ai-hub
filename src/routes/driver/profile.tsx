import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronRight, Heart, CreditCard, Bell, Shield, LogOut } from "lucide-react";

export const Route = createFileRoute("/driver/profile")({
  head: () => ({ meta: [{ title: "Profile - Driver" }] }),
  component: () => (
    <div className="space-y-5 animate-fade-in">
      <div className="rounded-2xl border border-border bg-card p-5 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-primary text-lg font-bold text-primary-foreground">SK</div><div className="mt-3 text-base font-bold">Sardor Karimov</div><div className="text-xs text-muted-foreground">sardor@gmail.com - Plate 01A 234 BX</div><div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-muted/40 p-2"><div className="font-bold">42</div><div className="text-muted-foreground">Bookings</div></div><div className="rounded-xl bg-muted/40 p-2"><div className="font-bold">$184</div><div className="text-muted-foreground">Saved</div></div><div className="rounded-xl bg-muted/40 p-2"><div className="font-bold">4.9</div><div className="text-muted-foreground">Rating</div></div></div></div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">{[{i:Heart,l:"Favorite lots"},{i:CreditCard,l:"Payment methods"},{i:Bell,l:"Notifications"},{i:Shield,l:"Privacy"}].map((it) => (<button key={it.l} className="flex w-full items-center gap-3 border-b border-border p-4 text-sm last:border-0 hover:bg-muted/40"><it.i className="h-4 w-4 text-muted-foreground"/><span className="flex-1 text-left font-medium">{it.l}</span><ChevronRight className="h-4 w-4 text-muted-foreground"/></button>))}</div>
      <Button variant="outline" className="w-full"><LogOut className="mr-2 h-4 w-4"/>Sign out</Button>
    </div>
  ),
});
