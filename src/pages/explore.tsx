import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Paintbrush, PenTool } from "lucide-react";
import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/sectionHeading";
import ArtCard from "@/components/artCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FeaturedItem {
    id: string;
    title?: string;
    name?: string;
    imageUrl?: string;
    images?: string[];
    category?: string;
    type?: string;
    price?: string;
}

interface SectionButton {
    text: string;
    link: string;
}

interface LayoutItem {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    buttons: SectionButton[];
    active: boolean;
    order: number;
}

const getFirstImage = (item: FeaturedItem): string =>
    item.images?.[0] || item.imageUrl || "";

const WHY_US = [
    {
        icon: Paintbrush,
        title: "Original Artworks",
        description:
            "Every piece is an original creation — hand-drawn and digitally crafted with a unique artistic vision.",
    },
    {
        icon: PenTool,
        title: "Custom Designs",
        description:
            "Have a specific vision? I create personalized artworks tailored to your ideas and preferences.",
    },
    {
        icon: Heart,
        title: "Quality & Passion",
        description:
            "Each artwork is crafted with care and attention to detail for lasting beauty.",
    },
];

export default function Explore() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<{ title: string; description: string }[]>([]);
    const [featuredPosts, setFeaturedPosts] = useState<FeaturedItem[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<FeaturedItem[]>([]);
    const [shopItems, setShopItems] = useState<FeaturedItem[]>([]);
    const [layouts, setLayouts] = useState<LayoutItem[]>([]);
    const [currentSection, setCurrentSection] = useState(0);

    useEffect(() => {
        const fetchAll = async () => {
            const [catSnap, postsSnap, prodSnap, allProdSnap, layoutsSnap] = await Promise.all([
                getDocs(collection(db, "categories")).catch(() => null),
                getDocs(query(collection(db, "posts"), where("featured", "==", true))).catch(() => null),
                getDocs(query(collection(db, "products"), where("featured", "==", true))).catch(() => null),
                getDocs(collection(db, "products")).catch(() => null),
                getDocs(query(collection(db, "layouts"), where("active", "==", true))).catch(() => null),
            ]);

            if (catSnap) setCategories(catSnap.docs.map((doc) => doc.data() as { title: string; description: string }));
            if (postsSnap) setFeaturedPosts(postsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FeaturedItem)));
            if (prodSnap) setFeaturedProducts(prodSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FeaturedItem)));
            if (allProdSnap) setShopItems(allProdSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FeaturedItem)));

            if (layoutsSnap) {
                const items = layoutsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as LayoutItem));
                items.sort((a, b) => a.order - b.order);
                setLayouts(items);
            }
        };
        fetchAll();
    }, []);

    const cardFor = (item: FeaturedItem, onClick?: () => void) => (
        <ArtCard
            title={item.title || item.name || "Untitled"}
            imageUrl={getFirstImage(item)}
            price={item.price}
            badge={item.category || item.type}
            onClick={onClick}
        />
    );

    return (
        <div className="bg-background">
            <Hero />

            {/* FEATURED ARTWORKS */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <SectionHeading
                        eyebrow="Featured Artworks"
                        title="Handpicked pieces"
                        subtitle="A curated selection showcasing artistic excellence"
                    />
                    {featuredPosts.length === 0 ? (
                        <p className="py-12 text-center text-muted-foreground">No featured artworks yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                            {featuredPosts.map((item, i) => (
                                <Reveal key={item.id} delay={Math.min(i, 7) * 80}>
                                    {cardFor(item, () => navigate("/gallery"))}
                                </Reveal>
                            ))}
                        </div>
                    )}
                    <div className="mt-10 text-center">
                        <Button className="rounded-full" onClick={() => navigate("/gallery")}>
                            View Full Gallery
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            {featuredProducts.length > 0 && (
                <section className="bg-secondary/40 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <SectionHeading
                            eyebrow="Featured Products"
                            title="Ready for your collection"
                            subtitle="Available artworks you can bring home"
                        />
                        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                            {featuredProducts.map((item, i) => (
                                <Reveal key={item.id} delay={Math.min(i, 7) * 80}>
                                        {cardFor(item, () => navigate(`/shop/${item.id}`))}
                                    </Reveal>
                                ))}
                            </div>
                        <div className="mt-10 text-center">
                            <Button variant="outline" className="rounded-full" onClick={() => navigate("/shop")}>
                                Visit Shop
                                <ArrowRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* STATS */}
            <section className="py-16">
                <div className="mx-auto flex max-w-4xl items-center justify-center gap-8 px-4 sm:gap-16">
                    {[
                        { value: "250+", label: "Artworks Created" },
                        { value: "100+", label: "Happy Clients" },
                        { value: "5+", label: "Years Experience" },
                    ].map((stat, i) => (
                        <Reveal
                            key={stat.label}
                            delay={i * 120}
                            className="flex items-center gap-8 sm:gap-16"
                        >
                            {i > 0 && <Separator orientation="vertical" className="h-12 hidden sm:block" />}
                            <div className="text-center">
                                <p className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* PAGE SECTIONS — CAROUSEL */}
            {layouts.length > 0 && (
                <section className="bg-secondary/40 py-20">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6">
                        <div className="relative">
                                <Reveal className="overflow-hidden">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentSection * 100}%)` }}
                                >
                                    {layouts.map((section) => (
                                        <div
                                            key={section.id}
                                            className="flex min-w-full flex-col items-center gap-10 px-2 md:flex-row md:gap-14"
                                        >
                                            <div className={`flex-1 ${section.imageUrl ? "" : "text-center"}`}>
                                                {section.title && (
                                                    <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                                                        {section.title}
                                                    </h2>
                                                )}
                                                {section.subtitle && (
                                                    <p className="mt-3 text-lg text-muted-foreground">
                                                        {section.subtitle}
                                                    </p>
                                                )}
                                                {section.description && (
                                                    <p className="mt-4 leading-relaxed text-muted-foreground">
                                                        {section.description}
                                                    </p>
                                                )}
                                                {section.buttons?.length > 0 && (
                                                    <div className="mt-6 flex flex-wrap gap-3">
                                                        {section.buttons.map((btn, i) => (
                                                            <Button
                                                                key={i}
                                                                className="rounded-full"
                                                                onClick={() => navigate(btn.link || "#")}
                                                            >
                                                                {btn.text}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {section.imageUrl && (
                                                <div className="flex-1">
                                                    <img
                                                        src={section.imageUrl}
                                                        alt={section.title || "Section image"}
                                                        loading="lazy"
                                                        className="aspect-[4/3] w-full rounded-3xl border border-border object-cover shadow-xl"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Reveal>

                            {layouts.length > 1 && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        aria-label="Previous"
                                        onClick={() =>
                                            setCurrentSection((prev) => (prev === 0 ? layouts.length - 1 : prev - 1))
                                        }
                                        className="absolute -left-2 top-1/2 hidden -translate-y-1/2 rounded-full md:inline-flex"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        aria-label="Next"
                                        onClick={() =>
                                            setCurrentSection((prev) => (prev === layouts.length - 1 ? 0 : prev + 1))
                                        }
                                        className="absolute -right-2 top-1/2 hidden -translate-y-1/2 rounded-full md:inline-flex"
                                    >
                                        <ChevronRight className="size-5" />
                                    </Button>
                                    <div className="mt-8 flex justify-center gap-2">
                                        {layouts.map((_, i) => (
                                            <button
                                                key={i}
                                                aria-label={`Go to section ${i + 1}`}
                                                onClick={() => setCurrentSection(i)}
                                                className={cn(
                                                    "h-2.5 rounded-full transition-all",
                                                    i === currentSection ? "w-6 bg-primary" : "w-2.5 bg-muted-foreground/30",
                                                )}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* SHOP ITEMS */}
            {shopItems.length > 0 && (
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <SectionHeading
                            eyebrow="Shop"
                            title="Browse recent pieces"
                            subtitle="Available artworks and products from the studio"
                        />
                        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                            {shopItems.slice(0, 4).map((item, i) => (
                                <Reveal key={item.id} delay={Math.min(i, 7) * 80}>
                                        {cardFor(item, () => navigate(`/shop/${item.id}`))}
                                    </Reveal>
                                ))}
                            </div>
                        <div className="mt-10 text-center">
                            <Button className="rounded-full" onClick={() => navigate("/shop")}>
                                View All Products
                                <ArrowRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* CATEGORIES */}
            <section className="bg-card/60 py-20 border-y border-border/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <SectionHeading
                        eyebrow="Explore"
                        title="Art categories"
                        subtitle="Different styles and mediums to discover"
                    />
                    {categories.length === 0 ? (
                        <p className="py-12 text-center text-muted-foreground">No categories yet.</p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-3">
                            {categories.map((item, index) => (
                                <Reveal key={index} delay={index * 100}>
                                    <Card
                                        onClick={() => navigate("/gallery")}
                                        className="group cursor-pointer border-border/80 p-8 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                                    >
                                        <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
                                        <p className="mt-2 text-muted-foreground">{item.description}</p>
                                        <p className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors group-hover:gap-2">
                                            View works <ArrowRight className="size-4" />
                                        </p>
                                    </Card>
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* WHY CHOOSE */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <SectionHeading eyebrow="Why Thanudi Arts" title="Crafted with intention" />
                    <div className="grid gap-6 md:grid-cols-3">
                        {WHY_US.map((item, i) => (
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
                            Have an idea worth creating?
                        </h2>
                        <p className="mt-4 text-lg text-foreground/70">
                            Let&apos;s bring your vision to life with a custom commission.
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
    );
}