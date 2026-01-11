import { Route, Routes } from "react-router-dom";
import Explore from "../pages/explore";
import About from "../pages/about";

export default function index() {
  return (
    <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/about" element={<About />} />
    </Routes>
  )
}
