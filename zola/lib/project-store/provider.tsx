"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

/** A project works like a repository: a named place to organize and work. */
export type Project = {
  id: string
  name: string
  /** Optional guidance the AI follows whenever you work in this project. */
  instructions: string
  createdAt: number
}

const PROJECTS_KEY = "meteor-projects"
const ACTIVE_KEY = "meteor-active-project"
const CHATS_KEY = "meteor-chat-projects"

export const PROJECT_NAME_MAX = 60
export const PROJECT_INSTRUCTIONS_MAX = 2000

type ProjectContextType = {
  projects: Project[]
  loaded: boolean
  activeId: string | null
  activeProject: Project | null
  setActive: (id: string | null) => void
  add: (name: string, instructions?: string) => Project | null
  update: (id: string, patch: Partial<Pick<Project, "name" | "instructions">>) => void
  remove: (id: string) => void
  /** chatId -> projectId */
  chatProjects: Record<string, string>
  tagChat: (chatId: string, projectId: string) => void
}

const ProjectContext = createContext<ProjectContextType | null>(null)

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [chatProjects, setChatProjects] = useState<Record<string, string>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const list = read<Project[]>(PROJECTS_KEY, [])
    const active = read<string | null>(ACTIVE_KEY, null)
    setProjects(Array.isArray(list) ? list : [])
    setActiveId(active && list.some((p) => p.id === active) ? active : null)
    setChatProjects(read<Record<string, string>>(CHATS_KEY, {}))
    setLoaded(true)
  }, [])

  const persistProjects = useCallback((next: Project[]) => {
    setProjects(next)
    write(PROJECTS_KEY, next)
  }, [])

  const setActive = useCallback((id: string | null) => {
    setActiveId(id)
    write(ACTIVE_KEY, id)
  }, [])

  const add = useCallback(
    (name: string, instructions = "") => {
      const clean = name.trim().slice(0, PROJECT_NAME_MAX)
      if (!clean) return null
      const project: Project = {
        id: crypto.randomUUID(),
        name: clean,
        instructions: instructions.trim().slice(0, PROJECT_INSTRUCTIONS_MAX),
        createdAt: Date.now(),
      }
      persistProjects([project, ...projects])
      return project
    },
    [projects, persistProjects]
  )

  const update = useCallback<ProjectContextType["update"]>(
    (id, patch) => {
      persistProjects(
        projects.map((p) =>
          p.id === id
            ? {
                ...p,
                name:
                  patch.name !== undefined
                    ? patch.name.trim().slice(0, PROJECT_NAME_MAX) || p.name
                    : p.name,
                instructions:
                  patch.instructions !== undefined
                    ? patch.instructions.trim().slice(0, PROJECT_INSTRUCTIONS_MAX)
                    : p.instructions,
              }
            : p
        )
      )
    },
    [projects, persistProjects]
  )

  const remove = useCallback(
    (id: string) => {
      persistProjects(projects.filter((p) => p.id !== id))
      if (activeId === id) setActive(null)
      const nextMap = Object.fromEntries(
        Object.entries(chatProjects).filter(([, pid]) => pid !== id)
      )
      setChatProjects(nextMap)
      write(CHATS_KEY, nextMap)
    },
    [projects, persistProjects, activeId, setActive, chatProjects]
  )

  const tagChat = useCallback((chatId: string, projectId: string) => {
    setChatProjects((prev) => {
      if (prev[chatId] === projectId) return prev
      const next = { ...prev, [chatId]: projectId }
      write(CHATS_KEY, next)
      return next
    })
  }, [])

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeId) ?? null,
    [projects, activeId]
  )

  const value = useMemo(
    () => ({
      projects,
      loaded,
      activeId,
      activeProject,
      setActive,
      add,
      update,
      remove,
      chatProjects,
      tagChat,
    }),
    [projects, loaded, activeId, activeProject, setActive, add, update, remove, chatProjects, tagChat]
  )

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProjects() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error("useProjects must be used within ProjectProvider")
  return ctx
}

/** Text added to the system prompt while a project is selected. */
export function buildProjectBlock(project: Project | null): string {
  if (!project) return ""
  const lines = [
    `## Projeto atual: ${project.name}`,
    `O usuário está trabalhando dentro do projeto "${project.name}". Trate esta conversa como parte desse projeto e mantenha o contexto dele.`,
  ]
  if (project.instructions) {
    lines.push(`Instruções do projeto:\n${project.instructions}`)
  }
  return lines.join("\n")
}
