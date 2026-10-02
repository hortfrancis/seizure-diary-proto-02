import { useState } from "react"
import { CheckIcon, XIcon } from "lucide-react"
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
  onSave: (event: DraftEvent) => void
  onCancel: () => void
}

const eventTypes = EventTypeSchema.options

export function ReviewScreen({ event, onSave, onCancel }: Props) {
  const [type, setType] = useState(event.type)
  const [time, setTime] = useState(
    toDateTimeInputValue(new Date(event.datetime)),
  )
  const [notes, setNotes] = useState(event.notes)

  function save() {
    // A datetime-local value with no timezone is read as local time.
    onSave({
      ...event,
      type,
      datetime: new Date(time).toISOString(),
      notes: notes.trim(),
    })
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
        <audio
          controls
          src={recordingUrl(event.recordingFilename)}
          className="w-full"
        />
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Event</p>
        <div className="grid grid-cols-2 gap-2">
          {eventTypes.map((t) => (
            <Button
              key={t}
              variant={t === type ? "default" : "outline"}
              aria-pressed={t === type}
              className="h-16 rounded-2xl text-lg whitespace-normal"
              onClick={() => setType(t)}
            >
              {eventTypeLabels[t]}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="h-14 rounded-2xl text-lg md:text-lg"
        />
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
        <Button
          className="h-20 rounded-2xl text-xl"
          onClick={save}
          disabled={time === ""}
        >
          <CheckIcon className="size-7" />
          Save
        </Button>
        <Button
          variant="outline"
          className="h-16 rounded-2xl text-lg"
          onClick={onCancel}
        >
          <XIcon className="size-6" />
          Cancel
        </Button>
      </div>
    </div>
  )
}
