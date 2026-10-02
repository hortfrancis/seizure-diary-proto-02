import { LoaderCircleIcon } from "lucide-react"

export function ProcessingScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <LoaderCircleIcon className="size-16 animate-spin text-muted-foreground" />
      <div className="text-center">
        <p className="text-2xl font-semibold">Processing…</p>
        <p className="mt-2 text-lg text-muted-foreground">
          We are transcribing what you said.
        </p>
      </div>
    </div>
  )
}
