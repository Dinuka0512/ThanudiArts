import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Explore from "../pages/explore";
import About from "../pages/about";
import Contact from "../pages/contact.tsx";
import Gallery from "../pages/gallery.tsx";
import Shop from "../pages/shop.tsx";
import ProductDetail from "../pages/productDetail.tsx";
import AdminLogin from "../pages/adminLoginPage.tsx";
import AdminDashboard from "../pages/adminPage.tsx";
import ManageCategories from "../pages/manageCategories.tsx";
import ManageGallery from "../pages/manageGallery.tsx";
import ManageProducts from "../pages/manageProducts.tsx";
import ManageLayouts from "../pages/manageLayouts.tsx";
import ManageMessages from "../pages/manageMessages.tsx";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <div className="text-white flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Explore />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:id" element={<ProductDetail />} />
      
      {/* Login Page */}
      <Route path="/admin" element={<AdminLogin />} />
      
      {/* Dashboard Page (protected) */}
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute><ManageCategories /></ProtectedRoute>} />
      <Route path="/admin/gallery" element={<ProtectedRoute><ManageGallery /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute><ManageProducts /></ProtectedRoute>} />
      <Route path="/admin/layouts" element={<ProtectedRoute><ManageLayouts /></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute><ManageMessages /></ProtectedRoute>} />

      {/* 404 Catch-all (Optional but helpful) */}
      <Route path="*" element={<div className="text-white">Page Not Found</div>} />
    </Routes>
  );
}