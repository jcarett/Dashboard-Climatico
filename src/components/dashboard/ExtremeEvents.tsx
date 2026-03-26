import { useExtremeEvents, getMonthName } from "@/hooks/useWeatherData";

const typeColors: Record<string, string> = {
  "Chuvas extremas": "bg-meteo-rain/10 border-l-meteo-rain",
  "Precipitação muito baixa": "bg-meteo-warning/10 border-l-meteo-warning",
};

export function ExtremeEvents() {
  const { data: events = [] } = useExtremeEvents();

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
      <h3 className="font-semibold text-foreground mb-4">Histórico de Eventos Extremos</h3>
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {events.map((ev) => (
          <div key={ev.id} className={`p-3 rounded-lg border-l-4 ${typeColors[ev.tipo] || "bg-secondary/30 border-l-muted"}`}>
            <p className="text-xs text-muted-foreground font-medium">{getMonthName(ev.mes)}/{ev.ano}</p>
            <p className="text-sm text-foreground font-medium">{ev.tipo}: {ev.valor}</p>
            <p className="text-xs text-muted-foreground">{ev.estacao}, {ev.estado}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
        Total: {events.length} eventos extremos detectados
      </p>
    </div>
  );
}
