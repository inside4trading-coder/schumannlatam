import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ExternalLink, X, Waves, MapPin, Clock, Activity, Users, AlertTriangle, Repeat2, Zap, Navigation } from "lucide-react";
import type { Earthquake } from "@/hooks/useEarthquakes";
import { nearestCity, detectAftershocks } from "@/hooks/useEarthquakes";
import { Button } from "@/components/ui/button";

interface Props {
  eq: Earthquake;
  onClose: () => void;
  allEvents?: Earthquake[];
}

function Row({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/30 last:border-0">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="flex-1 flex justify-between gap-2 min-w-0">
        <span className="text-sm text-muted-foreground shrink-0">{label}</span>
        <span className="text-sm font-medium text-foreground text-right">{value}</span>
      </div>
    </div>
  );
}

export function EarthquakeDetail({ eq, onClose, allEvents = [] }: Props) {
  const alertColor =
    eq.alert === "red" ? "text-red-400" :
    eq.alert === "orange" ? "text-orange-400" :
    eq.alert === "yellow" ? "text-yellow-400" : "text-green-400";

  const aftershockIds = detectAftershocks(allEvents.length > 0 ? allEvents : [eq]);
  const isAftershock = aftershockIds.has(eq.id);

  const nearest = nearestCity(eq.lat, eq.lng);
  const showCity = nearest.distKm < 800;

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 relative">
      <button
        onClick={onClose}
        aria-label="Cerrar detalle"
        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="mb-4 pr-8">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="text-4xl font-black tabular-nums"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: "var(--gradient-cosmic)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            M {eq.mag.toFixed(1)}
          </span>
          {isAftershock ? (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Repeat2 className="w-3.5 h-3.5" />Réplica
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" />Sismo principal
            </span>
          )}
          {eq.tsunami === 1 && (
            <span className="flex items-center gap-1 text-xs text-blue-400 font-semibold">
              <Waves className="w-3.5 h-3.5" />Alerta tsunami
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-foreground leading-snug"
           style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {eq.place}
        </p>
      </div>

      <div className="mb-4">
        <Row icon={Clock} label="Fecha UTC"
          value={format(new Date(eq.time), "d MMM yyyy · HH:mm:ss", { locale: es })} />
        <Row icon={MapPin} label="Coordenadas"
          value={`${eq.lat.toFixed(3)}°, ${eq.lng.toFixed(3)}°`} />
        <Row icon={MapPin} label="Profundidad" value={`${eq.depth.toFixed(1)} km`} />
        {showCity && (
          <Row icon={Navigation} label="Ciudad cercana"
            value={`${nearest.city.name} (~${nearest.distKm} km)`} />
        )}
        <Row icon={Activity} label="Significancia" value={`${eq.sig} / 1000`} />
        {eq.felt && (
          <Row icon={Users} label="Reportes"
            value={`${eq.felt.toLocaleString()} personas`} />
        )}
        {eq.alert && (
          <Row icon={AlertTriangle} label="Alerta PAGER"
            value={<span className={alertColor + " font-semibold capitalize"}>{eq.alert}</span>} />
        )}
        <Row icon={Activity} label="Estado"
          value={eq.status === "reviewed" ? "✓ Revisado" : "Automático"} />
      </div>

      <Button asChild variant="outline" size="sm" className="w-full gap-2">
        <a href={eq.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-3.5 h-3.5" />
          Ver en USGS
        </a>
      </Button>
    </div>
  );
}
