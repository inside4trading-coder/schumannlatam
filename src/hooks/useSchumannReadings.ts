import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SchumannReading } from "@/types/schumann";

interface ApiResponse {
  latestReading: SchumannReading | null;
  dailyReadings: SchumannReading[];
}

export const useSchumannReadings = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["schumann-readings"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<ApiResponse>(
        "schumann-readings"
      );

      if (error) {
        console.error("Error al obtener lecturas:", error);
        throw error;
      }

      return data || { latestReading: null, dailyReadings: [] };
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    latestReading: data?.latestReading || null,
    dailyReadings: data?.dailyReadings || [],
    loading: isLoading,
    error: isError,
  };
};
