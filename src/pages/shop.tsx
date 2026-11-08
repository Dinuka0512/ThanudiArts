import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import PageHeader from "@/components/pageHeader";
import Reveal from "@/components/reveal";
import ShopCard from "@/components/shopCard";
import SEO from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { START_PROJECT_MESSAGE, whatsappLink } from "@/lib/whatsapp";

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

    const tabs = ["All", ...categories];

    return (
        <div className="bg-background">
            <SEO
                title="Art Shop"
                description="Shop original artworks and editions from Thanudi Arts. Discover contemporary pieces available to collect directly from the Sri Lankan studio."
                path="/shop"
            />
            <PageHeader
                title={<>The <span className="editorial">art shop</span></>}
                subtitle="Original artworks and editions, available to collect directly from the studio."
            />

            {/* SEARCH + FILTERS */}
            <section className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur-xl md:top-20">
                <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between sm:px-8">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {tabs.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
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

                    <div className="flex items-center gap-4">
                        <div className="relative w-full sm:w-56">
                            <Search className="absolute left-0 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search pieces"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="h-9 rounded-none border-0 border-b border-border bg-transparent pl-6 text-sm shadow-none focus-visible:border-foreground focus-visible:ring-0"
                            />
                        </div>
                        <span className="eyebrow hidden shrink-0 sm:block">
                            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
                        </span>
                    </div>
                </div>
            </section>

            {/* GRID */}
            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                    {paginated.length === 0 ? (
                        <p className="border-t border-border py-16 text-sm text-muted-foreground">
                            {searchQuery ? "No pieces match your search." : "No pieces in this category yet."}
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 sm:gap-y-9 md:grid-cols-3 xl:grid-cols-4">
                            {paginated.map((product, i) => (
                                <Reveal key={product.id} delay={Math.min(i, 8) * 50}>
                                    <ShopCard
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
                        <Reveal delay={120} className="mt-14 flex items-center justify-between border-t border-border pt-6">
                            <span className="eyebrow">
                                Page {currentPage} / {totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Previous page"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    className="size-9 rounded-none border-border"
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
                                        className="size-9 rounded-none border-border text-xs tabular-nums"
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
                                    className="size-9 rounded-none border-border"
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </Reveal>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-border bg-secondary/25 py-16 text-center md:py-24">
                <Reveal className="mx-auto max-w-[1440px] px-4 sm:px-8">
                    <p className="eyebrow">Bespoke</p>
                    <h3 className="mx-auto mt-5 max-w-2xl text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                        Looking for something <span className="editorial">one of a kind?</span>
                    </h3>
                    <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                        Commissions are open for portraits, gifts, illustrations and special requests.
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
                            Request a commission
                            <ArrowUpRight className="size-4" />
                        </a>
                    </Button>
                </Reveal>
            </section>
        </div>
    )
}
