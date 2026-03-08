import { Card, CardContent } from "@/components/ui/card";
import { Heart, ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export const AgradecimientosView = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-display font-light text-foreground">{t.acknowledgements.title}</h2>

      <Card className="glass glass-dark overflow-hidden">
        <div className="flex">
          <div className="w-1.5 gradient-cosmic flex-shrink-0" />
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-display font-medium text-foreground">{t.acknowledgements.creators.title}</h3>
            </div>

            <p className="text-card-foreground leading-relaxed">{t.acknowledgements.creators.p1}</p>
            <p className="text-card-foreground leading-relaxed">{t.acknowledgements.creators.p2}</p>
            <p className="text-card-foreground leading-relaxed">{t.acknowledgements.creators.p3}</p>

            <div className="mt-4 rounded-lg overflow-hidden">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/XpdpW0z9xnQ?si=ZkF3GgNfCJEp87iC"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              {[
                { href: "https://musacreativo.com/", name: "Musa Automation", desc: t.acknowledgements.thanks.musa, prefix: t.acknowledgements.thanks.thanksTo },
                { href: "https://en.tsu.ru/", name: "Tomsk University", desc: t.acknowledgements.thanks.tomsk, prefix: t.acknowledgements.thanks.thanksTo },
                { href: "https://sos70.ru/", name: "Russian Space Observation System 70", desc: t.acknowledgements.thanks.sos70, prefix: t.acknowledgements.thanks.thanksToThe },
              ].map(({ href, name, desc, prefix }) => (
                <div key={name} className="flex items-start gap-3">
                  <ExternalLink className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <p className="text-sm text-card-foreground leading-relaxed">
                    {prefix}{" "}
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                      {name}
                    </a>{" "}
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};
