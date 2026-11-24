import { useCallback, useState } from "react"

/** Rascunho do campo de uma conversa nova (ainda sem id). */
export const NEW_CHAT_DRAFT_KEY = "chat-draft-new"

export function useChatDraft(chatId: string | null) {
  const storageKey = chatId ? `chat-draft-${chatId}` : NEW_CHAT_DRAFT_KEY

  const [draftValue, setDraftValueState] = useState<string>(() => {
    if (typeof window === "undefined") return ""
    return localStorage.getItem(storageKey) || ""
  })

  const setDraftValue = useCallback(
    (value: string) => {
      setDraftValueState(value)

      if (typeof window !== "undefined") {
        if (value) {
          localStorage.setItem(storageKey, value)
        } else {
          localStorage.removeItem(storageKey)
        }
      }
    },
    [storageKey]
  )

  const clearDraft = useCallback(() => {
    setDraftValueState("")
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey)
    }
  }, [storageKey])

  return {
    draftValue,
    setDraftValue,
    clearDraft,
  }
}
