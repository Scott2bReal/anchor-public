export function formatDateFromInput(string: string) {
  const result = string.replace(/-/g, '/')
  return new Date(result)
}
