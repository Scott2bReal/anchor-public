const formatTime = (timeString: string) => {
  const [time, suffix] = timeString.split(' ');

  if (!time || !suffix) return timeString

  const [hours, minutes] = time.split(':')

  if (!hours || !minutes) return timeString

  return `${hours}:${minutes} ${suffix}`;
}

export default function formatLocaleString(localeString: string) {
  const [dateString, timeString] = localeString.split(', ');

  if (!dateString) return '';
  if (!timeString) return dateString;

  return `${dateString} at ${formatTime(timeString)}`
}
