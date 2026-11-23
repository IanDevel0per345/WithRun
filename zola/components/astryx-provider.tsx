"use client"

import { Theme } from "@astryxdesign/core/theme"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { defaultThemeSlug, themes } from "../astryx-themes"

/** Astryx design tokens for the whole app; light/dark follows the site theme. */
export function AstryxProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  // The server cannot know the stored theme, so the first client render matches it
  // (light) and the real mode is applied right after mount.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const mode = mounted && resolvedTheme === "dark" ? "dark" : "light"
  return (
    <Theme theme={themes[defaultThemeSlug]} mode={mode}>
      {children}
    </Theme>
  )
}
