"use client"

import { CodeBlockCode } from "@/components/prompt-kit/code-block"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { useWorkspace } from "@/lib/workspace-store/provider"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Segmented } from "../layout/settings/settings-ui"
import { EmptyState, PageShell } from "./page-shell"

type View = "preview" | "code"
type Device = "desktop" | "tablet" | "mobile"

const DEVICE_WIDTH: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
}

/** Iframe isolated from the app: no same-origin, so the page cannot read our data. */
const SANDBOX = "allow-scripts allow-forms allow-modals allow-popups"

export function WorkspaceViewer({ id }: { id: string }) {
  const { items, loaded, update, remove } = useWorkspace()
  const router = useRouter()
  const item = items.find((i) => i.id === id)
  const [view, setView] = useState<View>("preview")
  const [device, setDevice] = useState<Device>("desktop")
  const [title, setTitle] = useState("")
  const [fullscreen, setFullscreen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (item) setTitle(item.title)
  }, [item?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [fullscreen])

  if (!loaded) return <PageShell title=" ">{null}</PageShell>

  if (!item) {
    return (
      <PageShell title="Página não encontrada">
        <EmptyState
          icon="layers"
          title="Essa página não existe mais"
          description="Ela pode ter sido excluída ou salva em outro navegador."
        >
          <Button asChild size="sm">
            <Link href="/ambiente">Voltar ao Meu ambiente</Link>
          </Button>
        </EmptyState>
      </PageShell>
    )
  }

  const download = () => {
    const blob = new Blob([item.content], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${(item.title || "pagina").replace(/[^\w\-]+/g, "-").toLowerCase()}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.content)
      toast({ title: "Código copiado", status: "success" })
    } catch {
      toast({ title: "Não foi possível copiar", status: "error" })
    }
  }

  const frame = (className?: string) => (
    <iframe
      key={reloadKey}
      title={item.title}
      sandbox={SANDBOX}
      srcDoc={item.content}
      className={cn("h-full w-full border-0 bg-white", className)}
    />
  )

  return (
    <PageShell
      title={item.title}
      className="max-w-6xl"
      description={undefined}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => router.push("/ambiente")}>
            <SheetIcon name="arrowl" size={16} />
            Voltar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              const next = title.trim() || item.title
              setTitle(next)
              if (next !== item.title) update(item.id, { title: next })
            }}
            maxLength={80}
            aria-label="Título da página"
            className="border-border/70 bg-background focus-visible:border-foreground/30 h-9 min-w-48 flex-1 rounded-lg border px-3 text-sm outline-none"
          />
          <Segmented
            ariaLabel="Modo de visualização"
            value={view}
            onChange={setView}
            options={[
              { value: "preview", label: "Visualizar" },
              { value: "code", label: "Código" },
            ]}
          />
          {view === "preview" && (
            <Segmented
              ariaLabel="Tamanho da tela"
              value={device}
              onChange={setDevice}
              options={[
                { value: "desktop", label: "Computador" },
                { value: "tablet", label: "Tablet" },
                { value: "mobile", label: "Celular" },
              ]}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {view === "preview" && (
            <>
              <Button variant="outline" size="sm" onClick={() => setFullscreen(true)}>
                <SheetIcon name="external" size={16} />
                Tela cheia
              </Button>
              <Button variant="outline" size="sm" onClick={() => setReloadKey((k) => k + 1)}>
                <SheetIcon name="refresh" size={16} />
                Recarregar
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={copy}>
            <SheetIcon name="copy" size={16} />
            Copiar código
          </Button>
          <Button variant="outline" size="sm" onClick={download}>
            <SheetIcon name="download" size={16} />
            Baixar .html
          </Button>
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => setConfirmDelete(true)}>
            <SheetIcon name="trash" size={16} />
            Excluir
          </Button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {view === "preview" ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-muted/40 flex justify-center rounded-2xl border p-3"
            >
              <div
                className="h-[70vh] min-h-96 overflow-hidden rounded-xl border bg-white shadow-sm transition-[width] duration-300"
                style={{ width: DEVICE_WIDTH[device], maxWidth: "100%" }}
              >
                {frame()}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="border-border max-h-[70vh] overflow-auto rounded-2xl border"
            >
              <CodeBlockCode code={item.content} language="html" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            key="fs"
            className="fixed inset-0 z-[80] flex flex-col bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between px-4 py-3 text-white">
              <span className="truncate text-sm font-medium">{item.title}</span>
              <Button variant="secondary" size="sm" onClick={() => setFullscreen(false)}>
                <SheetIcon name="close" size={16} />
                Fechar
              </Button>
            </div>
            <div className="min-h-0 flex-1 px-4 pb-4">
              <div className="h-full overflow-hidden rounded-xl bg-white">{frame()}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir página</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que quer excluir “{item.title}”? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                remove(item.id)
                router.push("/ambiente")
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  )
}
