"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
}

/**
 * Voice dictation through the browser's Web Speech API.
 * The transcript is appended to the text that was already in the field.
 */
export function useSpeechInput(
  value: string,
  onValueChange: (value: string) => void,
  lang = "pt-BR"
) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const baseRef = useRef("")

  useEffect(() => {
    const w = window as any
    setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition))
    return () => recognitionRef.current?.stop()
  }, [])

  const toggle = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const w = window as any
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!Recognition) return

    const recognition: SpeechRecognitionLike = new Recognition()
    recognition.lang = lang
    recognition.continuous = true
    recognition.interimResults = true

    baseRef.current = value
    recognition.onresult = (event: any) => {
      let transcript = ""
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      const base = baseRef.current
      const sep = base && !/\s$/.test(base) ? " " : ""
      onValueChange(base + sep + transcript)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }, [listening, lang, value, onValueChange])

  return { supported, listening, toggle }
}
