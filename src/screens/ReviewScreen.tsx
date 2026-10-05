import { useState } from "react"
import { CheckIcon, LoaderCircleIcon, XIcon } from "lucide-react"
import { EventTypeIcon } from "@/components/EventTypeIcon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { recordingUrl } from "@/lib/api"
import { toDateTimeInputValue } from "@/lib/format"
import {
  EventTypeSchema,
  eventTypeLabels,
  type DraftEvent,
} from "@/types"

type Props = {
  event: DraftEvent
  onSave: (event: DraftEvent) => Promise<void>
  onCancel: () => void
}

const eventTypes = EventTypeSchema.options

// The event counts as happening "now" if it's within a minute of recording.
function isNow(event: DraftEvent): boolean {
  const diff = Date.parse(event.datetime) - Date.parse(event.recordedAt)
  return Math.abs(diff) <= 60_000
}

export function ReviewScreen({ event, onSave, onCancel }: Props) {
  const [type, setType] = useState(event.type)
  // Shows "Now" until the patient chooses to change the time.
  const [editingTime, setEditingTime] = useState(!isNow(event))
  const [time, setTime] = useState(
    toDateTimeInputValue(new Date(event.datetime)),
  )
  const [notes, setNotes] = useState(event.notes)
  const [saving, setSaving] = useState(false)
  const [saveFailed, setSaveFailed] = useState(false)

  async function save() {
    setSaving(true)
    setSaveFailed(false)
    try {
      await onSave({
        ...event,
        type,
        // A datetime-local value with no timezone is read as local time.
        datetime: editingTime ? new Date(time).toISOString() : event.datetime,
        notes: notes.trim(),
      })
    } catch (err) {
      console.error("Saving failed:", err)
      setSaveFailed(true)
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-2xl font-semibold">Is this right?</h1>

      {event.transcript === undefined && (
        <p className="rounded-2xl bg-muted p-4 text-lg">
          We couldn't turn your recording into text. Please type what happened
          in Notes.
        </p>
      )}

      {event.recordingFilename && (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Your recording</p>
          <audio
            controls
            src={recordingUrl(event.recordingFilename)}
            className="h-10 w-full"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">What happened?</p>
        <div className="grid grid-cols-2 gap-2">
          {eventTypes.map((t) => (
            <Button
              key={t}
              variant={t === type ? "default" : "outline"}
              aria-pressed={t === type}
              className="h-20 flex-col gap-1 rounded-2xl text-lg whitespace-normal"
              onClick={() => setType(t)}
            >
              <EventTypeIcon type={t} className="size-6" />
              {eventTypeLabels[t]}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="time">Time</Label>
        {editingTime ? (
          <Input
            id="time"
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-14 rounded-2xl text-lg md:text-lg"
          />
        ) : (
          <div className="flex h-14 items-center justify-between rounded-2xl border pr-2 pl-4 text-lg">
            <span>Now</span>
            <Button
              variant="ghost"
              aria-label="Change time"
              className="h-10 rounded-xl text-base"
              onClick={() => setEditingTime(true)}
            >
              Change
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-28 rounded-2xl text-lg md:text-lg"
        />
      </div>

      <div className="mt-auto flex flex-col gap-3">
        {saveFailed && (
          <p role="alert" className="rounded-2xl bg-red-100 p-4 text-lg text-red-900">
            We couldn't save this event. Please try again.
          </p>
        )}
        <Button
          className="h-20 rounded-2xl text-xl"
          onClick={save}
          disabled={saving || (editingTime && time === "")}
        >
          {saving ? (
            <LoaderCircleIcon className="size-7 animate-spin" />
          ) : (
            <CheckIcon className="size-7" />
          )}
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button
          variant="outline"
          className="h-16 rounded-2xl text-lg"
          onClick={onCancel}
          disabled={saving}
        >
          <XIcon className="size-6" />
          Cancel
        </Button>
      </div>
    </div>
  )
}
