import { supabase } from "@/integrations/supabase/client";

export interface FeltReportInput {
  quakeId: string;
  intensity: number; // 0..4 (Mercalli-like buckets)
  lat?: number;
  lng?: number;
  zone?: string;
}

export interface FeltSummary {
  total: number;
  byIntensity: number[]; // length 5, index = intensity bucket
}

// `felt_reports` is not part of the auto-generated Database types yet, so we
// access it through an untyped handle. All calls degrade gracefully when
// Supabase is not configured (e.g. missing env vars or table not migrated).
const table = () => (supabase as unknown as { from: (t: string) => any }).from("felt_reports");

export async function submitFeltReport(input: FeltReportInput): Promise<boolean> {
  try {
    const { error } = await table().insert({
      quake_id: input.quakeId,
      intensity: input.intensity,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      zone: input.zone ?? null,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function fetchFeltSummary(quakeId: string): Promise<FeltSummary | null> {
  try {
    const { data, error } = await table().select("intensity").eq("quake_id", quakeId);
    if (error || !data) return null;
    const byIntensity = [0, 0, 0, 0, 0];
    (data as { intensity: number }[]).forEach((r) => {
      if (r.intensity >= 0 && r.intensity <= 4) byIntensity[r.intensity]++;
    });
    return { total: (data as unknown[]).length, byIntensity };
  } catch {
    return null;
  }
}
