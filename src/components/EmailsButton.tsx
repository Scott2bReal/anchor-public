import { ArrowRightIcon, AtSymbolIcon, ClipboardDocumentIcon } from "@heroicons/react/24/solid"
import { Climber } from "@prisma/client"
import { useState } from "react";
import useCopyEmailsToClipboard from "../hooks/useCopyEmailsToClipboard";

type EmailsButtonProps = {
  climbers: Climber[];
  helpText?: boolean;
}

const EmailsButton = ({ climbers, helpText }: EmailsButtonProps) => {
  const emails = climbers.map((climber) => {
    return climber.parentEmail
  }).join('\n')

  const [hovered, setHovered] = useState(false)

  const [, copy] = useCopyEmailsToClipboard()


  return (
    <>
      {
        helpText
          ?
          <span className={`${hovered ? '-translate-x-[80px] opacity-100' : 'opacity-0'} w-max absolute left-[-100px] text-neutral-400 transition duration-300 ease-in-out hover:cursor-default`}>
            Copy emails to clipboard
          </span>
          :
          <></>
      }
      <button
        onClick={() => copy(emails)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className='z-[2] flex gap-2 items-center justify-center p-2 bg-transparent border-[1px] border-neutral-100 rounded-lg shadow-md shadow-neutral-900 hover:scale-95 transition duration-150 ease-in-out'
      >
        <AtSymbolIcon className='h-4 w-4' />
        <ArrowRightIcon className='h-2 w-2' />
        <ClipboardDocumentIcon className='h-4 w-4' />
      </button>
    </>
  )
}

export default EmailsButton
