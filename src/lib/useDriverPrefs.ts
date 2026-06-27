import { useEffect, useState } from "react";

const KEY = "oson:driver:prefs";

export interface DriverPrefs {
  radiusKm: number;
}

const DEFAULTS: DriverPrefs = { radiusKm: 3 };

export function useDriverPrefs() {
  const [prefs, setPrefs] = useState<DriverPrefs>(DEFAULTS);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);
  const update = (patch: Partial<DriverPrefs>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  return [prefs, update] as const;
}