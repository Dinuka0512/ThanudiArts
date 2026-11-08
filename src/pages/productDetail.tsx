import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/reveal";
import ShopCard from "@/components/shopCard";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { productEnquiryLink } from "@/lib/whatsapp";

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
                <div className="flex flex-col items-center gap-4">
                    <span className="eyebrow">Thanudi Arts</span>
                    <div className="h-px w-24 overflow-hidden bg-border">
                        <div className="loader-line h-full w-1/2 bg-foreground" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 text-center">
                <p className="eyebrow">Not found</p>
                <p className="text-2xl font-medium tracking-[-0.03em]">This piece is no longer available.</p>
                <Button className="h-10 rounded-none px-5 text-[10px] uppercase tracking-[0.18em]" onClick={() => navigate("/shop")}>
                    Back to the shop
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
            <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-8">
                <Breadcrumb>
                    <BreadcrumbList className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/shop" className="transition-colors hover:text-foreground">
                                    Shop
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-border" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="line-clamp-1 text-foreground">{product.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* DETAIL */}
            <section className="pb-16 pt-8 md:pb-24 md:pt-10">
                <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-14">
                    {/* Images */}
                    <Reveal className="lg:col-span-7">
                        {allImages.length > 0 ? (
                            <>
                                <div className="border border-border bg-card p-2 sm:p-3">
                                    <div className="overflow-hidden bg-secondary/40">
                                        <img
                                            src={allImages[currentImage]}
                                            alt={product.name}
                                            className="aspect-[4/5] w-full object-cover sm:aspect-square"
                                        />
                                    </div>
                                </div>
                                {allImages.length > 1 && (
                                    <div className="mt-4 flex items-center justify-between gap-4">
                                        <div className="flex gap-2 overflow-x-auto py-1">
                                            {allImages.map((url, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentImage(i)}
                                                    aria-label={`View image ${i + 1}`}
                                                    className={cn(
                                                        "shrink-0 overflow-hidden border-2 transition",
                                                        i === currentImage
                                                            ? "border-foreground"
                                                            : "border-transparent opacity-50 hover:opacity-100",
                                                    )}
                                                >
                                                    <img src={url} alt="" loading="lazy" className="size-16 object-cover sm:size-20" />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex shrink-0 gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                aria-label="Previous image"
                                                className="size-9 rounded-none border-border"
                                                onClick={() =>
                                                    setCurrentImage((p) => (p === 0 ? allImages.length - 1 : p - 1))
                                                }
                                            >
                                                <ChevronLeft className="size-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                aria-label="Next image"
                                                className="size-9 rounded-none border-border"
                                                onClick={() =>
                                                    setCurrentImage((p) => (p === allImages.length - 1 ? 0 : p + 1))
                                                }
                                            >
                                                <ChevronRight className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="aspect-[4/5] bg-secondary/40 sm:aspect-square" />
                        )}
                    </Reveal>

                    {/* Info */}
                    <Reveal delay={100} className="flex flex-col lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
                        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                            <span className="eyebrow">{product.type || "Original piece"}</span>
                            <span className="eyebrow">Thanudi Arts</span>
                        </div>

                        <h1 className="mt-6 text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                            {product.name}
                        </h1>

                        <div className="mt-7 flex items-end justify-between gap-4 border-b border-border pb-6">
                            <div>
                                <p className="eyebrow">Price</p>
                                <p className="mt-2 text-2xl font-medium tabular-nums tracking-[-0.03em]">
                                    LKR {product.price}
                                </p>
                            </div>
                            <span className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                <span className="size-1.5 rounded-full bg-brand" />
                                Available
                            </span>
                        </div>

                        {product.description && (
                            <div className="mt-7">
                                <h3 className="eyebrow">About this piece</h3>
                                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        <div className="mt-9 flex flex-col gap-3">
                            <Button
                                asChild
                                className="h-12 w-full rounded-none text-[10px] uppercase tracking-[0.18em]"
                            >
                                <a
                                    href={productEnquiryLink({
                                        name: product.name,
                                        type: product.type,
                                        price: product.price,
                                        url: window.location.href,
                                    })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Buy on WhatsApp
                                    <ArrowUpRight className="size-4" />
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-11 w-full rounded-none border-border text-[10px] uppercase tracking-[0.18em]"
                                onClick={() => navigate("/shop")}
                            >
                                Continue browsing
                            </Button>
                        </div>

                        <p className="mt-6 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
                            Every order is handled personally. Message the studio for shipping,
                            framing and delivery details.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* RELATED */}
            {relatedProducts.length > 0 && (
                <section className="border-t border-border py-16 md:py-24">
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                        <div className="flex items-end justify-between gap-6 border-t border-border pt-4">
                            <div className="flex items-center gap-4">
                                <p className="eyebrow">More in {product.type}</p>
                            </div>
                            <button
                                onClick={() => navigate("/shop")}
                                className="link-line text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                            >
                                View all
                                <ArrowUpRight className="size-3.5" />
                            </button>
                        </div>
                        <h2 className="mt-8 text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                            You may also <span className="editorial">like</span>
                        </h2>
                        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 sm:gap-y-9 md:grid-cols-4">
                            {relatedProducts.slice(0, 4).map((item, i) => {
                                const img = item.images?.[0] || item.imageUrl || "";
                                return (
                                    <Reveal key={item.id} delay={Math.min(i, 7) * 60}>
                                        <ShopCard
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
