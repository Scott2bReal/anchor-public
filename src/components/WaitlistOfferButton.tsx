import { Dialog } from '@headlessui/react'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import type { Climber, Offer } from '@prisma/client'
import { useState } from 'react'
import OfferCard from './OfferCard'

interface WaitlistOfferButtonProps {
  climber: Climber & { offers: Offer[] }
}

const WaitlistOfferButton = ({ climber }: WaitlistOfferButtonProps) => {
  const [hovered, setHovered] = useState(false)
  const [offersOpen, setOffersOpen] = useState(false)
  const toggleOffersOpen = () => setOffersOpen(!offersOpen)

  return climber.offers.length > 0 ? (
    <>
      <div className='relative transition duration-150 ease-in-out hover:scale-95 '>
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
              Pending Offers for {climber.name}
            </h1>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              {climber.offers.map((offer) => {
                return (
                  <OfferCard
                    key={offer.id}
                    offerId={offer.id}
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

export default WaitlistOfferButton
