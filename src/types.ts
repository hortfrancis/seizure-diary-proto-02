export type EventType = "seizure" | "woke-up" | "went-to-sleep" | "other"

export type DiaryEvent = {
  type: EventType
  time: Date
  notes: string
}

export const eventTypeLabels: Record<EventType, string> = {
  seizure: "Possible seizure",
  "woke-up": "Woke up",
  "went-to-sleep": "Went to sleep",
  other: "Other",
}
