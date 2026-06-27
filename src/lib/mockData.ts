export type SlotStatus = "available" | "occupied" | "reserved" | "disabled";

export interface ParkingSlot {
  id: string;
  label: string;
  status: SlotStatus;
  confidence?: number;
  plate?: string;
}

export interface ParkingLot {
  id: string;
  name: string;
  owner: string;
  address: string;
  total: number;
  occupied: number;
  reserved: number;
  pricePerHour: number;
  revenue: number;
  status: "active" | "maintenance" | "offline";
  lat: number;
  lng: number;
  image: string;
  rating: number;
}

export interface BusinessOwner {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  lots: number;
  revenue: number;
  status: "active" | "suspended" | "blocked";
  avatar: string;
}

export interface Camera {
  id: string;
  name: string;
  lot: string;
  status: "online" | "offline" | "warning";
  latency: number;
  accuracy: number;
  detections: number;
}

export interface Booking {
  id: string;
  driver: string;
  vehicle: string;
  plate: string;
  lot: string;
  space: string;
  start: string;
  end: string;
  status: "active" | "upcoming" | "completed" | "cancelled" | "pending";
  amount: number;
}

// Deterministic PRNG so SSR and client produce identical markup (no hydration mismatch)
function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const seedSlots = (n: number, occupiedRate = 0.55, seed = 42): ParkingSlot[] => {
  const rand = mulberry32(seed);
  return Array.from({ length: n }, (_, i) => {
    const r = rand();
    let status: SlotStatus = "available";
    if (r < occupiedRate) status = "occupied";
    else if (r < occupiedRate + 0.18) status = "reserved";
    else if (r > 0.96) status = "disabled";
    return {
      id: `s-${i + 1}`,
      label: `${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`,
      status,
      confidence: 0.82 + rand() * 0.17,
      plate: status === "occupied" ? randomPlate(rand) : undefined,
    };
  });
};

function randomPlate(rand: () => number = Math.random) {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return (
    letters[Math.floor(rand() * letters.length)] +
    letters[Math.floor(rand() * letters.length)] +
    " " +
    Math.floor(100 + rand() * 900) +
    " " +
    letters[Math.floor(rand() * letters.length)] +
    letters[Math.floor(rand() * letters.length)]
  );
}

export const mockSlots = seedSlots(60);

export const mockLots: ParkingLot[] = [
  { id: "lot-1", name: "Tashkent City Mall", owner: "Alisher Karimov", address: "Islom Karimov 1, Tashkent", total: 240, occupied: 168, reserved: 22, pricePerHour: 4, revenue: 18420, status: "active", lat: 41.3111, lng: 69.2797, image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80", rating: 4.7 },
  { id: "lot-2", name: "Magic City Garage", owner: "Nigora Tursunova", address: "Bunyodkor 2, Tashkent", total: 180, occupied: 98, reserved: 14, pricePerHour: 3, revenue: 12120, status: "active", lat: 41.2985, lng: 69.2340, image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80", rating: 4.5 },
  { id: "lot-3", name: "Compass Mall Lot", owner: "Dilshod Akhmedov", address: "Mustaqillik 14, Tashkent", total: 320, occupied: 210, reserved: 35, pricePerHour: 5, revenue: 28940, status: "active", lat: 41.3205, lng: 69.2901, image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800&q=80", rating: 4.8 },
  { id: "lot-4", name: "Mega Planet Parking", owner: "Sevara Rakhimova", address: "Katartal St 60, Tashkent", total: 410, occupied: 240, reserved: 38, pricePerHour: 3, revenue: 22310, status: "active", lat: 41.2842, lng: 69.2042, image: "https://images.unsplash.com/photo-1545179605-1296651e9d43?w=800&q=80", rating: 4.6 },
  { id: "lot-5", name: "Riviera Centre Garage", owner: "Otabek Rustamov", address: "Amir Temur 108, Tashkent", total: 150, occupied: 90, reserved: 12, pricePerHour: 4, revenue: 9870, status: "active", lat: 41.3267, lng: 69.2810, image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80", rating: 4.4 },
  { id: "lot-6", name: "Next Mall Parking", owner: "Laziz Tursunov", address: "Bogishamol 264, Tashkent", total: 280, occupied: 140, reserved: 22, pricePerHour: 3, revenue: 14260, status: "active", lat: 41.3502, lng: 69.3023, image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80", rating: 4.5 },
  { id: "lot-7", name: "Chorsu Bazaar Lot", owner: "Jamshid Olimov", address: "Chorsu Sq., Tashkent", total: 95, occupied: 80, reserved: 10, pricePerHour: 2, revenue: 5210, status: "active", lat: 41.3260, lng: 69.2349, image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800&q=80", rating: 4.1 },
  { id: "lot-8", name: "Yunusabad Plaza", owner: "Madina Sharipova", address: "Yunusabad 11, Tashkent", total: 200, occupied: 60, reserved: 8, pricePerHour: 3, revenue: 8120, status: "active", lat: 41.3661, lng: 69.2876, image: "https://images.unsplash.com/photo-1545179605-1296651e9d43?w=800&q=80", rating: 4.6 },
  { id: "lot-9", name: "Sergeli Trade Center", owner: "Iroda Yusupova", address: "Sergeli 4, Tashkent", total: 180, occupied: 110, reserved: 14, pricePerHour: 2, revenue: 6440, status: "active", lat: 41.2231, lng: 69.2204, image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80", rating: 4.2 },
  { id: "lot-10", name: "Oybek Metro Garage", owner: "Sardor Aliev", address: "Oybek St 22, Tashkent", total: 130, occupied: 95, reserved: 11, pricePerHour: 3, revenue: 7820, status: "active", lat: 41.2967, lng: 69.2680, image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80", rating: 4.5 },
  { id: "lot-11", name: "Samarkand Darvoza Lot", owner: "Bobur Yusupov", address: "Koratosh St, Tashkent", total: 220, occupied: 140, reserved: 20, pricePerHour: 3, revenue: 10940, status: "active", lat: 41.3084, lng: 69.2421, image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800&q=80", rating: 4.3 },
  { id: "lot-12", name: "Atlas Mall Underground", owner: "Zarina Ismoilova", address: "Mirzo Ulug'bek 80, Tashkent", total: 350, occupied: 200, reserved: 30, pricePerHour: 5, revenue: 24380, status: "maintenance", lat: 41.3398, lng: 69.3251, image: "https://images.unsplash.com/photo-1545179605-1296651e9d43?w=800&q=80", rating: 4.7 },
  // Sirdaryo viloyati - Guliston shahri
  { id: "lot-13", name: "Guliston Central Bazaar", owner: "Rustam Mamadaliyev", address: "Mustaqillik ko'chasi 4, Guliston", total: 120, occupied: 64, reserved: 9, pricePerHour: 2, revenue: 4820, status: "active", lat: 40.4897, lng: 68.7842, image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80", rating: 4.4 },
  { id: "lot-14", name: "Sirdaryo Plaza", owner: "Feruza Norqulova", address: "Islom Karimov shoh ko'chasi 22, Guliston", total: 180, occupied: 88, reserved: 12, pricePerHour: 3, revenue: 7340, status: "active", lat: 40.4925, lng: 68.7791, image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80", rating: 4.6 },
  { id: "lot-15", name: "Guliston Hokimiyat Parking", owner: "Akmal Hasanov", address: "A. Navoiy ko'chasi 1, Guliston", total: 90, occupied: 41, reserved: 6, pricePerHour: 2, revenue: 2640, status: "active", lat: 40.4868, lng: 68.7822, image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800&q=80", rating: 4.3 },
  { id: "lot-16", name: "Guliston Train Station Lot", owner: "Shahnoza Egamberdiyeva", address: "Vokzal maydoni, Guliston", total: 140, occupied: 96, reserved: 14, pricePerHour: 2, revenue: 3210, status: "active", lat: 40.4756, lng: 68.7705, image: "https://images.unsplash.com/photo-1545179605-1296651e9d43?w=800&q=80", rating: 4.1 },
  { id: "lot-17", name: "Guliston University Campus", owner: "Davron Yo'ldoshev", address: "Sirdaryo MDIU, Guliston", total: 160, occupied: 60, reserved: 10, pricePerHour: 1, revenue: 1980, status: "active", lat: 40.5012, lng: 68.7903, image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80", rating: 4.5 },
  { id: "lot-18", name: "Sirdaryo Sport Complex", owner: "Bahodir Tolipov", address: "Sport ko'chasi 7, Guliston", total: 110, occupied: 28, reserved: 4, pricePerHour: 2, revenue: 1420, status: "active", lat: 40.4934, lng: 68.7965, image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80", rating: 4.4 },
];

export const mockOwners: BusinessOwner[] = [
  { id: "o-1", name: "Alisher Karimov", company: "Tashkent City Holdings", email: "alisher@tcc.uz", phone: "+998 71 200 1010", lots: 1, revenue: 42100, status: "active", avatar: "AK" },
  { id: "o-2", name: "Nigora Tursunova", company: "Magic Realty", email: "nigora@magic.uz", phone: "+998 71 220 4040", lots: 1, revenue: 18300, status: "active", avatar: "NT" },
  { id: "o-3", name: "Bobur Yusupov", company: "Silk Parking Co.", email: "bobur@silk.uz", phone: "+998 66 233 8080", lots: 1, revenue: 9430, status: "active", avatar: "BY" },
  { id: "o-4", name: "Dilshod Akhmedov", company: "Compass Group", email: "dilshod@compass.uz", phone: "+998 71 244 1212", lots: 1, revenue: 61240, status: "active", avatar: "DA" },
  { id: "o-5", name: "Sevara Rakhimova", company: "Park&Go", email: "sevara@parkgo.uz", phone: "+998 71 211 5050", lots: 1, revenue: 22310, status: "active", avatar: "SR" },
  { id: "o-6", name: "Otabek Rustamov", company: "Riviera Holdings", email: "otabek@riviera.uz", phone: "+998 71 255 7070", lots: 1, revenue: 9870, status: "active", avatar: "OR" },
  { id: "o-7", name: "Laziz Tursunov", company: "Next Properties", email: "laziz@next.uz", phone: "+998 71 266 8080", lots: 1, revenue: 14260, status: "active", avatar: "LT" },
  { id: "o-8", name: "Jamshid Olimov", company: "Chorsu Trade LLC", email: "jamshid@chorsu.uz", phone: "+998 71 277 9090", lots: 1, revenue: 5210, status: "suspended", avatar: "JO" },
  { id: "o-9", name: "Madina Sharipova", company: "Yunusabad Estates", email: "madina@yunusabad.uz", phone: "+998 71 288 3030", lots: 1, revenue: 8120, status: "active", avatar: "MS" },
  { id: "o-10", name: "Zarina Ismoilova", company: "Atlas Group", email: "zarina@atlas.uz", phone: "+998 71 299 5050", lots: 1, revenue: 24380, status: "active", avatar: "ZI" },
  { id: "o-11", name: "Rustam Mamadaliyev", company: "Guliston Bazaar Holdings", email: "rustam@gulistonbz.uz", phone: "+998 67 233 1010", lots: 1, revenue: 4820, status: "active", avatar: "RM" },
  { id: "o-12", name: "Feruza Norqulova", company: "Sirdaryo Plaza LLC", email: "feruza@sirdaryoplaza.uz", phone: "+998 67 244 2020", lots: 1, revenue: 7340, status: "active", avatar: "FN" },
  { id: "o-13", name: "Akmal Hasanov", company: "Hokimiyat Service", email: "akmal@hokservice.uz", phone: "+998 67 255 3030", lots: 1, revenue: 2640, status: "active", avatar: "AH" },
  { id: "o-14", name: "Shahnoza Egamberdiyeva", company: "Vokzal Park Co.", email: "shahnoza@vokzalpark.uz", phone: "+998 67 266 4040", lots: 1, revenue: 3210, status: "active", avatar: "SE" },
  { id: "o-15", name: "Davron Yo'ldoshev", company: "MDIU Campus Services", email: "davron@mdiu.uz", phone: "+998 67 277 5050", lots: 1, revenue: 1980, status: "active", avatar: "DY" },
  { id: "o-16", name: "Bahodir Tolipov", company: "Sirdaryo Sport Group", email: "bahodir@sportsirdaryo.uz", phone: "+998 67 288 6060", lots: 1, revenue: 1420, status: "active", avatar: "BT" },
];

export const mockCameras: Camera[] = [
  { id: "cam-1", name: "Entrance North", lot: "Tashkent City Mall", status: "online", latency: 82, accuracy: 0.97, detections: 1284 },
  { id: "cam-2", name: "Floor B2 East", lot: "Tashkent City Mall", status: "online", latency: 110, accuracy: 0.94, detections: 940 },
  { id: "cam-3", name: "Rooftop West", lot: "Magic City Garage", status: "warning", latency: 320, accuracy: 0.88, detections: 612 },
  { id: "cam-4", name: "Exit Gate", lot: "Magic City Garage", status: "online", latency: 75, accuracy: 0.98, detections: 1510 },
  { id: "cam-5", name: "Zone C", lot: "Compass Mall Lot", status: "offline", latency: 0, accuracy: 0, detections: 0 },
  { id: "cam-6", name: "Entrance South", lot: "Samarkand Plaza", status: "online", latency: 92, accuracy: 0.95, detections: 488 },
];

export const mockBookings: Booking[] = [
  { id: "b-1001", driver: "Jamshid Olimov", vehicle: "Chevrolet Cobalt", plate: "01 A 123 BC", lot: "Tashkent City Mall", space: "A3", start: "09:30", end: "12:00", status: "active", amount: 10 },
  { id: "b-1002", driver: "Madina Sharipova", vehicle: "Lacetti", plate: "01 B 442 KK", lot: "Magic City Garage", space: "B7", start: "10:00", end: "14:00", status: "active", amount: 12 },
  { id: "b-1003", driver: "Sardor Aliev", vehicle: "Captiva", plate: "10 D 902 AA", lot: "Compass Mall Lot", space: "C12", start: "14:30", end: "16:00", status: "upcoming", amount: 8 },
  { id: "b-1004", driver: "Iroda Yusupova", vehicle: "Spark", plate: "01 K 110 MN", lot: "Tashkent City Mall", space: "A8", start: "08:00", end: "09:00", status: "completed", amount: 4 },
  { id: "b-1005", driver: "Otabek Rustamov", vehicle: "Tracker", plate: "30 L 521 BC", lot: "Samarkand Plaza", space: "B2", start: "11:00", end: "13:00", status: "pending", amount: 4 },
  { id: "b-1006", driver: "Laziz Tursunov", vehicle: "Equinox", plate: "01 F 311 AA", lot: "Magic City Garage", space: "C5", start: "16:00", end: "18:30", status: "cancelled", amount: 0 },
];

export const occupancySeries = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, "0")}:00`,
  occupancy: Math.max(8, Math.round(40 + 35 * Math.sin((h - 4) / 3) + Math.random() * 8)),
  reserved: Math.max(2, Math.round(12 + 10 * Math.sin((h - 6) / 4) + Math.random() * 5)),
}));

export const revenueSeries = [
  { day: "Mon", revenue: 4200, bookings: 142 },
  { day: "Tue", revenue: 3850, bookings: 128 },
  { day: "Wed", revenue: 5120, bookings: 178 },
  { day: "Thu", revenue: 4730, bookings: 161 },
  { day: "Fri", revenue: 6420, bookings: 220 },
  { day: "Sat", revenue: 7890, bookings: 271 },
  { day: "Sun", revenue: 6210, bookings: 218 },
];

export const peakHours = [
  { hour: "06", value: 8 },
  { hour: "08", value: 42 },
  { hour: "10", value: 64 },
  { hour: "12", value: 78 },
  { hour: "14", value: 71 },
  { hour: "16", value: 88 },
  { hour: "18", value: 92 },
  { hour: "20", value: 56 },
  { hour: "22", value: 22 },
];

export const activityFeed = [
  { id: 1, who: "Kamera 02", what: "A3 da yangi avtomobilni aniqladi", when: "hozir", tone: "info" as const },
  { id: 2, who: "Madina S.", what: "bronini 30 daqiqaga uzaytirdi", when: "1 daq oldin", tone: "success" as const },
  { id: 3, who: "Compass Mall", what: "C zonasi kamerasi oʻchdi", when: "3 daq oldin", tone: "danger" as const },
  { id: 4, who: "Bobur Y.", what: "yangi parking qoʻshdi", when: "12 daq oldin", tone: "info" as const },
  { id: 5, who: "AI Vision", what: "shu soatda 97.2% aniqlik", when: "20 daq oldin", tone: "success" as const },
];
