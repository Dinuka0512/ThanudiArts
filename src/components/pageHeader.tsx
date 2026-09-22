import type { ReactNode } from "react"
import { AmbientBackground } from "@/components/ambientBackground"

interface PageHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  eyebrow?: string
}

export default function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      <AmbientBackground />
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}