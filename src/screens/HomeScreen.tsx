import { ClipboardListIcon, MicIcon, TriangleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  onRecord: () => void
}

export function HomeScreen({ onRecord }: Props) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <p className="flex items-center gap-2 rounded-2xl bg-amber-100 p-4 font-medium text-amber-900">
        <TriangleAlertIcon className="size-5 shrink-0" />
        Prototype only: do not use real patient data!
      </p>
      <h1 className="text-2xl font-semibold">Seizure Diary</h1>
      <div className="flex flex-1 items-center">
        <Button
          className="h-48 w-full flex-col gap-4 rounded-3xl text-2xl"
          onClick={onRecord}
        >
          <MicIcon className="size-12" />
          Record an event
        </Button>
      </div>
      {/* For demos: lets whoever we share the link with find the clinician's view. */}
      <Button asChild variant="outline" className="h-16 rounded-2xl text-lg">
        <a href="/clinician">
          <ClipboardListIcon className="size-6" />
          Clinician view: see saved events
        </a>
      </Button>
    </div>
  )
}
