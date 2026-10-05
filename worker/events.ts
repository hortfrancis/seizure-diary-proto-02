import {
  DEMO_PATIENT_ID,
  DiaryEventSchema,
  DraftEventSchema,
  eventTypeLabels,
  type DiaryEvent,
  type EventType,
} from "../src/types"

// A row in the D1 events table (see migrations/).
type EventRow = {
  id: string
  patient_id: string
  datetime: string
  type: EventType
  recording_filename: string | null
  transcript: string | null
  notes: string
  recorded_at: string
}

// Saves an event the patient has confirmed, and returns it with its new ID.
export async function saveEvent(request: Request, env: Env): Promise<Response> {
  const draft = DraftEventSchema.safeParse(await request.json().catch(() => null))
  if (!draft.success) {
    return new Response("Invalid event", { status: 400 })
  }
  const event: DiaryEvent = { id: crypto.randomUUID(), ...draft.data }

  await env.DB.prepare(
    `INSERT INTO events
       (id, patient_id, datetime, type, recording_filename, transcript, notes, recorded_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      event.id,
      event.patientId,
      event.datetime,
      event.type,
      event.recordingFilename ?? null,
      event.transcript ?? null,
      event.notes,
      event.recordedAt,
    )
    .run()

  return Response.json({ event }, { status: 201 })
}

// The demo patient's events, oldest first, as JSON or CSV.
export async function listEvents(env: Env, format: "json" | "csv"): Promise<Response> {
  const { results } = await env.DB.prepare(
    "SELECT * FROM events WHERE patient_id = ? ORDER BY datetime",
  )
    .bind(DEMO_PATIENT_ID)
    .all<EventRow>()
  const events = results.map(fromRow)

  if (format === "csv") {
    return new Response(toCsv(events), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="seizure-diary-${DEMO_PATIENT_ID}.csv"`,
      },
    })
  }
  return Response.json({ events })
}

function fromRow(row: EventRow): DiaryEvent {
  return DiaryEventSchema.parse({
    id: row.id,
    patientId: row.patient_id,
    datetime: row.datetime,
    type: row.type,
    recordingFilename: row.recording_filename ?? undefined,
    transcript: row.transcript ?? undefined,
    notes: row.notes,
    recordedAt: row.recorded_at,
  })
}

// One row per event. Times are UTC, to line up with the EEG.
function toCsv(events: DiaryEvent[]): string {
  const header = [
    "datetime_utc",
    "event",
    "notes",
    "transcript",
    "recorded_at_utc",
    "recording_filename",
    "event_id",
    "patient_id",
  ]
  const rows = events.map((e) => [
    e.datetime,
    eventTypeLabels[e.type],
    e.notes,
    e.transcript ?? "",
    e.recordedAt,
    e.recordingFilename ?? "",
    e.id,
    e.patientId,
  ])
  return [header, ...rows].map((row) => row.map(csvField).join(",")).join("\r\n") + "\r\n"
}

function csvField(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
}
