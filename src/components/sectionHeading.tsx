import type { ReactNode } from "react"
import Reveal from "@/components/reveal"

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: "left" | "center"
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left"
  return (
    <Reveal className={`${alignClass} mb-12`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
      )}
    </Reveal>
  )
}