# Seizure Diary (prototype)

A proof-of-concept from an NHS hackathon. Patients wearing a take-home EEG headset can record events (possible seizures, waking up, going to sleep) by voice instead of on a paper form. The app transcribes the recording, uses an LLM to fill in the event details, and lets the patient check and correct them before saving.

**Live demo:** https://seizure-diary-proto-02.alex-hortfrancis.workers.dev

> This is a prototype for demonstration only. It is not a medical device, and must not be used with real patient data.

## Stack

React, TypeScript, Vite, Tailwind CSS and shadcn/ui, on Cloudflare Workers with R2 for audio storage. Speech-to-text and event extraction use OpenAI (`gpt-transcribe` and `gpt-6-luna`), with Zod for validation.

See [`PLAN.md`](PLAN.md) for the step-by-step plan, and [`docs/`](docs/) for the system diagram, design and data model.

## Running locally

```sh
npm install
cp .dev.vars.example .dev.vars   # then add your OpenAI API key
npm run dev
```

R2 is simulated locally, so no Cloudflare account is needed to run it.

## Deploying

Needs a Cloudflare account with R2 enabled.

```sh
npx wrangler r2 bucket create seizure-diary-recordings   # first time only
npm run deploy
```

Then add `OPENAI_API_KEY` as a secret, either in the Cloudflare dashboard (Worker → Settings → Variables and Secrets) or with `npx wrangler secret put OPENAI_API_KEY`.
