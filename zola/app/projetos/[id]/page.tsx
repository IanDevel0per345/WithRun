import { LayoutApp } from "@/app/components/layout/layout-app"
import { ProjectDetail } from "@/app/components/pages/project-detail"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <MessagesProvider>
      <LayoutApp>
        <ProjectDetail id={id} />
      </LayoutApp>
    </MessagesProvider>
  )
}
