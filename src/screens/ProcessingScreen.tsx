import { LoaderCircleIcon } from "lucide-react"

export function ProcessingScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <LoaderCircleIcon className="size-16 animate-spin text-muted-foreground" />
      <p className="text-2xl font-semibold">Processing…</p>
    </div>
  )
}
