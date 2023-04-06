import type { ClimbingClass } from '@prisma/client'
import { useState } from 'react'
import { useMakeOffer } from '../hooks/offer/useMakeOffer'
import useIsCurrentSession from '../hooks/useIsCurrentSession'
import { formatDateFromInput } from '../utils/formatDateFromInput'

type OfferFormProps = {
  climbingClass: ClimbingClass
  climberId: string
  userId: string
  gymId: string
  onRequestClose: () => void
}

const formatExpiration = formatDateFromInput

interface CurrentSessionReminderProps {
  isCurrentSession: boolean
}

const CurrentSessionReminder = ({
  isCurrentSession,
}: CurrentSessionReminderProps) => {
  return isCurrentSession ? (
    <>
      <h2 className='text-lg font-bold text-red-600'>
        Warning! Offering for the current session.{' '}
      </h2>
      <h3 className='font-bold text-red-600'>
        Please make offers for the upcoming session
      </h3>
      <h4 className='text-sm font-bold text-red-600'>
        Unless you meant to do this :)
      </h4>
    </>
  ) : (
    <></>
  )
}

const OfferForm = ({
  climbingClass,
  climberId,
  userId,
  onRequestClose,
  gymId,
}: OfferFormProps) => {
  const [zendeskTicket, setZendeskTicket] = useState('')
  const [notes, setNotes] = useState('')
  const [expiration, setExpiration] = useState('')

  const isCurrentSession = useIsCurrentSession()
  const makeOffer = useMakeOffer({ climberId, climbingClass, onRequestClose })

  return (
    <form
      className='flex flex-col items-center justify-center gap-2 p-2'
      onSubmit={(e) => {
        e.preventDefault()
        makeOffer.mutate({
          classId: climbingClass.id,
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
      <CurrentSessionReminder isCurrentSession={isCurrentSession} />

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

export default OfferForm
