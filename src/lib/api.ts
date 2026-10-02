import type { ProcessResponse } from "@/types"

// Uploads the recording to be stored and transcribed. Returns null if the
// request fails, so the caller can carry on without a transcript.
export async function processRecording(
  audio: Blob,
): Promise<ProcessResponse | null> {
  try {
    const form = new FormData()
    form.append("audio", audio)
    const response = await fetch("/api/process", { method: "POST", body: form })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return (await response.json()) as ProcessResponse
  } catch (err) {
    console.error("Processing failed:", err)
    return null
  }
}

export function recordingUrl(filename: string): string {
  return `/api/recordings/${filename}`
}
