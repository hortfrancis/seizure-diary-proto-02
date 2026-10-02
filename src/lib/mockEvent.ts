import type { DiaryEvent } from "@/types"

// Builds the draft event from the transcript. Type and time are still
// placeholders until the LLM step works them out.
export function createMockEvent(
  transcript: string | null,
  recordingFilename?: string,
): DiaryEvent {
  return {
    type: "other",
    time: new Date(),
    notes: transcript ?? "",
    transcript: transcript ?? undefined,
    recordingFilename,
  }
}
