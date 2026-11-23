"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { Switch } from "@/components/ui/switch"
import { MEMORY_MAX, useAssistant } from "@/lib/assistant-store/provider"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { EmptyState } from "../page-shell"

const IDEAS = ["Moro em São Paulo", "Prefiro respostas em tópicos", "Trabalho com React e TypeScript"]

export function MemoryTab() {
  const { memories, addMemory, toggleMemory, removeMemory, clearMemories } = useAssistant()
  const [text, setText] = useState("")

  const submit = (value = text) => {
    if (!value.trim()) return
    addMemory(value)
    setText("")
  }

  return (
    <div className="space-y-5">
      <p className="text-muted-foreground max-w-xl text-sm">
        Coisas que a IA deve lembrar sobre você em todas as conversas. Fica salvo só neste navegador e você pode pausar ou apagar quando quiser.
      </p>

      <form
        className="flex gap-2"
        onSubmit={(e) => { e.preventDefault(); submit() }}
      >
        <Input
          value={text}
          maxLength={MEMORY_MAX}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex.: Tenho uma empresa de IA chamada Abstraction"
          aria-label="Nova memória"
        />
        <Button type="submit" disabled={!text.trim()}>
          <SheetIcon name="plus" size={16} invert />
          Adicionar
        </Button>
      </form>

      {memories.length === 0 ? (
        <EmptyState icon="database" title="Nenhuma memória ainda" description="Adicione fatos curtos e úteis. Alguns exemplos para começar:">
          {IDEAS.map((idea) => (
            <Button key={idea} size="sm" variant="outline" onClick={() => submit(idea)}>{idea}</Button>
          ))}
        </EmptyState>
      ) : (
        <>
          <ul className="border-border/70 divide-border/60 divide-y rounded-2xl border">
            <AnimatePresence initial={false}>
              {memories.map((m) => (
                <motion.li
                  key={m.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-4 py-3">
                    <p className={m.enabled ? "min-w-0 flex-1 text-sm" : "text-muted-foreground min-w-0 flex-1 text-sm line-through"}>{m.text}</p>
                    <Switch aria-label="Usar esta memória" checked={m.enabled} onCheckedChange={() => toggleMemory(m.id)} />
                    <button type="button" aria-label="Excluir memória" onClick={() => removeMemory(m.id)} className="text-muted-foreground hover:text-destructive">
                      <SheetIcon name="trash" size={18} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <div className="flex justify-end">
            <Button size="sm" variant="ghost" onClick={clearMemories}>Apagar tudo</Button>
          </div>
        </>
      )}
    </div>
  )
}
