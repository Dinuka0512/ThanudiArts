import NavBar from "../componens/navBar.tsx";
import { useNavigate } from "react-router-dom";

export default function Shop() {
    const navigate = useNavigate();

    const products = [
        {
            id: 1,
            name: "Digital Portrait",
            price: "LKR 2,500",
            type: "Digital Art",
        },
        {
            id: 2,
            name: "Hand-Drawn Sketch",
            price: "LKR 3,500",
            type: "Hand-Drawn",
        },
        {
            id: 3,
            name: "Custom Character Art",
            price: "LKR 5,000",
            type: "Custom Order",
        },
        {
            id: 4,
            name: "Poster Design",
            price: "LKR 4,000",
            type: "Digital Art",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />

            {/* HERO */}
            <section className="bg-black text-white py-20 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Art Shop
                </h1>
                <p className="max-w-xl mx-auto text-lg text-gray-300">
                    Purchase unique artworks and custom designs directly from the artist.
                </p>
            </section>

            {/* PRODUCT GRID */}
            <section className="py-16 px-5 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                        >
                            {/* Image Placeholder */}
                            <div className="h-64 bg-gray-300"></div>

                            {/* Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-1">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 mb-2">
                                    {product.type}
                                </p>
                                <p className="text-lg font-bold mb-4">
                                    {product.price}
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
