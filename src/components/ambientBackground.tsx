import { cn } from "@/lib/utils"

export function AmbientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="grain absolute inset-0" />
      <div className="absolute -right-32 -top-24 size-[26rem] rounded-full border border-border/70" />
      <div className="absolute -left-40 bottom-0 size-[22rem] rounded-full border border-border/50" />
      <div className="absolute right-[22%] top-[38%] size-1.5 rounded-full bg-brand/80" />
    </div>
  )
}
