"use client"

import { Switch } from "@/components/ui/switch"
import { useSettings } from "@/lib/settings-store/provider"
import { useTheme } from "next-themes"
import { LayoutSettings } from "./layout-settings"
import {
  Segmented,
  SettingRow,
  SettingsGroup,
  Swatches,
} from "../settings-ui"

export function AppearanceSettings() {
  const { settings, update } = useSettings()
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-8 pb-12">
      <SettingsGroup title="Cores">
        <SettingRow title="Tema" description="Claro, escuro ou o mesmo do seu sistema.">
          <Segmented
            ariaLabel="Tema"
            value={(theme as "system" | "light" | "dark") || "system"}
            onChange={setTheme}
            options={[
              { value: "system", label: "Sistema" },
              { value: "light", label: "Claro" },
              { value: "dark", label: "Escuro" },
            ]}
          />
        </SettingRow>
        <SettingRow
          title="Cor de destaque"
          description="Muda a cor do botão de enviar, do cursor e da seleção de texto."
        >
          <Swatches
            value={settings.accent}
            onChange={(accent) => update({ accent })}
            options={[
              { value: "padrao", label: "Padrão", color: "var(--foreground)", checkColor: "var(--background)" },
              { value: "azul", label: "Azul", color: "#2563eb" },
              { value: "verde", label: "Verde", color: "#16a34a" },
              { value: "roxo", label: "Roxo", color: "#7c3aed" },
              { value: "laranja", label: "Laranja", color: "#ea580c" },
              { value: "rosa", label: "Rosa", color: "#db2777" },
            ]}
          />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="Texto">
        <SettingRow
          title="Tamanho do texto"
          description="Aumenta ou diminui todo o aplicativo."
        >
          <Segmented
            ariaLabel="Tamanho do texto"
            value={settings.fontSize}
            onChange={(fontSize) => update({ fontSize })}
            options={[
              { value: "small", label: "Pequeno" },
              { value: "medium", label: "Médio" },
              { value: "large", label: "Grande" },
            ]}
          />
        </SettingRow>
        <SettingRow title="Fonte" description="O estilo das letras em todo o aplicativo.">
          <Segmented
            ariaLabel="Fonte"
            value={settings.fontFamily}
            onChange={(fontFamily) => update({ fontFamily })}
            options={[
              { value: "sans", label: "Padrão" },
              { value: "serif", label: "Serifada" },
              { value: "mono", label: "Monoespaçada" },
            ]}
          />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="Chat">
        <SettingRow
          title="Largura do chat"
          description="O quanto a conversa e o campo de mensagem ocupam na tela."
        >
          <Segmented
            ariaLabel="Largura do chat"
            value={settings.chatWidth}
            onChange={(chatWidth) => update({ chatWidth })}
            options={[
              { value: "narrow", label: "Estreita" },
              { value: "default", label: "Padrão" },
              { value: "wide", label: "Ampla" },
            ]}
          />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="Movimento e menu">
        <SettingRow
          title="Reduzir animações"
          description="Deixa as transições quase instantâneas."
        >
          <Switch
            checked={settings.reduceMotion}
            onCheckedChange={(reduceMotion) => update({ reduceMotion })}
          />
        </SettingRow>
        <SettingRow
          title="Sidebar aberta ao iniciar"
          description="Desligado, o app abre com a sidebar fechada (no computador)."
        >
          <Switch
            checked={settings.sidebarOpenByDefault}
            onCheckedChange={(sidebarOpenByDefault) =>
              update({ sidebarOpenByDefault })
            }
          />
        </SettingRow>
      </SettingsGroup>

      <LayoutSettings />
    </div>
  )
}
