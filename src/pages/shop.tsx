import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import NavBar from "../componens/navBar.tsx";
import { useNavigate } from "react-router-dom";
import Bgvideo from "../assets/bg.mp4";

interface Product {
    id: string;
    name: string;
    price: string;
    type: string;
    description?: string;
    images?: string[];
    imageUrl?: string;
}

const ITEMS_PER_PAGE = 20;

export default function Shop() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getDocs(collection(db, "products")).then((snap) => {
            const prods = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as any));
            setProducts(prods);
            const cats = [...new Set(prods.map((p: any) => p.type).filter(Boolean))] as string[];
            setCategories(cats);
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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />

            {/* HERO */}
            <section className="bg-black text-white py-20 text-center px-4 relative">
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    src={Bgvideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Art Shop
                    </h1>
                    <p className="max-w-xl mx-auto text-lg text-gray-300">
                        Purchase unique artworks and custom designs directly from the artist.
                    </p>
                </div>
            </section>

            {/* FILTERS & SEARCH */}
            <section className="pt-8 pb-4 px-5 max-w-7xl mx-auto space-y-4">
                {/* Search */}
                <div className="max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full px-5 py-3 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={() => handleCategoryChange("All")}
                        className={`px-5 py-2 rounded-full font-medium transition ${
                            activeCategory === "All"
                                ? "bg-black text-white"
                                : "bg-white text-black hover:bg-gray-200"
                        }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-5 py-2 rounded-full font-medium transition ${
                                activeCategory === cat
                                    ? "bg-black text-white"
                                    : "bg-white text-black hover:bg-gray-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* PRODUCT GRID */}
            <section className="pb-16 px-5 max-w-7xl mx-auto">
                {paginated.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">
                        {searchQuery ? "No products match your search." : "No products in this category yet."}
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {paginated.map((product) => {
                            const allImages = product.images && product.images.length > 0
                                ? product.images
                                : product.imageUrl ? [product.imageUrl] : [];
                            return (
                                <div
                                    key={product.id}
                                    onClick={() => navigate(`/shop/${product.id}`)}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
                                >
                                    {/* Image Gallery */}
                                    {allImages.length > 0 ? (
                                        <ImageGallery images={allImages} name={product.name} />
                                    ) : (
                                        <div className="h-64 bg-gray-300"></div>
                                    )}

                                    {/* Info */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 mb-2">
                                            {product.type}
                                        </p>
                                        {product.description && (
                                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                                {product.description}
                                            </p>
                                        )}
                                        <p className="text-lg font-bold mb-4">
                                            LKR.{product.price}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                                    currentPage === page
                                        ? "bg-black text-white"
                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="bg-black text-white py-16 text-center px-4">
                <h3 className="text-3xl font-semibold mb-4">
                    Need Something Custom?
                </h3>
                <p className="text-gray-300 mb-6">
                    Contact me for personalized artwork and special requests.
                </p>
                <button
                    className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
                    onClick={() => navigate("/contact")}
                >
                    Contact Me
                </button>
            </section>

            <footer className="text-center text-gray-500 py-6">
                © 2026 Thanudi Arts. All rights reserved.
            </footer>
        </div>
    );
}

function ImageGallery({ images, name }: { images: string[]; name: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (images.length === 1) {
        return (
            <div className="h-64 overflow-hidden">
                <img src={images[0]} className="w-full h-full object-cover" alt={name} />
            </div>
        );
    }

    return (
        <div className="relative group">
            <div className="h-64 overflow-hidden">
                <img src={images[currentIndex]} className="w-full h-full object-cover" alt={name} />
            </div>
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, i) => (
                            <span
                                key={i}
                                className={`w-2 h-2 rounded-full transition ${i === currentIndex ? "bg-white" : "bg-white/50"}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
