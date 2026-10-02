import { CircleCheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  onDone: () => void
}

export function SavedScreen({ onDone }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <CircleCheckIcon className="size-20 text-green-600" />
      <p className="text-2xl font-semibold">Event saved</p>
      <Button className="mt-6 h-20 w-full rounded-2xl text-xl" onClick={onDone}>
        Done
      </Button>
    </div>
  )
}
