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
const createListeners = new Set<(b: DriverBooking) => void>();
let cache: DriverBooking[] = [];
let cacheLoaded = false;

function read(): DriverBooking[] {
  if (typeof window === "undefined") return emptyArr;
  if (!cacheLoaded) {
    try { cache = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { cache = []; }
    cacheLoaded = true;
  }
  return cache;
}
function write(items: DriverBooking[]) {
  if (typeof window === "undefined") return;
  cache = items;
  cacheLoaded = true;
  localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      try { cache = JSON.parse(e.newValue || "[]"); } catch { cache = []; }
      cacheLoaded = true;
      listeners.forEach((l) => l());
    }
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
    createListeners.forEach((l) => l(item));
    if (typeof window !== "undefined") {
      try { window.dispatchEvent(new CustomEvent("osonparking:booking-created", { detail: item })); } catch {}
    }
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
  onCreate(cb: (b: DriverBooking) => void) {
    createListeners.add(cb);
    return () => { createListeners.delete(cb); };
  },
};

const emptyArr: DriverBooking[] = [];
export function useBookings(): DriverBooking[] {
  return useSyncExternalStore(bookingStore.subscribe, read, () => emptyArr);
}

export function formatUzsPlain(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}