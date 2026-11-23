"use client"

import { Switch } from "@/components/ui/switch"
import { useAssistant, type AbilityKey } from "@/lib/assistant-store/provider"
import { SettingRow, SettingsGroup } from "../../layout/settings/settings-ui"

const GROUPS: { title: string; description: string; items: { key: AbilityKey; title: string; description: string }[] }[] = [
  {
    title: "Criar e agir",
    description: "O que a IA pode fazer por você além de conversar.",
    items: [
      { key: "createPages", title: "Criar páginas e apps em HTML", description: "Quando você pedir um site, landing page ou mini app, a IA entrega um HTML completo que você salva em Meu ambiente." },
      { key: "schedule", title: "Agendar tarefas", description: "A IA propõe um agendamento quando você pede algo para depois ou repetido. Você confirma com um botão." },
    ],
  },
  {
    title: "Jeito de pensar",
    description: "Como a IA raciocina e se comporta nas respostas.",
    items: [
      { key: "stepByStep", title: "Raciocinar passo a passo", description: "Pensa nos problemas por etapas antes de responder. Bom para contas, lógica e código." },
      { key: "honesty", title: "Admitir quando não sabe", description: "Evita inventar fatos, links ou fontes e avisa quando há incerteza." },
      { key: "useProfile", title: "Usar minhas informações", description: "Considera seu apelido, contexto e instruções de Configurações > Personalização." },
    ],
  },
]

export function AbilitiesTab() {
  const { abilities, setAbility } = useAssistant()
  return (
    <div className="space-y-8">
      {GROUPS.map((group) => (
        <SettingsGroup key={group.title} title={group.title} description={group.description}>
          {group.items.map((item) => (
            <SettingRow key={item.key} title={item.title} description={item.description}>
              <Switch aria-label={item.title} checked={abilities[item.key]} onCheckedChange={(v) => setAbility(item.key, v)} />
            </SettingRow>
          ))}
        </SettingsGroup>
      ))}
    </div>
  )
}
