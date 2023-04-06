// TODO refactor this to just take the climbing class
export default function formatClassTime(startTime: Date, endTime: Date, timeZone: string) {
  const startString = startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: timeZone })
  const endString = endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: timeZone })
  const zoneCode = timeZone === 'America/Chicago' ? 'CT' : 'ET';

  return `${startString} - ${endString} (${zoneCode})`
}
