import type { WeatherRecord } from "@/hooks/useWeatherData";

export function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function recordsToCsv(records: WeatherRecord[]): string {
  const headers = [
    "estacao", "estado", "ano", "mes", "temperatura_media", "precipitacao",
    "vento_medio", "vento_maximo", "pressao", "umidade", "latitude", "longitude", "altitude", "situacao"
  ];
  const rows = records.map(r =>
    [r.estacao, r.estado, r.ano, r.mes, r.temperatura_media, r.precipitacao,
     r.vento_medio, r.vento_maximo, r.pressao, r.umidade, r.latitude, r.longitude, r.altitude, r.situacao]
      .map(v => typeof v === "string" && v.includes(",") ? `"${v}"` : v)
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export function exportFilteredRecords(records: WeatherRecord[]) {
  const csv = recordsToCsv(records);
  const date = new Date().toISOString().slice(0, 10);
  downloadCsv(`dados_meteorologicos_${date}.csv`, csv);
}
