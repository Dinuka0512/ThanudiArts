import { cn } from "@/lib/utils"
import LogoLight from "@/assets/l1.png"

export default function ThemeLogo({ className }: { className?: string }) {
  return <img src={LogoLight} alt="Thanudi Arts" className={cn(className)} />
}
