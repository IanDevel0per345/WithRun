"use client"

import { toast } from "@/components/ui/toast"
import type { Mode } from "@/lib/modes"
import { useRouter } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { computeNextRun, type Recurrence } from "./recurrence"

export type Schedule = {
  id: string
  title: string
  prompt: string
  recurrence: Recurrence
  mode: Mode
  enabled: boolean
  source: "manual" | "chat"
  createdAt: number
  lastRunAt: number | null
  nextRunAt: number | null
  runs: number
}

export type ScheduleInput = Pick<Schedule, "title" | "prompt" | "recurrence"> &
  Partial<Pick<Schedule, "mode" | "source">>

const STORAGE_KEY = "meteor-schedules"
const AUTO_KEY = "meteor-schedules-auto-open"
export const PENDING_RUN_KEY = "meteor-pending-run"
export const PENDING_RUN_EVENT = "meteor:pending-run"
const TICK_MS = 10_000

export type PendingRun = {
  scheduleId: string
  title: string
  prompt: string
  mode: Mode
  createdAt: number
}

/** Reads and clears the run waiting for a new chat to start it. */
export function takePendingRun(): PendingRun | null {
  try {
    const raw = localStorage.getItem(PENDING_RUN_KEY)
    if (!raw) return null
    localStorage.removeItem(PENDING_RUN_KEY)
    const run = JSON.parse(raw) as PendingRun
    // ignore stale runs (older than 10 minutes)
    if (!run?.prompt || Date.now() - run.createdAt > 10 * 60_000) return null
    return run
  } catch {
    return null
  }
}

function queueRun(s: Schedule) {
  const run: PendingRun = {
    scheduleId: s.id,
    title: s.title,
    prompt: s.prompt,
    mode: s.mode,
    createdAt: Date.now(),
  }
  try {
    localStorage.setItem(PENDING_RUN_KEY, JSON.stringify(run))
  } catch {}
  window.dispatchEvent(new CustomEvent(PENDING_RUN_EVENT))
}

type ScheduleContextType = {
  schedules: Schedule[]
  loaded: boolean
  autoOpen: boolean
  setAutoOpen: (value: boolean) => void
  add: (input: ScheduleInput) => Schedule
  update: (id: string, patch: ScheduleInput) => void
  toggle: (id: string, enabled: boolean) => void
  remove: (id: string) => void
  runNow: (id: string) => void
}

const ScheduleContext = createContext<ScheduleContextType>({
  schedules: [],
  loaded: false,
  autoOpen: true,
  setAutoOpen: () => {},
  add: () => {
    throw new Error("ScheduleProvider missing")
  },
  update: () => {},
  toggle: () => {},
  remove: () => {},
  runNow: () => {},
})

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loaded, setLoaded] = useState(false)
  const [autoOpen, setAutoOpenState] = useState(true)
  const ref = useRef<Schedule[]>([])
  const autoRef = useRef(true)

  const persist = useCallback((next: Schedule[]) => {
    ref.current = next
    setSchedules(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          ref.current = parsed.filter((s) => s && s.id && s.prompt)
          setSchedules(ref.current)
        }
      }
      const auto = localStorage.getItem(AUTO_KEY)
      if (auto !== null) {
        autoRef.current = auto === "true"
        setAutoOpenState(autoRef.current)
      }
    } catch {}
    setLoaded(true)
  }, [])

  const setAutoOpen = useCallback((value: boolean) => {
    autoRef.current = value
    setAutoOpenState(value)
    try {
      localStorage.setItem(AUTO_KEY, String(value))
    } catch {}
  }, [])

  const fire = useCallback(
    (s: Schedule, manual = false) => {
      queueRun(s)
      const open = () => {
        if (window.location.pathname === "/") {
          // the chat on this page picks the run up through the event
          window.dispatchEvent(new CustomEvent(PENDING_RUN_EVENT))
        } else {
          router.push("/")
        }
      }
      if (autoRef.current || manual) {
        open()
        toast({
          title: manual ? `Executando "${s.title}"` : `Agendamento "${s.title}" iniciado`,
          description: "A IA começou a tarefa em uma nova conversa.",
          status: "info",
        })
      } else {
        toast({
          title: `Hora de "${s.title}"`,
          description: "Quer que a IA comece essa tarefa agora?",
          status: "info",
          button: { label: "Iniciar", onClick: open },
        })
      }
      try {
        if (
          typeof Notification !== "undefined" &&
          Notification.permission === "granted" &&
          document.visibilityState === "hidden"
        ) {
          new Notification("Meteor AI", { body: `Agendamento: ${s.title}` })
        }
      } catch {}
    },
    [router]
  )

  // The scheduler: while the app is open, start whatever is due.
  useEffect(() => {
    if (!loaded) return
    const tick = () => {
      const now = Date.now()
      const due = ref.current.filter(
        (s) => s.enabled && s.nextRunAt != null && s.nextRunAt <= now
      )
      if (!due.length) return
      const next = ref.current.map((s) => {
        if (!due.some((d) => d.id === s.id)) return s
        const upcoming = computeNextRun(s.recurrence, now)
        return {
          ...s,
          lastRunAt: now,
          runs: s.runs + 1,
          nextRunAt: upcoming,
          enabled: upcoming != null,
        }
      })
      persist(next)
      // one chat at a time: the others stay queued for the next tick
      fire(due[0])
    }
    tick()
    const id = setInterval(tick, TICK_MS)
    return () => clearInterval(id)
  }, [loaded, persist, fire])

  const add: ScheduleContextType["add"] = useCallback(
    (input) => {
      const now = Date.now()
      const s: Schedule = {
        id: makeId(),
        title: input.title.trim(),
        prompt: input.prompt.trim(),
        recurrence: input.recurrence,
        mode: input.mode ?? "chat",
        source: input.source ?? "manual",
        enabled: true,
        createdAt: now,
        lastRunAt: null,
        nextRunAt: computeNextRun(input.recurrence, now),
        runs: 0,
      }
      persist([s, ...ref.current])
      return s
    },
    [persist]
  )

  const update: ScheduleContextType["update"] = useCallback(
    (id, input) => {
      persist(
        ref.current.map((s) =>
          s.id === id
            ? {
                ...s,
                title: input.title.trim(),
                prompt: input.prompt.trim(),
                recurrence: input.recurrence,
                mode: input.mode ?? s.mode,
                nextRunAt: computeNextRun(input.recurrence, Date.now()),
                enabled: true,
              }
            : s
        )
      )
    },
    [persist]
  )

  const toggle = useCallback(
    (id: string, enabled: boolean) => {
      persist(
        ref.current.map((s) =>
          s.id === id
            ? {
                ...s,
                enabled,
                nextRunAt: enabled ? computeNextRun(s.recurrence, Date.now()) : s.nextRunAt,
              }
            : s
        )
      )
    },
    [persist]
  )

  const remove = useCallback(
    (id: string) => persist(ref.current.filter((s) => s.id !== id)),
    [persist]
  )

  const runNow = useCallback(
    (id: string) => {
      const s = ref.current.find((x) => x.id === id)
      if (!s) return
      persist(
        ref.current.map((x) =>
          x.id === id ? { ...x, lastRunAt: Date.now(), runs: x.runs + 1 } : x
        )
      )
      fire(s, true)
    },
    [persist, fire]
  )

  const value = useMemo(
    () => ({ schedules, loaded, autoOpen, setAutoOpen, add, update, toggle, remove, runNow }),
    [schedules, loaded, autoOpen, setAutoOpen, add, update, toggle, remove, runNow]
  )

  return (
    <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>
  )
}

export function useSchedules() {
  return useContext(ScheduleContext)
}
