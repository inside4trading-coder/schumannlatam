import { useState, useMemo } from "react";
import { SchumannReading } from "@/types/schumann";
import { BadgeNivelActividad } from "./BadgeNivelActividad";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { format, isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { TodayView } from "./TodayView";
import { Calendar } from "lucide-react";

interface HistoricoViewProps {
  readings: SchumannReading[];
}

export const HistoricoView = ({ readings }: HistoricoViewProps) => {
  const [selectedReading, setSelectedReading] = useState<SchumannReading | null>(null);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 9; // 3 columnas x 3 filas

  const truncateText = (text: string, maxLength: number = 140) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Filtrar lecturas por fecha
  const filteredReadings = useMemo(() => {
    return readings.filter((reading) => {
      const readingDate = parseISO(reading.date);
      
      switch (dateFilter) {
        case "today":
          return isToday(readingDate);
        case "week":
          return isThisWeek(readingDate, { locale: es });
        case "month":
          return isThisMonth(readingDate);
        default:
          return true;
      }
    });
  }, [readings, dateFilter]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredReadings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReadings = filteredReadings.slice(startIndex, endIndex);

  // Reset página cuando cambia el filtro
  const handleFilterChange = (value: string) => {
    setDateFilter(value as "all" | "today" | "week" | "month");
    setCurrentPage(1);
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Histórico de Lecturas</h2>
        </div>

        {/* Filtros de fecha */}
        <Tabs value={dateFilter} onValueChange={handleFilterChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todo</TabsTrigger>
            <TabsTrigger value="today">Hoy</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mes</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredReadings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No hay lecturas históricas disponibles.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedReadings.map((reading) => {
                const formattedDate = format(new Date(reading.date), "d MMM yyyy, HH:mm", {
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

            {/* Paginación */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
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
