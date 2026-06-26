import { useState, useMemo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, AlertCircle, Waves, ArrowLeft, Zap, Clock, BookOpen, Globe2, Map as MapIcon, Activity, History } from "lucide-react";
import { useEarthquakes, type MagFilter, type RegionFilter, type Earthquake } from "@/hooks/useEarthquakes";
import { EarthquakeMap } from "@/components/seismic/EarthquakeMap";
import { EarthquakeList } from "@/components/seismic/EarthquakeList";
import { EarthquakeDetail } from "@/components/seismic/EarthquakeDetail";
import { SeismicStats } from "@/components/seismic/SeismicStats";
import { AftershockForecast } from "@/components/seismic/AftershockForecast";
import { FeltReport } from "@/components/seismic/FeltReport";
import { SeismicReplay } from "@/components/seismic/SeismicReplay";
import { SeismicHistoryChart } from "@/components/seismic/SeismicHistoryChart";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useSeo } from "@/hooks/useSeo";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import schumannLogo from "@/assets/schumann-logo.png";

// Three.js only loads when the 3D globe is actually shown.
const EarthquakeGlobe = lazy(() => import("@/components/seismic/EarthquakeGlobe"));

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

const RECENT_STRONG_MS = 72 * 3600 * 1000;

const Sismos = () => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [magFilter, setMagFilter] = useState<MagFilter>("all");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("latam");
  const [selected, setSelected] = useState<Earthquake | null>(null);
  const [tab, setTab] = useState<"live" | "history">("live");
  const [view3d, setView3d] = useState(true);
  const [cutoff, setCutoff] = useState<number | null>(null);
  const { events, total, loading, error, lastUpdated, refetch } = useEarthquakes(magFilter, regionFilter);

  useSeo({
    title: isEs
      ? "Sismos en tiempo real — Resonancia Schumann Latinoamérica"
      : "Real-time Earthquakes — Schumann Resonance Latin America",
    description: isEs
      ? "Monitoreo sísmico en tiempo real para Latinoamérica y Venezuela. Globo 3D, histórico y réplicas. Datos de USGS."
      : "Real-time seismic monitoring for Latin America and Venezuela. 3D globe, history and aftershocks. USGS data.",
    canonical: "https://schumannlatam.vercel.app/sismos",
  });

  const handleSelect = (eq: Earthquake) => {
    setSelected((prev) => (prev?.id === eq.id ? null : eq));
  };

  // Replay cutoff filters what the map / globe / list show.
  const displayEvents = useMemo(
    () => (cutoff == null ? events : events.filter((e) => e.time <= cutoff)),
    [events, cutoff],
  );

  // Most significant recent quake drives the "¿Lo sentiste?" prompt.
  const recentStrong = useMemo(() => {
    const now = Date.now();
    const cand = events.filter((e) => now - e.time < RECENT_STRONG_MS && e.mag >= 3.5);
    if (!cand.length) return null;
    return cand.reduce((a, b) => (b.mag > a.mag ? b : a));
  }, [events]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header idéntico al mainpage */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity">
            <img src={schumannLogo} alt="" aria-hidden="true" className="h-8 w-8 object-contain flex-shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="font-display font-medium text-sm sm:text-base text-foreground truncate">Schumann Latam</p>
              <p className="text-[11px] text-muted-foreground truncate hidden sm:block">
                {isEs ? "La frecuencia de la Tierra" : "Earth's frequency"}
              </p>
            </div>
          </Link>

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
                  active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
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
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm font-display">
            <ArrowLeft className="w-4 h-4" />
            {isEs ? "Volver al inicio" : "Back to home"}
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20">
                  <Waves className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {isEs ? "Sismos en tiempo real" : "Real-time Earthquakes"}
                </h1>
              </div>
              <p className="text-muted-foreground text-sm">
                {events.length} {isEs ? "eventos · M2.5+ · últimas 24h · Fuente:" : "events · M2.5+ · last 24h · Source:"}{" "}
                <a href="https://earthquake.usgs.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  USGS
                </a>
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={refetch} disabled={loading} className="gap-2 shrink-0 font-display">
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
              {loading ? (isEs ? "Actualizando..." : "Updating...") : isEs ? "Actualizar" : "Refresh"}
            </Button>
          </div>

          {/* Filtro de región */}
          <div className="flex gap-2 flex-wrap mt-5">
            {REGION_FILTERS.map(({ label, value, flag }) => (
              <button
                key={value}
                onClick={() => {
                  setRegionFilter(value);
                  setSelected(null);
                }}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium border transition-all flex items-center gap-1.5 font-display",
                  regionFilter === value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card/60 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground",
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
                    : "bg-card/60 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground",
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

        {/* Tabs En vivo / Histórico */}
        <div className="mb-6 inline-flex gap-1 rounded-xl border border-border/50 bg-card/60 p-1">
          {([
            { id: "live", label: isEs ? "En vivo" : "Live", icon: Activity },
            { id: "history", label: isEs ? "Histórico" : "History", icon: History },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-1.5 font-display text-sm font-medium transition-colors",
                tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {tab === "live" ? (
          <>
            {!loading && events.length > 0 && (
              <div className="mb-6">
                <SeismicStats events={events} lastUpdated={lastUpdated} />
              </div>
            )}

            {/* Réplicas + ¿Lo sentiste? */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <AftershockForecast events={events} isEs={isEs} />
              {recentStrong ? (
                <FeltReport quake={recentStrong} isEs={isEs} />
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 p-6 text-center text-muted-foreground">
                  <Waves className="mb-2 h-7 w-7 opacity-20" />
                  <p className="text-sm font-display">
                    {isEs ? "Sin sismos recientes para reportar en la región" : "No recent quakes to report in the region"}
                  </p>
                </div>
              )}
            </div>

            {/* Toggle 2D / 3D */}
            <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {view3d ? (isEs ? "Globo 3D" : "3D globe") : isEs ? "Mapa" : "Map"}
              </h2>
              <div className="inline-flex gap-1 rounded-lg border border-border/50 bg-card/60 p-0.5">
                <button
                  onClick={() => setView3d(true)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    view3d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Globe2 className="h-3.5 w-3.5" />
                  3D
                </button>
                <button
                  onClick={() => setView3d(false)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    !view3d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <MapIcon className="h-3.5 w-3.5" />
                  2D
                </button>
              </div>
            </div>

            <div className="mb-6">
              {view3d ? (
                <Suspense fallback={<div className="h-[420px] w-full animate-pulse rounded-2xl bg-muted/40 sm:h-[480px]" />}>
                  <EarthquakeGlobe events={displayEvents} selected={selected} onSelect={handleSelect} />
                </Suspense>
              ) : (
                <EarthquakeMap events={displayEvents} selected={selected} onSelect={handleSelect} />
              )}
            </div>

            {/* Reproductor de secuencia */}
            <div className="mb-6">
              <SeismicReplay events={events} isEs={isEs} onCutoff={setCutoff} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {isEs ? `Lista de eventos (${displayEvents.length})` : `Event list (${displayEvents.length})`}
                </h2>
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-16 rounded-xl bg-muted/50 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <EarthquakeList events={displayEvents} selected={selected} onSelect={handleSelect} />
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
          </>
        ) : (
          <div className="flex flex-col gap-6">
            <SeismicHistoryChart region={regionFilter} isEs={isEs} />
            <div className="rounded-2xl border border-border/50 bg-card p-5 text-sm text-muted-foreground">
              <p className="leading-relaxed">
                {isEs
                  ? "El histórico usa los feeds públicos de USGS (últimos 30 días) y agrega la actividad por día. Cambia la región arriba y el rango (7 / 14 / 30 días) en el gráfico. Venezuela y Latinoamérica incluyen M2.5+; la vista global usa M4.5+ para aligerar la carga."
                  : "History uses USGS public feeds (last 30 days) and aggregates activity by day. Switch region above and the range (7 / 14 / 30 days) in the chart. Venezuela and Latin America include M2.5+; the global view uses M4.5+ to stay light."}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Sismos;
