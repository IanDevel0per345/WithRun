import { LayoutApp } from "@/app/components/layout/layout-app"
import { WorkspaceViewer } from "@/app/components/pages/workspace-viewer"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  return (
    <MessagesProvider>
      <LayoutApp>
        <WorkspaceViewer id={id} />
      </LayoutApp>
    </MessagesProvider>
  )
}
