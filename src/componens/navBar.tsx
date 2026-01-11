import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/l2.png";

export default function NavBar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-black text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-20 items-center">

                    {/* Logo */}
                    <div
                        className="cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <img src={Logo} className="h-12" alt="Thanudi Arts Logo" />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        <button onClick={() => navigate("/about")} className="hover:text-gray-300">
                            About
                        </button>
                        <button onClick={() => navigate("/gallery")} className="hover:text-gray-300">
                            Gallery
                        </button>
                        <button onClick={() => navigate("/shop")} className="hover:text-gray-300">
                            Shop
                        </button>
                        <button onClick={() => navigate("/contact")} className="hover:text-gray-300">
                            Contact
                        </button>
                    </div>

                    {/* Mobile Button */}
                    <div className="md:hidden">
                        <button onClick={() => setOpen(!open)}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {open && (
                    <div className="md:hidden flex flex-col space-y-4 pb-6">
                        <button onClick={() => { navigate("/about"); setOpen(false); }}>About</button>
                        <button onClick={() => { navigate("/gallery"); setOpen(false); }}>Gallery</button>
                        <button onClick={() => { navigate("/shop"); setOpen(false); }}>Shop</button>
                        <button onClick={() => { navigate("/contact"); setOpen(false); }}>Contact</button>
                    </div>
                )}
            </div>
        </nav>
    );
}
