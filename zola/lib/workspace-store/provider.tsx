"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

/** An item saved in "Meu ambiente" (for now: a self-contained HTML page). */
export type WorkspaceItem = {
  id: string
  title: string
  kind: "html"
  content: string
  source: "chat" | "manual"
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = "meteor-workspace"
const MAX_ITEM_CHARS = 400_000

type WorkspaceContextType = {
  items: WorkspaceItem[]
  loaded: boolean
  add: (
    input: Pick<WorkspaceItem, "title" | "content"> &
      Partial<Pick<WorkspaceItem, "source">>
  ) => WorkspaceItem | null
  update: (id: string, patch: Partial<Pick<WorkspaceItem, "title" | "content">>) => void
  remove: (id: string) => void
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  items: [],
  loaded: false,
  add: () => null,
  update: () => {},
  remove: () => {},
})

export function titleFromHtml(html: string): string {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
  const raw = (title || h1 || "").replace(/<[^>]+>/g, "").trim()
  return raw.slice(0, 80) || "Página sem título"
}

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WorkspaceItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && i.id))
      }
    } catch {}
    setLoaded(true)
  }, [])

  const persist = useCallback((next: WorkspaceItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // storage full: keep the in-memory state anyway
    }
  }, [])

  const add: WorkspaceContextType["add"] = useCallback(
    (input) => {
      if (!input.content.trim() || input.content.length > MAX_ITEM_CHARS) {
        return null
      }
      const now = Date.now()
      const item: WorkspaceItem = {
        id: makeId(),
        title: input.title.trim() || titleFromHtml(input.content),
        kind: "html",
        content: input.content,
        source: input.source ?? "manual",
        createdAt: now,
        updatedAt: now,
      }
      setItems((prev) => {
        const next = [item, ...prev]
        persist(next)
        return next
      })
      return item
    },
    [persist]
  )

  const update: WorkspaceContextType["update"] = useCallback(
    (id, patch) => {
      setItems((prev) => {
        const next = prev.map((i) =>
          i.id === id ? { ...i, ...patch, updatedAt: Date.now() } : i
        )
        persist(next)
        return next
      })
    },
    [persist]
  )

  const remove = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id)
        persist(next)
        return next
      })
    },
    [persist]
  )

  const value = useMemo(
    () => ({ items, loaded, add, update, remove }),
    [items, loaded, add, update, remove]
  )

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  return useContext(WorkspaceContext)
}
