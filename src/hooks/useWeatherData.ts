import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type WeatherStation = Tables<"weather_stations">;
export type WeatherRecord = Tables<"weather_records">;
export type DisasterAlert = Tables<"disaster_alerts">;
export type ExtremeEvent = Tables<"extreme_events">;
export type UploadedFile = Tables<"upload_history">;

export function useStations() {
  return useQuery({
    queryKey: ["weather_stations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("weather_stations").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useWeatherRecords() {
  return useQuery({
    queryKey: ["weather_records"],
    queryFn: async () => {
      const { data, error } = await supabase.from("weather_records").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useDisasterAlerts() {
  return useQuery({
    queryKey: ["disaster_alerts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("disaster_alerts").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useExtremeEvents() {
  return useQuery({
    queryKey: ["extreme_events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("extreme_events").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useUploadHistory() {
  return useQuery({
    queryKey: ["upload_history"],
    queryFn: async () => {
      const { data, error } = await supabase.from("upload_history").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function getMonthName(m: number) {
  return monthNames[m - 1] || "";
}

export function computePluvialidadeData(records: WeatherRecord[]) {
  const byMonth: Record<number, number[]> = {};
  records.forEach((r) => {
    if (!byMonth[r.mes]) byMonth[r.mes] = [];
    byMonth[r.mes].push(r.precipitacao);
  });
  return Array.from({ length: 12 }, (_, i) => {
    const vals = byMonth[i + 1] || [0];
    return { mes: monthNames[i], precipitacao: Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) };
  });
}

export function computeWindData(records: WeatherRecord[]) {
  const byMonth: Record<number, { med: number[]; max: number[] }> = {};
  records.forEach((r) => {
    if (!byMonth[r.mes]) byMonth[r.mes] = { med: [], max: [] };
    byMonth[r.mes].med.push(r.vento_medio);
    byMonth[r.mes].max.push(r.vento_maximo);
  });
  return Array.from({ length: 12 }, (_, i) => {
    const m = byMonth[i + 1] || { med: [0], max: [0] };
    return {
      mes: monthNames[i],
      velocidadeMedia: parseFloat((m.med.reduce((s, v) => s + v, 0) / m.med.length).toFixed(1)),
      velocidadeMaxima: parseFloat((m.max.reduce((s, v) => s + v, 0) / m.max.length).toFixed(1)),
    };
  });
}

export function computeStatAnalysisData(records: WeatherRecord[]) {
  const byMonth: Record<number, number[]> = {};
  records.forEach((r) => {
    if (!byMonth[r.mes]) byMonth[r.mes] = [];
    byMonth[r.mes].push(r.temperatura_media);
  });
  return Array.from({ length: 12 }, (_, i) => {
    const temps = (byMonth[i + 1] || [0]).sort((a, b) => a - b);
    return {
      mes: monthNames[i],
      min: temps[0],
      q1: temps[Math.floor(temps.length * 0.25)] ?? temps[0],
      mediana: temps[Math.floor(temps.length / 2)],
      q3: temps[Math.floor(temps.length * 0.75)] ?? temps[temps.length - 1],
      max: temps[temps.length - 1],
    };
  });
}

export function computeTempHeatmapData(records: WeatherRecord[]) {
  const map: Record<string, number[]> = {};
  records.forEach((r) => {
    if (!map[r.estacao]) map[r.estacao] = new Array(12).fill(null);
    map[r.estacao][r.mes - 1] = r.temperatura_media;
  });
  return map;
}

export function computePressureAltitudeData(stations: WeatherStation[], records: WeatherRecord[]) {
  return stations.map((s) => {
    const stRecs = records.filter((r) => r.estacao === s.nome);
    const avgTemp = stRecs.length > 0 ? stRecs.reduce((sum, r) => sum + r.temperatura_media, 0) / stRecs.length : 22;
    const avgPressao = stRecs.length > 0 ? stRecs.reduce((sum, r) => sum + r.pressao, 0) / stRecs.length : 1013 - s.altitude * 0.12;
    return { nome: s.nome, altitude: s.altitude, pressao: avgPressao, temperatura: avgTemp };
  });
}

const monthNames12 = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/**
 * Computes a composite risk index (0-100%) per month from real weather records.
 * Factors: precipitation intensity (40%), wind speed (30%), temperature anomaly (30%).
 */
export function computeRiskData(records: WeatherRecord[]) {
  if (records.length === 0) return [];

  // Global reference values for normalization
  const allPrecip = records.map(r => r.precipitacao);
  const allWind = records.map(r => r.vento_maximo);
  const allTemp = records.map(r => r.temperatura_media);
  const maxPrecip = Math.max(...allPrecip, 1);
  const maxWind = Math.max(...allWind, 1);
  const avgTempGlobal = allTemp.reduce((s, v) => s + v, 0) / allTemp.length;
  const maxTempDev = Math.max(...allTemp.map(t => Math.abs(t - avgTempGlobal)), 1);

  const byMonth: Record<number, { precip: number[]; wind: number[]; tempDev: number[] }> = {};
  records.forEach(r => {
    if (!byMonth[r.mes]) byMonth[r.mes] = { precip: [], wind: [], tempDev: [] };
    byMonth[r.mes].precip.push(r.precipitacao);
    byMonth[r.mes].wind.push(r.vento_maximo);
    byMonth[r.mes].tempDev.push(Math.abs(r.temperatura_media - avgTempGlobal));
  });

  return Array.from({ length: 12 }, (_, i) => {
    const m = byMonth[i + 1];
    if (!m) return { mes: monthNames12[i], risco: 0, enchente: 0, seca: 0, tempestade: 0 };

    const avgPrecip = m.precip.reduce((s, v) => s + v, 0) / m.precip.length;
    const avgWind = m.wind.reduce((s, v) => s + v, 0) / m.wind.length;
    const avgTempDev = m.tempDev.reduce((s, v) => s + v, 0) / m.tempDev.length;

    // Flood risk: high precipitation
    const enchente = Math.min((avgPrecip / maxPrecip) * 100, 100);
    // Drought risk: inverse of precipitation (low = high risk)
    const seca = Math.min(((maxPrecip - avgPrecip) / maxPrecip) * 60, 100);
    // Storm risk: high wind
    const tempestade = Math.min((avgWind / maxWind) * 100, 100);
    // Temperature anomaly factor
    const tempFactor = Math.min((avgTempDev / maxTempDev) * 100, 100);

    // Composite: precip 40%, wind 30%, temp anomaly 30%
    const risco = Math.round(enchente * 0.4 + tempestade * 0.3 + tempFactor * 0.3);

    return {
      mes: monthNames12[i],
      risco: Math.min(risco, 100),
      enchente: Math.round(enchente),
      seca: Math.round(seca),
      tempestade: Math.round(tempestade),
    };
  });
}

