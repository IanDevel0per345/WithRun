/** Apps the user will be able to connect (OAuth integrations are coming soon). */
export type AppCategory =
  | "email"
  | "files"
  | "communication"
  | "development"
  | "productivity"

export const APP_CATEGORIES: { id: AppCategory | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "email", label: "E-mail e agenda" },
  { id: "files", label: "Arquivos" },
  { id: "communication", label: "Comunicação" },
  { id: "development", label: "Desenvolvimento" },
  { id: "productivity", label: "Produtividade" },
]

export type AppDef = {
  id: string
  name: string
  category: AppCategory
  color: string
  description: string
  abilities: string[]
  permissions: string[]
}

export const APP_CATALOG: AppDef[] = [
  {
    id: "gmail",
    name: "Gmail",
    category: "email",
    color: "#EA4335",
    description: "Leia, busque e rascunhe e-mails com a ajuda da IA.",
    abilities: ["Resumir sua caixa de entrada", "Buscar mensagens por assunto ou pessoa", "Rascunhar respostas para você revisar"],
    permissions: ["Ler e-mails", "Criar rascunhos (nunca envia sem você aprovar)"],
  },
  {
    id: "google-calendar",
    name: "Google Agenda",
    category: "email",
    color: "#4285F4",
    description: "Veja sua agenda e deixe a IA organizar os compromissos.",
    abilities: ["Mostrar o que você tem hoje e esta semana", "Sugerir horários livres", "Criar eventos a partir da conversa"],
    permissions: ["Ler eventos", "Criar e editar eventos"],
  },
  {
    id: "outlook",
    name: "Outlook",
    category: "email",
    color: "#0078D4",
    description: "E-mails e calendário do Microsoft 365.",
    abilities: ["Resumir e buscar e-mails", "Consultar o calendário"],
    permissions: ["Ler e-mails", "Ler eventos"],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    category: "files",
    color: "#0F9D58",
    description: "Converse com seus documentos, planilhas e apresentações.",
    abilities: ["Buscar arquivos pelo nome ou conteúdo", "Resumir documentos longos", "Responder perguntas sobre planilhas"],
    permissions: ["Ler arquivos"],
  },
  {
    id: "dropbox",
    name: "Dropbox",
    category: "files",
    color: "#0061FF",
    description: "Acesse arquivos guardados no Dropbox.",
    abilities: ["Buscar arquivos", "Resumir documentos"],
    permissions: ["Ler arquivos"],
  },
  {
    id: "slack",
    name: "Slack",
    category: "communication",
    color: "#611F69",
    description: "Resuma canais e encontre conversas antigas.",
    abilities: ["Resumir um canal ou thread", "Buscar mensagens", "Rascunhar respostas"],
    permissions: ["Ler canais escolhidos", "Enviar mensagens (com sua aprovação)"],
  },
  {
    id: "discord",
    name: "Discord",
    category: "communication",
    color: "#5865F2",
    description: "Acompanhe servidores e comunidades.",
    abilities: ["Resumir canais", "Buscar mensagens"],
    permissions: ["Ler canais escolhidos"],
  },
  {
    id: "github",
    name: "GitHub",
    category: "development",
    color: "#24292F",
    description: "Repositórios, issues e pull requests ao alcance da IA.",
    abilities: ["Explicar um repositório", "Resumir issues e pull requests", "Sugerir correções em código"],
    permissions: ["Ler repositórios escolhidos", "Ler issues e pull requests"],
  },
  {
    id: "linear",
    name: "Linear",
    category: "development",
    color: "#5E6AD2",
    description: "Acompanhe tarefas e ciclos do seu time.",
    abilities: ["Listar suas tarefas", "Criar tarefas a partir da conversa"],
    permissions: ["Ler tarefas", "Criar tarefas"],
  },
  {
    id: "figma",
    name: "Figma",
    category: "development",
    color: "#F24E1E",
    description: "Leia telas e componentes de design.",
    abilities: ["Descrever uma tela", "Gerar código a partir de um design"],
    permissions: ["Ler arquivos escolhidos"],
  },
  {
    id: "notion",
    name: "Notion",
    category: "productivity",
    color: "#111111",
    description: "Consulte e organize suas páginas e bases de dados.",
    abilities: ["Buscar páginas", "Resumir notas", "Criar páginas a partir da conversa"],
    permissions: ["Ler páginas escolhidas", "Criar páginas"],
  },
  {
    id: "google-sheets",
    name: "Google Planilhas",
    category: "productivity",
    color: "#188038",
    description: "Analise e atualize planilhas conversando.",
    abilities: ["Explicar fórmulas e dados", "Preencher e atualizar células"],
    permissions: ["Ler planilhas", "Editar planilhas escolhidas"],
  },
]
