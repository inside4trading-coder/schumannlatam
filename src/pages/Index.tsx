import { lazy, Suspense, useEffect, useState } from "react";
import { useSchumannReadings } from "@/hooks/useSchumannReadings";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { SpectrogramCard } from "@/components/dashboard/SpectrogramCard";
import { DailyReport } from "@/components/dashboard/DailyReport";
import { FaqSection } from "@/components/FaqSection";

// Below-the-fold y dependencias pesadas (recharts) en chunks separados
const ActivityChart = lazy(() =>
  import("@/components/dashboard/ActivityChart").then((m) => ({ default: m.ActivityChart }))
);
const HistoricoView = lazy(() =>
  import("@/components/HistoricoView").then((m) => ({ default: m.HistoricoView }))
);
const BibliotecaView = lazy(() =>
  import("@/components/BibliotecaView").then((m) => ({ default: m.BibliotecaView }))
);
const AgradecimientosView = lazy(() =>
  import("@/components/AgradecimientosView").then((m) => ({ default: m.AgradecimientosView }))
);
import { Reveal } from "@/components/Reveal";
import { NewsletterSubscribeCompact } from "@/components/NewsletterSubscribeCompact";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Zap, Clock, BookOpen, Heart, Waves } from "lucide-react";
import schumannLogo from "@/assets/schumann-logo.png";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const SECTION_IDS = ["estado", "historico", "aprende", "agradecimientos"] as const;
type SectionId = (typeof SECTION_IDS)[number];

/** Tracks which top-level section is currently in view to highlight the nav. */
const useActiveSection = (): SectionId => {
  const [active, setActive] = useState<SectionId>("estado");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
};

const Index = () => {
  const { latestReading, dailyReadings, loading, error } = useSchumannReadings();
  const { t } = useLanguage();
  const activeSection = useActiveSection();

  const navItems: { id: SectionId; label: string; icon: React.ElementType }[] = [
    { id: "estado", label: t.nav.today, icon: Zap },
    { id: "historico", label: t.nav.history, icon: Clock },
    { id: "aprende", label: t.nav.library, icon: BookOpen },
    { id: "agradecimientos", label: t.nav.acknowledgements, icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar: branding compacto + controles */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <a href="#estado" className="flex items-center gap-2.5 min-w-0">
            <img
              src={schumannLogo}
              alt=""
              aria-hidden="true"
              className="h-8 w-8 object-contain flex-shrink-0"
            />
            <div className="min-w-0 leading-tight">
              <h1 className="font-display font-medium text-sm sm:text-base text-foreground truncate">
                {t.header.title}
              </h1>
              <p className="text-[11px] text-muted-foreground truncate hidden sm:block">
                {t.header.subtitle}
              </p>
            </div>
          </a>

          {/* Nav desktop (anclas) */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Principal">
            <a href="/sismos" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 4 18 3-9h4"/></svg>Sismos</a>
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeSection === id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <NewsletterSubscribeCompact />
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-12">
        {loading ? (
          <div className="container mx-auto px-4 py-8 space-y-4 max-w-5xl">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-56 w-full" />
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 py-12">
            <Card className="border-destructive max-w-xl mx-auto">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-medium">{t.states.loadingError}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : !latestReading ? (
          <div className="container mx-auto px-4 py-12">
            <Card className="max-w-xl mx-auto">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">{t.states.noReadings}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* 1. Estado actual */}
            <DashboardHero reading={latestReading} />

            {/* 2. GrÃ¡ficos protagonistas */}
            <section
              id="graficos"
              aria-label={t.dashboard.activityChartTitle}
              className="scroll-mt-16 container mx-auto px-4 py-4 space-y-4 md:space-y-6"
            >
              <Reveal>
                <SpectrogramCard reading={latestReading} />
              </Reveal>
              <Reveal delayS={0.1}>
                <Suspense fallback={<Skeleton className="h-72 w-full rounded-xl" />}>
                  <ActivityChart latestReading={latestReading} dailyReadings={dailyReadings} />
                </Suspense>
              </Reveal>
            </section>

            {/* 3. Informe del dÃ­a */}
            <div className="container mx-auto px-4 py-8 max-w-5xl">
              <Reveal>
                <DailyReport reading={latestReading} />
              </Reveal>
            </div>

            {/* 4. HistÃ³rico */}
            <section
              id="historico"
              aria-label={t.dashboard.historyTitle}
              className="scroll-mt-16 border-t border-border/50 bg-card/30"
            >
              <div className="container mx-auto px-4 py-10">
                <Suspense fallback={<Skeleton className="h-96 w-full max-w-3xl mx-auto rounded-xl" />}>
                  <HistoricoView readings={dailyReadings} />
                </Suspense>
              </div>
            </section>

            {/* 5. Capa educativa */}
            <section
              id="aprende"
              aria-label={t.dashboard.learnTitle}
              className="scroll-mt-16 border-t border-border/50"
            >
              <div className="container mx-auto px-4 py-10 space-y-10">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-2xl sm:text-3xl font-display font-light text-foreground">
                    {t.dashboard.learnTitle}
                  </h2>
                  <p className="mt-2 text-muted-foreground">{t.dashboard.learnSubtitle}</p>
                </div>
                <Suspense fallback={<Skeleton className="h-96 w-full max-w-3xl mx-auto rounded-xl" />}>
                  <BibliotecaView />
                </Suspense>
                <div className="max-w-3xl mx-auto">
                  <FaqSection />
                </div>
              </div>
            </section>

            {/* 6. Agradecimientos */}
            <section
              id="agradecimientos"
              aria-label={t.nav.acknowledgements}
              className="scroll-mt-16 border-t border-border/50 bg-card/30"
            >
              <div className="container mx-auto px-4 py-10">
                <Suspense fallback={<Skeleton className="h-72 w-full max-w-3xl mx-auto rounded-xl" />}>
                  <AgradecimientosView />
                </Suspense>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Nav mÃ³vil inferior (anclas) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/90 backdrop-blur-xl safe-area-inset-bottom"
        aria-label="Principal"
      >
        <div className="grid grid-cols-4 px-1 py-1.5">
          {navItems.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={cn(
                "flex flex-col items-center justify-start gap-0.5 px-1 py-1.5 rounded-lg transition-colors",
                activeSection === id ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", activeSection === id && "drop-shadow-sm")} />
              <span className="text-[10px] font-medium leading-tight text-center break-words">
                {label}
              </span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Index;




