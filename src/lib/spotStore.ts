import { useSyncExternalStore } from "react";

type Key = string; // `${lotId}::${level}::${spot}`
interface Entry { lotId: string; level: string; spot: string; bookingId?: string; at: number }

const STORAGE = "osonparking.spots.v1";
const listeners = new Set<() => void>();
let cache: Record<Key, Entry> = {};
let loaded = false;

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
  listeners.forEach((l) => l());
}
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE) {
      try { cache = JSON.parse(e.newValue || "{}"); } catch { cache = {}; }
      loaded = true;
      listeners.forEach((l) => l());
    }
  });
}

const k = (lotId: string, level: string, spot: string) => `${lotId}::${level}::${spot}`;

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
  occupiedSet(lotId: string, level: string): Set<string> {
    const out = new Set<string>();
    const m = load();
    for (const key in m) {
      const e = m[key];
      if (e.lotId === lotId && e.level === level) out.add(e.spot);
    }
    return out;
  },
};

const EMPTY = new Set<string>();
export function useOccupiedSpots(lotId: string, level: string): Set<string> {
  return useSyncExternalStore(
    spotStore.subscribe,
    () => spotStore.occupiedSet(lotId, level),
    () => EMPTY,
  );
}
