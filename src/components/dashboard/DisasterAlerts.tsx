import { AlertTriangle, Clock } from "lucide-react";
import { useDisasterAlerts } from "@/hooks/useWeatherData";
import { motion } from "framer-motion";

const nivelColors: Record<string, string> = {
  "CRÍTICO": "bg-meteo-critical text-primary-foreground",
  "ALTO": "bg-meteo-warning text-foreground",
  "MODERADO": "bg-meteo-moderate text-foreground",
};

const nivelBorders: Record<string, string> = {
  "CRÍTICO": "border-l-meteo-critical",
  "ALTO": "border-l-meteo-warning",
  "MODERADO": "border-l-meteo-moderate",
};

export function DisasterAlerts() {
  const { data: alerts = [] } = useDisasterAlerts();

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-meteo-critical" />
        <h3 className="font-semibold text-foreground">Alertas de Desastres Climáticos</h3>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`p-4 rounded-lg border-l-4 bg-secondary/30 ${nivelBorders[alert.nivel] || ""}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground text-sm">{alert.estacao}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${nivelColors[alert.nivel] || ""}`}>
                    {alert.nivel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{alert.estado}</p>
                <p className="text-sm text-foreground mt-1">{alert.descricao}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-sm text-muted-foreground">
        <span>{alerts.length} alertas ativos</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Última atualização: agora</span>
      </div>
    </div>
  );
}
