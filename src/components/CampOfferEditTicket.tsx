import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useEditCampOfferTicket } from '../hooks/camp-offer/useEditCampOfferTicket'
import { InlineEditButtons } from './InlineEditButtons'

type Props = {
  campOfferId: string
  originalTicket: string
  onRequestClose: () => void
}

export const CampOfferEditTicket = ({
  campOfferId,
  originalTicket,
  onRequestClose,
}: Props) => {
  const [ticket, setTicket] = useState(originalTicket)

  const editTicket = useEditCampOfferTicket()

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  return (
    <>
      <label htmlFor='offerNotes' className='font-bold'>
        Edit Zendesk Ticket
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          editTicket.mutate({
            campOfferId: campOfferId,
            zendeskTicket: ticket,
          })
          onRequestClose()
        }}
        className='inline p-2'
        name='entryDate'
        ref={formRef}
      >
        <input
          onChange={(e) => setTicket(e.target.value)}
          autoFocus
          className='rounded-lg px-2 py-1 text-neutral-900'
          placeholder={originalTicket}
        />
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
