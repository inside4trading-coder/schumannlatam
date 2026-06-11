import { SchumannReading } from "@/types/schumann";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Radio } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  nivelToNumber,
  nivelStateLabel,
  nivelDisplayName,
  ActivityLevel,
} from "@/lib/activity";
import { cn } from "@/lib/utils";

interface DashboardHeroProps {
  reading: SchumannReading;
}

const stateTextClasses: Record<ActivityLevel, string> = {
  1: "text-badge-baja",
  2: "text-badge-media",
  3: "text-badge-alta",
  4: "text-badge-muy-alta",
};

const stateDotClasses: Record<ActivityLevel, string> = {
  1: "bg-badge-baja",
  2: "bg-badge-media",
  3: "bg-badge-alta",
  4: "bg-badge-muy-alta",
};

export const DashboardHero = ({ reading }: DashboardHeroProps) => {
  const { language, t } = useLanguage();
  const dateLocale = language === "es" ? es : enUS;

  const level = nivelToNumber(reading.nivelActividad);
  const stateLabel = nivelStateLabel(level, t);
  const levelName = nivelDisplayName(level, t);

  const updatedAt = format(new Date(reading.date), "d MMM yyyy, HH:mm", {
    locale: dateLocale,
  });

  return (
    <section id="estado" aria-label={t.dashboard.currentState} className="scroll-mt-16">
      <div className="container mx-auto px-4 pt-6 pb-4 sm:pt-8 sm:pb-6">
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Estado actual */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping",
                      stateDotClasses[level]
                    )}
                  />
                  <span
                    className={cn(
                      "relative inline-flex h-2.5 w-2.5 rounded-full",
                      stateDotClasses[level]
                    )}
                  />
                </span>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  {t.dashboard.currentState} · {t.dashboard.live}
                </p>
              </div>
              <p
                className={cn(
                  "text-4xl sm:text-5xl md:text-6xl font-display font-medium leading-none",
                  stateTextClasses[level]
                )}
              >
                {stateLabel}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t.today.readingOfDay}:{" "}
                <span className="text-foreground font-medium">{levelName}</span>
              </p>
            </div>

            {/* Métricas */}
            <dl className="grid grid-cols-3 gap-4 md:gap-8 md:text-right">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t.dashboard.fundamentalLabel}
                </dt>
                <dd className="mt-1 text-xl sm:text-2xl font-display tabular-nums text-foreground">
                  7.83 <span className="text-sm text-muted-foreground">Hz</span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t.dashboard.stationLabel}
                </dt>
                <dd className="mt-1 text-sm sm:text-base text-foreground flex md:justify-end items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {t.dashboard.stationName}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t.dashboard.lastUpdate}
                </dt>
                <dd className="mt-1 text-sm sm:text-base tabular-nums text-foreground">
                  {updatedAt}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};
