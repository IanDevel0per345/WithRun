import {
  FileUpload,
  FileUploadContent,
} from "@/components/prompt-kit/file-upload"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getModelInfo } from "@/lib/models"
import { formatDuration, useUsage } from "@/lib/usage-store/provider"
import { cn } from "@/lib/utils"
import { FileArrowUp } from "@/components/icons"
import { FileText, Image as ImageIcon, Video } from "@/components/icons"
import { motion } from "motion/react"
import { useRef, useState } from "react"

type ButtonFileUploadProps = {
  onFileUpload: (files: File[]) => void
  isUserAuthenticated: boolean
  model: string
  /** Estimated tokens used by the current conversation. */
  contextTokens?: number
}

const ACCEPT = {
  photo: "image/jpeg,image/png,image/gif,image/webp",
  file: ".txt,.md,.pdf,.json,.csv",
  video: "video/mp4,video/webm,video/quicktime",
} as const

type Kind = keyof typeof ACCEPT

function formatTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".0", "")}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(".0", "")}k`
  return String(n)
}

function Meter({
  label,
  pct,
  detail,
}: {
  label: string
  pct: number
  detail: string
}) {
  const tone =
    pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-foreground"
  return (
    <div className="px-2.5 py-1">
      <div className="flex items-baseline justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground tabular-nums">{pct}%</span>
      </div>
      <div className="bg-muted mt-1 h-1.5 overflow-hidden rounded-full">
        <motion.div
          className={cn("h-full rounded-full", tone)}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>
      <p className="text-muted-foreground mt-0.5 text-xs">{detail}</p>
    </div>
  )
}

export function ButtonFileUpload({
  onFileUpload,
  model,
  contextTokens = 0,
}: ButtonFileUploadProps) {
  const { usage } = useUsage()
  const [open, setOpen] = useState(false)
  const inputs = {
    photo: useRef<HTMLInputElement>(null),
    file: useRef<HTMLInputElement>(null),
    video: useRef<HTMLInputElement>(null),
  }
  const info = getModelInfo(model)
  const contextWindow = info?.contextWindow ?? 128_000
  const contextPct = Math.min(
    100,
    Math.round((contextTokens / contextWindow) * 100)
  )

  const pick = (kind: Kind) => {
    if (kind !== "file" && !info?.vision) {
      toast({
        title: "Este modelo não aceita imagens nem vídeos",
        description: "Escolha outro modelo para enviar fotos ou vídeos.",
        status: "info",
      })
      return
    }
    // Wait for the menu to close so the file dialog opens cleanly.
    setTimeout(() => inputs[kind].current?.click(), 50)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length) onFileUpload(files)
    e.target.value = ""
  }

  const items: { kind: Kind; label: string; hint: string; icon: React.ReactNode }[] = [
    { kind: "photo", label: "Fotos", hint: "JPG, PNG, GIF, WebP", icon: <ImageIcon className="size-[18px]" strokeWidth={1.75} /> },
    { kind: "file", label: "Arquivos", hint: "PDF, TXT, MD, JSON, CSV", icon: <SheetIcon name="file" size={18} /> },
    { kind: "video", label: "Vídeos", hint: "MP4, WebM, MOV", icon: <Video className="size-[18px]" strokeWidth={1.75} /> },
  ]

  return (
    <FileUpload
      onFilesAdded={onFileUpload}
      multiple
      accept={`${ACCEPT.photo},${ACCEPT.file},${ACCEPT.video}`}
    >
      {(Object.keys(ACCEPT) as Kind[]).map((k) => (
        <input
          key={k}
          ref={inputs[k]}
          type="file"
          multiple
          accept={ACCEPT[k]}
          onChange={onChange}
          className="hidden"
          aria-hidden
          tabIndex={-1}
        />
      ))}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                aria-label="Add files"
                // The input area focuses the textarea on click, which would close the menu.
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-accent dark:hover:bg-accent size-10 shrink-0 rounded-full bg-transparent p-0 shadow-none dark:bg-transparent"
              >
                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex"
                >
                  <SheetIcon name="plus" size={24} />
                </motion.span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Adicionar</TooltipContent>
        </Tooltip>
        <DropdownMenuContent
          align="start"
          side="bottom"
          sideOffset={8}
          collisionPadding={12}
          className="w-[300px] rounded-2xl p-1.5 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((it) => (
            <DropdownMenuItem
              key={it.kind}
              onSelect={() => pick(it.kind)}
              className="flex items-center gap-3 rounded-xl px-2.5 py-1.5"
              title={it.hint}
            >
              <span className="flex size-6 shrink-0 items-center justify-center">
                {it.icon}
              </span>
              <span className="text-sm font-medium">{it.label}</span>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator className="my-1" />
          <p className="text-muted-foreground px-2.5 pt-0.5 pb-0 text-xs font-medium">
            Contexto e uso
          </p>
          <Meter
            label="Contexto desta conversa"
            pct={contextPct}
            detail={`${formatTokens(contextTokens)} de ${formatTokens(contextWindow)} tokens`}
          />
          <Meter
            label="Uso a cada 7 horas"
            pct={usage.shortPct}
            detail={
              usage.shortResetMs !== null
                ? `Reinicia em ${formatDuration(usage.shortResetMs)}`
                : "Reinicia 7 horas após a próxima mensagem"
            }
          />
          <Meter
            label="Uso a cada 7 dias"
            pct={usage.longPct}
            detail={
              usage.longResetMs !== null
                ? `Reinicia em ${formatDuration(usage.longResetMs)}`
                : "Reinicia 7 dias após a próxima mensagem"
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <FileUploadContent>
        <div className="border-input bg-background flex flex-col items-center rounded-lg border border-dashed p-8">
          <FileArrowUp className="text-muted-foreground size-8" />
          <span className="mt-4 mb-1 text-lg font-medium">Solte os arquivos aqui</span>
          <span className="text-muted-foreground text-sm">
            Eles serão adicionados à conversa
          </span>
        </div>
      </FileUploadContent>
    </FileUpload>
  )
}
