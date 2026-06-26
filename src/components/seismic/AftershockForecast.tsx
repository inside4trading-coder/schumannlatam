import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
} from "recharts";
import { Repeat2, ShieldCheck, Activity, TriangleAlert } from "lucide-react";
import type { Earthquake } from "@/hooks/useEarthquakes";
import { distanceKm } from "@/hooks/useEarthquakes";

interface Props {
  events: Earthquake[];
  isEs: boolean;
}

const H = 3600 * 1000;

/** Aftershock window: within 100 km and 72 h after a mainshock, smaller magnitude. */
function sequence(events: Earthquake[]) {
  const now = Date.now();
  const recent = events.filter((e) => now - e.time < 72 * H);
  if (recent.length === 0) return null;
  // mainshock = strongest recent event (require some energy to be a "sequence")
  const main = recent.reduce((a, b) => (b.mag > a.mag ? b : a));
  if (main.mag < 3.5) return null;

  const after = recent
    .filter(
      (e) =>
        e.id !== main.id &&
        e.time > main.time &&
        e.mag < main.mag &&
        distanceKm(main.lat, main.lng, e.lat, e.lng) <= 100,
    )
    .sort((a, b) => a.time - b.time);

  return { main, after };
}

export function AftershockForecast({ events, isEs }: Props) {
  const seq = useMemo(() => sequence(events), [events]);

  const { bins, hoursSince, last12 } = useMemo(() => {
    if (!seq) return { bins: [] as any[], hoursSince: 0, last12: 0 };
    const now = Date.now();
    const span = Math.max(6, Math.min(72, (now - seq.main.time) / H));
    const step = 3; // 3-hour bins
    const out: { t: number; label: string; count: number; omori: number }[] = [];
    // Omori-ish decay n(t) = K / (c + t)^p
    const K = Math.max(2, seq.after.length) * 1.4;
    const c = 1.5;
    const p = 1.1;
    for (let t = 0; t <= span; t += step) {
      const count = seq.after.filter(
        (a) => (a.time - seq.main.time) / H >= t && (a.time - seq.main.time) / H < t + step,
      ).length;
      out.push({ t, label: `+${Math.round(t)}h`, count, omori: K / Math.pow(c + t, p) });
    }
    const hrs = (now - seq.main.time) / H;
    const l12 = seq.after.filter((a) => (now - a.time) / H <= 12).length;
    return { bins: out, hoursSince: hrs, last12: l12 };
  }, [seq]);

  // Calm state — no significant sequence right now
  if (!seq) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              {isEs ? "Sin secuencia sísmica significativa" : "No significant seismic sequence"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isEs
                ? "No se detecta un sismo principal con réplicas en la región en las últimas 72 h."
                : "No mainshock with aftershocks detected in the region in the last 72 h."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // qualitative 24h likelihood from recent aftershock rate
  const likelihood =
    last12 >= 4 ? (isEs ? "alta" : "high") : last12 >= 1 ? (isEs ? "moderada" : "moderate") : isEs ? "baja" : "low";
  const likeColor = last12 >= 4 ? "text-orange-400" : last12 >= 1 ? "text-yellow-400" : "text-emerald-400";

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="mb-4 flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 border border-primary/20">
            <Repeat2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              {isEs ? "Pronóstico de réplicas" : "Aftershock forecast"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isEs ? "Sismo principal" : "Mainshock"}: M {seq.main.mag.toFixed(1)} ·{" "}
              {seq.main.place.split(",")[0]} · {isEs ? "hace" : ""} {Math.round(hoursSince)} h
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-black text-foreground tabular-nums">{seq.after.length}</div>
          <div className="text-[11px] text-muted-foreground">{isEs ? "réplicas detectadas" : "aftershocks"}</div>
        </div>
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={bins} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
            <defs>
              <linearGradient id="aftFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(250 70% 70%)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(250 70% 70%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 15% 18%)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(240 10% 55%)" }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "hsl(240 10% 55%)" }} axisLine={false} tickLine={false} width={28} />
            <RTooltip
              contentStyle={{ background: "hsl(240 18% 10%)", border: "1px solid hsl(240 15% 18%)", borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: "hsl(240 15% 93%)" }}
              formatter={(v: any, n: any) => [Math.round(Number(v) * 10) / 10, n === "count" ? (isEs ? "réplicas" : "aftershocks") : "Omori"]}
            />
            <Area type="step" dataKey="count" stroke="hsl(250 70% 70%)" strokeWidth={2} fill="url(#aftFill)" isAnimationActive={false} name="count" />
            <Line type="monotone" dataKey="omori" stroke="hsl(25 95% 60%)" strokeWidth={1.5} dot={false} strokeDasharray="4 3" isAnimationActive={false} name="omori" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/40 bg-background/40 p-3">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Activity className="h-3.5 w-3.5" />
            {isEs ? "Probabilidad estimada M4+ (24 h)" : "Estimated M4+ likelihood (24 h)"}
          </div>
          <div className={"font-display text-lg font-bold capitalize " + likeColor}>{likelihood}</div>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {isEs
              ? "Las réplicas disminuyen con el tiempo (ley de Omori). La curva naranja muestra la tendencia esperada."
              : "Aftershocks decay over time (Omori's law). The orange curve shows the expected trend."}
          </p>
        </div>
        <div className="rounded-xl border border-border/40 bg-background/40 p-3">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <TriangleAlert className="h-3.5 w-3.5" />
            {isEs ? "Mantén la calma y prepárate" : "Stay calm and be ready"}
          </div>
          <ul className="space-y-0.5 text-[11px] leading-relaxed text-muted-foreground">
            <li>{isEs ? "• Ten a mano agua, linterna y documentos." : "• Keep water, a flashlight and documents handy."}</li>
            <li>{isEs ? "• Identifica zonas seguras lejos de ventanas." : "• Identify safe spots away from windows."}</li>
            <li>{isEs ? "• Acuerda un punto de encuentro familiar." : "• Agree on a family meeting point."}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AftershockForecast;
