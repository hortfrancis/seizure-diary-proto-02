// e.g. "Fri 2 Oct, 17:24"
export function formatEventTime(time: Date): string {
  return time.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Converts a Date to the "YYYY-MM-DDTHH:mm" string a datetime-local input expects.
export function toDateTimeInputValue(time: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())}` +
    `T${pad(time.getHours())}:${pad(time.getMinutes())}`
  )
}
