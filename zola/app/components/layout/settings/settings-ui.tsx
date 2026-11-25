"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { useId } from "react"

/** A titled group of rows, drawn as a rounded card with dividers. */
export function SettingsGroup({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
            {description}
          </p>
        )}
      </div>
      <div className="divide-border/60 border-border/60 divide-y rounded-xl border">
        {children}
      </div>
    </section>
  )
}

/** One setting: label + description on the left, control on the right. */
export function SettingRow({
  title,
  description,
  children,
  vertical = false,
}: {
  title: string
  description?: string
  children: React.ReactNode
  /** Put the control below the text (for inputs and long controls). */
  vertical?: boolean
}) {
  return (
    <div
      className={cn(
        "flex gap-x-4 gap-y-3 px-4 py-3.5",
        // Wide controls wrap under the text on small screens instead of squeezing it.
        vertical ? "flex-col" : "flex-wrap items-center justify-between"
      )}
    >
      <div className={cn("min-w-0", !vertical && "min-w-[11rem] flex-1")}>
        <div className="text-sm font-medium">{title}</div>
        {description && (
          <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
            {description}
          </p>
        )}
      </div>
      <div className={cn(vertical ? "w-full" : "max-w-full shrink-0")}>{children}</div>
    </div>
  )
}

/** Animated segmented control (the selected pill glides between options). */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
  ariaLabel: string
}) {
  const id = useId()
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="bg-muted inline-flex max-w-full flex-wrap rounded-lg p-0.5"
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              selected
                ? "text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {selected && (
              <motion.span
                layoutId={`seg-${id}`}
                className="bg-deep-teal absolute inset-0 rounded-md"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/** Small "12/500" counter for text fields. */
export function CharCounter({ value, max }: { value: string; max: number }) {
  return (
    <p className="text-muted-foreground mt-1.5 text-right text-[11px] tabular-nums">
      {value.length}/{max}
    </p>
  )
}

/** Round color swatches with an animated check. */
export function Swatches<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string; color: string; checkColor?: string }[]
}) {
  return (
    <div role="radiogroup" aria-label="Cor de destaque" className="flex gap-2.5">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            title={option.label}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex size-7 items-center justify-center rounded-full transition-transform hover:scale-110",
              selected && "ring-foreground/70 ring-offset-background ring-2 ring-offset-2"
            )}
            style={{ background: option.color }}
          >
            <AnimatePresence initial={false}>
              {selected && (
                <motion.svg
                  key="check"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ stroke: option.checkColor ?? "white" }}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.3, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        )
      })}
    </div>
  )
}
