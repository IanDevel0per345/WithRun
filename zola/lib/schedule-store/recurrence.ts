/** Recurrence rules for scheduled AI tasks (all times are local time). */
export type Recurrence =
  | { type: "once"; at: string } // "YYYY-MM-DDTHH:mm"
  | { type: "interval"; everyMinutes: number }
  | { type: "daily"; time: string } // "HH:mm"
  | { type: "weekdays"; time: string }
  | { type: "weekly"; time: string; days: number[] } // 0 = domingo

export const WEEKDAY_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]

const pad = (n: number) => String(n).padStart(2, "0")

export function isValidTime(time: unknown): time is string {
  return typeof time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
}

function atTime(base: Date, time: string, addDays: number): Date {
  const [h, m] = time.split(":").map(Number)
  const d = new Date(base)
  d.setDate(d.getDate() + addDays)
  d.setHours(h, m, 0, 0)
  return d
}

/** Next run strictly after `from` (ms), or null when there is none. */
export function computeNextRun(rec: Recurrence, from: number): number | null {
  switch (rec.type) {
    case "once": {
      const t = new Date(rec.at).getTime()
      return Number.isFinite(t) && t > from ? t : null
    }
    case "interval":
      return rec.everyMinutes >= 1 ? from + rec.everyMinutes * 60_000 : null
    case "daily":
    case "weekdays":
    case "weekly": {
      const start = new Date(from)
      for (let i = 0; i <= 8; i++) {
        const candidate = atTime(start, rec.time, i)
        if (candidate.getTime() <= from) continue
        const day = candidate.getDay()
        if (rec.type === "weekdays" && (day === 0 || day === 6)) continue
        if (rec.type === "weekly" && !rec.days.includes(day)) continue
        return candidate.getTime()
      }
      return null
    }
  }
}

export function describeRecurrence(rec: Recurrence): string {
  switch (rec.type) {
    case "once": {
      const d = new Date(rec.at)
      if (Number.isNaN(d.getTime())) return "Uma vez"
      return `Uma vez em ${pad(d.getDate())}/${pad(d.getMonth() + 1)} às ${pad(d.getHours())}:${pad(d.getMinutes())}`
    }
    case "interval":
      return rec.everyMinutes % 60 === 0
        ? `A cada ${rec.everyMinutes / 60} h`
        : `A cada ${rec.everyMinutes} min`
    case "daily":
      return `Todo dia às ${rec.time}`
    case "weekdays":
      return `Dias úteis às ${rec.time}`
    case "weekly":
      return `${[...rec.days]
        .sort()
        .map((d) => WEEKDAY_SHORT[d])
        .join(", ")} às ${rec.time}`
  }
}

/** "em 5 min", "em 3 h", "amanhã às 09:00", "25/11 às 09:00". */
export function describeWhen(ts: number | null, now = Date.now()): string {
  if (ts == null) return "—"
  const diff = ts - now
  const d = new Date(ts)
  const hm = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  if (diff <= 0) return "agora"
  if (diff < 60_000) return "em instantes"
  if (diff < 3_600_000) return `em ${Math.round(diff / 60_000)} min`
  const today = new Date(now)
  const sameDay = d.toDateString() === today.toDateString()
  if (sameDay) return `hoje às ${hm}`
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (d.toDateString() === tomorrow.toDateString()) return `amanhã às ${hm}`
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} às ${hm}`
}

/** Validates data coming from storage or from the AI. */
export function sanitizeRecurrence(raw: unknown): Recurrence | null {
  if (!raw || typeof raw !== "object") return null
  const r = raw as Record<string, unknown>
  switch (r.type) {
    case "once":
      return typeof r.at === "string" && !Number.isNaN(new Date(r.at).getTime())
        ? { type: "once", at: r.at }
        : null
    case "interval": {
      const n = Number(r.everyMinutes)
      return Number.isFinite(n) && n >= 1 && n <= 60 * 24 * 7
        ? { type: "interval", everyMinutes: Math.round(n) }
        : null
    }
    case "daily":
    case "weekdays":
      return isValidTime(r.time) ? { type: r.type, time: r.time } : null
    case "weekly": {
      const days = Array.isArray(r.days)
        ? [...new Set(r.days.map(Number))].filter((d) => d >= 0 && d <= 6)
        : []
      return isValidTime(r.time) && days.length
        ? { type: "weekly", time: r.time, days }
        : null
    }
    default:
      return null
  }
}
