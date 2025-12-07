import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotionProperty {
  type: string;
  [key: string]: any;
}

interface NotionPage {
  id: string;
  properties: {
    [key: string]: NotionProperty;
  };
}

interface NotionResponse {
  results: NotionPage[];
}

interface ReadingData {
  id: string;
  date: string;
  nivelActividad: string;
  urlImagen: string;
  descripcionTecnica: string;
  sensacionesFisicas: string;
  sensacionesEmocionales: string;
  recomendaciones: string;
  textoX: string;
}

interface ApiResponse {
  latestReading: ReadingData | null;
  dailyReadings: ReadingData[];
}

// Map activity levels to numeric values for averaging
const activityLevelToNumber = (nivel: string): number => {
  const normalized = nivel.toLowerCase().trim();
  if (normalized === 'baja') return 1;
  if (normalized === 'media') return 2;
  if (normalized === 'alta') return 3;
  if (normalized === 'muy alta') return 4;
  return 2; // Default to media
};

// Convert numeric average back to activity level
const numberToActivityLevel = (avg: number): string => {
  if (avg <= 1.5) return 'Baja';
  if (avg <= 2.5) return 'Media';
  if (avg <= 3.5) return 'Alta';
  return 'Muy alta';
};

// Extract just the date part (YYYY-MM-DD) from a datetime string
const extractDateOnly = (dateString: string): string => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notionToken = Deno.env.get('NOTION_TOKEN');
    if (!notionToken) {
      throw new Error('NOTION_TOKEN no configurado');
    }

    console.log('Llamando a la API de Notion...');

    const response = await fetch(
      'https://api.notion.com/v1/databases/2bb88e97a96880c08324c9903ee749f0/query',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          sorts: [
            {
              property: 'Date',
              direction: 'descending',
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de Notion API:', response.status, errorText);
      throw new Error(`Error de Notion API: ${response.status}`);
    }

    const data: NotionResponse = await response.json();
    console.log(`Obtenidas ${data.results.length} lecturas de Notion`);

    // Función auxiliar para extraer texto de rich_text
    const extractText = (richText: any[]): string => {
      if (!richText || !Array.isArray(richText)) return '';
      return richText.map((t: any) => t.plain_text || '').join('');
    };

    // Transform Notion data to readings
    const allReadings: ReadingData[] = data.results.map((page) => {
      const props = page.properties;

      return {
        id: page.id,
        date: props['Date']?.date?.start || '',
        nivelActividad: props['Nivel de actividad']?.select?.name || 'Media',
        urlImagen: props['URL Imagen']?.url || '',
        descripcionTecnica: extractText(props['Descripción tecnica']?.rich_text),
        sensacionesFisicas: extractText(props['Sensaciones fisicas']?.rich_text),
        sensacionesEmocionales: extractText(props['Sensaciones emocionales']?.rich_text),
        recomendaciones: extractText(props['Recomendaciones']?.rich_text),
        textoX: extractText(props['Texto para X']?.rich_text),
      };
    });

    // Get the latest hourly reading (first one since sorted descending)
    const latestReading = allReadings.length > 0 ? allReadings[0] : null;
    console.log(`Lectura más reciente: ${latestReading?.date}`);

    // Group readings by date (YYYY-MM-DD) for daily aggregation
    const readingsByDate: Map<string, ReadingData[]> = new Map();
    
    for (const reading of allReadings) {
      const dateOnly = extractDateOnly(reading.date);
      if (!dateOnly) continue;
      
      if (!readingsByDate.has(dateOnly)) {
        readingsByDate.set(dateOnly, []);
      }
      readingsByDate.get(dateOnly)!.push(reading);
    }

    console.log(`Agrupadas en ${readingsByDate.size} días`);

    // Create daily aggregated readings
    const dailyReadings: ReadingData[] = [];
    
    for (const [dateOnly, dayReadings] of readingsByDate) {
      // Calculate average activity level
      const activitySum = dayReadings.reduce((sum, r) => sum + activityLevelToNumber(r.nivelActividad), 0);
      const avgActivity = activitySum / dayReadings.length;
      const aggregatedActivityLevel = numberToActivityLevel(avgActivity);
      
      // Use the most recent reading of the day for other fields (first one since sorted descending)
      const latestDayReading = dayReadings[0];
      
      // Find reading with best content (prefer ones with image and description)
      const bestReading = dayReadings.find(r => r.urlImagen && r.descripcionTecnica) || latestDayReading;
      
      dailyReadings.push({
        id: `daily-${dateOnly}`,
        date: dateOnly, // Use just the date without time
        nivelActividad: aggregatedActivityLevel,
        urlImagen: bestReading.urlImagen,
        descripcionTecnica: bestReading.descripcionTecnica,
        sensacionesFisicas: bestReading.sensacionesFisicas,
        sensacionesEmocionales: bestReading.sensacionesEmocionales,
        recomendaciones: bestReading.recomendaciones,
        textoX: bestReading.textoX,
      });
    }

    // Sort by date descending
    dailyReadings.sort((a, b) => b.date.localeCompare(a.date));

    // Remove today from daily readings since it's shown in "Hoy" section
    const todayDate = latestReading ? extractDateOnly(latestReading.date) : '';
    const historicDailyReadings = dailyReadings.filter(r => r.date !== todayDate);

    console.log(`Devolviendo lectura actual + ${historicDailyReadings.length} lecturas diarias históricas`);

    const apiResponse: ApiResponse = {
      latestReading,
      dailyReadings: historicDailyReadings,
    };

    return new Response(JSON.stringify(apiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error en edge function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
