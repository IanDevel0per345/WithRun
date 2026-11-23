"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { useState } from "react"

export function OllamaSection() {
  const [ollamaEndpoint, setOllamaEndpoint] = useState("http://localhost:11434")
  const [enableOllama, setEnableOllama] = useState(true) // Default enabled in dev
  const [isLoading, setIsLoading] = useState(false)

  // In client-side, we assume development mode (Ollama enabled) unless it's a production build
  const isLocked =
    typeof window !== "undefined" && window.location.hostname !== "localhost"

  const testConnection = async () => {
    if (!ollamaEndpoint) return

    setIsLoading(true)
    try {
      const response = await fetch(`${ollamaEndpoint}/api/tags`)
      if (response.ok) {
        toast({
          title: "Conexão com o Ollama bem-sucedida",
          description: "Agora você pode usar o Ollama para rodar modelos localmente.",
        })
      } else {
        toast({
          title: "Falha na conexão com o Ollama",
          description: "Confira o endereço do Ollama e tente de novo.",
        })
      }
    } catch {
      toast({
        title: "Falha na conexão com o Ollama",
        description: "Confira o endereço do Ollama e tente de novo.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-medium">Modelos locais</h3>
        <p className="text-muted-foreground text-sm">
          Configure sua instância local do Ollama para rodar modelos no seu computador.
          {isLocked && (
            <span className="mt-1 block text-orange-600 dark:text-orange-400">
              O Ollama fica desativado no modo de produção.
            </span>
          )}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ollama</span>
            <Switch
              checked={enableOllama && !isLocked}
              onCheckedChange={setEnableOllama}
              disabled={isLocked}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ollama-endpoint">Endereço</Label>
            <Input
              id="ollama-endpoint"
              type="url"
              placeholder="http://localhost:11434"
              value={ollamaEndpoint}
              onChange={(e) => setOllamaEndpoint(e.target.value)}
              disabled={!enableOllama || isLocked}
            />
            <p className="text-muted-foreground mt-1 text-xs">
              {isLocked
                ? "O endereço é somente leitura no modo de produção."
                : "Endereço padrão do Ollama. Confirme que o Ollama está rodando no seu computador."}
            </p>
          </div>

          {enableOllama && !isLocked && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testConnection}
                disabled={isLoading || !ollamaEndpoint}
              >
                {isLoading ? "Testando..." : "Testar conexão"}
              </Button>
            </div>
          )}

          {isLocked && (
            <div className="rounded-md bg-orange-50 p-3 dark:bg-orange-950/20">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                O Ollama fica desativado em ambientes de produção por desempenho e
                segurança.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
