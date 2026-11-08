import { NavLink } from "react-router-dom"
import { ArrowUpRight, Mail, MapPin } from "lucide-react"
import { START_PROJECT_MESSAGE, whatsappLink } from "@/lib/whatsapp"

const QUICK_LINKS = [
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid gap-12 border-b border-background/15 py-14 md:grid-cols-12 md:gap-6 md:py-20">
          <div className="md:col-span-6">
            <p className="eyebrow text-background/50">Commissions open</p>
            <p className="mt-5 max-w-lg text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-6xl">
              Have a story
              <br />
              <span className="editorial text-background/90">worth painting?</span>
            </p>
            <a
              href={whatsappLink(START_PROJECT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line mt-8 inline-flex text-[10px] font-medium uppercase tracking-[0.2em] text-background/70 transition-colors hover:text-brand"
            >
              Start a project
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          <div className="md:col-span-3">
            <h4 className="eyebrow text-background/50">Explore</h4>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-background/75 transition-colors hover:text-background"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="eyebrow text-background/50">Contact</h4>
            <ul className="mt-5 space-y-3 text-sm text-background/75">
              <li>
                <a
                  href="mailto:thanudiarts@gmail.com"
                  className="flex items-center gap-2.5 transition-colors hover:text-background"
                >
                  <Mail className="size-4 shrink-0 text-background/50" />
                  thanudiarts@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0 text-background/50" />
                Sri Lanka
              </li>
            </ul>
            <p className="mt-8 max-w-[14rem] text-xs leading-relaxed text-background/50">
              Original artworks, limited pieces and bespoke commissions, made with care.
            </p>
          </div>
        </div>

        <p className="brand-wordmark select-none pt-10 text-[clamp(2.6rem,10vw,9rem)] leading-[0.85] tracking-[0.01em] text-brand">
          Thanudi Arts
        </p>

        <div className="flex flex-col gap-3 border-t border-background/15 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="eyebrow text-background/50">
            © {new Date().getFullYear()} Thanudi Arts. All rights reserved.{" "}
            <span className="text-background/40">Developed by </span>
            <a
              href="https://dinukadev.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/55 transition-colors hover:text-background"
            >
              Dinuka Dev
            </a>
          </p>
          <p className="eyebrow hidden text-background/50 md:block">Crafted with care in Sri Lanka</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="eyebrow text-left text-background/50 transition-colors hover:text-background"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
