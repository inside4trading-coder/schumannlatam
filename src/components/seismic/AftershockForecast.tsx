import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
} from "recharts";
import { Repeat2, ShieldCheck, Activity, TriangleAlert, TrendingDown, TrendingUp, Minus, Layers } from "lucide-react";
import type { Earthquake, RegionFilter } from "@/hooks/useEarthquakes";
import { distanceKm, VEN_BOUNDS } from "@/hooks/useEarthquakes";
import { cn } from "@/lib/utils";

interface Props {
  events: Earthquake[];
  isEs: boolean;
  region?: RegionFilter;
}

const H = 3600 * 1000;
const WEEK_FEED = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

function inVenBounds(lat: number, lng: number) {
  return (
    lat >= VEN_BOUNDS.minLat && lat <= VEN_BOUNDS.maxLat &&
    lng >= VEN_BOUNDS.minLng && lng <= VEN_BOUNDS.maxLng
  );
}

function parseQuake(f: any): Earthquake {
  const p = f.properties;
  const [lng, lat, depth] = f.geometry.coordinates;
  return {
    id: f.id, mag: p.mag ?? 0, place: p.place ?? "", time: p.time,
    lat, lng, depth: depth ?? 0, felt: p.felt, alert: p.alert,
    sig: p.sig ?? 0, url: p.url, status: p.status, tsunami: p.tsunami ?? 0,
  };
}

interface Sequence {
  main: Earthquake;
  after: Earthquake[];
}

function findSequence(events: Earthquake[], threshold: number): Sequence | null {
  const now = Date.now();
  const recent = events.filter((e) => now - e.time < 72 * H);
  if (!recent.length) return null;
  const main = recent.reduce((a, b) => (b.mag > a.mag ? b : a));
  if (main.mag < threshold) return null;
  const after = recent
    .filter(
      (e) =>
        e.id !== main.id &&
        e.time > main.time &&
        e.mag < main.mag &&
        distanceKm(main.lat, main.lng, e.lat, e.lng) <= 150,
    )
    .sort((a, b) => a.time - b.time);
  return { main, after };
}

interface Swarm {
  center: Earthquake;
  events: Earthquake[];
}

function detectSwarm(events: Earthquake[]): Swarm | null {
  const now = Date.now();
  const recent = events.filter((e) => now - e.time < 72 * H);
  if (recent.length < 5) return null;
  let best: Swarm | null = null;
  for (const center of recent) {
    const nearby = recent.filter((e) => distanceKm(center.lat, center.lng, e.lat, e.lng) <= 150);
    if (nearby.length > (best?.events.length ?? 4)) {
      best = { center, events: nearby };
    }
  }
  return best;
}

export function AftershockForecast({ events, isEs, region }: Props) {
  const isVen = region === "venezuela";
  const threshold = isVen ? 3.0 : 3.5;

  const seq = useMemo(() => findSequence(events, threshold), [events, threshold]);
  const swarm = useMemo(() => (!seq ? detectSwarm(events) : null), [seq, events]);

  // Week feed for Venezuela when no sequence/swarm in daily data
  const [weekEvents, setWeekEvents] = useState<Earthquake[] | null>(null);
  const [weekLoading, setWeekLoading] = useState(false);
  useEffect(() => {
    if (!isVen || seq || swarm) { setWeekEvents(null); return; }
    let alive = true;
    setWeekLoading(true);
    fetch(WEEK_FEED)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        const ven = (d.features as any[])
          .map(parseQuake)
          .filter((e) => inVenBounds(e.lat, e.lng));
        setWeekEvents(ven);
      })
      .catch(() => { if (alive) setWeekEvents([]); })
      .finally(() => { if (alive) setWeekLoading(false); });
    return () => { alive = false; };
  }, [isVen, seq, swarm]);

  const weekSeq = useMemo(
    () => (weekEvents ? findSequence(weekEvents, threshold) : null),
    [weekEvents, threshold],
  );
  const weekSwarm = useMemo(
    () => (weekEvents && !weekSeq ? detectSwarm(weekEvents) : null),
    [weekEvents, weekSeq],
  );

  // Resolve final data source
  const activeSeq = seq ?? weekSeq;
  const activeSwarm = swarm ?? weekSwarm;
  const isWeekData = !seq && !swarm && (weekSeq != null || weekSwarm != null);

  // ---- bins for the main sequence chart ----
  const { bins, hoursSince, last12 } = useMemo(() => {
    if (!activeSeq) return { bins: [] as any[], hoursSince: 0, last12: 0 };
    const now = Date.now();
    const span = Math.max(6, Math.min(72, (now - activeSeq.main.time) / H));
    const step = 3;
    const K = Math.max(2, activeSeq.after.length) * 1.4;
    const c = 1.5;
    const p = 1.1;
    const out: { t: number; label: string; count: number; omori: number }[] = [];
    for (let t = 0; t <= span; t += step) {
      const count = activeSeq.after.filter(
        (a) => (a.time - activeSeq.main.time) / H >= t && (a.time - activeSeq.main.time) / H < t + step,
      ).length;
      out.push({ t, label: `+${Math.round(t)}h`, count, omori: K / Math.pow(c + t, p) });
    }
    const hrs = (now - activeSeq.main.time) / H;
    const l12 = activeSeq.after.filter((a) => (now - a.time) / H <= 12).length;
    return { bins: out, hoursSince: hrs, last12: l12 };
  }, [activeSeq]);

  // ---- bins for the swarm timeline chart ----
  const swarmBins = useMemo(() => {
    if (!activeSwarm) return [] as any[];
    const now = Date.now();
    const step = 6 * H;
    const out: { label: string; count: number; maxMag: number }[] = [];
    for (let t = 72 * H; t > 0; t -= step) {
      const from = now - t;
      const to = from + step;
      const bucket = activeSwarm.events.filter((e) => e.time >= from && e.time < to);
      const label = `-${Math.round(t / H)}h`;
      out.push({ label, count: bucket.length, maxMag: bucket.reduce((m, e) => Math.max(m, e.mag), 0) });
    }
    return out;
  }, [activeSwarm]);

  // ---- 7-day daily activity for Venezuela ----
  const weekDailyBins = useMemo(() => {
    if (!weekEvents || weekEvents.length === 0) return [] as any[];
    const now = Date.now();
    const out: { label: string; count: number; maxMag: number }[] = [];
    for (let d = 6; d >= 0; d--) {
      const from = now - (d + 1) * 24 * H;
      const to = now - d * 24 * H;
      const bucket = weekEvents.filter((e) => e.time >= from && e.time < to);
      out.push({
        label: d === 0 ? (isEs ? "Hoy" : "Today") : `-${d}d`,
        count: bucket.length,
        maxMag: bucket.reduce((m, e) => Math.max(m, e.mag), 0),
      });
    }
    return out;
  }, [weekEvents, isEs]);

  // ---- trend (last 24h vs previous 24h) ----
  const trend = useMemo(() => {
    const now = Date.now();
    const src = weekEvents ?? events;
    const last24 = src.filter((e) => now - e.time < 24 * H).length;
    const prev24 = src.filter((e) => now - e.time >= 24 * H && now - e.time < 48 * H).length;
    if (prev24 === 0) return "neutral" as const;
    const ratio = last24 / prev24;
    return ratio > 1.2 ? ("up" as const) : ratio < 0.8 ? ("down" as const) : ("neutral" as const);
  }, [events, weekEvents]);

  // ---- no data at all ----
  if (!activeSeq && !activeSwarm && !weekLoading && weekEvents !== null && weekEvents.length === 0) {
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
                ? "No se detecta actividad relevante en la región en los últimos 7 días."
                : "No relevant activity detected in the region in the last 7 days."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---- calm state (daily feed, no venezuela week fetch yet) ----
  if (!activeSeq && !activeSwarm && !weekLoading && weekEvents === null && !isVen) {
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

  // ---- loading week data ----
  if (weekLoading) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-primary/10 p-2.5 border border-primary/20">
            <Repeat2 className="h-5 w-5 text-primary animate-spin" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              {isEs ? "Analizando actividad sísmica (7 días)…" : "Analyzing seismic activity (7 days)…"}
            </h3>
            <p className="text-xs text-muted-foreground">{isEs ? "Cargando datos USGS" : "Loading USGS data"}</p>
          </div>
        </div>
        <div className="h-40 w-full animate-pulse rounded-xl bg-muted/40" />
      </div>
    );
  }

  const likelihood =
    last12 >= 4 ? (isEs ? "alta" : "high") : last12 >= 1 ? (isEs ? "moderada" : "moderate") : isEs ? "baja" : "low";
  const likeColor = last12 >= 4 ? "text-orange-400" : last12 >= 1 ? "text-yellow-400" : "text-emerald-400";

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-orange-400" : trend === "down" ? "text-emerald-400" : "text-muted-foreground";
  const trendLabel = trend === "up"
    ? (isEs ? "Actividad en aumento" : "Activity increasing")
    : trend === "down"
    ? (isEs ? "Actividad disminuyendo" : "Activity decreasing")
    : (isEs ? "Actividad estable" : "Activity stable");

  // ---- SWARM view ----
  if (!activeSeq && activeSwarm) {
    const zone = activeSwarm.center.place.split(",")[0];
    const maxMag = activeSwarm.events.reduce((m, e) => Math.max(m, e.mag), 0);
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <div className="mb-4 flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-yellow-500/10 p-2.5 border border-yellow-500/20">
              <Layers className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {isEs ? "Enjambre sísmico detectado" : "Seismic swarm detected"}
                </h3>
                {isWeekData && (
                  <span className="rounded-full border border-border/40 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {isEs ? "últimos 7 días" : "last 7 days"}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {zone} · Máx M {maxMag.toFixed(1)} · {isEs ? "radio ~150 km" : "~150 km radius"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-black text-foreground tabular-nums">{activeSwarm.events.length}</div>
            <div className="text-[11px] text-muted-foreground">{isEs ? "eventos en 72 h" : "events in 72 h"}</div>
          </div>
        </div>

        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={swarmBins} margin={{ top: 4, right: 8, bottom: 0, left: -22 }}>
              <defs>
                <linearGradient id="swarmFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(45 95% 60%)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(45 95% 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 15% 18%)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(240 10% 55%)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "hsl(240 10% 55%)" }} axisLine={false} tickLine={false} width={28} />
              <RTooltip
                contentStyle={{ background: "hsl(240 18% 10%)", border: "1px solid hsl(240 15% 18%)", borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: "hsl(240 15% 93%)" }}
                formatter={(v: any, n: any) => [v, n === "count" ? (isEs ? "eventos" : "events") : "Máx M"]}
              />
              <Area type="monotone" dataKey="count" stroke="hsl(45 95% 60%)" strokeWidth={2} fill="url(#swarmFill)" isAnimationActive={false} name="count" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/40 bg-background/40 p-3">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <TrendIcon className={cn("h-3.5 w-3.5", trendColor)} />
              {isEs ? "Tendencia (24 h vs. anteriores)" : "Trend (24 h vs. previous)"}
            </div>
            <div className={cn("font-display text-lg font-bold", trendColor)}>{trendLabel}</div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              {isEs
                ? "Los enjambres pueden durar días. Cada evento libera tensión y reduce la probabilidad de uno mayor."
                : "Swarms can last days. Each event releases stress and reduces the probability of a larger one."}
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

  // ---- SEQUENCE view (mainshock + aftershocks) ----
  if (activeSeq) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <div className="mb-4 flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 border border-primary/20">
              <Repeat2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {isEs ? "Pronóstico de réplicas" : "Aftershock forecast"}
                </h3>
                {isWeekData && (
                  <span className="rounded-full border border-border/40 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {isEs ? "últimos 7 días" : "last 7 days"}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isEs ? "Sismo principal" : "Mainshock"}: M {activeSeq.main.mag.toFixed(1)} ·{" "}
                {activeSeq.main.place.split(",")[0]} · {isEs ? "hace" : ""} {Math.round(hoursSince)} h
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-black text-foreground tabular-nums">{activeSeq.after.length}</div>
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

        {/* 7-day context for Venezuela */}
        {isVen && weekDailyBins.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {isEs ? "Actividad Venezuela — últimos 7 días" : "Venezuela activity — last 7 days"}
            </p>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weekDailyBins} margin={{ top: 4, right: 8, bottom: 0, left: -22 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 15% 18%)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: "hsl(240 10% 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: "hsl(240 10% 55%)" }} axisLine={false} tickLine={false} width={24} />
                  <RTooltip
                    contentStyle={{ background: "hsl(240 18% 10%)", border: "1px solid hsl(240 15% 18%)", borderRadius: 12, fontSize: 11 }}
                    formatter={(v: any, n: any) => [v, n === "count" ? (isEs ? "eventos" : "events") : "Máx M"]}
                  />
                  <Bar dataKey="count" fill="hsl(250 70% 60%)" fillOpacity={0.7} radius={[3, 3, 0, 0]} isAnimationActive={false} name="count" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---- Venezuela week data loaded but no sequence/swarm — show activity overview ----
  if (isVen && weekEvents && weekEvents.length > 0) {
    const now = Date.now();
    const last24Count = weekEvents.filter((e) => now - e.time < 24 * H).length;
    const maxWeek = weekEvents.reduce((m, e) => Math.max(m, e.mag), 0);
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <div className="mb-4 flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 border border-primary/20">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-foreground">
                {isEs ? "Actividad sísmica Venezuela" : "Venezuela seismic activity"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEs ? "Resumen últimos 7 días · USGS M2.5+" : "Last 7 days summary · USGS M2.5+"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-black text-foreground tabular-nums">{weekEvents.length}</div>
            <div className="text-[11px] text-muted-foreground">{isEs ? "eventos (7 días)" : "events (7 days)"}</div>
          </div>
        </div>

        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={weekDailyBins} margin={{ top: 4, right: 8, bottom: 0, left: -22 }}>
              <defs>
                <linearGradient id="weekFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(250 70% 70%)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(250 70% 70%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 15% 18%)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(240 10% 55%)" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "hsl(240 10% 55%)" }} axisLine={false} tickLine={false} width={28} />
              <RTooltip
                contentStyle={{ background: "hsl(240 18% 10%)", border: "1px solid hsl(240 15% 18%)", borderRadius: 12, fontSize: 12 }}
                formatter={(v: any) => [v, isEs ? "eventos" : "events"]}
              />
              <Area type="monotone" dataKey="count" stroke="hsl(250 70% 70%)" strokeWidth={2} fill="url(#weekFill)" isAnimationActive={false} name="count" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: isEs ? "Eventos hoy" : "Today", value: last24Count },
            { label: isEs ? "Máx semana" : "Week max", value: `M ${maxWeek.toFixed(1)}` },
            {
              label: isEs ? "Tendencia" : "Trend",
              value: trend === "up" ? "↑" : trend === "down" ? "↓" : "—",
              color: trendColor,
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-border/40 bg-background/40 p-3 text-center">
              <div className={cn("font-display text-xl font-black text-foreground", color)}>{value}</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default AftershockForecast;
