import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const FAQ_KEYS = ["faq1", "faq2", "faq3", "faq4", "faq5"] as const;

export const FaqSection = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-display font-light text-foreground flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" />
        {t.dashboard.faqTitle}
      </h3>
      <Accordion type="single" collapsible className="space-y-3">
        {FAQ_KEYS.map((key) => (
          <AccordionItem key={key} value={key} className="border rounded-xl px-5 bg-card">
            <AccordionTrigger className="hover:no-underline text-left">
              {t.dashboard[`${key}q`]}
            </AccordionTrigger>
            <AccordionContent className="text-card-foreground leading-relaxed">
              {t.dashboard[`${key}a`]}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
