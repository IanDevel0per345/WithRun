"use client"

import { SheetIcon, type SheetIconName } from "@/components/ui/sheet-icon"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { AbilitiesTab } from "./connections/abilities-tab"
import { AppsTab } from "./connections/apps-tab"
import { MemoryTab } from "./connections/memory-tab"
import { SkillsTab } from "./connections/skills-tab"
import { PageShell } from "./page-shell"

const TABS: { id: string; label: string; icon: SheetIconName }[] = [
  { id: "apps", label: "Apps", icon: "link" },
  { id: "skills", label: "Skills", icon: "sparkle" },
  { id: "habilidades", label: "Habilidades", icon: "bulb" },
  { id: "memoria", label: "Memória", icon: "database" },
]

function ConnectionsInner() {
  const router = useRouter()
  const params = useSearchParams()
  const current = TABS.some((t) => t.id === params.get("aba")) ? params.get("aba")! : "apps"

  const tabs = (
    <div role="tablist" aria-label="Seções de Conexões" className="border-border/70 flex gap-1 overflow-x-auto border-b">
      {TABS.map((tab) => {
        const active = tab.id === current
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => router.replace(`/conexoes?aba=${tab.id}`, { scroll: false })}
            className={cn(
              "relative flex shrink-0 items-center gap-2 px-3.5 py-2.5 text-sm font-medium transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <SheetIcon name={tab.icon} size={18} />
            {tab.label}
            {active && (
              <motion.span
                layoutId="connections-tab-underline"
                className="bg-foreground absolute inset-x-2 -bottom-px h-0.5 rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )

  return (
    <PageShell
      title="Conexões"
      description="Conecte seus apps e ensine a IA a trabalhar do seu jeito."
      tabs={tabs}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {current === "apps" && <AppsTab />}
          {current === "skills" && <SkillsTab />}
          {current === "habilidades" && <AbilitiesTab />}
          {current === "memoria" && <MemoryTab />}
        </motion.div>
      </AnimatePresence>
    </PageShell>
  )
}

export function ConnectionsPage() {
  return (
    <Suspense fallback={null}>
      <ConnectionsInner />
    </Suspense>
  )
}
