"use client"

import { ProjectDialog } from "@/app/components/pages/project-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { useProjects } from "@/lib/project-store/provider"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { useState } from "react"

/** Project selector shown above the chat input (like choosing a repository). */
export function ProjectPicker({ className }: { className?: string }) {
  const { projects, activeProject, activeId, setActive } = useProjects()
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className={cn("flex items-center", className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Selecionar projeto"
            className="text-foreground hover:bg-accent/70 flex max-w-full items-center gap-2 rounded-lg px-2 py-1.5 text-base font-medium transition-colors"
          >
            <SheetIcon name="folder" size={22} />
            <span className="truncate">
              {activeProject ? activeProject.name : "Sem projeto"}
            </span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <SheetIcon name="chevron" size={16} />
            </motion.span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 rounded-xl p-1.5">
          <DropdownMenuItem
            onSelect={() => setActive(null)}
            className="flex items-center gap-2 rounded-lg px-2 py-2"
          >
            <SheetIcon name="chat" size={18} />
            <span className="flex-1">Sem projeto</span>
            {activeId === null && <SheetIcon name="checkcircle" size={16} />}
          </DropdownMenuItem>
          {projects.length > 0 && <DropdownMenuSeparator />}
          <div className="max-h-56 overflow-y-auto">
            {projects.map((p) => (
              <DropdownMenuItem
                key={p.id}
                onSelect={() => setActive(p.id)}
                className="flex items-center gap-2 rounded-lg px-2 py-2"
              >
                <SheetIcon name="folder" size={18} />
                <span className="flex-1 truncate">{p.name}</span>
                {activeId === p.id && <SheetIcon name="checkcircle" size={16} />}
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-lg px-2 py-2"
          >
            <SheetIcon name="folderplus" size={18} />
            Novo projeto
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={(p) => setActive(p.id)}
      />
    </div>
  )
}
