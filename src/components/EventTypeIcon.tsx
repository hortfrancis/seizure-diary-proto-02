import { EllipsisIcon, MoonIcon, SunIcon, ZapIcon, type LucideProps } from "lucide-react"
import type { EventType } from "@/types"

const icons = {
  seizure: ZapIcon,
  wake: SunIcon,
  sleep: MoonIcon,
  other: EllipsisIcon,
} satisfies Record<EventType, unknown>

export function EventTypeIcon({ type, ...props }: { type: EventType } & LucideProps) {
  const Icon = icons[type]
  return <Icon {...props} />
}
