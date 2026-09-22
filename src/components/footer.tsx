import { NavLink } from "react-router-dom"
import { Mail, MapPin } from "lucide-react"
import ThemeLogo from "@/components/themeLogo"

const QUICK_LINKS = [
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <ThemeLogo className="h-12 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Hand-drawn and digital artworks crafted with passion, precision and a
              personal touch.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                thanudiarts@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                Sri Lanka
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Thanudi Arts. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Crafted with care &amp; creativity in Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  )
}