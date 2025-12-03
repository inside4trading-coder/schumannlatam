import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface TranslationCache {
  [key: string]: string;
}

const translationCache: TranslationCache = {};

export const useTranslation = (texts: (string | undefined | null)[]) => {
  const { language } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const prevLanguageRef = useRef(language);
  const prevTextsRef = useRef<string>("");

  const translateTexts = useCallback(async (textsToTranslate: string[]) => {
    // Check cache first
    const cachedResults: (string | null)[] = textsToTranslate.map((text) => {
      const cacheKey = `${language}:${text}`;
      return translationCache[cacheKey] || null;
    });

    const allCached = cachedResults.every((r) => r !== null);
    if (allCached) {
      setTranslatedTexts(cachedResults as string[]);
      return;
    }

    // Get texts that need translation
    const textsNeedingTranslation = textsToTranslate.filter(
      (_, index) => cachedResults[index] === null
    );

    if (textsNeedingTranslation.length === 0) {
      setTranslatedTexts(cachedResults as string[]);
      return;
    }

    setIsTranslating(true);

    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: {
          texts: textsNeedingTranslation,
          targetLanguage: language === "en" ? "English" : "Spanish",
        },
      });

      if (error) {
        console.error("Translation error:", error);
        setTranslatedTexts(textsToTranslate);
        return;
      }

      const translations = data.translations || textsNeedingTranslation;

      // Update cache
      let translationIndex = 0;
      textsToTranslate.forEach((text, index) => {
        if (cachedResults[index] === null) {
          const cacheKey = `${language}:${text}`;
          translationCache[cacheKey] = translations[translationIndex];
          cachedResults[index] = translations[translationIndex];
          translationIndex++;
        }
      });

      setTranslatedTexts(cachedResults as string[]);
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedTexts(textsToTranslate);
    } finally {
      setIsTranslating(false);
    }
  }, [language]);

  useEffect(() => {
    const filteredTexts = texts.map((t) => t || "");
    const textsKey = JSON.stringify(filteredTexts);

    // If Spanish, just return original texts
    if (language === "es") {
      setTranslatedTexts(filteredTexts);
      return;
    }

    // Only translate if language changed or texts changed
    if (prevLanguageRef.current !== language || prevTextsRef.current !== textsKey) {
      prevLanguageRef.current = language;
      prevTextsRef.current = textsKey;

      if (filteredTexts.some((t) => t.trim())) {
        translateTexts(filteredTexts);
      } else {
        setTranslatedTexts(filteredTexts);
      }
    }
  }, [language, texts, translateTexts]);

  return { translatedTexts, isTranslating };
};
