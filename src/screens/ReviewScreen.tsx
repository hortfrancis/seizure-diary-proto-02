import { CheckIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { eventTypeLabels, type DiaryEvent } from "@/types"

type Props = {
  event: DiaryEvent
  onSave: () => void
  onCancel: () => void
}

export function ReviewScreen({ event, onSave, onCancel }: Props) {
  const time = event.time.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-2xl font-semibold">Is this right?</h1>

      <Card>
        <CardContent className="flex flex-col gap-5 text-lg">
          <Field label="Event" value={eventTypeLabels[event.type]} />
          <Field label="Time" value={time} />
          <Field label="Notes" value={event.notes} />
        </CardContent>
      </Card>

      <div className="mt-auto flex flex-col gap-3">
        <Button className="h-20 rounded-2xl text-xl" onClick={onSave}>
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
