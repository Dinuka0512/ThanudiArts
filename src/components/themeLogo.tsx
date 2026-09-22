import { cn } from "@/lib/utils"
import LogoLight from "@/assets/l1.png"
import LogoDark from "@/assets/l2.png"

export default function ThemeLogo({ className }: { className?: string }) {
  return (
    <>
      <img src={LogoLight} alt="Thanudi Arts" className={cn("block dark:hidden", className)} />
      <img src={LogoDark} alt="Thanudi Arts" className={cn("hidden dark:block", className)} />
    </>
  )
}