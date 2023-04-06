import { Dialog } from '@headlessui/react'
import { UserPlusIcon } from '@heroicons/react/20/solid'
import type { CampWeek, Gym } from '@prisma/client'
import { useState } from 'react'
import { CampWaitlistForm } from './CampWaitlistForm'

type Props = {
  climberId: string
  gym: Gym
  year: number
  weeks: CampWeek[]
}

export const CampWaitlistButton = ({ climberId, gym, year, weeks }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const [clicked, setClicked] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        onMouseDown={() => setClicked(true)}
        onMouseUp={() => setClicked(false)}
        className={`pointer-events-auto rounded-lg p-1 shadow-md shadow-neutral-900 ${
          gym.cssCode
        } ${clicked ? 'scale-95' : ''} transition-colors duration-500`}
      >
        Add to Waitlist
        <UserPlusIcon className='inline h-6 w-6' />
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6'>
            <CampWaitlistForm
              climberId={climberId}
              weeks={weeks}
              gym={gym}
              year={year}
              onRequestClose={() => setIsOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
