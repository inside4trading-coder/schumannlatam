# Schumann LATAM

## Monitor de resonancia Schumann y actividad sísmica en Venezuela

Dashboard web en tiempo real para visualizar la resonancia Schumann, la actividad sísmica reciente y el contexto geográfico de Venezuela desde una interfaz accesible y de alto rendimiento.

### Funcionalidades

- Dashboard de resonancia Schumann con datos en tiempo real.
- Módulo sísmico 3D enfocado en Venezuela.
- Globo interactivo WebGL para explorar la actividad.
- Curva de Omori para visualizar la evolución temporal de los eventos.
- Histórico sísmico de largo plazo mediante proxy de edge function.
- Módulo “¿Lo sentiste?” para reportes ciudadanos.
- Detección y visualización de enjambres sísmicos.
- Diseño responsive, accesible y optimizado para dispositivos móviles.

### Arquitectura

La aplicación está construida con React, TypeScript y Vite. La interfaz utiliza componentes reutilizables, hooks especializados para datos de resonancia y sismicidad, y visualizaciones WebGL para el globo 3D. Las consultas históricas se realizan mediante una edge function proxy para evitar restricciones del proveedor de datos.

### Stack técnico

- React y TypeScript.
- Vite.
- Visualización 3D mediante WebGL.
- APIs de datos de resonancia Schumann y sismicidad.
- Edge functions para proxy de datos históricos.
- CSS responsive y prácticas de accesibilidad.

### Desarrollo local

```bash
npm install
npm run dev
```

La aplicación se inicia en el servidor local indicado por Vite.

### Roadmap

- [x] Dashboard de resonancia Schumann en tiempo real.
- [x] Módulo sísmico 3D para Venezuela.
- [x] Globo WebGL interactivo.
- [x] Curva de Omori.
- [x] Histórico largo (>30 días) vía proxy edge function.
- [ ] Notificaciones push ante detección de enjambre sísmico.

## Licencia

MIT
