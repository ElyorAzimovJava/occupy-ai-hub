import { useSyncExternalStore } from "react";
import { DRIVER_ACCOUNTS, type DriverVehicle, useCurrentDriver } from "./session";

export interface PaymentCard {
  id: string;
  brand: "UZCARD" | "HUMO" | "VISA";
  last4: string;
  holder: string;
  expiry: string; // MM/YY
  primary: boolean;
}

export interface NotifPrefs {
  bookingUpdates: boolean;
  promos: boolean;
  expiry: boolean;
  sms: boolean;
}

export interface DriverProfileData {
  name: string;
  phone: string;
  email: string;
  avatarSeed: number;
  vehicles: DriverVehicle[];
  cards: PaymentCard[];
  notif: NotifPrefs;
}

const KEY_PREFIX = "osonparking.driverProfile.";
const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, DriverProfileData>();

function defaults(driverId: string): DriverProfileData {
  const d = DRIVER_ACCOUNTS.find((x) => x.id === driverId) ?? DRIVER_ACCOUNTS[0];
  return {
    name: d.name,
    phone: d.phone,
    email: d.email,
    avatarSeed: 12,
    vehicles: d.vehicles.map((v) => ({ ...v })),
    cards: [
      { id: "c1", brand: "UZCARD", last4: "8890", holder: d.name, expiry: "08/27", primary: true },
    ],
    notif: { bookingUpdates: true, promos: false, expiry: true, sms: true },
  };
}

function load(driverId: string): DriverProfileData {
  if (typeof window === "undefined") return defaults(driverId);
  const c = cache.get(driverId);
  if (c) return c;
  try {
    const raw = localStorage.getItem(KEY_PREFIX + driverId);
    const v = raw ? (JSON.parse(raw) as DriverProfileData) : defaults(driverId);
    cache.set(driverId, v);
    return v;
  } catch {
    const v = defaults(driverId);
    cache.set(driverId, v);
    return v;
  }
}

function save(driverId: string, next: DriverProfileData) {
  cache.set(driverId, next);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_PREFIX + driverId, JSON.stringify(next));
  }
  listeners.get(driverId)?.forEach((l) => l());
}

function subscribe(driverId: string, l: () => void) {
  let set = listeners.get(driverId);
  if (!set) { set = new Set(); listeners.set(driverId, set); }
  set.add(l);
  return () => { set!.delete(l); };
}

export const driverProfileStore = {
  get: load,
  update(driverId: string, patch: Partial<DriverProfileData>) {
    save(driverId, { ...load(driverId), ...patch });
  },
  addVehicle(driverId: string, v: Omit<DriverVehicle, "id">) {
    const cur = load(driverId);
    const nv: DriverVehicle = { ...v, id: "v" + Date.now() };
    save(driverId, { ...cur, vehicles: [...cur.vehicles, nv] });
  },
  updateVehicle(driverId: string, id: string, patch: Partial<DriverVehicle>) {
    const cur = load(driverId);
    save(driverId, { ...cur, vehicles: cur.vehicles.map((v) => v.id === id ? { ...v, ...patch } : v) });
  },
  removeVehicle(driverId: string, id: string) {
    const cur = load(driverId);
    save(driverId, { ...cur, vehicles: cur.vehicles.filter((v) => v.id !== id) });
  },
  addCard(driverId: string, c: Omit<PaymentCard, "id" | "primary"> & { primary?: boolean }) {
    const cur = load(driverId);
    const nc: PaymentCard = { ...c, id: "c" + Date.now(), primary: c.primary ?? cur.cards.length === 0 };
    let cards = [...cur.cards, nc];
    if (nc.primary) cards = cards.map((x) => ({ ...x, primary: x.id === nc.id }));
    save(driverId, { ...cur, cards });
  },
  setPrimaryCard(driverId: string, id: string) {
    const cur = load(driverId);
    save(driverId, { ...cur, cards: cur.cards.map((c) => ({ ...c, primary: c.id === id })) });
  },
  removeCard(driverId: string, id: string) {
    const cur = load(driverId);
    const left = cur.cards.filter((c) => c.id !== id);
    if (left.length && !left.some((c) => c.primary)) left[0].primary = true;
    save(driverId, { ...cur, cards: left });
  },
  setNotif(driverId: string, patch: Partial<NotifPrefs>) {
    const cur = load(driverId);
    save(driverId, { ...cur, notif: { ...cur.notif, ...patch } });
  },
};

export function useDriverProfile(): [DriverProfileData, string] {
  const driver = useCurrentDriver();
  const data = useSyncExternalStore(
    (l) => subscribe(driver.id, l),
    () => load(driver.id),
    () => defaults(driver.id),
  );
  return [data, driver.id];
}