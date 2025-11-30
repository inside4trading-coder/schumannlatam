import { useSchumannReadings } from "@/hooks/useSchumannReadings";
import { TodayView } from "@/components/TodayView";
import { HistoricoView } from "@/components/HistoricoView";
import { BibliotecaView } from "@/components/BibliotecaView";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import schumannLogo from "@/assets/schumann-logo.png";

const Index = () => {
  const { readings, loading, error } = useSchumannReadings();

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
                className="h-28 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Resonancia Schumann</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Lecturas diarias orientativas (no médicas)
                </p>
              </div>
            </div>
            <ThemeToggle />
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
                <p className="font-medium">
                  No se pudieron cargar las lecturas. Intenta de nuevo más tarde.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : readings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                Todavía no hay lecturas registradas. Vuelve más tarde.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="hoy" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="hoy">Hoy</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="biblioteca">Biblioteca</TabsTrigger>
            </TabsList>

            <TabsContent value="hoy" className="space-y-4">
              <TodayView reading={readings[0]} />
            </TabsContent>

            <TabsContent value="historico" className="space-y-4">
              <HistoricoView readings={readings.slice(1)} />
            </TabsContent>

            <TabsContent value="biblioteca" className="space-y-4">
              <BibliotecaView />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;
