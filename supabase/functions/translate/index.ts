import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Google Gemini via its OpenAI-compatible endpoint. Get a key at
// https://aistudio.google.com/apikey and set it with:
//   supabase secrets set GEMINI_API_KEY=...
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-3.5-flash-lite";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const passthrough = (texts: unknown) =>
    new Response(JSON.stringify({ translations: texts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const { texts, targetLanguage } = await req.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No texts provided for translation" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // No translation backend configured: degrade gracefully.
    if (!GEMINI_API_KEY) return passthrough(texts);

    const validTexts = texts.filter((t: string) => t && t.trim());
    if (validTexts.length === 0) return passthrough(texts);

    const prompt = `Translate the following texts from Spanish to ${targetLanguage}.
Return ONLY a JSON array with the translations in the same order. No explanations.
Keep the same tone and meaning. If a text is empty, return an empty string.

Texts to translate:
${JSON.stringify(validTexts, null, 2)}

Return format: ["translation1", "translation2", ...]`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a professional translator. Translate accurately while maintaining the original meaning and tone. Only return the JSON array, nothing else.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return passthrough(texts);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return passthrough(texts);

    let translations: string[];
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      translations = JSON.parse(cleanContent);
    } catch {
      console.error("Failed to parse translation response:", content);
      return passthrough(texts);
    }

    let translationIndex = 0;
    const finalTranslations = texts.map((original: string) => {
      if (!original || !original.trim()) return original;
      return translations[translationIndex++] || original;
    });

    return new Response(
      JSON.stringify({ translations: finalTranslations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
