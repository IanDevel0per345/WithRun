"use client"

import { useUser } from "@/lib/user-store/provider"
import {
  fillWelcomeTemplate,
  pickWelcomeTemplate,
} from "@/lib/welcome-phrases"
import { useEffect, useState } from "react"

/**
 * Greeting shown on the empty chat screen. The phrase is picked on the client
 * after mount to avoid hydration mismatches (it depends on time and chance).
 */
export function WelcomeGreeting() {
  const { user } = useUser()
  const [template, setTemplate] = useState<string | null>(null)

  useEffect(() => {
    setTemplate(pickWelcomeTemplate())
  }, [])

  const isGuest = !user || user.anonymous || user.display_name === "Guest"
  const firstName = isGuest
    ? undefined
    : user.display_name?.trim().split(/\s+/)[0] || undefined

  return (
    <h1 className="mb-6 min-h-[2.25rem] text-3xl font-medium tracking-tight">
      {template ? fillWelcomeTemplate(template, firstName) : " "}
    </h1>
  )
}
