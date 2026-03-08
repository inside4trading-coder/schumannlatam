CREATE TABLE public.schumann_readings_cache (
  id TEXT PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  nivel_actividad TEXT NOT NULL DEFAULT 'Media',
  url_imagen TEXT,
  descripcion_tecnica TEXT,
  sensaciones_fisicas TEXT,
  sensaciones_emocionales TEXT,
  recomendaciones TEXT,
  texto_x TEXT,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_schumann_cache_date ON public.schumann_readings_cache (date DESC);

-- Daily aggregated cache
CREATE TABLE public.schumann_daily_cache (
  date_key DATE PRIMARY KEY,
  nivel_actividad TEXT NOT NULL DEFAULT 'Media',
  url_imagen TEXT,
  descripcion_tecnica TEXT,
  sensaciones_fisicas TEXT,
  sensaciones_emocionales TEXT,
  recomendaciones TEXT,
  texto_x TEXT,
  reading_count INTEGER NOT NULL DEFAULT 0,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- No RLS needed - public read-only data
ALTER TABLE public.schumann_readings_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schumann_daily_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.schumann_readings_cache FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.schumann_daily_cache FOR SELECT USING (true);