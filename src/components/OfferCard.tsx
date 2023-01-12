import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import ClassCard from "./ClassCard";
import LoadingSpinner from "./LoadingSpinner";
import OfferInfo from "./OfferInfo";

interface OfferCardProps {
  offerId: string;
  today: Date;
}

const OfferCard = ({ offerId, today }: OfferCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  const { isLoading, data: offer } = trpc.offers.getById.useQuery({ offerId: offerId })

  if (isLoading) return <LoadingSpinner />
  if (!offer) return <div>No offer with that id...</div>

  const backgroundColor = offer.expiration > today ? offer.climbingClass.cssCode : 'expired'

  return (
    <>
      <div
        className={`${backgroundColor} p-2 rounded-lg hover:cursor-pointer hover:scale-105 duration-150 transition ease-in-out shadow-md shadow-black`}
        onClick={() => toggleIsOpen()}
      >
        <ul>
          <li><strong>Climber:</strong> {offer.climber.name}</li>
          <li><strong>Made by:</strong> {offer.user.name}</li>
          <li><strong>On:</strong> {offer.createdAt.toLocaleDateString()}</li>
          <li><strong>Expires:</strong> {offer.expiration.toLocaleDateString()}</li>
        </ul>
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-900 p-6 flex flex-col gap-2 items-center justify-center shadow-md shadow-black'>
            <OfferInfo offer={offer} />
            <h2 className='text-lg font-bold'>Offered Class</h2>
            <ClassCard climbingClass={offer.climbingClass} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default OfferCard
