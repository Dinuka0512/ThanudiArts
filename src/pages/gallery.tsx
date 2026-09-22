import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ArrowUpRight } from "lucide-react";
import { db } from "@/firebase";
import PageHeader from "@/components/pageHeader";
import Reveal from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    imageUrl: string;
}

export default function Gallery() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [selected, setSelected] = useState<Artwork | null>(null);

    useEffect(() => {
        getDocs(collection(db, "posts"))
            .then((snap) => {
                const posts = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Artwork));
                setArtworks(posts);
                const cats = [...new Set(posts.map((p) => p.category).filter(Boolean))] as string[];
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
            <section className="pb-10">
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
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {filtered.map((art, i) => (
                                <Reveal key={art.id} delay={Math.min(i, 8) * 70}>
                                    <Card
                                        onClick={() => setSelected(art)}
                                        className="group cursor-pointer overflow-hidden border-border/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <img
                                                src={art.imageUrl}
                                                alt={art.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 transition-transform duration-300 group-hover:translate-y-0">
                                                <p className="flex items-center gap-1 text-sm font-semibold text-white">
                                                    View artwork <ArrowUpRight className="size-4" />
                                                </p>
                                            </div>
                                        </div>
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="font-semibold text-foreground">{art.title}</h3>
                                                {art.category && (
                                                    <Badge variant="secondary" className="rounded-full shrink-0">
                                                        {art.category}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Reveal>
                            ))}
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
                    {selected && (
                        <div>
                            <img
                                src={selected.imageUrl}
                                alt={selected.title}
                                className="max-h-[70vh] w-full object-contain bg-black/5"
                            />
                            <div className="flex items-center justify-between gap-3 px-6 py-4">
                                <h3 className="font-semibold">{selected.title}</h3>
                                {selected.category && (
                                    <Badge variant="secondary" className="rounded-full">
                                        {selected.category}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}