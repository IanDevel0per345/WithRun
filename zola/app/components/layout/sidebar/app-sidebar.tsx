"use client"

import { groupChatsByDate } from "@/app/components/history/utils"
import { SettingsContent } from "@/app/components/layout/settings/settings-content"
import { useBreakpoint } from "@/app/hooks/use-breakpoint"
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
  useSidebar,
} from "@/components/ui/sidebar"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useUser } from "@/lib/user-store/provider"
import { MaterialIcon } from "@/components/ui/material-icon"
import { Pin } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { HistoryTrigger } from "../../history/history-trigger"
import { SidebarList } from "./sidebar-list"
import { SidebarProject } from "./sidebar-project"

const rowClass =
  "text-muted-foreground hover:bg-accent/70 hover:text-foreground flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-[13.5px] font-medium transition-colors"

export function AppSidebar() {
  const isMobile = useBreakpoint(768)
  const { setOpenMobile } = useSidebar()
  const { chats, pinnedChats, isLoading } = useChats()
  const { user } = useUser()
  const params = useParams<{ chatId: string }>()
  const currentChatId = params.chatId
  const router = useRouter()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const groupedChats = useMemo(() => groupChatsByDate(chats, ""), [chats])
  const hasChats = chats.length > 0
  const name = user?.display_name || "Guest"

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      className="border-border/40 border-r bg-transparent"
    >
      <SidebarHeader className="flex h-12 flex-row items-center justify-between gap-1 px-2.5">
        <button
          type="button"
          className="hover:bg-accent/70 flex min-w-0 items-center gap-2 rounded-md py-1 pr-1.5 pl-1 transition-colors"
          aria-label="Workspace: Abstraction"
        >
          <span className="bg-foreground text-background flex size-6 shrink-0 items-center justify-center rounded-md">
            <MeteorMark />
          </span>
          <span className="truncate text-sm font-semibold tracking-tight">
            Abstraction
          </span>
          <MaterialIcon name="expand_more" size={18} className="text-foreground/80 shrink-0" />
        </button>
        <div className="flex items-center">
          {isMobile && (
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              aria-label="Close sidebar"
              className="text-muted-foreground hover:text-foreground hover:bg-accent/70 inline-flex size-7 items-center justify-center rounded-md transition-colors"
            >
              <MaterialIcon name="close" size={18} className="text-foreground/80" />
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="New chat"
            title="New chat (⌘⇧U)"
            className="text-muted-foreground hover:text-foreground hover:bg-accent/70 inline-flex size-7 items-center justify-center rounded-md transition-colors"
          >
            <MaterialIcon name="edit_square" className="text-foreground/80" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="space-y-0.5 px-2.5 pt-1 pb-2">
          <HistoryTrigger
            hasSidebar={false}
            classNameTrigger={`${rowClass} group/search`}
            icon={<MaterialIcon name="search" className="text-foreground/80" />}
            label={
              <span className="flex w-full items-center gap-2.5">
                Search
                <span className="text-muted-foreground/70 ml-auto text-[11px] opacity-0 transition-opacity group-hover/search:opacity-100">
                  ⌘K
                </span>
              </span>
            }
            hasPopover={false}
          />
          <button
            type="button"
            onClick={() => router.push("/")}
            className={`${rowClass} ${!currentChatId ? "bg-accent text-foreground" : ""}`}
          >
            <MaterialIcon name="home" className="text-foreground/80" />
            Home
          </button>
        </div>

        <ScrollArea className="flex h-full px-2.5 [&>div>div]:!block">
          <SectionLabel>Projects</SectionLabel>
          <SidebarProject />

          {isLoading ? (
            <div className="h-full" />
          ) : hasChats ? (
            <div className="space-y-1 pb-4">
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
            <>
              <SectionLabel>Chats</SectionLabel>
              <div className="flex flex-col items-center px-4 py-10">
                <div className="bg-muted mb-2.5 flex size-9 items-center justify-center rounded-lg">
                  <MaterialIcon name="chat_bubble" size={20} className="text-foreground/80" />
                </div>
                <p className="text-[13px] font-medium">No chats yet</p>
                <p className="text-muted-foreground mt-0.5 text-center text-xs">
                  Your conversations with Meteor show up here.
                </p>
              </div>
            </>
          )}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-border/40 gap-0.5 border-t px-2.5 py-2">
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className={rowClass}
        >
          <MaterialIcon name="settings" className="text-foreground/80" />
          Settings
        </button>
        <button type="button" className={rowClass}>
          <MaterialIcon name="bolt" className="text-foreground/80" />
          Upgrade to Pro
          <span className="bg-foreground text-background ml-auto rounded px-1.5 py-px text-[10px] font-semibold">
            New
          </span>
        </button>
        <div className="mt-1 flex items-center gap-2 px-1 pt-2">
          <div className="bg-muted text-foreground flex size-6 items-center justify-center rounded-full text-[11px] font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="text-muted-foreground min-w-0 truncate text-xs">
            {name} · Free
          </span>
          <button
            type="button"
            aria-label="Help"
            className="text-muted-foreground hover:text-foreground ml-auto"
          >
            <MaterialIcon name="help" size={18} className="text-foreground/80" />
          </button>
        </div>
      </SidebarFooter>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="flex h-[80%] min-h-[480px] w-full flex-col gap-0 p-0 sm:max-w-[768px]">
          <DialogHeader className="border-border border-b px-6 py-5">
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <SettingsContent />
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-muted-foreground/80 px-2 pt-3 pb-1 text-xs font-medium">
      {children}
    </h3>
  )
}

function MeteorMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="5" fill="currentColor" />
      <path
        d="M12 12 3 3M10 17 4 23M17 10 23 4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}
