import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Info, TrendingUp, AlertCircle } from "lucide-react";
import schumannGraphExample from "@/assets/schumann-graph-example.png";
import { useLanguage } from "@/i18n/LanguageContext";

export const BibliotecaView = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-display font-light text-foreground">{t.library.title}</h2>

      <Accordion type="single" collapsible defaultValue="history" className="space-y-3">
        {/* Historia */}
        <AccordionItem value="history" className="border rounded-xl px-5 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-display">{t.library.history.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-card-foreground leading-relaxed">
            <p>{t.library.history.p1}</p>
            <p>{t.library.history.p2}</p>
          </AccordionContent>
        </AccordionItem>

        {/* ¿Qué es? */}
        <AccordionItem value="whatIs" className="border rounded-xl px-5 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-primary" />
              <span className="font-display">{t.library.whatIs.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 text-card-foreground leading-relaxed">
            <p>{t.library.whatIs.intro}</p>
            <p>{t.library.whatIs.frequency} <strong>7.83 Hz</strong>. {t.library.whatIs.frequencyNote} <strong>14.07 Hz</strong>, <strong>20.25 Hz</strong>, <strong>26.41 Hz</strong> y <strong>32.45 Hz</strong>. {t.library.whatIs.frequencyMatch}</p>
            <div className="space-y-3">
              {(["naturalRhythms", "humanConnection", "harmonicBalance", "spiritualAwakening", "meditativeStates"] as const).map((key) => (
                <div key={key}>
                  <strong>{t.library.whatIs[key]}</strong>
                  <p className="mt-1">{t.library.whatIs[`${key}Desc`]}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Frecuencias cerebrales */}
        <AccordionItem value="brainwaves" className="border rounded-xl px-5 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-display">{t.library.brainwaves.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 text-card-foreground leading-relaxed">
            <p>{t.library.brainwaves.intro}</p>
            <div className="space-y-2">
              {(["delta", "theta", "alpha", "beta", "gamma"] as const).map((wave) => (
                <div key={wave}>
                  <strong>{t.library.brainwaves[wave]}</strong>
                  <p className="mt-0.5">{t.library.brainwaves[`${wave}Desc`]}</p>
                </div>
              ))}
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="font-semibold mb-3">{t.library.brainwaves.overlay}</p>
              <ul className="space-y-1.5">
                {(["78", "14", "20", "25", "33"] as const).map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>{f === "78" ? "7.8" : f === "33" ? "33+" : f} Hz</strong> {t.library.brainwaves[`freq${f}`]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Efectos */}
        <AccordionItem value="effects" className="border rounded-xl px-5 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-display">{t.library.effects.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 text-card-foreground leading-relaxed">
            <div>
              <h4 className="font-semibold mb-1">{t.library.effects.environmentalEffects}</h4>
              <p>{t.library.effects.environmentalEffectsDesc}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">{t.library.effects.sgmaActivity}</h4>
              {([1, 2, 3, 4, 5] as const).map((n) => (
                <p key={n} className="mt-1">{t.library.effects[`sgmaDesc${n}`]}</p>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Gráficas */}
        <AccordionItem value="graphs" className="border rounded-xl px-5 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-display">{t.library.graphs.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 text-card-foreground leading-relaxed">
            <ul className="space-y-2">
              {(["xAxis", "yAxis", "date", "hour", "color"] as const).map((key) => (
                <li key={key}><strong>{t.library.graphs[key]}</strong> {t.library.graphs[`${key}Desc`]}</li>
              ))}
            </ul>
            <div>
              <p className="text-sm text-muted-foreground mb-3">{t.library.graphs.exampleVisual}</p>
              <img src={schumannGraphExample} alt="Schumann Resonance graph example" className="w-full rounded-lg border border-border" />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Estaciones */}
        <AccordionItem value="stations" className="border rounded-xl px-5 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-display">{t.library.stations.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-card-foreground leading-relaxed">
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2"><span className="text-primary">•</span> Rhode Island</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span> <strong>Tomsk University Rusia</strong> {t.library.stations.tomskNote}</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span> MIT</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span> Italy</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Cultura popular */}
        <AccordionItem value="popCulture" className="border rounded-xl px-5 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-primary" />
              <span className="font-display">{t.library.popCulture.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 text-card-foreground leading-relaxed">
            <p>{t.library.popCulture.intro}</p>
            {(["newAge", "altMedicine", "musicArt", "filmTv"] as const).map((key) => (
              <div key={key}>
                <strong>{t.library.popCulture[key]}</strong>
                <p className="mt-1">{t.library.popCulture[`${key}Desc`]}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Limitaciones */}
        <AccordionItem value="limitations" className="border rounded-xl px-5 border-amber-500/30 bg-amber-500/5">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span className="font-display">{t.library.limitations.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-card-foreground leading-relaxed">
            <p>{t.library.limitations.intro}</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{t.library.limitations.point1}</li>
              <li>{t.library.limitations.point2}</li>
              <li>{t.library.limitations.point3}</li>
              <li>{t.library.limitations.point4}</li>
            </ul>
            <p className="italic">{t.library.limitations.finalNote}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
