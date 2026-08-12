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
│ ├── Index.tsx # Dashboard principal de resonancia
│ ├── Sismos.tsx # Tabs En vivo/Histórico, toggle 2D⇌3D
│ └── SolarActivity.tsx # Lazy route
├── components/
│ ├── EarthquakeGlobe/ # Globo WebGL, pulsos, raycasting
│ ├── AftershockForecast/ # Curva de Omori, gráfico de réplicas
│ ├── FeltReport/ # "¿Lo sentiste?" — conteo optimista + Supabase
│ └── SeismicReplay/ # Reproductor temporal 72h
├── hooks/
│ └── useSeismicHistory.ts # Frecuencia histórica vía feeds estáticos USGS
├── lib/
│ └── feltReports.ts # Cliente + tipos de reportes ciudadanos
└── i18n/ # ES/EN completo

supabase/
└── migrations/ # RLS anónima para feltReports


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
- [ ] Histórico largo (>30 días) vía proxy edge function
- [ ] Notificaciones push ante detección de enjambre sísmico

## Licencia

MIT