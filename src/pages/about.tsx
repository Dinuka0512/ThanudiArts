import { useNavigate } from "react-router-dom"
import { ArrowRight, Palette, PenTool, Sparkles } from "lucide-react"
import PageHeader from "@/components/pageHeader"
import Reveal from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Logo from "@/assets/l3.png"
import imageThanudi from "@/assets/thanudi/Thanudi arts.jpg"

const VALUES = [
  {
    icon: Palette,
    title: "Original Artworks",
    description:
      "Every piece is an original creation, blending hand-drawn and digital mediums.",
  },
  {
    icon: PenTool,
    title: "Custom Commissions",
    description:
      "Personalized pieces designed around your ideas, stories and preferences.",
  },
  {
    icon: Sparkles,
    title: "Detail & Passion",
    description:
      "A love for creativity and detail reflected in every stroke of the work.",
  },
]

export default function About() {
    const navigate = useNavigate()

    return (
        <div className="bg-background">
            <PageHeader
                eyebrow="About"
                title="The Studio Behind the Art"
                subtitle="A journey through creativity, imagination and handcrafted detail."
            />

            {/* ARTIST */}
            <section className="py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                        <Reveal className="relative mx-auto w-full max-w-md">
                            <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl" />
                            <img
                                src={imageThanudi}
                                alt="Thanudi Arts"
                                loading="lazy"
                                decoding="async"
                                className="relative aspect-square w-full rounded-full border-4 border-background object-cover shadow-xl grayscale transition-all duration-700 hover:grayscale-0"
                            />
                            <Badge className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background px-5 py-2 shadow-lg">
                                <img src={Logo} alt="" className="mr-2 h-6 w-auto" />
                                Thanudi Arts
                            </Badge>
                        </Reveal>

                        <Reveal delay={150}>
                            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                                Hello, I&apos;m Thanudi!
                            </h2>
                            <p className="mt-5 leading-relaxed text-muted-foreground">
                                I&apos;m an artist passionate about creating artwork that tells
                                stories and inspires imagination. I work with both digital and
                                hand-drawn mediums, blending traditional techniques with modern
                                creativity.
                            </p>
                            <p className="mt-4 leading-relaxed text-muted-foreground">
                                My goal is to bring unique designs and personalized art experiences
                                to everyone. Every artwork reflects my love for creativity and
                                detail.
                            </p>
                            <div className="mt-8">
                                <Button className="rounded-full" onClick={() => navigate("/gallery")}>
                                    Explore the gallery
                                    <ArrowRight className="size-4" />
                                </Button>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        {VALUES.map((item, i) => (
                            <Reveal key={item.title} delay={i * 100}>
                                <Card className="border-border/80 p-8 text-center shadow-sm">
                                    <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <item.icon className="size-7" />
                                    </div>
                                    <h3 className="text-xl font-semibold">{item.title}</h3>
                                    <p className="mt-2 leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </Card>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-foreground py-20 text-background">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
                    <Reveal>
                        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                            Made something unique in mind?
                        </h2>
                        <p className="mt-4 text-lg text-foreground/70">
                            Commissions and collaborations are always welcome.
                        </p>
                        <Button
                            className="mt-8 rounded-full bg-background text-foreground hover:bg-background/90"
                            size="lg"
                            onClick={() => navigate("/contact")}
                        >
                            Start a Project
                            <ArrowRight className="size-4" />
                        </Button>
                    </Reveal>
                </div>
            </section>
        </div>
    )
}