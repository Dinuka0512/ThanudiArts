import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { db } from "../firebase";
import NavBar from "../componens/navBar.tsx";
import Bgvideo from "../assets/bg.mp4";

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) return;
        setSending(true);
        let firestoreOk = false;
        try {
            await addDoc(collection(db, "messages"), {
                name: name.trim(),
                email: email.trim(),
                message: message.trim(),
                createdAt: new Date().toISOString(),
            });
            firestoreOk = true;
        } catch (err) {
            console.error("Firestore error:", err);
            alert("Message saved but couldn't reach database. Check Firestore rules.");
        }

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                { name: name.trim(), email: email.trim(), message: message.trim(), time: new Date().toLocaleString(), reply_to: email.trim() },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );
            setSent(true);
        } catch (err) {
            console.error("EmailJS error:", err);
            if (firestoreOk) {
                alert("Message saved! But email notification failed.");
            }
        }

        if (firestoreOk) {
            setSent(true);
            setName("");
            setEmail("");
            setMessage("");
        }
        setSending(false);
    };

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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />

                        <input
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />

                        <textarea
                            rows={5}
                            placeholder="Your Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        ></textarea>

                        {sent ? (
                            <p className="text-green-600 text-center font-medium">Message sent! I'll get back to you soon.</p>
                        ) : (
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                {sending ? "Sending..." : "Send Message"}
                            </button>
                        )}
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
