import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import PublicLayout from "@/components/publicLayout";
import PageLoader from "@/components/pageLoader";

const Explore = lazy(() => import("@/pages/explore"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const Gallery = lazy(() => import("@/pages/gallery"));
const Shop = lazy(() => import("@/pages/shop"));
const ProductDetail = lazy(() => import("@/pages/productDetail"));
const AdminLogin = lazy(() => import("@/pages/adminLoginPage"));
const AdminDashboard = lazy(() => import("@/pages/adminPage"));
const ManageCategories = lazy(() => import("@/pages/manageCategories"));
const ManageGallery = lazy(() => import("@/pages/manageGallery"));
const ManageProducts = lazy(() => import("@/pages/manageProducts"));
const ManageLayouts = lazy(() => import("@/pages/manageLayouts"));
const ManageMessages = lazy(() => import("@/pages/manageMessages"));

const Loading = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <PageLoader />
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Explore />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<Loading />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<Loading />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="/gallery"
          element={
            <Suspense fallback={<Loading />}>
              <Gallery />
            </Suspense>
          }
        />
        <Route
          path="/shop"
          element={
            <Suspense fallback={<Loading />}>
              <Shop />
            </Suspense>
          }
        />
        <Route
          path="/shop/:id"
          element={
            <Suspense fallback={<Loading />}>
              <ProductDetail />
            </Suspense>
          }
        />
      </Route>

      <Route
        path="/admin"
        element={
          <Suspense fallback={<Loading />}>
            <AdminLogin />
          </Suspense>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <ManageCategories />
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/admin/gallery"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <ManageGallery />
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/admin/products"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <ManageProducts />
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/admin/layouts"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <ManageLayouts />
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/admin/messages"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <ManageMessages />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="font-display text-6xl font-semibold text-primary">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <a
        href="/"
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        Back to home
      </a>
    </div>
  );
}