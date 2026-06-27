import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  ChevronRight, CreditCard, Bell, LogOut, Car, Plus, BadgeCheck, Info,
  ReceiptText, UserCog, Pencil, Trash2, CheckCircle2, X, Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { session } from "@/lib/session";
import { driverProfileStore, useDriverProfile, type PaymentCard } from "@/lib/driverProfileStore";
import type { DriverVehicle } from "@/lib/session";

export const Route = createFileRoute("/driver/profile")({
  head: () => ({ meta: [{ title: "Profil - Haydovchi" }] }),
  component: DriverProfile,
});

function Section({ icon: Icon, title, action, children }: { icon: any; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[#1D4ED8]" />
          <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function DriverProfile() {
  const navigate = useNavigate();
  const [data, driverId] = useDriverProfile();
  const [editOpen, setEditOpen] = useState(false);
  const [carOpen, setCarOpen] = useState<null | { mode: "add" } | { mode: "edit"; v: DriverVehicle }>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  return (
    <div className="-mt-2 space-y-4 pb-4 animate-fade-in">
      <div className="relative flex flex-col items-center pb-2">
        <div className="relative">
          <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full ring-4 ring-[#1D4ED8] ring-offset-2 ring-offset-[#F4F6FB]">
            <img src={`https://i.pravatar.cc/200?img=${data.avatarSeed}`} alt="" className="h-full w-full object-cover" />
          </div>
          <button
            onClick={() => driverProfileStore.update(driverId, { avatarSeed: ((data.avatarSeed % 70) + 1) })}
            aria-label="Edit photo"
            className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-[#1D4ED8] text-white shadow-lg ring-4 ring-[#F4F6FB] active:scale-95"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
        <button onClick={() => setEditOpen(true)} className="mt-3 text-2xl font-extrabold text-slate-900 hover:underline">
          {data.name}
        </button>
        <div className="text-sm text-slate-500">{data.phone}</div>
      </div>

      <Section
        icon={Car}
        title="Mening avtomobillarim"
        action={
          <button onClick={() => setCarOpen({ mode: "add" })} className="flex items-center gap-1 text-xs font-bold text-[#1D4ED8] hover:underline">
            <Plus className="h-3.5 w-3.5" />Qo'shish
          </button>
        }
      >
        <div className="space-y-2">
          {data.vehicles.length === 0 && (
            <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
              Hozircha avtomobil yo'q
            </div>
          )}
          {data.vehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => setCarOpen({ mode: "edit", v })}
              className="flex w-full items-center gap-3 rounded-xl bg-blue-50/60 p-3 ring-1 ring-blue-100 hover:bg-blue-50"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#1D4ED8] text-white"><Car className="h-5 w-5" /></div>
              <div className="flex-1 text-left">
                <div className="text-sm font-bold text-slate-900">{v.name}</div>
                <div className="font-mono text-xs tracking-wide text-slate-500">{v.plate} • {v.color}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          ))}
        </div>
      </Section>

      <Section icon={CreditCard} title="To'lov usullari">
        <div className="space-y-2">
          {data.cards.map((c) => (
            <div key={c.id} className="flex w-full items-center gap-3 rounded-xl bg-blue-50/60 p-3 ring-1 ring-blue-100">
              <div className={`grid h-9 w-12 place-items-center rounded-md text-[9px] font-extrabold tracking-tight text-white ${c.brand === "HUMO" ? "bg-emerald-600" : c.brand === "VISA" ? "bg-indigo-600" : "bg-[#1D4ED8]"}`}>{c.brand}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">**** {c.last4}</div>
                <div className="text-[11px] text-slate-500">{c.expiry}</div>
              </div>
              {c.primary ? (
                <BadgeCheck className="h-5 w-5 text-emerald-600" />
              ) : (
                <button onClick={() => { driverProfileStore.setPrimaryCard(driverId, c.id); toast.success("Asosiy karta o'zgartirildi"); }} title="Asosiy qilish">
                  <Star className="h-4 w-4 text-slate-400 hover:text-amber-500" />
                </button>
              )}
              <button onClick={() => { driverProfileStore.removeCard(driverId, c.id); toast.success("Karta o'chirildi"); }} title="O'chirish">
                <Trash2 className="h-4 w-4 text-rose-500" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setCardOpen(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
        >
          <Plus className="h-4 w-4" /> Karta qo'shish
        </button>
      </Section>

      <Section icon={Bell} title="Bildirishnomalar">
        <div className="space-y-3">
          <NotifRow label="Bron yangilanishlari" value={data.notif.bookingUpdates} onChange={(v) => driverProfileStore.setNotif(driverId, { bookingUpdates: v })} />
          <NotifRow label="Aksiya va chegirmalar" value={data.notif.promos} onChange={(v) => driverProfileStore.setNotif(driverId, { promos: v })} />
          <NotifRow label="Sessiya tugashi haqida" value={data.notif.expiry} onChange={(v) => driverProfileStore.setNotif(driverId, { expiry: v })} />
          <NotifRow label="SMS xabarlar" value={data.notif.sms} onChange={(v) => driverProfileStore.setNotif(driverId, { sms: v })} />
        </div>
        <Link to="/driver/history" className="mt-3 flex w-full items-center gap-3 rounded-xl px-1 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
          <ReceiptText className="h-5 w-5 text-[#1D4ED8]" />
          <span className="flex-1 text-left">Buyurtmalar tarixi</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>
      </Section>

      <button
        onClick={() => setAccountOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50"
      >
        <UserCog className="h-5 w-5 text-[#1D4ED8]" />
        <span className="flex-1 text-left">Hisob sozlamalari</span>
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </button>

      <button
        onClick={() => setSignOutOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white p-3.5 text-sm font-bold text-rose-600 hover:bg-rose-50"
      >
        <LogOut className="h-4 w-4" /> Tizimdan chiqish
      </button>

      <div className="pt-2 text-center text-[11px] text-slate-400">
        <div>Oson Parking v2.4.0</div>
        <div>Savollar bormi? <button onClick={() => toast("Qo'llab-quvvatlash: +998 71 200 00 00")} className="font-semibold text-[#1D4ED8]">Qo'llab-quvvatlash</button></div>
      </div>

      <EditProfileDialog open={editOpen} onClose={() => setEditOpen(false)} initial={{ name: data.name, phone: data.phone, email: data.email }} onSave={(p) => { driverProfileStore.update(driverId, p); toast.success("Profil yangilandi"); }} />
      <VehicleDialog state={carOpen} onClose={() => setCarOpen(null)} driverId={driverId} />
      <CardDialog open={cardOpen} onClose={() => setCardOpen(false)} driverId={driverId} holderDefault={data.name} />
      <AccountSettingsDialog open={accountOpen} onClose={() => setAccountOpen(false)} />
      <SignOutDialog open={signOutOpen} onClose={() => setSignOutOpen(false)} onConfirm={() => { session.signOut(); toast.success("Tizimdan chiqdingiz"); navigate({ to: "/" }); }} />
    </div>
  );
}

function NotifRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-700">{label}</div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function EditProfileDialog({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial: { name: string; phone: string; email: string }; onSave: (p: { name: string; phone: string; email: string }) => void }) {
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone);
  const [email, setEmail] = useState(initial.email);
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); else { setName(initial.name); setPhone(initial.phone); setEmail(initial.email); } }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Profilni tahrirlash</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Ism familiya</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
          <div><Label>Telefon</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" /></div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Bekor</Button>
          <Button onClick={() => { onSave({ name, phone, email }); onClose(); }}>Saqlash</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VehicleDialog({ state, onClose, driverId }: { state: null | { mode: "add" } | { mode: "edit"; v: DriverVehicle }; onClose: () => void; driverId: string }) {
  const editing = state && state.mode === "edit" ? state.v : null;
  const [name, setName] = useState(editing?.name ?? "");
  const [plate, setPlate] = useState(editing?.plate ?? "");
  const [color, setColor] = useState(editing?.color ?? "");
  const [year, setYear] = useState<string>(editing ? String(editing.year) : String(new Date().getFullYear()));

  // Reset form when state changes
  const key = editing?.id ?? state?.mode ?? "closed";
  // simple re-init via key trick
  if (state && (name === "" && plate === "" && editing)) {
    // no-op; this branch should be unreachable thanks to initial values
  }

  return (
    <Dialog
      key={key}
      open={state !== null}
      onOpenChange={(v) => { if (!v) onClose(); }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Avtomobilni tahrirlash" : "Yangi avtomobil"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div><Label>Model</Label><Input placeholder="Chevrolet Cobalt" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
          <div><Label>Davlat raqami</Label><Input placeholder="01 A 777 BA" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} className="mt-1.5 font-mono" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Rang</Label><Input placeholder="Oq" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Yili</Label><Input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="mt-1.5" /></div>
          </div>
        </div>
        <DialogFooter className="flex-row justify-between sm:justify-between">
          {editing ? (
            <Button variant="outline" className="text-rose-600 border-rose-200" onClick={() => { driverProfileStore.removeVehicle(driverId, editing.id); toast.success("Avtomobil o'chirildi"); onClose(); }}>
              <Trash2 className="h-4 w-4 mr-1" /> O'chirish
            </Button>
          ) : <span />}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Bekor</Button>
            <Button
              onClick={() => {
                if (!name.trim() || !plate.trim()) { toast.error("Model va raqamni kiriting"); return; }
                const y = parseInt(year) || new Date().getFullYear();
                if (editing) {
                  driverProfileStore.updateVehicle(driverId, editing.id, { name, plate, color, year: y });
                  toast.success("Avtomobil yangilandi");
                } else {
                  driverProfileStore.addVehicle(driverId, { name, plate, color, year: y });
                  toast.success("Avtomobil qo'shildi");
                }
                onClose();
              }}
            >
              {editing ? "Saqlash" : "Qo'shish"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CardDialog({ open, onClose, driverId, holderDefault }: { open: boolean; onClose: () => void; driverId: string; holderDefault: string }) {
  const [brand, setBrand] = useState<PaymentCard["brand"]>("UZCARD");
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState(holderDefault);
  const [expiry, setExpiry] = useState("");
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Karta qo'shish</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Karta turi</Label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {(["UZCARD", "HUMO", "VISA"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBrand(b)}
                  className={`rounded-lg border py-2 text-xs font-bold ${brand === b ? "border-[#1D4ED8] bg-blue-50 text-[#1D4ED8]" : "border-slate-200 text-slate-500"}`}
                >{b}</button>
              ))}
            </div>
          </div>
          <div><Label>Karta raqami</Label><Input inputMode="numeric" placeholder="8600 1234 5678 8890" value={number} onChange={(e) => setNumber(e.target.value)} className="mt-1.5 font-mono" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Amal qilish</Label><Input placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="mt-1.5 font-mono" /></div>
            <div><Label>Egasi</Label><Input value={holder} onChange={(e) => setHolder(e.target.value)} className="mt-1.5" /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Bekor</Button>
          <Button onClick={() => {
            const digits = number.replace(/\D/g, "");
            if (digits.length < 4) { toast.error("Karta raqamini to'liq kiriting"); return; }
            if (!/^\d{2}\/\d{2}$/.test(expiry)) { toast.error("Muddat MM/YY formatida"); return; }
            driverProfileStore.addCard(driverId, { brand, last4: digits.slice(-4), holder, expiry });
            toast.success("Karta qo'shildi");
            setNumber(""); setExpiry("");
            onClose();
          }}>Qo'shish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AccountSettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="max-w-sm gap-0 overflow-hidden rounded-2xl border-0 bg-[#0F172A] p-0 text-white shadow-2xl [&>button]:hidden"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h2 className="text-lg font-extrabold">Hisob sozlamalari</h2>
          <button onClick={onClose} aria-label="Yopish" className="grid h-7 w-7 place-items-center rounded-full text-slate-300 hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2 px-3 pb-3">
          <DarkRow label="Parolni o'zgartirish" onClick={() => toast("Parol o'zgartirish havolasi emailga yuborildi")} />
          <DarkRow label="Tilni tanlash" hint="O'zbekcha" onClick={() => toast("Til: O'zbekcha (faol)")} />
          <DarkRow label="Maxfiylik siyosati" onClick={() => toast.message("Maxfiylik siyosati", { description: "Tez orada qo'shiladi" })} />
          <DarkRow label="Ma'lumotlarni yuklab olish" onClick={() => toast.success("So'rov yuborildi")} />
          <DarkRow label="Hisobni o'chirish" danger onClick={() => toast.error("Hisobni o'chirish uchun qo'llab-quvvatlashga murojaat qiling")} />
        </div>
        <div className="px-5 pb-5 pt-1">
          <Button onClick={onClose} className="w-full rounded-xl bg-[#1D4ED8] py-5 text-sm font-bold hover:bg-[#1E40AF]">Yopish</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DarkRow({ label, onClick, danger, hint }: { label: string; onClick: () => void; danger?: boolean; hint?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-3.5 text-left text-sm font-semibold ring-1 ring-white/5 transition hover:bg-white/10 ${danger ? "text-rose-400" : "text-white"}`}
    >
      <div className="flex flex-col">
        <span>{label}</span>
        {hint && <span className="mt-0.5 text-[11px] font-medium text-slate-400">{hint}</span>}
      </div>
      <ChevronRight className={`h-4 w-4 ${danger ? "text-rose-400" : "text-slate-400"}`} />
    </button>
  );
}

function SignOutDialog({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Chiqishni tasdiqlang</DialogTitle></DialogHeader>
        <p className="text-sm text-slate-600">Tizimdan chiqishni xohlaysizmi? Faol sessiyalar saqlanib qoladi.</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Bekor</Button>
          <Button className="bg-rose-600 hover:bg-rose-700" onClick={onConfirm}><LogOut className="h-4 w-4 mr-1" /> Chiqish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// keep referenced icons used somewhere to avoid unused warnings
void CheckCircle2; void X; void Info;
