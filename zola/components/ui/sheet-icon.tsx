import { cn } from "@/lib/utils"
import Image from "next/image"

export type SheetIconName =
  | "home"
  | "settings"
  | "newchat"
  | "chat"
  | "chatdots"
  | "folder"
  | "folderplus"
  | "close"
  | "chevron"
  | "chevronr"
  | "plus"
  | "arrowup"
  | "globe"
  | "stop"
  | "mic"
  | "sidebar"
  | "code"
  | "checkcircle"
  | "computer"
  | "sparkle"
  | "pen"
  | "command"
  | "database"
  | "cube"
  | "key"
  | "link"
  | "file"
  | "book"
  | "cap"
  | "bulb"
  | "warning"
  | "search"
  | "refresh"
  | "flask"
  | "wrench"
  | "info"
  | "user"
  | "trash"
  | "copy"
  | "chevronu"
  | "chevronl"
  | "dots"
  | "arrowr"
  | "arrowl"
  | "star"
  | "minus"
  | "grip"
  | "layers"
  | "calendar"
  | "clock"
  | "play"
  | "pause"
  | "eye"
  | "download"
  | "external"
  | "lock"
  | "mail"

type SheetIconProps = {
  name: SheetIconName
  size?: number
  className?: string
  /** Use on dark surfaces in the light theme (white icon) and vice-versa. */
  invert?: boolean
  /** Always render the white variant (for colored backgrounds). */
  forceWhite?: boolean
}

/**
 * Icons cut from the provided black/white icon sheets.
 * Black variant is used on the light theme, white on the dark theme.
 */
export function SheetIcon({
  name,
  size = 20,
  className,
  invert = false,
  forceWhite = false,
}: SheetIconProps) {
  if (forceWhite) {
    return (
      <span
        aria-hidden
        className={cn("inline-flex shrink-0", className)}
        style={{ width: size, height: size }}
      >
        <Image
          src={`/icons/white/${name}.png`}
          alt=""
          width={size}
          height={size}
          unoptimized
        />
      </span>
    )
  }
  const light = invert ? "white" : "black"
  const dark = invert ? "black" : "white"
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={`/icons/${light}/${name}.png`}
        alt=""
        width={size}
        height={size}
        unoptimized
        className="dark:hidden"
      />
      <Image
        src={`/icons/${dark}/${name}.png`}
        alt=""
        width={size}
        height={size}
        unoptimized
        className="hidden dark:block"
      />
    </span>
  )
}
