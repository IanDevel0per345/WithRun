import { cn } from "@/lib/utils"
import Image from "next/image"

type BrandLogoProps = {
  size?: number
  className?: string
}

/** Meteor AI logo. Black on the light theme, white on the dark theme. */
export function BrandLogo({ size = 24, className }: BrandLogoProps) {
  return (
    <span
      className={cn("inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo/meteor-black.png"
        alt="Meteor AI"
        width={size}
        height={size}
        unoptimized
        priority
        className="dark:hidden"
      />
      <Image
        src="/logo/meteor-white.png"
        alt="Meteor AI"
        width={size}
        height={size}
        unoptimized
        priority
        className="hidden dark:block"
      />
    </span>
  )
}
