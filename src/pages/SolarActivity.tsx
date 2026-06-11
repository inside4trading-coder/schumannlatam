import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Zap, Activity, Globe, Radio, ArrowLeft, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useSeo } from "@/hooks/useSeo";
import { useLanguage } from "@/i18n/LanguageContext";
import schumannLogo from "@/assets/schumann-logo.png";

const SolarActivity = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  useSeo({
    title: isEs
      ? "Actividad Solar y Resonancia Schumann — Tormentas, Índice K y Efectos"
      : "Solar Activity and Schumann Resonance — Storms, K-Index and Effects",
    description: isEs
      ? "Cómo la actividad solar (tormentas geomagnéticas, viento solar, índice K) influye en la Resonancia Schumann y sus posibles efectos sobre la Tierra y las personas."
      : "How solar activity (geomagnetic storms, solar wind, K-index) influences the Schumann Resonance and its potential effects on Earth and people.",
    canonical: "https://schumannlatam.vercel.app/solar-activity",
  });

  const sections = isEs
    ? [
        {
          icon: Sun,
          title: "¿Qué es la actividad solar?",
          body: "La actividad solar comprende los fenómenos energéticos del Sol: manchas solares, fulguraciones (flares), eyecciones de masa coronal (CME) y el viento solar. Sigue un ciclo de aproximadamente 11 años entre mínimos y máximos.",
        },
        {
          icon: Zap,
          title: "Tormentas geomagnéticas",
          body: "Cuando una CME impacta la magnetósfera terrestre, se desencadena una tormenta geomagnética. Estas perturbaciones alteran la ionósfera, generan auroras y modifican la cavidad donde resuena la Resonancia Schumann.",
        },
        {
          icon: Activity,
          title: "Índice K y Kp",
          body: "El índice K mide la actividad geomagnética local en una escala de 0 a 9 cada 3 horas. El Kp es su promedio planetario. Valores ≥5 indican tormenta geomagnética activa.",
        },
        {
          icon: Radio,
          title: "Impacto en la señal Schumann",
          body: "La radiación X y gamma del Sol ioniza la región D de la ionósfera, modificando la amplitud y forma de las frecuencias Schumann. Por eso días de alta actividad solar suelen mostrar lecturas más intensas o irregulares.",
        },
        {
          icon: Globe,
          title: "Efectos en la Tierra y posibles efectos en personas",
          body: "Las tormentas pueden afectar satélites, GPS, redes eléctricas y comunicaciones HF. Muchas personas reportan, de forma no clínicamente comprobada, cambios en sueño, ánimo o energía durante eventos solares intensos.",
        },
      ]
    : [
        {
          icon: Sun,
          title: "What is solar activity?",
          body: "Solar activity covers the Sun's energetic phenomena: sunspots, flares, coronal mass ejections (CMEs) and the solar wind. It follows an ~11-year cycle between solar minima and maxima.",
        },
        {
          icon: Zap,
          title: "Geomagnetic storms",
          body: "When a CME hits Earth's magnetosphere, a geomagnetic storm is triggered. These disturbances alter the ionosphere, generate auroras and modify the cavity where the Schumann Resonance vibrates.",
        },
        {
          icon: Activity,
          title: "K and Kp index",
          body: "The K-index measures local geomagnetic activity on a 0–9 scale every 3 hours. The Kp is its planetary average. Values ≥5 indicate an active geomagnetic storm.",
        },
        {
          icon: Radio,
          title: "Impact on the Schumann signal",
          body: "Solar X-ray and gamma radiation ionizes the D region of the ionosphere, modifying the amplitude and shape of the Schumann frequencies. That is why days of high solar activity often show more intense or irregular readings.",
        },
        {
          icon: Globe,
          title: "Effects on Earth and possible effects on people",
          body: "Storms can affect satellites, GPS, power grids and HF communications. Many people report — not clinically proven — changes in sleep, mood or energy during intense solar events.",
        },
      ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/" aria-label={isEs ? "Volver al inicio" : "Back to home"}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{isEs ? "Inicio" : "Home"}</span>
            </Link>
          </Button>
          <div className="flex items-center gap-1.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <header className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-4 py-10 md:py-16 flex flex-col items-center text-center">
          <img
            src={schumannLogo}
            alt="Resonancia Schumann"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain mb-4"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light tracking-tight text-foreground max-w-3xl">
            {isEs ? "Actividad Solar y Resonancia Schumann" : "Solar Activity and Schumann Resonance"}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
            {isEs
              ? "Cómo el Sol modula el latido electromagnético de la Tierra: tormentas geomagnéticas, índice K y sus posibles efectos."
              : "How the Sun modulates Earth's electromagnetic heartbeat: geomagnetic storms, K-index and its possible effects."}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 flex-1">
        <div className="max-w-5xl mx-auto grid gap-4 md:gap-6 md:grid-cols-2">
          {sections.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="glass glass-dark">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center gradient-cosmic-subtle">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg font-display">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-card-foreground leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-5xl mx-auto mt-6 md:mt-8 overflow-hidden border-0 shadow-lg gradient-cosmic-subtle">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-display">
              {isEs ? "Fuentes oficiales en tiempo real" : "Official real-time sources"}
            </CardTitle>
            <CardDescription>
              {isEs
                ? "Consulta directa de organismos que monitorean el clima espacial."
                : "Direct sources from organizations monitoring space weather."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { name: "NOAA Space Weather Prediction Center", url: "https://www.swpc.noaa.gov/" },
              { name: "NASA — Solar Dynamics Observatory", url: "https://sdo.gsfc.nasa.gov/" },
              { name: "Tomsk State University (Schumann)", url: "http://sosrff.tsu.ru/" },
              { name: "SpaceWeatherLive", url: "https://www.spaceweatherlive.com/" },
            ].map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-card/60 px-4 py-3 text-sm hover:border-primary hover:text-primary transition-colors"
              >
                <span className="truncate">{s.name}</span>
                <ExternalLink className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              </a>
            ))}
          </CardContent>
        </Card>

        <p className="max-w-3xl mx-auto mt-8 text-xs text-muted-foreground text-center italic">
          {isEs
            ? "Esta página es orientativa y educativa. No sustituye asesoramiento médico ni científico profesional."
            : "This page is indicative and educational. It does not replace professional medical or scientific advice."}
        </p>

        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link to="/">{isEs ? "Ver lectura del día" : "See today's reading"}</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SolarActivity;
