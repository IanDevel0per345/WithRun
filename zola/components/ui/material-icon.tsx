import { cn } from "@/lib/utils"

type MaterialIconProps = {
  /** Material Symbols (Rounded) ligature name, e.g. "home" */
  name: string
  size?: number
  filled?: boolean
  weight?: number
  className?: string
}

export function MaterialIcon({
  name,
  size = 20,
  filled = true,
  weight = 500,
  className,
}: MaterialIconProps) {
  return (
    <span
      aria-hidden
      className={cn("material-symbols-rounded select-none", className)}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
      }}
    >
      {name}
    </span>
  )
}
