"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { useSettings } from "@/lib/settings-store/provider"
import { useEffect, useRef } from "react"

/** Closes the sidebar on desktop at startup when the user chose so. */
export function SidebarDefaultEffect() {
  const { loaded, settings } = useSettings()
  const { setOpen, isMobile } = useSidebar()
  const applied = useRef(false)

  useEffect(() => {
    if (!loaded || applied.current) return
    applied.current = true
    if (!isMobile && !settings.sidebarOpenByDefault) setOpen(false)
  }, [loaded, settings.sidebarOpenByDefault, isMobile, setOpen])

  return null
}
