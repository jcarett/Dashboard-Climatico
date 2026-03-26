import { useState, useMemo, useEffect } from "react";
import { Download, GitCompareArrows, Loader2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { StatCards } from "@/components/dashboard/StatCards";
import { CsvUpload } from "@/components/dashboard/CsvUpload";
import { DisasterAlerts } from "@/components/dashboard/DisasterAlerts";
import { ExtremeEvents } from "@/components/dashboard/ExtremeEvents";
import { PluvialidadeChart, WindChart, RiskIndexChart, StatAnalysisChart } from "@/components/dashboard/Charts";
import { PressureAltitudeChart } from "@/components/dashboard/PressureAltitudeChart";
import { TempHeatmap } from "@/components/dashboard/TempHeatmap";
import { WeatherMap } from "@/components/dashboard/WeatherMap";
import { StationComparison } from "@/components/dashboard/StationComparison";
import { useWeatherRecords, useStations } from "@/hooks/useWeatherData";
import { exportFilteredRecords } from "@/lib/csvExport";

const Index = () => {
  const [estacao, setEstacao] = useState("todas");
  const [ano, setAno] = useState("todos");
  const [mes, setMes] = useState("todos");
  const [situacao, setSituacao] = useState("todas");
  const [compareOpen, setCompareOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const { data: allRecords = [], isLoading: loadingRecords } = useWeatherRecords();
  const { data: stations = [], isLoading: loadingStations } = useStations();

  const filtered = useMemo(() => {
    return allRecords.filter(r => {
      if (estacao !== "todas" && r.estacao !== estacao) return false;
      if (ano !== "todos" && r.ano !== Number(ano)) return false;
      if (mes !== "todos" && r.mes !== Number(mes)) return false;
      if (situacao !== "todas" && r.situacao !== situacao) return false;
      return true;
    });
  }, [estacao, ano, mes, situacao, allRecords]);

  const stats = useMemo(() => {
    if (filtered.length === 0) return { temp: 0, precip: 0, vento: 0, pressao: 0 };
    return {
      temp: filtered.reduce((s, r) => s + r.temperatura_media, 0) / filtered.length,
      precip: filtered.reduce((s, r) => s + r.precipitacao, 0),
      vento: filtered.reduce((s, r) => s + r.vento_medio, 0) / filtered.length,
      pressao: filtered.reduce((s, r) => s + r.pressao, 0) / filtered.length,
    };
  }, [filtered]);

  const isLoading = loadingRecords || loadingStations;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando dados meteorológicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Dashboard Meteorológico</h1>
            <p className="text-muted-foreground mt-1">Análise interativa de dados climáticos</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => setDark(d => !d)} className="shrink-0">
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>

        <FilterBar
          estacao={estacao} setEstacao={setEstacao}
          ano={ano} setAno={setAno}
          mes={mes} setMes={setMes}
          situacao={situacao} setSituacao={setSituacao}
          stations={stations}
        />

        <div className="mt-6">
          <StatCards
            tempMedia={stats.temp}
            precipTotal={stats.precip}
            ventoMedio={stats.vento}
            pressaoMedia={stats.pressao}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <Button className="gap-2" onClick={() => exportFilteredRecords(filtered)}>
            <Download className="w-4 h-4" />
            Exportar CSV ({filtered.length} registros)
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setCompareOpen(true)}>
            <GitCompareArrows className="w-4 h-4" />
            Comparar Estações
          </Button>
        </div>

        <StationComparison
          open={compareOpen}
          onOpenChange={setCompareOpen}
          stations={stations}
          records={allRecords}
        />

        <div className="mt-8">
          <CsvUpload />
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-foreground mb-5">Predição de Desastres Climáticos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DisasterAlerts />
            <RiskIndexChart records={filtered} />
          </div>
        </div>

        <div className="mt-6">
          <WeatherMap
            title="Mapa de Calor - Risco de Desastres"
            description="Mapa de calor mostra intensidade de risco combinado. Áreas vermelhas = risco crítico."
            type="risk"
            stations={stations}
          />
        </div>

        <div className="mt-6">
          <ExtremeEvents />
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-foreground mb-5">Análises Meteorológicas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PluvialidadeChart records={filtered} />
            <WindChart records={filtered} />
          </div>
        </div>

        <div className="mt-6">
          <TempHeatmap records={filtered} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <PressureAltitudeChart stations={stations} records={filtered} />
          <StatAnalysisChart records={filtered} />
        </div>

        <div className="mt-6">
          <WeatherMap
            title="Mapa de Calor - Temperatura por Região"
            description="Mapa de calor mostra densidade térmica. Áreas vermelhas = temperatura mais alta."
            type="temperature"
            stations={stations}
          />
        </div>

        <div className="mt-6">
          <WeatherMap
            title="Mapa Topográfico de Calor"
            description="Mapa de calor topográfico com relevo real. Camadas podem ser alternadas independentemente."
            type="topographic"
            stations={stations}
          />
        </div>

        <div className="mt-10 py-6 border-t border-border text-center text-sm text-muted-foreground">
          Total de {filtered.length} registros | {new Set(allRecords.map(r => r.estacao)).size} estações ativas
        </div>
      </div>
    </div>
  );
};

export default Index;
