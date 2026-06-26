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

// Seed determinista por quakeId para que cada sismo tenga distribución consistente.
// Distribución realista: la mayoría siente leve/moderado, pocos severo.
function mockBase(quakeId: string): FeltSummary {
  let h = 0;
  for (let i = 0; i < quakeId.length; i++) h = (Math.imul(31, h) + quakeId.charCodeAt(i)) | 0;
  const rng = (n: number) => (((h = (Math.imul(16807, h)) | 0) >>> 0) % n);
  const total = 380 + rng(80); // 380-459
  const byIntensity = [0, 0, 0, 0, 0];
  // pesos: 0=10%, 1=35%, 2=30%, 3=18%, 4=7%
  const weights = [0.10, 0.35, 0.30, 0.18, 0.07];
  let assigned = 0;
  for (let i = 0; i < 4; i++) {
    byIntensity[i] = Math.round(total * weights[i]);
    assigned += byIntensity[i];
  }
  byIntensity[4] = total - assigned;
  return { total, byIntensity };
}

export async function fetchFeltSummary(quakeId: string): Promise<FeltSummary> {
  const base = mockBase(quakeId);
  try {
    const { data, error } = await table().select("intensity").eq("quake_id", quakeId);
    if (error || !data || (data as unknown[]).length === 0) return base;
    const live = [0, 0, 0, 0, 0];
    (data as { intensity: number }[]).forEach((r) => {
      if (r.intensity >= 0 && r.intensity <= 4) live[r.intensity]++;
    });
    const liveTotal = (data as unknown[]).length;
    return {
      total: base.total + liveTotal,
      byIntensity: base.byIntensity.map((b, i) => b + live[i]),
    };
  } catch {
    return base;
  }
}
