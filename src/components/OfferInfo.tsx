import { Dialog } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Climber, ClimbingClass, Offer, User } from "@prisma/client";
import { useState } from "react";
import useDeleteOffer from "../hooks/useDeleteOffer";
import isExpired from "../utils/isExpired";
import { InlineEditPencilButton } from "./InlineEditPencilButton";
import { OfferEditExpiration } from "./OfferEditExpiration";
import OfferEditNotes from "./OfferEditNotes";
import { OfferEditTicket } from "./OfferEditTicket";
import SelectClimberButton from "./SelectClimberButton";

type OfferInfoProps = {
  offer: Offer & {
    climber: Climber,
    user: User,
    climbingClass: ClimbingClass,
  } | null;
}

const OfferInfo = ({ offer }: OfferInfoProps) => {
  const [editOpen, setEditOpen] = useState(false)
  const [editExpirationOpen, setEditExpirationOpen] = useState(false)
  const [editTicketOpen, setEditTicketOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const deleteOffer = useDeleteOffer(offer)

  return offer ? (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <div className='flex gap-2'>
          <h1 className="text-2xl font-extrabold">Offer Info</h1>
          <button
            onClick={() => {
              setConfirmOpen(true)
            }}
          >
            <TrashIcon className='h-6 w-6 hover:opacity-75 duration-150 transition ease-in-out' />
          </button>
        </div>
        <ul className='list-disc'>
          <li>Climber: {offer.climber.name}</li>
          <li>Created: {`${offer.user.name} on ${offer.createdAt.toLocaleDateString()}`}</li>
          <li>
            {
              editExpirationOpen
                ?
                <OfferEditExpiration offerId={offer.id} originalExpiration={offer.expiration} onRequestClose={() => setEditExpirationOpen(false)} />
                :
                <>
                  <span>Expires:</span> <span className={`${isExpired(offer.expiration) ? 'text-red-500' : 'text-green-600 pr-2'}`}>{offer.expiration.toLocaleDateString()}</span>
                  <InlineEditPencilButton openFunction={() => setEditExpirationOpen(true)} />
                </>
            }
          </li>
          <li>
            {
              editTicketOpen
                ?
                <OfferEditTicket offerId={offer.id} originalTicket={offer.zendeskTicket} onRequestClose={() => setEditTicketOpen(false)} />
                :
                <>
                  <a className='pr-2 text-blue-600 hover:underline' target='blank' href={offer.zendeskTicket}>Zendesk Ticket</a>
                  <InlineEditPencilButton openFunction={() => setEditTicketOpen(true)} />
                </>
            }
          </li>
        </ul>
        {
          editOpen
            ?
            <OfferEditNotes offerId={offer.id} originalNotes={offer.notes ?? ''} onRequestClose={() => setEditOpen(false)} />
            :
            <div className='max-w-md text-center align-middle'>
              <h2 className='p-2 inline text-xl font-bold'>Notes</h2>
              <InlineEditPencilButton openFunction={() => setEditOpen(true)} />
              <p>{offer.notes}</p>
            </div>
        }
        <SelectClimberButton climber={offer.climber} />
      </div>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <div className="z-[4] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[5] fixed inset-0 items-center flex justify-center rounded-lg p-4'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 shadow-md shadow-black'
          >
            <div className='flex flex-col justify-center items-center gap-2'>
              <h1 className='text-xl font-bold'>This will permanently remove this offer</h1>
              <h2 className='text-lg'>This cannot be undone. Do you wish to continue?</h2>
            </div>
            <div className='flex gap-2 pt-4 justify-evenly'>
              <button
                className='p-2 bg-green-600 rounded-lg flex-1 hover:scale-95 transition duration-150 shadow-md shadow-neutral-900'
                onClick={() =>
                  deleteOffer.mutate({
                    offerId: offer.id,
                  })
                }
              >Yes</button>

              <button
                className='p-2 bg-red-600 rounded-lg hover:scale-95 flex-1 transition duration-150 ease-in-out shadow-md shadow-neutral-900'
                onClick={() => setConfirmOpen(false)}
              >No</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  ) : <></>
}

export default OfferInfo
