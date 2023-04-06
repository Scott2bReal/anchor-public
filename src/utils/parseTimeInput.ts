import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
dayjs.extend(utc)
dayjs.extend(timezone)

function accountForUserTimeZone(hoursString: string, targetTimeZone: string) {
  const userTimeZone = dayjs.tz.guess()
  console.log('targetTimeZone', targetTimeZone)
  console.log('userTimeZone', userTimeZone)
  if (targetTimeZone === 'America/Chicago' && userTimeZone === 'America/New_York') {
    return Number(hoursString) + 1
  }
  if (targetTimeZone === 'America/New_York' && userTimeZone === 'America/Chicago') {
    return Number(hoursString) - 1
  }
  return Number(hoursString)
}

export function parseTimeInput(string: string, timeZone: string) {
  const arr = string.split(':');
  const hours = accountForUserTimeZone(arr[0] ?? '0', timeZone)
  const minutes = Number(arr[1])
  return dayjs().set('hours', hours).set('minutes', minutes).toDate()
}
