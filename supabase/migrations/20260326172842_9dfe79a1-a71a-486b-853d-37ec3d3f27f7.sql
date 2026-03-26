
-- Weather stations table
CREATE TABLE public.weather_stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  estado TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  altitude DOUBLE PRECISION NOT NULL,
  situacao TEXT NOT NULL DEFAULT 'Operante' CHECK (situacao IN ('Operante', 'Manutenção')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Weather records table
CREATE TABLE public.weather_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estacao TEXT NOT NULL,
  estado TEXT NOT NULL,
  ano INTEGER NOT NULL,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  temperatura_media DOUBLE PRECISION NOT NULL,
  precipitacao DOUBLE PRECISION NOT NULL,
  vento_medio DOUBLE PRECISION NOT NULL,
  vento_maximo DOUBLE PRECISION NOT NULL,
  pressao DOUBLE PRECISION NOT NULL,
  umidade DOUBLE PRECISION NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  altitude DOUBLE PRECISION NOT NULL,
  situacao TEXT NOT NULL DEFAULT 'Operante' CHECK (situacao IN ('Operante', 'Manutenção')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Disaster alerts table
CREATE TABLE public.disaster_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estacao TEXT NOT NULL,
  estado TEXT NOT NULL,
  nivel TEXT NOT NULL CHECK (nivel IN ('CRÍTICO', 'ALTO', 'MODERADO')),
  descricao TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Extreme events table
CREATE TABLE public.extreme_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  valor TEXT NOT NULL,
  estacao TEXT NOT NULL,
  estado TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Upload history table
CREATE TABLE public.upload_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tamanho TEXT NOT NULL,
  registros INTEGER NOT NULL DEFAULT 0,
  data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.weather_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disaster_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extreme_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_history ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required for this dashboard)
CREATE POLICY "Public read access" ON public.weather_stations FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.weather_records FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.disaster_alerts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.extreme_events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.upload_history FOR SELECT USING (true);

-- Public insert access for CSV uploads
CREATE POLICY "Public insert access" ON public.weather_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.weather_stations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.disaster_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.extreme_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.upload_history FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX idx_weather_records_estacao ON public.weather_records (estacao);
CREATE INDEX idx_weather_records_ano_mes ON public.weather_records (ano, mes);
CREATE INDEX idx_disaster_alerts_nivel ON public.disaster_alerts (nivel);
CREATE INDEX idx_extreme_events_tipo ON public.extreme_events (tipo);
