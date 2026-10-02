import type { DiaryEvent } from "@/types"

// Stands in for the speech-to-text result until we have a real one.
export function createMockEvent(): DiaryEvent {
  return {
    type: "seizure",
    time: new Date(),
    notes:
      "Felt dizzy and my left hand started shaking. Lasted about a minute.",
  }
}
