import capitalize from "./capitalize"

export const toCamelCase = (string: string) => {
  const words = string.split(/[\s\-\_]/)
  if (words[0]) {
    if (words.length === 1) {
      return words[0].toLowerCase()
    }
    return `${words[0].toLowerCase()}${words.slice(1, Infinity)
      .map(word => capitalize(word))
      .join('')}`
  }
  return string
}
