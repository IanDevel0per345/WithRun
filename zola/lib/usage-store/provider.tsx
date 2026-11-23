"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

const KEY = "meteor-usage"

export const SHORT_WINDOW_MS = 7 * 60 * 60 * 1000 // resets every 7 hours
export const LONG_WINDOW_MS = 7 * 24 * 60 * 60 * 1000 // resets every 7 days
/** Messages allowed per window. */
export const SHORT_LIMIT = 40
export const LONG_LIMIT = 400

type Stored = {
  shortStart: number | null
  shortCount: number
  longStart: number | null
  longCount: number
}

const EMPTY: Stored = { shortStart: null, shortCount: 0, longStart: null, longCount: 0 }

export type UsageSnapshot = {
  shortPct: number
  shortResetMs: number | null
  longPct: number
  longResetMs: number | null
}

type UsageContextType = {
  usage: UsageSnapshot
  /** Counts one answered message in both windows. */
  record: () => void
}

const UsageContext = createContext<UsageContextType | null>(null)

/** Windows that already ended start over from zero. */
function normalize(s: Stored, now: number): Stored {
  let next = s
  if (s.shortStart !== null && now >= s.shortStart + SHORT_WINDOW_MS) {
    next = { ...next, shortStart: null, shortCount: 0 }
  }
  if (s.longStart !== null && now >= s.longStart + LONG_WINDOW_MS) {
    next = { ...next, longStart: null, longCount: 0 }
  }
  return next
}

function read(): Stored {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Stored) } : EMPTY
  } catch {
    return EMPTY
  }
}

export function UsageProvider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = useState<Stored>(EMPTY)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    setStored(normalize(read(), Date.now()))
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  const record = useCallback(() => {
    const t = Date.now()
    setStored((prev) => {
      const s = normalize(prev, t)
      const next: Stored = {
        shortStart: s.shortStart ?? t,
        shortCount: s.shortCount + 1,
        longStart: s.longStart ?? t,
        longCount: s.longCount + 1,
      }
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {}
      return next
    })
    setNow(t)
  }, [])

  const usage = useMemo<UsageSnapshot>(() => {
    const s = normalize(stored, now)
    return {
      shortPct: Math.min(100, Math.round((s.shortCount / SHORT_LIMIT) * 100)),
      shortResetMs:
        s.shortStart !== null ? s.shortStart + SHORT_WINDOW_MS - now : null,
      longPct: Math.min(100, Math.round((s.longCount / LONG_LIMIT) * 100)),
      longResetMs:
        s.longStart !== null ? s.longStart + LONG_WINDOW_MS - now : null,
    }
  }, [stored, now])

  const value = useMemo(() => ({ usage, record }), [usage, record])
  return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>
}

export function useUsage() {
  const ctx = useContext(UsageContext)
  if (!ctx) throw new Error("useUsage must be used within UsageProvider")
  return ctx
}

/** "6 h 40 min", "2 d 3 h", "12 min" */
export function formatDuration(ms: number): string {
  const totalMin = Math.max(1, Math.ceil(ms / 60_000))
  const d = Math.floor(totalMin / 1440)
  const h = Math.floor((totalMin % 1440) / 60)
  const m = totalMin % 60
  if (d > 0) return h > 0 ? `${d} d ${h} h` : `${d} d`
  if (h > 0) return m > 0 ? `${h} h ${m} min` : `${h} h`
  return `${m} min`
}
