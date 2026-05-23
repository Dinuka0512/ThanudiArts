import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Bgvideo from "../assets/bg.mp4";
import VisitorAnalytics from "../components/visitorAnalytics";

export default function AdminDashboard() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full flex overflow-hidden">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover -z-20"
                src={Bgvideo} autoPlay muted loop playsInline
            />
            <div className="absolute inset-0 bg-black/70 -z-10"></div>

            <aside className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 text-white flex flex-col p-6 hidden md:flex">
                <h2 className="text-2xl font-bold mb-10 tracking-tight">Thanudi Arts <br/><span className="text-sm font-light text-gray-400">Admin Panel</span></h2>
                <nav className="space-y-4 flex-1">
                    <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition">Dashboard</button>
                    <button onClick={() => navigate("/admin/gallery")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Gallery</button>
                    <button onClick={() => navigate("/admin/products")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Products</button>
                    <button onClick={() => navigate("/admin/categories")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Categories</button>
                    <button onClick={() => navigate("/admin/layouts")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Sections</button>
                    <button onClick={() => navigate("/admin/messages")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Messages</button>
                </nav>
                <button 
                    onClick={async () => { await signOut(auth); navigate("/admin"); }}
                    className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/40 transition font-semibold"
                >
                    Logout
                </button>
            </aside>

            <main className="flex-1 h-screen overflow-y-auto p-6 md:p-12 text-white">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl font-bold">Dashboard</h1>
                        <p className="text-gray-400">Manage your site content.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <button onClick={() => navigate("/admin/gallery")} className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10 text-left hover:bg-white/20 transition">
                            <h3 className="text-2xl font-bold mb-2">Gallery</h3>
                            <p className="text-gray-400">Manage artworks</p>
                        </button>
                        <button onClick={() => navigate("/admin/products")} className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10 text-left hover:bg-white/20 transition">
                            <h3 className="text-2xl font-bold mb-2">Products</h3>
                            <p className="text-gray-400">Manage shop items</p>
                        </button>
                        <button onClick={() => navigate("/admin/categories")} className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10 text-left hover:bg-white/20 transition">
                            <h3 className="text-2xl font-bold mb-2">Categories</h3>
                            <p className="text-gray-400">Manage categories</p>
                        </button>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold mb-6">Analytics</h2>
                        <VisitorAnalytics />
                    </section>
                </div>
            </main>
        </div>
    );
}