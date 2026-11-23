"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { APP_CATALOG, APP_CATEGORIES, type AppDef } from "@/lib/connections/catalog"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { useMemo, useState } from "react"
import { EmptyState } from "../page-shell"

function AppTile({ app, size = 44 }: { app: AppDef; size?: number }) {
  const logo = size * 0.58
  const img = "object-contain"
  return (
    <span
      className="border-border/70 flex shrink-0 items-center justify-center rounded-xl border bg-white dark:bg-black"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {app.id === "github" ? (
        <>
          <img src="/logos/github.svg" alt="" width={logo} height={logo} className={`${img} dark:hidden`} />
          <img src="/logos/github-dark.svg" alt="" width={logo} height={logo} className={`${img} hidden dark:block`} />
        </>
      ) : (
        <img src={`/logos/${app.id}.svg`} alt="" width={logo} height={logo} className={img} />
      )}
    </span>
  )
}

export function AppsTab() {
  const [category, setCategory] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<AppDef | null>(null)

  const apps = useMemo(
    () =>
      APP_CATALOG.filter(
        (a) =>
          (category === "all" || a.category === category) &&
          (a.name + a.description).toLowerCase().includes(query.trim().toLowerCase())
      ),
    [category, query]
  )

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 text-sm font-semibold">Conectados</h2>
        <EmptyState
          icon="link"
          title="Nenhum app conectado ainda"
          description="Quando você conectar um app, a IA passa a enxergar o que você autorizar e pode trabalhar com ele durante a conversa."
        />
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Disponíveis</h2>
          <div className="relative w-full sm:w-64">
            <SheetIcon name="search" size={16} className="absolute top-1/2 left-3 -translate-y-1/2 opacity-60" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar apps" className="pl-9" />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {APP_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={category === c.id}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                category === c.id
                  ? "bg-foreground text-background border-transparent"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {apps.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center text-sm">Nenhum app encontrado para “{query}”.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app, i) => (
              <motion.button
                key={app.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 9) * 0.03, duration: 0.2 }}
                onClick={() => setSelected(app)}
                className="border-border/70 hover:bg-accent/50 flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-colors"
              >
                <div className="flex w-full items-center justify-between">
                  <AppTile app={app} />
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[11px] font-medium">Em breve</span>
                </div>
                <div>
                  <h3 className="font-medium">{app.name}</h3>
                  <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm">{app.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <div className="mb-2 flex items-center gap-3">
                  <AppTile app={selected} size={48} />
                  <div>
                    <DialogTitle>{selected.name}</DialogTitle>
                    <DialogDescription>{selected.description}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="mb-2 font-medium">O que a IA vai poder fazer</h4>
                  <ul className="space-y-1.5">
                    {selected.abilities.map((a) => (
                      <li key={a} className="flex items-start gap-2">
                        <SheetIcon name="checkcircle" size={18} className="mt-px" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Permissões pedidas</h4>
                  <ul className="space-y-1.5">
                    {selected.permissions.map((p) => (
                      <li key={p} className="text-muted-foreground flex items-start gap-2">
                        <SheetIcon name="lock" size={16} className="mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="bg-muted/60 text-muted-foreground flex items-start gap-2 rounded-xl p-3 text-xs">
                  <SheetIcon name="info" size={16} className="mt-px shrink-0" />
                  A conexão com {selected.name} ainda não está disponível nesta versão. Nada é compartilhado até você conectar e autorizar.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>Fechar</Button>
                <Button disabled>Conectar (em breve)</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
