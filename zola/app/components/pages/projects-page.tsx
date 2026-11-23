"use client"

import { Button } from "@/components/ui/button"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"
import { DialogCreateProject } from "../layout/sidebar/dialog-create-project"
import { EmptyState, PageShell } from "./page-shell"

type Project = {
  id: string
  name: string
  user_id: string
  created_at: string
}

function formatDate(value: string) {
  const d = new Date(value)
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}

export function ProjectsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const { data, isLoading, isError } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects")
      if (!response.ok) throw new Error("Failed to fetch projects")
      const json = await response.json()
      return Array.isArray(json) ? json : []
    },
    retry: false,
  })
  const projects = data ?? []

  return (
    <PageShell
      title="Projetos"
      description="Tudo o que a IA está construindo com você. Cada projeto reúne as conversas e os arquivos do trabalho."
      actions={
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <SheetIcon name="plus" size={16} invert />
          Novo projeto
        </Button>
      }
    >
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-muted/60 h-28 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.22 }}
            >
              <Link
                href={`/p/${project.id}`}
                className="border-border/70 hover:bg-accent/50 group flex h-full flex-col justify-between gap-6 rounded-2xl border p-4 transition-colors"
              >
                <div className="bg-muted flex size-10 items-center justify-center rounded-xl">
                  <SheetIcon name="folder" size={22} />
                </div>
                <div>
                  <h3 className="truncate font-medium">{project.name}</h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Criado em {formatDate(project.created_at)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="folder"
          title="Nenhum projeto ainda"
          description={
            isError
              ? "Os projetos precisam de uma conta e do banco de dados configurados nesta instalação. Quando estiverem ativos, o que a IA construir aparece aqui."
              : "Quando a IA começar a construir algo com você, o projeto aparece aqui. Você também pode criar um agora."
          }
        >
          {!isError && (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <SheetIcon name="plus" size={16} invert />
              Criar projeto
            </Button>
          )}
        </EmptyState>
      )}
      <DialogCreateProject isOpen={createOpen} setIsOpen={setCreateOpen} />
    </PageShell>
  )
}
