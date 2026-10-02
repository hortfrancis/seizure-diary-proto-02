import OpenAI from "openai"
import { z } from "zod"
import { createDraftEvent } from "../src/lib/draft"
import type { ExtractedEvent, ProcessResponse } from "../src/types"
import { extractEvent } from "./extract"

// OpenAI's limit for audio uploads.
const MAX_AUDIO_BYTES = 25 * 1024 * 1024

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === "POST" && url.pathname === "/api/process") {
      return processRecording(request, env)
    }

    const recording = url.pathname.match(/^\/api\/recordings\/([\w-]+\.\w+)$/)
    if (request.method === "GET" && recording) {
      return getRecording(recording[1], env)
    }

    // Everything else (the front end) is served by the assets config in wrangler.jsonc.
    return new Response("Not found", { status: 404 })
  },
} satisfies ExportedHandler<Env>

// Saves the audio to R2, transcribes it, then has the LLM turn the
// transcript into a draft event.
async function processRecording(request: Request, env: Env): Promise<Response> {
  const form = await request.formData()
  const audio = form.get("audio")
  if (!(audio instanceof File) || audio.size === 0) {
    return new Response("Missing audio", { status: 400 })
  }
  // Local time with UTC offset, e.g. "2026-10-02T18:10:00+01:00".
  const recordedAtLocal = z.iso
    .datetime({ offset: true })
    .safeParse(form.get("recordedAt"))
  if (!recordedAtLocal.success) {
    return new Response("Missing or invalid recordedAt", { status: 400 })
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return new Response("Audio too large", { status: 413 })
  }

  const contentType = audio.type || "audio/webm"
  const recordingFilename = `${crypto.randomUUID()}.${fileExtension(contentType)}`
  const data = await audio.arrayBuffer()

  await env.RECORDINGS.put(recordingFilename, data, {
    httpMetadata: { contentType },
  })

  // If transcription or extraction fails we still return a draft, so the
  // patient can fill it in themselves.
  let transcript: string | undefined
  let extracted: ExtractedEvent | null = null
  try {
    // Inside the try: this throws if the API key isn't set.
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })
    const result = await openai.audio.transcriptions.create({
      model: "gpt-transcribe",
      // OpenAI works out the audio format from the file name.
      file: new File([data], recordingFilename, { type: contentType }),
    })
    transcript = result.text.trim()
    if (transcript) {
      extracted = await extractEvent(openai, transcript, recordedAtLocal.data)
    }
  } catch (err) {
    console.error("Transcription failed:", err)
  }

  const event = createDraftEvent({
    recordedAt: new Date(recordedAtLocal.data),
    transcript,
    recordingFilename,
    extracted: extracted ?? undefined,
  })
  return Response.json({ event } satisfies ProcessResponse)
}

async function getRecording(filename: string, env: Env): Promise<Response> {
  const object = await env.RECORDINGS.get(filename)
  if (!object) {
    return new Response("Not found", { status: 404 })
  }
  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
    },
  })
}

// Browsers record WebM (Chrome, Firefox) or MP4 (Safari).
function fileExtension(contentType: string): string {
  if (contentType.includes("mp4")) return "mp4"
  if (contentType.includes("ogg")) return "ogg"
  return "webm"
}
