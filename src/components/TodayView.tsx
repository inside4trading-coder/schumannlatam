import { SchumannReading } from "@/types/schumann";
import { BadgeNivelActividad } from "./BadgeNivelActividad";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Activity, Brain, Heart, Lightbulb } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface TodayViewProps {
  reading: SchumannReading;
}

export const TodayView = ({ reading }: TodayViewProps) => {
  const { language, t } = useLanguage();
  const dateLocale = language === "es" ? es : enUS;
  
  const formattedDate = format(new Date(reading.date), "d MMM yyyy", {
    locale: dateLocale,
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{formattedDate}</h2>
          <p className="text-muted-foreground mt-1">{t.today.readingOfDay}</p>
        </div>
        <BadgeNivelActividad nivel={reading.nivelActividad} />
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

      {/* K-Index Forecast */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>{t.today.geomagneticForecast}</CardTitle>
          <CardDescription>{t.today.kIndexDescription}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <iframe
            src="https://api.meteoagent.com/widgets/v1/kindex"
            style={{ border: 0, width: "100%", height: "500px" }}
            title="K-Index Forecast"
          />
        </CardContent>
      </Card>

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
            <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
              {reading.descripcionTecnica}
            </p>
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
            <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
              {reading.sensacionesFisicas}
            </p>
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
            <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
              {reading.sensacionesEmocionales}
            </p>
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
            <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
              {reading.recomendaciones}
            </p>
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
