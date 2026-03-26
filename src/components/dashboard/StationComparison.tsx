import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import type { WeatherStation, WeatherRecord } from "@/hooks/useWeatherData";

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const COLORS = [
  "hsl(var(--meteo-temp))",
  "hsl(var(--meteo-rain))",
  "hsl(var(--meteo-wind))",
  "hsl(var(--meteo-pressure))",
  "hsl(var(--meteo-critical))",
  "hsl(var(--meteo-warning))",
  "hsl(var(--meteo-moderate))",
  "hsl(var(--primary))",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stations: WeatherStation[];
  records: WeatherRecord[];
}

export function StationComparison({ open, onOpenChange, stations, records }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (nome: string) => {
    setSelected(prev =>
      prev.includes(nome) ? prev.filter(s => s !== nome) : prev.length < 6 ? [...prev, nome] : prev
    );
  };

  const tempData = useMemo(() => {
    if (selected.length === 0) return [];
    return Array.from({ length: 12 }, (_, i) => {
      const entry: Record<string, string | number> = { mes: monthNames[i] };
      selected.forEach(name => {
        const rec = records.find(r => r.estacao === name && r.mes === i + 1);
        entry[name] = rec?.temperatura_media ?? 0;
      });
      return entry;
    });
  }, [selected, records]);

  const precipData = useMemo(() => {
    if (selected.length === 0) return [];
    return Array.from({ length: 12 }, (_, i) => {
      const entry: Record<string, string | number> = { mes: monthNames[i] };
      selected.forEach(name => {
        const rec = records.find(r => r.estacao === name && r.mes === i + 1);
        entry[name] = rec?.precipitacao ?? 0;
      });
      return entry;
    });
  }, [selected, records]);

  const windData = useMemo(() => {
    if (selected.length === 0) return [];
    return Array.from({ length: 12 }, (_, i) => {
      const entry: Record<string, string | number> = { mes: monthNames[i] };
      selected.forEach(name => {
        const rec = records.find(r => r.estacao === name && r.mes === i + 1);
        entry[name] = rec?.vento_medio ?? 0;
      });
      return entry;
    });
  }, [selected, records]);

  const stationNames = useMemo(() => {
    const unique = new Set(records.map(r => r.estacao));
    return Array.from(unique).sort();
  }, [records]);

  const summaryData = useMemo(() => {
    return selected.map(name => {
      const recs = records.filter(r => r.estacao === name);
      if (recs.length === 0) return { name, temp: 0, precip: 0, vento: 0, pressao: 0 };
      return {
        name,
        temp: +(recs.reduce((s, r) => s + r.temperatura_media, 0) / recs.length).toFixed(1),
        precip: Math.round(recs.reduce((s, r) => s + r.precipitacao, 0)),
        vento: +(recs.reduce((s, r) => s + r.vento_medio, 0) / recs.length).toFixed(1),
        pressao: +(recs.reduce((s, r) => s + r.pressao, 0) / recs.length).toFixed(0),
      };
    });
  }, [selected, records]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Comparar Estações</DialogTitle>
        </DialogHeader>

        {/* Station selector */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Selecione até 6 estações para comparar:</p>
          <div className="flex flex-wrap gap-3">
            {stationNames.map(name => (
              <label key={name} className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox
                  checked={selected.includes(name)}
                  onCheckedChange={() => toggle(name)}
                  disabled={!selected.includes(name) && selected.length >= 6}
                />
                <span className="text-foreground">{name}</span>
              </label>
            ))}
          </div>
        </div>

        {selected.length === 0 && (
          <p className="text-center text-muted-foreground py-10">Selecione estações acima para visualizar a comparação.</p>
        )}

        {selected.length > 0 && (
          <div className="space-y-6">
            {/* Summary table */}
            <div className="rounded-lg border border-border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Estação</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Temp. Média (°C)</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Precip. Total (mm)</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Vento Médio (m/s)</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Pressão (mB)</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.map((s, i) => (
                    <tr key={s.name} className="border-t border-border">
                      <td className="p-3 font-medium text-foreground flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        {s.name}
                      </td>
                      <td className="p-3 text-right font-mono text-foreground">{s.temp}</td>
                      <td className="p-3 text-right font-mono text-foreground">{s.precip.toLocaleString("pt-BR")}</td>
                      <td className="p-3 text-right font-mono text-foreground">{s.vento}</td>
                      <td className="p-3 text-right font-mono text-foreground">{s.pressao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Temperature comparison */}
            <div className="rounded-xl bg-card p-5 border border-border">
              <h4 className="font-semibold text-foreground mb-3">Temperatura Média (°C)</h4>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={tempData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} unit="°C" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend />
                  {selected.map((name, i) => (
                    <Line key={name} type="monotone" dataKey={name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Precipitation comparison */}
            <div className="rounded-xl bg-card p-5 border border-border">
              <h4 className="font-semibold text-foreground mb-3">Precipitação (mm)</h4>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={precipData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} unit="mm" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend />
                  {selected.map((name, i) => (
                    <Bar key={name} dataKey={name} fill={COLORS[i % COLORS.length]} radius={[2, 2, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Wind comparison */}
            <div className="rounded-xl bg-card p-5 border border-border">
              <h4 className="font-semibold text-foreground mb-3">Velocidade do Vento (m/s)</h4>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={windData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} unit=" m/s" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend />
                  {selected.map((name, i) => (
                    <Line key={name} type="monotone" dataKey={name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
