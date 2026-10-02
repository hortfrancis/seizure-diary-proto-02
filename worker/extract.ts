import type OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { ExtractedEventSchema, type ExtractedEvent } from "../src/types"

const instructions = `You turn a patient's spoken seizure-diary entry into a structured event.
The patient wears an EEG headset at home and records events by voice, sometimes during or just after a seizure, so speech may be unclear.

- type: pick the best match. Use "seizure" for any possible seizure or seizure-like symptoms (e.g. jerking, staring spells, losing awareness, an aura). Use "other" if nothing fits or it's unclear.
- datetime: work out when the event happened from the recording time, e.g. "ten minutes ago" or "at 7 this morning". If no time is mentioned, use the recording time exactly.
- notes: keep useful details such as symptoms, how long it lasted, triggers and how they feel now. Don't repeat the event type or time. Keep the patient's meaning; don't add anything they didn't say.`

// Returns null if the LLM call fails or its reply doesn't match the schema.
export async function extractEvent(
  openai: OpenAI,
  transcript: string,
  recordedAtLocal: string,
): Promise<ExtractedEvent | null> {
  try {
    const completion = await openai.chat.completions.parse({
      model: "gpt-6-luna",
      reasoning_effort: "low",
      messages: [
        { role: "system", content: instructions },
        {
          role: "user",
          content: `Recording time: ${recordedAtLocal}\n\nTranscript:\n${transcript}`,
        },
      ],
      response_format: zodResponseFormat(ExtractedEventSchema, "event"),
    })
    const parsed = completion.choices[0]?.message.parsed
    // parse() already checks the schema; this guards against refusals and
    // anything that slips through.
    return ExtractedEventSchema.parse(parsed)
  } catch (err) {
    console.error("Extraction failed:", err)
    return null
  }
}
