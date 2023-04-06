import { Dialog } from '@headlessui/react'
import type { Climber, ClimbingClass } from '@prisma/client'
import { useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { gymAtom } from '../utils/atoms/gymAtom'
import OfferForm from './OfferForm'

type OfferButtonProps = {
  climber: Climber
  climbingClass: ClimbingClass
  availableForOffers: boolean
}

const OfferButton = ({
  climber,
  climbingClass,
  availableForOffers,
}: OfferButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)
  const [selectedGymId] = useAtom(gymAtom)

  const { data: session } = useSession()

  if (!session) return <div>Must be logged in</div>
  const user = session.user
  if (!user) return <div>Must be logged in</div>

  return availableForOffers ? (
    <>
      <button
        className={`pointer-events-auto flex-1 rounded-lg bg-gray-800 p-1 text-slate-100 shadow-md shadow-neutral-900 hover:scale-95`}
        onClick={() => toggleOpen()}
      >
        Offer
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-900 p-6 shadow-md shadow-neutral-900'>
            <OfferForm
              climberId={climber.id}
              climbingClass={climbingClass}
              userId={user.id}
              onRequestClose={toggleOpen}
              gymId={selectedGymId}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  ) : (
    <button
      className={`pointer-events-auto flex-1 rounded-lg bg-gray-800 p-1 text-slate-100 opacity-50 shadow-md shadow-neutral-900`}
      disabled
    >
      Offer
    </button>
  )
}

export default OfferButton
