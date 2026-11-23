import { LayoutApp } from "@/app/components/layout/layout-app"
import { SchedulesPage } from "@/app/components/pages/schedules-page"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"

export default function Page() {
  return (
    <MessagesProvider>
      <LayoutApp>
        <SchedulesPage />
      </LayoutApp>
    </MessagesProvider>
  )
}
