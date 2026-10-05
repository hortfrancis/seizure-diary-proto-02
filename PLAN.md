# Plan

Small steps. Each step should leave us with something that runs.

---

## Step 01: Scaffold the app and click through mocked screens

**Status:** ✅ Done (2 Oct 2026)

**Goal:** a running app where you can click through the whole "record an event" flow, using fake data. No real recording, AI or database yet.

### Do

1. Scaffold a Vite + React + TypeScript project, set up to run on Cloudflare Workers (using the Cloudflare Vite plugin).
2. Add Tailwind CSS and shadcn/ui (which uses Lucide icons).
3. Build five simple screens and move between them with plain React state (no router):
   - **Home:** one big "Record an event" button.
   - **Recording:** a "Recording…" indicator and a big "Stop" button.
   - **Processing:** a short fake delay with a spinner.
   - **Review:** a hard-coded example event (type, time, notes) with "Save" and "Cancel" buttons.
   - **Saved:** a confirmation, then back to Home.
4. Check it runs locally (`npm run dev`).

### Not yet

- Real microphone recording
- Speech-to-text or AI
- D1 database or API endpoints
- Event history, login and editing

### Done when

- `npm run dev` starts the app.
- On a phone-sized screen you can go Home → Recording → Processing → Review → Saved → Home.
- Buttons are big and obvious enough to use in a hurry.

---

## Step 02: Edit the event on the Review screen

**Status:** ✅ Done (2 Oct 2026)

**Goal:** the patient can correct the event before saving. The Review screen shows editable fields, pre-filled with the mocked "transcription" result.

### Do

1. Add shadcn's `input`, `textarea` and `label` components.
2. In `ReviewScreen`, replace the read-only fields with editable ones:
   - **Event:** four big tappable buttons (Possible seizure, Woke up, Went to sleep, Other), with the current one highlighted. Big buttons are easier than a dropdown to use in a hurry.
   - **Time:** a date and time input.
   - **Notes:** a multi-line text box.
3. Keep the edits in local state inside `ReviewScreen`, starting from the mocked event.
4. On **Save**, pass the edited event back up to `App`. **Cancel** still discards everything.
5. Show the saved event's details on the Saved screen, so we can see the edits came through.

### Not yet

- Saving anywhere (still no API or D1)
- Validation beyond the basics (e.g. a time is required)

### Done when

- The Review screen opens with the mocked event already filled in.
- Changing any field and pressing Save shows the changed values on the Saved screen.
- Everything is still easy to use on a phone-sized screen.

---

## Step 03: Record audio, store it and transcribe it

**Status:** ✅ Done (2 Oct 2026)

**Goal:** speak into the app and see what you said in the Notes field on the Review screen. The recording is kept in R2. Event type and time stay mocked for now.

### Do

1. Add the `openai` package.
2. Put the OpenAI API key in `.dev.vars` (gitignored) as `OPENAI_API_KEY`. Commit a `.dev.vars.example` with a blank value so others know it's needed.
3. Add `src/lib/recorder.ts`: a small wrapper around the browser's `MediaRecorder` that starts and stops recording and returns the audio.
4. **Recording screen:** ask for microphone access and start recording straight away. If access is denied, explain and offer a way back to Home.
5. **On Stop:** send the audio to a new Worker endpoint, `POST /api/process`, while the Processing screen shows.
6. **Worker:** save the audio to an R2 bucket, then transcribe it with OpenAI `gpt-transcribe`. Return `{ transcript, recordingFilename }`.
   - Add `GET /api/recordings/:filename`, so the app can play recordings back.
   - In local dev, R2 is simulated on disk, so no Cloudflare account is needed yet.
7. **Review screen:** put the transcript in Notes and add a small player for the recording. Type and time stay mocked.
8. **If transcription fails:** open the Review screen anyway with empty Notes and a short message, so the patient can type it instead.

### Not yet

- LLM extraction of event type and time (Step 04)
- Saving to D1
- Testing on a real phone. The microphone needs HTTPS, so for now we test on a laptop at `localhost`.

### Done when

- Recording a few sentences on a laptop puts an accurate transcript in Notes.
- The recording plays back on the Review screen.
- Denying microphone access, or a failed transcription, doesn't leave the patient stuck.
- The API key is never committed.

---

## Step 04: Turn the transcript into an event with an LLM

**Status:** ✅ Done (2 Oct 2026)

**Goal:** the Review screen opens with the event type, time and notes all filled in from what the patient said.

### Do

1. Add `zod`. Define the event schema once in `src/types.ts` and derive the `DiaryEvent` type from it.
2. **Worker:** after transcribing, send the transcript to OpenAI `gpt-6-luna` (Chat Completions, low reasoning effort), using structured output built from the Zod schema.
   - Include the recording time (with the phone's timezone offset), so it can work out phrases like "about 10 minutes ago".
3. Validate the LLM's reply with Zod. `/api/process` now returns `{ transcript, event }`.
4. **If the reply fails validation:** fall back to a draft with the recording time, type "Other" and the transcript as Notes.
5. **Review screen:** pre-fill all fields from the returned event. Remove `mockEvent.ts`.
6. Switch the code over to the data model in `docs/design.md`, including the renamed type values and the hard-coded `patientId`.

### Not yet

- Saving to D1
- Tuning the prompt beyond the basics

### Done when

- Saying "I woke up about ten minutes ago" gives type **Woke up** and a time about ten minutes before recording.
- Saying "I think I just had a seizure, my arm was jerking" gives type **Possible seizure**, with the details in Notes.
- A bad or empty reply still lands on a usable Review screen.

---

## Step 05: Deploy to Cloudflare Workers

**Status:** 🚧 Deployed to https://seizure-diary-proto-02.alex-hortfrancis.workers.dev (2 Oct 2026). Still to do: test on real phones.

**Goal:** the app runs at a public `*.workers.dev` URL, so we can try it on a real phone over HTTPS.

### Do

1. Create the real R2 bucket: `npx wrangler r2 bucket create seizure-diary-recordings`.
2. Store a separate, production OpenAI key as a Worker secret, `OPENAI_API_KEY`, in the Cloudflare dashboard. It's never committed or put in `wrangler.jsonc`.
3. Deploy: `npm run deploy`.
4. Try it on a phone:
   - iPhone Safari records MP4 rather than WebM, so check recording, transcription and playback all work there.
   - Also check an Android phone or Chrome, if one is to hand.
5. Add the live URL and the deploy commands to a short `README.md`.

### Things to know

- **Open to anyone with the URL.** There's no login, so anyone who finds the URL can use the app, which spends OpenAI credit (fractions of a penny per recording). That's fine for a demo, but set a monthly budget limit on the OpenAI project as a safety net.
- **Recordings** can be played by anyone with their link. The links use random IDs, so they can't be guessed, and there's no real patient data.

### Not yet

- D1 (events are still not saved anywhere)
- A custom domain
- Automatic deploys from GitHub

### Done when

- The `workers.dev` URL loads on a phone.
- Recording → Review (filled in by the LLM) → Save works on iPhone Safari, and on Android Chrome if available.

---

## Step 06: Save events to D1, and show them to the clinician

**Status:** ✅ Done and deployed (5 Oct 2026)

**Goal:** pressing Save stores the event, and a clinician can see every saved event. This answers "what does the output look like?".

### Do

1. Add a D1 database (binding `DB`) to `wrangler.jsonc`, with no `database_id`, so Wrangler creates it on the first deploy.
2. Add `migrations/0001_create_events.sql`: one `events` table, as in the data model in `docs/design.md`.
3. **Worker** (`worker/events.ts`):
   - `POST /api/events`: validate the draft with Zod, give it an ID and save it.
   - `GET /api/events`: the demo patient's events, oldest first, as JSON.
   - `GET /api/events.csv`: the same as a CSV download. Times are UTC, to line up with the EEG.
4. **Review screen:** Save now waits for the event to be stored. If that fails, say so and let the patient try again, keeping their edits.
5. **Clinician page** at `/clinician` (picked in `main.tsx`, still no router): a table of events with time, type, notes, what the patient said and a player for each recording, plus a "Download CSV" button.
6. Add a clinician page screenshot to `npm run screenshots`.

### Things to know

- **The clinician page is open to anyone with the URL**, like the rest of the app. That's fine with no real patient data, but a real version would need login.

### Not yet

- More than one patient, and login for patients or clinicians
- Editing or deleting saved events
- Filtering by date, or exporting in a format an EEG system can import
