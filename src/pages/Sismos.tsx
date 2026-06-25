import { useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, AlertCircle, Waves, ArrowLeft, Zap, Clock, BookOpen } from "lucide-react";
import { useEarthquakes, type MagFilter, type RegionFilter, type Earthquake } from "@/hooks/useEarthquakes";
import { EarthquakeMap } from "@/components/seismic/EarthquakeMap";
import { EarthquakeList } from "@/components/seismic/EarthquakeList";
import { EarthquakeDetail } from "@/components/seismic/EarthquakeDetail";
import { SeismicStats } from "@/components/seismic/SeismicStats";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useSeo } from "@/hooks/useSeo";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import schumannLogo from "@/assets/schumann-logo.png";

const MAG_FILTERS: { label: string; value: MagFilter }[] = [
  { label: "Todos / All", value: "all" },
  { label: "M2+", value: "2+" },
  { label: "M4+", value: "4+" },
  { label: "M6+", value: "6+" },
];

const REGION_FILTERS: { label: string; value: RegionFilter; flag?: string }[] = [
  { label: "Latinoamérica", value: "latam", flag: "🌎" },
  { label: "Venezuela", value: "venezuela", flag: "🇻🇪" },
  { label: "Global", value: "all", flag: "🌍" },
];

const Sismos = () => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [magFilter, setMagFilter] = useState<MagFilter>("all");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("latam");
  const [selected, setSelected] = useState<Earthquake | null>(null);
  const { events, total, loading, error, lastUpdated, refetch } = useEarthquakes(magFilter, regionFilter);

  useSeo({
    title: isEs
      ? "Sismos en tiempo real — Resonancia Schumann Latinoamérica"
      : "Real-time Earthquakes — Schumann Resonance Latin America",
    description: isEs
      ? "Monitoreo sísmico en tiempo real para Latinoamérica y Venezuela. Datos de USGS actualizados cada 60 segundos."
      : "Real-time seismic monitoring for Latin America and Venezuela. USGS data updated every 60 seconds.",
    canonical: "https://schumannlatam.vercel.app/sismos",
  });

  const handleSelect = (eq: Earthquake) => {
    setSelected((prev) => (prev?.id === eq.id ? null : eq));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header idéntico al mainpage */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity">
            <img
              src={schumannLogo}
              alt=""
              aria-hidden="true"
              className="h-8 w-8 object-contain flex-shrink-0"
            />
            <div className="min-w-0 leading-tight">
              <p className="font-display font-medium text-sm sm:text-base text-foreground truncate">
                Schumann Latam
              </p>
              <p className="text-[11px] text-muted-foreground truncate hidden sm:block">
                {isEs ? "La frecuencia de la Tierra" : "Earth's frequency"}
              </p>
            </div>
          </Link>

          {/* Nav desktop — mismos items que mainpage */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Secciones">
            {[
              { href: "/#estado", label: isEs ? "Hoy" : "Today", icon: Zap },
              { href: "/#historico", label: isEs ? "Historial" : "History", icon: Clock },
              { href: "/#aprende", label: isEs ? "Aprende" : "Learn", icon: BookOpen },
              { href: "/sismos", label: isEs ? "Sismos" : "Quakes", icon: Waves, active: true },
            ].map(({ href, label, icon: Icon, active }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm font-display"
          >
            <ArrowLeft className="w-4 h-4" />
            {isEs ? "Volver al inicio" : "Back to home"}
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20">
                  <Waves className="w-5 h-5 text-primary" />
                </div>
                <h1
                  className="text-3xl font-black tracking-tight text-foreground"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {isEs ? "Sismos en tiempo real" : "Real-time Earthquakes"}
                </h1>
              </div>
              <p className="text-muted-foreground text-sm">
                {events.length} {isEs ? "eventos · M2.5+ · últimas 24h · Fuente:" : "events · M2.5+ · last 24h · Source:"}{" "}
                <a
                  href="https://earthquake.usgs.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  USGS
                </a>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="gap-2 shrink-0 font-display"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
              {loading ? (isEs ? "Actualizando..." : "Updating...") : (isEs ? "Actualizar" : "Refresh")}
            </Button>
          </div>

          {/* Filtro de región */}
          <div className="flex gap-2 flex-wrap mt-5">
            {REGION_FILTERS.map(({ label, value, flag }) => (
              <button
                key={value}
                onClick={() => { setRegionFilter(value); setSelected(null); }}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium border transition-all flex items-center gap-1.5 font-display",
                  regionFilter === value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card/60 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground"
                )}
              >
                {flag} {label}
              </button>
            ))}
          </div>

          {/* Filtro de magnitud */}
          <div className="flex gap-2 flex-wrap mt-3">
            {MAG_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setMagFilter(value)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium border transition-all font-display",
                  magFilter === value
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "bg-card/60 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 mb-6 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="mb-6">
            <SeismicStats events={events} lastUpdated={lastUpdated} />
          </div>
        )}

        <div className="mb-6">
          <EarthquakeMap events={events} selected={selected} onSelect={handleSelect} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {isEs ? `Lista de eventos (${events.length})` : `Event list (${events.length})`}
            </h2>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-muted/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <EarthquakeList events={events} selected={selected} onSelect={handleSelect} />
            )}
          </div>

          <div>
            <h2 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {isEs ? "Detalle del evento" : "Event detail"}
            </h2>
            {selected ? (
              <EarthquakeDetail eq={selected} allEvents={events} onClose={() => setSelected(null)} />
            ) : (
              <div className="flex flex-col items-center justify-center h-48 rounded-2xl border border-dashed border-border/40 text-muted-foreground gap-2">
                <Waves className="w-8 h-8 opacity-20" />
                <p className="text-sm font-display">
                  {isEs ? "Selecciona un evento del mapa o la lista" : "Select an event from the map or list"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sismos;
