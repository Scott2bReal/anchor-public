export default function formatClassTime(startTime: Date, endTime: Date) {
  const startString = startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const endString = endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

  return `${startString} - ${endString}`
}
