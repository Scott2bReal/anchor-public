import { Dialog } from '@headlessui/react'
import { UserPlusIcon } from '@heroicons/react/20/solid'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { sessionAtom } from '../utils/atoms/sessionAtom'
import { cssClassTypeCodes } from '../utils/cssClassTypeCodes'
import WaitlistForm from './WaitlistForm'

type WaitlistButtonProps = {
  climberId: string
  gymId: string
  classType: string
}

const WaitlistButton = ({
  climberId,
  gymId,
  classType,
}: WaitlistButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)
  const [selectedSession] = useAtom(sessionAtom)

  return selectedSession ? (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`pointer-events-auto flex items-center justify-center gap-2 rounded-lg shadow-md shadow-neutral-900 ${
          cssClassTypeCodes[classType] ?? ''
        } p-1 text-slate-900 transition-colors duration-500 ease-in-out hover:scale-95`}
      >
        Add to Waitlist
        <UserPlusIcon className='h-6 w-6' />
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6'>
            <WaitlistForm
              climberId={climberId}
              gymId={gymId}
              closeOnRequest={toggleOpen}
              classType={classType}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  ) : (
    <div>Please select a session</div>
  )
}

export default WaitlistButton
