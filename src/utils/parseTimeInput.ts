import dayjs from "dayjs";

export function parseTimeInput(string: string) {
  const arr = string.split(':');
  const hours = Number(arr[0])
  const minutes = Number(arr[1])

  return dayjs().set('hours', hours).set('minutes', minutes).toDate()
}
