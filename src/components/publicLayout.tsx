import { Outlet } from "react-router-dom"
import NavBar from "@/components/navBar"
import Footer from "@/components/footer"

export default function PublicLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}