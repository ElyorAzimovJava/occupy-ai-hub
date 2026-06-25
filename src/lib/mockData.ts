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

const seedSlots = (n: number, occupiedRate = 0.55): ParkingSlot[] =>
  Array.from({ length: n }, (_, i) => {
    const r = Math.random();
    let status: SlotStatus = "available";
    if (r < occupiedRate) status = "occupied";
    else if (r < occupiedRate + 0.18) status = "reserved";
    else if (r > 0.96) status = "disabled";
    return {
      id: `s-${i + 1}`,
      label: `${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`,
      status,
      confidence: 0.82 + Math.random() * 0.17,
      plate: status === "occupied" ? randomPlate() : undefined,
    };
  });

function randomPlate() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return (
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)] +
    " " +
    Math.floor(100 + Math.random() * 900) +
    " " +
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)]
  );
}

export const mockSlots = seedSlots(60);

export const mockLots: ParkingLot[] = [
  {
    id: "lot-1",
    name: "Tashkent City Mall",
    owner: "Alisher Karimov",
    address: "Islom Karimov 1, Tashkent",
    total: 240,
    occupied: 168,
    reserved: 22,
    pricePerHour: 4,
    revenue: 18420,
    status: "active",
    lat: 41.311,
    lng: 69.279,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80",
    rating: 4.7,
  },
  {
    id: "lot-2",
    name: "Magic City Garage",
    owner: "Nigora Tursunova",
    address: "Bunyodkor 2, Tashkent",
    total: 180,
    occupied: 98,
    reserved: 14,
    pricePerHour: 3,
    revenue: 12120,
    status: "active",
    lat: 41.298,
    lng: 69.234,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80",
    rating: 4.5,
  },
  {
    id: "lot-3",
    name: "Samarkand Plaza",
    owner: "Bobur Yusupov",
    address: "Registan St 10, Samarkand",
    total: 120,
    occupied: 32,
    reserved: 6,
    pricePerHour: 2,
    revenue: 4310,
    status: "active",
    lat: 39.654,
    lng: 66.974,
    image: "https://images.unsplash.com/photo-1545179605-1296651e9d43?w=800&q=80",
    rating: 4.3,
  },
  {
    id: "lot-4",
    name: "Compass Mall Lot",
    owner: "Dilshod Akhmedov",
    address: "Mustaqillik 14, Tashkent",
    total: 320,
    occupied: 210,
    reserved: 35,
    pricePerHour: 5,
    revenue: 28940,
    status: "maintenance",
    lat: 41.32,
    lng: 69.29,
    image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800&q=80",
    rating: 4.8,
  },
];

export const mockOwners: BusinessOwner[] = [
  { id: "o-1", name: "Alisher Karimov", company: "Tashkent City Holdings", email: "alisher@tcc.uz", phone: "+998 71 200 1010", lots: 4, revenue: 42100, status: "active", avatar: "AK" },
  { id: "o-2", name: "Nigora Tursunova", company: "Magic Realty", email: "nigora@magic.uz", phone: "+998 71 220 4040", lots: 2, revenue: 18300, status: "active", avatar: "NT" },
  { id: "o-3", name: "Bobur Yusupov", company: "Silk Parking Co.", email: "bobur@silk.uz", phone: "+998 66 233 8080", lots: 3, revenue: 9430, status: "suspended", avatar: "BY" },
  { id: "o-4", name: "Dilshod Akhmedov", company: "Compass Group", email: "dilshod@compass.uz", phone: "+998 71 244 1212", lots: 5, revenue: 61240, status: "active", avatar: "DA" },
  { id: "o-5", name: "Sevara Rakhimova", company: "Park&Go", email: "sevara@parkgo.uz", phone: "+998 71 211 5050", lots: 1, revenue: 2100, status: "blocked", avatar: "SR" },
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
  { id: 1, who: "Camera 02", what: "detected new vehicle at A3", when: "just now", tone: "info" as const },
  { id: 2, who: "Madina S.", what: "extended booking by 30 min", when: "1m ago", tone: "success" as const },
  { id: 3, who: "Compass Mall", what: "Zone C camera went offline", when: "3m ago", tone: "danger" as const },
  { id: 4, who: "Bobur Y.", what: "added new parking lot", when: "12m ago", tone: "info" as const },
  { id: 5, who: "AI Vision", what: "97.2% accuracy this hour", when: "20m ago", tone: "success" as const },
];
