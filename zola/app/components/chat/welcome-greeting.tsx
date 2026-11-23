"use client"

import { useMode } from "@/lib/mode-store/provider"
import { useSettings } from "@/lib/settings-store/provider"
import { useUser } from "@/lib/user-store/provider"
import { useTemporaryChat } from "@/lib/temporary-chat/provider"
import { SheetIcon } from "@/components/ui/sheet-icon"
import {
  fillWelcomeTemplate,
  pickWelcomeTemplate,
} from "@/lib/welcome-phrases"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

/**
 * Greeting shown on the empty chat screen. The phrase is picked on the client
 * after mount to avoid hydration mismatches (it depends on time and chance),
 * and a new one is picked, with a soft transition, whenever the mode changes.
 */
export function WelcomeGreeting() {
  const { user } = useUser()
  const { mode } = useMode()
  const { settings } = useSettings()
  const { temporary } = useTemporaryChat()
  const [template, setTemplate] = useState<string | null>(null)

  useEffect(() => {
    setTemplate(pickWelcomeTemplate(mode))
  }, [mode])

  const isGuest = !user || user.anonymous || user.display_name === "Guest"
  const firstName =
    settings.nickname.trim() ||
    (isGuest ? undefined : user?.display_name?.trim().split(/\s+/)[0]) ||
    undefined

  if (temporary) {
    return (
      <motion.div
        key="temporary"
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className="mb-6 flex flex-col items-center gap-3 px-4 text-center"
      >
        <span className="bg-muted flex size-12 items-center justify-center rounded-full">
          <SheetIcon name="eyeoff" size={26} />
        </span>
        <h1 className="text-2xl font-medium tracking-tight text-balance sm:text-3xl">
          Chat temporário
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm text-balance">
          Esta conversa não será salva, não aparece no histórico e some quando
          você sair.
        </p>
      </motion.div>
    )
  }

  if (!settings.showGreeting) return null

  const text = template ? fillWelcomeTemplate(template, firstName) : ""

  return (
    <h1 className="mb-6 min-h-[2.25rem] px-4 text-center text-2xl font-medium tracking-tight text-balance sm:text-3xl">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={text || "empty"}
          className="block"
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {text || " "}
        </motion.span>
      </AnimatePresence>
    </h1>
  )
}
