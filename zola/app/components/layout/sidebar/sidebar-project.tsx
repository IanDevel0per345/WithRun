"use client"

import { SheetIcon } from "@/components/ui/sheet-icon"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { DialogCreateProject } from "./dialog-create-project"
import { SidebarProjectItem } from "./sidebar-project-item"

type Project = {
  id: string
  name: string
  user_id: string
  created_at: string
}

export function SidebarProject() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects")
      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }
      const data = await response.json()
      return Array.isArray(data) ? data : []
    },
    retry: false,
  })

  return (
    <div className="mb-5">
      <button
        className="text-muted-foreground hover:bg-accent/70 hover:text-foreground relative inline-flex h-8 w-full items-center rounded-md bg-transparent px-1.5 text-[13.5px] font-medium transition-colors"
        type="button"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex items-center gap-2">
          <SheetIcon name="folderplus" size={20} />
          New project
        </div>
      </button>

      {isLoading ? null : (
        <div className="space-y-1">
          {projects.map((project) => (
            <SidebarProjectItem key={project.id} project={project} />
          ))}
        </div>
      )}

      <DialogCreateProject isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </div>
  )
}
