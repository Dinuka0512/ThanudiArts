import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { ArrowUpRight, Menu } from "lucide-react"
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
import { START_PROJECT_MESSAGE, whatsappLink } from "@/lib/whatsapp"

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About", end: false },
  { to: "/gallery", label: "Gallery", end: false },
  { to: "/shop", label: "Shop", end: false },
  { to: "/contact", label: "Contact", end: false },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const projectLink = whatsappLink(START_PROJECT_MESSAGE)

  return (
    <header className="glass sticky top-0 z-50 border-b border-border">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-8 px-4 sm:px-8 md:h-20">
        <Link
          to="/"
          aria-label="Thanudi Arts — home"
          className="group flex shrink-0 items-center"
        >
          <ThemeLogo className="h-8 w-auto transition-opacity duration-300 group-hover:opacity-60 md:h-9" />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "group relative py-2 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px bg-foreground transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="mr-2 hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground xl:block">
            Original art · Sri Lanka
          </span>
          <Button
            asChild
            size="sm"
            className="hidden h-9 rounded-none px-5 text-[10px] font-medium uppercase tracking-[0.18em] lg:inline-flex"
          >
            <a href={projectLink} target="_blank" rel="noopener noreferrer">
              Inquire
              <ArrowUpRight className="size-3.5" />
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="rounded-none md:hidden"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full gap-0 border-l border-border bg-background p-0 sm:max-w-md"
            >
              <SheetHeader className="border-b border-border px-6 py-5 text-left">
                <SheetTitle className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col px-6">
                {LINKS.map((link, i) => (
                  <SheetClose asChild key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.end}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center justify-between border-b border-border py-5 transition-colors",
                          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                        )
                      }
                    >
                      <span className="text-2xl font-medium tracking-[-0.03em]">{link.label}</span>
                      <span className="text-[10px] tabular-nums tracking-[0.2em] text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </NavLink>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto px-6 py-8">
                <p className="eyebrow mb-4">Commissions open</p>
                <Button asChild className="h-12 w-full rounded-none text-xs uppercase tracking-[0.18em]">
                  <a
                    href={projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    Start a project
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>
                <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                  thanudiarts@gmail.com
                  <br />
                  Sri Lanka
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
