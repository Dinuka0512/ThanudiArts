import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Bgvideo from "../assets/bg.mp4"; 

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); 
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin/dashboard"); 
        } catch (err: any) {
            setError("Access Denied: Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover -z-20"
                src={Bgvideo} autoPlay muted loop playsInline
            />
            <div className="absolute inset-0 bg-black/60 -z-10"></div>

            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Admin Login</h2>
                    <p className="text-gray-300">Sign in to manage Thanudi Arts</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-white/30 transition"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-white/30 transition"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 mt-4"
                    >
                        {loading ? "Authenticating..." : "Enter Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}