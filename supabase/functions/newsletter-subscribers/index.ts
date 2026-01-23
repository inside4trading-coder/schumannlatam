import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NOTION_TOKEN = Deno.env.get("NOTION_TOKEN");
const SUBSCRIBERS_DB_ID = Deno.env.get("NOTION_SUBSCRIBERS_DB_ID");

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!NOTION_TOKEN || !SUBSCRIBERS_DB_ID) {
      throw new Error("Missing Notion configuration");
    }

    console.log("Fetching all subscribers from Notion...");

    let allSubscribers: any[] = [];
    let hasMore = true;
    let startCursor: string | undefined;

    while (hasMore) {
      const body: any = {
        sorts: [{ property: "Fecha_Suscripcion", direction: "descending" }],
      };
      
      if (startCursor) {
        body.start_cursor = startCursor;
      }

      const response = await fetch(
        `https://api.notion.com/v1/databases/${SUBSCRIBERS_DB_ID}/query`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${NOTION_TOKEN}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      
      const subscribers = (data.results || []).map((page: any) => ({
        id: page.id,
        email: page.properties.Email?.email || "",
        name: page.properties.Nombre?.title?.[0]?.text?.content || "",
        active: page.properties.Activo?.checkbox ?? true,
        subscriptionDate: page.properties.Fecha_Suscripcion?.date?.start || "",
      }));

      allSubscribers = [...allSubscribers, ...subscribers];
      hasMore = data.has_more;
      startCursor = data.next_cursor;
    }

    console.log(`Found ${allSubscribers.length} total subscribers`);

    const activeCount = allSubscribers.filter(s => s.active).length;

    return new Response(
      JSON.stringify({ 
        subscribers: allSubscribers,
        total: allSubscribers.length,
        active: activeCount,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Fetch subscribers error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
