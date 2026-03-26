import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CsvRecord {
  estacao: string;
  estado: string;
  ano: number;
  mes: number;
  temperatura_media: number;
  precipitacao: number;
  vento_medio: number;
  vento_maximo: number;
  pressao: number;
  umidade: number;
  latitude: number;
  longitude: number;
  altitude: number;
  situacao: string;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if ((char === "," || char === ";") && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeStation(name: string): string {
  return name.toUpperCase().trim();
}

function normalizeSituacao(s: string): string {
  const lower = s.toLowerCase().trim();
  if (lower === "operante" || lower === "ativa" || lower === "ok") return "Operante";
  return "Manutenção";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) {
      return new Response(JSON.stringify({ error: "CSV must have header + data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());
    const records: CsvRecord[] = [];

    const colMap: Record<string, string[]> = {
      estacao: ["estacao", "estação", "station", "nome"],
      estado: ["estado", "state", "uf"],
      ano: ["ano", "year"],
      mes: ["mes", "mês", "month"],
      temperatura_media: ["temperatura_media", "temperatura_média", "temp_media", "temp", "temperatura"],
      precipitacao: ["precipitacao", "precipitação", "precip", "chuva"],
      vento_medio: ["vento_medio", "vento_médio", "vento", "wind"],
      vento_maximo: ["vento_maximo", "vento_máximo", "vento_max", "rajada"],
      pressao: ["pressao", "pressão", "pressure"],
      umidade: ["umidade", "humidity", "umid"],
      latitude: ["latitude", "lat"],
      longitude: ["longitude", "lon", "lng", "long"],
      altitude: ["altitude", "alt"],
      situacao: ["situacao", "situação", "status"],
    };

    function findCol(field: string): number {
      const aliases = colMap[field] || [field];
      for (const alias of aliases) {
        const idx = headers.indexOf(alias);
        if (idx !== -1) return idx;
      }
      return -1;
    }

    for (let i = 1; i < lines.length; i++) {
      const vals = parseCsvLine(lines[i]);
      if (vals.length < 3) continue;

      const get = (field: string): string => {
        const idx = findCol(field);
        return idx >= 0 && idx < vals.length ? vals[idx] : "";
      };

      const estacao = normalizeStation(get("estacao"));
      if (!estacao) continue;

      records.push({
        estacao,
        estado: get("estado") || "Desconhecido",
        ano: parseInt(get("ano")) || new Date().getFullYear(),
        mes: parseInt(get("mes")) || 1,
        temperatura_media: parseFloat(get("temperatura_media")) || 0,
        precipitacao: parseFloat(get("precipitacao")) || 0,
        vento_medio: parseFloat(get("vento_medio")) || 0,
        vento_maximo: parseFloat(get("vento_maximo")) || 0,
        pressao: parseFloat(get("pressao")) || 0,
        umidade: parseFloat(get("umidade")) || 0,
        latitude: parseFloat(get("latitude")) || 0,
        longitude: parseFloat(get("longitude")) || 0,
        altitude: parseFloat(get("altitude")) || 0,
        situacao: normalizeSituacao(get("situacao") || "Operante"),
      });
    }

    if (records.length === 0) {
      return new Response(JSON.stringify({ error: "No valid records found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert records in batches
    const batchSize = 100;
    let inserted = 0;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const { error } = await supabase.from("weather_records").insert(batch);
      if (error) {
        console.error("Insert error:", error);
        return new Response(JSON.stringify({ error: `Insert failed: ${error.message}` }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      inserted += batch.length;
    }

    // Log upload
    const fileSize = file.size < 1024
      ? `${file.size} B`
      : `${(file.size / 1024).toFixed(1)} KB`;

    await supabase.from("upload_history").insert({
      nome: file.name,
      tamanho: fileSize,
      registros: inserted,
      data: new Date().toLocaleString("pt-BR"),
    });

    return new Response(
      JSON.stringify({ success: true, inserted, fileName: file.name }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing CSV:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
