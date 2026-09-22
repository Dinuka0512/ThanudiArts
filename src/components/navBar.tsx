import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { Menu, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import ThemeLogo from "@/components/themeLogo"
import { cn } from "@/lib/utils"

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About", end: false },
  { to: "/gallery", label: "Gallery", end: false },
  { to: "/shop", label: "Shop", end: false },
  { to: "/contact", label: "Contact", end: false },
]

export default function NavBar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const goContact = () => {
    setOpen(false)
    navigate("/contact")
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
      isActive
        ? "text-primary"
        : "text-foreground/75 hover:bg-accent hover:text-foreground",
    )

  return (
    <header className="glass sticky top-0 z-50 border-b border-border/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20">
        <button
          onClick={() => navigate("/")}
          aria-label="Thanudi Arts — home"
          className="group flex items-center"
        >
          <ThemeLogo className="h-11 w-auto transition-transform duration-300 group-hover:scale-105" />
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden lg:block">
            <Button
              onClick={goContact}
              className="rounded-full"
              size="sm"
            >
              Get in touch
              <ArrowUpRight className="size-4" />
            </Button>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="rounded-full md:hidden"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader className="text-left">
                <SheetTitle className="font-display text-xl">Thanudi Arts</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-1">
                {LINKS.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.end}
                      className={({ isActive }) =>
                        cn(
                          "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                          isActive
                            ? "bg-accent text-primary"
                            : "text-foreground/75 hover:bg-accent hover:text-foreground",
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </SheetClose>
                ))}
                <Button onClick={goContact} className="mt-6 rounded-full">
                  Get in touch
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}