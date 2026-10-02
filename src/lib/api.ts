import { ProcessResponseSchema, type DraftEvent } from "@/types"
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

export function recordingUrl(filename: string): string {
  return `/api/recordings/${filename}`
}
