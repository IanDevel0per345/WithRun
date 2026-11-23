import { LayoutApp } from "@/app/components/layout/layout-app"
import { WorkspacePage } from "@/app/components/pages/workspace-page"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"

export default function Page() {
  return (
    <MessagesProvider>
      <LayoutApp>
        <WorkspacePage />
      </LayoutApp>
    </MessagesProvider>
  )
}
