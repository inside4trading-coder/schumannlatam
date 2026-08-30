import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, jsonResponse, requireAdmin } from "../_shared/admin.ts";

const NOTION_TOKEN = Deno.env.get("NOTION_TOKEN");
// Clean the database ID - remove query params and format as proper UUID
const rawDbId = Deno.env.get("NOTION_SUBSCRIBERS_DB_ID") || "";
const cleanId = rawDbId.split("?")[0].replace(/-/g, "");
const SUBSCRIBERS_DB_ID = cleanId.length === 32
  ? `${cleanId.slice(0, 8)}-${cleanId.slice(8, 12)}-${cleanId.slice(12, 16)}-${cleanId.slice(16, 20)}-${cleanId.slice(20)}`
  : rawDbId;

interface NotionPage {
  id: string;
  properties: Record<string, unknown>;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // This endpoint returns subscriber PII — admin only.
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    if (!NOTION_TOKEN || !SUBSCRIBERS_DB_ID) {
      throw new Error("Missing Notion configuration");
    }

    console.log("Fetching all subscribers from Notion...");

    let allSubscribers: Array<Record<string, unknown>> = [];
    let hasMore = true;
    let startCursor: string | undefined;

    while (hasMore) {
      const body: Record<string, unknown> = {
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
        },
      );

      const data = await response.json();

      const subscribers = ((data.results as NotionPage[]) || []).map((page) => {
        const props = page.properties as Record<string, any>;
        return {
          id: page.id,
          email: props.Email?.title?.[0]?.text?.content || "",
          name: props.Nombre?.rich_text?.[0]?.text?.content || "",
          active: props.Activo?.checkbox ?? true,
          subscriptionDate: props.Fecha_Suscripcion?.date?.start || "",
        };
      });

      allSubscribers = [...allSubscribers, ...subscribers];
      hasMore = data.has_more;
      startCursor = data.next_cursor;
    }

    console.log(`Found ${allSubscribers.length} total subscribers`);

    const activeCount = allSubscribers.filter((s) => s.active).length;

    return jsonResponse({
      subscribers: allSubscribers,
      total: allSubscribers.length,
      active: activeCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Fetch subscribers error:", message);
    return jsonResponse({ error: message }, 500);
  }
});
