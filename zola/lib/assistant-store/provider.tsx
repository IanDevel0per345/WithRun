"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

/** A reusable block of instructions the user can switch on. */
export type Skill = {
  id: string
  name: string
  description: string
  instructions: string
  builtin: boolean
}

export const BUILTIN_SKILLS: Skill[] = [
  {
    id: "revisor-codigo",
    name: "Revisor de código",
    description: "Encontra bugs, falhas de segurança e melhorias de clareza.",
    instructions:
      "When code is shared, review it like a senior engineer: list findings ordered by severity (bugs, security, performance, readability), explain each briefly and show the corrected snippet.",
    builtin: true,
  },
  {
    id: "redator-emails",
    name: "Redator de e-mails",
    description: "Escreve e-mails claros, educados e com assunto sugerido.",
    instructions:
      "When asked to write an email, ask for the recipient and goal if missing, then write a clear, polite, concise email in the user's language and suggest a subject line.",
    builtin: true,
  },
  {
    id: "tutor-paciente",
    name: "Tutor paciente",
    description: "Ensina passo a passo, com analogias simples.",
    instructions:
      "Teach step by step using simple analogies and small examples. After explaining, check understanding with one short question.",
    builtin: true,
  },
  {
    id: "resumo-executivo",
    name: "Resumo executivo",
    description: "Resume textos em pontos-chave, riscos e próximos passos.",
    instructions:
      "When summarizing, use this structure: TL;DR (one line), key points, risks or open questions, and next steps.",
    builtin: true,
  },
  {
    id: "criador-planos",
    name: "Criador de planos",
    description: "Transforma objetivos em etapas, tarefas e prazos.",
    instructions:
      "Break goals into milestones, concrete tasks and realistic deadlines, presented as a short table plus the first action to take today.",
    builtin: true,
  },
  {
    id: "editor-textos",
    name: "Editor de textos",
    description: "Melhora clareza, gramática e tom sem perder a sua voz.",
    instructions:
      "Improve clarity, grammar and tone while keeping the author's voice. Return the improved text first, then a short list of the main changes.",
    builtin: true,
  },
]

export type AbilityKey =
  | "createPages"
  | "schedule"
  | "stepByStep"
  | "useProfile"
  | "honesty"

export type Abilities = Record<AbilityKey, boolean>

export const DEFAULT_ABILITIES: Abilities = {
  createPages: true,
  schedule: true,
  stepByStep: false,
  useProfile: true,
  honesty: true,
}

export type Memory = {
  id: string
  text: string
  enabled: boolean
  createdAt: number
}

type AssistantState = {
  customSkills: Skill[]
  enabledSkills: string[]
  abilities: Abilities
  memories: Memory[]
}

const DEFAULT_STATE: AssistantState = {
  customSkills: [],
  enabledSkills: [],
  abilities: DEFAULT_ABILITIES,
  memories: [],
}

const STORAGE_KEY = "meteor-assistant"
export const MEMORY_MAX = 300
export const SKILL_NAME_MAX = 40
export const SKILL_INSTRUCTIONS_MAX = 1500

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function sanitize(raw: unknown): AssistantState {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, any>
  const customSkills: Skill[] = Array.isArray(r.customSkills)
    ? r.customSkills
        .filter((s: any) => s && typeof s.id === "string" && typeof s.instructions === "string")
        .map((s: any) => ({
          id: s.id,
          name: String(s.name ?? "").slice(0, SKILL_NAME_MAX) || "Skill",
          description: String(s.description ?? "").slice(0, 120),
          instructions: s.instructions.slice(0, SKILL_INSTRUCTIONS_MAX),
          builtin: false,
        }))
    : []
  const abilities = { ...DEFAULT_ABILITIES }
  if (r.abilities && typeof r.abilities === "object") {
    for (const key of Object.keys(DEFAULT_ABILITIES) as AbilityKey[]) {
      if (typeof r.abilities[key] === "boolean") abilities[key] = r.abilities[key]
    }
  }
  const memories: Memory[] = Array.isArray(r.memories)
    ? r.memories
        .filter((m: any) => m && typeof m.id === "string" && typeof m.text === "string")
        .map((m: any) => ({
          id: m.id,
          text: m.text.slice(0, MEMORY_MAX),
          enabled: m.enabled !== false,
          createdAt: Number(m.createdAt) || Date.now(),
        }))
    : []
  return {
    customSkills,
    enabledSkills: Array.isArray(r.enabledSkills)
      ? r.enabledSkills.filter((x: unknown) => typeof x === "string")
      : [],
    abilities,
    memories,
  }
}

type AssistantContextType = AssistantState & {
  loaded: boolean
  allSkills: Skill[]
  toggleSkill: (id: string) => void
  addSkill: (input: Pick<Skill, "name" | "description" | "instructions">) => Skill
  removeSkill: (id: string) => void
  setAbility: (key: AbilityKey, value: boolean) => void
  addMemory: (text: string) => void
  toggleMemory: (id: string) => void
  removeMemory: (id: string) => void
  clearMemories: () => void
}

const AssistantContext = createContext<AssistantContextType>({
  ...DEFAULT_STATE,
  loaded: false,
  allSkills: BUILTIN_SKILLS,
  toggleSkill: () => {},
  addSkill: () => {
    throw new Error("AssistantProvider missing")
  },
  removeSkill: () => {},
  setAbility: () => {},
  addMemory: () => {},
  toggleMemory: () => {},
  removeMemory: () => {},
  clearMemories: () => {},
})

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AssistantState>(DEFAULT_STATE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setState(sanitize(JSON.parse(saved)))
    } catch {}
    setLoaded(true)
  }, [])

  const mutate = useCallback((fn: (prev: AssistantState) => AssistantState) => {
    setState((prev) => {
      const next = fn(prev)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const toggleSkill = useCallback(
    (id: string) =>
      mutate((p) => ({
        ...p,
        enabledSkills: p.enabledSkills.includes(id)
          ? p.enabledSkills.filter((s) => s !== id)
          : [...p.enabledSkills, id],
      })),
    [mutate]
  )

  const addSkill: AssistantContextType["addSkill"] = useCallback(
    (input) => {
      const skill: Skill = {
        id: makeId(),
        name: input.name.trim().slice(0, SKILL_NAME_MAX),
        description: input.description.trim().slice(0, 120),
        instructions: input.instructions.trim().slice(0, SKILL_INSTRUCTIONS_MAX),
        builtin: false,
      }
      mutate((p) => ({
        ...p,
        customSkills: [skill, ...p.customSkills],
        enabledSkills: [...p.enabledSkills, skill.id],
      }))
      return skill
    },
    [mutate]
  )

  const removeSkill = useCallback(
    (id: string) =>
      mutate((p) => ({
        ...p,
        customSkills: p.customSkills.filter((s) => s.id !== id),
        enabledSkills: p.enabledSkills.filter((s) => s !== id),
      })),
    [mutate]
  )

  const setAbility = useCallback(
    (key: AbilityKey, value: boolean) =>
      mutate((p) => ({ ...p, abilities: { ...p.abilities, [key]: value } })),
    [mutate]
  )

  const addMemory = useCallback(
    (text: string) => {
      const clean = text.trim().slice(0, MEMORY_MAX)
      if (!clean) return
      mutate((p) => ({
        ...p,
        memories: [
          { id: makeId(), text: clean, enabled: true, createdAt: Date.now() },
          ...p.memories,
        ],
      }))
    },
    [mutate]
  )

  const toggleMemory = useCallback(
    (id: string) =>
      mutate((p) => ({
        ...p,
        memories: p.memories.map((m) =>
          m.id === id ? { ...m, enabled: !m.enabled } : m
        ),
      })),
    [mutate]
  )

  const removeMemory = useCallback(
    (id: string) =>
      mutate((p) => ({ ...p, memories: p.memories.filter((m) => m.id !== id) })),
    [mutate]
  )

  const clearMemories = useCallback(
    () => mutate((p) => ({ ...p, memories: [] })),
    [mutate]
  )

  const allSkills = useMemo(
    () => [...BUILTIN_SKILLS, ...state.customSkills],
    [state.customSkills]
  )

  const value = useMemo(
    () => ({
      ...state,
      loaded,
      allSkills,
      toggleSkill,
      addSkill,
      removeSkill,
      setAbility,
      addMemory,
      toggleMemory,
      removeMemory,
      clearMemories,
    }),
    [state, loaded, allSkills, toggleSkill, addSkill, removeSkill, setAbility, addMemory, toggleMemory, removeMemory, clearMemories]
  )

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  )
}

export function useAssistant() {
  return useContext(AssistantContext)
}

/** Builds the part of the system prompt controlled by skills, abilities and memory. */
export function buildAssistantBlock(
  s: Pick<AssistantContextType, "abilities" | "allSkills" | "enabledSkills" | "memories">,
  now: Date
): string {
  const parts: string[] = []
  const a = s.abilities

  const behaviors: string[] = []
  if (a.stepByStep)
    behaviors.push(
      "Think through problems step by step before answering, then present a clear, concise answer."
    )
  if (a.honesty)
    behaviors.push(
      "If you are not sure, say so. Never invent facts, links, quotes or sources."
    )
  if (a.createPages)
    behaviors.push(
      "When the user asks you to build a web page, site, landing page, small app, game or interactive UI, answer with ONE complete, self-contained HTML document (inline CSS and JavaScript, no build step, responsive and well designed) inside a single ```html fenced block. Keep the text outside the block short; the user can save the page to their 'Meu ambiente' space."
    )
  if (a.schedule) {
    const when = now.toLocaleString("pt-BR", {
      dateStyle: "full",
      timeStyle: "short",
    })
    behaviors.push(
      `You can schedule tasks. Current local date and time: ${when}. When the user asks to do something later or repeatedly (reminders, daily summaries, recurring checks), propose a schedule by adding a fenced block whose language tag is "agendamento" containing only this JSON: {"titulo":"short name","tarefa":"the full instruction you will run when the time comes, written as a prompt","repeticao":"uma_vez|intervalo|diario|dias_uteis|semanal","hora":"HH:mm","data":"YYYY-MM-DD","dias":[0,1,2,3,4,5,6],"cada_minutos":30}. Use only the fields needed: uma_vez needs data and hora; intervalo needs cada_minutos; diario and dias_uteis need hora; semanal needs hora and dias (0 = Sunday). The user confirms with a button, so describe the schedule in plain words after the block.`
    )
  }
  if (behaviors.length) parts.push(behaviors.map((b) => `- ${b}`).join("\n"))

  const active = s.allSkills.filter((k) => s.enabledSkills.includes(k.id))
  if (active.length)
    parts.push(
      "Active skills:\n" +
        active.map((k) => `- ${k.name}: ${k.instructions}`).join("\n")
    )

  const memories = s.memories.filter((m) => m.enabled)
  if (memories.length)
    parts.push(
      "Things to remember about the user:\n" +
        memories.map((m) => `- ${m.text}`).join("\n")
    )

  return parts.join("\n\n")
}
