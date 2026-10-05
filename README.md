# Seizure Diary (prototype)

<img width="1448" height="1086" alt="image" src="https://github.com/user-attachments/assets/722c9cf1-dbdd-4245-96c5-88765c3662ed" />

A proof-of-concept from an NHS hackathon. Patients wearing a take-home EEG headset can record events (possible seizures, waking up, going to sleep) by voice instead of on a paper form. The app transcribes the recording, uses an LLM to fill in the event details, and lets the patient check and correct them before saving.

Saved events are listed for the clinician at `/clinician`, with playback of each recording and a CSV download (one row per event, times in UTC) to read alongside the EEG.

**Live demo:** https://seizure-diary-proto-02.alex-hortfrancis.workers.dev (clinician view: [`/clinician`](https://seizure-diary-proto-02.alex-hortfrancis.workers.dev/clinician))

> This is a prototype for demonstration only. It is not a medical device, and must not be used with real patient data.

## Stack

React, TypeScript, Vite, Tailwind CSS and shadcn/ui, on Cloudflare Workers, with D1 for events and R2 for audio storage. Speech-to-text and event extraction use OpenAI (`gpt-transcribe` and `gpt-6-luna`), with Zod for validation.

See [`PLAN.md`](PLAN.md) for the step-by-step plan, and [`docs/`](docs/) for the system diagram, design and data model.

## Running locally

```sh
npm install
cp .dev.vars.example .dev.vars   # then add your OpenAI API key
npm run db:migrate               # creates the local database's tables
npm run dev
```

D1 and R2 are simulated locally, so no Cloudflare account is needed to run it. The patient app is at `/`, and the clinician view at `/clinician`.

## Screenshots

```sh
npm run screenshots
```

Saves a phone-sized screenshot of every screen to a new timestamped folder in `screenshots/` (e.g. `screenshots/2026-10-02_18-56-32/`), using example data. It needs Google Chrome installed, but no API key, and it never calls OpenAI.

## Deploying

Needs a Cloudflare account with R2 enabled.

```sh
npx wrangler r2 bucket create seizure-diary-recordings   # first time only
npm run deploy               # creates the D1 database on the first deploy
npm run db:migrate:remote    # first time, and after adding a migration
```

Then add `OPENAI_API_KEY` as a secret, either in the Cloudflare dashboard (Worker → Settings → Variables and Secrets) or with `npx wrangler secret put OPENAI_API_KEY`.
