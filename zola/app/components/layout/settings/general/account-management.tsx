"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useMessages } from "@/lib/chat-store/messages/provider"
import { clearAllIndexedDBStores } from "@/lib/chat-store/persist"
import { useUser } from "@/lib/user-store/provider"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { useRouter } from "next/navigation"

export function AccountManagement() {
  const { signOut } = useUser()
  const { resetChats } = useChats()
  const { resetMessages } = useMessages()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await resetMessages()
      await resetChats()
      await signOut()
      await clearAllIndexedDBStores()
      router.push("/")
    } catch (e) {
      console.error("Sign out failed:", e)
      toast({ title: "Não foi possível sair", status: "error" })
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium">Conta</h3>
        <p className="text-muted-foreground text-xs">
          Sair deste dispositivo
        </p>
      </div>
      <Button
        variant="default"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleSignOut}
      >
        <SheetIcon name="arrowr" size={16} invert />
        <span>Sair</span>
      </Button>
    </div>
  )
}
