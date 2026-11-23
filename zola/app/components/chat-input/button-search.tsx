import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { cn } from "@/lib/utils"
import React from "react"
import { PopoverContentAuth } from "./popover-content-auth"

type ButtonSearchProps = {
  isSelected?: boolean
  onToggle?: (isSelected: boolean) => void
  isAuthenticated: boolean
}

const baseClass =
  "text-muted-foreground hover:bg-accent hover:text-foreground size-9 shrink-0 rounded-full bg-transparent p-0 shadow-none transition-all duration-150 dark:bg-transparent"

export function ButtonSearch({
  isSelected = false,
  onToggle,
  isAuthenticated,
}: ButtonSearchProps) {
  const handleClick = () => {
    const newState = !isSelected
    onToggle?.(newState)
  }

  if (!isAuthenticated) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={baseClass}
            type="button"
            aria-label="Search the web"
          >
            <SheetIcon name="globe" size={19} />
          </Button>
        </PopoverTrigger>
        <PopoverContentAuth />
      </Popover>
    )
  }

  return (
    <Button
      variant="ghost"
      type="button"
      aria-label="Search the web"
      aria-pressed={isSelected}
      className={cn(
        baseClass,
        isSelected &&
          "bg-[#E5F3FE] text-[#0091FF] hover:bg-[#E5F3FE] dark:bg-[#0091FF]/20 dark:hover:bg-[#0091FF]/25"
      )}
      onClick={handleClick}
    >
      <SheetIcon name="globe" size={19} />
    </Button>
  )
}
