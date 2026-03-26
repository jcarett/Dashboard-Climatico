export interface WeatherStation {
  id: string;
  nome: string;
  estado: string;
  latitude: number;
  longitude: number;
  altitude: number;
  situacao: "Operante" | "Manutenção";
}

export interface WeatherRecord {
  estacao: string;
  estado: string;
  ano: number;
  mes: number;
  temperaturaMedia: number;
  precipitacao: number;
  ventoMedio: number;
  ventoMaximo: number;
  pressao: number;
  umidade: number;
  latitude: number;
  longitude: number;
  altitude: number;
  situacao: "Operante" | "Manutenção";
}

export interface DisasterAlert {
  estacao: string;
  estado: string;
  nivel: "CRÍTICO" | "ALTO" | "MODERADO";
  descricao: string;
}

export interface ExtremeEvent {
  mes: number;
  ano: number;
  tipo: string;
  valor: string;
  estacao: string;
  estado: string;
}

export interface UploadedFile {
  nome: string;
  tamanho: string;
  registros: number;
  data: string;
}

export const stations: WeatherStation[] = [
  { id: "1", nome: "CATALAO", estado: "Goiás", latitude: -18.17, longitude: -47.95, altitude: 840, situacao: "Operante" },
  { id: "2", nome: "GOIANIA", estado: "Goiás", latitude: -16.67, longitude: -49.25, altitude: 741, situacao: "Operante" },
  { id: "3", nome: "BRASILIA", estado: "Distrito Federal", latitude: -15.78, longitude: -47.93, altitude: 1160, situacao: "Operante" },
  { id: "4", nome: "UBERLANDIA", estado: "Minas Gerais", latitude: -18.92, longitude: -48.25, altitude: 869, situacao: "Operante" },
  { id: "5", nome: "ARAGUAINA", estado: "Tocantins", latitude: -7.2, longitude: -48.2, altitude: 228, situacao: "Operante" },
  { id: "6", nome: "PALMAS", estado: "Tocantins", latitude: -10.19, longitude: -48.3, altitude: 280, situacao: "Operante" },
  { id: "7", nome: "SAO PAULO - INTERLAGOS", estado: "São Paulo", latitude: -23.68, longitude: -46.67, altitude: 770, situacao: "Operante" },
  { id: "8", nome: "CHAPADA DOS GUIMARAES", estado: "Mato Grosso", latitude: -15.46, longitude: -55.75, altitude: 800, situacao: "Manutenção" },
];

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Temperature data per station per month
const tempData: Record<string, number[]> = {
  "CATALAO": [21.6, 22.5, 21.5, 17.5, 17.2, 16.4, 16.8, 16.6, 16.7, 17.3, 21.7, 21.6],
  "GOIANIA": [23.8, 23.8, 22.6, 18.0, 18.1, 17.8, 18.6, 17.9, 16.9, 17.3, 22.5, 23.1],
  "BRASILIA": [20.6, 20.5, 20.4, 16.5, 16.4, 15.0, 13.9, 15.5, 15.9, 13.9, 20.9, 20.2],
  "UBERLANDIA": [22.6, 22.8, 23.2, 17.2, 16.9, 18.4, 18.1, 15.7, 17.2, 18.1, 23.2, 20.8],
  "ARAGUAINA": [25.0, 26.3, 24.8, 23.0, 20.7, 22.6, 21.5, 21.3, 21.9, 21.9, 26.8, 27.3],
  "PALMAS": [26.6, 26.4, 27.2, 20.6, 22.5, 21.7, 21.0, 20.9, 21.8, 20.3, 25.5, 27.4],
};

const precipData: Record<string, number[]> = {
  "CATALAO": [250, 210, 180, 60, 30, 20, 10, 15, 40, 120, 275, 310],
  "GOIANIA": [280, 230, 190, 14, 35, 24, 12, 18, 45, 17, 300, 361],
  "BRASILIA": [240, 200, 170, 55, 28, 18, 8, 12, 38, 110, 237, 280],
  "UBERLANDIA": [220, 190, 160, 50, 25, 28, 15, 20, 42, 100, 210, 260],
  "ARAGUAINA": [300, 260, 220, 70, 25, 24, 18, 22, 50, 130, 292, 349],
  "PALMAS": [310, 270, 230, 65, 29, 22, 14, 19, 48, 125, 299, 396],
};

const windData: Record<string, number[]> = {
  "CATALAO": [2.1, 1.9, 2.3, 2.5, 2.8, 3.1, 3.4, 3.6, 3.2, 2.7, 2.2, 2.0],
  "GOIANIA": [2.4, 2.2, 2.5, 2.8, 3.0, 3.3, 3.6, 3.8, 3.4, 2.9, 2.5, 2.3],
  "BRASILIA": [2.6, 2.4, 2.7, 3.0, 3.2, 3.5, 3.8, 4.0, 3.6, 3.1, 2.7, 2.5],
  "UBERLANDIA": [1.8, 1.6, 1.9, 2.2, 2.5, 2.8, 3.1, 3.3, 2.9, 2.4, 2.0, 1.7],
  "ARAGUAINA": [2.0, 1.8, 2.1, 2.3, 2.6, 2.9, 3.2, 3.4, 3.0, 2.5, 2.1, 1.9],
  "PALMAS": [2.3, 2.1, 2.4, 2.6, 2.9, 3.2, 3.5, 3.7, 3.3, 2.8, 2.4, 2.2],
};

export function generateRecords(): WeatherRecord[] {
  const records: WeatherRecord[] = [];
  const stationNames = Object.keys(tempData);
  
  for (const nome of stationNames) {
    const station = stations.find(s => s.nome === nome);
    if (!station) continue;
    
    for (let mes = 0; mes < 12; mes++) {
      records.push({
        estacao: nome,
        estado: station.estado,
        ano: 2026,
        mes: mes + 1,
        temperaturaMedia: tempData[nome][mes],
        precipitacao: precipData[nome][mes],
        ventoMedio: windData[nome][mes],
        ventoMaximo: windData[nome][mes] * 2.8,
        pressao: 900 + Math.random() * 80,
        umidade: 50 + Math.random() * 40,
        latitude: station.latitude,
        longitude: station.longitude,
        altitude: station.altitude,
        situacao: station.situacao,
      });
    }
  }
  return records;
}

export const allRecords = generateRecords();

export const disasterAlerts: DisasterAlert[] = [
  { estacao: "PALMAS", estado: "Tocantins", nivel: "CRÍTICO", descricao: "Risco crítico de enchentes - 396mm/mês" },
  { estacao: "GOIANIA", estado: "Goiás", nivel: "CRÍTICO", descricao: "Risco crítico de enchentes - 361mm/mês" },
  { estacao: "CATALAO", estado: "Goiás", nivel: "ALTO", descricao: "Risco alto de alagamentos - 275mm/mês" },
  { estacao: "BRASILIA", estado: "Distrito Federal", nivel: "ALTO", descricao: "Risco alto de alagamentos - 237mm/mês" },
  { estacao: "ARAGUAINA", estado: "Tocantins", nivel: "ALTO", descricao: "Risco alto de alagamentos - 292mm/mês" },
  { estacao: "UBERLANDIA", estado: "Minas Gerais", nivel: "MODERADO", descricao: "Ventos fortes detectados - 8.4 m/s" },
];

export const extremeEvents: ExtremeEvent[] = [
  { mes: 12, ano: 2026, tipo: "Chuvas extremas", valor: "396mm", estacao: "PALMAS", estado: "Tocantins" },
  { mes: 12, ano: 2026, tipo: "Chuvas extremas", valor: "361mm", estacao: "GOIANIA", estado: "Goiás" },
  { mes: 12, ano: 2026, tipo: "Chuvas extremas", valor: "349mm", estacao: "ARAGUAINA", estado: "Tocantins" },
  { mes: 12, ano: 2026, tipo: "Chuvas extremas", valor: "310mm", estacao: "CATALAO", estado: "Goiás" },
  { mes: 11, ano: 2026, tipo: "Chuvas extremas", valor: "299mm", estacao: "PALMAS", estado: "Tocantins" },
  { mes: 11, ano: 2026, tipo: "Chuvas extremas", valor: "292mm", estacao: "ARAGUAINA", estado: "Tocantins" },
  { mes: 11, ano: 2026, tipo: "Chuvas extremas", valor: "275mm", estacao: "CATALAO", estado: "Goiás" },
  { mes: 6, ano: 2026, tipo: "Precipitação muito baixa", valor: "20mm", estacao: "CATALAO", estado: "Goiás" },
  { mes: 6, ano: 2026, tipo: "Precipitação muito baixa", valor: "24mm", estacao: "GOIANIA", estado: "Goiás" },
  { mes: 6, ano: 2026, tipo: "Precipitação muito baixa", valor: "18mm", estacao: "BRASILIA", estado: "Distrito Federal" },
  { mes: 6, ano: 2026, tipo: "Precipitação muito baixa", valor: "28mm", estacao: "UBERLANDIA", estado: "Minas Gerais" },
  { mes: 6, ano: 2026, tipo: "Precipitação muito baixa", valor: "24mm", estacao: "ARAGUAINA", estado: "Tocantins" },
];

export const uploadHistory: UploadedFile[] = [
  { nome: "dados_estacoes_2026.csv", tamanho: "12.4 KB", registros: 72, data: "25/03/2026, 14:30" },
  { nome: "precipitacao_mensal.csv", tamanho: "8.2 KB", registros: 48, data: "24/03/2026, 10:15" },
  { nome: "vento_analise.csv", tamanho: "5.6 KB", registros: 36, data: "23/03/2026, 16:45" },
];

export function getMonthName(m: number) {
  return monthNames[m - 1] || "";
}

export function getPluvialidadeData() {
  const data = [];
  for (let i = 0; i < 12; i++) {
    const avg = Object.values(precipData).reduce((s, arr) => s + arr[i], 0) / Object.keys(precipData).length;
    data.push({ mes: monthNames[i], precipitacao: Math.round(avg) });
  }
  return data;
}

export function getWindData() {
  const data = [];
  for (let i = 0; i < 12; i++) {
    const avgMed = Object.values(windData).reduce((s, arr) => s + arr[i], 0) / Object.keys(windData).length;
    data.push({
      mes: monthNames[i],
      velocidadeMedia: parseFloat(avgMed.toFixed(1)),
      velocidadeMaxima: parseFloat((avgMed * 2.8).toFixed(1)),
    });
  }
  return data;
}

export function getRiskData() {
  return [
    { mes: "Abr/26", risco: 25 }, { mes: "Mai/26", risco: 20 },
    { mes: "Jun/26", risco: 15 }, { mes: "Jul/26", risco: 12 },
    { mes: "Ago/26", risco: 18 }, { mes: "Set/26", risco: 30 },
    { mes: "Out/26", risco: 40 }, { mes: "Nov/26", risco: 65 },
    { mes: "Dez/26", risco: 78 }, { mes: "Jan/27", risco: 70 },
    { mes: "Fev/27", risco: 55 }, { mes: "Mar/27", risco: 40 },
  ];
}

export function getStatAnalysisData() {
  const data = [];
  for (let i = 0; i < 12; i++) {
    const temps = Object.values(tempData).map(arr => arr[i]).sort((a, b) => a - b);
    data.push({
      mes: monthNames[i],
      min: temps[0],
      q1: temps[1],
      mediana: temps[Math.floor(temps.length / 2)],
      q3: temps[temps.length - 2],
      max: temps[temps.length - 1],
    });
  }
  return data;
}

export function getPressureAltitudeData() {
  return stations.map(s => ({
    nome: s.nome,
    altitude: s.altitude,
    pressao: 1013 - (s.altitude * 0.12) + (Math.random() * 20 - 10),
    temperatura: tempData[s.nome]?.[0] || 22,
  }));
}
