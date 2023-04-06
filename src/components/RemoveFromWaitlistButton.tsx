import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import type { Climber, WaitlistEntry } from '@prisma/client'
import { useState } from 'react'
import useRemoveFromWaitlist from '../hooks/waitlist-hooks/useRemoveFromWaitlist'

type RemoveFromWaitlistButtonProps = {
  entry: WaitlistEntry & { climber: Climber }
}

const RemoveFromWaitlistButton = ({ entry }: RemoveFromWaitlistButtonProps) => {
  const removeFromWaitlist = useRemoveFromWaitlist({
    classType: entry.classType,
  })
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className=''
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <XMarkIcon className='h-4 w-4 text-red-500 transition duration-150 ease-in-out hover:scale-75' />
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[4] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[5] flex items-center justify-center rounded-lg p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 shadow-md shadow-black'>
            <div className='flex flex-col items-center justify-center gap-2'>
              <h1 className='text-xl font-bold'>
                This will remove {entry.climber.name} from the waitlist
              </h1>
              <h2 className='text-lg'>
                This cannot be undone. Do you wish to continue?
              </h2>
            </div>
            <div className='flex justify-evenly gap-2 pt-4'>
              <button
                className='flex-1 rounded-lg bg-green-600 p-2 shadow-md shadow-neutral-900 transition duration-150 hover:scale-95'
                onClick={() =>
                  removeFromWaitlist.mutate({
                    waitlistId: entry.id,
                  })
                }
              >
                Yes
              </button>

              <button
                className='flex-1 rounded-lg bg-red-600 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95'
                onClick={() => setIsOpen(false)}
              >
                No
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default RemoveFromWaitlistButton
