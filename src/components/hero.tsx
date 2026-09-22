import { useNavigate } from "react-router-dom"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AmbientBackground } from "@/components/ambientBackground"

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative flex min-h-[92svh] items-center justify-center overflow-hidden py-28">
      <AmbientBackground />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div>
          <Badge
            variant="outline"
            className="gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider"
          >
            <Sparkles className="size-3.5 text-primary" />
            Sri Lanka&apos;s Creative Art Studio
          </Badge>
        </div>

        <h1
          className="mt-7 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          Hand-drawn &amp; digital art,
          <br />
          <span className="italic text-primary">made personal.</span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          From unique illustrations to custom commissions, every piece tells a
          story — imagined by Thanudi and crafted to feel like yours.
        </p>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button size="lg" className="group rounded-full px-8" onClick={() => navigate("/gallery")}>
            View Gallery
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8"
            onClick={() => navigate("/contact")}
          >
            Start a Project
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground">
        <span className="flex flex-col items-center gap-1 text-xs uppercase tracking-widest">
          Scroll
          <ChevronDown className="size-4 animate-bounce" />
        </span>
      </div>
    </section>
  )
}