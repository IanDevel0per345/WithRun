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

type SheetIconProps = {
  name: SheetIconName
  size?: number
  className?: string
}

/**
 * Icons cut from the provided black/white icon sheets.
 * Black variant is used on the light theme, white on the dark theme.
 */
export function SheetIcon({ name, size = 20, className }: SheetIconProps) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={`/icons/black/${name}.png`}
        alt=""
        width={size}
        height={size}
        unoptimized
        className="dark:hidden"
      />
      <Image
        src={`/icons/white/${name}.png`}
        alt=""
        width={size}
        height={size}
        unoptimized
        className="hidden dark:block"
      />
    </span>
  )
}
