import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Climber, WaitlistEntry } from "@prisma/client";
import { useState } from "react";
import useRemoveFromWaitlist from "../hooks/waitlist-hooks/useRemoveFromWaitlist";

type RemoveFromWaitlistButtonProps = {
  entry: WaitlistEntry & { climber: Climber };
}

const RemoveFromWaitlistButton = ({ entry }: RemoveFromWaitlistButtonProps) => {
  const removeFromWaitlist = useRemoveFromWaitlist({ classType: entry.classType })
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className=''
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <XMarkIcon className='h-4 w-4 text-red-500 hover:scale-75 ease-in-out duration-150 transition' />
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="z-[4] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[5] fixed inset-0 items-center flex justify-center rounded-lg p-4'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 shadow-md shadow-black'
          >
            <div className='flex flex-col justify-center items-center gap-2'>
              <h1 className='text-xl font-bold'>This will remove {entry.climber.name} from the waitlist</h1>
              <h2 className='text-lg'>This cannot be undone. Do you wish to continue?</h2>
            </div>
            <div className='flex gap-2 pt-4 justify-evenly'>
              <button
                className='p-2 bg-green-600 rounded-lg flex-1 hover:scale-95 transition duration-150 shadow-md shadow-neutral-900'
                onClick={() =>
                  removeFromWaitlist.mutate({
                    waitlistId: entry.id
                  })
                }
              >Yes</button>

              <button
                className='p-2 bg-red-600 rounded-lg hover:scale-95 flex-1 transition duration-150 ease-in-out shadow-md shadow-neutral-900'
                onClick={() => setIsOpen(false)}
              >No</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default RemoveFromWaitlistButton
