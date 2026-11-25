"use client"

import { ModelSelector } from "@/components/common/model-selector/base"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { useMode } from "@/lib/mode-store/provider"
import { MODES } from "@/lib/modes"
import { useSettings } from "@/lib/settings-store/provider"
import { getModelInfo } from "@/lib/models"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { useSpeechInput } from "./use-speech-input"
import { ButtonFileUpload } from "./button-file-upload"
import { ButtonSearch } from "./button-search"
import { FileList } from "./file-list"

type ChatInputProps = {
  value: string
  onValueChange: (value: string) => void
  onSend: () => void
  isSubmitting?: boolean
  hasMessages?: boolean
  files: File[]
  onFileUpload: (files: File[]) => void
  onFileRemove: (file: File) => void
  onSelectModel: (model: string) => void
  selectedModel: string
  isUserAuthenticated: boolean
  stop: () => void
  status?: "submitted" | "streaming" | "ready" | "error"
  setEnableSearch: (enabled: boolean) => void
  enableSearch: boolean
  quotedText?: { text: string; messageId: string } | null
  /** Estimated tokens used by the current conversation. */
  contextTokens?: number
}

export function ChatInput({
  value,
  onValueChange,
  onSend,
  isSubmitting,
  files,
  onFileUpload,
  onFileRemove,
  onSelectModel,
  selectedModel,
  isUserAuthenticated,
  stop,
  status,
  setEnableSearch,
  enableSearch,
  quotedText,
  contextTokens,
}: ChatInputProps) {
  const selectModelConfig = getModelInfo(selectedModel)
  const hasSearchSupport = Boolean(selectModelConfig?.webSearch)
  const isOnlyWhitespace = (text: string) => !/[^\s]/.test(text)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { mode } = useMode()
  const { settings } = useSettings()
  const coloredAccent = settings.accent !== "padrao"
  const speech = useSpeechInput(value, onValueChange)
  const canSend = !isSubmitting
    ? status === "streaming" || (Boolean(value) && !isOnlyWhitespace(value))
    : false

  const handleSend = useCallback(() => {
    if (isSubmitting) {
      return
    }

    if (status === "streaming") {
      stop()
      return
    }

    onSend()
  }, [isSubmitting, onSend, status, stop])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isSubmitting) {
        e.preventDefault()
        return
      }

      if (e.key === "Enter" && status === "streaming") {
        e.preventDefault()
        return
      }

      // When "send with Enter" is off, Ctrl/Cmd+Enter sends and Enter breaks the line.
      const sendsOnThisKey = settings.enterToSend
        ? !e.shiftKey
        : e.metaKey || e.ctrlKey

      if (e.key === "Enter" && sendsOnThisKey) {
        if (isOnlyWhitespace(value)) {
          return
        }

        e.preventDefault()
        onSend()
      }
    },
    [isSubmitting, onSend, status, value, settings.enterToSend]
  )

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      const hasImageContent = Array.from(items).some((item) =>
        item.type.startsWith("image/")
      )

      if (!isUserAuthenticated && hasImageContent) {
        e.preventDefault()
        return
      }

      if (isUserAuthenticated && hasImageContent) {
        const imageFiles: File[] = []

        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile()
            if (file) {
              const newFile = new File(
                [file],
                `pasted-image-${Date.now()}.${file.type.split("/")[1]}`,
                { type: file.type }
              )
              imageFiles.push(newFile)
            }
          }
        }

        if (imageFiles.length > 0) {
          onFileUpload(imageFiles)
        }
      }
      // Text pasting will work by default for everyone
    },
    [isUserAuthenticated, onFileUpload]
  )

  useEffect(() => {
    if (quotedText) {
      const quoted = quotedText.text
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n")
      onValueChange(value ? `${value}\n\n${quoted}\n\n` : `${quoted}\n\n`)

      requestAnimationFrame(() => {
        textareaRef.current?.focus()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotedText, onValueChange])

  useMemo(() => {
    if (!hasSearchSupport && enableSearch) {
      setEnableSearch?.(false)
    }
  }, [hasSearchSupport, enableSearch, setEnableSearch])

  return (
    <div className="relative flex w-full flex-col gap-4">
      <div
        className="relative order-2 px-2 pb-3 sm:pb-4 md:order-1"
        onClick={() => textareaRef.current?.focus()}
      >
        <PromptInput
          className="bg-popover relative z-10 rounded-[2rem] border-[1.5px] border-neutral-300 p-0 shadow-none dark:border-neutral-700"
          maxHeight={200}
          value={value}
          onValueChange={onValueChange}
        >
          <FileList files={files} onFileRemove={onFileRemove} />
          <PromptInputTextarea
            ref={textareaRef}
            placeholder={MODES[mode].placeholder}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            submitOnEnter={settings.enterToSend}
            className="min-h-[44px] px-5 pt-4 pb-1 text-base leading-[1.3] placeholder:font-medium sm:text-base md:text-base"
          />
          <PromptInputActions className="w-full justify-between px-3 pt-1 pb-3">
            <div className="flex items-center gap-1">
              <ButtonFileUpload
                onFileUpload={onFileUpload}
                isUserAuthenticated={isUserAuthenticated}
                model={selectedModel}
                contextTokens={contextTokens}
              />
              {hasSearchSupport ? (
                <ButtonSearch
                  isSelected={enableSearch}
                  onToggle={setEnableSearch}
                  isAuthenticated={isUserAuthenticated}
                />
              ) : null}
              <ModelSelector
                selectedModelId={selectedModel}
                setSelectedModelId={onSelectModel}
                isUserAuthenticated={isUserAuthenticated}
                className="text-muted-foreground hover:bg-accent hover:text-foreground h-9 max-w-[9.5rem] gap-1 rounded-full border-0 bg-transparent px-2.5 text-sm font-medium shadow-none dark:bg-transparent max-sm:gap-0 max-sm:px-2 max-sm:text-[0px]"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <PromptInputAction
                tooltip={
                  speech.supported
                    ? speech.listening
                      ? "Stop dictation"
                      : "Dictate"
                    : "Voice input is not supported in this browser"
                }
              >
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={speech.toggle}
                  disabled={!speech.supported}
                  aria-label="Voice input"
                  aria-pressed={speech.listening}
                  className={cn(
                    "hover:bg-accent size-10 shrink-0 rounded-full bg-transparent p-0 shadow-none dark:bg-transparent dark:hover:bg-accent",
                    speech.listening && "bg-accent dark:bg-accent animate-pulse",
                    !speech.supported && "opacity-50"
                  )}
                >
                  <SheetIcon name="mic" size={22} />
                </Button>
              </PromptInputAction>
              <PromptInputAction
                tooltip={status === "streaming" ? "Stop" : "Send"}
              >
                <Button
                  size="sm"
                  className={cn(
                    "size-11 shrink-0 rounded-full p-0 shadow-none transition-all duration-300 ease-out",
                    canSend
                      ? coloredAccent
                        ? "bg-[var(--meteor-accent)] text-white hover:opacity-90"
                        : "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-muted text-muted-foreground hover:bg-muted"
                  )}
                  disabled={!canSend}
                  type="button"
                  onClick={handleSend}
                  aria-label={status === "streaming" ? "Stop" : "Send message"}
                >
                  <SheetIcon
                    name={status === "streaming" ? "stop" : "arrowup"}
                    size={22}
                    invert={canSend && !coloredAccent}
                    forceWhite={canSend && coloredAccent}
                    className={cn("translate-y-[3px]", !canSend && "opacity-40")}
                  />
                </Button>
              </PromptInputAction>
            </div>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  )
}
