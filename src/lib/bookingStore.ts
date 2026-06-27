import { useSyncExternalStore } from "react";

export type DriverBookingStatus = "pending" | "active" | "completed" | "cancelled";

export interface DriverBooking {
  id: string;
  lotId: string;
  lotName: string;
  lotAddress: string;
  spot: string;
  level: string;
  driverName: string;
  driverPhone: string;
  driverInitials: string;
  vehicle: string;
  plate: string;
  rateUzs: number;
  status: DriverBookingStatus;
  createdAt: number;        // bron qilingan vaqt
  confirmedAt?: number;     // owner tasdiqlagan vaqt — charge shu yerdan boshlanadi
  endedAt?: number;
  amountUzs?: number;
}

const KEY = "osonparking.bookings.v1";
const listeners = new Set<() => void>();

function read(): DriverBooking[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(items: DriverBooking[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) listeners.forEach((l) => l());
  });
}

function rid() {
  return "OSP-" + Math.floor(100000 + Math.random() * 900000);
}

export const bookingStore = {
  list: read,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => { listeners.delete(l); };
  },
  create(input: Omit<DriverBooking, "id" | "status" | "createdAt">): DriverBooking {
    const item: DriverBooking = { ...input, id: rid(), status: "pending", createdAt: Date.now() };
    write([item, ...read()]);
    return item;
  },
  confirm(id: string) {
    write(read().map((x) => (x.id === id ? { ...x, status: "active", confirmedAt: Date.now() } : x)));
  },
  end(id: string) {
    write(read().map((x) => {
      if (x.id !== id) return x;
      const now = Date.now();
      const hours = x.confirmedAt ? Math.max(1 / 60, (now - x.confirmedAt) / 3600000) : 0;
      return { ...x, status: "completed", endedAt: now, amountUzs: Math.round(hours * x.rateUzs) };
    }));
  },
  cancel(id: string) {
    write(read().map((x) => (x.id === id ? { ...x, status: "cancelled", endedAt: Date.now() } : x)));
  },
  reject(id: string) {
    write(read().map((x) => (x.id === id ? { ...x, status: "cancelled", endedAt: Date.now() } : x)));
  },
};

const emptyArr: DriverBooking[] = [];
export function useBookings(): DriverBooking[] {
  return useSyncExternalStore(bookingStore.subscribe, read, () => emptyArr);
}

export function formatUzsPlain(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}