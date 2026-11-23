import type { SheetIconName } from "@/components/ui/sheet-icon"

export type Mode = "chat" | "code"

export const MODE_ORDER: Mode[] = ["chat", "code"]

export const MODES: Record<
  Mode,
  { label: string; description: string; placeholder: string }
> = {
  chat: {
    label: "Modo chat",
    description: "Converse, pesquise e crie com a IA.",
    placeholder: "Pergunte qualquer coisa...",
  },
  code: {
    label: "Modo code",
    description: "A IA para programar: escreva, explique e corrija código.",
    placeholder: "Descreva o que você quer codar...",
  },
}

export const CODE_SYSTEM_PROMPT = `You are Meteor Code, an expert senior software engineer and pair programmer.
Always reply in the same language as the user (Portuguese when unsure).
Write complete, correct and idiomatic code inside fenced markdown blocks with the language tag.
Explain the approach briefly before or after the code; keep explanations short and practical.
When debugging, find the root cause, show the fix and explain why it works.
Prefer simple, readable solutions that follow best practices; handle edge cases and errors, and mention security or performance concerns when they matter.
When the request is ambiguous, ask one focused clarifying question before writing code.
Never invent APIs or libraries; say so when you are not sure.
When changing large code, show only the changed parts unless the user asks for the full file.`

/** Same shape as SUGGESTIONS in lib/config.ts, tuned for coding. */
export const CODE_SUGGESTIONS = [
  {
    label: "Criar",
    highlight: "Crie",
    prompt: `Crie`,
    items: [
      "Crie uma função em TypeScript que valide um CPF",
      "Crie uma API REST simples com Node.js e Express",
      "Crie um componente React de botão com variantes",
      "Crie um script Python que renomeia arquivos em lote",
    ],
    icon: "code" as SheetIconName,
  },
  {
    label: "Corrigir bug",
    highlight: "Corrija",
    prompt: `Corrija o bug`,
    items: [
      "Corrija o bug: meu useEffect roda em loop infinito",
      "Corrija o erro 'undefined is not a function' no meu código",
      "Corrija esta query SQL que retorna linhas duplicadas",
      "Corrija o CORS que bloqueia minha API no navegador",
    ],
    icon: "warning" as SheetIconName,
  },
  {
    label: "Explicar",
    highlight: "Explique",
    prompt: `Explique`,
    items: [
      "Explique o que este código faz, linha por linha",
      "Explique a diferença entre promise e async/await",
      "Explique como funciona o event loop do JavaScript",
      "Explique o que é uma closure com um exemplo",
    ],
    icon: "search" as SheetIconName,
  },
  {
    label: "Refatorar",
    highlight: "Refatore",
    prompt: `Refatore`,
    items: [
      "Refatore esta função para ficar mais legível",
      "Refatore este código para remover duplicações",
      "Refatore para usar async/await no lugar de callbacks",
      "Refatore esta classe seguindo princípios SOLID",
    ],
    icon: "refresh" as SheetIconName,
  },
  {
    label: "Testes",
    highlight: "Escreva testes",
    prompt: `Escreva testes`,
    items: [
      "Escreva testes unitários em Jest para esta função",
      "Escreva testes de integração para esta rota da API",
      "Escreva casos de teste para os casos de borda",
      "Escreva testes com React Testing Library para este componente",
    ],
    icon: "flask" as SheetIconName,
  },
  {
    label: "Revisar",
    highlight: "Revise",
    prompt: `Revise`,
    items: [
      "Revise este código e aponte problemas de segurança",
      "Revise este pull request como um tech lead faria",
      "Revise o desempenho deste trecho e sugira melhorias",
      "Revise o tratamento de erros deste serviço",
    ],
    icon: "wrench" as SheetIconName,
  },
]
