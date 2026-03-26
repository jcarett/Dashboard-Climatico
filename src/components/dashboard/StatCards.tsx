import { Thermometer, CloudRain, Wind, Gauge } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardsProps {
  tempMedia: number;
  precipTotal: number;
  ventoMedio: number;
  pressaoMedia: number;
}

const cards = [
  { key: "temp", label: "Temperatura Média", suffix: "°C", icon: Thermometer, color: "text-meteo-temp" },
  { key: "precip", label: "Precipitação Total", suffix: " mm", icon: CloudRain, color: "text-meteo-rain" },
  { key: "vento", label: "Vento Médio", suffix: " m/s", icon: Wind, color: "text-meteo-wind" },
  { key: "pressao", label: "Pressão Média", suffix: " mB", icon: Gauge, color: "text-meteo-pressure" },
] as const;

export function StatCards({ tempMedia, precipTotal, ventoMedio, pressaoMedia }: StatCardsProps) {
  const values = { temp: tempMedia, precip: precipTotal, vento: ventoMedio, pressao: pressaoMedia };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl bg-card p-5 shadow-sm border border-border flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="text-3xl font-bold font-mono text-foreground mt-1">
              {values[card.key].toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
              <span className="text-lg font-normal text-muted-foreground ml-1">{card.suffix}</span>
            </p>
          </div>
          <card.icon className={`w-10 h-10 ${card.color} opacity-60`} />
        </motion.div>
      ))}
    </div>
  );
}
