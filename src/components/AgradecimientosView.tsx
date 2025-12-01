import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ExternalLink } from "lucide-react";
export const AgradecimientosView = () => {
  return <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Agradecimientos</h2>
      </div>

      {/* Nuestros creadores */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle>Nuestros creadores</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">
            El agradecimiento es a esos niños de las estrellas, que vinieron en oleadas desde los 80s 
            para elevar la frecuencia del planeta con un solo ingrediente, el amor.
          </p>
          <p className="text-card-foreground leading-relaxed">A todas esas almas que vinieron de manera voluntaria a este momento de la historia, que no siguieron un camino prediseñado y construyeron su propio camino.</p>
          <p className="text-card-foreground leading-relaxed">Los niños de las estrellas están aquí y vienen con un propósito, recordar el libre albedrío de elegir.
        </p>

          <div className="mt-6 rounded-lg overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/XpdpW0z9xnQ?si=ZkF3GgNfCJEp87iC" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-card-foreground leading-relaxed">
                Gracias a{" "}
                <a href="https://musacreativo.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold transition-colors">
                  Musa Automation
                </a>
                {" "}por la colaboración en construir la primera comunidad de información acerca de la 
                resonancia de schumann en habla hispana.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-card-foreground leading-relaxed">
                Gracias a{" "}
                <a href="https://en.tsu.ru/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold transition-colors">
                  Tomsk University
                </a>
                {" "}por monitorear estos datos y compartirlos.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-card-foreground leading-relaxed">
                Gracias al{" "}
                <a href="https://sos70.ru/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold transition-colors">
                  sistema de observación espacial 70 de Rusia
                </a>
                {" "}que también hace posible que estos datos sean públicos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};