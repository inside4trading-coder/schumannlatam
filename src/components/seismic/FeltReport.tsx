import { useEffect, useMemo, useState } from "react";
import { Users, Check, Radio } from "lucide-react";
import type { Earthquake } from "@/hooks/useEarthquakes";
import { nearestCity } from "@/hooks/useEarthquakes";
import { submitFeltReport, fetchFeltSummary, type FeltSummary } from "@/lib/feltReports";
import { cn } from "@/lib/utils";

interface Props {
  quake: Earthquake;
  isEs: boolean;
}

const SCALE = [
  { i: 0, es: "No lo sentí", en: "Didn't feel it", emoji: "😴", color: "#64748b" },
  { i: 1, es: "Leve", en: "Light", emoji: "🙂", color: "#34d399" },
  { i: 2, es: "Moderado", en: "Moderate", emoji: "😯", color: "#facc15" },
  { i: 3, es: "Fuerte", en: "Strong", emoji: "😟", color: "#fb923c" },
  { i: 4, es: "Severo", en: "Severe", emoji: "😱", color: "#f87171" },
];

const storeKey = (id: string) => `felt:${id}`;

export function FeltReport({ quake, isEs }: Props) {
  const zone = useMemo(() => nearestCity(quake.lat, quake.lng).city.name, [quake]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [summary, setSummary] = useState<FeltSummary | null>(null);
  const [done, setDone] = useState(false);

  // load prior submission + summary for this quake
  useEffect(() => {
    let alive = true;
    setDone(false);
    setChosen(null);
    setSummary(null);
    const prior = typeof window !== "undefined" ? window.localStorage.getItem(storeKey(quake.id)) : null;
    if (prior != null) {
      setChosen(Number(prior));
      setDone(true);
    }
    fetchFeltSummary(quake.id).then((s) => {
      if (alive && s) setSummary(s);
    });
    return () => {
      alive = false;
    };
  }, [quake.id]);

  const onPick = async (i: number) => {
    if (done) return;
    setChosen(i);
    setDone(true);
    // optimistic local count so the UI responds even if the DB isn't reachable
    setSummary((prev) => {
      const base = prev ?? { total: 0, byIntensity: [0, 0, 0, 0, 0] };
      const next = [...base.byIntensity];
      next[i] += 1;
      return { total: base.total + 1, byIntensity: next };
    });
    try {
      window.localStorage.setItem(storeKey(quake.id), String(i));
    } catch {
      /* ignore */
    }
    await submitFeltReport({ quakeId: quake.id, intensity: i, lat: quake.lat, lng: quake.lng, zone });
    const fresh = await fetchFeltSummary(quake.id);
    if (fresh) setSummary(fresh);
  };

  const total = summary?.total ?? 0;
  const maxBar = Math.max(1, ...(summary?.byIntensity ?? [0]));

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="rounded-xl bg-accent/10 p-2 border border-accent/20">
          <Radio className="h-4 w-4 text-accent" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">
            {isEs ? "¿Lo sentiste?" : "Did you feel it?"}
          </h3>
          <p className="text-xs text-muted-foreground">
            M {quake.mag.toFixed(1)} · {quake.place.split(",")[0]}
          </p>
        </div>
      </div>

      {!done ? (
        <div className="flex flex-col gap-2">
          <p className="mb-1 text-sm text-muted-foreground">
            {isEs ? "Ayuda a tu comunidad: ¿qué tan fuerte lo sentiste?" : "Help your community: how strong was it?"}
          </p>
          {SCALE.map((s) => (
            <button
              key={s.i}
              onClick={() => onPick(s.i)}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/40 px-3 py-2.5 text-left text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="text-lg leading-none">{s.emoji}</span>
              <span>{isEs ? s.es : s.en}</span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <Check className="h-5 w-5 flex-shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {isEs ? "¡Gracias por reportar!" : "Thanks for reporting!"}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {isEs ? (
                  <>
                    Te uniste a <b className="font-semibold text-foreground">{total.toLocaleString("es")}</b> reportes de este sismo
                  </>
                ) : (
                  <>
                    You joined <b className="font-semibold text-foreground">{total.toLocaleString("en")}</b> reports for this quake
                  </>
                )}
              </p>
            </div>
          </div>

          <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {isEs ? "Intensidad sentida por la comunidad" : "Community-felt intensity"}
          </p>
          <div className="flex flex-col gap-1.5">
            {SCALE.map((s) => {
              const c = summary?.byIntensity[s.i] ?? 0;
              return (
                <div key={s.i} className="flex items-center gap-2">
                  <span className="w-24 flex-shrink-0 text-xs text-muted-foreground">
                    {s.emoji} {isEs ? s.es : s.en}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted/40">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", chosen === s.i && "ring-1 ring-white/30")}
                      style={{ width: `${(c / maxBar) * 100}%`, background: s.color }}
                    />
                  </div>
                  <span className="w-8 flex-shrink-0 text-right text-xs tabular-nums text-muted-foreground">{c}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            {isEs
              ? "Los reportes son anónimos y por zona. Complementan los datos de USGS midiendo el impacto humano real."
              : "Reports are anonymous and zone-level. They complement USGS data by measuring real human impact."}
          </p>
        </div>
      )}
    </div>
  );
}

export default FeltReport;
