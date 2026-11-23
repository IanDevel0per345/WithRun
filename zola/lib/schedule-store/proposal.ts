import {
  isValidTime,
  sanitizeRecurrence,
  type Recurrence,
} from "./recurrence"

export type ScheduleDraft = {
  title: string
  prompt: string
  recurrence: Recurrence
}

/**
 * The AI proposes a schedule in a ```agendamento block with this JSON:
 * { "titulo", "tarefa", "repeticao": "uma_vez|intervalo|diario|dias_uteis|semanal",
 *   "hora": "HH:mm", "data": "YYYY-MM-DD", "dias": [0-6], "cada_minutos": n }
 */
export function parseScheduleProposal(raw: string): ScheduleDraft | null {
  let data: Record<string, unknown>
  try {
    data = JSON.parse(raw.trim())
  } catch {
    return null
  }
  if (!data || typeof data !== "object") return null

  const title = String(data.titulo ?? "").trim().slice(0, 80)
  const prompt = String(data.tarefa ?? "").trim().slice(0, 2000)
  if (!title || !prompt) return null

  const hora = data.hora
  let recurrence: Recurrence | null = null
  switch (data.repeticao) {
    case "uma_vez":
      recurrence =
        typeof data.data === "string" && isValidTime(hora)
          ? sanitizeRecurrence({ type: "once", at: `${data.data}T${hora}` })
          : null
      break
    case "intervalo":
      recurrence = sanitizeRecurrence({
        type: "interval",
        everyMinutes: data.cada_minutos,
      })
      break
    case "diario":
      recurrence = sanitizeRecurrence({ type: "daily", time: hora })
      break
    case "dias_uteis":
      recurrence = sanitizeRecurrence({ type: "weekdays", time: hora })
      break
    case "semanal":
      recurrence = sanitizeRecurrence({
        type: "weekly",
        time: hora,
        days: data.dias,
      })
      break
  }
  return recurrence ? { title, prompt, recurrence } : null
}
