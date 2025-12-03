import { useState, useMemo, useEffect } from "react";
import { SchumannReading } from "@/types/schumann";
import { BadgeNivelActividad } from "./BadgeNivelActividad";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isSameDay, parseISO } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { TodayView } from "./TodayView";
import { Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface HistoricoViewProps {
  readings: SchumannReading[];
}

// Translation cache
const descriptionCache: { [key: string]: string } = {};

export const HistoricoView = ({ readings }: HistoricoViewProps) => {
  const [selectedReading, setSelectedReading] = useState<SchumannReading | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [translatedDescriptions, setTranslatedDescriptions] = useState<{ [id: string]: string }>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const { language, t } = useLanguage();
  const dateLocale = language === "es" ? es : enUS;
  
  const ITEMS_PER_PAGE = 9;

  const truncateText = (text: string, maxLength: number = 140) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const filteredReadings = useMemo(() => {
    if (!selectedDate) return readings;
    
    return readings.filter((reading) => {
      const readingDate = parseISO(reading.date);
      return isSameDay(readingDate, selectedDate);
    });
  }, [readings, selectedDate]);

  const totalPages = Math.ceil(filteredReadings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReadings = filteredReadings.slice(startIndex, endIndex);

  // Translate descriptions when language is English
  useEffect(() => {
    if (language !== "en" || paginatedReadings.length === 0) {
      setTranslatedDescriptions({});
      return;
    }

    const translateDescriptions = async () => {
      const textsToTranslate: { id: string; text: string }[] = [];
      const cachedResults: { [id: string]: string } = {};

      paginatedReadings.forEach((reading) => {
        const truncated = truncateText(reading.descripcionTecnica, 160);
        const cacheKey = `en:${truncated}`;
        if (descriptionCache[cacheKey]) {
          cachedResults[reading.id] = descriptionCache[cacheKey];
        } else if (truncated) {
          textsToTranslate.push({ id: reading.id, text: truncated });
        }
      });

      if (textsToTranslate.length === 0) {
        setTranslatedDescriptions(cachedResults);
        return;
      }

      setIsTranslating(true);

      try {
        const { data, error } = await supabase.functions.invoke("translate", {
          body: {
            texts: textsToTranslate.map((t) => t.text),
            targetLanguage: "English",
          },
        });

        if (!error && data?.translations) {
          textsToTranslate.forEach((item, index) => {
            const cacheKey = `en:${item.text}`;
            descriptionCache[cacheKey] = data.translations[index];
            cachedResults[item.id] = data.translations[index];
          });
        }

        setTranslatedDescriptions(cachedResults);
      } catch (error) {
        console.error("Translation error:", error);
      } finally {
        setIsTranslating(false);
      }
    };

    translateDescriptions();
  }, [language, paginatedReadings]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const clearDateFilter = () => {
    setSelectedDate(undefined);
    setCurrentPage(1);
  };

  const getDescription = (reading: SchumannReading) => {
    if (language === "en" && translatedDescriptions[reading.id]) {
      return translatedDescriptions[reading.id];
    }
    return truncateText(reading.descripcionTecnica, 160);
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">{t.history.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "d MMM yyyy", { locale: dateLocale }) : t.history.searchByDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  locale={dateLocale}
                />
              </PopoverContent>
            </Popover>
            {selectedDate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearDateFilter}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          {selectedDate ? (
            <span>
              {t.history.showingReadingsFor} {format(selectedDate, language === "es" ? "d 'de' MMMM 'de' yyyy" : "MMMM d, yyyy", { locale: dateLocale })}
            </span>
          ) : (
            <span>{t.history.showingAllReadings}</span>
          )}
        </div>

        {filteredReadings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                {t.states.noHistoricalReadings}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedReadings.map((reading) => {
                const formattedDate = format(new Date(reading.date), "d MMM yyyy, HH:mm", {
                  locale: dateLocale,
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
                      {isTranslating && language === "en" ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ) : (
                        <CardDescription className="text-sm leading-relaxed">
                          {getDescription(reading)}
                        </CardDescription>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

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

      <Dialog open={!!selectedReading} onOpenChange={() => setSelectedReading(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.history.readingDetail}</DialogTitle>
          </DialogHeader>
          {selectedReading && <TodayView reading={selectedReading} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
