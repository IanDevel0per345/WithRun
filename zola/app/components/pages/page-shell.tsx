"use client"

import { SheetIcon, type SheetIconName } from "@/components/ui/sheet-icon"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

/** Common frame for the Home pages (title, description, actions, content). */
export function PageShell({
  title,
  description,
  actions,
  tabs,
  children,
  className,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  /** Page tabs shown right under the title (top of the page). */
  tabs?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-5xl px-4 pt-[calc(var(--spacing-app-header)+12px)] pb-24 sm:px-6",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
        {tabs && <div className="mt-6">{tabs}</div>}
        <div className={cn(tabs ? "mt-6" : "mt-8")}>{children}</div>
      </motion.div>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  children,
}: {
  icon: SheetIconName
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="border-border/70 flex flex-col items-center rounded-2xl border border-dashed px-6 py-14 text-center">
      <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-xl">
        <SheetIcon name={icon} size={24} />
      </div>
      <h3 className="text-base font-medium">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-md text-sm">{description}</p>
      {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  )
}
