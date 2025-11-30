import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SchumannReading } from "@/types/schumann";

export const useSchumannReadings = () => {
  const { data: readings = [], isLoading, isError } = useQuery({
    queryKey: ["schumann-readings"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<SchumannReading[]>(
        "schumann-readings"
      );

      if (error) {
        console.error("Error al obtener lecturas:", error);
        throw error;
      }

      return data || [];
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    readings,
    loading: isLoading,
    error: isError,
  };
};
