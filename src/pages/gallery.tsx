import NavBar from "../componens/navBar.tsx";
import Bgvideo from "../assets/bg.mp4";

export default function Gallery() {
    const artworks = [
        { id: 1, title: "Digital Portrait", category: "Digital Art" },
        { id: 2, title: "Sketch Art", category: "Hand-Drawn" },
        { id: 3, title: "Fantasy Illustration", category: "Digital Art" },
        { id: 4, title: "Pencil Drawing", category: "Hand-Drawn" },
        { id: 5, title: "Custom Character", category: "Custom" },
        { id: 6, title: "Concept Art", category: "Digital Art" },
    ];

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

            {/* GALLERY GRID */}
            <section className="py-16 px-5 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

                    {artworks.map((art) => (
                        <div
                            key={art.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                        >
                            {/* Image Placeholder */}
                            <div className="h-64 bg-gray-300"></div>

                            {/* Info */}
                            <div className="p-5">
                                <h3 className="text-xl font-semibold mb-1">
                                    {art.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {art.category}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
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
