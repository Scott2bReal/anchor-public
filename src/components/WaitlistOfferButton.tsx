import { Dialog } from "@headlessui/react"
import { EnvelopeIcon } from "@heroicons/react/24/outline"
import { Climber, Offer } from "@prisma/client"
import { useState } from "react"
import OfferCard from "./OfferCard"

interface WaitlistOfferButtonProps {
  climber: Climber & { offers: Offer[] }
}

const WaitlistOfferButton = ({ climber }: WaitlistOfferButtonProps) => {
  const [hovered, setHovered] = useState(false)
  const [offersOpen, setOffersOpen] = useState(false)
  const toggleOffersOpen = () => setOffersOpen(!offersOpen)

  return climber.offers.length > 0 ? (
    <>
      <div className='relative hover:scale-95 transition duration-150 ease-in-out '>
        <button
          onClick={() => toggleOffersOpen()}
          className='flex gap-2 z-[2]'
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <EnvelopeIcon className='z-[2] h-4 w-4 ' />

        </button>
        <span className={`${hovered ? 'translate-y-[-18px] opacity-100' : 'opacity-0'} w-max absolute top-[-2px] left-[-14px] text-neutral-400 transition duration-300 ease-in-out hover:cursor-default`}>View Offers</span>
      </div>
      <Dialog
        open={offersOpen} onClose={() => setOffersOpen(false)}
      >
        <div className="z-[3] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[4] fixed inset-0 items-center flex justify-center p-4 max-h-[100vh]'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 max-h-screen text-center'
          >
            <h1 className='font-bold text-xl p-2'>Pending Offers for {climber.name}</h1>
            <div className='flex flex-wrap gap-2 items-center justify-center'>
            {
              climber.offers.map((offer) => {
                return <OfferCard key={offer.id} offerId={offer.id} today={new Date()} />
              })
            }
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
