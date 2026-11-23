"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { titleFromHtml, useWorkspace, type WorkspaceItem } from "@/lib/workspace-store/provider"
import { motion } from "motion/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { EmptyState, PageShell } from "./page-shell"

export const HTML_STARTER = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Minha página</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; min-height: 100vh;
        display: grid; place-items: center; background: #0f172a; color: #f8fafc; }
      main { text-align: center; padding: 2rem; }
      h1 { font-size: 2.5rem; margin: 0 0 .5rem; }
      p { opacity: .8; }
    </style>
  </head>
  <body>
    <main>
      <h1>Olá, mundo!</h1>
      <p>Esta página foi criada no Meu ambiente.</p>
    </main>
  </body>
</html>
`

export function relativeTime(ts: number) {
  const diff = Date.now() - ts
  if (diff < 60_000) return "agora há pouco"
  if (diff < 3_600_000) return `há ${Math.floor(diff / 60_000)} min`
  if (diff < 86_400_000) return `há ${Math.floor(diff / 3_600_000)} h`
  return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

/** Static preview of a saved page (no scripts, no interaction). */
export function PagePreview({ html }: { html: string }) {
  return (
    <div className="bg-muted/40 relative aspect-[16/10] w-full overflow-hidden">
      <iframe
        title="Prévia"
        sandbox=""
        srcDoc={html}
        tabIndex={-1}
        className="pointer-events-none absolute top-0 left-0 origin-top-left border-0 bg-white"
        style={{ width: "400%", height: "400%", transform: "scale(0.25)" }}
      />
    </div>
  )
}

function WorkspaceCard({ item, index }: { item: WorkspaceItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.22 }}
    >
      <Link
        href={`/ambiente/${item.id}`}
        className="border-border/70 hover:border-foreground/25 group block overflow-hidden rounded-2xl border transition-colors"
      >
        <PagePreview html={item.content} />
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium">{item.title}</h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {item.source === "chat" ? "Criado pela IA" : "Criado por você"} ·{" "}
              {relativeTime(item.updatedAt)}
            </p>
          </div>
          <SheetIcon name="arrowr" size={18} className="opacity-50 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </motion.div>
  )
}

export function WorkspacePage() {
  const { items, loaded, add } = useWorkspace()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [html, setHtml] = useState("")

  const create = () => {
    const item = add({
      title: title.trim() || titleFromHtml(html),
      content: html,
      source: "manual",
    })
    if (!item) {
      toast({ title: "Não foi possível salvar", description: "O HTML está vazio ou é grande demais.", status: "error" })
      return
    }
    setOpen(false)
    setTitle("")
    setHtml("")
    router.push(`/ambiente/${item.id}`)
  }

  return (
    <PageShell
      title="Meu ambiente"
      description="Seu espaço. As páginas e os sites que a IA cria para você ficam guardados aqui, prontos para abrir."
      actions={
        <Button size="sm" onClick={() => setOpen(true)}>
          <SheetIcon name="plus" size={16} invert />
          Nova página
        </Button>
      }
    >
      {!loaded ? null : items.length === 0 ? (
        <EmptyState
          icon="layers"
          title="Seu ambiente está vazio"
          description="Peça para a IA criar uma página (por exemplo, “faça uma landing page para minha loja”) e use o botão Salvar em Meu ambiente no código gerado. Ou cole um HTML seu."
        >
          <Button size="sm" onClick={() => { setHtml(HTML_STARTER); setOpen(true) }}>
            <SheetIcon name="code" size={16} invert />
            Começar com um modelo
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <WorkspaceCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova página</DialogTitle>
            <DialogDescription>
              Cole um HTML completo. Ele roda isolado, sem acesso aos seus dados do Meteor AI.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título (opcional)"
              maxLength={80}
            />
            <Textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="<!doctype html>…"
              className="h-64 font-mono text-xs"
              spellCheck={false}
            />
          </div>
          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="ghost" size="sm" onClick={() => setHtml(HTML_STARTER)}>
              Usar modelo
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={create} disabled={!html.trim()}>
                Salvar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
