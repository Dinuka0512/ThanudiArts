import NavBar from "../componens/navBar.tsx";
import { useNavigate } from "react-router-dom";
import Bgvideo from "../assets/bg.mp4";

export default function Explore() {
    const navigate = useNavigate();

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
                        Explore Thanudi Arts
                    </h1>
                    <p className="max-w-xl mx-auto text-lg text-gray-300">
                        Discover hand-drawn and digital artworks crafted with creativity
                        and passion.
                    </p>
                </div>
            </section>

            {/* CATEGORY SECTION */}
            <section className="py-16 px-5 max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold mb-10 text-center">
                    Art Categories
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Digital Art", desc: "Modern digital illustrations" },
                        { title: "Hand-Drawn Art", desc: "Traditional pencil & ink work" },
                        { title: "Custom Orders", desc: "Personalized artwork requests" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition cursor-pointer"
                        >
                            <h3 className="text-2xl font-semibold mb-3">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {item.desc}
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
            </section>

            {/* FEATURED WORK */}
            <section className="bg-white py-16 px-5">
                <h2 className="text-3xl font-semibold mb-10 text-center">
                    Featured Artworks
                </h2>

                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-48 bg-gray-300 rounded-xl shadow-md hover:scale-105 transition"
                        ></div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <button
                        className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
                        onClick={() => navigate("/gallery")}
                    >
                        View Full Gallery
                    </button>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-black text-white py-16 text-center px-4">
                <h3 className="text-3xl font-semibold mb-4">
                    Looking for Custom Art?
                </h3>
                <p className="text-gray-300 mb-6">
                    Get a unique artwork made just for you.
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
