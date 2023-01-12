import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import { trpc } from "../utils/trpc";
import { InlineEditButtons } from "./InlineEditButtons";

type OfferEditTicketProps = {
  offerId: string;
  originalTicket: string;
  onRequestClose: () => void;
}

export const OfferEditTicket = ({offerId, originalTicket, onRequestClose}: OfferEditTicketProps) => {
  const [ticket, setTicket] = useState(originalTicket)
  const ctx = trpc.useContext()

  const editTicket = trpc.offers.updateZendeskTicket.useMutation({
    onMutate: async () => {
      await ctx.offers.getById.cancel()
      await ctx.offers.getByClass.cancel()
    },
    onSettled: () => {
      ctx.offers.getById.invalidate()
      ctx.offers.getByClass.invalidate()
    },
    onSuccess: () => toast.success("Updated Zendesk ticket!"),
    onError: (e) => toast.error(`Unable to edit Zendesk ticket: ${e.data?.zodError?.fieldErrors['zendeskTicket']}`)
  })

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  return (
    <>
      <label htmlFor='offerNotes' className='font-bold'>Edit Zendesk Ticket</label>
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
          className='text-neutral-900 px-2 py-1 rounded-lg'
          placeholder={originalTicket}
        />
      <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>

  )
}
