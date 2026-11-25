"use client"

import { SheetIcon } from "@/components/ui/sheet-icon"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type HeaderSidebarTriggerProps = React.HTMLAttributes<HTMLButtonElement>

export function HeaderSidebarTrigger({
  className,
  ...props
}: HeaderSidebarTriggerProps) {
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar()
  const isOpen = isMobile ? openMobile : open

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            "pointer-events-auto",
            "text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors",
            "inline-flex size-9 items-center justify-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            className
          )}
          {...props}
        >
          <SheetIcon name="sidebar" size={20} />
          <span className="sr-only">
            {isOpen ? "Close sidebar" : "Open sidebar"}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent>{isOpen ? "Close sidebar" : "Open sidebar"}</TooltipContent>
    </Tooltip>
  )
}
