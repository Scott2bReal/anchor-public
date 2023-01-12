import dayjs from "dayjs"

export default function isExpired(expires: Date) {
  return dayjs().isAfter(expires)
}
