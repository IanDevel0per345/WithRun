import {
  FileUpload,
  FileUploadContent,
  FileUploadTrigger,
} from "@/components/prompt-kit/file-upload"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SheetIcon } from "@/components/ui/sheet-icon"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getModelInfo } from "@/lib/models"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { cn } from "@/lib/utils"
import { FileArrowUp } from "@phosphor-icons/react"
import React from "react"
import { PopoverContentAuth } from "./popover-content-auth"

type ButtonFileUploadProps = {
  onFileUpload: (files: File[]) => void
  isUserAuthenticated: boolean
  model: string
}

const plusButtonClass =
  "bg-muted/70 hover:bg-muted size-10 shrink-0 rounded-full p-0 shadow-none"

function PlusButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      size="sm"
      variant="ghost"
      className={cn(plusButtonClass, className)}
      type="button"
      aria-label="Add files"
      {...props}
    >
      <SheetIcon name="plus" size={20} />
    </Button>
  )
}

export function ButtonFileUpload({
  onFileUpload,
  isUserAuthenticated,
  model,
}: ButtonFileUploadProps) {
  if (!isSupabaseEnabled) {
    return (
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <PlusButton />
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Add files</TooltipContent>
        </Tooltip>
        <PopoverContent className="p-2">
          <div className="text-secondary-foreground text-sm">
            File uploads are not available in this deployment.
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  const isFileUploadAvailable = getModelInfo(model)?.vision

  if (!isFileUploadAvailable) {
    return (
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <PlusButton />
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Add files</TooltipContent>
        </Tooltip>
        <PopoverContent className="p-2">
          <div className="text-secondary-foreground text-sm">
            This model does not support file uploads.
            <br />
            Please select another model.
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  if (!isUserAuthenticated) {
    return (
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <PlusButton />
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Add files</TooltipContent>
        </Tooltip>
        <PopoverContentAuth />
      </Popover>
    )
  }

  return (
    <FileUpload
      onFilesAdded={onFileUpload}
      multiple
      disabled={!isUserAuthenticated}
      accept=".txt,.md,image/jpeg,image/png,image/gif,image/webp,image/svg,image/heic,image/heif"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <FileUploadTrigger asChild>
            <PlusButton
              className={cn(!isUserAuthenticated && "opacity-50")}
              disabled={!isUserAuthenticated}
            />
          </FileUploadTrigger>
        </TooltipTrigger>
        <TooltipContent>Add files</TooltipContent>
      </Tooltip>
      <FileUploadContent>
        <div className="border-input bg-background flex flex-col items-center rounded-lg border border-dashed p-8">
          <FileArrowUp className="text-muted-foreground size-8" />
          <span className="mt-4 mb-1 text-lg font-medium">Drop files here</span>
          <span className="text-muted-foreground text-sm">
            Drop any files here to add it to the conversation
          </span>
        </div>
      </FileUploadContent>
    </FileUpload>
  )
}
