import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTION_TOKEN = Deno.env.get("NOTION_TOKEN");
const SUBSCRIBERS_DB_ID = Deno.env.get("NOTION_SUBSCRIBERS_DB_ID");

interface SendNewsletterRequest {
  subject: string;
  htmlContent: string;
  textContent?: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!NOTION_TOKEN || !SUBSCRIBERS_DB_ID) {
      throw new Error("Missing Notion configuration");
    }

    const { subject, htmlContent, textContent }: SendNewsletterRequest = await req.json();

    if (!subject || !htmlContent) {
      return new Response(
        JSON.stringify({ error: "Subject and content are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching active subscribers from Notion...");

    // Get active subscribers
    const subscribersResponse = await fetch(
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
            property: "Activo",
            checkbox: { equals: true },
          },
        }),
      }
    );

    const subscribersData = await subscribersResponse.json();
    const subscribers = subscribersData.results || [];

    console.log(`Found ${subscribers.length} active subscribers`);

    if (subscribers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No active subscribers" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract emails
    const emails = subscribers
      .map((sub: any) => sub.properties.Email?.email)
      .filter((email: string | null) => email);

    console.log(`Sending newsletter to ${emails.length} emails`);

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    let sentCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      for (const email of batch) {
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Resonancia Schumann <onboarding@resend.dev>",
              to: [email],
              subject: subject,
              html: htmlContent,
              text: textContent,
            }),
          });
          
          if (res.ok) {
            sentCount++;
          } else {
            const errorData = await res.json();
            console.error(`Failed to send to ${email}:`, errorData);
            errors.push(email);
          }
        } catch (emailError: any) {
          console.error(`Failed to send to ${email}:`, emailError);
          errors.push(email);
        }
      }
      
      // Small delay between batches
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Newsletter sent. Success: ${sentCount}, Failed: ${errors.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: sentCount, 
        failed: errors.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Newsletter send error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
