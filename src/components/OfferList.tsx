import { Dialog } from "@headlessui/react"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import { Climber, ClimbingClass, Offer, User } from "@prisma/client"
import { useAtom } from "jotai"
import { useState } from "react"
import { climberAtom } from "../utils/atoms/climberAtom"
import grabClimber from "../utils/grabClimber"
import isExpired from "../utils/isExpired"
import { trpc } from "../utils/trpc"
import OfferInfo from "./OfferInfo"

type OfferListProps = {
  classId: string,
}

export default function OfferList({ classId }: OfferListProps) {
  const { isLoading, data: offers } = trpc.offers.getByClass.useQuery({ classId: classId })
  const [open, setOpen] = useState(false)
  const [, setSelectedClimberId] = useAtom(climberAtom)
  const [selectedOffer, setSelectedOffer] = useState<Offer & { user: User, climber: Climber, climbingClass: ClimbingClass } | null>(null);
  if (isLoading) return <div className='p-4'>Loading offers...</div>
  if (!offers) return <></>

  return (
    <>
      <div className='flex flex-col gap-2 p-4'>
        <h1 className='text-xl'>Offers</h1>
        <ul>
          <div className='flex flex-col justify-start items-start'>
            {offers.map((offer) => {
              return <li key={offer.id} className='flex gap-2'>
                <span
                  onClick={() => grabClimber(offer.climber, () => setSelectedClimberId(offer.climber.id))}
                  className='hover:cursor-pointer'
                >{offer.climber.name}</span>
                <button
                  onClick={() => {
                    setOpen(true)
                    setSelectedOffer(offer)
                  }}
                >
                  <ArrowTopRightOnSquareIcon className={`hover:opacity-75 transition duration-150 ease-in-out h-4 w-4 ${isExpired(offer.expiration) ? 'text-red-500 animate-ping' : 'text-green-600'}`} />
                </button>
              </li>
            })}
          </div>
        </ul>
      </div >
      <Dialog open={open} onClose={() => {
        setOpen(false)
        setSelectedOffer(null)
      }}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-900 p-6 shadow-md shadow-neutral-900'>
            <OfferInfo offer={selectedOffer} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
