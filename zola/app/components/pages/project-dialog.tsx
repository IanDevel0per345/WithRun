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
import { Textarea } from "@/components/ui/textarea"
import {
  PROJECT_INSTRUCTIONS_MAX,
  PROJECT_NAME_MAX,
  type Project,
  useProjects,
} from "@/lib/project-store/provider"
import { useEffect, useState } from "react"

/** Create (no `project`) or edit a project. */
export function ProjectDialog({
  open,
  onOpenChange,
  project,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
  onSaved?: (project: Project) => void
}) {
  const { add, update } = useProjects()
  const [name, setName] = useState("")
  const [instructions, setInstructions] = useState("")

  useEffect(() => {
    if (open) {
      setName(project?.name ?? "")
      setInstructions(project?.instructions ?? "")
    }
  }, [open, project])

  const save = () => {
    if (!name.trim()) return
    if (project) {
      update(project.id, { name, instructions })
      onSaved?.({ ...project, name: name.trim(), instructions: instructions.trim() })
    } else {
      const created = add(name, instructions)
      if (created) onSaved?.(created)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{project ? "Editar projeto" : "Novo projeto"}</DialogTitle>
          <DialogDescription>
            Um projeto é como um repositório: um lugar para organizar e trabalhar
            com a IA.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            save()
          }}
        >
          <div className="space-y-1.5">
            <label htmlFor="project-name" className="text-sm font-medium">
              Nome
            </label>
            <Input
              id="project-name"
              autoFocus
              value={name}
              maxLength={PROJECT_NAME_MAX}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: new-project"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="project-instructions" className="text-sm font-medium">
              Instruções para a IA <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <Textarea
              id="project-instructions"
              className="min-h-24"
              value={instructions}
              maxLength={PROJECT_INSTRUCTIONS_MAX}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ex.: Site de uma cafeteria. Use tons quentes e escreva em português."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {project ? "Salvar" : "Criar projeto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
