import {
  EventsResponseSchema,
  ProcessResponseSchema,
  SaveEventResponseSchema,
  type DiaryEvent,
  type DraftEvent,
} from "@/types"
import { createDraftEvent } from "@/lib/draft"
import { toLocalISOString } from "@/lib/format"

// Uploads the recording to be stored, transcribed and turned into a draft
// event. If anything goes wrong, returns an empty draft so the patient can
// fill it in themselves.
export async function processRecording(
  audio: Blob,
  recordedAt: Date,
): Promise<DraftEvent> {
  try {
    const form = new FormData()
    form.append("audio", audio)
    form.append("recordedAt", toLocalISOString(recordedAt))
    const response = await fetch("/api/process", { method: "POST", body: form })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return ProcessResponseSchema.parse(await response.json()).event
  } catch (err) {
    console.error("Processing failed:", err)
    return createDraftEvent({ recordedAt })
  }
}

// Saves an event the patient has confirmed. Throws if it couldn't be saved.
export async function saveEvent(event: DraftEvent): Promise<DiaryEvent> {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return SaveEventResponseSchema.parse(await response.json()).event
}

// All saved events, oldest first.
export async function listEvents(): Promise<DiaryEvent[]> {
  const response = await fetch("/api/events")
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return EventsResponseSchema.parse(await response.json()).events
}

export const eventsCsvUrl = "/api/events.csv"

export function recordingUrl(filename: string): string {
  return `/api/recordings/${filename}`
}
