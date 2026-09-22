import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/reveal";
import ArtCard from "@/components/artCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        if (!id) return;
        getDoc(doc(db, "products", id))
            .then((snap) => {
                if (snap.exists()) {
                    const data = { ...snap.data(), id: snap.id } as Product;
                    setProduct(data);
                    setCurrentImage(0);
                    getDocs(query(collection(db, "products"), where("type", "==", data.type)))
                        .then((relatedSnap) => {
                            const related = relatedSnap.docs
                                .map((d) => ({ ...d.data(), id: d.id } as Product))
                                .filter((p) => p.id !== data.id);
                            setRelatedProducts(related);
                            setLoading(false);
                        })
                        .catch(() => {
                            setRelatedProducts([]);
                            setLoading(false);
                        });
                } else {
                    setLoading(false);
                }
            })
            .catch(() => {
                setProduct(null);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
                <p className="text-lg text-muted-foreground">Product not found.</p>
                <Button className="rounded-full" onClick={() => navigate("/shop")}>
                    Back to shop
                </Button>
            </div>
        );
    }

    const allImages = product.images && product.images.length > 0
        ? product.images
        : product.imageUrl ? [product.imageUrl] : [];

    return (
        <div className="bg-background">
            {/* BREADCRUMB */}
            <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/shop">Shop</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="line-clamp-1">{product.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* DETAIL */}
            <section className="py-10">
                <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-14">
                    {/* Images */}
                    <Reveal>
                        {allImages.length > 0 ? (
                            <>
                                <div className="overflow-hidden rounded-3xl border border-border bg-secondary/30 shadow-sm">
                                    <img
                                        src={allImages[currentImage]}
                                        alt={product.name}
                                        className="aspect-square w-full object-cover"
                                    />
                                </div>
                                {allImages.length > 1 && (
                                    <>
                                        <div className="mt-4 flex items-center justify-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                aria-label="Previous image"
                                                className="rounded-full"
                                                onClick={() =>
                                                    setCurrentImage((p) => (p === 0 ? allImages.length - 1 : p - 1))
                                                }
                                            >
                                                <ChevronLeft className="size-4" />
                                            </Button>
                                            <div className="flex gap-2 overflow-x-auto px-1">
                                                {allImages.map((url, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentImage(i)}
                                                        aria-label={`View image ${i + 1}`}
                                                        className={cn(
                                                            "shrink-0 overflow-hidden rounded-xl border-2 transition",
                                                            i === currentImage
                                                                ? "border-primary"
                                                                : "border-border opacity-60 hover:opacity-100",
                                                        )}
                                                    >
                                                        <img src={url} alt="" loading="lazy" className="size-16 object-cover sm:size-20" />
                                                    </button>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                aria-label="Next image"
                                                className="rounded-full"
                                                onClick={() =>
                                                    setCurrentImage((p) => (p === allImages.length - 1 ? 0 : p + 1))
                                                }
                                            >
                                                <ChevronRight className="size-4" />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="aspect-square rounded-3xl bg-secondary/40" />
                        )}
                    </Reveal>

                    {/* Info */}
                    <Reveal delay={120} className="flex flex-col">
                        {product.type && (
                            <Badge variant="secondary" className="mb-4 w-fit rounded-full">
                                {product.type}
                            </Badge>
                        )}
                        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                            {product.name}
                        </h2>
                        <p className="mt-4 font-display text-2xl font-semibold text-primary">
                            LKR. {product.price}
                        </p>

                        {product.description && (
                            <div className="mt-8">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                    Description
                                </h3>
                                <p className="mt-2 leading-relaxed whitespace-pre-line text-muted-foreground">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        <div className="mt-10 flex flex-col gap-3">
                            <Button
                                className="w-full rounded-full text-base"
                                size="lg"
                                onClick={() => navigate("/contact")}
                            >
                                Buy / Order
                                <ArrowRight className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full rounded-full"
                                size="lg"
                                onClick={() => navigate("/shop")}
                            >
                                Continue shopping
                            </Button>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* RELATED */}
            {relatedProducts.length > 0 && (
                <section className="pb-20">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6">
                        <Reveal>
                            <h2 className="mb-8 font-display text-2xl font-semibold tracking-tight">
                                More in {product.type}
                            </h2>
                        </Reveal>
                        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                            {relatedProducts.slice(0, 4).map((item, i) => {
                                    const img = item.images?.[0] || item.imageUrl || "";
                                    return (
                                        <Reveal key={item.id} delay={Math.min(i, 7) * 80}>
                                            <ArtCard
                                                title={item.name}
                                                imageUrl={img}
                                                price={item.price}
                                                badge={item.type}
                                                onClick={() => navigate(`/shop/${item.id}`)}
                                            />
                                        </Reveal>
                                    );
                                })}
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}