*[Versión en español](README.es.md)*

# Schumann LATAM

## Schumann resonance and seismic activity monitor for Venezuela

A real-time web dashboard for visualizing Schumann resonance, recent seismic activity, and Venezuela's geographic context through an accessible, high-performance interface.

### Features

- Real-time Schumann resonance dashboard.
- 3D seismic module focused on Venezuela.
- Interactive WebGL globe for exploring activity.
- Omori curve for visualizing event evolution over time.
- Long-term seismic history through an edge-function proxy.
- “Did you feel it?” module for citizen reports.
- Detection and visualization of seismic swarms.
- Responsive, accessible, and mobile-optimized design.

### Architecture

The application is built with React, TypeScript, and Vite. The interface uses reusable components, specialized hooks for resonance and seismicity data, and WebGL visualizations for the 3D globe. Historical queries run through an edge-function proxy to avoid data-provider restrictions.

### Technical stack

- React and TypeScript.
- Vite.
- WebGL-based 3D visualization.
- Schumann resonance and seismicity data APIs.
- Edge functions for historical-data proxying.
- Responsive CSS and accessibility practices.

### Local development

```bash
npm install
npm run dev
```

The application starts on the local server provided by Vite.

### Roadmap

- [x] Real-time Schumann resonance dashboard.
- [x] 3D seismic module for Venezuela.
- [x] Interactive WebGL globe.
- [x] Omori curve.
- [x] Long-term history (>30 days) through an edge-function proxy.
- [ ] Push notifications when a seismic swarm is detected.

## License

MIT
