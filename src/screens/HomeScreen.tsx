import { MicIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  onRecord: () => void
}

export function HomeScreen({ onRecord }: Props) {
  return (
    <div className="flex flex-1 flex-col">
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
    </div>
  )
}
