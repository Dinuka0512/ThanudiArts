import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import PageHeader from "@/components/pageHeader";
import Reveal from "@/components/reveal";
import ArtCard from "@/components/artCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    price: string;
    type: string;
    description?: string;
    images?: string[];
    imageUrl?: string;
}

const ITEMS_PER_PAGE = 12;

export default function Shop() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getDocs(collection(db, "products"))
            .then((snap) => {
                const prods = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Product));
                setProducts(prods);
                const cats = [...new Set(prods.map((p) => p.type).filter(Boolean))] as string[];
                setCategories(cats);
            })
            .catch(() => {
                setProducts([]);
                setCategories([]);
            });
    }, []);

    const filtered = useMemo(() => {
        let result = activeCategory === "All" ? products : products.filter((p) => p.type === activeCategory);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    (p.description || "").toLowerCase().includes(q) ||
                    p.type.toLowerCase().includes(q)
            );
        }
        return result;
    }, [products, activeCategory, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        setCurrentPage(1);
    };

    const getFirstImage = (p: Product) =>
        (p.images && p.images[0]) || p.imageUrl || "";

    const pillClass = (isActive: boolean) =>
        cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-colors",
            isActive
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent",
        );

    return (
        <div className="bg-background">
            <PageHeader
                eyebrow="Shop"
                title="Art shop"
                subtitle="Purchase unique artworks and custom designs directly from the artist."
            />

            {/* SEARCH + FILTERS */}
            <section className="mt-10 pb-10">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
                    <Reveal className="relative mx-auto max-w-md">
                        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search products…"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="rounded-full pl-11"
                        />
                    </Reveal>
                    <Reveal delay={120} className="flex flex-wrap justify-center gap-2">
                        <button onClick={() => handleCategoryChange("All")} className={pillClass(activeCategory === "All")}>
                            All
                        </button>
                        {categories.map((cat) => (
                            <button key={cat} onClick={() => handleCategoryChange(cat)} className={pillClass(activeCategory === cat)}>
                                {cat}
                            </button>
                        ))}
                    </Reveal>
                </div>
            </section>

            {/* GRID */}
            <section className="pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {paginated.length === 0 ? (
                        <p className="py-16 text-center text-muted-foreground">
                            {searchQuery ? "No products match your search." : "No products in this category yet."}
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {paginated.map((product, i) => (
                                <Reveal key={product.id} delay={Math.min(i, 8) * 70}>
                                    <ArtCard
                                        title={product.name}
                                        imageUrl={getFirstImage(product)}
                                        price={product.price}
                                        badge={product.type}
                                        onClick={() => navigate(`/shop/${product.id}`)}
                                    />
                                </Reveal>
                            ))}
                        </div>
                    )}

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <Reveal delay={150} className="mt-12 flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Previous page"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="icon"
                                    aria-label={`Page ${page}`}
                                    onClick={() => setCurrentPage(page)}
                                    className="rounded-lg"
                                >
                                    {page}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Next page"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </Reveal>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-border/60 bg-secondary/40 py-20 text-center">
                <Reveal>
                    <h3 className="font-display text-3xl font-semibold tracking-tight">
                        Need something custom?
                    </h3>
                    <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                        Contact me for personalized artwork and special requests.
                    </p>
                    <Button className="mt-8 rounded-full" size="lg" onClick={() => navigate("/contact")}>
                        Contact me
                    </Button>
                </Reveal>
            </section>
        </div>
    )
}