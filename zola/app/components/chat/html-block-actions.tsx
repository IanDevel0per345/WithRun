"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { toast } from "@/components/ui/toast"
import { titleFromHtml, useWorkspace } from "@/lib/workspace-store/provider"
import { useRouter } from "next/navigation"
import { useState } from "react"

/** Actions shown on ```html blocks: preview in a sandbox and save to Meu ambiente. */
export function HtmlBlockActions({ code }: { code: string }) {
  const { items, add } = useWorkspace()
  const router = useRouter()
  const [preview, setPreview] = useState(false)
  const saved = items.find((i) => i.content === code)
  const looksComplete = /<\/html>|<\/body>|<\/div>|<\/main>|<\/section>/i.test(code)

  const save = () => {
    const item = add({ title: titleFromHtml(code), content: code, source: "chat" })
    if (!item) {
      toast({ title: "Não foi possível salvar", description: "O código está vazio ou é grande demais.", status: "error" })
      return
    }
    toast({
      title: "Salvo em Meu ambiente",
      description: item.title,
      status: "success",
      button: { label: "Abrir", onClick: () => router.push(`/ambiente/${item.id}`) },
    })
  }

  return (
    <div className="flex items-center gap-1">
      <Button type="button" size="sm" variant="ghost" className="h-7 gap-1.5 px-2 text-xs" onClick={() => setPreview(true)}>
        <SheetIcon name="eye" size={14} />
        Visualizar
      </Button>
      {saved ? (
        <Button type="button" size="sm" variant="ghost" className="h-7 gap-1.5 px-2 text-xs" onClick={() => router.push(`/ambiente/${saved.id}`)}>
          <SheetIcon name="checkcircle" size={14} />
          Salvo · Abrir
        </Button>
      ) : (
        <Button type="button" size="sm" variant="ghost" className="h-7 gap-1.5 px-2 text-xs" onClick={save} disabled={!looksComplete}>
          <SheetIcon name="layers" size={14} />
          Salvar em Meu ambiente
        </Button>
      )}

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="flex h-[80vh] flex-col gap-3 sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{titleFromHtml(code)}</DialogTitle>
          </DialogHeader>
          <iframe
            title="Visualização"
            sandbox="allow-scripts allow-forms allow-modals allow-popups"
            srcDoc={code}
            tabIndex={-1}
            className="min-h-0 w-full flex-1 rounded-lg border bg-white"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
