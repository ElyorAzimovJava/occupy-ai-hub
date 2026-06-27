import type { ParkingSlot, SlotStatus } from "@/lib/mockData";

const stateClass: Record<SlotStatus, string> = {
  available: "bg-slot-available/15 border-slot-available/40 text-slot-available",
  occupied: "bg-slot-occupied/15 border-slot-occupied/40 text-slot-occupied",
  reserved: "bg-slot-reserved/15 border-slot-reserved/40 text-slot-reserved",
  disabled: "bg-slot-disabled/10 border-slot-disabled/30 text-slot-disabled opacity-50",
};

const statusLabel: Record<SlotStatus, string> = {
  available: "Bo'sh",
  occupied: "Band",
  reserved: "Zahira",
  disabled: "Yopiq",
};

export function ParkingGrid({
  slots,
  cols = 10,
  compact = false,
  onSelect,
}: {
  slots: ParkingSlot[];
  cols?: number;
  compact?: boolean;
  onSelect?: (s: ParkingSlot) => void;
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {slots.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect?.(s)}
          className={`relative ${compact ? "aspect-[1.2/1]" : "aspect-[1.4/1]"} rounded-md border text-[10px] font-semibold transition hover:scale-[1.03] ${stateClass[s.status]}`}
          title={`${s.label} • ${s.status}${s.plate ? ` • ${s.plate}` : ""}`}
        >
          <span className="absolute inset-0 grid place-items-center">{s.label}</span>
          {s.status === "occupied" && (
            <span className="absolute right-1 top-1 h-1.5 w-1.5 animate-pulse rounded-full bg-slot-occupied" />
          )}
        </button>
      ))}
    </div>
  );
}

export function SlotLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      {(["available", "occupied", "reserved", "disabled"] as SlotStatus[]).map((k) => (
        <div key={k} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-sm border ${stateClass[k]}`} />
          <span>{statusLabel[k]}</span>
        </div>
      ))}
    </div>
  );
}
