import { ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ArtCardProps {
  title: string
  imageUrl?: string
  price?: string
  badge?: string
  index?: number | string
  aspect?: string
  onClick?: () => void
}

export default function ArtCard({
  title,
  imageUrl,
  price,
  badge,
  index,
  aspect = "aspect-[4/5]",
  onClick,
}: ArtCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer gap-0 overflow-hidden rounded-none border-0 bg-transparent py-0",
        onClick && "cursor-pointer",
      )}
    >
      <div className="relative overflow-hidden bg-secondary/50">
        <div className={cn("relative w-full overflow-hidden", aspect)}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="h-full w-full bg-secondary/60" />
          )}
        </div>

        {badge && (
          <span className="absolute left-0 top-0 bg-background/90 px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-foreground backdrop-blur-sm">
            {badge}
          </span>
        )}

        <span className="absolute right-0 top-0 flex size-9 translate-y-1 items-center justify-center bg-foreground text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="border-b border-border pb-3 pt-3">
        <div className="flex items-baseline gap-2.5">
          {index !== undefined && (
            <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
              {typeof index === "number" ? String(index).padStart(2, "0") : index}
            </span>
          )}
          <p className="min-w-0 flex-1 truncate text-sm font-medium tracking-[-0.01em] text-foreground">
            {title}
          </p>
          {price && (
            <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
              LKR {price}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
