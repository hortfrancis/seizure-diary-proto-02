import { useState } from "react"
import type { DiaryEvent } from "@/types"
import { createMockEvent } from "@/lib/mockEvent"
import { HomeScreen } from "@/screens/HomeScreen"
import { RecordingScreen } from "@/screens/RecordingScreen"
import { ProcessingScreen } from "@/screens/ProcessingScreen"
import { ReviewScreen } from "@/screens/ReviewScreen"
import { SavedScreen } from "@/screens/SavedScreen"

type Screen = "home" | "recording" | "processing" | "review" | "saved"

export default function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [event, setEvent] = useState<DiaryEvent | null>(null)

  function finishProcessing() {
    setEvent(createMockEvent())
    setScreen("review")
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
        <RecordingScreen onStop={() => setScreen("processing")} />
      )}
      {screen === "processing" && (
        <ProcessingScreen onDone={finishProcessing} />
      )}
      {screen === "review" && event && (
        <ReviewScreen
          event={event}
          onSave={() => setScreen("saved")}
          onCancel={goHome}
        />
      )}
      {screen === "saved" && <SavedScreen onDone={goHome} />}
    </main>
  )
}
