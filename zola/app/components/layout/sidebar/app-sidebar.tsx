"use client"

import { groupChatsByDate } from "@/app/components/history/utils"
import { SettingsContent } from "@/app/components/layout/settings/settings-content"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useUser } from "@/lib/user-store/provider"
import { useKeyShortcut } from "@/app/hooks/use-key-shortcut"
import { HeaderSidebarTrigger } from "@/app/components/layout/header-sidebar-trigger"
import { BrandLogo } from "@/components/ui/brand-logo"
import { SheetIcon, type SheetIconName } from "@/components/ui/sheet-icon"
import { Pin } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { ModeSwitcher } from "./mode-switcher"
import { SidebarList } from "./sidebar-list"

const rowClass =
  "text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-full items-center gap-1.5 rounded-lg px-2.5 text-sm transition-colors"

const HOME_ITEMS: { href: string; label: string; icon: SheetIconName }[] = [
  { href: "/projetos", label: "Projetos", icon: "folder" },
  { href: "/ambiente", label: "Meu ambiente", icon: "layers" },
  { href: "/agendamentos", label: "Agendamentos", icon: "calendar" },
  { href: "/conexoes", label: "Conexões", icon: "link" },
]

export function AppSidebar() {
  const { chats, pinnedChats, isLoading } = useChats()
  const { user } = useUser()
  const params = useParams<{ chatId: string }>()
  const currentChatId = params.chatId
  const router = useRouter()
  const pathname = usePathname()
  const isNewConversation = pathname === "/" || pathname.startsWith("/c/")
  const [settingsOpen, setSettingsOpen] = useState(false)

  useKeyShortcut(
    (e) => (e.key === "u" || e.key === "U") && e.metaKey && e.shiftKey,
    () => router.push("/")
  )

  const groupedChats = useMemo(() => groupChatsByDate(chats, ""), [chats])
  const hasChats = chats.length > 0
  const name = user?.display_name || "Guest"
  const displayName = name === "Guest" ? "Convidado" : name

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      className="border-border border-r bg-transparent"
    >
      <SidebarHeader className="flex h-14 flex-row items-center justify-between gap-1 px-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Link href="/" aria-label="Meteor AI" className="shrink-0 rounded-md">
            <BrandLogo size={34} />
          </Link>
          <ModeSwitcher />
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="New chat"
            title="New chat (⌘⇧U)"
            className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-lg transition-colors"
          >
            <SheetIcon name="newchat" size={16} />
          </button>
          <HeaderSidebarTrigger className="size-8" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="border-border mx-2 border-b px-0 pt-1 pb-2">
          <button
            type="button"
            onClick={() => router.push("/")}
            className={`${rowClass} ${isNewConversation ? "bg-accent font-medium text-foreground" : ""}`}
          >
            <SheetIcon name="plus" size={16} />
            Nova conversa
          </button>
        </div>

        <ScrollArea className="flex h-full px-2 [&>div>div]:!block">
          <SectionLabel>Home</SectionLabel>
          <nav aria-label="Home" className="space-y-1.5 pb-1">
            {HOME_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`${rowClass} ${active ? "bg-accent font-medium text-foreground" : ""}`}
                >
                  <SheetIcon name={item.icon} size={16} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <SectionLabel>Chats</SectionLabel>
          {isLoading ? (
            <div className="h-full" />
          ) : hasChats ? (
            <div className="space-y-1.5 pb-4">
              {pinnedChats.length > 0 && (
                <SidebarList
                  key="pinned"
                  title="Pinned"
                  icon={<Pin className="size-3" />}
                  items={pinnedChats}
                  currentChatId={currentChatId}
                />
              )}
              {groupedChats?.map((group) => (
                <SidebarList
                  key={group.name}
                  title={group.name}
                  items={group.chats}
                  currentChatId={currentChatId}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center px-4 py-10">
              <div className="bg-muted mb-2.5 flex size-9 items-center justify-center rounded-lg">
                <SheetIcon name="chatdots" size={22} />
              </div>
              <p className="text-sm font-medium">Nenhuma conversa ainda</p>
              <p className="text-muted-foreground mt-0.5 text-center text-xs">
                Suas conversas com o Meteor aparecem aqui.
              </p>
            </div>
          )}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-border gap-1.5 border-t px-2 py-2">
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className={rowClass}
        >
          <SheetIcon name="settings" size={16} />
          Configurações
        </button>
        <div className="bg-popover mt-1 flex items-center gap-2 rounded-full border px-3 py-1.5">
          <div className="bg-muted text-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="text-foreground min-w-0 truncate text-sm font-medium">
            {displayName}
            <span className="text-muted-foreground font-normal"> · Grátis</span>
          </span>
        </div>
      </SidebarFooter>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="flex h-[80%] min-h-[480px] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[768px]">
          <DialogHeader className="border-border shrink-0 border-b px-5 py-4 sm:px-6 sm:py-5">
            <DialogTitle>Configurações</DialogTitle>
          </DialogHeader>
          <SettingsContent />
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-muted-foreground px-2.5 pt-3 pb-1 text-xs">
      {children}
    </h3>
  )
}
