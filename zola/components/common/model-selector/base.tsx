"use client"

import { PopoverContentAuth } from "@/app/components/chat-input/popover-content-auth"
import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { useKeyShortcut } from "@/app/hooks/use-key-shortcut"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SheetIcon } from "@/components/ui/sheet-icon"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useModel } from "@/lib/model-store/provider"
import { filterAndSortModels } from "@/lib/model-store/utils"
import { ModelConfig } from "@/lib/models/types"
import { PROVIDERS } from "@/lib/providers"
import { useUserPreferences } from "@/lib/user-preference-store/provider"
import { cn } from "@/lib/utils"
import {
  CaretDownIcon,
  MagnifyingGlassIcon,
  StarIcon,
} from "@phosphor-icons/react"
import { useRef, useState } from "react"
import { ProModelDialog } from "./pro-dialog"
import { SubMenu } from "./sub-menu"

type ModelSelectorProps = {
  selectedModelId: string
  setSelectedModelId: (modelId: string) => void
  className?: string
  isUserAuthenticated?: boolean
}

export function ModelSelector({
  selectedModelId,
  setSelectedModelId,
  className,
  isUserAuthenticated = true,
}: ModelSelectorProps) {
  const { models, isLoading: isLoadingModels, favoriteModels } = useModel()
  const { isModelHidden } = useUserPreferences()

  const currentModel = models.find((model) => model.id === selectedModelId)
  const currentProvider = PROVIDERS.find(
    (provider) => provider.id === currentModel?.icon
  )
  const isMobile = useBreakpoint(768)

  const [hoveredModel, setHoveredModel] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isProDialogOpen, setIsProDialogOpen] = useState(false)
  const [selectedProModel, setSelectedProModel] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Ref for input to maintain focus
  const searchInputRef = useRef<HTMLInputElement>(null)

  useKeyShortcut(
    (e) => (e.key === "p" || e.key === "P") && e.metaKey && e.shiftKey,
    () => {
      if (isMobile) {
        setIsDrawerOpen((prev) => !prev)
      } else {
        setIsDropdownOpen((prev) => !prev)
      }
    }
  )

  const renderModelItem = (model: ModelConfig) => {
    const isLocked = !model.accessible
    const provider = PROVIDERS.find((provider) => provider.id === model.icon)

    return (
      <div
        key={model.id}
        className={cn(
          "flex w-full items-center justify-between px-3 py-2",
          selectedModelId === model.id && "bg-accent"
        )}
        onClick={() => {
          if (isLocked) {
            setSelectedProModel(model.id)
            setIsProDialogOpen(true)
            return
          }

          setSelectedModelId(model.id)
          if (isMobile) {
            setIsDrawerOpen(false)
          } else {
            setIsDropdownOpen(false)
          }
        }}
      >
        <div className="flex items-center gap-3">
          {provider?.icon && <provider.icon className="size-5" />}
          <div className="flex flex-col gap-0">
            <span className="text-sm">{model.name}</span>
          </div>
        </div>
        {isLocked && (
          <div className="border-input bg-accent text-muted-foreground flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-medium">
            <StarIcon className="size-2" />
            <span>Locked</span>
          </div>
        )}
      </div>
    )
  }

  // Get the hovered model data
  const hoveredModelData = models.find((model) => model.id === hoveredModel)

  const filteredModels = filterAndSortModels(
    models,
    favoriteModels || [],
    searchQuery,
    isModelHidden
  )

  const trigger = (
    <Button
      variant="outline"
      className={cn("dark:bg-secondary justify-between", className)}
      disabled={isLoadingModels}
    >
      <div className="flex items-center gap-2">
        {currentProvider?.icon && <currentProvider.icon className="size-5" />}
        <span>{currentModel?.name || "Select model"}</span>
      </div>
      <CaretDownIcon className="size-4 opacity-50" />
    </Button>
  )

  // Handle input change without losing focus
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setSearchQuery(e.target.value)
  }

  // If user is not authenticated, show the auth popover
  if (!isUserAuthenticated) {
    return (
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className={cn(
                  "border-border dark:bg-secondary text-accent-foreground h-9 w-auto border bg-transparent",
                  className
                )}
                type="button"
              >
                {currentProvider?.icon && (
                  <currentProvider.icon className="size-5" />
                )}
                {currentModel?.name}
                <CaretDownIcon className="size-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Select a model</TooltipContent>
        </Tooltip>
        <PopoverContentAuth />
      </Popover>
    )
  }

  if (isMobile) {
    return (
      <>
        <ProModelDialog
          isOpen={isProDialogOpen}
          setIsOpen={setIsProDialogOpen}
          currentModel={selectedProModel || ""}
        />
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Select Model</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-2">
              <div className="relative">
                <MagnifyingGlassIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search models..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="flex h-full flex-col space-y-0 overflow-y-auto px-4 pb-6">
              {isLoadingModels ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <p className="text-muted-foreground mb-2 text-sm">
                    Loading models...
                  </p>
                </div>
              ) : filteredModels.length > 0 ? (
                filteredModels.map((model) => renderModelItem(model))
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <p className="text-muted-foreground mb-2 text-sm">
                    No results found.
                  </p>
                  <a
                    href="https://github.com/IanDevel0per345/WithRun/issues/new?title=Model%20Request%3A%20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm underline"
                  >
                    Request a new model
                  </a>
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <div>
      <ProModelDialog
        isOpen={isProDialogOpen}
        setIsOpen={setIsProDialogOpen}
        currentModel={selectedProModel || ""}
      />
      <Tooltip>
        <DropdownMenu
          open={isDropdownOpen}
          onOpenChange={(open) => {
            setIsDropdownOpen(open)
            if (!open) {
              setHoveredModel(null)
              setSearchQuery("")
            } else {
              if (selectedModelId) setHoveredModel(selectedModelId)
            }
          }}
        >
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Switch model ⌘⇧P</TooltipContent>
          <DropdownMenuContent
            className="flex h-[300px] w-[320px] flex-col space-y-0.5 overflow-visible rounded-lg border p-0 shadow-none"
            align="start"
            sideOffset={8}
            collisionPadding={12}
            forceMount
            side="bottom"
          >
            <div className="bg-popover sticky top-0 z-10 rounded-t-2xl border-b px-2 pt-2 pb-2">
              <div className="relative">
                <MagnifyingGlassIcon className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <Input
                  ref={searchInputRef}
                  placeholder="Buscar modelos..."
                  className="bg-muted/60 dark:bg-muted/60 rounded-xl border-none pl-9 shadow-none focus-visible:ring-0"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="flex h-full flex-col space-y-0.5 overflow-y-auto p-1.5">
              {isLoadingModels ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <p className="text-muted-foreground mb-2 text-sm">
                    Carregando modelos...
                  </p>
                </div>
              ) : filteredModels.length > 0 ? (
                filteredModels.map((model) => {
                  const isLocked = !model.accessible
                  const provider = PROVIDERS.find(
                    (provider) => provider.id === model.icon
                  )

                  return (
                    <DropdownMenuItem
                      key={model.id}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-2.5 py-2",
                        selectedModelId === model.id && "bg-accent"
                      )}
                      onSelect={() => {
                        if (isLocked) {
                          setSelectedProModel(model.id)
                          setIsProDialogOpen(true)
                          return
                        }

                        setSelectedModelId(model.id)
                        setIsDropdownOpen(false)
                      }}
                      onFocus={() => {
                        if (isDropdownOpen) {
                          setHoveredModel(model.id)
                        }
                      }}
                      onMouseEnter={() => {
                        if (isDropdownOpen) {
                          setHoveredModel(model.id)
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {provider?.icon && <provider.icon className="size-5" />}
                        <div className="flex flex-col gap-0">
                          <span className="text-sm">{model.name}</span>
                        </div>
                      </div>
                      {isLocked ? (
                        <div className="border-input bg-accent text-muted-foreground flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-medium">
                          <span>Locked</span>
                        </div>
                      ) : (
                        selectedModelId === model.id && (
                          <SheetIcon name="checkcircle" size={16} />
                        )
                      )}
                    </DropdownMenuItem>
                  )
                })
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <p className="text-muted-foreground mb-1 text-sm">
                    No results found.
                  </p>
                  <a
                    href="https://github.com/IanDevel0per345/WithRun/issues/new?title=Model%20Request%3A%20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm underline"
                  >
                    Request a new model
                  </a>
                </div>
              )}
            </div>

            {/* Submenu positioned absolutely */}
            {hoveredModelData && (
              <div className="absolute top-0 left-[calc(100%+8px)]">
                <SubMenu hoveredModelData={hoveredModelData} />
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </div>
  )
}
