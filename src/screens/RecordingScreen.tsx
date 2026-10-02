import { SquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  onStop: () => void
}

export function RecordingScreen({ onStop }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10">
      <div className="flex items-center gap-3 text-2xl font-semibold">
        <span className="size-4 animate-pulse rounded-full bg-red-600" />
        Recording…
      </div>
      <p className="text-center text-lg text-muted-foreground">
        Say what happened, and roughly when.
      </p>
      <Button
        variant="destructive"
        className="h-48 w-full flex-col gap-4 rounded-3xl text-2xl"
        onClick={onStop}
      >
        <SquareIcon className="size-12" />
        Stop recording
      </Button>
    </div>
  )
}
