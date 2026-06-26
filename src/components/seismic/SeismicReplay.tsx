import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { Earthquake } from "@/hooks/useEarthquakes";

interface Props {
  events: Earthquake[];
  isEs: boolean;
  /** Emits the replay cutoff (epoch ms) or null when showing the full set ("live"). */
  onCutoff: (cutoff: number | null) => void;
}

const WINDOW_MS = 72 * 3600 * 1000;
const STEPS = 1000;

const magCss = (m: number) =>
  m >= 7 ? "#f87171" : m >= 6 ? "#fb923c" : m >= 5 ? "#facc15" : m >= 4 ? "#a78bfa" : "#818cf8";

export function SeismicReplay({ events, isEs, onCutoff }: Props) {
  const locale = isEs ? es : enUS;
  const [value, setValue] = useState(STEPS); // start at "live"
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCutoffRef = useRef(onCutoff);
  onCutoffRef.current = onCutoff;

  const { tMin, tMax } = useMemo(() => {
    const tMaxV = Date.now();
    if (events.length === 0) return { tMin: tMaxV - WINDOW_MS, tMax: tMaxV };
    const minTime = Math.min(...events.map((e) => e.time));
    return { tMin: Math.max(minTime, tMaxV - WINDOW_MS), tMax: tMaxV };
  }, [events]);

  const cutoff = value >= STEPS ? null : tMin + (value / STEPS) * (tMax - tMin);

  // emit cutoff to the parent (drives the globe / map)
  useEffect(() => {
    onCutoffRef.current(cutoff);
  }, [cutoff]);

  // reset to live when this control unmounts
  useEffect(() => {
    return () => {
      onCutoffRef.current(null);
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      if (timer.current) clearInterval(timer.current);
      return;
    }
    setPlaying(true);
    if (value >= STEPS) setValue(0);
    timer.current = setInterval(() => {
      setValue((v) => {
        const next = v + STEPS / 90; // ~9 s sweep
        if (next >= STEPS) {
          if (timer.current) clearInterval(timer.current);
          setPlaying(false);
          return STEPS;
        }
        return next;
      });
    }, 100);
  };

  const shown = cutoff == null ? events : events.filter((e) => e.time <= cutoff);
  const strongest = shown.length ? shown.reduce((a, b) => (b.mag > a.mag ? b : a)) : undefined;
  const timeLabel =
    cutoff == null
      ? isEs
        ? "En vivo (ahora)"
        : "Live (now)"
      : formatDistanceToNow(cutoff, { addSuffix: true, locale });

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 border border-primary/20">
          <History className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-base font-semibold text-foreground">
            {isEs ? "Reproductor de secuencia" : "Sequence replay"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isEs ? "Revive las últimas 72 h en el mapa" : "Replay the last 72 h on the map"}
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-lg font-bold tabular-nums" style={{ color: strongest ? magCss(strongest.mag) : "#94a3b8" }}>
            {strongest ? `M ${strongest.mag.toFixed(1)}` : "—"}
          </div>
          <div className="text-[11px] text-muted-foreground">{shown.length} {isEs ? "eventos" : "events"}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pausar" : "Reproducir"}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition-colors hover:bg-primary/20"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-display text-sm font-medium text-foreground">{timeLabel}</span>
          </div>
          <input
            type="range"
            min={0}
            max={STEPS}
            value={value}
            onChange={(e) => {
              if (playing) {
                setPlaying(false);
                if (timer.current) clearInterval(timer.current);
              }
              setValue(Number(e.target.value));
            }}
            className="w-full cursor-pointer"
            style={{ accentColor: "hsl(250 70% 70%)" }}
          />
          {/* event strip */}
          <div className="relative mt-1 h-3">
            {events.map((e) => {
              const left = tMax === tMin ? 0 : ((e.time - tMin) / (tMax - tMin)) * 100;
              if (left < 0 || left > 100) return null;
              const visible = cutoff == null || e.time <= cutoff;
              return (
                <span
                  key={e.id}
                  className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-200"
                  style={{ left: `${left}%`, background: magCss(e.mag), opacity: visible ? 1 : 0.2 }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeismicReplay;
