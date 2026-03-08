

## Propuesta de Rediseño - Resonancia Schumann

### Concepto General

Evolucionar de un diseño funcional basado en tabs a una experiencia visual inmersiva con temática cósmica/energética que refleje la naturaleza del contenido (resonancia terrestre, frecuencias, conexión humana-planeta).

### Cambios Propuestos

#### 1. Header - Hero Compacto
- Logo centrado con el título debajo, estilo "marca"
- Fondo con gradiente sutil azul-violeta (evocando el campo electromagnético)
- Controles (newsletter, idioma, tema) en una barra superior minimalista separada del branding
- Animación sutil de pulso en el logo (evocando la frecuencia 7.83 Hz)

#### 2. Vista "Hoy" como Landing Principal (sin tabs)
- La lectura del día se muestra directamente al entrar, sin necesidad de click
- Hero card prominente con la imagen Schumann, el badge de actividad y la fecha
- Las secciones (técnica, física, emocional, recomendaciones) en un layout de 2 columnas en desktop (grid), 1 columna en mobile
- Iconos más grandes y con color de fondo circular (estilo dashboard)
- Card de recomendaciones con borde lateral colorido (accent bar) en lugar de fondo

#### 3. Navegación Secundaria
- Reemplazar las tabs por una barra de navegación fija al pie (mobile) o lateral sticky (desktop) con iconos + labels
- Las secciones Histórico, Biblioteca y Agradecimientos accesibles desde esta nav
- Transiciones suaves entre vistas

#### 4. Histórico - Timeline Visual
- Reemplazar el grid de cards por un timeline vertical con línea conectora
- Cada entrada muestra fecha, badge y preview en una fila compacta
- Filtro de calendario como floating action button en mobile

#### 5. Biblioteca - Acordeón Elegante
- Convertir las múltiples cards en secciones colapsables (accordion)
- Reduce el scroll excesivo manteniendo todo el contenido
- Primera sección expandida por defecto

#### 6. Paleta de Colores Actualizada
- Light mode: fondo cálido off-white, cards blancas, acentos en indigo/violet
- Dark mode: fondo deep navy, cards con glassmorphism sutil
- Gradientes sutiles en los headers de cards según tipo de contenido

#### 7. Tipografía y Espaciado
- Títulos principales con font-weight más ligero (light/regular) para elegancia
- Mayor uso de whitespace entre secciones
- Texto de contenido con mejor line-height para legibilidad

### Archivos a Modificar

| Archivo | Cambio |
|---|---|
| `src/index.css` | Nueva paleta de colores, variables CSS para gradientes |
| `src/pages/Index.tsx` | Layout restructurado: nav bar + contenido directo |
| `src/components/TodayView.tsx` | Grid 2 columnas, hero card, iconos con fondo |
| `src/components/HistoricoView.tsx` | Diseño timeline vertical |
| `src/components/BibliotecaView.tsx` | Convertir a accordion |
| `src/components/AgradecimientosView.tsx` | Ajustes de estilo consistentes |
| `src/components/BadgeNivelActividad.tsx` | Badges más expresivos con icono |
| `tailwind.config.ts` | Nuevas utilidades de animación (pulse, glow) |

### Notas Técnicas

- No se modifica la lógica de datos ni las edge functions
- Se reutilizan todos los componentes shadcn/ui existentes (Accordion, Tabs, Badge, etc.)
- Las traducciones existentes se mantienen intactas
- Responsive-first: mobile como base, mejoras progresivas para desktop

