import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import NavBar from "../componens/navBar.tsx";
import Bgvideo from "../assets/bg.mp4";

export default function Gallery() {
    const [artworks, setArtworks] = useState<{ id: string; title: string; category: string; imageUrl: string }[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        getDocs(collection(db, "posts")).then((snap) => {
            const posts = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as any));
            setArtworks(posts);
            const cats = [...new Set(posts.map((p: any) => p.category).filter(Boolean))] as string[];
            setCategories(cats);
        });
    }, []);

    const filtered = activeCategory === "All" ? artworks : artworks.filter((a) => a.category === activeCategory);

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
               <div className="relative">
                   <h1 className="text-4xl md:text-5xl font-bold mb-4">
                       Art Gallery
                   </h1>
                   <p className="max-w-xl mx-auto text-lg text-gray-300">
                       A collection of hand-drawn and digital artworks crafted with passion.
                   </p>
               </div>
            </section>

            {/* CATEGORY FILTER */}
            <section className="py-8 px-5 max-w-7xl mx-auto">
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

            {/* GALLERY GRID */}
            <section className="pb-16 px-5 max-w-7xl mx-auto">
                {filtered.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">No artworks in this category yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {filtered.map((art) => (
                            <div
                                key={art.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                            >
                                <div className="h-64 overflow-hidden">
                                    {art.imageUrl ? (
                                        <img src={art.imageUrl} className="w-full h-full object-cover" alt={art.title} />
                                    ) : (
                                        <div className="h-64 bg-gray-300"></div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold mb-1">{art.title}</h3>
                                    <p className="text-gray-600 text-sm">{art.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="bg-black text-white py-16 text-center px-4">
                <h3 className="text-3xl font-semibold mb-4">
                    Want a Custom Artwork?
                </h3>
                <p className="text-gray-300 mb-6">
                    Request a personalized art piece made just for you.
                </p>
                <a
                    href="/contact"
                    className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
                >
                    Contact Me
                </a>
            </section>

            <footer className="text-center text-gray-500 py-6">
                © 2026 Thanudi Arts. All rights reserved.
            </footer>
        </div>
    );
}
