export type Recorder = {
  // Stops recording and returns the audio.
  stop: () => Promise<Blob>
  // Stops recording and throws the audio away.
  cancel: () => void
}

// Formats OpenAI accepts, in order of preference. Chrome and Firefox
// support WebM; Safari only supports MP4.
const preferredTypes = ["audio/webm", "audio/mp4"]

// Asks for the microphone and starts recording. Throws if access is denied.
export async function startRecording(): Promise<Recorder> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const mimeType = preferredTypes.find((t) => MediaRecorder.isTypeSupported(t))
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
  const chunks: Blob[] = []

  recorder.addEventListener("dataavailable", (e) => chunks.push(e.data))
  recorder.start()

  function release() {
    stream.getTracks().forEach((track) => track.stop())
  }

  return {
    stop: () =>
      new Promise((resolve) => {
        recorder.addEventListener("stop", () => {
          release()
          resolve(new Blob(chunks, { type: recorder.mimeType }))
        })
        recorder.stop()
      }),
    cancel: () => {
      if (recorder.state !== "inactive") recorder.stop()
      release()
    },
  }
}
