import { SheetIcon } from "@/components/ui/sheet-icon"

export function ConnectionsPlaceholder() {
  return (
    <div className="py-8 text-center">
      <SheetIcon name="link" size={48} className="mx-auto mb-2 opacity-40" />
      <h3 className="mb-1 text-sm font-medium">
        Nenhuma ferramenta de desenvolvedor disponível
      </h3>
      <p className="text-muted-foreground text-sm">
        As conexões com serviços de terceiros aparecem aqui no modo de
        desenvolvimento.
      </p>
    </div>
  )
}
