"use client"

import { useKeyShortcut } from "@/app/hooks/use-key-shortcut"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { UPDATES } from "@/lib/updates"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { Newspaper } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const SEEN_KEY = "meteor-updates-seen"

export function NewsButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(false)

  useEffect(() => {
    try {
      setUnread(localStorage.getItem(SEEN_KEY) !== UPDATES[0].id)
    } catch {}
  }, [])

  // The old "new chat" shortcut keeps working now that the button is gone.
  useKeyShortcut(
    (e) => (e.key === "u" || e.key === "U") && e.metaKey && e.shiftKey,
    () => router.push("/")
  )

  const onOpenChange = (v: boolean) => {
    setOpen(v)
    if (v) {
      setUnread(false)
      try {
        localStorage.setItem(SEEN_KEY, UPDATES[0].id)
      } catch {}
    }
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onOpenChange(true)}
            aria-label="Novidades"
            className="text-muted-foreground hover:text-foreground hover:bg-muted bg-background relative rounded-full p-1.5 transition-colors"
          >
            <Newspaper className="size-6" strokeWidth={1.75} />
            {unread && (
              <span className="bg-foreground ring-background absolute top-1 right-1 size-2 rounded-full ring-2" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>Novidades</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85dvh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[560px]">
          <DialogHeader className="border-border border-b px-6 py-5">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: open ? 1 : 0, y: open ? 0 : 8 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col gap-1.5 text-left"
            >
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Newspaper className="size-5" strokeWidth={1.75} />
                Novidades
              </DialogTitle>
              <DialogDescription>
                Atualizações recentes do Meteor AI.
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          <div className="overflow-y-auto px-6 py-5">
            <ol className="border-border relative ml-1.5 space-y-6 border-l">
              {open &&
                UPDATES.map((u, i) => (
                  <motion.li
                    key={u.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.12 + i * 0.07,
                      duration: 0.4,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    className="relative pl-5"
                  >
                    <span
                      className={cn(
                        "ring-background absolute top-1.5 -left-[5px] size-2.5 rounded-full ring-4",
                        i === 0 ? "bg-foreground" : "bg-border"
                      )}
                    />
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-medium",
                          u.tag === "Novo"
                            ? "bg-foreground text-background"
                            : "bg-muted text-foreground"
                        )}
                      >
                        {u.tag}
                      </span>
                      {u.date}
                    </div>
                    <h3 className="mt-1.5 font-medium">{u.title}</h3>
                    <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                      {u.description}
                    </p>
                  </motion.li>
                ))}
            </ol>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
