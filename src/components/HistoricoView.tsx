import { useState } from "react";
import { SchumannReading } from "@/types/schumann";
import { BadgeNivelActividad } from "./BadgeNivelActividad";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TodayView } from "./TodayView";
import { Calendar } from "lucide-react";

interface HistoricoViewProps {
  readings: SchumannReading[];
}

export const HistoricoView = ({ readings }: HistoricoViewProps) => {
  const [selectedReading, setSelectedReading] = useState<SchumannReading | null>(null);

  const truncateText = (text: string, maxLength: number = 140) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <div className="space-y-4 animate-in fade-in-50 duration-500">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Histórico de Lecturas</h2>
        </div>

        {readings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No hay lecturas históricas disponibles.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {readings.map((reading) => {
              const formattedDate = format(new Date(reading.date), "d MMM yyyy", {
                locale: es,
              });

              return (
                <Card
                  key={reading.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 hover:-translate-y-1"
                  onClick={() => setSelectedReading(reading)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{formattedDate}</CardTitle>
                      <BadgeNivelActividad nivel={reading.nivelActividad} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {truncateText(reading.descripcionTecnica, 160)}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      <Dialog open={!!selectedReading} onOpenChange={() => setSelectedReading(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Lectura</DialogTitle>
          </DialogHeader>
          {selectedReading && <TodayView reading={selectedReading} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
