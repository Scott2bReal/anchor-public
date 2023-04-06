import {
  ArrowRightIcon,
  AtSymbolIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/solid'
import type { Climber } from '@prisma/client'
import { useState } from 'react'
import useCopyEmailsToClipboard from '../hooks/useCopyEmailsToClipboard'

type EmailsButtonProps = {
  climbers: Climber[]
  helpText?: boolean
}

const EmailsButton = ({ climbers, helpText }: EmailsButtonProps) => {
  const emails = climbers
    .map((climber) => {
      return climber.parentEmail
    })
    .join('\n')

  const [hovered, setHovered] = useState(false)

  const [, copy] = useCopyEmailsToClipboard()

  return (
    <>
      {helpText ? (
        <span
          className={`${
            hovered ? '-translate-x-[80px] opacity-100' : 'opacity-0'
          } absolute left-[-100px] w-max text-neutral-400 transition duration-300 ease-in-out hover:cursor-default`}
        >
          Copy emails to clipboard
        </span>
      ) : (
        <></>
      )}
      <button
        onClick={() => {
          void copy(emails)
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className='z-[2] flex items-center justify-center gap-2 rounded-lg border-[1px] border-neutral-100 bg-transparent p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95'
      >
        <AtSymbolIcon className='h-4 w-4' />
        <ArrowRightIcon className='h-2 w-2' />
        <ClipboardDocumentIcon className='h-4 w-4' />
      </button>
    </>
  )
}

export default EmailsButton
