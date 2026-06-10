import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const subscriptionSchema = z.object({
  email: z.string().trim().email({ message: "Por favor ingresa un email válido" }).max(255),
  name: z.string().trim().max(100).optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export const NewsletterSubscribeCompact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const onSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true);
    try {
      const { data: response, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: data.email, name: data.name || "" },
      });

      if (error) throw error;

      setIsSubscribed(true);
      toast({
        title: language === "es" ? "¡Suscripción exitosa!" : "Successfully subscribed!",
        description: language === "es" 
          ? "Recibirás las interpretaciones diarias de la resonancia Schumann." 
          : "You'll receive daily Schumann resonance interpretations.",
      });
      form.reset();
      
      // Close popover after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        variant: "destructive",
        title: language === "es" ? "Error al suscribirse" : "Subscription error",
        description: error.message || (language === "es" ? "Intenta de nuevo más tarde." : "Please try again later."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          title={language === "es" ? "Suscribirse al Newsletter" : "Subscribe to Newsletter"}
          aria-label={language === "es" ? "Suscribirse al Newsletter" : "Subscribe to Newsletter"}
        >
          <Mail className="h-5 w-5" aria-hidden="true" />
          {isSubscribed && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle className="h-2 w-2 text-primary-foreground" aria-hidden="true" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        {isSubscribed ? (
          <div className="flex flex-col items-center gap-2 text-center py-2">
            <CheckCircle className="h-8 w-8 text-primary" />
            <p className="text-sm font-medium text-foreground">
              {language === "es" ? "¡Gracias por suscribirte!" : "Thank you for subscribing!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {language === "es" ? "Newsletter Schumann" : "Schumann Newsletter"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {language === "es" 
                ? "Recibe interpretaciones diarias en tu correo." 
                : "Receive daily interpretations in your email."}
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder={language === "es" ? "Nombre (opcional)" : "Name (optional)"} 
                          className="h-8 text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder={language === "es" ? "tu@email.com" : "your@email.com"} 
                          className="h-8 text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="sm" className="w-full h-8" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      {language === "es" ? "Enviando..." : "Sending..."}
                    </>
                  ) : (
                    language === "es" ? "Suscribirme" : "Subscribe"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
