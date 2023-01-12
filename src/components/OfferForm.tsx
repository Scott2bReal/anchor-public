import { ClimbingClass } from '@prisma/client';
import { TRPCClientError } from '@trpc/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useIsCurrentSession from '../hooks/useIsCurrentSession';
import useLogger from '../hooks/useLogger';
import { formatDateFromInput } from '../utils/formatDateFromInput';
import { trpc } from '../utils/trpc';

type OfferFormProps = {
  climbingClass: ClimbingClass;
  climberId: string;
  userId: string;
  gymId: string;
  onRequestClose: () => void;
}

const formatExpiration = formatDateFromInput

interface CurrentSessionReminderProps {
  isCurrentSession: boolean;
}

const CurrentSessionReminder = ({ isCurrentSession }: CurrentSessionReminderProps) => {
  return isCurrentSession ? (
    <>
      <h2 className='font-bold text-red-600 text-lg'>Warning! Offering for the current session. </h2>
      <h3 className='font-bold text-red-600'>Please make offers for the upcoming session</h3>
      <h4 className='font-bold text-sm text-red-600'>Unless you meant to do this :)</h4>
    </>
  ) : (
    <></>
  )
}

const OfferForm = ({ climbingClass, climberId, userId, onRequestClose, gymId }: OfferFormProps) => {
  const [zendeskTicket, setZendeskTicket] = useState('')
  const [notes, setNotes] = useState('')
  const [expiration, setExpiration] = useState('')
  const { data: session } = useSession()
  const ctx = trpc.useContext()
  const user = session?.user?.name
  const isCurrentSession = useIsCurrentSession()

  const logger = useLogger()

  const makeOffer = trpc.offers.createOffer.useMutation({
    onMutate: async () => {
      toast.loading('Creating offer...')
      await ctx.gyms.getById.cancel()
      await ctx.climber.getById.cancel()
      await ctx.offers.getByClass.cancel()
    },
    onSettled: () => {
      ctx.gyms.getById.invalidate()
      ctx.climber.getById.invalidate()
      ctx.offers.getByClass.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Offer made!')
      onRequestClose()
      logger.mutate({
        climberId: climberId,
        message: `${user} - Offer for a ${climbingClass.className} class`
      })
    },
    onError: (e) => {
      toast.dismiss()
      if (e instanceof TRPCClientError) {
        toast.error(`Unable to create offer: ${e.message}`)
      } else {
        toast.error(`Unable to create offer: ${e.message}`)
      }
    },
  })

  if (!session) return <div>Log in!</div>

  return (
    <form
      className='flex flex-col items-center justify-center p-2 gap-2'
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
      <input required className='px-2 py-1 bg-gray-100 text-slate-900 rounded-lg shadow-md shadow-black' onChange={(e) => setZendeskTicket(e.target.value)} />

      <label htmlFor='notes'>Notes</label>
      <textarea name='notes' className='px-2 py-1 bg-gray-100 text-slate-900 shadow-md shadow-black rounded-lg' onChange={(e) => setNotes(e.target.value)}></textarea>

      <label htmlFor='expiration'>Expires</label>
      <input required className='px-2 py-1 bg-gray-100 text-slate-900 shadow-md shadow-black rounded-lg' type='date' onChange={(e) => setExpiration(e.target.value)} />

      <button className='p-2 bg-gray-800 shadow-md shadow-black transition duration-150 ease-in-out hover:scale-95 rounded-lg my-4' type='submit'>Make Offer</button>
    </form>
  )
}

export default OfferForm
