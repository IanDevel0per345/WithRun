"use client"

import { SheetIcon } from "@/components/ui/sheet-icon"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTemporaryChat } from "@/lib/temporary-chat/provider"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { usePathname, useRouter } from "next/navigation"

export function TemporaryChatButton() {
  const { temporary, setTemporary } = useTemporaryChat()
  const router = useRouter()
  const pathname = usePathname()

  const onClick = () => {
    const next = !temporary
    setTemporary(next)
    // A temporary chat is always a brand new conversation.
    if (next && pathname !== "/") router.push("/")
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          type="button"
          onClick={onClick}
          aria-label="Chat temporário"
          aria-pressed={temporary}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "inline-flex size-9 items-center justify-center transition-opacity",
            "opacity-100"
          )}
        >
          <motion.span
            key={String(temporary)}
            initial={{ rotate: -20, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="inline-flex"
          >
            <SheetIcon name="eyeoff" size={22} />
          </motion.span>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent>
        {temporary ? "Sair do chat temporário" : "Chat temporário"}
      </TooltipContent>
    </Tooltip>
  )
}
