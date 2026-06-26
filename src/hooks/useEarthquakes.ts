import { useState, useEffect, useCallback, useRef } from "react";

export interface Earthquake {
  id: string;
  mag: number;
  place: string;
  time: number;
  lat: number;
  lng: number;
  depth: number;
  felt: number | null;
  alert: string | null;
  sig: number;
  url: string;
  status: string;
  tsunami: number;
}

export type MagFilter = "all" | "2+" | "4+" | "6+";
export type RegionFilter = "latam" | "venezuela" | "all";

export const LATAM_BOUNDS = { minLat: -60, maxLat: 35, minLng: -120, maxLng: -30 };
export const VEN_BOUNDS = { minLat: 0.6, maxLat: 15.9, minLng: -73.4, maxLng: -59.8 };

const FEED_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";

// Ciudades principales de Venezuela con coordenadas
export const VEN_CITIES = [
  { name: "Caracas", lat: 10.4806, lng: -66.9036 },
  { name: "Maracaibo", lat: 10.6544, lng: -71.6062 },
  { name: "Valencia", lat: 10.1620, lng: -68.0077 },
  { name: "Barquisimeto", lat: 10.0647, lng: -69.3571 },
  { name: "Maracay", lat: 10.2469, lng: -67.5956 },
  { name: "Maturín", lat: 9.7458, lng: -63.1794 },
  { name: "Ciudad Guayana", lat: 8.3538, lng: -62.6434 },
  { name: "Barcelona", lat: 10.1333, lng: -64.6833 },
  { name: "Mérida", lat: 8.5897, lng: -71.1445 },
  { name: "San Cristóbal", lat: 7.7656, lng: -72.2253 },
  { name: "Cumaná", lat: 10.4531, lng: -64.1781 },
  { name: "Barinas", lat: 8.6228, lng: -70.2064 },
  { name: "Punto Fijo", lat: 11.7042, lng: -70.2197 },
  { name: "Yumare", lat: 10.6333, lng: -68.6833 },
  { name: "Coro", lat: 11.4051, lng: -69.6681 },
];

// Haversine distance in km
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function nearestCity(lat: number, lng: number) {
  let best = VEN_CITIES[0];
  let bestDist = distanceKm(lat, lng, best.lat, best.lng);
  for (const city of VEN_CITIES.slice(1)) {
    const d = distanceKm(lat, lng, city.lat, city.lng);
    if (d < bestDist) { best = city; bestDist = d; }
  }
  return { city: best, distKm: Math.round(bestDist) };
}

// Detecta réplicas: sismo posterior a un mainshock más grande, dentro de 100km y 24h
export function detectAftershocks(events: Earthquake[]): Set<string> {
  const aftershockIds = new Set<string>();
  const sorted = [...events].sort((a, b) => a.time - b.time);
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const main = sorted[i];
      const candidate = sorted[j];
      if (candidate.time - main.time > 24 * 3600 * 1000) break;
      if (candidate.mag >= main.mag) continue;
      const dist = distanceKm(main.lat, main.lng, candidate.lat, candidate.lng);
      if (dist <= 100) aftershockIds.add(candidate.id);
    }
  }
  return aftershockIds;
}

function inBounds(lat: number, lng: number, b: typeof LATAM_BOUNDS) {
  return lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng;
}

function parseFeature(f: any): Earthquake {
  const p = f.properties;
  const [lng, lat, depth] = f.geometry.coordinates;
  return {
    id: f.id,
    mag: p.mag ?? 0,
    place: p.place ?? "Ubicación desconocida",
    time: p.time,
    lat, lng,
    depth: depth ?? 0,
    felt: p.felt,
    alert: p.alert,
    sig: p.sig ?? 0,
    url: p.url,
    status: p.status,
    tsunami: p.tsunami ?? 0,
  };
}

export function useEarthquakes(magFilter: MagFilter = "all", regionFilter: RegionFilter = "latam") {
  const [events, setEvents] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(FEED_URL);
      if (!res.ok) throw new Error("Error al conectar con USGS");
      const data = await res.json();
      const parsed: Earthquake[] = data.features.map(parseFeature);
      setEvents(parsed);
      setLastUpdated(new Date());
      setError(null);
    } catch (e: any) {
      setError(e.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    intervalRef.current = setInterval(fetch_, 60_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetch_]);

  const filtered = events.filter((e) => {
    if (regionFilter === "venezuela" && !inBounds(e.lat, e.lng, VEN_BOUNDS)) return false;
    if (regionFilter === "latam" && !inBounds(e.lat, e.lng, LATAM_BOUNDS)) return false;
    if (magFilter === "2+") return e.mag >= 2;
    if (magFilter === "4+") return e.mag >= 4;
    if (magFilter === "6+") return e.mag >= 6;
    return true;
  });

  return { events: filtered, total: events.length, loading, error, lastUpdated, refetch: fetch_ };
}
