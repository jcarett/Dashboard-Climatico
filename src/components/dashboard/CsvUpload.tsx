import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle2, Download, Clock, Loader2 } from "lucide-react";
import { useUploadHistory, useWeatherRecords } from "@/hooks/useWeatherData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { recordsToCsv, downloadCsv } from "@/lib/csvExport";

export function CsvUpload() {
  const { data: allRecords = [] } = useWeatherRecords();
  const { data: uploadHistory = [] } = useUploadHistory();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const queryClient = useQueryClient();

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.name.endsWith(".csv")) {
          toast.error(`${file.name} não é um arquivo CSV`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const { data, error } = await supabase.functions.invoke("process-csv", {
          body: formData,
        });

        if (error) {
          toast.error(`Erro ao processar ${file.name}: ${error.message}`);
        } else {
          toast.success(`${file.name}: ${data.inserted} registros inseridos`);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["weather_records"] });
      queryClient.invalidateQueries({ queryKey: ["upload_history"] });
    } catch (err) {
      toast.error("Erro inesperado no upload");
      console.error(err);
    } finally {
      setUploading(false);
    }
  }, [queryClient]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  }, [handleUpload]);

  const handleClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.multiple = true;
    input.onchange = () => handleUpload(input.files);
    input.click();
  }, [handleUpload]);

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Upload de Dados CSV</h3>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {uploading ? (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-3" />
            <p className="text-foreground font-medium">Processando CSV...</p>
          </>
        ) : (
          <>
            <FileText className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-foreground font-medium">Arraste e solte seus arquivos CSV aqui</p>
            <p className="text-sm text-muted-foreground mt-1">ou clique para selecionar • Suporta múltiplos arquivos</p>
          </>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-semibold text-sm text-foreground">Histórico de Uploads</h4>
        </div>
        <div className="space-y-2">
          {uploadHistory.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-meteo-success" />
                <div>
                  <p className="font-mono text-sm text-foreground">{file.nome}</p>
                  <p className="text-xs text-muted-foreground">{file.tamanho} • {file.registros} registros • {file.data}</p>
                </div>
              </div>
              <Download
                className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => {
                  const csv = recordsToCsv(allRecords);
                  downloadCsv(file.nome, csv);
                  toast.success(`Download de ${file.nome} iniciado`);
                }}
              />
            </div>
          ))}
          {uploadHistory.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum upload realizado ainda</p>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-secondary/30 text-xs text-muted-foreground">
        <p className="font-medium text-foreground text-sm mb-1">Normalizações automáticas:</p>
        <ul className="space-y-0.5">
          <li>• Nomes de estações → MAIÚSCULAS</li>
          <li>• Status → Operante/Manutenção</li>
          <li>• Estados → nomes completos</li>
          <li>• Valores fora do range → ajustados</li>
        </ul>
      </div>
    </div>
  );
}
