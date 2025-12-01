import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Info, TrendingUp, AlertCircle } from "lucide-react";
import schumannGraphExample from "@/assets/schumann-graph-example.png";

export const BibliotecaView = () => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Biblioteca de Conocimiento</h2>
      </div>

      {/* Historia */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>Historia</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">
            La resonancia fue predicha por primera vez por el físico Winfried Otto Schumann en 1952, 
            y posteriormente fue observada y medida en los años siguientes. Nombrada en su honor, la 
            resonancia de Schumann se ha convertido desde entonces en un punto de interés no solo para 
            los científicos, sino también para entusiastas de diversas disciplinas.
          </p>
          <p className="text-card-foreground leading-relaxed">
            Nikola Tesla es considerado influyente en el descubrimiento de las frecuencias de la 
            resonancia de Schumann.
          </p>
        </CardContent>
      </Card>

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
            La resonancia de Schumann es un conjunto de frecuencias electromagnéticas que ocurren naturalmente 
            en la atmósfera terrestre. Místicamente, a menudo se percibe como el "latido del corazón" de la 
            Tierra o un reflejo de la conciencia del planeta.
          </p>

          <p className="text-card-foreground leading-relaxed mt-4">
            La frecuencia fundamental de la resonancia de Schumann es aproximadamente <strong>7.83 Hz</strong>. 
            (La Tierra básicamente vibra a esta frecuencia) y tiene varias frecuencias armónicas adicionales que 
            incluyen <strong>14.07 Hz</strong>, <strong>20.25 Hz</strong>, <strong>26.41 Hz</strong> y{" "}
            <strong>32.45 Hz</strong>. Estas frecuencias coinciden en parte con las frecuencias cerebrales 
            humanas, como las ondas alfa y theta, relacionadas con estados de relajación, meditación y sueño ligero.
          </p>
          
          <div className="space-y-3 mt-4">
            <div>
              <strong className="text-card-foreground">Ritmos Naturales:</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                La resonancia de Schumann es una manifestación de los ritmos naturales de la Tierra, muy similar 
                a las ondas cerebrales en los humanos. Se cree que conecta a todos los seres vivos con el pulso 
                energético del planeta.
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">Conexión Humana:</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                Los místicos creen que los humanos pueden sintonizar estas frecuencias para el crecimiento 
                espiritual y la sanación. Se dice que la resonancia influye en la conciencia humana, las 
                emociones y el bienestar físico, fomentando una conexión más profunda con la Tierra.
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">Equilibrio Armónico:</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                Estas frecuencias se ven como un equilibrio armónico entre la Tierra y la ionosfera. Las 
                disrupciones en la resonancia podrían reflejar cambios globales o cósmicos, potencialmente 
                afectando el comportamiento y la conciencia humana.
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">Despertar Espiritual:</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                Algunas tradiciones espirituales sugieren que el aumento de la frecuencia de la resonancia de 
                Schumann señala un cambio en la conciencia humana, un movimiento hacia una mayor conciencia 
                espiritual e iluminación.
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">Estados Meditativos:</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                Prácticas como la meditación, el grounding (conexión con la tierra) y la atención plena se 
                creen que ayudan a los individuos a alinearse con la resonancia de Schumann, promoviendo la 
                paz interior y una sensación de unidad con la energía de la Tierra.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Frecuencias de resonancia de Schumann y frecuencias cerebrales humanas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Frecuencias de resonancia de Schumann y frecuencias cerebrales humanas</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">
            Las ondas cerebrales se han clasificado en rangos de frecuencia distintos, generalmente asociados 
            con diferentes regiones cerebrales y estados de conciencia. Los diferentes tipos de ondas cerebrales 
            son los siguientes:
          </p>

          <div className="space-y-3 mt-4">
            <div>
              <strong className="text-card-foreground">Ondas delta (0-4 Hz)</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                Se asocian con sueño muy profundo, la mente subconsciente, emociones y el sistema endocrino.
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">Ondas theta (4-8 Hz)</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                Se asocian con sueño REM, relajación profunda, estados creativos de la mente y aprendizaje.
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">Ondas alfa (8-12 Hz)</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                Se asocian con relajación con ojos cerrados, estados mentales calmados, flujo enfocado, 
                reflexión y visualización.
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">Ondas beta (12-30 Hz)</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                Se asocian con conciencia despierta, alerta, concentración y estados mentales enfocados.
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">Ondas gamma (30+ Hz)</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                Se asocian con conciencia superior, resolución de problemas, estados altamente creativos y 
                meditativos, sincronización generalizada de ondas cerebrales, ideación e insights.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-card-foreground leading-relaxed font-semibold mb-3">
              Si superpones las resonancias de Schumann sobre las ondas cerebrales humanas, obtienes lo siguiente:
            </p>
            <ul className="space-y-2 text-card-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>7.8 Hz</strong> frecuencia Schumann (ondas cerebrales theta superior y alfa inferior)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>14 Hz</strong> frecuencia Schumann (ondas cerebrales beta bajas)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>20 Hz</strong> frecuencia Schumann (ondas cerebrales beta medias)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>25 Hz</strong> frecuencia Schumann (ondas cerebrales beta superiores)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>33 Hz y superiores</strong> frecuencia Schumann (ondas cerebrales gamma)</span>
              </li>
            </ul>
          </div>
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
          <div>
            <h4 className="font-semibold text-card-foreground mb-2">Efectos Ambientales</h4>
            <p className="text-card-foreground leading-relaxed">
              El cerebro utiliza un sistema oscilante ELF (Extremely Low Frequency), haciendo uso principalmente 
              de iones de calcio para controlar neurotransmisores. Las señales ELF externas inducen eflujos de 
              iones de calcio en neuronas alterados en el tejido cerebral. Los animales y los humanos han 
              evolucionado en un ambiente saturado por la señal SR durante aproximadamente 3 mil millones de años. 
              La sincronización estable del cerebro mediante señales SR ha conducido al pensamiento, la emoción, 
              la memoria y la inteligencia. El cerebro tiene transmisores y receptores electromagnéticos en las 
              neuronas.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-card-foreground mb-2">Actividad S/GMA (Solar/Geomagnética)</h4>
            <p className="text-card-foreground leading-relaxed">
              La actividad S/GMA ha demostrado afectar la amplitud (fortaleza) de la señal SR, y como sabemos, 
              el ciclo de resonancia de Schumann afecta a los seres humanos.
            </p>
            <p className="text-card-foreground leading-relaxed mt-2">
              Las correlaciones entre el número de manchas solares y los índices de actividad GMA también 
              coinciden con ciertos efectos en la salud.
            </p>
            <p className="text-card-foreground leading-relaxed mt-2">
              La radiación de rayos X y rayos gamma de los vientos solares tienen un impacto en la fortaleza 
              de la señal SR y pueden alterar el ciclo diurno.
            </p>
            <p className="text-card-foreground leading-relaxed mt-2">
              Los rayos X ionizan los átomos con los que entran en contacto e incrementan la concentración de 
              iones en la región D de la ionosfera. La región D es la parte superior de la cavidad ionosférica 
              en la cual existe la señal SR.
            </p>
            <p className="text-card-foreground leading-relaxed mt-2">
              La variación diaria en la región D produce la variación en la señal SR. Las tormentas solares 
              también se sabe que producen variaciones en la señal SR.
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
          <ul className="space-y-3 text-card-foreground">
            <li>
              <strong>Eje X:</strong> Representa el tiempo, en horas, utilizando la Hora de Verano de Tomsk 
              (TLVA UTC+7)
            </li>
            <li>
              <strong>Eje Y:</strong> Representa la frecuencia entre 0 y 40 Hz
            </li>
            <li>
              <strong>Fecha:</strong> Se muestra una serie de tres fechas horizontalmente en la parte superior 
              del gráfico en orden de izquierda a derecha.
            </li>
            <li>
              <strong>Hora:</strong> Para cada día se muestra una secuencia de 0-24 horas horizontalmente en 
              la parte inferior del gráfico. La zona horaria corresponde a la ubicación de la estación de 
              monitoreo, Hora de Verano de Tomsk (TLVA).
            </li>
            <li>
              <strong>Color:</strong> Indica amplitud (fortaleza/intensidad), el negro y azul son los colores 
              de fondo y luego la escala se mueve desde verde pasando por rojo hasta la amplitud más alta 
              representada en blanco.
            </li>
          </ul>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">Ejemplo visual de gráfica de Resonancia Schumann:</p>
            <img 
              src={schumannGraphExample} 
              alt="Ejemplo de gráfica de Resonancia Schumann mostrando frecuencias y amplitudes" 
              className="w-full rounded-lg border border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estaciones de monitoreo */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Estaciones de monitoreo</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-card-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Rhode Island</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong>Tomsk University Rusia</strong> (Nosotros usamos estos datos)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>MIT</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Italy</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Cultura popular */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <CardTitle>Cultura popular</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground leading-relaxed">
            A lo largo de los años, la resonancia de Schumann ha sido objeto de numerosas especulaciones, 
            mitos e interpretaciones, especialmente en el ámbito de la medicina alternativa, comunidades 
            metafísicas y creencias New Age.
          </p>
          
          <div className="space-y-3 mt-4">
            <div>
              <strong className="text-card-foreground">Espiritualidad New Age:</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                Algunos proponentes en la comunidad New Age creen que la resonancia de Schumann está 
                estrechamente vinculada a la conciencia humana. Sugieren que cambios o alteraciones en 
                estas frecuencias pueden influir en la salud física, el bienestar mental y el crecimiento 
                espiritual.
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">Medicina Alternativa:</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                Algunos practicantes de salud alternativa afirman que dispositivos o terapias que imitan 
                o armonizan con la resonancia de Schumann pueden provocar curación o equilibrio en el cuerpo.
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">Música y Arte:</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                El concepto de que la Tierra tiene un "latido del corazón" ha inspirado a numerosos 
                artistas, músicos y escritores.
              </p>
            </div>

            <div>
              <strong className="text-card-foreground">Cine y Televisión:</strong>
              <p className="text-card-foreground leading-relaxed mt-1">
                La resonancia de Schumann ha sido ocasionalmente un elemento de la trama en géneros de 
                ciencia ficción y paranormales. Como el icónico anime Serial Experiments Lain.
              </p>
            </div>
          </div>
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
