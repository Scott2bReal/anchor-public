// Tweaked version of useCopyToClipboard from https://usehooks-ts.com/react-hook/use-copy-to-clipboard

import { useState } from "react"
import toast from "react-hot-toast"

type CopiedValue = string | null
type CopyFn = (text: string) => Promise<boolean> // Return success

function useCopyEmailsToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy: CopyFn = async text => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    const message = text.split('\n').length === 1 ? 'Email copied to clipboard' : 'Emails copied to clipboard'

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      toast.success(message)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
      toast.error(`Error copying text to clipboard: ${error}`)
      return false
    }
  }

  return [copiedText, copy]
}

export default useCopyEmailsToClipboard
