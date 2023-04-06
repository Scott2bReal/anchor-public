import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useOnClickOutside } from 'usehooks-ts'
import { api } from '../utils/api'
import { formatDateFromInput } from '../utils/formatDateFromInput'
import { InlineEditButtons } from './InlineEditButtons'

type OfferEditExpirationProps = {
  offerId: string
  originalExpiration: Date
  onRequestClose: () => void
}

export const OfferEditExpiration = ({
  offerId,
  originalExpiration,
  onRequestClose,
}: OfferEditExpirationProps) => {
  const [expiration, setExpiration] = useState(originalExpiration)
  const ctx = api.useContext()

  const editExpiration = api.offer.updateExpiration.useMutation({
    onMutate: async () => {
      await ctx.offer.getById.cancel()
      await ctx.offer.getByClass.cancel()
    },
    onSettled: async () => {
      await ctx.offer.getById.invalidate()
      await ctx.offer.getByClass.invalidate()
    },
    onSuccess: () => toast.success('Updated expiration!'),
    onError: (e) => toast.error(`Unable to edit expiration: ${e.message}`),
  })

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  return (
    <>
      <label htmlFor='offerNotes' className='font-bold'>
        Edit Expiration
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          editExpiration.mutate({
            offerId: offerId,
            expiration: expiration,
          })
          onRequestClose()
        }}
        className='inline p-2'
        name='entryDate'
        ref={formRef}
      >
        <input
          type='date'
          onChange={(e) => setExpiration(formatDateFromInput(e.target.value))}
          autoFocus
          className='rounded-lg px-2 py-1 text-neutral-900'
        />
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
