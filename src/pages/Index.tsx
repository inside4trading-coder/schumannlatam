import { useSchumannReadings } from "@/hooks/useSchumannReadings";
import { TodayView } from "@/components/TodayView";
import { HistoricoView } from "@/components/HistoricoView";
import { BibliotecaView } from "@/components/BibliotecaView";
import { AgradecimientosView } from "@/components/AgradecimientosView";
import { NewsletterSubscribeCompact } from "@/components/NewsletterSubscribeCompact";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import schumannLogo from "@/assets/schumann-logo.png";
import { useLanguage } from "@/i18n/LanguageContext";

const Index = () => {
  const { latestReading, dailyReadings, loading, error } = useSchumannReadings();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={schumannLogo}
                alt="Resonancia Schumann Logo"
                className="h-16 sm:h-24 md:h-28 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
              <div>
                <h1 className="text-3xl font-bold text-foreground">{t.header.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t.header.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NewsletterSubscribeCompact />
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">{t.states.loadingError}</p>
              </div>
            </CardContent>
          </Card>
        ) : !latestReading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">{t.states.noReadings}</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="hoy" className="space-y-6">
            <TabsList className="inline-flex h-auto w-full max-w-2xl mx-auto overflow-x-auto md:grid md:grid-cols-4 md:overflow-x-visible p-1 gap-1">
              <TabsTrigger value="hoy" className="flex-shrink-0 md:flex-shrink px-3 py-2 text-sm whitespace-nowrap">
                {t.nav.today}
              </TabsTrigger>
              <TabsTrigger value="historico" className="flex-shrink-0 md:flex-shrink px-3 py-2 text-sm whitespace-nowrap">
                {t.nav.history}
              </TabsTrigger>
              <TabsTrigger value="biblioteca" className="flex-shrink-0 md:flex-shrink px-3 py-2 text-sm whitespace-nowrap">
                {t.nav.library}
              </TabsTrigger>
              <TabsTrigger value="agradecimientos" className="flex-shrink-0 md:flex-shrink px-3 py-2 text-sm whitespace-nowrap">
                {t.nav.acknowledgements}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hoy" className="space-y-4">
              <TodayView reading={latestReading} />
            </TabsContent>

            <TabsContent value="historico" className="space-y-4">
              <HistoricoView readings={dailyReadings} />
            </TabsContent>

            <TabsContent value="biblioteca" className="space-y-4">
              <BibliotecaView />
            </TabsContent>

            <TabsContent value="agradecimientos" className="space-y-4">
              <AgradecimientosView />
            </TabsContent>
          </Tabs>
        )}

      </main>
    </div>
  );
};

export default Index;
