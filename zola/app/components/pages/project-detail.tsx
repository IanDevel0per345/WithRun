"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useProjects } from "@/lib/project-store/provider"
import { motion } from "motion/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { EmptyState, PageShell } from "./page-shell"
import { ProjectDialog } from "./project-dialog"

export function ProjectDetail({ id }: { id: string }) {
  const { projects, loaded, chatProjects, setActive, remove } = useProjects()
  const { chats } = useChats()
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const project = projects.find((p) => p.id === id)

  if (!loaded) return <PageShell title=" ">{null}</PageShell>

  if (!project) {
    return (
      <PageShell title="Projeto não encontrado">
        <EmptyState
          icon="folder"
          title="Esse projeto não existe"
          description="Ele pode ter sido excluído ou criado em outro navegador."
        >
          <Button size="sm" asChild>
            <Link href="/projetos">Ver projetos</Link>
          </Button>
        </EmptyState>
      </PageShell>
    )
  }

  const projectChats = chats.filter((c) => chatProjects[c.id] === project.id)

  const startChat = () => {
    setActive(project.id)
    router.push("/")
  }

  return (
    <PageShell
      title={project.name}
      description="Conversas e instruções deste projeto."
      actions={
        <>
          <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
            <SheetIcon name="pen" size={16} />
            Editar
          </Button>
          <Button size="sm" variant="outline" onClick={() => setConfirmDelete(true)}>
            <SheetIcon name="trash" size={16} />
            Excluir
          </Button>
          <Button size="sm" onClick={startChat}>
            <SheetIcon name="plus" size={16} invert />
            Nova conversa
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="border-border/70 rounded-2xl border p-4">
          <h2 className="text-sm font-medium">Instruções para a IA</h2>
          <p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">
            {project.instructions || "Nenhuma instrução. Clique em Editar para adicionar."}
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium">Conversas</h2>
          {projectChats.length === 0 ? (
            <EmptyState
              icon="chat"
              title="Nenhuma conversa neste projeto"
              description="Comece uma conversa já dentro do projeto."
            >
              <Button size="sm" onClick={startChat}>
                <SheetIcon name="plus" size={16} invert />
                Nova conversa
              </Button>
            </EmptyState>
          ) : (
            <ul className="space-y-2">
              {projectChats.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                >
                  <Link
                    href={`/c/${c.id}`}
                    className="border-border/70 hover:bg-accent/50 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors"
                  >
                    <SheetIcon name="chatdots" size={18} />
                    <span className="truncate">{c.title || "Nova conversa"}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ProjectDialog open={editOpen} onOpenChange={setEditOpen} project={project} />
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir projeto</AlertDialogTitle>
            <AlertDialogDescription>
              “{project.name}” será excluído. As conversas continuam no histórico, só deixam de pertencer ao projeto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                remove(project.id)
                router.push("/projetos")
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
