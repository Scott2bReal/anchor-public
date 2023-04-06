import type { CampWeek } from '@prisma/client'
import { useState } from 'react'
import { useMakeCampOffer } from '../hooks/camp-offer/useMakeCampOffer'
import { formatDateFromInput } from '../utils/formatDateFromInput'

type Props = {
  campWeek: CampWeek
  climberId: string
  userId: string
  gymId: string
  onRequestClose: () => void
}

const formatExpiration = formatDateFromInput

export const CampOfferForm = ({
  campWeek,
  climberId,
  userId,
  onRequestClose,
  gymId,
}: Props) => {
  const [zendeskTicket, setZendeskTicket] = useState('')
  const [notes, setNotes] = useState('')
  const [expiration, setExpiration] = useState('')

  const makeCampOffer = useMakeCampOffer({
    climberId: climberId,
    onRequestClose: onRequestClose,
  })

  return (
    <form
      className='flex flex-col items-center justify-center gap-2 p-2'
      onSubmit={(e) => {
        e.preventDefault()
        makeCampOffer.mutate({
          campWeekId: campWeek.id,
          climberId: climberId,
          userId: userId,
          notes: notes,
          zendeskTicket: zendeskTicket,
          expiration: formatExpiration(expiration),
          gymId: gymId,
        })
      }}
    >
      <h1 className='text-xl font-bold'>Offer Form</h1>

      <label htmlFor='zendeskTicket'>Zendesk Ticket</label>
      <input
        required
        className='rounded-lg bg-gray-100 px-2 py-1 text-slate-900 shadow-md shadow-black'
        onChange={(e) => setZendeskTicket(e.target.value)}
      />

      <label htmlFor='notes'>Notes</label>
      <textarea
        name='notes'
        className='rounded-lg bg-gray-100 px-2 py-1 text-slate-900 shadow-md shadow-black'
        onChange={(e) => setNotes(e.target.value)}
      ></textarea>

      <label htmlFor='expiration'>Expires</label>
      <input
        required
        className='rounded-lg bg-gray-100 px-2 py-1 text-slate-900 shadow-md shadow-black'
        type='date'
        onChange={(e) => setExpiration(e.target.value)}
      />

      <button
        className='my-4 rounded-lg bg-gray-800 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95'
        type='submit'
      >
        Make Offer
      </button>
    </form>
  )
}
