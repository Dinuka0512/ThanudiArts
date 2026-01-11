import NavBar from "../componens/navBar.tsx";
import Logo from "../assets/l3.png";
import Bgvideo from "../assets/bg.mp4";
import { useNavigate } from "react-router-dom";

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />

            {/* HERO WITH VIDEO BACKGROUND */}
            <section className="relative h-[80vh] w-full overflow-hidden">

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
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                    <img src={Logo} alt="Thanudi Arts Logo" className="w-40 mb-4" />

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        About Thanudi Arts
                    </h1>

                    <p className="max-w-xl text-lg mb-6">
                        Discover the world of creativity and imagination through unique
                        hand-drawn and digital art.
                    </p>

                    <button
                        className="rounded-full px-6 py-3 bg-white text-black font-semibold hover:bg-gray-200 transition"
                        onClick={() => navigate("/")}
                    >
                        Explore More
                    </button>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section className="py-16 px-5 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">

                {/* Image Placeholder */}
                <div className="w-64 h-64 bg-gray-300 rounded-xl shadow-lg"></div>

                {/* Text */}
                <div>
                    <h2 className="text-3xl font-semibold mb-4">
                        Hello, I’m Thanudi!
                    </h2>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                        I’m an artist passionate about creating artwork that tells stories
                        and inspires imagination. I work with both digital and hand-drawn
                        mediums, blending traditional techniques with modern creativity.
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                        My goal is to bring unique designs and personalized art experiences
                        to everyone. Every artwork reflects my love for creativity and
                        detail.
                    </p>
                </div>
            </section>
        </div>
    );
}
