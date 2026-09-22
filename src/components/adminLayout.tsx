import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import {
  BarChart3,
  FolderKanban,
  Images,
  LayoutTemplate,
  LogOut,
  Menu,
  MessageSquare,
  Package,
} from "lucide-react"
import { auth } from "@/firebase"
import ThemeLogo from "@/components/themeLogo"
import Reveal from "@/components/reveal"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", to: "/admin/dashboard", icon: BarChart3 },
  { key: "gallery", label: "Gallery", to: "/admin/gallery", icon: Images },
  { key: "products", label: "Products", to: "/admin/products", icon: Package },
  { key: "categories", label: "Categories", to: "/admin/categories", icon: FolderKanban },
  { key: "sections", label: "Sections", to: "/admin/layouts", icon: LayoutTemplate },
  { key: "messages", label: "Messages", to: "/admin/messages", icon: MessageSquare },
]

interface AdminLayoutProps {
  badge?: string
  title: string
  subtitle?: string
  active: string
  children: ReactNode
}

export default function AdminLayout({
  badge,
  title,
  subtitle,
  active,
  children,
}: AdminLayoutProps) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/admin")
  }

  const navClass = (isActive: boolean) =>
    cn(
      "justify-start gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground",
      isActive && "bg-primary/10 text-primary",
    )

  const SidebarContent = (
    <>
      <div className="mb-8 flex items-center gap-3 px-2">
        <ThemeLogo className="h-9 w-auto" />
        <div>
          <p className="font-display text-base font-semibold leading-tight">Thanudi Arts</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Button
            key={item.key}
            variant="ghost"
            className={navClass(active === item.key)}
            onClick={() => navigate(item.to)}
          >
            <item.icon className="size-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <Button variant="ghost" className="justify-start gap-2.5 rounded-xl px-3 py-2.5 text-destructive" onClick={handleLogout}>
        <LogOut className="size-4" />
        Logout
      </Button>
    </>
  )

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border p-5 md:flex">
        {SidebarContent}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-16 items-center justify-between border-b border-border px-4 md:hidden">
          <ThemeLogo className="h-8 w-auto" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open admin menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display">Admin Panel</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">{SidebarContent}</div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="mx-auto max-w-5xl">
            <header className="mb-8">
              <Reveal>
                {badge && (
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{badge}</p>
                )}
                <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">{title}</h1>
                {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
              </Reveal>
            </header>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}