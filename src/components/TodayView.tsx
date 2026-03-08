import { SchumannReading } from "@/types/schumann";
import { BadgeNivelActividad } from "./BadgeNivelActividad";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Activity, Brain, Heart, Lightbulb, Clock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useMemo } from "react";

interface TodayViewProps {
  reading: SchumannReading;
}

export const TodayView = ({ reading }: TodayViewProps) => {
  const { language, t } = useLanguage();
  const dateLocale = language === "es" ? es : enUS;

  const formattedDate = format(new Date(reading.date), "d MMM yyyy", {
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
    [reading.descripcionTecnica, reading.sensacionesFisicas, reading.sensacionesEmocionales, reading.recomendaciones, reading.nivelActividad]
  );

  const { translatedTexts, isTranslating } = useTranslation(textsToTranslate);

  const [descripcionTecnica, sensacionesFisicas, sensacionesEmocionales, recomendaciones, nivelActividad] =
    translatedTexts.length > 0 ? translatedTexts : textsToTranslate;

  const renderContent = (content: string | undefined | null, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
    }
    return <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">{content}</p>;
  };

  const hasDetailedData = reading.descripcionTecnica || reading.sensacionesFisicas || reading.sensacionesEmocionales || reading.recomendaciones;

  const sections = [
    { key: "tech", icon: Activity, title: t.today.technicalDescription, content: descripcionTecnica, show: !!reading.descripcionTecnica, color: "text-primary" },
    { key: "phys", icon: Heart, title: t.today.physicalSensations, content: sensacionesFisicas, show: !!reading.sensacionesFisicas, color: "text-accent" },
    { key: "emot", icon: Brain, title: t.today.emotionalSensations, content: sensacionesEmocionales, show: !!reading.sensacionesEmocionales, color: "text-primary" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Card */}
      <Card className="overflow-hidden border-0 shadow-lg gradient-cosmic-subtle">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            {reading.urlImagen && (
              <div className="md:w-1/2">
                <img
                  src={reading.urlImagen}
                  alt={`Resonancia Schumann - ${reading.date}`}
                  className="w-full h-56 md:h-full object-cover"
                />
              </div>
            )}
            {/* Date & Badge */}
            <div className={`flex flex-col justify-center p-6 md:p-8 ${reading.urlImagen ? "md:w-1/2" : "w-full"}`}>
              <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-2">
                {t.today.readingOfDay}
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-light text-foreground mb-4">
                {formattedDate}
              </h2>
              <BadgeNivelActividad nivel={nivelActividad || reading.nivelActividad} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Updating Notice */}
      {!hasDetailedData && (
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500 animate-pulse" />
              <CardTitle>{t.today.dataUpdating}</CardTitle>
            </div>
            <CardDescription className="text-amber-600/80 dark:text-amber-400/80">
              {t.today.dataUpdatingDescription}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* 2-Column Grid for sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {sections.filter(s => s.show).map(({ key, icon: Icon, title, content, color }) => (
          <Card key={key} className="glass glass-dark">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center gradient-cosmic-subtle`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <CardTitle className="text-lg font-display">{title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>{renderContent(content, isTranslating)}</CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations - Full width accent bar */}
      {reading.recomendaciones && (
        <Card className="glass glass-dark overflow-hidden">
          <div className="flex">
            <div className="w-1.5 gradient-cosmic flex-shrink-0" />
            <div className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center gradient-cosmic-subtle">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-display">{t.today.recommendations}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>{renderContent(recomendaciones, isTranslating)}</CardContent>
            </div>
          </div>
        </Card>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center italic max-w-2xl mx-auto">
        {t.today.disclaimer}
      </p>
    </div>
  );
};
