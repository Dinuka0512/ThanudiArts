import { cn } from "@/lib/utils"

export function AmbientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="grain absolute inset-0" />
      <div className="animate-drift-a absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl" />
      <div className="animate-drift-b absolute top-1/3 -right-32 h-[26rem] w-[26rem] rounded-full bg-accent/60 blur-3xl dark:bg-accent/30" />
      <div className="animate-drift-a absolute -bottom-40 left-1/3 h-[24rem] w-[24rem] rounded-full bg-secondary/60 blur-3xl [animation-delay:-14s]" />
    </div>
  )
}