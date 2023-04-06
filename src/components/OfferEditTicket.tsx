import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useEditOfferTicket } from '../hooks/offer/useEditOfferTicket'
import { InlineEditButtons } from './InlineEditButtons'

type OfferEditTicketProps = {
  offerId: string
  originalTicket: string
  onRequestClose: () => void
}

export const OfferEditTicket = ({
  offerId,
  originalTicket,
  onRequestClose,
}: OfferEditTicketProps) => {
  const [ticket, setTicket] = useState(originalTicket)

  const editTicket = useEditOfferTicket()

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
            offerId: offerId,
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
