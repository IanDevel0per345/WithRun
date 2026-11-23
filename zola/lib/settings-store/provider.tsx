"use client"

import type { Mode } from "@/lib/modes"
import { MotionConfig } from "motion/react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

export type Accent = "padrao" | "azul" | "verde" | "roxo" | "laranja" | "rosa"
export type FontSize = "small" | "medium" | "large"
export type FontFamily = "sans" | "serif" | "mono"
export type ChatWidth = "narrow" | "default" | "wide"
export type ResponseStyle = "concise" | "balanced" | "detailed"
export type ResponseLanguage = "auto" | "pt" | "en" | "es"

export type Settings = {
  // Personalização
  nickname: string
  aboutYou: string
  customInstructions: string
  responseStyle: ResponseStyle
  responseLanguage: ResponseLanguage
  defaultMode: Mode
  rememberMode: boolean
  // Aparência
  accent: Accent
  fontSize: FontSize
  fontFamily: FontFamily
  chatWidth: ChatWidth
  reduceMotion: boolean
  sidebarOpenByDefault: boolean
  // Chat
  enterToSend: boolean
  showGreeting: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  nickname: "",
  aboutYou: "",
  customInstructions: "",
  responseStyle: "balanced",
  responseLanguage: "auto",
  defaultMode: "chat",
  rememberMode: true,
  accent: "padrao",
  fontSize: "medium",
  fontFamily: "sans",
  chatWidth: "default",
  reduceMotion: false,
  sidebarOpenByDefault: true,
  enterToSend: true,
  showGreeting: true,
}

export const NICKNAME_MAX = 40
export const ABOUT_MAX = 500
export const INSTRUCTIONS_MAX = 1000

const STORAGE_KEY = "meteor-settings"

const oneOf = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback
const bool = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback
const text = (value: unknown, max: number, fallback = "") =>
  typeof value === "string" ? value.slice(0, max) : fallback

/** Validates unknown data (storage or imported file) into a full Settings. */
export function sanitizeSettings(raw: unknown): Settings {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>
  const d = DEFAULT_SETTINGS
  return {
    nickname: text(r.nickname, NICKNAME_MAX),
    aboutYou: text(r.aboutYou, ABOUT_MAX),
    customInstructions: text(r.customInstructions, INSTRUCTIONS_MAX),
    responseStyle: oneOf(r.responseStyle, ["concise", "balanced", "detailed"], d.responseStyle),
    responseLanguage: oneOf(r.responseLanguage, ["auto", "pt", "en", "es"], d.responseLanguage),
    defaultMode: oneOf(r.defaultMode, ["chat", "code"], d.defaultMode),
    rememberMode: bool(r.rememberMode, d.rememberMode),
    accent: oneOf(r.accent, ["padrao", "azul", "verde", "roxo", "laranja", "rosa"], d.accent),
    fontSize: oneOf(r.fontSize, ["small", "medium", "large"], d.fontSize),
    fontFamily: oneOf(r.fontFamily, ["sans", "serif", "mono"], d.fontFamily),
    chatWidth: oneOf(r.chatWidth, ["narrow", "default", "wide"], d.chatWidth),
    reduceMotion: bool(r.reduceMotion, d.reduceMotion),
    sidebarOpenByDefault: bool(r.sidebarOpenByDefault, d.sidebarOpenByDefault),
    enterToSend: bool(r.enterToSend, d.enterToSend),
    showGreeting: bool(r.showGreeting, d.showGreeting),
  }
}

type SettingsContextType = {
  settings: Settings
  /** true once the saved settings were read from the browser */
  loaded: boolean
  update: (patch: Partial<Settings>) => void
  replaceAll: (raw: unknown) => void
  reset: () => void
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loaded: false,
  update: () => {},
  replaceAll: () => {},
  reset: () => {},
})

const FONT_PX: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)

  // Read saved settings after mount (keeps server and client markup equal).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setSettings(sanitizeSettings(JSON.parse(saved)))
    } catch {}
    setLoaded(true)
  }, [])

  const persist = useCallback((next: Settings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [])

  const update = useCallback(
    (patch: Partial<Settings>) => {
      setSettings((prev) => {
        const next = sanitizeSettings({ ...prev, ...patch })
        persist(next)
        return next
      })
    },
    [persist]
  )

  const replaceAll = useCallback(
    (raw: unknown) => {
      const next = sanitizeSettings(raw)
      setSettings(next)
      persist(next)
    },
    [persist]
  )

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  // Apply visual settings to the document.
  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = FONT_PX[settings.fontSize]
    root.dataset.accent = settings.accent === "padrao" ? "" : settings.accent
    root.dataset.font = settings.fontFamily
    root.dataset.chatWidth = settings.chatWidth
    root.dataset.reduceMotion = String(settings.reduceMotion)
  }, [settings])

  const value = useMemo(
    () => ({ settings, loaded, update, replaceAll, reset }),
    [settings, loaded, update, replaceAll, reset]
  )

  return (
    <SettingsContext.Provider value={value}>
      <MotionConfig reducedMotion={settings.reduceMotion ? "always" : "user"}>
        {children}
      </MotionConfig>
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
