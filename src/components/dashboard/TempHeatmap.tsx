import { useMemo } from "react";
import { computeTempHeatmapData, type WeatherRecord } from "@/hooks/useWeatherData";

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function getTempColor(temp: number | null): string {
  if (temp === null || temp === undefined) return "bg-muted/30";
  if (temp < 18) return "bg-blue-200 text-blue-900";
  if (temp < 22) return "bg-emerald-200 text-emerald-900";
  if (temp < 25) return "bg-yellow-200 text-yellow-900";
  if (temp < 28) return "bg-orange-200 text-orange-900";
  return "bg-red-300 text-red-900";
}

interface TempHeatmapProps {
  records: WeatherRecord[];
}

export function TempHeatmap({ records }: TempHeatmapProps) {
  const tempDataMap = useMemo(() => computeTempHeatmapData(records), [records]);
  const stationNames = useMemo(() => Object.keys(tempDataMap), [tempDataMap]);

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
      <h3 className="font-semibold text-foreground mb-4">Temperatura Média (Heatmap)</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium sticky left-0 bg-card z-10"></th>
              {monthNames.map(m => (
                <th key={m} className="py-2 px-2 text-center text-muted-foreground font-medium text-xs">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stationNames.map(name => (
              <tr key={name} className="border-t border-border">
                <td className="py-2 px-3 font-medium text-foreground text-xs whitespace-nowrap sticky left-0 bg-card z-10">{name}</td>
                {(tempDataMap[name] || []).map((temp, i) => (
                  <td key={i} className="py-1 px-1 text-center">
                    <span className={`inline-block w-full py-1.5 px-1 rounded text-xs font-mono font-medium ${getTempColor(temp)}`}>
                      {temp !== null && temp !== undefined ? temp.toFixed(1) : "-"}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-200" /> &lt;18°C</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-200" /> 18-22°C</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-200" /> 22-25°C</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-200" /> 25-28°C</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-300" /> &gt;28°C</span>
      </div>
    </div>
  );
}
