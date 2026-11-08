import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { ArrowUpRight, X } from "lucide-react";
import PageHeader from "@/components/pageHeader";
import Reveal from "@/components/reveal";
import ArtSlider from "@/components/artSlider";
import SEO from "@/components/seo";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { START_PROJECT_MESSAGE, whatsappLink } from "@/lib/whatsapp";

interface Artwork {
    id: string;
    title: string;
    category: string;
    imageUrl?: string;
    images?: string[];
    description?: string;
}

const getArtImages = (art: Artwork): string[] =>
    art.images?.length ? art.images : art.imageUrl ? [art.imageUrl] : [];

function ArtHoverCard({ art, images, onOpen }: { art: Artwork; images: string[]; onOpen: () => void }) {
    const [hovering, setHovering] = useState(false);
    return (
        <button
            type="button"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={onOpen}
            className="group block w-full text-left"
        >
            <div className="relative overflow-hidden rounded-xl bg-secondary/40">
                <ArtSlider images={images} alt={art.title} paused={hovering} />

                <div className="pointer-events-none absolute inset-0 bg-foreground/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="pointer-events-none absolute right-3 top-3 flex translate-y-1 items-center gap-1 rounded-full bg-background px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    View
                    <ArrowUpRight className="size-3" />
                </span>

                {art.description && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-4 pt-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="line-clamp-2 text-xs leading-relaxed text-white/85">
                            {art.description}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex items-baseline justify-between gap-3 px-1 pt-2.5">
                <h3 className="truncate text-sm font-medium tracking-[-0.01em]">{art.title}</h3>
                {art.category && (
                    <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {art.category}
                    </span>
                )}
            </div>
        </button>
    );
}

export default function Gallery() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [selected, setSelected] = useState<Artwork | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        getDocs(collection(db, "posts"))
            .then((snap) => {
                const posts = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Artwork));
                setArtworks(posts);
                const cats = [...new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c) && c !== "All"))] as string[];
                setCategories(cats);
            })
            .catch(() => {
                setArtworks([]);
                setCategories([]);
            });
    }, []);

    const filtered = activeCategory === "All" ? artworks : artworks.filter((a) => a.category === activeCategory);
    const tabs = ["All", ...categories];

    return (
        <div className="bg-background">
            <SEO
                title="Art Gallery"
                description="Browse selected hand-drawn and digital artworks by Thanudi Arts, featuring original pieces created in a contemporary Sri Lankan art studio."
                path="/gallery"
            />
            <PageHeader
                title={<>Selected <span className="editorial">works</span></>}
                subtitle="A collection of hand-drawn and digital artworks, each made in the studio with care and intention."
            />

            {/* FILTER */}
            <section className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur-xl md:top-20">
                <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {tabs.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "group relative py-1 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors",
                                    activeCategory === cat
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {cat}
                                <span
                                    className={cn(
                                        "absolute -bottom-0.5 left-0 h-px bg-foreground transition-all duration-300",
                                        activeCategory === cat ? "w-full" : "w-0 group-hover:w-full",
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                    <span className="eyebrow shrink-0">
                        {filtered.length} {filtered.length === 1 ? "work" : "works"}
                    </span>
                </div>
            </section>

            {/* GRID */}
            <section className="pb-20 pt-10 md:pb-28 md:pt-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                    {filtered.length === 0 ? (
                        <p className="border-t border-border py-16 text-sm text-muted-foreground">
                            No artworks in this category yet.
                        </p>
                    ) : (
                        <div className="columns-2 gap-4 sm:gap-5 lg:columns-3 xl:columns-4">
                            {filtered.map((art, i) => {
                                const artImages = getArtImages(art);
                                return (
                                    <Reveal
                                        key={art.id}
                                        delay={Math.min(i, 8) * 50}
                                        className="mb-5 break-inside-avoid"
                                    >
                                        <ArtHoverCard
                                            art={art}
                                            images={artImages}
                                            onOpen={() => {
                                                setSelected(art);
                                                setSelectedImageIndex(0);
                                            }}
                                        />
                                    </Reveal>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-border bg-secondary/25 py-16 text-center md:py-24">
                <Reveal className="mx-auto max-w-[1440px] px-4 sm:px-8">
                    <p className="eyebrow">Commissions</p>
                    <h3 className="mx-auto mt-5 max-w-2xl text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                        Want something made <span className="editorial">only for you?</span>
                    </h3>
                    <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                        Portraits, gifts, illustrations and one-off pieces — commissioned around your story.
                    </p>
                    <Button
                        asChild
                        className="mt-8 h-11 rounded-none px-6 text-[10px] uppercase tracking-[0.18em]"
                    >
                        <a
                            href={whatsappLink(START_PROJECT_MESSAGE)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Enquire about a commission
                            <ArrowUpRight className="size-4" />
                        </a>
                    </Button>
                </Reveal>
            </section>

            {/* LIGHTBOX */}
            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent
                    showCloseButton={false}
                    className="max-w-4xl gap-0 overflow-hidden rounded-none border-border bg-background p-0"
                >
                    <DialogTitle className="sr-only">{selected?.title}</DialogTitle>
                    <DialogDescription className="sr-only">
                        {selected?.category} artwork
                    </DialogDescription>

                    {selected && (() => {
                        const images = getArtImages(selected);
                        const current = images[Math.min(selectedImageIndex, images.length - 1)];
                        return (
                            <div>
                                <div className="relative bg-foreground">
                                    {current && (
                                        <img
                                            src={current}
                                            alt={selected.title}
                                            className="max-h-[68vh] w-full object-contain"
                                        />
                                    )}
                                    <DialogClose className="absolute right-3 top-3 flex size-9 items-center justify-center bg-background text-foreground transition-colors hover:bg-background/85">
                                        <X className="size-4" />
                                        <span className="sr-only">Close</span>
                                    </DialogClose>
                                </div>

                                {images.length > 1 && (
                                    <div className="flex items-center gap-2 overflow-x-auto border-t border-border bg-background px-5 py-3">
                                        {images.map((url, i) => (
                                            <button
                                                key={url}
                                                type="button"
                                                onClick={() => setSelectedImageIndex(i)}
                                                className={cn(
                                                    "size-12 shrink-0 overflow-hidden border transition",
                                                    i === selectedImageIndex
                                                        ? "border-foreground"
                                                        : "border-transparent opacity-50 hover:opacity-100",
                                                )}
                                            >
                                                <img src={url} alt="" className="h-full w-full object-cover" />
                                            </button>
                                        ))}
                                        <span className="ml-2 text-[10px] tabular-nums text-muted-foreground">
                                            {selectedImageIndex + 1} / {images.length}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-start justify-between gap-4 border-t border-border px-5 py-4">
                                    <div>
                                        <h3 className="text-base font-medium tracking-[-0.02em]">{selected.title}</h3>
                                        {selected.description && (
                                            <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
                                                {selected.description}
                                            </p>
                                        )}
                                    </div>
                                    {selected.category && (
                                        <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                            {selected.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
