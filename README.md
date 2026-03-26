
# Dashboard Meteorológico (Breeze-Bites)

Um painel interativo de análise de dados climáticos. Esta aplicação permite aos usuários fazer upload de bases de dados meteorológicos via CSV, aplicar filtros avançados e visualizar métricas essenciais como temperatura, precipitação, vento e pressão em tempo real.

## 🚀 Funcionalidades

- **Upload de Dados CSV:** Área de drag-and-drop para importação rápida de arquivos de dados meteorológicos.
- **Histórico de Uploads:** Registro detalhado dos arquivos importados anteriormente.
- **Painel de Indicadores (KPIs):** Visualização imediata de Temperatura Média, Precipitação Total, Vento Médio e Pressão Média.
- **Filtros Globais Avançados:** Filtragem de dados cruzada por Estação, Ano, Mês e Situação.
- **Exportação de Dados:** Capacidade de exportar a visualização atual (registros filtrados) de volta para o formato CSV.
- **Comparação:** Ferramenta dedicada para comparar diferentes estações meteorológicas.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Vite:** Bundler ultrarrápido para o desenvolvimento da aplicação.
- **TypeScript:** Tipagem estática para maior segurança e escalabilidade do código.
- **Tailwind CSS & PostCSS:** Estilização utilitária da interface.
- **Componentes:** Estruturação de UI baseada em configuração

### Backend & Banco de Dados
- **Supabase:** Plataforma Backend-as-a-Service .
  - **Edge Functions:** Lógica de backend serverless
  - **Migrations:** Controle de versão do banco de dados 

### Ferramentas & Qualidade
- **Bun:** Gerenciador de pacotes e runtime super rápido 
- **Vitest:** Framework para testes unitários.
- **Playwright:** Framework para testes End-to-End 
- **ESLint:** Linter para manter a padronização do código.

## ⚙️ Como Executar Localmente

### Pré-requisitos
Certifique-se de ter o [Bun](https://bun.sh/) instalado na sua máquina.

### Passos de Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-seu-repositorio>
   cd BREEZE-BITES-MAIN
   ```

2. **Instale as dependências:**
   ```bash
   bun install
   ```

3. **Configure as Variáveis de Ambiente:**
   - Crie um arquivo `.env` na raiz do projeto baseado no `.env.example` 
   - Adicione as chaves necessárias do Supabase 

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   bun run dev
   ```
   A aplicação estará rodando em `http://localhost:8080` 

## 📂 Estrutura de Diretórios Principal

```text
BREEZE-BITES-MAIN/
├── public/                 # Assets públicos estáticos
├── src/                    # Código-fonte principal da aplicação React/Vite
├── supabase/
│   ├── functions/          # Edge Functions do Supabase (ex: process-csv)
│   └── migrations/         # Arquivos de migração do banco de dados SQL
├── package.json            # Scripts e dependências do projeto
├── bun.lockb               # Lockfile do Bun
├── tailwind.config.ts      # Configurações do Tailwind CSS
├── vite.config.ts          # Configurações do Vite
└── vitest.config.ts        # Configurações do Vitest
