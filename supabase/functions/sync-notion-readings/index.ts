import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotionPage {
  id: string;
  properties: { [key: string]: any };
}

const extractText = (richText: any[]): string => {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map((t: any) => t.plain_text || '').join('');
};

const activityLevelToNumber = (nivel: string): number => {
  const normalized = nivel.toLowerCase().trim();
  if (normalized === 'baja') return 1;
  if (normalized === 'media') return 2;
  if (normalized === 'alta') return 3;
  if (normalized === 'muy alta') return 4;
  return 2;
};

const numberToActivityLevel = (avg: number): string => {
  if (avg <= 1.5) return 'Baja';
  if (avg <= 2.5) return 'Media';
  if (avg <= 3.5) return 'Alta';
  return 'Muy alta';
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notionToken = Deno.env.get('NOTION_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!notionToken || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Syncing readings from Notion...');

    // Fetch all pages from Notion with pagination
    const allPages: NotionPage[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    while (hasMore) {
      const requestBody: any = {
        sorts: [{ property: 'Date', direction: 'descending' }],
        page_size: 100,
      };
      if (startCursor) requestBody.start_cursor = startCursor;

      const response = await fetch(
        'https://api.notion.com/v1/databases/2bb88e97a96880c08324c9903ee749f0/query',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${notionToken}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Notion API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      allPages.push(...data.results);
      hasMore = data.has_more;
      startCursor = data.next_cursor;
      console.log(`Fetched ${allPages.length} readings so far...`);
    }

    console.log(`Total readings from Notion: ${allPages.length}`);

    // Transform and upsert all hourly readings into cache
    const readings = allPages.map((page: NotionPage) => {
      const props = page.properties;
      return {
        id: page.id,
        date: props['Date']?.date?.start || new Date().toISOString(),
        nivel_actividad: props['Nivel de actividad']?.select?.name || 'Media',
        url_imagen: props['URL Imagen']?.url || null,
        descripcion_tecnica: extractText(props['Descripción tecnica']?.rich_text),
        sensaciones_fisicas: extractText(props['Sensaciones fisicas']?.rich_text),
        sensaciones_emocionales: extractText(props['Sensaciones emocionales']?.rich_text),
        recomendaciones: extractText(props['Recomendaciones']?.rich_text),
        texto_x: extractText(props['Texto para X']?.rich_text),
        synced_at: new Date().toISOString(),
      };
    });

    // Upsert in batches of 500
    for (let i = 0; i < readings.length; i += 500) {
      const batch = readings.slice(i, i + 500);
      const { error } = await supabase
        .from('schumann_readings_cache')
        .upsert(batch, { onConflict: 'id' });
      if (error) {
        console.error(`Batch upsert error at ${i}:`, error);
        throw error;
      }
      console.log(`Upserted batch ${i}-${i + batch.length}`);
    }

    // Now compute daily aggregations
    const readingsByDate = new Map<string, typeof readings>();
    for (const r of readings) {
      const dateKey = r.date.split('T')[0];
      if (!dateKey) continue;
      if (!readingsByDate.has(dateKey)) readingsByDate.set(dateKey, []);
      readingsByDate.get(dateKey)!.push(r);
    }

    const dailyRecords = Array.from(readingsByDate.entries()).map(([dateKey, dayReadings]) => {
      const activitySum = dayReadings.reduce((sum, r) => sum + activityLevelToNumber(r.nivel_actividad), 0);
      const avgActivity = activitySum / dayReadings.length;
      const best = dayReadings.find(r => r.url_imagen && r.descripcion_tecnica) || dayReadings[0];

      return {
        date_key: dateKey,
        nivel_actividad: numberToActivityLevel(avgActivity),
        url_imagen: best.url_imagen,
        descripcion_tecnica: best.descripcion_tecnica,
        sensaciones_fisicas: best.sensaciones_fisicas,
        sensaciones_emocionales: best.sensaciones_emocionales,
        recomendaciones: best.recomendaciones,
        texto_x: best.texto_x,
        reading_count: dayReadings.length,
        synced_at: new Date().toISOString(),
      };
    });

    // Upsert daily aggregations
    const { error: dailyError } = await supabase
      .from('schumann_daily_cache')
      .upsert(dailyRecords, { onConflict: 'date_key' });

    if (dailyError) {
      console.error('Daily upsert error:', dailyError);
      throw dailyError;
    }

    console.log(`Sync complete: ${readings.length} hourly readings, ${dailyRecords.length} daily aggregations`);

    return new Response(
      JSON.stringify({
        success: true,
        hourlyReadings: readings.length,
        dailyAggregations: dailyRecords.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sync error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
