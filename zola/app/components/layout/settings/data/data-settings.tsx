"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useSettings } from "@/lib/settings-store/provider"
import { AnimatePresence, motion } from "motion/react"
import { useRef, useState } from "react"
import { SettingRow, SettingsGroup } from "../settings-ui"

export function DataSettings() {
  const { settings, replaceAll, reset } = useSettings()
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirming, setConfirming] = useState(false)

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "meteor-ai-configuracoes.json"
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Configurações exportadas", status: "success" })
  }

  const importSettings = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text())
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("invalid")
      }
      replaceAll(parsed)
      toast({ title: "Configurações importadas", status: "success" })
    } catch {
      toast({
        title: "Arquivo inválido",
        description: "Escolha um arquivo exportado pelo Meteor AI.",
        status: "error",
      })
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <SettingsGroup
        title="Suas configurações"
        description="Tudo fica salvo neste navegador. Exporte para levar para outro dispositivo."
      >
        <SettingRow
          title="Exportar"
          description="Baixa um arquivo com todas as suas preferências."
        >
          <Button variant="outline" size="sm" onClick={exportSettings}>
            Exportar
          </Button>
        </SettingRow>
        <SettingRow
          title="Importar"
          description="Carrega um arquivo exportado antes."
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            Importar
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) importSettings(file)
              e.target.value = ""
            }}
          />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="Zona de cuidado">
        <SettingRow
          title="Redefinir tudo"
          description="Volta todas as personalizações ao padrão. Não apaga suas conversas."
        >
          <AnimatePresence mode="wait" initial={false}>
            {confirming ? (
              <motion.div
                key="confirm"
                className="flex gap-2"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirming(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    reset()
                    setConfirming(false)
                    toast({ title: "Configurações redefinidas", status: "success" })
                  }}
                >
                  Confirmar
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="ask"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirming(true)}
                >
                  Redefinir
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </SettingRow>
      </SettingsGroup>
    </div>
  )
}
