import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import NavBar from "../componens/navBar.tsx";
import { useNavigate } from "react-router-dom";
import Bgvideo from "../assets/bg.mp4";

interface FeaturedItem {
    id: string;
    title?: string;
    name?: string;
    imageUrl?: string;
    images?: string[];
    category?: string;
    type?: string;
    price?: string;
}

interface SectionButton {
    text: string;
    link: string;
}

interface LayoutItem {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    buttons: SectionButton[];
    active: boolean;
    order: number;
}

const getFirstImage = (item: FeaturedItem): string =>
    item.images?.[0] || item.imageUrl || "";

export default function Explore() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<{ title: string; description: string }[]>([]);
    const [featuredPosts, setFeaturedPosts] = useState<FeaturedItem[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<FeaturedItem[]>([]);
    const [shopItems, setShopItems] = useState<FeaturedItem[]>([]);
    const [layouts, setLayouts] = useState<LayoutItem[]>([]);
    const [currentSection, setCurrentSection] = useState(0);

    useEffect(() => {
        const fetchAll = async () => {
            const [catSnap, postsSnap, prodSnap, allProdSnap, layoutsSnap] = await Promise.all([
                getDocs(collection(db, "categories")),
                getDocs(query(collection(db, "posts"), where("featured", "==", true))),
                getDocs(query(collection(db, "products"), where("featured", "==", true))),
                getDocs(collection(db, "products")),
                getDocs(query(collection(db, "layouts"), where("active", "==", true))),
            ]);

            setCategories(catSnap.docs.map((doc) => doc.data() as { title: string; description: string }));
            setFeaturedPosts(postsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FeaturedItem)));
            setFeaturedProducts(prodSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FeaturedItem)));
            setShopItems(allProdSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FeaturedItem)));

            const items = layoutsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as LayoutItem));
            items.sort((a, b) => a.order - b.order);
            setLayouts(items);

            setLoading(false);
        };
        fetchAll();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <NavBar />
                <div className="h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                        <p className="text-gray-500">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />

            {/* HERO */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src={Bgvideo}
                    autoPlay muted loop playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>

                <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">
                    <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-5 py-2 rounded-full mb-8 border border-white/20">
                        Sri Lanka's Creative Art Studio
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Thanudi Arts
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Discover hand-drawn and digital artworks crafted with creativity and passion.
                        From unique illustrations to custom designs, every piece tells a story.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <button
                            onClick={() => navigate("/gallery")}
                            className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition shadow-lg"
                        >
                            View Gallery
                        </button>
                        <button
                            onClick={() => navigate("/shop")}
                            className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
                        >
                            Shop Art
                        </button>
                    </div>
                </div>
            </section>

            {/* FEATURED ARTWORKS */}
            <section className="bg-white py-20 px-5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured Artworks</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Handpicked pieces showcasing artistic excellence</p>
                    </div>

                    {featuredPosts.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">No featured artworks yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {featuredPosts.map((item) => (
                                <div
                                    key={item.id}
                                    className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={getFirstImage(item)}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                                        {item.category && (
                                            <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <button
                            className="bg-black text-white px-10 py-3 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg"
                            onClick={() => navigate("/gallery")}
                        >
                            View Full Gallery
                        </button>
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            {featuredProducts.length > 0 && (
                <section className="bg-gray-50 py-20 px-5">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured Products</h2>
                            <p className="text-gray-500 max-w-xl mx-auto">Available artworks ready for your collection</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {featuredProducts.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/shop/${item.id}`)}
                                    className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={getFirstImage(item)}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                                        {item.type && (
                                            <p className="text-sm text-gray-500 mt-1">{item.type}</p>
                                        )}
                                        {item.price && (
                                            <p className="text-base font-bold text-gray-900 mt-2">{item.price}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <button
                                className="bg-black text-white px-10 py-3 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg"
                                onClick={() => navigate("/shop")}
                            >
                                Visit Shop
                            </button>
                        </div>
                    </div>
                </section>
            )}


             {/* STATS */}
            <section className="bg-gray-900 py-16 px-5">
                <div className="max-w-4xl mx-auto flex justify-center gap-8 md:gap-16 text-white">
                    <div className="text-center">
                        <p className="text-3xl md:text-4xl font-bold">250+</p>
                        <p className="text-sm text-gray-400 mt-2">Artworks Created</p>
                    </div>
                    <div className="w-px bg-gray-700"></div>
                    <div className="text-center">
                        <p className="text-3xl md:text-4xl font-bold">100+</p>
                        <p className="text-sm text-gray-400 mt-2">Happy Clients</p>
                    </div>
                    <div className="w-px bg-gray-700"></div>
                    <div className="text-center">
                        <p className="text-3xl md:text-4xl font-bold">5+</p>
                        <p className="text-sm text-gray-400 mt-2">Years Experience</p>
                    </div>
                </div>
            </section>

        
            {/* PAGE SECTIONS — CAROUSEL */}
            {layouts.length > 0 && (
                <section className="bg-white py-20 px-5">
                    <div className="max-w-6xl mx-auto relative">
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentSection * 100}%)` }}
                            >
                                {layouts.map((section) => (
                                    <div key={section.id} className="min-w-full flex flex-col md:flex-row items-center gap-12 px-4">
                                        <div className={`flex-1 ${section.imageUrl ? "md:pr-6" : ""}`}>
                                            {section.title && <h2 className="text-4xl font-bold text-gray-900 mb-3">{section.title}</h2>}
                                            {section.subtitle && <p className="text-lg text-gray-500 mb-4">{section.subtitle}</p>}
                                            {section.description && <p className="text-gray-600 leading-relaxed mb-6">{section.description}</p>}
                                            {section.buttons?.length > 0 && (
                                                <div className="flex flex-wrap gap-3">
                                                    {section.buttons.map((btn, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => navigate(btn.link || "#")}
                                                            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg"
                                                        >
                                                            {btn.text}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {section.imageUrl && (
                                            <div className="flex-1">
                                                <img
                                                    src={section.imageUrl}
                                                    alt={section.title || "Section image"}
                                                    className="w-full rounded-3xl shadow-xl object-cover max-h-[500px]"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Arrows */}
                        {layouts.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentSection(prev => prev === 0 ? layouts.length - 1 : prev - 1)}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition border border-gray-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                </button>
                                <button
                                    onClick={() => setCurrentSection(prev => prev === layouts.length - 1 ? 0 : prev + 1)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition border border-gray-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                            </>
                        )}

                        {/* Dots */}
                        {layouts.length > 1 && (
                            <div className="flex justify-center gap-3 mt-10">
                                {layouts.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentSection(i)}
                                        className={`w-3 h-3 rounded-full transition-all ${i === currentSection ? "bg-black w-6" : "bg-gray-300 hover:bg-gray-400"}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}


            {/* SHOP ITEMS */}
            {shopItems.length > 0 && (
                <section className="bg-gray-50 py-20 px-5">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-3">Shop Our Products</h2>
                            <p className="text-gray-500 max-w-xl mx-auto">Browse available artworks and products</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {shopItems.slice(0, 4).map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/shop/${item.id}`)}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={getFirstImage(item)}
                                            alt={item.name || item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <p className="font-medium text-gray-900 text-sm truncate">{item.name || item.title}</p>
                                        {item.type && <p className="text-xs text-gray-400 mt-0.5">{item.type}</p>}
                                        {item.price && <p className="text-sm font-bold text-gray-900 mt-2">LKR.{item.price}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-10">
                            <button
                                className="bg-black text-white px-10 py-3 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg"
                                onClick={() => navigate("/shop")}
                            >
                                View All Products
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* CATEGORY SECTION */}
            <section className="py-20 px-5 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">Art Categories</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">Explore different styles and mediums</p>
                </div>

                {categories.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">No categories yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition cursor-pointer"
                                onClick={() => navigate("/gallery")}
                            >
                                <h3 className="text-2xl font-semibold mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {item.description}
                                </p>
                                <button
                                    className="text-black font-semibold hover:underline"
                                    onClick={() => navigate("/gallery")}
                                >
                                    View Works →
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* WHY CHOOSE THANUDI ARTS */}
            <section className="bg-black py-24 px-5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Why Choose Thanudi Arts?
                        </h3>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Every piece is crafted with passion, precision, and a personal touch
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/10">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 0 2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128m0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">Original Artworks</h4>
                            <p className="text-gray-400 leading-relaxed">Every piece is an original creation, hand-drawn and digitally crafted with unique artistic vision.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/10">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">Custom Designs</h4>
                            <p className="text-gray-400 leading-relaxed">Have a specific vision? I create personalized artworks tailored to your ideas and preferences.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/10">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">Quality & Passion</h4>
                            <p className="text-gray-400 leading-relaxed">Each artwork is crafted with attention to detail, using high-quality techniques for lasting beauty.</p>
                        </div>
                    </div>
                    <div className="text-center mt-12">
                        <button
                            className="bg-white text-black px-10 py-3 rounded-full font-semibold hover:bg-gray-200 transition shadow-lg"
                            onClick={() => navigate("/contact")}
                        >
                            Start a Project
                        </button>
                    </div>
                </div>
            </section>

            <footer className="bg-white text-gray-500 py-12 px-5 border-t border-gray-200">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-gray-900 font-bold text-lg mb-3">Thanudi Arts</h4>
                        <p className="text-sm leading-relaxed">Hand-drawn and digital artworks crafted with passion and creativity.</p>
                    </div>
                    <div>
                        <h4 className="text-gray-900 font-bold text-lg mb-3">Quick Links</h4>
                        <div className="space-y-2 text-sm">
                            <button onClick={() => navigate("/gallery")} className="block hover:text-black transition">Gallery</button>
                            <button onClick={() => navigate("/shop")} className="block hover:text-black transition">Shop</button>
                            <button onClick={() => navigate("/about")} className="block hover:text-black transition">About</button>
                            <button onClick={() => navigate("/contact")} className="block hover:text-black transition">Contact</button>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-gray-900 font-bold text-lg mb-3">Contact</h4>
                        <p className="text-sm leading-relaxed">Sri Lanka</p>
                        <p className="text-sm">thanudiarts@gmail.com</p>
                    </div>
                </div>
                <div className="mt-8 pt-8 text-center text-sm text-gray-400">
                    © 2026 Thanudi Arts. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
