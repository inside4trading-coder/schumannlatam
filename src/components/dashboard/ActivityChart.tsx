import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SchumannReading } from "@/types/schumann";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  ActivityLevel,
  nivelDisplayName,
  nivelStateLabel,
  nivelToNumber,
} from "@/lib/activity";
import { cn } from "@/lib/utils";

interface ActivityChartProps {
  latestReading: SchumannReading;
  dailyReadings: SchumannReading[];
}

type Range = 7 | 30;

interface ChartPoint {
  date: string;
  level: ActivityLevel;
}

const levelColors: Record<ActivityLevel, string> = {
  1: "hsl(var(--badge-baja))",
  2: "hsl(var(--badge-media))",
  3: "hsl(var(--badge-alta))",
  4: "hsl(var(--badge-muy-alta))",
};

export const ActivityChart = ({ latestReading, dailyReadings }: ActivityChartProps) => {
  const { language, t } = useLanguage();
  const dateLocale = language === "es" ? es : enUS;
  const [range, setRange] = useState<Range>(7);

  const data = useMemo<ChartPoint[]>(() => {
    const daily = [...dailyReadings]
      .map((r) => ({
        date: r.date.split("T")[0],
        level: nivelToNumber(r.nivelActividad),
      }))
      .reverse();

    const todayKey = latestReading.date.split("T")[0];
    if (!daily.some((d) => d.date === todayKey)) {
      daily.push({ date: todayKey, level: nivelToNumber(latestReading.nivelActividad) });
    }

    return daily.slice(-range);
  }, [dailyReadings, latestReading, range]);

  const formatTick = (date: string) =>
    format(parseISO(date), range === 7 ? "EEE d" : "d MMM", { locale: dateLocale });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-lg font-display">
              {t.dashboard.activityChartTitle}
            </CardTitle>
            <CardDescription className="mt-1">
              {t.dashboard.activityChartSubtitle}
            </CardDescription>
          </div>
          <div className="flex gap-1" role="group" aria-label={t.dashboard.activityChartTitle}>
            {([7, 30] as const).map((r) => (
              <Button
                key={r}
                size="sm"
                variant={range === r ? "default" : "outline"}
                className={cn("h-8 px-3 text-xs tabular-nums")}
                onClick={() => setRange(r)}
                aria-pressed={range === r}
              >
                {r === 7 ? t.dashboard.range7d : t.dashboard.range30d}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length < 2 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            {t.dashboard.chartEmpty}
          </p>
        ) : (
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatTick}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  domain={[0.5, 4.5]}
                  ticks={[1, 2, 3, 4]}
                  tickFormatter={(v: number) => nivelDisplayName(v as ActivityLevel, t)}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                />
                <Tooltip
                  cursor={{ stroke: "hsl(var(--muted-foreground))", strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const point = payload[0].payload as ChartPoint;
                    return (
                      <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
                        <p className="text-muted-foreground tabular-nums">
                          {format(parseISO(point.date), "d MMM yyyy", { locale: dateLocale })}
                        </p>
                        <p className="font-medium" style={{ color: levelColors[point.level] }}>
                          {nivelDisplayName(point.level, t)} · {nivelStateLabel(point.level, t)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="stepAfter"
                  dataKey="level"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#activityFill)"
                  dot={({ cx, cy, payload }) => (
                    <circle
                      key={(payload as ChartPoint).date}
                      cx={cx}
                      cy={cy}
                      r={3.5}
                      fill={levelColors[(payload as ChartPoint).level]}
                      stroke="hsl(var(--card))"
                      strokeWidth={1.5}
                    />
                  )}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
