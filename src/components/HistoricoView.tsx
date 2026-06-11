import { useState, useMemo, useEffect } from "react";
import { SchumannReading } from "@/types/schumann";
import { BadgeNivelActividad } from "./BadgeNivelActividad";
import { Card, CardContent } from "@/components/ui/card";
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

const descriptionCache: { [key: string]: string } = {};

export const HistoricoView = ({ readings }: HistoricoViewProps) => {
  const [selectedReading, setSelectedReading] = useState<SchumannReading | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [translatedDescriptions, setTranslatedDescriptions] = useState<{ [id: string]: string }>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const { language, t } = useLanguage();
  const dateLocale = language === "es" ? es : enUS;

  const ITEMS_PER_PAGE = 10;

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const filteredReadings = useMemo(() => {
    if (!selectedDate) return readings;
    return readings.filter((reading) => isSameDay(parseISO(reading.date), selectedDate));
  }, [readings, selectedDate]);

  const totalPages = Math.ceil(filteredReadings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReadings = useMemo(
    () => filteredReadings.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [filteredReadings, startIndex]
  );

  useEffect(() => {
    if (language !== "en" || paginatedReadings.length === 0) {
      setTranslatedDescriptions((prev) => (Object.keys(prev).length ? {} : prev));
      return;
    }

    const translateDescriptions = async () => {
      const textsToTranslate: { id: string; text: string }[] = [];
      const cachedResults: { [id: string]: string } = {};

      paginatedReadings.forEach((reading) => {
        const truncated = truncateText(reading.descripcionTecnica, 100);
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
          body: { texts: textsToTranslate.map((t) => t.text), targetLanguage: "English" },
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

  const getDescription = (reading: SchumannReading) => {
    if (language === "en" && translatedDescriptions[reading.id]) {
      return translatedDescriptions[reading.id];
    }
    return truncateText(reading.descripcionTecnica, 100);
  };

  return (
    <>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-light text-foreground">{t.history.title}</h2>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn("text-sm", !selectedDate && "text-muted-foreground")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "d MMM yyyy", { locale: dateLocale }) : t.history.searchByDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus className="p-3 pointer-events-auto" locale={dateLocale} />
              </PopoverContent>
            </Popover>
            {selectedDate && (
              <Button variant="ghost" size="icon" onClick={() => { setSelectedDate(undefined); setCurrentPage(1); }} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {selectedDate
            ? `${t.history.showingReadingsFor} ${format(selectedDate, language === "es" ? "d 'de' MMMM 'de' yyyy" : "MMMM d, yyyy", { locale: dateLocale })}`
            : t.history.showingAllReadings}
        </p>

        {filteredReadings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">{t.states.noHistoricalReadings}</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-1">
                {paginatedReadings.map((reading) => (
                  <button
                    key={reading.id}
                    onClick={() => setSelectedReading(reading)}
                    className="relative w-full flex items-start gap-4 pl-10 pr-3 py-4 rounded-xl text-left transition-all hover:bg-card/80 group"
                  >
                    {/* Dot on timeline */}
                    <div className="absolute left-[11px] top-5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-display font-medium text-foreground">
                          {format(new Date(reading.date), "d MMM yyyy", { locale: dateLocale })}
                        </span>
                        <BadgeNivelActividad nivel={reading.nivelActividad} />
                      </div>
                      {isTranslating && language === "en" ? (
                        <Skeleton className="h-4 w-3/4" />
                      ) : (
                        <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                          {getDescription(reading)}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page} className="cursor-pointer">
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
            <DialogTitle className="font-display">{t.history.readingDetail}</DialogTitle>
          </DialogHeader>
          {selectedReading && <TodayView reading={selectedReading} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
