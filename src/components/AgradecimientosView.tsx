import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export const AgradecimientosView = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">{t.acknowledgements.title}</h2>
      </div>

      {/* Nuestros creadores */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle>{t.acknowledgements.creators.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">{t.acknowledgements.creators.p1}</p>
          <p className="text-card-foreground leading-relaxed">{t.acknowledgements.creators.p2}</p>
          <p className="text-card-foreground leading-relaxed">{t.acknowledgements.creators.p3}</p>

          <div className="mt-6 rounded-lg overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/XpdpW0z9xnQ?si=ZkF3GgNfCJEp87iC"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-card-foreground leading-relaxed">
                {t.acknowledgements.thanks.thanksTo}{" "}
                <a
                  href="https://musacreativo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold transition-colors"
                >
                  Musa Automation
                </a>{" "}
                {t.acknowledgements.thanks.musa}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-card-foreground leading-relaxed">
                {t.acknowledgements.thanks.thanksTo}{" "}
                <a
                  href="https://en.tsu.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold transition-colors"
                >
                  Tomsk University
                </a>{" "}
                {t.acknowledgements.thanks.tomsk}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-card-foreground leading-relaxed">
                {t.acknowledgements.thanks.thanksToThe}{" "}
                <a
                  href="https://sos70.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold transition-colors"
                >
                  Russian Space Observation System 70
                </a>{" "}
                {t.acknowledgements.thanks.sos70}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
