import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import NavBar from "../componens/navBar.tsx";
import { useNavigate } from "react-router-dom";
import Bgvideo from "../assets/bg.mp4";

export default function Shop() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<{ id: string; name: string; price: string; type: string; imageUrl: string }[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        getDocs(collection(db, "products")).then((snap) => {
            const prods = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as any));
            setProducts(prods);
            const cats = [...new Set(prods.map((p: any) => p.type).filter(Boolean))] as string[];
            setCategories(cats);
        });
    }, []);

    const filtered = activeCategory === "All" ? products : products.filter((p) => p.type === activeCategory);

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />

            {/* HERO */}
            <section className="bg-black text-white py-20 text-center px-4 relative">

                {/* Background Video */}
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    src={Bgvideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Content */}
                <div className='relative'>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Art Shop
                    </h1>
                    <p className="max-w-xl mx-auto text-lg text-gray-300">
                        Purchase unique artworks and custom designs directly from the artist.
                    </p>
                </div>
            </section>

            {/* CATEGORY FILTER */}
            <section className="pt-8 pb-4 px-5 max-w-7xl mx-auto">
                <div className="flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={() => setActiveCategory("All")}
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
                            onClick={() => setActiveCategory(cat)}
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
                {filtered.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">No products in this category yet.</p>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

                    {filtered.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                        >
                            <div className="h-64 overflow-hidden">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
                                ) : (
                                    <div className="h-64 bg-gray-300"></div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-1">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 mb-2">
                                    {product.type}
                                </p>
                                <p className="text-lg font-bold mb-4">
                                    LKR.{product.price}
                                </p>

                                <button
                                    className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition"
                                    onClick={() => navigate("/contact")}
                                >
                                    Buy / Order
                                </button>
                            </div>
                        </div>
                    ))}

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
