import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle, Waves, Clock, MapPin } from "lucide-react";
import type { Earthquake } from "@/hooks/useEarthquakes";
import { cn } from "@/lib/utils";

interface Props {
  events: Earthquake[];
  selected: Earthquake | null;
  onSelect: (e: Earthquake) => void;
}

function MagBadge({ mag }: { mag: number }) {
  const cls =
    mag >= 7 ? "bg-red-500/15 text-red-400 border-red-500/30 ring-red-500/20" :
    mag >= 6 ? "bg-orange-500/15 text-orange-400 border-orange-500/30 ring-orange-500/20" :
    mag >= 5 ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30 ring-yellow-500/20" :
    mag >= 4 ? "bg-violet-500/15 text-violet-400 border-violet-500/30 ring-violet-500/20" :
               "bg-indigo-500/15 text-indigo-400 border-indigo-500/30 ring-indigo-500/20";
  return (
    <span className={cn(
      "inline-flex items-center justify-center w-14 h-7 rounded-full border text-xs font-bold tabular-nums flex-shrink-0",
      cls
    )} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      M {mag.toFixed(1)}
    </span>
  );
}

export function EarthquakeList({ events, selected, onSelect }: Props) {
  if (events.length === 0) return (
    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
      <Waves className="w-8 h-8 opacity-20" />
      <p className="text-sm">Sin eventos en este rango</p>
    </div>
  );
  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[520px] pr-1">
      {events.map((eq) => {
        const isSelected = selected?.id === eq.id;
        const timeAgo = formatDistanceToNow(new Date(eq.time), { addSuffix: true, locale: es });
        return (
          <button
            key={eq.id}
            onClick={() => onSelect(eq)}
            className={cn(
              "w-full text-left rounded-xl p-3 border transition-all duration-150",
              "hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected
                ? "bg-primary/10 border-primary/40"
                : "bg-card border-border/50 hover:border-primary/30"
            )}
          >
            <div className="flex items-start gap-3">
              <MagBadge mag={eq.mag} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1"
                   style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {eq.place}
                </p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />{timeAgo}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />{eq.depth.toFixed(0)} km
                  </span>
                  {eq.tsunami === 1 && (
                    <span className="flex items-center gap-1 text-xs text-blue-400 font-semibold">
                      <Waves className="w-3 h-3" />Tsunami
                    </span>
                  )}
                  {eq.alert && eq.alert !== "green" && (
                    <span className="flex items-center gap-1 text-xs text-orange-400 font-semibold">
                      <AlertTriangle className="w-3 h-3" />Alerta {eq.alert}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
