import type { ParkingLot } from "./mockData";

// Uzbekistan market assumptions (2026)
export const FUEL_PRICE_UZS = 12500; // AI-95 ~10-15k UZS per liter (2026 Uzbek market)
export const FUEL_CONSUMPTION = 9 / 100; // L per km, realistic city consumption
export const CITY_SPEED_KMH = 25;
export const USD_TO_UZS = 12500;

function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const x = s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export interface AiCandidate {
  lot: ParkingLot;
  distanceKm: number;
  driveMin: number;
  fuelLiters: number;
  fuelCostUzs: number;
  parkingCostUzs: number;
  totalCostUzs: number;
  freeSpots: number;
  occupancyPct: number;
  score: number;
  rank: number;
  reasons: string[];
  warnings: string[];
}

export interface AiVerdict {
  best: AiCandidate;
  alternatives: AiCandidate[];
  summary: string;
  ranked: AiCandidate[];
}

function priceUzs(lot: ParkingLot) {
  // pricePerHour is in USD in mock data; convert to UZS
  return Math.round(lot.pricePerHour * USD_TO_UZS);
}

export function evaluateLot(lot: ParkingLot, origin: { lat: number; lng: number }): AiCandidate {
  const distanceM = haversineMeters(origin, { lat: lot.lat, lng: lot.lng });
  const distanceKm = distanceM / 1000;
  const driveMin = Math.max(1, Math.round((distanceKm / CITY_SPEED_KMH) * 60));
  const fuelLiters = +(distanceKm * FUEL_CONSUMPTION).toFixed(2);
  const fuelCostUzs = Math.round(fuelLiters * FUEL_PRICE_UZS);
  const parkingCostUzs = priceUzs(lot);
  const totalCostUzs = fuelCostUzs + parkingCostUzs;
  const freeSpots = Math.max(0, lot.total - lot.occupied - lot.reserved);
  const occupancyPct = Math.round(((lot.occupied + lot.reserved) / lot.total) * 100);

  const reasons: string[] = [];
  const warnings: string[] = [];
  if (distanceKm < 1.5) reasons.push(`Juda yaqin (${distanceKm.toFixed(1)} km)`);
  if (driveMin <= 5) reasons.push(`Tez yetib boriladi (${driveMin} daq)`);
  if (lot.rating >= 4.6) reasons.push(`Yuqori reyting (${lot.rating})`);
  if (freeSpots > 20) reasons.push(`${freeSpots} ta bo'sh joy mavjud`);
  if (parkingCostUzs <= 15000) reasons.push("Hamyonbop narx");

  if (freeSpots === 0) warnings.push("Joylar to'la");
  else if (freeSpots <= 5) warnings.push(`Faqat ${freeSpots} ta joy qoldi`);
  if (occupancyPct >= 90) warnings.push(`Yuklama yuqori (${occupancyPct}%)`);
  if (distanceKm > 5) warnings.push("Masofa uzoq");

  return {
    lot, distanceKm, driveMin, fuelLiters, fuelCostUzs, parkingCostUzs, totalCostUzs,
    freeSpots, occupancyPct, score: 0, rank: 0, reasons, warnings,
  };
}

export function aiRecommend(lots: ParkingLot[], origin: { lat: number; lng: number }): AiVerdict {
  const candidates = lots.map((l) => evaluateLot(l, origin));
  const usable = candidates.filter((c) => c.freeSpots > 0);
  const pool = usable.length ? usable : candidates;

  const maxDist = Math.max(...pool.map((c) => c.distanceKm), 1);
  const maxCost = Math.max(...pool.map((c) => c.totalCostUzs), 1);

  for (const c of pool) {
    const distScore = c.distanceKm / maxDist;          // lower is better
    const costScore = c.totalCostUzs / maxCost;        // lower is better
    const ratingScore = (5 - c.lot.rating) / 5;        // lower is better
    const availScore = 1 - c.freeSpots / c.lot.total;  // lower is better
    c.score = +(distScore * 0.40 + costScore * 0.25 + ratingScore * 0.15 + availScore * 0.20).toFixed(4);
  }
  pool.sort((a, b) => a.score - b.score);
  pool.forEach((c, i) => (c.rank = i + 1));

  const best = pool[0];
  const alternatives = pool.slice(1, 6);

  const summary = `AI ${pool.length} ta variantni masofa, vaqt, yoqilg'i sarfi va narx bo'yicha tahlil qildi. ` +
    `Eng yaxshi tanlov — ${best.lot.name}: ${best.distanceKm.toFixed(1)} km, ${best.driveMin} daq, ` +
    `~${best.totalCostUzs.toLocaleString("uz-UZ")} UZS umumiy xarajat. ` +
    (best.freeSpots > 10
      ? `Joy yetarli (${best.freeSpots} ta bo'sh).`
      : `Diqqat: ${best.freeSpots} ta joy qoldi — tezroq band qiling.`);

  return { best, alternatives, summary, ranked: pool };
}

export function formatUzs(n: number) {
  return `${n.toLocaleString("uz-UZ")} UZS`;
}