import { useSyncExternalStore } from "react";

type Key = string;
interface Entry { lotId: string; level: string; spot: string; bookingId?: string; at: number }

const STORAGE = "osonparking.spots.v1";
const listeners = new Set<() => void>();
let cache: Record<Key, Entry> = {};
let loaded = false;
let version = 0;
const setCache = new Map<string, { v: number; set: Set<string> }>();

function load(): Record<Key, Entry> {
  if (typeof window === "undefined") return {};
  if (!loaded) {
    try { cache = JSON.parse(localStorage.getItem(STORAGE) || "{}"); } catch { cache = {}; }
    loaded = true;
  }
  return cache;
}
function save(next: Record<Key, Entry>) {
  if (typeof window === "undefined") return;
  cache = next;
  loaded = true;
  localStorage.setItem(STORAGE, JSON.stringify(next));
  version++;
  listeners.forEach((l) => l());
}
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE) {
      try { cache = JSON.parse(e.newValue || "{}"); } catch { cache = {}; }
      loaded = true;
      version++;
      listeners.forEach((l) => l());
    }
  });
}

const k = (lotId: string, level: string, spot: string) => `${lotId}::${level}::${spot}`;
function getSet(lotId: string, level: string): Set<string> {
  const key = `${lotId}::${level}`;
  const hit = setCache.get(key);
  if (hit && hit.v === version) return hit.set;
  const out = new Set<string>();
  const m = load();
  for (const kk in m) {
    const e = m[kk];
    if (e.lotId === lotId && e.level === level) out.add(e.spot);
  }
  setCache.set(key, { v: version, set: out });
  return out;
}

export const spotStore = {
  all: load,
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  occupy(lotId: string, level: string, spot: string, bookingId?: string) {
    const next = { ...load() };
    next[k(lotId, level, spot)] = { lotId, level, spot, bookingId, at: Date.now() };
    save(next);
  },
  release(lotId: string, level: string, spot: string) {
    const next = { ...load() };
    delete next[k(lotId, level, spot)];
    save(next);
  },
  releaseByBooking(bookingId: string) {
    const next = { ...load() };
    let changed = false;
    for (const key of Object.keys(next)) {
      if (next[key].bookingId === bookingId) { delete next[key]; changed = true; }
    }
    if (changed) save(next);
  },
  occupiedSet(lotId: string, level: string): Set<string> { return getSet(lotId, level); },
};

const EMPTY = new Set<string>();
export function useOccupiedSpots(lotId: string, level: string): Set<string> {
  return useSyncExternalStore(
    spotStore.subscribe,
    () => getSet(lotId, level),
    () => EMPTY,
  );
}
