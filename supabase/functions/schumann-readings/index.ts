import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase config');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('Reading from cache...');

    // Get latest reading (most recent hourly)
    const { data: latestRows, error: latestError } = await supabase
      .from('schumann_readings_cache')
      .select('*')
      .order('date', { ascending: false })
      .limit(1);

    if (latestError) throw latestError;

    const latestRow = latestRows?.[0] || null;
    const latestReading = latestRow ? {
      id: latestRow.id,
      date: latestRow.date,
      nivelActividad: latestRow.nivel_actividad,
      urlImagen: latestRow.url_imagen || '',
      descripcionTecnica: latestRow.descripcion_tecnica || '',
      sensacionesFisicas: latestRow.sensaciones_fisicas || '',
      sensacionesEmocionales: latestRow.sensaciones_emocionales || '',
      recomendaciones: latestRow.recomendaciones || '',
      textoX: latestRow.texto_x || '',
    } : null;

    // Get today's date to exclude from daily readings
    const todayDate = latestRow ? latestRow.date.split('T')[0] : '';

    // Get daily aggregations excluding today
    const { data: dailyRows, error: dailyError } = await supabase
      .from('schumann_daily_cache')
      .select('*')
      .order('date_key', { ascending: false });

    if (dailyError) throw dailyError;

    const dailyReadings = (dailyRows || [])
      .filter(row => row.date_key !== todayDate)
      .map(row => ({
        id: `daily-${row.date_key}`,
        date: row.date_key,
        nivelActividad: row.nivel_actividad,
        urlImagen: row.url_imagen || '',
        descripcionTecnica: row.descripcion_tecnica || '',
        sensacionesFisicas: row.sensaciones_fisicas || '',
        sensacionesEmocionales: row.sensaciones_emocionales || '',
        recomendaciones: row.recomendaciones || '',
        textoX: row.texto_x || '',
      }));

    console.log(`Returning latest reading + ${dailyReadings.length} daily readings from cache`);

    return new Response(
      JSON.stringify({ latestReading, dailyReadings }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
