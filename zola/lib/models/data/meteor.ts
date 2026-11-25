import { openproviders } from "@/lib/openproviders"
import { ModelConfig } from "../types"

const meteorModels: ModelConfig[] = [
  {
    id: "meteor-1",
    name: "Meteor 1",
    provider: "Meteor",
    providerId: "meteor",
    modelFamily: "Meteor",
    baseProviderId: "openai",
    description:
      "O modelo da Meteor AI — rápido e direto para conversar, criar e organizar ideias.",
    tags: ["fast", "chat"],
    contextWindow: 1047576,
    vision: true,
    tools: true,
    audio: false,
    openSource: false,
    speed: "Fast",
    website: "https://meteor-ai.vercel.app",
    modelPage: "https://meteor-ai.vercel.app",
    icon: "meteor",
    // Por enquanto não existe um backend próprio da Meteor: o Meteor 1
    // responde pelo motor atual (gpt-4.1-nano) com a chave já configurada.
    // Quando houver uma API da Meteor, é só trocar esta função.
    apiSdk: (apiKey?: string) =>
      openproviders("gpt-4.1-nano", undefined, apiKey),
  },
]

export { meteorModels }
