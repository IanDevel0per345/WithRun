"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SKILL_INSTRUCTIONS_MAX, SKILL_NAME_MAX, useAssistant, type Skill } from "@/lib/assistant-store/provider"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { CharCounter } from "../../layout/settings/settings-ui"

export function SkillsTab() {
  const { allSkills, enabledSkills, toggleSkill, addSkill, removeSkill } = useAssistant()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [instructions, setInstructions] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [toDelete, setToDelete] = useState<Skill | null>(null)
  const activeCount = allSkills.filter((s) => enabledSkills.includes(s.id)).length

  const create = () => {
    addSkill({ name, description, instructions })
    setOpen(false)
    setName("")
    setDescription("")
    setInstructions("")
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground max-w-xl text-sm">
          Skills são instruções prontas que mudam o jeito de a IA trabalhar. As que você ligar valem em todas as conversas.{" "}
          <strong className="text-foreground font-medium">{activeCount} ativa{activeCount === 1 ? "" : "s"}.</strong>
        </p>
        <Button size="sm" onClick={() => setOpen(true)}>
          <SheetIcon name="plus" size={16} invert />
          Criar skill
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AnimatePresence initial={false}>
          {allSkills.map((skill) => {
            const on = enabledSkills.includes(skill.id)
            const isOpen = expanded === skill.id
            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className={cn("border-border/70 rounded-2xl border p-4 transition-colors", on && "border-foreground/30")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-medium">{skill.name}</h3>
                      {!skill.builtin && <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[11px]">sua</span>}
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-sm">{skill.description || "Skill personalizada"}</p>
                  </div>
                  <Switch aria-label={`Ativar ${skill.name}`} checked={on} onCheckedChange={() => toggleSkill(skill.id)} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <button type="button" onClick={() => setExpanded(isOpen ? null : skill.id)} className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline">
                    {isOpen ? "Esconder instruções" : "Ver instruções"}
                  </button>
                  {!skill.builtin && (
                    <button type="button" onClick={() => setToDelete(skill)} className="text-muted-foreground hover:text-destructive ml-auto flex items-center gap-1 text-xs">
                      <SheetIcon name="trash" size={14} />
                      Excluir
                    </button>
                  )}
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-muted/60 text-muted-foreground mt-3 overflow-hidden rounded-xl px-3 py-2 text-xs leading-relaxed"
                    >
                      {skill.instructions}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Criar skill</DialogTitle>
            <DialogDescription>Descreva como a IA deve se comportar. A skill já nasce ligada.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="skill-name">Nome</Label>
              <Input id="skill-name" value={name} maxLength={SKILL_NAME_MAX} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Roteirista de vídeos" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="skill-desc">Descrição curta</Label>
              <Input id="skill-desc" value={description} maxLength={120} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: Escreve roteiros curtos para redes sociais" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="skill-ins">Instruções</Label>
              <Textarea id="skill-ins" className="min-h-28" value={instructions} maxLength={SKILL_INSTRUCTIONS_MAX} onChange={(e) => setInstructions(e.target.value)} placeholder="Ex.: Ao escrever um roteiro, comece com um gancho de 3 segundos e termine com uma chamada para ação." />
              <CharCounter value={instructions} max={SKILL_INSTRUCTIONS_MAX} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button disabled={!name.trim() || !instructions.trim()} onClick={create}>Criar e ativar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir skill</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza de que quer excluir “{toDelete?.name}”?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (toDelete) removeSkill(toDelete.id); setToDelete(null) }}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
