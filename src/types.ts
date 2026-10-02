import { z } from "zod"

// No auth in the prototype, so every event belongs to this patient.
export const DEMO_PATIENT_ID = "demo-patient"

export const EventTypeSchema = z.enum(["seizure", "wake", "sleep", "other"])
export type EventType = z.infer<typeof EventTypeSchema>

export const eventTypeLabels: Record<EventType, string> = {
  seizure: "Possible seizure",
  wake: "Woke up",
  sleep: "Went to sleep",
  other: "Other",
}

// See "Data model" in docs/design.md.
export const DiaryEventSchema = z.object({
  id: z.uuid(),
  patientId: z.string(),
  datetime: z.iso.datetime(),
  type: EventTypeSchema,
  recordingFilename: z.string().optional(),
  transcript: z.string().optional(),
  notes: z.string(),
  recordedAt: z.iso.datetime(),
})
export type DiaryEvent = z.infer<typeof DiaryEventSchema>

// An event the patient hasn't saved yet, so it has no ID.
export const DraftEventSchema = DiaryEventSchema.omit({ id: true })
export type DraftEvent = z.infer<typeof DraftEventSchema>

// What the LLM works out from the transcript. The descriptions are sent to
// the model as part of the schema.
export const ExtractedEventSchema = z.object({
  type: EventTypeSchema.describe(
    "seizure: a possible seizure or seizure-like symptoms. wake: woke up. sleep: going or gone to sleep. other: anything else, or unclear.",
  ),
  datetime: z.iso
    .datetime({ offset: true })
    .describe(
      "When the event happened, as ISO 8601 with the same UTC offset as the recording time.",
    ),
  notes: z
    .string()
    .describe(
      'Any other useful details, briefly, in the first person. "" if there are none.',
    ),
})
export type ExtractedEvent = z.infer<typeof ExtractedEventSchema>

// What POST /api/process returns.
export const ProcessResponseSchema = z.object({ event: DraftEventSchema })
export type ProcessResponse = z.infer<typeof ProcessResponseSchema>
