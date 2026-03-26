import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area } from "recharts";
import { computePluvialidadeData, computeWindData, computeStatAnalysisData, computeRiskData, type WeatherRecord } from "@/hooks/useWeatherData";

interface RecordsProps {
  records: WeatherRecord[];
}

export function PluvialidadeChart({ records }: RecordsProps) {
  const data = computePluvialidadeData(records);
  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
      <h3 className="font-semibold text-foreground mb-4">Pluvialidade Mensal</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} unit="mm" />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
          <Bar dataKey="precipitacao" fill="hsl(var(--meteo-rain))" radius={[4, 4, 0, 0]} name="Precipitação (mm)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WindChart({ records }: RecordsProps) {
  const data = computeWindData(records);
  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
      <h3 className="font-semibold text-foreground mb-4">Comparativo de Vento</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} unit=" m/s" />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
          <Legend />
          <Line type="monotone" dataKey="velocidadeMaxima" stroke="hsl(var(--meteo-critical))" strokeWidth={2} name="Vel. Máxima" dot={{ r: 3 }} />
          <Line type="monotone" dataKey="velocidadeMedia" stroke="hsl(var(--meteo-wind))" strokeWidth={2} name="Vel. Média" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskIndexChart({ records }: RecordsProps) {
  const data = useMemo(() => computeRiskData(records), [records]);

  const currentMonth = new Date().getMonth(); // 0-indexed
  const currentRisk = data[currentMonth]?.risco ?? 0;
  const riskLabel = currentRisk >= 70 ? "CRÍTICO" : currentRisk >= 50 ? "ALTO" : currentRisk >= 30 ? "MODERADO" : "BAIXO";
  const riskColor = currentRisk >= 70 ? "text-meteo-critical" : currentRisk >= 50 ? "text-meteo-warning" : currentRisk >= 30 ? "text-meteo-moderate" : "text-meteo-success";
  const riskBg = currentRisk >= 70 ? "bg-meteo-critical/20 text-meteo-critical" : currentRisk >= 50 ? "bg-meteo-warning/20 text-meteo-warning" : currentRisk >= 30 ? "bg-meteo-moderate/20 text-meteo-moderate" : "bg-meteo-success/20 text-meteo-success";

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
      <h3 className="font-semibold text-foreground mb-2">Índice de Risco Composto</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Risco Atual</p>
          <p className={`text-2xl font-bold ${riskColor}`}>{currentRisk}%</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${riskBg}`}>{riskLabel}</span>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-secondary rounded">Enchentes</span>
          <span className="px-2 py-1 bg-secondary rounded">Seca</span>
          <span className="px-2 py-1 bg-secondary rounded">Tempestades</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} unit="%" domain={[0, 100]} />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
            formatter={(value: number, name: string) => [`${value}%`, name]}
          />
          <Legend />
          <defs>
            <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--meteo-critical))" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(var(--meteo-critical))" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="risco" stroke="hsl(var(--meteo-critical))" fill="url(#riskGrad)" strokeWidth={2} name="Risco Composto" />
          <Line type="monotone" dataKey="enchente" stroke="hsl(var(--meteo-rain))" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Enchente" />
          <Line type="monotone" dataKey="tempestade" stroke="hsl(var(--meteo-wind))" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Tempestade" />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground mt-2">
        Índice composto: precipitação (40%) + ventos (30%) + anomalia térmica (30%). Calculado com dados reais.
      </p>
    </div>
  );
}

export function StatAnalysisChart({ records }: RecordsProps) {
  const data = computeStatAnalysisData(records);
  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
      <h3 className="font-semibold text-foreground mb-4">Análise Estatística de Temperatura</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} unit="°C" />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
          <Legend />
          <Line type="monotone" dataKey="max" stroke="hsl(var(--meteo-critical))" strokeWidth={1.5} name="Máx" dot={false} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="q3" stroke="hsl(var(--meteo-warning))" strokeWidth={1.5} name="Q3" dot={false} />
          <Line type="monotone" dataKey="mediana" stroke="hsl(var(--meteo-temp))" strokeWidth={2.5} name="Mediana" dot={{ r: 3 }} />
          <Line type="monotone" dataKey="q1" stroke="hsl(var(--meteo-rain))" strokeWidth={1.5} name="Q1" dot={false} />
          <Line type="monotone" dataKey="min" stroke="hsl(var(--primary))" strokeWidth={1.5} name="Mín" dot={false} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground mt-2">Mediana de temperatura por mês. Hover para ver estatísticas completas.</p>
    </div>
  );
}
