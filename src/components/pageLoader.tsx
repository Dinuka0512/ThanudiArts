export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="eyebrow">Thanudi Arts</span>
        <div className="h-px w-24 overflow-hidden bg-border">
          <div className="loader-line h-full w-1/2 bg-foreground" />
        </div>
      </div>
    </div>
  )
}
