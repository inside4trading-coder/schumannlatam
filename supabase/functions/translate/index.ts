import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts, targetLanguage } = await req.json();
    
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No texts provided for translation" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Filter out empty texts
    const validTexts = texts.filter((t: string) => t && t.trim());
    if (validTexts.length === 0) {
      return new Response(
        JSON.stringify({ translations: texts }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `Translate the following texts from Spanish to ${targetLanguage}. 
Return ONLY a JSON array with the translations in the same order. No explanations.
Keep the same tone and meaning. If a text is empty, return an empty string.

Texts to translate:
${JSON.stringify(validTexts, null, 2)}

Return format: ["translation1", "translation2", ...]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { 
            role: "system", 
            content: "You are a professional translator. Translate accurately while maintaining the original meaning and tone. Only return the JSON array, nothing else." 
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No translation content received");
    }

    // Parse the JSON array from the response
    let translations: string[];
    try {
      // Clean the response - remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      translations = JSON.parse(cleanContent);
    } catch {
      console.error("Failed to parse translation response:", content);
      // If parsing fails, return original texts
      return new Response(
        JSON.stringify({ translations: texts }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map back translations to original array positions (handling empty strings)
    let translationIndex = 0;
    const finalTranslations = texts.map((original: string) => {
      if (!original || !original.trim()) {
        return original;
      }
      return translations[translationIndex++] || original;
    });

    return new Response(
      JSON.stringify({ translations: finalTranslations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
