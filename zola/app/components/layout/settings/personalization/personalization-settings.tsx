"use client"

import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { MODE_ORDER, MODES } from "@/lib/modes"
import {
  ABOUT_MAX,
  INSTRUCTIONS_MAX,
  NICKNAME_MAX,
  useSettings,
} from "@/lib/settings-store/provider"
import {
  CharCounter,
  Segmented,
  SettingRow,
  SettingsGroup,
} from "../settings-ui"

export function PersonalizationSettings() {
  const { settings, update } = useSettings()

  return (
    <div className="space-y-8 pb-12">
      <SettingsGroup
        title="Sobre você"
        description="A IA usa isto para responder do seu jeito. Fica salvo só neste navegador."
      >
        <SettingRow
          vertical
          title="Apelido"
          description="Como a IA deve te chamar. Também aparece nas frases de boas-vindas."
        >
          <Input
            value={settings.nickname}
            maxLength={NICKNAME_MAX}
            onChange={(e) => update({ nickname: e.target.value })}
            placeholder="Ex.: Ian"
          />
        </SettingRow>
        <SettingRow
          vertical
          title="Contexto"
          description="Profissão, interesses ou qualquer coisa que ajude a IA a te entender."
        >
          <Textarea
            className="min-h-20"
            value={settings.aboutYou}
            maxLength={ABOUT_MAX}
            onChange={(e) => update({ aboutYou: e.target.value })}
            placeholder="Ex.: Sou desenvolvedor front-end e estou criando uma empresa de IA."
          />
          <CharCounter value={settings.aboutYou} max={ABOUT_MAX} />
        </SettingRow>
        <SettingRow
          vertical
          title="Instruções personalizadas"
          description="Como a IA deve responder. Vale para todas as conversas novas."
        >
          <Textarea
            className="min-h-24"
            value={settings.customInstructions}
            maxLength={INSTRUCTIONS_MAX}
            onChange={(e) => update({ customInstructions: e.target.value })}
            placeholder="Ex.: Seja direto, use exemplos práticos e evite jargões."
          />
          <CharCounter
            value={settings.customInstructions}
            max={INSTRUCTIONS_MAX}
          />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="Respostas">
        <SettingRow
          title="Estilo"
          description="O tamanho e a profundidade das respostas."
        >
          <Segmented
            ariaLabel="Estilo das respostas"
            value={settings.responseStyle}
            onChange={(responseStyle) => update({ responseStyle })}
            options={[
              { value: "concise", label: "Conciso" },
              { value: "balanced", label: "Equilibrado" },
              { value: "detailed", label: "Detalhado" },
            ]}
          />
        </SettingRow>
        <SettingRow
          title="Idioma"
          description="Automático responde no idioma em que você escrever."
        >
          <Segmented
            ariaLabel="Idioma das respostas"
            value={settings.responseLanguage}
            onChange={(responseLanguage) => update({ responseLanguage })}
            options={[
              { value: "auto", label: "Automático" },
              { value: "pt", label: "Português" },
              { value: "en", label: "English" },
              { value: "es", label: "Español" },
            ]}
          />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="Modo ao abrir">
        <SettingRow
          title="Modo padrão"
          description="O modo em que o Meteor AI começa."
        >
          <Segmented
            ariaLabel="Modo padrão"
            value={settings.defaultMode}
            onChange={(defaultMode) => update({ defaultMode })}
            options={MODE_ORDER.map((id) => ({
              value: id,
              label: MODES[id].label,
            }))}
          />
        </SettingRow>
        <SettingRow
          title="Lembrar o último modo usado"
          description="Desligado, sempre abre no modo padrão."
        >
          <Switch
            checked={settings.rememberMode}
            onCheckedChange={(rememberMode) => update({ rememberMode })}
          />
        </SettingRow>
      </SettingsGroup>
    </div>
  )
}
