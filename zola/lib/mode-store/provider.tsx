"use client"

import { SYSTEM_PROMPT_DEFAULT } from "@/lib/config"
import { buildAssistantBlock, useAssistant } from "@/lib/assistant-store/provider"
import { useSettings, type Settings } from "@/lib/settings-store/provider"
import { CODE_SYSTEM_PROMPT, type Mode } from "@/lib/modes"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

const STORAGE_KEY = "meteor-mode"

type ModeContextType = {
  mode: Mode
  setMode: (mode: Mode) => void
}

const ModeContext = createContext<ModeContextType>({
  mode: "chat",
  setMode: () => {},
})

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const { settings, loaded } = useSettings()
  const [mode, setModeState] = useState<Mode>("chat")

  // Choose the starting mode once the settings are known: the last used mode
  // (if remembered) or the default mode from the settings.
  useEffect(() => {
    if (!loaded) return
    let initial: Mode = settings.defaultMode
    if (settings.rememberMode) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved === "chat" || saved === "code") initial = saved
      } catch {}
    }
    setModeState(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  const setMode = useCallback((next: Mode) => {
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }, [])

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode])

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}

export function useMode() {
  return useContext(ModeContext)
}

const STYLE_LINE: Record<Settings["responseStyle"], string | null> = {
  concise: "Keep answers short and to the point; skip filler.",
  balanced: null,
  detailed: "Give thorough, step-by-step answers with examples when useful.",
}

const LANGUAGE_LINE: Record<Settings["responseLanguage"], string | null> = {
  auto: null,
  pt: "Always reply in Portuguese (Brazil).",
  en: "Always reply in English.",
  es: "Always reply in Spanish.",
}

/** Builds the personalization block appended to the system prompt. */
export function buildPreferenceBlock(settings: Settings): string {
  const lines: string[] = []
  if (settings.nickname.trim())
    lines.push(`The user's name is ${settings.nickname.trim()}; use it naturally, not in every message.`)
  if (settings.aboutYou.trim())
    lines.push(`About the user: ${settings.aboutYou.trim()}`)
  const style = STYLE_LINE[settings.responseStyle]
  if (style) lines.push(style)
  const language = LANGUAGE_LINE[settings.responseLanguage]
  if (language) lines.push(language)
  if (settings.customInstructions.trim())
    lines.push(`Custom instructions from the user: ${settings.customInstructions.trim()}`)
  return lines.length ? `User preferences:\n${lines.map((l) => `- ${l}`).join("\n")}` : ""
}

/** Re-renders once a minute (only when enabled) so "now" in the prompt stays fresh. */
function useMinuteClock(enabled: boolean) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    if (!enabled) return
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [enabled])
  return now
}

/** System prompt: mode + personalization + abilities, skills and memory. */
export function useSystemPrompt(userPrompt?: string | null) {
  const { mode } = useMode()
  const { settings } = useSettings()
  const assistant = useAssistant()
  const now = useMinuteClock(assistant.abilities.schedule)
  return useMemo(() => {
    const base =
      mode === "code"
        ? [CODE_SYSTEM_PROMPT, userPrompt].filter(Boolean).join("\n\n")
        : userPrompt || SYSTEM_PROMPT_DEFAULT
    const prefs = assistant.abilities.useProfile
      ? buildPreferenceBlock(settings)
      : ""
    const extras = buildAssistantBlock(assistant, now)
    return [base, prefs, extras].filter(Boolean).join("\n\n")
  }, [mode, userPrompt, settings, assistant, now])
}
