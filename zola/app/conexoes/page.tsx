import { LayoutApp } from "@/app/components/layout/layout-app"
import { ConnectionsPage } from "@/app/components/pages/connections-page"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"

export default function Page() {
  return (
    <MessagesProvider>
      <LayoutApp>
        <ConnectionsPage />
      </LayoutApp>
    </MessagesProvider>
  )
}
