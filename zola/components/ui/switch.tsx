"use client"

import { Switch as AstryxSwitch } from "@astryxdesign/core/Switch"
import * as React from "react"

type SwitchProps = {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
  name?: string
  "aria-label"?: string
}

/** Astryx switch with the same props the app already used. */
function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  className,
  id,
  name,
  "aria-label": ariaLabel,
}: SwitchProps) {
  const [inner, setInner] = React.useState(defaultChecked)
  const isControlled = checked !== undefined
  const value = isControlled ? checked : inner

  return (
    <AstryxSwitch
      id={id}
      className={className}
      label={ariaLabel ?? "Alternar"}
      isLabelHidden
      value={value}
      htmlName={name}
      isDisabled={disabled}
      onChange={(next) => {
        if (!isControlled) setInner(next)
        onCheckedChange?.(next)
      }}
    />
  )
}

export { Switch }
