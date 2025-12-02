import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Info, TrendingUp, AlertCircle } from "lucide-react";
import schumannGraphExample from "@/assets/schumann-graph-example.png";
import { useLanguage } from "@/i18n/LanguageContext";

export const BibliotecaView = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">{t.library.title}</h2>
      </div>

      {/* Historia */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>{t.library.history.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">{t.library.history.p1}</p>
          <p className="text-card-foreground leading-relaxed">{t.library.history.p2}</p>
        </CardContent>
      </Card>

      {/* ¿Qué es la Resonancia Schumann? */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <CardTitle>{t.library.whatIs.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">{t.library.whatIs.intro}</p>

          <p className="text-card-foreground leading-relaxed mt-4">
            {t.library.whatIs.frequency} <strong>7.83 Hz</strong>. {t.library.whatIs.frequencyNote}{" "}
            <strong>14.07 Hz</strong>, <strong>20.25 Hz</strong>, <strong>26.41 Hz</strong> y{" "}
            <strong>32.45 Hz</strong>. {t.library.whatIs.frequencyMatch}
          </p>

          <div className="space-y-3 mt-4">
            <div>
              <strong className="text-card-foreground">{t.library.whatIs.naturalRhythms}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                {t.library.whatIs.naturalRhythmsDesc}
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">{t.library.whatIs.humanConnection}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                {t.library.whatIs.humanConnectionDesc}
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">{t.library.whatIs.harmonicBalance}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                {t.library.whatIs.harmonicBalanceDesc}
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">{t.library.whatIs.spiritualAwakening}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                {t.library.whatIs.spiritualAwakeningDesc}
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">{t.library.whatIs.meditativeStates}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                {t.library.whatIs.meditativeStatesDesc}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Frecuencias cerebrales */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>{t.library.brainwaves.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">{t.library.brainwaves.intro}</p>

          <div className="space-y-3 mt-4">
            <div>
              <strong className="text-card-foreground">{t.library.brainwaves.delta}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">{t.library.brainwaves.deltaDesc}</p>
            </div>

            <div>
              <strong className="text-card-foreground">{t.library.brainwaves.theta}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">{t.library.brainwaves.thetaDesc}</p>
            </div>

            <div>
              <strong className="text-card-foreground">{t.library.brainwaves.alpha}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">{t.library.brainwaves.alphaDesc}</p>
            </div>

            <div>
              <strong className="text-card-foreground">{t.library.brainwaves.beta}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">{t.library.brainwaves.betaDesc}</p>
            </div>

            <div>
              <strong className="text-card-foreground">{t.library.brainwaves.gamma}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">{t.library.brainwaves.gammaDesc}</p>
            </div>
          </div>

          <div className="mt-6 bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-card-foreground leading-relaxed font-semibold mb-3">
              {t.library.brainwaves.overlay}
            </p>
            <ul className="space-y-2 text-card-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>7.8 Hz</strong> {t.library.brainwaves.freq78}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>14 Hz</strong> {t.library.brainwaves.freq14}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>20 Hz</strong> {t.library.brainwaves.freq20}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>25 Hz</strong> {t.library.brainwaves.freq25}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>33 Hz+</strong> {t.library.brainwaves.freq33}</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Por qué se habla de sus efectos */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>{t.library.effects.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-card-foreground mb-2">{t.library.effects.environmentalEffects}</h4>
            <p className="text-card-foreground leading-relaxed">{t.library.effects.environmentalEffectsDesc}</p>
          </div>

          <div>
            <h4 className="font-semibold text-card-foreground mb-2">{t.library.effects.sgmaActivity}</h4>
            <p className="text-card-foreground leading-relaxed">{t.library.effects.sgmaDesc1}</p>
            <p className="text-card-foreground leading-relaxed mt-2">{t.library.effects.sgmaDesc2}</p>
            <p className="text-card-foreground leading-relaxed mt-2">{t.library.effects.sgmaDesc3}</p>
            <p className="text-card-foreground leading-relaxed mt-2">{t.library.effects.sgmaDesc4}</p>
            <p className="text-card-foreground leading-relaxed mt-2">{t.library.effects.sgmaDesc5}</p>
          </div>
        </CardContent>
      </Card>

      {/* Cómo leemos estas gráficas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>{t.library.graphs.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3 text-card-foreground">
            <li>
              <strong>{t.library.graphs.xAxis}</strong> {t.library.graphs.xAxisDesc}
            </li>
            <li>
              <strong>{t.library.graphs.yAxis}</strong> {t.library.graphs.yAxisDesc}
            </li>
            <li>
              <strong>{t.library.graphs.date}</strong> {t.library.graphs.dateDesc}
            </li>
            <li>
              <strong>{t.library.graphs.hour}</strong> {t.library.graphs.hourDesc}
            </li>
            <li>
              <strong>{t.library.graphs.color}</strong> {t.library.graphs.colorDesc}
            </li>
          </ul>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">{t.library.graphs.exampleVisual}</p>
            <img
              src={schumannGraphExample}
              alt="Schumann Resonance graph example"
              className="w-full rounded-lg border border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estaciones de monitoreo */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>{t.library.stations.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-card-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Rhode Island</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong>Tomsk University Rusia</strong> {t.library.stations.tomskNote}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>MIT</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Italy</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Cultura popular */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <CardTitle>{t.library.popCulture.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">{t.library.popCulture.intro}</p>

          <div className="space-y-3 mt-4">
            <div>
              <strong className="text-card-foreground">{t.library.popCulture.newAge}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">{t.library.popCulture.newAgeDesc}</p>
            </div>

            <div>
              <strong className="text-card-foreground">{t.library.popCulture.altMedicine}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">{t.library.popCulture.altMedicineDesc}</p>
            </div>

            <div>
              <strong className="text-card-foreground">{t.library.popCulture.musicArt}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">{t.library.popCulture.musicArtDesc}</p>
            </div>

            <div>
              <strong className="text-card-foreground">{t.library.popCulture.filmTv}</strong>
              <p className="text-card-foreground leading-relaxed mt-1">{t.library.popCulture.filmTvDesc}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limitaciones */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>{t.library.limitations.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">{t.library.limitations.intro}</p>

          <ul className="space-y-2 text-card-foreground list-disc list-inside">
            <li>{t.library.limitations.point1}</li>
            <li>{t.library.limitations.point2}</li>
            <li>{t.library.limitations.point3}</li>
            <li>{t.library.limitations.point4}</li>
          </ul>

          <p className="text-card-foreground leading-relaxed italic mt-4">
            {t.library.limitations.finalNote}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
