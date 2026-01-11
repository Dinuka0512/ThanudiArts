import  Logo from "../assets/l2.png"
import {useNavigate} from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate();
    return (
        <nav className="bg-black text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo / Brand */}
                    <div className="flex-shrink-0" onClick={() => navigate("/")}>
                        <img src={Logo} className="h-12 w-full " alt="Thanudi Arts Logo" />
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-8">
                        <p
                           className="hover:text-gray-200 transition duration-200"
                           onClick={() => navigate("/about")}
                        >
                            About
                        </p>
                        <p className="hover:text-gray-200 transition duration-200">
                            Gallery
                        </p>
                        <p className="hover:text-gray-200 transition duration-200">
                            Shop
                        </p>
                        <p className="hover:text-gray-200 transition duration-200">
                            Contact
                        </p>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button className="focus:outline-none">
                            {/* Simple hamburger icon */}
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
