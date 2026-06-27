import { useCallback, useState } from "react";

export type GeoStatus = "idle" | "loading" | "granted" | "denied" | "unavailable";
export interface GeoState {
  status: GeoStatus;
  loc: { lat: number; lng: number } | null;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ status: "idle", loc: null, error: null });

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ status: "unavailable", loc: null, error: "Geolocation is not supported in this browser." });
      return;
    }
    setState({ status: "loading", loc: null, error: null });
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ status: "granted", loc: { lat: pos.coords.latitude, lng: pos.coords.longitude }, error: null }),
      (err) => {
        const denied = err.code === err.PERMISSION_DENIED;
        setState({
          status: denied ? "denied" : "unavailable",
          loc: null,
          error: denied
            ? "Location permission denied. Showing default city view."
            : "Couldn't get your location. Try again or pick a city.",
        });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30_000 },
    );
  }, []);

  return { ...state, request };
}