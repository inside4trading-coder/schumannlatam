import { useMemo } from "react";
import { SchumannReading } from "@/types/schumann";
import { BadgeNivelActividad } from "@/components/BadgeNivelActividad";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Activity, Brain, Heart, Lightbulb, Clock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

interface DailyReportProps {
  reading: SchumannReading;
}

export const DailyReport = ({ reading }: DailyReportProps) => {
  const { language, t } = useLanguage();
  const dateLocale = language === "es" ? es : enUS;

  const datePattern = language === "es" ? "EEEE, d 'de' MMMM yyyy" : "EEEE, MMMM d, yyyy";
  const formattedDate = format(new Date(reading.date), datePattern, {
    locale: dateLocale,
  });

  const textsToTranslate = useMemo(
    () => [
      reading.descripcionTecnica,
      reading.sensacionesFisicas,
      reading.sensacionesEmocionales,
      reading.recomendaciones,
      reading.nivelActividad,
    ],
    [
      reading.descripcionTecnica,
      reading.sensacionesFisicas,
      reading.sensacionesEmocionales,
      reading.recomendaciones,
      reading.nivelActividad,
    ]
  );

  const { translatedTexts, isTranslating } = useTranslation(textsToTranslate);

  const [descripcionTecnica, sensacionesFisicas, sensacionesEmocionales, recomendaciones, nivelActividad] =
    translatedTexts.length > 0 ? translatedTexts : textsToTranslate;

  const renderContent = (content: string | undefined | null) => {
    if (isTranslating) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
    }
    return <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">{content}</p>;
  };

  const hasDetailedData =
    reading.descripcionTecnica ||
    reading.sensacionesFisicas ||
    reading.sensacionesEmocionales ||
    reading.recomendaciones;

  const sections = [
    { key: "tech", icon: Activity, title: t.today.technicalDescription, content: descripcionTecnica, show: !!reading.descripcionTecnica },
    { key: "phys", icon: Heart, title: t.today.physicalSensations, content: sensacionesFisicas, show: !!reading.sensacionesFisicas },
    { key: "emot", icon: Brain, title: t.today.emotionalSensations, content: sensacionesEmocionales, show: !!reading.sensacionesEmocionales },
  ].filter((s) => s.show);

  return (
    <section id="informe" aria-label={t.dashboard.reportTitle} className="scroll-mt-16 space-y-4 md:space-y-6">
      {/* Cabecera editorial del informe */}
      <div className="flex items-end justify-between gap-3 flex-wrap border-b border-border pb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">
            {t.dashboard.reportTitle}
          </p>
          <h2 className="text-2xl sm:text-3xl font-display font-light text-foreground first-letter:uppercase">
            {formattedDate}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.dashboard.reportSubtitle}</p>
        </div>
        <BadgeNivelActividad nivel={nivelActividad || reading.nivelActividad} />
      </div>

      {!hasDetailedData && (
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" aria-hidden="true" />
              <CardTitle>{t.today.dataUpdating}</CardTitle>
            </div>
            <CardDescription className="text-amber-600/80 dark:text-amber-400/80">
              {t.today.dataUpdatingDescription}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {sections.length > 0 && (
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          {sections.map(({ key, icon: Icon, title, content }) => (
            <Card key={key} className="glass glass-dark">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center gradient-cosmic-subtle">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg font-display">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>{renderContent(content)}</CardContent>
            </Card>
          ))}
        </div>
      )}

      {reading.recomendaciones && (
        <Card className="glass glass-dark overflow-hidden">
          <div className="flex">
            <div className="w-1.5 gradient-cosmic flex-shrink-0" />
            <div className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center gradient-cosmic-subtle">
                    <Lightbulb className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg font-display">{t.today.recommendations}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>{renderContent(recomendaciones)}</CardContent>
            </div>
          </div>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-center italic max-w-2xl mx-auto">
        {t.today.disclaimer}
      </p>
    </section>
  );
};
