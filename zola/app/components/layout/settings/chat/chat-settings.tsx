"use client"

import { Switch } from "@/components/ui/switch"
import { useSettings } from "@/lib/settings-store/provider"
import { useUserPreferences } from "@/lib/user-preference-store/provider"
import { SettingRow, SettingsGroup } from "../settings-ui"

export function ChatSettings() {
  const { settings, update } = useSettings()
  const {
    preferences,
    setPromptSuggestions,
    setShowToolInvocations,
    setShowConversationPreviews,
    setMultiModelEnabled,
  } = useUserPreferences()

  return (
    <div className="space-y-8 pb-12">
      <SettingsGroup title="Envio de mensagens">
        <SettingRow
          title="Enviar com Enter"
          description="Ligado, Enter envia e Shift+Enter quebra a linha. Desligado, Enter quebra a linha e ⌘/Ctrl+Enter envia."
        >
          <Switch
            checked={settings.enterToSend}
            onCheckedChange={(enterToSend) => update({ enterToSend })}
          />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="Tela inicial">
        <SettingRow
          title="Frase de boas-vindas"
          description="Mostra uma saudação no lugar do título quando o chat está vazio."
        >
          <Switch
            checked={settings.showGreeting}
            onCheckedChange={(showGreeting) => update({ showGreeting })}
          />
        </SettingRow>
        <SettingRow
          title="Sugestões de prompts"
          description="Mostra atalhos de prompts ao começar uma conversa."
        >
          <Switch
            checked={preferences.promptSuggestions}
            onCheckedChange={setPromptSuggestions}
          />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="Conversas">
        <SettingRow
          title="Detalhes de ferramentas"
          description="Mostra como as ferramentas foram usadas nas respostas."
        >
          <Switch
            checked={preferences.showToolInvocations}
            onCheckedChange={setShowToolInvocations}
          />
        </SettingRow>
        <SettingRow
          title="Prévia das conversas"
          description="Mostra uma prévia de cada conversa no histórico."
        >
          <Switch
            checked={preferences.showConversationPreviews}
            onCheckedChange={setShowConversationPreviews}
          />
        </SettingRow>
        <SettingRow
          title="Chat com vários modelos"
          description="Envia o mesmo prompt para vários modelos ao mesmo tempo."
        >
          <Switch
            checked={preferences.multiModelEnabled}
            onCheckedChange={setMultiModelEnabled}
          />
        </SettingRow>
      </SettingsGroup>
    </div>
  )
}
