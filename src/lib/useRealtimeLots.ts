import { useEffect, useState } from "react";
import { mockLots, type ParkingLot } from "./mockData";

// Simulates real-time occupancy updates by mutating occupied/reserved every few seconds.
export function useRealtimeLots(intervalMs = 4000): ParkingLot[] {
  const [lots, setLots] = useState<ParkingLot[]>(mockLots);
  useEffect(() => {
    const id = setInterval(() => {
      setLots((prev) =>
        prev.map((l) => {
          const delta = Math.round((Math.random() - 0.5) * 6);
          const occupied = Math.min(l.total - l.reserved, Math.max(0, l.occupied + delta));
          const reservedDelta = Math.round((Math.random() - 0.5) * 2);
          const reserved = Math.min(l.total - occupied, Math.max(0, l.reserved + reservedDelta));
          return { ...l, occupied, reserved };
        }),
      );
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return lots;
}