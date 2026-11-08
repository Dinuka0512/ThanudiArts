import { ArrowUpRight } from "lucide-react"

interface ShopCardProps {
  title: string
  imageUrl?: string
  price?: string
  badge?: string
  onClick?: () => void
}

export default function ShopCard({
  title,
  imageUrl,
  price,
  badge,
  onClick,
}: ShopCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer flex-col text-left"
    >
      <span className="relative block aspect-[4/5] overflow-hidden rounded-md bg-secondary/30 ring-1 ring-border/80 transition-all duration-500 group-hover:ring-foreground/30">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-secondary/50">
            <span className="editorial text-2xl text-muted-foreground/50">Thanudi</span>
          </span>
        )}

        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <span className="pointer-events-none absolute inset-x-2.5 bottom-2.5 flex translate-y-2 items-center justify-between rounded-sm bg-foreground px-3 py-2 text-[9px] font-medium uppercase tracking-[0.16em] text-background opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          View piece
          <ArrowUpRight className="size-3" />
        </span>
      </span>

      <span className="flex flex-1 items-start justify-between gap-3 pt-3">
        <span className="min-w-0">
          <span className="line-clamp-2 block text-[13px] font-medium leading-snug tracking-[-0.01em] text-foreground">
            {title}
          </span>
          {badge && (
            <span className="mt-1.5 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="size-1 rounded-full bg-brand" />
              {badge}
            </span>
          )}
        </span>

        {price && (
          <span className="shrink-0 text-right">
            <span className="block text-[8px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              LKR
            </span>
            <span className="mt-0.5 block text-sm font-semibold tabular-nums leading-none tracking-[-0.02em] text-foreground">
              {price}
            </span>
          </span>
        )}
      </span>
    </button>
  )
}
