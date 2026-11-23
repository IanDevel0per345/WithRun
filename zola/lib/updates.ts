export type UpdateEntry = {
  id: string
  date: string
  tag: "Novo" | "Melhoria"
  title: string
  description: string
}

/** Newest first. The first id drives the "unread" dot on the news button. */
export const UPDATES: UpdateEntry[] = [
  {
    id: "2026-11-23-logos",
    date: "23 nov 2026",
    tag: "Melhoria",
    title: "Logos oficiais em Conexões",
    description:
      "Cada app agora aparece com o logo oficial, num fundo limpo que acompanha o tema claro e escuro.",
  },
  {
    id: "2026-11-23-home",
    date: "23 nov 2026",
    tag: "Novo",
    title: "Nova seção Home",
    description:
      "Projetos, Meu ambiente, Agendamentos e Conexões reunidos num só lugar. A New Conversation ganhou destaque no topo.",
  },
  {
    id: "2026-11-22-agendamentos",
    date: "22 nov 2026",
    tag: "Novo",
    title: "Agendamentos com a IA",
    description:
      "Peça uma tarefa recorrente na conversa e a IA propõe um agendamento. No horário marcado, ela começa sozinha.",
  },
  {
    id: "2026-11-22-ambiente",
    date: "22 nov 2026",
    tag: "Novo",
    title: "Meu ambiente",
    description:
      "As páginas e sites em HTML que a IA cria ficam guardados e podem ser abertos, editados e baixados.",
  },
  {
    id: "2026-11-21-skills",
    date: "21 nov 2026",
    tag: "Novo",
    title: "Skills, habilidades e memória",
    description:
      "Ensine a IA a trabalhar do seu jeito: ative skills, escolha o que ela pode fazer e guarde o que ela deve lembrar.",
  },
  {
    id: "2026-11-20-modos",
    date: "20 nov 2026",
    tag: "Melhoria",
    title: "Modo chat e Modo code",
    description:
      "Troque o modo direto na barra lateral e receba frases de boas-vindas pensadas para cada um.",
  },
]
