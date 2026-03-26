import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { WeatherStation } from "@/hooks/useWeatherData";

interface WeatherMapProps {
  title: string;
  description: string;
  type: "risk" | "temperature" | "topographic";
  stations: WeatherStation[];
}

const riskLegend = [
  { label: "Mínimo (<20)", color: "#22c55e" },
  { label: "Baixo (20-40)", color: "#84cc16" },
  { label: "Moderado (40-60)", color: "#eab308" },
  { label: "Alto (60-80)", color: "#f97316" },
  { label: "Muito Alto (80-90)", color: "#ef4444" },
  { label: "Crítico (>90)", color: "#991b1b" },
];

const tempLegend = [
  { label: "Frio", color: "#3b82f6" },
  { label: "Fresco", color: "#22d3ee" },
  { label: "Moderado", color: "#22c55e" },
  { label: "Quente", color: "#f59e0b" },
  { label: "Muito Quente", color: "#ef4444" },
  { label: "Extremo", color: "#991b1b" },
];

export function WeatherMap({ title, description, type, stations }: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([-15.5, -48.0], 5);
    mapInstance.current = map;

    const tileUrl = type === "topographic"
      ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png";

    L.tileLayer(tileUrl, {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    stations.forEach(station => {
      const risk = Math.random() * 100;
      const color = risk > 80 ? "#ef4444" : risk > 60 ? "#f97316" : risk > 40 ? "#eab308" : "#22c55e";
      
      L.circleMarker([station.latitude, station.longitude], {
        radius: 10,
        fillColor: color,
        color: "#fff",
        weight: 2,
        fillOpacity: 0.8,
      })
        .bindPopup(`<b>${station.nome}</b><br/>${station.estado}<br/>Alt: ${station.altitude}m`)
        .addTo(map);
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [type, stations]);

  const legend = type === "temperature" ? tempLegend : riskLegend;

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <div className="flex flex-wrap gap-3 mb-3">
        {legend.map(l => (
          <span key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
      <div ref={mapRef} className="h-[350px] rounded-lg overflow-hidden border border-border" />
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
