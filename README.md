# Schumann LatAm

Dashboard data-first de la resonancia Schumann — la frecuencia fundamental de
la Tierra — en tiempo real, con un módulo de monitoreo sísmico propio para
Venezuela y la región.

**Producción:** https://schumannlatam.vercel.app

---

## Por qué existe esto

La resonancia Schumann y la actividad sísmica se siguen por separado en la
mayoría de fuentes: datos crudos de estaciones internacionales (Tomsk, GCI),
sin contexto local, y feeds sísmicos (USGS) sin capa de interpretación para
quien no es sismólogo.

Schumann LatAm junta ambas señales en un panel pensado para lectura diaria:
estado actual, tendencia histórica e informe editorial — y, para Venezuela en
particular, un módulo de sismos con pronóstico de réplicas y verificación
ciudadana.

---

## Qué hace

### Resonancia Schumann
- Hero compacto con **estado actual**: nivel con código de color, pulso en
  vivo, frecuencia fundamental, estación de origen y timestamp
- **Espectrograma del día** como gráfico protagonista, con enlace a la capa
  educativa
- **Histórico interactivo** (Recharts, rangos 7d/30d) con paginación compacta
  optimizada para móvil
- **Informe editorial diario**, diferenciado visualmente del resto del panel
- Biblioteca de referencia + FAQ para quien llega sin contexto previo

### Sismos (Venezuela)
| Función | Detalle |
|---|---|
| **Globo sísmico 3D** | Renderizado en Three.js, con pulsos animados por evento y raycasting para interacción directa sobre el globo |
| **Pronóstico de réplicas** | Curva de Omori aplicada sobre eventos recientes, graficada con Recharts |
| **Detección de enjambres** | Umbral automático: 5+ eventos en 150 km / 72 h |
| **"¿Lo sentiste?"** | Red ciudadana de reportes, con conteo optimista en UI y persistencia anónima en Supabase (RLS) |
| **Reproductor temporal** | Replay de las últimas 72 h de actividad sobre el globo |
| **Histórico largo** | Feed semanal vía USGS, fetch lazy, CORS-safe |
| **Umbral de magnitud** | M3.0 para Venezuela, M3.5 para el resto de la región |

## Rendimiento y accesibilidad

- Code splitting por ruta (`/solar-activity`, `/admin/newsletter`) y por
  librería pesada — Recharts va en su propio chunk
- Bundle inicial reducido de 1.31 MB a 839 KB (254 KB gzip) tras optimización
  de imágenes y lazy loading
- `prefers-reduced-motion` respetado: ondas estáticas, contador sin animar,
  sin scroll suave
- Contraste AA verificado en modo claro y oscuro (modo oscuro es el
  predeterminado — los datos destacan más)
- SEO: schema.org `Dataset` (lecturas diarias, fuente Tomsk), OG image propia
  1200×630, canonical y sitemap consistentes con el dominio de producción

## Arquitectura
src/
├── pages/
│   ├── Index.tsx              # Dashboard principal de resonancia Schumann
│   ├── Sismos.tsx              # Módulo sísmico: tabs En vivo/Histórico, toggle 2D⇌3D
│   ├── SolarActivity.tsx       # Ruta lazy — actividad solar
│   ├── AdminNewsletter.tsx     # Ruta lazy — administración de newsletter
│   └── NotFound.tsx
├── components/
│   ├── TodayView.tsx           # Estado actual: nivel, pulso live, frecuencia fundamental
│   ├── HistoricoView.tsx       # Histórico interactivo (Recharts) con paginación
│   ├── BibliotecaView.tsx      # Capa educativa de referencia
│   ├── FaqSection.tsx
│   ├── AgradecimientosView.tsx
│   ├── BadgeNivelActividad.tsx # Código de color por nivel de actividad
│   ├── NewsletterSubscribeForm.tsx / NewsletterSubscribeCompact.tsx
│   ├── LanguageToggle.tsx / ThemeToggle.tsx
│   ├── Reveal.tsx              # Wrapper de reveals on-scroll (framer-motion)
│   ├── seismic/                 # Módulo de sismos
│   │   ├── EarthquakeGlobe.tsx      # Globo 3D WebGL (Three.js), pulsos, raycasting
│   │   ├── AftershockForecast.tsx   # Curva de Omori — pronóstico de réplicas
│   │   ├── FeltReport.tsx           # "¿Lo sentiste?" — conteo optimista + Supabase
│   │   ├── SeismicReplay.tsx        # Reproductor temporal de últimas 72h
│   │   ├── SeismicHistoryChart.tsx  # Frecuencia sísmica histórica
│   │   ├── SeismicStats.tsx
│   │   ├── EarthquakeDetail.tsx
│   │   ├── EarthquakeList.tsx
│   │   └── EarthquakeMap.tsx
│   ├── dashboard/               # Componentes del dashboard de resonancia
│   └── ui/                      # shadcn/ui
├── hooks/
│   ├── useSchumannReadings.ts   # Lecturas de resonancia Schumann
│   ├── useSeismicHistory.ts     # Frecuencia sísmica histórica vía feeds USGS
│   ├── useEarthquakes.ts        # Datos sísmicos en vivo
│   ├── useSeo.ts                # SEO per-route
│   ├── useTranslation.ts        # i18n ES/EN
│   └── use-mobile.tsx / use-toast.ts
├── lib/
│   ├── feltReports.ts           # Cliente de reportes ciudadanos (Supabase)
│   ├── activity.ts              # Cálculo de nivel de actividad
│   └── utils.ts
├── i18n/                        # Diccionarios ES/EN
├── integrations/                # Cliente Supabase
└── types/

supabase/
└── migrations/                  # RLS anónima para feltReports


## Stack técnico
Frontend React + TypeScript + Vite
3D Three.js
Gráficos Recharts
Animación Framer Motion
Backend/DB Supabase (Postgres + RLS)
Deploy Vercel


## Desarrollo local

```bash
npm install
npm run dev
```

## Roadmap

- [x] Fase 1 — Reestructura a dashboard data-first
- [x] Fase 2 — Capa visual: dark mode, onda EM 2D, micro-interacciones
- [x] Fase 3 — SEO y contenido (dominio propio, schema.org, contraste AA)
- [x] Fase 4 — Rendimiento (code splitting, imágenes optimizadas)
- [x] Módulo Sismos 3D — globo, réplicas, "¿Lo sentiste?", histórico
- [x] Histórico largo (>30 días) vía proxy edge function
- [ ] Notificaciones push ante detección de enjambre sísmico

## Licencia

MIT