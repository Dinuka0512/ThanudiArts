import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/sectionHeading";
import ArtCard from "@/components/artCard";
import ShopCard from "@/components/shopCard";
import SEO from "@/components/seo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { START_PROJECT_MESSAGE, whatsappLink } from "@/lib/whatsapp";

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
        title: "Original artworks",
        description:
            "Every piece is an original creation — hand-drawn and digitally crafted with a distinct artistic vision.",
    },
    {
        title: "Custom commissions",
        description:
            "Have a specific vision? Personalised artworks are created around your ideas, stories and preferences.",
    },
    {
        title: "Quality & passion",
        description:
            "Each artwork is made with care and close attention to detail, built to be lived with for years.",
    },
];

const TICKER = [
    "Original art",
    "Hand-drawn",
    "Digital painting",
    "Bespoke commissions",
    "Made in Sri Lanka",
];

const pad = (n: number) => String(n + 1).padStart(2, "0");

export default function Explore() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<{ title: string; description: string }[]>([]);
    const [featuredPosts, setFeaturedPosts] = useState<FeaturedItem[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<FeaturedItem[]>([]);
    const [shopItems, setShopItems] = useState<FeaturedItem[]>([]);
    const [layouts, setLayouts] = useState<LayoutItem[]>([]);
    const [currentSection, setCurrentSection] = useState(0);
    const categoryRailRef = useRef<HTMLDivElement>(null);

    const scrollCategories = (direction: -1 | 1) => {
        const rail = categoryRailRef.current;
        if (!rail) return;
        rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
    };

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

    const cardFor = (item: FeaturedItem, index: number, onClick?: () => void) => (
        <ArtCard
            title={item.title || item.name || "Untitled"}
            imageUrl={getFirstImage(item)}
            price={item.price}
            badge={item.category || item.type}
            index={index + 1}
            onClick={onClick}
        />
    );

    const productCardFor = (item: FeaturedItem, onClick?: () => void) => (
        <ShopCard
            title={item.name || item.title || "Untitled"}
            imageUrl={getFirstImage(item)}
            price={item.price}
            badge={item.type || item.category}
            onClick={onClick}
        />
    );

    return (
        <div className="bg-background">
            <SEO
                title="Contemporary Art Studio in Sri Lanka"
                description="Thanudi Arts is a contemporary art studio in Sri Lanka offering original hand-drawn and digital artworks, limited editions, and bespoke commissions."
                path="/"
            />
            <Hero />

            {/* MEDIUM TICKER */}
            <div className="overflow-hidden border-b border-foreground bg-foreground py-3 text-background">
                <div className="marquee-strip items-center">
                    {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((item, index) => (
                        <span key={index} className="flex items-center">
                            <span className="px-7 text-[10px] font-medium uppercase tracking-[0.28em] text-background">
                                {item}
                            </span>
                            <span className="size-1 rounded-full bg-background/40" />
                        </span>
                    ))}
                </div>
            </div>

            {/* STUDIO STATEMENT */}
            <section className="border-b border-border py-16 md:py-24">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                    <div className="grid gap-10 md:grid-cols-12 md:gap-6">
                        <Reveal className="md:col-span-3">
                            <p className="max-w-[13rem] text-xs leading-relaxed text-muted-foreground">
                                An independent art practice rooted in imagination, texture and personal storytelling.
                            </p>
                        </Reveal>

                        <Reveal delay={100} className="md:col-span-9">
                            <p className="max-w-4xl text-2xl font-medium leading-[1.18] tracking-[-0.035em] sm:text-3xl md:text-4xl">
                                Working across <span className="editorial">illustration</span>, digital
                                painting and bespoke commissions — each piece begins with a feeling
                                and ends as something you can keep.
                            </p>

                            <div className="mt-12 grid gap-8 border-t border-border pt-7 sm:grid-cols-3">
                                {[
                                    { value: "250+", label: "Artworks created" },
                                    { value: "100+", label: "Happy collectors" },
                                    { value: "5+", label: "Years of practice" },
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <p className="text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                                            {stat.value}
                                        </p>
                                        <p className="eyebrow mt-2">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* FEATURED ARTWORKS */}
            <section id="featured" className="py-16 md:py-24">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                    <SectionHeading
                        title={<>Handpicked <span className="editorial">pieces</span></>}
                        subtitle="A rotating selection of original artwork from the studio."
                        action={
                            <button
                                onClick={() => navigate("/gallery")}
                                className="link-line text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                            >
                                View full gallery
                                <ArrowUpRight className="size-3.5" />
                            </button>
                        }
                    />

                    {featuredPosts.length === 0 ? (
                        <p className="border-t border-border py-14 text-sm text-muted-foreground">
                            No featured artworks yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-4">
                            {featuredPosts.map((item, i) => (
                                <Reveal key={item.id} delay={Math.min(i, 7) * 70}>
                                    {cardFor(item, i, () => navigate("/gallery"))}
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden bg-brand py-20 text-foreground md:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-40 -top-32 size-[32rem] rounded-full border border-foreground/10"
                />
                <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
                    <Reveal className="grid gap-10 md:grid-cols-12 md:gap-6">
                        <div className="md:col-span-8">
                            <h2 className="text-4xl font-medium leading-[0.96] tracking-[-0.05em] sm:text-5xl md:text-7xl">
                                Have an idea
                                <br />
                                <span className="editorial text-foreground/90">worth creating?</span>
                            </h2>
                        </div>
                        <div className="flex flex-col justify-end gap-6 md:col-span-4">
                            <p className="max-w-xs text-sm leading-relaxed text-foreground/70">
                                Tell me about your project — a portrait, a gift, an illustration,
                                or something entirely your own.
                            </p>
                            <Button
                                asChild
                                size="lg"
                                className="h-12 w-full rounded-none bg-foreground text-background hover:bg-foreground/90 sm:w-auto"
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
                            <a
                                href="mailto:thanudiarts@gmail.com"
                                className="link-line text-[10px] uppercase tracking-[0.18em] text-foreground/60 transition-colors hover:text-foreground"
                            >
                                thanudiarts@gmail.com
                            </a>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            {featuredProducts.length > 0 && (
                <section className="border-y border-border bg-secondary/25 py-16 md:py-24">
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                        <SectionHeading
                            title={<>Available <span className="editorial">now</span></>}
                            subtitle="Original pieces and editions ready to join your collection."
                            action={
                                <button
                                    onClick={() => navigate("/shop")}
                                    className="link-line text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Visit the shop
                                    <ArrowUpRight className="size-3.5" />
                                </button>
                            }
                        />

                        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 sm:gap-y-9 md:grid-cols-4">
                            {featuredProducts.map((item, i) => (
                                <Reveal key={item.id} delay={Math.min(i, 7) * 60}>
                                    {productCardFor(item, () => navigate(`/shop/${item.id}`))}
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* STUDIO SECTIONS / CAROUSEL */}
            {layouts.length > 0 && (
                <section className="border-b border-border py-16 md:py-24">
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                        <SectionHeading
                            title={<>Notes &amp; <span className="editorial">stories</span></>}
                        />

                        <div className="relative">
                            <Reveal className="overflow-hidden border border-border bg-card">
                                <div
                                    className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                                    style={{ transform: `translateX(-${currentSection * 100}%)` }}
                                >
                                    {layouts.map((section, i) => (
                                        <div key={section.id} className="flex min-w-full flex-col md:flex-row">
                                            <div className="flex flex-1 flex-col justify-center p-6 sm:p-10 md:p-14">
                                                <span className="eyebrow">{pad(i)} / {pad(layouts.length - 1)}</span>
                                                {section.title && (
                                                    <h3 className="mt-5 text-3xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-4xl">
                                                        {section.title}
                                                    </h3>
                                                )}
                                                {section.subtitle && (
                                                    <p className="mt-4 text-base leading-relaxed text-foreground/75">
                                                        {section.subtitle}
                                                    </p>
                                                )}
                                                {section.description && (
                                                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                                                        {section.description}
                                                    </p>
                                                )}
                                                {section.buttons?.length > 0 && (
                                                    <div className="mt-8 flex flex-wrap gap-3">
                                                        {section.buttons.map((btn, bi) => (
                                                            <Button
                                                                key={bi}
                                                                className="h-10 rounded-none px-5 text-[10px] uppercase tracking-[0.18em]"
                                                                onClick={() => navigate(btn.link || "#")}
                                                            >
                                                                {btn.text}
                                                                <ArrowUpRight className="size-3.5" />
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {section.imageUrl && (
                                                <div className="flex-1">
                                                    <img
                                                        src={section.imageUrl}
                                                        alt={section.title || "Studio section"}
                                                        loading="lazy"
                                                        className="aspect-[4/3] h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Reveal>

                            {layouts.length > 1 && (
                                <div className="mt-6 flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-2">
                                        {layouts.map((_, i) => (
                                            <button
                                                key={i}
                                                aria-label={`Go to section ${i + 1}`}
                                                onClick={() => setCurrentSection(i)}
                                                className={cn(
                                                    "h-px transition-all duration-300",
                                                    i === currentSection
                                                        ? "w-10 bg-foreground"
                                                        : "w-5 bg-border hover:bg-muted-foreground",
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            aria-label="Previous section"
                                            onClick={() =>
                                                setCurrentSection((prev) => (prev === 0 ? layouts.length - 1 : prev - 1))
                                            }
                                            className="size-10 rounded-none border-border"
                                        >
                                            <ChevronLeft className="size-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            aria-label="Next section"
                                            onClick={() =>
                                                setCurrentSection((prev) => (prev === layouts.length - 1 ? 0 : prev + 1))
                                            }
                                            className="size-10 rounded-none border-border"
                                        >
                                            <ChevronRight className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* SHOP ITEMS */}
            {shopItems.length > 0 && (
                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                        <SectionHeading
                            title={<>Recent <span className="editorial">additions</span></>}
                            subtitle="New and available works from the studio."
                            action={
                                <button
                                    onClick={() => navigate("/shop")}
                                    className="link-line text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    View all products
                                    <ArrowUpRight className="size-3.5" />
                                </button>
                            }
                        />

                        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 sm:gap-y-9 md:grid-cols-4">
                            {shopItems.slice(0, 4).map((item, i) => (
                                <Reveal key={item.id} delay={Math.min(i, 7) * 60}>
                                    {productCardFor(item, () => navigate(`/shop/${item.id}`))}
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CATEGORIES */}
            <section className="border-y border-border py-16 md:py-24">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                    <SectionHeading
                        title={<>Browse by <span className="editorial">category</span></>}
                    />

                    {categories.length === 0 ? (
                        <p className="border-t border-border py-14 text-sm text-muted-foreground">
                            No categories yet.
                        </p>
                    ) : (
                        <div>
                            <div
                                ref={categoryRailRef}
                                className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
                            >
                                {categories.map((item, i) => (
                                    <Reveal
                                        key={item.title}
                                        delay={Math.min(i, 6) * 50}
                                        className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[24%]"
                                    >
                                        <button
                                            onClick={() => navigate("/gallery")}
                                            className="group flex h-full min-h-[170px] w-full flex-col justify-between gap-8 border border-border bg-background p-5 text-left transition-colors duration-300 hover:bg-brand sm:p-6"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="eyebrow text-muted-foreground transition-colors group-hover:text-foreground/60">
                                                    {pad(i)}
                                                </span>
                                                <span className="flex size-8 shrink-0 items-center justify-center border border-border text-foreground transition-colors duration-300 group-hover:border-foreground/20 group-hover:bg-foreground group-hover:text-background">
                                                    <ArrowUpRight className="size-3.5" />
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-medium tracking-[-0.035em] sm:text-2xl">
                                                    {item.title}
                                                </h3>
                                                {item.description && (
                                                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/70">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    </Reveal>
                                ))}
                            </div>

                            <div className="mt-5 flex items-center justify-between gap-4">
                                <span className="eyebrow">Scroll to browse</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        aria-label="Previous categories"
                                        onClick={() => scrollCategories(-1)}
                                        className="size-9 rounded-none border-border"
                                    >
                                        <ChevronLeft className="size-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        aria-label="Next categories"
                                        onClick={() => scrollCategories(1)}
                                        className="size-9 rounded-none border-border"
                                    >
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* WHY THE STUDIO */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                    <SectionHeading
                        title={<>Crafted with <span className="editorial">intention</span></>}
                    />

                    <div className="border-t border-border">
                        {WHY_US.map((item, i) => (
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
        </div>
    );
}
