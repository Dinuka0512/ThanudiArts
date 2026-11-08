import { useNavigate } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import PageHeader from "@/components/pageHeader"
import Reveal from "@/components/reveal"
import SEO from "@/components/seo"
import { Button } from "@/components/ui/button"
import { START_PROJECT_MESSAGE, whatsappLink } from "@/lib/whatsapp"
import imageThanudi from "@/assets/thanudi/Thanudi arts.jpg"

const VALUES = [
  {
    title: "Original artworks",
    description:
      "Every piece is an original creation, blending hand-drawn and digital mediums into something wholly its own.",
  },
  {
    title: "Custom commissions",
    description:
      "Personalised pieces designed around your ideas, stories and preferences — from the first sketch to the final work.",
  },
  {
    title: "Detail & passion",
    description:
      "A love for creativity and detail reflected in every stroke, every texture and every finished piece.",
  },
]

const pad = (n: number) => String(n + 1).padStart(2, "0")

export default function About() {
    const navigate = useNavigate()

    return (
        <div className="bg-background">
            <SEO
                title="About the Studio"
                description="Learn about Thanudi Arts, an independent contemporary art studio in Sri Lanka creating original artworks and bespoke commissions with care and intention."
                path="/about"
            />
            <PageHeader
                title={<>The studio <span className="editorial">behind the art</span></>}
                subtitle="A journey through creativity, imagination and handcrafted detail."
            />

            {/* ARTIST */}
            <section className="border-b border-border py-16 md:py-24">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                    <div className="grid gap-12 md:grid-cols-12 md:gap-8">
                        <Reveal className="md:col-span-5">
                            <div className="relative">
                                <div
                                    aria-hidden
                                    className="absolute -right-3 -top-3 hidden h-full w-full border border-brand md:block"
                                />
                                <div className="relative border border-border bg-card p-2 sm:p-3">
                                    <img
                                        src={imageThanudi}
                                        alt="Thanudi, founder of Thanudi Arts"
                                        loading="lazy"
                                        decoding="async"
                                        className="aspect-[4/5] w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                                    />
                                </div>
                                <div className="mt-4 flex items-baseline justify-between gap-4">
                                    <span className="eyebrow">Thanudi</span>
                                    <span className="eyebrow">Artist &amp; founder</span>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={120} className="md:col-span-7 md:pl-10 lg:pl-16">
                            <h2 className="text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                                Hello, I&apos;m <span className="editorial">Thanudi.</span>
                            </h2>

                            <div className="mt-7 max-w-xl space-y-5 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    I&apos;m an artist passionate about creating work that tells stories
                                    and inspires imagination. I work across both digital and hand-drawn
                                    mediums, blending traditional techniques with a modern eye.
                                </p>
                                <p>
                                    My goal is to bring unique designs and personal art experiences to
                                    everyone. Every artwork reflects a love for creativity, texture and
                                    the small details that make a piece feel alive.
                                </p>
                                <p>
                                    The studio is based in Sri Lanka, but the work travels — to homes,
                                    gifts, and collections around the world.
                                </p>
                            </div>

                            <p className="editorial mt-8 text-3xl text-foreground">Thanudi</p>

                            <div className="mt-8">
                                <Button
                                    className="group h-11 rounded-none px-6 text-[10px] uppercase tracking-[0.18em]"
                                    onClick={() => navigate("/gallery")}
                                >
                                    Explore the gallery
                                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </Button>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                    <div className="border-t border-border pt-4" />

                    <h2 className="mt-8 max-w-3xl text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-5xl md:text-6xl">
                        Made slowly, with <span className="editorial">intention.</span>
                    </h2>

                    <div className="mt-12 border-t border-border">
                        {VALUES.map((item, i) => (
                            <Reveal key={item.title} delay={Math.min(i, 4) * 80}>
                                <div className="grid gap-3 border-b border-border py-7 md:grid-cols-12 md:items-baseline md:gap-6 md:py-9">
                                    <span className="eyebrow md:col-span-1">{pad(i)}</span>
                                    <h3 className="text-2xl font-medium tracking-[-0.035em] md:col-span-4">
                                        {item.title}
                                    </h3>
                                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:col-span-7">
                                        {item.description}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden bg-foreground py-20 text-background md:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-40 -top-32 size-[32rem] rounded-full border border-background/10"
                />
                <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
                    <Reveal className="grid gap-10 md:grid-cols-12 md:gap-6">
                        <div className="md:col-span-8">
                            <p className="eyebrow text-background/50">Commissions / 04</p>
                            <h2 className="mt-5 text-4xl font-medium leading-[0.96] tracking-[-0.05em] sm:text-5xl md:text-7xl">
                                Something unique
                                <br />
                                <span className="editorial text-background/90">in mind?</span>
                            </h2>
                        </div>
                        <div className="flex flex-col justify-end gap-6 md:col-span-4">
                            <p className="max-w-xs text-sm leading-relaxed text-background/60">
                                Commissions and collaborations are always welcome. Tell me what
                                you&apos;re imagining.
                            </p>
                            <Button
                                asChild
                                size="lg"
                                className="h-12 w-full rounded-none bg-brand text-foreground hover:bg-brand/90 sm:w-auto"
                            >
                                <a
                                    href={whatsappLink(START_PROJECT_MESSAGE)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Start a project
                                    <ArrowUpRight className="size-4" />
                                </a>
                            </Button>
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    )
}
