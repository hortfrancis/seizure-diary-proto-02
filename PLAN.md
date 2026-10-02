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
