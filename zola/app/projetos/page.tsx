import { LayoutApp } from "@/app/components/layout/layout-app"
import { ProjectsPage } from "@/app/components/pages/projects-page"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"

export default function Page() {
  return (
    <MessagesProvider>
      <LayoutApp>
        <ProjectsPage />
      </LayoutApp>
    </MessagesProvider>
  )
}
