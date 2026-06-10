import { useState } from "react";
import { useSchumannReadings } from "@/hooks/useSchumannReadings";
import { TodayView } from "@/components/TodayView";
import { HistoricoView } from "@/components/HistoricoView";
import { BibliotecaView } from "@/components/BibliotecaView";
import { AgradecimientosView } from "@/components/AgradecimientosView";
import { NewsletterSubscribeCompact } from "@/components/NewsletterSubscribeCompact";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Zap, Clock, BookOpen, Heart } from "lucide-react";
import schumannLogo from "@/assets/schumann-logo.png";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

type View = "today" | "history" | "library" | "acknowledgements";

const Index = () => {
  const { latestReading, dailyReadings, loading, error } = useSchumannReadings();
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<View>("today");

  const navItems: { id: View; label: string; icon: React.ElementType }[] = [
    { id: "today", label: t.nav.today, icon: Zap },
    { id: "history", label: t.nav.history, icon: Clock },
    { id: "library", label: t.nav.library, icon: BookOpen },
    { id: "acknowledgements", label: t.nav.acknowledgements, icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar - Controls */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-end gap-1.5">
          <NewsletterSubscribeCompact />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Hero Header */}
      <header className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center text-center">
          <img
            src={schumannLogo}
            alt="Resonancia Schumann Logo"
            className="h-20 sm:h-28 md:h-32 w-auto object-contain animate-pulse-glow mb-4"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light tracking-tight text-foreground">
            {t.header.title} <span className="text-muted-foreground font-light">— {t.header.subtitle}</span>
          </h1>
        </div>
      </header>
        </div>
      </header>

      {/* Desktop Nav */}
      <nav className="hidden md:block sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px",
                  activeView === id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1 pb-24 md:pb-8">
        {loading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <Card className="border-destructive max-w-xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">{t.states.loadingError}</p>
              </div>
            </CardContent>
          </Card>
        ) : !latestReading ? (
          <Card className="max-w-xl mx-auto">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">{t.states.noReadings}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="animate-in fade-in-50 duration-300">
            {activeView === "today" && <TodayView reading={latestReading} />}
            {activeView === "history" && <HistoricoView readings={dailyReadings} />}
            {activeView === "library" && <BibliotecaView />}
            {activeView === "acknowledgements" && <AgradecimientosView />}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/90 backdrop-blur-xl safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all text-xs",
                activeView === id
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", activeView === id && "drop-shadow-sm")} />
              <span className="font-medium truncate max-w-[4.5rem]">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Index;
