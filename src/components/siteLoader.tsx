import { useEffect, useState } from "react"
import Logo from "@/assets/l1.png"

const WORD_1 = "THANUDI"
const WORD_2 = "ARTS"

export default function SiteLoader() {
  const [phase, setPhase] = useState<"enter" | "exit" | "done">("enter")

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const hold = reduced ? 400 : 2200
    const exitDuration = reduced ? 150 : 900

    const exitTimer = window.setTimeout(() => setPhase("exit"), hold)
    const doneTimer = window.setTimeout(() => {
      document.body.style.overflow = prevOverflow
      setPhase("done")
    }, hold + exitDuration)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(doneTimer)
      document.body.style.overflow = prevOverflow
    }
  }, [])

  if (phase === "done") return null

  const exiting = phase === "exit"

  return (
    <div
      className={`site-loader${exiting ? " is-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Thanudi Arts"
    >
      <div className="site-loader__curtain" />

      <div className="site-loader__content">
        <div className="site-loader__mark">
          <img src={Logo} alt="" className="site-loader__logo" />
        </div>

        <p className="site-loader__eyebrow">Contemporary Art Studio</p>

        <h1 className="site-loader__title" aria-label="Thanudi Arts">
          <span className="site-loader__word">{WORD_1}</span>
          <span className="site-loader__serif">{WORD_2}</span>
        </h1>

        <div className="site-loader__track" aria-hidden="true">
          <div className="site-loader__bar" />
        </div>
      </div>
    </div>
  )
}
