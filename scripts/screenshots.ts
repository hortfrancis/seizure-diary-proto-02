// Takes a phone-sized screenshot of every screen, using example data.
//
//   npm run screenshots
//
// Starts its own dev server and drives the installed Google Chrome. The API
// is faked, so this never calls OpenAI and doesn't need an API key.
// Screenshots go in screenshots/ (gitignored).

import { mkdir, rm } from "node:fs/promises"
import { chromium, type Page } from "playwright-core"
import { createServer } from "vite"
import type { ProcessResponse } from "../src/types"

const OUT_DIR = "screenshots"
const PORT = 5299
const VIEWPORT = { width: 390, height: 844 } // a typical phone

// What the Worker would return for a typical recording.
const exampleResponse: ProcessResponse = {
  event: {
    patientId: "demo-patient",
    recordedAt: "2026-10-02T14:12:00.000Z",
    datetime: "2026-10-02T13:42:00.000Z",
    type: "seizure",
    notes:
      "My left arm was jerking and I couldn't speak for about a minute. I feel really tired now.",
    transcript:
      "I think I had a seizure about half an hour ago. My left arm was jerking and I couldn't speak for about a minute. I feel really tired now.",
    recordingFilename: "example.wav",
  },
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_DIR)

  const server = await createServer({
    server: { port: PORT, strictPort: true },
    logLevel: "warn",
  })
  await server.listen()
  const baseUrl = `http://localhost:${PORT}/`

  try {
    // Fake microphone that is always allowed.
    const browser = await chromium.launch({
      channel: "chrome",
      args: [
        "--use-fake-ui-for-media-stream",
        "--use-fake-device-for-media-stream",
      ],
    })

    // Happy path: home → recording → processing → review → saved.
    let page = await newPage(browser)
    let releaseProcessing = () => {}
    await page.route("**/api/process", async (route) => {
      // Hold the response so the Processing screen stays up for its screenshot.
      await new Promise<void>((resolve) => (releaseProcessing = resolve))
      await route.fulfill({ json: exampleResponse })
    })
    await page.goto(baseUrl)
    await shoot(page, "01-home", "Record an event")
    await page.getByText("Record an event").click()
    await shoot(page, "02-recording", "Recording…")
    await page.getByRole("button", { name: "Stop recording" }).click()
    await shoot(page, "03-processing", "Processing…")
    releaseProcessing()
    await shoot(page, "04-review", "Is this right?")
    await page.getByRole("button", { name: "Save" }).click()
    await shoot(page, "05-saved", "Event saved")
    await page.close()

    // The server fails, so the Review screen opens empty.
    page = await newPage(browser)
    await page.route("**/api/process", (route) => route.fulfill({ status: 500 }))
    await page.goto(baseUrl)
    await page.getByText("Record an event").click()
    await page.getByRole("button", { name: "Stop recording" }).click()
    await shoot(page, "06-review-no-transcript", "Is this right?")
    await browser.close()

    // The microphone is blocked.
    const blocked = await chromium.launch({
      channel: "chrome",
      args: ["--deny-permission-prompts"],
    })
    page = await newPage(blocked)
    await page.goto(baseUrl)
    await page.getByText("Record an event").click()
    await shoot(page, "07-microphone-blocked", "Can't use the microphone")
    await blocked.close()
  } finally {
    await server.close()
  }

  console.log(`Screenshots saved to ${OUT_DIR}/`)
}

async function newPage(browser: Awaited<ReturnType<typeof chromium.launch>>) {
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2 })
  // Serve a few seconds of silence as the recording, so the player has a length.
  await page.route("**/api/recordings/**", (route) =>
    route.fulfill({ contentType: "audio/wav", body: silentWav(6) }),
  )
  return page
}

// Waits for the screen to show `text`, then saves a full-page screenshot.
async function shoot(page: Page, name: string, text: string) {
  await page.getByText(text).first().waitFor()
  await page.mouse.move(0, 0) // no hover styles
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({
    path: `${OUT_DIR}/${name}.png`,
    fullPage: true,
    animations: "disabled",
  })
  console.log(`  ${name}.png`)
}

// A mono 8 kHz WAV file of silence.
function silentWav(seconds: number): Buffer {
  const sampleRate = 8000
  const dataSize = sampleRate * seconds * 2
  const wav = Buffer.alloc(44 + dataSize)
  wav.write("RIFF", 0)
  wav.writeUInt32LE(36 + dataSize, 4)
  wav.write("WAVEfmt ", 8)
  wav.writeUInt32LE(16, 16) // fmt chunk size
  wav.writeUInt16LE(1, 20) // PCM
  wav.writeUInt16LE(1, 22) // mono
  wav.writeUInt32LE(sampleRate, 24)
  wav.writeUInt32LE(sampleRate * 2, 28) // byte rate
  wav.writeUInt16LE(2, 32) // block align
  wav.writeUInt16LE(16, 34) // bits per sample
  wav.write("data", 36)
  wav.writeUInt32LE(dataSize, 40)
  return wav
}

await main()
