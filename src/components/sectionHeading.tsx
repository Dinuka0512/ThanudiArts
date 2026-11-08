import type { ReactNode } from "react"
import Reveal from "@/components/reveal"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: "left" | "center"
  meta?: ReactNode
  action?: ReactNode
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  meta,
  action,
}: SectionHeadingProps) {
  const centered = align === "center"

  return (
    <Reveal className={cn("mb-12 md:mb-16", centered && "text-center")}>
      <div className="flex items-center justify-between gap-6 border-t border-border pt-4">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {meta && <div className="eyebrow hidden sm:block">{meta}</div>}
      </div>

      <div
        className={cn(
          "mt-8 flex flex-col gap-6 md:mt-10",
          !centered && "md:flex-row md:items-end md:justify-between",
        )}
      >
        <div className={cn(centered && "mx-auto")}>
          <h2 className="text-4xl font-medium leading-[0.98] tracking-[-0.045em] text-foreground sm:text-5xl md:text-6xl">
            {title}
          </h2>
          {subtitle && (
            <p
              className={cn(
                "mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground",
                centered && "mx-auto",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </Reveal>
  )
}
