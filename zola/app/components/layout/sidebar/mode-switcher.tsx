"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SheetIcon, type SheetIconName } from "@/components/ui/sheet-icon"
import { useMode } from "@/lib/mode-store/provider"
import { MODES, MODE_ORDER, type Mode } from "@/lib/modes"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

const MODE_ICON: Record<Mode, SheetIconName> = {
  chat: "chat",
  code: "code",
}

export function ModeSwitcher() {
  const { mode, setMode } = useMode()
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Trocar modo"
          className="hover:bg-accent/70 data-[state=open]:bg-accent/70 flex min-w-0 items-center gap-1.5 rounded-lg py-1.5 pr-2 pl-2.5 text-sm font-semibold tracking-tight transition-colors"
        >
          <span className="relative inline-flex h-5 items-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mode}
                className="whitespace-nowrap"
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                {MODES[mode].label}
              </motion.span>
            </AnimatePresence>
          </span>
          <motion.span
            className="inline-flex"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <SheetIcon name="chevron" size={16} className="opacity-70" />
          </motion.span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-[18.5rem] rounded-lg border p-1.5"
      >
        {MODE_ORDER.map((id) => {
          const selected = id === mode
          return (
            <DropdownMenuItem
              key={id}
              onSelect={() => setMode(id)}
              className="cursor-pointer gap-3 rounded-lg px-2.5 py-2.5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center">
                <SheetIcon name={MODE_ICON[id]} size={20} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium">{MODES[id].label}</span>
                <span className="text-muted-foreground text-xs leading-snug">
                  {MODES[id].description}
                </span>
              </span>
              <AnimatePresence initial={false}>
                {selected && (
                  <motion.span
                    key="check"
                    className="inline-flex"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <SheetIcon name="checkcircle" size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
