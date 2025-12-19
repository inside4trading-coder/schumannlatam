import { SchumannReading } from "@/types/schumann";
import { BadgeNivelActividad } from "./BadgeNivelActividad";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Activity, Brain, Heart, Lightbulb } from "lucide-react";
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

  // Memoize texts array to prevent unnecessary re-renders
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

  const [
    descripcionTecnica,
    sensacionesFisicas,
    sensacionesEmocionales,
    recomendaciones,
    nivelActividad,
  ] = translatedTexts.length > 0 ? translatedTexts : textsToTranslate;

  const renderContent = (content: string | undefined | null, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
    }
    return (
      <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
        {content}
      </p>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{formattedDate}</h2>
          <p className="text-muted-foreground mt-1">{t.today.readingOfDay}</p>
        </div>
        <BadgeNivelActividad nivel={nivelActividad || reading.nivelActividad} />
      </div>

      {/* Imagen */}
      {reading.urlImagen && (
        <Card className="overflow-hidden border-2">
          <CardContent className="p-4">
            <img
              src={reading.urlImagen}
              alt={`Resonancia Schumann - ${reading.date}`}
              className="w-full max-h-80 object-contain rounded-xl"
            />
          </CardContent>
        </Card>
      )}

      {/* Descripción Técnica */}
      {reading.descripcionTecnica && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>{t.today.technicalDescription}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {renderContent(descripcionTecnica, isTranslating)}
          </CardContent>
        </Card>
      )}

      {/* Sensaciones Físicas */}
      {reading.sensacionesFisicas && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <CardTitle>{t.today.physicalSensations}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {renderContent(sensacionesFisicas, isTranslating)}
          </CardContent>
        </Card>
      )}

      {/* Sensaciones Emocionales */}
      {reading.sensacionesEmocionales && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>{t.today.emotionalSensations}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {renderContent(sensacionesEmocionales, isTranslating)}
          </CardContent>
        </Card>
      )}

      {/* Recomendaciones */}
      {reading.recomendaciones && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle>{t.today.recommendations}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {renderContent(recomendaciones, isTranslating)}
          </CardContent>
        </Card>
      )}


      {/* Disclaimer */}
      <Card className="bg-muted/50 border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center italic">
            {t.today.disclaimer}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
