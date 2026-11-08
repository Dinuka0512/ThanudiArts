import type { ReactNode } from "react"
import { AmbientBackground } from "@/components/ambientBackground"

interface PageHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  eyebrow?: string
  meta?: ReactNode
}

export default function PageHeader({ title, subtitle, eyebrow, meta }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <AmbientBackground />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-border py-3">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <p className="eyebrow ml-auto hidden sm:block">
            {meta ?? "Thanudi Arts — Online gallery"}
          </p>
        </div>

        <div className="grid gap-8 py-16 sm:py-20 md:grid-cols-12 md:items-end md:gap-6 md:py-24">
          <div className="md:col-span-8">
            <h1 className="text-[clamp(2.9rem,8vw,7rem)] font-medium leading-[0.9] tracking-[-0.055em] text-foreground">
              {title}
            </h1>
          </div>
          {subtitle && (
            <div className="md:col-span-4 md:pb-2">
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground md:ml-auto">
                {subtitle}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
