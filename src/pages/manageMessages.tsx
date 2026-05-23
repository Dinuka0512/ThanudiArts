import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Bgvideo from "../assets/bg.mp4";

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

export default function ManageMessages() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [selected, setSelected] = useState<Message | null>(null);

    const messagesCollection = collection(db, "messages");

    useEffect(() => {
        getDocs(messagesCollection).then((snap) => {
            const msgs = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Message));
            msgs.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
            setMessages(msgs);
            setPageLoading(false);
        });
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Delete this message?")) {
            try {
                await deleteDoc(doc(db, "messages", id));
                setMessages((prev) => prev.filter((m) => m.id !== id));
                if (selected?.id === id) setSelected(null);
            } catch (err) {
                console.error(err);
                alert("Failed to delete.");
            }
        }
    };

    if (pageLoading) {
        return (
            <div className="relative min-h-screen w-full flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full flex overflow-hidden">
            <video className="absolute top-0 left-0 w-full h-full object-cover -z-20" src={Bgvideo} autoPlay muted loop playsInline />
            <div className="absolute inset-0 bg-black/70 -z-10"></div>

            <aside className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 text-white flex flex-col p-6 hidden md:flex">
                <h2 className="text-2xl font-bold mb-10 tracking-tight">Thanudi Arts <br/><span className="text-sm font-light text-gray-400">Admin Panel</span></h2>
                <nav className="space-y-4 flex-1">
                    <button onClick={() => navigate("/admin/dashboard")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Dashboard</button>
                    <button onClick={() => navigate("/admin/gallery")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Gallery</button>
                    <button onClick={() => navigate("/admin/products")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Products</button>
                    <button onClick={() => navigate("/admin/categories")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Categories</button>
                    <button onClick={() => navigate("/admin/layouts")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Sections</button>
                    <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition">Messages</button>
                </nav>
                <button onClick={async () => { await signOut(auth); navigate("/admin"); }} className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/40 transition font-semibold">Logout</button>
            </aside>

            <main className="flex-1 h-screen overflow-y-auto p-6 md:p-12 text-white">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-4xl font-bold">Messages</h1>
                        <p className="text-gray-400">Contact form submissions from visitors.</p>
                    </header>

                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center py-12">No messages yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* List */}
                            <div className="space-y-3">
                                {messages.map((msg) => (
                                    <button
                                        key={msg.id}
                                        onClick={() => setSelected(msg)}
                                        className={`w-full text-left bg-white/10 backdrop-blur-sm p-4 rounded-2xl border transition ${
                                            selected?.id === msg.id ? "border-white/40 bg-white/20" : "border-white/10 hover:bg-white/15"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold truncate">{msg.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 shrink-0 ml-2">
                                                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ""}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{msg.message}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Detail */}
                            <div>
                                {selected ? (
                                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold">{selected.name}</h3>
                                                <a href={`mailto:${selected.email}`} className="text-sm text-blue-400 hover:underline">{selected.email}</a>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ""}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(selected.id)}
                                                className="text-red-400 hover:text-red-300 p-1"
                                                title="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="bg-black/30 rounded-xl p-4">
                                            <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                                        </div>
                                        <a
                                            href={`mailto:${selected.email}?subject=Re: Thanudi Arts inquiry`}
                                            className="inline-block mt-4 bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
                                        >
                                            Reply via Email
                                        </a>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <p>Select a message to view</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
