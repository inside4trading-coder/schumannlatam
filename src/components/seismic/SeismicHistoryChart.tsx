import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from "recharts";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { TrendingUp, Zap, AlertCircle } from "lucide-react";
import { useSeismicHistory } from "@/hooks/useSeismicHistory";
import type { RegionFilter } from "@/hooks/useEarthquakes";
import { cn } from "@/lib/utils";

interface Props {
  region: RegionFilter;
  isEs: boolean;
}

const RANGES: { label: string; days: number }[] = [
  { label: "7 días", days: 7 },
  { label: "14 días", days: 14 },
  { label: "30 días", days: 30 },
];

export function SeismicHistoryChart({ region, isEs }: Props) {
  const [days, setDays] = useState(30);
  const { data, isLoading, isError } = useSeismicHistory(region, days);
  const locale = isEs ? es : enUS;

  const chartData =
    data?.daily.map((b) => ({
      ts: b.ts,
      label: format(b.ts, "d MMM", { locale }),
      count: b.count,
      maxMag: b.maxMag,
    })) ?? [];

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="mb-4 flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 border border-primary/20">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              {isEs ? "Frecuencia sísmica histórica" : "Historical seismic frequency"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {data ? (
                <>
                  {data.total.toLocaleString(isEs ? "es" : "en")} {isEs ? "eventos" : "events"}
                  {data.strongest && (
                    <>
                      {" · "}
                      <Zap className="inline h-3 w-3 text-yellow-400" /> {isEs ? "máx." : "max"} M{" "}
                      {data.strongest.mag.toFixed(1)}
                    </>
                  )}
                </>
              ) : isEs ? (
                "Datos de USGS"
              ) : (
                "USGS data"
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={cn(
                "rounded-full border px-3 py-1 font-display text-xs font-medium transition-all",
                days === r.days
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/40 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isError ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
          <AlertCircle className="h-6 w-6 opacity-40" />
          <p className="text-sm">{isEs ? "No se pudo cargar el histórico de USGS" : "Could not load USGS history"}</p>
        </div>
      ) : isLoading ? (
        <div className="h-56 w-full animate-pulse rounded-xl bg-muted/40" />
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="histFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(250 70% 70%)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(270 55% 65%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 15% 18%)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "hsl(240 10% 55%)" }}
                interval="preserveStartEnd"
                minTickGap={24}
                axisLine={false}
                tickLine={false}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "hsl(240 10% 55%)" }} axisLine={false} tickLine={false} width={28} />
              <RTooltip
                contentStyle={{ background: "hsl(240 18% 10%)", border: "1px solid hsl(240 15% 18%)", borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: "hsl(240 15% 93%)" }}
                formatter={(v: any, n: any) => [v, n === "count" ? (isEs ? "sismos" : "quakes") : n]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="hsl(250 70% 70%)"
                strokeWidth={2}
                fill="url(#histFill)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default SeismicHistoryChart;
