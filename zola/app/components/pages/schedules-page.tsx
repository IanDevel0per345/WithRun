"use client"

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import {
  computeNextRun, describeRecurrence, describeWhen, WEEKDAY_SHORT, type Recurrence,
} from "@/lib/schedule-store/recurrence"
import { useSchedules, type Schedule, type ScheduleInput } from "@/lib/schedule-store/provider"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useMemo, useState } from "react"
import { Segmented } from "../layout/settings/settings-ui"
import { EmptyState, PageShell } from "./page-shell"
import { relativeTime } from "./workspace-page"

type Kind = Recurrence["type"]

const pad = (n: number) => String(n).padStart(2, "0")
function toLocalInput(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function inOneHour() {
  const d = new Date(Date.now() + 3_600_000)
  d.setSeconds(0, 0)
  return toLocalInput(d)
}

type Draft = { title: string; prompt: string; recurrence?: Recurrence }

const EXAMPLES: (Draft & { label: string })[] = [
  {
    label: "Resumo diário às 8h",
    title: "Resumo do dia",
    prompt: "Monte um resumo curto das minhas prioridades de hoje e sugira a ordem de execução.",
    recurrence: { type: "daily", time: "08:00" },
  },
  {
    label: "Revisão de código nos dias úteis",
    title: "Revisão de código",
    prompt: "Me lembre de revisar os pull requests abertos e liste o que checar em cada um.",
    recurrence: { type: "weekdays", time: "17:30" },
  },
  {
    label: "Pausa para beber água",
    title: "Beber água",
    prompt: "Escreva um lembrete curto e simpático para eu beber água e esticar as pernas.",
    recurrence: { type: "interval", everyMinutes: 120 },
  },
]

function ScheduleDialog({
  open, onOpenChange, editing, draft, onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: Schedule | null
  draft: Draft | null
  onSave: (input: ScheduleInput, id?: string) => void
}) {
  const [title, setTitle] = useState("")
  const [prompt, setPrompt] = useState("")
  const [kind, setKind] = useState<Kind>("daily")
  const [onceAt, setOnceAt] = useState(inOneHour())
  const [minutes, setMinutes] = useState(60)
  const [time, setTime] = useState("09:00")
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [mode, setMode] = useState<"chat" | "code">("chat")

  useEffect(() => {
    if (!open) return
    const src = editing ?? draft
    setTitle(src?.title ?? "")
    setPrompt(src?.prompt ?? "")
    setMode(editing?.mode ?? "chat")
    const rec = src?.recurrence
    setKind(rec?.type ?? "daily")
    setOnceAt(rec?.type === "once" ? rec.at : inOneHour())
    setMinutes(rec?.type === "interval" ? rec.everyMinutes : 60)
    setTime(rec && "time" in rec ? rec.time : "09:00")
    setDays(rec?.type === "weekly" ? rec.days : [1, 2, 3, 4, 5])
  }, [open, editing, draft])

  const recurrence: Recurrence = useMemo(() => {
    switch (kind) {
      case "once": return { type: "once", at: onceAt }
      case "interval": return { type: "interval", everyMinutes: Math.max(1, minutes || 1) }
      case "daily": return { type: "daily", time }
      case "weekdays": return { type: "weekdays", time }
      case "weekly": return { type: "weekly", time, days }
    }
  }, [kind, onceAt, minutes, time, days])

  const next = computeNextRun(recurrence, Date.now())
  const valid = title.trim() && prompt.trim() && next != null &&
    (kind !== "weekly" || days.length > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar agendamento" : "Novo agendamento"}</DialogTitle>
          <DialogDescription>
            Na hora marcada, a IA abre uma nova conversa e faz a tarefa sozinha.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-0.5">
          <div className="space-y-1.5">
            <Label htmlFor="sch-title">Nome</Label>
            <Input id="sch-title" value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Resumo do dia" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sch-prompt">Tarefa para a IA</Label>
            <Textarea id="sch-prompt" value={prompt} maxLength={2000} onChange={(e) => setPrompt(e.target.value)} className="min-h-24" placeholder="Descreva exatamente o que a IA deve fazer quando chegar a hora." />
          </div>
          <div className="space-y-1.5">
            <Label>Repetição</Label>
            <Segmented
              ariaLabel="Repetição"
              value={kind}
              onChange={setKind}
              options={[
                { value: "once", label: "Uma vez" },
                { value: "interval", label: "Intervalo" },
                { value: "daily", label: "Todo dia" },
                { value: "weekdays", label: "Dias úteis" },
                { value: "weekly", label: "Semanal" },
              ]}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {kind === "once" && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="sch-at">Data e hora</Label>
                <Input id="sch-at" type="datetime-local" value={onceAt} onChange={(e) => setOnceAt(e.target.value)} />
              </div>
            )}
            {kind === "interval" && (
              <div className="space-y-1.5">
                <Label htmlFor="sch-min">A cada (minutos)</Label>
                <Input id="sch-min" type="number" min={1} max={10080} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
              </div>
            )}
            {(kind === "daily" || kind === "weekdays" || kind === "weekly") && (
              <div className="space-y-1.5">
                <Label htmlFor="sch-time">Horário</Label>
                <Input id="sch-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            )}
            {kind === "weekly" && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Dias da semana</Label>
                <div className="flex flex-wrap gap-1.5">
                  {WEEKDAY_SHORT.map((label, d) => {
                    const on = days.includes(d)
                    return (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setDays((prev) => on ? prev.filter((x) => x !== d) : [...prev, d])}
                        className={cn(
                          "h-9 min-w-12 rounded-lg border px-3 text-sm font-medium capitalize transition-colors",
                          on ? "bg-foreground text-background border-transparent" : "text-muted-foreground hover:bg-accent"
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Modo da conversa</Label>
            <Segmented
              ariaLabel="Modo"
              value={mode}
              onChange={setMode}
              options={[
                { value: "chat", label: "Modo chat" },
                { value: "code", label: "Modo code" },
              ]}
            />
          </div>

          <div className="bg-muted/60 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm">
            <SheetIcon name="clock" size={18} />
            {next != null ? (
              <span>
                Próxima execução: <strong className="font-medium">{describeWhen(next)}</strong>
              </span>
            ) : (
              <span className="text-destructive">
                {kind === "weekly" && days.length === 0 ? "Escolha pelo menos um dia." : "Essa data/hora já passou."}
              </span>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            disabled={!valid}
            onClick={() => {
              onSave({ title, prompt, recurrence, mode }, editing?.id)
              onOpenChange(false)
            }}
          >
            {editing ? "Salvar" : "Agendar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ScheduleCard({ s, onEdit, onDelete }: { s: Schedule; onEdit: () => void; onDelete: () => void }) {
  const { toggle, runNow } = useSchedules()
  const finished = !s.enabled && s.nextRunAt == null
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={cn("border-border/70 rounded-2xl border p-4", !s.enabled && "opacity-75")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium">{s.title}</h3>
            {s.source === "chat" && (
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[11px]">criado pela IA</span>
            )}
            {s.mode === "code" && (
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[11px]">code</span>
            )}
          </div>
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{s.prompt}</p>
        </div>
        <Switch
          aria-label={s.enabled ? "Pausar agendamento" : "Ativar agendamento"}
          checked={s.enabled}
          disabled={finished}
          onCheckedChange={(v) => toggle(s.id, v)}
        />
      </div>

      <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1.5"><SheetIcon name="calendar" size={14} />{describeRecurrence(s.recurrence)}</span>
        <span className="inline-flex items-center gap-1.5">
          <SheetIcon name="clock" size={14} />
          {finished ? "Concluído" : s.enabled ? `Próxima: ${describeWhen(s.nextRunAt)}` : "Pausado"}
        </span>
        <span>{s.runs === 0 ? "Nunca executou" : `Executou ${s.runs}×${s.lastRunAt ? ` · última ${relativeTime(s.lastRunAt)}` : ""}`}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => runNow(s.id)}>
          <SheetIcon name="play" size={16} />
          Executar agora
        </Button>
        <Button size="sm" variant="outline" onClick={onEdit}>
          <SheetIcon name="newchat" size={16} />
          Editar
        </Button>
        <Button size="sm" variant="outline" onClick={onDelete}>
          <SheetIcon name="trash" size={16} />
          Excluir
        </Button>
      </div>
    </motion.div>
  )
}

export function SchedulesPage() {
  const { schedules, loaded, autoOpen, setAutoOpen, add, update, remove } = useSchedules()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Schedule | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [toDelete, setToDelete] = useState<Schedule | null>(null)
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default")

  useEffect(() => {
    setPermission(typeof Notification === "undefined" ? "unsupported" : Notification.permission)
  }, [])

  const openNew = (d: Draft | null = null) => {
    setEditing(null)
    setDraft(d)
    setDialogOpen(true)
  }

  const save = (input: ScheduleInput, id?: string) => {
    if (id) {
      update(id, input)
      toast({ title: "Agendamento atualizado", status: "success" })
    } else {
      add({ ...input, source: "manual" })
      toast({ title: "Agendamento criado", description: "A IA vai começar a tarefa na hora marcada, com o app aberto.", status: "success" })
    }
  }

  const askPermission = async () => {
    if (typeof Notification === "undefined") return
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  return (
    <PageShell
      title="Agendamentos"
      description="Tarefas que a IA inicia sozinha na hora marcada. Você também pode pedir no chat: “todo dia às 8h, me resuma as notícias”."
      actions={
        <Button size="sm" onClick={() => openNew()}>
          <SheetIcon name="plus" size={16} invert />
          Novo agendamento
        </Button>
      }
    >
      <div className="border-border/70 mb-6 divide-y rounded-2xl border">
        <div className="flex items-center justify-between gap-4 px-4 py-3.5">
          <div>
            <div className="text-sm font-medium">Abrir a conversa automaticamente</div>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Ligado, a IA já começa a tarefa quando chega a hora. Desligado, você recebe um aviso para iniciar.
            </p>
          </div>
          <Switch checked={autoOpen} onCheckedChange={setAutoOpen} />
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-3.5">
          <div>
            <div className="text-sm font-medium">Avisos do navegador</div>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {permission === "granted"
                ? "Ativados: você é avisado quando a aba estiver em segundo plano."
                : permission === "denied"
                  ? "Bloqueados no navegador. Libere nas configurações do site."
                  : permission === "unsupported"
                    ? "Este navegador não suporta avisos."
                    : "Receba um aviso quando a aba estiver em segundo plano."}
            </p>
          </div>
          {permission === "default" && (
            <Button size="sm" variant="outline" onClick={askPermission}>Ativar avisos</Button>
          )}
        </div>
        <div className="text-muted-foreground flex items-start gap-2 px-4 py-3 text-xs">
          <SheetIcon name="info" size={16} className="mt-px shrink-0" />
          Os agendamentos rodam enquanto o Meteor AI está aberto no navegador. Se o horário passar com o app fechado, a tarefa começa assim que você abrir de novo.
        </div>
      </div>

      {!loaded ? null : schedules.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="Nenhum agendamento ainda"
          description="Crie um agendamento ou peça para a IA no chat. Comece por um destes exemplos:"
        >
          {EXAMPLES.map((ex) => (
            <Button key={ex.label} size="sm" variant="outline" onClick={() => openNew(ex)}>
              {ex.label}
            </Button>
          ))}
        </EmptyState>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {schedules.map((s) => (
              <ScheduleCard
                key={s.id}
                s={s}
                onEdit={() => { setEditing(s); setDraft(null); setDialogOpen(true) }}
                onDelete={() => setToDelete(s)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <ScheduleDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} draft={draft} onSave={save} />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que quer excluir “{toDelete?.title}”? A IA não vai mais executar essa tarefa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (toDelete) remove(toDelete.id); setToDelete(null) }}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  )
}
