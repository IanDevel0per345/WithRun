"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { useUser } from "@/lib/user-store/provider"
import { SettingRow, SettingsGroup } from "../settings-ui"

export function UserProfile() {
  const { user } = useUser()

  if (!user) return null

  const isGuest = user.anonymous || user.display_name === "Guest"

  return (
    <SettingsGroup title="Perfil">
      <div className="flex items-center gap-4 px-4 py-4">
        <div className="bg-muted flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full">
          {user.profile_image ? (
            <Avatar className="size-12">
              <AvatarImage src={user.profile_image} className="object-cover" />
              <AvatarFallback>{user.display_name?.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <SheetIcon name="user" size={24} />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-sm font-medium">
            {isGuest ? "Convidado" : user.display_name}
          </h4>
          <p className="text-muted-foreground text-sm">
            {isGuest
              ? "Você está sem conta. Suas configurações ficam neste navegador."
              : user.email}
          </p>
        </div>
      </div>
      {isGuest && (
        <SettingRow
          title="Dica"
          description="Personalize o Meteor AI na aba Personalização, ela vale mesmo sem conta."
        >
          <span />
        </SettingRow>
      )}
    </SettingsGroup>
  )
}
