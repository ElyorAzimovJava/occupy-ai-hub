import { useSyncExternalStore } from "react";

export type Role = "admin" | "owner" | "driver";

export interface OwnerAccount {
  role: "owner";
  email: string;
  password: string;
  ownerId: string;
  lotId: string;
  name: string;
  company: string;
  initials: string;
}

export interface DriverVehicle {
  id: string;
  name: string;
  plate: string;
  color: string;
  year: number;
}

export interface DriverAccount {
  role: "driver";
  email: string;
  password: string;
  id: string;
  name: string;
  phone: string;
  initials: string;
  rating: number;
  trips: number;
  vehicles: DriverVehicle[];
}

export interface AdminAccount {
  role: "admin";
  email: string;
  password: string;
  name: string;
  initials: string;
}

export type Account = OwnerAccount | DriverAccount | AdminAccount;

// ===== Owner accounts (paired with mockOwners + mockLots) =====
export const OWNER_ACCOUNTS: OwnerAccount[] = [
  { role: "owner", email: "alisher@tcc.uz",         password: "owner123", ownerId: "o-1",  lotId: "lot-1",  name: "Alisher Karimov",         company: "Tashkent City Holdings",  initials: "AK" },
  { role: "owner", email: "nigora@magic.uz",        password: "owner123", ownerId: "o-2",  lotId: "lot-2",  name: "Nigora Tursunova",        company: "Magic Realty",            initials: "NT" },
  { role: "owner", email: "dilshod@compass.uz",     password: "owner123", ownerId: "o-4",  lotId: "lot-3",  name: "Dilshod Akhmedov",        company: "Compass Group",           initials: "DA" },
  { role: "owner", email: "sevara@parkgo.uz",       password: "owner123", ownerId: "o-5",  lotId: "lot-4",  name: "Sevara Rakhimova",        company: "Park&Go",                 initials: "SR" },
  { role: "owner", email: "otabek@riviera.uz",      password: "owner123", ownerId: "o-6",  lotId: "lot-5",  name: "Otabek Rustamov",         company: "Riviera Holdings",        initials: "OR" },
  { role: "owner", email: "laziz@next.uz",          password: "owner123", ownerId: "o-7",  lotId: "lot-6",  name: "Laziz Tursunov",          company: "Next Properties",         initials: "LT" },
  { role: "owner", email: "madina@yunusabad.uz",    password: "owner123", ownerId: "o-9",  lotId: "lot-8",  name: "Madina Sharipova",        company: "Yunusabad Estates",       initials: "MS" },
  { role: "owner", email: "zarina@atlas.uz",        password: "owner123", ownerId: "o-10", lotId: "lot-12", name: "Zarina Ismoilova",        company: "Atlas Group",             initials: "ZI" },
  { role: "owner", email: "rustam@gulistonbz.uz",   password: "owner123", ownerId: "o-11", lotId: "lot-13", name: "Rustam Mamadaliyev",      company: "Guliston Bazaar Holdings", initials: "RM" },
  { role: "owner", email: "feruza@sirdaryoplaza.uz",password: "owner123", ownerId: "o-12", lotId: "lot-14", name: "Feruza Norqulova",        company: "Sirdaryo Plaza LLC",      initials: "FN" },
];

// ===== Driver accounts =====
export const DRIVER_ACCOUNTS: DriverAccount[] = [
  {
    role: "driver", email: "azizbek@driver.uz", password: "driver123",
    id: "d-1", name: "Azizbek Karimov", phone: "+998 90 123 45 67", initials: "AK",
    rating: 4.9, trips: 142,
    vehicles: [
      { id: "v1", name: "Toyota Camry",      plate: "01 A 777 BA", color: "Oq",     year: 2022 },
      { id: "v2", name: "Chevrolet Cobalt",  plate: "01 B 442 KK", color: "Kumush", year: 2020 },
    ],
  },
  {
    role: "driver", email: "javohir@driver.uz", password: "driver123",
    id: "d-2", name: "Javohir Rahimov", phone: "+998 91 444 22 11", initials: "JR",
    rating: 4.8, trips: 87,
    vehicles: [
      { id: "v1", name: "Chevrolet Malibu",  plate: "01 A 123 BC", color: "Qora",   year: 2023 },
      { id: "v2", name: "Hyundai Sonata",    plate: "01 C 909 EE", color: "Oq",     year: 2021 },
    ],
  },
  {
    role: "driver", email: "diyora@driver.uz", password: "driver123",
    id: "d-3", name: "Diyora Saidova", phone: "+998 93 555 66 77", initials: "DS",
    rating: 5.0, trips: 56,
    vehicles: [
      { id: "v1", name: "Kia K5",            plate: "01 D 321 KK", color: "Kulrang", year: 2024 },
    ],
  },
];

// ===== Admin =====
export const ADMIN_ACCOUNTS: AdminAccount[] = [
  { role: "admin", email: "admin@osonparking.com", password: "admin123", name: "Aziz Sultan", initials: "AS" },
];

export const ALL_ACCOUNTS: Account[] = [
  ...ADMIN_ACCOUNTS, ...OWNER_ACCOUNTS, ...DRIVER_ACCOUNTS,
];

// ===== Session store =====
const KEY = "osonparking.session.v1";
const listeners = new Set<() => void>();
let cache: Account | null = null;
let loaded = false;

function read(): Account | null {
  if (typeof window === "undefined") return null;
  if (!loaded) {
    try {
      const raw = localStorage.getItem(KEY);
      cache = raw ? (JSON.parse(raw) as Account) : null;
    } catch { cache = null; }
    loaded = true;
  }
  return cache;
}
function write(a: Account | null) {
  if (typeof window === "undefined") return;
  cache = a;
  loaded = true;
  if (a) localStorage.setItem(KEY, JSON.stringify(a));
  else localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      try { cache = e.newValue ? JSON.parse(e.newValue) : null; } catch { cache = null; }
      loaded = true;
      listeners.forEach((l) => l());
    }
  });
}

export const session = {
  get: read,
  set: write,
  signOut() { write(null); },
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  authenticate(email: string, password: string): Account | null {
    const e = email.trim().toLowerCase();
    const acc = ALL_ACCOUNTS.find((a) => a.email.toLowerCase() === e && a.password === password);
    if (acc) write(acc);
    return acc ?? null;
  },
  signInAsRole(role: Role): Account {
    const acc =
      role === "admin" ? ADMIN_ACCOUNTS[0] :
      role === "owner" ? OWNER_ACCOUNTS[0] :
      DRIVER_ACCOUNTS[0];
    write(acc);
    return acc;
  },
};

export function useSession(): Account | null {
  return useSyncExternalStore(session.subscribe, read, () => null);
}

export function useCurrentOwner(): OwnerAccount {
  const s = useSession();
  if (s && s.role === "owner") return s;
  return OWNER_ACCOUNTS[0];
}

export function useCurrentDriver(): DriverAccount {
  const s = useSession();
  if (s && s.role === "driver") return s;
  return DRIVER_ACCOUNTS[0];
}