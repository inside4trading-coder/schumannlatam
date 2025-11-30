import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Info, TrendingUp, AlertCircle } from "lucide-react";

export const BibliotecaView = () => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Biblioteca de Conocimiento</h2>
      </div>

      {/* ¿Qué es la Resonancia Schumann? */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <CardTitle>¿Qué es la Resonancia Schumann?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">
            La Resonancia Schumann es un conjunto de picos en la banda de frecuencia extremadamente baja (ELF)
            del espectro electromagnético de la Tierra. Estas resonancias se producen en la cavidad entre la
            superficie terrestre y la ionosfera.
          </p>
          <p className="text-card-foreground leading-relaxed">
            La frecuencia fundamental de la Resonancia Schumann es de aproximadamente <strong>7.83 Hz</strong>,
            aunque puede variar ligeramente. Fue predicha matemáticamente por el físico Winfried Otto Schumann
            en 1952 y confirmada experimentalmente en los años siguientes.
          </p>
          <p className="text-card-foreground leading-relaxed">
            Esta resonancia es generada y excitada por las descargas de rayos en la atmósfera, que actúan
            como una fuente de energía electromagnética continua.
          </p>
        </CardContent>
      </Card>

      {/* Por qué se habla de sus efectos */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Por qué se habla de sus efectos</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">
            Algunas personas en el ámbito del bienestar y la medicina alternativa sugieren que la
            Resonancia Schumann podría estar relacionada con el bienestar humano, ya que su frecuencia
            fundamental está cerca del rango de las ondas cerebrales alfa (8-12 Hz).
          </p>
          <p className="text-card-foreground leading-relaxed">
            Se han reportado correlaciones entre las variaciones en la actividad de la Resonancia Schumann
            y diversos aspectos del comportamiento humano, el estado de ánimo y la salud en general.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-card-foreground">
              <strong>Importante:</strong> Es fundamental destacar que estas correlaciones no constituyen
              evidencia científica definitiva. La comunidad científica mantiene una postura cautelosa respecto
              a estas afirmaciones, y se necesita más investigación para establecer relaciones causales claras.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cómo leemos estas gráficas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Cómo leemos estas gráficas</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">
            Las gráficas de la Resonancia Schumann muestran la intensidad de las señales electromagnéticas
            a diferentes frecuencias a lo largo del tiempo. A continuación, algunos elementos clave:
          </p>
          <ul className="space-y-2 list-disc list-inside text-card-foreground">
            <li>
              <strong>Picos de intensidad:</strong> Las líneas más brillantes o intensas indican momentos
              de mayor actividad electromagnética.
            </li>
            <li>
              <strong>Frecuencias:</strong> El eje vertical generalmente muestra las frecuencias (en Hz),
              con la fundamental alrededor de 7.83 Hz.
            </li>
            <li>
              <strong>Tiempo:</strong> El eje horizontal representa el tiempo, permitiendo observar
              variaciones a lo largo del día.
            </li>
            <li>
              <strong>Color y densidad:</strong> Los colores más cálidos (rojos, naranjas) suelen indicar
              mayor intensidad, mientras que los fríos (azules, verdes) indican menor intensidad.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Limitaciones y disclaimer */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Limitaciones y Disclaimer</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">
            <strong>Esta información es exclusivamente educativa y orientativa.</strong> No debe ser
            utilizada como base para diagnósticos médicos ni para tomar decisiones relacionadas con la salud.
          </p>
          <ul className="space-y-2 list-disc list-inside text-card-foreground">
            <li>
              <strong>No es un diagnóstico:</strong> Las lecturas de la Resonancia Schumann no pueden
              diagnosticar condiciones médicas ni de salud mental.
            </li>
            <li>
              <strong>No son predicciones:</strong> No se pueden hacer predicciones confiables sobre
              eventos futuros basándose únicamente en estas mediciones.
            </li>
            <li>
              <strong>Correlaciones reportadas:</strong> Cualquier relación entre la Resonancia Schumann
              y el bienestar humano se basa en correlaciones reportadas anecdóticamente, no en evidencia
              científica concluyente.
            </li>
          </ul>
          <div className="bg-background border border-destructive/30 rounded-lg p-4 mt-4">
            <p className="text-sm text-destructive font-semibold">
              Siempre consulte con profesionales de la salud calificados para cualquier inquietud médica
              o de bienestar. Esta aplicación no sustituye el asesoramiento médico profesional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
