import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useEditCampOfferExpiration } from '../hooks/camp-offer/useEditCampOfferExpiration'
import { formatDateFromInput } from '../utils/formatDateFromInput'
import { InlineEditButtons } from './InlineEditButtons'

interface Props {
  campOfferId: string
  originalExpiration: Date
  onRequestClose: () => void
}

export const CampOfferEditExpiration = ({
  campOfferId,
  originalExpiration,
  onRequestClose,
}: Props) => {
  const [expiration, setExpiration] = useState(originalExpiration)

  const editExpiration = useEditCampOfferExpiration()

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
            campOfferId: campOfferId,
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
