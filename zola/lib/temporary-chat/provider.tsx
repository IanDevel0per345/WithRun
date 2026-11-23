"use client"

import { usePathname } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

type TemporaryChatContextType = {
  /** Temporary chats are never saved and never show up in the history. */
  temporary: boolean
  /** Stable id for the current temporary chat (only used to talk to the API). */
  tempChatId: string
  setTemporary: (value: boolean) => void
  toggleTemporary: () => void
}

const TemporaryChatContext = createContext<TemporaryChatContextType | null>(
  null
)

export const TEMP_CHAT_PREFIX = "temp-"

const newTempId = () => `${TEMP_CHAT_PREFIX}${crypto.randomUUID()}`

export function TemporaryChatProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [temporary, setTemporaryState] = useState(false)
  const idRef = useRef<string>("")
  const [tempChatId, setTempChatId] = useState("")

  const setTemporary = useCallback((value: boolean) => {
    if (value) {
      const id = newTempId()
      idRef.current = id
      setTempChatId(id)
    }
    setTemporaryState(value)
  }, [])

  const toggleTemporary = useCallback(() => {
    setTemporary(!temporary)
  }, [temporary, setTemporary])

  // A temporary chat only lives on the empty chat screen: leaving it ends it.
  useEffect(() => {
    if (pathname !== "/") setTemporaryState(false)
  }, [pathname])

  const value = useMemo(
    () => ({ temporary, tempChatId, setTemporary, toggleTemporary }),
    [temporary, tempChatId, setTemporary, toggleTemporary]
  )

  return (
    <TemporaryChatContext.Provider value={value}>
      {children}
    </TemporaryChatContext.Provider>
  )
}

export function useTemporaryChat() {
  const ctx = useContext(TemporaryChatContext)
  if (!ctx)
    throw new Error("useTemporaryChat must be used within TemporaryChatProvider")
  return ctx
}
