import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get the parent page ID from the request body
    const { parentPageId } = await req.json();
    if (!parentPageId) {
      throw new Error('Se requiere parentPageId - el ID de la página donde crear las bases de datos');
    }

    const headers = {
      'Authorization': `Bearer ${notionToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    };

    // Create Newsletter_Suscriptores database
    console.log('Creando base de datos Newsletter_Suscriptores...');
    const subscribersResponse = await fetch('https://api.notion.com/v1/databases', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        parent: { type: 'page_id', page_id: parentPageId },
        title: [{ type: 'text', text: { content: 'Newsletter_Suscriptores' } }],
        properties: {
          Email: { title: {} },
          Nombre: { rich_text: {} },
          Fecha_Suscripcion: { date: {} },
          Activo: { checkbox: {} },
          Frecuencia: {
            select: {
              options: [
                { name: 'diario', color: 'blue' },
                { name: 'semanal', color: 'green' },
              ],
            },
          },
        },
      }),
    });

    if (!subscribersResponse.ok) {
      const error = await subscribersResponse.json();
      console.error('Error creando Suscriptores:', error);
      throw new Error(`Error creando Newsletter_Suscriptores: ${JSON.stringify(error)}`);
    }

    const subscribersDb = await subscribersResponse.json();
    console.log('Newsletter_Suscriptores creada:', subscribersDb.id);

    // Create Newsletter_Interpretaciones database
    console.log('Creando base de datos Newsletter_Interpretaciones...');
    const interpretationsResponse = await fetch('https://api.notion.com/v1/databases', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        parent: { type: 'page_id', page_id: parentPageId },
        title: [{ type: 'text', text: { content: 'Newsletter_Interpretaciones' } }],
        properties: {
          Rango_Frecuencia: { title: {} },
          Interpretacion: { rich_text: {} },
          Recomendaciones: { rich_text: {} },
          Categoria: {
            select: {
              options: [
                { name: 'calma', color: 'green' },
                { name: 'activacion', color: 'yellow' },
                { name: 'pico', color: 'red' },
              ],
            },
          },
        },
      }),
    });

    if (!interpretationsResponse.ok) {
      const error = await interpretationsResponse.json();
      console.error('Error creando Interpretaciones:', error);
      throw new Error(`Error creando Newsletter_Interpretaciones: ${JSON.stringify(error)}`);
    }

    const interpretationsDb = await interpretationsResponse.json();
    console.log('Newsletter_Interpretaciones creada:', interpretationsDb.id);

    // Add sample interpretations
    console.log('Agregando interpretaciones de ejemplo...');
    const sampleInterpretations = [
      { rango: '7.0-8.0 Hz', interpretacion: 'Frecuencia base normal. Condiciones óptimas para meditación y relajación.', recomendaciones: 'Buen momento para prácticas meditativas y descanso.', categoria: 'calma' },
      { rango: '8.0-12.0 Hz', interpretacion: 'Actividad moderada. Puede haber mayor sensibilidad emocional.', recomendaciones: 'Mantén hidratación y realiza pausas conscientes.', categoria: 'activacion' },
      { rango: '12.0+ Hz', interpretacion: 'Pico de actividad. Posibles efectos en el sueño y concentración.', recomendaciones: 'Evita decisiones importantes. Prioriza el autocuidado.', categoria: 'pico' },
    ];

    for (const item of sampleInterpretations) {
      await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          parent: { database_id: interpretationsDb.id },
          properties: {
            Rango_Frecuencia: { title: [{ text: { content: item.rango } }] },
            Interpretacion: { rich_text: [{ text: { content: item.interpretacion } }] },
            Recomendaciones: { rich_text: [{ text: { content: item.recomendaciones } }] },
            Categoria: { select: { name: item.categoria } },
          },
        }),
      });
    }

    console.log('Configuración completada exitosamente');

    return new Response(
      JSON.stringify({
        success: true,
        subscribersDbId: subscribersDb.id,
        interpretationsDbId: interpretationsDb.id,
        message: 'Bases de datos creadas exitosamente',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en setup:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
