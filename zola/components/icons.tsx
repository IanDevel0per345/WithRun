import { SheetIcon, type SheetIconName } from "@/components/ui/sheet-icon"
import { cn } from "@/lib/utils"
import * as React from "react"

/**
 * Every icon in the app comes from the icon sheets (black on the light theme,
 * white on the dark theme). These components keep the names the app already
 * used, so each screen just renders the sheet icon.
 */
export { GithubLogoIcon } from "@phosphor-icons/react"
export { PanelLeftIcon } from "lucide-react" // the open/close sidebar icon stays as it was

type IconProps = {
  size?: number | string
  className?: string
  weight?: string
  strokeWidth?: number
  color?: string
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "color">

const DEFAULT_SIZE = 20

/** Reads `size-4`, `h-4 w-4`, `size-[18px]` from the class when no size is given. */
function sizeFrom(size: IconProps["size"], className?: string): number {
  if (typeof size === "number") return size
  if (typeof size === "string" && /^\d+$/.test(size)) return Number(size)
  const m =
    className?.match(/(?:^|\s)size-(\d+(?:\.\d+)?)(?:\s|$)/) ||
    className?.match(/(?:^|\s)h-(\d+(?:\.\d+)?)(?:\s|$)/)
  if (m) return Number(m[1]) * 4
  const px = className?.match(/(?:^|\s)(?:size|h)-\[(\d+)px\]/)
  if (px) return Number(px[1])
  return DEFAULT_SIZE
}

function make(name: SheetIconName, extra?: string) {
  const Icon = React.forwardRef<HTMLSpanElement, IconProps>(function Icon(
    { size, className, weight: _w, strokeWidth: _s, color: _c, ...rest },
    ref
  ) {
    const px = sizeFrom(size, className)
    const cleaned = className
      ?.replace(/(?:^|\s)(?:size|h|w)-(?:\d+(?:\.\d+)?|\[\d+px\])(?=\s|$)/g, "")
      .trim()
    return (
      <span ref={ref} className={cn("inline-flex shrink-0", extra, cleaned)} {...rest}>
        <SheetIcon name={name} size={px} />
      </span>
    )
  })
  return Icon
}

// lucide
export const AlertCircle = make("warning")
export const CheckIcon = make("check")
export const Check = CheckIcon
export const ChevronDown = make("chevron")
export const FileText = make("filetext")
export const Image = make("image")
export const Loader2 = make("refresh", "animate-spin")
export const Pin = make("pin")
export const PinOff = make("pinoff")
export const Quote = make("chatdots")
export const RefreshCw = make("refresh")
export const Video = make("video")
export const XIcon = make("close")
export const X = XIcon

// phosphor
export const ArrowClockwise = make("refresh")
export const ArrowLeft = make("arrowl")
export const ArrowSquareOutIcon = make("external")
export const ArrowUp = make("arrowup")
export const ArrowUpRight = make("external")
export const BrainIcon = make("sparkle")
export const CaretDown = make("chevron")
export const CaretDownIcon = CaretDown
export const CaretLeft = make("chevronl")
export const CaretRight = make("chevronr")
export const CaretUp = make("chevronu")
export const ChatCircleIcon = make("chat")
export const CheckCircle = make("checkcircle")
export const Code = make("code")
export const Copy = make("copy")
export const DotsThree = make("dots")
export const FileArrowUp = make("upload")
export const FolderIcon = make("folder")
export const Globe = make("globe")
export const GlobeIcon = Globe
export const ImageIcon = Image
export const Info = make("info")
export const Link = make("link")
export const ListMagnifyingGlass = make("search")
export const MagnifyingGlass = make("search")
export const MagnifyingGlassIcon = MagnifyingGlass
export const NotePencilIcon = make("newchat")
export const Nut = make("settings")
export const PencilSimple = make("pen")
export const PencilSimpleIcon = PencilSimple
export const PencilSimpleSlashIcon = PencilSimple
export const Question = make("question")
export const QuestionMark = Question
export const SealCheck = make("checkcircle")
export const Spinner = make("refresh", "animate-spin")
export const StarIcon = make("star")
export const Stop = make("stop")
export const Trash = make("trash")
export const TrashSimple = Trash
export const Warning = make("warning")
export const Wrench = make("wrench")
export const WrenchIcon = Wrench

/** Radio dot (a small filled circle that follows the text colour). */
export function Circle({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block rounded-full bg-current", className ?? "size-2")}
    />
  )
}
