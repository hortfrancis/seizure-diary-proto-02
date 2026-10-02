import OpenAI from "openai"
import type { ProcessResponse } from "../src/types"

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

// Saves the audio to R2, then transcribes it.
async function processRecording(request: Request, env: Env): Promise<Response> {
  const form = await request.formData()
  const audio = form.get("audio")
  if (!(audio instanceof File) || audio.size === 0) {
    return new Response("Missing audio", { status: 400 })
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

  // If transcription fails we still return the saved recording, so the
  // patient can type the notes themselves.
  let transcript: string | null = null
  try {
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })
    const result = await openai.audio.transcriptions.create({
      model: "gpt-transcribe",
      // OpenAI works out the audio format from the file name.
      file: new File([data], recordingFilename, { type: contentType }),
    })
    transcript = result.text.trim()
  } catch (err) {
    console.error("Transcription failed:", err)
  }

  return Response.json({ transcript, recordingFilename } satisfies ProcessResponse)
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
