import NavBar from "../componens/navBar.tsx";
import Bgvideo from "../assets/bg.mp4";

export default function Contact() {
    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />

            {/* HERO */}
            <section className="bg-black text-white py-20 text-center px-6 relative">
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

                {/*  Content  */}
                <div className="relative">
                    <h1 className="relative text-4xl md:text-5xl font-bold mb-4">
                        Contact Thanudi Arts
                    </h1>
                    <p className="max-w-xl mx-auto text-lg text-gray-300">
                        Have a question, custom request, or collaboration idea?
                        Let’s talk.
                    </p>
                </div>
            </section>

            {/* CONTACT CONTENT */}
            <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

                {/* LEFT - CONTACT INFO */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-semibold">Get in Touch</h2>

                    <div className="flex items-center gap-4">
                        {/*<Mail className="text-black" />*/}
                        <span>thanudiarts@gmail.com</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/*<Phone className="text-black" />*/}
                        <span>+94 77 123 4567</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/*<MapPin className="text-black" />*/}
                        <span>Sri Lanka</span>
                    </div>

                    <p className="text-gray-600">
                        I usually respond within 24 hours. Custom artwork and
                        collaborations are welcome.
                    </p>
                </div>

                {/* RIGHT - CONTACT FORM */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>

                    <form className="space-y-5">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                        />

                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                        />

                        <textarea
                            rows={5}
                            placeholder="Your Message"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                        ></textarea>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </section>

            {/* FOOTER NOTE */}
            <div className="text-center text-gray-500 pb-10">
                © 2026 Thanudi Arts. All rights reserved.
            </div>
        </div>
    );
}
