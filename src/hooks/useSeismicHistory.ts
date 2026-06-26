import { useQuery } from "@tanstack/react-query";
import { LATAM_BOUNDS, VEN_BOUNDS, type RegionFilter } from "./useEarthquakes";

export interface HistEvent {
  id: string;
  mag: number;
  place: string;
  time: number;
  lat: number;
  lng: number;
  depth: number;
}

export interface DayBucket {
  key: string; // YYYY-MM-DD
  ts: number; // epoch of day start (local)
  count: number;
  maxMag: number;
}

export interface SeismicHistory {
  events: HistEvent[];
  daily: DayBucket[];
  total: number;
  strongest: HistEvent | null;
}

// The USGS fdsnws/event/query API is NOT CORS-enabled, so a browser can't read
// it directly. The static summary feeds (last 30 days) ARE CORS-enabled, so we
// fetch those and aggregate by day on the client.
function feedFor(region: RegionFilter) {
  // Global uses M4.5+ (smaller payload); regional uses M2.5+ for local detail.
  return region === "all"
    ? "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
    : "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";
}

function inBounds(lat: number, lng: number, b: typeof LATAM_BOUNDS) {
  return lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng;
}

function dayKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function load(region: RegionFilter, days: number): Promise<SeismicHistory> {
  const res = await fetch(feedFor(region));
  if (!res.ok) throw new Error("USGS history request failed");
  const data = await res.json();

  const cutoff = Date.now() - days * 86_400_000;
  const bounds = region === "venezuela" ? VEN_BOUNDS : region === "latam" ? LATAM_BOUNDS : null;

  const events: HistEvent[] = (data.features ?? [])
    .map((f: any) => {
      const [lng, lat, depth] = f.geometry.coordinates;
      return {
        id: f.id,
        mag: f.properties.mag ?? 0,
        place: f.properties.place ?? "",
        time: f.properties.time,
        lat,
        lng,
        depth: depth ?? 0,
      } as HistEvent;
    })
    .filter((e: HistEvent) => e.time >= cutoff && (!bounds || inBounds(e.lat, e.lng, bounds)));

  // seed continuous day buckets so the chart has no gaps
  const buckets = new Map<string, DayBucket>();
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() - (days - 1));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  while (cursor <= today) {
    buckets.set(dayKey(cursor.getTime()), { key: dayKey(cursor.getTime()), ts: cursor.getTime(), count: 0, maxMag: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  let strongest: HistEvent | null = null;
  for (const e of events) {
    const b = buckets.get(dayKey(e.time));
    if (b) {
      b.count += 1;
      b.maxMag = Math.max(b.maxMag, e.mag);
    }
    if (!strongest || e.mag > strongest.mag) strongest = e;
  }

  return {
    events,
    daily: Array.from(buckets.values()).sort((a, b) => a.ts - b.ts),
    total: events.length,
    strongest,
  };
}

export function useSeismicHistory(region: RegionFilter, days = 30) {
  return useQuery({
    queryKey: ["seismic-history", region, days],
    queryFn: () => load(region, days),
    staleTime: 30 * 60 * 1000, // 30 min
    gcTime: 60 * 60 * 1000,
    retry: 1,
  });
}
