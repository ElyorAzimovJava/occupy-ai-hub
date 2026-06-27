import { useEffect, useRef, useState } from "react";
import { Crosshair, Loader2 } from "lucide-react";
import type { ParkingLot } from "@/lib/mockData";

declare global {
  interface Window {
    google?: any;
    __osonInitMap?: () => void;
  }
}

const TASHKENT = { lat: 41.3111, lng: 69.2797 };

function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
  const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
  const existing = document.getElementById("google-maps-js") as HTMLScriptElement | null;
  return new Promise((resolve, reject) => {
    window.__osonInitMap = () => resolve();
    if (existing) {
      if (window.google?.maps) resolve();
      else existing.addEventListener("load", () => resolve());
      return;
    }
    const s = document.createElement("script");
    s.id = "google-maps-js";
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__osonInitMap${channel ? `&channel=${channel}` : ""}`;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
}

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

export function formatDistance(m: number) {
  if (m < 1000) return `${Math.round(m)}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

export function sortByDistance(lots: ParkingLot[], origin: { lat: number; lng: number }) {
  return [...lots]
    .map((l) => ({ lot: l, dist: haversineMeters(origin, { lat: l.lat, lng: l.lng }) }))
    .sort((a, b) => a.dist - b.dist);
}

interface ParkingMapProps {
  lots: ParkingLot[];
  height?: string;
  onSelect?: (lot: ParkingLot) => void;
  onUserLocation?: (loc: { lat: number; lng: number }) => void;
  selectedId?: string;
  userLocation?: { lat: number; lng: number } | null;
  onLocateClick?: () => void;
  locating?: boolean;
  radiusKm?: number;
}

export function ParkingMap({ lots, height = "420px", onSelect, onUserLocation, selectedId, userLocation, onLocateClick, locating, radiusKm }: ParkingMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const radiusCircleRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !ref.current || !window.google) return;
        mapRef.current = new window.google.maps.Map(ref.current, {
          center: TASHKENT,
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          styles: darkMapStyles,
        });
        setLoading(false);
      })
      .catch((e) => setError(e.message));
    return () => { cancelled = true; };
  }, []);

  // Render lot markers
  useEffect(() => {
    if (!mapRef.current || !window.google) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = lots.map((lot) => {
      const free = lot.total - lot.occupied - lot.reserved;
      const full = free <= 0;
      const low = !full && free <= Math.max(5, lot.total * 0.1);
      const color = full ? "#E11D48" : low ? "#F59E0B" : "#10B981";
      const isSelected = selectedId === lot.id;
      const marker = new window.google.maps.Marker({
        position: { lat: lot.lat, lng: lot.lng },
        map: mapRef.current,
        title: `${lot.name} — ${free} free / ${lot.total}`,
        icon: {
          path: "M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z",
          fillColor: color,
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: isSelected ? 4 : 2,
          scale: isSelected ? 1.9 : 1.55,
          anchor: new window.google.maps.Point(12, 32),
          labelOrigin: new window.google.maps.Point(12, 12),
        },
        label: {
          text: full ? "FULL" : String(free),
          color: "#ffffff",
          fontSize: full ? "9px" : "11px",
          fontWeight: "800",
        },
      });
      marker.addListener("click", () => onSelect?.(lot));
      return marker;
    });
  }, [lots, selectedId, onSelect]);

  // Sync external user location marker + radius circle
  useEffect(() => {
    if (!mapRef.current || !window.google) return;
    if (userMarkerRef.current) { userMarkerRef.current.setMap(null); userMarkerRef.current = null; }
    if (radiusCircleRef.current) { radiusCircleRef.current.setMap(null); radiusCircleRef.current = null; }
    if (!userLocation) return;
    userMarkerRef.current = new window.google.maps.Marker({
      position: userLocation,
      map: mapRef.current,
      icon: { path: window.google.maps.SymbolPath.CIRCLE, fillColor: "#1D4ED8", fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: 3, scale: 9 },
      zIndex: 999,
    });
    if (radiusKm && radiusKm > 0) {
      radiusCircleRef.current = new window.google.maps.Circle({
        map: mapRef.current,
        center: userLocation,
        radius: radiusKm * 1000,
        strokeColor: "#1D4ED8", strokeOpacity: 0.5, strokeWeight: 1.5,
        fillColor: "#1D4ED8", fillOpacity: 0.06,
      });
    }
    mapRef.current.panTo(userLocation);
  }, [userLocation, radiusKm]);

  const fallbackLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onUserLocation?.(loc);
        if (mapRef.current) mapRef.current.setZoom(14);
      },
      () => setError("Location permission denied"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleLocate = () => {
    if (onLocateClick) onLocateClick();
    else fallbackLocate();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl ring-1 ring-slate-200/60 shadow-lg" style={{ height }}>
      <div ref={ref} className="absolute inset-0 bg-slate-100" />
      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-slate-100 text-slate-500">
          <div className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin"/>Loading map…</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-x-4 top-4 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 ring-1 ring-rose-200">{error}</div>
      )}
      <button
        onClick={handleLocate}
        aria-label="My location"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-[#1D4ED8] shadow-lg ring-1 ring-slate-200 transition hover:scale-105 active:scale-95 disabled:opacity-60"
        disabled={locating}
      >
        {locating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Crosshair className="h-5 w-5" />}
      </button>
    </div>
  );
}

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1d2433" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8b9bb4" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2a3346" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c3650" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a2238" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3b4768" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0b1220" }] },
];