export type EventType = "seizure" | "woke-up" | "went-to-sleep" | "other"

export type DiaryEvent = {
  type: EventType
  time: Date
  notes: string
  transcript?: string
  recordingFilename?: string
}

export const eventTypeLabels: Record<EventType, string> = {
  seizure: "Possible seizure",
  "woke-up": "Woke up",
  "went-to-sleep": "Went to sleep",
  other: "Other",
}

// What POST /api/process returns. `transcript` is null if transcription failed.
export type ProcessResponse = {
  transcript: string | null
  recordingFilename: string
}
