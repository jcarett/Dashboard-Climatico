import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WeatherStation } from "@/hooks/useWeatherData";

interface FilterBarProps {
  estacao: string;
  setEstacao: (v: string) => void;
  ano: string;
  setAno: (v: string) => void;
  mes: string;
  setMes: (v: string) => void;
  situacao: string;
  setSituacao: (v: string) => void;
  stations: WeatherStation[];
}

const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export function FilterBar({ estacao, setEstacao, ano, setAno, mes, setMes, situacao, setSituacao, stations = [] }: FilterBarProps) {
  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-foreground">Filtros Globais</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Estação</label>
          <Select value={estacao} onValueChange={setEstacao}>
            <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {stations.map(s => <SelectItem key={s.id} value={s.nome}>{s.nome}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Ano</label>
          <Select value={ano} onValueChange={setAno}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Mês</label>
          <Select value={mes} onValueChange={setMes}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {meses.map((m, i) => <SelectItem key={i} value={String(i+1)}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Situação</label>
          <Select value={situacao} onValueChange={setSituacao}>
            <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="Operante">Operante</SelectItem>
              <SelectItem value="Manutenção">Manutenção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
