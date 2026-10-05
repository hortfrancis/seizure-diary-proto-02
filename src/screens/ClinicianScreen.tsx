import { useEffect, useState } from "react"
import {
  DownloadIcon,
  LoaderCircleIcon,
  MicIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { EventTypeIcon } from "@/components/EventTypeIcon"
import { Button } from "@/components/ui/button"
import { eventsCsvUrl, listEvents, recordingUrl } from "@/lib/api"
import { formatEventTime } from "@/lib/format"
import { DEMO_PATIENT_ID, eventTypeLabels, type DiaryEvent } from "@/types"

// What a clinician sees: every saved event, oldest first, to read alongside
// the EEG. Open at /clinician. There's no login in the prototype.
export function ClinicianScreen() {
  const [events, setEvents] = useState<DiaryEvent[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    listEvents()
      .then(setEvents)
      .catch((err) => {
        console.error("Loading events failed:", err)
        setFailed(true)
      })
  }, [])

  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-6 p-4 sm:p-6">
      <p className="flex items-center gap-2 rounded-2xl bg-amber-100 p-4 font-medium text-amber-900">
        <TriangleAlertIcon className="size-5 shrink-0" />
        Prototype only: do not use real patient data!
      </p>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Seizure Diary events</h1>
          <p className="text-muted-foreground">Patient: {DEMO_PATIENT_ID}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="h-11 rounded-xl">
            <a href="/">
              <MicIcon />
              Patient app
            </a>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl">
            <a href={eventsCsvUrl} download>
              <DownloadIcon />
              Download CSV
            </a>
          </Button>
        </div>
      </div>

      {failed && (
        <p role="alert" className="rounded-2xl bg-red-100 p-4 text-red-900">
          Couldn't load events. Please refresh the page.
        </p>
      )}
      {!events && !failed && (
        <LoaderCircleIcon className="size-8 animate-spin self-center text-muted-foreground" />
      )}
      {events?.length === 0 && (
        <p className="rounded-2xl bg-muted p-4">No events saved yet.</p>
      )}
      {events && events.length > 0 && <EventsTable events={events} />}
    </main>
  )
}

function EventsTable({ events }: { events: DiaryEvent[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="w-full min-w-3xl text-left text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="p-3 font-medium">When</th>
            <th className="p-3 font-medium">Event</th>
            <th className="p-3 font-medium">Notes</th>
            <th className="p-3 font-medium">Recording</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t align-top">
              <td className="p-3 whitespace-nowrap">
                <p className="font-medium">{formatEventTime(new Date(event.datetime))}</p>
                {event.recordedAt !== event.datetime && (
                  <p className="text-muted-foreground">
                    Logged {formatEventTime(new Date(event.recordedAt))}
                  </p>
                )}
              </td>
              <td className="p-3 whitespace-nowrap">
                <span className="flex items-center gap-2 font-medium">
                  <EventTypeIcon type={event.type} className="size-4" />
                  {eventTypeLabels[event.type]}
                </span>
              </td>
              <td className="p-3">
                <p>{event.notes || <span className="text-muted-foreground">None</span>}</p>
                {event.transcript && event.transcript !== event.notes && (
                  <details className="mt-2 text-muted-foreground">
                    <summary className="cursor-pointer">What they said</summary>
                    <p className="mt-1 italic">“{event.transcript}”</p>
                  </details>
                )}
              </td>
              <td className="p-3">
                {event.recordingFilename ? (
                  <audio
                    controls
                    preload="none"
                    src={recordingUrl(event.recordingFilename)}
                    className="h-10 w-56"
                  />
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
