import { SchumannReading } from "@/types/schumann";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface SpectrogramCardProps {
  reading: SchumannReading;
}

export const SpectrogramCard = ({ reading }: SpectrogramCardProps) => {
  const { language, t } = useLanguage();
  const dateLocale = language === "es" ? es : enUS;

  if (!reading.urlImagen) return null;

  const formattedDate = format(new Date(reading.date), "d MMM yyyy", {
    locale: dateLocale,
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-lg font-display">
              {t.dashboard.spectrogramTitle}
              <span className="ml-2 text-sm font-normal text-muted-foreground tabular-nums">
                {formattedDate}
              </span>
            </CardTitle>
            <CardDescription className="mt-1">
              {t.dashboard.spectrogramSubtitle}
            </CardDescription>
          </div>
          <a
            href="#aprende"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            {t.dashboard.spectrogramHowTo}
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <img
          src={reading.urlImagen}
          alt={`${t.dashboard.spectrogramTitle} — ${formattedDate}`}
          className="w-full rounded-lg border border-border bg-black"
          loading="eager"
        />
      </CardContent>
    </Card>
  );
};
