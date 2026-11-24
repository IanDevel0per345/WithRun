"use client"

import { Button } from "@/components/ui/button"
import { DrawerClose } from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { cn, isDev } from "@/lib/utils"
import { SheetIcon, type SheetIconName } from "@/components/ui/sheet-icon"
import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { ByokSection } from "./apikeys/byok-section"
import { AppearanceSettings } from "./appearance/appearance-settings"
import { ChatSettings } from "./chat/chat-settings"
import { ConnectionsPlaceholder } from "./connections/connections-placeholder"
import { DeveloperTools } from "./connections/developer-tools"
import { OllamaSection } from "./connections/ollama-section"
import { DataSettings } from "./data/data-settings"
import { AccountManagement } from "./general/account-management"
import { UserProfile } from "./general/user-profile"
import { ModelsSettings } from "./models/models-settings"
import { PersonalizationSettings } from "./personalization/personalization-settings"
import { ShortcutsSettings } from "./shortcuts/shortcuts-settings"

type SettingsContentProps = {
  isDrawer?: boolean
}

type Tab = {
  value: string
  label: string
  icon: SheetIconName
  content: React.ReactNode
}

export function SettingsContent({ isDrawer = false }: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState("general")
  const isMobile = useBreakpoint(768)
  const compact = isDrawer || isMobile
  const [direction, setDirection] = useState(1)
  const stripRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const tabs: Tab[] = [
    {
      value: "general",
      label: "Geral",
      icon: "settings",
      content: (
        <>
          <UserProfile />
          {isSupabaseEnabled && <AccountManagement />}
        </>
      ),
    },
    {
      value: "personalization",
      label: "Personalização",
      icon: "sparkle",
      content: <PersonalizationSettings />,
    },
    {
      value: "appearance",
      label: "Aparência",
      icon: "pen",
      content: <AppearanceSettings />,
    },
    {
      value: "chat",
      label: "Chat",
      icon: "chat",
      content: <ChatSettings />,
    },
    {
      value: "shortcuts",
      label: "Atalhos",
      icon: "command",
      content: <ShortcutsSettings />,
    },
    {
      value: "data",
      label: "Dados",
      icon: "database",
      content: <DataSettings />,
    },
    {
      value: "apikeys",
      label: "Chaves de API",
      icon: "key",
      content: <ByokSection />,
    },
    {
      value: "models",
      label: "Modelos",
      icon: "cube",
      content: <ModelsSettings />,
    },
    {
      value: "connections",
      label: "Conexões",
      icon: "link",
      content: (
        <>
          {!isDev && <ConnectionsPlaceholder />}
          {isDev && <OllamaSection />}
          {isDev && <DeveloperTools />}
        </>
      ),
    },
  ]

  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.value === activeTab)
  )

  const goTo = (index: number) => {
    const next = tabs[Math.min(tabs.length - 1, Math.max(0, index))]
    if (!next || next.value === activeTab) return
    setDirection(index > activeIndex ? 1 : -1)
    setActiveTab(next.value)
  }

  // Keep the selected tab visible (and centered) in the horizontal strip.
  useEffect(() => {
    if (!compact) return
    const el = stripRef.current?.querySelector<HTMLElement>(
      `[data-tab="${activeTab}"]`
    )
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [activeTab, compact])

  if (compact) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col">
        {isDrawer && (
          <div className="border-border flex items-center justify-between border-b px-4 py-2">
            <h2 className="text-lg font-medium">Configurações</h2>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <SheetIcon name="close" size={16} />
              </Button>
            </DrawerClose>
          </div>
        )}
        <div className="border-border relative shrink-0 border-b">
          <div
            ref={stripRef}
            role="tablist"
            aria-label="Seções das configurações"
            className="flex snap-x gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => {
              const active = tab.value === activeTab
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  data-tab={tab.value}
                  aria-selected={active}
                  onClick={() => goTo(tabs.findIndex((t) => t.value === tab.value))}
                  className={cn(
                    "relative flex shrink-0 snap-center items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="settings-mobile-pill"
                      className="bg-accent absolute inset-0 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <SheetIcon
                      name={tab.icon}
                      size={16}
                      className="translate-y-[-0.5px]"
                    />
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pt-4 pb-10"
          onTouchStart={(e) => {
            const t = e.touches[0]
            touchStart.current = { x: t.clientX, y: t.clientY }
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current
            touchStart.current = null
            if (!start) return
            const t = e.changedTouches[0]
            const dx = t.clientX - start.x
            const dy = t.clientY - start.y
            // Horizontal swipe moves to the next / previous section.
            if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
              goTo(activeIndex + (dx < 0 ? 1 : -1))
            }
          }}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="space-y-6"
            >
              {tabs[activeIndex].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-y-auto",
        isDrawer ? "p-0 pb-16" : "py-0"
      )}
    >
      {isDrawer && (
        <div className="border-border mb-2 flex items-center justify-between border-b px-4 pb-2">
          <h2 className="text-lg font-medium">Configurações</h2>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <SheetIcon name="close" size={16} />
            </Button>
          </DrawerClose>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className={cn(
          "flex w-full flex-row",
          isDrawer ? "" : "flex min-h-[400px]"
        )}
      >
        {isDrawer ? (
          // Mobile - tabs on top, scrollable
          <div className="w-full items-start justify-start overflow-hidden py-4">
            <TabsList className="mb-4 flex w-full min-w-0 flex-nowrap items-center justify-start overflow-x-auto bg-transparent px-0">
              {tabs.map((tab, i) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "flex shrink-0 items-center gap-2",
                    i === 0 && "ml-6"
                  )}
                >
                  <SheetIcon
                    name={tab.icon}
                    size={16}
                    className="translate-y-[-0.5px]"
                  />
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="space-y-6 px-6"
              >
                {tab.content}
              </TabsContent>
            ))}
          </div>
        ) : (
          // Desktop - tabs on the left
          <>
            <TabsList className="block w-52 shrink-0 rounded-none bg-transparent px-3 pt-4">
              <div className="flex w-full flex-col gap-1">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="w-full justify-start rounded-md px-3 py-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <SheetIcon
                        name={tab.icon}
                        size={16}
                        className="translate-y-[-0.5px]"
                      />
                      <span>{tab.label}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>

            <div className="flex-1 overflow-auto px-6 pt-4">
              {tabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="mt-0 space-y-6"
                >
                  {tab.content}
                </TabsContent>
              ))}
            </div>
          </>
        )}
      </Tabs>
    </div>
  )
}
