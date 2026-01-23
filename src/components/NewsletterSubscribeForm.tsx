import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const subscriptionSchema = z.object({
  email: z.string().trim().email({ message: "Por favor ingresa un email válido" }).max(255),
  name: z.string().trim().max(100).optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export const NewsletterSubscribeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
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

  if (isSubscribed) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <CheckCircle className="h-10 w-10 text-primary" />
            <p className="font-medium text-foreground">
              {language === "es" ? "¡Gracias por suscribirte!" : "Thank you for subscribing!"}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === "es" 
                ? "Recibirás las interpretaciones directamente en tu correo." 
                : "You'll receive interpretations directly in your inbox."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="h-5 w-5 text-primary" />
          {language === "es" ? "Newsletter Schumann" : "Schumann Newsletter"}
        </CardTitle>
        <CardDescription>
          {language === "es" 
            ? "Recibe las interpretaciones diarias de la resonancia Schumann en tu correo." 
            : "Receive daily Schumann resonance interpretations in your email."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder={language === "es" ? "Tu nombre (opcional)" : "Your name (optional)"} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
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
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === "es" ? "Suscribiendo..." : "Subscribing..."}
                </>
              ) : (
                language === "es" ? "Suscribirme" : "Subscribe"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
