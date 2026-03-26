import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";
import { useMemo } from "react";
import { computePressureAltitudeData, type WeatherStation, type WeatherRecord } from "@/hooks/useWeatherData";

interface Props {
  stations: WeatherStation[];
  records: WeatherRecord[];
}

export function PressureAltitudeChart({ stations, records }: Props) {
  const data = useMemo(() => computePressureAltitudeData(stations, records), [stations, records]);

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
      <h3 className="font-semibold text-foreground mb-4">Pressão × Altitude × Temperatura</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="altitude"
            name="Altitude"
            unit="m"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            label={{ value: "Altitude (m)", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            dataKey="pressao"
            name="Pressão"
            unit="mB"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            label={{ value: "Pressão (mB)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
          />
          <ZAxis dataKey="temperatura" range={[80, 400]} name="Temperatura" unit="°C" />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
            formatter={(value: number, name: string) => [value.toFixed(1), name]}
          />
          <Scatter data={data} fill="hsl(var(--meteo-pressure))" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
