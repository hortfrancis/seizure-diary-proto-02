import {
  DEMO_PATIENT_ID,
  type DraftEvent,
  type ExtractedEvent,
} from "@/types"

type DraftInput = {
  recordedAt: Date
  transcript?: string
  recordingFilename?: string
  extracted?: ExtractedEvent
}

// Builds the draft event shown on the Review screen. Anything the LLM didn't
// work out falls back to sensible defaults, so the patient can always edit
// and save something.
export function createDraftEvent({
  recordedAt,
  transcript,
  recordingFilename,
  extracted,
}: DraftInput): DraftEvent {
  return {
    patientId: DEMO_PATIENT_ID,
    recordedAt: recordedAt.toISOString(),
    datetime: extracted
      ? new Date(extracted.datetime).toISOString()
      : recordedAt.toISOString(),
    type: extracted?.type ?? "other",
    notes: extracted?.notes ?? transcript ?? "",
    transcript,
    recordingFilename,
  }
}
