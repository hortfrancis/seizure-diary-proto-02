import { useState } from "react"
import type { DraftEvent } from "@/types"
import { processRecording, saveEvent } from "@/lib/api"
import { HomeScreen } from "@/screens/HomeScreen"
import { RecordingScreen } from "@/screens/RecordingScreen"
import { ProcessingScreen } from "@/screens/ProcessingScreen"
import { ReviewScreen } from "@/screens/ReviewScreen"
import { SavedScreen } from "@/screens/SavedScreen"

type Screen = "home" | "recording" | "processing" | "review" | "saved"

export default function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [event, setEvent] = useState<DraftEvent | null>(null)

  async function finishRecording(audio: Blob) {
    const recordedAt = new Date()
    setScreen("processing")
    setEvent(await processRecording(audio, recordedAt))
    setScreen("review")
  }

  // Throws if saving fails, so the Review screen can say so and let the
  // patient try again.
  async function confirmEvent(edited: DraftEvent) {
    await saveEvent(edited)
    setEvent(edited)
    setScreen("saved")
  }

  function goHome() {
    setEvent(null)
    setScreen("home")
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col p-6">
      {screen === "home" && (
        <HomeScreen onRecord={() => setScreen("recording")} />
      )}
      {screen === "recording" && (
        <RecordingScreen onStop={finishRecording} onCancel={goHome} />
      )}
      {screen === "processing" && <ProcessingScreen />}
      {screen === "review" && event && (
        <ReviewScreen event={event} onSave={confirmEvent} onCancel={goHome} />
      )}
      {screen === "saved" && event && (
        <SavedScreen event={event} onDone={goHome} />
      )}
    </main>
  )
}
