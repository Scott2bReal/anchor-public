import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Dialog } from '@headlessui/react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import type { CampOffer, Climber, User } from '@prisma/client'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useGetCampOffersByCampWeek } from '../hooks/camp-offer/useGetCampOffersByCampWeek'
import { climberAtom } from '../utils/atoms/climberAtom'
import grabClimber from '../utils/grabClimber'
import isExpired from '../utils/isExpired'
import { CampOfferInfo } from './CampOfferInfo'

type Props = {
  weekId: string
}

export const CampOfferList = ({ weekId }: Props) => {
  const { isLoading, data: campOffers } = useGetCampOffersByCampWeek(weekId)
  const [open, setOpen] = useState(false)
  const [, setSelectedClimberId] = useAtom(climberAtom)
  const [selectedCampOffer, setSelectedCampOffer] = useState<
    (CampOffer & { climber: Climber; user: User }) | null
  >(null)
  const [parent] = useAutoAnimate<HTMLDivElement>()
  if (isLoading) return <div className='p-4'>Loading offers...</div>
  if (!campOffers) return <></>

  return (
    <>
      <div ref={parent} className='flex flex-col gap-2 p-4'>
        <h1 className='text-xl'>Offers</h1>
        <ul>
          <div className='flex flex-col items-start justify-start'>
            {campOffers.map((campOffer) => {
              return (
                <li key={campOffer.id} className='flex gap-2'>
                  <span
                    onClick={() =>
                      grabClimber(campOffer.climber, () =>
                        setSelectedClimberId(campOffer.climber.id)
                      )
                    }
                    className='hover:cursor-pointer'
                  >
                    {campOffer.climber.name}
                  </span>
                  <button
                    onClick={() => {
                      setOpen(true)
                      setSelectedCampOffer(campOffer)
                    }}
                  >
                    <ArrowTopRightOnSquareIcon
                      className={`h-4 w-4 transition duration-150 ease-in-out hover:opacity-75 ${
                        isExpired(campOffer.expiration)
                          ? 'animate-ping text-red-500'
                          : 'text-green-600'
                      }`}
                    />
                  </button>
                </li>
              )
            })}
          </div>
        </ul>
      </div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
          setSelectedCampOffer(null)
        }}
      >
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-900 p-6 shadow-md shadow-neutral-900'>
            <CampOfferInfo campOffer={selectedCampOffer} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
