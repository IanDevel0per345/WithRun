"use client"

import { Button } from "@/components/ui/button"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useProjects } from "@/lib/project-store/provider"
import { motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"
import { EmptyState, PageShell } from "./page-shell"
import { ProjectDialog } from "./project-dialog"

export function ProjectsPage() {
  const { projects, loaded, chatProjects } = useProjects()
  const { chats } = useChats()
  const [createOpen, setCreateOpen] = useState(false)

  const countFor = (projectId: string) =>
    chats.filter((c) => chatProjects[c.id] === projectId).length

  return (
    <PageShell
      title="Projetos"
      description="Um projeto é como um repositório: um lugar para organizar e trabalhar com a IA. Escolha o projeto na hora de conversar."
      actions={
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <SheetIcon name="plus" size={16} invert />
          Novo projeto
        </Button>
      }
    >
      {!loaded ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-muted/60 h-28 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => {
            const n = countFor(project.id)
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.22 }}
              >
                <Link
                  href={`/projetos/${project.id}`}
                  className="border-border/70 hover:bg-accent/50 flex h-full flex-col justify-between gap-6 rounded-2xl border p-4 transition-colors"
                >
                  <SheetIcon name="folder" size={26} />
                  <div>
                    <h3 className="truncate font-medium">{project.name}</h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {n === 0 ? "Nenhuma conversa" : n === 1 ? "1 conversa" : `${n} conversas`}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon="folder"
          title="Nenhum projeto ainda"
          description="Crie um projeto com o nome que quiser e escolha-o ao lado do campo de conversa para trabalhar dentro dele."
        >
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <SheetIcon name="plus" size={16} invert />
            Criar projeto
          </Button>
        </EmptyState>
      )}
      <ProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageShell>
  )
}
