import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NOTION_TOKEN = Deno.env.get("NOTION_TOKEN");
// Clean the database ID - remove query params and format as proper UUID
const rawDbId = Deno.env.get("NOTION_SUBSCRIBERS_DB_ID") || "";
const cleanId = rawDbId.split("?")[0].replace(/-/g, "");
const SUBSCRIBERS_DB_ID = cleanId.length === 32 
  ? `${cleanId.slice(0, 8)}-${cleanId.slice(8, 12)}-${cleanId.slice(12, 16)}-${cleanId.slice(16, 20)}-${cleanId.slice(20)}`
  : rawDbId;

interface SubscribeRequest {
  email: string;
  name?: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!NOTION_TOKEN || !SUBSCRIBERS_DB_ID) {
      console.error("Missing Notion configuration");
      throw new Error("Newsletter configuration error");
    }

    const { email, name }: SubscribeRequest = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing subscription for: ${email}`);

    // Check if email already exists
    const queryResponse = await fetch(
      `https://api.notion.com/v1/databases/${SUBSCRIBERS_DB_ID}/query`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          filter: {
            property: "Email",
            title: { equals: email },
          },
        }),
      }
    );

    const queryData = await queryResponse.json();
    
    if (queryData.results && queryData.results.length > 0) {
      console.log(`Email already subscribed: ${email}`);
      return new Response(
        JSON.stringify({ success: true, message: "Already subscribed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Add new subscriber
    const createResponse = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: SUBSCRIBERS_DB_ID },
        properties: {
          Email: { title: [{ text: { content: email } }] },
          Nombre: { rich_text: [{ text: { content: name || "" } }] },
          Activo: { checkbox: true },
          Fecha_Suscripcion: { date: { start: new Date().toISOString().split("T")[0] } },
        },
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error("Notion API error:", errorData);
      throw new Error("Failed to save subscription");
    }

    console.log(`Successfully subscribed: ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: "Subscribed successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Subscription error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
