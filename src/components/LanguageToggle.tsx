import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { Globe } from "lucide-react";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  const label = language === "es" ? "Switch to English" : "Cambiar a Español";
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLanguage}
      className="relative"
      title={label}
      aria-label={label}
    >
      <Globe className="h-4 w-4" aria-hidden="true" />
      <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-primary text-primary-foreground rounded px-1">
        {language.toUpperCase()}
      </span>
    </Button>
  );
};
