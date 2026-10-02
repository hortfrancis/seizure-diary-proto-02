import { CircleCheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatEventTime } from "@/lib/format"
import { eventTypeLabels, type DiaryEvent } from "@/types"

type Props = {
  event: DiaryEvent
  onDone: () => void
}

export function SavedScreen({ event, onDone }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <CircleCheckIcon className="size-20 text-green-600" />
      <p className="text-2xl font-semibold">Event saved</p>

      <Card className="w-full">
        <CardContent className="flex flex-col gap-4 text-lg">
          <Field label="Event" value={eventTypeLabels[event.type]} />
          <Field label="Time" value={formatEventTime(event.time)} />
          {event.notes && <Field label="Notes" value={event.notes} />}
        </CardContent>
      </Card>

      <Button className="mt-6 h-20 w-full rounded-2xl text-xl" onClick={onDone}>
        Done
      </Button>
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
