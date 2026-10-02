import { useEffect, useRef, useState } from "react"
import { MicOffIcon, SquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { startRecording, type Recorder } from "@/lib/recorder"

type Props = {
  onStop: (audio: Blob) => void
  onCancel: () => void
}

type Status = "starting" | "recording" | "denied"

export function RecordingScreen({ onStop, onCancel }: Props) {
  const [status, setStatus] = useState<Status>("starting")
  const recorder = useRef<Recorder | null>(null)

  // Start recording as soon as the screen opens.
  useEffect(() => {
    let cancelled = false
    startRecording()
      .then((r) => {
        if (cancelled) return r.cancel()
        recorder.current = r
        setStatus("recording")
      })
      .catch((err) => {
        console.error("Microphone unavailable:", err)
        if (!cancelled) setStatus("denied")
      })
    return () => {
      cancelled = true
      recorder.current?.cancel()
    }
  }, [])

  async function stop() {
    const r = recorder.current
    if (!r) return
    recorder.current = null
    onStop(await r.stop())
  }

  if (status === "denied") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <MicOffIcon className="size-16 text-muted-foreground" />
        <p className="text-2xl font-semibold">Can't use the microphone</p>
        <p className="text-lg text-muted-foreground">
          Please allow microphone access in your browser, then try again.
        </p>
        <Button
          variant="outline"
          className="mt-6 h-20 w-full rounded-2xl text-xl"
          onClick={onCancel}
        >
          Back
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10">
      <div className="flex items-center gap-3 text-2xl font-semibold">
        <span className="size-4 animate-pulse rounded-full bg-red-600" />
        {status === "recording" ? "Recording…" : "Starting…"}
      </div>
      <p className="text-center text-lg text-muted-foreground">
        Say what happened, and roughly when.
      </p>
      <Button
        variant="destructive"
        className="h-48 w-full flex-col gap-4 rounded-3xl text-2xl"
        onClick={stop}
        disabled={status !== "recording"}
      >
        <SquareIcon className="size-12" />
        Stop recording
      </Button>
    </div>
  )
}
