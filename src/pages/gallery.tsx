import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import PageHeader from "@/components/pageHeader";
import Reveal from "@/components/reveal";
import ArtSlider from "@/components/artSlider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
            className="group relative block w-full overflow-hidden rounded-[1.25rem] border border-black/5 text-left shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
            <ArtSlider images={images} alt={art.title} paused={hovering} />
            <div className="absolute inset-0 flex flex-col justify-end gap-1 bg-white/50 p-4 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="font-semibold text-foreground">{art.title}</h3>
                {art.description && (
                    <p className="line-clamp-3 text-sm text-foreground/80">{art.description}</p>
                )}
                {art.category && (
                    <Badge variant="secondary" className="mt-1 w-fit rounded-full">
                        {art.category}
                    </Badge>
                )}
            </div>
        </button>
    )
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

    return (
        <div className="bg-background">
            <PageHeader
                eyebrow="Portfolio"
                title="Art gallery"
                subtitle="A collection of hand-drawn and digital artworks crafted with passion."
            />

            {/* FILTER */}
            <section className="mt-10 pb-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <Reveal className="flex flex-wrap justify-center gap-2">
                        <button
                            onClick={() => setActiveCategory("All")}
                            className={cn(
                                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                                activeCategory === "All"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground hover:bg-accent",
                            )}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                                    activeCategory === cat
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-secondary-foreground hover:bg-accent",
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </Reveal>
                </div>
            </section>

            {/* GRID */}
            <section className="pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {filtered.length === 0 ? (
                        <p className="py-16 text-center text-muted-foreground">
                            No artworks in this category yet.
                        </p>
                    ) : (
                        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
                            {filtered.map((art, i) => {
                                const artImages = getArtImages(art);
                                return (
                                    <Reveal key={art.id} delay={Math.min(i, 8) * 60}>
                                        <div className="mb-4 break-inside-avoid">
                                            <ArtHoverCard
                                                art={art}
                                                images={artImages}
                                                onOpen={() => {
                                                    setSelected(art);
                                                    setSelectedImageIndex(0);
                                                }}
                                            />
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-border/60 bg-secondary/40 py-20 text-center">
                <Reveal>
                    <h3 className="font-display text-3xl font-semibold tracking-tight">
                        Want a custom artwork?
                    </h3>
                    <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                        Request a personalized art piece made just for you.
                    </p>
                    <Button className="mt-8 rounded-full" onClick={() => window.location.assign("/contact")} size="lg">
                        Contact me
                    </Button>
                </Reveal>
            </section>

            {/* LIGHTBOX */}
            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden sm:rounded-3xl">
                    <DialogTitle className="sr-only">{selected?.title}</DialogTitle>
                    <DialogDescription className="sr-only">
                        {selected?.category} artwork
                    </DialogDescription>
                    {selected && (() => {
                        const images = getArtImages(selected);
                        const current = images[Math.min(selectedImageIndex, images.length - 1)];
                        return (
                            <div>
                                {current && (
                                    <img
                                        src={current}
                                        alt={selected.title}
                                        className="max-h-[70vh] w-full object-contain bg-black/5"
                                    />
                                )}
                                {images.length > 1 && (
                                    <div className="flex items-center justify-center gap-2 bg-black/5 px-6 pb-2 pt-3">
                                        {images.map((url, i) => (
                                            <button
                                                key={url}
                                                type="button"
                                                onClick={() => setSelectedImageIndex(i)}
                                                className={`size-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                                                    i === selectedImageIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                                                }`}
                                            >
                                                <img src={url} alt="" className="h-full w-full object-cover" />
                                            </button>
                                        ))}
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            {selectedImageIndex + 1} / {images.length}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between gap-3 px-6 py-4">
                                    <div>
                                        <h3 className="font-semibold">{selected.title}</h3>
                                        {selected.description && (
                                            <p className="mt-1 text-sm text-muted-foreground">{selected.description}</p>
                                        )}
                                    </div>
                                    {selected.category && (
                                        <Badge variant="secondary" className="rounded-full shrink-0">
                                            {selected.category}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    )
}