import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  MapPin, Star, Car, Wallet, ShieldCheck, ArrowRight, ArrowLeft,
  CheckCircle2, Clock, Phone, User, Plus, ChevronRight, Sparkles, AlertCircle,
} from "lucide-react";
import { mockLots } from "@/lib/mockData";
import { useRealtimeLots } from "@/lib/useRealtimeLots";
import { useGeolocation } from "@/lib/useGeolocation";
import { formatUzs, USD_TO_UZS } from "@/lib/aiRecommend";
import { formatDistance } from "@/components/ParkingMap";
import { bookingStore } from "@/lib/bookingStore";

type SearchParams = { lot?: string };

export const Route = createFileRoute("/driver/booking")({
  head: () => ({ meta: [{ title: "Bron qilish - Driver" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    lot: typeof s.lot === "string" ? s.lot : undefined,
  }),
  component: BookingFlow,
});

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

const DRIVER = {
  name: "Azizbek Karimov",
  phone: "+998 90 123 45 67",
  rating: 4.9,
  trips: 142,
  initials: "AK",
};

const VEHICLES = [
  { id: "v1", name: "Toyota Camry", plate: "01 A 777 BA", color: "Oq", year: 2022 },
  { id: "v2", name: "Chevrolet Cobalt", plate: "01 B 442 KK", color: "Kumush", year: 2020 },
];

const PAYMENTS = [
  { id: "p1", brand: "UZCARD", last4: "4455", expiry: "09/27" },
  { id: "p2", brand: "HUMO", last4: "8821", expiry: "12/26" },
];

function BookingFlow() {
  const { lot: lotId } = Route.useSearch();
  const lots = useRealtimeLots();
  const geo = useGeolocation();
  const navigate = useNavigate();

  const lot = useMemo(
    () => lots.find((l) => l.id === lotId) ?? mockLots.find((l) => l.id === lotId) ?? lots[0] ?? mockLots[0],
    [lots, lotId],
  );
  const free = Math.max(0, lot.total - lot.occupied - lot.reserved);
  const isFull = free <= 0;

  const origin = geo.loc ?? { lat: lot.lat + 0.04, lng: lot.lng + 0.03 };
  const distanceKm = haversineKm(origin, { lat: lot.lat, lng: lot.lng });
  const driveMin = Math.max(2, Math.round((distanceKm / 25) * 60));

  const hourlyUzs = Math.round(lot.pricePerHour * USD_TO_UZS);
  const serviceFeeUzs = 2000;
  const totalUzs = hourlyUzs + serviceFeeUzs;

  const [vehicleId, setVehicleId] = useState(VEHICLES[0].id);
  const [paymentId, setPaymentId] = useState(PAYMENTS[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const vehicle = VEHICLES.find((v) => v.id === vehicleId)!;
  const payment = PAYMENTS.find((p) => p.id === paymentId)!;

  const confirm = () => {
    if (isFull || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      const booking = bookingStore.create({
        lotId: lot.id,
        lotName: lot.name,
        lotAddress: lot.address,
        spot: `A-${Math.floor(Math.random() * 30) + 1}`,
        level: "P2",
        driverName: DRIVER.name,
        driverPhone: DRIVER.phone,
        driverInitials: DRIVER.initials,
        vehicle: vehicle.name,
        plate: vehicle.plate,
        rateUzs: hourlyUzs,
      });
      setCreatedId(booking.id);
      setSubmitting(false);
      setDone(true);
    }, 1100);
  };

  if (done) {
    return (
      <SuccessScreen
        bookingId={createdId ?? "OSP-000000"}
        lotName={lot.name}
        plate={vehicle.plate}
        totalUzs={totalUzs}
        onContinue={() => navigate({ to: "/driver/activity" })}
      />
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/driver/search"
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Bron qilish</div>
          <div className="text-lg font-extrabold text-slate-900">Tasdiqlash</div>
        </div>
      </div>

      {/* Parking Info */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">
        <div className="relative h-32">
          <img src={lot.image} alt={lot.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-800 backdrop-blur">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {lot.rating}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="text-lg font-extrabold leading-tight text-white drop-shadow">{lot.name}</div>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-white/90">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{lot.address}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-200">
          <Stat label="Masofa" value={formatDistance(distanceKm * 1000)} />
          <Stat label="Vaqt" value={`${driveMin} daq`} />
          <Stat
            label="Bo'sh joy"
            value={isFull ? "Yo'q" : String(free)}
            tone={isFull ? "rose" : free <= 5 ? "amber" : "emerald"}
          />
        </div>

        <div className="flex items-center justify-between bg-blue-50/60 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Wallet className="h-4 w-4 text-[#1D4ED8]" />
            <span>Soatlik narx</span>
          </div>
          <div className="text-base font-extrabold text-[#1D4ED8]">{formatUzs(hourlyUzs)}/soat</div>
        </div>
      </div>

      {isFull && (
        <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="font-bold">Joylar to'la</div>
            <div>Hozircha bo'sh joy yo'q. Iltimos, boshqa parkingni tanlang.</div>
          </div>
        </div>
      )}

      {/* Driver Info */}
      <Section title="Haydovchi ma'lumotlari" icon={<User className="h-4 w-4 text-slate-400" />}>
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] text-sm font-bold text-white ring-2 ring-blue-100">
            {DRIVER.initials}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-slate-900">{DRIVER.name}</div>
            <div className="mt-0.5 flex items-center gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{DRIVER.phone}</span>
              <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{DRIVER.rating}</span>
            </div>
          </div>
          <div className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
            Tasdiqlangan
          </div>
        </div>
      </Section>

      {/* Vehicle */}
      <Section title="Avtomobil" icon={<Car className="h-4 w-4 text-slate-400" />}>
        <div className="space-y-2">
          {VEHICLES.map((v) => {
            const active = v.id === vehicleId;
            return (
              <button
                key={v.id}
                onClick={() => setVehicleId(v.id)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
                  active ? "border-[#1D4ED8] bg-blue-50/60" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-[#1D4ED8] ring-1 ring-slate-200">
                  <Car className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900">{v.name}</div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500">
                    {v.plate} · {v.color} · {v.year}
                  </div>
                </div>
                <div
                  className={`grid h-6 w-6 place-items-center rounded-full ${
                    active ? "bg-[#1D4ED8] text-white" : "bg-slate-100 text-transparent"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              </button>
            );
          })}
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-500 hover:border-[#1D4ED8] hover:text-[#1D4ED8]">
            <Plus className="h-4 w-4" /> Yangi avtomobil qo'shish
          </button>
        </div>
      </Section>

      {/* Payment */}
      <Section title="To'lov usuli" icon={<Wallet className="h-4 w-4 text-slate-400" />}>
        <div className="space-y-2">
          {PAYMENTS.map((p) => {
            const active = p.id === paymentId;
            return (
              <button
                key={p.id}
                onClick={() => setPaymentId(p.id)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
                  active ? "border-[#1D4ED8] bg-blue-50/60" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`grid h-9 w-12 place-items-center rounded-md text-[10px] font-extrabold italic text-white ${p.brand === "UZCARD" ? "bg-gradient-to-br from-emerald-500 to-emerald-700" : "bg-gradient-to-br from-amber-500 to-rose-500"}`}>
                  {p.brand}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900">•••• {p.last4}</div>
                  <div className="text-[11px] text-slate-500">Amal qilish: {p.expiry}</div>
                </div>
                <div
                  className={`grid h-6 w-6 place-items-center rounded-full ${
                    active ? "bg-[#1D4ED8] text-white" : "bg-slate-100 text-transparent"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Cost summary */}
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="text-base font-bold text-slate-900">Xarajat hisoboti</div>
        <div className="mt-3 space-y-2 text-sm">
          <Row k="Parking (1 soat)" v={formatUzs(hourlyUzs)} />
          <Row k="Xizmat haqi" v={formatUzs(serviceFeeUzs)} />
          <Row k="Yetib borish vaqti" v={`~ ${driveMin} daq`} />
        </div>
        <div className="my-4 border-t border-dashed border-slate-200" />
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-slate-700">Boshlang'ich to'lov</div>
          <div className="text-2xl font-extrabold text-[#1D4ED8]">{formatUzs(totalUzs)}</div>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          Joydan chiqqaningizda real vaqt asosida qayta hisoblanadi.
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={confirm}
        disabled={isFull || submitting}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1D4ED8] text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Sparkles className="h-5 w-5 animate-pulse" /> Bron qilinmoqda...
          </>
        ) : (
          <>
            Bron qilish <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
        <ShieldCheck className="h-3.5 w-3.5" /> SSL bilan himoyalangan to'lov
      </div>

      <div className="text-center text-[11px] text-slate-500">
        Tugmani bosish bilan siz{" "}
        <span className="font-bold text-[#1D4ED8]">Xizmat shartlari</span> va{" "}
        <span className="font-bold text-[#1D4ED8]">Maxfiylik siyosati</span>ni qabul qilasiz.
      </div>

      <div className="text-center text-[10px] text-slate-400">
        To'lov: {payment.brand} •••• {payment.last4}
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-bold text-slate-900">{title}</div>
        {icon}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "emerald" | "amber" | "rose" }) {
  const color =
    tone === "rose" ? "text-rose-600" : tone === "amber" ? "text-amber-600" : tone === "emerald" ? "text-emerald-600" : "text-slate-900";
  return (
    <div className="px-3 py-3 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 text-base font-extrabold ${color}`}>{value}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{k}</span>
      <span className="font-semibold text-slate-900">{v}</span>
    </div>
  );
}

function SuccessScreen({
  bookingId,
  lotName,
  plate,
  totalUzs,
  onContinue,
}: {
  bookingId: string;
  lotName: string;
  plate: string;
  totalUzs: number;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col items-center pt-6 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
        <div className="relative grid h-20 w-20 place-items-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-200">
          <Clock className="h-10 w-10" />
        </div>
      </div>
      <div className="mt-5 text-2xl font-extrabold text-slate-900">Bron yuborildi</div>
      <div className="mt-1 text-center text-sm text-slate-500 px-4">
        Parking xodimi sizning kelganingizni tasdiqlagach,<br/>vaqt va to'lov hisoblanishi boshlanadi.
      </div>

      <div className="mt-6 w-full rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-500">
          <span>Bron raqami</span>
          <span className="font-bold text-slate-900">{bookingId}</span>
        </div>
        <div className="my-3 border-t border-dashed border-slate-200" />
        <Row k="Parking" v={lotName} />
        <div className="h-2" />
        <Row k="Avtomobil" v={plate} />
        <div className="h-2" />
        <Row k="Boshlang'ich" v={formatUzs(totalUzs)} />
        <div className="h-2" />
        <Row k="Holat" v="⏳ Tasdiqlanmoqda" />
        <div className="my-3 border-t border-dashed border-slate-200" />
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-[#1D4ED8]" />
          Charge faqat tasdiqlangandan keyin boshlanadi
        </div>
      </div>

      <button
        onClick={onContinue}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1D4ED8] text-base font-bold text-white shadow-lg shadow-blue-500/30"
      >
        Faol sessiyani ko'rish <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
