"use client"

import { Button } from "@/components/ui/button"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { useMode } from "@/lib/mode-store/provider"
import { useSchedules } from "@/lib/schedule-store/provider"
import { parseScheduleProposal } from "@/lib/schedule-store/proposal"
import { computeNextRun, describeRecurrence, describeWhen } from "@/lib/schedule-store/recurrence"
import Link from "next/link"

/** Card for the ```agendamento block the AI writes when you ask for a scheduled task. */
export function ScheduleProposalCard({ raw }: { raw: string }) {
  const { schedules, add } = useSchedules()
  const { mode } = useMode()
  const draft = parseScheduleProposal(raw)

  if (!draft) {
    return (
      <div className="border-border text-muted-foreground flex items-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm">
        <SheetIcon name="calendar" size={18} />
        Preparando o agendamento…
      </div>
    )
  }

  const existing = schedules.find((s) => s.title === draft.title && s.prompt === draft.prompt)
  const next = computeNextRun(draft.recurrence, Date.now())

  return (
    <div className="not-prose border-border bg-card my-3 rounded-2xl border p-4">
      <div className="flex items-start gap-3">
        <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-xl">
          <SheetIcon name="calendar" size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">Agendamento sugerido</div>
          <h4 className="mt-0.5 font-medium">{draft.title}</h4>
          <p className="text-muted-foreground mt-1 text-sm">{draft.prompt}</p>
          <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <SheetIcon name="calendar" size={14} />
              {describeRecurrence(draft.recurrence)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <SheetIcon name="clock" size={14} />
              {next != null ? `Próxima: ${describeWhen(next)}` : "Esse horário já passou"}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {existing ? (
          <>
            <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
              <SheetIcon name="checkcircle" size={18} />
              Agendado
            </span>
            <Button asChild size="sm" variant="outline">
              <Link href="/agendamentos">Ver agendamentos</Link>
            </Button>
          </>
        ) : (
          <Button size="sm" disabled={next == null} onClick={() => add({ ...draft, mode, source: "chat" })}>
            <SheetIcon name="calendar" size={16} invert />
            Agendar
          </Button>
        )}
      </div>
    </div>
  )
}
