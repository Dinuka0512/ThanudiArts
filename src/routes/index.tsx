import { Route, Routes } from "react-router-dom";
import Explore from "../pages/explore";
import About from "../pages/about";
import Contact from "../pages/contact.tsx";

export default function index() {
  return (
    <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}
