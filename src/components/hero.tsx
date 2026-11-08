import { useNavigate } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { START_PROJECT_MESSAGE, whatsappLink } from "@/lib/whatsapp"

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden bg-background">
      <div aria-hidden className="grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex min-h-[50svh] max-w-[1440px] flex-col justify-center px-4 sm:px-8">
        {/* Meta strip */}
        <div
          className="hero-fade-in flex items-center justify-center gap-4 border-b border-foreground/15 py-3"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="eyebrow text-foreground/60">Est. 2021</span>
          <span className="eyebrow hidden text-foreground/60 sm:block">Original works &amp; commissions</span>
          <span className="eyebrow text-foreground/60">Sri Lanka</span>
        </div>

        {/* Headline */}
        <div className="relative flex flex-1 flex-col justify-center py-8 md:py-10">
          <p className="hero-fade-in text-center" style={{ animationDelay: "0.2s" }}>
            <span className="eyebrow text-foreground/60">ORIGINAL ART SRI LANKA</span>
          </p>

          <h1 className="mt-6 text-center text-[clamp(3rem,9vw,8rem)] font-medium leading-[0.86] tracking-[-0.065em] text-foreground">
            <span className="hero-line block overflow-hidden">
              <span className="hero-line-inner block" style={{ animationDelay: "0.35s" }}>
                Arts that stays with you
              </span>
            </span>
          </h1>

          <p
            className="hero-fade-in brand-wordmark mt-6 text-center text-5xl uppercase tracking-[0.06em] text-brand sm:text-6xl md:text-7xl"
            style={{ animationDelay: "0.65s" }}
          >
            Thanudi Arts
          </p>

          <div
            className="hero-fade-in mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4"
            style={{ animationDelay: "0.8s" }}
          >
            <Button
              onClick={() => navigate("/gallery")}
              className="group h-12 rounded-none bg-foreground px-5 text-[10px] font-medium uppercase tracking-[0.18em] text-background hover:bg-foreground/90"
            >
              View the gallery
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>

            <a
              href={whatsappLink(START_PROJECT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Commission a piece
            </a>
          </div>
        </div>


      </div>
    </section>
  )
}
