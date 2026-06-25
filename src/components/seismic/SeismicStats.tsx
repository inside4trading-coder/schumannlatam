import { Activity, Zap, AlertTriangle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Earthquake } from "@/hooks/useEarthquakes";

interface Props {
  events: Earthquake[];
  lastUpdated: Date | null;
}

export function SeismicStats({ events, lastUpdated }: Props) {
  const strongest = events.reduce((a, b) => (b.mag > a.mag ? b : a), events[0]);
  const count6plus = events.filter((e) => e.mag >= 6).length;
  const count4plus = events.filter((e) => e.mag >= 4).length;

  const stats = [
    {
      icon: Activity,
      label: "Total eventos",
      value: events.length,
      sub: "M2.5+ · últimas 24h",
      gradient: false,
      accent: "text-primary",
    },
    {
      icon: Zap,
      label: "Mayor magnitud",
      value: strongest ? `M ${strongest.mag.toFixed(1)}` : "—",
      sub: strongest?.place?.split(",")[0] ?? "",
      gradient: true,
      accent: "text-primary",
    },
    {
      icon: AlertTriangle,
      label: "M6+ peligrosos",
      value: count6plus,
      sub: `${count4plus} eventos M4+`,
      gradient: false,
      accent: count6plus > 0 ? "text-orange-400" : "text-muted-foreground",
    },
    {
      icon: Clock,
      label: "Actualizado",
      value: lastUpdated
        ? formatDistanceToNow(lastUpdated, { addSuffix: true, locale: es })
        : "—",
      sub: "Intervalo: 60 s",
      gradient: false,
      accent: "text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value, sub, gradient, accent }) => (
        <div
          key={label}
          className="rounded-2xl border border-border/50 bg-card p-4 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{ background: "var(--gradient-cosmic-subtle)" }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={"w-4 h-4 " + accent} />
              <span className="text-xs text-muted-foreground font-display">{label}</span>
            </div>
            {gradient ? (
              <p
                className="text-2xl font-black tabular-nums"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: "var(--gradient-cosmic)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {value}
              </p>
            ) : (
              <p
                className={"text-2xl font-black tabular-nums " + accent}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {value}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5 truncate font-display">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
