import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ArtCardProps {
  title: string
  imageUrl?: string
  price?: string
  badge?: string
  aspect?: string
  onClick?: () => void
}

export default function ArtCard({
  title,
  imageUrl,
  price,
  badge,
  aspect = "aspect-[4/5]",
  onClick,
}: ArtCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1",
        onClick && "hover:shadow-xl",
      )}
    >
      <div className={cn("relative w-full overflow-hidden", aspect)}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-secondary/40" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {badge && (
          <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {badge}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-white/10 p-4 backdrop-blur-xl">
          <p className="truncate font-semibold text-white drop-shadow-sm">{title}</p>
          {price && <p className="mt-0.5 text-sm font-bold text-white/90">LKR. {price}</p>}
        </div>
      </div>
    </Card>
  )
}