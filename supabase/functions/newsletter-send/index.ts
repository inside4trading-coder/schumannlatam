import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTION_TOKEN = Deno.env.get("NOTION_TOKEN");
// Clean the database ID - remove query params and format as proper UUID
const rawDbId = Deno.env.get("NOTION_SUBSCRIBERS_DB_ID") || "";
const cleanId = rawDbId.split("?")[0].replace(/-/g, "");
const SUBSCRIBERS_DB_ID = cleanId.length === 32 
  ? `${cleanId.slice(0, 8)}-${cleanId.slice(8, 12)}-${cleanId.slice(12, 16)}-${cleanId.slice(16, 20)}-${cleanId.slice(20)}`
  : rawDbId;

interface SendNewsletterRequest {
  subject: string;
  htmlContent: string;
  textContent?: string;
  testEmail?: string; // Optional: send only to this email for testing
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!NOTION_TOKEN || !SUBSCRIBERS_DB_ID) {
      throw new Error("Missing Notion configuration");
    }

    const { subject, htmlContent, textContent, testEmail }: SendNewsletterRequest = await req.json();

    if (!subject || !htmlContent) {
      return new Response(
        JSON.stringify({ error: "Subject and content are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let emails: string[] = [];

    // If testEmail is provided, send only to that email (for testing)
    if (testEmail) {
      console.log(`Test mode: sending only to ${testEmail}`);
      emails = [testEmail];
    } else {
      // Production mode: fetch from Notion
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

      // Extract emails - Email is a title property in Notion
      emails = subscribers
        .map((sub: any) => sub.properties.Email?.title?.[0]?.text?.content)
        .filter((email: string | null | undefined) => email);
    }

    console.log(`Sending newsletter to ${emails.length} emails`);

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    let sentCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      for (const email of batch) {
        try {
          console.log(`Attempting to send email to: ${email}`);
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
            console.log(`Successfully sent to: ${email}`);
            sentCount++;
          } else {
            const errorData = await res.json();
            console.error(`Resend API error for ${email}:`, JSON.stringify(errorData));
            errors.push(`${email}: ${errorData.message || 'Unknown error'}`);
          }
        } catch (emailError: any) {
          console.error(`Exception sending to ${email}:`, emailError.message);
          errors.push(`${email}: ${emailError.message}`);
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
