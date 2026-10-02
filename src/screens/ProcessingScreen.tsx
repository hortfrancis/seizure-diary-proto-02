import { useEffect } from "react"
import { LoaderCircleIcon } from "lucide-react"

type Props = {
  onDone: () => void
}

export function ProcessingScreen({ onDone }: Props) {
  // Fake delay, standing in for speech-to-text.
  useEffect(() => {
    const timer = setTimeout(onDone, 2000)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <LoaderCircleIcon className="size-16 animate-spin text-muted-foreground" />
      <p className="text-2xl font-semibold">Processing…</p>
    </div>
  )
}
