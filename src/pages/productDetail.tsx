import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import NavBar from "../componens/navBar.tsx";
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

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        if (!id) return;
        getDoc(doc(db, "products", id)).then((snap) => {
            if (snap.exists()) {
                const data = { ...snap.data(), id: snap.id } as Product;
                setProduct(data);
                getDocs(query(collection(db, "products"), where("type", "==", data.type))).then((relatedSnap) => {
                    const related = relatedSnap.docs
                        .map((d) => ({ ...d.data(), id: d.id } as Product))
                        .filter((p) => p.id !== data.id);
                    setRelatedProducts(related);
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <NavBar />
                <div className="flex items-center justify-center h-screen">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-100">
                <NavBar />
                <div className="flex flex-col items-center justify-center h-screen gap-4">
                    <p className="text-gray-500 text-lg">Product not found.</p>
                    <button onClick={() => navigate("/shop")} className="bg-black text-white px-6 py-2 rounded-full">
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const allImages = product.images && product.images.length > 0
        ? product.images
        : product.imageUrl ? [product.imageUrl] : [];

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />

            {/* HERO */}
            <section className="bg-black text-white py-5 text-center px-4 relative">
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    src={Bgvideo}
                    autoPlay muted loop playsInline
                />
                <div className="absolute inset-0 bg-black/60"></div>
                
            </section>

            {/* PRODUCT DETAIL */}
            <section className="py-12 px-5 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Images */}
                    <div>
                        {allImages.length > 0 ? (
                            <>
                                <div className="rounded-2xl overflow-hidden bg-white shadow-lg mb-4">
                                    <img
                                        src={allImages[currentImage]}
                                        alt={product.name}
                                        className="w-full h-96 object-cover"
                                    />
                                </div>
                                {allImages.length > 1 && (
                                    <>
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {allImages.map((url, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentImage(i)}
                                                    className={`shrink-0 rounded-xl overflow-hidden border-2 transition ${
                                                        i === currentImage ? "border-black" : "border-transparent hover:border-gray-300"
                                                    }`}
                                                >
                                                    <img src={url} alt="" className="w-20 h-20 object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 justify-center mt-4">
                                            <button
                                                onClick={() => setCurrentImage((p) => (p === 0 ? allImages.length - 1 : p - 1))}
                                                className="bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                            </button>
                                            <button
                                                onClick={() => setCurrentImage((p) => (p === allImages.length - 1 ? 0 : p + 1))}
                                                className="bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="h-96 bg-gray-300 rounded-2xl"></div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                        <p className="text-gray-500 mb-4">{product.type}</p>
                        <p className="text-3xl font-bold mb-6">LKR.{product.price}</p>

                        {product.description && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                            </div>
                        )}

                        <button
                            onClick={() => navigate("/contact")}
                            className="w-full bg-black text-white py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition"
                        >
                            Buy / Order
                        </button>

                        <button
                            onClick={() => navigate("/shop")}
                            className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-full text-lg font-semibold hover:bg-gray-50 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </section>

            {/* RELATED PRODUCTS */}
            {relatedProducts.length > 0 && (
                <section className="pb-16 px-5 max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8">More in {product.type}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map((item) => {
                            const img = item.images?.[0] || item.imageUrl || "";
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/shop/${item.id}`)}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        {img ? (
                                            <img src={img} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200"></div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{item.type}</p>
                                        <p className="text-sm font-bold text-gray-900 mt-2">LKR.{item.price}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            <footer className="text-center text-gray-500 py-6">
                © 2026 Thanudi Arts. All rights reserved.
            </footer>
        </div>
    );
}
