import { Dialog } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/24/solid'
import type { Climber, ClimbingClass, Offer, User } from '@prisma/client'
import { useState } from 'react'
import useDeleteOffer from '../hooks/useDeleteOffer'
import isExpired from '../utils/isExpired'
import { InlineEditPencilButton } from './InlineEditPencilButton'
import { OfferEditExpiration } from './OfferEditExpiration'
import OfferEditNotes from './OfferEditNotes'
import { OfferEditTicket } from './OfferEditTicket'
import SelectClimberButton from './SelectClimberButton'

type OfferInfoProps = {
  offer:
    | (Offer & {
        climber: Climber
        user: User
        climbingClass: ClimbingClass
      })
    | null
}

const OfferInfo = ({ offer }: OfferInfoProps) => {
  const [editOpen, setEditOpen] = useState(false)
  const [editExpirationOpen, setEditExpirationOpen] = useState(false)
  const [editTicketOpen, setEditTicketOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const deleteOffer = useDeleteOffer(offer)

  return offer ? (
    <>
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='flex gap-2'>
          <h1 className='text-2xl font-extrabold'>Offer Info</h1>
          <button
            onClick={() => {
              setConfirmOpen(true)
            }}
          >
            <TrashIcon className='h-6 w-6 transition duration-150 ease-in-out hover:opacity-75' />
          </button>
        </div>
        <ul className='list-disc'>
          <li>Climber: {offer.climber.name}</li>
          <li>
            Created:{' '}
            {`${
              offer.user.name ?? 'Someone'
            } on ${offer.createdAt.toLocaleDateString()}`}
          </li>
          <li>
            {editExpirationOpen ? (
              <OfferEditExpiration
                offerId={offer.id}
                originalExpiration={offer.expiration}
                onRequestClose={() => setEditExpirationOpen(false)}
              />
            ) : (
              <>
                <span>Expires:</span>{' '}
                <span
                  className={`${
                    isExpired(offer.expiration)
                      ? 'text-red-500'
                      : 'pr-2 text-green-600'
                  }`}
                >
                  {offer.expiration.toLocaleDateString()}
                </span>
                <InlineEditPencilButton
                  openFunction={() => setEditExpirationOpen(true)}
                />
              </>
            )}
          </li>
          <li>
            {editTicketOpen ? (
              <OfferEditTicket
                offerId={offer.id}
                originalTicket={offer.zendeskTicket}
                onRequestClose={() => setEditTicketOpen(false)}
              />
            ) : (
              <>
                <a
                  className='pr-2 text-blue-600 hover:underline'
                  target='blank'
                  href={offer.zendeskTicket}
                >
                  Zendesk Ticket
                </a>
                <InlineEditPencilButton
                  openFunction={() => setEditTicketOpen(true)}
                />
              </>
            )}
          </li>
        </ul>
        {editOpen ? (
          <OfferEditNotes
            offerId={offer.id}
            originalNotes={offer.notes ?? ''}
            onRequestClose={() => setEditOpen(false)}
          />
        ) : (
          <div className='max-w-md text-center align-middle'>
            <h2 className='inline p-2 text-xl font-bold'>Notes</h2>
            <InlineEditPencilButton openFunction={() => setEditOpen(true)} />
            <p>{offer.notes}</p>
          </div>
        )}
        <SelectClimberButton climber={offer.climber} />
      </div>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className='fixed inset-0 z-[4] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[5] flex items-center justify-center rounded-lg p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 shadow-md shadow-black'>
            <div className='flex flex-col items-center justify-center gap-2'>
              <h1 className='text-xl font-bold'>
                This will permanently remove this offer
              </h1>
              <h2 className='text-lg'>
                This cannot be undone. Do you wish to continue?
              </h2>
            </div>
            <div className='flex justify-evenly gap-2 pt-4'>
              <button
                className='flex-1 rounded-lg bg-green-600 p-2 shadow-md shadow-neutral-900 transition duration-150 hover:scale-95'
                onClick={() =>
                  deleteOffer.mutate({
                    offerId: offer.id,
                  })
                }
              >
                Yes
              </button>

              <button
                className='flex-1 rounded-lg bg-red-600 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95'
                onClick={() => setConfirmOpen(false)}
              >
                No
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  ) : (
    <></>
  )
}

export default OfferInfo
