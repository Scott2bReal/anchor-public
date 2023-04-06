import { Dialog } from '@headlessui/react'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import type { CampOffer, Climber } from '@prisma/client'
import { useState } from 'react'
import { CampOfferCard } from './CampOfferCard'

interface Props {
  climber: Climber & { campOffers: CampOffer[] }
}

export const CampWaitlistOfferButton = ({ climber }: Props) => {
  const [hovered, setHovered] = useState(false)
  const [offersOpen, setOffersOpen] = useState(false)
  const toggleOffersOpen = () => setOffersOpen(!offersOpen)

  return climber.campOffers.length > 0 ? (
    <>
      <div className='relative'>
        <button
          onClick={() => toggleOffersOpen()}
          className='z-[2] flex gap-2'
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <EnvelopeIcon className='z-[2] h-4 w-4 ' />
        </button>
        <span
          className={`${
            hovered ? 'translate-y-[-18px] opacity-100' : 'opacity-0'
          } absolute top-[-2px] left-[-14px] w-max text-neutral-400 transition duration-300 ease-in-out hover:cursor-default`}
        >
          View Offers
        </span>
      </div>
      <Dialog open={offersOpen} onClose={() => setOffersOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex max-h-[100vh] items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto max-h-screen rounded-lg bg-neutral-800 p-6 text-center'>
            <h1 className='p-2 text-xl font-bold'>
              Pending Camp Offers for {climber.name}
            </h1>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              {climber.campOffers.map((campOffer) => {
                return (
                  <CampOfferCard
                    key={campOffer.id}
                    offerId={campOffer.id}
                    today={new Date()}
                  />
                )
              })}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  ) : (
    <></>
  )
}
