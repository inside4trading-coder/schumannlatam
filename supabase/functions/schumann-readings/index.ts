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
    console.log(`Obtenidas ${data.results.length} lecturas`);

    // Transformar los datos de Notion al formato esperado
    const readings = data.results.map((page) => {
      const props = page.properties;

      // Función auxiliar para extraer texto de rich_text
      const extractText = (richText: any[]): string => {
        if (!richText || !Array.isArray(richText)) return '';
        return richText.map((t: any) => t.plain_text || '').join('');
      };

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

    return new Response(JSON.stringify(readings), {
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
