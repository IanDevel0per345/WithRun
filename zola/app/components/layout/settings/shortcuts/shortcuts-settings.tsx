"use client"

import { SettingRow, SettingsGroup } from "../settings-ui"
import { useSettings } from "@/lib/settings-store/provider"

function Keys({ keys }: { keys: string[] }) {
  return (
    <span className="flex items-center gap-1">
      {keys.map((key) => (
        <kbd
          key={key}
          className="border-border bg-muted text-foreground inline-flex min-w-6 items-center justify-center rounded-md border px-1.5 py-0.5 font-sans text-xs font-medium shadow-[0_1px_0_var(--border)]"
        >
          {key}
        </kbd>
      ))}
    </span>
  )
}

export function ShortcutsSettings() {
  const { settings } = useSettings()
  return (
    <div className="space-y-8 pb-12">
      <SettingsGroup title="Escrevendo">
        <SettingRow
          title="Enviar mensagem"
          description={
            settings.enterToSend
              ? "Padrão: Enter envia."
              : "Você escolheu enviar com ⌘/Ctrl+Enter."
          }
        >
          <Keys keys={settings.enterToSend ? ["Enter"] : ["⌘ / Ctrl", "Enter"]} />
        </SettingRow>
        <SettingRow title="Quebrar a linha">
          <Keys keys={settings.enterToSend ? ["Shift", "Enter"] : ["Enter"]} />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="Navegação">
        <SettingRow title="Abrir ou fechar a sidebar">
          <Keys keys={["⌘ / Ctrl", "B"]} />
        </SettingRow>
        <SettingRow
          title="Trocar de modelo"
          description="Funciona no Mac (usa a tecla ⌘)."
        >
          <Keys keys={["⌘", "Shift", "P"]} />
        </SettingRow>
        <SettingRow title="Fechar menus e janelas">
          <Keys keys={["Esc"]} />
        </SettingRow>
      </SettingsGroup>
    </div>
  )
}
