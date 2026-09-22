import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
  className?: string
  children?: ReactNode
  delay?: number
}

export default function Reveal({ className, children }: RevealProps) {
  return <div className={cn(className)}>{children}</div>
}